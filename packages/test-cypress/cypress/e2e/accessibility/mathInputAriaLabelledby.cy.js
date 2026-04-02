/**
 * Regression tests for mathInput aria-labelledby accessibility fix.
 *
 * ISSUE: MathQuill creates a textarea and sets aria-labelledby to point to its own
 * auto-generated math speech description. When an explicit label (internal or external)
 * or shortDescription is provided, it was being applied to the outer wrapper span,
 * not the textarea. Since aria-labelledby on the focused element takes precedence,
 * the explicit labels were completely ignored.
 *
 * FIX: EditableMathField.jsx now combines explicit label IDs with MathQuill's
 * auto-generated math speech ID in the textarea's aria-labelledby attribute.
 * Result: Screen reader announces "label: math description" in the correct order.
 *
 * REQUIREMENTS:
 * - No duplicate IDs in aria-labelledby (deduplication must work)
 * - Correct order: explicit labels (internal, then external), then mathquill description
 * - Works with internal labels, external labels, and shortDescriptions
 */

describe("MathInput aria-labelledby regression tests", () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
        cy.injectAxe();
    });

    it("textarea aria-labelledby includes internal label without duplicates", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p name="p1">
            <mathInput name="mi1" prefill="x^2">
                <label>Enter expression:</label>
            </mathInput>
        </p>
    `,
                },
                "*",
            );
        });

        cy.get("#p1").should("be.visible");

        // Find the textarea within the mathInput
        cy.get("#mi1").within(() => {
            cy.get("textarea")
                .should("exist")
                .then(($textarea) => {
                    const ariaLabelledBy = $textarea.attr("aria-labelledby");

                    // The aria-labelledby should be set and contain multiple IDs
                    expect(ariaLabelledBy).to.exist;
                    const ids = ariaLabelledBy.split(" ");
                    expect(ids.length).to.be.greaterThan(1);

                    // Check for duplicates
                    const uniqueIds = new Set(ids);
                    expect(uniqueIds.size).to.equal(
                        ids.length,
                        "aria-labelledby should not contain duplicate IDs",
                    );

                    // First ID should be the internal label
                    expect(ids[0]).to.equal("mi1-input-label");

                    // Verify the first and last IDs correspond to actual elements
                    cy.document().then((doc) => {
                        const labelEl = doc.getElementById(ids[0]);
                        expect(labelEl).to.exist;
                        expect(labelEl.tagName.toLowerCase()).to.equal("label");

                        const mathspeakEl = doc.getElementById(
                            ids[ids.length - 1],
                        );
                        expect(mathspeakEl).to.exist;
                        expect(mathspeakEl.classList.contains("mq-mathspeak"))
                            .to.be.true;
                    });
                });
        });
    });

    it("textarea aria-labelledby includes external label without duplicates", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p name="p2a"><label for="$mi2">External label for math:</label></p>
        <p name="p2b"><mathInput name="mi2" prefill="y^3" /></p>
    `,
                },
                "*",
            );
        });

        cy.get("#p2b").should("be.visible");

        // Find the textarea within the mathInput
        cy.get("#mi2").within(() => {
            cy.get("textarea")
                .should("exist")
                .then(($textarea) => {
                    const ariaLabelledBy = $textarea.attr("aria-labelledby");

                    // Should have aria-labelledby set with multiple IDs
                    expect(ariaLabelledBy).to.exist;
                    const ids = ariaLabelledBy.split(" ");
                    expect(ids.length).to.be.greaterThan(1);

                    // Check for duplicates
                    const uniqueIds = new Set(ids);
                    expect(uniqueIds.size).to.equal(
                        ids.length,
                        "aria-labelledby should not contain duplicate IDs",
                    );

                    // Verify all IDs correspond to actual elements
                    ids.forEach((id) => {
                        cy.document().then((doc) => {
                            const element = doc.getElementById(id);
                            expect(element).to.exist;
                        });
                    });
                });
        });
    });

    it("textarea aria-labelledby includes shortDescription without duplicates", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p name="p3">
            <mathInput name="mi3" prefill="a+b">
                <shortDescription>Sum of two variables</shortDescription>
            </mathInput>
        </p>
    `,
                },
                "*",
            );
        });

        cy.get("#p3").should("be.visible");

        // Find the textarea within the mathInput
        cy.get("#mi3").within(() => {
            cy.get("textarea")
                .should("exist")
                .then(($textarea) => {
                    const ariaLabelledBy = $textarea.attr("aria-labelledby");

                    // Should have aria-labelledby set
                    expect(ariaLabelledBy).to.exist;
                    const ids = ariaLabelledBy.split(" ");
                    expect(ids.length).to.be.greaterThan(1);

                    // Check for NO duplicates
                    const uniqueIds = new Set(ids);
                    expect(uniqueIds.size).to.equal(
                        ids.length,
                        "aria-labelledby should not contain duplicate IDs",
                    );

                    // First ID should be the shortDescription span
                    cy.document().then((doc) => {
                        const shortDescSpan = doc.getElementById(ids[0]);
                        expect(shortDescSpan).to.exist;
                        expect(shortDescSpan.textContent).to.include(
                            "Sum of two variables",
                        );

                        // Should be hidden visually while remaining available to aria-labelledby.
                        expect(
                            shortDescSpan.classList.contains("visually-hidden"),
                        ).to.eq(true);

                        const autWindow =
                            shortDescSpan.ownerDocument.defaultView;
                        expect(autWindow).to.exist;
                        const computedStyle =
                            autWindow.getComputedStyle(shortDescSpan);
                        expect(computedStyle.position).to.equal("absolute");
                        expect(computedStyle.width).to.equal("1px");
                        expect(computedStyle.height).to.equal("1px");
                    });
                });
        });
    });

    it("mathInput passes accessibility checks with combined aria-labelledby", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p name="p4a"><mathInput name="a1"><label>Internal label:</label></mathInput></p>
        <p name="p4b"><label for="$a2">External label:</label></p>
        <p name="p4c"><mathInput name="a2" /></p>
        <p name="p4d"><mathInput name="a3"><shortDescription>Implicit label via description</shortDescription></mathInput></p>
    `,
                },
                "*",
            );
        });

        cy.get("#p4d").should("be.visible");

        // Run automated accessibility checks to ensure no violations
        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    // TODO: if remove the label by toggling it off,
    // it still shows up in the aria-labelledby.
    // This is because we are not checking for isInactiveCompositeReplacement
    // If we address that issue, we should change this test to toggle the label off
    it("textarea aria-labelledby updates when external label appears dynamically", () => {
        let dynamicLabelId;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p><booleanInput name="showLabel"><label>Show label</label></booleanInput></p>
        <conditionalContent condition="$showLabel">
          <label name="dynamicExternalLabel" for="$miDynamic">Dynamic external label</label>
        </conditionalContent>
        <p><mathInput name="miDynamic" prefill="x" /></p>
    `,
                },
                "*",
            );
        });

        cy.get("#miDynamic").should("be.visible");

        cy.get("#miDynamic textarea")
            .invoke("attr", "aria-labelledby")
            .should("be.a", "string");

        // Toggle label on.
        cy.contains("label", "Show label").click();

        cy.contains("label", "Dynamic external label")
            .should("be.visible")
            .invoke("attr", "id")
            .then((id) => {
                dynamicLabelId = id;
                expect(dynamicLabelId).to.be.a("string").and.not.be.empty;
            });

        cy.get("#miDynamic textarea")
            .invoke("attr", "aria-labelledby")
            .should((ariaLabelledByAfterShow) => {
                expect(ariaLabelledByAfterShow).to.include(dynamicLabelId);
            });
    });
});
