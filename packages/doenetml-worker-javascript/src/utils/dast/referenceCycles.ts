/**
 * Reference cycles decided at load, from the DoenetML alone (D14, NAME-7,
 * DIAG-7). A reference whose value depends, through what is written, on the
 * reference itself is a circular dependency: the reference is an error
 * (`doenet-e0005`) at where it is written, and the rest of the document
 * renders (DIAG-5). The cycle is found from the references the resolver
 * resolved, over everything written, so over every case of a
 * `<conditionalContent>`, every option of a `<select>` and every template of
 * a `<repeat>`, whether shown now or not: the same errors whatever the
 * reader does and whatever the variant (Doenet/DoenetML#2439, #2463, #2473).
 *
 * The graph has an edge from a component to each component its value is read
 * from:
 *
 * - a reference (`$x`, `$m[2]`, `$t.value`, `<math extend="$x"/>`,
 *   `<math copy="$x"/>`, `<math copyWithState="$x"/>`) to what it names, when
 *   it reads what is written there:
 *   - the component as a whole;
 *   - an index into a `<math>`, a `<mathList>` or a `<numberList>`, or a type
 *     built on one, such as a `<matrix>` (`$m[2]`), or a reference written as
 *     one (`<math name="m2" extend="$m">`), which reads the whole value;
 *   - a property that the tag named makes from what is written in it
 *     (`PROPERTIES_READ`: the `value` of a `<number>`, the `text` of a `<p>`),
 *     or, for an input, from the attribute it starts from (`INPUTS`: the
 *     `value` of a `<mathInput>`, from its `prefill`);
 *   - an index into a composite or a list of values made from its
 *     attributes (`MADE_FROM_ATTRIBUTES`: `$s[1]`, of a `<sequence>`, a
 *     `<select>`, a `<repeat>`, …), which reads those attributes (below),
 *     though not what is written in it: it names one of what it makes,
 *     decided only when it runs;
 *
 *   unless the index was taken through what a reference makes (`$h[1]` in
 *   `<group extend="$g" name="h">`, which names one of what the copy makes
 *   only when the document runs). Any other property (`$P.x`, `$x.hide`) may
 *   read nothing of what is written in `x`, an index into a `<textList>` or a
 *   `<booleanList>` reads one item (`<textList name="l"><text>a</text>
 *   <text>$l[1]</text></textList>` is valid), and an index into a `<text>`, a
 *   `<number>` or a `<boolean>` names nothing (`doenet-w0100`), so none of
 *   these is an edge, but for a reference written as a tag that names the
 *   tag itself, whatever its path (`<group name="g" extend="$g.x"/>`);
 * - a reference to the components in its index (`$i` in `$l[$i]`), which it
 *   reads to know what it names;
 * - a reference to a name the branches of a `<conditionalContent>` or a
 *   one-pick `<select>` declare (`$x`, `$cc.x`, D22), which the resolver
 *   leaves for the container to resolve, to what the name names in each
 *   branch (`branchReads`, from the type check), read as above, as any of
 *   them may be shown;
 * - a composite (`<conditionalContent>`, `<group>`, `<repeat>`, …), a
 *   `<case>` or an `<option>`, or a reference written as a composite that
 *   holds what is written in it too (`<group extend="$s">`, a `<module
 *   extend>`, or any composite written with `copy` or `copyWithState`; an
 *   `extend` of a `<repeat>` or another composite that makes its content
 *   makes nothing of what is written in it, `doenet-e0057`), to each
 *   child but a `<setup>`, as what it holds is made from them. A `<setup>`
 *   makes nothing, so it has no edges, though what is in it is checked;
 * - a composite or a list of values made from its attributes
 *   (`MADE_FROM_ATTRIBUTES`), to the components in its attributes, but those
 *   that only display or style it (`ATTRIBUTES_NOT_READ`), and in the
 *   `condition` of each `<case>` of a `<conditionalContent>` and the
 *   `selectWeight` of each `<option>` of a `<select>`. Not any composite: a
 *   `<collect>`'s `from` names what it collects from, which may hold it;
 * - a tag whose value is made from its children (`VALUE_FROM_CHILDREN`: a
 *   `<math>`, a `<text>`, a `<label>`, an `<em>`, …, which takes children, so
 *   not an `<evaluate>`), a tag whose content is its children
 *   (`CONTENT_FROM_CHILDREN`: a `<p>`, a `<section>`, a `<div>`, a `<li>`,
 *   …, a copy of which copies them, so that a reference to it in it holds
 *   itself), or a reference written as one, to each child;
 * - an input, to the components in the attributes its value starts from
 *   (`INPUTS`: `prefill`, `bindValueTo`, …), but not to its children.
 *
 * A component that takes a `<label>` as its label (a `<point>`, an input)
 * is none of these, so it has no edges to its children, and its label may
 * read it (`<point name="P"><label>$P</label></point>` means P's value,
 * #1384). A label that is content (`<label><label>$l</label></label>`,
 * `<m>`) is followed.
 *
 * Each table here lists what was found, tag by tag, to be a circular
 * dependency when the document ran before the cycle was decided at load: a
 * property or attribute not listed is not an edge, and a cycle through it is
 * still reported, or stops the document, when it is reached.
 *
 * Every reference in a strongly connected part of that graph with an edge
 * (a cycle) is made an `_error`, which breaks every cycle, as each cycle
 * holds a reference. A reference the type check already made an error
 * (`typeChangeAtLoad`, such as a tag extending the `<conditionalContent>`
 * holding it) has no edges, as it reads nothing.
 *
 * A cycle through a property or an attribute not listed, an index into a
 * composite in what that composite makes (`$r[1]` in the template of a
 * `<repeat name="r">`), a reference in the `<label>` of a component whose
 * value reads it, a component in the attributes of a component that is
 * not a composite or an input (`<math simplify="$m">`), or both the
 * `prefill` of a `<mathInput>` (or a few other attributes an input starts
 * from) and an index into a `<mathList>` or a `<numberList>`
 * (`INPUTS_READING_ONE_ENTRY`) is not found here; it is still reported,
 * or stops the document, when it is reached.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import type { BranchRead } from "./typeChangeAtLoad";
import { codedDiagnostic } from "../diagnostics";
import { errorComponentState } from "./errors";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * Tags whose value is made from their children, and the tags that inherit
 * from them: those `getSelfReferentialFallbackPropName` lists as the tags
 * whose own reference inside them reads their value, and the inline
 * containers.
 */
