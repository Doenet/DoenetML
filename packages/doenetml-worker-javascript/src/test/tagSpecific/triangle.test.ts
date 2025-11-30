import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { movePoint, movePolygon } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function test_triangle(
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    initial_vertices: number[][],
) {
    async function check_items(vertices: number[][]) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("triangle")
            ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
        ).eqls(vertices);

        for (let i = 0; i < 3; i++) {
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`vertex${i + 1}`)
                ].stateValues.xs.map((v) => v.tree),
            ).eqls(vertices[i]);
        }
    }

    let vertices = [...initial_vertices];
    await check_items(vertices);

    // move triangle up and to the right

    let moveX = 3;
    let moveY = 2;

    vertices = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);
    await movePolygon({
        componentIdx: await resolvePathToNodeIdx("triangle"),
        pointCoords: vertices,
        core,
    });
    await check_items(vertices);

    // move each point
    vertices = [
        [7, -4],
        [-5, -9],
        [-1, 8],
    ];

    for (let i = 0; i < 3; i++) {
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`vertex${i + 1}`),
            x: vertices[i][0],
            y: vertices[i][1],
            core,
        });
    }

    await check_items(vertices);
}

describe("Triangle tag tests", async () => {
    it("triangle with no children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle" />
    <point extend="$triangle.vertex1" name="vertex1" />
    <point extend="$triangle.vertex2" name="vertex2" />
    <point extend="$triangle.vertex3" name="vertex3" />
  </graph>
  `,
        });

        await test_triangle(core, resolvePathToNodeIdx, [
            [0, 1],
            [1, 0],
            [0, 0],
        ]);
    });

    it("triangle with empty vertices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle" vertices="" />
    <point extend="$triangle.vertex1" name="vertex1" />
    <point extend="$triangle.vertex2" name="vertex2" />
    <point extend="$triangle.vertex3" name="vertex3" />
  </graph>
  `,
        });

        await test_triangle(core, resolvePathToNodeIdx, [
            [0, 1],
            [1, 0],
            [0, 0],
        ]);
    });

    it("triangle with one vertex specified", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle" vertices="(-8,5)" />
    <point extend="$triangle.vertex1" name="vertex1" />
    <point extend="$triangle.vertex2" name="vertex2" />
    <point extend="$triangle.vertex3" name="vertex3" />
  </graph>
  `,
        });

        await test_triangle(core, resolvePathToNodeIdx, [
            [-8, 5],
            [1, 0],
            [0, 0],
        ]);
    });

    it("triangle with two vertices specified", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle" vertices="(-8,5) (6,2)" />
    <point extend="$triangle.vertex1" name="vertex1" />
    <point extend="$triangle.vertex2" name="vertex2" />
    <point extend="$triangle.vertex3" name="vertex3" />
  </graph>
  `,
        });

        await test_triangle(core, resolvePathToNodeIdx, [
            [-8, 5],
            [6, 2],
            [0, 0],
        ]);
    });

    it("triangle with three vertices specified", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle" vertices="(-8,5) (6,2) (5,-4)" />
    <point extend="$triangle.vertex1" name="vertex1" />
    <point extend="$triangle.vertex2" name="vertex2" />
    <point extend="$triangle.vertex3" name="vertex3" />
  </graph>
  `,
        });

        await test_triangle(core, resolvePathToNodeIdx, [
            [-8, 5],
            [6, 2],
            [5, -4],
        ]);
    });

    it("copy triangle and overwrite vertices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <group name="g1" >
    <sideBySide widths="25% 25% 25% 25%" >
      <graph width="180" height="180">
        <triangle name="t1" />
      </graph>
      <graph width="180" height="180">
        <triangle extend="$t1" vertices="(3,-2)" name="t2" />
      </graph>
      <graph width="180" height="180">
        <triangle extend="$t1" vertices="(5,2) (6, -1)" name="t3" />
      </graph>
      <graph width="180" height="180">
        <triangle extend="$t1" vertices="(9,0) (-4, 5) (2, -3)" name="t4" />
      </graph>
    </sideBySide>
  </group>
  
  <group extend="$g1" name="g2" />

  `,
        });

        async function check_items({
            vertices1,
            vertex2_1,
            vertices3,
            vertices4,
        }: {
            vertices1: number[][];
            vertex2_1: number[];
            vertices3: number[][];
            vertices4: number[][];
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let allVertices2 = [vertex2_1, ...vertices1.slice(1)];
            let allVertices3 = [...vertices3, vertices1[2]];

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.t1")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(vertices1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.t1")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(vertices1);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.t2")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(allVertices2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.t2")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(allVertices2);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.t3")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(allVertices3);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.t3")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(allVertices3);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.t4")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(vertices4);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g2.t4")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(vertices4);
        }

        let vertices1 = [
            [0, 1],
            [1, 0],
            [0, 0],
        ];
        let vertex2_1 = [3, -2];
        let vertices3 = [
            [5, 2],
            [6, -1],
        ];
        let vertices4 = [
            [9, 0],
            [-4, 5],
            [2, -3],
        ];

        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move g1/t1 up and to the right
        let dx = 3,
            dy = 2;
        vertices1 = vertices1.map((v) => [v[0] + dx, v[1] + dy]);
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("g1.t1"),
            pointCoords: vertices1,
            core,
        });
        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move vertices of g2/t1 independently
        vertices1 = [
            [7, -5],
            [-1, -4],
            [-9, 8],
        ];
        for (let i = 0; i < 3; i++) {
            await movePolygon({
                componentIdx: await resolvePathToNodeIdx("g2.t1"),
                pointCoords: { [i]: vertices1[i] },
                core,
            });
        }
        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move g2/t2 up and to the left
        dx = -4;
        dy = 1;
        vertex2_1 = [vertex2_1[0] + dx, vertex2_1[1] + dy];
        for (let i = 1; i < 3; i++) {
            vertices1[i] = [vertices1[i][0] + dx, vertices1[i][1] + dy];
        }
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("g2.t2"),
            pointCoords: [vertex2_1, ...vertices1.slice(1)],
            core,
        });
        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move vertices of g1/t2 independently
        vertex2_1 = [1, 8];
        vertices1[1] = [5, 4];
        vertices1[2] = [-3, -5];
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("g1.t2"),
            pointCoords: { 0: vertex2_1 },
            core,
        });
        for (let i = 1; i < 3; i++) {
            await movePolygon({
                componentIdx: await resolvePathToNodeIdx("g1.t2"),
                pointCoords: { [i]: vertices1[i] },
                core,
            });
        }

        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move g1/t3 down and to the right
        dx = 4;
        dy = -5;
        vertices3 = vertices3.map((v) => [v[0] + dx, v[1] + dy]);
        vertices1[2] = [vertices1[2][0] + dx, vertices1[2][1] + dy];
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("g1.t3"),
            pointCoords: [...vertices3, ...vertices1.slice(2)],
            core,
        });
        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move vertices of g2/t3 independently
        vertices3 = [
            [0, 0],
            [8, -6],
        ];
        vertices1[2] = [9, -5];
        for (let i = 0; i < 2; i++) {
            await movePolygon({
                componentIdx: await resolvePathToNodeIdx("g2.t3"),
                pointCoords: { [i]: vertices3[i] },
                core,
            });
        }
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("g2.t3"),
            pointCoords: { 2: vertices1[2] },
            core,
        });
        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move g2/t4 down and to the left
        dx = -7;
        dy = -8;
        vertices4 = vertices4.map((v) => [v[0] + dx, v[1] + dy]);
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("g2.t4"),
            pointCoords: vertices4,
            core,
        });
        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });

        // move vertices of g1/t4 independently
        vertices4 = [
            [-7, 0],
            [0, -8],
            [4, 6],
        ];
        for (let i = 0; i < 3; i++) {
            await movePolygon({
                componentIdx: await resolvePathToNodeIdx("g1.t4"),
                pointCoords: { [i]: vertices4[i] },
                core,
            });
        }
        await check_items({ vertices1, vertex2_1, vertices3, vertices4 });
    });

    it("constrain to triangle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle" vertices="(0,0) (6,0) (0,6)" />
    <point name="P" x="10" y="10">
      <constrainTo>$triangle</constrainTo>
    </point>
  </graph>
  `,
        });

        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[0].tree,
            ).closeTo(x, 1e-14);
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[1].tree,
            ).closeTo(y, 1e-14);
        }

        await check_items(3, 3);

        // move point upper left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: 8,
            core,
        });
        await check_items(0, 6);

        // move point to left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -5,
            y: 4,
            core,
        });
        await check_items(0, 4);

        // move point to lower left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -7,
            y: -3,
            core,
        });
        await check_items(0, 0);

        // move point to lower right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 8,
            y: -8,
            core,
        });
        await check_items(6, 0);

        // move point to right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 8,
            y: 4,
            core,
        });
        await check_items(5, 1);

        // move point to middle
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1.5,
            y: 3.5,
            core,
        });
        await check_items(2, 4);

        // move point a little left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 3,
            core,
        });
        await check_items(0, 3);
    });

    async function test_reflected_triangles(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        initial_vertices: number[][],
    ) {
        async function check_items(vertices1: number[][]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const vertices2 = vertices1.map((v) => [v[1], v[0]]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("triangle1")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(vertices1);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("triangle2")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(vertices2);
        }

        let vertices1 = initial_vertices;
        await check_items(vertices1);

        // move first triangle vertices
        vertices1 = [
            [8, -1],
            [0, -5],
            [7, 9],
        ];
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("triangle1"),
            pointCoords: vertices1,
            core,
        });
        await check_items(vertices1);

        // move second triangle vertices
        vertices1 = [
            [-5, 2],
            [-8, 9],
            [3, -6],
        ];
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("triangle2"),
            pointCoords: vertices1.map((v) => [v[1], v[0]]),
            core,
        });
        await check_items(vertices1);
    }

    it("reflect triangle via individual vertices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle1" vertices="(1,2) (3,4) (-5,6)" />
    <triangle name="triangle2" vertices="($(triangle1.vertexX1_2), $(triangle1.vertexX1_1)) ($(triangle1.vertexX2_2), $(triangle1.vertexX2_1)) $flip3" />
  </graph>

  <point name="flip3">($triangle1.vertices[3][2], $triangle1.vertices[3][1])</point>

  `,
        });

        await test_reflected_triangles(core, resolvePathToNodeIdx, [
            [1, 2],
            [3, 4],
            [-5, 6],
        ]);
    });

    it("reflect triangle via individual vertices, one vertex specified", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle1" vertices="(1,2)" />
    <triangle name="triangle2" vertices="($(triangle1.vertexX1_2), $(triangle1.vertexX1_1)) ($(triangle1.vertexX2_2), $(triangle1.vertexX2_1)) $flip3" />
  </graph>

  <point name="flip3">($triangle1.vertices[3][2], $triangle1.vertices[3][1])</point>

  `,
        });

        await test_reflected_triangles(core, resolvePathToNodeIdx, [
            [1, 2],
            [1, 0],
            [0, 0],
        ]);
    });

    async function test_triangle_one_vertex_reflection(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        initial_vertex2: number[],
        initial_vertex3: number[],
    ) {
        async function check_items(vertex2: number[], vertex3: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const vertices = [[vertex2[1], vertex2[0]], vertex2, vertex3];

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("triangle")
                ].stateValues.vertices.map((v) => v.map((x) => x.tree)),
            ).eqls(vertices);
        }

        let vertex2 = initial_vertex2;
        let vertex3 = initial_vertex3;
        await check_items(vertex2, vertex3);

        // move first vertex
        vertex2 = [4, -1];
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("triangle"),
            pointCoords: { 0: [vertex2[1], vertex2[0]] },
            core,
        });
        await check_items(vertex2, vertex3);

        // move second vertex
        vertex2 = [7, -8];
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("triangle"),
            pointCoords: { 1: vertex2 },
            core,
        });
        await check_items(vertex2, vertex3);

        // move third vertex
        vertex3 = [0, 6];
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("triangle"),
            pointCoords: { 2: vertex3 },
            core,
        });
        await check_items(vertex2, vertex3);
    }

    it("triangle with one vertex refection of other", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="A" hide>
    ($B.y,
    $B.x)
  </point>
  <point name="B" hide>(3,5)</point>
  <point name="C" hide>(-5,2)</point>
  <triangle name="triangle" vertices="$A $B $C" />
  </graph>
  `,
        });

        await test_triangle_one_vertex_reflection(
            core,
            resolvePathToNodeIdx,
            [3, 5],
            [-5, 2],
        );
    });

    it("triangle with one vertex refection of other with internal references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <triangle name="triangle" vertices="($(triangle.vertexX2_2), $(triangle.vertexX2_1)) (3,5) (-5,2)" />
  </graph>
  `,
        });

        await test_triangle_one_vertex_reflection(
            core,
            resolvePathToNodeIdx,
            [3, 5],
            [-5, 2],
        );
    });

    it("triangle with one vertex refection of other with internal references, one vertex specified", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <triangle name="triangle" vertices="($(triangle.vertexX2_2), $(triangle.vertexX2_1))" />
  </graph>
  `,
        });

        await test_triangle_one_vertex_reflection(
            core,
            resolvePathToNodeIdx,
            [1, 0],
            [0, 0],
        );
    });

    it("area and perimeter", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="t"/>
  </graph>
  <p>Area: <number extend="$t.area" name="area" /></p>
  <p>Perimeter: <number extend="$t.perimeter" name="perimeter" /></p>
  `,
        });

        let area = 0.5;
        let perimeter = 2 + Math.sqrt(2);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("area")].stateValues
                .value,
        ).eq(area);
        expect(
            stateVariables[await resolvePathToNodeIdx("perimeter")].stateValues
                .value,
        ).eq(perimeter);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("t"),
            pointCoords: { 2: [10, 0] },
            core,
        });

        area = 10 / 2 - 1 / 2;
        perimeter = 9 + Math.sqrt(100 + 1) + Math.sqrt(2);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("area")].stateValues
                .value,
        ).eq(area);
        expect(
            stateVariables[await resolvePathToNodeIdx("perimeter")].stateValues
                .value,
        ).eq(perimeter);
    });

    it("Rigid triangle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="triangle" vertices="(0,6) (3,0)" rigid />
    <point extend="$triangle.vertex1" name="vertex1" />
    <point extend="$triangle.vertex2" name="vertex2" />
    <point extend="$triangle.vertex3" name="vertex3" />
  </graph>
  `,
        });

        async function check_items(vertices: number[][]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("triangle")
                ].stateValues.vertices.map((v) =>
                    v.map((x) => Math.round(x.tree * 1e12) / 1e12),
                ),
            ).eqls(vertices);

            for (let i = 0; i < 3; i++) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`vertex${i + 1}`)
                    ].stateValues.xs.map(
                        (v) => Math.round(v.tree * 1e12) / 1e12,
                    ),
                ).eqls(vertices[i]);
            }
        }

        let vertices = [
            [0, 6],
            [3, 0],
            [0, 0],
        ];
        await check_items(vertices);

        // move triangle up and to the right

        let moveX = 3;
        let moveY = 2;

        vertices = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("triangle"),
            pointCoords: vertices,
            core,
        });
        await check_items(vertices);

        // move a point rotates
        vertices = [
            [0, 3],
            [6, 6],
            [6, 3],
        ];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("vertex1"),
            x: -12,
            y: 0,
            core,
        });
        await check_items(vertices);
    });
});
