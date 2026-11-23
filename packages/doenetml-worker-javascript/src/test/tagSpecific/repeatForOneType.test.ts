import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { setRepeatListsEnabled } from "../../utils/dast/repeatLists";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A repeat's `for` holds one type, decided at load (COLL-5, D44, #2567):
 *
 * - its items are read as a `<shuffle>`'s are (COLL-4): a list or a
 *   collection is flattened, a wrapper of one component stands for it, and
 *   a wrapper of several (a `<group>`, an iteration, a pick) is one item;
 * - items of more than one type are an error at load (`doenet-e0081`),
 *   shown in place of the iterations, with integer, number and math one
 *   type, and a value, an object's tag or content as the type (D46);
 * - `type` types the text written in `for`, and, when written, every item;
 * - `$v` has the type of the items, so a tag made from it is checked at
 *   load (REF-5);
 * - a name after `$v` when the items hold several components names what
 *   every item declares by it, with one tag (D44 decision 6, COMP-11).
 *
 * Each document is loaded with a repeat whose template is one value built
 * as a list and as a composite, and what an author sees must be the same
 * (COMP-4).
 */
describe("a repeat's for holds one type @group4", () => {
    afterEach(() => {
        setRepeatListsEnabled(true);
    });

    /**
     * The text of each `<p>` named in `names`, and each error and warning
     * as `code: message`, the same in both builds.
     */
    async function bothBuilds(doenetML: string, names: string[]) {
        const results: {
            texts: Record<string, string>;
            errors: string[];
            warnings: string[];
        }[] = [];
        for (const asLists of [true, false]) {
            setRepeatListsEnabled(asLists);
            let core, resolvePathToNodeIdx;
            try {
                ({ core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML,
                }));
            } finally {
                setRepeatListsEnabled(true);
            }
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
                warnings: diagnostics.warnings.map(
                    (w) => `${w.code}: ${w.message}`,
                ),
            });
        }
        expect(results[1], "composite build").eqls(results[0]);
        return results[0];
    }

    it("items of more than one type are an error at load, in place of the iterations", async () => {
        const cases: { setup: string; for: string; error: string }[] = [
            {
                setup: `<math name="a">x</math><text name="t">hi</text><point name="P">(1,2)</point>`,
                for: `for="$a $t $P"`,
                error: "doenet-e0081: The `for` of a `<repeat>` holds items of one type, but it has a `<math>` and a `<text>`. Give each type a `<repeat>` of its own.",
            },
            {
                // text written in `for` is a math unless `type` says
                setup: `<text name="t">hi</text>`,
                for: `for="2 $t"`,
                error: 'doenet-e0081: The `for` of a `<repeat>` holds items of one type, but it has `2` (read as a `<math>`) and a `<text>`. Give each type a `<repeat>` of its own, or write `type="text"` to read the text written in `for` as text.',
            },
            {
                // an input is what it holds
                setup: `<mathInput name="mi" prefill="7"/><textInput name="ti" prefill="a"/>`,
                for: `for="$mi $ti"`,
                error: "doenet-e0081: The `for` of a `<repeat>` holds items of one type, but it has a `<math>` and a `<text>`. Give each type a `<repeat>` of its own.",
            },
            {
                // a select is typed by every option
                setup: `<select name="s"><option><math>1</math></option><option><text>a</text></option></select>`,
                for: `for="$s"`,
                error: "doenet-e0081: The `for` of a `<repeat>` holds items of one type, but it has a `<math>` and a `<text>`. Give each type a `<repeat>` of its own.",
            },
            {
                // a group of several is content, not a math
                setup: `<group name="g"><point>(1,2)</point><number>3</number></group>`,
                for: `for="$g 3"`,
                error: "doenet-e0081: The `for` of a `<repeat>` holds items of one type, but it has a `<group>` of 2 components and `3` (read as a `<math>`). Give each type a `<repeat>` of its own.",
            },
            {
                // two kinds of graphical object
                setup: `<point name="A">(1,2)</point><line name="l" through="(0,0) (1,1)"/>`,
                for: `for="$A $l"`,
                error: "doenet-e0081: The `for` of a `<repeat>` holds items of one type, but it has a `<point>` and a `<line>`. Give each type a `<repeat>` of its own.",
            },
            {
                // `type`, when written, types every item
                setup: `<number name="n">3</number>`,
                for: `for="2 $n" type="text"`,
                error: 'doenet-e0081: This `<repeat>` says `type="text"`, so every item of its `for` is to be a text, but `for` has a `<number>`. Remove `type`, or give that item a `<repeat>` of its own.',
            },
            {
                // a reference alone, of another type than `type` says
                setup: `<number name="n">3</number>`,
                for: `for="$n" type="text"`,
                error: 'doenet-e0081: This `<repeat>` says `type="text"`, so every item of its `for` is to be a text, but `for` has a `<number>`. Remove `type`, or give that item a `<repeat>` of its own.',
            },
        ];
        for (const { setup, for: forAttr, error } of cases) {
            const result = await bothBuilds(
                `${setup}<p name="p1"><repeat name="r" ${forAttr} valueName="v">[$v]</repeat></p><p name="p2">$r.numItems</p>`,
                ["p1", "p2"],
            );
            // the error in place of the iterations, reported once; its
            // number of items is a blank, as a sort's in error is
            expect(result.errors, forAttr).eqls([error]);
            expect(result.texts.p1, forAttr).eq("");
            expect(result.texts.p2, forAttr).eq("＿");
        }
    });

    it("the error is reported once, at the `for`", async () => {
        const { core } = await createTestCore({
            doenetML: `<text name="t">hi</text>
<p><repeat valueName="v" for="2 $t">[$v]</repeat></p>`,
        });
        const { errors } = getDiagnosticsByType(core);
        expect(errors.map((e) => e.code)).eqls(["doenet-e0081"]);
        expect(errors[0].position?.start.line).eq(2);
        expect(errors[0].position?.start.column).eq(26);
    });

    it("one type: integer, number and math are one, and type can say how to read the text", async () => {
        const result = await bothBuilds(
            `<number name="n">3</number><integer name="k">2</integer><math name="m">x</math>
<text name="t">hi</text>
<point name="A">(1,2)</point><point name="B">(3,4)</point>
<p name="p1"><repeat for="$k $n 5 $m" valueName="v">$v</repeat></p>
<p name="p2"><repeat for="2 $t" type="text" valueName="v">[$v]</repeat></p>
<p name="p3"><repeat for="$A $B" valueName="v">$v.x</repeat></p>
<p name="p4"><repeat for="$t hello" type="text" valueName="v">[$v]</repeat></p>`,
            ["p1", "p2", "p3", "p4"],
        );
        expect(result.texts).eqls({
            p1: "2, 3, 5, x",
            p2: "[2], [hi]",
            p3: "1, 3",
            p4: "[hi], [hello]",
        });
        expect(result.errors).eqls([]);
        expect(result.warnings).eqls([]);
    });

    it("content is one type", async () => {
        const result = await bothBuilds(
            `<p name="a">one</p><group name="g"><p>two</p><p>three</p></group>
<div name="d"><repeat for="$a $g" valueName="v" indexName="i"><section><title>$i</title>$v</section></repeat></div>
<p name="p">$d.text</p>`,
            ["p"],
        );
        expect(result.errors).eqls([]);
    });

    it("a group of several is one item; a group of one stands for its component", async () => {
        const result = await bothBuilds(
            `<group name="g"><point>(1,2)</point><number>3</number></group>
<group name="nested"><group><math>1</math><math>2</math></group><math>5</math></group>
<mathList name="l">1 2 3</mathList><group name="one">$l</group>
<p name="p1"><repeat for="$g" valueName="v" indexName="i">[$i: $v]</repeat></p>
<p name="p2"><repeat for="$nested" valueName="v">[$v]</repeat></p>
<p name="p3"><repeat for="$one" valueName="v">[$v]</repeat></p>`,
            ["p1", "p2", "p3"],
        );
        expect(result.texts).eqls({
            p1: "[1: (1, 2)3]",
            p2: "[125]",
            p3: "[1], [2], [3]",
        });
        expect(result.errors).eqls([]);
    });

    it("a repeat over another repeat goes over records", async () => {
        const result = await bothBuilds(
            `<repeat name="data" for="1 2 3" valueName="k">
  <point name="P">($k, $k^2)</point><text name="L">P$k</text>
</repeat>
<p name="p1"><repeat for="$data" valueName="d">$d.P is labelled $d.L.</repeat></p>
<p name="p2"><repeat for="$data" valueName="d">$d.P.x</repeat></p>`,
            ["p1", "p2"],
        );
        expect(result.texts).eqls({
            p1: "(1, 1) is labelled P1., (2, 4) is labelled P2., (3, 9) is labelled P3.",
            p2: "1, 2, 3",
        });
        expect(result.errors).eqls([]);
        expect(result.warnings).eqls([]);
    });

    it("a name after the value of items of several is what every item declares, with one tag", async () => {
        // An item lacking the name: it names nothing in every iteration,
        // with a warning at load.
        const missing = await bothBuilds(
            `<group name="a"><point name="P">(1,2)</point><text>x</text></group>
<group name="b"><text name="Q">y</text><text>z</text></group>
<p name="p"><repeat for="$a $b" valueName="d">[$d.P]</repeat></p>`,
            ["p"],
        );
        expect(missing.texts.p).eq("[＿], [＿]");
        expect(missing.errors).eqls([]);
        expect(missing.warnings).eqls([
            "doenet-w0183: `$d.P` names nothing: item 2 of the `for` of the `<repeat>` has no `P`. Give it one, or use a name every item has.",
        ]);

        // An item that is an option is named as the option; an item after
        // the iterations of a repeat, whose number is not known at load,
        // is named by no place in the `for`.
        const unplaced = await bothBuilds(
            `<select name="s"><option><point name="P">(1,2)</point><text>x</text></option><option><point name="Q">(3,4)</point><text>y</text></option></select>
<repeat name="t" for="1 2 3" valueName="k"><point name="P">($k,0)</point><text>z</text></repeat>
<group name="b"><text name="Q">y</text><text>z</text></group>
<p name="p1"><repeat for="$s" valueName="d">[$d.P]</repeat></p>
<p name="p2"><repeat for="$t $b" valueName="d">[$d.P]</repeat></p>`,
            ["p1", "p2"],
        );
        expect(unplaced.texts).eqls({
            p1: "[＿]",
            p2: "[＿], [＿], [＿], [＿]",
        });
        expect(unplaced.warnings).eqls([
            "doenet-w0183: `$d.P` names nothing: option 2 of `s` has no `P`. Give it one, or use a name every option has.",
            "doenet-w0183: `$d.P` names nothing: an item of the `for` of the `<repeat>` has no `P`. Give it one, or use a name every item has.",
        ]);

        // So is an item after anything in `for` but a reference to a group
        // of several: the iterations of a repeat whose template is one
        // group, a reference that names nothing (a blank item), a group of
        // none (no item), or a `<shuffle>`, whose order is decided as the
        // document runs.
        const unplacedToo = await bothBuilds(
            `<group name="g"><point name="P">(1,0)</point><text>z</text></group>
<repeat name="t" for="1 2 3" valueName="k"><group><point name="P">($k,0)</point><text>z</text></group></repeat>
<group name="b"><text name="Q">y</text><text>z</text></group>
<group name="e"/>
<shuffle name="sh">$g $b</shuffle>
<p name="p1"><repeat for="$t $b" valueName="d">[$d.P]</repeat></p>
<p name="p2"><repeat for="$nothing $g $b" valueName="d">[$d.P]</repeat></p>
<p name="p3"><repeat for="$e $g $b" valueName="d">[$d.P]</repeat></p>
<p name="p4"><repeat for="$sh" valueName="d">[$d.P]</repeat></p>
<p name="p5"><repeat for="$g $b $sh" valueName="d">[$d.P]</repeat></p>
<group name="none"><conditionalContent><case condition="false"><point name="P">(1,0)</point></case></conditionalContent><conditionalContent><case condition="false"><text>a</text></case></conditionalContent></group>
<p name="p6"><repeat for="$none $g $b" valueName="d">[$d.P]</repeat></p>`,
            ["p1", "p2", "p3", "p4", "p5", "p6"],
        );
        expect(unplacedToo.texts).eqls({
            p1: "[＿], [＿], [＿], [＿]",
            p2: "[＿], [＿], [＿]",
            p3: "[＿], [＿]",
            p4: "[＿], [＿]",
            p5: "[＿], [＿], [＿], [＿]",
            // a group written with two composites that hold nothing now
            // is no item
            p6: "[＿], [＿]",
        });
        const someItem =
            "doenet-w0183: `$d.P` names nothing: an item of the `for` of the `<repeat>` has no `P`. Give it one, or use a name every item has.";
        expect(
            unplacedToo.warnings.filter((w) => w.startsWith("doenet-w0183")),
        ).eqls([
            someItem,
            someItem,
            someItem,
            someItem,
            // before the shuffle, places are known
            "doenet-w0183: `$d.P` names nothing: item 2 of the `for` of the `<repeat>` has no `P`. Give it one, or use a name every item has.",
            someItem,
        ]);

        // Two tags: an error in place of the reference.
        const types = await bothBuilds(
            `<group name="a"><point name="P">(1,2)</point><text>x</text></group>
<group name="b"><text name="P">y</text><text>z</text></group>
<p name="p"><repeat for="$a $b" valueName="d">[$d.P]</repeat></p>`,
            ["p"],
        );
        expect(types.texts.p).eq("[], []");
        expect(types.errors).eqls([
            "doenet-w0184: `$d.P` names nothing: `P` is a `<point>` in one item of the `for` of the `<repeat>` and a `<text>` in another. Use the same type, or different names.",
        ]);
    });

    it("the value is typed, so a tag made from it is checked at load", async () => {
        const result = await bothBuilds(
            `<text name="t">hi</text><number name="n">3</number><integer name="k">2</integer>
<p name="p1"><repeat for="$t" valueName="v"><point extend="$v"/></repeat></p>
<p name="p2"><repeat for="$k $n" valueName="v"><number extend="$v"/></repeat></p>
<p name="p3"><repeat for="$k $n" valueName="v"><sort>$v <text>hi</text></sort></repeat></p>`,
            ["p1", "p2", "p3"],
        );
        expect(result.texts.p2).eq("2, 3");
        expect(result.errors).eqls([
            "doenet-e0065: A `<point>` can't be made from `$v`, which gives a `<text>`. To show it as it is, write `$v`.",
            "doenet-e0076: `<sort>` takes items of one type, but it has a `<number>` and a `<text>`. Give each type a `<sort>` of its own.",
        ]);
    });

    it("a group holding one collection gives its items, as they change", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="n" prefill="1"/>
<group name="g"><repeatForSequence length="$n" valueName="j"><math>$j</math></repeatForSequence></group>
<p name="p"><repeat for="$g" valueName="v" indexName="i">[$i: $v]</repeat></p>`,
        });
        async function text() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }
        expect(await text()).eq("[1: 1]");
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await text()).eq("[1: 1], [2: 2], [3: 3]");
    });

    it("the value of an item of several follows what it holds, for an item copied from another repeat", async () => {
        // `for="$s"` copies the iterations of `s`; `$d` and `$r[2].d` must
        // follow the case shown inside each, as `$s` does.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="n" prefill="1"/>
<repeat name="s" for="1 2" valueName="k"><math name="P">$k</math><conditionalContent><case condition="$n=1"><math>9</math></case></conditionalContent></repeat>
<p name="p"><repeat for="$s" valueName="d" name="r">[$d / $d.P]</repeat></p>
<p name="q">$r[2].d</p>`,
        });
        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return [
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
                stateVariables[await resolvePathToNodeIdx("q")].stateValues
                    .text,
            ];
        }
        expect(await texts()).eqls(["[19 / 1], [29 / 2]", "29"]);
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts()).eqls(["[1 / 1], [2 / 2]", "2"]);
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts()).eqls(["[19 / 1], [29 / 2]", "29"]);
    });

    it("an item that extends a group and adds children holds what it adds", async () => {
        // `h` holds the components of `g` and the one it adds: `$d` shows
        // all three, and `$d.R` names the one it adds, with no warning.
        const result = await bothBuilds(
            `<group name="g"><text name="P">a</text><text name="Q">b</text></group>
<group name="h" extend="$g"><text name="R">c</text></group>
<group name="k"><text name="R">x</text><text>y</text></group>
<p name="p1"><repeat for="$h" valueName="d" name="r">[$d]</repeat></p>
<p name="p2"><repeat for="$h $k" valueName="d">[$d.R]</repeat></p>
<p name="p3">$r[1].d</p>`,
            ["p1", "p2", "p3"],
        );
        expect(result.texts).eqls({
            p1: "[abc]",
            p2: "[c], [x]",
            p3: "abc",
        });
        expect(result.errors).eqls([]);
        expect(result.warnings).eqls([]);

        // A group of one that adds one holds several: content, not a math.
        const mixed = await bothBuilds(
            `<group name="g"><math>1</math></group>
<group name="h" extend="$g"><text>x</text></group>
<p name="p"><repeat for="$h 5" valueName="d">[$d]</repeat></p>`,
            ["p"],
        );
        expect(mixed.texts.p).eq("");
        expect(mixed.errors.map((e) => e.split(":")[0])).eqls(["doenet-e0081"]);
    });
});
