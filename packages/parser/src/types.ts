import * as LezerTerms from "./generated-assets/lezer-doenet.terms";

type AllLezerTerms = keyof typeof LezerTerms;
// Only terms that start with a capital letter are exposed by Lezer
type LezerTerms = AllLezerTerms & Capitalize<AllLezerTerms>;

export type LezerSyntaxNodeName = LezerTerms | "⚠";

// Dast stands for Doenet AST. It is closely based off of Xast with changes where needed.
// The following resources are from the Xast project:
// Project: https://github.com/syntax-tree/xast
// Definitions by: stefanprobst <https://github.com/stefanprobst>
//                 Titus Wormer <https://github.com/wooorm>
//                 Christian Murphy <https://github.com/ChristianMurphy>
//                 Junyoung Choi <https://github.com/rokt33r>
//                 Remco Haszing <https://github.com/remcohaszing>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import type {
    Data as UnistData,
    Literal as UnistLiteral,
    Node as UnistNode,
    Parent as UnistParent,
} from "unist";
import {
    FunctionMacro as _FunctionMacro,
    Macro as _Macro,
    PathPart as _PathPart,
    PropIndex as _PropIndex,
} from "./macros/types";
import {
    FunctionMacro as _FunctionMacroV6,
    Macro as _MacroV6,
    PathPart as _PathPartV6,
    PropIndex as _PropIndexV6,
} from "./macros-v6/types";

export type Position = UnistLiteral["position"] & {};

// ## Interfaces

/**
 * Info associated with an element.
 */
export interface DastAttribute extends DastAbstractNode {
    type: "attribute";
    name: string;
    children: (DastText | DastMacro | DastFunctionMacro)[];
}

/**
 * Info associated with xast nodes by the ecosystem.
 *
 * This space is guaranteed to never be specified by unist or xast.
 * But you can use it in utilities and plugins to store data.
 *
 * This type can be augmented to register custom data.
 * For example:
 *
 * ```ts
 * declare module 'xast' {
 *   interface Data {
 *     // `someNode.data.myId` is typed as `number | undefined`
 *     myId?: number | undefined
 *   }
 * }
 * ```
 */
export interface Data extends UnistData {}

// ## Content maps

/**
 * Union of registered xast nodes that can occur in {@link DastElement}.
 *
 * To register more custom xast nodes, add them to {@link ElementContentMap}.
 * They will be automatically added here.
 */
export type DastElementContent = ElementContentMap[keyof ElementContentMap];

/**
 * Registry of all xast nodes that can occur as children of {@link DastElement}.
 *
 * For a union of all {@link DastElement} children, see {@link DastElementContent}.
 */
export interface ElementContentMap {
    cdata: DastCdata;
    comment: DastComment;
    element: DastElement;
    instruction: DastInstruction;
    text: DastText;
    error: DastError;
    macro: DastMacro;
    function: DastFunctionMacro;
}

/**
 * Union of registered xast nodes that can occur in {@link DastRoot}.
 *
 * To register custom xast nodes, add them to {@link RootContentMap}.
 * They will be automatically added here.
 */
export type DastRootContent = RootContentMap[keyof RootContentMap];

/**
 * Registry of all xast nodes that can occur as children of {@link DastRoot}.
 *
 * > 👉 **Note**: {@link DastRoot} does not need to be an entire document.
 * > it can also be a fragment.
 *
 * For a union of all {@link DastRoot} children, see {@link DastRootContent}.
 */
export interface RootContentMap {
    cdata: DastCdata;
    comment: DastComment;
    doctype: DastDoctype;
    element: DastElement;
    instruction: DastInstruction;
    text: DastText;
    error: DastError;
    macro: DastMacro;
    function: DastFunctionMacro;
}

// ### Special content types

/**
 * Union of registered xast literals.
 *
 * To register custom xast nodes, add them to {@link RootContentMap} and other
 * places where relevant.
 * They will be automatically added here.
 */
export type DastLiterals = Extract<DastNodes, UnistLiteral>;

/**
 * Union of registered xast nodes.
 *
 * To register custom xast nodes, add them to {@link RootContentMap} and other
 * places where relevant.
 * They will be automatically added here.
 */
