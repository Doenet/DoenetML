describe(
    "EditorViewer WCAG Violations notification and accessibility report",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showEditor").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();
        });

        function postDoenetML(doenetML) {
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
        }

        function hoverAccessibilityDiagnostic(selector) {
            cy.get(selector)
                .should("exist")
                .then(($marker) => {
                    const rect = $marker[0].getBoundingClientRect();

                    cy.get(".cm-content")
                        .trigger("mousemove", {
                            clientX: rect.left + rect.width / 2,
                            clientY: rect.top + rect.height / 2,
                            force: true,
                        })
                        .wait(200);
                });
        }

        function postDiagnosticsFixture() {
            postDoenetML(`
            <styleDefinition styleNumber="200" textColor="#ff9900" />
            <text name="p200" styleNumber="200">Low contrast text</text>
            <sequence length="n" />
            <p><figure /></p>
            <bad />
            `);
        }

        it("displays WCAG Violation notification when contrast violations exist", () => {
            postDoenetML(`
<styleDefinition styleNumber="100" textColor="#ff9900" />
<text name="p100" styleNumber="100">Low contrast text</text>
`);

            cy.get("#p100").should("contain.text", "Low contrast text");

            cy.get(".accessibility-status-button.has-level-1-issues").should(
                "exist",
            );
            cy.get(".accessibility-status-button.has-level-1-issues").should(
                "contain.text",
                "WCAG",
            );
            cy.get(".accessibility-status-button")
                .invoke("attr", "title")
                .should(
                    "match",
                    /WCAG AA accessibility violation identified\. Click to open accessibility report\./,
                );
        });

        it("does not display WCAG Violation notification when no violations exist", () => {
            postDoenetML(`
<styleDefinition styleNumber="101" textColor="#111111" />
<text name="p101" styleNumber="101">Good contrast text</text>
`);

            cy.get("#p101").should("contain.text", "Good contrast text");

            cy.get(".accessibility-status-button.has-level-1-issues").should(
                "not.exist",
            );
            cy.get(".accessibility-status-button.no-level-1-issues").should(
                "exist",
            );
            cy.get(".accessibility-status-button")
                .invoke("attr", "title")
                .should(
                    "match",
                    /Click to open accessibility report\. No accessibility issues were found\./,
                );
        });

        it("isAccessibleCallback reports false when level 1 accessibility issues exist", () => {
            postDoenetML(`
<styleDefinition styleNumber="112" textColor="#ff9900" />
<text name="p112" styleNumber="112">Low contrast text</text>
`);

            cy.get("#p112").should("contain.text", "Low contrast text");

            cy.window().should((win) => {
                expect(win.returnIsAccessibleCallbackValue()).eq(false);
            });
        });

        it("isAccessibleCallback reports true when no level 1 accessibility issues exist", () => {
            postDoenetML(`
<styleDefinition styleNumber="113" textColor="#111111" />
<text name="p113" styleNumber="113">Good contrast text</text>
`);

            cy.get("#p113").should("contain.text", "Good contrast text");

            cy.window().should((win) => {
                expect(win.returnIsAccessibleCallbackValue()).eq(true);
            });
        });

        it("displays accessibility report with WCAG AA Violations section", () => {
            postDoenetML(`
<styleDefinition styleNumber="102" textColor="#ff9900" />
<text name="p102" styleNumber="102">Low contrast text</text>
`);

            cy.get("#p102").should("contain.text", "Low contrast text");

            cy.get(".accessibility-status-button").click();

            cy.contains("h3", /Accessibility violations\s*\(WCAG AA\)/i).should(
                "exist",
            );
            cy.contains("Style definition 102").should("exist");
            cy.contains("insufficient contrast").should("exist");
        });

        it("displays Other Accessibility Issues section when level 2 issues exist", () => {
            postDoenetML(`
<textInput name="ti"><shortDescription>have math <math>x^2</math></shortDescription></textInput>
`);

            cy.get("#ti").should("be.visible");

            cy.get(".accessibility-status-button").click();

            cy.contains("None found").should("exist");
            cy.contains("h3", "Other accessibility issues").should("exist");
            cy.contains(
                "Short descriptions should not contain math components",
            ).should("exist");
        });

        it("matches the tooltip heading color to level 1 accessibility diagnostics", () => {
            postDoenetML(`
<styleDefinition styleNumber="108" textColor="#ff9900" />
<text name="p108" styleNumber="108">Contrast violation</text>
`);

            cy.get("#p108").should("contain.text", "Contrast violation");
            cy.get(".accessibility-status-button").click();

            hoverAccessibilityDiagnostic(
                ".cm-doenet-accessibility-diagnostic-level-1",
            );

            cy.get(".cm-tooltip-lint .cm-lint-tooltip .heading")
                .should("contain.text", "WCAG AA Accessibility Violation")
                .should("have.css", "color", "rgb(180, 35, 24)");

            cy.get(
                ".cm-tooltip-lint .cm-diagnostic:has(.cm-lint-tooltip .heading.accessibility-level-1)",
            ).should("have.css", "border-left-color", "rgb(180, 35, 24)");
        });

        it("exposes accessible tab semantics and labels in diagnostics tab strip", () => {
            postDiagnosticsFixture();

            cy.get("#errors").click();

            cy.get(".diagnostics-response-tabs")
                .should("have.attr", "role", "tablist")
                .and("have.class", "is-open");

            cy.get("#errors")
                .should("have.attr", "role", "tab")
                .invoke("attr", "aria-label")
                .should("match", /^Errors: \d+$/);
            cy.get("#warnings")
                .should("have.attr", "role", "tab")
                .invoke("attr", "aria-label")
                .should("match", /^Warnings: \d+$/);
            cy.get("#info")
                .should("have.attr", "role", "tab")
                .invoke("attr", "aria-label")
                .should("match", /^Info: \d+$/);
            cy.get("#accessibility")
                .should("have.attr", "role", "tab")
                .invoke("attr", "aria-label")
                .should("match", /^Accessibility: \d+$/);

            cy.get(
                ".diagnostics-response-tabs [role='tab'][aria-selected='true']",
            ).should("have.length", 1);
            cy.get("#errors")
                .click()
                .should("have.attr", "aria-selected", "true");
            cy.get("#warnings")
                .click()
                .should("have.attr", "aria-selected", "true");
            cy.get("#errors").should("have.attr", "aria-selected", "false");
        });

        it("supports keyboard navigation and keyboard close for diagnostics tab strip", () => {
            postDiagnosticsFixture();

            cy.get("#errors").focus();
            cy.focused().should("have.attr", "id", "errors");

            cy.focused().type("{rightarrow}");
            cy.focused().should("have.attr", "id", "warnings");
            cy.focused().type("{enter}");
            cy.get("#warnings").should("have.attr", "aria-selected", "true");
            cy.contains("Warning").should("exist");

            cy.get(".close-button").should("exist").focus();
            cy.focused().type("{enter}");

            cy.get(".diagnostics-response-tabs").should(
                "not.have.class",
                "is-open",
            );
            cy.get(".diagnostics-response-tabs-panels").should("not.exist");
        });

        it("passes full axe scan on diagnostics tab strip", () => {
            postDiagnosticsFixture();

            cy.injectAxe();
            cy.get(".diagnostics-response-tabs").should("be.visible");
            cy.checkA11y(".diagnostics-response-tabs", {
                includedImpacts: ["critical", "serious", "moderate", "minor"],
            });
        });

        it("displays error message with proper contrast for code formatting in backticks", () => {
            postDoenetML(`<bad />`);

            // Open the errors tab by finding the tab with id="errors"
            cy.get("#errors").should("exist").click();

            // Verify error message appears in the diagnostic list with backtick formatting
            cy.contains("Invalid component type:")
                .should("exist")
                .invoke("parent")
                .then(($messageSpan) => {
                    // Check that the code element exists within the message
                    cy.wrap($messageSpan)
                        .find("code")
                        .should("contain.text", "<bad>");
                });

            // Find and hover over the error diagnostic in the editor (find any cm-lintRange)
            cy.get(".cm-lintRange")
                .should("exist")
                .first()
                .then(($marker) => {
                    const rect = $marker[0].getBoundingClientRect();

                    cy.get(".cm-content")
                        .trigger("mousemove", {
                            clientX: rect.left + rect.width / 2,
                            clientY: rect.top + rect.height / 2,
                            force: true,
                        })
                        .wait(200);
                });

            // Verify tooltip is visible with the error message
            // Note: There may be multiple diagnostics (LSP warning + Doenet error),
            // so we check that at least one contains the error with backtick formatting
            cy.get(".cm-tooltip-lint .cm-lint-body").should("exist");

            cy.get(".cm-tooltip-lint")
                .should("contain.text", "Invalid component type:")
                .find("code")
                .should("exist")
                .should("contain.text", "<bad>");

            // Run accessibility checks on the diagnostic list and tooltip
            // Focus on color-contrast rule to ensure code formatting meets WCAG AA
            cy.injectAxe();
            cy.get(".diagnostics-response-tabs-container").should("be.visible");
            cy.checkA11y(".diagnostics-response-tabs-container", {
                runOnly: {
                    type: "rule",
                    values: ["color-contrast"],
                },
                includedImpacts: ["critical", "serious", "moderate", "minor"],
            });
            cy.get(".cm-tooltip-lint").should("be.visible");
            cy.checkA11y(".cm-tooltip-lint", {
                runOnly: {
                    type: "rule",
                    values: ["color-contrast"],
                },
                includedImpacts: ["critical", "serious", "moderate", "minor"],
            });
        });

        it("displays warning tooltip for figure inside paragraph and passes accessibility scan", () => {
            postDoenetML(`<p><figure /></p>`);

            // Open warnings panel to show warning list entry
            cy.get("#warnings").should("exist").click();
            cy.contains("Warning").should("exist");

            // Hover warning marker for <figure> and verify warning tooltip heading
            hoverAccessibilityDiagnostic(".cm-lintRange-warning");
            cy.get(".cm-tooltip-lint .cm-lint-tooltip .heading")
                .should("exist")
                .should("contain.text", "Warning");

            // Run accessibility scanner on warning panel and tooltip
            cy.injectAxe();
            cy.get(".diagnostics-response-tabs-container").should("be.visible");
            cy.checkA11y(".diagnostics-response-tabs-container", {
                runOnly: {
                    type: "rule",
                    values: ["color-contrast"],
                },
                includedImpacts: ["critical", "serious", "moderate", "minor"],
            });
            cy.get(".cm-tooltip-lint").should("be.visible");
            cy.checkA11y(".cm-tooltip-lint", {
                runOnly: {
                    type: "rule",
                    values: ["color-contrast"],
                },
                includedImpacts: ["critical", "serious", "moderate", "minor"],
            });
        });

        it("renders diagnostic markdown safely without HTML injection or javascript links", () => {
            postDoenetML(`
<updateValue target="[click](javascript:alert(1)) <img src=x onerror=alert(1)>" newValue="1" />
`);

            cy.get("#warnings").should("exist").click();
            cy.contains("Invalid value").should("exist");

            cy.get(".diagnostics-response-tabs-container img").should(
                "not.exist",
            );
            cy.get(
                '.diagnostics-response-tabs-container a[href^="javascript:"]',
            ).should("not.exist");

            cy.get("body").then(($body) => {
                if ($body.find(".cm-lintRange-warning:visible").length > 0) {
                    hoverAccessibilityDiagnostic(
                        ".cm-lintRange-warning:visible",
                    );
                    cy.get("body").then(($bodyAfterHover) => {
                        if (
                            $bodyAfterHover.find(
                                ".cm-tooltip-lint .cm-lint-body",
                            ).length > 0
                        ) {
                            cy.get(".cm-tooltip-lint img").should("not.exist");
                            cy.get(
                                '.cm-tooltip-lint a[href^="javascript:"]',
                            ).should("not.exist");
                        }
                    });
                }
            });
        });
    },
);
