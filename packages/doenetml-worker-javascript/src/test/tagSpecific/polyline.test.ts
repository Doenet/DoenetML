import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    movePolyline,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function testPolylineCopiedTwice({
    core,
    resolvePathToNodeIdx,
    vertices,
    polylineName = "pg",
    graph1Name = "g1",
    graph2Name = "g2",
    graph3Name = "g3",
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    vertices: (number | string)[][];
    polylineName?: string;
    graph1Name?: string;
    graph2Name?: string;
    graph3Name?: string;
}) {
    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${graph1Name}.${polylineName}`)
        ].stateValues.numVertices,
    ).eqls(vertices.length);
    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${graph2Name}.${polylineName}`)
        ].stateValues.numVertices,
    ).eqls(vertices.length);
    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${graph3Name}.${polylineName}`)
        ].stateValues.numVertices,
    ).eqls(vertices.length);

    for (let i in vertices) {
        if (
            typeof vertices[i][0] === "number" &&
            Number.isFinite(vertices[i][0])
        ) {
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${graph1Name}.${polylineName}`,
                            )
                        ].stateValues.vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${graph2Name}.${polylineName}`,
                            )
                        ].stateValues.vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${graph3Name}.${polylineName}`,
                            )
                        ].stateValues.vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
        } else {
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${graph1Name}.${polylineName}`)
                ].stateValues.vertices[i][0].tree,
            ).eq(vertices[i][0]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${graph2Name}.${polylineName}`)
                ].stateValues.vertices[i][0].tree,
            ).eq(vertices[i][0]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${graph3Name}.${polylineName}`)
                ].stateValues.vertices[i][0].tree,
            ).eq(vertices[i][0]);
        }
        if (
            typeof vertices[i][1] === "number" &&
            Number.isFinite(vertices[i][1])
        ) {
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${graph1Name}.${polylineName}`,
                            )
                        ].stateValues.vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${graph2Name}.${polylineName}`,
                            )
                        ].stateValues.vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${graph3Name}.${polylineName}`,
                            )
                        ].stateValues.vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
        } else {
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${graph1Name}.${polylineName}`)
                ].stateValues.vertices[i][1].tree,
            ).eq(vertices[i][1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${graph2Name}.${polylineName}`)
                ].stateValues.vertices[i][1].tree,
            ).eq(vertices[i][1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`${graph3Name}.${polylineName}`)
                ].stateValues.vertices[i][1].tree,
            ).eq(vertices[i][1]);
        }
    }
}

