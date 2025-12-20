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
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
                    await resolvePathToNodeIdx(`points`),
                    i,
                );

                expect(thePoint.stateValues.xs[0].tree).eq(xs[i]);
                expect(thePoint.stateValues.xs[1].tree).eq(ys[i]);

                const theCoords = getReplacement(
                    stateVariables,
                    await resolvePathToNodeIdx(`coords`),
                    i,
                );

                expect(theCoords.stateValues.value.tree).eqls([
                    "vector",
                    xs[i],
                    ys[i],
                ]);

                const theX = getReplacement(
                    stateVariables,
                    await resolvePathToNodeIdx(`xs`),
                    i,
                );

                expect(theX.stateValues.value.tree).eq(xs[i]);
            }
            expect(
                stateVariables[await resolvePathToNodeIdx("mean")].stateValues
                    .value.tree,
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
            componentIdx: await resolvePathToNodeIdx("p1"),
            x: x1,
            y: y1,
            core,
        });

        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move point 1 via copy
        x1 = 2;
        y1 = 0;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p1a"),
            x: x1,
            y: y1,
            core,
        });

        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move point 2
        x2 = 4;
        y2 = 8;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p2"),
            x: x2,
            y: y2,
            core,
        });
        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move flipped point 2
        x2 = -1;
        y2 = -3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p4"),
            x: y2,
            y: x2,
            core,
        });
        await check_values({ x1, y1, x2, y2, x3, y3 });

        // move point 3
        x3 = -5;
        y3 = 9;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p3"),
            x: x3,
            y: y3,
            core,
        });
        await check_values({ x1, y1, x2, y2, x3, y3 });
    });

    it("collect dynamic points from graphs", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="length" prefill="3"/>
    <mathInput name="mult" prefill="2"/>
    <panel name="panel1">
    <graph>
      <setup>
        <sequence name="seq" to="$length" />
      </setup>
      <repeat name="repeat1" for="$seq" valueName="x">
        <point name="p">($x, $mult$x)</point>
      </repeat>
      <line>y=x/3</line>
    </graph>

    <graph>
      <setup>
        <collect componentType="point" from="$repeat1" name="collect1" />
      </setup>
      <repeat name="repeat2" valueName="pt" for="$collect1">
        <point name="p">($pt.x+1, 1.5*$pt.y)</point>
      </repeat>

    </graph>
    </panel>

    <graph name="graph3">
      <collect componentType="point" from="$panel1" name="collect2" />
    </graph>

    <p>y-coordinates of points: <asList>
      <setup>
        <collect componentType="point" from="$graph3" name="collect3" />
      </setup>
      <mathList extend="$collect3.y" name="ys" />
    </asList></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(6);

        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 4}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 4}]`)]
                    .stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 4}]`)]
                    .stateValues.value.tree,
            ).eq(3 * x);
        }

        // increase number of points
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 6}]`)]
                    .stateValues.value.tree,
            ).eq(3 * x);
        }

        // change multiple
        await updateMathInputValue({
            latex: "0.5",
            componentIdx: await resolvePathToNodeIdx("mult"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 6}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // decrease number of points
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 1; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 2}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 2}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 2}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // increase number of points back to 4
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(8);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 5}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // increase number of points to 6
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(12);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(12);

        for (let i = 0; i < 6; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 7}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 7}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 7}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }
    });

    it("collect dynamic points from groups", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="length" prefill="3"/>
    <mathInput name="mult" prefill="2"/>
    <section name="section1">
    <group>
      <setup>
        <sequence name="seq" to="$length" />
      </setup>
      <repeat name="repeat1" for="$seq" valueName="x">
        <point name="p">($x, $mult$x)</point>
      </repeat>
      <line>y=x/3</line>
    </group>

    <group>
    <setup>
        <collect componentType="point" from="$repeat1" name="collect1" />
      </setup>
      <repeat name="repeat2" valueName="pt" for="$collect1">
        <point name="p">($pt.x+1, 1.5*$pt.y)</point>
      </repeat>

    </group>
    </section>

    <group name="group3">
      <collect componentType="point" from="$section1" name="collect2" />
    </group>

    <p>y-coordinates of points: <asList>
      <setup>
        <collect componentType="point" from="$group3" name="collect3" />
      </setup>
      <mathList extend="$collect3.y" name="ys" />
    </asList></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(6);

        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 4}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 4}]`)]
                    .stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 4}]`)]
                    .stateValues.value.tree,
            ).eq(3 * x);
        }

        // increase number of points
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 6}]`)]
                    .stateValues.value.tree,
            ).eq(3 * x);
        }

        // change multiple
        await updateMathInputValue({
            latex: "0.5",
            componentIdx: await resolvePathToNodeIdx("mult"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 6}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // decrease number of points
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 1; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 2}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 2}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 2}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // increase number of points back to 4
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(8);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 5}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // increase number of points to 6
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(12);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(12);

        for (let i = 0; i < 6; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 7}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 7}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 7}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }
    });

    it("maximum number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="length" prefill="5"/>
    <mathInput name="mult" prefill="2"/>
    <mathInput name="maxnumber" prefill="2"/>
    <panel name="panel1">
    <graph>
      <setup>
        <sequence name="seq" to="$length" />
      </setup>
      <repeat name="repeat1" for="$seq" valueName="x">
        <point name="p">($x, $mult$x)</point>
      </repeat>
      <line>y=x/3</line>
    </graph>

    <graph>
      <setup>
        <collect componentType="point" from="$repeat1" name="collect1" maxNumber="$maxnumber"  />
      </setup>
      <repeat name="repeat2" valueName="pt" for="$collect1">
        <point name="p">($pt.x+1, 1.5*$pt.y)</point>
      </repeat>

    </graph>
    </panel>

    <graph name="graph3">
      <collect componentType="point" from="$panel1" name="collect2" maxNumber="2$maxnumber" />
    </graph>

    <p>y-coordinates of points: <asList>
      <setup>
        <collect componentType="point" from="$graph3" name="collect3" maxNumber="$maxnumber" />
      </setup>
      <mathList extend="$collect3.y" name="ys" />
    </asList></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(2 * x);
        }
        for (let i = 0; i < 2; i++) {
            let x = i + 1;
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(3 * x);
        }
        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
        }
        for (let i = 0; i < 2; i++) {
            let x = i + 1;
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(2 * x);
        }

        // increase maxnumber
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("maxnumber"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(5);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(2 * x);
            //expect(stateVariables[await resolvePathToNodeIdx(`ys[${i + 6}]`)].stateValues.value.tree).eq(3 * x);
        }

        // increase maxnumber further
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("maxnumber"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[1].tree,
            ).eq(3 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(2 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 6}]`)]
                    .stateValues.value.tree,
            ).eq(3 * x);
        }

        // change multiple
        await updateMathInputValue({
            latex: "0.5",
            componentIdx: await resolvePathToNodeIdx("mult"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(10);

        for (let i = 0; i < 5; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 6}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 6}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // decrease number of points
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(2);

        for (let i = 0; i < 1; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 2}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 2}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 2}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // increase number of points back to 4
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(8);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(8);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 5}]`)]
                    .stateValues.value.tree,
            ).eq(0.75 * x);
        }

        // decrease max number to 3
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("maxnumber"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat1")].stateValues
                .numIterates,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect1")].stateValues
                .collectedComponents.length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("repeat2")].stateValues
                .numIterates,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect2")].stateValues
                .collectedComponents.length,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("collect3")].stateValues
                .collectedComponents.length,
        ).eq(3);

        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.5 * x);
        }
        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect1[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`repeat2[${i + 1}].p`)
                ].stateValues.xs[1].tree,
            ).eq(0.75 * x);
        }
        for (let i = 0; i < 4; i++) {
            let x = i + 1;

            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.5 * x);
        }
        for (let i = 0; i < 2; i++) {
            let x = i + 1;
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[0].tree,
            ).eq(x + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`collect2[${i + 5}]`)]
                    .stateValues.xs[1].tree,
            ).eq(0.75 * x);
        }
        for (let i = 0; i < 3; i++) {
            let x = i + 1;
            expect(
                stateVariables[await resolvePathToNodeIdx(`ys[${i + 1}]`)]
                    .stateValues.value.tree,
            ).eq(0.5 * x);
        }
    });

    it("collect, extract, copy multiple ways", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>How many blanks? 
    <mathInput name="n" prefill="1" />
  </p>
 
  <p name="p_original">Enter expressions:
    <repeatForSequence asList="false" length="$n" name="repeat1">
      <mathInput name="mi" />
    </repeatForSequence>
  </p>
  
  <setup><collect componentType="mathInput" from="$p_original" name="collect1" /></setup>
  <p name="p_1">Inputs collected then, values extracted: 
  <asList name="al1"><mathList name="values1" extend="$collect1.value" /></asList></p>

  <p name="p_1a">Copied: <asList name="al1a"><mathList name="values1a" extend="$values1" /></asList></p>
  <p name="p_1b">Copy asList: <asList name="al1b" extend="$al1" /></p>
  <p name="p_1c">Copy copied: <asList>$values1a</asList></p>
  <p name="p_1d">Copy asList containing copy: $al1a</p>
  <p name="p_1e">Copy copied asList: $al1b</p>

    <p name="p_3">
    Inputs collected:
    <asList name="al3">
        <collect
        name="col"
        componentType="mathInput"
        from="$p_original"
        />
    </asList>
    </p>

    <p name="p_3a">
    Copied:
    <asList name="al3a">
        $col
    </asList>
    </p>
    <p name="p_3b">Copy asList: $al3</p>
    <p name="p_3d">Copy asList containing copy: $al3a</p>
  
    `,
        });

        async function set_and_check_items(
            values: string[],
            mis_used = "orig",
        ) {
            await updateMathInputValue({
                latex: `${values.length}`,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const al3Children =
                stateVariables[await resolvePathToNodeIdx("al3")]
                    .activeChildren;

            const p3bGrandchildren =
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("p_3b")]
                        .activeChildren[1].componentIdx
                ].activeChildren;
            const p3dGrandchildren =
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("p_3d")]
                        .activeChildren[1].componentIdx
                ].activeChildren;

            for (let [ind, val] of values.entries()) {
                let mi_idx: number = -1;
                if (mis_used === "orig") {
                    mi_idx = await resolvePathToNodeIdx(
                        `repeat1[${ind + 1}].mi`,
                    );
                } else if (mis_used == "a") {
                    mi_idx = al3Children[ind].componentIdx;
                } else if (mis_used === "b") {
                    mi_idx = p3bGrandchildren[ind].componentIdx;
                } else if (mis_used === "d") {
                    mi_idx = p3dGrandchildren[ind].componentIdx;
                }

                await updateMathInputValue({
                    latex: val,
                    componentIdx: mi_idx,
                    core,
                });
            }

            stateVariables = await core.returnAllStateVariables(false, true);

            const listText = values.join(", ");

            expect(
                stateVariables[await resolvePathToNodeIdx("p_1")].stateValues
                    .text,
            ).eq(`Inputs collected then, values extracted: \n  ${listText}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p_1a")].stateValues
                    .text,
            ).eq(`Copied: ${listText}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p_1b")].stateValues
                    .text,
            ).eq(`Copy asList: ${listText}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p_1c")].stateValues
                    .text,
            ).eq(`Copy copied: ${listText}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p_1d")].stateValues
                    .text,
            ).eq(`Copy asList containing copy: ${listText}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p_1e")].stateValues
                    .text,
            ).eq(`Copy copied asList: ${listText}`);

            for (let [ind, val] of values.entries()) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`col[${ind + 1}]`)
                    ].stateValues.immediateValue.tree,
                ).eq(val);
                expect(
                    stateVariables[al3Children[ind].componentIdx].stateValues
                        .immediateValue.tree,
                ).eq(val);
                expect(
                    stateVariables[p3bGrandchildren[ind].componentIdx]
                        .stateValues.immediateValue.tree,
                ).eq(val);
                expect(
                    stateVariables[p3dGrandchildren[ind].componentIdx]
                        .stateValues.immediateValue.tree,
                ).eq(val);
            }
        }

        await set_and_check_items(["x"]);

        await set_and_check_items(["x1", "y", "z", "u", "v"], "a");

        await set_and_check_items([]);

        await set_and_check_items(["x2", "y2"], "b");

        await set_and_check_items(["e", "f", "g", "h", "i"], "d");
    });

    // main point: no longer turn inputs into their value
    // even with copy a collection with a macro
    it("test macros by collecting inputs and others", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            await resolvePathToNodeIdx("sec")
        ].activeChildren.slice(1, 14);

        let collect1Replacements =
            stateVariables[await resolvePathToNodeIdx("pcollect1")]
                .activeChildren;
        let collect2Replacements =
            stateVariables[await resolvePathToNodeIdx("pcollect2")]
                .activeChildren;
        let group2Replacements =
            stateVariables[await resolvePathToNodeIdx("pgroup2")]
                .activeChildren;

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
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).contain("public");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).not.contain("secret");

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).contain("Hidden by default: public");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).contain("Force to reveal: secret, public");
    });

    it("collect keeps hidden children hidden", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            stateVariables[await resolvePathToNodeIdx("theP1")].stateValues
                .text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("theP2")].stateValues
                .text,
        ).eq("Hidden text: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("theP3")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theP4")].stateValues
                .hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 2)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 3)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 2)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 3)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
    });

    it("collecting from within a hidden section", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            stateVariables[await resolvePathToNodeIdx("theP1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theP2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theP3")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theP4")].stateValues
                .hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 2)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c1"), 3)
                .stateValues.hidden,
        ).eq(true);
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 0)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 1)
                .stateValues.text,
        ).eq("Hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 2)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
        expect(
            getReplacement(stateVariables, await resolvePathToNodeIdx("c2"), 3)
                .stateValues.text,
        ).eq("Hidden paragraph with hidden text: ");
    });

    it("collects hide dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1">
      <repeatForSequence type="letters" from="a" length="$n" valueName="l">
        <text>Hello, $l! </text>
      </repeatForSequence>
    </p>

    <booleanInput name='h1' prefill="false" >
      <label>Hide first collect</label>
    </booleanInput>
    <p>Number of points <mathInput name="n" prefill="4" /></p>

    <p name="c1">collect 1: <collect hide="$h1" componentType="text" from="$p1" asList="false" name="collect1" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("collect 1: Hello, a! Hello, b! Hello, c! Hello, d! ");

        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ",
        );

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("collect 1: ");

        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("collect 1: ");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq(
            "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ",
        );

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("collect 1: Hello, a! Hello, b! Hello, c! ");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq("collect 1: ");
    });

    it("asList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p">We an <text>apple</text>, a <text>banana</text>, and a <text>cherry</text>.</p> 

    <p name="pdefault"><collect componentType="text" from="$p" /></p>
    <p name="pnolist"><collect componentType="text" from="$p" asList="false"/></p>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pdefault")].stateValues
                .text,
        ).eq("apple, banana, cherry");
        expect(
            stateVariables[await resolvePathToNodeIdx("pnolist")].stateValues
                .text,
        ).eq("applebananacherry");
    });

    it("collect warnings", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <graph name="g"><shortDescription>A graph with warnings</shortDescription></graph>
    <collect from="$nothing" />
    <collect from="$g" componentType="abc" />
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(3);

        expect(errorWarnings.warnings[0].message).contain(
            "No referent found for reference: $nothing",
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(3);
        expect(errorWarnings.warnings[0].position.start.column).eq(19);
        expect(errorWarnings.warnings[0].position.end.line).eq(3);
        expect(errorWarnings.warnings[0].position.end.column).eq(27);

        expect(errorWarnings.warnings[1].message).contain(
            "No source found for collect",
        );
        expect(errorWarnings.warnings[1].position.start.line).eq(3);
        expect(errorWarnings.warnings[1].position.start.column).eq(5);
        expect(errorWarnings.warnings[1].position.end.line).eq(3);
        expect(errorWarnings.warnings[1].position.end.column).eq(32);

        expect(errorWarnings.warnings[2].message).contain(
            "Cannot collect components of type <abc> as it is an invalid component type",
        );
        expect(errorWarnings.warnings[2].position.start.line).eq(4);
        expect(errorWarnings.warnings[2].position.start.column).eq(5);
        expect(errorWarnings.warnings[2].position.end.line).eq(4);
        expect(errorWarnings.warnings[2].position.end.column).eq(46);
    });

    it("allChildrenOrdered consistent with dynamic collect and adapters", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput prefill="2" name='n' />

    <p name="p1">
      begin
      <point name="A">(1,2)</point>
      <repeatForSequence name="repeat1" length="$n" valueName="x" indexName="i">
        <point>($x, $i)</point>
      </repeatForSequence>
      <point name="B">(3,4)</point>
      end
    </p>
    
    <p name="p2">Hello <collect componentType="point" from="$p1" name="collect1" /> there</p>
    `,
        });

        async function checkAllChildren() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let components: {} = core.core!.components!;

            let p1AllChildren: number[] = [];
            p1AllChildren.push(await resolvePathToNodeIdx("A"));
            p1AllChildren.push(
                components[await resolvePathToNodeIdx("A")].adapterUsed
                    .componentIdx,
            );
            p1AllChildren.push(await resolvePathToNodeIdx("repeat1"));

            let map = stateVariables[await resolvePathToNodeIdx("repeat1")];

            let nActiveReps = map.replacements!.length;
            if (map.replacementsToWithhold) {
                nActiveReps -=
                    stateVariables[await resolvePathToNodeIdx("repeat1")]
                        .replacementsToWithhold || 0;
            }
            for (let template of map.replacements!.slice(0, nActiveReps)) {
                p1AllChildren.push(template.componentIdx);
                let point = components[template.componentIdx].replacements[0];
                p1AllChildren.push(point.componentIdx);
                p1AllChildren.push(point.adapterUsed.componentIdx);
            }
            p1AllChildren.push(await resolvePathToNodeIdx("B"));
            p1AllChildren.push(
                components[await resolvePathToNodeIdx("B")].adapterUsed
                    .componentIdx,
            );

            expect(
                components[
                    await resolvePathToNodeIdx("p1")
                ].allChildrenOrdered.filter(
                    (cIdx) => components[cIdx].componentType !== "setup",
                ),
            ).eqls(p1AllChildren);

            let p2AllChildren: number[] = [];
            p2AllChildren.push(await resolvePathToNodeIdx("collect1"));
            let collect = components[await resolvePathToNodeIdx("collect1")];
            nActiveReps = collect.replacements!.length;
            if (collect.replacementsToWithhold) {
                nActiveReps -=
                    stateVariables[await resolvePathToNodeIdx("collect1")]
                        .replacementsToWithhold || 0;
            }
            for (let rep of collect.replacements!.slice(0, nActiveReps)) {
                p2AllChildren.push(rep.componentIdx);
                p2AllChildren.push(rep.adapterUsed.componentIdx);
            }

            expect(
                components[await resolvePathToNodeIdx("p2")].allChildrenOrdered,
            ).eqls(p2AllChildren);
        }

        await checkAllChildren();

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkAllChildren();

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkAllChildren();

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkAllChildren();
    });

    it("overwrite attributes using collect", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
                stateVariables[await resolvePathToNodeIdx("fixed")].stateValues
                    .value,
            ).eq(bool);
            expect(
                stateVariables[await resolvePathToNodeIdx("A")].stateValues
                    .fixed,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("B")].stateValues
                    .fixed,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("c.A")].stateValues
                    .fixed,
            ).eq(bool);
            expect(
                stateVariables[await resolvePathToNodeIdx("c.B")].stateValues
                    .fixed,
            ).eq(bool);
            expect(
                stateVariables[await resolvePathToNodeIdx("g3.c.A")].stateValues
                    .fixed,
            ).eq(bool);
            expect(
                stateVariables[await resolvePathToNodeIdx("g3.c.B")].stateValues
                    .fixed,
            ).eq(bool);
        }

        await check_items(false);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("fixed"),
            core,
        });
        await check_items(true);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("fixed"),
            core,
        });
        await check_items(false);
    });

    it("collect from source that initially does not exist", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />

    <conditionalContent name="c" condition="$bi">
      <graph name="g">
        <point>(1,2)</point>
        <point>(3,4)</point>
      </graph>
    </conditionalContent>
    
    <collect from="$c.g" componentType="point" name="collect" />
    `,
        });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("collect[1]")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("collect[2]")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);
    });
});
