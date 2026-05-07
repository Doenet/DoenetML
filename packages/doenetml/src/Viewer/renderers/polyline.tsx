import React, { useContext, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { DocContext } from "../DocViewer";
import { JXGCurve, JXGPoint } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";
import {
    DragCoordinationState,
    attachLineFamilyDragHandlers,
} from "./utils/lineFamilyDragHandlers";
import {
    removeJXGEventHandlers,
    syncLabelStrokeColor,
    syncLayer,
    syncLineStrokeStyle,
} from "./utils/jsxgraph";
import { buildLineLikeAttributes } from "./utils/buildGraphicalAttributes";

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
    const dragState = usePointerDragState();
    let previousNumVertices = useRef<number | null>(null);
    let jsxPointAttributes = useRef<Record<string, any> | null>(null);

    // Tag layout: -1 = polyline body; 0..N-1 = vertex at that index.
    const dragCoordination: DragCoordinationState<number> = {
        draggedTag: useRef<number | null>(null),
        downOnTag: useRef<number | null>(null),
    };

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
        objectRef: polylineJXG,
        destroy: () => deletePolylineJXG(),
    });

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
            ...buildLineLikeAttributes({
                SVs,
                layerOffset: LINE_LAYER_OFFSET,
                fixed: fixed.current,
                fixLocation: fixLocation.current,
                darkMode,
            }),
            visible: !SVs.hidden && validCoords,
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
            attachVertexDragHandlers(pointsJXG.current[i], i);
        }

        attachPolylineBodyDragHandlers(newPolylineJXG);
        newPolylineJXG.on("over", () => {
            highlightVertices();
        });
        newPolylineJXG.on("out", () => {
            unHighlightVertices();
        });

        previousNumVertices.current = SVs.numVertices;

        return newPolylineJXG;
    }

    function attachPolylineBodyDragHandlers(polyline: JXGCurve) {
        attachLineFamilyDragHandlers({
            jxg: polyline,
            tag: -1,
            dragState,
            coordination: dragCoordination,
            componentIdx,
            callAction,
            fixedRef: fixed,
            participatesInDownTag: false,
            suppressClickWhenDownOnOtherTag: true,
            suppressFocusOnDownWhenDownOnOtherTag: true,
            actions: {
                move: actions.movePolyline,
                focus: actions.polylineFocused,
                click: actions.polylineClicked,
            },
            snapshot: () =>
                polyline.points!.map((x) => [...x.scrCoords] as number[]),
            buildTransientMoveArgs: (e, snap) => {
                if (!polylineJXG.current || !board) {
                    return null;
                }
                polyline.updateTransformMatrix?.();
                let shiftX = polyline.transformMat![1][0];
                let shiftY = polyline.transformMat![2][0];
                const next: [number, number][] = [];
                if (
                    e.type === "pointermove" &&
                    dragState.pointerAtDown.current &&
                    snap
                ) {
                    // Compute from pointer delta rather than .X()/.Y() directly
                    // so points don't snap back to attractors on slow drags.
                    for (let j = 0; j < polyline.points!.length; j++) {
                        next.push(
                            pointerEventToUserCoords(
                                e,
                                dragState.pointerAtDown.current,
                                snap[j] as [number, number, number],
                                board,
                            ),
                        );
                    }
                } else {
                    for (let j = 0; j < polyline.points!.length; j++) {
                        next.push([
                            polyline.dataX[j] + shiftX,
                            polyline.dataY[j] + shiftY,
                        ]);
                    }
                }
                pointCoords.current = next;
                return {
                    pointCoords: next,
                    transient: true,
                    skippable: true,
                };
            },
            buildCommitMoveArgs: () =>
                pointCoords.current
                    ? { pointCoords: pointCoords.current }
                    : null,
            onDragApplied: () => {
                // Polyline keeps the reset gated on threshold (matches the
                // pre-helper behavior — sub-threshold drags are left alone
                // because the transformMat shift hasn't been refreshed).
                if (
                    !polylineJXG.current ||
                    !pointsJXG.current ||
                    dragCoordination.draggedTag.current !== -1
                ) {
                    return;
                }
                let shiftX = polyline.transformMat![1][0];
                let shiftY = polyline.transformMat![2][0];
                for (let j = 0; j < SVs.numVertices; j++) {
                    pointsJXG.current[j].coords.setCoordinates(
                        JXG.COORDS_BY_USER,
                        [...lastPositionsFromCore.current[j]],
                    );
                    polyline.dataX[j] =
                        lastPositionsFromCore.current[j][0] - shiftX;
                    polyline.dataY[j] =
                        lastPositionsFromCore.current[j][1] - shiftY;
                }
            },
            onHitExtra: () => highlightVertices(),
            onKeyFocusOutExtra: () => unHighlightVertices(),
        });
    }

    function attachVertexDragHandlers(vertex: JXGPoint, i: number) {
        attachLineFamilyDragHandlers({
            jxg: vertex,
            tag: i,
            dragState,
            coordination: dragCoordination,
            componentIdx,
            callAction,
            fixedRef: fixed,
            shouldDispatchFocusOnDown: () => !verticesFixed.current,
            actions: {
                move: actions.movePolyline,
                focus: actions.polylineFocused,
                click: actions.polylineClicked,
            },
            snapshot: () => null,
            buildTransientMoveArgs: () => {
                const map: Record<number, [number, number]> = {};
                map[i] = [vertex.X(), vertex.Y()];
                pointCoords.current = map;
                return {
                    pointCoords: map,
                    transient: true,
                    skippable: true,
                    sourceDetails: { vertex: i },
                };
            },
            buildCommitMoveArgs: (_, variant) => {
                if (!pointCoords.current) {
                    return null;
                }
                if (variant === "up") {
                    return {
                        pointCoords: pointCoords.current,
                        sourceDetails: { vertex: i },
                    };
                }
                // keyfocusout / keyEnter use sourceInformation, matching
                // the pre-helper polyline behavior.
                return {
                    pointCoords: pointCoords.current,
                    sourceInformation: { vertex: i },
                };
            },
            onDragApplied: () => {
                if (
                    !pointsJXG.current ||
                    !board ||
                    dragCoordination.draggedTag.current !== i
                ) {
                    return;
                }
                pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [
                    ...lastPositionsFromCore.current[i],
                ]);
                board.updateInfobox(pointsJXG.current[i]);
            },
            onHitExtra: () => highlightVertices(),
            onKeyFocusOutExtra: () => unHighlightVertices(),
        });
    }

    function deletePolylineJXG() {
        if (!polylineJXG.current) {
            return;
        }
        removeJXGEventHandlers(polylineJXG.current);
        board?.removeObject(polylineJXG.current);
        polylineJXG.current = null;

        if (pointsJXG.current) {
            for (let i = 0; i < SVs.numVertices; i++) {
                let point = pointsJXG.current[i];
                if (point) {
                    removeJXGEventHandlers(point);
                    board?.removeObject(point);
                }
            }
        }
        pointsJXG.current = null;
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

                    attachVertexDragHandlers(pointsJXG.current[i], i);
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
                        removeJXGEventHandlers(pt);
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
