/**
 * The pass that makes a bare reference in a value position a value reference
 * (`_ref`) that resolves its own reference, in place of the `_copy` composite
 * `convertRefsToCopies` made for it. Part of Doenet/DoenetML#2128.
 *
 * It runs on the serialized document after sugar, so that the parent it sees
 * for each reference is the one the reference will have: `<number>$n+1</number>`
 * holds its `$n` in the `<math>` that sugar made. A `_copy` stays where
 * anything about the reference is only known once it resolves at run time;
 * `Copy.js` then plans a value reference from the component it resolved to.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent, SerializedRefResolution } from "./types";
import { comparePathsIgnorePosition } from "./path";
import {
    planValueReference,
    staticValueReferenceTarget,
} from "../valueReference";

/**
 * Turn, in place, every `_copy` that can be a value reference into a `_ref`.
 *
 * A `_copy` qualifies when it is a bare reference (`$…`, not `extend` or
 * `copy`) with no attributes whose referent resolved, the component it sits
 * in is neither a composite nor one that renders its children, what it reads
 * is one value of a type known from the document
 * (`staticValueReferenceTarget`), and the parent takes that type in a child
 * group (`planValueReference`). The `_ref` keeps the `_copy`'s index,
 * position and `extending`, so the resolver, the state ids and the
 * diagnostics about the reference are unchanged.
 *
 * The referent's type is read from the document: the component under the
 * resolution's `nodeIdx`, the type an `extend` or `copy` will make for the
 * component it names (`createComponentIdx`), or, for the placeholder a
 * `<repeatForSequence>` makes for its `valueName`, the repeat's `type`.
 *
 * A reference that an enclosing component names in one of its reference
 * attributes stays a `_copy`: `<award referencesAreResponses="$val">` marks
 * the `$val` inside it as a response when the award is built, and `<math
 * referencesAreFunctionSymbols="$f">` reads which of its children came from
 * `$f` off the range of a composite's replacements. Both want the component
 * a copy makes.
 */
