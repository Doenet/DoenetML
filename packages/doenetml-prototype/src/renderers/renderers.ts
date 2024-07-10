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
    Boolean,
    Title,
    _Fragment,
    Xref,
    Ol,
    Li,
    Ul,
    ChoiceInput,
} from "./doenet";
import * as PretextComponent from "./pretext";

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
    string,
    Component | ComponentWithPassthroughChildren
>;

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
    boolean: { component: Boolean },
    title: { component: Title, passthroughChildren: true },
    _fragment: { component: _Fragment, passthroughChildren: true },
    xref: { component: Xref, passthroughChildren: true },
    ol: { component: Ol, passthroughChildren: true },
    ul: { component: Ul, passthroughChildren: true },
    li: { component: Li, passthroughChildren: true },

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
};

export const PRETEXT_GRAPH_MODE_COMPONENTS: RendererObject = {
    line: { component: PretextComponent.LineInGraph },
    point: { component: PretextComponent.PointInGraph },
};
