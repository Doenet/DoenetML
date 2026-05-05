import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { MathJax } from "better-react-mathjax";
import { textRendererStyle } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { JXGLine, JXGPoint } from "./jsxgraph-distrib/types";
import { ChoiceInputInlineContext } from "./choiceInput";
import {
    applyLineFamilyLabelPlacement,
    buildLineFamilyLabelAttributes,
    removeJXGEventHandlers,
    stabilizeInitialLineFamilyLabelPlacement,
    syncLabelStrokeColor,
    syncLayer,
    syncLineStrokeStyle,
    syncWithLabelToggle,
} from "./utils/jsxgraph";
import { buildLineLikeAttributes } from "./utils/buildGraphicalAttributes";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";

interface VectorSVs extends DraggableGraphicalSVs {
    numericalEndpoints: [number, number][];
    tailDraggable: boolean;
    headDraggable: boolean;
    showCoordsWhenDragging: boolean;
    latex: string;
}

export default React.memo(function Vector(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, sourceOfUpdate, callAction } =
        useDoenetRenderer<VectorSVs>(props);

    // @ts-ignore
    Vector.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);

    let vectorJXG = useRef<JXGLine | null>(null);
    let point1JXG = useRef<JXGPoint | null>(null);
    let point2JXG = useRef<JXGPoint | null>(null);

    const dragState = usePointerDragState();
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown } = dragState;
    let pointsAtDown = useRef<[number[], number[]] | null>(null);
    let headBeingDragged = useRef(false);
    let tailBeingDragged = useRef(false);
    let downOnPoint = useRef<number | null>(null);
    let headcoords = useRef<number[] | null>(null);
    let tailcoords = useRef<number[] | null>(null);

    let previousWithLabel = useRef<boolean | null>(null);
    let cancelInitialLabelPlacement = useRef<(() => void) | null>(null);

    const {
        lastPositionFromCore: lastPositionsFromCore,
        fixed,
        fixLocation,
    } = useDraggableRefs<[number, number][]>(SVs, SVs.numericalEndpoints);
    let headDraggable = useRef(true);
    let tailDraggable = useRef(true);
    tailDraggable.current = SVs.tailDraggable && !SVs.fixed && !SVs.fixLocation;
    headDraggable.current = SVs.headDraggable && !SVs.fixed && !SVs.fixLocation;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    useJSXGraphCleanup({
        objectRef: vectorJXG,
        destroy: () => deleteVectorJXG(),
        cancelLabelPlacementRef: cancelInitialLabelPlacement,
    });

    function createVectorJXG() {
        if (board === null) {
            return null;
        }

        if (
            SVs.numericalEndpoints.length !== 2 ||
            SVs.numericalEndpoints.some((x: any) => x.length !== 2)
        ) {
            vectorJXG.current = null;
            point1JXG.current = null;
            point2JXG.current = null;
            return;
        }

        let pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

        //things to be passed to JSXGraph as attributes
        var jsxVectorAttributes: Record<string, any> = {
            ...buildLineLikeAttributes({
                SVs,
                layerOffset: LINE_LAYER_OFFSET,
                fixed: fixed.current,
                fixLocation: fixLocation.current,
                darkMode,
            }),
            lastArrow: { type: 1, size: 3, highlightSize: 3 },
        };

        let endpoints = [
            [...SVs.numericalEndpoints[0]],
            [...SVs.numericalEndpoints[1]],
        ];

        let jsxPointAttributes = Object.assign({}, jsxVectorAttributes);
        Object.assign(jsxPointAttributes, {
            withLabel: false,
            fixed: false,
            highlight: true,
            fillColor: "none",
            strokeColor: "none",
            highlightStrokeColor: "none",
            highlightFillColor: getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray"),
            layer: pointLayer,
            showInfoBox: SVs.showCoordsWhenDragging,
        });

        // create invisible points at endpoints
        let tailPointAttributes = Object.assign({}, jsxPointAttributes);
        let tailVisible = tailDraggable.current && !SVs.hidden;
        tailPointAttributes.visible = tailVisible;
        let newPoint1JXG: JXGPoint = board.create(
            "point",
            endpoints[0],
            tailPointAttributes,
        );

        let headPointAttributes = Object.assign({}, jsxPointAttributes);
        let headVisible = headDraggable.current && !SVs.hidden;
        headPointAttributes.visible = headVisible;
        let newPoint2JXG: JXGPoint = board.create(
            "point",
            endpoints[1],
            headPointAttributes,
        );

        jsxVectorAttributes.label = buildLineFamilyLabelAttributes({
            labelForGraph: SVs.labelForGraph,
            labelPosition: SVs.labelPosition,
            labelHasLatex: SVs.labelHasLatex,
            applyStyleToLabel: SVs.applyStyleToLabel,
            lineColor,
        });

        let newVectorJXG: JXGLine = board.create(
            "arrow",
            [newPoint1JXG, newPoint2JXG],
            jsxVectorAttributes,
        );
        newVectorJXG.isDraggable = !fixLocation.current;

        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;

        newPoint1JXG.on("drag", (e: { x: number; y: number; type: string }) =>
            onDragHandler(e, 0),
        );
        newPoint2JXG.on("drag", (e: { x: number; y: number; type: string }) =>
            onDragHandler(e, 1),
        );
        newVectorJXG.on("drag", (e: { x: number; y: number; type: string }) =>
            onDragHandler(e, -1),
        );

        newPoint1JXG.on("up", (e: unknown) => {
            if (!headBeingDragged.current && tailBeingDragged.current) {
                callAction({
                    action: actions.moveVector,
                    args: { tailcoords: tailcoords.current },
                });
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.vectorClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
            downOnPoint.current = null;
            pointerIsDown.current = false;
        });
        newPoint2JXG.on("up", (e: unknown) => {
            if (headBeingDragged.current && !tailBeingDragged.current) {
                callAction({
                    action: actions.moveVector,
                    args: { headcoords: headcoords.current },
                });
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.vectorClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
            downOnPoint.current = null;
            pointerIsDown.current = false;
        });
        newVectorJXG.on("up", (e: unknown) => {
            if (headBeingDragged.current && tailBeingDragged.current) {
                callAction({
                    action: actions.moveVector,
                    args: {
                        headcoords: headcoords.current,
                        tailcoords: tailcoords.current,
                    },
                });
            } else if (
                !pointerMovedSinceDown.current &&
                downOnPoint.current === null &&
                !fixed.current
            ) {
                // Note: counting on fact that up on vector will trigger before up on points
                callAction({
                    action: actions.vectorClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
            pointerIsDown.current = false;
        });

        newPoint1JXG.on("keyfocusout", (e: unknown) => {
            if (!headBeingDragged.current && tailBeingDragged.current) {
                callAction({
                    action: actions.moveVector,
                    args: { tailcoords: tailcoords.current },
                });
            }
            headBeingDragged.current = false;
            tailBeingDragged.current = false;
        });
        newPoint2JXG.on("keyfocusout", (e: unknown) => {
            if (headBeingDragged.current && !tailBeingDragged.current) {
                callAction({
                    action: actions.moveVector,
                    args: { headcoords: headcoords.current },
                });
            }
            headBeingDragged.current = false;
            tailBeingDragged.current = false;
        });
        newVectorJXG.on("keyfocusout", (e: unknown) => {
            if (headBeingDragged.current && tailBeingDragged.current) {
                callAction({
                    action: actions.moveVector,
                    args: {
                        headcoords: headcoords.current,
                        tailcoords: tailcoords.current,
                    },
                });
            }
            headBeingDragged.current = false;
            tailBeingDragged.current = false;
        });

        newPoint1JXG.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            headBeingDragged.current = false;
            tailBeingDragged.current = false;
            pointerAtDown.current = [e.x, e.y];
            downOnPoint.current = 1;
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (tailDraggable.current) {
                callAction({
                    action: actions.vectorFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        newPoint1JXG.on("hit", function (e) {
            headBeingDragged.current = false;
            tailBeingDragged.current = false;
            callAction({
                action: actions.vectorFocused,
                args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
            });
        });

        newPoint2JXG.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            headBeingDragged.current = false;
            tailBeingDragged.current = false;
            pointerAtDown.current = [e.x, e.y];
            downOnPoint.current = 2;
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (headDraggable.current) {
                callAction({
                    action: actions.vectorFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        newPoint2JXG.on("hit", function (e) {
            headBeingDragged.current = false;
            tailBeingDragged.current = false;
            callAction({
                action: actions.vectorFocused,
                args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
            });
        });

        // if drag vector, need to keep track of original point positions
        // so that they won't get stuck in an attractor
        newVectorJXG.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            headBeingDragged.current = false;
            tailBeingDragged.current = false;
            pointerAtDown.current = [e.x, e.y];
            pointsAtDown.current = [
                [...newVectorJXG.point1.coords.scrCoords],
                [...newVectorJXG.point2.coords.scrCoords],
            ];
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.vectorFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        newVectorJXG.on("hit", function (e: unknown) {
            headBeingDragged.current = false;
            tailBeingDragged.current = false;
            callAction({
                action: actions.vectorFocused,
                args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
            });
        });

        newPoint1JXG.on("keydown", (e) => {
            if (e.key === "Enter") {
                if (!headBeingDragged.current && tailBeingDragged.current) {
                    callAction({
                        action: actions.moveVector,
                        args: { tailcoords: tailcoords.current },
                    });
                }
                headBeingDragged.current = false;
                tailBeingDragged.current = false;
                callAction({
                    action: actions.vectorClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });
        newPoint2JXG.on("keydown", (e) => {
            if (e.key === "Enter") {
                if (headBeingDragged.current && !tailBeingDragged.current) {
                    callAction({
                        action: actions.moveVector,
                        args: { headcoords: headcoords.current },
                    });
                }
                headBeingDragged.current = false;
                tailBeingDragged.current = false;
                callAction({
                    action: actions.vectorClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });
        newVectorJXG.on("keydown", (e) => {
            if (e.key === "Enter") {
                if (headBeingDragged.current && tailBeingDragged.current) {
                    callAction({
                        action: actions.moveVector,
                        args: {
                            headcoords: headcoords.current,
                            tailcoords: tailcoords.current,
                        },
                    });
                }
                headBeingDragged.current = false;
                tailBeingDragged.current = false;
                callAction({
                    action: actions.vectorClicked,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        vectorJXG.current = newVectorJXG;
        point1JXG.current = newPoint1JXG;
        point2JXG.current = newPoint2JXG;

        if (SVs.labelForGraph !== "" && newVectorJXG.hasLabel) {
            cancelInitialLabelPlacement.current =
                stabilizeInitialLineFamilyLabelPlacement({
                    board,
                    lineLike: newVectorJXG,
                    applyPlacement: (forceFullUpdate: boolean) => {
                        if (
                            vectorJXG.current !== newVectorJXG ||
                            !newVectorJXG.hasLabel
                        ) {
                            return false;
                        }
                        applyLineFamilyLabelPlacement({
                            board,
                            lineLike: newVectorJXG,
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

    function onDragHandler(
        e: { x: number; y: number; type: string },
        i: number,
    ) {
        if (vectorJXG.current === null || board === null) {
            return;
        }

        if (exceededDragThreshold(e, pointerAtDown.current)) {
            if (i === 0) {
                tailBeingDragged.current = true;
            } else if (i === 1) {
                headBeingDragged.current = true;
            } else {
                headBeingDragged.current = true;
                tailBeingDragged.current = true;
            }

            let instructions: Record<string, any> = {
                transient: true,
                skippable: true,
            };

            if (headBeingDragged.current) {
                if (i === -1) {
                    headcoords.current = calculatePointPosition(e, 1);
                } else {
                    headcoords.current = [
                        vectorJXG.current.point2.X(),
                        vectorJXG.current.point2.Y(),
                    ];
                }
                instructions.headcoords = headcoords.current;
            }
            if (tailBeingDragged.current) {
                if (i === -1) {
                    tailcoords.current = calculatePointPosition(e, 0);
                } else {
                    tailcoords.current = [
                        vectorJXG.current.point1.X(),
                        vectorJXG.current.point1.Y(),
                    ];
                }
                instructions.tailcoords = tailcoords.current;
            }

            if (i === 0 || i === 1) {
                instructions.sourceDetails = { vertex: i };
            }

            callAction({
                action: actions.moveVector,
                args: instructions,
            });

            vectorJXG.current?.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionsFromCore.current[0],
            );
            vectorJXG.current?.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionsFromCore.current[1],
            );
            if (i === 0) {
                board.updateInfobox(point1JXG.current);
            } else if (i === 1) {
                board.updateInfobox(point2JXG.current);
            }
        }
    }

    function deleteVectorJXG() {
        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;
        if (vectorJXG.current) {
            removeJXGEventHandlers(vectorJXG.current);
            board?.removeObject(vectorJXG.current);
            vectorJXG.current = null;
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

    function calculatePointPosition(
        e: { x: number; y: number; type: string },
        i: number,
    ): number[] | null {
        let viaPointer = e.type === "pointermove";

        if (board === null || vectorJXG.current === null) {
            return null;
        }

        if (
            viaPointer &&
            pointsAtDown.current !== null &&
            pointerAtDown.current !== null
        ) {
            return pointerEventToUserCoords(
                e,
                pointerAtDown.current,
                pointsAtDown.current[i] as [number, number, number],
                board,
            );
        }
        if (i == 0) {
            return [vectorJXG.current.point1.X(), vectorJXG.current.point1.Y()];
        }
        return [vectorJXG.current.point2.X(), vectorJXG.current.point2.Y()];
    }

    if (board) {
        if (
            vectorJXG.current === null ||
            point1JXG.current === null ||
            point2JXG.current === null
        ) {
            createVectorJXG();
        } else if (
            SVs.numericalEndpoints.length !== 2 ||
            SVs.numericalEndpoints.some((x: any) => x.length !== 2)
        ) {
            deleteVectorJXG();
        } else {
            let validPoints = true;

            for (let coords of [
                SVs.numericalEndpoints[0],
                SVs.numericalEndpoints[1],
            ]) {
                if (!Number.isFinite(coords[0])) {
                    validPoints = false;
                }
                if (!Number.isFinite(coords[1])) {
                    validPoints = false;
                }
            }

            vectorJXG.current.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalEndpoints[0],
            );
            vectorJXG.current.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalEndpoints[1],
            );

            let visible = !SVs.hidden && validPoints;

            let tailVisible = tailDraggable.current && visible;
            let headVisible = headDraggable.current && visible;

            vectorJXG.current.visProp.fixed = fixed.current;
            vectorJXG.current.visProp.highlight = !fixLocation.current;
            vectorJXG.current.isDraggable = !fixLocation.current;

            vectorJXG.current.visProp["visible"] = visible;
            vectorJXG.current.visPropCalc["visible"] = visible;

            point1JXG.current.visProp["visible"] = tailVisible;
            point1JXG.current.visPropCalc["visible"] = tailVisible;

            point2JXG.current.visProp["visible"] = headVisible;
            point2JXG.current.visPropCalc["visible"] = headVisible;

            point1JXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;
            point2JXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;

            if (
                sourceOfUpdate.sourceInformation &&
                componentIdx in sourceOfUpdate.sourceInformation
            ) {
                let sourceInfo = sourceOfUpdate.sourceInformation[componentIdx];
                if (
                    typeof sourceInfo === "object" &&
                    sourceInfo &&
                    "vertex" in sourceInfo
                ) {
                    if (sourceInfo.vertex === 0) {
                        board.updateInfobox(point1JXG.current);
                    } else if (sourceInfo.vertex === 1) {
                        board.updateInfobox(point2JXG.current);
                    }
                }
            }

            // Endpoint layers must follow the vector's layer when it changes.
            if (syncLayer(vectorJXG.current, SVs.layer, LINE_LAYER_OFFSET)) {
                const pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
                point1JXG.current.setAttribute({ layer: pointLayer });
                point2JXG.current.setAttribute({ layer: pointLayer });
            }

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

            syncLineStrokeStyle(vectorJXG.current, {
                lineColor,
                lineWidth: SVs.selectedStyle.lineWidth,
                lineOpacity: SVs.selectedStyle.lineOpacity,
                dash: styleToDash(SVs.selectedStyle.lineStyle),
            });

            vectorJXG.current.name = SVs.labelForGraph;

            syncWithLabelToggle(
                vectorJXG.current,
                SVs.labelForGraph,
                previousWithLabel,
            );

            vectorJXG.current.needsUpdate = true;
            vectorJXG.current.update();
            if (vectorJXG.current.hasLabel && vectorJXG.current.label) {
                syncLabelStrokeColor(
                    vectorJXG.current.label,
                    SVs.applyStyleToLabel,
                    lineColor,
                );

                applyLineFamilyLabelPlacement({
                    board,
                    lineLike: vectorJXG.current,
                    labelPosition: SVs.labelPosition,
                    setNeedsUpdateOnNoChange: true,
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

    const mathJaxify = "\\(" + SVs.latex + "\\)";
    const style = !choiceInputInlineContext.inOption
        ? textRendererStyle(darkMode ?? "light", SVs.selectedStyle)
        : undefined;
    return (
        <span style={style} id={id}>
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {mathJaxify}
            </MathJax>
        </span>
    );
});
