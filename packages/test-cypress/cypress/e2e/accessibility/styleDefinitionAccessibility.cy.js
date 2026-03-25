describe("Style definition accessibility checks", { tags: ["@group5"] }, () => {
    // These tests intentionally target WCAG AA contrast behavior.
    // We enforce this by running axe's `color-contrast` rule only.
    // (AAA enhanced-contrast checks are out of scope for this spec.)

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

    function checkColorContrastViolations(assertionFn) {
        cy.checkA11y(
            [".doenet-viewer"],
            {
                runOnly: {
                    type: "rule",
                    values: ["color-contrast"],
                },
                includedImpacts: ["critical", "serious", "moderate", "minor"],
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
            expect(violations.every((v) => v.id === "color-contrast")).eq(true);
        });
    }

    function expectContrastAccessibilityLevel1ForStyle({
        styleNumber,
        messagePart,
    }) {
        cy.window().then((win) => {
            const diagnosticsByType = getDiagnosticsByType(
                win.returnDiagnostics1(),
            );
            const styleViolation = diagnosticsByType.accessibility.find(
                (x) =>
                    x.level === 1 &&
                    x.message.includes(`Style definition ${styleNumber}`) &&
                    x.message.includes("insufficient contrast") &&
                    x.message.includes(messagePart),
            );

            expect(styleViolation).not.eq(undefined);
        });
    }

    function expectNoLevel1AccessibilityIssues() {
        cy.window().then((win) => {
            const diagnosticsByType = getDiagnosticsByType(
                win.returnDiagnostics1(),
            );
            const level1Issues = diagnosticsByType.accessibility.filter(
                (x) => x.level === 1,
            );
            expect(level1Issues.length).eq(0);
        });
    }

    it("passes accessibility checks for sufficient text contrast", () => {
        postDoenetML(`
<styleDefinition styleNumber="31" textColor="#111111" />
<p name="p1" styleNumber="31">Readable contrast text</p>
`);

        cy.get("#p1").should("contain.text", "Readable contrast text");

        expectNoLevel1AccessibilityIssues();

        expectColorContrastA11yPass();
    });

    it("fails accessibility checks for insufficient text contrast", () => {
        postDoenetML(`
<styleDefinition styleNumber="32" textColor="#ff9900" />
<p name="p2" styleNumber="32">Low contrast text</p>
`);

        cy.get("#p2").should("contain.text", "Low contrast text");

        expectContrastAccessibilityLevel1ForStyle({
            styleNumber: 32,
            messagePart: "text color against the canvas",
        });

        expectColorContrastA11yFail();
    });

    it("renders graph styles with sufficient contrast without level 1 accessibility issues", () => {
        postDoenetML(`
<styleDefinition styleNumber="33" lineColor="#111111" markerColor="#111111" lineOpacity="1" markerOpacity="1" />
<graph name="g1">
    <shortDescription>High contrast graph</shortDescription>
    <point styleNumber="33">(1,2)</point>
    <line styleNumber="33" through="(1,2) (3,4)" />
</graph>
`);

        cy.get("#g1").should("be.visible");

        expectNoLevel1AccessibilityIssues();

        expectColorContrastA11yPass();
    });

    it("reports a level 1 accessibility issue for insufficient graphical contrast", () => {
        postDoenetML(`
<styleDefinition styleNumber="34" lineColor="#000000" markerColor="#000000" lineOpacity="0.2" markerOpacity="0.2" />
<graph name="g2">
    <shortDescription>Low contrast graph</shortDescription>
    <point styleNumber="34">(1,2)</point>
    <line styleNumber="34" through="(1,2) (3,4)" />
</graph>
`);

        cy.get("#g2").should("be.visible");

        expectContrastAccessibilityLevel1ForStyle({
            styleNumber: 34,
            messagePart: "line color against the canvas",
        });

        expectColorContrastA11yFail();
    });

    it("text near 4.5:1 above threshold passes scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="35" textColor="#767676" />
<p name="tpass" styleNumber="35">Text should pass near 4.5:1</p>
`);

        cy.get("#tpass").should("contain.text", "Text should pass");

        expectNoLevel1AccessibilityIssues();

        expectColorContrastA11yPass();
    });

    it("text near 4.5:1 below threshold fails scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="36" textColor="#777777" />
<p name="tfail" styleNumber="36">Text should fail near 4.5:1</p>
`);

        cy.get("#tfail").should("contain.text", "Text should fail");

        expectContrastAccessibilityLevel1ForStyle({
            styleNumber: 36,
            messagePart: "text color against the canvas",
        });

        expectColorContrastA11yFail();
    });

    it("line near 3:1 above threshold passes scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="37" lineColor="#949494" lineOpacity="1" />
<graph name="gLineBoundary">
    <shortDescription>Line boundary contrast checks</shortDescription>
    <line styleNumber="37" through="(0,1) (2,1)" />
</graph>
`);

        cy.get("#gLineBoundary").should("be.visible");

        expectNoLevel1AccessibilityIssues();

        expectColorContrastA11yPass();
    });

    it("line near 3:1 below threshold fails scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="38" lineColor="#959595" lineOpacity="1" />
<graph name="gLineBoundaryFail">
    <shortDescription>Line boundary fail contrast check</shortDescription>
    <line styleNumber="38" through="(0,1) (2,1)" />
</graph>
`);

        cy.get("#gLineBoundaryFail").should("be.visible");

        expectContrastAccessibilityLevel1ForStyle({
            styleNumber: 38,
            messagePart: "line color against the canvas",
        });

        expectColorContrastA11yFail();
    });

    it("point near 3:1 above threshold passes scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="39" markerColor="#949494" markerOpacity="1" />
<graph name="gPointBoundary">
    <shortDescription>Point boundary contrast checks</shortDescription>
    <point styleNumber="39">(1,1)</point>
</graph>
`);

        cy.get("#gPointBoundary").should("be.visible");

        expectNoLevel1AccessibilityIssues();

        expectColorContrastA11yPass();
    });

    it("point near 3:1 below threshold fails scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="40" markerColor="#959595" markerOpacity="1" />
<graph name="gPointBoundaryFail">
    <shortDescription>Point boundary fail contrast check</shortDescription>
    <point styleNumber="40">(1,1)</point>
</graph>
`);

        cy.get("#gPointBoundaryFail").should("be.visible");

        expectContrastAccessibilityLevel1ForStyle({
            styleNumber: 40,
            messagePart: "marker color against the canvas",
        });

        expectColorContrastA11yFail();
    });

    it("line opacity near 3:1 above threshold passes scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="41" lineColor="#000000" lineOpacity="0.418" />
<graph name="gOpacityBoundary">
    <shortDescription>Line opacity boundary contrast checks</shortDescription>
    <line styleNumber="41" through="(0,1) (2,1)" />
</graph>
`);

        cy.get("#gOpacityBoundary").should("be.visible");

        expectNoLevel1AccessibilityIssues();

        expectColorContrastA11yPass();
    });

    it("line opacity near 3:1 below threshold fails scanner", () => {
        postDoenetML(`
<styleDefinition styleNumber="42" lineColor="#000000" lineOpacity="0.415" />
<graph name="gOpacityBoundaryFail">
    <shortDescription>Line opacity boundary fail contrast check</shortDescription>
    <line styleNumber="42" through="(0,1) (2,1)" />
</graph>
`);

        cy.get("#gOpacityBoundaryFail").should("be.visible");

        expectContrastAccessibilityLevel1ForStyle({
            styleNumber: 42,
            messagePart: "line color against the canvas",
        });

        expectColorContrastA11yFail();
    });
});
