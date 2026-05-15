import React from "react";
import { BasicComponent } from "../types";
import { MathPropsInText } from "@doenet/doenetml-worker";

type MathData = { props: MathPropsInText };

export const DisplayMath: BasicComponent<MathData> = ({ node }) => {
    const latexString = node.data.props.latex;
    return <md>{latexString}</md>;
};
