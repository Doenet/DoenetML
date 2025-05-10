import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";
import {
    movePoint,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function getReplacement(
    stateVariables: Awaited<
        ReturnType<PublicDoenetMLCore["returnAllStateVariables"]>
    >,
    compositeIdx: number,
    replacementNum: number,
) {
    const replacementIdx =
        stateVariables[compositeIdx].replacements![replacementNum].componentIdx;
    return stateVariables[replacementIdx];
}

describe("Collect tag tests", async () => {
    it("collect points from graphs", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <panel name="panel1">
    <graph>
      <point name="p1">(-3,1)</point>
      <point name="p2">(-7,5)</point>
    </graph>

    <graph>
      <point extend="$p1" name="p1a" />
      <point name="p3">(4,2)</point>
      <point name="p4">
        ($p2.y, $p2.x)
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentType="point" name="points" from="$panel1" />
    </graph>

    <p>Coordinates of points: <mathList extend="$points.coords" name="coords" /></p>
    <p><m>x</m>-coordinates of points: <mathList extend="$points.x" name="xs" /></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean">$points.y</mean></p>
    `,
        });

        async function check_values({
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            x3: number;
            y3: number;
        }) {
            const xs = [x1, x2, x1, x3, y2];
            const ys = [y1, y2, y1, y3, x2];
            const mean_y = (y1 + y2 + y1 + y3 + x2) / 5;

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let i = 0; i < 5; i++) {
                const thePoint = getReplacement(
                    stateVariables,
                    resolveComponentName(`points`),
                    i,
                );

                expect(thePoint.stateValues.xs[0].tree).eq(xs[i]);
                expect(thePoint.stateValues.xs[1].tree).eq(ys[i]);

                const theCoords = getReplacement(
                    stateVariables,
                    resolveComponentName(`coords`),
                    i,
                );

                expect(theCoords.stateValues.value.tree).eqls([
                    "vector",
                    xs[i],
                    ys[i],
                ]);

                const theX = getReplacement(
                    stateVariables,
                    resolveComponentName(`xs`),
                    i,
                );

                expect(theX.stateValues.value.tree).eq(xs[i]);
            }
            expect(
                stateVariables[resolveComponentName("mean")].stateValues.value
                    .tree,
            ).eq(mean_y);
        }

        let x1 = -3,
            y1 = 1;
        let x2 = -7,
            y2 = 5;
        let x3 = 4,
            y3 = 2;

        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move point 1
        x1 = -8;
        y1 = 6;

        await movePoint({
            componentIdx: resolveComponentName("p1"),
            x: x1,
            y: y1,
            core,
        });

        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move point 1 via copy
        x1 = 2;
        y1 = 0;

        await movePoint({
            componentIdx: resolveComponentName("p1a"),
            x: x1,
            y: y1,
            core,
        });

        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move point 2
        x2 = 4;
        y2 = 8;

        await movePoint({
            componentIdx: resolveComponentName("p2"),
            x: x2,
            y: y2,
            core,
        });
        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move flipped point 2
        x2 = -1;
        y2 = -3;

        await movePoint({
            componentIdx: resolveComponentName("p4"),
            x: y2,
            y: x2,
            core,
        });
        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move point 3
        x3 = -5;
        y3 = 9;

        await movePoint({
            componentIdx: resolveComponentName("p3"),
            x: x3,
            y: y3,
            core,
        });
        await check_values({ x1, y1, x2, y2, x3, y3 });
    });

    it("collect dynamic points from graphs", async () => {
        let { core, resolveComponentName } = await createTestCore({
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(12);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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
        let { core, resolveComponentName } = await createTestCore({
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(12);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

    it("maximum number", async () => {
        let { core, resolveComponentName } = await createTestCore({
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(2);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(5);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("_map1")].stateValues
                .numIterates[0],
        ).eq(4);
        expect(
            stateVariables[resolveComponentName("_collect1")].stateValues
                .collectedComponents.length,
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_map2")].stateValues
                .numIterates[0],
        ).eq(3);
        expect(
            stateVariables[resolveComponentName("_collect2")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[resolveComponentName("_collect3")].stateValues
                .collectedComponents.length,
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
        let { core, resolveComponentName } = await createTestCore({
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

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const listText = values.join(", ");

            expect(
                stateVariables[resolveComponentName("p_1")].stateValues.text,
            ).eq(`Inputs collected then, values extracted: \n  ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_1a")].stateValues.text,
            ).eq(`Copied: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_1b")].stateValues.text,
            ).eq(`Copy aslist: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_1c")].stateValues.text,
            ).eq(`Copy copied: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_1d")].stateValues.text,
            ).eq(`Copy aslist containing copy: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_1e")].stateValues.text,
            ).eq(`Copy copied aslist: ${listText}`);

            expect(
                stateVariables[resolveComponentName("p_2")].stateValues.text,
            ).eq(`Values collected: \n    ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_2a")].stateValues.text,
            ).eq(`Copied: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_2b")].stateValues.text,
            ).eq(`Copy aslist: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_2c")].stateValues.text,
            ).eq(`Copy copied: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_2d")].stateValues.text,
            ).eq(`Copy aslist containing copy: ${listText}`);
            expect(
                stateVariables[resolveComponentName("p_2e")].stateValues.text,
            ).eq(`Copy copied aslist: ${listText}`);

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
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <section name="sec">
    <group name="group1">
      <mathInput name="a" prefill="x" />
      <textInput name="b" prefill="hello" />
      <booleanInput name="c" />
      <math>2$a</math>
      <text>$b there</text>
      <boolean>not $c</boolean>
    </group>

    <p name="pcollect1"><collect name="collect1" from="$group1" componentType="_input" /></p>
    <p name="pcollect2">$collect1</p>
    <p name="pgroup2">$group1</p>
    </section>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let group1Replacements = stateVariables[
            resolveComponentName("sec")
        ].activeChildren.slice(1, 14);

        let collect1Replacements =
            stateVariables[resolveComponentName("pcollect1")].activeChildren;
        let collect2Replacements =
            stateVariables[resolveComponentName("pcollect2")].activeChildren;
        let group2Replacements =
            stateVariables[resolveComponentName("pgroup2")].activeChildren;

        console.log({ group1Replacements, collect1Replacements });

        expect(group1Replacements.length).eq(13);
        expect(collect1Replacements.length).eq(3);
        expect(collect2Replacements.length).eq(3);
        expect(group2Replacements.length).eq(13);

        expect(group1Replacements[1].componentType).eq("mathInput");
        expect(
            stateVariables[group1Replacements[1].componentIdx].stateValues.value
                .tree,
        ).eq("x");
        expect(collect1Replacements[0].componentType).eq("mathInput");
        expect(
            stateVariables[collect1Replacements[0].componentIdx].stateValues
                .value.tree,
        ).eq("x");
        expect(collect2Replacements[0].componentType).eq("mathInput");
        expect(
            stateVariables[collect2Replacements[0].componentIdx].stateValues
                .value.tree,
        ).eq("x");
        expect(group2Replacements[1].componentType).eq("mathInput");
        expect(
            stateVariables[group2Replacements[1].componentIdx].stateValues.value
                .tree,
        ).eq("x");

        expect(group1Replacements[3].componentType).eq("textInput");
        expect(
            stateVariables[group1Replacements[3].componentIdx].stateValues
                .value,
        ).eq("hello");
        expect(collect1Replacements[1].componentType).eq("textInput");
        expect(
            stateVariables[collect1Replacements[1].componentIdx].stateValues
                .value,
        ).eq("hello");
        expect(collect2Replacements[1].componentType).eq("textInput");
        expect(
            stateVariables[collect2Replacements[1].componentIdx].stateValues
                .value,
        ).eq("hello");
        expect(group2Replacements[3].componentType).eq("textInput");
        expect(
            stateVariables[group2Replacements[3].componentIdx].stateValues
                .value,
        ).eq("hello");

        expect(group1Replacements[5].componentType).eq("booleanInput");
        expect(
            stateVariables[group1Replacements[5].componentIdx].stateValues
                .value,
        ).eq(false);
        expect(collect1Replacements[2].componentType).eq("booleanInput");
        expect(
            stateVariables[collect1Replacements[2].componentIdx].stateValues
                .value,
        ).eq(false);
        expect(collect2Replacements[2].componentType).eq("booleanInput");
        expect(
            stateVariables[collect2Replacements[2].componentIdx].stateValues
                .value,
        ).eq(false);
        expect(group2Replacements[5].componentType).eq("booleanInput");
        expect(
            stateVariables[group2Replacements[5].componentIdx].stateValues
                .value,
        ).eq(false);

        expect(group1Replacements[7].componentType).eq("math");
        expect(
            stateVariables[group1Replacements[7].componentIdx].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(group2Replacements[7].componentType).eq("math");
        expect(
            stateVariables[group2Replacements[7].componentIdx].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);

        expect(group1Replacements[9].componentType).eq("text");
        expect(
            stateVariables[group1Replacements[9].componentIdx].stateValues
                .value,
        ).eq("hello there");
        expect(group2Replacements[9].componentType).eq("text");
        expect(
            stateVariables[group2Replacements[9].componentIdx].stateValues
                .value,
        ).eq("hello there");
        expect(group1Replacements[11].componentType).eq("boolean");
        expect(
            stateVariables[group1Replacements[11].componentIdx].stateValues
                .value,
        ).eq(true);
        expect(group2Replacements[11].componentType).eq("boolean");
        expect(
            stateVariables[group2Replacements[11].componentIdx].stateValues
                .value,
        ).eq(true);
    });

    it("collect does not ignore hide", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p1">
      <text hide>secret</text>
      <text>public</text>
    </p>
    <p name="p2">Hidden by default: <collect componentType="text" from="$p1" /></p>
    <p name="p3">Force to reveal: <collect componentType="text" from="$p1" hide="false" /></p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("p1")].stateValues.text,
        ).contain("public");
        expect(
            stateVariables[resolveComponentName("p1")].stateValues.text,
        ).not.contain("secret");

        expect(
            stateVariables[resolveComponentName("p2")].stateValues.text,
        ).contain("Hidden by default: public");
        expect(
            stateVariables[resolveComponentName("p3")].stateValues.text,
        ).contain("Force to reveal: secret, public");
    });

    it("collect keeps hidden children hidden", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <section name="sec">
      <p name="theP1">Hidden text: <text name="hidden" hide>secret</text></p>
      <p extend="$theP1" name="theP2" />
      <p hide name="theP3">Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      <p extend="$theP3" name="theP4" />
    </section>
    <collect componentType="p" from="$sec" name="c1" />
    <collect componentType="p" from="$sec" hide="false" name="c2" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("theP1")].stateValues.text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[resolveComponentName("theP2")].stateValues.text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[resolveComponentName("theP3")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[resolveComponentName("theP4")].stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 2)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 3)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 2)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 3)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
    });

    it("collecting from within a hidden section", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <section hide name="sec">
      <p name="theP1">Hidden text: <text name="hidden" hide>secret</text></p>
      <p extend="$theP1" name="theP2" />
      <p hide name="theP3">Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      <p extend="$theP3" name="theP4" />
    </section>
    <collect componentType="p" from="$sec" name="c1" />
    <collect componentType="p" from="$sec" hide="false" name="c2" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("theP1")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[resolveComponentName("theP2")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[resolveComponentName("theP3")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[resolveComponentName("theP4")].stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 2)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, resolveComponentName("c1"), 3)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 2)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
        expect(
            getReplacement(stateVariables, resolveComponentName("c2"), 3)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
    });

    it("copies hide dynamically", async () => {
        let { core, resolveComponentName } = await createTestCore({
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

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
            "collect 2: ",
        );

        await updateMathInputValue({ latex: "6", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
            "collect 2: ",
        );

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

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
            "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ",
        );

        await updateMathInputValue({ latex: "8", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
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
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
            "collect 2: ",
        );

        await updateMathInputValue({ latex: "3", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
            "collect 2: ",
        );

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

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
            "collect 2: Hello, a! Hello, b! Hello, c! ",
        );

        await updateMathInputValue({ latex: "4", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("c1")].stateValues.text).eq(
            "collect 1: ",
        );
        expect(stateVariables[resolveComponentName("c2")].stateValues.text).eq(
            "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! ",
        );
    });

    it("asList", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p">We an <text>apple</text>, a <text>banana</text>, and a <text>cherry</text>.</p> 

    <p name="pdefault"><collect componentType="text" from="$p" /></p>
    <p name="pnolist"><collect componentType="text" from="$p" aslist="false"/></p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("pdefault")].stateValues.text,
        ).eq("apple, banana, cherry");
        expect(
            stateVariables[resolveComponentName("pnolist")].stateValues.text,
        ).eq("applebananacherry");
    });

    it("collect warnings", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="g" />
    <collect from="$nothing" />
    <collect from="$g" componentType="abc" />
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        console.log(errorWarnings.warnings);

        expect(errorWarnings.warnings[0].message).contain(
            "No source found for collect",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(3);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(3);
        expect(errorWarnings.warnings[0].position.end.column).eq(32);

        expect(errorWarnings.warnings[1].message).contain(
            "Cannot collect components of type <abc> as it is an invalid component type",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.start.line).eq(4);
        expect(errorWarnings.warnings[1].position.start.column).eq(5);
        expect(errorWarnings.warnings[1].position.end.line).eq(4);
        expect(errorWarnings.warnings[1].position.end.column).eq(46);
    });

    it("allChildrenOrdered consistent with dynamic collect and adapters", async () => {
        let { core, resolveComponentName } = await createTestCore({
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
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let components: {} = core.core!.components!;

            let p1AllChildren: string[] = [];
            p1AllChildren.push("/A");
            p1AllChildren.push(components["/A"].adapterUsed.componentIdx);
            p1AllChildren.push("/map1");

            let map = stateVariables[resolveComponentName("map1")];

            let nActiveReps = map.replacements!.length;
            if (map.replacementsToWithhold) {
                nActiveReps -=
                    stateVariables[resolveComponentName("map1")]
                        .replacementsToWithhold || 0;
            }
            for (let template of map.replacements!.slice(0, nActiveReps)) {
                p1AllChildren.push(template.componentIdx);
                let point = components[template.componentIdx].replacements[0];
                p1AllChildren.push(point.componentIdx);
                p1AllChildren.push(point.adapterUsed.componentIdx);
            }
            p1AllChildren.push("/B");
            p1AllChildren.push(components["/B"].adapterUsed.componentIdx);

            expect(components["/p1"].allChildrenOrdered).eqls(p1AllChildren);

            let p2AllChildren: string[] = [];
            p2AllChildren.push("/collect1");
            let collect = stateVariables[resolveComponentName("collect1")];
            nActiveReps = collect.replacements!.length;
            if (collect.replacementsToWithhold) {
                nActiveReps -=
                    stateVariables[resolveComponentName("collect1")]
                        .replacementsToWithhold || 0;
            }
            for (let rep of collect.replacements!.slice(0, nActiveReps)) {
                p2AllChildren.push(rep.componentIdx);
                p2AllChildren.push(rep.adapterUsed.componentIdx);
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
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p>Collected points are fixed: <booleanInput name="fixed" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g2">
      <collect componentType="point" from="$g1" fixed="$fixed" name="c"  />
    </graph>
    
    <graph extend="$g2" name="g3" />

    `,
        });

        async function check_items(bool: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[resolveComponentName("fixed")].stateValues.value,
            ).eq(bool);
            expect(
                stateVariables[resolveComponentName("A")].stateValues.fixed,
            ).eq(false);
            expect(
                stateVariables[resolveComponentName("B")].stateValues.fixed,
            ).eq(false);
            expect(
                stateVariables[resolveComponentName("c.A")].stateValues.fixed,
            ).eq(bool);
            expect(
                stateVariables[resolveComponentName("c.B")].stateValues.fixed,
            ).eq(bool);
            expect(
                stateVariables[resolveComponentName("g3.c.A")].stateValues
                    .fixed,
            ).eq(bool);
            expect(
                stateVariables[resolveComponentName("g3.c.B")].stateValues
                    .fixed,
            ).eq(bool);
        }

        await check_items(false);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: resolveComponentName("fixed"),
            core,
        });
        await check_items(true);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: resolveComponentName("fixed"),
            core,
        });
        await check_items(false);
    });

    it("collect from source that initially does not exist", async () => {
        let { core, resolveComponentName } = await createTestCore({
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

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("P1")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[resolveComponentName("P2")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([3, 4]);
    });
});
