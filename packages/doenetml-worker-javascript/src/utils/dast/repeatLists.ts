/**
 * The pass that makes a `<repeat>` or `<repeatForSequence>` whose template
 * is one value a list component in place of the composite it otherwise is:
 * a `_repeatValueList` (`components/RepeatValueList.js`) for a `<math>` or
 * `<number>`, a `_repeatPointList` (`components/RepeatPointList.js`) for a
 * `<point>` (`LIST_OF_TEMPLATE`). Part of Doenet/DoenetML#2163 (F6), whose design is
 * `docs/f6-repeat-templates-as-lists.md`.
 *
 * The composite makes a copy of its template for each iteration. The list
 * keeps the template once, and computes the value of each entry from it, with
 * the values the template reads at that entry's index. Whether a repeat
 * qualifies is decided from the document, so anything about it that is only
 * known at run time keeps the composite. A repeat qualifies when:
 *
 * - its template is one `<math>` or `<number>`, whose content is text,
 *   references and further unnamed `<math>`s and `<number>`s
 *   (`templateNodeQualifies`), or one `<point>` whose content is its
 *   coordinates, each such a `<math>`, and constraints, which become the
 *   list's, that read the same values in every iteration and hold no
 *   sampler (`pointQualifies`);
 *   with no attributes but those of `NODE_ATTRIBUTES`, each written as a
 *   literal;
 * - every reference in the template reads one of (`classifyReference`):
 *   - its value or index, read as an entry of the list the repeat holds them
 *     in (`_repeatValues`, `_repeatIndices`; the value-reference pass made
 *     them lists only when nothing else reads them);
 *   - the value of a `<repeat>` whose `for` is one list (`for="$l"`), read
 *     as `$l[$i]`;
 *   - an entry of a list at the iteration's index (`$l[$i]`);
 *   - a value that is the same in every iteration, which becomes a child of
 *     the list;
 * - every reference to the repeat from elsewhere is to the whole repeat
 *   (`$r`), to one iteration (`$r[2]`), to the template's component in an
 *   iteration (`$r[2].m`, which then reads the entry, `$r[2]`, and
 *   `$r[2].m.x`, which reads `$r[2].x`), or, of a list of points, to a
 *   coordinate of every entry (`$Ps.x`, `.y`, `.z`), and is not
 *   an `extend` or `copy` (#2176), or named by a reference attribute,
 *   except, of a list of points, one that takes an entry of a list as its
 *   target (#2181, `ENTRY_TARGET_ATTRIBUTES`: a trigger, a label's
 *   `forObject`, a `<ref>`'s `to`, a `<callAction>`'s `target`, an
 *   `<annotation>`'s `ref`) naming the whole repeat or one iteration;
 * - no reference reaches the template's name another way, as through an
 *   outer repeat (`$a[2][1][3].m`), which would name a component the list
 *   does not have;
 * - and, unless its template is a `<point>`, whose coordinates place it, it
 *   is not in a `<graph>`, where each iteration's component is placed at an
 *   anchor of its own and an entry of the list has none (#2186).
 *
 * It runs after the value-reference pass, which decides whether the value
 * and index are lists and makes the references in the template that read
 * them value references.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type {
    SerializedAttribute,
    SerializedComponent,
    SerializedRefResolution,
    SerializedRefResolutionPathPart,
} from "./types";
import { unwrapSource } from "./convertNormalizedDast";
import { documentReferents } from "./valueReferences";
import { sequenceEntryComponentType } from "../sequence";
import { STYLE_OVERRIDE_CATEGORIES } from "@doenet/utils";

/** The types a template can be, and the list each becomes. */
const LIST_OF_TEMPLATE: Record<string, string> = {
    math: "_repeatValueList",
    number: "_repeatValueList",
    point: "_repeatPointList",
};

/** The types a component nested in a template can be. */
const NESTED_TYPES = new Set(["math", "number"]);

/**
 * The properties of a whole list of points a reference can read
 * (`$Ps.x`), as of a `<pointList>`.
 */
const POINT_LIST_PROPERTIES = new Set(["x", "y", "z"]);

/**
 * The reference attributes that take one entry of a list as their target
 * (`utils/refTargets.ts`), by the component they are on (`*` for any), in
 * lower case. Of a list of points, the entry is drawn as the iteration's
 * point was, so naming it finds what naming the point did.
 */
const ENTRY_TARGET_ATTRIBUTES: Record<string, Set<string>> = {
    "*": new Set([
        "triggerwith",
        "triggerwhenobjectsclicked",
        "triggerwhenobjectsfocused",
    ]),
    label: new Set(["forobject"]),
    ref: new Set(["to"]),
    callaction: new Set(["target"]),
    annotation: new Set(["ref"]),
};

