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

    it("fraction input in answer", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <answer name="ans">
            <fractionInput name="frac">
                <shortDescription>Simplify two tenths</shortDescription>
            </fractionInput>
            <award>1/5</award>
        </answer>
        `,
                },
                "*",
            );
        });

        cy.get("#frac textarea").eq(0).type("1", { force: true });
        cy.get("#frac textarea").eq(1).type("5", { force: true });

        cy.get("#frac_button").should("contain.text", "Check Work").click();
        cy.get("#frac_button").should("contain.text", "Correct");
    });
});
