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
    },
);
