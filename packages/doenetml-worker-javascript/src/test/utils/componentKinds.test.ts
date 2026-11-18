import { describe, expect, it } from "vitest";
import { createComponentInfoObjects } from "../../utils/componentInfoObjects";
import { kindOfComponentType } from "../../utils/componentKinds";

/**
 * Every author tag is of one kind (D46, `utils/componentKinds.ts`): a value,
 * of its value's type; an object, of its tag, with the tags built on it; or
 * content, all one type. A new component has to be placed here. Composites
 * and lists aren't items: a `<sort>` or `<shuffle>` reads what they hold.
 */

/** Values, by the one type they are of. */
const VALUES: Record<string, string[]> = {
    boolean: [
        "and",
        "boolean",
        "booleanInput",
        "hasSameFactoring",
        "iff",
        "implies",
        "isBetween",
        "isInteger",
        "isNumber",
        "matchesPattern",
        "not",
        "or",
        "when",
        "xor",
    ],
    math: [
        "abs",
        "argMax",
        "argMin",
        "ceil",
        "clampNumber",
        "convertSetToList",
        "coords",
        "count",
        "electronConfiguration",
        "evaluate",
        "extractMath",
        "floor",
        "fractionInput",
        "gcd",
        "integer",
        "lcm",
        "math",
        "mathInput",
        "matrixInput",
        "max",
        "mean",
        "median",
        "min",
        "mod",
        "number",
        "product",
        "rightHandSide",
        "round",
        "setSmallToZero",
        "sign",
        "standardDeviation",
        "sum",
        "variance",
        "wrapNumberPeriodic",
    ],
    text: [
        "codeEditor",
        "extractMathOperator",
        "intComma",
        "latex",
        "pluralize",
        "text",
        "textInput",
    ],
};

/**
 * Inputs that stand for a value whose type is decided only as the document
 * runs (a `<slider>`'s `type`, a `<choiceInput>`'s choices), until every
 * property's type is decided at load (#2568).
 */
const VALUE_TYPE_DECIDED_AS_IT_RUNS = ["choiceInput", "slider"];

/** Objects, by the one type they are of: the first tag they are built on. */
const OBJECTS: Record<string, string[]> = {
    angle: ["angle"],
    animateFromSequence: ["animateFromSequence"],
    annotation: ["annotation"],
    annotations: ["annotations"],
    answer: ["answer"],
    atom: ["atom"],
    attractTo: ["attractTo"],
    attractToConstraint: ["attractToConstraint"],
    attractToGrid: ["attractToGrid"],
    award: ["award"],
    bezierControls: ["bezierControls"],
    callAction: ["callAction"],
    case: ["case", "else"],
    cellBlock: ["cellBlock"],
    choice: ["choice"],
    col: ["col"],
    considerAsResponses: ["considerAsResponses"],
    constrainTo: ["constrainTo"],
    constrainToGraph: ["constrainToGraph"],
    constrainToGrid: ["constrainToGrid"],
    constrainToInterior: ["constrainToInterior"],
    constraintUnion: ["constraintUnion"],
    curve: ["circle", "curve", "equilibriumCurve", "parabola"],
    eigenDecomposition: ["eigenDecomposition"],
    feedbackDefinition: ["feedbackDefinition"],
    function: [
        "clampFunction",
        "derivative",
        "function",
        "piecewiseFunction",
        "wrapFunctionPeriodic",
    ],
    interval: ["interval"],
    ion: ["ion"],
    ionicCompound: ["ionicCompound"],
    legend: ["legend"],
    line: ["bestFitLine", "equilibriumLine", "line"],
    lineSegment: ["lineSegment"],
    matrix: ["matrix"],
    odeSystem: ["odeSystem"],
    option: ["option"],
    orbitalDiagram: ["orbitalDiagram", "orbitalDiagramInput"],
    pegboard: ["pegboard"],
    periodicSet: ["periodicSet"],
    point: ["endpoint", "equilibriumPoint", "point"],
    polyline: [
        "cobwebPolyline",
        "polygon",
        "polyline",
        "rectangle",
        "regularPolygon",
        "triangle",
    ],
    ray: ["ray"],
    regionBetweenCurveXAxis: ["regionBetweenCurveXAxis"],
    regionBetweenCurves: ["regionBetweenCurves"],
    regionHalfPlane: ["regionHalfPlane"],
    series: ["series"],
    slopeField: ["slopeField"],
    solveEquations: ["solveEquations"],
    spreadsheet: ["spreadsheet"],
    styleDefinition: ["styleDefinition"],
    stylePalette: ["stylePalette"],
    subsetOfReals: ["subsetOfReals", "subsetOfRealsInput"],
    summaryStatistics: ["summaryStatistics"],
    triggerSet: ["triggerSet"],
    updateValue: ["updateValue"],
    variantControl: ["variantControl"],
    vector: ["vector"],
    vectorField: ["vectorField"],
};

