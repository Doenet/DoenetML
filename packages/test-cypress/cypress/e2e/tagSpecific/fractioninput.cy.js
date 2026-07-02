describe("FractionInput Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("type into numerator and denominator", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <fractionInput name="frac">
            <label>Enter a fraction</label>
        </fractionInput>

        <p name="pNum">numerator: $frac.numerator</p>
        <p name="pDen">denominator: $frac.denominator</p>
        <p name="pVal">value: $frac.value</p>
        `,
                },
                "*",
            );
        });

        cy.get("#frac textarea").eq(0).type("2{enter}", { force: true });
        cy.get("#frac textarea").eq(1).type("3{enter}", { force: true });

        cy.get("#pNum").should("have.text", "numerator: 2");
        cy.get("#pDen").should("have.text", "denominator: 3");
        cy.get("#pVal").should("contain.text", "2");
    });

    it("prefill numerator and denominator", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <fractionInput name="frac" prefillNumerator="5" prefillDenominator="7">
            <label>Edit the fraction</label>
        </fractionInput>

        <p name="pNum">numerator: $frac.numerator</p>
        <p name="pDen">denominator: $frac.denominator</p>
        `,
                },
                "*",
            );
        });

        cy.get("#pNum").should("have.text", "numerator: 5");
        cy.get("#pDen").should("have.text", "denominator: 7");
    });

    it("fraction input in answer shows correctness styling and accessibility text", () => {
        cy.window().then(async (win) => {
            const correctColor = getCSSVariableAsRGB(win, "--mainGreen");
            const partialColor = getCSSVariableAsRGB(win, "--mainOrange");
            const incorrectColor = getCSSVariableAsRGB(win, "--mainRed");

            win.postMessage(
                {
                    doenetML: `
        <answer name="ans">
            <label>Simplify two tenths</label>
            <fractionInput name="frac" />
            <award><when><math>$frac</math> = <math>1/5</math></when></award>
            <award credit="0.5"><when><math>$frac</math> = <math>2/5</math></when></award>
        </answer>
        `,
                },
                "*",
            );

            function checkFractionPartLabelText(partIndex, expectedText) {
                cy.get("#frac textarea")
                    .eq(partIndex)
                    .should("have.attr", "aria-labelledby")
                    .then((ariaLabelledBy) => {
                        const labelIds = ariaLabelledBy.split(" ");
                        cy.document().then((doc) => {
                            const labelText = labelIds
                                .map(
                                    (labelId) =>
                                        doc.getElementById(labelId)
                                            ?.textContent ?? "",
                                )
                                .join(" ");
                            expect(labelText).include(expectedText);
                            expect(labelText).not.include("(Correct)");
                            expect(labelText).not.include(
                                "(Partially correct)",
                            );
                            expect(labelText).not.include("(Incorrect)");
                        });
                    });
            }

            function checkFractionDescription(expectedText) {
                cy.get("#frac table").then(($table) => {
                    const accessibleDescription =
                        $table.attr("aria-description") ??
                        $table.attr("aria-label");
                    expect(accessibleDescription).eq(expectedText);
                });
            }

            cy.get("#frac").should(
                "not.have.css",
                "outline-color",
                correctColor,
            );
            checkFractionPartLabelText(0, "numerator");
            checkFractionPartLabelText(1, "denominator");

            cy.get("#frac textarea").eq(0).type("1", { force: true });
            cy.get("#frac textarea").eq(1).type("5", { force: true });
            cy.get("#frac_button").should("contain.text", "Check Work").click();
            cy.get("#frac_button").should("contain.text", "Correct");
            cy.get("#frac").should("have.css", "outline-color", correctColor);
            checkFractionPartLabelText(0, "numerator");
            checkFractionPartLabelText(1, "denominator");
            checkFractionDescription("(Correct)");

            cy.get("#frac textarea")
                .eq(0)
                .type("{end}{backspace}2{enter}", { force: true });
            cy.get("#frac_button").click();
            cy.get("#frac_button").should("contain.text", "50% Correct");
            cy.get("#frac").should("have.css", "outline-color", partialColor);
            checkFractionPartLabelText(0, "numerator");
            checkFractionPartLabelText(1, "denominator");
            checkFractionDescription("(Partially correct)");

            cy.get("#frac textarea")
                .eq(1)
                .type("{end}{backspace}7{enter}", { force: true });
            cy.get("#frac_button").click();
            cy.get("#frac_button").should("contain.text", "Incorrect");
            cy.get("#frac").should("have.css", "outline-color", incorrectColor);
            checkFractionPartLabelText(0, "numerator");
            checkFractionPartLabelText(1, "denominator");
            checkFractionDescription("(Incorrect)");
        });
    });

    function getCSSVariableAsRGB(win, varName) {
        const el = win.document.createElement("div");
        el.style.color = `var(${varName})`;
        win.document.body.appendChild(el);
        const rgbValue = win.getComputedStyle(el).color;
        el.remove();
        return rgbValue;
    }

    it("bindValueTo a math input, two-way", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <mathInput name="mi" prefill="2/3"><label>src</label></mathInput>
        <fractionInput name="frac" bindValueTo="$mi">
            <label>bound fraction</label>
        </fractionInput>

        <p name="pNum">numerator: $frac.numerator</p>
        <p name="pDen">denominator: $frac.denominator</p>
        `,
                },
                "*",
            );
        });

        // bound value seeds the two boxes
        cy.get("#pNum").should("have.text", "numerator: 2");
        cy.get("#pDen").should("have.text", "denominator: 3");

        // editing the denominator box flows back to the bound math input
        cy.get("#frac textarea").eq(1).type("{end}{backspace}5{enter}", {
            force: true,
        });
        cy.get("#pDen").should("have.text", "denominator: 5");
    });
});
