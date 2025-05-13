import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
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

describe("Copy tag tests", async () => {
    it("copy copies properties, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="false">x</math>
    $math1{name="a"}
    $a{name="b"}
    <math name="math2" modifyIndirectly="true">x</math>
    $math2{name="c"}
    $c{name="d"}
    <point name="point1"><label>A</label>(1,2)</point>
    $point1{name="e"}
    $e{name="f"}
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/math1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/a"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/b"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/math2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/c"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/d"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/point1"].stateValues.label).eq("A");
        expect(stateVariables["/e"].stateValues.label).eq("A");
        expect(stateVariables["/f"].stateValues.label).eq("A");
    });

    it("copy copies properties, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="false">x</math>
    <math name="math2" modifyIndirectly="true">x</math>
    <math name="a" copySource="math1"/>
    <math name="b" copySource="a"/>
    <math name="c" copySource="math2"/>
    <math name="d" copySource="c"/>
    <point name="point1"><label>A</label>(1,2)</point>
    <point name="e" copySource="point1"/>
    <point name="f" copySource="e"/>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/math1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/a"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/b"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/math2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/c"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/d"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/point1"].stateValues.label).eq("A");
        expect(stateVariables["/e"].stateValues.label).eq("A");
        expect(stateVariables["/f"].stateValues.label).eq("A");
    });

    it("copy overwrites properties, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="false">x</math>
    $math1{name="r1" }
    $math1{name="r2" modifyIndirectly="true" }
    $r1{name="r3" modifyIndirectly="true" }
    $r2{name="r4" }
    $r3{name="r5" }
    $r2{name="r6" modifyIndirectly="false" }
    $r3{name="r7" modifyIndirectly="false" }
    <point labelIsName name="A">(1,2)</point>
    $A{name="A2" }
    $A{name="B" labelIsName }
    $A2{name="B2" }
    $B{name="C" labelIsName }
    $B{name="C2" }
    $C{name="D" labelIsName }
    $C{name="D2" }
    $C2{name="D5" labelIsName }
    $C2{name="D6" }
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/math1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);

        expect(stateVariables["/A"].stateValues.label).eq("A");
        expect(stateVariables["/A2"].stateValues.label).eq("A");
        expect(stateVariables["/B"].stateValues.label).eq("B");
        expect(stateVariables["/B2"].stateValues.label).eq("A");
        expect(stateVariables["/C"].stateValues.label).eq("C");
        expect(stateVariables["/C2"].stateValues.label).eq("B");
        expect(stateVariables["/D"].stateValues.label).eq("D");
        expect(stateVariables["/D2"].stateValues.label).eq("C");
        expect(stateVariables["/D5"].stateValues.label).eq("D5");
        expect(stateVariables["/D6"].stateValues.label).eq("B");
    });

    it("copy overwrites properties, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="false">x</math>
    <math name="r1" copySource="math1"/>
    <math name="r2" modifyIndirectly="true" copySource="math1"/>
    <math name="r3" modifyIndirectly="true" copySource="r1"/>
    <math name="r4" copySource="r2"/>
    <math name="r5" copySource="r3"/>
    <math name="r6" copySource="r2" modifyIndirectly="false" />
    <math name="r7" copySource="r3" modifyIndirectly="false" />

    <point labelIsName name="A">(1,2)</point>
    <point name="A2"><label>A</label>(1,2)</point>
    <point name="A3" copySource="A"/>
    <point name="A4" copySource="A2"/>
    <point labelIsName name="B" copySource="A"/>
    <point name="B2" copySource="A"/>
    <point name="B3" copySource="A"><label>B</label></point>
    <point labelIsName name="B4" copySource="A2"/>
    <point name="B5" copySource="A2"/>
    <point name="B6" copySource="A2"><label>B</label></point>
    <point labelIsName name="C" copySource="B"/>
    <point name="C2" copySource="B"/>
    <point name="C3" copySource="B"><label>C</label></point>
    <point labelIsName name="C4" copySource="B2"/>
    <point name="C5" copySource="B2"/>
    <point name="C6" copySource="B2"><label>C</label></point>
    <point labelIsName name="C7" copySource="B3"/>
    <point name="C8" copySource="B3"/>
    <point name="C9" copySource="B3"><label>C</label></point>
    <point labelIsName name="C10" copySource="B4"/>
    <point name="C11" copySource="B4"/>
    <point name="C12" copySource="B4"><label>C</label></point>
    <point labelIsName name="C13" copySource="B5"/>
    <point name="C14" copySource="B5"/>
    <point name="C15" copySource="B5"><label>C</label></point>
    <point labelIsName name="C16" copySource="B6"/>
    <point name="C17" copySource="B6"/>
    <point name="C18" copySource="B6"><label>C</label></point>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/math1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);

        expect(stateVariables["/A"].stateValues.label).eq("A");
        expect(stateVariables["/A2"].stateValues.label).eq("A");
        expect(stateVariables["/A3"].stateValues.label).eq("A");
        expect(stateVariables["/A4"].stateValues.label).eq("A");
        expect(stateVariables["/B"].stateValues.label).eq("B");
        expect(stateVariables["/B2"].stateValues.label).eq("A");
        expect(stateVariables["/B3"].stateValues.label).eq("B");
        expect(stateVariables["/B4"].stateValues.label).eq("B4");
        expect(stateVariables["/B5"].stateValues.label).eq("A");
        expect(stateVariables["/B6"].stateValues.label).eq("B");
        expect(stateVariables["/C"].stateValues.label).eq("C");
        expect(stateVariables["/C2"].stateValues.label).eq("B");
        expect(stateVariables["/C3"].stateValues.label).eq("C");
        expect(stateVariables["/C4"].stateValues.label).eq("C4");
        expect(stateVariables["/C5"].stateValues.label).eq("A");
        expect(stateVariables["/C6"].stateValues.label).eq("C");
        expect(stateVariables["/C7"].stateValues.label).eq("C7");
        expect(stateVariables["/C8"].stateValues.label).eq("B");
        expect(stateVariables["/C9"].stateValues.label).eq("C");
        expect(stateVariables["/C10"].stateValues.label).eq("C10");
        expect(stateVariables["/C11"].stateValues.label).eq("B4");
        expect(stateVariables["/C12"].stateValues.label).eq("C");
        expect(stateVariables["/C13"].stateValues.label).eq("C13");
        expect(stateVariables["/C14"].stateValues.label).eq("A");
        expect(stateVariables["/C15"].stateValues.label).eq("C");
        expect(stateVariables["/C16"].stateValues.label).eq("C16");
        expect(stateVariables["/C17"].stateValues.label).eq("B");
        expect(stateVariables["/C18"].stateValues.label).eq("C");
    });

    it("copy overwrites properties, decode XML entities, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="3 &gt; 4">x</math>
    $math1{name="r1" }
    $math1{name="r2" modifyIndirectly="3&lt;4" }
    $r1{name="r3" modifyIndirectly="3&lt;4" }
    $r2{name="r4" }
    $r3{name="r5" }
    $r2{name="r6" modifyIndirectly="3&gt;4" }
    $r3{name="r7" modifyIndirectly="3&gt;4" }


    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/math1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);
    });

    it("copy overwrites properties, decode XML entities, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="math1" modifyIndirectly="3 &gt; 4">x</math>
    <math name="r1" copySource="math1"/>
    <math name="r2" modifyIndirectly="3&lt;4" copySource="math1"/>
    <math name="r3" modifyIndirectly="3&lt;4" copySource="r1"/>
    <math name="r4" copySource="r2"/>
    <math name="r5" copySource="r3"/>
    <math name="r6" copySource="r2" modifyIndirectly="3&gt;4" />
    <math name="r7" copySource="r3" modifyIndirectly="3&gt;4" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/math1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);
    });

    async function check_copy_props(core) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/x"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/x"].stateValues.hidden).eq(true);
        // modifyIndirectly attribute is copied (as it has propagateToProps=true)
        expect(stateVariables["/mr"].stateValues.modifyIndirectly).eq(false);
        // hide attribute is not copied (default behavior)
        expect(stateVariables["/mr"].stateValues.hidden).eq(false);
        expect(stateVariables["/mr"].stateValues.value).eq(false);

        // modifyIndirectly is overwritten
        expect(stateVariables["/mr2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/mr2"].stateValues.hidden).eq(false);
        expect(stateVariables["/mr2"].stateValues.value).eq(false);

        // modifyIndirectly attribute is copied (as it has propagateToProps=true)
        expect(stateVariables["/frmt"].stateValues.modifyIndirectly).eq(false);
        // hide attribute is not copied (default behavior)
        expect(stateVariables["/frmt"].stateValues.hidden).eq(false);
        expect(stateVariables["/frmt"].stateValues.value).eq("text");

        expect(stateVariables["/frmt2"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/frmt2"].stateValues.hidden).eq(true);
        expect(stateVariables["/frmt2"].stateValues.value).eq("text");

        // all attributes copied when don't use prop
        expect(stateVariables["/frmt3"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/frmt3"].stateValues.value).eq("text");
        expect(stateVariables["/frmt3"].stateValues.hidden).eq(true);

        expect(stateVariables["/A"].stateValues.label).eq("A");
        expect(stateVariables["/cA"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/l"].stateValues.value).eq(
            "\\left( 1, 2 \\right)",
        );
        expect(stateVariables["/l"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/lmr"].stateValues.value).eq(
            "\\left( 1, 2 \\right)",
        );
        expect(stateVariables["/lmr"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/A2"].stateValues.label).eq("A");
        expect(stateVariables["/cA2"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/l2"].stateValues.value).eq(
            "\\left( 1, 2 \\right)",
        );
    }

    it("copy props, dot notation, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="x" modifyIndirectly="false" hide>x</math>
    $(x.modifyIndirectly{assignNames="mr" })
    $(x.modifyIndirectly{assignNames="mr2" modifyIndirectly="true" })

    $(x.format{assignNames="frmt" })
    $(x.format{assignNames="frmt2" hide })
    $frmt{name="frmt3" hide }

    <point name="A" labelIsName>(1,2)</point>
    $(A.coords{assignNames="cA" })
    $(cA.latex{assignNames="l" })
    $(cA.latex{assignNames="lmr" modifyIndirectly="false" })
    $A{name="A2" }
    $(A2.coords{assignNames="cA2" })
    $(cA2.latex{assignNames="l2" })
    `,
        });

        await check_copy_props(core);
    });

    it("copy props, with copySource, dot notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="x" modifyIndirectly="false" hide>x</math>
    <boolean name="mr" copySource="x.modifyIndirectly"/>
    <boolean name="mr2" modifyIndirectly="true" copySource="x.modifyIndirectly"/>

    <text name="frmt" copySource="x.format"/>
    <text name="frmt2" copySource="x.format" hide />
    <text name="frmt3" hide copySource="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <coords name="cA" copySource="A.coords"/>
    <text name="l" copySource="cA.latex"/>
    <text name="lmr" modifyIndirectly="false" copySource="cA.latex"/>
    <point name="A2" copySource="A"/>
    <coords name="cA2" copySource="A2.coords"/>
    <text name="l2" copySource="cA2.latex"/>
    `,
        });

        await check_copy_props(core);
    });

    async function test_copy_prop_updatable(core) {
        async function check_items(x, y) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/p1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/p1"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/p2"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/p2"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/p3"].stateValues.xs[0].tree).eq(y);
            expect(stateVariables["/p3"].stateValues.xs[1].tree).eq(x);
        }

        let x = 1,
            y = 2;

        // initial position
        await check_items(x, y);

        // move point 1
        x = -3;
        y = 5;
        await movePoint({ name: "/p1", x, y, core });
        await check_items(x, y);

        // move point 2
        x = 6;
        y = -9;
        await movePoint({ name: "/p2", x, y, core });
        await check_items(x, y);

        // move point 3
        x = -7;
        y = -2;
        await movePoint({ name: "/p3", x: y, y: x, core });
        await check_items(x, y);
    }

    it("copy props of copy still updatable, dot notation, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      $p1{name="p2"}
      <point name="p3">
        ($p2.y, $p2.x1)
      </point>
    </graph>
    $p1{name="p1a"}
    $p2{name="p2a"}
    $p3{name="p3a"}
    `,
        });

        await test_copy_prop_updatable(core);
    });

    it("copy props of copy still updatable, with copySource, dot notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <point name="p2" copySource="p1"/>
      <point name="p3">
        (<math copySource="p2.y"/>,
        <math copySource="p2.x1"/>)
      </point>
    </graph>
    <point copySource="p1" name="p1a" />
    <point copySource="p2" name="p2a" />
    <point copySource="p3" name="p3a" />
    `,
        });

        await test_copy_prop_updatable(core);
    });

    async function test_copy_prop_shadows_source(core) {
        // initial positions
        let displacement = [-4, 2];
        let v_tail = [1, 1];
        let d_tail = [0, 0];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables["/vector1"].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables["/vector1"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls(displacement);
        expect(stateVariables["/d1"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d1"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d1"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(stateVariables["/d2"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d2"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d2"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 1
        displacement = [3, 1];
        v_tail = [-1, 4];
        d_tail = [0, 0];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            name: "/vector1",
            tailcoords: v_tail,
            headcoords: v_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables["/vector1"].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables["/vector1"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls(displacement);
        expect(stateVariables["/d1"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d1"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d1"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(stateVariables["/d2"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d2"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d2"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 2
        displacement = [5, -2];
        v_tail = [-1, 4];
        d_tail = [3, -7];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            name: "/d1",
            tailcoords: d_tail,
            headcoords: d_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables["/vector1"].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables["/vector1"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls(displacement);
        expect(stateVariables["/d1"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d1"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d1"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(stateVariables["/d2"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d2"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d2"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 3
        displacement = [-3, 6];
        v_tail = [-1, 4];
        d_tail = [4, -2];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            name: "/d2",
            tailcoords: d_tail,
            headcoords: d_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables["/vector1"].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables["/vector1"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls(displacement);
        expect(stateVariables["/d1"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d1"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d1"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(stateVariables["/d2"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d2"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d2"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);

        // move vector 1
        displacement = [5, 0];
        v_tail = [-8, 6];
        d_tail = [4, -2];
        v_head = displacement.map((x, i) => x + v_tail[i]);
        d_head = displacement.map((x, i) => x + d_tail[i]);

        await moveVector({
            name: "/vector1",
            tailcoords: v_tail,
            headcoords: v_head,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls(v_tail);
        expect(
            stateVariables["/vector1"].stateValues.head.map((x) => x.tree),
        ).eqls(v_head);
        expect(
            stateVariables["/vector1"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls(displacement);
        expect(stateVariables["/d1"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d1"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d1"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
        expect(stateVariables["/d2"].stateValues.tail.map((x) => x.tree)).eqls(
            d_tail,
        );
        expect(stateVariables["/d2"].stateValues.head.map((x) => x.tree)).eqls(
            d_head,
        );
        expect(
            stateVariables["/d2"].stateValues.displacement.map((x) => x.tree),
        ).eqls(displacement);
    }

    it("copy of prop copy shadows source, dot notation, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <vector name="vector1" displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    $(vector1.displacement{assignNames="d1"})
    </graph>
  
    <graph>
    $d1{name="d2"}
    </graph>

    $vector1{name="v1a"}
    `,
        });

        await test_copy_prop_shadows_source(core);
    });

    it("copy of prop copy shadows source, with copySource, dot notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <vector name="vector1" displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
      <vector name="d1" copySource="vector1.displacement"/>
    </graph>
  
    <graph>
      <vector copySource="d1" name="d2" />
    </graph>

    <vector copySource="vector1" name="v1a" />
    `,
        });

        await test_copy_prop_shadows_source(core);
    });

    async function test_property_children_replacement_changes(core) {
        async function check_items(list: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/p1"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p2"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p3"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p4"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p5"].stateValues.text.trim()).eq(list);
        }

        await check_items("");

        await updateMathInputValue({ latex: "2", name: "/mi", core });
        await check_items("a, b");

        await updateMathInputValue({ latex: "5", name: "/mi", core });
        await check_items("a, b, c, d, e");

        await updateMathInputValue({ latex: "1", name: "/mi", core });
        await check_items("a");

        await updateMathInputValue({ latex: "6", name: "/mi", core });
        await check_items("a, b, c, d, e, f");
    }

    it("property children account for replacement changes, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" />

    <p name="p1">
      <asList name="al1">
        <sequence type="letters" from="a" length="$mi" />
      </asList>
    </p>
    
    <p name="p2">$al1{name="al2"}</p>
    $p1{name="p3"}
    
    <p name="p4">$al2</p>
    $p3{name="p5"}

    `,
        });

        await test_property_children_replacement_changes(core);
    });

    it("property children account for replacement changes, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" />

    <p name="p1">
      <asList name="al1">
        <sequence type="letters" from="a" length="$mi" />
      </asList>
    </p>
    
    <p name="p2"><asList name="al2" copySource="al1"/></p>

    <p name="p3" copySource="p1"/>

    <p name="p4" ><asList copySource="al2"/></p>

    <p copySource="p3" name="p5"/>

    `,
        });

        await test_property_children_replacement_changes(core);
    });

    it("copy macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a=<mathInput name="a" prefill="5" /></p>
    <p>b=<mathInput name="b" prefill="2" /></p>
    <p>c=<mathInput name="c" prefill="3" /></p>

    <p><m name="orig">ax^2+bx+c = <math name="s">$a x^2 + $b x + $c</math></m></p>
    <p><m name="single">ax^2+bx+c = $s</m></p>
    <p><m name="double">ax^2+bx+c = $$s</m></p>
    <p><m name="triple">ax^2+bx+c = $$$s</m></p>
    <p>$orig{name="singlem"}</p>
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

            expect(cleanLatex(stateVariables["/orig"].stateValues.latex)).eq(
                `ax^2+bx+c=${polyLatex}`,
            );
            expect(cleanLatex(stateVariables["/single"].stateValues.latex)).eq(
                `ax^2+bx+c=${polyLatex}`,
            );
            expect(cleanLatex(stateVariables["/double"].stateValues.latex)).eq(
                `ax^2+bx+c=$$s`,
            );
            expect(cleanLatex(stateVariables["/triple"].stateValues.latex)).eq(
                `ax^2+bx+c=$$$s`,
            );
            expect(cleanLatex(stateVariables["/singlem"].stateValues.latex)).eq(
                `ax^2+bx+c=${polyLatex}`,
            );
            expect(stateVariables["/doublem"].stateValues.text).eq(`$$orig`);
            expect(stateVariables["/triplem"].stateValues.text).eq(`$$$orig`);
        }

        await check_items(5, 2, 3);

        // Enter new numbers
        await updateMathInputValue({ latex: "9", name: "/a", core });
        await updateMathInputValue({ latex: "6", name: "/b", core });
        await updateMathInputValue({ latex: "7", name: "/c", core });
        await check_items(9, 6, 7);
    });

    it("macros after failed double macro", async () => {
        let core = await createTestCore({
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
        expect(stateVariables["/p1"].stateValues.text).eq(
            "hi, $$t, $ bye,\n    hi, $$u, bye",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "bye, $$t(, hi,\n    bye, $$u, hi",
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            "hi, $$$t, $5, bye, $$5, hi, $$$5, bye",
        );
    });

    async function test_copy_not_ignore_hide(core) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Hidden by default: ",
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            "Force to reveal: secret",
        );
        expect(stateVariables["/p4"].stateValues.text).eq(
            "Force to reveal 2: secret",
        );
    }

    it("copy does not ignore hide by default, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="p2">Hidden by default: $hidden</p>
    <p name="p3">Force to reveal: $hidden{hide="false"}</p>
    <p name="p4">Force to reveal 2: $hidden{sourceAttributesToIgnore="hide"}</p>

    `,
        });

        await test_copy_not_ignore_hide(core);
    });

    it("copy does not ignore hide by default, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="p2">Hidden by default: <text copySource="hidden" /></p>
    <p name="p3">Force to reveal: <text copySource="hidden" hide="false" /></p>
    <p name="p4">Force to reveal 2: <text copySource="hidden" sourceAttributesToIgnore="hide" /></p>

    `,
        });

        await test_copy_not_ignore_hide(core);
    });

    async function test_copy_hidden_children(core) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theP"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/pHidden"].stateValues.text).eq("Hidden: ");
        expect(stateVariables["/pReveal"].stateValues.text).eq(
            "Revealed: secret",
        );
        expect(stateVariables["/theP2"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/pHidden2"].stateValues.text).eq("Hidden 2: ");
        expect(stateVariables["/pReveal2"].stateValues.text).eq(
            "Revealed 2: secret",
        );
        expect(stateVariables["/theP3"].stateValues.text).eq(
            "Hidden text: secret",
        );
        expect(stateVariables["/pReveal3"].stateValues.text).eq(
            "Revealed 3: secret",
        );
        expect(stateVariables["/theP4"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/pHidden4"].stateValues.text).eq("Hidden 4: ");
        expect(stateVariables["/pReveal4"].stateValues.text).eq(
            "Revealed 4: secret",
        );
    }

    it("copy keeps hidden children hidden, all macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pHidden">Hidden: $(theP/hidden)</p>
    <p name="pReveal">Revealed: $(theP/hidden{hide="false"})</p>
    $theP{name="theP2"}
    <p name="pHidden2">Hidden 2: $(theP2/hidden)</p>
    <p name="pReveal2">Revealed 2: $(theP2/hidden{hide="false"})</p>
    $theP{sourceAttributesToIgnore="hide" name="theP3"}
    <p name="pReveal3">Revealed 3: $(theP3/hidden)</p>
    $theP{hide="false" name="theP4"}
    <p name="pHidden4">Hidden 4: $(theP4/hidden)</p>
    <p name="pReveal4">Revealed 4: $(theP4/hidden{hide="false"})</p>

    `,
        });

        await test_copy_hidden_children(core);
    });

    it("copy keeps hidden children hidden, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pHidden">Hidden: <text copySource="theP/hidden" /></p>
    <p name="pReveal">Revealed: <text copySource="theP/hidden" hide="false" /></p>
    <p copySource="theP" name="theP2" />
    <p name="pHidden2">Hidden 2: <text copySource="theP2/hidden" /></p>
    <p name="pReveal2">Revealed 2: <text copySource="theP2/hidden" hide="false" /></p>
    <p copySource="theP" sourceAttributesToIgnore="hide" name="theP3" />
    <p name="pReveal3">Revealed 3: <text copySource="theP3/hidden" /></p>
    <p copySource="theP" name="theP4" hide="false" />
    <p name="pHidden4">Hidden 4: <text copySource="theP4/hidden" /></p>
    <p name="pReveal4">Revealed 4: <text copySource="theP4/hidden" hide="false" /></p>

    `,
        });

        await test_copy_hidden_children(core);
    });

    async function test_copy_hides_dynamically(core) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/c1"].stateValues.text).eq("copy 1: hello");
        expect(stateVariables["/c2"].stateValues.text).eq("copy 2: ");

        await updateBooleanInputValue({
            boolean: true,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/h2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/c1"].stateValues.text).eq("copy 1: ");
        expect(stateVariables["/c2"].stateValues.text).eq("copy 2: hello");

        await updateBooleanInputValue({
            boolean: false,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/h2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/c1"].stateValues.text).eq("copy 1: hello");
        expect(stateVariables["/c2"].stateValues.text).eq("copy 2: ");
    }

    it("copies hide dynamically, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="source">hello</text>

    <booleanInput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleanInput>

    <p name="c1">copy 1: $source{hide="$h1"}</p>
    <p name="c2">copy 2: $source{hide="$h2"}</p>
    `,
        });

        await test_copy_hides_dynamically(core);
    });

    it("copies hide dynamically, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="source">hello</text>

    <booleanInput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleanInput>

    <p name="c1">copy 1: <text hide="$h1" copySource="source" /></p>
    <p name="c2">copy 2: <text hide="$h2" copySource="source" /></p>
    `,
        });

        await test_copy_hides_dynamically(core);
    });

    async function test_copy_change_away_copy(core) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/forVerb"].stateValues.text).eq("jump");
        expect(stateVariables["/verb2"].stateValues.text).eq("jump");

        await updateBooleanInputValue({
            boolean: true,
            name: "/b",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/forVerb"].stateValues.text).eq("skip");
        expect(stateVariables["/verb2"].stateValues.text).eq("skip");

        await updateBooleanInputValue({
            boolean: false,
            name: "/b",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/forVerb"].stateValues.text).eq("jump");
        expect(stateVariables["/verb2"].stateValues.text).eq("jump");

        await updateBooleanInputValue({
            boolean: true,
            name: "/b",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/forVerb"].stateValues.text).eq("skip");
        expect(stateVariables["/verb2"].stateValues.text).eq("skip");
    }

    it("copy of component that changes away from a copy, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="b" />

    <setup>
      <text name="jump">jump</text>
    </setup>

    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    $verb{name="verb2"}
    `,
        });

        await test_copy_change_away_copy(core);
    });

    it("copy of component that changes away from a copy, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="b" />
    
    <setup>
      <text name="jump">jump</text>
    </setup>

    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <text copySource="verb" name="verb2" />
    `,
        });

        await test_copy_change_away_copy(core);
    });

    it("copy of invalid source gives math in boolean and math", async () => {
        let core = await createTestCore({
            doenetML: `
<p name="p1">We can't see $invalid in paragraph <text>or $invisible in text</text>.</p>

<p>In math, we can: <math name="m1">$bad + $nothing</math></p>

<p>And in boolean as well: <boolean name="b1">not ($missing = x)</boolean></p>.

`,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "We can't see  in paragraph or  in text.",
        );
        expect(stateVariables["/m1"].stateValues.value.tree).eqls([
            "+",
            "＿",
            "＿",
        ]);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
    });

    it("copy no link, base test, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Simplify of original: <textInput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textInput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <math link="false" copySource="m" simplify="$s2" name="m2" /></p>

    <p>Linked copy: <math copySource="m" simplify="$s2" name="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" >
      <label>double original</label>
    </updateValue></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" >
      <label>double copy 1</label>
    </updateValue></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" >
      <label>double copy 2</label>
    </updateValue></p>

    `,
        });

        async function check_maths(m, m2, m3) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/m"].stateValues.value.tree).eqls(m);
            expect(stateVariables["/m2"].stateValues.value.tree).eqls(m2);
            expect(stateVariables["/m3"].stateValues.value.tree).eqls(m3);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        let copy1Name = stateVariables["/m2"].replacementOf;
        let copy2Name = stateVariables["/m3"].replacementOf;
        expect(stateVariables[copy1Name].stateValues.link).eq(false);
        expect(stateVariables[copy2Name].stateValues.link).eq(true);

        await check_maths(["*", 2, "x"], ["+", "x", "x"], ["+", "x", "x"]);

        // simplify copies
        await updateTextInputValue({
            text: "full",
            name: "/s2",
            core,
        });
        await check_maths(["*", 2, "x"], ["*", 2, "x"], ["*", 2, "x"]);

        // stop simplifying original
        await updateTextInputValue({
            text: "none",
            name: "/s1",
            core,
        });
        await check_maths(["+", "x", "x"], ["*", 2, "x"], ["*", 2, "x"]);

        // double original
        await updateValue({ name: "/doubleOriginal", core });
        await check_maths(
            ["*", 2, ["+", "x", "x"]],
            ["*", 2, "x"],
            ["*", 4, "x"],
        );

        // double copy1
        await updateValue({ name: "/doubleCopy1", core });
        await check_maths(
            ["*", 2, ["+", "x", "x"]],
            ["*", 4, "x"],
            ["*", 4, "x"],
        );

        // double copy2
        await updateValue({ name: "/doubleCopy2", core });
        await check_maths(["*", 2, 4, "x"], ["*", 4, "x"], ["*", 8, "x"]);

        // stop simplifying copies
        await updateTextInputValue({
            text: "none",
            name: "/s2",
            core,
        });
        await check_maths(["*", 2, 4, "x"], ["*", 2, 2, "x"], ["*", 2, 4, "x"]);
    });

    async function test_copy_points_lines_no_link(core) {
        async function check_items({
            A,
            B,
            A2,
            l2A,
            l2B,
            A3,
            A4,
            B4,
            gA,
            gB,
            Ax,
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                A,
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                B,
            );
            expect(
                stateVariables["/l"].stateValues.point1.map((x) => x.tree),
            ).eqls(A);
            expect(
                stateVariables["/l"].stateValues.point2.map((x) => x.tree),
            ).eqls(B);
            expect(
                stateVariables["/A2"].stateValues.xs.map((x) => x.tree),
            ).eqls(A2);
            expect(
                stateVariables["/l2"].stateValues.point1.map((x) => x.tree),
            ).eqls(l2A);
            expect(
                stateVariables["/l2"].stateValues.point2.map((x) => x.tree),
            ).eqls(l2B);
            expect(
                stateVariables["/A3"].stateValues.xs.map((x) => x.tree),
            ).eqls(A3);
            expect(
                stateVariables["/A4"].stateValues.xs.map((x) => x.tree),
            ).eqls(A4);
            expect(
                stateVariables["/B4"].stateValues.xs.map((x) => x.tree),
            ).eqls(B4);
            expect(
                stateVariables["/gnolink/A"].stateValues.xs.map((x) => x.tree),
            ).eqls(gA);
            expect(
                stateVariables["/gnolink/B"].stateValues.xs.map((x) => x.tree),
            ).eqls(gB);
            expect(
                stateVariables["/gnolink/l"].stateValues.point1.map(
                    (x) => x.tree,
                ),
            ).eqls(gA);
            expect(
                stateVariables["/gnolink/l"].stateValues.point2.map(
                    (x) => x.tree,
                ),
            ).eqls(gB);
            expect(stateVariables["/Ax"].stateValues.value.tree).eqls(Ax);
        }

        let A = [1, 2],
            B = [3, 4],
            A2 = [1, 2],
            l2A = [1, 2],
            l2B = [3, 4],
            A3 = [1, 2],
            A4 = [1, 2],
            B4 = [3, 4],
            gA = [1, 2],
            gB = [3, 4],
            Ax = 1;

        let stateVariables = await core.returnAllStateVariables(false, true);

        let copyForA2 = stateVariables["/A2"].replacementOf;
        let copyForl2 = stateVariables["/l2"].replacementOf;
        let copyForA3 = stateVariables["/A3"].replacementOf;
        let copyForA4B4 = stateVariables["/A4"].replacementOf;
        let copyForgnolink = stateVariables["/gnolink"].replacementOf;
        let copyForAx = stateVariables["/Ax"].replacementOf;
        expect(stateVariables[copyForA2].stateValues.link).eq(false);
        expect(stateVariables[copyForl2].stateValues.link).eq(false);
        expect(stateVariables[copyForA3].stateValues.link).eq(false);
        expect(stateVariables[copyForA4B4].stateValues.link).eq(false);
        expect(stateVariables[copyForgnolink].stateValues.link).eq(false);
        expect(stateVariables[copyForAx].stateValues.link).eq(false);

        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A
        A = [-9, -3];
        await movePoint({ name: "/A", x: A[0], y: A[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move B
        B = [-2, 6];
        await movePoint({ name: "/B", x: B[0], y: B[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move l
        A = [-7, -6];
        B = [8, 0];

        await moveLine({ name: "/l", point1coords: A, point2coords: B, core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A2
        A2 = [5, 4];
        await movePoint({ name: "/A2", x: A2[0], y: A2[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move l2
        l2A = [-5, 9];
        l2B = [-4, -1];
        await moveLine({
            name: "/l2",
            point1coords: l2A,
            point2coords: l2B,
            core,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A3
        A3 = [6, -3];
        await movePoint({ name: "/A3", x: A3[0], y: A3[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A4
        A4 = [-2, 7];
        await movePoint({ name: "/A4", x: A4[0], y: A4[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move B4
        B4 = [-9, -8];
        await movePoint({ name: "/B4", x: B4[0], y: B4[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A5
        gA = [-10, -9];
        await movePoint({ name: "/gnolink/A", x: gA[0], y: gA[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move B5
        gB = [-8, -7];
        await movePoint({ name: "/gnolink/B", x: gB[0], y: gB[1], core });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move l3
        gA = [6, 5];
        gB = [4, -3];
        await moveLine({
            name: "/gnolink/l",
            point1coords: gA,
            point2coords: gB,
            core,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });
    }

    it("copy points and lines with no link, dot notation, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      $A{link="false" name="A2"}
      $l{link="false" name="l2"}
    </graph>
    
    <graph>
      $(l.point1{link="false" assignNames="A3"})
    </graph>
    <graph>
      $(l.points{link="false" assignNames="A4 B4" })
    </graph>

    $g{link="false" name="gnolink" newNamespace}
    
    $(A.x{link="false" assignNames="Ax" })

    <p>
      $A{name="Ac"}
      $B{name="Bc"}
      $(l.point1{assignNames="lp1"})
      $A2{name="A2c"}
      $(l2.point1{assignNames="l2p1"})
      $A3{name="A3c"}
      $A4{name="A4c"}
      $B4{name="B4c"}
      $(gnolink/A{name="A5c"})
      $(gnolink/B{name="B5c"})
      $(gnolink/l.point1{assignNames="l3p1"})

    </p>
  
    `,
        });

        await test_copy_points_lines_no_link(core);
    });

    it("copy points and lines with no link, with copySource, dot notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <point copySource="A" link="false" name="A2" />
      <line copySource="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <point copySource="l.point1" link="false" name="A3" />
    </graph>
    <graph>
      <point copySource="l.point1" link="false" name="A4" />
      <point copySource="l.point2" link="false" name="B4" />
    </graph>

    <graph copySource="g" link="false" name="gnolink" newNamespace />
    
    <math copySource="A.x" link="false" name="Ax" />

    <p>
      <point copySource="A" name="Ac" />
      <point copySource="B" name="Bc" />
      <point copySource="l.point1" name="lp1" />
      <point copySource="A2" name="A2c" />
      <point copySource="l2.point1" name="l2p1" />
      <point copySource="A3" name="A3c" />
      <point copySource="A4" name="A4c" />
      <point copySource="B4" name="B4c" />
      <point copySource="gnolink/A" name="A5c" />
      <point copySource="gnolink/B" name="B5c" />
      <point copySource="gnolink/l.point1" name="l3p1" />

    </p>
  
    `,
        });

        await test_copy_points_lines_no_link(core);
    });

    it("copy string with no link, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">Hello</p>
    $p1{name="p2" link="false"}
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hello");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello");
    });

    it("copy string with no link, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">Hello</p>
    <p copySource="p1" name="p2" link="false" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hello");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello");
    });

    // This was causing a duplicate component name error
    it("copy group with name inside with no link, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><group name="g"><text name="m">hello</text> $m{name="q"}</group></p>
    <p name="p2">$g{link="false"}</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("hello hello");
        expect(stateVariables["/p2"].stateValues.text).eq("hello hello");
    });

    // This was causing a duplicate component name error
    it("copy group with assignNames inside with no link, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><group name="g"><text name="m">hello</text> $m{name="q"}</group></p>
    <p name="p2"><group copySource="g" link="false" /></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("hello hello");
        expect(stateVariables["/p2"].stateValues.text).eq("hello hello");
    });

    async function test_copy_group_copies_no_link(core) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        const names = [
            "",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
        ].map((l) => `/twox${l}`);

        for (let name of names) {
            expect(stateVariables[name].stateValues.value.tree).eqls([
                "+",
                "x",
                "x",
            ]);
        }
    }

    it("copy group with copies with no link, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <group>
      <p><math name="twox">x+x</math></p>
      $twox{name="twoxa"}
      $twox{name="twoxb"}
    </group>
    

    $twox{name="twoxc"}
    $twox{link="false" name="twoxd"}
    
    $twoxa{name="twoxe"}
    $twoxa{link="false" name="twoxf"}
    
    $twoxe{name="twoxg"}
    $twoxf{link="false" name="twoxh"}

    $twoxb{name="twoxi"}
    $twoxb{link="false" name="twoxj"}
    
    $twoxi{name="twoxk"}
    $twoxj{link="false" name="twoxl"}
  
    `,
        });

        await test_copy_group_copies_no_link(core);
    });

    it("copy group with copies with no link, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <group>
      <p><math name="twox">x+x</math></p>
      <math copySource="twox" name="twoxa" />
      <math copySource="twox" name="twoxb" />
    </group>
    
    <math copySource="twox" name="twoxc" />
    <math copySource="twox" link="false" name="twoxd" />
    
    <math copySource="twoxa" name="twoxe" />
    <math copySource="twoxa" link="false" name="twoxf" />
    
    <math copySource="twoxe" name="twoxg" />
    <math copySource="twoxf" link="false" name="twoxh" />

    <math copySource="twoxb" name="twoxi" />
    <math copySource="twoxb" link="false" name="twoxj" />
    
    <math copySource="twoxi" name="twoxk" />
    <math copySource="twoxj" link="false" name="twoxl" />
  
    `,
        });

        await test_copy_group_copies_no_link(core);
    });

    async function test_copy_group_overwrite_attributes_no_link(core) {
        async function check_items(
            simplify1: "full" | "none",
            simplify2: "full" | "none",
            simplify3: "full" | "none",
        ) {
            const twoNone = ["+", "x", "x"];
            const twoSimp = ["*", 2, "x"];
            const threeNone = ["+", "x", "x", "x"];
            const threeSimp = ["*", 3, "x"];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/twox"].stateValues.value.tree).eqls(
                twoNone,
            );
            expect(stateVariables["/twoxa"].stateValues.value.tree).eqls(
                simplify1 === "full" ? twoSimp : twoNone,
            );
            expect(stateVariables["/threex"].stateValues.value.tree).eqls(
                simplify1 === "full" ? threeSimp : threeNone,
            );

            expect(stateVariables["/g2/twox"].stateValues.value.tree).eqls(
                twoNone,
            );
            expect(stateVariables["/g2/twoxa"].stateValues.value.tree).eqls(
                simplify2 === "full" ? twoSimp : twoNone,
            );
            expect(stateVariables["/g2/threex"].stateValues.value.tree).eqls(
                simplify2 === "full" ? threeSimp : threeNone,
            );

            expect(stateVariables["/g3/twox"].stateValues.value.tree).eqls(
                twoNone,
            );
            expect(stateVariables["/g3/twoxa"].stateValues.value.tree).eqls(
                simplify3 === "full" ? twoSimp : twoNone,
            );
            expect(stateVariables["/g3/threex"].stateValues.value.tree).eqls(
                simplify3 === "full" ? threeSimp : threeNone,
            );
        }

        let simplify1: "full" | "none" = "full";
        let simplify2: "full" | "none" = "full";
        let simplify3: "full" | "none" = "full";

        await check_items(simplify1, simplify2, simplify3);

        // change first simplify
        simplify1 = "none";
        await updateTextInputValue({
            text: simplify1,
            name: "/sim",
            core,
        });

        await check_items(simplify1, simplify2, simplify3);

        // change second simplify
        simplify2 = "none";
        await updateTextInputValue({
            text: simplify1,
            name: "/g2/sim",
            core,
        });
        await check_items(simplify1, simplify2, simplify3);

        // change third simplify
        simplify3 = "none";
        await updateTextInputValue({
            text: simplify1,
            name: "/g3/sim",
            core,
        });
        await check_items(simplify1, simplify2, simplify3);
    }

    it("copy group with copy overwriting attribute, no link, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="g">
      <textInput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      $twox{simplify="$sim" name="twoxa"}
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    $g{link="false" name="g2" newNamespace}
    $g2{link="false" name="g3" newNamespace}
    `,
        });

        await test_copy_group_overwrite_attributes_no_link(core);
    });

    it("copy group with copy overwriting attribute, no link, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="g">
      <textInput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <math copySource="twox" simplify="$sim" name="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <group copySource="g" link="false" name="g2" newNamespace />
    <group copySource="g2" link="false" name="g3" newNamespace />
    `,
        });

        await test_copy_group_overwrite_attributes_no_link(core);
    });

    it("copy group, no link, with function adapted to curve", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="text1">a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    $g{link="false"}
    <group copySource='g' link="false" />

    `,
        });

        // just testing that page loads, i.e., that bug is removed so that don't get error
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/text1"].stateValues.text).eq("a");
    });

    async function test_no_link_outside_component_from_attribute(core) {
        async function check_items(text1: string, text2: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/g/w"].stateValues.text).eq(text1);
            expect(stateVariables["/g/Plabel"].stateValues.text).eq(text1);
            expect(stateVariables["/g/P"].stateValues.label).eq(text1);
            expect(stateVariables["/g2/w"].stateValues.text).eq(text2);
            expect(stateVariables["/g2/Plabel"].stateValues.text).eq(text2);
            expect(stateVariables["/g2/P"].stateValues.label).eq(text2);
        }

        await check_items("bye", "bye");

        await updateTextInputValue({
            text: "hi",
            name: "/external",
            core,
        });

        await check_items("hi", "bye");
    }

    it("copy group, no link, copy to outside component from attribute, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <textInput name="external" prefill="bye" />

    <group name="g" newNamespace>
      $(/external.value{assignNames="w"})
      <point name="P"><label>$(/external)</label>(a,b)</point>
      $(P.label{assignNames="Plabel"})
    </group>
    
    $g{name="g2" link="false"}
    `,
        });

        await test_no_link_outside_component_from_attribute(core);
    });

    it("copy group, no link, copy to outside component from attribute, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <textInput name="external" prefill="bye" />

    <group name="g" newNamespace>
      <text copySource="/external.value" name="w" />
      <point name="P">
        <label>$(/external)</label>
        (a,b)
      </point>
      <label copySource="P.label" name="Plabel" />
    </group>
    
    <group copySource="g" name="g2" link="false" />
    `,
        });

        await test_no_link_outside_component_from_attribute(core);
    });

    async function test_no_link_copy_internal_copy_source_alias(core) {
        async function check_items(text1: string, text2: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/g/a/w"].stateValues.text).eq(text1);
            expect(stateVariables["/g/a/Plabel"].stateValues.text).eq(text1);
            expect(stateVariables["/g/a/P"].stateValues.label).eq(text1);
            expect(stateVariables["/g2/a/w"].stateValues.text).eq(text2);
            expect(stateVariables["/g2/a/Plabel"].stateValues.text).eq(text2);
            expect(stateVariables["/g2/a/P"].stateValues.label).eq(text2);
        }

        await check_items("hello", "hello");

        await updateTextInputValue({
            text: "one",
            name: "/g/ti",
            core,
        });
        await updateTextInputValue({
            text: "two",
            name: "/g2/ti",
            core,
        });

        await check_items("one", "two");
    }

    it("copy group, no link, internal copy to source alias is linked, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="g" newNamespace>
      <textInput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          $x{name="w"}
          <point name="P"><label>$x</label>(a,b)</point>
          $(P.label{assignNames="Plabel"})


        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    $g{name="g2" link="false"}
    `,
        });

        await test_no_link_copy_internal_copy_source_alias(core);
    });

    it("copy group, no link, internal copy to source alias is linked, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="g" newNamespace>
      <textInput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          <text copySource="x" name="w" />
          <point name="P">
            <label>$x</label>
            (a,b)
          </point>
          <label copyProp="label" copySource="P" name="Plabel" />
        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <group copySource="g" name="g2" link="false" />
    `,
        });

        await test_no_link_copy_internal_copy_source_alias(core);
    });

    async function test_no_link_external_absolute_source(core) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);
        expect(stateVariables["/g/m1"].stateValues.value).eq(4);
        expect(stateVariables["/g/m2"].stateValues.value).eq(4);
        expect(stateVariables["/g2/m1"].stateValues.value).eq(4);
        expect(stateVariables["/g2/m2"].stateValues.value).eq(4);
        expect(stateVariables["/g3/m1"].stateValues.value).eq(4);
        expect(stateVariables["/g3/m2"].stateValues.value).eq(4);
    }

    it("copy no link containing external copies use absolute source, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = $(../m{name="m1"})</p>
      <p>m = $(../m{name="m2" link="false"})</p>
    </group>
    
    $g{name="g2"}
    $g{link="false" name="g3"}
    `,
        });

        await test_no_link_external_absolute_source(core);
    });

    it("copy no link containing external copies use absolute source, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <number copySource="../m" name="m1" /></p>
      <p>m = <number copySource="../m" name="m2" link="false" /></p>
    </group>
    
    <group copySource="g" name="g2" />
    <group copySource="g" link="false" name="g3" />
    `,
        });

        await test_no_link_external_absolute_source(core);
    });

    async function test_dynamic_map_no_link_alias(core) {
        async function check_items(
            n1: number,
            n2: number,
            n3: number,
            n4: number,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            if ((n1) => 1) {
                expect(stateVariables["/section1/p1"].stateValues.text).eq(
                    "i=1, v=11",
                );
                expect(stateVariables["/section5/p1"].stateValues.text).eq(
                    "i=1, v=11",
                );
                expect(stateVariables["/p1a"].stateValues.text).eq("i=1, v=11");
                expect(stateVariables["/section7/p1"].stateValues.text).eq(
                    "i=1, v=11",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section1/p1"]);
                isUndefinedOrInactive(stateVariables["/section5/p1"]);
                isUndefinedOrInactive(stateVariables["/p1a"]);
                isUndefinedOrInactive(stateVariables["/section7/p1"]);
            }
            if (n1 >= 2) {
                expect(stateVariables["/section1/p2"].stateValues.text).eq(
                    "i=2, v=12",
                );
                expect(stateVariables["/section5/p2"].stateValues.text).eq(
                    "i=2, v=12",
                );
                expect(stateVariables["/p2a"].stateValues.text).eq("i=2, v=12");
                expect(stateVariables["/section7/p2"].stateValues.text).eq(
                    "i=2, v=12",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section1/p2"]);
                isUndefinedOrInactive(stateVariables["/section5/p2"]);
                isUndefinedOrInactive(stateVariables["/p2a"]);
                isUndefinedOrInactive(stateVariables["/section7/p2"]);
            }
            if (n1 >= 3) {
                expect(stateVariables["/section1/p3"].stateValues.text).eq(
                    "i=3, v=13",
                );
                expect(stateVariables["/section5/p3"].stateValues.text).eq(
                    "i=3, v=13",
                );
                expect(stateVariables["/p3a"].stateValues.text).eq("i=3, v=13");
                expect(stateVariables["/section7/p3"].stateValues.text).eq(
                    "i=3, v=13",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section1/p3"]);
                isUndefinedOrInactive(stateVariables["/section5/p3"]);
                isUndefinedOrInactive(stateVariables["/p3a"]);
                isUndefinedOrInactive(stateVariables["/section7/p3"]);
            }
            if (n1 >= 4) {
                expect(stateVariables["/section1/p4"].stateValues.text).eq(
                    "i=4, v=14",
                );
                expect(stateVariables["/section5/p4"].stateValues.text).eq(
                    "i=4, v=14",
                );
                expect(stateVariables["/p4a"].stateValues.text).eq("i=4, v=14");
                expect(stateVariables["/section7/p4"].stateValues.text).eq(
                    "i=4, v=14",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section1/p4"]);
                isUndefinedOrInactive(stateVariables["/section5/p4"]);
                isUndefinedOrInactive(stateVariables["/p4a"]);
                isUndefinedOrInactive(stateVariables["/section7/p4"]);
            }

            if ((n2) => 1) {
                expect(stateVariables["/section2/p1"].stateValues.text).eq(
                    "i=1, v=11",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section2/p1"]);
            }
            if (n2 >= 2) {
                expect(stateVariables["/section2/p2"].stateValues.text).eq(
                    "i=2, v=12",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section2/p2"]);
            }
            if (n2 >= 3) {
                expect(stateVariables["/section2/p3"].stateValues.text).eq(
                    "i=3, v=13",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section2/p3"]);
            }
            if (n2 >= 4) {
                expect(stateVariables["/section2/p4"].stateValues.text).eq(
                    "i=4, v=14",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section2/p4"]);
            }

            if ((n3) => 1) {
                expect(stateVariables["/p1"].stateValues.text).eq("i=1, v=11");
            } else {
                isUndefinedOrInactive(stateVariables["/p1"]);
            }
            if (n3 >= 2) {
                expect(stateVariables["/p2"].stateValues.text).eq("i=2, v=12");
            } else {
                isUndefinedOrInactive(stateVariables["/p2"]);
            }
            if (n3 >= 3) {
                expect(stateVariables["/p3"].stateValues.text).eq("i=3, v=13");
            } else {
                isUndefinedOrInactive(stateVariables["/p3"]);
            }
            if (n3 >= 4) {
                expect(stateVariables["/p4"].stateValues.text).eq("i=4, v=14");
            } else {
                isUndefinedOrInactive(stateVariables["/p4"]);
            }

            if ((n4) => 1) {
                expect(stateVariables["/section4/p1"].stateValues.text).eq(
                    "i=1, v=11",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section4/p1"]);
            }
            if (n4 >= 2) {
                expect(stateVariables["/section4/p2"].stateValues.text).eq(
                    "i=2, v=12",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section4/p2"]);
            }
            if (n4 >= 3) {
                expect(stateVariables["/section4/p3"].stateValues.text).eq(
                    "i=3, v=13",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section4/p3"]);
            }
            if (n4 >= 4) {
                expect(stateVariables["/section4/p4"].stateValues.text).eq(
                    "i=4, v=14",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/section4/p4"]);
            }
        }

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/section1"].stateValues.title).eq("Section 1");
        expect(stateVariables["/section2"].stateValues.title).eq("Section 2");
        expect(stateVariables["/section3"].stateValues.title).eq("Section 3");
        expect(stateVariables["/section4"].stateValues.title).eq("Section 4");
        expect(stateVariables["/section5"].stateValues.title).eq("Section 5");
        expect(stateVariables["/section6"].stateValues.title).eq("Section 6");
        expect(stateVariables["/section7"].stateValues.title).eq("Section 7");

        await check_items(2, 2, 2, 2);

        await updateValue({ name: "/section1/addP", core });
        await check_items(3, 2, 2, 2);

        await updateValue({ name: "/section7/removeP", core });
        await check_items(2, 2, 2, 2);

        await updateValue({ name: "/section4/addP", core });
        await check_items(2, 2, 2, 3);

        await updateValue({ name: "/section4/removeP", core });
        await check_items(2, 2, 2, 2);
    }

    it("copy dynamic map no link, check aliases, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <map name="map1" assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      $(../section1/map1{link='false' assignNames='(p1) (p2) (p3) (p4)'})
    </section>

    <section name="section3">
      $(section1/map1{link='false' assignNames='(p1) (p2) (p3) (p4)'})
    </section>

    $section1{link='false' name="section4"}
    
    <section name="section5" newNamespace>
      $(../section1/map1{assignNames='(p1) (p2) (p3) (p4)'})
    </section>

    <section name="section6">
      $(section1/map1{assignNames='(p1a) (p2a) (p3a) (p4a)'})
    </section>

    $section1{name="section7"}
  
    `,
        });

        await test_dynamic_map_no_link_alias(core);
    });

    it("copy dynamic map no link, check aliases, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `


    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <map name="map1" assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <map copySource='../section1/map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <map copySource='section1/map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section copySource='section1' link='false' name="section4" />
    
    <section name="section5" newNamespace>
      <map copySource='../section1/map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <map copySource='section1/map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <section copySource='section1' name="section7" />
  
    `,
        });

        await test_dynamic_map_no_link_alias(core);
    });

    it("copy map source with no link, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of iterations: <mathInput name="n" /></p>

    <graph>
    
      <map name="map1" assignNames="(A B C) (D E F)">
      <template>
      
      <point x="$i{link='false'}" y='$i.value{link="false"}+1'>
      </point>
      <point>
        (<number copySource="i" link="false" /> + 2, <number copySource="i.value" link="false" /> +3)
      </point>
      <point>
        ($i{link="false"} + 4, $(i.value{link="false"}) +5)
      </point>
      </template>
      
      <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
        
    </graph>
  
    `,
        });

        async function check_items(
            A?: number[],
            B?: number[],
            C?: number[],
            D?: number[],
            E?: number[],
            F?: number[],
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (A) {
                expect(
                    stateVariables["/A"].stateValues.xs.map((x) => x.tree),
                ).eqls(A);
            } else {
                isUndefinedOrInactive(stateVariables["/A"]);
            }
            if (B) {
                expect(
                    stateVariables["/B"].stateValues.xs.map((x) => x.tree),
                ).eqls(B);
            } else {
                isUndefinedOrInactive(stateVariables["/B"]);
            }
            if (C) {
                expect(
                    stateVariables["/C"].stateValues.xs.map((x) => x.tree),
                ).eqls(C);
            } else {
                isUndefinedOrInactive(stateVariables["/C"]);
            }
            if (D) {
                expect(
                    stateVariables["/D"].stateValues.xs.map((x) => x.tree),
                ).eqls(D);
            } else {
                isUndefinedOrInactive(stateVariables["/D"]);
            }
            if (E) {
                expect(
                    stateVariables["/E"].stateValues.xs.map((x) => x.tree),
                ).eqls(E);
            } else {
                isUndefinedOrInactive(stateVariables["/E"]);
            }
            if (F) {
                expect(
                    stateVariables["/F"].stateValues.xs.map((x) => x.tree),
                ).eqls(F);
            } else {
                isUndefinedOrInactive(stateVariables["/F"]);
            }
        }

        await check_items();

        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items([1, 2], [3, 4], [5, 6]);

        await movePoint({ name: "/A", x: 9, y: 0, core });
        await movePoint({ name: "/B", x: 1, y: 8, core });
        await movePoint({ name: "/C", x: 7, y: 2, core });

        await check_items([9, 0], [1, 8], [7, 2]);

        await updateMathInputValue({ latex: "2", name: "/n", core });

        await check_items([9, 0], [1, 8], [7, 2], [2, 3], [4, 5], [6, 7]);

        await movePoint({ name: "/D", x: 0, y: 10, core });
        await movePoint({ name: "/E", x: 9, y: 1, core });
        await movePoint({ name: "/F", x: 2, y: 8, core });

        await check_items([9, 0], [1, 8], [7, 2], [0, 10], [9, 1], [2, 8]);

        await updateMathInputValue({ latex: "0", name: "/n", core });
        await check_items();

        await updateMathInputValue({ latex: "2", name: "/n", core });

        await check_items([9, 0], [1, 8], [7, 2], [0, 10], [9, 1], [2, 8]);
    });

    it("copy no-link of a copy prop", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="x">x</math>
    <math copySource="x.value" name="xval" />
    <math copySource="xval" link="false" name="xvalnl" />

    <mathInput name="mi1">$xval</mathInput>
    <mathInput name="mi2">$xvalnl</mathInput>
  
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/x"].stateValues.value.tree).eq("x");
        expect(stateVariables["/xval"].stateValues.value.tree).eq("x");
        expect(stateVariables["/xvalnl"].stateValues.value.tree).eq("x");

        await updateMathInputValue({ latex: "y", name: "/mi1", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/x"].stateValues.value.tree).eq("y");
        expect(stateVariables["/xval"].stateValues.value.tree).eq("y");
        expect(stateVariables["/xvalnl"].stateValues.value.tree).eq("x");

        await updateMathInputValue({ latex: "z", name: "/mi2", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/x"].stateValues.value.tree).eq("y");
        expect(stateVariables["/xval"].stateValues.value.tree).eq("y");
        expect(stateVariables["/xvalnl"].stateValues.value.tree).eq("z");
    });

    it("copy no-link of a copy prop 2", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <triangle name="t"/>
    
      <point copySource="t.vertex1" name="v1" />
      <point name="v2" copySource="v1" />
      <point name="v3" copySource="v2" />
    </graph>
    
    <graph>
      <point copySource="v1" name="v1nl" link="false" />
      <point copySource="v2" name="v2nl" link="false" />
      <point copySource="v3" name="v3nl" link="false" />
    </graph>



    `,
        });

        async function check_items({
            v1,
            v1nl,
            v2nl,
            v3nl,
        }: {
            v1: number[];
            v1nl: number[];
            v2nl: number[];
            v3nl: number[];
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/v1"].stateValues.xs.map((x) => x.tree),
            ).eqls(v1);
            expect(
                stateVariables["/v1nl"].stateValues.xs.map((x) => x.tree),
            ).eqls(v1nl);
            expect(
                stateVariables["/v2nl"].stateValues.xs.map((x) => x.tree),
            ).eqls(v2nl);
            expect(
                stateVariables["/v3nl"].stateValues.xs.map((x) => x.tree),
            ).eqls(v3nl);
        }

        let v1 = [0, 1],
            v1nl = [0, 1],
            v2nl = [0, 1],
            v3nl = [0, 1];

        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v1
        v1 = [2, 3];
        await movePoint({ name: "/v1", x: v1[0], y: v1[1], core });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v1nl
        v1nl = [3, 4];
        await movePoint({ name: "/v1nl", x: v1nl[0], y: v1nl[1], core });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v2nl
        v2nl = [4, 5];
        await movePoint({ name: "/v2nl", x: v2nl[0], y: v2nl[1], core });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v3nl
        v3nl = [5, 6];
        await movePoint({ name: "/v3nl", x: v3nl[0], y: v3nl[1], core });
        await check_items({ v1, v1nl, v2nl, v3nl });
    });

    it("copy of template source maintained when withheld, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="n" /></p>

    <graph name='g1'>
      <map name="map1" assignNames="t1 t2">
        <template newNamespace>
          <point name="A" x="$(i{link='false' fixed='false'})" y='1'/>
        </template>
        <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
    </graph>
    
    <p><m name="m1">A_1 = $(t1/A{displayDigits="3"})</m></p>
    <p><m name="m2">A_2 = $(t2/A{displayDigits="3"})</m></p>
    
    `,
        });

        async function check_items(A1latex: string, A2latex: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(cleanLatex(stateVariables["/m1"].stateValues.latex)).eq(
                `A_1=${A1latex}`,
            );
            expect(cleanLatex(stateVariables["/m2"].stateValues.latex)).eq(
                `A_2=${A2latex}`,
            );
        }

        let A1 = [1, 1],
            A2 = [2, 1];

        await check_items("", "");

        // Add point

        await updateMathInputValue({ latex: "1", name: "/n", core });

        await check_items(`(${A1.join(",")})`, "");

        // Move point
        A1 = [-3, 7];
        await movePoint({ name: "/t1/A", x: A1[0], y: A1[1], core });

        await check_items(`(${A1.join(",")})`, "");

        // Remove point
        await updateMathInputValue({ latex: "0", name: "/n", core });
        await check_items("", "");

        // Remember coordinates when restore point since copy was maintained
        await updateMathInputValue({ latex: "1", name: "/n", core });

        await check_items(`(${A1.join(",")})`, "");

        // Add second point
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);

        // Move second point
        A2 = [5, -4];
        await movePoint({ name: "/t2/A", x: A2[0], y: A2[1], core });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);

        // Remove both points
        await updateMathInputValue({ latex: "0", name: "/n", core });
        await check_items("", "");

        // Remember coordinates of both points
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);
    });

    it("trim whitespace off source, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="hi">Hello</text>
    <p name="p1"><text copySource=" hi  " /> there</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/hi"].stateValues.text).eq("Hello");
        expect(stateVariables["/p1"].stateValues.text).eq("Hello there");
    });

    async function test_copy_group_with_numbers(core, name_prefix = "") {
        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[`${name_prefix}/n1`].stateValues.value).eq(1);
        expect(stateVariables[`${name_prefix}/n2`].stateValues.value).eq(2);
        expect(stateVariables["/n3"].stateValues.value).eq(3);
        expect(stateVariables[`/p2${name_prefix}/n1`].stateValues.value).eq(1);
        expect(stateVariables[`/p2${name_prefix}/n2`].stateValues.value).eq(2);
        expect(stateVariables["/p2/n3"].stateValues.value).eq(3);
        expect(stateVariables[`/p2a${name_prefix}/n1`].stateValues.value).eq(1);
        expect(stateVariables[`/p2a${name_prefix}/n2`].stateValues.value).eq(2);
        expect(stateVariables["/p2a/n3"].stateValues.value).eq(3);
        expect(stateVariables[`/p2b${name_prefix}/n1`].stateValues.value).eq(1);
        expect(stateVariables[`/p2b${name_prefix}/n2`].stateValues.value).eq(2);
        expect(stateVariables["/p2b/n3"].stateValues.value).eq(3);
        expect(stateVariables[`/s1b/p2${name_prefix}/n1`].stateValues.value).eq(
            1,
        );
        expect(stateVariables[`/s1b/p2${name_prefix}/n2`].stateValues.value).eq(
            2,
        );
        expect(stateVariables["/s1b/p2/n3"].stateValues.value).eq(3);

        expect(stateVariables["/p1"].stateValues.text).eq("values: 1 2 3");
        expect(stateVariables["/p2a"].stateValues.text).eq("values: 1 2 3");
        expect(stateVariables["/p2b"].stateValues.text).eq("values: 1 2 3");
        expect(stateVariables["/s1b/p2"].stateValues.text).eq("values: 1 2 3");

        expect(
            stateVariables["/section1"].activeChildren.map(
                (x) => x.componentIdx,
            ),
        ).eqls(["/p2"]);
        expect(
            stateVariables["/s1a"].activeChildren.map((x) => x.componentType),
        ).eqls(["p"]);
        expect(
            stateVariables["/s1b"].activeChildren.map((x) => x.componentIdx),
        ).eqls(["/s1b/p2"]);

        let c2p = stateVariables["/_document1"].activeChildren[5].componentIdx;
        let c4p = stateVariables["/_document1"].activeChildren[9].componentIdx;
        let c6p = stateVariables["/_document1"].activeChildren[13].componentIdx;
        let c7s = stateVariables["/_document1"].activeChildren[15].componentIdx;
        let c9s = stateVariables["/_document1"].activeChildren[19].componentIdx;

        expect(stateVariables[c2p].stateValues.text).eq("values: 1 2 3");
        expect(stateVariables[c4p].stateValues.text).eq("values: 1 2 3");
        expect(stateVariables[c6p].stateValues.text).eq("values: 1 2 3");

        expect(
            stateVariables[c7s].activeChildren.map((x) => x.componentType),
        ).eqls(["p"]);

        expect(
            stateVariables[c9s].activeChildren.map((x) => x.componentType),
        ).eqls(["p"]);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
            (x) => x.componentIdx,
        )[0].componentIdx;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
            (x) => x.componentIdx,
        )[0].componentIdx;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
            (x) => x.componentIdx,
        )[0].componentIdx;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
            (x) => x.componentIdx,
        )[0].componentIdx;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);

        expect(s1bGrandChildNames[0]).eq(`/s1b/p2${name_prefix}/n1`);
        expect(s1bGrandChildNames[1]).eq(`/s1b/p2${name_prefix}/n2`);
        expect(s1bGrandChildNames[2]).eq("/s1b/p2/n3");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
    }

    it("copy with newNamespace and name retains original names, even with group that assigns name to just one number, macros", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p1">values: <group name="grp" assignNames="n1"><number>1</number> <number name="n2">2</number></group> <number name="n3">3</number></p>
      
      <section name="section1">$p1{newNamespace name="p2"}</section>
      
      $p2
      $p2{name="p2a"}
      $p2{newNamespace}
      $p2{newNamespace name="p2b"}
      $p2a{newNamespace}
      
      $section1
      $section1{name="s1a"}
      $section1{newNamespace}
      $section1{newNamespace name="s1b"}
    
    `,
        });

        await test_copy_group_with_numbers(core);
    });

    it("copy with newNamespace and name retains original names, even with group, macros", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p1">values: <group name="grp"><number name="n1">1</number> <number name="n2">2</number></group> <number name="n3">3</number></p>
      
      <section name="section1">$p1{newNamespace name="p2"}</section>
      
      $p2
      $p2{name="p2a"}
      $p2{newNamespace}
      $p2{newNamespace name="p2b"}
      $p2a{newNamespace}
      
      $section1
      $section1{name="s1a"}
      $section1{newNamespace}
      $section1{newNamespace name="s1b"}
    
    `,
        });

        await test_copy_group_with_numbers(core);
    });

    it("copy with newNamespace and name retains original names, even with group that assigns names, macros", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p1">values: <group name="grp" assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section name="section1">$p1{newNamespace name="p2"}</section>
      
      $p2
      $p2{name="p2a"}
      $p2{newNamespace}
      $p2{newNamespace name="p2b"}
      $p2a{newNamespace}
      
      $section1
      $section1{name="s1a"}
      $section1{newNamespace}
      $section1{newNamespace name="s1b"}
    
    `,
        });

        await test_copy_group_with_numbers(core);
    });

    it("copy with newNamespace and name retains original names, even with group that has new namespace, macros", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p1">values: <group name="grp" newNamespace><number name="n1">1</number> <number name="n2">2</number></group> <number name="n3">3</number></p>
      
      <section name="section1">$p1{newNamespace name="p2"}</section>
      
      $p2
      $p2{name="p2a"}
      $p2{newNamespace}
      $p2{newNamespace name="p2b"}
      $p2a{newNamespace}
      
      $section1
      $section1{name="s1a"}
      $section1{newNamespace}
      $section1{newNamespace name="s1b"}
    
    `,
        });

        await test_copy_group_with_numbers(core, "/grp");
    });

    it("copy with newNamespace and name retains original names, even with group that has new namespace and assigns names, macros", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p1">values: <group name="grp" newNamespace assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section name="section1">$p1{newNamespace name="p2"}</section>
      
      $p2
      $p2{name="p2a"}
      $p2{newNamespace}
      $p2{newNamespace name="p2b"}
      $p2a{newNamespace}
      
      $section1
      $section1{name="s1a"}
      $section1{newNamespace}
      $section1{newNamespace name="s1b"}
    
    `,
        });

        await test_copy_group_with_numbers(core, "/grp");
    });

    it("copy with newNamespace and name retains original names, even with group, wrapped in nested groups and copied with variable sourceIndex", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  <group name="grp">
    <group newNamespace name="g1">
      <p name="p1">values: <group name="grp"><number name="n1">1</number> <number name="n2">2</number></group> <number name="n3">3</number></p>
      
      <section name="section1">$p1{newNamespace name="p2"}</section>
      
      $p2{name="p2a"}
      $p2{newNamespace name="p2b"}
      
      $section1{newNamespace name="s1b"}
    </group>
    <group newNamespace name="g2">
      <p name="p1">values: <group name="grp" assignNames="n1 n2"><number>4</number> <number name="n2">5</number></group> <number name="n3">6</number></p>

      <section name="section1">$p1{newNamespace name="p2"}</section>
      
      $p2{name="p2a"}
      $p2{newNamespace name="p2b"}
      
      $section1{newNamespace name="s1b"}
    </group>
  </group>

  $grp[$n]{name="thegrp"}


    `,
        });

        async function test_group(
            name_prefix: string,
            n1: number,
            n2: number,
            n3: number,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables[`${name_prefix}/n1`].stateValues.value).eq(
                n1,
            );
            expect(stateVariables[`${name_prefix}/n2`].stateValues.value).eq(
                n2,
            );
            expect(stateVariables[`${name_prefix}/n3`].stateValues.value).eq(
                n3,
            );
            expect(stateVariables[`${name_prefix}/p2/n1`].stateValues.value).eq(
                n1,
            );
            expect(stateVariables[`${name_prefix}/p2/n2`].stateValues.value).eq(
                n2,
            );
            expect(stateVariables[`${name_prefix}/p2/n3`].stateValues.value).eq(
                n3,
            );
            expect(
                stateVariables[`${name_prefix}/p2a/n1`].stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[`${name_prefix}/p2a/n2`].stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[`${name_prefix}/p2a/n3`].stateValues.value,
            ).eq(n3);
            expect(
                stateVariables[`${name_prefix}/p2b/n1`].stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[`${name_prefix}/p2b/n2`].stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[`${name_prefix}/p2b/n3`].stateValues.value,
            ).eq(n3);
            expect(
                stateVariables[`${name_prefix}/s1b/p2/n1`].stateValues.value,
            ).eq(n1);
            expect(
                stateVariables[`${name_prefix}/s1b/p2/n2`].stateValues.value,
            ).eq(n2);
            expect(
                stateVariables[`${name_prefix}/s1b/p2/n3`].stateValues.value,
            ).eq(n3);

            expect(stateVariables[`${name_prefix}/p1`].stateValues.text).eq(
                `values: ${n1} ${n2} ${n3}`,
            );
            expect(stateVariables[`${name_prefix}/p2a`].stateValues.text).eq(
                `values: ${n1} ${n2} ${n3}`,
            );
            expect(stateVariables[`${name_prefix}/p2b`].stateValues.text).eq(
                `values: ${n1} ${n2} ${n3}`,
            );
            expect(stateVariables[`${name_prefix}/s1b/p2`].stateValues.text).eq(
                `values: ${n1} ${n2} ${n3}`,
            );

            expect(
                stateVariables[`${name_prefix}/section1`].activeChildren.map(
                    (x) => x.componentIdx,
                ),
            ).eqls([`${name_prefix}/p2`]);
            expect(
                stateVariables[`${name_prefix}/s1b`].activeChildren.map(
                    (x) => x.componentIdx,
                ),
            ).eqls([`${name_prefix}/s1b/p2`]);
        }

        // check g1

        await test_group("/g1", 1, 2, 3);

        // check g2

        await test_group("/g2", 4, 5, 6);

        // check thegrp
        await test_group("/thegrp", 1, 2, 3);

        // Change index for thegrp
        await updateMathInputValue({ latex: "2", name: "/n", core });

        await test_group("/thegrp", 4, 5, 6);

        // Change to invalid index for thegrp
        await updateMathInputValue({ latex: "3", name: "/n", core });

        let stateVariable = await core.returnAllStateVariables(false, true);

        expect(stateVariable["/thegrp"]).eq(undefined);

        // Change back to index 1 for thegrp
        await updateMathInputValue({ latex: "1", name: "/n", core });

        await test_group("/thegrp", 1, 2, 3);
    });

    it("copy group of groups retains name", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="grp" newNamespace><number name="num1">1</number> <number name="num2">2</number> <group><number name="num3">3</number><number name="num4">4</number><group><number name="num5">5</number><number name="num6">6</number></group></group></group>

      $grp{name="grp2"}
      
      <group copySource="grp2" name="grp3" />

      <group copySource="grp2/_group1" name="grp4" newNamespace />
      <group copySource="grp3/_group1" name="grp5" newNamespace />

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/grp/num1"].stateValues.value).eq(1);
        expect(stateVariables["/grp/num2"].stateValues.value).eq(2);
        expect(stateVariables["/grp/num3"].stateValues.value).eq(3);
        expect(stateVariables["/grp/num4"].stateValues.value).eq(4);
        expect(stateVariables["/grp/num5"].stateValues.value).eq(5);
        expect(stateVariables["/grp/num6"].stateValues.value).eq(6);

        expect(stateVariables["/grp2/num1"].stateValues.value).eq(1);
        expect(stateVariables["/grp2/num2"].stateValues.value).eq(2);
        expect(stateVariables["/grp2/num3"].stateValues.value).eq(3);
        expect(stateVariables["/grp2/num4"].stateValues.value).eq(4);
        expect(stateVariables["/grp2/num5"].stateValues.value).eq(5);
        expect(stateVariables["/grp2/num6"].stateValues.value).eq(6);

        expect(stateVariables["/grp3/num1"].stateValues.value).eq(1);
        expect(stateVariables["/grp3/num2"].stateValues.value).eq(2);
        expect(stateVariables["/grp3/num3"].stateValues.value).eq(3);
        expect(stateVariables["/grp3/num4"].stateValues.value).eq(4);
        expect(stateVariables["/grp3/num5"].stateValues.value).eq(5);
        expect(stateVariables["/grp3/num6"].stateValues.value).eq(6);

        expect(stateVariables["/grp4/num3"].stateValues.value).eq(3);
        expect(stateVariables["/grp4/num4"].stateValues.value).eq(4);
        expect(stateVariables["/grp4/num5"].stateValues.value).eq(5);
        expect(stateVariables["/grp4/num6"].stateValues.value).eq(6);

        expect(stateVariables["/grp5/num3"].stateValues.value).eq(3);
        expect(stateVariables["/grp5/num4"].stateValues.value).eq(4);
        expect(stateVariables["/grp5/num5"].stateValues.value).eq(5);
        expect(stateVariables["/grp5/num6"].stateValues.value).eq(6);
    });

    it("copy group, does not avoid name collision when assign subnames", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="grp" newNamespace><number name="num1">1</number> <number name="num2">2</number></group>

      <p>$grp{assignNames="num2"}</p>
      

    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).eq(
            "Duplicate component name: num2.",
        );
    });

    it("copy p with newNamespace, does not avoid name collision when assignnames", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p"><text name="hello">Hello</text></p>
      $p{newNamespace name="hello"}

    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).eq(
            "Duplicate component name: hello.",
        );
    });

    it("copy point with math attribute, duplicate component name message uses point name", async () => {
        let core = await createTestCore({
            doenetML: `
      <point name="P" y="1" />
      $P{name="P" y="2" }
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).eq(
            "Duplicate component name: P.",
        );
    });

    async function test_copy_component_index(
        core: PublicDoenetMLCore,
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

            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                [x1, y1],
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                [x2, y2],
            );

            if (comp === 1 || comp === 2) {
                let xc = comp === 1 ? x1 : x2;
                let yc = comp === 1 ? y1 : y2;

                expect(
                    stateVariables["/A2"].stateValues.xs.map((x) => x.tree),
                ).eqls([xc, yc]);
                expect(
                    stateVariables["/g3/A2"].stateValues.xs.map((x) => x.tree),
                ).eqls([xc, yc]);
                expect(stateVariables["/Ax"].stateValues.value.tree).eq(xc);
                expect(stateVariables["/al2/Ax"].stateValues.value.tree).eq(xc);
            } else if (force_values) {
                expect(stateVariables["/Ax"].stateValues.value.tree).eq(
                    "\uff3f",
                );
                expect(stateVariables["/al2/Ax"].stateValues.value.tree).eq(
                    "\uff3f",
                );
            } else {
                expect(stateVariables["/A2"]).eq(undefined);
                expect(stateVariables["/g3/A2"]).eq(undefined);
                expect(stateVariables["/Ax"]).eq(undefined);
                expect(stateVariables["/al2/Ax"]).eq(undefined);
            }
        }

        let x1 = 1,
            y1 = 2,
            x2 = 3,
            y2 = 4;

        await check_items({ x1, y1, x2, y2 });

        // restrict collection to first component

        await updateMathInputValue({ latex: "1", name: "/n", core });

        await check_items({ x1, y1, x2, y2, comp: 1 });

        // move copied point
        x1 = 9;
        y1 = -5;
        await movePoint({ name: "/A2", x: x1, y: y1, core });

        await check_items({ x1, y1, x2, y2, comp: 1 });

        // restrict collection to second component

        await updateMathInputValue({ latex: "2", name: "/n", core });

        await check_items({ x1, y1, x2, y2, comp: 2 });

        // move double copied point
        x2 = 0;
        y2 = 8;
        await movePoint({ name: "/g3/A2", x: x2, y: y2, core });

        await check_items({ x1, y1, x2, y2, comp: 2 });
    }

    it("copy sourceIndex, array notation, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      $(col[$n]{name="A2"})
    </graph>
  
    $g2{name="g3" newNamespace}

    <aslist name="al">$(col[$n].x{assignNames="Ax"})</aslist>

    $al{name="al2" newNamespace}

    `,
        });

        await test_copy_component_index(core, false);
    });

    it("copy sourceIndex, with copySource, array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <point copySource="col[$n]" name="A2" />
    </graph>
  
    <graph copySource="g2" name="g3" newNamespace />
  
    <aslist name="al"><math copySource="col[$n].x" name="Ax" /></aslist>
  
    <aslist copySource="al" name="al2" newNamespace />

    `,
        });

        await test_copy_component_index(core, true);
    });

    async function test_copy_prop_component_index(
        core: PublicDoenetMLCore,
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
            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                [x1, y1],
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                [x2, y2],
            );

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

                expect(stateVariables["/n1"].stateValues.value.tree).eq(x);
                expect(stateVariables["/al2/n1"].stateValues.value.tree).eq(x);
            } else if (force_values) {
                expect(stateVariables["/n1"].stateValues.value.tree).eq(
                    "\uff3f",
                );
                expect(stateVariables["/al2/n1"].stateValues.value.tree).eq(
                    "\uff3f",
                );
            } else {
                isUndefinedOrInactive(stateVariables["/n1"]);
                isUndefinedOrInactive(stateVariables["/al2/n1"]);
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
            name: "/n",
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // move point 1
        x1 = 9;
        y1 = -5;
        await movePoint({ name: "/A", x: x1, y: y1, core });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 2
        sourceIndex = 2;
        await updateMathInputValue({
            latex: "2",
            name: "/m",
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // move point2
        x2 = 0;
        y2 = 8;
        await movePoint({ name: "/B", x: x2, y: y2, core });

        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set propIndex to 2
        propIndex = 2;
        await updateMathInputValue({
            latex: "2",
            name: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 1
        sourceIndex = 1;
        await updateMathInputValue({
            latex: "1",
            name: "/m",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set propIndex to 3
        propIndex = 3;
        await updateMathInputValue({
            latex: "3",
            name: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set propIndex to 1
        propIndex = 1;
        await updateMathInputValue({
            latex: "1",
            name: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 3
        sourceIndex = 3;
        await updateMathInputValue({
            latex: "3",
            name: "/m",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });

        // set sourceIndex to 2
        sourceIndex = 2;
        await updateMathInputValue({
            latex: "2",
            name: "/m",
            core,
        });

        // clear propIndex
        propIndex = undefined;
        await updateMathInputValue({
            latex: "",
            name: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, sourceIndex });
    }

    it("copy propIndex and sourceIndex, array notation, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>m: <mathinput name="m" /></p>
    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al">$(col[$m].xs[$n]{assignNames="n1"})</aslist></p>

    <p>$al{name="al2" newNamespace}</p>
    `,
        });

        await test_copy_prop_component_index(core, false);
    });

    it("copy propIndex and sourceIndex, with copySource, array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>m: <mathinput name="m" /></p>
    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><math copySource="col[$m].xs[$n]" name="n1" /></aslist></p>

    <p><aslist copySource="al" name="al2" newNamespace /></p>

    `,
        });

        await test_copy_prop_component_index(core, true);
    });

    it("source attributes to ignore", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1" newNamespace fixed isResponse>The text: <text name="hidden" hide fixed isResponse>secret</text></p>

    <p>Text stays hidden by default:</p>
    $p1{name="p2"}
    <p name="p4">Check attributes: $p2.hidden $p2.fixed $p2.isResponse $(p2/hidden.hidden) $(p2/hidden.fixed) $(p2/hidden.isResponse)</p>

    <p>Now all is revealed:</p>
    <copy source="p1" name="p5" sourceAttributesToIgnore="hide fixed" />
    <p name="p7">Check attributes: $p5.hidden $p5.fixed $p5.isResponse $(p5/hidden.hidden) $(p5/hidden.fixed) $(p5/hidden.isResponse)</p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("The text: ");
        expect(stateVariables["/p2"].stateValues.text).eq("The text: ");
        expect(stateVariables["/p4"].stateValues.text).eq(
            "Check attributes: false true false true true false",
        );
        expect(stateVariables["/p5"].stateValues.text).eq("The text: secret");
        expect(stateVariables["/p7"].stateValues.text).eq(
            "Check attributes: false false true false false true",
        );
    });

    it("copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    <copy source="P.x" assignNames="P1x" />
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    <copy source="g2/P.x" assignNames="P2x" />
    <graph name="g3">
      <point copySource="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copySource="../g2/P" name="Pa" />
    </graph>
    <graph copySource="g1" name="g5" />
    <graph copySource="g2" name="g6" />
    <graph copySource="g3" name="g7" />
    <graph copySource="g4" name="g8" />

    <graph copySource="g1" name="g9" newNamespace />
    <graph copySource="g2" name="g10" newNamespace />
    <graph copySource="g3" name="g11" newNamespace />
    <graph copySource="g4" name="g12" newNamespace />

    <graph copySource="g5" name="g13" />
    <graph copySource="g6" name="g14" />
    <graph copySource="g7" name="g15" />
    <graph copySource="g8" name="g16" />
    <graph copySource="g9" name="g17" />
    <graph copySource="g10" name="g18" />
    <graph copySource="g11" name="g19" />
    <graph copySource="g12" name="g20" />
  
    <graph copySource="g5" name="g21" newNamespace />
    <graph copySource="g6" name="g22" newNamespace />
    <graph copySource="g7" name="g23" newNamespace />
    <graph copySource="g8" name="g24" newNamespace />
    <graph copySource="g9" name="g25" newNamespace />
    <graph copySource="g10" name="g26" newNamespace />
    <graph copySource="g11" name="g27" newNamespace />
    <graph copySource="g12" name="g28" newNamespace />

    `,
        });

        let P1 = [1, 2];
        let P2 = [3, 4];

        let stateVariables = await core.returnAllStateVariables(false, true);
        let g5PName = stateVariables["/g5"].activeChildren[0].componentIdx;
        let g7PName = stateVariables["/g7"].activeChildren[0].componentIdx;
        let g13PName = stateVariables["/g13"].activeChildren[0].componentIdx;
        let g15PName = stateVariables["/g15"].activeChildren[0].componentIdx;
        let g21PName = stateVariables["/g21"].activeChildren[0].componentIdx;
        let g23PName = stateVariables["/g23"].activeChildren[0].componentIdx;

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P1 to (4,5)

        P1 = [4, 5];

        await movePoint({ name: "/P", x: P1[0], y: P1[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P2 to (7,0)
        P2 = [7, 0];
        await movePoint({ name: "/g2/P", x: P2[0], y: P2[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P1 via Pa to (2,9)
        P1 = [2, 0];

        await movePoint({ name: "/Pa", x: P1[0], y: P1[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P2 via graph 4's Pa to (8, 6)
        P2 = [8, 6];
        await movePoint({ name: "/g4/Pa", x: P2[0], y: P2[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
    });

    it("copySource and copies with newNamespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    $P.x{name="P1x"}
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    $(g2/P.x{name="P2x"})
    <graph name="g3">
      <point copySource="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copySource="../g2/P" name="Pa" />
    </graph>
    <graph copySource="g1" name="g5" />
    <graph copySource="g2" name="g6" />
    <graph copySource="g3" name="g7" />
    <graph copySource="g4" name="g8" />

    $g1{name="g9" newNamespace}
    $g2{name="g10" newNamespace}
    $g3{name="g11" newNamespace}
    $g4{name="g12" newNamespace}

    <graph copySource="g5" name="g13" />
    <graph copySource="g6" name="g14" />
    <graph copySource="g7" name="g15" />
    <graph copySource="g8" name="g16" />
    <graph copySource="g9" name="g17" />
    <graph copySource="g10" name="g18" />
    <graph copySource="g11" name="g19" />
    <graph copySource="g12" name="g20" />
  
    $g5{name="g21" newNamespace}
    $g6{name="g22" newNamespace}
    $g7{name="g23" newNamespace}
    $g8{name="g24" newNamespace}
    $g9{name="g25" newNamespace}
    $g10{name="g26" newNamespace}
    $g11{name="g27" newNamespace}
    $g12{name="g28" newNamespace}

    `,
        });

        let P1 = [1, 2];
        let P2 = [3, 4];

        let stateVariables = await core.returnAllStateVariables(false, true);
        let g5PName = stateVariables["/g5"].activeChildren[0].componentIdx;
        let g7PName = stateVariables["/g7"].activeChildren[0].componentIdx;
        let g13PName = stateVariables["/g13"].activeChildren[0].componentIdx;
        let g15PName = stateVariables["/g15"].activeChildren[0].componentIdx;
        let g21PName = stateVariables["/g21"].activeChildren[0].componentIdx;
        let g23PName = stateVariables["/g23"].activeChildren[0].componentIdx;

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P1 to (4,5)

        P1 = [4, 5];

        await movePoint({ name: "/P", x: P1[0], y: P1[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P2 to (7,0)

        P2 = [7, 0];
        await movePoint({ name: "/g2/P", x: P2[0], y: P2[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P1 via Pa to (2,9)

        P1 = [2, 0];

        await movePoint({ name: "/Pa", x: P1[0], y: P1[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        // move P2 via graph 4's Pa to (8, 6)

        P2 = [8, 6];
        await movePoint({ name: "/g4/Pa", x: P2[0], y: P2[1], core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g4/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );

        expect(stateVariables[g5PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g6/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g7PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g8/Pa"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables["/g9/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g10/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g11/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g12/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g14/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g15PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g16/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g18/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g19/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g20/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g22/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(stateVariables[g23PName].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(
            stateVariables["/g24/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P1,
        );
        expect(stateVariables["/g26/P"].stateValues.xs.map((x) => x.tree)).eqls(
            P2,
        );
        expect(
            stateVariables["/g27/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P1);
        expect(
            stateVariables["/g28/Pa"].stateValues.xs.map((x) => x.tree),
        ).eqls(P2);
    });

    async function test_copy_newNamespace_reference_parent(core) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        let mathinputoutsideName =
            stateVariables["/answer1"].stateValues.inputChildren[0]
                .componentIdx;

        let mathinputp1Name =
            stateVariables["/answer2"].stateValues.inputChildren[0]
                .componentIdx;

        let mathinputp2Name =
            stateVariables["/p2/answer1"].stateValues.inputChildren[0]
                .componentIdx;

        let mathinputp3Name =
            stateVariables["/p3/answer2"].stateValues.inputChildren[0]
                .componentIdx;

        let mathinputp4Name =
            stateVariables["/p4/answer1"].stateValues.inputChildren[0]
                .componentIdx;

        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

        expect(stateVariables["/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

        expect(stateVariables["/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value.tree).eq("p");

        // answer outside answer
        await updateMathInputValue({
            latex: "x",
            name: mathinputoutsideName,
            core,
        });
        await submitAnswer({ name: "/answer1", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/answer1"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/answer2"].stateValues.justSubmitted).eq(false);
        expect(stateVariables["/p2/answer1"].stateValues.justSubmitted).eq(
            false,
        );
        expect(stateVariables["/p3/answer2"].stateValues.justSubmitted).eq(
            false,
        );
        expect(stateVariables["/p4/answer1"].stateValues.justSubmitted).eq(
            false,
        );

        // correctly answer first problem
        await updateMathInputValue({
            latex: "y",
            name: mathinputp1Name,
            core,
        });
        await submitAnswer({ name: "/answer2", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/answer1"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/answer2"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/p2/answer1"].stateValues.justSubmitted).eq(
            false,
        );
        expect(stateVariables["/p3/answer2"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p3/answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/p4/answer1"].stateValues.justSubmitted).eq(
            false,
        );

        expect(stateVariables[mathinputp1Name].stateValues.rawRendererValue).eq(
            "y",
        );
        expect(stateVariables[mathinputp2Name].stateValues.rawRendererValue).eq(
            "",
        );
        expect(stateVariables[mathinputp3Name].stateValues.rawRendererValue).eq(
            "y",
        );
        expect(stateVariables[mathinputp4Name].stateValues.rawRendererValue).eq(
            "",
        );

        expect(stateVariables["/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(1);

        expect(stateVariables["/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

        expect(stateVariables["/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value.tree).eq("p");

        // correctly answer second problem
        await updateMathInputValue({
            latex: "z",
            name: mathinputp2Name,
            core,
        });
        await submitAnswer({ name: "/p2/answer1", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/answer1"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/answer2"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/p2/answer1"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p2/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/p3/answer2"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p3/answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/p4/answer1"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p4/answer1"].stateValues.creditAchieved).eq(1);

        expect(stateVariables[mathinputp1Name].stateValues.rawRendererValue).eq(
            "y",
        );
        expect(stateVariables[mathinputp2Name].stateValues.rawRendererValue).eq(
            "z",
        );
        expect(stateVariables[mathinputp3Name].stateValues.rawRendererValue).eq(
            "y",
        );
        expect(stateVariables[mathinputp4Name].stateValues.rawRendererValue).eq(
            "z",
        );

        expect(stateVariables["/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(1);

        expect(stateVariables["/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(1);

        expect(stateVariables["/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value.tree).eq("p");

        // incorrectly answer third problem
        await updateMathInputValue({
            latex: "a",
            name: mathinputp3Name,
            core,
        });
        await submitAnswer({ name: "/p3/answer2", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/answer1"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/answer2"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/p2/answer1"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p2/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/p3/answer2"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p3/answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/p4/answer1"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p4/answer1"].stateValues.creditAchieved).eq(1);

        expect(stateVariables[mathinputp1Name].stateValues.rawRendererValue).eq(
            "a",
        );
        expect(stateVariables[mathinputp2Name].stateValues.rawRendererValue).eq(
            "z",
        );
        expect(stateVariables[mathinputp3Name].stateValues.rawRendererValue).eq(
            "a",
        );
        expect(stateVariables[mathinputp4Name].stateValues.rawRendererValue).eq(
            "z",
        );

        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

        expect(stateVariables["/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(1);

        expect(stateVariables["/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value.tree).eq("p");

        // incorrectly answer fourth problem
        await updateMathInputValue({
            latex: "b",
            name: mathinputp4Name,
            core,
        });
        await submitAnswer({ name: "/p4/answer1", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/answer1"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/answer2"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/p2/answer1"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p2/answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/p3/answer2"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p3/answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/p4/answer1"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/p4/answer1"].stateValues.creditAchieved).eq(0);

        expect(stateVariables[mathinputp1Name].stateValues.rawRendererValue).eq(
            "a",
        );
        expect(stateVariables[mathinputp2Name].stateValues.rawRendererValue).eq(
            "b",
        );
        expect(stateVariables[mathinputp3Name].stateValues.rawRendererValue).eq(
            "a",
        );
        expect(stateVariables[mathinputp4Name].stateValues.rawRendererValue).eq(
            "b",
        );

        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

        expect(stateVariables["/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

        expect(stateVariables["/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value.tree).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value.tree).eq("p");

        // change mathinput

        await updateMathInputValue({
            latex: "q",
            name: "/mi",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/m"].stateValues.value.tree).eq("q");
        expect(stateVariables["/p2/m"].stateValues.value.tree).eq("q");
        expect(stateVariables["/p3/m"].stateValues.value.tree).eq("q");
        expect(stateVariables["/p4/m"].stateValues.value.tree).eq("q");
    }

    it("copy with newNamespace and references to parent", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi" prefill="p" />
    <answer name="answer1">x</answer>

    <problem name="p1">
      <answer name="answer2">y</answer>
      <p>Credit achieved: $p1.creditAchieved{assignNames="ca"}</p>
      <p>Value of mathinput: $mi.value{assignNames="m"}</p>
      <p>Other answer credit achieved: $(p2/answer1.creditAchieved{assignNames="cao"})</p>
      </problem>

    <problem name="p2" newNamespace>
      <answer name="answer1">z</answer>
      <p>Credit achieved: $(../p2.creditAchieved{assignNames="ca"})</p>
      <p>Value of mathinput: $(../mi.value{assignNames="m"})</p>
      <p>Other answer credit achieved: $(../answer2.creditAchieved{assignNames="cao"})</p>
    </problem>

    $p1{name="p3" newNamespace}

    $p2{name="p4" newNamespace}

    `,
        });

        await test_copy_newNamespace_reference_parent(core);
    });

    it("copySource with newNamespace and references to parent", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi" prefill="p" />
    <answer name="answer1">x</answer>

    <problem name="p1">
      <answer name="answer2">y</answer>
      <p>Credit achieved: <number copysource="p1.creditAchieved" name="ca" /></p>
      <p>Value of mathinput: <math copysource="mi" name="m" /></p>
      <p>Other answer credit achieved: <number copysource="p2/answer1.creditAchieved" name="cao" /></p>
    </problem>

    <problem name="p2" newNamespace>
      <answer name="answer1">z</answer>
      <p>Credit achieved: <number copysource="../p2.creditAchieved" name="ca" /></p>
      <p>Value of mathinput: <math copysource="../mi" name="m" /></p>
      <p>Other answer credit achieved: <number copysource="../answer2.creditAchieved" name="cao" /></p>
    </problem>

    <problem copySource="p1" name="p3" newNamespace />

    <problem copySource="p2" name="p4" newNamespace />

    `,
        });

        await test_copy_newNamespace_reference_parent(core);
    });

    async function test_copy_map(core) {
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
            expect(stateVariables["/n2"].stateValues.value.tree).eq(n);
            expect(stateVariables["/n3"].stateValues.value).eq(n);

            expect(stateVariables["/p1"].stateValues.text).contain("Hello 1!");
            expect(stateVariables["/p2"].stateValues.text).contain("Hello 2!");
            expect(stateVariables["/p1a"].stateValues.text).contain("Hello 1!");
            expect(stateVariables["/p2a"].stateValues.text).contain("Hello 2!");
            expect(stateVariables["/p1b"].stateValues.text).contain("Hello 1!");
            expect(stateVariables["/p2b"].stateValues.text).contain("Hello 2!");
            if (n === 3) {
                expect(stateVariables["/p3"].stateValues.text).contain(
                    "Hello 3!",
                );
                expect(stateVariables["/p3a"].stateValues.text).contain(
                    "Hello 3!",
                );
                expect(stateVariables["/p3b"].stateValues.text).contain(
                    "Hello 3!",
                );
            } else {
                expect(stateVariables["/p3"]).eq(undefined);
                expect(stateVariables["/p3a"]).eq(undefined);
                expect(stateVariables["/p3b"]).eq(undefined);
            }

            expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
            expect(stateVariables["/p2/n1"].stateValues.value).eq(2);
            expect(stateVariables["/p1a/n1"].stateValues.value).eq(1);
            expect(stateVariables["/p2a/n1"].stateValues.value).eq(2);
            expect(stateVariables["/p1b/n1"].stateValues.value).eq(1);
            expect(stateVariables["/p2b/n1"].stateValues.value).eq(2);
            if (n === 3) {
                expect(stateVariables["/p3/n1"].stateValues.value).eq(3);
                expect(stateVariables["/p3a/n1"].stateValues.value).eq(3);
                expect(stateVariables["/p3b/n1"].stateValues.value).eq(3);
            } else {
                expect(stateVariables["/p3/n1"]).eq(undefined);
                expect(stateVariables["/p3a/n1"]).eq(undefined);
                expect(stateVariables["/p3b/n1"]).eq(undefined);
            }

            expect(stateVariables["/p1/m1"].stateValues.value.tree).eq(x);
            expect(stateVariables["/p2/m1"].stateValues.value.tree).eq(y);
            expect(stateVariables["/p1a/m1"].stateValues.value.tree).eq(x);
            expect(stateVariables["/p2a/m1"].stateValues.value.tree).eq(y);
            expect(stateVariables["/p1b/m1"].stateValues.value.tree).eq(x);
            expect(stateVariables["/p2b/m1"].stateValues.value.tree).eq(y);
            if (n === 3) {
                expect(stateVariables["/p3/m1"].stateValues.value.tree).eq(z);
                expect(stateVariables["/p3a/m1"].stateValues.value.tree).eq(z);
                expect(stateVariables["/p3b/m1"].stateValues.value.tree).eq(z);
            } else {
                expect(stateVariables["/p3/m1"]).eq(undefined);
                expect(stateVariables["/p3a/m1"]).eq(undefined);
                expect(stateVariables["/p3b/m1"]).eq(undefined);
            }
        }

        await check_items({ n: 2 });

        // type x in first mathinput
        await updateMathInputValue({
            latex: "x",
            name: "/p1/x",
            core,
        });

        await check_items({ n: 2, x: "x" });

        // type y in second mathinput
        await updateMathInputValue({
            latex: "y",
            name: "/p2b/x",
            core,
        });

        await check_items({ n: 2, x: "x", y: "y" });

        // increase n
        await updateMathInputValue({
            latex: "3",
            name: "/n",
            core,
        });

        await check_items({ n: 3, x: "x", y: "y" });

        // type z in third mathinput
        await updateMathInputValue({
            latex: "z",
            name: "/p3a/x",
            core,
        });

        await check_items({ n: 3, x: "x", y: "y", z: "z" });
    }

    it("copySource of map", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="n" prefill="2" />

    <p>Value: <copy source="n" prop="value" assignNames="n2" /></p>
    <p>Value 2: <number copySource="n2" name="n3" /></p>

    <map name="map1" assignNames="(p1) (p2) (p3)">
      <template><p newNamespace>Hello <number name="n1" copySource="v" />!  <mathinput name="x" /> <math name="m1" copySource="x" /></p></template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    <map copySource="map1" name="map2" assignNames="(p1a) (p2a) (p3a)" />

    <map copySource="map2" name="map3" assignNames="(p1b) (p2b) (p3b)" />


    `,
        });

        await test_copy_map(core);
    });

    it("macro to copy map", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>

    <mathinput name="n" prefill="2" />

    <p>Value: $n.value{assignNames="n2"}</p>
    <p>Value 2: $n2{name="n3" createComponentOfType="number"}</p>

    <map name="map1" assignNames="(p1) (p2) (p3)">
      <template><p newNamespace>Hello $v{name="n1"}!  <mathinput name="x" /> $x{name="m1"}</p></template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    $map1{name="map2" assignNames="(p1a) (p2a) (p3a)"}

    $map2{name="map3" assignNames="(p1b) (p2b) (p3b)"}


    `,
        });

        await test_copy_map(core);
    });

    it("copySource and createComponentOfType wrap to match specified type", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi" prefill="2" />
        
    <math name="m1" copySource="mi" />
    $mi{name="m2" createComponentOfType="MatH"}

    <number name="n1" copySource="mi" />
    $mi{name="n2" createComponentOfType="number"}

    <point name="P">(x,y)</point>

    <coords name="c1" copySource="P" />
    $P{name="c2" createComponentOfType="coords"}
    <coords name="c3" copySource="P.coords" />
    $P.coords{assignNames="c4" createComponentOfType="coords"}

    <math name="mc1" copySource="P" />
    $P{name="mc2" createComponentOfType="math"}
    <math name="mc3" copySource="P.coords" />
    $P.coords{assignNames="mc4" createComponentOfType="math"}

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/m1"].stateValues.value.tree).eq(2);
        expect(stateVariables["/m2"].stateValues.value.tree).eq(2);

        expect(stateVariables["/n1"].stateValues.value).eq(2);
        expect(stateVariables["/n2"].stateValues.value).eq(2);

        expect(stateVariables["/c1"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);
        expect(stateVariables["/c2"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);
        expect(stateVariables["/c3"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);
        expect(stateVariables["/c4"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);

        expect(stateVariables["/mc1"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);
        expect(stateVariables["/mc2"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);
        expect(stateVariables["/mc3"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);
        expect(stateVariables["/mc4"].stateValues.value.tree).eqls([
            "vector",
            "x",
            "y",
        ]);

        // enter a
        await updateMathInputValue({ latex: "a", name: "/mi", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/m1"].stateValues.value.tree).eq("a");
        expect(stateVariables["/m2"].stateValues.value.tree).eq("a");

        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n2"].stateValues.value).eqls(NaN);
    });

    it("add children to invalid copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" copySource="invalid">
      <point name="P" />
    </graph>

    <graph name="g2" copySource="invalid" newNamespace>
      <point name="P" />
    </graph>

    <math name="Pcoords" copySource="P" />
    <math name="g2Pcoords" copySource="g2/P" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].activeChildren.length).eq(1);
        expect(stateVariables["/g"].activeChildren[0].componentIdx).eq("/P");
        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls([
            0, 0,
        ]);

        expect(stateVariables["/g2"].activeChildren.length).eq(1);
        expect(stateVariables["/g2"].activeChildren[0].componentIdx).eq(
            "/g2/P",
        );
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls([
            0, 0,
        ]);

        expect(stateVariables["/Pcoords"].stateValues.value.tree).eqls([
            "vector",
            0,
            0,
        ]);
        expect(stateVariables["/g2Pcoords"].stateValues.value.tree).eqls([
            "vector",
            0,
            0,
        ]);

        // move points

        await movePoint({ name: "/P", x: 3, y: 5, core });
        await movePoint({ name: "/g2/P", x: 7, y: 6, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 5,
        ]);

        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls([
            7, 6,
        ]);

        expect(stateVariables["/Pcoords"].stateValues.value.tree).eqls([
            "vector",
            3,
            5,
        ]);
        expect(stateVariables["/g2Pcoords"].stateValues.value.tree).eqls([
            "vector",
            7,
            6,
        ]);
    });

    it("add children with copySource, different newNamespace combinations", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g1">
      <point name="P1">(1,2)</point>
    </graph>

    <graph name="g1a" copySource="g1">
      <vector name="v1">(4,5)</vector>
    </graph>

    <math name="P1coords" copySource="P1" />
    <math name="v1displacement" copySource="v1" />

    <graph name="g2">
      <point name="P2">(1,2)</point>
    </graph>

    <graph name="g2a" copySource="g2" newNamespace>
      <vector name="v2">(4,5)</vector>
    </graph>

    <math name="P2coords" copySource="P2" />
    <math name="P2acoords" copySource="g2a/P2" />
    <math name="v2displacement" copySource="g2a/v2" />

    <graph name="g3" newNamespace>
      <point name="P3">(1,2)</point>
    </graph>

    <graph name="g3a" copySource="g3" newNamespace>
      <vector name="v3">(4,5)</vector>
    </graph>

    <math name="P3coords" copySource="g3/P3" />
    <math name="P3acoords" copySource="g3a/P3" />
    <math name="v3displacement" copySource="g3a/v3" />

    <graph name="g4" newNamespace>
      <point name="P4">(1,2)</point>
    </graph>

    <graph name="g4a" copySource="g4">
      <vector name="v4">(4,5)</vector>
    </graph>

    <math name="P4coords" copySource="g4/P4" />
    <math name="P4acoords" copySource="g4a/P4" />
    <math name="v4displacement" copySource="v4" />



    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g1"].activeChildren.length).eq(1);
        expect(stateVariables["/g1"].activeChildren[0].componentIdx).eq("/P1");
        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/g1a"].activeChildren.length).eq(2);
        expect(stateVariables["/g1a"].activeChildren[1].componentIdx).eq("/v1");
        let P1aName = stateVariables["/g1a"].activeChildren[0].componentIdx;
        expect(stateVariables[P1aName].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(
            stateVariables["/v1"].stateValues.displacement.map((x) => x.tree),
        ).eqls([4, 5]);
        expect(stateVariables["/P1coords"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/v1displacement"].stateValues.value.tree).eqls([
            "vector",
            4,
            5,
        ]);

        expect(stateVariables["/g2"].activeChildren.length).eq(1);
        expect(stateVariables["/g2"].activeChildren[0].componentIdx).eq("/P2");
        expect(stateVariables["/P2"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/g2a"].activeChildren.length).eq(2);
        expect(stateVariables["/g2a"].activeChildren[0].componentIdx).eq(
            "/g2a/P2",
        );
        expect(stateVariables["/g2a"].activeChildren[1].componentIdx).eq(
            "/g2a/v2",
        );
        expect(
            stateVariables["/g2a/P2"].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/g2a/v2"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([4, 5]);
        expect(stateVariables["/P2coords"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/P2acoords"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/v2displacement"].stateValues.value.tree).eqls([
            "vector",
            4,
            5,
        ]);

        expect(stateVariables["/g3"].activeChildren.length).eq(1);
        expect(stateVariables["/g3"].activeChildren[0].componentIdx).eq(
            "/g3/P3",
        );
        expect(stateVariables["/g3/P3"].stateValues.xs.map((x) => x.tree)).eqls(
            [1, 2],
        );
        expect(stateVariables["/g3a"].activeChildren.length).eq(2);
        expect(stateVariables["/g3a"].activeChildren[0].componentIdx).eq(
            "/g3a/P3",
        );
        expect(stateVariables["/g3a"].activeChildren[1].componentIdx).eq(
            "/g3a/v3",
        );
        expect(
            stateVariables["/g3a/P3"].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/g3a/v3"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([4, 5]);
        expect(stateVariables["/P3coords"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/P3acoords"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/v3displacement"].stateValues.value.tree).eqls([
            "vector",
            4,
            5,
        ]);

        expect(stateVariables["/g4"].activeChildren.length).eq(1);
        expect(stateVariables["/g4"].activeChildren[0].componentIdx).eq(
            "/g4/P4",
        );
        expect(stateVariables["/g4/P4"].stateValues.xs.map((x) => x.tree)).eqls(
            [1, 2],
        );
        expect(stateVariables["/g4a"].activeChildren.length).eq(2);
        expect(stateVariables["/g4a"].activeChildren[0].componentIdx).eq(
            "/g4a/P4",
        );
        expect(stateVariables["/g4a"].activeChildren[1].componentIdx).eq("/v4");
        expect(
            stateVariables["/g4a/P4"].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/v4"].stateValues.displacement.map((x) => x.tree),
        ).eqls([4, 5]);
        expect(stateVariables["/P4coords"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/P4acoords"].stateValues.value.tree).eqls([
            "vector",
            1,
            2,
        ]);
        expect(stateVariables["/v4displacement"].stateValues.value.tree).eqls([
            "vector",
            4,
            5,
        ]);

        // move points

        await movePoint({ name: "/P1", x: 3, y: 5, core });
        await moveVector({ name: "/v1", headcoords: [8, 7], core });
        await movePoint({ name: "/P2", x: 6, y: 0, core });
        await moveVector({ name: "/g2a/v2", headcoords: [9, 1], core });
        await movePoint({ name: "/g3/P3", x: 5, y: 8, core });
        await moveVector({ name: "/g3a/v3", headcoords: [8, 6], core });
        await movePoint({ name: "/g4/P4", x: 0, y: 3, core });
        await moveVector({ name: "/v4", headcoords: [7, 2], core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 5,
        ]);
        expect(stateVariables[P1aName].stateValues.xs.map((x) => x.tree)).eqls([
            3, 5,
        ]);
        expect(
            stateVariables["/v1"].stateValues.displacement.map((x) => x.tree),
        ).eqls([8, 7]);
        expect(stateVariables["/P1coords"].stateValues.value.tree).eqls([
            "vector",
            3,
            5,
        ]);
        expect(stateVariables["/v1displacement"].stateValues.value.tree).eqls([
            "vector",
            8,
            7,
        ]);

        expect(stateVariables["/P2"].stateValues.xs.map((x) => x.tree)).eqls([
            6, 0,
        ]);
        expect(
            stateVariables["/g2a/P2"].stateValues.xs.map((x) => x.tree),
        ).eqls([6, 0]);
        expect(
            stateVariables["/g2a/v2"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([9, 1]);
        expect(stateVariables["/P2coords"].stateValues.value.tree).eqls([
            "vector",
            6,
            0,
        ]);
        expect(stateVariables["/P2acoords"].stateValues.value.tree).eqls([
            "vector",
            6,
            0,
        ]);
        expect(stateVariables["/v2displacement"].stateValues.value.tree).eqls([
            "vector",
            9,
            1,
        ]);

        expect(stateVariables["/g3/P3"].stateValues.xs.map((x) => x.tree)).eqls(
            [5, 8],
        );
        expect(
            stateVariables["/g3a/P3"].stateValues.xs.map((x) => x.tree),
        ).eqls([5, 8]);
        expect(
            stateVariables["/g3a/v3"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([8, 6]);
        expect(stateVariables["/P3coords"].stateValues.value.tree).eqls([
            "vector",
            5,
            8,
        ]);
        expect(stateVariables["/P3acoords"].stateValues.value.tree).eqls([
            "vector",
            5,
            8,
        ]);
        expect(stateVariables["/v3displacement"].stateValues.value.tree).eqls([
            "vector",
            8,
            6,
        ]);

        expect(stateVariables["/g4/P4"].stateValues.xs.map((x) => x.tree)).eqls(
            [0, 3],
        );
        expect(
            stateVariables["/g4a/P4"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, 3]);
        expect(
            stateVariables["/v4"].stateValues.displacement.map((x) => x.tree),
        ).eqls([7, 2]);
        expect(stateVariables["/P4coords"].stateValues.value.tree).eqls([
            "vector",
            0,
            3,
        ]);
        expect(stateVariables["/P4acoords"].stateValues.value.tree).eqls([
            "vector",
            0,
            3,
        ]);
        expect(stateVariables["/v4displacement"].stateValues.value.tree).eqls([
            "vector",
            7,
            2,
        ]);

        // move shadowed points

        await movePoint({ name: P1aName, x: 2, y: 1, core });
        await movePoint({ name: "/g2a/P2", x: 5, y: 4, core });
        await movePoint({ name: "/g3a/P3", x: 9, y: 7, core });
        await movePoint({ name: "/g4a/P4", x: 7, y: 6, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            2, 1,
        ]);
        expect(stateVariables[P1aName].stateValues.xs.map((x) => x.tree)).eqls([
            2, 1,
        ]);
        expect(
            stateVariables["/v1"].stateValues.displacement.map((x) => x.tree),
        ).eqls([8, 7]);
        expect(stateVariables["/P1coords"].stateValues.value.tree).eqls([
            "vector",
            2,
            1,
        ]);
        expect(stateVariables["/v1displacement"].stateValues.value.tree).eqls([
            "vector",
            8,
            7,
        ]);

        expect(stateVariables["/P2"].stateValues.xs.map((x) => x.tree)).eqls([
            5, 4,
        ]);
        expect(
            stateVariables["/g2a/P2"].stateValues.xs.map((x) => x.tree),
        ).eqls([5, 4]);
        expect(
            stateVariables["/g2a/v2"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([9, 1]);
        expect(stateVariables["/P2coords"].stateValues.value.tree).eqls([
            "vector",
            5,
            4,
        ]);
        expect(stateVariables["/P2acoords"].stateValues.value.tree).eqls([
            "vector",
            5,
            4,
        ]);
        expect(stateVariables["/v2displacement"].stateValues.value.tree).eqls([
            "vector",
            9,
            1,
        ]);

        expect(stateVariables["/g3/P3"].stateValues.xs.map((x) => x.tree)).eqls(
            [9, 7],
        );
        expect(
            stateVariables["/g3a/P3"].stateValues.xs.map((x) => x.tree),
        ).eqls([9, 7]);
        expect(
            stateVariables["/g3a/v3"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([8, 6]);
        expect(stateVariables["/P3coords"].stateValues.value.tree).eqls([
            "vector",
            9,
            7,
        ]);
        expect(stateVariables["/P3acoords"].stateValues.value.tree).eqls([
            "vector",
            9,
            7,
        ]);
        expect(stateVariables["/v3displacement"].stateValues.value.tree).eqls([
            "vector",
            8,
            6,
        ]);

        expect(stateVariables["/g4/P4"].stateValues.xs.map((x) => x.tree)).eqls(
            [7, 6],
        );
        expect(
            stateVariables["/g4a/P4"].stateValues.xs.map((x) => x.tree),
        ).eqls([7, 6]);
        expect(
            stateVariables["/v4"].stateValues.displacement.map((x) => x.tree),
        ).eqls([7, 2]);
        expect(stateVariables["/P4coords"].stateValues.value.tree).eqls([
            "vector",
            7,
            6,
        ]);
        expect(stateVariables["/P4acoords"].stateValues.value.tree).eqls([
            "vector",
            7,
            6,
        ]);
        expect(stateVariables["/v4displacement"].stateValues.value.tree).eqls([
            "vector",
            7,
            2,
        ]);
    });

    it("add children with copySource, ignore implicit newNamespace when copied", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="grp">
      <graph name="g" size="small" newNamespace>
        <point name="P">(1,2)</point>
      </graph>
    
      <graph name="g2" copySource="g">
        <vector name="v" />
      </graph>
    
      <graph name="g3" copySource="g2" newNamespace />

      <graph name="g4" copySource="g2" />
    
    </group>
    
    <group copySource="grp" name="grp2" newNamespace />
  
    <p>Point 1: <math copySource="g/P" name="P1coords" /></p>
    <p>Point 2: <math copySource="g2/P" name="P2coords" /></p>
    <p>Vector 2: <math copySource="v" name="v2displacement" /></p>
    <p>Point 3: <math copySource="g3/P" name="P3coords" /></p>
    <p>Vector 3: <math copySource="g3/v" name="v3displacement" /></p>
    <p>Point 4: <math copySource="g4/P" name="P4coords" /></p>
    <p>Nothing at g4/v: <math copySource="g4/v" name="v4nodisplacement" /></p>

    <group name="grp2ps" newNamespace>
      <p>Grp2 Point 1: <math copySource="/grp2/g/P" name="P1coords" /></p>
      <p>Grp2 Point 2: <math copySource="/grp2/g2/P" name="P2coords" /></p>

      <p>Grp2 Vector 2: <math copySource="/grp2/v" name="v2displacement" /></p>
      <p>Nothing at /grp2/g2/v: <math copySource="/grp2/g2/v" name="v2nodisplacement" /></p>

      <p>Grp2 Point 3: <math copySource="/grp2/g3/P" name="P3coords" /></p>
      <p>Grp2 Vector 3: <math copySource="/grp2/g3/v" name="v3displacement" /></p>
 
      <p>Grp2 Point 4: <math copySource="/grp2/g4/P" name="P4coords" /></p>
      <p>Nothing at /grp2/g4/v: <math copySource="/grp2/g4/v" name="v4nodisplacement" /></p>
    </group>


    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const coordsNames = [
            "/P1coords",
            "/P2coords",
            "/P3coords",
            "/P4coords",
            "/grp2ps/P1coords",
            "/grp2ps/P2coords",
            "/grp2ps/P3coords",
            "/grp2ps/P4coords",
        ];

        for (let name of coordsNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls([
                "vector",
                1,
                2,
            ]);
        }

        const displacementNames = [
            "/v2displacement",
            "/v3displacement",
            "/grp2ps/v2displacement",
            "/grp2ps/v3displacement",
        ];
        for (let name of displacementNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls([
                "vector",
                1,
                0,
            ]);
        }

        const noDisplacementNames = [
            "/v4nodisplacement",
            "/grp2ps/v2nodisplacement",
            "/grp2ps/v4nodisplacement",
        ];
        for (let name of noDisplacementNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls("\uff3f");
        }

        expect(stateVariables["/g/P"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(
            stateVariables["/v"].stateValues.displacement.map((x) => x.tree),
        ).eqls([1, 0]);
        expect(stateVariables["/g3/P"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(
            stateVariables["/g3/v"].stateValues.displacement.map((x) => x.tree),
        ).eqls([1, 0]);
        expect(stateVariables["/g4/P"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        let g4vName = stateVariables["/g4"].activeChildren[1].componentIdx;
        expect(g4vName.substring(0, 3) === "/__");
        expect(
            stateVariables[g4vName].stateValues.displacement.map((x) => x.tree),
        ).eqls([1, 0]);
        expect(stateVariables["/g4/v"]).eq(undefined);

        expect(
            stateVariables["/grp2/g/P"].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/grp2/g2/P"].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/grp2/v"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([1, 0]);
        expect(stateVariables["/grp2/g2/v"]).eq(undefined);
        expect(
            stateVariables["/grp2/g3/P"].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/grp2/g3/v"].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([1, 0]);
        expect(
            stateVariables["/grp2/g4/P"].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        let grp2g4vName =
            stateVariables["/grp2/g4"].activeChildren[1].componentIdx;
        expect(grp2g4vName.substring(0, 3) === "/__");
        expect(
            stateVariables[grp2g4vName].stateValues.displacement.map(
                (x) => x.tree,
            ),
        ).eqls([1, 0]);
        expect(stateVariables["/grp2/g4/v"]).eq(undefined);
    });

    it("add children with copySource, multiple levels of groups", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="grp0" >
      <group name="grp1">
    
        <graph name="g" newNamespace>
          <point name="P">(1,2)</point>
        </graph>
      
        <graph name="g2" copySource="g">
          <vector name="v">(4,5)</vector>
        </graph>
      
        <graph name="g3" copySource="g2" newNamespace>
          <circle name="c" center="$(../g/P)" />
          <lineSegment name="l" endpoints="$P $(../v.head)" />
        </graph>
      
        $g{name="g4"}
        
        <graph copySource="g4" name="g5" newNamespace>
          <circle name="c" />
        </graph>
        
      </group>
      
      
      <group copySource="grp1" name="grp2" newNamespace>
      
        <graph copySource="../g5" name="g6">
          <lineSegment name="l" endpoints="$(g6/c.center) $(../g4/P)" />
        </graph>
      
      </group>
    
    </group>
    
    
    <group copySource="grp0" name="grp3" newNamespace>
    
      <graph copySource="../grp2/g6" name="g7" newNamespace>
        <vector name="v" tail="$l.endpoint1" head="$(../v.head)" />
      </graph>
    
    </group>
    
    <p>Point 1: <math copySource="g/P" name="P1coords" /></p>
    <p>Point 2: <math copySource="g2/P" name="P2coords" /></p>
    <p>Vector 2: <math copySource="v" name="v2displacement" /></p>
    <p>Point 3: <math copySource="g3/P" name="P3coords" /></p>
    <p>Vector 3: <math copySource="g3/v" name="v3displacement" /></p>
    <p>Circle 3 center: <math copySource="g3/c.center" name="c3center" /></p>
    <p>Line segment 3 point 1: <math copySource="g3/l.endpoint1" name="l3point1" /></p>
    <p>Line segment 3 point 2: <math copySource="g3/l.endpoint2" name="l3point2" /></p>
    <p>Point 4: <math copySource="g4/P" name="P4coords" /></p>
    <p>Point 5: <math copySource="g5/P" name="P5coords" /></p>
    <p>Circle 5 center: <math copySource="g5/c.center" name="c5center" /></p>
    
    <group name="grp2ps" newNamespace>
      <p>Grp2 Point 1: <math copySource="/grp2/g/P" name="P1coords" /></p>
      <p>Grp2 Point 2: <math copySource="/grp2/g2/P" name="P2coords" /></p>
      <p>Grp2 Vector 2: <math copySource="/grp2/v" name="v2displacement" /></p>
      <p>Grp2 Point 3: <math copySource="/grp2/g3/P" name="P3coords" /></p>
      <p>Grp2 Vector 3: <math copySource="/grp2/g3/v" name="v3displacement" /></p>
      <p>Grp2 Circle 3 center: <math copySource="/grp2/g3/c.center" name="c3center" /></p>
      <p>Grp2 Line segment 3 point 1: <math copySource="/grp2/g3/l.endpoint1" name="l3point1" /></p>
      <p>Grp2 Line segment 3 point 2: <math copySource="/grp2/g3/l.endpoint2" name="l3point2" /></p>
      <p>Grp2 Point 4: <math copySource="/grp2/g4/P" name="P4coords" /></p>
      <p>Grp2 Point 5: <math copySource="/grp2/g5/P" name="P5coords" /></p>
      <p>Grp2 Circle 5 center: <math copySource="/grp2/g5/c.center" name="c5center" /></p>
      <p>Grp2 Point 6: <math copySource="/grp2/g6/P" name="P6coords" /></p>
      <p>Grp2 Circle 6 center: <math copySource="/grp2/g6/c.center" name="c6center" /></p>
      <p>Grp2 Line segment 6 point 1: <math copySource="/grp2/l.endpoint1" name="l6point1" /></p>
      <p>Grp2 Line segment 6 point 2: <math copySource="/grp2/l.endpoint2" name="l6point2" /></p>
    </group>

    
    <group name="grp3ps" newNamespace>

      <p>Grp3 Point 1: <math copySource="/grp3/g/P" name="P1coords" /></p>
      <p>Grp3 Point 2: <math copySource="/grp3/g2/P" name="P2coords" /></p>
      <p>Grp3 Vector 2: <math copySource="/grp3/v" name="v2displacement" /></p>
      <p>Grp3 Point 3: <math copySource="/grp3/g3/P" name="P3coords" /></p>
      <p>Grp3 Vector 3: <math copySource="/grp3/g3/v" name="v3displacement" /></p>
      <p>Grp3 Circle 3 center: <math copySource="/grp3/g3/c.center" name="c3center" /></p>
      <p>Grp3 Line segment 3 point 1: <math copySource="/grp3/g3/l.endpoint1" name="l3point1" /></p>
      <p>Grp3 Line segment 3 point 2: <math copySource="/grp3/g3/l.endpoint2" name="l3point2" /></p>
      <p>Grp3 Point 4: <math copySource="/grp3/g4/P" name="P4coords" /></p>
      <p>Grp3 Point 5: <math copySource="/grp3/g5/P" name="P5coords" /></p>
      <p>Grp3 Circle 5 center: <math copySource="/grp3/g5/c.center" name="c5center" /></p>
      
      <group name="grp2ps" newNamespace>
        <p>Grp3 Grp2 Point 1: <math copySource="/grp3/grp2/g/P" name="P1coords" /></p>
        <p>Grp3 Grp2 Point 2: <math copySource="/grp3/grp2/g2/P" name="P2coords" /></p>
        <p>Grp3 Grp2 Vector 2: <math copySource="/grp3/grp2/v" name="v2displacement" /></p>
        <p>Grp3 Grp2 Point 3: <math copySource="/grp3/grp2/g3/P" name="P3coords" /></p>
        <p>Grp3 Grp2 Vector 3: <math copySource="/grp3/grp2/g3/v" name="v3displacement" /></p>
        <p>Grp3 Grp2 Circle 3 center: <math copySource="/grp3/grp2/g3/c.center" name="c3center" /></p>
        <p>Grp3 Grp2 Line segment 3 point 1: <math copySource="/grp3/grp2/g3/l.endpoint1" name="l3point1" /></p>
        <p>Grp3 Grp2 Line segment 3 point 2: <math copySource="/grp3/grp2/g3/l.endpoint2" name="l3point2" /></p>
        <p>Grp3 Grp2 Point 4: <math copySource="/grp3/grp2/g4/P" name="P4coords" /></p>
        <p>Grp3 Grp2 Point 5: <math copySource="/grp3/grp2/g5/P" name="P5coords" /></p>
        <p>Grp3 Grp2 Circle 5 center: <math copySource="/grp3/grp2/g5/c.center" name="c5center" /></p>
        <p>Grp3 Grp2 Point 6: <math copySource="/grp3/grp2/g6/P" name="P6coords" /></p>
        <p>Grp3 Grp2 Circle 6 center: <math copySource="/grp3/grp2/g6/c.center" name="c6center" /></p>
        <p>Grp3 Grp2 Line segment 6 point 1: <math copySource="/grp3/grp2/l.endpoint1" name="l6point1" /></p>
        <p>Grp3 Grp2 Line segment 6 point 2: <math copySource="/grp3/grp2/l.endpoint2" name="l6point2" /></p>
        <p>Grp3 Point 7: <math copySource="/grp3/g7/P" name="P7coords" /></p>
        <p>Grp3 Circle 7 center: <math copySource="/grp3/g7/c.center" name="c7center" /></p>
        <p>Grp3 Line segment 7 point 1: <math copySource="/grp3/g7/l.endpoint1" name="l7point1" /></p>
        <p>Grp3 Line segment 7 point 2: <math copySource="/grp3/g7/l.endpoint2" name="l7point2" /></p>
        <p>Grp3 Vector 7 head: <math copySource="/grp3/g7/v.head" name="v7head" /></p>
        <p>Grp3 Vector 7 tail: <math copySource="/grp3/g7/v.tail" name="v7tail" /></p>
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
                "/P1coords",
                "/P2coords",
                "/P3coords",
                "/P4coords",
                "/P5coords",
                "/grp2ps/P1coords",
                "/grp2ps/P2coords",
                "/grp2ps/P3coords",
                "/grp2ps/P4coords",
                "/grp2ps/P5coords",
                "/grp2ps/P6coords",
                "/grp3ps/P1coords",
                "/grp3ps/P2coords",
                "/grp3ps/P3coords",
                "/grp3ps/P4coords",
                "/grp3ps/P5coords",
                "/grp3ps/grp2ps/P1coords",
                "/grp3ps/grp2ps/P2coords",
                "/grp3ps/grp2ps/P3coords",
                "/grp3ps/grp2ps/P4coords",
                "/grp3ps/grp2ps/P5coords",
                "/grp3ps/grp2ps/P6coords",
                "/grp3ps/grp2ps/P7coords",
                "/c3center",
                "/l3point1",
                "/grp2ps/c3center",
                "/grp2ps/l3point1",
                "/grp2ps/l6point2",
                "/grp3ps/c3center",
                "/grp3ps/l3point1",
                "/grp3ps/grp2ps/l7point2",
                "/grp3ps/grp2ps/c3center",
                "/grp3ps/grp2ps/l3point1",
            ];

            for (let name of coordsNames) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...P,
                ]);
            }

            const displacementNames = [
                "/v2displacement",
                "/v3displacement",
                "/grp2ps/v2displacement",
                "/grp2ps/v3displacement",
                "/grp3ps/v2displacement",
                "/grp3ps/v3displacement",
                "/grp3ps/grp2ps/v2displacement",
                "/grp3ps/grp2ps/v3displacement",
            ];
            for (let name of displacementNames) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...v,
                ]);
            }

            const headNames = [
                "/l3point2",
                "/grp2ps/l3point2",
                "/grp3ps/l3point2",
                "/grp3ps/grp2ps/l3point2",
                "/grp3ps/grp2ps/v7head",
            ];
            for (let name of headNames) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...vH,
                ]);
            }

            const centerNames = [
                "/c5center",
                "/grp2ps/c5center",
                "/grp2ps/l6point1",
                "/grp3ps/c5center",
                "/grp3ps/grp2ps/c5center",
                "/grp3ps/grp2ps/l6point1",
                "/grp3ps/grp2ps/l7point1",
                "/grp3ps/grp2ps/v7tail",
            ];
            for (let name of centerNames) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...c0,
                ]);
            }

            expect(
                stateVariables["/g/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/g3/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/g3/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/g3/c"].stateValues.center.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/g3/l"].stateValues.endpoints[0].map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/g3/l"].stateValues.endpoints[1].map(
                    (x) => x.tree,
                ),
            ).eqls(vH);
            expect(
                stateVariables["/g4/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/g5/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/g5/c"].stateValues.center.map((x) => x.tree),
            ).eqls(c0);

            expect(
                stateVariables["/grp2/g/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp2/g2/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp2/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/grp2/g3/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp2/g3/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/grp2/g3/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp2/g3/l"].stateValues.endpoints[0].map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp2/g3/l"].stateValues.endpoints[1].map(
                    (x) => x.tree,
                ),
            ).eqls(vH);
            expect(
                stateVariables["/grp2/g4/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp2/g5/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp2/g5/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp2/g6/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp2/g6/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp2/l"].stateValues.endpoints[0].map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp2/l"].stateValues.endpoints[1].map(
                    (x) => x.tree,
                ),
            ).eqls(P);

            expect(
                stateVariables["/grp3/g/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g2/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp3/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/grp3/g3/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g3/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/grp3/g3/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g3/l"].stateValues.endpoints[0].map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g3/l"].stateValues.endpoints[1].map(
                    (x) => x.tree,
                ),
            ).eqls(vH);
            expect(
                stateVariables["/grp3/g4/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g5/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g5/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(c0);

            expect(
                stateVariables["/grp3/grp2/g/P"].stateValues.xs.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/g2/P"].stateValues.xs.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/grp3/grp2/g3/P"].stateValues.xs.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/g3/v"].stateValues.displacement.map(
                    (x) => x.tree,
                ),
            ).eqls(v);
            expect(
                stateVariables["/grp3/grp2/g3/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[0].map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[1].map(
                    (x) => x.tree,
                ),
            ).eqls(vH);
            expect(
                stateVariables["/grp3/grp2/g4/P"].stateValues.xs.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/g5/P"].stateValues.xs.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/g5/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp3/grp2/g6/P"].stateValues.xs.map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/grp2/g6/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp3/grp2/l"].stateValues.endpoints[0].map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp3/grp2/l"].stateValues.endpoints[1].map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g7/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g7/c"].stateValues.center.map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp3/g7/l"].stateValues.endpoints[0].map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
            expect(
                stateVariables["/grp3/g7/l"].stateValues.endpoints[1].map(
                    (x) => x.tree,
                ),
            ).eqls(P);
            expect(
                stateVariables["/grp3/g7/v"].stateValues.head.map(
                    (x) => x.tree,
                ),
            ).eqls(vH);
            expect(
                stateVariables["/grp3/g7/v"].stateValues.tail.map(
                    (x) => x.tree,
                ),
            ).eqls(c0);
        }

        let P = [1, 2];
        let v = [4, 5];
        let vH = [4, 5];
        let c0 = [0, 0];

        await check_items({ P, v, vH, c0 });

        // move objects

        P = [3, 5];
        await movePoint({ name: "/g/P", x: P[0], y: P[1], core });
        v = [8, 7];
        vH = [5, 1];
        await moveVector({
            name: "/v",
            headcoords: vH,
            tailcoords: [vH[0] - v[0], vH[1] - v[1]],
            core,
        });
        c0 = [6, 0];
        await moveCircle({ name: "/g5/c", cx: c0[0], cy: c0[1], core });

        await check_items({ P, v, vH, c0 });
    });

    it("add children with copySource, recreated replacements include added children", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="n" prefill="1" />

    <conditionalContent assignNames="(g1)">
      <case condition="$n>1">
        <graph newNamespace>
          <point name="P">(3,4)</point>
        </graph>
      </case>
      <else>
        <graph newnamespace>
          <point name="P">(5,6)</point>
        </graph>
      </else>
    </conditionalContent>
    
    <graph copySource="g1" name="g2" newNamespace>
      <point name="Q">(7,8)</point>
    </graph>
    `,
        });

        async function check_items(P: number[], Q: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/g1"].activeChildren.length).eq(1);
            expect(stateVariables["/g1"].activeChildren[0].componentIdx).eq(
                "/g1/P",
            );
            expect(
                stateVariables["/g1/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(stateVariables["/g2"].activeChildren.length).eq(2);
            expect(stateVariables["/g2"].activeChildren[0].componentIdx).eq(
                "/g2/P",
            );
            expect(stateVariables["/g2"].activeChildren[1].componentIdx).eq(
                "/g2/Q",
            );
            expect(
                stateVariables["/g2/P"].stateValues.xs.map((x) => x.tree),
            ).eqls(P);
            expect(
                stateVariables["/g2/Q"].stateValues.xs.map((x) => x.tree),
            ).eqls(Q);
        }

        let P = [5, 6],
            Q = [7, 8];

        await check_items(P, Q);

        // move points

        P = [10, 9];
        Q = [8, 4];
        await movePoint({ name: "/g1/P", x: P[0], y: P[1], core });
        await movePoint({ name: "/g2/Q", x: Q[0], y: Q[1], core });

        await check_items(P, Q);

        // switch to second option from conditional content
        P = [3, 4];
        Q = [7, 8];
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items(P, Q);

        // move new points
        P = [6, 1];
        Q = [9, 3];
        await movePoint({ name: "/g1/P", x: P[0], y: P[1], core });
        await movePoint({ name: "/g2/Q", x: Q[0], y: Q[1], core });
        await check_items(P, Q);

        // switch back to first option from conditional content
        P = [5, 6];
        Q = [7, 8];
        await updateMathInputValue({ latex: "0", name: "/n", core });
    });

    async function test_assign_names_group_map(core) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/a"].stateValues.value).eq("hi 1");
        expect(stateVariables["/b"].stateValues.value).eq("hi 2");
        expect(stateVariables["/c"].stateValues.value).eq("hi 1");
        expect(stateVariables["/d"].stateValues.value).eq("hi 2");
        expect(stateVariables["/e"].stateValues.value).eq("apple");
        expect(stateVariables["/f"].stateValues.value).eq("banana");
        expect(stateVariables["/g"].stateValues.value).eq("apple");
        expect(stateVariables["/h"].stateValues.value).eq("banana");
    }

    it("assign names with copySource of group and map", async () => {
        let core = await createTestCore({
            doenetML: `
    <map name="map1" assignNames="(a) (b)">
      <template><text>hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    <map copySource="map1" name="map2" assignNames="(c) (d)" />
    
    
    <group name="grp1" assignNames="e f">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    <group copySource="grp1" name="grp2" assignNames="g h" />

    `,
        });

        await test_assign_names_group_map(core);
    });

    it("assign names with macro copy of group and map", async () => {
        let core = await createTestCore({
            doenetML: `
    <map name="map1" assignNames="(a) (b)">
      <template><text>hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    $map1{name="map2" assignNames="(c) (d)"}
    
    
    <group name="grp1" assignNames="e f">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    $grp1{name="grp2" assignNames="g h"}

    `,
        });

        await test_assign_names_group_map(core);
    });

    async function test_assign_names_group_map_new_namespace(core) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/map1/a/t"].stateValues.value).eq("hi 1");
        expect(stateVariables["/map1/b/t"].stateValues.value).eq("hi 2");
        expect(stateVariables["/map2/c/t"].stateValues.value).eq("hi 1");
        expect(stateVariables["/map2/d/t"].stateValues.value).eq("hi 2");
        expect(stateVariables["/grp1/a"].stateValues.value).eq("apple");
        expect(stateVariables["/grp1/b"].stateValues.value).eq("banana");
        expect(stateVariables["/grp2/c"].stateValues.value).eq("apple");
        expect(stateVariables["/grp2/d"].stateValues.value).eq("banana");
    }

    it("assign names with copySource of group and map, newNamespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <map name="map1" newNamespace assignNames="a b">
      <template newNamespace><text name="t">hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    <map copySource="map1" name="map2" assignNames="c d" />
    
    
    <group name="grp1" newNamespace assignNames="a b">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    <group copySource="grp1" name="grp2" assignNames="c d" />

    `,
        });

        await test_assign_names_group_map_new_namespace(core);
    });

    it("assign names with macro copy of group and map, newNamespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <map name="map1" newNamespace assignNames="a b">
      <template newNamespace><text name="t">hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    $map1{name="map2" assignNames="c d"}
    
    
    <group name="grp1" newNamespace assignNames="a b">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    $grp1{name="grp2" assignNames="c d"}

    `,
        });

        await test_assign_names_group_map_new_namespace(core);
    });

    async function test_composite_replacement_skips_assign_names(core) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/a"].stateValues.value).eq("hi");
        expect(stateVariables["/b"].stateValues.value).eq("bye");
        expect(stateVariables["/c"].stateValues.value).eq("hi");
        expect(stateVariables["/d"].stateValues.value).eq("bye");
        expect(stateVariables["/p2/c"].stateValues.value).eq("hi");
        expect(stateVariables["/p2/d"].stateValues.value).eq("bye");
    }

    it("copySource composite replacement implicitly skips assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
      <text name="t1">hi</text>
      <text name="t2">bye</text>
      
      <group assignNames="a b" name="group1">
        <text copySource="t1" />
        <text copySource="t2" />
      </group>

      <p name="p1">
        <group copySource="group1" assignNames="c d" />
      </p>

      <p name="p2" copySource="p1" newNamespace />

    `,
        });

        await test_composite_replacement_skips_assign_names(core);
    });

    it("macro copy composite replacement implicitly skips assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
      <text name="t1">hi</text>
      <text name="t2">bye</text>
      
      <group assignNames="a b" name="group1">
        $t1
        $t2
      </group>

      <p name="p1">
        $group1{assignNames="c d"}
      </p>

      $p1{name="p2" newNamespace}

    `,
        });

        await test_composite_replacement_skips_assign_names(core);
    });

    it("copy and macro's prescribed name is used to assign name to replacement", async () => {
        let core = await createTestCore({
            doenetML: `
      <text name="t1">hi</text>
      <copy source="t1" name="t2" />
      $t1{name="t3"}
      
      <group name="grp1" newNamespace>
        <text name="text1">apple</text>
        <text name="text2">banana</text>
      </group>
      <copy source="grp1" name="grp2" />
      $grp1{name="grp3"}

      <point name="p">(3,4)</point>
      <copy source="p" prop="x" assignNames="x1" />
      <copy source="p.x" assignNames="x2" />
      $p.x{assignNames="x3"}

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/t1"].stateValues.value).eq("hi");
        expect(stateVariables["/t2"].stateValues.value).eq("hi");
        expect(stateVariables["/t3"].stateValues.value).eq("hi");

        expect(stateVariables["/grp1/text1"].stateValues.value).eq("apple");
        expect(stateVariables["/grp1/text2"].stateValues.value).eq("banana");
        expect(stateVariables["/grp2/text1"].stateValues.value).eq("apple");
        expect(stateVariables["/grp2/text2"].stateValues.value).eq("banana");
        expect(stateVariables["/grp3/text1"].stateValues.value).eq("apple");
        expect(stateVariables["/grp3/text2"].stateValues.value).eq("banana");

        expect(stateVariables["/p"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/x1"].stateValues.value.tree).eq(3);
        expect(stateVariables["/x2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/x3"].stateValues.value.tree).eq(3);
    });

    it("copy's automatically generated name not used", async () => {
        let core = await createTestCore({
            doenetML: `
      <text name="t1">hi</text> $t1{name="t2"}

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/t1"].stateValues.value).eq("hi");
        expect(stateVariables["/t2"].stateValues.value).eq("hi");
        expect(stateVariables["/_copy1"]).eq(undefined);
    });

    it("copy and macro's assignNames is used to assign name to prop replacement", async () => {
        let core = await createTestCore({
            doenetML: `
      <point name="p">(3,4)</point>
      <copy source="p.x" assignNames="x1" />
      $p.x{assignNames="x2"}

      <copy source="p.coords" assignNames="c1" />
      $p.coords{assignNames="c2"}

      <copy source="p.xs" assignNames="x11 x21" />
      $p.xs{assignNames="x12 x22"}

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/x1"].stateValues.value.tree).eq(3);
        expect(stateVariables["/x2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/c1"].stateValues.value.tree).eqls([
            "vector",
            3,
            4,
        ]);
        expect(stateVariables["/c2"].stateValues.value.tree).eqls([
            "vector",
            3,
            4,
        ]);
        expect(stateVariables["/x11"].stateValues.value.tree).eq(3);
        expect(stateVariables["/x21"].stateValues.value.tree).eq(4);
        expect(stateVariables["/x12"].stateValues.value.tree).eq(3);
        expect(stateVariables["/x22"].stateValues.value.tree).eq(4);
    });

    it("add children to copySource with prop and propIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="ind" prefill="1" />

    <graph>
      <rectangle name="rect" width="4" height="6" center="(3,5)"/>
      <point copySource="rect.vertices[$ind]" name="P">
        <label><m>V_$ind</m></label>
      </point>
    </graph>

    <p>P: <point name="Pa" copySource="P" /></p>
    <p>label of P: <label copySource="P.label" name="l" /></p>


    `,
        });

        async function check_items(ind: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (ind === 1) {
                expect(stateVariables["/Pa"].stateValues.coords.tree).eqls([
                    "vector",
                    1,
                    2,
                ]);
                expect(stateVariables["/l"].stateValues.value).eq("\\(V_ 1\\)");
                expect(
                    stateVariables["/P"].stateValues.xs.map((x) => x.tree),
                ).eqls([1, 2]);
                expect(stateVariables["/P"].stateValues.label).eq("\\(V_ 1\\)");
            } else if (ind === 2) {
                expect(stateVariables["/Pa"].stateValues.coords.tree).eqls([
                    "vector",
                    5,
                    2,
                ]);
                expect(stateVariables["/l"].stateValues.value).eq("\\(V_ 2\\)");
                expect(
                    stateVariables["/P"].stateValues.xs.map((x) => x.tree),
                ).eqls([5, 2]);
                expect(stateVariables["/P"].stateValues.label).eq("\\(V_ 2\\)");
            } else if (ind === 3) {
                expect(stateVariables["/Pa"].stateValues.coords.tree).eqls([
                    "vector",
                    5,
                    8,
                ]);
                expect(stateVariables["/l"].stateValues.value).eq("\\(V_ 3\\)");
                expect(
                    stateVariables["/P"].stateValues.xs.map((x) => x.tree),
                ).eqls([5, 8]);
                expect(stateVariables["/P"].stateValues.label).eq("\\(V_ 3\\)");
            } else {
                expect(stateVariables["/Pa"].stateValues.coords.tree).eqls([
                    "vector",
                    0,
                    0,
                ]);
                expect(stateVariables["/l"].stateValues.value).eq("");
                expect(
                    stateVariables["/P"].stateValues.xs.map((x) => x.tree),
                ).eqls([0, 0]);
                expect(stateVariables["/P"].stateValues.label).eq("");
            }
        }

        await check_items(1);

        // change to vertex 2
        await updateMathInputValue({ latex: "2", name: "/ind", core });
        await check_items(2);

        // invalid vertex
        await updateMathInputValue({ latex: "", name: "/ind", core });
        await check_items(0);

        // change to vertex 3
        await updateMathInputValue({ latex: "3", name: "/ind", core });
        await check_items(3);
    });

    it("dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(2,3)</point>
    </graph>
    
    <p name="p1">P: $P</p>
    <p name="p2">P: $P[1]</p>
    <p name="p3">nothing: $P[2]</p>
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


    <p name="p20">P: <copy source="P" /></p>
    <p name="p21">P: <copy source="P[1]" /></p>
    <p name="p22">nothing: <copy source="P[2]" /></p>
    <p name="p23">nothing: <copy source="P." /></p>
    <p name="p24">nothing: <copy source="P.1" /></p>
    <p name="p25">x of P: <copy source="P.x" /></p>
    <p name="p26">y of P: <copy source="P.y" /></p>
    <p name="p27">nothing: <copy source="P._x" /></p>
    <p name="p28">x of P: <copy source="P.xs[1]" /></p>
    <p name="p29">y of P: <copy source="P.xs[2]" /></p>
    <p name="p30">nothing: <copy source="P.xs[3]" /></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/p1"].stateValues.text).eq("P: ( 2, 3 )");
        expect(stateVariables["/p2"].stateValues.text).eq("P: ( 2, 3 )");
        expect(stateVariables["/p3"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p4"].stateValues.text).eq("P.: ( 2, 3 ).");
        expect(stateVariables["/p5"].stateValues.text).eq("P.1: ( 2, 3 ).1");
        expect(stateVariables["/p6"].stateValues.text).eq("x of P: 2");
        expect(stateVariables["/p7"].stateValues.text).eq("y of P: 3");
        expect(stateVariables["/p8"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p9"].stateValues.text).eq("x of P: 2");
        expect(stateVariables["/p10"].stateValues.text).eq("y of P: 3");
        expect(stateVariables["/p11"].stateValues.text).eq("nothing: ");

        expect(stateVariables["/p12"].stateValues.text).eq("P: ( 2, 3 )");
        expect(stateVariables["/p13"].stateValues.text).eq("(P).x: ( 2, 3 ).x");
        expect(stateVariables["/p14"].stateValues.text).eq("no match: $(P.)");
        expect(stateVariables["/p15"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p16"].stateValues.text).eq("x of P: 2");
        expect(stateVariables["/p17"].stateValues.text).eq("y of P: 3");
        expect(stateVariables["/p18"].stateValues.text).eq("x of P: 2");
        expect(stateVariables["/p19"].stateValues.text).eq("y of P: 3");

        expect(stateVariables["/p20"].stateValues.text).eq("P: ( 2, 3 )");
        expect(stateVariables["/p21"].stateValues.text).eq("P: ( 2, 3 )");
        expect(stateVariables["/p22"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p23"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p24"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p25"].stateValues.text).eq("x of P: 2");
        expect(stateVariables["/p26"].stateValues.text).eq("y of P: 3");
        expect(stateVariables["/p27"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p28"].stateValues.text).eq("x of P: 2");
        expect(stateVariables["/p29"].stateValues.text).eq("y of P: 3");
        expect(stateVariables["/p30"].stateValues.text).eq("nothing: ");
    });

    it("dot and array notation, chaining, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph size="small">
      <line name="l" through="(2/3,3) (5,6)" displayDigits="2" />
    </graph>
    
    <p name="p1">$l.points.coords</p>
    <p name="p2">$l.points.x</p>
    <p name="p3">$l.points.y</p>
    <p name="p4">$l.points.bad</p>
    <p name="p5">$l.points.xs[1]</p>
    <p name="p6">$l.points.xs[2]</p>
    <p name="p7">$l.points.xs[3]</p>

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

            expect(stateVariables["/p1"].stateValues.text).eq(
                `( ${P11}, ${P12} ), ( ${P21}, ${P22} )`,
            );
            expect(stateVariables["/p2"].stateValues.text).eq(`${P11}, ${P21}`);
            expect(stateVariables["/p3"].stateValues.text).eq(`${P12}, ${P22}`);
            expect(stateVariables["/p4"].stateValues.text).eq(``);
            expect(stateVariables["/p5"].stateValues.text).eq(`${P11}, ${P21}`);
            expect(stateVariables["/p6"].stateValues.text).eq(`${P12}, ${P22}`);
            expect(stateVariables["/p7"].stateValues.text).eq(``);

            expect(stateVariables["/p8"].stateValues.text).eq(
                `( ${P11}, ${P12} )`,
            );
            expect(stateVariables["/p9"].stateValues.text).eq(`${P11}`);
            expect(stateVariables["/p10"].stateValues.text).eq(`${P12}`);
            expect(stateVariables["/p11"].stateValues.text).eq(``);
            expect(stateVariables["/p12"].stateValues.text).eq(`${P11}`);
            expect(stateVariables["/p13"].stateValues.text).eq(`${P12}`);
            expect(stateVariables["/p14"].stateValues.text).eq(``);

            expect(stateVariables["/p15"].stateValues.text).eq(
                `( ${P21}, ${P22} )`,
            );
            expect(stateVariables["/p16"].stateValues.text).eq(`${P21}`);
            expect(stateVariables["/p17"].stateValues.text).eq(`${P22}`);
            expect(stateVariables["/p18"].stateValues.text).eq(``);
            expect(stateVariables["/p19"].stateValues.text).eq(`${P21}`);
            expect(stateVariables["/p20"].stateValues.text).eq(`${P22}`);
            expect(stateVariables["/p21"].stateValues.text).eq(``);

            expect(stateVariables["/p22"].stateValues.text).eq(``);
            expect(stateVariables["/p23"].stateValues.text).eq(``);
            expect(stateVariables["/p24"].stateValues.text).eq(``);
            expect(stateVariables["/p25"].stateValues.text).eq(``);
            expect(stateVariables["/p26"].stateValues.text).eq(``);
            expect(stateVariables["/p27"].stateValues.text).eq(``);
            expect(stateVariables["/p28"].stateValues.text).eq(``);

            expect(cleanLatex(stateVariables["/p29"].stateValues.text)).eq(
                `(${P11latex || P11},${P12}),(${P21},${P22})`,
            );
            expect(cleanLatex(stateVariables["/p30"].stateValues.text)).eq(
                `${P11latex || P11},${P21}`,
            );
            expect(cleanLatex(stateVariables["/p31"].stateValues.text)).eq(
                `${P12},${P22}`,
            );
            expect(cleanLatex(stateVariables["/p32"].stateValues.text)).eq(``);
            expect(cleanLatex(stateVariables["/p33"].stateValues.text)).eq(
                `${P11latex || P11},${P21}`,
            );
            expect(cleanLatex(stateVariables["/p34"].stateValues.text)).eq(
                `${P12},${P22}`,
            );
            expect(cleanLatex(stateVariables["/p35"].stateValues.text)).eq(``);

            expect(cleanLatex(stateVariables["/p36"].stateValues.text)).eq(
                `(${P11latex || P11},${P12})`,
            );
            expect(cleanLatex(stateVariables["/p37"].stateValues.text)).eq(
                `${P11latex || P11}`,
            );
            expect(cleanLatex(stateVariables["/p38"].stateValues.text)).eq(
                `${P12}`,
            );
            expect(cleanLatex(stateVariables["/p39"].stateValues.text)).eq(``);
            expect(cleanLatex(stateVariables["/p40"].stateValues.text)).eq(
                `${P11latex || P11}`,
            );
            expect(cleanLatex(stateVariables["/p41"].stateValues.text)).eq(
                `${P12}`,
            );
            expect(cleanLatex(stateVariables["/p42"].stateValues.text)).eq(``);

            expect(stateVariables["/p43"].stateValues.text).eq(`${P11}`);
            expect(stateVariables["/p44"].stateValues.text).eq(`${P12}`);
            expect(stateVariables["/p45"].stateValues.text).eq(`${P21}`);
            expect(stateVariables["/p46"].stateValues.text).eq(`${P22}`);
            expect(stateVariables["/p47"].stateValues.text).eq(``);
            expect(stateVariables["/p48"].stateValues.text).eq(``);
            expect(stateVariables["/p49"].stateValues.text).eq(``);
            expect(stateVariables["/p50"].stateValues.text).eq(``);
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
            name: "/l",
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

    it("dot and array notation, chaining, specify attributes, macros", async () => {
        let core = await createTestCore({
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

        expect(stateVariables["/p1"].stateValues.text).eq(
            `( ${P11Dig2}, ${P12Dig2} ), ( ${P21Dig2}, ${P22Dig2} )`,
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            `${P11Dig2}, ${P21Dig2}`,
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            `${P12Dig2}, ${P22Dig2}`,
        );
        expect(stateVariables["/p4"].stateValues.text).eq(``);
        expect(stateVariables["/p5"].stateValues.text).eq(
            `${P11Dig2}, ${P21Dig2}`,
        );
        expect(stateVariables["/p6"].stateValues.text).eq(
            `${P12Dig2}, ${P22Dig2}`,
        );
        expect(stateVariables["/p7"].stateValues.text).eq(``);

        expect(stateVariables["/p8"].stateValues.text).eq(
            `( ${P11Dec4}, ${P12Dec4} ), ( ${P21Dec4}, ${P22Dec4} )`,
        );
        expect(stateVariables["/p9"].stateValues.text).eq(
            `${P11Dec4}, ${P21Dec4}`,
        );
        expect(stateVariables["/p10"].stateValues.text).eq(
            `${P12Dec4}, ${P22Dec4}`,
        );
        expect(stateVariables["/p11"].stateValues.text).eq(``);
        expect(stateVariables["/p12"].stateValues.text).eq(
            `${P11Dec4}, ${P21Dec4}`,
        );
        expect(stateVariables["/p13"].stateValues.text).eq(
            `${P12Dec4}, ${P22Dec4}`,
        );
        expect(stateVariables["/p14"].stateValues.text).eq(``);

        expect(stateVariables["/p15"].stateValues.text).eq(
            `( ${P11Dec4}, ${P12Dec4} )`,
        );
        expect(stateVariables["/p16"].stateValues.text).eq(`${P11Dec4}`);
        expect(stateVariables["/p17"].stateValues.text).eq(`${P12Dec4}`);
        expect(stateVariables["/p18"].stateValues.text).eq(``);
        expect(stateVariables["/p19"].stateValues.text).eq(`${P11Dec4}`);
        expect(stateVariables["/p20"].stateValues.text).eq(`${P12Dec4}`);
        expect(stateVariables["/p21"].stateValues.text).eq(``);

        expect(stateVariables["/p22"].stateValues.text).eq(
            `( ${P11Dec4}, ${P12Dec4} ), ( ${P21Dec4}, ${P22Dec4} )`,
        );
        expect(stateVariables["/p23"].stateValues.text).eq(
            `${P11Dec4}, ${P21Dec4}`,
        );
        expect(stateVariables["/p24"].stateValues.text).eq(
            `${P12Dec4}, ${P22Dec4}`,
        );
        expect(stateVariables["/p25"].stateValues.text).eq(``);
        expect(stateVariables["/p26"].stateValues.text).eq(
            `${P11Dec4}, ${P21Dec4}`,
        );
        expect(stateVariables["/p27"].stateValues.text).eq(
            `${P12Dec4}, ${P22Dec4}`,
        );
        expect(stateVariables["/p28"].stateValues.text).eq(``);

        expect(stateVariables["/p29"].stateValues.text).eq(
            `( ${P11Dec4}, ${P12Dec4} )`,
        );
        expect(stateVariables["/p30"].stateValues.text).eq(`${P11Dec4}`);
        expect(stateVariables["/p31"].stateValues.text).eq(`${P12Dec4}`);
        expect(stateVariables["/p32"].stateValues.text).eq(``);
        expect(stateVariables["/p33"].stateValues.text).eq(`${P11Dec4}`);
        expect(stateVariables["/p34"].stateValues.text).eq(`${P12Dec4}`);
        expect(stateVariables["/p35"].stateValues.text).eq(``);

        expect(stateVariables["/p36"].stateValues.text).eq(
            "0 = -23.1058 x - 3.0203 y + 120.4105",
        );

        expect(stateVariables["/p37"].stateValues.text).eq(
            `( ${P11Dec4}, ${P12Dec4} ), ( ${P21Dec4}, ${P22Dec4} )`,
        );
        expect(stateVariables["/p38"].stateValues.text).eq(
            `( ${P11Dec4}, ${P12Dec4} )`,
        );
    });

    it("dot and array notation, chaining, nested", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph size="small">
      <line name="l" through="(1.92639372,9.8293629453) (5.9060742037,2.93520806203104)" />
      $l.points
    </graph>
    
    <p name="p1"><aslist>
      $l[1].points[$l.points[1].x]{displayDigits="$l.points[2].x"}.y
    </aslist></p>
    <p name="p2"><aslist>
      <copy source='l[1].points[$l.points[1].x]{displayDigits="$l.points[2].x"}.y' />
    </aslist></p>
    
    
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/p1"].stateValues.text).eq("2.93521");
        expect(stateVariables["/p2"].stateValues.text).eq("2.93521");

        await moveLine({
            name: "/l",
            point1coords: [1.38527302734, 8.48273402357],
            point2coords: [5.9060742037, 2.93520806203104],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/p1"].stateValues.text).eq("8.48273");
        expect(stateVariables["/p2"].stateValues.text).eq("8.48273");

        await moveLine({
            name: "/l",
            point1coords: [1.38527302734, 8.48273402357],
            point2coords: [4.482081034234, 7.34828203481],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/p1"].stateValues.text).eq("8.483");
        expect(stateVariables["/p2"].stateValues.text).eq("8.483");
    });

    it("dot and array notation, chaining, copy source, change type", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph size="small">
      <line name="l" through="(2/3,3/4) (5/8,6/10)" displayDigits="2" />
    </graph>
    
    <p name="p1"><aslist><copy source="l.points.coords" createComponentOfType="math" numComponents="2" /></aslist></p>
    <p name="p2"><aslist><copy source="l.points.x" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p3"><aslist><copy source="l.points.y" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p4"><aslist><copy source="l.points.bad" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p5"><aslist><copy source="l.points.xs[1]" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p6"><aslist><copy source="l.points.xs[2]" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p7"><aslist><copy source="l.points.xs[3]" createComponentOfType="number" numComponents="2" /></aslist></p>

    <p name="p8"><math copySource="l.points[1].coords" /></p>
    <p name="p9"><number copySource="l.points[1].x" /></p>
    <p name="p10"><number copysource="l.points[1].y" /></p>
    <p name="p11"><number copysource="l.points[1].bad" /></p>
    <p name="p12"><number copysource="l.points[1].xs[1]" /></p>
    <p name="p13"><number copysource="l.points[1].xs[2]" /></p>
    <p name="p14"><number copysource="l.points[1].xs[3]" /></p>

    <p name="p15"><math copysource="l.points[2].coords" /></p>
    <p name="p16"><number copysource="l.points[2].x" /></p>
    <p name="p17"><number copysource="l.points[2].y" /></p>
    <p name="p18"><number copysource="l.points[2].bad" /></p>
    <p name="p19"><number copysource="l.points[2].xs[1]" /></p>
    <p name="p20"><number copysource="l.points[2].xs[2]" /></p>
    <p name="p21"><number copysource="l.points[2].xs[3]" /></p>

    <p name="p22"><math copysource="l.points[3].coords" /></p>
    <p name="p23"><number copysource="l.points[3].x" /></p>
    <p name="p24"><number copysource="l.points[3].y" /></p>
    <p name="p25"><number copysource="l.points[3].bad" /></p>
    <p name="p26"><number copysource="l.points[3].xs[1]" /></p>
    <p name="p27"><number copysource="l.points[3].xs[2]" /></p>
    <p name="p28"><number copysource="l.points[3].xs[3]" /></p>

    <p name="p29"><aslist><copy source="l.points.coords.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p30"><aslist><copy source="l.points.x.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p31"><aslist><copy source="l.points.y.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p32"><aslist><copy source="l.points.bad.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p33"><aslist><copy source="l.points.xs[1].latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p34"><aslist><copy source="l.points.xs[2].latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p35"><aslist><copy source="l.points.xs[3].latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    
    <p name="p36"><text copysource="l.points[1].coords.latex" /></p>
    <p name="p37"><text copysource="l.points[1].x.latex" /></p>
    <p name="p38"><text copysource="l.points[1].y.latex" /></p>
    <p name="p39"><text copysource="l.points[1].bad.latex" /></p>
    <p name="p40"><text copysource="l.points[1].xs[1].latex" /></p>
    <p name="p41"><text copysource="l.points[1].xs[2].latex" /></p>
    <p name="p42"><text copysource="l.points[1].xs[3].latex" /></p>
    
    <p name="p43"><number copysource="l.points[1][1]" /></p>
    <p name="p44"><number copysource="l.points[1][2]" /></p>
    <p name="p45"><number copysource="l.points[2][1]" /></p>
    <p name="p46"><number copysource="l.points[2][2]" /></p>
    <p name="p47"><number copysource="l.points[0][1]" /></p>
    <p name="p48"><number copysource="l.points[1][0]" /></p>
    <p name="p49"><number copysource="l.points[1][3]" /></p>
    <p name="p50"><number copysource="l.points[3][1]" /></p>
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

            expect(stateVariables["/p1"].stateValues.text).eq(
                `( ${P11string || P11}, ${P12string || P12} ), ( ${P21string || P21}, ${P22string || P22} )`,
            );

            expect(stateVariables["/p2"].stateValues.text).eq(`${P11}, ${P21}`);
            expect(stateVariables["/p3"].stateValues.text).eq(`${P12}, ${P22}`);
            expect(stateVariables["/p4"].stateValues.text).eq(`NaN, NaN`);
            expect(stateVariables["/p5"].stateValues.text).eq(`${P11}, ${P21}`);
            expect(stateVariables["/p6"].stateValues.text).eq(`${P12}, ${P22}`);
            expect(stateVariables["/p7"].stateValues.text).eq(`NaN, NaN`);

            expect(stateVariables["/p8"].stateValues.text).eq(
                `( ${P11string || P11}, ${P12string || P12} )`,
            );
            expect(stateVariables["/p9"].stateValues.text).eq(`${P11}`);
            expect(stateVariables["/p10"].stateValues.text).eq(`${P12}`);
            expect(stateVariables["/p11"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p12"].stateValues.text).eq(`${P11}`);
            expect(stateVariables["/p13"].stateValues.text).eq(`${P12}`);
            expect(stateVariables["/p14"].stateValues.text).eq(`NaN`);

            expect(stateVariables["/p15"].stateValues.text).eq(
                `( ${P21string || P21}, ${P22string || P22} )`,
            );
            expect(stateVariables["/p16"].stateValues.text).eq(`${P21}`);
            expect(stateVariables["/p17"].stateValues.text).eq(`${P22}`);
            expect(stateVariables["/p18"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p19"].stateValues.text).eq(`${P21}`);
            expect(stateVariables["/p20"].stateValues.text).eq(`${P22}`);
            expect(stateVariables["/p21"].stateValues.text).eq(`NaN`);

            expect(stateVariables["/p22"].stateValues.text).eq(`\uff3f`);
            expect(stateVariables["/p23"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p24"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p25"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p26"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p27"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p28"].stateValues.text).eq(`NaN`);

            expect(cleanLatex(stateVariables["/p29"].stateValues.text)).eq(
                `(${P11latex || P11},${P12latex || P12}),(${P21latex || P21},${P22latex || P22})`,
            );
            expect(cleanLatex(stateVariables["/p30"].stateValues.text)).eq(
                `${P11latex || P11},${P21latex || P21}`,
            );
            expect(cleanLatex(stateVariables["/p31"].stateValues.text)).eq(
                `${P12latex || P12},${P22latex || P22}`,
            );
            expect(cleanLatex(stateVariables["/p32"].stateValues.text)).eq(``);
            expect(cleanLatex(stateVariables["/p33"].stateValues.text)).eq(
                `${P11latex || P11},${P21latex || P21}`,
            );
            expect(cleanLatex(stateVariables["/p34"].stateValues.text)).eq(
                `${P12latex || P12},${P22latex || P22}`,
            );
            expect(cleanLatex(stateVariables["/p35"].stateValues.text)).eq(``);

            expect(cleanLatex(stateVariables["/p36"].stateValues.text)).eq(
                `(${P11latex || P11},${P12latex || P12})`,
            );
            expect(cleanLatex(stateVariables["/p37"].stateValues.text)).eq(
                `${P11latex || P11}`,
            );
            expect(cleanLatex(stateVariables["/p38"].stateValues.text)).eq(
                `${P12latex || P12}`,
            );
            expect(cleanLatex(stateVariables["/p39"].stateValues.text)).eq(``);
            expect(cleanLatex(stateVariables["/p40"].stateValues.text)).eq(
                `${P11latex || P11}`,
            );
            expect(cleanLatex(stateVariables["/p41"].stateValues.text)).eq(
                `${P12latex || P12}`,
            );
            expect(cleanLatex(stateVariables["/p42"].stateValues.text)).eq(``);

            expect(stateVariables["/p43"].stateValues.text).eq(`${P11}`);
            expect(stateVariables["/p44"].stateValues.text).eq(`${P12}`);
            expect(stateVariables["/p45"].stateValues.text).eq(`${P21}`);
            expect(stateVariables["/p46"].stateValues.text).eq(`${P22}`);
            expect(stateVariables["/p47"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p48"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p49"].stateValues.text).eq(`NaN`);
            expect(stateVariables["/p50"].stateValues.text).eq(`NaN`);
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
            name: "/l",
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

    it("dot and array notation, multidimensional, dynamic", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph size="small">
      <line through="(1,2) (3,4)" />
      <line through="(5,7) (9,6)" />
    </graph>

    <graph size="small">
      <collect name="col" componentTypes="line" source="_graph1" />
    </graph>

    <p>Line number: <mathinput name="ln" prefill="1" /></p>
    <p>Point number: <mathinput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathinput name="cn" prefill="1" /></p>

    
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
                expect(stateVariables["/p1"].stateValues.text).eq(`${val}`);
                expect(stateVariables["/p2"].stateValues.text).eq(`${val}`);
                expect(stateVariables["/p3"].stateValues.text).eq(`${val}`);
                expect(stateVariables["/p4"].stateValues.text).eq(`${val}`);
            } else {
                expect(stateVariables["/p1"].stateValues.text).eq("");
                expect(stateVariables["/p2"].stateValues.text).eq("");
                expect(stateVariables["/p3"].stateValues.text).eq("");
                expect(stateVariables["/p4"].stateValues.text).eq("");
            }
        }

        await check_items({ ln: 1, pn: 1, cn: 1 });

        await updateMathInputValue({ latex: "", name: "/ln", core });
        await check_items({ ln: 0, pn: 1, cn: 1 });

        await updateMathInputValue({ latex: "2", name: "/ln", core });
        await check_items({ ln: 2, pn: 1, cn: 1 });

        await updateMathInputValue({ latex: "0", name: "/pn", core });
        await check_items({ ln: 2, pn: 0, cn: 1 });

        await updateMathInputValue({ latex: "2", name: "/pn", core });
        await check_items({ ln: 2, pn: 2, cn: 1 });

        await updateMathInputValue({ latex: "", name: "/cn", core });
        await check_items({ ln: 2, pn: 2, cn: 0 });

        await updateMathInputValue({ latex: "2", name: "/cn", core });
        await check_items({ ln: 2, pn: 2, cn: 2 });
    });

    it("dot and array notation, recurse to subnames of composite replacements", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <mathinput name="n" prefill="2" /></p>

    <map name="myMap">
      <template newnamespace>
        <p>The line through 
          <m>P=<point name="P">($v+1,$v+2)</point></m> and <m>Q=<point name="Q">($v+4, $v-1)</point></m>
          is <line name="l" through="$P $Q" />.</p>
      </template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    <p>Template number: <mathinput name="tn" prefill="1" /></p>
    <p>Point number: <mathinput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathinput name="cn" prefill="1" /></p>

    <p name="pt">The points from template $tn are: $(myMap[$tn]/P) and <copy source="myMap[$tn]/Q"/>.</p>
    <p name="pp">Point $pn from the line in that template is: $(myMap[$tn]/l.points[$pn]).</p>
    <p name="pc">Coordinate $cn from that point is $(myMap[$tn]/l.points[$pn].xs[$cn]).</p>
    <p name="pc2">Again, coordinate $cn from that point is <copy source="myMap[$tn]/l.points[$pn].xs[$cn]" />.</p>

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
                expect(stateVariables["/pt"].stateValues.text).contain(
                    "are:  and .",
                );
                expect(stateVariables["/pp"].stateValues.text).contain(
                    "from the line in that template is: .",
                );
                expect(stateVariables["/pc"].stateValues.text).contain(
                    "from that point is .",
                );
                expect(stateVariables["/pc2"].stateValues.text).contain(
                    "from that point is .",
                );
            } else {
                expect(stateVariables["/pt"].stateValues.text).contain(
                    `are: ( ${Pxs[tn - 1]}, ${Pys[tn - 1]} ) and ( ${Qxs[tn - 1]}, ${Qys[tn - 1]} ).`,
                );

                if (pn === 1) {
                    expect(stateVariables["/pp"].stateValues.text).contain(
                        `from the line in that template is: ( ${Pxs[tn - 1]}, ${Pys[tn - 1]} ).`,
                    );

                    if (cn === 1) {
                        expect(stateVariables["/pc"].stateValues.text).contain(
                            `from that point is ${Pxs[tn - 1]}.`,
                        );
                        expect(stateVariables["/pc2"].stateValues.text).contain(
                            `from that point is ${Pxs[tn - 1]}.`,
                        );
                    } else if (cn === 2) {
                        expect(stateVariables["/pc"].stateValues.text).contain(
                            `from that point is ${Pys[tn - 1]}.`,
                        );
                        expect(stateVariables["/pc2"].stateValues.text).contain(
                            `from that point is ${Pys[tn - 1]}.`,
                        );
                    } else {
                        expect(stateVariables["/pc"].stateValues.text).contain(
                            "from that point is .",
                        );
                        expect(stateVariables["/pc2"].stateValues.text).contain(
                            "from that point is .",
                        );
                    }
                } else if (pn === 2) {
                    expect(stateVariables["/pp"].stateValues.text).contain(
                        `from the line in that template is: ( ${Qxs[tn - 1]}, ${Qys[tn - 1]} ).`,
                    );

                    if (cn === 1) {
                        expect(stateVariables["/pc"].stateValues.text).contain(
                            `from that point is ${Qxs[tn - 1]}.`,
                        );
                        expect(stateVariables["/pc2"].stateValues.text).contain(
                            `from that point is ${Qxs[tn - 1]}.`,
                        );
                    } else if (cn === 2) {
                        expect(stateVariables["/pc"].stateValues.text).contain(
                            `from that point is ${Qys[tn - 1]}.`,
                        );
                        expect(stateVariables["/pc2"].stateValues.text).contain(
                            `from that point is ${Qys[tn - 1]}.`,
                        );
                    } else {
                        expect(stateVariables["/pc"].stateValues.text).contain(
                            "from that point is .",
                        );
                        expect(stateVariables["/pc2"].stateValues.text).contain(
                            "from that point is .",
                        );
                    }
                } else {
                    expect(stateVariables["/pp"].stateValues.text).contain(
                        "from the line in that template is: .",
                    );
                    expect(stateVariables["/pc"].stateValues.text).contain(
                        "from that point is .",
                    );
                    expect(stateVariables["/pc2"].stateValues.text).contain(
                        "from that point is .",
                    );
                }
            }
        }

        await check_items(2, 1, 1, 1);

        await updateMathInputValue({ latex: "2", name: "/tn", core });
        await check_items(2, 2, 1, 1);

        await updateMathInputValue({ latex: "3", name: "/tn", core });
        await check_items(2, 3, 1, 1);

        await updateMathInputValue({ latex: "4", name: "/n", core });
        await check_items(4, 3, 1, 1);

        await updateMathInputValue({ latex: "3", name: "/pn", core });
        await check_items(4, 3, 3, 1);

        await updateMathInputValue({ latex: "2", name: "/pn", core });
        await check_items(4, 3, 2, 1);

        await updateMathInputValue({ latex: "3", name: "/cn", core });
        await check_items(4, 3, 2, 3);

        await updateMathInputValue({ latex: "2", name: "/cn", core });
        await check_items(4, 3, 2, 2);

        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items(3, 3, 2, 2);

        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items(1, 3, 2, 2);

        await updateMathInputValue({ latex: "1", name: "/tn", core });
        await check_items(1, 1, 2, 2);
    });

    it("dot and array notation from group", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="grp">
      <math>x</math>
      copied will be blank
      <text fixed>hello</text>
      copied will also be blank
      <point>(4,5)</point>
      <line through="(10,9) (9,8)" />
      <p newNamespace>A <math name="m">y</math> and a <text name="t">word</text>.</p>
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
    <p name="p10">math from p: $(grp[7]/m)</p>
    <p name="p11">text from p: $(grp[7]/t)</p>
    <p name="p12">nothing: $grp[8]</p>
    <p name="p13">Prop fixed from group: $grp.fixed</p>
    <p name="p14">Prop x from group: $grp.x</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/p1"].stateValues.text).eq("the math: x");
        expect(stateVariables["/p2"].stateValues.text).eq("a blank: ");
        expect(stateVariables["/p3"].stateValues.text).eq("the text: hello");
        expect(stateVariables["/p4"].stateValues.text).eq("another blank: ");
        expect(stateVariables["/p5"].stateValues.text).eq(
            "the point: ( 4, 5 )",
        );
        expect(stateVariables["/p6"].stateValues.text).eq("the point x: 4");
        expect(stateVariables["/p7"].stateValues.text).eq(
            "the line: 0 = x - y - 1",
        );
        expect(stateVariables["/p8"].stateValues.text).eq(
            "the line, point 1: ( 10, 9 )",
        );
        expect(stateVariables["/p9"].stateValues.text).eq(
            "the line, point 2, y: 8",
        );
        expect(stateVariables["/p10"].stateValues.text).eq("math from p: y");
        expect(stateVariables["/p11"].stateValues.text).eq("text from p: word");
        expect(stateVariables["/p12"].stateValues.text).eq("nothing: ");
        expect(stateVariables["/p13"].stateValues.text).eq(
            "Prop fixed from group: false, true, false, false, false",
        );
        expect(stateVariables["/p14"].stateValues.text).eq(
            "Prop x from group: x, 4",
        );
    });

    it("implicitProp from an input", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="x+x" name="mi" />

    <p name="pmacro1">$mi</p>
    <p name="pmacro2">$mi{simplify}</p>
    <p name="pcopy1">$mi</p>
    <p name="pcopy2"><copy source="mi{simplify}" /></p>
    <p name="pcopy3"><copy source="mi" simplify /></p>
    <p name="pcopy4"><copy source="mi" createComponentOfType="mathinput" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let macrom1Name =
            stateVariables["/pmacro1"].activeChildren[0].componentIdx;
        let macrom2Name =
            stateVariables["/pmacro2"].activeChildren[0].componentIdx;
        let copym1Name =
            stateVariables["/pcopy1"].activeChildren[0].componentIdx;
        let copym2Name =
            stateVariables["/pcopy2"].activeChildren[0].componentIdx;
        let copym3Name =
            stateVariables["/pcopy3"].activeChildren[0].componentIdx;
        let copymi4Name =
            stateVariables["/pcopy4"].activeChildren[0].componentIdx;

        expect(stateVariables[macrom1Name].componentType).eq("math");
        expect(stateVariables[macrom2Name].componentType).eq("math");
        expect(stateVariables[copym1Name].componentType).eq("math");
        expect(stateVariables[copym2Name].componentType).eq("math");
        expect(stateVariables[copym3Name].componentType).eq("math");
        expect(stateVariables[copymi4Name].componentType).eq("mathInput");
        expect(stateVariables[macrom1Name].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
        ]);
        expect(stateVariables[macrom2Name].stateValues.value.tree).eqls([
            "*",
            2,
            "x",
        ]);
        expect(stateVariables[copym1Name].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
        ]);
        expect(stateVariables[copym2Name].stateValues.value.tree).eqls([
            "*",
            2,
            "x",
        ]);
        expect(stateVariables[copym3Name].stateValues.value.tree).eqls([
            "*",
            2,
            "x",
        ]);
        expect(stateVariables[copymi4Name].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
        ]);
    });

    async function test_implicit_prop_sampe_component_type_attributes(core) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        const simplifiedNames = [
            "/mimplicit1",
            "/mimplicit2",
            "/mimplicit3",
            "/mnotimplicit1",
            "/mnotimplicit2",
            "/mnotimplicit3",
        ];

        for (let name of simplifiedNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls([
                "*",
                2,
                "x",
            ]);
        }

        const nonsimplifiedNames = [
            "/mnotimplicit4",
            "/mnotimplicit5",
            "/mnotimplicit6",
        ];

        for (let name of nonsimplifiedNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls([
                "+",
                "x",
                "x",
            ]);
        }

        const xNames = ["/msubimplicit1", "/msubimplicit2", "/msubimplicit3"];

        for (let name of xNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls("x");
        }

        const yzNames = ["/nnotimplicit1", "/nnotimplicit2"];

        for (let name of yzNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls([
                "+",
                "y",
                "z",
            ]);
        }

        const yNames = ["/nsubimplicit1", "/nsubimplicit2"];

        for (let name of yNames) {
            expect(stateVariables[name].stateValues.value.tree).eqls("y");
        }

        expect(stateVariables["/mimplicit1"].activeChildren.length).eq(0);
        expect(stateVariables["/mimplicit2"].activeChildren.length).eq(0);
        expect(stateVariables["/mimplicit3"].activeChildren.length).eq(0);
        expect(stateVariables["/mnotimplicit1"].activeChildren.length).eq(2);
        expect(stateVariables["/mnotimplicit2"].activeChildren.length).eq(2);
        expect(stateVariables["/mnotimplicit3"].activeChildren.length).eq(2);
        expect(stateVariables["/mnotimplicit4"].activeChildren.length).eq(2);
        expect(stateVariables["/mnotimplicit5"].activeChildren.length).eq(2);
        expect(stateVariables["/mnotimplicit6"].activeChildren.length).eq(2);
        expect(stateVariables["/msubimplicit1"].activeChildren.length).eq(0);
        expect(stateVariables["/msubimplicit2"].activeChildren.length).eq(0);
        expect(stateVariables["/msubimplicit3"].activeChildren.length).eq(0);

        expect(stateVariables["/nnotimplicit1"].activeChildren.length).eq(2);
        expect(stateVariables["/nnotimplicit2"].activeChildren.length).eq(2);
        expect(stateVariables["/nsubimplicit1"].activeChildren.length).eq(0);
        expect(stateVariables["/nsubimplicit2"].activeChildren.length).eq(0);
    }

    it("implicitProp with same componentType depend on attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="m" simplify><math name="msub">x</math>+x</math>
    $m{name="mimplicit1"}
    $m{name="mimplicit2" createComponentOfType="math"}
    <math name="mimplicit3" copySource="m" />
    $m{name="mnotimplicit1" newNamespace}
    $m{name="mnotimplicit2" newNamespace createComponentOfType="math"}
    <math name="mnotimplicit3" copySource="m" newNamespace />
    $m{name="mnotimplicit4" simplify="false"}
    $m{name="mnotimplicit5" simplify="false" createComponentOfType="math"}
    <math name="mnotimplicit6" copySource="m" simplify="false" />

    $(mnotimplicit2/msub{name="msubimplicit1"})
    $(mnotimplicit3/msub{name="msubimplicit2"})
    <math name="msubimplicit3" copySource="mnotimplicit1/msub" />


    <math name="n" newNamespace><math name="nsub">y</math>+z</math>
    $n{name="nnotimplicit1"}
    <math name="nnotimplicit2" copySource="n" />
    $(nnotimplicit2/nsub{name="nsubimplicit1"})
    <math name="nsubimplicit2" copySource="nnotimplicit1/nsub" />


    `,
        });

        await test_implicit_prop_sampe_component_type_attributes(core);
    });

    it("implicitProp with same componentType depend on attributes, subnames", async () => {
        let core = await createTestCore({
            doenetML: `

    <map name="map">
      <template newNamespace><math name="m" simplify><math name="msub">x</math>+x</math></template>
      <sources><number>1</number></sources>
    </map>

    $(map[1]/m{name="mimplicit1"})
    $(map[1]/m{name="mimplicit2" createComponentOfType="math"})
    <math name="mimplicit3" copySource="map[1]/m" />
    $(map[1]/m{name="mnotimplicit1" newNamespace})
    $(map[1]/m{name="mnotimplicit2" newNamespace createComponentOfType="math"})
    <math name="mnotimplicit3" copySource="map[1]/m" newNamespace />
    $(map[1]/m{name="mnotimplicit4" simplify="false"})
    $(map[1]/m{name="mnotimplicit5" simplify="false" createComponentOfType="math"})
    <math name="mnotimplicit6" copySource="map[1]/m" simplify="false" />

    $(mnotimplicit2/msub{name="msubimplicit1"})
    $(mnotimplicit3/msub{name="msubimplicit2"})
    <math name="msubimplicit3" copySource="mnotimplicit1/msub" />

    <map name="map2">
      <template newNamespace><math name="n" newNamespace><math name="nsub">y</math>+z</math></template>
      <sources><number>1</number></sources>
    </map>

    $(map2[1]/n{name="nnotimplicit1"})
    <math name="nnotimplicit2" copySource="map2[1]/n" />
    $(nnotimplicit2/nsub{name="nsubimplicit1"})
    <math name="nsubimplicit2" copySource="nnotimplicit1/nsub" />


    `,
        });

        await test_implicit_prop_sampe_component_type_attributes(core);
    });

    it("copies of composites ignore implicitProp", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="g">
      <mathinput prefill="x" />
      <mathinput prefill="y" />
    </group>

    <p><collect componentTypes="mathinput" source="g" name="col" /></p>

    <p name="pmacro">$col</p>

    <p name="pcopy">$col</p>

    <p name="pmacro2">$g</p>

    <p name="pcopy2">$g</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let [macromi1Name, macromi2Name] = stateVariables[
            "/pmacro"
        ].activeChildren.map((x) => x.componentIdx);
        let [copymi1Name, copymi2Name] = stateVariables[
            "/pcopy"
        ].activeChildren.map((x) => x.componentIdx);
        let [macromi1Name2, macromi2Name2] = stateVariables[
            "/pmacro2"
        ].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);
        let [copymi1Name2, copymi2Name2] = stateVariables[
            "/pcopy2"
        ].activeChildren
            .filter((x) => x.componentIdx)
            .map((x) => x.componentIdx);

        expect(stateVariables[macromi1Name].componentType).eq("mathInput");
        expect(stateVariables[macromi2Name].componentType).eq("mathInput");
        expect(stateVariables[copymi1Name].componentType).eq("mathInput");
        expect(stateVariables[copymi2Name].componentType).eq("mathInput");
        expect(stateVariables[macromi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[macromi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[copymi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[copymi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[macromi1Name2].componentType).eq("mathInput");
        expect(stateVariables[macromi2Name2].componentType).eq("mathInput");
        expect(stateVariables[copymi1Name2].componentType).eq("mathInput");
        expect(stateVariables[copymi2Name2].componentType).eq("mathInput");
        expect(stateVariables[macromi1Name2].stateValues.value.tree).eq("x");
        expect(stateVariables[macromi2Name2].stateValues.value.tree).eq("y");
        expect(stateVariables[copymi1Name2].stateValues.value.tree).eq("x");
        expect(stateVariables[copymi2Name2].stateValues.value.tree).eq("y");
    });

    it("copies of composites with subnames do not ignore implicitProp", async () => {
        let core = await createTestCore({
            doenetML: `
    <map name="map" assignNames="t1 t2">
      <template newNamespace><mathinput name="mi" prefill="$v" /></template>
      <sources alias="v"><math>x</math><math>y</math></sources>
    </map>

    <p name="pmacro">$map</p>
    <p name="pcopy">$map</p>

    <p name="pmacroInd">$map[1]$map[2]</p>
    <p name="pcopyInd"><copy source="map[1]" /><copy source="map[2]" /></p>

    <p name="pmacroSubname">$(map[1]/mi)$(map[2]/mi)</p>
    <p name="pcopySubname"><copy source="map[1]/mi" /><copy source="map[2]/mi" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let [macromi1Name, macromi2Name] = stateVariables[
            "/pmacro"
        ].activeChildren.map((x) => x.componentIdx);
        let [copymi1Name, copymi2Name] = stateVariables[
            "/pcopy"
        ].activeChildren.map((x) => x.componentIdx);
        let [macroIndmi1Name, macroIndmi2Name] = stateVariables[
            "/pmacroInd"
        ].activeChildren.map((x) => x.componentIdx);
        let [copyIndmi1Name, copyIndmi2Name] = stateVariables[
            "/pmacroInd"
        ].activeChildren.map((x) => x.componentIdx);
        let [macroSubnamem1Name, macroSubnamem2Name] = stateVariables[
            "/pmacroSubname"
        ].activeChildren.map((x) => x.componentIdx);
        let [copySubnamem1Name, copySubnamem2Name] = stateVariables[
            "/pcopySubname"
        ].activeChildren.map((x) => x.componentIdx);

        expect(stateVariables[macromi1Name].componentType).eq("mathInput");
        expect(stateVariables[macromi2Name].componentType).eq("mathInput");
        expect(stateVariables[copymi1Name].componentType).eq("mathInput");
        expect(stateVariables[copymi2Name].componentType).eq("mathInput");
        expect(stateVariables[macroIndmi1Name].componentType).eq("mathInput");
        expect(stateVariables[macroIndmi2Name].componentType).eq("mathInput");
        expect(stateVariables[copyIndmi1Name].componentType).eq("mathInput");
        expect(stateVariables[copyIndmi2Name].componentType).eq("mathInput");
        expect(stateVariables[macroSubnamem1Name].componentType).eq("math");
        expect(stateVariables[macroSubnamem2Name].componentType).eq("math");
        expect(stateVariables[copySubnamem1Name].componentType).eq("math");
        expect(stateVariables[copySubnamem2Name].componentType).eq("math");
        expect(stateVariables[macromi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[macromi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[copymi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[copymi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[macroIndmi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[macroIndmi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[copyIndmi1Name].stateValues.value.tree).eq("x");
        expect(stateVariables[copyIndmi2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[macroSubnamem1Name].stateValues.value.tree).eq(
            "x",
        );
        expect(stateVariables[macroSubnamem2Name].stateValues.value.tree).eq(
            "y",
        );
        expect(stateVariables[copySubnamem1Name].stateValues.value.tree).eq(
            "x",
        );
        expect(stateVariables[copySubnamem2Name].stateValues.value.tree).eq(
            "y",
        );
    });

    it("implicitProp with createComponentOfType", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><mathinput name="mi"/>  <mathinput copySource="mi" name="mi2" />  <math copySource="mi" name="m" /></p>

    <p name="p2">$mi{createComponentOfType='mathinput'}, $mi, $mi{createComponentOfType='math'}</p> 

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let mi3Name = stateVariables["/p2"].activeChildren[0].componentIdx;
        let m2Name = stateVariables["/p2"].activeChildren[2].componentIdx;
        let m3Name = stateVariables["/p2"].activeChildren[4].componentIdx;

        expect(stateVariables[m2Name].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables[m3Name].stateValues.value.tree).eq("\uff3f");

        // mathinputs change with immediate value
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/mi2"].stateValues.rawRendererValue).eq("x");
        expect(stateVariables[mi3Name].stateValues.rawRendererValue).eq("x");
        expect(stateVariables["/m"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables[m2Name].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables[m3Name].stateValues.value.tree).eq("\uff3f");

        // maths change with value
        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/m"].stateValues.value.tree).eq("x");
        expect(stateVariables[m2Name].stateValues.value.tree).eq("x");
        expect(stateVariables[m3Name].stateValues.value.tree).eq("x");

        // mathinputs change with immediate value
        await updateMathInputImmediateValue({
            latex: "y",
            name: "/mi2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/mi"].stateValues.rawRendererValue).eq("y");
        expect(stateVariables[mi3Name].stateValues.rawRendererValue).eq("y");
        expect(stateVariables["/m"].stateValues.value.tree).eq("x");
        expect(stateVariables[m2Name].stateValues.value.tree).eq("x");
        expect(stateVariables[m3Name].stateValues.value.tree).eq("x");

        // maths change with value
        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/m"].stateValues.value.tree).eq("y");
        expect(stateVariables[m2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[m3Name].stateValues.value.tree).eq("y");

        // mathinputs change with immediate value
        await updateMathInputImmediateValue({
            latex: "z",
            name: mi3Name,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/mi"].stateValues.rawRendererValue).eq("z");
        expect(stateVariables["/mi2"].stateValues.rawRendererValue).eq("z");
        expect(stateVariables["/m"].stateValues.value.tree).eq("y");
        expect(stateVariables[m2Name].stateValues.value.tree).eq("y");
        expect(stateVariables[m3Name].stateValues.value.tree).eq("y");

        // maths change with value
        await updateMathInputValueToImmediateValue({
            name: mi3Name,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/m"].stateValues.value.tree).eq("z");
        expect(stateVariables[m2Name].stateValues.value.tree).eq("z");
        expect(stateVariables[m3Name].stateValues.value.tree).eq("z");
    });

    it("asList when copy array prop", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceinput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceinput>

    <p name="default">Default: $ci.choiceTexts</p>
    <p name="nocommas">No commas: $ci.choiceTexts{asList="false"}</p>
    <p name="withcommas">With commas: $ci.choiceTexts{asList="true"}</p>
    <p name="default2" copySource="default" />
    <p name="nocommas2" copySource="nocommas" />
    <p name="withcommas2" copySource="withcommas" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/default"].stateValues.text).eq(
            "Default: yes, no, maybe",
        );
        expect(stateVariables["/nocommas"].stateValues.text).eq(
            "No commas: yesnomaybe",
        );
        expect(stateVariables["/withcommas"].stateValues.text).eq(
            "With commas: yes, no, maybe",
        );
        expect(stateVariables["/default2"].stateValues.text).eq(
            "Default: yes, no, maybe",
        );
        expect(stateVariables["/nocommas2"].stateValues.text).eq(
            "No commas: yesnomaybe",
        );
        expect(stateVariables["/withcommas2"].stateValues.text).eq(
            "With commas: yes, no, maybe",
        );
    });

    it("asList when copy array prop, multiple stacked props", async () => {
        let core = await createTestCore({
            doenetML: `
    <line name="l" through="(1,2) (3,4)" />

    <p name="default">Default: $l.points.x</p>
    <p name="nocommas">No commas: $l.points.x{asList="false"}</p>
    <p name="withcommas">With commas: $l.points.x{asList="true"}</p>
    <p name="default2" copySource="default" />
    <p name="nocommas2" copySource="nocommas" />
    <p name="withcommas2" copySource="withcommas" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/default"].stateValues.text).eq("Default: 1, 3");
        expect(stateVariables["/nocommas"].stateValues.text).eq(
            "No commas: 13",
        );
        expect(stateVariables["/withcommas"].stateValues.text).eq(
            "With commas: 1, 3",
        );
        expect(stateVariables["/default2"].stateValues.text).eq(
            "Default: 1, 3",
        );
        expect(stateVariables["/nocommas2"].stateValues.text).eq(
            "No commas: 13",
        );
        expect(stateVariables["/withcommas2"].stateValues.text).eq(
            "With commas: 1, 3",
        );
    });

    it("asList when copy array prop, aslist overrides", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceinput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceinput>

    
    <p name="p1">Override no commas: <aslist name="nocommas">$ci.choiceTexts{asList="false"}</aslist></p>
    <p name="p2">Copy: <aslist name="nocommas2" copySource="nocommas" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "Override no commas: yes, no, maybe",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Copy: yes, no, maybe",
        );
    });

    it("correctly wrap replacement changes when verifying to force component type", async () => {
        let core = await createTestCore({
            doenetML: `
        <answer name="ans">47</answer>
        <number copySource="ans.submittedResponse" name="num" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const tiName =
            stateVariables["/ans"].stateValues.inputChildren[0].componentIdx;

        expect(stateVariables["/num"].stateValues.value).eqls(NaN);

        await updateMathInputValue({ latex: "4", name: tiName, core });
        await submitAnswer({ name: "/ans", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/num"].stateValues.value).eq(4);

        await updateMathInputValue({
            latex: "47",
            name: tiName,
            core,
        });
        await submitAnswer({ name: "/ans", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/num"].stateValues.value).eq(47);
    });

    it("copy of copy with new namespace, macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <group name="orig"><text name="t">hello</text></group>
    
    <p>copy with new namespace:  $orig{name="cN" newnamespace}</p>
    <p>copy of copy: $cN{name="cNc"}</p>

    <p>copy of copy of copy: $cNc{name="cNcc"}</p>
    <p>copy of copy of copy nn: $cNc{name="cNccN" newNamespace}</p>
    
    <p>piece of copy: $(cN/t{name="cNt"})</p>
    <p>piece of copy of copy: $(cNc/t{name="cNct"})</p>

    <p>piece of copy of copy of copy: $(cNcc/t{name="cNcct"})</p>
    <p>piece of copy of copy of copy nn: $(cNccN/t{name="cNccNt"})</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/orig"].componentType).eq("group");
        expect(stateVariables["/t"].stateValues.value).eq("hello");

        expect(stateVariables["/cN"].componentType).eq("group");
        expect(stateVariables["/cN/t"].stateValues.value).eq("hello");
        expect(stateVariables["/cNt"].stateValues.value).eq("hello");

        expect(stateVariables["/cNc"].componentType).eq("group");
        expect(stateVariables["/cNc/t"].stateValues.value).eq("hello");
        expect(stateVariables["/cNct"].stateValues.value).eq("hello");

        expect(stateVariables["/cNcc"].componentType).eq("group");
        expect(stateVariables["/cNcc/t"].stateValues.value).eq("hello");
        expect(stateVariables["/cNcct"].stateValues.value).eq("hello");

        expect(stateVariables["/cNccN"].componentType).eq("group");
        expect(stateVariables["/cNccN/t"].stateValues.value).eq("hello");
        expect(stateVariables["/cNccNt"].stateValues.value).eq("hello");
    });
});
