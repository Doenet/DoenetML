import { cesc } from "@doenet/utils";

describe("SubsetOfRealsInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("subsetOfRealsInput state can be reloaded from local state", () => {
        const doenetML = `
  <p><subsetOfRealsInput name="sori" /></p>
  <p>Value: <subsetOfReals extend="$sori" name="sor" /></p>
  <p>Value: <mathInput extend="$sori.subsetValue" name="sormi" /></p>
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

        cy.get(cesc("#sor")).should("contain.text", "∅");

        cy.get(cesc("#sormi") + " textarea").type(
            "{end}{backspace}{{}3}{enter}",
            {
                force: true,
            },
        );

        cy.get(cesc("#sor")).should("contain.text", "{3}");
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

        cy.get(cesc("#sor")).should("contain.text", "{3}");
    });
});
