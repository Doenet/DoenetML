import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { DocContext } from "../DocViewer";
import { JXGPolygon, JXGPoint } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor, resolveFillColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";
import {
    removeJXGEventHandlers,
    syncLabelStrokeColor,
    syncLayer,
    syncLineStrokeStyle,
} from "./utils/jsxgraph";
import { buildBaseAttributes } from "./utils/buildGraphicalAttributes";

interface PolygonSVs extends DraggableGraphicalSVs {
    numVertices: number;
    numericalVertices: [number, number][];
    verticesDraggable: boolean;
    vertexIndicesDraggable: number[];
    filled: boolean;
    showCoordsWhenDragging: boolean;
}

export default React.memo(function Polygon(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, sourceOfUpdate, callAction } =
        useDoenetRenderer<PolygonSVs>(props);

    // @ts-ignore
    Polygon.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let polygonJXG = useRef<JXGPolygon | null>(null);
    let pointsJXG = useRef<JXGPoint[]>([]);

    let pointCoords = useRef<any>(null);
    let draggedPoint = useRef<number | null>(null);
    let downOnPoint = useRef<number | null>(null);
    const dragState = usePointerDragState();
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown } = dragState;
    let pointsAtDown = useRef<number[][] | null>(null);
    let previousNumVertices = useRef<number | null>(null);
    let jsxPointAttributes = useRef<Record<string, any> | null>(null);

    const {
        lastPositionFromCore: lastPositionsFromCore,
        fixed,
        fixLocation,
    } = useDraggableRefs<[number, number][]>(SVs, SVs.numericalVertices);
    let verticesFixed = useRef(false);
    let vertexIndicesDraggable = useRef<number[]>([]);
    verticesFixed.current =
        !SVs.verticesDraggable || SVs.fixed || SVs.fixLocation;
    vertexIndicesDraggable.current = SVs.vertexIndicesDraggable;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    useJSXGraphCleanup({
        objectRef: polygonJXG,
        destroy: () => deletePolygonJXG(),
    });

    function createPolygonJXG() {
        if (board === null) {
            return null;
        }

        if (!(SVs.numVertices >= 2)) {
            return null;
        }

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);
        const fillColor = SVs.filled
            ? resolveFillColor(SVs.selectedStyle, darkMode)
            : "none";

        jsxPointAttributes.current = {
            fillColor: "none",
            strokeColor: "none",
            highlightStrokeColor: "none",
            highlightFillColor: "black",
            visible: !verticesFixed.current && !SVs.hidden,
            withLabel: false,
            layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
            highlight: true,
            showInfoBox: SVs.showCoordsWhenDragging,
        };

        let jsxBorderAttributes: Record<string, any> = {
            highlight: false,
            visible: !SVs.hidden,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            fixed: true,
            strokeColor: lineColor,
            strokeOpacity: SVs.selectedStyle.lineOpacity,
            highlightStrokeColor: lineColor,
            highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
            strokeWidth: SVs.selectedStyle.lineWidth,
            highlightStrokeWidth: SVs.selectedStyle.lineWidth,
            dash: styleToDash(SVs.selectedStyle.lineStyle),
        };

        let jsxPolygonAttributes: Record<string, any> = {
            ...buildBaseAttributes({
                SVs,
                layerOffset: LINE_LAYER_OFFSET,
                fixed: fixed.current,
                fixLocation: fixLocation.current,
            }),

            //specific to polygon
            fillColor,
            fillOpacity: SVs.selectedStyle.fillOpacity,
            highlightFillColor: fillColor,
            highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
            vertices: jsxPointAttributes.current,
            borders: jsxBorderAttributes,
        };

        jsxPolygonAttributes.label = {
            highlight: false,
        };
        if (SVs.labelHasLatex) {
            jsxPolygonAttributes.label.useMathJax = true;
        }

        if (SVs.applyStyleToLabel) {
            jsxPolygonAttributes.label.strokeColor = lineColor;
        } else {
            jsxPolygonAttributes.label.strokeColor = "var(--canvasText)";
        }

        if (SVs.filled) {
            jsxPolygonAttributes.hasInnerPoints = true;
        }

        board.suspendUpdate();

        pointsJXG.current = [];

        for (let [ind, p] of SVs.numericalVertices.entries()) {
            let pointAttributes = { ...jsxPointAttributes.current };
            if (!vertexIndicesDraggable.current.includes(ind)) {
                pointAttributes.visible = false;
            }
            pointsJXG.current.push(
                board.create("point", [...p], pointAttributes),
            );
        }

        let newPolygonJXG: JXGPolygon = board.create(
            "polygon",
            pointsJXG.current,
            jsxPolygonAttributes,
        );
        newPolygonJXG.isDraggable = !fixLocation.current;

        initializePoints(newPolygonJXG);

        newPolygonJXG.on("drag", (e) => dragHandler(-1, e));
        newPolygonJXG.on("up", () => upHandler(-1));
        newPolygonJXG.on("keyfocusout", () => keyFocusOutHandler(-1));
        newPolygonJXG.on("keydown", (e) => keyDownHandler(-1, e));

        newPolygonJXG.on("down", (e) => downHandler(-1, e));
        newPolygonJXG.on("hit", () => hitHandler());

        newPolygonJXG.on("over", () => {
            highlightVertices();
        });
        newPolygonJXG.on("out", () => {
            unHighlightVertices();
        });

        board.unsuspendUpdate();

        previousNumVertices.current = SVs.numVertices;

        return newPolygonJXG;
    }

    function initializePoints(polygon: JXGPolygon) {
        for (let i = 0; i < SVs.numVertices; i++) {
            let vertex = polygon.vertices[i];
            removeJXGEventHandlers(vertex);
            vertex.on("drag", (e) => dragHandler(i, e));
            vertex.on("up", () => upHandler(i));
            vertex.on("keyfocusout", () => keyFocusOutHandler(i));
            vertex.on("keydown", (e) => keyDownHandler(i, e));
            vertex.on("down", (e) => downHandler(i, e));
            vertex.on("hit", () => hitHandler());
        }
    }

    function deletePolygonJXG() {
        if (!polygonJXG.current) {
            return;
        }
        for (let i = 0; i < SVs.numVertices; i++) {
            let vertex = polygonJXG.current.vertices[i];
            if (vertex) {
                vertex.off("drag");
                vertex.off("up");
                vertex.off("down");
                vertex.off("hit");
            }
        }
        polygonJXG.current.off("drag");
        polygonJXG.current.off("up");
        polygonJXG.current.off("down");
        polygonJXG.current.off("hit");
        board?.removeObject(polygonJXG.current);
        polygonJXG.current = null;

        for (const pt of pointsJXG.current) {
            board?.removeObject(pt);
        }
        pointsJXG.current = [];
    }

    function dragHandler(i: number, e: { type: string; x: number; y: number }) {
        if (!polygonJXG.current || board === null) {
            return;
        }
        if (exceededDragThreshold(e, pointerAtDown.current)) {
            draggedPoint.current = i;

            if (i === -1) {
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
                        j < polygonJXG.current.vertices.length - 1;
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
                        j < polygonJXG.current.vertices.length - 1;
                        j++
                    ) {
                        let vertex = polygonJXG.current.vertices[j];
                        pointCoords.current.push([vertex.X(), vertex.Y()]);
                    }
                }

                callAction({
                    action: actions.movePolygon,
                    args: {
                        pointCoords: pointCoords.current,
                        transient: true,
                        skippable: true,
                    },
                });

                for (let j = 0; j < SVs.numVertices; j++) {
                    polygonJXG.current.vertices[j].coords.setCoordinates(
                        JXG.COORDS_BY_USER,
                        [...lastPositionsFromCore.current![j]],
                    );
                }
            } else {
                pointCoords.current = {};
                pointCoords.current[i] = [
                    polygonJXG.current.vertices[i].X(),
                    polygonJXG.current.vertices[i].Y(),
                ];
                callAction({
                    action: actions.movePolygon,
                    args: {
                        pointCoords: pointCoords.current,
                        transient: true,
                        skippable: true,
                        sourceDetails: { vertex: i },
                    },
                });
                polygonJXG.current.vertices[i].coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    [...lastPositionsFromCore.current![i]],
                );
                board.updateInfobox(polygonJXG.current.vertices[i]);
            }
        }
    }

    function downHandler(i: number, e: { x: number; y: number; type: string }) {
        (document.activeElement as HTMLElement | null)?.blur();

        draggedPoint.current = null;
        pointerAtDown.current = [e.x, e.y];

        if (i === -1) {
            if (downOnPoint.current === null && !fixed.current) {
                // Note: counting on fact that down on polygon itself will trigger after down on points
                callAction({
                    action: actions.polygonFocused,
                    args: { componentIdx },
                });
            }
            pointsAtDown.current = polygonJXG.current!.vertices.map(
                (x) => [...x.coords.scrCoords] as number[],
            );
        } else {
            if (!verticesFixed.current) {
                callAction({
                    action: actions.polygonFocused,
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
            action: actions.polygonFocused,
            args: { componentIdx },
        });
    }

    function upHandler(i: number) {
        if (draggedPoint.current === i) {
            if (i === -1) {
                callAction({
                    action: actions.movePolygon,
                    args: {
                        pointCoords: pointCoords.current,
                    },
                });
            } else {
                callAction({
                    action: actions.movePolygon,
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
            // Note: counting on fact that up on polygon itself (i===-1) will trigger before up on points
            callAction({
                action: actions.polygonClicked,
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
                    action: actions.movePolygon,
                    args: {
                        pointCoords: pointCoords.current,
                    },
                });
            } else {
                callAction({
                    action: actions.movePolygon,
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
                        action: actions.movePolygon,
                        args: {
                            pointCoords: pointCoords.current,
                        },
                    });
                } else {
                    callAction({
                        action: actions.movePolygon,
                        args: {
                            pointCoords: pointCoords.current,
                            sourceInformation: { vertex: i },
                        },
                    });
                }
            }
            draggedPoint.current = null;
            callAction({
                action: actions.polygonClicked,
                args: { componentIdx },
            });
        }
    }

    function highlightVertices() {
        if (!verticesFixed.current && polygonJXG.current) {
            for (let [i, vertex] of polygonJXG.current.vertices.entries()) {
                if (vertexIndicesDraggable.current.includes(i)) {
                    vertex.setAttribute({ fillcolor: "black" });
                    vertex.needsUpdate = true;
                    vertex.update();
                }
            }
        }
    }

    function unHighlightVertices() {
        if (!verticesFixed.current && polygonJXG.current) {
            for (let [i, vertex] of polygonJXG.current.vertices.entries()) {
                if (vertexIndicesDraggable.current.includes(i)) {
                    vertex.setAttribute({ fillcolor: "none" });
                    vertex.needsUpdate = true;
                    vertex.update();
                }
            }
        }
    }

    if (board) {
        if (!polygonJXG.current) {
            polygonJXG.current = createPolygonJXG();
        } else if (!(SVs.numVertices >= 2)) {
            deletePolygonJXG();
        } else {
            let validCoords = true;

            for (let coords of SVs.numericalVertices) {
                if (!Number.isFinite(coords[0])) {
                    validCoords = false;
                }
                if (!Number.isFinite(coords[1])) {
                    validCoords = false;
                }
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
                    let newPoint: JXGPoint = board.create(
                        "point",
                        [...SVs.numericalVertices[i]],
                        pointAttributes,
                    );
                    polygonJXG.current.addPoints(newPoint);
                    pointsJXG.current.push(newPoint);
                }
                initializePoints(polygonJXG.current);
            } else if (
                previousNumVertices.current !== null &&
                SVs.numVertices < previousNumVertices.current
            ) {
                for (
                    let i = previousNumVertices.current - 1;
                    i >= SVs.numVertices;
                    i--
                ) {
                    removeJXGEventHandlers(polygonJXG.current.vertices[i]);
                    polygonJXG.current.removePoints(
                        polygonJXG.current.vertices[i],
                    );
                    const pointToDelete = pointsJXG.current.pop();
                    if (pointToDelete) {
                        board?.removeObject(pointToDelete);
                    }
                }
                initializePoints(polygonJXG.current);
            }

            let verticesVisible = !verticesFixed.current && !SVs.hidden;

            for (let i = 0; i < SVs.numVertices; i++) {
                polygonJXG.current.vertices[i].coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    [...SVs.numericalVertices[i]],
                );
                polygonJXG.current.vertices[i].needsUpdate = true;
                polygonJXG.current.vertices[i].update();
                let vertexVisible =
                    verticesVisible &&
                    vertexIndicesDraggable.current.includes(i);
                polygonJXG.current.vertices[i].visProp["visible"] =
                    vertexVisible;
                polygonJXG.current.vertices[i].visPropCalc["visible"] =
                    vertexVisible;
                polygonJXG.current.vertices[i].visProp.showinfobox =
                    SVs.showCoordsWhenDragging;
            }

            if (
                sourceOfUpdate.sourceInformation &&
                componentIdx in sourceOfUpdate.sourceInformation
            ) {
                let sourceInfo = sourceOfUpdate.sourceInformation[componentIdx];
                let ind =
                    typeof sourceInfo === "object" && sourceInfo
                        ? (sourceInfo as any).vertex
                        : undefined;
                if (ind !== undefined) {
                    board.updateInfobox(polygonJXG.current.vertices[ind]);
                }
            }

            let visibleNow = !SVs.hidden;
            if (!validCoords) {
                visibleNow = false;
            }

            polygonJXG.current.visProp.fixed = fixed.current;
            polygonJXG.current.visProp.highlight = !fixLocation.current;
            polygonJXG.current.isDraggable = !fixLocation.current;

            polygonJXG.current.visProp["visible"] = visibleNow;
            polygonJXG.current.visPropCalc["visible"] = visibleNow;

            let borderLayer: number | undefined;
            let pointLayer: number | undefined;
            let layerChanged = syncLayer(
                polygonJXG.current,
                SVs.layer,
                LINE_LAYER_OFFSET,
            );

            if (layerChanged) {
                borderLayer = 10 * SVs.layer + LINE_LAYER_OFFSET;
                pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
            }

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);
            const fillColor = SVs.filled
                ? resolveFillColor(SVs.selectedStyle, darkMode)
                : "none";

            polygonJXG.current.name = SVs.labelForGraph;

            if (polygonJXG.current.hasLabel && polygonJXG.current.label) {
                const label = polygonJXG.current.label;
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);
                label.needsUpdate = true;
                label.update();
            }

            if (polygonJXG.current.visProp.fillcolor !== fillColor) {
                polygonJXG.current.visProp.fillcolor = fillColor;
                polygonJXG.current.visProp.highlightfillcolor = fillColor;
                polygonJXG.current.visProp.hasinnerpoints = SVs.filled;
            }

            if (
                polygonJXG.current.visProp.fillopacity !==
                SVs.selectedStyle.fillOpacity
            ) {
                polygonJXG.current.visProp.fillopacity =
                    SVs.selectedStyle.fillOpacity;
                polygonJXG.current.visProp.highlightfillopacity =
                    SVs.selectedStyle.fillOpacity * 0.5;
            }

            polygonJXG.current.needsUpdate = true;

            polygonJXG.current.update();
            polygonJXG.current.updateVisibility();
            for (let i = 0; i < polygonJXG.current.borders.length; i++) {
                let border = polygonJXG.current.borders[i];
                border.visProp.visible = visibleNow;
                border.visPropCalc.visible = visibleNow;

                if (layerChanged && borderLayer !== undefined) {
                    border.setAttribute({ layer: borderLayer });
                }

                syncLineStrokeStyle(border, {
                    lineColor,
                    lineWidth: SVs.selectedStyle.lineWidth,
                    lineOpacity: SVs.selectedStyle.lineOpacity,
                    dash: styleToDash(SVs.selectedStyle.lineStyle),
                });

                border.needsUpdate = true;
                border.update();
            }

            if (layerChanged && pointLayer !== undefined) {
                jsxPointAttributes.current!.layer = pointLayer;
                for (let vertex of polygonJXG.current.vertices) {
                    vertex.setAttribute({ layer: pointLayer });
                    vertex.needsUpdate = true;
                    vertex.update();
                }
            }

            previousNumVertices.current = SVs.numVertices;

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
