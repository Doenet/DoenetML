import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveButton,
    movePoint,
    clickPoint,
    focusPoint,
    triggerActions,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateValue,
} from "../utils/actions";
import me from "math-expressions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("UpdateValue tag tests", async () => {
    it("incrementing graph of line segments", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="step">20/$count</number>
    <number name="count">2</number>
    <graph>
    <setup><sequence name="s" from="-10" to="10-$step" length="$count" /></setup>
    <repeat name="l" for="$s" valueName="x">
    <lineSegment name="ls" endpoints="($x, sin($x)) ($x+$step, sin($x+$step))" />
    </repeat>
    </graph>
    <updateValue name="uv" target="$count" newValue="2$count" >
      <label>double</label>
    </updateValue>
    `,
        });

        let left = -10;

        let stateVariables = await core.returnAllStateVariables(false, true);

        let count = 2;
        let step = 20 / count;

        expect(
            stateVariables[await resolvePathToNodeIdx("count")].stateValues
                .value,
        ).eq(count);
        expect(
            stateVariables[await resolvePathToNodeIdx("step")].stateValues
                .value,
        ).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }

        // double number
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        count = 4;
        step = 20 / count;

        expect(
            stateVariables[await resolvePathToNodeIdx("count")].stateValues
                .value,
        ).eq(count);
        expect(
            stateVariables[await resolvePathToNodeIdx("step")].stateValues
                .value,
        ).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }

        // double number a second time
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        count = 8;
        step = 20 / count;

        expect(
            stateVariables[await resolvePathToNodeIdx("count")].stateValues
                .value,
        ).eq(count);
        expect(
            stateVariables[await resolvePathToNodeIdx("step")].stateValues
                .value,
        ).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }

        // double number a third time
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        count = 16;
        step = 20 / count;

        expect(
            stateVariables[await resolvePathToNodeIdx("count")].stateValues
                .value,
        ).eq(count);
        expect(
            stateVariables[await resolvePathToNodeIdx("step")].stateValues
                .value,
        ).eq(step);

        for (let ind = 1; ind <= count; ind++) {
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + (ind - 1) * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[0][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + (ind - 1) * step), 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(left + ind * step, 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("l[" + ind + "].ls")
                        ].stateValues.endpoints[1][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(Math.sin(left + ind * step), 1e-12);
        }
    });

    it("update boolean", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue name="uv" target="$b" newValue="not$b" type="boolean" >
      <label>change mind</label>
    </updateValue>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
    });

    // catch bug where componentWithSelectableType wasn't
    // converting strings to booleans correctly
    it("update boolean using string value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue name="setTrue" target="$b" newValue="true" type="boolean" >
      <label>set true</label>
    </updateValue>
    <updateValue name="setFalse" target="$b" newValue="false" type="boolean" >
      <label>set false</label>
    </updateValue>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("setTrue"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("setTrue"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("setFalse"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("setFalse"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("setTrue"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
    });

    it("update number using string value with operator", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n" >1</number>
    <updateValue name="setToSum" target="$n" newValue="1+1" type="number" >
      <label>set to 1+1</label>
    </updateValue>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("setToSum"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
    });

    it("update property", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="P">(1,2)</point>

    <updateValue name="uv1" target="$P.x" newValue="2$(P.x)" >
      <label>double</label>
    </updateValue>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(2,2)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(4,2)");
    });

    async function test_update_component_index_points(
        core,
        resolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(1,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(7,0)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(6,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(7,0)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(6,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(7,0)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(6,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(6,0)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(6,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(6,0)");
    }

    it("update sourceIndex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentType="point" from="$grp" name="col" />
  
    <updateValue name="uv1" target="$col[2].x" newValue="2$(p.x)" />
    <updateValue name="uv2" target="$col[3].x" newValue="2$(p.x)" />
    `,
        });

        await test_update_component_index_points(core, resolvePathToNodeIdx);
    });

    it("update sourceIndex of group", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="grp">
      <point name="p">(3,2)</point>
      ignore me
      <point name="p2">(1,5)</point>
      ignore me too
      <point name="p3">(7,0)</point>
    </group>
    
  
    <updateValue name="uv1" target="$grp[3].x" newValue="2$(grp[1].x)" />
    <updateValue name="uv2" target="$grp[5].x" newValue="2$(grp[1].x)" />
    `,
        });

        await test_update_component_index_points(core, resolvePathToNodeIdx);
    });

    it("update sourceIndex of group with target subnames", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="grp">
      <p name="p1">Number <number name="n">1</number> and point <point name="p">(3,2)</point>.</p>
      <p name="p2">Text <text name="t">hello</text> and line <line name="l" through="(2,3) (1,2)" />.</p>
    </group>
    
    <updateValue name="uv1" target="$grp[1].n" newValue="3" />
    <updateValue name="uv2" target="$grp[1].p.y" newValue="5" />
    <updateValue name="uv3" target="$grp[2].t.value" newValue="bye" type="text" />
    <updateValue name="uv4" target="$grp[2].l.points[2].x" newValue="2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Number 1 and point ( 3, 2 ).");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Text hello and line 0 = x - y + 1.");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Number 3 and point ( 3, 2 ).");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Text hello and line 0 = x - y + 1.");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Number 3 and point ( 3, 5 ).");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Text hello and line 0 = x - y + 1.");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv3"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Number 3 and point ( 3, 5 ).");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Text bye and line 0 = x - y + 1.");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv4"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Number 3 and point ( 3, 5 ).");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Text bye and line 0 = x - 2.");
    });

    it("update propIndex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="p">(3,2,1)</point>
    
    <collect componentTypes="point" target="$grp" name="col" />
  
    <updateValue name="uv1" target="$p.xs[2]" newValue="2$(p.x)" />
    <updateValue name="uv2" target="$p.xs[3]" newValue="2$(p.x)" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,2,1)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,6,1)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,6,1)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,6,6)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,6,6)");
    });

    it("update multiple components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentType="point" from="$grp" name="col" />
  
    <updateValue name="uv1" target="$col.x" newValue="2$(p.x)" />
    <updateValue name="uv2" target="$col.x" newValue="2$(p.x)" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(3,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(1,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(7,0)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(6,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(6,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(6,0)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .latex,
            ),
        ).eq("(12,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .latex,
            ),
        ).eq("(12,5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .latex,
            ),
        ).eq("(12,0)");
    });

    it("update property of property", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <line through="$P $Q" name="l" />
    <point name="P">(1,2)</point>
    <point name="Q">(3,4)</point>

    <updateValue name="uv1" target="$l.point1.x" newValue="2$(P.x)" >
      <label>double</label>
    </updateValue>
    <updateValue name="uv2" target="$l.points[1].x" newValue="2$(P.x)" >
      <label>also double</label>
    </updateValue>
    <updateValue name="uv3" target="$l.points[1]" newValue="(3,7)" >
      <label>set point</label>
    </updateValue>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(2,2)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(4,2)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv3"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(3,7)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(6,7)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .latex,
            ),
        ).eq("(12,7)");
    });

    it("chained updates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="quad" target="$y" newValue="4$y" triggerWith="$trip" simplify />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("quad")].stateValues
                .hidden,
        ).eq(true);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("trip"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("trip"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");
    });

    it("chained updates on multiple sources", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="x">x</math>
    <math name="y">y</math>
    <math name="z">z</math>
    
    <updateValue name="doub" target="$z" newValue="2$z" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="trip" target="$x" newValue="3$x" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="quad" target="$y" newValue="4$y" triggerWith="$doub $trip" simplify />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .latex,
            ),
        ).eq("z");
        expect(
            stateVariables[await resolvePathToNodeIdx("quad")].stateValues
                .hidden,
        ).eq(true);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("trip"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .latex,
            ),
        ).eq("z");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("doub"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .latex,
            ),
        ).eq("2z");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("trip"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("64y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .latex,
            ),
        ).eq("2z");
    });

    it("chained updates, copies don't copy triggers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>n: <number name="n">1</number></p>
    <p>m1: <number name="m1">1</number></p>
    <p>m2: <number name="m2">1</number></p>
    
    <p><updateValue name="uv" target="$n" newValue="$n+1" /></p>
    <p><updateValue name="uv2" extend="$uv" /></p>
    <p><updateValue name="uv3" extend="$uv" /></p>
    <p name="pmacro">$uv</p>
    <updateValue triggerWith="$uv" target="$m1" newValue="$m1+1" />
    <updateValue triggerWith="$uv2" target="$m2" newValue="$m2+1" />
                    
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value,
        ).eq(1);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value,
        ).eq(1);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value,
        ).eq(2);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv3"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value,
        ).eq(2);

        // Note: we expect the macro to trigger the updateValue with triggerWith="$uv"
        // because it doesn't have a name.
        let macroIdx =
            stateVariables[await resolvePathToNodeIdx("pmacro")]
                .activeChildren[0].componentIdx;

        await updateValue({ componentIdx: macroIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value,
        ).eq(2);
    });

    it("update based on trigger", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -4,
            y: 4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: 5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
    });

    it("update triggered when click", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify triggerWhenObjectsClicked="$P" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");

        await clickPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await clickPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
    });

    it("update triggered when object focused", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify triggerWhenObjectsFocused="$P" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");

        await focusPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        await focusPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
    });

    it("update triggered when objects clicked, trigger with unnamed copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <point name="P">(-1,2)</point>
    </setup>
    <graph name="graph1">
      $P
    </graph>
    <graph>
      <point extend="$P" name="P2" />
    </graph>
    <graph>
      <point extend="$P" name="point2" />
    </graph>

    <math name="x">x</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify triggerWhenObjectsClicked="$P" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let PcopyIdx =
            stateVariables[await resolvePathToNodeIdx("graph1")]
                .activeChildren[0].componentIdx;

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);

        // clicking unnamed copy triggers update

        await clickPoint({ componentIdx: PcopyIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        // clicking copy with an assignNames does not trigger update
        await clickPoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        // clicking point with copySource does not trigger update
        await clickPoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");

        // clicking unnamed copy triggers update again
        await clickPoint({ componentIdx: PcopyIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
    });

    it("chained updates based on trigger", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="$y" newValue="4$y" simplify triggerWith="$trip"  />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("quad")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: 4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: 5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");
    });

    it("chained updates based on trigger on same object", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="$x" newValue="4$x" simplify triggerWith="$trip"  />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("quad")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("12x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("12x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: 4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("12x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: 5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("12x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("144x");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("144x");
    });

    it("triggerWhen supersedes chaining", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="$x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="$y" newValue="4$y" simplify triggerWith="$trip" triggerWhen="$(P.x)<0 and $(P.y)<0" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("quad")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: -5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");
    });

    async function test_trigger_set(core, resolvePathToNodeIdx) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("ts"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("ts"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("ts"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(4);
    }

    it("triggerSet", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet name="ts">
      <label>perform updates</label>
      <updateValue target="$b" newValue="not$b" type="boolean" />
      <updateValue target="$hello" newValue="$hello hello" type="text" />
      <updateValue target="$n" newValue="$n+1" type="number" />

    </triggerSet>
    `,
        });

        await test_trigger_set(core, resolvePathToNodeIdx);
    });

    it("triggerSet and chain to updateValue", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet name="ts">
      <label>perform updates</label>
      <updateValue target="$b" newValue="not$b" type="boolean" />
      <updateValue target="$hello" newValue="$hello hello" type="text" />

    </triggerSet>

    <updateValue target="$n" newValue="$n+1" type="number" triggerWith="$ts" />

    `,
        });

        await test_trigger_set(core, resolvePathToNodeIdx);
    });

    it("triggerSet and chain to triggerSet", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet name="ts">
      <label>perform updates</label>
      <updateValue target="$b" newValue="not$b" type="boolean" />
      <updateValue target="$hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet name="ts2" triggerWith="$ts" >
      <label>perform updates</label>
      <updateValue target="$n" newValue="$n+1" type="number"  />
      <updateValue target="$m" newValue="$m-1" type="number"  />
    </triggerSet>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts2")].stateValues
                .hidden,
        ).eq(true);

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("ts"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("ts"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("ts"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(2);
    });

    it("triggerSet based on trigger", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0" >
    <updateValue name="trip" target="$x" newValue="3$x" simplify />
    <updateValue name="quad" target="$y" newValue="4$y" simplify />
  </triggerSet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("trip")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("quad")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: 4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: 5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("3x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("4y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ),
        ).eq("9x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ),
        ).eq("16y");
    });

    it("triggerWhen supersedes chaining for triggerSet", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
      <updateValue target="$b" newValue="not$b" type="boolean" />
      <updateValue target="$hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet name="ts2" triggerWith="$ts1" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>perform updates</label>
      <updateValue target="$n" newValue="$n+1" type="number"  />
      <updateValue target="$m" newValue="$m-1" type="number"  />
    </triggerSet>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts2")].stateValues
                .hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: -5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);
    });

    it("triggerSet supersedes triggerWhen for updateValue children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="$b" newValue="not$b" type="boolean" />
      <updateValue target="$hello" newValue="$hello hello" type="text" />
      <updateValue target="$n" newValue="$n+1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />
    </triggerSet>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: -5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
    });

    it("triggerSet supersedes chaining for updateValue children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
      <updateValue target="$b" newValue="not$b" type="boolean" />
      <updateValue target="$hello" newValue="$hello hello" type="text" />
      <updateValue target="$n" newValue="$n+1" type="number" triggerWith="$uv" />
    </triggerSet>

    <updateValue name="uv" target="$m" newValue="$m-1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("uv")].stateValues.hidden,
        ).eq(true);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: -5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("hello")].stateValues
                .value,
        ).eq(" hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(3);
    });

    it("update value to blank string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="t">something</text>
    <updateValue name="toBlank" type="text" target="$t" newValue="" >
      <label>setToBlank</label>
    </updateValue>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.text,
        ).eq("something");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("toBlank"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.text,
        ).eq("");
    });

    it("updateValue warnings with invalid targets", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number name="n">1</number>
  <p name="p">1</p>
  <line name="l" through="(1,2) (3,4)" />
  <updateValue name="uv1" target='$n.invalid' newValue="1" />
  <updateValue name="uv2" target='$p' newValue="1" />
  <updateValue name="uv3" target='$l.points[1].bad' newValue="1" />
  `,
        });

        // click the update value buttons
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            core,
        });
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv3"),
            core,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(3);

        expect(errorWarnings.warnings[0].message).contain(
            'Invalid target for <updateValue>: cannot find a state variable named "invalid" on a <number>',
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(5);
        expect(errorWarnings.warnings[0].position.start.column).eq(3);
        expect(errorWarnings.warnings[0].position.end.line).eq(5);
        expect(errorWarnings.warnings[0].position.end.column).eq(62);

        expect(errorWarnings.warnings[1].message).contain(
            'Invalid target for <updateValue>: cannot find a state variable named "value" on a <p>',
        );
        expect(errorWarnings.warnings[1].position.start.line).eq(6);
        expect(errorWarnings.warnings[1].position.start.column).eq(3);
        expect(errorWarnings.warnings[1].position.end.line).eq(6);
        expect(errorWarnings.warnings[1].position.end.column).eq(54);

        expect(errorWarnings.warnings[2].message).contain(
            "Invalid target for <updateValue>: cannot find target",
        );
        expect(errorWarnings.warnings[2].position.start.line).eq(7);
        expect(errorWarnings.warnings[2].position.start.column).eq(3);
        expect(errorWarnings.warnings[2].position.end.line).eq(7);
        expect(errorWarnings.warnings[2].position.end.column).eq(68);
    });

    it("math in label", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue target="$b" newValue="not$b" type="boolean" name="update">
      <label>we have <m>\\prod_{i=1}^3 y_i</m></label>
    </updateValue>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("update")].stateValues
                .label,
        ).eq("we have \\(\\prod_{i=1}^3 y_i\\)");
    });

    it("label is name", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b" />
    <updateValue target="$b" newValue="not$b" type="boolean" name="SwapIt" labelIsName />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("SwapIt")].stateValues
                .label,
        ).eq("Swap It");
    });

    it("update essential label value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <updateValue target="$uv.label" newValue="Hello!" type="text" name="uv"  />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("uv")].stateValues.label,
        ).eq("");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("uv")].stateValues.label,
        ).eq("Hello!");
    });

    it("bug fix: no duplicate name error, #1921", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <updateValue name="uv1" target="$vt.coords" newValue="(3,4)"><label>Move tail</label></updateValue>
    <triggerSet name="ts1">
      <label>Move both</label>
      <updateValue target="$vh.coords" newValue="(5,6)" />
      <updateValue target="$vt.coords" newValue="(7,2)" />
    </triggerSet><graph>
      <vector name="v" />
    </graph><point extend="$v.tail" name="vt" /><point extend="$v.head" name="vh" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("uv1")].stateValues.label,
        ).eq("Move tail");
        expect(
            stateVariables[await resolvePathToNodeIdx("ts1")].stateValues.label,
        ).eq("Move both");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("vh")].stateValues
                    .latex,
            ),
        ).eq("(1,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("vt")].stateValues
                    .latex,
            ),
        ).eq("(0,0)");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("vh")].stateValues
                    .latex,
            ),
        ).eq("(4,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("vt")].stateValues
                    .latex,
            ),
        ).eq("(3,4)");

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("ts1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("vh")].stateValues
                    .latex,
            ),
        ).eq("(9,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("vt")].stateValues
                    .latex,
            ),
        ).eq("(7,2)");
    });

    it("updateValue in graph", async () => {
        const doenetMLsnippet = `
    <p>n: <number name="n">1</number></p>
    <graph >
      <updateValue anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1" target="$n" newValue="$n+1"><label>increment</label></updateValue>
      <updateValue name="item2" target="$n" newValue="$n-1"><label>decrement</label></updateValue>
    </graph>
    `;
        // TODO: how to click on the buttons and test if they are disabled?

        await test_in_graph(doenetMLsnippet, moveButton);
    });

    it("handle removed updateValue when shadowing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="sec">
    <group extend="$grp" name="grp2" />

    <setup>
        <group name="grp">
            <p name="p"><boolean name="show">true</boolean></p>

            <conditionalContent name="cc">
                <case condition="$show">
                    <updateValue name="uv" target="$show" type="boolean" newValue="!$show" />
                </case>
            </conditionalContent>

        </group>
    </setup>
    </section>
                    
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.p")].stateValues
                .text,
        ).eq("true");
        expect(
            stateVariables[
                await resolvePathToNodeIdx("sec")
            ].activeChildren.filter((x) => x.componentIdx).length,
        ).eq(3);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("grp2.cc.uv"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.p")].stateValues
                .text,
        ).eq("false");
        expect(
            stateVariables[
                await resolvePathToNodeIdx("sec")
            ].activeChildren.filter((x) => x.componentIdx).length,
        ).eq(2);
    });

    it("buttons can be styled", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinition styleNumber="1" fillColor="green" />
        <styleDefinition styleNumber="2" fillColor="yellow" />
    </setup>

    <updateValue name="uv1" />
    <updateValue name="uv2" styleNumber="2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("uv1")].stateValues
                .selectedStyle.fillColor,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("uv2")].stateValues
                .selectedStyle.fillColor,
        ).eq("yellow");
    });
});
