import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlsFamilyProps,
    PointMoveRole,
    normalizeGraphControlsMode,
    normalizePolygonControlsMode,
    selectGraphControlsByType,
} from "../model";
import { formatCoordinateForControls } from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

export default React.memo(function PolygonControlsFamily({
    id,
    SVs,
    callAction,
}: GraphControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const polygons = selectGraphControlsByType(
        SVs.graphicalDescendantsForControls,
        "polygon",
    );
    if (polygons.length === 0) {
        return null;
    }

    async function movePolygonCenter({
        componentIdx,
        pointRole,
        x,
        y,
        transient,
        skippable,
    }: {
        componentIdx: number;
        pointRole: PointMoveRole;
        x: number;
        y: number;
        transient: boolean;
        skippable: boolean;
    }) {
        if (pointRole !== "polygon") {
            return;
        }

        try {
            await callAction({
                action: {
                    actionName: "movePolygonCenter",
                    componentIdx,
                },
                args: {
                    center: [x, y],
                    pointRole: "polygon",
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] movePolygonCenter failed for component ${componentIdx}`,
                error,
            );
        }
    }

    const cards = polygons
        .map((polygon) => {
            const mode = normalizePolygonControlsMode(polygon.addControls);
            if (mode === "none") {
                return null;
            }

            const fallbackLabel = `Polygon ${polygon.polygonNumber}`;
            const labelForAria = accessibleLabelText({
                label: polygon.label,
                labelHasLatex: polygon.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = polygon.label.trim()
                ? renderLabelWithLatex({
                      label: polygon.label,
                      labelHasLatex: polygon.labelHasLatex,
                  })
                : fallbackLabel;

            return (
                <ControlCard
                    key={polygon.componentIdx}
                    id={`${id}-polygon-${polygon.componentIdx}`}
                    headingId={`${id}-polygon-${polygon.componentIdx}-heading`}
                    heading={labelForDisplay}
                >
                    <PointControlCoordinator
                        id={id}
                        controlId={`polygon-${polygon.componentIdx}-center`}
                        componentIdx={polygon.componentIdx}
                        pointRole="polygon"
                        sectionHeading="Center"
                        sectionHeadingHasDivider={false}
                        labelForAria={`center of ${labelForAria}`}
                        pairAriaLabel={`center coordinates for ${labelForAria}`}
                        xSliderAriaLabel={`x coordinate for center of ${labelForAria}`}
                        ySliderAriaLabel={`y coordinate for center of ${labelForAria}`}
                        xInputAriaLabel={`center x input for ${labelForAria}`}
                        yInputAriaLabel={`center y input for ${labelForAria}`}
                        graphControlsMode={graphControlsMode}
                        pointControlsMode="both"
                        x={polygon.center.x}
                        y={polygon.center.y}
                        xMin={SVs.xMin}
                        xMax={SVs.xMax}
                        yMin={SVs.yMin}
                        yMax={SVs.yMax}
                        formatCoordinate={(value) =>
                            formatCoordinateForControls(value, polygon)
                        }
                        onMovePointLike={movePolygonCenter}
                    />
                </ControlCard>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <ControlsStack id={`${id}-polygons`} ariaLabel="Polygon controls">
            {cards}
        </ControlsStack>
    );
});
