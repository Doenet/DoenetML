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
} from "./doenet";
import * as PretextComponent from "./pretext-xml";
import { PointInText } from "./doenet/text-point";
import { Em } from "./doenet/em";

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

/**
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
export const PRETEXT_TEXT_MODE_COMPONENTS: RendererObject = {
    answer: { component: PretextComponent.Answer },
    choiceInput: { component: PretextComponent.ChoiceInput },
    p: { component: PretextComponent.P, passthroughChildren: true },
    document: {
        component: PretextComponent._PassThroughWithTag,
        passthroughChildren: true,
    },
    m: { component: PretextComponent.M, passthroughChildren: true },
    math: { component: PretextComponent.Math },
    graph: { component: PretextComponent.Graph },
    point: { component: PretextComponent.PointInText },
    division: {
        component: PretextComponent.Division,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    problem: {
        component: PretextComponent.Problem,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    textInput: { component: PretextComponent.TextInput },
    text: { component: PretextComponent.Text },
    boolean: { component: PretextComponent.Boolean },
    title: { component: PretextComponent.Title, passthroughChildren: true },
    _fragment: {
        component: PretextComponent._Fragment,
        passthroughChildren: true,
    },
    xref: { component: PretextComponent.Xref, passthroughChildren: true },
    ol: { component: PretextComponent.Ol, passthroughChildren: true },
    ul: { component: PretextComponent.Ul, passthroughChildren: true },
    li: { component: PretextComponent.Li, passthroughChildren: true },

    // For PreTeXt compatibility
    pretext: {
        component: PretextComponent._PassThroughWithTagAndNewline,
        passthroughChildren: true,
    },
    article: {
        component: PretextComponent._PassThroughWithTagAndNewline,
        passthroughChildren: true,
    },
    book: {
        component: PretextComponent._PassThroughWithTagAndNewline,
        passthroughChildren: true,
    },
    // Provide a renderer for unrecognized elements. This allows us to support
    // pretext tags we don't currently know about.
    [FALLBACK_RENDERER_KEY]: {
        component: PretextComponent._PassThroughWithTag,
        passthroughChildren: true,
    },
};

export const PRETEXT_GRAPH_MODE_COMPONENTS: RendererObject = {};
