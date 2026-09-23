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
        //
        // `c3` is the leg that measures this definition rather than the
        // engine: `sqrt(-4)` *has* a value, and it is a math.js `Complex`, so
        // the engine's own answer is not `NaN` and only `evaluateToNumber`
        // makes it so. Without it a `number`-typed public state variable holds
        // a `{re, im}` object.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <table><tabular>
    <row><cell name="c1">q</cell><cell name="c2">7</cell><cell name="c3">sqrt(-4)</cell></row>
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
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues.number,
        ).eqls(NaN);
    });
    it("<col> sets column widths, which reach the renderer as columnSpecs", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t">
  <col width="25%" />
  <col width="15%" />
  <row>
    <cell>State</cell>
    <cell>Votes</cell>
    <cell>Context</cell>
  </row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const tabular = stateVariables[await resolvePathToNodeIdx("t")];

        expect(tabular.stateValues.numColumns).eq(3);
        // Padded out to one entry per column, so the renderer's `<colgroup>`
        // lines up with the cells even though only two columns were declared.
        expect(tabular.stateValues.columnSpecs).eqls([
            {
                width: { size: 25, isAbsolute: false },
                halign: null,
                topBorder: null,
                endBorder: null,
            },
            {
                width: { size: 15, isAbsolute: false },
                halign: null,
                topBorder: null,
                endBorder: null,
            },
            {
                width: null,
                halign: null,
                topBorder: null,
                endBorder: null,
            },
        ]);
    });

    it("a tabular with no <col> children reports no columnSpecs", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t">
  <row><cell>A</cell><cell>B</cell></row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .columnSpecs,
        ).eqls([]);
    });

    it("a cell takes halign and endBorder from its <col>", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t">
  <col />
  <col halign="end" endBorder="minor" />
  <row>
    <cell name="c1">A</cell>
    <cell name="c2">1</cell>
  </row>
  <row>
    <cell name="c3">B</cell>
    <cell name="c4" halign="center" endBorder="none">2</cell>
  </row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.halign,
        ).eq("start");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.halign,
        ).eq("end");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                .endBorder,
        ).eq("minor");

        // The column applies down the whole column, not just the first row.
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues.halign,
        ).eq("start");

        // ... and a cell of its own outranks it, including back down to "none".
        expect(
            stateVariables[await resolvePathToNodeIdx("c4")].stateValues.halign,
        ).eq("center");
        expect(
            stateVariables[await resolvePathToNodeIdx("c4")].stateValues
                .endBorder,
        ).eq("none");
    });

    it("halign resolves in PreTeXt's cell, row, col, tabular order", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t" halign="justify">
  <col halign="center" />
  <row name="r1">
    <cell name="c1">A</cell>
  </row>
  <row name="r2" halign="end">
    <cell name="c2">B</cell>
    <cell name="c3" halign="start">C</cell>
  </row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        // The column beats the tabular...
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.halign,
        ).eq("center");
        // ... the row beats the column ...
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.halign,
        ).eq("end");
        // ... and the cell beats the row.
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues.halign,
        ).eq("start");
    });

    it("a preceding colSpan shifts which <col> a cell belongs to", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t">
  <col />
  <col />
  <col halign="end" />
  <row>
    <cell name="wide" colSpan="2">A</cell>
    <cell name="after">B</cell>
  </row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("wide")].stateValues
                .columnIndex,
        ).eq(0);
        // Not column 1 — the `colSpan="2"` before it covers columns 0 and 1.
        expect(
            stateVariables[await resolvePathToNodeIdx("after")].stateValues
                .columnIndex,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("after")].stateValues
                .halign,
        ).eq("end");
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .numColumns,
        ).eq(3);
    });

    it("a degenerate or runaway colSpan still moves the cell on by a sane amount", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t">
  <col halign="center" />
  <row>
    <cell name="zero" colSpan="0">A</cell>
    <cell name="negative" colSpan="-2">B</cell>
    <cell name="unparseable" colSpan="x">C</cell>
    <cell name="runaway" colSpan="2000000">D</cell>
    <cell name="last">E</cell>
  </row>
</tabular>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const columnIndexOf = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .columnIndex;

        // Zero, negative and unparseable spans each occupy one column rather
        // than collapsing the cells after them onto the same index.
        expect(await columnIndexOf("zero")).eq(0);
        expect(await columnIndexOf("negative")).eq(1);
        expect(await columnIndexOf("unparseable")).eq(2);
        expect(await columnIndexOf("runaway")).eq(3);
        // The runaway span is clamped to the 1000 HTML itself clamps a
        // `colspan` to, so `columnSpecs` stays a list the renderer can draw.
        expect(await columnIndexOf("last")).eq(1003);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .numColumns,
        ).eq(1004);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .columnSpecs.length,
        ).eq(1004);
    });
});
