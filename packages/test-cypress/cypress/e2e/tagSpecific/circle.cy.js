import { cesc, cesc2 } from "@doenet/utils";

function nInDOM(n) {
    if (n < 0) {
        return `−${Math.abs(n)}`;
    } else {
        return String(n);
    }
}

describe("Circle Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("reload essential center from database", () => {
        let doenetML = `
    <text>a</text>
    <graph>
      <circle name="circ" />
    </graph>
    <mathinput bindvalueTo="$(circ.radius)" name="r" />
    <p>radius: $circ.radius{assignNames="r2"}</p>
    <p>Center: $circ.center{assignNames="c"}</p>
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

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
                0, 0,
            ]);
            expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
            cy.get(cesc(`#\\/r2`)).should("contain.text", "1");
        });

        cy.log(`move circle`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "moveCircle",
                componentIdx: "/circ",
                args: { center: [-7, 2] },
            });

            cy.get(cesc(`#\\/r2`)).should("contain.text", "1");
            cy.get(cesc(`#\\/c`)).should(
                "contain.text",
                `(${nInDOM(-7)},${nInDOM(2)})`,
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/circ"].stateValues.numericalCenter,
                ).eqls([-7, 2]);
                expect(stateVariables["/circ"].stateValues.numericalRadius).eq(
                    1,
                );
            });
        });

        cy.log("change radius");
        cy.get(cesc("#\\/r") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc(`#\\/r`) + ` .mq-editable-field`).should(
            "contain.text",
            "3",
        );
        cy.get(cesc(`#\\/r2`)).should("contain.text", "3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
                -7, 2,
            ]);
            expect(stateVariables["/circ"].stateValues.numericalRadius).eq(3);
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

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables["/circ"];
            }),
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
                -7, 2,
            ]);
            expect(stateVariables["/circ"].stateValues.numericalRadius).eq(3);
        });
    });
});
