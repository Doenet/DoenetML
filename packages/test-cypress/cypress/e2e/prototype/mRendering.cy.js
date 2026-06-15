/**
 * Regression coverage for `<m>` rendered by the JavaScript core in the
 * prototype. The JS core (like production `@doenet/doenetml`) carries `<m>`'s
 * content in a `latex` prop with no children; the prototype `M` renderer was
 * originally written for the rust core's child-`<text>` representation and
 * rendered its (empty) children, so `<m>$ti</m>` showed nothing under the JS
 * core. The renderer now prefers the `latex` prop.
 *
 * MathJax renders letters as math-italic codepoints with invisible-times
 * separators; `normalizeMath` folds those back to plain ASCII so the assertions
 * are stable.
 */

const inputSelector = ".doenet-document .text-input input";
const mSelector = ".doenet-document .para";

function normalizeMath(text) {
    return (
        text
            // Fold math-italic / styled letters back to ASCII.
            .normalize("NFKC")
            // Drop MathJax's invisible-times (U+2061) and zero-width chars.
            .replace(/[\u2061\u200b\u2062\u2063]/g, "")
            .trim()
    );
}

function loadPrototype(doenetML, coreType) {
    cy.window().then((win) => {
        win.postMessage(
            { doenetML, usePrototype: true, prototypeCoreType: coreType },
            "*",
        );
    });
}

describe("Prototype <m> rendering Tests", { tags: ["@group1"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        cy.on("uncaught:exception", (err) => {
            if (err.message.includes("MathJax")) {
                return false;
            }
        });
    });

    it("renders and updates `<m>$ti</m>` content with the javascript core", () => {
        loadPrototype(
            `<textInput name="ti" prefill="abc" />
<p>m: <m>$ti</m></p>`,
            "javascript",
        );

        // Initial render shows the prefill value (was empty before the fix).
        cy.get(inputSelector).should("have.value", "abc");
        cy.get(mSelector)
            .first()
            .invoke("text")
            .should((text) => {
                const normalized = normalizeMath(text);
                expect(normalized).to.contain("abc");
                // The pre-fix failure modes were an empty math or "[object Object]".
                expect(normalized.toLowerCase()).to.not.contain("object");
            });

        // `<m>$ti</m>` references the committed value, so it updates on blur.
        cy.get(inputSelector).type("{selectAll}xyz").blur();
        cy.get(mSelector)
            .first()
            .invoke("text")
            .should((text) => {
                expect(normalizeMath(text)).to.contain("xyz");
            });
    });
});
