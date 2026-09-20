import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    submitAnswer,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Sort tag tests @group4", async () => {
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

    it("sort a referenced list with an explicit type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <textList name="names">Ann Cal Bob</textList>
  <p name="pList"><sort type="text">$names Zoe</sort></p>
  `,
        });

        // `type` says what bare strings become; a reference already has a type
        // of its own, so it is passed through rather than wrapped. Wrapping it
        // used to fuse the list into the single value "Ann, Cal, Bob", leaving
        // only two things to sort.
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: ["Ann", "Bob", "Cal", "Zoe"],
            replacements_all_of_type: "text",
        });
    });

    it("sort a referenced list with an explicit type and no strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <numberList name="nums">30 10 20</numberList>
  <p name="pList"><sort type="number">$nums</sort></p>
  `,
        });

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: ["10", "20", "30"],
            replacements_all_of_type: "number",
        });
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

        let sorted_result = ["(-2, 1)", "(0, 1)", "(3, 1)", "(5, 1)", "(7, 1)"];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -8,
            y: 9,
            core,
        });

        sorted_result = ["(-8, 9)", "(-2, 1)", "(3, 1)", "(5, 1)", "(7, 1)"];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: 8,
            y: -3,
            core,
        });

        sorted_result = ["(-8, 9)", "(3, 1)", "(5, 1)", "(7, 1)", "(8, -3)"];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("C"),
            x: 4,
            y: 5,
            core,
        });

        sorted_result = ["(-8, 9)", "(3, 1)", "(4, 5)", "(5, 1)", "(8, -3)"];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("D"),
            x: -9,
            y: 0,
            core,
        });

        sorted_result = ["(-9, 0)", "(-8, 9)", "(4, 5)", "(5, 1)", "(8, -3)"];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("E"),
            x: -2,
            y: -1,
            core,
        });

        sorted_result = ["(-9, 0)", "(-8, 9)", "(-2, -1)", "(4, 5)", "(8, -3)"];

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
            "(-2, 6)",
            "(0, 5)",
            "(3, 2)",
            "(5, 1)",
            "(7, -3)",
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
            "(7, -3)",
            "(5, 1)",
            "(3, 2)",
            "(0, 5)",
            "(-2, 6)",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c2,
            pName: "pC2",
        });

        let unsorted_results = [
            "(0, 5)",
            "(-2, 6)",
            "(7, -3)",
            "(3, 2)",
            "(5, 1)",
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
            "(-2, 6)",
            "(0, 5)",
            "(3, 2)",
            "(5, 1)",
            "(7, -3)",
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
            "(7, -3)",
            "(5, 1)",
            "(3, 2)",
            "(0, 5)",
            "(-2, 6)",
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
            "(7, -3)",
            "(5, 1)",
            "(3, 2)",
            "(-2, 6)",
            "(0, 5)",
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
            "(5, 1)",
            "(0, 5)",
            "(7, -3)",
            "(3, 2)",
            "(-2, 6)",
        ];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result: sorted_result_c2t,
            pName: "pC2T",
        });

        let unsorted_results = [
            "(0, 5)",
            "(-2, 6)",
            "(7, -3)",
            "(3, 2)",
            "(5, 1)",
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
            "(a, b)",
            "(x, y, z)",
            "(s, t, u, v)",
        ];

        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await updateMathInputValue({
            latex: "(a,b,c,d)",
            componentIdx: await resolvePathToNodeIdx("cs"),
            core,
        });

        sorted_result = [
            "x",
            "(a, b)",
            "(x, y, z)",
            "(s, t, u, v)",
            "(a, b, c, d)",
        ];
        await test_sort({ core, resolvePathToNodeIdx, sorted_result });

        await updateMathInputValue({
            latex: "(3,4,5)",
            componentIdx: await resolvePathToNodeIdx("cs"),
            core,
        });

        sorted_result = [
            "x",
            "(a, b)",
            "(x, y, z)",
            "(3, 4, 5)",
            "(s, t, u, v)",
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

    it("string children with no type are read as what they look like", async () => {
        // Words are text and numbers are numbers, so neither needs saying.
        // These used to warn and sort nothing at all.
        for (const [children, sorted] of [
            ["d a b", "a, b, d"],
            ["10 2 1", "1, 2, 10"],
            // Read as numbers, so the half sorts by value and renders as one.
            ["1/2 2 1", "0.5, 1, 2"],
            // Read the way DoenetML reads a number, which is not the way
            // JavaScript reads one. `parseScientificNotation` is declared on 42
            // components and defaults to false, and it recognizes an uppercase
            // exponent only, so `1e3` is never scientific notation and these
            // are words. `0x10` and `0b101` are not a DoenetML notation at all;
            // `<number>` accepts them only because it asks `Number()` first,
            // which is #1849. An author who wants an exponent read can say so
            // with `<math parseScientificNotation="true">`.
            ["1e3 5e2 2e4", "1e3, 2e4, 5e2"],
            ["0x10 9", "0x10, 9"],
            // The math pass has to be Doenet's own reading of a function name,
            // not just any math parser's. `nCr` is a function to both; `min`
            // and `mean` are functions only to Doenet, so read by the other
            // one these sorted as the words `min(1,2)` and `mean(1,2,3)`.
            ["nCr(4,2) 3", "3, 6"],
            ["min(1,2) 3", "1, 3"],
            ["mean(1,2,3) 1", "1, 2"],
        ] as [string, string][]) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<p name="pList"><sort>${children}</sort></p>`,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                    .text,
            ).eq(sorted);
            expect(getDiagnosticsByType(core).warnings.length).eq(0);
        }
    });

    it("one non-numeric string sends the whole list to text", async () => {
        // The same rule the values follow when they arrive as components: a
        // list is numeric only if every one of them is, so `10` sorts before
        // `2` here exactly as it would in a `<textList>`.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="pList"><sort>10 2 x</sort></p>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq("10, 2, x");
        expect(getDiagnosticsByType(core).warnings.length).eq(0);
    });

    it("sugar with invalid type reports it and reads the children anyway", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort type="bad">d a b</sort></p>
  `,
        });

        const sorted_result = ["a", "b", "d"];

        // Read as text, which is what three words are — the invalid value is
        // dropped rather than replaced by a guess, so the children are read as
        // though no type had been written.
        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result,
            replacements_all_of_type: "text",
        });

        let diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.warnings[0].message).contain(
            "Invalid type bad for sort component",
        );
        expect(diagnosticsByType.warnings[0].message).contain(
            "reading the values as though no type had been given",
        );
    });

    // The round trip these were written for: type into a sorted position, save,
    // reload, and get back the list that was on screen. They come from the
    // `<sort>` rearrangement work (Doenet/DoenetML#1949), which is where the
    // keying defects in this file were found.
    //
    // Recorded for what they are, because it is not what it looks like: each
    // passes with `<sort>`'s `stateIdInfo` removed. Typing into `$s[n]` does
    // not write to the replacement -- the write is inverted through to the
    // `<sort>`'s own child, which is why the saved key is `/~s/2` and not a
    // replacement's. The assertion that does need the minted ids is the last
    // one in this block; the one that needs `UpdateExecutor`'s guard against a
    // component deleted mid-update is in `statePersistenceContents`.
    async function typeThenReload({
        doenetML,
        latex,
    }: {
        doenetML: string;
        latex: string;
    }) {
        const first = await createTestCore({ doenetML });
        await updateMathInputValue({
            latex,
            componentIdx: await first.resolvePathToNodeIdx("mi"),
            core: first.core,
        });

        async function sortedValues({
            core,
            resolvePathToNodeIdx,
        }: {
            core: PublicDoenetMLCore;
            resolvePathToNodeIdx: ResolvePathToNodeIdx;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[
                await resolvePathToNodeIdx("pList")
            ].activeChildren.map((child: any) =>
                stateVariables[child.componentIdx].stateValues.value.toString(),
            );
        }

        const live = await sortedValues(first);

        await first.core.saveImmediately();
        const savedState = first.scoreState.state as string;

        const second = await createTestCore({
            doenetML,
            initialState: savedState,
        });

        return { live, reloaded: await sortedValues(second), savedState };
    }

    it("a value typed into a sorted position survives a reload", async () => {
        const { live, reloaded } = await typeThenReload({
            doenetML: `
    <sort name="s">5 3 1</sort>
    <p name="pList">$s</p>
    <mathInput name="mi" bindValueTo="$s[1]" />
  `,
            latex: "7",
        });

        expect(live).eqls(["3", "5", "7"]);
        expect(reloaded).eqls(live);
    });

    it("a value typed into the second sorted position survives a reload", async () => {
        const { live, reloaded } = await typeThenReload({
            doenetML: `
    <sort name="s">5 3 1</sort>
    <p name="pList">$s</p>
    <mathInput name="mi" bindValueTo="$s[2]" />
  `,
            latex: "0",
        });

        expect(live).eqls(["0", "1", "5"]);
        expect(reloaded).eqls(live);
    });

    it("a value typed into the last sorted position survives a reload", async () => {
        const { live, reloaded } = await typeThenReload({
            doenetML: `
    <sort name="s">2 4 6 8</sort>
    <p name="pList">$s</p>
    <mathInput name="mi" bindValueTo="$s[4]" />
  `,
            latex: "1",
        });

        expect(live).eqls(["1", "2", "4", "6"]);
        expect(reloaded).eqls(live);
    });

    it("gives its replacements ids that a rebuild reproduces", async () => {
        // The round trips above pass either way; this is the assertion that
        // does not. The replacements have to carry an id the composite minted
        // off its own document-derived id, so that a second build of the same
        // document hands them the same ids. Without it
        // `createNewComponentIndices` clears `stateId` and the key falls back
        // to `componentIdx`, a position in the build.
        //
        // Across builds of the same document, that is: a reorder recreates
        // every replacement with fresh ids, so this says nothing about work
        // done on a replacement a later reorder recreates (see `Sort.js`).
        const doenetML = `
    <sort name="s">5 3 1</sort>
    <p name="pList">$s</p>
  `;

        async function replacementStateIds() {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            const components = core.core!._components!;
            const composite = components[await resolvePathToNodeIdx("s")];
            return {
                prefix: `${composite.stateId}|`,
                stateIds: composite.replacements.map(
                    (replacement: any) =>
                        components[replacement.componentIdx].stateId,
                ),
            };
        }

        const { prefix, stateIds } = await replacementStateIds();
        expect(stateIds.length).eq(3);
        for (const stateId of stateIds) {
            // Minted by the composite, off its own document-derived id — not
            // the component index, which is reassigned on every build.
            expect(
                stateId,
                `a sort replacement fell back to its component index: ${stateId}`,
            ).satisfy(
                (id: string) =>
                    id.startsWith(prefix) &&
                    /^\d+$/.test(id.slice(prefix.length)),
            );
        }
        expect(new Set(stateIds).size, "two replacements share an id").eq(3);

        // The property the saved state actually depends on: a second build of
        // the same document hands the same replacements the same ids.
        expect((await replacementStateIds()).stateIds).eqls(stateIds);
    });

    it("string children ignored when mixed with non-string children with warning", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sort>
        <math>d</math> a <math>b</math>
    </sort></p>
  `,
        });

        const sorted_result = ["b", "d"];

        await test_sort({
            core,
            resolvePathToNodeIdx,
            sorted_result,
            replacements_all_of_type: "math",
        });

        let diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings.length).gte(1);
        expect(
            diagnosticsByType.warnings.some((w) =>
                w.message.includes(
                    'String " a " is not a valid component to sort.',
                ),
            ),
        ).eq(true);
    });
    describe("reordering reuses the replacements", async () => {
        async function replacementIndices(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            name: string,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[
                await resolvePathToNodeIdx(name)
            ].replacements!.map((x) => x.componentIdx);
        }

        it("a value moving past another keeps every replacement component", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="m" prefill="3" />
    <sort name="s">5 $m 1 20 30</sort>
    <p name="pList">$s</p>
    <p name="pSecond">$s[2]</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "3", "5", "20", "30"],
            });

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            // 3 becomes 9, which sorts past 5 rather than before it
            await updateMathInputValue({
                latex: "9",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "5", "9", "20", "30"],
            });

            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            // The same components, moved: recreating them would have handed
            // out fresh indices.
            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);

            // an index into the sort follows the new order
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pSecond")]
                    .stateValues.text,
            ).eq("5");
        });

        it("a reorder that moves nearly everything rebuilds instead", async () => {
            // What rearranging saves is the replacements that stay put, so a
            // step that moves almost all of them saves nothing and costs the
            // move on top of the rebuild that whatever copies the list pays
            // anyway. Past half the list moving, `<sort>` rebuilds.
            //
            // `1 2 3 4 $m` with `m` at 5 is already sorted. Dropping `m` below
            // 1 shifts all five entries by one, leaving none where it was.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="m" prefill="5" />
    <sort name="s">1 2 3 4 $m</sort>
    <p name="pList">$s</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "2", "3", "4", "5"],
            });

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            await updateMathInputValue({
                latex: "0",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["0", "1", "2", "3", "4"],
            });

            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            // Rebuilt, so every replacement has a fresh index.
            expect(after.length).eq(before.length);
            expect(
                after.some((idx) => before.includes(idx)),
                "expected a rebuild, but some replacement survived",
            ).eq(false);

            // Moving it back one place leaves three of the five where they
            // are, so that one rearranges and the components survive.
            await updateMathInputValue({
                latex: "1.5",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "1.5", "2", "3", "4"],
            });

            const rearranged = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            expect([...rearranged].sort()).eqls([...after].sort());
            expect(rearranged).not.eqls(after);
        });

        it("exactly half the replacements staying put still rearranges", async () => {
            // The cut point itself: `1 2 $m 4` with `m` at 3 is already
            // sorted, and dropping `m` between 1 and 2 leaves the first and
            // last of the four where they were — half of them.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="m" prefill="3" />
    <sort name="s">1 2 $m 4</sort>
    <p name="pList">$s</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "2", "3", "4"],
            });

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            await updateMathInputValue({
                latex: "1.5",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "1.5", "2", "4"],
            });

            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);
        });

        it("a repeated child is matched off in order", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="m" prefill="4" />
    <setup><math name="a">2</math></setup>
    <sort name="s"
        >$a $m $a <number>20</number><number>30</number
        ><number>40</number></sort
    >
    <p name="pList">$s</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["2", "2", "4", "20", "30", "40"],
            });

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            await updateMathInputValue({
                latex: "-1",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["-1", "2", "2", "20", "30", "40"],
            });

            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);
        });

        it("a changed set of children still recreates", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="3" />
    <sequence name="seq" from="1" to="$n" />
    <sort name="s">$seq</sort>
    <p name="pList">$s</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "2", "3"],
            });

            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "2", "3", "4", "5"],
            });

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "2"],
            });
        });

        it("a copy of the sort is reordered with it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="m" prefill="3" />
    <sort name="s">5 $m 1 20 30</sort>
    <p name="pList">$s</p>
    <p name="pCopy">$s</p>
    <p name="pCopySecond">$s[2]</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "3", "5", "20", "30"],
                pName: "pCopy",
            });

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            await updateMathInputValue({
                latex: "9",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "5", "9", "20", "30"],
                pName: "pCopy",
            });

            // The sort rearranged rather than rebuilt, which is the case this
            // test is about: the copy follows a rearrangement.
            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );
            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pCopySecond")]
                    .stateValues.text,
            ).eq("5");
        });

        it("a prop reference follows the reorder", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <graph name="g">
      <point name="A">(5,0)</point>
      <point name="B">(2,0)</point>
      <point name="C">(9,0)</point>
      <point name="D">(200,0)</point>
      <point name="E">(300,0)</point>
    </graph>
    <sort name="s">$A $B $C $D $E</sort>
    <p name="pList">$s</p>
    <p name="pProp">$s.x</p>
  `,
            });

            async function expectProp(text: string) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx("pProp")]
                        .stateValues.text,
                ).eq(text);
            }

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: [
                    "(2, 0)",
                    "(5, 0)",
                    "(9, 0)",
                    "(200, 0)",
                    "(300, 0)",
                ],
            });
            await expectProp("2, 5, 9, 200, 300");

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            await movePoint({
                componentIdx: await resolvePathToNodeIdx("A"),
                x: 100,
                y: 0,
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: [
                    "(2, 0)",
                    "(9, 0)",
                    "(100, 0)",
                    "(200, 0)",
                    "(300, 0)",
                ],
            });
            await expectProp("2, 9, 100, 200, 300");

            // The prop reference is following a rearrangement rather than a
            // rebuild.
            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );
            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);
        });

        it("a list that empties and refills", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="0" />
    <sequence name="seq" from="1" to="$n" />
    <sort name="s">$seq</sort>
    <p name="pList">$s</p>
  `,
            });

            // Nothing to sort: the composite has no replacements to keep.
            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: [],
            });

            for (const [latex, sorted_result] of [
                ["3", ["1", "2", "3"]],
                ["0", []],
                ["1", ["1"]],
            ] as [string, string[]][]) {
                await updateMathInputValue({
                    latex,
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });

                await test_sort({ core, resolvePathToNodeIdx, sorted_result });
            }
        });

        it("values that do not parse as numbers are rearranged like any other", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="m" prefill="3" />
    <numberList name="nl">x y</numberList>
    <sort name="s">5 $m 1 $nl</sort>
    <p name="pList">$s</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "3", "5", "NaN", "NaN"],
            });

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            await updateMathInputValue({
                latex: "9",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "5", "9", "NaN", "NaN"],
            });

            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);
        });

        it("replacements of different types carry their types into the new order", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="m" prefill="3" />
    <setup><number name="five">5</number><math name="one">1</math
        ><math name="twenty">20</math><number name="thirty">30</number></setup>
    <sort name="s">$five $m $one $twenty $thirty</sort>
    <p name="pList">$s</p>
  `,
            });

            async function replacementTypes() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[
                    await resolvePathToNodeIdx("pList")
                ].activeChildren.map(
                    (child) => stateVariables[child.componentIdx].componentType,
                );
            }

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "3", "5", "20", "30"],
            });
            expect(await replacementTypes()).eqls([
                "math",
                "math",
                "number",
                "math",
                "number",
            ]);

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            // 3 becomes 9, so the number moves out of third place
            await updateMathInputValue({
                latex: "9",
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: ["1", "5", "9", "20", "30"],
            });
            expect(await replacementTypes()).eqls([
                "math",
                "number",
                "math",
                "math",
                "number",
            ]);

            // The types travel with the components, so this has to be the
            // rearranging path rather than a rebuild that would have made
            // them afresh.
            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );
            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);
        });

        it("sorted points stay live after they reorder", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <graph name="g">
      <point name="A">(1,0)</point>
      <point name="B">(2,0)</point>
      <point name="C">(3,0)</point>
      <point name="D">(100,0)</point>
      <point name="E">(200,0)</point>
      <point name="F">(300,0)</point>
    </graph>
    <graph name="g2"><sort name="s">$A $B $C $D $E $F</sort></graph>
    <p name="pList">$s</p>
  `,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: [
                    "(1, 0)",
                    "(2, 0)",
                    "(3, 0)",
                    "(100, 0)",
                    "(200, 0)",
                    "(300, 0)",
                ],
            });

            const before = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            // move A past the others, so the sorted order changes
            await movePoint({
                componentIdx: await resolvePathToNodeIdx("A"),
                x: 10,
                y: 0,
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: [
                    "(2, 0)",
                    "(3, 0)",
                    "(10, 0)",
                    "(100, 0)",
                    "(200, 0)",
                    "(300, 0)",
                ],
            });

            const after = await replacementIndices(
                core,
                resolvePathToNodeIdx,
                "s",
            );

            expect([...after].sort()).eqls([...before].sort());
            expect(after).not.eqls(before);

            // the rearranged copies still track the points they copy
            await movePoint({
                componentIdx: await resolvePathToNodeIdx("B"),
                x: 20,
                y: 0,
                core,
            });

            await test_sort({
                core,
                resolvePathToNodeIdx,
                sorted_result: [
                    "(3, 0)",
                    "(10, 0)",
                    "(20, 0)",
                    "(100, 0)",
                    "(200, 0)",
                    "(300, 0)",
                ],
            });
        });
    });
});
