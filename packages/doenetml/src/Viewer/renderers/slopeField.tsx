import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { buildSlopeFieldData } from "./utils/fieldGeometry";
import {
    fieldGrid,
    useFieldCurve,
    useFieldFunction,
    type FieldSVs,
} from "./utils/useFieldCurve";

export default React.memo(function SlopeField(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<FieldSVs>(props);

    // @ts-ignore
    SlopeField.ignoreActionsWithoutCore = () => true;

    const f = useFieldFunction(SVs.fDefinitions[0], SVs.numInputs);

    useFieldCurve({
        SVs,
        buildData: (bounds, scale) =>
            buildSlopeFieldData({
                f,
                bounds,
                grid: fieldGrid(SVs),
                scale,
                markLength: SVs.markLength,
                maxMarks: SVs.maxMarks,
            }),
    });

    return null;
});
