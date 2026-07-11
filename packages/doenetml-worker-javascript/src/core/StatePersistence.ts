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

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.saveStateToDBTimerId = null;
        this.saveDocStateTimeoutID = null;
        this.docStateToBeSavedToDatabase = null;
        this.changesToBeSaved = false;
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
     * through the normal save pipeline (so persistence hosts stay current),
     * then build and return the current document state payload — regardless
     * of the save flags — plus the current score. Once the caller holds the
     * returned payload, tearing the document down loses nothing: `state` is
     * exactly the shape `DocViewer`'s `initialState` accepts.
     *
     * Returns `null` before document generation has produced `coreInfoString`
     * (there is no meaningful state to hand out yet).
     */
    async flushState(): Promise<{ state: unknown; score: unknown } | null> {
        if (!this.core.coreInfoString) {
            return null;
        }
        await this.saveImmediately();
        const { payload } = this.buildDocStatePayload();
        return {
            state: payload,
            score: await this.core.document.stateValues.creditAchieved,
        };
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

        this.core.reportScoreAndStateCallback({
            state: { ...this.docStateToBeSavedToDatabase },
            score: await this.core.document.stateValues.creditAchieved,
        });

        return;
    }
}
