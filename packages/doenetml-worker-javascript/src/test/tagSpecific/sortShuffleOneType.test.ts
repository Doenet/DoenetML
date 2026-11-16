import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { setListFormsEnabled } from "../../utils/dast/listForms";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

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

    it("components with no value to compare are one type", async () => {
        // A `<shuffle>` of paragraphs and feedback, or of rows, is not a mix
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

    it("a sort of items holding several components is an error at load", async () => {
        const cases: { doenetML: string; error: string }[] = [
            {
                doenetML: `<sort name="s"><group><math>3</math><math>4</math></group><math>1</math></sort>`,
                error: "doenet-e0077: `<sort>` can't compare a `<group>` of 2 components. Sort the components themselves, or use `<shuffle>` to keep each item's components together.",
            },
            {
                doenetML: `<sort name="s"><group><math>3</math><math>4</math></group><group><math>1</math><math>2</math></group></sort>`,
                error: "doenet-e0077: `<sort>` can't compare a `<group>` of 2 components. Sort the components themselves, or use `<shuffle>` to keep each item's components together.",
            },
            {
                doenetML: `<sort name="s"><repeat for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat></sort>`,
                error: "doenet-e0077: `<sort>` can't compare the items of a `<repeat>`, each of 2 components. Sort the components themselves, or use `<shuffle>` to keep each item's components together.",
            },
            {
                // through a reference to the group
                doenetML: `<group name="g"><math>3</math><math>4</math></group><sort name="s">$g</sort>`,
                error: "doenet-e0077: `<sort>` can't compare a `<group>` of 2 components. Sort the components themselves, or use `<shuffle>` to keep each item's components together.",
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
});
