import type Core from "./Core";
/**
 * Walks the dependency graph to invalidate state-variable values and
 * propagate freshness changes:
 *
 *  - `markStateVariableAndUpstreamDependentsStale` is the entry point
 *    when a value has actually changed; it sweeps the upstream graph,
 *    flips fresh→stale, queues renderer updates, and detects answers
 *    that should auto-submit
 *  - `lookUpCurrentFreshness` and `processMarkStale` consult and update
 *    each visited variable's freshness predicate (the array-aware
 *    `getCurrentFreshness` / `markStale` callbacks set up by the
 *    initializer)
 *  - `markUpstreamDependentsStale` does the recursive traversal
 *  - `createFromArrayEntry` materializes an array-entry state variable
 *    on first use (it lives here because it's only triggered while
 *    resolving an upstream dependent)
 *
 * Holds a back-reference to Core to read `_components`,
 * `componentInfoObjects`, `dependencies`, `flags`, `updateInfo`,
 * `rendererVariablesByComponentType`, and to dispatch through the other
 * extracted managers (initializer, child matcher, renderer-instruction
 * builder, auto-submit, evaluator).
 */
export class StalenessPropagator {
    core: Core;

    constructor({ core }: { core: Core }) {
        this.core = core;
    }

    async createFromArrayEntry({
        stateVariable,
        component,
        initializeOnly = false,
    }) {
        if (!component.arrayEntryPrefixes) {
            throw Error(
                `Unknown state variable ${stateVariable} of ${component.componentIdx}`,
            );
        }

        let arrayEntryPrefixesLongestToShortest = Object.keys(
            component.arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        // check if stateVariable begins when an arrayEntry
        for (let arrayEntryPrefix of arrayEntryPrefixesLongestToShortest) {
            if (
                stateVariable.substring(0, arrayEntryPrefix.length) ===
                arrayEntryPrefix
                // && stateVariable.length > arrayEntryPrefix.length
            ) {
                let arrayVariableName =
                    component.arrayEntryPrefixes[arrayEntryPrefix];
                let arrayStateVarObj = component.state[arrayVariableName];
                let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
                    arrayEntryPrefix,
                    varEnding: stateVariable.substring(arrayEntryPrefix.length),
                    numDimensions: arrayStateVarObj.numDimensions,
                });

                if (arrayKeys.length > 0) {
                    // found a reference to an arrayEntry that hasn't been created yet
                    // create this arrayEntry
                    await this.core.initializeStateVariable({
                        component,
                        stateVariable,
                        arrayStateVariable: arrayVariableName,
                        arrayEntryPrefix,
                    });

                    if (initializeOnly) {
                        return;
                    }

                    let allStateVariablesAffected = [stateVariable];
                    // create an additional array entry state variables
                    // specified as additional state variables defined
                    if (
                        component.state[stateVariable]
                            .additionalStateVariablesDefined
                    ) {
                        allStateVariablesAffected.push(
                            ...component.state[stateVariable]
                                .additionalStateVariablesDefined,
                        );
                        for (let additionalVar of component.state[stateVariable]
                            .additionalStateVariablesDefined) {
                            if (!component.state[additionalVar]) {
                                await this.createFromArrayEntry({
                                    stateVariable: additionalVar,
                                    component,
                                    initializeOnly: true,
                                });
                            }
                        }
                    }

                    await this.core.dependencies.setUpStateVariableDependencies(
                        {
                            component,
                            stateVariable,
                            allStateVariablesAffected,
                        },
                    );

                    let newStateVariablesToResolve = [];

                    for (let varName of allStateVariablesAffected) {
                        this.core.dependencies.checkForCircularDependency({
                            componentIdx: component.componentIdx,
                            varName,
                        });

                        newStateVariablesToResolve.push(varName);
                    }

                    await this.core.dependencies.resolveStateVariablesIfReady({
                        component,
                        stateVariables: newStateVariablesToResolve,
                    });

                    return;
                }
            }
        }

