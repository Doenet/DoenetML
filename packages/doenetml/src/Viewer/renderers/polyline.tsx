import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { DocContext } from "../DocViewer";
import { JXGCurve, JXGPoint } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import {
    syncLabelStrokeColor,
    syncLayer,
    syncLineStrokeStyle,
} from "./utils/jsxgraph";

interface PolylineSVs extends DraggableGraphicalSVs {
    numVertices: number;
    numericalVertices: [number, number][];
    verticesDraggable: boolean;
    vertexIndicesDraggable: number[];
    showCoordsWhenDragging: boolean;
}

export default React.memo(function Polyline(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, sourceOfUpdate, callAction } =
        useDoenetRenderer<PolylineSVs>(props);

    // @ts-ignore
    Polyline.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let polylineJXG = useRef<JXGCurve | null>(null);
    let pointsJXG = useRef<JXGPoint[] | null>(null);

    let pointCoords = useRef<any>(null);
    let draggedPoint = useRef<number | null>(null);
    let downOnPoint = useRef<number | null>(null);
    const dragState = usePointerDragState();
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown } = dragState;
    let pointsAtDown = useRef<number[][] | null>(null);
    let previousNumVertices = useRef<number | null>(null);
    let jsxPointAttributes = useRef<Record<string, any> | null>(null);

    let lastPositionsFromCore = useRef<[number, number][] | null>(null);
    let fixed = useRef(false);
    let fixLocation = useRef(false);
    let verticesFixed = useRef(false);
    let vertexIndicesDraggable = useRef<number[]>([]);

    lastPositionsFromCore.current = SVs.numericalVertices;
    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;
    verticesFixed.current =
        !SVs.verticesDraggable || SVs.fixed || SVs.fixLocation;
    vertexIndicesDraggable.current = SVs.vertexIndicesDraggable;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    React.useEffect(() => {
        return () => {
            if (polylineJXG.current) {
                deletePolylineJXG();
            }
        };
    }, []);

    function createPolylineJXG() {
        if (board === null) {
            return null;
        }

        if (
            SVs.numericalVertices.length !== SVs.numVertices ||
            SVs.numericalVertices.some((x) => x.length !== 2)
        ) {
            return null;
        }

        let validCoords = true;

        for (let coords of SVs.numericalVertices) {
            if (!Number.isFinite(coords[0])) {
                validCoords = false;
            }
            if (!Number.isFinite(coords[1])) {
                validCoords = false;
            }
        }

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

        //things to be passed to JSXGraph as attributes
        let jsxPolylineAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden && validCoords,
            withLabel: SVs.labelForGraph !== "",
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            fixed: fixed.current,
            strokeColor: lineColor,
            strokeOpacity: SVs.selectedStyle.lineOpacity,
            highlightStrokeColor: lineColor,
            highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
            strokeWidth: SVs.selectedStyle.lineWidth,
            highlightStrokeWidth: SVs.selectedStyle.lineWidth,
            dash: styleToDash(SVs.selectedStyle.lineStyle),
            highlight: !fixLocation.current,
            lineCap: "butt",
        };

        jsxPointAttributes.current = Object.assign({}, jsxPolylineAttributes);
        Object.assign(jsxPointAttributes.current, {
            fixed: false,
            highlight: true,
            withLabel: false,
            fillColor: "none",
            strokeColor: "none",
            highlightStrokeColor: "none",
            highlightFillColor: "black",
            layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
            showInfoBox: SVs.showCoordsWhenDragging,
        });
        if (verticesFixed.current || SVs.hidden || !validCoords) {
            jsxPointAttributes.current.visible = false;
        }
        jsxPolylineAttributes.label = {
            highlight: false,
        };
        if (SVs.labelHasLatex) {
            jsxPolylineAttributes.label.useMathJax = true;
        }
        if (SVs.applyStyleToLabel) {
            jsxPolylineAttributes.label.strokeColor = lineColor;
        } else {
            jsxPolylineAttributes.label.strokeColor = "var(--canvasText)";
        }

        // create invisible points at endpoints
        pointsJXG.current = [];
        for (let i = 0; i < SVs.numVertices; i++) {
            let pointAttributes = { ...jsxPointAttributes.current };
            if (!vertexIndicesDraggable.current.includes(i)) {
                pointAttributes.visible = false;
            }
            pointsJXG.current.push(
                board.create(
                    "point",
                    [...SVs.numericalVertices[i]],
                    pointAttributes,
                ),
            );
        }

        let x: number[] = [];
        let y: number[] = [];
        SVs.numericalVertices.forEach((z) => {
            x.push(z[0]);
            y.push(z[1]);
        });

        let newPolylineJXG: JXGCurve = board.create(
            "curve",
            [x, y],
            jsxPolylineAttributes,
        );
        newPolylineJXG.isDraggable = !fixLocation.current;

        for (let i = 0; i < SVs.numVertices; i++) {
            pointsJXG.current[i].on("drag", (e) => dragHandler(i, e));
            pointsJXG.current[i].on("up", () => upHandler(i));
            pointsJXG.current[i].on("keyfocusout", () => keyFocusOutHandler(i));
            pointsJXG.current[i].on("keydown", (e) => keyDownHandler(i, e));
            pointsJXG.current[i].on("down", (e) => downHandler(i, e));
            pointsJXG.current[i].on("hit", () => hitHandler());
        }

        newPolylineJXG.on("drag", (e) => dragHandler(-1, e));
        newPolylineJXG.on("up", () => upHandler(-1));
        newPolylineJXG.on("keyfocusout", () => keyFocusOutHandler(-1));
        newPolylineJXG.on("keydown", (e) => keyDownHandler(-1, e));
        newPolylineJXG.on("down", (e) => downHandler(-1, e));
        newPolylineJXG.on("hit", () => hitHandler());
        newPolylineJXG.on("over", () => {
            highlightVertices();
        });
        newPolylineJXG.on("out", () => {
            unHighlightVertices();
        });

        previousNumVertices.current = SVs.numVertices;

        return newPolylineJXG;
    }

    function deletePolylineJXG() {
        if (!polylineJXG.current) {
            return;
        }
        polylineJXG.current.off("drag");
        polylineJXG.current.off("down");
        polylineJXG.current.off("hit");
        polylineJXG.current.off("up");
        polylineJXG.current.off("keyfocusout");
        polylineJXG.current.off("keydown");
        board?.removeObject(polylineJXG.current);
        polylineJXG.current = null;

        if (pointsJXG.current) {
            for (let i = 0; i < SVs.numVertices; i++) {
                let point = pointsJXG.current[i];
                if (point) {
                    point.off("drag");
                    point.off("down");
                    point.off("hit");
                    point.off("up");
                    point.off("keyfocusout");
                    point.off("keydown");
                    board?.removeObject(point);
                }
            }
        }
        pointsJXG.current = null;
    }

    function dragHandler(i: number, e: { type: string; x: number; y: number }) {
        if (!polylineJXG.current || !pointsJXG.current || board === null) {
            return;
        }
        if (exceededDragThreshold(e, pointerAtDown.current)) {
            draggedPoint.current = i;

            if (i === -1) {
                polylineJXG.current.updateTransformMatrix?.();
                let shiftX = polylineJXG.current.transformMat![1][0];
                let shiftY = polylineJXG.current.transformMat![2][0];

                pointCoords.current = [];

                if (
                    e.type === "pointermove" &&
                    pointerAtDown.current &&
                    pointsAtDown.current
                ) {
                    // Compute from pointer delta rather than .X()/.Y() directly
                    // so points don't snap back to attractors on slow drags.
                    for (
                        let j = 0;
                        j < polylineJXG.current.points!.length;
                        j++
                    ) {
                        pointCoords.current.push(
                            pointerEventToUserCoords(
                                e,
                                pointerAtDown.current,
                                pointsAtDown.current[j] as [
                                    number,
                                    number,
                                    number,
                                ],
                                board,
                            ),
                        );
                    }
                } else {
                    for (
                        let j = 0;
                        j < polylineJXG.current.points!.length;
                        j++
                    ) {
                        pointCoords.current.push([
                            polylineJXG.current.dataX[j] + shiftX,
                            polylineJXG.current.dataY[j] + shiftY,
                        ]);
                    }
                }

                callAction({
                    action: actions.movePolyline,
                    args: {
                        pointCoords: pointCoords.current,
                        transient: true,
                        skippable: true,
                    },
                });

                for (let j = 0; j < SVs.numVertices; j++) {
                    pointsJXG.current[j].coords.setCoordinates(
                        JXG.COORDS_BY_USER,
                        [...lastPositionsFromCore.current![j]],
                    );
                    polylineJXG.current.dataX[j] =
                        lastPositionsFromCore.current![j][0] - shiftX;
                    polylineJXG.current.dataY[j] =
                        lastPositionsFromCore.current![j][1] - shiftY;
                }
            } else {
                pointCoords.current = {};
                pointCoords.current[i] = [
                    pointsJXG.current[i].X(),
                    pointsJXG.current[i].Y(),
                ];
                callAction({
                    action: actions.movePolyline,
                    args: {
                        pointCoords: pointCoords.current,
                        transient: true,
                        skippable: true,
                        sourceDetails: { vertex: i },
                    },
                });
                pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [
                    ...lastPositionsFromCore.current![i],
                ]);
                board.updateInfobox(pointsJXG.current[i]);
            }
        }
    }

    function downHandler(i: number, e: { x: number; y: number; type: string }) {
        (document.activeElement as HTMLElement | null)?.blur();

        draggedPoint.current = null;
        pointerAtDown.current = [e.x, e.y];

        if (i === -1) {
            if (downOnPoint.current === null && !fixed.current) {
                // Note: counting on fact that down on polyline itself will trigger after down on points
                callAction({
                    action: actions.polylineFocused,
                    args: { componentIdx },
                });
            }
            pointsAtDown.current = polylineJXG.current!.points!.map(
                (x) => [...x.scrCoords] as number[],
            );
        } else {
            if (!verticesFixed.current) {
                callAction({
                    action: actions.polylineFocused,
                    args: { componentIdx },
                });
            }
            downOnPoint.current = i;
        }

        pointerIsDown.current = true;
        pointerMovedSinceDown.current = false;
    }

    function hitHandler() {
        highlightVertices();
        draggedPoint.current = null;
        callAction({
            action: actions.polylineFocused,
            args: { componentIdx },
        });
    }

    function upHandler(i: number) {
        if (draggedPoint.current === i) {
            if (i === -1) {
                callAction({
                    action: actions.movePolyline,
                    args: {
                        pointCoords: pointCoords.current,
                    },
                });
            } else {
                callAction({
                    action: actions.movePolyline,
                    args: {
                        pointCoords: pointCoords.current,
                        sourceDetails: { vertex: i },
                    },
                });
            }
        } else if (
            !pointerMovedSinceDown.current &&
            (downOnPoint.current === null || i !== -1) &&
            !fixed.current
        ) {
            // Note: counting on fact that up on polyline itself (i===-1) will trigger before up on points
            callAction({
                action: actions.polylineClicked,
                args: { componentIdx },
            });
        }

        if (i !== -1) {
            downOnPoint.current = null;
        }

        pointerIsDown.current = false;
    }

    function keyFocusOutHandler(i: number) {
        unHighlightVertices();
        if (draggedPoint.current === i) {
            if (i === -1) {
                callAction({
                    action: actions.movePolyline,
                    args: {
                        pointCoords: pointCoords.current,
                    },
                });
            } else {
                callAction({
                    action: actions.movePolyline,
                    args: {
                        pointCoords: pointCoords.current,
                        sourceInformation: { vertex: i },
                    },
                });
            }
        }
        draggedPoint.current = null;
    }

    function keyDownHandler(i: number, e: { key: string }) {
        if (e.key === "Enter") {
            if (draggedPoint.current === i) {
                if (i === -1) {
                    callAction({
                        action: actions.movePolyline,
                        args: {
                            pointCoords: pointCoords.current,
                        },
                    });
                } else {
                    callAction({
                        action: actions.movePolyline,
                        args: {
                            pointCoords: pointCoords.current,
                            sourceInformation: { vertex: i },
                        },
                    });
                }
            }
            draggedPoint.current = null;
            callAction({
                action: actions.polylineClicked,
                args: { componentIdx },
            });
        }
    }

    function highlightVertices() {
        if (!verticesFixed.current && pointsJXG.current) {
            for (let [i, point] of pointsJXG.current.entries()) {
                if (vertexIndicesDraggable.current.includes(i)) {
                    point.setAttribute({ fillcolor: "black" });
                    point.needsUpdate = true;
                    point.update();
                }
            }
        }
    }

    function unHighlightVertices() {
        if (!verticesFixed.current && pointsJXG.current) {
            for (let [i, point] of pointsJXG.current.entries()) {
                if (vertexIndicesDraggable.current.includes(i)) {
                    point.setAttribute({ fillcolor: "none" });
                    point.needsUpdate = true;
                    point.update();
                }
            }
        }
    }

    if (board) {
        if (!polylineJXG.current) {
            polylineJXG.current = createPolylineJXG();
        } else if (
            SVs.numericalVertices.length !== SVs.numVertices ||
            SVs.numericalVertices.some((x) => x.length !== 2)
        ) {
            deletePolylineJXG();
        } else if (pointsJXG.current) {
            let validCoords = true;

            for (let coords of SVs.numericalVertices) {
                if (!Number.isFinite(coords[0])) {
                    validCoords = false;
                }
                if (!Number.isFinite(coords[1])) {
                    validCoords = false;
                }
            }

            polylineJXG.current.visProp.fixed = fixed.current;
            polylineJXG.current.visProp.highlight = !fixLocation.current;
            polylineJXG.current.isDraggable = !fixLocation.current;

            let pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
            let layerChanged = syncLayer(
                polylineJXG.current,
                SVs.layer,
                LINE_LAYER_OFFSET,
            );

            if (layerChanged) {
                jsxPointAttributes.current!.layer = pointLayer;
            }

            // add or delete points as required and change data array size
            if (
                previousNumVertices.current !== null &&
                SVs.numVertices > previousNumVertices.current
            ) {
                for (
                    let i = previousNumVertices.current;
                    i < SVs.numVertices;
                    i++
                ) {
                    let pointAttributes = { ...jsxPointAttributes.current };
                    if (!vertexIndicesDraggable.current.includes(i)) {
                        pointAttributes.visible = false;
                    }
                    pointsJXG.current.push(
                        board.create(
                            "point",
                            [...SVs.numericalVertices[i]],
                            pointAttributes,
                        ),
                    );
                    polylineJXG.current.dataX.length = SVs.numVertices;

                    pointsJXG.current[i].on("drag", (e) => dragHandler(i, e));
                    pointsJXG.current[i].on("up", () => upHandler(i));
                    pointsJXG.current[i].on("down", (e) => downHandler(i, e));
                    pointsJXG.current[i].on("hit", () => hitHandler());
                    pointsJXG.current[i].on("keyfocusout", () =>
                        keyFocusOutHandler(i),
                    );
                    pointsJXG.current[i].on("keydown", (e) =>
                        keyDownHandler(i, e),
                    );
                }
            } else if (
                previousNumVertices.current !== null &&
                SVs.numVertices < previousNumVertices.current
            ) {
                for (
                    let i = SVs.numVertices;
                    i < previousNumVertices.current;
                    i++
                ) {
                    let pt = pointsJXG.current.pop();
                    if (pt) {
                        pt.off("drag");
                        pt.off("down");
                        pt.off("hit");
                        pt.off("up");
                        pt.off("keyfocusout");
                        pt.off("keydown");
                        board?.removeObject(pt);
                    }
                }
                polylineJXG.current.dataX.length = SVs.numVertices;
            }

            previousNumVertices.current = SVs.numVertices;

            polylineJXG.current.updateTransformMatrix?.();
            let shiftX = polylineJXG.current.transformMat![1][0];
            let shiftY = polylineJXG.current.transformMat![2][0];

            for (let i = 0; i < SVs.numVertices; i++) {
                pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [
                    ...SVs.numericalVertices[i],
                ]);
                polylineJXG.current.dataX[i] =
                    SVs.numericalVertices[i][0] - shiftX;
                polylineJXG.current.dataY[i] =
                    SVs.numericalVertices[i][1] - shiftY;
            }

            let visible = !SVs.hidden;

            if (validCoords) {
                polylineJXG.current.visProp["visible"] = visible;
                polylineJXG.current.visPropCalc["visible"] = visible;

                let pointsVisible = visible && !verticesFixed.current;

                for (let i = 0; i < SVs.numVertices; i++) {
                    let pointVisible =
                        pointsVisible &&
                        vertexIndicesDraggable.current.includes(i);
                    pointsJXG.current[i].visProp["visible"] = pointVisible;
                    pointsJXG.current[i].visPropCalc["visible"] = pointVisible;
                    pointsJXG.current[i].visProp.showinfobox =
                        SVs.showCoordsWhenDragging;
                }
            } else {
                polylineJXG.current.visProp["visible"] = false;
                polylineJXG.current.visPropCalc["visible"] = false;

                for (let i = 0; i < SVs.numVertices; i++) {
                    pointsJXG.current[i].visProp["visible"] = false;
                    pointsJXG.current[i].visPropCalc["visible"] = false;
                }
            }

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

            syncLineStrokeStyle(polylineJXG.current, {
                lineColor,
                lineWidth: SVs.selectedStyle.lineWidth,
                lineOpacity: SVs.selectedStyle.lineOpacity,
                dash: styleToDash(SVs.selectedStyle.lineStyle),
            });

            polylineJXG.current.name = SVs.labelForGraph;

            if (polylineJXG.current.hasLabel && polylineJXG.current.label) {
                const label = polylineJXG.current.label;
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);
                label.needsUpdate = true;
                label.update();
            }

            if (
                sourceOfUpdate.sourceInformation &&
                componentIdx in sourceOfUpdate.sourceInformation
            ) {
                let sourceInfo = sourceOfUpdate.sourceInformation[componentIdx];
                let vertexUpdated =
                    typeof sourceInfo === "object" && sourceInfo
                        ? (sourceInfo as any).vertex
                        : undefined;

                if (Number.isFinite(vertexUpdated)) {
                    board.updateInfobox(pointsJXG.current[vertexUpdated]);
                }
            }

            polylineJXG.current.needsUpdate = true;
            polylineJXG.current.update();
            polylineJXG.current.updateVisibility?.();
            for (let i = 0; i < SVs.numVertices; i++) {
                if (layerChanged) {
                    pointsJXG.current[i].setAttribute({ layer: pointLayer });
                }
                pointsJXG.current[i].needsUpdate = true;
                pointsJXG.current[i].update();
            }
            board.updateRenderer();
        }
    }

    if (SVs.hidden) {
        return null;
    }

    // don't think we want to return anything if not in board
    return (
        <>
            <span id={id} />
        </>
    );
});
