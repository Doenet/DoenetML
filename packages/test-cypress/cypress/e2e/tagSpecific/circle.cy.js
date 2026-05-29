import { cesc } from "@doenet/utils";

function nInDOM(n) {
    if (n < 0) {
        return `−${Math.abs(n)}`;
    } else {
        return String(n);
    }
}

describe("Circle Tag Tests", { tags: ["@group3"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("reload essential center from database", () => {
        let doenetML = `
    <text name="a">a</text>
    <graph>
      <circle name="circ" />
    </graph>
    <mathInput bindvalueTo="$circ.radius" name="r" />
    <p>radius: <math extend="$circ.radius" name="r2" /></p>
    <p>Center: <math extend="$circ.center" name="c" /></p>
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("circ")].stateValues
                    .numericalCenter,
            ).eqls([0, 0]);
            expect(
                stateVariables[await win.resolvePath1("circ")].stateValues
                    .numericalRadius,
            ).eq(1);
            cy.get(cesc(`#r2`)).should("contain.text", "1");
        });

        cy.log(`move circle`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "moveCircle",
                componentIdx: await win.resolvePath1("circ"),
                args: { center: [-7, 2] },
            });

            cy.get(cesc(`#r2`)).should("contain.text", "1");
            cy.get(cesc(`#c`)).should(
                "contain.text",
                `(${nInDOM(-7)},${nInDOM(2)})`,
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("circ")].stateValues
                        .numericalCenter,
                ).eqls([-7, 2]);
                expect(
                    stateVariables[await win.resolvePath1("circ")].stateValues
                        .numericalRadius,
                ).eq(1);
            });
        });

        cy.log("change radius");
        cy.get("#r" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc(`#r`) + ` .mq-editable-field`).should("contain.text", "3");
        cy.get(cesc(`#r2`)).should("contain.text", "3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("circ")].stateValues
                    .numericalCenter,
            ).eqls([-7, 2]);
            expect(
                stateVariables[await win.resolvePath1("circ")].stateValues
                    .numericalRadius,
            ).eq(3);
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("circ")];
            }),
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("circ")].stateValues
                    .numericalCenter,
            ).eqls([-7, 2]);
            expect(
                stateVariables[await win.resolvePath1("circ")].stateValues
                    .numericalRadius,
            ).eq(3);
        });
    });

    it("per-component fillOpacity reaches the rendered circle", () => {
        // Regression guard for #1231: a per-component `fillOpacity` override on
        // a filled circle must reach JSXGraph's `fillopacity` rather than stay
        // stuck at the styleNumber default (every preset ships fillOpacity 0.3).
        // This rendering-level check confirms the override survives to the DOM.
        // `labelIsName` so each JXG circle's `name` is the component name (it
        // otherwise defaults to the empty `labelForGraph`), letting us look up
        // the rendered circles by name below.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<graph name="g">
  <circle name="faint" labelIsName center="(-1.5,0)" radius="1.5" styleNumber="3" filled fillOpacity="0.2" />
  <circle name="solid" labelIsName center="(1.5,0)" radius="1.5" styleNumber="3" filled fillOpacity="0.8" />
  <circle name="dflt" labelIsName center="(4.5,0)" radius="1.5" styleNumber="3" filled />
</graph>
`,
                },
                "*",
            );
        });

        cy.get("#g").should("exist");

        cy.get("#g").then(($g) => {
            cy.window().should((win) => {
                const boardRegistry =
                    win.JXG?.boards || win.JXG?.JSXGraph?.boards || {};
                const board = Object.values(boardRegistry).find(
                    (b) => b?.containerObj === $g[0],
                );
                expect(board, "JSXGraph board for graph g").to.exist;

                const circlesByName = Object.fromEntries(
                    Object.values(board.objects)
                        .filter((o) => o?.elType === "circle" && o?.name)
                        .map((c) => [c.name, c]),
                );

                expect(circlesByName.faint, "rendered circle 'faint'").to.exist;
                expect(circlesByName.solid, "rendered circle 'solid'").to.exist;
                expect(circlesByName.dflt, "rendered circle 'dflt'").to.exist;

                // Overrides reach the rendered fill...
                expect(circlesByName.faint.visProp.fillopacity).to.eq(0.2);
                expect(circlesByName.solid.visProp.fillopacity).to.eq(0.8);
                // ...and a sibling without the override keeps styleNumber 3's
                // default (0.3), proving the values aren't coincidentally equal.
                expect(circlesByName.dflt.visProp.fillopacity).to.eq(0.3);
            });
        });
    });
});