export function convertCopiesToValueReferences({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const componentsByIdx = new Map<number, SerializedComponent>();
    const parentByIdx = new Map<number, SerializedComponent | undefined>();
    const copiesByCreatedIdx = new Map<number, SerializedComponent>();

    walk(serializedComponents, undefined, [], (component, parent) => {
        componentsByIdx.set(component.componentIdx, component);
        parentByIdx.set(component.componentIdx, parent);
        const createdIdx = component.attributes.createComponentIdx;
        if (
            component.componentType === "_copy" &&
            createdIdx?.type === "primitive"
        ) {
            copiesByCreatedIdx.set(
                Number(createdIdx.primitive.value),
                component,
            );
        }
    });

    /** The type the component a reference resolved to will have. */
    function referentType(nodeIdx: number): string | undefined {
        const node = componentsByIdx.get(nodeIdx);
        if (node === undefined) {
            return typeMadeByCopy(copiesByCreatedIdx.get(nodeIdx));
        }
        if (node.componentType === "_copy") {
            return typeMadeByCopy(node);
        }
        if (node.componentType === "_placeholder") {
            // the `valueName` of a repeat; a `<repeatForSequence>` makes it
            // as its `type` says, a `<repeat>` as whatever it iterates over
            const setup = parentByIdx.get(nodeIdx);
            const repeat =
                setup?.componentType === "_repeatSetup"
                    ? parentByIdx.get(setup.componentIdx)
                    : undefined;
            if (repeat?.componentType !== "repeatForSequence") {
                return undefined;
            }
            return sequenceValueType(repeat);
        }
        return node.componentType;
    }

    /**
     * The type a `<repeatForSequence>` makes its value as: its `type`
     * attribute, read as the attribute itself is (`validateAttributeValue`:
     * lower-cased and trimmed, and a value the attribute does not allow,
     * such as `type="text"`, falls back to its default, `number`), with
     * `letters` making a `text`. `undefined` when the attribute is not a
     * literal.
     */
    function sequenceValueType(
        repeat: SerializedComponent,
    ): string | undefined {
        const spec =
            componentInfoObjects.allComponentClasses[
                repeat.componentType
            ].createAttributesObject().type;
        const typeAttribute = repeat.attributes.type;
        let type: string;
        if (typeAttribute === undefined) {
            type = spec.defaultPrimitiveValue;
        } else if (typeAttribute.type === "primitive") {
            type = String(typeAttribute.primitive.value).toLowerCase().trim();
        } else {
            return undefined;
        }
        const allowed = spec.validValues?.map(
            (entry: { value: string }) => entry.value,
        );
        if (allowed && !allowed.includes(type)) {
            type = spec.defaultPrimitiveValue;
        }
        return type === "letters" ? "text" : type;
    }

    function typeMadeByCopy(copy: SerializedComponent | undefined) {
        const typeAttribute = copy?.attributes.createComponentOfType;
        if (typeAttribute?.type !== "primitive") {
            return undefined;
        }
        return componentInfoObjects.componentTypeLowerCaseMapping[
            String(typeAttribute.primitive.value).toLowerCase()
        ];
    }

    walk(serializedComponents, undefined, [], (component, parent, named) => {
        if (
            parent === undefined ||
            component.componentType !== "_copy" ||
            component.extending === undefined ||
            !("Ref" in component.extending) ||
            Object.keys(component.attributes).length > 0
        ) {
            return;
        }
        const refResolution = component.extending.Ref;
        if (refResolution.nodeIdx < 0) {
            return;
        }
        if (
            named.some(
                (reference) =>
                    reference.nodeIdx === refResolution.nodeIdx &&
                    comparePathsIgnorePosition(
                        reference.unresolvedPath,
                        refResolution.unresolvedPath,
                    ),
            )
        ) {
            return;
        }
        const parentClass =
            componentInfoObjects.allComponentClasses[parent.componentType];
        const targetComponentType = referentType(refResolution.nodeIdx);
        if (!parentClass || targetComponentType === undefined) {
            return;
        }
        const target = staticValueReferenceTarget({
            targetComponentType,
            unresolvedPath: refResolution.unresolvedPath,
            componentInfoObjects,
        });
        if (!target) {
            return;
        }
        const plan = planValueReference({
            parentClass,
            targetComponentType,
            valueComponentType: target.valueComponentType,
            fromImplicitProp: target.fromImplicitProp,
            hasAttributes: false,
            componentInfoObjects,
        });
        if (!plan) {
            return;
        }

        component.componentType = "_ref";
        component.doenetAttributes = {
            ...component.doenetAttributes,
            presentedComponentType: plan.presentedComponentType,
            referencedComponentType: target.valueComponentType,
        };
        if (plan.adapterVariable !== undefined) {
            component.doenetAttributes.adapterVariable = plan.adapterVariable;
        }
    });
}

/**
 * Visit every component of the tree with its parent and with the references
 * that the components above it name in their reference attributes
 * (`named`). Visits children and attribute components; not the references
 * of a `createReferences` attribute themselves, which name a component
 * rather than read a value, and not the components in a reference's path
 * indices, which hang off the reference and are not children of anything.
 */
function walk(
    components: (SerializedComponent | string)[],
    parent: SerializedComponent | undefined,
    named: SerializedRefResolution[],
    visit: (
        component: SerializedComponent,
        parent: SerializedComponent | undefined,
        named: SerializedRefResolution[],
    ) => void,
) {
    for (const component of components) {
        if (typeof component === "string") {
            continue;
        }
        visit(component, parent, named);

        let namedBelow = named;
        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];
            if (attribute.type === "references") {
                for (const reference of attribute.references) {
                    if (reference.extending && "Ref" in reference.extending) {
                        if (namedBelow === named) {
                            namedBelow = [...named];
                        }
                        namedBelow.push(reference.extending.Ref);
                    }
                }
            }
        }

        walk(component.children, component, namedBelow, visit);
        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];
            if (attribute.type === "component") {
                walk([attribute.component], component, namedBelow, visit);
            }
        }
    }
}
