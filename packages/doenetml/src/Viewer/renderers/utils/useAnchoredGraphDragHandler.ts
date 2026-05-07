import type { RefObject } from "react";
import JXG from "jsxgraph";
import {
    JXGBoard,
    JXGEvent,
    JXGObject,
    JXGPoint,
} from "../jsxgraph-distrib/types";
import type { CallActionArgs, RendererAction } from "../../useDoenetRenderer";
import { exceededDragThreshold } from "./dragThreshold";
import { pointerEventToUserCoords } from "./pointerToBoardCoords";
import type { PointerDragState } from "./pointerDragState";
import { LINE_FAMILY_EVENTS, removeJXGEventHandlers } from "./jsxgraph";

/**
 * Minimum element shape the anchored-graph drag handlers operate on.
 * `JXGText`, the deprecated `JXGObject`, and the per-renderer `JXGImage`
 * types all satisfy this structurally. `size` is read only in non-image
 * mode and is recovered via a localized cast at that branch since the
 * renderers that pass image-shaped objects don't carry `size` on their
 * narrow types.
 */
type AnchoredGraphJXG = {
    isDraggable: boolean;
    relativeCoords: {
        usrCoords: [number, number, number];
        setCoordinates: Function;
    };
    on(event: string, handler?: (e: JXGEvent) => void, context?: unknown): void;
    off(event: string, handler?: Function): void;
};

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

/**
 * Image-specific overrides for the drag handler's clamp/offset geometry.
 *
 * The four text-on-graph renderers (number/text/label/math) clamp drags
 * using the JXG element's pixel size (converted via board.unitX/Y) and
 * derive the per-anchor offset from anchorx/anchory. Image renderers
 * track their size and offset directly (in user coordinates) because
 * their aspect-ratio plumbing and rotation transform do the conversion
 * upstream. When `imageMode` is present, the drag handler:
 *
 * - reads size and offset from the provided getters instead of from
 *   `newJXG.size` / `anchorRel`;
 * - uses `paddingFraction` (default 0.04 for text; image passes 0.01);
 * - subtracts the offset in the non-pointer branch (matching image's
 *   `newAnchorPointJXG.X() - currentOffset[0]` arithmetic);
 * - calls `relativeCoords.setCoordinates` with the offset rather than
 *   `[0, 0]`, since image's relativeCoords carry the offset itself.
 */
export interface AnchoredGraphImageMode {
    getCurrentSize: () => [number, number];
    getCurrentOffset: () => [number, number];
    paddingFraction?: number;
}

interface AttachAnchoredGraphDragHandlersParams<TJXG extends AnchoredGraphJXG> {
    board: JXGBoard;
    /** The JSXgraph text/math/image element receiving the handlers. */
    newJXG: TJXG;
    /** The hidden anchor point the element is anchored to. */
    newAnchorPoint: JXGPoint | JXGObject;
    /**
     * Mutable ref tracking the resolved [anchorx, anchory] pair. Only
     * read in text mode; image mode ignores it (offset comes from
     * `imageMode.getCurrentOffset`).
     */
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
    /** Optional image-specific size/offset/padding overrides. */
    imageMode?: AnchoredGraphImageMode;
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
export function attachAnchoredGraphDragHandlers<TJXG extends AnchoredGraphJXG>({
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
    imageMode,
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

        let width: number;
        let height: number;
        let offsetx: number;
        let offsety: number;
        let paddingFraction: number;
        if (imageMode) {
            const [imgWidth, imgHeight] = imageMode.getCurrentSize();
            const [imgOffsetX, imgOffsetY] = imageMode.getCurrentOffset();
            width = imgWidth;
            height = imgHeight;
            offsetx = imgOffsetX;
            offsety = imgOffsetY;
            paddingFraction = imageMode.paddingFraction ?? 0.01;
        } else {
            // In non-image mode, the caller passes a text-shaped element
            // whose narrow type carries `size` (JXGText). Recover it via a
            // local cast so the helper's broader element-shape generic can
            // also accept image-shaped types that lack `size`.
            const sized = newJXG as unknown as { size: [number, number] };
            width = sized.size[0] / board.unitX;
            height = sized.size[1] / board.unitY;
            const anchorx = anchorRel.current?.[0];
            const anchory = anchorRel.current?.[1];
            offsetx = 0;
            if (anchorx === "middle") {
                offsetx = -width / 2;
            } else if (anchorx === "right") {
                offsetx = -width;
            }
            offsety = 0;
            if (anchory === "middle") {
                offsety = -height / 2;
            } else if (anchory === "top") {
                offsety = -height;
            }
            paddingFraction = 0.04;
        }

        const xminAdjusted =
            xMin + paddingFraction * (xMax - xMin) - offsetx - width;
        const xmaxAdjusted = xMax - paddingFraction * (xMax - xMin) - offsetx;
        const yminAdjusted =
            yMin + paddingFraction * (yMax - yMin) - offsety - height;
        const ymaxAdjusted = yMax - paddingFraction * (yMax - yMin) - offsety;

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
                newAnchorPoint.X() +
                newJXG.relativeCoords.usrCoords[1] -
                (imageMode ? offsetx : 0);
            calculatedY.current =
                newAnchorPoint.Y() +
                newJXG.relativeCoords.usrCoords[2] -
                (imageMode ? offsety : 0);
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

        newJXG.relativeCoords.setCoordinates(
            JXG.COORDS_BY_USER,
            imageMode ? [offsetx, offsety] : [0, 0],
        );
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
export function detachAnchoredGraphElement<TJXG extends AnchoredGraphJXG>(
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
