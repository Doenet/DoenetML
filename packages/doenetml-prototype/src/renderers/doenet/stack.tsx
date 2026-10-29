import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import "./side-by-side.css";

/**
 * Stack renders its children one above the other.
 */
export const Stack: BasicComponentWithPassthroughChildren = ({
    children,
    htmlId,
}) => {
    return (
        <div className="stack" id={htmlId}>
            {children}
        </div>
    );
};
