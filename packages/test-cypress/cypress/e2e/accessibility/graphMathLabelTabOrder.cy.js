/**
 * A graph rendered by JSXGraph is exposed to assistive technology as a single
 * image named by its `<shortDescription>`, so its contents are not reachable
 * as individual accessible objects. MathJax 4, though, attaches its keyboard
 * explorer to everything it typesets, which would otherwise put a `tabindex`
 * tab stop on each math label inside the board — a focus stop on something
 * that is neither in the accessibility tree nor interactive.
 */

/** True when `el` is one of MathJax's own custom elements. */
function isMathJaxElement(el) {
    return el.tagName.startsWith("MJX-");
}

/**
 * Assert that nothing MathJax rendered inside `selector` is in the sequential
 * tab order. Wrapped in `should` so it retries while MathJax typesets.
 */
function verifyMathIsNotTabbable(selector) {
    cy.get(`${selector} mjx-container`).should("exist");
    cy.get(selector).should(($graph) => {
        const tabbableMath = $graph
            .find("[tabindex]")
            .toArray()
            .filter(
                (el) =>
                    isMathJaxElement(el) &&
                    el.getAttribute("tabindex") !== "-1",
            );
        expect(
            tabbableMath.map((el) => el.tagName.toLowerCase()),
            "MathJax elements left in the tab order inside the graph",
        ).to.deep.equal([]);
    });
}

describe("Graph math label tab order", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
    });

    it("keeps a graph's math label out of the tab order", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<graph name="g">
  <label><m>A</m></label>
</graph>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");

        // The case that matters: a graph with no interactive controls and no
        // `decorative` is exposed as a single image, which makes everything
        // drawn in it presentational — including a label a tab stop would
        // otherwise land on.
        cy.get("#g-description").should("have.attr", "role", "img");

        verifyMathIsNotTabbable("#g");
    });

    it("keeps math in a point's label out of the tab order", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<graph name="g">
  <point name="P" labelIsName>(1,2)</point>
  <point name="Q">(3,4)<label><m>x^2</m></label></point>
</graph>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");

        verifyMathIsNotTabbable("#g");
    });

    it("leaves math outside a graph tabbable as MathJax renders it", () => {
        // The graph is the exception; math in running text keeps whatever tab
        // behavior MathJax gives it, so this fix stays scoped to the board.
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<p name="p"><m>A</m></p>
<graph name="g">
  <label><m>A</m></label>
</graph>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");

        verifyMathIsNotTabbable("#g");
        cy.get("#p mjx-container").should("not.have.attr", "tabindex", "-1");
    });
});
