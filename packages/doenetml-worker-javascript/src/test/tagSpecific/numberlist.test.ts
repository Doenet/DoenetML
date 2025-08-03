import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("NumberList tag tests", async () => {
    async function test_numberList({
        core,
        resolvePathToNodeIdx,
        name,
        pName,
        text,
        numbers,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        name?: string;
        pName?: string;
        text?: string;
        numbers?: number[];
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        if (text !== undefined && pName !== undefined) {
            expect(
                stateVariables[await resolvePathToNodeIdx(pName)].stateValues
                    .text,
            ).eq(text);
        }

        if (numbers !== undefined && name !== undefined) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .numbers,
            ).eqls(numbers);
        }
    }

    it("numberList from string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">5 1+1 </numberList></p>
    `,
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl1",
            pName: "p",
            text: "5, 2",
            numbers: [5, 2],
        });
    });

    it("numberList with error in string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">5 @  1+1 </numberList></p>
    `,
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl1",
            pName: "p",
            text: "5, NaN, 2",
            numbers: [5, NaN, 2],
        });
    });

    it("numberList with number children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            name: "nl1",
            pName: "p1",
            text,
            numbers,
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl2",
            pName: "p2",
            text,
            numbers,
        });
    });

    it("numberList with number and string children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl1">
     -1 8/2
      <number>5</number> 9 <number>1+1</number>
    </numberList></p>
    `,
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl1",
            pName: "p",
            text: "-1, 4, 5, 9, 2",
            numbers: [-1, 4, 5, 9, 2],
        });
    });

    it("numberList with math and number children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            name: "nl1",
            pName: "p1",
            text,
            numbers,
        });
    });

    async function test_nested_and_inverse(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl1",
            pName: "p",
            text: "1, 2, 3, 4, 5, 6, 7, 8, 9",
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl2",
            numbers: [2, 3],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl3",
            numbers: [5, 6, 7, 8, 9],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl4",
            numbers: [5, 6, 7],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl5",
            numbers: [6, 7],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl6",
            numbers: [8, 9],
        });

        // change values

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            latex: "-11",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            latex: "-12",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi3"),
            latex: "-13",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi4"),
            latex: "-14",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi5"),
            latex: "-15",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi6"),
            latex: "-16",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi7"),
            latex: "-17",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi8"),
            latex: "-18",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mi9"),
            latex: "-19",
            core,
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl1",
            pName: "p",
            text: "-11, -12, -13, -14, -15, -16, -17, -18, -19",
            numbers: [-11, -12, -13, -14, -15, -16, -17, -18, -19],
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl2",
            numbers: [-12, -13],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl3",
            numbers: [-15, -16, -17, -18, -19],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl4",
            numbers: [-15, -16, -17],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl5",
            numbers: [-16, -17],
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl6",
            numbers: [-18, -19],
        });
    }

    it("numberList with numberList children, test inverse", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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

        await test_nested_and_inverse(core, resolvePathToNodeIdx);
    });

    it("numberList with numberList children and sugar, test inverse", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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

        await test_nested_and_inverse(core, resolvePathToNodeIdx);
    });

    it("numberList with maximum number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            name: "nl1",
            numbers: vals1,
            pName: "p",
            text: vals1.join(", "),
        });

        for (let i = 0; i < 5; i++) {
            let vals = sub_vals[i];
            await test_numberList({
                core,
                resolvePathToNodeIdx,
                name: `nl${i + 2}`,
                numbers: vals,
            });
        }
    });

    // For now, at least, giving up the feature where you can overwrite maximum number and make it larger
    it.skip("copy numberList and overwrite maximum number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            name: "nl1",
            numbers: list,
            pName: "p1",
            text: list.join(", "),
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl2",
            numbers: list.slice(0, 3),
            pName: "p2",
            text: list.slice(0, 3).join(", "),
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl3",
            numbers: list,
            pName: "p3",
            text: list.join(", "),
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl4",
            numbers: list.slice(0, 3),
            pName: "p4",
            text: list.slice(0, 3).join(", "),
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl5",
            numbers: list.slice(0, 4),
            pName: "p5",
            text: list.slice(0, 4).join(", "),
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl6",
            numbers: list,
            pName: "p6",
            text: list.join(", "),
        });
    });

    it("dynamic maximum number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Maximum number 1: <mathInput name="mn" prefill="2" /></p>
    <section name="sec">
        <p name="p1"><numberList name="ml1" maxNumber="$mn" >1 2 3 4 5 6</numberList></p>
        <p name="p2"><numberList extend="$ml1" name="ml2" /></p>
        <p name="p3">$ml2</p>
    </section>
    <section name="sec2" extend="$sec" />

      `,
        });

        let list = [1, 2, 3, 4, 5, 6];

        async function check_items(maxNum: number) {
            for (let pre of ["sec", "sec2"]) {
                await test_numberList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}.ml1`,
                    numbers: list.slice(0, maxNum),
                    pName: `${pre}.p1`,
                    text: list.slice(0, maxNum).join(", "),
                });
                await test_numberList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}.ml2`,
                    numbers: list.slice(0, maxNum),
                    pName: `${pre}.p2`,
                    text: list.slice(0, maxNum).join(", "),
                });
                await test_numberList({
                    resolvePathToNodeIdx,
                    core,
                    numbers: list.slice(0, maxNum),
                    pName: `${pre}.p3`,
                    text: list.slice(0, maxNum).join(", "),
                });
            }
        }

        let maxNum = 2;

        await check_items(maxNum);

        maxNum = Infinity;
        const mnIdx = await resolvePathToNodeIdx("mn");
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

    it("always merge math lists when have one math child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl1">
      <math>1,2,3,4,5</math>
    </numberList></p>

    <p name="p2">Third number: $nl1[3]</p>
    <p name="p3">Fifth number: $nl1[5]</p>

    <p>Change values:
      <mathInput name="mi1">$nl1[1]</mathInput>
      <mathInput name="mi2">$nl1[2]</mathInput>
      <mathInput name="mi3">$nl1[3]</mathInput>
      <mathInput name="mi4">$nl1[4]</mathInput>
      <mathInput name="mi5">$nl1[5]</mathInput>
    </p>
    `,
        });

        async function check_items(vals: number[]) {
            await test_numberList({
                core,
                resolvePathToNodeIdx,
                name: "nl1",
                numbers: vals,
                pName: "p1",
                text: vals.join(", "),
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).eq(`Third number: ${vals[2]}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .text,
            ).eq(`Fifth number: ${vals[4]}`);
        }

        let vals = [1, 2, 3, 4, 5];

        await check_items(vals);

        vals = [6, 7, 8, 9, 10];
        for (let [i, v] of vals.entries()) {
            await updateMathInputValue({
                latex: v.toString(),
                componentIdx: await resolvePathToNodeIdx(`mi${i + 1}`),
                core,
            });
        }
        await check_items(vals);
    });

    it("maxNumber with when have one math child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><numberList maxNumber="3" name="nl">
      <math name="m">1,2,3,4,5</math>
    </numberList></p>

    <p name="p2">Copied math: $m</p>

    <p name="p3">Copied numberList: $nl</p>

    `,
        });

        let vals = [1, 2, 3, 4, 5];

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl",
            numbers: vals.slice(0, 3),
            pName: "p1",
            text: vals.slice(0, 3).join(", "),
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`Copied math: ${vals.join(", ")}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(`Copied numberList: ${vals.slice(0, 3).join(", ")}`);
    });

    it("maxNumber with mathList or numberList child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

  <mathInput prefill="2" name="maxN" />

  <p name="pNl"><numberList name="nl" maxNumber="$maxN">1 2 3</numberList></p>
  <p name="pNlNl"><numberList name="nlNl" maxNumber="$maxN"><numberList>1 2 3</numberList></numberList></p>
  <p name="pNlMl"><numberList name="nlMl"  maxNumber="$maxN"><mathList>1 2 3</mathList></numberList></p>

  <p name="pCopyMl"><numberList extend="$nl" name="nlCopy" /></p>
  <p name="pCopyNlNl"><numberList extend="$nlNl" name="nlNlCopy" /></p>
  <p name="pCopyNlMl"><numberList extend="$nlMl" name="nlMlCopy" /></p>
    `,
        });

        let names = [
            ["nl", "pNl"],
            ["nlNl", "pNlNl"],
            ["nlMl", "pNlMl"],
            ["nlCopy", "pCopyMl"],
            ["nlNlCopy", "pCopyNlNl"],
            ["nlMlCopy", "pCopyNlMl"],
        ];
        async function check_items(maxN: number) {
            let numbers = [1, 2, 3].slice(0, maxN);
            let text = numbers.join(", ");

            for (let [m, p] of names) {
                await test_numberList({
                    core,
                    resolvePathToNodeIdx,
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
            componentIdx: await resolvePathToNodeIdx("maxN"),
            core,
        });
        await check_items(maxN);

        maxN = 1;
        await updateMathInputValue({
            latex: maxN.toString(),
            componentIdx: await resolvePathToNodeIdx("maxN"),
            core,
        });
        await check_items(maxN);
    });

    it("numberList within numberLists, ignore child hide", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><numberList hide="true" name="nl1">1 2 3</numberList></p>

    <p name="p2"><numberList name="nl2">
      <number>4</number>
      $nl1
      <number hide>5</number>
      <numberList extend="$nl1" hide="false" />
    </numberList></p>

    <p name="p3"><numberList extend="$nl2" name="nl3" maxNumber="6" /></p>

    `,
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl2",
            numbers: [4, 1, 2, 3, 5, 1, 2, 3],
            pName: "p2",
            text: "4, 1, 2, 3, 5, 1, 2, 3",
        });

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl3",
            numbers: [4, 1, 2, 3, 5, 1],
            pName: "p3",
            text: "4, 1, 2, 3, 5, 1",
        });
    });

    it("numberList does not force composite replacement, even in boolean", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">
      <numberList>$nothing 3</numberList> = <numberList>3</numberList>
    </boolean>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
    });

    it("numberList and rounding, from strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><numberList name="nl1" displayDigits="4">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p2"><numberList name="nl2" displayDigits="4" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p3"><numberList name="nl3" displayDecimals="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p4"><numberList name="nl4" displayDecimals="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p5"><numberList name="nl5" displayDecimals="4" displayDigits="3" displaySmallAsZero="false">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p name="p6"><numberList name="nl6" displayDecimals="4" displayDigits="3" displaySmallAsZero="false" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>

    <section name="sec1">
    <p name="p1a"><numberList name="nl1a" extend="$nl1" /></p>
    <p name="p2a"><numberList name="nl2a" extend="$nl2" /></p>
    <p name="p3a"><numberList name="nl3a" extend="$nl3" /></p>
    <p name="p4a"><numberList name="nl4a" extend="$nl4" /></p>
    <p name="p5a"><numberList name="nl5a" extend="$nl5" /></p>
    <p name="p6a"><numberList name="nl6a" extend="$nl6" /></p>

    <p name="p1b"><numberList name="nl1b" copy="$nl1" /></p>
    <p name="p2b"><numberList name="nl2b" copy="$nl2" /></p>
    <p name="p3b"><numberList name="nl3b" copy="$nl3" /></p>
    <p name="p4b"><numberList name="nl4b" copy="$nl4" /></p>
    <p name="p5b"><numberList name="nl5b" copy="$nl5" /></p>
    <p name="p6b"><numberList name="nl6b" copy="$nl6" /></p>
    </section>

    <section name="sec2" extend="$sec1" />
    <section name="sec3" copy="$sec1" />

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

        for (const post of ["", "a", "b"]) {
            const preOptions = post === "" ? [""] : ["", "sec2.", "sec3."];
            for (const pre of preOptions) {
                // console.log({ pre, post });
                await test_numberList({
                    core,
                    resolvePathToNodeIdx,
                    name: `${pre}nl1${post}`,
                    numbers: vals,
                    pName: `${pre}p1${post}`,
                    text: text1,
                });
                await test_numberList({
                    core,
                    resolvePathToNodeIdx,
                    name: `${pre}nl2${post}`,
                    numbers: vals,
                    pName: `${pre}p2${post}`,
                    text: text2,
                });
                await test_numberList({
                    core,
                    resolvePathToNodeIdx,
                    name: `${pre}nl3${post}`,
                    numbers: vals,
                    pName: `${pre}p3${post}`,
                    text: text3,
                });
                await test_numberList({
                    core,
                    resolvePathToNodeIdx,
                    name: `${pre}nl4${post}`,
                    numbers: vals,
                    pName: `${pre}p4${post}`,
                    text: text4,
                });
                await test_numberList({
                    core,
                    resolvePathToNodeIdx,
                    name: `${pre}nl5${post}`,
                    numbers: vals,
                    pName: `${pre}p5${post}`,
                    text: text5,
                });
                await test_numberList({
                    core,
                    resolvePathToNodeIdx,
                    name: `${pre}nl6${post}`,
                    numbers: vals,
                    pName: `${pre}p6${post}`,
                    text: text6,
                });
            }
        }
    });

    it("numberList and rounding, ignore math and number children attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
                resolvePathToNodeIdx,
                name: `nl1${post}`,
                numbers: vals,
                pName: `p1${post}`,
                text: text1,
            });
            await test_numberList({
                core,
                resolvePathToNodeIdx,
                name: `nl2${post}`,
                numbers: vals,
                pName: `p2${post}`,
                text: text2,
            });
            await test_numberList({
                core,
                resolvePathToNodeIdx,
                name: `nl3${post}`,
                numbers: vals,
                pName: `p3${post}`,
                text: text3,
            });
            await test_numberList({
                core,
                resolvePathToNodeIdx,
                name: `nl4${post}`,
                numbers: vals,
                pName: `p4${post}`,
                text: text4,
            });
            await test_numberList({
                core,
                resolvePathToNodeIdx,
                name: `nl5${post}`,
                numbers: vals,
                pName: `p5${post}`,
                text: text5,
            });
            await test_numberList({
                core,
                resolvePathToNodeIdx,
                name: `nl6${post}`,
                numbers: vals,
                pName: `p6${post}`,
                text: text6,
            });
        }
    });

    it("numberList and rounding, copy and override", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><numberList name="nl">34.245023482352345 <number displayDigits="7">0.0023823402358234234</number></numberList></p>
    <p name="pDig6"><numberList name="nlDig6" extend="$nl" displayDigits="6" /></p>
    <p name="pDec6"><numberList name="nlDec6" extend="$nl" displayDecimals="6" /></p>
    <p name="pDig6a"><numberList name="nlDig6a" extend="$nlDec6" displayDigits="6" /></p>
    <p name="pDec6a"><numberList name="nlDec6a" extend="$nlDig6" displayDecimals="6" /></p>
    `,
        });

        let vals = [34.245023482352345, 0.0023823402358234234];

        let text = ["34.25", "0.00238"].join(", ");
        let textDig6 = ["34.245", "0.00238234"].join(", ");
        let textDec6 = ["34.245023", "0.002382"].join(", ");

        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl",
            numbers: vals,
            pName: "p",
            text: text,
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nlDig6",
            numbers: vals,
            pName: "pDig6",
            text: textDig6,
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nlDig6a",
            numbers: vals,
            pName: "pDig6a",
            text: textDig6,
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nlDec6",
            numbers: vals,
            pName: "pDec6",
            text: textDec6,
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nlDec6a",
            numbers: vals,
            pName: "pDec6a",
            text: textDec6,
        });
    });

    it("numberList adapts to math and text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl"><number>1</number> <number>2</number><number>3</number></numberList>

    <p>Number list as math: <math name="m">$nl</math></p>
    <p>Number list as text: <text name="t">$nl</text></p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", 1, 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).eq("1, 2, 3");
    });

    it("numberList adapts to mathList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
                resolvePathToNodeIdx,
                name: "nl",
                numbers: [n1, n2, n3],
                pName: "p1",
                text,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).eq(text);
        }

        let n1 = 9,
            n2 = 8,
            n3 = 7;

        await test_items(n1, n2, n3);

        n2 = 83;
        await updateMathInputValue({
            latex: n2.toString(),
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await test_items(n1, n2, n3);

        n1 = -1;
        n3 = 2;
        await updateMathInputValue({
            latex: `(${n1}, ${n3})`,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await test_items(n1, n2, n3);
    });

    it("text and latex from numberList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl">7 -8</numberList>

    <p name="pText">Text: $nl.text</p>
    <p name="pLatex">Latex: $nl.latex</p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pText")].stateValues
                .text,
        ).eq("Text: 7, -8");
        expect(
            stateVariables[await resolvePathToNodeIdx("pLatex")].stateValues
                .text,
        ).eq("Latex: 7, -8");
    });

    it("definition and inverse based on shadowed value from a numberList prop", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <regionBetweenCurves boundaryValues="-5 8" name="rbc" />

    <p name="p"><numberList extend="$rbc.boundaryValues" name="nl" /></p>
    <mathInput name="mi">$rbc.boundaryValues</mathInput>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        let n1 = -5,
            n2 = 8;
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl",
            numbers: [n1, n2],
            pName: "p",
            text: `${n1}, ${n2}`,
        });

        n1 = 3;
        n2 = 6;
        await updateMathInputValue({
            latex: `${n1}, ${n2}`,
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await test_numberList({
            core,
            resolvePathToNodeIdx,
            name: "nl",
            numbers: [n1, n2],
            pName: "p",
            text: `${n1}, ${n2}`,
        });
    });

    it("compare unordered number lists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <booleanInput name="unordered">true</booleanInput>

    <boolean name="b1">
        <numberList name="nl1" unordered="$unordered">1 2 3</numberList>
        =
        <numberList name="nl2">3 1 2</numberList>
    </boolean>
    <boolean name="b2">$nl1 = $nl2</boolean>
    <boolean name="b3"><numberList extend="$nl1" name="nl1a" /> = <numberList extend="$nl2" /></boolean>
    <boolean name="b4"><numberList copy="$nl1" name="nl1b" /> = <numberList copy="$nl2" /></boolean>

    <p name="pUnordered">$nl1.unordered, $nl1a.unordered, $nl1b.unordered</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pUnordered")].stateValues
                .text,
        ).eq("true, true, true");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("unordered"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        // all but copied list become ordered
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pUnordered")].stateValues
                .text,
        ).eq("false, false, true");
    });

    it("compare unordered number lists, overwrite attribute", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <booleanInput name="unordered" />

    <numberList name="nl1" unordered>1 2 3</numberList>
    <numberList name="nl2">3 1 2</numberList>

    <boolean name="b1"><numberList name="nl1a" unordered="$unordered" extend="$nl1" /> = $nl2</boolean>
    <boolean name="b2"><numberList name="nl1b" unordered="$unordered" copy="$nl1" /> = $nl2</boolean>
    <boolean name="b3">$nl1a = $nl2</boolean>
    <boolean name="b4"><numberList extend="$nl1a" name="nl1c" /> = $nl2</boolean>
    <boolean name="b5"><numberList copy="$nl1a" name="nl1d" /> = $nl2</boolean>
    <boolean name="b6">$nl1b = $nl2</boolean>
    <boolean name="b7"><numberList extend="$nl1b" name="nl1e" /> = $nl2</boolean>
    <boolean name="b8"><numberList copy="$nl1b" name="nl1f" /> = $nl2</boolean>

    <p name="pUnordered">$nl1a.unordered, $nl1b.unordered, $nl1c.unordered, $nl1d.unordered, $nl1e.unordered, $nl1f.unordered</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b7")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b8")].stateValues.value,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("pUnordered")].stateValues
                .text,
        ).eq("false, false, false, false, false, false");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("unordered"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b7")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b8")].stateValues.value,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("pUnordered")].stateValues
                .text,
        ).eq("true, true, true, false, true, false");
    });
});
