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
 *   - of an `<answer>`, its responses
 *     (`ANSWER_PROPERTIES_READ`), which are made from its awards and inputs
 *     (`<when>$a.currentResponse=5</when>` in an award of `a`);
 *   - an index into a composite or a list of values made from its
 *     attributes (`MADE_FROM_ATTRIBUTES`: `$s[1]`, of a `<sequence>`, a
 *     `<select>`, a `<repeat>`, …), which reads those attributes (below),
 *     and, for an index written as a number, what is written in it too
 *     (`$r[1]` in the template of `<repeat name="r">`, which its first
 *     iteration holds), or, with a name after it (`$r[1].m`), what the name
 *     names in what is written in it. An index that is not a number names
 *     one of what it makes decided only when it runs (`$r[$i-1].m` in the
 *     template reads the iteration before), so reads only the attributes;
 *   - an index into a `<textList>` or a `<booleanList>` written as one of its
 *     own entries (`<booleanList name="l">true $l[5]</booleanList>`), as how
 *     many entries the list has is made from what it holds;
 *   - a `<collect>` made a list of values (`collectIsListFormAsWritten`), as
 *     a whole or by an index, which reads the values of what it collects
 *     from (below);
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
 * - a whole reference to a graphical component (a `<point>`, a `<line>`, …)
 *   that copies the component, label and all, to its `<label>`, and those of
 *   what it extends: one written as content (in a `<p>`, a `<span>`, an
 *   `<em>`), and a `$` reference anywhere the value-reference pass leaves it
 *   a copy rather than reading its value (in a `<label>`, a `<text>`, an
 *   `<m>`, a `<group>`; not in a `<math>` or a `<number>`), so that `$b` in
 *   the label of `a` holds itself when `b` extends or copies `a`
 *   (Doenet/DoenetML#2643 item 1). `$P` in a `<p>` in the label of `P` holds
 *   itself; inside `P` but not as content, `<label>$P</label>`, it reads P's
 *   value and does not (#1384);
 * - a reference to the `hidden` of a component (`$n.hidden`), to the
 *   components in its `hide` and in the `hide` of each component it is
 *   written in, as whether it is hidden reads whether they are
 *   (Doenet/DoenetML#2643 item 10);
 * - a reference to the components in its index (`$i` in `$l[$i]`), which it
 *   reads to know what it names;
 * - a reference to a name the branches of a `<conditionalContent>` or a
 *   one-pick `<select>` declare (`$x`, `$cc.x`, D22), which the resolver
 *   leaves for the container to resolve, to what the name names in each
 *   branch (`branchReads`, from the type check), read as above, as any of
 *   them may be shown, and to what decides which is shown (the `condition`
 *   of each case reading `$cc.x` is a cycle);
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
 *   `<collect>`'s `from` names what it collects from, which may hold it, but
 *   for a `<collect>` made a list of values, which reads them all;
 * - a tag whose value is made from its children (`VALUE_FROM_CHILDREN`: a
 *   `<math>`, a `<text>`, a `<label>`, an `<em>`, …, which takes children, so
 *   not an `<evaluate>`), a tag whose content is its children
 *   (`CONTENT_FROM_CHILDREN`: a `<p>`, a `<section>`, a `<div>`, a `<li>`,
 *   …, a copy of which copies them, so that a reference to it in it holds
 *   itself), or a reference written as one, to each child;
 * - an input, to the components in the attributes its value starts from
 *   (`INPUTS`: `prefill`, `bindValueTo`, …), but not to its children;
 * - a tag that is neither a composite nor an input, to the components in
 *   the attributes it is made from (`ATTRIBUTES_READ`: the `simplify` of a
 *   `<math>`, the `input` of an `<evaluate>`, so `$$f($n)` in `n`), and
 *   through what each attribute is made as;
 * - an `<award>` or a `<considerAsResponses>`, to each child;
 * - a reference to the number of a sectioning component
 *   (`NUMBER_PROPERTIES`: `$s.sectionNumber`, `$s.title`, …), to the
 *   expansion of each composite before it that its numbering waits for
 *   (`compositesNumberingWaitsFor`, #2614 item 2). The expansion of a
 *   composite (`expansionEdges`) is to what its count is made from
 *   (`countEdges`: what it is made from but what only chooses a case, the
 *   `condition` of a `<conditionalContent>` or a `<case>` and the
 *   `selectWeight` of an `<option>`, D61 decision 1), to the index
 *   of a reference and the expansion of what it is of (and, for an item of
 *   a repeat or a select, `$r[1]`, of the composites written in the item,
 *   though not to its values), to the expansion of
 *   each composite in it the numbering would wait for, and, for a
 *   `<collect>`, to the expansion of what it collects from; not to the
 *   values of what it holds, which the number does not read (`$s.title` in
 *   a section a `<repeat>` before `s` makes is valid).
 *
 * A component that takes a `<label>` as its label (a `<point>`, an input)
 * has no edge to its label, and its label may read it (`<point
 * name="P"><label>$P</label></point>` means P's value, #1384), but for a
 * copy of the component in it as content (above). A label that is content
 * (`<label><label>$l</label></label>`, `<m>`) is followed.
 *
 * Each table here lists what was found, tag by tag, to be a circular
 * dependency when the document ran before the cycle was decided at load: a
 * property or attribute not listed is not an edge, and a cycle through it is
 * still reported when it is reached: at load, by the run-time backstop, which
 * builds the document again with one node on it as `doenet-e0005` (D57,
 * `loadCycleBlame.ts`), and after load, by stopping the document.
 *
 * Every reference in a strongly connected part of that graph with an edge
 * (a cycle) is made an `_error`, which breaks every cycle, as each cycle
 * holds a reference. A reference the type check already made an error
 * (`typeChangeAtLoad`, such as a tag extending the `<conditionalContent>`
 * holding it) has no edges, as it reads nothing.
 *
 * A cycle through a property or an attribute not listed (`$n.hide` in
 * `<number name="n">`), through the coordinates of points, lines and
 * polygons (`<polygon name="p" vertices="(1,2) (3,4) $p.vertex1"/>`, a
 * point constrained to a line through it), which are read coordinate by
 * coordinate, so that points reading each other's other coordinate are
 * valid (`<point name="P1">($P2.y, 2)</point><point name="P2">($P1.y,
 * 1)</point>`) and are not decided by a graph of whole components, an index into a composite in what it makes that is
 * not written as a number (`$r[$n]`), or both the `prefill` of a
 * `<mathInput>` (or a few other attributes an input starts from) and an
 * index into a `<mathList>` or a `<numberList>` whose entry the list does
 * not say (`INPUTS_READING_ONE_ENTRY`) is not found here; it is still
 * reported when it is reached, as above (Doenet/DoenetML#2515).
 *
 * The edges from a reference to a section's number are a prediction of what
 * the run time waits for. D57 makes it an optimization: a cycle it misses is
 * caught by the backstop, so it should err toward a missing edge rather than
 * an extra one, which is a false `doenet-e0005`. A cycle through what a
 * composite counts (`<repeatForSequence to="$s.sectionNumber">`) runs away
 * without throwing, so only the edge stops it; a cycle through what chooses
 * a case can only flip it, so it has no edge, and the run time settles,
 * reports a loop at the composite, or throws and the backstop catches it
 * (D61 decision 1). A generated test checks it against the run time
 * (`T/diagnostics/sectionNumberingDifferential.test.ts`, with
 * `setSectionNumberEdges`).
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import type { BranchRead } from "./typeChangeAtLoad";
import { codedDiagnostic } from "../diagnostics";
import { errorComponentState } from "./errors";
import type { DiagnosticRecord } from "@doenet/utils";
import { collectIsListFormAsWritten } from "./listForms";
import {
    planReferentAdapterReference,
    planValueReference,
    staticValueReferenceTarget,
} from "../valueReference";
import {
    compositesExpandedIn,
    compositesNumberingWaitsFor,
    compositesWaitedForIn,
    NUMBER_PROPERTIES,
} from "./sectionNumberingAtLoad";
import {
    listSplittingFromAttribute,
    splitListEntries,
} from "../../components/commonsugar/lists";

/** Whether a reference to a section's number has its edges (`setSectionNumberEdges`). */
let sectionNumberEdgesOn = true;

/**
 * Turn on or off the edges from a reference to a section's number to what
 * its numbering waits for, returning what it was. For tests only: the
 * generated differential test runs a document with them off, so the run
 * time alone decides whether it is a cycle (D57).
 */
export function setSectionNumberEdges(on: boolean): boolean {
    const was = sectionNumberEdgesOn;
    sectionNumberEdgesOn = on;
    return was;
}

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
            // (its `text` and `latex` are its entries', which name nothing
            // after it, D59)
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
    ["textList", ["numComponents"]],
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
 * lists is found here only for an index written as a number into a list
 * whose entry it names is a child the list says (`entryChild`:
 * `prefill="$l[2]"`, which reads the input itself); otherwise it is still
 * reported when it is reached. Each
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
 * The tags, neither a composite nor an input, made from some of their
 * attributes, by the tag they are of: those attributes, each found to be
 * read when the document runs (`<math name="m" simplify="$m=1">`), and the
 * properties made from them, beyond those of `PROPERTIES_READ`, each found
 * the same way (none yet: those of a shape are read coordinate by
 * coordinate, see the top). A tag is looked up as the first it inherits
 * from, in this order. Any other
 * attribute (`hide`, `displayDigits`, `draggable`, `styleNumber`) is not
 * read to make the value. Matched without regard to case.
 */
export const ATTRIBUTES_READ: [
    string,
    { attributes: string[]; properties: string[] },
][] = [
    [
        // a `<math>` made from its attributes alone
        "evaluate",
        {
            attributes: [
                "function",
                "input",
                "forceSymbolic",
                "forceNumeric",
                "simplify",
                "expand",
                "unordered",
                "createVectors",
                "createIntervals",
                "assumptions",
            ],
            properties: [],
        },
    ],
    [
        "math",
        {
            attributes: [
                "format",
                "simplify",
                "expand",
                "unordered",
                "createVectors",
                "createIntervals",
                "functionSymbols",
                "splitSymbols",
                "parseScientificNotation",
                "assumptions",
            ],
            properties: [],
        },
    ],
    [
        "boolean",
        {
            attributes: [
                "symbolicEquality",
                "expandOnCompare",
                "simplifyOnCompare",
                "unorderedCompare",
                "matchByExactPositions",
                "allowedErrorInNumbers",
                "includeErrorInNumberExponents",
                "allowedErrorIsAbsolute",
                "numSignErrorsMatched",
                "numPeriodicSetMatchesRequired",
                "caseInsensitiveMatch",
                "matchBlanks",
            ],
            properties: [],
        },
    ],
    [
        "mathList",
        {
            attributes: [
                "maxNumber",
                "unordered",
                "mergeMathLists",
                "functionSymbols",
                "splitSymbols",
                "parseScientificNotation",
            ],
            properties: [],
        },
    ],
    ["numberList", { attributes: ["maxNumber", "unordered"], properties: [] }],
    ["textList", { attributes: ["maxNumber", "unordered"], properties: [] }],
    ["booleanList", { attributes: ["maxNumber", "unordered"], properties: [] }],
].map(([tag, read]: any) => [
    tag,
    {
        attributes: read.attributes.map((name: string) => name.toLowerCase()),
        properties: read.properties.map((name: string) => name.toLowerCase()),
    },
]);

/**
 * The properties of an `<answer>` made from its responses, which are made
 * from what is written in its `<award>`s and inputs, each found to be read
 * when the document runs: `<when>$a.currentResponse=5</when>` in an award of
 * `a` is a cycle, as the answer reads every value written in its awards to
 * find which are responses. Lower case.
 */
const ANSWER_PROPERTIES_READ = [
    "currentresponses",
    "numresponses",
    "justsubmitted",
];

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

/**
 * The attributes of a composite of `MADE_FROM_ATTRIBUTES` that only choose
 * which of its cases is shown, never how many components it makes from
 * them: the `condition` of a `<conditionalContent>` (the sugar for one
 * case). Lower case. With the attributes of its branches
 * (`BRANCH_ATTRIBUTES_READ`), they are not read by its count (`countEdges`,
 * D61 decision 1).
 */
const CASE_CHOICE_ATTRIBUTES: Record<string, string[]> = {
    conditionalContent: ["condition"],
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
 * What a load that stopped on a circular dependency blamed, for the rebuild
 * (D57, `blameLoadCycle`): the authored node blamed and the authored nodes
 * on the cycle. `made` is set to the component the cycle check made the
 * error.
 */
export type LoadCycle = {
    blamed: number;
    onCycle: Set<number>;
    /**
     * The state variables the cycle runs through, lower case, of the
     * authored nodes on it the run time named (or copies of them), when the
     * check that found the cycle knew them.
     */
    variablesOnCycle?: Map<number, Set<string>>;
    made?: number;
};

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
    loadCycles = [],
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    branchReads?: Map<SerializedComponent, BranchRead>;
    /**
     * What each load that stopped on a circular dependency blamed, when it
     * is rebuilt (D57, D61 decision 2, `blameLoadCycle`), in the order
     * blamed, each made `doenet-e0005` as though found on a cycle, whatever
     * its type.
     */
    loadCycles?: LoadCycle[];
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
    // For an edge of `listIndexEdges` from a literal index to the one child
    // of the list its entry is made from, that child: through an input of
    // `INPUTS_READING_ONE_ENTRY`, the index reads that entry alone
    // (`entryChild`).
    const listEntryEdges = new Map<string, number>();
    // The component each component is written in, as a child.
    const parentOf = new Map<number, SerializedComponent>();

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
            for (const child of component.children ?? []) {
                if (typeof child === "object" && child !== null) {
                    parentOf.set(child.componentIdx, component);
                }
            }
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
        return componentInfoObjects.componentTypeAsWritten(
            String(written.primitive.value),
        );
    }

    /**
     * The component the graph has for the resolver node `nodeIdx`: the
     * component, or the copy that makes it (`_createComponentIdx`).
     */
    function nodeFor(nodeIdx: number) {
        return componentsByIdx.get(nodeIdx) ?? copiesByCreatedIdx.get(nodeIdx);
    }

    /**
     * The references (`_copy`) written in `component`, in its attributes,
     * the index of its reference and its children, at any depth, in document
     * order, into `found`, each with how many of the components in
     * `within` (below `component`) it is written in.
     */
    function gatherCopiesIn(
        component: SerializedComponent,
        within: Set<number>,
        found: { copy: SerializedComponent; depth: number }[],
        depth = 0,
    ) {
        const inside: SerializedComponent[] = [];
        for (const attribute of Object.values(component.attributes ?? {})) {
            inside.push(...componentsOfAttribute(attribute));
        }
        inside.push(...indexComponents(referenceOf(component)?.unresolvedPath));
        for (const child of component.children ?? []) {
            if (typeof child === "object" && child !== null) {
                inside.push(child);
            }
        }
        for (const one of inside) {
            if (one.componentType === "_copy") {
                found.push({ copy: one, depth });
            }
            gatherCopiesIn(
                one,
                within,
                found,
                depth + (within.has(one.componentIdx) ? 1 : 0),
            );
        }
    }

    /**
     * Whether `copy` is a reference to a section's number
     * (`$s.sectionNumber`, `$s.title`, …: `NUMBER_PROPERTIES`).
     */
    function isReferenceToNumber(copy: SerializedComponent) {
        const path = referenceOf(copy)?.unresolvedPath;
        const target = targetOf(copy);
        const targetType = target ? typeOf(target) : undefined;
        return (
            targetType !== undefined &&
            path?.length === 1 &&
            typeof path[0]?.name === "string" &&
            inherits(targetType, "_sectioningComponent") &&
            NUMBER_PROPERTIES.has(propertyNamed(targetType, path[0].name))
        );
    }

    /**
     * The first reference to the number of a section in `onCycle`, in
     * document order, among the components `onCycle` and the references
     * written in their attributes (D57, rule 1), if there is one. Of a
     * component whose state variables on the cycle are known
     * (`variablesOnCycle`), only the attributes the cycle runs through, those
     * with a state variable on it (`a`, or `__a_…` of an expression
     * attribute, `expressionAttributePrefix`): a reference in another
     * attribute (`displayDigits="$s.sectionNumber"` of a `<number>` whose
     * `hide` makes the cycle) is not where the cycle is, and the error there
     * would tell the author so.
     */
    function referenceToNumberOnCycle(
        onCycle: Set<number>,
        variablesOnCycle?: Map<number, Set<string>>,
    ) {
        const references: SerializedComponent[] = [];
        for (const idx of onCycle) {
            const component = componentsByIdx.get(idx);
            if (!component) {
                continue;
            }
            if (component.componentType === "_copy") {
                references.push(component);
            }
            const variables = variablesOnCycle?.get(idx);
            for (const [name, attribute] of Object.entries(
                component.attributes ?? {},
            )) {
                const lower = name.toLowerCase();
                if (
                    variables &&
                    !variables.has(lower) &&
                    ![...variables].some((variable) =>
                        variable.startsWith(`__${lower}_`),
                    )
                ) {
                    continue;
                }
                // the references of an expression attribute the cycle runs
                // through, when the run time names them (`__a_ref0_value`):
                // in `hide="$s.hidden and $s.sectionNumber=1"`, on a cycle
                // through `$s.hidden`, not `$s.sectionNumber`
                const slotsOnCycle = new Set<number>();
                for (const variable of variables ?? []) {
                    const match = /^__(.*)_ref(\d+)_/.exec(variable);
                    if (match?.[1] === lower) {
                        slotsOnCycle.add(Number(match[2]));
                    }
                }
                const slots =
                    slotsOnCycle.size > 0
                        ? slotReferencesOf(attribute)
                        : undefined;
                if (slots) {
                    references.push(
                        ...slots.filter((_, slot) => slotsOnCycle.has(slot)),
                    );
                    continue;
                }
                for (const one of componentsOfAttribute(attribute)) {
                    if (one.componentType === "_copy") {
                        references.push(one);
                    }
                    const inside: {
                        copy: SerializedComponent;
                        depth: number;
                    }[] = [];
                    gatherCopiesIn(one, new Set(), inside);
                    references.push(...inside.map(({ copy }) => copy));
                }
            }
        }
        const order = new Map(
            [...componentsByIdx.keys()].map((idx, i) => [idx, i]),
        );
        // to a section on the cycle: a reference to the number of another
        // section, in an attribute of a node on it, is not on it
        return references
            .filter(
                (copy) =>
                    isReferenceToNumber(copy) &&
                    onCycle.has(targetOf(copy)!.componentIdx),
            )
            .sort(
                (a, b) =>
                    order.get(a.componentIdx)! - order.get(b.componentIdx)!,
            )[0];
    }

    /**
     * The references of the attribute `attribute`, in the order of the slots
     * of the expression attribute it is made (`expressionAttributes.ts`): the
     * references written in its component (a `hide`'s `<boolean>`), or in
     * each coordinate of a `<mathList>` (a point's `xs`), in order. Or
     * `undefined` where that is not what it holds, so the slots can't be
     * told apart.
     */
    function slotReferencesOf(
        attribute: any,
    ): SerializedComponent[] | undefined {
        const component = attribute?.component;
        if (typeof component !== "object" || component === null) {
            return undefined;
        }
        const pieces =
            component.componentType === "mathList"
                ? (component.children ?? []).flatMap((child: any) =>
                      typeof child === "object" && child !== null
                          ? (child.children ?? [])
                          : [],
                  )
                : (component.children ?? []);
        const references = pieces.filter(
            (piece: any) => typeof piece === "object" && piece !== null,
        );
        return references.every(
            (piece: SerializedComponent) => piece.componentType === "_copy",
        )
            ? references
            : undefined;
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
        // what sugar leaves in the `coords` of a point that its value is not
        // made from (`<point><shortDescription>$P</shortDescription>(1,2)`)
        const coords = inherits(component.componentType, "coords");
        for (const child of component.children ?? []) {
            if (typeof child === "string" || child.componentType === "setup") {
                // a `<setup>` is not part of what its parent holds or shows
                continue;
            }
            if (
                coords &&
                ["_textOrInline", "label"].some((base) =>
                    inherits(child.componentType, base),
                )
            ) {
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
     * The node for the responses of the `<answer>` `idx`
     * (`ANSWER_PROPERTIES_READ`), apart from the answer, which a reference
     * to the answer as a whole reads without its awards (`<when>$a=5</when>`
     * in an award of `a` is valid). Negative, apart from `madeFromNode`.
     */
    const RESPONSES = 2 ** 40;
    function responsesNode(idx: number) {
        return -RESPONSES - idx;
    }

    /**
     * The node for the expansion of the composite `idx`: what it reads to
     * make its components (`expansionEdges`), which is what the number of a
     * section after it waits for, apart from the composite, whose edges are
     * to the values of what is written in it too. Negative, apart from
     * `madeFromNode` and `responsesNode`.
     */
    const EXPANSION = 2 * RESPONSES;
    function expansionNode(idx: number) {
        return -EXPANSION - idx;
    }

    /**
     * The node for what the count of the composite `idx` is made from
     * (`countEdges`): how many components its expansion makes, which the
     * number of a section after it waits for, apart from which of its cases
     * is shown (D61 decision 1). Negative, apart from the other nodes.
     */
    const COUNT = 3 * RESPONSES;
    function countNode(idx: number) {
        return -COUNT - idx;
    }

    /**
     * The composites an item of which (`$r[1]`) is made from what is written
     * in an iteration or in an option, whichever the item is.
     */
    const ITEMS_OF_TEMPLATES = new Set([
        "repeat",
        "repeatForSequence",
        "select",
    ]);

    /**
     * The edges from the responses of the `<answer>` `answer`: to its
     * awards, which it reads every value written in to find its responses,
     * to what it takes as responses, and to its inputs.
     */
    function responsesEdges(answer: SerializedComponent) {
        const edges: number[] = [];
        for (const child of answer.children ?? []) {
            if (
                typeof child === "object" &&
                (inherits(child.componentType, "award") ||
                    inherits(child.componentType, "considerAsResponses") ||
                    inherits(child.componentType, "_input"))
            ) {
                edges.push(child.componentIdx);
            }
        }
        return edges;
    }

    /** The edges to the components in the attribute `name` of `component`. */
    function attributeEdges(component: SerializedComponent, names: string[]) {
        const edges: number[] = [];
        for (const [name, attribute] of Object.entries(
            component.attributes ?? {},
        )) {
            if (names.includes(name.toLowerCase())) {
                edges.push(
                    ...componentsOfAttribute(attribute).map(
                        (read) => read.componentIdx,
                    ),
                );
            }
        }
        return edges;
    }

    /** The name written on `component`, if a literal. */
    function nameOf(component: SerializedComponent) {
        const attribute: any = component.attributes?.name;
        if (attribute?.type === "primitive") {
            return String(attribute.primitive.value);
        }
        const children = attribute?.component?.children ?? attribute?.children;
        if (
            Array.isArray(children) &&
            children.every((child: unknown) => typeof child === "string")
        ) {
            return children.join("").trim();
        }
        return undefined;
    }

    /**
     * The components named `name` written in `root`, at any depth: what a
     * name after an index into `root` (`$r[1].m`) can name in the item the
     * index names, which is made from it. Every one, not the first: in
     * branches (a case and the `<else>` each naming `m`) which one the item
     * holds is decided when the document runs, and a cycle through any
     * branch is reported, whichever branch is written first (NAME-7).
     */
    function namedIn(root: SerializedComponent, name: string) {
        const lower = name.toLowerCase();
        const found: SerializedComponent[] = [];
        const toSearch = [...(root.children ?? [])];
        while (toSearch.length > 0) {
            const component = toSearch.shift()!;
            if (typeof component !== "object") {
                continue;
            }
            if (nameOf(component)?.toLowerCase() === lower) {
                found.push(component);
            }
            if (
                component.componentType === "repeat" ||
                component.componentType === "repeatForSequence"
            ) {
                // the names in a nested template are its iterations', not
                // the item's
                continue;
            }
            toSearch.push(...(component.children ?? []));
        }
        return found;
    }

    /** Whether each part of `parts` is an index written as a number. */
    function literalIndices(parts: any[]) {
        return parts.every(
            (part: any) =>
                part.index?.length > 0 &&
                part.index.every(
                    (piece: any) =>
                        Array.isArray(piece?.value) &&
                        piece.value.every(
                            (value: unknown) => typeof value === "string",
                        ) &&
                        /^\s*[0-9]+\s*$/.test(piece.value.join("")),
                ),
        );
    }

    /**
     * The child of the `<mathList>` or `<numberList>` `list` that its entry
     * `entry` (from 1) is made from, when it is a component (`$mi` in
     * `<mathList>1 $mi</mathList>`): the text is split into entries as
     * sugar split it (`_listSplitting`), and each component that is a
     * `<math>`, a `<number>`, or a whole reference to one or to an input,
     * is one entry, unless it is the only child or the list merges math
     * lists, when its value may be several (`mergesMathChild`).
     */
    function entryChild(list: SerializedComponent, entry: number) {
        const children = list.children ?? [];
        if (
            list.componentType === "_copy" ||
            children.length < 2 ||
            Object.keys(list.attributes ?? {}).some(
                (name) => name.toLowerCase() === "mergemathlists",
            )
        ) {
            return undefined;
        }
        const splittingAttribute: any = list.attributes?._listSplitting;
        const splitting = listSplittingFromAttribute(
            splittingAttribute?.type === "primitive"
                ? String(splittingAttribute.primitive.value)
                : undefined,
        );
        const entries: (number | null)[] = [];
        for (const child of children) {
            if (typeof child === "string") {
                entries.push(
                    ...splitListEntries(child, splitting).map(() => null),
                );
                continue;
            }
            let entryType: string | undefined = child.componentType;
            if (child.componentType === "_copy") {
                const target = targetOf(child);
                entryType =
                    !writtenType(child) &&
                    target &&
                    !referenceOf(child)?.unresolvedPath?.length
                        ? typeOf(target)
                        : undefined;
            }
            if (
                entryType === undefined ||
                !(
                    ["math", "number"].some((base) =>
                        inherits(entryType!, base),
                    ) || entryFor(INPUTS, entryType)
                ) ||
                ["mathList", "numberList"].some((base) =>
                    inherits(entryType!, base),
                )
            ) {
                return undefined;
            }
            entries.push(child.componentIdx);
        }
        return entries[entry - 1] ?? undefined;
    }

    /**
     * Whether `copy`, a whole reference to the component `target`, makes a
     * copy of it, label and all, rather than reading its value. It does when
     * it is written as content (`writtenAsContent`), and wherever else the
     * value-reference pass leaves it a copy, as it does for a point in a
     * `<label>`, a `<text>`, an `<m>` or a `<group>`, which show the copy
     * (`valueReferences.ts`, `planValueReference`), but for a reference
     * inside what it names: `<label>$P</label>` in the label of `P` reads
     * P's value (#1384). A `<math>` or a `<number>` reads the value.
     */
    function copiesTargetsLabel(
        copy: SerializedComponent,
        target: SerializedComponent,
    ) {
        if (writtenAsContent(copy)) {
            return true;
        }
        if (!copy.extending || !("Ref" in copy.extending)) {
            // a tag written with `extend` or `copy` is the component, and
            // holds its label as the component does
            return false;
        }
        for (
            let ancestor = parentOf.get(copy.componentIdx);
            ancestor;
            ancestor = parentOf.get(ancestor.componentIdx)
        ) {
            if (ancestor === target) {
                return false;
            }
        }
        const parent = parentOf.get(copy.componentIdx);
        const targetType = typeOf(target);
        if (!parent || targetType === undefined) {
            return false;
        }
        const parentClass =
            componentInfoObjects.allComponentClasses[
                parent.componentType
            ]?.classForSerializedComponent?.(parent) ??
            componentInfoObjects.allComponentClasses[parent.componentType];
        if (!parentClass) {
            return false;
        }
        const value = staticValueReferenceTarget({
            targetComponentType: targetType,
            unresolvedPath: null,
            componentInfoObjects,
        });
        const readsValue = value
            ? planValueReference({
                  parentClass,
                  targetComponentType: value.referentComponentType,
                  valueComponentType: value.valueComponentType,
                  fromImplicitProp: value.fromImplicitProp,
                  hasAttributes: false,
                  allowDrawn: true,
                  componentInfoObjects,
              })
            : planReferentAdapterReference({
                  parentClass,
                  targetComponentType: targetType,
                  componentInfoObjects,
              });
        return readsValue === undefined;
    }

    /**
     * Whether `copy` is written in what holds it as content, in a `<p>`, a
     * `<span>` or an `<em>`, where a reference to a component is a copy of
     * it, label and all, not its value, as in a `<text>`, a `<math>` or a
     * `<label>`.
     */
    function writtenAsContent(copy: SerializedComponent) {
        const parent = parentOf.get(copy.componentIdx);
        const parentType = parent ? typeOf(parent) : undefined;
        return (
            parentType !== undefined &&
            [...CONTENT_FROM_CHILDREN, "_inlineRenderInlineChildren"].some(
                (base) => inherits(parentType, base),
            )
        );
    }

    /**
     * The edges from what the composite or list of values `composite` is
     * made from (`madeFromAttributes`): the
     * components in its attributes, but those that only display or style
     * it, and those in the attributes of its branches that decide which is
     * shown (`BRANCH_ATTRIBUTES_READ`).
     */
    function madeFromEdges(composite: SerializedComponent) {
        return attributesReadEdges(composite, false);
    }

    /**
     * The edges from what the count of the composite `composite` is made
     * from (`countNode`): those of what it is made from (`madeFromEdges`)
     * but the attributes that only choose which of its cases is shown, the
     * `condition` of a `<conditionalContent>` and of each `<case>`, and the
     * `selectWeight` of each `<option>` of a `<select>`
     * (`CASE_CHOICE_ATTRIBUTES`, `BRANCH_ATTRIBUTES_READ`). A cycle through
     * one of them can only flip a case, so the number of a section waiting
     * for the composite has no edge to it: the run time settles, reports a
     * loop at the composite, or throws, and the load backstop catches it
     * (D61 decision 1). A cycle through a count (a `<repeatForSequence>`'s
     * `to`, a `<repeat>`'s `for`, a `<select>`'s `numToSelect`) can run away
     * without throwing, so only this edge stops it.
     */
    function countEdges(composite: SerializedComponent) {
        return attributesReadEdges(composite, true);
    }

    /**
     * The edges of `madeFromEdges`, or, with `countOnly`, of `countEdges`.
     */
    function attributesReadEdges(
        composite: SerializedComponent,
        countOnly: boolean,
    ) {
        const edges: number[] = [];
        const caseChoice = countOnly
            ? (entryFor(
                  Object.entries(CASE_CHOICE_ATTRIBUTES),
                  typeOf(composite),
              ) ?? [])
            : [];
        for (const [name, attribute] of Object.entries(
            composite.attributes ?? {},
        )) {
            const lower = name.toLowerCase();
            if (
                !ATTRIBUTES_NOT_READ.has(lower) &&
                !caseChoice.includes(lower)
            ) {
                edges.push(
                    ...componentsOfAttribute(attribute).map(
                        (component) => component.componentIdx,
                    ),
                );
            }
        }
        if (countOnly) {
            return edges;
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
     *
     * With `forExpansion`, what a copy of it waits for to expand
     * (`expansionEdges`), not the value of a component it names, which is
     * copied whole (`$r[1]` of a `<repeatForSequence>` whose `<p>` shows
     * `$s.sectionNumber`, before `s`, is no cycle): the expansion of a
     * composite it names or indexes and of the composites in the item
     * (`compositesExpandedIn`), or of those a numbering would wait for in a
     * component that is no composite. A property it names is read as for
     * its value.
     */
    function readEdges(
        from: SerializedComponent,
        target: SerializedComponent,
        path: any[] | null,
        forExpansion = false,
    ): number[] {
        if (path === null || path.length === 0) {
            if (!forExpansion) {
                return [target.componentIdx];
            }
            // copied as a reference to it is: a composite, once it and the
            // composites it shows have expanded (`$r[1].q` of a `<group
            // name="q">` in the template)
            return isComposite(target.componentType)
                ? [
                      expansionNode(target.componentIdx),
                      ...compositesExpandedIn(
                          target.children ?? [],
                          componentInfoObjects,
                          from,
                      ).map((found) => expansionNode(found.componentIdx)),
                  ]
                : compositesWaitedForIn([target], componentInfoObjects).map(
                      (found) => expansionNode(found.componentIdx),
                  );
        }
        const targetType = typeOf(target);
        if (targetType === undefined) {
            return [];
        }
        let numIndices = 0;
        while (
            numIndices < path.length &&
            path[numIndices].name === "" &&
            path[numIndices].index?.length > 0
        ) {
            numIndices++;
        }
        const indices = path.slice(0, numIndices);
        const literal = literalIndices(indices);
        const listForm =
            target.componentType === "collect" &&
            collectIsListFormAsWritten(target, componentInfoObjects);
        if (numIndices === path.length) {
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
                    const key = `${from.componentIdx}>${target.componentIdx}`;
                    listIndexEdges.add(key);
                    const child =
                        literal && path.length === 1
                            ? entryChild(
                                  target,
                                  Number(path[0].index[0].value.join("")),
                              )
                            : undefined;
                    if (child !== undefined) {
                        listEntryEdges.set(key, child);
                    }
                }
                return [target.componentIdx];
            }
            if (
                ["textList", "booleanList"].some((base) =>
                    inherits(targetType, base),
                ) &&
                parentOf.get(from.componentIdx) === target
            ) {
                // an entry of its own: how many entries the list has is made
                // from what it makes (`<booleanList name="l">true
                // $l[5]</booleanList>`), though an entry in an entry of its
                // own reads that entry (`<text>$l[1]</text>`)
                return [target.componentIdx];
            }
            if (listForm) {
                // its values, as one list, made from what it collects from
                return [target.componentIdx];
            }
            if (
                target.componentType !== "_copy" &&
                madeFromAttributes(targetType)
            ) {
                // One of what it makes, made from its attributes, and, for
                // an index written as a number, from what is written in it
                // (`$r[1]` in the template of `<repeat name="r">`, which
                // holds itself in its first iteration). An index that is not
                // a number names one decided when the document runs: in a
                // template, `$r[$i - 1]` names the one before. A copy of it
                // waits for it to expand and, for an iteration of a repeat
                // or an option of a `<select>`, for the composites the item
                // shows, not for its value.
                if (forExpansion) {
                    return [
                        expansionNode(target.componentIdx),
                        ...(ITEMS_OF_TEMPLATES.has(targetType)
                            ? compositesExpandedIn(
                                  target.children ?? [],
                                  componentInfoObjects,
                                  from,
                              ).map((found) =>
                                  expansionNode(found.componentIdx),
                              )
                            : []),
                    ];
                }
                return literal
                    ? [target.componentIdx]
                    : [madeFromNode(target.componentIdx)];
            }
            return [];
        }
        if (numIndices > 0) {
            if (listForm) {
                return [target.componentIdx];
            }
            if (
                target.componentType !== "_copy" &&
                madeFromAttributes(targetType)
            ) {
                // A name in one of what it makes (`$r[1].v`), which it makes
                // from its attributes, and, for an index written as a number,
                // what the name names in what is written in it, the item
                // being made from it (`$r[1].m` in `m` in the template of
                // `<repeat name="r">`).
                const edges = [
                    forExpansion
                        ? countNode(target.componentIdx)
                        : madeFromNode(target.componentIdx),
                ];
                const [namePart, ...rest] = path.slice(numIndices);
                const named =
                    literal && typeof namePart?.name === "string"
                        ? namedIn(target, namePart.name)
                        : [];
                for (const component of named) {
                    edges.push(
                        ...readEdges(
                            from,
                            component,
                            namePart.index?.length > 0
                                ? [{ name: "", index: namePart.index }, ...rest]
                                : rest,
                            forExpansion,
                        ),
                    );
                }
                return edges;
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
            inherits(targetType, "_sectioningComponent") &&
            NUMBER_PROPERTIES.has(property)
        ) {
            if (!sectionNumberEdgesOn) {
                return [];
            }
            // its number, which waits for the composites before it that may
            // make a section to expand, not for the values of what they make
            // (#2614 item 2)
            return compositesNumberingWaitsFor({
                section: target,
                parentOf,
                componentInfoObjects,
            }).map((composite) => expansionNode(composite.componentIdx));
        }
        if (property === "hidden" && !forExpansion) {
            // whether it is hidden: its own `hide`, and whether what it is
            // written in is hidden, so the `hide` of each component it is
            // in (`hidden` in `BaseComponent.js`). `<group name="g"
            // hide="$g.hidden">` and `<number name="n" hide="$n.hidden">` in
            // it are each a cycle (Doenet/DoenetML#2643 item 10).
            const edges: number[] = [];
            for (
                let hiding: SerializedComponent | undefined = target;
                hiding;
                hiding = parentOf.get(hiding.componentIdx)
            ) {
                for (const [name, attribute] of Object.entries(
                    hiding.attributes ?? {},
                )) {
                    if (name.toLowerCase() === "hide") {
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
        if (
            entryFor(PROPERTIES_READ, targetType)?.includes(property) ||
            entryFor(ATTRIBUTES_READ, targetType)?.properties.includes(
                property,
            ) ||
            (target.componentType !== "_copy" &&
                entryFor(INPUTS, targetType)?.properties.includes(property))
        ) {
            return [target.componentIdx];
        }
        if (
            target.componentType !== "_copy" &&
            inherits(targetType, "answer") &&
            ANSWER_PROPERTIES_READ.includes(property)
        ) {
            return [responsesNode(target.componentIdx)];
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
                // a name the branches declare: which branch is shown, decided
                // by the attributes of the container and its branches (a
                // case's `condition` reading `$cc.x` is a cycle), and what it
                // names in each
                const container = componentsByIdx.get(branchRead.container);
                if (container && madeFromAttributes(container.componentType)) {
                    edges.push(madeFromNode(branchRead.container));
                }
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
                const targetType = typeOf(target);
                if (
                    !reference!.unresolvedPath?.length &&
                    targetType !== undefined &&
                    inherits(targetType, "_graphical") &&
                    copiesTargetsLabel(component, target)
                ) {
                    // A copy of the component, its label too: `$P` in a
                    // `<p>` in the `<label>` of `P` holds itself, though as
                    // the value of the label it does not (#1384). An extend
                    // of a component holds its label too (`<point name="b"
                    // extend="$a"/>`, `$b` in a's label, as content or as
                    // the label's own, Doenet/DoenetML#2643 item 1).
                    const seen = new Set<SerializedComponent>();
                    let labelled: SerializedComponent | undefined = target;
                    while (labelled && !seen.has(labelled)) {
                        seen.add(labelled);
                        for (const child of labelled.children ?? []) {
                            if (
                                typeof child === "object" &&
                                inherits(child.componentType, "label")
                            ) {
                                edges.push(child.componentIdx);
                            }
                        }
                        labelled =
                            labelled.componentType === "_copy" &&
                            !referenceOf(labelled)?.unresolvedPath?.length
                                ? targetOf(labelled)
                                : undefined;
                    }
                }
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
            if (collectIsListFormAsWritten(component, componentInfoObjects)) {
                // A list of the values of what it collects from, which reads
                // them all: in what it collects from, it reads itself.
                return [
                    ...childEdges(component),
                    ...attributeEdges(component, ["from"]),
                ];
            }
            return childEdges(component);
        }
        if (entryFor(INPUTS, type)) {
            return inputEdges(component);
        }
        const edges: number[] = [];
        if (
            type === "case" ||
            type === "option" ||
            ["award", "considerAsResponses"].some((base) =>
                inherits(type, base),
            ) ||
            readsChildren(type)
        ) {
            edges.push(...childEdges(component));
        }
        const attributesRead = entryFor(ATTRIBUTES_READ, type)?.attributes;
        if (attributesRead) {
            for (const idx of attributeEdges(component, attributesRead)) {
                edges.push(idx);
                // through what an attribute is made as from what is written
                // in it (the `<function>` of `function="$f"`), which is made
                // from that
                const made = componentsByIdx.get(idx);
                if (
                    made &&
                    made.componentType !== "_copy" &&
                    !readsChildren(made.componentType) &&
                    !isComposite(made.componentType)
                ) {
                    edges.push(...childEdges(made));
                }
            }
        }
        return edges;
    }

    /**
     * The edges from the expansion of the composite (or the reference
     * written as a container a numbering passes through) `composite`
     * (`expansionNode`): to what its count is made from (`countNode`), to the
     * components in the index of a reference and to the expansion of what it
     * is of, and to the expansion of each composite written in it that a
     * numbering would wait for (`compositesWaitedForIn`); for a `<collect>`,
     * to the expansion of what it collects from. Not to the values
     * of what is written in it, which the number of a section after it does
     * not read: a reference to the section's number in a section a
     * `<repeat>` before it makes is no cycle (#2614 item 2). A reference to
     * a name the branches declare, to a property or to itself is read as
     * for its value.
     */
    function expansionEdges(composite: SerializedComponent): number[] {
        const type = composite.componentType;
        const edges: number[] = [];
        if (type === "_copy") {
            if (
                typeof composite.doenetAttributes?.typeChangeAtLoad === "object"
            ) {
                return [];
            }
            const reference = referenceOf(composite);
            const target = targetOf(composite);
            if (target === composite) {
                return edgesOf(composite);
            }
            const branchRead = branchReads.get(composite);
            if (branchRead) {
                // A name the branches of a `<conditionalContent>` or the
                // options of a `<select>` declare (`$cc.q`, `$sel[1].q`): it
                // is copied once the container has expanded, which reads what
                // decides the branch shown, and what it names in each branch
                // is read as a path is, by its expansion, not its value. So
                // `$cc.q` before `s`, of a `<p name="q">` that shows
                // `$s.sectionNumber`, is no cycle.
                edges.push(
                    ...indexComponents(reference?.unresolvedPath).map(
                        (index) => index.componentIdx,
                    ),
                    expansionNode(branchRead.container),
                );
                for (const idx of branchRead.named) {
                    const named = nodeFor(idx);
                    if (named) {
                        edges.push(
                            ...readEdges(
                                composite,
                                named,
                                branchRead.rest.length > 0
                                    ? branchRead.rest
                                    : null,
                                true,
                            ),
                        );
                    }
                }
                return edges;
            }
            edges.push(
                ...indexComponents(reference?.unresolvedPath).map(
                    (index) => index.componentIdx,
                ),
            );
            if (target && !indexThroughCopy(reference!)) {
                if (reference!.unresolvedPath?.length) {
                    edges.push(
                        ...readEdges(
                            composite,
                            target,
                            reference!.unresolvedPath,
                            true,
                        ),
                    );
                    // A path into a composite (`$r[1]`, `$cc.hidden`) is
                    // read once it has expanded, whether or not it may make
                    // a section: the reference waits for it.
                    if (isComposite(target.componentType)) {
                        edges.push(expansionNode(target.componentIdx));
                    }
                }
                // a composite, or a container a numbering passes through,
                // copied with what is written in it
                edges.push(
                    ...compositesWaitedForIn(
                        [target],
                        componentInfoObjects,
                    ).map((found) => expansionNode(found.componentIdx)),
                );
            }
            const written = writtenType(composite);
            if (written !== undefined && madeFromAttributes(written)) {
                edges.push(countNode(composite.componentIdx));
            }
        } else if (madeFromAttributes(type)) {
            edges.push(countNode(composite.componentIdx));
        } else if (
            collectIsListFormAsWritten(composite, componentInfoObjects)
        ) {
            return edgesOf(composite);
        } else if (type === "collect") {
            // It waits for what it collects from to expand: to the
            // expansion of the reference in its `from` and of what that
            // names, a composite (`$r` of a `<repeatForSequence>`) or not
            // (`$g` of a `<group>`, whose own expansion is to the composites
            // in it). It reads its other attributes (`componentType`,
            // `maxNumber`), and shows nothing written in it.
            for (const [name, attribute] of Object.entries(
                composite.attributes ?? {},
            )) {
                for (const read of componentsOfAttribute(attribute)) {
                    if (name.toLowerCase() !== "from") {
                        edges.push(read.componentIdx);
                        continue;
                    }
                    edges.push(expansionNode(read.componentIdx));
                    const target =
                        read.componentType === "_copy"
                            ? targetOf(read)
                            : undefined;
                    if (target) {
                        edges.push(expansionNode(target.componentIdx));
                    }
                }
            }
            return edges;
        }
        edges.push(
            ...compositesWaitedForIn(
                composite.children ?? [],
                componentInfoObjects,
            ).map((found) => expansionNode(found.componentIdx)),
        );
        return edges;
    }

    const edgesByIdx = new Map<number, number[]>();
    const onCycle = new Set<number>();

    function edges(idx: number) {
        let result = edgesByIdx.get(idx);
        if (result === undefined) {
            if (idx <= -COUNT) {
                const composite = componentsByIdx.get(-idx - COUNT);
                result = composite ? countEdges(composite) : [];
            } else if (idx <= -EXPANSION) {
                const composite = componentsByIdx.get(-idx - EXPANSION);
                result = composite ? expansionEdges(composite) : [];
            } else if (idx <= -RESPONSES) {
                const answer = componentsByIdx.get(-idx - RESPONSES);
                result = answer ? responsesEdges(answer) : [];
            } else if (idx < 0) {
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
    function findCycles(
        left: Set<string>,
        substitutes = new Map<string, number>(),
    ) {
        const index = new Map<number, number>();
        const lowLink = new Map<number, number>();
        const onStack = new Set<number>();
        const stack: number[] = [];
        let nextIndex = 0;
        function outOf(idx: number) {
            const out: number[] = [];
            for (const next of edges(idx)) {
                const key = `${idx}>${next}`;
                if (!left.has(key)) {
                    out.push(next);
                } else if (substitutes.has(key)) {
                    out.push(substitutes.get(key)!);
                }
            }
            return out;
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
        // through an input, an index written as a number into such a list
        // reads the one entry it names, when the list says which child that
        // is (`prefill="$l[2]"` of `<mathList name="l">1 $mi</mathList>`)
        findCycles(listIndexEdges, listEntryEdges);
    }

    // What a load that stopped on a circular dependency blamed (D57). First,
    // a reference to the number of a section on the cycle, itself on the
    // cycle or written in an attribute of a node on it, the first in
    // document order (D57's rule 1): one written in an attribute
    // (`hide="$s.sectionNumber=1"`) is compiled into an expression after this
    // check, so the run time's cycle names the component it is in, not it.
    // Else the node blamed, or, if it is no
    // reference, the first reference written in it, to it or to another node
    // on the cycle, which is where the author wrote the cycle (`$P.x` in
    // `<point name="P">($P.x+1, 2)</point>`, DIAG-4). The first written in
    // the most other nodes on the cycle is chosen: with that point in a
    // `<repeatForSequence>` blamed, after a `<p>$P.y</p>`, `$P.y` is to the
    // point but not on the cycle, and making it the error would leave the
    // cycle unbroken.
    const forcedCycleMembers = new Set<number>();
    for (const loadCycle of loadCycles) {
        const blamed = componentsByIdx.get(loadCycle.blamed);
        const toNumber = referenceToNumberOnCycle(
            loadCycle.onCycle,
            loadCycle.variablesOnCycle,
        );
        if (toNumber) {
            forcedCycleMembers.add(toNumber.componentIdx);
            loadCycle.made = toNumber.componentIdx;
        } else if (blamed) {
            let chosen = blamed;
            if (blamed.componentType !== "_copy") {
                const written: {
                    copy: SerializedComponent;
                    depth: number;
                }[] = [];
                const otherOnCycle = new Set(loadCycle.onCycle);
                otherOnCycle.delete(blamed.componentIdx);
                gatherCopiesIn(blamed, otherOnCycle, written);
                const toCycle = written.filter(({ copy }) => {
                    const target = targetOf(copy);
                    return (
                        target !== undefined &&
                        loadCycle.onCycle.has(target.componentIdx)
                    );
                });
                // the first of the deepest, in document order
                const deepest = toCycle.reduce<
                    (typeof toCycle)[number] | undefined
                >(
                    (best, one) =>
                        best === undefined || one.depth > best.depth
                            ? one
                            : best,
                    undefined,
                );
                chosen = deepest?.copy ?? blamed;
            }
            forcedCycleMembers.add(chosen.componentIdx);
            loadCycle.made = chosen.componentIdx;
        }
    }

    // In document order, so the errors are reported in the order written.
    // The type each names is read before any is made an `_error`, so that it
    // does not depend on that order.
    const members: [SerializedComponent, string | undefined][] = [];
    for (const [idx, component] of componentsByIdx) {
        if (
            !forcedCycleMembers.has(idx) &&
            (!onCycle.has(idx) || component.componentType !== "_copy")
        ) {
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
            component.componentType !== "_copy"
                ? component.componentType
                : component.doenetAttributes?.isIndex
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