        throw Error(
            `Unknown state variable ${stateVariable} of ${component.componentIdx}`,
        );
    }

    async markDescendantsToUpdateRenderers(component) {
        if (component.constructor.renderChildren) {
            let indicesToRender =
                await this.core.returnActiveChildrenIndicesToRender(component);
            for (let ind of indicesToRender) {
                let child = component.activeChildren[ind];
                this.core.updateInfo.componentsToUpdateRenderers.add(
                    child.componentIdx,
                );
                await this.markDescendantsToUpdateRenderers(child);
            }
        }
    }

    async markStateVariableAndUpstreamDependentsStale({ component, varName }) {
        // console.log(`mark state variable ${varName} of ${component.componentIdx} and updeps stale`)

        if (
            varName in
            this.core.rendererVariablesByComponentType[component.componentType]
        ) {
            this.core.updateInfo.componentsToUpdateRenderers.add(
                component.componentIdx,
            );
        }

        const allStateVariablesAffectedObj: Record<string, any> = {
            [varName]: component.state[varName],
        };
        if (component.state[varName].additionalStateVariablesDefined) {
            component.state[varName].additionalStateVariablesDefined.forEach(
                (x: string) =>
                    (allStateVariablesAffectedObj[x] = component.state[x]),
            );
        }

        await this._processStaleVisit({
            component,
            varName,
            allStateVariablesAffectedObj,
        });
    }

    async lookUpCurrentFreshness({
        component,
        varName,
        allStateVariablesAffectedObj,
    }) {
        let stateVarObj = component.state[varName];

        if (!stateVarObj.getCurrentFreshness) {
            return;
        }

        let freshnessInfo = stateVarObj.freshnessInfo;

        const { arrayKeys, arraySize } = await this._getArrayKeysAndSize(
            stateVarObj,
            component,
        );

        let result = stateVarObj.getCurrentFreshness({
            freshnessInfo,
            arrayKeys,
            arraySize,
        });

        this._remapArrayEntryFreshness(result, allStateVariablesAffectedObj);

        // console.log(`result of lookUpCurrentFreshness of ${varName} of ${component.componentIdx}`)
        // console.log(JSON.parse(JSON.stringify(result)))

        return result;
    }

    async processMarkStale({
        component,
        varName,
        allStateVariablesAffectedObj,
    }) {
        // if the stateVariable varName (or its array state variable)
        // has a markStale function, then run that function,
        // giving it arguments with information about what changed

        // markStale may change the freshnessInfo for varName (or its array state variable)
        // and will return an object with attributes
        // - fresh: if the variable is to be considered completely fresh,
        //   indicating the mark stale process should not recurse
        // - partiallyFresh: if the variable is partially fresh,
        //   indicating the mark stale process should recurse,
        //   but the variable should be marked to allow later mark stale
        //   processes that involve the variable to process the variable again
        // - other attributes that not processed in this function but returned

        let stateVarObj = component.state[varName];

        if (!stateVarObj.markStale || !stateVarObj.initiallyResolved) {
            let fresh: Record<string, boolean> = {};
            Object.keys(allStateVariablesAffectedObj).forEach(
                (x) => (fresh[x] = false),
            );
            return { fresh };
        }

        let changes: Record<string, any> = {};
        let downDeps =
            this.core.dependencies.downstreamDependencies[
                component.componentIdx
            ][varName];

        for (let dependencyName in downDeps) {
            let dep = downDeps[dependencyName];
            let depChanges: Record<string, any> = {};
            let foundDepChange = false;
            if (dep.componentIdentityChanged) {
                depChanges.componentIdentityChanged = true;
                foundDepChange = true;
            }
            if (dep.componentIdentitiesChanged) {
                depChanges.componentIdentitiesChanged = true;
                foundDepChange = true;
            }
            if (dep.valuesChanged) {
                depChanges.valuesChanged = dep.valuesChanged;
                foundDepChange = true;
            }
            if (foundDepChange) {
                changes[dependencyName] = depChanges;
            }
        }

        let freshnessInfo = stateVarObj.freshnessInfo;

        const { arrayKeys, arraySize } = await this._getArrayKeysAndSize(
            stateVarObj,
            component,
        );

        let result = stateVarObj.markStale({
            freshnessInfo,
            changes,
            arrayKeys,
            arraySize,
        });

        // console.log(`result of mark stale`, deepClone(result))

        this._remapArrayEntryFreshness(result, allStateVariablesAffectedObj);

        // console.log(`result of process mark stale of ${varName} of ${component.componentIdx}`)
        // console.log(JSON.parse(JSON.stringify(result)))

        return result;
    }

    async markUpstreamDependentsStale({ component, varName }) {
        // Recursively mark every upstream dependency of component/varName as stale
        // If a state variable is already stale (has a getter in place)
        // then don't recurse
        // Before marking a stateVariable as stale, run markStale function, if it exists
        // Record additional information about the staleness from result of markStale,
        // and recurse only if markStale indicates variable is actually stale

        let componentIdx = component.componentIdx;

        // console.log(`marking upstream of ${varName} of ${componentIdx} as stale`);

        let upstream =
            this.core.dependencies.upstreamDependencies[componentIdx][varName];

        let freshnessInfo;

        if (component.state[varName]) {
            freshnessInfo = component.state[varName].freshnessInfo;
        }

        if (upstream) {
            for (let upDep of upstream) {
                // TODO: remove all these error checks to speed up process
                // once we're confident bugs have been removed?

                if (upDep.onlyToSetInInverseDefinition) {
                    continue;
                }

                let foundVarChange = false;

                if (upDep.markStale) {
                    await upDep.markStale();
                }

                if (upDep.downstreamComponentIndices) {
                    // this particular upstream dependency has multiple downstream components
                    // must find which one of those components correspond to current component

                    let componentInd =
                        upDep.downstreamComponentIndices.indexOf(componentIdx);
                    if (componentInd === -1) {
                        // presumably component was deleted
                        continue;
                    }

                    if (upDep.mappedDownstreamVariableNamesByComponent) {
                        // if have multiple components, there must be multiple variables
                        // ensure that varName is one of them
                        let varInd =
                            upDep.mappedDownstreamVariableNamesByComponent[
                                componentInd
                            ].indexOf(varName);
                        if (varInd === -1) {
                            throw Error(
                                `something went wrong as ${varName} not a downstreamVariable of ${upDep.dependencyName}`,
                            );
                        }

                        // records that component (index componentInd) and varName have changed
                        if (!upDep.valuesChanged) {
                            upDep.valuesChanged = [];
                        }
                        if (!upDep.valuesChanged[componentInd]) {
                            upDep.valuesChanged[componentInd] = {};
                        }
                        if (!upDep.valuesChanged[componentInd][varName]) {
                            upDep.valuesChanged[componentInd][varName] = {};
                        }
                        upDep.valuesChanged[componentInd][
                            varName
                        ].potentialChange = true;

                        // add any additional information about the stalename of component/varName
                        if (freshnessInfo) {
                            upDep.valuesChanged[componentInd][
                                varName
                            ].freshnessInfo = freshnessInfo;
                            // = new Proxy(freshnessInfo, readOnlyProxyHandler);
                        }

                        foundVarChange = true;
                    } else if (
                        varName === upDep.downstreamVariableNameIfNoVariables
                    ) {
                        // no original downstream variable names
                        // but matched the placeholder
                        // We just mark upDep as changed

                        if (!upDep.valuesChanged) {
                            upDep.valuesChanged = {
                                [upDep.downstreamVariableNameIfNoVariables]: {},
                            };
                        }

                        upDep.componentIdentityChanged = true;

                        upDep.valuesChanged[
                            upDep.downstreamVariableNameIfNoVariables
                        ].potentialChange = true;

                        foundVarChange = true;
                    }
                }

                if (foundVarChange) {
                    const upDepComponent =
                        this.core._components[upDep.upstreamComponentIdx];

                    for (const upstreamVar of upDep.upstreamVariableNames) {
                        if (
                            upstreamVar in
                            this.core.rendererVariablesByComponentType[
                                upDepComponent.componentType
                            ]
                        ) {
                            this.core.updateInfo.componentsToUpdateRenderers.add(
                                upDep.upstreamComponentIdx,
                            );
                            break;
                        }
                    }

                    const upVarName = upDep.upstreamVariableNames[0];

                    const allStateVariablesAffectedObj: Record<string, any> =
                        {};
                    upDep.upstreamVariableNames.forEach(
                        (x: string) =>
                            (allStateVariablesAffectedObj[x] =
                                upDepComponent.state[x]),
                    );

                    // NOTE: previously the inline action-chaining bag was
                    // keyed by `upDep.componentIdx` (undefined — dep objects
                    // only carry `upstreamComponentIdx`), so every chain
                    // entry from this branch had been routed to a single
                    // `"undefined"` bucket. The helper keys by
                    // `component.componentIdx`, which is `upDepComponent`'s
                    // here, so chain entries now land on the correct
                    // upstream component. See CORE_REFACTOR_DEFERRED.md.
                    await this._processStaleVisit({
                        component: upDepComponent,
                        varName: upVarName,
                        allStateVariablesAffectedObj,
                    });
                }
            }
        }
    }

    // evaluatedDeferredChildStateVariables(component) {
    //   for (let child of component.activeChildren) {
    //     if (child.componentType === "string") {
    //       for (let varName in child.state) {
    //         if (child.state[varName].deferred) {
    //           let evaluateSoNoLongerDeferred = child.state[varName].value;
    //         }
    //       }
    //     }
    //   }
    // }

    /**
     * Pull the read-only `arrayKeys` and `arraySize` snapshot needed by
     * `getCurrentFreshness` / `markStale`. We can't evaluate state variables
     * mid-mark-stale, so we read the last calculated `_arrayKeys` and the
     * `arraySize` state variable's `_previousValue` (or its current value if
     * that variable was itself fresh).
     */
    async _getArrayKeysAndSize(
        stateVarObj: any,
        component: any,
    ): Promise<{
        arrayKeys: any[] | undefined;
        arraySize: any[] | undefined;
    }> {
        let arrayKeys: any[] | undefined;
        let arraySize: any[] | undefined;

        if (stateVarObj.isArrayEntry) {
            arrayKeys = stateVarObj._arrayKeys;
        }

        if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
            const arraySizeStateVar =
                component.state[stateVarObj.arraySizeStateVariable];
            arraySize = arraySizeStateVar._previousValue;
            const varWasFresh = !(
                Object.getOwnPropertyDescriptor(arraySizeStateVar, "value")
                    ?.get || arraySizeStateVar.immutable
            );
            if (varWasFresh) {
                arraySize = await arraySizeStateVar.value;
            }

            if (!Array.isArray(arraySize)) {
                arraySize = [];
            }
        }

        return { arrayKeys, arraySize };
    }

    /**
     * Rewrite the `fresh` / `partiallyFresh` keys returned by
     * `getCurrentFreshness` or `markStale` so that an array-state-variable
     * reading is reinterpreted as the freshness of a specific
     * `arrayEntry` listed in `allStateVariablesAffectedObj`. The array's own
     * key is removed once its value has been moved onto the entry.
     */
    _remapArrayEntryFreshness(
        result: any,
        allStateVariablesAffectedObj: Record<string, any>,
    ) {
        if (result.partiallyFresh) {
            for (const vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    const arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    result.partiallyFresh[vName] =
                        result.partiallyFresh[arrayName];
                    delete result.partiallyFresh[arrayName];
                }
            }
        }

        if (result.fresh) {
            for (const vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    const arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    if (arrayName in result.fresh) {
                        result.fresh[vName] = result.fresh[arrayName];
                        delete result.fresh[arrayName];
                    }
                }
            }
        }
    }

    /**
     * Stash `stateVarObj`'s current value into `_previousValue` (cloning if
     * it's an array) and reinstall the lazy `value` getter that pulls
     * through `core.getStateVariableValue`. Together these mark the variable
     * as stale: the next `await stateVarObj.value` will recompute, while
     * `_previousValue` is preserved for change-detection.
     */
    async _replaceWithStaleGetter(
        stateVarObj: any,
        component: any,
        vName: string,
    ) {
        // save old value
        stateVarObj._previousValue = await stateVarObj.value;
        if (Array.isArray(stateVarObj._previousValue)) {
            stateVarObj._previousValue = [...stateVarObj._previousValue];
        }
        // mark stale by putting the getter back in place to compute a new
        // value next time it is requested
        delete stateVarObj.value;
        const getStateVar = this.core.getStateVariableValue;
        Object.defineProperty(stateVarObj, "value", {
            get: () => getStateVar({ component, stateVariable: vName }),
            configurable: true,
        });
    }

    /**
     * Visit `component` for stale-marking against `varName` plus every
     * other state variable in `allStateVariablesAffectedObj`. Walks the
     * freshness lookup, dispatches the markStale side effects
     * (`updateReplacements` / `updateRenderedChildren` /
     * `updateActionChaining` / `updateDependencies` / auto-submit), reinstalls
     * the lazy stale getter on every previously-fresh variable, and recurses
     * to upstream dependents when freshness has actually decreased.
     *
     * Both call sites pre-build `allStateVariablesAffectedObj` from the
     * variable's `additionalStateVariablesDefined` (standalone) or from
     * `upDep.upstreamVariableNames` (upstream-walk loop) before invoking.
     * The standalone caller additionally fans the renderer-update marker
     * for the single `varName`; the upstream caller iterates its multi-var
     * dependency. Those parts stay at the call sites.
     */
    async _processStaleVisit({
        component,
        varName,
        allStateVariablesAffectedObj,
    }: {
        component: any;
        varName: string;
        allStateVariablesAffectedObj: Record<string, any>;
    }) {
        const currentFreshnessInfo = await this.lookUpCurrentFreshness({
            component,
            varName,
            allStateVariablesAffectedObj,
        });
        const previouslyFreshVars: string[] = [];
        const previouslyEffectivelyFresh: string[] = [];
        let sumPreviouslyPartiallyFresh = 0;

        for (const vName in allStateVariablesAffectedObj) {
            const stateVarObj = allStateVariablesAffectedObj[vName];
            // if don't have a getter set, this indicates that, before this markStale function,
            // a state variable was fresh.
            if (
                !(
                    Object.getOwnPropertyDescriptor(stateVarObj, "value")
                        ?.get || stateVarObj.immutable
                )
            ) {
                previouslyFreshVars.push(vName);
            } else if (currentFreshnessInfo) {
                if (
                    currentFreshnessInfo.fresh &&
                    currentFreshnessInfo.fresh[vName]
                ) {
                    previouslyEffectivelyFresh.push(vName);
                } else if (
                    currentFreshnessInfo.partiallyFresh &&
                    currentFreshnessInfo.partiallyFresh[vName]
                ) {
                    sumPreviouslyPartiallyFresh +=
                        currentFreshnessInfo.partiallyFresh[vName];
                }
            }
        }

        previouslyEffectivelyFresh.push(...previouslyFreshVars);

        const aVarWasFreshOrPartiallyFresh =
            previouslyEffectivelyFresh.length > 0 ||
            sumPreviouslyPartiallyFresh > 0;

        const varsChanged: Record<string, boolean> = {};
        for (const vName in allStateVariablesAffectedObj) {
            varsChanged[vName] = true;
        }

        let freshnessDecreased = false;

        if (aVarWasFreshOrPartiallyFresh) {
            const result = await this.processMarkStale({
                component,
                varName,
                allStateVariablesAffectedObj,
            });

            if (result.fresh) {
                for (const vName in result.fresh) {
                    if (result.fresh[vName]) {
                        delete varsChanged[vName];
                    }
                }
            }

            let sumNewPartiallyFresh = 0;
            for (const vName in allStateVariablesAffectedObj) {
                if (
                    previouslyEffectivelyFresh.includes(vName) &&
                    !(result.fresh && result.fresh[vName])
                ) {
                    freshnessDecreased = true;
                    break;
                }
                if (result.partiallyFresh && result.partiallyFresh[vName]) {
                    sumNewPartiallyFresh += result.partiallyFresh[vName];
                }
            }

            if (sumNewPartiallyFresh < sumPreviouslyPartiallyFresh) {
                freshnessDecreased = true;
            }

            if (result.updateReplacements) {
                this.core.updateInfo.compositesToUpdateReplacements.add(
                    component.componentIdx,
                );
            }

            if (result.updateParentRenderedChildren) {
                // find ancestor that isn't a composite and mark it to update children to render
                for (const ancestorObj of component.ancestors) {
                    if (
                        !this.core.componentInfoObjects.allComponentClasses._composite.isPrototypeOf(
                            ancestorObj.componentCase,
                        )
                    ) {
                        // found non-composite ancestor
                        if (ancestorObj.componentClass.renderChildren) {
                            this.core.componentsWithChangedChildrenToRender.add(
                                ancestorObj.componentIdx,
                            );
                        }
                        break;
                    }
                }
            }

            if (result.updateRenderedChildren) {
                this.core.componentsWithChangedChildrenToRender.add(
                    component.componentIdx,
                );
            }

            if (result.updateDescendantRenderers) {
                await this.markDescendantsToUpdateRenderers(component);
            }

            if (result.updateActionChaining) {
                let chainObj =
                    this.core.updateInfo.componentsToUpdateActionChaining[
                        component.componentIdx
                    ];
                if (!chainObj) {
                    chainObj =
                        this.core.updateInfo.componentsToUpdateActionChaining[
                            component.componentIdx
                        ] = [];
                }
                for (const vName in allStateVariablesAffectedObj) {
                    if (!chainObj.includes(vName)) {
                        chainObj.push(vName);
                    }
                }
            }

            if (result.updateDependencies) {
                for (const vName of result.updateDependencies) {
                    component.state[vName].needDependenciesUpdated = true;
                }
            }

            if (
                this.core.flags.autoSubmit &&
                result.answerCreditPotentiallyChanged
            ) {
                this.core.recordAnswerToAutoSubmit(component.componentIdx);
            }
        }

        for (const vName in varsChanged) {
            const stateVarObj = allStateVariablesAffectedObj[vName];

            // delete recursive dependency values, if they exist
            delete stateVarObj.recursiveDependencyValues;

            if (previouslyFreshVars.includes(vName)) {
                await this._replaceWithStaleGetter(
                    stateVarObj,
                    component,
                    vName,
                );
            }
        }

        // we recurse on upstream dependents
        if (freshnessDecreased) {
            for (const vName in varsChanged) {
                await this.markUpstreamDependentsStale({
                    component,
                    varName: vName,
                });
            }
        }
    }
}
