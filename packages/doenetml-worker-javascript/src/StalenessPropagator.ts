import { deepClone } from "@doenet/utils";

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
    core: any;

    constructor({ core }: { core: any }) {
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

                    let arrayStateVariable =
                        component.arrayEntryPrefixes[arrayEntryPrefix];

                    await this.core.initializeStateVariable({
                        component,
                        stateVariable,
                        arrayStateVariable,
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

        let allStateVariablesAffectedObj = {
            [varName]: component.state[varName],
        };
        if (component.state[varName].additionalStateVariablesDefined) {
            component.state[varName].additionalStateVariablesDefined.forEach(
                (x) => (allStateVariablesAffectedObj[x] = component.state[x]),
            );
        }

        let currentFreshnessInfo = await this.lookUpCurrentFreshness({
            component,
            varName,
            allStateVariablesAffectedObj,
        });
        let previouslyFreshVars = [];
        let previouslyEffectivelyFresh = [];
        let sumPreviouslyPartiallyFresh = 0;

        for (let vName in allStateVariablesAffectedObj) {
            let stateVarObj = allStateVariablesAffectedObj[vName];
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

        let aVarWasFreshOrPartiallyFresh =
            previouslyEffectivelyFresh.length > 0 ||
            sumPreviouslyPartiallyFresh > 0;

        let varsChanged: Record<string, boolean> = {};
        for (let vName in allStateVariablesAffectedObj) {
            varsChanged[vName] = true;
        }

        let freshnessDecreased = false;

        if (aVarWasFreshOrPartiallyFresh) {
            let result = await this.processMarkStale({
                component,
                varName,
                allStateVariablesAffectedObj,
            });

            if (result.fresh) {
                for (let vName in result.fresh) {
                    if (result.fresh[vName]) {
                        delete varsChanged[vName];
                    }
                }
            }

            let sumNewPartiallyFresh = 0;
            for (let vName in allStateVariablesAffectedObj) {
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
                for (let ancestorObj of component.ancestors) {
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
                for (let vName in allStateVariablesAffectedObj) {
                    if (!chainObj.includes(vName)) {
                        chainObj.push(vName);
                    }
                }
            }

            if (result.updateDependencies) {
                for (let vName of result.updateDependencies) {
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

        for (let vName in varsChanged) {
            let stateVarObj = allStateVariablesAffectedObj[vName];

            // delete recursive dependency values, if they exist
            delete stateVarObj.recursiveDependencyValues;

            if (previouslyFreshVars.includes(vName)) {
                // save old value
                // mark stale by putting getter back in place to get a new value next time it is requested
                stateVarObj._previousValue = await stateVarObj.value;
                if (Array.isArray(stateVarObj._previousValue)) {
                    stateVarObj._previousValue = [
                        ...stateVarObj._previousValue,
                    ];
                }
                delete stateVarObj.value;
                let getStateVar = this.core.getStateVariableValue;
                Object.defineProperty(stateVarObj, "value", {
                    get: () => getStateVar({ component, stateVariable: vName }),
                    configurable: true,
                });
            }
        }

        // we recurse on upstream dependents
        if (freshnessDecreased) {
            for (let vName in varsChanged) {
                await this.markUpstreamDependentsStale({
                    component,
                    varName: vName,
                });
            }
        }
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

        let arrayKeys, arraySize;

        if (stateVarObj.isArrayEntry) {
            // have to use last calculated value of arrayKeys
            // because can't evaluate state variable in middle of marking stale

            // arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);
            arrayKeys = stateVarObj._arrayKeys;
        }

        if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
            // have to use old value of arraySize
            // because can't evaluate state variable in middle of marking stale

            let arraySizeStateVar =
                component.state[stateVarObj.arraySizeStateVariable];
            arraySize = arraySizeStateVar._previousValue;
            let varWasFresh = !(
                Object.getOwnPropertyDescriptor(arraySizeStateVar, "value")
                    ?.get || arraySizeStateVar.immutable
            );
            if (varWasFresh) {
                arraySize = await arraySizeStateVar.value;
            }

            if (Array.isArray(arraySize)) {
                // arraySize = new Proxy(arraySize, readOnlyProxyHandler);
            } else {
                arraySize = [];
            }
        }

        let result = stateVarObj.getCurrentFreshness({
            freshnessInfo,
            arrayKeys,
            arraySize,
        });

        if (result.partiallyFresh) {
            // if have array entry, then intrepret partiallyfresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    result.partiallyFresh[vName] =
                        result.partiallyFresh[arrayName];
                    delete result.partiallyFresh[arrayName];
                }
            }
        }

        if (result.fresh) {
            // if have array entry, then intrepret fresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    if (arrayName in result.fresh) {
                        result.fresh[vName] = result.fresh[arrayName];
                        delete result.fresh[arrayName];
                    }
                }
            }
        }

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

        let arrayKeys, arraySize;

        if (stateVarObj.isArrayEntry) {
            // have to use last calculated value of arrayKeys
            // because can't evaluate state variable in middle of marking stale

            // arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);
            arrayKeys = stateVarObj._arrayKeys;
        }

        if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
            // have to use old value of arraySize
            // because can't evaluate state variable in middle of marking stale

            let arraySizeStateVar =
                component.state[stateVarObj.arraySizeStateVariable];
            arraySize = arraySizeStateVar._previousValue;
            let varWasFresh = !(
                Object.getOwnPropertyDescriptor(arraySizeStateVar, "value")
                    ?.get || arraySizeStateVar.immutable
            );
            if (varWasFresh) {
                arraySize = await arraySizeStateVar.value;
            }

            if (Array.isArray(arraySize)) {
                // arraySize = new Proxy(arraySize, readOnlyProxyHandler);
            } else {
                arraySize = [];
            }
        }

        let result = stateVarObj.markStale({
            freshnessInfo,
            changes,
            arrayKeys,
            arraySize,
        });

        // console.log(`result of mark stale`, deepClone(result))

        if (result.partiallyFresh) {
            // if have array entry, then intrepret partiallyfresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    result.partiallyFresh[vName] =
                        result.partiallyFresh[arrayName];
                    delete result.partiallyFresh[arrayName];
                }
            }
        }

        if (result.fresh) {
            // if have array entry, then intrepret fresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    if (arrayName in result.fresh) {
                        result.fresh[vName] = result.fresh[arrayName];
                        delete result.fresh[arrayName];
                    }
                }
            }
        }

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
        let getStateVar = this.core.getStateVariableValue;

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
                    for (let varName of upDep.upstreamVariableNames) {
                        if (
                            varName in
                            this.core.rendererVariablesByComponentType[
                                this.core._components[
                                    upDep.upstreamComponentIdx
                                ].componentType
                            ]
                        ) {
                            this.core.updateInfo.componentsToUpdateRenderers.add(
                                upDep.upstreamComponentIdx,
                            );
                            break;
                        }
                    }

                    let upVarName = upDep.upstreamVariableNames[0];
                    let upDepComponent =
                        this.core._components[upDep.upstreamComponentIdx];
                    // let upVar = upDepComponent.state[upVarName];

                    let allStateVariablesAffectedObj: Record<string, any> = {};
                    upDep.upstreamVariableNames.forEach(
                        (x) =>
                            (allStateVariablesAffectedObj[x] =
                                upDepComponent.state[x]),
                    );

                    let currentFreshnessInfo =
                        await this.lookUpCurrentFreshness({
                            component: upDepComponent,
                            varName: upVarName,
                            allStateVariablesAffectedObj,
                        });

                    let previouslyFreshVars = [];
                    let previouslyEffectivelyFresh = [];
                    let sumPreviouslyPartiallyFresh = 0;
                    for (let vName in allStateVariablesAffectedObj) {
                        let stateVarObj = allStateVariablesAffectedObj[vName];
                        // if don't have a getter set, this indicates that, before this markStale function,
                        // a state variable was fresh.
                        if (
                            !(
                                Object.getOwnPropertyDescriptor(
                                    stateVarObj,
                                    "value",
                                )?.get || stateVarObj.immutable
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

                    let aVarWasFreshOrPartiallyFresh =
                        previouslyEffectivelyFresh.length > 0 ||
                        sumPreviouslyPartiallyFresh > 0;

                    let varsChanged: Record<string, boolean> = {};
                    for (let vName in allStateVariablesAffectedObj) {
                        varsChanged[vName] = true;
                    }

                    let freshnessDecreased = false;

                    if (aVarWasFreshOrPartiallyFresh) {
                        let result = await this.processMarkStale({
                            component: upDepComponent,
                            varName: upVarName,
                            allStateVariablesAffectedObj,
                        });

                        if (result.fresh) {
                            for (let vName in result.fresh) {
                                if (result.fresh[vName]) {
                                    delete varsChanged[vName];
                                }
                            }
                        }

                        let sumNewPartiallyFresh = 0;
                        for (let vName in allStateVariablesAffectedObj) {
                            if (
                                previouslyEffectivelyFresh.includes(vName) &&
                                !(result.fresh && result.fresh[vName])
                            ) {
                                freshnessDecreased = true;
                                break;
                            }
                            if (
                                result.partiallyFresh &&
                                result.partiallyFresh[vName]
                            ) {
                                sumNewPartiallyFresh +=
                                    result.partiallyFresh[vName];
                            }
                        }

                        if (
                            sumNewPartiallyFresh < sumPreviouslyPartiallyFresh
                        ) {
                            freshnessDecreased = true;
                        }

                        if (result.updateReplacements) {
                            this.core.updateInfo.compositesToUpdateReplacements.add(
                                upDep.upstreamComponentIdx,
                            );
                        }

                        if (result.updateParentRenderedChildren) {
                            // find ancestor that isn't a composite and mark it to update children to render
                            for (let ancestorObj of upDepComponent.ancestors) {
                                if (
                                    !this.core.componentInfoObjects.allComponentClasses._composite.isPrototypeOf(
                                        ancestorObj.componentCase,
                                    )
                                ) {
                                    // found non-composite ancestor
                                    if (
                                        ancestorObj.componentClass
                                            .renderChildren
                                    ) {
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
                                upDepComponent.componentIdx,
                            );
                        }

                        if (result.updateDescendantRenderers) {
                            await this.markDescendantsToUpdateRenderers(
                                upDepComponent,
                            );
                        }

                        if (result.updateActionChaining) {
                            let chainObj =
                                this.core.updateInfo
                                    .componentsToUpdateActionChaining[
                                    upDep.componentIdx
                                ];
                            if (!chainObj) {
                                chainObj =
                                    this.core.updateInfo.componentsToUpdateActionChaining[
                                        upDep.componentIdx
                                    ] = [];
                            }
                            for (let vName in allStateVariablesAffectedObj) {
                                if (!chainObj.includes(vName)) {
                                    chainObj.push(vName);
                                }
                            }
                        }

                        if (result.updateDependencies) {
                            for (let vName of result.updateDependencies) {
                                upDepComponent.state[
                                    vName
                                ].needDependenciesUpdated = true;
                            }
                        }

                        if (
                            this.core.flags.autoSubmit &&
                            result.answerCreditPotentiallyChanged
                        ) {
                            this.core.recordAnswerToAutoSubmit(
                                upDepComponent.componentIdx,
                            );
                        }
                    }

                    for (let vName in varsChanged) {
                        let stateVarObj = allStateVariablesAffectedObj[vName];

                        // delete recursive dependency values, if they exist
                        delete stateVarObj.recursiveDependencyValues;

                        if (previouslyFreshVars.includes(vName)) {
                            // save old value
                            // mark stale by putting getter back in place to get a new value next time it is requested
                            stateVarObj._previousValue =
                                await stateVarObj.value;
                            if (Array.isArray(stateVarObj._previousValue)) {
                                stateVarObj._previousValue = [
                                    ...stateVarObj._previousValue,
                                ];
                            }
                            delete stateVarObj.value;
                            Object.defineProperty(stateVarObj, "value", {
                                get: () =>
                                    getStateVar({
                                        component: upDepComponent,
                                        stateVariable: vName,
                                    }),
                                configurable: true,
                            });
                        }
                    }

                    // we recurse on upstream dependents
                    if (freshnessDecreased) {
                        for (let vName in varsChanged) {
                            await this.markUpstreamDependentsStale({
                                component: upDepComponent,
                                varName: vName,
                            });
                        }
                    }
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
}
