import React from "react";
import { BasicComponent } from "../types";
import { PointPropsInText } from "@doenet/doenetml-worker";

type PointData = { props: PointPropsInText };

export const PointInText: BasicComponent<PointData> = ({ node }) => {
    const latexString = node.data.props.coordsLatex;
    return <m>{latexString}</m>;
};
