import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("NumberList tag tests", async () => {
    async function test_numberList({
        core,
        name,
        pName,
        text,
        numbers,
    }: {
        core: any;
        name?: string;
        pName?: string;
        text?: string;
        numbers?: any[];
    }) {
        const stateVariables = await returnAllStateVariables(core);

        if (text !== undefined && pName !== undefined) {
            expect(stateVariables[pName].stateValues.text).eq(text);
        }

        if (numbers !== undefined && name !== undefined) {
            expect(stateVariables[name].stateValues.numbers).eqls(numbers);
        }
    }

    it("numberList from string", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">5 1+1 </numberList></p>
    `,
        });

        await test_numberList({
            core,
            name: "/nl1",
            pName: "/p",
            text: "5, 2",
            numbers: [5, 2],
        });
    });

    it("numberList with error in string", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">5 @  1+1 </numberList></p>
    `,
        });

        await test_numberList({
            core,
            name: "/nl1",
            pName: "/p",
            text: "5, NaN, 2",
            numbers: [5, NaN, 2],
        });
    });

    it("numberList with number children", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl1">
      <number>5</number>
      <number>1+1</number>
    </numberList></p>

    <p name="p2"><numberList name="nl2">
      <number>5</number><number>1+1</number>
    </numberList></p>
    `,
        });

        let text = "5, 2";
        let numbers = [5, 2];

        await test_numberList({
            core,
            name: "/nl1",
            pName: "/p1",
            text,
            numbers,
        });

        await test_numberList({
            core,
            name: "/nl2",
            pName: "/p2",
            text,
            numbers,
        });
    });

    it("numberList with number and string children", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">
     -1 8/2
      <number>5</number> 9 <number>1+1</number>
    </numberList></p>
    `,
        });

        await test_numberList({
            core,
            name: "/nl1",
            pName: "/p",
            text: "-1, 4, 5, 9, 2",
            numbers: [-1, 4, 5, 9, 2],
        });
    });

    it("numberList with math and number children", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl1">
      <number>5</number>
      <math>1+1</math>
    </numberList></p>

    `,
        });

        let text = "5, 2";
        let numbers = [5, 2];

        await test_numberList({
            core,
            name: "/nl1",
            pName: "/p1",
            text,
            numbers,
        });
    });

    async function test_nested_and_inverse(core: any) {
        await test_numberList({
            core,
            name: "/nl1",
            pName: "/p",
            text: "1, 2, 3, 4, 5, 6, 7, 8, 9",
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        });

        await test_numberList({
            core,
            name: "/nl2",
            numbers: [2, 3],
        });
        await test_numberList({
            core,
            name: "/nl3",
            numbers: [5, 6, 7, 8, 9],
        });
        await test_numberList({
            core,
            name: "/nl4",
            numbers: [5, 6, 7],
        });
        await test_numberList({
            core,
            name: "/nl5",
            numbers: [6, 7],
        });
        await test_numberList({
            core,
            name: "/nl6",
            numbers: [8, 9],
        });

        // change values

        await updateMathInputValue({
            componentName: "/mi1",
            latex: "-11",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi2",
            latex: "-12",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi3",
            latex: "-13",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi4",
            latex: "-14",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi5",
            latex: "-15",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi6",
            latex: "-16",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi7",
            latex: "-17",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi8",
            latex: "-18",
            core,
        });
        await updateMathInputValue({
            componentName: "/mi9",
            latex: "-19",
            core,
        });

        await test_numberList({
            core,
            name: "/nl1",
            pName: "/p",
            text: "-11, -12, -13, -14, -15, -16, -17, -18, -19",
            numbers: [-11, -12, -13, -14, -15, -16, -17, -18, -19],
        });

        await test_numberList({
            core,
            name: "/nl2",
            numbers: [-12, -13],
        });
        await test_numberList({
            core,
            name: "/nl3",
            numbers: [-15, -16, -17, -18, -19],
        });
        await test_numberList({
            core,
            name: "/nl4",
            numbers: [-15, -16, -17],
        });
        await test_numberList({
            core,
            name: "/nl5",
            numbers: [-16, -17],
        });
        await test_numberList({
            core,
            name: "/nl6",
            numbers: [-18, -19],
        });
    }

    it("numberList with numberList children, test inverse", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">
      <number>1</number>
      <numberList name="nl2">2 3</numberList>
      <number>4</number>
      <numberList name="nl3">
        <numberList name="nl4">
          <number>5</number>
          <numberList name="nl5">6 7</numberList>
        </numberList>
        <numberList name="nl6">8 9</numberList>
      </numberList>
    </numberList></p>

    <mathInput name="mi1">$nl1[1]</mathInput>
    <mathInput name="mi2">$nl1[2]</mathInput>
    <mathInput name="mi3">$nl1[3]</mathInput>
    <mathInput name="mi4">$nl1[4]</mathInput>
    <mathInput name="mi5">$nl1[5]</mathInput>
    <mathInput name="mi6">$nl1[6]</mathInput>
    <mathInput name="mi7">$nl1[7]</mathInput>
    <mathInput name="mi8">$nl1[8]</mathInput>
    <mathInput name="mi9">$nl1[9]</mathInput>

    `,
        });

        await test_nested_and_inverse(core);
    });

    it("numberList with numberList children and sugar, test inverse", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">
      1
      <numberList name="nl2">2 3</numberList>  
      <number>4</number>
      <numberList name="nl3">
        <numberList name="nl4">
          5
          <numberList name="nl5">6 7</numberList>
        </numberList>
        <numberList name="nl6">8 9</numberList>
      </numberList>
    </numberList></p>

    <mathInput name="mi1">$nl1[1]</mathInput>
    <mathInput name="mi2">$nl1[2]</mathInput>
    <mathInput name="mi3">$nl1[3]</mathInput>
    <mathInput name="mi4">$nl1[4]</mathInput>
    <mathInput name="mi5">$nl1[5]</mathInput>
    <mathInput name="mi6">$nl1[6]</mathInput>
    <mathInput name="mi7">$nl1[7]</mathInput>
    <mathInput name="mi8">$nl1[8]</mathInput>
    <mathInput name="mi9">$nl1[9]</mathInput>
    `,
        });

        await test_nested_and_inverse(core);
    });

    it("numberList with maximum number", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1" maxNumber="7">
        <number>1</number>
        <numberList name="nl2" maxNumber="2">2 3 4 5</numberList>
        <number>6</number>
        <numberList name="nl3" maxNumber="4">
            <numberList name="nl4" maxNumber="2">
                <number>7</number>
                <numberList name="nl5">8 9</numberList>
            </numberList>
            <numberList name="nl6">10 11 12</numberList>
        </numberList>
    </numberList></p>
        `,
        });

        let vals6 = [10, 11, 12];
        let vals5 = [8, 9];
        let vals4 = [7, ...vals5].slice(0, 2);
        let vals3 = [...vals4, ...vals6].slice(0, 4);
        let vals2 = [2, 3, 4, 5].slice(0, 2);
        let vals1 = [1, ...vals2, 6, ...vals3].slice(0, 7);

        let sub_vals = [vals2, vals3, vals4, vals5, vals6];

        await test_numberList({
            core,
            name: `/nl1`,
            numbers: vals1,
            pName: "/p",
            text: vals1.join(", "),
        });

        for (let i = 0; i < 5; i++) {
            let vals = sub_vals[i];
            await test_numberList({
                core,
                name: `/nl${i + 2}`,
                numbers: vals,
            });
        }
    });

    it("copy numberList and overwrite maximum number", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl1">1 2 3 4 5</numberList></p>
    <p name="p2">$nl1{maxNumber="3" name="nl2"}</p>
    <p name="p3">$nl2{maxNumber="" name="nl3"}</p>

    <p name="p4"><numberList name="nl4" maxNumber="3">1 2 3 4 5</numberList></p>
    <p name="p5">$nl4{maxNumber="4" name="nl5"}</p>
    <p name="p6">$nl5{maxNumber="" name="nl6"}</p>
        `,
        });

        let list = [1, 2, 3, 4, 5];

        await test_numberList({
            core,
            name: "/nl1",
            numbers: list,
            pName: "/p1",
            text: list.join(", "),
        });
        await test_numberList({
            core,
            name: "/nl2",
            numbers: list.slice(0, 3),
            pName: "/p2",
            text: list.slice(0, 3).join(", "),
        });
        await test_numberList({
            core,
            name: "/nl3",
            numbers: list,
            pName: "/p3",
            text: list.join(", "),
        });
        await test_numberList({
            core,
            name: "/nl4",
            numbers: list.slice(0, 3),
            pName: "/p4",
            text: list.slice(0, 3).join(", "),
        });
        await test_numberList({
            core,
            name: "/nl5",
            numbers: list.slice(0, 4),
            pName: "/p5",
            text: list.slice(0, 4).join(", "),
        });
        await test_numberList({
            core,
            name: "/nl6",
            numbers: list,
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
        <p name="p1"><numberList name="nl1" maxNumber="$mn1" >1 2 3 4 5 6</numberList></p>
        <p name="p2">$nl1{maxNumber="$mn2" name="nl2"}</p>
        <p name="p3">$nl2{name="nl3"}</p>
        <p name="p4">$nl3{name="nl4" maxNumber=""}</p>
    </section>
    <section name="sec2" copySource="sec" newNamespace />

      `,
        });

        let list = [1, 2, 3, 4, 5, 6];

        async function check_items(max1, max2) {
            for (let pre of ["", "/sec2"]) {
                await test_numberList({
                    core,
                    name: `${pre}/nl1`,
                    numbers: list.slice(0, max1),
                    pName: `${pre}/p1`,
                    text: list.slice(0, max1).join(", "),
                });
                await test_numberList({
                    core,
                    name: `${pre}/nl2`,
                    numbers: list.slice(0, max2),
                    pName: `${pre}/p2`,
                    text: list.slice(0, max2).join(", "),
                });
                await test_numberList({
                    core,
                    name: `${pre}/nl3`,
                    numbers: list.slice(0, max2),
                    pName: `${pre}/p3`,
                    text: list.slice(0, max2).join(", "),
                });
                await test_numberList({
                    core,
                    name: `${pre}/nl4`,
                    numbers: list,
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

    it("maxNumber with mathList or numberList child", async () => {
        let core = await createTestCore({
            doenetML: `

  <mathInput prefill="2" name="maxN" />

  <p name="pNl"><numberList name="nl" maxNumber="$maxN">1 2 3</numberList></p>
  <p name="pNlNl"><numberList name="nlNl" maxNumber="$maxN"><numberList>1 2 3</numberList></numberList></p>
  <p name="pNlMl"><numberList name="nlMl"  maxNumber="$maxN"><mathList>1 2 3</mathList></numberList></p>

  <p name="pCopyMl">$nl{name="nlCopy"}</p>
  <p name="pCopyNlNl">$nlNl{name="nlNlCopy"}</p>
  <p name="pCopyNlMl">$nlMl{name="nlMlCopy"}</p>
    `,
        });

        let names = [
            ["/nl", "/pNl"],
            ["/nlNl", "/pNlNl"],
            ["/nlMl", "/pNlMl"],
            ["/nlCopy", "/pCopyMl"],
            ["/nlNlCopy", "/pCopyNlNl"],
            ["/nlMlCopy", "/pCopyNlMl"],
        ];
        async function check_items(maxN: number) {
            let numbers = [1, 2, 3].slice(0, maxN);
            let text = numbers.join(", ");

            for (let [m, p] of names) {
                await test_numberList({
                    core,
                    name: m,
                    numbers,
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

    it("numberList within numberLists, ignore child hide", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList hide="true" name="nl1">1 2 3</numberList></p>

    <p name="p2"><numberList name="nl2">
      <number>4</number>
      $nl1
      <number hide>5</number>
      $nl1{hide="false"}
    </numberList></p>

    <p name="p3">$nl2{name="nl3" maxNumber="6"}</p>

    `,
        });

        await test_numberList({
            core,
            name: "/nl2",
            numbers: [4, 1, 2, 3, 5, 1, 2, 3],
            pName: "/p2",
            text: "4, 1, 2, 3, 5, 1, 2, 3",
        });

        await test_numberList({
            core,
            name: "/nl3",
            numbers: [4, 1, 2, 3, 5, 1],
            pName: "/p3",
            text: "4, 1, 2, 3, 5, 1",
        });
    });

    it("numberList does not force composite replacement, even in boolean", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b">
      <numberList>$nothing 3</numberList> = <numberList>3</numberList>
    </boolean>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
    });

    it("assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList assignNames="a b c">1 2 3</numberList></p>
    <p name="p2">$a, $b, $c</p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq("1, 2, 3");
        expect(stateVariables["/p2"].stateValues.text).eq("1, 2, 3");
        expect(stateVariables["/a"].stateValues.value).eq(1);
        expect(stateVariables["/b"].stateValues.value).eq(2);
        expect(stateVariables["/c"].stateValues.value).eq(3);
    });

    it("numberList and rounding, from strings", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl1" displayDigits="4">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p2"><numberList name="nl2" displayDigits="4" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p3"><numberList name="nl3" displayDecimals="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p4"><numberList name="nl4" displayDecimals="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p5"><numberList name="nl5" displayDecimals="4" displayDigits="3" displaySmallAsZero="false">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p6"><numberList name="nl6" displayDecimals="4" displayDigits="3" displaySmallAsZero="false" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>

    <p name="p1a"><numberList name="nl1a" copySource="nl1" /></p>
    <p name="p2a"><numberList name="nl2a" copySource="nl2" /></p>
    <p name="p3a"><numberList name="nl3a" copySource="nl3" /></p>
    <p name="p4a"><numberList name="nl4a" copySource="nl4" /></p>
    <p name="p5a"><numberList name="nl5a" copySource="nl5" /></p>
    <p name="p6a"><numberList name="nl6a" copySource="nl6" /></p>

    <p name="p1b"><numberList name="nl1b" copySource="nl1" link="false" /></p>
    <p name="p2b"><numberList name="nl2b" copySource="nl2" link="false" /></p>
    <p name="p3b"><numberList name="nl3b" copySource="nl3" link="false" /></p>
    <p name="p4b"><numberList name="nl4b" copySource="nl4" link="false" /></p>
    <p name="p5b"><numberList name="nl5b" copySource="nl5" link="false" /></p>
    <p name="p6b"><numberList name="nl6b" copySource="nl6" link="false" /></p>


    `,
        });

        let vals = [
            2345.1535268, 3.52343, 0.5, 0.00000000000052523,
            0.000000000000000000006,
        ];
        let text1 = ["2345", "3.523", "0.5", "5.252 * 10^(-13)", "0"].join(
            ", ",
        );
        let text2 = [
            "2345",
            "3.523",
            "0.5000",
            "5.252 * 10^(-13)",
            "0.000",
        ].join(", ");
        let text3 = ["2345.154", "3.523", "0.5", "0", "0"].join(", ");
        let text4 = ["2345.154", "3.523", "0.500", "0.000", "0.000"].join(", ");
        let text5 = [
            "2345.1535",
            "3.5234",
            "0.5",
            "5.25 * 10^(-13)",
            "6 * 10^(-21)",
        ].join(", ");
        let text6 = [
            "2345.1535",
            "3.5234",
            "0.5000",
            "5.25 * 10^(-13)",
            "6.00 * 10^(-21)",
        ].join(", ");

        for (let post of ["", "a", "b"]) {
            await test_numberList({
                core,
                name: `/nl1${post}`,
                numbers: vals,
                pName: `/p1${post}`,
                text: text1,
            });
            await test_numberList({
                core,
                name: `/nl2${post}`,
                numbers: vals,
                pName: `/p2${post}`,
                text: text2,
            });
            await test_numberList({
                core,
                name: `/nl3${post}`,
                numbers: vals,
                pName: `/p3${post}`,
                text: text3,
            });
            await test_numberList({
                core,
                name: `/nl4${post}`,
                numbers: vals,
                pName: `/p4${post}`,
                text: text4,
            });
            await test_numberList({
                core,
                name: `/nl5${post}`,
                numbers: vals,
                pName: `/p5${post}`,
                text: text5,
            });
            await test_numberList({
                core,
                name: `/nl6${post}`,
                numbers: vals,
                pName: `/p6${post}`,
                text: text6,
            });
        }
    });

    it("numberList and rounding, ignore math and number children attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl1">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p name="p2"><numberList name="nl2" displayDigits="4">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p name="p3"><numberList name="nl3" displayDigits="4" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p name="p4"><numberList name="nl4" displayDecimals="4">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p name="p5"><numberList name="nl5" displayDecimals="4" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p name="p6"><numberList name="nl6" displayDigits="4" displaySmallAsZero="false">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>

    <p name="p1m"><numberList name="nl1m">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </numberList></p>
    <p name="p2m"><numberList name="nl2m" displayDigits="4">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </numberList></p>
    <p name="p3m"><numberList name="nl3m" displayDigits="4" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </numberList></p>
    <p name="p4m"><numberList name="nl4m" displayDecimals="4">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </numberList></p>
    <p name="p5m"><numberList name="nl5m" displayDecimals="4" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </numberList></p>
    <p name="p6m"><numberList name="nl6m" displayDigits="4" displaySmallAsZero="false">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </numberList></p>
    `,
        });
        let vals = [
            2345.1535268, 3.52343, 5, 0.00000000000000052523,
            0.000000000000000000006,
        ];
        let text1 = ["2345.15", "3.52", "5", "0", "0"].join(", ");
        let text2 = ["2345", "3.523", "5", "0", "0"].join(", ");
        let text3 = ["2345", "3.523", "5.000", "0.000", "0.000"].join(", ");
        let text4 = ["2345.1535", "3.5234", "5", "0", "0"].join(", ");
        let text5 = ["2345.1535", "3.5234", "5.0000", "0.0000", "0.0000"].join(
            ", ",
        );
        let text6 = [
            "2345",
            "3.523",
            "5",
            "5.252 * 10^(-16)",
            "6 * 10^(-21)",
        ].join(", ");

        for (let post of ["", "m"]) {
            await test_numberList({
                core,
                name: `/nl1${post}`,
                numbers: vals,
                pName: `/p1${post}`,
                text: text1,
            });
            await test_numberList({
                core,
                name: `/nl2${post}`,
                numbers: vals,
                pName: `/p2${post}`,
                text: text2,
            });
            await test_numberList({
                core,
                name: `/nl3${post}`,
                numbers: vals,
                pName: `/p3${post}`,
                text: text3,
            });
            await test_numberList({
                core,
                name: `/nl4${post}`,
                numbers: vals,
                pName: `/p4${post}`,
                text: text4,
            });
            await test_numberList({
                core,
                name: `/nl5${post}`,
                numbers: vals,
                pName: `/p5${post}`,
                text: text5,
            });
            await test_numberList({
                core,
                name: `/nl6${post}`,
                numbers: vals,
                pName: `/p6${post}`,
                text: text6,
            });
        }
    });

    it("numberList and rounding, copy and override", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl">34.245023482352345 <number displayDigits="7">0.0023823402358234234</number></numberList></p>
    <p name="pDig6"><numberList name="nlDig6" copySource="nl" displayDigits="6" /></p>
    <p name="pDec6"><numberList name="nlDec6" copySource="nl" displayDecimals="6" /></p>
    <p name="pDig6a"><numberList name="nlDig6a" copySource="nlDec6" displayDigits="6" /></p>
    <p name="pDec6a"><numberList name="nlDec6a" copySource="nlDig6" displayDecimals="6" /></p>
    `,
        });

        let vals = [34.245023482352345, 0.0023823402358234234];

        let text = ["34.25", "0.00238"].join(", ");
        let textDig6 = ["34.245", "0.00238234"].join(", ");
        let textDec6 = ["34.245023", "0.002382"].join(", ");

        await test_numberList({
            core,
            name: `/nl`,
            numbers: vals,
            pName: `/p`,
            text: text,
        });
        await test_numberList({
            core,
            name: `/nlDig6`,
            numbers: vals,
            pName: `/pDig6`,
            text: textDig6,
        });
        await test_numberList({
            core,
            name: `/nlDig6a`,
            numbers: vals,
            pName: `/pDig6a`,
            text: textDig6,
        });
        await test_numberList({
            core,
            name: `/nlDec6`,
            numbers: vals,
            pName: `/pDec6`,
            text: textDec6,
        });
        await test_numberList({
            core,
            name: `/nlDec6a`,
            numbers: vals,
            pName: `/pDec6a`,
            text: textDec6,
        });
    });

    it("numberList adapts to math and text", async () => {
        let core = await createTestCore({
            doenetML: `
    <numberList name="nl"><number>1</number> <number>2</number><number>3</number></numberList>

    <p>Number list as math: <math name="m">$nl</math></p>
    <p>Number list as text: <text name="t">$nl</text></p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            1,
            2,
            3,
        ]);
        expect(stateVariables["/t"].stateValues.value).eq("1, 2, 3");
    });

    it("numberList adapts to mathList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl"><number>9</number> <number>8</number><number>7</number></numberList></p>

    <p name="p2"><mathList name="ml">$nl</mathList></p>
    <p>Change second number: <mathInput name="mi1">$nl[2]</mathInput></p>

    <p>Change 1st and 3rd number via point: <mathInput name="mi2"><point>($nl[1],$nl[3])</point></mathInput></p>

    `,
        });

        async function test_items(n1: number, n2: number, n3: number) {
            let text = [n1, n2, n3].join(", ");
            await test_numberList({
                core,
                name: "/nl",
                numbers: [n1, n2, n3],
                pName: "/p1",
                text,
            });

            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/p2"].stateValues.text).eq(text);
        }

        let n1 = 9,
            n2 = 8,
            n3 = 7;

        await test_items(n1, n2, n3);

        n2 = 83;
        await updateMathInputValue({
            latex: n2.toString(),
            componentName: "/mi1",
            core,
        });
        await test_items(n1, n2, n3);

        n1 = -1;
        n3 = 2;
        await updateMathInputValue({
            latex: `(${n1}, ${n3})`,
            componentName: "/mi2",
            core,
        });
        await test_items(n1, n2, n3);
    });

    it("text and latex from numberList", async () => {
        let core = await createTestCore({
            doenetML: `
    <numberList name="nl">7 -8</numberList>

    <p name="pText">Text: $nl.text</p>
    <p name="pLatex">Latex: $nl.latex</p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pText"].stateValues.text).eq("Text: 7, -8");
        expect(stateVariables["/pLatex"].stateValues.text).eq("Latex: 7, -8");
    });
});
