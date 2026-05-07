import type { RefObject } from "react";
import JXG from "jsxgraph";
import {
    JXGBoard,
    JXGEvent,
    JXGObject,
    JXGPoint,
    JXGText,
} from "../jsxgraph-distrib/types";
import type { CallActionArgs, RendererAction } from "../../useDoenetRenderer";
import { exceededDragThreshold } from "./dragThreshold";
import { pointerEventToUserCoords } from "./pointerToBoardCoords";
import type { PointerDragState } from "./pointerDragState";
import { LINE_FAMILY_EVENTS, removeJXGEventHandlers } from "./jsxgraph";

/**
 * Action names dispatched by the anchored-graph drag controller. Each
 * renderer that anchors a JSXgraph text/math element to a draggable point
 * (number, text, label, math) has its own triple following the same
 * naming pattern: `move<Kind>`, `<kind>Focused`, `<kind>Clicked`.
 */
export interface AnchoredGraphActionNames {
    move: string;
    focused: string;
    clicked: string;
}

interface AttachAnchoredGraphDragHandlersParams<
    TJXG extends JXGText | JXGObject,
> {
    board: JXGBoard;
    /** The JSXgraph text/math element receiving the handlers. */
    newJXG: TJXG;
    /** The hidden anchor point the element is anchored to. */
    newAnchorPoint: JXGPoint | JXGObject;
    /** Mutable ref tracking the resolved [anchorx, anchory] pair. */
    anchorRel: RefObject<[string, string] | null>;
    /** Pointer state shared with `useBoardPointerTracking`. */
    pointerState: PointerDragState;
    /**
     * Mutable ref where the anchor point's screen coordinates at pointerdown
     * are stashed; the drag handler reads it to compute the pointer delta.
     */
    pointAtDown: RefObject<number[] | null>;
    /** Output coordinates the drag handler writes; up/keydown read them. */
    calculatedX: RefObject<number | null>;
    calculatedY: RefObject<number | null>;
    /** Mirror of `SVs.fixed`, kept in a ref to avoid stale closures. */
    fixed: RefObject<boolean>;
    /** Mirror of `!SVs.draggable || SVs.fixLocation || SVs.fixed`. */
    fixLocation: RefObject<boolean>;
    /** Latest authoritative coordinates from core; drag resets to this. */
    lastPositionFromCore: RefObject<number[] | null>;
    componentIdx: number;
    actions: Record<string, RendererAction>;
    callAction: (argObj: CallActionArgs) => void;
    actionNames: AnchoredGraphActionNames;
}

/**
 * Bind the standard "anchored graph element" drag handlers on a freshly
 * created JSXgraph text/math element. Encapsulates the down → drag → up
 * lifecycle plus keyboard analogues (keyfocusout, keydown Enter) shared
 * across `number`, `text`, `label`, and `math` renderers.
 *
 * The renderer remains responsible for creating the JXG element and the
 * hidden anchor point, calling `usePointerDragState`, `useDraggableRefs`,
 * and `useBoardPointerTracking` at the top level, and providing refs the
 * handlers read/write (`anchorRel`, `pointAtDown`, `calculatedX`,
 * `calculatedY`).
 */
export function attachAnchoredGraphDragHandlers<
    TJXG extends JXGText | JXGObject,
