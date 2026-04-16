import React, { useState } from "react";
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
import {
    commitParsedInput,
    setDraftAndClearError,
} from "./utils/graphControlsInputState";

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

    const [draftByKey, setDraftByKey] = useState<Record<string, string>>({});
    const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});

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

    function setDraft(key: string, value: string) {
        setDraftAndClearError({
            key,
            value,
            setDraftByKey,
            setErrorByKey,
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
        await commitParsedInput({
            key,
            rawValue,
            parse: parseSingleMathNumber,
            errorMessage: "Enter a valid number or numeric expression.",
            setDraftByKey,
            setErrorByKey,
            onParsed,
        });
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
        await commitParsedInput({
            key,
            rawValue,
            parse: parseOrderedPair,
            errorMessage:
                "Enter an ordered pair like (x,y) with numeric values.",
            setDraftByKey,
            setErrorByKey,
            onParsed,
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
                                                commitPairInput({
                                                    key: pairKey,
                                                    rawValue,
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
                                                                commitNumberInput(
                                                                    {
                                                                        key: xKey,
                                                                        rawValue,
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
                                                                commitNumberInput(
                                                                    {
                                                                        key: yKey,
                                                                        rawValue,
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
        <GraphControlsPanel
            id={`${id}-lineSegments`}
            ariaLabel="Line segment controls"
        >
            {cards}
        </GraphControlsPanel>
    );
});
