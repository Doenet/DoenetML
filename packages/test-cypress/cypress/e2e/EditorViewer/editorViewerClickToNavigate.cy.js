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
         * Load `threeParagraphs`, cmd+click the rendered `#name` element
         * (whose text is `text`), and assert the code editor's cursor
         * landed on that paragraph's source line. (Navigation only fires
         * with the Cmd/Ctrl modifier held.)
         */
        function clickAndExpectCursorOnSourceLine(name, text) {
            cy.window().then((win) => {
                win.postMessage({ doenetML: threeParagraphs }, "*");
            });

            cy.get(`#${name}`).should("have.text", text);

            cy.get(`#${name}`).click({ metaKey: true });

            cy.get(".cm-activeLine").should(
                "contain.text",
                `<p name="${name}">${text}</p>`,
            );
        }

        it("cmd+clicking a rendered element moves the code editor's cursor to its source", () => {
            clickAndExpectCursorOnSourceLine("p2", "Second paragraph.");
        });

        it("cmd+clicking a different element moves the cursor to a different, correct line", () => {
            clickAndExpectCursorOnSourceLine("p3", "Third paragraph.");
        });

        it("a plain click on a rendered element does not move the editor's cursor", () => {
            cy.window().then((win) => {
                win.postMessage({ doenetML: threeParagraphs }, "*");
            });

            cy.get("#p2").should("have.text", "Second paragraph.");

            cy.get("#p2").click();
            // Give any (incorrect) navigation time to land before checking.
            cy.wait(300);
            cy.get(".cm-activeLine").should("not.contain.text", `name="p2"`);

            // Positive control: the same click with the modifier navigates.
            cy.get("#p2").click({ metaKey: true });
            cy.get(".cm-activeLine").should("contain.text", `name="p2"`);
        });

        it("cmd+clicking a line in the editor scrolls the viewer to the matching element", () => {
            const paragraphs = [];
            for (let i = 1; i <= 60; i++) {
                paragraphs.push(`<p name="p${i}">Paragraph number ${i}.</p>`);
            }
            const doenetML = paragraphs.join("\n");

            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });

            cy.get("#p60").should("have.text", "Paragraph number 60.");

            function expectP40OffScreen() {
                cy.get("#p40").should(($el) => {
                    const rect = $el[0].getBoundingClientRect();
                    expect(
                        rect.bottom < 0 ||
                            rect.top > Cypress.config("viewportHeight"),
                    ).to.be.true;
                });
            }

            function expectP40OnScreen() {
                cy.get("#p40", { timeout: 8000 }).should(($el) => {
                    const rect = $el[0].getBoundingClientRect();
                    expect(rect.top).to.be.within(
                        0,
                        Cypress.config("viewportHeight"),
                    );
                    expect(rect.bottom).to.be.greaterThan(0);
                });
            }

            // The viewer should still be scrolled to the top at this point.
            expectP40OffScreen();

            // A plain click in the editor moves the cursor but must NOT
            // scroll the viewer.
            cy.contains(".cm-line", `name="p40"`).click();
            cy.wait(400);
            expectP40OffScreen();

            // Cmd+click on the same line scrolls the viewer to the
            // corresponding rendered element.
            cy.contains(".cm-line", `name="p40"`).click({ metaKey: true });
            expectP40OnScreen();

            // Repeating the gesture on the very same spot works: scroll the
            // viewer away by hand, then Cmd+click that line again. (The
            // request is a one-shot signal, not a sticky position — a
            // repeat that resolved to an unchanged value would be silently
            // dropped.)
            cy.get("#p1").scrollIntoView();
            expectP40OffScreen();

            cy.contains(".cm-line", `name="p40"`).click({ metaKey: true });
            expectP40OnScreen();
        });

        it("ctrl+clicking a line in the editor navigates without leaving a second cursor", () => {
            // Ctrl is the modifier a Windows/Linux user actually presses
            // (the other tests use Cmd, which CodeMirror ignores off
            // macOS), and it is also the one CodeMirror reads by default as
            // "add another selection range". The editor turns that reading
            // off, or the navigation gesture would leave a stray second
            // cursor and the next keystroke would type in two places.
            const paragraphs = [];
            for (let i = 1; i <= 60; i++) {
                paragraphs.push(`<p name="p${i}">Paragraph number ${i}.</p>`);
            }
            const doenetML = paragraphs.join("\n");

            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });

            cy.get("#p60").should("have.text", "Paragraph number 60.");

            // Put the cursor on a neighboring line first, so a stray extra
            // cursor would show up as a second highlighted line. Neighboring
            // (rather than far away) so both lines stay rendered — CodeMirror
            // only draws the lines near the viewport.
            cy.contains(".cm-line", `name="p41"`).click();
            cy.get(".cm-activeLine").should("have.length", 1);

            cy.contains(".cm-line", `name="p40"`).click({ ctrlKey: true });

            // Exactly one cursor, on the line just clicked.
            cy.get(".cm-activeLine").should("have.length", 1);
            cy.get(".cm-activeLine").should("contain.text", `name="p40"`);

            // ...and the gesture still did its job.
            cy.get("#p40", { timeout: 8000 }).should(($el) => {
                const rect = $el[0].getBoundingClientRect();
                expect(rect.top).to.be.within(
                    0,
                    Cypress.config("viewportHeight"),
                );
                expect(rect.bottom).to.be.greaterThan(0);
            });
        });

        it("cmd+clicking a rendered element centers the matching line in the editor, not just at an edge", () => {
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
            cy.get("#p50").click({ metaKey: true });

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
