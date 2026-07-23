describe(
    "EditorViewer Click-to-navigate Tests",
    { tags: ["@group5"] },
    function () {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showEditor").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();
        });

        const threeParagraphs = [
            `<p name="p1">First paragraph.</p>`,
            `<p name="p2">Second paragraph.</p>`,
            `<p name="p3">Third paragraph.</p>`,
        ].join("\n");

        /**
         * Load `threeParagraphs`, click the rendered `#name` element (whose
         * text is `text`), and assert the code editor's cursor landed on
         * that paragraph's source line.
         */
        function clickAndExpectCursorOnSourceLine(name, text) {
            cy.window().then((win) => {
                win.postMessage({ doenetML: threeParagraphs }, "*");
            });

            cy.get(`#${name}`).should("have.text", text);

            cy.get(`#${name}`).click();

            cy.get(".cm-activeLine").should(
                "contain.text",
                `<p name="${name}">${text}</p>`,
            );
        }

        it("clicking a rendered element moves the code editor's cursor to its source", () => {
            clickAndExpectCursorOnSourceLine("p2", "Second paragraph.");
        });

        it("clicking a different element moves the cursor to a different, correct line", () => {
            clickAndExpectCursorOnSourceLine("p3", "Third paragraph.");
        });

        it("moving the code editor's cursor scrolls the viewer to follow", () => {
            const paragraphs = [];
            for (let i = 1; i <= 60; i++) {
                paragraphs.push(`<p name="p${i}">Paragraph number ${i}.</p>`);
            }
            const doenetML = paragraphs.join("\n");

            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });

            cy.get("#p60").should("have.text", "Paragraph number 60.");

            // The viewer should still be scrolled to the top at this point.
            cy.get("#p40").then(($el) => {
                const rect = $el[0].getBoundingClientRect();
                expect(
                    rect.bottom < 0 ||
                        rect.top > Cypress.config("viewportHeight"),
                ).to.be.true;
            });

            // Clicking a line in the editor moves the CodeMirror cursor there
            // (a real user action, not the programmatic reveal from the other
            // tests), which should debounce-trigger the viewer to follow.
            cy.contains(".cm-line", `name="p40"`).click();

            cy.get("#p40", { timeout: 8000 }).should(($el) => {
                const rect = $el[0].getBoundingClientRect();
                expect(rect.top).to.be.within(
                    0,
                    Cypress.config("viewportHeight"),
                );
                expect(rect.bottom).to.be.greaterThan(0);
            });
        });

        it("clicking a rendered element centers the matching line in the editor, not just at an edge", () => {
            const paragraphs = [];
            for (let i = 1; i <= 100; i++) {
                paragraphs.push(`<p name="p${i}">Paragraph number ${i}.</p>`);
            }
            const doenetML = paragraphs.join("\n");

            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });

            cy.get("#p100").should("have.text", "Paragraph number 100.");

            // Target a line comfortably far from the top and bottom of the
            // document, so there's real room to center it either way.
            cy.get("#p50").click();

            cy.get(".cm-activeLine")
                .should("contain.text", `name="p50"`)
                .then(($line) => {
                    const lineRect = $line[0].getBoundingClientRect();
                    const editorRect = $line[0]
                        .closest(".cm-editor")
                        .getBoundingClientRect();
                    const lineMidY = (lineRect.top + lineRect.bottom) / 2;
                    const editorMidY = (editorRect.top + editorRect.bottom) / 2;
                    // Centered, not flush against the top or bottom edge: allow
                    // some slack for line height / scroll-margin, but a purely
                    // minimal "scrollIntoView" landing at an edge would miss
                    // this by much more than that.
                    expect(Math.abs(lineMidY - editorMidY)).to.be.lessThan(
                        editorRect.height * 0.25,
                    );
                });
        });
    },
);