const VALUE_FROM_CHILDREN = [
    "label",
    "text",
    "math",
    "m",
    "md",
    "boolean",
    "number",
    "mathList",
    "numberList",
    "textList",
    "booleanList",
    // `<em>`, `<q>` and the other inline containers, whose text is their
    // children's, which a `<text>` holding them reads
    "_inlineRenderInlineChildren",
    // what an attribute of a `<selectFromSequence>`, a `<slider>`, … holds,
    // whose value is what is written in it
    "_componentWithSelectableType",
    "_componentListWithSelectableType",
];

/**
 * Tags whose content is their children, though their value is not made from
 * them: a copy of one copies its children, so a reference to one written in
 * it holds itself (`<p name="q">a $q</p>`), wherever in it the reference is.
 */
const CONTENT_FROM_CHILDREN = [
    "p",
    "div",
    "span",
    "li",
    "ol",
    "blockQuote",
    "pre",
    "footnote",
    "_sectioningComponent",
    // `<title>`, `<shortDescription>`
    "_textOrInline",
];

/**
 * The properties a tag makes from what is written in it, by the tag they
 * are of, each found to read it when the document runs. A tag is looked up
 * as the first it inherits from, in this order. Matched without regard to
 * case.
 */
export const PROPERTIES_READ: [string, string[]][] = [
    [
        "integer",
        [
            "value",
            "valuePreRound",
            "text",
            "math",
            "latex",
            "displayDigits",
            "displayDecimals",
            "displaySmallAsZero",
            "padZeros",
            "avoidScientificNotation",
        ],
    ],
    [
        "number",
        [
            "value",
            "text",
            "math",
            "latex",
            "displayDigits",
            "displayDecimals",
            "displaySmallAsZero",
            "padZeros",
            "avoidScientificNotation",
        ],
    ],
    [
        "math",
        [
            "value",
            "number",
            "isNumber",
            "isNumeric",
            "latex",
            "text",
            "numDimensions",
            "vector",
            "list",
            "matrixSize",
            "numRows",
            "numColumns",
            "matrix",
            "unordered",
            "displayDigits",
            "displayDecimals",
            "displaySmallAsZero",
            "padZeros",
            "avoidScientificNotation",
        ],
    ],
    [
        "text",
        [
            "value",
            "text",
            "math",
            "number",
            "numWords",
            "words",
            "numCharacters",
            "characters",
            "numListItems",
            "list",
        ],
    ],
    ["boolean", ["value", "text"]],
    ["label", ["value", "text", "latex", "hasLatex"]],
    ["m", ["latex", "text", "math"]],
    ["md", ["latex", "text"]],
    [
        "mathList",
        [
            "latex",
            "text",
            "numComponents",
            "mergeMathLists",
            "displayDigits",
            "displayDecimals",
            "displaySmallAsZero",
            "padZeros",
            "avoidScientificNotation",
        ],
    ],
    [
        "numberList",
        [
            "displayDigits",
            "displayDecimals",
            "displaySmallAsZero",
            "padZeros",
            "avoidScientificNotation",
        ],
    ],
    ["textList", ["text", "numComponents"]],
    ["booleanList", ["numComponents"]],
    ["_inlineRenderInlineChildren", ["text"]],
    ["_textOrInline", ["value", "text"]],
    ["p", ["text"]],
    ["li", ["text"]],
    ["footnote", ["text"]],
].map(([tag, properties]) => [
    tag as string,
    (properties as string[]).map((property) => property.toLowerCase()),
]);

