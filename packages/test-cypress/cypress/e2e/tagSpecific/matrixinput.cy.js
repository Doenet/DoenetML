import { cesc } from "@doenet/utils";

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
});
