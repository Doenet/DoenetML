import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlsFamilyProps,
    PointMoveRole,
    normalizeGraphControlsMode,
    selectGraphControlsByType,
    normalizeTriangleControlsMode,
} from "../model";
import { formatCoordinateForControls } from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

export default React.memo(function TriangleControlsFamily({
    id,
    SVs,
    callAction,
}: GraphControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const triangles = selectGraphControlsByType(
        SVs.graphicalDescendantsForControls,
        "triangle",
    );
    if (triangles.length === 0) {
        return null;
    }

    async function moveTriangleCenter({
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
        if (pointRole !== "triangle") {
            return;
        }

        try {
            await callAction({
                action: {
                    actionName: "moveTriangleCenter",
                    componentIdx,
                },
                args: {
                    center: [x, y],
                    pointRole: "triangle",
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveTriangleCenter failed for component ${componentIdx}`,
                error,
            );
        }
    }

    const cards = triangles
        .map((triangle) => {
            const mode = normalizeTriangleControlsMode(triangle.addControls);
            if (mode === "none") {
                return null;
            }

            const fallbackLabel = `Triangle ${triangle.triangleNumber}`;
            const labelForAria = accessibleLabelText({
                label: triangle.label,
                labelHasLatex: triangle.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = triangle.label.trim()
                ? renderLabelWithLatex({
                      label: triangle.label,
                      labelHasLatex: triangle.labelHasLatex,
                  })
                : fallbackLabel;

            return (
                <ControlCard
                    key={triangle.componentIdx}
                    id={`${id}-triangle-${triangle.componentIdx}`}
                    headingId={`${id}-triangle-${triangle.componentIdx}-heading`}
                    heading={labelForDisplay}
                >
                    <PointControlCoordinator
                        id={id}
                        controlId={`triangle-${triangle.componentIdx}-center`}
                        componentIdx={triangle.componentIdx}
                        pointRole="triangle"
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
                        x={triangle.center.x}
                        y={triangle.center.y}
                        xMin={SVs.xMin}
                        xMax={SVs.xMax}
                        yMin={SVs.yMin}
                        yMax={SVs.yMax}
                        formatCoordinate={(value) =>
                            formatCoordinateForControls(value, triangle)
                        }
                        onMovePointLike={moveTriangleCenter}
                    />
                </ControlCard>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <ControlsStack id={`${id}-triangles`} ariaLabel="Triangle controls">
            {cards}
        </ControlsStack>
    );
});
