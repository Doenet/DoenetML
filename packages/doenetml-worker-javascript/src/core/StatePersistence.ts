import {
    serializedComponentsReplacer,
    data_format_version,
    type TimerHandle,
} from "@doenet/utils";
import { set as idb_set } from "idb-keyval";
import { reportTimerError, TimerLabels } from "../utils/timerErrors";
import type Core from "../Core";

/**
 * How many times a real report will resolve `creditAchieved` again after a
 * concurrent report lands while it is suspended — see
 * `StatePersistence._reportStateToMainRealm`.
 */
const MAX_REPORT_REREADS = 3;

/**
 * Owns the save-to-localStorage and save-to-database pipeline for a Core
 * instance, including throttle timers and the debounced save scheduler.
 *
 * Holds a back-reference to Core to read `cumulativeStateVariableChanges`,
 * `rendererState`, `flags`, `document`, the activity/doc/attempt IDs, and
 * `coreInfoString` (set by Core during `generateDast`), and to invoke
 * `reportScoreAndStateCallback`.
 *
 * This is purely the persistence I/O — the essential-value write engine
 * that produces `cumulativeStateVariableChanges` is a separate concern
 * (see `processNewStateVariableValues` in Core).
 */
export class StatePersistence {
    core: Core;
    saveStateToDBTimerId: TimerHandle;
    saveDocStateTimeoutID: TimerHandle;
    docStateToBeSavedToDatabase: any;
    changesToBeSaved: boolean;
    /**
     * Ticket dispenser for `_reportStateToMainRealm`, and the highest ticket
     * that has actually been handed to the main realm. Reports overlap — a
     * submission's save is deliberately fire-and-forget and the debounced save
     * runs off a timer, so two calls can be suspended on `creditAchieved` at
     * once — and the pair lets a mirror that lost that race be dropped rather
     * than delivered stale. Monotonic for the life of the instance; `reset()`
     * deliberately leaves them alone, so a call still in flight across a
     * regenerated document stays superseded.
     */
    _reportSequence: number;
    _lastReportedSequence: number;

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.saveStateToDBTimerId = null;
        this.saveDocStateTimeoutID = null;
        this.docStateToBeSavedToDatabase = null;
        this.changesToBeSaved = false;
        this._reportSequence = 0;
        this._lastReportedSequence = 0;
    }

    /**
     * Cancel any pending saves and clear the buffered payload. Called from
     * `Core.generateDast` so timers and state from a previous run do not
     * leak into the new document.
     */
    reset(): void {
        if (this.saveStateToDBTimerId !== null) {
            clearTimeout(this.saveStateToDBTimerId);
            this.saveStateToDBTimerId = null;
        }
        if (this.saveDocStateTimeoutID !== null) {
            clearTimeout(this.saveDocStateTimeoutID);
            this.saveDocStateTimeoutID = null;
        }
        this.docStateToBeSavedToDatabase = null;
        this.changesToBeSaved = false;
    }

    /**
     * Schedule a debounced `saveState` after `delayMs` milliseconds, replacing
     * any previously scheduled save.
     */
    scheduleSave(delayMs: number): void {
        if (this.saveDocStateTimeoutID !== null) {
            clearTimeout(this.saveDocStateTimeoutID);
        }
        this.saveDocStateTimeoutID = setTimeout(() => {
            this.saveState().catch(
                reportTimerError(TimerLabels.scheduledSaveState),
            );
        }, delayMs);
    }

    async saveImmediately(): Promise<void> {
        if (this.saveDocStateTimeoutID !== null) {
            // if in debounce to save doc to local storage
            // then immediate save to local storage
            // and override timeout to save to database
            clearTimeout(this.saveDocStateTimeoutID);
            this.saveDocStateTimeoutID = null;
            await this.saveState(true);
        } else {
            // else override timeout to save any pending changes to database
            await this.saveChangesToDatabase(true);
        }
    }

    /**
     * Build the serialized document-state payload — the shape
     * `reportScoreAndState` delivers to hosts and `DocViewer`'s
     * `initialState` accepts back.
     */
    buildDocStatePayload(onSubmission = false) {
        const core = this.core;

        const coreStateString = JSON.stringify(
            core.cumulativeStateVariableChanges,
            serializedComponentsReplacer,
        );
        let rendererStateString: string | null = null;

        if (core.flags.saveRendererState) {
            rendererStateString = JSON.stringify(
                core.rendererState,
                serializedComponentsReplacer,
            );
        }

        return {
            payload: {
                cid: core.cid,
                coreInfo: core.coreInfoString,
                coreState: coreStateString,
                rendererState: rendererStateString,
                initializeCounters: core.initializeCounters,
                docId: core.docId,
                attemptNumber: core.attemptNumber,
                activityId: core.activityId,
                onSubmission,
            },
            coreStateString,
            rendererStateString,
        };
    }

    async saveState(
        overrideThrottle = false,
        onSubmission = false,
    ): Promise<void> {
        this.saveDocStateTimeoutID = null;

        const core = this.core;

        if (!core.flags.allowSaveState && !core.flags.allowLocalState) {
            return;
        }

        const { payload, coreStateString, rendererStateString } =
            this.buildDocStatePayload(onSubmission);

        if (core.flags.allowLocalState) {
            await idb_set(
                `${core.activityId}|${core.docId}|${core.attemptNumber}|${core.cid}`,
                {
                    data_format_version,
                    coreState: coreStateString,
                    rendererState: rendererStateString,
                    coreInfo: core.coreInfoString,
                },
            );
        }

        if (!core.flags.allowSaveState) {
            return;
        }

        this.docStateToBeSavedToDatabase = payload;

        // mark presence of changes
        // so that next call to saveChangesToDatabase will save changes
        this.changesToBeSaved = true;

        // if not currently in throttle, save changes to database
        await this.saveChangesToDatabase(overrideThrottle);
    }

    /**
     * Flush-state-on-demand (Doenet/DoenetML#1440): push any pending changes
     * through the normal `reportScoreAndState` pipeline (via `saveImmediately`)
     * so a persistence host saves them right away — exactly as it does for a
     * routine autosave, with no knowledge that a flush occurred. Reports honor
     * the `allowSaveState`/`allowLocalState` flags, so nothing is emitted when
     * saving is off (there is no persistence host to receive it).
     *
     * Returns whether this viewer held any state: `false` before document
     * generation has produced `coreInfoString` (the viewer holds nothing
     * beyond what it was initialized with, so tearing it down loses nothing
     * either way).
     */
    async flushState(): Promise<boolean> {
        if (!this.core.coreInfoString) {
            return false;
        }
        await this.saveImmediately();
        return true;
    }

    /**
     * Hand the currently buffered database payload to the main realm through
     * `reportScoreAndStateCallback`.
     *
     * With `pending: true` this is a *mirror* of the payload the 60-second
     * throttle is holding back, not a report for the host to save
     * (Doenet/DoenetML#1726). A page can go away without the viewer
     * unmounting — the tab is closed, a new URL is typed, a backgrounded
     * mobile tab is discarded — and `pagehide` offers no budget for a Comlink
     * round-trip into this worker, so the payload has to already be over
     * there. `DocViewer` buffers a `pending` report rather than handing it to
     * the host, and delivers it as an ordinary report when the page hides.
     *
     * A mirror goes out on every throttled save, so it is never further behind
     * the screen than the one-second save debounce. Any real report that
     * follows (throttle expiry, submission, `SPLICE.flushState`, the
     * `saveImmediately` in `terminate`) carries the same or newer state and
     * supersedes it.
     *
     * Awaiting `creditAchieved` yields, so a concurrent save — a submission
     * overriding the throttle, say — can report in that gap, and the score and
     * the payload would then come from either side of it. Only one of the two
     * can be read last, so neither order is safe on its own: reading the
     * payload first risks putting a reader's older work over their newer, and
     * reading the score first risks tagging their newer work with the credit
     * they had before it. The payload is read last and the pairing is then
     * *checked* — `_lastReportedSequence` says whether anything reported while
     * this call was suspended — so a report only goes out when its two halves
     * describe the same moment.
     *
     * What a call that lost the race does about it depends on which kind it
     * is. A mirror is dropped: the report that overtook it is real, so the
     * main realm has that state already and there is nothing left to hold. A
     * real report is the one the host is waiting for and cannot be dropped, so
     * it resolves the score again — by then the value that goes with the
     * payload it will read — and tries once more.
     */
    async _reportStateToMainRealm(pending: boolean): Promise<void> {
        // Each pass re-reads a score a concurrent report has already made
        // stale, so a pass past the first needs a *further* report to have
        // landed in the microtask the re-read takes. Saves are throttled and
        // debounced, which makes a second pass unlikely and a third all but
        // unreachable; the cap is only here so this cannot spin.
        for (let attempt = 0; ; attempt++) {
            const sequence = ++this._reportSequence;
            const score = await this.core.document.stateValues.creditAchieved;
            const payload = this.docStateToBeSavedToDatabase;
            if (!payload) {
                // `reset()` cleared the buffer while the score resolved: the
                // document this payload belonged to is gone, and reporting
                // `{}` over the host's record would be worse than reporting
                // nothing.
                return;
            }

            if (sequence < this._lastReportedSequence) {
                if (pending) {
                    return;
                }
                if (attempt < MAX_REPORT_REREADS) {
                    continue;
                }
                // Out of re-reads. A real report reaching the host late with
                // a score that may trail its state still beats not reaching
                // the host at all, and the next report corrects it.
            }

            this._lastReportedSequence = Math.max(
                this._lastReportedSequence,
                sequence,
            );
            this.core.reportScoreAndStateCallback({
                state: { ...payload },
                score,
                pending,
            });
            return;
        }
    }

    async saveChangesToDatabase(overrideThrottle = false): Promise<void> {
        // throttle save to database at 60 seconds

        if (!this.changesToBeSaved) {
            return;
        }

        if (this.saveStateToDBTimerId !== null) {
            if (overrideThrottle) {
                clearTimeout(this.saveStateToDBTimerId);
            } else {
                // Held back by the throttle: mirror the payload into the main
                // realm so a page hide can still deliver it (#1726).
                await this._reportStateToMainRealm(true);
                return;
            }
        }

        this.changesToBeSaved = false;

        // check for changes again after 60 seconds
        this.saveStateToDBTimerId = setTimeout(() => {
            this.saveStateToDBTimerId = null;
            this.saveChangesToDatabase().catch(
                reportTimerError(TimerLabels.throttledSaveChanges),
            );
        }, 60000);

        await this._reportStateToMainRealm(false);
    }
}
