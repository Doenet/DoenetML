import React from "react";
import { MathJax } from "better-react-mathjax";
import { BasicComponent } from "../types";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { PointPropsInText } from "@doenet/doenetml-worker";

type PointData = { props: PointPropsInText };

export const PointInText: BasicComponent<PointData> = ({ node }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    if (onServer) {
        return (
            <span className="process-math">{node.data.props.coordsLatex}</span>
        );
    }
    // better-react-mathjax cannot handle multiple children (it will not update when they change)
    // so create a single string.
    const latexString = `\\(${node.data.props.coordsLatex}\\)`;
    return (
        <MathJax inline dynamic>
            {latexString}
        </MathJax>
    );
};
