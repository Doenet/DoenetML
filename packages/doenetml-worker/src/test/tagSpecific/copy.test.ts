import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

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

        let stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
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
        let stateVariables = await returnAllStateVariables(core);
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
            let stateVariables = await returnAllStateVariables(core);
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
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/p1",
            args: { x, y },
            event: null,
        });
        await check_items(x, y);

        // move point 2
        x = 6;
        y = -9;
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/p2",
            args: { x, y },
            event: null,
        });
        await check_items(x, y);

        // move point 3
        x = -7;
        y = -2;
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/p3",
            args: { x: y, y: x },
            event: null,
        });
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

        let stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "moveVector",
            componentName: "/vector1",
            args: {
                tailcoords: v_tail,
                headcoords: v_head,
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "moveVector",
            componentName: "/d1",
            args: {
                tailcoords: d_tail,
                headcoords: d_head,
            },
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "moveVector",
            componentName: "/d2",
            args: {
                tailcoords: d_tail,
                headcoords: d_head,
            },
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "moveVector",
            componentName: "/vector1",
            args: {
                tailcoords: v_tail,
                headcoords: v_head,
            },
        });

        stateVariables = await returnAllStateVariables(core);
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
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/p1"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p2"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p3"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p4"].stateValues.text.trim()).eq(list);
            expect(stateVariables["/p5"].stateValues.text.trim()).eq(list);
        }

        await check_items("");

        await updateMathInputValue({ latex: "2", componentName: "/mi", core });
        await check_items("a, b");

        await updateMathInputValue({ latex: "5", componentName: "/mi", core });
        await check_items("a, b, c, d, e");

        await updateMathInputValue({ latex: "1", componentName: "/mi", core });
        await check_items("a");

        await updateMathInputValue({ latex: "6", componentName: "/mi", core });
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
            let stateVariables = await returnAllStateVariables(core);
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
        await updateMathInputValue({ latex: "9", componentName: "/a", core });
        await updateMathInputValue({ latex: "6", componentName: "/b", core });
        await updateMathInputValue({ latex: "7", componentName: "/c", core });
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

        let stateVariables = await returnAllStateVariables(core);
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
        const stateVariables = await returnAllStateVariables(core);
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
        const stateVariables = await returnAllStateVariables(core);
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
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/c1"].stateValues.text).eq("copy 1: hello");
        expect(stateVariables["/c2"].stateValues.text).eq("copy 2: ");

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/h2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/c1"].stateValues.text).eq("copy 1: ");
        expect(stateVariables["/c2"].stateValues.text).eq("copy 2: hello");

        await updateBooleanInputValue({
            boolean: false,
            componentName: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/h2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

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
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/forVerb"].stateValues.text).eq("jump");
        expect(stateVariables["/verb2"].stateValues.text).eq("jump");

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/b",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/forVerb"].stateValues.text).eq("skip");
        expect(stateVariables["/verb2"].stateValues.text).eq("skip");

        await updateBooleanInputValue({
            boolean: false,
            componentName: "/b",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/forVerb"].stateValues.text).eq("jump");
        expect(stateVariables["/verb2"].stateValues.text).eq("jump");

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/b",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
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
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/m"].stateValues.value.tree).eqls(m);
            expect(stateVariables["/m2"].stateValues.value.tree).eqls(m2);
            expect(stateVariables["/m3"].stateValues.value.tree).eqls(m3);
        }

        let stateVariables = await returnAllStateVariables(core);
        let copy1Name = stateVariables["/m2"].replacementOf;
        let copy2Name = stateVariables["/m3"].replacementOf;
        expect(stateVariables[copy1Name].stateValues.link).eq(false);
        expect(stateVariables[copy2Name].stateValues.link).eq(true);

        await check_maths(["*", 2, "x"], ["+", "x", "x"], ["+", "x", "x"]);

        // simplify copies
        await updateTextInputValue({
            text: "full",
            componentName: "/s2",
            core,
        });
        await check_maths(["*", 2, "x"], ["*", 2, "x"], ["*", 2, "x"]);

        // stop simplifying original
        await updateTextInputValue({
            text: "none",
            componentName: "/s1",
            core,
        });
        await check_maths(["+", "x", "x"], ["*", 2, "x"], ["*", 2, "x"]);

        // double original
        await core.requestAction({
            componentName: "/doubleOriginal",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await check_maths(
            ["*", 2, ["+", "x", "x"]],
            ["*", 2, "x"],
            ["*", 4, "x"],
        );

        // double copy1
        await core.requestAction({
            componentName: "/doubleCopy1",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await check_maths(
            ["*", 2, ["+", "x", "x"]],
            ["*", 4, "x"],
            ["*", 4, "x"],
        );

        // double copy2
        await core.requestAction({
            componentName: "/doubleCopy2",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await check_maths(["*", 2, 4, "x"], ["*", 4, "x"], ["*", 8, "x"]);

        // stop simplifying copies
        await updateTextInputValue({
            text: "none",
            componentName: "/s2",
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
            const stateVariables = await returnAllStateVariables(core);

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

        let stateVariables = await returnAllStateVariables(core);

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
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/A",
            args: { x: A[0], y: A[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move B
        B = [-2, 6];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/B",
            args: { x: B[0], y: B[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move l
        A = [-7, -6];
        B = [8, 0];

        await core.requestAction({
            actionName: "moveLine",
            componentName: "/l",
            args: {
                point1coords: A,
                point2coords: B,
            },
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A2
        A2 = [5, 4];
        core.requestAction({
            actionName: "movePoint",
            componentName: "/A2",
            args: { x: A2[0], y: A2[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move l2
        l2A = [-5, 9];
        l2B = [-4, -1];
        await core.requestAction({
            actionName: "moveLine",
            componentName: "/l2",
            args: {
                point1coords: l2A,
                point2coords: l2B,
            },
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A3
        A3 = [6, -3];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/A3",
            args: { x: A3[0], y: A3[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A4
        A4 = [-2, 7];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/A4",
            args: { x: A4[0], y: A4[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move B4
        B4 = [-9, -8];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/B4",
            args: { x: B4[0], y: B4[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move A5
        gA = [-10, -9];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/gnolink/A",
            args: { x: gA[0], y: gA[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move B5
        gB = [-8, -7];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/gnolink/B",
            args: { x: gB[0], y: gB[1] },
            event: null,
        });
        await check_items({ A, B, A2, l2A, l2B, A3, A4, B4, gA, gB, Ax });

        // move l3
        gA = [6, 5];
        gB = [4, -3];
        await core.requestAction({
            actionName: "moveLine",
            componentName: "/gnolink/l",
            args: {
                point1coords: gA,
                point2coords: gB,
            },
            event: null,
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

        const stateVariables = await returnAllStateVariables(core);
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

        const stateVariables = await returnAllStateVariables(core);
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

        const stateVariables = await returnAllStateVariables(core);
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

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq("hello hello");
        expect(stateVariables["/p2"].stateValues.text).eq("hello hello");
    });

    async function test_copy_group_copies_no_link(core) {
        const stateVariables = await returnAllStateVariables(core);

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

            const stateVariables = await returnAllStateVariables(core);

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
            componentName: "/sim",
            core,
        });

        await check_items(simplify1, simplify2, simplify3);

        // change second simplify
        simplify2 = "none";
        await updateTextInputValue({
            text: simplify1,
            componentName: "/g2/sim",
            core,
        });
        await check_items(simplify1, simplify2, simplify3);

        // change third simplify
        simplify3 = "none";
        await updateTextInputValue({
            text: simplify1,
            componentName: "/g3/sim",
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
        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/text1"].stateValues.text).eq("a");
    });

    async function test_no_link_outside_component_from_attribute(core) {
        async function check_items(text1: string, text2: string) {
            const stateVariables = await returnAllStateVariables(core);
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
            componentName: "/external",
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
            const stateVariables = await returnAllStateVariables(core);
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
            componentName: "/g/ti",
            core,
        });
        await updateTextInputValue({
            text: "two",
            componentName: "/g2/ti",
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
        const stateVariables = await returnAllStateVariables(core);
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
            const stateVariables = await returnAllStateVariables(core);
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

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/section1"].stateValues.title).eq("Section 1");
        expect(stateVariables["/section2"].stateValues.title).eq("Section 2");
        expect(stateVariables["/section3"].stateValues.title).eq("Section 3");
        expect(stateVariables["/section4"].stateValues.title).eq("Section 4");
        expect(stateVariables["/section5"].stateValues.title).eq("Section 5");
        expect(stateVariables["/section6"].stateValues.title).eq("Section 6");
        expect(stateVariables["/section7"].stateValues.title).eq("Section 7");

        await check_items(2, 2, 2, 2);

        await core.requestAction({
            componentName: "/section1/addP",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await check_items(3, 2, 2, 2);

        await core.requestAction({
            componentName: "/section7/removeP",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await check_items(2, 2, 2, 2);

        await core.requestAction({
            componentName: "/section4/addP",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        await check_items(2, 2, 2, 3);

        await core.requestAction({
            componentName: "/section4/removeP",
            actionName: "updateValue",
            args: {},
            event: null,
        });
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
            const stateVariables = await returnAllStateVariables(core);

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

        await updateMathInputValue({ latex: "1", componentName: "/n", core });
        await check_items([1, 2], [3, 4], [5, 6]);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/A",
            args: { x: 9, y: 0 },
            event: null,
        });
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/B",
            args: { x: 1, y: 8 },
            event: null,
        });
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/C",
            args: { x: 7, y: 2 },
            event: null,
        });

        await check_items([9, 0], [1, 8], [7, 2]);

        await updateMathInputValue({ latex: "2", componentName: "/n", core });

        await check_items([9, 0], [1, 8], [7, 2], [2, 3], [4, 5], [6, 7]);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/D",
            args: { x: 0, y: 10 },
            event: null,
        });
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/E",
            args: { x: 9, y: 1 },
            event: null,
        });
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/F",
            args: { x: 2, y: 8 },
            event: null,
        });

        await check_items([9, 0], [1, 8], [7, 2], [0, 10], [9, 1], [2, 8]);

        await updateMathInputValue({ latex: "0", componentName: "/n", core });
        await check_items();

        await updateMathInputValue({ latex: "2", componentName: "/n", core });

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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq("x");
        expect(stateVariables["/xval"].stateValues.value.tree).eq("x");
        expect(stateVariables["/xvalnl"].stateValues.value.tree).eq("x");

        await updateMathInputValue({ latex: "y", componentName: "/mi1", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq("y");
        expect(stateVariables["/xval"].stateValues.value.tree).eq("y");
        expect(stateVariables["/xvalnl"].stateValues.value.tree).eq("x");

        await updateMathInputValue({ latex: "z", componentName: "/mi2", core });

        stateVariables = await returnAllStateVariables(core);
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
            const stateVariables = await returnAllStateVariables(core);
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
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/v1",
            args: { x: v1[0], y: v1[1] },
            event: null,
        });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v1nl
        v1nl = [3, 4];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/v1nl",
            args: { x: v1nl[0], y: v1nl[1] },
            event: null,
        });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v2nl
        v2nl = [4, 5];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/v2nl",
            args: { x: v2nl[0], y: v2nl[1] },
            event: null,
        });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v3nl
        v3nl = [5, 6];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/v3nl",
            args: { x: v3nl[0], y: v3nl[1] },
            event: null,
        });
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
            const stateVariables = await returnAllStateVariables(core);
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

        await updateMathInputValue({ latex: "1", componentName: "/n", core });

        await check_items(`(${A1.join(",")})`, "");

        // Move point
        A1 = [-3, 7];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/t1/A",
            args: { x: A1[0], y: A1[1] },
            event: null,
        });

        await check_items(`(${A1.join(",")})`, "");

        // Remove point
        await updateMathInputValue({ latex: "0", componentName: "/n", core });
        await check_items("", "");

        // Remember coordinates when restore point since copy was maintained
        await updateMathInputValue({ latex: "1", componentName: "/n", core });

        await check_items(`(${A1.join(",")})`, "");

        // Add second point
        await updateMathInputValue({ latex: "2", componentName: "/n", core });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);

        // Move second point
        A2 = [5, -4];
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/t2/A",
            args: { x: A2[0], y: A2[1] },
            event: null,
        });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);

        // Remove both points
        await updateMathInputValue({ latex: "0", componentName: "/n", core });
        await check_items("", "");

        // Remember coordinates of both points
        await updateMathInputValue({ latex: "2", componentName: "/n", core });
        await check_items(`(${A1.join(",")})`, `(${A2.join(",")})`);
    });

    it("trim whitespace off source, with copySource", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="hi">Hello</text>
    <p name="p1"><text copySource=" hi  " /> there</p>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/hi"].stateValues.text).eq("Hello");
        expect(stateVariables["/p1"].stateValues.text).eq("Hello there");
    });

    async function test_copy_group_with_numbers(core, name_prefix = "") {
        let stateVariables = await returnAllStateVariables(core);

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
                (x) => x.componentName,
            ),
        ).eqls(["/p2"]);
        expect(
            stateVariables["/s1a"].activeChildren.map((x) => x.componentType),
        ).eqls(["p"]);
        expect(
            stateVariables["/s1b"].activeChildren.map((x) => x.componentName),
        ).eqls(["/s1b/p2"]);

        let c2p = stateVariables["/_document1"].activeChildren[5].componentName;
        let c4p = stateVariables["/_document1"].activeChildren[9].componentName;
        let c6p =
            stateVariables["/_document1"].activeChildren[13].componentName;
        let c7s =
            stateVariables["/_document1"].activeChildren[15].componentName;
        let c9s =
            stateVariables["/_document1"].activeChildren[19].componentName;

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
            .filter((x) => x.componentName)
            .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
            .filter((x) => x.componentName)
            .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
            .filter((x) => x.componentName)
            .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
            (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
            .filter((x) => x.componentName)
            .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
            (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
            .filter((x) => x.componentName)
            .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
            (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
            .filter((x) => x.componentName)
            .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
            (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
            .filter((x) => x.componentName)
            .map((x) => x.componentName);

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

    it("copy with newNamespace and name retains original names, even with group, wrapped in nested groups and copied with variable componentIndex", async () => {
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
            let stateVariables = await returnAllStateVariables(core);

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
                    (x) => x.componentName,
                ),
            ).eqls([`${name_prefix}/p2`]);
            expect(
                stateVariables[`${name_prefix}/s1b`].activeChildren.map(
                    (x) => x.componentName,
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
        await updateMathInputValue({ latex: "2", componentName: "/n", core });

        await test_group("/thegrp", 4, 5, 6);

        // Change to invalid index for thegrp
        await updateMathInputValue({ latex: "3", componentName: "/n", core });

        let stateVariable = await returnAllStateVariables(core);

        expect(stateVariable["/thegrp"]).eq(undefined);

        // Change back to index 1 for thegrp
        await updateMathInputValue({ latex: "1", componentName: "/n", core });

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

        const stateVariables = await returnAllStateVariables(core);

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

        let errorWarnings = core.errorWarnings;

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

        let errorWarnings = core.errorWarnings;

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

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).eq(
            "Duplicate component name: P.",
        );
    });

    async function test_copy_component_index(core: any, force_values: boolean) {
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
            let stateVariables = await returnAllStateVariables(core);

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

        await updateMathInputValue({ latex: "1", componentName: "/n", core });

        await check_items({ x1, y1, x2, y2, comp: 1 });

        // move copied point
        x1 = 9;
        y1 = -5;
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/A2",
            args: { x: x1, y: y1 },
            event: null,
        });

        await check_items({ x1, y1, x2, y2, comp: 1 });

        // restrict collection to second component

        await updateMathInputValue({ latex: "2", componentName: "/n", core });

        await check_items({ x1, y1, x2, y2, comp: 2 });

        // move double copied point
        x2 = 0;
        y2 = 8;
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/g3/A2",
            args: { x: x2, y: y2 },
            event: null,
        });

        await check_items({ x1, y1, x2, y2, comp: 2 });
    }

    it("copy componentIndex, array notation, macros", async () => {
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

    it("copy componentIndex, with copySource, array notation", async () => {
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
        core: any,
        force_values: boolean,
    ) {
        async function check_items({
            x1,
            y1,
            x2,
            y2,
            propIndex,
            componentIndex,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            propIndex?: number;
            componentIndex?: number;
        }) {
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                [x1, y1],
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                [x2, y2],
            );

            if (
                (propIndex === 1 || propIndex === 2) &&
                (componentIndex === 1 || componentIndex === 2)
            ) {
                let x: number;
                if (propIndex === 1) {
                    if (componentIndex === 1) {
                        x = x1;
                    } else {
                        x = x2;
                    }
                } else {
                    if (componentIndex === 1) {
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

        let componentIndex: undefined | number;
        let propIndex: undefined | number;

        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set propIndex to 1
        propIndex = 1;
        await updateMathInputValue({
            latex: "1",
            componentName: "/n",
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // move point 1
        x1 = 9;
        y1 = -5;
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/A",
            args: { x: x1, y: y1 },
            event: null,
        });

        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set componentIndex to 2
        componentIndex = 2;
        await updateMathInputValue({
            latex: "2",
            componentName: "/m",
            core,
        });

        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // move point2
        x2 = 0;
        y2 = 8;
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/B",
            args: { x: x2, y: y2 },
            event: null,
        });

        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set propIndex to 2
        propIndex = 2;
        await updateMathInputValue({
            latex: "2",
            componentName: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set componentIndex to 1
        componentIndex = 1;
        await updateMathInputValue({
            latex: "1",
            componentName: "/m",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set propIndex to 3
        propIndex = 3;
        await updateMathInputValue({
            latex: "3",
            componentName: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set propIndex to 1
        propIndex = 1;
        await updateMathInputValue({
            latex: "1",
            componentName: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set componentIndex to 3
        componentIndex = 3;
        await updateMathInputValue({
            latex: "3",
            componentName: "/m",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set componentIndex to 2
        componentIndex = 2;
        await updateMathInputValue({
            latex: "2",
            componentName: "/m",
            core,
        });

        // clear propIndex
        propIndex = undefined;
        await updateMathInputValue({
            latex: "",
            componentName: "/n",
            core,
        });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });
    }

    it("copy propIndex and componentIndex, array notation, macros", async () => {
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

    it("copy propIndex and componentIndex, with copySource, array notation", async () => {
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
});
