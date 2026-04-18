import React from "react";
import ControlsStack from "../primitives/ControlsStack";
import ControlCard from "../primitives/ControlCard";
import ScalarControlCoordinator from "../primitives/ScalarControlCoordinator";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    PointMoveRole,
    normalizeCircleControlsMode,
    normalizeGraphControlsMode,
    type GraphControlCircle,
} from "../model";
import {
    formatCoordinateForControls,
    parseSingleMathNumber,
} from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

type CircleControlsFamilyProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggableCirclesForControls: GraphControlCircle[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

export default React.memo(function CircleControlsFamily({
    id,
    SVs,
    callAction,
}: CircleControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const circles = Array.isArray(SVs.draggableCirclesForControls)
        ? SVs.draggableCirclesForControls
        : [];
    if (circles.length === 0) {
        return null;
    }

    async function moveCircle({
        componentIdx,
        pointRole,
        x,
        y,
        transient,
    }: {
        componentIdx: number;
        pointRole: PointMoveRole;
        x: number;
        y: number;
        transient: boolean;
        skippable: boolean;
    }) {
        const circle = circles.find(
            (candidate) => candidate.componentIdx === componentIdx,
        );
        if (!circle || pointRole !== "center") {
            return;
        }

        try {
            await callAction({
                action: {
                    actionName: "moveCircle",
                    componentIdx: circle.componentIdx,
                },
                args: {
                    x,
                    y,
                    pointRole: "center",
                    radius: circle.radius,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveCircle failed for component ${circle.componentIdx}`,
                error,
            );
        }
    }

    async function changeCircleRadius({
        componentIdx,
        scalarRole,
        value,
        transient,
    }: {
        componentIdx: number;
        scalarRole: string;
        value: number;
        transient: boolean;
        skippable: boolean;
    }) {
        if (scalarRole !== "radius") {
            return;
        }

        const circle = circles.find(
            (candidate) => candidate.componentIdx === componentIdx,
        );

        if (!circle) {
            return;
        }

        const radius = Math.max(0, value);

        try {
            await callAction({
                action: {
                    actionName: "changeRadius",
                    componentIdx: circle.componentIdx,
                },
                args: {
                    radius,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] changeRadius failed for component ${circle.componentIdx}`,
                error,
            );
        }
    }

    const defaultRadiusMax = Math.max(
        1,
        Math.abs(SVs.xMax - SVs.xMin),
        Math.abs(SVs.yMax - SVs.yMin),
    );

    const cards = circles
        .map((circle) => {
            const mode = normalizeCircleControlsMode(circle.addControls);
            if (mode === "none") {
                return null;
            }

            const fallbackLabel = `Circle ${circle.circleNumber}`;
            const labelForAria = accessibleLabelText({
                label: circle.label,
                labelHasLatex: circle.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = circle.label.trim()
                ? renderLabelWithLatex({
                      label: circle.label,
                      labelHasLatex: circle.labelHasLatex,
                  })
                : fallbackLabel;

            const showCenter = mode === "center" || mode === "centerandradius";
            const showRadius = mode === "radius" || mode === "centerandradius";

            const radiusMax = Math.max(defaultRadiusMax, circle.radius);
            const radiusStep = radiusMax > 0 ? radiusMax / 100 : 1;

            const headingId = `${id}-circle-${circle.componentIdx}-heading`;

            return (
                <ControlCard
                    key={circle.componentIdx}
                    id={`${id}-circle-${circle.componentIdx}`}
                    headingId={headingId}
                    heading={labelForDisplay}
                >
                    {showCenter ? (
                        <PointControlCoordinator
                            id={id}
                            controlId={`circle-${circle.componentIdx}-center`}
                            componentIdx={circle.componentIdx}
                            pointRole="center"
                            sectionHeading="Center"
                            sectionHeadingHasDivider={false}
                            labelForAria={`center of ${labelForAria}`}
                            pairAriaLabel={`center coordinates for ${labelForAria}`}
                            xSliderAriaLabel={`center x coordinate for ${labelForAria}`}
                            ySliderAriaLabel={`center y coordinate for ${labelForAria}`}
                            xInputAriaLabel={`center x input for ${labelForAria}`}
                            yInputAriaLabel={`center y input for ${labelForAria}`}
                            graphControlsMode={graphControlsMode}
                            pointControlsMode="both"
                            x={circle.center.x}
                            y={circle.center.y}
                            xMin={SVs.xMin}
                            xMax={SVs.xMax}
                            yMin={SVs.yMin}
                            yMax={SVs.yMax}
                            formatCoordinate={(value) =>
                                formatCoordinateForControls(value, circle)
                            }
                            onMovePointLike={moveCircle}
                        />
                    ) : null}

                    {showRadius ? (
                        <ScalarControlCoordinator
                            id={id}
                            controlId={`circle-${circle.componentIdx}-radius`}
                            componentIdx={circle.componentIdx}
                            scalarRole="radius"
                            sectionHeading="Radius"
                            sectionHeadingHasDivider={showCenter}
                            label="radius"
                            graphControlsMode={graphControlsMode}
                            value={circle.radius}
                            min={0}
                            max={radiusMax}
                            step={radiusStep}
                            formatValue={(value) =>
                                formatCoordinateForControls(value, circle)
                            }
                            parseValue={parseSingleMathNumber}
                            controlFamily="circle"
                            sliderAriaLabel={`radius for ${labelForAria}`}
                            inputAriaLabel={`radius input for ${labelForAria}`}
                            commitErrorContext={`[graph-controls] failed to commit circle ${circle.componentIdx} radius input`}
                            onUpdateScalar={changeCircleRadius}
                        />
                    ) : null}
                </ControlCard>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <ControlsStack id={`${id}-circles`} ariaLabel="Circle controls">
            {cards}
        </ControlsStack>
    );
});
