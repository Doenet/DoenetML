import React from "react";
import PointGraphControls from "./PointGraphControls";
import CircleGraphControls from "./CircleGraphControls";
import LineSegmentGraphControls from "./LineSegmentGraphControls";
import VectorGraphControls from "./VectorGraphControls";
import type {
    GraphControlCircle,
    GraphControlLineSegment,
    GraphControlPoint,
    GraphControlVector,
} from "./utils/graphControls";

type GraphObjectControlsProps = {
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

export default React.memo(function GraphObjectControls(
    props: GraphObjectControlsProps,
) {
    return (
        <>
            <PointGraphControls {...props} />
            <CircleGraphControls {...props} />
            <LineSegmentGraphControls {...props} />
            <VectorGraphControls {...props} />
        </>
    );
});
