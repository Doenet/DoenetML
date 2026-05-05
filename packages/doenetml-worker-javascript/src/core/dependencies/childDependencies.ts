// @ts-nocheck
// Concrete dependency subclasses extracted from the original
// `Dependencies.js`. Type checking is disabled file-wide because the
// classes inherit a dynamic field set from `Dependency` and were
// untyped JavaScript prior to the split.

import { Dependency } from "./Dependency";
import { gatherDescendants } from "../../utils/descendants";

export class ChildDependency extends Dependency {
    static dependencyType = "child";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.includeAllChildren = this.definition.includeAllChildren;
        this.childGroups = this.definition.childGroups;
        if (!this.includeAllChildren && !Array.isArray(this.childGroups)) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: childGroups must be an array`,
            );
        }

        if (this.definition.childIndices !== undefined) {
            this.childIndices = this.definition.childIndices.map((x) =>
                Number(x),
            );
        }

        this.skipComponentIndices = this.definition.skipComponentIndices;
        this.skipPlaceholders = this.definition.skipPlaceholders;

        this.proceedIfAllChildrenNotMatched =
            this.definition.proceedIfAllChildrenNotMatched;

        this.dontRecurseToShadows = this.definition.dontRecurseToShadows;
    }

    async determineDownstreamComponents() {
        // console.log(`determine downstream components of ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        if (this.downstreamPrimitives) {
            this.previousDownstreamPrimitives = [...this.downstreamPrimitives];
        } else {
            this.previousDownstreamPrimitives = [];
        }

        this.downstreamPrimitives = [];

        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
                    blockerType: "componentIdentity",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let childDependencies =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (!childDependencies) {
            childDependencies =
                this.dependencyHandler.updateTriggers.childDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!childDependencies.includes(this)) {
            childDependencies.push(this);
        }

