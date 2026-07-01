describe("EditorViewer Tests", { tags: ["@group5"] }, function () {
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

        // Ctrl+S is a no-op when the button shows "Reset" (no code change
        // pending) — the viewer should not reset and the input must be preserved.
        cy.get(".cm-activeLine").type("{ctrl+s}");
        cy.get("#ti_input").should("have.value", "Scrappy");
        cy.get("[data-test='Viewer Update Button']")
            .should("not.be.disabled")
            .should("contain.text", "Reset");

        // Clicking the Reset button still works.
        cy.get("[data-test='Viewer Update Button']").click();
        cy.get("#ti_input").should("have.value", "");
    });

    it("format as button", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<math expand>x < y</math>`,
                },
                "*",
            );
        });

        cy.get(".cm-content").should(
            "contain.text",
            "<math expand>x < y</math>",
        );

        cy.log("Format as XML via the footer menu");
        cy.get("[data-test='footer-menu-button']").click();
        cy.get("[data-test='footer-menu-format-xml']").click();

        cy.get(".cm-content").should(
            "contain.text",
            '<math expand="true">x &lt; y</math>',
        );

        cy.log("Format as DoenetML via the footer menu");
        cy.get("[data-test='footer-menu-button']").click();
        cy.get("[data-test='footer-menu-format-doenetml']").click();

        cy.get(".cm-content").should(
            "contain.text",
            '<math expand="true">x < y</math>',
        );
    });

    it("footer tabs open/close the diagnostics panel", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<p>hello</p>`,
                },
                "*",
            );
        });

        cy.get(".cm-content").should("contain.text", "<p>hello</p>");

        cy.log("Panel mounts open on the help tab by default");
        cy.get(".diagnostics-response-tabs-panels").should("exist");
        cy.get("[data-test='footer-tab-help']").should(
            "have.attr",
            "aria-selected",
            "true",
        );

        cy.log(
            "All footer tabs and the three-dot menu render in the default config",
        );
        cy.get("[data-test='footer-tab-errors']").should("exist");
        cy.get("[data-test='footer-tab-warnings']").should("exist");
        cy.get("[data-test='footer-tab-info']").should("exist");
        cy.get("[data-test='footer-tab-accessibility']").should("exist");
        cy.get("[data-test='footer-tab-responses']").should("exist");
        cy.get("[data-test='footer-menu-button']").should("exist");

        cy.log("Click the active help tab to close the panel");
        cy.get("[data-test='footer-tab-help']").click();
        cy.get(".diagnostics-response-tabs-panels").should("not.exist");

        cy.log("Click the errors tab to reopen the panel on errors");
        cy.get("[data-test='footer-tab-errors']").click();
        cy.get(".diagnostics-response-tabs-panels").should("exist");
        cy.get("[data-test='footer-tab-errors']").should(
            "have.attr",
            "aria-selected",
            "true",
        );

        cy.log("Click the active errors tab again to close");
        cy.get("[data-test='footer-tab-errors']").click();
        cy.get(".diagnostics-response-tabs-panels").should("not.exist");
    });

    it("toggles info diagnostics annotations in editor", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<sequence length="n" />`,
                },
                "*",
            );
        });

        cy.get("#info").click();
        cy.contains("Invalid length of sequence").should("exist");

        cy.get(".cm-lintRange").should("not.exist");

        cy.contains(
            "label.diagnostic-editor-toggle",
            "Show info diagnostics in editor",
        )
            .find("input[type='checkbox']")
            .as("infoCheckbox")
            .should("not.be.checked");

        cy.get("@infoCheckbox").click().should("be.checked");
        cy.get(".cm-lintRange").should("exist");

        cy.get("@infoCheckbox").click().should("not.be.checked");
        cy.get(".cm-lintRange").should("not.exist");
    });
});
