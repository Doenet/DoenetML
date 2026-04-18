import React, { useMemo } from "react";
import GraphControl from "./components/graphControls/GraphControl";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import PointControl from "./components/graphControls/PointControl";
import { useGraphControlsInputState } from "./hooks/useGraphControlsInputState";
import { useLatestControlValues } from "./hooks/useLatestControlValues";
import {
    makeInputErrorId,
    normalizeGraphControlsMode,
    normalizedSliderBounds,
    normalizeVectorControlsMode,
    type GraphControlVector,
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

type VectorControlState = {
    displacement: { x: number; y: number };
    head: { x: number; y: number };
    tail: { x: number; y: number };
};

type VectorField = "displacement" | "head" | "tail";

type VectorGraphControlsProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggableVectorsForControls: GraphControlVector[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

type VectorPointControlConfig = {
    vector: GraphControlVector;
    field: VectorField;
    sectionHeading?: React.ReactNode;
    sectionHeadingHasDivider?: boolean;
    controlId: string;
    labelForAria: string;
    xInputKey: string;
    yInputKey: string;
    pairInputKey: string;
    xLabel: string;
    yLabel: string;
    xSliderAriaLabel: string;
    ySliderAriaLabel: string;
    xInputAriaLabel: string;
    yInputAriaLabel: string;
};

export default React.memo(function VectorGraphControls({
    id,
    SVs,
    callAction,
}: VectorGraphControlsProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }
    const nonNoneGraphControlsMode = graphControlsMode;

    const vectors = Array.isArray(SVs.draggableVectorsForControls)
        ? SVs.draggableVectorsForControls
        : [];
    if (vectors.length === 0) {
        return null;
    }

    const { min: xMin, max: xMax } = normalizedSliderBounds(SVs.xMin, SVs.xMax);
    const { min: yMin, max: yMax } = normalizedSliderBounds(SVs.yMin, SVs.yMax);
    const xStep = xMax !== xMin ? (xMax - xMin) / 100 : 1;
    const yStep = yMax !== yMin ? (yMax - yMin) / 100 : 1;

    const {
        draftByKey,
        errorByKey,
        setDraft,
        hasDraft,
        isCommitting,
        commitParsedInput,
    } = useGraphControlsInputState();

    const latestVectorValuesByKey = useMemo(() => {
        const valuesByKey: Record<string, VectorControlState> = {};

        for (const vector of vectors) {
            valuesByKey[String(vector.componentIdx)] = {
                displacement: {
                    x: vector.displacement.x,
                    y: vector.displacement.y,
                },
                head: { x: vector.head.x, y: vector.head.y },
                tail: { x: vector.tail.x, y: vector.tail.y },
            };
        }

        return valuesByKey;
    }, [vectors]);

    const { getLatestValue, setLatestValue } = useLatestControlValues(
        latestVectorValuesByKey,
    );

    function vectorStateKey(vector: GraphControlVector) {
        return String(vector.componentIdx);
    }

    function vectorStateFromCore(
        vector: GraphControlVector,
    ): VectorControlState {
        return {
            displacement: {
                x: vector.displacement.x,
                y: vector.displacement.y,
            },
            head: { x: vector.head.x, y: vector.head.y },
            tail: { x: vector.tail.x, y: vector.tail.y },
        };
    }

    function getVectorState(vector: GraphControlVector): VectorControlState {
        return getLatestValue(
            vectorStateKey(vector),
            vectorStateFromCore(vector),
        );
    }

    function setVectorState(
        vector: GraphControlVector,
        state: VectorControlState,
    ) {
        setLatestValue(vectorStateKey(vector), state);
    }

    async function moveDisplacement({
        vector,
        dx,
        dy,
        transient,
    }: {
        vector: GraphControlVector;
        dx: number;
        dy: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: {
                    actionName: "moveVector",
                    componentIdx: vector.componentIdx,
                },
                args: {
                    displacement: [dx, dy],
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveVector failed for component ${vector.componentIdx}`,
                error,
            );
        }
    }

    async function moveHead({
        vector,
        hx,
        hy,
        transient,
    }: {
        vector: GraphControlVector;
        hx: number;
        hy: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: {
                    actionName: "moveVector",
                    componentIdx: vector.componentIdx,
                },
                args: {
                    headcoords: [hx, hy],
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveVector (head) failed for component ${vector.componentIdx}`,
                error,
            );
        }
    }

    async function moveTail({
        vector,
        tx,
        ty,
        transient,
    }: {
        vector: GraphControlVector;
        tx: number;
        ty: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: {
                    actionName: "moveVector",
                    componentIdx: vector.componentIdx,
                },
                args: {
                    tailcoords: [tx, ty],
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveVector (tail) failed for component ${vector.componentIdx}`,
                error,
            );
        }
    }

    async function updateVectorField({
        vector,
        field,
        value,
        transient,
    }: {
        vector: GraphControlVector;
        field: VectorField;
        value: { x: number; y: number };
        transient: boolean;
    }) {
        const latest = getVectorState(vector);

        setVectorState(vector, {
            ...latest,
            [field]: value,
        });

        if (field === "displacement") {
            await moveDisplacement({
                vector,
                dx: value.x,
                dy: value.y,
                transient,
            });
            return;
        }

        if (field === "head") {
            await moveHead({
                vector,
                hx: value.x,
                hy: value.y,
                transient,
            });
            return;
        }

        await moveTail({
            vector,
            tx: value.x,
            ty: value.y,
            transient,
        });
    }

    async function updateVectorFieldAxis({
        vector,
        field,
        axis,
        value,
        transient,
    }: {
        vector: GraphControlVector;
        field: VectorField;
        axis: "x" | "y";
        value: number;
        transient: boolean;
    }) {
        const latest = getVectorState(vector);
        const nextFieldValue = {
            x: axis === "x" ? value : latest[field].x,
            y: axis === "y" ? value : latest[field].y,
        };

        await updateVectorField({
            vector,
            field,
            value: nextFieldValue,
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

    async function commitVectorFieldAxisInput({
        vector,
        key,
        field,
        axis,
        rawValue,
    }: {
        vector: GraphControlVector;
        key: string;
        field: VectorField;
        axis: "x" | "y";
        rawValue: string;
    }) {
        const latest = getVectorState(vector);
        const currentValue = axis === "x" ? latest[field].x : latest[field].y;

        await commitNumberInput({
            key,
            rawValue,
            currentValue,
            onParsed: async (value) => {
                await updateVectorFieldAxis({
                    vector,
                    field,
                    axis,
                    value,
                    transient: false,
                });
            },
        });
    }

    async function commitVectorFieldPairInput({
        vector,
        key,
        field,
        rawValue,
    }: {
        vector: GraphControlVector;
        key: string;
        field: VectorField;
        rawValue: string;
    }) {
        const latest = getVectorState(vector);
        const currentValue = latest[field];

        await commitParsedInput({
            key,
            rawValue,
            parse: parseOrderedPair,
            errorMessage:
                "Enter an ordered pair like (x,y) with numeric values.",
            isUnchanged: (value) => {
                return value.x === currentValue.x && value.y === currentValue.y;
            },
            onParsed: async (value) => {
                await updateVectorField({
                    vector,
                    field,
                    value,
                    transient: false,
                });
            },
        });
    }

    function renderVectorPointControl({
        vector,
        field,
        sectionHeading,
        sectionHeadingHasDivider = true,
        controlId,
        labelForAria,
        xInputKey,
        yInputKey,
        pairInputKey,
        xLabel,
        yLabel,
        xSliderAriaLabel,
        ySliderAriaLabel,
        xInputAriaLabel,
        yInputAriaLabel,
    }: VectorPointControlConfig): React.JSX.Element {
        const currentCoordinates = getVectorState(vector)[field];
        const xDisplay = formatCoordinateForControls(
            currentCoordinates.x,
            vector,
        );
        const yDisplay = formatCoordinateForControls(
            currentCoordinates.y,
            vector,
        );
        const xErrorId = makeInputErrorId(id, "vector", xInputKey);
        const yErrorId = makeInputErrorId(id, "vector", yInputKey);

        return (
            <PointControl
                key={controlId}
                id={id}
                controlId={controlId}
                sectionHeading={sectionHeading}
                sectionHeadingHasDivider={sectionHeadingHasDivider}
                labelForAria={labelForAria}
                graphControlsMode={nonNoneGraphControlsMode}
                controlsMode="both"
                pairInput={{
                    value:
                        draftByKey[pairInputKey] ?? `(${xDisplay},${yDisplay})`,
                    ariaLabel: `coordinates for ${labelForAria}`,
                    error: errorByKey[pairInputKey],
                    errorId: makeInputErrorId(id, "vector", pairInputKey),
                    onDraftChange: (value) => {
                        setDraft(pairInputKey, value);
                    },
                    onCommit: async (rawValue) => {
                        await commitVectorFieldPairInput({
                            vector,
                            key: pairInputKey,
                            field,
                            rawValue,
                        });
                    },
                    hasDraft: hasDraft(pairInputKey),
                    isCommitting: isCommitting(pairInputKey),
                    commitErrorContext: `[graph-controls] failed to commit ${pairInputKey} input`,
                }}
                axisControls={{
                    x: {
                        label: xLabel,
                        sliderAriaLabel: xSliderAriaLabel,
                        displayValue: xDisplay,
                        min: xMin,
                        max: xMax,
                        step: xStep,
                        value: currentCoordinates.x,
                        onSliderChange: (nextValue, transient) => {
                            updateVectorFieldAxis({
                                vector,
                                field,
                                axis: "x",
                                value: nextValue,
                                transient,
                            }).catch(() => {});
                        },
                        input: {
                            value: draftByKey[xInputKey] ?? xDisplay,
                            ariaLabel: xInputAriaLabel,
                            error: errorByKey[xInputKey],
                            errorId: xErrorId,
                            onDraftChange: (value) => {
                                setDraft(xInputKey, value);
                            },
                            onCommit: async (rawValue) => {
                                await commitVectorFieldAxisInput({
                                    vector,
                                    key: xInputKey,
                                    field,
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
                        label: yLabel,
                        sliderAriaLabel: ySliderAriaLabel,
                        displayValue: yDisplay,
                        min: yMin,
                        max: yMax,
                        step: yStep,
                        value: currentCoordinates.y,
                        onSliderChange: (nextValue, transient) => {
                            updateVectorFieldAxis({
                                vector,
                                field,
                                axis: "y",
                                value: nextValue,
                                transient,
                            }).catch(() => {});
                        },
                        input: {
                            value: draftByKey[yInputKey] ?? yDisplay,
                            ariaLabel: yInputAriaLabel,
                            error: errorByKey[yInputKey],
                            errorId: yErrorId,
                            onDraftChange: (value) => {
                                setDraft(yInputKey, value);
                            },
                            onCommit: async (rawValue) => {
                                await commitVectorFieldAxisInput({
                                    vector,
                                    key: yInputKey,
                                    field,
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

    const cards = vectors
        .reduce<React.JSX.Element[]>((acc, vector) => {
            const mode = normalizeVectorControlsMode(vector.addControls);
            if (mode === "none") {
                return acc;
            }

            const fallbackLabel = `Vector ${vector.vectorNumber}`;
            const labelForAria = accessibleLabelText({
                label: vector.label,
                labelHasLatex: vector.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = vector.label.trim()
                ? renderLabelWithLatex({
                      label: vector.label,
                      labelHasLatex: vector.labelHasLatex,
                  })
                : fallbackLabel;

            const cIdx = vector.componentIdx;

            if (mode === "displacement") {
                acc.push(
                    <GraphControl
                        key={`${cIdx}-displacement`}
                        id={`${id}-vector-${cIdx}`}
                        headingId={`${id}-vector-${cIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        {renderVectorPointControl({
                            vector,
                            field: "displacement",
                            controlId: `vector-${cIdx}-displacement`,
                            labelForAria: `displacement for ${labelForAria}`,
                            xInputKey: `${cIdx}|dx`,
                            yInputKey: `${cIdx}|dy`,
                            pairInputKey: `${cIdx}|dpair`,
                            xLabel: "Δx",
                            yLabel: "Δy",
                            xSliderAriaLabel: `displacement x for ${labelForAria}`,
                            ySliderAriaLabel: `displacement y for ${labelForAria}`,
                            xInputAriaLabel: `displacement x for ${labelForAria} input`,
                            yInputAriaLabel: `displacement y for ${labelForAria} input`,
                        })}
                    </GraphControl>,
                );
                return acc;
            }

            if (mode === "headonly") {
                acc.push(
                    <GraphControl
                        key={`${cIdx}-head`}
                        id={`${id}-vector-${cIdx}`}
                        headingId={`${id}-vector-${cIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        {renderVectorPointControl({
                            vector,
                            field: "head",
                            controlId: `vector-${cIdx}-head`,
                            labelForAria: `head for ${labelForAria}`,
                            xInputKey: `${cIdx}|hx`,
                            yInputKey: `${cIdx}|hy`,
                            pairInputKey: `${cIdx}|hpair`,
                            xLabel: "head x",
                            yLabel: "head y",
                            xSliderAriaLabel: `head x for ${labelForAria}`,
                            ySliderAriaLabel: `head y for ${labelForAria}`,
                            xInputAriaLabel: `head x for ${labelForAria} input`,
                            yInputAriaLabel: `head y for ${labelForAria} input`,
                        })}
                    </GraphControl>,
                );
                return acc;
            }

            if (mode === "tailonly") {
                acc.push(
                    <GraphControl
                        key={`${cIdx}-tail`}
                        id={`${id}-vector-${cIdx}`}
                        headingId={`${id}-vector-${cIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        {renderVectorPointControl({
                            vector,
                            field: "tail",
                            controlId: `vector-${cIdx}-tail`,
                            labelForAria: `tail for ${labelForAria}`,
                            xInputKey: `${cIdx}|tx`,
                            yInputKey: `${cIdx}|ty`,
                            pairInputKey: `${cIdx}|tpair`,
                            xLabel: "tail x",
                            yLabel: "tail y",
                            xSliderAriaLabel: `tail x for ${labelForAria}`,
                            ySliderAriaLabel: `tail y for ${labelForAria}`,
                            xInputAriaLabel: `tail x for ${labelForAria} input`,
                            yInputAriaLabel: `tail y for ${labelForAria} input`,
                        })}
                    </GraphControl>,
                );
                return acc;
            }

            if (mode === "headandtail") {
                acc.push(
                    <GraphControl
                        key={`${cIdx}-headandtail`}
                        id={`${id}-vector-${cIdx}`}
                        headingId={`${id}-vector-${cIdx}-heading`}
                        heading={labelForDisplay}
                    >
                        {renderVectorPointControl({
                            vector,
                            field: "head",
                            sectionHeading: "Head",
                            sectionHeadingHasDivider: false,
                            controlId: `vector-${cIdx}-head`,
                            labelForAria: `head for ${labelForAria}`,
                            xInputKey: `${cIdx}|hx`,
                            yInputKey: `${cIdx}|hy`,
                            pairInputKey: `${cIdx}|hpair`,
                            xLabel: "head x",
                            yLabel: "head y",
                            xSliderAriaLabel: `head x for ${labelForAria}`,
                            ySliderAriaLabel: `head y for ${labelForAria}`,
                            xInputAriaLabel: `head x for ${labelForAria} input`,
                            yInputAriaLabel: `head y for ${labelForAria} input`,
                        })}
                        {renderVectorPointControl({
                            vector,
                            field: "tail",
                            sectionHeading: "Tail",
                            sectionHeadingHasDivider: true,
                            controlId: `vector-${cIdx}-tail`,
                            labelForAria: `tail for ${labelForAria}`,
                            xInputKey: `${cIdx}|tx`,
                            yInputKey: `${cIdx}|ty`,
                            pairInputKey: `${cIdx}|tpair`,
                            xLabel: "tail x",
                            yLabel: "tail y",
                            xSliderAriaLabel: `tail x for ${labelForAria}`,
                            ySliderAriaLabel: `tail y for ${labelForAria}`,
                            xInputAriaLabel: `tail x for ${labelForAria} input`,
                            yInputAriaLabel: `tail y for ${labelForAria} input`,
                        })}
                    </GraphControl>,
                );
                return acc;
            }

            return acc;
        }, [])
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <GraphControlsPanel id={`${id}-vectors`} ariaLabel="Vector controls">
            {cards}
        </GraphControlsPanel>
    );
});
