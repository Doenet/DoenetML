import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Hint tag tests", async () => {
    it("hints with and without title", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <hint name="hint1">
        <p name="p1">Hello</p>
      </hint>
    
      <hint name="hint2">
        <title>Hint 2</title>
        <p name="p2">Good day!</p>
      </hint>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .title,
        ).eq("Hint");
        expect(
            stateVariables[await resolvePathToNodeIdx("hint2")].stateValues
                .title,
        ).eq("Hint 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint2")].stateValues
                .open,
        ).eq(false);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint1"),
            actionName: "revealHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint2")].stateValues
                .open,
        ).eq(false);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint2"),
            actionName: "revealHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint2")].stateValues
                .open,
        ).eq(true);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint1"),
            actionName: "closeHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint2")].stateValues
                .open,
        ).eq(true);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint2"),
            actionName: "closeHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint2")].stateValues
                .open,
        ).eq(false);
    });

    it("copy and overwrite title", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <hint name="hint1">
        <title>Hint 1</title>
        <p name="p1">Hello</p>
      </hint>
    
      <hint name="revised" extend="$hint1">
        <title>Hint 2</title>
        <p name="p2">Good day!</p>
      </hint>

      <p>Title of original hint: <text extend="$hint1.title" name="title1" /></p>
      <p>Title of revised hint: <text extend="$revised.title" name="title2" /></p>
    
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .title,
        ).eq("Hint 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .title,
        ).eq("Hint 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("title1")].stateValues
                .value,
        ).eq("Hint 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("title2")].stateValues
                .value,
        ).eq("Hint 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .open,
        ).eq(false);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint1"),
            actionName: "revealHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .open,
        ).eq(false);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("revised"),
            actionName: "revealHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .open,
        ).eq(true);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint1"),
            actionName: "closeHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .open,
        ).eq(true);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("revised"),
            actionName: "closeHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .open,
        ).eq(false);
    });

    it("Can open hint in read only mode", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <hint name="hint1">
        <title>Hello</title>
        <p>Content</p>
      </hint>

      <p><textInput name="ti" /></p>
    `,
            flags: { readOnly: true },
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .title,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("ti")].stateValues
                .disabled,
        ).eq(true);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint1"),
            actionName: "revealHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(true);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint1"),
            actionName: "closeHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint1")].stateValues
                .open,
        ).eq(false);
    });
});
