/**
 * The pass that holds a point's coordinates, written as text and references
 * (`<point>($a, 2$a)</point>`), in the point itself rather than in an
 * attribute component (Doenet/DoenetML#2252, B4; see
 * `docs/b4-coordinate-attributes.md`).
 *
 * Such a point's `xs` is a `mathList` attribute component holding one
 * `<math>` per coordinate, each holding its text and the value references
 * (`_ref`) in it. The pass replaces it with an *expression attribute*
 * (`utils/expressionAttribute.js`): the coordinates as a template, each
 * reference replaced by a code, and a *slot* for each reference
 * (`utils/referenceSlot.ts`) holding its `refResolution` and how it is read.
 * The point computes the coordinates from the template with the values its
 * slots read, with no components.
 *
 * An `xs` qualifies when its `mathList` and `<math>`s have no attributes and
 * each `<math>` holds only text and value references that read a math or a
 * number and have no components between the brackets of their path
 * (`$l[$i]`). Anything else keeps the attribute component. So does the
 * template of a repeat made a list (`utils/dast/repeatLists.ts`), whose
 * references read entries of lists, and a component made after the resolver
 * was given the document, whose index it does not have to resolve a slot
 * from.
 *
 * It runs last among the passes that read attribute components, after the
 * value references, which make the `_ref`s.
 */
import type { ExpressionAttribute, SerializedComponent } from "./types";
import { unwrapSource } from "./convertNormalizedDast";

/** The owner types and attributes the pass holds. */
const EXPRESSION_ATTRIBUTES: Record<string, Set<string>> = {
    point: new Set(["xs"]),
};

/** The types a reference in an expression attribute can be read as. */
const SLOT_TYPES = new Set(["math", "number"]);

/**
 * How a value reference was planned to be read
 * (`utils/dast/valueReferences.ts`), which its slot keeps.
 */
const READ_PLAN_KEYS = [
    "presentedComponentType",
    "referencedComponentType",
    "adapterVariable",
    "readsReferentAdapter",
    "listEntryAdapterProperty",
];

/** Disable the pass, to compare a document with and without it in tests. */
let expressionAttributesEnabled = true;
export function setExpressionAttributesEnabled(enabled: boolean) {
    expressionAttributesEnabled = enabled;
}

/**
 * Hold the attributes of `serializedComponents` that qualify. `numResolverNodes`
 * is the number of nodes the resolver was given (`normalized_root.nodes`):
 * a component made after it, by sugar or for an attribute (the points of a
 * polygon's `vertices`, a label's `anchor`), has an index the resolver does
 * not know, which a slot could not resolve from, so its references keep
 * their own.
 */
export function convertExpressionAttributes(
    serializedComponents: (SerializedComponent | string)[],
    numResolverNodes: number,
) {
    if (!expressionAttributesEnabled) {
        return;
    }
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }
        // the template of a repeat made a list reads entries of lists
        if (component.doenetAttributes?.repeatTemplate) {
            continue;
        }
        const names =
            component.componentIdx < numResolverNodes
                ? EXPRESSION_ATTRIBUTES[component.componentType]
                : undefined;
        for (const [name, attribute] of Object.entries(
            component.attributes ?? {},
        )) {
            if (attribute.type !== "component") {
                continue;
            }
            const held = names?.has(name)
                ? expressionAttributeOf(name, attribute.component, component)
                : undefined;
            if (held) {
                component.attributes[name] = held;
            } else {
                convertExpressionAttributes(
                    [attribute.component],
                    numResolverNodes,
                );
            }
        }
        convertExpressionAttributes(component.children ?? [], numResolverNodes);
    }
}

/**
 * The expression attribute `name` of `owner` that the `mathList`
 * `component` stands for, or `undefined` if it does not qualify.
 */
function expressionAttributeOf(
    name: string,
    component: SerializedComponent,
    owner: SerializedComponent,
): ExpressionAttribute | undefined {
    if (
        component.componentType !== "mathList" ||
        component.extending !== undefined ||
        Object.keys(component.attributes ?? {}).length > 0
    ) {
        return undefined;
    }
    const slots: any[] = [];
    const coordinates: SerializedComponent[] = [];
    for (const child of component.children) {
        if (typeof child === "string") {
            if (child.trim() !== "") {
                return undefined;
            }
            continue;
        }
        if (
            child.componentType !== "math" ||
            child.extending !== undefined ||
            Object.keys(child.attributes ?? {}).length > 0
        ) {
            return undefined;
        }
        const content: (SerializedComponent | string)[] = [];
        for (const piece of child.children) {
            if (typeof piece === "string") {
                content.push(piece);
                continue;
            }
            const slot = slotOf(piece, owner);
            if (!slot) {
                return undefined;
            }
            content.push({
                type: "serialized",
                componentType: slot.readPlan.presentedComponentType,
                componentIdx: -1,
                attributes: {},
                doenetAttributes: { repeatTemplateConstant: slots.length },
                children: [],
                state: {},
            } as SerializedComponent);
            slots.push(slot);
        }
        coordinates.push({
            type: "serialized",
            componentType: "math",
            componentIdx: -1,
            attributes: {},
            doenetAttributes: {},
            children: content,
            state: {},
        } as SerializedComponent);
    }
    if (coordinates.length === 0 || slots.length === 0) {
        return undefined;
    }
    return {
        type: "expression",
        name,
        componentType: "mathList",
        // the coordinates as a point's, which `analyzeRepeatTemplate` reads
        template: {
            type: "serialized",
            componentType: "point",
            componentIdx: -1,
            attributes: {
                xs: {
                    type: "component",
                    name: "xs",
                    component: {
                        type: "serialized",
                        componentType: "mathList",
                        componentIdx: -1,
                        attributes: {},
                        doenetAttributes: {},
                        children: coordinates,
                        state: {},
                    },
                },
            },
            doenetAttributes: {},
            children: [],
            state: {},
        },
        slots,
        ...(component.sourceDoc !== undefined
            ? { sourceDoc: component.sourceDoc }
            : {}),
    };
}

/**
 * The slot of the value reference `piece` in an attribute of `owner`: its
 * `refResolution`, resolved from `owner` (whose index a copy renumbers, as it
 * renumbered the reference's), and how it is read. `undefined` for anything
 * else, or a reference the pass does not hold.
 */
function slotOf(piece: SerializedComponent, owner: SerializedComponent) {
    if (
        piece.componentType !== "_ref" ||
        !piece.extending ||
        !("Ref" in piece.extending) ||
        Object.keys(piece.attributes ?? {}).length > 0
    ) {
        return undefined;
    }
    const readPlan: Record<string, any> = {};
    for (const key of READ_PLAN_KEYS) {
        if (piece.doenetAttributes?.[key] !== undefined) {
            readPlan[key] = piece.doenetAttributes[key];
        }
    }
    if (!SLOT_TYPES.has(readPlan.presentedComponentType)) {
        return undefined;
    }
    const refResolution = structuredClone(unwrapSource(piece.extending));
    const hasIndexComponents = refResolution.originalPath.some((part) =>
        part.index.some((index) => typeof index.value[0] !== "string"),
    );
    // A path that starts with no name resolves from its origin itself
    // (`setUnflattenedReferenceOrigins`), which is only the reference.
    if (
        hasIndexComponents ||
        !refResolution.originalPath[0]?.name ||
        refResolution.nodesInResolvedPath.length === 0
    ) {
        return undefined;
    }
    refResolution.nodesInResolvedPath[0] = owner.componentIdx;
    return { refResolution, readPlan };
}
