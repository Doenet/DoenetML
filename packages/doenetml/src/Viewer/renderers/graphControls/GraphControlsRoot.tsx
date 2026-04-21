import React from "react";
import PointControlsFamily from "./families/PointControlsFamily";
import CircleControlsFamily from "./families/CircleControlsFamily";
import PolygonControlsFamily from "./families/PolygonControlsFamily";
import TriangleControlsFamily from "./families/TriangleControlsFamily";
import RegularPolygonControlsFamily from "./families/RegularPolygonControlsFamily";
import RectangleControlsFamily from "./families/RectangleControlsFamily";
import LineSegmentControlsFamily from "./families/LineSegmentControlsFamily";
import VectorControlsFamily from "./families/VectorControlsFamily";
import {
    assertKnownGraphControlType,
    type GraphControlItem,
    type GraphControlsFamilyProps,
    sortGraphControlsForDisplay,
} from "./model";

const CONTROLS_FAMILY_BY_TYPE: Record<
    GraphControlItem["controlType"],
    React.ComponentType<GraphControlsFamilyProps>
> = {
    point: PointControlsFamily,
    circle: CircleControlsFamily,
    polygon: PolygonControlsFamily,
    triangle: TriangleControlsFamily,
    regularPolygon: RegularPolygonControlsFamily,
    rectangle: RectangleControlsFamily,
    lineSegment: LineSegmentControlsFamily,
    vector: VectorControlsFamily,
};

export default React.memo(function GraphControlsRoot(
    props: GraphControlsFamilyProps,
) {
    const { id, SVs } = props;

    const orderedControls = sortGraphControlsForDisplay(
        SVs.graphicalDescendantsForControls,
    );

    function renderControl(control: GraphControlItem, controlIndex: number) {
        const controlType = assertKnownGraphControlType(control.controlType);
        const FamilyComponent = CONTROLS_FAMILY_BY_TYPE[controlType];
        const controlInstanceId = `${controlType}_${control.componentIdx}`;

        // Render exactly one control payload per family invocation so family
        // components can preserve their internal card/control markup behavior.
        const controlFamilyProps: GraphControlsFamilyProps = {
            ...props,
            // Keep ids stable so DOM references and focus state don't churn when
            // dynamic controlOrder changes reorder controls.
            id: `${id}_control_${controlInstanceId}`,
            SVs: {
                ...SVs,
                graphicalDescendantsForControls: [control],
            },
        };

        return (
            <FamilyComponent key={controlInstanceId} {...controlFamilyProps} />
        );
    }

    return (
        <div id={id}>
            {orderedControls.map((control, controlIndex) =>
                renderControl(control, controlIndex),
            )}
        </div>
    );
});
