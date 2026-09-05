import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("List operator tag tests @group4", async () => {
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

    describe("cumulative scans", async () => {
        it("cumulativeSum of numbers", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><cumulativeSum>30 45 12 60</cumulativeSum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "30, 75, 87, 147",
            });
        });

        it("cumulativeSum of a numberList reference", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="pop">30 45 12 60</numberList>
    <p name="p"><cumulativeSum name="cum">$pop</cumulativeSum></p>
    <p name="third">$cum[3]</p>
    <p name="total"><sum>$cum[4]</sum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "30, 75, 87, 147",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "third",
                text: "87",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "total",
                text: "147",
            });
        });

        it("cumulativeSum is symbolic when its inputs are", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathList name="ml">x y z</mathList>
    <p name="p"><cumulativeSum>$ml</cumulativeSum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "x, x + y, x + y + z",
            });
        });

        it("cumulativeProduct", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><cumulativeProduct>1 2 3 4 5</cumulativeProduct></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 2, 6, 24, 120",
            });
        });

        it("cumulativeMin and cumulativeMax", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="nl">3 1 4 1 5 9 2 6</numberList>
    <p name="pMin"><cumulativeMin>$nl</cumulativeMin></p>
    <p name="pMax"><cumulativeMax>$nl</cumulativeMax></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMin",
                text: "3, 1, 1, 1, 1, 1, 1, 1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMax",
                text: "3, 3, 4, 4, 5, 9, 9, 9",
            });
        });

        it("cumulativeMin, cumulativeMax and differences are symbolic when their inputs are", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathList name="ml">x y z</mathList>
    <p name="pMin"><cumulativeMin>$ml</cumulativeMin></p>
    <p name="pMax"><cumulativeMax>$ml</cumulativeMax></p>
    <p name="pDiff"><differences>$ml</differences></p>
    `,
            });

            // Each running extreme is a single min/max of the whole prefix
            // rather than a nest of two-argument calls, and the first is the
            // value itself rather than min(x).
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMin",
                text: "x, min( x, y ), min( x, y, z )",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMax",
                text: "x, max( x, y ), max( x, y, z )",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pDiff",
                text: "y - x, z - y",
            });
        });

        it("differences is one shorter than its input", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><differences>30 75 87 147</differences></p>
    <p name="pCount"><count><differences>30 75 87 147</differences></count></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "45, 12, 60",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCount",
                text: "3",
            });
        });

        it("differences undoes cumulativeSum", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="nl">5 3 8 1</numberList>
    <p name="p"><differences><cumulativeSum>$nl</cumulativeSum></differences></p>
    `,
            });

            // The first entry of the original list is lost, as with numpy diff
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "3, 8, 1",
            });
        });

        it("empty and single-element inputs", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="pOne"><cumulativeSum>7</cumulativeSum></p>
    <p name="pDiffOne"><differences>7</differences></p>
    <p name="pEmpty"><cumulativeSum></cumulativeSum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pOne",
                text: "7",
            });
            // differences of one value, and any scan of nothing, are empty
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pDiffOne",
                text: "",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pEmpty",
                text: "",
            });
        });

        it("cumulativeSum updates when an input changes", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi" prefill="5" />
    <p name="p"><cumulativeSum>1 $mi 2</cumulativeSum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 6, 8",
            });

            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 11, 13",
            });
        });

        it("cumulativeSum tracks a changing list length", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="4" />
    <p name="p"><cumulativeSum><sequence from="1" to="$n" /></cumulativeSum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 3, 6, 10",
            });

            await updateMathInputValue({
                latex: "6",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 3, 6, 10, 15, 21",
            });

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1, 3",
            });
        });

        it("forceSymbolic and forceNumeric override the default choice", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="pSymbolic"><cumulativeSum forceSymbolic>1 2 3</cumulativeSum></p>
    <p name="pNumeric"><cumulativeSum forceNumeric>1 x 3</cumulativeSum></p>
    `,
            });

            // Symbolic accumulation leaves the sums unevaluated.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSymbolic",
                text: "1, 1 + 2, 1 + 2 + 3",
            });
            // Numeric accumulation turns the non-numeric child into NaN.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pNumeric",
                text: "1, NaN, NaN",
            });
        });

        it("asList=false renders the results without separators", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><cumulativeSum asList="false">30 45 12</cumulativeSum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "307587",
            });
        });

        it("displayDigits is passed through to the results", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><cumulativeSum displayDigits="3">1.23456 2.34567</cumulativeSum></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "1.23, 3.58",
            });
        });
    });

    describe("index-returning operators", async () => {
        it("argMin and argMax of numbers", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="nl">3 1 4 1 5 9 2 6</numberList>
    <p name="pMin"><argMin>$nl</argMin></p>
    <p name="pMax"><argMax>$nl</argMax></p>
    `,
            });

            // ties resolve to the first occurrence
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMin",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMax",
                text: "6",
            });
        });

        it("argMax composes with dynamic indexing", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="scores">72 91 65 88</numberList>
    <textList name="names">Ann Bob Cal Dee</textList>
    <argMax name="best">$scores</argMax>
    <p name="p">$names[$best]</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "Bob",
            });
        });

        it("argMin and argMax over a text list are lexicographic", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textList name="tl">pear apple fig banana</textList>
    <p name="pMin"><argMin>$tl</argMin></p>
    <p name="pMax"><argMax>$tl</argMax></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMin",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMax",
                text: "1",
            });
        });

        it("argMin of an empty list is 0", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="p"><argMin></argMin></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "0",
            });
        });

        it("indexOf a number", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="nl">10 20 30 20</numberList>
    <p name="pFound"><indexOf target="20">$nl</indexOf></p>
    <p name="pMissing"><indexOf target="25">$nl</indexOf></p>
    `,
            });

            // first occurrence
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pFound",
                text: "2",
            });
            // absent values give 0
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMissing",
                text: "0",
            });
        });

        it("indexOf a text", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textList name="names">Ann Bob Cal Dee</textList>
    <p name="pFound"><indexOf type="text" target="Cal">$names</indexOf></p>
    <p name="pMissing"><indexOf type="text" target="Eve">$names</indexOf></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pFound",
                text: "3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMissing",
                text: "0",
            });
        });

        it("searchSorted returns a 1-based insertion position", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="cum">30 75 87 147</numberList>
    <p name="pBefore"><searchSorted target="1">$cum</searchSorted></p>
    <p name="pExact"><searchSorted target="30">$cum</searchSorted></p>
    <p name="pMid"><searchSorted target="31">$cum</searchSorted></p>
    <p name="pLast"><searchSorted target="147">$cum</searchSorted></p>
    <p name="pPastEnd"><searchSorted target="200">$cum</searchSorted></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pBefore",
                text: "1",
            });
            // side="left" places the target before an equal entry, so an exact
            // hit gives the index of that entry
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pExact",
                text: "1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMid",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pLast",
                text: "4",
            });
            // past the end is one past the last index
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pPastEnd",
                text: "5",
            });
        });

        it("searchSorted side left vs right", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="nl">1 2 2 2 3</numberList>
    <p name="pLeft"><searchSorted target="2" side="left">$nl</searchSorted></p>
    <p name="pRight"><searchSorted target="2" side="right">$nl</searchSorted></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pLeft",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pRight",
                text: "5",
            });
        });

        it("searchSorted over a sorted text list", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textList name="tl">apple banana fig pear</textList>
    <p name="p"><searchSorted type="text" target="cherry">$tl</searchSorted></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "3",
            });
        });

        it("the weighted-sampling pattern", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="pop">30 45 12 60</numberList>
    <cumulativeSum name="cum">$pop</cumulativeSum>
    <p name="p1"><searchSorted target="1">$cum</searchSorted></p>
    <p name="p30"><searchSorted target="30">$cum</searchSorted></p>
    <p name="p31"><searchSorted target="31">$cum</searchSorted></p>
    <p name="p88"><searchSorted target="88">$cum</searchSorted></p>
    <p name="p147"><searchSorted target="147">$cum</searchSorted></p>
    `,
            });

            // individuals 1-30 are in subpopulation 1, 31-75 in 2,
            // 76-87 in 3, 88-147 in 4
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p1",
                text: "1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p30",
                text: "1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p31",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p88",
                text: "4",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p147",
                text: "4",
            });
        });

        it("indexOf and searchSorted with no target give 0", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="nl">10 20 30</numberList>
    <p name="pIndexOf"><indexOf>$nl</indexOf></p>
    <p name="pSearchSorted"><searchSorted>$nl</searchSorted></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pIndexOf",
                text: "0",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSearchSorted",
                text: "0",
            });
        });

        it("sortIndices of numbers", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="nl">30 10 20</numberList>
    <p name="p"><sortIndices>$nl</sortIndices></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 3, 1",
            });
        });

        it("sortIndices of a text list", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textList name="tl">pear apple fig</textList>
    <p name="p"><sortIndices>$tl</sortIndices></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 3, 1",
            });
        });

        it("sortIndices sorts one list by another", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="scores">72 91 65 88</numberList>
    <textList name="names">Ann Bob Cal Dee</textList>
    <sortIndices name="perm">$scores</sortIndices>
    <p name="p">$names[$perm[1]], $names[$perm[2]], $names[$perm[3]], $names[$perm[4]]</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "Cal, Ann, Dee, Bob",
            });
        });

        it("sortIndices honors sortByProp", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <point name="A">(5,1)</point>
    <point name="B">(2,7)</point>
    <point name="C">(9,3)</point>
    <p name="p"><sortIndices sortByProp="x">$A $B $C</sortIndices></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 1, 3",
            });
        });

        it("bare strings need an explicit type, as with sort", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="pArg"><argMin type="number">3 1 4</argMin></p>
    <p name="pIdx"><indexOf type="number" target="4">3 1 4</indexOf></p>
    <p name="pText"><argMax type="text">pear apple fig</argMax></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pArg",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pIdx",
                text: "3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pText",
                text: "1",
            });
        });

        it("boolean children are ordered false before true", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <p name="pArgMin"><argMin type="boolean">true false true</argMin></p>
    <p name="pArgMax"><argMax type="boolean">false true false</argMax></p>
    <p name="pIndexOf"><indexOf type="boolean" target="true">false true false</indexOf></p>
    <p name="pIdx"><sortIndices type="boolean">true false true</sortIndices></p>
    <p name="pSort"><sort type="boolean">true false true</sort></p>
    `,
            });

            // `type="boolean"` is one of the types the shared string-splitting
            // accepts, so booleans must be comparable rather than silently
            // dropped from the list.
            for (let [name, text] of [
                ["pArgMin", "2"],
                ["pArgMax", "2"],
                ["pIndexOf", "2"],
                ["pIdx", "2, 1, 3"],
                ["pSort", "false, true, true"],
            ] as [string, string][]) {
                await expectText({ core, resolvePathToNodeIdx, name, text });
            }
        });

        it("warnings name the component the author wrote", async () => {
            let { core } = await createTestCore({
                doenetML: `
    <p name="p"><sortIndices type="bad">d a b</sortIndices></p>
    `,
            });

            await core.returnAllStateVariables(false, true);

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(
                diagnosticsByType.warnings.some((w) =>
                    w.message.includes(
                        "Invalid type bad for sortIndices component",
                    ),
                ),
            ).eq(true);
        });

        it("a scan result feeds the index operators and a numberList", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="pop">30 45 12 60</numberList>
    <numberList name="cum"><cumulativeSum>$pop</cumulativeSum></numberList>
    <p name="pCum">$cum</p>
    <argMax name="biggest">$pop</argMax>
    <p name="pArgMax">$biggest</p>
    <p name="pSize">$pop[$biggest]</p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pCum",
                text: "30, 75, 87, 147",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pArgMax",
                text: "4",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pSize",
                text: "60",
            });
        });

        it("sortIndices tracks a changing list length", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="4" />
    <p name="p"><sortIndices><sequence from="$n" to="1" step="-1" /></sortIndices></p>
    `,
            });

            // A descending sequence sorts into reverse order, so the indices
            // are a genuine permutation and not just the identity.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "4, 3, 2, 1",
            });

            await updateMathInputValue({
                latex: "6",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "6, 5, 4, 3, 2, 1",
            });

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 1",
            });
        });

        it("infinite values compare equal to themselves", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathList name="ml">1 Infinity 5</mathList>
    <mathList name="dup">1 Infinity Infinity 9</mathList>
    <mathList name="neg">-Infinity -Infinity 3</mathList>
    <p name="pFind"><indexOf target="Infinity">$ml</indexOf></p>
    <p name="pNeg"><indexOf target="-Infinity">$neg</indexOf></p>
    <p name="pLeft"><searchSorted target="Infinity" side="left">$dup</searchSorted></p>
    <p name="pRight"><searchSorted target="Infinity" side="right">$dup</searchSorted></p>
    `,
            });

            // Subtracting equal infinities gives NaN rather than 0, so without
            // an equality test first none of these would find their target.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pFind",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pNeg",
                text: "1",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pLeft",
                text: "3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pRight",
                text: "5",
            });
        });

        it("a referenced list mixed with bare strings keeps its items", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textList name="names">Ann Bob</textList>
    <numberList name="nums">30 10</numberList>
    <p name="pMid"><indexOf type="text" target="Bob">$names Z</indexOf></p>
    <p name="pLast"><indexOf type="text" target="Z">$names Z</indexOf></p>
    <p name="pArg"><argMax type="text">$names Z</argMax></p>
    <p name="pNum"><argMin type="number">$nums 5</argMin></p>
    `,
            });

            // The `type` attribute converts bare strings; a reference already
            // has a type, and wrapping it would fuse the whole list into one
            // value, hiding every item but the joined string.
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pMid",
                text: "2",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pLast",
                text: "3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pArg",
                text: "3",
            });
            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "pNum",
                text: "3",
            });
        });

        it("sortIndices updates when a value changes", async () => {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi" prefill="30" />
    <p name="p"><sortIndices type="number">$mi 10 20</sortIndices></p>
    `,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 3, 1",
            });

            await updateMathInputValue({
                latex: "15",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });

            await expectText({
                core,
                resolvePathToNodeIdx,
                name: "p",
                text: "2, 1, 3",
            });
        });
    });
});
