import React, { useContext, useEffect, useRef } from "react";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import me from "math-expressions";
import { textRendererStyle } from "@doenet/utils";
import {
    getPositionFromAnchorByCoordinate,
    POINTER_DRAG_THRESHOLD,
} from "./utils/graph";
import { DocContext } from "../DocViewer";
import { ChoiceInputInlineContext } from "./choiceInput";
import { JXGEvent, JXGPoint, JXGText } from "./jsxgraph-distrib/types";
import { SelectedStyle } from "./utils/graphicalSVs";

interface TextSVs {
    hidden: boolean;
    layer: number;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    text: string;
    selectedStyle: SelectedStyle;
}

export default React.memo(function Text(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, actions, callAction } =
        useDoenetRenderer<TextSVs>(props);

    // @ts-ignore
    Text.ignoreActionsWithoutCore = () => true;

    let textJXG = useRef<JXGText | null>(null);
    let anchorPointJXG = useRef<JXGPoint | null>(null);
    let anchorRel = useRef<[string, string] | null>(null);

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);

    let pointerAtDown = useRef<[number, number] | null>(null);
    let pointAtDown = useRef<number[] | null>(null);
    let pointerIsDown = useRef<boolean>(false);
    let pointerMovedSinceDown = useRef<boolean>(false);
    let dragged = useRef<boolean>(false);

    let calculatedX = useRef<number | null>(null);
    let calculatedY = useRef<number | null>(null);

    let lastPositionFromCore = useRef<number[] | null>(null);
    let previousPositionFromAnchor = useRef<any>(null);

    let fixed = useRef<boolean>(false);
    let fixLocation = useRef<boolean>(false);

    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

    const { darkMode } = useContext(DocContext) || {};

    useEffect(() => {
        //On unmount
        return () => {
            if (textJXG.current !== null) {
                deleteTextJXG();
            }

            if (board) {
                board.off("move", boardMoveHandler);
            }
        };
    }, []);

    useEffect(() => {
        if (board) {
            board.on("move", boardMoveHandler);
        }
    }, [board]);

    function createTextJXG() {
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
        let jsxTextAttributes: Record<string, any> = {
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
                anchor.get_component(0).evaluate_to_constant() ?? NaN,
                anchor.get_component(1).evaluate_to_constant() ?? NaN,
            ];

            if (!Number.isFinite(anchorCoords[0])) {
                anchorCoords[0] = 0;
                jsxTextAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxTextAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            }) as JXGPoint;
        } catch (e) {
            jsxTextAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            }) as JXGPoint;
        }

        jsxTextAttributes.anchor = newAnchorPointJXG;

        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
            SVs.positionFromAnchor,
        );
        jsxTextAttributes.anchorx = anchorx;
        jsxTextAttributes.anchory = anchory;
        anchorRel.current = [anchorx as string, anchory as string];

        let newTextJXG = board.create(
            "text",
            [0, 0, SVs.text],
            jsxTextAttributes,
        ) as JXGText;
        newTextJXG.isDraggable = !fixLocation.current;

        newTextJXG.on("down", function (e: JXGEvent) {
            (document.activeElement as HTMLElement | null)?.blur();

            pointerAtDown.current = [e.x, e.y];
            pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
            dragged.current = false;
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.textFocused,
                    args: { componentIdx },
                });
            }
        });

        newTextJXG.on("hit", function (e: JXGEvent) {
            pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
            dragged.current = false;
            callAction({
                action: actions.textFocused,
                args: { componentIdx },
            });
        });

        newTextJXG.on("up", function (e: JXGEvent) {
            if (dragged.current) {
                callAction({
                    action: actions.moveText,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.textClicked,
                    args: { componentIdx },
                });
            }
            pointerIsDown.current = false;
        });

        newTextJXG.on("keyfocusout", function (e: JXGEvent) {
            if (dragged.current) {
                callAction({
                    action: actions.moveText,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            }
        });

        newTextJXG.on("drag", function (e: JXGEvent) {
            let viaPointer = e.type === "pointermove";

            //Protect against very small unintended drags
            if (
                !viaPointer ||
                Math.abs(e.x - pointerAtDown.current![0]) >
                    POINTER_DRAG_THRESHOLD ||
                Math.abs(e.y - pointerAtDown.current![1]) >
                    POINTER_DRAG_THRESHOLD
            ) {
                dragged.current = true;
            }

            let [xMin, yMax, xMax, yMin] = board.getBoundingBox();
            let width = newTextJXG.size![0] / board.unitX;
            let height = newTextJXG.size![1] / board.unitY;

            let anchorx = anchorRel.current![0];
            let anchory = anchorRel.current![1];

            let offsetx = 0;
            if (anchorx === "middle") {
                offsetx = -width / 2;
            } else if (anchorx === "right") {
                offsetx = -width;
            }
            let offsety = 0;
            if (anchory === "middle") {
                offsety = -height / 2;
            } else if (anchory === "top") {
                offsety = -height;
            }

            let xminAdjusted = xMin + 0.04 * (xMax - xMin) - offsetx - width;
            let xmaxAdjusted = xMax - 0.04 * (xMax - xMin) - offsetx;
            let yminAdjusted = yMin + 0.04 * (yMax - yMin) - offsety - height;
            let ymaxAdjusted = yMax - 0.04 * (yMax - yMin) - offsety;

            if (viaPointer) {
                // the reason we calculate point position with this algorithm,
                // rather than using .X() and .Y() directly
                // is that attributes .X() and .Y() are affected by the
                // .setCoordinates function called in update().
                // Due to this dependence, the location of .X() and .Y()
                // can be affected by constraints of objects that the points depends on,
                // leading to a different location on up than on drag
                // (as dragging uses the mouse location)
                // TODO: find an example where need this this additional complexity
                var o = board.origin.scrCoords;

                calculatedX.current =
                    (pointAtDown.current![1] +
                        e.x -
                        pointerAtDown.current![0] -
                        o[1]) /
                    board.unitX;

                calculatedY.current =
                    (o[2] -
                        (pointAtDown.current![2] +
                            e.y -
                            pointerAtDown.current![1])) /
                    board.unitY;
            } else {
                calculatedX.current =
                    newAnchorPointJXG.X() +
                    newTextJXG.relativeCoords!.usrCoords[1];
                calculatedY.current =
                    newAnchorPointJXG.Y() +
                    newTextJXG.relativeCoords!.usrCoords[2];
            }

            calculatedX.current = Math.min(
                xmaxAdjusted,
                Math.max(xminAdjusted, calculatedX.current),
            );
            calculatedY.current = Math.min(
                ymaxAdjusted,
                Math.max(yminAdjusted, calculatedY.current),
            );

            callAction({
                action: actions.moveText,
                args: {
                    x: calculatedX.current,
                    y: calculatedY.current,
                    transient: true,
                    skippable: true,
                },
            });

            newTextJXG.relativeCoords!.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            newAnchorPointJXG.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionFromCore.current,
            );
        });

        newTextJXG.on("keydown", function (e: JXGEvent) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    callAction({
                        action: actions.moveText,
                        args: {
                            x: calculatedX.current,
                            y: calculatedY.current,
                        },
                    });
                    dragged.current = false;
                }
                callAction({
                    action: actions.textClicked,
                    args: { componentIdx },
                });
            }
        });

        textJXG.current = newTextJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
    }

    function boardMoveHandler(e: JXGEvent) {
        if (pointerIsDown.current) {
            //Protect against very small unintended move
            if (
                Math.abs(e.x - pointerAtDown.current![0]) >
                    POINTER_DRAG_THRESHOLD ||
                Math.abs(e.y - pointerAtDown.current![1]) >
                    POINTER_DRAG_THRESHOLD
            ) {
                pointerMovedSinceDown.current = true;
            }
        }
    }

    function deleteTextJXG() {
        if (!textJXG.current) return;
        textJXG.current.off("drag");
        textJXG.current.off("down");
        textJXG.current.off("hit");
        textJXG.current.off("up");
        textJXG.current.off("keyfocusout");
        textJXG.current.off("keydown");
        board?.removeObject(textJXG.current);
        textJXG.current = null;
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

        if (textJXG.current === null) {
            createTextJXG();
        } else {
            textJXG.current.relativeCoords!.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            anchorPointJXG.current!.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            textJXG.current.setText(SVs.text);

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    textJXG.current.visProp["visible"] !== visible;
                textJXG.current.visProp["visible"] = visible;
                textJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    textJXG.current.setAttribute({ visible });
                }
            } else {
                textJXG.current.visProp["visible"] = false;
                textJXG.current.visPropCalc["visible"] = false;
            }

            let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
            let layerChanged = textJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                textJXG.current.setAttribute({ layer });
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

            if (textJXG.current.visProp.strokecolor !== textColor) {
                textJXG.current.visProp.strokecolor = textColor!;
                textJXG.current.visProp.highlightstrokecolor = textColor!;
            }
            if (textJXG.current.visProp.cssstyle !== cssStyle) {
                textJXG.current.visProp.cssstyle = cssStyle;
                textJXG.current.visProp.highlightcssstyle = cssStyle;
            }

            textJXG.current.visProp.highlight = !fixLocation.current;
            textJXG.current.visProp.fixed = fixed.current;
            textJXG.current.isDraggable = !fixLocation.current;

            textJXG.current.needsUpdate = true;

            if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
                let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
                    SVs.positionFromAnchor,
                );
                textJXG.current.visProp.anchorx = anchorx;
                textJXG.current.visProp.anchory = anchory;
                anchorRel.current = [anchorx as string, anchory as string];
                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                textJXG.current.fullUpdate();
            } else {
                textJXG.current.update();
            }

            anchorPointJXG.current!.needsUpdate = true;
            anchorPointJXG.current!.update();
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

    return (
        <>
            <span id={id} style={style}>
                {SVs.text}
            </span>
        </>
    );
});
