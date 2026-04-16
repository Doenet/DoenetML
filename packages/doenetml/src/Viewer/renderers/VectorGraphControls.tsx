import React, { useState } from "react";
import GraphControlsCommitInput from "./components/graphControls/GraphControlsCommitInput";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import SliderUI from "./utils/SliderUI";
import {
    makeInputErrorId,
    normalizeGraphControlsMode,
    normalizedSliderBounds,
    normalizeVectorControlsMode,
    type GraphControlVector,
} from "./utils/graphControls";
import {
    formatCoordinateForControls,
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

export default React.memo(function VectorGraphControls({
    id,
    SVs,
    callAction,
}: VectorGraphControlsProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    const vectors = Array.isArray(SVs.draggableVectorsForControls)
        ? SVs.draggableVectorsForControls
        : [];
    if (vectors.length === 0) {
        return null;
    }

    const { min: xMin, max: xMax } = normalizedSliderBounds(SVs.xMin, SVs.xMax);
    const { min: yMin, max: yMax } = normalizedSliderBounds(SVs.yMin, SVs.yMax);

    const [draftByKey, setDraftByKey] = useState<Record<string, string>>({});
    const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});

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

    function makeSliderRow({
        id: sliderId,
        label,
        ariaLabel,
        inputKey,
        displayValue,
        min,
        max,
        step,
        value,
        onChange,
    }: {
        id: string;
        label: string;
        ariaLabel: string;
        inputKey: string;
        displayValue: string;
        min: number;
        max: number;
        step: number;
        value: number;
        onChange: (v: number, transient: boolean) => void;
    }) {
        const display = draftByKey[inputKey] ?? displayValue;
        const error = errorByKey[inputKey];
        const errorId = makeInputErrorId(id, "vector", inputKey);
        return (
            <SliderUI
                key={sliderId}
                id={sliderId}
                label={
                    includeInputs ? (
                        <span
                            style={{
                                display: "inline-flex",
                                flexDirection: "column",
                            }}
                        >
                            {label}:{" "}
                            <GraphControlsCommitInput
                                value={draftByKey[inputKey] ?? displayValue}
                                ariaLabel={`${ariaLabel} input`}
                                ariaInvalid={Boolean(error)}
                                ariaDescribedBy={error ? errorId : undefined}
                                onChange={(value) => setDraft(inputKey, value)}
                                onCommit={async (rawValue) => {
                                    commitNumberInput({
                                        key: inputKey,
                                        rawValue,
                                        onParsed: async (parsed) => {
                                            onChange(parsed, false);
                                        },
                                    }).catch(() => {});
                                }}
                                commitErrorContext={`[graph-controls] failed to commit ${inputKey} input`}
                            />
                            {error ? (
                                <span
                                    id={errorId}
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {error}
                                </span>
                            ) : null}
                        </span>
                    ) : (
                        `${label}: ${display}`
                    )
                }
                ariaLabel={ariaLabel}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(v, transient) => onChange(v, transient)}
            />
        );
    }

    function makeInputOnlyRow({
        label,
        ariaLabel,
        inputKey,
        displayValue,
        value,
        onChange,
    }: {
        label: string;
        ariaLabel: string;
        inputKey: string;
        displayValue: string;
        value: number;
        onChange: (v: number) => void;
    }) {
        const error = errorByKey[inputKey];
        const errorId = makeInputErrorId(id, "vector", inputKey);
        return (
            <label key={inputKey}>
                {label}
                <GraphControlsCommitInput
                    value={draftByKey[inputKey] ?? displayValue}
                    ariaLabel={`${ariaLabel} input`}
                    ariaInvalid={Boolean(error)}
                    ariaDescribedBy={error ? errorId : undefined}
                    onChange={(value) => setDraft(inputKey, value)}
                    onCommit={async (rawValue) => {
                        commitNumberInput({
                            key: inputKey,
                            rawValue,
                            onParsed: async (parsed) => {
                                onChange(parsed);
                            },
                        }).catch(() => {});
                    }}
                    commitErrorContext={`[graph-controls] failed to commit ${inputKey} input`}
                />
                {error ? (
                    <span
                        id={errorId}
                        style={{ color: "#b00020", fontSize: "0.85em" }}
                    >
                        {error}
                    </span>
                ) : null}
            </label>
        );
    }

    const cards = vectors
        .map((vector) => {
            const mode = normalizeVectorControlsMode(vector.addControls);
            if (mode === "none") {
                return null;
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
            const xStep = xMax !== xMin ? (xMax - xMin) / 100 : 1;
            const yStep = yMax !== yMin ? (yMax - yMin) / 100 : 1;

            let sliderRows: React.JSX.Element[] = [];
            let inputRows: React.JSX.Element[] = [];

            if (mode === "displacement") {
                const dxKey = `${cIdx}|dx`;
                const dyKey = `${cIdx}|dy`;
                const dxDisplay = formatCoordinateForControls(
                    vector.displacement.x,
                    vector,
                );
                const dyDisplay = formatCoordinateForControls(
                    vector.displacement.y,
                    vector,
                );

                if (includeSliders) {
                    sliderRows.push(
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-dx`,
                            label: "Δx",
                            ariaLabel: `displacement x for ${labelForAria}`,
                            inputKey: dxKey,
                            displayValue: dxDisplay,
                            min: xMin,
                            max: xMax,
                            step: xStep,
                            value: vector.displacement.x,
                            onChange: (v, transient) => {
                                moveDisplacement({
                                    vector,
                                    dx: v,
                                    dy: vector.displacement.y,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-dy`,
                            label: "Δy",
                            ariaLabel: `displacement y for ${labelForAria}`,
                            inputKey: dyKey,
                            displayValue: dyDisplay,
                            min: yMin,
                            max: yMax,
                            step: yStep,
                            value: vector.displacement.y,
                            onChange: (v, transient) => {
                                moveDisplacement({
                                    vector,
                                    dx: vector.displacement.x,
                                    dy: v,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
                if (!includeSliders && includeInputs) {
                    inputRows.push(
                        makeInputOnlyRow({
                            label: "Δx",
                            ariaLabel: `displacement x for ${labelForAria}`,
                            inputKey: dxKey,
                            displayValue: dxDisplay,
                            value: vector.displacement.x,
                            onChange: (v) => {
                                moveDisplacement({
                                    vector,
                                    dx: v,
                                    dy: vector.displacement.y,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                        makeInputOnlyRow({
                            label: "Δy",
                            ariaLabel: `displacement y for ${labelForAria}`,
                            inputKey: dyKey,
                            displayValue: dyDisplay,
                            value: vector.displacement.y,
                            onChange: (v) => {
                                moveDisplacement({
                                    vector,
                                    dx: vector.displacement.x,
                                    dy: v,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
            } else if (mode === "headonly") {
                const hxKey = `${cIdx}|hx`;
                const hyKey = `${cIdx}|hy`;
                const hxDisplay = formatCoordinateForControls(
                    vector.head.x,
                    vector,
                );
                const hyDisplay = formatCoordinateForControls(
                    vector.head.y,
                    vector,
                );

                if (includeSliders) {
                    sliderRows.push(
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-hx`,
                            label: "head x",
                            ariaLabel: `head x for ${labelForAria}`,
                            inputKey: hxKey,
                            displayValue: hxDisplay,
                            min: xMin,
                            max: xMax,
                            step: xStep,
                            value: vector.head.x,
                            onChange: (v, transient) => {
                                moveHead({
                                    vector,
                                    hx: v,
                                    hy: vector.head.y,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-hy`,
                            label: "head y",
                            ariaLabel: `head y for ${labelForAria}`,
                            inputKey: hyKey,
                            displayValue: hyDisplay,
                            min: yMin,
                            max: yMax,
                            step: yStep,
                            value: vector.head.y,
                            onChange: (v, transient) => {
                                moveHead({
                                    vector,
                                    hx: vector.head.x,
                                    hy: v,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
                if (!includeSliders && includeInputs) {
                    inputRows.push(
                        makeInputOnlyRow({
                            label: "head x",
                            ariaLabel: `head x for ${labelForAria}`,
                            inputKey: hxKey,
                            displayValue: hxDisplay,
                            value: vector.head.x,
                            onChange: (v) => {
                                moveHead({
                                    vector,
                                    hx: v,
                                    hy: vector.head.y,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                        makeInputOnlyRow({
                            label: "head y",
                            ariaLabel: `head y for ${labelForAria}`,
                            inputKey: hyKey,
                            displayValue: hyDisplay,
                            value: vector.head.y,
                            onChange: (v) => {
                                moveHead({
                                    vector,
                                    hx: vector.head.x,
                                    hy: v,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
            } else if (mode === "tailonly") {
                const txKey = `${cIdx}|tx`;
                const tyKey = `${cIdx}|ty`;
                const txDisplay = formatCoordinateForControls(
                    vector.tail.x,
                    vector,
                );
                const tyDisplay = formatCoordinateForControls(
                    vector.tail.y,
                    vector,
                );

                if (includeSliders) {
                    sliderRows.push(
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-tx`,
                            label: "tail x",
                            ariaLabel: `tail x for ${labelForAria}`,
                            inputKey: txKey,
                            displayValue: txDisplay,
                            min: xMin,
                            max: xMax,
                            step: xStep,
                            value: vector.tail.x,
                            onChange: (v, transient) => {
                                moveTail({
                                    vector,
                                    tx: v,
                                    ty: vector.tail.y,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-ty`,
                            label: "tail y",
                            ariaLabel: `tail y for ${labelForAria}`,
                            inputKey: tyKey,
                            displayValue: tyDisplay,
                            min: yMin,
                            max: yMax,
                            step: yStep,
                            value: vector.tail.y,
                            onChange: (v, transient) => {
                                moveTail({
                                    vector,
                                    tx: vector.tail.x,
                                    ty: v,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
                if (!includeSliders && includeInputs) {
                    inputRows.push(
                        makeInputOnlyRow({
                            label: "tail x",
                            ariaLabel: `tail x for ${labelForAria}`,
                            inputKey: txKey,
                            displayValue: txDisplay,
                            value: vector.tail.x,
                            onChange: (v) => {
                                moveTail({
                                    vector,
                                    tx: v,
                                    ty: vector.tail.y,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                        makeInputOnlyRow({
                            label: "tail y",
                            ariaLabel: `tail y for ${labelForAria}`,
                            inputKey: tyKey,
                            displayValue: tyDisplay,
                            value: vector.tail.y,
                            onChange: (v) => {
                                moveTail({
                                    vector,
                                    tx: vector.tail.x,
                                    ty: v,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
            } else if (mode === "headandtail") {
                const hxKey = `${cIdx}|hx`;
                const hyKey = `${cIdx}|hy`;
                const txKey = `${cIdx}|tx`;
                const tyKey = `${cIdx}|ty`;
                const hxDisplay = formatCoordinateForControls(
                    vector.head.x,
                    vector,
                );
                const hyDisplay = formatCoordinateForControls(
                    vector.head.y,
                    vector,
                );
                const txDisplay = formatCoordinateForControls(
                    vector.tail.x,
                    vector,
                );
                const tyDisplay = formatCoordinateForControls(
                    vector.tail.y,
                    vector,
                );

                if (includeSliders) {
                    sliderRows.push(
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-hx`,
                            label: "head x",
                            ariaLabel: `head x for ${labelForAria}`,
                            inputKey: hxKey,
                            displayValue: hxDisplay,
                            min: xMin,
                            max: xMax,
                            step: xStep,
                            value: vector.head.x,
                            onChange: (v, transient) => {
                                moveHead({
                                    vector,
                                    hx: v,
                                    hy: vector.head.y,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-hy`,
                            label: "head y",
                            ariaLabel: `head y for ${labelForAria}`,
                            inputKey: hyKey,
                            displayValue: hyDisplay,
                            min: yMin,
                            max: yMax,
                            step: yStep,
                            value: vector.head.y,
                            onChange: (v, transient) => {
                                moveHead({
                                    vector,
                                    hx: vector.head.x,
                                    hy: v,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-tx`,
                            label: "tail x",
                            ariaLabel: `tail x for ${labelForAria}`,
                            inputKey: txKey,
                            displayValue: txDisplay,
                            min: xMin,
                            max: xMax,
                            step: xStep,
                            value: vector.tail.x,
                            onChange: (v, transient) => {
                                moveTail({
                                    vector,
                                    tx: v,
                                    ty: vector.tail.y,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                        makeSliderRow({
                            id: `${id}-vector-${cIdx}-ty`,
                            label: "tail y",
                            ariaLabel: `tail y for ${labelForAria}`,
                            inputKey: tyKey,
                            displayValue: tyDisplay,
                            min: yMin,
                            max: yMax,
                            step: yStep,
                            value: vector.tail.y,
                            onChange: (v, transient) => {
                                moveTail({
                                    vector,
                                    tx: vector.tail.x,
                                    ty: v,
                                    transient,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
                if (!includeSliders && includeInputs) {
                    inputRows.push(
                        makeInputOnlyRow({
                            label: "head x",
                            ariaLabel: `head x for ${labelForAria}`,
                            inputKey: hxKey,
                            displayValue: hxDisplay,
                            value: vector.head.x,
                            onChange: (v) => {
                                moveHead({
                                    vector,
                                    hx: v,
                                    hy: vector.head.y,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                        makeInputOnlyRow({
                            label: "head y",
                            ariaLabel: `head y for ${labelForAria}`,
                            inputKey: hyKey,
                            displayValue: hyDisplay,
                            value: vector.head.y,
                            onChange: (v) => {
                                moveHead({
                                    vector,
                                    hx: vector.head.x,
                                    hy: v,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                        makeInputOnlyRow({
                            label: "tail x",
                            ariaLabel: `tail x for ${labelForAria}`,
                            inputKey: txKey,
                            displayValue: txDisplay,
                            value: vector.tail.x,
                            onChange: (v) => {
                                moveTail({
                                    vector,
                                    tx: v,
                                    ty: vector.tail.y,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                        makeInputOnlyRow({
                            label: "tail y",
                            ariaLabel: `tail y for ${labelForAria}`,
                            inputKey: tyKey,
                            displayValue: tyDisplay,
                            value: vector.tail.y,
                            onChange: (v) => {
                                moveTail({
                                    vector,
                                    tx: vector.tail.x,
                                    ty: v,
                                    transient: false,
                                }).catch(() => {});
                            },
                        }),
                    );
                }
            }

            if (sliderRows.length === 0 && inputRows.length === 0) {
                return null;
            }

            return (
                <div
                    key={vector.componentIdx}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        border: "1px solid var(--canvasText)",
                        borderRadius: "8px",
                    }}
                >
                    <div style={{ fontWeight: 600 }}>{labelForDisplay}</div>
                    {inputRows.length > 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                marginTop: "8px",
                            }}
                        >
                            {inputRows}
                        </div>
                    ) : null}
                    {sliderRows}
                </div>
            );
        })
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
