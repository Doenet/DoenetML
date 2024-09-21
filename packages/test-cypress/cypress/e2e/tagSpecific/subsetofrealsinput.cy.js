import { cesc2 } from "@doenet/utils";

describe("SubsetOfRealsInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("subsetOfRealsInput state can be reloaded from local state", () => {
        const doenetML = `
  <text>a</text>
  <p><subsetOfRealsInput name="sori" /></p>
  <p>Value: <subsetOfReals copySource="sori" name="sor" /></p>
  <p>Value: <mathInput copySource="sori.subsetValue" name="sormi" /></p>
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
        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        cy.get(cesc2("#/sor")).should("contain.text", "∅");

        cy.get(cesc2("#/sormi") + " textarea").type(
            "{end}{backspace}{{}3}{enter}",
            {
                force: true,
            },
        );

        cy.get(cesc2("#/sor")).should("contain.text", "{3}");
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

        cy.get(cesc2("#/sor")).should("contain.text", "{3}");
    });
});
