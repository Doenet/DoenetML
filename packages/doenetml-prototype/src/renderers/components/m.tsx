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
    return <MathJax inline={true}>\({children}\)</MathJax>;
};
