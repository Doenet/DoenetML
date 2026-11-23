import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import {
    actionIdentifier,
    clearPendingValuesForAction,
    HeldRendererUpdates,
    mainSlice,
    mainThunks,
    takeHeldUpdatesNoLongerInFlight,
    UpdatesToIgnore,
} from "./main";

const COMPONENT_IDX = 7;
const OTHER_COMPONENT_IDX = 8;
const CORE_ID = "core";

function setup() {
    const store = configureStore({ reducer: { main: mainSlice.reducer } });
    const updatesToIgnore: UpdatesToIgnore = new Map();
    const updatesToIgnoreRef = { current: updatesToIgnore };
    const heldUpdates: HeldRendererUpdates = new Map();
    const heldUpdatesRef = { current: heldUpdates };

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
                heldUpdatesRef,
                prefixForIds: "",
            }) as any,
        );

        return componentInfo(componentIdx).ignoreUpdate;
    }

    function componentInfo(componentIdx = COMPONENT_IDX) {
        return mainSlice.selectors.componentInfo(store.getState() as any)[
            CORE_ID + componentIdx
        ];
    }

    /**
     * What the renderer shows for its base state variable: core's value,
     * unless the last update said to leave the renderer's own value alone.
     */
    function shown(componentIdx = COMPONENT_IDX) {
        const info = componentInfo(componentIdx);
        return info.ignoreUpdate ? "renderer's own" : info.stateValues.value;
    }

    /**
     * Stand in for the viewer settling an action, the way `resolveAction`
     * does: on core's reply (with whether core sent the action a renderer
     * update), when the action's own update has been processed
     * (`rendererUpdateFollows` false), or when the action fails. Keeps the
     * values when the update is still to come; otherwise drops them and puts
     * on screen the updates held for components no longer in flight.
     */
    async function settle(actionId: string, rendererUpdateFollows = false) {
        if (rendererUpdateFollows) {
            return;
        }
        clearPendingValuesForAction(updatesToIgnore, actionId);
        for (const held of takeHeldUpdatesNoLongerInFlight(
            updatesToIgnore,
            heldUpdates,
            CORE_ID,
        )) {
            await store.dispatch(
                mainThunks.updateRendererSVs({
                    ...held,
                    updatesToIgnoreRef,
                    heldUpdatesRef,
                }) as any,
            );
        }
    }

    /** Core's renderer update for `actionId`, followed by its settling. */
    async function actionUpdate(actionId: string, value: any) {
        const ignored = await updateFromCore({ actionId, value });
        await settle(actionId);
        return ignored;
    }

    return {
        updatesToIgnore,
        heldUpdates,
        eagerlyShow,
        updateFromCore,
        shown,
        settle,
        actionUpdate,
    };
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

describe("core's reply arriving before the renderer update it sent", () => {
    it("still recognizes the update for each key typed when the replies came first", async () => {
        const { updatesToIgnore, eagerlyShow, settle, actionUpdate, shown } =
            setup();
        // The reader types "9" and "0"; core replies to both, saying it sent
        // each a renderer update, before either update arrives.
        eagerlyShow("key9", "9", COMPONENT_IDX);
        eagerlyShow("key0", "90", COMPONENT_IDX);
        await settle("key9", true);
        await settle("key0", true);

        // The update for "9" must not put "9" back on screen over "90".
        expect(await actionUpdate("key9", "9")).toBe(true);
        expect(shown()).toBe("renderer's own");
        expect(await actionUpdate("key0", "90")).toBe(true);
        expect(updatesToIgnore.size).toBe(0);
    });

    it("lets the first key's update arrive before the next key is typed", async () => {
        const { updatesToIgnore, eagerlyShow, settle, actionUpdate } = setup();
        eagerlyShow("key9", "9", COMPONENT_IDX);
        await settle("key9", true);
        expect(await actionUpdate("key9", "9")).toBe(true);
        expect(updatesToIgnore.size).toBe(0);
    });

    it("takes core's answer when it disagrees, even after the reply came first", async () => {
        const { eagerlyShow, settle, actionUpdate, shown } = setup();
        eagerlyShow("key9", "9", COMPONENT_IDX);
        await settle("key9", true);

        // The document refused the value.
        expect(await actionUpdate("key9", "")).toBe(false);
        expect(shown()).toBe("");
    });

    it("stops waiting at once when core sent no update for the action", async () => {
        const { updatesToIgnore, eagerlyShow, settle, updateFromCore } =
            setup();
        // A bare Enter in an input whose value is already committed.
        eagerlyShow("enter", "90", COMPONENT_IDX);
        await settle("enter", false);
        expect(updatesToIgnore.size).toBe(0);

        expect(await updateFromCore({ actionId: "later", value: "5" })).toBe(
            false,
        );
    });
});

