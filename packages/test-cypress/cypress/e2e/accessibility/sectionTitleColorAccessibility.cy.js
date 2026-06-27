import { getDiagnosticsByType } from "../../support/diagnostics";

/**
 * Accessibility coverage for section heading-box background colors.
 *
 * Boxed and collapsible sections render a colored heading bar whose
 * background is set by `completedColor`, `inProgressColor`, and
 * `notStartedColor` (light mode) and their `*DarkMode` counterparts.
 * The heading text inherits `--canvasText` (black in light mode, white in
 * dark mode), so the background colors must have sufficient contrast against
 * those text colors.
 */
describe(
    "Section title-color accessibility checks",
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

        function postDoenetML({ doenetML, darkMode, settleSelector }) {
            waitForCypressHarness();
            cy.window().then((win) => {
                const message = darkMode
                    ? { doenetML, darkMode }
                    : { doenetML };
                win.postMessage(message, "*");
            });

            if (darkMode === "dark") {
                cy.get('[data-theme="dark"]').should("exist");
            }

            if (settleSelector) {
                cy.get(settleSelector).should("exist");
            }
        }

        function loadAwardedProblem({
            problemAttributes = "",
            awardCredit = 1,
            darkMode,
        }) {
            const awardCreditAttribute =
                awardCredit === 1 ? "" : ` credit="${awardCredit}"`;

            postDoenetML({
                darkMode,
                settleSelector: "#p",
                doenetML: `<problem name="p" boxed ${problemAttributes}>
  <title>A problem</title>
  <answer name="ans" inline>
    <award${awardCreditAttribute}><when>true</when></award>
  </answer>
</problem>`,
            });

            cy.get("#ans_button").should("contain.text", "Check Work");
        }

        function submitAnswerAndExpectHeadingColor(expectedColor) {
            cy.get("#ans_button").click();
            cy.get(".section-heading-p").should(
                "have.css",
                "background-color",
                expectedColor,
            );
        }

        function checkColorContrastViolations(assertionFn) {
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
                    assertionFn(violations);
                },
                true,
            );
        }

        function expectColorContrastA11yPass() {
            checkColorContrastViolations((violations) => {
                expect(violations.length).eq(0);
            });
        }

        function expectColorContrastA11yFail() {
            checkColorContrastViolations((violations) => {
                expect(violations.length).greaterThan(0);
                expect(violations.every((v) => v.id === "color-contrast")).eq(
                    true,
                );
            });
        }

        function expectHeadingColorDiagnostic({ colorName, modeSuffix = "" }) {
            cy.window().then((win) => {
                const diagnosticsByType = getDiagnosticsByType(
                    win.returnDiagnostics1(),
                );
                const a11yDiagnostics = diagnosticsByType.accessibility ?? [];
                const found = a11yDiagnostics.find(
                    (d) =>
                        d.level === 1 &&
                        d.message.includes(colorName) &&
                        d.message.includes(
                            "insufficient contrast for the section heading text",
                        ) &&
                        (modeSuffix === "" || d.message.includes(modeSuffix)),
                );
                expect(
                    found,
                    `Expected a level-1 accessibility diagnostic for ${colorName}${modeSuffix ? ` ${modeSuffix}` : ""} but found none`,
                ).not.eq(undefined);
            });
        }

        function expectNoLevel1AccessibilityIssues() {
            cy.window().then((win) => {
                const diagnosticsByType = getDiagnosticsByType(
                    win.returnDiagnostics1(),
                );
                const level1Issues = (
                    diagnosticsByType.accessibility ?? []
                ).filter((x) => x.level === 1);
                expect(level1Issues.length).eq(0);
            });
        }

        it("default boxed section colors pass axe in light mode", () => {
            postDoenetML({
                settleSelector: "#p",
                doenetML: `<section name="p" boxed>
  <title>A section</title>
  <p>Content.</p>
</section>`,
            });
            expectColorContrastA11yPass();
        });

        it("default collapsible section colors pass axe in light mode", () => {
            postDoenetML({
                settleSelector: "#a",
                doenetML: `<aside name="a" collapsible>
  <title>An aside</title>
  <p>Content.</p>
</aside>`,
            });
            expectColorContrastA11yPass();
        });

        it("default boxed section colors pass axe in dark mode", () => {
            postDoenetML({
                darkMode: "dark",
                settleSelector: "#p",
                doenetML: `<section name="p" boxed>
  <title>A section</title>
  <p>Content.</p>
</section>`,
            });
            cy.wait(200);
            expectColorContrastA11yPass();
        });

        it("default collapsible section colors pass axe in dark mode", () => {
            postDoenetML({
                darkMode: "dark",
                settleSelector: "#a",
                doenetML: `<aside name="a" collapsible>
  <title>An aside</title>
  <p>Content.</p>
</aside>`,
            });
            cy.wait(200);
            expectColorContrastA11yPass();
        });

        it("insufficient completedColor in light mode emits diagnostic and fails axe after completion", () => {
            // #666666 against black text is 3.66:1, which fails WCAG AA.
            loadAwardedProblem({
                problemAttributes: 'completedColor="#666666"',
            });

            expectHeadingColorDiagnostic({ colorName: "completedColor" });

            submitAnswerAndExpectHeadingColor("rgb(102, 102, 102)");
            expectColorContrastA11yFail();
        });

        it("insufficient notStartedColor in light mode emits diagnostic and fails axe", () => {
            // #444444 against black text is 2.16:1, which fails WCAG AA.
            postDoenetML({
                settleSelector: "#p",
                doenetML: `<section name="p" boxed notStartedColor="#444444">
  <title>A section</title>
  <p>Content.</p>
</section>`,
            });

            expectHeadingColorDiagnostic({ colorName: "notStartedColor" });
            cy.get(".section-heading-p").should(
                "have.css",
                "background-color",
                "rgb(68, 68, 68)",
            );
            expectColorContrastA11yFail();
        });

        it("sufficient custom notStartedColor in light mode passes axe and has no diagnostic", () => {
            // #d9d9d9 against black text is 14.88:1, well above WCAG AA.
            postDoenetML({
                settleSelector: "#p",
                doenetML: `<section name="p" boxed notStartedColor="#d9d9d9">
  <title>A section</title>
  <p>Content.</p>
</section>`,
            });

            expectNoLevel1AccessibilityIssues();
            expectColorContrastA11yPass();
        });

        it("insufficient inProgressColorDarkMode emits diagnostic and fails axe after partial credit", () => {
            // #8a8a8a against white text is 3.45:1, which fails WCAG AA.
            loadAwardedProblem({
                darkMode: "dark",
                awardCredit: 0.5,
                problemAttributes: 'inProgressColorDarkMode="#8a8a8a"',
            });

            expectHeadingColorDiagnostic({
                colorName: "inProgressColorDarkMode",
                modeSuffix: "(dark mode)",
            });

            submitAnswerAndExpectHeadingColor("rgb(138, 138, 138)");
            cy.wait(200);
            expectColorContrastA11yFail();
        });

        it("insufficient notStartedColorDarkMode emits diagnostic and fails axe", () => {
            // #a9a9a9 against white text is 2.35:1, which fails WCAG AA.
            postDoenetML({
                darkMode: "dark",
                settleSelector: "#p",
                doenetML: `<section name="p" boxed notStartedColorDarkMode="#a9a9a9">
  <title>A section</title>
  <p>Content.</p>
</section>`,
            });

            expectHeadingColorDiagnostic({
                colorName: "notStartedColorDarkMode",
                modeSuffix: "(dark mode)",
            });
            cy.get(".section-heading-p").should(
                "have.css",
                "background-color",
                "rgb(169, 169, 169)",
            );
            cy.wait(200);
            expectColorContrastA11yFail();
        });

        it("sufficient custom notStartedColorDarkMode passes axe and has no diagnostic", () => {
            // #1c1c1c against white text is 17.04:1, which passes WCAG AAA.
            postDoenetML({
                darkMode: "dark",
                settleSelector: "#p",
                doenetML: `<section name="p" boxed notStartedColorDarkMode="#1c1c1c">
  <title>A section</title>
  <p>Content.</p>
</section>`,
            });

            expectNoLevel1AccessibilityIssues();
            cy.get(".section-heading-p").should(
                "have.css",
                "background-color",
                "rgb(28, 28, 28)",
            );
            cy.wait(200);
            expectColorContrastA11yPass();
        });

        it("insufficient completedColorDarkMode emits diagnostic and fails axe after completion", () => {
            // #a6f19f against white text is 1.34:1, which fails WCAG AA.
            loadAwardedProblem({
                darkMode: "dark",
                problemAttributes: 'completedColorDarkMode="#a6f19f"',
            });

            expectHeadingColorDiagnostic({
                colorName: "completedColorDarkMode",
                modeSuffix: "(dark mode)",
            });

            submitAnswerAndExpectHeadingColor("rgb(166, 241, 159)");
            cy.wait(200);
            expectColorContrastA11yFail();
        });
    },
);
