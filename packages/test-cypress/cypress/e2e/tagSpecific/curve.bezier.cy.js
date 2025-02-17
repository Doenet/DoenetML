import { cesc } from "@doenet/utils";

describe("Curve Tag Bezier Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it.skip("constrain control points to angles", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,-3)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlPoints><point>(-1,5)</point><point>(4,2)</point></controlPoints>
        <controlVectors>(5,-6)</controlVectors>
        <point>(0,0)</point>
      </beziercontrols>
      <constrainToAngles>
      0, pi/2, pi, 3pi/2
      </constrainToAngles>
    </curve>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[0],
            ).eqls([1, 2]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[1],
            ).eqls([3, 4]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[2],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[3],
            ).eqls([2, -3]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0][1],
            ).greaterThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1][1],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][2],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][2],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][2],
            ).greaterThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5][2],
            ).greaterThan(0);
        });

        cy.log("move control vectors");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 3,
                    controlVector: [7, -6],
                },
            });
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 2,
                    controlVector: [-6, -5],
                },
            });
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[0],
            ).eqls([1, 2]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[1],
            ).eqls([3, 4]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[2],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[3],
            ).eqls([2, -3]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0][1],
            ).greaterThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1][1],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][1],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][1],
            ).greaterThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][1],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5][2],
            ).greaterThan(0);
        });
    });

    it.skip("attract control points to angles", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,-3)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlPoints><point>(-1,5)</point><point>(4,2)</point></controlPoints>
        <controlVectors>(5,-6)</controlVectors>
        <point>(0,0)</point>
      </beziercontrols>
      <attractToAngles>
      0, pi/2, pi, 3pi/2
      </attractToAngles>
    </curve>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[0],
            ).eqls([1, 2]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[1],
            ).eqls([3, 4]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[2],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[3],
            ).eqls([2, -3]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0],
            ).eqls([3, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1],
            ).eqls([-4, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2],
            ).eqls([1, -2]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3],
            ).eqls([5, -6]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5],
            ).eqls([-2, 3]);
        });

        cy.log("move control vector close to angles");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 3,
                    controlVector: [7, 0.2],
                },
            });
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 2,
                    controlVector: [0.1, -6],
                },
            });
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[0],
            ).eqls([1, 2]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[1],
            ).eqls([3, 4]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[2],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[3],
            ).eqls([2, -3]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0],
            ).eqls([3, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1],
            ).eqls([-4, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][2],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][1],
            ).greaterThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][1],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5],
            ).eqls([-2, 3]);
        });
    });

    it.skip("attract symmetric control points to asymmetric angles", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,-3)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlPoints><point>(-1,5)</point></controlPoints>
        <controlVectors>(5,-6)</controlVectors>
        <point>(0,0)</point>
      </beziercontrols>
      <attractToAngles>
      0, pi/2
      </attractToAngles>
    </curve>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[0],
            ).eqls([1, 2]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[1],
            ).eqls([3, 4]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[2],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[3],
            ).eqls([2, -3]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0],
            ).eqls([3, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1],
            ).eqls([-4, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2],
            ).eqls([4, -1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3],
            ).eqls([5, -6]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5],
            ).eqls([-2, 3]);
        });

        cy.log("move control vectors close to angles");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 3,
                    controlVector: [7, 0.125],
                },
            });
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 2,
                    controlVector: [0.125, -6],
                },
            });
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[0],
            ).eqls([1, 2]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[1],
            ).eqls([3, 4]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[2],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[3],
            ).eqls([2, -3]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0],
            ).eqls([3, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1][2],
            ).greaterThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][1],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2][2],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][1],
            ).greaterThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][1],
            ).lessThan(0);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4][2],
            ).closeTo(0, 1e-12);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5],
            ).eqls([-2, 3]);
        });

        cy.log("move control vectors opposite sides");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 3,
                    controlVector: [-7, 0.125],
                },
            });
            await win.callAction1({
                actionName: "moveControlVector",
                componentName: "/_curve1",
                args: {
                    controlVectorInd: 2,
                    controlVector: [0.125, 6],
                },
            });
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[0],
            ).eqls([1, 2]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[1],
            ).eqls([3, 4]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[2],
            ).eqls([-5, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.throughPoints[3],
            ).eqls([2, -3]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[0],
            ).eqls([3, 1]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[1],
            ).eqls([-0.125, -6]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[2],
            ).eqls([0.125, 6]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[3],
            ).eqls([-7, 0.125]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[4],
            ).eqls([7, -0.125]);
            expect(
                stateVariables["/_curve1"].stateValues.controlVectors[5],
            ).eqls([-2, 3]);
        });
    });
});
