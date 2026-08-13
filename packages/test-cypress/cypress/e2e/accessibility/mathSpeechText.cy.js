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
 * are not announced twice, the braille label still in place, the rewrite
 * settling rather than feeding the observer that drives it, and every formula
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
     *
     * The viewer typesets on an off-screen buffer and swaps the rendered nodes
     * into place, so every case below also covers an expression *moved* into
     * the page rather than built there — whichever side of that swap the speech
     * string happens to land on.
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
        // The role descriptions went with that role, so they describe a role
        // the element no longer has.
        cy.get("#sin mjx-speech").should(
            "not.have.attr",
            "aria-roledescription",
        );
        cy.get("#sin mjx-speech").should(
            "not.have.attr",
            "aria-brailleroledescription",
        );
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
            // Laid out, but a sliver: no box at all would mean an ancestor
            // hides it — `<mjx-speech>` is MathJax's, and its styling is what
            // this rewrite hangs the text on.
            const { width } = el.getBoundingClientRect();
            expect(width).to.be.greaterThan(0);
            expect(width).to.be.lessThan(2);
        });
    });

    it("settles once an expression is rewritten", () => {
        postDoenetML({
            settleSelector: "#sin",
            doenetML: SINE_DOC,
        });

        speechTextOf("#sin");

        // The rewrite's own writes reach the observer as a further batch — the
        // appended span, its text, the removed `aria-label` — and none of them
        // is a still-labelled expression. Watching the element the rewrite
        // writes to is what would catch it feeding itself.
        cy.get("#sin mjx-speech").then(($speech) => {
            const el = $speech[0];
            const win = el.ownerDocument.defaultView;
            const records = [];
            const probe = new win.MutationObserver((batch) => {
                records.push(...batch);
            });
            probe.observe(el, {
                subtree: true,
                childList: true,
                attributes: true,
                characterData: true,
            });
            cy.wait(600).then(() => {
                probe.disconnect();
                // The watched element is still the live one, so the quiet above
                // is the page having settled rather than the probe having been
                // detached from it.
                expect(el.ownerDocument.contains(el)).to.equal(true);
                expect(records).to.have.length(0);
            });
        });
    });

    it("keeps the braille label", () => {
        postDoenetML({
            settleSelector: "#sin",
            doenetML: SINE_DOC,
        });

        speechTextOf("#sin");

        // Only the attributes that describe the removed `img` role are dropped.
        // The braille label is MathJax's own rendering of the formula and costs
        // nothing to keep, so it is left exactly as MathJax wrote it.
        cy.get("#sin mjx-speech").should("have.attr", "aria-braillelabel");
    });

    it("exposes math that reaches the page other than through `<m>`", () => {
        // The rewrite is driven by an observer over the whole document, not by
        // the `<m>` renderer, so it has to cover every call site that typesets:
        // a math-bearing input's label and a choice option here stand in for the
        // rest (buttons, the virtual keyboard, graph labels).
        postDoenetML({
            settleSelector: "#ci",
            doenetML: `
<mathInput name="mi"><label><m>x^2</m></label></mathInput>
<choiceInput name="ci">
  <choice><m>\\sqrt{2}</m></choice>
  <choice>Neither</choice>
</choiceInput>`,
        });

        speechTextOf("#mi").should("contain.text", "squared");
        speechTextOf("#ci").should("contain.text", "square root");
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
