import type { CoreBackref } from "./types/coreBackref";
import { removeFunctionsMathExpressionClass } from "./utils/math";
import { createNewComponentIndices } from "./utils/componentIndices";
import { reportTimerError, TimerLabels } from "./utils/timerErrors";

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
    core: CoreBackref;

    constructor({ core }: { core: CoreBackref }) {
        this.core = core;
    }

    async performAction({
        componentIdx,
        actionName,
        args,
        event,
        caseInsensitiveMatch,
    }) {
        if (actionName === "setTheme" && componentIdx === undefined) {
            // For now, co-opting the action mechanism to let the viewer set the theme (dark mode) on document.
            // Don't have an actual action on document as don't want the ability for others to call it.
            // Theme doesn't affect the colors displayed, only the words in the styleDescriptions.
            try {
                await this.performUpdate({
                    updateInstructions: [
                        {
                            updateType: "updateValue",
                            componentIdx: this.core.documentIdx,
                            stateVariable: "theme",
                            value: args.theme,
                        },
                    ],
                    actionId: args.actionId,
                    doNotSave: true, // this isn't an interaction, so don't save doc state
                });
            } catch (e) {
                console.error(e);
                throw e;
            }

            return { actionId: args.actionId };
        }

        let component = this.core._components[componentIdx];
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
                try {
                    await action(args);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
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
    }) {
        if (diagnostics) {
            for (let diagnostic of diagnostics) {
                this.core.addDiagnostic(diagnostic);
            }
        }

        if (this.core.flags.readOnly && !overrideReadOnly) {
            if (!canSkipUpdatingRenderer) {
                for (let instruction of updateInstructions) {
                    let componentSourceInformation =
                        sourceInformation[instruction.componentIdx];
                    if (!componentSourceInformation) {
                        componentSourceInformation = sourceInformation[
                            instruction.componentIdx
                        ] = {};
                    }

                    if (instruction.sourceDetails) {
                        Object.assign(
                            componentSourceInformation,
                            instruction.sourceDetails,
                        );
                    }
                }

                await this.core.updateRendererInstructions({
                    componentNamesToUpdate: updateInstructions.map(
                        (x) => x.componentIdx,
                    ),
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
            if (instruction.componentIdx != undefined) {
                let componentSourceInformation =
                    sourceInformation[instruction.componentIdx];
                if (!componentSourceInformation) {
                    componentSourceInformation = sourceInformation[
                        instruction.componentIdx
                    ] = {};
                }

                if (instruction.sourceDetails) {
                    Object.assign(
                        componentSourceInformation,
                        instruction.sourceDetails,
                    );
                }
            }

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
                await this.core.addComponents({
                    serializedComponents: res.components,
                    parentIdx: instruction.parentIdx,
                });
            } else if (instruction.updateType === "deleteComponents") {
                if (instruction.componentIndices.length > 0) {
                    let componentsToDelete = [];
                    for (let componentIdx of instruction.componentIndices) {
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
                        await this.core.deleteComponents({
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
                    this.core._components[instruction.componentIdx].stateId;
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

        if (!skipRendererUpdate || recordComponentSubmissions.length > 0) {
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
                    if (!this.core.cumulativeStateVariableChanges[stateId]) {
                        this.core.cumulativeStateVariableChanges[stateId] = {};
                    }
                    for (let varName in this.core
                        .essentialValuesSavedInDefinition[stateId]) {
                        if (essentialState[varName] !== undefined) {
                            let cumValues =
                                this.core.cumulativeStateVariableChanges[
                                    stateId
                                ][varName];
                            // if cumValues is an object with mergeObject = true,
                            // then merge attributes from essentialState into cumValues
                            if (
                                typeof cumValues === "object" &&
                                cumValues !== null &&
                                cumValues.mergeObject
                            ) {
                                Object.assign(
                                    cumValues,
                                    removeFunctionsMathExpressionClass(
                                        essentialState[varName],
                                    ),
                                );
                            } else {
                                this.core.cumulativeStateVariableChanges[
                                    stateId
                                ][varName] = removeFunctionsMathExpressionClass(
                                    essentialState[varName],
                                );
                            }
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
                    if (!this.core.cumulativeStateVariableChanges[stateId]) {
                        this.core.cumulativeStateVariableChanges[stateId] = {};
                    }
                    for (let varName in newValuesProcessed[componentIdxStr]) {
                        let cumValues =
                            this.core.cumulativeStateVariableChanges[stateId][
                                varName
                            ];
                        // if cumValues is an object with mergeObject = true,
                        // then merge attributes from newStateVariableValues into cumValues
                        if (
                            typeof cumValues === "object" &&
                            cumValues !== null &&
                            cumValues.mergeObject
                        ) {
                            Object.assign(
                                cumValues,
                                removeFunctionsMathExpressionClass(
                                    newValuesProcessed[componentIdxStr][
                                        varName
                                    ],
                                ),
                            );
                        } else {
                            this.core.cumulativeStateVariableChanges[stateId][
                                varName
                            ] = removeFunctionsMathExpressionClass(
                                newValuesProcessed[componentIdxStr][varName],
                            );
                        }
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
}
