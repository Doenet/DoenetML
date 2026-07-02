import type { RefObject } from "react";
import { JXGElement, JXGEvent } from "../jsxgraph-distrib/types";
import { exceededDragThreshold } from "./dragThreshold";
import { PointerDragState } from "./pointerDragState";

export type CallActionFn = (params: {
    action: any;
    args?: Record<string, any>;
}) => void;

/**
 * Coordination state shared between every draggable target of one renderer.
 *
 * - `draggedTag` is the tag of the target that exceeded the drag threshold
 *   on the current pointer interaction (or `null` when no drag is active).
 * - `downOnTag` is the tag of the target that received `down` most recently
 *   on the current pointer interaction (or `null` when no `down` is active).
 *
 * Single-object renderers can pass `tag = 0` and ignore the multi-object
 * coordination semantics.
 */
export interface DragCoordinationState<TTag = number> {
    draggedTag: RefObject<TTag | null>;
    downOnTag: RefObject<TTag | null>;
}

export type CommitVariant = "up" | "keyEnter" | "keyFocusOut";

type MoveArgs = Record<string, any>;

export interface AttachDragHandlersConfig<TTag, TSnapshot> {
    /** The JSXgraph object to bind handlers to. */
    jxg: JXGElement;
    /** Identifier for this target within a multi-object renderer. */
    tag: TTag;
    /** Pointer state shared with `useBoardPointerTracking`. */
    dragState: PointerDragState;
    /** Multi-object coordination state. */
    coordination: DragCoordinationState<TTag>;

    componentIdx: number;
    callAction: CallActionFn;

    /** Whether the whole component is "fixed" (no clicks, no focus). */
    fixedRef: RefObject<boolean>;
    /**
     * Optional override for whether `down` should fire `actions.focus`. Used
     * by lineSegment endpoints (gated on `endpointsFixed`, not on `fixed`).
     * Returns `true` to allow focus dispatch. When omitted, the gate is
     * `!fixedRef.current`.
     */
    shouldDispatchFocusOnDown?: () => boolean;

    actions: {
        move?: any;
        focus?: any;
        click?: any;
        /**
         * Optional second action dispatched immediately before `click`. Used
         * by line/point's `switchable` flag. Evaluated at click time, so the
         * caller can pass a ref to gate dispatch dynamically.
         */
        clickPrelude?: any;
    };
    /**
     * Gate for `actions.clickPrelude` evaluated at click time. Default: dispatch
     * whenever `actions.clickPrelude` is set. Pass a ref reading
     * `switchable && !fixed` to mirror the line/point pattern.
     */
    clickPreludeGate?: RefObject<boolean>;

    /**
     * Captures any state needed at `down` (e.g., scrCoords snapshot). The
     * helper stores the most recent result internally and forwards it to
     * `buildTransientMoveArgs` / `buildCommitMoveArgs` / `onDragApplied`.
     */
    snapshot: () => TSnapshot;

    /**
     * Build the args for the transient (in-flight) `move` dispatch. Return
     * `null` to skip dispatching. Receives whatever the most recent
     * `snapshot()` produced (may be `null` if the target needs no snapshot).
     */
    buildTransientMoveArgs: (
        e: { type: string; x: number; y: number },
        snapshot: TSnapshot | null,
    ) => MoveArgs | null;

    /**
     * If true, `buildTransientMoveArgs` is called and the move action is
     * dispatched on every `drag` event, including sub-threshold ones. Used
     * by point.tsx, whose visible point's bounding-box clamping and shadow
     * sync need to run on every drag tick. Default `false` — only dispatch
     * after the drag threshold has been crossed.
     */
    dispatchTransientBelowThreshold?: boolean;

    /**
     * Build the args for the commit `move` dispatch (released a drag). The
     * `commitVariant` lets the caller emit slightly different shapes per
     * trigger — e.g., polyline uses `sourceInformation` (not `sourceDetails`)
     * on keyfocusout/keyEnter commits.
     */
    buildCommitMoveArgs: (
        snapshot: TSnapshot | null,
        commitVariant: CommitVariant,
    ) => MoveArgs | null;

    /**
     * Called on every `drag` event with the snapshot taken at `down`.
     * Typically resets JXG state back to `lastPositionFromCore` so the
     * worker stays the source of truth — see ray/line/circle/etc. for the
     * unconditional pattern. Renderers that should reset only after a
     * threshold-crossing dispatch (polyline/polygon) can guard with
     * `if (coordination.draggedTag.current !== tag) return`.
     */
    onDragApplied?: (
        snapshot: TSnapshot | null,
        e: { type: string; x: number; y: number },
    ) => void;

    /**
     * Suppress the click dispatch when a sibling target's `down` fired
     * before this one's `up`. Used by lineSegment / vector / polyline /
     * polygon "container" objects whose `up` fires before per-vertex `up`.
     */
    suppressClickWhenDownOnOtherTag?: boolean;

    /**
     * Suppress the focus-on-down dispatch when a sibling target's `down`
     * fired earlier in the same pointer interaction. Used by lineSegment /
     * polyline / polygon containers (whose `down` fires after the child's
     * `down`); vector leaves it false because its container always fires
     * `vectorFocused` regardless of which sub-target the user grabbed.
     */
    suppressFocusOnDownWhenDownOnOtherTag?: boolean;

    /**
     * Whether this target's `down` should write its tag into `downOnTag`.
     * Children of a container set it (default `true`); containers leave it
     * alone (`false`) so the child's tag remains visible to the container's
     * `up` for click suppression. Containers also rely on the child's `up`
     * clearing the slot.
     */
    participatesInDownTag?: boolean;

