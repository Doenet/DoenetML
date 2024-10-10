import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

async function testPolylineCopiedTwice({
    core,
    vertices,
    polylineName = "/pg",
    graph1Name = "/g1",
    graph2Name = "/g2",
    graph3Name = "/g3",
}: {
    core: any;
    vertices: (number | string)[][];
    polylineName?: string;
    graph1Name?: string;
    graph2Name?: string;
    graph3Name?: string;
}) {
    let stateVariables = await returnAllStateVariables(core);
    expect(
        stateVariables[graph1Name + polylineName].stateValues.numVertices,
    ).eqls(vertices.length);
    expect(
        stateVariables[graph2Name + polylineName].stateValues.numVertices,
    ).eqls(vertices.length);
    expect(
        stateVariables[graph3Name + polylineName].stateValues.numVertices,
    ).eqls(vertices.length);

    for (let i in vertices) {
        if (
            typeof vertices[i][0] === "number" &&
            Number.isFinite(vertices[i][0])
        ) {
            expect(
                me
                    .fromAst(
                        stateVariables[graph1Name + polylineName].stateValues
                            .vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph2Name + polylineName].stateValues
                            .vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph3Name + polylineName].stateValues
                            .vertices[i][0],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
        } else {
            expect(
                stateVariables[graph1Name + polylineName].stateValues.vertices[
                    i
                ][0].tree,
            ).eq(vertices[i][0]);
            expect(
                stateVariables[graph2Name + polylineName].stateValues.vertices[
                    i
                ][0].tree,
            ).eq(vertices[i][0]);
            expect(
                stateVariables[graph3Name + polylineName].stateValues.vertices[
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
                        stateVariables[graph1Name + polylineName].stateValues
                            .vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph2Name + polylineName].stateValues
                            .vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
                me
                    .fromAst(
                        stateVariables[graph3Name + polylineName].stateValues
                            .vertices[i][1],
                    )
                    .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
        } else {
            expect(
                stateVariables[graph1Name + polylineName].stateValues.vertices[
                    i
                ][1].tree,
            ).eq(vertices[i][1]);
            expect(
                stateVariables[graph2Name + polylineName].stateValues.vertices[
                    i
                ][1].tree,
            ).eq(vertices[i][1]);
            expect(
                stateVariables[graph3Name + polylineName].stateValues.vertices[
                    i
                ][1].tree,
            ).eq(vertices[i][1]);
        }
    }
}

describe("Polyline tag tests", async () => {
    it("Polyline vertices and copied points", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
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

        await testPolylineCopiedTwice({ core, vertices });

        // move individual vertex
        vertices[1] = [4, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: { 1: vertices[1] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move copied polyline up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: { 2: vertices[2] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });
    });

    it("Polyline macro in vertices", async () => {
        let core = await createTestCore({
            doenetML: `
  <math name="m">-1</math>
  <graph name="g1" newNamespace>
    <polyline vertices="(3,5) (-4,$(../m)) (5,2) (-3,4)" name="pg" />
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

        await testPolylineCopiedTwice({ core, vertices });

        // move individual vertex
        vertices[1] = [4, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: { 1: vertices[1] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move copied polyline up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: { 2: vertices[2] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });
    });

    it("dynamic polyline with vertices from copied map, initially zero, copied", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        let vertices: number[][] = [];
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "1",
            componentName: "/length",
            core,
        });
        vertices[0] = [0, 5 * Math.sin(0)];
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "2",
            componentName: "/length",
            core,
        });
        vertices[1] = [1, 5 * Math.sin(1)];
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "3",
            componentName: "/length",
            core,
        });
        vertices[2] = [2, 5 * Math.sin(2)];
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "2",
            componentName: "/length",
            core,
        });
        vertices.splice(2, 1);
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "0",
            componentName: "/length",
            core,
        });
        vertices = [];
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "5",
            componentName: "/length",
            core,
        });
        for (let i = 0; i < 5; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolylineCopiedTwice({ core, vertices });

        // start over and begin with big increment
        core = await createTestCore({
            doenetML: `

  <mathInput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    $(../g1/pg{name="pg"})
  </graph>
  $g2{name="g3"}
  `,
        });

        vertices = [];
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "10",
            componentName: "/length",
            core,
        });
        for (let i = 0; i < 10; i++) {
            vertices.push([i, 5 * Math.sin(i)]);
        }
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "1",
            componentName: "/length",
            core,
        });
        vertices = [[0, 5 * Math.sin(0)]];
        await testPolylineCopiedTwice({ core, vertices });
    });

    it("polyline with initially undefined point", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="mi" />

  <graph name="g1" newNamespace>
    <polyline vertices="(1,2) (-1,5) ($(../mi),7) (3,-5) (-4,-3)" name="pg" />
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
        await testPolylineCopiedTwice({ core, vertices });

        await updateMathInputValue({
            latex: "-2",
            componentName: "/mi",
            core,
        });

        vertices[2][0] = -2;
        await testPolylineCopiedTwice({ core, vertices });
    });

    it(`can't move polyline based on map`, async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
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
        await testPolylineCopiedTwice({ core, vertices });

        // can't move points
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/g1/mp1",
            args: { x: 9, y: -8 },
            event: null,
        });
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/g1/mp9",
            args: { x: -8, y: 4 },
            event: null,
        });

        // can't move polyline1
        let moveX = 3;
        let moveY = 2;

        let vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: vertices2,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // can't move polyline2
        moveX = -5;
        moveY = 6;

        vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices2,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // can't move polyline3
        moveX = 7;
        moveY = -4;

        vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: vertices2,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });
    });

    it(`create moveable polyline based on map`, async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x + <math>0</math>, 5sin($x) + <math>0</math>)</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
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
        await testPolylineCopiedTwice({ core, vertices });

        // can move points

        vertices[0] = [9, -8];
        vertices[8] = [-8, 4];

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/g1/mp1",
            args: { x: vertices[0][0], y: vertices[0][1] },
            event: null,
        });
        await core.requestAction({
            actionName: "movePoint",
            componentName: "/g1/mp9",
            args: { x: vertices[8][0], y: vertices[8][1] },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // can move polyline1
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // can move polyline2
        moveX = -5;
        moveY = 6;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        moveX = 7;
        moveY = -4;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });
    });

    it("copy vertices of polyline", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polyline name="pl" vertices="(-3,-1) (1,2) (3,4) (6,-2)" />
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

        let stateVariables = await returnAllStateVariables(core);
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
            await core.requestAction({
                actionName: "movePoint",
                componentName: `/v${i + 1}`,
                args: { x: ps[i][0], y: ps[i][1] },
                event: null,
            });
        }

        stateVariables = await returnAllStateVariables(core);
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
            await core.requestAction({
                actionName: "movePoint",
                componentName: `/v${i + 1}a`,
                args: { x: ps[i][0], y: ps[i][1] },
                event: null,
            });
        }

        stateVariables = await returnAllStateVariables(core);
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

    it("new polyline from copied vertices of polyline", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
  <polyline vertices="(-9,6) (-3,7) (4,0) (8,5)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <polyline vertices="$(../g1/pg.vertices)" name="pg" />
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

        await testPolylineCopiedTwice({ core, vertices });

        // move first polyline up and to the right
        let moveX = 4;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move copied polyline up and to the left
        moveX = -7;
        moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move double copied polyline down and to the left
        moveX = -1;
        moveY = -4;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] += moveX;
            vertices[i][1] += moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });
    });

    it("new polyline as translated version of polyline", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="5" name="transx" />
    <mathInput prefill="7" name="transy" />
    <graph>
    <polyline vertices=" (0,0) (3,-4) (1,-6) (-5,-6) " />
    <map hide>
      <template newNamespace>
        <point>(<extract prop="x"><copy target="x" fixed="false"/></extract>+
          <copy prop="value" modifyIndirectly="false" target="../transx" />,
        <extract prop="y"><copy target="x" fixed="false" /></extract>+
        <copy prop="value" modifyIndirectly="false" target="../transy" />)
        </point>
      </template>
      <sources alias="x">
        $_polyline1.vertices{name="vs"}
      </sources>
    </map>
    <polyline vertices="$_map1" />
    </graph>
    $_polyline2.vertices{assignNames="p1 p2 p3 p4"}

    `,
        });

        async function testPolylines({ vertices, transX, transY }) {
            let vertices2 = vertices.map((v) => [v[0] + transX, v[1] + transY]);

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/_polyline1"].stateValues.numVertices).eqls(
                vertices.length,
            );
            expect(stateVariables["/_polyline2"].stateValues.numVertices).eqls(
                vertices.length,
            );

            for (let i in vertices) {
                if (Number.isFinite(vertices[i][0])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline1"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][0], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline2"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][0], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polyline1"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices[i][0]);
                    expect(
                        stateVariables["/_polyline2"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices2[i][0]);
                }
                if (Number.isFinite(vertices[i][1])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline1"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][1], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline2"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][1], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polyline1"].stateValues.vertices[i][1]
                            .tree,
                    ).eq(vertices[i][1]);
                    expect(
                        stateVariables["/_polyline2"].stateValues.vertices[i][1]
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

        await testPolylines({ vertices, transX, transY });

        // move points on first polyline
        vertices = [
            [1, -1],
            [-3, 2],
            [-1, 7],
            [6, 3],
        ];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylines({ vertices, transX, transY });

        // move points on second polyline
        let vertices2 = [
            [-3, 4],
            [1, 0],
            [9, 6],
            [2, -1],
        ];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline2",
            args: {
                pointCoords: vertices2,
            },
            event: null,
        });

        vertices = vertices2.map((v) => [v[0] - transX, v[1] - transY]);

        await testPolylines({ vertices, transX, transY });

        // change translation
        await updateMathInputValue({
            latex: "2",
            componentName: "/transx",
            core,
        });
        await updateMathInputValue({
            latex: "10",
            componentName: "/transy",
            core,
        });

        transX = 2;
        transY = 10;

        await testPolylines({ vertices, transX, transY });
    });

    it("open parallelogram based on three points", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <polyline name="parallelogram" vertices="(1,2) (3,4) (-5,6) ($(parallelogram.vertexX1_1{fixed})+$(parallelogram.vertexX3_1{fixed})-$(parallelogram.vertexX2_1), $(parallelogram.vertexX1_2{fixed})+$(parallelogram.vertexX3_2{fixed})-$(parallelogram.vertexX2_2))" />
    </graph>
    `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

        let stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/parallelogram",
            args: {
                pointCoords: { 0: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/parallelogram",
            args: {
                pointCoords: { 1: B },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/parallelogram",
            args: {
                pointCoords: { 2: C },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/parallelogram",
            args: {
                pointCoords: { 3: D },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

    it("new polyline from copied vertices, some flipped", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices="(-9,6) (-3,7) (4,0) (8,5)" />
  </graph>
  <graph>
    <polyline vertices="$(_polyline1.vertex1) ($(_polyline1.vertexX2_2), $(_polyline1.vertexX2_1)) $(_polyline1.vertex3) ($(_polyline1.vertexX4_2), $(_polyline1.vertexX4_1))" />
  </graph>
  `,
        });

        async function testPolylines({ vertices }) {
            let vertices2 = [...vertices];
            vertices2[1] = [vertices2[1][1], vertices2[1][0]];
            vertices2[3] = [vertices2[3][1], vertices2[3][0]];

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/_polyline1"].stateValues.numVertices).eqls(
                vertices.length,
            );
            expect(stateVariables["/_polyline2"].stateValues.numVertices).eqls(
                vertices.length,
            );

            for (let i in vertices) {
                if (Number.isFinite(vertices[i][0])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline1"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][0], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline2"].stateValues
                                    .vertices[i][0],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][0], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polyline1"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices[i][0]);
                    expect(
                        stateVariables["/_polyline2"].stateValues.vertices[i][0]
                            .tree,
                    ).eq(vertices2[i][0]);
                }
                if (Number.isFinite(vertices[i][1])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline1"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices[i][1], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables["/_polyline2"].stateValues
                                    .vertices[i][1],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(vertices2[i][1], 1e-12);
                } else {
                    expect(
                        stateVariables["/_polyline1"].stateValues.vertices[i][1]
                            .tree,
                    ).eq(vertices[i][1]);
                    expect(
                        stateVariables["/_polyline2"].stateValues.vertices[i][1]
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

        await testPolylines({ vertices });

        // move first polyline vertices
        vertices = [
            [7, 2],
            [1, -3],
            [2, 9],
            [-4, -3],
        ];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylines({ vertices });

        // move second polyline vertices
        let vertices2 = [
            [-1, 9],
            [5, 7],
            [-8, 1],
            [-7, 6],
        ];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline2",
            args: {
                pointCoords: vertices2,
            },
            event: null,
        });

        vertices = [...vertices2];
        vertices[1] = [vertices[1][1], vertices[1][0]];
        vertices[3] = [vertices[3][1], vertices[3][0]];

        await testPolylines({ vertices });
    });

    it("four vertex polyline based on three points", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polyline vertices="(1,2) (3,4) (-5,6) ($(_polyline1.vertexX3_1{fixed})+$(_polyline1.vertexX2_1{fixed})-$(_polyline1.vertexX1_1), $(_polyline1.vertexX3_2{fixed})+$(_polyline1.vertexX2_2{fixed})-$(_polyline1.vertexX1_2))" />
  </graph>

  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 0: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move second vertex
        B = [8, 9];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 1: B },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];
        D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 2: C },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move fourth vertex
        D = [7, 0];
        A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 3: D },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(D);
    });

    it("fourth vertex depends on internal copy of first vertex", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polyline vertices="(1,2) (3,4) (-5,6) $(_polyline1.vertex1{createComponentOfType='point'})" />
  </graph>
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_polyline1"].stateValues.numVertices).eq(4);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move first vertex
        A = [-4, -1];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 0: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 1: B },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 2: C },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];
        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 3: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
    });

    it("first vertex depends on internal copy of fourth vertex", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polyline vertices="$(_polyline1.vertex4{ createComponentOfType='point' }) (3,4) (-5,6) (1,2)" />
  </graph>
  
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_polyline1"].stateValues.numVertices).eq(4);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move first vertex
        A = [-4, -1];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 0: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move second vertex
        B = [8, 9];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 1: B },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move third vertex
        C = [-3, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 2: C },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);

        // move fourth vertex
        A = [7, 0];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 3: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
    });

    it("first vertex depends fourth, formula for fifth", async () => {
        let core = await createTestCore({
            doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="$(_polyline1.vertex4{createComponentOfType='point'}) (3,4) (-5,6) (1,2) ($(_polyline1.vertexX1_1)+1,2)" />
  </graph>
  $_polyline1.vertices{assignNames="p1 p2 p3 p4 p5"}
  
  `,
        });

        let A = [1, 2];
        let B = [3, 4];
        let C = [-5, 6];
        let D = [A[0] + 1, 2];

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move first vertex
        A = [-4, -1];
        D[0] = A[0] + 1;

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 0: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move second vertex
        B = [8, 9];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 1: B },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move third vertex
        C = [-3, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 2: C },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move fourth vertex
        A = [7, 0];
        D[0] = A[0] + 1;

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 3: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);

        // move fifth vertex
        D = [-5, 9];
        A[0] = D[0] - 1;

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 4: D },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[0].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[1].map(
                (x) => x.tree,
            ),
        ).eqls(B);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[2].map(
                (x) => x.tree,
            ),
        ).eqls(C);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[3].map(
                (x) => x.tree,
            ),
        ).eqls(A);
        expect(
            stateVariables["/_polyline1"].stateValues.vertices[4].map(
                (x) => x.tree,
            ),
        ).eqls(D);
    });

    it("first, fourth, seventh vertex depends on fourth, seventh, tenth", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <polyline name="P" vertices="$(P.vertex4{createComponentOfType='point'}) (1,2) (3,4) $(P.vertex7{createComponentOfType='point'}) (5,7) (-5,7) $(P.vertex10{createComponentOfType='point'}) (3,1) (5,0) (-5,-1)" />
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

        let stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 0: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 1: B },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 2: C },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 3: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 4: D },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 5: E },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 6: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 7: F },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 8: G },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 9: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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
  <polyline name="P" vertices="($(P.vertexX4_1)+1,$(P.vertexX4_2)+1) (1,2) (3,4) ($(P.vertexX7_1)+1,$(P.vertexX7_2)+1) (5,7) (-5,7) ($(P.vertexX10_1)+1,$(P.vertexX10_2)+1) (3,1) (5,0) (-5,-1)" />
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

        let stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 0: A3 },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 1: B },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 2: C },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 3: A2 },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 4: D },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 5: E },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 6: A1 },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 7: F },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 8: G },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/P",
            args: {
                pointCoords: { 9: A },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

    it("attract to polyline", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices=" (3,5) (-4,-1) (5,2)" />
    <point x="7" y="8">
      <constraints>
        <attractTo>$_polyline1</attractTo>
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            7,
            8,
        ]);

        // move point near segment 1
        let x = 1;
        let mseg1 = (y2 - y1) / (x2 - x1);
        let y = mseg1 * (x - x1) + y1 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        let px = stateVariables["/_point1"].stateValues.xs[0].tree;
        let py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2
        x = 3;
        let mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.4;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices
        x = 4;
        let mseg3 = (y1 - y3) / (x1 - x3);
        y = mseg3 * (x - x3) + y3 + 0.2;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        // move point just past first vertex
        x = x1 + 0.2;
        y = y1 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        // point not attracted along extension of first segment
        x = 4;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        x = -5;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 - 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        // move point just past second vertex
        x = x2 - 0.2;
        y = y2 - 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // point not attracted along extension of second segment
        x = 6;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);

        x = -5;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 - 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: [
                    [x1, y1],
                    [x2, y2],
                    [x3, y3],
                ],
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move second vertex so point attracts to second segment
        moveX = -1;
        moveY = 1;

        x2 += moveX;
        y2 += moveY;

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 1: [x2, y2] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
    });

    it("constrain to polyline", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices=" (3,5) (-4,-1) (5,2)" />
    <point x="7" y="8">
      <constraints>
        <constrainTo>$_polyline1</constrainTo>
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_point1"].stateValues.coords.tree).eqls([
            "vector",
            x1,
            y1,
        ]);

        // move point near segment 1
        let x = 1;
        let mseg1 = (y2 - y1) / (x2 - x1);
        let y = mseg1 * (x - x1) + y1 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        let px = stateVariables["/_point1"].stateValues.xs[0].tree;
        let py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2
        x = 3;
        let mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.4;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices

        x = 4;
        let mseg3 = (y1 - y3) / (x1 - x3);
        y = mseg3 * (x - x3) + y3 + 0.2;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;
        mseg1 = (y2 - y1) / (x2 - x1);
        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point just past first vertex

        x = x1 + 0.2;
        y = y1 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);

        //point along extension of first segment constrained to endpoint

        x = 4;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);
        x = -5;
        mseg1 = (y2 - y1) / (x2 - x1);
        y = mseg1 * (x - x1) + y1 - 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        // move point just past second vertex

        x = x2 - 0.2;
        y = y2 - 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);

        //point along extension of second segment constrained to endpoint

        x = 6;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 + 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        expect(px).closeTo(x3, 1e-6);
        expect(py).closeTo(y3, 1e-6);

        x = -5;
        mseg2 = (y2 - y3) / (x2 - x3);
        y = mseg2 * (x - x2) + y2 - 0.3;

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/_point1`,
            args: { x, y },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: [
                    [x1, y1],
                    [x2, y2],
                    [x3, y3],
                ],
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move second vertex so point constrained to second segment

        moveX = -1;
        moveY = 8;

        x2 += moveX;
        y2 += moveY;

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/_polyline1",
            args: {
                pointCoords: { 1: [x2, y2] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        px = stateVariables["/_point1"].stateValues.xs[0].tree;
        py = stateVariables["/_point1"].stateValues.xs[1].tree;

        mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
    });

    it("constrain to polyline, different scales from graph", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <polyline vertices="(-50,-0.02) (-40,0.07) (70,0.06) (10,-0.01)" name="p" />
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

        let stateVariables = await returnAllStateVariables(core);

        let mseg3 = (y4 - y3) / (x4 - x3);

        let px = stateVariables["/A"].stateValues.xs[0].tree;
        let py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);

        // move point near segment 1

        let mseg1 = (y2 - y1) / (x2 - x1);

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/A`,
            args: { x: -20, y: 0.02 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/A"].stateValues.xs[0].tree;
        py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);

        // move point near segment 2

        let mseg2 = (y2 - y3) / (x2 - x3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/A`,
            args: { x: 0, y: 0.04 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/A"].stateValues.xs[0].tree;
        py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);

        // move point near segment between first and last vertices

        mseg3 = (y4 - y3) / (x4 - x3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: `/A`,
            args: { x: -10, y: 0.02 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        px = stateVariables["/A"].stateValues.xs[0].tree;
        py = stateVariables["/A"].stateValues.xs[1].tree;

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);
    });

    it("fixed polyline", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices="(1,3) (5,7) (-2,6)" name="p" fixed />
  </graph>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: [
                    [4, 7],
                    [8, 10],
                    [1, 9],
                ],
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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
      <polyline name="pl" vertices="(2,-3) (3,4) (-3,4)" />
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"]).eq(undefined);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);

        await updateMathInputValue({ latex: "1", componentName: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            t1x,
            t1y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"].stateValues.value.tree).eq(t2x);
        expect(stateVariables["/xa"].stateValues.value.tree).eq(t2x);

        await updateMathInputValue({ latex: "2", componentName: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            t2x,
            t2y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"].stateValues.value.tree).eq(t2y);
        expect(stateVariables["/xa"].stateValues.value.tree).eq(t2y);

        await updateMathInputValue({ latex: "3", componentName: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"].stateValues.xs.map((x) => x.tree)).eqls([
            t3x,
            t3y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);

        await updateMathInputValue({ latex: "4", componentName: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"]).eq(undefined);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);
    });

    it("polyline from vector operations", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="m" fixed>(-3,2)</math>
    <graph>
      <point name="P">(2,1)</point>
      <polyline vertices="2(2,-3)+(3,4) 3$P $P+2$m" name="polyline" />
    </graph>
 

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/polyline"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [7, -2],
            [6, 3],
            [-4, 5],
        ]);

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/polyline",
            args: {
                pointCoords: { 0: [3, 5] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/polyline"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [6, 3],
            [-4, 5],
        ]);

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/polyline",
            args: {
                pointCoords: { 1: [-9, -6] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/polyline"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [-9, -6],
            [-9, 2],
        ]);

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/polyline",
            args: {
                pointCoords: { 2: [-3, 1] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/polyline"].stateValues.vertices.map((x) =>
                x.map((y) => y.tree),
            ),
        ).eqls([
            [3, 5],
            [9, -9],
            [-3, 1],
        ]);
    });

    it("draggable, vertices draggable", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <polyline vertices="(1,3) (5,7) (-2,6)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>draggable: <booleaninput name="draggable" /> <boolean copySource="p.draggable" name="d2" /></p>
  <p>vertices draggable: <booleaninput name="verticesDraggable" /> <boolean copySource="p.verticesDraggable" name="vd2" /></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
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

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: { 0: [4, 7] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: [
                    [4, 7],
                    [8, 10],
                    [1, 9],
                ],
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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
            componentName: "/verticesDraggable",
            core,
        });

        // can move single vertex

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: { 0: [4, 7] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: [
                    [3, 8],
                    [8, 10],
                    [1, 9],
                ],
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        // vertices and polyline draggable

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable",
            core,
        });

        // can move single vertex

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: { 1: [-3, 2] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: [
                    [3, 8],
                    [8, 10],
                    [1, 9],
                ],
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        // polyline but not vertices draggable

        await updateBooleanInputValue({
            boolean: false,
            componentName: "/verticesDraggable",
            core,
        });

        // cannot move single vertex

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: { 2: [9, 3] },
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        await await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: [
                    [-4, 1],
                    [9, -4],
                    [0, 7],
                ],
            },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
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

        await testPolylineCopiedTwice({ core, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: { 1: vertices[1] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move copied polyline up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, vertices });

        // try to move double copied polyline down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, vertices });
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
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
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

        await testPolylineCopiedTwice({ core, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: { 1: vertices[1] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move copied polyline up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, vertices });

        // try to move double copied polyline down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, vertices });
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
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
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

        await testPolylineCopiedTwice({ core, vertices });

        // move individual vertex

        vertices[1] = [4, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: { 1: vertices[1] },
            },
            event: null,
        });

        // adjust for constraint
        vertices[1] = [3, 8];

        await testPolylineCopiedTwice({ core, vertices });

        // move copied polyline up and to the right

        let moveX = 4;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = 1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, vertices });

        // try to move double copied polyline down and to the right

        moveX = 1;
        moveY = -7;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        // adjustment due to constraint
        moveX = -1;
        moveY = -1;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await testPolylineCopiedTwice({ core, vertices });
    });

    it("handle bad vertices", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <polyline vertices="A" name="pl" />
    </graph>
    `,
        });

        // document is created
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pl"]).not.eq(undefined);
    });

    it("length", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <polyline vertices="(0,0) (5,0) (6,1) (5,2) (0,10)" name="p" />
    </graph>
    <p>length: <number copySource="p.length" name="length" /></p>
    `,
        });

        let length = 5 + 2 * Math.sqrt(2) + Math.sqrt(25 + 64);

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/length"].stateValues.value).eq(length);

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: { 1: [-8, -4] },
            },
            event: null,
        });
        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/p",
            args: {
                pointCoords: { 2: [-8, 2] },
            },
            event: null,
        });

        length = 13 + 6 + Math.sqrt(16 + 64) + Math.sqrt(25 + 64);

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/length"].stateValues.value).eq(length);
    });

    // regression test for issue #235
    it("polyline with vertices from mathList/mathInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="vertexInput">(0,0),(2,2),(-1,5),(-5,1)</mathInput>
    <mathList name="vertices">$vertexInput</mathList>

    <graph name="g1" newNamespace>
        <polyline vertices="$(../vertices.maths)" name="pg" />
    </graph>
    <graph name="g2" newNamespace>
        $(../g1/pg{name="pg"})
        $pg.vertices{assignNames="v1 v2 v3 v4"}
    </graph>
    $g2{name="g3"}
      `,
        });

        let vertices = [
            [0, 0],
            [2, 2],
            [-1, 5],
            [-5, 1],
        ];

        await testPolylineCopiedTwice({ vertices, core });

        // move individual vertex
        vertices[1] = [4, 7];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g1/pg",
            args: {
                pointCoords: { 1: vertices[1] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move copied polyline up and to the right
        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] + moveX;
            vertices[i][1] = vertices[i][1] + moveY;
        }

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g2/pg",
            args: {
                pointCoords: vertices,
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // move double copied individual vertex
        vertices[2] = [-9, -8];

        await core.requestAction({
            actionName: "movePolyline",
            componentName: "/g3/pg",
            args: {
                pointCoords: { 2: vertices[2] },
            },
            event: null,
        });

        await testPolylineCopiedTwice({ core, vertices });

        // change last vertices via math input
        await updateMathInputValue({
            latex: "(3,2), (-6,5), (4,9), (-2,0)",
            componentName: "/vertexInput",
            core,
        });

        vertices = [
            [3, 2],
            [-6, 5],
            [4, 9],
            [-2, 0],
        ];

        await testPolylineCopiedTwice({ vertices, core });
    });
});
