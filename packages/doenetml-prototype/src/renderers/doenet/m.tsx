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
 *
 * This dual handling is temporary scaffolding. The longer-term fix is to make
 * the cores agree on the props each component exposes (likely normalized in the
 * JS->Dast conversion) so the renderer can assume a single representation; until
 * that prop reconciliation happens, the renderer tolerates both forms.
 */
type MData = { props: { latex?: string } };

export const M: BasicComponentWithPassthroughChildren<MData> = ({
    node,
    children,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);

    const latex = node.data.props.latex;
    const hasLatex = latex != null && latex !== "";

    if (onServer) {
        // Use the JS core's `latex` prop when present; otherwise render the
        // children directly, preserving the rust core's referenced child
        // element (stringifying it would yield "[object Object]").
        return (
            <span className="process-math">{hasLatex ? latex : children}</span>
        );
    }
    // better-react-mathjax cannot handle multiple children (it will not update
    // when they change), so create a single string. Without a `latex` prop
    // (rust core) fall back to joining the children.
    const latexString = `\\(${
        hasLatex
            ? latex
            : Array.isArray(children)
              ? children.join("")
              : String(children)
    }\\)`;
    return (
        <MathJax inline dynamic>
            {latexString}
        </MathJax>
    );
};
