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
 * How far above and below the `<li>`'s own box the marker scan reaches. The
 * marker's box is at most a line tall and starts on a line of the item's
 * content, so a margin of a few px is enough to contain any overhang while
 * still proving the band was not cut off at the edge of the scan (see
 * {@link findMarkerBand}).
 *
 * The same number doubles as the slack in the single-row band check in
 * {@link verifyListItemMarkerSharesRowWith}: the band it measures can legitimately
 * run this far past the target row, because that is exactly how far the scan lets
 * a marker overhang the item's box.
 */
const MARKER_SCAN_MARGIN_PX = 8;

/**
 * Find the vertical band a real `<li>`'s native `::marker` is painted in, in
 * viewport coordinates.
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
 * A marker helper that quietly finds nothing is a helper that passes on a broken
 * page, so every way the scan can come up short is reported rather than absorbed:
 *
 * - The x probes step across the whole gutter in 2px steps, finer than any
 *   marker box can be, so no marker glyph can slip between two of them.
 *   `noGutter` reports a gutter too narrow to hold an on-screen probe, `noList`
 *   an item that is not in a list at all.
 * - Hit testing only reaches what is on screen, so the item is centred in the
 *   viewport first — inside the caller's retried assertion, so that late layout
 *   (MathJax typesetting a choice, say) is re-centred rather than measured where
 *   it used to be. The scan window ({@link MARKER_SCAN_MARGIN_PX} beyond the
 *   item on both sides) still has to fit; `offscreen` reports an item taller
 *   than the viewport, rather than silently measuring the visible part of a
 *   clipped marker.
 * - `clipped` reports a band that touches an edge of the scan window, and so
 *   may have been cut off there, leaving its center meaningless.
 *
 * @returns {{band: {top: number, bottom: number}}
 *   | {problem: "noList"|"noGutter"|"offscreen"|"clipped"|"notFound",
 *        detail: string}}
 */
function findMarkerBand(li) {
    const doc = li.ownerDocument;
    const view = doc.defaultView;
    li.scrollIntoView({ block: "center" });
    const liBox = li.getBoundingClientRect();
    // `closest`, not `parentElement`: a composite's replacements are wrapped in
    // a `<span>` inside the list (see `addCommasForCompositeRanges`).
    const list = li.closest("ol, ul");
    if (!list) {
        return {
            problem: "noList",
            detail: "the item is not inside an <ol>/<ul>, so there is no list padding to scan (a section's list item, which has no native marker at all, lands here too)",
        };
    }
    const listBox = list.getBoundingClientRect();
    const rtl = view.getComputedStyle(li).direction === "rtl";
    const gutter = rtl
        ? listBox.right - liBox.right
        : liBox.left - listBox.left;

    const xs = [];
    for (let inset = 2; inset < gutter; inset += 2) {
        const x = rtl ? liBox.right + inset : liBox.left - inset;
        if (x >= 0 && x < view.innerWidth) {
            xs.push(x);
        }
    }
    if (xs.length === 0) {
        return {
            problem: "noGutter",
            detail: `no on-screen probe point fits in the ${gutter.toFixed(1)}px gutter between the list and the item`,
        };
    }

    const scanTop = Math.floor(liBox.top) - MARKER_SCAN_MARGIN_PX;
    const scanBottom = Math.ceil(liBox.bottom) + MARKER_SCAN_MARGIN_PX;
    if (scanTop < 0 || scanBottom > view.innerHeight) {
        return {
            problem: "offscreen",
            detail: `rows ${scanTop}-${scanBottom} do not fit in the ${view.innerHeight}px viewport; scroll the item into view or shorten the fixture`,
        };
    }

    let top = null;
    let bottom = null;
    for (let y = scanTop; y <= scanBottom; y += 1) {
        if (xs.some((x) => doc.elementFromPoint(x, y) === li)) {
            if (top === null) {
                top = y;
            }
            bottom = y;
        }
    }

    if (top === null) {
        return {
            problem: "notFound",
            detail: `nothing in the gutter at x=${xs[0].toFixed(0)}..${xs[xs.length - 1].toFixed(0)} hit the item on any row`,
        };
    }
    if (top === scanTop || bottom === scanBottom) {
        return {
            problem: "clipped",
            detail: `band ${top}-${bottom} reaches the edge of the scanned rows ${scanTop}-${scanBottom}`,
        };
    }

    return { band: { top, bottom } };
}

/**
 * {@link findMarkerBand}, with every way it can come up short turned into a
 * failure naming the item and the reason. Both assertions below go through this,
 * so neither can absorb a scan that found nothing — which is how a marker helper
 * comes to pass on a broken page.
 *
 * @param {Element} li The `<li>` to scan.
 * @param {string} liId Doenet component id of that item, for the message.
 * @returns {{top: number, bottom: number}} The band, in viewport coordinates.
 */
function measureMarkerBand(li, liId) {
    const { band, problem, detail } = findMarkerBand(li);
    expect(
        problem,
        `${liId}'s native ::marker could not be measured (${problem}: ${detail})`,
    ).to.be.undefined;
    return band;
}

