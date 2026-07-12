import React, { useContext, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { DynamicMath } from "./utils/DynamicMath";
import { textRendererStyle } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { ChoiceInputInlineContext } from "./choiceInput";
import {
    applyLineFamilyLabelPlacement,
    buildLineFamilyLabelAttributes,
    removeJXGEventHandlers,
    stabilizeInitialLineFamilyLabelPlacement,
    syncLabelMaskCssStyle,
    syncLabelStrokeColor,
    syncLayer,
    syncLineFamilyVisibility,
    syncLineStrokeStyle,
    syncWithLabelToggle,
} from "./utils/jsxgraph";
import {
    attachLabelHoverHighlight,
    computeLabelMaskCssStyle,
} from "./utils/labelMaskStyle";
import { buildLineLikeAttributes } from "./utils/buildGraphicalAttributes";
import { JXGLine } from "./jsxgraph-distrib/types";
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
    let previousWithLabel = useRef<boolean | null>(null);
    let cancelInitialLabelPlacement = useRef<(() => void) | null>(null);
    let pointCoords = useRef<[number, number][] | null>(null);

    const dragCoordination: DragCoordinationState<number> = {
        draggedTag: useRef<number | null>(null),
        downOnTag: useRef<number | null>(null),
    };

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
            layer: SVs.layer,
            maskLabel: SVs.maskLabel,
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

        function buildMoveArgs(): Record<string, any> {
            return {
                point1coords: pointCoords.current?.[0],
                point2coords: pointCoords.current?.[1],
            };
        }

        attachLineFamilyDragHandlers({
            jxg: newLineJXG,
            tag: 0,
            dragState,
            coordination: dragCoordination,
            componentIdx,
            callAction,
            fixedRef: fixed,
            actions: {
                move: actions.moveLine,
                focus: actions.lineFocused,
                click: actions.lineClicked,
                clickPrelude: actions.switchLine,
            },
            clickPreludeGate: switchable,
            snapshot: () =>
                [
                    [...newLineJXG.point1.coords.scrCoords],
                    [...newLineJXG.point2.coords.scrCoords],
                ] as [number[], number[]],
            buildTransientMoveArgs: (e, snap) => {
                const next: [number, number][] = [];
                if (
                    e.type === "pointermove" &&
                    dragState.pointerAtDown.current &&
                    snap
                ) {
                    // Compute from pointer delta rather than .X()/.Y() directly so
                    // points don't snap back to attractors on slow drags.
                    for (let i = 0; i < 2; i++) {
                        next.push(
                            pointerEventToUserCoords(
                                e,
                                dragState.pointerAtDown.current,
                                snap[i] as [number, number, number],
                                board,
                            ),
                        );
                    }
                } else {
                    next.push([newLineJXG.point1.X(), newLineJXG.point1.Y()]);
                    next.push([newLineJXG.point2.X(), newLineJXG.point2.Y()]);
                }
                pointCoords.current = next;
                return {
                    ...buildMoveArgs(),
                    transient: true,
                    skippable: true,
                };
            },
            buildCommitMoveArgs: () => buildMoveArgs(),
            onDragApplied: () => {
                newLineJXG.point1.coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    lastPositionsFromCore.current[0],
                );
                newLineJXG.point2.coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    lastPositionsFromCore.current[1],
                );
            },
        });

        lineJXG.current = newLineJXG;

        attachLabelHoverHighlight({
            hoverTargetJXG: newLineJXG,
            getLabelJXG: () => lineJXG.current?.label,
            ...computeLabelMaskCssStyle({
                layer: SVs.layer,
                masked: SVs.maskLabel,
            }),
            board,
        });

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
                syncLabelMaskCssStyle(label, SVs.layer, {
                    highlighted: lineJXG.current.highlighted,
                    maskLabel: SVs.maskLabel,
                });

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
            <DynamicMath latex={mathJaxify} />
        </span>
    );
});
