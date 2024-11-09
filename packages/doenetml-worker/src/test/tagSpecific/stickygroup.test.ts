import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    moveLineSegment,
    movePoint,
    movePolygon,
    movePolyline,
} from "../utils/actions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

async function testScene({
    core,
    vertices1,
    vertices2,
    point,
    polygon1Name = "/pg1",
    polygon2Name = "/pg2",
    pointName = "/A",
    stickyGroupName = "/sg",
    graph1Name = "/g1",
    graph2Name = "/g2",
    graph3Name = "/g3",
    graph4Name = "/g4",
}: {
    core: Core;
    vertices1: number[][];
    vertices2: number[][];
    point: number[];
    polygon1Name?: string;
    polygon2Name?: string;
    pointName?: string;
    stickyGroupName?: string;
    graph1Name?: string;
    graph2Name?: string;
    graph3Name?: string;
    graph4Name?: string;
}) {
    let stateVariables = await returnAllStateVariables(core);
    expect(
        stateVariables[graph1Name + stickyGroupName + polygon1Name].stateValues
            .numVertices,
    ).eq(vertices1.length);
    expect(
        stateVariables[graph2Name + stickyGroupName + polygon1Name].stateValues
            .numVertices,
    ).eq(vertices1.length);
    expect(
        stateVariables[graph3Name + stickyGroupName + polygon1Name].stateValues
            .numVertices,
    ).eq(vertices1.length);
    expect(
        stateVariables[graph4Name + stickyGroupName + polygon1Name].stateValues
            .numVertices,
    ).eq(vertices1.length);

    expect(
        stateVariables[graph1Name + stickyGroupName + polygon2Name].stateValues
            .numVertices,
    ).eq(vertices2.length);
    expect(
        stateVariables[graph2Name + stickyGroupName + polygon2Name].stateValues
            .numVertices,
    ).eq(vertices2.length);
    expect(
        stateVariables[graph3Name + stickyGroupName + polygon2Name].stateValues
            .numVertices,
    ).eq(vertices2.length);
    expect(
        stateVariables[graph4Name + stickyGroupName + polygon2Name].stateValues
            .numVertices,
    ).eq(vertices2.length);

    for (let i in vertices1) {
        for (let dim in vertices1[i]) {
            if (Number.isFinite(vertices1[i][dim])) {
                expect(
                    stateVariables[
                        graph1Name + stickyGroupName + polygon1Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices1[i][dim], 1e-12);
                expect(
                    stateVariables[
                        graph2Name + stickyGroupName + polygon1Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices1[i][dim], 1e-12);
                expect(
                    stateVariables[
                        graph3Name + stickyGroupName + polygon1Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices1[i][dim], 1e-12);
                expect(
                    stateVariables[
                        graph4Name + stickyGroupName + polygon1Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices1[i][dim], 1e-12);
            } else {
                expect(
                    stateVariables[graph1Name + stickyGroupName + polygon1Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices1[i][dim]);
                expect(
                    stateVariables[graph2Name + stickyGroupName + polygon1Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices1[i][dim]);
                expect(
                    stateVariables[graph3Name + stickyGroupName + polygon1Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices1[i][dim]);
                expect(
                    stateVariables[graph4Name + stickyGroupName + polygon1Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices1[i][dim]);
            }
        }
    }

    for (let i in vertices2) {
        for (let dim in vertices2[i]) {
            if (Number.isFinite(vertices2[i][dim])) {
                expect(
                    stateVariables[
                        graph1Name + stickyGroupName + polygon2Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices2[i][dim], 1e-12);
                expect(
                    stateVariables[
                        graph2Name + stickyGroupName + polygon2Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices2[i][dim], 1e-12);
                expect(
                    stateVariables[
                        graph3Name + stickyGroupName + polygon2Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices2[i][dim], 1e-12);
                expect(
                    stateVariables[
                        graph4Name + stickyGroupName + polygon2Name
                    ].stateValues.vertices[i][dim].evaluate_to_constant(),
                ).closeTo(vertices2[i][dim], 1e-12);
            } else {
                expect(
                    stateVariables[graph1Name + stickyGroupName + polygon2Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices2[i][dim]);
                expect(
                    stateVariables[graph2Name + stickyGroupName + polygon2Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices2[i][dim]);
                expect(
                    stateVariables[graph3Name + stickyGroupName + polygon2Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices2[i][dim]);
                expect(
                    stateVariables[graph4Name + stickyGroupName + polygon2Name]
                        .stateValues.vertices[i][dim].tree,
                ).eq(vertices2[i][dim]);
            }
        }
    }

    for (let dim in point) {
        if (Number.isFinite(point[dim])) {
            expect(
                stateVariables[
                    graph1Name + stickyGroupName + pointName
                ].stateValues.xs[dim].evaluate_to_constant(),
            ).closeTo(point[dim], 1e-12);
            expect(
                stateVariables[
                    graph2Name + stickyGroupName + pointName
                ].stateValues.xs[dim].evaluate_to_constant(),
            ).closeTo(point[dim], 1e-12);
            expect(
                stateVariables[
                    graph3Name + stickyGroupName + pointName
                ].stateValues.xs[dim].evaluate_to_constant(),
            ).closeTo(point[dim], 1e-12);
            expect(
                stateVariables[
                    graph4Name + stickyGroupName + pointName
                ].stateValues.xs[dim].evaluate_to_constant(),
            ).closeTo(point[dim], 1e-12);
        } else {
            expect(
                stateVariables[graph1Name + stickyGroupName + pointName]
                    .stateValues.xs[dim].tree,
            ).eq(point[dim]);
            expect(
                stateVariables[graph2Name + stickyGroupName + pointName]
                    .stateValues.xs[dim].tree,
            ).eq(point[dim]);
            expect(
                stateVariables[graph3Name + stickyGroupName + pointName]
                    .stateValues.xs[dim].tree,
            ).eq(point[dim]);
            expect(
                stateVariables[graph4Name + stickyGroupName + pointName]
                    .stateValues.xs[dim].tree,
            ).eq(point[dim]);
        }
    }
}

describe("StickyGroup tag tests", async () => {
    it("attract polygons and point when translating", async () => {
        let core = await createTestCore({
            doenetML: `
        <graph name="g1" newNamespace>
            <stickyGroup name="sg" newNamespace>
                <polygon name="pg1" vertices="(1,2) (4,5) (-2,5)" rigid filled />

                <polygon name="pg2" vertices="(7,8) (5,4) (9,1) (7,3)" styleNumber="2" filled />

                <point name="A" styleNumber="5">(-6,2)</point>

            </stickyGroup>
        </graph>

        <graph name="g2" newNamespace>
            <stickyGroup name="sg" newNamespace>
                <polygon name="pg1" copySource="../../g1/sg/pg1" />
                <polygon name="pg2" copySource="../../g1/sg/pg2" />
                <point name="A" copySource="../../g1/sg/A" />
            </stickyGroup>
        </graph>
        <graph name="g3" newNamespace>
            <stickyGroup name="sg" newNamespace copySource="../g2/sg" />
        </graph>
        <graph name="g4" copySource="g3" />

    `,
        });

        let vertices1 = [
            [1, 2],
            [4, 5],
            [-2, 5],
        ];

        let vertices2 = [
            [7, 8],
            [5, 4],
            [9, 1],
            [7, 3],
        ];

        let point = [-6, 2];

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 vertex near vertex of polygon 2
        let moveX = 0.8;
        let moveY = -1.2;

        let requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g1/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        let actualMoveX = 1;
        let actualMoveY = -1;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);
        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 vertex near vertex of polygon 1
        moveX = -5.2;
        moveY = -2.3;

        let requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g2/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = -5;
        actualMoveY = -2;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 left further to unstick from polygon 1
        moveX = -1;
        moveY = 0;

        requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g3/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = -1;
        actualMoveY = 0;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 vertex near point
        moveX = -4.8;
        moveY = -1.8;

        requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g4/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        actualMoveX = -5;
        actualMoveY = -2;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move point near polygon2 vertex
        await movePoint({ name: "/g1/sg/A", x: 0.8, y: 0.8, core });

        point = [1, 1];

        await testScene({ core, vertices1, vertices2, point });

        // move point away from vertices and edges
        await movePoint({ name: "/g2/sg/A", x: -2, y: 1, core });

        point = [-2, 1];

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 vertex near edge of polygon 2
        moveX = 1.4;
        moveY = 3;

        requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g3/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        actualMoveX = 1;
        actualMoveY = 3;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);
        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 vertex next edge of polygon 1
        moveX = 1.2;
        moveY = 1.8;

        requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g4/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = 1;
        actualMoveY = 2;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 edge near vertex of polygon 2
        moveX = 2.8;
        moveY = 0.2;

        requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g1/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        actualMoveX = 3;
        actualMoveY = 0;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);
        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 edge next vertex of polygon 1
        moveX = 2.2;
        moveY = -2;

        requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g2/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = 2;
        actualMoveY = -2;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });
    });

    it("attract parallel edges of polygons when translating", async () => {
        let core = await createTestCore({
            doenetML: `
        <graph name="g1" newNamespace>
            <stickyGroup name="sg" newNamespace>
                <polygon name="pg1" vertices="(1,2) (4,5) (-2,5)" rigid filled />

                <polygon name="pg2" vertices="(9,8) (3,2) (9,1)" styleNumber="2" filled />

            </stickyGroup>
        </graph>

        <graph name="g2" newNamespace>
            <stickyGroup name="sg" newNamespace>
                <polygon name="pg1" copySource="../../g1/sg/pg1" />
                <polygon name="pg2" copySource="../../g1/sg/pg2" />
                <point name="A" copySource="../../g1/sg/A" />
            </stickyGroup>
        </graph>
        <graph name="g3" newNamespace>
            <stickyGroup name="sg" newNamespace copySource="../g2/sg" />
        </graph>
        <graph name="g4" copySource="g3" />

    `,
        });

        let vertices1 = [
            [1, 2],
            [4, 5],
            [-2, 5],
        ];

        let vertices2 = [
            [9, 8],
            [3, 2],
            [9, 1],
        ];

        let point = [];

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 edge near edge of polygon 2

        let moveX = 1.5;
        let moveY = 0;

        let requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g1/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        let actualMoveX = 1.75;
        let actualMoveY = -0.25;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);
        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 so edge is just past edge of polygon 2, vertices attract

        moveX = 0;
        moveY = 0.25;

        requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g2/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        actualMoveX = 0.25;
        actualMoveY = 0.25;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 edge so that polygon 2 edge is just past edge of polygon 1, vertices attract

        moveX = 2.9;
        moveY = 2.8;

        requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g3/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        actualMoveX = 3;
        actualMoveY = 3;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 1 edge further so vertices don't attract

        moveX = -0.5;
        moveY = -0.4;

        requested_vertices1 = vertices1.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g4/sg/pg1",
            pointCoords: requested_vertices1,
            core,
        });

        actualMoveX = -0.45;
        actualMoveY = -0.45;

        vertices1 = vertices1.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 edge so just past edge of polygon 1

        moveX = 2.5;
        moveY = 2.0;

        let requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g3/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = 2.25;
        actualMoveY = 2.25;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);
        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 less past edge of polygon 1 so vertices attract

        moveX = 0.2;
        moveY = 0.0;

        requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g4/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = 0.3;
        actualMoveY = 0.3;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 edge so that polygon 1 edge is just past edge of polygon 2, vertices attract

        moveX = -2.8;
        moveY = -2.6;

        requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g1/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = -3;
        actualMoveY = -3;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);
        await testScene({ core, vertices1, vertices2, point });

        // move polygon 2 edge further so vertices don't attract

        moveX = -0.5;
        moveY = -0.3;

        requested_vertices2 = vertices2.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);

        await movePolygon({
            name: "/g2/sg/pg2",
            pointCoords: requested_vertices2,
            core,
        });

        actualMoveX = -0.4;
        actualMoveY = -0.4;

        vertices2 = vertices2.map((vertex) => [
            vertex[0] + actualMoveX,
            vertex[1] + actualMoveY,
        ]);

        await testScene({ core, vertices1, vertices2, point });
    });

    it("attract polygons when moving vertices, rigid and non-rigid", async () => {
        let core = await createTestCore({
            doenetML: `
        <graph name="g1">
            <stickyGroup name="sg">
                <polygon name="pg1" vertices="(1,2) (4,5) (-2,5)" rigid filled />

                <polygon name="pg2" vertices="(7,8) (5,4) (9,1) (7,3)" styleNumber="2" filled />

            </stickyGroup>
        </graph>

        <p>$pg1.vertices</p>
        <p>$pg2.vertices</p>

    `,
        });

        let vertices2 = [
            [7, 8],
            [5, 4],
            [9, 1],
            [7, 3],
        ];

        // rotate polygon 1 to nearly match slope of nearby polygon 2 edge
        await movePolygon({
            name: "/pg1",
            pointCoords: { 0: [1.6, 2] },
            core,
        });

        let desired_slope = 2;

        let stateVariables = await returnAllStateVariables(core);

        let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
        let actual_slope = (pg1[1][1] - pg1[0][1]) / (pg1[1][0] - pg1[0][0]);

        expect(actual_slope).closeTo(desired_slope, 1e-12);

        // if move polygon 1 further away, slope does not attract to polygon 2 edge
        stateVariables = await returnAllStateVariables(core);

        let moveX = -1;
        let moveY = 1;

        let desired_vertices = stateVariables[
            "/pg1"
        ].stateValues.numericalVertices.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);
        await movePolygon({
            name: "/pg1",
            pointCoords: desired_vertices,
            core,
        });

        // perturb vertex slightly
        await movePolygon({
            name: "/pg1",
            pointCoords: {
                0: [
                    desired_vertices[0][0] + 0.01,
                    desired_vertices[0][1] - 0.01,
                ],
            },
            core,
        });

        desired_slope = 2;

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
        actual_slope = (pg1[1][1] - pg1[0][1]) / (pg1[1][0] - pg1[0][0]);

        expect(actual_slope).not.closeTo(desired_slope, 0.001);

        // polygon 1 edge still attracts to vertical
        await movePolygon({
            name: "/pg1",
            pointCoords: {
                0: [-2.1, 5.1],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

        // edge should be vertical
        expect(pg1[2][0]).closeTo(pg1[1][0], 1e-12);

        // polygon 1 edge still attracts to horizontal
        await movePolygon({
            name: "/pg1",
            pointCoords: {
                0: [0.2, 7.2],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

        // edge should be horizontal
        expect(pg1[2][1]).closeTo(pg1[1][1], 1e-12);

        // move polygon 1 and rotate so vertex is very close to polygon 2 vertex to attract
        stateVariables = await returnAllStateVariables(core);

        moveX = 7;
        moveY = -6.5;

        desired_vertices = stateVariables[
            "/pg1"
        ].stateValues.numericalVertices.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);
        await movePolygon({
            name: "/pg1",
            pointCoords: desired_vertices,
            core,
        });

        await movePolygon({
            name: "/pg1",
            pointCoords: {
                0: [5.2, -0.8],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

        // point3 should be at polygon 2's vertex
        expect(pg1[2][0]).closeTo(9, 1e-12);
        expect(pg1[2][1]).closeTo(1, 1e-12);

        // small change in rotation stops attraction
        await movePolygon({
            name: "/pg1",
            pointCoords: {
                0: [5.3, -0.8],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

        // point3 should be a small distance from polygon 2's vertex
        expect(pg1[2][0]).not.closeTo(9, 0.01);
        expect(pg1[2][1]).not.closeTo(1, 0.01);

        // rotate and move polygon 1 to have vertical edge
        await movePolygon({
            name: "/pg1",
            pointCoords: {
                0: [4.9, -1.6],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        moveX = -7;
        moveY = 0.5;

        desired_vertices = stateVariables[
            "/pg1"
        ].stateValues.numericalVertices.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);
        await movePolygon({
            name: "/pg1",
            pointCoords: desired_vertices,
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

        // edge should be vertical
        expect(pg1[2][0]).closeTo(pg1[1][0], 1e-12);

        // move polygon 2 vertex so edge attracts to polygon 1 vertex
        await movePolygon({
            name: "/pg2",
            pointCoords: { 2: [-0.3, -6] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
        let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex 2 of pg1 should be along edge of vertices of 2 and 3 of pg2
        let slope1 = (pg2[2][1] - pg2[1][1]) / (pg2[2][0] - pg2[1][0]);
        let slope2 = (pg1[1][1] - pg2[1][1]) / (pg1[1][0] - pg2[1][0]);

        expect(slope2).closeTo(slope1, 1e-12);

        // vertices other than 3 of polygon 2 should be in original positions
        expect(pg2[0]).eqls(vertices2[0]);
        expect(pg2[1]).eqls(vertices2[1]);
        expect(pg2[3]).eqls(vertices2[3]);

        vertices2[2] = pg2[2];

        // move polygon 2 vertex so edge almost attracts to polygon 1 vertex
        await movePolygon({
            name: "/pg2",
            pointCoords: { 0: [-10, 0.8] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex did not attract
        expect(pg2[0]).eqls([-10, 0.8]);

        expect(pg2[1]).eqls(vertices2[1]);
        expect(pg2[2]).eqls(vertices2[2]);
        expect(pg2[3]).eqls(vertices2[3]);

        vertices2[0] = pg2[0];

        // move polygon 2 vertex closer so edge does attract to polygon 1 vertex
        await movePolygon({
            name: "/pg2",
            pointCoords: { 0: [-10, 0.6] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex 3 of pg1 should be along edge of vertices of 1 and 4 of pg2
        slope1 = (pg2[3][1] - pg2[0][1]) / (pg2[3][0] - pg2[0][0]);
        slope2 = (pg1[2][1] - pg2[0][1]) / (pg1[2][0] - pg2[0][0]);

        expect(slope2).closeTo(slope1, 1e-12);

        // vertices other than 1 of polygon 2 should be in original positions
        expect(pg2[1]).eqls(vertices2[1]);
        expect(pg2[2]).eqls(vertices2[2]);
        expect(pg2[3]).eqls(vertices2[3]);

        vertices2[0] = pg2[0];

        // move polygon 2 vertex so almost attracts to polygon 1 edge
        await movePolygon({
            name: "/pg2",
            pointCoords: { 1: [1.7, -1] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex did not attract
        expect(pg2[1]).eqls([1.7, -1]);

        expect(pg2[0]).eqls(vertices2[0]);
        expect(pg2[2]).eqls(vertices2[2]);
        expect(pg2[3]).eqls(vertices2[3]);

        vertices2[1] = pg2[1];

        // move polygon 2 vertex closer so does attract to polygon 1 edge
        await movePolygon({
            name: "/pg2",
            pointCoords: { 1: [1.4, -1] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex did attract
        expect(pg2[1][0]).closeTo(1, 1e-12);
        expect(pg2[1][1]).closeTo(-1, 1e-12);

        expect(pg2[0]).eqls(vertices2[0]);
        expect(pg2[2]).eqls(vertices2[2]);
        expect(pg2[3]).eqls(vertices2[3]);

        vertices2[1] = pg2[1];

        // move polygon 2 vertex close so attracts to polygon 1 vertex
        await movePolygon({
            name: "/pg2",
            pointCoords: { 3: [1.2, 1.8] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex did attract
        expect(pg2[3][0]).closeTo(1, 1e-12);
        expect(pg2[3][1]).closeTo(2, 1e-12);

        expect(pg2[0]).eqls(vertices2[0]);
        expect(pg2[1]).eqls(vertices2[1]);
        expect(pg2[2]).eqls(vertices2[2]);

        vertices2[3] = pg2[3];

        // move polygon 2 vertex slightly away so no longer attracts to polygon 1 vertex
        await movePolygon({
            name: "/pg2",
            pointCoords: { 3: [1.7, 2.8] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex did not attract
        expect(pg2[3]).eqls([1.7, 2.8]);

        expect(pg2[0]).eqls(vertices2[0]);
        expect(pg2[1]).eqls(vertices2[1]);
        expect(pg2[2]).eqls(vertices2[2]);

        vertices2[3] = pg2[3];

        // move polygon 2 vertex so edge attracts to polygon 1 edge
        await movePolygon({
            name: "/pg2",
            pointCoords: { 0: [-6, -5.1] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex 1 and 4 of pg2 should be along edge of vertices of 1 and 3 of pg1
        slope1 = (pg1[2][1] - pg1[0][1]) / (pg1[2][0] - pg1[0][0]);
        slope2 = (pg2[0][1] - pg1[0][1]) / (pg2[0][0] - pg1[0][0]);
        let slope3 = (pg2[3][1] - pg1[0][1]) / (pg2[3][0] - pg1[0][0]);

        expect(slope2).closeTo(slope1, 1e-12);
        expect(slope3).closeTo(slope1, 1e-12);

        // vertex 4 moved
        expect(pg2[3][0]).not.closeTo(vertices2[3][0], 0.01);
        expect(pg2[3][1]).not.closeTo(vertices2[3][1], 0.01);

        // other vertices did not move
        expect(pg2[1]).eqls(vertices2[1]);
        expect(pg2[2]).eqls(vertices2[2]);

        vertices2[0] = pg2[0];
        vertices2[3] = pg2[3];

        // make sure don't move point along polygon 1 edge when attracting polygon 2 point to vertex
        await movePolygon({
            name: "/pg2",
            pointCoords: { 2: [1.2, -4.2] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertex did attract
        expect(pg2[2][0]).closeTo(1, 1e-12);
        expect(pg2[2][1]).closeTo(-4, 1e-12);

        // other vertices did not move
        expect(pg2[0][0]).closeTo(vertices2[0][0], 1e-12);
        expect(pg2[0][1]).closeTo(vertices2[0][1], 1e-12);
        expect(pg2[1][0]).closeTo(vertices2[1][0], 1e-12);
        expect(pg2[1][1]).closeTo(vertices2[1][1], 1e-12);
        expect(pg2[3][0]).closeTo(vertices2[3][0], 1e-12);
        expect(pg2[3][1]).closeTo(vertices2[3][1], 1e-12);

        vertices2[2] = pg2[2];

        // attract from other side of vertex
        await movePolygon({
            name: "/pg2",
            pointCoords: { 2: [0.8, -3.8] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

        // vertices did not move
        expect(pg2[0][0]).closeTo(vertices2[0][0], 1e-12);
        expect(pg2[0][1]).closeTo(vertices2[0][1], 1e-12);
        expect(pg2[1][0]).closeTo(vertices2[1][0], 1e-12);
        expect(pg2[1][1]).closeTo(vertices2[1][1], 1e-12);
        expect(pg2[2][0]).closeTo(vertices2[2][0], 1e-12);
        expect(pg2[2][1]).closeTo(vertices2[2][1], 1e-12);
        expect(pg2[3][0]).closeTo(vertices2[3][0], 1e-12);
        expect(pg2[3][1]).closeTo(vertices2[3][1], 1e-12);
    });

    it("attract rigid polyline and preserveSimilarity polygon when moving vertices", async () => {
        let core = await createTestCore({
            doenetML: `
        <graph name="g1">
            <stickyGroup name="sg">
                <polyline name="pl" vertices=" (-2,5) (1,2) (4,5)" rigid rotationHandleVertices="2" />

                <polygon name="pg" vertices="(7,8) (5,4) (9,1) (7,3)" styleNumber="2" preserveSimilarity filled />

            </stickyGroup>
        </graph>

        <p>$pg1.vertices</p>
        <p>$pg2.vertices</p>
    `,
        });

        // rotate polyline 1 to nearly match slope of nearby polygon edge
        await movePolyline({
            name: "/pl",
            pointCoords: { 1: [1.6, 2] },
            core,
        });

        let desired_slope = 2;

        let stateVariables = await returnAllStateVariables(core);

        let pl = stateVariables["/pl"].stateValues.numericalVertices;
        let actual_slope = (pl[1][1] - pl[2][1]) / (pl[1][0] - pl[2][0]);

        expect(actual_slope).closeTo(desired_slope, 1e-12);

        // if move polyline further away, slope does not attract to polygon edge
        stateVariables = await returnAllStateVariables(core);

        let moveX = -1;
        let moveY = 1;

        let desired_vertices = stateVariables[
            "/pl"
        ].stateValues.numericalVertices.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);
        await movePolyline({
            name: "/pl",
            pointCoords: desired_vertices,
            core,
        });

        // perturb vertex slightly
        await movePolyline({
            name: "/pl",
            pointCoords: {
                1: [
                    desired_vertices[1][0] + 0.01,
                    desired_vertices[1][1] - 0.01,
                ],
            },
            core,
        });

        desired_slope = 2;

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;
        actual_slope = (pl[1][1] - pl[2][1]) / (pl[1][0] - pl[2][0]);

        expect(actual_slope).closeTo(desired_slope, 0.05);
        expect(actual_slope).not.closeTo(desired_slope, 0.001);

        // missing edge of polyline does not attract to slope of polygon edge
        stateVariables = await returnAllStateVariables(core);

        moveX = 3.5;
        moveY = 0;

        desired_vertices = stateVariables[
            "/pl"
        ].stateValues.numericalVertices.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);
        await movePolyline({
            name: "/pl",
            pointCoords: desired_vertices,
            core,
        });

        await movePolyline({
            name: "/pl",
            pointCoords: {
                1: [2.1, 5.71],
            },
            core,
        });

        desired_slope = 2;

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;
        actual_slope = (pl[0][1] - pl[2][1]) / (pl[0][0] - pl[2][0]);

        expect(actual_slope).closeTo(desired_slope, 0.05);
        expect(actual_slope).not.closeTo(desired_slope, 0.001);

        // missing edge of polyline does not attract to polygon vertex
        await movePolyline({
            name: "/pl",
            pointCoords: {
                1: [2.1, 4.3],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        moveX = -0.13;
        moveY = 0;

        desired_vertices = stateVariables[
            "/pl"
        ].stateValues.numericalVertices.map((vertex) => [
            vertex[0] + moveX,
            vertex[1] + moveY,
        ]);
        await movePolyline({
            name: "/pl",
            pointCoords: desired_vertices,
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;

        // expect point [5,4] of polygon 2 to be nearly but not quite colinear
        // with the first and last vertex (so would have attracted if edge existed)
        let slope1 = (4 - pl[0][1]) / (5 - pl[0][0]);
        let slope2 = (4 - pl[2][1]) / (5 - pl[2][0]);

        expect(slope1).closeTo(slope2, 0.1);
        expect(slope1).not.closeTo(slope2, 0.001);

        // rotate polyline to have vertical edge
        await movePolyline({
            name: "/pl",
            pointCoords: {
                1: [2.3, 6.3],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;

        // edge should be vertical
        expect(pl[2][0]).closeTo(pl[1][0], 1e-12);

        // polyline's missing edge does not snap to vertical
        await movePolyline({
            name: "/pl",
            pointCoords: {
                1: [5.8, 4.8],
            },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;

        // edge should be vertical
        expect(pl[2][0]).closeTo(pl[0][0], 0.1);
        expect(pl[2][0]).not.closeTo(pl[0][0], 0.001);

        // move polygon vertex so edge attracts to polyline vertex
        await movePolygon({
            name: "/pg",
            pointCoords: { 0: [0, 2.4] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;
        let pg = stateVariables["/pg"].stateValues.numericalVertices;

        // vertex 2 of pg1 should be along edge of vertices of 2 and 3 of pg2
        slope1 = (pg[1][1] - pg[0][1]) / (pg[1][0] - pg[0][0]);
        slope2 = (pl[0][1] - pg[0][1]) / (pl[0][0] - pg[0][0]);

        expect(slope2).closeTo(slope1, 1e-12);

        // vertex1 should be close to where moved it
        expect(pg[0][0]).closeTo(0, 0.1);
        expect(pg[0][1]).closeTo(2.4, 0.1);

        // move polygon vertex so edge almost attracts to polyline vertex
        await movePolygon({
            name: "/pg",
            pointCoords: { 0: [0, 2.2] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg = stateVariables["/pg"].stateValues.numericalVertices;

        // vertex did not attract
        expect(pg[0][0]).closeTo(0, 1e-10);
        expect(pg[0][1]).closeTo(2.2, 1e-10);

        // move polygon vertex so almost attracts to polyline edge
        await movePolygon({
            name: "/pg",
            pointCoords: { 0: [4.4, 3.1] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        pg = stateVariables["/pg"].stateValues.numericalVertices;

        // vertex did not attract
        expect(pg[0][0]).closeTo(4.4, 1e-10);
        expect(pg[0][1]).closeTo(3.1, 1e-10);

        // move polygon vertex closer so does attract to polyline edge
        await movePolygon({
            name: "/pg",
            pointCoords: { 0: [4.4, 3.3] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;
        pg = stateVariables["/pg"].stateValues.numericalVertices;

        // vertex 1 of pg should be along edge of vertices of 1 and 2 of pg
        slope1 = (pl[1][1] - pl[0][1]) / (pl[1][0] - pl[0][0]);
        slope2 = (pg[0][1] - pl[0][1]) / (pg[0][0] - pl[0][0]);

        expect(slope2).closeTo(slope1, 1e-12);

        // move polygon vertex does not attract missing polyline edge
        await movePolygon({
            name: "/pg",
            pointCoords: { 0: [2.8, 5.2] },
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        pl = stateVariables["/pl"].stateValues.numericalVertices;
        pg = stateVariables["/pg"].stateValues.numericalVertices;

        // vertex 1 of pg should close but not exactly along edge of vertices of 1 and 3 of pg
        let invslope1 = (pl[2][0] - pl[0][0]) / (pl[2][1] - pl[0][1]);
        let invslope2 = (pg[0][0] - pl[0][0]) / (pg[0][1] - pl[0][1]);

        expect(invslope2).closeTo(invslope1, 0.1);
        expect(invslope2).not.closeTo(invslope1, 0.001);

        // vertex did not attract
        expect(pg[0][0]).closeTo(2.8, 1e-10);
        expect(pg[0][1]).closeTo(5.2, 1e-10);
    });

    it("attract line segments", async () => {
        let core = await createTestCore({
            doenetML: `
        <graph name="g1">
            <stickyGroup name="sg">
                <lineSegment name="ls1" endpoints="(1,2) (3,4)" />
                <lineSegment name="ls2" endpoints="(-1,2) (-3,4)" styleNumber="2" />
            </stickyGroup>
        </graph>
    `,
        });

        // move endpoint of segment 1 to attract to edge of segment 2
        await moveLineSegment({
            name: "/ls1",
            point1coords: [-2.2, 2.8],
            core,
        });

        let stateVariables = await returnAllStateVariables(core);

        let ls1 = stateVariables["/ls1"].stateValues.numericalEndpoints;

        expect(ls1[0][0]).closeTo(-2, 1e-12);
        expect(ls1[0][1]).closeTo(3, 1e-12);

        // move endpoint of segment 1 further away so does not attract to edge of segment 2
        await moveLineSegment({
            name: "/ls1",
            point1coords: [-2.5, 2.5],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls1 = stateVariables["/ls1"].stateValues.numericalEndpoints;

        expect(ls1[0][0]).closeTo(-2.5, 1e-12);
        expect(ls1[0][1]).closeTo(2.5, 1e-12);

        // move endpoint of segment 1 so edge attracts to endpoint of segment 2
        await moveLineSegment({
            name: "/ls1",
            point1coords: [-3.2, 1.2],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls1 = stateVariables["/ls1"].stateValues.numericalEndpoints;

        let desired_slope = 0.5;
        let actual_slope = (ls1[1][1] - ls1[0][1]) / (ls1[1][0] - ls1[0][0]);

        expect(actual_slope).closeTo(desired_slope, 1e-12);

        // move endpoint of segment 1 so edge no longer attracts to endpoint of segment 2
        await moveLineSegment({
            name: "/ls1",
            point1coords: [-3.4, 1.4],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls1 = stateVariables["/ls1"].stateValues.numericalEndpoints;

        expect(ls1[0][0]).closeTo(-3.4, 1e-12);
        expect(ls1[0][1]).closeTo(1.4, 1e-12);

        // extension of edge of segment 1 does not attract to endpoint of segment 2
        await moveLineSegment({ name: "/ls1", point1coords: [0, 2.45], core });

        stateVariables = await returnAllStateVariables(core);

        ls1 = stateVariables["/ls1"].stateValues.numericalEndpoints;

        expect(ls1[0][0]).closeTo(0, 1e-12);
        expect(ls1[0][1]).closeTo(2.45, 1e-12);

        // move endpoint of segment 1 so attracts to endpoint of segment 2
        await moveLineSegment({
            name: "/ls1",
            point1coords: [-2.8, 4.2],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls1 = stateVariables["/ls1"].stateValues.numericalEndpoints;

        expect(ls1[0][0]).closeTo(-3, 1e-12);
        expect(ls1[0][1]).closeTo(4, 1e-12);

        // translate segment 2 so edge attracts to endpoint of segment 1
        let dx = 0.2;
        let dy = 0.2;
        await moveLineSegment({
            name: "/ls2",
            point1coords: [-2 + dx, 3 + dy],
            point2coords: [-4 + dx, 5 + dy],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        let ls2 = stateVariables["/ls2"].stateValues.numericalEndpoints;

        expect(ls2[0][0]).closeTo(-2, 1e-12);
        expect(ls2[0][1]).closeTo(3, 1e-12);
        expect(ls2[1][0]).closeTo(-4, 1e-12);
        expect(ls2[1][1]).closeTo(5, 1e-12);

        // translate segment 2 so edge no longer attracts to endpoint of segment 1
        dx = 0.4;
        dy = 0.4;
        await moveLineSegment({
            name: "/ls2",
            point1coords: [-2 + dx, 3 + dy],
            point2coords: [-4 + dx, 5 + dy],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls2 = stateVariables["/ls2"].stateValues.numericalEndpoints;

        expect(ls2[0][0]).closeTo(-2 + dx, 1e-12);
        expect(ls2[0][1]).closeTo(3 + dy, 1e-12);
        expect(ls2[1][0]).closeTo(-4 + dx, 1e-12);
        expect(ls2[1][1]).closeTo(5 + dy, 1e-12);

        // translate segment 2 so endpoint attracts to edge of segment 1
        dx = 0.0;
        dy = 0.4;
        await moveLineSegment({
            name: "/ls2",
            point1coords: [-1 + dx, 4 + dy],
            point2coords: [-3 + dx, 6 + dy],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls2 = stateVariables["/ls2"].stateValues.numericalEndpoints;

        expect(ls2[0][0]).closeTo(-1, 1e-12);
        expect(ls2[0][1]).closeTo(4, 1e-12);
        expect(ls2[1][0]).closeTo(-3, 1e-12);
        expect(ls2[1][1]).closeTo(6, 1e-12);

        // translate segment 2 so endpoint no longer attracts to edge of segment 1
        dx = 0.0;
        dy = 0.6;
        await moveLineSegment({
            name: "/ls2",
            point1coords: [-1 + dx, 4 + dy],
            point2coords: [-3 + dx, 6 + dy],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls2 = stateVariables["/ls2"].stateValues.numericalEndpoints;

        expect(ls2[0][0]).closeTo(-1 + dx, 1e-12);
        expect(ls2[0][1]).closeTo(4 + dy, 1e-12);
        expect(ls2[1][0]).closeTo(-3 + dx, 1e-12);
        expect(ls2[1][1]).closeTo(6 + dy, 1e-12);

        // translate segment 2 so endpoint attracts to endpoint of segment 1
        dx = 0.2;
        dy = 0.3;
        await moveLineSegment({
            name: "/ls2",
            point1coords: [3 + dx, 4 + dy],
            point2coords: [1 + dx, 6 + dy],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls2 = stateVariables["/ls2"].stateValues.numericalEndpoints;

        expect(ls2[0][0]).closeTo(3, 1e-12);
        expect(ls2[0][1]).closeTo(4, 1e-12);
        expect(ls2[1][0]).closeTo(1, 1e-12);
        expect(ls2[1][1]).closeTo(6, 1e-12);

        // translate segment 2 so endpoint no longer attracts to endpoint of segment 1
        dx = 0.5;
        dy = 0.3;
        await moveLineSegment({
            name: "/ls2",
            point1coords: [3 + dx, 4 + dy],
            point2coords: [1 + dx, 6 + dy],
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        ls2 = stateVariables["/ls2"].stateValues.numericalEndpoints;

        expect(ls2[0][0]).closeTo(3 + dx, 1e-12);
        expect(ls2[0][1]).closeTo(4 + dy, 1e-12);
        expect(ls2[1][0]).closeTo(1 + dx, 1e-12);
        expect(ls2[1][1]).closeTo(6 + dy, 1e-12);
    });
});