/** Whether the reference attribute `namedBy` takes an entry as its target. */
function takesEntryTarget({ componentType, attribute }: NamedBy) {
    const name = attribute.toLowerCase();
    return (
        ENTRY_TARGET_ATTRIBUTES["*"].has(name) ||
        ENTRY_TARGET_ATTRIBUTES[componentType.toLowerCase()]?.has(name) === true
    );
}

/** The reference attribute that names a reference, and what it is on. */
type NamedBy = { componentType: string; attribute: string };

/** The list types that hold a repeat's value and index. */
const ITERATION_LIST_TYPES = new Set(["_repeatValues", "_repeatIndices"]);

/** The types an entry of a list read at the iteration's index can be. */
const ENTRY_VALUE_TYPES = new Set(["number", "integer", "math"]);

/**
 * The attributes, in lowercase, each repeat can have as a list: those of the
 * list that mean what they meant on the composite.
 */
const REPEAT_ATTRIBUTES: Record<string, Set<string>> = {
    repeat: new Set(["name", "for", "valuename", "indexname", "aslist"]),
    repeatForSequence: new Set([
        "name",
        "from",
        "to",
        "step",
        "length",
        "exclude",
        "type",
        "lowercase",
        "valuename",
        "indexname",
        "aslist",
    ]),
};

const NUMBER_DISPLAY_ATTRIBUTES = [
    "displaydigits",
    "displaydecimals",
    "displaysmallaszero",
    "padzeros",
    "avoidscientificnotation",
];

/**
 * The attributes, in lowercase, a component of the template can have, by
 * its type and whether it is the template itself (`top`). The template's own
 * become the list's. Each must be written as a literal.
 */
const NODE_ATTRIBUTES: Record<
    string,
    { top: Set<string>; nested: Set<string> }
> = {
    math: {
        top: new Set([
            "simplify",
            "expand",
            "fixed",
            ...NUMBER_DISPLAY_ATTRIBUTES,
        ]),
        nested: new Set(["simplify", "expand"]),
    },
    number: {
        top: new Set(["fixed", ...NUMBER_DISPLAY_ATTRIBUTES]),
        nested: new Set(["fixed"]),
    },
    // the attributes `RepeatPointList` holds as its own, and its
    // coordinates, `xs`, which sugar made of its content
    point: {
        top: new Set([
            "xs",
            "fixed",
            "stylenumber",
            "labelposition",
            "draggable",
            "showcoordswhendragging",
            "layer",
            ...Object.keys(STYLE_OVERRIDE_CATEGORIES.marker).map((name) =>
                name.toLowerCase(),
            ),
        ]),
        nested: new Set(),
    },
};

/** Disable the pass, to compare a document with and without it in tests. */
let repeatListsEnabled = true;
export function setRepeatListsEnabled(enabled: boolean) {
    repeatListsEnabled = enabled;
}

