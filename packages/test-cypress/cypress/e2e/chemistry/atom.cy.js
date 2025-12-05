import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Atom tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
    });

    it("Electron configuration displays correctly", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<atom name="helium" atomicNumber="2"/>
<p name="p">The electron configuration for helium is $helium.electronConfiguration.</p>
  `,
                },
                "*",
            );
        });

        cy.get("#p").should(
            "have.text",
            `The electron configuration for helium is ${toMathJaxString("1s2")}.`,
        );
    });
});
