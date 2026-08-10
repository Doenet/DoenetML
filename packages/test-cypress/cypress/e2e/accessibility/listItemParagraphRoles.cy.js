/**
 * Accessibility coverage for the ARIA roles carried by `<p>`.
 *
 * A `<p>` renders as `<div class="para">`, which browsers expose as an
 * anonymous `generic` node rather than a paragraph, so every paragraph
 * carries an explicit `role="paragraph"`.
 *
 * The one exception is the paragraph that leads a list item. A screen reader
 * folds a list item's `::marker` into the item's own text only when that text
 * is a direct child of the `<li>`; a paragraph wrapper turns the marker into a
 * separate object that gets announced as a bare "list marker" instead of
 * "1. Apples, 1 of 3" (issue #662). That leading paragraph is therefore
 * presentational, while later paragraphs in the same item keep their own node
 * so a reader is still told where the next paragraph starts.
 */
describe(
    "List item paragraph role accessibility checks",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            cy.injectAxe();
        });

        function postDoenetML({ doenetML, settleSelector }) {
            cy.get("#testRunner_toggleControls").should("exist");
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
            cy.get(settleSelector).should("exist");
        }

        it("paragraph outside a list item is exposed as a paragraph", () => {
            postDoenetML({
                settleSelector: "#para",
                doenetML: `<p name="para">Hello</p>`,
            });

            cy.get("#para").should("have.attr", "role", "paragraph");
        });

        it("leading paragraph of a list item is presentational", () => {
            postDoenetML({
                settleSelector: "#firstPara",
                doenetML: `<ol>
  <li><p name="firstPara">Apples</p></li>
</ol>`,
            });

            cy.get("#firstPara").should("have.attr", "role", "presentation");
        });

        it("later paragraphs of a list item stay paragraphs", () => {
            postDoenetML({
                settleSelector: "#firstPara",
                doenetML: `<ol>
  <li><p name="firstPara">Apples</p><p name="secondPara">More about apples</p></li>
</ol>`,
            });

            cy.get("#firstPara").should("have.attr", "role", "presentation");
            cy.get("#secondPara").should("have.attr", "role", "paragraph");
        });

        it("leading paragraph is still found across whitespace, and the roles pass axe", () => {
            // The shape authors actually write: the `<p>` is preceded by the
            // whitespace that indents it, which produces no accessibility node
            // and so must not count as the item's leading content.
            postDoenetML({
                settleSelector: "#firstPara",
                doenetML: `<ul>
  <li>
    <p name="firstPara">Apples</p>
    <p name="secondPara">More about apples</p>
  </li>
</ul>`,
            });

            cy.get("#firstPara").should("have.attr", "role", "presentation");
            cy.get("#secondPara").should("have.attr", "role", "paragraph");

            cy.checkAccessibility([".doenet-viewer"], {
                onlyWarnImpacts: ["moderate", "minor"],
            });
        });

        it("paragraph that does not lead its list item stays a paragraph", () => {
            postDoenetML({
                settleSelector: "#trailingPara",
                doenetML: `<ol>
  <li>Apples<p name="trailingPara">More about apples</p></li>
</ol>`,
            });

            cy.get("#trailingPara").should("have.attr", "role", "paragraph");
        });

        it("content pulled in by a composite claims the lead of its list item", () => {
            // A composite's replacements reach the `<li>` renderer as a nested
            // array, and are wrapped in a `<span>` carrying the composite's
            // name. That wrapper holds a block-level paragraph, so it survives
            // in the accessibility tree and keeps the marker out of the item's
            // text run whatever role the paragraph inside it has. Both the
            // paragraph inside the wrapper and the one after it therefore stay
            // paragraphs.
            postDoenetML({
                settleSelector: "#after",
                doenetML: `<p name="src">Apples</p>
<ol>
  <li>$src<p name="after">More about apples</p></li>
</ol>`,
            });

            // Assert the wrapper is really there, so this stays a test of the
            // composite shape rather than passing for an unrelated reason.
            cy.get("#after")
                .parent("li")
                .children()
                .first()
                .should("match", "span")
                .find(".para")
                .should("have.attr", "role", "paragraph");

            cy.get("#after").should("have.attr", "role", "paragraph");
        });

        it("paragraph inside a leading section stays a paragraph", () => {
            // The leading child is an element other than a paragraph, so
            // nothing is made presentational: the section sits between the
            // marker and the text however its contents are marked up.
            postDoenetML({
                settleSelector: "#inSection",
                doenetML: `<ol>
  <li><section name="sec"><p name="inSection">Apples</p></section></li>
</ol>`,
            });

            cy.get("#inSection").should("have.attr", "role", "paragraph");
        });

        // A list item leading with a block that offers the browser no line box
        // gets one from a `::before` holding a zero-width space, so the item's
        // native marker has somewhere to land other than the bottom of the block
        // (#1673, `list.css`). Generated content reaches the accessibility tree,
        // and a stray text node inside the `<li>` is exactly what keeps the
        // marker out of the item's own text run — the #662 shape this file
        // exists to protect — so the anchor declares empty alternative text.
        //
        // The computed `content` is the only trace of that in the DOM: pseudo
        // elements are not nodes, so nothing here can read the space or its
        // absence from the tree. Checked out of band against Chrome's own
        // accessibility tree, where the alternative text leaves the item's nodes
        // byte-identical to an item with no anchor; asserted here as the
        // declaration that produces it, which is what a browser update or an
        // edit to that rule would change.
        it("the marker anchor on a block-leading list item declares empty alternative text", () => {
            postDoenetML({
                settleSelector: "#anchored",
                doenetML: `<ol>
  <li name="anchored"><graph name="g" size="small" decorative /></li>
  <li name="plain">Apples</li>
</ol>`,
            });

            cy.get("#anchored").should(($li) => {
                expect(
                    getComputedStyle($li[0], "::before").content,
                    "the anchor's content carries empty alternative text",
                ).to.equal(`"​" / ""`);
            });

            // The item that needs no anchor gets none, so the space cannot reach
            // an item whose marker the browser already places.
            cy.get("#plain").should(($li) => {
                expect(
                    getComputedStyle($li[0], "::before").content,
                    "an item with an ordinary lead has no anchor",
                ).to.equal("none");
            });

            cy.checkAccessibility([".doenet-viewer"], {
                onlyWarnImpacts: ["moderate", "minor"],
            });
        });

        it("hidden paragraph does not claim the lead of its list item", () => {
            // The core sends `null` for a child it does not render, so a
            // hidden paragraph never reaches the accessibility tree and must
            // not take the leading role from the paragraph after it.
            //
            // The renderer decides the role, while the core decides which child
            // gets its top margin suppressed (`renderInlineForListItem`), and
            // the two used to disagree here: the renderer skipped the hidden
            // paragraph and the core did not. Asserting both on the same element
            // pins them to one answer — the paragraph the renderer promotes to
            // the leading role is the one the core suppresses the margin of.
            postDoenetML({
                settleSelector: "#visiblePara",
                doenetML: `<ol>
  <li><p hide name="hiddenPara">Not shown</p><p name="visiblePara">Apples</p></li>
</ol>`,
            });

            cy.get("#hiddenPara").should("not.exist");
            cy.get("#visiblePara").should("have.attr", "role", "presentation");
            cy.get("#visiblePara").should("have.css", "margin-top", "0px");
        });
    },
);
