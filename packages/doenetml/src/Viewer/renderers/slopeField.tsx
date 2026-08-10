import React, { useContext } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { styleToDash } from "./utils/styleToDash";
import { buildSlopeFieldData } from "./utils/fieldGeometry";
import { useFieldCurve } from "./utils/useFieldCurve";

interface SlopeFieldSVs extends GraphicalSVs {
    haveFunction: boolean;
    fDefinition: any;
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
        enabled: Boolean(board) && SVs.haveFunction,
        visible: !SVs.hidden,
        attributes,
        buildData: (bounds, scale) => {
            const raw = createFunctionFromDefinition(SVs.fDefinition);
            // A one-input function's second parameter is `overrideDomain`, so
            // it must be called with exactly one argument.
            const f =
                SVs.numInputs === 2
                    ? (x: number, y: number) => raw(x, y)
                    : (x: number, _y: number) => raw(x);

            return buildSlopeFieldData({
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
            });
        },
    });

    return null;
});
