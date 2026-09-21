import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import {
    actionIdentifier,
    mainSlice,
    mainThunks,
    type UniqueActionIdentifier,
} from "./main";

/**
 * `updateRendererSVs` reconciles a renderer batch from core against the
 * optimistic edits the renderer is still holding (`updatesToIgnore`).
 *
 * Core now splits a drag's fan-out in two: the dragged component's own state
 * goes out at once, and the rest follows on a timer tagged `deferred`. That
 * second batch carries the first one's `actionId`, so it must be kept out of
 * the reconciliation entirely — otherwise it misses on `updatesToIgnore` and
 * clears the map, taking with it a pending entry belonging to whatever the
 * reader has started doing since.
 */
function makeStore() {
    return configureStore({ reducer: { main: mainSlice.reducer } });
}

const COREID = "core1";
const COMPONENT_IDX = 7;

function pendingEdit(value: unknown, actionId: string) {
    const map = new Map<UniqueActionIdentifier, string>();
    map.set(
        actionIdentifier(actionId, COMPONENT_IDX),
        value as unknown as string,
    );
    return { current: map };
}

async function sendBatch({
    store,
    updatesToIgnoreRef,
    value,
    actionId,
    deferred,
}: {
    store: ReturnType<typeof makeStore>;
    updatesToIgnoreRef: { current: Map<UniqueActionIdentifier, string> };
    value: unknown;
    actionId: string;
    deferred?: boolean;
}) {
    await store.dispatch(
        mainThunks.updateRendererSVs({
            coreId: COREID,
            componentIdx: COMPONENT_IDX,
            stateValues: { value },
            baseStateVariable: "value",
            actionId,
            updatesToIgnoreRef,
            prefixForIds: "",
            deferred,
        }) as any,
    );
    return store.getState().main.componentInfo[COREID + COMPONENT_IDX];
}

describe("updateRendererSVs and the deferred remainder of a drag", () => {
    it("ignores an update that matches the edit the renderer already showed", async () => {
        const updatesToIgnoreRef = pendingEdit("typed", "action-1");

        const info = await sendBatch({
            store: makeStore(),
            updatesToIgnoreRef,
            value: "typed",
            actionId: "action-1",
        });

        expect(info.ignoreUpdate).toBe(true);
        // Consumed, since this batch is the answer to that very edit.
        expect(updatesToIgnoreRef.current.size).toBe(0);
    });

    it("clears the pending edits when an undeferred batch disagrees with them", async () => {
        const updatesToIgnoreRef = pendingEdit("typed", "action-1");

        const info = await sendBatch({
            store: makeStore(),
            updatesToIgnoreRef,
            value: "something else",
            actionId: "action-2",
        });

        expect(info.ignoreUpdate).toBe(false);
        // This is the branch a deferred batch must not reach.
        expect(updatesToIgnoreRef.current.size).toBe(0);
    });

    it("leaves the pending edits alone when the batch is the deferred remainder", async () => {
        const updatesToIgnoreRef = pendingEdit("typed", "action-1");

        const info = await sendBatch({
            store: makeStore(),
            updatesToIgnoreRef,
            value: "something else",
            actionId: "action-2",
            deferred: true,
        });

        // The deferred batch is the settled downstream state, so the renderer
        // adopts it...
        expect(info.ignoreUpdate).toBe(false);
        expect(info.stateValues).toEqual({ value: "something else" });
        // ...but the reader's in-flight edit survives it.
        expect(updatesToIgnoreRef.current.size).toBe(1);
        expect(
            updatesToIgnoreRef.current.get(
                actionIdentifier("action-1", COMPONENT_IDX),
            ),
        ).toBe("typed");
    });
});
