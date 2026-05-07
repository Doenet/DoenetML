import React, { useContext, useRef } from "react";
import JXG from "jsxgraph";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";
import me from "math-expressions";
import { textRendererStyle } from "@doenet/utils";
import { getPositionFromAnchorByCoordinate } from "./utils/graph";
import { DocContext } from "../DocViewer";
import { JXGObject } from "./jsxgraph-distrib/types";
import { ChoiceInputInlineContext } from "./choiceInput";
import { SelectedStyle } from "./utils/graphicalSVs";
import { usePointerDragState } from "./utils/pointerDragState";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import {
    attachAnchoredGraphDragHandlers,
    detachAnchoredGraphElement,
} from "./utils/useAnchoredGraphDragHandler";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";

interface MathSVs {
    [key: string]: any;
    hidden: boolean;
    layer: number;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    latex: string;
    renderMode?: string;
    equationTag?: string;
    mrowChildRendererIds?: string[];
    selectedStyle: SelectedStyle;
}

function getMathDelimiters(SVs: MathSVs): [string, string] {
    if (SVs.renderMode === "inline") {
        return ["\\(", "\\)"];
    } else if (SVs.renderMode === "display") {
        return ["\\[", "\\]"];
    } else if (SVs.renderMode === "numbered") {
        return [`\\begin{gather}\\tag{${SVs.equationTag}}`, "\\end{gather}"];
    } else if (SVs.renderMode === "align") {
        return ["\\begin{align}", "\\end{align}"];
    }
    // treat as inline if have unrecognized renderMode
    return ["\\(", "\\)"];
}

export default React.memo(function MathComponent(
    props: UseDoenetRendererProps,
) {
    let { componentIdx, id, SVs, actions, callAction } =
        useDoenetRenderer<MathSVs>(props);

    // @ts-ignore
    MathComponent.ignoreActionsWithoutCore = () => true;

    const mathJXG = useRef<JXGObject | null>(null);
    const anchorPointJXG = useRef<JXGObject | null>(null);
    const anchorRel = useRef<[string, string] | null>(null);

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);

    const pointerState = usePointerDragState();
    const pointAtDown = useRef<number[] | null>(null);
    const calculatedX = useRef<number | null>(null);
    const calculatedY = useRef<number | null>(null);
    const previousPositionFromAnchor = useRef(null);

    const { fixed, fixLocation, lastPositionFromCore } = useDraggableRefs<
        number[] | null
    >(SVs, null);

    useBoardPointerTracking(board, pointerState);

    useJSXGraphCleanup({
        objectRef: mathJXG,
        destroy: () => detachAnchoredGraphElement(mathJXG, board),
    });

    const { darkMode } = useContext(DocContext) || {};

    function createMathJXG() {
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
        let jsxMathAttributes: Record<string, any> = {
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
            useMathJax: true,
            parse: false,
        };

        let newAnchorPointJXG: JXGObject;

        try {
            let anchor = me.fromAst(SVs.anchor);
            let anchorCoords = [
                anchor.get_component(0).evaluate_to_constant(),
                anchor.get_component(1).evaluate_to_constant(),
            ];

            if (!Number.isFinite(anchorCoords[0])) {
                anchorCoords[0] = 0;
                jsxMathAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxMathAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            });
        } catch (e) {
            jsxMathAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            });
        }

        jsxMathAttributes.anchor = newAnchorPointJXG;

        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
            SVs.positionFromAnchor,
        );
        jsxMathAttributes.anchorx = anchorx;
        jsxMathAttributes.anchory = anchory;
        anchorRel.current = [anchorx, anchory];

        const [beginDelim, endDelim] = getMathDelimiters(SVs);

        let newMathJXG: JXGObject = board.create(
            "text",
            [0, 0, beginDelim + SVs.latex + endDelim],
            jsxMathAttributes,
        );

        attachAnchoredGraphDragHandlers({
            board,
            newJXG: newMathJXG,
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
                move: "moveMath",
                focused: "mathFocused",
                clicked: "mathClicked",
            },
        });

        mathJXG.current = newMathJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;

        // Note: no idea why one has to update the math after waiting
        // But, if we don't do that, the math isn't positioned correctly if any anchors are "middle",
        // and, especially for displayed math, the drag handlers may not be called
        // TODO: can we trigger this on MathJax being finished rather than wait 1 second?
        setTimeout(() => {
            if (mathJXG.current) {
                mathJXG.current.needsUpdate = true;
                mathJXG.current.setText(beginDelim + SVs.latex + endDelim);
                mathJXG.current.update();
                board.updateRenderer();
            }
        }, 1000);
    }

    if (board) {
        let anchorCoords: [number, number];
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

        if (mathJXG.current === null) {
            createMathJXG();
        } else {
            mathJXG.current.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            anchorPointJXG.current?.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            const [beginDelim, endDelim] = getMathDelimiters(SVs);

            mathJXG.current.setText(beginDelim + SVs.latex + endDelim);

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    mathJXG.current.visProp["visible"] !== visible;
                mathJXG.current.visProp["visible"] = visible;
                mathJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    mathJXG.current.setAttribute({ visible });
                }
            } else {
                mathJXG.current.visProp["visible"] = false;
                mathJXG.current.visPropCalc["visible"] = false;
            }

            let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
            let layerChanged = mathJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                mathJXG.current.setAttribute({ layer });
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

            if (mathJXG.current.visProp.strokecolor !== textColor) {
                mathJXG.current.visProp.strokecolor = textColor!;
                mathJXG.current.visProp.highlightstrokecolor = textColor!;
            }
            if (mathJXG.current.visProp.cssstyle !== cssStyle) {
                mathJXG.current.visProp.cssstyle = cssStyle;
                mathJXG.current.visProp.highlightcssstyle = cssStyle;
            }

            mathJXG.current.visProp.highlight = !fixLocation.current;
            mathJXG.current.visProp.fixed = fixed.current;
            mathJXG.current.isDraggable = !fixLocation.current;

            mathJXG.current.needsUpdate = true;

            if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
                let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
                    SVs.positionFromAnchor,
                );
                mathJXG.current.visProp.anchorx = anchorx;
                mathJXG.current.visProp.anchory = anchory;
                anchorRel.current = [anchorx, anchory];
                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                mathJXG.current.fullUpdate();
            } else {
                mathJXG.current.update();
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

    const [beginDelim, endDelim] = getMathDelimiters(SVs);
    const latexWithDelims = beginDelim + SVs.latex + endDelim;

    let anchors = [];
    if (SVs.mrowChildRendererIds) {
        anchors.push(
            ...SVs.mrowChildRendererIds.map((rowId: string) => {
                return <span key={rowId} id={rowId} />;
            }),
        );
    }

    const style = !choiceInputInlineContext.inOption
        ? textRendererStyle(darkMode ?? "light", SVs.selectedStyle)
        : undefined;

    const hideUntilTypeset = !choiceInputInlineContext.isHidden
        ? "first"
        : undefined;

    return (
        <>
            {anchors}
            <span style={style} id={id}>
                <MathJax hideUntilTypeset={hideUntilTypeset} inline dynamic>
                    {latexWithDelims}
                </MathJax>
            </span>
        </>
    );
});
