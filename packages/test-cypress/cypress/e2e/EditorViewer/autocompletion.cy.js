describe("Autocompletion via $ref.member", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        // Show editor
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
    });

    it("shows member completions for $ref.", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<section name="s1"><p name="innerP">hello</p></section>\n`,
                },
                "*",
            );
        });

        // Wait for content to render in the viewer
        cy.get(".doenet-viewer", { timeout: 10000 }).should(
            "contain.text",
            "hello",
        );

        // Wait for the LSP worker to initialize and process the document
        cy.wait(2000);

        // Move cursor to end and type a ref with a dot
        cy.get(".cm-content").click();
        cy.get(".cm-activeLine").type("{ctrl+end}$s1.");

        // Explicitly trigger autocompletion with Ctrl+Space
        cy.wait(500);
        cy.get(".cm-activeLine").type("{ctrl} ");

        // The autocomplete tooltip should appear with member completions
        cy.get(".cm-tooltip-autocomplete", { timeout: 10000 }).should("exist");

        // Should include the named child "innerP" as a completion
        cy.get(".cm-tooltip-autocomplete").should("contain.text", "innerP");
    });
});

describe(
    "$name visibility filtering with <repeat>",
    { tags: ["@group5"] },
    function () {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            // Show editor
            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showEditor").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();
        });

        it("shows $inside inside repeat but not outside", () => {
            // The document has a <repeat> containing a named <math>.
            // "inside" should be completable from within the repeat but
            // NOT from root level (ChildrenInvisibleToTheirGrandparents).
            //
            // We place the cursor at two locations and verify completions.

            const doenetML = `<section name="sec"><repeat name="rep"><math name="inside">x</math>\n</repeat></section>\n`;

            cy.window().then(async (win) => {
                win.postMessage({ doenetML }, "*");
            });

            // Wait for the viewer to render and LSP to boot
            cy.get(".doenet-viewer", { timeout: 10000 }).should("exist");
            cy.wait(3000);

            // ------ Inside the repeat: $ins should offer "inside" ------
            // Place cursor at the blank line inside the repeat (line 2)
            cy.get(".cm-content").click();
            // Go to line 2 (the newline inside <repeat>, before </repeat>)
            cy.get(".cm-activeLine").type("{ctrl+home}{downArrow}{end}$ins");

            cy.wait(500);
            cy.get(".cm-activeLine").type("{ctrl} ");

            cy.get(".cm-tooltip-autocomplete", { timeout: 10000 }).should(
                "exist",
            );
            cy.get(".cm-tooltip-autocomplete").should("contain.text", "inside");

            // Accept/dismiss the autocomplete and clear what we typed
            cy.get(".cm-activeLine").type("{esc}");
            // Remove the "$ins" we just typed
            cy.get(".cm-activeLine").type(
                "{backspace}{backspace}{backspace}{backspace}",
            );

            // ------ Outside the repeat: $ins should NOT offer "inside" ------
            // Move to the very end (root level, after </section>)
            cy.get(".cm-activeLine").type("{ctrl+end}$ins");

            cy.wait(500);
            cy.get(".cm-activeLine").type("{ctrl} ");

            // Either no autocomplete tooltip at all, or it exists but
            // does NOT contain "inside".
            cy.get("body").then(($body) => {
                if ($body.find(".cm-tooltip-autocomplete").length > 0) {
                    cy.get(".cm-tooltip-autocomplete").should(
                        "not.contain.text",
                        "inside",
                    );
                }
                // If no tooltip appeared, that's also correct — nothing
                // matched the prefix from outside the repeat.
            });
        });
    },
);
