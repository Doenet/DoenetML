import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Parameterized curve tag tests", async () => {
    async function test_curve({
        core,
        parMin = -10,
        parMax = 10,
        variable = "x",
        hasLabel = false,
        name = "/c",
        nameFromGraphChild = false,
        f1 = (x) => 5 * x ** 3,
        f2 = (x) => 3 * x ** 5,
    }: {
        core: Core;
        parMin?: number;
        parMax?: number;
        variable?: string;
        hasLabel?: boolean;
        name?: string;
        nameFromGraphChild?: boolean;
        f1?: (arg: number) => number;
        f2?: (arg: number) => number;
    }) {
        const stateVariables = await returnAllStateVariables(core);

        const cName = nameFromGraphChild
            ? stateVariables["/g"].activeChildren[0].componentName
            : name;

        expect(stateVariables[cName].stateValues.curveType).eq(
            "parameterization",
        );

        expect(stateVariables[cName].stateValues.variableForChild.tree).eq(
            variable,
        );
        expect(stateVariables[cName].stateValues.parMin).eq(parMin);
        expect(stateVariables[cName].stateValues.parMax).eq(parMax);
        if (hasLabel) {
            expect(stateVariables[cName].stateValues.label).eq(
                "\\(\\left( 5 t^{3}, 3 t^{5} \\right)\\)",
            );
        }

        let c_fun1 = stateVariables[cName].stateValues.fs[0];
        let c_fun2 = stateVariables[cName].stateValues.fs[1];

        let nSteps = 40;
        let dx = (parMax - parMin) / (nSteps - 1);
        for (let i = 0; i < nSteps; i++) {
            let x = parMin + i * dx;
            expect(c_fun1(x)).closeTo(f1(x), 1e-12);
            expect(c_fun2(x)).closeTo(f2(x), 1e-12);
        }
    }

    it("sugar a parameterization in terms of x", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
    (5x^3, 3x^5)
    </curve>
    </graph>
    `,
        });

        await test_curve({ core });
    });

    it("sugar a parameterization in terms of x, with strings and macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
    ($b x^$a, $a x^$b)
    </curve>
    </graph>
    <number name="a">3</number>
    <math name="b">5</math>
    `,
        });

        await test_curve({ core });
    });

    it("sugar a parameterization in terms of x, with strings and macros, label with math", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
      ($b x^$a, $a x^$b)
      <label><math>($b t^$a, $a t^$b)</math></label>
    </curve>
    </graph>
    <number name="a">3</number>
    <math name="b">5</math>
    `,
        });

        await test_curve({ core, hasLabel: true });
    });

    it("sugar a parameterization in terms of t", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" variable="t">
    (5t^3, 3t^5)
    </curve>
    </graph>
    `,
        });

        await test_curve({ core, variable: "t" });
    });

    it("sugar a parameterization in terms of t, with strings and macro", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" variable="$var">
    (5$var^3, 3$var^5)
    </curve>
    </graph>
    <math name="var">t</math>
    `,
        });

        await test_curve({ core, variable: "t" });
    });

    it("a parameterization, no sugar", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
    <function variables="q">5q^3</function>
    <function variables="u">3u^5</function>
    </curve>
    </graph>
    `,
        });

        await test_curve({ core });
    });

    it("a parameterization, from vector-valued function", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
    <function variables="q">(5q^3, 3q^5)</function>
    </curve>
    </graph>
    `,
        });

        await test_curve({ core });
    });

    it("a parameterization, adapted from vector-valued function", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
    <function variables="q">(5q^3, 3q^5)</function>
    </graph>
    `,
        });

        await test_curve({ core, nameFromGraphChild: true });
    });

    it("a parameterization, no sugar, label with math", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
    <function variables="q">5q^3</function>
    <function variables="u">3u^5</function>
    <label><math>(5t^3,3t^5)</math></label>
    </curve>
    </graph>
    `,
        });

        await test_curve({ core, hasLabel: true });
    });

    it("a parameterization, change par limits", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" parMin="-1" parMax="0.5">
      <function variables="t">5t^3</function>
      <function variables="t">3t^5</function>
    </curve>
    </graph>
    `,
        });

        await test_curve({ core, parMin: -1, parMax: 0.5 });
    });

    it("a parameterization, copy and overwrite par limits", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c1" parMin="-1" parMax="0.5">
      <function variables="t">5t^3</function>
      <function variables="t">3t^5</function>
    </curve>
    </graph>
    <graph>
      $c1{parMin="-4" parMax="0" name="c2"}
    </graph>
    `,
        });

        await test_curve({ core, name: "/c1", parMin: -1, parMax: 0.5 });
        await test_curve({ core, name: "/c2", parMin: -4, parMax: 0 });
    });

    it("a parameterization with dynamic parameter", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="2"/>
    <graph>
    <curve name="c">
    <function variables="t">t$mi+1</function>
    <function variables="t">t^3-$mi</function>
    </curve>
    </graph>
    `,
        });

        await test_curve({ core, f1: (x) => 2 * x + 1, f2: (x) => x ** 3 - 2 });

        await updateMathInputValue({ latex: "-3", name: "/mi", core });
        await test_curve({
            core,
            f1: (x) => -3 * x + 1,
            f2: (x) => x ** 3 + 3,
        });
    });

    async function test_constrain_to_curve(core: Core) {
        let stateVariables = await returnAllStateVariables(core);
        let x = stateVariables["/P"].stateValues.xs[0].tree;
        let y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(7, 0.5);
        expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);

        await movePoint({ name: "/P", x: -2, y: 10, core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(0.3, 0.1);
        expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);

        await movePoint({ name: "/P", x: -10, y: 2, core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(-8, 1e-3);
        expect(y).closeTo(Math.sin(-4), 1e-3);

        await updateMathInputValue({ latex: "-1", name: "/parMin", core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(-1, 1e-3);
        expect(y).closeTo(Math.sin(-2), 1e-3);

        await movePoint({ name: "/P", x: 10, y: 2, core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(8, 1e-3);
        expect(y).closeTo(Math.sin(4), 1e-3);

        await updateMathInputValue({ latex: "1", name: "/parMax", core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(1, 1e-3);
        expect(y).closeTo(Math.sin(2), 1e-3);
    }

    it("constrain to parametrized curve", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="parMin" prefill="-2"/>
    <mathInput name="parMax" prefill="2"/>
    <graph>
    <curve name="c" parMin="$parMin" parMax="$parMax">
    <function variables="s">s^3</function>
    <function variables="s">sin(2s)</function>
    </curve>
    
    <point name="P" x='7' y='1'>
      <constraints>
        <constrainTo>$c</constrainTo>
      </constraints>
    </point>
    
    </graph>
    `,
        });

        await test_constrain_to_curve(core);
    });

    it("constrain to parametrized curve, from vector-valued function in curve", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="parMin" prefill="-2"/>
    <mathInput name="parMax" prefill="2"/>
    <graph>
    <curve name="c" parMin="$parMin" parMax="$parMax">
    <function variables="s">(s^3,sin(2s))</function>
    </curve>
    
    <point name="P" x='7' y='1'>
      <constraints>
        <constrainTo>$c</constrainTo>
      </constraints>
    </point>
    
    </graph>
    `,
        });

        await test_constrain_to_curve(core);
    });

    it("constrain to parametrized curve, from vector-valued function directly", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <function name="f" variables="s">(s^3,sin(2s))</function>
    
    <point name="P" x='7' y='1'>
      <constraints>
        <constrainTo>$f</constrainTo>
      </constraints>
    </point>
    
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let x = stateVariables["/P"].stateValues.xs[0].tree;
        let y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(7, 0.5);
        expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);

        await movePoint({ name: "/P", x: -2, y: 10, core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(0.3, 0.1);
        expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);

        await movePoint({ name: "/P", x: -10, y: 2, core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(-10, 0.1);
        expect(y).closeTo(Math.sin(-2 * Math.pow(-x, 1 / 3)), 1e-5);
    });

    it("constrain to parametrized curve, different scales from graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <function variables="t" name="f">100 cos(t)</function>
      <function variables="t" name="g">0.1 sin(t)</function>
    </setup>

    <graph xMin="-110" xMax="110" yMin="-0.11" yMax="0.11">
      <curve name="c">
        <function copySource="f" />
        <function copySource="g" />
      </curve>
      <point x="1" y="0.001" name="P">
        <constraints>
          <constrainTo relativeToGraphScales>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let x = stateVariables["/P"].stateValues.xs[0].tree;
        let y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(100 / Math.sqrt(2), 1e-4);
        expect(y).closeTo(0.1 / Math.sqrt(2), 1e-4);

        await movePoint({ name: "/P", x: -200, y: 0.8, core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo(-100 / Math.sqrt(17), 1e-4);
        expect(y).closeTo((0.1 * 4) / Math.sqrt(17), 1e-4);

        await movePoint({ name: "/P", x: -2, y: -0.001, core });
        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(x).closeTo((-100 * 2) / Math.sqrt(5), 1e-4);
        expect(y).closeTo(-0.1 / Math.sqrt(5), 1e-4);
    });
});
