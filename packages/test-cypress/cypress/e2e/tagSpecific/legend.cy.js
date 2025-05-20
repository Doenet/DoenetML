import { cesc } from "@doenet/utils";

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
    <text>a</text>
    <graph>
        <legend> <label><m>A = $sideA.length</m></label> </legend>

        <lineSegment name="sideA" endpoints="(1,2) (3,4)" />
    </graph>
    `,
                },
                "*",
            );
        });

        // use this to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(".MathJax").should("have.text", "A=2.83");
    });
});
