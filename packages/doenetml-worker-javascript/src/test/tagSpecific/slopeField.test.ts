import { describe, expect, it, vi } from "vitest";
import { createFunctionFromDefinition } from "@doenet/utils";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

/**
 * Rehydrate one of a field's `fDefinitions` into a numeric closure, exactly as
 * the renderer does. The components deliberately do not expose the worker's own
 * closures, since `fDefinitions` is all that is sent to the renderer.
 *
 * The renderer calls it as `f(x, y)` unconditionally, so these tests do too:
 * the `function` attribute names both variables on the `<function>` it creates,
 * whatever arity the author wrote.
 */
function numericalF(fDefinition: any) {
    return createFunctionFromDefinition(fDefinition) as (
        ...args: number[]
    ) => number;
}

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("SlopeField and VectorField tag tests @group2", async () => {
    it("slopeField takes a two-input function by reference", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="f" variables="x y">x*sin(y)</function></setup>
  <graph>
    <slopeField name="sf">$f</slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];

        expect(sf.stateValues.haveFunction).eq(true);
        expect(sf.stateValues.fDefinitions.length).eq(1);
        // The numeric closure must evaluate positionally: f(2, pi/2) = 2.
        expect(
            numericalF(sf.stateValues.fDefinitions[0])(2, Math.PI / 2),
        ).closeTo(2, 1e-12);
    });

    it("slopeField accepts a one-input function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="f">x*sin(x)</function></setup>
  <graph>
    <slopeField name="sf">$f</slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];

        // The second input is simply ignored, so f(x) is a field like any other.
        expect(sf.stateValues.haveFunction).eq(true);
        expect(numericalF(sf.stateValues.fDefinitions[0])(2, 7)).closeTo(
            2 * Math.sin(2),
            1e-12,
        );
    });

    it("reads a bare expression as a function of x and y", async () => {
        // The form the editor's completions offer. Without `variables="x y"` on
        // the `<function>` the attribute creates, `y` here would be a free
        // symbol and both fields would be NaN everywhere — a blank graph.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vectorField name="vf">(y, -x)</vectorField>
    <slopeField name="sf">y - x</slopeField>
    <slopeField name="onlyX">x*sin(x)</slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const vf = stateVariables[await resolvePathToNodeIdx("vf")];
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];
        const onlyX = stateVariables[await resolvePathToNodeIdx("onlyX")];

        expect(vf.stateValues.haveFunction).eq(true);
        expect(numericalF(vf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            5,
            1e-12,
        );
        expect(numericalF(vf.stateValues.fDefinitions[1])(3, 5)).closeTo(
            -3,
            1e-12,
        );

        expect(sf.stateValues.haveFunction).eq(true);
        expect(numericalF(sf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            2,
            1e-12,
        );

        // An expression in x alone must not be disturbed by naming y too.
        expect(onlyX.stateValues.haveFunction).eq(true);
        expect(numericalF(onlyX.stateValues.fDefinitions[0])(3, 5)).closeTo(
            3 * Math.sin(3),
            1e-12,
        );

        expect(getDiagnosticsByType(core).warnings.length).eq(0);
    });

    it("leaves a referenced function's own variables alone", async () => {
        // Naming `x` and `y` on the component the attribute creates must not
        // rename the inputs of a function the author declared for themselves:
        // the referenced function is held as a child and fed positionally.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <function name="F" variables="u v">(v, -u)</function>
    <function name="h" variable="t">t^2</function>
  </setup>
  <graph>
    <vectorField name="vf">$F</vectorField>
    <slopeField name="sf">$h</slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const vf = stateVariables[await resolvePathToNodeIdx("vf")];
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];

        // F(3, 5) = (5, -3), read as (v, -u) and not as (y, -x).
        expect(numericalF(vf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            5,
            1e-12,
        );
        expect(numericalF(vf.stateValues.fDefinitions[1])(3, 5)).closeTo(
            -3,
            1e-12,
        );
        // h(3) = 9, whatever the second input is.
        expect(numericalF(sf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            9,
            1e-12,
        );
    });

    it("slopeField sugars a bare expression into a function of x and y", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <slopeField name="onlyX">x*sin(x)</slopeField>
    <slopeField name="bothVars">y - x</slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const onlyX = stateVariables[await resolvePathToNodeIdx("onlyX")];
        const bothVars = stateVariables[await resolvePathToNodeIdx("bothVars")];

        // The sugared function always takes both variables, so an expression
        // that mentions y is a genuine function of y rather than NaN.
        expect(onlyX.stateValues.haveFunction).eq(true);
        expect(numericalF(onlyX.stateValues.fDefinitions[0])(2, 7)).closeTo(
            2 * Math.sin(2),
            1e-12,
        );

        expect(bothVars.stateValues.haveFunction).eq(true);
        expect(numericalF(bothVars.stateValues.fDefinitions[0])(2, 7)).closeTo(
            5,
            1e-12,
        );
    });

    it("slopeField reports no function when none is given", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <slopeField name="sf" />
    <slopeField name="blank">   </slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];
        const blank = stateVariables[await resolvePathToNodeIdx("blank")];

        expect(sf.stateValues.haveFunction).eq(false);

        // Whitespace is not an expression: wrapping it would yield a function
        // that is NaN everywhere, which looks the same on screen as a broken
        // component.
        expect(blank.stateValues.haveFunction).eq(false);

        // Deliberately silent: a field with no function at all is what the
        // editor's completions leave behind, so a warning here would fire while
        // the author was still typing.
        expect(getDiagnosticsByType(core).warnings.length).eq(0);
    });

    it("slopeField sugar leaves a label child alone", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <slopeField name="sf">y - x<label>a field</label></slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];

        // Only the expression becomes the function; the label stays a child.
        expect(sf.stateValues.haveFunction).eq(true);
        expect(numericalF(sf.stateValues.fDefinitions[0])(2, 7)).closeTo(
            5,
            1e-12,
        );
        expect(sf.stateValues.label).eq("a field");
    });

    it("slopeField exposes grid defaults and honors overrides", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <slopeField name="a">x</slopeField>
    <slopeField name="b" dx="0.5" dy="2" xoffset="0.25" markLength="30" maxMarks="900">x</slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const a = stateVariables[await resolvePathToNodeIdx("a")];
        const b = stateVariables[await resolvePathToNodeIdx("b")];

        expect(a.stateValues.dx).eq(1);
        expect(a.stateValues.dy).eq(1);
        expect(a.stateValues.markLength).eq(20);
        expect(a.stateValues.maxMarks).eq(2500);

        expect(b.stateValues.dx).eq(0.5);
        expect(b.stateValues.dy).eq(2);
        expect(b.stateValues.xoffset).eq(0.25);
        expect(b.stateValues.markLength).eq(30);
        expect(b.stateValues.maxMarks).eq(900);
    });

    it("vectorField takes a two-output function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="F" variables="x y">(y, -x)</function></setup>
  <graph>
    <vectorField name="vf">$F</vectorField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const vf = stateVariables[await resolvePathToNodeIdx("vf")];

        expect(vf.stateValues.haveFunction).eq(true);
        expect(vf.stateValues.fDefinitions.length).eq(2);
        // F(3, 5) = (5, -3)
        expect(numericalF(vf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            5,
            1e-12,
        );
        expect(numericalF(vf.stateValues.fDefinitions[1])(3, 5)).closeTo(
            -3,
            1e-12,
        );
    });

    it("vectorField sugars a bare expression into a function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vectorField name="vf">(y, -x)</vectorField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const vf = stateVariables[await resolvePathToNodeIdx("vf")];

        expect(vf.stateValues.haveFunction).eq(true);
        expect(numericalF(vf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            5,
            1e-12,
        );
        expect(numericalF(vf.stateValues.fDefinitions[1])(3, 5)).closeTo(
            -3,
            1e-12,
        );
    });

    it("warns, rather than drawing nothing in silence, when the function has the wrong number of outputs", async () => {
        // A field given the other component's function looks finished and draws
        // nothing, so refusing it is only half the job: the warning has to name
        // what was wanted and point at the component that wants what was given.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vectorField name="vf">x*y</vectorField>
    <slopeField name="sf">(y, -x)</slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("vf")].stateValues
                .haveFunction,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sf")].stateValues
                .haveFunction,
        ).eq(false);

        const { errors, warnings } = getDiagnosticsByType(core);
        expect(errors.length).eq(0);
        expect(warnings.length).eq(2);

        expect(warnings[0].message).contain(
            "`<vectorField>` needs a function with two outputs",
        );
        expect(warnings[0].message).contain("has 1 output");
        expect(warnings[0].message).contain(
            "`<slopeField>` is the component for that function",
        );
        expect(warnings[0].position.start.line).eq(3);

        expect(warnings[1].message).contain(
            "`<slopeField>` needs a function with one output",
        );
        expect(warnings[1].message).contain("has 2 outputs");
        expect(warnings[1].message).contain(
            "`<vectorField>` is the component for that function",
        );
        expect(warnings[1].position.start.line).eq(4);
    });

    it("reads a bare expression with the variables the field names", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <slopeField name="renamed" variables="s t">s - t</slopeField>
    <vectorField name="renamedVec" variables="u v">(v, -u)</vectorField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const renamed = stateVariables[await resolvePathToNodeIdx("renamed")];
        expect(renamed.stateValues.haveFunction).eq(true);
        // s - t at (3, 5) is -2. Without the renaming, `s` and `t` would both
        // be free symbols and the function would be NaN.
        expect(numericalF(renamed.stateValues.fDefinitions[0])(3, 5)).closeTo(
            -2,
            1e-12,
        );

        const renamedVec =
            stateVariables[await resolvePathToNodeIdx("renamedVec")];
        expect(renamedVec.stateValues.haveFunction).eq(true);
        expect(
            numericalF(renamedVec.stateValues.fDefinitions[0])(3, 5),
        ).closeTo(5, 1e-12);
        expect(
            numericalF(renamedVec.stateValues.fDefinitions[1])(3, 5),
        ).closeTo(-3, 1e-12);

        expect(getDiagnosticsByType(core).warnings.length).eq(0);
    });

    it("lets the variable names be references, which keep tracking what they name", async () => {
        // The names are handed to the wrapping <function> as an unresolved
        // component, so they can be whatever a student types. The expression
        // is written in fixed letters so that renaming the inputs really does
        // change which value arrives where.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="v1">q</mathInput>
  <mathInput name="v2">r</mathInput>
  <graph>
    <slopeField name="sf" variables="$v1 $v2">q - r</slopeField>
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let sf = stateVariables[await resolvePathToNodeIdx("sf")];
        expect(sf.stateValues.haveFunction).eq(true);
        // Inputs are (q, r), so q = 3 and r = 5: q - r is -2.
        expect(numericalF(sf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            -2,
            1e-12,
        );

        // The student swaps which letter names which input, leaving the
        // expression alone.
        await updateMathInputValue({
            latex: "r",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        sf = stateVariables[await resolvePathToNodeIdx("sf")];
        // Inputs are now (r, q), so r = 3 and q = 5: q - r is 2.
        expect(numericalF(sf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            2,
            1e-12,
        );

        expect(getDiagnosticsByType(core).warnings.length).eq(0);
    });

    it("takes an explicit function child as it stands, ignoring the field's variables", async () => {
        // An explicit <function> names its own inputs, so it is used as
        // written rather than wrapped in a second function.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <slopeField name="sf" variables="s t"><function variables="u v">u - v</function></slopeField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];

        expect(sf.stateValues.haveFunction).eq(true);
        // u - v at (3, 5) is -2, from the child's own variable names.
        expect(numericalF(sf.stateValues.fDefinitions[0])(3, 5)).closeTo(
            -2,
            1e-12,
        );

        // The attribute did nothing, which is worth saying: it looks exactly
        // like the `variables` a <function> does obey.
        const { errors, warnings } = getDiagnosticsByType(core);
        expect(errors.length).eq(0);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0124");
        expect(warnings[0].message).contain(
            "which names its own variables, so `variables` is ignored",
        );
    });

    it("vectorField normalize defaults to false and can be set", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="F" variables="x y">(y, -x)</function></setup>
  <graph>
    <vectorField name="a">$F</vectorField>
    <vectorField name="b" normalize>$F</vectorField>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .normalize,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .normalize,
        ).eq(true);
    });
});
