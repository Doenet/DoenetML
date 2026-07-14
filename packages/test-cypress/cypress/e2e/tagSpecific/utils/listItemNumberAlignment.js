import { cesc } from "@doenet/utils";

/**
 * Return the viewport-x of the left edge of an element's rendered CONTENT,
 * excluding the CSS `::before` section-number marker.
 *
 * The section number ("1.", "2.", …) is a `::before` pseudo-element. Pseudo
 * elements are not part of the DOM, so they have no `getBoundingClientRect()`.
 * A `Range` over the element's contents measures only the real (text / replaced)
 * content, so its left edge is the content's hanging-indent position.
 *
 * In every list-item layout the number and the content share the same layout
 * row / columns, so if the content's left edge is identical across sibling list
 * items then their numbers line up at the decimal too. Measuring rendered
 * geometry this way is technique-independent (it works for flex, grid, or
 * absolute positioning) — unlike computed-style assertions, which are identical
 * on the (buggy) flex layout even when the rendered numbers are visibly
 * misaligned. That is the gap that let issue #1482 through the existing suite.
 */
function measureContentLeft(el) {
    const doc = el.ownerDocument;
    const range = doc.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().left;
}

/**
 * Assert that a set of sibling list items render their content — and therefore
 * their section numbers — at the same horizontal position, i.e. the numbers
 * line up at the decimal and no content is shifted right.
 *
 * This is the outcome-based regression guard for #1482 and the recurring
 * list-item-alignment regressions. It is deliberately technique-independent so
 * it survives a change of layout technique (e.g. flex -> grid).
 *
 * @param {string[]} ids Doenet component ids of the sibling list items.
 * @param {Object} [options]
 * @param {number} [options.maxDriftPx=1.5] Allowed left-edge drift in px.
 * @param {string} [options.label] Optional label for the assertion message.
 */
export function verifyListItemNumbersAlign(
    ids,
    { maxDriftPx = 1.5, label = "" } = {},
) {
    const lefts = [];
    ids.forEach((id) => {
        cy.get(`#${cesc(id)}`)
            .should("be.visible")
            .then(($el) => {
                lefts.push(measureContentLeft($el[0]));
            });
    });
    cy.then(() => {
        const min = Math.min(...lefts);
        const max = Math.max(...lefts);
        const detail = ids
            .map((id, i) => `${id}=${lefts[i].toFixed(2)}`)
            .join(", ");
        expect(
            max - min,
            `list-item content-left drift ${label} [${detail}]`,
        ).to.be.lessThan(maxDriftPx);
    });
}
