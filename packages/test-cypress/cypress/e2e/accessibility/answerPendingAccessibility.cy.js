describe("Answer pending accessibility checks", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        cy.injectAxe();
    });

    function postDoenetML(doenetML) {
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
    }

    it("passes accessibility checks while small check-work button is pending", () => {
        postDoenetML(`
<text name="loaded">ready</text>
<p>
  <answer name="answerPending" symbolicEquality expandOnCompare>
    <mathInput name="miPending" prefill="5/(6 y + 72 - 4 x)^3" />
    <math>5/(6 y + 72 - 4 x)^3</math>
  </answer>
</p>
`);

        cy.get("#loaded").should("have.text", "ready");

        const button = "#miPending_button";

        cy.get(button).should("contain.text", "Check Work");
        cy.get(button).click();

        cy.get(button, { timeout: 3000 }).should(
            "contain.text",
            "Checking answer",
        );

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("passes accessibility checks while full check-work button is pending", () => {
        postDoenetML(`
<text name="loaded">ready</text>
<p>
  <answer
    name="answerPendingFull"
    symbolicEquality
    expandOnCompare
    forceFullCheckWorkButton
  >
    <mathInput name="miPendingFull" prefill="5/(6 y + 72 - 4 x)^3" />
    <math>5/(6 y + 72 - 4 x)^3</math>
  </answer>
</p>
`);

        cy.get("#loaded").should("have.text", "ready");

        const button = "#miPendingFull_button";

        cy.get(button).should("contain.text", "Check Work");
        cy.get(button).click();

        cy.get(button, { timeout: 3000 }).should("contain.text", "Checking...");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
