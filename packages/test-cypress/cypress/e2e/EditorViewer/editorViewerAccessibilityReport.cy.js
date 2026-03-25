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
                "WCAG Violation!",
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

        it("displays accessibility report with WCAG AA Violations section", () => {
            postDoenetML(`
<styleDefinition styleNumber="102" textColor="#ff9900" />
<text name="p102" styleNumber="102">Low contrast text</text>
`);

            cy.get("#p102").should("contain.text", "Low contrast text");

            cy.get(".accessibility-status-button").click();

            cy.contains("h3", "WCAG AA Violations").should("exist");
            cy.contains("Style definition 102").should("exist");
            cy.contains("insufficient contrast").should("exist");
        });

        it("displays Other Accessibility Issues section when level 2 issues exist", () => {
            postDoenetML(`
<textInput name="ti"><shortDescription>have math <math>x^2</math></shortDescription></textInput>
`);

            cy.get("#ti").should("be.visible");

            cy.get(".accessibility-status-button").click();

            cy.contains("No WCAG AA violations").should("exist");
            cy.contains("h3", "Other Accessibility Issues").should("exist");
            cy.contains(
                "Short descriptions should not contain math components",
            ).should("exist");
        });

        it("shows toggle checkbox for accessibility diagnostics in editor", () => {
            postDoenetML(`
<styleDefinition styleNumber="104" textColor="#ff9900" />
<text name="p104" styleNumber="104">Contrast issue</text>
`);

            cy.get("#p104").should("contain.text", "Contrast issue");

            cy.get(".accessibility-status-button").click();

            cy.contains("Show accessibility diagnostics in editor").should(
                "exist",
            );
            cy.get(".accessibility-report input[type='checkbox']")
                .first()
                .should("exist");
        });

        it("displays accessibility diagnostics in editor when checkbox is checked", () => {
            postDoenetML(`
<styleDefinition styleNumber="105" textColor="#ff9900" />
<text name="p105" styleNumber="105">Contrast violation</text>
`);

            cy.get("#p105").should("contain.text", "Contrast violation");

            cy.get(".accessibility-status-button").click();

            cy.get(".accessibility-report input[type='checkbox']")
                .first()
                .then(($checkbox) => {
                    if (!$checkbox.prop("checked")) {
                        cy.wrap($checkbox).click();
                    }
                });

            cy.get(".cm-doenet-accessibility-diagnostic-level-1").should(
                "exist",
            );
        });

        it("hides accessibility diagnostics in editor when checkbox is unchecked", () => {
            postDoenetML(`
<styleDefinition styleNumber="106" textColor="#ff9900" />
<text name="p106" styleNumber="106">Contrast violation</text>
`);

            cy.get("#p106").should("contain.text", "Contrast violation");

            cy.get(".accessibility-status-button").click();

            cy.get(".accessibility-report input[type='checkbox']")
                .first()
                .then(($checkbox) => {
                    if (!$checkbox.prop("checked")) {
                        cy.wrap($checkbox).click();
                    }
                });

            cy.get(".cm-doenet-accessibility-diagnostic-level-1").should(
                "exist",
            );

            cy.get(".accessibility-report input[type='checkbox']")
                .first()
                .click();

            cy.get(".cm-doenet-accessibility-diagnostic-level-1").should(
                "not.exist",
            );
        });

        it("toggles accessibility diagnostics visibility multiple times", () => {
            postDoenetML(`
<styleDefinition styleNumber="107" textColor="#ff9900" />
<graph name="g107">
    <shortDescription>Graph</shortDescription>
    <text styleNumber="107" >Contrast issue</text>
</graph>
`);

            cy.get("#g107").should("be.visible");

            cy.get(".accessibility-status-button").click();

            const checkbox = () =>
                cy.get(".accessibility-report input[type='checkbox']").first();

            checkbox().then(($cb) => {
                if (!$cb.prop("checked")) {
                    checkbox().click();
                }
            });
            cy.get(".cm-doenet-accessibility-diagnostic-level-1").should(
                "exist",
            );

            checkbox().click();
            cy.get(".cm-doenet-accessibility-diagnostic-level-1").should(
                "not.exist",
            );

            checkbox().click();
            cy.get(".cm-doenet-accessibility-diagnostic-level-1").should(
                "exist",
            );
        });
    },
);
