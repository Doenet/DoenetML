import React, { useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { ActionButton } from "@doenet/ui-components";
import { ActionButtonGroup } from "@doenet/ui-components";
import { ToggleButton } from "@doenet/ui-components";
import { ToggleButtonGroup } from "@doenet/ui-components";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { useT } from "../../utils/i18n";
import { LTR_ISLAND_PROPS } from "./utils/direction";
import "./subsetOfRealsInput.css";

interface PointDisplayed {
    value: number;
    inSubset: boolean;
}

interface IntervalDisplayed {
    left: number;
    right: number;
    inSubset: boolean;
}

interface SubsetOfRealsInputSVs {
    [key: string]: any;
    hidden: boolean;
    fixed: boolean;
    pointsDisplayed: PointDisplayed[];
    intervalsDisplayed: IntervalDisplayed[];
}

export default React.memo(function subsetOfReals(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } =
        useDoenetRenderer<SubsetOfRealsInputSVs>(props, false);
    let [mode, setMode] = useState("add remove points");
    const t = useT();
    let bounds = useRef<HTMLDivElement | null>(null);
    let pointGrabbed = useRef<number | null>(null);

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    function handleTogglePoints(val: number) {
        // setTogglePoints(val);
        if (val === 0) {
            setMode("add remove points");
        } else if (val === 1) {
            setMode("toggle");
        } else if (val === 2) {
            setMode("move points");
        }
    }

    let controlButtons = null;
    if (!SVs.fixed) {
        controlButtons = (
            <>
                <ToggleButtonGroup onClick={handleTogglePoints}>
                    <ToggleButton
                        value={t(
                            "subset-add-remove-points",
                            undefined,
                            "Add/Remove points",
                        )}
                    ></ToggleButton>
                    <ToggleButton
                        value={t(
                            "subset-toggle-points-intervals",
                            undefined,
                            "Toggle points and intervals",
                        )}
                    ></ToggleButton>
                    <ToggleButton
                        value={t(
                            "subset-move-points",
                            undefined,
                            "Move Points",
                        )}
                    ></ToggleButton>
                </ToggleButtonGroup>
                <ActionButtonGroup>
                    <ActionButton
                        onClick={() =>
                            callAction({
                                action: actions.clear,
                            })
                        }
                        value={t("subset-clear", undefined, "Clear")}
                    ></ActionButton>
                    <ActionButton
                        onClick={() =>
                            callAction({
                                action: actions.setToR,
                            })
                        }
                        /* TODO: change the "R" to be the real numbers symbol, similar to the syntax below */
                        // value={<MathJax.Node inline formula={'a_b'} />}
                        value="R"
                    ></ActionButton>
                </ActionButtonGroup>
            </>
        );
    }

    // Build axis
    let firstHashXPosition = 40;
    let xBetweenHashes = 36;
    let hashLines = [];
    let numbers = [];

    for (let number = -10; number <= 10; number++) {
        numbers.push(number);
    }

    let labels = [];

    for (let x = firstHashXPosition; x < 780; x = x + xBetweenHashes) {
        hashLines.push(
            <line
                key={"hash" + x}
                x1={x}
                y1="35"
                x2={x}
                y2="45"
                style={{ stroke: "var(--canvasText)", strokeWidth: "1" }}
                shapeRendering="geometricPrecision"
            />,
        );
        let number = numbers.shift();

        labels.push(
            <text
                key={"label" + x}
                x={x}
                y="66"
                textAnchor="middle"
                className="text-no-select"
            >
                {number}
            </text>,
        );
    }

    // Build points
    let storedPoints = [];

    for (let pt of SVs.pointsDisplayed) {
        let closed = pt.inSubset;

        let xPosition = xValueToXPosition(pt.value);

        let currentFillColor = "var(--mainPurple)"; // New CSS variable color
        if (!closed) {
            currentFillColor = "var(--canvas)";
        }

        let key = `point-${xPosition}`;

        storedPoints.push(
            <circle
                key={key}
                cx={xPosition}
                cy="40"
                r="6"
                stroke="var(--mainPurple)"
                strokeWidth="1"
                fill={currentFillColor}
            />,
        );
    }

    // Build lines
    let storedLines = [];
    for (let intervalObj of SVs.intervalsDisplayed) {
        if (intervalObj.right < intervalObj.left || !intervalObj.inSubset) {
            continue;
        } // Ignore impossible Intervals
        let lowerXPosition = xValueToXPosition(intervalObj.left);
        let higherXPosition = xValueToXPosition(intervalObj.right);
        const lowerPointKey = `lowerIntervalPoint${lowerXPosition}`;
        const higherPointKey = `higherIntervalPoint${higherXPosition}`;
        const lineKey = `line${lowerXPosition}-${higherXPosition}`;

        let currentFillColor = "var(--mainPurple)";

        let lowerLine = lowerXPosition;
        let higherLine = higherXPosition;

        if (lowerXPosition < 38) {
            lowerLine = 20;
            storedPoints.push(
                <polygon
                    key={lowerPointKey}
                    points="5,40 20,50 20,30"
                    style={{
                        fill: currentFillColor,
                        stroke: currentFillColor,
                        strokeWidth: "1",
                    }}
                />,
            );
        }

        if (higherXPosition > 778) {
            higherLine = 782;
            storedPoints.push(
                <polygon
                    key={higherPointKey}
                    points="795,40 780,50 780,30"
                    style={{
                        fill: currentFillColor,
                        stroke: currentFillColor,
                        strokeWidth: "1",
                    }}
                />,
            );
        }
        storedLines.push(
            <line
                key={lineKey}
                x1={lowerLine}
                y1="40"
                x2={higherLine}
                y2="40"
                style={{ stroke: currentFillColor, strokeWidth: "8" }}
            />,
        );
    }

    function xValueToXPosition(xValue: number) {
        // let minValue = -10;
        // let maxValue = 10;
        // Shift to positive numbers
        // TODO: Calculate shiftAmount and intervalValueWidth
        let shiftAmount = 10;
        let intervalValueWidth = 1;
        let shiftedXValue = xValue + shiftAmount;

        let position =
            firstHashXPosition +
            (shiftedXValue / intervalValueWidth) * xBetweenHashes;

        return position;
    }

    function xPositionToXValue(xPosition: number) {
        let relativeX = xPosition - firstHashXPosition;
        let shiftAmount = 10;
        let intervalValueWidth = 1;
        let value = (relativeX / xBetweenHashes) * intervalValueWidth;
        value = value - shiftAmount;

        return value;
    }

    async function handleInput(e: React.MouseEvent, inputState: string) {
        let mouseLeft = e.clientX - (bounds.current?.offsetLeft ?? 0);
        let xPosition = xPositionToXValue(mouseLeft);
        let pointHitTolerance = 0.2;

        if (inputState === "up") {
            if (mode === "move points") {
                if (pointGrabbed.current !== null) {
                    callAction({
                        action: actions.movePoint,
                        args: {
                            pointInd: pointGrabbed.current,
                            value: xPosition,
                            transient: false,
                        },
                    });
                }
            }
            if (mode === "add remove points") {
                if (pointGrabbed.current !== null) {
                    callAction({
                        action: actions.deletePoint,
                        args: { pointInd: pointGrabbed.current },
                    });
                } else if (
                    !SVs.pointsDisplayed.map((x) => x.value).includes(xPosition)
                ) {
                    callAction({
                        action: actions.addPoint,
                        args: { value: xPosition },
                    });
                }
            } else if (mode === "toggle") {
                if (pointGrabbed.current !== null) {
                    callAction({
                        action: actions.togglePoint,
                        args: { pointInd: pointGrabbed.current },
                    });
                } else {
                    let intervalInd = 0;
                    for (let pt of SVs.pointsDisplayed) {
                        if (pt.value < xPosition) {
                            intervalInd++;
                        }
                    }
                    callAction({
                        action: actions.toggleInterval,
                        args: { intervalInd },
                    });
                }
            }
            pointGrabbed.current = null;
        } else if (inputState === "down") {
            let pointInd = null;
            for (let [ind, pt] of SVs.pointsDisplayed.entries()) {
                if (Math.abs(pt.value - xPosition) < pointHitTolerance) {
                    pointInd = ind;
                    break;
                }
            }

            if (pointInd !== null) {
                pointGrabbed.current = pointInd;
            } else {
                pointGrabbed.current = null;
            }
        } else if (inputState === "move") {
            if (mode === "move points" && pointGrabbed.current !== null) {
                callAction({
                    action: actions.movePoint,
                    args: {
                        pointInd: pointGrabbed.current,
                        value: xPosition,
                        transient: true,
                    },
                });
            }
        } else if (inputState == "leave") {
            if (mode === "move points") {
                if (pointGrabbed.current !== null) {
                    callAction({
                        action: actions.movePoint,
                        args: {
                            pointInd: pointGrabbed.current,
                            value: xPosition,
                            transient: false,
                        },
                    });

                    pointGrabbed.current = null;
                }
            }
        }
    }

    return (
        // A number line runs from −10 on the left to 10 on the right in every
        // language: it is mathematical notation, not prose. Everything under
        // here assumes that — the hash marks are laid out at fixed pixel
        // offsets, the arrowheads are hard-coded left and right, and the
        // pointer handler maps an x position to a value by subtracting a left
        // edge. Pinned as one attribute on the whole widget so the controls
        // above the axis stay on the same side as the axis itself.
        <div ref={ref} id={id} {...LTR_ISLAND_PROPS}>
            <div ref={bounds} style={{ display: "flex", gap: "12px" }}>
                {controlButtons}
            </div>
            <svg
                width="808"
                height="80"
                style={{ backgroundColor: "var(--canvas)" }}
                onMouseDown={(e) => {
                    handleInput(e, "down");
                }}
                onMouseUp={(e) => {
                    handleInput(e, "up");
                }}
                onMouseMove={(e) => {
                    handleInput(e, "move");
                }}
                onMouseLeave={(e) => {
                    handleInput(e, "leave");
                }}
            >
                <polygon
                    points="5,40 20,50 20,30"
                    style={{
                        fill: "var(--canvasText)",
                        stroke: "var(--canvasText)",
                        strokeWidth: "1",
                    }}
                />
                <polygon
                    points="795,40 780,50 780,30"
                    style={{
                        fill: "var(--canvasText)",
                        stroke: "var(--canvasText)",
                        strokeWidth: "1",
                    }}
                />
                {storedLines}
                {hashLines}
                <line
                    x1="20"
                    y1="40"
                    x2="780"
                    y2="40"
                    style={{ stroke: "var(--canvasText)", strokeWidth: "2" }}
                />
                {storedPoints}
                {labels}
            </svg>
        </div>
    );
});
