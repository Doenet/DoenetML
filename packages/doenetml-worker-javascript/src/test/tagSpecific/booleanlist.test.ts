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

describe("BooleanList tag tests", async () => {
    async function test_booleanList({
        core,
        resolvePathToNodeIdx,
        name,
        pName,
        text,
        booleans,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        name?: string;
        pName?: string;
        text?: string;
        booleans?: boolean[];
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        if (text !== undefined && pName !== undefined) {
            expect(
                stateVariables[await resolvePathToNodeIdx(pName)].stateValues
                    .text,
            ).eq(text);
        }

        if (booleans !== undefined && name !== undefined) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .booleans,
            ).eqls(booleans);
        }
    }

    it("booleanList from string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><booleanList name="bl1">false true </booleanList></p>
    `,
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl1",
            pName: "p",
            text: "false, true",
            booleans: [false, true],
        });
    });

    it("booleanList with boolean children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><booleanList name="bl1">
      <boolean>false</boolean>
      <boolean>not false</boolean>
    </booleanList></p>

    <p name="p2"><booleanList name="bl2">
      <boolean>false</boolean><boolean>not false</boolean>
    </booleanList></p>
    `,
        });

        let text = "false, true";
        let booleans = [false, true];

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl1",
            pName: "p1",
            text,
            booleans,
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl2",
            pName: "p2",
            text,
            booleans,
        });
    });

    it("booleanList with boolean and string children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><booleanList name="bl1">
     false true
      <boolean>not false</boolean> true <boolean>not true</boolean>
    </booleanList></p>
    `,
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl1",
            pName: "p",
            text: "false, true, true, true, false",
            booleans: [false, true, true, true, false],
        });
    });

    async function test_nested_and_inverse(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl1",
            pName: "p",
            text: "true, true, false, true, false, false, true, true, false",
            booleans: [
                true,
                true,
                false,
                true,
                false,
                false,
                true,
                true,
                false,
            ],
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl2",
            booleans: [true, false],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl3",
            booleans: [false, false, true, true, false],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl4",
            booleans: [false, false, true],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl5",
            booleans: [false, true],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl6",
            booleans: [true, false],
        });

        // change values

        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            boolean: false,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            boolean: false,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi3"),
            boolean: true,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi4"),
            boolean: false,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi5"),
            boolean: true,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi6"),
            boolean: true,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi7"),
            boolean: false,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi8"),
            boolean: false,
            core,
        });
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("mi9"),
            boolean: true,
            core,
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl1",
            pName: "p",
            text: "false, false, true, false, true, true, false, false, true",
            booleans: [
                false,
                false,
                true,
                false,
                true,
                true,
                false,
                false,
                true,
            ],
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl2",
            booleans: [false, true],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl3",
            booleans: [true, true, false, false, true],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl4",
            booleans: [true, true, false],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl5",
            booleans: [true, false],
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl6",
            booleans: [false, true],
        });
    }

    it("booleanList with booleanList children, test inverse", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><booleanList name="bl1">
      <boolean>true</boolean>
      <booleanList name="bl2">true false</booleanList>
      <boolean>true</boolean>
      <booleanList name="bl3">
        <booleanList name="bl4">
          <boolean>false</boolean>
          <booleanList name="bl5">false true</booleanList>
        </booleanList>
        <booleanList name="bl6">true false</booleanList>
      </booleanList>
    </booleanList></p>

    <booleanInput name="mi1">$bl1[1]</booleanInput>
    <booleanInput name="mi2">$bl1[2]</booleanInput>
    <booleanInput name="mi3">$bl1[3]</booleanInput>
    <booleanInput name="mi4">$bl1[4]</booleanInput>
    <booleanInput name="mi5">$bl1[5]</booleanInput>
    <booleanInput name="mi6">$bl1[6]</booleanInput>
    <booleanInput name="mi7">$bl1[7]</booleanInput>
    <booleanInput name="mi8">$bl1[8]</booleanInput>
    <booleanInput name="mi9">$bl1[9]</booleanInput>

    `,
        });

        await test_nested_and_inverse(core, resolvePathToNodeIdx);
    });

    it("booleanList with booleanList children and sugar, test inverse", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><booleanList name="bl1">
      true
      <booleanList name="bl2">true false</booleanList>  
      <boolean>true</boolean>
      <booleanList name="bl3">
        <booleanList name="bl4">
          false
          <booleanList name="bl5">false true</booleanList>
        </booleanList>
        <booleanList name="bl6">true false</booleanList>
      </booleanList>
    </booleanList></p>

    <booleanInput name="mi1">$bl1[1]</booleanInput>
    <booleanInput name="mi2">$bl1[2]</booleanInput>
    <booleanInput name="mi3">$bl1[3]</booleanInput>
    <booleanInput name="mi4">$bl1[4]</booleanInput>
    <booleanInput name="mi5">$bl1[5]</booleanInput>
    <booleanInput name="mi6">$bl1[6]</booleanInput>
    <booleanInput name="mi7">$bl1[7]</booleanInput>
    <booleanInput name="mi8">$bl1[8]</booleanInput>
    <booleanInput name="mi9">$bl1[9]</booleanInput>
    `,
        });

        await test_nested_and_inverse(core, resolvePathToNodeIdx);
    });

    it("booleanList with maximum number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><booleanList name="bl1" maxNumber="7">
        <boolean>true</boolean>
        <booleanList name="bl2" maxNumber="2">true false true false</booleanList>
        <boolean>false</boolean>
        <booleanList name="bl3" maxNumber="4">
            <booleanList name="bl4" maxNumber="2">
                <boolean>false</boolean>
                <booleanList name="bl5">false true</booleanList>
            </booleanList>
            <booleanList name="bl6">false true true</booleanList>
        </booleanList>
    </booleanList></p>
        `,
        });

        let vals6 = [false, true, true];
        let vals5 = [false, true];
        let vals4 = [false, ...vals5].slice(0, 2);
        let vals3 = [...vals4, ...vals6].slice(0, 4);
        let vals2 = [true, false, true, false].slice(0, 2);
        let vals1 = [true, ...vals2, false, ...vals3].slice(0, 7);

        let sub_vals = [vals2, vals3, vals4, vals5, vals6];

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: `bl1`,
            booleans: vals1,
            pName: "p",
            text: vals1.join(", "),
        });

        for (let i = 0; i < 5; i++) {
            let vals = sub_vals[i];
            await test_booleanList({
                core,
                resolvePathToNodeIdx,
                name: `bl${i + 2}`,
                booleans: vals,
            });
        }
    });

    // For now, at least, giving up the feature where you can overwrite maximum number and make it larger
    it.skip("copy booleanList and overwrite maximum number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><booleanList name="bl1">true true false false true</booleanList></p>
    <p name="p2"><booleanList extend="$bl1" maxNumber="3" name="bl2" /></p>
    <p name="p3"><booleanList extend="$bl2" maxNumber="" name="bl3" /></p>

    <p name="p4"><booleanList name="bl4" maxNumber="3">true true false false true</booleanList></p>
    <p name="p5"><booleanList extend="$bl4" maxNumber="4" name="bl5" /></p>
    <p name="p6"><booleanList extend="$bl5" maxNumber="" name="bl6" /></p>
        `,
        });

        let list = [true, true, false, false, true];

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl1",
            booleans: list,
            pName: "p1",
            text: list.join(", "),
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl2",
            booleans: list.slice(0, 3),
            pName: "p2",
            text: list.slice(0, 3).join(", "),
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl3",
            booleans: list,
            pName: "p3",
            text: list.join(", "),
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl4",
            booleans: list.slice(0, 3),
            pName: "p4",
            text: list.slice(0, 3).join(", "),
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl5",
            booleans: list.slice(0, 4),
            pName: "p5",
            text: list.slice(0, 4).join(", "),
        });
        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl6",
            booleans: list,
            pName: "p6",
            text: list.join(", "),
        });
    });

    it("dynamic maximum number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    
    <p>Maximum number 1: <mathInput name="mn" prefill="2" /></p>
    <section name="sec">
        <p name="p1"><booleanList name="ml1" maxNumber="$mn" >true true false true false false</booleanList></p>
        <p name="p2"><booleanList extend="$ml1" name="ml2" /></p>
        <p name="p3">$ml2</p>
    </section>
    <section name="sec2" extend="$sec" />

      `,
        });

        let list = [true, true, false, true, false, false];

        async function check_items(maxNum: number) {
            for (let pre of ["sec", "sec2"]) {
                await test_booleanList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}.ml1`,
                    booleans: list.slice(0, maxNum),
                    pName: `${pre}.p1`,
                    text: list.slice(0, maxNum).join(", "),
                });
                await test_booleanList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}.ml2`,
                    booleans: list.slice(0, maxNum),
                    pName: `${pre}.p2`,
                    text: list.slice(0, maxNum).join(", "),
                });
                await test_booleanList({
                    resolvePathToNodeIdx,
                    core,
                    booleans: list.slice(0, maxNum),
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

    it("booleanList within booleanLists, ignore child hide", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><booleanList hide="true" name="bl1">true true false</booleanList></p>

    <p name="p2"><booleanList name="bl2">
      <boolean>false</boolean>
      $bl1
      <boolean hide>true</boolean>
      <booleanList extend="$bl1" hide="false" />
    </booleanList></p>

    <p name="p3"><booleanList extend="$bl2" name="bl3" maxNumber="6" /></p>

    `,
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl2",
            booleans: [false, true, true, false, true, true, true, false],
            pName: "p2",
            text: "false, true, true, false, true, true, true, false",
        });

        await test_booleanList({
            core,
            resolvePathToNodeIdx,
            name: "bl3",
            booleans: [false, true, true, false, true, true],
            pName: "p3",
            text: "false, true, true, false, true, true",
        });
    });

    it("booleanList does not force composite replacement, even in boolean", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">
      <booleanList>$nothing true</booleanList> = <booleanList>true</booleanList>
    </boolean>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
    });

    it("text from booleanList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanList name="bl">true true false</booleanList>

    <p name="pText">Text: $bl.text</p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pText")].stateValues
                .text,
        ).eq("Text: true, true, false");
    });
});
