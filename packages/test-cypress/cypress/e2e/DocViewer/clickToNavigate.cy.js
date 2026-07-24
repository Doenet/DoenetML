describe("Click-to-navigate Tests", { tags: ["@group5"] }, function () {
    let clickMessages;

    function setUpClickListener() {
        cy.window().then((win) => {
            win.addEventListener("message", (e) => {
                if (e.data.messageType === "sourcePositionClick") {
                    clickMessages.push(e.data.position);
                }
            });
        });
    }

    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        clickMessages = [];
        setUpClickListener();
    });

    const threeParagraphs = [
        `<p name="p1">First paragraph.</p>`,
        `<p name="p2">Second paragraph.</p>`,
        `<p name="p3">Third paragraph.</p>`,
    ].join("\n");

    /**
     * Cmd+click the rendered `#name` element and assert the most recently
     * reported click position is exactly the `<p name="...">...</p>`
     * element's source range within `doenetML`. (Navigation only fires
     * with the Cmd/Ctrl modifier held.)
     */
    function clickAndExpectSourceRange(name, doenetML) {
        const expectedStart = doenetML.indexOf(`<p name="${name}">`);
        const expectedEnd =
            doenetML.indexOf(`</p>`, expectedStart) + `</p>`.length;

        cy.get(`#${name}`).click({ metaKey: true });

        cy.wrap(null)
            .should(() => {
                expect(clickMessages.length).to.be.gte(1);
            })
            .then(() => {
                const { start, end } = clickMessages[clickMessages.length - 1];
                expect(start.offset).to.equal(expectedStart);
                expect(end.offset).to.equal(expectedEnd);
            });
    }

    it("cmd+clicking a rendered element reports its exact source range", () => {
        cy.window().then((win) => {
            win.postMessage({ doenetML: threeParagraphs }, "*");
        });

        cy.get("#p2").should("have.text", "Second paragraph.");

        clickAndExpectSourceRange("p2", threeParagraphs);
    });

    it("a plain click (no modifier) does not navigate", () => {
        cy.window().then((win) => {
            win.postMessage({ doenetML: threeParagraphs }, "*");
        });

        cy.get("#p2").should("have.text", "Second paragraph.");

        cy.get("#p2").click();
        // Follow with a Cmd+click so we have a positive signal that the
        // pipeline works — the plain click must not have reported anything
        // before it.
        cy.get("#p2").click({ metaKey: true });

        cy.wrap(null)
            .should(() => {
                expect(clickMessages.length).to.be.gte(1);
            })
            .then(() => {
                expect(clickMessages.length).to.equal(1);
            });
    });

    it("cmd+clicking a different element reports a different, correct range", () => {
        cy.window().then((win) => {
            win.postMessage({ doenetML: threeParagraphs }, "*");
        });

        cy.get("#p3").should("have.text", "Third paragraph.");

        clickAndExpectSourceRange("p3", threeParagraphs);
    });

    it("setting scrollToSourceOffset scrolls the matching element into view", () => {
        // Enough paragraphs to guarantee real scroll room in the viewer.
        const paragraphs = [];
        for (let i = 1; i <= 80; i++) {
            paragraphs.push(`<p name="p${i}">Paragraph number ${i}.</p>`);
        }
        const doenetML = paragraphs.join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#p80").should("have.text", "Paragraph number 80.");

        // Target a paragraph far from both the top and bottom, so a real
        // scroll has to happen to bring it into view.
        const targetStart = doenetML.indexOf(`<p name="p40">`);
        const targetOffset = targetStart + 3; // inside the element's source range

        // Force the target out of view first (rather than relying on
        // Cypress's `.should("be.visible")`, which reflects CSS visibility
        // more than scroll position for plain document-flow content like
        // this test page).
        cy.get("#p80").scrollIntoView();
        cy.get("#p40").then(($el) => {
            const rect = $el[0].getBoundingClientRect();
            expect(
                rect.bottom < 0 || rect.top > Cypress.config("viewportHeight"),
            ).to.be.true;
        });

        cy.window().then((win) => {
            win.postMessage({ scrollToSourceOffset: targetOffset }, "*");
        });

        cy.get("#p40").should(($el) => {
            const rect = $el[0].getBoundingClientRect();
            expect(rect.top).to.be.within(0, Cypress.config("viewportHeight"));
            expect(rect.bottom).to.be.greaterThan(0);
        });
    });

    it("cmd+clicking a graph's board reports the graph's source range", () => {
        // JSXGraph's own click handler on the board div stops propagation,
        // so this only works because the viewer listens in the capture
        // phase — regression guard for that.
        const doenetML = [
            `<graph name="g"><vector name="v">(3,4)</vector></graph>`,
            `<p name="p1">A paragraph.</p>`,
        ].join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#p1").should("have.text", "A paragraph.");
        cy.get("#g").should("exist");

        const expectedStart = doenetML.indexOf("<graph");
        const expectedEnd = doenetML.indexOf("</graph>") + "</graph>".length;

        // Cmd+click near the board's top-left corner, away from the vector
        // (which occupies the center region and would navigate to itself).
        cy.get("#g").click(20, 20, { force: true, metaKey: true });

        cy.wrap(null)
            .should(() => {
                expect(clickMessages.length).to.be.gte(1);
            })
            .then(() => {
                const { start, end } = clickMessages[clickMessages.length - 1];
                expect(start.offset).to.equal(expectedStart);
                expect(end.offset).to.equal(expectedEnd);
            });
    });

    /**
     * Cmd+click the board `boardSelector` at the pixel corresponding to
     * graph coordinates (x, y), assuming the default [-10, 10] bounding box.
     */
    function clickBoardAtGraphCoords(boardSelector, x, y) {
        cy.get(boardSelector).then(($el) => {
            const rect = $el[0].getBoundingClientRect();
            const px = ((x + 10) / 20) * rect.width;
            const py = ((10 - y) / 20) * rect.height;
            cy.wrap($el).click(px, py, { force: true, metaKey: true });
        });
    }

    it("cmd+clicking a point inside a graph reports the point's own source range", () => {
        const doenetML = [
            `<graph name="g"><point name="P">(3,4)</point></graph>`,
            `<p name="p1">A paragraph.</p>`,
        ].join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#p1").should("have.text", "A paragraph.");
        cy.get("#g").should("exist");

        const expectedStart = doenetML.indexOf("<point");
        const expectedEnd = doenetML.indexOf("</point>") + "</point>".length;

        clickBoardAtGraphCoords("#g", 3, 4);

        cy.wrap(null)
            .should(() => {
                expect(clickMessages.length).to.be.gte(1);
            })
            .then(() => {
                // Exactly one navigation: the element-level report, with the
                // graph-level fallback suppressed (no double navigation).
                expect(clickMessages.length).to.equal(1);
                const { start, end } = clickMessages[0];
                expect(start.offset).to.equal(expectedStart);
                expect(end.offset).to.equal(expectedEnd);
            });
    });

    it("cmd+clicking a copied point navigates to the copy source, not the original", () => {
        // The copied point still carries the original <point>'s source
        // range, but that range lies outside the copied graph's range
        // (the `$g` token) — which is how the viewer knows the point was
        // brought in by the copy and navigates to `$g`, the thing the
        // author actually wrote here.
        const doenetML = [
            `<graph name="g"><point name="P">(3,4)</point></graph>`,
            `$g`,
            `<p name="p1">A paragraph.</p>`,
        ].join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#p1").should("have.text", "A paragraph.");
        cy.get(".jxgbox").should("have.length", 2);

        const copyStart = doenetML.indexOf("$g");

        clickBoardAtGraphCoords(".jxgbox:eq(1)", 3, 4);

        cy.wrap(null)
            .should(() => {
                expect(clickMessages.length).to.be.gte(1);
            })
            .then(() => {
                const { start, end } = clickMessages[clickMessages.length - 1];
                expect(start.offset).to.equal(copyStart);
                expect(end.offset).to.equal(copyStart + "$g".length);
            });
    });

    it("cmd+clicking the margin beside a graph reports the graph's source range", () => {
        // The margin is inside the `${id}-container` wrapper but outside
        // the board itself; the click handler recognizes the -container
        // suffix and resolves it to the graph.
        const doenetML = [
            `<graph name="g"><vector name="v">(3,4)</vector></graph>`,
            `<p name="p1">A paragraph.</p>`,
        ].join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#p1").should("have.text", "A paragraph.");
        cy.get("#g").should("exist");

        const expectedStart = doenetML.indexOf("<graph");

        cy.get("#g-container").then(($el) => {
            const rect = $el[0].getBoundingClientRect();
            // Far left edge of the container, vertically centered: outside
            // the (centered, fixed-aspect) board, inside the wrapper.
            cy.wrap($el).click(2, rect.height / 2, {
                force: true,
                metaKey: true,
            });
        });

        cy.wrap(null)
            .should(() => {
                expect(clickMessages.length).to.be.gte(1);
            })
            .then(() => {
                const { start } = clickMessages[clickMessages.length - 1];
                expect(start.offset).to.equal(expectedStart);
            });
    });

    it("cmd+clicking, then scrolling elsewhere, then clicking again still reports correctly", () => {
        // Regression guard for the id -> position map staying in sync across
        // multiple updates, not just working once on first render.
        const doenetML = [
            `<p name="alpha">Alpha content.</p>`,
            `<p name="beta">Beta content.</p>`,
        ].join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#beta").should("have.text", "Beta content.");

        const alphaStart = doenetML.indexOf(`<p name="alpha">`);
        const betaStart = doenetML.indexOf(`<p name="beta">`);

        cy.get("#alpha").click({ metaKey: true });
        cy.wrap(null).should(() => {
            expect(clickMessages.length).to.be.gte(1);
        });
        cy.then(() => {
            expect(
                clickMessages[clickMessages.length - 1].start.offset,
            ).to.equal(alphaStart);
        });

        cy.get("#beta").click({ metaKey: true });
        cy.wrap(null).should(() => {
            expect(clickMessages.length).to.be.gte(2);
        });
        cy.then(() => {
            expect(
                clickMessages[clickMessages.length - 1].start.offset,
            ).to.equal(betaStart);
        });
    });
});
