import me from "math-expressions";
import { cesc2 } from "@doenet/utils";

describe("StickyGroup Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    async function testScene({
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
    }) {
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[graph1Name + stickyGroupName + polygon1Name]
                    .stateValues.numVertices,
            ).eq(vertices1.length);
            expect(
                stateVariables[graph2Name + stickyGroupName + polygon1Name]
                    .stateValues.numVertices,
            ).eq(vertices1.length);
            expect(
                stateVariables[graph3Name + stickyGroupName + polygon1Name]
                    .stateValues.numVertices,
            ).eq(vertices1.length);
            expect(
                stateVariables[graph4Name + stickyGroupName + polygon1Name]
                    .stateValues.numVertices,
            ).eq(vertices1.length);

            expect(
                stateVariables[graph1Name + stickyGroupName + polygon2Name]
                    .stateValues.numVertices,
            ).eq(vertices2.length);
            expect(
                stateVariables[graph2Name + stickyGroupName + polygon2Name]
                    .stateValues.numVertices,
            ).eq(vertices2.length);
            expect(
                stateVariables[graph3Name + stickyGroupName + polygon2Name]
                    .stateValues.numVertices,
            ).eq(vertices2.length);
            expect(
                stateVariables[graph4Name + stickyGroupName + polygon2Name]
                    .stateValues.numVertices,
            ).eq(vertices2.length);

            for (let i in vertices1) {
                for (let dim in vertices1[i]) {
                    if (Number.isFinite(vertices1[i][dim])) {
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph1Name +
                                            stickyGroupName +
                                            polygon1Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices1[i][dim], 1e-12);
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph2Name +
                                            stickyGroupName +
                                            polygon1Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices1[i][dim], 1e-12);
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph3Name +
                                            stickyGroupName +
                                            polygon1Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices1[i][dim], 1e-12);
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph4Name +
                                            stickyGroupName +
                                            polygon1Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices1[i][dim], 1e-12);
                    } else {
                        expect(
                            stateVariables[
                                graph1Name + stickyGroupName + polygon1Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices1[i][dim]);
                        expect(
                            stateVariables[
                                graph2Name + stickyGroupName + polygon1Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices1[i][dim]);
                        expect(
                            stateVariables[
                                graph3Name + stickyGroupName + polygon1Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices1[i][dim]);
                        expect(
                            stateVariables[
                                graph4Name + stickyGroupName + polygon1Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices1[i][dim]);
                    }
                }
            }

            for (let i in vertices2) {
                for (let dim in vertices2[i]) {
                    if (Number.isFinite(vertices2[i][dim])) {
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph1Name +
                                            stickyGroupName +
                                            polygon2Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices2[i][dim], 1e-12);
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph2Name +
                                            stickyGroupName +
                                            polygon2Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices2[i][dim], 1e-12);
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph3Name +
                                            stickyGroupName +
                                            polygon2Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices2[i][dim], 1e-12);
                        expect(
                            me
                                .fromAst(
                                    stateVariables[
                                        graph4Name +
                                            stickyGroupName +
                                            polygon2Name
                                    ].stateValues.vertices[i][dim],
                                )
                                .evaluate_to_constant(),
                        ).closeTo(vertices2[i][dim], 1e-12);
                    } else {
                        expect(
                            stateVariables[
                                graph1Name + stickyGroupName + polygon2Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices2[i][dim]);
                        expect(
                            stateVariables[
                                graph2Name + stickyGroupName + polygon2Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices2[i][dim]);
                        expect(
                            stateVariables[
                                graph3Name + stickyGroupName + polygon2Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices2[i][dim]);
                        expect(
                            stateVariables[
                                graph4Name + stickyGroupName + polygon2Name
                            ].stateValues.vertices[i][dim],
                        ).eq(vertices2[i][dim]);
                    }
                }
            }

            for (let dim in point) {
                if (Number.isFinite(point[dim])) {
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    graph1Name + stickyGroupName + pointName
                                ].stateValues.xs[dim],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(point[dim], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    graph2Name + stickyGroupName + pointName
                                ].stateValues.xs[dim],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(point[dim], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    graph3Name + stickyGroupName + pointName
                                ].stateValues.xs[dim],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(point[dim], 1e-12);
                    expect(
                        me
                            .fromAst(
                                stateVariables[
                                    graph4Name + stickyGroupName + pointName
                                ].stateValues.xs[dim],
                            )
                            .evaluate_to_constant(),
                    ).closeTo(point[dim], 1e-12);
                } else {
                    expect(
                        stateVariables[graph1Name + stickyGroupName + pointName]
                            .stateValues.xs[dim],
                    ).eq(point[dim]);
                    expect(
                        stateVariables[graph2Name + stickyGroupName + pointName]
                            .stateValues.xs[dim],
                    ).eq(point[dim]);
                    expect(
                        stateVariables[graph3Name + stickyGroupName + pointName]
                            .stateValues.xs[dim],
                    ).eq(point[dim]);
                    expect(
                        stateVariables[graph4Name + stickyGroupName + pointName]
                            .stateValues.xs[dim],
                    ).eq(point[dim]);
                }
            }
        });
    }

    it("attract polygons and point when translating", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
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
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

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

        testScene({ vertices1, vertices2, point });

        cy.log("move polygon 1 vertex near vertex of polygon 2");
        cy.window().then(async (win) => {
            let moveX = 0.8;
            let moveY = -1.2;

            let requested_vertices1 = vertices1.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g1/sg/pg1",
                args: {
                    pointCoords: requested_vertices1,
                },
            });

            let actualMoveX = 1;
            let actualMoveY = -1;

            vertices1 = vertices1.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);
            testScene({ vertices1, vertices2, point });
        });

        cy.log("move polygon 2 vertex near vertex of polygon 1");
        cy.window().then(async (win) => {
            let moveX = -5.2;
            let moveY = -2.3;

            let requested_vertices2 = vertices2.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g2/sg/pg2",
                args: {
                    pointCoords: requested_vertices2,
                },
            });

            let actualMoveX = -5;
            let actualMoveY = -2;

            vertices2 = vertices2.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);

            testScene({ vertices1, vertices2, point });
        });

        cy.log("move polygon 2 left further to unstick from polygon 1");
        cy.window().then(async (win) => {
            let moveX = -1;
            let moveY = 0;

            let requested_vertices2 = vertices2.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g3/sg/pg2",
                args: {
                    pointCoords: requested_vertices2,
                },
            });

            let actualMoveX = -1;
            let actualMoveY = 0;

            vertices2 = vertices2.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);

            testScene({ vertices1, vertices2, point });
        });

        cy.log("move polygon 1 vertex near point");
        cy.window().then(async (win) => {
            let moveX = -4.8;
            let moveY = -1.8;

            let requested_vertices1 = vertices1.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g4/sg/pg1",
                args: {
                    pointCoords: requested_vertices1,
                },
            });

            let actualMoveX = -5;
            let actualMoveY = -2;

            vertices1 = vertices1.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);

            testScene({ vertices1, vertices2, point });
        });

        cy.log("move point near polygon2 vertex");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/g1/sg/A",
                args: {
                    x: 0.8,
                    y: 0.8,
                },
            });

            point = [1, 1];

            testScene({ vertices1, vertices2, point });
        });

        cy.log("move point away from vertices and edges");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/g2/sg/A",
                args: {
                    x: -2,
                    y: 1,
                },
            });

            point = [-2, 1];

            testScene({ vertices1, vertices2, point });
        });

        cy.log("move polygon 1 vertex near edge of polygon 2");
        cy.window().then(async (win) => {
            let moveX = 1.4;
            let moveY = 3;

            let requested_vertices1 = vertices1.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g3/sg/pg1",
                args: {
                    pointCoords: requested_vertices1,
                },
            });

            let actualMoveX = 1;
            let actualMoveY = 3;

            vertices1 = vertices1.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);
            testScene({ vertices1, vertices2, point });
        });

        cy.log("move polygon 2 vertex next edge of polygon 1");
        cy.window().then(async (win) => {
            let moveX = 1.2;
            let moveY = 1.8;

            let requested_vertices2 = vertices2.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g4/sg/pg2",
                args: {
                    pointCoords: requested_vertices2,
                },
            });

            let actualMoveX = 1;
            let actualMoveY = 2;

            vertices2 = vertices2.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);

            testScene({ vertices1, vertices2, point });
        });

        cy.log("move polygon 1 edge near vertex of polygon 2");
        cy.window().then(async (win) => {
            let moveX = 2.8;
            let moveY = 0.2;

            let requested_vertices1 = vertices1.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g1/sg/pg1",
                args: {
                    pointCoords: requested_vertices1,
                },
            });

            let actualMoveX = 3;
            let actualMoveY = 0;

            vertices1 = vertices1.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);
            testScene({ vertices1, vertices2, point });
        });

        cy.log("move polygon 2 edge next vertex of polygon 1");
        cy.window().then(async (win) => {
            let moveX = 2.2;
            let moveY = -2;

            let requested_vertices2 = vertices2.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/g2/sg/pg2",
                args: {
                    pointCoords: requested_vertices2,
                },
            });

            let actualMoveX = 2;
            let actualMoveY = -2;

            vertices2 = vertices2.map((vertex) => [
                vertex[0] + actualMoveX,
                vertex[1] + actualMoveY,
            ]);

            testScene({ vertices1, vertices2, point });
        });
    });

    it("attract polygons when moving vertices, rigid and non-rigid", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <graph name="g1">
            <stickyGroup name="sg">
                <polygon name="pg1" vertices="(1,2) (4,5) (-2,5)" rigid filled />

                <polygon name="pg2" vertices="(7,8) (5,4) (9,1) (7,3)" styleNumber="2" filled />

            </stickyGroup>
        </graph>

        <p>$pg1.vertices</p>
        <p>$pg2.vertices</p>



    `,
                },
                "*",
            );
        });

        let vertices2 = [
            [7, 8],
            [5, 4],
            [9, 1],
            [7, 3],
        ];

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        cy.log(
            "rotate polygon 1 to nearly match slope of nearby polygon 2 edge",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: { 0: [1.6, 2] },
                },
            });

            let desired_slope = 2;
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
                let actual_slope =
                    (pg1[1][1] - pg1[0][1]) / (pg1[1][0] - pg1[0][0]);

                expect(actual_slope).closeTo(desired_slope, 1e-12);
            });
        });

        cy.log(
            "if move polygon 1 further away, slope does not attract to polygon 2 edge",
        );
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let moveX = -1;
            let moveY = 1;

            let desired_vertices = stateVariables[
                "/pg1"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: desired_vertices,
                },
            });

            // perturb vertex slightly
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: {
                        0: [
                            desired_vertices[0][0] + 0.01,
                            desired_vertices[0][1] - 0.01,
                        ],
                    },
                },
            });
        });

        let desired_slope = 2;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
            let actual_slope =
                (pg1[1][1] - pg1[0][1]) / (pg1[1][0] - pg1[0][0]);

            expect(actual_slope).not.closeTo(desired_slope, 0.001);
        });

        cy.log("polygon 1 edge still attracts to vertical");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: {
                        0: [-2.1, 5.1],
                    },
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

            // edge should be vertical
            expect(pg1[2][0]).closeTo(pg1[1][0], 1e-12);
        });

        cy.log("polygon 1 edge still attracts to horizontal");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: {
                        0: [0.2, 7.2],
                    },
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

            // edge should be horizontal
            expect(pg1[2][1]).closeTo(pg1[1][1], 1e-12);
        });

        cy.log(
            "move polygon 1 and rotate so vertex is very close to polygon 2 vertex to attract",
        );
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let moveX = 7;
            let moveY = -6.5;

            let desired_vertices = stateVariables[
                "/pg1"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: desired_vertices,
                },
            });

            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: {
                        0: [5.2, -0.8],
                    },
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

            // point3 should be at polygon 2's vertex
            expect(pg1[2][0]).closeTo(9, 1e-12);
            expect(pg1[2][1]).closeTo(1, 1e-12);
        });

        cy.log("small change in rotation stops attraction");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: {
                        0: [5.3, -0.8],
                    },
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

            // point3 should be a small distance from polygon 2's vertex
            expect(pg1[2][0]).not.closeTo(9, 0.01);
            expect(pg1[2][1]).not.closeTo(1, 0.01);
        });

        cy.log("rotate and move polygon 1 to have vertical edge");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: {
                        0: [4.9, -1.6],
                    },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();

            let moveX = -7;
            let moveY = 0.5;

            let desired_vertices = stateVariables[
                "/pg1"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg1",
                args: {
                    pointCoords: desired_vertices,
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;

            // edge should be vertical
            expect(pg1[2][0]).closeTo(pg1[1][0], 1e-12);
        });

        cy.log("move polygon 2 vertex so edge attracts to polygon 1 vertex");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 2: [-0.3, -6] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
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
        });

        cy.log(
            "move polygon 2 vertex so edge almost attracts to polygon 1 vertex",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 0: [-10, 0.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did not attract
            expect(pg2[0]).eqls([-10, 0.8]);

            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[0] = pg2[0];
        });

        cy.log(
            "move polygon 2 vertex closer so edge does attract to polygon 1 vertex",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 0: [-10, 0.6] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex 3 of pg1 should be along edge of vertices of 1 and 4 of pg2
            let slope1 = (pg2[3][1] - pg2[0][1]) / (pg2[3][0] - pg2[0][0]);
            let slope2 = (pg1[2][1] - pg2[0][1]) / (pg1[2][0] - pg2[0][0]);

            expect(slope2).closeTo(slope1, 1e-12);

            // vertices other than 1 of polygon 2 should be in original positions
            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[0] = pg2[0];
        });

        cy.log("move polygon 2 vertex so almost attracts to polygon 1 edge");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 1: [1.7, -1] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did not attract
            expect(pg2[1]).eqls([1.7, -1]);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[1] = pg2[1];
        });

        cy.log(
            "move polygon 2 vertex closer so does attract to polygon 1 edge",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 1: [1.4, -1] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did attract
            expect(pg2[1][0]).closeTo(1, 1e-12);
            expect(pg2[1][1]).closeTo(-1, 1e-12);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[1] = pg2[1];
        });

        cy.log("move polygon 2 vertex close so attracts to polygon 1 vertex");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 3: [1.2, 1.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did attract
            expect(pg2[3][0]).closeTo(1, 1e-12);
            expect(pg2[3][1]).closeTo(2, 1e-12);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);

            vertices2[3] = pg2[3];
        });

        cy.log(
            "move polygon 2 vertex slightly away so no longer attracts to polygon 1 vertex",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 3: [1.7, 2.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did not attract
            expect(pg2[3]).eqls([1.7, 2.8]);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);

            vertices2[3] = pg2[3];
        });

        cy.log("move polygon 2 vertex so edge attracts to polygon 1 edge");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 0: [-6, -5.1] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex 1 and 4 of pg2 should be along edge of vertices of 1 and 3 of pg1
            let slope1 = (pg1[2][1] - pg1[0][1]) / (pg1[2][0] - pg1[0][0]);
            let slope2 = (pg2[0][1] - pg1[0][1]) / (pg2[0][0] - pg1[0][0]);
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
        });

        cy.log(
            "make sure don't move point along polygon 1 edge when attracting polygon 2 point to vertex",
        );

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 2: [1.2, -4.2] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

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
        });

        cy.window().then(async (win) => {
            // attract from other side of vertex
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 2: [0.8, -3.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

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
    });

    it.only("attract rigid polyline and preserveSimilarity polygon when moving vertices", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <graph name="g1">
            <stickyGroup name="sg">
                <polyline name="pl" vertices=" (-2,5) (1,2) (4,5)" rigid rotationHandleVertices="2" />

                <polygon name="pg" vertices="(7,8) (5,4) (9,1) (7,3)" styleNumber="2" preserveSimilarity filled />

            </stickyGroup>
        </graph>

        <p>$pg1.vertices</p>
        <p>$pg2.vertices</p>



    `,
                },
                "*",
            );
        });

        let vertices2 = [
            [7, 8],
            [5, 4],
            [9, 1],
            [7, 3],
        ];

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        cy.log(
            "rotate polyline 1 to nearly match slope of nearby polygon edge",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: { 1: [1.6, 2] },
                },
            });

            let desired_slope = 2;
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let pl = stateVariables["/pl"].stateValues.numericalVertices;
                let actual_slope =
                    (pl[1][1] - pl[2][1]) / (pl[1][0] - pl[2][0]);

                expect(actual_slope).closeTo(desired_slope, 1e-12);
            });
        });

        cy.log(
            "if move polyline further away, slope does not attract to polygon edge",
        );
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let moveX = -1;
            let moveY = 1;

            let desired_vertices = stateVariables[
                "/pl"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: desired_vertices,
                },
            });

            // perturb vertex slightly
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: {
                        1: [
                            desired_vertices[1][0] + 0.01,
                            desired_vertices[1][1] - 0.01,
                        ],
                    },
                },
            });
        });

        let desired_slope = 2;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pl = stateVariables["/pl"].stateValues.numericalVertices;
            let actual_slope = (pl[1][1] - pl[2][1]) / (pl[1][0] - pl[2][0]);

            expect(actual_slope).not.closeTo(desired_slope, 0.001);
        });

        cy.log(
            "missing edge of polyline slope does not attract to polygon edge",
        );
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let moveX = 3.5;
            let moveY = 0;

            let desired_vertices = stateVariables[
                "/pl"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: desired_vertices,
                },
            });

            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: {
                        1: [2.1, 5.8],
                    },
                },
            });
        });

        desired_slope = 2;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pl = stateVariables["/pl"].stateValues.numericalVertices;
            let actual_slope = (pl[0][1] - pl[2][1]) / (pl[0][0] - pl[2][0]);

            expect(actual_slope).closeTo(desired_slope, 0.001);
        });

        cy.log(
            "move polygon 1 and rotate so vertex is very close to polygon 2 vertex to attract",
        );
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let moveX = 7;
            let moveY = -6.5;

            let desired_vertices = stateVariables[
                "/pl"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: desired_vertices,
                },
            });

            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: {
                        0: [5.2, -0.8],
                    },
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pl = stateVariables["/pl"].stateValues.numericalVertices;

            // point3 should be at polygon 2's vertex
            expect(pl[2][0]).closeTo(9, 1e-12);
            expect(pl[2][1]).closeTo(1, 1e-12);
        });

        cy.log("small change in rotation stops attraction");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: {
                        0: [5.3, -0.8],
                    },
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pl = stateVariables["/pl"].stateValues.numericalVertices;

            // point3 should be a small distance from polygon's vertex
            expect(pl[2][0]).not.closeTo(9, 0.01);
            expect(pl[2][1]).not.closeTo(1, 0.01);
        });

        cy.log("rotate polyline to have vertical edge");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: {
                        0: [4.9, -1.6],
                    },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();

            let moveX = -7;
            let moveY = 0.5;

            let desired_vertices = stateVariables[
                "/pl"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: desired_vertices,
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pl = stateVariables["/pl"].stateValues.numericalVertices;

            // edge should be vertical
            expect(pl[2][0]).closeTo(pl[1][0], 1e-12);
        });

        cy.log("polyline's missing edge does not snap to vertical");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: {
                        0: [4.9, -1.6],
                    },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();

            let moveX = -7;
            let moveY = 0.5;

            let desired_vertices = stateVariables[
                "/pl"
            ].stateValues.numericalVertices.map((vertex) => [
                vertex[0] + moveX,
                vertex[1] + moveY,
            ]);
            await win.callAction1({
                actionName: "movePolyline",
                componentName: "/pl",
                args: {
                    pointCoords: desired_vertices,
                },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let pl = stateVariables["/pl"].stateValues.numericalVertices;

            // edge should be vertical
            expect(pl[2][0]).closeTo(pl[1][0], 1e-12);
        });

        cy.log("move polygon 2 vertex so edge attracts to polygon 1 vertex");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg",
                args: {
                    pointCoords: { 2: [-0.3, -6] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
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
        });

        cy.log(
            "move polygon 2 vertex so edge almost attracts to polygon 1 vertex",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 0: [-10, 0.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did not attract
            expect(pg2[0]).eqls([-10, 0.8]);

            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[0] = pg2[0];
        });

        cy.log(
            "move polygon 2 vertex closer so edge does attract to polygon 1 vertex",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 0: [-10, 0.6] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();

            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex 3 of pg1 should be along edge of vertices of 1 and 4 of pg2
            let slope1 = (pg2[3][1] - pg2[0][1]) / (pg2[3][0] - pg2[0][0]);
            let slope2 = (pg1[2][1] - pg2[0][1]) / (pg1[2][0] - pg2[0][0]);

            expect(slope2).closeTo(slope1, 1e-12);

            // vertices other than 1 of polygon 2 should be in original positions
            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[0] = pg2[0];
        });

        cy.log("move polygon 2 vertex so almost attracts to polygon 1 edge");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 1: [1.7, -1] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did not attract
            expect(pg2[1]).eqls([1.7, -1]);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[1] = pg2[1];
        });

        cy.log(
            "move polygon 2 vertex closer so does attract to polygon 1 edge",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 1: [1.4, -1] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did attract
            expect(pg2[1][0]).closeTo(1, 1e-12);
            expect(pg2[1][1]).closeTo(-1, 1e-12);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[2]).eqls(vertices2[2]);
            expect(pg2[3]).eqls(vertices2[3]);

            vertices2[1] = pg2[1];
        });

        cy.log("move polygon 2 vertex close so attracts to polygon 1 vertex");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 3: [1.2, 1.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did attract
            expect(pg2[3][0]).closeTo(1, 1e-12);
            expect(pg2[3][1]).closeTo(2, 1e-12);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);

            vertices2[3] = pg2[3];
        });

        cy.log(
            "move polygon 2 vertex slightly away so no longer attracts to polygon 1 vertex",
        );
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 3: [1.7, 2.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex did not attract
            expect(pg2[3]).eqls([1.7, 2.8]);

            expect(pg2[0]).eqls(vertices2[0]);
            expect(pg2[1]).eqls(vertices2[1]);
            expect(pg2[2]).eqls(vertices2[2]);

            vertices2[3] = pg2[3];
        });

        cy.log("move polygon 2 vertex so edge attracts to polygon 1 edge");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 0: [-6, -5.1] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg1 = stateVariables["/pg1"].stateValues.numericalVertices;
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

            // vertex 1 and 4 of pg2 should be along edge of vertices of 1 and 3 of pg1
            let slope1 = (pg1[2][1] - pg1[0][1]) / (pg1[2][0] - pg1[0][0]);
            let slope2 = (pg2[0][1] - pg1[0][1]) / (pg2[0][0] - pg1[0][0]);
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
        });

        cy.log(
            "make sure don't move point along polygon 1 edge when attracting polygon 2 point to vertex",
        );

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 2: [1.2, -4.2] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

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
        });

        cy.window().then(async (win) => {
            // attract from other side of vertex
            await win.callAction1({
                actionName: "movePolygon",
                componentName: "/pg2",
                args: {
                    pointCoords: { 2: [0.8, -3.8] },
                },
            });

            let stateVariables = await win.returnAllStateVariables1();
            let pg2 = stateVariables["/pg2"].stateValues.numericalVertices;

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
    });
});