        let activeChildrenIndices = this.includeAllChildren
            ? [...parent.activeChildren.keys()]
            : parent.returnMatchedChildIndices(this.childGroups);
        if (activeChildrenIndices === undefined) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: childGroups ${this.childGroups} does not exist.`,
            );
        }

        // if childIndices specified, filter out just those indices
        // Note: indices are relative to the selected ones
        // (not actual index in activeChildren)
        // so filter uses the i argument, not the x argument
        if (this.childIndices) {
            activeChildrenIndices = activeChildrenIndices.filter((x, i) =>
                this.childIndices.includes(i),
            );
        }

        if (!parent.childrenMatched && !this.proceedIfAllChildrenNotMatched) {
            let canProceedWithPlaceholders = false;

            if (parent.childrenMatchedWithPlaceholders) {
                if (this.skipPlaceholders) {
                    activeChildrenIndices = activeChildrenIndices.filter(
                        (x) =>
                            !parent.placeholderActiveChildrenIndices.includes(
                                x,
                            ),
                    );
                }

                if (
                    this.skipComponentIndices &&
                    this.originalDownstreamVariableNames.length === 0
                ) {
                    // if skipping componentIdx and there are no variable names,
                    // then only information to get is componentTypes of children,
                    // which one can do even with placeholders
                    canProceedWithPlaceholders = true;
                } else {
                    // if need to include component indices or variables,
                    // then we can proceed only if we aren't asking for any placeholder children

                    canProceedWithPlaceholders = activeChildrenIndices.every(
                        (x) =>
                            !parent.placeholderActiveChildrenIndices.includes(
                                x,
                            ),
                    );
                }
            }

            if (!canProceedWithPlaceholders) {
                let haveCompositesNotReady =
                    parent.unexpandedCompositesNotReady.length > 0;

                if (
                    !haveCompositesNotReady &&
                    parent.unexpandedCompositesReady.length > 0
                ) {
                    // could make progress just by expanding composites and
                    // then recalculating the downstream components,
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
                            componentIdxBlocked: this.upstreamComponentIdx,
                            typeBlocked: "recalculateDownstreamComponents",
                            stateVariableBlocked: varName,
                            dependencyBlocked: this.dependencyName,
                        });

                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.upstreamComponentIdx,
                            blockerType: "recalculateDownstreamComponents",
                            blockerStateVariable: varName,
                            blockerDependency: this.dependencyName,
                            componentIdxBlocked: this.upstreamComponentIdx,
                            typeBlocked: "stateVariable",
                            stateVariableBlocked: varName,
                        });
                    }

                    return {
                        success: false,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }

                if (haveCompositesNotReady) {
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
                            componentIdxBlocked: this.upstreamComponentIdx,
                            typeBlocked: "recalculateDownstreamComponents",
                            stateVariableBlocked: varName,
                            dependencyBlocked: this.dependencyName,
                        });

                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.upstreamComponentIdx,
                            blockerType: "recalculateDownstreamComponents",
                            blockerStateVariable: varName,
                            blockerDependency: this.dependencyName,
                            componentIdxBlocked: this.upstreamComponentIdx,
                            typeBlocked: "stateVariable",
                            stateVariableBlocked: varName,
                        });
                    }

                    // mark that child logic is blocked by
                    // the readyToExpandWhenResolved state variable of the composites not ready

                    // Note: since unresolved composites that don't have a component type
                    // will prevent child logic from being satisfied with placeholders
                    // (as they don't get turned into placeholders)
                    // add blockers just to them, if they exist
                    // (This prevents adding circular dependencies that could
                    // be avoided once child logic is resolved with placeholders)

                    let compositesBlockingWithComponentType = [];
                    let compositesBlockingWithoutComponentType = [];

                    for (let compositeNotReady of parent.unexpandedCompositesNotReady) {
                        if (parent.childrenMatchedWithPlaceholders) {
                            // if child logic is satisifed with placeholders,
                            // then we don't need to expand any composites
                            // that don't overlap with the active children indices we need
                            let inds =
                                parent
                                    .placeholderActiveChildrenIndicesByComposite[
                                    compositeNotReady
                                ];
                            if (
                                inds.every(
                                    (x) => !activeChildrenIndices.includes(x),
                                )
                            ) {
                                continue;
                            }
                        }
                        let compositeComp =
                            this.dependencyHandler._components[
                                compositeNotReady
                            ];
                        if (
                            compositeComp.attributes.createComponentOfType
                                ?.primitive
                        ) {
                            compositesBlockingWithComponentType.push(
                                compositeNotReady,
                            );
                        } else {
                            compositesBlockingWithoutComponentType.push(
                                compositeNotReady,
                            );
                        }
                    }

                    let compositesToAddBlockers =
                        compositesBlockingWithoutComponentType;
                    if (compositesToAddBlockers.length === 0) {
                        compositesToAddBlockers =
                            compositesBlockingWithComponentType;
                    }

                    for (let compositeNotReady of compositesToAddBlockers) {
                        for (let varName of this.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: compositeNotReady,
                                blockerType: "stateVariable",
                                blockerStateVariable:
                                    "readyToExpandWhenResolved",
                                componentIdxBlocked: this.upstreamComponentIdx,
                                typeBlocked: "childMatches",
                                stateVariableBlocked: varName, // add to just block for this variable
                            });
                        }
                    }

                    return {
                        success: false,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        }

        let activeChildrenMatched = activeChildrenIndices.map(
            (x) => parent.activeChildren[x],
        );

        this.compositeReplacementRange = [];

        if (this.dontRecurseToShadows) {
            let allActiveChildrenMatched = activeChildrenMatched;
            let allActiveChildrenIndices = activeChildrenIndices;

            activeChildrenMatched = [];
            activeChildrenIndices = [];

            for (let [ind, child] of allActiveChildrenMatched.entries()) {
                if (
                    !(
                        child.shadows &&
                        child.shadows.compositeIdx ===
                            parent?.shadows?.compositeIdx
                    )
                ) {
                    activeChildrenMatched.push(child);
                    activeChildrenIndices.push(allActiveChildrenIndices[ind]);
                }
            }
        } else {
            // translate parent.compositeReplacementActiveRange
            // so that indices refer to index from activeChildrenMatched

            if (
                parent.compositeReplacementActiveRange &&
                activeChildrenMatched.length > 0
            ) {
                for (let compositeInfo of parent.compositeReplacementActiveRange) {
                    let translatedFirstInd, translatedLastInd;

                    let translatedPotentialListComponents = [];

                    for (let [
                        ind,
                        activeInd,
                    ] of activeChildrenIndices.entries()) {
                        if (compositeInfo.firstInd > activeInd) {
                            continue;
                        }
                        if (compositeInfo.lastInd < activeInd) {
                            // firstInd/lastInd as describing the interval with inclusive convention at both ends.
                            // Therefore if lastInd = firstInd-1, it means that there were no replacements for the composite.
                            // Since we still want to communicate the compositeReplacementRange in this case,
                            // we set the translated ind to be a interval of length 0 that corresponds to the composite's location.
                            if (
                                compositeInfo.lastInd ===
                                compositeInfo.firstInd - 1
                            ) {
                                translatedFirstInd = ind;
                                translatedLastInd = ind - 1;
                            }
                            break;
                        }

                        // activeInd is matched by compositeInfo

                        if (translatedFirstInd === undefined) {
                            // this is the first activeInd to match, so translate first ind
                            // to the index of activeInd
                            translatedFirstInd = ind;
                        }

                        // last one to match will be picked
                        translatedLastInd = ind;

                        translatedPotentialListComponents.push(
                            compositeInfo.potentialListComponents[
                                activeInd - compositeInfo.firstInd
                            ],
                        );
                    }

                    if (translatedLastInd !== undefined) {
                        this.compositeReplacementRange.push({
                            compositeIdx: compositeInfo.compositeIdx,
                            extendIdx: compositeInfo.extendIdx,
                            unresolvedPath: compositeInfo.unresolvedPath,
                            firstInd: translatedFirstInd,
                            lastInd: translatedLastInd,
                            asList: compositeInfo.asList,
                            potentialListComponents:
                                translatedPotentialListComponents,
                        });
                    }
                }
            }

            for (let child of activeChildrenMatched) {
                let childSource = child;
                let parentSource = parent;

                while (
                    childSource?.shadows &&
                    childSource.shadows.compositeIdx ===
                        parentSource?.shadows?.compositeIdx
                ) {
                    parentSource =
                        this.dependencyHandler._components[
                            parentSource.shadows.componentIdx
                        ];
                    childSource =
                        this.dependencyHandler._components[
                            childSource.shadows.componentIdx
                        ];
                }
            }
        }

        this.activeChildrenIndices = activeChildrenIndices;

        let downstreamComponentIndices = [];
        let downstreamComponentTypes = [];

        for (let [ind, child] of activeChildrenMatched.entries()) {
            if (typeof child !== "object") {
                this.downstreamPrimitives.push(child);
                continue;
            }

            this.downstreamPrimitives.push(null);

            downstreamComponentIndices.push(
                child.componentIdx
                    ? child.componentIdx
                    : `__placeholder_${ind}`,
            );
            downstreamComponentTypes.push(child.componentType);
        }

        if (
            this.originalDownstreamVariableNames.includes("hidden") &&
            this.downstreamPrimitives.find((x) => x !== null)
        ) {
            // We are asking for the hidden state variable and the result includes primitives.
            // Since primitives don't have a hidden state variable, we instead depend on the hidden state variable
            // of the composite.

            for (let compositeObj of this.compositeReplacementRange) {
                downstreamComponentIndices.push(compositeObj.compositeIdx);
                downstreamComponentTypes.push(
                    this.dependencyHandler._components[
                        compositeObj.compositeIdx
                    ].componentType,
                );

                this.addedCompositeHiddenDependency = true;
            }

            if (
                this.addedCompositeHiddenDependency &&
                this.originalDownstreamVariableNames.length > 1
            ) {
                // Added a composite hidden dependency but there are other variables that may not be on the composite.
                // Make variables optional so we don't cause an unexpected error.
                this.variablesOptional = true;
            }
        }

        return {
            success: true,
            downstreamComponentIndices,
            downstreamComponentTypes,
        };
    }

    async getValue({ verbose, consumeChanges = true } = {}) {
        let result = await this.getValueNoProxy({
            verbose,
            consumeChanges,
        });

        // TODO: do we have to adjust anything else from result
        // if we add primitives to result.value?

        let compositeReplacementRange = this.compositeReplacementRange;

        if (this.addedCompositeHiddenDependency) {
            // We added composite hidden dependencies.
            // Delete them off the actual dependencies returned
            // and instead add them to the compositeReplacesRange object returned.

            let nDepsAdded = compositeReplacementRange.length;
            let extraDependencies = result.value.splice(
                result.value.length - nDepsAdded,
                nDepsAdded,
            );

            compositeReplacementRange = JSON.parse(
                JSON.stringify(compositeReplacementRange),
            );

            for (let [ind, range] of compositeReplacementRange.entries()) {
                range.hidden = extraDependencies[ind].stateValues.hidden;
            }
        }

        let resultValueWithPrimitives = [];
        let resultInd = 0;

        for (let primitiveOrNull of this.downstreamPrimitives) {
            if (primitiveOrNull === null) {
                resultValueWithPrimitives.push(result.value[resultInd]);
                resultInd++;
            } else {
                resultValueWithPrimitives.push(primitiveOrNull);
            }
        }

        resultValueWithPrimitives.compositeReplacementRange =
            compositeReplacementRange;

        result.value = resultValueWithPrimitives;

        if (
            this.downstreamPrimitives.length !==
                this.previousDownstreamPrimitives.length ||
            this.downstreamPrimitives.some(
                (v, i) => v !== this.previousDownstreamPrimitives[i],
            )
        ) {
            result.changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.previousDownstreamPrimitives = [
                    ...this.downstreamPrimitives,
                ];
            }
        }

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
    }

    deleteFromUpdateTriggers() {
        let childDeps =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (childDeps) {
            let ind = childDeps.indexOf(this);
            if (ind !== -1) {
                childDeps.splice(ind, 1);
            }
        }

        if (this.specifiedComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.specifiedComponentName
                ];
            if (dependenciesMissingComponent) {
                let ind = dependenciesMissingComponent.indexOf(this);
                if (ind !== -1) {
                    dependenciesMissingComponent.splice(ind, 1);
                }
            }
        }
    }
}


export class DescendantDependency extends Dependency {
    static dependencyType = "descendant";

    setUpParameters() {
        if (this.definition.ancestorIdx != undefined) {
            this.ancestorIdx = this.definition.ancestorIdx;
            this.specifiedComponentName = this.ancestorIdx;
        } else {
            this.ancestorIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.componentTypes = this.definition.componentTypes;
        this.recurseToMatchedChildren =
            this.definition.recurseToMatchedChildren;
        this.useReplacementsForComposites =
            this.definition.useReplacementsForComposites;
        this.includeNonActiveChildren =
            this.definition.includeNonActiveChildren;
        this.includeAttributeChildren =
            this.definition.includeAttributeChildren;
        this.skipOverAdapters = this.definition.skipOverAdapters;
        this.ignoreReplacementsOfMatchedComposites =
            this.definition.ignoreReplacementsOfMatchedComposites;

        // Note: ignoreReplacementsOfEncounteredComposites means ignore replacements
        // of all composites except copies of external content
        this.ignoreReplacementsOfEncounteredComposites =
            this.definition.ignoreReplacementsOfEncounteredComposites;

        if (
            this.definition.sourceIndex !== null &&
            this.definition.sourceIndex !== undefined
        ) {
            if (Number.isInteger(this.definition.sourceIndex)) {
                this.sourceIndex = this.definition.sourceIndex;
            } else {
                this.sourceIndex = NaN;
            }
        }
    }

    async determineDownstreamComponents() {
        // console.log(`deterine downstream components of descendancy dependency ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        let ancestor = this.dependencyHandler._components[this.ancestorIdx];

