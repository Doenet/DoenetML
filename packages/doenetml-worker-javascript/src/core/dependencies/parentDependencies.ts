// @ts-nocheck
// Concrete dependency subclasses extracted from the original
// `Dependencies.js`. Type checking is disabled file-wide because the
// classes inherit a dynamic field set from `Dependency` and were
// untyped JavaScript prior to the split.

import { Dependency } from "./Dependency";

export class ParentDependency extends Dependency {
    static dependencyType = "parentStateVariable";

    setUpParameters() {
        if (this.definition.childIdx != undefined) {
            this.childIdx = this.definition.childIdx;
            this.specifiedComponentName = this.childIdx;
        } else {
            this.childIdx = this.upstreamComponentIdx;
        }

        if (!this.definition.variableName) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must have a variableName`,
            );
        } else {
            this.originalDownstreamVariableNames = [
                this.definition.variableName,
            ];
        }

        if (this.definition.parentComponentType) {
            this.parentComponentType = this.definition.parentComponentType;
        }

        this.returnSingleVariableValue = true;

        // for parent state variable
        // always make variables optional so that don't get error
        // depending on parent (which a component can't control)
        this.variablesOptional = true;
    }

    async determineDownstreamComponents() {
        let child = this.dependencyHandler._components[this.childIdx];

        if (!child) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[this.childIdx];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.childIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.childIdx,
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

        if (child.parentIdx == undefined) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = child.parentIdx;

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

        if (
            this.parentComponentType &&
            !this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                {
                    inheritedComponentType: parent.componentType,
                    baseComponentType: this.parentComponentType,
                },
            )
        ) {
            // parent didn't match specified componentType
            // so don't include parent
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let parentDependencies =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (!parentDependencies) {
            parentDependencies =
                this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!parentDependencies.includes(this)) {
            parentDependencies.push(this);
        }

        return {
            success: true,
            downstreamComponentIndices: [this.parentIdx],
            downstreamComponentTypes: [parent.componentType],
        };
    }

    deleteFromUpdateTriggers() {
        let parentDeps =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (parentDeps) {
            let ind = parentDeps.indexOf(this);
            if (ind !== -1) {
                parentDeps.splice(ind, 1);
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
}


export class ParentIdentityDependency extends Dependency {
    static dependencyType = "parentIdentity";

    setUpParameters() {
        if (this.definition.childIdx != undefined) {
            this.childIdx = this.definition.childIdx;
            this.specifiedComponentName = this.childIdx;
        } else {
            this.childIdx = this.upstreamComponentIdx;
        }

        if (this.definition.parentComponentType) {
            this.parentComponentType = this.definition.parentComponentType;
        }

        this.returnSingleComponent = true;
    }

    async determineDownstreamComponents() {
        let child = this.dependencyHandler._components[this.childIdx];

        if (!child) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[this.childIdx];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.childIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.childIdx,
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

        if (child.parentIdx == undefined) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = child.parentIdx;

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

        if (
            this.parentComponentType &&
            !this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                {
                    inheritedComponentType: parent.componentType,
                    baseComponentType: this.parentComponentType,
                },
            )
        ) {
            // parent didn't match specified componentType
            // so don't include parent
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let parentDependencies =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (!parentDependencies) {
            parentDependencies =
                this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!parentDependencies.includes(this)) {
            parentDependencies.push(this);
        }

        return {
            success: true,
            downstreamComponentIndices: [this.parentIdx],
            downstreamComponentTypes: [parent.componentType],
        };
    }

    deleteFromUpdateTriggers() {
        let parentDeps =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (parentDeps) {
            let ind = parentDeps.indexOf(this);
            if (ind !== -1) {
                parentDeps.splice(ind, 1);
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
}


export class AncestorDependency extends Dependency {
    static dependencyType = "ancestor";

    setUpParameters() {
        if (this.definition.descendantIdx != undefined) {
            this.descendantIdx = this.definition.descendantIdx;
            this.specifiedComponentName = this.descendantIdx;
        } else {
            this.descendantIdx = this.upstreamComponentIdx;
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

        this.returnSingleComponent = true;

        if (this.definition.componentType) {
            this.componentType = this.definition.componentType;
        }
    }

    async determineDownstreamComponents() {
        let descendant = this.dependencyHandler._components[this.descendantIdx];

        if (!descendant) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.descendantIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.descendantIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.descendantIdx,
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

        if (
            this.dependencyHandler._components[
                this.dependencyHandler.core.documentIdx
            ] == undefined
        ) {
            // if document hasn't been created yet, then don't match ancestors
            // until have created document

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

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx:
                        this.dependencyHandler.core.documentIdx,
                    blockerType: "componentIdentity",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let ancestorResults = this.findMatchingAncestor(descendant);

        if (ancestorResults.missingComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    ancestorResults.missingComponentName
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        ancestorResults.missingComponentName
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: ancestorResults.missingComponentName,
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

        for (let ancestorIdx of ancestorResults.ancestorsExamined) {
            let ancestorDependencies =
                this.dependencyHandler.updateTriggers
                    .ancestorDependenciesByPotentialAncestor[ancestorIdx];
            if (!ancestorDependencies) {
                ancestorDependencies =
                    this.dependencyHandler.updateTriggers.ancestorDependenciesByPotentialAncestor[
                        ancestorIdx
                    ] = [];
            }
            if (!ancestorDependencies.includes(this)) {
                ancestorDependencies.push(this);
            }
        }
        this.ancestorResults = ancestorResults;

        if (ancestorResults.ancestorFound) {
            return {
                success: true,
                downstreamComponentIndices: [
                    ancestorResults.ancestorFound.componentIdx,
                ],
                downstreamComponentTypes: [
                    ancestorResults.ancestorFound.componentClass.componentType,
                ],
            };
        } else {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }

    findMatchingAncestor(descendant) {
        let ancestorsExamined = [];

        if (this.componentType) {
            for (let ancestor of descendant.ancestors) {
                let ancestorComponent =
                    this.dependencyHandler._components[ancestor.componentIdx];
                if (!ancestorComponent) {
                    return { missingComponentName: ancestor.componentIdx };
                }

                ancestorsExamined.push(ancestor.componentIdx);

                if (
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType:
                                ancestorComponent.componentType,
                            baseComponentType: this.componentType,
                        },
                    )
                ) {
                    return {
                        ancestorsExamined,
                        ancestorFound: ancestor,
                    };
                }
            }

            return { ancestorsExamined };
        }

        if (this.originalDownstreamVariableNames.length === 0) {
            console.warn(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must specify componentType or variableNames to find ancestor`,
            );
            return { ancestorsExamined };
        }

        // the state variable definition did not prescribe the component type
        // of the ancestor, but it did give the variableNames to match
        // Search all the state variables of the ancestors to find one
        // that has all the requisite state variables

        let variableNames = this.originalDownstreamVariableNames;

        for (let ancestor of descendant.ancestors) {
            let ancestorComponent =
                this.dependencyHandler._components[ancestor.componentIdx];
            if (!ancestorComponent) {
                return { missingComponentName: ancestor.componentIdx };
            }

            ancestorsExamined.push(ancestor.componentIdx);

            let foundAllVarNames = true;
            for (let vName of variableNames) {
                if (
                    !(
                        vName in ancestorComponent.state ||
                        this.dependencyHandler.core.checkIfArrayEntry({
                            stateVariable: vName,
                            component: ancestorComponent,
                        }).isArrayEntry
                    )
                ) {
                    foundAllVarNames = false;
                    break;
                }
            }
            if (foundAllVarNames) {
                return {
                    ancestorsExamined,
                    ancestorFound: ancestor,
                };
            }
        }

        return { ancestorsExamined };
    }

    deleteFromUpdateTriggers() {
        if (this.ancestorResults) {
            for (let ancestorIdx of this.ancestorResults.ancestorsExamined) {
                let ancestorDeps =
                    this.dependencyHandler.updateTriggers
                        .ancestorDependenciesByPotentialAncestor[ancestorIdx];
                if (ancestorDeps) {
                    let ind = ancestorDeps.indexOf(this);
                    if (ind !== -1) {
                        ancestorDeps.splice(ind, 1);
                    }
                }
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

        if (this.ancestorResults?.missingComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.ancestorResults.missingComponentName
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

