import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    movePolygon,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function testPolygonCopiedTwice({
    core,
    vertices,
    polygonName = "/pg",
    graph1Name = "/g1",
    graph2Name = "/g2",
    graph3Name = "/g3",
}: {
    core: PublicDoenetMLCore;
    vertices: (number | string)[][];
    polygonName?: string;
    graph1Name?: string;
    graph2Name?: string;
    graph3Name?: string;
}) {
    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(
        stateVariables[graph1Name + polygonName].stateValues.numVertices,
    ).eqls(vertices.length);
    expect(
        stateVariables[graph2Name + polygonName].stateValues.numVertices,
    ).eqls(vertices.length);
    expect(
        stateVariables[graph3Name + polygonName].stateValues.numVertices,
    ).eqls(vertices.length);

    for (let i in vertices) {
        if (
            typeof vertices[i][0] === "number" &&
            Number.isFinite(vertices[i][0])
        ) {
            expect(
                me
                    .fromAst(
                        stateVariables[graph1Name + polygonName].stateValues
                            .vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph2Name + polygonName].stateValues
                            .vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph3Name + polygonName].stateValues
                            .vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
        } else {
            expect(
                stateVariables[graph1Name + polygonName].stateValues.vertices[
                    i
                ][0].tree,
            ).eq(vertices[i][0]);
            expect(
                stateVariables[graph2Name + polygonName].stateValues.vertices[
                    i
                ][0].tree,
            ).eq(vertices[i][0]);
            expect(
                stateVariables[graph3Name + polygonName].stateValues.vertices[
                    i
                ][0].tree,
            ).eq(vertices[i][0]);
        }
        if (
            typeof vertices[i][1] === "number" &&
            Number.isFinite(vertices[i][1])
        ) {
            expect(
                me
                    .fromAst(
                        stateVariables[graph1Name + polygonName].stateValues
                            .vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph2Name + polygonName].stateValues
                            .vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph3Name + polygonName].stateValues
                            .vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
        } else {
            expect(
                stateVariables[graph1Name + polygonName].stateValues.vertices[
                    i
                ][1].tree,
            ).eq(vertices[i][1]);
            expect(
                stateVariables[graph2Name + polygonName].stateValues.vertices[
                    i
                ][1].tree,
            ).eq(vertices[i][1]);
            expect(
                stateVariables[graph3Name + polygonName].stateValues.vertices[
                    i
                ][1].tree,
            ).eq(vertices[i][1]);
        }
    }
}

