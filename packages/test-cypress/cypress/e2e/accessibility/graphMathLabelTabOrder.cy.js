/**
 * A graph rendered by JSXGraph is exposed to assistive technology as a single
 * image named by its `<shortDescription>` — or hidden outright, when the author
 * writes `decorative` — so its contents are not reachable as individual
 * accessible objects. MathJax 4, though, attaches its keyboard explorer to
 * everything it typesets, which would otherwise put a `tabindex` tab stop on
 * each math label inside the board — a focus stop on something that is neither
 * in the accessibility tree nor interactive.
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

/**
 * The control the rest of this spec rests on: MathJax really does put its
 * output in the tab order, so an assertion that a graph's math is out of it is
 * checking that we took the tab stop back out — not passing because MathJax
 * never added one.
 */
function verifyMathIsTabbable(selector) {
    cy.get(`${selector} mjx-container`).should("have.attr", "tabindex", "0");
}

function loadDoenetML(doenetML) {
    cy.window().then((win) => {
        win.postMessage({ doenetML }, "*");
    });
    cy.get("#ready").should("have.text", "ready");
}

describe("Graph math label tab order", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
    });

    it("keeps a graph's math label out of the tab order", () => {
        loadDoenetML(`
<text name="ready">ready</text>
<graph name="g">
  <label><m>A</m></label>
</graph>
`);

        // The case that matters: a graph with no interactive controls and no
        // `decorative` is exposed as a single image, which makes everything
        // drawn in it presentational — including a label a tab stop would
        // otherwise land on.
        cy.get("#g-description").should("have.attr", "role", "img");

        verifyMathIsNotTabbable("#g");
    });

    it("keeps math in a point's label out of the tab order", () => {
        loadDoenetML(`
<text name="ready">ready</text>
<graph name="g">
  <point name="P" labelIsName>(1,2)</point>
  <point name="Q">(3,4)<label><m>x^2</m></label></point>
</graph>
`);

        verifyMathIsNotTabbable("#g");
    });

    it("keeps math in a decorative graph out of the tab order", () => {
        // `decorative` drops the graph out of the accessibility tree entirely,
        // where a tab stop inside it is worse still: focus would land on a
        // subtree screen readers are told to ignore.
        loadDoenetML(`
<text name="ready">ready</text>
<graph name="g" decorative>
  <label><m>A</m></label>
</graph>
`);

        cy.get("#g-description").should("have.attr", "aria-hidden", "true");

        verifyMathIsNotTabbable("#g");
    });

    it("keeps a label typeset after mount out of the tab order", () => {
        // Nothing is typeset when the graph mounts, and JSXGraph re-typesets a
        // label whenever its text changes — each pass hands the fresh
        // `<mjx-container>` a new tab stop. This is what the hook's
        // `MutationObserver` is for.
        loadDoenetML(`
<text name="ready">ready</text>
<mathInput name="mi" prefill="1" />
<graph name="g">
  <point name="P">(1,2)<label><m>$mi</m></label></point>
</graph>
`);

        verifyMathIsNotTabbable("#g");

        cy.get("#mi textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        // Waits for the re-typeset, so the assertion below is about the
        // `<mjx-container>` MathJax built the second time around.
        cy.get("#g mjx-container").should("contain.text", "2");

        verifyMathIsNotTabbable("#g");
    });

    it("leaves an input anchored in a graph tabbable", () => {
        // The fix is scoped to MathJax's own elements, so the controls a graph
        // can legitimately contain keep their tab stops.
        loadDoenetML(`
<text name="ready">ready</text>
<graph name="g">
  <mathInput name="mi" anchor="(1,1)" />
  <label><m>A</m></label>
</graph>
`);

        verifyMathIsNotTabbable("#g");
        cy.get("#g textarea").should("have.attr", "tabindex", "0");
    });

    it("leaves math outside a graph tabbable as MathJax renders it", () => {
        // The graph is the exception; math in running text keeps whatever tab
        // behavior MathJax gives it, so this fix stays scoped to the board.
        loadDoenetML(`
<text name="ready">ready</text>
<p name="p"><m>A</m></p>
<graph name="g">
  <label><m>A</m></label>
</graph>
`);

        verifyMathIsTabbable("#p");
        verifyMathIsNotTabbable("#g");
    });
});
