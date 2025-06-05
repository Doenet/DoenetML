import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue, updateTextInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("TextList tag tests", async () => {
    async function test_textList({
        core,
        resolveComponentName,
        name,
        pName,
        text,
        texts,
    }: {
        core: PublicDoenetMLCore;
        resolveComponentName: (name: string, origin?: number) => number;
        name?: string;
        pName?: string;
        text?: string;
        texts?: string[];
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        if (text !== undefined && pName !== undefined) {
            expect(
                stateVariables[resolveComponentName(pName)].stateValues.text,
            ).eq(text);
        }

        if (texts !== undefined && name !== undefined) {
            expect(
                stateVariables[resolveComponentName(name)].stateValues.texts,
            ).eqls(texts);
        }
    }

    it("textList from string", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><textList name="tl1">a b </textList></p>
    `,
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl1",
            pName: "p",
            text: "a, b",
            texts: ["a", "b"],
        });
    });

    it("textList with text children", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p1"><textList name="tl1">
      <text>a</text>
      <text>b</text>
    </textList></p>

    <p name="p2"><textList name="tl2">
      <text>a</text><text>b</text>
    </textList></p>
    `,
        });

        let text = "a, b";
        let texts = ["a", "b"];

        await test_textList({
            core,
            resolveComponentName,
            name: "tl1",
            pName: "p1",
            text,
            texts,
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl2",
            pName: "p2",
            text,
            texts,
        });
    });

    it("textList with text and string children", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><textList name="tl1">
     hello there
      <text>apple</text> banana <text>strawberry</text>
    </textList></p>
    `,
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl1",
            pName: "p",
            text: "hello, there, apple, banana, strawberry",
            texts: ["hello", "there", "apple", "banana", "strawberry"],
        });
    });

    async function test_nested_and_inverse(
        core: PublicDoenetMLCore,
        resolveComponentName: (name: string, origin?: number) => number,
    ) {
        await test_textList({
            core,
            resolveComponentName,
            name: "tl1",
            pName: "p",
            text: "1, 2, 3, 4, 5, 6, 7, 8, 9",
            texts: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl2",
            texts: ["2", "3"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl3",
            texts: ["5", "6", "7", "8", "9"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl4",
            texts: ["5", "6", "7"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl5",
            texts: ["6", "7"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl6",
            texts: ["8", "9"],
        });

        // change values

        await updateTextInputValue({
            componentIdx: resolveComponentName("ti1"),
            text: "a",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti2"),
            text: "b",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti3"),
            text: "c",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti4"),
            text: "d",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti5"),
            text: "e",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti6"),
            text: "f",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti7"),
            text: "g",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti8"),
            text: "h",
            core,
        });
        await updateTextInputValue({
            componentIdx: resolveComponentName("ti9"),
            text: "i",
            core,
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl1",
            pName: "p",
            text: "a, b, c, d, e, f, g, h, i",
            texts: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl2",
            texts: ["b", "c"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl3",
            texts: ["e", "f", "g", "h", "i"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl4",
            texts: ["e", "f", "g"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl5",
            texts: ["f", "g"],
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl6",
            texts: ["h", "i"],
        });
    }

    it("textList with textList children, test inverse", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><textList name="tl1">
      <text>1</text>
      <textList name="tl2">2 3</textList>
      <text>4</text>
      <textList name="tl3">
        <textList name="tl4">
          <text>5</text>
          <textList name="tl5">6 7</textList>
        </textList>
        <textList name="tl6">8 9</textList>
      </textList>
    </textList></p>

    <textInput name="ti1">$tl1[1]</textInput>
    <textInput name="ti2">$tl1[2]</textInput>
    <textInput name="ti3">$tl1[3]</textInput>
    <textInput name="ti4">$tl1[4]</textInput>
    <textInput name="ti5">$tl1[5]</textInput>
    <textInput name="ti6">$tl1[6]</textInput>
    <textInput name="ti7">$tl1[7]</textInput>
    <textInput name="ti8">$tl1[8]</textInput>
    <textInput name="ti9">$tl1[9]</textInput>

    `,
        });

        await test_nested_and_inverse(core, resolveComponentName);
    });

    it("textList with textList children and sugar, test inverse", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><textList name="tl1">
      1
      <textList name="tl2">2 3</textList>  
      <text>4</text>
      <textList name="tl3">
        <textList name="tl4">
          5
          <textList name="tl5">6 7</textList>
        </textList>
        <textList name="tl6">8 9</textList>
      </textList>
    </textList></p>

    <textInput name="ti1">$tl1[1]</textInput>
    <textInput name="ti2">$tl1[2]</textInput>
    <textInput name="ti3">$tl1[3]</textInput>
    <textInput name="ti4">$tl1[4]</textInput>
    <textInput name="ti5">$tl1[5]</textInput>
    <textInput name="ti6">$tl1[6]</textInput>
    <textInput name="ti7">$tl1[7]</textInput>
    <textInput name="ti8">$tl1[8]</textInput>
    <textInput name="ti9">$tl1[9]</textInput>
    `,
        });

        await test_nested_and_inverse(core, resolveComponentName);
    });

    it("textList with maximum number", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><textList name="tl1" maxNumber="7">
        <text>a</text>
        <textList name="tl2" maxNumber="2">b c d e</textList>
        <text>f</text>
        <textList name="tl3" maxNumber="4">
            <textList name="tl4" maxNumber="2">
                <text>g</text>
                <textList name="tl5">h i</textList>
            </textList>
            <textList name="tl6">j k l</textList>
        </textList>
    </textList></p>
        `,
        });

        let vals6 = ["j", "k", "l"];
        let vals5 = ["h", "i"];
        let vals4 = ["g", ...vals5].slice(0, 2);
        let vals3 = [...vals4, ...vals6].slice(0, 4);
        let vals2 = ["b", "c", "d", "e"].slice(0, 2);
        let vals1 = ["a", ...vals2, "f", ...vals3].slice(0, 7);

        let sub_vals = [vals2, vals3, vals4, vals5, vals6];

        await test_textList({
            core,
            resolveComponentName,
            name: `tl1`,
            texts: vals1,
            pName: "p",
            text: vals1.join(", "),
        });

        for (let i = 0; i < 5; i++) {
            let vals = sub_vals[i];
            await test_textList({
                core,
                resolveComponentName,
                name: `tl${i + 2}`,
                texts: vals,
            });
        }
    });

    // For now, at least, giving up the feature where you can overwrite maximum number and make it larger
    it.skip("copy textList and overwrite maximum number", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p1"><textList name="tl1">1 2 3 4 5</textList></p>
    <p name="p2">$tl1{maxNumber="3" name="tl2"}</p>
    <p name="p3">$tl2{maxNumber="" name="tl3"}</p>

    <p name="p4"><textList name="tl4" maxNumber="3">1 2 3 4 5</textList></p>
    <p name="p5">$tl4{maxNumber="4" name="tl5"}</p>
    <p name="p6">$tl5{maxNumber="" name="tl6"}</p>
        `,
        });

        let list = ["1", "2", "3", "4", "5"];

        await test_textList({
            core,
            resolveComponentName,
            name: "tl1",
            texts: list,
            pName: "p1",
            text: list.join(", "),
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl2",
            texts: list.slice(0, 3),
            pName: "p2",
            text: list.slice(0, 3).join(", "),
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl3",
            texts: list,
            pName: "p3",
            text: list.join(", "),
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl4",
            texts: list.slice(0, 3),
            pName: "p4",
            text: list.slice(0, 3).join(", "),
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl5",
            texts: list.slice(0, 4),
            pName: "p5",
            text: list.slice(0, 4).join(", "),
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl6",
            texts: list,
            pName: "p6",
            text: list.join(", "),
        });
    });

    it("dynamic maximum number", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    
    <p>Maximum number 1: <mathInput name="mn" prefill="2" /></p>
    <section name="sec">
        <p name="p1"><textList name="ml1" maxNumber="$mn" >cat dog monkey dragon horse rat</textList></p>
        <p name="p2"><textList extend="$ml1" name="ml2" /></p>
        <p name="p3">$ml2</p>
    </section>
    <section name="sec2" extend="$sec" />

      `,
        });

        let list = ["cat", "dog", "monkey", "dragon", "horse", "rat"];

        async function check_items(maxNum: number) {
            for (let pre of ["sec", "sec2"]) {
                await test_textList({
                    resolveComponentName,
                    core,
                    name: `${pre}.ml1`,
                    texts: list.slice(0, maxNum),
                    pName: `${pre}.p1`,
                    text: list.slice(0, maxNum).join(", "),
                });
                await test_textList({
                    resolveComponentName,
                    core,
                    name: `${pre}.ml2`,
                    texts: list.slice(0, maxNum),
                    pName: `${pre}.p2`,
                    text: list.slice(0, maxNum).join(", "),
                });
                await test_textList({
                    resolveComponentName,
                    core,
                    texts: list.slice(0, maxNum),
                    pName: `${pre}.p3`,
                    text: list.slice(0, maxNum).join(", "),
                });
            }
        }

        let maxNum = 2;

        await check_items(maxNum);

        maxNum = Infinity;
        const mnIdx = resolveComponentName("mn");
        await updateMathInputValue({ latex: "", componentIdx: mnIdx, core });
        await check_items(maxNum);

        maxNum = 4;
        await updateMathInputValue({
            latex: maxNum.toString(),
            componentIdx: mnIdx,
            core,
        });
        await check_items(maxNum);

        maxNum = 1;
        await updateMathInputValue({
            latex: maxNum.toString(),
            componentIdx: mnIdx,
            core,
        });
        await check_items(maxNum);
    });

    it("maxNumber with mathList, numberList, or textList child", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `

  <mathInput prefill="2" name="maxN" />

  <p name="pTl"><textList name="tl" maxNumber="$maxN">1 2 3</textList></p>
  <p name="pTlTl"><textList name="tlTl" maxNumber="$maxN"><textList>1 2 3</textList></textList></p>
  <p name="pTlMl"><textList name="tlMl"  maxNumber="$maxN"><mathList>1 2 3</mathList></textList></p>
  <p name="pTlNl"><textList name="tlNl"  maxNumber="$maxN"><numberList>1 2 3</numberList></textList></p>

  <p name="pCopyMl"><textList extend="$tl" name="tlCopy" /></p>
  <p name="pCopyTlTl"><textList extend="$tlTl" name="tlTlCopy" /></p>
  <p name="pCopyTlMl"><textList extend="$tlMl" name="tlMlCopy" /></p>
  <p name="pCopyTlNl"><textList extend="$tlNl" name="tlNlCopy" /></p>
    `,
        });

        let names = [
            ["tl", "pTl"],
            ["tlTl", "pTlTl"],
            ["tlMl", "pTlMl"],
            ["tlNl", "pTlNl"],
            ["tlCopy", "pCopyMl"],
            ["tlTlCopy", "pCopyTlTl"],
            ["tlMlCopy", "pCopyTlMl"],
            ["tlNlCopy", "pCopyTlNl"],
        ];
        async function check_items(maxN: number) {
            let texts = ["1", "2", "3"].slice(0, maxN);
            let text = texts.join(", ");

            for (let [m, p] of names) {
                await test_textList({
                    core,
                    resolveComponentName,
                    name: m,
                    texts,
                    pName: p,
                    text,
                });
            }
        }

        let maxN = 2;
        await check_items(maxN);

        maxN = 4;
        await updateMathInputValue({
            latex: maxN.toString(),
            componentIdx: resolveComponentName("maxN"),
            core,
        });
        await check_items(maxN);

        maxN = 1;
        await updateMathInputValue({
            latex: maxN.toString(),
            componentIdx: resolveComponentName("maxN"),
            core,
        });
        await check_items(maxN);
    });

    it("textList within textLists, ignore child hide", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p1"><textList hide="true" name="tl1">1 2 3</textList></p>

    <p name="p2"><textList name="tl2">
      <text>4</text>
      $tl1
      <text hide>5</text>
      <textList extend="$tl1" hide="false" />
    </textList></p>

    <p name="p3"><textList extend="$tl2" name="tl3" maxNumber="6" /></p>

    `,
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl2",
            texts: ["4", "1", "2", "3", "5", "1", "2", "3"],
            pName: "p2",
            text: "4, 1, 2, 3, 5, 1, 2, 3",
        });

        await test_textList({
            core,
            resolveComponentName,
            name: "tl3",
            texts: ["4", "1", "2", "3", "5", "1"],
            pName: "p3",
            text: "4, 1, 2, 3, 5, 1",
        });
    });

    it("textList does not force composite replacement, even in boolean", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <boolean name="b">
      <textList>$nothing dog</textList> = <textList>dog</textList>
    </boolean>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("b")].stateValues.value).eq(
            true,
        );
    });

    it("textList adapts to math and text", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <textList name="tl"><text>1</text> <text>abc</text><text>3x</text></textList>

    <p>Text list as math: <math name="m">$tl</math></p>
    <p>Text list as text: <text name="t">$tl</text></p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("m")].stateValues.value.tree,
        ).eqls(["list", 1, ["*", "a", "b", "c"], ["*", 3, "x"]]);
        expect(stateVariables[resolveComponentName("t")].stateValues.value).eq(
            "1, abc, 3x",
        );
    });

    it("text from textList", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <textList name="tl">apple banana</textList>

    <p name="pText">Text: $tl.text</p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("pText")].stateValues.text,
        ).eq("Text: apple, banana");
    });

    it("definition and inverse based on shadowed value from a textList prop", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `

    <math functionSymbols="a b" name="m" />

    <p name="p"><textList extend="$m.functionSymbols" name="tl" /></p>


    <textInput name="ti">$m.functionSymbols</textInput>

    `,
        });

        let x1 = "a",
            x2 = "b";
        await test_textList({
            core,
            resolveComponentName,
            name: "tl",
            texts: [x1, x2],
            pName: "p",
            text: `${x1}, ${x2}`,
        });

        x1 = "c";
        x2 = "d";
        await updateTextInputValue({
            text: `${x1}, ${x2}`,
            componentIdx: resolveComponentName("ti"),
            core,
        });
        await test_textList({
            core,
            resolveComponentName,
            name: "tl",
            texts: [x1, x2],
            pName: "p",
            text: `${x1}, ${x2}`,
        });
    });
});
