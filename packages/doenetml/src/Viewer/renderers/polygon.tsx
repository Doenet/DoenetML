import React, { useContext, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { DocContext } from "../DocViewer";
import { JXGPolygon, JXGPoint } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import {
    resolveLineColor,
    resolveFillColor,
    resolveHandleColor,
    resolveCanvasColor,
} from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";
import {
    DragCoordinationState,
    attachLineFamilyDragHandlers,
} from "./utils/lineFamilyDragHandlers";
import {
    removeJXGEventHandlers,
    syncLabelMaskCssStyle,
    syncLabelStrokeColor,
    syncLayer,
    syncLineStrokeStyle,
    syncVisPropValues,
} from "./utils/jsxgraph";
import {
    attachLabelHoverHighlight,
    computeLabelMaskCssStyle,
} from "./utils/labelMaskStyle";
import { buildBaseAttributes } from "./utils/buildGraphicalAttributes";
import { getPatternFillAttributes } from "./utils/fillPatterns";

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
    const dragState = usePointerDragState();
    let previousNumVertices = useRef<number | null>(null);
    let jsxPointAttributes = useRef<Record<string, any> | null>(null);
    // Vertex drag handlers are only attached while vertices are draggable
    // (they have no hit target while the vertex points are invisible), so a
    // fixed polygon skips ~10 handler closures per vertex.
    let vertexHandlersAttached = useRef(false);
    // Whether the JSXGraph polygon was created with border segments. A
    // zero-width line style skips creating the N border elements entirely
    // (the polygon renders its own filled path); if the style later gains a
    // visible border, the polygon is recreated.
    let createdWithBorders = useRef(true);

    // Tag layout: -1 = polygon body; 0..N-1 = vertex at that index.
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

    const { darkMode, reportGraphElementUp } = useContext(DocContext) || {};
    const sourceNavigation = reportGraphElementUp
        ? { domId: id, report: reportGraphElementUp }
        : undefined;

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
        const resolvedFillColor = SVs.filled
            ? resolveFillColor(SVs.selectedStyle, darkMode)
            : "none";
        const fillAttributes =
            SVs.filled && board
                ? getPatternFillAttributes({
                      defsEl: board.renderer.defs as SVGDefsElement | null,
                      boardId: board.container.id,
                      fillStyle: SVs.selectedStyle.fillStyle ?? "solid",
                      fillColor: resolvedFillColor,
                      fillOpacity: SVs.selectedStyle.fillOpacity,
                      canvasColor: resolveCanvasColor(darkMode),
                      fillPatternOpacity: SVs.selectedStyle.fillPatternOpacity,
                      highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
                  })
                : {
                      fillColor: resolvedFillColor,
                      fillOpacity: SVs.selectedStyle.fillOpacity,
                      highlightFillColor: resolvedFillColor,
                      highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
                  };

        jsxPointAttributes.current = {
            fillColor: "none",
            strokeColor: "none",
            highlightStrokeColor: "none",
            highlightFillColor: resolveHandleColor(darkMode),
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

        // A zero-width line can never render a border, so skip creating the
        // N border segment elements entirely (each is a full JSXGraph line
        // with its own deep-copied attributes). The polygon element renders
        // its own filled path regardless.
        const needBorders = SVs.selectedStyle.lineWidth > 0;

        let jsxPolygonAttributes: Record<string, any> = {
            ...buildBaseAttributes({
                SVs,
                layerOffset: LINE_LAYER_OFFSET,
                fixed: fixed.current,
                fixLocation: fixLocation.current,
            }),

            //specific to polygon
            fillColor: fillAttributes.fillColor,
            fillOpacity: fillAttributes.fillOpacity,
            highlightFillColor: fillAttributes.highlightFillColor,
            highlightFillOpacity: fillAttributes.highlightFillOpacity,
            vertices: jsxPointAttributes.current,
            borders: jsxBorderAttributes,
            withLines: needBorders,
        };

        jsxPolygonAttributes.label = {
            highlight: false,
            ...computeLabelMaskCssStyle({
                layer: SVs.layer,
                masked: SVs.maskLabel,
            }),
            highlightStrokeOpacity: 1,
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
        createdWithBorders.current = needBorders;

        attachLabelHoverHighlight({
            hoverTargetJXG: newPolygonJXG,
            getLabelJXG: () => polygonJXG.current?.label,
            ...computeLabelMaskCssStyle({
                layer: SVs.layer,
                masked: SVs.maskLabel,
            }),
            board,
        });

        // Vertex handlers have no hit target while the vertex points are
        // invisible (non-draggable vertices), so attach them only when
        // draggable; the update path attaches them later if vertices become
        // draggable.
        if (!verticesFixed.current) {
            initializePoints(newPolygonJXG);
            vertexHandlersAttached.current = true;
        } else {
            vertexHandlersAttached.current = false;
        }

        attachPolygonBodyDragHandlers(newPolygonJXG);

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
            attachPolygonVertexDragHandlers(vertex, i);
        }
    }

    function attachPolygonBodyDragHandlers(polygon: JXGPolygon) {
        attachLineFamilyDragHandlers({
            sourceNavigation,
            jxg: polygon,
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
                move: actions.movePolygon,
                focus: actions.polygonFocused,
                click: actions.polygonClicked,
            },
            snapshot: () =>
                polygon.vertices.map(
                    (x) => [...x.coords.scrCoords] as number[],
                ),
            buildTransientMoveArgs: (e, snap) => {
                if (!polygonJXG.current || !board) {
                    return null;
                }
                const next: [number, number][] = [];
                if (
                    e.type === "pointermove" &&
                    dragState.pointerAtDown.current &&
                    snap
                ) {
                    // Compute from pointer delta rather than .X()/.Y() directly
                    // so points don't snap back to attractors on slow drags.
                    for (let j = 0; j < polygon.vertices.length - 1; j++) {
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
                    for (let j = 0; j < polygon.vertices.length - 1; j++) {
                        const v = polygon.vertices[j];
                        next.push([v.X(), v.Y()]);
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
                if (
                    !polygonJXG.current ||
                    dragCoordination.draggedTag.current !== -1
                ) {
                    return;
                }
                for (let j = 0; j < SVs.numVertices; j++) {
                    polygon.vertices[j].coords.setCoordinates(
                        JXG.COORDS_BY_USER,
                        [...lastPositionsFromCore.current[j]],
                    );
                }
            },
            onHitExtra: () => highlightVertices(),
            onKeyFocusOutExtra: () => unHighlightVertices(),
        });
    }

    function attachPolygonVertexDragHandlers(vertex: JXGPoint, i: number) {
        attachLineFamilyDragHandlers({
            sourceNavigation,
            jxg: vertex,
            tag: i,
            dragState,
            coordination: dragCoordination,
            componentIdx,
            callAction,
            fixedRef: fixed,
            shouldDispatchFocusOnDown: () => !verticesFixed.current,
            actions: {
                move: actions.movePolygon,
                focus: actions.polygonFocused,
                click: actions.polygonClicked,
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
                return {
                    pointCoords: pointCoords.current,
                    sourceInformation: { vertex: i },
                };
            },
            onDragApplied: () => {
                if (
                    !polygonJXG.current ||
                    !board ||
                    dragCoordination.draggedTag.current !== i
                ) {
                    return;
                }
                polygonJXG.current.vertices[i].coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    [...lastPositionsFromCore.current[i]],
                );
                board.updateInfobox(polygonJXG.current.vertices[i]);
            },
            onHitExtra: () => highlightVertices(),
            onKeyFocusOutExtra: () => unHighlightVertices(),
        });
    }

    function deletePolygonJXG() {
        if (!polygonJXG.current) {
            return;
        }
        vertexHandlersAttached.current = false;
        for (let i = 0; i < SVs.numVertices; i++) {
            let vertex = polygonJXG.current.vertices[i];
            if (vertex) {
                removeJXGEventHandlers(vertex);
            }
        }
        removeJXGEventHandlers(polygonJXG.current);
        board?.removeObject(polygonJXG.current);
        polygonJXG.current = null;

        for (const pt of pointsJXG.current) {
            board?.removeObject(pt);
        }
        pointsJXG.current = [];
    }

    function highlightVertices() {
        if (!verticesFixed.current && polygonJXG.current) {
            for (let [i, vertex] of polygonJXG.current.vertices.entries()) {
                if (vertexIndicesDraggable.current.includes(i)) {
                    vertex.setAttribute({ fillcolor: "var(--canvasText)" });
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
        } else if (
            SVs.selectedStyle.lineWidth > 0 !==
            createdWithBorders.current
        ) {
            // the polygon was created without border segments (zero-width
            // line) and now needs them, or vice versa; recreate it
            deletePolygonJXG();
            polygonJXG.current = createPolygonJXG();
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

            const handleColor = resolveHandleColor(darkMode);
            jsxPointAttributes.current!.highlightFillColor = handleColor;

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
                // The vertex set changed, so newly added vertices have no drag
                // handlers yet. Clear the flag; the lazy (re)attach below
                // handles them if the vertices are draggable.
                vertexHandlersAttached.current = false;
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
                // The vertex set changed, so handler-to-vertex bindings are
                // stale. Clear the flag; the lazy (re)attach below handles it.
                vertexHandlersAttached.current = false;
            }

            // (Re)attach vertex drag handlers if the vertices are draggable —
            // either they became draggable since creation, or the vertex set
            // just changed (including vertices added while the polygon was
            // fixed). initializePoints removes any existing handlers first, so
            // this is idempotent and never double-attaches.
            if (!verticesFixed.current && !vertexHandlersAttached.current) {
                initializePoints(polygonJXG.current);
                vertexHandlersAttached.current = true;
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
                syncVisPropValues(polygonJXG.current.vertices[i], {
                    highlightfillcolor: handleColor,
                });
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
            const resolvedFillColor = SVs.filled
                ? resolveFillColor(SVs.selectedStyle, darkMode)
                : "none";
            const fillAttributes =
                SVs.filled && board
                    ? getPatternFillAttributes({
                          defsEl: board.renderer.defs as SVGDefsElement | null,
                          boardId: board.container.id,
                          fillStyle: SVs.selectedStyle.fillStyle ?? "solid",
                          fillColor: resolvedFillColor,
                          fillOpacity: SVs.selectedStyle.fillOpacity,
                          canvasColor: resolveCanvasColor(darkMode),
                          fillPatternOpacity:
                              SVs.selectedStyle.fillPatternOpacity,
                          highlightFillOpacity:
                              SVs.selectedStyle.fillOpacity * 0.5,
                      })
                    : {
                          fillColor: resolvedFillColor,
                          fillOpacity: SVs.selectedStyle.fillOpacity,
                          highlightFillColor: resolvedFillColor,
                          highlightFillOpacity:
                              SVs.selectedStyle.fillOpacity * 0.5,
                      };

            polygonJXG.current.name = SVs.labelForGraph;

            if (polygonJXG.current.hasLabel && polygonJXG.current.label) {
                const label = polygonJXG.current.label;
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);
                syncLabelMaskCssStyle(label, SVs.layer, {
                    maskLabel: SVs.maskLabel,
                });
                label.needsUpdate = true;
                label.update();
            }

            if (
                polygonJXG.current.visProp.fillcolor !==
                fillAttributes.fillColor
            ) {
                polygonJXG.current.visProp.fillcolor = fillAttributes.fillColor;
                polygonJXG.current.visProp.highlightfillcolor =
                    fillAttributes.highlightFillColor;
                polygonJXG.current.visProp.hasinnerpoints = SVs.filled;
            }

            if (
                polygonJXG.current.visProp.fillopacity !==
                fillAttributes.fillOpacity
            ) {
                polygonJXG.current.visProp.fillopacity =
                    fillAttributes.fillOpacity;
                polygonJXG.current.visProp.highlightfillopacity =
                    fillAttributes.highlightFillOpacity;
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