/**
 * Assert that a real `<li>`'s native `::marker` is painted on the item's own
 * first row: the row the marker of `textItemId` — a sibling item that begins with
 * ordinary text — occupies relative to *its* item.
 *
 * This is the assertion for an item leading with a block whose box offers the
 * browser no line box to put the marker on — a `<graph>`, an `<image>`, a
 * `<video>`, a `<tabular>` — where the browser draws the marker after all of the
 * item's content instead (#1673) and `list.css` supplies a line box at the top.
 *
 * {@link verifyListItemMarkerSharesRowWith} cannot ask this. Its target must be a
 * single-line element, and the whole trouble with these leads is that the top of
 * the item holds no line of text to name: given the graph's own box as the
 * target, "the marker's center is inside the target" is satisfied by the bug, and
 * the band-height check that would notice loosens to the height of the graph.
 *
 * Stating it against a sibling item rather than a tolerance is what makes it an
 * assertion about the reader's experience — the number lands where a plain text
 * item's number lands — and both items are measured in the same page, so a font
 * or zoom difference moves the reference too.
 *
 * @param {string} liId Doenet component id of the item whose lead is a block.
 * @param {string} textItemId Doenet component id of a sibling item that begins
 *   with ordinary text.
 * @param {number} [maxDriftPx=2] Allowed disagreement, in px, between the two
 *   items' marker rows.
 */
export function verifyListItemMarkerOnFirstRow(
    liId,
    textItemId,
    maxDriftPx = 2,
) {
    const rows = {};
    [textItemId, liId].forEach((id) => {
        cy.get(`#${cesc(id)}`).should(($li) => {
            const li = $li[0];
            const band = measureMarkerBand(li, id);
            const liTop = li.getBoundingClientRect().top;
            rows[id] = {
                top: band.top - liTop,
                height: band.bottom - band.top,
            };
        });
    });

    cy.then(() => {
        const reference = rows[textItemId];
        const measured = rows[liId];
        const detail =
            `${liId} marker starts ${measured.top.toFixed(0)}px into its item ` +
            `and is ${measured.height.toFixed(0)}px tall; ${textItemId} ` +
            `${reference.top.toFixed(0)}px and ${reference.height.toFixed(0)}px`;

        expect(
            measured.top,
            `${liId}'s number is on the item's first row [${detail}]`,
        ).to.be.closeTo(reference.top, maxDriftPx);
        // A band taller than the text item's is a band that locked onto
        // something else reaching into the gutter, which could straddle the
        // first row and satisfy the check above on a page where the marker is
        // elsewhere.
        expect(
            measured.height,
            `${liId}'s marker band is one row tall [${detail}]`,
        ).to.be.closeTo(reference.height, maxDriftPx);
    });
}

/**
 * Assert that a real `<li>`'s native `::marker` is painted on the same row as
 * `targetSelector` — e.g. that item 1's "1." sits beside a question label rather
 * than beside the first choice below it, the misalignment fixed in #1668.
 *
 * This is the vertical-axis, outcome-based analogue of
 * {@link verifyListItemNumbersAlign}: it measures where the marker actually
 * rendered (see {@link findMarkerBand}) rather than the mechanisms that place it.
 * It works in either direction, taking the gutter from the side the text starts
 * from, for the same reason the helpers above do.
 *
 * @param {string} liId Doenet component id of the `<li>`.
 * @param {string} targetSelector CSS selector for the element whose row the
 *   marker must share. Use a single-line element (a label, not a whole block) —
 *   the assertion is that the marker band's center falls inside its box.
 */
export function verifyListItemMarkerSharesRowWith(liId, targetSelector) {
    cy.get(targetSelector).should("be.visible");
    cy.get(`#${cesc(liId)}`).should(($li) => {
        const li = $li[0];
        const target = li.ownerDocument.querySelector(targetSelector);
        expect(target, `${targetSelector} exists`).to.not.be.null;

        const band = measureMarkerBand(li, liId);
        const liTop = li.getBoundingClientRect().top;
        const targetBox = target.getBoundingClientRect();
        const markerCenter = (band.top + band.bottom) / 2;
        const relative = (y) => (y - liTop).toFixed(0);
        const bands =
            `marker rows ${relative(band.top)}-${relative(band.bottom)}px into ${liId}, ` +
            `${targetSelector} occupies ${relative(targetBox.top)}-${relative(targetBox.bottom)}px`;

        // A native marker's box is one line tall, so a band much taller than the
        // single-line target means the scan locked onto something else that
        // reaches into the gutter — which could straddle the target's row and
        // pass the assertion below on a page where the marker is elsewhere.
        expect(
            band.bottom - band.top,
            `${liId} marker band is a single row tall [${bands}]`,
        ).to.be.at.most(targetBox.height + MARKER_SCAN_MARGIN_PX);

        expect(
            markerCenter,
            `${liId} marker is on the row of ${targetSelector} [${bands}]`,
        ).to.be.within(targetBox.top, targetBox.bottom);
    });
}
