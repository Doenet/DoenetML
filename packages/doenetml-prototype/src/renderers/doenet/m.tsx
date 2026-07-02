import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { _ServerSafeMath } from "./_server-safe-math";
import { ResolvedStyleDefinition } from "@doenet/utils";
import { useTextRendererStyle } from "../../utils/use-renderer-style";

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
type MData = {
    props: {
        latex?: string;
        selectedStyle: ResolvedStyleDefinition;
        renderMode?: "inline" | "display" | "numbered" | "align";
        equationTag?: string;
    };
};

export const M: BasicComponentWithPassthroughChildren<MData> = ({
    node,
    children,
    htmlId,
}) => {
    const style = useTextRendererStyle(node.data.props.selectedStyle);

    // Construct a suitable `renderMode` prop for `_ServerSafeMath`
    const renderMode =
        node.data.props.renderMode === "numbered"
            ? { numbered: node.data.props.equationTag ?? "" }
            : node.data.props.renderMode;

    return (
        <span id={htmlId} style={style}>
            <_ServerSafeMath
                latex={node.data.props.latex}
                renderMode={renderMode}
            >
                {children}
            </_ServerSafeMath>
        </span>
    );
};
