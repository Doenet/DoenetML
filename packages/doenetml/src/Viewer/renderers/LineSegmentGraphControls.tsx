import React, { useState } from "react";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import SliderUI from "./utils/SliderUI";
import {
    normalizeGraphControlsMode,
    normalizeLineSegmentControlsMode,
    type GraphControlLineSegment,
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

type LineSegmentGraphControlsProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggableLineSegmentsForControls: GraphControlLineSegment[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

function clampMinMax(min: number, max: number) {
    return { min: Math.min(min, max), max: Math.max(min, max) };
}

export default React.memo(function LineSegmentGraphControls({
    id,
    SVs,
    callAction,
}: LineSegmentGraphControlsProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    const lineSegments = Array.isArray(SVs.draggableLineSegmentsForControls)
        ? SVs.draggableLineSegmentsForControls
        : [];
    if (lineSegments.length === 0) {
        return null;
    }

    const [draftByKey, setDraftByKey] = useState<Record<string, string>>({});
    const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});

    const { min: xMin, max: xMax } = clampMinMax(SVs.xMin, SVs.xMax);
    const { min: yMin, max: yMax } = clampMinMax(SVs.yMin, SVs.yMax);

    async function moveEndpoint({
        lineSegment,
        endpoint,
        x,
        y,
        transient,
    }: {
        lineSegment: GraphControlLineSegment;
        endpoint: 1 | 2;
        x: number;
        y: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: {
                    actionName: "moveLineSegment",
                    componentIdx: lineSegment.componentIdx,
                },
                args: {
                    point1coords: endpoint === 1 ? [x, y] : undefined,
                    point2coords: endpoint === 2 ? [x, y] : undefined,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveLineSegment failed for component ${lineSegment.componentIdx}`,
                error,
            );
        }
    }

    function setDraft(key: string, value: string) {
        setDraftByKey((prev) => ({ ...prev, [key]: value }));
        setErrorByKey((prev) => {
            if (!Object.prototype.hasOwnProperty.call(prev, key)) {
                return prev;
            }
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }

    async function commitNumberInput({
        key,
        rawValue,
        onParsed,
    }: {
        key: string;
        rawValue: string;
        onParsed: (value: number) => Promise<void>;
    }) {
        const parsed = parseSingleMathNumber(rawValue);
        if (parsed === null) {
            setErrorByKey((prev) => ({
                ...prev,
                [key]: "Enter a valid number or numeric expression.",
            }));
            return;
        }

        setErrorByKey((prev) => {
            if (!Object.prototype.hasOwnProperty.call(prev, key)) {
                return prev;
            }
            const next = { ...prev };
            delete next[key];
            return next;
        });

        setDraftByKey((prev) => {
            if (!Object.prototype.hasOwnProperty.call(prev, key)) {
                return prev;
            }
            const next = { ...prev };
            delete next[key];
            return next;
        });

        await onParsed(parsed);
    }

    async function commitPairInput({
        key,
        rawValue,
        onParsed,
    }: {
        key: string;
        rawValue: string;
        onParsed: (value: { x: number; y: number }) => Promise<void>;
    }) {
        const parsed = parseOrderedPair(rawValue);
        if (parsed === null) {
            setErrorByKey((prev) => ({
                ...prev,
                [key]: "Enter an ordered pair like (x,y) with numeric values.",
            }));
            return;
        }

        setErrorByKey((prev) => {
            if (!Object.prototype.hasOwnProperty.call(prev, key)) {
                return prev;
            }
            const next = { ...prev };
            delete next[key];
            return next;
        });

        setDraftByKey((prev) => {
            if (!Object.prototype.hasOwnProperty.call(prev, key)) {
                return prev;
            }
            const next = { ...prev };
            delete next[key];
            return next;
        });

        await onParsed(parsed);
    }

    const cards = lineSegments
        .map((lineSegment) => {
            const mode = normalizeLineSegmentControlsMode(
                lineSegment.addControls,
            );
            if (mode === "none") {
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
            const showInlineInputs = graphControlsMode === "all";

            const endpointConfig = [
                {
                    endpoint: 1 as const,
                    title: "Endpoint 1",
                    coords: lineSegment.endpoint1,
                },
                {
                    endpoint: 2 as const,
                    title: "Endpoint 2",
                    coords: lineSegment.endpoint2,
                },
            ];

            return (
                <div
                    key={lineSegment.componentIdx}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        border: "1px solid var(--canvasText)",
                        borderRadius: "8px",
                    }}
                >
                    <div style={{ fontWeight: 600 }}>{labelForDisplay}</div>

                    {endpointConfig.map(({ endpoint, title, coords }) => {
                        const xKey = `${lineSegment.componentIdx}|${endpoint}|x`;
                        const yKey = `${lineSegment.componentIdx}|${endpoint}|y`;
                        const pairKey = `${lineSegment.componentIdx}|${endpoint}|pair`;

                        const xDisplay = formatCoordinateForControls(
                            coords.x,
                            lineSegment,
                        );
                        const yDisplay = formatCoordinateForControls(
                            coords.y,
                            lineSegment,
                        );
                        const pairDisplay = `(${xDisplay},${yDisplay})`;

                        return (
                            <div
                                key={endpoint}
                                style={{
                                    marginTop: "10px",
                                    borderTop: "1px solid #d0d0d0",
                                    paddingTop: "8px",
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "0.95em",
                                    }}
                                >
                                    {title}
                                </div>

                                {includeInputs &&
                                graphControlsMode === "inputsonly" ? (
                                    <label>
                                        Coordinates
                                        <input
                                            type="text"
                                            value={
                                                draftByKey[pairKey] ??
                                                pairDisplay
                                            }
                                            aria-label={`${title.toLowerCase()} coordinates for ${labelForAria}`}
                                            aria-invalid={
                                                errorByKey[pairKey]
                                                    ? true
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                setDraft(
                                                    pairKey,
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={(e) => {
                                                commitPairInput({
                                                    key: pairKey,
                                                    rawValue: e.target.value,
                                                    onParsed: async (value) => {
                                                        await moveEndpoint({
                                                            lineSegment,
                                                            endpoint,
                                                            x: value.x,
                                                            y: value.y,
                                                            transient: false,
                                                        });
                                                    },
                                                }).catch(() => {});
                                            }}
                                        />
                                    </label>
                                ) : null}

                                {errorByKey[pairKey] ? (
                                    <div
                                        style={{
                                            color: "#b00020",
                                            fontSize: "0.85em",
                                        }}
                                    >
                                        {errorByKey[pairKey]}
                                    </div>
                                ) : null}

                                {includeSliders ? (
                                    <>
                                        <SliderUI
                                            id={`${id}-lineSegment-${lineSegment.componentIdx}-${endpoint}-x`}
                                            label={
                                                showInlineInputs ? (
                                                    <span>
                                                        x:{" "}
                                                        <input
                                                            type="text"
                                                            value={
                                                                draftByKey[
                                                                    xKey
                                                                ] ?? xDisplay
                                                            }
                                                            aria-label={`${title.toLowerCase()} x input for ${labelForAria}`}
                                                            aria-invalid={
                                                                errorByKey[xKey]
                                                                    ? true
                                                                    : undefined
                                                            }
                                                            onChange={(e) =>
                                                                setDraft(
                                                                    xKey,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={(e) => {
                                                                commitNumberInput(
                                                                    {
                                                                        key: xKey,
                                                                        rawValue:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        onParsed:
                                                                            async (
                                                                                value,
                                                                            ) => {
                                                                                await moveEndpoint(
                                                                                    {
                                                                                        lineSegment,
                                                                                        endpoint,
                                                                                        x: value,
                                                                                        y: coords.y,
                                                                                        transient: false,
                                                                                    },
                                                                                );
                                                                            },
                                                                    },
                                                                ).catch(
                                                                    () => {},
                                                                );
                                                            }}
                                                        />
                                                    </span>
                                                ) : (
                                                    `x: ${xDisplay}`
                                                )
                                            }
                                            ariaLabel={`${title.toLowerCase()} x coordinate for ${labelForAria}`}
                                            min={xMin}
                                            max={xMax}
                                            step={
                                                xMax !== xMin
                                                    ? (xMax - xMin) / 100
                                                    : 1
                                            }
                                            value={coords.x}
                                            onChange={(value, transient) => {
                                                moveEndpoint({
                                                    lineSegment,
                                                    endpoint,
                                                    x: value,
                                                    y: coords.y,
                                                    transient,
                                                }).catch(() => {});
                                            }}
                                        />
                                        <SliderUI
                                            id={`${id}-lineSegment-${lineSegment.componentIdx}-${endpoint}-y`}
                                            label={
                                                showInlineInputs ? (
                                                    <span>
                                                        y:{" "}
                                                        <input
                                                            type="text"
                                                            value={
                                                                draftByKey[
                                                                    yKey
                                                                ] ?? yDisplay
                                                            }
                                                            aria-label={`${title.toLowerCase()} y input for ${labelForAria}`}
                                                            aria-invalid={
                                                                errorByKey[yKey]
                                                                    ? true
                                                                    : undefined
                                                            }
                                                            onChange={(e) =>
                                                                setDraft(
                                                                    yKey,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={(e) => {
                                                                commitNumberInput(
                                                                    {
                                                                        key: yKey,
                                                                        rawValue:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        onParsed:
                                                                            async (
                                                                                value,
                                                                            ) => {
                                                                                await moveEndpoint(
                                                                                    {
                                                                                        lineSegment,
                                                                                        endpoint,
                                                                                        x: coords.x,
                                                                                        y: value,
                                                                                        transient: false,
                                                                                    },
                                                                                );
                                                                            },
                                                                    },
                                                                ).catch(
                                                                    () => {},
                                                                );
                                                            }}
                                                        />
                                                    </span>
                                                ) : (
                                                    `y: ${yDisplay}`
                                                )
                                            }
                                            ariaLabel={`${title.toLowerCase()} y coordinate for ${labelForAria}`}
                                            min={yMin}
                                            max={yMax}
                                            step={
                                                yMax !== yMin
                                                    ? (yMax - yMin) / 100
                                                    : 1
                                            }
                                            value={coords.y}
                                            onChange={(value, transient) => {
                                                moveEndpoint({
                                                    lineSegment,
                                                    endpoint,
                                                    x: coords.x,
                                                    y: value,
                                                    transient,
                                                }).catch(() => {});
                                            }}
                                        />
                                    </>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <GraphControlsPanel id={`${id}-lineSegments`}>
            {cards}
        </GraphControlsPanel>
    );
});