>({
    board,
    newJXG,
    newAnchorPoint,
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
    actionNames,
}: AttachAnchoredGraphDragHandlersParams<TJXG>): void {
    newJXG.isDraggable = !fixLocation.current;

    newJXG.on("down", function (e: JXGEvent) {
        (document.activeElement as HTMLElement | null)?.blur();

        pointerState.pointerAtDown.current = [e.x, e.y];
        pointAtDown.current = [...newAnchorPoint.coords.scrCoords];
        pointerState.dragged.current = false;
        pointerState.pointerIsDown.current = true;
        pointerState.pointerMovedSinceDown.current = false;
        if (!fixed.current) {
            callAction({
                action: actions[actionNames.focused],
                args: { componentIdx },
            });
        }
    });

    newJXG.on("hit", function () {
        pointAtDown.current = [...newAnchorPoint.coords.scrCoords];
        pointerState.dragged.current = false;
        callAction({
            action: actions[actionNames.focused],
            args: { componentIdx },
        });
    });

    newJXG.on("up", function () {
        if (pointerState.dragged.current) {
            callAction({
                action: actions[actionNames.move],
                args: {
                    x: calculatedX.current,
                    y: calculatedY.current,
                },
            });
            pointerState.dragged.current = false;
        } else if (
            !pointerState.pointerMovedSinceDown.current &&
            !fixed.current
        ) {
            callAction({
                action: actions[actionNames.clicked],
                args: { componentIdx },
            });
        }
        pointerState.pointerIsDown.current = false;
    });

    newJXG.on("keyfocusout", function () {
        if (pointerState.dragged.current) {
            callAction({
                action: actions[actionNames.move],
                args: {
                    x: calculatedX.current,
                    y: calculatedY.current,
                },
            });
            pointerState.dragged.current = false;
        }
    });

    newJXG.on("drag", function (e: JXGEvent) {
        const viaPointer = e.type === "pointermove";
        const pointerAtDown = pointerState.pointerAtDown.current;

        if (exceededDragThreshold(e, pointerAtDown)) {
            pointerState.dragged.current = true;
        }

        const [xMin, yMax, xMax, yMin] = board.getBoundingBox();
        const width = newJXG.size[0] / board.unitX;
        const height = newJXG.size[1] / board.unitY;

        const anchorx = anchorRel.current?.[0];
        const anchory = anchorRel.current?.[1];

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

        const xminAdjusted = xMin + 0.04 * (xMax - xMin) - offsetx - width;
        const xmaxAdjusted = xMax - 0.04 * (xMax - xMin) - offsetx;
        const yminAdjusted = yMin + 0.04 * (yMax - yMin) - offsety - height;
        const ymaxAdjusted = yMax - 0.04 * (yMax - yMin) - offsety;

        const pointAtDownCoords = pointAtDown.current;
        if (viaPointer && pointerAtDown && pointAtDownCoords) {
            // We compute position from the pointer delta rather than
            // reading newJXG.X()/Y() directly because those getters can be
            // affected by setCoordinates calls during update(), causing
            // attractor-driven snaps to leave the dragged location out of
            // sync with the cursor.
            const [x, y] = pointerEventToUserCoords(
                e,
                pointerAtDown,
                [
                    pointAtDownCoords[0],
                    pointAtDownCoords[1],
                    pointAtDownCoords[2],
                ],
                board,
            );
            calculatedX.current = x;
            calculatedY.current = y;
        } else {
            calculatedX.current =
                newAnchorPoint.X() + newJXG.relativeCoords.usrCoords[1];
            calculatedY.current =
                newAnchorPoint.Y() + newJXG.relativeCoords.usrCoords[2];
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
            action: actions[actionNames.move],
            args: {
                x: calculatedX.current,
                y: calculatedY.current,
                transient: true,
                skippable: true,
            },
        });

        newJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
        newAnchorPoint.coords.setCoordinates(
            JXG.COORDS_BY_USER,
            lastPositionFromCore.current,
        );
    });

    newJXG.on("keydown", function (e: JXGEvent) {
        if (e.key === "Enter") {
            if (pointerState.dragged.current) {
                callAction({
                    action: actions[actionNames.move],
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                pointerState.dragged.current = false;
            }
            callAction({
                action: actions[actionNames.clicked],
                args: { componentIdx },
            });
        }
    });
}

/**
 * Tear down a JSXgraph text/math element previously wired up by
 * `attachAnchoredGraphDragHandlers`. Detaches the standard event handlers
 * and removes the element from the board.
 */
export function detachAnchoredGraphElement<TJXG extends JXGText | JXGObject>(
    jxgRef: RefObject<TJXG | null>,
    board: JXGBoard | null,
): void {
    if (!jxgRef.current) {
        return;
    }
    removeJXGEventHandlers(jxgRef.current, LINE_FAMILY_EVENTS);
    board?.removeObject(jxgRef.current);
    jxgRef.current = null;
}
