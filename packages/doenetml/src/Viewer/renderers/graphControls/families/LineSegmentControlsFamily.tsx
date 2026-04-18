import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlLineSegment,
    PointMoveRole,
    normalizeGraphControlsMode,
    normalizeLineSegmentControlsMode,
} from "../model";
import { formatCoordinateForControls } from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

type LineSegmentControlsFamilyProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggableLineSegmentsForControls: GraphControlLineSegment[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

export default React.memo(function LineSegmentControlsFamily({
    id,
    SVs,
    callAction,
}: LineSegmentControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const lineSegments = Array.isArray(SVs.draggableLineSegmentsForControls)
        ? SVs.draggableLineSegmentsForControls
        : [];
    if (lineSegments.length === 0) {
        return null;
    }

    async function movePointLike({
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
        try {
            await callAction({
                action: {
                    actionName: "moveLineSegmentSinglePoint",
                    componentIdx,
                },
                args: {
                    x,
                    y,
                    pointRole,
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveLineSegmentSinglePoint failed for component ${componentIdx}`,
                error,
            );
        }
    }

    const cards = lineSegments
        .map((lineSegment) => {
            const mode = normalizeLineSegmentControlsMode(
                lineSegment.addControls,
            );
            if (mode === "none") {
                return null;
            }

            const fallbackLabel = `Line segment ${lineSegment.lineSegmentNumber}`;
            const labelForAria = accessibleLabelText({
                label: lineSegment.label,
                labelHasLatex: lineSegment.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = lineSegment.label.trim()
                ? renderLabelWithLatex({
                      label: lineSegment.label,
                      labelHasLatex: lineSegment.labelHasLatex,
                  })
                : fallbackLabel;

            return (
                <ControlCard
                    key={lineSegment.componentIdx}
                    id={`${id}-lineSegment-${lineSegment.componentIdx}`}
                    headingId={`${id}-lineSegment-${lineSegment.componentIdx}-heading`}
                    heading={labelForDisplay}
                >
                    <PointControlCoordinator
                        id={id}
                        controlId={`lineSegment-${lineSegment.componentIdx}-endpoint1`}
                        componentIdx={lineSegment.componentIdx}
                        pointRole="endpoint1"
                        sectionHeading="Endpoint 1"
                        sectionHeadingHasDivider={false}
                        labelForAria={`endpoint 1 for ${labelForAria}`}
                        pairAriaLabel={`coordinates for endpoint 1 for ${labelForAria}`}
                        xSliderAriaLabel={`endpoint 1 x coordinate for ${labelForAria}`}
                        ySliderAriaLabel={`endpoint 1 y coordinate for ${labelForAria}`}
                        xInputAriaLabel={`endpoint 1 x input for ${labelForAria}`}
                        yInputAriaLabel={`endpoint 1 y input for ${labelForAria}`}
                        graphControlsMode={graphControlsMode}
                        pointControlsMode="both"
                        x={lineSegment.endpoint1.x}
                        y={lineSegment.endpoint1.y}
                        xMin={SVs.xMin}
                        xMax={SVs.xMax}
                        yMin={SVs.yMin}
                        yMax={SVs.yMax}
                        formatCoordinate={(value) =>
                            formatCoordinateForControls(value, lineSegment)
                        }
                        onMovePointLike={movePointLike}
                    />
                    <PointControlCoordinator
                        id={id}
                        controlId={`lineSegment-${lineSegment.componentIdx}-endpoint2`}
                        componentIdx={lineSegment.componentIdx}
                        pointRole="endpoint2"
                        sectionHeading="Endpoint 2"
                        sectionHeadingHasDivider={true}
                        labelForAria={`endpoint 2 for ${labelForAria}`}
                        pairAriaLabel={`coordinates for endpoint 2 for ${labelForAria}`}
                        xSliderAriaLabel={`endpoint 2 x coordinate for ${labelForAria}`}
                        ySliderAriaLabel={`endpoint 2 y coordinate for ${labelForAria}`}
                        xInputAriaLabel={`endpoint 2 x input for ${labelForAria}`}
                        yInputAriaLabel={`endpoint 2 y input for ${labelForAria}`}
                        graphControlsMode={graphControlsMode}
                        pointControlsMode="both"
                        x={lineSegment.endpoint2.x}
                        y={lineSegment.endpoint2.y}
                        xMin={SVs.xMin}
                        xMax={SVs.xMax}
                        yMin={SVs.yMin}
                        yMax={SVs.yMax}
                        formatCoordinate={(value) =>
                            formatCoordinateForControls(value, lineSegment)
                        }
                        onMovePointLike={movePointLike}
                    />
                </ControlCard>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <ControlsStack
            id={`${id}-lineSegments`}
            ariaLabel="Line segment controls"
        >
            {cards}
        </ControlsStack>
    );
});
