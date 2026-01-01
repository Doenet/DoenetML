describe("EditorViewer Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("search and replace does not close after first replace", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<p name="p">An apple a day</p>`,
                },
                "*",
            );
        });

        cy.get("#p").should("have.text", "An apple a day");

        cy.get(".cm-activeLine").type("{ctrl}f");
        cy.get("input[name='search']").type("a");
        cy.get("input[name='replace']").type("x");
        cy.get("button[name='next']").click();
        cy.get("button[name='next']").click();
        cy.get("button[name='replace']").click();
        cy.get("button[name='replace']").click();
        cy.get("button[name='replace']").click();
        cy.get(".cm-activeLine").type("{ctrl}s");

        cy.get("#p").should("have.text", "xn xpple x day");
    });

    it("editor update and reset button", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<p name="p">What is your name? <textInput name="ti" /></p>`,
                },
                "*",
            );
        });

        cy.get("#p").should("have.text", "What is your name? ");
        cy.get("#ti_input").should("have.value", "");
        cy.get("[data-test='Viewer Update Button']")
            .should("be.disabled")
            .should("contain.text", "Reset");

        cy.get("#ti_input").type("My name is Joe.").blur();
        cy.get("#ti_input").should("have.value", "My name is Joe.");
        cy.get("[data-test='Viewer Update Button']")
            .should("not.be.disabled")
            .should("contain.text", "Reset")
            .click();

        cy.get("#ti_input").should("have.value", "");
        cy.get("[data-test='Viewer Update Button']")
            .should("be.disabled")
            .should("contain.text", "Reset");

        cy.get("#ti_input").type("Bob").blur();
        cy.get("#ti_input").should("have.value", "Bob");

        cy.get("[data-test='Viewer Update Button']")
            .should("not.be.disabled")
            .should("contain.text", "Reset");

        cy.get(".cm-activeLine").type(`{ctrl+end}<p name="p2">More text</p>`);

        cy.get("[data-test='Viewer Update Button']")
            .should("not.be.disabled")
            .should("contain.text", "Update");

        cy.get("#p2").should("not.exist");

        cy.get("[data-test='Viewer Update Button']").click();

        cy.get("#p").should("have.text", "What is your name? ");
        cy.get("#p2").should("have.text", "More text");

        cy.get("[data-test='Viewer Update Button']")
            .should("be.disabled")
            .should("contain.text", "Update");

        cy.get("#ti_input").type("Scooby").blur();
        cy.get("#ti_input").should("have.value", "Scooby");
        cy.get("[data-test='Viewer Update Button']")
            .should("not.be.disabled")
            .should("contain.text", "Reset");

        cy.get(".cm-activeLine").type(
            `{ctrl+end}<p name="p3">Even more text</p>`,
        );

        cy.get("[data-test='Viewer Update Button']")
            .should("not.be.disabled")
            .should("contain.text", "Update");

        cy.get("#p3").should("not.exist");

        cy.get(".cm-activeLine").type("{ctrl+s}");

        cy.get("#p3").should("have.text", "Even more text");

        cy.get("[data-test='Viewer Update Button']")
            .should("be.disabled")
            .should("contain.text", "Update");

        cy.get("#ti_input").type("Scrappy").blur();
        cy.get("#ti_input").should("have.value", "Scrappy");
        cy.get("[data-test='Viewer Update Button']")
            .should("not.be.disabled")
            .should("contain.text", "Reset");

        cy.get(".cm-activeLine").type("{ctrl+s}");
        cy.get("#ti_input").should("have.value", "");
    });
});