/**
 * The inputs, by the tag they are of: the attributes their value starts
 * from or is bound to, and the properties made from it, each found to read
 * those attributes when the document runs. Matched without regard to case.
 */
export const INPUTS: [
    string,
    { attributes: string[]; properties: string[] },
][] = [
    [
        "mathInput",
        {
            attributes: ["prefill", "prefillLatex", "bindValueTo"],
            properties: [
                "value",
                "immediateValue",
                "text",
                "latex",
                "rawRendererValue",
                "numDimensions",
                "vector",
                "list",
                "matrixSize",
                "numRows",
                "numColumns",
                "matrix",
            ],
        },
    ],
    [
        "textInput",
        {
            attributes: ["prefill", "bindValueTo"],
            properties: [
                "value",
                "immediateValue",
                "text",
                "numWords",
                "words",
                "numCharacters",
                "characters",
                "numListItems",
                "list",
            ],
        },
    ],
    [
        "booleanInput",
        {
            attributes: ["prefill", "bindValueTo"],
            properties: ["value", "text"],
        },
    ],
    [
        "matrixInput",
        {
            attributes: ["prefill", "bindValueTo"],
            properties: [
                "value",
                "immediateValue",
                "text",
                "matrix",
                "numRows",
                "numColumns",
            ],
        },
    ],
    [
        "choiceInput",
        {
            attributes: ["preselectChoice", "bindValueTo"],
            properties: ["selectedIndices", "selectedValues"],
        },
    ],
    [
        "slider",
        {
            attributes: ["initialValue", "bindValueTo"],
            properties: ["value"],
        },
    ],
].map(([tag, input]: any) => [
    tag,
    {
        attributes: input.attributes.map((name: string) => name.toLowerCase()),
        properties: input.properties.map((name: string) => name.toLowerCase()),
    },
]);

/**
 * The attributes of an input, by the tag it is of, from which its value
 * starting from (or bound to) an index into a `<mathList>` or a
 * `<numberList>` that holds the input is not a cycle when the document runs:
 * `<mathList name="l">1 $mi</mathList><mathInput name="mi"
 * prefill="$l[1]"/>` is valid, as is the same through a `<math>` that reads
 * the index (`<math name="y">$l[1]</math>`, `prefill="$y"`). A cycle that
 * goes through both one of these attributes and an index into one of those
 * lists is not found here; it is still reported, or stops the document, when
 * it is reached (`prefill="$l[2]"`, which reads the input itself). Each
 * found when the document runs; read the same way, a `<choiceInput>`'s
 * `bindValueTo`, a `<slider>`'s `initialValue` and a `<textInput>`'s
 * `prefill` are each a cycle, so are found. Lower case.
 */
const INPUTS_READING_ONE_ENTRY: Record<string, string[]> = {
    mathinput: ["prefill", "prefilllatex", "bindvalueto"],
    matrixinput: ["prefill", "bindvalueto"],
    choiceinput: ["preselectchoice"],
};

/**
 * The composites, and the lists of values not written as their entries,
 * that are made from their attributes when the document runs, so that an
 * index into one reads them (`$a[1]` in `<sequence name="a" length="$a[1]"/>`
 * is a cycle). Each attribute of each was found to be read, but those in
 * `ATTRIBUTES_NOT_READ`. Not a `<collect>`, whose `from` names what it
 * collects from, not what it reads: one in the group it collects from is
 * valid.
 */
