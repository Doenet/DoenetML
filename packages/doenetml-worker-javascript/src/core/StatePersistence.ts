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
     * The reader's own work, out of everything `cumulativeStateVariableChanges`
     * holds.
     *
     * That bag also carries every essential value an ordinary definition
     * computed, because the reader's first interaction anywhere flushes the
     * document-wide `essentialValuesSavedInDefinition` into it. Those values
     * are not the reader's, and not worth persisting: they are recomputed
     * identically on a fresh load of the same document under the same variant,
     * which is what the definition would do anyway. Left in, they meant a page
     * of exercises paid for every exercise as soon as the reader touched any
     * one of them (Doenet/DoenetML#1940).
     *
     * They stay in the in-memory bag — a partial write to an array merges into
     * whatever is recorded there, and the definition path is what puts the
     * `mergeObject` base in place — so the filter is applied here, on the way
     * out, where both of `performUpdate`'s passes have already run.
     *
     * Stated as "drop what is known to be only a definition's" rather than
     * "keep what is known to be the reader's", so that an entry arriving by a
     * route this bookkeeping does not know about is saved rather than silently
     * dropped.
     *
     * Dropped for a second reason: an entry that holds nothing but a
     * component's mirror of the state of another component it shadows. See
     * `_isNonPropShadow`.
     *
     * `__`-prefixed keys are reserved sentinels rather than components' entries
     * (`__componentNeedingUpdateValue`), and are always carried.
     */
    _readerStateToSave(): Record<string, any> {
        const cumulative = this.core.cumulativeStateVariableChanges;
        const toSave: Record<string, any> = {};
        for (const stateId in cumulative) {
            if (stateId.startsWith("__")) {
                toSave[stateId] = cumulative[stateId];
                continue;
            }
            // Optional, and deliberately so: a `Core` always has both sets,
            // but a stand-in driving this class directly need not, and the
            // answer when they are missing should be to save the entry.
            const onlyADefinitionsWork =
                this.core.definitionSetStateIds?.has(stateId) &&
                !this.core.readerTouchedStateIds?.has(stateId);
            if (onlyADefinitionsWork || this._isNonPropShadow(stateId)) {
                continue;
            }
            toSave[stateId] = cumulative[stateId];
        }
        return toSave;
    }

    /**
     * Whether everything recorded against `stateId` is a mirror of what is
     * recorded against another component, and so already saved under that
     * component's id.
     *
     * The component has to shadow another wholesale — a plain copy, or a
     * composite's replacement of what it copies — and *every* variable in its
     * entry has to be one the essential-value writer keeps in sync with the
     * component it shadows (`_isMirroredFromShadowedComponent`).
     *
     * A reader's write ends up recorded against the target either way, by one
     * of two routes, and which one it takes depends on the variable:
     *
     * - Where the variable they act on is a shadowed one — a copied
     *   `<mathInput>`'s `value` and `immediateValue` — its inverse is
     *   redirected to the target (`shadowInverseDefinition`), and the
     *   essential values the target's own inverse then sets are mirrored back
     *   down over `shadowedBy`.
     * - Where it is not — a dragged copy of a `<point>` has no shadowed
     *   variables at all, and `Point.js` declares no `shadowVariable` — the
     *   write sets an essential value on the shadow itself, and
     *   `EssentialValueWriter` walks up `shadows` to the base component and
     *   records it *there* before mirroring back down
     *   (`processNewStateVariableValues`, the `else` branch of the
     *   `doNotShadowEssential || shadowVariable` test).
     *
     * The second route is the one most of what this rule drops takes, and its
     * condition is what `_isMirroredFromShadowedComponent` tests: the walk-up
     * happens for exactly the variables that test selects. So every variable
     * under the shadow's id is recorded under the target's id too, with the
     * same value. The shadow's entry is often a subset of the target's rather
     * than a copy of it — a copied `<mathInput>` records seven variables under
     * its source and three of those seven under the copy — and it is the
     * target's record that is saved.
     *
     * Persisting the duplicate is worse than redundant. The two entries are
     * restored independently, and nothing makes the order in which they land
     * agree with the order in which a composite hands its replacements out. A
     * composite that *recreates* its replacements on every change hides this,
     * because `DeletionEngine` drops the shadow's entry along with the
     * component; a composite that keeps them — which is the whole point of
     * Doenet/DoenetML#1947, and what Doenet/DoenetML#1949 does for `<sort>` —
     * keeps the stale duplicate too, and it is applied on top of the value
     * restored to the source. A reader's answer comes back on the wrong
     * element of a sorted list.
     *
     * Two kinds of copy are deliberately *not* selected:
     *
     * - A **prop** shadow (`<math extend="$P.x" />`). The writer's recursion
     *   generally skips these, so a prop shadow's essential values can be its
     *   own rather than a mirror of its target's, and dropping them could lose
     *   the reader's work. The test here is the one
     *   `calculatePrimitiveChildChanges` uses;
     *   `calculateEssentialVariableChanges` is one case wider, following an
     *   *implicit* prop shadow of a component whose
     *   `implicitPropReturnsSameType` is set — that one is a duplicate too,
     *   and is kept anyway rather than widening the rule for a few bytes. No
     *   document has been found in which this clause is what keeps an entry;
     *   the prop shadows that record anything record
     *   `doNotShadowEssential` variables, which the per-variable check keeps
     *   regardless. It is carried because the writer's recursion carries it.
     * - An **unlinked** copy (`<point copy="$A" />`), which carries
     *   `unlinkedCopySource` and no `shadows` at all: nothing propagates
     *   between it and its source in either direction, so its state is its
     *   own. It falls outside this predicate by construction rather than by a
     *   clause here.
     *
     * An **adapter** is not a shadow either. It is linked to what it adapts by
     * a separate `adapter` dependency and keeps its own essential values — a
     * `<boolean>` shown in a `<graph>` through a `<text>` is dragged by its
     * `anchor`, which belongs to the adapter and to nothing else.
     *
     * Unresolvable ids are kept, in the same fail-safe direction as the rest of
     * this filter: an entry whose component is gone cannot be shown to be a
     * duplicate, so it is saved.
     */
    _isNonPropShadow(stateId: string): boolean {
        const componentIdx = this.core.componentIdxByStateId?.[stateId];
        if (componentIdx === undefined) {
            return false;
        }
        const component = this.core._components?.[componentIdx];
        if (
            component?.shadows === undefined ||
            component.shadows.propVariable !== undefined
        ) {
            return false;
        }
        const entry = this.core.cumulativeStateVariableChanges[stateId];
        if (entry === undefined) {
            return false;
        }
        return Object.keys(entry).every((varName) =>
            this._isMirroredFromShadowedComponent(component, varName),
        );
    }

    /**
     * Whether `varName`'s essential value on a component that shadows another
     * is kept in sync with the component it shadows, rather than being the
     * shadow's own.
     *
     * Shadowing a component wholesale does not shadow all of its state:
     * `createReferenceShadowStateVariableDefinitions` turns only the
     * `shadowVariable`/`isShadow` variables into shadows of the target's, and
     * `EssentialValueWriter` mirrors an essential write down over `shadowedBy`
     * only for the variables it does *not* skip. It skips exactly two kinds,
     * and for both the shadow's value is its own and the only copy of it:
     *
     * - `doNotShadowEssential` — `<hint>`'s `open`, `<choice>`'s `submitted`
     *   and `hasBeenSubmitted`, `<award>`'s `awarded`, `disabled`/`fixed` on
     *   every component. A `<choice>` inside a `<shuffle>` or a `<sort>` is
     *   the sharpest case: the shuffle's replacement is the choice's
     *   *primary shadow*, the source's own `submitted` is defined from it, and
     *   the source's inverse definition refuses to run (`Choice.js`), so the
     *   replacement holds the only record that the reader submitted it.
     * - `shadowVariable` — written on the shadow only by a definition, since
     *   an update's write to one is redirected to the target instead.
     *
     * A `__def_primitive_*` key is not a state variable but a primitive
     * defining child's value, which `calculatePrimitiveChildChanges` mirrors
     * into every non-prop shadow unconditionally.
     *
     * Any other key that does not name a state variable on the component is
     * treated as not mirrored, so the entry is saved. Both writers of the
     * cumulative bag key it by state-variable name — `UpdateExecutor` merges
     * from `newStateVariableValues` and from `essentialValuesSavedInDefinition`,
     * and both are built that way — so this is a guard against a route that
     * does not exist today rather than a case with a name. The failure mode of
     * a bookkeeping slip should not be losing a reader's work.
     */
    _isMirroredFromShadowedComponent(component: any, varName: string): boolean {
        if (varName.startsWith("__def_primitive_")) {
            return true;
        }
        const stateVarObj = component.state?.[varName];
        if (stateVarObj === undefined) {
            return false;
        }
        return !(
            stateVarObj.doNotShadowEssential || stateVarObj.shadowVariable
        );
    }

    /**
     * Build the serialized document-state payload — the shape
     * `reportScoreAndState` delivers to hosts and `DocViewer`'s
     * `initialState` accepts back.
     */
    buildDocStatePayload(onSubmission = false) {
        const core = this.core;

        const coreStateString = JSON.stringify(
            this._readerStateToSave(),
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
                // Inside the payload, not beside it: a host is told to store
                // this blob opaquely and hand it back unread, so a sibling
                // field on the message would not survive the round trip. It is
                // the only thing that tells a payload written by an older
                // version from a current one, and without it a 0.8 core would
                // apply 0.7's keys to components they no longer denote.
                data_format_version,
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

        // Claim the save, or stand down. Everything below writes the reader's
        // work somewhere — the pair a report is built from, and IndexedDB —
        // and a save that has been overtaken while it resolved its score would
        // put that work back a step in both. The claim comes before the local
        // write, not after: `idb_set` is itself an await, so a check on the
        // far side of it would let an older save land in IndexedDB and only
        // then discover it should not have.
        //
        // A claim is only good until the next await, though, so it is taken
        // again after the local write below. Nothing else here yields: the
        // store beneath this is synchronous, and so is the report, up to and
        // including `_reportStateToMainRealm`.
        if (!this._claimSave(sequence)) {
            await this._standDownSupersededSave(overrideThrottle, onSubmission);
            return;
        }

        // Claim and store together, with nothing awaited in between, so the
        // stored pair always belongs to the save holding the claim.
        if (core.flags.allowSaveState) {
            this.docStateToBeSavedToDatabase = payload;
            this.scoreToBeSavedToDatabase = score;

            // mark presence of changes
            // so that next call to saveChangesToDatabase will save changes
            this.changesToBeSaved = true;
        }

        if (core.flags.allowLocalState) {
            // Saves that still hold their claim reach here in ticket order,
            // and IndexedDB runs overlapping read-write transactions in the
            // order they were created, so the newest work is what is left in
            // the store.
            await idb_set(
                `${core.activityId}|${core.docId}|${core.attemptNumber}|${core.cid}`,
                {
                    data_format_version,
                    coreState: coreStateString,
                    rendererState: rendererStateString,
                    coreInfo: core.coreInfoString,
                },
            );

            // Writing took a turn, and a newer save can have claimed and
            // stored its own pair during it. The pair below is that save's
            // now, so reporting it as though it were this one's would put a
            // submission's report out unmarked.
            if (!this._claimSave(sequence)) {
                await this._standDownSupersededSave(
                    overrideThrottle,
                    onSubmission,
                );
                return;
            }
        }

        if (!core.flags.allowSaveState) {
            return;
        }

        // if not currently in throttle, save changes to database
        await this.saveChangesToDatabase(overrideThrottle);
    }

    /**
     * Whether this save is still the newest to have got this far, taking the
     * claim if so. A claim is only good until the next await, so a save that
     * yields after taking one has to take it again on the far side.
     */
    _claimSave(sequence: number): boolean {
        if (sequence < this._storedSequence) {
            return false;
        }
        this._storedSequence = sequence;
        return true;
    }

    /**
     * Give up on a save that a later one overtook — while it resolved its
     * score, or while it wrote local state — without giving up what only
     * *this* save knew.
     *
     * The work itself is not lost: the save that overtook it was built later,
     * so the pair now stored holds at least as much. What does not survive the
     * hand-off is why this save was made. A submission's save says a
     * submission happened and overrides the 60-second throttle so the host
     * hears about it now; an ordinary save that overtook it does neither, and
     * simply returning here would leave a graded answer sitting behind the
     * throttle as an unreported mirror.
     */
    async _standDownSupersededSave(
        overrideThrottle: boolean,
        onSubmission: boolean,
    ): Promise<void> {
        if (!this.docStateToBeSavedToDatabase) {
            // `reset()` was what overtook it: the document this save belongs
            // to is gone, and there is no pair left to speak for.
            return;
        }
        if (onSubmission) {
            this.docStateToBeSavedToDatabase.onSubmission = true;
        }
        if (!overrideThrottle && !onSubmission) {
            // Nothing this save knew is missing from the pair that replaced
            // it, and the save that stored it has already driven the report.
            return;
        }
        this.changesToBeSaved = true;
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
