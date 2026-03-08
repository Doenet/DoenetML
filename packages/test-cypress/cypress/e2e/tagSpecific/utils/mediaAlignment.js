/**
 * Asserts that a non-inline media element remains horizontally centered
 * in its container after opening a details-based description.
 *
 * @param {Object} options
 * @param {string} options.containerSelector Selector for the media container.
 * @param {string} options.mediaSelector Selector for the media element (img/video).
 * @param {string} options.detailsSelector Selector for the details element.
 * @param {string} options.summarySelector Selector for the details summary toggle.
 * @param {number} [options.tolerance=2] Maximum allowed pixel drift.
 *
 * @example
 * assertCenteredWhenDescriptionOpens({
 *   containerSelector: "#image-container",
 *   mediaSelector: "#image",
 *   detailsSelector: "#image-container [data-test='Description']",
 *   summarySelector: "#image-container [data-test='Description Summary']",
 * });
 */
export function assertCenteredWhenDescriptionOpens({
    containerSelector,
    mediaSelector,
    detailsSelector,
    summarySelector,
    tolerance = 2,
}) {
    let leftBefore;

    cy.get(mediaSelector).should("be.visible");

    cy.get(containerSelector).then(($container) => {
        const containerRect = $container[0].getBoundingClientRect();

        cy.get(mediaSelector).then(($media) => {
            const mediaRect = $media[0].getBoundingClientRect();
            leftBefore = mediaRect.left;

            const centerDeltaBefore = Math.abs(
                mediaRect.left +
                    mediaRect.width / 2 -
                    (containerRect.left + containerRect.width / 2),
            );
            expect(centerDeltaBefore).lt(tolerance);
        });
    });

    cy.get(summarySelector).click();
    cy.get(detailsSelector).should("have.attr", "open");

    cy.get(containerSelector).then(($container) => {
        const containerRect = $container[0].getBoundingClientRect();

        cy.get(mediaSelector).then(($media) => {
            const mediaRect = $media[0].getBoundingClientRect();
            const centerDeltaAfter = Math.abs(
                mediaRect.left +
                    mediaRect.width / 2 -
                    (containerRect.left + containerRect.width / 2),
            );

            expect(Math.abs(mediaRect.left - leftBefore)).lt(tolerance);
            expect(centerDeltaAfter).lt(tolerance);
        });
    });
}
