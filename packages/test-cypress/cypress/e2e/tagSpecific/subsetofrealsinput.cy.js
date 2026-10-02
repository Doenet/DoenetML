describe("SubsetOfRealsInput Tag Tests", { tags: ["@group3"] }, function () {
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

        cy.get("#sor").should("contain.text", "∅");

        cy.get("#sormi" + " textarea").type("{end}{backspace}{{}3}{enter}", {
            force: true,
        });

        cy.get("#sor").should("contain.text", "{3}");
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

        cy.get("#sor").should("contain.text", "{3}");
    });

    it("clicking the number line adds a point where it was clicked, also beside the editor", () => {
        // In the editor the number line sits to the right of the code, inside
        // the viewer's scroll container, so its position relative to that
        // container differs from its position in the window.
        const doenetML = `
  <p><subsetOfRealsInput name="sori" /></p>
  <p>Value: <subsetOfReals extend="$sori" name="sor" /></p>
  `;
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
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

        cy.get("#sor").should("contain.text", "∅");

        // Hash marks start at x=40 for -10 and are 36px apart, so x=400 is 0
        // and x=472 is 2.
        cy.get("#sori svg").click(400, 40);
        cy.get("#sor").should("contain.text", "{0}");
        cy.get("#sori svg").click(472, 40);
        cy.get("#sor").should("contain.text", "{0} ∪{2}");
    });
});
