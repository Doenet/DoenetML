import type Core from "../Core";
import type { ComponentIdx } from "@doenet/utils";
import { addComponents } from "./ComponentBuilder";
import { deleteComponents } from "./DeletionEngine";
import { createNewComponentIndices } from "../utils/componentIndices";
import { reportTimerError, TimerLabels } from "../utils/timerErrors";

/**
 * Source-side metadata about *how* an update originated. Indexed by
 * `componentIdx` (string-coerced because that's what `for...in` yields);
 * each entry is a free-form bag of provenance attributes that flows
 * through to renderers via `sourceOfUpdate`.
 */
type SourceInformation = Record<string, any>;

/**
 * One entry in `performUpdate`'s `updateInstructions` array. The shape
 * varies by `updateType`; the explicit fields below are documentation
 * for the most common keys, while the `[k: string]: any` index signature
 * is what TypeScript actually checks against — necessary because the
 * historical call sites mix authored, interactive, and chained
 * instructions on the same array. A discriminated union per `updateType`
 * is deferred (see `CORE_REFACTOR_DEFERRED.md`).
 */
type UpdateInstruction = {
    updateType: string;
    componentIdx?: ComponentIdx;
    stateVariable?: string;
    value?: any;
    serializedComponents?: any;
    parentIdx?: ComponentIdx;
    componentIndices?: ComponentIdx[];
    componentNumber?: number;
    sourceDetails?: Record<string, any>;
    [k: string]: any;
};

type RecordEvent = Record<string, any>;
type Diagnostic = Record<string, any>;

type PerformActionArgs = {
    componentIdx?: ComponentIdx;
    actionName: string;
    args?: Record<string, any>;
    event?: RecordEvent;
    caseInsensitiveMatch?: boolean;
};

type PerformUpdateArgs = {
    updateInstructions: UpdateInstruction[];
    diagnostics?: Diagnostic[];
    actionId?: string;
    event?: RecordEvent;
    /**
     * When true, perform the update even if `core.flags.readOnly` is set.
     * Used by Core's own internal flows (e.g. theme set) where the caller
     * has decided the read-only flag does not apply.
     */
    overrideReadOnly?: boolean;
    /**
     * Skip the debounced state-persistence side effect. The update still
     * mutates state and updates renderers; only the call to
     * `statePersistence.scheduleSave` is suppressed. Used for theme
     * changes and other non-interactions.
     */
    doNotSave?: boolean;
    /**
     * Skip *both* renderer-update paths (the read-only mirror and the
     * post-update fan-out). Used when the caller will re-issue updates
     * imminently and renderer churn would be wasted.
     */
    canSkipUpdatingRenderer?: boolean;
    /**
     * Skip only the late `updateAllChangedRenderers` call at the end of
     * `performUpdate`, while still letting the early read-only path and
     * the components-to-update bookkeeping run. Callers that defer renderer
     * updates this way are responsible for issuing a later renderer update
     * (e.g. answer submission flushes via its trailing
     * `triggerChainedActions`, and `submitAllAnswers` flushes once on its
     * final `numSubmissions` update).
     */
    skipRendererUpdate?: boolean;
    sourceInformation?: SourceInformation;
};

/**
 * The orchestrators dequeued by `ProcessQueue`:
 *
 *  - `performAction` dispatches a component-defined action method
 *    (e.g. `submitAnswer`, `revealSection`), recording the event,
 *    queuing chained actions, and triggering renderer updates
 *  - `performUpdate` drives an authored or interactive state-variable
 *    update through `EssentialValueWriter.requestComponentChanges`,
 *    flushes follow-on composite-replacement / staleness work, and
 *    schedules the debounced `saveState`
 *
 * They call almost everyone — every Phase 1-4 manager — by going
 * through the back-reference to Core. Holds a back-reference for the
 * hot state and the other extracted managers.
 */
export class UpdateExecutor {
    core: Core;

    constructor({ core }: { core: Core }) {
        this.core = core;
    }

