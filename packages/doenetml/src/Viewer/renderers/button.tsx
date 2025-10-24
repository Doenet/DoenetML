import React, { useContext, useEffect, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { Button } from "@doenet/ui-components";
import { BoardContext } from "./graph";
// @ts-ignore
import me from "math-expressions";
import {
    getPositionFromAnchorByCoordinate,
    POINTER_DRAG_THRESHOLD,
} from "./utils/graph";
import { cesc } from "@doenet/utils";
import { JXGEvent, JXGObject } from "./jsxgraph-distrib/types";

export default React.memo(function ButtonComponent(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } = useDoenetRenderer(props, false);

    // @ts-ignore
    ButtonComponent.ignoreActionsWithoutCore = (actionName) =>
        actionName === "moveButton";

    let buttonJXG = useRef<JXGObject | null>(null);
    let anchorPointJXG = useRef<JXGObject | null>(null);
    let anchorRel = useRef<[string, string] | null>(null);

    const board = useContext(BoardContext);

    let pointerAtDown = useRef<[number, number] | null>(null);
    let pointAtDown = useRef<[number, number, number] | null>(null);
    let dragged = useRef(false);

    let calculatedX = useRef<number | null>(null);
    let calculatedY = useRef<number | null>(null);

    let lastPositionFromCore = useRef<[number, number] | null>(null);
    let previousPositionFromAnchor = useRef(null);

    let fixed = useRef(false);
    let fixLocation = useRef(false);

    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

    let label = SVs.label ? SVs.label : "Button";

    let fillColor: string = SVs.selectedStyle.fillColor;

    useEffect(() => {
        //On unmount
        return () => {
            if (buttonJXG.current !== null) {
                deleteButtonJXG();
            }
        };
    }, []);

    function createButtonJXG() {
        let jsxButtonAttributes: Record<string, any> = {
            visible: !SVs.hidden,
            fixed: fixed.current,
            disabled: SVs.disabled,
            useMathJax: SVs.labelHasLatex,
            parse: false,
            highlight: false,
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
                jsxButtonAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxButtonAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            });
        } catch (e) {
            jsxButtonAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            });
            return;
        }

        jsxButtonAttributes.anchor = newAnchorPointJXG;

        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
            SVs.positionFromAnchor,
        );

        jsxButtonAttributes.anchorx = anchorx;
        jsxButtonAttributes.anchory = anchory;
        anchorRel.current = [anchorx, anchory];

        let newButtonJXG = board.create(
            "button",
            [
                0,
                0,
                label,
                () => callAction({ action: actions[SVs.clickAction] }),
            ],
            jsxButtonAttributes,
        );

        newButtonJXG.isDraggable = !fixLocation.current;

        newButtonJXG.on("down", function (e: JXGEvent) {
            pointerAtDown.current = [e.x, e.y];
            pointAtDown.current = [
                ...(newAnchorPointJXG.coords.scrCoords as [
                    number,
                    number,
                    number,
                ]),
            ];
            dragged.current = false;
        });

        newButtonJXG.on("hit", function (e: JXGEvent) {
            dragged.current = false;
        });

        newButtonJXG.on("up", function (e: JXGEvent) {
            if (dragged.current) {
                callAction({
                    action: actions.moveButton,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            }
        });

        newButtonJXG.on("keyfocusout", function (e: JXGEvent) {
            if (dragged.current) {
                callAction({
                    action: actions.moveButton,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            }
        });

        newButtonJXG.on("drag", function (e: JXGEvent) {
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
            let width = newButtonJXG.size[0] / board.unitX;
            let height = newButtonJXG.size[1] / board.unitY;

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

            if (viaPointer && pointerAtDown.current && pointAtDown.current) {
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
                    (pointAtDown.current[1] +
                        e.x -
                        pointerAtDown.current[0] -
                        o[1]) /
                    board.unitX;

                calculatedY.current =
                    (o[2] -
                        (pointAtDown.current[2] +
                            e.y -
                            pointerAtDown.current[1])) /
                    board.unitY;
            } else {
                calculatedX.current =
                    newAnchorPointJXG.X() +
                    newButtonJXG.relativeCoords.usrCoords[1];
                calculatedY.current =
                    newAnchorPointJXG.Y() +
                    newButtonJXG.relativeCoords.usrCoords[2];
            }

            calculatedX.current = Math.min(
                xmaxAdjusted,
                Math.max(xminAdjusted, calculatedX.current || 0),
            );
            calculatedY.current = Math.min(
                ymaxAdjusted,
                Math.max(yminAdjusted, calculatedY.current || 0),
            );

            callAction({
                action: actions.moveButton,
                args: {
                    x: calculatedX.current,
                    y: calculatedY.current,
                    transient: true,
                    skippable: true,
                },
            });

            newButtonJXG.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            newAnchorPointJXG.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionFromCore.current,
            );
        });

        newButtonJXG.on("keydown", function (e: JXGEvent) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    callAction({
                        action: actions.moveButton,
                        args: {
                            x: calculatedX.current,
                            y: calculatedY.current,
                        },
                    });
                    dragged.current = false;
                }
            }
        });

        buttonJXG.current = newButtonJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;

        // Note: no idea why one has to update the label after waiting
        // But, if we don't do that, the label isn't positioned correctly if any anchors are "middle"
        // TODO: can we trigger this on MathJax being finished rather than wait 1 second?
        if (SVs.labelHasLatex) {
            setTimeout(() => {
                if (buttonJXG.current) {
                    buttonJXG.current.needsUpdate = true;
                    buttonJXG.current.setText(label);
                    buttonJXG.current.update();
                    board?.updateRenderer();
                }
            }, 1000);
        }
    }

    function deleteButtonJXG() {
        if (!buttonJXG.current) {
            return;
        }
        buttonJXG.current.off("drag");
        buttonJXG.current.off("down");
        buttonJXG.current.off("hit");
        buttonJXG.current.off("up");
        buttonJXG.current.off("keyfocusout");
        buttonJXG.current.off("keydown");
        board.removeObject(buttonJXG.current);
        buttonJXG.current = null;
    }

    if (board) {
        let anchorCoords: [number, number];
        try {
            let anchor = me.fromAst(SVs.anchor);
            anchorCoords = [
                anchor.get_component(0).evaluate_to_constant(),
                anchor.get_component(1).evaluate_to_constant(),
            ];
        } catch (e) {
            anchorCoords = [NaN, NaN];
        }

        lastPositionFromCore.current = anchorCoords;

        if (buttonJXG.current == null || anchorPointJXG.current == null) {
            createButtonJXG();
        } else {
            buttonJXG.current.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            anchorPointJXG.current.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            buttonJXG.current.setText(label);

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    buttonJXG.current.visProp["visible"] !== visible;
                buttonJXG.current.visProp["visible"] = visible;
                buttonJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    buttonJXG.current.setAttribute({ visible });
                }
            } else {
                buttonJXG.current.visProp["visible"] = false;
                buttonJXG.current.visPropCalc["visible"] = false;
            }

            if (buttonJXG.current.visProp.disabled !== SVs.disabled) {
                buttonJXG.current.visProp.disabled = SVs.disabled;
                buttonJXG.current.setAttribute({ disabled: SVs.disabled });
            }

            buttonJXG.current.visProp.fixed = fixed.current;
            buttonJXG.current.isDraggable = !fixLocation.current;

            buttonJXG.current.needsUpdate = true;

            if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
                let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
                    SVs.positionFromAnchor,
                );
                buttonJXG.current.visProp.anchorx = anchorx;
                buttonJXG.current.visProp.anchory = anchory;
                anchorRel.current = [anchorx, anchory];
                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                buttonJXG.current.fullUpdate();
            } else {
                buttonJXG.current.update();
            }

            anchorPointJXG.current.needsUpdate = true;
            anchorPointJXG.current.update();
            board.updateRenderer();
        }

        // Create css to color the button based on the fillColor from the style definition.
        // Note: couldn't figure out how to do it with JSXgraphs cssStyle attribute,
        // as that styled the div container rather than the button itself.
        // Instead, we're just using an inline style.
        let containerId = buttonJXG.current?.rendNode.id || "";
        let buttonCSS = `
            #${cesc(containerId)} button {
                background-color: ${fillColor};
            }
            #${cesc(containerId)} button:hover {
                background-color: oklch(from ${fillColor} calc(l * 1.5) c h);
                color: black;
            }`;

        return (
            <React.Fragment>
                <style>{buttonCSS}</style>
            </React.Fragment>
        );
    }

    // not in board

    if (SVs.hidden) {
        return null;
    }

    return (
        <div id={id} style={{ margin: "12px 0", display: "inline-block" }}>
            <Button
                id={id + "_button"}
                onClick={() => callAction({ action: actions[SVs.clickAction] })}
                disabled={SVs.disabled}
                value={label}
                valueHasLatex={SVs.labelHasLatex as boolean}
                fillColor={fillColor}
            />
        </div>
    );
});
