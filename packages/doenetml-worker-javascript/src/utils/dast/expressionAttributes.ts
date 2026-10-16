/**
 * The pass that holds a point's coordinates, written as text and references
 * (`<point>($a, 2$a)</point>`, or a vector's), in the point itself rather than in an
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
 * each `<math>` holds only text and value references read as a math or a
 * number, or a type that is one (a reference to a `<max>` is read as a
 * `max`, a math operator), whose path starts with a name and has no
 * components between its brackets (`$l[$i]`). Anything else keeps the
 * attribute component. So does the template of a repeat made a list
 * (`utils/dast/repeatLists.ts`), whose references read entries of lists.
 *
 * The same holds an attribute that is one reference to the whole of a list
 * (`wholeListOf`, Doenet/DoenetML#2253): a `target` of an `<indexOf>` or
 * `<searchSorted>` naming a value list (`target="$l"`), whose attribute
 * component made a component for each entry, and the `vertices` of a
 * `<polyline>` or `<polygon>` naming a list of points
 * (`vertices="$points"`), whose attribute component passed on a linked copy
 * of the list. The owner reads the list itself.
 *
 * It runs last among the passes that read attribute components, after the
 * value references, which make the `_ref`s.
 */
import type { ExpressionAttribute, SerializedComponent } from "./types";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import { unwrapSource } from "./convertNormalizedDast";
import { documentReferents } from "./valueReferences";

/**
 * The attributes the pass holds, by owner type (`*` for any), and the type
 * of the attribute component each is: coordinates (`mathList`), one `math`
 * or `boolean` expression, or a reference to a whole list (`valueList`,
 * `pointList`, `WHOLE_LISTS`). Each is read only through what
 * `expressionAttributeVariable` names (`xs.numComponents`, `xs.math2`,
 * `hide.value`, `target.values`, `vertices.pointX2_1`), or for being there
 * (a line's `equation`).
 */
const EXPRESSION_ATTRIBUTES: Record<string, Record<string, string>> = {
    "*": { hide: "boolean" },
    point: { xs: "mathList" },
    vector: { xs: "mathList" },
    line: { equation: "math" },
    curve: { parMin: "math", parMax: "math" },
    case: { condition: "boolean" },
    conditionalContent: { condition: "boolean" },
    feedback: { condition: "boolean" },
    indexOf: { target: "valueList" },
    searchSorted: { target: "valueList" },
    polyline: { vertices: "pointList" },
    polygon: { vertices: "pointList" },
};

/**
 * The types of entries of a value list that a `valueList` attribute reads
 * as its attribute component read them, one entry per value.
 */
const VALUE_LIST_ENTRY_TYPES = ["math", "number", "integer", "text", "boolean"];

/**
 * The attributes that are one reference to the whole of a list, by kind:
 * the type of their attribute component, and how a list of `listClass` is
 * read, or `undefined` for a list the attribute does not hold.
 * - `valueList` (an `<indexOf>`'s `target`): a value list
 *   (`ValueListComponent`) whose entries are of a type in
 *   `VALUE_LIST_ENTRY_TYPES`, read as one array (`listVariable`, the
 *   list's `listValuesArrayName`), where the attribute component made a
 *   component for each entry;
 * - `pointList` (a `<polyline>`'s `vertices`): a list of points
 *   (`PointList`), read through the variables a `<pointList>` has, where
 *   the attribute component passed on a linked copy of it.
 */
const WHOLE_LISTS: Record<
    string,
    {
        componentType: string;
        readPlanOf: (listClass: any) => Record<string, any> | undefined;
    }
> = {
    valueList: {
        componentType: "_componentListWithSelectableType",
        readPlanOf: (listClass) =>
            inheritsFrom(listClass, "_valueList") &&
            VALUE_LIST_ENTRY_TYPES.includes(listClass.listEntryComponentType)
                ? { listVariable: listClass.listValuesArrayName }
                : undefined,
    },
    pointList: {
        componentType: "pointList",
        readPlanOf: (listClass) =>
            inheritsFrom(listClass, "pointList") ? {} : undefined,
    },
};

