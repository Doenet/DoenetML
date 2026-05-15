import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

/**
 * A _PassThroughWithoutTag component is a special component that cannot be directly authored.
 * It will render only the children without wrapping them in any tag.
 * This is useful for elements that should be transparent in the output.
 */
export const _PassThroughWithoutTag: BasicComponentWithPassthroughChildren<{}> =
    ({ children }) => {
        return <React.Fragment>{children}</React.Fragment>;
    };
