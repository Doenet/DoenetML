import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlsFamilyProps,
    GraphControlVector,
    PointMoveRole,
    normalizeGraphControlsMode,
    selectGraphControlsByType,
    normalizeVectorControlsMode,
} from "../model";
import type { VectorControlsMode } from "../model";
import { formatCoordinateForControls } from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

type VectorSectionConfig = {
    controlIdSuffix: string;
    pointRole: PointMoveRole;
    labelForAriaPrefix: string;
    xAxisLabel: string;
    yAxisLabel: string;
    pairAriaLabelPrefix: string;
    xSliderAriaLabelPrefix: string;
    ySliderAriaLabelPrefix: string;
    xInputAriaLabelPrefix: string;
    yInputAriaLabelPrefix: string;
    sectionHeading?: string;
    sectionHeadingHasDivider?: boolean;
};

function getVectorSections(mode: VectorControlsMode): VectorSectionConfig[] {
    if (mode === "displacement") {
        return [
            {
                controlIdSuffix: "displacement",
                pointRole: "displacement",
                labelForAriaPrefix: "displacement",
                xAxisLabel: "Δx",
                yAxisLabel: "Δy",
                pairAriaLabelPrefix: "coordinates for displacement",
                xSliderAriaLabelPrefix: "displacement x",
                ySliderAriaLabelPrefix: "displacement y",
                xInputAriaLabelPrefix: "displacement x",
                yInputAriaLabelPrefix: "displacement y",
            },
        ];
    }

    if (mode === "headonly") {
        return [
            {
                controlIdSuffix: "head",
                pointRole: "head",
                labelForAriaPrefix: "head",
                xAxisLabel: "head x",
                yAxisLabel: "head y",
                pairAriaLabelPrefix: "coordinates for head",
                xSliderAriaLabelPrefix: "head x",
                ySliderAriaLabelPrefix: "head y",
                xInputAriaLabelPrefix: "head x",
                yInputAriaLabelPrefix: "head y",
            },
        ];
    }

    if (mode === "tailonly") {
        return [
            {
                controlIdSuffix: "tail",
                pointRole: "tail",
                labelForAriaPrefix: "tail",
                xAxisLabel: "tail x",
                yAxisLabel: "tail y",
                pairAriaLabelPrefix: "coordinates for tail",
                xSliderAriaLabelPrefix: "tail x",
                ySliderAriaLabelPrefix: "tail y",
                xInputAriaLabelPrefix: "tail x",
                yInputAriaLabelPrefix: "tail y",
            },
        ];
    }

    if (mode === "headandtail") {
        return [
            {
                controlIdSuffix: "head",
                pointRole: "head",
                labelForAriaPrefix: "head",
                xAxisLabel: "head x",
                yAxisLabel: "head y",
                pairAriaLabelPrefix: "coordinates for head",
                xSliderAriaLabelPrefix: "head x",
                ySliderAriaLabelPrefix: "head y",
                xInputAriaLabelPrefix: "head x",
                yInputAriaLabelPrefix: "head y",
                sectionHeading: "Head",
                sectionHeadingHasDivider: false,
            },
            {
                controlIdSuffix: "tail",
                pointRole: "tail",
                labelForAriaPrefix: "tail",
                xAxisLabel: "tail x",
                yAxisLabel: "tail y",
                pairAriaLabelPrefix: "coordinates for tail",
                xSliderAriaLabelPrefix: "tail x",
                ySliderAriaLabelPrefix: "tail y",
                xInputAriaLabelPrefix: "tail x",
                yInputAriaLabelPrefix: "tail y",
                sectionHeading: "Tail",
                sectionHeadingHasDivider: true,
            },
        ];
    }

    return [];
}

function getVectorCoordinatesByRole(
    vector: GraphControlVector,
    pointRole: PointMoveRole,
) {
    if (pointRole === "displacement") {
        return vector.displacement;
    }
    if (pointRole === "head") {
        return vector.head;
    }
    return vector.tail;
}

export default React.memo(function VectorControlsFamily({
    id,
    SVs,
    callAction,
}: GraphControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const vectors = selectGraphControlsByType(
        SVs.graphicalDescendantsForControls,
        "vector",
    );
    if (vectors.length === 0) {
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
                    actionName: "moveVectorSinglePoint",
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
                `[graph-controls] moveVectorSinglePoint failed for component ${componentIdx}`,
                error,
            );
        }
    }

    function formatValue(value: number, vector: GraphControlVector) {
        return formatCoordinateForControls(value, vector);
    }

    const cards = vectors
        .map((vector) => {
            const mode = normalizeVectorControlsMode(vector.addControls);
            if (mode === "none") {
                return null;
            }

            const fallbackLabel = `Vector ${vector.vectorNumber}`;
            const labelForAria = accessibleLabelText({
                label: vector.label,
                labelHasLatex: vector.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = vector.label.trim()
                ? renderLabelWithLatex({
                      label: vector.label,
                      labelHasLatex: vector.labelHasLatex,
                  })
                : fallbackLabel;

            const componentIdx = vector.componentIdx;
            const sections = getVectorSections(mode);
            if (sections.length === 0) {
                return null;
            }

            return (
                <ControlCard
                    key={`${componentIdx}-${mode}`}
                    id={`${id}-vector-${componentIdx}`}
                    headingId={`${id}-vector-${componentIdx}-heading`}
                    heading={labelForDisplay}
                >
                    {sections.map((section) => {
                        const coordinates = getVectorCoordinatesByRole(
                            vector,
                            section.pointRole,
                        );

                        return (
                            <PointControlCoordinator
                                key={`${componentIdx}-${section.controlIdSuffix}`}
                                id={id}
                                controlId={`vector-${componentIdx}-${section.controlIdSuffix}`}
                                componentIdx={componentIdx}
                                pointRole={section.pointRole}
                                sectionHeading={section.sectionHeading}
                                sectionHeadingHasDivider={
                                    section.sectionHeadingHasDivider
                                }
                                labelForAria={`${section.labelForAriaPrefix} for ${labelForAria}`}
                                xAxisLabel={section.xAxisLabel}
                                yAxisLabel={section.yAxisLabel}
                                pairAriaLabel={`${section.pairAriaLabelPrefix} for ${labelForAria}`}
                                xSliderAriaLabel={`${section.xSliderAriaLabelPrefix} for ${labelForAria}`}
                                ySliderAriaLabel={`${section.ySliderAriaLabelPrefix} for ${labelForAria}`}
                                xInputAriaLabel={`${section.xInputAriaLabelPrefix} for ${labelForAria} input`}
                                yInputAriaLabel={`${section.yInputAriaLabelPrefix} for ${labelForAria} input`}
                                graphControlsMode={graphControlsMode}
                                pointControlsMode="both"
                                x={coordinates.x}
                                y={coordinates.y}
                                xMin={SVs.xMin}
                                xMax={SVs.xMax}
                                yMin={SVs.yMin}
                                yMax={SVs.yMax}
                                formatCoordinate={(value) =>
                                    formatValue(value, vector)
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
        <ControlsStack id={`${id}-vectors`} ariaLabel="Vector controls">
            {cards}
        </ControlsStack>
    );
});
