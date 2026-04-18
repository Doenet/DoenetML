import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlVector,
    PointMoveRole,
    normalizeGraphControlsMode,
    normalizeVectorControlsMode,
} from "../model";
import { formatCoordinateForControls } from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

type VectorControlsFamilyProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggableVectorsForControls: GraphControlVector[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

export default React.memo(function VectorControlsFamily({
    id,
    SVs,
    callAction,
}: VectorControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const vectors = Array.isArray(SVs.draggableVectorsForControls)
        ? SVs.draggableVectorsForControls
        : [];
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

            if (mode === "displacement") {
                return (
                    <ControlCard
                        key={`${componentIdx}-displacement`}
                        id={`${id}-vector-${componentIdx}`}
                        headingId={`${id}-vector-${componentIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        <PointControlCoordinator
                            id={id}
                            controlId={`vector-${componentIdx}-displacement`}
                            componentIdx={componentIdx}
                            pointRole="displacement"
                            labelForAria={`displacement for ${labelForAria}`}
                            xAxisLabel="Δx"
                            yAxisLabel="Δy"
                            pairAriaLabel={`coordinates for displacement for ${labelForAria}`}
                            xSliderAriaLabel={`displacement x for ${labelForAria}`}
                            ySliderAriaLabel={`displacement y for ${labelForAria}`}
                            xInputAriaLabel={`displacement x for ${labelForAria} input`}
                            yInputAriaLabel={`displacement y for ${labelForAria} input`}
                            graphControlsMode={graphControlsMode}
                            pointControlsMode="both"
                            x={vector.displacement.x}
                            y={vector.displacement.y}
                            xMin={SVs.xMin}
                            xMax={SVs.xMax}
                            yMin={SVs.yMin}
                            yMax={SVs.yMax}
                            formatCoordinate={(value) =>
                                formatValue(value, vector)
                            }
                            onMovePointLike={movePointLike}
                        />
                    </ControlCard>
                );
            }

            if (mode === "headonly") {
                return (
                    <ControlCard
                        key={`${componentIdx}-head`}
                        id={`${id}-vector-${componentIdx}`}
                        headingId={`${id}-vector-${componentIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        <PointControlCoordinator
                            id={id}
                            controlId={`vector-${componentIdx}-head`}
                            componentIdx={componentIdx}
                            pointRole="head"
                            labelForAria={`head for ${labelForAria}`}
                            xAxisLabel="head x"
                            yAxisLabel="head y"
                            pairAriaLabel={`coordinates for head for ${labelForAria}`}
                            xSliderAriaLabel={`head x for ${labelForAria}`}
                            ySliderAriaLabel={`head y for ${labelForAria}`}
                            xInputAriaLabel={`head x for ${labelForAria} input`}
                            yInputAriaLabel={`head y for ${labelForAria} input`}
                            graphControlsMode={graphControlsMode}
                            pointControlsMode="both"
                            x={vector.head.x}
                            y={vector.head.y}
                            xMin={SVs.xMin}
                            xMax={SVs.xMax}
                            yMin={SVs.yMin}
                            yMax={SVs.yMax}
                            formatCoordinate={(value) =>
                                formatValue(value, vector)
                            }
                            onMovePointLike={movePointLike}
                        />
                    </ControlCard>
                );
            }

            if (mode === "tailonly") {
                return (
                    <ControlCard
                        key={`${componentIdx}-tail`}
                        id={`${id}-vector-${componentIdx}`}
                        headingId={`${id}-vector-${componentIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        <PointControlCoordinator
                            id={id}
                            controlId={`vector-${componentIdx}-tail`}
                            componentIdx={componentIdx}
                            pointRole="tail"
                            labelForAria={`tail for ${labelForAria}`}
                            xAxisLabel="tail x"
                            yAxisLabel="tail y"
                            pairAriaLabel={`coordinates for tail for ${labelForAria}`}
                            xSliderAriaLabel={`tail x for ${labelForAria}`}
                            ySliderAriaLabel={`tail y for ${labelForAria}`}
                            xInputAriaLabel={`tail x for ${labelForAria} input`}
                            yInputAriaLabel={`tail y for ${labelForAria} input`}
                            graphControlsMode={graphControlsMode}
                            pointControlsMode="both"
                            x={vector.tail.x}
                            y={vector.tail.y}
                            xMin={SVs.xMin}
                            xMax={SVs.xMax}
                            yMin={SVs.yMin}
                            yMax={SVs.yMax}
                            formatCoordinate={(value) =>
                                formatValue(value, vector)
                            }
                            onMovePointLike={movePointLike}
                        />
                    </ControlCard>
                );
            }

            if (mode === "headandtail") {
                return (
                    <ControlCard
                        key={`${componentIdx}-headandtail`}
                        id={`${id}-vector-${componentIdx}`}
                        headingId={`${id}-vector-${componentIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        <PointControlCoordinator
                            id={id}
                            controlId={`vector-${componentIdx}-head`}
                            componentIdx={componentIdx}
                            pointRole="head"
                            sectionHeading="Head"
                            sectionHeadingHasDivider={false}
                            labelForAria={`head for ${labelForAria}`}
                            xAxisLabel="head x"
                            yAxisLabel="head y"
                            pairAriaLabel={`coordinates for head for ${labelForAria}`}
                            xSliderAriaLabel={`head x for ${labelForAria}`}
                            ySliderAriaLabel={`head y for ${labelForAria}`}
                            xInputAriaLabel={`head x for ${labelForAria} input`}
                            yInputAriaLabel={`head y for ${labelForAria} input`}
                            graphControlsMode={graphControlsMode}
                            pointControlsMode="both"
                            x={vector.head.x}
                            y={vector.head.y}
                            xMin={SVs.xMin}
                            xMax={SVs.xMax}
                            yMin={SVs.yMin}
                            yMax={SVs.yMax}
                            formatCoordinate={(value) =>
                                formatValue(value, vector)
                            }
                            onMovePointLike={movePointLike}
                        />
                        <PointControlCoordinator
                            id={id}
                            controlId={`vector-${componentIdx}-tail`}
                            componentIdx={componentIdx}
                            pointRole="tail"
                            sectionHeading="Tail"
                            sectionHeadingHasDivider={true}
                            labelForAria={`tail for ${labelForAria}`}
                            xAxisLabel="tail x"
                            yAxisLabel="tail y"
                            pairAriaLabel={`coordinates for tail for ${labelForAria}`}
                            xSliderAriaLabel={`tail x for ${labelForAria}`}
                            ySliderAriaLabel={`tail y for ${labelForAria}`}
                            xInputAriaLabel={`tail x for ${labelForAria} input`}
                            yInputAriaLabel={`tail y for ${labelForAria} input`}
                            graphControlsMode={graphControlsMode}
                            pointControlsMode="both"
                            x={vector.tail.x}
                            y={vector.tail.y}
                            xMin={SVs.xMin}
                            xMax={SVs.xMax}
                            yMin={SVs.yMin}
                            yMax={SVs.yMax}
                            formatCoordinate={(value) =>
                                formatValue(value, vector)
                            }
                            onMovePointLike={movePointLike}
                        />
                    </ControlCard>
                );
            }

            return null;
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
