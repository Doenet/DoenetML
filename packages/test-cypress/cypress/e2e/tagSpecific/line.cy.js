describe("Line Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Testing bug in saving essential state set in definition
    it("reload line", () => {
        let doenetML = `
    <text>a</text>
    <graph>
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line name="l" through="$A $B" />
    </graph>
    <p>$A.coords{assignNames="Ac"}, $B.coords{assignNames="Bc"}</p>
    <p>$l.equation{assignNames="le"}</p>
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

        // use this to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(1,2)");
        cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(3,4)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
        });

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/A",
                args: { x: 9, y: 8 },
            });
            win.callAction1({
                actionName: "movePoint",
                componentName: "/B",
                args: { x: 6, y: 7 },
            });
        });

        cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(9,8)");
        cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/A"].stateValues.xs).eqls([9, 8]);
            expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
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

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables["/A"];
            }),
        );

        cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(9,8)");
        cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/A"].stateValues.xs).eqls([9, 8]);
            expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
        });

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/A",
                args: { x: 0.5, y: 3.5 },
            });
        });

        cy.get(cesc("#\\/Ac") + " .mjx-mrow").should(
            "contain.text",
            "(0.5,3.5)",
        );
        cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/A"].stateValues.xs).eqls([0.5, 3.5]);
            expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
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

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables["/A"];
            }),
        );

        cy.get(cesc("#\\/Ac") + " .mjx-mrow").should(
            "contain.text",
            "(0.5,3.5)",
        );
        cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/A"].stateValues.xs).eqls([0.5, 3.5]);
            expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
        });

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/A",
                args: { x: 8.5, y: 1.5 },
            });
        });

        cy.get(cesc("#\\/Ac") + " .mjx-mrow").should(
            "contain.text",
            "(8.5,1.5)",
        );
        cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/A"].stateValues.xs).eqls([8.5, 1.5]);
            expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
        });
    });
});
