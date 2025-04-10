import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function revealSolution({ name, core }: { name: string; core: Core }) {
    await core.requestAction({
        actionName: "revealSolution",
        componentName: name,
        args: {},
        event: null,
    });
}
async function closeSolution({ name, core }: { name: string; core: Core }) {
    await core.requestAction({
        actionName: "closeSolution",
        componentName: name,
        args: {},
        event: null,
    });
}

describe("Solution tag tests", async () => {
    it("solution isn't created before opening", async () => {
        let core = await createTestCore({
            doenetML: `
  <solution name="sol">
    <p name="solutionText">This is the text of the solution.</p>
  </solution>
  `,
        });
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/solutionText"]).be.undefined;

        await revealSolution({ name: "/sol", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/solutionText"].stateValues.text).eq(
            "This is the text of the solution.",
        );
    });

    it("Can open solution in read only mode", async () => {
        let core = await createTestCore({
            doenetML: `
      <solution name="solution1">
        <title name="title">Hello</title>
        <p name="p">Content</p>
      </solution>

      <p><textInput name="ti" /></p>
    `,
            flags: { readOnly: true },
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/title"]).be.undefined;
        expect(stateVariables["/p"]).be.undefined;
        expect(stateVariables["/ti"].stateValues.disabled).eq(true);

        await revealSolution({ name: "/solution1", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/title"].stateValues.text).eq("Hello");
        expect(stateVariables["/p"].stateValues.text).eq("Content");
    });

    it("empty solution", async () => {
        // an empty solution was creating an infinite loop
        // as the zero replacements were always treated as uninitialized
        let core = await createTestCore({
            doenetML: `
  <solution name="sol" />
  <boolean name="solOpen" copySource="sol.open" />
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);

        await revealSolution({ name: "/sol", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/solOpen"].stateValues.value).eq(true);

        await closeSolution({ name: "/sol", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);
    });
});
