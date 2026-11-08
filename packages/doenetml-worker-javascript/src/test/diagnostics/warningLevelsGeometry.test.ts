import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue, updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A diagnostic's level follows where its condition comes from (D35, DIAG-1,
 * DIAG-2, #2422): a warning when what the author wrote causes it, and an
 * info when a value that can change does, which appears and goes away with
 * the value (B33). The graphical and mathematical components.
 */

async function setup(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    await core.returnAllStateVariables(false, true);

    /** The diagnostics with `code` now, as type and line. */
    function diagnostics(code: string) {
        return (core as any).core.diagnostics
            .filter((d: any) => d.code === code)
            .map((d: any) => ({
                type: d.type,
                line: d.position?.start.line,
            }));
    }

    async function setMath(name: string, latex: string) {
        await updateMathInputValue({
            latex,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
        // diagnostics are decided again when what shows them is
        await core.returnAllStateVariables(false, true);
    }

    async function setText(name: string, text: string) {
        await updateTextInputValue({
            text,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
        await core.returnAllStateVariables(false, true);
    }

    return { core, diagnostics, setMath, setText };
}

/**
 * The common case: a literal on line 3 that stays a warning, and a value
 * from the input `name` on line 5 that is an info while the input holds
 * `bad`, and is gone once it holds `good`, and back with `bad`.
 */
async function checkLiteralAndInput({
    code,
    doenetML,
    name,
    good,
    bad,
}: {
    code: string;
    doenetML: string;
    name: string;
    good: string;
    bad: string;
}) {
    const { diagnostics, setMath } = await setup(doenetML);
    expect(diagnostics(code)).eqls([
        { type: "warning", line: 3 },
        { type: "info", line: 5 },
    ]);

    await setMath(name, good);
    expect(diagnostics(code)).eqls([{ type: "warning", line: 3 }]);

    await setMath(name, bad);
    expect(diagnostics(code)).eqls([
        { type: "warning", line: 3 },
        { type: "info", line: 5 },
    ]);
}

describe("Warning levels by the source of the condition: geometry and math", () => {
    it("w0003: a line through points that depend on its variables", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0003",
            doenetML: `
<graph>
  <line through="(x,1) (2,3)"/>
  <mathInput name="a" prefill="x"/>
  <line through="($a,1) (2,3)"/>
</graph>
`,
            name: "a",
            good: "5",
            bad: "x",
        });
    });

    it("w0004: a line's equation that is not linear", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0004",
            doenetML: `
<graph>
  <line equation="y=x^2"/>
  <mathInput name="a" prefill="x"/>
  <line equation="y=$a x"/>
</graph>
`,
            name: "a",
            good: "2",
            bad: "x",
        });
    });

    it("w0004 goes away when another array entry recalculates the array", async () => {
        // While the equation is not linear, only `$l.point1` is read, so the
        // info is given by `point1`'s keys. Once it is linear, only
        // `$l.point2` is, whose definition makes every key fresh: the info
        // `point1` gave must go, though `point1` is not recalculated.
        const { diagnostics, setMath } = await setup(`
<mathInput name="a" prefill="x"/>
<line name="l" equation="y=$a x"/>
<conditionalContent><case condition="$a=x"><p>$l.point1</p></case></conditionalContent>
<p>$l.point2</p>
`);
        expect(diagnostics("doenet-w0004")).eqls([{ type: "info", line: 3 }]);

        await setMath("a", "2");
        expect(diagnostics("doenet-w0004")).eqls([]);

        await setMath("a", "x");
        expect(diagnostics("doenet-w0004")).eqls([{ type: "info", line: 3 }]);
    });

    it("w0006: a ray whose dimensions don't match", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0006",
            doenetML: `
<graph>
  <ray endpoint="(1,2)" direction="(1,2,3)"/>
  <mathInput name="d" prefill="(1,2,3)"/>
  <ray endpoint="(1,2)" direction="$d"/>
</graph>
`,
            name: "d",
            good: "(3,4)",
            bad: "(1,2,3)",
        });
    });

    it("w0008: a vector whose dimensions don't match", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0008",
            doenetML: `
<graph>
  <vector tail="(1,2)" displacement="(1,2,3)"/>
  <mathInput name="d" prefill="(1,2,3)"/>
  <vector tail="(1,2)" displacement="$d"/>
</graph>
`,
            name: "d",
            good: "(3,4)",
            bad: "(1,2,3)",
        });
    });

    it("w0031: a circle's radius too small for its points", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0031",
            doenetML: `
<graph>
  <circle through="(0,0) (10,0)" radius="1"/>
  <mathInput name="r" prefill="1"/>
  <circle through="(0,0) (10,0)" radius="$r"/>
</graph>
`,
            name: "r",
            good: "6",
            bad: "1",
        });
    });

    it("w0036: a circle with a radius through points that are not numbers", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0036",
            doenetML: `
<graph>
  <circle through="(x,0) (10,0)" radius="6"/>
  <mathInput name="r"/>
  <circle through="(0,0) (10,0)" radius="$r"/>
</graph>
`,
            name: "r",
            good: "6",
            bad: "",
        });
    });

    it("w0038: a function domain with too few intervals, going away when the number of inputs goes down", async () => {
        // Reported under each key of `domain`; once the number of inputs is
        // 1, key 1 is no longer in the array, so it is not recalculated,
        // and what it gave must go anyway.
        const { diagnostics: inOrder, setMath } = await setup(`
<function numInputs="2" domain="(0,1)">x+y</function>
<mathInput name="n" prefill="2"/>
<function name="f" numInputs="$n" domain="(0,1)">x+y</function>
<p>$f.domain</p>
`);
        // by line: the info is reported before the warning
        const diagnostics = (code: string) =>
            inOrder(code).sort((a: any, b: any) => a.line - b.line);
        expect(diagnostics("doenet-w0038")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("n", "1");
        expect(diagnostics("doenet-w0038")).eqls([
            { type: "warning", line: 2 },
        ]);

        await setMath("n", "2");
        expect(diagnostics("doenet-w0038")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);
    });

    it("w0040: a function through a point that is not numerical", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0040",
            doenetML: `
<graph>
  <function through="(x,1) (2,3)"/>
  <mathInput name="a"/>
  <function through="($a,1) (2,3)"/>
</graph>
`,
            name: "a",
            good: "5",
            bad: "",
        });
    });

    it("w0042: a function through two points at the same x", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0042",
            doenetML: `
<graph>
  <function through="(1,1) (1,3)"/>
  <mathInput name="a" prefill="1"/>
  <function through="($a,1) (1,3)"/>
</graph>
`,
            name: "a",
            good: "5",
            bad: "1",
        });
    });

    it("w0048: an angle through a point that is not one", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0048",
            doenetML: `
<graph>
  <angle through="(0,1) (0,0), (1,5)"/>
  <mathInput name="a"/>
  <angle through="($a,1) (0,0) (1,5)"/>
</graph>
`,
            name: "a",
            good: "3",
            bad: "",
        });
    });

    it("w0056: iterating a function whose inputs and outputs don't match", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0056",
            doenetML: `
<p>Iterates</p>
<functionIterates function="(x,y)" initialValue="1" numIterates="2"/>
<mathInput name="m" prefill="x"/><function name="g" variables="x y">$m</function>
<functionIterates function="$g" initialValue="(1,2)" numIterates="2"/>
`,
            name: "m",
            good: "(y,x)",
            bad: "x",
        });
    });

    it("w0117: a parameter that does not occur in the pattern", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0117",
            doenetML: `
<p>
  <matchesPattern pattern="ax" parameters="a b">3x</matchesPattern>
  <mathInput name="p" prefill="b"/>
  <matchesPattern pattern="ax" parameters="$p">3x</matchesPattern>
</p>
`,
            name: "p",
            good: "a",
            bad: "b",
        });
    });

    it("w0017: a variable that is not one", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0017",
            doenetML: `
<p>
  <matchesPattern pattern="ax" parameters="2 a">3x</matchesPattern>
  <mathInput name="p" prefill="2"/>
  <matchesPattern pattern="ax" parameters="$p">3x</matchesPattern>
</p>
`,
            name: "p",
            good: "a",
            bad: "2",
        });
    });

    it("w0002: a line through points of fewer than two dimensions", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0002",
            doenetML: `
<graph>
  <line through="x y"/>
  <mathInput name="a"/>
  <line through="$a $a"/>
</graph>
`,
            name: "a",
            good: "(3,4)",
            bad: "",
        });
    });

    it("w0045: an ODE variable that is the independent variable", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0045",
            doenetML: `
<p>
  <odeSystem variables="t"><rightHandSide>1</rightHandSide></odeSystem>
  <mathInput name="a" prefill="t"/>
  <odeSystem variables="$a"><rightHandSide>1</rightHandSide></odeSystem>
</p>
`,
            name: "a",
            good: "y",
            bad: "t",
        });
    });

    it("w0046: ODE variables that repeat", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0046",
            doenetML: `
<p>
  <odeSystem variables="x x"><rightHandSide>1</rightHandSide><rightHandSide>1</rightHandSide></odeSystem>
  <mathInput name="a" prefill="x"/>
  <odeSystem variables="x $a"><rightHandSide>1</rightHandSide><rightHandSide>1</rightHandSide></odeSystem>
</p>
`,
            name: "a",
            good: "y",
            bad: "x",
        });
    });

    it("w0122: a slope field of a function with two outputs", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0122",
            doenetML: `
<text>fields</text>
<graph><slopeField><function variables="x y">(y,-x)</function></slopeField></graph>
<mathInput name="a" prefill="(y,-x)"/>
<graph><slopeField><function variables="x y">$a</function></slopeField></graph>
`,
            name: "a",
            good: "y-x",
            bad: "(y,-x)",
        });
    });

    it("w0058: an operand to extract with no operand number", async () => {
        const { diagnostics, setText } = await setup(`
<extractMath type="operand">x+y</extractMath>
<textInput name="t" prefill="operand"/>
<extractMath type="$t">x+y</extractMath>
`);
        expect(diagnostics("doenet-w0058")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setText("t", "numOperands");
        expect(diagnostics("doenet-w0058")).eqls([
            { type: "warning", line: 2 },
        ]);

        await setText("t", "operand");
        expect(diagnostics("doenet-w0058")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);
    });

    it("w0082: a function name a math input cannot use", async () => {
        const { diagnostics, setText } = await setup(`
<mathInput additionalFunctionNames="2x"/>
<textInput name="t" prefill="2x"/>
<mathInput additionalFunctionNames="$t"/>
`);
        expect(diagnostics("doenet-w0082")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setText("t", "erf");
        expect(diagnostics("doenet-w0082")).eqls([
            { type: "warning", line: 2 },
        ]);

        await setText("t", "2x");
        expect(diagnostics("doenet-w0082")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);
    });
});