/**
 * The types a reference in an expression attribute can be read as, by the
 * attribute's type: a math or a number, or a type that is one (`<max>`, a
 * math operator), whose `value` a math reads as a math's; in a boolean, also
 * a boolean or a text, which it compares as a `<boolean>` does.
 */
const SLOT_BASE_TYPES: Record<string, string[]> = {
    mathList: ["math", "number"],
    math: ["math", "number"],
    boolean: ["math", "number", "boolean", "text"],
};

/**
 * The variables a `<math>` takes from its parent when it has none of its own
 * (`fallBackToParentStateVariable`, `Math.js`), which change how it parses.
 * A `math` expression of an owner that has any of them keeps its attribute
 * component.
 */
const MATH_PARSE_SETTINGS = [
    "functionSymbols",
    "referencesAreFunctionSymbols",
    "splitSymbols",
    "parseScientificNotation",
];

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
 * Hold the attributes of `serializedComponents` that qualify.
 * `context.numResolverNodes` is the number of nodes the resolver was given
 * (`normalized_root.nodes`): a component made after it, by sugar for an
 * attribute (the points of a polygon's `vertices`, a label's `anchor`), has
 * an index the resolver does not know, which a slot cannot resolve from.
 */
export function convertExpressionAttributes(
    serializedComponents: (SerializedComponent | string)[],
    context: {
        numResolverNodes: number;
        componentInfoObjects: ComponentInfoObjects;
        /** The document, and the types of what references in it name. */
        document?: (SerializedComponent | string)[];
        referents?: ReturnType<typeof documentReferents>;
    },
) {
    if (!expressionAttributesEnabled) {
        return;
    }
    // the document is what this is first called on; the types of what its
    // references name are worked out when first asked
    context.document ??= serializedComponents;
    const { numResolverNodes } = context;
    const referentsOf = () =>
        (context.referents ??= documentReferents({
            serializedComponents: context.document!,
            componentInfoObjects: context.componentInfoObjects,
        }));
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }
        // the template of a repeat made a list reads entries of lists
        if (component.doenetAttributes?.repeatTemplate) {
            continue;
        }
        const kinds = {
            ...EXPRESSION_ATTRIBUTES["*"],
            ...EXPRESSION_ATTRIBUTES[component.componentType],
        };
        for (const [name, attribute] of Object.entries(
            component.attributes ?? {},
        )) {
            if (attribute.type !== "component") {
                continue;
            }
            const kind = kinds[name];
            const owner = {
                component,
                isResolverNode: component.componentIdx < numResolverNodes,
            };
            const held =
                kind in WHOLE_LISTS
                    ? wholeListOf(
                          name,
                          kind,
                          attribute.component,
                          owner,
                          referentsOf,
                      )
                    : kind === "mathList"
                      ? expressionAttributeOf(
                            name,
                            attribute.component,
                            owner,
                            context.componentInfoObjects,
                        )
                      : kind !== undefined
                        ? singleExpressionOf(
                              name,
                              kind,
                              attribute.component,
                              owner,
                              context.componentInfoObjects,
                          )
                        : undefined;
            if (held) {
                component.attributes[name] = held;
            } else {
                convertExpressionAttributes([attribute.component], context);
            }
        }
        convertExpressionAttributes(component.children ?? [], context);
    }
}

/** A component holding an attribute, and whether the resolver has it. */
type Owner = { component: SerializedComponent; isResolverNode: boolean };

/**
 * The expression attribute `name` of `owner` that `component`, a `math` or
 * `boolean` attribute component (`kind`), stands for: its content is text
 * and value references alone, at least one of each (one reference alone is
 * the attribute component itself, `referenceAttributeComponent`). The
 * template is `component` with each reference replaced by a code. A `math`
 * whose owner has a parse setting it would take keeps its component
 * (`MATH_PARSE_SETTINGS`). `undefined` if it does not qualify.
 */
