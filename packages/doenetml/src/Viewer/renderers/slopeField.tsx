import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { buildSlopeFieldData } from "./utils/fieldGeometry";
import { useFieldCurve, useFieldFunction } from "./utils/useFieldCurve";

interface SlopeFieldSVs extends GraphicalSVs {
    haveFunction: boolean;
    fDefinitions: any[];
    numInputs: number;
    dx: number;
    dy: number;
    xoffset: number;
    yoffset: number;
    markLength: number;
    maxMarks: number;
}

export default React.memo(function SlopeField(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<SlopeFieldSVs>(props);

    // @ts-ignore
    SlopeField.ignoreActionsWithoutCore = () => true;

    const f = useFieldFunction(SVs.fDefinitions[0], SVs.numInputs);

    useFieldCurve({
        SVs,
        enabled: SVs.haveFunction,
        buildData: (bounds, scale) =>
            buildSlopeFieldData({
                f,
                bounds,
                grid: {
                    dx: SVs.dx,
                    dy: SVs.dy,
                    xoffset: SVs.xoffset,
                    yoffset: SVs.yoffset,
                },
                scale,
                markLength: SVs.markLength,
                maxMarks: SVs.maxMarks,
            }),
    });

    return null;
});
