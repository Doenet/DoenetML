import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Line Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("complex endpoint doesn't crash renderer", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <lineSegment name="ls" endpoints="(1,0) (1,2i)"  />
    </graph>
    <p name="p">Endpoints: <point name="P1" extend="$ls.endpoint1" />, <point name="P2" extend="$ls.endpoint2" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#P1")).should("have.text", toMathJaxString("(1,0)"));
        cy.get(cesc("#P2")).should("have.text", toMathJaxString("(1,2i)"));
    });
});
