import type { JXGEvent } from "../jsxgraph-distrib/types";

/**
 * An id for the pointer event `e`, sent with the click or focus action it
 * causes. JSXGraph hands one pointer event to every object under the
 * pointer, so the actions those objects send for it carry the same id, and
 * the worker runs an action chained to several of them once
 * (`ActionTriggerScheduler.triggerChainedActions`).
 *
 * `undefined` when `e` carries no time stamp.
 */
export function gestureIdOfEvent(e: JXGEvent | undefined): string | undefined {
    if (e?.timeStamp === undefined) {
        return undefined;
    }
    return `${e.pointerId ?? e.type}|${e.timeStamp}`;
}

/**
 * The args of a click or focus action of `componentIdx`, with the gesture id
 * of `e`, the pointer event that caused it, if there is one.
 */
export function clickActionArgs(componentIdx: number, e?: JXGEvent) {
    const gestureId = gestureIdOfEvent(e);
    return gestureId === undefined
        ? { componentIdx }
        : { componentIdx, gestureId };
}
