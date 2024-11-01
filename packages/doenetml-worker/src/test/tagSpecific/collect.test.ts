import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    movePoint,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("Collect tag tests", async () => {
    it("collect points from graphs", async () => {
        let core = await createTestCore({
            doenetML: `
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,5)</point>
    </graph>

    <graph>
      $_point1{name="p1a"}
      <point>(4,2)</point>
      <point>
        (<copy prop="y" source="_point2" />,
        <copy prop="x" source="_point2" />)
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" name="points" source="_panel1" assignNames="q1 q2 q3 q4 q5" />
    </graph>

    <p>Coordinates of points: <collect componentTypes="point" prop="coords" name="coords" source="_panel1" assignNames="c1 c2 c3 c4 c5" /></p>
    <p><m>x</m>-coordinates of points: <aslist><collect componentTypes="point" prop="x" name="xs" source="_graph3" assignNames="x1 x2 x3 x4 x5" /></aslist></p>
    <p><m>x</m>-coordinates of points via a copy: <aslist><copy name="xs2" source="xs" assignNames="xc1 xc2 xc3 xc4 xc5" /></aslist></p>
    <p><m>x</m>-coordinates of points via extract: <aslist><extract prop="x" name="xs3" assignNames="xe1 xe2 xe3 xe4 xe5" ><copy name="points2" source="points" assignNames="qa1 qa2 qa3 qa4 qa5" /></extract></aslist></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean"><collect componentTypes="point" prop="y" name="ys" source="_graph3" assignNames="y1 y2 y3 y4 y5" /></mean></p>
    `,
        });

        let x1 = -3,
            y1 = 1;
        let x2 = -7,
            y2 = 5;
        let x3 = 4,
            y3 = 2;

        let coords1Text = ("(" + x1 + "," + y1 + ")").replace(/-/g, "−");
        let coords2Text = ("(" + x2 + "," + y2 + ")").replace(/-/g, "−");
        let coords3Text = ("(" + x3 + "," + y3 + ")").replace(/-/g, "−");
        let coords2tText = ("(" + y2 + "," + x2 + ")").replace(/-/g, "−");

        let meany = (y1 + y2 + y1 + y3 + x2) / 5;

        let xs = [x1, x2, x1, x3, y2];
        let ys = [y1, y2, y1, y3, x2];
        let stateVariables = await returnAllStateVariables(core);
        for (let i = 0; i < 5; i++) {
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/c${i + 1}`].stateValues.value.tree).eqls([
                "vector",
                xs[i],
                ys[i],
            ]);
            expect(stateVariables[`/x${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xc${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xe${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                ys[i],
            );
        }
        expect(stateVariables["/mean"].stateValues.value.tree).eq(meany);

        // move point 1
        x1 = -8;
        y1 = 6;
        xs = [x1, x2, x1, x3, y2];
        ys = [y1, y2, y1, y3, x2];
        meany = (y1 + y2 + y1 + y3 + x2) / 5;

        await movePoint({ name: "/_point1", x: x1, y: y1, core });

        stateVariables = await returnAllStateVariables(core);

        for (let i = 0; i < 5; i++) {
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/c${i + 1}`].stateValues.value.tree).eqls([
                "vector",
                xs[i],
                ys[i],
            ]);
            expect(stateVariables[`/x${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xc${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xe${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                ys[i],
            );
        }
        expect(stateVariables["/mean"].stateValues.value.tree).eq(meany);

        // move point 1 via copy
        x1 = 2;
        y1 = 0;
        xs = [x1, x2, x1, x3, y2];
        ys = [y1, y2, y1, y3, x2];
        meany = (y1 + y2 + y1 + y3 + x2) / 5;

        await movePoint({ name: "/p1a", x: x1, y: y1, core });

        stateVariables = await returnAllStateVariables(core);
        for (let i = 0; i < 5; i++) {
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/c${i + 1}`].stateValues.value.tree).eqls([
                "vector",
                xs[i],
                ys[i],
            ]);
            expect(stateVariables[`/x${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xc${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xe${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                ys[i],
            );
        }
        expect(stateVariables["/mean"].stateValues.value.tree).eq(meany);

        // move point 2
        x2 = 4;
        y2 = 8;
        xs = [x1, x2, x1, x3, y2];
        ys = [y1, y2, y1, y3, x2];
        meany = (y1 + y2 + y1 + y3 + x2) / 5;

        await movePoint({ name: "/_point2", x: x2, y: y2, core });

        stateVariables = await returnAllStateVariables(core);

        for (let i = 0; i < 5; i++) {
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/c${i + 1}`].stateValues.value.tree).eqls([
                "vector",
                xs[i],
                ys[i],
            ]);
            expect(stateVariables[`/x${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xc${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xe${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                ys[i],
            );
        }
        expect(stateVariables["/mean"].stateValues.value.tree).eq(meany);

        // move flipped point 2
        x2 = -1;
        y2 = -3;
        xs = [x1, x2, x1, x3, y2];
        ys = [y1, y2, y1, y3, x2];
        meany = (y1 + y2 + y1 + y3 + x2) / 5;

        await movePoint({ name: "/_point4", x: y2, y: x2, core });

        stateVariables = await returnAllStateVariables(core);

        for (let i = 0; i < 5; i++) {
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/c${i + 1}`].stateValues.value.tree).eqls([
                "vector",
                xs[i],
                ys[i],
            ]);
            expect(stateVariables[`/x${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xc${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xe${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                ys[i],
            );
        }
        expect(stateVariables["/mean"].stateValues.value.tree).eq(meany);

        // move point 3
        x3 = -5;
        y3 = 9;
        xs = [x1, x2, x1, x3, y2];
        ys = [y1, y2, y1, y3, x2];
        meany = (y1 + y2 + y1 + y3 + x2) / 5;

        await movePoint({ name: "/_point3", x: x3, y: y3, core });

        stateVariables = await returnAllStateVariables(core);

        for (let i = 0; i < 5; i++) {
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/c${i + 1}`].stateValues.value.tree).eqls([
                "vector",
                xs[i],
                ys[i],
            ]);
            expect(stateVariables[`/x${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xc${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xe${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                ys[i],
            );
        }
        expect(stateVariables["/mean"].stateValues.value.tree).eq(meany);
    });

    it("collect dynamic points from graphs", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="length" prefill="3"/>
    <mathInput name="mult" prefill="2"/>
    <panel>
    <graph>
      <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6)">
        <template><point>($x, <copy prop="value" source="mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map assignNames="(q1) (q2) (q3) (q4) (q5) (q6)">
        <template><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
        <sources alias="p"><collect componentTypes="point" source="_map1" assignNames="pa1 pa2 pa3 pa4 pa5 pa6" /></sources>
      </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" source="_panel1" assignNames="r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12" />
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" source="_graph3" assignNames="y1 y2 y3 y4 y5 y6 y7 y8 y9 y10 y11 y12" />
    </aslist></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(3);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(3);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(3);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(6);

        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/r${i + 4}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 4}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                2 * x,
            );
            expect(stateVariables[`/y${i + 4}`].stateValues.value.tree).eq(
                3 * x,
            );
        }

        // increase number of points
        await updateMathInputValue({
            latex: "5",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(5);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                2 * x,
            );
            expect(stateVariables[`/y${i + 6}`].stateValues.value.tree).eq(
                3 * x,
            );
        }

        // change multiple
        await updateMathInputValue({
            latex: "0.5",
            name: "/mult",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(5);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 6}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // decrease number of points
        await updateMathInputValue({
            latex: "1",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(1);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(1);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(1);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 1; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 2}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 2}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 2}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // increase number of points back to 4
        await updateMathInputValue({
            latex: "4",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(4);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(4);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(4);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(8);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 5}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // increase number of points to 6
        await updateMathInputValue({
            latex: "6",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(6);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(6);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(12);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(12);

        for (let i = 0; i < 6; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 7}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 7}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 7}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }
    });

    it("collect dynamic points from groups", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="length" prefill="3"/>
    <mathInput name="mult" prefill="2"/>
    <section>
    <group>
      <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6)">
        <template><point>($x, <copy prop="value" source="mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </group>

    <group>
      <map assignNames="(q1) (q2) (q3) (q4) (q5) (q6)">
        <template><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
        <sources alias="p"><collect componentTypes="point" source="_map1" assignNames="pa1 pa2 pa3 pa4 pa5 pa6" /></sources>
      </map>

    </group>
    </section>

    <group>
      <collect componentTypes="point" source="_section1" assignNames="r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12" />
    </group>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" source="_group3" assignNames="y1 y2 y3 y4 y5 y6 y7 y8 y9 y10 y11 y12" />
    </aslist></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(3);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(3);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(3);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(6);

        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/r${i + 4}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 4}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                2 * x,
            );
            expect(stateVariables[`/y${i + 4}`].stateValues.value.tree).eq(
                3 * x,
            );
        }

        // increase number of points
        await updateMathInputValue({
            latex: "5",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(5);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                2 * x,
            );
            expect(stateVariables[`/y${i + 6}`].stateValues.value.tree).eq(
                3 * x,
            );
        }

        // change multiple
        await updateMathInputValue({
            latex: "0.5",
            name: "/mult",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(5);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 6}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // decrease number of points
        await updateMathInputValue({
            latex: "1",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(1);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(1);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(1);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 1; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 2}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 2}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 2}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // increase number of points back to 4
        await updateMathInputValue({
            latex: "4",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(4);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(4);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(4);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(8);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 5}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // increase number of points to 6
        await updateMathInputValue({
            latex: "6",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(6);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(6);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(12);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(12);

        for (let i = 0; i < 6; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 7}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 7}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 7}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }
    });

    it("collect points and vectors from graphs", async () => {
        let core = await createTestCore({
            doenetML: `
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,4)</point>
      <vector tail="$_point1" head="$_point2" />
    </graph>

    <graph>
      <point>
        (<copy prop="y" source="_point1" />,
        <copy prop="x" source="_point1" />)
      </point>
      <point>
        (<copy prop="y" source="_point2" />,
        <copy prop="x" source="_point2" />)
      </point>
      <vector tail="$_point3" head="$_point4" />
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point vector" source="_panel1" assignNames="v1 v2 v3 v4 v5 v6" />
    </graph>

    $_vector1.head.map(x=>x.tree){assignNames="h1"}
    $_vector2.head.map(x=>x.tree){assignNames="h2"}
    `,
        });

        let x1 = -3,
            y1 = 1;
        let x2 = -7,
            y2 = 4;

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);
        expect(stateVariables["/_point2"].stateValues.coords.tree).eqls([
            "vector",
            x2,
            y2,
        ]);
        expect(
            stateVariables["/_vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls([x1, y1]);
        expect(
            stateVariables["/_vector1"].stateValues.head.map((x) => x.tree),
        ).eqls([x2, y2]);
        expect(stateVariables["/_point3"].stateValues.coords.tree).eqls([
            "vector",
            y1,
            x1,
        ]);
        expect(stateVariables["/_point4"].stateValues.coords.tree).eqls([
            "vector",
            y2,
            x2,
        ]);
        expect(
            stateVariables["/_vector2"].stateValues.tail.map((x) => x.tree),
        ).eqls([y1, x1]);
        expect(
            stateVariables["/_vector2"].stateValues.head.map((x) => x.tree),
        ).eqls([y2, x2]);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(stateVariables["/v1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);
        expect(stateVariables["/v2"].stateValues.coords.tree).eqls([
            "vector",
            x2,
            y2,
        ]);
        expect(stateVariables["/v3"].stateValues.tail.map((x) => x.tree)).eqls([
            x1,
            y1,
        ]);
        expect(stateVariables["/v3"].stateValues.head.map((x) => x.tree)).eqls([
            x2,
            y2,
        ]);
        expect(stateVariables["/v4"].stateValues.coords.tree).eqls([
            "vector",
            y1,
            x1,
        ]);
        expect(stateVariables["/v5"].stateValues.coords.tree).eqls([
            "vector",
            y2,
            x2,
        ]);
        expect(stateVariables["/v6"].stateValues.tail.map((x) => x.tree)).eqls([
            y1,
            x1,
        ]);
        expect(stateVariables["/v6"].stateValues.head.map((x) => x.tree)).eqls([
            y2,
            x2,
        ]);

        // move vector 1 via copy
        x1 = -8;
        y1 = 6;
        x2 = 3;
        y2 = 2;

        await moveVector({
            name: "/v3",
            tailcoords: [x1, y1],
            headcoords: [x2, y2],
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);
        expect(stateVariables["/_point2"].stateValues.coords.tree).eqls([
            "vector",
            x2,
            y2,
        ]);
        expect(
            stateVariables["/_vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls([x1, y1]);
        expect(
            stateVariables["/_vector1"].stateValues.head.map((x) => x.tree),
        ).eqls([x2, y2]);
        expect(stateVariables["/_point3"].stateValues.coords.tree).eqls([
            "vector",
            y1,
            x1,
        ]);
        expect(stateVariables["/_point4"].stateValues.coords.tree).eqls([
            "vector",
            y2,
            x2,
        ]);
        expect(
            stateVariables["/_vector2"].stateValues.tail.map((x) => x.tree),
        ).eqls([y1, x1]);
        expect(
            stateVariables["/_vector2"].stateValues.head.map((x) => x.tree),
        ).eqls([y2, x2]);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(stateVariables["/v1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);
        expect(stateVariables["/v2"].stateValues.coords.tree).eqls([
            "vector",
            x2,
            y2,
        ]);
        expect(stateVariables["/v3"].stateValues.tail.map((x) => x.tree)).eqls([
            x1,
            y1,
        ]);
        expect(stateVariables["/v3"].stateValues.head.map((x) => x.tree)).eqls([
            x2,
            y2,
        ]);
        expect(stateVariables["/v4"].stateValues.coords.tree).eqls([
            "vector",
            y1,
            x1,
        ]);
        expect(stateVariables["/v5"].stateValues.coords.tree).eqls([
            "vector",
            y2,
            x2,
        ]);
        expect(stateVariables["/v6"].stateValues.tail.map((x) => x.tree)).eqls([
            y1,
            x1,
        ]);
        expect(stateVariables["/v6"].stateValues.head.map((x) => x.tree)).eqls([
            y2,
            x2,
        ]);

        // move vector 2 via copy
        x1 = 9;
        y1 = 0;
        x2 = -7;
        y2 = 5;

        await moveVector({
            name: "/v6",
            tailcoords: [y1, x1],
            headcoords: [y2, x2],
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);
        expect(stateVariables["/_point2"].stateValues.coords.tree).eqls([
            "vector",
            x2,
            y2,
        ]);
        expect(
            stateVariables["/_vector1"].stateValues.tail.map((x) => x.tree),
        ).eqls([x1, y1]);
        expect(
            stateVariables["/_vector1"].stateValues.head.map((x) => x.tree),
        ).eqls([x2, y2]);
        expect(stateVariables["/_point3"].stateValues.coords.tree).eqls([
            "vector",
            y1,
            x1,
        ]);
        expect(stateVariables["/_point4"].stateValues.coords.tree).eqls([
            "vector",
            y2,
            x2,
        ]);
        expect(
            stateVariables["/_vector2"].stateValues.tail.map((x) => x.tree),
        ).eqls([y1, x1]);
        expect(
            stateVariables["/_vector2"].stateValues.head.map((x) => x.tree),
        ).eqls([y2, x2]);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(stateVariables["/v1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);
        expect(stateVariables["/v2"].stateValues.coords.tree).eqls([
            "vector",
            x2,
            y2,
        ]);
        expect(stateVariables["/v3"].stateValues.tail.map((x) => x.tree)).eqls([
            x1,
            y1,
        ]);
        expect(stateVariables["/v3"].stateValues.head.map((x) => x.tree)).eqls([
            x2,
            y2,
        ]);
        expect(stateVariables["/v4"].stateValues.coords.tree).eqls([
            "vector",
            y1,
            x1,
        ]);
        expect(stateVariables["/v5"].stateValues.coords.tree).eqls([
            "vector",
            y2,
            x2,
        ]);
        expect(stateVariables["/v6"].stateValues.tail.map((x) => x.tree)).eqls([
            y1,
            x1,
        ]);
        expect(stateVariables["/v6"].stateValues.head.map((x) => x.tree)).eqls([
            y2,
            x2,
        ]);
    });

    it("maximum number", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="length" prefill="5"/>
    <mathInput name="mult" prefill="2"/>
    <mathInput name="maxnumber" prefill="2"/>
    <panel>
    <graph>
      <map assignNames="(p1) (p2) (p3) (p4) (p5)">
        <template><point>($x, <copy prop="value" source="../mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map assignNames="(q1) (q2) (q3) (q4) (q5)">
      <template><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
      <sources alias="p"><collect componentTypes="point" source="_map1" maxNumber="$maxnumber" assignNames="pa1 pa2 pa3 pa4 pa5" /></sources>
    </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" source="_panel1" maxNumber="2$maxnumber" assignNames="r1 r2 r3 r4 r5 r6 r7 r8 r9 r10" />
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" source="_graph3" maxNumber="$maxnumber" assignNames="y1 y2 y3 y4 y5 y6 y7 y8 y9 y10" />
    </aslist></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(2);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(2);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
        }
        for (let i = 0; i < 2; i++) {
            let x = i + 1;
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
        }
        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
        }
        for (let i = 0; i < 2; i++) {
            let x = i + 1;
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                2 * x,
            );
        }

        // increase maxnumber
        await updateMathInputValue({
            latex: "5",
            name: "/maxnumber",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(5);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(5);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                2 * x,
            );
            //expect(stateVariables[`/y${i + 6}`].stateValues.value.tree).eq(3 * x);
        }

        // increase maxnumber further
        await updateMathInputValue({
            latex: "10",
            name: "/maxnumber",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(5);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                2 * x,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[1].tree).eq(
                3 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                2 * x,
            );
            expect(stateVariables[`/y${i + 6}`].stateValues.value.tree).eq(
                3 * x,
            );
        }

        // change multiple
        await updateMathInputValue({
            latex: "0.5",
            name: "/mult",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(5);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(5);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 6}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 6}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // decrease number of points
        await updateMathInputValue({
            latex: "1",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(1);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(1);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(1);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 1; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 2}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 2}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 2}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // increase number of points back to 4
        await updateMathInputValue({
            latex: "4",
            name: "/length",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(4);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(4);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(4);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(8);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/y${i + 5}`].stateValues.value.tree).eq(
                0.75 * x,
            );
        }

        // decrease max number to 3
        await updateMathInputValue({
            latex: "3",
            name: "/maxnumber",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_map1"].stateValues.numIterates[0]).eq(4);
        expect(
            stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(3);
        expect(stateVariables["/_map2"].stateValues.numIterates[0]).eq(3);
        expect(
            stateVariables["/_collect2"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables["/_collect3"].stateValues.collectedComponents.length,
        ).eq(3);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/p${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
        }
        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
        }
        for (let i = 0; i < 4; i++) {
            let x = i + 1;

            expect(stateVariables[`/r${i + 1}`].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[`/r${i + 1}`].stateValues.xs[1].tree).eq(
                0.5 * x,
            );
        }
        for (let i = 0; i < 2; i++) {
            let x = i + 1;
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[0].tree).eq(
                x + 1,
            );
            expect(stateVariables[`/r${i + 5}`].stateValues.xs[1].tree).eq(
                0.75 * x,
            );
        }
        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                0.5 * x,
            );
        }
    });

    it("collect, extract, copy multiple ways", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>How many blanks? 
    <mathInput name="n" prefill="1" />
  </p>
 
  <p name="p_original">Enter expressions:
    <map asList="false" assignNames="(mi1) (mi2) (mi3) (mi4) (mi5)">
      <template>
        <mathInput />
      </template>
      <sources>
        <sequence length="$n" />
      </sources>
    </map>
  </p>
  
  <p name="p_1">Inputs collected then, values extracted: 
  <aslist name="al1"><extract prop="value" name="values1"><collect componentTypes="mathInput" source="p_original"/></extract></aslist></p>

  <p name="p_1a">Copied: <aslist name="al1a"><copy name="values1a" source="values1" /></aslist></p>
  <p name="p_1b">Copy aslist: <copy name="al1b" source="al1" /></p>
  <p name="p_1c">Copy copied: <aslist>$values1a</aslist></p>
  <p name="p_1d">Copy aslist containing copy: $al1a</p>
  <p name="p_1e">Copy copied aslist: $al1b</p>

  <p name="p_2">Values collected: 
    <aslist name="al2"><collect prop="value" name="values2" componentTypes="mathInput" source="p_original"/></aslist></p>
    
  <p name="p_2a">Copied: <aslist name="al2a"><copy name="values2a" source="values2" /></aslist></p>
  <p name="p_2b">Copy aslist: <copy name="al2b" source="al2" /></p>
  <p name="p_2c">Copy copied: <aslist>$values2a</aslist></p>
  <p name="p_2d">Copy aslist containing copy: $al2a</p>
  <p name="p_2e">Copy copied aslist: $al2b</p>

    <p name="p_3">
    Inputs collected:
    <aslist name="al3">
        <collect
        name="col"
        componentTypes="mathInput"
        source="p_original"
        assignNames="micol1 micol2 micol3 micol4 micol5"
        />
    </aslist>
    </p>

    <p name="p_3a">
    Copied:
    <aslist name="al3a">
        <copy name="cola" source="col" assignNames="mia1 mia2 mia3 mia4 mia5" />
    </aslist>
    </p>
    <p name="p_3b">Copy aslist: <copy name="al3b" source="al3" newNamespace /></p>
    <p name="p_3c">
    Copy copied: <aslist>$cola{assignNames="mic1 mic2 mic3 mic4 mic5"}</aslist>
    </p>
    <p name="p_3d">Copy aslist containing copy: $al3a{name="al3d" newNamespace}</p>
    <p name="p_3e">Copy copied aslist: $al3b{name="al3e"}</p>
  
    `,
        });

        async function set_and_check_items(values, mis_used = "orig") {
            await updateMathInputValue({
                latex: `${values.length}`,
                name: "/n",
                core,
            });

            for (let [ind, val] of values.entries()) {
                let mi_name;
                if (mis_used === "orig") {
                    mi_name = `/mi${ind + 1}`;
                } else if ((mis_used = "col")) {
                    mi_name = `/micol${ind + 1}`;
                } else if ((mis_used = "a")) {
                    mi_name = `/mia${ind + 1}`;
                } else if ((mis_used = "b")) {
                    mi_name = `/al3b/micol${ind + 1}`;
                } else if ((mis_used = "c")) {
                    mi_name = `/mic${ind + 1}`;
                } else if ((mis_used = "d")) {
                    mi_name = `/al3d/mia${ind + 1}`;
                } else if ((mis_used = "e")) {
                    mi_name = `/al3e/micol${ind + 1}`;
                }

                await updateMathInputValue({
                    latex: val,
                    name: mi_name,
                    core,
                });
            }

            const stateVariables = await returnAllStateVariables(core);

            const listText = values.join(", ");

            expect(stateVariables["/p_1"].stateValues.text).eq(
                `Inputs collected then, values extracted: \n  ${listText}`,
            );
            expect(stateVariables["/p_1a"].stateValues.text).eq(
                `Copied: ${listText}`,
            );
            expect(stateVariables["/p_1b"].stateValues.text).eq(
                `Copy aslist: ${listText}`,
            );
            expect(stateVariables["/p_1c"].stateValues.text).eq(
                `Copy copied: ${listText}`,
            );
            expect(stateVariables["/p_1d"].stateValues.text).eq(
                `Copy aslist containing copy: ${listText}`,
            );
            expect(stateVariables["/p_1e"].stateValues.text).eq(
                `Copy copied aslist: ${listText}`,
            );

            expect(stateVariables["/p_2"].stateValues.text).eq(
                `Values collected: \n    ${listText}`,
            );
            expect(stateVariables["/p_2a"].stateValues.text).eq(
                `Copied: ${listText}`,
            );
            expect(stateVariables["/p_2b"].stateValues.text).eq(
                `Copy aslist: ${listText}`,
            );
            expect(stateVariables["/p_2c"].stateValues.text).eq(
                `Copy copied: ${listText}`,
            );
            expect(stateVariables["/p_2d"].stateValues.text).eq(
                `Copy aslist containing copy: ${listText}`,
            );
            expect(stateVariables["/p_2e"].stateValues.text).eq(
                `Copy copied aslist: ${listText}`,
            );

            for (let [ind, val] of values.entries()) {
                expect(
                    stateVariables[`/micol${ind + 1}`].stateValues
                        .immediateValue.tree,
                ).eq(val);
                expect(
                    stateVariables[`/mia${ind + 1}`].stateValues.immediateValue
                        .tree,
                ).eq(val);
                expect(
                    stateVariables[`/al3b/micol${ind + 1}`].stateValues
                        .immediateValue.tree,
                ).eq(val);
                expect(
                    stateVariables[`/mic${ind + 1}`].stateValues.immediateValue
                        .tree,
                ).eq(val);
                expect(
                    stateVariables[`/al3d/mia${ind + 1}`].stateValues
                        .immediateValue.tree,
                ).eq(val);
                expect(
                    stateVariables[`/al3e/micol${ind + 1}`].stateValues
                        .immediateValue.tree,
                ).eq(val);
            }
        }

        await set_and_check_items(["x"]);

        await set_and_check_items(["x1", "y", "z", "u", "v"], "a");

        await set_and_check_items([]);

        await set_and_check_items(["x2", "y2"], "b");

        await set_and_check_items(["a", "b"], "c");

        await set_and_check_items(["e", "f", "g", "h", "i"], "d");

        await set_and_check_items(["j", "k", "l"], "e");
    });

    // main point: no longer turn inputs into their value
    // even with copy a collection with a macro
    it("test macros by collecting inputs and others", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="sec">
    <group>
      <mathInput name="a" prefill="x" />
      <textInput name="b" prefill="hello" />
      <booleanInput name="c" />
      <math>2$a</math>
      <text>$b there</text>
      <boolean>not $c</boolean>
    </group>

    <p name="pcollect1"><collect source="_group1" componentTypes="_input math text boolean" /></p>
    <p name="pcollect2">$_collect1</p>
    <p name="pgroup2">$_group1</p>
    <p name="pcollect3">$_collect1</p>
    <p name="pgroup3">$_group1</p>
    </sec>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let group1Replacements = stateVariables["/sec"].activeChildren.slice(
            1,
            14,
        );

        let collect1Replacements = stateVariables["/pcollect1"].activeChildren;
        let collect2Replacements = stateVariables["/pcollect2"].activeChildren;
        let group2Replacements = stateVariables["/pgroup2"].activeChildren;
        let collect3Replacements = stateVariables["/pcollect3"].activeChildren;
        let group3Replacements = stateVariables["/pgroup3"].activeChildren;

        expect(group1Replacements.length).eq(13);
        expect(collect1Replacements.length).eq(6);
        expect(collect2Replacements.length).eq(6);
        expect(group2Replacements.length).eq(13);
        expect(collect3Replacements.length).eq(6);
        expect(group3Replacements.length).eq(13);

        expect(group1Replacements[1].componentType).eq("mathInput");
        expect(
            stateVariables[group1Replacements[1].componentName].stateValues
                .value.tree,
        ).eq("x");
        expect(collect1Replacements[0].componentType).eq("mathInput");
        expect(
            stateVariables[collect1Replacements[0].componentName].stateValues
                .value.tree,
        ).eq("x");
        expect(collect2Replacements[0].componentType).eq("mathInput");
        expect(
            stateVariables[collect2Replacements[0].componentName].stateValues
                .value.tree,
        ).eq("x");
        expect(group2Replacements[1].componentType).eq("mathInput");
        expect(
            stateVariables[group2Replacements[1].componentName].stateValues
                .value.tree,
        ).eq("x");
        expect(collect3Replacements[0].componentType).eq("mathInput");
        expect(
            stateVariables[collect3Replacements[0].componentName].stateValues
                .value.tree,
        ).eq("x");
        expect(group3Replacements[1].componentType).eq("mathInput");
        expect(
            stateVariables[group3Replacements[1].componentName].stateValues
                .value.tree,
        ).eq("x");

        expect(group1Replacements[3].componentType).eq("textInput");
        expect(
            stateVariables[group1Replacements[3].componentName].stateValues
                .value,
        ).eq("hello");
        expect(collect1Replacements[1].componentType).eq("textInput");
        expect(
            stateVariables[collect1Replacements[1].componentName].stateValues
                .value,
        ).eq("hello");
        expect(collect2Replacements[1].componentType).eq("textInput");
        expect(
            stateVariables[collect2Replacements[1].componentName].stateValues
                .value,
        ).eq("hello");
        expect(group2Replacements[3].componentType).eq("textInput");
        expect(
            stateVariables[group2Replacements[3].componentName].stateValues
                .value,
        ).eq("hello");
        expect(collect3Replacements[1].componentType).eq("textInput");
        expect(
            stateVariables[collect3Replacements[1].componentName].stateValues
                .value,
        ).eq("hello");
        expect(group3Replacements[3].componentType).eq("textInput");
        expect(
            stateVariables[group3Replacements[3].componentName].stateValues
                .value,
        ).eq("hello");

        expect(group1Replacements[5].componentType).eq("booleanInput");
        expect(
            stateVariables[group1Replacements[5].componentName].stateValues
                .value,
        ).eq(false);
        expect(collect1Replacements[2].componentType).eq("booleanInput");
        expect(
            stateVariables[collect1Replacements[2].componentName].stateValues
                .value,
        ).eq(false);
        expect(collect2Replacements[2].componentType).eq("booleanInput");
        expect(
            stateVariables[collect2Replacements[2].componentName].stateValues
                .value,
        ).eq(false);
        expect(group2Replacements[5].componentType).eq("booleanInput");
        expect(
            stateVariables[group2Replacements[5].componentName].stateValues
                .value,
        ).eq(false);
        expect(collect3Replacements[2].componentType).eq("booleanInput");
        expect(
            stateVariables[collect3Replacements[2].componentName].stateValues
                .value,
        ).eq(false);
        expect(group3Replacements[5].componentType).eq("booleanInput");
        expect(
            stateVariables[group3Replacements[5].componentName].stateValues
                .value,
        ).eq(false);

        expect(group1Replacements[7].componentType).eq("math");
        expect(
            stateVariables[group1Replacements[7].componentName].stateValues
                .value.tree,
        ).eqls(["*", 2, "x"]);
        expect(collect1Replacements[3].componentType).eq("math");
        expect(
            stateVariables[collect1Replacements[3].componentName].stateValues
                .value.tree,
        ).eqls(["*", 2, "x"]);
        expect(collect2Replacements[3].componentType).eq("math");
        expect(
            stateVariables[collect2Replacements[3].componentName].stateValues
                .value.tree,
        ).eqls(["*", 2, "x"]);
        expect(group2Replacements[7].componentType).eq("math");
        expect(
            stateVariables[group2Replacements[7].componentName].stateValues
                .value.tree,
        ).eqls(["*", 2, "x"]);
        expect(collect3Replacements[3].componentType).eq("math");
        expect(
            stateVariables[collect3Replacements[3].componentName].stateValues
                .value.tree,
        ).eqls(["*", 2, "x"]);
        expect(group3Replacements[7].componentType).eq("math");
        expect(
            stateVariables[group3Replacements[7].componentName].stateValues
                .value.tree,
        ).eqls(["*", 2, "x"]);

        expect(group1Replacements[9].componentType).eq("text");
        expect(
            stateVariables[group1Replacements[9].componentName].stateValues
                .value,
        ).eq("hello there");
        expect(collect1Replacements[4].componentType).eq("text");
        expect(
            stateVariables[collect1Replacements[4].componentName].stateValues
                .value,
        ).eq("hello there");
        expect(collect2Replacements[4].componentType).eq("text");
        expect(
            stateVariables[collect2Replacements[4].componentName].stateValues
                .value,
        ).eq("hello there");
        expect(group2Replacements[9].componentType).eq("text");
        expect(
            stateVariables[group2Replacements[9].componentName].stateValues
                .value,
        ).eq("hello there");
        expect(collect3Replacements[4].componentType).eq("text");
        expect(
            stateVariables[collect3Replacements[4].componentName].stateValues
                .value,
        ).eq("hello there");
        expect(group3Replacements[9].componentType).eq("text");
        expect(
            stateVariables[group3Replacements[9].componentName].stateValues
                .value,
        ).eq("hello there");

        expect(group1Replacements[11].componentType).eq("boolean");
        expect(
            stateVariables[group1Replacements[11].componentName].stateValues
                .value,
        ).eq(true);
        expect(collect1Replacements[5].componentType).eq("boolean");
        expect(
            stateVariables[collect1Replacements[5].componentName].stateValues
                .value,
        ).eq(true);
        expect(collect2Replacements[5].componentType).eq("boolean");
        expect(
            stateVariables[collect2Replacements[5].componentName].stateValues
                .value,
        ).eq(true);
        expect(group2Replacements[11].componentType).eq("boolean");
        expect(
            stateVariables[group2Replacements[11].componentName].stateValues
                .value,
        ).eq(true);
        expect(collect3Replacements[5].componentType).eq("boolean");
        expect(
            stateVariables[collect3Replacements[5].componentName].stateValues
                .value,
        ).eq(true);
        expect(group3Replacements[11].componentType).eq("boolean");
        expect(
            stateVariables[group3Replacements[11].componentName].stateValues
                .value,
        ).eq(true);
    });

    it("collect does not ignore hide", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">
      <text hide>secret</text>
      <text>public</text>
    </p>
    <p name="p2">Hidden by default: <collect componentTypes="text" source="p1" /></p>
    <p name="p3">Force to reveal: <collect componentTypes="text" source="p1" hide="false" /></p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).contain("public");
        expect(stateVariables["/p1"].stateValues.text).not.contain("secret");

        expect(stateVariables["/p2"].stateValues.text).contain(
            "Hidden by default: public",
        );
        expect(stateVariables["/p3"].stateValues.text).contain(
            "Force to reveal: secret, public",
        );
    });

    it("collect keeps hidden children hidden", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="sec">
      <p name="theP1" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
      $theP1{name="theP2"}
      <p hide name="theP3" newNamespace>Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      $theP3{name="theP4"}
    </section>
    <collect componentTypes="p" source="sec" assignNames="cp1 cp2 cp3 cp4" />
    <collect componentTypes="p" source="sec" hide="false" assignNames="cp5 cp6 cp7 cp8" />
    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/theP1"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/theP2"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/theP3"].stateValues.hidden).eq(true);
        expect(stateVariables["/theP4"].stateValues.hidden).eq(true);
        expect(stateVariables["/cp1"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp2"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp3"].stateValues.hidden).eq(true);
        expect(stateVariables["/cp4"].stateValues.hidden).eq(true);
        expect(stateVariables["/cp5"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp6"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp7"].stateValues.text).eq(
            "Hidden paragraph with hidden text: ",
        );
        expect(stateVariables["/cp8"].stateValues.text).eq(
            "Hidden paragraph with hidden text: ",
        );
    });

    it("collecting from within a hidden section", async () => {
        let core = await createTestCore({
            doenetML: `
    <section hide name="sec">
      <p name="theP1" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
      $theP1{name="theP2"}
      <p hide name="theP3" newNamespace>Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      $theP3{name="theP4"}
    </section>
    <collect componentTypes="p" source="sec" assignNames="cp1 cp2 cp3 cp4" />
    <collect componentTypes="p" source="sec" hide="false" assignNames="cp5 cp6 cp7 cp8" />
    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/theP1"].stateValues.hidden).eq(true);
        expect(stateVariables["/theP2"].stateValues.hidden).eq(true);
        expect(stateVariables["/theP3"].stateValues.hidden).eq(true);
        expect(stateVariables["/theP4"].stateValues.hidden).eq(true);
        expect(stateVariables["/cp1"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp2"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp3"].stateValues.hidden).eq(true);
        expect(stateVariables["/cp4"].stateValues.hidden).eq(true);
        expect(stateVariables["/cp5"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp6"].stateValues.text).eq("Hidden text: ");
        expect(stateVariables["/cp7"].stateValues.text).eq(
            "Hidden paragraph with hidden text: ",
        );
        expect(stateVariables["/cp8"].stateValues.text).eq(
            "Hidden paragraph with hidden text: ",
        );
    });

    it("copies hide dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
      <map>
        <template><text>Hello, $l! </text></template>
        <sources alias="l"><sequence type="letters" from="a" length="$n" /></sources>
      </map>
    </p>

    <booleanInput name='h1' prefill="false" >
      <label>Hide first collect</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second collect</label>
    </booleanInput>
    <p>Number of points <mathInput name="n" prefill="4" /></p>

    <p name="c1">collect 1: <collect hide="$h1" componentTypes="text" source="_p1" asList="false" /></p>
    <p name="c2">collect 2: <collect hide="$h2" componentTypes="text" prop="value" source="_p1" asList="false" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/c1"].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! ",
        );
        expect(stateVariables["/c2"].stateValues.text).eq("collect 2: ");

        await updateMathInputValue({ latex: "6", name: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/c1"].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ",
        );
        expect(stateVariables["/c2"].stateValues.text).eq("collect 2: ");

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

        expect(stateVariables["/c1"].stateValues.text).eq("collect 1: ");
        expect(stateVariables["/c2"].stateValues.text).eq(
            "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ",
        );

        await updateMathInputValue({ latex: "8", name: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/c1"].stateValues.text).eq("collect 1: ");
        expect(stateVariables["/c2"].stateValues.text).eq(
            "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ",
        );

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

        expect(stateVariables["/c1"].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ",
        );
        expect(stateVariables["/c2"].stateValues.text).eq("collect 2: ");

        await updateMathInputValue({ latex: "3", name: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/c1"].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! ",
        );
        expect(stateVariables["/c2"].stateValues.text).eq("collect 2: ");

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

        expect(stateVariables["/c1"].stateValues.text).eq("collect 1: ");
        expect(stateVariables["/c2"].stateValues.text).eq(
            "collect 2: Hello, a! Hello, b! Hello, c! ",
        );

        await updateMathInputValue({ latex: "4", name: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/c1"].stateValues.text).eq("collect 1: ");
        expect(stateVariables["/c2"].stateValues.text).eq(
            "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! ",
        );
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p">We an <text>apple</text>, a <text>banana</text>, and a <text>cherry</text>.</p> 

    <p name="pdefault"><collect componentTypes="text" source="p" /></p>
    <p name="pnolist"><collect componentTypes="text" source="p" aslist="false"/></p>

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pdefault"].stateValues.text).eq(
            "apple, banana, cherry",
        );
        expect(stateVariables["/pnolist"].stateValues.text).eq(
            "applebananacherry",
        );
    });

    it("collect warnings", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" />
    <collect source="nothing" />
    <collect source="g" componentTypes="abc" />
    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            "Cannot collect components of type <abc> as it is an invalid component type",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(47);

        expect(errorWarnings.warnings[1].message).contain(
            "No source found for collect",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(32);
    });

    it("allChildrenOrdered consistent with dynamic collect and adapters", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="2" name='n' />

    <p name="p1">
      begin
      <point name="A">(1,2)</point>
      <map name="map1">
        <template><point>($x, $i)</point></template>
        <sources alias="x" indexAlias="i"><sequence length="$n" /></sources>
      </map>
      <point name="B">(3,4)</point>
      end
    </p>
    
    <p name="p2">Hello <collect componentTypes="point" source="_p1" name="collect1" /> there</p>
    `,
        });

        async function checkAllChildren() {
            let stateVariables = await returnAllStateVariables(core);
            let components: {} = core.components!;

            let p1AllChildren: string[] = [];
            p1AllChildren.push("/A");
            p1AllChildren.push(components["/A"].adapterUsed.componentName);
            p1AllChildren.push("/map1");

            let map = stateVariables["/map1"];

            let nActiveReps = map.replacements!.length;
            if (map.replacementsToWithhold) {
                nActiveReps -=
                    stateVariables["/map1"].replacementsToWithhold || 0;
            }
            for (let template of map.replacements!.slice(0, nActiveReps)) {
                p1AllChildren.push(template.componentName);
                let point = components[template.componentName].replacements[0];
                p1AllChildren.push(point.componentName);
                p1AllChildren.push(point.adapterUsed.componentName);
            }
            p1AllChildren.push("/B");
            p1AllChildren.push(components["/B"].adapterUsed.componentName);

            expect(components["/p1"].allChildrenOrdered).eqls(p1AllChildren);

            let p2AllChildren: string[] = [];
            p2AllChildren.push("/collect1");
            let collect = stateVariables["/collect1"];
            nActiveReps = collect.replacements!.length;
            if (collect.replacementsToWithhold) {
                nActiveReps -=
                    stateVariables["/collect1"].replacementsToWithhold || 0;
            }
            for (let rep of collect.replacements!.slice(0, nActiveReps)) {
                p2AllChildren.push(rep.componentName);
                p2AllChildren.push(rep.adapterUsed.componentName);
            }

            expect(components["/p2"].allChildrenOrdered).eqls(p2AllChildren);
        }

        await checkAllChildren();

        await updateMathInputValue({ latex: "4", name: "/n", core });
        await checkAllChildren();

        await updateMathInputValue({ latex: "3", name: "/n", core });
        await checkAllChildren();

        await updateMathInputValue({ latex: "1", name: "/n", core });
        await checkAllChildren();
    });

    it("overwrite attributes using collect", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Collected points are fixed: <booleanInput name="fixed" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g2">
      <collect componentTypes="point" source="g1" fixed="$fixed" assignNames="A2 B2" />
    </graph>
    
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><collect componentTypes="point" prop="x" source="g1" fixed="$fixed" assignNames="Ax Bx" /></aslist>

    <copy source="al" name="al2" newNamespace />
    `,
        });

        async function check_items(bool: boolean) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/A"].stateValues.fixed).eq(false);
            expect(stateVariables["/B"].stateValues.fixed).eq(false);
            expect(stateVariables["/A2"].stateValues.fixed).eq(bool);
            expect(stateVariables["/B2"].stateValues.fixed).eq(bool);
            expect(stateVariables["/g3/A2"].stateValues.fixed).eq(bool);
            expect(stateVariables["/g3/B2"].stateValues.fixed).eq(bool);
            expect(stateVariables["/Ax"].stateValues.fixed).eq(bool);
            expect(stateVariables["/Bx"].stateValues.fixed).eq(bool);
            expect(stateVariables["/al2/Ax"].stateValues.fixed).eq(bool);
            expect(stateVariables["/al2/Bx"].stateValues.fixed).eq(bool);
        }

        await check_items(false);

        await updateBooleanInputValue({
            boolean: true,
            name: "/fixed",
            core,
        });
        await check_items(true);

        await updateBooleanInputValue({
            boolean: false,
            name: "/fixed",
            core,
        });
        await check_items(false);
    });

    it("collect componentIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g2">
      <collect componentTypes="point" source="g1" assignNames="A2 B2" componentIndex="$n" />
    </graph>
    
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><collect componentTypes="point" prop="x" source="g1" componentIndex="$n" assignNames="Ax Bx" /></aslist>

    <copy source="al" name="al2" newNamespace />

    `,
        });

        async function check_items({
            x1,
            x2,
            y1,
            y2,
            index,
        }: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
            index?: number;
        }) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                [x1, y1],
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                [x2, y2],
            );

            if (index) {
                const collectX = index === 1 ? x1 : x2;
                const collectY = index === 1 ? y1 : y2;

                expect(
                    stateVariables["/A2"].stateValues.xs.map((x) => x.tree),
                ).eqls([collectX, collectY]);
                expect(
                    stateVariables["/g3/A2"].stateValues.xs.map((x) => x.tree),
                ).eqls([collectX, collectY]);

                expect(stateVariables["/Ax"].stateValues.value.tree).eq(
                    collectX,
                );
                expect(stateVariables["/al2/Ax"].stateValues.value.tree).eq(
                    collectX,
                );
            } else {
                expect(stateVariables["/A2"]).eq(undefined);
                expect(stateVariables["/g3/A2"]).eq(undefined);

                expect(stateVariables["/Ax"]).eq(undefined);
                expect(stateVariables["/al2/Ax"]).eq(undefined);
            }

            expect(stateVariables["/B2"]).eq(undefined);
            expect(stateVariables["/g3/B2"]).eq(undefined);
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
        await check_items({ x1, x2, y1, y2, index: 1 });

        // move copied point
        x1 = 9;
        y1 = -5;
        await movePoint({ name: "/A2", x: x1, y: y1, core });

        await check_items({ x1, x2, y1, y2, index: 1 });

        // restrict collection to second component
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items({ x1, x2, y1, y2, index: 2 });

        // move double copied point
        x2 = 0;
        y2 = 8;
        await movePoint({ name: "/g3/A2", x: x2, y: y2, core });
        await check_items({ x1, x2, y1, y2, index: 2 });
    });

    it("collect propIndex and componentIndex", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>m: <mathInput name="m" /></p>
    <p>n: <mathInput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <p><aslist name="al"><collect componentTypes="point" prop="xs" source="g1" componentIndex="$m" propIndex="$n" assignNames="n1 n2 n3 n4" /></aslist></p>

    <p><copy source="al" name="al2" newNamespace /></p>

    `,
        });

        async function check_items({
            x1,
            x2,
            y1,
            y2,
            componentIndex,
            propIndex,
        }: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
            componentIndex?: number;
            propIndex?: number;
        }) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls(
                [x1, y1],
            );
            expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls(
                [x2, y2],
            );

            if (
                (componentIndex === 1 || componentIndex === 2) &&
                (propIndex === 1 || propIndex === 2)
            ) {
                const val =
                    componentIndex === 1
                        ? propIndex === 1
                            ? x1
                            : y1
                        : propIndex == 1
                          ? x2
                          : y2;
                expect(stateVariables["/n1"].stateValues.value.tree).eq(val);
                expect(stateVariables["/al2/n1"].stateValues.value.tree).eq(
                    val,
                );
            } else {
                expect(stateVariables["/n1"]).eq(undefined);
                expect(stateVariables["/al2/n1"]).eq(undefined);
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

        await check_items({ x1, y1, x2, y2 });

        // set propIndex to 1
        let propIndex = 1;
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items({ x1, y1, x2, y2, propIndex });

        // move point 1
        x1 = 9;
        y1 = -5;
        await movePoint({ name: "/A", x: x1, y: y1, core });
        await check_items({ x1, y1, x2, y2, propIndex });

        // set componentIndex to 2
        let componentIndex = 2;
        await updateMathInputValue({ latex: "2", name: "/m", core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // move point2
        x2 = 0;
        y2 = 8;
        await movePoint({ name: "/B", x: x2, y: y2, core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set propIndex to 2
        propIndex = 2;
        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set componentIndex to 1
        componentIndex = 1;
        await updateMathInputValue({ latex: "1", name: "/m", core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set propIndex to 3
        propIndex = 3;
        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set propIndex to 1
        propIndex = 3;
        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set componentIndex to 3
        componentIndex = 3;
        await updateMathInputValue({ latex: "3", name: "/m", core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // set componentIndex to 2
        componentIndex = 2;
        await updateMathInputValue({ latex: "2", name: "/m", core });
        await check_items({ x1, y1, x2, y2, propIndex, componentIndex });

        // clear propIndex
        await updateMathInputValue({ latex: "", name: "/n", core });
        await check_items({ x1, y1, x2, y2, componentIndex });
    });

    it("collect prop is case insensitive", async () => {
        let core = await createTestCore({
            doenetML: `
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,5)</point>
    </graph>

    <graph>
      $_point1{name="p1a"}
      <point>(4,2)</point>
      <point>
        (<copy prop="y" source="_point2" />,
        <copy prop="x" source="_point2" />)
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" name="points" source="_panel1" assignNames="q1 q2 q3 q4 q5" />
    </graph>

    <p>Coordinates of points: <collect componentTypes="point" prop="CoOrDS" name="coords" source="_panel1" assignNames="c1 c2 c3 c4 c5" /></p>
    <p><m>x</m>-coordinates of points: <aslist><collect componentTypes="point" prop="X" name="xs" source="_graph3" assignNames="x1 x2 x3 x4 x5" /></aslist></p>
    <p><m>x</m>-coordinates of points via a copy: <aslist><copy name="xs2" source="xs" assignNames="xc1 xc2 xc3 xc4 xc5" /></aslist></p>
    <p><m>x</m>-coordinates of points via extract: <aslist><extract prop="X" name="xs3" assignNames="xe1 xe2 xe3 xe4 xe5" ><copy name="points2" source="points" assignNames="qa1 qa2 qa3 qa4 qa5" /></extract></aslist></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean"><collect componentTypes="point" prop="Y" name="ys" source="_graph3" assignNames="y1 y2 y3 y4 y5" /></mean></p>
    `,
        });

        let x1 = -3,
            y1 = 1;
        let x2 = -7,
            y2 = 5;
        let x3 = 4,
            y3 = 2;

        let meany = (y1 + y2 + y1 + y3 + x2) / 5;

        let xs = [x1, x2, x1, x3, y2];
        let ys = [y1, y2, y1, y3, x2];
        let stateVariables = await returnAllStateVariables(core);
        for (let i = 0; i < 5; i++) {
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/q${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0].tree).eq(
                xs[i],
            );
            expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1].tree).eq(
                ys[i],
            );
            expect(stateVariables[`/c${i + 1}`].stateValues.value.tree).eqls([
                "vector",
                xs[i],
                ys[i],
            ]);
            expect(stateVariables[`/x${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xc${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/xe${i + 1}`].stateValues.value.tree).eq(
                xs[i],
            );
            expect(stateVariables[`/y${i + 1}`].stateValues.value.tree).eq(
                ys[i],
            );
        }
        expect(stateVariables["/mean"].stateValues.value.tree).eq(meany);
    });

    it("collect from source that initially does not exist", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />

    <conditionalContent assignNames="g" condition="$bi">
      <graph>
        <point>(1,2)</point>
        <point>(3,4)</point>
      </graph>
    </conditionalContent>
    
    <collect source="g" componentTypes="point" assignNames="P1 P2" />
    `,
        });

        await updateBooleanInputValue({
            boolean: true,
            name: "/bi",
            core,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/P2"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
    });
});
