import {
    serializedComponentsReplacer,
    data_format_version,
    type TimerHandle,
} from "@doenet/utils";
import { set as idb_set } from "idb-keyval";
import { reportTimerError, TimerLabels } from "../utils/timerErrors";
import type Core from "../Core";

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
     * The credit that goes with `docStateToBeSavedToDatabase`, captured by the
     * same `saveState` that built it. A report needs both halves, and resolving
     * the score at report time would let them come from either side of a
     * concurrent save — a reader's newest work tagged with the credit from
     * before it, say, which a page hide would then hand to the host as their
     * record. Captured together, they cannot disagree.
     */
    scoreToBeSavedToDatabase: number;
    /**
     * Ticket dispenser for `saveState`, and the ticket belonging to the pair
     * currently stored above. Saves overlap — a submission's save is
     * deliberately fire-and-forget, the debounced save runs off a timer, and
     * every save awaits (`creditAchieved`, and `idb_set` when local state is
     * on) between building its pair and storing it — so an older save can
     * reach the store last. Comparing tickets is what keeps it from putting
     * its pair over a newer one. Monotonic for the life of the instance:
     * `reset()` takes a ticket of its own rather than starting over, which is
     * what invalidates a save still in flight from the document being replaced.
     */
    _saveSequence: number;
    _storedSequence: number;

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.saveStateToDBTimerId = null;
        this.saveDocStateTimeoutID = null;
        this.docStateToBeSavedToDatabase = null;
        this.changesToBeSaved = false;
        this.scoreToBeSavedToDatabase = 0;
        this._saveSequence = 0;
        this._storedSequence = 0;
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
        this.scoreToBeSavedToDatabase = 0;
        this.changesToBeSaved = false;
        // Every ticket issued so far now counts as superseded, so a save
        // still resolving its score for the previous document cannot store
        // that document's work against the new one.
        this._storedSequence = ++this._saveSequence;
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

        const sequence = ++this._saveSequence;

        const { payload, coreStateString, rendererStateString } =
            this.buildDocStatePayload(onSubmission);

        // The credit that goes with this payload, resolved here so the pair
        // travels together from here on. Skipped when there is no host to
        // report to, since nothing then reads it.
        const score = core.flags.allowSaveState
            ? await core.document.stateValues.creditAchieved
            : 0;

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

        if (sequence < this._storedSequence) {
            // A save that started later has already stored its pair. This one
            // was built before that and would put the reader's work back a
            // step; the save that overtook it has already marked the change
            // and driven `saveChangesToDatabase`, so there is nothing left
            // here to do.
            return;
        }
        this._storedSequence = sequence;
        this.docStateToBeSavedToDatabase = payload;
        this.scoreToBeSavedToDatabase = score;

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
     * The pair it sends was captured together by the `saveState` that built
     * it, so this needs no `await` and cannot interleave with anything: the
     * score always belongs to the payload beside it, and a page hide is never
     * handed a reader's state under a credit from the wrong side of it.
     */
    _reportStateToMainRealm(pending: boolean): void {
        const payload = this.docStateToBeSavedToDatabase;
        if (!payload) {
            // `reset()` ran between the save and this report: the document
            // this payload belonged to is gone, and reporting `{}` over the
            // host's record would be worse than reporting nothing.
            return;
        }
        this.core.reportScoreAndStateCallback({
            state: { ...payload },
            score: this.scoreToBeSavedToDatabase,
            pending,
        });
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
                this._reportStateToMainRealm(true);
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

        this._reportStateToMainRealm(false);
    }
}
