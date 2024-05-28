import { cesc2 } from "@doenet/utils";

describe("RegionBetweenCurves Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("region between two curves", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <function name="f1">sin(x)</function>
    <function name="f2">cos(x)</function>
    <regionBetweenCurves name="r" boundaryValues="-3 5">$f1 $f2</regionBetweenCurves>
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/r{name="r"})
  </graph>

  $g2{name="g3"}


  `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        // Not sure what to test until can test jsxgraph output
    });

    it("region between two curves, flipped", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <curve flipFunction><function name="f1">sin(x)</function></curve>
    <curve flipFunction><function name="f2">cos(x)</function></curve>
    <regionBetweenCurves name="r" boundaryValues="-3 5" flipFunctions>$f1 $f2</regionBetweenCurves>
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/r{name="r"})
  </graph>

  $g2{name="g3"}


  `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        // Not sure what to test until can test jsxgraph output
    });

    it("constrain point to region between two curves", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <mathInput name="a" prefill="-6" />
  <mathInput name="b" prefill="4" />
  <graph>
    <function name="f1">sin(pi x/4)</function>
    <function name="f2">cos(pi x/4)</function>
    <regionBetweenCurves name="r" boundaryValues="$a $b">$f1 $f2</regionBetweenCurves>
    <point name="P">
        (0,5)
        <constraints>
            <constrainTo>$r</constrainTo>
        </constraints>
    </point>
  </graph>

  <point name="P2" copySource="P" />
  <number name="b2" copySource="b" />


  `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        cy.get(cesc2("#/P2") + " .mjx-mrow").should("contain.text", "(0,1)");

        cy.log("move point below");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: -2, y: -6 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−2,−1)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-2, 1e-12);
            expect(py).closeTo(-1, 1e-12);
        });

        cy.log("move point to upper left");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: -9, y: 3 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−6,1)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-6, 1e-12);
            expect(py).closeTo(1, 1e-12);
        });

        cy.log("move point to lower left");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: -8, y: -6 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−6,0)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-6, 1e-12);
            expect(py).closeTo(0, 1e-12);
        });

        cy.log("move point to left");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: -10, y: 0.4 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−6,0.4)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-6, 1e-12);
            expect(py).closeTo(0.4, 1e-12);
        });

        cy.log("move point to right");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: 10, y: -0.2 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(4,−0.2)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(4, 1e-12);
            expect(py).closeTo(-0.2, 1e-12);
        });

        cy.log("move point to upper right");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: 5, y: 4 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(4,0)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(4, 1e-12);
            expect(py).closeTo(0, 1e-12);
        });

        cy.log("move point to lower right");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: 6, y: -9 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(4,−1)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(4, 1e-12);
            expect(py).closeTo(-1, 1e-12);
        });

        cy.log("change boundaries");
        cy.get(cesc2("#/a") + " textarea").type(`{end}{backspace}8{enter}`, {
            force: true,
        });
        cy.get(cesc2("#/b") + " textarea").type(`{end}{backspace}-2{enter}`, {
            force: true,
        });

        cy.get(cesc2("#/b2")).should("have.text", "-2");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-2, 1e-12);
            expect(py).closeTo(-1, 1e-12);
        });

        cy.log("move point to upper right");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: 5, y: 4 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−2,0)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-2, 1e-12);
            expect(py).closeTo(0, 1e-12);
        });

        cy.log("move point to middle");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: -5.2, y: 0.1 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−5.2,0.1)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-5.2, 1e-12);
            expect(py).closeTo(0.1, 1e-12);
        });

        cy.log("move point to top");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: -6, y: 3 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−6,1)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-6, 1e-12);
            expect(py).closeTo(1, 1e-12);
        });

        cy.log("move point to left");
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: `/P`,
                args: { x: -9.2, y: 0.6 },
            });

            cy.get(cesc2("#/P2") + " .mjx-mrow").should(
                "contain.text",
                `(−8,0.6)`,
            );

            let stateVariables = await win.returnAllStateVariables1();

            let px = stateVariables["/P"].stateValues.xs[0];
            let py = stateVariables["/P"].stateValues.xs[1];
            expect(px).closeTo(-8, 1e-12);
            expect(py).closeTo(0.6, 1e-12);
        });
    });
});
