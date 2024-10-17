import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("UpdateValue tag tests", async () => {
    it("incrementing graph of line segments", async () => {
        let core = await createTestCore({
            doenetML: `
    <number name="step">20/$count</number>
    <number name="count">2</number>
    <graph>
    <map assignNames="l1 l2 l3 l4 l5 l6 l7 l8 l9 l10 l11 l12 l13 l14 l15 l16" >
    <template newNamespace>
    <lineSegment name="ls" endpoints="($x, sin($x)) ($x+$(../step), sin($x+$(../step)))" />
    </template>
    <sources alias="x">
    <sequence from="-10" to="10-$step" length="$count" />
    </sources>
    </map>
    </graph>
    <p></p>
    <updateValue name="uv" target="count" newValue="2$count" >
      <label>double</label>
    </updateValue>
    `,
        });

        let left = -10;

        let stateVariables = await returnAllStateVariables(core);

        let count = 2;
        let step = 20 / count;

        expect(stateVariables["/count"].stateValues.value).eq(count);
        expect(stateVariables["/step"].stateValues.value).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }

        // double number
        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        count = 4;
        step = 20 / count;

        expect(stateVariables["/count"].stateValues.value).eq(count);
        expect(stateVariables["/step"].stateValues.value).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }

        // double number a second time
        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        count = 8;
        step = 20 / count;

        expect(stateVariables["/count"].stateValues.value).eq(count);
        expect(stateVariables["/step"].stateValues.value).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }

        // double number a third time
        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        count = 16;
        step = 20 / count;

        expect(stateVariables["/count"].stateValues.value).eq(count);
        expect(stateVariables["/step"].stateValues.value).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables["/l" + ind + "/ls"].stateValues
                            .endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }
    });

    it("update boolean", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue name="uv" target="b" newValue="not$b" type="boolean" >
      <label>change mind</label>
    </updateValue>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);

        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/b"].stateValues.value).eq(true);

        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/b"].stateValues.value).eq(false);
    });

    // catch bug where componentWithSelectableType wasn't
    // converting strings to booleans correctly
    it("update boolean using string value", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue name="setTrue" target="b" newValue="true" type="boolean" >
      <label>set true</label>
    </updateValue>
    <updateValue name="setFalse" target="b" newValue="false" type="boolean" >
      <label>set false</label>
    </updateValue>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);

        await core.requestAction({
            componentName: "/setTrue",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);

        await core.requestAction({
            componentName: "/setTrue",
            actionName: "updateValuesetTrue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);

        await core.requestAction({
            componentName: "/setFalse",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);

        await core.requestAction({
            componentName: "/setFalse",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);

        await core.requestAction({
            componentName: "/setTrue",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
    });

    it("update number using string value with operator", async () => {
        let core = await createTestCore({
            doenetML: `
    <number name="n" >1</number>
    <updateValue name="setToSum" target="n" newValue="1+1" type="number" >
      <label>set to 1+1</label>
    </updateValue>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await core.requestAction({
            componentName: "/setToSum",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n"].stateValues.value).eq(2);
    });

    it("update property", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="P">(1,2)</point>

    <updateValue name="uv1" target="P" prop="x" newValue="2$(P.x)" >
      <label>double</label>
    </updateValue>
    <updateValue name="uv2" target="P.x" newValue="2$(P.x)" >
      <label>also double</label>
    </updateValue>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(1,2)");

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(2,2)");

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(4,2)");
    });

    async function test_update_component_index_points(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(3,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(1,5)");
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(7,0)");

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(3,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(6,5)");
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(7,0)");

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(3,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(6,5)");
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(7,0)");

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(3,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(6,5)");
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(6,0)");

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(3,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(6,5)");
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(6,0)");
    }

    it("update componentIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentTypes="point" source="grp" name="col" />
  
    <updateValue name="uv1" target="col" prop="x" newValue="2$(p.x)" componentIndex="2" />
    <updateValue name="uv2" target="col[3].x" newValue="2$(p.x)" />
    `,
        });

        await test_update_component_index_points(core);
    });

    it("update componentIndex of group", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="grp">
      <point name="p">(3,2)</point>
      ignore me
      <point name="p2">(1,5)</point>
      ignore me too
      <point name="p3">(7,0)</point>
    </group>
    
  
    <updateValue name="uv1" target="grp" prop="x" newValue="2$(grp[1].x)" componentIndex="3" />
    <updateValue name="uv2" target="grp[5].x" newValue="2$(grp[1].x)" />
    `,
        });

        await test_update_component_index_points(core);
    });

    it("update componentIndex of group with target subnames", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="grp">
      <p name="p1" newNamespace>Number <number name="n">1</number> and point <point name="p">(3,2)</point>.</p>
      <p name="p2" newNamespace>Text <text name="t">hello</text> and line <line name="l" through="(2,3) (1,2)" />.</p>
    </group>
    
    <updateValue name="uv1" target="grp[1]/n" newValue="3" />
    <updateValue name="uv2" target="grp[1]/p.y" newValue="5" />
    <updateValue name="uv3" target="grp[2]/t.value" newValue="bye" type="text" />
    <updateValue name="uv4" target="grp[2]/l.points[2].x" newValue="2" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "Number 1 and point ( 3, 2 ).",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Text hello and line 0 = x - y + 1.",
        );

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "Number 3 and point ( 3, 2 ).",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Text hello and line 0 = x - y + 1.",
        );

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "Number 3 and point ( 3, 5 ).",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Text hello and line 0 = x - y + 1.",
        );

        await core.requestAction({
            componentName: "/uv3",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "Number 3 and point ( 3, 5 ).",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Text bye and line 0 = x - y + 1.",
        );

        await core.requestAction({
            componentName: "/uv4",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "Number 3 and point ( 3, 5 ).",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Text bye and line 0 = x - 2.",
        );
    });

    it("update propIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="p">(3,2,1)</point>
    
    <collect componentTypes="point" target="grp" name="col" />
  
    <updateValue name="uv1" target="p" prop="xs" newValue="2$(p.x)" propIndex="2" />
    <updateValue name="uv2" target="p.xs[3]" newValue="2$(p.x)" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq(
            "(3,2,1)",
        );

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq(
            "(3,6,1)",
        );

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq(
            "(3,6,1)",
        );

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq(
            "(3,6,6)",
        );

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq(
            "(3,6,6)",
        );
    });

    it("update multiple components", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentTypes="point" target="grp" name="col" />
  
    <updateValue name="uv1" target="col" prop="x" newValue="2$(p.x)" />
    <updateValue name="uv2" target="col.x" newValue="2$(p.x)" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(3,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(1,5)");
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(7,0)");

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(6,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(6,5)");
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(6,0)");

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p"].stateValues.latex)).eq("(12,2)");
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq(
            "(12,5)",
        );
        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq(
            "(12,0)",
        );
    });

    it("update property of property", async () => {
        let core = await createTestCore({
            doenetML: `
    <line through="$P $Q" name="l" />
    <point name="P">(1,2)</point>
    <point name="Q">(3,4)</point>

    <updateValue name="uv1" target="l.point1.x" newValue="2$(P.x)" >
      <label>double</label>
    </updateValue>
    <updateValue name="uv2" target="l.points[1].x" newValue="2$(P.x)" >
      <label>also double</label>
    </updateValue>
    <updateValue name="uv3" target="l.points[1]" newValue="(3,7)" >
      <label>set point</label>
    </updateValue>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(1,2)");

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(2,2)");

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(4,2)");

        await core.requestAction({
            componentName: "/uv3",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(3,7)");

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(6,7)");

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/P"].stateValues.latex)).eq("(12,7)");
    });

    it("chained updates", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="quad" target="y" newValue="4$y" triggerWith="trip" simplify />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/trip",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/trip",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");
    });

    it("chained updates on multiple sources", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="x">x</math>
    <math name="y">y</math>
    <math name="z">z</math>
    
    <updateValue name="doub" target="z" newValue="2$z" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="trip" target="x" newValue="3$x" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="quad" target="y" newValue="4$y" triggerWith="doub trip" simplify />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");
        expect(cleanLatex(stateVariables["/z"].stateValues.latex)).eq("z");
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/trip",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");
        expect(cleanLatex(stateVariables["/z"].stateValues.latex)).eq("z");

        await core.requestAction({
            componentName: "/doub",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");
        expect(cleanLatex(stateVariables["/z"].stateValues.latex)).eq("2z");

        await core.requestAction({
            componentName: "/trip",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("64y");
        expect(cleanLatex(stateVariables["/z"].stateValues.latex)).eq("2z");
    });

    it("chained updates, copies don't copy triggers", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <number name="n">1</number></p>
    <p>m1: <number name="m1">1</number></p>
    <p>m2: <number name="m2">1</number></p>
    
    <p><updateValue name="uv" target="n" newValue="$n+1" /></p>
    <p><updateValue name="uv2" copySource="uv" /></p>
    <p><updateValue name="uv3" copySource="uv" /></p>
    <p name="pmacro">$uv</p>
    <updateValue triggerWith="uv" target="m1" newValue="$m1+1" />
    <updateValue triggerWith="uv2" target="m2" newValue="$m2+1" />
                    
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m1"].stateValues.value).eq(1);
        expect(stateVariables["/m2"].stateValues.value).eq(1);

        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m1"].stateValues.value).eq(2);
        expect(stateVariables["/m2"].stateValues.value).eq(1);

        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m1"].stateValues.value).eq(2);
        expect(stateVariables["/m2"].stateValues.value).eq(2);

        await core.requestAction({
            componentName: "/uv3",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(4);
        expect(stateVariables["/m1"].stateValues.value).eq(2);
        expect(stateVariables["/m2"].stateValues.value).eq(2);

        // Note: we expect the macro to trigger the updateValue with triggerWith="uv"
        // because it doesn't have a name.
        let macroName =
            stateVariables["/pmacro"].activeChildren[0].componentName;

        await core.requestAction({
            componentName: macroName,
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(5);
        expect(stateVariables["/m1"].stateValues.value).eq(3);
        expect(stateVariables["/m2"].stateValues.value).eq(2);
    });

    it("update based on trigger", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -4, y: 4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: 5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
    });

    it("update triggered when click", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhenObjectsClicked="P" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");

        await core.requestAction({
            componentName: "/P",
            actionName: "pointClicked",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "pointClicked",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
    });

    it("update triggered when object focused", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhenObjectsFocused="P" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");

        await core.requestAction({
            componentName: "/P",
            actionName: "pointFocused",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        await core.requestAction({
            componentName: "/P",
            actionName: "pointFocused",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
    });

    it("update triggered when objects clicked, trigger with unnamed copies", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <point name="P">(-1,2)</point>
    </setup>
    <graph name="graph1">
      $P
    </graph>
    <graph>
      $P{name="P2"}
    </graph>
    <graph>
      <point copySource="P" name="point2" />
    </graph>

    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhenObjectsClicked="P" />

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let PcopyName =
            stateVariables["/graph1"].activeChildren[0].componentName;

        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);

        // clicking unnamed copy triggers update

        await core.requestAction({
            componentName: PcopyName,
            actionName: "pointClicked",
            args: { name: PcopyName },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        // clicking copy with an assignNames does not trigger update
        await core.requestAction({
            componentName: "/P2",
            actionName: "pointClicked",
            args: { name: "/P2" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        // clicking point with copySource does not trigger update
        await core.requestAction({
            componentName: "/_point2",
            actionName: "pointClicked",
            args: { name: "/_point2" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");

        // clicking unnamed copy triggers update again
        await core.requestAction({
            componentName: PcopyName,
            actionName: "pointClicked",
            args: { name: PcopyName },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
    });

    it("chained updates based on trigger", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="y" newValue="4$y" simplify triggerWith="trip"  />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -3, y: 4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: 5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");
    });

    it("chained updates based on trigger on same object", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="x" newValue="4$x" simplify triggerWith="trip"  />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("12x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("12x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -3, y: 4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("12x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: 5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("12x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("144x");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("144x");
    });

    it("triggerWhen supersedes chaining", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="y" newValue="4$y" simplify triggerWith="trip" triggerWhen="$(P.x)<0 and $(P.y)<0" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");
    });

    async function test_trigger_set(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await core.requestAction({
            componentName: "/ts",
            actionName: "triggerActions",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            componentName: "/ts",
            actionName: "triggerActions",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/ts",
            actionName: "triggerActions",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(
            " hello hello hello",
        );
        expect(stateVariables["/n"].stateValues.value).eq(4);
    }

    it("triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet name="ts">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" />

    </triggerSet>
    `,
        });

        await test_trigger_set(core);
    });

    it("triggerSet and chain to updateValue", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet name="ts">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />

    </triggerSet>

    <updateValue target="n" newValue="$n+1" type="number" triggerWith="ts" />

    `,
        });

        await test_trigger_set(core);
    });

    it("triggerSet and chain to triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet name="ts">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet name="ts2" triggerWith="ts" >
      <label>perform updates</label>
      <updateValue target="n" newValue="$n+1" type="number"  />
      <updateValue target="m" newValue="$m-1" type="number"  />
    </triggerSet>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(5);
        expect(stateVariables["/ts2"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/ts",
            actionName: "triggerActions",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/ts",
            actionName: "triggerActions",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/ts",
            actionName: "triggerActions",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(
            " hello hello hello",
        );
        expect(stateVariables["/n"].stateValues.value).eq(4);
        expect(stateVariables["/m"].stateValues.value).eq(2);
    });

    it("triggerSet based on trigger", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
  </triggerSet>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");
        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -3, y: 4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: 5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");
    });

    it("triggerWhen supersedes chaining for triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet name="ts1" triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet name="ts2" triggerWith="ts1" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>perform updates</label>
      <updateValue target="n" newValue="$n+1" type="number"  />
      <updateValue target="m" newValue="$m-1" type="number"  />
    </triggerSet>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(5);
        expect(stateVariables["/ts1"].stateValues.hidden).eq(true);
        expect(stateVariables["/ts2"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);
    });

    it("triggerSet supersedes triggerWhen for updateValue children", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />
    </triggerSet>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
    });

    it("triggerSet supersedes chaining for updateValue children", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet name="ts" triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWith="uv" />
    </triggerSet>

    <updateValue name="uv" target="m" newValue="$m-1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(5);
        expect(stateVariables["/ts"].stateValues.hidden).eq(true);
        expect(stateVariables["/uv"].stateValues.hidden).eq(true);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: -6, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/P",
            actionName: "movePoint",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);
    });

    it("update value to blank string", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="t">something</text>
    <updateValue name="toBlank" type="text" target="t" newValue="" >
      <label>setToBlank</label>
    </updateValue>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/t"].stateValues.text).eq("something");

        await core.requestAction({
            componentName: "/toBlank",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/t"].stateValues.text).eq("");
    });

    it("updateValue warnings with invalid targets", async () => {
        let core = await createTestCore({
            doenetML: `
  <number name="n">1</number>
  <p name="p">1</p>
  <line name="l" through="(1,2) (3,4)" />
  <updateValue name="uv1" target='n.invalid' newValue="1" />
  <updateValue name="uv2" target='p' newValue="1" />
  <updateValue name="uv3" target='l.points[1].bad' newValue="1" />
  `,
        });

        // click the update value buttons
        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await core.requestAction({
            componentName: "/uv2",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await core.requestAction({
            componentName: "/uv3",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(3);

        expect(errorWarnings.warnings[0].message).contain(
            'Invalid target for <updateValue>: cannot find a state variable named "invalid" on a <number>',
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(60);

        expect(errorWarnings.warnings[1].message).contain(
            'Invalid target for <updateValue>: cannot find a state variable named "value" on a <p>',
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(52);

        expect(errorWarnings.warnings[2].message).contain(
            "Invalid target for <updateValue>: cannot find target",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(7);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(66);
    });

    it("math in label", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue target="b" newValue="not$b" type="boolean" name="update">
      <label>we have <m>\\prod_{i=1}^3 y_i</m></label>
    </updateValue>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/update"].stateValues.label).eq(
            "we have \\(\\prod_{i=1}^3 y_i\\)",
        );
    });

    it("label is name", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue target="b" newValue="not$b" type="boolean" name="SwapIt" labelIsName />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/SwapIt"].stateValues.label).eq("Swap It");
    });

    it("update essential label value", async () => {
        let core = await createTestCore({
            doenetML: `
    <updateValue target="uv.label" newValue="Hello!" type="text" name="uv"  />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/uv"].stateValues.label).eq("");

        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/uv"].stateValues.label).eq("Hello!");
    });

    it("bug fix: no duplicate name error, #1921", async () => {
        let core = await createTestCore({
            doenetML: `
    <updateValue name="uv1" target="v.tail.coords" newValue="(3,4)"><label>Move tail</label></updateValue>
    <triggerSet name="ts1">
      <label>Move both</label>
      <updateValue target="v.head.coords" newValue="(5,6)" />
      <updateValue target="v.tail.coords" newValue="(7,2)" />
    </triggerSet><graph>
      <vector name="v" />
    </graph><copy source="v.tail" assignNames="vt" /><copy source="v.head" assignNames="vh" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/uv1"].stateValues.label).eq("Move tail");
        expect(stateVariables["/ts1"].stateValues.label).eq("Move both");
        expect(cleanLatex(stateVariables["/vh"].stateValues.latex)).eq("(1,0)");
        expect(cleanLatex(stateVariables["/vt"].stateValues.latex)).eq("(0,0)");

        await core.requestAction({
            componentName: "/uv1",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/vh"].stateValues.latex)).eq("(4,4)");
        expect(cleanLatex(stateVariables["/vt"].stateValues.latex)).eq("(3,4)");

        await core.requestAction({
            componentName: "/ts1",
            actionName: "triggerActions",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/vh"].stateValues.latex)).eq("(9,4)");
        expect(cleanLatex(stateVariables["/vt"].stateValues.latex)).eq("(7,2)");
    });

    it("updateValue in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <number name="n">1</number></p>
    <graph >
      <updateValue anchor="$anchorCoords1" name="updateValue1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1" target="n" newValue="$n+1"><label>increment</label></updateValue>
      <updateValue name="updateValue2" target="n" newValue="$n-1"><label>decrement</label></updateValue>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $updateValue1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $updateValue2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathInput name="anchorCoords2" bindValueTo="$updateValue2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $updateValue1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $updateValue2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceInput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceInput>
    </p>
    <p>Change position from anchor 2
    <choiceInput inline name="positionFromAnchor2" bindValueTo="$updateValue2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceInput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$updateValue2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$updateValue2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$updateValue2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$updateValue2.fixLocation" /></p>

    `,
        });

        // TODO: how to click on the buttons and test if they are disabled?

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 3 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 0, 0 )",
        );
        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: upperright",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: center",
        );
        expect(
            stateVariables["/positionFromAnchor1"].stateValues.selectedIndices,
        ).eqls([1]);
        expect(
            stateVariables["/positionFromAnchor2"].stateValues.selectedIndices,
        ).eqls([9]);
        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );
        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: false",
        );
        expect(stateVariables["/pFixed1"].stateValues.text).eq(
            "Fixed 1: false",
        );
        expect(stateVariables["/pFixed2"].stateValues.text).eq(
            "Fixed 2: false",
        );
        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: false",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: false",
        );

        // move updateValues by dragging

        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue1",
            args: { x: -2, y: 3 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue2",
            args: { x: 4, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( -2, 3 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 4, -5 )",
        );

        // move updateValues by entering coordinates

        await updateMathInputValue({
            latex: "(6,7)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(8,9)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 6, 7 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 8, 9 )",
        );

        // change position from anchor
        await core.requestAction({
            componentName: "/positionFromAnchor1",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [4],
            },
            event: null,
        });
        await core.requestAction({
            componentName: "/positionFromAnchor2",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [3],
            },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: lowerleft",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // make not draggable
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: false",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: false",
        );

        // cannot move updateValues by dragging
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue2",
            args: { x: -8, y: -7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 6, 7 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 8, 9 )",
        );

        // make draggable again
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );

        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue2",
            args: { x: -8, y: -7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( -10, -9 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );
        // fix location
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: true",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: true",
        );

        // can change coordinates entering coordinates only for button 1
        await updateMathInputValue({
            latex: "(1,2)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(3,4)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 2 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // cannot move updateValues by dragging
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue1",
            args: { x: 4, y: 6 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue2",
            args: { x: 7, y: 8 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 2 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // can change position from anchor only for button 1
        await core.requestAction({
            componentName: "/positionFromAnchor1",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [7],
            },
            event: null,
        });
        await core.requestAction({
            componentName: "/positionFromAnchor2",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [8],
            },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: top",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute

        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: false",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );

        // make completely fixed

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixed1"].stateValues.text).eq("Fixed 1: true");
        expect(stateVariables["/pFixed2"].stateValues.text).eq("Fixed 2: true");

        // can change coordinates entering coordinates only for button 1
        await updateMathInputValue({
            latex: "(5,6)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(7,8)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 5, 6 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // can change position from anchor only for button 1
        await core.requestAction({
            componentName: "/positionFromAnchor1",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [6],
            },
            event: null,
        });
        await core.requestAction({
            componentName: "/positionFromAnchor2",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [5],
            },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: right",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute only for button 1

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );
    });

    it("handle removed updateValue when shadowing", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="sec">
    <group copySource="grp" name="grp2" newNamespace />

    <setup>
        <group name="grp">
            <p name="p"><boolean name="show">true</boolean></p>

            <conditionalContent>
                <case condition="$show">
                    <updateValue name="uv" target="show" type="boolean" newValue="!$show" />
                </case>
            </conditionalContent>

        </group>
    </setup>
    </section>
                    
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/grp2/p"].stateValues.text).eq("true");
        expect(
            stateVariables["/sec"].activeChildren.filter((x) => x.componentName)
                .length,
        ).eq(3);

        await core.requestAction({
            componentName: "/grp2/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/grp2/p"].stateValues.text).eq("false");
        expect(
            stateVariables["/sec"].activeChildren.filter((x) => x.componentName)
                .length,
        ).eq(2);
    });
});
