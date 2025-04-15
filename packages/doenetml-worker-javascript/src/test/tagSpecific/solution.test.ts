import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function revealSolution({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        actionName: "revealSolution",
        componentName: name,
        args: {},
    });
}
async function closeSolution({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        actionName: "closeSolution",
        componentName: name,
        args: {},
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
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solutionText"]).be.undefined;

        await revealSolution({ name: "/sol", core });
        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/title"]).be.undefined;
        expect(stateVariables["/p"]).be.undefined;
        expect(stateVariables["/ti"].stateValues.disabled).eq(true);

        await revealSolution({ name: "/solution1", core });
        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);

        await revealSolution({ name: "/sol", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(true);

        await closeSolution({ name: "/sol", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);
    });

    it("solution display mode = displayed", async () => {
        let core = await createTestCore({
            doenetML: `
  <solution name="sol">
    <p name="p">The solution</p>
  </solution>
  <boolean name="solOpen" copySource="sol.open" />
  `,
            flags: { solutionDisplayMode: "displayed" },
        });

        // Solution starts out open
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(true);
        expect(stateVariables["/p"].stateValues.text).eq("The solution");

        // The solution cannot be closed
        await closeSolution({ name: "/sol", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(true);
    });

    it("solution display mode = none", async () => {
        let core = await createTestCore({
            doenetML: `
  <solution name="sol">
    <p name="p">The solution</p>
  </solution>
  <boolean name="solOpen" copySource="sol.open" />
  `,
            flags: { solutionDisplayMode: "none" },
        });

        // Solution is hidden
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);
        expect(stateVariables["/sol"].stateValues.hidden).eq(true);
        expect(stateVariables["/p"]).be.undefined;

        // The solution cannot be opened
        await revealSolution({ name: "/sol", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);
        expect(stateVariables["/sol"].stateValues.hidden).eq(true);
        expect(stateVariables["/p"]).be.undefined;
    });

    it("request solution view, solution display mode = buttonRequirePermission", async () => {
        // an empty solution was creating an infinite loop
        // as the zero replacements were always treated as uninitialized
        let numRequests = 0;

        const doenetML = `
  <solution name="sol">
    <p name="p">The solution</p>
  </solution>
  <boolean name="solOpen" copySource="sol.open" />
  `;

        // first, we allow solution views
        let core = await createTestCore({
            doenetML,
            flags: { solutionDisplayMode: "buttonRequirePermission" },
            requestSolutionView: async () => {
                numRequests++;
                return { allowView: true };
            },
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);
        expect(stateVariables["/p"]).be.undefined;
        expect(numRequests).eq(0);

        await revealSolution({ name: "/sol", core });
        expect(numRequests).eq(1);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(true);
        expect(stateVariables["/p"].stateValues.text).eq("The solution");

        await closeSolution({ name: "/sol", core });
        expect(numRequests).eq(1);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);

        // second, we do not allow solution views
        core = await createTestCore({
            doenetML,
            flags: { solutionDisplayMode: "buttonRequirePermission" },
            requestSolutionView: async () => {
                numRequests++;
                return { allowView: false };
            },
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);
        expect(stateVariables["/p"]).be.undefined;
        expect(numRequests).eq(1);

        await revealSolution({ name: "/sol", core });
        expect(numRequests).eq(2);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/solOpen"].stateValues.value).eq(false);
        expect(stateVariables["/p"]).be.undefined;
    });
});
