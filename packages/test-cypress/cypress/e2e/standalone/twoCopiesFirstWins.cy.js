// E2E proof of first-copy-wins across two live copies of the standalone
// bundle in one page (public/two-copy-page.html): the page evaluates the
// built single-file bundle twice — each import creates fresh function objects
// — then records whether the globals and the shared worker URL still belong
// to the first copy. The probe also records that the second import really
// was a second evaluation (its module namespace exports fresh functions), and
// the worker URL is marked with a query sentinel between the two evaluations,
// so each first-copy-wins entry can only be true when the second copy
// actually deferred. Rendering must also still work, showing the surviving
// globals are live, not leftovers. This pairing rule is what keeps a page
// that includes the script tag twice at different releases from driving one
// release's worker with the other release's UI.

describe(
    "standalone two-copy first-copy-wins",
    { tags: ["@group1"], retries: 1 },
    () => {
        it("keeps the first copy's globals and worker URL when a second copy evaluates", () => {
            cy.visit("/two-copy-page.html");

            // The document renders and responds through whatever the globals
            // hold after both copies evaluated.
            cy.get(".doenetml-applet input").first().type("twice{enter}");
            cy.get(".doenetml-applet").should("contain.text", "Typed: twice");

            cy.window().then((win) => {
                const probe = win.__twoCopyProbe;
                expect(probe, "probe recorded after second copy").to.exist;
                for (const [key, value] of Object.entries(probe)) {
                    expect(value, key).to.eq(true);
                }
            });
        });
    },
);