export type DastNodes = DastRoot | DastRootContent;

/**
 * Union of registered xast parents.
 *
 * To register custom xast nodes, add them to {@link RootContentMap} and other
 * places where relevant.
 * They will be automatically added here.
 */
export type DastParents = Extract<DastNodes, UnistParent>;

// ## Abstract nodes

/**
 * Abstract xast node that contains the smallest possible value.
 *
 * This interface is supposed to be extended if you make custom xast nodes.
 *
 * For a union of all registered xast literals, see {@link DastLiterals}.
 */
export interface DastLiteral extends DastAbstractNode {
    /**
     * Plain-text value.
     */
    value: string;
}

/**
 * Abstract xast node.
 *
 * This interface is supposed to be extended.
 * If you can use {@link DastLiteral} or {@link DastParent}, you should.
 * But for example in XML, a `Doctype` is neither literal nor parent, but
 * still a node.
 *
 * To register custom xast nodes, add them to {@link RootContentMap} and other
 * places where relevant (such as {@link ElementContentMap}).
 *
 * For a union of all registered xast nodes, see {@link DastNodes}.
 */
export interface DastAbstractNode extends UnistNode {
    /**
     * Info from the ecosystem.
     */
    data?: Data | undefined;
}

/**
 * Abstract xast node that contains other xast nodes (*children*).
 *
 * This interface is supposed to be extended if you make custom xast nodes.
 *
 * For a union of all registered xast parents, see {@link DastParents}.
 */
export interface DastParent extends DastAbstractNode {
    /**
     * List of children.
     */
    children: DastRootContent[];
}

// ## Concrete nodes

/**
 * XML CDATA section.
 */
export interface DastCdata extends DastLiteral {
    /**
     * Node type of XML CDATA sections in xast.
     */
    type: "cdata";
    /**
     * Data associated with the cdata.
     */
    data?: CdataData | undefined;
}

/**
 * Info associated with xast instructions by the ecosystem.
 */
export interface CdataData extends Data {}

/**
 * XML comment.
 */
export interface DastComment extends DastLiteral {
    /**
     * Node type of XML comments in xast.
     */
    type: "comment";
    /**
     * Data associated with the comment.
     */
    data?: CommentData | undefined;
}

/**
 * Info associated with xast comments by the ecosystem.
 */
export interface CommentData extends Data {}

/**
 * XML document type.
 */
export interface DastDoctype extends DastAbstractNode {
    /**
     * Node type of XML document types in xast.
     */
    type: "doctype";
    /**
     * Name of the root element.
     *
     * To illustrate, for `<!DOCTYPE html>`, `name` is `'html'`.
     */
    name: string;
    /**
     * Public identifier of the document.
     */
    public?: string | undefined;
    /**
     * System identifier of the document.
     */
    system?: string | undefined;
    /**
     * Data associated with the doctype.
     */
    data?: DoctypeData | undefined;
}

/**
 * Info associated with xast doctypes by the ecosystem.
 */
export interface DoctypeData extends Data {}

/**
 * XML processing instruction.
 */
export interface DastInstruction extends DastLiteral {
    /**
     * Node type of XML processing instructions in xast.
     */
    type: "instruction";
    /**
     * Name of the instruction.
     *
     * To illustrate, for `<?php?>`, `name` is `'php'`.
     */
    name: string;
    /**
     * Data associated with the instruction.
     */
    data?: InstructionData | undefined;
}

/**
 * Info associated with xast instructions by the ecosystem.
 */
export interface InstructionData extends Data {}

/**
 * XML element.
 */
export interface DastElement extends DastParent {
    /**
     * Node type of elements.
     */
    type: "element";
    /**
     * Qualified name (such as `'artist'` or `'svg:rect'`) of the element.
     */
    name: string;
    /**
     * Info associated with the element.
     */
    attributes: Record<string, DastAttribute>;
    /**
     * Children of element.
     */
    children: DastElementContent[];
    /**
     * Data associated with the element.
     */
    data?: ElementData | undefined;
}

/**
 * Info associated with xast elements by the ecosystem.
 */
export interface ElementData extends Data {}