    /**
     * Run a component-defined action method (e.g. `submitAnswer`,
     * `revealSection`).
     *
     * Special-case branches handled before the main dispatch:
     *   - `actionName === "setTheme"` with no `componentIdx`: re-enters via
     *     `performUpdate` to set `document.theme`. The action mechanism is
     *     co-opted here because the document doesn't expose a real action
     *     surface, but theme is a UI-only state variable that the viewer
     *     needs to be able to set. `doNotSave` is always passed since theme
     *     is not user content.
     *   - Component missing + `actionName === "recordVisibilityChange"`
     *     with `args.isVisible === false`: a "component became hidden"
     *     event for a component that has already been deleted. Recorded
     *     directly via `requestRecordEvent` because there is no live
     *     component to dispatch through.
     *
     * Main path: look up `component.actions[actionName]` (with optional
     * case-insensitive fallback when `caseInsensitiveMatch` is set), record
     * the `event` if provided, and `await` the action. Returns
     * `{ actionId }` on success. If the component exists but the action
     * does not, a warning diagnostic is added and `{}` is returned.
     */
    async performAction({
        componentIdx,
        actionName,
        args,
        event,
        caseInsensitiveMatch,
    }: PerformActionArgs) {
        if (actionName === "setTheme" && componentIdx === undefined) {
            // For now, co-opting the action mechanism to let the viewer set the theme (dark mode) on document.
            // Don't have an actual action on document as don't want the ability for others to call it.
            // Theme doesn't affect the colors displayed, only the words in the styleDescriptions.
            await this.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.core.documentIdx,
                        stateVariable: "theme",
                        value: args!.theme,
                    },
                ],
                actionId: args!.actionId,
                doNotSave: true, // this isn't an interaction, so don't save doc state
            });

            return { actionId: args!.actionId };
        }

        let component = this.core._components[componentIdx!];
        if (component && component.actions) {
            let action = component.actions[actionName];
            if (!action && caseInsensitiveMatch) {
                let actionNameLower = actionName.toLowerCase();
                for (let aName in component.actions) {
                    if (aName.toLowerCase() === actionNameLower) {
                        action = component.actions[aName];
                        actionName = aName;
                        break;
                    }
                }
            }
            if (action) {
                if (event) {
                    this.core.requestRecordEvent(event);
                }
                if (!args) {
                    args = {};
                }
                await action(args);
                return { actionId: args.actionId };
            }
        }

        if (
            !component &&
            actionName === "recordVisibilityChange" &&
            args?.isVisible === false
        ) {
            // We have an action to record that a component is no longer visible
            // and the component has been deleted.
            // Record a visibility changed event
            // Note: don't know componentType, but componentType isn't preserved when summarize visibility events
            this.core.requestRecordEvent({
                verb: "visibilityChanged",
                object: {
                    componentIdx,
                },
                result: { isVisible: false },
            });
            return { actionId: args.actionId };
        }

        if (component) {
            this.core.addDiagnostic({
                type: "warning",
                message: `Cannot run action ${actionName} on component ${componentIdx}`,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
        }

        return {};
    }

    /**
     * Drive a batch of update instructions through the inverse-definition
     * pipeline, then surface the results to renderers and persistence.
     *
     * The instruction array is processed in order. Each instruction
     * dispatches by `updateType`:
     *   - `updateValue`: hand off to `requestComponentChanges`, accumulating
     *     `newStateVariableValues` for the post-loop flush.
     *   - `addComponents` / `deleteComponents`: structural changes that
     *     synchronously call `Core.addComponents` / `Core.deleteComponents`.
     *   - `executeUpdate`: flush the currently-accumulated
     *     `newStateVariableValues` immediately so subsequent inverse
     *     definitions can read the updated values.
     *   - `recordItemSubmission`: queue the instruction for the
     *     post-loop submission-event recording (and triggers an
     *     immediate save).
     *   - `setComponentNeedingUpdateValue` /
     *     `unsetComponentNeedingUpdateValue`: flag bookkeeping for
     *     downstream answer-submission detection.
     *
     * After the loop, `executeUpdateStateVariables` runs once more on
     * any leftover `newStateVariableValues`, then
     * `processStateVariableTriggers` and `updateAllChangedRenderers` run
     * conditionally based on the `skipRendererUpdate` /
     * `canSkipUpdatingRenderer` flags. Essential values saved during
     * definitions are merged into the cumulative changes log so they
     * persist on the next save.
     *
     * Persistence side effects:
     *   - Submission updates fire `saveState(true, true)` immediately
     *     (fire-and-forget; failures are logged but do not block).
     *   - Otherwise `statePersistence.scheduleSave(1000)` debounces a
     *     save unless `doNotSave` is set.
     */
    async performUpdate({
        updateInstructions,
        diagnostics,
        actionId,
        event,
        overrideReadOnly = false,
        doNotSave = false,
        canSkipUpdatingRenderer = false,
        skipRendererUpdate = false,
        sourceInformation = {},
    }: PerformUpdateArgs) {
        if (diagnostics) {
            for (let diagnostic of diagnostics) {
                this.core.addDiagnostic(diagnostic);
            }
        }

        if (this.core.flags.readOnly && !overrideReadOnly) {
            if (!canSkipUpdatingRenderer) {
                for (let instruction of updateInstructions) {
                    this._recordSourceDetails(instruction, sourceInformation);
                }

                await this.core.updateRendererInstructions({
                    componentNamesToUpdate: updateInstructions
                        .map((x: UpdateInstruction) => x.componentIdx)
                        .filter((idx): idx is ComponentIdx => idx != undefined),
                    sourceOfUpdate: { sourceInformation },
                    actionId,
                });
            }

            return;
        }

        // Keyed by component-index string (the form `for...in` yields); the
        // inner record is keyed by state-variable name. Indices are coerced
        // to `Number` only when looking up the components array.
        let newStateVariableValues: Record<string, Record<string, any>> = {};
        let newStateVariableValuesProcessed: Record<
            string,
            Record<string, any>
        >[] = [];
        let workspace = {};
        let recordComponentSubmissions: any[] = [];

        for (let instruction of updateInstructions) {
            this._recordSourceDetails(instruction, sourceInformation);

            if (instruction.updateType === "updateValue") {
                await this.core.requestComponentChanges({
                    instruction,
                    workspace,
                    newStateVariableValues,
                });
            } else if (instruction.updateType === "addComponents") {
                const res = createNewComponentIndices(
                    instruction.serializedComponents,
                    this.core._components.length,
                );
                if (res.nComponents > this.core._components.length) {
                    this.core._components[res.nComponents - 1] = undefined;
                }
                await addComponents({
                    core: this.core,
                    serializedComponents: res.components,
                    parentIdx: instruction.parentIdx,
                });
            } else if (instruction.updateType === "deleteComponents") {
                if (instruction.componentIndices!.length > 0) {
                    let componentsToDelete = [];
                    for (let componentIdx of instruction.componentIndices!) {
                        let component = this.core._components[componentIdx];
                        if (component) {
                            componentsToDelete.push(component);
                        } else {
                            this.core.addDiagnostic({
                                type: "info",
                                message: `Cannot delete ${componentIdx} as it doesn't exist.`,
                            });
                        }
                    }

                    if (componentsToDelete.length > 0) {
                        await deleteComponents({
                            core: this.core,
                            components: componentsToDelete,
                        });
                    }
                }
            } else if (instruction.updateType === "executeUpdate") {
                // this should be used only if further updates depend on having all
                // state variables updated,
                // i.e., the subsequent inverse definitions use stateValues
                // in their calculations that need to be updated
                await this.core.executeUpdateStateVariables(
                    newStateVariableValues,
                );

                newStateVariableValuesProcessed.push(newStateVariableValues);
                newStateVariableValues = {};
            } else if (instruction.updateType === "recordItemSubmission") {
                recordComponentSubmissions.push(instruction);
            } else if (
                instruction.updateType === "setComponentNeedingUpdateValue"
            ) {
                this.core.cumulativeStateVariableChanges.__componentNeedingUpdateValue =
                    this.core._components[instruction.componentIdx!]!.stateId;
            } else if (
                instruction.updateType === "unsetComponentNeedingUpdateValue"
            ) {
                delete this.core.cumulativeStateVariableChanges
                    .__componentNeedingUpdateValue;
            }
        }

        await this.core.executeUpdateStateVariables(newStateVariableValues);

        newStateVariableValuesProcessed.push(newStateVariableValues);

        // always update the renderers from the update instructions themselves,
        // as even if changes were prevented, the renderers need to be given that information
        // so they can revert if the showed the changes before hearing back from core
        if (!canSkipUpdatingRenderer) {
            updateInstructions.forEach((comp) => {
                if (comp.componentIdx != undefined) {
                    this.core.updateInfo.componentsToUpdateRenderers.add(
                        comp.componentIdx,
                    );
                }
            });
        }

        await this.core.processStateVariableTriggers();

        if (!skipRendererUpdate) {
            await this.core.updateAllChangedRenderers(
                sourceInformation,
                actionId,
            );
        }

        if (recordComponentSubmissions.length > 0) {
            let componentsSubmitted = [
                ...new Set(
                    recordComponentSubmissions.map((x) => x.componentNumber),
                ),
            ];
            let componentCreditAchieved =
                await this.core.document.stateValues.componentCreditAchieved;

            if (event) {
                if (!event.context) {
                    event.context = {};
                }
                event.context.componentNumber = componentsSubmitted[0];
                event.context.componentCreditAchieved =
                    componentCreditAchieved[componentsSubmitted[0] - 1];

                // Just in case the code gets changed so that more than one component can be submitted at once,
                // record credit achieved for any additional components.
                if (componentsSubmitted.length > 1) {
                    event.context.additionalComponentCreditAchieved = {};
                    for (let componentNumber of componentsSubmitted) {
                        event.context.additionalComponentCreditAchieved[
                            componentNumber
                        ] = componentCreditAchieved[componentNumber - 1];
                    }
                }
                event.context.docCreditAchieved =
                    await this.core.document.stateValues.creditAchieved;
            }
        }

        // start with any essential values saved when calculating definitions
        if (
            Object.keys(this.core.essentialValuesSavedInDefinition).length > 0
        ) {
            for (const stateId in this.core.essentialValuesSavedInDefinition) {
                const componentIdx = this.core.componentIdxByStateId[stateId];
                let essentialState =
                    this.core._components[componentIdx]?.essentialState;
                if (essentialState) {
                    for (let varName in this.core
                        .essentialValuesSavedInDefinition[stateId]) {
                        if (essentialState[varName] !== undefined) {
                            this.core.essentialValueWriter.mergeIntoCumulative(
                                stateId,
                                varName,
                                essentialState[varName],
                            );
                        }
                    }
                }
            }
            this.core.essentialValuesSavedInDefinition = {};
        }

        if (!doNotSave) {
            // merge in new state variables set in update
            for (let newValuesProcessed of newStateVariableValuesProcessed) {
                for (const componentIdxStr in newValuesProcessed) {
                    const stateId =
                        this.core._components[Number(componentIdxStr)].stateId;
                    for (let varName in newValuesProcessed[componentIdxStr]) {
                        this.core.essentialValueWriter.mergeIntoCumulative(
                            stateId,
                            varName,
                            newValuesProcessed[componentIdxStr][varName],
                        );
                    }
                }
            }
        }

        if (recordComponentSubmissions.length > 0) {
            // Fire-and-forget: a submission save runs in parallel with the
            // rest of `performUpdate`; failures are logged but must not
            // block the caller.
            this.core
                .saveState(true, true)
                .catch(reportTimerError(TimerLabels.submissionSaveState));
        } else if (!doNotSave) {
            //Debounce the save to localstorage and then to DB with a throttle
            this.core.statePersistence.scheduleSave(1000);
        }

        // evaluate componentCreditAchieved so that will be fresh
        // and can detect changes when it is marked stale
        await this.core.document.stateValues.componentCreditAchieved;

        if (event) {
            this.core.requestRecordEvent(event);
        }
    }

    /**
     * Merge `instruction.sourceDetails` into the per-component bag inside
     * `sourceInformation`. No-op when `sourceDetails` is absent or when the
     * instruction has no `componentIdx` (e.g. `recordItemSubmission`
     * entries from `Answer.js`/`Pretzel.js`, which would otherwise create
     * a `sourceInformation["undefined"]` sentinel bucket). Used to forward
     * upstream-action provenance ("which input triggered this change?")
     * through the update pipeline.
     */
    _recordSourceDetails(
        instruction: any,
        sourceInformation: Record<string, any>,
    ) {
        if (
            instruction.componentIdx == undefined ||
            !instruction.sourceDetails
        ) {
            return;
        }

        let componentSourceInformation =
            sourceInformation[instruction.componentIdx];
        if (!componentSourceInformation) {
            componentSourceInformation = sourceInformation[
                instruction.componentIdx
            ] = {};
        }

        Object.assign(componentSourceInformation, instruction.sourceDetails);
    }
}
