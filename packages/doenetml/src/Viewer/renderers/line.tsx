import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { MathJax } from "better-react-mathjax";
import { textRendererStyle } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { ChoiceInputInlineContext } from "./choiceInput";
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
import { JXGLine } from "./jsxgraph-distrib/types";
import { DraggableGraphicalSVs } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import { exceededDragThreshold } from "./utils/dragThreshold";
import { pointerEventToUserCoords } from "./utils/pointerToBoardCoords";
import { resolveLineColor } from "./utils/styleColors";
import { styleToDash } from "./utils/styleToDash";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";

interface LineSVs extends DraggableGraphicalSVs {
    numericalPoints: [number, number][];
    switchable: boolean;
    dashed: boolean;
    latex: string;
}

export default React.memo(function Line(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, callAction } =
        useDoenetRenderer<LineSVs>(props);

    // @ts-ignore
    Line.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);

    let lineJXG = useRef<JXGLine | null>(null);

    const dragState = usePointerDragState();
    const { pointerAtDown, pointerIsDown, pointerMovedSinceDown, dragged } =
        dragState;
    let pointsAtDown = useRef<[number[], number[]] | null>(null);
    let previousWithLabel = useRef<boolean | null>(null);
    let cancelInitialLabelPlacement = useRef<(() => void) | null>(null);
    let pointCoords = useRef<[number, number][] | null>(null);

    const {
        lastPositionFromCore: lastPositionsFromCore,
        fixed,
        fixLocation,
    } = useDraggableRefs<[number, number][]>(SVs, SVs.numericalPoints);
    let switchable = useRef(false);
    switchable.current = SVs.switchable && !SVs.fixed;

    const { darkMode } = useContext(DocContext) || {};

    useBoardPointerTracking(board, dragState);

    useJSXGraphCleanup({
        objectRef: lineJXG,
        destroy: () => deleteLineJXG(),
        cancelLabelPlacementRef: cancelInitialLabelPlacement,
    });

    function createLineJXG() {
        if (board === null) {
            return null;
        }

        if (
            SVs.numericalPoints?.length !== 2 ||
            SVs.numericalPoints.some((x) => x.length !== 2)
        ) {
            lineJXG.current = null;
            return;
        }

        const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

        //things to be passed to JSXGraph as attributes
        var jsxLineAttributes: Record<string, any> = buildLineLikeAttributes({
            SVs,
            layerOffset: LINE_LAYER_OFFSET,
            fixed: fixed.current,
            fixLocation: fixLocation.current,
            darkMode,
            dashed: SVs.dashed,
        });

        jsxLineAttributes.label = buildLineFamilyLabelAttributes({
            labelForGraph: SVs.labelForGraph,
            labelPosition: SVs.labelPosition,
            labelHasLatex: SVs.labelHasLatex,
            applyStyleToLabel: SVs.applyStyleToLabel,
            lineColor,
        });

        let through = [
            [...SVs.numericalPoints[0]],
            [...SVs.numericalPoints[1]],
        ];

        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;

        let newLineJXG: JXGLine = board.create(
            "line",
            through,
            jsxLineAttributes,
        );

        newLineJXG.isDraggable = !fixLocation.current;

        newLineJXG.on("drag", function (e) {
            if (exceededDragThreshold(e, pointerAtDown.current)) {
                dragged.current = true;
            }

            pointCoords.current = [];

            if (
                e.type === "pointermove" &&
                pointerAtDown.current &&
                pointsAtDown.current
            ) {
                // Compute from pointer delta rather than .X()/.Y() directly so
                // points don't snap back to attractors on slow drags.
                for (let i = 0; i < 2; i++) {
                    pointCoords.current.push(
                        pointerEventToUserCoords(
                            e,
                            pointerAtDown.current,
                            pointsAtDown.current[i] as [number, number, number],
                            board,
                        ),
                    );
                }
            } else {
                pointCoords.current.push([
                    newLineJXG.point1.X(),
                    newLineJXG.point1.Y(),
                ]);
                pointCoords.current.push([
                    newLineJXG.point2.X(),
                    newLineJXG.point2.Y(),
                ]);
            }

            callAction({
                action: actions.moveLine,
                args: {
                    point1coords: pointCoords.current[0],
                    point2coords: pointCoords.current[1],
                    transient: true,
                    skippable: true,
                },
            });

            newLineJXG.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionsFromCore.current![0],
            );
            newLineJXG.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionsFromCore.current![1],
            );
        });

        newLineJXG.on("up", function (e) {
            if (dragged.current) {
                callAction({
                    action: actions.moveLine,
                    args: {
                        point1coords: pointCoords.current?.[0],
                        point2coords: pointCoords.current?.[1],
                    },
                });
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                if (switchable.current) {
                    callAction({
                        action: actions.switchLine,
                    });
                    callAction({
                        action: actions.lineClicked,
                        args: { componentIdx },
                    });
                } else {
                    callAction({
                        action: actions.lineClicked,
                        args: { componentIdx },
                    });
                }
            }
            pointerIsDown.current = false;
        });

        newLineJXG.on("keyfocusout", function (e) {
            if (dragged.current) {
                callAction({
                    action: actions.moveLine,
                    args: {
                        point1coords: pointCoords.current?.[0],
                        point2coords: pointCoords.current?.[1],
                    },
                });
                dragged.current = false;
            }
        });

        newLineJXG.on("down", function (e) {
            (document.activeElement as HTMLElement | null)?.blur();

            dragged.current = false;
            pointerAtDown.current = [e.x, e.y];
            pointsAtDown.current = [
                [...newLineJXG.point1.coords.scrCoords],
                [...newLineJXG.point2.coords.scrCoords],
            ];
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.lineFocused,
                    args: { componentIdx },
                });
            }
        });

        newLineJXG.on("hit", function (e) {
            dragged.current = false;
            pointsAtDown.current = [
                [...newLineJXG.point1.coords.scrCoords],
                [...newLineJXG.point2.coords.scrCoords],
            ];
            callAction({
                action: actions.lineFocused,
                args: { componentIdx },
            });
        });

        newLineJXG.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    callAction({
                        action: actions.moveLine,
                        args: {
                            point1coords: pointCoords.current?.[0],
                            point2coords: pointCoords.current?.[1],
                        },
                    });
                    dragged.current = false;
                }
                if (switchable.current) {
                    callAction({
                        action: actions.switchLine,
                    });
                    callAction({
                        action: actions.lineClicked,
                        args: { componentIdx },
                    });
                } else {
                    callAction({
                        action: actions.lineClicked,
                        args: { componentIdx },
                    });
                }
            }
        });

        lineJXG.current = newLineJXG;

        if (SVs.labelForGraph !== "" && newLineJXG.hasLabel) {
            cancelInitialLabelPlacement.current =
                stabilizeInitialLineFamilyLabelPlacement({
                    board,
                    lineLike: newLineJXG,
                    applyPlacement: (forceFullUpdate) => {
                        if (
                            lineJXG.current !== newLineJXG ||
                            !newLineJXG.hasLabel
                        ) {
                            return false;
                        }
                        applyLineFamilyLabelPlacement({
                            board,
                            lineLike: newLineJXG,
                            labelPosition: SVs.labelPosition,
                            forceFullUpdate,
                        });
                        return true;
                    },
                });
        }

        previousWithLabel.current = SVs.labelForGraph !== "";
    }

    function deleteLineJXG() {
        cancelInitialLabelPlacement.current?.();
        cancelInitialLabelPlacement.current = null;
        if (!lineJXG.current) {
            return;
        }
        removeJXGEventHandlers(lineJXG.current);
        board?.removeObject(lineJXG.current);
        lineJXG.current = null;
    }

    if (board) {
        if (lineJXG.current === null) {
            createLineJXG();
        } else if (
            SVs.numericalPoints?.length !== 2 ||
            SVs.numericalPoints.some((x) => x.length !== 2)
        ) {
            deleteLineJXG();
        } else {
            let validCoords = true;

            for (let coords of [
                SVs.numericalPoints[0],
                SVs.numericalPoints[1],
            ]) {
                if (!Number.isFinite(coords[0])) {
                    validCoords = false;
                }
                if (!Number.isFinite(coords[1])) {
                    validCoords = false;
                }
            }

            lineJXG.current.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalPoints[0],
            );
            lineJXG.current.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                SVs.numericalPoints[1],
            );

            let visible = !SVs.hidden;

            syncLineFamilyVisibility(lineJXG.current, visible, validCoords);

            lineJXG.current.visProp.fixed = fixed.current;
            lineJXG.current.visProp.highlight = !fixLocation.current;
            lineJXG.current.isDraggable = !fixLocation.current;

            syncLayer(lineJXG.current, SVs.layer, LINE_LAYER_OFFSET);

            const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);

            syncLineStrokeStyle(lineJXG.current, {
                lineColor,
                lineWidth: SVs.selectedStyle.lineWidth,
                lineOpacity: SVs.selectedStyle.lineOpacity,
                dash: styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed),
            });

            lineJXG.current.name = SVs.labelForGraph;

            syncWithLabelToggle(
                lineJXG.current,
                SVs.labelForGraph,
                previousWithLabel,
            );

            lineJXG.current.needsUpdate = true;
            lineJXG.current.update();
            if (lineJXG.current.hasLabel && lineJXG.current.label) {
                const label = lineJXG.current.label;
                label.needsUpdate = true;
                syncLabelStrokeColor(label, SVs.applyStyleToLabel, lineColor);

                applyLineFamilyLabelPlacement({
                    board,
                    lineLike: lineJXG.current,
                    labelPosition: SVs.labelPosition,
                });
            }
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
