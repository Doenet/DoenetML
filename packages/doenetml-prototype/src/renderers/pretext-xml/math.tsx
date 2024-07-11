import React from "react";
import { BasicComponent } from "../types";

type MathData = { props: { latex: string } };

export const Math: BasicComponent<MathData> = ({ node }) => {
    // better-react-mathjax cannot handle multiple children (it will not update when they change)
    // so create a single string.
    const latexString = node.data.props.latex;
    return React.createElement("m", {}, latexString);
};
