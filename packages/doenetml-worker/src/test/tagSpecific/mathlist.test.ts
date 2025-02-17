import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("MathList tag tests", async () => {
    async function test_mathList({
        core,
        name,
        pName,
        text,
        maths,
    }: {
        core: Core;
        name?: string;
        pName?: string;
        text?: string;
        maths?: any[];
    }) {
        const stateVariables = await returnAllStateVariables(core);

        if (text !== undefined && pName !== undefined) {
            expect(stateVariables[pName].stateValues.text).eq(text);
        }

        if (maths !== undefined && name !== undefined) {
            expect(
                stateVariables[name].stateValues.maths.map((x) => x.tree),
            ).eqls(maths);
        }
    }

    it("mathList from string", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><mathList name="ml1">a 1+1 </mathList></p>
    `,
        });

        await test_mathList({
            core,
            name: "/ml1",
            pName: "/p",
            text: "a, 1 + 1",
            maths: ["a", ["+", 1, 1]],
        });
    });

    it("mathList with error in string", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><mathList name="ml1">a @  1+1 </mathList></p>
    `,
        });

        await test_mathList({
            core,
            name: "/ml1",
            pName: "/p",
            text: "a, ＿, 1 + 1",
            maths: ["a", "＿", ["+", 1, 1]],
        });
    });

    it("mathList in attribute containing math and number macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><math name="m1">x</math>
    <math name="m2">3y</math>
    <number name="n1">7</number>
    <number name="n2">11</number></p>
    <p><point name="P" xs="$m1 $m2/$n1 $n1 $n1-$n2 $n1 -$n2 $n1 - $n2 $n1$m1$m2 ($n1+$m1)/($n2$m2)" /></p>
    `,
        });

        let maths = [
            "x",
            ["/", ["*", 3, "y"], 7],
            7,
            -4,
            7,
            -11,
            7,
            "-",
            11,
            ["*", 21, "x", "y"],
            ["/", ["+", "x", 7], ["*", 33, "y"]],
        ];

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(
            maths,
        );
    });

    it("mathList with math children", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList name="ml1">
      <math>a</math>
      <math>1+1</math>
    </mathList></p>

    <p name="p2"><mathList name="ml2">
      <math>a</math><math>1+1</math>
    </mathList></p>
    `,
        });

        let text = "a, 1 + 1";
        let maths = ["a", ["+", 1, 1]];

        await test_mathList({
            core,
            name: "/ml1",
            pName: "/p1",
            text,
            maths,
        });

        await test_mathList({
            core,
            name: "/ml2",
            pName: "/p2",
            text,
            maths,
        });
    });

    it("mathList with math and string children", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><mathList name="ml1">
      <math>a</math> q <math>1+1</math>h
    </mathList></p>
    `,
        });

        await test_mathList({
            core,
            name: "/ml1",
            pName: "/p",
            text: "a, q, 1 + 1, h",
            maths: ["a", "q", ["+", 1, 1], "h"],
        });
    });

    it("mathList with math and number children", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList name="ml1">
      <math>a</math>
      <number>1+1</number>
    </mathList></p>
    <p name="p2"><mathList name="ml2">
      <math>a</math><number>1+1</number>
    </mathList></p>
    `,
        });

        let text = "a, 2";
        let maths = ["a", 2];

        await test_mathList({
            core,
            name: "/ml1",
            pName: "/p1",
            text,
            maths,
        });

        await test_mathList({
            core,
            name: "/ml2",
            pName: "/p2",
            text,
            maths,
        });
    });

    async function test_nested_and_inverse(core: Core) {
        await test_mathList({
            core,
            name: "/ml1",
            pName: "/p",
            text: "a, q, r, h, b, u, v, i, j",
            maths: ["a", "q", "r", "h", "b", "u", "v", "i", "j"],
        });
        await test_mathList({
            core,
            name: "/ml2",
            maths: ["q", "r"],
        });
        await test_mathList({
            core,
            name: "/ml3",
            maths: ["b", "u", "v", "i", "j"],
        });
        await test_mathList({
            core,
            name: "/ml4",
            maths: ["b", "u", "v"],
        });
        await test_mathList({
            core,
            name: "/ml5",
            maths: ["u", "v"],
        });
        await test_mathList({
            core,
            name: "/ml6",
            maths: ["i", "j"],
        });

        // change values

        await updateMathInputValue({ name: "/mi1", latex: "1", core });
        await updateMathInputValue({ name: "/mi2", latex: "2", core });
        await updateMathInputValue({ name: "/mi3", latex: "3", core });
        await updateMathInputValue({ name: "/mi4", latex: "4", core });
        await updateMathInputValue({ name: "/mi5", latex: "5", core });
        await updateMathInputValue({ name: "/mi6", latex: "6", core });
        await updateMathInputValue({ name: "/mi7", latex: "7", core });
        await updateMathInputValue({ name: "/mi8", latex: "8", core });
        await updateMathInputValue({ name: "/mi9", latex: "9", core });

        await test_mathList({
            core,
            name: "/ml1",
            pName: "/p",
            text: "1, 2, 3, 4, 5, 6, 7, 8, 9",
            maths: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        });

        await test_mathList({
            core,
            name: "/ml2",
            maths: [2, 3],
        });
        await test_mathList({
            core,
            name: "/ml3",
            maths: [5, 6, 7, 8, 9],
        });
        await test_mathList({
            core,
            name: "/ml4",
            maths: [5, 6, 7],
        });
        await test_mathList({
            core,
            name: "/ml5",
            maths: [6, 7],
        });
        await test_mathList({
            core,
            name: "/ml6",
            maths: [8, 9],
        });
    }

    it("mathList with mathList children, test inverse", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><mathList name="ml1">
      <math>a</math>
      <mathList name="ml2">q r</mathList>
      <math>h</math>
      <mathList name="ml3">
        <mathList name="ml4">
          <math>b</math>
          <mathList name="ml5">u v</mathList>
        </mathList>
        <mathList name="ml6">i j</mathList>
      </mathList>
    </mathList></p>

    <mathInput name="mi1">$ml1[1]</mathInput>
    <mathInput name="mi2">$ml1[2]</mathInput>
    <mathInput name="mi3">$ml1[3]</mathInput>
    <mathInput name="mi4">$ml1[4]</mathInput>
    <mathInput name="mi5">$ml1[5]</mathInput>
    <mathInput name="mi6">$ml1[6]</mathInput>
    <mathInput name="mi7">$ml1[7]</mathInput>
    <mathInput name="mi8">$ml1[8]</mathInput>
    <mathInput name="mi9">$ml1[9]</mathInput>

    `,
        });

        await test_nested_and_inverse(core);
    });

    it("mathList with mathList children and sugar, test inverse", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><mathList name="ml1">
      a
      <mathList name="ml2">q r</mathList>  
      <math>h</math>
      <mathList name="ml3">
        <mathList name="ml4">
          b
          <mathList name="ml5">u v</mathList>
        </mathList>
        <mathList name="ml6">i  j</mathList>
      </mathList>
    </mathList></p>

    <mathInput name="mi1">$ml1[1]</mathInput>
    <mathInput name="mi2">$ml1[2]</mathInput>
    <mathInput name="mi3">$ml1[3]</mathInput>
    <mathInput name="mi4">$ml1[4]</mathInput>
    <mathInput name="mi5">$ml1[5]</mathInput>
    <mathInput name="mi6">$ml1[6]</mathInput>
    <mathInput name="mi7">$ml1[7]</mathInput>
    <mathInput name="mi8">$ml1[8]</mathInput>
    <mathInput name="mi9">$ml1[9]</mathInput>
    `,
        });

        await test_nested_and_inverse(core);
    });

    it.skip("mathList with self references", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathList name="ml1">
      <math>p</math>
      <mathList name="ml2">q r</mathList>
      <math copySource="ml1.math3{obtainPropFromComposite}" name="m4" />
      <mathList name="ml3">
        <mathList name="ml4">
          <math name="m2"><math copySource="ml1.math1{obtainPropFromComposite}" /></math>
          <mathList name="ml5">s t</mathList>
        </mathList>
        <mathList name="ml6">
          <math copySource="ml1.math2{obtainPropFromComposite}" name="m8" />
          <math copySource="ml1.math5{obtainPropFromComposite}" name="m9" />
        </mathList>
      </mathList>
      $ml4.maths{obtainPropFromComposite name="ml7"}
    </mathList>

    <mathInput name="mi1" bindValueTo="$(ml1.math1)" />
    <mathInput name="mi2" bindValueTo="$(ml1.math2)" />
    <mathInput name="mi3" bindValueTo="$(ml1.math3)" />
    <mathInput name="mi4" bindValueTo="$(ml1.math4)" />
    <mathInput name="mi5" bindValueTo="$(ml1.math5)" />
    <mathInput name="mi6" bindValueTo="$(ml1.math6)" />
    <mathInput name="mi7" bindValueTo="$(ml1.math7)" />
    <mathInput name="mi8" bindValueTo="$(ml1.math8)" />
    <mathInput name="mi9" bindValueTo="$(ml1.math9)" />
    <mathInput name="mi10" bindValueTo="$(ml1.math10)" />
    <mathInput name="mi11" bindValueTo="$(ml1.math11)" />
    <mathInput name="mi12" bindValueTo="$(ml1.math12)" />

    `,
        });

        // encodes how the different maths are actually references
        // of 5 unique values
        let math_to_unique = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];

        async function check_list(unique_values: string[]) {
            let all_values = math_to_unique.map((i) => unique_values[i]);

            await test_mathList({
                core,
                name: "/ml1",
                text: all_values.join(", "),
            });
        }

        let unique_values = ["p", "q", "r", "s", "t"];

        await check_list(unique_values);

        // successively enter the values "a" to "l" into the math inputs
        // and test that all the components are updated
        // based on the relationships in `math_to_unique`
        let new_values = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
        ];
        for (let [mathInd, uniqueInd] of math_to_unique.entries()) {
            // changing math `mathInd` actually corresponds to
            // changing the unique value `uniqueInd`

            let val = new_values[mathInd];

            await updateMathInputValue({
                latex: val,
                name: `/mi${mathInd + 1}`,
                core,
            });
            unique_values[uniqueInd] = val;

            await check_list(unique_values);
        }
    });

    it("mathList with maximum number", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><mathList name="ml1" maxNumber="7">
        <math>a</math>
        <mathList name="ml2" maxNumber="2">q r l k</mathList>
        <math>h</math>
        <mathList name="ml3" maxNumber="4">
            <mathList name="ml4" maxNumber="2">
                <math>b</math>
                <mathList name="ml5">u v</mathList>
            </mathList>
            <mathList name="ml6">i j k</mathList>
        </mathList>
    </mathList></p>
        `,
        });

        let vals6 = ["i", "j", "k"];
        let vals5 = ["u", "v"];
        let vals4 = ["b", ...vals5].slice(0, 2);
        let vals3 = [...vals4, ...vals6].slice(0, 4);
        let vals2 = ["q", "r", "l", "k"].slice(0, 2);
        let vals1 = ["a", ...vals2, "h", ...vals3].slice(0, 7);

        let sub_vals = [vals2, vals3, vals4, vals5, vals6];

        await test_mathList({
            core,
            name: `/ml1`,
            maths: vals1,
            pName: "/p",
            text: vals1.join(", "),
        });

        for (let i = 0; i < 5; i++) {
            let vals = sub_vals[i];
            await test_mathList({
                core,
                name: `/ml${i + 2}`,
                maths: vals,
            });
        }
    });

    it("copy mathList and overwrite maximum number", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList name="ml1">a b c d e</mathList></p>
    <p name="p2">$ml1{maxNumber="3" name="ml2"}</p>
    <p name="p3">$ml2{maxNumber="" name="ml3"}</p>

    <p name="p4"><mathList name="ml4" maxNumber="3">a b c d e</mathList></p>
    <p name="p5">$ml4{maxNumber="4" name="ml5"}</p>
    <p name="p6">$ml5{maxNumber="" name="ml6"}</p>
        `,
        });

        let list = ["a", "b", "c", "d", "e"];

        await test_mathList({
            core,
            name: "/ml1",
            maths: list,
            pName: "/p1",
            text: list.join(", "),
        });
        await test_mathList({
            core,
            name: "/ml2",
            maths: list.slice(0, 3),
            pName: "/p2",
            text: list.slice(0, 3).join(", "),
        });
        await test_mathList({
            core,
            name: "/ml3",
            maths: list,
            pName: "/p3",
            text: list.join(", "),
        });
        await test_mathList({
            core,
            name: "/ml4",
            maths: list.slice(0, 3),
            pName: "/p4",
            text: list.slice(0, 3).join(", "),
        });
        await test_mathList({
            core,
            name: "/ml5",
            maths: list.slice(0, 4),
            pName: "/p5",
            text: list.slice(0, 4).join(", "),
        });
        await test_mathList({
            core,
            name: "/ml6",
            maths: list,
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
        <p name="p1"><mathList name="ml1" maxNumber="$mn1" >x y z u v w</mathList></p>
        <p name="p2">$ml1{maxNumber="$mn2" name="ml2"}</p>
        <p name="p3">$ml2{name="ml3"}</p>
        <p name="p4">$ml3{name="ml4" maxNumber=""}</p>
    </section>
    <section name="sec2" copySource="sec" newNamespace />

      `,
        });

        let list = ["x", "y", "z", "u", "v", "w"];

        async function check_items(max1, max2) {
            for (let pre of ["", "/sec2"]) {
                await test_mathList({
                    core,
                    name: `${pre}/ml1`,
                    maths: list.slice(0, max1),
                    pName: `${pre}/p1`,
                    text: list.slice(0, max1).join(", "),
                });
                await test_mathList({
                    core,
                    name: `${pre}/ml2`,
                    maths: list.slice(0, max2),
                    pName: `${pre}/p2`,
                    text: list.slice(0, max2).join(", "),
                });
                await test_mathList({
                    core,
                    name: `${pre}/ml3`,
                    maths: list.slice(0, max2),
                    pName: `${pre}/p3`,
                    text: list.slice(0, max2).join(", "),
                });
                await test_mathList({
                    core,
                    name: `${pre}/ml4`,
                    maths: list,
                    pName: `${pre}/p4`,
                    text: list.join(", "),
                });
            }
        }

        let max1 = 2,
            max2 = Infinity;

        await check_items(max1, max2);

        max1 = Infinity;
        await updateMathInputValue({ latex: "", name: "/mn1", core });
        await check_items(max1, max2);

        max2 = 3;
        await updateMathInputValue({
            latex: max2.toString(),
            name: "/mn2",
            core,
        });
        await check_items(max1, max2);

        max1 = 4;
        await updateMathInputValue({
            latex: max1.toString(),
            name: "/mn1",
            core,
        });
        await check_items(max1, max2);

        max1 = 1;
        await updateMathInputValue({
            latex: max1.toString(),
            name: "/mn1",
            core,
        });
        await check_items(max1, max2);

        max2 = 10;
        await updateMathInputValue({
            latex: max2.toString(),
            name: "/mn2",
            core,
        });
        await check_items(max1, max2);
    });

    it("mathList with merge math lists", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList mergeMathLists="$merge" name="ml1">
      <math>a</math>
      <math>b,c,d</math>
      <math>e,f</math>
      <math>g</math>
    </mathList></p>
    <p>Merge math lists: <booleanInput name="merge" /></p>

    <p name="p2">Third math: $ml1[3]</p>
    <p name="p3">Fifth math: $ml1[5]</p>

    <p>Change values:
      <mathInput name="mi1">$ml1[1]</mathInput>
      <mathInput name="mi2">$ml1[2]</mathInput>
      <mathInput name="mi3">$ml1[3]</mathInput>
      <mathInput name="mi4">$ml1[4]</mathInput>
      <mathInput name="mi5">$ml1[5]</mathInput>
      <mathInput name="mi6">$ml1[6]</mathInput>
      <mathInput name="mi7">$ml1[7]</mathInput>
    </p>
    `,
        });

        async function check_items(vals: (string | string[])[]) {
            let maths = vals.map((v) =>
                Array.isArray(v) ? ["list", ...v] : v,
            );

            let texts = vals.map((v) => (Array.isArray(v) ? v.join(", ") : v));

            await test_mathList({
                core,
                name: `/ml1`,
                maths,
                pName: `/p1`,
                text: texts.join(", "),
            });

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/p2"].stateValues.text).eq(
                `Third math: ${texts[2]}`,
            );
            expect(stateVariables["/p3"].stateValues.text).eq(
                `Fifth math: ${texts[4] ?? ""}`,
            );
        }

        let vals = ["a", ["b", "c", "d"], ["e", "f"], "g"];
        await check_items(vals);

        vals = ["h", ["b", "c", "i"], ["e", "j"], "k"];

        for (let [i, v] of vals.entries()) {
            await updateMathInputValue({
                latex: v.toString(),
                name: `/mi${i + 1}`,
                core,
            });
        }
        await check_items(vals);

        await updateBooleanInputValue({
            boolean: true,
            name: "/merge",
            core,
        });
        vals = ["h", "b", "c", "i", "e", "j", "k"];
        await check_items(vals);

        vals = ["l", "m", "n", "o", "p", "q", "r"];
        for (let [i, v] of vals.entries()) {
            await updateMathInputValue({
                latex: v.toString(),
                name: `/mi${i + 1}`,
                core,
            });
        }
        await check_items(vals);

        await updateBooleanInputValue({
            boolean: false,
            name: "/merge",
            core,
        });
        vals = ["l", ["m", "n", "o"], ["p", "q"], "r"];
        await check_items(vals);
    });

    it("always merge math lists when have one math child", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList name="ml1">
      <math>a,b,c,d,e</math>
    </mathList></p>

    <p name="p2">Third math: $ml1[3]</p>
    <p name="p3">Fifth math: $ml1[5]</p>

    <p>Change values:
      <mathInput name="mi1">$ml1[1]</mathInput>
      <mathInput name="mi2">$ml1[2]</mathInput>
      <mathInput name="mi3">$ml1[3]</mathInput>
      <mathInput name="mi4">$ml1[4]</mathInput>
      <mathInput name="mi5">$ml1[5]</mathInput>
    </p>
    `,
        });

        async function check_items(vals: string[]) {
            await test_mathList({
                core,
                name: `/ml1`,
                maths: vals,
                pName: `/p1`,
                text: vals.join(", "),
            });

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/p2"].stateValues.text).eq(
                `Third math: ${vals[2]}`,
            );
            expect(stateVariables["/p3"].stateValues.text).eq(
                `Fifth math: ${vals[4]}`,
            );
        }

        let vals = ["a", "b", "c", "d", "e"];

        await check_items(vals);

        vals = ["f", "g", "h", "i", "j"];
        for (let [i, v] of vals.entries()) {
            await updateMathInputValue({
                latex: v.toString(),
                name: `/mi${i + 1}`,
                core,
            });
        }
        await check_items(vals);
    });

    it("maxNumber with when have one math child", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList maxNumber="3" name="ml">
      <math name="m">a,b,c,d,e</math>
    </mathList></p>

    <p name="p2">Copied math: $m</p>

    <p name="p3">Copied mathList: $ml</p>

    `,
        });

        let vals = ["a", "b", "c", "d", "e"];

        await test_mathList({
            core,
            name: `/ml`,
            maths: vals.slice(0, 3),
            pName: `/p1`,
            text: vals.slice(0, 3).join(", "),
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p2"].stateValues.text).eq(
            `Copied math: ${vals.join(", ")}`,
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            `Copied mathList: ${vals.slice(0, 3).join(", ")}`,
        );
    });

    it("maxNumber with merge math lists", async () => {
        let core = await createTestCore({
            doenetML: `

    <p name="p"><mathList mergeMathLists="$mml" maxNumber="$maxNum" name="ml">
      <math>1</math>
      <mathList mergeMathLists><math>2, 3</math><math>4</math><mathList>5 6</mathList></mathList>
      <math>7,8,9</math>
      <mathList>10 11</mathList>
      <math>12, 13, 14, 15</math>
      <mathList>16 17 18 19 20</mathList>
    </mathList></p>
    <p>Merge math lists: <booleanInput name="mml" /></p>
    <p>Maximum number: <mathInput name="maxNum" prefill="3" /></p>


    <p name="pCopy">$ml{name="mlCopy"}</p>
    `,
        });

        let vals_merge = [...Array(20).keys()].map((x) => x + 1);

        let vals_no_merge = [
            1,
            2,
            3,
            4,
            5,
            6,
            [7, 8, 9],
            10,
            11,
            [12, 13, 14, 15],
            16,
            17,
            18,
            19,
            20,
        ];

        async function check_items(mml: boolean, maxNum: number) {
            if (mml) {
                let vals = vals_merge.slice(0, maxNum);
                await test_mathList({
                    core,
                    name: "/ml",
                    maths: vals,
                    pName: "/p",
                    text: vals.join(", "),
                });
                await test_mathList({
                    core,
                    name: "/mlCopy",
                    maths: vals,
                    pName: "/pCopy",
                    text: vals.join(", "),
                });
            } else {
                let vals = vals_no_merge
                    .slice(0, maxNum)
                    .map((v) => (Array.isArray(v) ? ["list", ...v] : v));
                let texts = vals.map((v) =>
                    Array.isArray(v) ? v.slice(1).join(", ") : v,
                );

                await test_mathList({
                    core,
                    name: "/ml",
                    maths: vals,
                    pName: "/p",
                    text: texts.join(", "),
                });
                await test_mathList({
                    core,
                    name: "/mlCopy",
                    maths: vals,
                    pName: "/pCopy",
                    text: texts.join(", "),
                });
            }
        }

        let maxNum = 3;
        let mml = false;

        await check_items(mml, maxNum);

        maxNum = 6;
        await updateMathInputValue({
            latex: maxNum.toString(),
            name: "/maxNum",
            core,
        });
        await check_items(mml, maxNum);

        maxNum = 7;
        await updateMathInputValue({
            latex: maxNum.toString(),
            name: "/maxNum",
            core,
        });
        await check_items(mml, maxNum);

        mml = true;
        await updateBooleanInputValue({
            boolean: mml,
            name: "/mml",
            core,
        });
        await check_items(mml, maxNum);

        maxNum = 13;
        await updateMathInputValue({
            latex: maxNum.toString(),
            name: "/maxNum",
            core,
        });
        await check_items(mml, maxNum);

        mml = false;
        await updateBooleanInputValue({
            boolean: mml,
            name: "/mml",
            core,
        });
        await check_items(mml, maxNum);
    });

    it("maxNumber with mathList or numberList child", async () => {
        let core = await createTestCore({
            doenetML: `

  <mathInput prefill="2" name="maxN" />

  <p name="pMl"><mathList name="ml" maxNumber="$maxN">1 2 3</mathList></p>
  <p name="pMlMl"><mathList name="mlMl" maxNumber="$maxN"><mathList>1 2 3</mathList></mathList></p>
  <p name="pMlNl"><mathList name="mlNl"  maxNumber="$maxN"><numberList>1 2 3</numberList></mathList></p>

  <p name="pCopyMl">$ml{name="mlCopy"}</p>
  <p name="pCopyMlMl">$mlMl{name="mlMlCopy"}</p>
  <p name="pCopyMlNl">$mlNl{name="mlNlCopy"}</p>
    `,
        });

        let names = [
            ["/ml", "/pMl"],
            ["/mlMl", "/pMlMl"],
            ["/mlNl", "/pMlNl"],
            ["/mlCopy", "/pCopyMl"],
            ["/mlMlCopy", "/pCopyMlMl"],
            ["/mlNlCopy", "/pCopyMlNl"],
        ];
        async function check_items(maxN: number) {
            let maths = [1, 2, 3].slice(0, maxN);
            let text = maths.join(", ");

            for (let [m, p] of names) {
                await test_mathList({
                    core,
                    name: m,
                    maths,
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
            name: "/maxN",
            core,
        });
        await check_items(maxN);

        maxN = 1;
        await updateMathInputValue({
            latex: maxN.toString(),
            name: "/maxN",
            core,
        });
        await check_items(maxN);
    });

    it("mathList within mathLists, ignore child hide", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList hide="true" name="ml1">a b c</mathList></p>

    <p name="p2"><mathList name="ml2">
      <math>x</math>
      $ml1
      <math hide>y</math>
      $ml1{hide="false"}
    </mathList></p>

    <p name="p3">$ml2{name="ml3" maxNumber="6"}</p>

    `,
        });

        await test_mathList({
            core,
            name: "/ml2",
            maths: ["x", "a", "b", "c", "y", "a", "b", "c"],
            pName: "/p2",
            text: "x, a, b, c, y, a, b, c",
        });

        await test_mathList({
            core,
            name: "/ml3",
            maths: ["x", "a", "b", "c", "y", "a"],
            pName: "/p3",
            text: "x, a, b, c, y, a",
        });
    });

    it("mathList does not force composite replacement, even in boolean", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b">
      <mathList>$nothing x</mathList> = <mathList>x</mathList>
    </boolean>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
    });

    it("assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList assignNames="a b c">x y z</mathList></p>
    <p name="p2">$a, $b, $c</p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq("x, y, z");
        expect(stateVariables["/p2"].stateValues.text).eq("x, y, z");
        expect(stateVariables["/a"].stateValues.value.tree).eq("x");
        expect(stateVariables["/b"].stateValues.value.tree).eq("y");
        expect(stateVariables["/c"].stateValues.value.tree).eq("z");
    });

    it("functionSymbols", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pDefault"><mathList name="mlDefault">f(x) h(x) a(x)</mathList></p>
    <p name="pH"><mathList name="mlH" functionSymbols="h">f(x) h(x) a(x)</mathList></p>
    <p name="pMixed"><mathList name="mlMixed" functionSymbols="h a">
      <math functionSymbols="g">h(x)</math> <math functionSymbols="g">g(x)</math> a(x)
    </mathList></p>
    `,
        });

        await test_mathList({
            core,
            name: "/mlDefault",
            maths: [
                ["apply", "f", "x"],
                ["*", "h", "x"],
                ["*", "a", "x"],
            ],
            pName: "/pDefault",
            text: "f(x), h x, a x",
        });
        await test_mathList({
            core,
            name: "/mlH",
            maths: [
                ["*", "f", "x"],
                ["apply", "h", "x"],
                ["*", "a", "x"],
            ],
            pName: "/pH",
            text: "f x, h(x), a x",
        });
        await test_mathList({
            core,
            name: "/mlMixed",
            maths: [
                ["*", "h", "x"],
                ["apply", "g", "x"],
                ["apply", "a", "x"],
            ],
            pName: "/pMixed",
            text: "h x, g(x), a(x)",
        });
    });

    it("sourcesAreFunctionSymbols", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <math name="fun1">f</math>
      <math name="fun2">g</math>
      <math name="fun3">h</math>
      <math name="fun4">a</math>
    </setup>
    <p name="pDefault"><mathList name="mlDefault">$fun1(x) $fun3(x) $fun4(x)</mathList></p>
    <p name="pH"><mathList name="mlH" sourcesAreFunctionSymbols="fun3">$fun1(x) $fun3(x) $fun4(x)</mathList></p>
    <p name="pMixed"><mathList name="mlMixed" sourcesAreFunctionSymbols="fun3 fun4">
      <math sourcesAreFunctionSymbols="fun2">$fun3(x)</math> <math sourcesAreFunctionSymbols="fun2">$fun2(x)</math> $fun4(x)
    </mathList></p>
    `,
        });

        await test_mathList({
            core,
            name: "/mlDefault",
            maths: [
                ["*", "f", "x"],
                ["*", "h", "x"],
                ["*", "a", "x"],
            ],
            pName: "/pDefault",
            text: "f x, h x, a x",
        });
        await test_mathList({
            core,
            name: "/mlH",
            maths: [
                ["*", "f", "x"],
                ["apply", "h", "x"],
                ["*", "a", "x"],
            ],
            pName: "/pH",
            text: "f x, h(x), a x",
        });
        await test_mathList({
            core,
            name: "/mlMixed",
            maths: [
                ["*", "h", "x"],
                ["apply", "g", "x"],
                ["apply", "a", "x"],
            ],
            pName: "/pMixed",
            text: "h x, g(x), a(x)",
        });
    });

    it("splitSymbols", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pDefault"><mathList name="mlDefault">xy yz</mathList></p>
    <p name="pN"><mathList name="mlN" splitSymbols="false">xy yz</mathList></p>
    <p name="pMixed"><mathList name="mlMixed" splitSymbols="false">
      xy <math splitSymbols>yz</math> <math>zx</math>
    </mathList></p>
    `,
        });

        await test_mathList({
            core,
            name: "/mlDefault",
            maths: [
                ["*", "x", "y"],
                ["*", "y", "z"],
            ],
            pName: "/pDefault",
            text: "x y, y z",
        });
        await test_mathList({
            core,
            name: "/mlN",
            maths: ["xy", "yz"],
            pName: "/pN",
            text: "xy, yz",
        });
        await test_mathList({
            core,
            name: "/mlMixed",
            maths: ["xy", ["*", "y", "z"], "zx"],
            pName: "/pMixed",
            text: "xy, y z, zx",
        });
    });

    it("parseScientificNotation", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pDefault"><mathList name="mlDefault">1E-12 3E2</mathList></p>
    <p name="pP"><mathList name="mlP" parseScientificNotation>1E-12 3E2</mathList></p>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pDefault"].stateValues.text).eq(
            "1 E - 12, 3 E2",
        );
        expect(stateVariables["/pP"].stateValues.text).eq("1 * 10⁻¹², 300");
    });

    it("mathList and rounding, from strings", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList name="ml1" displayDigits="4">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p name="p2"><mathList name="ml2" displayDigits="4" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p name="p3"><mathList name="ml3" displayDecimals="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p name="p4"><mathList name="ml4" displayDecimals="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p name="p5"><mathList name="ml5" displayDecimals="4" displayDigits="3" displaySmallAsZero="false">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p name="p6"><mathList name="ml6" displayDecimals="4" displayDigits="3" displaySmallAsZero="false" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>

    <p name="p1a"><mathList name="ml1a" copySource="ml1" /></p>
    <p name="p2a"><mathList name="ml2a" copySource="ml2" /></p>
    <p name="p3a"><mathList name="ml3a" copySource="ml3" /></p>
    <p name="p4a"><mathList name="ml4a" copySource="ml4" /></p>
    <p name="p5a"><mathList name="ml5a" copySource="ml5" /></p>
    <p name="p6a"><mathList name="ml6a" copySource="ml6" /></p>

    <p name="p1b"><mathList name="ml1b" copySource="ml1" link="false" /></p>
    <p name="p2b"><mathList name="ml2b" copySource="ml2" link="false" /></p>
    <p name="p3b"><mathList name="ml3b" copySource="ml3" link="false" /></p>
    <p name="p4b"><mathList name="ml4b" copySource="ml4" link="false" /></p>
    <p name="p5b"><mathList name="ml5b" copySource="ml5" link="false" /></p>
    <p name="p6b"><mathList name="ml6b" copySource="ml6" link="false" /></p>


    `,
        });

        let vals = [
            2345.1535268, 3.52343, 0.5, 0.00000000000052523,
            0.000000000000000000006,
        ];
        let text1 = ["2345", "3.523", "0.5", "5.252 * 10⁻¹³", "0"].join(", ");
        let text2 = ["2345", "3.523", "0.5000", "5.252 * 10⁻¹³", "0.000"].join(
            ", ",
        );
        let text3 = ["2345.154", "3.523", "0.5", "0", "0"].join(", ");
        let text4 = ["2345.154", "3.523", "0.500", "0.000", "0.000"].join(", ");
        let text5 = [
            "2345.1535",
            "3.5234",
            "0.5",
            "5.25 * 10⁻¹³",
            "6 * 10⁻²¹",
        ].join(", ");
        let text6 = [
            "2345.1535",
            "3.5234",
            "0.5000",
            "5.25 * 10⁻¹³",
            "6.00 * 10⁻²¹",
        ].join(", ");

        for (let post of ["", "a", "b"]) {
            await test_mathList({
                core,
                name: `/ml1${post}`,
                maths: vals,
                pName: `/p1${post}`,
                text: text1,
            });
            await test_mathList({
                core,
                name: `/ml2${post}`,
                maths: vals,
                pName: `/p2${post}`,
                text: text2,
            });
            await test_mathList({
                core,
                name: `/ml3${post}`,
                maths: vals,
                pName: `/p3${post}`,
                text: text3,
            });
            await test_mathList({
                core,
                name: `/ml4${post}`,
                maths: vals,
                pName: `/p4${post}`,
                text: text4,
            });
            await test_mathList({
                core,
                name: `/ml5${post}`,
                maths: vals,
                pName: `/p5${post}`,
                text: text5,
            });
            await test_mathList({
                core,
                name: `/ml6${post}`,
                maths: vals,
                pName: `/p6${post}`,
                text: text6,
            });
        }
    });

    it("mathList and rounding, ignore math and number children attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList name="ml1">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p name="p2"><mathList name="ml2" displayDigits="4">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p name="p3"><mathList name="ml3" displayDigits="4" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p name="p4"><mathList name="ml4" displayDecimals="4">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p name="p5"><mathList name="ml5" displayDecimals="4" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p name="p6"><mathList name="ml6" displayDigits="4" displaySmallAsZero="false">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>

    <p name="p1n"><mathList name="ml1n">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </mathList></p>
    <p name="p2n"><mathList name="ml2n" displayDigits="4">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </mathList></p>
    <p name="p3n"><mathList name="ml3n" displayDigits="4" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </mathList></p>
    <p name="p4n"><mathList name="ml4n" displayDecimals="4">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </mathList></p>
    <p name="p5n"><mathList name="ml5n" displayDecimals="4" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </mathList></p>
    <p name="p6n"><mathList name="ml6n" displayDigits="4" displaySmallAsZero="false">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </mathList></p>
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
        let text6 = ["2345", "3.523", "5", "5.252 * 10⁻¹⁶", "6 * 10⁻²¹"].join(
            ", ",
        );

        for (let post of ["", "n"]) {
            await test_mathList({
                core,
                name: `/ml1${post}`,
                maths: vals,
                pName: `/p1${post}`,
                text: text1,
            });
            await test_mathList({
                core,
                name: `/ml2${post}`,
                maths: vals,
                pName: `/p2${post}`,
                text: text2,
            });
            await test_mathList({
                core,
                name: `/ml3${post}`,
                maths: vals,
                pName: `/p3${post}`,
                text: text3,
            });
            await test_mathList({
                core,
                name: `/ml4${post}`,
                maths: vals,
                pName: `/p4${post}`,
                text: text4,
            });
            await test_mathList({
                core,
                name: `/ml5${post}`,
                maths: vals,
                pName: `/p5${post}`,
                text: text5,
            });
            await test_mathList({
                core,
                name: `/ml6${post}`,
                maths: vals,
                pName: `/p6${post}`,
                text: text6,
            });
        }
    });

    it("mathList and rounding, copy and override", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><mathList name="ml">34.245023482352345 <math displayDigits="7">0.0023823402358234234</math></mathList></p>
    <p name="pDig6"><mathList name="mlDig6" copySource="ml" displayDigits="6" /></p>
    <p name="pDec6"><mathList name="mlDec6" copySource="ml" displayDecimals="6" /></p>
    <p name="pDig6a"><mathList name="mlDig6a" copySource="mlDec6" displayDigits="6" /></p>
    <p name="pDec6a"><mathList name="mlDec6a" copySource="mlDig6" displayDecimals="6" /></p>
    `,
        });

        let vals = [34.245023482352345, 0.0023823402358234234];

        let text = ["34.25", "0.00238"].join(", ");
        let textDig6 = ["34.245", "0.00238234"].join(", ");
        let textDec6 = ["34.245023", "0.002382"].join(", ");

        await test_mathList({
            core,
            name: `/ml`,
            maths: vals,
            pName: `/p`,
            text: text,
        });
        await test_mathList({
            core,
            name: `/mlDig6`,
            maths: vals,
            pName: `/pDig6`,
            text: textDig6,
        });
        await test_mathList({
            core,
            name: `/mlDig6a`,
            maths: vals,
            pName: `/pDig6a`,
            text: textDig6,
        });
        await test_mathList({
            core,
            name: `/mlDec6`,
            maths: vals,
            pName: `/pDec6`,
            text: textDec6,
        });
        await test_mathList({
            core,
            name: `/mlDec6a`,
            maths: vals,
            pName: `/pDec6a`,
            text: textDec6,
        });
    });

    it("mathList adapts to math and text", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathList name="ml"><math>a</math> <math>b</math><math>c</math></mathList>

    <p>Math list as math: <math name="m">$ml</math></p>
    <p>Math list as text: <text name="t">$ml</text></p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/t"].stateValues.value).eq("a, b, c");
    });

    it("mathList adapts to numberList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathList name="ml"><math>9</math> <math>8</math><math>7</math></mathList></p>

    <p name="p2"><numberList name="nl">$ml</numberList></p>
    <p>Change second number: <mathInput name="mi1">$nl[2]</mathInput></p>

    <p>Change 1st and 3rd number via point: <mathInput name="mi2"><point>($nl[1],$nl[3])</point></mathInput></p>

    `,
        });

        async function test_items(n1: number, n2: number, n3: number) {
            let text = [n1, n2, n3].join(", ");
            await test_mathList({
                core,
                name: "/ml",
                maths: [n1, n2, n3],
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
            name: "/mi1",
            core,
        });
        await test_items(n1, n2, n3);

        n1 = -1;
        n3 = 2;
        await updateMathInputValue({
            latex: `(${n1}, ${n3})`,
            name: "/mi2",
            core,
        });
        await test_items(n1, n2, n3);
    });

    it("text and latex from mathList", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathList name="ml">x/y a^b</mathList>

    <p name="pText">Text: $ml.text</p>
    <p name="pLatex">Latex: $ml.latex</p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pText"].stateValues.text).eq("Text: x/y, a^b");
        expect(stateVariables["/pLatex"].stateValues.text).eq(
            "Latex: \\frac{x}{y}, a^{b}",
        );
    });

    it("definition and inverse based on shadowed value from a mathList prop", async () => {
        let core = await createTestCore({
            doenetML: `

    <matchesPattern excludeMatches="a b" name="mp" />

    <p name="p">$mp.excludeMatches{assignNames="ml"}</p>

    <mathInput name="mi">$mp.excludeMatches</mathInput>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        let x1 = "a",
            x2 = "b";
        await test_mathList({
            core,
            name: "/ml",
            maths: [x1, x2],
            pName: "/p",
            text: `${x1}, ${x2}`,
        });

        x1 = "c";
        x2 = "d";
        await updateMathInputValue({
            latex: `${x1}, ${x2}`,
            name: "/mi",
            core,
        });
        await test_mathList({
            core,
            name: "/ml",
            maths: [x1, x2],
            pName: "/p",
            text: `${x1}, ${x2}`,
        });
    });
});