        if (!ancestor) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.ancestorIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.ancestorIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.ancestorIdx,
                    blockerType: "componentIdentity",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let descendantDependencies =
            this.dependencyHandler.updateTriggers
                .descendantDependenciesByAncestor[this.ancestorIdx];
        if (!descendantDependencies) {
            descendantDependencies =
                this.dependencyHandler.updateTriggers.descendantDependenciesByAncestor[
                    this.ancestorIdx
                ] = [];
        }
        if (!descendantDependencies.includes(this)) {
            descendantDependencies.push(this);
        }

        let result = this.gatherUnexpandedComposites(ancestor);

        if (
            result.haveCompositesNotReady ||
            result.haveUnexpandedCompositeReady
        ) {
            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });

                for (const parentIdxStr in result.unexpandedCompositesReadyByParentName) {
                    const parentIdx = Number(parentIdxStr);
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: parentIdx,
                        blockerType: "childMatches",
                        blockerStateVariable: varName,
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "recalculateDownstreamComponents",
                        stateVariableBlocked: varName,
                        dependencyBlocked: this.dependencyName,
                    });
                }

                for (const parentIdxStr in result.unexpandedCompositesNotReadyByParentName) {
                    const parentIdx = Number(parentIdxStr);
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: parentIdx,
                        blockerType: "childMatches",
                        blockerStateVariable: varName,
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "recalculateDownstreamComponents",
                        stateVariableBlocked: varName,
                        dependencyBlocked: this.dependencyName,
                    });

                    // TODO: when we have the composites block child logic,
                    // we can get circular dependencies.
                    // The solution of just removing these blockers seems to work,
                    // but not sure if it is the most efficient solution.
                    // Does this lead to unnecessary recalculations?

                    // for (let compositeNotReady of result.unexpandedCompositesNotReadyByParentName[parentIdx]) {
                    //   this.dependencyHandler.addBlocker({
                    //     blockerComponentIdx: compositeNotReady,
                    //     blockerType: "stateVariable",
                    //     blockerStateVariable: "readyToExpandWhenResolved",
                    //     componentIdxBlocked: this.upstreamComponentIdx,
                    //     typeBlocked: "childMatches",
                    //     stateVariableBlocked: varName,
                    //   });
                    // }
                }
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        // if reached this far, then we have expanded all composites
        // or have placeholders that don't impede

        let descendants = gatherDescendants({
            ancestor,
            descendantTypes: this.componentTypes,
            recurseToMatchedChildren: this.recurseToMatchedChildren,
            useReplacementsForComposites: this.useReplacementsForComposites,
            includeNonActiveChildren: this.includeNonActiveChildren,
            skipOverAdapters: this.skipOverAdapters,
            ignoreReplacementsOfMatchedComposites:
                this.ignoreReplacementsOfMatchedComposites,
            ignoreReplacementsOfEncounteredComposites:
                this.ignoreReplacementsOfEncounteredComposites,
            componentInfoObjects: this.dependencyHandler.componentInfoObjects,
        });

        if (this.sourceIndex !== undefined) {
            let theDescendant = descendants[this.sourceIndex - 1];
            if (theDescendant) {
                descendants = [theDescendant];
            } else {
                descendants = [];
            }
        }

        return {
            success: true,
            downstreamComponentIndices: descendants.map((x) => x.componentIdx),
            downstreamComponentTypes: descendants.map((x) => x.componentType),
        };
    }

    gatherUnexpandedComposites(component) {
        let unexpandedCompositesReadyByParentName = {};
        let unexpandedCompositesNotReadyByParentName = {};
        let haveUnexpandedCompositeReady = false;
        let haveCompositesNotReady = false;

        // if we don't need component indices or variables,
        // then gathering a placeholder descendant is fine
        let placeholdersOKForMatchedDescendants =
            this.skipComponentIndices &&
            this.originalDownstreamVariableNames.length === 0;

        if (!component.matchedCompositeChildren) {
            if (component.matchedCompositeChildrenWithPlaceholders) {
                if (component.unexpandedCompositesReady.length > 0) {
                    let unexpandedReady =
                        this.unexpandedCompositesAdjustedForPlacedholders(
                            component.unexpandedCompositesReady,
                            placeholdersOKForMatchedDescendants,
                        );
                    if (unexpandedReady.length > 0) {
                        unexpandedCompositesReadyByParentName[
                            component.componentIdx
                        ] = unexpandedReady;
                        haveUnexpandedCompositeReady = true;
                    }
                }
                if (component.unexpandedCompositesNotReady.length > 0) {
                    let unexpandedNotReady =
                        this.unexpandedCompositesAdjustedForPlacedholders(
                            component.unexpandedCompositesNotReady,
                            placeholdersOKForMatchedDescendants,
                        );
                    if (unexpandedNotReady.length > 0) {
                        unexpandedCompositesNotReadyByParentName[
                            component.componentIdx
                        ] = unexpandedNotReady;
                        haveCompositesNotReady = true;
                    }
                }
            } else {
                if (component.unexpandedCompositesReady.length > 0) {
                    unexpandedCompositesReadyByParentName[
                        component.componentIdx
                    ] = component.unexpandedCompositesReady;
                    haveUnexpandedCompositeReady = true;
                }
                if (component.unexpandedCompositesNotReady.length > 0) {
                    unexpandedCompositesNotReadyByParentName[
                        component.componentIdx
                    ] = component.unexpandedCompositesNotReady;
                    haveCompositesNotReady = true;
                }
            }
        }

        for (const childIdxStr in component.allChildren) {
            let child = component.allChildren[childIdxStr].component;
            if (typeof child === "object") {
                let result = this.gatherUnexpandedComposites(child);
                if (result.haveUnexpandedCompositeReady) {
                    Object.assign(
                        unexpandedCompositesReadyByParentName,
                        result.unexpandedCompositesReadyByParentName,
                    );
                    haveUnexpandedCompositeReady = true;
                }
                if (result.haveCompositesNotReady) {
                    Object.assign(
                        unexpandedCompositesNotReadyByParentName,
                        result.unexpandedCompositesNotReadyByParentName,
                    );
                    haveCompositesNotReady = true;
                }
            }
        }

        return {
            unexpandedCompositesReadyByParentName,
            haveUnexpandedCompositeReady,
            unexpandedCompositesNotReadyByParentName,
            haveCompositesNotReady,
        };
    }

    unexpandedCompositesAdjustedForPlacedholders(
        unexpandedComposites,
        placeholdersOKForMatchedDescendants,
    ) {
        let adjustedUnexpanded = [];
        for (let compositeIdx of unexpandedComposites) {
            let composite = this.dependencyHandler._components[compositeIdx];
            if (composite.attributes.createComponentOfType) {
                let placeholderType =
                    this.dependencyHandler.componentInfoObjects
                        .componentTypeLowerCaseMapping[
                        composite.attributes.createComponentOfType.primitive.value.toLowerCase()
                    ];

                let matches = this.componentTypes.some((ct) =>
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType: placeholderType,
                            baseComponentType: ct,
                        },
                    ),
                );

                if (matches) {
                    if (!placeholdersOKForMatchedDescendants) {
                        adjustedUnexpanded.push(compositeIdx);
                    }
                } else {
                    // Composite is a placeholder that is not matched by componentTypes.
                    // Could that placeholder later have a descendant that is matched by componentTypes?

                    adjustedUnexpanded.push(compositeIdx);
                }
            } else {
                // no componentType specified
                adjustedUnexpanded.push(compositeIdx);
            }
        }

        return adjustedUnexpanded;
    }

    deleteFromUpdateTriggers() {
        let descendantDeps =
            this.dependencyHandler.updateTriggers
                .descendantDependenciesByAncestor[this.ancestorIdx];
        if (descendantDeps) {
            let ind = descendantDeps.indexOf(this);
            if (ind !== -1) {
                descendantDeps.splice(ind, 1);
            }
        }

        if (this.specifiedComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.specifiedComponentName
                ];
            if (dependenciesMissingComponent) {
                let ind = dependenciesMissingComponent.indexOf(this);
                if (ind !== -1) {
                    dependenciesMissingComponent.splice(ind, 1);
                }
            }
        }
    }
}