function singleExpressionOf(
    name: string,
    kind: string,
    component: SerializedComponent,
    owner: Owner,
    componentInfoObjects: ComponentInfoObjects,
): ExpressionAttribute | undefined {
    if (
        component.componentType !== kind ||
        component.extending !== undefined ||
        Object.keys(component.attributes ?? {}).length > 0
    ) {
        return undefined;
    }
    if (kind === "math") {
        const ownerVariables = (componentInfoObjects.stateVariableInfo as any)[
            owner.component.componentType
        ]?.stateVariableDescriptions;
        if (
            !ownerVariables ||
            MATH_PARSE_SETTINGS.some((variable) => variable in ownerVariables)
        ) {
            return undefined;
        }
    }
    const slots: any[] = [];
    const content: (SerializedComponent | string)[] = [];
    let hasText = false;
    for (const piece of component.children) {
        if (typeof piece === "string") {
            hasText ||= piece.trim() !== "";
            content.push(piece);
            continue;
        }
        const slot = slotOf(
            piece,
            owner,
            SLOT_BASE_TYPES[kind],
            componentInfoObjects,
        );
        if (!slot) {
            return undefined;
        }
        content.push({
            type: "serialized",
            // a boolean parses a reference by the type it is read as
            componentType: slot.readPlan.presentedComponentType,
            componentIdx: -1,
            attributes: {},
            doenetAttributes: { repeatTemplateConstant: slots.length },
            children: [],
            state: {},
        } as SerializedComponent);
        slots.push(slot);
    }
    if (slots.length === 0 || !hasText) {
        return undefined;
    }
    return {
        type: "expression",
        name,
        componentType: kind,
        template: {
            type: "serialized",
            componentType: kind,
            componentIdx: -1,
            attributes: {},
            doenetAttributes: {},
            children: content,
            state: {},
        } as SerializedComponent,
        slots,
        ...(component.position !== undefined
            ? { position: component.position }
            : {}),
        ...(component.sourceDoc !== undefined
            ? { sourceDoc: component.sourceDoc }
            : {}),
    };
}

/**
 * The expression attribute `name` of `owner` that the `mathList`
 * `component` stands for, or `undefined` if it does not qualify.
 */
