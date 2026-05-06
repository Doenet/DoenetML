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
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";
import {
    DragCoordinationState,
    attachLineFamilyDragHandlers,
} from "./utils/lineFamilyDragHandlers";

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
    let headcoords = useRef<number[] | null>(null);
    let tailcoords = useRef<number[] | null>(null);

    const dragCoordination: DragCoordinationState<number> = {
        draggedTag: useRef<number | null>(null),
        downOnTag: useRef<number | null>(null),
    };

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

        // Tag layout: 0 = vector body, 1 = tail (point1), 2 = head (point2).

        function applyDragReset() {
            vectorJXG.current?.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionsFromCore.current[0],
            );
            vectorJXG.current?.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionsFromCore.current[1],
            );
        }

        attachLineFamilyDragHandlers({
            jxg: newVectorJXG,
            tag: 0,
            dragState,
            coordination: dragCoordination,
            componentIdx,
            callAction,
            fixedRef: fixed,
            participatesInDownTag: false,
            suppressClickWhenDownOnOtherTag: true,
            // vector body's `down` always dispatches focus, regardless of
            // whether a child got down first (matches existing behavior).
            actions: {
                move: actions.moveVector,
                focus: actions.vectorFocused,
                click: actions.vectorClicked,
            },
            snapshot: () =>
                [
                    [...newVectorJXG.point1.coords.scrCoords],
                    [...newVectorJXG.point2.coords.scrCoords],
                ] as [number[], number[]],
            buildTransientMoveArgs: (e, snap) => {
                const viaPointer = e.type === "pointermove";
                if (viaPointer && dragState.pointerAtDown.current && snap) {
                    tailcoords.current = pointerEventToUserCoords(
                        e,
                        dragState.pointerAtDown.current,
                        snap[0] as [number, number, number],
                        board,
                    );
                    headcoords.current = pointerEventToUserCoords(
                        e,
                        dragState.pointerAtDown.current,
                        snap[1] as [number, number, number],
                        board,
                    );
                } else {
                    tailcoords.current = [
                        newVectorJXG.point1.X(),
                        newVectorJXG.point1.Y(),
                    ];
                    headcoords.current = [
                        newVectorJXG.point2.X(),
                        newVectorJXG.point2.Y(),
                    ];
                }
                return {
                    headcoords: headcoords.current,
                    tailcoords: tailcoords.current,
                    transient: true,
                    skippable: true,
                };
            },
            buildCommitMoveArgs: () => ({
                headcoords: headcoords.current,
                tailcoords: tailcoords.current,
            }),
            onDragApplied: () => {
                if (dragCoordination.draggedTag.current !== 0) {
                    return;
                }
                applyDragReset();
            },
        });

        function attachVectorEndpointHandlers(
            point: JXGPoint,
            tagN: 1 | 2,
            argKey: "tailcoords" | "headcoords",
            coordsRef: typeof tailcoords,
            isDraggable: typeof tailDraggable,
        ) {
            attachLineFamilyDragHandlers({
                jxg: point,
                tag: tagN,
                dragState,
                coordination: dragCoordination,
                componentIdx,
                callAction,
                fixedRef: fixed,
                shouldDispatchFocusOnDown: () => isDraggable.current,
                actions: {
                    move: actions.moveVector,
                    focus: actions.vectorFocused,
                    click: actions.vectorClicked,
                },
                snapshot: () => null,
                buildTransientMoveArgs: () => {
                    coordsRef.current = [point.X(), point.Y()];
                    return {
                        [argKey]: coordsRef.current,
                        transient: true,
                        skippable: true,
                        sourceDetails: { vertex: tagN - 1 },
                    };
                },
                buildCommitMoveArgs: () => ({
                    [argKey]: coordsRef.current,
                }),
                onDragApplied: () => {
                    if (dragCoordination.draggedTag.current !== tagN) {
                        return;
                    }
                    applyDragReset();
                    if (board) {
                        board.updateInfobox(point);
                    }
                },
            });
        }

        attachVectorEndpointHandlers(
            newPoint1JXG,
            1,
            "tailcoords",
            tailcoords,
            tailDraggable,
        );
        attachVectorEndpointHandlers(
            newPoint2JXG,
            2,
            "headcoords",
            headcoords,
            headDraggable,
        );

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
