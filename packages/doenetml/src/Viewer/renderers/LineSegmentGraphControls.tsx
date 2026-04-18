import React, { useMemo } from "react";
import GraphControl from "./components/graphControls/GraphControl";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import PointControl from "./components/graphControls/PointControl";
import { useGraphControlsInputState } from "./hooks/useGraphControlsInputState";
import { useLatestControlValues } from "./hooks/useLatestControlValues";
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

type EndpointControlConfig = {
    lineSegment: GraphControlLineSegment;
    endpoint: 1 | 2;
    sectionHeading: React.ReactNode;
    sectionHeadingHasDivider?: boolean;
    labelForAria: string;
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
    const nonNoneGraphControlsMode = graphControlsMode;


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
        const valuesByKey: Record<string, EndpointValue> = {};
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

    const { min: xMin, max: xMax } = normalizedSliderBounds(SVs.xMin, SVs.xMax);
    const { min: yMin, max: yMax } = normalizedSliderBounds(SVs.yMin, SVs.yMax);
    const xStep = xMax !== xMin ? (xMax - xMin) / 100 : 1;
    const yStep = yMax !== yMin ? (yMax - yMin) / 100 : 1;

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

    function renderEndpointControl({
        lineSegment,
        endpoint,
        sectionHeading,
        sectionHeadingHasDivider = true,
        labelForAria,
    }: EndpointControlConfig): React.JSX.Element {
        const cIdx = lineSegment.componentIdx;
        const xKey = `${cIdx}|${endpoint}|x`;
        const yKey = `${cIdx}|${endpoint}|y`;
        const pairKey = `${cIdx}|${endpoint}|pair`;

        const endpointLabel = `endpoint ${endpoint}`;
        const currentCoordinates = getEndpointState(lineSegment, endpoint);
        const xDisplay = formatCoordinateForControls(
            currentCoordinates.x,
            lineSegment,
        );
        const yDisplay = formatCoordinateForControls(
            currentCoordinates.y,
            lineSegment,
        );
        const pairDisplay = `(${xDisplay},${yDisplay})`;

        const xErrorId = makeInputErrorId(id, "line-segment", xKey);
        const yErrorId = makeInputErrorId(id, "line-segment", yKey);

        const endpointXInputAriaLabel = `${endpointLabel} x input for ${labelForAria}`;
        const endpointYInputAriaLabel = `${endpointLabel} y input for ${labelForAria}`;

        return (
            <PointControl
                key={`${cIdx}-${endpoint}`}
                id={id}
                controlId={`lineSegment-${cIdx}-${endpoint}`}
                sectionHeading={sectionHeading}
                sectionHeadingHasDivider={sectionHeadingHasDivider}
                labelForAria={`${endpointLabel} for ${labelForAria}`}
                graphControlsMode={nonNoneGraphControlsMode}
                controlsMode="both"
                pairInput={{
                    value: draftByKey[pairKey] ?? pairDisplay,
                    ariaLabel: `coordinates for endpoint ${endpoint} for ${labelForAria}`,
                    error: errorByKey[pairKey],
                    errorId: makeInputErrorId(id, "line-segment", pairKey),
                    onDraftChange: (value) => {
                        setDraft(pairKey, value);
                    },
                    onCommit: async (rawValue) => {
                        await commitEndpointPairInput({
                            lineSegment,
                            endpoint,
                            key: pairKey,
                            rawValue,
                        });
                    },
                    hasDraft: hasDraft(pairKey),
                    isCommitting: isCommitting(pairKey),
                    commitErrorContext: `[graph-controls] failed to commit ${pairKey} input`,
                }}
                axisControls={{
                    x: {
                        label: "x",
                        sliderAriaLabel: `${endpointLabel} x coordinate for ${labelForAria}`,
                        displayValue: xDisplay,
                        min: xMin,
                        max: xMax,
                        step: xStep,
                        value: currentCoordinates.x,
                        onSliderChange: (nextValue, transient) => {
                            updateEndpointAxis({
                                lineSegment,
                                endpoint,
                                axis: "x",
                                value: nextValue,
                                transient,
                            }).catch(() => {});
                        },
                        input: {
                            value: draftByKey[xKey] ?? xDisplay,
                            ariaLabel: endpointXInputAriaLabel,
                            error: errorByKey[xKey],
                            errorId: xErrorId,
                            onDraftChange: (value) => {
                                setDraft(xKey, value);
                            },
                            onCommit: async (rawValue) => {
                                await commitEndpointAxisInput({
                                    lineSegment,
                                    endpoint,
                                    key: xKey,
                                    axis: "x",
                                    rawValue,
                                });
                            },
                            hasDraft: hasDraft(xKey),
                            isCommitting: isCommitting(xKey),
                            commitErrorContext: `[graph-controls] failed to commit ${xKey} input`,
                        },
                    },
                    y: {
                        label: "y",
                        sliderAriaLabel: `${endpointLabel} y coordinate for ${labelForAria}`,
                        displayValue: yDisplay,
                        min: yMin,
                        max: yMax,
                        step: yStep,
                        value: currentCoordinates.y,
                        onSliderChange: (nextValue, transient) => {
                            updateEndpointAxis({
                                lineSegment,
                                endpoint,
                                axis: "y",
                                value: nextValue,
                                transient,
                            }).catch(() => {});
                        },
                        input: {
                            value: draftByKey[yKey] ?? yDisplay,
                            ariaLabel: endpointYInputAriaLabel,
                            error: errorByKey[yKey],
                            errorId: yErrorId,
                            onDraftChange: (value) => {
                                setDraft(yKey, value);
                            },
                            onCommit: async (rawValue) => {
                                await commitEndpointAxisInput({
                                    lineSegment,
                                    endpoint,
                                    key: yKey,
                                    axis: "y",
                                    rawValue,
                                });
                            },
                            hasDraft: hasDraft(yKey),
                            isCommitting: isCommitting(yKey),
                            commitErrorContext: `[graph-controls] failed to commit ${yKey} input`,
                        },
                    },
                }}
            />
        );
    }

    const cards = lineSegments
        .reduce<React.JSX.Element[]>((acc, lineSegment) => {
            const mode = normalizeLineSegmentControlsMode(
                lineSegment.addControls,
            );
            if (mode === "none") {
                return acc;
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

            acc.push(
                <GraphControl
                    key={lineSegment.componentIdx}
                    id={`${id}-lineSegment-${lineSegment.componentIdx}`}
                    headingId={`${id}-lineSegment-${lineSegment.componentIdx}-heading`}
                    heading={labelForDisplay}
                >
                    {renderEndpointControl({
                        lineSegment,
                        endpoint: 1,
                        sectionHeading: "Endpoint 1",
                        sectionHeadingHasDivider: false,
                        labelForAria,
                    })}
                    {renderEndpointControl({
                        lineSegment,
                        endpoint: 2,
                        sectionHeading: "Endpoint 2",
                        sectionHeadingHasDivider: true,
                        labelForAria,
                    })}
                </GraphControl>,
            );

            return acc;
        }, [])
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
