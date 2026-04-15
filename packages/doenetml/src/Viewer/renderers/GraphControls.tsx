import React from "react";
import PointGraphControls from "./PointGraphControls";
import { GraphControlPoint } from "./utils/graphControls";

type GraphControlsProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggablePointsForControls: GraphControlPoint[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

/**
 * Renderer-agnostic graph-controls entry point.
 *
 * Point controls remain the only implementation today, but this shell keeps
 * the composition boundary stable when future control families are added.
 */
export default React.memo(function GraphControls(props: GraphControlsProps) {
    return <PointGraphControls {...props} />;
});
