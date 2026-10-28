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
    Ref,
    SideBySide,
    Slider,
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
 * Render `component` only when its element carries every prop in `keys`. A
 * core that sends the element without them (one with no such component, or
 * with a different shape for it) gets nothing drawn, as for an element with
 * no renderer, rather than a renderer reading props that are not there.
 */
function withProps(
    component: BasicComponent<any>,
    ...keys: string[]
): BasicComponent<any> {
    return function WithProps(props) {
        const given = props.node.data.props ?? {};
        if (!keys.every((key) => given[key] !== undefined)) {
            return null;
        }
        return React.createElement(component, props);
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
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
export const TEXT_MODE_COMPONENTS: RendererObject = {
    row: { component: Row, passthroughChildren: true },
    table: { component: Table, passthroughChildren: true },
    tabular: { component: Tabular, passthroughChildren: true },
    cell: { component: Cell, passthroughChildren: true },
    // cell: passThroughWithRenamedTag("td"),
    _fragment: { component: _Fragment, passthroughChildren: true },
    abs: { component: M },
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
    document: { component: Document, passthroughChildren: true },
    electronConfiguration: { component: M },
    ellipsis: renderAs("…", { wrapInSpanWithId: true }),
    em: { component: Em, passthroughChildren: true },
    evaluate: { component: M },
    extractMath: { component: M },
    floor: { component: M },
    function: { component: M },
    gcd: { component: M },
    graph: { component: Graph },
    hint: { component: Hint, passthroughChildren: true },
    hasSameFactoring: { component: Boolean },
    hr: { component: _PassThroughWithTag },
    iff: { component: Boolean },
    implies: { component: Boolean },
    intComma: showAttrOnly("text"),
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
    mathInput: { component: withProps(MathInput, "text") },
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
    number: { component: Number },
    numberInput: { component: withProps(NumberInput, "value") },
    odeSystem: { component: M },
    ol: { component: Ol, passthroughChildren: true },
    or: { component: Boolean },
    orbitalDiagram: { component: OrbitalDiagram },
    p: { component: P, passthroughChildren: true },
    ref: { component: Ref, passthroughChildren: true },
    sideBySide: { component: SideBySide, passthroughChildren: true },
    slider: {
        component: withProps(Slider, "from", "to", "step", "value"),
    },
    stack: { component: Stack, passthroughChildren: true },
    piecewiseFunction: { component: M },
    pluralize: showAttrOnly("text"),
    point: { component: PointInText },
    problem: {
        component: Problem,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    product: { component: M },
    q: { component: Q, passthroughChildren: true },
    rightHandSide: { component: M },
    round: { component: M },
    rq: renderAs("”"),
    rsq: renderAs("’"),
    setSmallToZero: { component: M },
    sign: { component: M },
    sq: { component: Sq, passthroughChildren: true },
    standardDeviation: { component: M },
    subsetOfReals: { component: M },
    sum: { component: M },
    tag: { component: Tag, passthroughChildren: true },
    tagc: { component: TagC, passthroughChildren: true },
    text: { component: Text },
    tuple: { component: M },
    textInput: { component: TextInput },
    title: { component: Title, passthroughChildren: true },
    triggerSet: { component: Button },
    ul: { component: Ul, passthroughChildren: true },
    updateValue: { component: Button },
    variance: { component: M },
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
    circle: {
        component: withProps(
            CircleInGraph,
            "numericalCenter",
            "numericalRadius",
        ),
    },
    legend: { component: withProps(LegendInGraph, "legendElements") },
    line: { component: withProps(LineInGraph, "numericalPoints") },
    lineSegment: {
        component: withProps(LineSegmentInGraph, "numericalEndpoints"),
    },
    point: { component: PointInGraph },
    polygon: { component: withProps(PolygonInGraph, "numericalVertices") },
    polyline: {
        component: withProps(PolylineInGraph, "numericalVertices"),
    },
};
