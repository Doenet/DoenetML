import React from "react";
import { MathJax } from "better-react-mathjax";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";

/**
 * The two cores represent `<m>` differently: the rust core renders its content
 * as a child `<text>` element (consumed here via passthrough children), while
 * the JavaScript core (like production `@doenet/doenetml`) puts the rendered
 * LaTeX in a `latex` prop with no children. Prefer `latex` when present and
 * fall back to children, so a single renderer works against both cores.
 */
type MData = { props?: { latex?: string } };

export const M: BasicComponentWithPassthroughChildren<MData> = ({
    node,
    children,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);

    const latex = node.data.props?.latex;
    const content =
        latex != null && latex !== ""
            ? latex
            : Array.isArray(children)
              ? children.join("")
              : String(children);

    if (onServer) {
        return <span className="process-math">{content}</span>;
    }
    // better-react-mathjax cannot handle multiple children (it will not update when they change)
    // so create a single string.
    const childrenString = `\\(${content}\\)`;
    return (
        <MathJax inline dynamic>
            {childrenString}
        </MathJax>
    );
};
