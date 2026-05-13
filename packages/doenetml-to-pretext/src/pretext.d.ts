/**
 * This file is purely used for its types. It defines all the PreTeXt elements so that they can be used with JSX syntax.
 *
 * Without importing this file `<m>...</m>` would produce a typescript error (since it is not an HTML element). After importing, it is no longer an error.
 */

type PretextElementProps = {
    [key: string]: unknown;
    children?: unknown;
};

type PretextIntrinsicElements = {
    // Structural elements
    document: PretextElementProps;
    pretext: PretextElementProps;
    article: PretextElementProps;
    book: PretextElementProps;

    // Text and inline elements
    p: PretextElementProps;
    m: PretextElementProps;
    c: PretextElementProps;
    em: PretextElementProps;
    note: PretextElementProps;
    q: PretextElementProps;
    pre: PretextElementProps;
    ellipsis: PretextElementProps;
    mdash: PretextElementProps;
    nbsp: PretextElementProps;
    lq: PretextElementProps;
    rq: PretextElementProps;
    lsq: PretextElementProps;
    rsq: PretextElementProps;
    sq: PretextElementProps;

    // Inputs and references
    fillin: PretextElementProps;
    xref: PretextElementProps;

    // Division and title elements
    division: PretextElementProps;
    title: PretextElementProps;

    // Theorem-like elements
    definition: PretextElementProps;
    theorem: PretextElementProps;
    proof: PretextElementProps;
    example: PretextElementProps;
    question: PretextElementProps;
    activity: PretextElementProps;
    problem: PretextElementProps;
    remark: PretextElementProps;
    aside: PretextElementProps;

    // List elements
    ol: PretextElementProps;
    ul: PretextElementProps;
    li: PretextElementProps;

    // Graphics and renamed tags
    graph: PretextElementProps;
    text: PretextElementProps;
    math: PretextElementProps;
    sidebyside: PretextElementProps;
    blockquote: PretextElementProps;
};

declare global {
    namespace JSX {
        interface IntrinsicElements extends PretextIntrinsicElements {}
    }
}

declare module "react" {
    namespace JSX {
        interface IntrinsicElements extends PretextIntrinsicElements {}
    }
}

export {};
