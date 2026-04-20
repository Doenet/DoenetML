import React from "react";
import PointControlsFamily from "./families/PointControlsFamily";
import CircleControlsFamily from "./families/CircleControlsFamily";
import PolygonControlsFamily from "./families/PolygonControlsFamily";
import TriangleControlsFamily from "./families/TriangleControlsFamily";
import RegularPolygonControlsFamily from "./families/RegularPolygonControlsFamily";
import RectangleControlsFamily from "./families/RectangleControlsFamily";
import LineSegmentControlsFamily from "./families/LineSegmentControlsFamily";
import VectorControlsFamily from "./families/VectorControlsFamily";
import type { GraphControlsFamilyProps } from "./model";

export default React.memo(function GraphControlsRoot(
    props: GraphControlsFamilyProps,
) {
    const { id } = props;

    return (
        <div id={id}>
            {/*
             * Temporary renderer ordering: controls are still grouped by family
             * until a follow-up PR switches to a single interleaved dispatch.
             * Each family preserves document order within its own control type.
             */}
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
