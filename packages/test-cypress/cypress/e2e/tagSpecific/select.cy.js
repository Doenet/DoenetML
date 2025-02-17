import { cesc2 } from "@doenet/utils";

describe("Select Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("not list if have ps", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <section>
      <select numToSelect="4" withReplacement>
        <option><p>hello</p></option>
        <option><p>bye</p></option>
      </select>
    </section>
    `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for page to load
        cy.get(cesc2("#/_section1")).should("not.contain.text", ",");
    });
});
