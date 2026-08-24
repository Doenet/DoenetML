import { normalizeMathTextForComparison } from "../../../src/util/mathDisplay";

// E2E proof that a document renders the same on a host's MathJax as on one
// Doenet loaded itself (public/host-mathjax-page.html). The host's engine is
// stock: no Doenet macros, no `units` package. Without priming, `\units` and
// `\var` reach MathJax's `noundefined` handler and typeset as the macro names
// themselves — the "works on doenet.org, breaks when embedded" divergence.
// The page also has the host typeset its own math through the same engine
// afterwards, so a regression that primed by breaking the host would fail here
// too rather than pass quietly.

describe(
    "standalone priming of a host-provided MathJax",
    { tags: ["@group1"], retries: 1 },
    () => {
        it("renders Doenet's macros and TeX packages on an engine the host configured", () => {
            cy.visit("/host-mathjax-page.html");

            // Guard the premise: everything below would also pass if Doenet had
            // ignored the host's engine and loaded its own configured copy, and
            // the test would then prove nothing about priming. Exactly one
            // MathJax is on the page and it is the host's.
            cy.get("script[data-doenet-mathjax]").should("not.exist");
            cy.get('script[src*="mathjax"]').should("have.length", 1);

            // Sanity: ordinary math renders, so we are reading a live engine
            // and not an empty page.
            cy.get("#plain").should((el) => {
                expect(normalizeMathTextForComparison(el.text())).eq("y2");
            });

            // From the `units` package, which the host's engine never loaded.
            cy.get("#units").should((el) => {
                expect(normalizeMathTextForComparison(el.text())).eq("9.8m/s2");
            });
            cy.get("#nicefrac").should((el) => {
                expect(normalizeMathTextForComparison(el.text())).eq("1/2");
            });

            // From Doenet's `macros`, which the host's engine never saw.
            // `\var{x}` is `\mathrm{x}`: upright "x", not the italic 𝑥 that an
            // unstyled x would render as, and not the literal "\varx" that an
            // unprimed engine produces.
            cy.get("#macro").should((el) => {
                expect(el.text()).eq("x");
            });

            // Priming writes to the host's engine; the host's own math must
            // still typeset through it.
            cy.window()
                .its("__hostMathJaxProbe.hostTypesetDone")
                .should("be.true");
            cy.get("#host-math").should((el) => {
                expect(normalizeMathTextForComparison(el.text())).eq("a2+b2");
            });
        });
    },
);
