import React, { useEffect, useRef, useState } from "react";
import me from "math-expressions";
import { roundForDisplay } from "@doenet/utils";
import SliderUI from "./utils/SliderUI";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "./utils/labelWithLatex";

type GraphControlsMode = "all" | "slidersonly" | "inputsonly" | "none";
type PointControlsMode = "both" | "xonly" | "yonly" | "none";

type GraphControlsProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggablePointsForControls: Array<{
            componentIdx: number;
            pointNumber: number;
            x: number;
            y: number;
            addControls: string;
            label: string;
            labelHasLatex: boolean;
            displayDigits: number;
            displayDecimals: number;
            displaySmallAsZero: number;
            padZeros: boolean;
        }>;
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

/**
 * Graph-level controls mode parser.
 *
 * Invalid or missing values are treated as "none" to avoid rendering
 * controls that the core did not explicitly request.
 */
function normalizeGraphControlsMode(value: unknown): GraphControlsMode {
    if (typeof value !== "string") {
        return "none";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "all" ||
        normalized === "slidersonly" ||
        normalized === "inputsonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "none";
}

/**
 * Point-level controls mode parser.
 *
 * Invalid or missing values are treated as "both" so an individual point
 * keeps legacy behavior unless it explicitly opts out of an axis.
 */
function normalizePointControlsMode(value: unknown): PointControlsMode {
    if (typeof value !== "string") {
        return "both";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "both" ||
        normalized === "xonly" ||
        normalized === "yonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "both";
}

/**
 * Parse a single numeric expression used by x/y text inputs.
 *
 * Returns null for invalid expressions or non-finite results.
 */
function parseSingleMathNumber(input: string): number | null {
    try {
        const expression = me.fromText(input);
        const value = expression?.evaluate_to_constant?.();
        return Number.isFinite(value) ? value : null;
    } catch (_error) {
        return null;
    }
}

/**
 * Parse an ordered pair from text input.
 *
 * Accepts tuple/vector syntax and returns null unless both coordinates
 * evaluate to finite constants.
 */
function parseOrderedPair(input: string): { x: number; y: number } | null {
    try {
        const expression = me.fromText(input);
        const tree = expression?.tree;
        if (!Array.isArray(tree) || tree.length !== 3) {
            return null;
        }

        const operator = tree[0];
        if (operator !== "tuple" && operator !== "vector") {
            return null;
        }

        const x = me.fromAst(tree[1])?.evaluate_to_constant?.();
        const y = me.fromAst(tree[2])?.evaluate_to_constant?.();

        if (x === null || y === null) {
            return null;
        }

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return null;
        }

        return { x, y };
    } catch (_error) {
        return null;
    }
}

/**
 * Remove stale entries from an input state record when points/modes change.
 *
 * Returns the original object when no keys were removed so React can avoid
 * unnecessary rerenders caused by identity changes.
 */
function pruneRecordByActiveKeys(
    previousRecord: Record<string, string>,
    activeKeys: Set<string>,
): Record<string, string> {
    const nextRecord: Record<string, string> = {};
    let changed = false;

    for (const key in previousRecord) {
        const value = previousRecord[key];
        if (activeKeys.has(key)) {
            nextRecord[key] = value;
        } else {
            changed = true;
        }
    }

    return changed ? nextRecord : previousRecord;
}

/**
 * Generate a unified input key for state tracking.
 * Supports different suffixes: x-axis, y-axis, or pair input.
 */
function makeInputKey(
    componentIdx: number,
    suffix: "x" | "y" | "pair",
): string {
    return `${componentIdx}|${suffix}`;
}

/**
 * Generate an error message ID for aria-describedby attributes.
 */
function makeErrorId(
    elementId: string,
    componentIdx: number,
    suffix: string,
): string {
    return `${elementId}-error-point-${componentIdx}-${suffix}`;
}

export default React.memo(function GraphControls({
    id,
    SVs,
    callAction,
}: GraphControlsProps) {
    const coreControlPoints = SVs.draggablePointsForControls;
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

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

    // Alias for readability when generating transient slider keys
    const sliderAxisTransientKey = makeInputKey;

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
        const activeSliderAxisKeys = new Set<string>();

        for (const { componentIdx, addControls } of coreControlPoints) {
            if (!includeSliders) {
                continue;
            }

            const normalizedAddControls =
                normalizePointControlsMode(addControls);
            if (
                normalizedAddControls !== "yonly" &&
                normalizedAddControls !== "none"
            ) {
                activeSliderAxisKeys.add(
                    sliderAxisTransientKey(componentIdx, "x"),
                );
            }

            if (
                normalizedAddControls !== "xonly" &&
                normalizedAddControls !== "none"
            ) {
                activeSliderAxisKeys.add(
                    sliderAxisTransientKey(componentIdx, "y"),
                );
            }
        }

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
                    sliderAxisTransientKey(componentIdx, "x"),
                );
                const yIsTransient = transientSliderSet.has(
                    sliderAxisTransientKey(componentIdx, "y"),
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
        const activeInputKeys = new Set<string>();

        if (includeInputs) {
            for (const point of coreControlPoints) {
                const pointControlsMode = normalizePointControlsMode(
                    point.addControls,
                );

                if (pointControlsMode === "none") {
                    continue;
                }

                if (graphControlsMode === "all") {
                    if (pointControlsMode !== "yonly") {
                        activeInputKeys.add(
                            makeInputKey(point.componentIdx, "x"),
                        );
                    }
                    if (pointControlsMode !== "xonly") {
                        activeInputKeys.add(
                            makeInputKey(point.componentIdx, "y"),
                        );
                    }
                } else if (graphControlsMode === "inputsonly") {
                    if (pointControlsMode === "both") {
                        activeInputKeys.add(
                            makeInputKey(point.componentIdx, "pair"),
                        );
                    } else if (pointControlsMode === "xonly") {
                        activeInputKeys.add(
                            makeInputKey(point.componentIdx, "x"),
                        );
                    } else if (pointControlsMode === "yonly") {
                        activeInputKeys.add(
                            makeInputKey(point.componentIdx, "y"),
                        );
                    }
                }
            }
        }

        setInputDraftByKey((previousDraftByKey) =>
            pruneRecordByActiveKeys(previousDraftByKey, activeInputKeys),
        );
        setInputErrorByKey((previousErrorByKey) =>
            pruneRecordByActiveKeys(previousErrorByKey, activeInputKeys),
        );
    }, [coreControlPoints, graphControlsMode, includeInputs]);

    /**
     * Update point coordinate from slider interaction.
     *
     * Handles optimistic updates during drags (transient=true) and committed
     * updates (transient=false). Transient flags prevent core updates from
     * overwriting in-progress drag values.
     *
     * @param componentIdx - Point component index
     * @param axis - "x" or "y" axis
     * @param value - New coordinate value
     * @param transient - True during drag, false after commit
     * @param defaultX - Fallback x if no previous state
     * @param defaultY - Fallback y if no previous state
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
        axis: "x" | "y";
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
            const transientKey = sliderAxisTransientKey(componentIdx, axis);

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
            const transientKey = sliderAxisTransientKey(componentIdx, axis);

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

    // Sliders require ordered bounds even if graph limits are reversed.
    function normalizedSliderBounds(rawMin: number, rawMax: number) {
        const min = Math.min(rawMin, rawMax);
        const max = Math.max(rawMin, rawMax);
        return { min, max };
    }

    // Use Doenet display rounding rules so slider labels and input defaults
    // match how coordinates are shown elsewhere in the viewer.
    function formatCoordinateForSlider(
        value: number,
        point: (typeof coreControlPoints)[number],
    ): string {
        const rounded = roundForDisplay({
            value,
            dependencyValues: {
                displayDigits: point.displayDigits,
                displayDecimals: point.displayDecimals,
                displaySmallAsZero: point.displaySmallAsZero,
            },
        });

        const params: any = {};
        if (point.padZeros) {
            if (Number.isFinite(point.displayDecimals)) {
                params.padToDecimals = point.displayDecimals;
            }
            if (point.displayDigits >= 1) {
                params.padToDigits = point.displayDigits;
            }
        }

        return rounded.toString(params);
    }

    const { xMin, xMax, yMin, yMax } = SVs;

    /**
     * Commit point coordinates from text controls (axis input or pair input).
     *
     * This is always a non-transient move, so core and renderer should settle
     * to the same final coordinates.
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

            if (!(key in previousErrorByKey)) {
                return previousErrorByKey;
            }

            const nextErrorByKey = { ...previousErrorByKey };
            delete nextErrorByKey[key];
            return nextErrorByKey;
        });
    }

    function clearInputDraft(key: string) {
        setInputDraftByKey((previousDraftByKey) => {
            if (!(key in previousDraftByKey)) {
                return previousDraftByKey;
            }

            const nextDraftByKey = { ...previousDraftByKey };
            delete nextDraftByKey[key];
            return nextDraftByKey;
        });
    }

    /**
     * Generic input submission with integrated parsing and validation.
     *
     * Handles guardrails:
     * - Ignores if no draft present
     * - Prevents duplicate concurrent commits
     * - Surfaces validation errors inline
     * - Skips dispatch when coordinates unchanged
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
        if (!(inputKey in inputDraftByKey)) {
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

    /**
     * Commit a single-axis text input.
     */
    async function submitAxisInput({
        componentIdx,
        axis,
        rawValue,
        currentCoordinates,
        inputKey,
    }: {
        componentIdx: number;
        axis: "x" | "y";
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

    /**
     * Commit an ordered-pair text input.
     */
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

    /**
     * Render a slider control for one axis, optionally with inline text input.
     *
     * When axisInputConfig is provided, displays slider label with input field
     * and error message. Otherwise, shows slider with formatted coordinate label.
     * Handles transient/optimistic updates during drag and clears transient flag
     * on drag end.
     *
     * @param axis - "x" or "y"
     * @param point - Point data including display rounding settings
     * @param currentCoordinates - Current displayed slider position
     * @param pointLabelForAria - Accessible label for point
     * @param axisInputConfig - Optional config for inline input mode
     */
    function renderAxisSlider(
        axis: "x" | "y",
        point: (typeof coreControlPoints)[number],
        currentCoordinates: { x: number; y: number },
        pointLabelForAria: string,
        axisInputConfig?: {
            value: string;
            error: string | undefined;
            describedBy: string;
            onChange: (value: string) => void;
            onCommit: (value: string) => Promise<void>;
        },
    ) {
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
            `${axisLabel}: ${formatCoordinateForSlider(value, point)}`
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
                    const transientKey = sliderAxisTransientKey(
                        point.componentIdx,
                        axis,
                    );
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

    // Render one card per controlled point. Card contents vary by graph mode:
    // - all: sliders with inline x/y text boxes
    // - slidersonly: sliders only
    // - inputsonly: text inputs only (pair input for "both")
    const controlsSection = coreControlPoints
        .map((point) => {
            const {
                componentIdx,
                x: defaultX,
                y: defaultY,
                pointNumber,
                label,
                labelHasLatex,
            } = point;
            const pointControlsMode = normalizePointControlsMode(
                point.addControls,
            );
            if (pointControlsMode === "none") {
                return null;
            }

            const currentCoordinates = rendererSliderCoordinates[
                componentIdx
            ] ?? {
                x: defaultX,
                y: defaultY,
            };
            const pointFallbackLabel = `Point ${pointNumber}`;
            const pointLabelForAria = accessibleLabelText({
                label,
                labelHasLatex,
                fallback: pointFallbackLabel,
            });
            const pointLabelForDisplay = label.trim()
                ? renderLabelWithLatex({ label, labelHasLatex })
                : pointFallbackLabel;

            const xInputKey = makeInputKey(componentIdx, "x");
            const yInputKey = makeInputKey(componentIdx, "y");
            const pairInputKey = makeInputKey(componentIdx, "pair");

            const formattedX = formatCoordinateForSlider(
                currentCoordinates.x,
                point,
            );
            const formattedY = formatCoordinateForSlider(
                currentCoordinates.y,
                point,
            );

            const xInputValue = inputDraftByKey[xInputKey] ?? formattedX;
            const yInputValue = inputDraftByKey[yInputKey] ?? formattedY;
            const pairInputValue =
                inputDraftByKey[pairInputKey] ??
                `(${formattedX},${formattedY})`;

            const xInputError = inputErrorByKey[xInputKey];
            const yInputError = inputErrorByKey[yInputKey];
            const pairInputError = inputErrorByKey[pairInputKey];

            const showXAxis = pointControlsMode !== "yonly";
            const showYAxis = pointControlsMode !== "xonly";
            const showAxisInputsInline = graphControlsMode === "all";
            const showSlidersForPoint = includeSliders;
            const showInputsOnlyForPoint =
                graphControlsMode === "inputsonly" && includeInputs;

            const pointHeadingId = `${id}-point-${componentIdx}-heading`;

            return (
                <div
                    key={componentIdx}
                    data-point-slider-card="true"
                    role="group"
                    aria-labelledby={pointHeadingId}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        border: "1px solid var(--canvasText)",
                        borderRadius: "8px",
                    }}
                >
                    <div id={pointHeadingId} style={{ fontWeight: 600 }}>
                        {pointLabelForDisplay}
                    </div>
                    {showInputsOnlyForPoint && pointControlsMode === "both" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                marginTop: "8px",
                            }}
                        >
                            <label htmlFor={`${id}-point-${componentIdx}-pair`}>
                                Coordinates
                            </label>
                            <input
                                id={`${id}-point-${componentIdx}-pair`}
                                type="text"
                                value={pairInputValue}
                                aria-label={`coordinates for ${pointLabelForAria}`}
                                aria-invalid={pairInputError ? true : undefined}
                                aria-describedby={
                                    pairInputError
                                        ? makeErrorId(id, componentIdx, "pair")
                                        : undefined
                                }
                                onChange={(event) => {
                                    setInputDraftValue(
                                        pairInputKey,
                                        event.target.value,
                                    );
                                }}
                                onBlur={(event) => {
                                    submitPairInput({
                                        componentIdx,
                                        rawValue: event.target.value,
                                        currentCoordinates,
                                        inputKey: pairInputKey,
                                    }).catch((error) => {
                                        console.error(
                                            `[graph-controls] failed to commit pair input for component ${componentIdx}`,
                                            error,
                                        );
                                    });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        submitPairInput({
                                            componentIdx,
                                            rawValue: event.currentTarget.value,
                                            currentCoordinates,
                                            inputKey: pairInputKey,
                                        }).catch((error) => {
                                            console.error(
                                                `[graph-controls] failed to commit pair input for component ${componentIdx}`,
                                                error,
                                            );
                                        });
                                    }
                                }}
                            />
                            {pairInputError ? (
                                <span
                                    id={makeErrorId(id, componentIdx, "pair")}
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {pairInputError}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {showInputsOnlyForPoint && pointControlsMode === "xonly" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                marginTop: "8px",
                            }}
                        >
                            <label
                                htmlFor={`${id}-point-${componentIdx}-x-input`}
                            >
                                x
                            </label>
                            <input
                                id={`${id}-point-${componentIdx}-x-input`}
                                type="text"
                                value={xInputValue}
                                aria-label={`x input for ${pointLabelForAria}`}
                                aria-invalid={xInputError ? true : undefined}
                                aria-describedby={
                                    xInputError
                                        ? makeErrorId(id, componentIdx, "x")
                                        : undefined
                                }
                                onChange={(event) => {
                                    setInputDraftValue(
                                        xInputKey,
                                        event.target.value,
                                    );
                                }}
                                onBlur={(event) => {
                                    submitAxisInput({
                                        componentIdx,
                                        axis: "x",
                                        rawValue: event.target.value,
                                        currentCoordinates,
                                        inputKey: xInputKey,
                                    }).catch((error) => {
                                        console.error(
                                            `[graph-controls] failed to commit x input for component ${componentIdx}`,
                                            error,
                                        );
                                    });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        submitAxisInput({
                                            componentIdx,
                                            axis: "x",
                                            rawValue: event.currentTarget.value,
                                            currentCoordinates,
                                            inputKey: xInputKey,
                                        }).catch((error) => {
                                            console.error(
                                                `[graph-controls] failed to commit x input for component ${componentIdx}`,
                                                error,
                                            );
                                        });
                                    }
                                }}
                            />
                            {xInputError ? (
                                <span
                                    id={makeErrorId(id, componentIdx, "x")}
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {xInputError}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {showInputsOnlyForPoint && pointControlsMode === "yonly" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                marginTop: "8px",
                            }}
                        >
                            <label
                                htmlFor={`${id}-point-${componentIdx}-y-input`}
                            >
                                y
                            </label>
                            <input
                                id={`${id}-point-${componentIdx}-y-input`}
                                type="text"
                                value={yInputValue}
                                aria-label={`y input for ${pointLabelForAria}`}
                                aria-invalid={yInputError ? true : undefined}
                                aria-describedby={
                                    yInputError
                                        ? makeErrorId(id, componentIdx, "y")
                                        : undefined
                                }
                                onChange={(event) => {
                                    setInputDraftValue(
                                        yInputKey,
                                        event.target.value,
                                    );
                                }}
                                onBlur={(event) => {
                                    submitAxisInput({
                                        componentIdx,
                                        axis: "y",
                                        rawValue: event.target.value,
                                        currentCoordinates,
                                        inputKey: yInputKey,
                                    }).catch((error) => {
                                        console.error(
                                            `[graph-controls] failed to commit y input for component ${componentIdx}`,
                                            error,
                                        );
                                    });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        submitAxisInput({
                                            componentIdx,
                                            axis: "y",
                                            rawValue: event.currentTarget.value,
                                            currentCoordinates,
                                            inputKey: yInputKey,
                                        }).catch((error) => {
                                            console.error(
                                                `[graph-controls] failed to commit y input for component ${componentIdx}`,
                                                error,
                                            );
                                        });
                                    }
                                }}
                            />
                            {yInputError ? (
                                <span
                                    id={makeErrorId(id, componentIdx, "y")}
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {yInputError}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {showSlidersForPoint && showXAxis
                        ? renderAxisSlider(
                              "x",
                              point,
                              currentCoordinates,
                              pointLabelForAria,
                              showAxisInputsInline
                                  ? {
                                        value: xInputValue,
                                        error: xInputError,
                                        describedBy: makeErrorId(
                                            id,
                                            componentIdx,
                                            "x",
                                        ),
                                        onChange: (value) => {
                                            setInputDraftValue(
                                                xInputKey,
                                                value,
                                            );
                                        },
                                        onCommit: async (value) => {
                                            await submitAxisInput({
                                                componentIdx,
                                                axis: "x",
                                                rawValue: value,
                                                currentCoordinates,
                                                inputKey: xInputKey,
                                            });
                                        },
                                    }
                                  : undefined,
                          )
                        : null}
                    {showSlidersForPoint && showYAxis
                        ? renderAxisSlider(
                              "y",
                              point,
                              currentCoordinates,
                              pointLabelForAria,
                              showAxisInputsInline
                                  ? {
                                        value: yInputValue,
                                        error: yInputError,
                                        describedBy: makeErrorId(
                                            id,
                                            componentIdx,
                                            "y",
                                        ),
                                        onChange: (value) => {
                                            setInputDraftValue(
                                                yInputKey,
                                                value,
                                            );
                                        },
                                        onCommit: async (value) => {
                                            await submitAxisInput({
                                                componentIdx,
                                                axis: "y",
                                                rawValue: value,
                                                currentCoordinates,
                                                inputKey: yInputKey,
                                            });
                                        },
                                    }
                                  : undefined,
                          )
                        : null}
                </div>
            );
        })
        .filter((section): section is React.JSX.Element => Boolean(section));

    if (controlsSection.length === 0) {
        return null;
    }

    return (
        <div id={id} style={{ marginTop: "12px", marginBottom: "12px" }}>
            <div
                role="group"
                aria-label="Point controls"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "100%",
                    minWidth: 0,
                    overflowX: "hidden",
                }}
            >
                {controlsSection}
            </div>
        </div>
    );
});
