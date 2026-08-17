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

    it("border and alignment values are read case-insensitively on every component", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t" halign="End" topBorder="Minor">
  <row name="r" valign="Top" startBorder="Major">
    <cell name="c" halign="Center" endBorder="Medium">A</cell>
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
            stateVariables[await resolvePathToNodeIdx("r")].stateValues.valign,
        ).eq("top");
        expect(
            stateVariables[await resolvePathToNodeIdx("r")].stateValues
                .startBorder,
        ).eq("major");
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.halign,
        ).eq("center");
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .endBorder,
        ).eq("medium");
    });

    it("unrecognized values fall back to the default; macro-supplied values are read", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<text name="align">end</text>
<tabular>
  <row name="r1" valign="sideways" startBorder="dotted">
    <cell name="c1" halign="middle" endBorder="dashed">A</cell>
  </row>
  <row name="r2">
    <cell name="c2" halign="$align">B</cell>
  </row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("r1")].stateValues.valign,
        ).eq("middle");
        expect(
            stateVariables[await resolvePathToNodeIdx("r1")].stateValues
                .startBorder,
        ).eq("none");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.halign,
        ).eq("start");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues
                .endBorder,
        ).eq("none");

        // The value arrives from a macro rather than being written out, so the
        // parser's value migration never sees it and the state variable
        // definition is what reads it against the vocabulary.
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.halign,
        ).eq("end");
    });

    it("a cell that is not a number reports NaN, not null", async () => {
        // `<cell>.number` is public and typed `number`, which has one spelling
        // for "not a number". The engine briefly reported an expression it
        // cannot evaluate as `null`, which is `0` to every arithmetic consumer
        // and which `Number.isNaN` answers `false` for.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <table><tabular>
    <row><cell name="c1">q</cell><cell name="c2">7</cell></row>
  </tabular></table>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.number,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.number,
        ).eq(7);
    });
});
