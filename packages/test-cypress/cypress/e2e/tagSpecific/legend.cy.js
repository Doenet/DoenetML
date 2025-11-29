import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Legend Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("legend with math does not crash", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <legend> <label><m>A = $sideA.length</m></label> </legend>

        <lineSegment name="sideA" endpoints="(1,2) (3,4)" />
    </graph>
    `,
                },
                "*",
            );
        });

        cy.get(".MathJax").should("contain.text", toMathJaxString("A =2.83"));
    });
});
