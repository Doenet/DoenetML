import React, { useContext, useRef } from "react";
import { createFunctionFromDefinition } from "@doenet/utils";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import {
    BoardContext,
    CONTROL_POINT_LAYER_OFFSET,
    LINE_LAYER_OFFSET,
    VERTEX_LAYER_OFFSET,
} from "./graph";
import { DocContext } from "../DocViewer";
import { JXGCurve, JXGLine, JXGPoint } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { syncLabelStrokeColor, syncLayer } from "./utils/jsxgraph";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";

interface CurveSVs extends DraggableGraphicalSVs {
    curveType: "function" | "parameterization" | "bezier";
    fDefinitions: any[];
    parMin: number;
    parMax: number;
    flipFunction: boolean;
    graphXmin: number;
    graphXmax: number;
    graphYmin: number;
    graphYmax: number;
    dashed: boolean;
    switchable: boolean;
    numericalThroughPoints: [number, number][];
    numericalControlPoints: [number, number][][];
    vectorControlDirections: any[];
    bezierControlsAlwaysVisible: boolean;
    showCoordsWhenDragging: boolean;
    hiddenControls: any[];
    extrapolateBackward: boolean;
    extrapolateForward: boolean;
}

export default React.memo(function Curve(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, sourceOfUpdate, callAction } =
        useDoenetRenderer<CurveSVs>(props);

    // @ts-ignore
    Curve.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let curveJXG = useRef<JXGCurve | null>(null);
    let throughPointsJXG = useRef<JXGPoint[] | null>(null);
    let controlPointsJXG = useRef<JXGPoint[][] | null>(null);

    let previousCurveType = useRef<string | null>(null);
    let draggedControlPoint = useRef<any>(null);
    let draggedThroughPoint = useRef<number | null>(null);
    const dragState = usePointerDragState();
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown } = dragState;
    let previousFlipFunction = useRef<boolean | null>(null);
    let segmentAttributes = useRef<Record<string, any> | null>(null);
    let throughPointAttributes = useRef<Record<string, any> | null>(null);
    let throughPointAlwaysVisible = useRef<Record<string, any> | null>(null);
    let throughPointHoverVisible = useRef<Record<string, any> | null>(null);
    let controlPointAttributes = useRef<Record<string, any> | null>(null);
    let previousNumberOfPoints = useRef<number | null>(null);
    let segmentsJXG = useRef<JXGLine[][]>([]);
    let vectorControlsVisible = useRef<any>(null);
    let hitObject = useRef<any>(null);
    let vectorControlDirections = useRef<any[] | null>(null);
    let previousVectorControlDirections = useRef<any[] | null>(null);
    const {
        lastPositionFromCore: lastThroughPointPositionsFromCore,
        fixed,
        fixLocation,
    } = useDraggableRefs<[number, number][]>(SVs, SVs.numericalThroughPoints);
    let switchable = useRef(false);

    let tpCoords = useRef<any[]>([]);
    let cvCoords = useRef<any[]>([]);

    switchable.current = SVs.switchable && !SVs.fixed;

    vectorControlDirections.current = SVs.vectorControlDirections;

    let lastControlPointPositionsFromCore = useRef<[number, number][][] | null>(
        null,
    );
    lastControlPointPositionsFromCore.current = SVs.numericalControlPoints;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    useJSXGraphCleanup({
        objectRef: curveJXG,
        destroy: () => deleteCurveJXG(),
    });

    function createCurveJXG() {
        if (board === null) {
            return null;
        }

        if (
            SVs.curveType === "bezier" &&
            SVs.numericalThroughPoints.length < 2
        ) {
            return null;
        }

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

        var curveAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden,
            withLabel: SVs.labelForGraph !== "",
            fixed: fixed.current,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            strokeColor: lineColor,
            strokeOpacity: SVs.selectedStyle.lineOpacity,
            strokeWidth: SVs.selectedStyle.lineWidth,
            dash: styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed),
            highlight: false,
            lineCap: "butt",
        };

        if (SVs.labelForGraph !== "") {
            let anchorx, offset, position;
            if (SVs.labelPosition === "upperright") {
                position = "urt";
                offset = [-5, -10];
                anchorx = "right";
            } else if (SVs.labelPosition === "upperleft") {
                position = "ulft";
                offset = [5, -10];
                anchorx = "left";
            } else if (SVs.labelPosition === "lowerright") {
                position = "lrt";
                offset = [-5, 10];
                anchorx = "right";
            } else if (SVs.labelPosition === "lowerleft") {
                position = "llft";
                offset = [5, 10];
                anchorx = "left";
            } else if (SVs.labelPosition === "top") {
                position = "top";
                offset = [0, -10];
                anchorx = "left";
            } else if (SVs.labelPosition === "bottom") {
                position = "bot";
                offset = [0, 10];
                anchorx = "left";
            } else if (SVs.labelPosition === "left") {
                position = "lft";
                offset = [10, 0];
                anchorx = "left";
            } else {
                // right
                position = "rt";
                offset = [-10, 0];
                anchorx = "right";
            }

            curveAttributes.label = {
                offset,
                position,
                anchorx,
                highlight: false,
            };

            if (SVs.labelHasLatex) {
                curveAttributes.label.useMathJax = true;
            }

            if (SVs.applyStyleToLabel) {
                curveAttributes.label.strokeColor = lineColor;
            } else {
                curveAttributes.label.strokeColor = "var(canvasText)";
            }
        } else {
            curveAttributes.label = {
                highlight: false,
            };
            if (SVs.labelHasLatex) {
                curveAttributes.label.useMathJax = true;
            }
        }

        let newCurveJXG;

        if (SVs.curveType === "parameterization") {
            let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
            let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);

            newCurveJXG = board!.create(
                "curve",
                [f1, f2, SVs.parMin, SVs.parMax],
                curveAttributes,
            );
        } else if (SVs.curveType === "bezier") {
            let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
            let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);
            newCurveJXG = board!.create(
                "curve",
                [f1, f2, SVs.parMin, SVs.parMax],
                curveAttributes,
            );
        } else {
            let f = createFunctionFromDefinition(SVs.fDefinitions[0]);
            if (SVs.flipFunction) {
                let yMin = SVs.graphYmin;
                let yMax = SVs.graphYmax;
                let minForF = Math.max(yMin - (yMax - yMin) * 0.1, SVs.parMin);
                let maxForF = Math.min(yMax + (yMax - yMin) * 0.1, SVs.parMax);
                newCurveJXG = board!.create(
                    "curve",
                    [f, (x: number) => x, minForF, maxForF],
                    curveAttributes,
                );
            } else {
                let xMin = SVs.graphXmin;
                let xMax = SVs.graphXmax;
                let minForF = Math.max(xMin - (xMax - xMin) * 0.1, SVs.parMin);
                let maxForF = Math.min(xMax + (xMax - xMin) * 0.1, SVs.parMax);
                newCurveJXG = board!.create(
                    "functiongraph",
                    [f, minForF, maxForF],
                    curveAttributes,
                );
            }
            previousFlipFunction.current = SVs.flipFunction;
        }

        previousCurveType.current = SVs.curveType;

        draggedControlPoint.current = null;
        draggedThroughPoint.current = null;

        newCurveJXG.isDraggable = false;

        newCurveJXG.on("up", function (e: any) {
            if (!pointerMovedSinceDown.current && !fixed.current) {
                if (switchable.current) {
                    callAction({
                        action: actions.switchCurve,
                    });
                }
                callAction({
                    action: actions.curveClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
            pointerIsDown.current = false;
        });

        newCurveJXG.on("keydown", function (e: any) {
            if (e.key === "Enter") {
                if (switchable.current) {
                    callAction({
                        action: actions.switchCurve,
                    });
                }
                callAction({
                    action: actions.curveClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        if (SVs.curveType === "bezier") {
            board!.on("up", upBoard);

            newCurveJXG.on("down", (e: any) => {
                (document.activeElement as HTMLElement | null)?.blur();

                pointerAtDown.current = [e.x, e.y];
                pointerIsDown.current = true;
                pointerMovedSinceDown.current = false;
                downOther();

                if (!fixed.current) {
                    callAction({
                        action: actions.curveFocused,
                        args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                    });
                }
            });

            newCurveJXG.on("hit", function (e: any) {
                downOther();

                callAction({
                    action: actions.curveFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            });

            segmentAttributes.current = {
                visible: false,
                withLabel: false,
                fixed: true,
                strokeColor: "#404040",
                highlightStrokeColor: "#404040",
                layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
                strokeWidth: 1,
                highlightStrokeWidth: 1,
            };
            throughPointAttributes.current = {
                visible: !SVs.hidden,
                withLabel: false,
                fixed: false,
                fillColor: "none",
                strokeColor: "none",
                highlightFillColor: "#404040",
                highlightStrokeColor: "#404040",
                strokeWidth: 1,
                highlightStrokeWidth: 1,
                layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
                size: 3,
                showInfoBox: SVs.showCoordsWhenDragging,
            };
            throughPointAlwaysVisible.current = {
                fillcolor: "#404040",
                strokecolor: "#404040",
            };
            throughPointHoverVisible.current = {
                fillcolor: "none",
                strokecolor: "none",
            };

            controlPointAttributes.current = {
                visible: false,
                withLabel: false,
                fixed: false,
                fillColor: "#404040",
                strokeColor: "#404040",
                highlightFillColor: "#404040",
                highlightStrokeColor: "#404040",
                strokeWidth: 1,
                highlightStrokeWidth: 1,
                layer: 10 * SVs.layer + CONTROL_POINT_LAYER_OFFSET,
                size: 2,
                showInfoBox: SVs.showCoordsWhenDragging,
            };

            if (!fixLocation.current) {
                createControls();

                if (SVs.bezierControlsAlwaysVisible) {
                    makeThroughPointsAlwaysVisible();
                    showAllControls();
                }

                board!.updateRenderer();

                previousNumberOfPoints.current! =
                    SVs.numericalThroughPoints.length;
                previousVectorControlDirections.current = [
                    ...SVs.vectorControlDirections,
                ];
            }
        } else {
            newCurveJXG.on("down", function (e: any) {
                (document.activeElement as HTMLElement | null)?.blur();

                pointerAtDown.current = [e.x, e.y];
                pointerIsDown.current = true;
                pointerMovedSinceDown.current = false;

                if (!fixed.current) {
                    callAction({
                        action: actions.curveFocused,
                        args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                    });
                }
            });

            newCurveJXG.on("hit", function (e: any) {
                callAction({
                    action: actions.curveFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            });
        }

        return newCurveJXG;
    }

    function deleteCurveJXG() {
        board!.off("up", upBoard);
        curveJXG.current!.off("down");
        curveJXG.current!.off("up");
        curveJXG.current!.off("keydown");
        board?.removeObject(curveJXG.current);
        curveJXG.current = null;
        deleteControls();
    }

    function createControls() {
        throughPointsJXG.current = [];
        controlPointsJXG.current = [];
        segmentsJXG.current = [];

        for (let i = 0; i < SVs.numericalThroughPoints.length; i++) {
            // middle through points have two controls
            let tp = board!.create(
                "point",
                [...SVs.numericalThroughPoints[i]],
                throughPointAttributes.current,
            );
            throughPointsJXG.current!.push(tp);
            let cp1 = board!.create(
                "point",
                [...SVs.numericalControlPoints[i][0]],
                controlPointAttributes.current,
            );
            let cp2 = board!.create(
                "point",
                [...SVs.numericalControlPoints[i][1]],
                controlPointAttributes.current,
            );
            controlPointsJXG.current!.push([cp1, cp2]);
            let seg1 = board!.create(
                "segment",
                [tp, cp1],
                segmentAttributes.current,
            );
            let seg2 = board!.create(
                "segment",
                [tp, cp2],
                segmentAttributes.current,
            );
            segmentsJXG.current!.push([seg1, seg2]);
            tp.on("drag", (e: any) => dragThroughPoint(i));
            tp.on("down", (e: any) => downThroughPoint(i, e));
            tp.on("hit", (e: any) => downThroughPoint(i, e));
            tp.on("up", (e: any) => upThroughPoint(i));
            tp.on("keyfocusout", (e: any) => upThroughPoint(i));
            cp1.on("drag", (e: any) => dragControlPoint(i, 0));
            cp2.on("drag", (e: any) => dragControlPoint(i, 1));
            cp1.on("down", downOther);
            cp2.on("down", downOther);
            seg1.on("down", downOther);
            seg2.on("down", downOther);
            cp1.on("up", (e: any) => upControlPoint(i, 0));
            cp2.on("up", (e: any) => upControlPoint(i, 1));
        }

        vectorControlsVisible.current = [];
    }

    function deleteControls() {
        if (segmentsJXG.current!.length > 0) {
            segmentsJXG.current!.forEach((x) =>
                x.forEach((y) => {
                    if (y) {
                        y.off("down");
                        board?.removeObject(y);
                    }
                }),
            );
            segmentsJXG.current = [];
            controlPointsJXG.current!.forEach((x) =>
                x.forEach((y) => {
                    if (y) {
                        y.off("drag");
                        y.off("down");
                        y.off("up");
                        board?.removeObject(y);
                    }
                }),
            );
            controlPointsJXG.current = [];
            throughPointsJXG.current!.forEach((x) => {
                x.off("drag");
                x.off("down");
                x.off("hit");
                x.off("up");
                x.off("keyfocusout");
                board?.removeObject(x);
            });
            throughPointsJXG.current = [];
        }
    }

    function downThroughPoint(i: number, e: any) {
        (document.activeElement as HTMLElement | null)?.blur();

        // console.log(`down through point: ${i}`)

        // also called when navigate to point using keyboard
        if (fixLocation.current) {
            return;
        }

        draggedThroughPoint.current = null;
        draggedControlPoint.current = null;

        let viaPointer = e.type === "pointerdown";

        hitObject.current = viaPointer;

        makeThroughPointsAlwaysVisible();
        makeVectorControlVisible(i);
        board!.updateRenderer();
    }

    function dragThroughPoint(i: number) {
        draggedThroughPoint.current = i;

        tpCoords.current[i] = [
            throughPointsJXG.current![i].X(),
            throughPointsJXG.current![i].Y(),
        ];

        callAction({
            action: actions.moveThroughPoint,
            args: {
                throughPoint: tpCoords.current[i],
                throughPointInd: i,
                transient: true,
                skippable: true,
            },
        });

        throughPointsJXG.current![i].coords.setCoordinates(
            JXG.COORDS_BY_USER,
            lastThroughPointPositionsFromCore.current![i],
        );
        board!.updateInfobox(throughPointsJXG.current![i]);
    }

    function upThroughPoint(i: number) {
        // also called when navigate away from point using keyboard

        if (draggedThroughPoint.current !== i) {
            return;
        }

        callAction({
            action: actions.moveThroughPoint,
            args: {
                throughPoint: tpCoords.current[i],
                throughPointInd: i,
            },
        });
    }

    function dragControlPoint(point: any, i: number) {
        // console.log(`drag control point ${point}, ${i}`)

        draggedControlPoint.current = point + "_" + i;

        if (!cvCoords.current[point]) {
            cvCoords.current[point] = {};
        }

        cvCoords.current[point][i] = [
            controlPointsJXG.current![point][i].X() -
                throughPointsJXG.current![point].X(),
            controlPointsJXG.current![point][i].Y() -
                throughPointsJXG.current![point].Y(),
        ];

        callAction({
            action: actions.moveControlVector,
            args: {
                controlVector: cvCoords.current[point][i],
                controlVectorInds: [point, i],
                transient: true,
                skippable: true,
            },
        });

        controlPointsJXG.current![point][i].coords.setCoordinates(
            JXG.COORDS_BY_USER,
            [...lastControlPointPositionsFromCore.current![point][i]],
        );
        board!.updateInfobox(controlPointsJXG.current![point][i]);
    }

    function upControlPoint(point: any, i: number) {
        // console.log(`up control point ${point}, ${i}`)

        if (draggedControlPoint.current !== point + "_" + i) {
            return;
        }

        callAction({
            action: actions.moveControlVector,
            args: {
                controlVector: cvCoords.current[point][i],
                controlVectorInds: [point, i],
            },
        });
    }

    function makeThroughPointsAlwaysVisible() {
        for (let point of throughPointsJXG.current!) {
            for (let attribute in throughPointAlwaysVisible.current) {
                point.visProp[attribute] =
                    throughPointAlwaysVisible.current[attribute];
            }
            point.needsUpdate = true;
            point.update();
        }
    }

    function makeThroughPointsHoverVisible() {
        for (let point of throughPointsJXG.current!) {
            for (let attribute in throughPointHoverVisible.current) {
                point.visProp[attribute] =
                    throughPointHoverVisible.current[attribute];
            }
            point.needsUpdate = true;
            point.update();
        }
    }

    function hideAllControls() {
        for (let controlPair of controlPointsJXG.current!) {
            for (let cp of controlPair) {
                if (cp) {
                    cp.visProp.visible = false;
                    cp.needsUpdate = true;
                    cp.update();
                }
            }
        }
        for (let segmentPair of segmentsJXG.current) {
            for (let seg of segmentPair) {
                if (seg) {
                    seg.visProp.visible = false;
                    seg.needsUpdate = true;
                    seg.update();
                }
            }
        }
        vectorControlsVisible.current = [];
    }

    function showAllControls() {
        for (let ind in controlPointsJXG.current) {
            makeVectorControlVisible(Number(ind));
        }
    }

    function upBoard() {
        if (fixLocation.current) {
            return;
        }
        if (hitObject.current !== true && !SVs.bezierControlsAlwaysVisible) {
            makeThroughPointsHoverVisible();
            hideAllControls();
            board!.updateRenderer();
        }
        hitObject.current = false;
    }

    function makeVectorControlVisible(i: number) {
        if (!SVs.hiddenControls[i]) {
            if (controlPointsJXG.current![i][0]) {
                let isVisible =
                    (i > 0 || SVs.extrapolateBackward) &&
                    ["symmetric", "both", "previous"].includes(
                        vectorControlDirections.current![i],
                    );
                controlPointsJXG.current![i][0].visProp.visible = isVisible;
                controlPointsJXG.current![i][0].visPropCalc.visible = isVisible;
                controlPointsJXG.current![i][0].needsUpdate = true;
                controlPointsJXG.current![i][0].update();
                segmentsJXG.current![i][0].visProp.visible = isVisible;
                segmentsJXG.current![i][0].visPropCalc.visible = isVisible;
                segmentsJXG.current![i][0].needsUpdate = true;
                segmentsJXG.current![i][0].update();
            }

            if (controlPointsJXG.current![i][1]) {
                let isVisible =
                    (i < throughPointsJXG.current!.length - 1 ||
                        SVs.extrapolateForward) &&
                    ["symmetric", "both", "next"].includes(
                        vectorControlDirections.current![i],
                    );
                controlPointsJXG.current![i][1].visProp.visible = isVisible;
                controlPointsJXG.current![i][1].visPropCalc.visible = isVisible;
                controlPointsJXG.current![i][1].needsUpdate = true;
                controlPointsJXG.current![i][1].update();
                segmentsJXG.current![i][1].visProp.visible = isVisible;
                segmentsJXG.current![i][1].visPropCalc.visible = isVisible;
                segmentsJXG.current![i][1].needsUpdate = true;
                segmentsJXG.current![i][1].update();
            }

            vectorControlsVisible.current[i] = true;
        }
    }

    function downOther() {
        if (fixLocation.current) {
            return;
        }

        draggedThroughPoint.current = null;
        draggedControlPoint.current = null;

        hitObject.current = true;

        makeThroughPointsAlwaysVisible();
        board!.updateRenderer();
    }

    if (board) {
        if (!curveJXG.current) {
            // attempt to create curveJXG.current if it doesn't exist yet

            curveJXG.current = createCurveJXG();
        } else if (
            SVs.curveType === "bezier" &&
            SVs.numericalThroughPoints.length < 2
        ) {
            deleteCurveJXG();
        } else if (
            previousCurveType.current !== SVs.curveType ||
            (previousCurveType.current === "function" &&
                previousFlipFunction.current !== SVs.flipFunction)
        ) {
            // if curve type changed or if flip of function changed
            // delete and recreate curve

            deleteCurveJXG();
            curveJXG.current = createCurveJXG();

            if (board.updateQuality === board.BOARD_QUALITY_LOW) {
                board.itemsRenderedLowQuality[id] = curveJXG.current as any;
            }
        } else {
            if (board.updateQuality === board.BOARD_QUALITY_LOW) {
                board.itemsRenderedLowQuality[id] = curveJXG.current as any;
            }

            let visible = !SVs.hidden;

            curveJXG.current!.name = SVs.labelForGraph;

            curveJXG.current!.visProp["visible"] = visible;
            curveJXG.current!.visPropCalc["visible"] = visible;

            let segmentLayer, throughPointLayer, controlPointLayer;
            let layerChanged = syncLayer(
                curveJXG.current!,
                SVs.layer,
                LINE_LAYER_OFFSET,
            );

            if (layerChanged && SVs.curveType === "bezier") {
                segmentLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
                throughPointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
                controlPointLayer = 10 * SVs.layer + CONTROL_POINT_LAYER_OFFSET;
                segmentAttributes.current!.layer = segmentLayer;
                throughPointAttributes.current!.layer = throughPointLayer;
                controlPointAttributes.current!.layer = controlPointLayer;
            }

            let lineColor =
                darkMode === "dark"
                    ? SVs.selectedStyle.lineColorDarkMode
                    : SVs.selectedStyle.lineColor;

            if (curveJXG.current!.visProp.strokecolor !== lineColor) {
                curveJXG.current!.visProp.strokecolor = lineColor;
                curveJXG.current!.visProp.highlightstrokecolor = lineColor;
            }
            if (
                curveJXG.current!.visProp.strokeopacity !==
                SVs.selectedStyle.lineOpacity
            ) {
                curveJXG.current!.visProp.strokeopacity =
                    SVs.selectedStyle.lineOpacity;
            }
            let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
            if (curveJXG.current!.visProp.dash !== newDash) {
                curveJXG.current!.visProp.dash = newDash;
            }
            if (
                curveJXG.current!.visProp.strokewidth !==
                SVs.selectedStyle.lineWidth
            ) {
                curveJXG.current!.visProp.strokewidth =
                    SVs.selectedStyle.lineWidth;
            }

            if (SVs.curveType === "parameterization") {
                let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
                let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);

                curveJXG.current!.X = f1;
                curveJXG.current!.Y = f2;
                curveJXG.current!.minX = () => SVs.parMin;
                curveJXG.current!.maxX = () => SVs.parMax;
            } else if (SVs.curveType === "bezier") {
                curveJXG.current!.X = createFunctionFromDefinition(
                    SVs.fDefinitions[0],
                );
                curveJXG.current!.Y = createFunctionFromDefinition(
                    SVs.fDefinitions[1],
                );
                curveJXG.current!.minX = () => SVs.parMin;
                curveJXG.current!.maxX = () => SVs.parMax;

                throughPointAttributes.current!.showInfoBox =
                    SVs.showCoordsWhenDragging;
                controlPointAttributes.current!.showInfoBox =
                    SVs.showCoordsWhenDragging;
            } else {
                let f = createFunctionFromDefinition(SVs.fDefinitions[0]);
                if (SVs.flipFunction) {
                    curveJXG.current!.X = f;
                    let yMin = SVs.graphYmin;
                    let yMax = SVs.graphYmax;
                    let minForF = Math.max(
                        yMin - (yMax - yMin) * 0.1,
                        SVs.parMin,
                    );
                    let maxForF = Math.min(
                        yMax + (yMax - yMin) * 0.1,
                        SVs.parMax,
                    );
                    curveJXG.current!.minX = () => minForF;
                    curveJXG.current!.maxX = () => maxForF;
                } else {
                    curveJXG.current!.Y = f;
                    let xMin = SVs.graphXmin;
                    let xMax = SVs.graphXmax;
                    let minForF = Math.max(
                        xMin - (xMax - xMin) * 0.1,
                        SVs.parMin,
                    );
                    let maxForF = Math.min(
                        xMax + (xMax - xMin) * 0.1,
                        SVs.parMax,
                    );
                    curveJXG.current!.minX = () => minForF;
                    curveJXG.current!.maxX = () => maxForF;
                }
            }

            curveJXG.current!.visProp.fixed = fixed.current;

            curveJXG.current!.needsUpdate = true;
            curveJXG.current!.updateCurve!();
            if (curveJXG.current!.hasLabel && curveJXG.current!.label) {
                const label = curveJXG.current!.label as any;
                label.needsUpdate = true;
                label.visPropCalc.visible = SVs.labelForGraph !== "";
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);
                label.update();
            }

            if (SVs.curveType !== "bezier") {
                board!.updateRenderer();
                return (
                    <>
                        <span id={id} />
                    </>
                );
            }

            if (fixLocation.current) {
                if (segmentsJXG.current!.length > 0) {
                    deleteControls();
                }
                board!.updateRenderer();
                return (
                    <>
                        <span id={id} />
                    </>
                );
            }

            if (segmentsJXG.current!.length === 0) {
                createControls();

                previousNumberOfPoints.current! =
                    SVs.numericalThroughPoints.length;
                previousVectorControlDirections.current = [
                    ...SVs.vectorControlDirections,
                ];

                board!.updateRenderer();
                return (
                    <>
                        <span id={id} />
                    </>
                );
            }

            // add or delete segments and points if number changed
            if (
                SVs.numericalThroughPoints.length >
                previousNumberOfPoints.current!
            ) {
                // add new segments and point

                let iPreviousLast = previousNumberOfPoints.current! - 1;

                let attributesForNewThroughPoints = Object.assign(
                    {},
                    throughPointAttributes.current,
                );
                if (
                    throughPointsJXG.current![iPreviousLast].visProp
                        .fillcolor ===
                    throughPointAlwaysVisible.current!.fillcolor
                ) {
                    Object.assign(
                        attributesForNewThroughPoints,
                        throughPointAlwaysVisible.current,
                    );
                }

                for (
                    let i = previousNumberOfPoints.current!;
                    i < SVs.numericalThroughPoints.length;
                    i++
                ) {
                    // add point and its controls
                    let tp = board!.create(
                        "point",
                        [...SVs.numericalThroughPoints[i]],
                        attributesForNewThroughPoints,
                    );
                    throughPointsJXG.current!.push(tp);
                    let cp1 = board!.create(
                        "point",
                        [...SVs.numericalControlPoints[i][0]],
                        controlPointAttributes.current,
                    );
                    let cp2 = board!.create(
                        "point",
                        [...SVs.numericalControlPoints[i][1]],
                        controlPointAttributes.current,
                    );
                    controlPointsJXG.current!.push([cp1, cp2]);
                    let seg1 = board!.create(
                        "segment",
                        [tp, cp1],
                        segmentAttributes.current,
                    );
                    let seg2 = board!.create(
                        "segment",
                        [tp, cp2],
                        segmentAttributes.current,
                    );
                    segmentsJXG.current!.push([seg1, seg2]);

                    cp1.visProp.visible = false;
                    seg1.visProp.visible = false;
                    cp2.visProp.visible = false;
                    seg2.visProp.visible = false;

                    tp.on("drag", (e: any) => dragThroughPoint(i));
                    tp.on("down", (e: any) => downThroughPoint(i, e));
                    tp.on("hit", (e: any) => downThroughPoint(i, e));
                    tp.on("up", (e: any) => upThroughPoint(i));
                    tp.on("keyfocusout", (e: any) => upThroughPoint(i));
                    cp1.on("drag", (e: any) => dragControlPoint(i, 0));
                    cp1.on("down", downOther);
                    cp1.on("up", (e: any) => upControlPoint(i, 0));
                    cp2.on("drag", (e: any) => dragControlPoint(i, 1));
                    cp2.on("down", downOther);
                    cp2.on("up", (e: any) => upControlPoint(i, 1));
                    seg1.on("down", downOther);
                    seg2.on("down", downOther);
                }

                if (vectorControlsVisible.current[iPreviousLast]) {
                    // since added new point on one side of previous last point
                    // (at least if not extrapolating)
                    // refresh visibility to add extra handle
                    makeVectorControlVisible(iPreviousLast);
                }
            } else if (
                SVs.numericalThroughPoints.length <
                previousNumberOfPoints.current!
            ) {
                // delete old segments and points

                for (
                    let i = previousNumberOfPoints.current! - 1;
                    i >= SVs.numericalThroughPoints.length;
                    i--
                ) {
                    segmentsJXG.current![i][0].off("down");
                    segmentsJXG.current![i][1].off("down");
                    board?.removeObject(segmentsJXG.current![i][0]);
                    board?.removeObject(segmentsJXG.current![i][1]);
                    segmentsJXG.current!.pop();

                    controlPointsJXG.current![i][0].off("drag");
                    controlPointsJXG.current![i][0].off("down");
                    controlPointsJXG.current![i][0].off("up");
                    controlPointsJXG.current![i][1].off("drag");
                    controlPointsJXG.current![i][1].off("down");
                    controlPointsJXG.current![i][1].off("up");
                    board?.removeObject(controlPointsJXG.current![i][0]);
                    board?.removeObject(controlPointsJXG.current![i][1]);
                    controlPointsJXG.current!.pop();

                    let tp = throughPointsJXG.current!.pop();
                    if (tp) {
                        tp.off("drag");
                        tp.off("down");
                        tp.off("up");
                        tp.off("hit");
                        tp.off("keyfocusout");
                        board?.removeObject(tp);
                    }
                }

                let iNewLast = SVs.numericalThroughPoints.length - 1;
                if (vectorControlsVisible.current[iNewLast]) {
                    makeVectorControlVisible(iNewLast);
                }
            }

            // move old points and modify attributes, if needed
            let nOld = Math.min(
                SVs.numericalThroughPoints.length,
                previousNumberOfPoints.current!,
            );

            for (let i = 0; i < nOld; i++) {
                if (
                    previousVectorControlDirections.current![i] !==
                        SVs.vectorControlDirections[i] &&
                    vectorControlsVisible.current[i]
                ) {
                    // refresh visibility
                    makeVectorControlVisible(i);
                }

                if (layerChanged) {
                    throughPointsJXG.current![i].setAttribute({
                        layer: throughPointLayer,
                    });
                    segmentsJXG.current![i][0].setAttribute({
                        layer: segmentLayer,
                    });
                    controlPointsJXG.current![i][0].setAttribute({
                        layer: controlPointLayer,
                    });
                    segmentsJXG.current![i][1].setAttribute({
                        layer: segmentLayer,
                    });
                    controlPointsJXG.current![i][1].setAttribute({
                        layer: controlPointLayer,
                    });
                }

                throughPointsJXG.current![i].coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    [...SVs.numericalThroughPoints[i]],
                );

                throughPointsJXG.current![i].visProp.showinfobox =
                    SVs.showCoordsWhenDragging;
                throughPointsJXG.current![i].needsUpdate = true;
                throughPointsJXG.current![i].update();
                controlPointsJXG.current![i][0].coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    [...SVs.numericalControlPoints[i][0]],
                );
                controlPointsJXG.current![i][0].visProp.showinfobox =
                    SVs.showCoordsWhenDragging;
                controlPointsJXG.current![i][0].needsUpdate = true;
                controlPointsJXG.current![i][0].update();
                segmentsJXG.current![i][0].needsUpdate = true;
                segmentsJXG.current![i][0].update();
                controlPointsJXG.current![i][1].coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    [...SVs.numericalControlPoints[i][1]],
                );
                controlPointsJXG.current![i][1].visProp.showinfobox =
                    SVs.showCoordsWhenDragging;
                controlPointsJXG.current![i][1].needsUpdate = true;
                controlPointsJXG.current![i][1].update();
                segmentsJXG.current![i][1].needsUpdate = true;
                segmentsJXG.current![i][1].update();
            }

            for (let i = 0; i < SVs.numericalThroughPoints.length; i++) {
                throughPointsJXG.current![i].visProp["visible"] = !SVs.hidden;
                throughPointsJXG.current![i].visPropCalc["visible"] =
                    !SVs.hidden;
            }

            if (
                sourceOfUpdate.sourceInformation &&
                componentIdx in sourceOfUpdate.sourceInformation
            ) {
                const sourceInfo = sourceOfUpdate.sourceInformation[
                    componentIdx
                ] as any;
                let ind = sourceInfo.throughPointMoved;
                if (ind !== undefined) {
                    board!.updateInfobox(throughPointsJXG.current![ind]);
                } else {
                    ind = sourceInfo.controlVectorMoved;
                    if (ind !== undefined) {
                        board!.updateInfobox(
                            controlPointsJXG.current![ind[0]][ind[1]],
                        );
                    }
                }
            }

            previousNumberOfPoints.current! = SVs.numericalThroughPoints.length;
            previousVectorControlDirections.current = [
                ...SVs.vectorControlDirections,
            ];

            board!.updateRenderer();
        }
    }

    if (SVs.hidden) {
        return null;
    }

    // don't think we want to return anything if not in board
    return <span id={id} />;
});
