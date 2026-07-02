import React from "react";
import { BasicComponent } from "../types";
import { MathPropsInText } from "@doenet/doenetml-worker";

type MathData = { props: MathPropsInText };

export const DisplayMathNumbered: BasicComponent<MathData> = ({ node }) => {
    const latexString = node.data.props.latex;
    return <md number="yes">{latexString}</md>;
};
