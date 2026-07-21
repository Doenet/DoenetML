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

    it("clicking a rendered element reports its exact source range", () => {
        const doenetML = [
            `<p name="p1">First paragraph.</p>`,
            `<p name="p2">Second paragraph.</p>`,
            `<p name="p3">Third paragraph.</p>`,
        ].join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#p2").should("have.text", "Second paragraph.");

        const expectedStart = doenetML.indexOf(`<p name="p2">`);
        const expectedEnd =
            doenetML.indexOf(`</p>`, expectedStart) + `</p>`.length;

        cy.get("#p2").click();

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

    it("clicking a different element reports a different, correct range", () => {
        const doenetML = [
            `<p name="p1">First paragraph.</p>`,
            `<p name="p2">Second paragraph.</p>`,
            `<p name="p3">Third paragraph.</p>`,
        ].join("\n");

        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#p3").should("have.text", "Third paragraph.");

        const expectedStart = doenetML.indexOf(`<p name="p3">`);
        const expectedEnd =
            doenetML.indexOf(`</p>`, expectedStart) + `</p>`.length;

        cy.get("#p3").click();

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
        const targetOffset = targetStart + 3; // inside the tag's content

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

    it("clicking, then scrolling elsewhere, then clicking again still reports correctly", () => {
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

        cy.get("#alpha").click();
        cy.wrap(null).should(() => {
            expect(clickMessages.length).to.be.gte(1);
        });
        cy.then(() => {
            expect(
                clickMessages[clickMessages.length - 1].start.offset,
            ).to.equal(alphaStart);
        });

        cy.get("#beta").click();
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
