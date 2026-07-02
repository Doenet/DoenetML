import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

/**
 * A _Omit component is a special component that cannot be directly authored.
 * It will omit the element and all its children.
 */
export const _Omit: BasicComponentWithPassthroughChildren<{}> = ({
    children,
    node,
}) => {
    return null;
};
