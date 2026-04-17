import React, { useMemo } from "react";
import GraphControlsCommitInput from "./components/graphControls/GraphControlsCommitInput";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import SliderUI from "./utils/SliderUI";
import {
    makeInputErrorId,
    normalizeGraphControlsMode,
    normalizeLineSegmentControlsMode,
    normalizedSliderBounds,
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
import { useGraphControlsInputState } from "./hooks/useGraphControlsInputState";
import { useLatestControlValues } from "./hooks/useLatestControlValues";

type EndpointValue = { x: number; y: number };

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

    const {
        draftByKey,
        errorByKey,
        setDraft,
        hasDraft,
        isCommitting,
        commitParsedInput,
    } = useGraphControlsInputState();

    const latestEndpointValuesByKey = useMemo(() => {
        const valuesByKey: Record<string, { x: number; y: number }> = {};
        for (const lineSegment of lineSegments) {
            valuesByKey[`${lineSegment.componentIdx}|1`] = {
                x: lineSegment.endpoint1.x,
                y: lineSegment.endpoint1.y,
            };
            valuesByKey[`${lineSegment.componentIdx}|2`] = {
                x: lineSegment.endpoint2.x,
                y: lineSegment.endpoint2.y,
            };
        }
        return valuesByKey;
    }, [lineSegments]);

    const { getLatestValue, setLatestValue } = useLatestControlValues(
        latestEndpointValuesByKey,
    );

    function endpointStateKey(
        lineSegment: GraphControlLineSegment,
        endpoint: 1 | 2,
    ) {
        return `${lineSegment.componentIdx}|${endpoint}`;
    }

    function endpointStateFromCore(
        lineSegment: GraphControlLineSegment,
        endpoint: 1 | 2,
    ): EndpointValue {
        return endpoint === 1 ? lineSegment.endpoint1 : lineSegment.endpoint2;
    }

    function getEndpointState(
        lineSegment: GraphControlLineSegment,
        endpoint: 1 | 2,
    ): EndpointValue {
        return getLatestValue(
            endpointStateKey(lineSegment, endpoint),
            endpointStateFromCore(lineSegment, endpoint),
        );
    }

    function setEndpointState(
        lineSegment: GraphControlLineSegment,
        endpoint: 1 | 2,
        value: EndpointValue,
    ) {
        setLatestValue(endpointStateKey(lineSegment, endpoint), value);
    }

    const { min: xMin, max: xMax } = normalizedSliderBounds(SVs.xMin, SVs.xMax);
    const { min: yMin, max: yMax } = normalizedSliderBounds(SVs.yMin, SVs.yMax);

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

    async function commitPairInput({
        key,
        rawValue,
        currentValue,
        onParsed,
    }: {
        key: string;
        rawValue: string;
        currentValue: { x: number; y: number };
        onParsed: (value: { x: number; y: number }) => Promise<void>;
    }) {
        await commitParsedInput({
            key,
            rawValue,
            parse: parseOrderedPair,
            errorMessage:
                "Enter an ordered pair like (x,y) with numeric values.",
            isUnchanged: (value) =>
                value.x === currentValue.x && value.y === currentValue.y,
            onParsed,
        });
    }

    async function updateEndpointAxis({
        lineSegment,
        endpoint,
        axis,
        value,
        transient,
    }: {
        lineSegment: GraphControlLineSegment;
        endpoint: 1 | 2;
        axis: "x" | "y";
        value: number;
        transient: boolean;
    }) {
        const latest = getEndpointState(lineSegment, endpoint);
        const next = {
            x: axis === "x" ? value : latest.x,
            y: axis === "y" ? value : latest.y,
        };

        setEndpointState(lineSegment, endpoint, next);

        await moveEndpoint({
            lineSegment,
            endpoint,
            x: next.x,
            y: next.y,
            transient,
        });
    }

    async function commitEndpointAxisInput({
        lineSegment,
        endpoint,
        key,
        axis,
        rawValue,
    }: {
        lineSegment: GraphControlLineSegment;
        endpoint: 1 | 2;
        key: string;
        axis: "x" | "y";
        rawValue: string;
    }) {
        const latest = getEndpointState(lineSegment, endpoint);

        await commitNumberInput({
            key,
            rawValue,
            currentValue: axis === "x" ? latest.x : latest.y,
            onParsed: async (value) => {
                await updateEndpointAxis({
                    lineSegment,
                    endpoint,
                    axis,
                    value,
                    transient: false,
                });
            },
        });
    }

    async function commitEndpointPairInput({
        lineSegment,
        endpoint,
        key,
        rawValue,
    }: {
        lineSegment: GraphControlLineSegment;
        endpoint: 1 | 2;
        key: string;
        rawValue: string;
    }) {
        const latest = getEndpointState(lineSegment, endpoint);

        await commitPairInput({
            key,
            rawValue,
            currentValue: latest,
            onParsed: async (value) => {
                setEndpointState(lineSegment, endpoint, value);
                await moveEndpoint({
                    lineSegment,
                    endpoint,
                    x: value.x,
                    y: value.y,
                    transient: false,
                });
            },
        });
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
                        const pairError = errorByKey[pairKey];
                        const pairErrorId = makeInputErrorId(
                            id,
                            "line-segment",
                            pairKey,
                        );
                        const xError = errorByKey[xKey];
                        const xErrorId = makeInputErrorId(
                            id,
                            "line-segment",
                            xKey,
                        );
                        const yError = errorByKey[yKey];
                        const yErrorId = makeInputErrorId(
                            id,
                            "line-segment",
                            yKey,
                        );

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
                                        <GraphControlsCommitInput
                                            value={
                                                draftByKey[pairKey] ??
                                                pairDisplay
                                            }
                                            ariaLabel={`${title.toLowerCase()} coordinates for ${labelForAria}`}
                                            ariaInvalid={Boolean(pairError)}
                                            ariaDescribedBy={
                                                pairError
                                                    ? pairErrorId
                                                    : undefined
                                            }
                                            onChange={(value) =>
                                                setDraft(pairKey, value)
                                            }
                                            onCommit={async (rawValue) => {
                                                await commitEndpointPairInput({
                                                    lineSegment,
                                                    endpoint,
                                                    key: pairKey,
                                                    rawValue,
                                                });
                                            }}
                                            hasDraft={hasDraft(pairKey)}
                                            isCommitting={isCommitting(pairKey)}
                                            commitErrorContext={`[graph-controls] failed to commit ${pairKey} input`}
                                        />
                                    </label>
                                ) : null}

                                {pairError ? (
                                    <div
                                        id={pairErrorId}
                                        style={{
                                            color: "#b00020",
                                            fontSize: "0.85em",
                                        }}
                                    >
                                        {pairError}
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
                                                        <GraphControlsCommitInput
                                                            value={
                                                                draftByKey[
                                                                    xKey
                                                                ] ?? xDisplay
                                                            }
                                                            ariaLabel={`${title.toLowerCase()} x input for ${labelForAria}`}
                                                            ariaInvalid={Boolean(
                                                                xError,
                                                            )}
                                                            ariaDescribedBy={
                                                                xError
                                                                    ? xErrorId
                                                                    : undefined
                                                            }
                                                            onChange={(value) =>
                                                                setDraft(
                                                                    xKey,
                                                                    value,
                                                                )
                                                            }
                                                            onCommit={async (
                                                                rawValue,
                                                            ) => {
                                                                await commitEndpointAxisInput(
                                                                    {
                                                                        lineSegment,
                                                                        endpoint,
                                                                        key: xKey,
                                                                        axis: "x",
                                                                        rawValue,
                                                                    },
                                                                );
                                                            }}
                                                            hasDraft={hasDraft(
                                                                xKey,
                                                            )}
                                                            isCommitting={isCommitting(
                                                                xKey,
                                                            )}
                                                            commitErrorContext={`[graph-controls] failed to commit ${xKey} input`}
                                                        />
                                                        {xError ? (
                                                            <span
                                                                id={xErrorId}
                                                                style={{
                                                                    color: "#b00020",
                                                                    fontSize:
                                                                        "0.85em",
                                                                }}
                                                            >
                                                                {xError}
                                                            </span>
                                                        ) : null}
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
                                                updateEndpointAxis({
                                                    lineSegment,
                                                    endpoint,
                                                    axis: "x",
                                                    value,
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
                                                        <GraphControlsCommitInput
                                                            value={
                                                                draftByKey[
                                                                    yKey
                                                                ] ?? yDisplay
                                                            }
                                                            ariaLabel={`${title.toLowerCase()} y input for ${labelForAria}`}
                                                            ariaInvalid={Boolean(
                                                                yError,
                                                            )}
                                                            ariaDescribedBy={
                                                                yError
                                                                    ? yErrorId
                                                                    : undefined
                                                            }
                                                            onChange={(value) =>
                                                                setDraft(
                                                                    yKey,
                                                                    value,
                                                                )
                                                            }
                                                            onCommit={async (
                                                                rawValue,
                                                            ) => {
                                                                await commitEndpointAxisInput(
                                                                    {
                                                                        lineSegment,
                                                                        endpoint,
                                                                        key: yKey,
                                                                        axis: "y",
                                                                        rawValue,
                                                                    },
                                                                );
                                                            }}
                                                            hasDraft={hasDraft(
                                                                yKey,
                                                            )}
                                                            isCommitting={isCommitting(
                                                                yKey,
                                                            )}
                                                            commitErrorContext={`[graph-controls] failed to commit ${yKey} input`}
                                                        />
                                                        {yError ? (
                                                            <span
                                                                id={yErrorId}
                                                                style={{
                                                                    color: "#b00020",
                                                                    fontSize:
                                                                        "0.85em",
                                                                }}
                                                            >
                                                                {yError}
                                                            </span>
                                                        ) : null}
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
                                                updateEndpointAxis({
                                                    lineSegment,
                                                    endpoint,
                                                    axis: "y",
                                                    value,
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
        <GraphControlsPanel
            id={`${id}-lineSegments`}
            ariaLabel="Line segment controls"
        >
            {cards}
        </GraphControlsPanel>
    );
});