describe("updates held while the component's own action is in flight", () => {
    it("puts a held update on screen when the action changed nothing", async () => {
        const { heldUpdates, eagerlyShow, updateFromCore, settle, shown } =
            setup();
        // The reader presses Enter in a box showing "90", while another
        // action changes the input to "5"; core handles that one first.
        eagerlyShow("enter", "90", COMPONENT_IDX);
        expect(await updateFromCore({ actionId: "other", value: "5" })).toBe(
            true,
        );
        expect(heldUpdates.has(COMPONENT_IDX)).toBe(true);

        // The Enter changed nothing, so core sent it no update.
        await settle("enter", false);

        expect(shown()).toBe("5");
        expect(heldUpdates.size).toBe(0);
    });

    it("puts a held update on screen when core sent it under no action", async () => {
        const { eagerlyShow, updateFromCore, settle, shown } = setup();
        // Core redraws the input on its own, under no action, and sends the
        // reader's action no update.
        eagerlyShow("key9", "9", COMPONENT_IDX);
        expect(await updateFromCore({ value: "" })).toBe(true);
        await settle("key9", false);

        expect(shown()).toBe("");
    });

    it("drops a held update once the action's own update has arrived", async () => {
        const {
            heldUpdates,
            eagerlyShow,
            updateFromCore,
            actionUpdate,
            shown,
        } = setup();
        // `focusChanged` from a click, built before core handled the click.
        eagerlyShow("click", true, COMPONENT_IDX);
        expect(await updateFromCore({ actionId: "focus", value: false })).toBe(
            true,
        );

        expect(await actionUpdate("click", true)).toBe(true);
        expect(heldUpdates.size).toBe(0);
        expect(shown()).toBe("renderer's own");
    });

    it("keeps holding while another of the component's actions is in flight", async () => {
        const {
            heldUpdates,
            eagerlyShow,
            updateFromCore,
            settle,
            actionUpdate,
        } = setup();
        eagerlyShow("enter", "9", COMPONENT_IDX);
        eagerlyShow("key0", "90", COMPONENT_IDX);
        await updateFromCore({ actionId: "other", value: "" });

        await settle("enter", false);
        expect(heldUpdates.has(COMPONENT_IDX)).toBe(true);

        expect(await actionUpdate("key0", "90")).toBe(true);
        expect(heldUpdates.size).toBe(0);
    });

    it("drops every held update when core's answer disagrees", async () => {
        const { heldUpdates, eagerlyShow, updateFromCore } = setup();
        eagerlyShow("a", "x", COMPONENT_IDX);
        eagerlyShow("b", "y", OTHER_COMPONENT_IDX);
        await updateFromCore({
            actionId: "other",
            value: "old",
            componentIdx: OTHER_COMPONENT_IDX,
        });
        expect(heldUpdates.has(OTHER_COMPONENT_IDX)).toBe(true);

        expect(await updateFromCore({ actionId: "a", value: "z" })).toBe(false);
        expect(heldUpdates.size).toBe(0);
    });

    it("drops held updates from a core that has been replaced", () => {
        const updatesToIgnore: UpdatesToIgnore = new Map();
        const heldUpdates: HeldRendererUpdates = new Map();
        heldUpdates.set(COMPONENT_IDX, {
            coreId: "old core",
            componentIdx: COMPONENT_IDX,
            stateValues: { value: 1 },
            prefixForIds: "",
        });

        expect(
            takeHeldUpdatesNoLongerInFlight(
                updatesToIgnore,
                heldUpdates,
                CORE_ID,
            ),
        ).toEqual([]);
        expect(heldUpdates.size).toBe(0);
    });
});
