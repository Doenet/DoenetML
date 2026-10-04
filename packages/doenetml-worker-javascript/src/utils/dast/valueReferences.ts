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
    convertUnresolvedAttributesForComponentType,
    unwrapSource,
} from "./convertNormalizedDast";
import {
    planValueReference,
    RESPONSE_MARKS,
    staticValueReferenceTarget,
} from "../valueReference";

/**
 * Turn, in place, every `_copy` that can be a value reference into a `_ref`.
 *
 * A `_copy` qualifies when it is a bare reference (`$…`, not `extend` or
 * `copy`) whose referent resolved, with no attributes but the marks by which
 * an answer records it as a response (`RESPONSE_MARKS`), the component it
 * sits in is neither a composite nor one that renders its children, what it
 * reads is one value of a type known from the document
 * (`staticValueReferenceTarget`; this includes one entry of a list whose
 * class fixes the type of its entries, `$l[$i]` of a `<numberList>`), and
 * the parent takes that type in a child group (`planValueReference`). The
 * `_ref` keeps the `_copy`'s index, position, `extending` and response
 * marks, so the resolver, the state ids, the diagnostics about the
 * reference and the responses an answer records are unchanged. A response
 * that reads one entry of an array or a list (`readsEntry`: `$l[2]`,
 * `$ci.selectedIndex`) stays a `_copy`, for when the entry is missing.
 *
 * A bare reference written between the brackets of another reference's path
 * (`$i` of `$l[$i]`) has no parent's child groups to match. It qualifies when
 * what it reads is a number: the reference it sits in reads the index from it
 * directly, where it would otherwise read the `integer` a copy made.
 *
 * The referent's type is read from the document: the component under the
 * resolution's `nodeIdx`, the type an `extend` or `copy` will make for the
 * component it names (`createComponentIdx`), or, for the placeholder a
 * `<repeatForSequence>` makes for its `valueName`, the repeat's `type`.
 *
 * A reference that an enclosing component names in one of its reference
 * attributes stays a `_copy`, as `<math referencesAreFunctionSymbols="$f">`
 * reads which of its children came from `$f` off the range of a composite's
 * replacements. The exception is `<award referencesAreResponses="$val">`,
 * which marks the `$val` inside it as a response when the award is built: a
 * `_ref` takes that mark as a `_copy` does.
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

    function convertReference(
        component: SerializedComponent,
        parent: SerializedComponent | undefined,
        named: NamedReference[],
        betweenBrackets: boolean,
    ) {
        if (
            parent === undefined ||
            component.componentType !== "_copy" ||
            component.extending === undefined ||
            !("Ref" in component.extending) ||
            !(betweenBrackets
                ? asksOnlyForAnInteger(component)
                : hasOnlyResponseMarks(component))
        ) {
            return;
        }
        const refResolution = component.extending.Ref;
        if (refResolution.nodeIdx < 0) {
            return;
        }
        const naming = named.filter(
            ({ reference }) =>
                reference.nodeIdx === refResolution.nodeIdx &&
                comparePathsIgnorePosition(
                    reference.unresolvedPath,
                    refResolution.unresolvedPath,
                ),
        );
        if (naming.some(({ marksResponse }) => !marksResponse)) {
            return;
        }
        const targetComponentType = referentType(refResolution.nodeIdx);
        if (targetComponentType === undefined) {
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

        if (betweenBrackets) {
            // The index is read from the reference directly, and
            // rounded where it is read (`refResolutionDependencies.ts`)
            // as the `integer` it asked for rounds.
            if (
                !componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: target.valueComponentType,
                    baseComponentType: "number",
                })
            ) {
                return;
            }
            component.attributes = {};
            makeValueReference(component, {
                presentedComponentType: "integer",
                valueComponentType: target.valueComponentType,
            });
            return;
        }

        // marked by the answer already, or to be marked by the award that
        // names it when the award is built
        const isResponse =
            naming.length > 0 || Object.keys(component.attributes).length > 0;
        if (isResponse && target.readsEntry) {
            // The entry may be missing (past the end of a list, a
            // `<choiceInput>`'s `selectedIndex` before a choice). The copy
            // then makes an empty math or nothing, which the award does not
            // find equal to another empty response; a value reference reads
            // the empty value of its type, and two `NaN`s or two `""`s are
            // equal.
            return;
        }

        const parentClass =
            componentInfoObjects.allComponentClasses[parent.componentType];
        if (!parentClass) {
            return;
        }
        const plan = planValueReference({
            parentClass,
            targetComponentType: target.referentComponentType,
            valueComponentType: target.valueComponentType,
            fromImplicitProp: target.fromImplicitProp,
            hasAttributes: false,
            isResponse,
            componentInfoObjects,
        });
        if (!plan) {
            return;
        }
        // A copy keeps its attributes as written, for its replacements; a
        // value reference holds its response marks as the type it presents
        // as reads them. They are primitives, so the conversion makes no
        // components.
        component.attributes = convertUnresolvedAttributesForComponentType({
            attributes: component.attributes,
            componentType: plan.presentedComponentType,
            componentInfoObjects,
            nComponents: 0,
        }).attributes;
        makeValueReference(component, {
            ...plan,
            valueComponentType: target.valueComponentType,
        });
    }

    walk(serializedComponents, undefined, [], convertReference);
}

/**
 * A reference an enclosing component names in one of its reference
 * attributes, and whether that attribute marks it as a response
 * (`<award referencesAreResponses>`).
 */
