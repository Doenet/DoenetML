import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveLine,
    movePoint,
    moveVector,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Graph Reference Test", async () => {
    it("graph referenced multiple ways", async () => {
        const core = await createTestCore({
            doenetML: `
    <graph name="graphA">
      <point name="pointA">(1,2)</point>
      <point name="pointB">(-2,4)</point>
      <line name="lineA">y=x+1</line>
      <line name="lineB" through="$pointA $pointB" />
      $pointA{name="pointC"}
      <point name="pointD" x="$pointA.x" y="$pointB.y" />
      $lineA{name="lineC"}
      $lineB{name="lineD"}
      <intersection name="pointE">$lineA$lineB</intersection>
    </graph>

    <graph name="graphB">
      $pointA$pointB$lineA$lineB$pointC$pointD$lineC$lineD$pointE
    </graph>

    $graphA{name="graphC"}

    $graphB{name="graphD"}

    $graphC{name="graphE"}

    $graphD{name="graphF"}

    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        let graphB = stateVariables["/graphB"];
        let graphC = stateVariables["/graphC"];
        let graphD = stateVariables["/graphD"];
        let graphE = stateVariables["/graphE"];
        let graphF = stateVariables["/graphF"];
        let pointsA = [
            "/pointA",
            "/pointC",
            graphB.activeChildren[0].componentName,
            graphB.activeChildren[4].componentName,
            graphC.activeChildren[0].componentName,
            graphC.activeChildren[4].componentName,
            graphD.activeChildren[0].componentName,
            graphD.activeChildren[4].componentName,
            graphE.activeChildren[0].componentName,
            graphE.activeChildren[4].componentName,
            graphF.activeChildren[0].componentName,
            graphF.activeChildren[4].componentName,
        ];

        let pointsB = [
            "/pointB",
            graphB.activeChildren[1].componentName,
            graphC.activeChildren[1].componentName,
            graphD.activeChildren[1].componentName,
            graphE.activeChildren[1].componentName,
            graphF.activeChildren[1].componentName,
        ];

        let pointsD = [
            "/pointD",
            graphB.activeChildren[5].componentName,
            graphC.activeChildren[5].componentName,
            graphD.activeChildren[5].componentName,
            graphE.activeChildren[5].componentName,
            graphF.activeChildren[5].componentName,
        ];

        let pointsE = [
            stateVariables["/pointE"].replacements![0].componentName,
            graphB.activeChildren[8].componentName,
            graphC.activeChildren[8].componentName,
            graphD.activeChildren[8].componentName,
            graphE.activeChildren[8].componentName,
            graphF.activeChildren[8].componentName,
        ];

        let linesA = [
            "/lineA",
            "/lineC",
            graphB.activeChildren[2].componentName,
            graphB.activeChildren[6].componentName,
            graphC.activeChildren[2].componentName,
            graphC.activeChildren[6].componentName,
            graphD.activeChildren[2].componentName,
            graphD.activeChildren[6].componentName,
            graphE.activeChildren[2].componentName,
            graphE.activeChildren[6].componentName,
            graphF.activeChildren[2].componentName,
            graphF.activeChildren[6].componentName,
        ];

        let linesB = [
            "/lineB",
            "/lineD",
            graphB.activeChildren[3].componentName,
            graphB.activeChildren[7].componentName,
            graphC.activeChildren[3].componentName,
            graphC.activeChildren[7].componentName,
            graphD.activeChildren[3].componentName,
            graphD.activeChildren[7].componentName,
            graphE.activeChildren[3].componentName,
            graphE.activeChildren[7].componentName,
            graphF.activeChildren[3].componentName,
            graphF.activeChildren[7].componentName,
        ];

        async function check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        }: {
            pointAx: number;
            pointAy: number;
            pointBx: number;
            pointBy: number;
            pointEx: number;
            pointEy: number;
            slopeA: number;
            xinterceptA: number;
            yinterceptA: number;
            slopeB: number;
            xinterceptB: number;
            yinterceptB: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(true);
            for (let point of pointsA) {
                expect(stateVariables[point].stateValues.xs[0].tree).closeTo(
                    pointAx,
                    1e-12,
                );
                expect(stateVariables[point].stateValues.xs[1].tree).closeTo(
                    pointAy,
                    1e-12,
                );
            }
            for (let point of pointsB) {
                expect(stateVariables[point].stateValues.xs[0].tree).closeTo(
                    pointBx,
                    1e-12,
                );
                expect(stateVariables[point].stateValues.xs[1].tree).closeTo(
                    pointBy,
                    1e-12,
                );
            }
            for (let point of pointsD) {
                expect(stateVariables[point].stateValues.xs[0].tree).closeTo(
                    pointAx,
                    1e-12,
                );
                expect(stateVariables[point].stateValues.xs[1].tree).closeTo(
                    pointBy,
                    1e-12,
                );
            }
            for (let point of pointsE) {
                expect(stateVariables[point].stateValues.xs[0].tree).closeTo(
                    pointEx,
                    1e-12,
                );
                expect(stateVariables[point].stateValues.xs[1].tree).closeTo(
                    pointEy,
                    1e-12,
                );
            }
            for (let line of linesA) {
                expect(
                    stateVariables[
                        line
                    ].stateValues.slope.evaluate_to_constant(),
                ).closeTo(slopeA, 1e-12);
                expect(
                    stateVariables[
                        line
                    ].stateValues.xintercept.evaluate_to_constant(),
                ).closeTo(xinterceptA, 1e-12);
                expect(
                    stateVariables[
                        line
                    ].stateValues.yintercept.evaluate_to_constant(),
                ).closeTo(yinterceptA, 1e-12);
            }
            for (let line of linesB) {
                expect(
                    stateVariables[
                        line
                    ].stateValues.slope.evaluate_to_constant(),
                ).closeTo(slopeB, 1e-12);
                expect(
                    stateVariables[
                        line
                    ].stateValues.xintercept.evaluate_to_constant(),
                ).closeTo(xinterceptB, 1e-12);
                expect(
                    stateVariables[
                        line
                    ].stateValues.yintercept.evaluate_to_constant(),
                ).closeTo(yinterceptB, 1e-12);
            }
        }
        let pointAx = 1;
        let pointAy = 2;
        let pointBx = -2;
        let pointBy = 4;
        let slopeA = 1;
        let xinterceptA = -1;
        let yinterceptA = 1;
        let slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        let xinterceptB = -pointAy / slopeB + pointAx;
        let yinterceptB = pointAy - slopeB * pointAx;
        let pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        let pointEy = slopeA * pointEx + yinterceptA;

        // check original configuration
        await check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        });

        // move points and line in first graph
        stateVariables = await core.returnAllStateVariables(true);

        pointAx = -3;
        pointAy = 6;
        pointBx = 4;
        pointBy = -2;
        await movePoint({ name: "/pointA", x: pointAx, y: pointAy, core });
        await movePoint({ name: "/pointB", x: pointBx, y: pointBy, core });

        let moveUp = -3;
        let point1coords = [
            stateVariables["/lineA"].stateValues.points[0][0].tree,
            stateVariables["/lineA"].stateValues.points[0][1].tree,
        ];
        let point2coords = [
            stateVariables["/lineA"].stateValues.points[1][0].tree,
            stateVariables["/lineA"].stateValues.points[1][1].tree,
        ];
        point1coords[1] = point1coords[1] + moveUp;
        point2coords[1] = point2coords[1] + moveUp;

        await moveLine({
            name: "/lineA",
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;
        await check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        });

        // move shadow points and line in second graph
        let pointDx = 3;
        let pointDy = 2;
        let pointCy = -9;

        await movePoint({ name: pointsD[1], x: pointDx, y: pointDy, core });
        await movePoint({ name: pointsA[3], x: pointDx, y: pointCy, core });

        stateVariables = await core.returnAllStateVariables(true);

        pointAx = pointDx;
        pointAy = pointCy;
        pointBy = pointDy;

        moveUp = 8;
        let lineA3Points = stateVariables[linesA[3]].stateValues.points.map(
            (v) => v.map((x) => x.tree),
        );
        point1coords = [lineA3Points[0][0], lineA3Points[0][1]];
        point2coords = [lineA3Points[1][0], lineA3Points[1][1]];
        point1coords[1] = point1coords[1] + moveUp;
        point2coords[1] = point2coords[1] + moveUp;
        await moveLine({
            name: linesA[3],
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        await check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        });

        // move both shadow lines in third graph
        stateVariables = await core.returnAllStateVariables(true);

        moveUp = -4;
        let lineA5points = stateVariables[linesA[5]].stateValues.points.map(
            (v) => v.map((x) => x.tree),
        );
        point1coords = [lineA5points[0][0], lineA5points[0][1]];
        point2coords = [lineA5points[1][0], lineA5points[1][1]];
        point1coords[1] = point1coords[1] + moveUp;
        point2coords[1] = point2coords[1] + moveUp;
        await moveLine({
            name: linesA[5],
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });
        stateVariables = await core.returnAllStateVariables(true);

        xinterceptA -= moveUp;
        yinterceptA += moveUp;

        let moveX = 3;
        let moveY = 2;
        let lineB5points = stateVariables[linesB[5]].stateValues.points.map(
            (v) => v.map((x) => x.tree),
        );
        point1coords = [lineB5points[0][0], lineB5points[0][1]];
        point2coords = [lineB5points[1][0], lineB5points[1][1]];
        point1coords[0] = point1coords[0] + moveX;
        point1coords[1] = point1coords[1] + moveY;
        point2coords[0] = point2coords[0] + moveX;
        point2coords[1] = point2coords[1] + moveY;
        await moveLine({
            name: linesB[5],
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);

        pointAx += moveX;
        pointAy += moveY;
        pointBx += moveX;
        pointBy += moveY;

        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        await check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        });

        // move shadow points and line in fourth graph
        pointDx = -5;
        pointDy = -1;
        pointCy = 5;

        await movePoint({ name: pointsA[7], x: pointDx, y: pointCy, core });
        await movePoint({ name: pointsD[3], x: pointDx, y: pointDy, core });

        stateVariables = await core.returnAllStateVariables(true);

        pointAx = pointDx;
        pointAy = pointCy;
        pointBy = pointDy;

        moveUp = 1;
        let lineA7points = stateVariables[linesA[7]].stateValues.points.map(
            (v) => v.map((x) => x.tree),
        );
        point1coords = [lineA7points[0][0], lineA7points[0][1]];
        point2coords = [lineA7points[1][0], lineA7points[1][1]];
        point1coords[1] = point1coords[1] + moveUp;
        point2coords[1] = point2coords[1] + moveUp;
        await moveLine({
            name: linesA[7],
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);

        xinterceptA -= moveUp;
        yinterceptA += moveUp;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        await check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        });

        // move points and line in fifth graph
        pointAx = 7;
        pointAy = -7;
        pointBx = -8;
        pointBy = 9;
        await movePoint({ name: pointsA[8], x: pointAx, y: pointAy, core });
        await movePoint({ name: pointsB[4], x: pointBx, y: pointBy, core });

        stateVariables = await core.returnAllStateVariables(true);

        moveUp = -3;
        let lineA8points = stateVariables[linesA[8]].stateValues.points.map(
            (v) => v.map((x) => x.tree),
        );
        point1coords = [lineA8points[0][0], lineA8points[0][1]];
        point2coords = [lineA8points[1][0], lineA8points[1][1]];
        point1coords[1] = point1coords[1] + moveUp;
        point2coords[1] = point2coords[1] + moveUp;
        await moveLine({
            name: linesA[8],
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);

        xinterceptA -= moveUp;
        yinterceptA += moveUp;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        await check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        });

        // move both shadow lines in sixth graph
        stateVariables = await core.returnAllStateVariables(true);

        moveUp = -2;
        let lineA11points = stateVariables[linesA[11]].stateValues.points.map(
            (v) => v.map((x) => x.tree),
        );
        point1coords = [lineA11points[0][0], lineA11points[0][1]];
        point2coords = [lineA11points[1][0], lineA11points[1][1]];
        point1coords[1] = point1coords[1] + moveUp;
        point2coords[1] = point2coords[1] + moveUp;
        await moveLine({
            name: linesA[11],
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);

        xinterceptA -= moveUp;
        yinterceptA += moveUp;

        moveX = -1;
        moveY = 3;
        let lineB11points = stateVariables[linesB[11]].stateValues.points.map(
            (v) => v.map((x) => x.tree),
        );
        point1coords = [lineB11points[0][0], lineB11points[0][1]];
        point2coords = [lineB11points[1][0], lineB11points[1][1]];
        point1coords[0] = point1coords[0] + moveX;
        point1coords[1] = point1coords[1] + moveY;
        point2coords[0] = point2coords[0] + moveX;
        point2coords[1] = point2coords[1] + moveY;
        await moveLine({
            name: linesB[11],
            point1coords: point1coords,
            point2coords: point2coords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);

        pointAx += moveX;
        pointAy += moveY;
        pointBx += moveX;
        pointBy += moveY;

        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        await check_items({
            pointAx,
            pointAy,
            pointBx,
            pointBy,
            pointEx,
            pointEy,
            slopeA,
            xinterceptA,
            yinterceptA,
            slopeB,
            xinterceptB,
            yinterceptB,
        });
    });

    it("graph referenced multiple ways 2", async () => {
        const core = await createTestCore({
            doenetML: `
    <text>a</text>
    <sbsgroup>
    <sideBySide>
    <graph width="150px" height="150px" name="graph1">
    <vector head="(-4,2)" tail="(3,5)" />
    </graph>
  
    <graph width="150px" height="150px" name="graph2">
    $_vector1.tail
    $_vector1.head
    $_vector1.displacement{name="d1"}
    $_vector1{name="rv1"}
    </graph>

    <graph width="150px" height="150px" name="graph3">
    $d1.tail
    $d1.head
    $d1.displacement
    $d1
    </graph>
  
    <graph width="150px" height="150px" name="graph4">
    $rv1.tail
    $rv1.head
    $rv1.displacement
    $rv1{name="rv2"}
    </graph>
    </sidebyside>

    <sidebyside>
    $graph1{width="150px" height="150px" name="graph5"}
    $graph2{width="150px" height="150px" name="graph6"}
    $graph3{width="150px" height="150px" name="graph7"}
    $graph4{width="150px" height="150px" name="graph8"}
    </sidebyside>

    <sidebyside>
    $graph5{width="150px" height="150px" name="graph9"}
    $graph6{width="150px" height="150px" name="graph10"}
    $graph7{width="150px" height="150px" name="graph11"}
    $graph8{width="150px" height="150px" name="graph12"}
    </sideBySide>
    </sbsgroup>

    $_sbsgroup1{name="sbsgroup2"}
  
    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        // let originalVectors = [0, 2, 6]
        // let displacementsA = [1, 4];
        // let displacementsB = [3,];
        // let displacementsC = [5,];
        // let vectorShift = 7;
        // let originalTails = [1, 5];
        // let originalHeads = [2, 6];
        // let displacementTails = [3,];
        // let displacementHeads = [4,];
        // let pointShift = 6;
        // let nShifts = 6;

        let graph1 = stateVariables["/graph1"];
        let graph2 = stateVariables["/graph2"];
        let graph3 = stateVariables["/graph3"];
        let graph4 = stateVariables["/graph4"];
        let graph5 = stateVariables["/graph5"];
        let graph6 = stateVariables["/graph6"];
        let graph7 = stateVariables["/graph7"];
        let graph8 = stateVariables["/graph8"];
        let graph9 = stateVariables["/graph9"];
        let graph10 = stateVariables["/graph10"];
        let graph11 = stateVariables["/graph11"];
        let graph12 = stateVariables["/graph12"];

        let graph1A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[0].componentName
                ].activeChildren[0].componentName
            ];
        let graph2A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[0].componentName
                ].activeChildren[1].componentName
            ];
        let graph3A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[0].componentName
                ].activeChildren[2].componentName
            ];
        let graph4A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[0].componentName
                ].activeChildren[3].componentName
            ];
        let graph5A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[1].componentName
                ].activeChildren[0].componentName
            ];
        let graph6A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[1].componentName
                ].activeChildren[1].componentName
            ];
        let graph7A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[1].componentName
                ].activeChildren[2].componentName
            ];
        let graph8A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[1].componentName
                ].activeChildren[3].componentName
            ];
        let graph9A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[2].componentName
                ].activeChildren[0].componentName
            ];
        let graph10A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[2].componentName
                ].activeChildren[1].componentName
            ];
        let graph11A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[2].componentName
                ].activeChildren[2].componentName
            ];
        let graph12A =
            stateVariables[
                stateVariables[
                    stateVariables["/sbsgroup2"].activeChildren[2].componentName
                ].activeChildren[3].componentName
            ];

        let vectors = [
            graph1.activeChildren[0].componentName,
            graph2.activeChildren[3].componentName,
            graph4.activeChildren[3].componentName,
            graph5.activeChildren[0].componentName,
            graph6.activeChildren[3].componentName,
            graph8.activeChildren[3].componentName,
            graph9.activeChildren[0].componentName,
            graph10.activeChildren[3].componentName,
            graph12.activeChildren[3].componentName,
            graph1A.activeChildren[0].componentName,
            graph2A.activeChildren[3].componentName,
            graph4A.activeChildren[3].componentName,
            graph5A.activeChildren[0].componentName,
            graph6A.activeChildren[3].componentName,
            graph8A.activeChildren[3].componentName,
            graph9A.activeChildren[0].componentName,
            graph10A.activeChildren[3].componentName,
            graph12A.activeChildren[3].componentName,
        ];

        let displacementsA = [
            graph2.activeChildren[2].componentName,
            graph3.activeChildren[3].componentName,
            graph6.activeChildren[2].componentName,
            graph7.activeChildren[3].componentName,
            graph10.activeChildren[2].componentName,
            graph11.activeChildren[3].componentName,
            graph2A.activeChildren[2].componentName,
            graph3A.activeChildren[3].componentName,
            graph6A.activeChildren[2].componentName,
            graph7A.activeChildren[3].componentName,
            graph10A.activeChildren[2].componentName,
            graph11A.activeChildren[3].componentName,
        ];

        let displacementsB = [
            graph3.activeChildren[2].componentName,
            graph7.activeChildren[2].componentName,
            graph11.activeChildren[2].componentName,
            graph3A.activeChildren[2].componentName,
            graph7A.activeChildren[2].componentName,
            graph11A.activeChildren[2].componentName,
        ];

        let displacementsC = [
            graph4.activeChildren[2].componentName,
            graph8.activeChildren[2].componentName,
            graph12.activeChildren[2].componentName,
            graph4A.activeChildren[2].componentName,
            graph8A.activeChildren[2].componentName,
            graph12A.activeChildren[2].componentName,
        ];

        let tails = [
            graph2.activeChildren[0].componentName,
            graph4.activeChildren[0].componentName,
            graph6.activeChildren[0].componentName,
            graph8.activeChildren[0].componentName,
            graph10.activeChildren[0].componentName,
            graph12.activeChildren[0].componentName,
            graph2A.activeChildren[0].componentName,
            graph4A.activeChildren[0].componentName,
            graph6A.activeChildren[0].componentName,
            graph8A.activeChildren[0].componentName,
            graph10A.activeChildren[0].componentName,
            graph12A.activeChildren[0].componentName,
        ];

        let heads = [
            graph2.activeChildren[1].componentName,
            graph4.activeChildren[1].componentName,
            graph6.activeChildren[1].componentName,
            graph8.activeChildren[1].componentName,
            graph10.activeChildren[1].componentName,
            graph12.activeChildren[1].componentName,
            graph2A.activeChildren[1].componentName,
            graph4A.activeChildren[1].componentName,
            graph6A.activeChildren[1].componentName,
            graph8A.activeChildren[1].componentName,
            graph10A.activeChildren[1].componentName,
            graph12A.activeChildren[1].componentName,
        ];

        let displacementTails = [
            graph3.activeChildren[0].componentName,
            graph7.activeChildren[0].componentName,
            graph11.activeChildren[0].componentName,
            graph3A.activeChildren[0].componentName,
            graph7A.activeChildren[0].componentName,
            graph11A.activeChildren[0].componentName,
        ];

        let displacementHeads = [
            graph3.activeChildren[1].componentName,
            graph7.activeChildren[1].componentName,
            graph11.activeChildren[1].componentName,
            graph3A.activeChildren[1].componentName,
            graph7A.activeChildren[1].componentName,
            graph11A.activeChildren[1].componentName,
        ];

        async function check_items({
            ov_t,
            ov_h,
            d,
            d1_t,
            d1_h,
            d2_t,
            d2_h,
            d3_t,
            d3_h,
        }: {
            ov_t: number[];
            ov_h: number[];
            d: number[];
            d1_t: number[];
            d1_h: number[];
            d2_t: number[];
            d2_h: number[];
            d3_t: number[];
            d3_h: number[];
        }) {
            let stateVariables = await core.returnAllStateVariables(true);

            for (let vector of vectors) {
                expect(
                    stateVariables[vector].stateValues.tail.map((v) => v.tree),
                ).eqls(ov_t);
                expect(
                    stateVariables[vector].stateValues.head.map((v) => v.tree),
                ).eqls(ov_h);
                expect(
                    stateVariables[vector].stateValues.displacement.map(
                        (v) => v.tree,
                    ),
                ).eqls(d);
            }
            for (let displacement of displacementsA) {
                expect(
                    stateVariables[displacement].stateValues.tail.map(
                        (v) => v.tree,
                    ),
                ).eqls(d1_t);
                expect(
                    stateVariables[displacement].stateValues.head.map(
                        (v) => v.tree,
                    ),
                ).eqls(d1_h);
                expect(
                    stateVariables[displacement].stateValues.displacement.map(
                        (v) => v.tree,
                    ),
                ).eqls(d);
            }
            for (let displacement of displacementsB) {
                expect(
                    stateVariables[displacement].stateValues.tail.map(
                        (v) => v.tree,
                    ),
                ).eqls(d2_t);
                expect(
                    stateVariables[displacement].stateValues.head.map(
                        (v) => v.tree,
                    ),
                ).eqls(d2_h);
                expect(
                    stateVariables[displacement].stateValues.displacement.map(
                        (v) => v.tree,
                    ),
                ).eqls(d);
            }
            for (let displacement of displacementsC) {
                expect(
                    stateVariables[displacement].stateValues.tail.map(
                        (v) => v.tree,
                    ),
                ).eqls(d3_t);
                expect(
                    stateVariables[displacement].stateValues.head.map(
                        (v) => v.tree,
                    ),
                ).eqls(d3_h);
                expect(
                    stateVariables[displacement].stateValues.displacement.map(
                        (v) => v.tree,
                    ),
                ).eqls(d);
            }
            for (let tail of tails) {
                expect(
                    stateVariables[tail].stateValues.xs.map((v) => v.tree),
                ).eqls(ov_t);
            }
            for (let head of heads) {
                expect(
                    stateVariables[head].stateValues.xs.map((v) => v.tree),
                ).eqls(ov_h);
            }
            for (let dTail of displacementTails) {
                expect(
                    stateVariables[dTail].stateValues.xs.map((v) => v.tree),
                ).eqls(d1_t);
            }
            for (let dHead of displacementHeads) {
                expect(
                    stateVariables[dHead].stateValues.xs.map((v) => v.tree),
                ).eqls(d1_h);
            }
        }

        // check original configuration

        let ov_t = [3, 5];
        let ov_h = [-4, 2];
        let d = ov_h.map((x, i) => x - ov_t[i]);
        let d1_t = [0, 0];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d2_t = [0, 0];
        let d2_h = d2_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        await check_items({
            ov_t,
            ov_h,
            d,
            d1_t,
            d1_h,
            d2_t,
            d2_h,
            d3_t,
            d3_h,
        });

        await check_items({
            ov_t,
            ov_h,
            d,
            d1_t,
            d1_h,
            d2_t,
            d2_h,
            d3_t,
            d3_h,
        });

        // move an original vector
        ov_t = [-1, 7];
        ov_h = [0, -2];
        d = ov_h.map((x, i) => x - ov_t[i]);
        d1_t = [0, 0];
        d1_h = d1_t.map((x, i) => x + d[i]);
        d2_t = [0, 0];
        d2_h = d2_t.map((x, i) => x + d[i]);
        d3_t = [0, 0];
        d3_h = d3_t.map((x, i) => x + d[i]);

        await moveVector({
            name: vectors[8],
            tailcoords: ov_t,
            headcoords: ov_h,
            core,
        });

        await check_items({
            ov_t,
            ov_h,
            d,
            d1_t,
            d1_h,
            d2_t,
            d2_h,
            d3_t,
            d3_h,
        });

        // move displacementA vector
        d1_t = [2, 5];
        d1_h = [7, 1];
        d = d1_h.map((x, i) => x - d1_t[i]);

        ov_t = [-1, 7];
        ov_h = ov_t.map((x, i) => x + d[i]);
        d2_t = [0, 0];
        d2_h = d2_t.map((x, i) => x + d[i]);
        d3_t = [0, 0];
        d3_h = d3_t.map((x, i) => x + d[i]);

        await moveVector({
            name: displacementsA[1],
            tailcoords: d1_t,
            headcoords: d1_h,
            core,
        });

        await check_items({
            ov_t,
            ov_h,
            d,
            d1_t,
            d1_h,
            d2_t,
            d2_h,
            d3_t,
            d3_h,
        });

        // move displacementB vector
        d2_t = [-2, 3];
        d2_h = [5, -5];
        d = d2_h.map((x, i) => x - d2_t[i]);

        ov_t = [-1, 7];
        ov_h = ov_t.map((x, i) => x + d[i]);
        d1_t = [2, 5];
        d1_h = d1_t.map((x, i) => x + d[i]);
        d3_t = [0, 0];
        d3_h = d3_t.map((x, i) => x + d[i]);

        await moveVector({
            name: displacementsB[2],
            tailcoords: d2_t,
            headcoords: d2_h,
            core,
        });

        await check_items({
            ov_t,
            ov_h,
            d,
            d1_t,
            d1_h,
            d2_t,
            d2_h,
            d3_t,
            d3_h,
        });

        // move displacementC vector
        d3_t = [9, 8];
        d3_h = [7, 4];
        d = d3_h.map((x, i) => x - d3_t[i]);

        ov_t = [-1, 7];
        ov_h = ov_t.map((x, i) => x + d[i]);
        d1_t = [2, 5];
        d1_h = d1_t.map((x, i) => x + d[i]);
        d2_t = [-2, 3];
        d2_h = d2_t.map((x, i) => x + d[i]);

        await moveVector({
            name: displacementsC[5],
            tailcoords: d3_t,
            headcoords: d3_h,
            core,
        });

        await check_items({
            ov_t,
            ov_h,
            d,
            d1_t,
            d1_h,
            d2_t,
            d2_h,
            d3_t,
            d3_h,
        });
    });
});
