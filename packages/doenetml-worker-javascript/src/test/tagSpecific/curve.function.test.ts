import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Function curve tag tests", async () => {
    async function test_function({
        core,
        resolvePathToNodeIdx,
        f,
        flipFunction = false,
    }: {
        core: PublicDoenetMLCore;
        f: (arg: number) => number;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        flipFunction?: boolean;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .curveType,
        ).eq("function");
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .flipFunction,
        ).eq(flipFunction);

        let c_fun =
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.fs[0];

        for (let x = -5; x <= 5; x += 2) {
            expect(c_fun(x)).closeTo(f(x), 1e-12);
        }
    }

    it("a function of x", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
        <function>x^3-x</function>
    </curve>
    </graph>
    `,
        });

        await test_function({
            core,
            resolvePathToNodeIdx,
            f: (x) => x ** 3 - x,
        });
    });

    it("sugar a function of x", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
        x^3-x
    </curve>
    </graph>
    `,
        });

        await test_function({
            core,
            resolvePathToNodeIdx,
            f: (x) => x ** 3 - x,
        });
    });

    it("sugar a function of x, with strings and macros", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
        x^$a-x
    </curve>
    </graph>
    <number name="a">3</number>
    `,
        });

        await test_function({
            core,
            resolvePathToNodeIdx,
            f: (x) => x ** 3 - x,
        });
    });

    it("sugar a function of r", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" variable="r">
        r^3-r
    </curve>
    </graph>
    `,
        });

        await test_function({
            core,
            resolvePathToNodeIdx,
            f: (x) => x ** 3 - x,
        });
    });

    it("sugar a function of r, with strings and macros", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" variable="r">
        r^$b-r
    </curve>
    </graph>
    <math name="b">3</math>
    `,
        });

        await test_function({
            core,
            resolvePathToNodeIdx,
            f: (x) => x ** 3 - x,
        });
    });

    it("a function of a", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
        <function variables="a">a^3-a</function>
    </curve>
    </graph>
    `,
        });

        await test_function({
            core,
            resolvePathToNodeIdx,
            f: (x) => x ** 3 - x,
        });
    });

    it("a function with variable parameter", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <mathInput prefill="1" name="a" />
    <curve name="c">
        <function>x^3-x$a</function>
    </curve>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .curveType,
        ).eq("function");
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .flipFunction,
        ).eq(false);

        let c_fun =
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.fs[0];

        let f = (x, a) => x ** 3 - x * a;
        let a = 1;

        for (let x = -5; x <= 5; x += 2) {
            expect(c_fun(x)).closeTo(f(x, a), 1e-12);
        }

        a = -2;
        await updateMathInputValue({
            latex: `${a}`,
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        c_fun =
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.fs[0];
        for (let x = -5; x <= 5; x += 2) {
            expect(c_fun(x)).closeTo(f(x, a), 1e-12);
        }
    });

    it("a function manually flipped", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" flipFunction>
        <function variables="a">a^3-a</function>
    </curve>
    </graph>
    `,
        });

        await test_function({
            core,
            resolvePathToNodeIdx,
            f: (x) => x ** 3 - x,
            flipFunction: true,
        });
    });

    async function test_constrain_to_function(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        f: (arg: number) => number,
    ) {
        async function check_items(x: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let px =
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[0].tree;
            let py =
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[1].tree;
            expect(px).eq(x);
            expect(py).closeTo(f(x), 1e-5);
        }

        let x = 3;
        await check_items(x);

        x = 1.5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x,
            y: -1.5,
            core,
        });
        await check_items(x);

        x = -0.1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x,
            y: -10,
            core,
        });
        await check_items(x);
    }

    it("constrain to function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point name="P" x='3' y='5'>
      <constrainTo>$c</constrainTo>
    </point>
    
    </graph>
    `,
        });

        let f = (x) => x ** 4 - 5 * x ** 2;
        await test_constrain_to_function(core, resolvePathToNodeIdx, f);
    });

    it("constrain to function 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text>a</text>
    <graph>
    <function name="f" variables="u">
      u^4-5u^2
    </function>
    
    <point name="P" x='3' y='5'>
      <constrainTo>$f</constrainTo>
    </point>
    
    </graph>
`,
        });

        let f = (x) => x ** 4 - 5 * x ** 2;
        await test_constrain_to_function(core, resolvePathToNodeIdx, f);
    });

    async function test_constrain_to_function_as_curve(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let f = (x) => x ** 4 - 5 * x ** 2;

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(5, 0.1);
        expect(x).greaterThan(2);
        expect(y).closeTo(f(x), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1.5,
            y: -1.5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(-1.5, 0.1);
        expect(x).greaterThan(1.5);
        expect(y).closeTo(f(x), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 0.1,
            y: -10,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        let minimum2 =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .minima[1];
        expect(x).closeTo(minimum2[0], 0.1);
        expect(y).closeTo(minimum2[1], 0.1);
        expect(y).closeTo(f(x), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -0.1,
            y: -10,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        let minimum1 =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .minima[0];
        expect(x).closeTo(minimum1[0], 0.1);
        expect(y).closeTo(minimum1[1], 0.1);
        expect(y).closeTo(f(x), 1e-5);

        // try a bunch of points at right to make sure stay on right branch
        // which fails with numDiscretizationPoints too low (e.g., at 100)
        for (let v = -5; v <= -1; v += 0.1) {
            await movePoint({
                componentIdx: await resolvePathToNodeIdx("P"),
                x: 5,
                y: v,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            x =
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[0].tree;
            y =
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[1].tree;
            expect(x).greaterThan(1.7);
            expect(y).greaterThan(v);
            expect(y).lessThan(v + 0.5);
            expect(y).closeTo(f(x), 1e-5);
        }
    }

    it("constrain to function, nearest point as curve", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" nearestPointAsCurve>
      <function name="f" variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point name="P" x='3' y='5'>
      <constrainTo>$c</constrainTo>
    </point>
    
    </graph>
    `,
        });

        await test_constrain_to_function_as_curve(core, resolvePathToNodeIdx);
    });

    it("constrain to function, nearest point as curve 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <function name="f" variables="u" nearestPointAsCurve>
      u^4-5u^2
    </function>
    
    <point name="P" x='3' y='5'>
      <constrainTo>$f</constrainTo>
    </point>
    
    </graph>
    `,
        });

        await test_constrain_to_function_as_curve(core, resolvePathToNodeIdx);
    });

    it("constrain to function, nearest point as curve 3", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
      <function name="f" variables="u" nearestPointAsCurve>
        u^4-5u^2
      </function>
    </curve>
    
    <point name="P" x='3' y='5'>
      <constrainTo>$c</constrainTo>
    </point>
    
    </graph>
    `,
        });

        await test_constrain_to_function_as_curve(core, resolvePathToNodeIdx);
    });

    it("constrain to function, different scales from graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph yMax="120" yMin="-45" xMin="-1" xMax="5.5">
      <curve name="c">
        <function name='g' variables='t' domain="[0,5]">(60 t - 106 t^2 + 59*t^3 - 13 t^4 + t^5)4</function>
      </curve>
      <point x="1.5" y="2" name="A">
          <constrainTo relativeToGraphScales>$c</constrainTo>
      </point>
    </graph>
    `,
        });

        let f = (t) =>
            (60 * t - 106 * t ** 2 + 59 * t ** 3 - 13 * t ** 4 + t ** 5) * 4;

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(1.5, 1e-10);
        expect(y).closeTo(f(1.5), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 5,
            y: -60,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(5, 1e-10);
        expect(y).closeTo(f(5), 1e-10);
    });

    it("constrain to function, different scales from graph 2 ", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph xMax="120" xMin="-45" yMin="-1" yMax="5.5">
      <curve name="c">
        <function name='g' variables='t' domain="[-20,100]">sin(t/10)+t/50+2</function>
      </curve>
      <point x="1.5" y="2" name="A">
          <constrainTo relativeToGraphScales>$c</constrainTo>
      </point>
    </graph>
    `,
        });

        let f = (t) => Math.sin(t / 10) + t / 50 + 2;

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(1.5, 1e-10);
        expect(y).closeTo(f(1.5), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 90,
            y: 5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(90, 1e-10);
        expect(y).closeTo(f(90), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 120,
            y: -5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(100, 1e-10);
        expect(y).closeTo(f(100), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -10,
            y: 10,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(-10, 1e-10);
        expect(y).closeTo(f(-10), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -50,
            y: -100,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(-20, 1e-10);
        expect(y).closeTo(f(-20), 1e-10);
    });

    it("constrain to inverse function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" flipFunction>
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point name="P" x='5' y='3'>
      <constrainTo>$c</constrainTo>
    </point>
    
    </graph>
    `,
        });

        let f = (y) => y ** 4 - 5 * y ** 2;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .flipFunction,
        ).eq(true);
        let x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).eq(3);
        expect(x).closeTo(f(y), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            y: 1.5,
            x: -1.5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).eq(1.5);
        expect(x).closeTo(f(y), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            y: 0.1,
            x: -10,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).eq(0.1);
        expect(x).closeTo(f(y), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            y: -0.1,
            x: -10,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).eq(-0.1);
        expect(x).closeTo(f(y), 1e-5);
    });

    async function test_constrain_inverse_as_curve(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let f = (y) => y ** 4 - 5 * y ** 2;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .flipFunction,
        ).eq(true);
        let x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(5, 0.1);
        expect(y).greaterThan(2);
        expect(x).closeTo(f(y), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1.5,
            y: 1.5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(x).closeTo(-1.5, 0.1);
        expect(y).greaterThan(1.5);
        expect(x).closeTo(f(y), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -10,
            y: 0.1,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        let minimum2 =
            stateVariables[await resolvePathToNodeIdx("_function1")].stateValues
                .minima[1];

        expect(y).closeTo(minimum2[0], 0.1);
        expect(x).closeTo(minimum2[1], 0.1);
        expect(x).closeTo(f(y), 1e-5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -10,
            y: -0.1,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        let minimum1 =
            stateVariables[await resolvePathToNodeIdx("_function1")].stateValues
                .minima[0];

        expect(y).closeTo(minimum1[0], 0.1);
        expect(x).closeTo(minimum1[1], 0.1);
        expect(x).closeTo(f(y), 1e-5);

        // try a bunch of points at top to make sure stay on top branch
        // which fails with numDiscretizationPoints too low (e.g., at 100)
        for (let v = -5; v <= -1; v += 0.1) {
            await movePoint({
                componentIdx: await resolvePathToNodeIdx("P"),
                x: v,
                y: 5,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            x =
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[0].tree;
            y =
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[1].tree;
            expect(y).greaterThan(1.7);
            expect(x).greaterThan(v);
            expect(x).lessThan(v + 0.5);
            expect(x).closeTo(f(y), 1e-5);
        }
    }
    it("constrain to inverse function, nearest point as curve", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" flipFunction nearestPointAsCurve>
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point name="P" x='5' y='3'>
      <constrainTo>$c</constrainTo>
    </point>
    
    </graph>
    `,
        });

        await test_constrain_inverse_as_curve(core, resolvePathToNodeIdx);
    });

    it("constrain to inverse function, nearest point as curve 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c" flipFunction>
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point name="P" x='5' y='3'>
      <constrainTo><curve extend="$c" nearestPointAsCurve /></constrainTo>
    </point>
    
    </graph>
    `,
        });

        await test_constrain_inverse_as_curve(core, resolvePathToNodeIdx);
    });

    it("constrain to inverse function, different scales from graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph xMax="120" xMin="-45" yMin="-1" yMax="5.5">
      <curve name="c" flipFunction>
        <function name='g' variables='t' domain="[0,5]">(60 t - 106 t^2 + 59*t^3 - 13 t^4 + t^5)4</function>
      </curve>
      <point y="1.5" x="2" name="A">
          <constrainTo relativeToGraphScales>$c</constrainTo>
      </point>
    </graph>
    `,
        });

        let f = (t) =>
            (60 * t - 106 * t ** 2 + 59 * t ** 3 - 13 * t ** 4 + t ** 5) * 4;

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(1.5, 1e-10);
        expect(x).closeTo(f(1.5), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -60,
            y: 5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(5, 1e-10);
        expect(x).closeTo(f(5), 1e-10);
    });

    it("constrain to inverse function, different scales from graph 2 ", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph yMax="120" yMin="-45" xMin="-1" xMax="5.5">
      <curve name="c" flipFunction>
        <function name='g' variables='t' domain="[-20,100]">sin(t/10)+t/50+2</function>
      </curve>
      <point y="1.5" x="2" name="A">
          <constrainTo relativeToGraphScales>$c</constrainTo>
      </point>
    </graph>
    `,
        });

        let f = (t) => Math.sin(t / 10) + t / 50 + 2;

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(1.5, 1e-10);
        expect(x).closeTo(f(1.5), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 5,
            y: 90,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(90, 1e-10);
        expect(x).closeTo(f(90), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -5,
            y: 120,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(100, 1e-10);
        expect(x).closeTo(f(100), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 10,
            y: -10,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(-10, 1e-10);
        expect(x).closeTo(f(-10), 1e-10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -100,
            y: -50,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;
        expect(y).closeTo(-20, 1e-10);
        expect(x).closeTo(f(-20), 1e-10);
    });

    it("function with label as math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c">
      <function>
        x^3-x
      </function>
      <label>hello <m>x^3-x</m></label>
      </curve>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .curveType,
        ).eq("function");
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .flipFunction,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.label,
        ).eq("hello \\(x^3-x\\)");

        let f =
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.fs[0];
        expect(f(-2)).eq(-8 + 2);
        expect(f(3)).eq(27 - 3);
    });
});
