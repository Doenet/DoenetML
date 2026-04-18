import React, { useMemo } from "react";
import ControlsStack from "../primitives/ControlsStack";
import ControlCard from "../primitives/ControlCard";
import ScalarControl from "../primitives/ScalarControl";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    PointMoveRole,
    makeInputErrorId,
    normalizeCircleControlsMode,
    normalizeGraphControlsMode,
    type GraphControlCircle,
} from "../model";
import {
    formatCoordinateForControls,
    parseSingleMathNumber,
} from "../mathFormatParse";
import { useControlInputState } from "../hooks/useControlInputState";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";
import { useLatestValues } from "../hooks/useLatestValues";

type CircleControlState = {
    center: { x: number; y: number };
    radius: number;
};

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

    const {
        draftByKey,
        errorByKey,
        setDraft,
        hasDraft,
        isCommitting,
        commitParsedInput,
    } = useControlInputState();

    const latestCircleValuesByKey = useMemo(() => {
        const valuesByKey: Record<
            string,
            { center: { x: number; y: number }; radius: number }
        > = {};
        for (const circle of circles) {
            valuesByKey[String(circle.componentIdx)] = {
                center: { x: circle.center.x, y: circle.center.y },
                radius: circle.radius,
            };
        }
        return valuesByKey;
    }, [circles]);

    const { getLatestValue, setLatestValue } = useLatestValues(
        latestCircleValuesByKey,
    );

    function circleStateKey(circle: GraphControlCircle) {
        return String(circle.componentIdx);
    }

    function circleStateFromCore(
        circle: GraphControlCircle,
    ): CircleControlState {
        return {
            center: { x: circle.center.x, y: circle.center.y },
            radius: circle.radius,
        };
    }

    function getCircleState(circle: GraphControlCircle): CircleControlState {
        return getLatestValue(
            circleStateKey(circle),
            circleStateFromCore(circle),
        );
    }

    function setCircleState(
        circle: GraphControlCircle,
        state: CircleControlState,
    ) {
        setLatestValue(circleStateKey(circle), state);
    }

    async function updateCircle({
        circle,
        center,
        radius,
        transient,
    }: {
        circle: GraphControlCircle;
        center: { x: number; y: number };
        radius: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: {
                    actionName: "moveCircle",
                    componentIdx: circle.componentIdx,
                },
                args: {
                    x: center.x,
                    y: center.y,
                    pointRole: "center",
                    radius,
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

    async function moveCenterPointLike({
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
        const center = { x, y };
        const radius = getCircleState(circle).radius;

        await updateCircle({
            circle,
            center,
            radius,
            transient,
        });
    }

    async function changeCircleRadius({
        circle,
        radius,
        transient,
    }: {
        circle: GraphControlCircle;
        radius: number;
        transient: boolean;
    }) {
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

    async function commitNumberInput({
        key,
        rawValue,
        currentValue,
        onParsed,
    }: {
        key: string;
        rawValue: string;
        currentValue: number;
        onParsed: (value: number) => Promise<void>;
    }) {
        await commitParsedInput({
            key,
            rawValue,
            parse: parseSingleMathNumber,
            errorMessage: "Enter a valid number or numeric expression.",
            isUnchanged: (value) => value === currentValue,
            onParsed,
        });
    }

    async function updateRadiusValue({
        circle,
        value,
        transient,
    }: {
        circle: GraphControlCircle;
        value: number;
        transient: boolean;
    }) {
        const latest = getCircleState(circle);
        const nextRadius = Math.max(0, value);

        setCircleState(circle, {
            // Keep center sourced from core so transient center drags can snap back correctly.
            center: { x: circle.center.x, y: circle.center.y },
            radius: nextRadius,
        });

        await changeCircleRadius({
            circle,
            radius: nextRadius,
            transient,
        });
    }

    async function commitRadiusInput({
        circle,
        key,
        rawValue,
    }: {
        circle: GraphControlCircle;
        key: string;
        rawValue: string;
    }) {
        const latest = getCircleState(circle);
        await commitNumberInput({
            key,
            rawValue,
            currentValue: latest.radius,
            onParsed: async (value) => {
                await updateRadiusValue({
                    circle,
                    value,
                    transient: false,
                });
            },
        });
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

            const rKey = `${circle.componentIdx}|r`;
            const currentCircleState = getCircleState(circle);
            const rDisplay = formatCoordinateForControls(
                currentCircleState.radius,
                circle,
            );

            const radiusMax = Math.max(
                defaultRadiusMax,
                currentCircleState.radius,
            );
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
                            onMovePointLike={moveCenterPointLike}
                        />
                    ) : null}

                    {showRadius ? (
                        <ScalarControl
                            sectionHeading="Radius"
                            sectionHeadingHasDivider={showCenter}
                            label="radius"
                            graphControlsMode={graphControlsMode}
                            input={{
                                value: draftByKey[rKey] ?? rDisplay,
                                ariaLabel: `radius input for ${labelForAria}`,
                                error: errorByKey[rKey],
                                errorId: makeInputErrorId(id, "circle", rKey),
                                onDraftChange: (value) => setDraft(rKey, value),
                                onCommit: async (rawValue) => {
                                    await commitRadiusInput({
                                        circle,
                                        key: rKey,
                                        rawValue,
                                    });
                                },
                                hasDraft: hasDraft(rKey),
                                isCommitting: isCommitting(rKey),
                                commitErrorContext: `[graph-controls] failed to commit ${rKey} input`,
                            }}
                            slider={{
                                id: `${id}-circle-${rKey.replace(/\|/g, "-")}`,
                                ariaLabel: `radius for ${labelForAria}`,
                                min: 0,
                                max: radiusMax,
                                step: radiusStep,
                                value: currentCircleState.radius,
                                displayValue: rDisplay,
                                onSliderChange: (value, transient) => {
                                    updateRadiusValue({
                                        circle,
                                        value,
                                        transient,
                                    }).catch(() => {});
                                },
                            }}
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