const MADE_FROM_ATTRIBUTES = [
    "conditionalContent",
    "select",
    "repeat",
    "repeatForSequence",
    "shuffle",
    "sort",
    // and `<selectFromSequence>`
    "sequence",
    "selectPrimeNumbers",
    // and `<selectRandomNumbers>`
    "sampleRandomNumbers",
];

/**
 * The attributes of a composite that only display or style what it makes,
 * not what it makes, so are not read when it is made (each found not to be
 * a cycle when the document runs). Lower case.
 */
const ATTRIBUTES_NOT_READ = new Set(
    [
        "name",
        "hide",
        "rendered",
        "disabled",
        "fixed",
        "fixLocation",
        "styleNumber",
        "displayDigits",
        "displayDecimals",
        "displaySmallAsZero",
        "padZeros",
        "avoidScientificNotation",
    ].map((name) => name.toLowerCase()),
);

/**
 * The attributes of a `<case>` of a `<conditionalContent>`, or of an
 * `<option>` of a `<select>`, that decide what the composite holding it
 * makes. Lower case.
 */
const BRANCH_ATTRIBUTES_READ: Record<string, string[]> = {
    conditionalContent: ["condition"],
    select: ["selectweight"],
};

/** The serialized components the attribute `attribute` holds. */
function componentsOfAttribute(attribute: any): SerializedComponent[] {
    const found: SerializedComponent[] = [];
    if (attribute?.component && typeof attribute.component === "object") {
        found.push(attribute.component);
    }
    for (const reference of attribute?.references ?? []) {
        if (typeof reference === "object" && reference !== null) {
            found.push(reference);
        }
    }
    for (const child of attribute?.children ?? []) {
        if (typeof child === "object" && child !== null) {
            found.push(child);
        }
    }
    return found;
}

/** The components written in the index of each part of `path`. */
function indexComponents(path: any[] | null | undefined) {
    const found: SerializedComponent[] = [];
    for (const part of path ?? []) {
        for (const piece of part?.index ?? []) {
            for (const value of piece?.value ?? []) {
                if (typeof value === "object" && value !== null) {
                    found.push(value);
                }
            }
        }
    }
    return found;
}

/** The reference a `_copy` is of, if it was resolved to a component. */
function referenceOf(copy: SerializedComponent) {
    const extending: any = copy.extending;
    if (!extending) {
        return undefined;
    }
    return (extending.Ref ??
        extending.ExtendAttribute ??
        extending.CopyAttribute ??
        extending.CopyWithStateAttribute) as
        | {
              nodeIdx: number;
              unresolvedPath: any[] | null;
              originalPath?: any[];
              nodesInResolvedPath?: number[];
          }
        | undefined;
}

/**
 * Make each reference on a cycle among `serializedComponents` an `_error`
 * with `doenet-e0005`, and return the diagnostics, to be reported at load.
 * `branchReads` is what each reference to a name the branches of a container
 * declare reads (`checkTypeChangesAtLoad`).
 */
