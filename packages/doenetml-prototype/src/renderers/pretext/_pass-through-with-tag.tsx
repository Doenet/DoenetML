import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { normalizeAttrs } from "../../utils/pretext/normalize-attrs";

/**
 * A _PassThroughWithTag component is a special component that cannot be directly authored.
 * It will render `node` in directly as an XML element with the same name (e.g. if `node.name` is "p", it will render `<p>`).
 */
export const _PassThroughWithTag: BasicComponentWithPassthroughChildren<{}> = ({
    children,
    node,
}) => {
    return React.createElement(
        node.name,
        normalizeAttrs(node.attributes),
        children,
    );
};
