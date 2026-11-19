import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Every property's type is decided from the DoenetML when the document
 * loads (TYPE, D45, #2568):
 *
 * - a property its component declares a type for has that type, so a tag
 *   made from it (`<point extend="$n.value"/>`), or from what holds it, is
 *   checked at load (TYPE-1, REF-5);
 * - the few whose type their component does not declare are typed from
 *   what is written: a `<choiceInput>`'s values, a `<slider>`'s, a
 *   `<tally>`'s categories, an `<animateFromSequence>`'s value;
 * - a `<slider>` and a `<choiceInput>` are values of those types in the
 *   one-type checks of `<sort>`, `<shuffle>` and a repeat's `for`;
 * - a mix of numbers and texts by tag is an error at load in a `<tally>`
 *   and in `<markers>` (D45 decision 6);
 * - `$g.grid` is not a property (D45 decision 4).
 *
 * Each error is reported when the document loads, also where the tag is in
 * a case not shown (DIAG-7).
 */
describe("Every property's type is decided at load (D45) @group4", () => {
    /** Load `doenetML`, with its errors and warnings as `code: message`. */
    async function load(doenetML: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const diagnostics = getDiagnosticsByType(core);
        return {
            core,
            resolvePathToNodeIdx,
            errors: diagnostics.errors.map((e) => `${e.code}: ${e.message}`),
            warnings: diagnostics.warnings.map(
                (w) => `${w.code}: ${w.message}`,
            ),
            infos: diagnostics.infos.map((i) => `${i.code}: ${i.message}`),
            /** The type and text of the component named `name`. */
            async shown(name: string) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const component =
                    stateVariables[await resolvePathToNodeIdx(name)];
                return {
                    type: component.componentType,
                    text: component.stateValues.text,
                };
            },
        };
    }

    const e0065 = (T: string, source: string, sourceType: string) =>
        `doenet-e0065: A \`<${T}>\` can't be made from \`${source}\`, which gives a \`<${sourceType}>\`. To show it as it is, write \`${source}\`.`;

    it("a property its component declares a type for is checked at load, also in a case not shown", async () => {
        const d = await load(`
<booleanInput name="b"/>
<number name="n">3</number>
<point name="P">(1,2)</point>
<conditionalContent>
  <case condition="$b"><point extend="$n.value"/></case>
</conditionalContent>
<group name="g">$P.x</group>
<p name="p1"><math extend="$g"/></p>
<p name="p2"><number extend="$P.x"/></p>
`);
        // decided before the case is shown
        expect(d.errors).eqls([e0065("point", "$n.value", "number")]);
        // `$P.x` is a math, as a point declares, held in a group or not
        expect((await d.shown("p1")).text).eq("1");
        expect((await d.shown("p2")).text).eq("1");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await d.resolvePathToNodeIdx("b"),
            core: d.core,
        });
        expect(getDiagnosticsByType(d.core).errors.length).eq(1);
    });

    it("a choiceInput's values are maths when every choice holds one math, else texts", async () => {
        const d = await load(`
<booleanInput name="b"/>
<choiceInput name="words"><choice>cat</choice><choice>dog</choice></choiceInput>
<choiceInput name="maths" preselectChoice="1"><choice><math>(1,2)</math></choice><choice><m>y</m></choice></choiceInput>
<conditionalContent>
  <case condition="$b">
    <point extend="$words"/>
    <point extend="$words.selectedValues[1]"/>
  </case>
</conditionalContent>
<p name="p1"><point extend="$maths"/></p>
`);
        expect(d.errors).eqls([
            e0065("point", "$words", "text"),
            e0065("point", "$words.selectedValues[1]", "text"),
        ]);
        expect(await d.shown("p1")).eqls({ type: "p", text: "(1, 2)" });
    });

    it("the choices a repeat makes are typed by its value, before there are any (#2594 item 8)", async () => {
        const d = await load(`
<textList name="tl"/>
<mathList name="ml"/>
<choiceInput name="texts"><repeat for="$tl" valueName="v"><choice>$v</choice></repeat></choiceInput>
<choiceInput name="maths"><repeat for="$ml" valueName="v"><choice>$v</choice></repeat></choiceInput>
<p name="p1"><point extend="$texts"/></p>
<p name="p2"><point extend="$maths"/></p>
`);
        // A text choice is possible, so the point is an error at load, not
        // once the repeat makes one (DIAG-7).
        expect(d.errors).eqls([e0065("point", "$texts", "text")]);
        // A math choice gives no value yet: missing, with an info.
        expect(d.infos).eqls([
            "doenet-i0061: `$maths` holds no value now, so this `<point>` is missing until it holds one.",
        ]);
    });

    it("a copy of a choiceInput is typed by the choices it copies and those written in it", async () => {
        const d = await load(`
<choiceInput name="ci"><choice><math>(1,2)</math></choice></choiceInput>
<choiceInput name="ci2" copy="$ci"><choice>dog</choice></choiceInput>
<p name="p1"><point extend="$ci"/></p>
<p name="p2"><point extend="$ci2"/></p>
`);
        expect(d.errors).eqls([e0065("point", "$ci2", "text")]);
    });

    it("a choiceInput is typed by the choices it holds, as it reads them", async () => {
        const d = await load(`
<choice name="c">dog</choice>
<choiceInput name="spaced" preselectChoice="1"><choice>
  <math>x</math>
</choice></choiceInput>
<choiceInput name="bare" preselectChoice="1"><choice><math>y</math></choice>$c</choiceInput>
<p name="p1">$spaced</p>
<p name="p2"><point extend="$bare"/></p>
`);
        // A math with space around it is not one math, so the choice is a
        // text, and its value shows (not a blank math).
        expect((await d.shown("p1")).text).eq("\n  x\n");
        // A bare `$c` is whether the choice was submitted, not a choice, so
        // it doesn't make the values texts.
        expect(d.errors).eqls([]);
        expect(d.warnings.map((w) => w.split(":")[0])).eqls(["doenet-w0107"]);
    });

    it("a slider's value is of its type, also before it is shown", async () => {
        const d = await load(`
<booleanInput name="b"/>
<slider name="s" type="text"><text>a</text><text>b</text></slider>
<slider name="n" from="1" to="5"/>
<conditionalContent>
  <case condition="$b"><point extend="$s"/><point extend="$s.value"/></case>
</conditionalContent>
<p name="p1"><point extend="$n.value"/></p>
<p name="p2"><math extend="$n"/></p>
<p name="p3"><textList extend="$s.items"/></p>
`);
        expect(d.errors).eqls([
            e0065("point", "$s", "text"),
            e0065("point", "$s.value", "text"),
            e0065("point", "$n.value", "number"),
        ]);
        expect((await d.shown("p2")).text).eq("1");
        expect((await d.shown("p3")).text).eq("a, b");
    });

    it("an animateFromSequence of letters has a text value", async () => {
        const d = await load(`
<animateFromSequence name="an" type="letters" from="a" to="e"/>
<p name="p1"><text extend="$an.value"/></p>
<p name="p2"><point extend="$an.value"/></p>
`);
        expect((await d.shown("p1")).text).eq("a");
        expect(d.errors).eqls([e0065("point", "$an.value", "text")]);
    });

    it("a tally's categories are numbers when every value is a number by its tag, else texts", async () => {
        const d = await load(`
<mathList name="ml"/>
<tally name="numbers"><number>2</number><number>1</number><number>2</number></tally>
<tally name="maths"><math>2</math><math>1</math></tally>
<tally name="pieces">007 008 007</tally>
<tally name="empty">$ml</tally>
<p name="p1">$numbers.categories</p>
<p name="p2">$maths.categories</p>
<p name="p3">$pieces.categories</p>
<p name="p4"><point extend="$numbers.categories[1]"/></p>
<p name="p5"><point extend="$maths.categories[1]"/></p>
<p name="p6"><point extend="$empty.categories[1]"/></p>
`);
        expect((await d.shown("p1")).text).eq("1, 2");
        // A math is counted by its value, but its category is a text, as
        // its tag decides (TYPE-1).
        expect((await d.shown("p2")).text).eq("1, 2");
        expect((await d.shown("p3")).text).eq("7, 8");
        expect(d.errors).eqls([
            e0065("point", "$numbers.categories[1]", "number"),
            e0065("point", "$maths.categories[1]", "text"),
            // the categories of a tally with no values yet (#2594 item 8)
            e0065("point", "$empty.categories[1]", "text"),
        ]);
    });

    it("a mix of numbers and texts is an error at load in a tally and in markers (D45 decision 6)", async () => {
        const d = await load(`
<p name="p1"><tally><number>1</number><text>a</text></tally></p>
<p name="p2"><tally>1 2 apple</tally></p>
<slider><markers><number>1</number><text>a</text></markers></slider>
`);
        expect(d.errors).eqls([
            "doenet-e0076: `<tally>` takes items of one type, but it has a `<number>` and a `<text>`. Give each type a `<tally>` of its own.",
            "doenet-e0076: `<markers>` takes items of one type, but it has a `<number>` and a `<text>`. Give each type a `<markers>` of its own.",
        ]);
        // Text written in a tally is cut into pieces and typed together: all
        // numbers or all texts, never a mix.
        expect((await d.shown("p2")).text).eq("1, 1, 1");
    });

    it("a slider and a choiceInput are values of their type in a sort, a shuffle and a repeat's for", async () => {
        const d = await load(`
<sort name="s1"><choiceInput preselectChoice="1"><choice>10</choice></choiceInput><number>9</number></sort>
<sort name="s2"><slider initialValue="3"/><number>2</number></sort>
<shuffle name="s3"><slider type="text"><text>x</text></slider><text>y</text></shuffle>
<choiceInput name="ci"><choice>x</choice></choiceInput>
<number name="n">1</number>
<repeat for="$ci $n" valueName="v"><p>$v</p></repeat>
`);
        expect(d.errors).eqls([
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<choiceInput>` and a `<number>`. Give each type a `<sort>` of its own.",
            "doenet-e0081: The `for` of a `<repeat>` holds items of one type, but it has a `<choiceInput>` and a `<number>`. Give each type a `<repeat>` of its own.",
        ]);
    });

    it("a graph's grid is not a property (D45 decision 4)", async () => {
        const d = await load(`
<graph name="g" grid="1 2"/>
<p name="p">$g.grid</p>
`);
        expect(d.warnings.map((w) => w.split(":")[0])).eqls(["doenet-w0104"]);
    });

    it("a select whose type its text can't be read as reports it, and reads the text as math (D45 decision 7)", async () => {
        const d = await load(`
<select name="s" type="banana">x+x</select>
<p name="p">$s</p>
`);
        expect(d.warnings).eqls([
            "doenet-w0145: Invalid type banana for select component. Must be one of math, text, number, or boolean. Ignoring it and reading the values as though no type had been given.",
        ]);
        expect((await d.shown("p")).text).eq("x + x");
    });
});
