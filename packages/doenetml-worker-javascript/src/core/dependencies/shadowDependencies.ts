// @ts-nocheck
// Concrete dependency subclasses extracted from the original
// `Dependencies.js`. Type checking is disabled file-wide because the
// classes inherit a dynamic field set from `Dependency` and were
// untyped JavaScript prior to the split.

import { Dependency } from "./Dependency";

export class SourceCompositeStateVariableDependency extends Dependency {
    static dependencyType = "sourceCompositeStateVariable";

    setUpParameters() {
        if (this.definition.replacementIdx != undefined) {
            this.replacementIdx = this.definition.replacementIdx;
            this.specifiedComponentName = this.replacementIdx;
        } else {
            this.replacementIdx = this.upstreamComponentIdx;
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

        if (this.definition.compositeComponentType) {
            this.compositeComponentType =
                this.definition.compositeComponentType;
        }

        // If `skipCopies` is set, then if the sourceComposite is a `_copy`,
        // instead use the component that the source composite extends.
        // If that component is not a composite, then don't return anything.
        if (this.definition.skipCopies) {
            this.skipCopies = this.definition.skipCopies;
        }

        this.returnSingleVariableValue = true;

        // for source composite state variable
        // always make variables optional so that don't get error
        // depending on source composite (which a component can't control)
        this.variablesOptional = true;
    }

    async determineDownstreamComponents() {
        let replacement =
            this.dependencyHandler._components[this.replacementIdx];

        if (!replacement) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.replacementIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.replacementIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.replacementIdx,
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

        if (!replacement.replacementOf) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let sourceComposite = replacement.replacementOf;

        if (this.compositeComponentType) {
            while (
                !this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                    {
                        inheritedComponentType: sourceComposite.componentType,
                        baseComponentType: this.compositeComponentType,
                    },
                )
            ) {
                if (sourceComposite.replacementOf) {
                    sourceComposite = sourceComposite.replacementOf;
                } else {
                    return {
                        success: true,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        } else if (this.skipCopies) {
            while (sourceComposite.componentType === "_copy") {
                const extendedComponent =
                    await sourceComposite.stateValues.extendedComponent;
                if (
                    extendedComponent &&
                    this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                        { componentType: extendedComponent.componentType },
                    )
                ) {
                    sourceComposite =
                        this.dependencyHandler.components[
                            extendedComponent.componentIdx
                        ];
                } else {
                    return {
                        success: true,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [sourceComposite.componentIdx],
            downstreamComponentTypes: [sourceComposite.componentType],
        };
    }

    deleteFromUpdateTriggers() {
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


export class SourceCompositeIdentityDependency extends Dependency {
    static dependencyType = "sourceCompositeIdentity";

    setUpParameters() {
        if (this.definition.replacementIdx != undefined) {
            this.replacementIdx = this.definition.replacementIdx;
            this.specifiedComponentName = this.replacementIdx;
        } else {
            this.replacementIdx = this.upstreamComponentIdx;
        }

        this.returnSingleComponent = true;
    }

    async determineDownstreamComponents() {
        let replacement =
            this.dependencyHandler._components[this.replacementIdx];

        if (!replacement) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.replacementIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.replacementIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.replacementIdx,
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

        if (!replacement.replacementOf) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let sourceComposite = replacement.replacementOf;

        return {
            success: true,
            downstreamComponentIndices: [sourceComposite.componentIdx],
            downstreamComponentTypes: [sourceComposite.componentType],
        };
    }

    deleteFromUpdateTriggers() {
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


export class ShadowSourceStateVariableDependency extends Dependency {
    static dependencyType = "shadowSourceStateVariable";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
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

        this.returnSingleVariableValue = true;

        // for shadow source
        // always make variables optional so that don't get error
        // depending on shadow source (which a component can't control)
        this.variablesOptional = true;
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

        if (!component.shadows) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let shadowSourceComponentIdx = component.shadows.componentIdx;
        let shadowSource =
            this.dependencyHandler._components[shadowSourceComponentIdx];

        if (!shadowSource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [shadowSource.componentIdx],
            downstreamComponentTypes: [shadowSource.componentType],
        };
    }

    deleteFromUpdateTriggers() {
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


export class ShadowSourceDependency extends Dependency {
    static dependencyType = "shadowSource";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
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

        // for shadow source
        // always make variables optional so that don't get error
        // depending on shadow source (which a component can't control)
        this.variablesOptional = true;

        this.givePropVariableValue = this.definition.givePropVariableValue;
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

        if (!component.shadows) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (
            component.shadows.propVariable &&
            !component.shadows.fromImplicitProp
        ) {
            if (!this.givePropVariableValue) {
                // If `givePropVariableValue` not specified,
                // only get sources that are shadowed without propVariable
                // unless from implicit prop
                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            } else {
                // if `givePropVariableValue` is specified,
                // then add prop variable to variable names
                if (
                    !this.originalDownstreamVariableNames.includes(
                        component.shadows.propVariable,
                    )
                ) {
                    this.originalDownstreamVariableNames.push(
                        component.shadows.propVariable,
                    );
                }
            }
        }

        let shadowSourceComponentIdx = component.shadows.componentIdx;
        let shadowSource =
            this.dependencyHandler._components[shadowSourceComponentIdx];

        if (!shadowSource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [shadowSource.componentIdx],
            downstreamComponentTypes: [shadowSource.componentType],
        };
    }

    deleteFromUpdateTriggers() {
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


export class UnlinkedCopySourceDependency extends Dependency {
    static dependencyType = "unlinkedCopySource";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
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

        // for shadow source
        // always make variables optional so that don't get error
        // depending on shadow source (which a component can't control)
        this.variablesOptional = true;
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

        if (!component.unlinkedCopySource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let unlinkedCopySourceComponentIdx = component.unlinkedCopySource;
        let unlinkedCopySource =
            this.dependencyHandler._components[unlinkedCopySourceComponentIdx];

        if (!unlinkedCopySource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [unlinkedCopySource.componentIdx],
            downstreamComponentTypes: [unlinkedCopySource.componentType],
        };
    }

    deleteFromUpdateTriggers() {
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


export class PrimaryShadowDependency extends Dependency {
    static dependencyType = "primaryShadow";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
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

        // for primary shadow
        // always make variables optional so that don't get error
        // depending on primary shadow (which a component can't control)
        this.variablesOptional = true;
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

        let primaryShadowDependencies =
            this.dependencyHandler.updateTriggers.primaryShadowDependencies[
                this.componentIdx
            ];
        if (!primaryShadowDependencies) {
            primaryShadowDependencies =
                this.dependencyHandler.updateTriggers.primaryShadowDependencies[
                    this.componentIdx
                ] = [];
        }
        if (!primaryShadowDependencies.includes(this)) {
            primaryShadowDependencies.push(this);
        }

        if (!component.primaryShadow) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let primaryShadowComponentIdx = component.primaryShadow;
        let primaryShadow =
            this.dependencyHandler._components[primaryShadowComponentIdx];

        if (!primaryShadow) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [primaryShadow.componentIdx],
            downstreamComponentTypes: [primaryShadow.componentType],
        };
    }

    deleteFromUpdateTriggers() {
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