function expressionAttributeOf(
    name: string,
    component: SerializedComponent,
    owner: Owner,
    componentInfoObjects: ComponentInfoObjects,
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
            const slot = slotOf(
                piece,
                owner,
                SLOT_BASE_TYPES.mathList,
                componentInfoObjects,
            );
            if (!slot) {
                return undefined;
            }
            content.push({
                type: "serialized",
                componentType: "math",
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
        ...(component.position !== undefined
            ? { position: component.position }
            : {}),
        ...(component.sourceDoc !== undefined
            ? { sourceDoc: component.sourceDoc }
            : {}),
    };
}

/**
 * The expression attribute `name` of `owner` that `component`, the
 * attribute component of an attribute of `kind` (`WHOLE_LISTS`), stands
 * for: one reference to the whole of a list of a class that `kind` reads,
 * with how it reads it (`readPlan`). `undefined` if it does not qualify.
 */
function wholeListOf(
    name: string,
    kind: string,
    component: SerializedComponent,
    owner: Owner,
    referentsOf: () => ReturnType<typeof documentReferents>,
): ExpressionAttribute | undefined {
    const { componentType, readPlanOf } = WHOLE_LISTS[kind];
    if (
        component.componentType !== componentType ||
        component.extending !== undefined ||
        Object.keys(component.attributes ?? {}).length > 0
    ) {
        return undefined;
    }
    const pieces = component.children.filter(
        (piece) => typeof piece !== "string" || piece.trim() !== "",
    );
    const piece = pieces[0];
    if (
        pieces.length !== 1 ||
        typeof piece === "string" ||
        piece.componentType !== "_copy" ||
        !piece.extending ||
        !("Ref" in piece.extending) ||
        Object.keys(piece.attributes ?? {}).length > 0
    ) {
        return undefined;
    }
    const refResolution = structuredClone(unwrapSource(piece.extending));
    if (
        refResolution.unresolvedPath != null ||
        refResolution.nodeIdx < 0 ||
        !resolvesFromOrigin(refResolution)
    ) {
        return undefined;
    }
    const referents = referentsOf();
    const referentType = referents.referentType(refResolution.nodeIdx);
    const listClass =
        referentType === undefined
            ? undefined
            : referents.referentClass(refResolution.nodeIdx, referentType);
    const readPlan = readPlanOf(listClass);
    if (readPlan === undefined) {
        return undefined;
    }
    if (owner.isResolverNode) {
        refResolution.nodesInResolvedPath[0] = owner.component.componentIdx;
    }
    return {
        type: "expression",
        name,
        componentType,
        template: {
            type: "serialized",
            componentType,
            componentIdx: -1,
            attributes: {},
            doenetAttributes: {},
            children: [],
            state: {},
        } as SerializedComponent,
        slots: [{ refResolution, readPlan }],
        ...(component.position !== undefined
            ? { position: component.position }
            : {}),
        ...(component.sourceDoc !== undefined
            ? { sourceDoc: component.sourceDoc }
            : {}),
    };
}

/**
 * Whether `componentClass` is, or extends, the class of `componentType`,
 * read from the class chain: the component types do not name every class
 * as a base type (`_valueList`, of `ValueListComponent`).
 */
function inheritsFrom(componentClass: any, componentType: string) {
    for (let c = componentClass; c; c = Object.getPrototypeOf(c)) {
        if (c.componentType === componentType) {
            return true;
        }
    }
    return false;
}

/**
 * Whether a slot can resolve `refResolution` from its owner, or from where
 * it was written: its path starts with a name and has no components between
 * its brackets (`$l[$i]`). A path that starts with no name resolves from its
 * origin itself (`setUnflattenedReferenceOrigins`), which is only the
 * reference.
 */
function resolvesFromOrigin(refResolution: any) {
    const hasIndexComponents = refResolution.originalPath.some((part: any) =>
        part.index.some((index: any) => typeof index.value[0] !== "string"),
    );
    return (
        !hasIndexComponents &&
        Boolean(refResolution.originalPath[0]?.name) &&
        refResolution.nodesInResolvedPath.length > 0
    );
}

/**
 * The slot of the value reference `piece` in an attribute of `owner`: its
 * `refResolution` and how it is read. It resolves from `owner` when the
 * resolver has a node for it (`owner.isResolverNode`), and otherwise, for an
 * owner sugar made after the resolver was given the document (a point of a
 * polygon's `vertices`), from where the reference was written, as the
 * reference did. A copy of the owner, which the resolver is given, resolves
 * it from the copy (`remapRefResolutions`). `undefined` for anything else, or
 * a reference the pass does not hold.
 */
function slotOf(
    piece: SerializedComponent,
    owner: Owner,
    baseTypes: string[],
    componentInfoObjects: ComponentInfoObjects,
) {
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
    const presented = readPlan.presentedComponentType;
    if (
        typeof presented !== "string" ||
        !baseTypes.some((baseComponentType) =>
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: presented,
                baseComponentType,
            }),
        )
    ) {
        return undefined;
    }
    const refResolution = structuredClone(unwrapSource(piece.extending));
    if (!resolvesFromOrigin(refResolution)) {
        return undefined;
    }
    if (owner.isResolverNode) {
        refResolution.nodesInResolvedPath[0] = owner.component.componentIdx;
    }
    return { refResolution, readPlan };
}
