import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { setListFormsEnabled } from "../../utils/dast/listForms";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * `<sort>` and `<shuffle>` take one type, decided at load (COLL-4, D41
 * decision 4): a list or a collection among the children is flattened into
 * its items; a wrapper (a `<group>`, an iteration, a pick) is not, and with
 * one component it stands for that component. Items of more than one type
 * are an error at load, and so is a `<sort>` of an item holding several
 * components. A `<shuffle>` moves a wrapper of several as one item. A blank
 * (a reference that names nothing) is kept by a `<sort>` and placed last
 * (#2525 item 3, VAL-5).
 *
 * Each document is loaded with `<sort>` and `<shuffle>` built as lists where
 * they can be, and as composites, and what an author sees must be the same
 * (COMP-4).
 */
describe("sort and shuffle take one type @group4", () => {
    afterEach(() => {
        setListFormsEnabled(true);
    });

    async function load(
        doenetML: string,
        asLists: boolean,
        requestedVariantIndex = 1,
    ) {
        setListFormsEnabled(asLists);
        try {
            return await createTestCore({ doenetML, requestedVariantIndex });
        } finally {
            setListFormsEnabled(true);
        }
    }

    /**
     * The text of each `<p>` named in `names`, and the code and message of
     * each error, the same in both builds.
     */
    async function bothBuilds({
        doenetML,
        names,
        requestedVariantIndex = 1,
    }: {
        doenetML: string;
        names: string[];
        requestedVariantIndex?: number;
    }) {
        const results: {
            texts: Record<string, string>;
            errors: string[];
            warnings: string[];
        }[] = [];
        for (const asLists of [true, false]) {
            const { core, resolvePathToNodeIdx } = await load(
                doenetML,
                asLists,
                requestedVariantIndex,
            );
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const texts: Record<string, string> = {};
            for (const name of names) {
                texts[name] =
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.text;
            }
            const diagnostics = getDiagnosticsByType(core);
            results.push({
                texts,
                errors: diagnostics.errors.map(
                    (e) => `${e.code}: ${e.message}`,
                ),
                warnings: diagnostics.warnings.map((w) => w.code!),
            });
        }
        expect(results[1], "composite build").eqls(results[0]);
        return results[0];
    }

    it("items of more than one type are an error at load", async () => {
        const cases: { doenetML: string; error: string }[] = [
            {
                doenetML: `<sort name="s"><number>3</number><text>a</text></sort>`,
                error: "doenet-e0076: `<sort>` takes items of one type, but it has a `<number>` and a `<text>`. Give each type a `<sort>` of its own.",
            },
            {
                doenetML: `<shuffle name="s"><number>3</number><text>a</text></shuffle>`,
                error: "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<number>` and a `<text>`. Give each type a `<shuffle>` of its own.",
            },
            {
                // two lists of different types
                doenetML: `<numberList name="n">1 2</numberList><textList name="t">a b</textList><sort name="s">$n $t</sort>`,
                error: "doenet-e0076: `<sort>` takes items of one type, but it has a `<number>` and a `<text>`. Give each type a `<sort>` of its own.",
            },
            {
                doenetML: `<sort name="s"><point>(1,2)</point><vector>(0,1)</vector></sort>`,
                error: "doenet-e0076: `<sort>` takes items of one type, but it has a `<point>` and a `<vector>`. Give each type a `<sort>` of its own.",
            },
            {
                // a math and a group of several
                doenetML: `<shuffle name="s"><math>1</math><group><math>2</math><math>3</math></group></shuffle>`,
                error: "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<math>` and a `<group>` of 2 components. Give each type a `<shuffle>` of its own.",
            },
            {
                // a reference whose type the DoenetML gives
                doenetML: `<text name="t">a</text><sort name="s">$t 3 1</sort>`,
                error: "doenet-e0076: `<sort>` takes items of one type, but it has a `<text>` and `3` (read as a `<number>`). Give each type a `<sort>` of its own, or write `type` to say how to read the text.",
            },
        ];
        for (const { doenetML, error } of cases) {
            const result = await bothBuilds({
                doenetML: `<p name="p1">${doenetML}</p><p name="p2">$s</p>`,
                names: ["p1", "p2"],
            });
            // the error in place of the items, reported once; a reference to
            // it is a blank
            expect(result.errors, doenetML).eqls([error]);
            expect(result.texts.p2, doenetML).eq("＿");
        }
    });

    it("content is one type", async () => {
        // A `<shuffle>` of paragraphs and feedback is not a mix (D46)
        const result = await bothBuilds({
            doenetML: `<div name="d"><shuffle>
              <p name="a">A</p>
              <feedback condition="true"><p>shown</p></feedback>
            </shuffle></div>
            <p name="p">$a</p>`,
            names: ["p"],
        });
        expect(result.errors).eqls([]);
    });

    it("text read as a type is named as written", async () => {
        const result = await bothBuilds({
            doenetML: `<math name="m">x</math><p name="p1"><sort>$m z</sort></p>
            <p name="p2"><sort type="math">$m z</sort></p>`,
            names: ["p1", "p2"],
        });
        expect(result.errors).eqls([
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<math>` and `z` (read as a `<text>`). Give each type a `<sort>` of its own, or write `type` to say how to read the text.",
        ]);
        expect(result.texts.p2).eq("x, z");
    });

    it("text beside components with no value to compare is read as text", async () => {
        // It was left out, with `doenet-w0015`. No `type` reads text as a
        // `<p>`, so the error doesn't suggest one; nor beside a point.
        const result = await bothBuilds({
            doenetML: `<div><shuffle><p>a</p> b</shuffle></div>
            <point name="P">(1,2)</point><p name="p1"><sort>$P 3</sort></p>`,
            names: ["p1"],
        });
        expect(result.errors).eqls([
            "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<p>` and `b` (read as a `<text>`). Give each type a `<shuffle>` of its own.",
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<point>` and `3` (read as a `<number>`). Give each type a `<sort>` of its own.",
        ]);
        expect(result.warnings).eqls([]);
    });

    it("text beside components is read as their type only when it reads as that type", async () => {
        // `3` beside a `<vector>` was `(3, 0)` built as a list and `3` as a
        // composite, and beside a `<boolean>` it was `true`. Text with
        // coordinates reads as a point or vector, and `true` and `false` as
        // a boolean; other text is read as what it looks like.
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort><vector>(1,2)</vector> 3</sort></p>
            <p name="p2"><sort><boolean>true</boolean> 3</sort></p>
            <p name="p3"><shuffle><point>(1,2)</point> x</shuffle></p>
            <p name="p4"><sort><point>(5,2)</point> (3,4) (1,1)+(1,0)</sort></p>
            <p name="p5"><sort><boolean>true</boolean> false FALSE</sort></p>`,
            names: ["p1", "p2", "p3", "p4", "p5"],
        });
        expect(result.errors).eqls([
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<vector>` and `3` (read as a `<number>`). Give each type a `<sort>` of its own.",
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<boolean>` and `3` (read as a `<number>`). Give each type a `<sort>` of its own.",
            "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<point>` and `x` (read as a `<text>`). Give each type a `<shuffle>` of its own.",
        ]);
        expect(result.texts).eqls({
            p1: "",
            p2: "",
            p3: "",
            p4: "(2, 1), (3, 4), (5, 2)",
            p5: "false, false, true",
        });
        expect(result.warnings).eqls([]);
    });

    it("a mix is an error at load in content not shown", async () => {
        // decided from the DoenetML, so the same whatever is shown (DIAG-7)
        const result = await bothBuilds({
            doenetML: `<booleanInput name="b"/>
            <conditionalContent condition="$b">
              <p><sort><number>3</number><text>a</text></sort></p>
            </conditionalContent>
            <p name="p">shown</p>`,
            names: ["p"],
        });
        expect(result.errors.map((e) => e.split(":")[0])).eqls([
            "doenet-e0076",
        ]);
    });

    it("numbers and maths are one type; lists and collections are flattened", async () => {
        const result = await bothBuilds({
            doenetML: `<numberList name="a">7 2 9</numberList>
            <mathList name="b">4 1/2</mathList>
            <p name="p1"><sort>$a $b <number>5</number><math>pi</math></sort></p>
            <p name="p2"><sort><sort>3 1</sort><sequence from="5" to="6"/> 4</sort></p>
            <p name="p3"><sort>$a <collect componentType="number" from="$a"/></sort></p>`,
            names: ["p1", "p2", "p3"],
        });
        expect(result.texts).eqls({
            p1: "1/2, 2, π, 4, 5, 7, 9",
            p2: "1, 3, 4, 5, 6",
            p3: "2, 2, 7, 7, 9, 9",
        });
        expect(result.errors).eqls([]);
    });

    it("what the error of a sort of items holding several says to write sorts them", async () => {
        const result = await bothBuilds({
            doenetML: `<repeat name="r" for="3 1 2" valueName="v"><number name="n">$v</number><text>a$v</text></repeat>
            <group name="g"><number>5</number><number>4</number></group>
            <p name="p1"><sort>$r.n</sort></p>
            <p name="p2"><sort><collect componentType="number" from="$r"/></sort></p>
            <p name="p3"><sort><collect componentType="number" from="$g"/></sort></p>
            <group name="h"><math>y</math><math>x</math></group>
            <p name="p4"><sort><collect componentType="math" from="$h"/></sort></p>
            <p name="p5"><sortIndices>$r.n</sortIndices></p>
            <p name="p6"><sortIndices><collect componentType="number" from="$r"/></sortIndices></p>
            <group name="k"><integer>2</integer><number>1.5</number><group><number>3</number><integer>0</integer></group></group>
            <p name="p7"><sort><collect componentType="number" from="$k"/></sort></p>`,
            names: ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
        });
        expect(result.texts).eqls({
            p1: "1, 2, 3",
            p2: "1, 2, 3",
            p3: "4, 5",
            p4: "x, y",
            p5: "2, 3, 1",
            p6: "2, 3, 1",
            p7: "0, 1.5, 2, 3",
        });
        expect(result.errors).eqls([]);
        expect(result.warnings).eqls([]);
    });

    it("a sort of items holding several components is an error at load", async () => {
        const cases: { doenetML: string; error: string }[] = [
            {
                doenetML: `<sort name="s"><group><math>3</math><math>4</math></group><math>1</math></sort>`,
                error: 'doenet-e0077: `<sort>` can\'t compare a `<group>` of 2 components. To sort its components, sort a `<collect>` of them (`<collect componentType="math" from="$g"/>` of a group `g`), or write them in the `<sort>` without the group. Use `<shuffle>` to keep each item\'s components together.',
            },
            {
                doenetML: `<sort name="s"><group><math>3</math><math>4</math></group><group><math>1</math><math>2</math></group></sort>`,
                error: 'doenet-e0077: `<sort>` can\'t compare a `<group>` of 2 components. To sort its components, sort a `<collect>` of them (`<collect componentType="math" from="$g"/>` of a group `g`), or write them in the `<sort>` without the group. Use `<shuffle>` to keep each item\'s components together.',
            },
            {
                doenetML: `<sort name="s"><repeat for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat></sort>`,
                error: 'doenet-e0077: `<sort>` can\'t compare the items of a `<repeat>`, each of 2 components. To sort one component of each, name it (`<sort>$r.n</sort>` sorts the `n` of each item of `r`), or sort a `<collect>` of the components (`<collect componentType="math" from="$r"/>`). Use `<shuffle>` to keep each item\'s components together.',
            },
            {
                // through a reference to the group
                doenetML: `<group name="g"><math>3</math><math>4</math></group><sort name="s">$g</sort>`,
                error: 'doenet-e0077: `<sort>` can\'t compare a `<group>` of 2 components. To sort its components, sort a `<collect>` of them (`<collect componentType="math" from="$g"/>` of a group `g`), or write them in the `<sort>` without the group. Use `<shuffle>` to keep each item\'s components together.',
            },
            {
                // a `<collect>` of integers would leave out the number
                doenetML: `<sort name="s"><group><integer>2</integer><number>1.5</number></group><number>0</number></sort>`,
                error: 'doenet-e0077: `<sort>` can\'t compare a `<group>` of 2 components. To sort its components, sort a `<collect>` of them (`<collect componentType="number" from="$g"/>` of a group `g`), or write them in the `<sort>` without the group. Use `<shuffle>` to keep each item\'s components together.',
            },
            {
                // a `<collect>` collects the components of a group inside
                doenetML: `<sort name="s"><group><group><number>2</number><number>1</number></group><integer>5</integer></group></sort>`,
                error: 'doenet-e0077: `<sort>` can\'t compare a `<group>` of 2 components. To sort its components, sort a `<collect>` of them (`<collect componentType="number" from="$g"/>` of a group `g`), or write them in the `<sort>` without the group. Use `<shuffle>` to keep each item\'s components together.',
            },
        ];
        for (const { doenetML, error } of cases) {
            const result = await bothBuilds({
                doenetML: `<p name="p1">${doenetML}</p><p name="p2">$s</p>`,
                names: ["p2"],
            });
            expect(result.errors, doenetML).eqls([error]);
            expect(result.texts.p2, doenetML).eq("＿");
        }
    });

    it("a wrapper of one component is sorted or shuffled as that component", async () => {
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort><group><math>3</math></group><math>1</math><group><math>2</math></group></sort></p>
            <p name="p2"><shuffle name="sh"><group><math>3</math></group><math>1</math><group><math>2</math></group></shuffle></p>
            <p name="p3">$sh.numItems</p>
            <p name="p4"><sort><repeat for="3 1 2" valueName="v"><math>$v</math></repeat></sort></p>`,
            names: ["p1", "p2", "p3", "p4"],
        });
        expect(result.texts.p1).eq("1, 2, 3");
        expect(result.texts.p2.split(", ").sort()).eqls(["1", "2", "3"]);
        expect(result.texts.p3).eq("3");
        expect(result.texts.p4).eq("1, 2, 3");
        expect(result.errors).eqls([]);
    });

    it("a shuffle of groups keeps each group together, in several variants", async () => {
        // It used to shuffle the six maths (`4, 1, 5, 6, 2, 3`).
        const doenetML = `
        <p name="p1"><shuffle name="sh">
          <group><math>1</math> <math>2</math></group>
          <group><math>3</math> <math>4</math></group>
          <group><math>5</math> <math>6</math></group>
        </shuffle></p>
        <p name="p2">$sh.numItems</p>
        <p name="p3">$sh[1]</p>
        <p name="p4"><shuffle><repeat for="1 2 3" valueName="v"><math>$v</math> <math>10$v</math></repeat></shuffle></p>
        <group name="g1"><text>a</text> <text>b</text></group>
        <group name="g2"><text>c</text> <text>d</text></group>
        <p name="p5"><shuffle name="sh2">$g1 $g2</shuffle></p>
        <p name="p6">$sh2[1]</p>
        `;
        const orders = new Set<string>();
        for (let variant = 1; variant <= 6; variant++) {
            const result = await bothBuilds({
                doenetML,
                names: ["p1", "p2", "p3", "p4", "p5", "p6"],
                requestedVariantIndex: variant,
            });
            // Commas between the items, and each group's components as they
            // are written in it, as the items of a repeat are shown.
            const items = result.texts.p1.split(", ");
            expect(items.sort()).eqls(["1 2", "3 4", "5 6"]);
            expect(result.texts.p2).eq("3");
            expect(result.texts.p1.startsWith(result.texts.p3)).eq(true);
            expect(result.texts.p4.split(", ").sort()).eqls([
                "1 10 * 1",
                "2 10 * 2",
                "3 10 * 3",
            ]);
            expect(result.texts.p5.split(", ").sort()).eqls(["a b", "c d"]);
            expect(result.texts.p5.startsWith(result.texts.p6)).eq(true);
            expect(result.errors).eqls([]);
            orders.add(result.texts.p1);
        }
        expect(orders.size).greaterThan(1);
    });

    it("a sort keeps a blank and places it last", async () => {
        const result = await bothBuilds({
            doenetML: `<mathList name="l">1 2</mathList>
            <numberList name="a">2 $nothing 1</numberList>
            <textList name="t">b $nothing a</textList>
            <p name="p1"><sort>$nothing 3 1</sort></p>
            <p name="p2"><sort>$l[5] 3 1</sort></p>
            <p name="p3"><sort>$a</sort></p>
            <p name="p4"><sort>$t</sort></p>
            <p name="p5"><sort><number>$nothing</number> 3 1</sort></p>
            <p name="p6"><sort><text>b</text><text>$nothing</text><text>a</text></sort></p>
            <p name="p7"><sort><number>3</number><number>NaN</number><number>1</number></sort></p>
            <p name="p8"><sortIndices>$nothing 3 1</sortIndices></p>
            <p name="p9"><shuffle name="sh">$nothing 3 1</shuffle></p>`,
            names: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"],
        });
        expect(result.texts).eqls({
            p1: "1, 3, ＿",
            p2: "1, 3, ＿",
            p3: "1, 2, ＿",
            p4: "a, b, ＿",
            p5: "1, 3, ＿",
            p6: "a, b, ＿",
            p7: "1, 3, NaN",
            p8: "3, 2, 1",
            p9: result.texts.p9,
        });
        expect(result.texts.p9.split(", ").sort()).eqls(["1", "3", "＿"]);
        expect(result.errors).eqls([]);
    });

    it("a blank that comes and goes is placed last", async () => {
        for (const asLists of [true, false]) {
            const { core, resolvePathToNodeIdx } = await load(
                `<mathList name="l">5 2</mathList>
                <mathInput name="i" prefill="3"/>
                <p name="p"><sort>$l[$i] 3 1</sort></p>`,
                asLists,
            );
            async function text() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[await resolvePathToNodeIdx("p")]
                    .stateValues.text;
            }
            expect(await text()).eq("1, 3, ＿");
            await updateMathInputValue({
                latex: "1",
                componentIdx: await resolvePathToNodeIdx("i"),
                core,
            });
            expect(await text()).eq("1, 3, 5");
            await updateMathInputValue({
                latex: "4",
                componentIdx: await resolvePathToNodeIdx("i"),
                core,
            });
            expect(await text()).eq("1, 3, ＿");
        }
    });

    it("text beside components is read as their type", async () => {
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort><math>d</math> a <math>b</math></sort></p>
            <p name="p2"><sort><text>x</text> 3 1</sort></p>
            <p name="p3"><sort><number>5</number> 3 <math>pi</math> 1</sort></p>`,
            names: ["p1", "p2", "p3"],
        });
        expect(result.texts).eqls({
            p1: "a, b, d",
            p2: "1, 3, x",
            p3: "1, 3, π, 5",
        });
        expect(result.errors).eqls([]);
        expect(result.warnings).eqls([]);
    });

    it("a sortIndices takes items of one type, as a sort does", async () => {
        // It sorts as `<sort>` does, so it takes the same one type, and an
        // item holding several components is an error, where it used to
        // flatten them (`2, 3, 1` of a group of 3 and 1 beside 2). It is
        // not a composite, so it becomes the error itself, and a reference
        // to it is a blank that reports nothing more.
        const result = await bothBuilds({
            doenetML: `<repeat name="r" for="3 1" valueName="v"><number name="n">$v</number><text>a$v</text></repeat>
            <p name="p1"><sortIndices name="si"><point>(5,2)</point> 3</sortIndices></p>
            <p name="p2"><sortIndices><number>3</number><text>a</text></sortIndices></p>
            <p name="p3"><sortIndices sortByProp="x"><point>(5,2)</point><vector>(1,1)</vector></sortIndices></p>
            <p name="p4"><sortIndices><group><number>3</number><number>1</number></group><number>2</number></sortIndices></p>
            <p name="p5"><sortIndices>$r</sortIndices></p>
            <p name="p6">$si</p>
            <p name="p7"><sortIndices><group><number>3</number></group><number>1</number></sortIndices></p>
            <p name="p8"><sortIndices><vector>(1,2)</vector> (0,1)</sortIndices></p>
            <p name="p9"><sortIndices><number>3</number> 1 $nothing 2</sortIndices></p>`,
            names: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"],
        });
        expect(result.errors).eqls([
            "doenet-e0076: `<sortIndices>` takes items of one type, but it has a `<point>` and `3` (read as a `<number>`). Give each type a `<sortIndices>` of its own.",
            "doenet-e0076: `<sortIndices>` takes items of one type, but it has a `<number>` and a `<text>`. Give each type a `<sortIndices>` of its own.",
            "doenet-e0076: `<sortIndices>` takes items of one type, but it has a `<point>` and a `<vector>`. Give each type a `<sortIndices>` of its own.",
            'doenet-e0077: `<sortIndices>` can\'t compare a `<group>` of 2 components. To sort its components, sort a `<collect>` of them (`<collect componentType="number" from="$g"/>` of a group `g`), or write them in the `<sortIndices>` without the group.',
            'doenet-e0077: `<sortIndices>` can\'t compare the items of a `<repeat>`, each of 2 components. To sort one component of each, name it (`<sortIndices>$r.n</sortIndices>` sorts the `n` of each item of `r`), or sort a `<collect>` of the components (`<collect componentType="number" from="$r"/>`).',
        ]);
        expect(result.texts).eqls({
            p1: "",
            p2: "",
            p3: "",
            p4: "",
            p5: "",
            p6: "＿",
            p7: "2, 1",
            p8: "2, 1",
            p9: "2, 4, 1, 3",
        });
        expect(result.warnings).eqls(["doenet-w0104"]);
    });

    it("an index into a sort or shuffle in error reports nothing more", async () => {
        // The error is shown in place of the items, and reported once, at
        // the sort (DIAG-5): not again as an index past its one `_error`.
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort name="s"><number>3</number><text>a</text></sort></p>
            <p name="p2"><shuffle name="sh"><number>3</number><text>a</text></shuffle></p>
            <p name="p3">$s[1] $s[3] $sh[1] $sh[3]</p>`,
            names: ["p3"],
        });
        expect(result.errors.map((e) => e.split(":")[0])).eqls([
            "doenet-e0076",
            "doenet-e0076",
        ]);
        expect(result.texts.p3).eq("＿ ＿ ＿ ＿");
        expect(result.warnings).eqls([]);
    });

    it("the numItems of a sort, shuffle or sortIndices in error is a blank that reports nothing more", async () => {
        // It shows the error in place of its items: what it would sort is
        // not its items (DIAG-5), however the property is written or read.
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort name="s"><number>3</number><text>a</text></sort></p>
            <p name="p2"><shuffle name="sh"><group><number>3</number><number>1</number></group><text>a</text></shuffle></p>
            <p name="p3"><sortIndices name="si"><number>3</number><text>a</text></sortIndices></p>
            <p name="p4"><sort name="s2"><group><number>3</number><number>1</number></group></sort></p>
            <p name="p5">$s.numItems $sh.numItems $si.numItems $s2.numItems $s.NumItems</p>
            <p name="p6"><integer extend="$s.numItems"/> <integer extend="$si.numItems"/></p>
            <p name="p7"><math>$sh.numItems</math> <math>$si.numItems</math></p>
            <p name="p8"><sort name="ok"><number>3</number><number>1</number></sort> $ok.numItems</p>`,
            names: ["p5", "p6", "p7", "p8"],
        });
        expect(result.errors.map((e) => e.split(":")[0])).eqls([
            "doenet-e0076",
            "doenet-e0076",
            "doenet-e0076",
            "doenet-e0077",
        ]);
        expect(result.texts).eqls({
            p5: "＿ ＿ ＿ ＿ ＿",
            p6: "＿ ＿",
            p7: "＿ ＿",
            p8: "1, 3 2",
        });
        expect(result.warnings).eqls([]);
    });

    it("values, objects and content are kinds of type (D46)", async () => {
        const cases: { doenetML: string; error: string }[] = [
            {
                // an object and content, one class before D46
                doenetML: `<div><shuffle name="s"><atom symbol="H"/><p>x</p></shuffle></div>`,
                error: "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<atom>` and a `<p>`. Give each type a `<shuffle>` of its own.",
            },
            {
                // two objects of different tags
                doenetML: `<graph><line name="l"/><circle name="c"/></graph><shuffle name="s">$l $c</shuffle>`,
                error: "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<line>` and a `<circle>`. Give each type a `<shuffle>` of its own.",
            },
            {
                // a `<matrix>` is an object, though built on `<math>`
                doenetML: `<sort name="s"><matrix>(1,2)</matrix><math>1</math></sort>`,
                error: "doenet-e0076: `<sort>` takes items of one type, but it has a `<matrix>` and a `<math>`. Give each type a `<sort>` of its own.",
            },
            {
                // so is an `<interval>`
                doenetML: `<sort name="s"><interval>(1,2)</interval><math>1</math></sort>`,
                error: "doenet-e0076: `<sort>` takes items of one type, but it has a `<interval>` and a `<math>`. Give each type a `<sort>` of its own.",
            },
            {
                // an input is the type of what it holds
                doenetML: `<sort name="s"><mathInput prefill="2"/><text>a</text></sort>`,
                error: "doenet-e0076: `<sort>` takes items of one type, but it has a `<mathInput>` and a `<text>`. Give each type a `<sort>` of its own.",
            },
        ];
        for (const { doenetML, error } of cases) {
            const result = await bothBuilds({
                doenetML: `${doenetML}<p name="p2">$s</p>`,
                names: ["p2"],
            });
            expect(result.errors, doenetML).eqls([error]);
            expect(result.texts.p2, doenetML).eq("＿");
        }
    });

    it("objects built on one tag are one type, and a wrapper of several is content", async () => {
        const result = await bothBuilds({
            doenetML: `<graph><shuffle name="sh1"><triangle/><rectangle/><polygon vertices="(0,0) (1,0) (0,1)"/></shuffle></graph>
            <div name="d"><shuffle name="sh2">
              <p>a</p>
              <group><p>b</p><p>c</p></group>
              <feedback condition="true"><p>d</p></feedback>
            </shuffle></div>
            <p name="p1">$sh1.numItems $sh2.numItems</p>
            <p name="p2"><shuffle><atom symbol="H"/><atom symbol="C"/></shuffle></p>`,
            names: ["p1", "p2"],
        });
        expect(result.errors).eqls([]);
        expect(result.texts.p1).eq("3 3");
        expect(result.texts.p2.split(", ").sort()).eqls(["C", "H"]);
    });

    it("a sort of objects or content needs sortByProp", async () => {
        // It showed nothing, with no diagnostic (#2569 item 10).
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort name="s1"><p>b</p><p>a</p></sort></p>
            <p name="p2"><sort><atom symbol="O"/><atom symbol="C"/></sort></p>
            <p name="p3"><sortIndices><span>b</span><span>a</span></sortIndices></p>
            <p name="p4"><sort><interval>(1,2)</interval><interval>(0,2)</interval></sort></p>
            <p name="p5"><sort sortByProp="atomicNumber"><atom symbol="O"/><atom symbol="C"/></sort></p>
            <p name="p6"><sort sortByProp="text"><m>b</m><m>a</m></sort></p>
            <p name="p7">$s1</p>
            <p name="p8"><sort sortByProp=""><atom symbol="O"/><atom symbol="C"/></sort></p>`,
            names: ["p2", "p3", "p4", "p5", "p6", "p7", "p8"],
        });
        expect(result.errors).eqls([
            'doenet-e0080: `<sort>` can\'t compare its items: `<p>` is content, with no value to sort by. Add `sortByProp` naming the property to compare, as `<sort sortByProp="text">` compares the text each one shows.',
            'doenet-e0080: `<sort>` can\'t compare its items: `<atom>` has no value to sort by. Add `sortByProp` naming the property to compare, as `<sort sortByProp="name">` does for a property `name`.',
            'doenet-e0080: `<sortIndices>` can\'t compare its items: `<span>` is content, with no value to sort by. Add `sortByProp` naming the property to compare, as `<sortIndices sortByProp="name">` does for a property `name`.',
            'doenet-e0080: `<sort>` can\'t compare its items: `<interval>` has no value to sort by. Add `sortByProp` naming the property to compare, as `<sort sortByProp="name">` does for a property `name`.',
            // a `sortByProp` written blank names no property
            'doenet-e0080: `<sort>` can\'t compare its items: `<atom>` has no value to sort by. Add `sortByProp` naming the property to compare, as `<sort sortByProp="name">` does for a property `name`.',
        ]);
        expect(result.texts).eqls({
            p2: "",
            p3: "",
            p4: "",
            p5: "C, O",
            p6: "a, b",
            p7: "＿",
            p8: "",
        });
    });

    it("points and vectors compare without sortByProp", async () => {
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort><point>(3,1)</point><point>(1,2)</point></sort></p>
            <p name="p2"><sort><vector>(3,1)</vector><vector>(1,2)</vector></sort></p>`,
            names: ["p1", "p2"],
        });
        expect(result.errors).eqls([]);
        expect(result.texts).eqls({
            p1: "(1, 2), (3, 1)",
            p2: "(1, 2), (3, 1)",
        });
    });

    it("an m beside a math, or a label beside a text, says to wrap it", async () => {
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort><m>x</m><math>1</math></sort></p>
            <p name="p2"><shuffle><p>a</p><me>x</me><math>1</math></shuffle></p>
            <p name="p3"><sort><label>Speed</label><text>a</text></sort></p>
            <p name="p4"><shuffle><p>a</p><math>1</math></shuffle></p>`,
            names: ["p1"],
        });
        expect(result.errors).eqls([
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<m>` and a `<math>`. Give each type a `<sort>` of its own. `<m>` shows LaTeX; it isn't a math. To sort or shuffle it with other maths, write `<math><m>…</m></math>` (or `<math>$mm</math>` for an `<m>` named `mm`), which reads its LaTeX as math.",
            "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<me>` and a `<math>`. Give each type a `<shuffle>` of its own. `<me>` shows LaTeX; it isn't a math. To sort or shuffle it with other maths, write `<math><me>…</me></math>` (or `<math>$mm</math>` for an `<me>` named `mm`), which reads its LaTeX as math.",
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<label>` and a `<text>`. Give each type a `<sort>` of its own. A `<label>` shows its content; it isn't a text. To sort or shuffle it with other texts, write `<text><label>…</label></text>` (or `<text>$l</text>` for a `<label>` named `l`), which reads it as text.",
            "doenet-e0076: `<shuffle>` takes items of one type, but it has a `<p>` and a `<math>`. Give each type a `<shuffle>` of its own.",
        ]);
    });

    it("the wraps the error suggests sort", async () => {
        const result = await bothBuilds({
            doenetML: `<m name="mm">x^2+1</m><label name="l">Speed <m>v</m></label>
            <p name="p1"><sort><math><m>\\frac{x^2}{2}</m></math><math>1</math></sort></p>
            <p name="p2"><sort><math>$mm</math><math>3</math></sort></p>
            <p name="p3"><sort><text>$l</text><text>Acceleration</text></sort></p>`,
            names: ["p1", "p2", "p3"],
        });
        expect(result.errors).eqls([]);
        expect(result.warnings).eqls([]);
        expect(result.texts).eqls({
            p1: "1, x²/2",
            p2: "3, x² + 1",
            p3: "Acceleration, Speed v",
        });
    });

    it("LaTeX that isn't math, read as math, is a blank with a warning", async () => {
        // It was a blank with no diagnostic, so the wrap the error suggests
        // failed silently. An `<m>` only shown reads nothing as math, so
        // reports nothing (the diagnostics are read before anything else
        // is computed). LaTeX from a value the reader changes is an info,
        // gone when the LaTeX reads as math (DIAG-2, B33).
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<m name="mm">\\text{hi}</m>
            <p name="p1"><math><m>\\text{hi}</m></math></p>
            <p name="p2"><math>$mm</math></p>
            <p name="p3"><m>\\text{shown}</m></p>
            <p name="p4"><math><m></m></math></p>
            <textInput name="t" prefill="\\text{a}"/>
            <p name="p5"><math><m>$t</m></math></p>`,
        });
        expect(getDiagnosticsByType(core).warnings.map((w) => w.code)).eqls([
            "doenet-w0196",
            "doenet-w0196",
        ]);
        expect(getDiagnosticsByType(core).infos.map((i) => i.code)).eqls([
            "doenet-w0196",
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["p1", "p2", "p4", "p5"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text,
                name,
            ).eq("＿");
        }
        await updateTextInputValue({
            text: "x^2",
            componentIdx: await resolvePathToNodeIdx("t"),
            core,
        });
        const after = await core.returnAllStateVariables(false, true);
        expect(after[await resolvePathToNodeIdx("p5")].stateValues.text).eq(
            "x²",
        );
        expect(getDiagnosticsByType(core).infos).eqls([]);
    });

    it("an input is sorted by what it holds", async () => {
        // It had no value to compare, so a sort of inputs showed nothing
        const result = await bothBuilds({
            doenetML: `<p name="p1"><sort><mathInput name="a" prefill="3"/><mathInput prefill="1"/></sort></p>
            <p name="p2"><sort><mathInput prefill="3"/><math>1</math> 2</sort></p>
            <p name="p3"><sort><textInput prefill="b"/><text>a</text> c</sort></p>
            <p name="p4"><sort><booleanInput prefill="true"/> false</sort></p>
            <div><sort name="s5"><slider from="1" to="5" initialValue="4"/><number>2</number></sort></div>
            <p name="p5">$s5[1].value $s5[2].value</p>`,
            names: ["p1", "p2", "p3", "p4", "p5"],
        });
        expect(result.errors).eqls([]);
        expect(result.texts).eqls({
            p1: "1, 3",
            p2: "1, 2, 3",
            p3: "a, b, c",
            p4: "false, true",
            // a slider's type is decided as it runs, and compared by it
            p5: "2 4",
        });
    });

    it("the other list operators read an input by what it holds", async () => {
        // They share the sort's comparison. An input among their children
        // was skipped, so `<argMin>` of a number and a smaller input named
        // the number, and a `<tally>` of choices counted nothing.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="p1"><indexOf target="2"><mathInput prefill="1"/><mathInput name="b" prefill="5"/></indexOf></p>
            <p name="p2"><argMin><number>3</number><mathInput prefill="1"/></argMin></p>
            <p name="p3"><searchSorted target="2.5"><mathInput prefill="1"/><mathInput prefill="2"/><mathInput prefill="3"/></searchSorted></p>
            <p name="p4"><tally categories="a b"><textInput prefill="b"/><choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput></tally></p>
            <p name="p5"><binCounts bins="0 2 4"><mathInput prefill="1"/><mathInput prefill="3"/><number>3</number></binCounts></p>`,
        });
        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result: Record<string, string> = {};
            for (const name of ["p1", "p2", "p3", "p4", "p5"]) {
                result[name] =
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.text;
            }
            return result;
        }
        expect(await texts()).eqls({
            p1: "0",
            p2: "2",
            p3: "3",
            // a choiceInput with nothing selected holds nothing
            p4: "0, 1",
            p5: "1, 2",
        });
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [1],
            core,
        });
        const after = await texts();
        expect(after.p1).eq("2");
        expect(after.p4).eq("1, 1");
    });
});
