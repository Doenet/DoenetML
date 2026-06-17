import React from "react";
import { BasicComponent, BasicComponentWithPassthroughChildren } from "./types";
import {
    Answer,
    Document,
    Graph,
    LineInGraph,
    M,
    Math,
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
    Aside,
    OrbitalDiagram,
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
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
export const TEXT_MODE_COMPONENTS: RendererObject = {
    orbitalDiagram: { component: OrbitalDiagram },
    atom: { component: M },
    aside: { component: Aside, passthroughChildren: true },
    asList: { component: AsList, passthroughChildren: true },
    booleanInput: { component: BooleanInput },
    tag: { component: Tag, passthroughChildren: true },
    tagc: { component: TagC, passthroughChildren: true },
    angle: { component: Angle },
    abs: { component: M },
    alert: passThroughWithRenamedTag("strong"),
    br: { component: _PassThroughWithTag },
    c: passThroughWithRenamedTag("code"),
    blockQuote: { component: BlockQuote, passthroughChildren: true },
    hr: { component: _PassThroughWithTag },
    q: { component: Q, passthroughChildren: true },
    sq: { component: Sq, passthroughChildren: true },

    // Basic symbols - none of these wrap in a span with id in the original doenetml renderers
    ellipsis: renderAs("…", { wrapInSpanWithId: true }),
    mdash: renderAs("—"),
    nbsp: renderAs(" "),
    ndash: renderAs("–"),
    lq: renderAs("“"),
    rq: renderAs("”"),
    lsq: renderAs("‘"),
    rsq: renderAs("’"),

    // Things that render as M
    function: { component: M },
    evaluate: { component: M },
    matrix: { component: M },
    electronConfiguration: { component: M },
    ion: { component: M },
    ionicCompound: { component: M },
    interval: { component: M },
    subsetOfReals: { component: M },
    ceil: { component: M },
    floor: { component: M },
    round: { component: M },
    sign: { component: M },
    clampNumber: { component: M },
    wrapNumberPeriodic: { component: M },
    setSmallToZero: { component: M },
    min: { component: M },
    max: { component: M },
    sum: { component: M },
    product: { component: M },
    mean: { component: M },
    median: { component: M },
    standardDeviation: { component: M },
    variance: { component: M },
    count: { component: M },
    gcd: { component: M },
    lcm: { component: M },
    mod: { component: M },
    extractMath: { component: M },
    convertSetToList: { component: M },

    men: { component: M },
    md: { component: M },
    odeSystem: { component: M },

    // br: { component: Br },
    answer: { component: Answer },
    choiceInput: { component: ChoiceInput },
    p: { component: P, passthroughChildren: true },
    document: { component: Document, passthroughChildren: true },
    m: { component: M, passthroughChildren: true },
    math: { component: Math },
    graph: { component: Graph },
    point: { component: PointInText },
    division: {
        component: Division,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    problem: {
        component: Problem,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    textInput: { component: TextInput },
    text: { component: Text },
    number: { component: Number },
    boolean: { component: Boolean },
    title: { component: Title, passthroughChildren: true },
    _fragment: { component: _Fragment, passthroughChildren: true },
    xref: { component: Xref, passthroughChildren: true },
    ol: { component: Ol, passthroughChildren: true },
    ul: { component: Ul, passthroughChildren: true },
    li: { component: Li, passthroughChildren: true },
    em: { component: Em, passthroughChildren: true },

    // For PreTeXt compatibility
    pretext: { component: _Fragment, passthroughChildren: true },
    article: { component: _Fragment, passthroughChildren: true },
    book: { component: _Fragment, passthroughChildren: true },
};

export const GRAPH_MODE_COMPONENTS: RendererObject = {
    line: { component: LineInGraph },
    point: { component: PointInGraph },
};
