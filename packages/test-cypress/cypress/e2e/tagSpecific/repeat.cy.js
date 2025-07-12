import { cesc } from "@doenet/utils";

describe("Map Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("repeat will not display as list if has block components", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <setup><sequence name="s" to="3" /></setup>
      <repeat asList for="$s" valueName="v">
          <p>Hello $v</p>
      </repeat>

    `,
                },
                "*",
            );
        });

        cy.get("#0").should("contain.text", "Hello 1");
        cy.get("#0").should("contain.text", "Hello 2");
        cy.get("#0").should("contain.text", "Hello 3");
        cy.get("#0").should("not.contain.text", ",");
    });

    it("repeatForSequence will not display as list if has block components", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <repeatForSequence asList to="3" valueName="v">
          <p>Hello $v</p>
      </repeatForSequence>

    `,
                },
                "*",
            );
        });

        cy.get("#0").should("contain.text", "Hello 1");
        cy.get("#0").should("contain.text", "Hello 2");
        cy.get("#0").should("contain.text", "Hello 3");
        cy.get("#0").should("not.contain.text", ",");
    });
});
