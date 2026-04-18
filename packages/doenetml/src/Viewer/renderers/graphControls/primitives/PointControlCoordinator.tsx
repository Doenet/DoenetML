import React, { useEffect, useMemo, useState } from "react";
import { useControlInputState } from "../hooks/useControlInputState";
import { useLatestValues } from "../hooks/useLatestValues";
import { useTransientKeys } from "../hooks/useTransientKeys";
import {
    GraphControlsMode,
    PointControlsMode,
    PointMoveRole,
    makeInputErrorId,
    makePointLikeDraftKey,
    makePointLikeTransientAxisKey,
    normalizedSliderBounds,
} from "../model";
import { parseOrderedPair, parseSingleMathNumber } from "../mathFormatParse";
import PointControlView from "./PointControlView";

type PointControlCoordinatorProps = {
    id: string;
    controlId: string;
    componentIdx: number;
    pointRole: PointMoveRole;
    sectionHeading?: React.ReactNode;
    sectionHeadingHasDivider?: boolean;
    labelForAria: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    pairAriaLabel?: string;
    xSliderAriaLabel?: string;
    ySliderAriaLabel?: string;
    xInputAriaLabel?: string;
    yInputAriaLabel?: string;
    graphControlsMode: Exclude<GraphControlsMode, "none">;
    pointControlsMode: PointControlsMode;
    x: number;
    y: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    formatCoordinate: (value: number) => string;
    onMovePointLike: (payload: {
        componentIdx: number;
        pointRole: PointMoveRole;
        x: number;
        y: number;
        transient: boolean;
        skippable: boolean;
    }) => Promise<void>;
};

/**
 * Orchestrates point-like graph control behavior (drafts, parsing, validation,
 * transient slider state, and commits) while delegating rendering to PointControlView.
 */
