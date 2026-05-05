import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { DocContext } from "../DocViewer";
import {
    applyLineFamilyLabelPlacement,
    buildLineFamilyLabelAttributes,
    stabilizeInitialLineFamilyLabelPlacement,
} from "./utils/jsxgraph";
import { JXGLine } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";

interface RaySVs extends DraggableGraphicalSVs {
    numericalEndpoint: [number, number];
    numericalThroughpoint: [number, number];
}

export default React.memo(function Ray(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, callAction } =
        useDoenetRenderer<RaySVs>(props);

    // @ts-ignore
    Ray.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let rayJXG = useRef<JXGLine | null>(null);

    const dragState = usePointerDragState();
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown, dragged } =
        dragState;
    let pointsAtDown = useRef<[number[], number[]] | null>(null);

    let previousWithLabel = useRef<boolean | null>(null);
    let cancelInitialLabelPlacement = useRef<(() => void) | null>(null);
    let pointCoords = useRef<[number, number][] | null>(null);

    let lastEndpointFromCore = useRef<[number, number] | null>(null);
    let lastThroughpointFromCore = useRef<[number, number] | null>(null);
    let fixed = useRef(false);
    let fixLocation = useRef(false);

    lastEndpointFromCore.current = SVs.numericalEndpoint;
    lastThroughpointFromCore.current = SVs.numericalThroughpoint;
    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    React.useEffect(() => {
        return () => {
            cancelInitialLabelPlacement.current?.();
            if (rayJXG.current !== null) {
                deleteRayJXG();
            }
        };
    }, []);

    function createRayJXG() {
        if (board === null) {
            return null;
        }
        if (
            SVs.numericalEndpoint.length !== 2 ||
            SVs.numericalThroughpoint.length !== 2
        ) {
            rayJXG.current = null;
            return;
        }

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

        //things to be passed to JSXGraph as attributes
        var jsxRayAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden,
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
            straightFirst: false,
        };

        jsxRayAttributes.label = buildLineFamilyLabelAttributes({
            labelForGraph: SVs.labelForGraph,
            labelPosition: SVs.labelPosition,
            labelHasLatex: SVs.labelHasLatex,
            applyStyleToLabel: SVs.applyStyleToLabel,
            lineColor,
        });

        let through = [
            [...SVs.numericalEndpoint],
            [...SVs.numericalThroughpoint],
        ];

        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;

        let newRayJXG: JXGLine = board.create(
            "line",
            through,
            jsxRayAttributes,
        );
        newRayJXG.isDraggable = !fixLocation.current;

        newRayJXG.on("drag", function (e) {
            if (exceededDragThreshold(e, pointerAtDown.current)) {
                dragged.current = true;

                pointCoords.current = [];

                if (
                    e.type === "pointermove" &&
                    pointerAtDown.current &&
                    pointsAtDown.current
                ) {
                    // Compute from pointer delta rather than .X()/.Y() directly
                    // so points don't snap back to attractors on slow drags.
                    for (let i = 0; i < 2; i++) {
                        pointCoords.current.push(
                            pointerEventToUserCoords(
                                e,
                                pointerAtDown.current,
                                pointsAtDown.current[i] as [
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
                        newRayJXG.point1.X(),
                        newRayJXG.point1.Y(),
                    ]);
                    pointCoords.current.push([
                        newRayJXG.point2.X(),
                        newRayJXG.point2.Y(),
                    ]);
                }

                callAction({
                    action: actions.moveRay,
                    args: {
                        endpointcoords: pointCoords.current[0],
                        throughcoords: pointCoords.current[1],
                        transient: true,
                        skippable: true,
                    },
                });
            }

            newRayJXG.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastEndpointFromCore.current,
            );
            newRayJXG.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastThroughpointFromCore.current,
            );
        });

        newRayJXG.on("up", function (e) {
            if (dragged.current) {
                callAction({
                    action: actions.moveRay,
                    args: {
                        endpointcoords: pointCoords.current?.[0],
                        throughcoords: pointCoords.current?.[1],
                    },
                });
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.rayClicked,
                    args: { componentIdx },
                });
            }
            pointerIsDown.current = false;
        });

        newRayJXG.on("keyfocusout", function (e) {
            if (dragged.current) {
                callAction({
                    action: actions.moveRay,
                    args: {
                        point1coords: pointCoords.current?.[0],
                        point2coords: pointCoords.current?.[1],
                    },
                });
                dragged.current = false;
            }
        });

        newRayJXG.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            dragged.current = false;
            pointerAtDown.current = [e.x, e.y];
            pointsAtDown.current = [
                [...newRayJXG.point1.coords.scrCoords],
                [...newRayJXG.point2.coords.scrCoords],
            ];
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.rayFocused,
                    args: { componentIdx },
                });
            }
        });

        newRayJXG.on("hit", function (e) {
            dragged.current = false;
            callAction({
                action: actions.rayFocused,
                args: { componentIdx },
            });
        });

        newRayJXG.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    callAction({
                        action: actions.moveRay,
                        args: {
                            point1coords: pointCoords.current?.[0],
                            point2coords: pointCoords.current?.[1],
                        },
                    });
                    dragged.current = false;
                }

                callAction({
                    action: actions.rayClicked,
                    args: { componentIdx },
                });
            }
        });

        rayJXG.current = newRayJXG;

        if (SVs.labelForGraph !== "" && newRayJXG.hasLabel) {
            cancelInitialLabelPlacement.current =
                stabilizeInitialLineFamilyLabelPlacement({
                    board,
                    lineLike: newRayJXG,
                    applyPlacement: (forceFullUpdate) => {
                        if (
                            rayJXG.current !== newRayJXG ||
                            !newRayJXG.hasLabel
                        ) {
                            return false;
                        }
                        applyLineFamilyLabelPlacement({
                            board,
                            lineLike: newRayJXG,
                            labelPosition: SVs.labelPosition,
                            forceFullUpdate,
                            setNeedsUpdateOnNoChange: true,
                        });
                        return true;
                    },
                });
        }

        previousWithLabel.current = SVs.labelForGraph !== "";
    }

    function deleteRayJXG() {
        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;
        if (!rayJXG.current) {
            return;
        }
        rayJXG.current.off("drag");
        rayJXG.current.off("down");
        rayJXG.current.off("hit");
        rayJXG.current.off("up");
        rayJXG.current.off("keyfocusout");
        rayJXG.current.off("keydown");
        board?.removeObject(rayJXG.current);
        rayJXG.current = null;
    }

    if (board) {
        if (rayJXG.current === null) {
            createRayJXG();
        } else if (
            SVs.numericalEndpoint.length !== 2 ||
            SVs.numericalThroughpoint.length !== 2
        ) {
            deleteRayJXG();
        } else {
            let validCoords = true;

            for (let coords of [
                SVs.numericalEndpoint,
                SVs.numericalThroughpoint,
            ]) {
                if (!Number.isFinite(coords[0])) {
                    validCoords = false;
                }
                if (!Number.isFinite(coords[1])) {
                    validCoords = false;
                }
            }

            rayJXG.current.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalEndpoint,
            );
            rayJXG.current.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalThroughpoint,
            );

            let visible = !SVs.hidden;

            if (validCoords) {
                let actuallyChangedVisibility =
                    rayJXG.current.visProp["visible"] !== visible;
                rayJXG.current.visProp["visible"] = visible;
                rayJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // at least for point, this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    rayJXG.current.setAttribute({ visible: visible });
                }
            } else {
                rayJXG.current.visProp["visible"] = false;
                rayJXG.current.visPropCalc["visible"] = false;
            }

            rayJXG.current.visProp.fixed = fixed.current;
            rayJXG.current.visProp.highlight = !fixLocation.current;
            rayJXG.current.isDraggable = !fixLocation.current;

            let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
            let layerChanged = rayJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                rayJXG.current.setAttribute({ layer });
            }

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

            if (rayJXG.current.visProp.strokecolor !== lineColor) {
                rayJXG.current.visProp.strokecolor = lineColor;
                rayJXG.current.visProp.highlightstrokecolor = lineColor;
            }
            if (
                rayJXG.current.visProp.strokewidth !==
                SVs.selectedStyle.lineWidth
            ) {
                rayJXG.current.visProp.strokewidth =
                    SVs.selectedStyle.lineWidth;
                rayJXG.current.visProp.highlightstrokewidth =
                    SVs.selectedStyle.lineWidth;
            }
            if (
                rayJXG.current.visProp.strokeopacity !==
                SVs.selectedStyle.lineOpacity
            ) {
                rayJXG.current.visProp.strokeopacity =
                    SVs.selectedStyle.lineOpacity;
                rayJXG.current.visProp.highlightstrokeopacity =
                    SVs.selectedStyle.lineOpacity * 0.5;
            }
            let newDash = styleToDash(SVs.selectedStyle.lineStyle);
            if (rayJXG.current.visProp.dash !== newDash) {
                rayJXG.current.visProp.dash = newDash;
            }

            rayJXG.current.name = SVs.labelForGraph;

            let withlabel = SVs.labelForGraph !== "";
            if (withlabel != previousWithLabel.current) {
                rayJXG.current.setAttribute({ withlabel: withlabel });
                previousWithLabel.current = withlabel;
            }

            rayJXG.current.needsUpdate = true;
            rayJXG.current.update();
            if (rayJXG.current.hasLabel && rayJXG.current.label) {
                const label = rayJXG.current.label;
                if (SVs.applyStyleToLabel) {
                    label.visProp.strokecolor = lineColor;
                } else {
                    label.visProp.strokecolor = "var(--canvasText)";
                }

                applyLineFamilyLabelPlacement({
                    board,
                    lineLike: rayJXG.current,
                    labelPosition: SVs.labelPosition,
                    setNeedsUpdateOnNoChange: true,
                });
            }
            board.updateRenderer();
        }
    }

    if (SVs.hidden) {
        return null;
    }

    return (
        <>
            <span id={id} />
        </>
    );
});
