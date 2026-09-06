import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Counting operator tag tests @group4", async () => {
    async function expectText({
        core,
        resolvePathToNodeIdx,
        name,
        text,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        name: string;
        text: string;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.text,
        ).eq(text);
    }

    async function messagesFor(doenetML: string) {
        const { core } = await createTestCore({ doenetML });
        await core.returnAllStateVariables(false, true);
        const d = getDiagnosticsByType(core);
        return {
            warnings: d.warnings.map((w) => w.message),
            infos: d.infos.map((i) => i.message),
        };
    }

    describe("tally", async () => {
        it("counts the distinct values when no categories are named", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textList name="w">apple fig apple pear fig apple</textList>
    <p name="pCounts"><tally type="text">$w</tally></p>
    <tally name="t" type="text">$w</tally>
    <p name="pCategories">$t.categories</p>
    `,
            });

            // Sorted rather than first-seen, so the same multiset always reads
            // the same way however the data happened to arrive.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCounts",
                text: "3, 2, 1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCategories",
                text: "apple, fig, pear",
            });
        });

        it("counts declared categories, in the order they were declared", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="which">1 4 1 2 2 2 4</numberList>
    <tally name="t" categories="4 3 2 1">$which</tally>
    <p name="pCounts">$t</p>
    <p name="pCategories">$t.categories</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCounts",
                text: "2, 0, 3, 2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCategories",
                text: "4, 3, 2, 1",
            });
        });

        it("a declared category nothing matches still gets a 0", async () => {
            // The point of declaring categories: a subpopulation nobody landed
            // in has to keep its slot, or the counts stop lining up with the
            // categories they are counts of.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="which">1 1 4</numberList>
    <p name="p"><tally categories="1 2 3 4">$which</tally></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 0, 0, 1",
            });
        });

        it("the result is an ordinary list", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="which">1 4 1 2 2 2 4</numberList>
    <tally name="t" categories="1 2 3 4">$which</tally>
    <p name="pSecond">$t[2]</p>
    <p name="pSum"><sum>$t</sum></p>
    <numberList name="asNumbers">$t</numberList>
    <p name="pMax"><max>$t</max></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSecond",
                text: "3",
            });
            // Every value is counted exactly once, so the counts sum to the
            // size of the sample.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSum",
                text: "7",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMax",
                text: "3",
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("asNumbers")]
                    .stateValues.numbers,
            ).eqls([2, 3, 0, 2]);
        });

        it("counts booleans, ordered false before true", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <booleanList name="b">true false true true</booleanList>
    <tally name="t" type="boolean">$b</tally>
    <p name="pCounts">$t</p>
    <p name="pCategories">$t.categories</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCounts",
                text: "1, 3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCategories",
                text: "false, true",
            });
        });

        it("an empty list has nothing to count", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="none" />
    <p name="p"><tally>$none</tally></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "",
            });
        });

        it("values matching no declared category are reported as info", async () => {
            const { warnings, infos } = await messagesFor(`
    <numberList name="n">1 2 9 9</numberList>
    <p><tally categories="1 2">$n</tally></p>
    `);

            expect(warnings.length).eq(0);
            expect(
                infos.some((m) =>
                    m.includes("matched none of the declared categories"),
                ),
            ).eq(true);
        });

        it("nothing is reported when every value falls in a category", async () => {
            const { warnings, infos } = await messagesFor(`
    <numberList name="n">1 2 2</numberList>
    <p><tally categories="1 2">$n</tally></p>
    `);

            expect(warnings.length).eq(0);
            expect(infos.length).eq(0);
        });

        it("inferred categories compare the way the list does", async () => {
            // `2/2` and `1` are the same number written two ways. A numeric
            // list is compared numerically, so they are one category with a
            // count of three — not two categories, and nothing left over to
            // report as unmatched.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathList name="m">2/2 1 1</mathList>
    <tally name="t" type="math">$m</tally>
    <p name="pCounts">$t</p>
    <p name="pCategories">$t.categories</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCounts",
                text: "3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCategories",
                text: "1",
            });

            const { infos } = await messagesFor(`
    <mathList name="m">2/2 1 1</mathList>
    <p><tally type="math">$m</tally></p>
    `);
            expect(infos.length).eq(0);
        });

        it("declared categories read back as the type they were written as", async () => {
            // Not as the numbers a numeric reading would turn them into: the
            // point of `.categories` is to label the counts, and `1, 0` is not
            // a label anyone wrote.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <booleanList name="b">true false true</booleanList>
    <tally name="tb" type="boolean" categories="true false">$b</tally>
    <p name="pBoolean">$tb.categories</p>

    <mathList name="m">x y x</mathList>
    <tally name="tm" type="math" categories="x y">$m</tally>
    <p name="pMath">$tm.categories</p>
    <p name="pMathCounts">$tm</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pBoolean",
                text: "true, false",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMath",
                text: "x, y",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMathCounts",
                text: "2, 1",
            });
        });

        it("a value that is not a number is no category at all", async () => {
            // A `NaN` equals nothing, not even another `NaN`, so left in it
            // would become one category per occurrence, each labeled `NaN` and
            // counted zero times. It is left out instead, and reported as
            // nothing: no category was declared, so the message about declared
            // categories would be about nothing.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <tally name="t"><number>x</number><number>y</number><number>1</number></tally>
    <p name="pCounts">$t</p>
    <p name="pCategories">$t.categories</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCounts",
                text: "1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCategories",
                text: "1",
            });

            const { warnings, infos } = await messagesFor(`
    <p><tally><number>x</number><number>y</number><number>1</number></tally></p>
    `);

            expect(warnings.length).eq(0);
            expect(infos.length).eq(0);
        });

        it("a value that is not a number matches no declared category", async () => {
            // The other side of the coin: with categories declared there is
            // nothing special about a `NaN`. It matches none of them, exactly
            // as a 9 would, and is reported by the same message.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><tally categories="1 2"><number>1</number><number>x</number><number>2</number></tally></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 1",
            });

            const { warnings, infos } = await messagesFor(`
    <p><tally categories="1 2"><number>1</number><number>x</number><number>2</number></tally></p>
    `);

            expect(warnings.length).eq(0);
            expect(
                infos.some((m) =>
                    m.includes("matched none of the declared categories"),
                ),
            ).eq(true);
        });

        it("recounts when the values change", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="3" />
    <numberList name="values">
      <repeatForSequence from="1" to="$n" valueName="v"><number>mod($v, 2)</number></repeatForSequence>
    </numberList>
    <p name="p"><tally categories="0 1">$values</tally></p>
    `,
            });

            // 1, 0, 1 -> one even, two odd
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 2",
            });

            await updateMathInputValue({
                latex: "6",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            // 1, 0, 1, 0, 1, 0 -> three each
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "3, 3",
            });
        });

        it("gains and loses counts as the inferred categories change", async () => {
            // With the categories inferred, the number of counts is not fixed
            // by the markup, so the composite has to add replacements and
            // withhold them again as the data moves. `.categories` has to
            // resize alongside them, or the labels stop lining up with the
            // counts they label.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="3" />
    <numberList name="values">
      <repeatForSequence from="1" to="$n" valueName="v"><number>mod($v, 3)</number></repeatForSequence>
    </numberList>
    <tally name="t">$values</tally>
    <p name="pCounts">$t</p>
    <p name="pCategories">$t.categories</p>
    `,
            });

            async function expectCounts(counts: string, categories: string) {
                await expectText({
                    core,
                    resolvePathToNodeIdx,
                    name: "pCounts",
                    text: counts,
                });
                await expectText({
                    core,
                    resolvePathToNodeIdx,
                    name: "pCategories",
                    text: categories,
                });
            }

            async function setN(latex: string) {
                await updateMathInputValue({
                    latex,
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
            }

            // 1, 2, 0 -> one of each
            await expectCounts("1, 1, 1", "0, 1, 2");

            // 1, 2 -> the 0 category disappears, and with it a count
            await setN("2");
            await expectCounts("1, 1", "1, 2");

            // 1 -> down to a single category
            await setN("1");
            await expectCounts("1", "1");

            // 1, 2, 0 nine times over -> the withheld counts come back
            await setN("9");
            await expectCounts("3, 3, 3", "0, 1, 2");
        });
    });

    describe("binCounts", async () => {
        it("counts into left-closed bins, with the last bin closed", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="edges">0 1 2</numberList>
    <numberList name="v">0 0.5 1 1.5 2</numberList>
    <p name="p"><binCounts bins="$edges">$v</binCounts></p>
    `,
            });

            // [0, 1) takes 0 and 0.5; [1, 2] takes 1, 1.5 and 2 — the upper
            // edge is included so the largest value is not dropped.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 3",
            });
        });

        it("counts into right-closed bins, with the first bin closed", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="edges">0 1 2</numberList>
    <numberList name="v">0 0.5 1 1.5 2</numberList>
    <p name="p"><binCounts bins="$edges" closed="right">$v</binCounts></p>
    `,
            });

            // [0, 1] takes 0, 0.5 and 1; (1, 2] takes 1.5 and 2.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "3, 2",
            });
        });

        it("the cumulative-boundary pattern", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="cum">0 30 75 87 147</numberList>
    <numberList name="draws">1 30 31 75 76 87 88 147</numberList>
    <p name="p"><binCounts bins="$cum" closed="right">$draws</binCounts></p>
    `,
            });

            // With cumulative sizes as cut points, right-closed bins are
            // exactly the subpopulations: individuals 1-30, 31-75, 76-87,
            // 88-147.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 2, 2, 2",
            });
        });

        it("values outside the outermost cut points are not counted", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="edges">0 10</numberList>
    <numberList name="v">-5 0 5 10 15</numberList>
    <p name="p"><binCounts bins="$edges">$v</binCounts></p>
    <p name="pSum"><sum><binCounts bins="$edges">$v</binCounts></sum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "3",
            });
            // -5 and 15 fall outside every bin, so the counts do not sum to
            // the size of the sample — unlike <tally> with inferred categories.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSum",
                text: "3",
            });
        });

        it("an empty sample gives a zero for every bin", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="edges">0 1 2</numberList>
    <numberList name="none" />
    <p name="p"><binCounts bins="$edges">$none</binCounts></p>
    `,
            });

            // Zeros rather than nothing: the bins exist even when the sample
            // does not, which is what keeps a chart's axis stable.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "0, 0",
            });
        });

        it("the result is an ordinary list", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="edges">0 1 2 3</numberList>
    <numberList name="v">0.5 0.5 1.5 2.5 2.5 2.5</numberList>
    <binCounts name="b" bins="$edges">$v</binCounts>
    <p name="pThird">$b[3]</p>
    <p name="pSum"><sum>$b</sum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pThird",
                text: "3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSum",
                text: "6",
            });
        });

        it("recounts when the sample changes", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="edges">0 2 4</numberList>
    <mathInput name="n" prefill="2" />
    <numberList name="v">
      <repeatForSequence from="1" to="$n" valueName="k"><number>$k</number></repeatForSequence>
    </numberList>
    <p name="p"><binCounts bins="$edges">$v</binCounts></p>
    `,
            });

            // 1, 2 -> [0,2) holds 1; [2,4] holds 2
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 1",
            });

            await updateMathInputValue({
                latex: "4",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            // 1, 2, 3, 4 -> [0,2) holds 1; [2,4] holds 2, 3 and 4
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 3",
            });
        });

        it("gains and loses bins as the cut points change", async () => {
            // The counterpart of the sample changing: here it is the number of
            // bins that moves, so the composite adds replacements, withholds
            // them all the way down to none, and reveals them again.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="3" />
    <numberList name="edges">
      <repeatForSequence from="0" to="$n" valueName="v"><number>$v</number></repeatForSequence>
    </numberList>
    <numberList name="v">0.5 1.5 2.5 3.5 4.5</numberList>
    <p name="p"><binCounts bins="$edges">$v</binCounts></p>
    `,
            });

            async function setN(latex: string) {
                await updateMathInputValue({
                    latex,
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
            }

            // Cut points 0, 1, 2, 3 -> three bins, each holding one value;
            // 3.5 and 4.5 fall outside.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 1, 1",
            });

            // Cut points 0 through 5 -> five bins, each holding one value.
            await setN("5");
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 1, 1, 1, 1",
            });

            // Cut points 0, 1 -> a single bin, holding only 0.5.
            await setN("1");
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1",
            });

            // A single cut point is too few to define an interval, so every
            // count is withheld and the warning is raised.
            await setN("0");
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "",
            });

            // Cut points 0 through 4 -> the withheld counts come back.
            await setN("4");
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 1, 1, 1",
            });
        });

        it("omitting bins is a warning", async () => {
            const { warnings } = await messagesFor(`
    <numberList name="n">1 2 3</numberList>
    <p><binCounts>$n</binCounts></p>
    `);

            expect(
                warnings.some(
                    (m) =>
                        m.includes("binCounts") &&
                        m.includes("has no `bins` cut points"),
                ),
            ).eq(true);
        });

        it("fewer than two cut points is a warning", async () => {
            const { warnings } = await messagesFor(`
    <numberList name="n">1 2 3</numberList>
    <numberList name="edges">5</numberList>
    <p><binCounts bins="$edges">$n</binCounts></p>
    `);

            expect(
                warnings.some((m) => m.includes("needs at least 2 cut points")),
            ).eq(true);
        });

        it("non-numeric values are a warning", async () => {
            const { warnings } = await messagesFor(`
    <textList name="w">apple fig</textList>
    <numberList name="edges">0 1 2</numberList>
    <p><binCounts type="text" bins="$edges">$w</binCounts></p>
    `);

            expect(
                warnings.some((m) =>
                    m.includes("can only count numeric values into bins"),
                ),
            ).eq(true);
        });

        it("a decreasing cut point is a warning and gives no counts", async () => {
            // A bin running backwards has no count — the arithmetic that
            // produces one produces a negative number — so it is reported
            // rather than answered.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="v">1 3 4</numberList>
    <p name="p"><binCounts bins="0 5 2">$v</binCounts></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "",
            });

            const { warnings } = await messagesFor(`
    <numberList name="v">1 3 4</numberList>
    <p><binCounts bins="0 5 2">$v</binCounts></p>
    `);
            expect(
                warnings.some((m) =>
                    m.includes("at least as large as the one before it"),
                ),
            ).eq(true);
        });

        it("a cut point that is not a number is a warning and gives no counts", async () => {
            // Nothing sorts below a `NaN`, so counting against it would report
            // the bin ending at it as a negative count. Rejected with the
            // cut-points-must-climb warning rather than counted.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="v">0 0</numberList>
    <p name="p"><binCounts bins="1 x 5">$v</binCounts></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "",
            });

            const { warnings } = await messagesFor(`
    <numberList name="v">0 0</numberList>
    <p><binCounts bins="1 x 5">$v</binCounts></p>
    `);
            expect(
                warnings.some((m) =>
                    m.includes("at least as large as the one before it"),
                ),
            ).eq(true);
        });

        it("two equal cut points name an empty bin", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="v">0 0.5 1 1.5 2</numberList>
    <p name="p"><binCounts bins="0 1 1 2">$v</binCounts></p>
    `,
            });

            // `[0, 1)`, then `[1, 1)` which nothing can be in, then `[1, 2]`.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 0, 3",
            });

            const { warnings } = await messagesFor(`
    <numberList name="v">0 0.5 1 1.5 2</numberList>
    <p><binCounts bins="0 1 1 2">$v</binCounts></p>
    `);
            expect(warnings.length).eq(0);
        });

        it("a value that is not a number lands in no bin", async () => {
            // And, crucially, does not disturb the values around it: 1.5 is
            // still counted once, in the bin it belongs to.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><binCounts bins="0 1 2"><number>x</number><number>1.5</number></binCounts></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "0, 1",
            });
        });
    });

    describe("counting the result of an index operator", async () => {
        it("draws to subpopulations to counts", async () => {
            // The pattern the whole family exists for: accumulate the weights,
            // map every draw onto its subpopulation with one <searchSorted>,
            // then count them.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <setup>
      <numberList name="pop">30 45 12 60</numberList>
      <cumulativeSum name="cum">$pop</cumulativeSum>
    </setup>
    <numberList name="draws">5 40 80 100 20 90 76 3</numberList>
    <searchSorted name="which" side="left" target="$draws">$cum</searchSorted>
    <tally name="counts" categories="1 2 3 4">$which</tally>
    <p name="pWhich">$which</p>
    <p name="pCounts">$counts</p>
    <p name="pSum"><sum>$counts</sum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pWhich",
                text: "1, 2, 3, 4, 1, 4, 3, 1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCounts",
                text: "3, 1, 2, 2",
            });
            // Every draw lands in exactly one subpopulation.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSum",
                text: "8",
            });
        });

        it("binCounts reaches the same answer without the intermediate indices", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <setup>
      <numberList name="pop">30 45 12 60</numberList>
      <cumulativeSum name="cum">$pop</cumulativeSum>
    </setup>
    <numberList name="draws">5 40 80 100 20 90 76 3</numberList>
    <p name="p"><binCounts bins="0 $cum" closed="right">$draws</binCounts></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "3, 1, 2, 2",
            });
        });
    });

    describe("malformed numbers and boundary bins", async () => {
        it("a malformed number is no category even when the list is compared as text", async () => {
            // `<number>x</number>` is numeric by type but `NaN` by value. In a
            // text-compared list it would otherwise survive as the text `NaN`.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><tally type="text"><number>x</number><text>fig</text><text>fig</text></tally></p>
    <tally name="t" type="text"><number>x</number><text>fig</text><text>fig</text></tally>
    <p name="pCat">$t.categories</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCat",
                text: "fig",
            });
        });

        it("a declared category spelled NaN does not catch a malformed number", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><tally type="text" categories="NaN fig"><number>x</number><text>fig</text></tally></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "0, 1",
            });
        });

        it("a genuine text NaN is still counted", async () => {
            // The exclusion is per value and by type, so it must not reach a
            // `<text>` an author actually wrote.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><tally type="text" categories="NaN fig"><text>NaN</text><text>fig</text></tally></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 1",
            });
        });

        it("a zero-width bin at the end still takes the outermost cut point", async () => {
            // Forcing it empty would drop the value entirely, which is what the
            // always-included outermost edge exists to prevent.
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="pLeft"><binCounts bins="0 1 1"><number>1</number></binCounts></p>
    <p name="pRight"><binCounts bins="0 0 1" closed="right"><number>0</number></binCounts></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pLeft",
                text: "0, 1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pRight",
                text: "1, 0",
            });
        });

        it("a zero-width bin between other bins is empty", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><binCounts bins="0 1 1 2"><number>1</number></binCounts></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "0, 0, 1",
            });
        });
    });

    describe("counts are numbers", async () => {
        it("tally declares the number renderer with no children", async () => {
            // A composite has to declare the renderer its replacements will
            // need before it has any, or an empty list that later fills in
            // would render nothing.
            let { core } = await createTestCore({
                doenetML: `
    <textList name="tl" />
    <tally type="text">$tl</tally>
    `,
            });

            expect(core.core!.rendererTypesInDocument).toContain("number");
            expect(core.core!.rendererTypesInDocument).not.toContain("math");
        });

        it("binCounts declares the number renderer with no children", async () => {
            let { core } = await createTestCore({
                doenetML: `
    <numberList name="nl" />
    <binCounts bins="0 1 2">$nl</binCounts>
    `,
            });

            expect(core.core!.rendererTypesInDocument).toContain("number");
            expect(core.core!.rendererTypesInDocument).not.toContain("math");
        });

        it("a count indexes a list, so it is usable as a path index", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textList name="names">Ann Bob Cal Dee</textList>
    <numberList name="rolls">3 1 3 3 1</numberList>
    <tally name="counts" categories="1 2 3">$rolls</tally>
    <p name="p">$names[$counts[1]] $names[$counts[3]]</p>
    `,
            });

            // Two 1s and three 3s, so the counts are 2, 0, 3.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "Bob Cal",
            });
        });
    });
});
