describe(
    "Standalone uncoordinated same-page viewers",
    { tags: ["@group5"] },
    () => {
        it("renders multiple documents on one page without iframes", () => {
            cy.visit("/uncoordinated-same-page.html");

            // Verify all viewers have rendered and contain the named paragraph
            // Use [id$="hello"] to match IDs ending with "hello" (auto-generated prefix)
            cy.get("#viewer-1")
                .find('[id$="hello"]')
                .should("contain", "Hello world");
            cy.get("#viewer-2")
                .find('[id$="hello"]')
                .should("contain", "Hello world");
            cy.get("#viewer-3")
                .find('[id$="hello"]')
                .should("contain", "Hello world");
        });
    },
);
