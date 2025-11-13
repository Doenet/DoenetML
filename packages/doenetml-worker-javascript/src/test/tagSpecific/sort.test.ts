import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    submitAnswer,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Sort tag tests", async () => {
    async function test_sort({
        core,
        resolvePathToNodeIdx,
        sorted_result,
        pName = "pList",
        replacements_all_of_type,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        sorted_result: string[];
        pName?: string;
        replacements_all_of_type?: string;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        const pText = sorted_result.join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx(pName)].stateValues.text,
        ).eq(pText);

        if (replacements_all_of_type) {
            let replacementTypes = stateVariables[
                await resolvePathToNodeIdx(pName)
            ].activeChildren.map(
                (child) => stateVariables[child.componentIdx].componentType,
            );

            expect(replacementTypes).eqls(
                Array(sorted_result.length).fill(replacements_all_of_type),
            );
        }
    }

    it("sort numbers and math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort>
        <number>3</number>
        <math>pi</math>
        <math>1</math>
        <math>e</math>
        <number displayDigits="5">sqrt(2)</number>
        <math>sqrt(3)</math>
        <numberList>-3 10 2</numberList>
        <mathList>log(2) 1/e sin(2) -2/3</mathList>
    </sort></p>
  `,
        });

        const sorted_result = [
            "-3",
            "-2/3",
            "1/e",
            "log(2)",
            "sin(2)",
            "1",
            "1.4142",
            "sqrt(3)",
            "2",
            "e",
            "3",
            "π",
            "10",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });
    });

    it("sort dynamic maths", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Values to sort: 
  <mathInput name="m1" prefill="sqrt(2)" />
  <mathInput name="m2" prefill="5/6" />
  <mathInput name="m3" prefill="Infinity" />
  <mathInput name="m4" prefill="-Infinity" />
  </p>
  <p name="pList"><sort>
    $m1$m2$m3
    <number>$m4</number>
    <number>70</number>
    <math>-pi</math>
  </sort></p>
  `,
        });

        let sorted_result = ["-∞", "-π", "5/6", "sqrt(2)", "70", "∞"];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        // change first value
        await updateMathInputValue({
            latex: "-5",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });

        sorted_result = ["-∞", "-5", "-π", "5/6", "70", "∞"];
        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        // change second value
        await updateMathInputValue({
            latex: "e^5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });

        sorted_result = ["-∞", "-5", "-π", "70", "e⁵", "∞"];
        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        // change third value
        await updateMathInputValue({
            latex: "-100",
            componentIdx: await resolvePathToNodeIdx("m3"),
            core,
        });

        sorted_result = ["-∞", "-100", "-5", "-π", "70", "e⁵"];
        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        // change fourth value
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("m4"),
            core,
        });

        sorted_result = ["-100", "-5", "-π", "0", "70", "e⁵"];
        await test_sort({ core, resolvePathToNodeIdx, sorted_result });
    });

    it("sort nested lists of numbers and math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="pList"><sort>
    <numberList displayDigits="5">
      <numberList>
        <numberList>
          <number>sqrt(2)</number><number>10</number>
        </numberList>
        <numberList>2</numberList>
        <number>3</number>
      </numberList>
      <numberList>-3</numberList>
    </numberList>
    <mathList>
      <mathList>sqrt(3) 1/e</mathList>
      <mathList>
        <mathList>e pi</mathList>
        <mathList>
          <mathList>log(2) 1</mathList>
          <mathList>
            <mathList>sin(2) -2/3</mathList>
          </mathList>
        </mathList>
      </mathList>
    </mathList>
  </sort></p>
  `,
        });

        const sorted_result = [
            "-3",
            "-2/3",
            "1/e",
            "log(2)",
            "sin(2)",
            "1",
            "1.4142",
            "sqrt(3)",
            "2",
            "e",
            "3",
            "π",
            "10",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });
    });

    it("sort points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="A">(0,1)</point>
    <point name="B">(-2,1)</point>
    <point name="C">(7,1)</point>
    <point name="D">(3,1)</point>
    <point name="E">(5,1)</point>

    <p name="pList"><sort>$A$B$C$D$E</sort></p>
  `,
        });

        let sorted_result = [
            "( -2, 1 )",
            "( 0, 1 )",
            "( 3, 1 )",
            "( 5, 1 )",
            "( 7, 1 )",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -8,
            y: 9,
            core,
        });

        sorted_result = [
            "( -8, 9 )",
            "( -2, 1 )",
            "( 3, 1 )",
            "( 5, 1 )",
            "( 7, 1 )",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: 8,
            y: -3,
            core,
        });

        sorted_result = [
            "( -8, 9 )",
            "( 3, 1 )",
            "( 5, 1 )",
            "( 7, 1 )",
            "( 8, -3 )",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("C"),
            x: 4,
            y: 5,
            core,
        });

        sorted_result = [
            "( -8, 9 )",
            "( 3, 1 )",
            "( 4, 5 )",
            "( 5, 1 )",
            "( 8, -3 )",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("D"),
            x: -9,
            y: 0,
            core,
        });

        sorted_result = [
            "( -9, 0 )",
            "( -8, 9 )",
            "( 4, 5 )",
            "( 5, 1 )",
            "( 8, -3 )",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("E"),
            x: -2,
            y: -1,
            core,
        });

        sorted_result = [
            "( -9, 0 )",
            "( -8, 9 )",
            "( -2, -1 )",
            "( 4, 5 )",
            "( 8, -3 )",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });
    });

    it("sort points by component", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="A">(0,5)</point>
    <point name="B">(-2,6)</point>
    <point name="C">(7,-3)</point>
    <point name="D">(3,2)</point>
    <point name="E">(5,1)</point>

    <p name="pDefault"><sort>$A$B$C$D$E</sort></p>
    <p name="pC1"><sort sortByComponent="1">$A$B$C$D$E</sort></p>
    <p name="pC2"><sort sortByComponent="2">$A$B$C$D$E</sort></p>
    <p name="pC3"><sort sortByComponent="3">$A$B$C$D$E</sort></p>
  `,
        });

        let sorted_result_c1 = [
            "( -2, 6 )",
            "( 0, 5 )",
            "( 3, 2 )",
            "( 5, 1 )",
            "( 7, -3 )",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1,
            pName: "pDefault",
        });

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1,
            pName: "pC1",
        });

        let sorted_result_c2 = [
            "( 7, -3 )",
            "( 5, 1 )",
            "( 3, 2 )",
            "( 0, 5 )",
            "( -2, 6 )",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c2,
            pName: "pC2",
        });

        let unsorted_results = [
            "( 0, 5 )",
            "( -2, 6 )",
            "( 7, -3 )",
            "( 3, 2 )",
            "( 5, 1 )",
        ];
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: unsorted_results,
            pName: "pC3",
        });
    });

    it("sort vectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vector name="A" displacement="(0,5)" tail="(5,2)" />
    <vector name="B" displacement="(-2,6)" tail="(3,7)" />
    <vector name="C" displacement="(7,-3)" tail="(-4,5)" />
    <vector name="D" displacement="(3,2)" tail="(1,6)" />
    <vector name="E" displacement="(5,1)" tail="(0,-3)" />

    <p name="pDefault"><sort>$A$B$C$D$E</sort></p>
    <p name="pD"><sort sortVectorsBy="displacement">$A$B$C$D$E</sort></p>
    <p name="pT"><sort sortVectorsBy="tail">$A$B$C$D$E</sort></p>

    <p name="pC1Default"><sort sortByComponent="1">$A$B$C$D$E</sort></p>
    <p name="pC1D"><sort sortVectorsBy="displacement" sortByComponent="1">$A$B$C$D$E</sort></p>
    <p name="pC1T"><sort sortVectorsBy="tail" sortByComponent="1">$A$B$C$D$E</sort></p>

    <p name="pC2Default"><sort sortByComponent="2">$A$B$C$D$E</sort></p>
    <p name="pC2D"><sort sortVectorsBy="displacement" sortByComponent="2">$A$B$C$D$E</sort></p>
    <p name="pC2T"><sort sortVectorsBy="tail" sortByComponent="2">$A$B$C$D$E</sort></p>

    <p name="pC3Default"><sort sortByComponent="3">$A$B$C$D$E</sort></p>
    <p name="pC3D"><sort sortVectorsBy="displacement" sortByComponent="3">$A$B$C$D$E</sort></p>
    <p name="pC3T"><sort sortVectorsBy="tail" sortByComponent="3">$A$B$C$D$E</sort></p>
  `,
        });

        let sorted_result_c1d = [
            "( -2, 6 )",
            "( 0, 5 )",
            "( 3, 2 )",
            "( 5, 1 )",
            "( 7, -3 )",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1d,
            pName: "pDefault",
        });
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1d,
            pName: "pD",
        });
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1d,
            pName: "pC1Default",
        });
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1d,
            pName: "pC1D",
        });

        let sorted_result_c2d = [
            "( 7, -3 )",
            "( 5, 1 )",
            "( 3, 2 )",
            "( 0, 5 )",
            "( -2, 6 )",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c2d,
            pName: "pC2Default",
        });
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c2d,
            pName: "pC2D",
        });

        let sorted_result_c1t = [
            "( 7, -3 )",
            "( 5, 1 )",
            "( 3, 2 )",
            "( -2, 6 )",
            "( 0, 5 )",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1t,
            pName: "pT",
        });
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c1t,
            pName: "pC1T",
        });

        let sorted_result_c2t = [
            "( 5, 1 )",
            "( 0, 5 )",
            "( 7, -3 )",
            "( 3, 2 )",
            "( -2, 6 )",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c2t,
            pName: "pC2T",
        });

        let unsorted_results = [
            "( 0, 5 )",
            "( -2, 6 )",
            "( 7, -3 )",
            "( 3, 2 )",
            "( 5, 1 )",
        ];
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: unsorted_results,
            pName: "pC3Default",
        });
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: unsorted_results,
            pName: "pC3D",
        });
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: unsorted_results,
            pName: "pC3T",
        });
    });

    it("sort by prop", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `


  <p>Coords for last point: <mathInput name="cs" /></p>
  <p name="pList"><sort sortByProp="NUMDIMENSIONS">
    <point>(a,b)</point>
    <point>x</point>
    <point xs="s t u v" />
    <point x="x" y="y" z="z" />
    <point coords="$cs" />
  </sort></p>
  `,
        });

        let sorted_result = [
            "x",
            "\uff3f",
            "( a, b )",
            "( x, y, z )",
            "( s, t, u, v )",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await updateMathInputValue({
            latex: "(a,b,c,d)",
            componentIdx: await resolvePathToNodeIdx("cs"),
            core,
        });

        sorted_result = [
            "x",
            "( a, b )",
            "( x, y, z )",
            "( s, t, u, v )",
            "( a, b, c, d )",
        ];
        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await updateMathInputValue({
            latex: "(3,4,5)",
            componentIdx: await resolvePathToNodeIdx("cs"),
            core,
        });

        sorted_result = [
            "x",
            "( a, b )",
            "( x, y, z )",
            "( 3, 4, 5 )",
            "( s, t, u, v )",
        ];
        await test_sort({ core, resolvePathToNodeIdx, sorted_result });
    });

    it("sort texts", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort>
        <text>banana</text>
        <text>apple</text>
        <text>pear</text>
        <textList>grape cherry kiwi</textList>
        <text>strawberry</text>
        <text>mango</text>
        <text>passion fruit</text>
        <textList>orange boysenberry fig currant</textList>
    </sort></p>
  `,
        });

        const sorted_result = [
            "apple",
            "banana",
            "boysenberry",
            "cherry",
            "currant",
            "fig",
            "grape",
            "kiwi",
            "mango",
            "orange",
            "passion fruit",
            "pear",
            "strawberry",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result,
            replacements_all_of_type: "text",
        });
    });

    it("sort texts, numbers, maths", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort>
        <text>b</text>
        <number>3</number>
        <math>5</math>
        <textList>1 z 15 orange</textList>
        <math>x</math>
        <number>222</number>
        <mathList>8 u</mathList>
        <numberList>99 765</numberList>
    </sort></p>
  `,
        });

        const sorted_result = [
            "1",
            "15",
            "222",
            "3",
            "5",
            "765",
            "8",
            "99",
            "b",
            "orange",
            "u",
            "x",
            "z",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result,
        });
    });

    it("sort sugar type math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort type="math">
    z b a x y c 
    </sort></p>
  `,
        });

        const sorted_result = ["a", "b", "c", "x", "y", "z"];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result,
            replacements_all_of_type: "math",
        });
    });

    it("sort sugar type number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort type="number">
        101 542 817 527 51 234 801
    </sort></p>
  `,
        });

        const sorted_result = ["51", "101", "234", "527", "542", "801", "817"];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result,
            replacements_all_of_type: "number",
        });
    });

    it("sort sugar type text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort type="text">
        orange
        apple
        banana
        almost
        above
    </sort></p>
  `,
        });

        const sorted_result = ["above", "almost", "apple", "banana", "orange"];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result,
            replacements_all_of_type: "text",
        });
    });

    it("asList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="pList"><sort name="sh" type="math">
    z b a x y c 
  </sort></p>
  <p name="pNoList"><sort extend="$sh" asList="false" /></p>
  `,
        });

        const sorted_result = ["a", "b", "c", "x", "y", "z"];

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(sorted_result.join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("pNoList")].stateValues
                .text,
        ).eq(sorted_result.join(""));
    });

    it("by name and index", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <sort name="xs">
    <math>y</math>
    <math>x</math>
    <mathList>a d c b</mathList>
    <math>z</math>
    <mathList>2 3 1 4</mathList>
    <math>q</math>
  </sort>
  `,
        });

        let sorted_result = [
            1,
            2,
            3,
            4,
            "a",
            "b",
            "c",
            "d",
            "q",
            "x",
            "y",
            "z",
        ];

        const stateVariables = await core.returnAllStateVariables(false, true);

        const result: any[] = [];

        for (let i = 0; i < 12; i++) {
            result.push(
                stateVariables[await resolvePathToNodeIdx(`xs[${i + 1}]`)]
                    .stateValues.value.tree,
            );
        }

        expect(result.sort()).eqls(sorted_result.sort());
    });

    it("in answer award", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

<answer name="ans">
  <award><when allowedErrorInNumbers="0.1">
    <sort>$x</sort> = $y
  </when></award>
</answer>

<numberList name="y">3 4</numberList>
<numberList name="x">4 3</numberList>

  `,
        });

        const ansIdx = await resolvePathToNodeIdx("ans");

        await submitAnswer({ componentIdx: ansIdx, core });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[ansIdx].stateValues.creditAchieved).eq(1);
    });
});
