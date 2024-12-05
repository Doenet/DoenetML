import { cesc } from "@doenet/utils";

describe("Point location validation tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("point in first quadrant, remember submitted on reload", () => {
        let doenetML = `
    <text>a</text>
    <p>Move point to first quadrant</p>
    <graph><point>(-3.9,4.5)</point></graph>
    <p><answer>
      <award><when>
        $_point1.x > 0 and 
        $_point1.y > 0
      </when></award>
      <considerAsResponses>$_point1</considerAsResponses>
    </answer></p>
    <p>Credit for answer: $_answer1.creditAchieved</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.log("Move point to correct quadrant and move again");
        // for some reason, have to move point twice to trigger bug
        // that occurs when expressionWithCodes of math isn't changed

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/_point1",
                args: { x: 5.9, y: 3.5 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/_point1",
                args: { x: 5.9, y: 3.4 },
            });
        });

        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_point1"].stateValues.xs).eqls([5.9, 3.4]);
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                1,
            );
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.log("Reload page");
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables["/_answer1"];
            }),
        );

        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_point1"].stateValues.xs).eqls([5.9, 3.4]);
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                1,
            );
        });

        cy.log("Move point to second quadrant and submit");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/_point1",
                args: { x: -8.8, y: 1.3 },
            });
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                1,
            );
        });

        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_point1"].stateValues.xs).eqls([-8.8, 1.3]);
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                0,
            );
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.log("Reload page");
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables["/_answer1"];
            }),
        );

        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_point1"].stateValues.xs).eqls([-8.8, 1.3]);
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                0,
            );
        });

        cy.log("Move point to third quadrant and submit");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/_point1",
                args: { x: -9.4, y: -5.1 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/_point1",
                args: { x: -9.5, y: -5.1 },
            });
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                0,
            );
        });

        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_point1"].stateValues.xs).eqls([
                -9.5, -5.1,
            ]);
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                0,
            );
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.log("Reload page");
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables["/_answer1"];
            }),
        );

        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_point1"].stateValues.xs).eqls([
                -9.5, -5.1,
            ]);
            expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(
                0,
            );
        });
    });
});
