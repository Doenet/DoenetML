import React from "react";
import { BasicComponent } from "../types";
import { MathPropsInText } from "@doenet/doenetml-worker";
import { _ServerSafeMath } from "./_server-safe-math";

type MathData = { props: MathPropsInText };

export const Math: BasicComponent<MathData> = ({ node, htmlId }) => {
    return (
        <span id={htmlId}>
            <_ServerSafeMath latex={node.data.props.latex}></_ServerSafeMath>
        </span>
    );
};
