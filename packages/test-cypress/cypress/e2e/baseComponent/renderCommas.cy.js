import { cesc2 } from "@doenet/utils";

describe("Render commas tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("render commas accounts for hidden and components without renderers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<function name="f">x+5</function>
<number hide>5</number>
<functionIterates name="fi" function="$f" numIterates="3" initialValue="4" />
$fi.iterates
  `,
                },
                "*",
            );
        });

        cy.get(".doenet-viewer").should("contain.text", "9, 14, 19");
    });
});
