describe("Graph controls accessibility", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
        cy.injectAxe();
    });

    it("supports accessible disclosure semantics for long graph control lists", () => {
        function getToggleC() {
            return cy
                .contains("#g-controls h3", /^\s*C\s*$/)
                .find("button[aria-expanded]");
        }

        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly" controlsPosition="left" width="640px">
  <point name="A" labelIsName>(1,1)</point>
  <point name="B" labelIsName>(2,2)</point>
  <point name="C" labelIsName>(3,3)</point>
  <point name="D" labelIsName>(4,4)</point>
  <point name="E" labelIsName>(5,5)</point>
  <point name="F" labelIsName>(6,6)</point>
  <point name="G" labelIsName>(7,7)</point>
</graph>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");

        getToggleC()
            .invoke("attr", "aria-expanded")
            .then((initialExpandedRaw) => {
                const initialExpanded = initialExpandedRaw === "true";

                if (initialExpanded) {
                    getToggleC().click();
                }

                getToggleC()
                    .focus()
                    .should("be.focused")
                    .should(
                        "have.attr",
                        "aria-label",
                        "Expand control details for C",
                    )
                    .should("have.attr", "aria-expanded", "false")
                    .should("not.have.attr", "aria-controls");

                cy.get('[aria-label="x coordinate for C"]').should("not.exist");

                getToggleC().click();

                getToggleC()
                    .should(
                        "have.attr",
                        "aria-label",
                        "Collapse control details for C",
                    )
                    .should("have.attr", "aria-expanded", "true")
                    .invoke("attr", "aria-controls")
                    .then((contentId) => {
                        expect(contentId).to.be.a("string").and.not.equal("");
                        cy.get(`#${contentId}`).should(
                            "have.attr",
                            "role",
                            "region",
                        );
                    });

                cy.get('[aria-label="x coordinate for C"]').should("exist");
            });

        cy.checkAccessibility(["#g-controls"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
