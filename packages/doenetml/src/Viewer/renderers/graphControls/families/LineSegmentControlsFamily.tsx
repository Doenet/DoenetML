import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlItem,
    GraphControlLineSegment,
    LineSegmentControlsMode,
    PointMoveRole,
    normalizeGraphControlsMode,
    normalizeLineSegmentControlsMode,
    selectGraphControlsByType,
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
        graphicalDescendantsForControls: GraphControlItem[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

type LineSegmentSectionConfig = {
    controlIdSuffix: "endpoint1" | "endpoint2";
    pointRole: "endpoint1" | "endpoint2";
    sectionHeading: "Endpoint 1" | "Endpoint 2";
    sectionHeadingHasDivider: boolean;
    labelForAriaPrefix: "endpoint 1" | "endpoint 2";
    pairAriaLabelPrefix:
        | "coordinates for endpoint 1"
        | "coordinates for endpoint 2";
    xSliderAriaLabelPrefix:
        | "endpoint 1 x coordinate"
        | "endpoint 2 x coordinate";
    ySliderAriaLabelPrefix:
        | "endpoint 1 y coordinate"
        | "endpoint 2 y coordinate";
    xInputAriaLabelPrefix: "endpoint 1 x input" | "endpoint 2 x input";
    yInputAriaLabelPrefix: "endpoint 1 y input" | "endpoint 2 y input";
};

function getLineSegmentSections(
    mode: LineSegmentControlsMode,
): LineSegmentSectionConfig[] {
    if (mode !== "endpoints") {
        return [];
    }

    return [
        {
            controlIdSuffix: "endpoint1",
            pointRole: "endpoint1",
            sectionHeading: "Endpoint 1",
            sectionHeadingHasDivider: false,
            labelForAriaPrefix: "endpoint 1",
            pairAriaLabelPrefix: "coordinates for endpoint 1",
            xSliderAriaLabelPrefix: "endpoint 1 x coordinate",
            ySliderAriaLabelPrefix: "endpoint 1 y coordinate",
            xInputAriaLabelPrefix: "endpoint 1 x input",
            yInputAriaLabelPrefix: "endpoint 1 y input",
        },
        {
            controlIdSuffix: "endpoint2",
            pointRole: "endpoint2",
            sectionHeading: "Endpoint 2",
            sectionHeadingHasDivider: true,
            labelForAriaPrefix: "endpoint 2",
            pairAriaLabelPrefix: "coordinates for endpoint 2",
            xSliderAriaLabelPrefix: "endpoint 2 x coordinate",
            ySliderAriaLabelPrefix: "endpoint 2 y coordinate",
            xInputAriaLabelPrefix: "endpoint 2 x input",
            yInputAriaLabelPrefix: "endpoint 2 y input",
        },
    ];
}

function getLineSegmentCoordinatesByRole(
    lineSegment: GraphControlLineSegment,
    pointRole: LineSegmentSectionConfig["pointRole"],
) {
    if (pointRole === "endpoint1") {
        return lineSegment.endpoint1;
    }
    return lineSegment.endpoint2;
}

export default React.memo(function LineSegmentControlsFamily({
    id,
    SVs,
    callAction,
}: LineSegmentControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const lineSegments = selectGraphControlsByType(
        SVs.graphicalDescendantsForControls,
        "lineSegment",
    );
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
            const sections = getLineSegmentSections(mode);
            if (sections.length === 0) {
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
                    {sections.map((section) => {
                        const coordinates = getLineSegmentCoordinatesByRole(
                            lineSegment,
                            section.pointRole,
                        );

                        return (
                            <PointControlCoordinator
                                key={`${lineSegment.componentIdx}-${section.controlIdSuffix}`}
                                id={id}
                                controlId={`lineSegment-${lineSegment.componentIdx}-${section.controlIdSuffix}`}
                                componentIdx={lineSegment.componentIdx}
                                pointRole={section.pointRole}
                                sectionHeading={section.sectionHeading}
                                sectionHeadingHasDivider={
                                    section.sectionHeadingHasDivider
                                }
                                labelForAria={`${section.labelForAriaPrefix} for ${labelForAria}`}
                                pairAriaLabel={`${section.pairAriaLabelPrefix} for ${labelForAria}`}
                                xSliderAriaLabel={`${section.xSliderAriaLabelPrefix} for ${labelForAria}`}
                                ySliderAriaLabel={`${section.ySliderAriaLabelPrefix} for ${labelForAria}`}
                                xInputAriaLabel={`${section.xInputAriaLabelPrefix} for ${labelForAria}`}
                                yInputAriaLabel={`${section.yInputAriaLabelPrefix} for ${labelForAria}`}
                                graphControlsMode={graphControlsMode}
                                pointControlsMode="both"
                                x={coordinates.x}
                                y={coordinates.y}
                                xMin={SVs.xMin}
                                xMax={SVs.xMax}
                                yMin={SVs.yMin}
                                yMax={SVs.yMax}
                                formatCoordinate={(value) =>
                                    formatCoordinateForControls(
                                        value,
                                        lineSegment,
                                    )
                                }
                                onMovePointLike={movePointLike}
                            />
                        );
                    })}
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
