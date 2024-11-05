import { cesc, cesc2 } from "@doenet/utils";

describe("MatrixInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><matrixinput name="n" /></p>

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

        cy.get(cesc("#\\/n") + " textarea").type("1", { force: true });

        cy.get(cesc("#\\/piv") + " .mjx-mrow").should("contain.text", "[1]");
        cy.get(cesc("#\\/piv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "[1]");
        cy.get(cesc("#\\/pv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "[\uff3f]");

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

        cy.get(cesc("#\\/pv") + " .mjx-mrow").should("contain.text", "[1]");
        cy.get(cesc("#\\/piv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "[1]");
        cy.get(cesc("#\\/pv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "[1]");
    });
});
