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
    type GraphControlItem,
    type GraphControlsFamilyProps,
    sortGraphControlsForDisplay,
} from "./model";

export default React.memo(function GraphControlsRoot(
    props: GraphControlsFamilyProps,
) {
    const { id, SVs } = props;

    const orderedControls = sortGraphControlsForDisplay(
        SVs.graphicalDescendantsForControls,
    );

    function renderControl(control: GraphControlItem, controlIndex: number) {
        const controlFamilyProps: GraphControlsFamilyProps = {
            ...props,
            id: `${id}_control_${controlIndex}`,
            SVs: {
                ...SVs,
                graphicalDescendantsForControls: [control],
            },
        };

        const key = `${control.controlType}_${control.componentIdx}_${controlIndex}`;

        if (control.controlType === "point") {
            return <PointControlsFamily key={key} {...controlFamilyProps} />;
        }
        if (control.controlType === "circle") {
            return <CircleControlsFamily key={key} {...controlFamilyProps} />;
        }
        if (control.controlType === "polygon") {
            return <PolygonControlsFamily key={key} {...controlFamilyProps} />;
        }
        if (control.controlType === "triangle") {
            return <TriangleControlsFamily key={key} {...controlFamilyProps} />;
        }
        if (control.controlType === "regularPolygon") {
            return (
                <RegularPolygonControlsFamily
                    key={key}
                    {...controlFamilyProps}
                />
            );
        }
        if (control.controlType === "rectangle") {
            return (
                <RectangleControlsFamily key={key} {...controlFamilyProps} />
            );
        }
        if (control.controlType === "lineSegment") {
            return (
                <LineSegmentControlsFamily key={key} {...controlFamilyProps} />
            );
        }

        return <VectorControlsFamily key={key} {...controlFamilyProps} />;
    }

    return (
        <div id={id}>
            {orderedControls.map((control, controlIndex) =>
                renderControl(control, controlIndex),
            )}
        </div>
    );
});
