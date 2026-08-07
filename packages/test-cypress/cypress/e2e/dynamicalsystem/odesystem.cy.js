import { getDiagnosticsByType } from "../../support/diagnostics";

describe("ODESystem Tag Tests", { tags: ["@group2"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // The ODE solver (`dopri`) comes from numeric.js, bundled inside
    // math-expressions. numeric builds most of its helpers at load time with the
    // `Function` constructor, and the generated bodies reference a bare
    // `numeric` — resolvable only if numeric registered itself on the global
    // object. It used to do that solely through Node's `global`, so a browser
    // and a web worker both got `ReferenceError: numeric is not defined` on the
    // first call, and an `<odeSystem>` document rendered as an error banner
    // instead of a document (math-expressions 2.0.0-alpha95 fixes it).
    //
    // A Vitest test cannot catch that: it runs under Node, where `global`
    // exists and numeric registers itself. Only a real browser reproduces it,
    // which is why this lives in Cypress. Both sides of the boundary have to be
    // exercised — the worker evaluates `$$f(1)`, and the main-thread renderer
    // samples the same solution to draw the curve.
    it("solves and plots in the browser", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <odeSystem name="ode" initialConditions="512" tolerance="0.01" displayDigits="6">
      <rightHandSide>0.0000006*x*(x-2000)(500-x)</rightHandSide>
    </odeSystem>
    <function name="f" extend="$ode.numericalSolution" />

    <p name="pVal">value at 1: $$f(1)</p>

    <graph name="g" xmin="-2" xmax="20" ymin="-300" ymax="3200">
      <function extend="$f" name="curve" />
    </graph>
    `,
                },
                "*",
            );
        });

        // Worker side: the solution evaluated at t = 1.
        cy.get("#pVal").should("have.text", "value at 1: 518.99");

        // Main-thread side: JSXGraph samples the solution to draw the curve, so
        // a plotted path proves the renderer reached numeric too. Axes and their
        // ticks are paths as well, hence the length floor — a curve spanning the
        // graph is far longer than any tick mark.
        cy.get(".jxgbox path").should(($paths) => {
            const longest = Math.max(
                ...$paths
                    .toArray()
                    .map((p) => (p.getAttribute("d") || "").length),
            );
            expect(
                longest,
                "length of the longest plotted path",
            ).to.be.greaterThan(5000);
        });

        cy.window().then((win) => {
            const { errors } = getDiagnosticsByType(win.returnDiagnostics1());
            expect(errors.length).eq(0);
        });
    });
});
