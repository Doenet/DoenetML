import React from "react";
import { MathJax } from "better-react-mathjax";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";

export const M: BasicComponentWithPassthroughChildren = ({ children }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    if (onServer) {
        return <span className="process-math">{children}</span>;
    }
    // better-react-mathjax cannot handle multiple children (it will not update when they change)
    // so create a single string.
    const childrenString = `\\(${
        Array.isArray(children) ? children.join("") : String(children)
    }\\)`;
    return (
        <MathJax inline dynamic>
            {childrenString}
        </MathJax>
    );
};
