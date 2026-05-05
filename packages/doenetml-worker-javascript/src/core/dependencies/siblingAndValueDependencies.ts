// @ts-nocheck
// Concrete dependency subclasses extracted from the original
// `Dependencies.js`. Type checking is disabled file-wide because the
// classes inherit a dynamic field set from `Dependency` and were
// untyped JavaScript prior to the split.

import { Dependency } from "./Dependency";

export class CountAmongSiblingsDependency extends Dependency {
    static dependencyType = "countAmongSiblings";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
        if (this.definition.componentType) {
            this.componentType = this.definition.componentType;
        } else if (this.definition.sameType) {
            this.sameType = true;
        }

        this.includeInheritedComponentTypes = Boolean(
            this.definition.includeInheritedComponentTypes,
        );
    }

    async determineDownstreamComponents() {
        let component = this.dependencyHandler._components[this.componentIdx];

        if (!component) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.componentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.componentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.componentIdx,
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

        if (component.parentIdx == undefined) {
            console.warn(
                `component ${this.componentIdx} does not have a parent for state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}.`,
            );
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = component.parentIdx;
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            // Note: since parent is created after children,
            // will typically hit this condition first time through
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

        if (!parent.childrenMatched) {
            let canProceedWithPlaceholders =
                parent.childrenMatchedWithPlaceholders;

            if (!canProceedWithPlaceholders) {
                let haveCompositesNotReady =
                    parent.unexpandedCompositesNotReady.length > 0;

                if (
                    !haveCompositesNotReady &&
                    parent.unexpandedCompositesReady.length > 0
                ) {
                    // could make progress just by expanding composites and
                    // then recalculating the downstream components
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

                    for (let compositeNotReady of parent.unexpandedCompositesNotReady) {
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

        // TODO: do we need this to actually depend on siblings?
        // Or is the update trigger enough to handle all needed updates?
        // Removed dependence on siblings so works even if they are placeholders
        return {
            success: true,
            // downstreamComponentIndices: parent.activeChildren.map(x => x.componentIdx),
            // downstreamComponentTypes: parent.activeChildren.map(x => x.componentType),
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
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

        let dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[this.parentIdx];
        if (dependenciesMissingComponent) {
            let ind = dependenciesMissingComponent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingComponent.splice(ind, 1);
            }
        }
    }

    async getValue() {
        let childComponentType;
        if (this.componentType) {
            childComponentType = this.componentType;
        } else if (this.sameType) {
            childComponentType =
                this.dependencyHandler.components[this.upstreamComponentIdx]
                    .componentType;
        }

        let children =
            this.dependencyHandler.components[this.parentIdx].activeChildren;
        if (childComponentType) {
            if (this.includeInheritedComponentTypes) {
                children = children.filter((x) =>
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType: x.componentType,
                            baseComponentType: childComponentType,
                        },
                    ),
                );
            } else {
                children = children.filter(
                    (x) => x.componentType === childComponentType,
                );
            }
        }

        // This could be 0 if the component doesn't match the specified componentType
        let value =
            children
                .map((x) => x.componentIdx)
                .indexOf(this.upstreamComponentIdx) + 1;

        // if `initializeCounters` was passed into core with a key that matches the component type
        // then increment `value` so that the first instance would yield that initial counter.
        if (this.parentIdx === this.dependencyHandler.core.documentIdx) {
            let initializeCounters =
                this.dependencyHandler.core.initializeCounters;

            if (this.includeInheritedComponentTypes) {
                // if we are including inherited component types,
                // then just use the first counter found and skip any additional counters
                // (where the order encountered is arbitrary)
                for (let cType in initializeCounters) {
                    if (
                        this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                            {
                                inheritedComponentType: cType,
                                baseComponentType: childComponentType,
                            },
                        )
                    ) {
                        value += initializeCounters[cType] - 1;
                        break;
                    }
                }
            } else {
                let initialCounter = initializeCounters[childComponentType];
                if (initialCounter) {
                    value += initialCounter - 1;
                }
            }
        }

        // don't need changes, as it is changed directly from core
        // and then upstream variables are marked as changed
        return { value, changes: {} };
    }
}


export class ValueDependency extends Dependency {
    static dependencyType = "value";

    setUpParameters() {
        this.value = this.definition.value;
    }

    async getValue() {
        return {
            value: this.value,
            changes: {},
        };
    }
}


export class FlagDependency extends ValueDependency {
    static dependencyType = "flag";

    setUpParameters() {
        this.flagName = this.definition.flagName;
        this.value = this.dependencyHandler.core.flags[this.flagName];
    }
}

