/**
 * Accessibility coverage for how a formula reaches a screen reader.
 *
 * MathJax 4 exposes an expression only as an empty
 * `<mjx-speech role="img" aria-label="…">`. VoiceOver handles that badly —
 * MathJax's own documentation records that it "skips the ARIA labels" and, in
 * read-next mode, "might jump back to a preceding element after reading the
 * ARIA label on each expression" — so formulas go unspoken. Issue #1456 caught
 * it inside a `<sideBySide>`, where the jump after the first formula landed in
 * the neighbouring column and two of the three formulas in the first column
 * were never read.
 *
 * `mathSpeechText.ts` therefore rewrites every expression so the speech string
 * is real text inside `<mjx-speech>` instead of a label on it, which is what
 * these tests assert: text present, the label and `img` role gone so the words
 * are not announced twice, the braille label still in place, and every formula
 * on the page reachable in document order.
 */
describe("Math speech text accessibility checks", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        cy.injectAxe();
    });

    /** A single formula, for the cases that only need one to look at. */
    const SINE_DOC = `<p name="sin"><m>\\sin(\\theta) = \\dfrac{2}{5}</m></p>`;

    /** Matches the spans `mathSpeechText.ts` adds. */
    const SPEECH_TEXT = "[data-doenet-math-speech]";

    /**
     * Generous enough to cover loading MathJax from the CDN on a cold cache.
     * Each assertion resolves as soon as the text lands.
     */
    const SPEECH_TIMEOUT = { timeout: 15000 };

    function postDoenetML({ doenetML, settleSelector }) {
        cy.get("#testRunner_toggleControls").should("exist");
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(settleSelector).should("exist");
    }

    /**
     * The speech string arrives asynchronously, well after the typeset that
     * created the element, so every assertion waits on the exposed text rather
     * than on the container.
     */
    function speechTextOf(selector) {
        return cy
            .get(`${selector} ${SPEECH_TEXT}`, SPEECH_TIMEOUT)
            .should("not.have.text", "");
    }

    it("exposes a formula's speech string as text, not only as an aria-label", () => {
        postDoenetML({
            settleSelector: "#sin",
            doenetML: SINE_DOC,
        });

        speechTextOf("#sin").should("contain.text", "sine theta equals");

        // The words must reach a reader exactly once, so the label they came
        // from is gone — along with the role that would suppress the text as a
        // source of the element's name.
        cy.get("#sin mjx-speech").should("not.have.attr", "aria-label");
        cy.get("#sin mjx-speech").should("not.have.attr", "role");
        // `<mjx-speech>` is what MathJax focuses to explore an expression, so it
        // must stay visible to assistive technology rather than being hidden.
        cy.get("#sin mjx-speech").should("not.have.attr", "aria-hidden");
        cy.get("#sin mjx-math").should("have.attr", "aria-hidden", "true");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("keeps the added text out of sight", () => {
        postDoenetML({
            settleSelector: "#sin",
            doenetML: SINE_DOC,
        });

        speechTextOf("#sin").should(($text) => {
            const el = $text[0];
            const style = el.ownerDocument.defaultView.getComputedStyle(el);
            expect(style.getPropertyValue("position")).to.equal("absolute");
            expect(style.getPropertyValue("overflow")).to.equal("hidden");
            // Hidden by clipping rather than by `display`/`visibility`, both of
            // which would take the text back out of the accessibility tree.
            expect(style.getPropertyValue("display")).to.not.equal("none");
            expect(style.getPropertyValue("visibility")).to.equal("visible");
            expect(el.getBoundingClientRect().width).to.be.lessThan(2);
        });
    });

    it("keeps the braille label", () => {
        postDoenetML({
            settleSelector: "#sin",
            doenetML: SINE_DOC,
        });

        speechTextOf("#sin");

        // The label stays on `<mjx-speech>`, which still has an accessible name
        // — taken from the text now nested inside it — for it to apply to.
        cy.get("#sin mjx-speech").should("have.attr", "aria-braillelabel");
    });

    it("updates the text when the formula changes", () => {
        postDoenetML({
            settleSelector: "#m",
            doenetML: `
<mathInput name="mi" prefill="x" />
<p><m name="m">$mi</m></p>`,
        });

        speechTextOf("#m").should("contain.text", "x");

        cy.get("#mi textarea").type("^2{enter}", { force: true });

        speechTextOf("#m").should("contain.text", "squared");
    });

    it("reaches every formula of a sideBySide of stacks, in document order", () => {
        // The document from issue #1456: three formulas per column, where a
        // reader heard only the first of the left column before jumping to the
        // right one.
        postDoenetML({
            settleSelector: "#cot",
            doenetML: `
<sideBySide margins="5%">
  <stack>
    <p name="sin"><m>\\sin(\\theta) = \\dfrac{2}{5}</m></p>
    <p name="cos"><m>\\cos(\\theta) = \\dfrac{-\\sqrt{21}}{5}</m></p>
    <p name="tan"><m>\\tan(\\theta) = \\dfrac{2}{-\\sqrt{21}}</m></p>
  </stack>
  <stack>
    <p name="csc"><m>\\csc(\\theta) = \\dfrac{5}{2}</m></p>
    <p name="sec"><m>\\sec(\\theta) = \\dfrac{5}{-\\sqrt{21}}</m></p>
    <p name="cot"><m>\\cot(\\theta) = \\dfrac{-\\sqrt{21}}{2}</m></p>
  </stack>
</sideBySide>`,
        });

        const expected = [
            "sine",
            "cosine",
            "tangent",
            "cosecant",
            "secant",
            "cotangent",
        ];

        cy.get(`.doenet-viewer ${SPEECH_TEXT}`, SPEECH_TIMEOUT)
            .should("have.length", expected.length)
            .should(($texts) => {
                // `cy.get` returns elements in document order, so this asserts
                // the reading order a screen reader walks, not just presence.
                const spoken = [...$texts].map((el) => el.textContent);
                expected.forEach((word, i) => {
                    expect(spoken[i]).to.contain(word);
                });
            });
    });

    it("renders sideBySide panels as block elements holding the block children", () => {
        // A panel's children are always block components, so the wrapper may not
        // be phrasing content.
        postDoenetML({
            settleSelector: "#sbs",
            doenetML: `
<sideBySide name="sbs" margins="5%">
  <stack><p name="left">Left</p></stack>
  <stack><p name="right">Right</p></stack>
</sideBySide>`,
        });

        cy.get("#sbs > *").should("have.length", 2);
        cy.get("#sbs > *").each(($panel) => {
            expect($panel[0].tagName).to.equal("DIV");
        });

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
