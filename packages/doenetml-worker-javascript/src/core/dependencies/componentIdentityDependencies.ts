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
 * For a list made by an `extend` of a list, the list it names, when the
 * reference names it with nothing left to resolve (`convertToCopy`).
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
        // An extend of a list can name itself, directly or through other
        // extends (`<mathList name="a" extend="$a" />`), which the core
        // reports as a circular dependency; stop rather than loop.
        const visited = new Set<number>([comp.componentIdx]);

        while (
            comp.shadows ||
            listSourceIdx(comp) !== undefined ||
            comp.doenetAttributes?.copyListViaComposite !== undefined
        ) {
            if (
                !comp.shadows &&
                comp.doenetAttributes?.copyListViaComposite !== undefined
            ) {
                // A list made by a `copy` of a list (`convertToCopy`) holds,
                // as its child, a `_copy` whose replacement is an unlinked
                // copy of that list, made as if its DoenetML were pasted
                // there: its attributes are copies of the list's, keeping
                // what is written and following what they reference. The
                // list takes those, `fixed` and `fixLocation` included, as a
                // copy of any component has its own, so a later change to
                // the list's own does not reach it.
                if (
                    this.dontRecurseToShadowsIfHaveAttribute &&
                    comp.attributes[this.dontRecurseToShadowsIfHaveAttribute]
                ) {
                    break;
                }
                const copyComposite =
                    this.dependencyHandler._components[
                        comp.doenetAttributes.copyListViaComposite
                    ];
                if (!copyComposite) {
                    break;
                }
                if (!copyComposite.isExpanded) {
                    await this.addBlockerForUnexpandedComposite(copyComposite);
                    return {
                        success: false,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
                if (await copyComposite.stateValues.usedReplacements) {
                    // A copy of a composite other than a list (`<mathList
                    // copy="$g"/>` of a `<group>`) copies what the composite
                    // stands for, its replacements, not the composite. The
                    // list takes the composite's attributes, as an extend of
                    // it does.
                    const named = (await copyComposite.stateValues
                        .extendedComponent) as { componentIdx: number } | null;
                    const namedComponent =
                        named &&
                        this.dependencyHandler._components[named.componentIdx];
                    if (
                        !namedComponent ||
                        visited.has(namedComponent.componentIdx)
                    ) {
                        break;
                    }
                    comp = namedComponent;
                    visited.add(comp.componentIdx);
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
                const copied = copyComposite.replacements?.find(
                    (replacement: any) => typeof replacement === "object",
                );
                const copiedAttribute = copied?.attributes[this.attributeName];
                if (copiedAttribute?.component) {
                    return {
                        success: true,
                        downstreamComponentIndices: [
                            copiedAttribute.component.componentIdx,
                        ],
                        downstreamComponentTypes: [
                            copiedAttribute.component.componentType,
                        ],
                    };
                }
                break;
            }
            if (!comp.shadows) {
                // A list made by an `extend` of a list holds a copy of its
                // entries rather than shadowing it (`convertToCopy`), and
                // takes the attributes of the list it names as an `extend`
                // of any component takes its source's.
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
                if (!comp || visited.has(comp.componentIdx)) {
                    break;
                }
                visited.add(comp.componentIdx);
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
            if (!comp || visited.has(comp.componentIdx)) {
                break;
            }
            visited.add(comp.componentIdx);

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
