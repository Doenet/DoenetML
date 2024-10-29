import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { updateMathInputValue, updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("TextList tag tests", async () => {
    async function test_textList({
        core,
        name,
        pName,
        text,
        texts,
    }: {
        core: any;
        name?: string;
        pName?: string;
        text?: string;
        texts?: any[];
    }) {
        const stateVariables = await returnAllStateVariables(core);

        if (text !== undefined && pName !== undefined) {
            expect(stateVariables[pName].stateValues.text).eq(text);
        }

        if (texts !== undefined && name !== undefined) {
            expect(stateVariables[name].stateValues.texts).eqls(texts);
        }
    }

    it("textList from string", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><textList name="tl1">a b </textList></p>
    `,
        });

        await test_textList({
            core,
            name: "/tl1",
            pName: "/p",
            text: "a, b",
            texts: ["a", "b"],
        });
    });

    it("textList with text children", async () => {
        let core = await createTestCore({
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
            name: "/tl1",
            pName: "/p1",
            text,
            texts,
        });

        await test_textList({
            core,
            name: "/tl2",
            pName: "/p2",
            text,
            texts,
        });
    });

    it("textList with text and string children", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><textList name="tl1">
     hello there
      <text>apple</text> banana <text>strawberry</text>
    </textList></p>
    `,
        });

        await test_textList({
            core,
            name: "/tl1",
            pName: "/p",
            text: "hello, there, apple, banana, strawberry",
            texts: ["hello", "there", "apple", "banana", "strawberry"],
        });
    });

    async function test_nested_and_inverse(core: any) {
        await test_textList({
            core,
            name: "/tl1",
            pName: "/p",
            text: "1, 2, 3, 4, 5, 6, 7, 8, 9",
            texts: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        });

        await test_textList({
            core,
            name: "/tl2",
            texts: ["2", "3"],
        });
        await test_textList({
            core,
            name: "/tl3",
            texts: ["5", "6", "7", "8", "9"],
        });
        await test_textList({
            core,
            name: "/tl4",
            texts: ["5", "6", "7"],
        });
        await test_textList({
            core,
            name: "/tl5",
            texts: ["6", "7"],
        });
        await test_textList({
            core,
            name: "/tl6",
            texts: ["8", "9"],
        });

        // change values

        await updateTextInputValue({
            componentName: "/ti1",
            text: "a",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti2",
            text: "b",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti3",
            text: "c",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti4",
            text: "d",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti5",
            text: "e",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti6",
            text: "f",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti7",
            text: "g",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti8",
            text: "h",
            core,
        });
        await updateTextInputValue({
            componentName: "/ti9",
            text: "i",
            core,
        });

        await test_textList({
            core,
            name: "/tl1",
            pName: "/p",
            text: "a, b, c, d, e, f, g, h, i",
            texts: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
        });

        await test_textList({
            core,
            name: "/tl2",
            texts: ["b", "c"],
        });
        await test_textList({
            core,
            name: "/tl3",
            texts: ["e", "f", "g", "h", "i"],
        });
        await test_textList({
            core,
            name: "/tl4",
            texts: ["e", "f", "g"],
        });
        await test_textList({
            core,
            name: "/tl5",
            texts: ["f", "g"],
        });
        await test_textList({
            core,
            name: "/tl6",
            texts: ["h", "i"],
        });
    }

    it("textList with textList children, test inverse", async () => {
        let core = await createTestCore({
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

        await test_nested_and_inverse(core);
    });

    it("textList with textList children and sugar, test inverse", async () => {
        let core = await createTestCore({
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

        await test_nested_and_inverse(core);
    });

    it("textList with maximum number", async () => {
        let core = await createTestCore({
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
            name: `/tl1`,
            texts: vals1,
            pName: "/p",
            text: vals1.join(", "),
        });

        for (let i = 0; i < 5; i++) {
            let vals = sub_vals[i];
            await test_textList({
                core,
                name: `/tl${i + 2}`,
                texts: vals,
            });
        }
    });

    it("copy textList and overwrite maximum number", async () => {
        let core = await createTestCore({
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
            name: "/tl1",
            texts: list,
            pName: "/p1",
            text: list.join(", "),
        });
        await test_textList({
            core,
            name: "/tl2",
            texts: list.slice(0, 3),
            pName: "/p2",
            text: list.slice(0, 3).join(", "),
        });
        await test_textList({
            core,
            name: "/tl3",
            texts: list,
            pName: "/p3",
            text: list.join(", "),
        });
        await test_textList({
            core,
            name: "/tl4",
            texts: list.slice(0, 3),
            pName: "/p4",
            text: list.slice(0, 3).join(", "),
        });
        await test_textList({
            core,
            name: "/tl5",
            texts: list.slice(0, 4),
            pName: "/p5",
            text: list.slice(0, 4).join(", "),
        });
        await test_textList({
            core,
            name: "/tl6",
            texts: list,
            pName: "/p6",
            text: list.join(", "),
        });
    });

    it("dynamic maximum number", async () => {
        let core = await createTestCore({
            doenetML: `
    
    <p>Maximum number 1: <mathInput name="mn1" prefill="2" /></p>
    <p>Maximum number 2: <mathInput name="mn2" /></p>
    <section name="sec">
        <p name="p1"><textList name="tl1" maxNumber="$mn1" >cat dog monkey dragon horse rat</textList></p>
        <p name="p2">$tl1{maxNumber="$mn2" name="tl2"}</p>
        <p name="p3">$tl2{name="tl3"}</p>
        <p name="p4">$tl3{name="tl4" maxNumber=""}</p>
    </section>
    <section name="sec2" copySource="sec" newNamespace />

      `,
        });

        let list = ["cat", "dog", "monkey", "dragon", "horse", "rat"];

        async function check_items(max1, max2) {
            for (let pre of ["", "/sec2"]) {
                await test_textList({
                    core,
                    name: `${pre}/tl1`,
                    texts: list.slice(0, max1),
                    pName: `${pre}/p1`,
                    text: list.slice(0, max1).join(", "),
                });
                await test_textList({
                    core,
                    name: `${pre}/tl2`,
                    texts: list.slice(0, max2),
                    pName: `${pre}/p2`,
                    text: list.slice(0, max2).join(", "),
                });
                await test_textList({
                    core,
                    name: `${pre}/tl3`,
                    texts: list.slice(0, max2),
                    pName: `${pre}/p3`,
                    text: list.slice(0, max2).join(", "),
                });
                await test_textList({
                    core,
                    name: `${pre}/tl4`,
                    texts: list,
                    pName: `${pre}/p4`,
                    text: list.join(", "),
                });
            }
        }

        let max1 = 2,
            max2 = Infinity;

        await check_items(max1, max2);

        max1 = Infinity;
        await updateMathInputValue({ latex: "", componentName: "/mn1", core });
        await check_items(max1, max2);

        max2 = 3;
        await updateMathInputValue({
            latex: max2.toString(),
            componentName: "/mn2",
            core,
        });
        await check_items(max1, max2);

        max1 = 4;
        await updateMathInputValue({
            latex: max1.toString(),
            componentName: "/mn1",
            core,
        });
        await check_items(max1, max2);

        max1 = 1;
        await updateMathInputValue({
            latex: max1.toString(),
            componentName: "/mn1",
            core,
        });
        await check_items(max1, max2);

        max2 = 10;
        await updateMathInputValue({
            latex: max2.toString(),
            componentName: "/mn2",
            core,
        });
        await check_items(max1, max2);
    });

    it("maxNumber with mathList, numberList, or textList child", async () => {
        let core = await createTestCore({
            doenetML: `

  <mathInput prefill="2" name="maxN" />

  <p name="pTl"><textList name="tl" maxNumber="$maxN">1 2 3</textList></p>
  <p name="pTlTl"><textList name="tlTl" maxNumber="$maxN"><textList>1 2 3</textList></textList></p>
  <p name="pTlMl"><textList name="tlMl"  maxNumber="$maxN"><mathList>1 2 3</mathList></textList></p>
  <p name="pTlNl"><textList name="tlNl"  maxNumber="$maxN"><numberList>1 2 3</numberList></textList></p>

  <p name="pCopyMl">$tl{name="tlCopy"}</p>
  <p name="pCopyTlTl">$tlTl{name="tlTlCopy"}</p>
  <p name="pCopyTlMl">$tlMl{name="tlMlCopy"}</p>
  <p name="pCopyTlNl">$tlNl{name="tlNlCopy"}</p>
    `,
        });

        let names = [
            ["/tl", "/pTl"],
            ["/tlTl", "/pTlTl"],
            ["/tlMl", "/pTlMl"],
            ["/tlNl", "/pTlNl"],
            ["/tlCopy", "/pCopyMl"],
            ["/tlTlCopy", "/pCopyTlTl"],
            ["/tlMlCopy", "/pCopyTlMl"],
            ["/tlNlCopy", "/pCopyTlNl"],
        ];
        async function check_items(maxN: number) {
            let texts = ["1", "2", "3"].slice(0, maxN);
            let text = texts.join(", ");

            for (let [m, p] of names) {
                await test_textList({
                    core,
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
            componentName: "/maxN",
            core,
        });
        await check_items(maxN);

        maxN = 1;
        await updateMathInputValue({
            latex: maxN.toString(),
            componentName: "/maxN",
            core,
        });
        await check_items(maxN);
    });

    it("textList within textLists, ignore child hide", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><textList hide="true" name="tl1">1 2 3</textList></p>

    <p name="p2"><textList name="tl2">
      <text>4</text>
      $tl1
      <text hide>5</text>
      $tl1{hide="false"}
    </textList></p>

    <p name="p3">$tl2{name="tl3" maxNumber="6"}</p>

    `,
        });

        await test_textList({
            core,
            name: "/tl2",
            texts: ["4", "1", "2", "3", "5", "1", "2", "3"],
            pName: "/p2",
            text: "4, 1, 2, 3, 5, 1, 2, 3",
        });

        await test_textList({
            core,
            name: "/tl3",
            texts: ["4", "1", "2", "3", "5", "1"],
            pName: "/p3",
            text: "4, 1, 2, 3, 5, 1",
        });
    });

    it("textList does not force composite replacement, even in boolean", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b">
      <textList>$nothing dog</textList> = <textList>dog</textList>
    </boolean>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
    });

    it("assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><textList assignNames="a b c">cat dog monkey</textList></p>
    <p name="p2">$a, $b, $c</p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq("cat, dog, monkey");
        expect(stateVariables["/p2"].stateValues.text).eq("cat, dog, monkey");
        expect(stateVariables["/a"].stateValues.value).eq("cat");
        expect(stateVariables["/b"].stateValues.value).eq("dog");
        expect(stateVariables["/c"].stateValues.value).eq("monkey");
    });

    it("textList adapts to math and text", async () => {
        let core = await createTestCore({
            doenetML: `
    <textList name="tl"><text>1</text> <text>abc</text><text>3x</text></textList>

    <p>Text list as math: <math name="m">$tl</math></p>
    <p>Text list as text: <text name="t">$tl</text></p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            1,
            ["*", "a", "b", "c"],
            ["*", 3, "x"],
        ]);
        expect(stateVariables["/t"].stateValues.value).eq("1, abc, 3x");
    });

    it("text from textList", async () => {
        let core = await createTestCore({
            doenetML: `
    <textList name="tl">apple banana</textList>

    <p name="pText">Text: $tl.text</p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pText"].stateValues.text).eq(
            "Text: apple, banana",
        );
    });
});
