import React, { useContext, useRef } from "react";
import JXG from "jsxgraph";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { DynamicMath } from "./utils/DynamicMath";
import me from "math-expressions";
import { textRendererStyle } from "@doenet/utils";
import { getPositionFromAnchorByCoordinate } from "./utils/graph";
import { DocContext } from "../DocViewer";
import { ChoiceInputInlineContext } from "./choiceInput";
import { JXGPoint, JXGText } from "./jsxgraph-distrib/types";
import type { ResolvedStyleDefinition } from "@doenet/utils";
import { usePointerDragState } from "./utils/pointerDragState";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import {
    attachAnchoredGraphDragHandlers,
    detachAnchoredGraphElement,
} from "./utils/useAnchoredGraphDragHandler";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";
import { computeLabelMaskCssStyle } from "./utils/labelMaskStyle";

interface LabelSVs {
    hidden: boolean;
    layer: number;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    value: string;
    hasLatex: boolean;
    maskLabel: boolean;
    forTargetRendererId?: string;
    forTargetIsGroup?: boolean;
    selectedStyle: ResolvedStyleDefinition;
}

export default React.memo(function Label(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, callAction } =
        useDoenetRenderer<LabelSVs>(props);

    // @ts-ignore
    Label.ignoreActionsWithoutCore = () => true;

    const labelJXG = useRef<JXGText | null>(null);
    const anchorPointJXG = useRef<JXGPoint | null>(null);
    const anchorRel = useRef<[string, string] | null>(null);

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);

    const pointerState = usePointerDragState();
    const pointAtDown = useRef<number[] | null>(null);
    const calculatedX = useRef<number | null>(null);
    const calculatedY = useRef<number | null>(null);
    const previousPositionFromAnchor = useRef<any>(null);

    const { fixed, fixLocation, lastPositionFromCore } = useDraggableRefs<
        number[] | null
    >(SVs, null);

    useBoardPointerTracking(board, pointerState);

    useJSXGraphCleanup({
        objectRef: labelJXG,
        destroy: () => detachAnchoredGraphElement(labelJXG, board),
    });

    const { darkMode } = useContext(DocContext) || {};

    function createLabelJXG() {
        if (board === null) {
            return null;
        }

        let textColor =
            darkMode === "dark"
                ? SVs.selectedStyle.textColorDarkMode
                : SVs.selectedStyle.textColor;
        let backgroundColor =
            darkMode === "dark"
                ? SVs.selectedStyle.backgroundColorDarkMode
                : SVs.selectedStyle.backgroundColor;

        let { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: SVs.layer,
            backgroundColor,
            masked: SVs.maskLabel,
        });

        //things to be passed to JSXGraph as attributes
        let jsxLabelAttributes: Record<string, any> = {
            visible: !SVs.hidden,
            fixed: fixed.current,
            layer: 10 * SVs.layer + TEXT_LAYER_OFFSET,
            cssStyle,
            highlightCssStyle,
            strokeColor: textColor,
            strokeOpacity: 1,
            highlightStrokeColor: textColor,
            // Text elements default to a highlightStrokeOpacity < 1, which
            // combines with the background alpha and makes the highlighted
            // mask look transparent (jsxgraph issue #777). Force it to 1.
            highlightStrokeOpacity: 1,
            // JSXGraph's native hover highlight applies the bordered mask
            // style on hover, gated on `highlight` — enabled only when the
            // label is draggable. Native highlight clears reliably on
            // pointer-out (via the board's dehighlightAll), unlike a custom
            // over/out on this HTML-overlay text element.
            highlight: !fixLocation.current,
            useMathJax: SVs.hasLatex,
            parse: false,
        };

        let newAnchorPointJXG: JXGPoint;

        try {
            let anchor = me.fromAst(SVs.anchor);
            let anchorCoords = [
                anchor.get_component(0).evaluate_to_constant() ?? NaN,
                anchor.get_component(1).evaluate_to_constant() ?? NaN,
            ];

            if (!Number.isFinite(anchorCoords[0])) {
                anchorCoords[0] = 0;
                jsxLabelAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxLabelAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            }) as JXGPoint;
        } catch (e) {
            jsxLabelAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            }) as JXGPoint;
        }

        jsxLabelAttributes.anchor = newAnchorPointJXG;

        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
            SVs.positionFromAnchor,
        );
        jsxLabelAttributes.anchorx = anchorx;
        jsxLabelAttributes.anchory = anchory;
        anchorRel.current = [anchorx as string, anchory as string];

        let newLabelJXG = board.create(
            "text",
            [0, 0, SVs.value],
            jsxLabelAttributes,
        ) as JXGText;

        attachAnchoredGraphDragHandlers({
            board,
            newJXG: newLabelJXG,
            newAnchorPoint: newAnchorPointJXG,
            anchorRel,
            pointerState,
            pointAtDown,
            calculatedX,
            calculatedY,
            fixed,
            fixLocation,
            lastPositionFromCore,
            componentIdx,
            actions,
            callAction,
            actionNames: {
                move: "moveLabel",
                focused: "labelFocused",
                clicked: "labelClicked",
            },
        });

        labelJXG.current = newLabelJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;

        // Note: no idea why one has to update the label after waiting
        // But, if we don't do that, the label isn't positioned correctly if any anchors are "middle"
        // TODO: can we trigger this on MathJax being finished rather than wait 1 second?
        if (SVs.hasLatex) {
            setTimeout(() => {
                if (labelJXG.current) {
                    labelJXG.current.needsUpdate = true;
                    labelJXG.current.setText(SVs.value);
                    labelJXG.current.update();
                    board?.updateRenderer();
                }
            }, 1000);
        }
    }

    if (board) {
        let anchorCoords: number[];
        try {
            let anchor = me.fromAst(SVs.anchor);
            anchorCoords = [
                anchor.get_component(0).evaluate_to_constant() ?? NaN,
                anchor.get_component(1).evaluate_to_constant() ?? NaN,
            ];
        } catch (e) {
            anchorCoords = [NaN, NaN];
        }

        lastPositionFromCore.current = anchorCoords;

        if (labelJXG.current === null) {
            createLabelJXG();
        } else {
            labelJXG.current.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            anchorPointJXG.current?.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            labelJXG.current.setText(SVs.value);

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    labelJXG.current.visProp["visible"] !== visible;
                labelJXG.current.visProp["visible"] = visible;
                labelJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    labelJXG.current.setAttribute({ visible });
                }
            } else {
                labelJXG.current.visProp["visible"] = false;
                labelJXG.current.visPropCalc["visible"] = false;
            }

            let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
            let layerChanged = labelJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                labelJXG.current.setAttribute({ layer });
            }

            let textColor =
                darkMode === "dark"
                    ? SVs.selectedStyle.textColorDarkMode
                    : SVs.selectedStyle.textColor;
            let backgroundColor =
                darkMode === "dark"
                    ? SVs.selectedStyle.backgroundColorDarkMode
                    : SVs.selectedStyle.backgroundColor;
            let { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
                layer: SVs.layer,
                backgroundColor,
                masked: SVs.maskLabel,
            });

            if (labelJXG.current.visProp.strokecolor !== textColor) {
                labelJXG.current.visProp.strokecolor = textColor!;
                labelJXG.current.visProp.highlightstrokecolor = textColor!;
            }
            if (labelJXG.current.visProp.cssstyle !== cssStyle) {
                labelJXG.current.visProp.cssstyle = cssStyle;
                labelJXG.current.visProp.highlightcssstyle = highlightCssStyle;
                labelJXG.current.visProp.highlightstrokeopacity = 1;
            }

            labelJXG.current.visProp.highlight = !fixLocation.current;
            labelJXG.current.visProp.fixed = fixed.current;
            labelJXG.current.isDraggable = !fixLocation.current;

            labelJXG.current.needsUpdate = true;

            if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
                let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
                    SVs.positionFromAnchor,
                );
                labelJXG.current.visProp.anchorx = anchorx;
                labelJXG.current.visProp.anchory = anchory;
                anchorRel.current = [anchorx as string, anchory as string];
                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                labelJXG.current.fullUpdate();
            } else {
                labelJXG.current.update();
            }

            if (anchorPointJXG.current) {
                anchorPointJXG.current.needsUpdate = true;
                anchorPointJXG.current.update();
            }
            board.updateRenderer();
        }

        return <span id={id} />;
    }

    // not in board

    if (SVs.hidden) {
        return null;
    }

    const style = !choiceInputInlineContext.inOption
        ? textRendererStyle(darkMode ?? "light", SVs.selectedStyle)
        : undefined;

    let label: React.ReactNode = SVs.value;

    if (SVs.hasLatex) {
        label = <DynamicMath latex={SVs.value} />;
    }
    if (SVs.forTargetRendererId) {
        if (SVs.forTargetIsGroup) {
            return (
                <span style={style} id={id}>
                    {label}
                </span>
            );
        }

        return (
            <label
                style={style}
                id={id}
                htmlFor={`${SVs.forTargetRendererId}_input`}
            >
                {label}
            </label>
        );
    }

    return (
        <span style={style} id={id}>
            {label}
        </span>
    );
});
