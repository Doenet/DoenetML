import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("SlopeField and VectorField tag tests @group2", async () => {
    it("slopeField takes a two-input function by reference", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="f" variables="x y">x*sin(y)</function></setup>
  <graph>
    <slopeField name="sf" function="$f" />
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];

        expect(sf.stateValues.haveFunction).eq(true);
        expect(sf.stateValues.numInputs).eq(2);
        expect(sf.stateValues.fDefinitions.length).eq(1);
        // The numeric closure must evaluate positionally: f(2, pi/2) = 2.
        expect(sf.stateValues.functions[0](2, Math.PI / 2)).closeTo(2, 1e-12);
    });

    it("slopeField accepts a one-input function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="f">x*sin(x)</function></setup>
  <graph>
    <slopeField name="sf" function="$f" />
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sf = stateVariables[await resolvePathToNodeIdx("sf")];

        expect(sf.stateValues.haveFunction).eq(true);
        expect(sf.stateValues.numInputs).eq(1);
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
        expect(onlyX.stateValues.numInputs).eq(2);
        expect(onlyX.stateValues.functions[0](2, 7)).closeTo(
            2 * Math.sin(2),
            1e-12,
        );

        expect(bothVars.stateValues.haveFunction).eq(true);
        expect(bothVars.stateValues.numInputs).eq(2);
        expect(bothVars.stateValues.functions[0](2, 7)).closeTo(5, 1e-12);
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
        expect(sf.stateValues.numInputs).eq(0);

        // Whitespace is not an expression: wrapping it would yield a function
        // that is NaN everywhere, which looks the same on screen as a broken
        // component.
        expect(blank.stateValues.haveFunction).eq(false);
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
        expect(sf.stateValues.functions[0](2, 7)).closeTo(5, 1e-12);
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
    <vectorField name="vf" function="$F" />
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const vf = stateVariables[await resolvePathToNodeIdx("vf")];

        expect(vf.stateValues.haveFunction).eq(true);
        expect(vf.stateValues.numInputs).eq(2);
        expect(vf.stateValues.fDefinitions.length).eq(2);
        // F(3, 5) = (5, -3)
        expect(vf.stateValues.functions[0](3, 5)).closeTo(5, 1e-12);
        expect(vf.stateValues.functions[1](3, 5)).closeTo(-3, 1e-12);
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
        expect(vf.stateValues.numInputs).eq(2);
        expect(vf.stateValues.functions[0](3, 5)).closeTo(5, 1e-12);
        expect(vf.stateValues.functions[1](3, 5)).closeTo(-3, 1e-12);
    });

    it("vectorField rejects a one-output function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="f" variables="x y">x*y</function></setup>
  <graph>
    <vectorField name="vf" function="$f" />
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const vf = stateVariables[await resolvePathToNodeIdx("vf")];

        expect(vf.stateValues.haveFunction).eq(false);
    });

    it("vectorField normalize defaults to false and can be set", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><function name="F" variables="x y">(y, -x)</function></setup>
  <graph>
    <vectorField name="a" function="$F" />
    <vectorField name="b" function="$F" normalize />
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
