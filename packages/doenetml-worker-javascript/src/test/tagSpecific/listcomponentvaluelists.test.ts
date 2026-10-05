import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * `<numberList>`, `<mathList>`, `<textList>`, `<booleanList>` and
 * `<intervalList>` as list components (Doenet/DoenetML#2160): one component
 * that holds its values, which a parent reads, and the viewer draws, as one
 * child per value.
 */
describe("Value lists as list components @group4", async () => {
    async function textsOf(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: Record<string, string> = {};
        for (const name of names) {
            texts[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        return texts;
    }

    it("each kind of parent reads the values as children", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl">1 2.5 3</numberList>
    <mathList name="ml">x y+1 (a,b)</mathList>
    <textList name="tl">a b c</textList>
    <booleanList name="bl">true false true</booleanList>
    <intervalList name="il">(1,2) [3,4]</intervalList>
    <p name="pnl">$nl</p>
    <p name="pml">$ml</p>
    <p name="ptl">$tl</p>
    <p name="pbl">$bl</p>
    <p name="pil">$il</p>
    <math name="mathNl">$nl</math>
    <math name="mathMl">$ml + 1</math>
    <text name="textTl">$tl</text>
    <p name="sumNl"><sum>$nl</sum></p>
    <p name="countTl"><count>$tl</count></p>
    <numberList name="nl2">$nl 4</numberList>
    <mathList name="ml2">$ml z</mathList>
    <textList name="tl2">$tl d</textList>
    <booleanList name="bl2">$bl false</booleanList>
    <p name="pnl2">$nl2</p>
    <p name="pml2">$ml2</p>
    <p name="ptl2">$tl2</p>
    <p name="pbl2">$bl2</p>
    <p name="index">$nl[2] $ml[3] $tl[1] $bl[2] $il[2]</p>
    <p name="indexBy">$tl[$nl[1]]</p>
    <point name="P">($nl[1], $ml[1])</point>
    <p name="pP">$P</p>
    <p name="all"><boolean>$bl[1] and $bl[3]</boolean></p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "pnl",
                "pml",
                "ptl",
                "pbl",
                "pil",
                "mathNl",
                "mathMl",
                "textTl",
                "sumNl",
                "countTl",
                "pnl2",
                "pml2",
                "ptl2",
                "pbl2",
                "index",
                "indexBy",
                "pP",
                "all",
            ]),
        ).eqls({
            pnl: "1, 2.5, 3",
            pml: "x, y + 1, (a, b)",
            ptl: "a, b, c",
            pbl: "true, false, true",
            pil: "(1, 2), [3, 4]",
            mathNl: "1, 2.5, 3",
            mathMl: "(x, y + 1, (a, b)) + 1",
            textTl: "a, b, c",
            sumNl: "6.5",
            countTl: "3",
            pnl2: "1, 2.5, 3, 4",
            pml2: "x, y + 1, (a, b), z",
            ptl2: "a, b, c, d",
            pbl2: "true, false, true, false",
            index: "2.5 (a, b) a false [3, 4]",
            indexBy: "a",
            pP: "(1, x)",
            all: "true",
        });
    });

    it("a list of one is a single value", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="one">7</numberList>
    <mathList name="oneM">x</mathList>
    <textList name="oneT">hello</textList>
    <booleanList name="oneB">true</booleanList>
    <math name="m">2 $one</math>
    <number name="n">$one + 1</number>
    <math name="m2">$oneM^2</math>
    <text name="t">$oneT there</text>
    <boolean name="b">$oneB</boolean>
    <math name="dd" displayDigits="$one">1.23456789</math>
    <p name="index">$nl[$one]</p>
    <numberList name="nl">1 2 3 4 5 6 7 8</numberList>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "m",
                "n",
                "m2",
                "t",
                "b",
                "dd",
                "index",
            ]),
        ).eqls({
            m: "2 * 7",
            n: "8",
            m2: "x²",
            t: "hello there",
            b: "true",
            dd: "1.234568",
            index: "7",
        });
    });

    it("an empty list is nothing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="empty" />
    <mathList name="emptyM" />
    <textList name="emptyT" />
    <p name="p">a $empty b</p>
    <math name="m">$empty</math>
    <math name="m2">$emptyM + 1</math>
    <p name="sum"><sum>$empty</sum></p>
    <p name="sum2"><sum>$empty 2</sum></p>
    <text name="t">$emptyT</text>
    <p name="count"><count>$empty</count></p>
    <numberList name="nl">$empty 1</numberList>
    <p name="pnl">$nl</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "p",
                "m",
                "m2",
                "sum",
                "sum2",
                "t",
                "count",
                "pnl",
            ]),
        ).eqls({
            p: "a  b",
            m: "＿",
            m2: "＿ + 1",
            sum: "＿",
            sum2: "2",
            t: "",
            count: "＿",
            pnl: "1",
        });
    });

    it("a list mixing text, authored children and references", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="a">q</math>
    <number name="n">5</number>
    <text name="t">hi</text>
    <boolean name="bo">false</boolean>
    <mathList name="ml">x <math>y</math> $a $n z</mathList>
    <numberList name="nl">1 <number>2</number> $n <math>3+1</math> 6</numberList>
    <textList name="tl">a <text>b</text> $t c</textList>
    <booleanList name="bl">true <boolean>false</boolean> $bo</booleanList>
    <p name="pml">$ml</p>
    <p name="pnl">$nl</p>
    <p name="ptl">$tl</p>
    <p name="pbl">$bl</p>
    <p name="index">$ml[2] $ml[3] $nl[3] $tl[3] $bl[3]</p>
    <mathInput name="ma" bindValueTo="$a" />
    <mathInput name="mn" bindValueTo="$n" />
    `,
        });

        async function check(expected: Record<string, string>) {
            expect(
                await textsOf(core, resolvePathToNodeIdx, [
                    "pml",
                    "pnl",
                    "ptl",
                    "pbl",
                    "index",
                ]),
            ).eqls(expected);
        }

        await check({
            pml: "x, y, q, 5, z",
            pnl: "1, 2, 5, 4, 6",
            ptl: "a, b, hi, c",
            pbl: "true, false, false",
            index: "y q 5 hi false",
        });

        await updateMathInputValue({
            latex: "r",
            componentIdx: await resolvePathToNodeIdx("ma"),
            core,
        });
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("mn"),
            core,
        });
        await check({
            pml: "x, y, r, 9, z",
            pnl: "1, 2, 9, 4, 6",
            ptl: "a, b, hi, c",
            pbl: "true, false, false",
            index: "y r 9 hi false",
        });
    });

    it("a nested list contributes its entries, and mergeMathLists splits a list-valued math", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathList name="outer">a <mathList>b c</mathList> d</mathList>
    <numberList name="outerN">1 <numberList>2 3</numberList> 4</numberList>
    <math name="lm">1, 2, 3</math>
    <mathList name="merged">$lm</mathList>
    <mathList name="notMerged">$lm 4</mathList>
    <mathList name="mergedForced" mergeMathLists>$lm 4</mathList>
    <numberList name="mergedN">$lm</numberList>
    <p name="pouter">$outer</p>
    <p name="pouterN">$outerN</p>
    <p name="pmerged">$merged</p>
    <p name="pnotMerged">$notMerged</p>
    <p name="pmergedForced">$mergedForced</p>
    <p name="pmergedN">$mergedN</p>
    <p name="index">$outer[3] $outerN[3] $merged[2] $mergedForced[4] $mergedN[3]</p>
    <p name="counts"><count>$outer</count> <count>$merged</count> <count>$notMerged</count> <count>$mergedForced</count></p>
    <mathInput name="mi" bindValueTo="$merged[2]" />
    <mathInput name="mi2" bindValueTo="$outer[2]" />
    `,
        });

        async function check(expected: Record<string, string>) {
            expect(
                await textsOf(core, resolvePathToNodeIdx, [
                    "pouter",
                    "pouterN",
                    "pmerged",
                    "pnotMerged",
                    "pmergedForced",
                    "pmergedN",
                    "index",
                    "counts",
                ]),
            ).eqls(expected);
        }

        await check({
            pouter: "a, b, c, d",
            pouterN: "1, 2, 3, 4",
            pmerged: "1, 2, 3",
            pnotMerged: "1, 2, 3, 4",
            pmergedForced: "1, 2, 3, 4",
            pmergedN: "1, 2, 3",
            index: "c 3 2 4 3",
            counts: "4 3 2 4",
        });

        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputValue({
            latex: "e",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check({
            pouter: "a, e, c, d",
            pouterN: "1, 2, 3, 4",
            pmerged: "1, 7, 3",
            pnotMerged: "1, 7, 3, 4",
            pmergedForced: "1, 7, 3, 4",
            pmergedN: "1, 7, 3",
            index: "c 3 7 4 3",
            counts: "4 3 2 4",
        });
    });

    it("a value written through an entry, before and after a reload", async () => {
        const doenetML = `
    <math name="a">q</math>
    <numberList name="nl">1 2 3</numberList>
    <mathList name="ml">x <math>y</math> $a</mathList>
    <textList name="tl">a b c</textList>
    <booleanList name="bl">true false</booleanList>
    <p name="pnl">$nl</p>
    <p name="pml">$ml</p>
    <p name="ptl">$tl</p>
    <p name="pbl">$bl</p>
    <p name="pa">$a</p>
    <mathInput name="mn" bindValueTo="$nl[2]" />
    <mathInput name="mm1" bindValueTo="$ml[1]" />
    <mathInput name="mm2" bindValueTo="$ml[2]" />
    <mathInput name="mm3" bindValueTo="$ml[3]" />
    <textInput name="ti" bindValueTo="$tl[3]" />
    <booleanInput name="bi" bindValueTo="$bl[2]" />
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );

        const names = ["pnl", "pml", "ptl", "pbl", "pa"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            pnl: "1, 2, 3",
            pml: "x, y, q",
            ptl: "a, b, c",
            pbl: "true, false",
            pa: "q",
        });

        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("mn"),
            core,
        });
        await updateMathInputValue({
            latex: "u",
            componentIdx: await resolvePathToNodeIdx("mm1"),
            core,
        });
        await updateMathInputValue({
            latex: "v",
            componentIdx: await resolvePathToNodeIdx("mm2"),
            core,
        });
        await updateMathInputValue({
            latex: "w",
            componentIdx: await resolvePathToNodeIdx("mm3"),
            core,
        });
        await updateTextInputValue({
            text: "zz",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });

        const written = {
            pnl: "1, 9, 3",
            pml: "u, v, w",
            ptl: "a, b, zz",
            pbl: "true, true",
            pa: "w",
        };
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls(written);

        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, names),
        ).eqls(written);
    });

    it("lists as attributes keep reading the values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl">3 4</numberList>
    <point name="P" xs="1 2" />
    <point name="Q" xs="$nl" />
    <polygon name="pg" vertices="(0,0) (1,0) (0,1)" />
    <p name="pP">$P</p>
    <p name="pQ">$Q</p>
    <p name="pv">$pg.vertices</p>
    <function name="f" domain="(0,1)">x^2</function>
    <p name="pd">$f.domain</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pP", "pQ", "pv", "pd"]),
        ).eqls({
            pP: "(1, 2)",
            pQ: "(3, 4)",
            pv: "(0, 0), (1, 0), (0, 1)",
            pd: "(0, 1)",
        });
    });

    it("display settings of the list and of an authored child", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathList name="ml" displayDigits="5">3.14159265 2.718281828 <math>1.41421356</math></mathList>
    <numberList name="nl" displayDecimals="1">3.14159265 2.718281828 <number>1.41421356</number></numberList>
    <p name="pml">$ml</p>
    <p name="pnl">$nl</p>
    <p name="index">$ml[1] $nl[3]</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pml", "pnl", "index"]),
        ).eqls({
            pml: "3.1416, 2.7183, 1.4142",
            pnl: "3.1, 2.7, 1.4",
            index: "3.1416 1.4",
        });
    });

    it("an authored child shows the display settings it sets, and the list's fill in the rest", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="a" displayDigits="5">1.41421356</math>
    <mathList name="ml" displayDigits="2">3.14159265 <math displayDigits="6">2.718281828</math> <math padZeros>1</math></mathList>
    <mathList name="refs" displayDigits="2">$a</mathList>
    <mathList name="refsNoSetting">$a</mathList>
    <p name="pml">$ml</p>
    <p name="prefs">$refs</p>
    <p name="prefsNoSetting">$refsNoSetting</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "pml",
                "prefs",
                "prefsNoSetting",
            ]),
        ).eqls({
            // the second child's own digits; the third's padding with the
            // list's digits
            pml: "3.1, 2.71828, 1.0",
            // the list's setting wins over what a reference reads
            prefs: "1.4",
            prefsNoSetting: "1.4142",
        });
    });

    it("the entries are drawn by the renderers of their types, with no component for a piece of text", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pn"><numberList name="nl">1 <number displayDigits="1">2.6</number></numberList></p>
    <p name="pb"><booleanList name="bl">true false</booleanList></p>
    <p name="pt"><textList name="tl">a b</textList></p>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        async function drawn(name: string) {
            return rendererState[
                await resolvePathToNodeIdx(name)
            ].childrenInstructions
                .filter((child: any) => typeof child === "object" && child)
                .map((child: any) => [
                    child.componentType,
                    child.rendererType,
                    child.id,
                    rendererState[child.componentIdx].stateValues.text,
                ]);
        }

        expect(await drawn("pn")).eqls([
            ["number", "number", "nl:1", "1"],
            ["number", "number", "nl:2", "3"],
        ]);
        expect(await drawn("pb")).eqls([
            ["boolean", "boolean", "bl:1", "true"],
            ["boolean", "boolean", "bl:2", "false"],
        ]);
        expect(await drawn("pt")).eqls([
            ["text", "text", "tl:1", "a"],
            ["text", "text", "tl:2", "b"],
        ]);

        // the text pieces make no component; the authored child is one
        const types = Object.values(
            await core.returnAllStateVariables(false, true),
        ).map((c: any) => c.componentType);
        expect(types.filter((t) => t === "number")).toHaveLength(1);
        expect(types.filter((t) => t === "text")).toHaveLength(0);
        expect(types.filter((t) => t === "boolean")).toHaveLength(0);
    });

    it("a reference to an array of values is one list, which takes writes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="P" displayDigits="2">(1.23456, 2.34567)</point>
    <cumulativeSum name="c">1 2 3</cumulativeSum>
    <p name="pxs">$P.xs</p>
    <p name="ptext">$c.text</p>
    <mathList name="l" extend="$P.xs" />
    <p name="pl">$l</p>
    <mathInput name="mi" bindValueTo="$l[2]" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const childTypes = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].activeChildren.map(
                (child: any) => child.componentType,
            );
        expect(await childTypes("pxs")).eqls(["mathList"]);
        expect(await childTypes("ptext")).eqls(["textList"]);

        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pxs", "ptext", "pl"]),
        ).eqls({ pxs: "1.2, 2.3", ptext: "1, 3, 6", pl: "1.2, 2.3" });

        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pxs", "pl"])).eqls({
            pxs: "1.2, 7",
            pl: "1.2, 7",
        });
    });

    it("a copy of a list holds its values as they are", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="x" />
    <mathList name="l">$mi <math displayDigits="5" name="h">3.14159265</math></mathList>
    <mathList name="c" copy="$l" />
    <p name="pl">$l</p>
    <p name="pc">$c</p>
    `,
        });

        expect(await textsOf(core, resolvePathToNodeIdx, ["pl", "pc"])).eqls({
            pl: "x, 3.1416",
            pc: "x, 3.1416",
        });
        // the copy holds the values, not the children
        expect(await resolvePathToNodeIdx("c.h")).eq(-1);

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pl", "pc"])).eqls({
            pl: "y, 3.1416",
            pc: "x, 3.1416",
        });
    });

    it("a value written to an entry of a copy is kept by the copy, before and after a reload", async () => {
        const doenetML = `
    <mathList name="ml">x <math>y</math> z</mathList>
    <mathList name="mc" copy="$ml" />
    <textList name="tl">a <text>b</text></textList>
    <textList name="tc" copy="$tl" />
    <booleanList name="bl">true false</booleanList>
    <booleanList name="bc" copy="$bl" />
    <intervalList name="il">(1,2) [3,4]</intervalList>
    <intervalList name="ic" copy="$il" />
    <p name="pml">$ml</p>
    <p name="pmc">$mc</p>
    <p name="ptc">$tc</p>
    <p name="pbc">$bc</p>
    <p name="pic">$ic</p>
    <mathInput name="m1" bindValueTo="$mc[1]" />
    <mathInput name="m2" bindValueTo="$mc[2]" />
    <textInput name="t2" bindValueTo="$tc[2]" />
    <booleanInput name="b2" bindValueTo="$bc[2]" />
    <mathInput name="i2" bindValueTo="$ic[2]" />
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        const names = ["pml", "pmc", "ptc", "pbc", "pic"];

        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await updateMathInputValue({
            latex: "r^2",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await updateTextInputValue({
            text: "zz",
            componentIdx: await resolvePathToNodeIdx("t2"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        await updateMathInputValue({
            latex: "(7,8)",
            componentIdx: await resolvePathToNodeIdx("i2"),
            core,
        });

        const written = {
            pml: "x, y, z",
            pmc: "q, r², z",
            ptc: "a, zz",
            pbc: "true, true",
            pic: "(1, 2), (7, 8)",
        };
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls(written);

        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, names),
        ).eqls(written);
    });

    it("a maxNumber below zero leaves no entries, and a fractional one keeps the whole entries below it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl" maxNumber="-1">1 2 3</numberList>
    <p name="p">$nl</p>
    <p name="n">$nl.numValues</p>
    <numberList name="nlf" maxNumber="2.5">1 2 3 4</numberList>
    <textList name="tlf" maxNumber="1.2">a b c</textList>
    <p name="pf">$nlf; $tlf</p>
    <p name="nf">$nlf.numValues $tlf.numValues</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, ["p", "n", "pf", "nf"]),
        ).eqls({
            p: "",
            n: "0",
            pf: "1, 2; a",
            nf: "2 1",
        });
    });

    it("text from a composite among the children shows, and a value written to it stays with it", async () => {
        const doenetML = `
    <booleanInput name="b" />
    <numberList name="nl">1 <conditionalContent><case condition="$b">2 3</case></conditionalContent> 4</numberList>
    <textList name="tl">p <conditionalContent><case condition="$b">c</case><else>c</else></conditionalContent> d</textList>
    <textList name="tr">x <repeat for="u v" valueName="w"><text>$w</text> q</repeat> y</textList>
    <p name="pnl">$nl</p>
    <p name="ptl">$tl</p>
    <p name="ptr">$tr</p>
    <mathInput name="mn" bindValueTo="$nl[2]" />
    <textInput name="tt" bindValueTo="$tl[2]" />
    <textInput name="tq" bindValueTo="$tr[5]" />
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        const names = ["pnl", "ptl", "ptr"];

        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            pnl: "1, 4",
            ptl: "p, c, d",
            ptr: "x, u, q, v, q, y",
        });

        // Written to `4`, to the `c` of the `<else>`, and to the second
        // iteration's `q`.
        await updateMathInputValue({
            latex: "40",
            componentIdx: await resolvePathToNodeIdx("mn"),
            core,
        });
        await updateTextInputValue({
            text: "X",
            componentIdx: await resolvePathToNodeIdx("tt"),
            core,
        });
        await updateTextInputValue({
            text: "Q",
            componentIdx: await resolvePathToNodeIdx("tq"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            pnl: "1, 40",
            ptl: "p, X, d",
            ptr: "x, u, q, v, Q, y",
        });

        // The case's text appears; the writes stay with their own text.
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        const withCase = {
            pnl: "1, 2, 3, 40",
            ptl: "p, c, d",
            ptr: "x, u, q, v, Q, y",
        };
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls(withCase);

        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, names),
        ).eqls(withCase);

        // A value written to the case's text stays with it.
        await updateTextInputValue({
            text: "Y",
            componentIdx: await reloaded.resolvePathToNodeIdx("tt"),
            core: reloaded.core,
        });
        await updateMathInputValue({
            latex: "20",
            componentIdx: await reloaded.resolvePathToNodeIdx("mn"),
            core: reloaded.core,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, names),
        ).eqls({
            pnl: "1, 20, 3, 40",
            ptl: "p, Y, d",
            ptr: "x, u, q, v, Q, y",
        });

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await reloaded.resolvePathToNodeIdx("b"),
            core: reloaded.core,
        });
        expect(
            (await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, names))
                .pnl,
        ).eqls("1, 40");
    });

    it("text beside an authored interval, or inside a group, is read", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><intervalList>(1,2) <interval>[3,4)</interval></intervalList></p>
    <p name="p2"><intervalList>(1,2) <group>[3,4]</group></intervalList></p>
    <p name="p3"><numberList>5 <group>6 7</group> 8</numberList></p>
    <p name="p4"><booleanList>true <group>false true</group></booleanList></p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, ["p1", "p2", "p3", "p4"]),
        ).eqls({
            p1: "(1, 2), [3, 4)",
            p2: "(1, 2), [3, 4]",
            p3: "5, 6, 7, 8",
            p4: "true, false, true",
        });
    });

    it("a second index reads a coordinate of a math entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <tupleList name="tl">(1, 2, 3) (4, 5, 6)</tupleList>
    <mathList name="ml">(a, b) c</mathList>
    <mathInput name="k" prefill="1"/>
    <p name="p1">$tl[1][2] $tl[2][3] $ml[1][1] $ml[2][1]</p>
    <p name="p2"><math>$ml[1][2]+1</math> <number>$tl[2][3]</number> $tl[2][$k]</p>
    <p name="p3"><numberList>$tl[1][3] $tl[2][3]</numberList> <math extend="$tl[1][2]"/></p>
    <p name="p4"><mathInput name="mi" bindValueTo="$tl[2][2]"/> $tl</p>
    `,
        });

        const names = ["p1", "p2", "p3", "p4"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            p1: "2 6 a c",
            p2: "b + 1 6 4",
            p3: "3, 6 2",
            p4: "5 (1, 2, 3), (4, 5, 6)",
        });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            p1: "2 6 a c",
            p2: "b + 1 6 6",
            p3: "3, 6 2",
            p4: "9 (1, 2, 3), (4, 9, 6)",
        });
    });

    it("a reference past the end of a list adds no value", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="l" maxNumber="$max">1 2 3</numberList>
    <mathInput name="max" prefill="2"/>
    <mathInput name="k" prefill="3"/>
    <mathList name="m"/>
    <textList name="t">a b</textList>
    <sequence name="s" length="2"/>
    <p name="p1"><numberList name="r">7 $l[$k] 9</numberList> $r.numValues</p>
    <p name="p2"><mathList>$m[1] x $m[2]</mathList> <textList>$t[3] c</textList></p>
    <p name="p3"><numberList>$s[4] 5 $s[2]</numberList></p>
    `,
        });

        const names = ["p1", "p2", "p3"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            p1: "7, 9 2",
            p2: "x c",
            p3: "5, 2",
        });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("max"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["p1"])).eqls({
            p1: "7, 3, 9 3",
        });

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["p1"])).eqls({
            p1: "7, 9 2",
        });

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["p1"])).eqls({
            p1: "7, 1, 9 3",
        });
    });

    it("a reference with nothing to read adds no value", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeatForSequence name="r" length="2" valueName="v"><number name="x">10$v</number></repeatForSequence>
    <p name="p1"><numberList name="a">0 $r.x 9</numberList> $a.numValues</p>
    <p name="p2"><mathList>0 $r.x <math>y</math></mathList> <textList>a $r.x b</textList></p>
    <mathInput name="mi" bindValueTo="$a[2]"/>
    `,
        });

        expect(await textsOf(core, resolvePathToNodeIdx, ["p1", "p2"])).eqls({
            p1: "0, 9 2",
            p2: "0, y a, b",
        });

        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["p1"])).eqls({
            p1: "0, 8 2",
        });
    });

    it("an entry read by itself is shown with the display settings it has in the list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="dd" prefill="6" />
    <mathList name="l"><math displayDigits="$dd">2.7182818</math> 3.14159265</mathList>
    <p name="pl">$l</p>
    <p name="pIndex">$l[1] $l[2]</p>
    <math name="m" copy="$l[1]" />
    <p name="pCopy">$m</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "pl",
                "pIndex",
                "pCopy",
            ]),
        ).eqls({
            pl: "2.71828, 3.14",
            pIndex: "2.71828 3.14",
            pCopy: "2.71828",
        });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("dd"),
            core,
        });
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pl", "pIndex"]),
        ).eqls({ pl: "2.7, 3.14", pIndex: "2.7 3.14" });
    });

    it("a copy of a list or of an entry takes the display settings it sets, and none the entry only has by default", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathList name="l"><math displayDigits="2">2.7182818</math> 3.14159265</mathList>
    <p name="copyList"><mathList copy="$l" displayDigits="4" /></p>
    <p name="extendList"><mathList extend="$l" displayDigits="4" /></p>
    <p name="copyEntry"><math copy="$l[2]" displayDecimals="1" /></p>
    <p name="inList"><mathList displayDigits="5"><math copy="$l[2]" /></mathList></p>
    <numberList name="n">3.14159265</numberList>
    <p name="copyNumber"><number copy="$n[1]" displayDecimals="1" /></p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "copyList",
                "extendList",
                "copyEntry",
                "inList",
                "copyNumber",
            ]),
        ).eqls({
            copyList: "2.718, 3.142",
            extendList: "2.718, 3.142",
            copyEntry: "3.1",
            inList: "3.1416",
            copyNumber: "3.1",
        });
    });

    it("a property of an entry is shown with the entry's display settings", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="dd" prefill="6" />
    <mathList name="ml"><math displayDigits="$dd">2.7182818</math> 3.14159</mathList>
    <numberList name="nl"><number displayDigits="$dd">2.7182818</number> 3.14159</numberList>
    <p name="pm">$ml[1].number $ml[2].number $ml[1].displayDigits</p>
    <p name="pn">$nl[1].math $nl[2].math</p>
    <p name="pAll">$ml.number</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pm", "pn", "pAll"]),
        ).eqls({
            pm: "2.71828 3.14 6",
            pn: "2.71828 3.14",
            pAll: "2.71828, 3.14",
        });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("dd"),
            core,
        });
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pm", "pn", "pAll"]),
        ).eqls({ pm: "2.7 3.14 2", pn: "2.7 3.14", pAll: "2.7, 3.14" });
    });
});
