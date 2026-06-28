/**
 * Dark-mode accessibility coverage for renderers.
 *
 * Each case loads a small DoenetML document exercising one renderer category,
 * switches the harness into dark mode, and runs axe's `color-contrast` rule
 * against the rendered viewer. The grouped, iterating structure keeps every
 * renderer category under WCAG AA contrast enforcement in dark mode without a
 * separate spec file per renderer.
 *
 * Note: axe's `color-contrast` rule evaluates DOM/HTML text. Pure SVG/canvas
 * graphics (JSXGraph interiors) are covered for their HTML labels here; their
 * stroke visibility is driven by the `--canvasText` custom property, which the
 * `data-theme="dark"` switch (set by the viewer) now resolves correctly.
 */
describe(
    "Dark-mode renderer accessibility checks",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            cy.injectAxe();
        });

        function waitForCypressHarness() {
            cy.get("#testRunner_toggleControls").should("exist");
        }

        function loadInDarkMode(doenetML, settleSelector) {
            waitForCypressHarness();
            cy.window().then((win) => {
                win.postMessage({ doenetML, darkMode: "dark" }, "*");
            });
            cy.get('[data-theme="dark"]').should("exist");
            if (settleSelector) {
                cy.get(settleSelector).should("exist");
            }
            // Let JSXGraph / MathJax settle.
            cy.wait(200);
        }

        function expectNoColorContrastViolations() {
            cy.checkA11y(
                [".doenet-viewer"],
                {
                    runOnly: { type: "rule", values: ["color-contrast"] },
                    includedImpacts: [
                        "critical",
                        "serious",
                        "moderate",
                        "minor",
                    ],
                },
                (violations) => {
                    expect(
                        violations,
                        JSON.stringify(
                            violations.map((v) => ({
                                id: v.id,
                                nodes: v.nodes.map((n) => n.html),
                            })),
                            null,
                            2,
                        ),
                    ).to.have.length(0);
                },
                true,
            );
        }

        const cases = [
            {
                name: "inline text, number, boolean, math",
                doenetML: `
<p name="p">Text <number>3.14</number>, <boolean>true</boolean>,
<math>x^2+y^2</math>, <m>\\frac{1}{2}</m>, <em>emphasis</em>,
<q>quote</q>, <c>code</c>.</p>`,
                settle: "#p",
            },
            {
                name: "block & layout: section, list, blockquote, figure",
                doenetML: `
<section name="sec"><title>Heading</title>
<p>Paragraph in a section.</p>
<ol><li>First</li><li>Second</li></ol>
<ul><li>Bullet</li></ul>
<blockQuote>Quoted block.</blockQuote>
</section>`,
                settle: "#sec",
            },
            {
                name: "boxed section — not started (default dark-mode heading color)",
                doenetML: `
<section name="prob" boxed>
  <title>A boxed section</title>
  <p>Some content.</p>
</section>`,
                settle: "#prob",
            },
            {
                name: "collapsible section — not started (default dark-mode heading color)",
                doenetML: `
<aside name="as" collapsible>
  <title>Collapsible aside</title>
  <p>Some content.</p>
</aside>`,
                settle: "#as",
            },
            {
                name: "tabular / table",
                doenetML: `
<tabular name="t">
<row><cell>a</cell><cell>b</cell></row>
<row><cell>1</cell><cell>2</cell></row>
</tabular>`,
                settle: "#t",
            },
            {
                name: "text & math inputs",
                doenetML: `
<p>Text: <textInput name="ti" prefill="hello" /></p>
<p>Math: <mathInput name="mi" prefill="x+1" /></p>`,
                settle: "#ti",
            },
            {
                name: "boolean & choice inputs",
                doenetML: `
<p>Bool: <booleanInput name="bi" /></p>
<choiceInput name="ci">
  <choice>alpha</choice><choice>beta</choice>
</choiceInput>`,
                settle: "#bi",
            },
            {
                name: "slider",
                doenetML: `<slider name="s" from="0" to="10" /><text>after</text>`,
                settle: "#s",
            },
            {
                name: "graph with point, line, circle, polygon, label",
                doenetML: `
<graph name="g">
  <point>(1,2)</point>
  <line through="(0,0) (3,1)" />
  <circle center="(0,0)" radius="2" />
  <polygon vertices="(-3,-3) (-1,-3) (-2,-1)" />
  <label anchor="(2,2)">A label</label>
</graph>`,
                settle: "#g",
            },
            {
                name: "graph with vector, ray, curve, function, angle",
                doenetML: `
<graph name="g2">
  <vector head="(2,3)" tail="(0,0)" />
  <ray endpoint="(0,0)" through="(2,1)" />
  <curve through="(-3,0) (0,2) (3,0)" />
  <function>sin(x)</function>
  <angle radius="1" through="(1,0) (0,0) (0,1)" />
</graph>`,
                settle: "#g2",
            },
            {
                name: "answer with feedback",
                doenetML: `
<problem name="prob"><title>Q</title>
<p>Enter 2: <answer name="ans">2</answer></p>
<feedback condition="true"><p>Some feedback.</p></feedback>
</problem>`,
                settle: "#prob",
            },
            {
                name: "hint and solution",
                doenetML: `
<hint name="h"><title>Hint</title><p>A hint.</p></hint>
<solution name="sol"><p>The solution.</p></solution>`,
                settle: "#h",
            },
            {
                name: "footnote and preformatted text",
                doenetML: `
<p name="fp">A claim<footnote>supporting note</footnote> here.</p>
<pre>preformatted code block</pre>`,
                settle: "#fp",
            },
            {
                name: "graph with curve and function",
                doenetML: `
<graph name="gc">
  <curve through="(-3,2) (0,-2) (3,2)" />
  <function>x^2-3</function>
</graph>`,
                settle: "#gc",
            },
            {
                name: "displayed math with fractions and roots",
                doenetML: `
<p name="dm"><math>(a+b)/(c+d) + sqrt(x^2+y^2)</math></p>
<me name="dme">\\frac{1}{2} + \\sqrt{3}</me>`,
                settle: "#dm",
            },
            {
                name: "orbital diagram",
                doenetML: `
<orbitalDiagram name="od" labels="2s 2p">(u,d) (u, u, u)</orbitalDiagram>`,
                settle: "#od",
            },
            {
                name: "image, list, and reference text",
                doenetML: `
<ul name="ul"><li>alpha</li><li>beta</li></ul>
<p>An <em>emphasized</em> and <alert>alert</alert> phrase.</p>`,
                settle: "#ul",
            },
            {
                name: "subsetOfRealsInput number line",
                doenetML: `
<subsetOfRealsInput name="sri" variable="t" prefill="t > 0" />`,
                settle: "#sri",
            },
            {
                name: "matrix and fraction inputs",
                doenetML: `
<p><matrixInput name="m" numRows="2" numColumns="2" /></p>
<p><fractionInput name="f" /></p>`,
                settle: "#m",
            },
        ];

        for (const testCase of cases) {
            it(`dark mode: ${testCase.name}`, () => {
                loadInDarkMode(testCase.doenetML, testCase.settle);
                expectNoColorContrastViolations();
            });
        }
    },
);

