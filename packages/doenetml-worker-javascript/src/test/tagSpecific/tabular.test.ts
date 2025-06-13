import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Tabular tag tests", async () => {
    it("inHeader attribute", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular>
  <row header>
    <cell>A</cell>
    <cell>B</cell>
  </row>
  <row>
    <cell>🟣</cell>
    <cell>🔴</cell>
  </row>
</tabular>

<p name="p1">Top: <c>inHeader</c> = $_cell1.inHeader</p>
<p name="p2">Bottom: <c>inHeader</c> = $_cell3.inHeader</p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Top: inHeader = true");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Bottom: inHeader = false");
    });
});
