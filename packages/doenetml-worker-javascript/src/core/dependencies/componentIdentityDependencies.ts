/**
 * Dependency subclasses that resolve to a single component identity
 * (with no state-variable values), differing only in which component
 * lookup table they consult.
 */

import { Dependency } from "./Dependency";
import { isReferenceShadow } from "../../utils/referenceShadow";

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

/**
 * The list a list made by an `extend` of one names, when the reference
 * names it with nothing left to resolve (`convertToCopy`). A `copy` of a
 * list takes no attribute from it, keeping what it was made with.
 */
function listSourceIdx(component: any): number | undefined {
    return component.doenetAttributes?.extendsList;
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
        this.notFromReferenceSource = this.definition.notFromReferenceSource;
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

        while (comp.shadows || listSourceIdx(comp) !== undefined) {
            if (!comp.shadows) {
                // A list made by an `extend` of a list holds a copy of its
                // entries rather than shadowing it (`convertToCopy`), and
                // takes the attributes of the list it names as a reference
                // takes its source's.
                if (
                    this.notFromReferenceSource ||
                    (this.dontRecurseToShadowsIfHaveAttribute &&
                        comp.attributes[
                            this.dontRecurseToShadowsIfHaveAttribute
                        ])
                ) {
                    break;
                }
                comp = this.dependencyHandler._components[listSourceIdx(comp)!];
                if (!comp) {
                    break;
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
                continue;
            }
            // A reference (the replacement of the composite that shadows
            // through it) does not take an attribute that is
            // `notFromReferenceSource` from its source; a component inside a
            // copied one takes it from the component it copies.
            if (this.notFromReferenceSource && isReferenceShadow(comp)) {
                break;
            }
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
                if (!(
                    comp.state[
                        propVariable
                    ]?.shadowingInstructions?.attributesToShadow?.includes(
                        this.attributeName,
                    ) ||
                    comp.constructor.createAttributesObject()[
                        this.attributeName
                    ]?.propagateToProps
                )) {
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

    async getValue({ verbose, consumeChanges = true }: any = {}) {
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
