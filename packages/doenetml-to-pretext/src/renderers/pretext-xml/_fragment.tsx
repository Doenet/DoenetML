import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

/**
 * A _Fragment component is a special component that cannot be directly authored.
 * It is meant to display references to existing content.
 */
export const _Fragment: BasicComponentWithPassthroughChildren<{}> = ({
    children,
}) => {
    return <React.Fragment>{children}</React.Fragment>;
};
