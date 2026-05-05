// @ts-nocheck
// Concrete dependency subclasses extracted from the original
// `Dependencies.js`. Type checking is disabled file-wide because the
// classes inherit a dynamic field set from `Dependency` and were
// untyped JavaScript prior to the split.

import { Dependency } from "./Dependency";

export class ComponentIdentityDependency extends Dependency {
    static dependencyType = "componentIdentity";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        this.returnSingleComponent = true;
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

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
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


export class AttributeComponentDependency extends Dependency {
    static dependencyType = "attributeComponent";

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

        this.attributeName = this.definition.attributeName;

        this.returnSingleComponent = true;

        this.dontRecurseToShadows = this.definition.dontRecurseToShadows;
        this.dontRecurseToShadowsIfHaveAttribute =
            this.definition.dontRecurseToShadowsIfHaveAttribute;
    }

    async determineDownstreamComponents() {
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

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.component) {
            // have an attribute that is a component

            if (attribute.component.shadows) {
                if (this.dontRecurseToShadows) {
                    // The current attribute is a shadow
                    // so we don't use the current attribute
                    return {
                        success: true,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                } else if (this.dontRecurseToShadowsIfHaveAttribute) {
                    let otherAttribute =
                        parent.attributes[
                            this.dontRecurseToShadowsIfHaveAttribute
                        ];
                    if (
                        otherAttribute?.component &&
                        !otherAttribute.component.shadows
                    ) {
                        // The current attribute is a shadow
                        // but the dontRecurseToShadows attribute is not,
                        // so we don't use the current attribute
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
                downstreamComponentIndices: [attribute.component.componentIdx],
                downstreamComponentTypes: [attribute.component.componentType],
            };
        }

        // if don't have an attribute component,
        // check if shadows a component with that attribute component

        if (this.dontRecurseToShadows) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let comp = parent;

        while (comp.shadows) {
            let shadows = comp.shadows;
            let propVariable = comp.shadows.propVariable;
            let fromImplicitProp = comp.doenetAttributes.fromImplicitProp;

            if (
                this.dontRecurseToShadowsIfHaveAttribute &&
                comp.attributes[this.dontRecurseToShadowsIfHaveAttribute]
            ) {
                break;
            }

            comp = this.dependencyHandler._components[shadows.componentIdx];
            if (!comp) {
                break;
            }

            // if a prop variable was created from a plain copy that is marked as returning the same type
            // then treat it like a regular copy (as if there was no prop variable)
            // and shadow all attributes
            if (
                propVariable &&
                !(
                    fromImplicitProp &&
                    comp.constructor.implicitPropReturnsSameType
                )
            ) {
                if (
                    !(
                        comp.state[
                            propVariable
                        ]?.shadowingInstructions?.attributesToShadow?.includes(
                            this.attributeName,
                        ) ||
                        comp.constructor.createAttributesObject()[
                            this.attributeName
                        ]?.propagateToProps
                    )
                ) {
                    break;
                }
            }

            attribute = comp.attributes[this.attributeName];

            if (attribute?.component) {
                return {
                    success: true,
                    downstreamComponentIndices: [
                        attribute.component.componentIdx,
                    ],
                    downstreamComponentTypes: [
                        attribute.component.componentType,
                    ],
                };
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue({ verbose, consumeChanges = true } = {}) {
        let result = await this.getValueNoProxy({
            verbose,
            consumeChanges,
        });

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
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

