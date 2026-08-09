import { cesc } from "@doenet/utils";

/**
 * Verifies that sideBySide panel wrappers stay top-aligned and do not drift
 * vertically relative to each other in list-item layout mode when using
 * flex-start alignment.
 *
 * Everything is asserted inside `should` callbacks, never `then`/`each`: the
 * alignment this reads is `listItemInlineAlignment`, which arrives from the
 * worker, so a callback run exactly once races the first paint — the flake
 * tracked as #1320, and the same reason `problem.cy.js`'s `withBeforeStyle()`
 * uses `should`. Every callback here only asserts, so retrying one has no other
 * effect.
 *
 * @param {Object} options
 * @param {string} options.sideBySideId Doenet component id for the sideBySide.
 * @param {"baseline"|"flex-start"} [options.expectedAlignment="flex-start"]
 * Expected list-item alignment for panel wrappers.
 * @param {number} [options.maxVerticalDriftPx=2.5] Maximum allowed top-edge drift in px.
 */
export function verifySideBySideColumnTopAlignment({
    sideBySideId,
    expectedAlignment = "flex-start",
    maxVerticalDriftPx = 2.5,
}) {
    const escapedSideBySideId = cesc(sideBySideId);

    cy.get(`#${escapedSideBySideId}`).should(($el) => {
        const win = $el[0].ownerDocument.defaultView;
        const style = win.getComputedStyle($el[0]);
        expect(style.getPropertyValue("display")).to.equal("flex");
        expect(style.getPropertyValue("align-items")).to.equal(
            expectedAlignment,
        );
    });

    cy.get(`#${escapedSideBySideId} > span`).should(($spans) => {
        $spans.each((_, el) => {
            const win = el.ownerDocument.defaultView;
            const style = win.getComputedStyle(el);
            expect(style.getPropertyValue("display")).to.equal("flex");
            expect(style.getPropertyValue("align-items")).to.equal(
                "flex-start",
            );
        });

        if (expectedAlignment === "flex-start") {
            const tops = [...$spans].map(
                (el) => el.getBoundingClientRect().top,
            );
            // Allow small browser/font variance while preventing staircase drift.
            expect(Math.max(...tops) - Math.min(...tops)).to.be.lessThan(
                maxVerticalDriftPx,
            );
        }
    });
}
