import React from "react";
import { MathJax } from "better-react-mathjax";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";

/**
 * Render a latex string using MathJax. This component is meant to be used inside of other components and not as a renderer on its own.
 *
 * It is also safe to be called when the rendering mode is "server", in which case no MathJax wrapper is added.
 */
export const _ServerSafeMath: React.FC<
    React.PropsWithChildren<{
        latex?: string | null;
        renderMode?: "inline" | "display" | { numbered: string } | "align";
    }>
> = ({ children, latex, renderMode }) => {
    const onServer = useAppSelector(renderingOnServerSelector);

    const hasLatex = latex != null && latex !== "";

    if (onServer) {
        // Use the JS core's `latex` prop when present; otherwise render the
        // children directly, preserving the rust core's referenced child
        // element (stringifying it would yield "[object Object]").
        return (
            <span className="process-math">{hasLatex ? latex : children}</span>
        );
    }
    let mathStartMarker = "\\(";
    let mathEndMarker = "\\)";
    if (renderMode === "display") {
        mathStartMarker = "\\[";
        mathEndMarker = "\\]";
    } else if (typeof renderMode === "object" && "numbered" in renderMode) {
        mathStartMarker = `\\begin{equation}\\tag{${renderMode.numbered}}`;
        mathEndMarker = "\\end{equation}";
    } else if (renderMode === "align") {
        mathStartMarker = "\\begin{align*}";
        mathEndMarker = "\\end{align*}";
    }

    // better-react-mathjax cannot handle multiple children (it will not update
    // when they change), so create a single string. Without a `latex` prop
    // (rust core) fall back to joining the children.
    const latexString = `${mathStartMarker}${
        hasLatex
            ? latex
            : Array.isArray(children)
              ? children.join("")
              : String(children)
    }${mathEndMarker}`;
    return (
        <MathJax inline dynamic>
            {latexString}
        </MathJax>
    );
};
