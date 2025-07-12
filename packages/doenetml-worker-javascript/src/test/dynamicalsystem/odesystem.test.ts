import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { createFunctionFromDefinition } from "@doenet/utils";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("odeSystem Tag Tests", async () => {
    it("1D linear system", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p>a = <mathInput name="a" prefill="1"/></p>
<p>initial condition = <mathInput name="ic" prefill="1"/></p>
<p>tol = <mathInput name="tol" parseScientificNotation prefill="1E-6"/></p>

<odeSystem name="ode" tolerance="$tol" initialConditions="$ic">
    <rightHandSide simplify="full">$a x</rightHandSide>
</odeSystem>

<graph xmin="-1">
    <function extend="$ode.numericalSolution" name="f" />
    <point name="point1" x='$zeroFixed' y='$ic' />
</graph>

<p><repeatForSequence from="0" to="5" step="0.5" name="repeat1" valueName="v">
  <evaluate function="$f" input="$v" />
</repeatForSequence></asList></p>

<number fixed hide name="zeroFixed">0</number>
<math extend="$tol.value" name="tol2" />
    `,
        });

        let ic = 1;
        let a = 1;
        let tol = 1e-6;
        let expectedF = (x) => ic * Math.exp(a * x);

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("tol2")].stateValues
                    .value.tree,
            ).eqls(tol);
            expect(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .latex,
            ).eqls(
                `\\frac{dx}{dt} &=  ${a === 1 ? "" : a + " "}x\\notag\\\\x(0) &= ${ic}\\notag`,
            );
            let solutionF = createFunctionFromDefinition(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .numericalSolutionFDefinitions[0],
            );

            let solutionsFromCore = stateVariables[
                await resolvePathToNodeIdx("repeat1")
            ]
                .replacements!.map(
                    (child) =>
                        stateVariables[child.componentIdx].replacements![0],
                )
                .map(
                    (grandChild) =>
                        stateVariables[grandChild.componentIdx].stateValues
                            .value,
                )
                .map((v) => v.tree);

            for (let x = 0; x <= 5; x += 0.5) {
                expect(solutionF(x)).closeTo(
                    expectedF(x),
                    tol * Math.max(1, Math.abs(expectedF(x))),
                );
                expect(solutionsFromCore[2 * x]).eq(solutionF(x));
            }
        }

        await check_items();

        // Change initial condition
        ic = 3;
        expectedF = (x) => ic * Math.exp(a * x);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("ic"),
            latex: "3",
            core,
        });
        await check_items();

        // Change parameter
        a = -2;
        expectedF = (x) => ic * Math.exp(a * x);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            latex: "-2",
            core,
        });
        await check_items();

        // Change ic with point
        ic = -5;
        expectedF = (x) => ic * Math.exp(a * x);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: 0,
            y: ic,
            core,
        });
        await check_items();

        // Change tolerance
        tol = 1e-10;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("tol"),
            latex: "1E-10",
            core,
        });

        // Change parameter again
        a = 0.5;
        expectedF = (x) => ic * Math.exp(a * x);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            latex: "0.5",
            core,
        });
        await check_items();

        // Change initial condition to zero
        ic = 0;
        expectedF = (x) => 0;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("ic"),
            latex: "0",
            core,
        });
        await check_items();
    });

    it("effect of max iterations, chunksize", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>tol = <mathInput name="tol" parseScientificNotation prefill="1E-6"/></p>
  <p>T = <mathInput name="T" prefill="10"/></p>
  <p>maxIter = <mathInput name="maxIter" prefill="1000"/></p>
  <p>chunkSize = <mathInput name="chunkSize" prefill="10"/></p>
  <odeSystem name="ode" initialConditions="1" maxIterations="$maxIter" tolerance="$tol" chunksize="$chunkSize">
    <rightHandSide>x</rightHandSide>
  </odeSystem>

  <p><m name="m1">f($T) = $$(ode.numericalSolution)($T)</m></p>
  `,
        });

        let tol = 1e-6;
        let T = 10;
        let maxIter = 1000;
        let chunkSize = 10;

        async function check_items({
            solverSuccess,
        }: {
            solverSuccess: boolean;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("T")].stateValues
                    .value.tree,
            ).eqls(T);
            expect(
                stateVariables[await resolvePathToNodeIdx("tol")].stateValues
                    .value.tree,
            ).eqls(tol);
            expect(
                stateVariables[await resolvePathToNodeIdx("maxIter")]
                    .stateValues.value.tree,
            ).eqls(maxIter);
            expect(
                stateVariables[await resolvePathToNodeIdx("chunkSize")]
                    .stateValues.value.tree,
            ).eqls(chunkSize);

            let solutionF = createFunctionFromDefinition(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .numericalSolutionFDefinitions[0],
            );
            let f_T_copied = Number(
                stateVariables[
                    await resolvePathToNodeIdx("m1")
                ].stateValues.text.split("=")[1],
            );

            if (!solverSuccess) {
                // Ensure numerical solution at t=T is NaN
                expect(solutionF(T)).eqls(NaN);
                expect(f_T_copied).eqls(NaN);
            } else {
                // Ensure numerical solution for range [0,T] follows expected solution
                const expectedF = (x) => Math.exp(x);
                for (let x = 0; x <= T; x += 1) {
                    expect(solutionF(x)).closeTo(
                        expectedF(x),
                        tol * Math.max(1, Math.abs(expectedF(x))),
                    );
                }
                expect(f_T_copied).closeTo(
                    expectedF(T),
                    tol * Math.max(1, Math.abs(expectedF(T))),
                );
            }
        }

        await check_items({ solverSuccess: true });

        // Solver algorithm runs past max iterations before it can
        // solve f(20) within required threshold
        T = 20;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("T"),
            latex: `${T}`,
            core,
        });
        await check_items({ solverSuccess: false });

        // increase max iterations, now f(20) works
        maxIter = 2000;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("maxIter"),
            latex: `${maxIter}`,
            core,
        });
        await check_items({ solverSuccess: true });

        // Can't make it if decrease tolerance
        tol = 1e-8;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("tol"),
            latex: `1E-8`,
            core,
        });
        await check_items({ solverSuccess: false });

        // increase max iterations further
        maxIter = 5000;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("maxIter"),
            latex: `${maxIter}`,
            core,
        });
        await check_items({ solverSuccess: true });

        // decrease max iterations back down to original, fails
        maxIter = 1000;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("maxIter"),
            latex: `${maxIter}`,
            core,
        });
        await check_items({ solverSuccess: false });

        // decrease chunksize
        chunkSize = 1;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("chunkSize"),
            latex: `${chunkSize}`,
            core,
        });
        await check_items({ solverSuccess: true });
    });

    it("change variables 1D", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p>independent variable = <mathInput name="iVar" prefill="t"/></p>
<p>dependent variable = <mathInput name="dVar" prefill="x"/></p>
  
<odeSystem name="ode" initialConditions="1" independentVariable="$iVar" variables="$dVar">
    <rightHandSide>$dVar</rightHandSide>
</odeSystem>

<graph>
    <function extend="$ode.numericalSolution" name="f" />
</graph>

<p><repeatForSequence from="0" to="5" name="repeat1" valueName="v">
  <evaluate function="$f" input="$v" />
</repeatForSequence></p>

  `,
        });

        let tol = 1e-6;
        let iVar = "t";
        let dVar = "x";
        let expectedF = (x) => Math.exp(x);

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .latex,
            ).eqls(
                `\\frac{d${dVar}}{d${iVar}} &=  ${dVar}\\notag\\\\${dVar}(0) &= 1\\notag`,
            );
            let solutionF = createFunctionFromDefinition(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .numericalSolutionFDefinitions[0],
            );
            let solutionsFromCore = stateVariables[
                await resolvePathToNodeIdx("repeat1")
            ].replacements!.map(
                (x) =>
                    stateVariables[
                        stateVariables[x.componentIdx].replacements![0]
                            .componentIdx
                    ].stateValues.value.tree,
            );

            for (let t = 0; t <= 5; t += 1) {
                if (Number.isNaN(expectedF(t))) {
                    expect(solutionF(t)).toBeNaN();
                    expect(solutionsFromCore[t]).toBeNaN();
                } else {
                    expect(solutionF(t)).closeTo(
                        expectedF(t),
                        tol * Math.max(1, Math.abs(expectedF(t))),
                    );
                    expect(solutionsFromCore[t]).eq(solutionF(t));
                }
            }
        }

        await check_items();

        // change independent variable
        iVar = "s";
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("iVar"),
            latex: iVar,
            core,
        });
        await check_items();

        // erase independent variable
        iVar = "＿";
        expectedF = (x) => (x === 0 ? 1 : NaN);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("iVar"),
            latex: "",
            core,
        });
        await check_items();

        // restore independent variable
        iVar = "u";
        expectedF = (x) => Math.exp(x);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("iVar"),
            latex: iVar,
            core,
        });
        await check_items();

        // invalid independent variable
        iVar = "1";
        expectedF = (x) => (x === 0 ? 1 : NaN);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("iVar"),
            latex: iVar,
            core,
        });
        await check_items();

        // restore independent variable
        iVar = "v";
        expectedF = (x) => Math.exp(x);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("iVar"),
            latex: iVar,
            core,
        });
        await check_items();

        // change dependent variable
        dVar = "z";
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("dVar"),
            latex: dVar,
            core,
        });
        await check_items();

        // duplicate variable
        dVar = iVar;
        expectedF = (x) => (x === 0 ? 1 : NaN);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("dVar"),
            latex: dVar,
            core,
        });
        await check_items();

        // different dependent variable
        dVar = "v_{1}";
        expectedF = (x) => Math.exp(x);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("dVar"),
            latex: "v_1",
            core,
        });
        await check_items();

        // invalid dependent variable
        dVar = "a b";
        expectedF = (x) => (x === 0 ? 1 : NaN);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("dVar"),
            latex: "ab",
            core,
        });
        await check_items();

        // restore dependent variable
        dVar = "a";
        expectedF = (x) => Math.exp(x);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("dVar"),
            latex: dVar,
            core,
        });
        await check_items();
    });

    it("display digits", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p>display digits = <mathInput name="digits" prefill="10"/></p>
<odeSystem name="ode" displayDigits="$digits" initialConditions="9.87654321987654321">
    <rightHandSide>0.123456789123456789x</rightHandSide>
</odeSystem>
`,
        });

        let a = "0.1234567891";
        let ic = "9.87654322";

        async function check_items({ a, ic }: { a: string; ic: string }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .latex,
            ).eqls(`\\frac{dx}{dt} &=  ${a} x\\notag\\\\x(0) &= ${ic}\\notag`);
        }
        await check_items({ a, ic });

        // 2 display digits
        a = "0.12";
        ic = "9.9";
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("digits"),
            latex: "2",
            core,
        });
        await check_items({ a, ic });

        // 14 display digits
        a = "0.12345678912346";
        ic = "9.8765432198765";
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("digits"),
            latex: "14",
            core,
        });
        await check_items({ a, ic });
    });

    it("initial independent variable value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>initial t = <mathInput name="t0" prefill="0"/></p>
  <p>final t = <mathInput name="tf" prefill="10"/></p>
  
  <odeSystem name="ode" initialConditions="1" initialIndependentVariableValue="$t0" displayDigits="10">
    <rightHandSide>x</rightHandSide>
  </odeSystem>

  <p>We started with 
  <m name="m1">x($ode.initialIndependentVariableValue) = 1</m>.</p>

  <p>We end with
  <m name="m2">x($tf) = $$(ode.numericalSolution)($tf)</m></p>
`,
        });

        let t0 = 0;
        let tf = 10;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .latex,
            ).eqls(`\\frac{dx}{dt} &=  x\\notag\\\\x(${t0}) &= 1\\notag`);

            expect(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .initialIndependentVariableValue.tree,
            ).eqls(t0);

            let startPieces = stateVariables[
                await resolvePathToNodeIdx("m1")
            ].stateValues.latex
                .split("=")
                .map((v) => v.trim());
            expect(startPieces.length).eqls(2);
            expect(startPieces[0]).eqls(`x( ${t0} )`);

            let finalPieces = stateVariables[
                await resolvePathToNodeIdx("m2")
            ].stateValues.latex
                .split("=")
                .map((v) => v.trim());
            expect(finalPieces.length).eqls(2);
            expect(finalPieces[0]).eqls(`x( ${tf} )`);
            expect(Number(finalPieces[1])).closeTo(
                Math.exp(tf - t0),
                1e-6 * Math.exp(tf - t0),
            );
        }

        await check_items();

        // Change initial time
        t0 = -5;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("t0"),
            latex: `${t0}`,
            core,
        });
        await check_items();

        // Change initial and final time
        t0 = 11;
        tf = 12;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("t0"),
            latex: `${t0}`,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("tf"),
            latex: `${tf}`,
            core,
        });
        await check_items();
    });

    it("display initial conditions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>display initial conditions: <booleanInput name="showic" prefill="true"/></p>  
  <odeSystem name="ode" initialconditions="1" hideInitialCondition="!$showic">
    <rightHandSide>x</rightHandSide>
  </odeSystem>
`,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ode")].stateValues.latex,
        ).eqls(`\\frac{dx}{dt} &=  x\\notag\\\\x(0) &= 1\\notag`);

        // don't display initial conditions
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("showic"),
            boolean: false,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ode")].stateValues.latex,
        ).eqls(`\\frac{dx}{dt} &=  x\\notag`);

        // display initial conditions again
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("showic"),
            boolean: true,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ode")].stateValues.latex,
        ).eqls(`\\frac{dx}{dt} &=  x\\notag\\\\x(0) &= 1\\notag`);
    });

    it("2D linear system", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>initial condition 1 = <mathInput name="ic1" prefill="1"/></p>
  <p>initial condition 2 = <mathInput name="ic2" prefill="3"/></p>
  <odeSystem name="ode" initialconditions="$ic1 $ic2">
    <rightHandSide>-0.2y</rightHandSide>
    <rightHandSide>0.1x + 0.3y</rightHandSide>
  </odeSystem>

  <graph>
    <curve parmin="0" parmax="10">
      <function extend="$ode.numericalSolutions[1]" name="f1" />
      <function extend="$ode.numericalSolutions[2]" name="f2" />
    </curve>
    <point name="point1" x="$ic1" y="$ic2" />
  </graph>

  <p><repeatForSequence name="repeat1" from="0" to="10" valueName="v">
    <evaluate function="$f1" input="$v" /><evaluate function="$f2" input="$v" />
  </repeatForSequence></p>
`,
        });

        let tol = 1e-6;
        let ic1 = 1;
        let ic2 = 3;
        let expectedFx = (t) => 8 * Math.exp(0.1 * t) - 7 * Math.exp(0.2 * t);
        let expectedFy = (t) => -4 * Math.exp(0.1 * t) + 7 * Math.exp(0.2 * t);

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let ode = stateVariables[await resolvePathToNodeIdx("ode")];
            expect(ode.stateValues.latex).eqls(
                `\\frac{dx}{dt} &=  -0.2 y\\notag\\\\\\frac{dy}{dt} &=  0.1 x + 0.3 y\\notag\\\\x(0) &= ${ic1}\\notag\\\\y(0) &= ${ic2}\\notag`,
            );

            let solutionFx = createFunctionFromDefinition(
                ode.stateValues.numericalSolutionFDefinitions[0],
            );
            let solutionFy = createFunctionFromDefinition(
                ode.stateValues.numericalSolutionFDefinitions[1],
            );
            let solutionFx2 = createFunctionFromDefinition(
                stateVariables[await resolvePathToNodeIdx("f1")].stateValues
                    .fDefinitions[0],
            );
            let solutionFy2 = createFunctionFromDefinition(
                stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                    .fDefinitions[0],
            );
            let solutionsFromCoreX = stateVariables[
                await resolvePathToNodeIdx("repeat1")
            ]
                .replacements!.map(
                    (child) =>
                        stateVariables[child.componentIdx].replacements![0],
                )
                .map(
                    (grandChild) =>
                        stateVariables[grandChild.componentIdx].stateValues
                            .value,
                )
                .map((v) => v.tree);
            let solutionsFromCoreY = stateVariables[
                await resolvePathToNodeIdx("repeat1")
            ]
                .replacements!.map(
                    (child) =>
                        stateVariables[child.componentIdx].replacements![1],
                )
                .map(
                    (grandChild) =>
                        stateVariables[grandChild.componentIdx].stateValues
                            .value,
                )
                .map((v) => v.tree);

            for (let t = 0; t <= 10; t += 1) {
                expect(solutionFx(t)).closeTo(
                    expectedFx(t),
                    tol * Math.max(1, Math.abs(expectedFx(t))),
                );
                expect(solutionFy(t)).closeTo(
                    expectedFy(t),
                    tol * Math.max(1, Math.abs(expectedFy(t))),
                );
                expect(solutionFx2(t)).eq(solutionFx(t));
                expect(solutionFy2(t)).eq(solutionFy(t));
                expect(solutionsFromCoreX[t]).eq(solutionFx(t));
                expect(solutionsFromCoreY[t]).eq(solutionFy(t));
            }
        }

        await check_items();

        // Change initial condition
        ic1 = 3;
        ic2 = -1;
        expectedFx = (t) => 4 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
        expectedFy = (t) => -2 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("ic1"),
            latex: `${ic1}`,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("ic2"),
            latex: `${ic2}`,
            core,
        });
        await check_items();

        // Change ic with point
        ic1 = -5;
        ic2 = 2;
        expectedFx = (t) => -6 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
        expectedFy = (t) => 3 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: ic1,
            y: ic2,
            core,
        });
        await check_items();

        // Change initial condition to zero
        ic1 = 0;
        ic2 = 0;
        expectedFx = (t) => 0;
        expectedFy = (t) => 0;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("ic1"),
            latex: `${ic1}`,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("ic2"),
            latex: `${ic2}`,
            core,
        });
        await check_items();
    });

    it("higher dimensional ode", async () => {
        const rightHandSides = ["q", "r", "s", "u", "v", "w"];
        const initialConditions = ["a", "b", "c", "d", "e", "f"];

        async function check_ode_latex({
            doenetML,
            varNames,
        }: {
            doenetML: string;
            varNames: string[];
        }) {
            let odeLatex = "";
            for (let i = 0; i < varNames.length; i++) {
                odeLatex += `\\frac{d${varNames[i]}}{dt} &=  ${rightHandSides[i]}\\notag\\\\`;
            }
            for (let i = 0; i < varNames.length; i++) {
                odeLatex += `${varNames[i]}(0) &= ${initialConditions[i]}\\notag\\\\`;
            }
            odeLatex = odeLatex.substring(0, odeLatex.length - 2); // remove ending "\\"

            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                    .latex,
            ).eqls(odeLatex);
        }

        // No variables specified
        let doenetML = `
<odeSystem name="ode" initialconditions="a b c d e f">
<rightHandSide>q</rightHandSide>
<rightHandSide>r</rightHandSide>
<rightHandSide>s</rightHandSide>
<rightHandSide>u</rightHandSide>
<rightHandSide>v</rightHandSide>
<rightHandSide>w</rightHandSide>
</odeSystem>
        `;
        let varNames = ["x_{1}", "x_{2}", "x_{3}", "x_{4}", "x_{5}", "x_{6}"];
        await check_ode_latex({ doenetML, varNames });

        // all variables specified
        doenetML = `
<odeSystem name="ode" initialconditions="a b c d e f" variables="j k l m n p">
<rightHandSide>q</rightHandSide>
<rightHandSide>r</rightHandSide>
<rightHandSide>s</rightHandSide>
<rightHandSide>u</rightHandSide>
<rightHandSide>v</rightHandSide>
<rightHandSide>w</rightHandSide>
</odeSystem>        
        `;
        varNames = ["j", "k", "l", "m", "n", "p"];
        await check_ode_latex({ doenetML, varNames });

        // some variables specified
        doenetML = `
<odeSystem name="ode" initialconditions="a b c d e f" variables="j k l">
<rightHandSide>q</rightHandSide>
<rightHandSide>r</rightHandSide>
<rightHandSide>s</rightHandSide>
<rightHandSide>u</rightHandSide>
<rightHandSide>v</rightHandSide>
<rightHandSide>w</rightHandSide>
</odeSystem>     
        `;
        varNames = ["j", "k", "l", "x_{4}", "x_{5}", "x_{6}"];
        await check_ode_latex({ doenetML, varNames });
    });

    it("copy rightHandSide, initial conditions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <odeSystem name="ode" initialconditions="c 3">
  <rightHandSide>a*x*y+z</rightHandSide>
  <rightHandSide>x/y</rightHandSide>
  </odeSystem>

  <p>RHS1: <math extend="$ode.rhs1" name="rhs1a" /></p>
  <p>RHS2: <math extend="$ode.rhs2" name="rhs2a" /></p>
  <p>RHS1: <math extend="$ode.rhs" name="rhs1b" /></p>
  <p>Both RHSs: <asList><mathList extend="$ode.rhss" name="rhssa" /></asList></p>

  <p>RHS1: <math extend="$ode.rightHandSide1" name="rhs1c" /></p>
  <p>RHS2: <math extend="$ode.rightHandSide2" name="rhs2b" /></p>
  <p>RHS1: <math extend="$ode.rightHandSide" name="rhs1d" /></p>
  <p>Both RHSs: <asList><mathList extend="$ode.rightHandSides" name="rhssb" /></asList></p>
  
  <p>IC1: <math extend="$ode.initialcondition1" name="ic1a" /></p>
  <p>IC2: <math extend="$ode.initialcondition2" name="ic2a" /></p>
  <p>IC1: <math extend="$ode.initialcondition" name="ic1b" /></p>
  <p>Both ICs: <asList><mathList extend="$ode.initialconditions" name="icsa" /></asList></p>

  <p>Swap right hand sides and keep initial conditions</p>

  <odeSystem name="odeswap" initialconditions="$(ode.initialconditions)">
    <rightHandSide>$ode.rhs2</rightHandSide>
    <rightHandSide>$ode.rhs1</rightHandSide>
  </odeSystem>
`,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let rhs1tree = ["+", ["*", "a", "x", "y"], "z"];
        let rhs2tree = ["/", "x", "y"];

        async function expectValue(origName: string, desiredValue: any) {
            expect(
                stateVariables[await resolvePathToNodeIdx(origName)].stateValues
                    .value.tree,
            ).eqls(desiredValue);
        }

        await expectValue("rhs1a", rhs1tree);
        await expectValue("rhs2a", rhs2tree);
        await expectValue("rhs1b", rhs1tree);
        await expectValue("rhssa[1]", rhs1tree);
        await expectValue("rhssa[2]", rhs2tree);

        await expectValue("rhs1c", rhs1tree);
        await expectValue("rhs2b", rhs2tree);
        await expectValue("rhs1d", rhs1tree);
        await expectValue("rhssb[1]", rhs1tree);
        await expectValue("rhssb[2]", rhs2tree);

        await expectValue("ic1a", "c");
        await expectValue("ic2a", 3);
        await expectValue("ic1b", "c");
        await expectValue("icsa[1]", "c");
        await expectValue("icsa[2]", 3);

        let swapLatex = "";
        swapLatex += "\\frac{dx}{dt} &=  \\frac{x}{y}\\notag\\\\";
        swapLatex += "\\frac{dy}{dt} &=  a x y + z\\notag\\\\";
        swapLatex += "x(0) &= c\\notag\\\\";
        swapLatex += "y(0) &= 3\\notag";
        expect(
            stateVariables[await resolvePathToNodeIdx("odeswap")].stateValues
                .latex,
        ).eqls(swapLatex);
    });

    it("warnings", async () => {
        let { core } = await createTestCore({
            doenetML: `
<text>a</text>
<odeSystem variables="y" independentVariable="y">
  <rightHandSide>5y</rightHandSide>
</odeSystem>

<odeSystem variables="y" independentVariable="sin(x)">
  <rightHandSide>5y</rightHandSide>
</odeSystem>

<odeSystem variables="sin(y)" independentVariable="t">
  <rightHandSide>5y</rightHandSide>
</odeSystem>

<odeSystem variables="x x" independentVariable="t">
  <rightHandSide>5x</rightHandSide>
  <rightHandSide>3x</rightHandSide>
</odeSystem>
`,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(4);

        expect(errorWarnings.warnings[0].message).contain(
            `Invalid value of a variable: sin(x)`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(7);
        expect(errorWarnings.warnings[0].position.start.column).eq(26);
        expect(errorWarnings.warnings[0].position.end.line).eq(7);
        expect(errorWarnings.warnings[0].position.end.column).eq(54);

        expect(errorWarnings.warnings[1].message).contain(
            `Variables of <odeSystem> must be different than independent variable`,
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.start.line).eq(3);
        expect(errorWarnings.warnings[1].position.start.column).eq(1);
        expect(errorWarnings.warnings[1].position.end.line).eq(5);
        expect(errorWarnings.warnings[1].position.end.column).eq(13);

        expect(errorWarnings.warnings[2].message).contain(
            `Invalid value of a variable: sin(y)`,
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].position.start.line).eq(11);
        expect(errorWarnings.warnings[2].position.start.column).eq(12);
        expect(errorWarnings.warnings[2].position.end.line).eq(11);
        expect(errorWarnings.warnings[2].position.end.column).eq(30);

        expect(errorWarnings.warnings[3].message).contain(
            `Can't define ODE RHS functions with duplicate dependent variable names`,
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].position.start.line).eq(15);
        expect(errorWarnings.warnings[3].position.start.column).eq(1);
        expect(errorWarnings.warnings[3].position.end.line).eq(18);
        expect(errorWarnings.warnings[3].position.end.column).eq(13);
    });
});
