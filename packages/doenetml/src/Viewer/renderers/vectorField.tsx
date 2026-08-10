import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { buildVectorFieldData } from "./utils/fieldGeometry";
import { useFieldCurve, useFieldFunction } from "./utils/useFieldCurve";

interface VectorFieldSVs extends GraphicalSVs {
    haveFunctions: boolean;
    fDefinitions: any[];
    numInputs: number;
    dx: number;
    dy: number;
    xoffset: number;
    yoffset: number;
    markLength: number;
    normalize: boolean;
    maxMarks: number;
}

export default React.memo(function VectorField(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<VectorFieldSVs>(props);

    // @ts-ignore
    VectorField.ignoreActionsWithoutCore = () => true;

    const u = useFieldFunction(SVs.fDefinitions[0], SVs.numInputs);
    const v = useFieldFunction(SVs.fDefinitions[1], SVs.numInputs);

    useFieldCurve({
        SVs,
        enabled: SVs.haveFunctions,
        buildData: (bounds, scale) =>
            buildVectorFieldData({
                u,
                v,
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
                normalize: SVs.normalize,
            }),
    });

    return null;
});
