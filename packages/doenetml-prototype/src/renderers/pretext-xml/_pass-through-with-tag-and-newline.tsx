import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { _PassThroughWithTag } from "./_pass-through-with-tag";

/**
 * Same as `_PassThroughWithTag` except inserts newlines before and after the children.
 */
export const _PassThroughWithTagAndNewline: BasicComponentWithPassthroughChildren<{}> =
    ({ children, ...rest }) => {
        return (
            <_PassThroughWithTag {...rest}>
                {"\n"}
                {children}
                {"\n"}
            </_PassThroughWithTag>
        );
    };
