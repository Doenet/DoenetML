/**
 * Dependency subclasses that resolve to a single component identity
 * (with no state-variable values), differing only in which component
 * lookup table they consult.
 */

import { Dependency } from "./Dependency";
import { isReferenceShadow } from "../../utils/referenceShadow";
import {
    variableRefVariableName,
    type VariableRefAttribute,
} from "../../utils/variableRefAttribute";
import {
    attributesObjectOf,
    literalAttributeValue,
    literalAttributeVariables,
    literalWrittenValue,
    type LiteralAttribute,
} from "../../utils/literalAttribute";

/**
 * Whether `attribute` is one the dependency reads: a component, a reference
 * to a variable of one, or a literal (`literalAttribute.ts`).
 */
function isReadableAttribute(attribute: any) {
    return Boolean(
        attribute?.component ||
        attribute?.type === "variableRef" ||
        attribute?.type === "literal",
    );
}

/**
 * Whether `attribute` was taken from a copy's source rather than written on
 * the component: a shadowing attribute component, or a reference to the
 * source's variable (`variableRefAttribute.ts`).
 */
function isShadowAttribute(attribute: any) {
    return Boolean(
        attribute?.component?.shadows ||
        (attribute?.type === "variableRef" && attribute.isShadow),
    );
}

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

        this.variableRef = undefined;
        this.literal = undefined;
        this.literalOwnerIdx = undefined;

        let attribute = parent.attributes[this.attributeName];

        if (isReadableAttribute(attribute)) {
            // have an attribute that is a component, a reference to a
            // variable of one, or a literal

            if (isShadowAttribute(attribute)) {
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
                        isReadableAttribute(otherAttribute) &&
                        !isShadowAttribute(otherAttribute)
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
            return this.attributeDownstream(attribute, parent);
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
                    if (isReadableAttribute(attribute)) {
                        return this.attributeDownstream(attribute, comp);
                    }
                    continue;
                }
                const copied = copyComposite.replacements?.find(
                    (replacement: any) => typeof replacement === "object",
                );
                const copiedAttribute = copied?.attributes[this.attributeName];
                if (isReadableAttribute(copiedAttribute)) {
                    return this.attributeDownstream(copiedAttribute, copied);
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
                if (isReadableAttribute(attribute)) {
                    return this.attributeDownstream(attribute, comp);
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

            if (isReadableAttribute(attribute)) {
                return this.attributeDownstream(attribute, comp);
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    /**
     * The downstream component of `attribute`, which `owner` has: the
     * attribute component; for a reference to a variable of another
     * component, that component, whose variable `renameDownstreamVariables`
     * then reads in place of the attribute's `value`; for a literal, `owner`,
     * whose `literalAttributeWrites` holds what a reader wrote over it.
     */
    attributeDownstream(attribute: any, owner: any) {
        if (attribute.component) {
            return {
                success: true,
                downstreamComponentIndices: [attribute.component.componentIdx],
                downstreamComponentTypes: [attribute.component.componentType],
            };
        }

        if (attribute.type === "literal") {
            this.literal = attribute;
            this.literalOwnerIdx = owner.componentIdx;
            // a write to it is refused by `owner`'s `fixed`, as its
            // attribute component's was by the `fixed` it took from `owner`,
            // unless the attribute ignores it. No literal does today: the
            // one attribute with `ignoreFixed`, `fixed`, keeps its component,
            // which its conversion marks `ignoreParentFixed`.
            this.literalIgnoresFixed = Boolean(
                attributesObjectOf(owner.constructor)[attribute.name]
                    ?.ignoreFixed,
            );
            return {
                success: true,
                downstreamComponentIndices: [owner.componentIdx],
                downstreamComponentTypes: [owner.componentType],
            };
        }

        const referenced =
            this.dependencyHandler._components[attribute.componentIdx];
        if (!referenced) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
        this.variableRef = attribute;
        return {
            success: true,
            downstreamComponentIndices: [referenced.componentIdx],
            downstreamComponentTypes: [referenced.componentType],
        };
    }

    renameDownstreamVariables(downComponent: any, originalVarNames: string[]) {
        if (
            this.literal &&
            this.literalOwnerIdx === downComponent.componentIdx
        ) {
            const variables = literalAttributeVariables(
                this.literal,
                this.literalValueOf(this.literal),
            );
            const missing = originalVarNames.filter(
                (name) => !(name in variables),
            );
            if (missing.length > 0) {
                throw Error(
                    `Cannot read ${missing.join(", ")} of the literal attribute ${this.literal.name}.`,
                );
            }
            return originalVarNames.map(() => "literalAttributeWrites");
        }
        const variableRef: VariableRefAttribute | undefined = this.variableRef;
        if (
            !variableRef ||
            variableRef.componentIdx !== downComponent.componentIdx
        ) {
            return undefined;
        }
        return originalVarNames.map((name) =>
            variableRefVariableName(variableRef, name),
        );
    }

    async getValue({ verbose, consumeChanges = true }: any = {}) {
        let result = await this.getValueNoProxy({
            verbose,
            consumeChanges,
        });

        const literal: LiteralAttribute | undefined = this.literal;
        if (literal) {
            return this.literalResult(literal, result);
        }

        // a reference that is the attribute component (`condition="$c"`,
        // `referenceAttributeComponent`) is placed where the attribute is
        // written, as the attribute component holding it was
        const attributePosition =
            result.value?.position &&
            this.dependencyHandler._components[
                this.downstreamComponentIndices[0]
            ]?.doenetAttributes?.attributePosition;
        if (attributePosition) {
            result.value = {
                ...result.value,
                position:
                    this.dependencyHandler.frozenPositionCopy(
                        attributePosition,
                    ),
            };
        }

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
    }

    /**
     * What the dependency answers for the literal attribute `literal`, given
     * `result`, what it read of the literal's owner: what it answered for
     * the attribute component the literal replaces, a component of the
     * literal's type whose `value` is the literal's value, or what a reader
     * wrote over it (`literalAttributeWrites`).
     */
    literalResult(literal: LiteralAttribute, result: any) {
        const value: any = {
            componentType: literal.componentType,
            literal: true,
        };
        // where the author wrote it, as an attribute component has, for a
        // diagnostic about the attribute
        if (literal.position) {
            value.position = literal.position;
            value.sourceDoc = literal.sourceDoc;
        }
        const usedDefault: Record<string, boolean> = {};
        const names = this.originalDownstreamVariableNames;
        if (names.length > 0) {
            // what the reader wrote over it, or the literal's own value
            const writes = result.value?.stateValues?.[names[0]];
            const literalValue =
                writes && literal.name in writes
                    ? literalWrittenValue(literal, writes[literal.name])
                    : this.literalValueOf(literal);
            // kept for a write that changes part of it (`literalWriteValue`)
            this.literalCurrentValue = literalValue;
            const variables = literalAttributeVariables(literal, literalValue);
            value.stateValues = {};
            for (const name of names) {
                value.stateValues[name] = variables[name];
                usedDefault[name] = false;
            }
        }
        return { value, changes: result.changes, usedDefault };
    }

    /** The value of `literal`, computed once and kept on the dependency. */
    literalValueOf(literal: LiteralAttribute) {
        if (this.literalValueFor !== literal) {
            this.literalValueFor = literal;
            this.literalValue_ = literalAttributeValue(
                literal,
                this.dependencyHandler.componentInfoObjects,
            );
        }
        return this.literalValue_;
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
