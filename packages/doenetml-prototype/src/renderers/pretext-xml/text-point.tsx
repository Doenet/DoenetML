import React from "react";
import { BasicComponent } from "../types";
import { PointPropsInText } from "@doenet/doenetml-worker-rust";

type PointData = { props: PointPropsInText };

export const PointInText: BasicComponent<PointData> = ({ node }) => {
    // better-react-mathjax cannot handle multiple children (it will not update when they change)
    // so create a single string.
    const latexString = node.data.props.coordsLatex;
    return React.createElement("m", {}, latexString);
};
