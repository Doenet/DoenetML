import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { DocContext } from "../DocViewer";
import {
    applyLineFamilyLabelPlacement,
    buildLineFamilyLabelAttributes,
    stabilizeInitialLineFamilyLabelPlacement,
} from "./utils/jsxgraph";
import { JXGLine, JXGPoint } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";

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
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown } = dragState;
    let pointsAtDown = useRef<[number[], number[]] | null>(null);
    let draggedPoint = useRef<number | null>(null);
    let previousWithLabel = useRef<boolean | null>(null);
    let cancelInitialLabelPlacement = useRef<(() => void) | null>(null);
    let pointCoords = useRef<any>(null);
    let downOnPoint = useRef<number | null>(null);

    let lastPositionsFromCore = useRef<[number, number][] | null>(null);
    let fixed = useRef(false);
    let fixLocation = useRef(false);
    let endpointsFixed = useRef(false);

    lastPositionsFromCore.current = SVs.numericalEndpoints;
    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;
    endpointsFixed.current =
        !SVs.endpointsDraggable || SVs.fixed || SVs.fixLocation;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    React.useEffect(() => {
        return () => {
            cancelInitialLabelPlacement.current?.();
            if (lineSegmentJXG.current) {
                deleteLineSegmentJXG();
            }
        };
    }, []);

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

        let withlabel = SVs.labelForGraph !== "";

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

        //things to be passed to JSXGraph as attributes
        var jsxSegmentAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden,
            withlabel,
            fixed: fixed.current,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            strokeColor: lineColor,
            strokeOpacity: SVs.selectedStyle.lineOpacity,
            highlightStrokeColor: lineColor,
            highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
            strokeWidth: SVs.selectedStyle.lineWidth,
            highlightStrokeWidth: SVs.selectedStyle.lineWidth,
            dash: styleToDash(SVs.selectedStyle.lineStyle),
            highlight: !fixLocation.current,
        };

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

        newPoint1JXG.on("drag", (e) => onDragHandler(1, e));
        newPoint2JXG.on("drag", (e) => onDragHandler(2, e));
        newSegmentJXG.on("drag", (e) => onDragHandler(0, e));

        newPoint1JXG.on("up", () => {
            if (draggedPoint.current === 1) {
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point1coords: pointCoords.current,
                    },
                });
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.lineSegmentClicked,
                    args: { componentIdx },
                });
            }
            downOnPoint.current = null;
            pointerIsDown.current = false;
        });
        newPoint2JXG.on("up", () => {
            if (draggedPoint.current === 2) {
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point2coords: pointCoords.current,
                    },
                });
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.lineSegmentClicked,
                    args: { componentIdx },
                });
            }
            downOnPoint.current = null;
            pointerIsDown.current = false;
        });
        newSegmentJXG.on("up", function (e) {
            if (draggedPoint.current === 0) {
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point1coords: pointCoords.current[0],
                        point2coords: pointCoords.current[1],
                    },
                });
            } else if (
                !pointerMovedSinceDown.current &&
                downOnPoint.current === null &&
                !fixed.current
            ) {
                // Note: counting on fact that up on line segment will trigger before up on points
                callAction({
                    action: actions.lineSegmentClicked,
                    args: { componentIdx },
                });
            }
            pointerIsDown.current = false;
        });

        newPoint1JXG.on("keyfocusout", () => {
            if (draggedPoint.current === 1) {
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point1coords: pointCoords.current,
                    },
                });
            }
            draggedPoint.current = null;
        });
        newPoint2JXG.on("keyfocusout", () => {
            if (draggedPoint.current === 2) {
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point2coords: pointCoords.current,
                    },
                });
            }
            draggedPoint.current = null;
        });
        newSegmentJXG.on("keyfocusout", function (e) {
            if (draggedPoint.current === 0) {
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point1coords: pointCoords.current[0],
                        point2coords: pointCoords.current[1],
                    },
                });
            }
            draggedPoint.current = null;
        });

        newPoint1JXG.on("down", (e) => {
            (document.activeElement as HTMLElement | null)?.blur();

            draggedPoint.current = null;
            pointerAtDown.current = [e.x, e.y];
            downOnPoint.current = 1;
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!endpointsFixed.current) {
                callAction({
                    action: actions.lineSegmentFocused,
                    args: { componentIdx },
                });
            }
        });
        newPoint1JXG.on("hit", (e) => {
            draggedPoint.current = null;
            callAction({
                action: actions.lineSegmentFocused,
                args: { componentIdx },
            });
        });
        newPoint2JXG.on("down", (e) => {
            (document.activeElement as HTMLElement | null)?.blur();

            draggedPoint.current = null;
            pointerAtDown.current = [e.x, e.y];
            downOnPoint.current = 2;
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!endpointsFixed.current) {
                callAction({
                    action: actions.lineSegmentFocused,
                    args: { componentIdx },
                });
            }
        });
        newPoint2JXG.on("hit", (e) => {
            draggedPoint.current = null;
            callAction({
                action: actions.lineSegmentFocused,
                args: { componentIdx },
            });
        });
        newSegmentJXG.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            draggedPoint.current = null;
            pointerAtDown.current = [e.x, e.y];
            pointsAtDown.current = [
                [...point1JXG.current!.coords.scrCoords],
                [...point2JXG.current!.coords.scrCoords],
            ];
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;

            if (downOnPoint.current === null && !fixed.current) {
                // Note: counting on fact that down on line segment itself will trigger after down on points
                callAction({
                    action: actions.lineSegmentFocused,
                    args: { componentIdx },
                });
            }
        });
        newSegmentJXG.on("hit", (e) => {
            draggedPoint.current = null;
            callAction({
                action: actions.lineSegmentFocused,
                args: { componentIdx },
            });
        });

        newPoint1JXG.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (draggedPoint.current === 1) {
                    callAction({
                        action: actions.moveLineSegment,
                        args: {
                            point1coords: pointCoords.current,
                        },
                    });
                }
                draggedPoint.current = null;
                callAction({
                    action: actions.lineSegmentClicked,
                    args: { componentIdx },
                });
            }
        });

        newPoint2JXG.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (draggedPoint.current === 2) {
                    callAction({
                        action: actions.moveLineSegment,
                        args: {
                            point2coords: pointCoords.current,
                        },
                    });
                }
                draggedPoint.current = null;
                callAction({
                    action: actions.lineSegmentClicked,
                    args: { componentIdx },
                });
            }
        });

        newSegmentJXG.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (draggedPoint.current === 0) {
                    callAction({
                        action: actions.moveLineSegment,
                        args: {
                            point1coords: pointCoords.current[0],
                            point2coords: pointCoords.current[1],
                        },
                    });
                }
                draggedPoint.current = null;
                callAction({
                    action: actions.lineSegmentClicked,
                    args: { componentIdx },
                });
            }
        });

        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;

        if (withlabel && lineSegmentJXG.current.hasLabel) {
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

        previousWithLabel.current = withlabel;

        return lineSegmentJXG.current;
    }

    function onDragHandler(
        i: number,
        e: { type: string; x: number; y: number },
    ) {
        if (lineSegmentJXG.current === null || board === null) {
            return;
        }

        if (exceededDragThreshold(e, pointerAtDown.current)) {
            draggedPoint.current = i;

            if (i == 1) {
                pointCoords.current = [
                    lineSegmentJXG.current.point1.X(),
                    lineSegmentJXG.current.point1.Y(),
                ];
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point1coords: pointCoords.current,
                        transient: true,
                        skippable: true,
                        sourceDetails: { endpoint: i },
                    },
                });
            } else if (i == 2) {
                pointCoords.current = [
                    lineSegmentJXG.current.point2.X(),
                    lineSegmentJXG.current.point2.Y(),
                ];
                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point2coords: pointCoords.current,
                        transient: true,
                        skippable: true,
                        sourceDetails: { endpoint: i },
                    },
                });
            } else {
                pointCoords.current = [];

                if (
                    e.type === "pointermove" &&
                    pointerAtDown.current &&
                    pointsAtDown.current
                ) {
                    // Compute from pointer delta rather than .X()/.Y() directly
                    // so points don't snap back to attractors on slow drags.
                    for (let j = 0; j < 2; j++) {
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
                    pointCoords.current.push([
                        lineSegmentJXG.current.point1.X(),
                        lineSegmentJXG.current.point1.Y(),
                    ]);
                    pointCoords.current.push([
                        lineSegmentJXG.current.point2.X(),
                        lineSegmentJXG.current.point2.Y(),
                    ]);
                }

                callAction({
                    action: actions.moveLineSegment,
                    args: {
                        point1coords: pointCoords.current[0],
                        point2coords: pointCoords.current[1],
                        transient: true,
                        skippable: true,
                    },
                });
            }
        }

        lineSegmentJXG.current.point1.coords.setCoordinates(
            JXG.COORDS_BY_USER,
            lastPositionsFromCore.current![0],
        );
        lineSegmentJXG.current.point2.coords.setCoordinates(
            JXG.COORDS_BY_USER,
            lastPositionsFromCore.current![1],
        );
        if (i == 1) {
            board.updateInfobox(lineSegmentJXG.current.point1);
        } else if (i == 2) {
            board.updateInfobox(lineSegmentJXG.current.point2);
        }
    }

    function deleteLineSegmentJXG() {
        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;
        if (lineSegmentJXG.current) {
            lineSegmentJXG.current.off("drag");
            lineSegmentJXG.current.off("down");
            lineSegmentJXG.current.off("hit");
            lineSegmentJXG.current.off("up");
            lineSegmentJXG.current.off("keydown");
            lineSegmentJXG.current.off("keyfocusout");
            board?.removeObject(lineSegmentJXG.current);
            lineSegmentJXG.current = null;
        }

        if (point1JXG.current) {
            point1JXG.current.off("drag");
            point1JXG.current.off("down");
            point1JXG.current.off("hit");
            point1JXG.current.off("up");
            point1JXG.current.off("keydown");
            point1JXG.current.off("keyfocusout");
            board?.removeObject(point1JXG.current);
            point1JXG.current = null;
        }

        if (point2JXG.current) {
            point2JXG.current.off("drag");
            point2JXG.current.off("down");
            point2JXG.current.off("hit");
            point2JXG.current.off("up");
            point2JXG.current.off("keydown");
            point2JXG.current.off("keyfocusout");
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

            if (validCoords) {
                let actuallyChangedVisibility =
                    lineSegmentJXG.current.visProp["visible"] !== visible;
                lineSegmentJXG.current.visProp["visible"] = visible;
                lineSegmentJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // at least for point, this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    lineSegmentJXG.current.setAttribute({ visible: visible });
                }
            } else {
                lineSegmentJXG.current.visProp["visible"] = false;
                lineSegmentJXG.current.visPropCalc["visible"] = false;
            }

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

            let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
            let layerChanged = lineSegmentJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                lineSegmentJXG.current.setAttribute({ layer });
                point1JXG.current.setAttribute({
                    layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
                });
                point2JXG.current.setAttribute({
                    layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
                });
            }

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

            if (lineSegmentJXG.current.visProp.strokecolor !== lineColor) {
                lineSegmentJXG.current.visProp.strokecolor = lineColor;
                lineSegmentJXG.current.visProp.highlightstrokecolor = lineColor;
            }
            if (
                lineSegmentJXG.current.visProp.strokewidth !==
                SVs.selectedStyle.lineWidth
            ) {
                lineSegmentJXG.current.visProp.strokewidth =
                    SVs.selectedStyle.lineWidth;
                lineSegmentJXG.current.visProp.highlightstrokewidth =
                    SVs.selectedStyle.lineWidth;
            }
            if (
                lineSegmentJXG.current.visProp.strokeopacity !==
                SVs.selectedStyle.lineOpacity
            ) {
                lineSegmentJXG.current.visProp.strokeopacity =
                    SVs.selectedStyle.lineOpacity;
                lineSegmentJXG.current.visProp.highlightstrokeopacity =
                    SVs.selectedStyle.lineOpacity * 0.5;
            }
            let newDash = styleToDash(SVs.selectedStyle.lineStyle);
            if (lineSegmentJXG.current.visProp.dash !== newDash) {
                lineSegmentJXG.current.visProp.dash = newDash;
            }

            lineSegmentJXG.current.name = SVs.labelForGraph;

            let withlabel = SVs.labelForGraph !== "";
            if (withlabel != previousWithLabel.current) {
                lineSegmentJXG.current.setAttribute({ withlabel: withlabel });
                previousWithLabel.current = withlabel;
            }

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
                if (SVs.applyStyleToLabel) {
                    label.visProp.strokecolor = lineColor;
                } else {
                    label.visProp.strokecolor = "var(--canvasText)";
                }

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
