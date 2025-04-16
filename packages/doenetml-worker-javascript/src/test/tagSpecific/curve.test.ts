import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveControlVector,
    movePoint,
    moveThroughPoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Curve tag tests", async () => {
    async function test_curve_through_4_points({
        core,
        hasLabel = false,
        hasPoints = false,
        splineForm = "centripetal",
        splineTension = 0.8,
    }: {
        core: PublicDoenetMLCore;
        hasLabel?: boolean;
        hasPoints?: boolean;
        splineForm?: "centripetal" | "uniform";
        splineTension?: number;
    }) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.curveType).eq("bezier");
        expect(stateVariables["/c"].stateValues.numThroughPoints).eq(4);
        expect(stateVariables["/c"].stateValues.splineForm).eq(splineForm);
        expect(stateVariables["/c"].stateValues.splineTension).eq(
            splineTension,
        );
        if (hasLabel) {
            expect(stateVariables["/c"].stateValues.label).eq(
                "Hi \\((-1,2), (2, -2 ), (2( -2 ), -4), (5,6)\\)",
            );
        }
        let f1 = stateVariables["/c"].stateValues.fs[0];
        let f2 = stateVariables["/c"].stateValues.fs[1];
        expect(f1(1)).eq(2);
        expect(f2(1)).eq(-2);
        expect(f1(2)).eq(-4);
        expect(f2(2)).eq(-4);

        await updateMathInputValue({ latex: "4", name: "/mi", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.curveType).eq("bezier");
        expect(stateVariables["/c"].stateValues.numThroughPoints).eq(4);
        if (hasLabel) {
            expect(stateVariables["/c"].stateValues.label).eq(
                "Hi \\((-1,2), (2, 4 ), (2( 4 ), -4), (5,6)\\)",
            );
        }
        f1 = stateVariables["/c"].stateValues.fs[0];
        f2 = stateVariables["/c"].stateValues.fs[1];
        expect(f1(1)).eq(2);
        expect(f2(1)).eq(4);
        expect(f1(2)).eq(8);
        expect(f2(2)).eq(-4);

        if (hasPoints) {
            await movePoint({ name: "/P2", x: 5, y: 7, core });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            f1 = stateVariables["/c"].stateValues.fs[0];
            f2 = stateVariables["/c"].stateValues.fs[1];
            expect(f1(1)).eq(5);
            expect(f2(1)).eq(7);
            expect(f1(2)).eq(14);
            expect(f2(2)).eq(-4);
        }
    }

    it("spline through four points, as string with copy", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="-2"/>
    <graph>
    <curve name="c" through="(-1,2) (2, $mi) (2$mi, -4) (5,6)" />
    </graph>
    `,
        });

        await test_curve_through_4_points({ core });
    });

    it("spline through four points, as string with copy, label with math", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="-2"/>
    <graph>
    <curve name="c" through="(-1,2) (2, $mi) (2$mi, -4) (5,6)" >
      <label>Hi <m>(-1,2), (2, $mi), (2($mi), -4), (5,6)</m></label>
    </curve>
    </graph>
    `,
        });

        await test_curve_through_4_points({ core, hasLabel: true });
    });

    it("spline through four points, as copied points", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="-2"/>
    <graph>
    <point name="P1">(-1,2)</point>
    <point name="P2">(2, $mi.value)</point>
    <point name="P3">(2$mi.value, -4)</point>
    <point name="P4">(5,6)</point>
    <curve name="c" through="$P1 $P2 $P3 $P4" />
    </graph>
    `,
        });

        await test_curve_through_4_points({ core, hasPoints: true });
    });

    it("spline through four points, as copied points, different spline parameters", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="-2"/>
    <graph>
    <point name="P1">(-1,2)</point>
    <point name="P2">(2, $mi.value)</point>
    <point name="P3">(2$mi.value, -4)</point>
    <point name="P4">(5,6)</point>
    <curve name="c" splineForm="uniform" splineTension="0.4" through="$P1 $P2 $P3 $P4" />
    </graph>
    `,
        });

        await test_curve_through_4_points({
            core,
            hasPoints: true,
            splineForm: "uniform",
            splineTension: 0.4,
        });
    });

    it("constrain to spline", async () => {
        let core = await createTestCore({
            doenetML: `
    <textInput name="form" />
    <mathInput name="tension" prefill="0.8"/>
    <graph>
    <point name="P1">(-7,-4)</point>
    <point name="P2">(2.5,6)</point>
    <point name="P3">(3, 5.8)</point>
    <point name="P4">(8,-6)</point>
    <curve name="c" splineForm="$form" splineTension="$tension" through="$P1 $P2 $P3 $P4" />
    
    <point name="P5" x="5" y="10">
      <constraints>
        <constrainTo>$c</constrainTo>
      </constraints>
    </point>
    
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.curveType).eq("bezier");
        expect(stateVariables["/c"].stateValues.numThroughPoints).eq(4);
        expect(stateVariables["/c"].stateValues.splineForm).eq("centripetal");
        expect(stateVariables["/c"].stateValues.splineTension).eq(0.8);

        let x = stateVariables["/P5"].stateValues.xs[0].tree;
        let y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(2.8, 0.1);
        expect(y).closeTo(6.1, 0.1);

        await updateTextInputValue({ text: "uniform", name: "/form", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.splineForm).eq("uniform");
        expect(stateVariables["/c"].stateValues.splineTension).eq(0.8);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(3.4, 0.1);
        expect(y).closeTo(8, 0.1);

        await updateTextInputValue({
            text: "centripetal",
            name: "/form",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.splineForm).eq("centripetal");
        expect(stateVariables["/c"].stateValues.splineTension).eq(0.8);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(2.8, 0.1);
        expect(y).closeTo(6.1, 0.1);

        await movePoint({ name: "/P5", x: 10, y: 2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(5.5, 0.1);
        expect(y).closeTo(0.2, 0.1);

        await updateMathInputValue({ latex: "0.1", name: "/tension", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.splineForm).eq("centripetal");
        expect(stateVariables["/c"].stateValues.splineTension).eq(0.1);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(5.5, 0.1);
        expect(y).closeTo(0.2, 0.1);

        await movePoint({ name: "/P1", x: 9, y: 9, core });
        await movePoint({ name: "/P2", x: -9, y: 2, core });
        await movePoint({ name: "/P3", x: 6, y: -8, core });
        await movePoint({ name: "/P4", x: 9, y: 9, core });
        await movePoint({ name: "/P5", x: 10, y: -7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.splineForm).eq("centripetal");
        expect(stateVariables["/c"].stateValues.splineTension).eq(0.1);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(6.4, 0.1);
        expect(y).closeTo(-6.3, 0.1);

        await updateTextInputValue({ text: "uniform", name: "/form", core });
        await movePoint({ name: "/P5", x: 10, y: -7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.splineForm).eq("uniform");
        expect(stateVariables["/c"].stateValues.splineTension).eq(0.1);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(6.5, 0.1);
        expect(y).closeTo(-6.3, 0.1);

        await updateMathInputValue({ latex: "1", name: "/tension", core });
        await movePoint({ name: "/P5", x: 10, y: -7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.splineForm).eq("uniform");
        expect(stateVariables["/c"].stateValues.splineTension).eq(1);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(8.6, 0.1);
        expect(y).closeTo(-6.1, 0.1);

        await updateTextInputValue({ text: "", name: "/form", core });
        await movePoint({ name: "/P5", x: 10, y: -7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c"].stateValues.splineForm).eq("centripetal");
        expect(stateVariables["/c"].stateValues.splineTension).eq(1);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(7.4, 0.1);
        expect(y).closeTo(-6.1, 0.1);
    });

    it("extrapolate", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="backward" />
    <booleanInput name="forward" />
    <graph>
    <point name="P1">(-7,-4)</point>
    <point name="P2">(-4, 3)</point>
    <point name="P3">(4, 3)</point>
    <point name="P4">(7,-4)</point>
    <curve name="c" extrapolateBackward="$backward" extrapolateForward="$forward" through="$P1 $P2 $P3 $P4">
      <bezierControls/>
    </curve>
    
    <point name="P5" x="8" y="-8">
      <constraints>
        <constrainTo>$c</constrainTo>
      </constraints>
    </point>
    
    <point name="P6" x="-8" y="-8">
      <constraints>
        <constrainTo>$c</constrainTo>
      </constraints>
    </point>
    
    </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let x = stateVariables["/P5"].stateValues.xs[0].tree;
        let y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(7, 1e-3);
        expect(y).closeTo(-4, 1e-3);

        x = stateVariables["/P6"].stateValues.xs[0].tree;
        y = stateVariables["/P6"].stateValues.xs[1].tree;
        expect(x).closeTo(-7, 1e-3);
        expect(y).closeTo(-4, 1e-3);

        // turn on extrapolation
        await updateBooleanInputValue({
            boolean: true,
            name: "/forward",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/backward",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(9.1, 0.1);
        expect(y).closeTo(-6.9, 0.1);
        x = stateVariables["/P6"].stateValues.xs[0].tree;
        y = stateVariables["/P6"].stateValues.xs[1].tree;
        expect(x).closeTo(-9.1, 0.1);
        expect(y).closeTo(-6.9, 0.1);

        // activate bezier controls and move tangents
        await core.requestAction({
            componentIdx: "/c",
            actionName: "changeVectorControlDirection",
            args: { throughPointInd: 0, direction: "symmetric" },
        });
        await core.requestAction({
            componentIdx: "/c",
            actionName: "changeVectorControlDirection",
            args: { throughPointInd: 3, direction: "symmetric" },
        });
        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [-1, 2],
            core,
        });
        await moveControlVector({
            name: "/c",
            controlVectorInds: [3, 1],
            controlVector: [1, 2],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(6.7, 0.1);
        expect(y).closeTo(-4.3, 0.1);
        x = stateVariables["/P6"].stateValues.xs[0].tree;
        y = stateVariables["/P6"].stateValues.xs[1].tree;
        expect(x).closeTo(-6.7, 0.1);
        expect(y).closeTo(-4.3, 0.1);

        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [1, -2],
            core,
        });
        await moveControlVector({
            name: "/c",
            controlVectorInds: [3, 1],
            controlVector: [-1, -2],
            core,
        });

        await movePoint({ name: "/P5", x: 9, y: -3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P5"].stateValues.xs[0].tree;
        y = stateVariables["/P5"].stateValues.xs[1].tree;
        expect(x).closeTo(7.2, 0.1);
        expect(y).closeTo(-3, 0.1);

        await movePoint({ name: "/P6", x: -9, y: -3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P6"].stateValues.xs[0].tree;
        y = stateVariables["/P6"].stateValues.xs[1].tree;
        expect(x).closeTo(-7.2, 0.1);
        expect(y).closeTo(-3, 0.1);
    });

    it("extrapolate always reaches edge of graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>xMin = <mathInput name="xMin" prefill="-10" /></p>
    <p>xMax = <mathInput name="xMax" prefill="10" /></p>
    <p>yMin = <mathInput name="yMin" prefill="-10" /></p>
    <p>yMax = <mathInput name="yMax" prefill="10" /></p>
    
    <graph xMin="$xMin" xMax="$xMax" yMin="$yMin" yMax="$yMax">
    <curve name="c" extrapolateBackward extrapolateForward through="(0,0) (1,1)">
      <bezierControls alwaysVisible>(-0.2,-0.2) (-0.2, -0.2)</bezierControls>
    </curve>
    
    <point name="P1" x="8" y="-6">
      <constraints>
        <constrainTo>$c</constrainTo>
      </constraints>
    </point>
    <point name="P2" x="-8" y="6">
      <constraints>
        <constrainTo>$c</constrainTo>
      </constraints>
    </point>

    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let x = stateVariables["/P1"].stateValues.xs[0].tree;
        let y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1, 1e-5);
        expect(y).closeTo(1, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-1, 1e-5);
        expect(y).closeTo(-1, 1e-5);

        // make tangents even smaller
        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [-0.01, -0.01],
            core,
        });
        await moveControlVector({
            name: "/c",
            controlVectorInds: [1, 0],
            controlVector: [-0.01, -0.01],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1, 1e-5);
        expect(y).closeTo(1, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-1, 1e-5);
        expect(y).closeTo(-1, 1e-5);

        // make graph larger
        await updateMathInputValue({ latex: "-1000", name: "/xMin", core });
        await updateMathInputValue({ latex: "1000", name: "/xMax", core });
        await updateMathInputValue({ latex: "-1000", name: "/yMin", core });
        await updateMathInputValue({ latex: "1000", name: "/yMax", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1, 1e-5);
        expect(y).closeTo(1, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-1, 1e-5);
        expect(y).closeTo(-1, 1e-5);

        // move points to corners

        await movePoint({ name: "/P1", x: 1001, y: 999, core });
        await movePoint({ name: "/P2", x: -1001, y: -999, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1000, 1e-5);
        expect(y).closeTo(1000, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-1000, 1e-5);
        expect(y).closeTo(-1000, 1e-5);

        // upper right tangent slightly upward
        await moveControlVector({
            name: "/c",
            controlVectorInds: [1, 0],
            controlVector: [-0.01, -0.012],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(10, 10);
        expect(y).closeTo(1000, 10);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-10, 10);
        expect(y).closeTo(-1000, 10);

        // upper right tangent slightly rightward
        await moveControlVector({
            name: "/c",
            controlVectorInds: [1, 0],
            controlVector: [-0.012, -0.01],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1000, 10);
        expect(y).closeTo(10, 10);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-1000, 10);
        expect(y).closeTo(-10, 10);

        // lower left tangent upward and to left
        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [-0.02, 0.02],
            core,
        });

        await movePoint({ name: "/P2", x: -1000, y: 1000, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1000, 10);
        expect(y).closeTo(10, 10);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-10, 10);
        expect(y).closeTo(1000, 10);

        // lower left tangent downward and to right
        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [0.1, -0.1],
            core,
        });

        await movePoint({ name: "/P2", x: 1000, y: -1000, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(10, 10);
        expect(y).closeTo(1000, 10);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(1000, 10);
        expect(y).closeTo(-10, 10);

        // upper right tangent straight right
        await moveControlVector({
            name: "/c",
            controlVectorInds: [1, 0],
            controlVector: [-0.01, 0],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1000, 1e-5);
        expect(y).closeTo(1, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(1000, 10);
        expect(y).closeTo(-10, 10);

        // upper right tangent straight up
        await moveControlVector({
            name: "/c",
            controlVectorInds: [1, 0],
            controlVector: [0, -0.01],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1, 1e-5);
        expect(y).closeTo(1000, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(1000, 10);
        expect(y).closeTo(-10, 10);

        // lower left tangent straight left
        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [-0.01, 0],
            core,
        });
        await movePoint({ name: "/P2", x: -1000, y: -1000, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1, 1e-5);
        expect(y).closeTo(1000, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(-1000, 1e-5);
        expect(y).closeTo(0, 1e-5);

        // lower left tangent straight down
        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [0, -0.01],
            core,
        });

        await movePoint({ name: "/P2", x: -1000, y: -1000, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P1"].stateValues.xs[0].tree;
        y = stateVariables["/P1"].stateValues.xs[1].tree;
        expect(x).closeTo(1, 1e-5);
        expect(y).closeTo(1000, 1e-5);

        x = stateVariables["/P2"].stateValues.xs[0].tree;
        y = stateVariables["/P2"].stateValues.xs[1].tree;
        expect(x).closeTo(0, 1e-5);
        expect(y).closeTo(-1000, 1e-5);
    });

    it("extrapolate modes", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="eb"/>
    <booleanInput name="ef"/>
    
    <graph>
      <curve name="c" through="(1,2) (3,4) (-5,6)" extrapolateBackward="$eb" extrapolateForward="$ef">
        <bezierControls>(1,0) (-1,0) (0, -1)</bezierControls>
      </curve>
    
    </graph>
    
    <p>ebm: $c.extrapolateBackwardMode{assignNames="ebm"}</p>
    <p>efm: $c.extrapolateForwardMode{assignNames="efm"}</p>

    `,
        });

        async function check_items(ebm: string, efm: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/c"].stateValues.extrapolateBackwardMode).eq(
                ebm,
            );
            expect(stateVariables["/c"].stateValues.extrapolateForwardMode).eq(
                efm,
            );
            expect(stateVariables["/ebm"].stateValues.value).eq(ebm);
            expect(stateVariables["/efm"].stateValues.value).eq(efm);
        }

        await check_items("", "");

        // extrapolate backward
        await updateBooleanInputValue({ boolean: true, name: "/eb", core });
        await check_items("line", "");

        // move first control vector
        await moveControlVector({
            name: "/c",
            controlVectorInds: [0, 0],
            controlVector: [1, -1],
            core,
        });
        await check_items("parabolaHorizontal", "");

        // move second through point
        await moveThroughPoint({
            name: "/c",
            throughPointInd: 1,
            throughPoint: [-1, 4],
            core,
        });
        await check_items("parabolaVertical", "");

        // extrapolate foward
        await updateBooleanInputValue({ boolean: true, name: "/ef", core });
        await check_items("parabolaVertical", "line");

        // move last control vector
        await moveControlVector({
            name: "/c",
            controlVectorInds: [2, 0],
            controlVector: [1, -1],
            core,
        });
        await check_items("parabolaVertical", "parabolaVertical");

        // move last control vector again
        await moveControlVector({
            name: "/c",
            controlVectorInds: [2, 0],
            controlVector: [-1, -1],
            core,
        });
        await check_items("parabolaVertical", "parabolaHorizontal");
    });

    it("variable length curve", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="numPoints" /></p>
    <p>Step size: <mathInput name="step" /></p>
    
    <map hide name="map">
      <template><point>($x, sin($x))</point></template>
      <sources alias="x">
        <sequence from="0" length="$numPoints" step="$step" />
      </sources>
    </map>
    <graph>
    <curve name="c" through="$map" />
    </graph>
    `,
        });

        async function check_items({
            numPoints,
            step,
        }: {
            numPoints: number;
            step: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const c = stateVariables["/c"].stateValues;

            expect(c.throughPoints.length).eq(numPoints);
            expect(c.controlVectors.length).eq(numPoints);

            for (let i = 0; i < numPoints; i++) {
                expect(c.throughPoints[i][0].evaluate_to_constant()).closeTo(
                    i * step,
                    1e-12,
                );
                expect(c.throughPoints[i][1].evaluate_to_constant()).closeTo(
                    Math.sin(i * step),
                    1e-12,
                );
            }
        }

        let numPoints = 0;
        let step = NaN;
        await check_items({ numPoints, step });

        numPoints = 10;
        step = 1;
        await updateMathInputValue({
            latex: `${numPoints}`,
            name: "/numPoints",
            core,
        });
        await updateMathInputValue({
            latex: `${step}`,
            name: "/step",
            core,
        });
        await check_items({ numPoints, step });

        numPoints = 20;
        await updateMathInputValue({
            latex: `${numPoints}`,
            name: "/numPoints",
            core,
        });
        await check_items({ numPoints, step });

        step = 0.5;
        await updateMathInputValue({
            latex: `${step}`,
            name: "/step",
            core,
        });
        await check_items({ numPoints, step });

        numPoints = 10;
        await updateMathInputValue({
            latex: `${numPoints}`,
            name: "/numPoints",
            core,
        });
        await check_items({ numPoints, step });
    });

    it("new curve from copied vertices, some flipped", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c1" through="(-9,6) (-3,7) (4,0) (8,5)" />
    </graph>
    <graph>
    <curve name="c2" through="$(c1.throughPoints[1]) ($(c1.throughPoints[2][2]),$(c1.throughPoints[2][1])) $(c1.throughPoints[3]) ($(c1.throughPoints[4][2]),$(c1.throughPoints[4][1]))" />
    </graph>
    `,
        });

        async function check_items(ps: number[][]) {
            const psFlipped = ps.map((v, i) =>
                i % 2 === 0 ? v : [v[1], v[0]],
            );

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let c1ps = stateVariables["/c1"].stateValues.throughPoints;
            let c2ps = stateVariables["/c2"].stateValues.throughPoints;
            expect(c1ps.map((v) => v.map((x) => x.tree))).eqls(ps);
            expect(c2ps.map((v) => v.map((x) => x.tree))).eqls(psFlipped);
        }

        let ps = [
            [-9, 6],
            [-3, 7],
            [4, 0],
            [8, 5],
        ];

        await check_items(ps);

        // move first curve points
        let newPs = [
            [7, 2],
            [1, -3],
            [2, 9],
            [-4, -3],
        ];

        for (let [i, p] of newPs.entries()) {
            ps[i] = p;
            await moveThroughPoint({
                name: "/c1",
                throughPointInd: i,
                throughPoint: ps[i],
                core,
            });
            await check_items(ps);
        }

        // move second polyline vertices
        newPs = [
            [-1, 9],
            [7, 5],
            [-8, 1],
            [6, -7],
        ];
        let newPsFlipped = newPs.map((v, i) =>
            i % 2 === 0 ? v : [v[1], v[0]],
        );

        for (let [i, p] of newPs.entries()) {
            ps[i] = p;
            await moveThroughPoint({
                name: "/c2",
                throughPointInd: i,
                throughPoint: newPsFlipped[i],
                core,
            });
            await check_items(ps);
        }
    });

    it("extracting point coordinates of symmetric curve", async () => {
        let core = await createTestCore({
            doenetML: `
    <math hide fixed name="fixed3">3</math>
    <math hide fixed name="fixed4">4</math>
    <point name="P1" hide>(1,2)</point>
    <graph>
      <curve name="c" through="$P1 ($P1.y, $P1.x)" /> 
      <point name="x1" x="$(c.throughPointX1_1)" y="$fixed3" />
      <point name="x2" x="$(c.throughPointX2_1)" y="$fixed4" />
      <point name="y1" y="$(c.throughPointX1_2)" x="$fixed3" />
      <point name="y2" y="$(c.throughPointX2_2)" x="$fixed4" />
    </graph>
    `,
        });

        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/c"].stateValues.throughPoints[0].map(
                    (v) => v.tree,
                ),
            ).eqls([x, y]);
            expect(
                stateVariables["/c"].stateValues.throughPoints[1].map(
                    (v) => v.tree,
                ),
            ).eqls([y, x]);
            expect(stateVariables["/x1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/x2"].stateValues.xs[0].tree).eq(y);
            expect(stateVariables["/y1"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/y2"].stateValues.xs[1].tree).eq(x);
        }

        let x = 1,
            y = 2;

        await check_items(x, y);

        // move x point 1
        x = 3;
        await movePoint({ name: "/x1", x: x, core });
        await check_items(x, y);

        // move x point 2
        y = 4;
        await movePoint({ name: "/x2", x: y, core });
        await check_items(x, y);

        // move y point 1
        y = -6;
        await movePoint({ name: "/y1", y: y, core });
        await check_items(x, y);

        // move y point 2
        x = -8;
        await movePoint({ name: "/y2", y: x, core });
        await check_items(x, y);
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <curve name="A" styleNumber="1" labelIsName through="(0,0) (0,2) (2,0)" />
      <curve name="B" styleNumber="2" labelIsName through="(2,2) (2,4) (4,2)" />
      <curve name="C" styleNumber="5" labelIsName through="(4,4) (4,6) (6,4)" />
    </graph>
    <p name="ADescription">Curve A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    `;

        async function test_items(theme: "dark" | "light") {
            const core = await createTestCore({ doenetML, theme });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/ADescription"].stateValues.text).eq(
                `Curve A is thick ${AColor}.`,
            );
            expect(stateVariables["/BDescription"].stateValues.text).eq(
                `B is a ${BShade} red curve.`,
            );
            expect(stateVariables["/CDescription"].stateValues.text).eq(
                `C is a thin ${CColor} curve.`,
            );
        }

        await test_items("light");
        await test_items("dark");
    });
});
