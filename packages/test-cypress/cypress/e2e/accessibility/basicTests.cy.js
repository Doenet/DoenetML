import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Render commas tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
        cy.injectAxe();
    });

    it("Virtual keyboard passes accessibility tests", () => {
        // Makes sure keyboard passes basic tests, like color contrast
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<p name="p">Hello!</p>
  `,
                },
                "*",
            );
        });

        cy.get("#p").should("contain.text", "Hello!");

        cy.checkAccessibility();
    });
});
