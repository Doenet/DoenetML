import { describe, expect, it } from "vitest";
import { createTestCore } from "./test-core";

/**
 * Core's reply to an action says whether core sent the action a renderer
 * batch (`rendererUpdateSent`). The reply and the batch reach the viewer on
 * different message channels, so the reply can arrive first. With the flag the
 * viewer keeps the value an input showed ahead of core until the batch
 * arrives, and lets go of it at once when no batch is coming (`resolveAction`
 * in `DocViewer`).
 */
async function setup() {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: `<textInput name="ti" /><p><text name="echo">$ti.immediateValue</text></p>`,
    });
    const innerCore = (core as any).core;

    const batchActionIds: (string | undefined)[] = [];
    innerCore.updateRenderersCallback = (args: any) => {
        if (!args.deferred) {
            batchActionIds.push(args.actionId);
        }
    };

    const inputIdx = await resolvePathToNodeIdx("ti");

    async function act(actionName: string, args: Record<string, any>) {
        return await (core as any).requestAction({
            componentIdx: inputIdx,
            actionName,
            args,
        });
    }

    return { innerCore, batchActionIds, act };
}

describe("the reply to an action says whether a renderer batch was sent", () => {
    it("says so for a keystroke, whose batch carries its id", async () => {
        const { batchActionIds, act } = await setup();

        const reply = await act("updateImmediateValue", {
            text: "9",
            actionId: "key9",
        });

        expect(batchActionIds).toContain("key9");
        expect(reply).toMatchObject({
            actionId: "key9",
            rendererUpdateSent: true,
        });
    });

    it("says not for an action that sends no batch", async () => {
        const { batchActionIds, act } = await setup();
        // Enter commits the typed value; a second Enter has nothing to
        // commit, so core sends no batch for it.
        await act("updateImmediateValue", { text: "9", actionId: "key9" });
        await act("updateValue", { actionId: "enter1" });

        const reply = await act("updateValue", { actionId: "enter2" });

        expect(batchActionIds).not.toContain("enter2");
        expect(reply).toMatchObject({
            actionId: "enter2",
            rendererUpdateSent: false,
        });
    });

    it("says not for an action the component does not have", async () => {
        const { act } = await setup();

        const reply = await act("noSuchAction", { actionId: "none" });

        expect(reply).toMatchObject({ rendererUpdateSent: false });
    });

    it("forgets the action once it has replied", async () => {
        const { innerCore, act } = await setup();

        await act("updateImmediateValue", { text: "9", actionId: "key9" });
        await act("noSuchAction", { actionId: "none" });

        expect(
            innerCore.rendererInstructionBuilder.actionsWithRendererUpdate.size,
        ).toBe(0);
    });

    it("leaves a reply to an action sent without an id as it was", async () => {
        const { act } = await setup();

        const reply = await act("updateImmediateValue", { text: "9" });

        expect(reply).not.toHaveProperty("rendererUpdateSent");
    });
});
