// E2E for the standalone activity coordinator (dist/coordinator.js):
// a static host page (public/coordination-page.html, the PreTeXt model)
// embeds two same-origin `…-if.html` activity iframes under a coordinator
// configured with maxLiveViewers=1, maxConcurrentBoots=1, and shared core
// workers. The child pages know nothing about the coordinator — the
// standalone bundle they load detects the coordinator's URL-fragment token.

const BOOT_TIMEOUT = 60_000;

/**
 * Assert the activity iframe's document has RENDERED the given text (script
 * tags — which hold the raw doenetml source — are excluded).
 */
function assertActivityRenders(selector, text) {
    cy.get(selector)
        .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
        .should((body) => {
            const clone = body.cloneNode(true);
            clone.querySelectorAll("script").forEach((s) => s.remove());
            expect(
                (clone.textContent ?? "").includes(text),
                `${selector} rendered "${text}"`,
            ).to.eq(true);
        });
}

function assertParked(selector) {
    cy.get(selector, { timeout: BOOT_TIMEOUT }).should(($iframe) => {
        expect($iframe[0].src, `${selector} detached`).to.contain(
            "about:blank",
        );
    });
}

describe("standalone activity coordinator", { retries: 1 }, () => {
    it("gates boots, parks the off-screen activity, and restores typed state on scroll-back", () => {
        cy.viewport(1000, 660);
        cy.visit("/coordination-page.html");

        // Activity 1 (visible) boots through its boot slot; activity 2 (far
        // below the viewport) stays detached — it never loads at all.
        assertActivityRenders("#act1", "One typed:");
        cy.get("#act2").should(($iframe) => {
            expect($iframe[0].src, "act2 never booted").to.contain(
                "about:blank",
            );
        });

        // The child obtained its core from the coordinator's shared pool.
        cy.window().then((win) => {
            cy.wrap(null, { timeout: 20_000 }).should(() => {
                const stats = win.doenetCoordinatorStats();
                expect(
                    stats.sharedCorePool.liveCores,
                    `shared cores: ${JSON.stringify(stats)}`,
                ).to.be.gte(1);
            });
        });

        // Type into activity 1 and commit with Enter.
        cy.get("#act1")
            .its("0.contentDocument.body")
            .find("input:not([type=checkbox])", { timeout: BOOT_TIMEOUT })
            .then(cy.wrap)
            .type("carried across the park{enter}");
        assertActivityRenders("#act1", "One typed: carried across the park");

        // Scroll to activity 2: it boots on visibility; activity 1 leaves
        // the viewport, gets flushed, and parks (its iframe detaches to
        // about:blank — the element and layout stay).
        cy.get("#act2").scrollIntoView();
        assertActivityRenders("#act2", "Activity two body");
        assertParked("#act1");

        // Scroll back: activity 1 reboots, asks the coordinator for its
        // state (SPLICE.getState), and the typed work is restored with no
        // user interaction. Activity 2 parks in turn (budget 1).
        cy.get("#act1").scrollIntoView();
        assertActivityRenders("#act1", "One typed: carried across the park");
        cy.get("#act1")
            .its("0.contentDocument.body")
            .find("input:not([type=checkbox])", { timeout: BOOT_TIMEOUT })
            .should("have.value", "carried across the park");
        assertParked("#act2");

        // Steady state: one live activity, one parked, no held boot slots.
        cy.window().then((win) => {
            cy.wrap(null, { timeout: 20_000 }).should(() => {
                const stats = win.doenetCoordinatorStats();
                expect(
                    stats,
                    `settled: ${JSON.stringify(stats)}`,
                ).to.deep.include({ booting: 0, bootQueue: 0 });
                expect(stats.byState.live ?? 0, "live").to.eq(1);
                expect(stats.byState.parked ?? 0, "parked").to.eq(1);
            });
        });
    });
});
