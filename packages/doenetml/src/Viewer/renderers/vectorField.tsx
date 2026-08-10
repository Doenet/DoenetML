import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { buildVectorFieldData } from "./utils/fieldGeometry";
import {
    useFieldCurve,
    useFieldFunction,
    type FieldSVs,
} from "./utils/useFieldCurve";

interface VectorFieldSVs extends FieldSVs {
    normalize: boolean;
}

export default React.memo(function VectorField(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<VectorFieldSVs>(props);

    // @ts-ignore
    VectorField.ignoreActionsWithoutCore = () => true;

    const u = useFieldFunction(SVs.fDefinitions[0], SVs.numInputs);
    const v = useFieldFunction(SVs.fDefinitions[1], SVs.numInputs);

    useFieldCurve({
        SVs,
        buildData: (sampling) =>
            buildVectorFieldData({
                u,
                v,
                normalize: SVs.normalize,
                ...sampling,
            }),
    });

    return null;
});
