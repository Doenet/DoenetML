import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveCircle,
    moveLine,
    movePoint,
    moveVector,
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputImmediateValue,
    updateMathInputValue,
    updateMathInputValueToImmediateValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import me from "math-expressions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function isUndefinedOrInactive(comp) {
    expect(
        comp === undefined || comp.stateValues.isInactiveCompositeReplacement,
    ).eq(true);
}

describe("Extend and references tests", async () => {
    it("extend copies properties", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="false">x</math>
    <math name="math2" modifyIndirectly="true">x</math>
    <math name="a" extend="$math1"/>
    <math name="b" extend="$a"/>
    <math name="c" extend="$math2"/>
    <math name="d" extend="$c"/>
    <point name="point1"><label>A</label>(1,2)</point>
    <point name="e" extend="$point1"/>
    <point name="f" extend="$e"/>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("math1")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("math2")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("point1")].stateValues
                .label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("e")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.label,
        ).eq("A");
    });

    it("extend overwrites properties", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="false">x</math>
    <math name="r1" extend="$math1"/>
    <math name="r2" modifyIndirectly="true" extend="$math1"/>
    <math name="r3" modifyIndirectly="true" extend="$r1"/>
    <math name="r4" extend="$r2"/>
    <math name="r5" extend="$r3"/>
    <math name="r6" extend="$r2" modifyIndirectly="false" />
    <math name="r7" extend="$r3" modifyIndirectly="false" />

    <point labelIsName name="A">(1,2)</point>
    <point name="A2"><label>A</label>(1,2)</point>
    <point name="A3" extend="$A"/>
    <point name="A4" extend="$A2"/>
    <point labelIsName name="B" extend="$A"/>
    <point name="B2" extend="$A"/>
    <point name="B3" extend="$A"><label>B</label></point>
    <point labelIsName name="B4" extend="$A2"/>
    <point name="B5" extend="$A2"/>
    <point name="B6" extend="$A2"><label>B</label></point>
    <point labelIsName name="C" extend="$B"/>
    <point name="C2" extend="$B"/>
    <point name="C3" extend="$B"><label>C</label></point>
    <point labelIsName name="C4" extend="$B2"/>
    <point name="C5" extend="$B2"/>
    <point name="C6" extend="$B2"><label>C</label></point>
    <point labelIsName name="C7" extend="$B3"/>
    <point name="C8" extend="$B3"/>
    <point name="C9" extend="$B3"><label>C</label></point>
    <point labelIsName name="C10" extend="$B4"/>
    <point name="C11" extend="$B4"/>
    <point name="C12" extend="$B4"><label>C</label></point>
    <point labelIsName name="C13" extend="$B5"/>
    <point name="C14" extend="$B5"/>
    <point name="C15" extend="$B5"><label>C</label></point>
    <point labelIsName name="C16" extend="$B6"/>
    <point name="C17" extend="$B6"/>
    <point name="C18" extend="$B6"><label>C</label></point>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("math1")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("r1")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("r2")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r3")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r4")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r5")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r6")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("r7")].stateValues
                .modifyIndirectly,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("A2")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("A3")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("A4")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("B")].stateValues.label,
        ).eq("B");
        expect(
            stateVariables[await resolvePathToNodeIdx("B2")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("B3")].stateValues.label,
        ).eq("B");
        expect(
            stateVariables[await resolvePathToNodeIdx("B4")].stateValues.label,
        ).eq("B4");
        expect(
            stateVariables[await resolvePathToNodeIdx("B5")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("B6")].stateValues.label,
        ).eq("B");
        expect(
            stateVariables[await resolvePathToNodeIdx("C")].stateValues.label,
        ).eq("C");
        expect(
            stateVariables[await resolvePathToNodeIdx("C2")].stateValues.label,
        ).eq("B");
        expect(
            stateVariables[await resolvePathToNodeIdx("C3")].stateValues.label,
        ).eq("C");
        expect(
            stateVariables[await resolvePathToNodeIdx("C4")].stateValues.label,
        ).eq("C4");
        expect(
            stateVariables[await resolvePathToNodeIdx("C5")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("C6")].stateValues.label,
        ).eq("C");
        expect(
            stateVariables[await resolvePathToNodeIdx("C7")].stateValues.label,
        ).eq("C7");
        expect(
            stateVariables[await resolvePathToNodeIdx("C8")].stateValues.label,
        ).eq("B");
        expect(
            stateVariables[await resolvePathToNodeIdx("C9")].stateValues.label,
        ).eq("C");
        expect(
            stateVariables[await resolvePathToNodeIdx("C10")].stateValues.label,
        ).eq("C10");
        expect(
            stateVariables[await resolvePathToNodeIdx("C11")].stateValues.label,
        ).eq("B4");
        expect(
            stateVariables[await resolvePathToNodeIdx("C12")].stateValues.label,
        ).eq("C");
        expect(
            stateVariables[await resolvePathToNodeIdx("C13")].stateValues.label,
        ).eq("C13");
        expect(
            stateVariables[await resolvePathToNodeIdx("C14")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("C15")].stateValues.label,
        ).eq("C");
        expect(
            stateVariables[await resolvePathToNodeIdx("C16")].stateValues.label,
        ).eq("C16");
        expect(
            stateVariables[await resolvePathToNodeIdx("C17")].stateValues.label,
        ).eq("B");
        expect(
            stateVariables[await resolvePathToNodeIdx("C18")].stateValues.label,
        ).eq("C");
    });

    it("extend overwrites properties, decode XML entities", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="3 &gt; 4">x</math>
    <math name="r1" extend="$math1"/>
    <math name="r2" modifyIndirectly="3&lt;4" extend="$math1"/>
    <math name="r3" modifyIndirectly="3&lt;4" extend="$r1"/>
    <math name="r4" extend="$r2"/>
    <math name="r5" extend="$r3"/>
    <math name="r6" extend="$r2" modifyIndirectly="3&gt;4" />
    <math name="r7" extend="$r3" modifyIndirectly="3&gt;4" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("math1")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("r1")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("r2")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r3")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r4")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r5")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r6")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("r7")].stateValues
                .modifyIndirectly,
        ).eq(false);
    });

    async function check_copy_props(
        core,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.hidden,
        ).eq(true);
        // modifyIndirectly attribute is copied (as it has propagateToProps=true)
        expect(
            stateVariables[await resolvePathToNodeIdx("mr")].stateValues
                .modifyIndirectly,
        ).eq(false);
        // hide attribute is not copied (default behavior)
        expect(
            stateVariables[await resolvePathToNodeIdx("mr")].stateValues.hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("mr")].stateValues.value,
        ).eq(false);

        // modifyIndirectly is overwritten
        expect(
            stateVariables[await resolvePathToNodeIdx("mr2")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mr2")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("mr2")].stateValues.value,
        ).eq(false);

        // modifyIndirectly attribute is copied (as it has propagateToProps=true)
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt")].stateValues
                .modifyIndirectly,
        ).eq(false);
        // hide attribute is not copied (default behavior)
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt")].stateValues
                .value,
        ).eq("text");

        expect(
            stateVariables[await resolvePathToNodeIdx("frmt2")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt2")].stateValues
                .value,
        ).eq("text");

        // all attributes copied when don't use prop
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt3")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt3")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("frmt3")].stateValues
                .hidden,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("cA")].stateValues.value
                .tree,
        ).eqls(["vector", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("l")].stateValues.value,
        ).eq("\\left( 1, 2 \\right)");
        expect(
            stateVariables[await resolvePathToNodeIdx("l")].stateValues
                .modifyIndirectly,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("lmr")].stateValues.value,
        ).eq("\\left( 1, 2 \\right)");
        expect(
            stateVariables[await resolvePathToNodeIdx("lmr")].stateValues
                .modifyIndirectly,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("A2")].stateValues.label,
        ).eq("A");
        expect(
            stateVariables[await resolvePathToNodeIdx("cA2")].stateValues.value
                .tree,
        ).eqls(["vector", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("l2")].stateValues.value,
        ).eq("\\left( 1, 2 \\right)");
    }

    it("extend props, dot notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="x" modifyIndirectly="false" hide>x</math>
    <boolean name="mr" extend="$x.modifyIndirectly"/>
    <boolean name="mr2" modifyIndirectly="true" extend="$x.modifyIndirectly"/>

    <text name="frmt" extend="$x.format"/>
    <text name="frmt2" extend="$x.format" hide />
    <text name="frmt3" hide extend="$frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <coords name="cA" extend="$A.coords"/>
    <text name="l" extend="$cA.latex"/>
    <text name="lmr" modifyIndirectly="false" extend="$cA.latex"/>
    <point name="A2" extend="$A"/>
    <coords name="cA2" extend="$A2.coords"/>
    <text name="l2" extend="$cA2.latex"/>
    `,
        });

        await check_copy_props(core, resolvePathToNodeIdx);
    });

    async function test_copy_prop_updatable(
        core,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(x, y) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .xs[1].tree,
            ).eq(y);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .xs[1].tree,
            ).eq(y);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .xs[0].tree,
            ).eq(y);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .xs[1].tree,
            ).eq(x);
        }

        let x = 1,
            y = 2;

        // initial position
        await check_items(x, y);

        // move point 1
        x = -3;
        y = 5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p1"),
            x,
            y,
            core,
        });
        await check_items(x, y);

        // move point 2
        x = 6;
        y = -9;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p2"),
            x,
            y,
            core,
        });
        await check_items(x, y);

        // move point 3
        x = -7;
        y = -2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p3"),
            x: y,
            y: x,
            core,
        });
        await check_items(x, y);
    }

    it("extend props of extend still updatable, dot notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <point name="p2" extend="$p1"/>
      <point name="p3">
        (<math extend="$p2.y"/>,
        <math extend="$p2.x1"/>)
      </point>
    </graph>
    <point extend="$p1" name="p1a" />
    <point extend="$p2" name="p2a" />
    <point extend="$p3" name="p3a" />
    `,
        });

        await test_copy_prop_updatable(core, resolvePathToNodeIdx);
    });

    async function test_copy_prop_shadows_source(
        core,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        // initial positions
        let displacement = [-4, 2];
        let v_tail = [1, 1];
        let d_tail = [0, 0];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 1
        displacement = [3, 1];
        v_tail = [-1, 4];
        d_tail = [0, 0];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: v_tail,
            headcoords: v_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 2
        displacement = [5, -2];
        v_tail = [-1, 4];
        d_tail = [3, -7];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            componentIdx: await resolvePathToNodeIdx("d1"),
            tailcoords: d_tail,
            headcoords: d_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 3
        displacement = [-3, 6];
        v_tail = [-1, 4];
        d_tail = [4, -2];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            componentIdx: await resolvePathToNodeIdx("d2"),
            tailcoords: d_tail,
            headcoords: d_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 1
        displacement = [5, 0];
        v_tail = [-8, 6];
        d_tail = [4, -2];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: v_tail,
            headcoords: v_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("vector1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.tail.map((x) => x.tree),
        ).eqls(d_tail);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.head.map((x) => x.tree),
        ).eqls(d_head);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
    }

    it("extend of prop extend shadows source, dot notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <vector name="vector1" displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
      <vector name="d1" extend="$vector1.displacement"/>
    </graph>
  
    <graph>
      <vector extend="$d1" name="d2" />
    </graph>

    <vector extend="$vector1" name="v1a" />
    `,
        });

        await test_copy_prop_shadows_source(core, resolvePathToNodeIdx);
    });

    async function test_property_children_replacement_changes(
        core,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(list: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p1")
                ].stateValues.text.trim(),
            ).eq(list);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p2")
                ].stateValues.text.trim(),
            ).eq(list);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p3")
                ].stateValues.text.trim(),
            ).eq(list);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p4")
                ].stateValues.text.trim(),
            ).eq(list);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p5")
                ].stateValues.text.trim(),
            ).eq(list);
        }

        await check_items("");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await check_items("a, b");

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await check_items("a, b, c, d, e");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await check_items("a");

        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await check_items("a, b, c, d, e, f");
    }

    it("property children account for replacement changes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" />

    <p name="p1">
      <asList name="al1">
        <sequence type="letters" from="a" length="$mi" />
      </asList>
    </p>
    
    <p name="p2"><asList name="al2" extend="$al1"/></p>

    <p name="p3" extend="$p1"/>

    <p name="p4" ><asList extend="$al2"/></p>

    <p extend="$p3" name="p5"/>

    `,
        });

        await test_property_children_replacement_changes(
            core,
            resolvePathToNodeIdx,
        );
    });

    // TODO: do we care about how these behave differently now?
    it.skip("copy macros", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a=<mathInput name="a" prefill="5" /></p>
    <p>b=<mathInput name="b" prefill="2" /></p>
    <p>c=<mathInput name="c" prefill="3" /></p>

    <p><m name="orig">ax^2+bx+c = <math name="s">$a x^2 + $b x + $c</math></m></p>
    <p><m name="single">ax^2+bx+c = $s</m></p>
    <p><m name="double">ax^2+bx+c = $$s</m></p>
    <p><m name="triple">ax^2+bx+c = $$$s</m></p>
    <p><m extend="$orig" name="singlem" /></p>
    <p name="doublem">$$orig</p>
    <p name="triplem">$$$orig</p>

    `,
        });

        async function check_items(a, b, c) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let polyLatex = `${a}x^{2}+${b}x+${c}`;

            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("orig")]
                        .stateValues.latex,
                ),
            ).eq(`ax^2+bx+c=${polyLatex}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("single")]
                        .stateValues.latex,
                ),
            ).eq(`ax^2+bx+c=${polyLatex}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("double")]
                        .stateValues.latex,
                ),
            ).eq(`ax^2+bx+c=$$s`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("triple")]
                        .stateValues.latex,
                ),
            ).eq(`ax^2+bx+c=$$$s`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("singlem")]
                        .stateValues.latex,
                ),
            ).eq(`ax^2+bx+c=${polyLatex}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("doublem")]
                    .stateValues.text,
            ).eq(`$$orig`);
            expect(
                stateVariables[await resolvePathToNodeIdx("triplem")]
                    .stateValues.text,
            ).eq(`$$$orig`);
        }

        await check_items(5, 2, 3);

        // Enter new numbers
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("c"),
            core,
        });
        await check_items(9, 6, 7);
    });

    // TODO: do we care about how these behave differently now?
    it.skip("macros after failed double macro", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="t">hi</text>
    <text name="u">bye</text>
    <p name="p1">$t, $$t, $ $u,
    $t, $$u, $u</p>
    <p name="p2">$u, $$t(, $t,
    $u, $$u, $t</p>
    <p name="p3">$t, $$$t, $5, $u, $$5, $t, $$$5, $u</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("hi, $$t, $ bye,\n    hi, $$u, bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("bye, $$t(, hi,\n    bye, $$u, hi");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("hi, $$$t, $5, bye, $$5, hi, $$$5, bye");
    });

    async function test_copy_not_ignore_hide(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Hidden by default: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("Hidden by default 2: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("Force to reveal: secret");
    }

    it("copy does not ignore hide by default, with copySource", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1">Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="p2">Hidden by default: <text extend="$hidden" /></p>
    <p name="p3">Hidden by default 2: $hidden</p>
    <p name="p4">Force to reveal: <text extend="$hidden" hide="false" /></p>

    `,
        });

        await test_copy_not_ignore_hide(core, resolvePathToNodeIdx);
    });

    async function test_copy_hidden_children(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theP")].stateValues.text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pHidden")].stateValues
                .text,
        ).eq("Hidden: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pHiddenA")].stateValues
                .text,
        ).eq("Hidden A: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pReveal")].stateValues
                .text,
        ).eq("Revealed: secret");
        expect(
            stateVariables[await resolvePathToNodeIdx("theP2")].stateValues
                .text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pHidden2")].stateValues
                .text,
        ).eq("Hidden 2: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pHidden2A")].stateValues
                .text,
        ).eq("Hidden 2A: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pReveal2")].stateValues
                .text,
        ).eq("Revealed 2: secret");
        expect(
            stateVariables[await resolvePathToNodeIdx("theP4")].stateValues
                .text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pHidden4")].stateValues
                .text,
        ).eq("Hidden 4: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pHidden4A")].stateValues
                .text,
        ).eq("Hidden 4A: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pReveal4")].stateValues
                .text,
        ).eq("Revealed 4: secret");
    }

    it("extend keeps hidden children hidden", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="theP">Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pHidden">Hidden: <text extend="$theP.hidden" /></p>
    <p name="pHiddenA">Hidden A: $theP.hidden</p>
    <p name="pReveal">Revealed: <text extend="$theP.hidden" hide="false" /></p>
    <p extend="$theP" name="theP2" />
    <p name="pHidden2">Hidden 2: <text extend="$theP2.hidden" /></p>
    <p name="pHidden2A">Hidden 2A: $theP2.hidden</p>
    <p name="pReveal2">Revealed 2: <text extend="$theP2.hidden" hide="false" /></p>
    <p extend="$theP" name="theP4" hide="false" />
    <p name="pHidden4">Hidden 4: <text extend="$theP4.hidden" /></p>
    <p name="pHidden4A">Hidden 4A: $theP4.hidden</p>
    <p name="pReveal4">Revealed 4: <text extend="$theP4.hidden" hide="false" /></p>

    `,
        });

        await test_copy_hidden_children(core, resolvePathToNodeIdx);
    });

    async function test_copy_hides_dynamically(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("copy 1: hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.text,
        ).eq("copy 2: ");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("copy 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.text,
        ).eq("copy 2: hello");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("copy 1: hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.text,
        ).eq("copy 2: ");
    }

    it("extends hide dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="source">hello</text>

    <booleanInput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleanInput>

    <p name="c1">copy 1: <text hide="$h1" extend="$source" /></p>
    <p name="c2">copy 2: <text hide="$h2" extend="$source" /></p>
    `,
        });

        await test_copy_hides_dynamically(core, resolvePathToNodeIdx);
    });

    async function test_copy_change_away_copy(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("forVerb")].stateValues
                .text,
        ).eq("jump");
        expect(
            stateVariables[await resolvePathToNodeIdx("verb2")].stateValues
                .text,
        ).eq("jump");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("forVerb")].stateValues
                .text,
        ).eq("skip");
        expect(
            stateVariables[await resolvePathToNodeIdx("verb2")].stateValues
                .text,
        ).eq("skip");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("forVerb")].stateValues
                .text,
        ).eq("jump");
        expect(
            stateVariables[await resolvePathToNodeIdx("verb2")].stateValues
                .text,
        ).eq("jump");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("forVerb")].stateValues
                .text,
        ).eq("skip");
        expect(
            stateVariables[await resolvePathToNodeIdx("verb2")].stateValues
                .text,
        ).eq("skip");
    }

    it("extend of component that changes between a text and a copy", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="b" />
    
    <setup>
      <text name="jump">jump</text>
    </setup>

    <p name="forVerb"><conditionalContent name="cc">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <text extend="$cc" name="verb2" />
    `,
        });

        await test_copy_change_away_copy(core, resolvePathToNodeIdx);
    });

    it("copy of invalid source gives math in boolean and math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="p1">We can't see $invalid in paragraph <text>or $invisible in text</text>.</p>

<p>In math, we can: <math name="m1">$bad + $nothing</math></p>

<p>And in boolean as well: <boolean name="b1">not ($missing = x)</boolean></p>.

`,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("We can't see  in paragraph or  in text.");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", "＿", "＿"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
    });

    it("copy of repeat item maintained when withheld", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="n" /></p>

    <graph name='g1'>
      <repeatForSequence name="r" from="1" to="$n" valueName="i">
          <point name="A">
            (<number copy="$i" />,1)
          </point>
      </repeatForSequence>
    </graph>
    
    <p><m name="m1">A_1 = <math extend="$r[1].A" displayDigits="3" /></m></p>
    <p><m name="m2">A_2 = <math extend="$r[2].A" displayDigits="3" /></m></p>
    
    `,
        });

        async function check_items(A1latex: string, A2latex: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                        .latex,
                ),
            ).eq(`A_1=${A1latex}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                        .latex,
                ),
            ).eq(`A_2=${A2latex}`);
        }

        let A1 = [1, 1],
            A2 = [2, 1];

        await check_items("＿", "＿");

        // Add point

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items(`(${A1.join(",")})`, "＿");

        // Move point
        A1 = [-3, 7];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[1].A"),
            x: A1[0],
            y: A1[1],
            core,
        });

        await check_items(`(${A1.join(",")})`, "＿");

        // Remove point
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("＿", "＿");

        // Remember coordinates when restore point since copy was maintained
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items(`(${A1.join(",")})`, "＿");

        // Add second point
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);

        // Move second point
        A2 = [5, -4];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[2].A"),
            x: A2[0],
            y: A2[1],
            core,
        });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);

        // Remove both points
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("＿", "＿");

        // Remember coordinates of both points
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);
    });

    it("trim whitespace off extend", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="hi">Hello</text>
    <p name="p1"><text extend=" $hi  " /> there</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hi")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hello there");
    });

    async function test_copy_group_with_numbers(
        core,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n1")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("n2")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("n3")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1.n1")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1.n2")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1.n3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2.n1")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2.n2")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2.n3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2a.n1")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2a.n2")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2a.n3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("section1.p2.n1")]
                .stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("section1.p2.n2")]
                .stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("section1.p2.n3")]
                .stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("s1a.p2.n1")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("s1a.p2.n2")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("s1a.p2.n3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("values: 1 2 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2a")].stateValues.text,
        ).eq("values: 1 2 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("section1.p2")]
                .stateValues.text,
        ).eq("values: 1 2 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("s1a.p2")].stateValues
                .text,
        ).eq("values: 1 2 3");

        expect(
            stateVariables[
                await resolvePathToNodeIdx("section1")
            ].activeChildren.map((x) => x.componentIdx),
        ).eqls([await resolvePathToNodeIdx("p2")]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("s1a")
            ].activeChildren.map((x) => x.componentType),
        ).eqls(["p"]);

        let refp2 =
            stateVariables[await resolvePathToNodeIdx("doc")].activeChildren[4]
                .componentIdx;

        let refsection1 =
            stateVariables[await resolvePathToNodeIdx("doc")].activeChildren[8]
                .componentIdx;

        expect(stateVariables[refp2].stateValues.text).eq("values: 1 2 3");

        expect(
            stateVariables[refsection1].activeChildren.map(
                (x) => x.componentType,
            ),
        ).eqls(["p"]);

        let refp2ChildIndices = stateVariables[refp2].activeChildren
            .filter((x) => x.componentIdx != null)
            .map((x) => x.componentIdx);
        expect(stateVariables[refp2ChildIndices[0]].stateValues.value).eq(1);
        expect(stateVariables[refp2ChildIndices[1]].stateValues.value).eq(2);
        expect(stateVariables[refp2ChildIndices[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let refsection1ChildIndices = stateVariables[
            refsection1
        ].activeChildren.filter((x) => x.componentIdx != null)[0].componentIdx;
        let c7sGrandChildIndices = stateVariables[
            refsection1ChildIndices
        ].activeChildren
            .filter((x) => x.componentIdx != null)
            .map((x) => x.componentIdx);

        expect(stateVariables[c7sGrandChildIndices[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildIndices[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildIndices[2]].stateValues.value).eq(3);
    }

    it("references retains original names, even with group", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <document name="doc">
      <p name="p1">values: <group name="grp"><number name="n1">1</number> <number name="n2">2</number></group> <number name="n3">3</number></p>
      
      <section name="section1"><p extend="$p1" name="p2" /></section>
      
      $p2
      <p extend="$p2" name="p2a" />

      
      $section1
      <section extend="$section1" name="s1a" />

    </document>
    `,
        });

        await test_copy_group_with_numbers(core, resolvePathToNodeIdx);
    });

    it("references retains original names, even with group, wrapped in nested groups and copied with variable index", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  <group name="outergrp">
    <group name="g1">
      <p name="p1">values: <group name="grp"><number name="n1">1</number> <number name="n2">2</number></group> <number name="n3">3</number></p>
      
      <section name="section1"><p extend="$p1" name="p2" /></section>
      
      <p extend="$p2" name="p2a" />

      <section extend="$section1" name="s1a" />
      
    </group>
    <group name="g2">
      <p name="p1">values: <group name="grp"><number name="n1">4</number> <number name="n2">5</number></group> <number name="n3">6</number></p>

      <section name="section1"><p extend="$p1" name="p2" /></section>
      
      <p extend="$p2" name="p2a" />

      <section extend="$section1" name="s1a" />
      
    </group>
  </group>

  <group extend="$outergrp[$n]" name="thegrp" />


    `,
        });

        async function test_group(
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            name_prefix: string,
            n1: number,
            n2: number,
            n3: number,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx(`${name_prefix}.n1`)]
                    .stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`${name_prefix}.n2`)]
                    .stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[await resolvePathToNodeIdx(`${name_prefix}.n3`)]
                    .stateValues.value,
            ).eq(n3);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.p2.n1`)
                ].stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.p2.n2`)
                ].stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.p2.n3`)
                ].stateValues.value,
            ).eq(n3);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.p2a.n1`)
                ].stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.p2a.n2`)
                ].stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.p2a.n3`)
                ].stateValues.value,
            ).eq(n3);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.section1.p2.n1`)
                ].stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.section1.p2.n2`)
                ].stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.section1.p2.n3`)
                ].stateValues.value,
            ).eq(n3);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.s1a.p2.n1`)
                ].stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.s1a.p2.n2`)
                ].stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.s1a.p2.n3`)
                ].stateValues.value,
            ).eq(n3);

            expect(
                stateVariables[await resolvePathToNodeIdx(`${name_prefix}.p1`)]
                    .stateValues.text,
            ).eq(`values: ${n1} ${n2} ${n3}`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`${name_prefix}.p2`)]
                    .stateValues.text,
            ).eq(`values: ${n1} ${n2} ${n3}`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`${name_prefix}.p2a`)]
                    .stateValues.text,
            ).eq(`values: ${n1} ${n2} ${n3}`);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.s1a.p2`)
                ].stateValues.text,
            ).eq(`values: ${n1} ${n2} ${n3}`);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.section1`)
                ].activeChildren.map((x) => x.componentIdx),
            ).eqls([await resolvePathToNodeIdx(`${name_prefix}.p2`)]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${name_prefix}.s1a`)
                ].activeChildren.map((x) => x.componentIdx),
            ).eqls([await resolvePathToNodeIdx(`${name_prefix}.s1a.p2`)]);
        }

        // check g1

        await test_group(resolvePathToNodeIdx, "g1", 1, 2, 3);

        // check g2

        await test_group(resolvePathToNodeIdx, "g2", 4, 5, 6);

        // check thegrp
        await test_group(resolvePathToNodeIdx, "thegrp", 1, 2, 3);

        // Change index for thegrp
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await test_group(resolvePathToNodeIdx, "thegrp", 4, 5, 6);

        // Change to invalid index for thegrp
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        let stateVariable = await core.returnAllStateVariables(false, true);

        expect(stateVariable["thegrp"]).eq(undefined);

        // Change back to index 1 for thegrp
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await test_group(resolvePathToNodeIdx, "thegrp", 1, 2, 3);
    });

    it("copy group of groups retains name", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <group name="grp"><number name="num1">1</number> <number name="num2">2</number> <group name="group1"><number name="num3">3</number><number name="num4">4</number><group><number name="num5">5</number><number name="num6">6</number></group></group></group>

      <group extend="$grp" name="grp2" />
      
      <group extend="$grp2" name="grp3" />

      <group extend="$grp2.group1" name="grp4" />
      <group extend="$grp3.group1" name="grp5" />

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("grp.num1")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp.num2")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp.num3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp.num4")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp.num5")].stateValues
                .value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp.num6")].stateValues
                .value,
        ).eq(6);

        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.num1")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.num2")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.num3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.num4")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.num5")].stateValues
                .value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp2.num6")].stateValues
                .value,
        ).eq(6);

        expect(
            stateVariables[await resolvePathToNodeIdx("grp3.num1")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp3.num2")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp3.num3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp3.num4")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp3.num5")].stateValues
                .value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp3.num6")].stateValues
                .value,
        ).eq(6);

        expect(
            stateVariables[await resolvePathToNodeIdx("grp4.num3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp4.num4")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp4.num5")].stateValues
                .value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp4.num6")].stateValues
                .value,
        ).eq(6);

        expect(
            stateVariables[await resolvePathToNodeIdx("grp5.num3")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp5.num4")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp5.num5")].stateValues
                .value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("grp5.num6")].stateValues
                .value,
        ).eq(6);
    });

    async function test_copy_component_index(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        force_values: boolean,
    ) {
        async function check_items({
            x1,
            y1,
            x2,
            y2,
            comp,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            comp?: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("A")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("B")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls([x2, y2]);

            if (comp === 1 || comp === 2) {
                let xc = comp === 1 ? x1 : x2;
                let yc = comp === 1 ? y1 : y2;

                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("A2")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls([xc, yc]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("g3.A2")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls([xc, yc]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("Ax")].stateValues
                        .value.tree,
                ).eq(xc);
                expect(
                    stateVariables[await resolvePathToNodeIdx("al2.Ax")]
                        .stateValues.value.tree,
                ).eq(xc);
            } else if (force_values) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("Ax")].stateValues
                        .value.tree,
                ).eq("\uff3f");
                expect(
                    stateVariables[await resolvePathToNodeIdx("al2.Ax")]
                        .stateValues.value.tree,
                ).eq("\uff3f");
            } else {
                expect(stateVariables[await resolvePathToNodeIdx("A2")]).eq(
                    undefined,
                );
                expect(stateVariables[await resolvePathToNodeIdx("g3.A2")]).eq(
                    undefined,
                );
                expect(stateVariables[await resolvePathToNodeIdx("Ax")]).eq(
                    undefined,
                );
                expect(stateVariables[await resolvePathToNodeIdx("al2.Ax")]).eq(
                    undefined,
                );
            }
        }

        let x1 = 1,
            y1 = 2,
            x2 = 3,
            y2 = 4;

        await check_items({ x1, y1, x2, y2 });

        // restrict collection to first component

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items({ x1, y1, x2, y2, comp: 1 });

        // move copied point
        x1 = 9;
        y1 = -5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A2"),
            x: x1,
            y: y1,
            core,
        });

        await check_items({ x1, y1, x2, y2, comp: 1 });

        // restrict collection to second component

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items({ x1, y1, x2, y2, comp: 2 });

        // move double copied point
        x2 = 0;
        y2 = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: x2,
            y: y2,
            core,
        });

        await check_items({ x1, y1, x2, y2, comp: 2 });
    }

    it("copy sourceIndex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentType="point" from="$g1" />
    </graph>
    
    <graph name="g2">
      <point extend="$col[$n]" name="A2" />
    </graph>
  
    <graph extend="$g2" name="g3" />
  
    <asList name="al"><math extend="$col[$n].x" name="Ax" /></asList>
  
    <asList extend="$al" name="al2" />

    `,
        });

        await test_copy_component_index(core, resolvePathToNodeIdx, true);
    });

    async function test_copy_prop_component_index(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        force_values: boolean,
    ) {
        async function check_items({
            x1,
            y1,
            x2,
            y2,
            propIndex,
            sourceIndex,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            propIndex?: number;
            sourceIndex?: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("A")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("B")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls([x2, y2]);

            if (
                (propIndex === 1 || propIndex === 2) &&
                (sourceIndex === 1 || sourceIndex === 2)
            ) {
                let x: number;
                if (propIndex === 1) {
                    if (sourceIndex === 1) {
                        x = x1;
                    } else {
                        x = x2;
                    }
                } else {
                    if (sourceIndex === 1) {
                        x = y1;
                    } else {
                        x = y2;
                    }
                }

                expect(
                    stateVariables[await resolvePathToNodeIdx("n1")].stateValues
                        .value.tree,
                ).eq(x);
                expect(
                    stateVariables[await resolvePathToNodeIdx("al2.n1")]
                        .stateValues.value.tree,
                ).eq(x);
            } else if (force_values) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("n1")].stateValues
                        .value.tree,
                ).eq("\uff3f");
                expect(
                    stateVariables[await resolvePathToNodeIdx("al2.n1")]
                        .stateValues.value.tree,
                ).eq("\uff3f");
            } else {
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("n1")],
                );
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("al2.n1")],
                );
            }
        }

        let x1 = 1,
            y1 = 2,
            x2 = 3,
            y2 = 4;

        let sourceIndex: undefined | number;
        let propIndex: undefined | number;

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set propIndex to 1
        propIndex = 1;
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // move point 1
        x1 = 9;
        y1 = -5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: x1,
            y: y1,
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 2
        sourceIndex = 2;
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // move point2
        x2 = 0;
        y2 = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: x2,
            y: y2,
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set propIndex to 2
        propIndex = 2;
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 1
        sourceIndex = 1;
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set propIndex to 3
        propIndex = 3;
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set propIndex to 1
        propIndex = 1;
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 3
        sourceIndex = 3;
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 2
        sourceIndex = 2;
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });

        // clear propIndex
        propIndex = undefined;
        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });
    }

    it("copy propIndex and index", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>m: <mathInput name="m" /></p>
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentType="point" from="$g1" />
    </graph>
  
    
    <p><asList name="al"><math extend="$col[$m].xs[$n]" name="n1" /></asList></p>

    <p><asList extend="$al" name="al2" /></p>

    `,
        });

        await test_copy_prop_component_index(core, resolvePathToNodeIdx, true);
    });

    it("fixed and fixLocation are propagated from shadow source, even with prop", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point fixed fixLocation name="P" />

    <p name="p1">$P$P.x<point extend="$P" name="P2" /><math extend="$P.x" name="Px" /></p>
    <p name="p2">$P.fixed $P2.fixed $Px.fixed</p>
    <p name="p3">$P.fixLocation $P2.fixLocation $Px.fixLocation</p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const Pref =
            stateVariables[await resolvePathToNodeIdx("p1")].activeChildren[0]
                .componentIdx;
        const Pxref =
            stateVariables[await resolvePathToNodeIdx("p1")].activeChildren[1]
                .componentIdx;

        expect(stateVariables[Pref].stateValues.fixed).eq(true);
        expect(stateVariables[Pref].stateValues.fixLocation).eq(true);
        expect(stateVariables[Pxref].stateValues.fixed).eq(true);
        expect(stateVariables[Pxref].stateValues.fixLocation).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P2")].stateValues.fixed,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                .fixLocation,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("Px")].stateValues.fixed,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("Px")].stateValues
                .fixLocation,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("true true true");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("true true true");
    });

    it("extending repetitively", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    <math extend="$g1.P.x" name="P1x" />
    <graph name="g2">
      <point name="P">(3,4)</point>
    </graph>
    <math extend="$g2.P.x" name="P2x" />
    <graph name="g3">
      <point extend="$g1.P" name="Pa" />
    </graph>
    <graph name="g4">
      <point extend="$g2.P" name="Pa" />
    </graph>
    <graph extend="$g1" name="g5" />
    <graph extend="$g2" name="g6" />
    <graph extend="$g3" name="g7" />
    <graph extend="$g4" name="g8" />

    <graph extend="$g5" name="g9" />
    <graph extend="$g6" name="g10" />
    <graph extend="$g7" name="g11" />
    <graph extend="$g8" name="g12" />
  

    `,
        });

        async function check_points(P1, P2) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g3.Pa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g4.Pa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P2);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g5.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g6.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g7.Pa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g8.Pa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g9.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g10.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g11.Pa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g12.Pa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P2);
        }

        let P1 = [1, 2];
        let P2 = [3, 4];

        await check_points(P1, P2);

        // move P1 to (4,5)

        P1 = [4, 5];

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.P"),
            x: P1[0],
            y: P1[1],
            core,
        });

        await check_points(P1, P2);

        // move P2 to (7,0)
        P2 = [7, 0];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.P"),
            x: P2[0],
            y: P2[1],
            core,
        });

        await check_points(P1, P2);

        // move P1 via Pa to (2,9)
        P1 = [2, 0];

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.Pa"),
            x: P1[0],
            y: P1[1],
            core,
        });

        await check_points(P1, P2);

        // move P2 via graph 4's Pa to (8, 6)
        P2 = [8, 6];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.Pa"),
            x: P2[0],
            y: P2[1],
            core,
        });

        await check_points(P1, P2);
    });

    async function test_reference_parent(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        let mathinputoutsideIdx =
            stateVariables[await resolvePathToNodeIdx("answer1")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputp1Idx =
            stateVariables[await resolvePathToNodeIdx("p1.answer2")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputp2Idx =
            stateVariables[await resolvePathToNodeIdx("p2.answer2")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputp3Idx =
            stateVariables[await resolvePathToNodeIdx("p3.answer2")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputp4Idx =
            stateVariables[await resolvePathToNodeIdx("p4.answer2")].stateValues
                .inputChildren[0].componentIdx;

        async function check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        }: {
            justSubmitted1: boolean;
            justSubmittedP1: boolean;
            justSubmittedP2: boolean;
            creditAchieved1: number;
            creditAchievedP1: number;
            creditAchievedP2: number;
            mathInputVal1: string;
            mathInputValP1: string;
            mathInputValP2: string;
            miVal: string;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("answer1")]
                    .stateValues.justSubmitted,
            ).eq(justSubmitted1);
            expect(
                stateVariables[await resolvePathToNodeIdx("answer1")]
                    .stateValues.creditAchieved,
            ).eq(creditAchieved1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p1.answer2")]
                    .stateValues.justSubmitted,
            ).eq(justSubmittedP1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p1.answer2")]
                    .stateValues.creditAchieved,
            ).eq(creditAchievedP1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.answer2")]
                    .stateValues.justSubmitted,
            ).eq(justSubmittedP2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.answer2")]
                    .stateValues.creditAchieved,
            ).eq(creditAchievedP2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3.answer2")]
                    .stateValues.justSubmitted,
            ).eq(justSubmittedP1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3.answer2")]
                    .stateValues.creditAchieved,
            ).eq(creditAchievedP1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p4.answer2")]
                    .stateValues.justSubmitted,
            ).eq(justSubmittedP2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p4.answer2")]
                    .stateValues.creditAchieved,
            ).eq(creditAchievedP2);

            expect(
                stateVariables[mathinputoutsideIdx].stateValues
                    .rawRendererValue,
            ).eq(mathInputVal1);
            expect(
                stateVariables[mathinputp1Idx].stateValues.rawRendererValue,
            ).eq(mathInputValP1);
            expect(
                stateVariables[mathinputp2Idx].stateValues.rawRendererValue,
            ).eq(mathInputValP2);
            expect(
                stateVariables[mathinputp3Idx].stateValues.rawRendererValue,
            ).eq(mathInputValP1);
            expect(
                stateVariables[mathinputp4Idx].stateValues.rawRendererValue,
            ).eq(mathInputValP2);

            expect(
                stateVariables[await resolvePathToNodeIdx("p1.ca")].stateValues
                    .value,
            ).eq(creditAchievedP1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.cao")].stateValues
                    .value,
            ).eq(creditAchievedP1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3.ca")].stateValues
                    .value,
            ).eq(creditAchievedP1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p4.cao")].stateValues
                    .value,
            ).eq(creditAchievedP1);

            expect(
                stateVariables[await resolvePathToNodeIdx("p1.cao")].stateValues
                    .value,
            ).eq(creditAchievedP2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.ca")].stateValues
                    .value,
            ).eq(creditAchievedP2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3.cao")].stateValues
                    .value,
            ).eq(creditAchievedP2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p4.ca")].stateValues
                    .value,
            ).eq(creditAchievedP2);

            expect(
                stateVariables[await resolvePathToNodeIdx("p1.m")].stateValues
                    .value.tree,
            ).eq(miVal);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.m")].stateValues
                    .value.tree,
            ).eq(miVal);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3.m")].stateValues
                    .value.tree,
            ).eq(miVal);
            expect(
                stateVariables[await resolvePathToNodeIdx("p4.m")].stateValues
                    .value.tree,
            ).eq(miVal);
        }

        let justSubmitted1 = false;
        let justSubmittedP1 = false;
        let justSubmittedP2 = false;
        let creditAchieved1 = 0;
        let creditAchievedP1 = 0;
        let creditAchievedP2 = 0;
        let mathInputVal1 = "";
        let mathInputValP1 = "";
        let mathInputValP2 = "";
        let miVal = "p";

        await check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        });

        mathInputVal1 = "x";
        justSubmitted1 = true;
        creditAchieved1 = 1;

        // answer outside answer
        await updateMathInputValue({
            latex: mathInputVal1,
            componentIdx: mathinputoutsideIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        await check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        });

        mathInputValP1 = "y";
        justSubmittedP1 = true;
        creditAchievedP1 = 1;

        // correctly answer first problem
        await updateMathInputValue({
            latex: mathInputValP1,
            componentIdx: mathinputp1Idx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("p1.answer2"),
            core,
        });

        await check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        });

        // correctly answer second problem

        mathInputValP2 = "z";
        justSubmittedP2 = true;
        creditAchievedP2 = 1;

        await updateMathInputValue({
            latex: mathInputValP2,
            componentIdx: mathinputp2Idx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("p2.answer2"),
            core,
        });

        await check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        });

        // incorrectly answer third problem

        mathInputValP1 = "a";
        justSubmittedP1 = true;
        creditAchievedP1 = 0;

        await updateMathInputValue({
            latex: mathInputValP1,
            componentIdx: mathinputp3Idx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("p3.answer2"),
            core,
        });

        await check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        });

        // incorrectly answer fourth problem
        mathInputValP2 = "b";
        justSubmittedP2 = true;
        creditAchievedP2 = 0;

        await updateMathInputValue({
            latex: mathInputValP2,
            componentIdx: mathinputp4Idx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("p4.answer2"),
            core,
        });

        await check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        });

        // change mathInput

        miVal = "q";

        await updateMathInputValue({
            latex: miVal,
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        await check_items({
            justSubmitted1,
            justSubmittedP1,
            justSubmittedP2,
            creditAchieved1,
            creditAchievedP1,
            creditAchievedP2,
            mathInputVal1,
            mathInputValP1,
            mathInputValP2,
            miVal,
        });
    }

    it("references to parent", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="p" />
    <answer name="answer1">x</answer>

    <problem name="p1">
      <answer name="answer2">y</answer>
      <p>Credit achieved: <number extend="$p1.creditAchieved" name="ca" /></p>
      <p>Value of mathInput: <math extend="$mi" name="m" /></p>
      <p>Other answer credit achieved: <number extend="$p2.answer2.creditAchieved" name="cao" /></p>
    </problem>

    <problem name="p2">
      <answer name="answer2">z</answer>
      <p>Credit achieved: <number extend="$p2.creditAchieved" name="ca" /></p>
      <p>Value of mathInput: <math extend="$mi" name="m" /></p>
      <p>Other answer credit achieved: <number extend="$p1.answer2.creditAchieved" name="cao" /></p>
    </problem>

    <problem extend="$p1" name="p3" />

    <problem extend="$p2" name="p4" />

    `,
        });

        await test_reference_parent(core, resolvePathToNodeIdx);
    });

    async function test_extend_repeat(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items({
            n,
            x = "\uff3f",
            y = "\uff3f",
            z = "\uff3f",
        }: {
            n: number;
            x?: string;
            y?: string;
            z?: string;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("n2")].stateValues
                    .value.tree,
            ).eq(n);
            expect(
                stateVariables[await resolvePathToNodeIdx("n3")].stateValues
                    .value,
            ).eq(n);

            expect(
                stateVariables[await resolvePathToNodeIdx("r1[1].p")]
                    .stateValues.text,
            ).contain("Hello 1!");
            expect(
                stateVariables[await resolvePathToNodeIdx("r1[2].p")]
                    .stateValues.text,
            ).contain("Hello 2!");
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[1].p")]
                    .stateValues.text,
            ).contain("Hello 1!");
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[2].p")]
                    .stateValues.text,
            ).contain("Hello 2!");
            expect(
                stateVariables[await resolvePathToNodeIdx("r3[1].p")]
                    .stateValues.text,
            ).contain("Hello 1!");
            expect(
                stateVariables[await resolvePathToNodeIdx("r3[2].p")]
                    .stateValues.text,
            ).contain("Hello 2!");
            if (n === 3) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("r1[3].p")]
                        .stateValues.text,
                ).contain("Hello 3!");
                expect(
                    stateVariables[await resolvePathToNodeIdx("r2[3].p")]
                        .stateValues.text,
                ).contain("Hello 3!");
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p")]
                        .stateValues.text,
                ).contain("Hello 3!");
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p")],
                ).eq(undefined);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p")],
                ).eq(undefined);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p")],
                ).eq(undefined);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("r1[1].p.n1")]
                    .stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("r1[2].p.n1")]
                    .stateValues.value,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[1].p.n1")]
                    .stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[2].p.n1")]
                    .stateValues.value,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("r3[1].p.n1")]
                    .stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("r3[2].p.n1")]
                    .stateValues.value,
            ).eq(2);
            if (n === 3) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("r1[3].p.n1")]
                        .stateValues.value,
                ).eq(3);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r2[3].p.n1")]
                        .stateValues.value,
                ).eq(3);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p.n1")]
                        .stateValues.value,
                ).eq(3);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("r1[3].p.n1")],
                ).eq(undefined);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r2[3].p.n1")],
                ).eq(undefined);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p.n1")],
                ).eq(undefined);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("r1[1].p.m1")]
                    .stateValues.value.tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx("r1[2].p.m1")]
                    .stateValues.value.tree,
            ).eq(y);
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[1].p.m1")]
                    .stateValues.value.tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[2].p.m1")]
                    .stateValues.value.tree,
            ).eq(y);
            expect(
                stateVariables[await resolvePathToNodeIdx("r3[1].p.m1")]
                    .stateValues.value.tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx("r3[2].p.m1")]
                    .stateValues.value.tree,
            ).eq(y);
            if (n === 3) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("r1[3].p.m1")]
                        .stateValues.value.tree,
                ).eq(z);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r2[3].p.m1")]
                        .stateValues.value.tree,
                ).eq(z);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p.m1")]
                        .stateValues.value.tree,
                ).eq(z);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("r1[3].p.m1")],
                ).eq(undefined);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r2[3].p.m1")],
                ).eq(undefined);
                expect(
                    stateVariables[await resolvePathToNodeIdx("r3[3].p.m1")],
                ).eq(undefined);
            }
        }

        await check_items({ n: 2 });

        // type x in first mathInput
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("r1[1].p.x"),
            core,
        });

        await check_items({ n: 2, x: "x" });

        // type y in second mathInput
        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("r3[2].p.x"),
            core,
        });

        await check_items({ n: 2, x: "x", y: "y" });

        // increase n
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items({ n: 3, x: "x", y: "y" });

        // type z in third mathInput
        await updateMathInputValue({
            latex: "z",
            componentIdx: await resolvePathToNodeIdx("r2[3].p.x"),
            core,
        });

        await check_items({ n: 3, x: "x", y: "y", z: "z" });
    }

    it("extend repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="2" />

    <p>Value: <math extend="$n" name="n2" /></p>
    <p>Value 2: <number extend="$n2" name="n3" /></p>

    <setup><sequence name="s" from="1" to="$n" /></setup>
    <repeat name="r1" for="$s" valueName="v">
      <p name="p">Hello <number name="n1" extend="$v" />!  <mathInput name="x" /> <math name="m1" extend="$x" /></p>
    </repeat>

    <repeat extend="$r1" name="r2" />

    <repeat extend="$r2" name="r3" />


    `,
        });

        await test_extend_repeat(core, resolvePathToNodeIdx);
    });

    it("extend repeatForSequence", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="2" />

    <p>Value: <math extend="$n" name="n2" /></p>
    <p>Value 2: <number extend="$n2" name="n3" /></p>

    <repeatForSequence name="r1" from="1" to="$n" valueName="v">
      <p name="p">Hello <number name="n1" extend="$v" />!  <mathInput name="x" /> <math name="m1" extend="$x" /></p>
    </repeatForSequence>

    <repeatForSequence extend="$r1" name="r2" />

    <repeatForSequence extend="$r2" name="r3" />


    `,
        });

        await test_extend_repeat(core, resolvePathToNodeIdx);
    });

    it("extend wraps to match specified type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="2" />
        
    <math name="m1" extend="$mi" />

    <number name="n1" extend="$mi" />

    <point name="P">(x,y)</point>

    <coords name="c1" extend="$P" />
    <coords name="c2" extend="$P.coords" />

    <math name="mc1" extend="$P" />
    <math name="mc2" extend="$P.coords" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eq(2);

        expect(
            stateVariables[await resolvePathToNodeIdx("n1")].stateValues.value,
        ).eq(2);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.value
                .tree,
        ).eqls(["vector", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value
                .tree,
        ).eqls(["vector", "x", "y"]);

        expect(
            stateVariables[await resolvePathToNodeIdx("mc1")].stateValues.value
                .tree,
        ).eqls(["vector", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mc2")].stateValues.value
                .tree,
        ).eqls(["vector", "x", "y"]);

        // enter a
        await updateMathInputValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eq("a");

        expect(
            stateVariables[await resolvePathToNodeIdx("n1")].stateValues.value,
        ).eqls(NaN);
    });

    it("add children to invalid extend", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g" extend="$invalid">
      <point name="P" />
    </graph>


    <math name="Pcoords" extend="$P" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].activeChildren
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].activeChildren[0]
                .componentIdx,
        ).eq(await resolvePathToNodeIdx("P"));
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([0, 0]);

        expect(
            stateVariables[await resolvePathToNodeIdx("Pcoords")].stateValues
                .value.tree,
        ).eqls(["vector", 0, 0]);

        // move point

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: 5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([3, 5]);

        expect(
            stateVariables[await resolvePathToNodeIdx("Pcoords")].stateValues
                .value.tree,
        ).eqls(["vector", 3, 5]);
    });

    it("add children with extend", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g1">
      <point name="P1">(1,2)</point>
    </graph>

    <graph name="g1a" extend="$g1">
      <vector name="v1">(4,5)</vector>
    </graph>

    <math name="P1coords" extend="$P1" />
    <math name="P1acoords" extend="$g1a.P1" />
    <math name="v1displacement" extend="$v1" />



    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1")].activeChildren
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1")].activeChildren[0]
                .componentIdx,
        ).eq(await resolvePathToNodeIdx("P1"));
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1a")].activeChildren
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1a")].activeChildren[0]
                .componentIdx,
        ).eq(await resolvePathToNodeIdx("g1a.P1"));
        expect(
            stateVariables[await resolvePathToNodeIdx("g1a")].activeChildren[1]
                .componentIdx,
        ).eq(await resolvePathToNodeIdx("g1a.v1"));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.P1")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.v1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls([4, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1coords")].stateValues
                .value.tree,
        ).eqls(["vector", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1acoords")].stateValues
                .value.tree,
        ).eqls(["vector", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1displacement")]
                .stateValues.value.tree,
        ).eqls(["vector", 4, 5]);

        // move points

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3,
            y: 5,
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v1"),
            headcoords: [8, 7],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([3, 5]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.P1")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 5]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("v1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls([8, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1coords")].stateValues
                .value.tree,
        ).eqls(["vector", 3, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1acoords")].stateValues
                .value.tree,
        ).eqls(["vector", 3, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1displacement")]
                .stateValues.value.tree,
        ).eqls(["vector", 8, 7]);

        // move shadowed points

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1a.P1"),
            x: 2,
            y: 1,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([2, 1]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.P1")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([2, 1]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("v1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls([8, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1coords")].stateValues
                .value.tree,
        ).eqls(["vector", 2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1acoords")].stateValues
                .value.tree,
        ).eqls(["vector", 2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1displacement")]
                .stateValues.value.tree,
        ).eqls(["vector", 8, 7]);
    });

    it("add children to group with extend", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="g1"><point name="P1">(1,2)</point></group>

    <group name="g1a" extend="$g1"><vector name="v1">(4,5)</vector></group>

    <math name="P1coords" extend="$P1" />
    <math name="P1acoords" extend="$g1a.P1" />
    <math name="v1displacement" extend="$v1" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1")].replacements!
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1")].replacements![0]
                .componentIdx,
        ).eq(await resolvePathToNodeIdx("P1"));
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1a")].replacements!
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1a")].replacements![0]
                .componentIdx,
        ).eq(await resolvePathToNodeIdx("g1a.P1"));
        expect(
            stateVariables[await resolvePathToNodeIdx("g1a")].replacements![1]
                .componentIdx,
        ).eq(await resolvePathToNodeIdx("g1a.v1"));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.P1")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.v1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls([4, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1coords")].stateValues
                .value.tree,
        ).eqls(["vector", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1acoords")].stateValues
                .value.tree,
        ).eqls(["vector", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1displacement")]
                .stateValues.value.tree,
        ).eqls(["vector", 4, 5]);

        // move points

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3,
            y: 5,
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v1"),
            headcoords: [8, 7],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([3, 5]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.P1")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 5]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("v1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls([8, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1coords")].stateValues
                .value.tree,
        ).eqls(["vector", 3, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1acoords")].stateValues
                .value.tree,
        ).eqls(["vector", 3, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1displacement")]
                .stateValues.value.tree,
        ).eqls(["vector", 8, 7]);

        // move shadowed points

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1a.P1"),
            x: 2,
            y: 1,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([2, 1]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g1a.P1")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([2, 1]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("v1")
            ].stateValues.displacement.map((x) => x.tree),
        ).eqls([8, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1coords")].stateValues
                .value.tree,
        ).eqls(["vector", 2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1acoords")].stateValues
                .value.tree,
        ).eqls(["vector", 2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1displacement")]
                .stateValues.value.tree,
        ).eqls(["vector", 8, 7]);
    });

    it("children added to group with extend are correctly shadowed when shadowing containing group", async () => {
        // Verify the bug has been fixed where $grp2.v was not properly shadowing $grp1.v
        // due to the fact that `$grp1.v` was coming from the `serializedChildren` of the copy creating `g2`.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <group name="grp1">
            <graph name="g">
                <point name="P">(1,2)</point>
            </graph>

            <graph name="g2" extend="$g">
                <vector name="v">(4,5)</vector>
            </graph>
        </group>

        <group extend="$grp1" name="grp2" />
    `,
        });

        async function check_values({
            P,
            v,
            vHead,
            vTail,
        }: {
            P: number[];
            v: number[];
            vHead: number[];
            vTail: number[];
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.head.map((x) => x.tree),
            ).eqls(vHead);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.v")
                ].stateValues.head.map((x) => x.tree),
            ).eqls(vHead);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.tail.map((x) => x.tree),
            ).eqls(vTail);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.v")
                ].stateValues.tail.map((x) => x.tree),
            ).eqls(vTail);
        }

        let P = [1, 2];
        let v = [4, 5];
        let vTail = [0, 0];
        let vHead = [vTail[0] + v[0], vTail[1] + v[1]];

        await check_values({ P, v, vHead, vTail });

        P = [3, 5];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: P[0],
            y: P[1],
            core,
        });

        vTail = [-2, 6];
        vHead = [vTail[0] + v[0], vTail[1] + v[1]];
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v"),
            headcoords: vHead,
            tailcoords: vTail,
            core,
        });

        await check_values({ P, v, vHead, vTail });

        P = [-9, -8];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("grp2.g2.P"),
            x: P[0],
            y: P[1],
            core,
        });

        v = [-7, 0];
        vHead = [vTail[0] + v[0], vTail[1] + v[1]];
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("grp2.v"),
            headcoords: vHead,
            core,
        });

        await check_values({ P, v, vHead, vTail });

        P = [7, -6];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("grp2.P"),
            x: P[0],
            y: P[1],
            core,
        });

        vTail = [-2, 6];
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v"),
            tailcoords: vTail,
            core,
        });
    });

    it("add children with extend, multiple levels of groups", async () => {
        // This is an overly complicated test that is hard to understand.
        // Keeping it as it has helped uncover bugs, for which we now have simpler, more focused test, above.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="grp0" >
      <group name="grp1">
    
        <graph name="g">
          <point name="P">(1,2)</point>
        </graph>
      
        <graph name="g2" extend="$g">
          <vector name="v">(4,5)</vector>
        </graph>
      
        <graph name="g3" extend="$g2">
          <circle name="c" center="$g.P" />
          <lineSegment name="l" endpoints="$P $v.head" />
        </graph>
      
        <graph extend="$g" name="g4" />
        
        <graph extend="$g4" name="g5">
          <circle name="c" />
        </graph>
        
      </group>
      
      
      <group extend="$grp1" name="grp2">
      
        <graph extend="$g5" name="g6">
          <lineSegment name="l" endpoints="$g6.c.center $g4.P" />
        </graph>
      
      </group>
    
    </group>
    
    
    <group extend="$grp0" name="grp3">
    
      <graph extend="$grp2.g6" name="g7">
        <vector name="v2" tail="$g7.l.endpoint1" head="$grp3.v.head" />
      </graph>
    
    </group>
    
    <section name="section1">
      <section name="section1a">
        <p>Point 1: <math extend="$g.P" name="P1coords" /></p>
        <p>Point 2: <math extend="$g2.P" name="P2coords" /></p>
        <p>Vector 2: <math extend="$g2.v" name="v2displacement" /></p>
        <p>Point 3: <math extend="$g3.P" name="P3coords" /></p>
        <p>Vector 3: <math extend="$g3.v" name="v3displacement" /></p>
        <p>Circle 3 center: <math extend="$g3.c.center" name="c3center" /></p>
        <p>Line segment 3 point 1: <math extend="$g3.l.endpoint1" name="l3point1" /></p>
        <p>Line segment 3 point 2: <math extend="$g3.l.endpoint2" name="l3point2" /></p>
        <p>Point 4: <math extend="$g4.P" name="P4coords" /></p>
        <p>Point 5: <math extend="$g5.P" name="P5coords" /></p>
        <p>Circle 5 center: <math extend="$g5.c.center" name="c5center" /></p>
      </section>

      <group name="grp2ps">
        <p>Grp2 Point 1: <math extend="$grp2.g.P" name="P1coords" /></p>
        <p>Grp2 Point 2: <math extend="$grp2.g2.P" name="P2coords" /></p>
        <p>Grp2 Vector 2: <math extend="$grp2.v" name="v2displacement" /></p>
        <p>Grp2 Point 3: <math extend="$grp2.g3.P" name="P3coords" /></p>
        <p>Grp2 Vector 3: <math extend="$grp2.g3.v" name="v3displacement" /></p>
        <p>Grp2 Circle 3 center: <math extend="$grp2.g3.c.center" name="c3center" /></p>
        <p>Grp2 Line segment 3 point 1: <math extend="$grp2.g3.l.endpoint1" name="l3point1" /></p>
        <p>Grp2 Line segment 3 point 2: <math extend="$grp2.g3.l.endpoint2" name="l3point2" /></p>
        <p>Grp2 Point 4: <math extend="$grp2.g4.P" name="P4coords" /></p>
        <p>Grp2 Point 5: <math extend="$grp2.g5.P" name="P5coords" /></p>
        <p>Grp2 Circle 5 center: <math extend="$grp2.g5.c.center" name="c5center" /></p>
        <p>Grp2 Point 6: <math extend="$grp2.g6.P" name="P6coords" /></p>
        <p>Grp2 Circle 6 center: <math extend="$grp2.g6.c.center" name="c6center" /></p>
        <p>Grp2 Line segment 6 point 1: <math extend="$grp2.l.endpoint1" name="l6point1" /></p>
        <p>Grp2 Line segment 6 point 2: <math extend="$grp2.l.endpoint2" name="l6point2" /></p>
      </group>
    </section>

    
    <group name="grp3ps">

      <section name="section2">

        <p>Grp3 Point 1: <math extend="$grp3.g.P" name="P1coords" /></p>
        <p>Grp3 Point 2: <math extend="$grp3.g2.P" name="P2coords" /></p>
        <p>Grp3 Vector 2: <math extend="$grp3.v" name="v2displacement" /></p>
        <p>Grp3 Point 3: <math extend="$grp3.g3.P" name="P3coords" /></p>
        <p>Grp3 Vector 3: <math extend="$grp3.g3.v" name="v3displacement" /></p>
        <p>Grp3 Circle 3 center: <math extend="$grp3.g3.c.center" name="c3center" /></p>
        <p>Grp3 Line segment 3 point 1: <math extend="$grp3.g3.l.endpoint1" name="l3point1" /></p>
        <p>Grp3 Line segment 3 point 2: <math extend="$grp3.g3.l.endpoint2" name="l3point2" /></p>
        <p>Grp3 Point 4: <math extend="$grp3.g4.P" name="P4coords" /></p>
        <p>Grp3 Point 5: <math extend="$grp3.g5.P" name="P5coords" /></p>
        <p>Grp3 Circle 5 center: <math extend="$grp3.g5.c.center" name="c5center" /></p>

      </section>
      
      <group name="grp2ps">
        <p>Grp3 Grp2 Point 1: <math extend="$grp3.grp2.g.P" name="P1coords" /></p>
        <p>Grp3 Grp2 Point 2: <math extend="$grp3.grp2.g2.P" name="P2coords" /></p>
        <p>Grp3 Grp2 Vector 2: <math extend="$grp3.grp2.v" name="v2displacement" /></p>
        <p>Grp3 Grp2 Point 3: <math extend="$grp3.grp2.g3.P" name="P3coords" /></p>
        <p>Grp3 Grp2 Vector 3: <math extend="$grp3.grp2.g3.v" name="v3displacement" /></p>
        <p>Grp3 Grp2 Circle 3 center: <math extend="$grp3.grp2.g3.c.center" name="c3center" /></p>
        <p>Grp3 Grp2 Line segment 3 point 1: <math extend="$grp3.grp2.g3.l.endpoint1" name="l3point1" /></p>
        <p>Grp3 Grp2 Line segment 3 point 2: <math extend="$grp3.grp2.g3.l.endpoint2" name="l3point2" /></p>
        <p>Grp3 Grp2 Point 4: <math extend="$grp3.grp2.g4.P" name="P4coords" /></p>
        <p>Grp3 Grp2 Point 5: <math extend="$grp3.grp2.g5.P" name="P5coords" /></p>
        <p>Grp3 Grp2 Circle 5 center: <math extend="$grp3.grp2.g5.c.center" name="c5center" /></p>
        <p>Grp3 Grp2 Point 6: <math extend="$grp3.grp2.g6.P" name="P6coords" /></p>
        <p>Grp3 Grp2 Circle 6 center: <math extend="$grp3.grp2.g6.c.center" name="c6center" /></p>
        <p>Grp3 Grp2 Line segment 6 point 1: <math extend="$grp3.grp2.l.endpoint1" name="l6point1" /></p>
        <p>Grp3 Grp2 Line segment 6 point 2: <math extend="$grp3.grp2.l.endpoint2" name="l6point2" /></p>
        <p>Grp3 Point 7: <math extend="$grp3.g7.P" name="P7coords" /></p>
        <p>Grp3 Circle 7 center: <math extend="$grp3.g7.c.center" name="c7center" /></p>
        <p>Grp3 Line segment 7 point 1: <math extend="$grp3.g7.l.endpoint1" name="l7point1" /></p>
        <p>Grp3 Line segment 7 point 2: <math extend="$grp3.g7.l.endpoint2" name="l7point2" /></p>
        <p>Grp3 Vector 7 head: <math extend="$grp3.g7.v2.head" name="v7head" /></p>
        <p>Grp3 Vector 7 tail: <math extend="$grp3.g7.v2.tail" name="v7tail" /></p>
      </group>

    </group>



    `,
        });

        async function check_items({
            P,
            v,
            vH,
            c0,
        }: {
            P: number[];
            v: number[];
            vH: number[];
            c0: number[];
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const coordsNames = [
                "section1.section1a.P2coords",
                "section1.section1a.P3coords",
                "section1.section1a.P4coords",
                "section1.section1a.P5coords",
                "section1.grp2ps.P1coords",
                "section1.grp2ps.P2coords",
                "section1.grp2ps.P3coords",
                "section1.grp2ps.P4coords",
                "section1.grp2ps.P5coords",
                "section1.grp2ps.P6coords",
                "grp3ps.section2.P1coords",
                "grp3ps.section2.P2coords",
                "grp3ps.section2.P3coords",
                "grp3ps.section2.P4coords",
                "grp3ps.section2.P5coords",
                "grp3ps.grp2ps.P1coords",
                "grp3ps.grp2ps.P2coords",
                "grp3ps.grp2ps.P3coords",
                "grp3ps.grp2ps.P4coords",
                "grp3ps.grp2ps.P5coords",
                "grp3ps.grp2ps.P6coords",
                "grp3ps.grp2ps.P7coords",
                "section1.section1a.c3center",
                "section1.section1a.l3point1",
                "section1.grp2ps.c3center",
                "section1.grp2ps.l3point1",
                "section1.grp2ps.l6point2",
                "grp3ps.section2.c3center",
                "grp3ps.section2.l3point1",
                "grp3ps.grp2ps.l7point2",
                "grp3ps.grp2ps.c3center",
                "grp3ps.grp2ps.l3point1",
            ];

            for (let name of coordsNames) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .value.tree,
                ).eqls(["vector", ...P]);
            }

            const displacementNames = [
                "section1.section1a.v2displacement",
                "section1.section1a.v3displacement",
                "section1.grp2ps.v2displacement",
                "section1.grp2ps.v3displacement",
                "grp3ps.section2.v2displacement",
                "grp3ps.section2.v3displacement",
                "grp3ps.grp2ps.v2displacement",
                "grp3ps.grp2ps.v3displacement",
            ];
            for (let name of displacementNames) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .value.tree,
                ).eqls(["vector", ...v]);
            }

            const headNames = [
                "section1.section1a.l3point2",
                "section1.grp2ps.l3point2",
                "grp3ps.section2.l3point2",
                "grp3ps.grp2ps.l3point2",
                "grp3ps.grp2ps.v7head",
            ];
            for (let name of headNames) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .value.tree,
                ).eqls(["vector", ...vH]);
            }

            const centerNames = [
                "section1.section1a.c5center",
                "section1.grp2ps.c5center",
                "section1.grp2ps.l6point1",
                "grp3ps.section2.c5center",
                "grp3ps.grp2ps.c5center",
                "grp3ps.grp2ps.l6point1",
                "grp3ps.grp2ps.l7point1",
                "grp3ps.grp2ps.v7tail",
            ];
            for (let name of centerNames) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .value.tree,
                ).eqls(["vector", ...c0]);
            }

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g3.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g3.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g3.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g3.l")
                ].stateValues.endpoints[0].map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g3.l")
                ].stateValues.endpoints[1].map((x) => x.tree),
            ).eqls(vH);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g4.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g5.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g5.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(c0);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g3.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g3.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g3.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g3.l")
                ].stateValues.endpoints[0].map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g3.l")
                ].stateValues.endpoints[1].map((x) => x.tree),
            ).eqls(vH);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g4.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g5.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g5.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g6.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.g6.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.l")
                ].stateValues.endpoints[0].map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp2.l")
                ].stateValues.endpoints[1].map((x) => x.tree),
            ).eqls(P);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g3.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g3.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g3.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g3.l")
                ].stateValues.endpoints[0].map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g3.l")
                ].stateValues.endpoints[1].map((x) => x.tree),
            ).eqls(vH);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g4.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g5.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g5.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(c0);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g3.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g3.v")
                ].stateValues.displacement.map((x) => x.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g3.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g3.l")
                ].stateValues.endpoints[0].map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g3.l")
                ].stateValues.endpoints[1].map((x) => x.tree),
            ).eqls(vH);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g4.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g5.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g5.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g6.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.g6.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.l")
                ].stateValues.endpoints[0].map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.grp2.l")
                ].stateValues.endpoints[1].map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g7.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g7.c")
                ].stateValues.center.map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g7.l")
                ].stateValues.endpoints[0].map((x) => x.tree),
            ).eqls(c0);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g7.l")
                ].stateValues.endpoints[1].map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g7.v2")
                ].stateValues.head.map((x) => x.tree),
            ).eqls(vH);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("grp3.g7.v2")
                ].stateValues.tail.map((x) => x.tree),
            ).eqls(c0);
        }

        let P = [1, 2];
        let v = [4, 5];
        let vH = [4, 5];
        let c0 = [0, 0];

        await check_items({ P, v, vH, c0 });

        // move objects

        P = [3, 5];

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g.P"),
            x: P[0],
            y: P[1],
            core,
        });
        v = [8, 7];
        vH = [5, 1];

        await moveVector({
            componentIdx: await resolvePathToNodeIdx("g2.v"),
            headcoords: vH,
            tailcoords: [vH[0] - v[0], vH[1] - v[1]],
            core,
        });
        c0 = [6, 0];

        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("g5.c"),
            cx: c0[0],
            cy: c0[1],
            core,
        });

        await check_items({ P, v, vH, c0 });
    });

    it("add children with extend, recreated replacements include added children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="1" />

    <conditionalContent name="cc">
      <case condition="$n>1">
        <graph name="g1">
          <point name="P">(3,4)</point>
        </graph>
      </case>
      <else>
        <graph name="g1">
          <point name="P">(5,6)</point>
        </graph>
      </else>
    </conditionalContent>
    
    <graph extend="$cc.g1" name="g2">
      <point name="Q">(7,8)</point>
    </graph>


    <point extend="$cc.g1.P" name="Pa" />
    <point extend="$g2.P" name="Pb" />
    <point extend="$g2.Q" name="Qa" />
    `,
        });

        async function check_items(P: number[], Q: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("cc.g1")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("cc.g1")]
                    .activeChildren[0].componentIdx,
            ).eq(await resolvePathToNodeIdx("cc.g1.P"));
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("cc.g1.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2")].activeChildren
                    .length,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2")]
                    .activeChildren[0].componentIdx,
            ).eq(await resolvePathToNodeIdx("g2.P"));
            expect(
                stateVariables[await resolvePathToNodeIdx("g2")]
                    .activeChildren[1].componentIdx,
            ).eq(await resolvePathToNodeIdx("g2.Q"));
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.P")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.Q")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(Q);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("Pa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("Pb")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("Qa")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(Q);
        }

        let P = [5, 6],
            Q = [7, 8];

        await check_items(P, Q);

        // move points

        P = [10, 9];
        Q = [8, 4];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("cc.g1.P"),
            x: P[0],
            y: P[1],
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.Q"),
            x: Q[0],
            y: Q[1],
            core,
        });

        await check_items(P, Q);

        // switch to second option from conditional content
        P = [3, 4];
        Q = [7, 8];
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(P, Q);

        // move new points
        P = [6, 1];
        Q = [9, 3];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("cc.g1.P"),
            x: P[0],
            y: P[1],
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.Q"),
            x: Q[0],
            y: Q[1],
            core,
        });
        await check_items(P, Q);

        // switch back to first option from conditional content
        P = [5, 6];
        Q = [7, 8];
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
    });

    it("add children to extend with prop and propIndex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="ind" prefill="1" />

    <graph>
      <rectangle name="rect" width="4" height="6" center="(3,5)"/>
      <point extend="$rect.vertices[$ind]" name="P">
        <label><m>V_$ind</m></label>
      </point>
    </graph>

    <p>P: <point name="Pa" extend="$P" /></p>
    <p>label of P: <label extend="$P.label" name="l" /></p>


    `,
        });

        async function check_items(ind: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (ind === 1) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("Pa")].stateValues
                        .coords.tree,
                ).eqls(["vector", 1, 2]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("l")].stateValues
                        .value,
                ).eq("\\(V_ 1\\)");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("P")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls([1, 2]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("P")].stateValues
                        .label,
                ).eq("\\(V_ 1\\)");
            } else if (ind === 2) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("Pa")].stateValues
                        .coords.tree,
                ).eqls(["vector", 5, 2]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("l")].stateValues
                        .value,
                ).eq("\\(V_ 2\\)");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("P")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls([5, 2]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("P")].stateValues
                        .label,
                ).eq("\\(V_ 2\\)");
            } else if (ind === 3) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("Pa")].stateValues
                        .coords.tree,
                ).eqls(["vector", 5, 8]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("l")].stateValues
                        .value,
                ).eq("\\(V_ 3\\)");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("P")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls([5, 8]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("P")].stateValues
                        .label,
                ).eq("\\(V_ 3\\)");
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("Pa")].stateValues
                        .coords.tree,
                ).eqls(["vector", 0, 0]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("l")].stateValues
                        .value,
                ).eq("\\(V_ \uff3f\\)");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("P")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls([0, 0]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("P")].stateValues
                        .label,
                ).eq("\\(V_ \uff3f\\)");
            }
        }

        await check_items(1);

        // change to vertex 2
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("ind"),
            core,
        });
        await check_items(2);

        // invalid vertex
        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("ind"),
            core,
        });
        await check_items(0);

        // change to vertex 3
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("ind"),
            core,
        });
        await check_items(3);
    });

    it("dot and array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(2,3)</point>
    </graph>
    
    <p name="p1">P: $P</p>
    <p name="p2">x of P: $P[1]</p>
    <p name="p3">y of P: $P[2]</p>
    <p name="p4">P.: $P.</p>
    <p name="p5">P.1: $P.1</p>
    <p name="p6">x of P: $P.x</p>
    <p name="p7">y of P: $P.y</p>
    <p name="p8">nothing: $P._x</p>
    <p name="p9">x of P: $P.xs[1]</p>
    <p name="p10">y of P: $P.xs[2]</p>
    <p name="p11">nothing: $P.xs[3]</p>
    
    
    <p name="p12">P: $(P)</p>
    <p name="p13">(P).x: $(P).x</p>
    <p name="p14">no match: $(P.)</p>
    <p name="p15">nothing: $(P.1)</p>
    <p name="p16">x of P: $(P.x)</p>
    <p name="p17">y of P: $(P.y)</p>
    <p name="p18">x of P: $(P.xs[1])</p>
    <p name="p19">y of P: $(P.xs[2])</p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("P: ( 2, 3 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("x of P: 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("y of P: 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("P.: ( 2, 3 ).");
        expect(
            stateVariables[await resolvePathToNodeIdx("p5")].stateValues.text,
        ).eq("P.1: ( 2, 3 ).1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p6")].stateValues.text,
        ).eq("x of P: 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p7")].stateValues.text,
        ).eq("y of P: 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p8")].stateValues.text,
        ).eq("nothing: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p9")].stateValues.text,
        ).eq("x of P: 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p10")].stateValues.text,
        ).eq("y of P: 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p11")].stateValues.text,
        ).eq("nothing: ");

        expect(
            stateVariables[await resolvePathToNodeIdx("p12")].stateValues.text,
        ).eq("P: ( 2, 3 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p13")].stateValues.text,
        ).eq("(P).x: ( 2, 3 ).x");
        expect(
            stateVariables[await resolvePathToNodeIdx("p14")].stateValues.text,
        ).eq("no match: $(P.)");
        expect(
            stateVariables[await resolvePathToNodeIdx("p15")].stateValues.text,
        ).eq("nothing: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p16")].stateValues.text,
        ).eq("x of P: 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p17")].stateValues.text,
        ).eq("y of P: 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p18")].stateValues.text,
        ).eq("x of P: 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p19")].stateValues.text,
        ).eq("y of P: 3");
    });

    it("dot and array notation, chaining, references", async () => {
        // XXX: Many of these no longer work. Ideally, we should restore this behavior.
        // For now, have just commented out the assertions
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph size="small">
      <line name="l" through="(2/3,3) (5,6)" displayDigits="2" />
    </graph>
    
    <setup>
        <pointList name="pl" extend="$l.points" />
    </setup>

    <p name="p1">$pl.coords</p>
    <p name="p2">$pl.x</p>
    <p name="p3">$pl.y</p>
    <p name="p4">$pl.bad</p>
    <p name="p5">$pl.xs[1]</p>
    <p name="p6">$pl.xs[2]</p>
    <p name="p7">$pl.xs[3]</p>

    <p name="p8">$l.points[1].coords</p>
    <p name="p9">$l.points[1].x</p>
    <p name="p10">$l.points[1].y</p>
    <p name="p11">$l.points[1].bad</p>
    <p name="p12">$l.points[1].xs[1]</p>
    <p name="p13">$l.points[1].xs[2]</p>
    <p name="p14">$l.points[1].xs[3]</p>

    <p name="p15">$l.points[2].coords</p>
    <p name="p16">$l.points[2].x</p>
    <p name="p17">$l.points[2].y</p>
    <p name="p18">$l.points[2].bad</p>
    <p name="p19">$l.points[2].xs[1]</p>
    <p name="p20">$l.points[2].xs[2]</p>
    <p name="p21">$l.points[2].xs[3]</p>

    <p name="p22">$l.points[3].coords</p>
    <p name="p23">$l.points[3].x</p>
    <p name="p24">$l.points[3].y</p>
    <p name="p25">$l.points[3].bad</p>
    <p name="p26">$l.points[3].xs[1]</p>
    <p name="p27">$l.points[3].xs[2]</p>
    <p name="p28">$l.points[3].xs[3]</p>

    <p name="p29">$l.points.coords.latex</p>
    <p name="p30">$l.points.x.latex</p>
    <p name="p31">$l.points.y.latex</p>
    <p name="p32">$l.points.bad.latex</p>
    <p name="p33">$l.points.xs[1].latex</p>
    <p name="p34">$l.points.xs[2].latex</p>
    <p name="p35">$l.points.xs[3].latex</p>
    
    <p name="p36">$l.points[1].coords.latex</p>
    <p name="p37">$l.points[1].x.latex</p>
    <p name="p38">$l.points[1].y.latex</p>
    <p name="p39">$l.points[1].bad.latex</p>
    <p name="p40">$l.points[1].xs[1].latex</p>
    <p name="p41">$l.points[1].xs[2].latex</p>
    <p name="p42">$l.points[1].xs[3].latex</p>

    <p name="p43">$l.points[1][1]</p>
    <p name="p44">$l.points[1][2]</p>
    <p name="p45">$l.points[2][1]</p>
    <p name="p46">$l.points[2][2]</p>
    <p name="p47">$l.points[0][1]</p>
    <p name="p48">$l.points[1][0]</p>
    <p name="p49">$l.points[1][3]</p>
    <p name="p50">$l.points[3][1]</p>
    
    `,
        });

        async function check_items({
            P11,
            P12,
            P21,
            P22,
            P11latex,
        }: {
            P11: string;
            P12: string;
            P21: string;
            P22: string;
            P11latex?: string;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .text,
            ).eq(`( ${P11}, ${P12} ), ( ${P21}, ${P22} )`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).eq(`${P11}, ${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .text,
            ).eq(`${P12}, ${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p4")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p5")].stateValues
                    .text,
            ).eq(`${P11}, ${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p6")].stateValues
                    .text,
            ).eq(`${P12}, ${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p7")].stateValues
                    .text,
            ).eq(``);

            // XXX: restore this assertion
            // expect(
            //     stateVariables[await resolvePathToNodeIdx("p8")].stateValues.text,
            // ).eq(`( ${P11}, ${P12} )`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p9")].stateValues
                    .text,
            ).eq(`${P11}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p10")].stateValues
                    .text,
            ).eq(`${P12}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p11")].stateValues
                    .text,
            ).eq(``);

            // XXX: restore these assertions
            // expect(
            //     stateVariables[await resolvePathToNodeIdx("p12")].stateValues.text,
            // ).eq(`${P11}`);
            // expect(
            //     stateVariables[await resolvePathToNodeIdx("p13")].stateValues.text,
            // ).eq(`${P12}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p14")].stateValues
                    .text,
            ).eq(``);

            // XXX: restore this assertion
            // expect(
            //     stateVariables[await resolvePathToNodeIdx("p15")].stateValues.text,
            // ).eq(`( ${P21}, ${P22} )`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p16")].stateValues
                    .text,
            ).eq(`${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p17")].stateValues
                    .text,
            ).eq(`${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p18")].stateValues
                    .text,
            ).eq(``);
            // XXX: restore these assertions
            // expect(
            //     stateVariables[await resolvePathToNodeIdx("p19")].stateValues.text,
            // ).eq(`${P21}`);
            // expect(
            //     stateVariables[await resolvePathToNodeIdx("p20")].stateValues.text,
            // ).eq(`${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p21")].stateValues
                    .text,
            ).eq(``);

            expect(
                stateVariables[await resolvePathToNodeIdx("p22")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p23")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p24")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p25")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p26")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p27")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p28")].stateValues
                    .text,
            ).eq(``);

            // XXX: restore these assertions
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p29")].stateValues
            //             .text,
            //     ),
            // ).eq(`(${P11latex || P11},${P12}),(${P21},${P22})`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p30")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P11latex || P11},${P21}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p31")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P12},${P22}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p32")].stateValues
            //             .text,
            //     ),
            // ).eq(``);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p33")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P11latex || P11},${P21}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p34")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P12},${P22}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p35")].stateValues
            //             .text,
            //     ),
            // ).eq(``);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p36")].stateValues
            //             .text,
            //     ),
            // ).eq(`(${P11latex || P11},${P12})`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p37")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P11latex || P11}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p38")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P12}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p39")].stateValues
            //             .text,
            //     ),
            // ).eq(``);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p40")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P11latex || P11}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p41")].stateValues
            //             .text,
            //     ),
            // ).eq(`${P12}`);
            // expect(
            //     cleanLatex(
            //         stateVariables[await resolvePathToNodeIdx("p42")].stateValues
            //             .text,
            //     ),
            // ).eq(``);

            expect(
                stateVariables[await resolvePathToNodeIdx("p43")].stateValues
                    .text,
            ).eq(`${P11}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p44")].stateValues
                    .text,
            ).eq(`${P12}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p45")].stateValues
                    .text,
            ).eq(`${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p46")].stateValues
                    .text,
            ).eq(`${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p47")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p48")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p49")].stateValues
                    .text,
            ).eq(``);
            expect(
                stateVariables[await resolvePathToNodeIdx("p50")].stateValues
                    .text,
            ).eq(``);
        }

        await check_items({
            P11: "2/3",
            P12: "3",
            P21: "5",
            P22: "6",
            P11latex: "\\frac{2}{3}",
        });

        // move points

        await moveLine({
            componentIdx: await resolvePathToNodeIdx("l"),
            point1coords: [7, 8],
            point2coords: [9, 0],
            core,
        });

        await check_items({
            P11: "7",
            P12: "8",
            P21: "9",
            P22: "0",
        });
    });

    // TODO: convert this to extend?
    // Many won't work yet due, as we've lost some features as noted in the previous test
    it.skip("dot and array notation, chaining, specify attributes, macros", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph size="small">
      <line name="l" through="(3.92639372,9.8293629453) (0.9060742037,32.93520806203104)" displayDigits="2" />
    </graph>
    
    <p name="p1">$l.points.coords</p>
    <p name="p2">$l.points.x</p>
    <p name="p3">$l.points.y</p>
    <p name="p4">$l.points.bad</p>
    <p name="p5">$l.points.xs[1]</p>
    <p name="p6">$l.points.xs[2]</p>
    <p name="p7">$l.points.xs[3]</p>

    <p name="p8">$(l.points.coords{displayDecimals="4"})</p>
    <p name="p9">$(l.points.x{displayDecimals="4"})</p>
    <p name="p10">$(l.points.y{displayDecimals="4"})</p>
    <p name="p11">$(l.points.bad{displayDecimals="4"})</p>
    <p name="p12">$(l.points.xs[1]{displayDecimals="4"})</p>
    <p name="p13">$(l.points.xs[2]{displayDecimals="4"})</p>
    <p name="p14">$(l.points.xs[3]{displayDecimals="4"})</p>

    <p name="p15">$(l.points[1].coords{displayDecimals="4"})</p>
    <p name="p16">$(l.points[1].x{displayDecimals="4"})</p>
    <p name="p17">$(l.points[1].y{displayDecimals="4"})</p>
    <p name="p18">$(l.points[1].bad{displayDecimals="4"})</p>
    <p name="p19">$(l.points[1].xs[1]{displayDecimals="4"})</p>
    <p name="p20">$(l.points[1].xs[2]{displayDecimals="4"})</p>
    <p name="p21">$(l.points[1].xs[3]{displayDecimals="4"})</p>

    <p name="p22">$l.points.coords{displayDecimals="4"}</p>
    <p name="p23">$l.points{displayDecimals="4"}.x</p>
    <p name="p24">$l{displayDecimals="4"}.points.y</p>
    <p name="p25">$l.points.bad{displayDecimals="4"}</p>
    <p name="p26">$l.points.xs[1]{displayDecimals="4"}</p>
    <p name="p27">$l.points{displayDecimals="4"}.xs[2]</p>
    <p name="p28">$l{displayDecimals="4"}.points.xs[3]</p>

    <p name="p29">$l.points[1].coords{displayDecimals="4"}</p>
    <p name="p30">$l.points[1]{displayDecimals="4"}.x</p>
    <p name="p31">$l{displayDecimals="4"}.points[1].y</p>
    <p name="p32">$l.points[1].bad{displayDecimals="4"}</p>
    <p name="p33">$l.points[1].xs[1]{displayDecimals="4"}</p>
    <p name="p34">$l.points[1]{displayDecimals="4"}.xs[2]</p>
    <p name="p35">$l{displayDecimals="4"}.points[1].xs[3]</p>

    <p name="p36">$l{displayDecimals="4"}.latex</p>
    <p name="p37">$(l{displayDigits="3"}.points{displayDecimals="4"})</p>
    <p name="p38">$(l{displayDigits="3"}.points[1]{displayDecimals="4"})</p>
    
    `,
        });

        function round({
            val,
            digits,
            decimals,
        }: {
            val: number;
            digits?: number;
            decimals?: number;
        }) {
            return me.round_numbers_to_precision_plus_decimals(
                val,
                digits === undefined ? 0 : digits,
                decimals === undefined ? -Infinity : decimals,
            ).tree;
        }

        let P11 = 3.92639372,
            P12 = 9.8293629453,
            P21 = 0.9060742037,
            P22 = 32.93520806203104;

        let P11Dig2 = round({ val: P11, digits: 2 });
        let P12Dig2 = round({ val: P12, digits: 2 });
        let P21Dig2 = round({ val: P21, digits: 2 });
        let P22Dig2 = round({ val: P22, digits: 2 });

        let P11Dec4 = round({ val: P11, decimals: 4 });
        let P12Dec4 = round({ val: P12, decimals: 4 });
        let P21Dec4 = round({ val: P21, decimals: 4 });
        let P22Dec4 = round({ val: P22, decimals: 4 });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`( ${P11Dig2}, ${P12Dig2} ), ( ${P21Dig2}, ${P22Dig2} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${P11Dig2}, ${P21Dig2}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(`${P12Dig2}, ${P22Dig2}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq(``);
        expect(
            stateVariables[await resolvePathToNodeIdx("p5")].stateValues.text,
        ).eq(`${P11Dig2}, ${P21Dig2}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p6")].stateValues.text,
        ).eq(`${P12Dig2}, ${P22Dig2}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p7")].stateValues.text,
        ).eq(``);

        expect(
            stateVariables[await resolvePathToNodeIdx("p8")].stateValues.text,
        ).eq(`( ${P11Dec4}, ${P12Dec4} ), ( ${P21Dec4}, ${P22Dec4} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p9")].stateValues.text,
        ).eq(`${P11Dec4}, ${P21Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p10")].stateValues.text,
        ).eq(`${P12Dec4}, ${P22Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p11")].stateValues.text,
        ).eq(``);
        expect(
            stateVariables[await resolvePathToNodeIdx("p12")].stateValues.text,
        ).eq(`${P11Dec4}, ${P21Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p13")].stateValues.text,
        ).eq(`${P12Dec4}, ${P22Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p14")].stateValues.text,
        ).eq(``);

        expect(
            stateVariables[await resolvePathToNodeIdx("p15")].stateValues.text,
        ).eq(`( ${P11Dec4}, ${P12Dec4} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p16")].stateValues.text,
        ).eq(`${P11Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p17")].stateValues.text,
        ).eq(`${P12Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p18")].stateValues.text,
        ).eq(``);
        expect(
            stateVariables[await resolvePathToNodeIdx("p19")].stateValues.text,
        ).eq(`${P11Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p20")].stateValues.text,
        ).eq(`${P12Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p21")].stateValues.text,
        ).eq(``);

        expect(
            stateVariables[await resolvePathToNodeIdx("p22")].stateValues.text,
        ).eq(`( ${P11Dec4}, ${P12Dec4} ), ( ${P21Dec4}, ${P22Dec4} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p23")].stateValues.text,
        ).eq(`${P11Dec4}, ${P21Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p24")].stateValues.text,
        ).eq(`${P12Dec4}, ${P22Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p25")].stateValues.text,
        ).eq(``);
        expect(
            stateVariables[await resolvePathToNodeIdx("p26")].stateValues.text,
        ).eq(`${P11Dec4}, ${P21Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p27")].stateValues.text,
        ).eq(`${P12Dec4}, ${P22Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p28")].stateValues.text,
        ).eq(``);

        expect(
            stateVariables[await resolvePathToNodeIdx("p29")].stateValues.text,
        ).eq(`( ${P11Dec4}, ${P12Dec4} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p30")].stateValues.text,
        ).eq(`${P11Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p31")].stateValues.text,
        ).eq(`${P12Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p32")].stateValues.text,
        ).eq(``);
        expect(
            stateVariables[await resolvePathToNodeIdx("p33")].stateValues.text,
        ).eq(`${P11Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p34")].stateValues.text,
        ).eq(`${P12Dec4}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p35")].stateValues.text,
        ).eq(``);

        expect(
            stateVariables[await resolvePathToNodeIdx("p36")].stateValues.text,
        ).eq("0 = -23.1058 x - 3.0203 y + 120.4105");

        expect(
            stateVariables[await resolvePathToNodeIdx("p37")].stateValues.text,
        ).eq(`( ${P11Dec4}, ${P12Dec4} ), ( ${P21Dec4}, ${P22Dec4} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p38")].stateValues.text,
        ).eq(`( ${P11Dec4}, ${P12Dec4} )`);
    });

    // TODO: convert this into extend, though many after restoring functionality lost that's mentioned above
    it.skip("dot and array notation, chaining, copy source, change type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph size="small">
      <line name="l" through="(2/3,3/4) (5/8,6/10)" displayDigits="2" />
    </graph>
    
    <p name="p1"><asList><copy source="l.points.coords" createComponentOfType="math" numComponents="2" /></asList></p>
    <p name="p2"><asList><copy source="l.points.x" createComponentOfType="number" numComponents="2" /></asList></p>
    <p name="p3"><asList><copy source="l.points.y" createComponentOfType="number" numComponents="2" /></asList></p>
    <p name="p4"><asList><copy source="l.points.bad" createComponentOfType="number" numComponents="2" /></asList></p>
    <p name="p5"><asList><copy source="l.points.xs[1]" createComponentOfType="number" numComponents="2" /></asList></p>
    <p name="p6"><asList><copy source="l.points.xs[2]" createComponentOfType="number" numComponents="2" /></asList></p>
    <p name="p7"><asList><copy source="l.points.xs[3]" createComponentOfType="number" numComponents="2" /></asList></p>

    <p name="p8"><math extend="$l.points[1].coords" /></p>
    <p name="p9"><number extend="$l.points[1].x" /></p>
    <p name="p10"><number extend="$l.points[1].y" /></p>
    <p name="p11"><number extend="$l.points[1].bad" /></p>
    <p name="p12"><number extend="$l.points[1].xs[1]" /></p>
    <p name="p13"><number extend="$l.points[1].xs[2]" /></p>
    <p name="p14"><number extend="$l.points[1].xs[3]" /></p>

    <p name="p15"><math extend="$l.points[2].coords" /></p>
    <p name="p16"><number extend="$l.points[2].x" /></p>
    <p name="p17"><number extend="$l.points[2].y" /></p>
    <p name="p18"><number extend="$l.points[2].bad" /></p>
    <p name="p19"><number extend="$l.points[2].xs[1]" /></p>
    <p name="p20"><number extend="$l.points[2].xs[2]" /></p>
    <p name="p21"><number extend="$l.points[2].xs[3]" /></p>

    <p name="p22"><math extend="$l.points[3].coords" /></p>
    <p name="p23"><number extend="$l.points[3].x" /></p>
    <p name="p24"><number extend="$l.points[3].y" /></p>
    <p name="p25"><number extend="$l.points[3].bad" /></p>
    <p name="p26"><number extend="$l.points[3].xs[1]" /></p>
    <p name="p27"><number extend="$l.points[3].xs[2]" /></p>
    <p name="p28"><number extend="$l.points[3].xs[3]" /></p>

    <p name="p29"><asList><copy source="l.points.coords.latex" createComponentOfType="text" numComponents="2" /></asList></p>
    <p name="p30"><asList><copy source="l.points.x.latex" createComponentOfType="text" numComponents="2" /></asList></p>
    <p name="p31"><asList><copy source="l.points.y.latex" createComponentOfType="text" numComponents="2" /></asList></p>
    <p name="p32"><asList><copy source="l.points.bad.latex" createComponentOfType="text" numComponents="2" /></asList></p>
    <p name="p33"><asList><copy source="l.points.xs[1].latex" createComponentOfType="text" numComponents="2" /></asList></p>
    <p name="p34"><asList><copy source="l.points.xs[2].latex" createComponentOfType="text" numComponents="2" /></asList></p>
    <p name="p35"><asList><copy source="l.points.xs[3].latex" createComponentOfType="text" numComponents="2" /></asList></p>
    
    <p name="p36"><text extend="$l.points[1].coords.latex" /></p>
    <p name="p37"><text extend="$l.points[1].x.latex" /></p>
    <p name="p38"><text extend="$l.points[1].y.latex" /></p>
    <p name="p39"><text extend="$l.points[1].bad.latex" /></p>
    <p name="p40"><text extend="$l.points[1].xs[1].latex" /></p>
    <p name="p41"><text extend="$l.points[1].xs[2].latex" /></p>
    <p name="p42"><text extend="$l.points[1].xs[3].latex" /></p>
    
    <p name="p43"><number extend="$l.points[1][1]" /></p>
    <p name="p44"><number extend="$l.points[1][2]" /></p>
    <p name="p45"><number extend="$l.points[2][1]" /></p>
    <p name="p46"><number extend="$l.points[2][2]" /></p>
    <p name="p47"><number extend="$l.points[0][1]" /></p>
    <p name="p48"><number extend="$l.points[1][0]" /></p>
    <p name="p49"><number extend="$l.points[1][3]" /></p>
    <p name="p50"><number extend="$l.points[3][1]" /></p>
    `,
        });

        async function check_items({
            P11,
            P12,
            P21,
            P22,
            P11latex,
            P12latex,
            P21latex,
            P22latex,
            P11string,
            P12string,
            P21string,
            P22string,
        }: {
            P11: number;
            P12: number;
            P21: number;
            P22: number;
            P11latex?: string;
            P12latex?: string;
            P21latex?: string;
            P22latex?: string;
            P11string?: string;
            P12string?: string;
            P21string?: string;
            P22string?: string;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .text,
            ).eq(
                `( ${P11string || P11}, ${P12string || P12} ), ( ${P21string || P21}, ${P22string || P22} )`,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).eq(`${P11}, ${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .text,
            ).eq(`${P12}, ${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p4")].stateValues
                    .text,
            ).eq(`NaN, NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p5")].stateValues
                    .text,
            ).eq(`${P11}, ${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p6")].stateValues
                    .text,
            ).eq(`${P12}, ${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p7")].stateValues
                    .text,
            ).eq(`NaN, NaN`);

            expect(
                stateVariables[await resolvePathToNodeIdx("p8")].stateValues
                    .text,
            ).eq(`( ${P11string || P11}, ${P12string || P12} )`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p9")].stateValues
                    .text,
            ).eq(`${P11}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p10")].stateValues
                    .text,
            ).eq(`${P12}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p11")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p12")].stateValues
                    .text,
            ).eq(`${P11}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p13")].stateValues
                    .text,
            ).eq(`${P12}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p14")].stateValues
                    .text,
            ).eq(`NaN`);

            expect(
                stateVariables[await resolvePathToNodeIdx("p15")].stateValues
                    .text,
            ).eq(`( ${P21string || P21}, ${P22string || P22} )`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p16")].stateValues
                    .text,
            ).eq(`${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p17")].stateValues
                    .text,
            ).eq(`${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p18")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p19")].stateValues
                    .text,
            ).eq(`${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p20")].stateValues
                    .text,
            ).eq(`${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p21")].stateValues
                    .text,
            ).eq(`NaN`);

            expect(
                stateVariables[await resolvePathToNodeIdx("p22")].stateValues
                    .text,
            ).eq(`\uff3f`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p23")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p24")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p25")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p26")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p27")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p28")].stateValues
                    .text,
            ).eq(`NaN`);

            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p29")]
                        .stateValues.text,
                ),
            ).eq(
                `(${P11latex || P11},${P12latex || P12}),(${P21latex || P21},${P22latex || P22})`,
            );
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p30")]
                        .stateValues.text,
                ),
            ).eq(`${P11latex || P11},${P21latex || P21}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p31")]
                        .stateValues.text,
                ),
            ).eq(`${P12latex || P12},${P22latex || P22}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p32")]
                        .stateValues.text,
                ),
            ).eq(``);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p33")]
                        .stateValues.text,
                ),
            ).eq(`${P11latex || P11},${P21latex || P21}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p34")]
                        .stateValues.text,
                ),
            ).eq(`${P12latex || P12},${P22latex || P22}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p35")]
                        .stateValues.text,
                ),
            ).eq(``);

            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p36")]
                        .stateValues.text,
                ),
            ).eq(`(${P11latex || P11},${P12latex || P12})`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p37")]
                        .stateValues.text,
                ),
            ).eq(`${P11latex || P11}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p38")]
                        .stateValues.text,
                ),
            ).eq(`${P12latex || P12}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p39")]
                        .stateValues.text,
                ),
            ).eq(``);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p40")]
                        .stateValues.text,
                ),
            ).eq(`${P11latex || P11}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p41")]
                        .stateValues.text,
                ),
            ).eq(`${P12latex || P12}`);
            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx("p42")]
                        .stateValues.text,
                ),
            ).eq(``);

            expect(
                stateVariables[await resolvePathToNodeIdx("p43")].stateValues
                    .text,
            ).eq(`${P11}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p44")].stateValues
                    .text,
            ).eq(`${P12}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p45")].stateValues
                    .text,
            ).eq(`${P21}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p46")].stateValues
                    .text,
            ).eq(`${P22}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p47")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p48")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p49")].stateValues
                    .text,
            ).eq(`NaN`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p50")].stateValues
                    .text,
            ).eq(`NaN`);
        }

        await check_items({
            P11: 0.67,
            P12: 0.75,
            P21: 0.63,
            P22: 0.6,
            P11latex: "\\frac{2}{3}",
            P12latex: "\\frac{3}{4}",
            P21latex: "\\frac{5}{8}",
            P22latex: "\\frac{3}{5}",
            P11string: "2/3",
            P12string: "3/4",
            P21string: "5/8",
            P22string: "3/5",
        });

        // move points
        await moveLine({
            componentIdx: await resolvePathToNodeIdx("l"),
            point1coords: [7, 8],
            point2coords: [9, 0],
            core,
        });

        await check_items({
            P11: 7,
            P12: 8,
            P21: 9,
            P22: 0,
        });
    });

    // TODO: convert this once functionality is restored
    it.skip("dot and array notation, multidimensional, dynamic", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph size="small">
      <line through="(1,2) (3,4)" />
      <line through="(5,7) (9,6)" />
    </graph>

    <graph size="small">
      <collect name="col" componentTypes="line" source="_graph1" />
    </graph>

    <p>Line number: <mathInput name="ln" prefill="1" /></p>
    <p>Point number: <mathInput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathInput name="cn" prefill="1" /></p>

    
    <p name="p1">$col[$ln].points[$pn][$cn]</p>
    <p name="p2"><copy source="col[$ln].points[$pn][$cn]" /></p>
    <p name="p3">$col[$ln].points[$pn].xs[$cn]</p>
    <p name="p4"><copy source="col[$ln].points[$pn].xs[$cn]" /></p>
    
    `,
        });

        async function check_items({
            ln,
            pn,
            cn,
        }: {
            ln: number;
            pn: number;
            cn: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let values = [
                [
                    [1, 2],
                    [3, 4],
                ],
                [
                    [5, 7],
                    [9, 6],
                ],
            ];

            let val = values[ln - 1]?.[pn - 1]?.[cn - 1];

            if (val !== undefined) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                        .text,
                ).eq(`${val}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                        .text,
                ).eq(`${val}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                        .text,
                ).eq(`${val}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("p4")].stateValues
                        .text,
                ).eq(`${val}`);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                        .text,
                ).eq("");
                expect(
                    stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                        .text,
                ).eq("");
                expect(
                    stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                        .text,
                ).eq("");
                expect(
                    stateVariables[await resolvePathToNodeIdx("p4")].stateValues
                        .text,
                ).eq("");
            }
        }

        await check_items({ ln: 1, pn: 1, cn: 1 });

        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("ln"),
            core,
        });
        await check_items({ ln: 0, pn: 1, cn: 1 });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("ln"),
            core,
        });
        await check_items({ ln: 2, pn: 1, cn: 1 });

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("pn"),
            core,
        });
        await check_items({ ln: 2, pn: 0, cn: 1 });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("pn"),
            core,
        });
        await check_items({ ln: 2, pn: 2, cn: 1 });

        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("cn"),
            core,
        });
        await check_items({ ln: 2, pn: 2, cn: 0 });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("cn"),
            core,
        });
        await check_items({ ln: 2, pn: 2, cn: 2 });
    });

    it("dot and array notation, recurse to subnames of composite replacements", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>n: <mathInput name="n" prefill="2" /></p>

    <repeatForSequence name="myRepeat" from="1" to="$n" valueName="v">
        <p>The line through 
          <m>P=<point name="P">($v+1,$v+2)</point></m> and <m>Q=<point name="Q">($v+4, $v-1)</point></m>
          is <line name="l" through="$P $Q" />.</p>
    </repeatForSequence>

    <p>Template number: <mathInput name="tn" prefill="1" /></p>
    <p>Point number: <mathInput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathInput name="cn" prefill="1" /></p>

    <p name="pt">The points from item $tn are: $myRepeat[$tn].P and $myRepeat[$tn].Q.</p>
    <p name="pp">Point $pn from the line in that item is: $myRepeat[$tn].l.points[$pn].</p>
    <p name="pc">Coordinate $cn from that point is $myRepeat[$tn].l.points[$pn].xs[$cn].</p>

    `,
        });

        let Pxs = [2, 3, 4, 5, 6];
        let Pys = [3, 4, 5, 6, 7];
        let Qxs = [5, 6, 7, 8, 9];
        let Qys = [0, 1, 2, 3, 4];

        async function check_items(n, tn, pn, cn) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (!(n >= 1 && tn <= n)) {
                // we have nothing
                expect(
                    stateVariables[await resolvePathToNodeIdx("pt")].stateValues
                        .text,
                ).contain("are:  and .");
                expect(
                    stateVariables[await resolvePathToNodeIdx("pp")].stateValues
                        .text,
                ).contain("from the line in that item is: .");
                expect(
                    stateVariables[await resolvePathToNodeIdx("pc")].stateValues
                        .text,
                ).contain("from that point is .");
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("pt")].stateValues
                        .text,
                ).contain(
                    `are: ( ${Pxs[tn - 1]}, ${Pys[tn - 1]} ) and ( ${Qxs[tn - 1]}, ${Qys[tn - 1]} ).`,
                );

                if (pn === 1) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("pp")]
                            .stateValues.text,
                    ).contain(
                        `from the line in that item is: ( ${Pxs[tn - 1]}, ${Pys[tn - 1]} ).`,
                    );

                    // XXX: restore these assertions
                    // if (cn === 1) {
                    //     expect(
                    //         stateVariables[await resolvePathToNodeIdx("pc")]
                    //             .stateValues.text,
                    //     ).contain(`from that point is ${Pxs[tn - 1]}.`);
                    // } else if (cn === 2) {
                    //     expect(
                    //         stateVariables[await resolvePathToNodeIdx("pc")]
                    //             .stateValues.text,
                    //     ).contain(`from that point is ${Pys[tn - 1]}.`);
                    // } else {
                    //     expect(
                    //         stateVariables[await resolvePathToNodeIdx("pc")]
                    //             .stateValues.text,
                    //     ).contain("from that point is .");
                    // }
                } else if (pn === 2) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("pp")]
                            .stateValues.text,
                    ).contain(
                        `from the line in that item is: ( ${Qxs[tn - 1]}, ${Qys[tn - 1]} ).`,
                    );

                    // XXX: restore these assertions
                    // if (cn === 1) {
                    //     expect(
                    //         stateVariables[await resolvePathToNodeIdx("pc")]
                    //             .stateValues.text,
                    //     ).contain(`from that point is ${Qxs[tn - 1]}.`);
                    // } else if (cn === 2) {
                    //     expect(
                    //         stateVariables[await resolvePathToNodeIdx("pc")]
                    //             .stateValues.text,
                    //     ).contain(`from that point is ${Qys[tn - 1]}.`);
                    // } else {
                    //     expect(
                    //         stateVariables[await resolvePathToNodeIdx("pc")]
                    //             .stateValues.text,
                    //     ).contain("from that point is .");
                    // }
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("pp")]
                            .stateValues.text,
                    ).contain("from the line in that item is: .");
                    expect(
                        stateVariables[await resolvePathToNodeIdx("pc")]
                            .stateValues.text,
                    ).contain("from that point is .");
                }
            }
        }

        await check_items(2, 1, 1, 1);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("tn"),
            core,
        });
        await check_items(2, 2, 1, 1);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("tn"),
            core,
        });
        await check_items(2, 3, 1, 1);

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(4, 3, 1, 1);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("pn"),
            core,
        });
        await check_items(4, 3, 3, 1);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("pn"),
            core,
        });
        await check_items(4, 3, 2, 1);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("cn"),
            core,
        });
        await check_items(4, 3, 2, 3);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("cn"),
            core,
        });
        await check_items(4, 3, 2, 2);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(3, 3, 2, 2);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(1, 3, 2, 2);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("tn"),
            core,
        });
        await check_items(1, 1, 2, 2);
    });

    it("dot and array notation from group", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="grp">
      <math>x</math>
      copied will be blank
      <text fixed>hello</text>
      copied will also be blank
      <point>(4,5)</point>
      <line through="(10,9) (9,8)" />
      <p>A <math name="m">y</math> and a <text name="t">word</text>.</p>
    </group>
    
    <p name="p1">the math: $grp[1]</p>
    <p name="p2">a blank: $grp[2]</p>
    <p name="p3">the text: $grp[3]</p>
    <p name="p4">another blank: $grp[4]</p>
    <p name="p5">the point: $grp[5]</p>
    <p name="p6">the point x: $grp[5].x</p>
    <p name="p7">the line: $grp[6]</p>
    <p name="p8">the line, point 1: $grp[6].points[1]</p>
    <p name="p9">the line, point 2, y: $grp[6].points[2].y</p>
    <p name="p10">math from p: $grp[7].m</p>
    <p name="p11">text from p: $grp[7].t</p>
    <p name="p12">nothing: $grp[8]</p>
    <p name="p13">Prop fixed from group: $grp.fixed</p>
    <p name="p14">Prop x from group: $grp.x</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("the math: x");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("a blank: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("the text: hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("another blank: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p5")].stateValues.text,
        ).eq("the point: ( 4, 5 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p6")].stateValues.text,
        ).eq("the point x: 4");
        expect(
            stateVariables[await resolvePathToNodeIdx("p7")].stateValues.text,
        ).eq("the line: 0 = x - y - 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p8")].stateValues.text,
        ).eq("the line, point 1: ( 10, 9 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p9")].stateValues.text,
        ).eq("the line, point 2, y: 8");
        expect(
            stateVariables[await resolvePathToNodeIdx("p10")].stateValues.text,
        ).eq("math from p: y");
        expect(
            stateVariables[await resolvePathToNodeIdx("p11")].stateValues.text,
        ).eq("text from p: word");
        expect(
            stateVariables[await resolvePathToNodeIdx("p12")].stateValues.text,
        ).eq("nothing: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("p13")].stateValues.text,
        ).eq("Prop fixed from group: falsetruefalsefalsefalse");
        expect(
            stateVariables[await resolvePathToNodeIdx("p14")].stateValues.text,
        ).eq("Prop x from group: x4");
    });

    it("implicitProp from an input", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput prefill="x+x" name="mi" />

    <p name="pref1">$mi</p>
    <p name="pextend1"><math extend="$mi" /></p>
    <p name="pextend2"><math extend="$mi" simplify /></p>
    <p name="pextend3"><mathInput extend="$mi" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let macrom1Name =
            stateVariables[await resolvePathToNodeIdx("pref1")]
                .activeChildren[0].componentIdx;
        let extendm1Name =
            stateVariables[await resolvePathToNodeIdx("pextend1")]
                .activeChildren[0].componentIdx;
        let extendm2Name =
            stateVariables[await resolvePathToNodeIdx("pextend2")]
                .activeChildren[0].componentIdx;
        let extendmi3Name =
            stateVariables[await resolvePathToNodeIdx("pextend3")]
                .activeChildren[0].componentIdx;

        expect(stateVariables[macrom1Name].componentType).eq("math");
        expect(stateVariables[extendm1Name].componentType).eq("math");
        expect(stateVariables[extendm2Name].componentType).eq("math");
        expect(stateVariables[extendmi3Name].componentType).eq("mathInput");
        expect(stateVariables[macrom1Name].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
        ]);
        expect(stateVariables[extendm1Name].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
        ]);
        expect(stateVariables[extendm2Name].stateValues.value.tree).eqls([
            "*",
            2,
            "x",
        ]);
        expect(stateVariables[extendmi3Name].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
        ]);
    });

    it("implicitProp with same componentType depend on attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" simplify><math name="msub">x</math>+x</math>
    <math extend="$m" name="m1" />
    <math name="m2" extend="$m" simplify="false" />

    <math name="msub1" extend="$m1.msub" />
    <math name="msub2" extend="$m2.msub" />

    <p name="pmImplicit">$m</p>
    <p name="pmSubImplicit1">$m1.msub</p>
    <p name="pmSubImplicit2">$m2.msub</p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", "x", "x"]);

        expect(
            stateVariables[await resolvePathToNodeIdx("msub1")].stateValues
                .value.tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("msub2")].stateValues
                .value.tree,
        ).eqls("x");

        const mImplicit =
            stateVariables[await resolvePathToNodeIdx("pmImplicit")]
                .activeChildren[0].componentIdx;
        const mSubImplicit1 =
            stateVariables[await resolvePathToNodeIdx("pmSubImplicit1")]
                .activeChildren[0].componentIdx;
        const mSubImplicit2 =
            stateVariables[await resolvePathToNodeIdx("pmSubImplicit2")]
                .activeChildren[0].componentIdx;
        expect(stateVariables[mImplicit].stateValues.value.tree).eqls([
            "*",
            2,
            "x",
        ]);
        expect(stateVariables[mSubImplicit1].stateValues.value.tree).eqls("x");
        expect(stateVariables[mSubImplicit2].stateValues.value.tree).eqls("x");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].activeChildren
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].activeChildren
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("msub1")].activeChildren
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("msub2")].activeChildren
                .length,
        ).eq(1);

        expect(stateVariables[mImplicit].activeChildren.length).eq(0);
        expect(stateVariables[mSubImplicit1].activeChildren.length).eq(0);
        expect(stateVariables[mSubImplicit2].activeChildren.length).eq(0);
    });

    it("references of composites ignore implicitProp", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="g">
      <mathInput prefill="x" />
      <mathInput prefill="y" />
    </group>

    <p><collect componentType="mathInput" from="$g" name="col" /></p>

    <p name="pRef">$col</p>

    <p name="pRef2">$g</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let [refmi1Name, refmi2Name] = stateVariables[
            await resolvePathToNodeIdx("pRef")
        ].activeChildren.map((x) => x.componentIdx);
        let [refmi1Name2, refmi2Name2] = stateVariables[
            await resolvePathToNodeIdx("pRef2")
        ].activeChildren
            .filter((x) => x.componentIdx != null)
            .map((x) => x.componentIdx);

        expect(stateVariables[refmi1Name].componentType).eq("mathInput");
        expect(stateVariables[refmi2Name].componentType).eq("mathInput");
        expect(stateVariables[refmi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[refmi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[refmi1Name2].componentType).eq("mathInput");
        expect(stateVariables[refmi2Name2].componentType).eq("mathInput");
        expect(stateVariables[refmi1Name2].stateValues.value.tree).eq("x");
        expect(stateVariables[refmi2Name2].stateValues.value.tree).eq("y");
    });

    it("copies of composites with subnames do not ignore implicitProp", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeat name="repeat" for="x y" valueName="v">
      <mathInput name="mi" prefill="$v" />
    </repeat>

    <p name="pRef">$repeat</p>

    <p name="pRefInd">$repeat[1]$repeat[2]</p>

    <p name="pRefSubname">$repeat[1].mi$repeat[2].mi</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let [refmi1Name, refmi2Name] = stateVariables[
            await resolvePathToNodeIdx("pRef")
        ].activeChildren.map((x) => x.componentIdx);
        let [refIndmi1Name, refIndmi2Name] = stateVariables[
            await resolvePathToNodeIdx("pRefInd")
        ].activeChildren.map((x) => x.componentIdx);
        let [refSubnamem1Name, refSubnamem2Name] = stateVariables[
            await resolvePathToNodeIdx("pRefSubname")
        ].activeChildren.map((x) => x.componentIdx);

        expect(stateVariables[refmi1Name].componentType).eq("mathInput");
        expect(stateVariables[refmi2Name].componentType).eq("mathInput");
        expect(stateVariables[refIndmi1Name].componentType).eq("mathInput");
        expect(stateVariables[refIndmi2Name].componentType).eq("mathInput");
        expect(stateVariables[refSubnamem1Name].componentType).eq("math");
        expect(stateVariables[refSubnamem2Name].componentType).eq("math");
        expect(stateVariables[refmi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[refmi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[refIndmi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[refIndmi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[refSubnamem1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[refSubnamem2Name].stateValues.value.tree).eq("y");
    });

    it("asList when copy array prop", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <choiceInput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceInput>

    <p name="default">Default: $ci.choiceTexts</p>
    <p name="nocommas">No commas: <textList extend="$ci.choiceTexts" asList="false" /></p>
    <p name="withcommas">With commas: <textList extend="$ci.choiceTexts" asList="true" /></p>
    <p name="default2" extend="$default" />
    <p name="nocommas2" extend="$nocommas" />
    <p name="withcommas2" extend="$withcommas" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("default")].stateValues
                .text,
        ).eq("Default: yes, no, maybe");
        expect(
            stateVariables[await resolvePathToNodeIdx("nocommas")].stateValues
                .text,
        ).eq("No commas: yesnomaybe");
        expect(
            stateVariables[await resolvePathToNodeIdx("withcommas")].stateValues
                .text,
        ).eq("With commas: yes, no, maybe");
        expect(
            stateVariables[await resolvePathToNodeIdx("default2")].stateValues
                .text,
        ).eq("Default: yes, no, maybe");
        expect(
            stateVariables[await resolvePathToNodeIdx("nocommas2")].stateValues
                .text,
        ).eq("No commas: yesnomaybe");
        expect(
            stateVariables[await resolvePathToNodeIdx("withcommas2")]
                .stateValues.text,
        ).eq("With commas: yes, no, maybe");
    });

    // TODO: restore this functionality?
    it.skip("asList when copy array prop, multiple stacked props", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <line name="l" through="(1,2) (3,4)" />

    <p name="default">Default: $l.points.x</p>
    <p name="nocommas">No commas: $l.points.x{asList="false"}</p>
    <p name="withcommas">With commas: $l.points.x{asList="true"}</p>
    <p name="default2" extend="$default" />
    <p name="nocommas2" extend="$nocommas" />
    <p name="withcommas2" extend="$withcommas" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("default")].stateValues
                .text,
        ).eq("Default: 1, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("nocommas")].stateValues
                .text,
        ).eq("No commas: 13");
        expect(
            stateVariables[await resolvePathToNodeIdx("withcommas")].stateValues
                .text,
        ).eq("With commas: 1, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("default2")].stateValues
                .text,
        ).eq("Default: 1, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("nocommas2")].stateValues
                .text,
        ).eq("No commas: 13");
        expect(
            stateVariables[await resolvePathToNodeIdx("withcommas2")]
                .stateValues.text,
        ).eq("With commas: 1, 3");
    });

    it("asList when copy array prop, asList overrides", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <choiceInput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceInput>

    
    <p name="p1">Override no commas: <asList name="nocommas"><textList extend="$ci.choiceTexts" asList="false" /></asList></p>
    <p name="p2">Copy: <asList name="nocommas2" extend="$nocommas" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Override no commas: yes, no, maybe");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Copy: yes, no, maybe");
    });

    it("correctly wrap replacement changes when verifying to force component type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <answer name="ans">47</answer>
        <number extend="$ans.submittedResponse" name="num" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const tiIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("num")].stateValues.value,
        ).eqls(NaN);

        await updateMathInputValue({ latex: "4", componentIdx: tiIdx, core });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("num")].stateValues.value,
        ).eq(4);

        await updateMathInputValue({
            latex: "47",
            componentIdx: tiIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("num")].stateValues.value,
        ).eq(47);
    });

    it("recursive extends", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="orig"><text name="t">hello</text></group>
    
    <p>copy:  <group extend="$orig" name="cN" /></p>
    <p>copy of copy: <group extend="$cN" name="cNc" /></p>

    <p>copy of copy of copy: <group extend="$cNc" name="cNcc" /></p>
    
    <p>piece of copy: <text extend="$cN.t" name="cNt" /></p>
    <p>piece of copy of copy: <text extend="$cNc.t" name="cNct" /></p>

    <p>piece of copy of copy of copy: <text extend="$cNcc.t" name="cNcct" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].componentType,
        ).eq("group");
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).eq("hello");

        expect(
            stateVariables[await resolvePathToNodeIdx("cN")].componentType,
        ).eq("group");
        expect(
            stateVariables[await resolvePathToNodeIdx("cN.t")].stateValues
                .value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("cNt")].stateValues.value,
        ).eq("hello");

        expect(
            stateVariables[await resolvePathToNodeIdx("cNc")].componentType,
        ).eq("group");
        expect(
            stateVariables[await resolvePathToNodeIdx("cNc.t")].stateValues
                .value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("cNct")].stateValues
                .value,
        ).eq("hello");

        expect(
            stateVariables[await resolvePathToNodeIdx("cNcc")].componentType,
        ).eq("group");
        expect(
            stateVariables[await resolvePathToNodeIdx("cNcc.t")].stateValues
                .value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("cNcct")].stateValues
                .value,
        ).eq("hello");
    });

    it("reference name with hypen using parens", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="the-base">x</math>
    <p name="p">$(the-base)</p>
    <math name="m2" extend="$(the-base)">+y</math>
    <math name="m3" copy="$(the-base)">y</math>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let m1 =
            stateVariables[await resolvePathToNodeIdx("p")].activeChildren[0]
                .componentIdx;

        expect(stateVariables[m1].stateValues.value.tree).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
    });

    it("handle extending or copying with invalid component type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <graph>
            <point name="p" >(3,4)</point>
        </graph>
        <graph name="g2">
            <invalidName extend="$p" name="p2" /><anotherInvalidName copy="$p" name="p3" />
        </graph>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            `Cannot extend or copy an unrecognized component type: invalidName`,
        );

        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(6);
        expect(errorWarnings.warnings[0].position.start.column).eq(13);
        expect(errorWarnings.warnings[0].position.end.line).eq(6);
        expect(errorWarnings.warnings[0].position.end.column).eq(50);

        expect(errorWarnings.warnings[1].message).contain(
            `Cannot extend or copy an unrecognized component type: anotherInvalidName`,
        );

        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.start.line).eq(6);
        expect(errorWarnings.warnings[1].position.start.column).eq(50);
        expect(errorWarnings.warnings[1].position.end.line).eq(6);
        expect(errorWarnings.warnings[1].position.end.column).eq(92);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([3, 4]);
        expect(stateVariables[await resolvePathToNodeIdx("p2")]).eq(undefined);
        expect(stateVariables[await resolvePathToNodeIdx("p3")]).eq(undefined);

        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].activeChildren
                .length,
        ).eq(0);
    });

    it("reference inside composite adds to index resolution but not names", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><text name="t">hi</text></p>

    <section name="sec1">
        $p
    </section>

    <section name="sec2">
        <group name="g">$p</group>
    </section>


    <section name="sec3">
       <p>Reference &dollar;p does not add ability to reference names: ($sec1.t, $sec1.p).</p>
    </section>

    <section name="sec4">
        <p>Nor can one reference by names from the group: ($sec2.g.t, $sec2.g.p).</p>
    </section>

    <section name="sec5">
        <p>One can reference by group index: $sec2.g[1].t.</p>$sec2.g[1]
    </section>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("sec1")]
                    .activeChildren[1].componentIdx
            ].stateValues.text,
        ).eq("hi");

        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("sec2")]
                    .activeChildren[1].componentIdx
            ].stateValues.text,
        ).eq("hi");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("sec3")]
                    .activeChildren[1].componentIdx
            ].stateValues.text,
        ).eq(
            "Reference $\u200Bp does not add ability to reference names: (, ).",
        );
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("sec4")]
                    .activeChildren[1].componentIdx
            ].stateValues.text,
        ).eq("Nor can one reference by names from the group: (, ).");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("sec5")]
                    .activeChildren[1].componentIdx
            ].stateValues.text,
        ).eq("One can reference by group index: hi.");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("sec5")]
                    .activeChildren[2].componentIdx
            ].stateValues.text,
        ).eq("hi");
    });

    it("dynamically change index resolutions with reference inside composite", async () => {
        // Note: cypress test of same name in `renderCommas.cy.js` tests the DOM
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n">1</mathInput>
    <sequence name="s" length="$n" />

    <section name="sec1">
        <p name="p"><group name="g" asList>-6 $s-8</group></p>

        <p extend="$p" name="p2" />

        <p name="p3">3rd entry: $g[3], $p2.g[3]</p>
    </section>

    <section name="sec2">
        <p name="p"><group name="g" asList><number>-6</number>$s<number>-8</number></group></p>

        <p extend="$p" name="p2" />

        <p name="p3">3rd entry: $g[3], $p2.g[3]</p>
    </section>


    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let pText = "-6, 1, -8";

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p3")].stateValues
                .text,
        ).eq("3rd entry: , ");

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p3")].stateValues
                .text,
        ).eq("3rd entry: -8, -8");

        // Add another replacement, shifting so that the third entry comes from the sequence
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        pText = "-6, 1, 2, -8";

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p3")].stateValues
                .text,
        ).eq("3rd entry: 2, 2");

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p3")].stateValues
                .text,
        ).eq("3rd entry: 2, 2");

        // Remove all replacements, shifting so that there is no longer a third entry

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        pText = "-6, -8";

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p3")].stateValues
                .text,
        ).eq("3rd entry: , ");

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p3")].stateValues
                .text,
        ).eq("3rd entry: , ");

        // Add three replacements, so that third entry is again a number
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        pText = "-6, 1, 2, 3, -8";

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p3")].stateValues
                .text,
        ).eq("3rd entry: 2, 2");

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p3")].stateValues
                .text,
        ).eq("3rd entry: 2, 2");

        // Back to one replacements, so that third entry is back to a string for first section
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        pText = "-6, 1, -8";

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p3")].stateValues
                .text,
        ).eq("3rd entry: , ");

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p3")].stateValues
                .text,
        ).eq("3rd entry: -8, -8");

        // Back to 2 replacements
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        pText = "-6, 1, 2, -8";

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p2")].stateValues
                .text,
        ).eq(pText);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1.p3")].stateValues
                .text,
        ).eq("3rd entry: 2, 2");

        expect(
            stateVariables[await resolvePathToNodeIdx("sec2.p3")].stateValues
                .text,
        ).eq("3rd entry: 2, 2");
    });

    it("extending bad prop still add in children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p">Hello</p>
    <p name="p2" extend="$p.badProp"> there</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(" there");
    });
});
