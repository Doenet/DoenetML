import React, { useState } from "react";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import SliderUI from "./utils/SliderUI";
import {
    normalizeCircleControlsMode,
    normalizeGraphControlsMode,
    type GraphControlCircle,
} from "./utils/graphControls";
import {
    formatCoordinateForControls,
    parseSingleMathNumber,
} from "./utils/graphControlsMath";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "./utils/labelWithLatex";

type CircleGraphControlsProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggableCirclesForControls: GraphControlCircle[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

function clampMinMax(min: number, max: number) {
    return { min: Math.min(min, max), max: Math.max(min, max) };
}

export default React.memo(function CircleGraphControls({
    id,
    SVs,
    callAction,
}: CircleGraphControlsProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    const circles = Array.isArray(SVs.draggableCirclesForControls)
        ? SVs.draggableCirclesForControls
        : [];
    if (circles.length === 0) {
        return null;
    }

    const [draftByKey, setDraftByKey] = useState<Record<string, string>>({});
    const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});

    async function updateCircle({
        circle,
        center,
        radius,
        transient,
    }: {
        circle: GraphControlCircle;
        center: { x: number; y: number };
        radius: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: {
                    actionName: "moveCircle",
                    componentIdx: circle.componentIdx,
                },
                args: {
                    center: [center.x, center.y],
                    radius,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveCircle failed for component ${circle.componentIdx}`,
                error,
            );
        }
    }

    async function changeCircleRadius({
        circle,
        radius,
        transient,
    }: {
        circle: GraphControlCircle;
        radius: number;
        transient: boolean;
    }) {
        try {
            await callAction({
                action: {
                    actionName: "changeRadius",
                    componentIdx: circle.componentIdx,
                },
                args: {
                    radius,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] changeRadius failed for component ${circle.componentIdx}`,
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

    const { min: xMin, max: xMax } = clampMinMax(SVs.xMin, SVs.xMax);
    const { min: yMin, max: yMax } = clampMinMax(SVs.yMin, SVs.yMax);
    const defaultRadiusMax = Math.max(
        1,
        Math.abs(SVs.xMax - SVs.xMin),
        Math.abs(SVs.yMax - SVs.yMin),
    );

    const cards = circles
        .map((circle) => {
            const mode = normalizeCircleControlsMode(circle.addControls);
            if (mode === "none") {
                return null;
            }

            const fallbackLabel = `Circle ${circle.circleNumber}`;
            const labelForAria = accessibleLabelText({
                label: circle.label,
                labelHasLatex: circle.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = circle.label.trim()
                ? renderLabelWithLatex({
                      label: circle.label,
                      labelHasLatex: circle.labelHasLatex,
                  })
                : fallbackLabel;

            const showCenter = mode === "center" || mode === "centerandradius";
            const showRadius = mode === "radius" || mode === "centerandradius";
            const showInlineInputs = graphControlsMode === "all";

            const xKey = `${circle.componentIdx}|cx`;
            const yKey = `${circle.componentIdx}|cy`;
            const rKey = `${circle.componentIdx}|r`;

            const xDisplay = formatCoordinateForControls(
                circle.center.x,
                circle,
            );
            const yDisplay = formatCoordinateForControls(
                circle.center.y,
                circle,
            );
            const rDisplay = formatCoordinateForControls(circle.radius, circle);

            const radiusMax = Math.max(defaultRadiusMax, circle.radius);
            const radiusStep = radiusMax > 0 ? radiusMax / 100 : 1;

            return (
                <div
                    key={circle.componentIdx}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        border: "1px solid var(--canvasText)",
                        borderRadius: "8px",
                    }}
                >
                    <div style={{ fontWeight: 600 }}>{labelForDisplay}</div>

                    {includeInputs &&
                    graphControlsMode === "inputsonly" &&
                    showCenter ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                marginTop: "8px",
                            }}
                        >
                            <label>
                                x
                                <input
                                    type="text"
                                    value={draftByKey[xKey] ?? xDisplay}
                                    aria-label={`center x input for ${labelForAria}`}
                                    aria-invalid={
                                        errorByKey[xKey] ? true : undefined
                                    }
                                    onChange={(e) =>
                                        setDraft(xKey, e.target.value)
                                    }
                                    onBlur={(e) => {
                                        commitNumberInput({
                                            key: xKey,
                                            rawValue: e.target.value,
                                            onParsed: async (value) => {
                                                await updateCircle({
                                                    circle,
                                                    center: {
                                                        x: value,
                                                        y: circle.center.y,
                                                    },
                                                    radius: circle.radius,
                                                    transient: false,
                                                });
                                            },
                                        }).catch(() => {});
                                    }}
                                />
                            </label>
                            {errorByKey[xKey] ? (
                                <span
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {errorByKey[xKey]}
                                </span>
                            ) : null}
                            <label>
                                y
                                <input
                                    type="text"
                                    value={draftByKey[yKey] ?? yDisplay}
                                    aria-label={`center y input for ${labelForAria}`}
                                    aria-invalid={
                                        errorByKey[yKey] ? true : undefined
                                    }
                                    onChange={(e) =>
                                        setDraft(yKey, e.target.value)
                                    }
                                    onBlur={(e) => {
                                        commitNumberInput({
                                            key: yKey,
                                            rawValue: e.target.value,
                                            onParsed: async (value) => {
                                                await updateCircle({
                                                    circle,
                                                    center: {
                                                        x: circle.center.x,
                                                        y: value,
                                                    },
                                                    radius: circle.radius,
                                                    transient: false,
                                                });
                                            },
                                        }).catch(() => {});
                                    }}
                                />
                            </label>
                            {errorByKey[yKey] ? (
                                <span
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {errorByKey[yKey]}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {includeInputs &&
                    graphControlsMode === "inputsonly" &&
                    showRadius ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                marginTop: "8px",
                            }}
                        >
                            <label>
                                radius
                                <input
                                    type="text"
                                    value={draftByKey[rKey] ?? rDisplay}
                                    aria-label={`radius input for ${labelForAria}`}
                                    aria-invalid={
                                        errorByKey[rKey] ? true : undefined
                                    }
                                    onChange={(e) =>
                                        setDraft(rKey, e.target.value)
                                    }
                                    onBlur={(e) => {
                                        commitNumberInput({
                                            key: rKey,
                                            rawValue: e.target.value,
                                            onParsed: async (value) => {
                                                await changeCircleRadius({
                                                    circle,
                                                    radius: Math.max(0, value),
                                                    transient: false,
                                                });
                                            },
                                        }).catch(() => {});
                                    }}
                                />
                            </label>
                            {errorByKey[rKey] ? (
                                <span
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {errorByKey[rKey]}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {includeSliders && showCenter ? (
                        <>
                            <SliderUI
                                id={`${id}-circle-${circle.componentIdx}-cx`}
                                label={
                                    showInlineInputs ? (
                                        <span>
                                            x:{" "}
                                            <input
                                                type="text"
                                                value={
                                                    draftByKey[xKey] ?? xDisplay
                                                }
                                                aria-label={`center x input for ${labelForAria}`}
                                                aria-invalid={
                                                    errorByKey[xKey]
                                                        ? true
                                                        : undefined
                                                }
                                                onChange={(e) =>
                                                    setDraft(
                                                        xKey,
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={(e) => {
                                                    commitNumberInput({
                                                        key: xKey,
                                                        rawValue:
                                                            e.target.value,
                                                        onParsed: async (
                                                            value,
                                                        ) => {
                                                            await updateCircle({
                                                                circle,
                                                                center: {
                                                                    x: value,
                                                                    y: circle
                                                                        .center
                                                                        .y,
                                                                },
                                                                radius: circle.radius,
                                                                transient: false,
                                                            });
                                                        },
                                                    }).catch(() => {});
                                                }}
                                            />
                                        </span>
                                    ) : (
                                        `x: ${xDisplay}`
                                    )
                                }
                                ariaLabel={`center x coordinate for ${labelForAria}`}
                                min={xMin}
                                max={xMax}
                                step={xMax !== xMin ? (xMax - xMin) / 100 : 1}
                                value={circle.center.x}
                                onChange={(value, transient) => {
                                    updateCircle({
                                        circle,
                                        center: {
                                            x: value,
                                            y: circle.center.y,
                                        },
                                        radius: circle.radius,
                                        transient,
                                    }).catch(() => {});
                                }}
                            />
                            <SliderUI
                                id={`${id}-circle-${circle.componentIdx}-cy`}
                                label={
                                    showInlineInputs ? (
                                        <span>
                                            y:{" "}
                                            <input
                                                type="text"
                                                value={
                                                    draftByKey[yKey] ?? yDisplay
                                                }
                                                aria-label={`center y input for ${labelForAria}`}
                                                aria-invalid={
                                                    errorByKey[yKey]
                                                        ? true
                                                        : undefined
                                                }
                                                onChange={(e) =>
                                                    setDraft(
                                                        yKey,
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={(e) => {
                                                    commitNumberInput({
                                                        key: yKey,
                                                        rawValue:
                                                            e.target.value,
                                                        onParsed: async (
                                                            value,
                                                        ) => {
                                                            await updateCircle({
                                                                circle,
                                                                center: {
                                                                    x: circle
                                                                        .center
                                                                        .x,
                                                                    y: value,
                                                                },
                                                                radius: circle.radius,
                                                                transient: false,
                                                            });
                                                        },
                                                    }).catch(() => {});
                                                }}
                                            />
                                        </span>
                                    ) : (
                                        `y: ${yDisplay}`
                                    )
                                }
                                ariaLabel={`center y coordinate for ${labelForAria}`}
                                min={yMin}
                                max={yMax}
                                step={yMax !== yMin ? (yMax - yMin) / 100 : 1}
                                value={circle.center.y}
                                onChange={(value, transient) => {
                                    updateCircle({
                                        circle,
                                        center: {
                                            x: circle.center.x,
                                            y: value,
                                        },
                                        radius: circle.radius,
                                        transient,
                                    }).catch(() => {});
                                }}
                            />
                        </>
                    ) : null}

                    {includeSliders && showRadius ? (
                        <SliderUI
                            id={`${id}-circle-${circle.componentIdx}-r`}
                            label={
                                showInlineInputs ? (
                                    <span>
                                        radius:{" "}
                                        <input
                                            type="text"
                                            value={draftByKey[rKey] ?? rDisplay}
                                            aria-label={`radius input for ${labelForAria}`}
                                            aria-invalid={
                                                errorByKey[rKey]
                                                    ? true
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                setDraft(rKey, e.target.value)
                                            }
                                            onBlur={(e) => {
                                                commitNumberInput({
                                                    key: rKey,
                                                    rawValue: e.target.value,
                                                    onParsed: async (value) => {
                                                        await updateCircle({
                                                            circle,
                                                            center: circle.center,
                                                            radius: Math.max(
                                                                0,
                                                                value,
                                                            ),
                                                            transient: false,
                                                        });
                                                    },
                                                }).catch(() => {});
                                            }}
                                        />
                                    </span>
                                ) : (
                                    `radius: ${rDisplay}`
                                )
                            }
                            ariaLabel={`radius for ${labelForAria}`}
                            min={0}
                            max={radiusMax}
                            step={radiusStep}
                            value={circle.radius}
                            onChange={(value, transient) => {
                                changeCircleRadius({
                                    circle,
                                    radius: Math.max(0, value),
                                    transient,
                                }).catch(() => {});
                            }}
                        />
                    ) : null}
                </div>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <GraphControlsPanel id={`${id}-circles`}>{cards}</GraphControlsPanel>
    );
});
