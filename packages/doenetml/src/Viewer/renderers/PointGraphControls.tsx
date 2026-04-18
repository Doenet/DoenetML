import React, { useEffect, useMemo, useState } from "react";
import GraphControl from "./components/graphControls/GraphControl";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import PointControl from "./components/graphControls/PointControl";
import { useGraphControlsInputState } from "./hooks/useGraphControlsInputState";
import { useLatestControlValues } from "./hooks/useLatestControlValues";
import {
    deriveActiveInputKeys,
    deriveActiveSliderAxisKeys,
    GraphControlPoint,
    makeErrorId,
    makeInputKey,
    normalizeGraphControlsMode,
    normalizePointControlsMode,
} from "./utils/graphControls";
import {
    formatCoordinateForControls,
    parseOrderedPair,
    parseSingleMathNumber,
} from "./utils/graphControlsMath";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "./utils/labelWithLatex";

type PointGraphControlsProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggablePointsForControls: GraphControlPoint[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

export default React.memo(function PointGraphControls({
    id,
    SVs,
    callAction,
}: PointGraphControlsProps) {
    const coreControlPoints = Array.isArray(SVs.draggablePointsForControls)
        ? SVs.draggablePointsForControls
        : [];
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none" || coreControlPoints.length === 0) {
        return null;
    }

    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    const {
        draftByKey,
        errorByKey,
        setDraft,
        hasDraft,
        isCommitting,
        pruneToActiveKeys,
        commitParsedInput,
    } = useGraphControlsInputState();

    const [rendererSliderCoordinates, setRendererSliderCoordinates] = useState<
        Record<number, { x: number; y: number }>
    >({});
    const [transientSliderSet, setTransientSliderSet] = useState<Set<string>>(
        new Set(),
    );

    const latestPointValuesByKey = useMemo(() => {
        const valuesByKey: Record<string, { x: number; y: number }> = {};

        for (const point of coreControlPoints) {
            valuesByKey[String(point.componentIdx)] = {
                x: point.x,
                y: point.y,
            };
        }

        return valuesByKey;
    }, [coreControlPoints]);

    const { getLatestValue, setLatestValue } = useLatestControlValues(
        latestPointValuesByKey,
    );

    useEffect(() => {
        const activeSliderAxisKeys = deriveActiveSliderAxisKeys({
            includeSliders,
            coreControlPoints,
        });
        const activePointIndices = new Set(
            coreControlPoints.map((point) => point.componentIdx),
        );

        setRendererSliderCoordinates((previousCoordinates) => {
            const nextCoordinates = { ...previousCoordinates };
            let changed = false;

            for (const point of coreControlPoints) {
                const previousPointCoordinates =
                    previousCoordinates[point.componentIdx];
                const latestPointCoordinates = getLatestValue(
                    String(point.componentIdx),
                    {
                        x: point.x,
                        y: point.y,
                    },
                );
                const xIsTransient = transientSliderSet.has(
                    makeInputKey(point.componentIdx, "x"),
                );
                const yIsTransient = transientSliderSet.has(
                    makeInputKey(point.componentIdx, "y"),
                );

                const nextPointCoordinates = {
                    x: xIsTransient
                        ? (previousPointCoordinates?.x ??
                          latestPointCoordinates.x)
                        : point.x,
                    y: yIsTransient
                        ? (previousPointCoordinates?.y ??
                          latestPointCoordinates.y)
                        : point.y,
                };

                if (
                    previousPointCoordinates?.x !== nextPointCoordinates.x ||
                    previousPointCoordinates?.y !== nextPointCoordinates.y
                ) {
                    nextCoordinates[point.componentIdx] = nextPointCoordinates;
                    changed = true;
                }
            }

            for (const componentIdxString of Object.keys(nextCoordinates)) {
                const componentIdx = Number(componentIdxString);
                if (!activePointIndices.has(componentIdx)) {
                    delete nextCoordinates[componentIdx];
                    changed = true;
                }
            }

            return changed ? nextCoordinates : previousCoordinates;
        });

        setTransientSliderSet((previousTransientSliderSet) => {
            const nextTransientSliderSet = new Set<string>();

            for (const sliderAxisKey of previousTransientSliderSet) {
                if (activeSliderAxisKeys.has(sliderAxisKey)) {
                    nextTransientSliderSet.add(sliderAxisKey);
                }
            }

            if (
                nextTransientSliderSet.size === previousTransientSliderSet.size
            ) {
                let changed = false;
                for (const sliderAxisKey of nextTransientSliderSet) {
                    if (!previousTransientSliderSet.has(sliderAxisKey)) {
                        changed = true;
                        break;
                    }
                }

                if (!changed) {
                    return previousTransientSliderSet;
                }
            }

            return nextTransientSliderSet;
        });
    }, [coreControlPoints, getLatestValue, includeSliders, transientSliderSet]);

    useEffect(() => {
        pruneToActiveKeys(
            deriveActiveInputKeys({
                includeInputs,
                coreControlPoints,
                graphControlsMode,
            }),
        );
    }, [
        coreControlPoints,
        graphControlsMode,
        includeInputs,
        pruneToActiveKeys,
    ]);

    async function movePoint({
        componentIdx,
        x,
        y,
        transient,
    }: {
        componentIdx: number;
        x: number;
        y: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: { actionName: "movePoint", componentIdx },
                args: {
                    x,
                    y,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] movePoint failed for component ${componentIdx}`,
                error,
            );
        }
    }

    async function updatePointCoordinateFromSlider({
        componentIdx,
        axis,
        value,
        defaultX,
        defaultY,
        transient,
    }: {
        componentIdx: number;
        axis: "x" | "y";
        value: number;
        defaultX: number;
        defaultY: number;
        transient: boolean;
    }) {
        const currentCoordinates = getLatestValue(String(componentIdx), {
            x: defaultX,
            y: defaultY,
        });
        const nextCoordinates = {
            x: axis === "x" ? value : currentCoordinates.x,
            y: axis === "y" ? value : currentCoordinates.y,
        };

        setLatestValue(String(componentIdx), nextCoordinates);
        setRendererSliderCoordinates((previousCoordinates) => ({
            ...previousCoordinates,
            [componentIdx]: nextCoordinates,
        }));

        if (transient) {
            const transientKey = makeInputKey(componentIdx, axis);
            setTransientSliderSet((previousTransientSliderSet) => {
                if (previousTransientSliderSet.has(transientKey)) {
                    return previousTransientSliderSet;
                }

                const nextTransientSliderSet = new Set(
                    previousTransientSliderSet,
                );
                nextTransientSliderSet.add(transientKey);
                return nextTransientSliderSet;
            });
        }

        await movePoint({
            componentIdx,
            x: nextCoordinates.x,
            y: nextCoordinates.y,
            transient,
        });
    }

    function clearTransientAxis(componentIdx: number, axis: "x" | "y") {
        const transientKey = makeInputKey(componentIdx, axis);
        setTransientSliderSet((previousTransientSliderSet) => {
            if (!previousTransientSliderSet.has(transientKey)) {
                return previousTransientSliderSet;
            }

            const nextTransientSliderSet = new Set(previousTransientSliderSet);
            nextTransientSliderSet.delete(transientKey);
            return nextTransientSliderSet;
        });
    }

    async function commitAxisInput({
        point,
        key,
        axis,
        rawValue,
    }: {
        point: GraphControlPoint;
        key: string;
        axis: "x" | "y";
        rawValue: string;
    }) {
        const currentCoordinates = getLatestValue(String(point.componentIdx), {
            x: point.x,
            y: point.y,
        });
        const currentValue =
            axis === "x" ? currentCoordinates.x : currentCoordinates.y;

        await commitParsedInput({
            key,
            rawValue,
            parse: parseSingleMathNumber,
            errorMessage: "Enter a valid number or numeric expression.",
            isUnchanged: (value) => value === currentValue,
            onParsed: async (value) => {
                const nextCoordinates = {
                    x: axis === "x" ? value : currentCoordinates.x,
                    y: axis === "y" ? value : currentCoordinates.y,
                };

                setLatestValue(String(point.componentIdx), nextCoordinates);
                setRendererSliderCoordinates((previousCoordinates) => ({
                    ...previousCoordinates,
                    [point.componentIdx]: nextCoordinates,
                }));

                await movePoint({
                    componentIdx: point.componentIdx,
                    x: nextCoordinates.x,
                    y: nextCoordinates.y,
                    transient: false,
                });
            },
        });
    }

    async function commitPairInput({
        point,
        key,
        rawValue,
    }: {
        point: GraphControlPoint;
        key: string;
        rawValue: string;
    }) {
        const currentCoordinates = getLatestValue(String(point.componentIdx), {
            x: point.x,
            y: point.y,
        });

        await commitParsedInput({
            key,
            rawValue,
            parse: parseOrderedPair,
            errorMessage:
                "Enter an ordered pair like (x,y) with numeric values.",
            isUnchanged: (value) => {
                return (
                    value.x === currentCoordinates.x &&
                    value.y === currentCoordinates.y
                );
            },
            onParsed: async (value) => {
                setLatestValue(String(point.componentIdx), value);
                setRendererSliderCoordinates((previousCoordinates) => ({
                    ...previousCoordinates,
                    [point.componentIdx]: value,
                }));

                await movePoint({
                    componentIdx: point.componentIdx,
                    x: value.x,
                    y: value.y,
                    transient: false,
                });
            },
        });
    }

    const controlsSection = coreControlPoints
        .map((point) => {
            const pointControlsMode = normalizePointControlsMode(
                point.addControls,
            );
            if (pointControlsMode === "none") {
                return null;
            }

            const currentCoordinates = rendererSliderCoordinates[
                point.componentIdx
            ] ?? {
                x: point.x,
                y: point.y,
            };
            const pointFallbackLabel = `Point ${point.pointNumber}`;
            const pointLabelForAria = accessibleLabelText({
                label: point.label,
                labelHasLatex: point.labelHasLatex,
                fallback: pointFallbackLabel,
            });
            const pointLabelForDisplay = point.label.trim()
                ? renderLabelWithLatex({
                      label: point.label,
                      labelHasLatex: point.labelHasLatex,
                  })
                : pointFallbackLabel;

            const xInputKey = makeInputKey(point.componentIdx, "x");
            const yInputKey = makeInputKey(point.componentIdx, "y");
            const pairInputKey = makeInputKey(point.componentIdx, "pair");

            const formattedX = formatCoordinateForControls(
                currentCoordinates.x,
                point,
            );
            const formattedY = formatCoordinateForControls(
                currentCoordinates.y,
                point,
            );

            return (
                <GraphControl
                    key={point.componentIdx}
                    id={`${id}-point-${point.componentIdx}`}
                    headingId={`${id}-point-${point.componentIdx}-heading`}
                    heading={pointLabelForDisplay}
                >
                    <PointControl
                        id={id}
                        controlId={`point-${point.componentIdx}`}
                        labelForAria={pointLabelForAria}
                        graphControlsMode={graphControlsMode}
                    controlsMode={pointControlsMode}
                    pairInput={{
                        value:
                            draftByKey[pairInputKey] ??
                            `(${formattedX},${formattedY})`,
                        ariaLabel: `coordinates for ${pointLabelForAria}`,
                        error: errorByKey[pairInputKey],
                        errorId: makeErrorId(id, point.componentIdx, "pair"),
                        onDraftChange: (value) => {
                            setDraft(pairInputKey, value);
                        },
                        onCommit: async (rawValue) => {
                            await commitPairInput({
                                point,
                                key: pairInputKey,
                                rawValue,
                            });
                        },
                        hasDraft: hasDraft(pairInputKey),
                        isCommitting: isCommitting(pairInputKey),
                        commitErrorContext: `[graph-controls] failed to commit ${pairInputKey} input`,
                    }}
                    axisControls={{
                        x: {
                            label: "x",
                            sliderAriaLabel: `x coordinate for ${pointLabelForAria}`,
                            inputOnlyAriaLabel: `x input for ${pointLabelForAria}`,
                            displayValue: formattedX,
                            min: Math.min(SVs.xMin, SVs.xMax),
                            max: Math.max(SVs.xMin, SVs.xMax),
                            step:
                                Math.max(SVs.xMin, SVs.xMax) !==
                                Math.min(SVs.xMin, SVs.xMax)
                                    ? (Math.max(SVs.xMin, SVs.xMax) -
                                          Math.min(SVs.xMin, SVs.xMax)) /
                                      100
                                    : 1,
                            value: currentCoordinates.x,
                            onSliderChange: (value, transient) => {
                                updatePointCoordinateFromSlider({
                                    componentIdx: point.componentIdx,
                                    axis: "x",
                                    value,
                                    transient,
                                    defaultX: point.x,
                                    defaultY: point.y,
                                }).catch(() => {});
                            },
                            onDragEnd: () => {
                                clearTransientAxis(point.componentIdx, "x");
                            },
                            input: {
                                value: draftByKey[xInputKey] ?? formattedX,
                                ariaLabel: `x value input for ${pointLabelForAria}`,
                                error: errorByKey[xInputKey],
                                errorId: makeErrorId(
                                    id,
                                    point.componentIdx,
                                    "x",
                                ),
                                onDraftChange: (value) => {
                                    setDraft(xInputKey, value);
                                },
                                onCommit: async (rawValue) => {
                                    await commitAxisInput({
                                        point,
                                        key: xInputKey,
                                        axis: "x",
                                        rawValue,
                                    });
                                },
                                hasDraft: hasDraft(xInputKey),
                                isCommitting: isCommitting(xInputKey),
                                commitErrorContext: `[graph-controls] failed to commit ${xInputKey} input`,
                            },
                        },
                        y: {
                            label: "y",
                            sliderAriaLabel: `y coordinate for ${pointLabelForAria}`,
                            inputOnlyAriaLabel: `y input for ${pointLabelForAria}`,
                            displayValue: formattedY,
                            min: Math.min(SVs.yMin, SVs.yMax),
                            max: Math.max(SVs.yMin, SVs.yMax),
                            step:
                                Math.max(SVs.yMin, SVs.yMax) !==
                                Math.min(SVs.yMin, SVs.yMax)
                                    ? (Math.max(SVs.yMin, SVs.yMax) -
                                          Math.min(SVs.yMin, SVs.yMax)) /
                                      100
                                    : 1,
                            value: currentCoordinates.y,
                            onSliderChange: (value, transient) => {
                                updatePointCoordinateFromSlider({
                                    componentIdx: point.componentIdx,
                                    axis: "y",
                                    value,
                                    transient,
                                    defaultX: point.x,
                                    defaultY: point.y,
                                }).catch(() => {});
                            },
                            onDragEnd: () => {
                                clearTransientAxis(point.componentIdx, "y");
                            },
                            input: {
                                value: draftByKey[yInputKey] ?? formattedY,
                                ariaLabel: `y value input for ${pointLabelForAria}`,
                                error: errorByKey[yInputKey],
                                errorId: makeErrorId(
                                    id,
                                    point.componentIdx,
                                    "y",
                                ),
                                onDraftChange: (value) => {
                                    setDraft(yInputKey, value);
                                },
                                onCommit: async (rawValue) => {
                                    await commitAxisInput({
                                        point,
                                        key: yInputKey,
                                        axis: "y",
                                        rawValue,
                                    });
                                },
                                hasDraft: hasDraft(yInputKey),
                                isCommitting: isCommitting(yInputKey),
                                commitErrorContext: `[graph-controls] failed to commit ${yInputKey} input`,
                            },
                        },
                    }}
                    />
                </GraphControl>
            );
        })
        .filter((section): section is React.JSX.Element => Boolean(section));

    if (controlsSection.length === 0) {
        return null;
    }

    return (
        <GraphControlsPanel id={id} ariaLabel="Point controls">
            {controlsSection}
        </GraphControlsPanel>
    );
});
