import React from "react";
import { BasicComponent, BasicComponentWithPassthroughChildren } from "./types";
import {
    Answer,
    Document,
    Graph,
    LineInGraph,
    M,
    P,
    PointInGraph,
    PointInText,
    Problem,
    Division,
    Text,
    TextInput,
    Number,
    Boolean,
    Title,
    _Fragment,
    Xref,
    Ol,
    Li,
    Ul,
    ChoiceInput,
    Em,
    Feedback,
    Figure,
    Footnote,
    _Omit,
    _PassThroughWithTag,
    _PassThroughWithLogging,
    Angle,
    Q,
    Tag,
    Sq,
    TagC,
    BooleanInput,
    BlockQuote,
    AsList,
    OrbitalDiagram,
    Button,
    Table,
    Tabular,
    Cell,
    Row,
    CircleInGraph,
    Hint,
    LegendInGraph,
    LineSegmentInGraph,
    MathInput,
    NumberInput,
    PolygonInGraph,
    PolylineInGraph,
    RayInGraph,
    Ref,
    VectorInGraph,
    SideBySide,
    Slider,
    Solution,
    Stack,
} from "./doenet";
export {
    PRETEXT_TEXT_MODE_COMPONENTS,
    PRETEXT_GRAPH_MODE_COMPONENTS,
} from "@doenet/doenetml-to-pretext/pretext-xml";

export type CommonProps = {
    monitorVisibility?: boolean;
};
export type Component = {
    // At this point, we don't care about the type of the data prop
    // The component author should make sure it's correct.
    // TODO: Can we make this a union of all possible data props?
    component: BasicComponent<any>;
    passthroughChildren?: false;
} & CommonProps;
export type ComponentWithPassthroughChildren = {
    component: BasicComponentWithPassthroughChildren<any>;
    passthroughChildren: true;
} & CommonProps;

export type RendererObject = Record<
    string | symbol,
    Component | ComponentWithPassthroughChildren
>;

/**
 * A key used to identify the fallback renderer in the renderer object.
 * If a renderer is present with this key, it will be used in the case where no
 * specific renderer is found for a given tag name.
 */
export const FALLBACK_RENDERER_KEY = Symbol("fallback");

const NoProcessingConverter: ComponentWithPassthroughChildren = {
    component: _PassThroughWithTag,
    passthroughChildren: true,
};
const PassThroughWithoutTagConverter: ComponentWithPassthroughChildren = {
    component: _Fragment,
    passthroughChildren: true,
};
const OmitElementConverter: Component = {
    component: _Omit,
};
/**
 * Special converter only used for logging.
 */
const _DEBUG_PassThroughWithLoggingConverter: ComponentWithPassthroughChildren =
    {
        component: _PassThroughWithLogging,
        passthroughChildren: true,
    };

/**
 * Pass through the element and all its children, but render it under a
 * different HTML tag name.
 */
function passThroughWithRenamedTag(
    newTagName: string,
): ComponentWithPassthroughChildren {
    return {
        component: ({ ...args }) => {
            const { node, ...rest } = args;
            const newNode = { ...node, name: newTagName };
            return _PassThroughWithTag({ node: newNode, ...rest });
        },
        passthroughChildren: true,
    };
}

/**
 * Render this component as `reactNode`, possibly wrapped in a span with htmlId applied to the id field
 * @param reactNode
 */
function renderAs(
    reactNode: React.ReactNode,
    options?: { wrapInSpanWithId?: boolean },
): Component {
    return {
        component: ({ node, htmlId }) => {
            if (options?.wrapInSpanWithId) {
                return React.createElement("span", { id: htmlId }, [reactNode]);
            }
            return reactNode;
        },
        passthroughChildren: false,
    };
}

/**
 * Component that renders the value of `props[attr]` and nothing else. This
 * can be used to render the `value` or `text` prop of a component.
 */
function showAttrOnly<T extends string>(
    attr: T,
): { component: BasicComponent<{ props: { [K in T]: string } }> } {
    return {
        component: ({ node }) => {
            return node.data.props[attr];
        },
    };
}

/**
 * A sectioning component other than `section` itself, which the core sends
 * as `division`: drawn as a division under its own name.
 */
const Section: ComponentWithPassthroughChildren = {
    component: Division,
    passthroughChildren: true,
    monitorVisibility: true,
};

