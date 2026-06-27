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
 *
 * These tests verify:
 *  1. Default colors pass axe `color-contrast` in both light and dark mode.
 *  2. Author-supplied colors that fail contrast emit a level-1 accessibility
 *     diagnostic and are flagged by the axe scanner.
 *  3. Author-supplied colors that pass contrast emit no diagnostic and clear
 *     the axe scanner.
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

        function postDoenetML(doenetML) {
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
        }

        function postDoenetMLDarkMode(doenetML, settleSelector) {
            cy.window().then((win) => {
                win.postMessage({ doenetML, darkMode: "dark" }, "*");
            });
            cy.get('[data-theme="dark"]').should("exist");
            if (settleSelector) {
                cy.get(settleSelector).should("exist");
            }
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

        // ── Default color tests ────────────────────────────────────────────

        it("default boxed section colors pass axe in light mode", () => {
            postDoenetML(`<problem name="p" boxed>
  <title>A problem</title>
  <p>Content.</p>
</problem>`);
            cy.get("#p").should("exist");
            expectColorContrastA11yPass();
        });

        it("default collapsible section colors pass axe in light mode", () => {
            postDoenetML(`<aside name="a" collapsible>
  <title>An aside</title>
  <p>Content.</p>
</aside>`);
            cy.get("#a").should("exist");
            expectColorContrastA11yPass();
        });

        it("default boxed section colors pass axe in dark mode", () => {
            postDoenetMLDarkMode(
                `<problem name="p" boxed>
  <title>A problem</title>
  <p>Content.</p>
</problem>`,
                "#p",
            );
            // Let the theme settle.
            cy.wait(200);
            expectColorContrastA11yPass();
        });

        it("default collapsible section colors pass axe in dark mode", () => {
            postDoenetMLDarkMode(
                `<aside name="a" collapsible>
  <title>An aside</title>
  <p>Content.</p>
</aside>`,
                "#a",
            );
            cy.wait(200);
            expectColorContrastA11yPass();
        });

        // ── Author-supplied color diagnostic tests ─────────────────────────
        // Verify that bad custom colors both:
        //  a) trigger a worker-level level-1 accessibility diagnostic, and
        //  b) are caught by axe's color-contrast rule.

        it("insufficient completedColor in light mode emits diagnostic and fails axe", () => {
            // #ff9900 (orange) on white canvas: black text on orange ≈ 2.7:1
            // (fails 4.5:1). Use it as completedColor for a boxed section.
            // But we need credit to actually use completedColor, so use an
            // always-correct answer.
            postDoenetML(`<problem name="p" boxed completedColor="#ff9900">
  <title>A problem</title>
  <p>Content.</p>
</problem>`);
            cy.get("#p").should("exist");

            expectHeadingColorDiagnostic({ colorName: "completedColor" });
        });

        it("insufficient notStartedColor in light mode emits diagnostic and fails axe", () => {
            // Light yellow (#eeee00) on the light canvas: black text on
            // #eeee00 has contrast ≈ 1.06:1 — terrible.
            postDoenetML(`<problem name="p" boxed notStartedColor="#eeee00">
  <title>A problem</title>
  <p>Content.</p>
</problem>`);
            cy.get("#p").should("exist");

            expectHeadingColorDiagnostic({ colorName: "notStartedColor" });

            expectColorContrastA11yFail();
        });

        it("sufficient custom notStartedColor in light mode passes axe and has no diagnostic", () => {
            // Deep navy (#002244) on light mode: black text on #002244 is
            // 14.5:1 — well above AA. (White text on deep navy is also fine,
            // but the light mode canvas text is black.)
            postDoenetML(`<problem name="p" boxed notStartedColor="#002244">
  <title>A problem</title>
  <p>Content.</p>
</problem>`);
            cy.get("#p").should("exist");

            expectNoLevel1AccessibilityIssues();

            expectColorContrastA11yPass();
        });

        it("insufficient notStartedColorDarkMode emits diagnostic", () => {
            // Light gray in dark mode: white text on #a9a9a9 ≈ 2.3:1 — fails.
            postDoenetMLDarkMode(
                `<problem name="p" boxed notStartedColorDarkMode="#a9a9a9">
  <title>A problem</title>
  <p>Content.</p>
</problem>`,
                "#p",
            );

            expectHeadingColorDiagnostic({
                colorName: "notStartedColorDarkMode",
                modeSuffix: "(dark mode)",
            });

            cy.wait(200);
            expectColorContrastA11yFail();
        });

        it("sufficient custom notStartedColorDarkMode passes axe and has no diagnostic", () => {
            // #1c1c1c: white text contrast ≈ 16:1 — passes AA and AAA.
            postDoenetMLDarkMode(
                `<problem name="p" boxed notStartedColorDarkMode="#1c1c1c">
  <title>A problem</title>
  <p>Content.</p>
</problem>`,
                "#p",
            );

            expectNoLevel1AccessibilityIssues();

            cy.wait(200);
            expectColorContrastA11yPass();
        });

        it("insufficient completedColorDarkMode emits diagnostic", () => {
            // Light green (#a6f19f) in dark mode: white text ≈ 1.3:1 — fails.
            postDoenetMLDarkMode(
                `<problem name="p" boxed completedColorDarkMode="#a6f19f">
  <title>A problem</title>
  <p>Content.</p>
</problem>`,
                "#p",
            );

            expectHeadingColorDiagnostic({
                colorName: "completedColorDarkMode",
                modeSuffix: "(dark mode)",
            });
        });
    },
);
