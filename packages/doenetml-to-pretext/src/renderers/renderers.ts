import { BasicComponent, BasicComponentWithPassthroughChildren } from "./types";
import * as PretextComponent from "./pretext-xml";

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

const TheoremLikeConverter: ComponentWithPassthroughChildren = {
    component: PretextComponent.TheoremLike,
    passthroughChildren: true,
};
const NoProcessingConverter: ComponentWithPassthroughChildren = {
    component: PretextComponent._PassThroughWithTag,
    passthroughChildren: true,
};
const PassThroughWithoutTagConverter: ComponentWithPassthroughChildren = {
    component: PretextComponent._PassThroughWithoutTag,
    passthroughChildren: true,
};

/**
 * Pass through the element and all its children, but rename the tag. This can be used to change capitalization or spelling
 * of tags between Doenet and Pretext.
 */
function passThroughWithRenamedTag(
    newTagName: string,
): ComponentWithPassthroughChildren {
    return {
        component: ({ ...args }) => {
            const { node, ...rest } = args;
            const newNode = {
                ...node,
                name: newTagName,
            };
            return PretextComponent._PassThroughWithTag({
                node: newNode,
                ...rest,
            });
        },
        passthroughChildren: true,
    };
}

/**
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
export const PRETEXT_TEXT_MODE_COMPONENTS: RendererObject = {
    answer: {
        component: PretextComponent.Answer,
        passthroughChildren: true,
    },
    choiceInput: {
        component: PretextComponent.ChoiceInput,
        passthroughChildren: true,
    },
    choice: PassThroughWithoutTagConverter,
    p: { component: PretextComponent.P, passthroughChildren: true },
    document: {
        component: PretextComponent._PassThroughWithTag,
        passthroughChildren: true,
    },
    m: { component: PretextComponent.Math },
    me: { component: PretextComponent.DisplayMath },
    md: { component: PretextComponent.DisplayMath },
    men: { component: PretextComponent.DisplayMathNumbered },
    mdn: { component: PretextComponent.DisplayMathNumbered },
    math: { component: PretextComponent.Math },
    graph: { component: PretextComponent.Graph },
    point: { component: PretextComponent.PointInText },
    division: {
        component: PretextComponent.Division,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    textInput: { component: PretextComponent.TextInput },
    mathInput: { component: PretextComponent.MathInput },
    codeEditor: { component: PretextComponent.CodeEditor },
    subsetOfReals: { component: PretextComponent.SubsetOfReals },
    displayMathNumbered: { component: PretextComponent.DisplayMathNumbered },
    text: { component: PretextComponent.Text },
    boolean: { component: PretextComponent.Boolean },
    title: { component: PretextComponent.Title, passthroughChildren: true },
    _fragment: {
        component: PretextComponent._Fragment,
        passthroughChildren: true,
    },
    // Ref and Xref are treated the same, but PreTeXt only has <xref>.
    ref: { component: PretextComponent.Xref, passthroughChildren: true },
    xref: { component: PretextComponent.Xref, passthroughChildren: true },
    ol: { component: PretextComponent.Ol, passthroughChildren: true },
    ul: { component: PretextComponent.Ul, passthroughChildren: true },
    li: { component: PretextComponent.Li, passthroughChildren: true },

    // Theorem-like elements shared with DoenetML.
    // PreTeXt theorem-like elements not present in DoenetML: assumption, axiom,
    // claim, conjecture, corollary, fact, heuristic, hypothesis, lemma,
    // observation, principle, proposition, remark.
    definition: TheoremLikeConverter,
    example: TheoremLikeConverter,
    proof: TheoremLikeConverter,
    theorem: TheoremLikeConverter,
    question: TheoremLikeConverter,
    activity: TheoremLikeConverter,
    remark: TheoremLikeConverter,
    aside: TheoremLikeConverter,
    note: TheoremLikeConverter,
    problem: TheoremLikeConverter,

    // Inline text formatting elements. These are the same in Doenet and Pretext
    em: NoProcessingConverter,
    c: NoProcessingConverter,
    q: NoProcessingConverter,
    pre: NoProcessingConverter,
    ellipsis: NoProcessingConverter,
    mdash: NoProcessingConverter,
    nbsp: NoProcessingConverter,
    lq: NoProcessingConverter,
    rq: NoProcessingConverter,
    lsq: NoProcessingConverter,
    rsq: NoProcessingConverter,
    sq: NoProcessingConverter,

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

    // Tags where only the capitalization changes
    sideBySide: passThroughWithRenamedTag("sidebyside"),
    blockQuote: passThroughWithRenamedTag("blockquote"),

    // Tags with no representation in PreTeXt
    br: {
        component: PretextComponent._Omit,
    },
    hr: {
        component: PretextComponent._Omit,
    },

    // Provide a renderer for unrecognized elements. This allows us to support
    // pretext tags we don't currently know about.
    [FALLBACK_RENDERER_KEY]: {
        component: PretextComponent._PassThroughWithTag,
        passthroughChildren: true,
    },
};

export const PRETEXT_GRAPH_MODE_COMPONENTS: RendererObject = {};