/**
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
export const TEXT_MODE_COMPONENTS: RendererObject = {
    row: { component: Row, passthroughChildren: true },
    table: { component: Table, passthroughChildren: true },
    tabular: { component: Tabular, passthroughChildren: true },
    cell: { component: Cell, passthroughChildren: true },
    caption: PassThroughWithoutTagConverter,
    conclusion: passThroughWithRenamedTag("div"),
    // cell: passThroughWithRenamedTag("td"),
    _fragment: { component: _Fragment, passthroughChildren: true },
    abs: { component: M },
    activity: Section,
    alert: passThroughWithRenamedTag("strong"),
    and: { component: Boolean },
    angle: { component: Angle },
    answer: { component: Answer, passthroughChildren: true },
    argMax: { component: M },
    argMin: { component: M },
    aside: { component: Division, passthroughChildren: true },
    asList: { component: AsList, passthroughChildren: true },
    atom: { component: M },
    attr: passThroughWithRenamedTag("code"),
    blockQuote: { component: BlockQuote, passthroughChildren: true },
    boolean: { component: Boolean },
    booleanInput: { component: BooleanInput },
    br: { component: _PassThroughWithTag },
    c: passThroughWithRenamedTag("code"),
    callAction: { component: Button },
    ceil: { component: M },
    choice: PassThroughWithoutTagConverter,
    choiceInput: { component: ChoiceInput },
    clampFunction: { component: M },
    clampNumber: { component: M },
    convertSetToList: { component: M },
    count: { component: M },
    derivative: { component: M },
    division: {
        component: Division,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    div: passThroughWithRenamedTag("div"),
    document: { component: Document, passthroughChildren: true },
    electronConfiguration: { component: M },
    ellipsis: renderAs("…", { wrapInSpanWithId: true }),
    em: { component: Em, passthroughChildren: true },
    example: Section,
    exercise: Section,
    evaluate: { component: M },
    extractMath: { component: M },
    feedback: { component: Feedback, passthroughChildren: true },
    figure: { component: Figure, passthroughChildren: true },
    floor: { component: M },
    footnote: { component: Footnote },
    function: { component: M },
    gcd: { component: M },
    graph: { component: Graph },
    hasSameFactoring: { component: Boolean },
    hint: { component: Hint, passthroughChildren: true },
    hr: { component: _PassThroughWithTag },
    iff: { component: Boolean },
    implies: { component: Boolean },
    intComma: showAttrOnly("text"),
    introduction: passThroughWithRenamedTag("div"),
    integer: showAttrOnly("text"),
    interval: { component: M },
    ion: { component: M },
    ionicCompound: { component: M },
    isBetween: { component: Boolean },
    isInteger: { component: Boolean },
    isNumber: { component: Boolean },
    latex: showAttrOnly("text"),
    lcm: { component: M },
    li: { component: Li, passthroughChildren: true },
    lq: renderAs("“"),
    lsq: renderAs("‘"),
    m: { component: M, passthroughChildren: true },
    matchesPattern: { component: Boolean },
    math: { component: M },
    mathInput: { component: MathInput },
    matrix: { component: M },
    max: { component: M },
    md: { component: M },
    mdash: renderAs("—"),
    mdn: { component: M },
    me: { component: M },
    mean: { component: M },
    median: { component: M },
    men: { component: M },
    min: { component: M },
    mod: { component: M },
    nbsp: renderAs(" "),
    ndash: renderAs("–"),
    not: { component: Boolean },
    note: Section,
    number: { component: Number },
    numberInput: { component: NumberInput },
    odeSystem: { component: M },
    ol: { component: Ol, passthroughChildren: true },
    or: { component: Boolean },
    orbitalDiagram: { component: OrbitalDiagram },
    p: { component: P, passthroughChildren: true },
    piecewiseFunction: { component: M },
    paragraphs: Section,
    pluralize: showAttrOnly("text"),
    point: { component: PointInText },
    pre: passThroughWithRenamedTag("pre"),
    problem: {
        component: Problem,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    proof: Section,
    product: { component: M },
    q: { component: Q, passthroughChildren: true },
    question: Section,
    // Outside a graph a ray is nothing but its anchor, as in production.
    ray: renderAs(null, { wrapInSpanWithId: true }),
    ref: { component: Ref, passthroughChildren: true },
    rightHandSide: { component: M },
    round: { component: M },
    rq: renderAs("”"),
    rsq: renderAs("’"),
    setSmallToZero: { component: M },
    sideBySide: { component: SideBySide, passthroughChildren: true },
    sign: { component: M },
    solution: { component: Solution, passthroughChildren: true },
    span: passThroughWithRenamedTag("span"),
    slider: { component: Slider },
    sq: { component: Sq, passthroughChildren: true },
    stack: { component: Stack, passthroughChildren: true },
    standardDeviation: { component: M },
    statement: passThroughWithRenamedTag("div"),
    subsection: Section,
    subsubsection: Section,
    subsetOfReals: { component: M },
    sum: { component: M },
    tag: { component: Tag, passthroughChildren: true },
    tagc: { component: TagC, passthroughChildren: true },
    text: { component: Text },
    theorem: Section,
    textInput: { component: TextInput },
    title: { component: Title, passthroughChildren: true },
    triggerSet: { component: Button },
    tuple: { component: M },
    ul: { component: Ul, passthroughChildren: true },
    updateValue: { component: Button },
    variance: { component: M },
    vector: { component: M },
    wrapFunctionPeriodic: { component: M },
    wrapNumberPeriodic: { component: M },
    xor: { component: Boolean },

    // For PreTeXt compatibility
    pretext: { component: _Fragment, passthroughChildren: true },
    article: { component: _Fragment, passthroughChildren: true },
    book: { component: _Fragment, passthroughChildren: true },
    xref: { component: Xref, passthroughChildren: true },
};

export const GRAPH_MODE_COMPONENTS: RendererObject = {
    circle: { component: CircleInGraph },
    legend: { component: LegendInGraph },
    line: { component: LineInGraph },
    lineSegment: { component: LineSegmentInGraph },
    point: { component: PointInGraph },
    polygon: { component: PolygonInGraph },
    polyline: { component: PolylineInGraph },
    ray: { component: RayInGraph },
    // Polygons given another way: each sends its vertices as a polygon does.
    rectangle: { component: PolygonInGraph },
    regularPolygon: { component: PolygonInGraph },
    triangle: { component: PolygonInGraph },
    vector: { component: VectorInGraph },
    // A value placed in a graph is drawn as a label at its anchor, which no
    // core sends yet: until one does, it is not drawn.
    math: OmitElementConverter,
    number: OmitElementConverter,
    text: OmitElementConverter,
};
