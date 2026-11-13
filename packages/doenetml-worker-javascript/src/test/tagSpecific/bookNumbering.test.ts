import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The state values of the named components, after loading `doenetML` with
 * the given host flags.
 */
async function load(
    doenetML: string,
    names: string[],
    flags: Record<string, unknown> = {},
) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        flags,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const values: Record<string, any> = {};
    for (const name of names) {
        values[name] =
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
    }
    return values;
}

const figure = (name: string) =>
    `<figure name="${name}"><image source="https://example.org/${name}.png"><shortDescription>${name}</shortDescription></image><caption>${name}</caption></figure>`;

// A page of a book: a section with two subsections, each holding blocks,
// figures and an equation.
const page = (documentAttributes = "") => `
<document ${documentAttributes}>
<section name="page"><title>A page</title>
  <subsection name="subA"><title>Sub A</title>
    <example name="ex1"><title>First</title><p>a</p></example>
    ${figure("fig1")}
    <p><men name="eq1">x=1</men></p>
    <example name="ex2"><p>untitled</p></example>
  </subsection>
  <subsection name="subB"><title>Sub B</title>
    <definition name="def3"><p>a definition</p></definition>
    <table name="tab4"><title>A table</title><tabular><row><cell>1</cell></row></tabular></table>
    <p><men name="eq2">y=2</men> <ref name="refEq" to="$eq2" /> <ref name="refEx" to="$ex2" /></p>
    <exercises name="list">
      <exercise name="listEx1"><p>one</p></exercise>
      <exercise name="listEx2"><p>two</p></exercise>
    </exercises>
    <note name="note5"><p>a note</p></note>
  </subsection>
</section>
</document>`;

const names = [
    "subA",
    "subB",
    "ex1",
    "ex2",
    "def3",
    "note5",
    "fig1",
    "tab4",
    "eq1",
    "eq2",
    "refEq",
    "refEx",
    "list",
    "listEx1",
    "listEx2",
];

describe("Book numbering @group3", async () => {
    it("by default, blocks are numbered among the divisions beside them", async () => {
        const v = await load(page(), names);
        // each subsection starts again
        expect(v.ex1.sectionNumber).eq("1");
        expect(v.ex2.sectionNumber).eq("2");
        expect(v.def3.sectionNumber).eq("1");
        // figures, tables and equations count through the document
        expect(v.fig1.figureName).eq("Figure 1");
        expect(v.tab4.tableName).eq("Table 2");
        expect(v.eq1.equationTag).eq("1");
        expect(v.eq2.equationTag).eq("2");
    });

    it("blockNumbering='document' numbers blocks through the document, with figures and tables", async () => {
        const v = await load(page('blockNumbering="document"'), names);
        expect(v.ex1.sectionNumber).eq("1");
        expect(v.fig1.figureName).eq("Figure 2");
        expect(v.ex2.sectionNumber).eq("3");
        expect(v.ex2.title).eq("Example 3");
        expect(v.def3.sectionNumber).eq("4");
        expect(v.tab4.tableName).eq("Table 5");
        // the exercises list is a division; its items are numbered in the list
        expect(v.listEx1.sectionNumber).eq("1");
        expect(v.listEx2.sectionNumber).eq("2");
        expect(v.note5.sectionNumber).eq("6");
        // equations keep their own count
        expect(v.eq1.equationTag).eq("1");
        expect(v.eq2.equationTag).eq("2");
        // sections are still numbered among themselves (subsections include
        // their section's number), with no gaps left by the blocks beside them
        expect(v.subA.sectionNumber).eq("1.1");
        expect(v.subB.sectionNumber).eq("1.2");
        expect(v.list.sectionNumber).eq("1");
    });

    it("numberingPrefix prefixes figures, tables and equations", async () => {
        const v = await load(page(), names, { numberingPrefix: "3.2" });
        expect(v.fig1.figureName).eq("Figure 3.2.1");
        expect(v.fig1.figureEnumeration).eq("3.2.1");
        expect(v.tab4.tableName).eq("Table 3.2.2");
        expect(v.eq1.equationTag).eq("3.2.1");
        expect(v.eq2.equationTag).eq("3.2.2");
        expect(v.refEq.linkText).eq("(3.2.2)");
        // blocks numbered among divisions are not prefixed
        expect(v.ex2.sectionNumber).eq("2");
    });

    it("with both, blocks read like a book's", async () => {
        const v = await load(page('blockNumbering="document"'), names, {
            numberingPrefix: "3.2",
        });
        expect(v.ex1.sectionNumber).eq("3.2.1");
        expect(v.fig1.figureName).eq("Figure 3.2.2");
        expect(v.ex2.title).eq("Example 3.2.3");
        expect(v.refEx.linkText).eq("Example 3.2.3");
        expect(v.def3.sectionNumber).eq("3.2.4");
        expect(v.tab4.tableName).eq("Table 3.2.5");
        expect(v.note5.sectionNumber).eq("3.2.6");
        expect(v.eq2.equationTag).eq("3.2.2");
        // list items and sections keep their plain numbers
        expect(v.listEx2.sectionNumber).eq("2");
        expect(v.subB.sectionNumber).eq("1.2");
    });

    it("a blank prefix is no prefix", async () => {
        for (const numberingPrefix of ["", "   ", null]) {
            const v = await load(page(), ["fig1", "eq1"], { numberingPrefix });
            expect(v.fig1.figureName).eq("Figure 1");
            expect(v.eq1.equationTag).eq("1");
        }
    });

    it("numbered rows of md and mdn take the prefix", async () => {
        const v = await load(
            `<p><mdn name="md1"><mrow name="row1">a=1</mrow><mrow name="row2">b=2</mrow></mdn></p>
             <p><md><mrow name="row3" number>c=3</mrow></md></p>`,
            ["row1", "row2", "row3"],
            { numberingPrefix: "4" },
        );
        expect(v.row1.equationTag).eq("4.1");
        expect(v.row2.equationTag).eq("4.2");
        expect(v.row3.equationTag).eq("4.3");
    });

    it("a hidden block still takes its place in the count", async () => {
        const v = await load(
            `<document blockNumbering="document">
              <example name="ex1" hide><p>hidden</p></example>
              ${figure("fig2")}
            </document>`,
            ["fig2"],
        );
        expect(v.fig2.figureName).eq("Figure 2");
    });
});