export function convertRepeatsToLists({
    serializedComponents,
    componentInfoObjects,
    nComponents,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
}): { nComponents: number } {
    if (!repeatListsEnabled) {
        return { nComponents };
    }
    const { componentsByIdx, parentByIdx, referentType, referentClass } =
        documentReferents({ serializedComponents, componentInfoObjects });

    const repeats = [...componentsByIdx.values()].filter(
        (component) =>
            component.componentType === "repeat" ||
            component.componentType === "repeatForSequence",
    );
    if (repeats.length === 0) {
        return { nComponents };
    }

    // Every reference of the document, with the reference attribute that
    // names it (`createReferences`), as a trigger or a `<ref>`'s `to` does.
    // Each is kept under the component it reads, and under each name
    // written after the first part of its path (`$a[2].m`), so that a
    // repeat looks at the references that can reach it, not at all of them.
    // A plan carried out changes references only to read a list in place of
    // a repeat's value, or to drop a name, so what a repeat looks up here
    // holds every reference that can reach it.
    type Reference = {
        component: SerializedComponent;
        namedBy: NamedBy | undefined;
    };
    const referencesByTarget = new Map<number, Reference[]>();
    const referencesByPathName = new Map<string, Reference[]>();
    forEachReference(serializedComponents, (component, namedBy) => {
        const reference = { component, namedBy };
        const refResolution = unwrapSource(
            component.extending!,
        ) as SerializedRefResolution;
        addTo(referencesByTarget, refResolution.nodeIdx, reference);
        for (const part of new Set(
            (refResolution.unresolvedPath ?? []).map((part) => part.name),
        )) {
            addTo(referencesByPathName, part, reference);
        }
    });

    for (const repeat of repeats) {
        const plan = planRepeat(repeat);
        if (plan) {
            nComponents = plan(nComponents);
        }
    }

    return { nComponents };

    /**
     * Plan making `repeat` a list: the change to make, or `undefined` when it
     * stays a composite.
     */
    function planRepeat(repeat: SerializedComponent) {
        if (repeat.extending !== undefined) {
            return;
        }
        const allowedAttributes = REPEAT_ATTRIBUTES[repeat.componentType];
        if (
            !Object.keys(repeat.attributes).every((name) =>
                allowedAttributes.has(name.toLowerCase()),
            )
        ) {
            return;
        }
        const iterationLists = new Map<number, SerializedComponent>();
        let setup: SerializedComponent | undefined;
        const templateComponents: SerializedComponent[] = [];
        for (const child of repeat.children) {
            if (typeof child === "string") {
                if (child.trim() !== "") {
                    return;
                }
            } else if (ITERATION_LIST_TYPES.has(child.componentType)) {
                iterationLists.set(child.componentIdx, child);
            } else if (child.componentType === "_repeatSetup") {
                setup = child;
            } else {
                templateComponents.push(child);
            }
        }
        if (templateComponents.length !== 1) {
            return;
        }
        const template = templateComponents[0];
        const listType = LIST_OF_TEMPLATE[template.componentType];
        if (listType === undefined) {
            return;
        }
        // An iteration's math or number in a graph was placed at an anchor
        // of its own, which an entry of the list has none of; a point's own
        // coordinates place it.
        if (
            listType === "_repeatValueList" &&
            (inGraph(repeat) || copiedIntoGraph(repeat))
        ) {
            return;
        }

        // The value of a `<repeat>`, which reads `$l[$i]` of the list its
        // `for` is. A `<repeatForSequence>`'s value and index, and a
        // `<repeat>`'s index, are lists of the repeat's own by now, or
        // nothing reads them; one still in the `_repeatSetup` is read in a
        // way only a component of each iteration answers.
        let valueDummyIdx: number | undefined;
        let forList: { nodeIdx: number } | undefined;
        if (repeat.componentType === "repeatForSequence") {
            if (setup !== undefined) {
                return;
            }
            // The values a template that reads them reads as numbers or
            // maths; a template that does not (`<number>7</number>` over
            // letters) reads none.
            const readsValues = [...iterationLists.values()].some(
                (list) => list.componentType === "_repeatValues",
            );
            const entryType = sequenceEntryComponentType(
                repeat.attributes.type,
            );
            if (
                readsValues &&
                (entryType === undefined || !ENTRY_VALUE_TYPES.has(entryType))
            ) {
                return;
            }
        } else {
            for (const child of setup?.children ?? []) {
                if (typeof child === "string") {
                    continue;
                }
                if (child.componentType !== "_placeholder") {
                    return;
                }
                valueDummyIdx = child.componentIdx;
            }
            const readsValue =
                valueDummyIdx !== undefined &&
                (referencesByTarget.get(valueDummyIdx)?.length ?? 0) > 0;
            forList = forListOf(repeat, readsValue);
            if (forList === undefined) {
                return;
            }
        }

        // The components of the template, by index.
        const nodes = new Map<number, SerializedComponent>();
        const topName = authorName(template);
        const constants: SerializedComponent[] = [];
        // a point's constraints, which become the list's
        const constraints: SerializedComponent[] = [];
        const entryReferences: {
            reference: SerializedComponent;
            listIdx?: number;
        }[] = [];
        const forbidden = new Set<number>([
            repeat.componentIdx,
            ...iterationLists.keys(),
        ]);
        if (valueDummyIdx !== undefined) {
            forbidden.add(valueDummyIdx);
        }
        collectNodes(template, nodes);
        for (const idx of nodes.keys()) {
            forbidden.add(idx);
        }

        if (!templateNodeQualifies(template, true)) {
            return;
        }

        // References to the repeat, or into the template, from elsewhere.
        const rewrites: SerializedRefResolution[] = [];
        for (const { component, namedBy } of [
            repeat.componentIdx,
            ...nodes.keys(),
        ].flatMap((idx) => referencesByTarget.get(idx) ?? [])) {
            if (nodes.has(component.componentIdx) || isInside(component)) {
                continue;
            }
            const refResolution = unwrapSource(
                component.extending!,
            ) as SerializedRefResolution;
            if (nodes.has(refResolution.nodeIdx)) {
                return;
            }
            if (refResolution.nodeIdx !== repeat.componentIdx) {
                continue;
            }
            if (component.attributes.createComponentOfType) {
                return;
            }
            const path = refResolution.unresolvedPath ?? [];
            if (namedBy) {
                // An entry of a list of points is a target as the iteration's
                // point was (#2181); the whole list, one the composite did
                // not have. What names an iteration's point names the entry.
                const namesEntry =
                    path.length === 0 ||
                    (path[0].name === "" &&
                        path[0].index.length === 1 &&
                        (path.length === 1 ||
                            (path.length === 2 &&
                                topName !== undefined &&
                                path[1].name === topName &&
                                path[1].index.length === 0)));
                if (
                    listType !== "_repeatPointList" ||
                    !takesEntryTarget(namedBy) ||
                    !namesEntry
                ) {
                    return;
                }
            }
            if (path.length === 0) {
                continue;
            }
            if (path[0].name !== "") {
                // a property of the whole list of points
                if (
                    listType === "_repeatPointList" &&
                    path.length === 1 &&
                    path[0].index.length === 0 &&
                    POINT_LIST_PROPERTIES.has(path[0].name.toLowerCase())
                ) {
                    continue;
                }
                return;
            }
            if (path.length === 1) {
                continue;
            }
            // the template in one iteration, which is the entry
            // (`$r[2].P`, `$r[2].P.x`)
            if (
                path[0].index.length === 1 &&
                topName !== undefined &&
                path[1].name === topName &&
                path[1].index.length === 0
            ) {
                rewrites.push(refResolution);
                continue;
            }
            return;
        }

        // The template's name, reached another way, as through an outer
        // repeat (`$a[2][1][3].c`), names a component the list does not have.
        // Only the path left to resolve can reach it so; a resolved one
        // (`$g.m` of another `m`) names the component it resolved to.
        if (topName !== undefined) {
            for (const { component } of referencesByPathName.get(topName) ??
                []) {
                const refResolution = unwrapSource(
                    component.extending!,
                ) as SerializedRefResolution;
                if (
                    !rewrites.includes(refResolution) &&
                    (refResolution.unresolvedPath ?? []).some(
                        (part) => part.name === topName,
                    )
                ) {
                    return;
                }
            }
        }

        return (nComponents: number) => {
            for (const refResolution of rewrites) {
                const [first, , ...rest] = refResolution.unresolvedPath!;
                refResolution.unresolvedPath = [first, ...rest];
                // The path as written ends as the path to resolve does, and
                // may name the repeat through others first (`$g.r[2].m`).
                const written = refResolution.originalPath;
                const nameInd = written.length - rest.length - 1;
                if (nameInd > 0 && written[nameInd].name === topName) {
                    refResolution.originalPath = [
                        ...written.slice(0, nameInd),
                        ...written.slice(nameInd + 1),
                    ];
                }
            }

            for (const { reference, listIdx } of entryReferences) {
                if (listIdx !== undefined) {
                    // the value of a `<repeat>`, read as an entry of its list
                    reference.componentType = "_ref";
                    reference.extending = {
                        Ref: {
                            nodeIdx: listIdx,
                            unresolvedPath: null,
                            originalPath: (
                                unwrapSource(
                                    reference.extending!,
                                ) as SerializedRefResolution
                            ).originalPath,
                            nodesInResolvedPath: [
                                reference.componentIdx,
                                listIdx,
                            ],
                        },
                    };
                }
                reference.doenetAttributes = {
                    ...reference.doenetAttributes,
                    repeatEntry: true,
                };
            }

            // Each value that is the same in every iteration is read once,
            // by a child of the list, and the template holds its place.
            const constantChildren: SerializedComponent[] = [];
            for (const [ind, constant] of constants.entries()) {
                const parent = parentInTemplate(constant);
                const presented =
                    constant.doenetAttributes?.presentedComponentType ?? "math";
                parent.children[parent.children.indexOf(constant)] = {
                    type: "serialized",
                    componentType: presented,
                    componentIdx: nComponents++,
                    attributes: {},
                    doenetAttributes: { repeatTemplateConstant: ind },
                    children: [],
                    state: {},
                } as SerializedComponent;
                constant.doenetAttributes = {
                    ...constant.doenetAttributes,
                    repeatTemplateConstant: ind,
                };
                constantChildren.push(constant);
            }

            // The template's own attributes become the list's, and none of
            // its components keeps a name.
            const listAttributes: Record<string, SerializedAttribute> = {
                ...repeat.attributes,
                ...(listType === "_repeatValueList"
                    ? {
                          entryType: {
                              type: "primitive",
                              name: "entryType",
                              primitive: {
                                  type: "string",
                                  value: template.componentType,
                              },
                          },
                      }
                    : {}),
            };
            for (const [name, attribute] of Object.entries(
                template.attributes,
            )) {
                if (name !== "name" && name !== "xs") {
                    listAttributes[name] = attribute;
                }
            }
            template.attributes = template.attributes.xs
                ? { xs: template.attributes.xs }
                : {};
            template.children = template.children.filter(
                (child) => !constraints.includes(child as SerializedComponent),
            );
            for (const node of nodes.values()) {
                delete node.attributes.name;
            }
            template.doenetAttributes = {
                ...template.doenetAttributes,
                repeatTemplate: true,
            };

            repeat.componentType = listType;
            repeat.attributes = listAttributes;
            repeat.children = [
                ...iterationLists.values(),
                template,
                ...constantChildren,
                ...constraints,
            ];
            return nComponents;
        };

        /** Whether `component` is in the template. */
        function isInside(component: SerializedComponent): boolean {
            let parent = parentByIdx.get(component.componentIdx);
            while (parent) {
                if (parent === template) {
                    return true;
                }
                parent = parentByIdx.get(parent.componentIdx);
            }
            return false;
        }

        function parentInTemplate(component: SerializedComponent) {
            return parentByIdx.get(component.componentIdx)!;
        }

        /**
         * Whether the template component `node` qualifies: of a type of
         * `TEMPLATE_TYPES`, with literal attributes of `NODE_ATTRIBUTES` and,
         * for the template itself, its author's name; holding text,
         * references that `classifyReference` accepts, and nested `<math>`s
         * that qualify. A `<number>` holds one child, which sugar made a
         * `<math>` around content of more than one piece.
         */
        function templateNodeQualifies(
            node: SerializedComponent,
            top: boolean,
        ): boolean {
            if (
                !(top
                    ? node.componentType in LIST_OF_TEMPLATE
                    : NESTED_TYPES.has(node.componentType)) ||
                node.extending !== undefined
            ) {
                return false;
            }
            const allowed = NODE_ATTRIBUTES[node.componentType];
            for (const [name, attribute] of Object.entries(node.attributes)) {
                if (name === "name") {
                    if (!top && authorName(node) !== undefined) {
                        return false;
                    }
                    continue;
                }
                if (name === "xs" && node.componentType === "point") {
                    // its coordinates, checked by `pointQualifies`
                    continue;
                }
                if (
                    !(top ? allowed.top : allowed.nested).has(
                        name.toLowerCase(),
                    ) ||
                    !isLiteral(attribute) ||
                    (!top &&
                        BOOLEAN_NODE_ATTRIBUTES.has(name.toLowerCase()) &&
                        !isPlainBooleanLiteral(attribute))
                ) {
                    return false;
                }
            }
            const children = node.children.filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
            if (node.componentType === "point") {
                return pointQualifies(node, children);
            }
            if (node.componentType === "number" && children.length > 1) {
                return false;
            }
            for (const child of children) {
                if (typeof child === "string") {
                    continue;
                }
                if (NESTED_TYPES.has(child.componentType)) {
                    if (!templateNodeQualifies(child, false)) {
                        return false;
                    }
                } else if (child.extending !== undefined) {
                    if (!classifyReference(child)) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            return true;
        }

        /**
         * Whether the template `<point>` `node`, with non-blank `children`,
         * qualifies: its coordinates (`xs`, which sugar made of its content)
         * each a nested `<math>` that qualifies, and its children
         * constraints that read the same values in every iteration and hold
         * no sampler (`hasPerIterationState`), which become the list's
         * (`constraints`).
         */
        function pointQualifies(
            node: SerializedComponent,
            children: (SerializedComponent | string)[],
        ): boolean {
            const xs = node.attributes.xs;
            if (xs?.type !== "component" || xs.component.extending) {
                return false;
            }
            const coordinates = xs.component.children.filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
            if (
                coordinates.length === 0 ||
                !coordinates.every(
                    (coordinate) =>
                        typeof coordinate !== "string" &&
                        coordinate.componentType === "math" &&
                        templateNodeQualifies(coordinate, false),
                )
            ) {
                return false;
            }
            for (const child of children) {
                if (
                    typeof child === "string" ||
                    !componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "_constraint",
                    }) ||
                    authorName(child) !== undefined ||
                    readsOtherThanConstants(child) ||
                    hasPerIterationState(child)
                ) {
                    return false;
                }
                constraints.push(child);
            }
            return true;
        }

        /**
         * Whether `component` holds a component that each iteration has a
         * state of its own for: one that draws random values from the
         * iteration's seed (a sampler), which, shared by the whole list,
         * would draw once for every entry. An input is rejected too, as a
         * precaution: inside a constraint it is not drawn, so no reader can
         * change it.
         */
        function hasPerIterationState(component: SerializedComponent): boolean {
            if (
                component.componentType in
                    componentInfoObjects.componentTypesCreatingVariants ||
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: component.componentType,
                    baseComponentType: "_input",
                })
            ) {
                return true;
            }
            return [
                ...component.children,
                ...Object.values(component.attributes).flatMap((attribute) =>
                    attribute.type === "component"
                        ? [attribute.component]
                        : attribute.type === "unresolved"
                          ? (attribute.children as (
                                SerializedComponent | string
                            )[])
                          : [],
                ),
            ].some(
                (child) =>
                    typeof child !== "string" && hasPerIterationState(child),
            );
        }

        /**
         * Whether anything in `component` reads a value that is not the same
         * in every iteration: the repeat's value or index, or the template.
         */
        function readsOtherThanConstants(component: SerializedComponent) {
            let reads = false;
            forEachReference([component], (reference) => {
                const refResolution = unwrapSource(
                    reference.extending!,
                ) as SerializedRefResolution;
                if (
                    forbidden.has(refResolution.nodeIdx) ||
                    pathReads(refResolution, forbidden)
                ) {
                    reads = true;
                }
            });
            return reads;
        }

        /**
         * Whether the reference `reference` in the template reads a value the
         * list can read: recorded in `entryReferences` or `constants`.
         */
        function classifyReference(reference: SerializedComponent): boolean {
            if (!("Ref" in reference.extending!)) {
                return false;
            }
            if (Object.keys(reference.attributes).length > 0) {
                return false;
            }
            const refResolution = reference.extending.Ref;
            const path = refResolution.unresolvedPath ?? [];

            // the value of a `<repeat>`, read as `$l[$i]` of its `for`
            if (refResolution.nodeIdx === valueDummyIdx) {
                if (path.length > 0 || reference.componentType !== "_copy") {
                    return false;
                }
                entryReferences.push({ reference, listIdx: forList!.nodeIdx });
                return true;
            }
            if (reference.componentType !== "_ref") {
                return false;
            }
            // the value or index of a `<repeatForSequence>`, or the index of
            // a `<repeat>`
            if (iterationLists.has(refResolution.nodeIdx)) {
                if (path.length > 0) {
                    return false;
                }
                entryReferences.push({ reference });
                return true;
            }
            if (forbidden.has(refResolution.nodeIdx)) {
                return false;
            }
            // `$l[$i]`
            if (
                path.length === 1 &&
                path[0].name === "" &&
                path[0].index.length === 1 &&
                readsIndexOnly(path[0].index[0].value)
            ) {
                if (!isEntryList(refResolution.nodeIdx)) {
                    return false;
                }
                entryReferences.push({ reference });
                return true;
            }
            // a value outside the template, the same in every iteration,
            // which the list reads as a math or number, as the template does
            // when the reference presents as one; a `<number>` reads a text
            // or boolean child (`<number>$t</number>`) its own way
            if (
                pathReads(refResolution, forbidden) ||
                !presentsAsMathOrNumber(reference)
            ) {
                return false;
            }
            constants.push(reference);
            return true;
        }

        /** Whether `value` is exactly the repeat's index, `$i`. */
        function readsIndexOnly(value: (SerializedComponent | string)[]) {
            const pieces = value.filter(
                (piece) => typeof piece !== "string" || piece.trim() !== "",
            );
            if (pieces.length !== 1 || typeof pieces[0] === "string") {
                return false;
            }
            const piece = pieces[0];
            if (!piece.extending || !("Ref" in piece.extending)) {
                return false;
            }
            const indexResolution = piece.extending.Ref;
            const indexList = iterationLists.get(indexResolution.nodeIdx);
            return (
                indexList?.componentType === "_repeatIndices" &&
                !indexResolution.unresolvedPath?.length
            );
        }
    }

    /**
     * For a `<repeat>`, the list its `for` is, when that is one reference to
     * a whole list (`$l`), whose entries are values of `ENTRY_VALUE_TYPES`
     * when the template reads them (`readsValue`).
     */
    function forListOf(repeat: SerializedComponent, readsValue: boolean) {
        const forAttribute = repeat.attributes.for;
        if (forAttribute?.type !== "component") {
            return;
        }
        const pieces = forAttribute.component.children.filter(
            (child) => typeof child !== "string" || child.trim() !== "",
        );
        if (pieces.length !== 1 || typeof pieces[0] === "string") {
            return;
        }
        const reference = pieces[0];
        if (
            !reference.extending ||
            !("Ref" in reference.extending) ||
            Object.keys(reference.attributes).length > 0
        ) {
            return;
        }
        const refResolution = reference.extending.Ref;
        if (refResolution.nodeIdx < 0) {
            return;
        }
        if (
            refResolution.unresolvedPath?.length ||
            !isEntryList(refResolution.nodeIdx, readsValue)
        ) {
            return;
        }
        return { nodeIdx: refResolution.nodeIdx };
    }

    /**
     * Whether the component under `nodeIdx` is a list whose entries are
     * values of `ENTRY_VALUE_TYPES`.
     */
    function isEntryList(nodeIdx: number, ofValueTypes = true) {
        const type = referentType(nodeIdx);
        if (type === undefined) {
            return false;
        }
        const entryType = (referentClass(nodeIdx, type) as any)
            ?.listEntryComponentType;
        return ofValueTypes
            ? ENTRY_VALUE_TYPES.has(entryType)
            : entryType !== undefined;
    }

    /**
     * Whether the repeat, or a component holding it, is referenced, copied or
     * extended from inside a `<graph>` (`$r`, or `<group extend="$g"/>` of a
     * `<group name="g">` around it), or copied or extended as one
     * (`<graph extend="$g"/>`), following copies of those copies, up to but
     * not including the document. A reference whose path reads a value or a
     * part of one (`$r[2]`, `$sec.title`) copies nothing that holds it:
     * where each iteration's component would be drawn and dragged at an
     * anchor of its own, which an entry of the list has none of.
     */
    function copiedIntoGraph(repeat: SerializedComponent) {
        const containers: number[] = [];
        const seen = new Set<number>();
        function addWithAncestors(idx: number) {
            for (
                let component = componentsByIdx.get(idx);
                component &&
                component.componentType !== "document" &&
                !seen.has(component.componentIdx);
                component = parentByIdx.get(component.componentIdx)
            ) {
                seen.add(component.componentIdx);
                containers.push(component.componentIdx);
            }
            if (!seen.has(idx)) {
                seen.add(idx);
                containers.push(idx);
            }
        }
        addWithAncestors(repeat.componentIdx);

        // The names of the repeat and what holds it, which a path to a copy
        // of one of them names.
        const containerNames = new Set<string>();
        for (const idx of containers) {
            const name = componentsByIdx.get(idx)?.attributes.name;
            if (name?.type === "primitive") {
                containerNames.add(String(name.primitive.value));
            }
        }
        // Whether a reference to `targetIdx` with the path left to resolve
        // `path` reads a value or a part: a name that is not the repeat's or
        // a container's, or an index into the repeat itself (an entry).
        // An index into a container (`$outer[1]` of an outer repeat, `$q[1]`
        // of a copy of a group) copies a whole child of it.
        const repeatNameAttribute = repeat.attributes.name;
        const repeatName =
            repeatNameAttribute?.type === "primitive"
                ? String(repeatNameAttribute.primitive.value)
                : undefined;
        // A container of the same name (`<group name="r">` around the
        // repeat `r`) leaves a path to the name ambiguous, so an index after
        // it is read as copying a child, which keeps the composite.
        const repeatNameIsOwn =
            containers.filter((idx) => {
                const name = componentsByIdx.get(idx)?.attributes.name;
                return (
                    name?.type === "primitive" &&
                    String(name.primitive.value) === repeatName
                );
            }).length <= 1;
        function readsAPart(
            targetIdx: number,
            path: SerializedRefResolutionPathPart[],
        ) {
            let atRepeat = targetIdx === repeat.componentIdx;
            for (const part of path) {
                if (part.name !== "") {
                    if (!containerNames.has(part.name)) {
                        return true;
                    }
                    atRepeat = part.name === repeatName && repeatNameIsOwn;
                }
                if (part.index.length > 0) {
                    if (atRepeat) {
                        return true;
                    }
                    atRepeat = false;
                }
            }
            return false;
        }

        for (let i = 0; i < containers.length; i++) {
            for (const { component } of referencesByTarget.get(containers[i]) ??
                []) {
                // A reference whose path reads a value or a part (`$r[2]`,
                // `$sec.title`) copies nothing that holds the repeat; a
                // reference to an entry in a graph is drawn as the list's
                // entry is. One whose path names only the repeat or what
                // holds it (`$q.r`, `$s2.p`, `$outer[1].gg`) copies it.
                const refResolution = unwrapSource(
                    component.extending!,
                ) as SerializedRefResolution;
                if (
                    readsAPart(
                        refResolution.nodeIdx,
                        refResolution.unresolvedPath ?? [],
                    )
                ) {
                    continue;
                }
                if (inGraph(component) || makesGraph(component)) {
                    return true;
                }
                addWithAncestors(component.componentIdx);
                const created = component.attributes.createComponentIdx;
                if (created?.type === "primitive") {
                    addWithAncestors(Number(created.primitive.value));
                }
            }
        }
        return false;
    }

    /**
     * Whether `component` is an `extend` or `copy` that makes a `<graph>`
     * (`<graph extend="$g"/>`), whose copies are drawn in it.
     */
    function makesGraph(component: SerializedComponent) {
        const created = component.attributes.createComponentOfType;
        if (created?.type !== "primitive") {
            return false;
        }
        const type =
            componentInfoObjects.componentTypeLowerCaseMapping[
                String(created.primitive.value).toLowerCase()
            ];
        return (
            type !== undefined &&
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: type,
                baseComponentType: "graph",
            })
        );
    }

    /** Whether `component` is inside a `<graph>`. */
    function inGraph(component: SerializedComponent) {
        let parent = parentByIdx.get(component.componentIdx);
        while (parent) {
            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: parent.componentType,
                    baseComponentType: "graph",
                })
            ) {
                return true;
            }
            parent = parentByIdx.get(parent.componentIdx);
        }
        return false;
    }
}

