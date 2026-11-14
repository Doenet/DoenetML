import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import {
    actionIdentifier,
    clearPendingValuesForAction,
    dropAnsweredPendingValuesBefore,
    mainSlice,
    mainThunks,
    markPendingValuesAnswered,
    UpdatesToIgnore,
} from "./main";

const COMPONENT_IDX = 7;
const OTHER_COMPONENT_IDX = 8;
const CORE_ID = "core";

function setup() {
    const store = configureStore({ reducer: { main: mainSlice.reducer } });
    const updatesToIgnore: UpdatesToIgnore = new Map();
    const updatesToIgnoreRef = { current: updatesToIgnore };
    let lastSequence = 0;

    /**
     * Stand in for the renderer showing `value` before core has answered, the
     * way `callAction` does when it is given a `baseVariableValue`. Returns the
     * action's place in the order actions are sent to core.
     */
    function eagerlyShow(actionId: string, value: any, componentIdx: number) {
        const sequence = ++lastSequence;
        updatesToIgnore.set(actionIdentifier(actionId, componentIdx), {
            componentIdx,
            value,
            sequence,
        });
        return sequence;
    }

    /**
     * Deliver one of core's renderer updates and report whether the renderer is
     * told to leave its base state variable alone.
     */
    async function updateFromCore({
        actionId,
        value,
        componentIdx = COMPONENT_IDX,
    }: {
        actionId?: string;
        value: any;
        componentIdx?: number;
    }) {
        await store.dispatch(
            mainThunks.updateRendererSVs({
                coreId: CORE_ID,
                componentIdx,
                stateValues: { value },
                childrenInstructions: [],
                baseStateVariable: "value",
                actionId,
                updatesToIgnoreRef,
                prefixForIds: "",
            }) as any,
        );

        return mainSlice.selectors.componentInfo(store.getState() as any)[
            CORE_ID + componentIdx
        ].ignoreUpdate;
    }

    return { updatesToIgnore, eagerlyShow, updateFromCore };
}

describe("ignoring core updates that the renderer is already ahead of", () => {
    it("ignores core's answer when it agrees with what the renderer showed", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        eagerlyShow("act1", true, COMPONENT_IDX);

        expect(await updateFromCore({ actionId: "act1", value: true })).toBe(
            true,
        );
        expect(updatesToIgnore.size).toBe(0);
    });

    it("takes core's answer when it disagrees with what the renderer showed", async () => {
        const { eagerlyShow, updateFromCore } = setup();
        eagerlyShow("act1", true, COMPONENT_IDX);

        // A constraint in the document kept the value at false.
        expect(await updateFromCore({ actionId: "act1", value: false })).toBe(
            false,
        );
    });

    it("ignores another action's update while the component's own action is in flight", async () => {
        const { eagerlyShow, updateFromCore } = setup();
        eagerlyShow("act1", true, COMPONENT_IDX);

        // `focusChanged` from the same click reaches core first, so its update
        // still carries the value from before the click.
        expect(await updateFromCore({ actionId: "focus", value: false })).toBe(
            true,
        );

        // Core then answers the click itself.
        expect(await updateFromCore({ actionId: "act1", value: true })).toBe(
            true,
        );
    });

    it("takes updates again once the component has no action in flight", async () => {
        const { eagerlyShow, updateFromCore } = setup();
        eagerlyShow("act1", true, COMPONENT_IDX);
        await updateFromCore({ actionId: "act1", value: true });

        // Some other part of the document turns the value back off.
        expect(await updateFromCore({ actionId: "later", value: false })).toBe(
            false,
        );
    });

    it("leaves other components' updates alone", async () => {
        const { eagerlyShow, updateFromCore } = setup();
        eagerlyShow("act1", true, COMPONENT_IDX);

        expect(
            await updateFromCore({
                actionId: "act2",
                value: false,
                componentIdx: OTHER_COMPONENT_IDX,
            }),
        ).toBe(false);
    });
});

describe("clearPendingValuesForAction", () => {
    it("drops only the entries belonging to the resolved action", () => {
        const updatesToIgnore: UpdatesToIgnore = new Map();
        updatesToIgnore.set(actionIdentifier("act1", COMPONENT_IDX), {
            componentIdx: COMPONENT_IDX,
            value: true,
            sequence: 1,
        });
        updatesToIgnore.set(actionIdentifier("act2", OTHER_COMPONENT_IDX), {
            componentIdx: OTHER_COMPONENT_IDX,
            value: "hello",
            sequence: 2,
        });

        clearPendingValuesForAction(updatesToIgnore, "act1");

        expect([...updatesToIgnore.keys()]).toEqual([
            actionIdentifier("act2", OTHER_COMPONENT_IDX),
        ]);
    });

    it("stops an unanswered action from suppressing later updates", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        // An action that core never reports a renderer state for.
        eagerlyShow("act1", true, COMPONENT_IDX);
        clearPendingValuesForAction(updatesToIgnore, "act1");

        expect(await updateFromCore({ actionId: "later", value: false })).toBe(
            false,
        );
    });
});

