import React from "react";
import PointControlsFamily from "./families/PointControlsFamily";
import CircleControlsFamily from "./families/CircleControlsFamily";
import LineSegmentControlsFamily from "./families/LineSegmentControlsFamily";
import VectorControlsFamily from "./families/VectorControlsFamily";
import type {
    GraphControlCircle,
    GraphControlLineSegment,
    GraphControlPoint,
    GraphControlVector,
} from "./model";

type GraphControlsRootProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggablePointsForControls: GraphControlPoint[];
        draggableCirclesForControls: GraphControlCircle[];
        draggableLineSegmentsForControls: GraphControlLineSegment[];
        draggableVectorsForControls: GraphControlVector[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

export default React.memo(function GraphControlsRoot(
    props: GraphControlsRootProps,
) {
    const { id } = props;

    return (
        <div id={id}>
            <PointControlsFamily {...props} />
            <CircleControlsFamily {...props} />
            <LineSegmentControlsFamily {...props} />
            <VectorControlsFamily {...props} />
        </div>
    );
});
