import React, { useMemo } from "react";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import GraphControl from "./components/graphControls/GraphControl";
import NumberControl from "./components/graphControls/NumberControl";
import PointControl from "./components/graphControls/PointControl";
import {
    makeInputErrorId,
    normalizeCircleControlsMode,
    normalizeGraphControlsMode,
    normalizedSliderBounds,
    type GraphControlCircle,
} from "./utils/graphControls";
import {
    formatCoordinateForControls,
    parseOrderedPair,
    parseSingleMathNumber,
} from "./utils/graphControlsMath";
import { useGraphControlsInputState } from "./hooks/useGraphControlsInputState";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "./utils/labelWithLatex";
import { useLatestControlValues } from "./hooks/useLatestControlValues";

type CircleControlState = {
    center: { x: number; y: number };
    radius: number;
};

type CircleGraphControlsProps = {
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

export default React.memo(function CircleGraphControls({
    id,
    SVs,
    callAction,
}: CircleGraphControlsProps) {
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
    } = useGraphControlsInputState();

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

    const { getLatestValue, setLatestValue } = useLatestControlValues(
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
                    center: [center.x, center.y],
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

    async function updateCenterAxis({
        circle,
        axis,
        value,
        transient,
    }: {
        circle: GraphControlCircle;
        axis: "x" | "y";
        value: number;
        transient: boolean;
    }) {
        const latest = getCircleState(circle);
        const center =
            axis === "x"
                ? { x: value, y: latest.center.y }
                : { x: latest.center.x, y: value };

        setCircleState(circle, {
            center,
            radius: latest.radius,
        });

        await updateCircle({
            circle,
            center,
            radius: latest.radius,
            transient,
        });
    }

    async function commitCenterAxisInput({
        circle,
        key,
        rawValue,
        axis,
    }: {
        circle: GraphControlCircle;
        key: string;
        rawValue: string;
        axis: "x" | "y";
    }) {
        const latest = getCircleState(circle);
        await commitNumberInput({
            key,
            rawValue,
            currentValue: axis === "x" ? latest.center.x : latest.center.y,
            onParsed: async (value) => {
                await updateCenterAxis({
                    circle,
                    axis,
                    value,
                    transient: false,
                });
            },
        });
    }

    async function commitCenterPairInput({
        circle,
        key,
        rawValue,
    }: {
        circle: GraphControlCircle;
        key: string;
        rawValue: string;
    }) {
        const latest = getCircleState(circle);
        await commitParsedInput({
            key,
            rawValue,
            parse: parseOrderedPair,
            errorMessage:
                "Enter an ordered pair like (x,y) with numeric values.",
            isUnchanged: (value) =>
                value.x === latest.center.x && value.y === latest.center.y,
            onParsed: async (value) => {
                setCircleState(circle, {
                    center: value,
                    radius: latest.radius,
                });
                await updateCircle({
                    circle,
                    center: value,
                    radius: latest.radius,
                    transient: false,
                });
            },
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
            center: latest.center,
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

    const { min: xMin, max: xMax } = normalizedSliderBounds(SVs.xMin, SVs.xMax);
    const { min: yMin, max: yMax } = normalizedSliderBounds(SVs.yMin, SVs.yMax);
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

            const xKey = `${circle.componentIdx}|cx`;
            const yKey = `${circle.componentIdx}|cy`;
            const centerPairKey = `${circle.componentIdx}|cpair`;
            const rKey = `${circle.componentIdx}|r`;

            const currentCircleState = getCircleState(circle);

            const xDisplay = formatCoordinateForControls(
                currentCircleState.center.x,
                circle,
            );
            const yDisplay = formatCoordinateForControls(
                currentCircleState.center.y,
                circle,
            );
            const rDisplay = formatCoordinateForControls(currentCircleState.radius, circle);

            const radiusMax = Math.max(defaultRadiusMax, currentCircleState.radius);
            const radiusStep = radiusMax > 0 ? radiusMax / 100 : 1;

            const headingId = `${id}-circle-${circle.componentIdx}-heading`;

            return (
                <GraphControl
                    key={circle.componentIdx}
                    id={`${id}-circle-${circle.componentIdx}`}
                    headingId={headingId}
                    heading={labelForDisplay}
                >
                    {showCenter ? (
                        <PointControl
                            id={id}
                            controlId={`circle-${circle.componentIdx}-center`}
                            sectionHeading="Center"
                            sectionHeadingHasDivider={false}
                            labelForAria={`center of ${labelForAria}`}
                            graphControlsMode={graphControlsMode}
                            controlsMode="both"
                            pairInput={{
                                value: draftByKey[centerPairKey] ?? `(${xDisplay},${yDisplay})`,
                                ariaLabel: `center coordinates for ${labelForAria}`,
                                error: errorByKey[centerPairKey],
                                errorId: makeInputErrorId(id, "circle", centerPairKey),
                                onDraftChange: (value) => setDraft(centerPairKey, value),
                                onCommit: async (rawValue) => {
                                    await commitCenterPairInput({
                                        circle,
                                        key: centerPairKey,
                                        rawValue,
                                    });
                                },
                                hasDraft: hasDraft(centerPairKey),
                                isCommitting: isCommitting(centerPairKey),
                                commitErrorContext: `[graph-controls] failed to commit ${centerPairKey} input`,
                            }}
                            axisControls={{
                                x: {
                                    label: "x",
                                    sliderAriaLabel: `center x coordinate for ${labelForAria}`,
                                    displayValue: xDisplay,
                                    min: xMin,
                                    max: xMax,
                                    step: xMax !== xMin ? (xMax - xMin) / 100 : 1,
                                    value: currentCircleState.center.x,
                                    onSliderChange: (value, transient) => {
                                        updateCenterAxis({
                                            circle,
                                            axis: "x",
                                            value,
                                            transient,
                                        }).catch(() => {});
                                    },
                                    input: {
                                        value: draftByKey[xKey] ?? xDisplay,
                                        ariaLabel: `center x input for ${labelForAria}`,
                                        error: errorByKey[xKey],
                                        errorId: makeInputErrorId(id, "circle", xKey),
                                        onDraftChange: (value) => setDraft(xKey, value),
                                        onCommit: async (rawValue) => {
                                            await commitCenterAxisInput({
                                                circle,
                                                key: xKey,
                                                rawValue,
                                                axis: "x",
                                            });
                                        },
                                        hasDraft: hasDraft(xKey),
                                        isCommitting: isCommitting(xKey),
                                        commitErrorContext: `[graph-controls] failed to commit ${xKey} input`,
                                    },
                                },
                                y: {
                                    label: "y",
                                    sliderAriaLabel: `center y coordinate for ${labelForAria}`,
                                    displayValue: yDisplay,
                                    min: yMin,
                                    max: yMax,
                                    step: yMax !== yMin ? (yMax - yMin) / 100 : 1,
                                    value: currentCircleState.center.y,
                                    onSliderChange: (value, transient) => {
                                        updateCenterAxis({
                                            circle,
                                            axis: "y",
                                            value,
                                            transient,
                                        }).catch(() => {});
                                    },
                                    input: {
                                        value: draftByKey[yKey] ?? yDisplay,
                                        ariaLabel: `center y input for ${labelForAria}`,
                                        error: errorByKey[yKey],
                                        errorId: makeInputErrorId(id, "circle", yKey),
                                        onDraftChange: (value) => setDraft(yKey, value),
                                        onCommit: async (rawValue) => {
                                            await commitCenterAxisInput({
                                                circle,
                                                key: yKey,
                                                rawValue,
                                                axis: "y",
                                            });
                                        },
                                        hasDraft: hasDraft(yKey),
                                        isCommitting: isCommitting(yKey),
                                        commitErrorContext: `[graph-controls] failed to commit ${yKey} input`,
                                    },
                                },
                            }}
                        />
                    ) : null}

                    {showRadius ? (
                        <NumberControl
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
                </GraphControl>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <GraphControlsPanel id={`${id}-circles`} ariaLabel="Circle controls">
            {cards}
        </GraphControlsPanel>
    );
});
