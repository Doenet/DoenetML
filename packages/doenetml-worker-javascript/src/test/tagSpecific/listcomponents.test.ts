import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { renderedText } from "../utils/rendered-commas";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * What a parent sees of a list operator's results (Doenet/DoenetML#2158):
 * one child per result, of the results' type, however the parent reads its
 * children, and however the results are referenced.
 */
describe("List operator results as children @group4", async () => {
    async function stateValuesOf(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        name: string,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues;
    }

    async function expectTexts(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        texts: Record<string, string>,
    ) {
        for (const [name, text] of Object.entries(texts)) {
            expect(
                (await stateValuesOf(core, resolvePathToNodeIdx, name)).text,
                name,
            ).eq(text);
        }
    }

    const doenetML = `
    <mathInput name="n" prefill="3" />
    <numberList name="pop">30 45 12 60</numberList>
    <cumulativeSum name="cum">$pop</cumulativeSum>
    <numberList name="draws">
      <repeatForSequence from="1" to="$n" valueName="v"><number>$v*40</number></repeatForSequence>
    </numberList>
    <searchSorted name="which" target="$draws">$cum</searchSorted>
    <sortIndices name="perm">$pop</sortIndices>

    <p name="pWhich">$which</p>
    <p name="pInline">The draws are in $which.</p>
    <math name="mWhich">$which</math>
    <math name="mExpr">$which + 1</math>
    <math name="mPerm">$perm</math>
    <text name="tCum">$cum</text>
    <p name="pSum"><sum>$which</sum></p>
    <p name="pCount"><count>$which</count></p>
    <numberList name="nlWhich">$which</numberList>
    <mathList name="mlCum">$cum</mathList>
    <p name="pIndexed">$which[2]</p>
    <p name="pIndexedBy">$pop[$perm[1]]</p>
    <p name="pChained"><cumulativeSum>$which</cumulativeSum></p>
    <p name="pSort"><sort>$perm</sort></p>
    <point name="P">($cum[1], $cum[2])</point>
    <p name="pText"><text>$perm</text></p>
    <number name="nOne"><indexOf target="45">$pop</indexOf></number>
    `;

    it("each kind of parent reads the results as children", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pWhich: "2, 3, 4",
            pInline: "The draws are in 2, 3, 4.",
            mWhich: "2, 3, 4",
            mExpr: "(2, 3, 4) + 1",
            mPerm: "3, 1, 2, 4",
            tCum: "30, 75, 87, 147",
            pText: "3, 1, 2, 4",
            pSum: "9",
            pCount: "3",
            pIndexed: "3",
            pIndexedBy: "12",
            pChained: "2, 5, 9",
            pSort: "1, 2, 3, 4",
        });

        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "nlWhich"))
                .numbers,
        ).eqls([2, 3, 4]);
        expect(
            (
                await stateValuesOf(core, resolvePathToNodeIdx, "mlCum")
            ).maths.map((x: any) => x.tree),
        ).eqls([30, 75, 87, 147]);
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "P")).xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([30, 75]);
        // one result reads as one number
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "nOne")).value,
        ).eq(2);
    });

    it("the children follow the results as their number changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        for (const [n, which, mExpr, sum, count, indexed, chained] of [
            [
                "5",
                "2, 3, 4, 5, 5",
                "(2, 3, 4, 5, 5) + 1",
                "19",
                "5",
                "3",
                "2, 5, 9, 14, 19",
            ],
            ["1", "2", "2 + 1", "2", "1", "", "2"],
            ["0", "", "＿ + 1", "＿", "＿", "", ""],
            ["2", "2, 3", "(2, 3) + 1", "5", "2", "3", "2, 5"],
        ]) {
            await updateMathInputValue({
                latex: n,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await expectTexts(core, resolvePathToNodeIdx, {
                pWhich: which,
                pInline: `The draws are in ${which}.`,
                mWhich: which === "" ? "＿" : which,
                mExpr,
                pSum: sum,
                pCount: count,
                pIndexed: indexed,
                pChained: chained,
            });
            expect(
                (await stateValuesOf(core, resolvePathToNodeIdx, "nlWhich"))
                    .numbers,
                n,
            ).eqls(which === "" ? [] : which.split(", ").map(Number));
        }
    });

    it("no results inside a math, a text and a sum", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl">10 20 30</numberList>
    <numberList name="none" />
    <indexOf name="empty" target="$none">$nl</indexOf>
    <math name="m">$empty</math>
    <math name="mPlus">$empty + 1</math>
    <text name="t">$empty</text>
    <number name="num">$empty</number>
    <p name="pSum"><sum>$empty</sum></p>
    <p name="pSumMore"><sum>$empty 5</sum></p>
    <p name="p">[$empty]</p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            m: "＿",
            mPlus: "＿ + 1",
            t: "",
            num: "NaN",
            pSum: "＿",
            pSumMore: "5",
            p: "[]",
        });
    });

    it("display settings and asList reach the children and the references", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <cumulativeSum name="cum" displayDigits="2">1.234 2.345 3.456</cumulativeSum>
    <cumulativeSum name="cumNoList" asList="false">1 2 3</cumulativeSum>
    <tally name="t" displayDecimals="1">1 2 2</tally>
    <p name="p">$cum</p>
    <p name="pNoList">$cumNoList</p>
    <math name="m">$cum</math>
    <p name="pRef">$cum[2]</p>
    <p name="pCopy"><cumulativeSum extend="$cum" /></p>
    <p name="pT">$t</p>
    <p name="pTsum"><sum>$t</sum></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p: "1.2, 3.6, 7",
            pNoList: "136",
            m: "1.23, 3.58, 7.04",
            pRef: "3.6",
            pCopy: "1.2, 3.6, 7",
            pT: "1, 2",
            pTsum: "3",
        });
    });

    it("a repeat iterates over the results, and a collect gathers them", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="3" />
    <numberList name="nl">
      <repeatForSequence from="1" to="$n" valueName="v"><number>$v^2</number></repeatForSequence>
    </numberList>
    <section name="sec">
      <cumulativeSum name="cum">$nl</cumulativeSum>
      <math>x</math>
    </section>
    <p name="pr"><repeat for="$cum" valueName="c" indexName="i"><text>$i:$c</text></repeat></p>
    <p name="pr2"><repeat for="$cum" valueName="c"><math>2$c</math></repeat></p>
    <p name="pc"><collect componentType="math" from="$sec" /></p>
    `,
        });

        for (const [n, pr, pr2, pc] of [
            ["3", "1:1, 2:5, 3:14", "2 * 1, 2 * 5, 2 * 14", "1, 5, 14, x"],
            [
                "4",
                "1:1, 2:5, 3:14, 4:30",
                "2 * 1, 2 * 5, 2 * 14, 2 * 30",
                "1, 5, 14, 30, x",
            ],
            ["0", "", "", "x"],
            ["2", "1:1, 2:5", "2 * 1, 2 * 5", "1, 5, x"],
        ]) {
            if (n !== "3") {
                await updateMathInputValue({
                    latex: n,
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
            }
            await expectTexts(core, resolvePathToNodeIdx, { pr, pr2, pc });
        }
    });

    it("each result is drawn by the renderer of its type", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="3" />
    <numberList name="nl">
      <repeatForSequence from="1" to="$n" valueName="v"><number>$v</number></repeatForSequence>
    </numberList>
    <p name="p">Sums: <cumulativeSum name="cum">$nl</cumulativeSum>.</p>
    <p name="pCopy">$cum</p>
    <p name="pNoList"><cumulativeSum asList="false">1 2 3</cumulativeSum></p>
    <p name="pIndices"><sortIndices name="indices">30 10 20</sortIndices></p>
    <graph name="g"><cumulativeSum name="cumG">1 2</cumulativeSum></graph>
    <mathInput name="m" prefill="5" />
    <p name="pValue"><cumulativeSum name="cumV">$m 1</cumulativeSum></p>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        async function drawnChildren(name: string) {
            return rendererState[
                await resolvePathToNodeIdx(name)
            ].childrenInstructions.filter(
                (child: any) => typeof child === "object" && child !== null,
            );
        }
        async function expectDrawn(
            name: string,
            rendererType: string,
            ids: string[],
            values: string[],
        ) {
            const children = await drawnChildren(name);
            expect(
                children.map((child: any) => child.rendererType),
                name,
            ).eqls(ids.map(() => rendererType));
            expect(
                children.map((child: any) => child.id),
                name,
            ).eqls(ids);
            expect(
                children.map((child: any) => {
                    const stateValues =
                        rendererState[child.componentIdx].stateValues;
                    return rendererType === "math"
                        ? stateValues.latex
                        : stateValues.text;
                }),
                name,
            ).eqls(values);
        }
        async function expectRenderedText() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name of ["p", "pCopy", "pNoList", "pIndices"]) {
                const idx = await resolvePathToNodeIdx(name);
                expect(renderedText(core, stateVariables, idx), name).eq(
                    stateVariables[idx].stateValues.text,
                );
            }
        }

        await expectDrawn(
            "p",
            "math",
            ["cum:1", "cum:2", "cum:3"],
            ["1", "3", "6"],
        );
        await expectDrawn(
            "pIndices",
            "number",
            ["indices:1", "indices:2", "indices:3"],
            ["2", "3", "1"],
        );
        // drawn in the graph, at the anchor a math has
        await expectDrawn("g", "math", ["cumG:1", "cumG:2"], ["1", "3"]);
        for (const child of await drawnChildren("g")) {
            expect(rendererState[child.componentIdx].stateValues.anchor).eqls([
                "vector",
                0,
                0,
            ]);
        }
        await expectRenderedText();

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await expectDrawn(
            "p",
            "math",
            ["cum:1", "cum:2", "cum:3", "cum:4"],
            ["1", "3", "6", "10"],
        );
        await expectRenderedText();

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await expectDrawn("p", "math", ["cum:1"], ["1"]);
        await expectRenderedText();

        // a change of values alone redraws the same entries
        await expectDrawn("pValue", "math", ["cumV:1", "cumV:2"], ["5", "6"]);
        const before = (await drawnChildren("pValue")).map(
            (child: any) => child.componentIdx,
        );
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await expectDrawn("pValue", "math", ["cumV:1", "cumV:2"], ["7", "8"]);
        expect(
            (await drawnChildren("pValue")).map(
                (child: any) => child.componentIdx,
            ),
        ).eqls(before);
    });

    it("a write through a result is refused", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <cumulativeSum name="cum">1 2 3</cumulativeSum>
    <mathInput name="mi" bindValueTo="$cum[2]" />
    <p name="p">$cum</p>
    `,
        });

        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        await expectTexts(core, resolvePathToNodeIdx, { p: "1, 3, 6" });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "mi")).value.tree,
        ).eq(3);
    });
});
