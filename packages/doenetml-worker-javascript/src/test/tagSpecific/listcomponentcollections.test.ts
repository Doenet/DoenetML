import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { renderedText } from "../utils/rendered-commas";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * What a parent, a reference and the viewer see of a `<collect>`, `<sort>`
 * or `<shuffle>` whose entries share one type of value
 * (Doenet/DoenetML#2161), however it is built.
 */
describe("Collect, sort and shuffle of values @group4", async () => {
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

    /**
     * The children the viewer draws for `name`, which leaves out hidden ones:
     * the type of renderer, the text or latex shown, and the text color and
     * `renderMode` sent.
     */
    async function drawn(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        name: string,
    ) {
        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        return rendererState[
            await resolvePathToNodeIdx(name)
        ].childrenInstructions
            .filter((child: any) => typeof child === "object" && child)
            .map((child: any) => {
                const stateValues =
                    rendererState[child.componentIdx].stateValues;
                return {
                    rendererType: child.rendererType,
                    shown:
                        child.rendererType === "math"
                            ? stateValues.latex
                            : stateValues.text,
                    textColor: stateValues.selectedStyle?.textColor,
                    ...(child.rendererType === "math"
                        ? { renderMode: stateValues.renderMode }
                        : {}),
                };
            });
    }

    async function expectRenderedText(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of names) {
            const idx = await resolvePathToNodeIdx(name);
            expect(renderedText(core, stateVariables, idx), name).eq(
                stateVariables[idx].stateValues.text,
            );
        }
    }

    it("collect values of each type, read by each kind of parent", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="x" />
    <section name="s">
      <math name="m1">$mi+1</math>
      <number name="n1">3</number>
      <text name="t1">apple</text>
      <math name="m2" displayDigits="5">3.14159265</math>
      <boolean name="b1">true</boolean>
      <number name="n2">4.5</number>
      <text name="t2">fig</text>
      <interval name="i1">(1,2)</interval>
      <boolean name="b2">false</boolean>
    </section>

    <p name="pm"><collect componentType="math" from="$s" name="cm" /></p>
    <p name="pn"><collect componentType="number" from="$s" name="cn" /></p>
    <p name="pt"><collect componentType="text" from="$s" name="ct" /></p>
    <p name="pb"><collect componentType="boolean" from="$s" name="cb" /></p>
    <p name="pi"><collect componentType="interval" from="$s" name="ci" /></p>

    <math name="mathCm">$cm</math>
    <math name="mathCmPlus">$cm + 1</math>
    <p name="sumCn"><sum>$cn</sum></p>
    <p name="countCt"><count>$ct</count></p>
    <text name="textCt">$ct</text>
    <p name="nlCn"><numberList>$cn 7</numberList></p>
    <p name="mlCm"><mathList>$cm z</mathList></p>
    <p name="tlCt"><textList>$ct kiwi</textList></p>
    <p name="blCb"><booleanList>$cb true</booleanList></p>
    <p name="pCm2">$cm[2]</p>
    <p name="pCn2">$cn[2]</p>
    <p name="pCt1">$ct[1]</p>
    <p name="pRef">$cm</p>
    <math name="mCm1">$cm[1]^2</math>
    <p name="pNumValues">$cn.numComponents</p>
    `,
        });

        const expected = {
            pm: "x + 1, 3.1416, (1, 2)",
            pn: "3, 4.5",
            pt: "apple, fig",
            pb: "true, false",
            pi: "(1, 2)",
            mathCm: "x + 1, 3.14, (1, 2)",
            mathCmPlus: "(x + 1, 3.14, (1, 2)) + 1",
            sumCn: "7.5",
            countCt: "2",
            textCt: "apple, fig",
            nlCn: "3, 4.5, 7",
            mlCm: "x + 1, 3.1416, (1, 2), z",
            tlCt: "apple, fig, kiwi",
            blCb: "true, false, true",
            pCm2: "3.1416",
            pCn2: "4.5",
            pCt1: "apple",
            pRef: "x + 1, 3.1416, (1, 2)",
            mCm1: "(x + 1)²",
        };
        await expectTexts(core, resolvePathToNodeIdx, expected);
        await expectRenderedText(core, resolvePathToNodeIdx, [
            "pm",
            "pn",
            "pt",
            "pb",
            "pRef",
        ]);

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            pm: "y + 1, 3.1416, (1, 2)",
            mathCm: "y + 1, 3.14, (1, 2)",
            mlCm: "y + 1, 3.1416, (1, 2), z",
            pRef: "y + 1, 3.1416, (1, 2)",
            mCm1: "(y + 1)²",
        });
    });

    it("collect follows the components it collects as they change", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="2" />
    <group name="g">
      <number>10</number>
      <repeatForSequence from="1" to="$n" valueName="v"><number>$v</number></repeatForSequence>
      <conditionalContent condition="$n > 2"><number>100</number></conditionalContent>
    </group>
    <p name="p"><collect componentType="number" from="$g" name="c" /></p>
    <p name="pSum"><sum>$c</sum></p>
    <p name="pCount"><count>$c</count></p>
    <p name="pIndex">$c[3]</p>
    <p name="pLast">$c[$c.numComponents]</p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p: "10, 1, 2",
            pSum: "13",
            pCount: "3",
            pIndex: "2",
        });

        for (const [n, p, sum, count, index] of [
            ["4", "10, 1, 2, 3, 4, 100", "120", "6", "2"],
            ["0", "10", "10", "1", ""],
            ["3", "10, 1, 2, 3, 100", "116", "5", "2"],
        ]) {
            await updateMathInputValue({
                latex: n,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await expectTexts(core, resolvePathToNodeIdx, {
                p: p,
                pSum: sum,
                pCount: count,
                pIndex: index,
            });
            await expectRenderedText(core, resolvePathToNodeIdx, ["p"]);
        }
    });

    it("collect gathers the entries of lists among what it collects", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="2" />
    <group name="g">
      <number>1</number>
      <numberList name="nl">5 $mi 7</numberList>
      <sequence from="1" to="$mi" />
      <cumulativeSum>1 2</cumulativeSum>
      <math>x</math>
    </group>
    <p name="pn"><collect componentType="number" from="$g" name="cn" /></p>
    <p name="pm"><collect componentType="math" from="$g" name="cm" /></p>
    <p name="pCount"><count>$cn</count></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pn: "1, 5, 2, 7, 1, 2",
            pm: "1, 3, x",
            pCount: "6",
        });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            pn: "1, 5, 3, 7, 1, 2, 3",
            pCount: "7",
        });
    });

    // As before the list operators became list components (#2164), which
    // counted an operator's results as one item.
    it("collect counts the entries of a list for maxNumber and an index", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="2" />
    <group name="g"><cumulativeSum>1 2 3</cumulativeSum><math>x</math></group>
    <p name="pMax"><collect componentType="math" from="$g" maxNumber="2" /></p>
    <p name="pAll"><collect componentType="math" from="$g" name="c" /></p>
    <p name="pIndex">$c[2] $c[4]</p>
    <group name="g2"><number>1</number><numberList>5 $mi 7</numberList><sequence from="1" to="$mi" /></group>
    <p name="pn"><collect componentType="number" from="$g2" name="cn" /></p>
    <p name="pn4">$cn[4] $cn[6]</p>
    <p name="pnMax"><collect componentType="number" from="$g2" maxNumber="3" /></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pMax: "1, 3",
            pAll: "1, 3, 6, x",
            pIndex: "3 x",
            pn: "1, 5, 2, 7, 1, 2",
            pn4: "7 2",
            pnMax: "1, 5, 2",
        });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            pn: "1, 5, 3, 7, 1, 2, 3",
            pn4: "7 2",
            pnMax: "1, 5, 3",
        });
    });

    it("a collect that stays a composite counts the entries of a list too", async () => {
        // `styleNumber` is passed on to the copies, so these stay composites.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="g"><cumulativeSum>1 2 3</cumulativeSum><math>x</math></group>
    <p name="pMax"><collect componentType="math" from="$g" maxNumber="2" styleNumber="2" name="cMax" /></p>
    <p name="pAll"><collect componentType="math" from="$g" styleNumber="2" name="c" /></p>
    <p name="pIndex">$c[2] $c[4]</p>
    <p name="pStyle">$c[1].styleNumber $c[4].styleNumber</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["cMax", "c"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].componentType,
                name,
            ).eq("collect");
        }
        await expectTexts(core, resolvePathToNodeIdx, {
            pMax: "1, 3",
            pAll: "1, 3, 6, x",
            pIndex: "3 x",
            pStyle: "2 2",
        });
    });

    it("collected values are shown as their sources show them", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <styleDefinition styleNumber="2" lineColor="red" textColor="red" />
    </setup>
    <section name="s">
      <math name="m1" displayDigits="2">3.14159265</math>
      <math name="m2" styleNumber="2">2.718281828</math>
      <math name="m3" hide>x</math>
      <math name="m4" renderMode="display">y</math>
      <number name="n1" displayDecimals="1">1.2345</number>
      <text name="t1" styleNumber="2">fig</text>
    </section>
    <p name="pm"><collect componentType="math" from="$s" /></p>
    <p name="pn"><collect componentType="number" from="$s" /></p>
    <p name="pt"><collect componentType="text" from="$s" /></p>
    <p name="pm2"><collect componentType="math" from="$s" displayDigits="5" /></p>
    `,
        });

        expect(await drawn(core, resolvePathToNodeIdx, "pm")).eqls([
            {
                rendererType: "math",
                shown: "3.1",
                textColor: "black",
                renderMode: "inline",
            },
            {
                rendererType: "math",
                shown: "2.72",
                textColor: "red",
                renderMode: "inline",
            },
            {
                rendererType: "math",
                shown: "y",
                textColor: "black",
                renderMode: "display",
            },
        ]);
        expect(await drawn(core, resolvePathToNodeIdx, "pn")).eqls([
            { rendererType: "number", shown: "1.2", textColor: "black" },
        ]);
        expect(await drawn(core, resolvePathToNodeIdx, "pt")).eqls([
            { rendererType: "text", shown: "fig", textColor: "red" },
        ]);
        expect(
            (await drawn(core, resolvePathToNodeIdx, "pm2")).map(
                (x: any) => x.shown,
            ),
        ).eqls(["3.1416", "2.7183", "y"]);
    });

    it("a value written to a collected value goes to its source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s">
      <math name="m1">x</math>
      <number name="n1">3</number>
      <text name="t1">apple</text>
      <boolean name="b1">true</boolean>
      <math name="mFixed" fixed>z</math>
    </section>
    <p name="pcm"><collect componentType="math" from="$s" name="cm" /></p>
    <collect componentType="number" from="$s" name="cn" />
    <collect componentType="text" from="$s" name="ct" />
    <collect componentType="boolean" from="$s" name="cb" />
    <mathInput name="mi" bindValueTo="$cm[1]" />
    <mathInput name="miFixed" bindValueTo="$cm[2]" />
    <mathInput name="ni" bindValueTo="$cn[1]" />
    <textInput name="ti" bindValueTo="$ct[1]" />
    <booleanInput name="bi" bindValueTo="$cb[1]" />
    `,
        });

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputValue({
            latex: "w",
            componentIdx: await resolvePathToNodeIdx("miFixed"),
            core,
        });
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("ni"),
            core,
        });
        await updateTextInputValue({
            text: "kiwi",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            m1: "y",
            mFixed: "z",
            n1: "5",
            t1: "kiwi",
            pcm: "y, z",
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "b1")).value,
        ).eq(false);
    });

    it("collect from a hidden section and of hidden values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="h" />
    <section name="s" hide>
      <number>1</number>
      <number hide="$h">2</number>
    </section>
    <p name="p"><collect componentType="number" from="$s" name="c" /></p>
    <p name="pHidden"><collect componentType="number" from="$s" hide="$h" /></p>
    `,
        });

        const shown = async (name: string) =>
            (await drawn(core, resolvePathToNodeIdx, name)).map(
                (x: any) => x.shown,
            );
        expect(await shown("p")).eqls(["1", "2"]);
        expect(await shown("pHidden")).eqls(["1", "2"]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        expect(await shown("p")).eqls(["1"]);
        expect(await shown("pHidden")).eqls([]);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        expect(await shown("p")).eqls(["1", "2"]);
        expect(await shown("pHidden")).eqls(["1", "2"]);
    });

    it("a collected text in a graph is drawn at its source's anchor", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g1">
      <text name="t" anchor="(3,4)">A</text>
    </graph>
    <graph name="g2">
      <collect componentType="text" from="$g1" name="c" />
    </graph>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        const children = rendererState[
            await resolvePathToNodeIdx("g2")
        ].childrenInstructions.filter(
            (child: any) => typeof child === "object" && child,
        );
        expect(children.length).eq(1);
        expect(rendererState[children[0].componentIdx].stateValues.anchor).eqls(
            ["vector", 3, 4],
        );
    });

    it("sort values of each type", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="5" />
    <numberList name="nl">7 2</numberList>
    <math name="m">$mi</math>
    <p name="pn"><sort name="sn">3 1 $mi 2</sort></p>
    <p name="pm"><sort name="sm"><math>e</math><math>pi</math><math>1</math></sort></p>
    <p name="pt"><sort name="st">kiwi apple fig</sort></p>
    <p name="pb"><sort name="sb" type="boolean">true false true</sort></p>
    <p name="pl"><sort name="sl">$nl 4 $nl[1]</sort></p>
    <p name="pRef"><sort name="sr">$m 3 $nl</sort></p>
    <p name="pIndex">$sn[2] $sl[4] $st[1]</p>
    <p name="pCopy">$sn</p>
    <p name="pSum"><sum>$sn</sum></p>
    <math name="mSm">$sm</math>
    <p name="nlSl"><numberList>$sl 0</numberList></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            pn: "1, 2, 3, 5",
            pm: "1, e, π",
            pt: "apple, fig, kiwi",
            pb: "false, true, true",
            pl: "2, 4, 7, 7",
            pRef: "2, 3, 5, 7",
            pIndex: "2 7 apple",
            pCopy: "1, 2, 3, 5",
            pSum: "11",
            mSm: "1, e, π",
            nlSl: "2, 4, 7, 7, 0",
        });
        await expectRenderedText(core, resolvePathToNodeIdx, [
            "pn",
            "pm",
            "pt",
            "pb",
            "pl",
        ]);

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            pn: "0, 1, 2, 3",
            pRef: "0, 2, 3, 7",
            pIndex: "1 7 apple",
            pCopy: "0, 1, 2, 3",
            pSum: "6",
        });
        await expectRenderedText(core, resolvePathToNodeIdx, ["pn", "pRef"]);
    });

    it("sorted entries keep the display settings of their sources", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl" displayDigits="2">3.14159 1.41421</numberList>
    <p name="p1"><sort><math displayDigits="5">3.14159265</math><math>2.718281828</math></sort></p>
    <p name="p2"><sort>$nl</sort></p>
    <p name="p3"><sort>$nl 2.71828</sort></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "2.72, 3.1416",
            p2: "1.4, 3.1",
            p3: "1.4, 2.72, 3.1",
        });
    });

    it("a value written to a sorted entry goes to its source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="a">5</number>
    <number name="b">1</number>
    <p name="pnl"><numberList name="nl">3 8</numberList></p>
    <p name="p"><sort name="s">$a $b $nl</sort></p>
    <mathInput name="mi1" bindValueTo="$s[1]" />
    <mathInput name="mi4" bindValueTo="$s[4]" />
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, { p: "1, 3, 5, 8" });

        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            b: "9",
            p: "3, 5, 8, 9",
        });

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("mi4"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            b: "4",
            pnl: "3, 8",
            p: "3, 4, 5, 8",
        });
    });

    it("a mix of numbers and maths is sorted as before", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><sort><number>3</number><math>2.5</math><number displayDigits="1">1.23</number></sort></p>
    <p name="p2"><sort><text>b</text><number>3</number></sort></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "1, 2.5, 3",
            p2: "3, b",
        });
    });

    it("shuffle values of each type under a fixed variant", async () => {
        const doenetML = `
    <numberList name="nl">7 8</numberList>
    <p name="pn"><shuffle name="sn">1 2 3 4 5</shuffle></p>
    <p name="pt"><shuffle name="st">a b c d e</shuffle></p>
    <p name="pm"><shuffle name="sm"><math>x</math><math>y</math><math>z</math></shuffle></p>
    <p name="pl"><shuffle name="sl">$nl 9</shuffle></p>
    <p name="pIndex">$sn[1] $st[5]</p>
    <p name="pCopy">$sn</p>
    <p name="pSum"><sum>$sn</sum></p>
    `;

        const seen = new Set<string>();
        for (const variantIndex of [1, 2, 3, 4]) {
            const results: string[] = [];
            for (let attempt = 0; attempt < 2; attempt++) {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML,
                    requestedVariantIndex: variantIndex,
                });
                const pn = (
                    await stateValuesOf(core, resolvePathToNodeIdx, "pn")
                ).text;
                const pt = (
                    await stateValuesOf(core, resolvePathToNodeIdx, "pt")
                ).text;
                const pm = (
                    await stateValuesOf(core, resolvePathToNodeIdx, "pm")
                ).text;
                const pl = (
                    await stateValuesOf(core, resolvePathToNodeIdx, "pl")
                ).text;
                expect(pn.split(", ").sort()).eqls(["1", "2", "3", "4", "5"]);
                expect(pt.split(", ").sort()).eqls(["a", "b", "c", "d", "e"]);
                expect(pm.split(", ").sort()).eqls(["x", "y", "z"]);
                expect(pl.split(", ").sort()).eqls(["7", "8", "9"]);
                await expectTexts(core, resolvePathToNodeIdx, {
                    pIndex: `${pn.split(", ")[0]} ${pt.split(", ")[4]}`,
                    pCopy: pn,
                    pSum: "15",
                });
                await expectRenderedText(core, resolvePathToNodeIdx, [
                    "pn",
                    "pt",
                    "pm",
                    "pl",
                ]);
                results.push([pn, pt, pm, pl].join("|"));
            }
            expect(results[0]).eq(results[1]);
            seen.add(results[0]);
        }
        expect(seen.size).greaterThan(1);
    });

    it("a value written to a shuffled entry goes to its source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="a">5</number>
    <p name="pnl"><numberList name="nl">3 8</numberList></p>
    <p name="p"><shuffle name="s">$a $nl</shuffle></p>
    <p name="pFirst">$s[1]</p>
    <mathInput name="mi1" bindValueTo="$s[1]" />
    `,
        });

        const first = (
            await stateValuesOf(core, resolvePathToNodeIdx, "pFirst")
        ).text;
        const order = (
            await stateValuesOf(core, resolvePathToNodeIdx, "p")
        ).text.split(", ");

        await updateMathInputValue({
            latex: "11",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            pFirst: "11",
            p: ["11", ...order.slice(1)].join(", "),
        });
        if (first === "5") {
            await expectTexts(core, resolvePathToNodeIdx, { a: "11" });
        } else {
            await expectTexts(core, resolvePathToNodeIdx, {
                a: "5",
                pnl: first === "3" ? "11, 8" : "3, 11",
            });
        }
    });

    it("the properties of a collected value are those of its source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s">
      <math name="m" styleNumber="2" anchor="(1,2)">x</math>
      <text name="t" hide>a</text>
      <text>b</text>
    </section>
    <collect name="c" componentType="math" from="$s" />
    <p name="p1">$c[1].styleNumber $c[1].anchor $c.styleNumber $c[1].text</p>
    <collect name="ct" componentType="text" from="$s" />
    <p name="p2">[$ct]</p>
    <p name="p3">[$ct[1]] [$ct[2]] $ct.hide $ct[1].hidden</p>
    <collect name="ct2" componentType="text" from="$s" hide="false" />
    <p name="p4">[$ct2] [$ct2[1]]</p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "2 (1, 2) 2 x",
            p2: "[b]",
            p3: "[] [b] true, false true",
            p4: "[a, b] [a]",
        });
    });

    it("a sorted or shuffled reference to a hidden value is hidden", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="a" hide>5</number>
    <number name="b">3</number>
    <text name="t" hide>q</text>
    <p name="p1">[<sort>$a 1 $b</sort>]</p>
    <p name="p2">[<shuffle>$a $b</shuffle>]</p>
    <p name="p3">[<sort name="st">$t z</sort>] [$st[2]]</p>
    <p name="p4">[<sort><number hide>4</number><number>2</number></sort>]</p>
    <math name="m"><sort>$a 1 $b</sort></math>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "[1, 3]",
            p2: "[3]",
            p3: "[z] [z]",
            p4: "[2]",
            m: "1, 3, 5",
        });
    });

    it("a sort or shuffle of a list form hides the entries it hides", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <styleDefinition styleNumber="2" textColor="red" />
    </setup>
    <booleanInput name="h" prefill="true" />
    <section name="s">
      <number hide="$h">3</number>
      <number styleNumber="2">1</number>
      <number>2</number>
    </section>
    <collect componentType="number" from="$s" name="c" />
    <collect componentType="number" from="$s" name="cShown" hide="false" />
    <section name="hiddenSection" hide>
      <collect componentType="number" from="$s" name="cInHidden" />
    </section>
    <sort name="sa"><number hide="$h">7</number><number>6</number></sort>
    <p name="p1">[<sort>$c</sort>]</p>
    <p name="p2">[<shuffle>$c</shuffle>]</p>
    <p name="p3">[<sort>$sa 5</sort>]</p>
    <p name="p4">[<sort><sort><number hide="$h">9</number><number>8</number></sort><number>4</number></sort>]</p>
    <p name="p5">[<sort>$cShown</sort>]</p>
    <p name="p6">[<sort>$cInHidden</sort>]</p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "[1, 2]",
            p2: "[2, 1]",
            p3: "[5, 6]",
            p4: "[4, 8]",
            p5: "[1, 2, 3]",
            p6: "[1, 2]",
        });
        expect(await drawn(core, resolvePathToNodeIdx, "p1")).eqls([
            { rendererType: "number", shown: "1", textColor: "red" },
            { rendererType: "number", shown: "2", textColor: "black" },
        ]);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "[1, 2, 3]",
            p2: "[2, 3, 1]",
            p3: "[5, 6, 7]",
            p4: "[4, 8, 9]",
            p5: "[1, 2, 3]",
            p6: "[1, 2, 3]",
        });
        await expectRenderedText(core, resolvePathToNodeIdx, ["p1", "p3"]);
    });

    it("a reference to a hidden collect, or to a hidden entry, is hidden", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="h" prefill="true" />
    <section name="s">
      <number hide="$h">3</number>
      <number>1</number>
      <number>5</number>
    </section>
    <collect componentType="number" from="$s" name="c" />
    <collect componentType="number" from="$s" name="ch" hide />
    <collect componentType="number" from="$s" name="cs" hide="false" />
    <sort name="sa"><number hide="$h">7</number><number>6</number></sort>
    <section name="refs"><p>$c[1] $c[2]</p></section>
    <p name="p1">[$ch]</p>
    <p name="p2">[$cs]</p>
    <p name="p3">[$c]</p>
    <p name="p4">[<number extend="$c[1]" />]</p>
    <p name="p5">[<number copy="$c[1]" />]</p>
    <p name="p6">[<group>$c[1] $c[2]</group>]</p>
    <p name="p7">[<sort>$c[1] $c[2]</sort>]</p>
    <p name="p8">[<sort>$c[1] 0</sort>]</p>
    <p name="p9">[<collect componentType="number" from="$refs" />]</p>
    <p name="p10">[<number extend="$cs[1]" />]</p>
    <p name="p11">[<number extend="$sa[2]" />]</p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "[]",
            p2: "[3, 1, 5]",
            p3: "[1, 5]",
            p4: "[]",
            p5: "[]",
            p6: "[ 1]",
            p7: "[1]",
            p8: "[0]",
            p9: "[1]",
            p10: "[3]",
            p11: "[]",
        });

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "[]",
            p3: "[3, 1, 5]",
            p4: "[3]",
            p6: "[3 1]",
            p7: "[1, 3]",
            p8: "[0, 3]",
            p9: "[3, 1]",
            p11: "[7]",
        });
    });

    it("an entry read by itself is shown as its source, or as the list sets", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <styleDefinition styleNumber="3" textColor="green" />
    </setup>
    <section name="s">
      <number>1</number>
      <number styleNumber="3">4</number>
      <math styleNumber="3" renderMode="display">x</math>
      <number hide>9</number>
    </section>
    <collect componentType="number" from="$s" name="c" />
    <collect componentType="math" from="$s" name="cm" />
    <section name="s2">
      <p><collect componentType="number" from="$s" hide="false" /></p>
    </section>
    <p name="p1">$c[2]</p>
    <p name="p2"><number extend="$c[2]" /></p>
    <p name="p3"><sort>$c[2] $c[1]</sort></p>
    <p name="p4">$cm[1]</p>
    <p name="p5"><math extend="$cm[1]" /></p>
    <p name="p6"><collect componentType="number" from="$s2" /></p>
    `,
        });

        const green4 = {
            rendererType: "number",
            shown: "4",
            textColor: "green",
        };
        const black1 = {
            rendererType: "number",
            shown: "1",
            textColor: "black",
        };
        const displayX = {
            rendererType: "math",
            shown: "x",
            textColor: "green",
            renderMode: "display",
        };
        expect(await drawn(core, resolvePathToNodeIdx, "p1")).eqls([green4]);
        expect(await drawn(core, resolvePathToNodeIdx, "p2")).eqls([green4]);
        expect(await drawn(core, resolvePathToNodeIdx, "p3")).eqls([
            black1,
            green4,
        ]);
        // A drawn reference to an entry is drawn in its source's style.
        expect(
            (await drawn(core, resolvePathToNodeIdx, "p4")).map(
                ({ shown, textColor }: any) => ({ shown, textColor }),
            ),
        ).eqls([{ shown: "x", textColor: "green" }]);
        expect(await drawn(core, resolvePathToNodeIdx, "p5")).eqls([displayX]);
        expect(await drawn(core, resolvePathToNodeIdx, "p6")).eqls([
            black1,
            green4,
            { rendererType: "number", shown: "9", textColor: "black" },
        ]);
    });

    it("a copy of a collect, sort or shuffle reads the same sources", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <styleDefinition styleNumber="3" textColor="green" />
    </setup>
    <mathInput name="mi" prefill="7" />
    <booleanInput name="bi" />
    <section name="s">
      <number hide="$bi">3</number>
      <number styleNumber="3">4</number>
      <number>$mi</number>
      <math renderMode="display" displayDigits="2">1.23456</math>
    </section>
    <p name="pc"><collect componentType="number" from="$s" name="c" /></p>
    <p name="pcc"><collect copy="$c" name="cc" /></p>
    <p name="pcm"><collect copy="$cm" /></p>
    <collect componentType="math" from="$s" name="cm" />
    <p name="ps"><sort name="srt"><number hide="$bi">9</number><number styleNumber="3">2</number><number>$mi</number></sort></p>
    <p name="psc"><sort copy="$srt" /></p>
    <p name="pshc"><shuffle copy="$sh" /></p>
    <shuffle name="sh"><number styleNumber="3">5</number><number hide>6</number></shuffle>
    <repeatForSequence length="1" name="r"><p name="q"><collect componentType="number" from="$s" /></p></repeatForSequence>
    <repeatForSequence copy="$r" name="r2" />
    <mathInput name="w" bindValueTo="$cc[3]" />
    `,
        });

        const number = (shown: string, textColor = "black") => ({
            rendererType: "number",
            shown,
            textColor,
        });
        async function expectDrawn(entries: Record<string, any[]>) {
            for (const [name, expected] of Object.entries(entries)) {
                expect(
                    await drawn(core, resolvePathToNodeIdx, name),
                    name,
                ).eqls(expected);
            }
        }

        // A copy shows each value as its source shows itself.
        await expectDrawn({
            pcc: [number("3"), number("4", "green"), number("7")],
            pcm: [
                {
                    rendererType: "math",
                    shown: "1.2",
                    textColor: "black",
                    renderMode: "display",
                },
            ],
            psc: [number("2", "green"), number("7"), number("9")],
            pshc: [number("5", "green")],
            "r2[1].q": [number("3"), number("4", "green"), number("7")],
        });

        // It follows the sources as they change.
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await expectDrawn({
            pcc: [number("4", "green"), number("1")],
            psc: [number("1"), number("2", "green")],
            "r2[1].q": [number("4", "green"), number("1")],
        });

        // A value written to it goes to the source.
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        await expectDrawn({
            pc: [number("4", "green"), number("8")],
            pcc: [number("4", "green"), number("8")],
        });
    });

    it("a copy of an extend that holds a list form reads the same sources", async () => {
        const doenetML = `
    <setup>
      <styleDefinition styleNumber="3" textColor="green" />
    </setup>
    <mathInput name="mi" prefill="7" />
    <section name="s">
      <number hide>3</number>
      <number styleNumber="3">4</number>
      <number>$mi</number>
    </section>
    <p name="p"><sort name="srt"><number hide>9</number><number styleNumber="3">2</number><number>$mi</number></sort></p>
    <p extend="$p" name="pe" />
    <p copy="$pe" name="pec" />
    <section name="sc"><p name="q"><collect componentType="number" from="$s" name="c" /></p></section>
    <section extend="$sc" name="sce" />
    <section copy="$sce" name="scec" />
    <mathInput name="w" bindValueTo="$pec.srt[1]" />
    `;
        const first = await createTestCore({ doenetML });
        const { core, resolvePathToNodeIdx } = first;

        const number = (shown: string, textColor = "black") => ({
            rendererType: "number",
            shown,
            textColor,
        });
        async function expectDrawn(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            entries: Record<string, any[]>,
        ) {
            for (const [name, expected] of Object.entries(entries)) {
                expect(
                    await drawn(core, resolvePathToNodeIdx, name),
                    name,
                ).eqls(expected);
            }
        }

        // A copy shows each value as its source shows itself. (A collect
        // in an extend shows its values, so a copy of it does too.)
        await expectDrawn(core, resolvePathToNodeIdx, {
            pec: [number("2", "green"), number("7")],
            "scec.q": [number("4", "green"), number("7")],
        });

        // It follows the sources, and a value written to it goes to the
        // source (`$mi`).
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        const afterWrite = {
            p: [number("2", "green"), number("5")],
            pec: [number("2", "green"), number("5")],
            "scec.q": [number("4", "green"), number("5")],
        };
        await expectDrawn(core, resolvePathToNodeIdx, afterWrite);

        // And it is the same after a reload.
        await core.saveImmediately();
        const second = await createTestCore({
            doenetML,
            initialState: first.scoreState.state as string,
        });
        await expectDrawn(second.core, second.resolvePathToNodeIdx, afterWrite);
    });

    it("a sort or shuffle of a type built on a value type keeps the type", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <interval name="i">(4,5)</interval>
    <p name="ps"><sort name="s"><interval>(1,3)</interval><interval>[0,2]</interval></sort></p>
    <p name="psh"><shuffle name="sh"><integer>3.2</integer><integer>1</integer></shuffle></p>
    <p name="pr"><sort name="sr">$i <interval>[0,1)</interval></sort></p>
    <p name="pl">[<intervalList>$s</intervalList>]</p>
    <p name="pc">[<collect componentType="interval" from="$ps" />]</p>
    <p name="pcr">[<collect componentType="interval" from="$pr" />]</p>
    <p name="pci">[<collect componentType="integer" from="$psh" />]</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["s", "sh", "sr"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].componentType,
                name,
            ).not.match(/List$/);
        }
        await expectTexts(core, resolvePathToNodeIdx, {
            ps: "(1, 3), [0, 2]",
            pr: "(4, 5), [0, 1)",
            pl: "[(1, 3), [0, 2]]",
            pc: "[(1, 3), [0, 2]]",
            pcr: "[(4, 5), [0, 1)]",
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "pci")).text,
        ).match(/^\[(1, 3|3, 1)\]$/);
    });

    it("sort reads text as values of the type it looks like", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><sort>10 9 100 2</sort></p>
    <p name="p2"><sort>b a 10 2</sort></p>
    <p name="p3"><sort type="math">x 2 (1,2)</sort></p>
    <p name="p4"><sort type="boolean">true false x=x</sort></p>
    <p name="p5"><sort type="text">10 9 100</sort></p>
    <p name="p6"><sort>pi 3 sqrt(10)</sort></p>
    <p name="p7"><sort>1/2 0.4</sort></p>
    <text name="q">q</text>
    <p name="p8"><sort>$q z a</sort></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "2, 9, 10, 100",
            p2: "10, 2, a, b",
            p3: "(1, 2), 2, x",
            p4: "false, true, true",
            p5: "10, 100, 9",
            p6: "3, 3.14, 3.16",
            p7: "0.4, 0.5",
            p8: "a, q, z",
        });
    });

    it("shuffle gives the same order for each variant", async () => {
        const doenetML = `
    <p name="p1"><shuffle>a b c d e f</shuffle></p>
    <p name="p2"><shuffle><math>x</math><math>y</math><math>z</math></shuffle></p>
    <numberList name="nl">1 2 3</numberList>
    <p name="p3"><shuffle>$nl 9</shuffle></p>
    <p name="p4"><shuffle type="number">5 6 7 8</shuffle></p>
    <number name="a">1</number><number name="b">2</number>
    <p name="p5"><shuffle>$a $b</shuffle></p>
    <p name="p6"><shuffle><text>q</text> <text>r</text> <text>s</text></shuffle></p>
    `;

        const expected: Record<number, Record<string, string>> = {
            1: {
                p1: "d, a, e, f, b, c",
                p2: "y, z, x",
                p3: "2, 1, 3, 9",
                p4: "6, 8, 7, 5",
                p5: "2, 1",
                p6: "s, r, q",
            },
            2: {
                p1: "c, b, d, e, a, f",
                p2: "y, x, z",
                p3: "1, 9, 3, 2",
                p4: "8, 5, 6, 7",
                p5: "2, 1",
                p6: "q, r, s",
            },
            3: {
                p1: "b, d, c, a, e, f",
                p2: "y, x, z",
                p3: "9, 3, 1, 2",
                p4: "6, 5, 7, 8",
                p5: "2, 1",
                p6: "r, s, q",
            },
        };

        for (const [variantIndex, texts] of Object.entries(expected)) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: Number(variantIndex),
            });
            await expectTexts(core, resolvePathToNodeIdx, texts);
        }
    });

    it("an empty collect, and sort in parents that read values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m"><sort>3 1 2</sort></math>
    <math name="m2"><sort>3 1 2</sort> + 1</math>
    <number name="n"><sum><sort>3 1</sort></sum></number>
    <text name="t"><sort>b a</sort></text>
    <section name="empty" />
    <p name="pe">[<collect componentType="math" from="$empty" />]</p>
    <math name="me"><collect componentType="math" from="$empty" /></math>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            m: "1, 2, 3",
            m2: "(1, 2, 3) + 1",
            n: "4",
            t: "a, b",
            pe: "[]",
            me: "＿",
        });
    });

    it("a property of an entry read through another list or a reference is its source's", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="src">
      <math name="m" anchor="(1,2)" styleNumber="2">x</math>
      <math>y</math>
    </section>
    <section name="sec"><collect name="c" componentType="math" from="$src" /></section>
    <collect name="d" componentType="math" from="$sec" />
    <p name="p1">$c[1].anchor | $d[1].anchor | $d[1].styleNumber</p>
    <sort name="s">$c</sort>
    <p name="p2">$s[1].anchor $s[2].anchor | $s[1].styleNumber</p>
    <sort name="s2">$m z</sort>
    <p name="p3">$s2[1].anchor</p>
    <shuffle name="sh">$m</shuffle>
    <p name="p4">$sh[1].anchor</p>
    <sort name="s3">$m</sort>
    <p name="p5">$s3[1].anchor</p>
    <sort name="s4"><sort>$m z</sort></sort>
    <p name="p6">$s4[1].anchor</p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "(1, 2) | (1, 2) | 2",
            p2: "(1, 2) (0, 0) | 2",
            p3: "(1, 2)",
            p4: "(1, 2)",
            p5: "(1, 2)",
            p6: "(1, 2)",
        });
    });

    it("a copy that changes what a sort or shuffle holds keeps it a composite", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sort name="s"><number>10</number><number>9</number><number>100</number></sort>
    <p name="p0">$s</p>
    <p name="p1"><sort copy="$s" sortByProp="text" /></p>
    <shuffle name="sh"><number>1</number><number>2</number></shuffle>
    <p name="p2"><shuffle extend="$sh" type="text" /></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p0: "9, 10, 100",
            p1: "10, 100, 9",
        });
        const shuffled = (await stateValuesOf(core, resolvePathToNodeIdx, "p2"))
            .text;
        expect(shuffled.split(", ").sort()).eqls(["1", "2"]);
    });

    it("a chain of copies of a sort is a list at every step", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sort name="s">3 1 2</sort>
    <sort extend="$s" name="e" />
    <sort extend="$e" name="e2" />
    <p name="p1"><sort copy="$e" asList="false" /></p>
    <p name="p2"><sort extend="$e" asList="false" /></p>
    <p name="p3"><sort extend="$e2" asList="false" /></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p1: "123",
            p2: "123",
            p3: "123",
        });
    });

    it("a sort shown in a graph through an extend is drawn at its sources' anchors", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sort name="s"><math anchor="(3,4)">x</math><math anchor="(1,1)">y</math></sort>
    <sort extend="$s" name="e" />
    <graph name="g">$e</graph>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        function anchorsDrawnIn(idx: number): any[] {
            return (rendererState[idx]?.childrenInstructions ?? [])
                .filter((child: any) => child && typeof child === "object")
                .flatMap((child: any) =>
                    child.rendererType === "math"
                        ? [rendererState[child.componentIdx].stateValues.anchor]
                        : anchorsDrawnIn(child.componentIdx),
                );
        }
        expect(anchorsDrawnIn(await resolvePathToNodeIdx("g"))).eqls([
            ["vector", 3, 4],
            ["vector", 1, 1],
        ]);
    });

    it("a collect has no maximum number unless given, and takes every display setting", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="sec">
      <number>123456789012345678901234</number>
      <number>0.00000000000001234</number>
    </section>
    <collect name="c" componentType="number" from="$sec" />
    <collect name="c2" componentType="number" from="$sec" maxNumber="3" />
    <p name="p">[$c.maxNumber] [$c2.maxNumber]</p>
    <p name="p1"><collect name="c3" componentType="number" from="$sec" avoidScientificNotation /></p>
    `,
        });

        await expectTexts(core, resolvePathToNodeIdx, {
            p: "[NaN] [3]",
            p1: "123456789012345690000000, 0.0000000000000123",
        });
        // held as a list, not copied
        expect(
            (core as any).core._components[await resolvePathToNodeIdx("c3")]
                .constructor.listEntryComponentType,
        ).eq("number");
    });
});