type NamedReference = {
    reference: SerializedRefResolution;
    marksResponse: boolean;
};

/**
 * Whether the only attributes of `component` are the marks by which an
 * answer records what it reads as a response: the `isPotentialResponse`
 * an `<answer>` with no input of its own gives every reference in its
 * awards (`Answer.js`), or an `isResponse`. A value reference takes them too.
 */
function hasOnlyResponseMarks(component: SerializedComponent) {
    return Object.keys(component.attributes).every((name) =>
        RESPONSE_MARKS.has(name.toLowerCase()),
    );
}

/**
 * Whether the one attribute of `component` is the
 * `createComponentOfType="integer"` that `convertRefsToCopies` gives a bare
 * reference written between the brackets of another reference's path.
 */
function asksOnlyForAnInteger(component: SerializedComponent) {
    const typeAttribute = component.attributes.createComponentOfType;
    return (
        Object.keys(component.attributes).length === 1 &&
        typeAttribute?.type === "primitive" &&
        typeAttribute.primitive.value === "integer"
    );
}

/**
 * Turn the `_copy` `component` into a `_ref` that presents as
 * `presentedComponentType` and reads a value of `valueComponentType`.
 */
function makeValueReference(
    component: SerializedComponent,
    {
        presentedComponentType,
        adapterVariable,
        valueComponentType,
    }: {
        presentedComponentType: string;
        adapterVariable?: string;
        valueComponentType: string;
    },
) {
    component.componentType = "_ref";
    component.doenetAttributes = {
        ...component.doenetAttributes,
        presentedComponentType,
        referencedComponentType: valueComponentType,
    };
    if (adapterVariable !== undefined) {
        component.doenetAttributes.adapterVariable = adapterVariable;
    }
}

/**
 * Visit every component of the tree with its parent and with the references
 * that the components above it name in their reference attributes
 * (`named`). Visits children, attribute components, and the components
 * written between the brackets of a reference's path (`$i` of `$l[$i]`),
 * which hang off the reference and are not children of anything: those are
 * visited with the reference as `parent` and `betweenBrackets` set, and
 * what is inside them (`$i` of `$l[$i+1]`, held by the `integer` that
 * `convertRefsToCopies` wraps the index in) as ordinary children. Not the
 * references of a `createReferences` attribute themselves, which name a
 * component rather than read a value.
 */
function walk(
    components: (SerializedComponent | string)[],
    parent: SerializedComponent | undefined,
    named: NamedReference[],
    visit: (
        component: SerializedComponent,
        parent: SerializedComponent | undefined,
        named: NamedReference[],
        betweenBrackets: boolean,
    ) => void,
    betweenBrackets = false,
) {
    for (const component of components) {
        if (typeof component === "string") {
            continue;
        }
        visit(component, parent, named, betweenBrackets);

        let namedBelow = named;
        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];
            if (attribute.type === "references") {
                for (const reference of attribute.references) {
                    if (reference.extending && "Ref" in reference.extending) {
                        if (namedBelow === named) {
                            namedBelow = [...named];
                        }
                        namedBelow.push({
                            reference: reference.extending.Ref,
                            marksResponse:
                                attrName === "referencesAreResponses",
                        });
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
        if (component.extending) {
            for (const pathPart of unwrapSource(component.extending)
                .originalPath) {
                for (const indexPiece of pathPart.index) {
                    walk(indexPiece.value, component, named, visit, true);
                }
            }
        }
    }
}
