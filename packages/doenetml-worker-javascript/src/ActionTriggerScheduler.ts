import type Core from "./Core";
/**
 * Tracks state-variable-driven action triggers and the chained-action
 * graph. Each cycle, `processStateVariableTriggers` polls registered
 * trigger variables; `triggerChainedActions` walks the chained-action
 * graph after a state mutation and dispatches the downstream actions.
 *
 * Owns:
 *  - `stateVariableChangeTriggers`: per-component, per-state-variable
 *    "fire this action when the value changes" registrations
 *  - `actionsChangedToActions`: source-id → array of follow-up actions
 *  - `originsOfActionsChangedToActions`: bookkeeping that lets us find
 *    and unregister chained actions when their declaring state variable
 *    re-resolves to a different target list
 *
 * Holds a back-reference to Core to read `_components` and `updateInfo`
 * and to dispatch via `performAction` and `updateAllChangedRenderers`.
 */
export class ActionTriggerScheduler {
    core: Core;
    stateVariableChangeTriggers: Record<
        number,
        Record<string, { action: string; previousValue?: any }>
    >;
    actionsChangedToActions: Record<string, any[]>;
    originsOfActionsChangedToActions: Record<number, Record<string, any[]>>;

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.stateVariableChangeTriggers = {};
        this.actionsChangedToActions = {};
        this.originsOfActionsChangedToActions = {};
    }

    /**
     * Clear all per-document trigger and chain registrations. Called from
     * `Core.generateDast` so state from any previous run does not leak in.
     */
    reset(): void {
        this.stateVariableChangeTriggers = {};
        this.actionsChangedToActions = {};
        this.originsOfActionsChangedToActions = {};
    }

    /**
     * Poll every registered trigger variable for a value change since the
     * last poll, and dispatch the trigger's action if so. Renderer state
     * is normally updated by the caller; pass
     * `updateRenderersIfTriggered: true` to push a renderer update inline
     * after any action fires.
     *
     * TODO: this scans every registered trigger each tick. We could
     * narrow to components that actually changed by intersecting with
     * `componentsToUpdateRenderers`, but that set excludes non-rendered
     * components that may still carry triggers.
     */
    async processStateVariableTriggers(
        updateRenderersIfTriggered: boolean = false,
    ): Promise<void> {
        let triggeredAction = false;

        for (const componentIdxStr in this.stateVariableChangeTriggers) {
            const componentIdx = Number(componentIdxStr);
            let component = this.core._components[componentIdx];
            for (let stateVariable in this.stateVariableChangeTriggers[
                componentIdx
            ]) {
                let triggerInstructions =
                    this.stateVariableChangeTriggers[componentIdx][
                        stateVariable
                    ];

                let value = await component.state[stateVariable].value;

                if (value !== triggerInstructions.previousValue) {
                    let previousValue = triggerInstructions.previousValue;
                    triggerInstructions.previousValue = value;
                    let action = component.actions[triggerInstructions.action];
                    if (action) {
                        await this.core.performAction({
                            componentIdx,
                            actionName: triggerInstructions.action,
                            args: {
                                stateValues: { [stateVariable]: value },
                                previousValues: {
                                    [stateVariable]: previousValue,
                                },
                                skipRendererUpdate: true,
                            },
                        });
                        triggeredAction = true;
                    }
                }
            }
        }

        if (triggeredAction && updateRenderersIfTriggered) {
            await this.core.updateAllChangedRenderers();
        }
    }

    /**
     * Queue every `mustEvaluate` state variable on `componentIdx` into
     * `updateInfo.stateVariablesToEvaluate`, so that a later flush forces
     * them to compute even if nothing read them.
     */
    recordStateVariablesMustEvaluate(componentIdx: number): void {
        let comp = this.core._components[componentIdx];

        for (let vName in comp.state) {
            if (comp.state[vName].mustEvaluate) {
                this.core.updateInfo.stateVariablesToEvaluate.push({
                    componentIdx,
                    stateVariable: vName,
                });
            }
        }
    }

    /**
     * Re-sync the chained-action graph for `component` after the value of
     * one of its `chainActionOnActionOfStateVariableTargets` state
     * variables changed. Computes the diff between the previously
     * registered targets and the new ones: register newly added targets
     * in `actionsChangedToActions`, drop targets that are no longer
     * present, and update the per-component bookkeeping in
     * `originsOfActionsChangedToActions`.
     */
    async checkForActionChaining({
        component,
        stateVariables,
    }: {
        component: any;
        stateVariables?: string[];
    }): Promise<void> {
        if (!component) {
            return;
        }

        if (!stateVariables) {
            stateVariables = Object.keys(component.state);
        }

        for (let varName of stateVariables) {
            let stateVarObj = component.state[varName];

            if (stateVarObj.chainActionOnActionOfStateVariableTargets) {
                let chainInfo =
                    stateVarObj.chainActionOnActionOfStateVariableTargets;
                let targetIds = await stateVarObj.value;

                let originObj =
                    this.originsOfActionsChangedToActions[
                        component.componentIdx
                    ];

                let previousIds: any[] | undefined;
                if (originObj) {
                    previousIds = originObj[varName];
                }

                if (!previousIds) {
                    previousIds = [];
                }

                let newTargets: any[] = [];

                if (Array.isArray(targetIds)) {
                    newTargets = [...targetIds];
                    for (let id of newTargets) {
                        let indPrev = previousIds.indexOf(id);

                        if (indPrev === -1) {
                            // found a component/action that wasn't previously chained
                            let componentActionsChained =
                                this.actionsChangedToActions[id];
                            if (!componentActionsChained) {
                                componentActionsChained =
                                    this.actionsChangedToActions[id] = [];
                            }

                            componentActionsChained.push({
                                componentIdx: component.componentIdx,
                                actionName: chainInfo.triggeredAction,
                                stateVariableDefiningChain: varName,
                                args: {},
                            });
                        } else {
                            // target was already chained
                            // remove from previous names to indicate it should still be chained
                            previousIds.splice(indPrev, 1);
                        }
                    }
                }

                // if any ids are left in previousIds,
                // then they should no longer be chained
                for (let idToNoLongerChain of previousIds) {
                    let componentActionsChained =
                        this.actionsChangedToActions[idToNoLongerChain];
                    if (componentActionsChained) {
                        let newComponentActionsChained: any[] = [];

                        for (let chainedInfo of componentActionsChained) {
                            if (
                                chainedInfo.componentIdx !==
                                    component.componentIdx ||
                                chainedInfo.stateVariableDefiningChain !==
                                    varName
                            ) {
                                newComponentActionsChained.push(chainedInfo);
                            }
                        }

                        this.actionsChangedToActions[idToNoLongerChain] =
                            newComponentActionsChained;
                    }
                }

                if (newTargets.length > 0) {
                    if (!originObj) {
                        originObj = this.originsOfActionsChangedToActions[
                            component.componentIdx
                        ] = {};
                    }
                    originObj[varName] = newTargets;
                } else if (originObj) {
                    delete originObj[varName];

                    if (Object.keys(originObj).length === 0) {
                        delete this.originsOfActionsChangedToActions[
                            component.componentIdx
                        ];
                    }
                }
            }
        }
    }

    /**
     * After an action runs on `componentIdx`, fire any actions chained to
     * it (and to any composite that this component shadows via a bare
     * reference like `$P` — but not via `extend`/`copy`, since those
     * don't propagate authored intent). Re-syncs the chain graph first
     * so `componentsToUpdateActionChaining` doesn't miss any pending
     * registration changes.
     */
    async triggerChainedActions({
        componentIdx,
        triggeringAction,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }: {
        componentIdx: number;
        triggeringAction?: string;
        actionId?: string;
        sourceInformation?: any;
        skipRendererUpdate?: boolean;
    }): Promise<void> {
        for (const cIdxStr in this.core.updateInfo
            .componentsToUpdateActionChaining) {
            await this.checkForActionChaining({
                component: this.core._components[Number(cIdxStr)],
                stateVariables:
                    this.core.updateInfo.componentsToUpdateActionChaining[
                        cIdxStr
                    ],
            });
        }

        this.core.updateInfo.componentsToUpdateActionChaining = {};

        let actionsToChain: any[] = [];

        let cIdx = componentIdx;

        while (true) {
            let comp = this.core._components[cIdx];
            let id: string | number = cIdx;

            if (triggeringAction) {
                id = id + "|" + triggeringAction;
            }

            if (this.actionsChangedToActions[id]) {
                actionsToChain.push(...this.actionsChangedToActions[id]);
            }

            if (comp?.shadows) {
                let composite =
                    this.core._components[comp.shadows.compositeIdx];
                if (composite.attributes.createComponentOfType != null) {
                    break;
                }

                // We propagate to shadows if the component was copied with a bare references such as `$P`
                // but not if was copied via extend/copy attribute, such as `<point extend="$P" />
                // Rationale:
                // If we include $P in a graph,
                // then triggerWhenObjectsClicked="$P" and triggerWhenObjectsFocused="$P"
                // will be triggered by that reference, which is what authors would expect.
                // Another use case is defining an <updateValue name="uv">,
                // along with other triggered actions using triggerWith="$uv",
                // inside a <setup> and then including a $uv
                // where we want the button to be.

                cIdx = comp.shadows.componentIdx;
            } else {
                break;
            }
        }

        for (let chainedActionInstructions of actionsToChain) {
            chainedActionInstructions = { ...chainedActionInstructions };
            if (chainedActionInstructions.args) {
                chainedActionInstructions.args = {
                    ...chainedActionInstructions.args,
                };
            } else {
                chainedActionInstructions.args = {};
            }
            chainedActionInstructions.args.skipRendererUpdate = true;
            await this.core.performAction(chainedActionInstructions);
        }

        if (!skipRendererUpdate) {
            await this.core.updateAllChangedRenderers(
                sourceInformation,
                actionId,
            );
        }
    }
}
