import React from "react";
import { BasicComponent } from "../types";
import { MathPropsInText } from "@doenet/doenetml-worker";
import { mathContentWithBlanks } from "./utils/math-blanks";

type MathData = { props: MathPropsInText };

export const Math: BasicComponent<MathData> = ({ node }) => {
    const latexString = node.data.props.latex;
    return <m>{mathContentWithBlanks(latexString)}</m>;
};
