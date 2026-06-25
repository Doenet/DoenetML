/**
 * Regression coverage for specific dark-mode visibility bugs:
 *  - #397: mathInput insertion point (caret) was rendered black/invisible.
 *  - #396: graph keyboard-focus outline was invisible.
 *
 * Both are now driven by `var(--canvasText)` (the caret via `currentColor`,
 * the focus outline via an explicit rule), which resolves to white once the
 * viewer sets `data-theme="dark"`.
 */
describe(
    "Dark-mode visibility regressions (#396, #397)",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        function channelSum(cssColor) {
            const m = cssColor.match(/rgba?\(([^)]+)\)/);
            if (!m) return null;
            const [r, g, b] = m[1].split(",").map((x) => parseFloat(x));
            return r + g + b;
        }

        it("#397: mathInput caret is light (visible) in dark mode", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `<p><mathInput name="mi" /></p>`,
                        darkMode: "dark",
                    },
                    "*",
                );
            });
            cy.get('[data-theme="dark"]').should("exist");

            // Focus the field and type so a blinking cursor element exists.
            cy.get("#mi").click().type("x");

            cy.get("#mi .mq-cursor")
                .should("exist")
                .then(($cursor) => {
                    const color = getComputedStyle($cursor[0]).borderLeftColor;
                    const sum = channelSum(color);
                    expect(
                        sum,
                        `caret border color ${color}`,
                    ).to.be.greaterThan(600);
                });
        });

        it("#396: graph keyboard-focus outline is light (visible) in dark mode", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `<graph name="g"><point name="P">(1,2)</point></graph>`,
                        darkMode: "dark",
                    },
                    "*",
                );
            });
            cy.get('[data-theme="dark"]').should("exist");
            cy.get(".jxgbox").should("exist");

            // The focus-outline rule is theme-aware; verify the resolved
            // --canvasText (used as the outline color) is white in dark mode.
            cy.get(".jxgbox").then(($box) => {
                const canvasText = getComputedStyle($box[0])
                    .getPropertyValue("--canvasText")
                    .trim();
                expect(["white", "rgb(255, 255, 255)", "#ffffff"]).to.include(
                    canvasText.toLowerCase(),
                );
            });

            // And that a focusable graph object receives the explicit outline
            // rule (non-zero, theme-colored) rather than no outline.
            cy.get(".jxgbox [tabindex]")
                .first()
                .then(($el) => {
                    $el[0].focus();
                    const style = getComputedStyle($el[0]);
                    const sum = channelSum(style.outlineColor);
                    expect(
                        sum,
                        `focus outline color ${style.outlineColor}`,
                    ).to.be.greaterThan(600);
                });
        });

        it("math-notation fraction bar is light (visible) in dark mode", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `<p><mathInput name="mi" prefill="1/2" /></p>`,
                        darkMode: "dark",
                    },
                    "*",
                );
            });
            cy.get('[data-theme="dark"]').should("exist");

            // The fraction bar is the denominator's top border in mathquill;
            // it must inherit currentColor (= --canvasText = white) in dark mode.
            cy.get("#mi .mq-fraction .mq-denominator")
                .should("exist")
                .then(($den) => {
                    const color = getComputedStyle($den[0]).borderTopColor;
                    const sum = channelSum(color);
                    expect(
                        sum,
                        `fraction bar color ${color}`,
                    ).to.be.greaterThan(600);
                });
        });
    },
);