export default function PointControlCoordinator({
    id,
    controlId,
    componentIdx,
    pointRole,
    sectionHeading,
    sectionHeadingHasDivider = true,
    labelForAria,
    xAxisLabel = "x",
    yAxisLabel = "y",
    pairAriaLabel,
    xSliderAriaLabel,
    ySliderAriaLabel,
    xInputAriaLabel,
    yInputAriaLabel,
    graphControlsMode,
    pointControlsMode,
    x,
    y,
    xMin,
    xMax,
    yMin,
    yMax,
    formatCoordinate,
    onMovePointLike,
}: PointControlCoordinatorProps) {
    const {
        draftByKey,
        errorByKey,
        setDraft,
        hasDraft,
        isCommitting,
        commitParsedInput,
    } = useControlInputState();

    const {
        isTransient,
        markTransient,
        clearTransient,
        pruneToActiveKeys: pruneTransientKeysToActive,
    } = useTransientKeys();

    const [rendererSliderCoordinates, setRendererSliderCoordinates] = useState({
        x,
        y,
    });

    const latestPointValuesByKey = useMemo(() => {
        return {
            point: { x, y },
        };
    }, [x, y]);

    const { getLatestValue, setLatestValue } = useLatestValues(
        latestPointValuesByKey,
    );

    useEffect(() => {
        const activeTransientKeys = new Set<string>();

        if (pointControlsMode !== "yonly" && pointControlsMode !== "none") {
            activeTransientKeys.add(
                makePointLikeTransientAxisKey(componentIdx, pointRole, "x"),
            );
        }

        if (pointControlsMode !== "xonly" && pointControlsMode !== "none") {
            activeTransientKeys.add(
                makePointLikeTransientAxisKey(componentIdx, pointRole, "y"),
            );
        }

        pruneTransientKeysToActive(activeTransientKeys);

        const latestCoordinates = getLatestValue("point", { x, y });
        const xIsTransient = isTransient(
            makePointLikeTransientAxisKey(componentIdx, pointRole, "x"),
        );
        const yIsTransient = isTransient(
            makePointLikeTransientAxisKey(componentIdx, pointRole, "y"),
        );

        setRendererSliderCoordinates((previousCoordinates) => {
            const nextCoordinates = {
                x: xIsTransient
                    ? (previousCoordinates.x ?? latestCoordinates.x)
                    : x,
                y: yIsTransient
                    ? (previousCoordinates.y ?? latestCoordinates.y)
                    : y,
            };

            if (
                nextCoordinates.x === previousCoordinates.x &&
                nextCoordinates.y === previousCoordinates.y
            ) {
                return previousCoordinates;
            }

            return nextCoordinates;
        });
    }, [
        componentIdx,
        getLatestValue,
        isTransient,
        pointControlsMode,
        pointRole,
        pruneTransientKeysToActive,
        x,
        y,
    ]);

    const xInputKey = makePointLikeDraftKey(componentIdx, pointRole, "x");
    const yInputKey = makePointLikeDraftKey(componentIdx, pointRole, "y");
    const pairInputKey = makePointLikeDraftKey(componentIdx, pointRole, "pair");

    const formattedX = formatCoordinate(rendererSliderCoordinates.x);
    const formattedY = formatCoordinate(rendererSliderCoordinates.y);

    const { min: normalizedXMin, max: normalizedXMax } = normalizedSliderBounds(
        xMin,
        xMax,
    );
    const { min: normalizedYMin, max: normalizedYMax } = normalizedSliderBounds(
        yMin,
        yMax,
    );
    const xStep =
        normalizedXMax !== normalizedXMin
            ? (normalizedXMax - normalizedXMin) / 100
            : 1;
    const yStep =
        normalizedYMax !== normalizedYMin
            ? (normalizedYMax - normalizedYMin) / 100
            : 1;

    async function movePointLike({
        nextX,
        nextY,
        transient,
    }: {
        nextX: number;
        nextY: number;
        transient: boolean;
    }) {
        await onMovePointLike({
            componentIdx,
            pointRole,
            x: nextX,
            y: nextY,
            transient,
            skippable: transient,
        });
    }

    async function updatePointCoordinateFromSlider({
        axis,
        value,
        transient,
    }: {
        axis: "x" | "y";
        value: number;
        transient: boolean;
    }) {
        const currentCoordinates = getLatestValue("point", {
            x,
            y,
        });
        const nextCoordinates = {
            x: axis === "x" ? value : currentCoordinates.x,
            y: axis === "y" ? value : currentCoordinates.y,
        };

        setLatestValue("point", nextCoordinates);
        setRendererSliderCoordinates(nextCoordinates);

        if (transient) {
            markTransient(
                makePointLikeTransientAxisKey(componentIdx, pointRole, axis),
            );
        }

        await movePointLike({
            nextX: nextCoordinates.x,
            nextY: nextCoordinates.y,
            transient,
        });
    }

    function clearTransientAxis(axis: "x" | "y") {
        clearTransient(
            makePointLikeTransientAxisKey(componentIdx, pointRole, axis),
        );
    }

    async function commitAxisInput({
        key,
        axis,
        rawValue,
    }: {
        key: string;
        axis: "x" | "y";
        rawValue: string;
    }) {
        const currentCoordinates = getLatestValue("point", {
            x,
            y,
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

                setLatestValue("point", nextCoordinates);
                setRendererSliderCoordinates(nextCoordinates);

                await movePointLike({
                    nextX: nextCoordinates.x,
                    nextY: nextCoordinates.y,
                    transient: false,
                });
            },
        });
    }

    async function commitPairInput(rawValue: string) {
        const currentCoordinates = getLatestValue("point", {
            x,
            y,
        });

        await commitParsedInput({
            key: pairInputKey,
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
                setLatestValue("point", value);
                setRendererSliderCoordinates(value);

                await movePointLike({
                    nextX: value.x,
                    nextY: value.y,
                    transient: false,
                });
            },
        });
    }

    return (
        <PointControlView
            id={id}
            controlId={controlId}
            sectionHeading={sectionHeading}
            sectionHeadingHasDivider={sectionHeadingHasDivider}
            labelForAria={labelForAria}
            graphControlsMode={graphControlsMode}
            controlsMode={pointControlsMode}
            pairInput={{
                value:
                    draftByKey[pairInputKey] ?? `(${formattedX},${formattedY})`,
                ariaLabel: pairAriaLabel ?? `coordinates for ${labelForAria}`,
                error: errorByKey[pairInputKey],
                errorId: makeInputErrorId(id, "point", pairInputKey),
                onDraftChange: (value) => {
                    setDraft(pairInputKey, value);
                },
                onCommit: commitPairInput,
                hasDraft: hasDraft(pairInputKey),
                isCommitting: isCommitting(pairInputKey),
                commitErrorContext: `[graph-controls] failed to commit ${pairInputKey} input`,
            }}
            axisControls={{
                x: {
                    label: xAxisLabel,
                    sliderAriaLabel:
                        xSliderAriaLabel ?? `x coordinate for ${labelForAria}`,
                    inputOnlyAriaLabel:
                        xInputAriaLabel ?? `x input for ${labelForAria}`,
                    displayValue: formattedX,
                    min: normalizedXMin,
                    max: normalizedXMax,
                    step: xStep,
                    value: rendererSliderCoordinates.x,
                    onSliderChange: (value, transient) => {
                        updatePointCoordinateFromSlider({
                            axis: "x",
                            value,
                            transient,
                        }).catch(() => {});
                    },
                    onDragEnd: () => {
                        clearTransientAxis("x");
                    },
                    input: {
                        value: draftByKey[xInputKey] ?? formattedX,
                        ariaLabel:
                            xInputAriaLabel ??
                            `x value input for ${labelForAria}`,
                        error: errorByKey[xInputKey],
                        errorId: makeInputErrorId(id, "point", xInputKey),
                        onDraftChange: (value) => {
                            setDraft(xInputKey, value);
                        },
                        onCommit: async (rawValue) => {
                            await commitAxisInput({
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
                    label: yAxisLabel,
                    sliderAriaLabel:
                        ySliderAriaLabel ?? `y coordinate for ${labelForAria}`,
                    inputOnlyAriaLabel:
                        yInputAriaLabel ?? `y input for ${labelForAria}`,
                    displayValue: formattedY,
                    min: normalizedYMin,
                    max: normalizedYMax,
                    step: yStep,
                    value: rendererSliderCoordinates.y,
                    onSliderChange: (value, transient) => {
                        updatePointCoordinateFromSlider({
                            axis: "y",
                            value,
                            transient,
                        }).catch(() => {});
                    },
                    onDragEnd: () => {
                        clearTransientAxis("y");
                    },
                    input: {
                        value: draftByKey[yInputKey] ?? formattedY,
                        ariaLabel:
                            yInputAriaLabel ??
                            `y value input for ${labelForAria}`,
                        error: errorByKey[yInputKey],
                        errorId: makeInputErrorId(id, "point", yInputKey),
                        onDraftChange: (value) => {
                            setDraft(yInputKey, value);
                        },
                        onCommit: async (rawValue) => {
                            await commitAxisInput({
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
    );
}
