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
    syncLabelStrokeColor,
    syncLayer,
    syncLineFamilyVisibility,
    syncLineStrokeStyle,
    syncWithLabelToggle,
} from "./utils/jsxgraph";
import { buildLineLikeAttributes } from "./utils/buildGraphicalAttributes";
import { JXGLine } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { useDraggableRefs } from "./utils/useDraggableRefs";

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

    const {
        lastPositionFromCore: lastEndpointFromCore,
        fixed,
        fixLocation,
    } = useDraggableRefs<[number, number]>(SVs, SVs.numericalEndpoint);
    let lastThroughpointFromCore = useRef<[number, number] | null>(null);
    lastThroughpointFromCore.current = SVs.numericalThroughpoint;

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
            ...buildLineLikeAttributes({
                SVs,
                layerOffset: LINE_LAYER_OFFSET,
                fixed: fixed.current,
                fixLocation: fixLocation.current,
                darkMode,
            }),
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

            syncLineFamilyVisibility(rayJXG.current, visible, validCoords);

            rayJXG.current.visProp.fixed = fixed.current;
            rayJXG.current.visProp.highlight = !fixLocation.current;
            rayJXG.current.isDraggable = !fixLocation.current;

            syncLayer(rayJXG.current, SVs.layer, LINE_LAYER_OFFSET);

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

            syncLineStrokeStyle(rayJXG.current, {
                lineColor,
                lineWidth: SVs.selectedStyle.lineWidth,
                lineOpacity: SVs.selectedStyle.lineOpacity,
                dash: styleToDash(SVs.selectedStyle.lineStyle),
            });

            rayJXG.current.name = SVs.labelForGraph;

            syncWithLabelToggle(
                rayJXG.current,
                SVs.labelForGraph,
                previousWithLabel,
            );

            rayJXG.current.needsUpdate = true;
            rayJXG.current.update();
            if (rayJXG.current.hasLabel && rayJXG.current.label) {
                const label = rayJXG.current.label;
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);

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
