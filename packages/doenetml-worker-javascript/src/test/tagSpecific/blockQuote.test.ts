import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("BlockQuote tag tests @group3", async () => {
    // Regression test: `<blockQuote>` previously omitted
    // `includeBlankStringChildren`, so a whitespace-only string between two
    // child components was stripped and adjacent texts ran together when
    // rendered (e.g. `hello there` → `hellothere`).
    it("preserves blank string children between inline children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <blockQuote name="bq"><text>hello</text> <text>there</text></blockQuote>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let activeChildren =
            stateVariables[await resolvePathToNodeIdx("bq")].activeChildren;

        expect(activeChildren.length).eq(3);
        expect(activeChildren[1]).eq(" ");
    });
});
