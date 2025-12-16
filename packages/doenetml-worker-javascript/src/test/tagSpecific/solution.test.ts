import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function revealSolution({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        actionName: "revealSolution",
        componentIdx,
        args: {},
    });
}
async function closeSolution({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        actionName: "closeSolution",
        componentIdx,
        args: {},
    });
}

describe("Solution tag tests", async () => {
    it("solution isn't created before opening", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <solution name="sol">
    <p name="solutionText">This is the text of the solution.</p>
  </solution>
  `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[await resolvePathToNodeIdx("solutionText")]).be
            .undefined;

        await revealSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solutionText")]
                .stateValues.text,
        ).eq("This is the text of the solution.");
    });

    it("Can open solution in read only mode", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
        expect(
            stateVariables[await resolvePathToNodeIdx("title")].stateValues
                .text,
        ).eq("Hello");
        expect(stateVariables[await resolvePathToNodeIdx("p")]).be.undefined;
        expect(
            stateVariables[await resolvePathToNodeIdx("ti")].stateValues
                .disabled,
        ).eq(true);

        await revealSolution({
            componentIdx: await resolvePathToNodeIdx("solution1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("title")].stateValues
                .text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("Content");
    });

    it("empty solution", async () => {
        // an empty solution was creating an infinite loop
        // as the zero replacements were always treated as uninitialized
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <solution name="sol" />
  <boolean name="solOpen" extend="$sol.open" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);

        await revealSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(true);

        await closeSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);
    });

    it("solution display mode = displayed", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <solution name="sol">
    <p name="p">The solution</p>
  </solution>
  <boolean name="solOpen" extend="$sol.open" />
  `,
            flags: { solutionDisplayMode: "displayed" },
        });

        // Solution starts out open
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The solution");

        // The solution cannot be closed
        await closeSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(true);
    });

    it("solution display mode = none", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <solution name="sol">
    <p name="p">The solution</p>
  </solution>
  <boolean name="solOpen" extend="$sol.open" />
  `,
            flags: { solutionDisplayMode: "none" },
        });

        // Solution is hidden
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sol")].stateValues
                .hidden,
        ).eq(true);
        expect(stateVariables[await resolvePathToNodeIdx("p")]).be.undefined;

        // The solution cannot be opened
        await revealSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sol")].stateValues
                .hidden,
        ).eq(true);
        expect(stateVariables[await resolvePathToNodeIdx("p")]).be.undefined;
    });

    it("request solution view, solution display mode = buttonRequirePermission", async () => {
        // an empty solution was creating an infinite loop
        // as the zero replacements were always treated as uninitialized
        let numRequests = 0;

        const doenetML = `
  <solution name="sol">
    <p name="p">The solution</p>
  </solution>
  <boolean name="solOpen" extend="$sol.open" />
  `;

        // first, we allow solution views
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            flags: { solutionDisplayMode: "buttonRequirePermission" },
            requestSolutionView: async () => {
                numRequests++;
                return { allowView: true };
            },
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);
        expect(stateVariables[await resolvePathToNodeIdx("p")]).be.undefined;
        expect(numRequests).eq(0);

        await revealSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        expect(numRequests).eq(1);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The solution");

        await closeSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        expect(numRequests).eq(1);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);

        // second, we do not allow solution views
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            flags: { solutionDisplayMode: "buttonRequirePermission" },
            requestSolutionView: async () => {
                numRequests++;
                return { allowView: false };
            },
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);
        expect(stateVariables[await resolvePathToNodeIdx("p")]).be.undefined;
        expect(numRequests).eq(1);

        await revealSolution({
            componentIdx: await resolvePathToNodeIdx("sol"),
            core,
        });
        expect(numRequests).eq(2);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("solOpen")].stateValues
                .value,
        ).eq(false);
        expect(stateVariables[await resolvePathToNodeIdx("p")]).be.undefined;
    });

    it.only("referenced solution", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <section name="s1"><solution name="sol">This is the text of the solution.</solution></section>

  <section name="s2">$sol</section>
  `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);

        const sol = await resolvePathToNodeIdx("sol");
        const sol2 =
            stateVariables[await resolvePathToNodeIdx("s2")].activeChildren[0]
                .componentIdx;

        expect(stateVariables[sol].activeChildren.length).eq(0);
        expect(stateVariables[sol2].activeChildren.length).eq(0);

        await revealSolution({
            componentIdx: sol2,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[sol].activeChildren).eqls([
            "This is the text of the solution.",
        ]);
        expect(stateVariables[sol2].activeChildren).eqls([
            "This is the text of the solution.",
        ]);
    });

    it.only("extended solution", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <solution name="sol"><p name="p1">This is the text of the solution.</p></solution>

  <solution name="sol2" extend="$sol"><p name="p2">More solution</p></solution>
  `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);

        const sol = await resolvePathToNodeIdx("sol");
        const sol2 = await resolvePathToNodeIdx("sol2");

        expect(stateVariables[sol].activeChildren.length).eq(0);
        expect(stateVariables[sol2].activeChildren.length).eq(0);
        expect(stateVariables[await resolvePathToNodeIdx("sol.p1")]).be
            .undefined;
        expect(stateVariables[await resolvePathToNodeIdx("sol2.p1")]).be
            .undefined;
        expect(stateVariables[await resolvePathToNodeIdx("sol2.p2")]).be
            .undefined;

        await revealSolution({
            componentIdx: sol2,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[sol].activeChildren.length).eq(1);
        expect(stateVariables[sol2].activeChildren.length).eq(2);

        expect(
            stateVariables[await resolvePathToNodeIdx("sol.p1")].stateValues
                .text,
        ).eq("This is the text of the solution.");

        expect(
            stateVariables[await resolvePathToNodeIdx("sol2.p1")].stateValues
                .text,
        ).eq("This is the text of the solution.");

        expect(
            stateVariables[await resolvePathToNodeIdx("sol2.p2")].stateValues
                .text,
        ).eq("More solution");

        expect(stateVariables[sol].activeChildren.length).eq(1);
        expect(stateVariables[sol2].activeChildren.length).eq(2);
    });
});