function addTo<K, V>(map: Map<K, V[]>, key: K, value: V) {
    const values = map.get(key);
    if (values) {
        values.push(value);
    } else {
        map.set(key, [value]);
    }
}

/** The name an author gave `component`, not one made for it. */
function authorName(component: SerializedComponent): string | undefined {
    const name = component.attributes.name;
    if (name?.type !== "primitive") {
        return undefined;
    }
    const value = String(name.primitive.value);
    return value.startsWith("_") ? undefined : value;
}

/** Add `node` and the components nested in it to `nodes`. */
function collectNodes(
    node: SerializedComponent,
    nodes: Map<number, SerializedComponent>,
) {
    nodes.set(node.componentIdx, node);
    for (const child of node.children) {
        if (typeof child !== "string" && child.extending === undefined) {
            collectNodes(child, nodes);
        }
    }
    // a point's coordinates
    const xs = node.attributes.xs;
    if (xs?.type === "component" && xs.component.extending === undefined) {
        collectNodes(xs.component, nodes);
    }
}

/**
 * The boolean attributes of a nested component, which the list reads itself
 * (`utils/repeatTemplate.js`), as only `true`, `false` or nothing.
 */
const BOOLEAN_NODE_ATTRIBUTES = new Set(["expand", "fixed"]);

