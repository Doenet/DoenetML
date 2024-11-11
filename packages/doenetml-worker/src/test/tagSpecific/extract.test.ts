import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    movePoint,
    movePolygon,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Extract tag tests", async () => {
    it("extract copies properties", async () => {
        let core = await createTestCore({
            doenetML: `
    <extract prop="latex" assignNames="e1"><math modifyIndirectly="false">x</math></extract>
    <extract prop="latex" assignNames="e2"><math modifyIndirectly="true">x</math></extract>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(
            false,
        );
        expect(stateVariables["/_math2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/e1"].stateValues.modifyIndirectly).eq(false);
        expect(stateVariables["/e2"].stateValues.modifyIndirectly).eq(true);
    });

    it("extract can overwrite base component properties", async () => {
        let core = await createTestCore({
            doenetML: `
    <extract modifyIndirectly="true" prop="latex" assignNames="e1"><math modifyIndirectly="false">x</math></extract>
    <extract modifyIndirectly="false" prop="latex" assignNames="e2"><math modifyIndirectly="true">x</math></extract>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(
            false,
        );
        expect(stateVariables["/_math2"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/e1"].stateValues.modifyIndirectly).eq(true);
        expect(stateVariables["/e2"].stateValues.modifyIndirectly).eq(false);
    });

    it("extract multiple tags", async () => {
        let core = await createTestCore({
            doenetML: `
    <extract prop="y" assignNames="e1 e2 e3">
      <point>(1,2)</point>
      <point>(3,4)</point>
      <point>(5,6)</point>
    </extract>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/e1"].stateValues.value.tree).eq(2);
        expect(stateVariables["/e2"].stateValues.value.tree).eq(4);
        expect(stateVariables["/e3"].stateValues.value.tree).eq(6);
    });

    it("extract still updatable", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      $original{name="copy"}
      <point name="transformed">
        ($copy2.y,
        <extract prop="x1">$copy{name="copy2"}</extract>)
      </point>
    </graph>

    <graph>
    <point name="original">(1,2)</point>
    </graph>
    `,
        });

        // initial position
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/original"].stateValues.xs[0].tree).eq(1);
        expect(stateVariables["/original"].stateValues.xs[1].tree).eq(2);
        expect(stateVariables["/copy"].stateValues.xs[0].tree).eq(1);
        expect(stateVariables["/copy"].stateValues.xs[1].tree).eq(2);
        expect(stateVariables["/transformed"].stateValues.xs[0].tree).eq(2);
        expect(stateVariables["/transformed"].stateValues.xs[1].tree).eq(1);

        // move original point
        await movePoint({ name: "/original", x: -3, y: 5, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/original"].stateValues.xs[0].tree).eq(-3);
        expect(stateVariables["/original"].stateValues.xs[1].tree).eq(5);
        expect(stateVariables["/copy"].stateValues.xs[0].tree).eq(-3);
        expect(stateVariables["/copy"].stateValues.xs[1].tree).eq(5);
        expect(stateVariables["/transformed"].stateValues.xs[0].tree).eq(5);
        expect(stateVariables["/transformed"].stateValues.xs[1].tree).eq(-3);

        // move copy point
        await movePoint({ name: "/copy", x: 6, y: -9, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/original"].stateValues.xs[0].tree).eq(6);
        expect(stateVariables["/original"].stateValues.xs[1].tree).eq(-9);
        expect(stateVariables["/copy"].stateValues.xs[0].tree).eq(6);
        expect(stateVariables["/copy"].stateValues.xs[1].tree).eq(-9);
        expect(stateVariables["/transformed"].stateValues.xs[0].tree).eq(-9);
        expect(stateVariables["/transformed"].stateValues.xs[1].tree).eq(6);

        // move transformed point
        await movePoint({ name: "/transformed", x: -1, y: -7, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/original"].stateValues.xs[0].tree).eq(-7);
        expect(stateVariables["/original"].stateValues.xs[1].tree).eq(-1);
        expect(stateVariables["/copy"].stateValues.xs[0].tree).eq(-7);
        expect(stateVariables["/copy"].stateValues.xs[1].tree).eq(-1);
        expect(stateVariables["/transformed"].stateValues.xs[0].tree).eq(-1);
        expect(stateVariables["/transformed"].stateValues.xs[1].tree).eq(-7);
    });

    it("copy prop of extract", async () => {
        let core = await createTestCore({
            doenetML: `
    <extract prop="center" name="extract1">
    <circle through="$_point1 $_point2" />
    </extract>
    
    $extract1.x{assignNames="x1"},
    $extract1.y{assignNames="y1"}
    
    <graph>
    <point>(1,2)</point>
    <point>(5,6)</point>
    $extract1{assignNames="copiedextract"}
    </graph>

    $copiedextract.x{assignNames="x2"},
    $copiedextract.y{assignNames="y2"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x1"].stateValues.value.tree).eq(3);
        expect(stateVariables["/y1"].stateValues.value.tree).eq(4);
        expect(stateVariables["/x2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/y2"].stateValues.value.tree).eq(4);

        // move extracted center

        await movePoint({ name: "/copiedextract", x: -2, y: -5, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x1"].stateValues.value.tree).closeTo(-2, 1e-12);
        expect(stateVariables["/y1"].stateValues.value.tree).closeTo(-5, 1e-12);
        expect(stateVariables["/x2"].stateValues.value.tree).closeTo(-2, 1e-12);
        expect(stateVariables["/y2"].stateValues.value.tree).closeTo(-5, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0].tree).closeTo(
            -4,
            1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1].tree).closeTo(
            -7,
            1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0].tree).closeTo(
            0,
            1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1].tree).closeTo(
            -3,
            1e-12,
        );

        // move points 1 and 2

        await movePoint({ name: "/_point1", x: 8, y: -1, core });
        await movePoint({ name: "/_point2", x: -6, y: -7, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x1"].stateValues.value.tree).closeTo(1, 1e-12);
        expect(stateVariables["/y1"].stateValues.value.tree).closeTo(-4, 1e-12);
        expect(stateVariables["/x2"].stateValues.value.tree).closeTo(1, 1e-12);
        expect(stateVariables["/y2"].stateValues.value.tree).closeTo(-4, 1e-12);
    });

    it("extract from sequence", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n"/>

    <p name="p1"><extract prop="text" name="extract1">
      <sequence length="$n" />
    </extract></p>
    
    <p name="p2">$extract1</p>
    
    `,
        });

        async function check_items(vals) {
            const stateVariables = await returnAllStateVariables(core);
            let componentTypes = Array(vals.length).fill("text");

            expect(
                stateVariables["/p1"].activeChildren.map(
                    (x) => x.componentType,
                ),
            ).eqls(componentTypes);
            expect(
                stateVariables["/p2"].activeChildren.map(
                    (x) => x.componentType,
                ),
            ).eqls(componentTypes);
            expect(
                stateVariables["/p1"].activeChildren.map(
                    (x) => stateVariables[x.componentName].stateValues.value,
                ),
            ).eqls(vals);
            expect(
                stateVariables["/p2"].activeChildren.map(
                    (x) => stateVariables[x.componentName].stateValues.value,
                ),
            ).eqls(vals);
        }

        await check_items([]);

        // set to 3
        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items(["1", "2", "3"]);

        // increase to 4
        await updateMathInputValue({ latex: "4", name: "/n", core });
        await check_items(["1", "2", "3", "4"]);

        // decrease to 2
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items(["1", "2"]);

        // increase to 5
        await updateMathInputValue({ latex: "5", name: "/n", core });
        await check_items(["1", "2", "3", "4", "5"]);
    });

    it("extract from map", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <mathInput name="m" />
    
    <p name="p1"><extract prop="x" name="extract1">
      <map>
        <template newNamespace><point>($a+<copy prop="value" target="../m" />,0)</point></template>
        <sources alias="a">
          <sequence length="$n" />
        </sources>
      </map>
    </extract></p>
    
    <p name="p2">$extract1</p>
    
    `,
        });

        async function check_items(vals) {
            const stateVariables = await returnAllStateVariables(core);
            let componentTypes = Array(vals.length).fill("math");

            expect(
                stateVariables["/p1"].activeChildren.map(
                    (x) => x.componentType,
                ),
            ).eqls(componentTypes);
            expect(
                stateVariables["/p2"].activeChildren.map(
                    (x) => x.componentType,
                ),
            ).eqls(componentTypes);
            expect(
                stateVariables["/p1"].activeChildren.map(
                    (x) =>
                        stateVariables[x.componentName].stateValues.value.tree,
                ),
            ).eqls(vals);
            expect(
                stateVariables["/p2"].activeChildren.map(
                    (x) =>
                        stateVariables[x.componentName].stateValues.value.tree,
                ),
            ).eqls(vals);
        }

        await check_items([]);

        // set n to 3
        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items([
            ["+", 1, "＿"],
            ["+", 2, "＿"],
            ["+", 3, "＿"],
        ]);

        // set m to 7
        await updateMathInputValue({ latex: "7", name: "/m", core });
        await check_items([8, 9, 10]);

        // increase n to 4
        await updateMathInputValue({ latex: "4", name: "/n", core });
        await check_items([8, 9, 10, 11]);

        // change m to q
        await updateMathInputValue({ latex: "q", name: "/m", core });
        await check_items([
            ["+", "q", 1],
            ["+", "q", 2],
            ["+", "q", 3],
            ["+", "q", 4],
        ]);

        // decrease n to 2
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items([
            ["+", "q", 1],
            ["+", "q", 2],
        ]);

        // set m to -1
        await updateMathInputValue({ latex: "-1", name: "/m", core });
        await check_items([0, 1]);

        // increase n to 5
        await updateMathInputValue({ latex: "5", name: "/n", core });
        await check_items([0, 1, 2, 3, 4]);
    });

    // not sure if this is desired, but it is current behavior
    it("extract ignores hide", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">See hidden text: <extract prop="value"><text name="hidden" hide>secret</text></extract></p>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "See hidden text: secret",
        );
    });

    it("extracts hide dynamically", async () => {
        let core = await createTestCore({
            doenetML: `

    <booleanInput name='h1' prefill="false" >
      <label>Hide first extract</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second extract</label>
    </booleanInput>

    <p name="e1">extract 1: <extract hide="$h1" prop="value" ><text>hello</text></extract></p>
    <p name="e2">extract 2: <extract hide="$h2" prop="value" ><text>hello</text></extract></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/e1"].stateValues.text).eq("extract 1: hello");
        expect(stateVariables["/e2"].stateValues.text).eq("extract 2: ");

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

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/e1"].stateValues.text).eq("extract 1: ");
        expect(stateVariables["/e2"].stateValues.text).eq("extract 2: hello");

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

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/e1"].stateValues.text).eq("extract 1: hello");
        expect(stateVariables["/e2"].stateValues.text).eq("extract 2: ");
    });

    it("extract componentIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <asList name="al"><extract prop="x" componentIndex="$n" assignNames="Ax Bx">
      <collect name="col" componentTypes="point" target="g1" />
    </extract></asList>

    <copy target="al" name="al2" newNamespace />

    `,
        });

        async function check_items({
            x1,
            y1,
            x2,
            y2,
            Ax,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            Ax?: number;
        }) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                [x1, y1],
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                [x2, y2],
            );
            if (Ax === undefined) {
                expect(stateVariables["/Ax"]).eq(undefined);
                expect(stateVariables["/al2/Ax"]).eq(undefined);
            } else {
                expect(stateVariables["/Ax"].stateValues.value.tree).eq(Ax);
                expect(stateVariables["/al2/Ax"].stateValues.value.tree).eq(Ax);
            }
            expect(stateVariables["/Bx"]).eq(undefined);
            expect(stateVariables["/al2/Bx"]).eq(undefined);
        }

        let x1 = 1,
            y1 = 2,
            x2 = 3,
            y2 = 4;

        await check_items({ x1, x2, y1, y2 });

        // restrict collection to first component
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items({ x1, x2, y1, y2, Ax: x1 });

        // move point
        x1 = 9;
        y1 = -5;
        await movePoint({ name: "/A", x: x1, y: y1, core });
        await check_items({ x1, x2, y1, y2, Ax: x1 });

        // restrict collection to second component

        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items({ x1, x2, y1, y2, Ax: x2 });

        x2 = 0;
        y2 = 8;
        await movePoint({ name: "/B", x: x2, y: y2, core });
        await check_items({ x1, x2, y1, y2, Ax: x2 });
    });

    it("copy propIndex and componentIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>m: <mathInput name="m" /></p>
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    
    <p><asList name="al"><extract prop="xs" componentIndex="$m" propIndex="$n" assignNames="n1 n2 n3 n4">
      <collect name="col" componentTypes="point" target="g1" assignNames="A1 B1" />
    </extract></asList></p>

    <p><copy target="al" name="al2" newNamespace /></p>

    `,
        });

        async function check_items({
            x1,
            y1,
            x2,
            y2,
            n1,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            n1?: number;
        }) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                [x1, y1],
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                [x2, y2],
            );
            if (n1 === undefined) {
                expect(stateVariables["/n1"]).eq(undefined);
                expect(stateVariables["/al2/n1"]).eq(undefined);
            } else {
                expect(stateVariables["/n1"].stateValues.value.tree).eq(n1);
                expect(stateVariables["/al2/n1"].stateValues.value.tree).eq(n1);
            }
            expect(stateVariables["/n2"]).eq(undefined);
            expect(stateVariables["/n3"]).eq(undefined);
            expect(stateVariables["/n4"]).eq(undefined);
            expect(stateVariables["/al2/n2"]).eq(undefined);
            expect(stateVariables["/al2/n3"]).eq(undefined);
            expect(stateVariables["/al2/n4"]).eq(undefined);
        }

        let x1 = 1,
            y1 = 2,
            x2 = 3,
            y2 = 4;

        await check_items({ x1, x2, y1, y2 });

        // set propIndex to 1

        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items({ x1, x2, y1, y2 });

        // move point 1
        x1 = 9;
        y1 = -5;
        await movePoint({ name: "/A", x: x1, y: y1, core });
        await check_items({ x1, x2, y1, y2 });

        // set componentIndex to 2
        await updateMathInputValue({ latex: "2", name: "/m", core });
        await check_items({ x1, x2, y1, y2, n1: x2 });

        // move point2
        x2 = 0;
        y2 = 8;
        await movePoint({ name: "/B", x: x2, y: y2, core });
        await check_items({ x1, x2, y1, y2, n1: x2 });

        // set propIndex to 2
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items({ x1, x2, y1, y2, n1: y2 });

        // set componentIndex to 1
        await updateMathInputValue({ latex: "1", name: "/m", core });
        await check_items({ x1, x2, y1, y2, n1: y1 });

        // set propIndex to 3
        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items({ x1, x2, y1, y2 });

        // set propIndex to 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items({ x1, x2, y1, y2, n1: x1 });

        // set componentIndex to 3
        await updateMathInputValue({ latex: "3", name: "/m", core });
        await check_items({ x1, x2, y1, y2 });

        // set componentIndex to 2
        await updateMathInputValue({ latex: "2", name: "/m", core });
        await check_items({ x1, x2, y1, y2, n1: x2 });

        // clear propIndex
        await updateMathInputValue({ latex: "", name: "/n", core });
        await check_items({ x1, x2, y1, y2 });
    });

    it("copy multidimensional propIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>m: <mathInput name="m" /></p>
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <polygon vertices="(1,2) (3,4) (-5,6)" name="pg" />
    </graph>

    
    <p name="p1"><extract prop="vertices" propIndex="$m $n" assignNames="n1 n2">
      $pg
    </extract></p>

    <p copySource="p1" name="p2" newNamespace />

    `,
        });

        async function check_items({
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
            n1,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            x3: number;
            y3: number;
            n1?: number;
        }) {
            let stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/pg"].stateValues.vertices.map((x) =>
                    x.map((y) => y.tree),
                ),
            ).eqls([
                [x1, y1],
                [x2, y2],
                [x3, y3],
            ]);
            if (n1 === undefined) {
                expect(stateVariables["/n1"]).eq(undefined);
                expect(stateVariables["/p2/n1"]).eq(undefined);
            } else {
                expect(stateVariables["/n1"].stateValues.value.tree).eq(n1);
                expect(stateVariables["/p2/n1"].stateValues.value.tree).eq(n1);
            }
            expect(stateVariables["/n2"]).eq(undefined);
            expect(stateVariables["/p2/n2"]).eq(undefined);
        }

        let x1 = 1,
            y1 = 2,
            x2 = 3,
            y2 = 4,
            x3 = -5,
            y3 = 6;

        await check_items({ x1, y1, x2, y2, x3, y3 });

        // set second propIndex to 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items({ x1, y1, x2, y2, x3, y3 });

        // move first point
        x1 = 9;
        y1 = -5;
        await movePolygon({ name: "/pg", pointCoords: { 0: [x1, y1] }, core });
        await check_items({ x1, y1, x2, y2, x3, y3 });

        // set first propIndex to 2
        await updateMathInputValue({ latex: "2", name: "/m", core });
        await check_items({ x1, y1, x2, y2, x3, y3, n1: x2 });

        // move second point
        x2 = 0;
        y2 = 8;
        await movePolygon({ name: "/pg", pointCoords: { 1: [x2, y2] }, core });
        await check_items({ x1, y1, x2, y2, x3, y3, n1: x2 });

        // set second propIndex to 2
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items({ x1, y1, x2, y2, x3, y3, n1: y2 });

        // set first propIndex to 1
        await updateMathInputValue({ latex: "1", name: "/m", core });
        await check_items({ x1, y1, x2, y2, x3, y3, n1: y1 });

        // set second propIndex to 3
        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items({ x1, y1, x2, y2, x3, y3 });

        // set second propIndex to 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items({ x1, y1, x2, y2, x3, y3, n1: x1 });

        // set first propindex to 4
        await updateMathInputValue({ latex: "4", name: "/m", core });
        await check_items({ x1, y1, x2, y2, x3, y3 });

        // set first propIndex to 3
        await updateMathInputValue({ latex: "3", name: "/m", core });
        await check_items({ x1, y1, x2, y2, x3, y3, n1: x3 });

        // clear second propIndex
        await updateMathInputValue({ latex: "", name: "/n", core });
        await check_items({ x1, y1, x2, y2, x3, y3 });
    });

    it("extract is case insensitive", async () => {
        let core = await createTestCore({
            doenetML: `
    <extract prop="LaTeX" assignNames="e1"><math>x</math></extract>
    <extract prop="LATEX" assignNames="e2"><math>y</math></extract>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/e1"].stateValues.value).eq("x");
        expect(stateVariables["/e2"].stateValues.value).eq("y");
    });

    it("createComponentOfType adapts result", async () => {
        let core = await createTestCore({
            doenetML: `
    <extract prop="x" assignNames="e1"><vector>(1/2,2/3)</vector></extract>
    <extract prop="x" assignNames="e2" createComponentOfType="number"><vector>(3/4,4/5)</vector></extract>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/e1"].stateValues.value.tree).eqls(["/", 1, 2]);
        expect(stateVariables["/e2"].stateValues.value).eq(0.75);
    });

    it("fail gracefully if omit prop", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p">Nothing here: <extract><math>x</math></extract></p>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Nothing here: ");

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid extract.  Must have a prop",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(31);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(63);
    });
});
