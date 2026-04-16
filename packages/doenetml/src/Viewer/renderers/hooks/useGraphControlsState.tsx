import React, { useEffect, useRef, useState } from "react";
import SliderUI from "../utils/SliderUI";
import {
    GraphControlAxis,
    GraphControlPoint,
    GraphControlsMode,
    deriveActiveInputKeys,
    deriveActiveSliderAxisKeys,
    makeInputKey,
    normalizedSliderBounds,
    pruneRecordByActiveKeys,
} from "../utils/graphControls";
import {
    formatCoordinateForControls,
    parseOrderedPair,
    parseSingleMathNumber,
} from "../utils/graphControlsMath";

type UseGraphControlsStateArgs = {
    id: string;
    coreControlPoints: GraphControlPoint[];
    graphControlsMode: GraphControlsMode;
    includeSliders: boolean;
    includeInputs: boolean;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

type AxisInputConfig = {
    value: string;
    error: string | undefined;
    describedBy: string;
    onChange: (value: string) => void;
    onCommit: (value: string) => Promise<void>;
};

/**
 * Owns point-controls runtime state and handlers.
 *
 * This hook centralizes slider/input synchronization so presentation components
 * remain mostly declarative while preserving movePoint semantics.
 */
export function useGraphControlsState({
    id,
    coreControlPoints,
    graphControlsMode,
    includeSliders,
    includeInputs,
    xMin,
    xMax,
    yMin,
    yMax,
    callAction,
}: UseGraphControlsStateArgs) {
    const [rendererSliderCoordinates, setRendererSliderCoordinates] = useState<
        Record<number, { x: number; y: number }>
    >({});
    const [inputDraftByKey, setInputDraftByKey] = useState<
        Record<string, string>
    >({});
    const [inputErrorByKey, setInputErrorByKey] = useState<
        Record<string, string>
    >({});
    const latestSliderCoordinatesRef = useRef<
        Record<number, { x: number; y: number }>
    >({});
    const committingInputKeysRef = useRef<Set<string>>(new Set());
    const [transientSliderSet, setTransientSliderSet] = useState<Set<string>>(
        new Set(),
    );

    /**
     * Update draft input value and clear any associated error.
     */
    function setInputDraftValue(key: string, value: string) {
        setInputDraftByKey((previousDraftByKey) => ({
            ...previousDraftByKey,
            [key]: value,
        }));
        setInputError(key, null);
    }

    // Keep a mutable snapshot of the most recent displayed slider coordinates.
    // This avoids stale closures when we merge transient drag updates.
    useEffect(() => {
        latestSliderCoordinatesRef.current = {
            ...latestSliderCoordinatesRef.current,
            ...rendererSliderCoordinates,
        };
    }, [rendererSliderCoordinates]);

    /**
     * Reconcile renderer-local slider coordinates with core SVs.
     *
     * During transient (in-progress) drags:
     * - Preserve the rendered slider value for the active axis
     * - This prevents core updates from snapping values mid-drag
     * - Track transient edges via transientSliderSet
     *
     * Once a non-transient (committed) update arrives:
     * - Clear the transient flag for that axis
     * - Renderer coordinates are synced to core values
     *
     * Also prunes stale coordinates for removed points.
     */
    useEffect(() => {
        const activePointIndices = new Set<number>(
            coreControlPoints.map((p) => p.componentIdx),
        );
        const activeSliderAxisKeys = deriveActiveSliderAxisKeys({
            includeSliders,
            coreControlPoints,
        });

        setRendererSliderCoordinates((previousCoordinates) => {
            const nextCoordinates = { ...previousCoordinates };
            let changed = false;

            for (const {
                componentIdx,
                x: coreX,
                y: coreY,
            } of coreControlPoints) {
                const previousPointCoordinates =
                    previousCoordinates[componentIdx];
                const latestPointCoordinates =
                    latestSliderCoordinatesRef.current[componentIdx];
                const xIsTransient = transientSliderSet.has(
                    makeInputKey(componentIdx, "x"),
                );
                const yIsTransient = transientSliderSet.has(
                    makeInputKey(componentIdx, "y"),
                );
                const nextPointCoordinates = {
                    x: xIsTransient
                        ? (previousPointCoordinates?.x ??
                          latestPointCoordinates?.x ??
                          coreX)
                        : coreX,
                    y: yIsTransient
                        ? (previousPointCoordinates?.y ??
                          latestPointCoordinates?.y ??
                          coreY)
                        : coreY,
                };

                if (
                    previousPointCoordinates?.x !== nextPointCoordinates.x ||
                    previousPointCoordinates?.y !== nextPointCoordinates.y
                ) {
                    nextCoordinates[componentIdx] = nextPointCoordinates;
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
    }, [coreControlPoints, includeSliders, transientSliderSet]);

    // Prune draft/error entries for inputs that are no longer active due to
    // mode switches or point removal. This prevents hidden stale errors/drafts
    // from resurfacing when controls are toggled back on.
    useEffect(() => {
        const activeInputKeys = deriveActiveInputKeys({
            includeInputs,
            coreControlPoints,
            graphControlsMode,
        });

        setInputDraftByKey((previousDraftByKey) =>
            pruneRecordByActiveKeys(previousDraftByKey, activeInputKeys),
        );
        setInputErrorByKey((previousErrorByKey) =>
            pruneRecordByActiveKeys(previousErrorByKey, activeInputKeys),
        );
    }, [coreControlPoints, graphControlsMode, includeInputs]);

    /**
     * Update point coordinate from slider interaction.
     */
    async function updatePointCoordinateFromSlider({
        componentIdx,
        axis,
        value,
        transient,
        defaultX,
        defaultY,
    }: {
        componentIdx: number;
        axis: GraphControlAxis;
        value: number;
        transient: boolean;
        defaultX: number;
        defaultY: number;
    }) {
        const currentCoordinates = latestSliderCoordinatesRef.current[
            componentIdx
        ] ?? {
            x: defaultX,
            y: defaultY,
        };
        const nextCoordinates = {
            x: axis === "x" ? value : currentCoordinates.x,
            y: axis === "y" ? value : currentCoordinates.y,
        };

        latestSliderCoordinatesRef.current = {
            ...latestSliderCoordinatesRef.current,
            [componentIdx]: nextCoordinates,
        };

        setRendererSliderCoordinates((previousCoordinates) => ({
            ...previousCoordinates,
            [componentIdx]: nextCoordinates,
        }));

        function clearTransientForAxis() {
            const transientKey = makeInputKey(componentIdx, axis);

            setTransientSliderSet((previousTransientSliderSet) => {
                if (!previousTransientSliderSet.has(transientKey)) {
                    return previousTransientSliderSet;
                }

                const nextTransientSliderSet = new Set(
                    previousTransientSliderSet,
                );
                nextTransientSliderSet.delete(transientKey);
                return nextTransientSliderSet;
            });
        }

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

        try {
            await callAction({
                action: { actionName: "movePoint", componentIdx },
                args: {
                    x: nextCoordinates.x,
                    y: nextCoordinates.y,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] movePoint failed for component ${componentIdx}`,
                error,
            );
        } finally {
            if (!transient) {
                clearTransientForAxis();
            }
        }
    }

    /**
     * Commit point coordinates from text controls (axis input or pair input).
     */
    async function updatePointCoordinatesFromControls({
        componentIdx,
        x,
        y,
    }: {
        componentIdx: number;
        x: number;
        y: number;
    }) {
        const nextCoordinates = { x, y };

        latestSliderCoordinatesRef.current = {
            ...latestSliderCoordinatesRef.current,
            [componentIdx]: nextCoordinates,
        };

        setRendererSliderCoordinates((previousCoordinates) => ({
            ...previousCoordinates,
            [componentIdx]: nextCoordinates,
        }));

        try {
            await callAction({
                action: { actionName: "movePoint", componentIdx },
                args: {
                    x,
                    y,
                    transient: false,
                    skippable: false,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] movePoint failed for component ${componentIdx}`,
                error,
            );
        }
    }

    function setInputError(key: string, error: string | null) {
        setInputErrorByKey((previousErrorByKey) => {
            if (error) {
                if (previousErrorByKey[key] === error) {
                    return previousErrorByKey;
                }
                return { ...previousErrorByKey, [key]: error };
            }

            if (
                !Object.prototype.hasOwnProperty.call(previousErrorByKey, key)
            ) {
                return previousErrorByKey;
            }

            const nextErrorByKey = { ...previousErrorByKey };
            delete nextErrorByKey[key];
            return nextErrorByKey;
        });
    }

    function clearInputDraft(key: string) {
        setInputDraftByKey((previousDraftByKey) => {
            if (
                !Object.prototype.hasOwnProperty.call(previousDraftByKey, key)
            ) {
                return previousDraftByKey;
            }

            const nextDraftByKey = { ...previousDraftByKey };
            delete nextDraftByKey[key];
            return nextDraftByKey;
        });
    }

    /**
     * Generic input submission with integrated parsing and validation.
     */
    async function submitInputValue({
        inputKey,
        rawValue,
        currentCoordinates,
        componentIdx,
        parser,
        errorMessage,
        isUnchanged,
    }: {
        inputKey: string;
        rawValue: string;
        currentCoordinates: { x: number; y: number };
        componentIdx: number;
        parser: (input: string) => { x: number; y: number } | null;
        errorMessage: string;
        isUnchanged: (parsed: { x: number; y: number }) => boolean;
    }) {
        if (!Object.prototype.hasOwnProperty.call(inputDraftByKey, inputKey)) {
            return;
        }

        if (committingInputKeysRef.current.has(inputKey)) {
            return;
        }
        committingInputKeysRef.current.add(inputKey);

        try {
            const parsed = parser(rawValue);
            if (!parsed) {
                setInputError(inputKey, errorMessage);
                return;
            }

            if (isUnchanged(parsed)) {
                setInputError(inputKey, null);
                clearInputDraft(inputKey);
                return;
            }

            setInputError(inputKey, null);
            clearInputDraft(inputKey);
            await updatePointCoordinatesFromControls({
                componentIdx,
                x: parsed.x,
                y: parsed.y,
            });
        } finally {
            committingInputKeysRef.current.delete(inputKey);
        }
    }

    async function submitAxisInput({
        componentIdx,
        axis,
        rawValue,
        currentCoordinates,
        inputKey,
    }: {
        componentIdx: number;
        axis: GraphControlAxis;
        rawValue: string;
        currentCoordinates: { x: number; y: number };
        inputKey: string;
    }) {
        await submitInputValue({
            inputKey,
            rawValue,
            currentCoordinates,
            componentIdx,
            parser: (input: string) => {
                const parsed = parseSingleMathNumber(input);
                return parsed !== null
                    ? {
                          x: axis === "x" ? parsed : currentCoordinates.x,
                          y: axis === "y" ? parsed : currentCoordinates.y,
                      }
                    : null;
            },
            errorMessage: "Enter a valid number or numeric expression.",
            isUnchanged: (parsed) =>
                (axis === "x" && parsed.x === currentCoordinates.x) ||
                (axis === "y" && parsed.y === currentCoordinates.y),
        });
    }

    async function submitPairInput({
        componentIdx,
        rawValue,
        currentCoordinates,
        inputKey,
    }: {
        componentIdx: number;
        rawValue: string;
        currentCoordinates: { x: number; y: number };
        inputKey: string;
    }) {
        await submitInputValue({
            inputKey,
            rawValue,
            currentCoordinates,
            componentIdx,
            parser: parseOrderedPair,
            errorMessage:
                "Enter an ordered pair like (x,y) with numeric values.",
            isUnchanged: (parsed) =>
                parsed.x === currentCoordinates.x &&
                parsed.y === currentCoordinates.y,
        });
    }

    function renderAxisSlider({
        axis,
        point,
        currentCoordinates,
        pointLabelForAria,
        axisInputConfig,
    }: {
        axis: GraphControlAxis;
        point: GraphControlPoint;
        currentCoordinates: { x: number; y: number };
        pointLabelForAria: string;
        axisInputConfig?: AxisInputConfig;
    }) {
        const isX = axis === "x";
        const value = isX ? currentCoordinates.x : currentCoordinates.y;
        const rawMin = isX ? xMin : yMin;
        const rawMax = isX ? xMax : yMax;
        const { min, max } = normalizedSliderBounds(rawMin, rawMax);
        const step = max !== min ? (max - min) / 100 : 1;
        const axisLabel = isX ? "x" : "y";
        const label = axisInputConfig ? (
            <span
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                <span>{`${axisLabel}:`}</span>
                <input
                    type="text"
                    value={axisInputConfig.value}
                    aria-label={`${axisLabel} value input for ${pointLabelForAria}`}
                    aria-invalid={axisInputConfig.error ? true : undefined}
                    aria-describedby={
                        axisInputConfig.error
                            ? axisInputConfig.describedBy
                            : undefined
                    }
                    onChange={(event) => {
                        axisInputConfig.onChange(event.target.value);
                    }}
                    onBlur={(event) => {
                        axisInputConfig
                            .onCommit(event.target.value)
                            .catch((error) => {
                                console.error(
                                    `[graph-controls] failed to commit ${axisLabel} input for component ${point.componentIdx}`,
                                    error,
                                );
                            });
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            axisInputConfig
                                .onCommit(event.currentTarget.value)
                                .catch((error) => {
                                    console.error(
                                        `[graph-controls] failed to commit ${axisLabel} input for component ${point.componentIdx}`,
                                        error,
                                    );
                                });
                        }
                    }}
                    style={{ width: "84px" }}
                />
                {axisInputConfig.error ? (
                    <span
                        id={axisInputConfig.describedBy}
                        style={{
                            color: "#b00020",
                            fontSize: "0.85em",
                            flexBasis: "100%",
                            width: "100%",
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                        }}
                    >
                        {axisInputConfig.error}
                    </span>
                ) : null}
            </span>
        ) : (
            `${axisLabel}: ${formatCoordinateForControls(value, point)}`
        );

        return (
            <SliderUI
                key={axis}
                id={`${id}-point-${point.componentIdx}-${axis}`}
                label={label}
                ariaLabel={`${axis} coordinate for ${pointLabelForAria}`}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(value, transient) =>
                    updatePointCoordinateFromSlider({
                        componentIdx: point.componentIdx,
                        axis,
                        value,
                        transient,
                        defaultX: currentCoordinates.x,
                        defaultY: currentCoordinates.y,
                    })
                }
                onDragEnd={() => {
                    const transientKey = makeInputKey(point.componentIdx, axis);
                    setTransientSliderSet((prev) => {
                        if (!prev.has(transientKey)) {
                            return prev;
                        }
                        const next = new Set(prev);
                        next.delete(transientKey);
                        return next;
                    });
                }}
            />
        );
    }

    return {
        rendererSliderCoordinates,
        inputDraftByKey,
        inputErrorByKey,
        setInputDraftValue,
        submitAxisInput,
        submitPairInput,
        renderAxisSlider,
    };
}
