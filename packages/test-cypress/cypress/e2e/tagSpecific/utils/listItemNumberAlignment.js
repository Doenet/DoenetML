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

/**
 * Find the vertical band a real `<li>`'s native `::marker` is painted in, in
 * viewport coordinates, or `null` if no marker was found.
 *
 * A native marker is not in the DOM, and — unlike a section's `::before` number,
 * which shares a layout row with the content — it perturbs no queryable rect:
 * with a labeled `<choiceInput>` leading an `<li>`, the `<li>`'s box, the
 * fieldset's, the label's, the choices', and a `Range` over the `<li>`'s
 * contents all measure the same whether the marker lands on the label's row or
 * the row below it. So a "content top edge == `<li>` top edge" helper of the
 * shape used for the horizontal axis above guards nothing here.
 *
 * Hit testing does see the marker, though. Its box overflows the `<li>` into the
 * list's start-side padding, so a point out in that gutter hits the `<li>`
 * itself on the marker's row and the `<ol>`/`<ul>` on every other row — the one
 * DOM-visible trace of the marker's position (measured in Chrome). Scanning the
 * gutter row by row recovers the band.
 *
 * Hit testing only reaches what is on screen, so the caller must have the rows
 * of interest scrolled into view.
 */
function findMarkerBand(li) {
    const doc = li.ownerDocument;
    const view = doc.defaultView;
    const liBox = li.getBoundingClientRect();
    const listBox = li.parentElement.getBoundingClientRect();
    const rtl = view.getComputedStyle(li).direction === "rtl";
    const gutter = rtl
        ? listBox.right - liBox.right
        : liBox.left - listBox.left;

    const xs = [];
    for (let inset = 3; inset < gutter; inset += 3) {
        const x = rtl ? liBox.right + inset : liBox.left - inset;
        if (x >= 0 && x < view.innerWidth) {
            xs.push(x);
        }
    }

    let top = null;
    let bottom = null;
    const lastRow = Math.min(liBox.bottom, view.innerHeight);
    for (let y = Math.max(Math.ceil(liBox.top), 0); y < lastRow; y += 1) {
        if (xs.some((x) => doc.elementFromPoint(x, y) === li)) {
            if (top === null) {
                top = y;
            }
            bottom = y;
        }
    }

    return top === null ? null : { top, bottom };
}

/**
 * Assert that a real `<li>`'s native `::marker` is painted on the same row as
 * `targetSelector` — e.g. that item 1's "1." sits beside a question label rather
 * than beside the first choice below it (issue #1668).
 *
 * This is the vertical-axis, outcome-based analogue of
 * {@link verifyListItemNumbersAlign}: it measures where the marker actually
 * rendered (see {@link findMarkerBand}) rather than the mechanisms that place it.
 *
 * @param {string} liId Doenet component id of the `<li>`.
 * @param {string} targetSelector CSS selector for the element whose row the
 *   marker must share. Use a single-line element (a label, not a whole block) —
 *   the assertion is that the marker band's center falls inside its box.
 */
export function verifyListItemMarkerSharesRowWith(liId, targetSelector) {
    cy.get(targetSelector).should("be.visible");
    // The marker is found by hit testing, which only sees the viewport.
    cy.get(`#${cesc(liId)}`).scrollIntoView();
    cy.get(`#${cesc(liId)}`).should(($li) => {
        const li = $li[0];
        const target = li.ownerDocument.querySelector(targetSelector);
        expect(target, `${targetSelector} exists`).to.not.be.null;

        const band = findMarkerBand(li);
        expect(band, `a native ::marker was found beside ${liId}`).to.not.be
            .null;

        const liTop = li.getBoundingClientRect().top;
        const targetBox = target.getBoundingClientRect();
        const markerCenter = (band.top + band.bottom) / 2;
        const relative = (y) => (y - liTop).toFixed(0);
        const detail =
            `marker rows ${relative(band.top)}-${relative(band.bottom)}px into ${liId}, ` +
            `${targetSelector} occupies ${relative(targetBox.top)}-${relative(targetBox.bottom)}px`;

        expect(
            markerCenter,
            `${liId} marker is on the row of ${targetSelector} [${detail}]`,
        ).to.be.within(targetBox.top, targetBox.bottom);
    });
}
