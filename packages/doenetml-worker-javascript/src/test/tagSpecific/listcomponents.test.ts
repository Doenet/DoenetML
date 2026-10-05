import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
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

    it("a collect gathers the results, not what they were computed from", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl">3 1 2</numberList>
    <section name="sNum"><cumulativeSum name="cum">$nl</cumulativeSum><number>9</number></section>
    <section name="sMath"><sortIndices name="si"><math>30</math><math>10</math><math>20</math></sortIndices></section>
    <p name="pNum"><collect componentType="number" from="$sNum" /></p>
    <p name="pMath"><collect componentType="math" from="$sMath" /></p>
    <p name="pFromCum"><collect componentType="math" from="$cum" /></p>
    <p name="pFromSi"><collect componentType="number" from="$si" /></p>
    <p name="pFromCumNum"><collect componentType="number" from="$cum" /></p>
    <p name="pFromCumOwnType"><collect componentType="cumulativeSum" from="$cum" /></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pNum: "9",
            pMath: "",
            pFromCum: "3, 4, 6",
            pFromSi: "2, 3, 1",
            pFromCumNum: "",
            pFromCumOwnType: "",
        });
    });

    it("a reference to a hidden operator shows its results", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="show" />
    <section name="sec">
      <cumulativeSum name="cum" hide="not $show">1 2</cumulativeSum>
    </section>
    <group name="g"><cumulativeSum name="cumG" hide>1 2</cumulativeSum></group>
    <p name="pRef">$cum</p>
    <p name="pCollect"><collect componentType="math" from="$sec" /></p>
    <p name="pCollectList"><collect componentType="cumulativeSum" from="$sec" /></p>
    <p name="pExtend"><cumulativeSum extend="$cum" /></p>
    <p name="pGroup">$g</p>
    <p name="pHidden" hide>$cum</p>
    <group name="gRef">$cum</group>
    <p name="pRefOfRef">$pRef</p>
    <p name="pGroupOfRef">$gRef</p>
    `,
        });

        for (const [show, pCollectList, pExtend] of [
            [false, "", ""],
            [true, "1, 3", "1, 3"],
        ] as const) {
            if (show) {
                await updateBooleanInputValue({
                    boolean: true,
                    componentIdx: await resolvePathToNodeIdx("show"),
                    core,
                });
            }
            await expectTexts(core, resolvePathToNodeIdx, {
                pRef: "1, 3",
                pCollect: "1, 3",
                pCollectList,
                pExtend,
                pGroup: "",
                pHidden: "",
                pGroupOfRef: "1, 3",
            });
            // The `text` of a copy of a `<p>` is blank on `main` too, so
            // read what its renderers show.
            expect(
                renderedText(
                    core,
                    await core.returnAllStateVariables(false, true),
                    await resolvePathToNodeIdx("pRefOfRef"),
                ),
            ).eq("1, 3");
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

    it("the children after the results are drawn, however many results there are", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="2" />
    <numberList name="nl">
      <repeatForSequence from="1" to="$n" valueName="v"><number>$v</number></repeatForSequence>
    </numberList>
    <section name="sec"><cumulativeSum>$nl</cumulativeSum><p>A</p><p>B</p></section>
    <graph name="g"><cumulativeSum>$nl</cumulativeSum><point>(1,2)</point><description>D</description></graph>
    <section name="secR"><sortIndices>$nl</sortIndices><repeat for="1 2"><mathInput /></repeat></section>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        async function drawnTypes(name: string) {
            return rendererState[
                await resolvePathToNodeIdx(name)
            ].childrenInstructions
                .filter(
                    (child: any) => typeof child === "object" && child !== null,
                )
                .map((child: any) => child.componentType);
        }

        for (const n of [2, 0, 1, 3]) {
            if (n !== 2) {
                await updateMathInputValue({
                    latex: `${n}`,
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
            }
            const maths = Array(n).fill("math");
            const numbers = Array(n).fill("number");
            expect(await drawnTypes("sec"), `n=${n}`).eqls([
                ...maths,
                "p",
                "p",
            ]);
            expect(await drawnTypes("g"), `n=${n}`).eqls([
                ...maths,
                "point",
                "description",
            ]);
            expect(await drawnTypes("secR"), `n=${n}`).eqls([
                ...numbers,
                "mathInput",
                "mathInput",
            ]);
        }
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

    it("a property of a result, or of every result, reads as that of a math or a number", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="3" />
    <mathInput name="mi" prefill="2" />
    <mathInput name="ddi" prefill="3" />
    <number name="i">$mi</number>
    <number name="dd">$ddi</number>
    <numberList name="src"><repeatForSequence from="1" to="$n" valueName="v"><number>$v*1.23456</number></repeatForSequence></numberList>
    <cumulativeSum name="c" displayDigits="$dd">$src</cumulativeSum>
    <sortIndices name="s">$src</sortIndices>

    <p name="pValue">$c[2].value</p>
    <p name="pText">$c[2].text</p>
    <p name="pLatex">$c[2].latex</p>
    <p name="pNumber">$c[2].number</p>
    <p name="pIndexBy">$c[$i].value</p>
    <p name="pPast">$c[5].text</p>
    <p name="pSettings">$c[2].displayDigits $c[2].fixed $c[2].hidden $c[2].isNumber $c[2].styleNumber $c[2].anchor</p>
    <math name="mValue">$c[2].value</math>
    <number name="nValue">$c[2].value</number>
    <math name="mExpr">$c[2].value + 1</math>
    <text name="tText">$c[2].text</text>
    <number name="nDigits">$c[2].displayDigits</number>
    <p name="pAllValue">$c.value</p>
    <p name="pAllText">$c.text</p>
    <p name="pAllFixed">$c.fixed</p>
    <p name="pAllDigits">$c.displayDigits</p>
    <p name="pAllStyle">$c.styleNumber</p>
    <p name="pSum"><sum>$c.number</sum></p>
    <p name="pNumbers">$s[2].math $s[2].text $s.text</p>
    <text name="tNumbers">$s[$i].text</text>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pValue: "3.7",
            pText: "3.7",
            pLatex: "3.7",
            pNumber: "3.7",
            pIndexBy: "3.7",
            pPast: "",
            pSettings: "3 true false true 1 (0, 0)",
            mValue: "3.7",
            nValue: "3.7",
            mExpr: "3.7 + 1",
            tText: "3.7",
            nDigits: "3",
            pAllValue: "1.23, 3.7, 7.41",
            pAllText: "1.23, 3.7, 7.41",
            pAllFixed: "true, true, true",
            pAllDigits: "3, 3, 3",
            pAllStyle: "1",
            pSum: "12.35",
            pNumbers: "2 2 1, 2, 3",
            tNumbers: "2",
        });

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("ddi"),
            core,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pValue: "4",
            pText: "4",
            pNumber: "4",
            pIndexBy: "7",
            pSettings: "1 true false true 1 (0, 0)",
            mValue: "4",
            mExpr: "3.7 + 1",
            tText: "4",
            nDigits: "1",
            pAllValue: "1, 4, 7, 10",
            pAllText: "1, 4, 7, 10",
            pAllFixed: "true, true, true, true",
            pAllDigits: "1, 1, 1, 1",
            pNumbers: "2 2 1, 2, 3, 4",
            tNumbers: "3",
        });

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pValue: "",
            pText: "",
            pIndexBy: "",
            pAllValue: "1",
            pAllFixed: "true",
            pNumbers: "  1",
        });
    });

    it("a property a math computes from its value reads as that of a math", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="ai" prefill="1.5" />
    <mathInput name="ddi" prefill="2" />
    <number name="dd">$ddi</number>
    <cumulativeSum name="c" displayDigits="$dd">$ai 2.34567</cumulativeSum>
    <cumulativeSum name="e">1 /</cumulativeSum>

    <p name="pX">$c[2].x</p>
    <p name="pVector">$c[2].vector</p>
    <p name="pList">$c[2].list</p>
    <p name="pMatrix">$c[2].matrix</p>
    <p name="pSizes">$c[2].matrixSize $c[2].numRows $c[2].numColumns $c[2].numDimensions $c[2].numListItems</p>
    <p name="pNumeric">$c[2].isNumeric $e[2].isNumeric</p>
    <text name="tDoenetML">$c[2].doenetML</text>
    <math name="mX">$c[2].x + 1</math>
    <number name="nDimensions">$c[2].numDimensions + 1</number>
    <p name="pAllX">$c.x</p>
    <p name="pAllMatrix">$c.matrix</p>
    <p name="pAllSizes">$c.matrixSize</p>
    <p name="pAllNumeric">$e.isNumeric</p>
    <p name="pAllDoenetML">$c.doenetML</p>
    `,
        });

        const doenetML = `<cumulativeSum name="c" displayDigits="$dd">$ai 2.34567</cumulativeSum>`;

        await expectTexts(core, resolvePathToNodeIdx, {
            pX: "3.8",
            pVector: "3.8",
            pList: "3.8",
            pMatrix: "[[3.8]]",
            pSizes: "1, 1 1 1 1 1",
            pNumeric: "true false",
            tDoenetML: doenetML,
            mX: "3.85 + 1",
            nDimensions: "2",
            pAllX: "1.5, 3.8",
            pAllMatrix: "[[1.5]], [[3.8]]",
            pAllSizes: "1, 1, 1, 1",
            pAllNumeric: "true, false",
            pAllDoenetML: doenetML,
        });

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("ddi"),
            core,
        });
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("ai"),
            core,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pX: "x + 2.346",
            pMatrix: "[[x + 2.346]]",
            pNumeric: "false false",
            pAllX: "x, x + 2.346",
        });
    });

    it("a copy of a result follows display settings given by reference", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="ddi" prefill="2" />
    <booleanInput name="pz" />
    <number name="dd">$ddi</number>
    <cumulativeSum name="c" displayDigits="$dd">1.23456 2.34567</cumulativeSum>
    <tally name="t" displayDigits="$dd" padZeros="$pz">1 1 2</tally>
    <p name="pMath"><math copy="$c[2]" /></p>
    <p name="pNumber"><number copy="$t[1]" /></p>
    <p name="pExtend"><math extend="$c[2]" /></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pMath: "3.6",
            pNumber: "2",
            pExtend: "3.6",
        });

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("ddi"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("pz"),
            core,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pMath: "3.58",
            pNumber: "2.000",
            pExtend: "3.58",
        });
    });

    it("a copy of the whole result follows display settings given by reference", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="ddi" prefill="2" />
    <number name="dd">$ddi</number>
    <cumulativeSum name="c" displayDigits="$dd">1.23456 2.34567</cumulativeSum>
    <p name="pList"><cumulativeSum copy="$c" /></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, { pList: "1.2, 3.6" });

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("ddi"),
            core,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pList: "1.235, 3.58",
        });
    });
});
