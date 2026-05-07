import { MathJax } from "better-react-mathjax";

import React, { useContext, useRef } from "react";
import JXG from "jsxgraph";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import me from "math-expressions";
import { textRendererStyle } from "@doenet/utils";
import { getPositionFromAnchorByCoordinate } from "./utils/graph";
import { DocContext } from "../DocViewer";
import { ChoiceInputInlineContext } from "./choiceInput";
import { JXGPoint, JXGText } from "./jsxgraph-distrib/types";
import { ResolvedStyleDefinition } from "@doenet/utils";
import { usePointerDragState } from "./utils/pointerDragState";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import {
    attachAnchoredGraphDragHandlers,
    detachAnchoredGraphElement,
} from "./utils/useAnchoredGraphDragHandler";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";

interface NumberSVs {
    hidden: boolean;
    layer: number;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    text: string;
    renderAsMath: boolean;
    selectedStyle: ResolvedStyleDefinition;
}

export default React.memo(function NumberComponent(
    props: UseDoenetRendererProps,
) {
    let { componentIdx, id, SVs, actions, callAction } =
        useDoenetRenderer<NumberSVs>(props);

    // @ts-ignore
    NumberComponent.ignoreActionsWithoutCore = () => true;

    const numberJXG = useRef<JXGText | null>(null);
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
        objectRef: numberJXG,
        destroy: () => detachAnchoredGraphElement(numberJXG, board),
    });

    const { darkMode } = useContext(DocContext) || {};

    function createNumberJXG() {
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

        let cssStyle = ``;
        if (backgroundColor) {
            cssStyle += `background-color: ${backgroundColor}`;
        }

        //things to be passed to JSXGraph as attributes
        let jsxNumberAttributes: Record<string, any> = {
            visible: !SVs.hidden,
            fixed: fixed.current,
            layer: 10 * SVs.layer + TEXT_LAYER_OFFSET,
            cssStyle,
            highlightCssStyle: cssStyle,
            strokeColor: textColor,
            strokeOpacity: 1,
            highlightStrokeColor: textColor,
            highlightStrokeOpacity: 0.5,
            highlight: !fixLocation.current,
            parse: false,
        };

        let newAnchorPointJXG: JXGPoint;

        try {
            let anchor = me.fromAst(SVs.anchor);
            let anchorCoords = [
                anchor.get_component(0).evaluate_to_constant(),
                anchor.get_component(1).evaluate_to_constant(),
            ];
            if (!Number.isFinite(anchorCoords[0])) {
                anchorCoords[0] = 0;
                jsxNumberAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxNumberAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            }) as JXGPoint;
        } catch (e) {
            jsxNumberAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            }) as JXGPoint;
        }

        jsxNumberAttributes.anchor = newAnchorPointJXG;

        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
            SVs.positionFromAnchor,
        );
        jsxNumberAttributes.anchorx = anchorx;
        jsxNumberAttributes.anchory = anchory;
        anchorRel.current = [anchorx as string, anchory as string];

        let newNumberJXG = board.create(
            "text",
            [0, 0, SVs.text],
            jsxNumberAttributes,
        ) as JXGText;

        attachAnchoredGraphDragHandlers({
            board,
            newJXG: newNumberJXG,
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
                move: "moveNumber",
                focused: "numberFocused",
                clicked: "numberClicked",
            },
        });

        numberJXG.current = newNumberJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
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

        if (numberJXG.current === null) {
            createNumberJXG();
        } else {
            numberJXG.current.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            anchorPointJXG.current?.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            numberJXG.current.setText(SVs.text);

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    numberJXG.current.visProp["visible"] !== visible;
                numberJXG.current.visProp["visible"] = visible;
                numberJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    numberJXG.current.setAttribute({ visible });
                }
            } else {
                numberJXG.current.visProp["visible"] = false;
                numberJXG.current.visPropCalc["visible"] = false;
            }

            let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
            let layerChanged = numberJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                numberJXG.current.setAttribute({ layer });
            }

            let textColor =
                darkMode === "dark"
                    ? SVs.selectedStyle.textColorDarkMode
                    : SVs.selectedStyle.textColor;
            let backgroundColor =
                darkMode === "dark"
                    ? SVs.selectedStyle.backgroundColorDarkMode
                    : SVs.selectedStyle.backgroundColor;
            let cssStyle = ``;
            if (backgroundColor) {
                cssStyle += `background-color: ${backgroundColor}`;
            } else {
                cssStyle += `background-color: transparent`;
            }

            if (numberJXG.current.visProp.strokecolor !== textColor) {
                numberJXG.current.visProp.strokecolor = textColor!;
                numberJXG.current.visProp.highlightstrokecolor = textColor!;
            }
            if (numberJXG.current.visProp.cssstyle !== cssStyle) {
                numberJXG.current.visProp.cssstyle = cssStyle;
                numberJXG.current.visProp.highlightcssstyle = cssStyle;
            }

            numberJXG.current.visProp.highlight = !fixLocation.current;
            numberJXG.current.visProp.fixed = fixed.current;
            numberJXG.current.isDraggable = !fixLocation.current;

            numberJXG.current.needsUpdate = true;

            if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
                let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
                    SVs.positionFromAnchor,
                );
                numberJXG.current.visProp.anchorx = anchorx;
                numberJXG.current.visProp.anchory = anchory;
                anchorRel.current = [anchorx as string, anchory as string];
                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                numberJXG.current.fullUpdate();
            } else {
                numberJXG.current.update();
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

    let number = SVs.text;
    if (SVs.renderAsMath) {
        number = "\\(" + number + "\\)";
    }

    const style = !choiceInputInlineContext.inOption
        ? textRendererStyle(darkMode ?? "light", SVs.selectedStyle)
        : undefined;

    return (
        <span style={style} id={id}>
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {number}
            </MathJax>
        </span>
    );
});
