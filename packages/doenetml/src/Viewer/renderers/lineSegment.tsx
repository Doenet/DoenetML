import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { DocContext } from "../DocViewer";
import {
    applyLineFamilyLabelPlacement,
    buildLineFamilyLabelAttributes,
    removeJXGEventHandlers,
    stabilizeInitialLineFamilyLabelPlacement,
    syncLabelStrokeColor,
    syncLayer,
    syncLineFamilyVisibility,
    syncLineStrokeStyle,
    syncWithLabelToggle,
} from "./utils/jsxgraph";
import { buildLineLikeAttributes } from "./utils/buildGraphicalAttributes";
import { JXGLine, JXGPoint } from "./jsxgraph-distrib/types";
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

interface LineSegmentSVs extends DraggableGraphicalSVs {
    numericalEndpoints: [number, number][];
    endpointsDraggable: boolean;
    showCoordsWhenDragging: boolean;
}

export default React.memo(function LineSegment(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, sourceOfUpdate, callAction } =
        useDoenetRenderer<LineSegmentSVs>(props);

    // @ts-ignore
    LineSegment.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let lineSegmentJXG = useRef<JXGLine | null>(null);
    let point1JXG = useRef<JXGPoint | null>(null);
    let point2JXG = useRef<JXGPoint | null>(null);

    const dragState = usePointerDragState();
    let previousWithLabel = useRef<boolean | null>(null);
    let cancelInitialLabelPlacement = useRef<(() => void) | null>(null);
    let pointCoords = useRef<any>(null);

    const dragCoordination: DragCoordinationState<number> = {
        draggedTag: useRef<number | null>(null),
        downOnTag: useRef<number | null>(null),
    };

    const {
        lastPositionFromCore: lastPositionsFromCore,
        fixed,
        fixLocation,
    } = useDraggableRefs<[number, number][]>(SVs, SVs.numericalEndpoints);
    let endpointsFixed = useRef(false);
    endpointsFixed.current =
        !SVs.endpointsDraggable || SVs.fixed || SVs.fixLocation;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    useJSXGraphCleanup({
        objectRef: lineSegmentJXG,
        destroy: () => deleteLineSegmentJXG(),
        cancelLabelPlacementRef: cancelInitialLabelPlacement,
    });

    function createLineSegmentJXG() {
        if (board === null) {
            return null;
        }

        if (
            SVs.numericalEndpoints.length !== 2 ||
            SVs.numericalEndpoints.some(
                (x) => x.length !== 2 || x.some((v) => !Number.isFinite(v)),
            )
        ) {
            lineSegmentJXG.current = null;
            point1JXG.current = null;
            point2JXG.current = null;
            return;
        }

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

        //things to be passed to JSXGraph as attributes
        var jsxSegmentAttributes: Record<string, any> = buildLineLikeAttributes(
            {
                SVs,
                layerOffset: LINE_LAYER_OFFSET,
                fixed: fixed.current,
                fixLocation: fixLocation.current,
                darkMode,
            },
        );

        jsxSegmentAttributes.label = buildLineFamilyLabelAttributes({
            labelForGraph: SVs.labelForGraph,
            labelPosition: SVs.labelPosition,
            labelHasLatex: SVs.labelHasLatex,
            applyStyleToLabel: SVs.applyStyleToLabel,
            lineColor,
        });

        let endpointsVisible = !endpointsFixed.current && !SVs.hidden;

        let jsxPointAttributes = Object.assign({}, jsxSegmentAttributes);
        Object.assign(jsxPointAttributes, {
            withlabel: false,
            fixed: false,
            highlight: true,
            fillColor: "none",
            strokeColor: "none",
            highlightStrokeColor: "none",
            highlightFillColor: getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray"),
            layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
            showInfoBox: SVs.showCoordsWhenDragging,
            visible: endpointsVisible,
        });

        let endpoints = [
            [...SVs.numericalEndpoints[0]],
            [...SVs.numericalEndpoints[1]],
        ];

        // create invisible points at endpoints
        const newPoint1JXG: JXGPoint = board.create(
            "point",
            endpoints[0],
            jsxPointAttributes,
        );
        const newPoint2JXG: JXGPoint = board.create(
            "point",
            endpoints[1],
            jsxPointAttributes,
        );
        point1JXG.current = newPoint1JXG;
        point2JXG.current = newPoint2JXG;

        const newSegmentJXG: JXGLine = board.create(
            "segment",
            [newPoint1JXG, newPoint2JXG],
            jsxSegmentAttributes,
        );
        lineSegmentJXG.current = newSegmentJXG;
        newSegmentJXG.isDraggable = !fixLocation.current;

        const segmentBuildCommit = (): Record<string, any> | null => {
            if (!pointCoords.current) {
                return null;
            }
            return {
                point1coords: pointCoords.current[0],
                point2coords: pointCoords.current[1],
            };
        };

        attachLineFamilyDragHandlers({
            jxg: newSegmentJXG,
            tag: 0,
            dragState,
            coordination: dragCoordination,
            componentIdx,
            callAction,
            fixedRef: fixed,
            participatesInDownTag: false,
            suppressClickWhenDownOnOtherTag: true,
            suppressFocusOnDownWhenDownOnOtherTag: true,
            actions: {
                move: actions.moveLineSegment,
                focus: actions.lineSegmentFocused,
                click: actions.lineSegmentClicked,
            },
            snapshot: () =>
                [
                    [...point1JXG.current!.coords.scrCoords],
                    [...point2JXG.current!.coords.scrCoords],
                ] as [number[], number[]],
            buildTransientMoveArgs: (e, snap) => {
                const next: [number, number][] = [];
                if (
                    e.type === "pointermove" &&
                    dragState.pointerAtDown.current &&
                    snap
                ) {
                    // Compute from pointer delta rather than .X()/.Y() directly
                    // so points don't snap back to attractors on slow drags.
                    for (let j = 0; j < 2; j++) {
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
                    next.push([
                        newSegmentJXG.point1.X(),
                        newSegmentJXG.point1.Y(),
                    ]);
                    next.push([
                        newSegmentJXG.point2.X(),
                        newSegmentJXG.point2.Y(),
                    ]);
                }
                pointCoords.current = next;
                return {
                    point1coords: next[0],
                    point2coords: next[1],
                    transient: true,
                    skippable: true,
                };
            },
            buildCommitMoveArgs: () => segmentBuildCommit(),
            onDragApplied: () => {
                newSegmentJXG.point1.coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    lastPositionsFromCore.current[0],
                );
                newSegmentJXG.point2.coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    lastPositionsFromCore.current[1],
                );
            },
        });

        function attachEndpointHandlers(
            point: JXGPoint,
            tagN: 1 | 2,
            argKey: "point1coords" | "point2coords",
        ) {
            attachLineFamilyDragHandlers({
                jxg: point,
                tag: tagN,
                dragState,
                coordination: dragCoordination,
                componentIdx,
                callAction,
                fixedRef: fixed,
                shouldDispatchFocusOnDown: () => !endpointsFixed.current,
                actions: {
                    move: actions.moveLineSegment,
                    focus: actions.lineSegmentFocused,
                    click: actions.lineSegmentClicked,
                },
                snapshot: () => null,
                buildTransientMoveArgs: () => {
                    const coords: [number, number] = [point.X(), point.Y()];
                    pointCoords.current = coords;
                    return {
                        [argKey]: coords,
                        transient: true,
                        skippable: true,
                        sourceDetails: { endpoint: tagN },
                    };
                },
                buildCommitMoveArgs: () => ({
                    [argKey]: pointCoords.current,
                }),
                onDragApplied: () => {
                    newSegmentJXG.point1.coords.setCoordinates(
                        JXG.COORDS_BY_USER,
                        lastPositionsFromCore.current[0],
                    );
                    newSegmentJXG.point2.coords.setCoordinates(
                        JXG.COORDS_BY_USER,
                        lastPositionsFromCore.current[1],
                    );
                    if (board) {
                        board.updateInfobox(
                            tagN === 1
                                ? newSegmentJXG.point1
                                : newSegmentJXG.point2,
                        );
                    }
                },
            });
        }

        attachEndpointHandlers(newPoint1JXG, 1, "point1coords");
        attachEndpointHandlers(newPoint2JXG, 2, "point2coords");

        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;

        if (SVs.labelForGraph !== "" && lineSegmentJXG.current.hasLabel) {
            const createdLineSegment = lineSegmentJXG.current;
            cancelInitialLabelPlacement.current =
                stabilizeInitialLineFamilyLabelPlacement({
                    board,
                    lineLike: createdLineSegment,
                    applyPlacement: (forceFullUpdate) => {
                        if (
                            !lineSegmentJXG.current ||
                            lineSegmentJXG.current !== createdLineSegment ||
                            !lineSegmentJXG.current.hasLabel
                        ) {
                            return false;
                        }
                        applyLineFamilyLabelPlacement({
                            board,
                            lineLike: lineSegmentJXG.current,
                            labelPosition: SVs.labelPosition,
                            forceFullUpdate,
                        });
                        return true;
                    },
                });
        }

        previousWithLabel.current = SVs.labelForGraph !== "";

        return lineSegmentJXG.current;
    }

    function deleteLineSegmentJXG() {
        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;
        if (lineSegmentJXG.current) {
            removeJXGEventHandlers(lineSegmentJXG.current);
            board?.removeObject(lineSegmentJXG.current);
            lineSegmentJXG.current = null;
        }

        if (point1JXG.current) {
            removeJXGEventHandlers(point1JXG.current);
            board?.removeObject(point1JXG.current);
            point1JXG.current = null;
        }

        if (point2JXG.current) {
            removeJXGEventHandlers(point2JXG.current);
            board?.removeObject(point2JXG.current);
            point2JXG.current = null;
        }
    }

    if (board) {
        if (lineSegmentJXG.current === null) {
            createLineSegmentJXG();
        } else if (
            SVs.numericalEndpoints.length !== 2 ||
            SVs.numericalEndpoints.some(
                (x) => x.length !== 2 || x.some((v) => !Number.isFinite(v)),
            )
        ) {
            deleteLineSegmentJXG();
        } else if (point1JXG.current && point2JXG.current) {
            let validCoords = true;

            for (let coords of [
                SVs.numericalEndpoints[0],
                SVs.numericalEndpoints[1],
            ]) {
                if (!Number.isFinite(coords[0])) {
                    validCoords = false;
                }
                if (!Number.isFinite(coords[1])) {
                    validCoords = false;
                }
            }

            lineSegmentJXG.current.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalEndpoints[0],
            );
            lineSegmentJXG.current.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalEndpoints[1],
            );

            if (
                sourceOfUpdate.sourceInformation &&
                componentIdx in sourceOfUpdate.sourceInformation
            ) {
                let sourceInfo = sourceOfUpdate.sourceInformation[componentIdx];
                if (typeof sourceInfo === "object" && sourceInfo) {
                    let ind = (sourceInfo as any).endpoint;
                    if (ind === 1) {
                        board.updateInfobox(lineSegmentJXG.current.point1);
                    } else if (ind === 2) {
                        board.updateInfobox(lineSegmentJXG.current.point2);
                    }
                }
            }

            let visible = !SVs.hidden && validCoords;

            syncLineFamilyVisibility(
                lineSegmentJXG.current,
                visible,
                validCoords,
            );

            let endpointsVisible = !endpointsFixed.current && visible;

            point1JXG.current.visProp["visible"] = endpointsVisible;
            point1JXG.current.visPropCalc["visible"] = endpointsVisible;
            point2JXG.current.visProp["visible"] = endpointsVisible;
            point2JXG.current.visPropCalc["visible"] = endpointsVisible;

            point1JXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;
            point2JXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;

            lineSegmentJXG.current.visProp.fixed = fixed.current;
            lineSegmentJXG.current.visProp.highlight = !fixLocation.current;
            lineSegmentJXG.current.isDraggable = !fixLocation.current;

            // Endpoint layers must follow the segment's layer when it changes.
            if (
                syncLayer(lineSegmentJXG.current, SVs.layer, LINE_LAYER_OFFSET)
            ) {
                const vertexLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
                point1JXG.current.setAttribute({ layer: vertexLayer });
                point2JXG.current.setAttribute({ layer: vertexLayer });
            }

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

            syncLineStrokeStyle(lineSegmentJXG.current, {
                lineColor,
                lineWidth: SVs.selectedStyle.lineWidth,
                lineOpacity: SVs.selectedStyle.lineOpacity,
                dash: styleToDash(SVs.selectedStyle.lineStyle),
            });

            lineSegmentJXG.current.name = SVs.labelForGraph;

            syncWithLabelToggle(
                lineSegmentJXG.current,
                SVs.labelForGraph,
                previousWithLabel,
            );

            if (point1JXG.current.highlighted) {
                board.updateInfobox(point1JXG.current);
            } else if (point2JXG.current.highlighted) {
                board.updateInfobox(point2JXG.current);
            }

            lineSegmentJXG.current.needsUpdate = true;
            lineSegmentJXG.current.update();
            if (
                lineSegmentJXG.current.hasLabel &&
                lineSegmentJXG.current.label
            ) {
                const label = lineSegmentJXG.current.label;
                label.needsUpdate = true;
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);

                applyLineFamilyLabelPlacement({
                    board,
                    lineLike: lineSegmentJXG.current,
                    labelPosition: SVs.labelPosition,
                });
            }
            point1JXG.current.needsUpdate = true;
            point1JXG.current.update();
            point2JXG.current.needsUpdate = true;
            point2JXG.current.update();

            board.updateRenderer();
        }
        return (
            <>
                <span id={id} />
            </>
        );
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
