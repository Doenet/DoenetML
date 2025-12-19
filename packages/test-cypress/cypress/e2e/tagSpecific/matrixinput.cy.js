import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("MatrixInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><matrixInput name="n" /></p>

    <p name="pv">value: $n</p>
    <p name="piv">immediate value: $n.immediateValue</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#n") + " textarea").type("1", { force: true });

        cy.get(cesc("#piv")).should("have.text", "immediate value: [1]");
        cy.get(cesc("#pv")).should("contain.text", "[\uff3f]");

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#pv")).should("have.text", "value: [1]");
        cy.get(cesc("#piv")).should("have.text", "immediate value: [1]");
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <matrixInput name="mi">
            <shortDescription>Enter something</shortDescription>
            <description>
                <p>Type what you like.</p>
                <p>Including math: <m name="m">x^2+1</m></p>
            </description>
        </matrixInput>
    
        `,
                },
                "*",
            );
        });

        cy.get("#mi-container [data-test='Description Button']").should(
            "be.visible",
        );
        cy.get("#mi-container [data-test='Description']").should(
            "not.be.visible",
        );
        cy.get("#m").should("not.be.visible");

        cy.get("#mi-container [data-test='Description Button']").click();

        cy.get("#mi-container [data-test='Description']").should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#m").should("have.text", toMathJaxString("x2+1"));

        cy.get("#mi-container textarea").focus();
        cy.get("#mi-container [data-test='Description']").should(
            "not.be.visible",
        );
        cy.get("#m").should("not.be.visible");
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <matrixInput name="mi">
        <shortDescription>Enter something</shortDescription>
    </matrixInput>

    `,
                },
                "*",
            );
        });

        cy.get("#mi").should("be.visible");
        cy.get("#mi [data-test='Description Button']").should("not.exist");
        cy.get("#mi [data-test='Description']").should("not.exist");
    });
});
