import React from "react";
import {
    GraphControlAxis,
    GraphControlPoint,
    GraphControlsMode,
    PointControlsMode,
    makeErrorId,
    makeInputKey,
} from "../../utils/graphControls";

type GraphPointControlCardProps = {
    id: string;
    point: GraphControlPoint;
    graphControlsMode: GraphControlsMode;
    includeSliders: boolean;
    includeInputs: boolean;
    pointControlsMode: PointControlsMode;
    currentCoordinates: { x: number; y: number };
    pointLabelForAria: string;
    pointLabelForDisplay: React.ReactNode;
    xInputValue: string;
    yInputValue: string;
    pairInputValue: string;
    xInputError: string | undefined;
    yInputError: string | undefined;
    pairInputError: string | undefined;
    setInputDraftValue: (key: string, value: string) => void;
    submitAxisInput: (args: {
        componentIdx: number;
        axis: GraphControlAxis;
        rawValue: string;
        currentCoordinates: { x: number; y: number };
        inputKey: string;
    }) => Promise<void>;
    submitPairInput: (args: {
        componentIdx: number;
        rawValue: string;
        currentCoordinates: { x: number; y: number };
        inputKey: string;
    }) => Promise<void>;
    renderAxisSlider: (args: {
        axis: GraphControlAxis;
        point: GraphControlPoint;
        currentCoordinates: { x: number; y: number };
        pointLabelForAria: string;
        axisInputConfig?: {
            value: string;
            error: string | undefined;
            describedBy: string;
            onChange: (value: string) => void;
            onCommit: (value: string) => Promise<void>;
        };
    }) => React.ReactElement;
};

export default function GraphPointControlCard({
    id,
    point,
    graphControlsMode,
    includeSliders,
    includeInputs,
    pointControlsMode,
    currentCoordinates,
    pointLabelForAria,
    pointLabelForDisplay,
    xInputValue,
    yInputValue,
    pairInputValue,
    xInputError,
    yInputError,
    pairInputError,
    setInputDraftValue,
    submitAxisInput,
    submitPairInput,
    renderAxisSlider,
}: GraphPointControlCardProps) {
    // Input keys match the shared state-domain convention used by the hook.
    const { componentIdx } = point;
    const xInputKey = makeInputKey(componentIdx, "x");
    const yInputKey = makeInputKey(componentIdx, "y");
    const pairInputKey = makeInputKey(componentIdx, "pair");

    const showXAxis = pointControlsMode !== "yonly";
    const showYAxis = pointControlsMode !== "xonly";
    const showAxisInputsInline = graphControlsMode === "all";
    const showSlidersForPoint = includeSliders;
    const showInputsOnlyForPoint =
        graphControlsMode === "inputsonly" && includeInputs;

    const pointHeadingId = `${id}-point-${componentIdx}-heading`;

    return (
        <div
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
            {/* inputsOnly + both => single ordered-pair editor */}
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

            {/* inputsOnly + xonly/yonly => axis-specific text editor */}
            {showInputsOnlyForPoint && pointControlsMode === "xonly" ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginTop: "8px",
                    }}
                >
                    <label htmlFor={`${id}-point-${componentIdx}-x-input`}>
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
                            setInputDraftValue(xInputKey, event.target.value);
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
                    <label htmlFor={`${id}-point-${componentIdx}-y-input`}>
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
                            setInputDraftValue(yInputKey, event.target.value);
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

            {/* Slider rendering remains mode-gated so selectors/ARIA wiring stay stable. */}
            {showSlidersForPoint && showXAxis
                ? renderAxisSlider({
                      axis: "x",
                      point,
                      currentCoordinates,
                      pointLabelForAria,
                      axisInputConfig: showAxisInputsInline
                          ? {
                                value: xInputValue,
                                error: xInputError,
                                describedBy: makeErrorId(id, componentIdx, "x"),
                                onChange: (value) => {
                                    setInputDraftValue(xInputKey, value);
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
                  })
                : null}
            {showSlidersForPoint && showYAxis
                ? renderAxisSlider({
                      axis: "y",
                      point,
                      currentCoordinates,
                      pointLabelForAria,
                      axisInputConfig: showAxisInputsInline
                          ? {
                                value: yInputValue,
                                error: yInputError,
                                describedBy: makeErrorId(id, componentIdx, "y"),
                                onChange: (value) => {
                                    setInputDraftValue(yInputKey, value);
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
                  })
                : null}
        </div>
    );
}
