import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import { updateMathInputValue } from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("FunctionIterates tag tests", async () => {
    // TODO: test forceNumeric and forceSymbolic?

    it("1D user-defined function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Choose variable for function: <mathInput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathInput name="fformula" prefill="ax" />.
  Let <m>u = </m> <mathInput name="u" prefill="3v" />.  Let <m>n=</m> <mathInput name="n" prefill="3" />
  Then</p>
  <ul>
  <map assignNames="(l1) (l2) (l3) (l4) (l5) (l6) (l7)">
    <template><li newNamespace><m>f^{$i}(u) = $(../iterates[$i]{name="iter"})</m></li></template>
    <sources indexAlias="i"><sequence length="$n" /></sources>
  </map>
  </ul>

  <p hide><function name="f" variables="$x" symbolic simplify expand>$fformula</function><functioniterates function="$f" initialValue="$u" numIterates="$n" name="fis" />$fis.iterates{name="iterates"}</p>
  

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = 3 a v");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = 3 v a²");
        expect(stateVariables["/l3"].stateValues.text).eq("f³(u) = 3 v a³");

        // change function, numIterates, and initial
        await updateMathInputValue({
            latex: "bx^2",
            name: "/fformula",
            core,
        });
        await updateMathInputValue({ latex: "4", name: "/n", core });
        await updateMathInputValue({ latex: "w", name: "/u", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = b w²");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = b³ w⁴");
        expect(stateVariables["/l3"].stateValues.text).eq("f³(u) = b⁷ w⁸");
        expect(stateVariables["/l4"].stateValues.text).eq("f⁴(u) = b¹⁵ w¹⁶");

        // change variable
        await updateMathInputValue({ latex: "y", name: "/x", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = b x²");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = b x²");
        expect(stateVariables["/l3"].stateValues.text).eq("f³(u) = b x²");
        expect(stateVariables["/l4"].stateValues.text).eq("f⁴(u) = b x²");

        // change function to match variable
        await updateMathInputValue({
            latex: "y+q",
            name: "/fformula",
            core,
        });
        await updateMathInputValue({ latex: "5", name: "/n", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = q + w");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = 2 q + w");
        expect(stateVariables["/l3"].stateValues.text).eq("f³(u) = 3 q + w");
        expect(stateVariables["/l4"].stateValues.text).eq("f⁴(u) = 4 q + w");
        expect(stateVariables["/l5"].stateValues.text).eq("f⁵(u) = 5 q + w");
    });

    it("1D user-defined numerical function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Choose variable for function: <mathInput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathInput name="fformula" prefill="3x" />.
  Let <m>u = </m> <mathInput name="u" prefill="2" />.  Let <m>n=</m> <mathInput name="n" prefill="3" />
  Then</p>
  <ul>
  <map assignNames="(l1) (l2) (l3) (l4) (l5) (l6) (l7)">
    <template><li newNamespace><m>f^{$i}(u) = $(../iterates[$i]{name="iter" displayDigits="10"})</m></li></template>
    <sources indexAlias="i"><sequence length="$n" /></sources>
  </map>
  </ul>

  <p hide><function name="f" variables="$x" symbolic="false">$fformula</function><functioniterates function="$f" initialValue="$u" numIterates="$n" name="fis" />$fis.iterates{name="iterates"}</p>
  

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = 6");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = 18");
        expect(stateVariables["/l3"].stateValues.text).eq("f³(u) = 54");

        // change function, numIterates, and initial
        await updateMathInputValue({
            latex: "2x^2",
            name: "/fformula",
            core,
        });
        await updateMathInputValue({ latex: "4", name: "/n", core });
        await updateMathInputValue({ latex: "1/4", name: "/u", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = 0.125");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = 0.03125");
        expect(stateVariables["/l3"].stateValues.text).eq(
            "f³(u) = 0.001953125",
        );
        expect(stateVariables["/l4"].stateValues.text).eq(
            "f⁴(u) = 0.000007629394531",
        );

        // change variable
        await updateMathInputValue({ latex: "y", name: "/x", core });

        stateVariables = await core.returnAllStateVariables(false, true);

        // Ideally wouldn't have spaces in N a N, but get it from
        // parsing the latex of the `<m>` and converting to text
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = N a N");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = N a N");
        expect(stateVariables["/l3"].stateValues.text).eq("f³(u) = N a N");
        expect(stateVariables["/l4"].stateValues.text).eq("f⁴(u) = N a N");

        // change function to match variable
        await updateMathInputValue({
            latex: "y+5",
            name: "/fformula",
            core,
        });
        await updateMathInputValue({ latex: "5", name: "/n", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/l1"].stateValues.text).eq("f¹(u) = 5.25");
        expect(stateVariables["/l2"].stateValues.text).eq("f²(u) = 10.25");
        expect(stateVariables["/l3"].stateValues.text).eq("f³(u) = 15.25");
        expect(stateVariables["/l4"].stateValues.text).eq("f⁴(u) = 20.25");
        expect(stateVariables["/l5"].stateValues.text).eq("f⁵(u) = 25.25");
    });

    async function test_2d_linear(core) {
        async function checkIterates({ a, b, c, d, u1, u2, n }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let A = me.math.matrix([
                [a, b],
                [c, d],
            ]);
            let x = me.math.matrix([[u1], [u2]]);

            let iterNames = stateVariables["/iterates"].replacements!.map(
                (x) => x.componentIdx,
            );

            for (let i = 0; i < n; i++) {
                x = me.math.multiply(A, x);
                let x1 = me.math.subset(x, me.math.index(0, 0));
                let x2 = me.math.subset(x, me.math.index(1, 0));
                expect(
                    stateVariables[iterNames[i]].stateValues.value.tree,
                ).eqls(["vector", x1, x2]);
            }
        }

        await checkIterates({ a: 3, b: -2, c: 1, d: 4, u1: 2, u2: 1, n: 3 });

        // change values
        await updateMathInputValue({ latex: "q", name: "/x", core });
        await updateMathInputValue({ latex: "r", name: "/y", core });
        await updateMathInputValue({ latex: "-4", name: "/a", core });
        await updateMathInputValue({ latex: "7", name: "/b", core });
        await updateMathInputValue({ latex: "6", name: "/c", core });
        await updateMathInputValue({ latex: "-1", name: "/d", core });
        await updateMathInputValue({
            latex: "(-8,9)",
            name: "/u",
            core,
        });
        await updateMathInputValue({ latex: "5", name: "/n", core });

        await checkIterates({ a: -4, b: 7, c: 6, d: -1, u1: -8, u2: 9, n: 5 });
    }

    it("2D linear function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>variables: <mathInput name="x" prefill="x" /> and <mathInput name="y" prefill="y" />.
  <m>a = </m> <mathInput name="a" prefill="3" />, <m>b = </m> <mathInput name="b" prefill="-2" />, <m>c = </m> <mathInput name="c" prefill="1" />, <m>d = </m> <mathInput name="d" prefill="4" />.
  <m>f($x, $y) =</m> <function name="f" simplify variables="$x $y">($a$x+$b$y, $c$x+$d$y)</function>
  <m>u = </m> <mathInput name="u" prefill="(2,1)" /> <m>n=</m> <mathInput name="n" prefill="3" /></p>

  <functionIterates function="$f" initialValue="$u" numIterates="$n" name="fis" />
  <p>Iterates: $fis.iterates{name="iterates"}</p>

  `,
        });

        await test_2d_linear(core);
    });

    it("2D linear function, with alt vectors", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>variables: <mathInput name="x" prefill="x" /> and <mathInput name="y" prefill="y" />.
  <m>a = </m> <mathInput name="a" prefill="3" />, <m>b = </m> <mathInput name="b" prefill="-2" />, <m>c = </m> <mathInput name="c" prefill="1" />, <m>d = </m> <mathInput name="d" prefill="4" />.
  <m>f($x, $y) =</m> <function name="f" simplify variables="$x $y">⟨$a$x+$b$y, $c$x+$d$y⟩</function>
  <m>u = </m> <mathInput name="u" prefill="⟨2,1⟩" /> <m>n=</m> <mathInput name="n" prefill="3" /></p>

  <functionIterates function="$f" initialValue="$u" numIterates="$n" name="fis" />
  <p>Iterates: $fis.iterates{name="iterates"}</p>

  `,
        });
        await test_2d_linear(core);
    });

    it("warning for scalar function of two variables", async () => {
        let core = await createTestCore({
            doenetML: `
  <m>f(x, y) =</m> <function name="f" variables="x y">x+y</function>

  <functionIterates function="$f" initialValue="(0,0)" numIterates="5" name="fis" />
  <p>Iterates: $fis.iterates</p>

  `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Function iterates are possible only if the number of inputs of the function is equal to the number of outputs. This function has 2 inputs and 1 output",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.lineBegin).eq(4);
        expect(errorWarnings.warnings[0].position.charBegin).eq(3);
        expect(errorWarnings.warnings[0].position.lineEnd).eq(4);
        expect(errorWarnings.warnings[0].position.charEnd).eq(84);
    });

    it("change dimensions", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>variables: <mathInput name="vars" prefill="x,y" />.
  <m>f($vars) =</m> <mathInput name="fformula" prefill="(xy, x+y)" />.
  <m>u = </m> <mathInput name="u" prefill="(2,1)" /></p>

  <p>Iterates: $fis.iterates{name="iterates"}</p>


  <p hide><mathList mergeMathLists name="varList">$vars</mathList><function name="f" variables="$varList" symbolic simplify expand>$fformula</function><functioniterates function="$f" initialValue="$u" numIterates="3" name="fis" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(2);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            `(2,3)`,
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            `(6,5)`,
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            `(30,11)`,
        );

        await updateMathInputValue({
            latex: "(xy, x+yz, x-z)",
            name: "/fformula",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(0);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            "\uff3f",
        );

        // add variable to function
        await updateMathInputValue({
            latex: "x, y, z",
            name: "/vars",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(3);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            "\uff3f",
        );

        // add component to initial condition
        await updateMathInputValue({
            latex: "(2,1,-4)",
            name: "/u",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );
        expect(stateVariables["/fis"].stateValues.numDimensions).eq(3);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            `(2,-2,6)`,
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            `(-4,-10,-4)`,
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            `(40,36,0)`,
        );
    });

    it("change dimensions, numerical", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>variables: <mathInput name="vars" prefill="x,y" />.
  <m>f($vars) =</m> <mathInput name="fformula" prefill="(xy, x+y)" />.
  <m>u = </m> <mathInput name="u" prefill="(2,1)" /></p>

  <p>Iterates: $fis.iterates{name="iterates"}</p>

  <p hide><mathList mergeMathLists name="varList">$vars</mathList><function name="f" variables="$varList" symbolic="false">$fformula</function><functioniterates function="$f" initialValue="$u" numIterates="3" name="fis" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(2);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            `(2,3)`,
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            `(6,5)`,
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            `(30,11)`,
        );

        // non-numeric initial condition
        await updateMathInputValue({
            latex: "(2,1a)",
            name: "/u",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(2);

        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            `(NaN,NaN)`,
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            `(NaN,NaN)`,
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            `(NaN,NaN)`,
        );

        // add component to function
        await updateMathInputValue({
            latex: "(2,1)",
            name: "/u",
            core,
        });
        await updateMathInputValue({
            latex: "(xy, x+yz, x-z)",
            name: "/fformula",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(0);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            "\uff3f",
        );

        // add variable to function
        await updateMathInputValue({
            latex: "x, y, z",
            name: "/vars",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(3);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            "\uff3f",
        );

        // add component to initial condition
        await updateMathInputValue({
            latex: "(2,1,-4)",
            name: "/u",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        iterNames = stateVariables["/iterates"].replacements!.map(
            (x) => x.componentIdx,
        );

        expect(stateVariables["/fis"].stateValues.numDimensions).eq(3);
        expect(cleanLatex(stateVariables[iterNames[0]].stateValues.latex)).eq(
            `(2,-2,6)`,
        );
        expect(cleanLatex(stateVariables[iterNames[1]].stateValues.latex)).eq(
            `(-4,-10,-4)`,
        );
        expect(cleanLatex(stateVariables[iterNames[2]].stateValues.latex)).eq(
            `(40,36,0)`,
        );
    });
});
