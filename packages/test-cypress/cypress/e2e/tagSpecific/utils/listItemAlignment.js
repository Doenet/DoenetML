import { cesc } from "@doenet/utils";

/**
 * Verifies that sideBySide panel wrappers stay top-aligned and do not drift
 * vertically relative to each other in list-item layout mode when using
 * flex-start alignment.
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

    cy.get(`#${escapedSideBySideId}`).then(($el) => {
        const win = $el[0].ownerDocument.defaultView;
        const style = win.getComputedStyle($el[0]);
        expect(style.getPropertyValue("display")).to.equal("flex");
        expect(style.getPropertyValue("align-items")).to.equal(
            expectedAlignment,
        );
    });

    cy.get(`#${escapedSideBySideId} > span`).each(($el) => {
        const win = $el[0].ownerDocument.defaultView;
        const style = win.getComputedStyle($el[0]);
        expect(style.getPropertyValue("display")).to.equal("flex");
        expect(style.getPropertyValue("align-items")).to.equal("flex-start");
    });

    if (expectedAlignment === "flex-start") {
        cy.get(`#${escapedSideBySideId} > span`).then(($spans) => {
            const tops = [...$spans].map(
                (el) => el.getBoundingClientRect().top,
            );
            const minTop = Math.min(...tops);
            const maxTop = Math.max(...tops);

            // Allow small browser/font variance while preventing staircase drift.
            expect(maxTop - minTop).to.be.lessThan(maxVerticalDriftPx);
        });
    }
}
