import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, POINT_LAYER_OFFSET } from "./graph";
import {
    characterizeOffGraphCircleArc,
    characterizeOffGraphPoint,
} from "./utils/offGraphIndicators";
import {
    LabelPosition,
    adjustPointLabelPosition,
    calculatePointLabelAnchor,
    getEffectiveBoundingBox,
    getGraphCornerWithBuffer,
    normalizePointSize,
    normalizePointStyle,
} from "./utils/graph";
import { DocContext } from "../DocViewer";
import { JXGCircle, JXGPoint } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import {
    resolveLineColor,
    resolveFillColor,
    resolveMarkerColor,
} from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import {
    syncLabelStrokeColor,
    syncLayer,
    syncLineStrokeStyle,
    syncWithLabelToggle,
} from "./utils/jsxgraph";
import { buildFilledShapeAttributes } from "./utils/buildGraphicalAttributes";

interface CircleSVs extends DraggableGraphicalSVs {
    numericalCenter: [number, number];
    numericalRadius: number;
    throughAngles: [number, number];
    filled: boolean;
    hideOffGraphIndicator: boolean;
}

export default React.memo(function Circle(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, callAction } =
        useDoenetRenderer<CircleSVs>(props);

    // @ts-ignore
    Circle.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let circleJXG = useRef<JXGCircle | null>(null);
    let indicatorJXG = useRef<JXGPoint | null>(null);

    const dragState = usePointerDragState();
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown, dragged } =
        dragState;
    let centerAtDown = useRef<[number, number, number] | null>(null);
    let radiusAtDown = useRef<number | null>(null);
    let throughAnglesAtDown = useRef<[number, number] | null>(null);
    let previousWithLabel = useRef<boolean | null>(null);
    let previousPointLabelPosition = useRef<LabelPosition | null>(null);
    let centerCoords = useRef<[number, number] | null>(null);

    let lastCenterFromCore = useRef<number[] | null>(null);
    let throughAnglesFromCore = useRef<[number, number] | null>(null);
    let fixed = useRef(false);
    let fixLocation = useRef(false);

    // for each coordinate, will be -1 or 1 if moved off graph in that direction
    let displayOffGraphIndicator = useRef(false);
    let offGraphIndicatorOrientation = useRef<[number, number] | null>([0, 0]);
    let offGraphIndicatorCoords = useRef<[number, number] | null>([0, 0]);
    let offGraphIndicatorOffsetAtDown = useRef([0, 0]);

    lastCenterFromCore.current = SVs.numericalCenter;
    throughAnglesFromCore.current = SVs.throughAngles;
    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    React.useEffect(() => {
        //On unmount
        return () => {
            if (circleJXG.current) {
                deleteCircleJXG();
            }
        };
    }, []);

    function createCircleJXG() {
        if (board === null) {
            return null;
        }
        if (
            !(
                Number.isFinite(SVs.numericalCenter[0]) &&
                Number.isFinite(SVs.numericalCenter[1]) &&
                SVs.numericalRadius > 0
            )
        ) {
            return null;
        }

        function dispatchMoveCircle(
            args: Omit<
                Record<string, any>,
                "center" | "x" | "y" | "radius" | "throughAngles"
            > = {},
        ) {
            if (
                !centerCoords.current ||
                !Number.isFinite(centerCoords.current[0]) ||
                !Number.isFinite(centerCoords.current[1])
            ) {
                return;
            }

            callAction({
                action: actions.moveCircle,
                args: {
                    center: centerCoords.current,
                    radius: radiusAtDown.current,
                    throughAngles: throughAnglesAtDown.current,
                    ...args,
                },
            });
        }

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);
        const markerColor = resolveMarkerColor(SVs.selectedStyle, darkMode);

        let withlabel = SVs.labelForGraph !== "";

        var jsxCircleAttributes: Record<string, any> =
            buildFilledShapeAttributes({
                SVs,
                layerOffset: LINE_LAYER_OFFSET,
                fixed: fixed.current,
                fixLocation: fixLocation.current,
                darkMode,
            });

        if (!SVs.filled) {
            jsxCircleAttributes.fillColor = "none";
            jsxCircleAttributes.highlightFillColor = "none";
        }
        const fillColor = jsxCircleAttributes.fillColor;

        if (SVs.filled) {
            jsxCircleAttributes.hasInnerPoints = true;
        }

        jsxCircleAttributes.label = {
            highlight: false,
        };
        if (SVs.labelHasLatex) {
            jsxCircleAttributes.label.useMathJax = true;
        }

        if (SVs.labelForGraph !== "") {
            if (SVs.applyStyleToLabel) {
                jsxCircleAttributes.label.strokeColor = lineColor;
            } else {
                jsxCircleAttributes.label.strokeColor = "var(--canvasText)";
            }
        }

        circleJXG.current = board.create(
            "circle",
            [[...SVs.numericalCenter], SVs.numericalRadius],
            jsxCircleAttributes,
        );

        circleJXG.current!.isDraggable = !fixLocation.current;

        let jsxPointAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden && displayOffGraphIndicator.current,
            withlabel,
            fixed: fixed.current,
            layer: 10 * SVs.layer + POINT_LAYER_OFFSET,
            fillColor: markerColor,
            strokeColor: "none",
            strokeOpacity: SVs.selectedStyle.markerOpacity,
            fillOpacity: SVs.selectedStyle.markerOpacity,
            highlightFillColor: "var(--mainGray)",
            highlightStrokeColor: "var(--lightBlue)",
            size: normalizePointSize(
                SVs.selectedStyle.markerSize,
                SVs.selectedStyle.markerStyle,
            ),
            face: normalizePointStyle(
                SVs.selectedStyle.markerStyle,
                offGraphIndicatorOrientation.current!,
            ),
            highlight: !fixLocation.current,
            showinfobox: false,
        };

        if (withlabel) {
            let labelPosition = adjustPointLabelPosition(
                "upperright",
                offGraphIndicatorOrientation.current!,
            );
            previousPointLabelPosition.current = labelPosition;

            let { offset, anchorx, anchory } =
                calculatePointLabelAnchor(labelPosition);
            jsxPointAttributes.label = {
                offset,
                anchorx,
                anchory,
                highlight: false,
            };

            if (SVs.labelHasLatex) {
                jsxPointAttributes.label.useMathJax = true;
            }

            if (SVs.applyStyleToLabel) {
                jsxPointAttributes.label.strokeColor = markerColor;
            } else {
                jsxPointAttributes.label.strokeColor = "var(--canvasText)";
            }
        } else {
            jsxPointAttributes.label = {
                highlight: false,
            };
            if (SVs.labelHasLatex) {
                jsxPointAttributes.label.useMathJax = true;
            }
        }

        indicatorJXG.current = board.create(
            "point",
            [...offGraphIndicatorCoords.current!],
            jsxPointAttributes,
        );

        if (!indicatorJXG.current || !circleJXG.current) {
            return;
        }

        indicatorJXG.current.isDraggable = !fixLocation.current;

        circleJXG.current.on("drag", function (e) {
            let viaPointer = e.type === "pointermove";

            if (exceededDragThreshold(e, pointerAtDown.current)) {
                dragged.current = true;
            }

            if (viaPointer && pointerAtDown.current && centerAtDown.current) {
                // Compute from pointer delta rather than .X()/.Y() directly so
                // the center doesn't snap back to an attractor on slow drags.
                centerCoords.current = pointerEventToUserCoords(
                    e,
                    pointerAtDown.current,
                    centerAtDown.current,
                    board,
                );
            } else {
                centerCoords.current = [
                    circleJXG.current!.center.X(),
                    circleJXG.current!.center.Y(),
                ];
            }

            dispatchMoveCircle({
                transient: true,
                skippable: true,
            });

            circleJXG.current!.center.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                [...lastCenterFromCore.current!],
            );
        });

        circleJXG.current.on("up", function (e) {
            if (dragged.current) {
                dispatchMoveCircle();
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.circleClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
            pointerIsDown.current = false;
        });

        circleJXG.current.on("keyfocusout", function (e) {
            if (dragged.current) {
                dispatchMoveCircle();
                dragged.current = false;
            }
            pointerIsDown.current = false;
        });

        circleJXG.current.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            dragged.current = false;
            pointerAtDown.current = [e.x, e.y];
            centerAtDown.current = [
                ...circleJXG.current!.center.coords.scrCoords,
            ];
            radiusAtDown.current = circleJXG.current!.radius;
            throughAnglesAtDown.current = [...throughAnglesFromCore.current!];
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.circleFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        // hit is called by jsxgraph when focused in via keyboard
        circleJXG.current.on("hit", function (e) {
            dragged.current = false;
            centerAtDown.current = [
                ...circleJXG.current!.center.coords.scrCoords,
            ];
            radiusAtDown.current = circleJXG.current!.radius;
            throughAnglesAtDown.current = [...throughAnglesFromCore.current!];
            callAction({
                action: actions.circleFocused,
                args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
            });
        });

        circleJXG.current.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    dispatchMoveCircle();
                    dragged.current = false;
                }
                callAction({
                    action: actions.circleClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        indicatorJXG.current.on("drag", function (e) {
            if (exceededDragThreshold(e, pointerAtDown.current)) {
                dragged.current = true;
            }

            centerCoords.current = [
                indicatorJXG.current!.X() +
                    offGraphIndicatorOffsetAtDown.current[0],
                indicatorJXG.current!.Y() +
                    offGraphIndicatorOffsetAtDown.current[1],
            ];

            dispatchMoveCircle({
                transient: true,
                skippable: true,
            });
        });

        indicatorJXG.current.on("up", function (e) {
            if (dragged.current) {
                dispatchMoveCircle();
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.circleClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
            pointerIsDown.current = false;
        });

        indicatorJXG.current.on("keyfocusout", function (e) {
            if (dragged.current) {
                dispatchMoveCircle();
                dragged.current = false;
            }
            pointerIsDown.current = false;
        });

        indicatorJXG.current.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            if (
                !centerAtDown.current ||
                !offGraphIndicatorOrientation.current ||
                !radiusAtDown.current ||
                !circleJXG.current
            ) {
                return;
            }
            dragged.current = false;
            pointerAtDown.current = [e.x, e.y];
            centerAtDown.current = [
                ...circleJXG.current.center.coords.scrCoords,
            ];
            radiusAtDown.current = circleJXG.current.radius;
            throughAnglesAtDown.current = [...throughAnglesFromCore.current!];

            let { flippedX, flippedY } = getEffectiveBoundingBox(board);

            let xSign = flippedX ? -1 : 1;
            let ySign = flippedY ? -1 : 1;

            if (
                offGraphIndicatorOrientation.current[0] === 0 ||
                offGraphIndicatorOrientation.current[1] === 0
            ) {
                offGraphIndicatorOffsetAtDown.current = [
                    xSign *
                        offGraphIndicatorOrientation.current[0] *
                        radiusAtDown.current,
                    ySign *
                        offGraphIndicatorOrientation.current[1] *
                        radiusAtDown.current,
                ];
            } else {
                let sqrt2 = Math.sqrt(2);
                offGraphIndicatorOffsetAtDown.current = [
                    (xSign / sqrt2) *
                        offGraphIndicatorOrientation.current[0] *
                        radiusAtDown.current,
                    (ySign / sqrt2) *
                        offGraphIndicatorOrientation.current[1] *
                        radiusAtDown.current,
                ];
            }

            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.circleFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        // hit is called by jsxgraph when focused in via keyboard
        indicatorJXG.current.on("hit", function (e) {
            dragged.current = false;
            centerAtDown.current = [
                ...circleJXG.current!.center.coords.scrCoords,
            ];
            radiusAtDown.current = circleJXG.current!.radius;
            throughAnglesAtDown.current = [
                ...throughAnglesFromCore.current!,
            ] as [number, number];
            callAction({
                action: actions.circleFocused,
                args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
            });
        });

        indicatorJXG.current.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    dispatchMoveCircle();
                    dragged.current = false;
                }
                callAction({
                    action: actions.circleClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        previousWithLabel.current = SVs.labelForGraph !== "";

        return circleJXG.current;
    }

    function deleteCircleJXG() {
        if (!circleJXG.current || !indicatorJXG.current) {
            return;
        }
        indicatorJXG.current.off("drag");
        indicatorJXG.current.off("down");
        indicatorJXG.current.off("up");
        indicatorJXG.current.off("hit");
        indicatorJXG.current.off("keyfocusout");
        indicatorJXG.current.off("keydown");
        board?.removeObject(indicatorJXG.current);
        indicatorJXG.current = null;

        circleJXG.current.off("drag");
        circleJXG.current.off("down");
        circleJXG.current.off("up");
        circleJXG.current.off("hit");
        circleJXG.current.off("keyfocusout");
        circleJXG.current.off("keydown");
        board?.removeObject(circleJXG.current);
        circleJXG.current = null;
    }

    if (board) {
        lastCenterFromCore.current = [...SVs.numericalCenter];

        displayOffGraphIndicator.current = false;
        offGraphIndicatorOrientation.current = [0, 0];
        offGraphIndicatorCoords.current = [0, 0];

        if (!SVs.hideOffGraphIndicator) {
            let centerOffResults = characterizeOffGraphPoint(
                lastCenterFromCore.current,
                board,
            );

            if (centerOffResults.needIndicator) {
                // center is off graph
                if (
                    !offGraphIndicatorCoords.current ||
                    !lastCenterFromCore.current
                ) {
                    return;
                }

                let centerSides = centerOffResults.indicatorSides;
                let { flippedX, flippedY } = getEffectiveBoundingBox(board);
                let xSign = flippedX ? -1 : 1;
                let ySign = flippedY ? -1 : 1;

                if (centerSides[0] === 1) {
                    if (centerSides[1] === 1) {
                        // off to the upper right

                        // first check if lower left point is off graph
                        let lowerLeftPoint = [...lastCenterFromCore.current];
                        lowerLeftPoint[0] -= SVs.numericalRadius * xSign;
                        lowerLeftPoint[1] -= SVs.numericalRadius * ySign;
                        let lowerLeftOffResults = characterizeOffGraphPoint(
                            lowerLeftPoint,
                            board,
                        );

                        if (lowerLeftOffResults.needIndicator) {
                            displayOffGraphIndicator.current = true;
                            offGraphIndicatorOrientation.current = [1, 1];
                            offGraphIndicatorCoords.current =
                                getGraphCornerWithBuffer(board, [1, 1]);
                        } else {
                            // check if a point in lower left quadrant is visible

                            let arcResults = characterizeOffGraphCircleArc({
                                center: SVs.numericalCenter,
                                radius: SVs.numericalRadius,
                                directionToCheck: [1, 1],
                                board,
                            });

                            if (arcResults.needIndicator) {
                                displayOffGraphIndicator.current = true;
                                offGraphIndicatorOrientation.current =
                                    arcResults.indicatorSides!;
                                offGraphIndicatorCoords.current =
                                    arcResults.indicatorCoords!;
                            }
                        }
                    } else if (centerSides[1] === -1) {
                        // off to the lower right

                        // first check if upper left point is off graph
                        let upperLeftPoint = [...lastCenterFromCore.current];
                        upperLeftPoint[0] -= SVs.numericalRadius * xSign;
                        upperLeftPoint[1] += SVs.numericalRadius * ySign;
                        let upperLeftOffResults = characterizeOffGraphPoint(
                            upperLeftPoint,
                            board,
                        );

                        if (upperLeftOffResults.needIndicator) {
                            displayOffGraphIndicator.current = true;
                            offGraphIndicatorOrientation.current = [1, -1];
                            offGraphIndicatorCoords.current =
                                getGraphCornerWithBuffer(board, [1, -1]);
                        } else {
                            // check if a point in upper left quadrant is visible

                            let arcResults = characterizeOffGraphCircleArc({
                                center: SVs.numericalCenter,
                                radius: SVs.numericalRadius,
                                directionToCheck: [1, -1],
                                board,
                            });

                            if (arcResults.needIndicator) {
                                displayOffGraphIndicator.current = true;
                                offGraphIndicatorOrientation.current =
                                    arcResults.indicatorSides!;
                                offGraphIndicatorCoords.current =
                                    arcResults.indicatorCoords!;
                            }
                        }
                    } else {
                        // off to the right
                        // check if left most point is off graph
                        let leftPoint = [...lastCenterFromCore.current];
                        leftPoint[0] -= SVs.numericalRadius * xSign;
                        let leftOffResults = characterizeOffGraphPoint(
                            leftPoint,
                            board,
                        );

                        if (leftOffResults.needIndicator) {
                            displayOffGraphIndicator.current = true;
                            offGraphIndicatorOrientation.current =
                                leftOffResults.indicatorSides;
                            offGraphIndicatorCoords.current =
                                leftOffResults.indicatorCoords;
                        }
                    }
                } else if (centerSides[0] === -1) {
                    if (centerSides[1] === 1) {
                        // off to the upper left

                        // first check if lower right point is off graph
                        let lowerRightPoint = [...lastCenterFromCore.current];
                        lowerRightPoint[0] += SVs.numericalRadius * xSign;
                        lowerRightPoint[1] -= SVs.numericalRadius * ySign;
                        let lowerRightOffResults = characterizeOffGraphPoint(
                            lowerRightPoint,
                            board,
                        );

                        if (lowerRightOffResults.needIndicator) {
                            displayOffGraphIndicator.current = true;
                            offGraphIndicatorOrientation.current = [-1, 1];
                            offGraphIndicatorCoords.current =
                                getGraphCornerWithBuffer(board, [-1, 1]);
                        } else {
                            // check if a point in lower right quadrant is visible

                            let arcResults = characterizeOffGraphCircleArc({
                                center: SVs.numericalCenter,
                                radius: SVs.numericalRadius,
                                directionToCheck: [-1, 1],
                                board,
                            });

                            if (arcResults.needIndicator) {
                                displayOffGraphIndicator.current = true;
                                offGraphIndicatorOrientation.current =
                                    arcResults.indicatorSides!;
                                offGraphIndicatorCoords.current =
                                    arcResults.indicatorCoords!;
                            }
                        }
                    } else if (centerSides[1] === -1) {
                        // off to the lower left

                        // first check if upper right point is off graph
                        let upperRightPoint = [...lastCenterFromCore.current];
                        upperRightPoint[0] += SVs.numericalRadius * xSign;
                        upperRightPoint[1] += SVs.numericalRadius * ySign;
                        let upperRightOffResults = characterizeOffGraphPoint(
                            upperRightPoint,
                            board,
                        );

                        if (upperRightOffResults.needIndicator) {
                            displayOffGraphIndicator.current = true;
                            offGraphIndicatorOrientation.current = [-1, -1];
                            offGraphIndicatorCoords.current =
                                getGraphCornerWithBuffer(board, [-1, -1]);
                        } else {
                            // check if a point in upper right quadrant is visible

                            let arcResults = characterizeOffGraphCircleArc({
                                center: SVs.numericalCenter,
                                radius: SVs.numericalRadius,
                                directionToCheck: [-1, -1],
                                board,
                            });

                            if (arcResults.needIndicator) {
                                displayOffGraphIndicator.current = true;
                                offGraphIndicatorOrientation.current =
                                    arcResults.indicatorSides!;
                                offGraphIndicatorCoords.current =
                                    arcResults.indicatorCoords!;
                            }
                        }
                    } else {
                        // off to the left
                        // check if right most point is off graph
                        let rightPoint = [...lastCenterFromCore.current];
                        rightPoint[0] += SVs.numericalRadius * xSign;
                        let rightOffResults = characterizeOffGraphPoint(
                            rightPoint,
                            board,
                        );

                        if (rightOffResults.needIndicator) {
                            displayOffGraphIndicator.current = true;
                            offGraphIndicatorOrientation.current! =
                                rightOffResults.indicatorSides;
                            offGraphIndicatorCoords.current =
                                rightOffResults.indicatorCoords;
                        }
                    }
                } else if (centerSides[1] === 1) {
                    // off to the top
                    // check if bottom point is off graph
                    let bottomPoint = [...lastCenterFromCore.current];
                    bottomPoint[1] -= SVs.numericalRadius * xSign;
                    let bottomOffResults = characterizeOffGraphPoint(
                        bottomPoint,
                        board,
                    );

                    if (bottomOffResults.needIndicator) {
                        displayOffGraphIndicator.current = true;
                        offGraphIndicatorOrientation.current! =
                            bottomOffResults.indicatorSides;
                        offGraphIndicatorCoords.current =
                            bottomOffResults.indicatorCoords;
                    }
                } else {
                    // off to the bottom
                    // check if top point is off graph
                    let topPoint = [...lastCenterFromCore.current];
                    topPoint[1] += SVs.numericalRadius * xSign;
                    let topOffResults = characterizeOffGraphPoint(
                        topPoint,
                        board,
                    );

                    if (topOffResults.needIndicator) {
                        displayOffGraphIndicator.current = true;
                        offGraphIndicatorOrientation.current! =
                            topOffResults.indicatorSides;
                        offGraphIndicatorCoords.current =
                            topOffResults.indicatorCoords;
                    }
                }
            }
        }

        if (!circleJXG.current) {
            // attempt to create circleJXG.current if it doesn't exist yet

            createCircleJXG();
        } else if (
            !(
                Number.isFinite(SVs.numericalCenter[0]) &&
                Number.isFinite(SVs.numericalCenter[1]) &&
                SVs.numericalRadius > 0
            )
        ) {
            // can't render circle

            deleteCircleJXG();
        } else if (indicatorJXG.current) {
            if (board.updateQuality === board.BOARD_QUALITY_LOW) {
                board.itemsRenderedLowQuality[id] = circleJXG.current as any;
            }

            let validCoords = SVs.numericalCenter.every((x: any) =>
                Number.isFinite(x),
            );

            circleJXG.current.center.coords.setCoordinates(JXG.COORDS_BY_USER, [
                ...SVs.numericalCenter,
            ]);
            circleJXG.current.setRadius(SVs.numericalRadius);

            let visible = !SVs.hidden;

            if (validCoords) {
                circleJXG.current.visProp["visible"] = visible;
                circleJXG.current.visPropCalc["visible"] = visible;
                // circleJXG.current.setAttribute({visible: visible})
            } else {
                circleJXG.current.visProp["visible"] = false;
                circleJXG.current.visPropCalc["visible"] = false;
                // circleJXG.current.setAttribute({visible: false})
            }

            circleJXG.current.visProp.fixed = fixed.current;
            circleJXG.current.visProp.highlight = !fixLocation.current;
            circleJXG.current.isDraggable = !fixLocation.current;

            syncLayer(circleJXG.current, SVs.layer, LINE_LAYER_OFFSET);

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);
            const fillColor = SVs.filled
                ? resolveFillColor(SVs.selectedStyle, darkMode)
                : "none";

            syncLineStrokeStyle(circleJXG.current, {
                lineColor,
                lineWidth: SVs.selectedStyle.lineWidth,
                lineOpacity: SVs.selectedStyle.lineOpacity,
                dash: styleToDash(SVs.selectedStyle.lineStyle),
            });

            if (circleJXG.current.visProp.fillcolor !== fillColor) {
                circleJXG.current.visProp.fillcolor = fillColor;
                circleJXG.current.visProp.highlightfillcolor = fillColor;
                circleJXG.current.visProp.hasinnerpoints = SVs.filled;
            }
            if (
                circleJXG.current.visProp.fillopacity !==
                SVs.selectedStyle.fillOpacity
            ) {
                circleJXG.current.visProp.fillopacity =
                    SVs.selectedStyle.fillOpacity;
                circleJXG.current.visProp.highlightfillopacity =
                    SVs.selectedStyle.fillOpacity * 0.5;
            }

            circleJXG.current.name = SVs.labelForGraph;

            const withlabel = syncWithLabelToggle(
                circleJXG.current,
                SVs.labelForGraph,
                previousWithLabel,
            );

            circleJXG.current.needsUpdate = true;
            circleJXG.current.update();

            if (circleJXG.current.hasLabel && circleJXG.current.label) {
                const label = circleJXG.current.label;
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);
                label.needsUpdate = true;
                label.update();
            }

            let showIndicator = displayOffGraphIndicator.current && !SVs.hidden;

            let actuallyChangedVisibility =
                indicatorJXG.current.visProp["visible"] !== showIndicator;

            indicatorJXG.current.visProp["visible"] = showIndicator;
            indicatorJXG.current.visPropCalc["visible"] = showIndicator;

            if (showIndicator && indicatorJXG.current) {
                indicatorJXG.current.coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    offGraphIndicatorCoords.current,
                );

                syncLayer(indicatorJXG.current, SVs.layer, POINT_LAYER_OFFSET);

                indicatorJXG.current.visProp.highlight = !fixLocation.current;
                indicatorJXG.current.visProp.fixed = fixed.current;
                indicatorJXG.current.isDraggable = !fixLocation.current;

                const markerColor = resolveMarkerColor(
                    SVs.selectedStyle,
                    darkMode,
                );
                if (indicatorJXG.current.visProp.fillcolor !== markerColor) {
                    indicatorJXG.current.visProp.fillcolor = markerColor;
                }
                if (
                    indicatorJXG.current.visProp.strokeopacity !==
                    SVs.selectedStyle.markerOpacity
                ) {
                    indicatorJXG.current.visProp.strokeopacity =
                        SVs.selectedStyle.markerOpacity;
                    indicatorJXG.current.visProp.fillopacity =
                        SVs.selectedStyle.markerOpacity;
                }

                let newFace = normalizePointStyle(
                    SVs.selectedStyle.markerStyle,
                    offGraphIndicatorOrientation.current,
                );
                if (indicatorJXG.current.visProp.face !== newFace) {
                    indicatorJXG.current.setAttribute({ face: newFace });
                }
                let newSize = normalizePointSize(
                    SVs.selectedStyle.markerSize,
                    SVs.selectedStyle.markerStyle,
                );
                if (indicatorJXG.current.visProp.size !== newSize) {
                    indicatorJXG.current.setAttribute({ size: newSize });
                }

                indicatorJXG.current.name = SVs.labelForGraph;

                if (withlabel != previousWithLabel.current) {
                    indicatorJXG.current.setAttribute({ withlabel: withlabel });
                }

                if (
                    indicatorJXG.current.hasLabel &&
                    indicatorJXG.current.label
                ) {
                    const label = indicatorJXG.current.label;
                    label.needsUpdate = true;
                    syncLabelStrokeColor(
                        label,
                        SVs.applyStyleToLabel,
                        markerColor,
                    );

                    let labelPosition = adjustPointLabelPosition(
                        "upperright",
                        offGraphIndicatorOrientation.current,
                    );

                    if (labelPosition !== previousPointLabelPosition.current) {
                        let { offset, anchorx, anchory } =
                            calculatePointLabelAnchor(labelPosition);
                        label.visProp.anchorx = anchorx;
                        label.visProp.anchory = anchory;
                        label.visProp.offset = offset;
                        previousPointLabelPosition.current = labelPosition;
                        label.fullUpdate();
                    } else {
                        label.update();
                    }
                }
            }

            if (showIndicator || actuallyChangedVisibility) {
                // seems to need full update or else indicator doesn't always
                // move when change axis bounds
                indicatorJXG.current.fullUpdate();
            } else {
                indicatorJXG.current.update();
            }
            board.updateRenderer();
        }
    }

    if (SVs.hidden) {
        return null;
    }

    return <span id={id} />;
});
