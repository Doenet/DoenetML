import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import {
    actionIdentifier,
    clearPendingValuesForAction,
    dropAnsweredPendingValuesBefore,
    hasPendingValuesBefore,
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

        // Taking either of these would put "9" or "90" back in the box, and the
        // update for "908" would then be ignored because a newer key is in
        // flight by the time it arrives. The first arrives while no key is
        // waiting on core's reply, so only the answered values can hold it
        // back.
        expect(await updateFromCore({ actionId: "key1", value: "9" })).toBe(
            true,
        );

        // The reader types another key before the other updates arrive.
        eagerlyShow("key3", "908", COMPONENT_IDX);

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
        // Leaving a box whose value is already committed, or pressing Enter
        // again with nothing changed: core changes nothing and sends no
        // renderer update for it.
        const blur = eagerlyShow("blur", "9", COMPONENT_IDX);
        markPendingValuesAnswered(updatesToIgnore, "blur");

        // The update for an action sent after it (the blur's `focusChanged`)
        // arrives.
        dropAnsweredPendingValuesBefore(updatesToIgnore, blur + 1);

        expect(updatesToIgnore.size).toBe(0);
        expect(await updateFromCore({ actionId: "later", value: "x" })).toBe(
            false,
        );
    });

    it("stops waiting at once when the reply comes after an update for a later action", async () => {
        const { updatesToIgnore, eagerlyShow, updateFromCore } = setup();
        // Leaving a box whose value is already committed: core changes nothing
        // and sends no renderer update for it.
        const blur = eagerlyShow("blur", "9", COMPONENT_IDX);
        // The update for an action sent after it (a button that changes the
        // box's value while the box is offscreen) arrives before core's reply
        // to the blur, so it cannot drop the blur's value yet.
        const button = blur + 1;
        dropAnsweredPendingValuesBefore(updatesToIgnore, button);
        expect(updatesToIgnore.size).toBe(1);

        // The reply comes now. That later update has already been processed,
        // so the blur's update has been too, or is not coming.
        markPendingValuesAnswered(updatesToIgnore, "blur", button);
        expect(updatesToIgnore.size).toBe(0);

        // The box's new value, sent offscreen in a deferred batch that carries
        // the button's `actionId`, is taken.
        expect(await updateFromCore({ actionId: "button", value: "5" })).toBe(
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

describe("markPendingValuesAnswered with the latest action updated", () => {
    it("keeps the values when no later action's update has been processed", () => {
        const updatesToIgnore: UpdatesToIgnore = new Map();
        updatesToIgnore.set(actionIdentifier("act3", COMPONENT_IDX), {
            componentIdx: COMPONENT_IDX,
            value: "9",
            sequence: 3,
        });

        // The latest update processed is this action's own, or an earlier one.
        markPendingValuesAnswered(updatesToIgnore, "act3", 3);

        expect(
            updatesToIgnore.get(actionIdentifier("act3", COMPONENT_IDX))
                ?.answered,
        ).toBe(true);
    });

    it("drops only this action's values when a later action's update has been processed", () => {
        const updatesToIgnore: UpdatesToIgnore = new Map();
        updatesToIgnore.set(actionIdentifier("act3", COMPONENT_IDX), {
            componentIdx: COMPONENT_IDX,
            value: "9",
            sequence: 3,
        });
        updatesToIgnore.set(actionIdentifier("act2", OTHER_COMPONENT_IDX), {
            componentIdx: OTHER_COMPONENT_IDX,
            value: "x",
            sequence: 2,
        });

        markPendingValuesAnswered(updatesToIgnore, "act3", 4);

        expect([...updatesToIgnore.keys()]).toEqual([
            actionIdentifier("act2", OTHER_COMPONENT_IDX),
        ]);
        expect(
            updatesToIgnore.get(actionIdentifier("act2", OTHER_COMPONENT_IDX))
                ?.answered,
        ).toBeUndefined();
    });
});

describe("hasPendingValuesBefore", () => {
    // After core replies to an action, `DocViewer` forgets the action's number
    // unless its update could still drop something: a value an earlier action
    // left pending. Actions that get no update (`recordVisibilityChange` as
    // the reader scrolls) would otherwise pile up.

    it("is false when nothing is pending", () => {
        expect(hasPendingValuesBefore(new Map(), 5)).toBe(false);
    });

    it("counts only values left by actions sent earlier", () => {
        const updatesToIgnore: UpdatesToIgnore = new Map();
        updatesToIgnore.set(actionIdentifier("own", COMPONENT_IDX), {
            componentIdx: COMPONENT_IDX,
            value: "9",
            sequence: 3,
            answered: true,
        });
        updatesToIgnore.set(actionIdentifier("later", OTHER_COMPONENT_IDX), {
            componentIdx: OTHER_COMPONENT_IDX,
            value: "x",
            sequence: 4,
        });

        expect(hasPendingValuesBefore(updatesToIgnore, 3)).toBe(false);
        expect(hasPendingValuesBefore(updatesToIgnore, 4)).toBe(true);
    });

    it("counts earlier values whether or not core has answered them", () => {
        const updatesToIgnore: UpdatesToIgnore = new Map();
        updatesToIgnore.set(actionIdentifier("blur", COMPONENT_IDX), {
            componentIdx: COMPONENT_IDX,
            value: "9",
            sequence: 1,
        });
        expect(hasPendingValuesBefore(updatesToIgnore, 2)).toBe(true);

        markPendingValuesAnswered(updatesToIgnore, "blur");
        expect(hasPendingValuesBefore(updatesToIgnore, 2)).toBe(true);
    });
});