    /** Extra setup at the end of `down` (e.g., circle indicator offsets). */
    onDownExtra?: (e: { x: number; y: number }) => void;
    /** Extra teardown at the end of `up`. */
    onUpExtra?: () => void;
    /** Extra logic in `hit` after the standard focus dispatch. */
    onHitExtra?: () => void;
    /** Extra logic at the start of `keyfocusout` (before commit/clear). */
    onKeyFocusOutExtra?: () => void;
}

/**
 * Register the standard line-family drag handler set on a JSXgraph object.
 *
 * Handles the full state machine — pointerdown capture, drag-threshold
 * detection, transient move dispatch, drag-coords reset, click/commit
 * disambiguation on up, keyboard Enter as click, keyfocusout commit — that
 * every draggable line-family renderer needs. Per-renderer payload shapes
 * and snapshot semantics are supplied via the `snapshot` / `buildMoveArgs`
 * callbacks; cross-object coordination is supplied via the
 * `coordination` refs.
 *
 * Returns nothing; handlers are detached by the existing
 * `removeJXGEventHandlers` flow when the renderer rebuilds the JXG element.
 */
export function attachLineFamilyDragHandlers<TTag, TSnapshot>(
    config: AttachDragHandlersConfig<TTag, TSnapshot>,
): void {
    const {
        jxg,
        tag,
        dragState,
        coordination,
        componentIdx,
        callAction,
        fixedRef,
        shouldDispatchFocusOnDown,
        actions,
        snapshot,
        buildTransientMoveArgs,
        buildCommitMoveArgs,
        dispatchTransientBelowThreshold,
        onDragApplied,
        suppressClickWhenDownOnOtherTag,
        suppressFocusOnDownWhenDownOnOtherTag,
        participatesInDownTag = true,
        clickPreludeGate,
        onDownExtra,
        onUpExtra,
        onHitExtra,
        onKeyFocusOutExtra,
    } = config;

    const focusArgs = { componentIdx };
    let currentSnapshot: TSnapshot | null = null;

    function dispatchFocus() {
        if (actions.focus) {
            callAction({ action: actions.focus, args: focusArgs });
        }
    }

    function dispatchClick() {
        if (!actions.click) {
            return;
        }
        const preludeOk = clickPreludeGate ? clickPreludeGate.current : true;
        if (actions.clickPrelude && preludeOk) {
            callAction({ action: actions.clickPrelude });
        }
        callAction({ action: actions.click, args: focusArgs });
    }

    function dispatchCommit(variant: CommitVariant) {
        if (!actions.move) {
            return;
        }
        const args = buildCommitMoveArgs(currentSnapshot, variant);
        if (!args) {
            return;
        }
        callAction({ action: actions.move, args });
    }

    jxg.on("down", function (e: JXGEvent) {
        (document.activeElement as HTMLElement | null)?.blur();

        coordination.draggedTag.current = null;
        dragState.pointerAtDown.current = [e.x, e.y];
        if (participatesInDownTag) {
            coordination.downOnTag.current = tag;
        }

        currentSnapshot = snapshot();

        dragState.pointerIsDown.current = true;
        dragState.pointerMovedSinceDown.current = false;

        const focusGate = shouldDispatchFocusOnDown
            ? shouldDispatchFocusOnDown()
            : !fixedRef.current;
        const focusSuppressed =
            suppressFocusOnDownWhenDownOnOtherTag &&
            coordination.downOnTag.current !== null &&
            coordination.downOnTag.current !== tag;
        if (focusGate && !focusSuppressed) {
            dispatchFocus();
        }

        onDownExtra?.(e);
    });

    jxg.on("hit", function (_e: JXGEvent) {
        coordination.draggedTag.current = null;
        // Some renderers (line, circle) re-snapshot on `hit` so a keyboard
        // focus refreshes the captured position. Cheap to do unconditionally.
        currentSnapshot = snapshot();
        dispatchFocus();
        onHitExtra?.();
    });

    jxg.on("drag", function (e: JXGEvent) {
        const aboveThreshold = exceededDragThreshold(
            e,
            dragState.pointerAtDown.current,
        );

        if (aboveThreshold) {
            coordination.draggedTag.current = tag;
        }

        if (aboveThreshold || dispatchTransientBelowThreshold) {
            const args = buildTransientMoveArgs(e, currentSnapshot);
            if (args && actions.move) {
                callAction({ action: actions.move, args });
            }
        }

        onDragApplied?.(currentSnapshot, e);
    });

    jxg.on("up", function (_e: JXGEvent) {
        if (coordination.draggedTag.current === tag) {
            dispatchCommit("up");
            coordination.draggedTag.current = null;
        } else if (
            !dragState.pointerMovedSinceDown.current &&
            !fixedRef.current &&
            !(
                suppressClickWhenDownOnOtherTag &&
                coordination.downOnTag.current !== null &&
                coordination.downOnTag.current !== tag
            )
        ) {
            dispatchClick();
        }

        if (coordination.downOnTag.current === tag) {
            coordination.downOnTag.current = null;
        }
        dragState.pointerIsDown.current = false;
        onUpExtra?.();
    });

    jxg.on("keyfocusout", function (_e: JXGEvent) {
        onKeyFocusOutExtra?.();
        if (coordination.draggedTag.current === tag) {
            dispatchCommit("keyFocusOut");
        }
        coordination.draggedTag.current = null;
    });

    jxg.on("keydown", function (e: JXGEvent) {
        if (e.key !== "Enter") {
            return;
        }
        if (coordination.draggedTag.current === tag) {
            dispatchCommit("keyEnter");
            coordination.draggedTag.current = null;
        }
        dispatchClick();
    });
}
