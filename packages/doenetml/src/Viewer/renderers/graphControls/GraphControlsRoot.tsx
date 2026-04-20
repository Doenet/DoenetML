import React from "react";
import PointControlsFamily from "./families/PointControlsFamily";
import CircleControlsFamily from "./families/CircleControlsFamily";
import PolygonControlsFamily from "./families/PolygonControlsFamily";
import TriangleControlsFamily from "./families/TriangleControlsFamily";
import RegularPolygonControlsFamily from "./families/RegularPolygonControlsFamily";
import RectangleControlsFamily from "./families/RectangleControlsFamily";
import LineSegmentControlsFamily from "./families/LineSegmentControlsFamily";
import VectorControlsFamily from "./families/VectorControlsFamily";
import type {
    GraphControlCircle,
    GraphControlLineSegment,
    GraphControlPoint,
    GraphControlPolygon,
    GraphControlRectangle,
    GraphControlRegularPolygon,
    GraphControlTriangle,
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
        draggablePolygonsForControls: GraphControlPolygon[];
        draggableTrianglesForControls: GraphControlTriangle[];
        draggableRegularPolygonsForControls: GraphControlRegularPolygon[];
        draggableRectanglesForControls: GraphControlRectangle[];
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
            <PolygonControlsFamily {...props} />
            <TriangleControlsFamily {...props} />
            <RegularPolygonControlsFamily {...props} />
            <RectangleControlsFamily {...props} />
            <LineSegmentControlsFamily {...props} />
            <VectorControlsFamily {...props} />
        </div>
    );
});