describe("Polygon tag tests", async () => {
    it("Polygon vertices and copied points", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 5],
            [-4, -1],
            [5, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ core, vertices });

        // move individual vertex
        vertices[1] = [4, 7];

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolygonCopiedTwice({ core, vertices });

        // move copied polygon up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: vertices[2] },
            core,
        });

        await testPolygonCopiedTwice({ core, vertices });
    });

    it("Polygon macro in vertices", async () => {
        let core = await createTestCore({
            doenetML: `
  <math name="m">-1</math>
  <graph name="g1" newNamespace>
    <polygon vertices="(3,5) (-4,$(../m)) (5,2) (-3,4)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 5],
            [-4, -1],
            [5, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ core, vertices });

        // move individual vertex
        vertices[1] = [4, 7];

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolygonCopiedTwice({ core, vertices });

        // move copied polygon up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: vertices[2] },
            core,
        });

        await testPolygonCopiedTwice({ core, vertices });
    });

    it("dynamic polygon with vertices from copied map, initially zero, copied", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices: number[][] = [];
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "1",
            name: "/length",
            core,
        });
        vertices[0] = [0, 5 * Math.sin(0)];
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "2",
            name: "/length",
            core,
        });
        vertices[1] = [1, 5 * Math.sin(1)];
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "3",
            name: "/length",
            core,
        });
        vertices[2] = [2, 5 * Math.sin(2)];
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "2",
            name: "/length",
            core,
        });
        vertices.splice(2, 1);
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "0",
            name: "/length",
            core,
        });
        vertices = [];
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "5",
            name: "/length",
            core,
        });
        for (let i = 0; i < 5; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolygonCopiedTwice({ core, vertices });

        // start over and begin with big increment
        core = await createTestCore({
            doenetML: `

  <mathInput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        vertices = [];
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "10",
            name: "/length",
            core,
        });
        for (let i = 0; i < 10; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "1",
            name: "/length",
            core,
        });
        vertices = [[0, 5 * Math.sin(0)]];
        await testPolygonCopiedTwice({ core, vertices });
    });

    it("polygon with initially undefined point", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="mi" />

  <graph name="g1" newNamespace>
    <polygon vertices="(1,2) (-1,5) ($(../mi),7) (3,-5) (-4,-3)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [1, 2],
            [-1, 5],
            ["\uff3f", 7],
            [3, -5],
            [-4, -3],
        ];
        await testPolygonCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "-2",
            name: "/mi",
            core,
        });

        vertices[2][0] = -2;
        await testPolygonCopiedTwice({ core, vertices });
    });

    it(`can't move polygon based on map`, async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices: number[][] = [];
        for (let i = -5; i <= 5; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolygonCopiedTwice({ core, vertices });

        // can't move points
        await movePoint({ name: "/g1/mp1", x: 9, y: -8, core });
        await movePoint({ name: "/g1/mp9", x: -8, y: 4, core });

        // can't move polygon1
        let moveX = 3;
        let moveY = 2;

        let vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await movePolygon({ name: "/g1/pg", pointCoords: vertices2, core });

        await testPolygonCopiedTwice({ core, vertices });

        // can't move polygon2
        moveX = -5;
        moveY = 6;

        vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await movePolygon({ name: "/g2/pg", pointCoords: vertices2, core });

        await testPolygonCopiedTwice({ core, vertices });

        // can't move polygon3
        moveX = 7;
        moveY = -4;

        vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await movePolygon({ name: "/g3/pg", pointCoords: vertices2, core });

        await testPolygonCopiedTwice({ core, vertices });
    });

    it(`create moveable polygon based on map`, async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x + <math>0</math>, 5sin($x) + <math>0</math>)</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices: number[][] = [];
        for (let i = -5; i <= 5; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolygonCopiedTwice({ core, vertices });

        // can move points

        vertices[0] = [9, -8];
        vertices[8] = [-8, 4];

        await movePoint({
            name: "/g1/mp1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });
        await movePoint({
            name: "/g1/mp9",
            x: vertices[8][0],
            y: vertices[8][1],
            core,
        });

        await testPolygonCopiedTwice({ core, vertices });

        // can move polygon1
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolygon({ name: "/g1/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });

        // can move polygon2
        moveX = -5;
        moveY = 6;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });

        moveX = 7;
        moveY = -4;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });
    });

    it("copy vertices of polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polygon name="pl" vertices="(-3,-1) (1,2) (3,4) (6,-2)" />
  </graph>
  <graph>
  $pl.vertex1{assignNames="v1"}
  $pl.vertex2{assignNames="v2"}
  $pl.vertex3{assignNames="v3"}
  $pl.vertex4{assignNames="v4"}
  </graph>
  <graph>
  <copy assignNames="v1a v2a v3a v4a" prop="vertices" target="pl" />
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
            expect(stateVariables[`/v${i + 1}`].stateValues.xs[0].tree).eq(
                ps[i][0],
            );
            expect(stateVariables[`/v${i + 1}a`].stateValues.xs[0].tree).eq(
                ps[i][0],
            );
            expect(stateVariables[`/v${i + 1}`].stateValues.xs[1].tree).eq(
                ps[i][1],
            );
            expect(stateVariables[`/v${i + 1}a`].stateValues.xs[1].tree).eq(
                ps[i][1],
            );
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
                name: `/v${i + 1}`,
                x: ps[i][0],
                y: ps[i][1],
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(false, true);
        for (let i = 0; i < 4; i++) {
            expect(stateVariables[`/v${i + 1}`].stateValues.xs[0].tree).eq(
                ps[i][0],
            );
            expect(stateVariables[`/v${i + 1}a`].stateValues.xs[0].tree).eq(
                ps[i][0],
            );
            expect(stateVariables[`/v${i + 1}`].stateValues.xs[1].tree).eq(
                ps[i][1],
            );
            expect(stateVariables[`/v${i + 1}a`].stateValues.xs[1].tree).eq(
                ps[i][1],
            );
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
                name: `/v${i + 1}a`,
                x: ps[i][0],
                y: ps[i][1],
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(false, true);
        for (let i = 0; i < 4; i++) {
            expect(stateVariables[`/v${i + 1}`].stateValues.xs[0].tree).eq(
                ps[i][0],
            );
            expect(stateVariables[`/v${i + 1}a`].stateValues.xs[0].tree).eq(
                ps[i][0],
            );
            expect(stateVariables[`/v${i + 1}`].stateValues.xs[1].tree).eq(
                ps[i][1],
            );
            expect(stateVariables[`/v${i + 1}a`].stateValues.xs[1].tree).eq(
                ps[i][1],
            );
        }
    });

    it("new polygon from copied vertices of polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
  <polygon vertices="(-9,6) (-3,7) (4,0) (8,5)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <polygon vertices="$(../g1/pg.vertices)" name="pg" />
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [-9, 6],
            [-3, 7],
            [4, 0],
            [8, 5],
        ];

        await testPolygonCopiedTwice({ core, vertices });

        // move first polygon up and to the right
        let moveX = 4;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolygon({ name: "/g1/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });

        // move copied polygon up and to the left
        moveX = -7;
        moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });

        // move double copied polygon down and to the left
        moveX = -1;
        moveY = -4;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await movePolygon({ name: "/g3/pg", pointCoords: vertices, core });

        await testPolygonCopiedTwice({ core, vertices });
    });

    it("new polygon as translated version of polygon", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="5" name="transx" />
    <mathInput prefill="7" name="transy" />
    <graph>
    <polygon vertices=" (0,0) (3,-4) (1,-6) (-5,-6) " />
    <map hide>
      <template newNamespace>
        <point>(<extract prop="x"><copy target="x" fixed="false"/></extract>+
          <copy prop="value" modifyIndirectly="false" target="../transx" />,
        <extract prop="y"><copy target="x" fixed="false" /></extract>+
        <copy prop="value" modifyIndirectly="false" target="../transy" />)
        </point>
      </template>
      <sources alias="x">
        $_polygon1.vertices{name="vs"}
      </sources>
    </map>
    <polygon vertices="$_map1" />
    </graph>
    $_polygon2.vertices{assignNames="p1 p2 p3 p4"}

    `,
        });

        async function testPolygons({ vertices, transX, transY }) {
            let vertices2 = vertices.map((v) => [v[0] + transX, v[1] + transY]);

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/_polygon1"].stateValues.numVertices).eqls(
                vertices.length,
            );
            expect(stateVariables["/_polygon2"].stateValues.numVertices).eqls(
                vertices.length,
            );

            for (let i in vertices) {
                if (Number.isFinite(vertices[i][0])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon1"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][0], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon2"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][0], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polygon1"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices[i][0]);
                    expect(
                        stateVariables["/_polygon2"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices2[i][0]);
                }
                if (Number.isFinite(vertices[i][1])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon1"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][1], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon2"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][1], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polygon1"].stateValues.vertices[i][1]
                            .tree,
                    ).eq(vertices[i][1]);
                    expect(
                        stateVariables["/_polygon2"].stateValues.vertices[i][1]
                            .tree,
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

        await testPolygons({ vertices, transX, transY });

        // move points on first polygon
        vertices = [
            [1, -1],
            [-3, 2],
            [-1, 7],
            [6, 3],
        ];

        await movePolygon({ name: "/_polygon1", pointCoords: vertices, core });

        await testPolygons({ vertices, transX, transY });

        // move points on second polygon
        let vertices2 = [
            [-3, 4],
            [1, 0],
            [9, 6],
            [2, -1],
        ];

        await movePolygon({ name: "/_polygon2", pointCoords: vertices2, core });

        vertices = vertices2.map((v) => [v[0] - transX, v[1] - transY]);

        await testPolygons({ vertices, transX, transY });

        // change translation
        await updateMathInputValue({
            latex: "2",
            name: "/transx",
            core,
        });
        await updateMathInputValue({
            latex: "10",
            name: "/transy",
            core,
        });

        transX = 2;
        transY = 10;

        await testPolygons({ vertices, transX, transY });
    });

    it("parallelogram based on three points", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <polygon name="parallelogram" vertices="(1,2) (3,4) (-5,6) ($(parallelogram.vertexX1_1{fixed})+$(parallelogram.vertexX3_1{fixed})-$(parallelogram.vertexX2_1), $(parallelogram.vertexX1_2{fixed})+$(parallelogram.vertexX3_2{fixed})-$(parallelogram.vertexX2_2))" />
    </graph>
    `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        await movePolygon({
            name: "/parallelogram",
            pointCoords: { 0: A },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        B = [8, 9];
        D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        await movePolygon({
            name: "/parallelogram",
            pointCoords: { 1: B },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];
        D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        await movePolygon({
            name: "/parallelogram",
            pointCoords: { 2: C },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move fourth vertex
        D = [7, 0];
        B = [A[0] + C[0] - D[0], A[1] + C[1] - D[1]];

        await movePolygon({
            name: "/parallelogram",
            pointCoords: { 3: D },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/parallelogram"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);
    });

    it("new polygon from copied vertices, some flipped", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polygon vertices="(-9,6) (-3,7) (4,0) (8,5)" />
  </graph>
  <graph>
    <polygon vertices="$(_polygon1.vertex1) ($(_polygon1.vertexX2_2), $(_polygon1.vertexX2_1)) $(_polygon1.vertex3) ($(_polygon1.vertexX4_2), $(_polygon1.vertexX4_1))" />
  </graph>
  `,
        });

        async function testPolygons({ vertices }) {
            let vertices2 = [...vertices];
            vertices2[1] = [vertices2[1][1], vertices2[1][0]];
            vertices2[3] = [vertices2[3][1], vertices2[3][0]];

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/_polygon1"].stateValues.numVertices).eqls(
                vertices.length,
            );
            expect(stateVariables["/_polygon2"].stateValues.numVertices).eqls(
                vertices.length,
            );

            for (let i in vertices) {
                if (Number.isFinite(vertices[i][0])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon1"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][0], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon2"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][0], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polygon1"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices[i][0]);
                    expect(
                        stateVariables["/_polygon2"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices2[i][0]);
                }
                if (Number.isFinite(vertices[i][1])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon1"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][1], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polygon2"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][1], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polygon1"].stateValues.vertices[i][1]
                            .tree,
                    ).eq(vertices[i][1]);
                    expect(
                        stateVariables["/_polygon2"].stateValues.vertices[i][1]
                            .tree,
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

        await testPolygons({ vertices });

        // move first polygon vertices
        vertices = [
            [7, 2],
            [1, -3],
            [2, 9],
            [-4, -3],
        ];

        await movePolygon({ name: "/_polygon1", pointCoords: vertices, core });

        await testPolygons({ vertices });

        // move second polygon vertices
        let vertices2 = [
            [-1, 9],
            [5, 7],
            [-8, 1],
            [-7, 6],
        ];

        await movePolygon({ name: "/_polygon2", pointCoords: vertices2, core });

        vertices = [...vertices2];
        vertices[1] = [vertices[1][1], vertices[1][0]];
        vertices[3] = [vertices[3][1], vertices[3][0]];

        await testPolygons({ vertices });
    });

    it("four vertex polygon based on three points", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polygon vertices="(1,2) (3,4) (-5,6) ($(_polygon1.vertexX3_1{fixed})+$(_polygon1.vertexX2_1{fixed})-$(_polygon1.vertexX1_1), $(_polygon1.vertexX3_2{fixed})+$(_polygon1.vertexX2_2{fixed})-$(_polygon1.vertexX1_2))" />
  </graph>

  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await movePolygon({ name: "/_polygon1", pointCoords: { 0: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move second vertex
        B = [8, 9];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await movePolygon({ name: "/_polygon1", pointCoords: { 1: B }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await movePolygon({ name: "/_polygon1", pointCoords: { 2: C }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move fourth vertex
        D = [7, 0];
        A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];

        await movePolygon({ name: "/_polygon1", pointCoords: { 3: D }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);
    });

    it("fourth vertex depends on internal copy of first vertex", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polygon vertices="(1,2) (3,4) (-5,6) $(_polygon1.vertex1{createComponentOfType='point'})" />
  </graph>
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/_polygon1"].stateValues.numVertices).eq(4);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move first vertex
        A = [-4, -1];

        await movePolygon({ name: "/_polygon1", pointCoords: { 0: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolygon({ name: "/_polygon1", pointCoords: { 1: B }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolygon({ name: "/_polygon1", pointCoords: { 2: C }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];
        await movePolygon({ name: "/_polygon1", pointCoords: { 3: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
    });

    it("first vertex depends on internal copy of fourth vertex", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polygon vertices="$(_polygon1.vertex4{ createComponentOfType='point' }) (3,4) (-5,6) (1,2)" />
  </graph>
  
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/_polygon1"].stateValues.numVertices).eq(4);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move first vertex
        A = [-4, -1];

        await movePolygon({ name: "/_polygon1", pointCoords: { 0: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolygon({ name: "/_polygon1", pointCoords: { 1: B }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolygon({ name: "/_polygon1", pointCoords: { 2: C }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];

        await movePolygon({ name: "/_polygon1", pointCoords: { 3: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
    });

    it("first vertex depends fourth, formula for fifth", async () => {
        let core = await createTestCore({
            doenetML: `
  <text>a</text>
  <graph>
  <polygon vertices="$(_polygon1.vertex4{createComponentOfType='point'}) (3,4) (-5,6) (1,2) ($(_polygon1.vertexX1_1)+1,2)" />
  </graph>
  $_polygon1.vertices{assignNames="p1 p2 p3 p4 p5"}
  
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [A[0] + 1, 2];

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D[0] = A[0] + 1;

        await movePolygon({ name: "/_polygon1", pointCoords: { 0: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move second vertex
        B = [8, 9];

        await movePolygon({ name: "/_polygon1", pointCoords: { 1: B }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];

        await movePolygon({ name: "/_polygon1", pointCoords: { 2: C }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move fourth vertex
        A = [7, 0];
        D[0] = A[0] + 1;

        await movePolygon({ name: "/_polygon1", pointCoords: { 3: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move fifth vertex
        D = [-5, 9];
        A[0] = D[0] - 1;

        await movePolygon({ name: "/_polygon1", pointCoords: { 4: D }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polygon1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);
    });

    it("first, fourth, seventh vertex depends on fourth, seventh, tenth", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polygon name="P" vertices="$(P.vertex4{createComponentOfType='point'}) (1,2) (3,4) $(P.vertex7{createComponentOfType='point'}) (5,7) (-5,7) $(P.vertex10{createComponentOfType='point'}) (3,1) (5,0) (-5,-1)" />
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
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move first vertex
        A = [-4, -9];

        await movePolygon({ name: "/P", pointCoords: { 0: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolygon({ name: "/P", pointCoords: { 1: B }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolygon({ name: "/P", pointCoords: { 2: C }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];

        await movePolygon({ name: "/P", pointCoords: { 3: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fifth vertex
        D = [-9, 1];

        await movePolygon({ name: "/P", pointCoords: { 4: D }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move sixth vertex
        E = [-3, 6];

        await movePolygon({ name: "/P", pointCoords: { 5: E }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move seventh vertex
        A = [2, -4];

        await movePolygon({ name: "/P", pointCoords: { 6: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move eighth vertex
        F = [6, 7];

        await movePolygon({ name: "/P", pointCoords: { 7: F }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move ninth vertex
        G = [1, -8];

        await movePolygon({ name: "/P", pointCoords: { 8: G }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move tenth vertex
        A = [-6, 10];

        await movePolygon({ name: "/P", pointCoords: { 9: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);
    });

    it("first, fourth, seventh vertex depends on shifted fourth, seventh, tenth", async () => {
        let core = await createTestCore({
            doenetML: `
  <text>a</text>
  <graph>
  <polygon name="P" vertices="($(P.vertexX4_1)+1,$(P.vertexX4_2)+1) (1,2) (3,4) ($(P.vertexX7_1)+1,$(P.vertexX7_2)+1) (5,7) (-5,7) ($(P.vertexX10_1)+1,$(P.vertexX10_2)+1) (3,1) (5,0) (-5,-1)" />
  </graph>
  $P.vertices{assignNames="p1 p2 p3 p4 p5 p6 p7 p8 p9 p10"}
  
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
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move first vertex
        A = [-4, -9];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolygon({ name: "/P", pointCoords: { 0: A3 }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await movePolygon({ name: "/P", pointCoords: { 1: B }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await movePolygon({ name: "/P", pointCoords: { 2: C }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolygon({ name: "/P", pointCoords: { 3: A2 }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move fifth vertex
        D = [-9, 1];

        await movePolygon({ name: "/P", pointCoords: { 4: D }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move sixth vertex
        E = [-3, 6];

        await movePolygon({ name: "/P", pointCoords: { 5: E }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move seventh vertex
        A = [2, -4];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolygon({ name: "/P", pointCoords: { 6: A1 }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move eighth vertex
        F = [6, 7];

        await movePolygon({ name: "/P", pointCoords: { 7: F }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move ninth vertex
        G = [1, -8];

        await movePolygon({ name: "/P", pointCoords: { 8: G }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);

        // move tenth vertex
        A = [-6, 7];
        A1 = [A[0] + 1, A[1] + 1];
        A2 = [A[0] + 2, A[1] + 2];
        A3 = [A[0] + 3, A[1] + 3];

        await movePolygon({ name: "/P", pointCoords: { 9: A }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls(A3);
        expect(
            stateVariables["/P"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls(B);
        expect(
            stateVariables["/P"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls(C);
        expect(
            stateVariables["/P"].stateValues.vertices[3].map((x) => x.tree),
        ).eqls(A2);
        expect(
            stateVariables["/P"].stateValues.vertices[4].map((x) => x.tree),
        ).eqls(D);
        expect(
            stateVariables["/P"].stateValues.vertices[5].map((x) => x.tree),
        ).eqls(E);
        expect(
            stateVariables["/P"].stateValues.vertices[6].map((x) => x.tree),
        ).eqls(A1);
        expect(
            stateVariables["/P"].stateValues.vertices[7].map((x) => x.tree),
        ).eqls(F);
        expect(
            stateVariables["/P"].stateValues.vertices[8].map((x) => x.tree),
        ).eqls(G);
        expect(
            stateVariables["/P"].stateValues.vertices[9].map((x) => x.tree),
        ).eqls(A);
    });

    it("attract to polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polygon vertices=" (3,5) (-4,-1) (5,2)" />
    <point x="7" y="8">
      <constraints>
        <attractTo>$_polygon1</attractTo>
      </constraints>
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
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            7,
            8,
        ]);

        // move point near segment 1
        let x = 1;
        let mseg1 = (y2 - y1) / (x2 - x1);
        let y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        let px = stateVariables["/_point1"].stateValues.xs[0].tree;
        let py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2
        x = 3;
        let mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.4;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices
        x = 4;
        let mseg3 = (y1 - y3) / (x1 - x3);
        y = mseg3 * (x - x3) + y3 + 0.2;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);

        // move point just past first vertex
        x = x1 + 0.2;
        y = y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        // point not attracted along extension of first segment
        x = 4;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        x = -5;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        // move point just past second vertex
        x = x2 - 0.2;
        y = y2 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // point not attracted along extension of second segment
        x = 6;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        x = -5;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        // move polygon so point attracts to first segment
        let moveX = -3;
        let moveY = -2;

        x1 += moveX;
        x2 += moveX;
        x3 += moveX;
        y1 += moveY;
        y2 += moveY;
        y3 += moveY;

        await movePolygon({
            name: "/_polygon1",
            pointCoords: [
                [x1, y1],
                [x2, y2],
                [x3, y3],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move second vertex so point attracts to second segment
        moveX = -1;
        moveY = 1;

        x2 += moveX;
        y2 += moveY;

        await movePolygon({
            name: "/_polygon1",
            pointCoords: { 1: [x2, y2] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
    });

    it("constrain to polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polygon vertices=" (3,5) (-4,-1) (5,2)" />
    <point x="7" y="8">
      <constraints>
        <constrainTo>$_polygon1</constrainTo>
      </constraints>
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
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);

        // move point near segment 1
        let x = 1;
        let mseg1 = (y2 - y1) / (x2 - x1);
        let y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        let px = stateVariables["/_point1"].stateValues.xs[0].tree;
        let py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2
        x = 3;
        let mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.4;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices

        x = 4;
        let mseg3 = (y1 - y3) / (x1 - x3);
        y = mseg3 * (x - x3) + y3 + 0.2;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;
        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);

        // move point just past first vertex

        x = x1 + 0.2;
        y = y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        //point along extension of first segment constrained to endpoint

        x = 4;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);
        x = -5;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // move point just past second vertex

        x = x2 - 0.2;
        y = y2 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        //point along extension of second segment constrained to endpoint

        x = 6;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x3, 1e-6);
        expect(py).closeTo(y3, 1e-6);

        x = -5;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // move polygon so point constrained to first segment

        let moveX = -3;
        let moveY = -5;

        x1 += moveX;
        x2 += moveX;
        x3 += moveX;
        y1 += moveY;
        y2 += moveY;
        y3 += moveY;

        await movePolygon({
            name: "/_polygon1",
            pointCoords: [
                [x1, y1],
                [x2, y2],
                [x3, y3],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move second vertex so point constrained to second segment

        moveX = -1;
        moveY = 8;

        x2 += moveX;
        y2 += moveY;

        await movePolygon({
            name: "/_polygon1",
            pointCoords: { 1: [x2, y2] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
    });

    it("constrain to polygon, different scales from graph", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <polygon vertices="(-50,-0.02) (-40,0.07) (70,0.06) (10,-0.01)" name="p" />
    <point x="0" y="0.01" name="A">
      <constraints>
        <constrainTo relativeToGraphScales>$p</constrainTo>
      </constraints>
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

        let px = stateVariables["/A"].stateValues.xs[0].tree;
        let py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);

        // move point near segment 1

        let mseg1 = (y2 - y1) / (x2 - x1);

        await movePoint({ name: `/A`, x: -20, y: 0.02, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/A"].stateValues.xs[0].tree;
        py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2

        let mseg2 = (y2 - y3) / (x2 - x3);

        await movePoint({ name: `/A`, x: 0, y: 0.04, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/A"].stateValues.xs[0].tree;
        py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment 4

        let mseg4 = (y4 - y1) / (x4 - x1);

        await movePoint({ name: `/A`, x: -10, y: 0.02, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/A"].stateValues.xs[0].tree;
        py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg4 * (px - x4) + y4, 1e-6);
    });

    it("constrain to interior of polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polygon vertices=" (3,5) (-4,-1) (5,2)" filled />
    <point x="7" y="8">
      <constraints>
        <constrainToInterior>$_polygon1</constrainToInterior>
      </constraints>
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);

        // move point near segment 1, outside polygon

        let x = 1;
        let mseg1 = (y2 - y1) / (x2 - x1);
        let y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        let px = stateVariables["/_point1"].stateValues.xs[0].tree;
        let py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2, but inside polygon

        x = 3;
        y = 1.5;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(3, 1e-12);
        expect(py).closeTo(1.5, 1e-12);

        // move point near segment between first and last vertices, but outside polygon

        x = 4;
        let mseg3 = (y1 - y3) / (x1 - x3);
        y = mseg3 * (x - x3) + y3 + 0.2;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);

        // move point just past first vertex

        x = x1 + 0.2;
        y = y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        // point along extension of first segment constrained to endpoint

        x = 4;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        x = -5;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // move point just past second vertex

        x = x2 - 0.2;
        y = y2 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // point along extension of second segment constrained to endpoint

        x = 6;
        let mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x3, 1e-6);
        expect(py).closeTo(y3, 1e-6);

        // repeat for other side of second segment
        let xsave, ysave;

        x = -5;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 - 0.3;

        await movePoint({ name: `/_point1`, x, y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // save point coordinates, as is last time move point
        xsave = x2;
        ysave = y2;

        // move polygon so point constrained to first segment

        let moveX = -3;
        let moveY = -5;

        x1 += moveX;
        x2 += moveX;
        x3 += moveX;
        y1 += moveY;
        y2 += moveY;
        y3 += moveY;

        await movePolygon({
            name: "/_polygon1",
            pointCoords: [
                [x1, y1],
                [x2, y2],
                [x3, y3],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move second vertex so point constrained to second segment

        moveX = -1;
        moveY = 8;

        x2 += moveX;
        y2 += moveY;

        await movePolygon({
            name: "/_polygon1",
            pointCoords: { 1: [x2, y2] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move third vertex so point is in interior

        x3 = -4;
        y3 = -6;

        await movePolygon({
            name: "/_polygon1",
            pointCoords: { 2: [x3, y3] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        // point moves to coordinates where last moved the point
        expect(px).closeTo(xsave, 1e-6);
        expect(py).closeTo(ysave, 1e-6);
    });

    it("constrain to interior of non-simple polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polygon vertices="(2,0) (8,0) (8,8) (0,8) (0,4) (6,4) (6,2) (4,2) (4,6) (2,6)" filled name="pg" />
    <point x="7" y="6" name="P">
      <constraints>
        <constrainToInterior>$pg</constrainToInterior>
      </constraints>
    </point>
  </graph>
  `,
        });

        // point originally in interior

        let stateVariables = await core.returnAllStateVariables(false, true);
        let px = stateVariables["/P"].stateValues.xs[0].tree;
        let py = stateVariables["/P"].stateValues.xs[1].tree;
        expect(px).closeTo(7, 1e-12);
        expect(py).closeTo(6, 1e-12);

        // move point above polygon

        await movePoint({ name: `/P`, x: 3, y: 10, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        px = stateVariables["/P"].stateValues.xs[0].tree;
        py = stateVariables["/P"].stateValues.xs[1].tree;
        expect(px).closeTo(3, 1e-12);
        expect(py).closeTo(8, 1e-12);

        // move point inside doubly wound region

        await movePoint({ name: `/P`, x: 3, y: 5, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/P"].stateValues.xs[0].tree;
        py = stateVariables["/P"].stateValues.xs[1].tree;
        expect(px).closeTo(3, 1e-12);
        expect(py).closeTo(5, 1e-12);

        // attempt to move point inside zero wound region

        await movePoint({ name: `/P`, x: 4.9, y: 3, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        px = stateVariables["/P"].stateValues.xs[0].tree;
        py = stateVariables["/P"].stateValues.xs[1].tree;
        expect(px).closeTo(4, 1e-12);
        expect(py).closeTo(3, 1e-12);
    });

    it("fixed polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polygon vertices="(1,3) (5,7) (-2,6)" name="p" fixed />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(stateVariables["/p"].stateValues.fixed).eq(true);

        // cannot move vertices

        await movePolygon({
            name: "/p",
            pointCoords: [
                [4, 7],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
    });

    it("copy propIndex of vertices, dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>
    <graph>
      <polygon name="pl" vertices="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathInput name="n" /></p>

    <p>$pl.vertices[$n]{assignNames="P1 P2 P3"}</p>

    <p>$pl.vertex2[$n]{assignNames="x"}</p>

    <p>$pl.vertices[2][$n]{assignNames="xa"}</p>
    `,
        });

        let t1x = 2,
            t1y = -3;
        let t2x = 3,
            t2y = 4;
        let t3x = -3,
            t3y = 4;

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P1"]).eq(undefined);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);

        await updateMathInputValue({ latex: "1", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            t1x,
            t1y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"].stateValues.value.tree).eq(t2x);
        expect(stateVariables["/xa"].stateValues.value.tree).eq(t2x);

        await updateMathInputValue({ latex: "2", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            t2x,
            t2y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"].stateValues.value.tree).eq(t2y);
        expect(stateVariables["/xa"].stateValues.value.tree).eq(t2y);

        await updateMathInputValue({ latex: "3", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            t3x,
            t3y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);

        await updateMathInputValue({ latex: "4", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P1"]).eq(undefined);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);
    });

    it("polygon from vector operations", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="m" fixed>(-3,2)</math>
    <graph>
      <point name="P">(2,1)</point>
      <polygon vertices="2(2,-3)+(3,4) 3$P $P+2$m" name="polygon" />
    </graph>
 

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [7, -2],
            [6, 3],
            [-4, 5],
        ]);

        await movePolygon({
            name: "/polygon",
            pointCoords: { 0: [3, 5] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [6, 3],
            [-4, 5],
        ]);

        await movePolygon({
            name: "/polygon",
            pointCoords: { 1: [-9, -6] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [-9, -6],
            [-9, 2],
        ]);

        await movePolygon({
            name: "/polygon",
            pointCoords: { 2: [-3, 1] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [9, -9],
            [-3, 1],
        ]);
    });

    it("polygon from vector operations, create individual vectors", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="m" fixed>(-3,2)</math>
    <graph>
      <point name="P">(2,1)</point>
      <polygon vertices="$v1 $v2 $v3" name="polygon" />
      <vector name="v1">2(2,-3)+(3,4)</vector>
      <vector name="v2">3$P</vector>
      <vector name="v3">$P+2$m</vector>

    </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [7, -2],
            [6, 3],
            [-4, 5],
        ]);

        await movePolygon({
            name: "/polygon",
            pointCoords: { 0: [3, 5] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [6, 3],
            [-4, 5],
        ]);

        await movePolygon({
            name: "/polygon",
            pointCoords: { 1: [-9, -6] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [-9, -6],
            [-9, 2],
        ]);

        await movePolygon({
            name: "/polygon",
            pointCoords: { 2: [-3, 1] },
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/polygon"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [9, -9],
            [-3, 1],
        ]);
    });

    it("changing styles", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="blue" fillColor="blue" lineWidth="2" lineStyle="solid" />
        <styleDefinition styleNumber="2" lineColor="red" fillColor="green" lineWidth="2" lineStyle="solid" />

        <styleDefinition styleNumber="3" lineColor="blue" fillColor="blue" lineWidth="5" lineStyle="solid" />
        <styleDefinition styleNumber="4" lineColor="red" fillColor="green" lineWidth="1" lineStyle="dotted" />
        </styleDefinitions>
    </setup>

    <graph>
      <polygon vertices="(0,0) (0,2) (2,0)" name="p1" />
      <polygon vertices="(3,0) (3,2) (5,0)" name="p2" filled />
      <polygon vertices="(0,3) (0,5) (2,3)" name="p3" styleNumber="2" />
      <polygon vertices="(3,3) (3,5) (5,3)" name="p4" styleNumber="2" filled />

      <polygon vertices="(0,-10) (0,-8) (2,-10)" name="p5" styleNumber="3"/>
      <polygon vertices="(3,-10) (3,-8) (5,-10)" name="p6" styleNumber="3" filled />
      <polygon vertices="(0,-7) (0,-5) (2,-7)" name="p7" styleNumber="4" />
      <polygon vertices="(3,-7) (3,-5) (5,-7)" name="p8" styleNumber="4" filled />

    </graph>

    <p>First polygon is $p1.styleDescription{assignNames="st1"}.  It is a $p1.styleDescriptionWithNoun{assignNames="stn1"}. 
      Its border is $p1.borderStyleDescription{assignNames="bst1"}.  Its fill is $p1.fillStyleDescription{assignNames="fst1"}.
    </p>
    <p>Second polygon is $p2.styleDescription{assignNames="st2"}.  It is a $p2.styleDescriptionWithNoun{assignNames="stn2"}. 
      Its border is $p2.borderStyleDescription{assignNames="bst2"}.  Its fill is $p2.fillStyleDescription{assignNames="fst2"}.
    </p>
    <p>Third polygon is $p3.styleDescription{assignNames="st3"}.  It is a $p3.styleDescriptionWithNoun{assignNames="stn3"}. 
      Its border is $p3.borderStyleDescription{assignNames="bst3"}.  Its fill is $p3.fillStyleDescription{assignNames="fst3"}.
    </p>
    <p>Fourth polygon is $p4.styleDescription{assignNames="st4"}.  It is a $p4.styleDescriptionWithNoun{assignNames="stn4"}. 
      Its border is $p4.borderStyleDescription{assignNames="bst4"}.  Its fill is $p4.fillStyleDescription{assignNames="fst4"}.
    </p>

    <p>Fifth polygon is $p5.styleDescription{assignNames="st5"}.  It is a $p5.styleDescriptionWithNoun{assignNames="stn5"}. 
      Its border is $p5.borderStyleDescription{assignNames="bst5"}.  Its fill is $p5.fillStyleDescription{assignNames="fst5"}.
    </p>
    <p>Sixth polygon is $p6.styleDescription{assignNames="st6"}.  It is a $p6.styleDescriptionWithNoun{assignNames="stn6"}. 
      Its border is $p6.borderStyleDescription{assignNames="bst6"}.  Its fill is $p6.fillStyleDescription{assignNames="fst6"}.
    </p>
    <p>Seventh polygon is $p7.styleDescription{assignNames="st7"}.  It is a $p7.styleDescriptionWithNoun{assignNames="stn7"}. 
      Its border is $p7.borderStyleDescription{assignNames="bst7"}.  Its fill is $p7.fillStyleDescription{assignNames="fst7"}.
    </p>
    <p>Eighth polygon is $p8.styleDescription{assignNames="st8"}.  It is a $p8.styleDescriptionWithNoun{assignNames="stn8"}. 
      Its border is $p8.borderStyleDescription{assignNames="bst8"}.  Its fill is $p8.fillStyleDescription{assignNames="fst8"}.
    </p>


    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/st1"].stateValues.text).eq("blue");
        expect(stateVariables["/stn1"].stateValues.text).eq("blue polygon");
        expect(stateVariables["/bst1"].stateValues.text).eq("blue");
        expect(stateVariables["/fst1"].stateValues.text).eq("unfilled");

        expect(stateVariables["/st2"].stateValues.text).eq("filled blue");
        expect(stateVariables["/stn2"].stateValues.text).eq(
            "filled blue polygon",
        );
        expect(stateVariables["/bst2"].stateValues.text).eq("blue");
        expect(stateVariables["/fst2"].stateValues.text).eq("blue");

        expect(stateVariables["/st3"].stateValues.text).eq("red");
        expect(stateVariables["/stn3"].stateValues.text).eq("red polygon");
        expect(stateVariables["/bst3"].stateValues.text).eq("red");
        expect(stateVariables["/fst3"].stateValues.text).eq("unfilled");

        expect(stateVariables["/st4"].stateValues.text).eq(
            "filled green with red border",
        );
        expect(stateVariables["/stn4"].stateValues.text).eq(
            "filled green polygon with a red border",
        );
        expect(stateVariables["/bst4"].stateValues.text).eq("red");
        expect(stateVariables["/fst4"].stateValues.text).eq("green");

        expect(stateVariables["/st5"].stateValues.text).eq("thick blue");
        expect(stateVariables["/stn5"].stateValues.text).eq(
            "thick blue polygon",
        );
        expect(stateVariables["/bst5"].stateValues.text).eq("thick blue");
        expect(stateVariables["/fst5"].stateValues.text).eq("unfilled");

        expect(stateVariables["/st6"].stateValues.text).eq(
            "filled blue with thick border",
        );
        expect(stateVariables["/stn6"].stateValues.text).eq(
            "filled blue polygon with a thick border",
        );
        expect(stateVariables["/bst6"].stateValues.text).eq("thick blue");
        expect(stateVariables["/fst6"].stateValues.text).eq("blue");

        expect(stateVariables["/st7"].stateValues.text).eq("thin dotted red");
        expect(stateVariables["/stn7"].stateValues.text).eq(
            "thin dotted red polygon",
        );
        expect(stateVariables["/bst7"].stateValues.text).eq("thin dotted red");
        expect(stateVariables["/fst7"].stateValues.text).eq("unfilled");

        expect(stateVariables["/st8"].stateValues.text).eq(
            "filled green with thin dotted red border",
        );
        expect(stateVariables["/stn8"].stateValues.text).eq(
            "filled green polygon with a thin dotted red border",
        );
        expect(stateVariables["/bst8"].stateValues.text).eq("thin dotted red");
        expect(stateVariables["/fst8"].stateValues.text).eq("green");
    });

    it("draggable, vertices draggable", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polygon vertices="(1,3) (5,7) (-2,6)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>draggable: <booleaninput name="draggable" /> <boolean copySource="p.draggable" name="d2" /></p>
  <p>vertices draggable: <booleaninput name="verticesDraggable" /> <boolean copySource="p.verticesDraggable" name="vd2" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(stateVariables["/p"].stateValues.draggable).eq(false);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);

        // cannot move single vertex

        await movePolygon({ name: "/p", pointCoords: { 0: [4, 7] }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(stateVariables["/p"].stateValues.draggable).eq(false);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);

        // cannot move all vertices

        await movePolygon({
            name: "/p",
            pointCoords: [
                [4, 7],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([1, 3]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(stateVariables["/p"].stateValues.draggable).eq(false);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);

        // only vertices draggable

        await updateBooleanInputValue({
            boolean: true,
            name: "/verticesDraggable",
            core,
        });

        // can move single vertex

        await movePolygon({ name: "/p", pointCoords: { 0: [4, 7] }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([4, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(stateVariables["/p"].stateValues.draggable).eq(false);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);

        // cannot move all vertices

        await movePolygon({
            name: "/p",
            pointCoords: [
                [3, 8],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([4, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([5, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(stateVariables["/p"].stateValues.draggable).eq(false);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);

        // vertices and polygon draggable

        await updateBooleanInputValue({
            boolean: true,
            name: "/draggable",
            core,
        });

        // can move single vertex

        await movePolygon({ name: "/p", pointCoords: { 1: [-3, 2] }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([4, 7]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([-3, 2]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([-2, 6]);
        expect(stateVariables["/p"].stateValues.draggable).eq(true);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);

        // can move all vertices

        await movePolygon({
            name: "/p",
            pointCoords: [
                [3, 8],
                [8, 10],
                [1, 9],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([3, 8]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([8, 10]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([1, 9]);
        expect(stateVariables["/p"].stateValues.draggable).eq(true);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);

        // polygon but not vertices draggable

        await updateBooleanInputValue({
            boolean: false,
            name: "/verticesDraggable",
            core,
        });

        // cannot move single vertex

        await movePolygon({ name: "/p", pointCoords: { 2: [9, 3] }, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([3, 8]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([8, 10]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([1, 9]);
        expect(stateVariables["/p"].stateValues.draggable).eq(true);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);

        // can move all vertices

        await movePolygon({
            name: "/p",
            pointCoords: [
                [-4, 1],
                [9, -4],
                [0, 7],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((x) => x.tree),
        ).eqls([-4, 1]);
        expect(
            stateVariables["/p"].stateValues.vertices[1].map((x) => x.tree),
        ).eqls([9, -4]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((x) => x.tree),
        ).eqls([0, 7]);
        expect(stateVariables["/p"].stateValues.draggable).eq(true);
        expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });

    it("One vertex constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 5],
            [-4, -1],
            [6, 4],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ core, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolygonCopiedTwice({ core, vertices });

        // move copied polygon up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolygonCopiedTwice({ core, vertices });

        // try to move double copied polygon down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g3/pg", pointCoords: vertices, core });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolygonCopiedTwice({ core, vertices });
    });

    it("Two vertices constrained to same grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,5)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-4,-1)</point>
    <point>(5,2)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 4],
            [-4, -1],
            [6, 4],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ core, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: vertices[1] },
            core,
        });

        await testPolygonCopiedTwice({ core, vertices });

        // move copied polygon up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolygonCopiedTwice({ core, vertices });

        // try to move double copied polygon down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g3/pg", pointCoords: vertices, core });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolygonCopiedTwice({ core, vertices });
    });

    it("Three vertices constrained to same grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,5)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-4,-1)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(5,2)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 4],
            [-3, 0],
            [6, 4],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ core, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: vertices[1] },
            core,
        });

        // adjust for constraint
        vertices[1] = [3, 8];

        await testPolygonCopiedTwice({ core, vertices });

        // move copied polygon up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g2/pg", pointCoords: vertices, core });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolygonCopiedTwice({ core, vertices });

        // try to move double copied polygon down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({ name: "/g3/pg", pointCoords: vertices, core });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolygonCopiedTwice({ core, vertices });
    });

    it("Two vertices fixed, handle rounding error from third calculated vertex", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point fixed>(1,2)</point>
    <point>(-1,-1)</point>
    <point fixed>(5,2)</point>
    <polygon vertices="$_point1 3$_point2 $_point3" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}

  `,
        });

        let vertices = [
            [1, 2],
            [-3, -3],
            [5, 2],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // try to move polygon where calculated vertex can't be represented exactly

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

        await movePolygon({
            name: "/g2/pg",
            pointCoords: desiredVertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("handle bad vertices", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <polygon vertices="A" name="pl" />
    </graph>
    `,
        });

        // document is created
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pl"]).not.eq(undefined);
    });

    it("area and perimeter", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <polygon vertices="(0,0) (5,0) (6,1) (5,2) (0,10)" name="p" />
    </graph>
    <p>Area: <number copySource="p.area" name="area" /></p>
    <p>Perimeter: <number copySource="p.perimeter" name="perimeter" /></p>
    `,
        });

        let area = 5 * 2 + 1 + (8 * 5) / 2;
        let perimeter = 5 + 2 * Math.sqrt(2) + Math.sqrt(25 + 64) + 10;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/area"].stateValues.value).eq(area);
        expect(stateVariables["/perimeter"].stateValues.value).eq(perimeter);

        await movePolygon({ name: "/p", pointCoords: { 1: [-8, -4] }, core });
        await movePolygon({ name: "/p", pointCoords: { 2: [-8, 2] }, core });

        area = 2 * 8 + (4 * 8) / 2 - (5 * 8) / 2;
        perimeter = 13 + 6 + Math.sqrt(16 + 64) + 10 + Math.sqrt(25 + 64);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/area"].stateValues.value).eq(area);
        expect(stateVariables["/perimeter"].stateValues.value).eq(perimeter);

        await movePolygon({ name: "/p", pointCoords: { 3: [8, 2] }, core });

        area = 0;
        perimeter = 16 + 6 + Math.sqrt(16 + 64) + 10 + Math.sqrt(64 + 64);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/area"].stateValues.value).eq(area);
        expect(stateVariables["/perimeter"].stateValues.value).eq(perimeter);

        await movePolygon({ name: "/p", pointCoords: { 0: [0, 2] }, core });

        area = (8 * 8) / 2 - (8 * 6) / 2;
        perimeter = 16 + 6 + Math.sqrt(36 + 64) + 8 + Math.sqrt(64 + 64);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/area"].stateValues.value).eq(area);
        expect(stateVariables["/perimeter"].stateValues.value).eq(perimeter);
    });

    it("Rigid polygon", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" rigid />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees counterclockwise around centroid
        // (shrinking by 1/2, but that will be ignored)
        let requested_vertex_1 = [
            -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
            0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -(v[1] - centroid[1]) + centroid[0],
            v[0] - centroid[0] + centroid[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right choosminimum moved");
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, gettirotation");
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 180 degrees around centroid
        // (doubling length, but that will be ignored)
        let requested_vertex_2 = [
            -2 * (vertices[2][0] - centroid[0]) + centroid[0],
            -2 * (vertices[2][1] - centroid[1]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -(v[0] - centroid[0]) + centroid[0],
            -(v[1] - centroid[1]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex gets rotation
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees clockwise around centroid
        // (shrinking by 1/4, but that will be ignored)
        let requested_vertex_3 = [
            0.25 * (vertices[3][1] - centroid[1]) + centroid[0],
            -0.25 * (vertices[3][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            v[1] - centroid[1] + centroid[0],
            -(v[0] - centroid[0]) + centroid[1],
        ]);

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Preserve similarity", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex rotates and dilates
        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees counterclockwise around centroid
        // and shrinking by 1/2
        let requested_vertex_1 = [
            -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
            0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -0.5 * (v[1] - centroid[1]) + centroid[0],
            0.5 * (v[0] - centroid[0]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right choosminimum moved");
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, getting rotation and dilation

        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 180 degrees around centroid
        // and doubling length
        let requested_vertex_2 = [
            -2 * (vertices[2][0] - centroid[0]) + centroid[0],
            -2 * (vertices[2][1] - centroid[1]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -2 * (v[0] - centroid[0]) + centroid[0],
            -2 * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex gets rotation adilation");
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees clockwise around centroid
        // and shrinking by 1/4
        let requested_vertex_3 = [
            0.25 * (vertices[3][1] - centroid[1]) + centroid[0],
            -0.25 * (vertices[3][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            0.25 * (v[1] - centroid[1]) + centroid[0],
            -0.25 * (v[0] - centroid[0]) + centroid[1],
        ]);

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Preserve similarity and don't allow dilation equals rigid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity allowDilation="false" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex rotates
        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees counterclockwise around centroid
        // (shrinking by 1/2, but that will be ignored)
        let requested_vertex_1 = [
            -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
            0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -(v[1] - centroid[1]) + centroid[0],
            v[0] - centroid[0] + centroid[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right choosminimum moved");
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Rigid supersedes setting preserveSimilarity to false or allowDilation to true", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity="false" rigid allowDilation="true" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex rotates
        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees counterclockwise around centroid
        // (shrinking by 1/2, but that will be ignored)
        let requested_vertex_1 = [
            -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
            0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -(v[1] - centroid[1]) + centroid[0],
            v[0] - centroid[0] + centroid[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right choosminimum moved");
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Don't allow rotation", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity allowRotation="false" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex only dilates
        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // shrink to half size by moving vertex so projects to half
        // on the segment from centroid to original vertex
        let midpoint = [
            (centroid[0] + vertices[1][0]) / 2,
            (centroid[1] + vertices[1][1]) / 2,
        ];
        let vector_to_v1 = [
            vertices[1][0] - centroid[0],
            vertices[1][1] - centroid[1],
        ];
        let rotate_vector = [-3 * vector_to_v1[1], 3 * vector_to_v1[0]];

        let requested_vertex_1 = [
            midpoint[0] + rotate_vector[0],
            midpoint[1] + rotate_vector[1],
        ];
        vertices = vertices.map((v) => [
            0.5 * (v[0] - centroid[0]) + centroid[0],
            0.5 * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right choosminimum moved");
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, attempting to rotation 90 degrees shrinks to minimum

        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // attempt to rotate by 90 degrees around centroid
        let requested_vertex_2 = [
            2 * (vertices[2][1] - centroid[1]) + centroid[0],
            -2 * (vertices[2][0] - centroid[0]) + centroid[1],
        ];

        // distance from vertex 2 and centroid becomes minShrink = 0.1
        let shrink_factor =
            0.1 /
            Math.sqrt(
                (vertices[2][1] - centroid[1]) ** 2 +
                    (vertices[2][0] - centroid[0]) ** 2,
            );

        vertices = vertices.map((v) => [
            shrink_factor * (v[0] - centroid[0]) + centroid[0],
            shrink_factor * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex to dilate
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // Make 10 times larger by moving vertex so projects to 10 times the length on
        // on the segment from centroid to original vertex
        let extended_point = [
            10 * vertices[3][0] - 9 * centroid[0],
            10 * vertices[3][1] - 9 * centroid[1],
        ];
        let vector_to_v3 = [
            vertices[3][0] - centroid[0],
            vertices[3][1] - centroid[1],
        ];
        rotate_vector = [0.5 * vector_to_v3[1], -0.5 * vector_to_v3[0]];

        let requested_vertex_3 = [
            extended_point[0] + rotate_vector[0],
            extended_point[1] + rotate_vector[1],
        ];
        vertices = vertices.map((v) => [
            10 * (v[0] - centroid[0]) + centroid[0],
            10 * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Don't allow rotation, large minShrink", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity allowRotation="false" minShrink="2" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex only dilates
        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // shrink to half size by moving vertex so projects to half
        // on the segment from centroid to original vertex
        let midpoint = [
            (centroid[0] + vertices[1][0]) / 2,
            (centroid[1] + vertices[1][1]) / 2,
        ];
        let vector_to_v1 = [
            vertices[1][0] - centroid[0],
            vertices[1][1] - centroid[1],
        ];
        let rotate_vector = [-3 * vector_to_v1[1], 3 * vector_to_v1[0]];

        let requested_vertex_1 = [
            midpoint[0] + rotate_vector[0],
            midpoint[1] + rotate_vector[1],
        ];
        vertices = vertices.map((v) => [
            0.5 * (v[0] - centroid[0]) + centroid[0],
            0.5 * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right chooses minimum moved
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, attempting to rotation 90 degrees shrinks to minimum

        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // attempt to rotate by 90 degrees around centroid
        let requested_vertex_2 = [
            2 * (vertices[2][1] - centroid[1]) + centroid[0],
            -2 * (vertices[2][0] - centroid[0]) + centroid[1],
        ];

        // distance from vertex 2 and centroid becomes minShrink = 0.1
        let shrink_factor =
            2 /
            Math.sqrt(
                (vertices[2][1] - centroid[1]) ** 2 +
                    (vertices[2][0] - centroid[0]) ** 2,
            );

        vertices = vertices.map((v) => [
            shrink_factor * (v[0] - centroid[0]) + centroid[0],
            shrink_factor * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex to dilate
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // Make 10 times larger by moving vertex so projects to 10 times the length on
        // on the segment from centroid to original vertex
        let extended_point = [
            10 * vertices[3][0] - 9 * centroid[0],
            10 * vertices[3][1] - 9 * centroid[1],
        ];
        let vector_to_v3 = [
            vertices[3][0] - centroid[0],
            vertices[3][1] - centroid[1],
        ];
        rotate_vector = [0.5 * vector_to_v3[1], -0.5 * vector_to_v3[0]];

        let requested_vertex_3 = [
            extended_point[0] + rotate_vector[0],
            extended_point[1] + rotate_vector[1],
        ];
        vertices = vertices.map((v) => [
            10 * (v[0] - centroid[0]) + centroid[0],
            10 * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Don't allow translation", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity allowTranslation="false" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex rotates and dilates
        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees counterclockwise around centroid
        // and shrinking by 1/2
        let requested_vertex_1 = [
            -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
            0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -0.5 * (v[1] - centroid[1]) + centroid[0],
            0.5 * (v[0] - centroid[0]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up does not move
        let moveX = 3;
        let moveY = 2;

        // this translation will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            requested_vertices.push([
                vertices[i][0] + moveX,
                vertices[i][1] + moveY,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, getting rotation and dilation

        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 180 degrees around centroid
        // and doubling length
        let requested_vertex_2 = [
            -2 * (vertices[2][0] - centroid[0]) + centroid[0],
            -2 * (vertices[2][1] - centroid[1]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            -2 * (v[0] - centroid[0]) + centroid[0],
            -2 * (v[1] - centroid[1]) + centroid[1],
        ]);

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex gets rotation adilation");
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees clockwise around centroid
        // and shrinking by 1/4
        let requested_vertex_3 = [
            0.25 * (vertices[3][1] - centroid[1]) + centroid[0],
            -0.25 * (vertices[3][0] - centroid[0]) + centroid[1],
        ];
        vertices = vertices.map((v) => [
            0.25 * (v[1] - centroid[1]) + centroid[0],
            -0.25 * (v[0] - centroid[0]) + centroid[1],
        ]);

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Only translation", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity allowRotation="false" allowDilation="false" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex translates
        let moveX = -1;
        let moveY = -3;
        let requested_vertex_1 = [
            vertices[1][0] + moveX,
            vertices[1][1] + moveY,
        ];

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to right
        moveX = 3;
        moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, getting translation
        moveX = -8;
        moveY = 4;
        let requested_vertex_2 = [
            vertices[2][0] + moveX,
            vertices[2][1] + moveY,
        ];

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex gets translation
        moveX = 2;
        moveY = -5;
        let requested_vertex_3 = [
            vertices[3][0] + moveX,
            vertices[3][1] + moveY,
        ];

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Don't allow any transformations", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity allowTranslation="false" allowRotation="false" allowDilation="false" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex doesn't move
        let centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees counterclockwise around centroid
        // and shrinking by 1/2
        // but no effect
        let requested_vertex_1 = [
            -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
            0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
        ];

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 1: requested_vertex_1 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up does not move
        let moveX = 3;
        let moveY = 2;

        // this translation will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            requested_vertices.push([
                vertices[i][0] + moveX,
                vertices[i][1] + moveY,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex doesn't move
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 180 degrees around centroid
        // and doubling length
        // but no effect
        let requested_vertex_2 = [
            -2 * (vertices[2][0] - centroid[0]) + centroid[0],
            -2 * (vertices[2][1] - centroid[1]) + centroid[1],
        ];

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex doesn't move
        centroid = vertices.reduce(
            (a, c) => [a[0] + c[0], a[1] + c[1]],
            [0, 0],
        );
        centroid[0] /= 4;
        centroid[1] /= 4;

        // rotate by 90 degrees clockwise around centroid
        // and shrinking by 1/4
        // but no effect
        let requested_vertex_3 = [
            0.25 * (vertices[3][1] - centroid[1]) + centroid[0],
            -0.25 * (vertices[3][0] - centroid[0]) + centroid[1],
        ];

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Rotate around vertex", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity rotateAround="vertex" rotationVertex="2" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex rotates and dilates
        let rotationPoint = vertices[1];

        // rotate by 90 degrees counterclockwise around rotationPoint
        // and shrinking by 1/2
        let requested_vertex_0 = [
            -0.5 * (vertices[0][1] - rotationPoint[1]) + rotationPoint[0],
            0.5 * (vertices[0][0] - rotationPoint[0]) + rotationPoint[1],
        ];
        vertices = vertices.map((v) => [
            -0.5 * (v[1] - rotationPoint[1]) + rotationPoint[0],
            0.5 * (v[0] - rotationPoint[0]) + rotationPoint[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 0: requested_vertex_0 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right chooses minimum moved
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, getting rotation and dilation

        rotationPoint = vertices[1];

        // rotate by 180 degrees around rotationPoint
        // and doubling length
        let requested_vertex_2 = [
            -2 * (vertices[2][0] - rotationPoint[0]) + rotationPoint[0],
            -2 * (vertices[2][1] - rotationPoint[1]) + rotationPoint[1],
        ];
        vertices = vertices.map((v) => [
            -2 * (v[0] - rotationPoint[0]) + rotationPoint[0],
            -2 * (v[1] - rotationPoint[1]) + rotationPoint[1],
        ]);

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving single copied vertex gets rotation and dilation
        rotationPoint = vertices[1];

        // rotate by 90 degrees clockwise around rotationPoint
        // and shrinking by 1/4
        let requested_vertex_3 = [
            0.25 * (vertices[3][1] - rotationPoint[1]) + rotationPoint[0],
            -0.25 * (vertices[3][0] - rotationPoint[0]) + rotationPoint[1],
        ];
        vertices = vertices.map((v) => [
            0.25 * (v[1] - rotationPoint[1]) + rotationPoint[0],
            -0.25 * (v[0] - rotationPoint[0]) + rotationPoint[1],
        ]);

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("Rotate around exterior point", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,7)</point>
    <point>(-4,-1)</point>
    <point>(8,2)</point>
    <point>(-3,4)</point>
    <point name="rotationPoint" styleNumber="2">(-1,3)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" preserveSimilarity rotateAround="point" rotationCenter="$rotationPoint" />

  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
    $pg.vertices{assignNames="v1 v2 v3 v4"}
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices = [
            [3, 7],
            [-4, -1],
            [8, 2],
            [-3, 4],
        ];

        await testPolygonCopiedTwice({ vertices, core });

        // move individual vertex rotates and dilates
        let rotationPoint = [-1, 3];

        // rotate by 90 degrees counterclockwise around rotationPoint
        // and shrinking by 1/2
        let requested_vertex_0 = [
            -0.5 * (vertices[0][1] - rotationPoint[1]) + rotationPoint[0],
            0.5 * (vertices[0][0] - rotationPoint[0]) + rotationPoint[1],
        ];
        vertices = vertices.map((v) => [
            -0.5 * (v[1] - rotationPoint[1]) + rotationPoint[0],
            0.5 * (v[0] - rotationPoint[0]) + rotationPoint[1],
        ]);

        await movePolygon({
            name: "/g1/pg",
            pointCoords: { 0: requested_vertex_0 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move copied polygon up and to the right chooses minimum moved
        let moveX = 3;
        let moveY = 2;

        // add extra movement to requested vertices, which will be ignored
        let requested_vertices: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
            requested_vertices.push([
                vertices[i][0] + i,
                vertices[i][1] + 2 * i,
            ]);
        }

        await movePolygon({
            name: "/g2/pg",
            pointCoords: requested_vertices,
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // move double copied individual vertex, getting rotation and dilation

        rotationPoint = [-1, 3];

        // rotate by 180 degrees around rotationPoint
        // and doubling length
        let requested_vertex_2 = [
            -2 * (vertices[2][0] - rotationPoint[0]) + rotationPoint[0],
            -2 * (vertices[2][1] - rotationPoint[1]) + rotationPoint[1],
        ];
        vertices = vertices.map((v) => [
            -2 * (v[0] - rotationPoint[0]) + rotationPoint[0],
            -2 * (v[1] - rotationPoint[1]) + rotationPoint[1],
        ]);

        await movePolygon({
            name: "/g3/pg",
            pointCoords: { 2: requested_vertex_2 },
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // change rotation point, then moving single copied vertex gets rotation and dilation

        await movePoint({ name: "/g1/rotationPoint", x: 6, y: -2, core });

        rotationPoint = [6, -2];

        // rotate by 90 degrees clockwise around rotationPoint
        // and shrinking by 1/4
        let requested_vertex_3 = [
            0.25 * (vertices[3][1] - rotationPoint[1]) + rotationPoint[0],
            -0.25 * (vertices[3][0] - rotationPoint[0]) + rotationPoint[1],
        ];
        vertices = vertices.map((v) => [
            0.25 * (v[1] - rotationPoint[1]) + rotationPoint[0],
            -0.25 * (v[0] - rotationPoint[0]) + rotationPoint[1],
        ]);

        await movePoint({
            name: "/g2/v4",
            x: requested_vertex_3[0],
            y: requested_vertex_3[1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });

        // moving defining vertex deforms polygon
        vertices[0] = [4, 6];

        await movePoint({
            name: "/g1/_point1",
            x: vertices[0][0],
            y: vertices[0][1],
            core,
        });

        await testPolygonCopiedTwice({ vertices, core });
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" fillColor="brown" fillColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" fillColor="#540907" fillColorWord="dark red" fillColorDarkMode="#f0c6c5" fillColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <polygon name="A" styleNumber="1" labelIsName vertices="(0,0) (0,2) (2,0)" filled />
      <polygon name="B" styleNumber="2" labelIsName vertices="(2,2) (2,4) (4,2)" filled />
      <polygon name="C" styleNumber="5" labelIsName vertices="(4,4) (4,6) (6,4)" filled />
    </graph>
    <p name="ADescription">Polygon A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    <p name="ABorderDescription">A has a $A.borderStyleDescription border.</p>
    <p name="BBorderDescription">B has a $B.borderStyleDescription border.</p>
    <p name="CBorderDescription">C has a $C.borderStyleDescription border.</p>
    <p name="AFillDescription">A has a $A.fillStyleDescription fill.</p>
    <p name="BFillDescription">B has a $B.fillStyleDescription fill.</p>
    <p name="CFillDescription">C has a $C.fillStyleDescription fill.</p>
    `;

        async function test_items(theme: "dark" | "light") {
            const core = await createTestCore({ doenetML, theme });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/ADescription"].stateValues.text).eq(
                `Polygon A is filled ${AColor} with thick border.`,
            );
            expect(stateVariables["/BDescription"].stateValues.text).eq(
                `B is a filled ${BShade} red polygon.`,
            );
            expect(stateVariables["/CDescription"].stateValues.text).eq(
                `C is a filled ${CColor} polygon with a thin border.`,
            );
            expect(stateVariables["/ABorderDescription"].stateValues.text).eq(
                `A has a thick ${AColor} border.`,
            );
            expect(stateVariables["/BBorderDescription"].stateValues.text).eq(
                `B has a ${BShade} red border.`,
            );
            expect(stateVariables["/CBorderDescription"].stateValues.text).eq(
                `C has a thin ${CColor} border.`,
            );
            expect(stateVariables["/AFillDescription"].stateValues.text).eq(
                `A has a ${AColor} fill.`,
            );
            expect(stateVariables["/BFillDescription"].stateValues.text).eq(
                `B has a ${BShade} red fill.`,
            );
            expect(stateVariables["/CFillDescription"].stateValues.text).eq(
                `C has a ${CColor} fill.`,
            );
        }

        await test_items("light");
        await test_items("dark");
    });
});
