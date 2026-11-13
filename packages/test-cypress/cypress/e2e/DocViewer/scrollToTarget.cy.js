describe("Scroll to a named target", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Enough paragraphs that the target starts far below the window.
    const longDocument = Array.from(
        { length: 60 },
        (_, i) => `<p name="p${i + 1}">Paragraph ${i + 1}.</p>`,
    ).join("\n");

    // Whether the element is in the window. Scrolling an element to the
    // very top can leave it a fraction of a pixel above the edge.
    function isInWindow($el, win) {
        const rect = $el[0].getBoundingClientRect();
        return rect.top > -1 && rect.bottom <= win.innerHeight + 1;
    }

    it("scrolls to the named element once it renders", () => {
        cy.window().then((win) => {
            win.postMessage(
                { doenetML: longDocument, scrollToTarget: "p50" },
                "*",
            );
        });

        cy.get("#p50").should("have.text", "Paragraph 50.");
        cy.window().then((win) => {
            cy.get("#p50").should(($el) => {
                expect(isInWindow($el, win)).to.equal(true);
            });
            cy.get("#p1").should(($el) => {
                expect(isInWindow($el, win)).to.equal(false);
            });
        });
    });

    it("stays at the top when no element has the name", () => {
        cy.window().then((win) => {
            win.postMessage(
                { doenetML: longDocument, scrollToTarget: "noSuchName" },
                "*",
            );
        });

        cy.get("#p60").should("have.text", "Paragraph 60.");
        // give a wrongly-timed scroll the chance to happen
        cy.wait(500);
        cy.window().its("scrollY").should("equal", 0);
    });

    it("scrolls to a target named after the document has rendered", () => {
        cy.window().then((win) => {
            win.postMessage({ doenetML: longDocument }, "*");
        });
        cy.get("#p60").should("have.text", "Paragraph 60.");
        cy.window().its("scrollY").should("equal", 0);

        cy.window().then((win) => {
            win.postMessage({ scrollToTarget: "p40" }, "*");
        });
        cy.window().then((win) => {
            cy.get("#p40").should(($el) => {
                expect(isInWindow($el, win)).to.equal(true);
            });
        });
    });
});
