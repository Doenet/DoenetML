import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { movePoint } from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("BestFitLine tag tests", async () => {
    it("fit line to 4 points", async () => {
        let core = await createTestCore({
            doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point name="P1">(1,2)</point>
        <point name="P2">(1,6)</point>
      
        <point name="P3">(7,3)</point>
        <point name="P4">(7,-1)</point>
      
        <bestFitLine data="$ps" name="l" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let eqTree = me.fromText("y=-0.5x+4.5").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);

        // move points

        await movePoint({ name: "/P1", x: -5, y: -8, core });
        await movePoint({ name: "/P2", x: 3, y: 5, core });
        await movePoint({ name: "/P3", x: -5, y: -10, core });
        await movePoint({ name: "/P4", x: 3, y: 9, core });

        stateVariables = await returnAllStateVariables(core);
        eqTree = me.fromText("y=2x+1").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);
    });

    it("no arguments", async () => {
        let core = await createTestCore({
            doenetML: `
      
      <graph name="g">
        <bestFitLine name="l" />
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.equation.tree).eqls("＿");
        expect(stateVariables["/eq"].stateValues.value.tree).eqls("＿");
    });

    it("fit line to 0 points", async () => {
        let core = await createTestCore({
            doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <bestFitLine data="$ps" name="l" />
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.equation.tree).eqls("＿");
        expect(stateVariables["/eq"].stateValues.value.tree).eqls("＿");
    });

    it("fit line to 1 point", async () => {
        let core = await createTestCore({
            doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point name="P1">(3,4)</point>
        <bestFitLine data="$ps" name="l" />
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.equation.tree).eqls([
            "=",
            "y",
            4,
        ]);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls([
            "=",
            "y",
            4,
        ]);

        // move point
        await movePoint({ name: "/P1", x: -5, y: -8, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.equation.tree).eqls([
            "=",
            "y",
            -8,
        ]);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls([
            "=",
            "y",
            -8,
        ]);
    });

    it("fit line to 2 points, change variables", async () => {
        let core = await createTestCore({
            doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point name="P1">(3,4)</point>
        <point name="P2">(-5,0)</point>
        <bestFitLine data="$ps" name="l" variables="t z" />
      </graph>
       
      $l.equation{assignNames="eq"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let eqTree = me.fromText("z=0.5t+2.5").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);

        // move points to be vertical
        await movePoint({ name: "/P1", x: -5, y: -8, core });

        stateVariables = await returnAllStateVariables(core);
        eqTree = me.fromText("z=-4").tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);

        // move points
        await movePoint({ name: "/P2", x: -4, y: -6, core });
        stateVariables = await returnAllStateVariables(core);
        eqTree = me.fromText("z=2t+2").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);
    });

    it("fit line to points of different dimensions", async () => {
        let core = await createTestCore({
            doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point name="P1">(1,2)</point>
        <point name="P2">(1,6, a)</point>
        <point name="P3">(7,3,3,1,5)</point>
        <point name="P4">(7,-1,5,x)</point>
      
        <bestFitLine data="$ps" name="l" />
      </graph>
      
      $l.equation{assignNames="eq"}

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let eqTree = me.fromText("y=-0.5x+4.5").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);

        // move points

        await movePoint({ name: "/P1", x: -5, y: -8, core });
        await movePoint({ name: "/P2", x: 3, y: 5, core });
        await movePoint({ name: "/P3", x: -5, y: -10, core });
        await movePoint({ name: "/P4", x: 3, y: 9, core });

        stateVariables = await returnAllStateVariables(core);
        eqTree = me.fromText("y=2x+1").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);
    });

    it("fit line to 4 points, ignore non-numerical points", async () => {
        let core = await createTestCore({
            doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point name="P1">(a,b)</point>
        <point name="P2">(1,2)</point>
        <point name="P3">(c,2)</point>
        <point name="P4">(1,6)</point>
        <point name="P5">(1,d)</point>
        <point name="P6">(7,3)</point>
        <point name="P7">(7+f,3+g)</point>
        <point name="P8">(7,-1)</point>
        <point name="P9">(,-1)</point>
      
        <bestFitLine data="$ps" name="l" />
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let eqTree = me.fromText("y=-0.5x+4.5").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);

        // move points

        await movePoint({ name: "/P2", x: -5, y: -8, core });
        await movePoint({ name: "/P4", x: 3, y: 5, core });
        await movePoint({ name: "/P6", x: -5, y: -10, core });
        await movePoint({ name: "/P8", x: 3, y: 9, core });

        stateVariables = await returnAllStateVariables(core);
        eqTree = me.fromText("y=2x+1").simplify().tree;
        expect(stateVariables["/l"].stateValues.equation.tree).eqls(eqTree);
        expect(stateVariables["/eq"].stateValues.value.tree).eqls(eqTree);
    });

    it("rounding", async () => {
        let core = await createTestCore({
            doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point>(1.2345678,2.3456789)</point>
        <point>(1.2345678,6.7891234)</point>
        <point>(7.8912345,3.4567891)</point>
        <point>(7.8912345,-1.2345678)</point>
      
        <bestFitLine data="$ps" name="l" />
        <bestFitLine data="$ps" name="l2" displayDigits="5" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
      <p name="data">data: $l.data</p>
      
      $l2.equation{assignNames="eq2"}
      <p name="data2">data2: $l2.data</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/eq"].stateValues.text).eq(
            "y = -0.519 x + 5.21",
        );
        expect(stateVariables["/data"].stateValues.text).eq(
            "data: ( 1.23, 2.35 ), ( 1.23, 6.79 ), ( 7.89, 3.46 ), ( 7.89, -1.23 )",
        );
        expect(stateVariables["/eq2"].stateValues.text).eq(
            "y = -0.51922 x + 5.2084",
        );
        expect(stateVariables["/data2"].stateValues.text).eq(
            "data2: ( 1.2346, 2.3457 ), ( 1.2346, 6.7891 ), ( 7.8912, 3.4568 ), ( 7.8912, -1.2346 )",
        );
    });
});
