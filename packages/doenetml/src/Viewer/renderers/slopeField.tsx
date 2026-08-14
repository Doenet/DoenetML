import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { buildSlopeFieldData } from "./utils/fieldGeometry";
import {
    useFieldCurve,
    useFieldFunction,
    type FieldSVs,
} from "./utils/useFieldCurve";

export default React.memo(function SlopeField(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<FieldSVs>(props);

    // @ts-ignore
    SlopeField.ignoreActionsWithoutCore = () => true;

    const f = useFieldFunction(SVs.fDefinitions[0]);

    useFieldCurve({
        SVs,
        buildData: (sampling) => buildSlopeFieldData({ f, ...sampling }),
    });

    return null;
});
