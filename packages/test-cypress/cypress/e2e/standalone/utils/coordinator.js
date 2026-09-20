// Shared helpers for the standalone activity-coordinator e2e specs.
//
// Every coordinated host page (`public/coordination-*.html`) embeds the same
// kind of activity: a same-origin `…-if.html` iframe whose document loads
// `@doenet/standalone`. Reaching into one — to read what it rendered, to type
// into it, or to check that the coordinator has detached it — is the same work
// in every spec, so it lives here.

/** Generous enough for a cold standalone bundle plus a core boot. */
const BOOT_TIMEOUT = 60_000;

/** The activity's text input (the filter skips checkbox-shaped widgets). */
export function activityInput(selector) {
    return cy
        .get(selector)
        .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
        .find("input:not([type=checkbox])", { timeout: BOOT_TIMEOUT })
        .then(cy.wrap);
}

/**
 * Assert the activity iframe's document has RENDERED the given text (script
 * tags — which hold the raw doenetml source — are excluded).
 */
export function assertActivityRenders(selector, text) {
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

/**
 * Assert the coordinator has parked the activity: the `<iframe>` element (and
 * so the page layout) stays, but its `src` has been pointed at `about:blank`.
 */
export function assertParked(selector) {
    cy.get(selector, { timeout: BOOT_TIMEOUT }).should(($iframe) => {
        expect($iframe[0].src, `${selector} detached`).to.contain(
            "about:blank",
        );
    });
}

/** Replace whatever the activity's input holds with `text` and commit it. */
export function typeIntoActivity(selector, text) {
    activityInput(selector).clear().type(`${text}{enter}`);
}
