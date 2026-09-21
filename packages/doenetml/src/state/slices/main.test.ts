import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import {
    actionIdentifier,
    clearPendingValuesForAction,
    mainSlice,
    mainThunks,
    UpdatesToIgnore,
} from "./main";

const COMPONENT_IDX = 7;
const OTHER_COMPONENT_IDX = 8;
const CORE_ID = "core";

function setup() {
    const store = configureStore({ reducer: { main: mainSlice.reducer } });
    const updatesToIgnore: UpdatesToIgnore = new Map();
    const updatesToIgnoreRef = { current: updatesToIgnore };

    /**
     * Stand in for the renderer showing `value` before core has answered, the
     * way `callAction` does when it is given a `baseVariableValue`.
     */
    function eagerlyShow(actionId: string, value: any, componentIdx: number) {
        updatesToIgnore.set(actionIdentifier(actionId, componentIdx), {
            componentIdx,
            value,
        });
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
        });
        updatesToIgnore.set(actionIdentifier("act2", OTHER_COMPONENT_IDX), {
            componentIdx: OTHER_COMPONENT_IDX,
            value: "hello",
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
