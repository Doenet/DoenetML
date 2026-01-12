describe("Variant Selector Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("variant selector appears with multiple variants and works correctly", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_includeVariantSelector").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <selectFromSequence name="s" from="1" to="3" />
  `,
                },
                "*",
            );
        });

        // Check that variant selector appears
        cy.get(".variant-select").should("exist");

        let s;
        cy.get("#s")
            .invoke("text")
            .then((text) => {
                s = text;
            });

        // Check that first variant is selected
        cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            console.log({ stateVariables });

            const sharedParameters = stateVariables[0].sharedParameters;
            expect(sharedParameters.variant.index).to.equal(1);
        });

        // Check that selecting different variants works
        cy.get("[data-test='Next Variant']").click();

        cy.get("#s")
            .should("not.have.text", s)
            .invoke("text")
            .then((text) => {
                s = text;
            });

        cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            const sharedParameters = stateVariables[0].sharedParameters;
            expect(sharedParameters.variant.index).to.equal(2);
        });

        cy.get("[data-test='Previous Variant']").click();

        cy.get("#s")
            .should("not.have.text", s)
            .invoke("text")
            .then((text) => {
                s = text;
            });

        cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            const sharedParameters = stateVariables[0].sharedParameters;
            expect(sharedParameters.variant.index).to.equal(1);
        });
    });

    it("no variant selector if includeVariantSelect is not set", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <selectFromSequence name="s" from="1" to="3" />
  `,
                },
                "*",
            );
        });

        cy.get("#s").should("be.visible");
        cy.get(".variant-select").should("not.exist");
    });

    it("no variant selector if only one variant", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_includeVariantSelector").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <selectFromSequence name="s" from="1" to="1" />
  `,
                },
                "*",
            );
        });

        cy.get("#s").should("be.visible");
        cy.get(".variant-select").should("not.exist");
    });

    it("no variant selector if allowLocalState is set", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <selectFromSequence name="s" from="1" to="3" />
  `,
                },
                "*",
            );
        });
        cy.get("#s").should("be.visible");
        cy.get(".variant-select").should("not.exist");
    });

    it("no variant selector if allowLoadState is set", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLoadState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <selectFromSequence name="s" from="1" to="3" />
  `,
                },
                "*",
            );
        });
        cy.get("#s").should("be.visible");
        cy.get(".variant-select").should("not.exist");
    });
});
