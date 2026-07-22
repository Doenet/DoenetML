import React from "react";
import { BasicComponent } from "../types";
import { ResolvedStyleDefinition } from "@doenet/utils";
import { _ServerSafeMath } from "./_server-safe-math";
import { useTextRendererStyle } from "../../utils/use-renderer-style";

type AngleData = {
    props: { latex: string; selectedStyle: ResolvedStyleDefinition };
};

export const Angle: BasicComponent<AngleData> = ({ node, htmlId }) => {
    const style = useTextRendererStyle(node.data.props.selectedStyle);
    return (
        <span id={htmlId} style={style}>
            <_ServerSafeMath latex={node.data.props.latex} />
        </span>
    );
};
