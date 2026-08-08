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

/**
 * Assert that a list item's number hangs in the gutter on the side the text
 * starts from, i.e. that its content is inset from that edge of its own box.
 *
 * {@link verifyListItemNumbersAlign} only says the siblings agree with each
 * other, which a layout that put every number on the wrong side would satisfy
 * too. This says *which* side, so the two together pin the layout in either
 * direction.
 *
 * @param {string} id Doenet component id of the list item.
 * @param {"ltr"|"rtl"} direction The direction the document is laid out in.
 * @param {number} [minGutterPx=1] Smallest inset that counts as a gutter.
 */
export function verifyListItemNumberGutterSide(id, direction, minGutterPx = 1) {
    cy.get(`#${cesc(id)}`).should(($el) => {
        const el = $el[0];
        const box = el.getBoundingClientRect();
        // From the element's own document: `document` in a spec file is the
        // Cypress runner's, not the application's.
        const range = el.ownerDocument.createRange();
        range.selectNodeContents(el);
        const content = range.getBoundingClientRect();
        const rtl = direction === "rtl";
        const gutter = rtl
            ? box.right - content.right
            : content.left - box.left;
        expect(
            gutter,
            `${id} gutter is on the ${rtl ? "right" : "left"}`,
        ).to.be.greaterThan(minGutterPx);
    });
}

/*
 * Note on the *vertical* axis, for a real `<ol>/<ul>` `<li>`: there is no
 * equivalent geometry-based helper here, and that is deliberate.
 *
 * The horizontal helpers above work because a section's number is a `::before`
 * pseudo-element that shares a layout row with the content, so the content's own
 * box position reveals where the number went. A real `<li>`'s native `::marker`
 * shares nothing: it is painted in the `<ol>`'s padding, outside the `<li>`'s
 * box, and moving it does not perturb a single queryable rect. This was measured
 * for issue #1668 — with the `<li>`'s first child a labeled `<choiceInput>`, the
 * broken layout (`<legend>` kept) and the fixed one (`<div>`) produce *identical*
 * values for `li.getBoundingClientRect()`, the fieldset's rect, the label's rect,
 * the first choice row's rect, and `Range.getBoundingClientRect()` /
 * `getClientRects()` over the `<li>`'s contents. Only the marker moves, and only
 * a screenshot can see it.
 *
 * An earlier version of `list.cy.js` did try a vertical helper of this shape
 * ("content top edge == `<li>` top edge"). It passed against the buggy build, so
 * it guarded nothing. `list.cy.js` therefore asserts the two mechanisms that
 * determine the marker's position instead — the suppressed top margin and the
 * absence of a `<legend>` — both of which were verified to fail before the fix.
 */