describe("Polyline tag tests", async () => {
    it("Polyline vertices and copied points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices = [
            [3, 5],
            [-4, -1],
            [5, 2],
            [-3, 4],
        ];

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move individual vertex
        vertices[1] = [4, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move copied polyline up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: { 2: vertices[2] },
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("Polyline macro in vertices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="m">-1</math>
  <graph name="g1">
    <polyline vertices="(3,5) (-4,$m) (5,2) (-3,4)" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices = [
            [3, 5],
            [-4, -1],
            [5, 2],
            [-3, 4],
        ];

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move individual vertex
        vertices[1] = [4, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move copied polyline up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: { 2: vertices[2] },
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("dynamic polyline with vertices from copied map, initially zero, copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="length" prefill="0" />
  <graph name="g1">
    <setup><sequence from="0" length="$length" name="s" /></setup>
    <repeat for="$s" valueName="x">
      <point>($x, 5sin($x))</point>
    </repeat>
    <polyline vertices="$_repeat1" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices: number[][] = [];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        vertices[0] = [0, 5 * Math.sin(0)];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        vertices[1] = [1, 5 * Math.sin(1)];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        vertices[2] = [2, 5 * Math.sin(2)];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        vertices.splice(2, 1);
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        vertices = [];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        for (let i = 0; i < 5; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // start over and begin with big increment
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

  <mathInput name="length" prefill="0" />
  <graph name="g1">
    <setup><sequence from="0" length="$length" name="s" /></setup>
    <repeat for="$s" valueName="x">
      <point>($x, 5sin($x))</point>
    </repeat>
    <polyline vertices="$_repeat1" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        }));

        vertices = [];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        for (let i = 0; i < 10; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("length"),
            core,
        });
        vertices = [[0, 5 * Math.sin(0)]];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("polyline with initially undefined point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="mi" />

  <graph name="g1">
    <polyline vertices="(1,2) (-1,5) ($mi,7) (3,-5) (-4,-3)" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices = [
            [1, 2],
            [-1, 5],
            ["\uff3f", 7],
            [3, -5],
            [-4, -3],
        ];
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        await updateMathInputValue({
            latex: "-2",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        vertices[2][0] = -2;
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it(`can't move polyline based on repeat`, async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <setup><sequence from="-5" to="5" name="s"/></setup>
    <repeat hide for="$s" name="mps" valueName="x">
      <point>($x, 5sin($x))</point>
    </repeat>
    <polyline vertices="$mps" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices: number[][] = [];
        for (let i = -5; i <= 5; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // can't move points
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.mps[1]"),
            x: 9,
            y: -8,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.mps[9]"),
            x: -8,
            y: 4,
            core,
        });

        // can't move polyline1
        let moveX = 3;
        let moveY = 2;

        let vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: vertices2,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // can't move polyline2
        moveX = -5;
        moveY = 6;

        vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices2,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // can't move polyline3
        moveX = 7;
        moveY = -4;

        vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: vertices2,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it(`create moveable polyline based on repeat`, async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <setup><sequence from="-5" to="5" name="s"/></setup>
    <repeat hide name="mps" for="$s" valueName="x">
      <point>($x + <math>0</math>, 5sin($x) + <math>0</math>)</point>
    </repeat>
    <polyline vertices="$mps" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices: number[][] = [];
        for (let i = -5; i <= 5; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // can move points

        vertices[0] = [9, -8];
        vertices[8] = [-8, 4];

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.mps[1][1]"),
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.mps[9][1]"),
            x: vertices[8][0],
            y: vertices[8][1],
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // can move polyline1
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // can move polyline2
        moveX = -5;
        moveY = 6;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        moveX = 7;
        moveY = -4;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("copy vertices of polyline", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <polyline name="pl" vertices="(-3,-1) (1,2) (3,4) (6,-2)" />
  </graph>
  <graph>
  <point extend="$pl.vertex1" name="v1" />
  <point extend="$pl.vertex2" name="v2" />
  <point extend="$pl.vertex3" name="v3" />
  <point extend="$pl.vertex4" name="v4" />
  </graph>
  <graph>
  <pointList name="vs" extend="$pl.vertices" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let ps = [
            [-3, -1],
            [1, 2],
            [3, 4],
            [6, -2],
        ];

        for (let i = 0; i < 4; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`v${i + 1}`)]
                    .stateValues.xs[0].tree,
            ).eq(ps[i][0]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`vs[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(ps[i][0]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`v${i + 1}`)]
                    .stateValues.xs[1].tree,
            ).eq(ps[i][1]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`vs[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(ps[i][1]);
        }

        // move individually copied vertices
        ps = [
            [-5, 3],
            [-2, 7],
            [0, -8],
            [9, -6],
        ];

        for (let i = 0; i < 4; i++) {
            await movePoint({
                componentIdx: await resolvePathToNodeIdx(`v${i + 1}`),
                x: ps[i][0],
                y: ps[i][1],
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(false, true);
        for (let i = 0; i < 4; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`v${i + 1}`)]
                    .stateValues.xs[0].tree,
            ).eq(ps[i][0]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`vs[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(ps[i][0]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`v${i + 1}`)]
                    .stateValues.xs[1].tree,
            ).eq(ps[i][1]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`vs[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(ps[i][1]);
        }

        // move array-copied vertices
        ps = [
            [-7, -1],
            [-3, 5],
            [2, 4],
            [6, 0],
        ];

        for (let i = 0; i < 4; i++) {
            await movePoint({
                componentIdx: await resolvePathToNodeIdx(`vs[${i + 1}]`),
                x: ps[i][0],
                y: ps[i][1],
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(false, true);
        for (let i = 0; i < 4; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`v${i + 1}`)]
                    .stateValues.xs[0].tree,
            ).eq(ps[i][0]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`vs[${i + 1}]`)]
                    .stateValues.xs[0].tree,
            ).eq(ps[i][0]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`v${i + 1}`)]
                    .stateValues.xs[1].tree,
            ).eq(ps[i][1]);
            expect(
                stateVariables[await resolvePathToNodeIdx(`vs[${i + 1}]`)]
                    .stateValues.xs[1].tree,
            ).eq(ps[i][1]);
        }
    });

    it("new polyline from copied vertices of polyline", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
  <polyline vertices="(-9,6) (-3,7) (4,0) (8,5)" name="pg" />
  </graph>
  <graph name="g2">
    <polyline vertices="$g1.pg.vertices" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices = [
            [-9, 6],
            [-3, 7],
            [4, 0],
            [8, 5],
        ];

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move first polyline up and to the right
        let moveX = 4;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move copied polyline up and to the left
        moveX = -7;
        moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move double copied polyline down and to the left
        moveX = -1;
        moveY = -4;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("new polyline as translated version of polyline", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput prefill="5" name="transx" />
    <mathInput prefill="7" name="transy" />
    <graph>
    <polyline vertices=" (0,0) (3,-4) (1,-6) (-5,-6) " />
    <repeat hide for="$_polyline1.vertices" valueName="x">
        <point>(<math extend="$x.x" fixed="false" />+
          <math modifyIndirectly="false" extend="$transx" />,
          <math extend="$x.y" fixed="false" />+
          <math modifyIndirectly="false" extend="$transy" />)
        </point>
    </repeat>
    <polyline vertices="$_repeat1" />
    </graph>
    <pointList extend="$_polyline2.vertices" name="ps" />

    `,
        });

        async function testPolylines({ vertices, transX, transY }) {
            let vertices2 = vertices.map((v) => [v[0] + transX, v[1] + transY]);

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_polyline1")]
                    .stateValues.numVertices,
            ).eqls(vertices.length);
            expect(
                stateVariables[await resolvePathToNodeIdx("_polyline2")]
                    .stateValues.numVertices,
            ).eqls(vertices.length);

            for (let i in vertices) {
                if (Number.isFinite(vertices[i][0])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline1")
                                ].stateValues.vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][0], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline2")
                                ].stateValues.vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][0], 1e-12);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline1")]
                            .stateValues.vertices[i][0].tree,
                    ).eq(vertices[i][0]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline2")]
                            .stateValues.vertices[i][0].tree,
                    ).eq(vertices2[i][0]);
                }
                if (Number.isFinite(vertices[i][1])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline1")
                                ].stateValues.vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][1], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline2")
                                ].stateValues.vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][1], 1e-12);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline1")]
                            .stateValues.vertices[i][1].tree,
                    ).eq(vertices[i][1]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline2")]
                            .stateValues.vertices[i][1].tree,
                    ).eq(vertices2[i][1]);
                }
            }
        }

        let vertices = [
            [0, 0],
            [3, -4],
            [1, -6],
            [-5, -6],
        ];
        let transX = 5;
        let transY = 7;

        await testPolylines({ vertices, transX, transY });

        // move points on first polyline
        vertices = [
            [1, -1],
            [-3, 2],
            [-1, 7],
            [6, 3],
        ];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: vertices,
            core,
        });

        await testPolylines({ vertices, transX, transY });

        // move points on second polyline
        let vertices2 = [
            [-3, 4],
            [1, 0],
            [9, 6],
            [2, -1],
        ];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline2"),
            pointCoords: vertices2,
            core,
        });

        vertices = vertices2.map((v) => [v[0] - transX, v[1] - transY]);

        await testPolylines({ vertices, transX, transY });

        // change translation
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("transx"),
            core,
        });
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("transy"),
            core,
        });

        transX = 2;
        transY = 10;

        await testPolylines({ vertices, transX, transY });
    });

    it("parallelogram based on three points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <setup>
        <point name="v1Fixed" extend="$parallelogram.vertex1" fixed />
        <point name="v3Fixed" extend="$parallelogram.vertex3" fixed />
      </setup>
      <polyline name="parallelogram" vertices="(1,2) (3,4) (-5,6) ($v1Fixed.x+$v3Fixed.x-$parallelogram.vertex2.x, $v1Fixed.y+$v3Fixed.y-$parallelogram.vertex2.y)" />
    </graph>
    `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("parallelogram"),
            pointCoords: { 0: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        B = [8, 9];
        D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("parallelogram"),
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];
        D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("parallelogram"),
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        // move fourth vertex
        D = [7, 0];
        B = [A[0] + C[0] - D[0], A[1] + C[1] - D[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("parallelogram"),
            pointCoords: { 3: D },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("parallelogram")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);
    });

    it("new polyline from copied vertices, some flipped", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices="(-9,6) (-3,7) (4,0) (8,5)" />
  </graph>
  <graph>
    <polyline vertices="$(_polyline1.vertex1) ($(_polyline1.vertex2[2]), $(_polyline1.vertex2[1])) $(_polyline1.vertex3) ($(_polyline1.vertex4[2]), $(_polyline1.vertex4[1]))" />
  </graph>
  `,
        });

        async function testPolylines({ vertices }) {
            let vertices2 = [...vertices];
            vertices2[1] = [vertices2[1][1], vertices2[1][0]];
            vertices2[3] = [vertices2[3][1], vertices2[3][0]];

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_polyline1")]
                    .stateValues.numVertices,
            ).eqls(vertices.length);
            expect(
                stateVariables[await resolvePathToNodeIdx("_polyline2")]
                    .stateValues.numVertices,
            ).eqls(vertices.length);

            for (let i in vertices) {
                if (Number.isFinite(vertices[i][0])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline1")
                                ].stateValues.vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][0], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline2")
                                ].stateValues.vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][0], 1e-12);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline1")]
                            .stateValues.vertices[i][0].tree,
                    ).eq(vertices[i][0]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline2")]
                            .stateValues.vertices[i][0].tree,
                    ).eq(vertices2[i][0]);
                }
                if (Number.isFinite(vertices[i][1])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline1")
                                ].stateValues.vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][1], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    await resolvePathToNodeIdx("_polyline2")
                                ].stateValues.vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][1], 1e-12);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline1")]
                            .stateValues.vertices[i][1].tree,
                    ).eq(vertices[i][1]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("_polyline2")]
                            .stateValues.vertices[i][1].tree,
                    ).eq(vertices2[i][1]);
                }
            }
        }

        let vertices = [
            [-9, 6],
            [-3, 7],
            [4, 0],
            [8, 5],
        ];

        await testPolylines({ vertices });

        // move first polyline vertices
        vertices = [
            [7, 2],
            [1, -3],
            [2, 9],
            [-4, -3],
        ];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: vertices,
            core,
        });

        await testPolylines({ vertices });

        // move second polyline vertices
        let vertices2 = [
            [-1, 9],
            [5, 7],
            [-8, 1],
            [-7, 6],
        ];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline2"),
            pointCoords: vertices2,
            core,
        });

        vertices = [...vertices2];
        vertices[1] = [vertices[1][1], vertices[1][0]];
        vertices[3] = [vertices[3][1], vertices[3][0]];

        await testPolylines({ vertices });
    });

    it("four vertex polyline based on three points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <point name="v2Fixed" extend="$_polyline1.vertex2" fixed />
    <point name="v3Fixed" extend="$_polyline1.vertex3" fixed />
  </setup>
  <graph>
  <polyline vertices="(1,2) (3,4) (-5,6) ($v3Fixed[1]+$v2Fixed[1]-$_polyline1.vertex1[1], $v3Fixed[2]+$v2Fixed[2]-$_polyline1.vertex1[2])" />
  </graph>

  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 0: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        // move second vertex
        B = [8, 9];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);

        // move fourth vertex
        D = [7, 0];
        A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 3: D },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(D);
    });

    // TODO: regain functionality of internal copies and restore these skipped tests. See issue #479.
    it.skip("fourth vertex depends on internal copy of first vertex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><point extend="$_polyline1.vertex1" name="v1" /></setup>
  <graph>
  <polyline vertices="(1,2) (3,4) (-5,6) $v1" />
  </graph>
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("_polyline1")].stateValues
                .numVertices,
        ).eq(4);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move first vertex
        A = [-4, -1];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 0: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 3: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
    });

    it.skip("first vertex depends on internal copy of fourth vertex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><point extend="$_polyline1.vertex4" name="v4" /></setup>
  <graph>
  <polyline vertices="$v4 (3,4) (-5,6) (1,2)" />
  </graph>
  
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("_polyline1")].stateValues
                .numVertices,
        ).eq(4);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move first vertex
        A = [-4, -1];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 0: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 3: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
    });

    it.skip("first vertex depends fourth, formula for fifth", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup><point extend="$_polyline1.vertex4" name="v4" /></setup>
  <graph>
  <polyline vertices="$v4 (3,4) (-5,6) (1,2) ($_polyline1.vertex1[1]+1,2)" />
  </graph>
  
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [A[0] + 1, 2];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D[0] = A[0] + 1;

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 0: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);

        // move second vertex
        B = [8, 9];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);

        // move fourth vertex
        A = [7, 0];
        D[0] = A[0] + 1;

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 3: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);

        // move fifth vertex
        D = [-5, 9];
        A[0] = D[0] - 1;

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 4: D },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("_polyline1")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
    });

    it.skip("first, fourth, seventh vertex depends on fourth, seventh, tenth", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <point extend="$P.vertex4" name="v4" />
    <point extend="$P.vertex7" name="v7" />
    <point extend="$P.vertex10" name="v10" />
  </setup>
  <graph>
  <polyline name="P" vertices="$v4 (1,2) (3,4) $v7 (5,7) (-5,7) $v10 (3,1) (5,0) (-5,-1)" />
  </graph>
  
  `,
        });

        let A = [-5, -1];
        let B = [1, 2];
        let C = [3, 4];
        let D = [5, 7];
        let E = [-5, 7];
        let F = [3, 1];
        let G = [5, 0];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move first vertex
        A = [-4, -9];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 0: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 3: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fifth vertex
        D = [-9, 1];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 4: D },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move sixth vertex
        E = [-3, 6];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 5: E },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move seventh vertex
        A = [2, -4];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 6: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move eighth vertex
        F = [6, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 7: F },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move ninth vertex
        G = [1, -8];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 8: G },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move tenth vertex
        A = [-6, 10];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 9: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);
    });

    it("first, fourth, seventh vertex depends on shifted fourth, seventh, tenth", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <polyline name="P" vertices="($P.vertex4[1]+1,$P.vertex4[2]+1) (1,2) (3,4) ($P.vertex7[1]+1,$P.vertex7[2]+1) (5,7) (-5,7) ($P.vertex10[1]+1,$P.vertex10[2]+1) (3,1) (5,0) (-5,-1)" />
  </graph>
  
  `,
        });

        let A = [-5, -1];
        let B = [1, 2];
        let C = [3, 4];
        let D = [5, 7];
        let E = [-5, 7];
        let F = [3, 1];
        let G = [5, 0];
        let A1 = [A[0] + 1, A[1] + 1];
        let A2 = [A[0] + 2, A[1] + 2];
        let A3 = [A[0] + 3, A[1] + 3];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move first vertex
        A = [-4, -9];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 0: A3 },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 3: A2 },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fifth vertex
        D = [-9, 1];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 4: D },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move sixth vertex
        E = [-3, 6];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 5: E },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move seventh vertex
        A = [2, -4];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 6: A1 },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move eighth vertex
        F = [6, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 7: F },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move ninth vertex
        G = [1, -8];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 8: G },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move tenth vertex
        A = [-6, 7];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("P"),
            pointCoords: { 9: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("P")
            ].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);
    });

    it("attract to polyline", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices=" (3,5) (-4,-1) (5,2)" />
    <point x="7" y="8">
        <attractTo>$_polyline1</attractTo>
    </point>
  </graph>
  `,
        });

        let x1 = 3,
            x2 = -4,
            x3 = 5;
        let y1 = 5,
            y2 = -1,
            y3 = 2;

        // point originally not attracted

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .coords.tree,
        ).eqls(["vector", 7, 8]);

        // move point near segment 1
        let x = 1;
        let mseg1 = (y2 - y1) / (x2 - x1);
        let y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        let px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        let py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2
        x = 3;
        let mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.4;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices
        x = 4;
        let mseg3 = (y1 - y3) / (x1 - x3);
        y = mseg3 * (x - x3) + y3 + 0.2;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        // move point just past first vertex
        x = x1 + 0.2;
        y = y1 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        // point not attracted along extension of first segment
        x = 4;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        x = -5;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 - 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        // move point just past second vertex
        x = x2 - 0.2;
        y = y2 - 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // point not attracted along extension of second segment
        x = 6;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        x = -5;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 - 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        // move polyline so point attracts to first segment
        let moveX = -3;
        let moveY = -2;

        x1 += moveX;
        x2 += moveX;
        x3 += moveX;
        y1 += moveY;
        y2 += moveY;
        y3 += moveY;

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: [
                [x1, y1],
                [x2, y2],
                [x3, y3],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move second vertex so point attracts to second segment
        moveX = -1;
        moveY = 1;

        x2 += moveX;
        y2 += moveY;

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 1: [x2, y2] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
    });

    it("constrain to polyline", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices=" (3,5) (-4,-1) (5,2)" />
    <point x="7" y="8">
        <constrainTo>$_polyline1</constrainTo>
    </point>
  </graph>
  `,
        });

        let x1 = 3,
            x2 = -4,
            x3 = 5;
        let y1 = 5,
            y2 = -1,
            y3 = 2;

        // point originally constrained

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .coords.tree,
        ).eqls(["vector", x1, y1]);

        // move point near segment 1
        let x = 1;
        let mseg1 = (y2 - y1) / (x2 - x1);
        let y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        let px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        let py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2
        x = 3;
        let mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.4;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices

        x = 4;
        let mseg3 = (y1 - y3) / (x1 - x3);
        y = mseg3 * (x - x3) + y3 + 0.2;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;
        mseg1 = (y2 - y1) / (x2 - x1);
        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point just past first vertex

        x = x1 + 0.2;
        y = y1 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        //point along extension of first segment constrained to endpoint

        x = 4;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);
        x = -5;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 - 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // move point just past second vertex

        x = x2 - 0.2;
        y = y2 - 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        //point along extension of second segment constrained to endpoint

        x = 6;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x3, 1e-6);
        expect(py).closeTo(y3, 1e-6);

        x = -5;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 - 0.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`_point1`),
            x,
            y,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // move polyline so point constrained to first segment

        let moveX = -3;
        let moveY = -5;

        x1 += moveX;
        x2 += moveX;
        x3 += moveX;
        y1 += moveY;
        y2 += moveY;
        y3 += moveY;

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: [
                [x1, y1],
                [x2, y2],
                [x3, y3],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move second vertex so point constrained to second segment

        moveX = -1;
        moveY = 8;

        x2 += moveX;
        y2 += moveY;

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("_polyline1"),
            pointCoords: { 1: [x2, y2] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[0].tree;
        py =
            stateVariables[await resolvePathToNodeIdx("_point1")].stateValues
                .xs[1].tree;

        mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
    });

    it("constrain to polyline, different scales from graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <polyline vertices="(-50,-0.02) (-40,0.07) (70,0.06) (10,-0.01)" name="p" />
    <point x="0" y="0.01" name="A">
        <constrainTo relativeToGraphScales>$p</constrainTo>
    </point>
  </graph>
  `,
        });

        let x1 = -50,
            x2 = -40,
            x3 = 70,
            x4 = 10;
        let y1 = -0.02,
            y2 = 0.07,
            y3 = 0.06,
            y4 = -0.01;

        // point originally on segment 3

        let stateVariables = await core.returnAllStateVariables(false, true);

        let mseg3 = (y4 - y3) / (x4 - x3);

        let px =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        let py =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);

        // move point near segment 1

        let mseg1 = (y2 - y1) / (x2 - x1);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`A`),
            x: -20,
            y: 0.02,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2

        let mseg2 = (y2 - y3) / (x2 - x3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`A`),
            x: 0,
            y: 0.04,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices

        mseg3 = (y4 - y3) / (x4 - x3);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`A`),
            x: -10,
            y: 0.02,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs[1]
                .tree;

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);
    });

    it("fixed polyline", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices="(1,3) (5,7) (-2,6)" name="p" fixed />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.fixed,
        ).eq(true);

        // cannot move vertices

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: [
                [4, 7],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
    });

    it("copy propIndex of vertices, dot and array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text>a</text>
    <graph>
      <polyline name="pl" vertices="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathInput name="n" /></p>

    <p><pointList extend="$pl.vertices[$n]" name="Ps" /></p>

    <p><mathList extend="$pl.vertex2[$n]" name="x" /></p>

    <p><mathList extend="$pl.vertices[2][$n]" name="xa" /></p>
    `,
        });

        let t1x = 2,
            t1y = -3;
        let t2x = 3,
            t2y = 4;
        let t3x = -3,
            t3y = 4;

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[await resolvePathToNodeIdx("Ps[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("x[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("xa[1]")]).eq(
            undefined,
        );

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("Ps[1]")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([t1x, t1y]);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues.value
                .tree,
        ).eq(t2x);
        expect(
            stateVariables[await resolvePathToNodeIdx("xa[1]")].stateValues
                .value.tree,
        ).eq(t2x);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("Ps[1]")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([t2x, t2y]);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues.value
                .tree,
        ).eq(t2y);
        expect(
            stateVariables[await resolvePathToNodeIdx("xa[1]")].stateValues
                .value.tree,
        ).eq(t2y);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("Ps[1]")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([t3x, t3y]);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("x[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("xa[1]")]).eq(
            undefined,
        );

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[await resolvePathToNodeIdx("Ps[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("x[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("xa[1]")]).eq(
            undefined,
        );
    });

    it("polyline from vector operations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" fixed>(-3,2)</math>
    <graph>
      <point name="P">(2,1)</point>
      <polyline vertices="2(2,-3)+(3,4) 3$P $P+2$m" name="polyline" />
    </graph>
 

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [7, -2],
            [6, 3],
            [-4, 5],
        ]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("polyline"),
            pointCoords: { 0: [3, 5] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [3, 5],
            [6, 3],
            [-4, 5],
        ]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("polyline"),
            pointCoords: { 1: [-9, -6] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [3, 5],
            [-9, -6],
            [-9, 2],
        ]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("polyline"),
            pointCoords: { 2: [-3, 1] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [3, 5],
            [9, -9],
            [-3, 1],
        ]);
    });

    it("polyline from vector operations, create individual vectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" fixed>(-3,2)</math>
    <graph>
      <point name="P">(2,1)</point>
      <polyline vertices="$v1 $v2 $v3" name="polyline" />
      <vector name="v1">2(2,-3)+(3,4)</vector>
      <vector name="v2">3$P</vector>
      <vector name="v3">$P+2$m</vector>

    </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [7, -2],
            [6, 3],
            [-4, 5],
        ]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("polyline"),
            pointCoords: { 0: [3, 5] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [3, 5],
            [6, 3],
            [-4, 5],
        ]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("polyline"),
            pointCoords: { 1: [-9, -6] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [3, 5],
            [-9, -6],
            [-9, 2],
        ]);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("polyline"),
            pointCoords: { 2: [-3, 1] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("polyline")
            ].stateValues.vertices.map((x) => x.map((y) => y.tree)),
        ).eqls([
            [3, 5],
            [9, -9],
            [-3, 1],
        ]);
    });

    it("draggable, vertices draggable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices="(1,3) (5,7) (-2,6)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>draggable: <booleanInput name="draggable" /> <boolean extend="$p.draggable" name="d2" /></p>
  <p>vertices draggable: <booleanInput name="verticesDraggable" /> <boolean extend="$p.verticesDraggable" name="vd2" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(false);

        // cannot move single vertex

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 0: [4, 7] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(false);

        // cannot move all vertices

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: [
                [4, 7],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(false);

        // only vertices draggable

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("verticesDraggable"),
            core,
        });

        // can move single vertex

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 0: [4, 7] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([4, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(true);

        // cannot move all vertices

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: [
                [3, 8],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([4, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(true);

        // vertices and polyline draggable

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("draggable"),
            core,
        });

        // can move single vertex

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 1: [-3, 2] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([4, 7]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([-3, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(true);

        // can move all vertices

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: [
                [3, 8],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([3, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([8, 10]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([1, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(true);

        // polyline but not vertices draggable

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("verticesDraggable"),
            core,
        });

        // cannot move single vertex

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 2: [9, 3] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([3, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([8, 10]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([1, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(false);

        // can move all vertices

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: [
                [-4, 1],
                [9, -4],
                [0, 7],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([-4, 1]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([9, -4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([0, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .draggable,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .verticesDraggable,
        ).eq(false);
    });

    it("One vertex constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)
        <constrainToGrid dx="3" dy="4" />
    </point>
    <point>(-3,4)</point>
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices = [
            [3, 5],
            [-4, -1],
            [6, 4],
            [-3, 4],
        ];

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move copied polyline up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // try to move double copied polyline down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: vertices,
            core,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("Two vertices constrained to same grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <point>(3,5)
        <constrainToGrid dx="3" dy="4" />
    </point>
    <point>(-4,-1)</point>
    <point>(5,2)
        <constrainToGrid dx="3" dy="4" />
    </point>
    <point>(-3,4)</point>
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices = [
            [3, 4],
            [-4, -1],
            [6, 4],
            [-3, 4],
        ];

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move copied polyline up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // try to move double copied polyline down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: vertices,
            core,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("Three vertices constrained to same grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <point>(3,5)
        <constrainToGrid dx="3" dy="4" />
    </point>
    <point>(-4,-1)
        <constrainToGrid dx="3" dy="4" />
    </point>
    <point>(5,2)
        <constrainToGrid dx="3" dy="4" />
    </point>
    <point>(-3,4)</point>
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />
  `,
        });

        let vertices = [
            [3, 4],
            [-3, 0],
            [6, 4],
            [-3, 4],
        ];

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: { 1: vertices[1] },
            core,
        });

        // adjust for constraint
        vertices[1] = [3, 8];

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // move copied polyline up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });

        // try to move double copied polyline down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: vertices,
            core,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, resolvePathToNodeIdx, vertices });
    });

    it("Two vertices fixed, handle rounding error from third calculated vertex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <point fixed>(1,2)</point>
    <point>(-1,-1)</point>
    <point fixed>(5,2)</point>
    <polyline vertices="$_point1 3$_point2 $_point3" name="pg" />
  </graph>
  <graph name="g2">
    <polyline extend="$g1.pg" name="pg" />
  </graph>
  <graph extend="$g2" name="g3" />

  `,
        });

        let vertices = [
            [1, 2],
            [-3, -3],
            [5, 2],
        ];

        await testPolylineCopiedTwice({ vertices, core, resolvePathToNodeIdx });

        // try to move polyline where calculated vertex can't be represented exactly

        // key point: (desiredVertex2X/3)*3 !== desiredVertex2X due to round off error
        let desiredVertex2X = 0.38823529411764707;
        let desiredVertex2Y = -2.7803926355698527;

        let moveX = desiredVertex2X - vertices[1][0];
        let moveY = desiredVertex2Y - vertices[1][1];

        let desiredVertices: number[][] = [];

        for (let i = 0; i < vertices.length; i++) {
            if (i === 1) {
                desiredVertices.push([desiredVertex2X, desiredVertex2Y]);
            } else {
                desiredVertices.push([
                    vertices[i][0] + moveX,
                    vertices[i][1] + moveY,
                ]);
            }
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: desiredVertices,
            core,
        });

        await testPolylineCopiedTwice({ vertices, core, resolvePathToNodeIdx });
    });

    it("handle bad vertices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <polyline vertices="A" name="pl" />
    </graph>
    `,
        });

        // document is created
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[await resolvePathToNodeIdx("pl")]).not.eq(
            undefined,
        );
    });

    it("length", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <polyline vertices="(0,0) (5,0) (6,1) (5,2) (0,10)" name="p" />
    </graph>
    <p>length: <number extend="$p.length" name="length" /></p>
    `,
        });

        let length = 5 + 2 * Math.sqrt(2) + Math.sqrt(25 + 64);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("length")].stateValues
                .value,
        ).eq(length);

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 1: [-8, -4] },
            core,
        });
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 2: [-8, 2] },
            core,
        });

        length = 13 + 6 + Math.sqrt(16 + 64) + Math.sqrt(25 + 64);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("length")].stateValues
                .value,
        ).eq(length);
    });

    // regression test for issue #235
    it("polyline with vertices from mathList/mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="vertexInput">(0,0),(2,2),(-1,5),(-5,1)</mathInput>
    <mathList name="vertices">$vertexInput</mathList>

    <graph name="g1">
        <polyline vertices="$vertices" name="pg" />
    </graph>
    <graph name="g2">
        <polyline extend="$g1.pg" name="pg" />
        <pointList extend="$pg.vertices" name="vs" />
    </graph>
    <graph extend="$g2" name="g3" />
      `,
        });

        let vertices = [
            [0, 0],
            [2, 2],
            [-1, 5],
            [-5, 1],
        ];

        await testPolylineCopiedTwice({ vertices, core, resolvePathToNodeIdx });

        // move individual vertex
        vertices[1] = [4, 7];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g1.pg"),
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolylineCopiedTwice({ core, vertices, resolvePathToNodeIdx });

        // move copied polyline up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g2.pg"),
            pointCoords: vertices,
            core,
        });

        await testPolylineCopiedTwice({ core, vertices, resolvePathToNodeIdx });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("g3.pg"),
            pointCoords: { 2: vertices[2] },
            core,
        });

        await testPolylineCopiedTwice({ core, vertices, resolvePathToNodeIdx });

        // change last vertices via math input
        await updateMathInputValue({
            latex: "(3,2), (-6,5), (4,9), (-2,0)",
            componentIdx: await resolvePathToNodeIdx("vertexInput"),
            core,
        });

        vertices = [
            [3, 2],
            [-6, 5],
            [4, 9],
            [-2, 0],
        ];

        await testPolylineCopiedTwice({ vertices, core, resolvePathToNodeIdx });
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
    <polyline name="A" styleNumber="1" labelIsName vertices="(0,0) (0,2) (2,0)" />
    <polyline name="B" styleNumber="2" labelIsName vertices="(2,2) (2,4) (4,2)" />
    <polyline name="C" styleNumber="5" labelIsName vertices="(4,4) (4,6) (6,4)" />
    </graph>
    <p name="ADescription">Polyline A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    `;

        async function test_items(theme: "dark" | "light") {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                theme,
            });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ADescription")]
                    .stateValues.text,
            ).eq(`Polyline A is thick ${AColor}.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("BDescription")]
                    .stateValues.text,
            ).eq(`B is a ${BShade} red polyline.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("CDescription")]
                    .stateValues.text,
            ).eq(`C is a thin ${CColor} polyline.`);
        }

        await test_items("light");
        await test_items("dark");
    });
});
