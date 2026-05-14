import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { generateHtmlId } from "../utils";
import { normalizeAttrs } from "../../utils/pretext/normalize-attrs";

/**
 * Renderer for all theorem-like elements in PreTeXt. It is the user's responsibility to
 * ensure the children are correct (e.g., titles at the start, etc.)
 */
export const TheoremLike: BasicComponentWithPassthroughChildren<{}> = ({
    children,
    node,
    annotation,
    ancestors,
}) => {
    const htmlId = generateHtmlId(node, annotation, ancestors);

    const attrs = {
        ...normalizeAttrs(node.attributes),
        "xml:id": htmlId,
    };
    // TODO: pull out and grab the valid title only (i.e., the last title)

    return React.createElement(node.name, attrs, children);
};