/**
 * Whether the boolean `attribute` is written as `true`, `false` or nothing
 * (`expand`), which the list reads as a `<boolean>` would; another literal
 * (`expand="1"`) keeps the composite, whose `<boolean>` evaluates it.
 */
function isPlainBooleanLiteral(attribute: SerializedAttribute): boolean {
    if (attribute.type === "primitive") {
        return typeof attribute.primitive.value === "boolean";
    }
    if (attribute.type !== "component") {
        return false;
    }
    const value = attribute.component.state?.value;
    if (typeof value === "boolean") {
        return true;
    }
    const text = (attribute.component.children as string[])
        .join("")
        .trim()
        .toLowerCase();
    return text === "" || text === "true" || text === "false";
}

/**
 * Whether the value reference `reference` presents as a math or a number
 * (`presentedComponentType`), the types the template's codes read.
 */
function presentsAsMathOrNumber(reference: SerializedComponent): boolean {
    const presented = reference.doenetAttributes?.presentedComponentType;
    return (
        presented === "math" ||
        presented === "number" ||
        presented === "integer"
    );
}

/** Whether `attribute` is written as a literal, with no reference. */
function isLiteral(attribute: SerializedAttribute): boolean {
    if (attribute.type === "primitive") {
        return true;
    }
    if (attribute.type !== "component") {
        return false;
    }
    const component = attribute.component;
    return (
        component.extending === undefined &&
        component.children.every((child) => typeof child === "string")
    );
}

