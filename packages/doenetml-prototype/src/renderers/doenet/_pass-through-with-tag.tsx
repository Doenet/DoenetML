import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

/**
 * A _PassThroughWithTag component is a special component that cannot be directly authored.
 * It renders `node` as an HTML element with the same tag name (e.g. if `node.name` is "em",
 * it renders `<em>`).
 */
export const _PassThroughWithTag: BasicComponentWithPassthroughChildren<{}> = ({
    children,
    node,
    htmlId,
}) => {
    return React.createElement(node.name, { id: htmlId }, children);
};
