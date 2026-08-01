import { cesc } from "@doenet/utils";

/**
 * Return the viewport-x of an element's rendered CONTENT on the side the text
 * starts from, excluding the CSS `::before` section-number marker.
 *
 * The section number ("1.", "2.", …) is a `::before` pseudo-element. Pseudo
 * elements are not part of the DOM, so they have no `getBoundingClientRect()`.
 * A `Range` over the element's contents measures only the real (text / replaced)
 * content, so its starting edge is the content's hanging-indent position.
 *
 * The *starting* edge, not the left one: in a right-to-left document the text
 * begins at the right, the number hangs off that side, and every item's left
 * edge instead varies with how wide its content happens to be. Measuring the
 * left edge there would compare the ragged ends of the lines and report drift
 * that is not a bug — or, worse, miss real drift because two different content
 * widths happened to cancel it out.
 *
 * In every list-item layout the number and the content share the same layout
 * row / columns, so if the content's starting edge is identical across sibling
 * list items then their numbers line up at the decimal too. Measuring rendered
 * geometry this way is technique-independent (it works for flex, grid, or
 * absolute positioning) — unlike computed-style assertions, which are identical
 * on the (buggy) flex layout even when the rendered numbers are visibly
 * misaligned. That is the gap that let issue #1482 through the existing suite.
 */
function measureContentStart(el) {
    const doc = el.ownerDocument;
    const range = doc.createRange();
    range.selectNodeContents(el);
    const rect = range.getBoundingClientRect();
    const rtl = doc.defaultView.getComputedStyle(el).direction === "rtl";
    return rtl ? rect.right : rect.left;
}

/**
 * Assert that a set of sibling list items render their content — and therefore
 * their section numbers — at the same horizontal position, i.e. the numbers
 * line up at the decimal and no content is shifted inward.
 *
 * This is the outcome-based regression guard for #1482 and the recurring
 * list-item-alignment regressions. It is deliberately technique-independent so
 * it survives a change of layout technique (e.g. flex -> grid), and
 * direction-independent so it survives the document being right-to-left.
 *
 * @param {string[]} ids Doenet component ids of the sibling list items.
 * @param {Object} [options]
 * @param {number} [options.maxDriftPx=1.5] Allowed start-edge drift in px.
 * @param {string} [options.label] Optional label for the assertion message.
 */
export function verifyListItemNumbersAlign(
    ids,
    { maxDriftPx = 1.5, label = "" } = {},
) {
    const starts = [];
    ids.forEach((id) => {
        cy.get(`#${cesc(id)}`)
            .should("be.visible")
            .then(($el) => {
                starts.push(measureContentStart($el[0]));
            });
    });
    cy.then(() => {
        const min = Math.min(...starts);
        const max = Math.max(...starts);
        const detail = ids
            .map((id, i) => `${id}=${starts[i].toFixed(2)}`)
            .join(", ");
        expect(
            max - min,
            `list-item content-start drift ${label} [${detail}]`,
        ).to.be.lessThan(maxDriftPx);
    });
}
