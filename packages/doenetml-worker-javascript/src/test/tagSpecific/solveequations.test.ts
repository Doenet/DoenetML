import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import me from "math-expressions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function check_solutions(
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    solutions: number[],
) {
    const numSolutions = solutions.length;
    const stateVariables = await core.returnAllStateVariables(false, true);
    expect(
        stateVariables[await resolvePathToNodeIdx("solve")].stateValues
            .numSolutions,
    ).eq(numSolutions);
    expect(
        stateVariables[await resolvePathToNodeIdx("solve")].stateValues
            .solutions.length,
    ).eq(numSolutions);
    for (let i = 0; i < numSolutions; i++) {
        expect(
            stateVariables[await resolvePathToNodeIdx("solve")].stateValues
                .solutions[i].tree,
        ).closeTo(solutions[i], 1e-5);
    }
    expect(
        stateVariables[await resolvePathToNodeIdx("num")].stateValues.value,
    ).eq(numSolutions);
    expect(
        stateVariables[await resolvePathToNodeIdx("sols")].stateValues.text,
    ).eq(
        `Solutions: ${solutions.map((x) => me.round_numbers_to_precision_plus_decimals(x, 5)).join(", ")}`,
    );
}

describe("SolveEquations tag tests", async () => {
    it("solve single equation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>variable: <mathInput name="var" prefill="x" /></p>
  <p>equation: <mathInput name="equation" prefill="x^2-1=0" /></p>
  <solveEquations name="solve" variables="$var">$equation</solveEquations>
  <p>Number of solutions: <number extend="$solve.numSolutions" name="num" /></p>
  <p name="sols">Solutions: <mathList extend="$solve.solutions" displayDigits="5" /></p>
  `,
        });

        await check_solutions(core, resolvePathToNodeIdx, [-1, 1]);

        await updateMathInputValue({
            latex: "\\exp(-a)a^2 = e^{-a}a",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("var"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [0, 1]);

        await updateMathInputValue({
            latex: "x_1",
            componentIdx: await resolvePathToNodeIdx("var"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "x_1 - 0.1\\exp(x_1)=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [0.111833, 3.57715]);

        await updateMathInputValue({
            latex: "ab=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "b",
            componentIdx: await resolvePathToNodeIdx("var"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [0]);

        await updateMathInputValue({
            latex: "\\sin(10b) = b^3",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });

        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [-0.870457, -0.657084, -0.311147, 0, 0.311147, 0.657084, 0.870457],
        );

        await updateMathInputValue({
            latex: "b^2+0.1b=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [-0.1, 0]);
    });

    it("solve single equation, minVar and maxVar", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>variable: <mathInput name="var" prefill="x" /></p>
  <p>minVar: <mathInput name="minVar" prefill="-1" /></p>
  <p>maxVar: <mathInput name="maxVar" prefill="1" /></p>
  <p>equation: <mathInput name="equation" prefill="x^2+1=0" /></p>
  <solveEquations name="solve" variables="$var" minVar="$minVar" maxVar="$maxVar">$equation</solveEquations>
  <p>Number of solutions: <number extend="$solve.numSolutions" name="num" /></p>
  <p name="sols">Solutions: <mathList extend="$solve.solutions" displayDigits="5" displaySmallAsZero="10^(-9)" /></p>
  `,
        });

        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "x^2-a=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "x_1",
            componentIdx: await resolvePathToNodeIdx("var"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "x_1 - 0.1\\exp(x_1)=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [0.111833]);

        await updateMathInputValue({
            latex: "100",
            componentIdx: await resolvePathToNodeIdx("maxVar"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [0.111833, 3.57715]);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("minVar"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [3.57715]);

        await updateMathInputValue({
            latex: "ab=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await updateMathInputValue({
            latex: "b",
            componentIdx: await resolvePathToNodeIdx("var"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("minVar"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [0]);

        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("maxVar"),
            core,
        });

        await updateMathInputValue({
            latex: "\\sin(10b) = b^3",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [0, 0.311147, 0.657084, 0.870457],
        );
        await updateMathInputValue({
            latex: "-10",
            componentIdx: await resolvePathToNodeIdx("minVar"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [-0.870457, -0.657084, -0.311147, 0, 0.311147, 0.657084, 0.870457],
        );

        await updateMathInputValue({
            latex: "\\sin(\\pi b) = 0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await updateMathInputValue({
            latex: "-10.1",
            componentIdx: await resolvePathToNodeIdx("minVar"),
            core,
        });
        await updateMathInputValue({
            latex: "10.1",
            componentIdx: await resolvePathToNodeIdx("maxVar"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [...Array(21).keys()].map((i) => i - 10),
        );

        await updateMathInputValue({
            latex: "b^2-0.001b = 0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        // TODO: maybe shouldn't hard code this exact answer,
        // as the real solution should be 0.001.
        await check_solutions(core, resolvePathToNodeIdx, [0, 0.00099997]);

        await updateMathInputValue({
            latex: "(b+0.03)(b+0.0301) = 0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [-0.0301, -0.03]);

        await updateMathInputValue({
            latex: "(b+0.03)(b+0.0301) = -0.1",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, []);

        await updateMathInputValue({
            latex: "43.241(b+4.52352)(b+4.52365)(b-8.58230)(b-8.58263) = 0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [-4.52365, -4.52352, 8.5823, 8.58263],
        );

        await updateMathInputValue({
            latex: "\\exp(43.241(b+4.52352)(b+4.52365)(b-8.58230)(b-8.58263)) = 1",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [-4.52365, -4.52352, 8.5823, 8.58263],
        );

        await updateMathInputValue({
            latex: "\\cos(\\pi b) + 1=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [...Array(10).keys()].map((i) => 2 * i - 9),
        );

        await updateMathInputValue({
            latex: "\\cos(\\pi b)=1",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [...Array(11).keys()].map((i) => 2 * i - 10),
        );

        await updateMathInputValue({
            latex: "-10",
            componentIdx: await resolvePathToNodeIdx("minVar"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [...Array(11).keys()].map((i) => 2 * i - 10),
        );

        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("maxVar"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [...Array(11).keys()].map((i) => 2 * i - 10),
        );

        await updateMathInputValue({
            latex: "-10.0001",
            componentIdx: await resolvePathToNodeIdx("minVar"),
            core,
        });
        await check_solutions(
            core,
            resolvePathToNodeIdx,
            [...Array(11).keys()].map((i) => 2 * i - 10),
        );

        await updateMathInputValue({
            latex: "\\sqrt{b-\\pi}=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [Math.PI]);

        await updateMathInputValue({
            latex: "\\sqrt{b^2-\\pi^2}=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [-Math.PI, Math.PI]);

        await updateMathInputValue({
            latex: "\\sqrt{\\pi^2-b^2}=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [-Math.PI, Math.PI]);

        await updateMathInputValue({
            latex: "10000000000\\sqrt{\\pi^2-b^2}=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [-Math.PI, Math.PI]);

        await updateMathInputValue({
            latex: "0.00000000000000000001\\sqrt{\\pi^2-b^2}=0",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        await check_solutions(core, resolvePathToNodeIdx, [-Math.PI, Math.PI]);
    });

    it("handle bad equation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <solveEquations name="solve">x_(2t)=1</solveEquations>
  <p>Number of solutions: <number extend="$solve.numSolutions" name="num" /></p>
  <p name="sols">Solutions: $solve.solutions</p>
  `,
        });

        await check_solutions(core, resolvePathToNodeIdx, []);

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Cannot solve equation`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.start.column).eq(3);
        expect(errorWarnings.warnings[0].position.end.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.column).eq(57);
    });

    it("solve composition of equations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <function name="f1">x</function>
    <function name="f2">$$f1(x/2)</function>
    <solveEquations name="solve">$$f2(x) = 1</solveEquations>
    <p>Number of solutions: <number extend="$solve.numSolutions" name="num" /></p>
    <p name="sols">Solutions: <mathList extend="$solve.solutions" displayDigits="5" /></p>
  `,
        });

        await check_solutions(core, resolvePathToNodeIdx, [2]);
    });
});
