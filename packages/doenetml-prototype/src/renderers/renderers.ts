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

/**
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
export const TEXT_MODE_COMPONENTS: RendererObject = {
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