/**
 * Whether anything written in the path of `refResolution` (`$l[$i]`, the `$i`)
 * reads a component of `nodeIdxs`.
 */
function pathReads(
    refResolution: SerializedRefResolution,
    nodeIdxs: Set<number>,
): boolean {
    let reads = false;
    for (const path of [
        refResolution.originalPath,
        refResolution.unresolvedPath ?? [],
    ]) {
        for (const part of path) {
            for (const piece of part.index) {
                forEachReference(piece.value, (component) => {
                    const inner = unwrapSource(
                        component.extending!,
                    ) as SerializedRefResolution;
                    if (nodeIdxs.has(inner.nodeIdx)) {
                        reads = true;
                    }
                });
            }
        }
    }
    return reads;
}

/**
 * Call `visit` for every component of the tree that extends a reference,
 * with the reference attribute (`createReferences`) that names it, if any:
 * children, attribute components, the references of a reference attribute,
 * the children of an attribute not yet converted, and what is written
 * between the brackets of a reference's path.
 */
function forEachReference(
    components: (SerializedComponent | string)[],
    visit: (
        component: SerializedComponent,
        namedBy: NamedBy | undefined,
    ) => void,
    namedBy?: NamedBy,
) {
    for (const component of components) {
        if (typeof component === "string") {
            continue;
        }
        if (component.extending) {
            visit(component, namedBy);
            // what is written between the brackets of its path, held both
            // as written and as left to resolve
            const refResolution = unwrapSource(
                component.extending,
            ) as SerializedRefResolution;
            for (const path of [
                refResolution.originalPath,
                refResolution.unresolvedPath ?? [],
            ]) {
                for (const part of path) {
                    for (const piece of part.index) {
                        forEachReference(piece.value, visit);
                    }
                }
            }
        }
        forEachReference(component.children, visit);
        for (const [name, attribute] of Object.entries(component.attributes)) {
            if (attribute.type === "component") {
                forEachReference([attribute.component], visit);
            } else if (attribute.type === "references") {
                forEachReference(attribute.references, visit, {
                    componentType: component.componentType,
                    attribute: name,
                });
            } else if (attribute.type === "unresolved") {
                forEachReference(
                    attribute.children as (SerializedComponent | string)[],
                    visit,
                );
            }
        }
    }
}