describe(
    "Virtual keyboard dark-mode appearance and accessibility",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            cy.injectAxe();
        });

        function waitForCypressHarness() {
            cy.get("#testRunner_toggleControls").should("exist");
        }

        function loadWithMathInput(darkMode) {
            waitForCypressHarness();
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `<p><mathInput name="mi" /></p>`,
                        darkMode,
                    },
                    "*",
                );
            });
            cy.get("#mi").should("exist");
        }

        function openKeyboardTray() {
            // The open-keyboard-button peeks above the tray.
            cy.get(".open-keyboard-button").click();
            cy.get("#virtual-keyboard-tray.open").should("exist");
        }

        it("tray uses white background in light mode (regression)", () => {
            loadWithMathInput("light");
            openKeyboardTray();
            cy.get("#virtual-keyboard-tray").should(
                "have.css",
                "background-color",
                "rgb(255, 255, 255)",
            );
        });

        it("tray uses dark background in dark mode", () => {
            loadWithMathInput("dark");
            openKeyboardTray();
            cy.get("#virtual-keyboard-tray").should(
                "have.css",
                "background-color",
                "rgb(30, 30, 30)",
            );
        });

        it("tray updates when dark mode changes after mount", () => {
            loadWithMathInput("light");
            openKeyboardTray();
            cy.get("#virtual-keyboard-tray").should(
                "have.css",
                "background-color",
                "rgb(255, 255, 255)",
            );

            cy.window().then((win) => {
                win.postMessage({ darkMode: "dark" }, "*");
            });

            cy.get("#virtual-keyboard-tray").should(
                "have.css",
                "background-color",
                "rgb(30, 30, 30)",
            );
        });

        it("key faces use dark background in dark mode", () => {
            loadWithMathInput("dark");
            openKeyboardTray();
            // Key buttons don't carry the keyboard-button class in HTML — it
            // comes from @apply in CSS. Use .keyboard-region button to target
            // regular (non-special) keys in the grid area.
            cy.get("#virtual-keyboard-tray .keyboard-region button")
                .first()
                .should("have.css", "background-color", "rgb(45, 45, 45)");
        });

        it("key text is white in dark mode", () => {
            loadWithMathInput("dark");
            openKeyboardTray();
            cy.get("#virtual-keyboard-tray .keyboard-region button")
                .first()
                .should("have.css", "color", "rgb(255, 255, 255)");
        });

        it("virtual keyboard passes axe color-contrast in dark mode", () => {
            loadWithMathInput("dark");
            openKeyboardTray();
            // Let MathJax finish rendering math key labels.
            cy.wait(300);
            cy.checkA11y(
                ["#virtual-keyboard-tray"],
                {
                    runOnly: { type: "rule", values: ["color-contrast"] },
                    includedImpacts: ["critical", "serious", "moderate"],
                },
                (violations) => {
                    expect(
                        violations,
                        violations
                            .map(
                                (v) =>
                                    `${v.id}: ${v.nodes.map((n) => n.html).join(", ")}`,
                            )
                            .join("\n"),
                    ).to.have.length(0);
                },
            );
        });
    },
);
