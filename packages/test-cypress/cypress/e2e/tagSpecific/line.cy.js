import { cesc } from "@doenet/utils";

describe("Line Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Testing bug in saving essential state set in definition
    it("reload line", () => {
        let doenetML = `
    <graph>
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line name="l" through="$A $B" />
    </graph>
    <p><math extend="$A.coords" name="Ac" />, <math extend="$B.coords" name="Bc" /></p>
    <p><math extend="$l.equation" name="le" /></p>
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

        cy.get(cesc("#Ac")).should("contain.text", "(1,2)");
        cy.get(cesc("#Bc")).should("contain.text", "(3,4)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([1, 2]);
            expect(
                stateVariables[await win.resolvePath1("B")].stateValues.xs,
            ).eqls([3, 4]);
        });

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 9, y: 8 },
            });
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("B"),
                args: { x: 6, y: 7 },
            });
        });

        cy.get(cesc("#Ac")).should("contain.text", "(9,8)");
        cy.get(cesc("#Bc")).should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([9, 8]);
            expect(
                stateVariables[await win.resolvePath1("B")].stateValues.xs,
            ).eqls([6, 7]);
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.log("reload page");
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#Ac")).should("contain.text", "(9,8)");

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("A")];
            }),
        );

        cy.get(cesc("#Ac")).should("contain.text", "(9,8)");
        cy.get(cesc("#Bc")).should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([9, 8]);
            expect(
                stateVariables[await win.resolvePath1("B")].stateValues.xs,
            ).eqls([6, 7]);
        });

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 0.5, y: 3.5 },
            });
        });

        cy.get(cesc("#Ac")).should("contain.text", "(0.5,3.5)");
        cy.get(cesc("#Bc")).should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([0.5, 3.5]);
            expect(
                stateVariables[await win.resolvePath1("B")].stateValues.xs,
            ).eqls([6, 7]);
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.log("reload page");
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#Ac")).should("contain.text", "(0.5,3.5)");

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("A")];
            }),
        );

        cy.get(cesc("#Ac")).should("contain.text", "(0.5,3.5)");
        cy.get(cesc("#Bc")).should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([0.5, 3.5]);
            expect(
                stateVariables[await win.resolvePath1("B")].stateValues.xs,
            ).eqls([6, 7]);
        });

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 8.5, y: 1.5 },
            });
        });

        cy.get(cesc("#Ac")).should("contain.text", "(8.5,1.5)");
        cy.get(cesc("#Bc")).should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([8.5, 1.5]);
            expect(
                stateVariables[await win.resolvePath1("B")].stateValues.xs,
            ).eqls([6, 7]);
        });
    });
});
