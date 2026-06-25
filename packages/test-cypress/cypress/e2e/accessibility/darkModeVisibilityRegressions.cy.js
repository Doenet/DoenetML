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

        it("inline choiceInput control and dropdown menu are dark in dark mode", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `<choiceInput inline name="ci"><choice>alpha</choice><choice>beta</choice></choiceInput>`,
                        darkMode: "dark",
                    },
                    "*",
                );
            });
            cy.get('[data-theme="dark"]').should("exist");

            // The react-select control box should have a dark background, not
            // the hardcoded white it used to use. (#121212 sums to ~54.)
            cy.get('.doenet-viewer [class*="-control"]')
                .first()
                .should("exist")
                .then(($control) => {
                    const bg = getComputedStyle($control[0]).backgroundColor;
                    expect(
                        channelSum(bg),
                        `control background ${bg}`,
                    ).to.be.lessThan(150);
                })
                // Open the dropdown; its menu portals to <body>.
                .click();

            cy.get('[class*="-menu"]')
                .should("exist")
                .then(($menu) => {
                    const bg = getComputedStyle($menu[0]).backgroundColor;
                    const sum = channelSum(bg);
                    // The menu must be dark, but *elevated* above the #121212
                    // canvas (~54) so it doesn't disappear into the background.
                    expect(sum, `menu background ${bg}`).to.be.lessThan(300);
                    expect(sum, `menu background ${bg}`).to.be.greaterThan(70);
                });
        });

        it("subsetOfRealsInput open and closed points are distinct in dark mode", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `<subsetOfRealsInput name="sri" variable="t" prefill="0 <= t < 3" />`,
                        darkMode: "dark",
                    },
                    "*",
                );
            });
            cy.get('[data-theme="dark"]').should("exist");

            cy.get(".doenet-viewer svg circle")
                .should("have.length.at.least", 2)
                .then(($circles) => {
                    const circles = [...$circles];
                    const fills = circles.map((c) => getComputedStyle(c).fill);
                    // Closed (filled, interval color) and open (canvas-filled,
                    // hollow) endpoints must have different fills.
                    expect(
                        new Set(fills).size,
                        `circle fills ${fills.join(" | ")}`,
                    ).to.be.greaterThan(1);
                    // The endpoint ring is the interval color, not the white
                    // canvasText that made closed points read as hollow.
                    circles.forEach((c) => {
                        const stroke = getComputedStyle(c).stroke;
                        expect(
                            channelSum(stroke),
                            `circle stroke ${stroke}`,
                        ).to.be.lessThan(600);
                    });
                });
        });
    },
);