describe("core's reply arriving before the renderer update for the same action", () => {
    // Core sends an action's renderer update and then replies to the action,
    // but the two reach the viewer over different message channels, so the
    // reply can come first. `DocViewer` then calls `markPendingValuesAnswered`
    // where it used to call `clearPendingValuesForAction`.

    it("still recognizes the update for each key typed when the replies came first", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        eagerlyShow("key1", "9", COMPONENT_IDX);
        eagerlyShow("key2", "90", COMPONENT_IDX);
        markPendingValuesAnswered(updatesToIgnore, "key1");
        markPendingValuesAnswered(updatesToIgnore, "key2");

        // The reader types another key before the updates arrive.
        eagerlyShow("key3", "908", COMPONENT_IDX);

        // Taking either of these would put "9" or "90" back in the box, and the
        // update for "908" would then be ignored because a newer key is in
        // flight by the time it arrives.
        expect(await updateFromCore({ actionId: "key1", value: "9" })).toBe(
            true,
        );
        expect(await updateFromCore({ actionId: "key2", value: "90" })).toBe(
            true,
        );
        expect(await updateFromCore({ actionId: "key3", value: "908" })).toBe(
            true,
        );
        expect(updatesToIgnore.size).toBe(0);
    });

    it("takes core's answer when it disagrees, even after the reply came first", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        eagerlyShow("act1", true, COMPONENT_IDX);
        markPendingValuesAnswered(updatesToIgnore, "act1");

        expect(await updateFromCore({ actionId: "act1", value: false })).toBe(
            false,
        );
    });

    it("ignores an earlier action's update while an answered action's update is still to come", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        eagerlyShow("key1", "9", COMPONENT_IDX);
        markPendingValuesAnswered(updatesToIgnore, "key1");

        // `focusChanged` from clicking into the box was sent before the key,
        // so its update carries the value from before the key.
        expect(await updateFromCore({ actionId: "focus", value: "" })).toBe(
            true,
        );
    });

    it("stops waiting once an update for a later action shows the update is not coming", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        // Leaving a box whose value is already committed: core changes nothing
        // and sends no renderer update for it.
        const blur = eagerlyShow("blur", "9", COMPONENT_IDX);
        markPendingValuesAnswered(updatesToIgnore, "blur");

        // The update for an action sent after it arrives.
        dropAnsweredPendingValuesBefore(updatesToIgnore, blur + 1);

        expect(updatesToIgnore.size).toBe(0);
        expect(await updateFromCore({ actionId: "later", value: "x" })).toBe(
            false,
        );
    });

    it("keeps values of actions sent later, and of actions core has not answered", () => {
        const { updatesToIgnore, eagerlyShow } = setup();
        const first = eagerlyShow("unanswered", "9", COMPONENT_IDX);
        eagerlyShow("later", "90", COMPONENT_IDX);
        markPendingValuesAnswered(updatesToIgnore, "later");

        dropAnsweredPendingValuesBefore(updatesToIgnore, first + 1);

        expect([...updatesToIgnore.keys()]).toEqual([
            actionIdentifier("unanswered", COMPONENT_IDX),
            actionIdentifier("later", COMPONENT_IDX),
        ]);
    });

    it("takes an update core sent on its own once the component's actions are answered", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        eagerlyShow("blur", "9", COMPONENT_IDX);
        eagerlyShow("other", "x", OTHER_COMPONENT_IDX);
        markPendingValuesAnswered(updatesToIgnore, "blur");
        markPendingValuesAnswered(updatesToIgnore, "other");

        // A timer in the document changes the value.
        expect(await updateFromCore({ value: "10" })).toBe(false);
        expect([...updatesToIgnore.keys()]).toEqual([
            actionIdentifier("other", OTHER_COMPONENT_IDX),
        ]);
    });

    it("still ignores an update core sent on its own while an action is unanswered", async () => {
        const { eagerlyShow, updateFromCore } = setup();
        eagerlyShow("key1", "9", COMPONENT_IDX);

        expect(await updateFromCore({ value: "" })).toBe(true);
    });
});

describe("markPendingValuesAnswered", () => {
    it("marks only the entries belonging to the answered action", () => {
        const updatesToIgnore: UpdatesToIgnore = new Map();
        updatesToIgnore.set(actionIdentifier("act1", COMPONENT_IDX), {
            componentIdx: COMPONENT_IDX,
            value: true,
            sequence: 1,
        });
        updatesToIgnore.set(actionIdentifier("act10", OTHER_COMPONENT_IDX), {
            componentIdx: OTHER_COMPONENT_IDX,
            value: "hello",
            sequence: 2,
        });

        markPendingValuesAnswered(updatesToIgnore, "act1");

        expect(
            updatesToIgnore.get(actionIdentifier("act1", COMPONENT_IDX))
                ?.answered,
        ).toBe(true);
        expect(
            updatesToIgnore.get(actionIdentifier("act10", OTHER_COMPONENT_IDX))
                ?.answered,
        ).toBeUndefined();
    });
});