/** Content, all one type. */
const CONTENT = [
    "activity",
    "alert",
    "asList",
    "aside",
    "attr",
    "blockQuote",
    "br",
    "c",
    "caption",
    "cascade",
    "cascadeMessage",
    "cell",
    "chart",
    "column",
    "conclusion",
    "definition",
    "delete",
    "description",
    "displayDoenetML",
    "div",
    "document",
    "ellipsis",
    "em",
    "example",
    "exercise",
    "exercises",
    "feedback",
    "figure",
    "footnote",
    "givenAnswer",
    "graph",
    "hint",
    "hr",
    "image",
    "insert",
    "introduction",
    "label",
    "li",
    "lq",
    "lsq",
    "m",
    "md",
    "mdash",
    "mdn",
    "me",
    "men",
    "mrow",
    "nbsp",
    "ndash",
    "note",
    "objectives",
    "ol",
    "p",
    "page",
    "paginator",
    "paginatorControls",
    "paragraphs",
    "part",
    "pre",
    "pretzel",
    "problem",
    "problems",
    "proof",
    "q",
    "question",
    "ref",
    "row",
    "rq",
    "rsq",
    "sbsGroup",
    "section",
    "shortDescription",
    "sideBySide",
    "solution",
    "span",
    "sq",
    "stack",
    "statement",
    "stickyGroup",
    "subsection",
    "subsubsection",
    "table",
    "tabular",
    "tag",
    "tagc",
    "tage",
    "task",
    "term",
    "theorem",
    "title",
    "ul",
    "video",
    "xLabel",
    "yLabel",
];

/** Composites, which stand for what they hold. */
const COMPOSITES = [
    "collect",
    "conditionalContent",
    "group",
    "intersection",
    "lorem",
    "module",
    "moduleAttributes",
    "repeat",
    "repeatForSequence",
    "select",
    "setup",
    "shuffle",
    "sort",
    "split",
    "substitute",
];

/** Lists, whose items are their entries. */
const LISTS = [
    "binCounts",
    "booleanList",
    "controlVectors",
    "cumulativeMax",
    "cumulativeMin",
    "cumulativeProduct",
    "cumulativeSum",
    "differences",
    "functionIterates",
    "indexOf",
    "intervalList",
    "mathList",
    "numberList",
    "pointList",
    "sampleMultivariateRandomNumber",
    "samplePrimeNumbers",
    "sampleRandomNumbers",
    "searchSorted",
    "selectFromSequence",
    "selectPrimeNumbers",
    "selectRandomNumbers",
    "sequence",
    "sortIndices",
    "tally",
    "textList",
    "tupleList",
    "vectorList",
];

/** Tags that render their children but aren't content: inputs and objects. */
const RENDER_CHILDREN_NOT_CONTENT = [
    "answer",
    "booleanInput",
    "callAction",
    "choice",
    "choiceInput",
    "codeEditor",
    "fractionInput",
    "mathInput",
    "matrixInput",
    "slider",
    "textInput",
    "triggerSet",
    "updateValue",
];

/** Content that doesn't render children: it has none, or draws them itself. */
const CONTENT_NOT_RENDER_CHILDREN = [
    "br",
    "chart",
    "displayDoenetML",
    "ellipsis",
    "hr",
    "lq",
    "lsq",
    "mdash",
    "nbsp",
    "ndash",
    "rq",
    "rsq",
];

describe("every author tag has a kind (D46) @group4", () => {
    const componentInfoObjects = createComponentInfoObjects() as any;
    const classes = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;
    const authorTags = Object.keys(classes)
        .filter(
            (tag) => !tag.startsWith("_") && !classes[tag].excludeFromSchema,
        )
        .sort();

    it("lists every author tag once", () => {
        const listed = [
            ...Object.values(VALUES).flat(),
            ...VALUE_TYPE_DECIDED_AS_IT_RUNS,
            ...Object.values(OBJECTS).flat(),
            ...CONTENT,
            ...COMPOSITES,
            ...LISTS,
        ];
        expect([...listed].sort()).eqls(authorTags);
        expect(new Set(listed).size).eq(listed.length);
    });

    it("each tag is of the kind and type listed", () => {
        const found: Record<string, string> = {};
        const expected: Record<string, string> = {};
        for (const [type, tags] of Object.entries(VALUES)) {
            for (const tag of tags) {
                expected[tag] = `value ${type}`;
            }
        }
        for (const [type, tags] of Object.entries(OBJECTS)) {
            for (const tag of tags) {
                expected[tag] = `object ${type}`;
            }
        }
        for (const tag of CONTENT) {
            expected[tag] = "content content";
        }
        for (const tag of VALUE_TYPE_DECIDED_AS_IT_RUNS) {
            expected[tag] = "undecided";
        }
        for (const tag of Object.keys(expected)) {
            const kind = kindOfComponentType(tag, componentInfoObjects);
            found[tag] = kind ? `${kind.kind} ${kind.type}` : "undecided";
        }
        expect(found).eqls(expected);
        for (const tag of VALUE_TYPE_DECIDED_AS_IT_RUNS) {
            expect(classes[tag].isValue, tag).eq(true);
        }
        for (const tag of [...COMPOSITES, ...LISTS]) {
            expect(
                componentInfoObjects.isCompositeComponent({
                    componentType: tag,
                    includeNonStandard: true,
                }) ||
                    classes[tag].listEntryComponentType !== undefined ||
                    classes[tag].listEntryTypeAttribute !== undefined,
                tag,
            ).eq(true);
        }
    });

    it("content is what renders its children, but for inputs and some objects", () => {
        // `renderChildren` comes close to content, so a drift between the two
        // is worth a look: a new tag that renders its children is likely
        // content.
        const renderChildren = authorTags.filter(
            (tag) => classes[tag].renderChildren,
        );
        expect(renderChildren.filter((tag) => !CONTENT.includes(tag))).eqls(
            RENDER_CHILDREN_NOT_CONTENT,
        );
        expect(CONTENT.filter((tag) => !classes[tag].renderChildren)).eqls(
            CONTENT_NOT_RENDER_CHILDREN,
        );
    });
});