/**
 * Document fragment or a whole document.
 *
 * Should be used as the root of a tree and must not be used as a child.
 *
 * XML specifies that documents should have exactly one element child, so a
 * root should have exactly one element child when representing a whole
 * document.
 */
export interface DastRoot extends DastParent {
    /**
     * Node type of xast root.
     */
    type: "root";
    /**
     * Data associated with the xast root.
     */
    data?: RootData | undefined;
}

/**
 * Info associated with xast root nodes by the ecosystem.
 */
export interface RootData extends Data {}

/**
 * XML character data (plain text).
 */
export interface DastText extends DastLiteral {
    /**
     * Node type of XML character data (plain text) in xast.
     */
    type: "text";
    /**
     * Data associated with the text.
     */
    data?: TextData | undefined;
}

/**
 * Info associated with xast texts by the ecosystem.
 */
export interface TextData extends Data {}

export interface DastError extends DastAbstractNode {
    type: "error";
    message: string;
    data?: ErrorData;
}

export interface ErrorData extends Data {}

export type PrintOptions = {
    /**
     * Whether to render with the DoenetML syntax rather than true XML.
     * That means `<` and `&` characters are allowed unescaped in the output.
     */
    doenetSyntax?: boolean;
    /**
     * Whether to output XML error nodes when there are processing errors.
     */
    inlineErrors?: boolean;
};

//
// Macros
//

// We glue together the types of macros and regular DAST nodes
export type DastMacro = Omit<_Macro, "attributes" | "path"> & {
    attributes: Record<string, DastAttribute>;
    path: DastMacroPathPart[];
};
export type DastMacroPathPart = Omit<_PathPart, "index"> & {
    index: (Omit<_PropIndex, "value"> & { value: (DastText | DastMacro)[] })[];
};
export type DastMacroFullPath = DastMacroPathPart[];
export type DastFunctionMacro = Omit<_FunctionMacro, "input" | "path"> & {
    input: DastElementContent[][] | null;
    path: DastMacroPathPart[];
};

//
// Old-style macro support
//
export type DastMacroV6 = Omit<_MacroV6, "attributes" | "path"> & {
    attributes: DastAttributeV6[];
    accessedProp: DastMacroV6 | null;
    path: DastMacroPathPartV6[];
};
export type DastMacroPathPartV6 = Omit<_PathPartV6, "index"> & {
    index: (Omit<_PropIndex, "value"> & {
        value: (DastText | DastMacroV6)[];
    })[];
};
export type DastMacroFullPathV6 = DastMacroPathPartV6[];
export type DastFunctionMacroV6 = Omit<_FunctionMacroV6, "input" | "path"> & {
    input: DastElementContentV6[][] | null;
    macro: DastMacroV6;
};

export interface DastAttributeV6 extends DastAbstractNode {
    type: "attribute";
    name: string;
    children: (DastText | DastMacroV6 | DastFunctionMacroV6)[];
}

export interface ElementContentMapV6 {
    cdata: DastCdata;
    comment: DastComment;
    element: DastElementV6;
    instruction: DastInstruction;
    text: DastText;
    error: DastError;
    macro: DastMacroV6;
    function: DastFunctionMacroV6;
}
export interface RootContentMapV6 {
    cdata: DastCdata;
    comment: DastComment;
    doctype: DastDoctype;
    element: DastElementV6;
    instruction: DastInstruction;
    text: DastText;
    error: DastError;
    macro: DastMacroV6;
    function: DastFunctionMacroV6;
}
export type DastRootContentV6 = RootContentMapV6[keyof RootContentMapV6];
export type DastNodesV6 = DastRootV6 | DastRootContentV6;
export type DastElementContentV6 =
    ElementContentMapV6[keyof ElementContentMapV6];
export interface DastElementV6 extends DastParentV6 {
    type: "element";
    name: string;
    attributes: Record<string, DastAttributeV6>;
    children: DastElementContentV6[];
    data?: ElementData | undefined;
}
export interface DastRootV6 extends DastParentV6 {
    type: "root";
    data?: RootData | undefined;
}
export interface DastParentV6 extends DastAbstractNode {
    children: DastRootContentV6[];
}
