/**
 * The pass that makes a `<repeat>` or `<repeatForSequence>` whose template
 * is one value a list component (`_repeatValueList`,
 * `components/RepeatValueList.js`) in place of the composite it otherwise
 * is. Part of Doenet/DoenetML#2163 (F6), whose design is
 * `docs/f6-repeat-templates-as-lists.md`.
 *
 * The composite makes a copy of its template for each iteration. The list
 * keeps the template once, and computes the value of each entry from it, with
 * the values the template reads at that entry's index. Whether a repeat
 * qualifies is decided from the document, so anything about it that is only
 * known at run time keeps the composite. A repeat qualifies when:
 *
 * - its template is one `<math>` or `<number>`, whose content is text,
 *   references and further unnamed `<math>`s (`templateNodeQualifies`), with
 *   no attributes but those of `NODE_ATTRIBUTES`, each written as a literal;
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
 *   (`$r`), to one iteration (`$r[2]`), or to the template's component in an
 *   iteration (`$r[2].m`, which then reads the entry, `$r[2]`), and is not
 *   an `extend` or `copy`, or named by a reference attribute (a trigger, a
 *   label's `forObject`, a `<ref>`'s `to`), which an entry of a list cannot
 *   be yet (#2181, #2184, #2176);
 * - no reference reaches the template's name another way, as through an
 *   outer repeat (`$a[2][1][3].m`), which would name a component the list
 *   does not have;
 * - and it is not in a `<graph>`, where each iteration's component is placed
 *   at an anchor of its own and an entry of the list has none (#2186).
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
} from "./types";
import { unwrapSource } from "./convertNormalizedDast";
import { documentReferents } from "./valueReferences";
import { sequenceEntryComponentType } from "../sequence";

/** The types a template, and each component nested in it, can be. */
const TEMPLATE_TYPES = new Set(["math", "number"]);

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

    // Every reference of the document, with whether a reference attribute
    // names it (`createReferences`), as a trigger or a `<ref>`'s `to` does.
    const references: { component: SerializedComponent; named: boolean }[] = [];
    forEachReference(serializedComponents, (component, named) =>
        references.push({ component, named }),
    );

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
        if (inGraph(repeat)) {
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
            const entryType = sequenceEntryComponentType(
                repeat.attributes.type,
            );
            if (entryType === undefined || !ENTRY_VALUE_TYPES.has(entryType)) {
                return;
            }
        } else {
            forList = forListOf(repeat);
            if (forList === undefined) {
                return;
            }
            for (const child of setup?.children ?? []) {
                if (typeof child === "string") {
                    continue;
                }
                if (child.componentType !== "_placeholder") {
                    return;
                }
                valueDummyIdx = child.componentIdx;
            }
        }

        // The components of the template, by index.
        const nodes = new Map<number, SerializedComponent>();
        const topName = authorName(template);
        const constants: SerializedComponent[] = [];
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
        for (const { component, named } of references) {
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
            if (named || component.attributes.createComponentOfType) {
                return;
            }
            const path = refResolution.unresolvedPath ?? [];
            if (path.length === 0) {
                continue;
            }
            if (path[0].name !== "") {
                return;
            }
            if (path.length === 1) {
                continue;
            }
            if (
                path.length === 2 &&
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
        if (topName !== undefined) {
            for (const { component } of references) {
                const refResolution = unwrapSource(
                    component.extending!,
                ) as SerializedRefResolution;
                if (
                    !rewrites.includes(refResolution) &&
                    refResolution.originalPath
                        .slice(1)
                        .some((part) => part.name === topName)
                ) {
                    return;
                }
            }
        }

        return (nComponents: number) => {
            for (const refResolution of rewrites) {
                refResolution.unresolvedPath =
                    refResolution.unresolvedPath!.slice(0, 1);
                const [first, second] = refResolution.originalPath;
                if (second?.name === topName) {
                    refResolution.originalPath = [first];
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
                            originalPath: unwrapSource(reference.extending!)
                                .originalPath,
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
                entryType: {
                    type: "primitive",
                    name: "entryType",
                    primitive: {
                        type: "string",
                        value: template.componentType,
                    },
                },
            };
            for (const [name, attribute] of Object.entries(
                template.attributes,
            )) {
                if (name !== "name") {
                    listAttributes[name] = attribute;
                }
            }
            template.attributes = {};
            for (const node of nodes.values()) {
                delete node.attributes.name;
            }
            template.doenetAttributes = {
                ...template.doenetAttributes,
                repeatTemplate: true,
            };

            repeat.componentType = "_repeatValueList";
            repeat.attributes = listAttributes;
            repeat.children = [
                ...iterationLists.values(),
                template,
                ...constantChildren,
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
                !TEMPLATE_TYPES.has(node.componentType) ||
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
                if (
                    !(top ? allowed.top : allowed.nested).has(
                        name.toLowerCase(),
                    ) ||
                    !isLiteral(attribute)
                ) {
                    return false;
                }
            }
            const children = node.children.filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
            if (node.componentType === "number" && children.length > 1) {
                return false;
            }
            for (const child of children) {
                if (typeof child === "string") {
                    continue;
                }
                if (child.componentType === "math") {
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
            // a value outside the template, the same in every iteration
            if (pathReads(refResolution, forbidden)) {
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
     * a whole list whose entries are values of `ENTRY_VALUE_TYPES` (`$l`).
     */
    function forListOf(repeat: SerializedComponent) {
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
            !isEntryList(refResolution.nodeIdx)
        ) {
            return;
        }
        return { nodeIdx: refResolution.nodeIdx };
    }

    /**
     * Whether the component under `nodeIdx` is a list whose entries are
     * values of `ENTRY_VALUE_TYPES`.
     */
    function isEntryList(nodeIdx: number) {
        const type = referentType(nodeIdx);
        if (type === undefined) {
            return false;
        }
        const listClass = referentClass(nodeIdx, type) as any;
        return ENTRY_VALUE_TYPES.has(listClass?.listEntryComponentType);
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
 * with whether a reference attribute (`createReferences`) names it: children,
 * attribute components, the references of a reference attribute, the
 * children of an attribute not yet converted, and what is written between the
 * brackets of a reference's path.
 */
function forEachReference(
    components: (SerializedComponent | string)[],
    visit: (component: SerializedComponent, named: boolean) => void,
    named = false,
) {
    for (const component of components) {
        if (typeof component === "string") {
            continue;
        }
        if (component.extending) {
            visit(component, named);
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
        for (const attribute of Object.values(component.attributes)) {
            if (attribute.type === "component") {
                forEachReference([attribute.component], visit);
            } else if (attribute.type === "references") {
                forEachReference(attribute.references, visit, true);
            } else if (attribute.type === "unresolved") {
                forEachReference(
                    attribute.children as (SerializedComponent | string)[],
                    visit,
                );
            }
        }
    }
}
