describe("Select Tag Tests", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("not list if have ps", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <section name="sec">
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

        cy.get("#a").should("have.text", "a"); //wait for page to load
        cy.get("#sec").should("not.contain.text", ",");
    });
});
