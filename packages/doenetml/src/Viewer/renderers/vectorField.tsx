import React, { useContext } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { styleToDash } from "./utils/styleToDash";
import { buildVectorFieldData } from "./utils/fieldGeometry";
import { useFieldCurve } from "./utils/useFieldCurve";

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

    const board = useContext(BoardContext);
    const { darkMode } = useContext(DocContext) || {};

    const lineColor =
        darkMode === "dark"
            ? SVs.selectedStyle.lineColorDarkMode
            : SVs.selectedStyle.lineColor;

    const attributes: Record<string, any> = {
        visible: !SVs.hidden,
        withLabel: false,
        fixed: true,
        layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
        strokeColor: lineColor,
        strokeOpacity: SVs.selectedStyle.lineOpacity,
        strokeWidth: SVs.selectedStyle.lineWidth,
        dash: styleToDash(SVs.selectedStyle.lineStyle),
        highlight: false,
    };

    useFieldCurve({
        enabled: Boolean(board) && SVs.haveFunctions,
        visible: !SVs.hidden,
        attributes,
        buildData: (bounds, scale) => {
            const rawU = createFunctionFromDefinition(SVs.fDefinitions[0]);
            const rawV = createFunctionFromDefinition(SVs.fDefinitions[1]);
            // See slopeField: one-input functions take `overrideDomain` second.
            const twoIn = SVs.numInputs === 2;
            const u = twoIn
                ? (x: number, y: number) => rawU(x, y)
                : (x: number, _y: number) => rawU(x);
            const v = twoIn
                ? (x: number, y: number) => rawV(x, y)
                : (x: number, _y: number) => rawV(x);

            return buildVectorFieldData({
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
            });
        },
    });

    return null;
});