export function breakReferenceCycles({
    serializedComponents,
    componentInfoObjects,
    branchReads = new Map(),
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    branchReads?: Map<SerializedComponent, BranchRead>;
}): DiagnosticRecord[] {
    const componentsByIdx = new Map<number, SerializedComponent>();
    // The same component can be written twice in a reference: an index is in
    // both the path as written and the path left unresolved. Each is made the
    // `_error`.
    const sameIdx = new Map<number, SerializedComponent[]>();
    const copiesByCreatedIdx = new Map<number, SerializedComponent>();
    // The edges from an input to what is in its attributes of
    // `INPUTS_READING_ONE_ENTRY`, and those from a reference to the
    // `<mathList>` or `<numberList>` it indexes, as `from>to`: a cycle
    // through one of each is not one (`INPUTS_READING_ONE_ENTRY`).
    const inputStartEdges = new Set<string>();
    const listIndexEdges = new Set<string>();

    function gather(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component === "string") {
                continue;
            }
            const existing = componentsByIdx.get(component.componentIdx);
            if (existing !== undefined) {
                if (existing !== component) {
                    sameIdx.set(component.componentIdx, [
                        ...(sameIdx.get(component.componentIdx) ?? []),
                        component,
                    ]);
                }
                continue;
            }
            componentsByIdx.set(component.componentIdx, component);
            const createdIdx = component.attributes?._createComponentIdx;
            if (
                component.componentType === "_copy" &&
                createdIdx?.type === "primitive"
            ) {
                copiesByCreatedIdx.set(
                    Number(createdIdx.primitive.value),
                    component,
                );
            }
            for (const attribute of Object.values(component.attributes ?? {})) {
                gather(componentsOfAttribute(attribute));
            }
            const reference = referenceOf(component);
            gather(indexComponents(reference?.unresolvedPath));
            gather(indexComponents(reference?.originalPath));
            gather(component.children ?? []);
        }
    }
    gather(serializedComponents);

    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }

    /**
     * Whether the tag `componentType` is `base` or inherits from it, through
     * its classes, so that a base no tag is written as (`_valueList`) is
     * found too.
     */
    function inherits(componentType: string, base: string) {
        let componentClass =
            componentInfoObjects.allComponentClasses[componentType];
        while (componentClass) {
            if (componentClass.componentType === base) {
                return true;
            }
            componentClass = Object.getPrototypeOf(componentClass);
        }
        return false;
    }

    /**
     * Whether the value of a component of type `componentType` is made from
     * its children: it inherits from a tag in `VALUE_FROM_CHILDREN` and takes
     * children (an `<evaluate>` is a `<math>` made from its attributes alone,
     * with no child groups, so a child written in it is never read).
     */
    function valueFromChildren(componentType: string | undefined) {
        if (
            componentType === undefined ||
            !VALUE_FROM_CHILDREN.some((base) => inherits(componentType, base))
        ) {
            return false;
        }
        const childGroups =
            componentInfoObjects.allComponentClasses[
                componentType
            ]?.returnChildGroups?.() ?? [];
        return childGroups.length > 0;
    }

    /** Whether what a component of type `componentType` holds is read. */
    function readsChildren(componentType: string | undefined) {
        return (
            componentType !== undefined &&
            (valueFromChildren(componentType) ||
                CONTENT_FROM_CHILDREN.some((base) =>
                    inherits(componentType, base),
                ))
        );
    }

    /** The entry of `table` for a component of type `componentType`. */
    function entryFor<T>(
        table: [string, T][],
        componentType: string | undefined,
    ): T | undefined {
        if (componentType === undefined) {
            return undefined;
        }
        return table.find(([base]) => inherits(componentType, base))?.[1];
    }

    /** The type a reference written as a tag makes, if it is one. */
    function writtenType(copy: SerializedComponent) {
        const written = copy.attributes?._createComponentOfType;
        if (written?.type !== "primitive") {
            return undefined;
        }
        return componentInfoObjects.componentTypeLowerCaseMapping[
            String(written.primitive.value).toLowerCase()
        ];
    }

    /**
     * The component the graph has for the resolver node `nodeIdx`: the
     * component, or the copy that makes it (`_createComponentIdx`).
     */
    function nodeFor(nodeIdx: number) {
        return componentsByIdx.get(nodeIdx) ?? copiesByCreatedIdx.get(nodeIdx);
    }

    /** The component the graph has for what `copy` is of, if resolved. */
    function targetOf(copy: SerializedComponent) {
        const reference = referenceOf(copy);
        return reference && reference.nodeIdx >= 0
            ? nodeFor(reference.nodeIdx)
            : undefined;
    }

    /** The type `node` has, or, for a reference, will be made as. */
    function typeOf(node: SerializedComponent) {
        return node.componentType === "_copy"
            ? writtenType(node)
            : node.componentType;
    }

    /**
     * Whether a component of type `componentType` is made from its
     * attributes when the document runs (`madeFromEdges`): one of
     * `MADE_FROM_ATTRIBUTES`.
     */
    function madeFromAttributes(componentType: string) {
        return MADE_FROM_ATTRIBUTES.some((base) =>
            inherits(componentType, base),
        );
    }

    /** The edges to the children of `component`, but a `<setup>`. */
    function childEdges(component: SerializedComponent) {
        const edges: number[] = [];
        for (const child of component.children ?? []) {
            if (typeof child === "string" || child.componentType === "setup") {
                // a `<setup>` is not part of what its parent holds or shows
                continue;
            }
            edges.push(child.componentIdx);
        }
        return edges;
    }

    /**
     * The node for what the composite or list of values `idx` is made from
     * (`madeFromEdges`), which an index into it reads, apart from a
     * composite, whose edges are to what is written in it too. Negative, so
     * apart from any index.
     */
    function madeFromNode(idx: number) {
        return -idx - 1;
    }

    /**
     * The edges from what the composite or list of values `composite` is
     * made from (`madeFromAttributes`): the
     * components in its attributes, but those that only display or style
     * it, and those in the attributes of its branches that decide which is
     * shown (`BRANCH_ATTRIBUTES_READ`).
     */
    function madeFromEdges(composite: SerializedComponent) {
        const edges: number[] = [];
        for (const [name, attribute] of Object.entries(
            composite.attributes ?? {},
        )) {
            if (!ATTRIBUTES_NOT_READ.has(name.toLowerCase())) {
                edges.push(
                    ...componentsOfAttribute(attribute).map(
                        (component) => component.componentIdx,
                    ),
                );
            }
        }
        const branchAttributes =
            BRANCH_ATTRIBUTES_READ[composite.componentType] ?? [];
        for (const branch of composite.children ?? []) {
            if (typeof branch === "string") {
                continue;
            }
            for (const [name, attribute] of Object.entries(
                branch.attributes ?? {},
            )) {
                if (branchAttributes.includes(name.toLowerCase())) {
                    edges.push(
                        ...componentsOfAttribute(attribute).map(
                            (component) => component.componentIdx,
                        ),
                    );
                }
            }
        }
        return edges;
    }

    /**
     * The edges from the input `input` to the components in the attributes
     * its value starts from (`INPUTS`).
     */
    function inputEdges(input: SerializedComponent) {
        const read = entryFor(INPUTS, input.componentType)?.attributes ?? [];
        const readingOneEntry =
            INPUTS_READING_ONE_ENTRY[input.componentType.toLowerCase()] ?? [];
        const edges: number[] = [];
        for (const [name, attribute] of Object.entries(
            input.attributes ?? {},
        )) {
            if (read.includes(name.toLowerCase())) {
                const readsOneEntry = readingOneEntry.includes(
                    name.toLowerCase(),
                );
                for (const component of componentsOfAttribute(attribute)) {
                    edges.push(component.componentIdx);
                    if (readsOneEntry) {
                        inputStartEdges.add(
                            `${input.componentIdx}>${component.componentIdx}`,
                        );
                    }
                }
            }
        }
        return edges;
    }

    /**
     * Whether `reference` has an index that the resolver took through a
     * component a reference makes (`$h[1]` in `<group extend="$g"
     * name="h">`): it resolves to what is written in that component, but
     * when the document runs it names one of what the copy makes, decided
     * then, so it is not an edge.
     */
    function indexThroughCopy(reference: {
        originalPath?: any[];
        nodesInResolvedPath?: number[];
    }) {
        const hasIndex = reference.originalPath?.some(
            (part: any) => part.index?.length > 0,
        );
        return Boolean(
            hasIndex &&
            reference.nodesInResolvedPath
                ?.slice(1, -1)
                .some(
                    (idx) =>
                        copiesByCreatedIdx.has(idx) ||
                        componentsByIdx.get(idx)?.componentType === "_copy",
                ),
        );
    }

    /**
     * The property `name` of a component of type `componentType`, in lower
     * case, as the public state variable an alias or an entry of an array
     * (`selectedIndex`, of `selectedIndices`) is of.
     */
    function propertyNamed(componentType: string, name: string) {
        let lower = name.toLowerCase();
        const info =
            componentInfoObjects.publicStateVariableInfo[componentType];
        for (const [alias, { target }] of Object.entries(
            info?.aliases ?? {},
        ) as [string, { target: string }][]) {
            if (alias.toLowerCase() === lower) {
                // `selectedIndex` is `selectedIndex1`, an entry
                lower = target.toLowerCase();
                break;
            }
        }
        // an entry of an array (`selectedIndex`, `selectedIndex2`)
        for (const [prefix, { arrayVariableName }] of Object.entries(
            info?.arrayEntryPrefixes ?? {},
        ) as [string, { arrayVariableName: string }][]) {
            const rest = lower.slice(prefix.length);
            if (
                lower.startsWith(prefix.toLowerCase()) &&
                /^[0-9_]*$/.test(rest)
            ) {
                return arrayVariableName.toLowerCase();
            }
        }
        return lower;
    }

    /**
     * The edges for the reference `from` that names `target` with `path`
     * left after it (`null` for the whole of it): what it reads there, as
     * listed in the comment at the top.
     */
    function readEdges(
        from: SerializedComponent,
        target: SerializedComponent,
        path: any[] | null,
    ) {
        if (path === null || path.length === 0) {
            return [target.componentIdx];
        }
        const targetType = typeOf(target);
        if (targetType === undefined) {
            return [];
        }
        if (
            path.every(
                (part: any) => part.name === "" && part.index?.length > 0,
            )
        ) {
            if (
                ["math", "mathList", "numberList"].some((base) =>
                    inherits(targetType, base),
                )
            ) {
                // reads the whole value
                if (
                    ["mathList", "numberList"].some((base) =>
                        inherits(targetType, base),
                    )
                ) {
                    listIndexEdges.add(
                        `${from.componentIdx}>${target.componentIdx}`,
                    );
                }
                return [target.componentIdx];
            }
            if (
                target.componentType !== "_copy" &&
                madeFromAttributes(targetType)
            ) {
                // one of what it makes, made from its attributes
                return [madeFromNode(target.componentIdx)];
            }
            return [];
        }
        const [first, ...rest] = path;
        if (
            typeof first?.name !== "string" ||
            first.name === "" ||
            rest.length > 0
        ) {
            return [];
        }
        const property = propertyNamed(targetType, first.name);
        if (
            entryFor(PROPERTIES_READ, targetType)?.includes(property) ||
            (target.componentType !== "_copy" &&
                entryFor(INPUTS, targetType)?.properties.includes(property))
        ) {
            return [target.componentIdx];
        }
        return [];
    }

    function edgesOf(component: SerializedComponent): number[] {
        const type = component.componentType;
        if (type === "_copy") {
            if (
                typeof component.doenetAttributes?.typeChangeAtLoad === "object"
            ) {
                // an error already, which reads nothing
                return [];
            }
            const edges: number[] = [];
            const reference = referenceOf(component);
            // what it names is read from its index
            edges.push(
                ...indexComponents(reference?.unresolvedPath).map(
                    (index) => index.componentIdx,
                ),
            );
            const branchRead = branchReads.get(component);
            const target = targetOf(component);
            if (branchRead) {
                // a name the branches declare: what it names in each
                for (const idx of branchRead.named) {
                    const named = nodeFor(idx);
                    if (named) {
                        edges.push(
                            ...readEdges(
                                component,
                                named,
                                branchRead.rest.length > 0
                                    ? branchRead.rest
                                    : null,
                            ),
                        );
                    }
                }
            } else if (target === component) {
                // made from itself (`<math name="z" extend="$z"/>`), whatever
                // the path: `<group name="g" extend="$g.x"/>` reads what it
                // makes too
                edges.push(component.componentIdx);
            } else if (target && !indexThroughCopy(reference!)) {
                edges.push(
                    ...readEdges(component, target, reference!.unresolvedPath),
                );
            }
            const written = writtenType(component);
            if (
                written !== undefined &&
                (readsChildren(written) ||
                    (isComposite(written) &&
                        (!(component.extending as any)?.ExtendAttribute ||
                            written === "group" ||
                            written === "module")))
            ) {
                // what is written in it is part of what it makes; an extend
                // of a composite that makes its own content (a `<repeat>`)
                // makes nothing of what is written in it, which is an error
                // of its own (`doenet-e0057`)
                edges.push(...childEdges(component));
            }
            return edges;
        }
        if (type === "setup") {
            // makes nothing, so `$s` of a `<setup name="s">` reads nothing of
            // what is written in it; what is in it is still checked
            return [];
        }
        if (madeFromAttributes(type)) {
            return [
                ...(isComposite(type) ? childEdges(component) : []),
                madeFromNode(component.componentIdx),
            ];
        }
        if (isComposite(type)) {
            return childEdges(component);
        }
        if (type === "case" || type === "option" || readsChildren(type)) {
            return childEdges(component);
        }
        if (entryFor(INPUTS, type)) {
            return inputEdges(component);
        }
        return [];
    }

    const edgesByIdx = new Map<number, number[]>();
    const onCycle = new Set<number>();

    function edges(idx: number) {
        let result = edgesByIdx.get(idx);
        if (result === undefined) {
            if (idx < 0) {
                const composite = componentsByIdx.get(-idx - 1);
                result = composite ? madeFromEdges(composite) : [];
            } else {
                const component = componentsByIdx.get(idx);
                result = component ? edgesOf(component) : [];
            }
            edgesByIdx.set(idx, result);
        }
        return result;
    }

    /**
     * Add to `onCycle` each node on a cycle of the graph without the edges
     * in `left`. Strongly connected parts (Tarjan), iteratively, as a
     * document can be deeper than the stack.
     */
    function findCycles(left: Set<string>) {
        const index = new Map<number, number>();
        const lowLink = new Map<number, number>();
        const onStack = new Set<number>();
        const stack: number[] = [];
        let nextIndex = 0;
        function outOf(idx: number) {
            return edges(idx).filter((next) => !left.has(`${idx}>${next}`));
        }

        for (const start of componentsByIdx.keys()) {
            if (index.has(start)) {
                continue;
            }
            const work: { idx: number; edge: number; out: number[] }[] = [
                { idx: start, edge: 0, out: outOf(start) },
            ];
            index.set(start, nextIndex);
            lowLink.set(start, nextIndex);
            nextIndex++;
            stack.push(start);
            onStack.add(start);

            while (work.length > 0) {
                const frame = work[work.length - 1];
                const out = frame.out;
                if (frame.edge < out.length) {
                    const next = out[frame.edge++];
                    if (!index.has(next)) {
                        index.set(next, nextIndex);
                        lowLink.set(next, nextIndex);
                        nextIndex++;
                        stack.push(next);
                        onStack.add(next);
                        work.push({ idx: next, edge: 0, out: outOf(next) });
                    } else if (onStack.has(next)) {
                        lowLink.set(
                            frame.idx,
                            Math.min(lowLink.get(frame.idx)!, index.get(next)!),
                        );
                    }
                    continue;
                }
                work.pop();
                if (work.length > 0) {
                    const parent = work[work.length - 1].idx;
                    lowLink.set(
                        parent,
                        Math.min(lowLink.get(parent)!, lowLink.get(frame.idx)!),
                    );
                }
                if (lowLink.get(frame.idx) === index.get(frame.idx)) {
                    const part: number[] = [];
                    let member: number;
                    do {
                        member = stack.pop()!;
                        onStack.delete(member);
                        part.push(member);
                    } while (member !== frame.idx);
                    if (part.length > 1 || out.includes(frame.idx)) {
                        part.forEach((idx) => onCycle.add(idx));
                    }
                }
            }
        }
    }

    // A cycle through both an attribute of an input of
    // `INPUTS_READING_ONE_ENTRY` and an index into a `<mathList>` or a
    // `<numberList>` is not one, so the cycles are those of the graph without
    // the one kind of edge, or without the other. Each node's edges are
    // marked as they are made, before they are searched, and all are made by
    // the first search, which reaches every node.
    findCycles(inputStartEdges);
    if (inputStartEdges.size > 0) {
        findCycles(listIndexEdges);
    }

    // In document order, so the errors are reported in the order written.
    // The type each names is read before any is made an `_error`, so that it
    // does not depend on that order.
    const members: [SerializedComponent, string | undefined][] = [];
    for (const [idx, component] of componentsByIdx) {
        if (!onCycle.has(idx) || component.componentType !== "_copy") {
            continue;
        }
        // for a name the branches declare, the type of what it names there,
        // not the container
        const branchNamed = branchReads.get(component)?.named[0];
        const target =
            branchNamed !== undefined
                ? nodeFor(branchNamed)
                : targetOf(component);
        const named = target ? typeOf(target) : undefined;
        // a reference in an index (`$n` in `$l[$n]`) is made an `<integer>`,
        // a tag the author did not write (#1919), so it names the type of
        // what it is of
        members.push([
            component,
            component.doenetAttributes?.isIndex
                ? (named ?? writtenType(component))
                : (writtenType(component) ?? named),
        ]);
    }
    const diagnostics: DiagnosticRecord[] = [];
    for (const [component, componentType] of members) {
        const diagnostic = codedDiagnostic({
            type: "error",
            code: "doenet-e0005",
            args: { componentType: componentType ?? "none" },
            position: component.position,
            sourceDoc: component.sourceDoc,
        });
        diagnostics.push(diagnostic);
        for (const errorComponent of [
            component,
            ...(sameIdx.get(component.componentIdx) ?? []),
        ] as any[]) {
            errorComponent.componentType = "_error";
            errorComponent.state = errorComponentState(
                diagnostic.message,
                diagnostic,
            );
            errorComponent.attributes = {};
            errorComponent.children = [];
            errorComponent.doenetAttributes = {};
            delete errorComponent.extending;
        }
    }
    return diagnostics;
}
