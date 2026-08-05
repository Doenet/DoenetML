import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Tabular tag tests @group3", async () => {
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

    it("border and alignment attributes take their declared values and inherit", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t" halign="end" topBorder="minor" startBorder="major" bottomBorder="medium">
  <row name="r" valign="top" startBorder="minor">
    <cell name="c1" halign="center" endBorder="major" bottomBorder="minor">A</cell>
    <cell name="c2">B</cell>
  </row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.halign,
        ).eq("end");
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .topBorder,
        ).eq("minor");
        expect(
            stateVariables[await resolvePathToNodeIdx("r")].stateValues
                .startBorder,
        ).eq("minor");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.halign,
        ).eq("center");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues
                .endBorder,
        ).eq("major");

        // A cell with nothing of its own takes the alignment from the
        // `<tabular>` and the bottom border from the `<row>`'s ancestor chain.
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.halign,
        ).eq("end");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                .bottomBorder,
        ).eq("medium");
    });
});
