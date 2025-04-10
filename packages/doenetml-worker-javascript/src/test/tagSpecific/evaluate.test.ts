import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    movePoint,
    submitAnswer,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Evaluate tag tests", async () => {
    it("evaluate numeric and symbolic", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Variable: <mathInput name="variable" prefill="x" /></p>
  <p>Function: <mathInput name="formula" prefill="sin(x)"/></p>
  <p>Input value: <mathInput name="input" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable" simplify="none">$formula</function>

  <function name="f_numeric" variables="$variable" symbolic="false" simplify="none">$formula</function>

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <m name="result_symbolic2">$$f_symbolic($input)</m></p>

  <p>Evaluated symbolic result again: $result_symbolic{name="result_symbolic3"}</p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input" />
  </p>

  <p>Evaluate numeric using macro:  <m name="result_numeric2">$$f_numeric($input)</m></p>


  <p>Evaluated numeric result again: $result_numeric{name="result_numeric3"}</p>


  <p>Force evaluate symbolic: 
  <evaluate forceSymbolic name="result_force_symbolic" function="$f_symbolic" input="$input" />
  </p>

  <p>Force evaluate symbolic numeric function: 
  <evaluate forceSymbolic name="result_force_symbolic_numeric" function="$f_numeric" input="$input" />
  </p>

  <p>Force evaluate numeric: 
  <evaluate forceNumeric name="result_force_numeric" function="$f_numeric" input="$input" />
  </p>

  <p>Force evaluate numeric symbolic function: 
  <evaluate forceNumeric name="result_force_numeric_symbolic" function="$f_symbolic" input="$input" />
  </p>


  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            0,
        ]);
        let result_symbolic2_name =
            stateVariables["/result_symbolic2"].activeChildren[0].componentName;
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", 0]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", 0],
        );
        expect(stateVariables["/result_numeric"].stateValues.value.tree).eq(0);
        let result_numeric2_name =
            stateVariables["/result_numeric2"].activeChildren[0].componentName;
        expect(stateVariables[result_numeric2_name].stateValues.value.tree).eq(
            0,
        );
        expect(stateVariables["/result_numeric3"].stateValues.value.tree).eq(0);
        expect(
            stateVariables["/result_force_symbolic"].stateValues.value.tree,
        ).eqls(["apply", "sin", 0]);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", 0]);
        expect(
            stateVariables["/result_force_numeric"].stateValues.value.tree,
        ).eq(0);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).eq(0);

        // evaluate at pi
        await updateMathInputValue({
            latex: "\\pi",
            name: "/input",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            "pi",
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", "pi"]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", "pi"],
        );
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_force_symbolic"].stateValues.value.tree,
        ).eqls(["apply", "sin", "pi"]);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", "pi"]);
        expect(
            stateVariables["/result_force_numeric"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).closeTo(0, 1e-10);

        // change variable
        await updateMathInputValue({
            latex: "y",
            name: "/variable",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            "x",
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", "x"]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", "x"],
        );
        expect(stateVariables["/result_numeric"].stateValues.value.tree).eqls(
            NaN,
        );
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree,
        ).eqls(NaN);
        expect(stateVariables["/result_numeric3"].stateValues.value.tree).eqls(
            NaN,
        );
        expect(
            stateVariables["/result_force_symbolic"].stateValues.value.tree,
        ).eqls(["apply", "sin", "x"]);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", "x"]);
        expect(
            stateVariables["/result_force_numeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).eqls(NaN);

        // change formula to match variable
        await updateMathInputValue({
            latex: "\\sin(y)",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            "pi",
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", "pi"]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", "pi"],
        );
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_force_symbolic"].stateValues.value.tree,
        ).eqls(["apply", "sin", "pi"]);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", "pi"]);
        expect(
            stateVariables["/result_force_numeric"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).closeTo(0, 1e-10);
    });

    it("user-defined function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Choose variable for function: <mathInput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathInput name="fformula" prefill="ax" />.
  Let <m>u = </m> <mathInput name="u" prefill="3v" />.
  Then <m name="result">f(u) = f($u) = $$f($u)</m>.</p>

  <p hide><function name="f" variables="$x" symbolic simplify expand>$fformula</function></p>
  

  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/result"].stateValues.latex)).eq(
            "f(u)=f(3v)=3av",
        );

        // change function
        await updateMathInputValue({
            latex: "bx^2",
            name: "/fformula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/result"].stateValues.latex)).eq(
            "f(u)=f(3v)=9bv^{2}",
        );

        // change u
        await updateMathInputValue({
            latex: "cq^2",
            name: "/u",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/result"].stateValues.latex)).eq(
            "f(u)=f(cq^{2})=bc^{2}q^{4}",
        );

        // change variable
        await updateMathInputValue({
            latex: "y",
            name: "/x",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/result"].stateValues.latex)).eq(
            "f(u)=f(cq^{2})=bx^{2}",
        );

        // change function to match variable
        await updateMathInputValue({
            latex: "ay+by^2",
            name: "/fformula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/result"].stateValues.latex)).eq(
            "f(u)=f(cq^{2})=acq^{2}+bc^{2}q^{4}",
        );
    });

    it("evaluate function when input is replaced", async () => {
        // catch bug where child dependency was not recalculated
        // when a skipComponentNames = true
        // and the number of active children did not change
        let core = await createTestCore({
            doenetML: `
  <function variables="u" symbolic name="f" simplify="false">1+u</function>
  <answer name="ans1">
    <mathInput name="mi" />
    <award><math>1</math></award>
  </answer>
  <p><evaluate name="eval" function="$f" input="$ans1.submittedResponse" /></p>

  `,
        });

        // initial state

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/eval"].stateValues.value.tree).eq("＿");

        // submit answer
        await updateMathInputValue({
            latex: "4",
            name: "/mi",
            core,
        });
        await submitAnswer({ name: "/ans1", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/eval"].stateValues.value.tree).eqls([
            "+",
            1,
            4,
        ]);
    });

    it("rounding on display", async () => {
        let core = await createTestCore({
            doenetML: `
  <function displayDigits="5" name="f1" symbolic="false">100sin(x)</function>
  <function displayDecimals="4" name="f2" symbolic="false">100sin(x)</function>
  <function displaySmallAsZero="1E-13" name="f3" symbolic="false">100sin(x)</function>
  <function name="f4" symbolic="false">100sin(x)</function>

  <p>Input: <mathInput name="input" prefill="1" /></p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1" />
  <evaluate function="$f2" input="$input" name="ef2" />
  <evaluate function="$f3" input="$input" name="ef3" />
  <evaluate function="$f4" input="$input" name="ef4" />
  $ef1{name="ef1a"}
  $ef2{name="ef2a"}
  $ef3{name="ef3a"}
  $ef4{name="ef4a"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dg6" displayDigits="6" />
  <evaluate function="$f2" input="$input" name="ef2dg6" displayDigits="6" />
  <evaluate function="$f3" input="$input" name="ef3dg6" displayDigits="6" />
  <evaluate function="$f4" input="$input" name="ef4dg6" displayDigits="6" />
  $ef1dg6{name="ef1dg6a"}
  $ef2dg6{name="ef2dg6a"}
  $ef3dg6{name="ef3dg6a"}
  $ef4dg6{name="ef4dg6a"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dc6" displayDecimals="6" />
  <evaluate function="$f2" input="$input" name="ef2dc6" displayDecimals="6" />
  <evaluate function="$f3" input="$input" name="ef3dc6" displayDecimals="6" />
  <evaluate function="$f4" input="$input" name="ef4dc6" displayDecimals="6" />
  $ef1dc6{name="ef1dc6a"}
  $ef2dc6{name="ef2dc6a"}
  $ef3dc6{name="ef3dc6a"}
  $ef4dc6{name="ef4dc6a"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f2" input="$input" name="ef2dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f3" input="$input" name="ef3dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f4" input="$input" name="ef4dsz" displaySmallAsZero="1E-13" />
  $ef1dsz{name="ef1dsza"}
  $ef2dsz{name="ef2dsza"}
  $ef3dsz{name="ef3dsza"}
  $ef4dsz{name="ef4dsza"}
  </p>

  <p>
  <m name="ef1m">$$f1($input)</m>
  <m name="ef2m">$$f2($input)</m>
  <m name="ef3m">$$f3($input)</m>
  <m name="ef4m">$$f4($input)</m>
  $ef1m{name="ef1ma"}
  $ef2m{name="ef2ma"}
  $ef3m{name="ef3ma"}
  $ef4m{name="ef4ma"}
  </p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/ef1"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1a"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3a"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4a"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dsz"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2dsz"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dsz"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4dsz"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1dsza"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2dsza"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dsza"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4dsza"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1m"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2m"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3m"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4m"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1ma"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2ma"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3ma"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4ma"].stateValues.latex)).eq(
            "84.15",
        );

        await updateMathInputValue({
            latex: "\\pi",
            name: "/input",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/ef1"].stateValues.latex).slice(0, 5),
        ).eq(Math.sin(Math.PI).toString().slice(0, 5));
        expect(cleanLatex(stateVariables["/ef2"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef1a"].stateValues.latex).slice(0, 5),
        ).eq(Math.sin(Math.PI).toString().slice(0, 5));
        expect(cleanLatex(stateVariables["/ef2a"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3a"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4a"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef1dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef1dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6a"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef4dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef1dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef2dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef4dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef1dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef1dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef2dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef4dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef1dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef1m"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef2m"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3m"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4m"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef1ma"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef2ma"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3ma"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4ma"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
    });

    it("rounding on display, overwrite on copy", async () => {
        let core = await createTestCore({
            doenetML: `
  <function displayDigits="5" name="f1" symbolic="false">100sin(x)</function>
  <function displayDecimals="4" name="f2" symbolic="false">100sin(x)</function>
  <function displaySmallAsZero="1E-13" name="f3" symbolic="false">100sin(x)</function>
  <function name="f4" symbolic="false">100sin(x)</function>

  <p>Input: <mathinput name="input" prefill="1" /></p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1" />
  <evaluate function="$f2" input="$input" name="ef2" />
  <evaluate function="$f3" input="$input" name="ef3" />
  <evaluate function="$f4" input="$input" name="ef4" />
  $ef1{name="ef1dg6" displayDigits="6"}
  $ef2{name="ef2dg6" displayDigits="6"}
  $ef3{name="ef3dg6" displayDigits="6"}
  $ef4{name="ef4dg6" displayDigits="6"}
  $ef1{name="ef1dc6" displayDecimals="6"}
  $ef2{name="ef2dc6" displayDecimals="6"}
  $ef3{name="ef3dc6" displayDecimals="6"}
  $ef4{name="ef4dc6" displayDecimals="6"}
  $ef1{name="ef1dsz" displaySmallAsZero="1E-13"}
  $ef2{name="ef2dsz" displaySmallAsZero="1E-13"}
  $ef3{name="ef3dsz" displaySmallAsZero="1E-13"}
  $ef4{name="ef4dsz" displaySmallAsZero="1E-13"}
  $ef1dc6{name="ef1dg6a" displayDigits="6"}
  $ef2dc6{name="ef2dg6a" displayDigits="6"}
  $ef3dc6{name="ef3dg6a" displayDigits="6"}
  $ef4dc6{name="ef4dg6a" displayDigits="6"}
  $ef1dg6{name="ef1dc6a" displayDecimals="6"}
  $ef2dg6{name="ef2dc6a" displayDecimals="6"}
  $ef3dg6{name="ef3dc6a" displayDecimals="6"}
  $ef4dg6{name="ef4dc6a" displayDecimals="6"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dg6b" displayDigits="6" />
  <evaluate function="$f2" input="$input" name="ef2dg6b" displayDigits="6" />
  <evaluate function="$f3" input="$input" name="ef3dg6b" displayDigits="6" />
  <evaluate function="$f4" input="$input" name="ef4dg6b" displayDigits="6" />
  $ef1dg6b{name="ef1dg8" displayDigits="8"}
  $ef2dg6b{name="ef2dg8" displayDigits="8"}
  $ef3dg6b{name="ef3dg8" displayDigits="8"}
  $ef4dg6b{name="ef4dg8" displayDigits="8"}
  $ef1dg6b{name="ef1dc6b" displayDecimals="6"}
  $ef2dg6b{name="ef2dc6b" displayDecimals="6"}
  $ef3dg6b{name="ef3dc6b" displayDecimals="6"}
  $ef4dg6b{name="ef4dc6b" displayDecimals="6"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dc6c" displayDecimals="6" />
  <evaluate function="$f2" input="$input" name="ef2dc6c" displayDecimals="6" />
  <evaluate function="$f3" input="$input" name="ef3dc6c" displayDecimals="6" />
  <evaluate function="$f4" input="$input" name="ef4dc6c" displayDecimals="6" />
  $ef1dc6c{name="ef1dc7" displayDecimals="7"}
  $ef2dc6c{name="ef2dc7" displayDecimals="7"}
  $ef3dc6c{name="ef3dc7" displayDecimals="7"}
  $ef4dc6c{name="ef4dc7" displayDecimals="7"}
  $ef1dc6c{name="ef1dg6c" displayDigits="6"}
  $ef2dc6c{name="ef2dg6c" displayDigits="6"}
  $ef3dc6c{name="ef3dg6c" displayDigits="6"}
  $ef4dc6c{name="ef4dg6c" displayDigits="6"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dsza" displaySmallAsZero="1E-13" />
  <evaluate function="$f2" input="$input" name="ef2dsza" displaySmallAsZero="1E-13" />
  <evaluate function="$f3" input="$input" name="ef3dsza" displaySmallAsZero="1E-13" />
  <evaluate function="$f4" input="$input" name="ef4dsza" displaySmallAsZero="1E-13" />
  $ef1dsza{name="ef1dsz0a" displaySmallAsZero="0"}
  $ef2dsza{name="ef2dsz0a" displaySmallAsZero="0"}
  $ef3dsza{name="ef3dsz0a" displaySmallAsZero="0"}
  $ef4dsza{name="ef4dsz0a" displaySmallAsZero="0"}
  </p>


  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/ef1"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dg6b"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6b"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6b"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6b"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dg6c"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6c"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6c"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6c"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dc6b"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6b"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6b"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6b"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dc6c"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6c"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6c"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6c"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dg8"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dg8"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dg8"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dg8"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dc7"].stateValues.latex)).eq(
            "84.1470985",
        );
        expect(cleanLatex(stateVariables["/ef2dc7"].stateValues.latex)).eq(
            "84.1470985",
        );
        expect(cleanLatex(stateVariables["/ef3dc7"].stateValues.latex)).eq(
            "84.1470985",
        );
        expect(cleanLatex(stateVariables["/ef4dc7"].stateValues.latex)).eq(
            "84.1470985",
        );
        expect(cleanLatex(stateVariables["/ef1dsz"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2dsz"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dsz"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4dsz"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1dsza"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2dsza"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dsza"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4dsza"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1dsz0a"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2dsz0a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dsz0a"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4dsz0a"].stateValues.latex)).eq(
            "84.15",
        );

        await updateMathInputValue({
            latex: "\\pi",
            name: "/input",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/ef1"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef2"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef1dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef1dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6a"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef4dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef1dg6b"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6b"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6b"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef4dg6b"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef1dg6c"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6c"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6c"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef4dg6c"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef1dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef2dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef4dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef1dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef1dc6b"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dc6b"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dc6b"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dc6b"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef1dc6c"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dc6c"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dc6c"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dc6c"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef1dg8"].stateValues.latex).slice(0, 8),
        ).eq(Math.sin(Math.PI).toString().slice(0, 8));
        expect(
            cleanLatex(stateVariables["/ef2dg8"].stateValues.latex).slice(0, 8),
        ).eq(Math.sin(Math.PI).toString().slice(0, 8));
        expect(cleanLatex(stateVariables["/ef3dg8"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4dg8"].stateValues.latex).slice(0, 8),
        ).eq(Math.sin(Math.PI).toString().slice(0, 8));
        expect(cleanLatex(stateVariables["/ef1dc7"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef2dc7"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3dc7"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef4dc7"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef1dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef2dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef4dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef1dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef1dsz0a"].stateValues.latex).slice(
                0,
                3,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(cleanLatex(stateVariables["/ef2dsz0a"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef3dsz0a"].stateValues.latex).slice(
                0,
                3,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef4dsz0a"].stateValues.latex).slice(
                0,
                3,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
    });

    it("rounding on display, ovewrite on copy functions", async () => {
        let core = await createTestCore({
            doenetML: `
  <function copySource="f2" displayDigits="5" name="f1" />
  <function copySource="f4" displayDecimals="4" name="f2" />
  <function displaySmallAsZero="1E-13" name="f3" symbolic="false">100sin(x)</function>
  <function copySource="f3" displaySmallAsZero="0" name="f4" />

  <p>Input: <mathinput name="input" prefill="1" /></p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1" />
  <evaluate function="$f2" input="$input" name="ef2" />
  <evaluate function="$f3" input="$input" name="ef3" />
  <evaluate function="$f4" input="$input" name="ef4" />
  $ef1{name="ef1a"}
  $ef2{name="ef2a"}
  $ef3{name="ef3a"}
  $ef4{name="ef4a"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dg6" displayDigits="6" />
  <evaluate function="$f2" input="$input" name="ef2dg6" displayDigits="6" />
  <evaluate function="$f3" input="$input" name="ef3dg6" displayDigits="6" />
  <evaluate function="$f4" input="$input" name="ef4dg6" displayDigits="6" />
  $ef1dg6{name="ef1dg6a"}
  $ef2dg6{name="ef2dg6a"}
  $ef3dg6{name="ef3dg6a"}
  $ef4dg6{name="ef4dg6a"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dc6" displayDecimals="6" />
  <evaluate function="$f2" input="$input" name="ef2dc6" displayDecimals="6" />
  <evaluate function="$f3" input="$input" name="ef3dc6" displayDecimals="6" />
  <evaluate function="$f4" input="$input" name="ef4dc6" displayDecimals="6" />
  $ef1dc6{name="ef1dc6a"}
  $ef2dc6{name="ef2dc6a"}
  $ef3dc6{name="ef3dc6a"}
  $ef4dc6{name="ef4dc6a"}
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f2" input="$input" name="ef2dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f3" input="$input" name="ef3dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f4" input="$input" name="ef4dsz" displaySmallAsZero="1E-13" />
  $ef1dsz{name="ef1dsza"}
  $ef2dsz{name="ef2dsza"}
  $ef3dsz{name="ef3dsza"}
  $ef4dsz{name="ef4dsza"}
  </p>

  <p>
  <m name="ef1m">$$f1($input)</m>
  <m name="ef2m">$$f2($input)</m>
  <m name="ef3m">$$f3($input)</m>
  <m name="ef4m">$$f4($input)</m>
  $ef1m{name="ef1ma"}
  $ef2m{name="ef2ma"}
  $ef3m{name="ef3ma"}
  $ef4m{name="ef4ma"}
  </p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/ef1"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1a"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3a"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4a"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef2dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef4dg6a"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef1dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef2dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef3dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef4dc6a"].stateValues.latex)).eq(
            "84.147098",
        );
        expect(cleanLatex(stateVariables["/ef1dsz"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2dsz"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dsz"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4dsz"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1dsza"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2dsza"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3dsza"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4dsza"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1m"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2m"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3m"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4m"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef1ma"].stateValues.latex)).eq(
            "84.147",
        );
        expect(cleanLatex(stateVariables["/ef2ma"].stateValues.latex)).eq(
            "84.1471",
        );
        expect(cleanLatex(stateVariables["/ef3ma"].stateValues.latex)).eq(
            "84.15",
        );
        expect(cleanLatex(stateVariables["/ef4ma"].stateValues.latex)).eq(
            "84.15",
        );

        await updateMathInputValue({
            latex: "\\pi",
            name: "/input",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/ef1"].stateValues.latex).slice(0, 5),
        ).eq(Math.sin(Math.PI).toString().slice(0, 5));
        expect(cleanLatex(stateVariables["/ef2"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef1a"].stateValues.latex).slice(0, 5),
        ).eq(Math.sin(Math.PI).toString().slice(0, 5));
        expect(cleanLatex(stateVariables["/ef2a"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3a"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4a"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef1dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4dg6"].stateValues.latex).slice(0, 6),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef1dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(
            cleanLatex(stateVariables["/ef2dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef3dg6a"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef4dg6a"].stateValues.latex).slice(
                0,
                6,
            ),
        ).eq(Math.sin(Math.PI).toString().slice(0, 6));
        expect(cleanLatex(stateVariables["/ef1dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef2dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef4dc6"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef1dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dc6a"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef1dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef2dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef4dsz"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef1dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef2dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef3dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/ef4dsza"].stateValues.latex)).eq(
            "0",
        );
        expect(
            cleanLatex(stateVariables["/ef1m"].stateValues.latex).slice(0, 5),
        ).eq(Math.sin(Math.PI).toString().slice(0, 5));
        expect(cleanLatex(stateVariables["/ef2m"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3m"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4m"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
        expect(
            cleanLatex(stateVariables["/ef1ma"].stateValues.latex).slice(0, 5),
        ).eq(Math.sin(Math.PI).toString().slice(0, 5));
        expect(cleanLatex(stateVariables["/ef2ma"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/ef3ma"].stateValues.latex)).eq("0");
        expect(
            cleanLatex(stateVariables["/ef4ma"].stateValues.latex).slice(0, 3),
        ).eq(Math.sin(Math.PI).toString().slice(0, 3));
    });

    it("evaluate numeric and symbolic for function of two variables", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Variable 1: <mathInput name="variable1" prefill="x" /></p>
  <p>Variable 2: <mathInput name="variable2" prefill="y" /></p>
  <p>Function: <mathInput name="formula" prefill="sin(x+y)"/></p>
  <p>Input 1 value: <mathInput name="input1" prefill="0" /></p>
  <p>Input 2 value: <mathInput name="input2" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable1 $variable2" simplify="false">$formula</function>

  <function name="f_numeric" variables="$variable1 $variable2" symbolic="false" simplify="false">$formula</function>

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <m name="result_symbolic2">$$f_symbolic($input1, $input2)</m></p>

  <p>Evaluated symbolic result again: $result_symbolic{name="result_symbolic3"}</p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Evaluate numeric using macro:  <m name="result_numeric2">$$f_numeric($input1, $input2)</m></p>

  <p>Evaluated numeric result again: $result_numeric{name="result_numeric3"}</p>

  <p>Force evaluate symbolic numeric function: 
  <evaluate forceSymbolic name="result_force_symbolic_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Force evaluate numeric symbolic function: 
  <evaluate forceNumeric name="result_force_numeric_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>


  `,
        });

        // initial state

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["+", 0, 0],
        ]);
        let result_symbolic2_name =
            stateVariables["/result_symbolic2"].activeChildren[0].componentName;
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", ["+", 0, 0]]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", ["+", 0, 0]],
        );
        expect(stateVariables["/result_numeric"].stateValues.value.tree).eq(0);
        let result_numeric2_name =
            stateVariables["/result_numeric2"].activeChildren[0].componentName;
        expect(stateVariables[result_numeric2_name].stateValues.value.tree).eq(
            0,
        );
        expect(stateVariables["/result_numeric3"].stateValues.value.tree).eq(0);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["+", 0, 0]]);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).eq(0);

        // evaluate at (pi, 2pi)
        await updateMathInputValue({
            latex: "\\pi",
            name: "/input1",
            core,
        });
        await updateMathInputValue({
            latex: "2\\pi",
            name: "/input2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["+", "pi", ["*", 2, "pi"]],
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", ["+", "pi", ["*", 2, "pi"]]]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
        );
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["+", "pi", ["*", 2, "pi"]]]);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).closeTo(0, 1e-10);

        // change variable
        await updateMathInputValue({
            latex: "u",
            name: "/variable1",
            core,
        });
        await updateMathInputValue({
            latex: "v",
            name: "/variable2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["+", "x", "y"],
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", ["+", "x", "y"]]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", ["+", "x", "y"]],
        );
        expect(stateVariables["/result_numeric"].stateValues.value.tree).eqls(
            NaN,
        );
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree,
        ).eqls(NaN);
        expect(stateVariables["/result_numeric3"].stateValues.value.tree).eqls(
            NaN,
        );
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["+", "x", "y"]]);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).eqls(NaN);

        // change formula to use new variables
        await updateMathInputValue({
            latex: "\\sin(u+v)",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["+", "pi", ["*", 2, "pi"]],
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["apply", "sin", ["+", "pi", ["*", 2, "pi"]]]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
        );
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["+", "pi", ["*", 2, "pi"]]]);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).closeTo(0, 1e-10);
    });

    it("function of multiple variables", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Variables: <mathInput name="variablesOrig" prefill="x,y" /></p>
  <p>Function: <mathInput name="formula" prefill="sin(x+y)"/></p>
  <p>Input: <mathInput name="input" prefill="(0,0)" /></p>
  <mathList mergeMathLists name="variables" hide>$variablesOrig</mathList>

  <function name="f" variables="$variables" symbolic simplify>$formula</function>

  <p>Evaluate 1: 
    <evaluate name="result1" function="$f" input="$input" />
  </p>

  <p>Evaluate 2:  <m name="result2">$$f($input)</m></p>

  <p>Evaluate 3: $result1{name="result3"}</p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls(0);
        let result2Name =
            stateVariables["/result2"].activeChildren[0].componentName;
        expect(stateVariables[result2Name].stateValues.value.tree).eqls(0);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls(0);

        // evaluate at (pi, pi/2)
        await updateMathInputValue({
            latex: "(\\pi, \\pi/2)",
            name: "/input",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls(-1);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls(-1);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls(-1);

        // change variables to 3D
        await updateMathInputValue({
            latex: "x,y,z",
            name: "/variablesOrig",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables[result2Name].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/result3"].stateValues.value.tree).eqls("＿");

        // change input to 3D
        await updateMathInputValue({
            latex: "(\\pi, \\pi/2,3)",
            name: "/input",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls(-1);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls(-1);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls(-1);

        // change formula to use all variables
        await updateMathInputValue({
            latex: "z\\sin(x+y)",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls(-3);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls(-3);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls(-3);

        // add fourth variable to formula
        await updateMathInputValue({
            latex: "z\\sin(x+y/w)",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "*",
            3,
            ["apply", "sin", ["+", "pi", ["/", "pi", ["*", 2, "w"]]]],
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "*",
            3,
            ["apply", "sin", ["+", "pi", ["/", "pi", ["*", 2, "w"]]]],
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "*",
            3,
            ["apply", "sin", ["+", "pi", ["/", "pi", ["*", 2, "w"]]]],
        ]);

        // add 4th input
        await updateMathInputValue({
            latex: "(\\pi, \\pi/2,3,3)",
            name: "/input",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables[result2Name].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/result3"].stateValues.value.tree).eqls("＿");

        // add 4th variable
        await updateMathInputValue({
            latex: "x,y,z,w",
            name: "/variablesOrig",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "/",
            -3,
            2,
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "/",
            -3,
            2,
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "/",
            -3,
            2,
        ]);
    });

    it("different input forms for function of two variables", async () => {
        let core = await createTestCore({
            doenetML: `
  <function name="f" variables="x y" symbolic simplify>x^2/y^3</function>
  <p>Input as vector: <mathInput name="input1" prefill="(2,3)" /></p>
  <p>Input as list: <mathInput name="input2Orig" prefill="2,3" /></p>
  <mathList mergeMathLists name="input2" hide>$input2Orig</mathList>
 
  <graph>
    <point name="A" x="2" y="5" />
    <point name="B" x="3" y="6" />
  </graph>
  <collect name="input3" componentTypes="point" prop="x" target="_graph1" />

  <p>Separate inputs: <mathInput name="input4a" prefill="2" /> 
  <mathInput name="input4b" prefill="3" /></p>


  <p>Evaluate 1a: 
    <evaluate name="result1a" function="$f" input="$input1" />
  </p>
  <p>Evaluate 1b:  <m name="result1b">$$f($input1)</m></p>

  <p>Evaluate 2a: 
    <evaluate name="result2a" function="$f" input="$input2" />
  </p>
  <p>Evaluate 2b:  <m name="result2b">$$f($input2)</m></p>

  <p>Evaluate 3a: 
    <evaluate name="result3a" function="$f" input="$input3" />
  </p>
  <p>Evaluate 3b:  <m name="result3b">$$f($input3)</m></p>

  <p>Evaluate 4a: 
    <evaluate name="result4a" function="$f" input="$input4a $input4b" />
  </p>
  <p>Evaluate 4b:  <m name="result4b">$$f($input4a,$input4b)</m></p>
  <p>Evaluate 4c:  <m name="result4c">$$f($input4a, $input4b)</m></p>

  <p>Evaluate 5a: 
    <evaluate name="result5a" function="$f" input="($input4a,$input4b)" />
  </p>
  <p>Evaluate 5b:  <m name="result5b">$$f(($input4a,$input4b))</m></p>
  <p>Evaluate 5c:  <m name="result5c">$$f(($input4a, $input4b))</m></p>
  <p>Evaluate 5d: 
    <evaluate name="result5d" function="$f" input="($input4a, $input4b)" />
  </p>

  <p>Evaluate 6a: 
    <evaluate name="result6a" function="$f" input="2 3" />
  </p>
  <p>Evaluate 6b:  <m name="result6b">$$f(2,3)</m></p>
  <p>Evaluate 6c:  <m name="result6c">$$f(2, 3)</m></p>

  <p>Evaluate 7a: 
    <evaluate name="result7a" function="$f" input="(2,3)" />
  </p>
  <p>Evaluate 7b:  <m name="result7b">$$f((2,3))</m></p>
  <p>Evaluate 7c:  <m name="result7c">$$f((2, 3))</m></p>
  <p>Evaluate 7d: 
    <evaluate name="result7d" function="$f" input="(2, 3)" />
  </p>

  `,
        });

        // initial state

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1a"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(
            stateVariables[
                stateVariables["/result1b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(stateVariables["/result2a"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(
            stateVariables[
                stateVariables["/result2b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(stateVariables["/result3a"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(
            stateVariables[
                stateVariables["/result3b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(stateVariables["/result4a"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(
            stateVariables[
                stateVariables["/result4b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(
            stateVariables[
                stateVariables["/result4c"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(stateVariables["/result5a"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(
            stateVariables[
                stateVariables["/result5b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(
            stateVariables[
                stateVariables["/result5c"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(stateVariables["/result5d"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(stateVariables["/result6a"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(
            stateVariables[
                stateVariables["/result6b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(
            stateVariables[
                stateVariables["/result6c"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(stateVariables["/result7a"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);
        expect(
            stateVariables[
                stateVariables["/result7b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(
            stateVariables[
                stateVariables["/result7c"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 4, 27]);
        expect(stateVariables["/result7d"].stateValues.value.tree).eqls([
            "/",
            4,
            27,
        ]);

        // change inputs, use altvector
        await updateMathInputValue({
            latex: "\\langle -3,5\\rangle",
            name: "/input1",
            core,
        });
        await updateMathInputValue({
            latex: "-3,5",
            name: "/input2Orig",
            core,
        });
        await updateMathInputValue({
            latex: "-3",
            name: "/input4a",
            core,
        });
        await updateMathInputValue({
            latex: "5",
            name: "/input4b",
            core,
        });

        await movePoint({ name: "/A", x: -3, y: 7, core });
        await movePoint({ name: "/B", x: 5, y: -9, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1a"].stateValues.value.tree).eqls([
            "/",
            9,
            125,
        ]);
        expect(
            stateVariables[
                stateVariables["/result1b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 9, 125]);
        expect(stateVariables["/result2a"].stateValues.value.tree).eqls([
            "/",
            9,
            125,
        ]);
        expect(
            stateVariables[
                stateVariables["/result2b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 9, 125]);
        expect(stateVariables["/result3a"].stateValues.value.tree).eqls([
            "/",
            9,
            125,
        ]);
        expect(
            stateVariables[
                stateVariables["/result3b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 9, 125]);
        expect(stateVariables["/result4a"].stateValues.value.tree).eqls([
            "/",
            9,
            125,
        ]);
        expect(
            stateVariables[
                stateVariables["/result4b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 9, 125]);
        expect(
            stateVariables[
                stateVariables["/result4c"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 9, 125]);
        expect(stateVariables["/result5a"].stateValues.value.tree).eqls([
            "/",
            9,
            125,
        ]);
        expect(
            stateVariables[
                stateVariables["/result5b"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 9, 125]);
        expect(
            stateVariables[
                stateVariables["/result5c"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["/", 9, 125]);
        expect(stateVariables["/result5d"].stateValues.value.tree).eqls([
            "/",
            9,
            125,
        ]);
    });

    it("evaluate numeric and symbolic for vector-valued function of two variables", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Variable 1: <mathInput name="variable1" prefill="x" /></p>
  <p>Variable 2: <mathInput name="variable2" prefill="y" /></p>
  <p>Function: <mathInput name="formula" prefill="(sin(x+y), cos(x-y))"/></p>
  <p>Input 1 value: <mathInput name="input1" prefill="0" /></p>
  <p>Input 2 value: <mathInput name="input2" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable1 $variable2" simplify="numbersPreserveOrder" displaySmallAsZero >$formula</function>

  <function name="f_numeric" variables="$variable1 $variable2" symbolic="false" simplify="numbersPreserveOrder" displaySmallAsZero >$formula</function>

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <m name="result_symbolic2">$$f_symbolic($input1, $input2)</m></p>

  <p>Evaluated symbolic result again: $result_symbolic{name="result_symbolic3"}</p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Evaluate numeric using macro:  <m name="result_numeric2">$$f_numeric($input1, $input2)</m></p>

  <p>Evaluated numeric result again: $result_numeric{name="result_numeric3"}</p>

  <p>Force evaluate symbolic numeric function: 
  <evaluate forceSymbolic name="result_force_symbolic_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Force evaluate numeric symbolic function: 
  <evaluate forceNumeric name="result_force_numeric_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>


  `,
        });

        // initial state
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "vector",
            ["apply", "sin", 0],
            ["apply", "cos", 0],
        ]);
        let result_symbolic2_name =
            stateVariables["/result_symbolic2"].activeChildren[0].componentName;
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls(["vector", ["apply", "sin", 0], ["apply", "cos", 0]]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            ["vector", ["apply", "sin", 0], ["apply", "cos", 0]],
        );
        expect(stateVariables["/result_numeric"].stateValues.value.tree).eqls([
            "vector",
            0,
            1,
        ]);
        let result_numeric2_name =
            stateVariables["/result_numeric2"].activeChildren[0].componentName;
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree,
        ).eqls(["vector", 0, 1]);
        expect(stateVariables["/result_numeric3"].stateValues.value.tree).eqls([
            "vector",
            0,
            1,
        ]);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls(["vector", ["apply", "sin", 0], ["apply", "cos", 0]]);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree,
        ).eqls(["vector", 0, 1]);

        // evaluate at (pi, 2pi)
        await updateMathInputValue({
            latex: "\\pi",
            name: "/input1",
            core,
        });
        await updateMathInputValue({
            latex: "2\\pi",
            name: "/input2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "vector",
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
            ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls([
            "vector",
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
            ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
        ]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            [
                "vector",
                ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
                ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
            ],
        );
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree.map((x) =>
                typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree.map(
                (x) =>
                    typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree.map(
                (x) =>
                    typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls([
            "vector",
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
            ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
        ]);
        expect(
            stateVariables[
                "/result_force_numeric_symbolic"
            ].stateValues.value.tree.map((x) =>
                typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);

        // change variable
        await updateMathInputValue({
            latex: "u",
            name: "/variable1",
            core,
        });
        await updateMathInputValue({
            latex: "v",
            name: "/variable2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "vector",
            ["apply", "sin", ["+", "x", "y"]],
            ["apply", "cos", ["+", "x", ["-", "y"]]],
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls([
            "vector",
            ["apply", "sin", ["+", "x", "y"]],
            ["apply", "cos", ["+", "x", ["-", "y"]]],
        ]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            [
                "vector",
                ["apply", "sin", ["+", "x", "y"]],
                ["apply", "cos", ["+", "x", ["-", "y"]]],
            ],
        );
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree[1],
        ).eqls(NaN);
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree[2],
        ).eqls(NaN);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree[1],
        ).eqls(NaN);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree[2],
        ).eqls(NaN);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree[1],
        ).eqls(NaN);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree[2],
        ).eqls(NaN);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls([
            "vector",
            ["apply", "sin", ["+", "x", "y"]],
            ["apply", "cos", ["+", "x", ["-", "y"]]],
        ]);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree[1],
        ).eqls(NaN);
        expect(
            stateVariables["/result_force_numeric_symbolic"].stateValues.value
                .tree[2],
        ).eqls(NaN);

        // change formula to use new variables
        await updateMathInputValue({
            latex: "(\\sin(u+v), \\cos(u-v))",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result_symbolic"].stateValues.value.tree).eqls([
            "vector",
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
            ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
        ]);
        expect(
            stateVariables[result_symbolic2_name].stateValues.value.tree,
        ).eqls([
            "vector",
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
            ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
        ]);
        expect(stateVariables["/result_symbolic3"].stateValues.value.tree).eqls(
            [
                "vector",
                ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
                ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
            ],
        );
        expect(
            stateVariables["/result_numeric"].stateValues.value.tree.map((x) =>
                typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);
        expect(
            stateVariables[result_numeric2_name].stateValues.value.tree.map(
                (x) =>
                    typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);
        expect(
            stateVariables["/result_numeric3"].stateValues.value.tree.map(
                (x) =>
                    typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);
        expect(
            stateVariables["/result_force_symbolic_numeric"].stateValues.value
                .tree,
        ).eqls([
            "vector",
            ["apply", "sin", ["+", "pi", ["*", 2, "pi"]]],
            ["apply", "cos", ["+", "pi", ["*", -2, "pi"]]],
        ]);
        expect(
            stateVariables[
                "/result_force_numeric_symbolic"
            ].stateValues.value.tree.map((x) =>
                typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x,
            ),
        ).eqls(["vector", 0, -1]);
    });

    it("vector-valued function of multiple variables", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Variables: <mathInput name="variablesOrig" prefill="x,y" /></p>
  <p>Function: <mathInput name="formula" prefill="(x+y, x-y)"/></p>
  <p>Input: <mathInput name="input" prefill="(0,0)" /></p>
  <mathList mergeMathLists name="variables" hide>$variablesOrig</mathList>

  <function name="f" variables="$variables" symbolic simplify displaySmallAsZero>$formula</function>

  <p>Evaluate 1: 
    <evaluate name="result1" function="$f" input="$input" />
  </p>

  <p>Evaluate 2:  <m name="result2">$$f($input)</m></p>

  <p>Evaluate 3: $result1{name="result3"}</p>
  `,
        });

        // initial state
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(2);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "vector",
            0,
            0,
        ]);
        let result2Name =
            stateVariables["/result2"].activeChildren[0].componentName;
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "vector",
            0,
            0,
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "vector",
            0,
            0,
        ]);

        // evaluate at (7,3)
        await updateMathInputValue({
            latex: "(7,3)",
            name: "/input",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(2);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "vector",
            10,
            4,
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "vector",
            10,
            4,
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "vector",
            10,
            4,
        ]);

        // change variables to 3D
        await updateMathInputValue({
            latex: "x,y,z",
            name: "/variablesOrig",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(2);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables[result2Name].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/result3"].stateValues.value.tree).eqls("＿");

        // change input to 3D
        await updateMathInputValue({
            latex: "(7,3,2)",
            name: "/input",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(2);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "vector",
            10,
            4,
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "vector",
            10,
            4,
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "vector",
            10,
            4,
        ]);

        // change formula to use all variables
        await updateMathInputValue({
            latex: "(zx+y, x-yz)",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(2);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
        ]);

        // add third dimension
        await updateMathInputValue({
            latex: "(zx+y, x-yz,xyz)",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(3);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            42,
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            42,
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            42,
        ]);

        // add fourth variable and 4th dimension to formula
        await updateMathInputValue({
            latex: "(zx+y, x-yz,xyzw,w)",
            name: "/formula",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(4);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            ["*", 42, "w"],
            "w",
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            ["*", 42, "w"],
            "w",
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            ["*", 42, "w"],
            "w",
        ]);

        // add 4th input
        await updateMathInputValue({
            latex: "(7,3,2,5)",
            name: "/input",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables[result2Name].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/result3"].stateValues.value.tree).eqls("＿");

        // add 4th variable
        await updateMathInputValue({
            latex: "x,y,z,w",
            name: "/variablesOrig",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/result1"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            210,
            5,
        ]);
        expect(stateVariables[result2Name].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            210,
            5,
        ]);
        expect(stateVariables["/result3"].stateValues.value.tree).eqls([
            "vector",
            17,
            1,
            210,
            5,
        ]);
    });

    it("change variables of symbolic function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function name="f" variables="s t" symbolic simplify expand>st^2</function></p>
  <p>g: <function name="g" variables="t s" simplify expand>$f.formula</function></p>

  <p name="pf1">f(u, v+w) = $$f(u, v+w)</p>
  <p name="pf2">f(a+b, c) = $$f(a+b, c)</p>
  <p name="pg1">g(u, v+w) = $$g(u, v+w)</p>
  <p name="pg2">g(a+b, c) = $$g(a+b, c)</p>

  `,
        });

        // initial state
        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pf1"].stateValues.text).eq(
            "f(u, v+w) = u v² + 2 u v w + u w²",
        );
        expect(stateVariables["/pf2"].stateValues.text).eq(
            "f(a+b, c) = a c² + b c²",
        );
        expect(stateVariables["/pg1"].stateValues.text).eq(
            "g(u, v+w) = v u² + w u²",
        );
        expect(stateVariables["/pg2"].stateValues.text).eq(
            "g(a+b, c) = c a² + 2 a b c + c b²",
        );
    });

    it("change variables of numeric function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function name="f" variables="s t" symbolic="false">st^2</function></p>
  <p>g: <function name="g" variables="t s" symbolic="false">$f.formula</function></p>

  <p name="pf">f(2, -3) = $$f(2, -3)</p>
  <p name="pg">g(2, -3) = $$g(2, -3)</p>

  `,
        });

        // initial state
        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pf"].stateValues.text).eq("f(2, -3) = 18");
        expect(stateVariables["/pg"].stateValues.text).eq("g(2, -3) = -12");
    });

    it("change variables of interpolated function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function name="f" variables="s" maxima="(3,4)" /></p>
  <p>g: <function name="g" variables="t">$f</function></p>

  <p name="pf1">f(3) = $$f(3)</p>
  <p name="pf2">f(4) = $$f(4)</p>
  <p name="pf3">f(5) = $$f(5)</p>
  <p name="pg1">g(3) = $$g(3)</p>
  <p name="pg2">g(4) = $$g(4)</p>
  <p name="pg3">g(5) = $$g(5)</p>

  `,
        });

        // initial state
        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pf1"].stateValues.text).eq("f(3) = 4");
        expect(stateVariables["/pf2"].stateValues.text).eq("f(4) = 3");
        expect(stateVariables["/pf3"].stateValues.text).eq("f(5) = 0");
        expect(stateVariables["/pg1"].stateValues.text).eq("g(3) = 4");
        expect(stateVariables["/pg2"].stateValues.text).eq("g(4) = 3");
        expect(stateVariables["/pg3"].stateValues.text).eq("g(5) = 0");
    });

    it("evaluate at asymptotes", { timeout: 200000 }, async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" symbolic="false">1/x</function></p>
  <p>f2: <function name="f2" symbolic="false">1/(-x)</function></p>
  <p>f3: <function name="f3" symbolic="false">-1/x</function></p>
  <p>f4: <function name="f4" symbolic="false">-1/(-x)</function></p>
  <p>f5: <function name="f5" symbolic="false">1/(x(x-1))</function></p>
  <p>f6: <function name="f6" symbolic="false">1/(x(x+1))</function></p>
  <p>f7: <function name="f7" symbolic="false">1/(x(x+1)(x-1))</function></p>
  <p>f5a: <function name="f5a" symbolic="false">1/x*1/(x-1)</function></p>
  <p>f6a: <function name="f6a" symbolic="false">1/x*1/(x+1)</function></p>
  <p>f7a: <function name="f7a" symbolic="false">1/x*1/(x+1)*1/(x-1)</function></p>

  <p><evaluate function="$f1" input="0" name="f10n" /></p>
  <p><evaluate function="$f1" input="0" name="f10s" forceSymbolic simplify /></p>
  <p><evaluate function="$f2" input="0" name="f20n" /></p>
  <p><evaluate function="$f2" input="0" name="f20s" forceSymbolic simplify /></p>
  <p><evaluate function="$f3" input="0" name="f30n" /></p>
  <p><evaluate function="$f3" input="0" name="f30s" forceSymbolic simplify /></p>
  <p><evaluate function="$f4" input="0" name="f40n" /></p>
  <p><evaluate function="$f4" input="0" name="f40s" forceSymbolic simplify /></p>

  <p><evaluate function="$f5" input="0" name="f50n" /></p>
  <p><evaluate function="$f5" input="0" name="f50s" forceSymbolic simplify /></p>
  <p><evaluate function="$f5" input="1" name="f51n" /></p>
  <p><evaluate function="$f5" input="1" name="f51s" forceSymbolic simplify /></p>

  <p><evaluate function="$f6" input="0" name="f60n" /></p>
  <p><evaluate function="$f6" input="0" name="f60s" forceSymbolic simplify /></p>
  <p><evaluate function="$f6" input="-1" name="f6n1n" /></p>
  <p><evaluate function="$f6" input="-1" name="f6n1s" forceSymbolic simplify /></p>

  <p><evaluate function="$f7" input="0" name="f70n" /></p>
  <p><evaluate function="$f7" input="0" name="f70s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7" input="1" name="f71n" /></p>
  <p><evaluate function="$f7" input="1" name="f71s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7" input="-1" name="f7n1n" /></p>
  <p><evaluate function="$f7" input="-1" name="f7n1s" forceSymbolic simplify /></p>


  <p><evaluate function="$f5a" input="0" name="f5a0n" /></p>
  <p><evaluate function="$f5a" input="0" name="f5a0s" forceSymbolic simplify /></p>
  <p><evaluate function="$f5a" input="1" name="f5a1n" /></p>
  <p><evaluate function="$f5a" input="1" name="f5a1s" forceSymbolic simplify /></p>

  <p><evaluate function="$f6a" input="0" name="f6a0n" /></p>
  <p><evaluate function="$f6a" input="0" name="f6a0s" forceSymbolic simplify /></p>
  <p><evaluate function="$f6a" input="-1" name="f6an1n" /></p>
  <p><evaluate function="$f6a" input="-1" name="f6an1s" forceSymbolic simplify /></p>

  <p><evaluate function="$f7a" input="0" name="f7a0n" /></p>
  <p><evaluate function="$f7a" input="0" name="f7a0s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7a" input="1" name="f7a1n" /></p>
  <p><evaluate function="$f7a" input="1" name="f7a1s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7a" input="-1" name="f7an1n" /></p>
  <p><evaluate function="$f7a" input="-1" name="f7an1s" forceSymbolic simplify /></p>

  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f10n"].stateValues.text).eq("∞");
        expect(stateVariables["/f10s"].stateValues.text).eq("∞");
        expect(stateVariables["/f20n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f20s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f30n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f30s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f40n"].stateValues.text).eq("∞");
        expect(stateVariables["/f40s"].stateValues.text).eq("∞");
        expect(stateVariables["/f50n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f50s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f51n"].stateValues.text).eq("∞");
        expect(stateVariables["/f51s"].stateValues.text).eq("∞");
        expect(stateVariables["/f60n"].stateValues.text).eq("∞");
        expect(stateVariables["/f60s"].stateValues.text).eq("∞");
        expect(stateVariables["/f6n1n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f6n1s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f70n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f70s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f71n"].stateValues.text).eq("∞");
        expect(stateVariables["/f71s"].stateValues.text).eq("∞");
        expect(stateVariables["/f7n1n"].stateValues.text).eq("∞");
        expect(stateVariables["/f7n1s"].stateValues.text).eq("∞");
        expect(stateVariables["/f5a0n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f5a0s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f5a1n"].stateValues.text).eq("∞");
        expect(stateVariables["/f5a1s"].stateValues.text).eq("∞");
        expect(stateVariables["/f6a0n"].stateValues.text).eq("∞");
        expect(stateVariables["/f6a0s"].stateValues.text).eq("∞");
        expect(stateVariables["/f6an1n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f6an1s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f7a0n"].stateValues.text).eq("-∞");
        expect(stateVariables["/f7a0s"].stateValues.text).eq("-∞");
        expect(stateVariables["/f7a1n"].stateValues.text).eq("∞");
        expect(stateVariables["/f7a1s"].stateValues.text).eq("∞");
        expect(stateVariables["/f7an1n"].stateValues.text).eq("∞");
        expect(stateVariables["/f7an1s"].stateValues.text).eq("∞");
    });

    it("evaluate at infinity", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" symbolic="false">1/x</function></p>
  <p>f2: <function name="f2" symbolic="false">1/(-x)</function></p>
  <p>f3: <function name="f3" symbolic="false">x^3</function></p>
  <p>f4: <function name="f4" symbolic="false">(-x)^3</function></p>
  <p>f5: <function name="f5" symbolic="false">sin(x)</function></p>

  <p><evaluate function="$f1" input="Infinity" name="f1pn" /></p>
  <p><evaluate function="$f1" input="Infinity" name="f1ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f1" input="-Infinity" name="f1mn" /></p>
  <p><evaluate function="$f1" input="-Infinity" name="f1ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f2" input="Infinity" name="f2pn" /></p>
  <p><evaluate function="$f2" input="Infinity" name="f2ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f2" input="-Infinity" name="f2mn" /></p>
  <p><evaluate function="$f2" input="-Infinity" name="f2ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f3" input="Infinity" name="f3pn" /></p>
  <p><evaluate function="$f3" input="Infinity" name="f3ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f3" input="-Infinity" name="f3mn" /></p>
  <p><evaluate function="$f3" input="-Infinity" name="f3ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f4" input="Infinity" name="f4pn" /></p>
  <p><evaluate function="$f4" input="Infinity" name="f4ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f4" input="-Infinity" name="f4mn" /></p>
  <p><evaluate function="$f4" input="-Infinity" name="f4ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f5" input="Infinity" name="f5pn" /></p>
  <p><evaluate function="$f5" input="Infinity" name="f5ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f5" input="-Infinity" name="f5mn" /></p>
  <p><evaluate function="$f5" input="-Infinity" name="f5ms" forceSymbolic simplify /></p>

  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1pn"].stateValues.text).eq("0");
        expect(stateVariables["/f1ps"].stateValues.text).eq("0");
        expect(stateVariables["/f1mn"].stateValues.text).eq("0");
        expect(stateVariables["/f1ms"].stateValues.text).eq("0");
        expect(stateVariables["/f2pn"].stateValues.text).eq("0");
        expect(stateVariables["/f2ps"].stateValues.text).eq("0");
        expect(stateVariables["/f2mn"].stateValues.text).eq("0");
        expect(stateVariables["/f2ms"].stateValues.text).eq("0");
        expect(stateVariables["/f3pn"].stateValues.text).eq("∞");
        expect(stateVariables["/f3ps"].stateValues.text).eq("∞");
        expect(stateVariables["/f3mn"].stateValues.text).eq("-∞");
        expect(stateVariables["/f3ms"].stateValues.text).eq("-∞");
        expect(stateVariables["/f4pn"].stateValues.text).eq("-∞");
        expect(stateVariables["/f4ps"].stateValues.text).eq("-∞");
        expect(stateVariables["/f4mn"].stateValues.text).eq("∞");
        expect(stateVariables["/f4ms"].stateValues.text).eq("∞");
        expect(stateVariables["/f5pn"].stateValues.text).eq("NaN");
        expect(stateVariables["/f5ps"].stateValues.text).eq("sin(∞)");
        expect(stateVariables["/f5mn"].stateValues.text).eq("NaN");
        expect(stateVariables["/f5ms"].stateValues.text).eq("sin(-∞)");
    });

    it("evaluate at infinity, interpolated functions", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" through="(-10,2) (10,2)" /></p>
  <p>f2: <function name="f2" through="(-10,2) (10,4)" /></p>
  <p>f3: <function name="f3" through="(-10,2) (10,-4)" /></p>
  <p>f4: <function name="f4" minima="(-5,2)" maxima="(5,8)" /></p>
  <p>f5: <function name="f5" minima="(5,2)" maxima="(-5,8)" /></p>

  <p><evaluate function="$f1" input="Infinity" name="f1pn" /></p>
  <p><evaluate function="$f1" input="-Infinity" name="f1mn" /></p>

  <p><evaluate function="$f2" input="Infinity" name="f2pn" /></p>
  <p><evaluate function="$f2" input="-Infinity" name="f2mn" /></p>

  <p><evaluate function="$f3" input="Infinity" name="f3pn" /></p>
  <p><evaluate function="$f3" input="-Infinity" name="f3mn" /></p>

  <p><evaluate function="$f4" input="Infinity" name="f4pn" /></p>
  <p><evaluate function="$f4" input="-Infinity" name="f4mn" /></p>

  <p><evaluate function="$f5" input="Infinity" name="f5pn" /></p>
  <p><evaluate function="$f5" input="-Infinity" name="f5mn" /></p>

  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1pn"].stateValues.text).eq("2");
        expect(stateVariables["/f1mn"].stateValues.text).eq("2");
        expect(stateVariables["/f2pn"].stateValues.text).eq("∞");
        expect(stateVariables["/f2mn"].stateValues.text).eq("-∞");
        expect(stateVariables["/f3pn"].stateValues.text).eq("-∞");
        expect(stateVariables["/f3mn"].stateValues.text).eq("∞");
        expect(stateVariables["/f4pn"].stateValues.text).eq("-∞");
        expect(stateVariables["/f4mn"].stateValues.text).eq("∞");
        expect(stateVariables["/f5pn"].stateValues.text).eq("∞");
        expect(stateVariables["/f5mn"].stateValues.text).eq("-∞");
    });

    it("evaluate at domain boundary, numeric", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" domain="(-pi,pi)" displaySmallAsZero symbolic="false">sin(x)</function></p>
  <p>f2: <function name="f2" domain="(-pi,pi]" displaySmallAsZero symbolic="false">sin(x)</function></p>
  <p>f3: <function name="f3" domain="[-pi,pi]" displaySmallAsZero symbolic="false">sin(x)</function></p>
  <p>f4: <function name="f4" domain="[-pi,pi)" displaySmallAsZero symbolic="false">sin(x)</function></p>

  <p><evaluate function="$f1" input="-pi" name="f1l" /></p>
  <p><evaluate function="$f1" input="pi" name="f1r" /></p>
  <p><evaluate function="$f1" input="0" name="f1m" /></p>

  <p><evaluate function="$f2" input="-pi" name="f2l" /></p>
  <p><evaluate function="$f2" input="pi" name="f2r" /></p>
  <p><evaluate function="$f2" input="0" name="f2m" /></p>

  <p><evaluate function="$f3" input="-pi" name="f3l" /></p>
  <p><evaluate function="$f3" input="pi" name="f3r" /></p>
  <p><evaluate function="$f3" input="0" name="f3m" /></p>

  <p><evaluate function="$f4" input="-pi" name="f4l" /></p>
  <p><evaluate function="$f4" input="pi" name="f4r" /></p>
  <p><evaluate function="$f4" input="0" name="f4m" /></p>

  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1l"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1r"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1m"].stateValues.text).eq("0");
        expect(stateVariables["/f2l"].stateValues.text).eq("NaN");
        expect(stateVariables["/f2r"].stateValues.text).eq("0");
        expect(stateVariables["/f2m"].stateValues.text).eq("0");
        expect(stateVariables["/f3l"].stateValues.text).eq("0");
        expect(stateVariables["/f3r"].stateValues.text).eq("0");
        expect(stateVariables["/f3m"].stateValues.text).eq("0");
        expect(stateVariables["/f4l"].stateValues.text).eq("0");
        expect(stateVariables["/f4r"].stateValues.text).eq("NaN");
        expect(stateVariables["/f4m"].stateValues.text).eq("0");

        // test functions
        let f1 = (await core.components!["/f1"].stateValues.fs)[0];
        let f2 = (await core.components!["/f2"].stateValues.fs)[0];
        let f3 = (await core.components!["/f3"].stateValues.fs)[0];
        let f4 = (await core.components!["/f4"].stateValues.fs)[0];

        expect(f1(-Math.PI)).eqls(NaN);
        expect(f1(0)).eqls(0);
        expect(f1(Math.PI)).eqls(NaN);
        expect(f2(-Math.PI)).eqls(NaN);
        expect(f2(0)).eqls(0);
        expect(f2(Math.PI)).closeTo(0, 1e-14);
        expect(f3(-Math.PI)).closeTo(0, 1e-14);
        expect(f3(0)).eqls(0);
        expect(f3(Math.PI)).closeTo(0, 1e-14);
        expect(f4(-Math.PI)).closeTo(0, 1e-14);
        expect(f4(0)).eqls(0);
        expect(f4(Math.PI)).eqls(NaN);
    });

    it("evaluate at domain boundary, symbolic", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" domain="(-pi,pi)" displaySmallAsZero>sin(x)</function></p>
  <p>f2: <function name="f2" domain="(-pi,pi]" displaySmallAsZero>sin(x)</function></p>
  <p>f3: <function name="f3" domain="[-pi,pi]" displaySmallAsZero>sin(x)</function></p>
  <p>f4: <function name="f4" domain="[-pi,pi)" displaySmallAsZero>sin(x)</function></p>

  <p><evaluate function="$f1" input="-pi" name="f1l" /></p>
  <p><evaluate function="$f1" input="pi" name="f1r" /></p>
  <p><evaluate function="$f1" input="0" name="f1m" /></p>
  <p><evaluate function="$f1" input="10y" name="f1y" /></p>

  <p><evaluate function="$f2" input="-pi" name="f2l" /></p>
  <p><evaluate function="$f2" input="pi" name="f2r" /></p>
  <p><evaluate function="$f2" input="0" name="f2m" /></p>
  <p><evaluate function="$f2" input="10y" name="f2y" /></p>

  <p><evaluate function="$f3" input="-pi" name="f3l" /></p>
  <p><evaluate function="$f3" input="pi" name="f3r" /></p>
  <p><evaluate function="$f3" input="0" name="f3m" /></p>
  <p><evaluate function="$f3" input="10y" name="f3y" /></p>

  <p><evaluate function="$f4" input="-pi" name="f4l" /></p>
  <p><evaluate function="$f4" input="pi" name="f4r" /></p>
  <p><evaluate function="$f4" input="0" name="f4m" /></p>
  <p><evaluate function="$f4" input="10y" name="f4y" /></p>

  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1l"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1r"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1m"].stateValues.text).eq("0");
        expect(stateVariables["/f1y"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f2l"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f2r"].stateValues.text).eq("sin(π)"); // eventually should be '0' once can simplify sin(pi)
        expect(stateVariables["/f2m"].stateValues.text).eq("0");
        expect(stateVariables["/f2y"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f3l"].stateValues.text).eq("sin(-π)"); // eventually should be '0' once can simplify sin(-pi)
        expect(stateVariables["/f3r"].stateValues.text).eq("sin(π)"); // eventually should be '0' once can simplify sin(pi)
        expect(stateVariables["/f3m"].stateValues.text).eq("0");
        expect(stateVariables["/f3y"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f4l"].stateValues.text).eq("sin(-π)"); // eventually should be '0' once can simplify sin(-pi)
        expect(stateVariables["/f4r"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f4m"].stateValues.text).eq("0");
        expect(stateVariables["/f4y"].stateValues.text).eq("sin(10 y)");
    });

    it("evaluate at domain boundary, numeric, multidimensional", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" domain="(-pi,pi) (-pi, pi)" displaySmallAsZero symbolic="false" variables="x y">sin(x+y)</function></p>
  <p>f2: <function name="f2" domain="(-pi,pi] (-pi, pi]" displaySmallAsZero symbolic="false" variables="x y">sin(x+y)</function></p>
  <p>f3: <function name="f3" domain="[-pi,pi] [-pi, pi]" displaySmallAsZero symbolic="false" variables="x y">sin(x+y)</function></p>
  <p>f4: <function name="f4" domain="[-pi,pi) [-pi, pi)" displaySmallAsZero symbolic="false" variables="x y">sin(x+y)</function></p>

  <p><evaluate function="$f1" input="-pi -pi" name="f1ll" /></p>
  <p><evaluate function="$f1" input="-pi pi" name="f1lr" /></p>
  <p><evaluate function="$f1" input="-pi 0" name="f1lm" /></p>
  <p><evaluate function="$f1" input="pi -pi" name="f1rl" /></p>
  <p><evaluate function="$f1" input="pi pi" name="f1rr" /></p>
  <p><evaluate function="$f1" input="pi 0" name="f1rm" /></p>
  <p><evaluate function="$f1" input="0 -pi" name="f1ml" /></p>
  <p><evaluate function="$f1" input="0 pi" name="f1mr" /></p>
  <p><evaluate function="$f1" input="0 0" name="f1mm" /></p>

  <p><evaluate function="$f2" input="-pi -pi" name="f2ll" /></p>
  <p><evaluate function="$f2" input="-pi pi" name="f2lr" /></p>
  <p><evaluate function="$f2" input="-pi 0" name="f2lm" /></p>
  <p><evaluate function="$f2" input="pi -pi" name="f2rl" /></p>
  <p><evaluate function="$f2" input="pi pi" name="f2rr" /></p>
  <p><evaluate function="$f2" input="pi 0" name="f2rm" /></p>
  <p><evaluate function="$f2" input="0 -pi" name="f2ml" /></p>
  <p><evaluate function="$f2" input="0 pi" name="f2mr" /></p>
  <p><evaluate function="$f2" input="0 0" name="f2mm" /></p>

  <p><evaluate function="$f3" input="-pi -pi" name="f3ll" /></p>
  <p><evaluate function="$f3" input="-pi pi" name="f3lr" /></p>
  <p><evaluate function="$f3" input="-pi 0" name="f3lm" /></p>
  <p><evaluate function="$f3" input="pi -pi" name="f3rl" /></p>
  <p><evaluate function="$f3" input="pi pi" name="f3rr" /></p>
  <p><evaluate function="$f3" input="pi 0" name="f3rm" /></p>
  <p><evaluate function="$f3" input="0 -pi" name="f3ml" /></p>
  <p><evaluate function="$f3" input="0 pi" name="f3mr" /></p>
  <p><evaluate function="$f3" input="0 0" name="f3mm" /></p>

  <p><evaluate function="$f4" input="-pi -pi" name="f4ll" /></p>
  <p><evaluate function="$f4" input="-pi pi" name="f4lr" /></p>
  <p><evaluate function="$f4" input="-pi 0" name="f4lm" /></p>
  <p><evaluate function="$f4" input="pi -pi" name="f4rl" /></p>
  <p><evaluate function="$f4" input="pi pi" name="f4rr" /></p>
  <p><evaluate function="$f4" input="pi 0" name="f4rm" /></p>
  <p><evaluate function="$f4" input="0 -pi" name="f4ml" /></p>
  <p><evaluate function="$f4" input="0 pi" name="f4mr" /></p>
  <p><evaluate function="$f4" input="0 0" name="f4mm" /></p>


  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1ll"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1lr"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1lm"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1rl"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1rr"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1rm"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1ml"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1mr"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1mm"].stateValues.text).eq("0");
        expect(stateVariables["/f2ll"].stateValues.text).eq("NaN");
        expect(stateVariables["/f2lr"].stateValues.text).eq("NaN");
        expect(stateVariables["/f2lm"].stateValues.text).eq("NaN");
        expect(stateVariables["/f2rl"].stateValues.text).eq("NaN");
        expect(stateVariables["/f2rr"].stateValues.text).eq("0");
        expect(stateVariables["/f2rm"].stateValues.text).eq("0");
        expect(stateVariables["/f2ml"].stateValues.text).eq("NaN");
        expect(stateVariables["/f2mr"].stateValues.text).eq("0");
        expect(stateVariables["/f2mm"].stateValues.text).eq("0");
        expect(stateVariables["/f3ll"].stateValues.text).eq("0");
        expect(stateVariables["/f3lr"].stateValues.text).eq("0");
        expect(stateVariables["/f3lm"].stateValues.text).eq("0");
        expect(stateVariables["/f3rl"].stateValues.text).eq("0");
        expect(stateVariables["/f3rr"].stateValues.text).eq("0");
        expect(stateVariables["/f3rm"].stateValues.text).eq("0");
        expect(stateVariables["/f3ml"].stateValues.text).eq("0");
        expect(stateVariables["/f3mr"].stateValues.text).eq("0");
        expect(stateVariables["/f3mm"].stateValues.text).eq("0");
        expect(stateVariables["/f4ll"].stateValues.text).eq("0");
        expect(stateVariables["/f4lr"].stateValues.text).eq("NaN");
        expect(stateVariables["/f4lm"].stateValues.text).eq("0");
        expect(stateVariables["/f4rl"].stateValues.text).eq("NaN");
        expect(stateVariables["/f4rr"].stateValues.text).eq("NaN");
        expect(stateVariables["/f4rm"].stateValues.text).eq("NaN");
        expect(stateVariables["/f4ml"].stateValues.text).eq("0");
        expect(stateVariables["/f4mr"].stateValues.text).eq("NaN");
        expect(stateVariables["/f4mm"].stateValues.text).eq("0");

        // test functions
        let f1 = (await core.components!["/f1"].stateValues.fs)[0];
        let f2 = (await core.components!["/f2"].stateValues.fs)[0];
        let f3 = (await core.components!["/f3"].stateValues.fs)[0];
        let f4 = (await core.components!["/f4"].stateValues.fs)[0];

        expect(f1(-Math.PI, -Math.PI)).eqls(NaN);
        expect(f1(-Math.PI, 0)).eqls(NaN);
        expect(f1(-Math.PI, Math.PI)).eqls(NaN);
        expect(f1(0, -Math.PI)).eqls(NaN);
        expect(f1(0, 0)).eqls(0);
        expect(f1(0, Math.PI)).eqls(NaN);
        expect(f1(Math.PI, -Math.PI)).eqls(NaN);
        expect(f1(Math.PI, 0)).eqls(NaN);
        expect(f1(Math.PI, Math.PI)).eqls(NaN);

        expect(f2(-Math.PI, -Math.PI)).eqls(NaN);
        expect(f2(-Math.PI, 0)).eqls(NaN);
        expect(f2(-Math.PI, Math.PI)).eqls(NaN);
        expect(f2(0, -Math.PI)).eqls(NaN);
        expect(f2(0, 0)).eqls(0);
        expect(f2(0, Math.PI)).closeTo(0, 1e-14);
        expect(f2(Math.PI, -Math.PI)).eqls(NaN);
        expect(f2(Math.PI, 0)).closeTo(0, 1e-14);
        expect(f2(Math.PI, Math.PI)).closeTo(0, 1e-14);

        expect(f3(-Math.PI, -Math.PI)).closeTo(0, 1e-14);
        expect(f3(-Math.PI, 0)).closeTo(0, 1e-14);
        expect(f3(-Math.PI, Math.PI)).closeTo(0, 1e-14);
        expect(f3(0, -Math.PI)).closeTo(0, 1e-14);
        expect(f3(0, 0)).eqls(0);
        expect(f3(0, Math.PI)).closeTo(0, 1e-14);
        expect(f3(Math.PI, -Math.PI)).closeTo(0, 1e-14);
        expect(f3(Math.PI, 0)).closeTo(0, 1e-14);
        expect(f3(Math.PI, Math.PI)).closeTo(0, 1e-14);

        expect(f4(-Math.PI, -Math.PI)).closeTo(0, 1e-14);
        expect(f4(-Math.PI, 0)).closeTo(0, 1e-14);
        expect(f4(-Math.PI, Math.PI)).eqls(NaN);
        expect(f4(0, -Math.PI)).closeTo(0, 1e-14);
        expect(f4(0, 0)).eqls(0);
        expect(f4(0, Math.PI)).eqls(NaN);
        expect(f4(Math.PI, -Math.PI)).eqls(NaN);
        expect(f4(Math.PI, 0)).eqls(NaN);
        expect(f4(Math.PI, Math.PI)).eqls(NaN);
    });

    it("evaluate at domain boundary, symbolic, multidimensional", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" domain="(-pi,pi) (-pi, pi)" displaySmallAsZero variables="x y">sin(x+y)</function></p>
  <p>f2: <function name="f2" domain="(-pi,pi] (-pi, pi]" displaySmallAsZero variables="x y">sin(x+y)</function></p>
  <p>f3: <function name="f3" domain="[-pi,pi] [-pi, pi]" displaySmallAsZero variables="x y">sin(x+y)</function></p>
  <p>f4: <function name="f4" domain="[-pi,pi) [-pi, pi)" displaySmallAsZero variables="x y">sin(x+y)</function></p>

  <p><evaluate function="$f1" input="-pi -pi" name="f1ll" /></p>
  <p><evaluate function="$f1" input="-pi pi" name="f1lr" /></p>
  <p><evaluate function="$f1" input="-pi 0" name="f1lm" /></p>
  <p><evaluate function="$f1" input="-pi 10y" name="f1ly" /></p>
  <p><evaluate function="$f1" input="pi -pi" name="f1rl" /></p>
  <p><evaluate function="$f1" input="pi pi" name="f1rr" /></p>
  <p><evaluate function="$f1" input="pi 0" name="f1rm" /></p>
  <p><evaluate function="$f1" input="pi 10y" name="f1ry" /></p>
  <p><evaluate function="$f1" input="0 -pi" name="f1ml" /></p>
  <p><evaluate function="$f1" input="0 pi" name="f1mr" /></p>
  <p><evaluate function="$f1" input="0 0" name="f1mm" /></p>
  <p><evaluate function="$f1" input="0 10y" name="f1my" /></p>
  <p><evaluate function="$f1" input="10y -pi" name="f1yl" /></p>
  <p><evaluate function="$f1" input="10y pi" name="f1yr" /></p>
  <p><evaluate function="$f1" input="10y 0" name="f1ym" /></p>
  <p><evaluate function="$f1" input="10y 10y" name="f1yy" /></p>

  <p><evaluate function="$f2" input="-pi -pi" name="f2ll" /></p>
  <p><evaluate function="$f2" input="-pi pi" name="f2lr" /></p>
  <p><evaluate function="$f2" input="-pi 0" name="f2lm" /></p>
  <p><evaluate function="$f2" input="-pi 10y" name="f2ly" /></p>
  <p><evaluate function="$f2" input="pi -pi" name="f2rl" /></p>
  <p><evaluate function="$f2" input="pi pi" name="f2rr" /></p>
  <p><evaluate function="$f2" input="pi 0" name="f2rm" /></p>
  <p><evaluate function="$f2" input="pi 10y" name="f2ry" /></p>
  <p><evaluate function="$f2" input="0 -pi" name="f2ml" /></p>
  <p><evaluate function="$f2" input="0 pi" name="f2mr" /></p>
  <p><evaluate function="$f2" input="0 0" name="f2mm" /></p>
  <p><evaluate function="$f2" input="0 10y" name="f2my" /></p>
  <p><evaluate function="$f2" input="10y -pi" name="f2yl" /></p>
  <p><evaluate function="$f2" input="10y pi" name="f2yr" /></p>
  <p><evaluate function="$f2" input="10y 0" name="f2ym" /></p>
  <p><evaluate function="$f2" input="10y 10y" name="f2yy" /></p>

  <p><evaluate function="$f3" input="-pi -pi" name="f3ll" /></p>
  <p><evaluate function="$f3" input="-pi pi" name="f3lr" /></p>
  <p><evaluate function="$f3" input="-pi 0" name="f3lm" /></p>
  <p><evaluate function="$f3" input="-pi 10y" name="f3ly" /></p>
  <p><evaluate function="$f3" input="pi -pi" name="f3rl" /></p>
  <p><evaluate function="$f3" input="pi pi" name="f3rr" /></p>
  <p><evaluate function="$f3" input="pi 0" name="f3rm" /></p>
  <p><evaluate function="$f3" input="pi 10y" name="f3ry" /></p>
  <p><evaluate function="$f3" input="0 -pi" name="f3ml" /></p>
  <p><evaluate function="$f3" input="0 pi" name="f3mr" /></p>
  <p><evaluate function="$f3" input="0 0" name="f3mm" /></p>
  <p><evaluate function="$f3" input="0 10y" name="f3my" /></p>
  <p><evaluate function="$f3" input="10y -pi" name="f3yl" /></p>
  <p><evaluate function="$f3" input="10y pi" name="f3yr" /></p>
  <p><evaluate function="$f3" input="10y 0" name="f3ym" /></p>
  <p><evaluate function="$f3" input="10y 10y" name="f3yy" /></p>

  <p><evaluate function="$f4" input="-pi -pi" name="f4ll" /></p>
  <p><evaluate function="$f4" input="-pi pi" name="f4lr" /></p>
  <p><evaluate function="$f4" input="-pi 0" name="f4lm" /></p>
  <p><evaluate function="$f4" input="-pi 10y" name="f4ly" /></p>
  <p><evaluate function="$f4" input="pi -pi" name="f4rl" /></p>
  <p><evaluate function="$f4" input="pi pi" name="f4rr" /></p>
  <p><evaluate function="$f4" input="pi 0" name="f4rm" /></p>
  <p><evaluate function="$f4" input="pi 10y" name="f4ry" /></p>
  <p><evaluate function="$f4" input="0 -pi" name="f4ml" /></p>
  <p><evaluate function="$f4" input="0 pi" name="f4mr" /></p>
  <p><evaluate function="$f4" input="0 0" name="f4mm" /></p>
  <p><evaluate function="$f4" input="0 10y" name="f4my" /></p>
  <p><evaluate function="$f4" input="10y -pi" name="f4yl" /></p>
  <p><evaluate function="$f4" input="10y pi" name="f4yr" /></p>
  <p><evaluate function="$f4" input="10y 0" name="f4ym" /></p>
  <p><evaluate function="$f4" input="10y 10y" name="f4yy" /></p>


  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1ll"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1lr"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1lm"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1ly"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f1rl"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1rr"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1rm"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1ry"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f1ml"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1mr"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1mm"].stateValues.text).eq("0");
        expect(stateVariables["/f1my"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f1yl"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f1yr"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f1ym"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f1yy"].stateValues.text).eq("sin(20 y)");
        expect(stateVariables["/f2ll"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f2lr"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f2lm"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f2ly"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f2rl"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f2rr"].stateValues.text).eq("sin(2 π)");
        expect(stateVariables["/f2rm"].stateValues.text).eq("sin(π)");
        expect(stateVariables["/f2ry"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f2ml"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f2mr"].stateValues.text).eq("sin(π)");
        expect(stateVariables["/f2mm"].stateValues.text).eq("0");
        expect(stateVariables["/f2my"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f2yl"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f2yr"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f2ym"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f2yy"].stateValues.text).eq("sin(20 y)");
        expect(stateVariables["/f3ll"].stateValues.text).eq("sin(-2 π)");
        expect(stateVariables["/f3lr"].stateValues.text).eq("0");
        expect(stateVariables["/f3lm"].stateValues.text).eq("sin(-π)");
        expect(stateVariables["/f3ly"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f3rl"].stateValues.text).eq("0");
        expect(stateVariables["/f3rr"].stateValues.text).eq("sin(2 π)");
        expect(stateVariables["/f3rm"].stateValues.text).eq("sin(π)");
        expect(stateVariables["/f3ry"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f3ml"].stateValues.text).eq("sin(-π)");
        expect(stateVariables["/f3mr"].stateValues.text).eq("sin(π)");
        expect(stateVariables["/f3mm"].stateValues.text).eq("0");
        expect(stateVariables["/f3my"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f3yl"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f3yr"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f3ym"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f3yy"].stateValues.text).eq("sin(20 y)");
        expect(stateVariables["/f4ll"].stateValues.text).eq("sin(-2 π)");
        expect(stateVariables["/f4lr"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f4lm"].stateValues.text).eq("sin(-π)");
        expect(stateVariables["/f4ly"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f4rl"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f4rr"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f4rm"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f4ry"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f4ml"].stateValues.text).eq("sin(-π)");
        expect(stateVariables["/f4mr"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f4mm"].stateValues.text).eq("0");
        expect(stateVariables["/f4my"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f4yl"].stateValues.text).eq("sin(-π + 10 y)");
        expect(stateVariables["/f4yr"].stateValues.text).eq("sin(π + 10 y)");
        expect(stateVariables["/f4ym"].stateValues.text).eq("sin(10 y)");
        expect(stateVariables["/f4yy"].stateValues.text).eq("sin(20 y)");
    });

    it("evaluate interpolated at domain boundary", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f1: <function name="f1" domain="(-4, 3)" through="(-4,1) (-3,5) (3,-1)" /></p>
  <p>f2: <function name="f2" domain="(-4, 3]" through="(-4,1) (-3,5) (3,-1)" /></p>
  <p>f3: <function name="f3" domain="[-4, 3]" through="(-4,1) (-3,5) (3,-1)" /></p>
  <p>f4: <function name="f4" domain="[-4, 3)" through="(-4,1) (-3,5) (3,-1)" /></p>

  <p><evaluate function="$f1" input="-4" name="f1l" /></p>
  <p><evaluate function="$f1" input="3" name="f1r" /></p>
  <p><evaluate function="$f1" input="-3" name="f1m" /></p>

  <p><evaluate function="$f2" input="-4" name="f2l" /></p>
  <p><evaluate function="$f2" input="3" name="f2r" /></p>
  <p><evaluate function="$f2" input="-3" name="f2m" /></p>

  <p><evaluate function="$f3" input="-4" name="f3l" /></p>
  <p><evaluate function="$f3" input="3" name="f3r" /></p>
  <p><evaluate function="$f3" input="-3" name="f3m" /></p>

  <p><evaluate function="$f4" input="-4" name="f4l" /></p>
  <p><evaluate function="$f4" input="3" name="f4r" /></p>
  <p><evaluate function="$f4" input="-3" name="f4m" /></p>

  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1l"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1r"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1m"].stateValues.text).eq("5");
        expect(stateVariables["/f2l"].stateValues.text).eq("NaN");
        expect(stateVariables["/f2r"].stateValues.text).eq("-1");
        expect(stateVariables["/f2m"].stateValues.text).eq("5");
        expect(stateVariables["/f3l"].stateValues.text).eq("1");
        expect(stateVariables["/f3r"].stateValues.text).eq("-1");
        expect(stateVariables["/f3m"].stateValues.text).eq("5");
        expect(stateVariables["/f4l"].stateValues.text).eq("1");
        expect(stateVariables["/f4r"].stateValues.text).eq("NaN");
        expect(stateVariables["/f4m"].stateValues.text).eq("5");
    });

    it("evaluate functions based on functions, symbolic", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function name="f" domain="(0,2]">x^2</function></p>
  <p>fa: <function name="fa">$$f(x)</function></p>
  <p>fxp1: <function name="fxp1">$$f(x+1)</function></p>
  <p>fp1: <function name="fp1">$$f(x)+1</function></p>
  <p>fp1a: <function name="fp1a">$$f(x)+<math>1</math></function></p>
  <p>fxp1p1: <function name="fxp1p1">$$f(x+1)+1</function></p>
  <p>fm: <function name="fm"><math>$$f(x)</math></function></p>
  <p>fp1m: <function name="fp1m"><math>$$f(x)+1</math></function></p>

  <p><evaluate function="$f" input="0" name="f0" /></p>
  <p><evaluate function="$f" input="1" name="f1" /></p>
  <p><evaluate function="$f" input="2" name="f2" /></p>
  <p><evaluate function="$f" input="3" name="f3" /></p>

  <p><evaluate function="$fa" input="0" name="fa0" /></p>
  <p><evaluate function="$fa" input="1" name="fa1" /></p>
  <p><evaluate function="$fa" input="2" name="fa2" /></p>
  <p><evaluate function="$fa" input="3" name="fa3" /></p>

  <p><evaluate function="$fxp1" input="0" name="fxp10" /></p>
  <p><evaluate function="$fxp1" input="1" name="fxp11" /></p>
  <p><evaluate function="$fxp1" input="2" name="fxp12" /></p>
  <p><evaluate function="$fxp1" input="3" name="fxp13" /></p>

  <p><evaluate function="$fp1" input="0" name="fp10" /></p>
  <p><evaluate function="$fp1" input="1" name="fp11" /></p>
  <p><evaluate function="$fp1" input="2" name="fp12" /></p>
  <p><evaluate function="$fp1" input="3" name="fp13" /></p>

  <p><evaluate function="$fp1a" input="0" name="fp1a0" /></p>
  <p><evaluate function="$fp1a" input="1" name="fp1a1" /></p>
  <p><evaluate function="$fp1a" input="2" name="fp1a2" /></p>
  <p><evaluate function="$fp1a" input="3" name="fp1a3" /></p>

  <p><evaluate function="$fxp1p1" input="0" name="fxp1p10" /></p>
  <p><evaluate function="$fxp1p1" input="1" name="fxp1p11" /></p>
  <p><evaluate function="$fxp1p1" input="2" name="fxp1p12" /></p>
  <p><evaluate function="$fxp1p1" input="3" name="fxp1p13" /></p>

  <p><evaluate function="$fm" input="0" name="fm0" /></p>
  <p><evaluate function="$fm" input="1" name="fm1" /></p>
  <p><evaluate function="$fm" input="2" name="fm2" /></p>
  <p><evaluate function="$fm" input="3" name="fm3" /></p>

  <p><evaluate function="$fp1m" input="0" name="fp1m0" /></p>
  <p><evaluate function="$fp1m" input="1" name="fp1m1" /></p>
  <p><evaluate function="$fp1m" input="2" name="fp1m2" /></p>
  <p><evaluate function="$fp1m" input="3" name="fp1m3" /></p>


  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f0"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1"].stateValues.text).eq("1");
        expect(stateVariables["/f2"].stateValues.text).eq("4");
        expect(stateVariables["/f3"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/fa0"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/fa1"].stateValues.text).eq("1");
        expect(stateVariables["/fa2"].stateValues.text).eq("4");
        expect(stateVariables["/fa3"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/fxp10"].stateValues.text).eq("1");
        expect(stateVariables["/fxp11"].stateValues.text).eq("4");
        expect(stateVariables["/fxp12"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/fxp13"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/fp10"].stateValues.text).eq("\uff3f + 1");
        expect(stateVariables["/fp11"].stateValues.text).eq("2");
        expect(stateVariables["/fp12"].stateValues.text).eq("5");
        expect(stateVariables["/fp13"].stateValues.text).eq("\uff3f + 1");
        expect(stateVariables["/fp1a0"].stateValues.text).eq("\uff3f + 1");
        expect(stateVariables["/fp1a1"].stateValues.text).eq("2");
        expect(stateVariables["/fp1a2"].stateValues.text).eq("5");
        expect(stateVariables["/fp1a3"].stateValues.text).eq("\uff3f + 1");
        expect(stateVariables["/fxp1p10"].stateValues.text).eq("2");
        expect(stateVariables["/fxp1p11"].stateValues.text).eq("5");
        expect(stateVariables["/fxp1p12"].stateValues.text).eq("\uff3f + 1");
        expect(stateVariables["/fxp1p13"].stateValues.text).eq("\uff3f + 1");
        expect(stateVariables["/fm0"].stateValues.text).eq("0");
        expect(stateVariables["/fm1"].stateValues.text).eq("1");
        expect(stateVariables["/fm2"].stateValues.text).eq("4");
        expect(stateVariables["/fm3"].stateValues.text).eq("9");
        expect(stateVariables["/fp1m0"].stateValues.text).eq("1");
        expect(stateVariables["/fp1m1"].stateValues.text).eq("2");
        expect(stateVariables["/fp1m2"].stateValues.text).eq("5");
        expect(stateVariables["/fp1m3"].stateValues.text).eq("10");
    });

    it("evaluate functions based on functions, numeric", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function symbolic="false" name="f" domain="(0,2]">x^2</function></p>
  <p>fa: <function symbolic="false" name="fa">$$f(x)</function></p>
  <p>fxp1: <function symbolic="false" name="fxp1">$$f(x+1)</function></p>
  <p>fp1: <function symbolic="false" name="fp1">$$f(x)+1</function></p>
  <p>fp1a: <function symbolic="false" name="fp1a">$$f(x)+<math>1</math></function></p>
  <p>fxp1p1: <function symbolic="false" name="fxp1p1">$$f(x+1)+1</function></p>
  <p>fm: <function symbolic="false" name="fm"><math>$$f(x)</math></function></p>
  <p>fp1m: <function symbolic="false" name="fp1m"><math>$$f(x)+1</math></function></p>

  <p><evaluate function="$f" input="0" name="f0" /></p>
  <p><evaluate function="$f" input="1" name="f1" /></p>
  <p><evaluate function="$f" input="2" name="f2" /></p>
  <p><evaluate function="$f" input="3" name="f3" /></p>

  <p><evaluate function="$fa" input="0" name="fa0" /></p>
  <p><evaluate function="$fa" input="1" name="fa1" /></p>
  <p><evaluate function="$fa" input="2" name="fa2" /></p>
  <p><evaluate function="$fa" input="3" name="fa3" /></p>

  <p><evaluate function="$fxp1" input="0" name="fxp10" /></p>
  <p><evaluate function="$fxp1" input="1" name="fxp11" /></p>
  <p><evaluate function="$fxp1" input="2" name="fxp12" /></p>
  <p><evaluate function="$fxp1" input="3" name="fxp13" /></p>

  <p><evaluate function="$fp1" input="0" name="fp10" /></p>
  <p><evaluate function="$fp1" input="1" name="fp11" /></p>
  <p><evaluate function="$fp1" input="2" name="fp12" /></p>
  <p><evaluate function="$fp1" input="3" name="fp13" /></p>

  <p><evaluate function="$fp1a" input="0" name="fp1a0" /></p>
  <p><evaluate function="$fp1a" input="1" name="fp1a1" /></p>
  <p><evaluate function="$fp1a" input="2" name="fp1a2" /></p>
  <p><evaluate function="$fp1a" input="3" name="fp1a3" /></p>

  <p><evaluate function="$fxp1p1" input="0" name="fxp1p10" /></p>
  <p><evaluate function="$fxp1p1" input="1" name="fxp1p11" /></p>
  <p><evaluate function="$fxp1p1" input="2" name="fxp1p12" /></p>
  <p><evaluate function="$fxp1p1" input="3" name="fxp1p13" /></p>

  <p><evaluate function="$fm" input="0" name="fm0" /></p>
  <p><evaluate function="$fm" input="1" name="fm1" /></p>
  <p><evaluate function="$fm" input="2" name="fm2" /></p>
  <p><evaluate function="$fm" input="3" name="fm3" /></p>

  <p><evaluate function="$fp1m" input="0" name="fp1m0" /></p>
  <p><evaluate function="$fp1m" input="1" name="fp1m1" /></p>
  <p><evaluate function="$fp1m" input="2" name="fp1m2" /></p>
  <p><evaluate function="$fp1m" input="3" name="fp1m3" /></p>


  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f0"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1"].stateValues.text).eq("1");
        expect(stateVariables["/f2"].stateValues.text).eq("4");
        expect(stateVariables["/f3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fa0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fa1"].stateValues.text).eq("1");
        expect(stateVariables["/fa2"].stateValues.text).eq("4");
        expect(stateVariables["/fa3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp10"].stateValues.text).eq("1");
        expect(stateVariables["/fxp11"].stateValues.text).eq("4");
        expect(stateVariables["/fxp12"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp13"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp10"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp11"].stateValues.text).eq("2");
        expect(stateVariables["/fp12"].stateValues.text).eq("5");
        expect(stateVariables["/fp13"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1a0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1a1"].stateValues.text).eq("2");
        expect(stateVariables["/fp1a2"].stateValues.text).eq("5");
        expect(stateVariables["/fp1a3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp1p10"].stateValues.text).eq("2");
        expect(stateVariables["/fxp1p11"].stateValues.text).eq("5");
        expect(stateVariables["/fxp1p12"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp1p13"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm1"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm2"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1m0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1m1"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1m2"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1m3"].stateValues.text).eq("NaN");

        // test functions
        let f = stateVariables["/f"].stateValues.fs[0];
        let fa = stateVariables["/fa"].stateValues.fs[0];
        let fxp1 = stateVariables["/fxp1"].stateValues.fs[0];
        let fp1 = stateVariables["/fp1"].stateValues.fs[0];
        let fp1a = stateVariables["/fp1a"].stateValues.fs[0];
        let fxp1p1 = stateVariables["/fxp1p1"].stateValues.fs[0];
        let fm = stateVariables["/fm"].stateValues.fs[0];
        let fp1m = stateVariables["/fp1m"].stateValues.fs[0];

        expect(f(0)).eqls(NaN);
        expect(f(1)).eqls(1);
        expect(f(2)).eqls(4);
        expect(f(3)).eqls(NaN);

        expect(fa(0)).eqls(NaN);
        expect(fa(1)).eqls(1);
        expect(fa(2)).eqls(4);
        expect(fa(3)).eqls(NaN);

        expect(fxp1(0)).eqls(1);
        expect(fxp1(1)).eqls(4);
        expect(fxp1(2)).eqls(NaN);
        expect(fxp1(3)).eqls(NaN);

        expect(fp1(0)).eqls(NaN);
        expect(fp1(1)).eqls(2);
        expect(fp1(2)).eqls(5);
        expect(fp1(3)).eqls(NaN);

        expect(fp1a(0)).eqls(NaN);
        expect(fp1a(1)).eqls(2);
        expect(fp1a(2)).eqls(5);
        expect(fp1a(3)).eqls(NaN);

        expect(fxp1p1(0)).eqls(2);
        expect(fxp1p1(1)).eqls(5);
        expect(fxp1p1(2)).eqls(NaN);
        expect(fxp1p1(3)).eqls(NaN);

        expect(fm(0)).eqls(NaN);
        expect(fm(1)).eqls(NaN);
        expect(fm(2)).eqls(NaN);
        expect(fm(3)).eqls(NaN);

        expect(fp1m(0)).eqls(NaN);
        expect(fp1m(1)).eqls(NaN);
        expect(fp1m(2)).eqls(NaN);
        expect(fp1m(3)).eqls(NaN);
    });

    it("evaluate functions based on functions, numeric then symbolic", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function symbolic="false" name="f" domain="(0,2]">x^2</function></p>
  <p>fa: <function name="fa">$$f(x)</function></p>
  <p>fxp1: <function name="fxp1">$$f(x+1)</function></p>
  <p>fpy: <function name="fpy">$$f(x)+y</function></p>
  <p>fpya: <function name="fpya">$$f(x)+<math>y</math></function></p>
  <p>fxp1py: <function name="fxp1py">$$f(x+1)+y</function></p>
  <p>fm: <function name="fm"><math>$$f(x)</math></function></p>
  <p>fpym: <function name="fpym"><math>$$f(x)+y</math></function></p>

  <p><evaluate function="$f" input="0" name="f0" /></p>
  <p><evaluate function="$f" input="1" name="f1" /></p>
  <p><evaluate function="$f" input="2" name="f2" /></p>
  <p><evaluate function="$f" input="3" name="f3" /></p>

  <p><evaluate function="$fa" input="0" name="fa0" /></p>
  <p><evaluate function="$fa" input="1" name="fa1" /></p>
  <p><evaluate function="$fa" input="2" name="fa2" /></p>
  <p><evaluate function="$fa" input="3" name="fa3" /></p>

  <p><evaluate function="$fxp1" input="0" name="fxp10" /></p>
  <p><evaluate function="$fxp1" input="1" name="fxp11" /></p>
  <p><evaluate function="$fxp1" input="2" name="fxp12" /></p>
  <p><evaluate function="$fxp1" input="3" name="fxp13" /></p>

  <p><evaluate function="$fpy" input="0" name="fpy0" /></p>
  <p><evaluate function="$fpy" input="1" name="fpy1" /></p>
  <p><evaluate function="$fpy" input="2" name="fpy2" /></p>
  <p><evaluate function="$fpy" input="3" name="fpy3" /></p>

  <p><evaluate function="$fpya" input="0" name="fpya0" /></p>
  <p><evaluate function="$fpya" input="1" name="fpya1" /></p>
  <p><evaluate function="$fpya" input="2" name="fpya2" /></p>
  <p><evaluate function="$fpya" input="3" name="fpya3" /></p>

  <p><evaluate function="$fxp1py" input="0" name="fxp1py0" /></p>
  <p><evaluate function="$fxp1py" input="1" name="fxp1py1" /></p>
  <p><evaluate function="$fxp1py" input="2" name="fxp1py2" /></p>
  <p><evaluate function="$fxp1py" input="3" name="fxp1py3" /></p>

  <p><evaluate function="$fm" input="0" name="fm0" /></p>
  <p><evaluate function="$fm" input="1" name="fm1" /></p>
  <p><evaluate function="$fm" input="2" name="fm2" /></p>
  <p><evaluate function="$fm" input="3" name="fm3" /></p>

  <p><evaluate function="$fpym" input="0" name="fpym0" /></p>
  <p><evaluate function="$fpym" input="1" name="fpym1" /></p>
  <p><evaluate function="$fpym" input="2" name="fpym2" /></p>
  <p><evaluate function="$fpym" input="3" name="fpym3" /></p>


  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f0"].stateValues.text).eq("NaN");
        expect(stateVariables["/f1"].stateValues.text).eq("1");
        expect(stateVariables["/f2"].stateValues.text).eq("4");
        expect(stateVariables["/f3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fa0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fa1"].stateValues.text).eq("1");
        expect(stateVariables["/fa2"].stateValues.text).eq("4");
        expect(stateVariables["/fa3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp10"].stateValues.text).eq("1");
        expect(stateVariables["/fxp11"].stateValues.text).eq("4");
        expect(stateVariables["/fxp12"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp13"].stateValues.text).eq("NaN");
        expect(stateVariables["/fpy0"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fpy1"].stateValues.text).eq("y + 1");
        expect(stateVariables["/fpy2"].stateValues.text).eq("y + 4");
        expect(stateVariables["/fpy3"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fpya0"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fpya1"].stateValues.text).eq("y + 1");
        expect(stateVariables["/fpya2"].stateValues.text).eq("y + 4");
        expect(stateVariables["/fpya3"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fxp1py0"].stateValues.text).eq("y + 1");
        expect(stateVariables["/fxp1py1"].stateValues.text).eq("y + 4");
        expect(stateVariables["/fxp1py2"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fxp1py3"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fm0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm1"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm2"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fpym0"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fpym1"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fpym2"].stateValues.text).eq("y + NaN");
        expect(stateVariables["/fpym3"].stateValues.text).eq("y + NaN");
    });

    it("evaluate functions based on functions, symbolic then numeric", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function name="f" domain="(0,2]">x^2</function></p>
  <p>fa: <function symbolic="false" name="fa">$$f(x)</function></p>
  <p>fxp1: <function symbolic="false" name="fxp1">$$f(x+1)</function></p>
  <p>fp1: <function symbolic="false" name="fp1">$$f(x)+1</function></p>
  <p>fp1a: <function symbolic="false" name="fp1a">$$f(x)+<math>1</math></function></p>
  <p>fxp1p1: <function symbolic="false" name="fxp1p1">$$f(x+1)+1</function></p>
  <p>fm: <function symbolic="false" name="fm"><math>$$f(x)</math></function></p>
  <p>fp1m: <function symbolic="false" name="fp1m"><math>$$f(x)+1</math></function></p>

  <p><evaluate function="$f" input="0" name="f0" /></p>
  <p><evaluate function="$f" input="1" name="f1" /></p>
  <p><evaluate function="$f" input="2" name="f2" /></p>
  <p><evaluate function="$f" input="3" name="f3" /></p>

  <p><evaluate function="$fa" input="0" name="fa0" /></p>
  <p><evaluate function="$fa" input="1" name="fa1" /></p>
  <p><evaluate function="$fa" input="2" name="fa2" /></p>
  <p><evaluate function="$fa" input="3" name="fa3" /></p>

  <p><evaluate function="$fxp1" input="0" name="fxp10" /></p>
  <p><evaluate function="$fxp1" input="1" name="fxp11" /></p>
  <p><evaluate function="$fxp1" input="2" name="fxp12" /></p>
  <p><evaluate function="$fxp1" input="3" name="fxp13" /></p>

  <p><evaluate function="$fp1" input="0" name="fp10" /></p>
  <p><evaluate function="$fp1" input="1" name="fp11" /></p>
  <p><evaluate function="$fp1" input="2" name="fp12" /></p>
  <p><evaluate function="$fp1" input="3" name="fp13" /></p>

  <p><evaluate function="$fp1a" input="0" name="fp1a0" /></p>
  <p><evaluate function="$fp1a" input="1" name="fp1a1" /></p>
  <p><evaluate function="$fp1a" input="2" name="fp1a2" /></p>
  <p><evaluate function="$fp1a" input="3" name="fp1a3" /></p>

  <p><evaluate function="$fxp1p1" input="0" name="fxp1p10" /></p>
  <p><evaluate function="$fxp1p1" input="1" name="fxp1p11" /></p>
  <p><evaluate function="$fxp1p1" input="2" name="fxp1p12" /></p>
  <p><evaluate function="$fxp1p1" input="3" name="fxp1p13" /></p>

  <p><evaluate function="$fm" input="0" name="fm0" /></p>
  <p><evaluate function="$fm" input="1" name="fm1" /></p>
  <p><evaluate function="$fm" input="2" name="fm2" /></p>
  <p><evaluate function="$fm" input="3" name="fm3" /></p>

  <p><evaluate function="$fp1m" input="0" name="fp1m0" /></p>
  <p><evaluate function="$fp1m" input="1" name="fp1m1" /></p>
  <p><evaluate function="$fp1m" input="2" name="fp1m2" /></p>
  <p><evaluate function="$fp1m" input="3" name="fp1m3" /></p>


  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f0"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/f1"].stateValues.text).eq("1");
        expect(stateVariables["/f2"].stateValues.text).eq("4");
        expect(stateVariables["/f3"].stateValues.text).eq("\uff3f");
        expect(stateVariables["/fa0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fa1"].stateValues.text).eq("1");
        expect(stateVariables["/fa2"].stateValues.text).eq("4");
        expect(stateVariables["/fa3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp10"].stateValues.text).eq("1");
        expect(stateVariables["/fxp11"].stateValues.text).eq("4");
        expect(stateVariables["/fxp12"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp13"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp10"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp11"].stateValues.text).eq("2");
        expect(stateVariables["/fp12"].stateValues.text).eq("5");
        expect(stateVariables["/fp13"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1a0"].stateValues.text).eq("NaN");
        expect(stateVariables["/fp1a1"].stateValues.text).eq("2");
        expect(stateVariables["/fp1a2"].stateValues.text).eq("5");
        expect(stateVariables["/fp1a3"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp1p10"].stateValues.text).eq("2");
        expect(stateVariables["/fxp1p11"].stateValues.text).eq("5");
        expect(stateVariables["/fxp1p12"].stateValues.text).eq("NaN");
        expect(stateVariables["/fxp1p13"].stateValues.text).eq("NaN");
        expect(stateVariables["/fm0"].stateValues.text).eq("0");
        expect(stateVariables["/fm1"].stateValues.text).eq("1");
        expect(stateVariables["/fm2"].stateValues.text).eq("4");
        expect(stateVariables["/fm3"].stateValues.text).eq("9");
        expect(stateVariables["/fp1m0"].stateValues.text).eq("1");
        expect(stateVariables["/fp1m1"].stateValues.text).eq("2");
        expect(stateVariables["/fp1m2"].stateValues.text).eq("5");
        expect(stateVariables["/fp1m3"].stateValues.text).eq("10");

        // test functions
        let f = stateVariables["/f"].stateValues.fs[0];
        let fa = stateVariables["/fa"].stateValues.fs[0];
        let fxp1 = stateVariables["/fxp1"].stateValues.fs[0];
        let fp1 = stateVariables["/fp1"].stateValues.fs[0];
        let fp1a = stateVariables["/fp1a"].stateValues.fs[0];
        let fxp1p1 = stateVariables["/fxp1p1"].stateValues.fs[0];
        let fm = stateVariables["/fm"].stateValues.fs[0];
        let fp1m = stateVariables["/fp1m"].stateValues.fs[0];

        // Note: function from definition is numeric for all but f itself
        expect(f(me.fromAst(0)).tree).eqls("\uff3f");
        expect(f(me.fromAst(1)).tree).eqls(1);
        expect(f(me.fromAst(2)).tree).eqls(4);
        expect(f(me.fromAst(3)).tree).eqls("\uff3f");

        expect(fa(0)).eqls(NaN);
        expect(fa(1)).eqls(1);
        expect(fa(2)).eqls(4);
        expect(fa(3)).eqls(NaN);

        expect(fxp1(0)).eqls(1);
        expect(fxp1(1)).eqls(4);
        expect(fxp1(2)).eqls(NaN);
        expect(fxp1(3)).eqls(NaN);

        expect(fp1(0)).eqls(NaN);
        expect(fp1(1)).eqls(2);
        expect(fp1(2)).eqls(5);
        expect(fp1(3)).eqls(NaN);

        expect(fp1a(0)).eqls(NaN);
        expect(fp1a(1)).eqls(2);
        expect(fp1a(2)).eqls(5);
        expect(fp1a(3)).eqls(NaN);

        expect(fxp1p1(0)).eqls(2);
        expect(fxp1p1(1)).eqls(5);
        expect(fxp1p1(2)).eqls(NaN);
        expect(fxp1p1(3)).eqls(NaN);

        expect(fm(0)).eqls(0);
        expect(fm(1)).eqls(1);
        expect(fm(2)).eqls(4);
        expect(fm(3)).eqls(9);

        expect(fp1m(0)).eqls(1);
        expect(fp1m(1)).eqls(2);
        expect(fp1m(2)).eqls(5);
        expect(fp1m(3)).eqls(10);
    });

    it("an evaluate copied into a function can be reevaluated", async () => {
        let core = await createTestCore({
            doenetML: `
  <function symbolic="false" name="f">2x</function>
  <evaluate function="$f" input="x" name="fx" />
  <function symbolic="false" name="g">$$f(x)</function>
  <function symbolic="false" name="ga">$fx</function>
  <function symbolic="false" name="h">$$f(x)+1</function>
  <function symbolic="false" name="ha">$fx+1</function>
  <p name="pg">$$g(2)</p>
  <p name="pga">$$ga(2)</p>
  <p name="ph">$$h(2)</p>
  <p name="pha">$$ha(2)</p>
  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/f"].stateValues.latex)).eq("2x");
        expect(cleanLatex(stateVariables["/fx"].stateValues.latex)).eq("NaN");
        expect(cleanLatex(stateVariables["/g"].stateValues.latex)).eq("\uff3f");
        expect(cleanLatex(stateVariables["/ga"].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(cleanLatex(stateVariables["/h"].stateValues.latex)).eq("\uff3f");
        expect(cleanLatex(stateVariables["/ha"].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(stateVariables["/pg"].stateValues.text).eq("4");
        expect(stateVariables["/pga"].stateValues.text).eq("4");
        expect(stateVariables["/ph"].stateValues.text).eq("5");
        expect(stateVariables["/pha"].stateValues.text).eq("5");
    });

    it("evaluate functions based on interpolated function", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>f: <function maxima="(5,4)" name="f">x^2</function></p>
  <p>fa: <function name="fa">$$f(x)</function></p>
  <p>fxp1: <function name="fxp1">$$f(x+1)</function></p>
  <p>fp1: <function name="fp1">$$f(x)+1</function></p>
  <p>fp1a: <function name="fp1a">$$f(x)+<math>1</math></function></p>
  <p>fxp1p1: <function name="fxp1p1">$$f(x+1)+1</function></p>

  <p><evaluate function="$f" input="3" name="f0" /></p>
  <p><evaluate function="$f" input="4" name="f1" /></p>
  <p><evaluate function="$f" input="5" name="f2" /></p>
  <p><evaluate function="$f" input="6" name="f3" /></p>

  <p><evaluate function="$fa" input="3" name="fa0" /></p>
  <p><evaluate function="$fa" input="4" name="fa1" /></p>
  <p><evaluate function="$fa" input="5" name="fa2" /></p>
  <p><evaluate function="$fa" input="6" name="fa3" /></p>

  <p><evaluate function="$fxp1" input="3" name="fxp10" /></p>
  <p><evaluate function="$fxp1" input="4" name="fxp11" /></p>
  <p><evaluate function="$fxp1" input="5" name="fxp12" /></p>
  <p><evaluate function="$fxp1" input="6" name="fxp13" /></p>

  <p><evaluate function="$fp1" input="3" name="fp10" /></p>
  <p><evaluate function="$fp1" input="4" name="fp11" /></p>
  <p><evaluate function="$fp1" input="5" name="fp12" /></p>
  <p><evaluate function="$fp1" input="6" name="fp13" /></p>

  <p><evaluate function="$fp1a" input="3" name="fp1a0" /></p>
  <p><evaluate function="$fp1a" input="4" name="fp1a1" /></p>
  <p><evaluate function="$fp1a" input="5" name="fp1a2" /></p>
  <p><evaluate function="$fp1a" input="6" name="fp1a3" /></p>

  <p><evaluate function="$fxp1p1" input="3" name="fxp1p10" /></p>
  <p><evaluate function="$fxp1p1" input="4" name="fxp1p11" /></p>
  <p><evaluate function="$fxp1p1" input="5" name="fxp1p12" /></p>
  <p><evaluate function="$fxp1p1" input="6" name="fxp1p13" /></p>


  `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f0"].stateValues.text).eq("0");
        expect(stateVariables["/f1"].stateValues.text).eq("3");
        expect(stateVariables["/f2"].stateValues.text).eq("4");
        expect(stateVariables["/f3"].stateValues.text).eq("3");
        expect(stateVariables["/fa0"].stateValues.text).eq("0");
        expect(stateVariables["/fa1"].stateValues.text).eq("3");
        expect(stateVariables["/fa2"].stateValues.text).eq("4");
        expect(stateVariables["/fa3"].stateValues.text).eq("3");
        expect(stateVariables["/fxp10"].stateValues.text).eq("3");
        expect(stateVariables["/fxp11"].stateValues.text).eq("4");
        expect(stateVariables["/fxp12"].stateValues.text).eq("3");
        expect(stateVariables["/fxp13"].stateValues.text).eq("0");
        expect(stateVariables["/fp10"].stateValues.text).eq("1");
        expect(stateVariables["/fp11"].stateValues.text).eq("4");
        expect(stateVariables["/fp12"].stateValues.text).eq("5");
        expect(stateVariables["/fp13"].stateValues.text).eq("4");
        expect(stateVariables["/fp1a0"].stateValues.text).eq("1");
        expect(stateVariables["/fp1a1"].stateValues.text).eq("4");
        expect(stateVariables["/fp1a2"].stateValues.text).eq("5");
        expect(stateVariables["/fp1a3"].stateValues.text).eq("4");
        expect(stateVariables["/fxp1p10"].stateValues.text).eq("4");
        expect(stateVariables["/fxp1p11"].stateValues.text).eq("5");
        expect(stateVariables["/fxp1p12"].stateValues.text).eq("4");
        expect(stateVariables["/fxp1p13"].stateValues.text).eq("1");

        // test functions
        let f = stateVariables["/f"].stateValues.fs[0];
        let fa = stateVariables["/fa"].stateValues.fs[0];
        let fxp1 = stateVariables["/fxp1"].stateValues.fs[0];
        let fp1 = stateVariables["/fp1"].stateValues.fs[0];
        let fp1a = stateVariables["/fp1a"].stateValues.fs[0];
        let fxp1p1 = stateVariables["/fxp1p1"].stateValues.fs[0];

        expect(f(me.fromAst(3)).tree).eqls(0);
        expect(f(me.fromAst(4)).tree).eqls(3);
        expect(f(me.fromAst(5)).tree).eqls(4);
        expect(f(me.fromAst(6)).tree).eqls(3);

        expect(fa(me.fromAst(3)).tree).eqls(0);
        expect(fa(me.fromAst(4)).tree).eqls(3);
        expect(fa(me.fromAst(5)).tree).eqls(4);
        expect(fa(me.fromAst(6)).tree).eqls(3);

        expect(fxp1(me.fromAst(3)).tree).eqls(3);
        expect(fxp1(me.fromAst(4)).tree).eqls(4);
        expect(fxp1(me.fromAst(5)).tree).eqls(3);
        expect(fxp1(me.fromAst(6)).tree).eqls(0);

        expect(fp1(me.fromAst(3)).tree).eqls(1);
        expect(fp1(me.fromAst(4)).tree).eqls(4);
        expect(fp1(me.fromAst(5)).tree).eqls(5);
        expect(fp1(me.fromAst(6)).tree).eqls(4);

        expect(fp1a(me.fromAst(3)).tree).eqls(1);
        expect(fp1a(me.fromAst(4)).tree).eqls(4);
        expect(fp1a(me.fromAst(5)).tree).eqls(5);
        expect(fp1a(me.fromAst(6)).tree).eqls(4);

        expect(fxp1p1(me.fromAst(3)).tree).eqls(4);
        expect(fxp1p1(me.fromAst(4)).tree).eqls(5);
        expect(fxp1p1(me.fromAst(5)).tree).eqls(4);
        expect(fxp1p1(me.fromAst(6)).tree).eqls(1);
    });
});
