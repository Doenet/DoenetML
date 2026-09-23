describe("Offscreen updates", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Core sends renderer updates for content far below the viewport only
    // once it is idle. Whatever the reader types, that content must be current
    // by the time it is scrolled into view.
    const doenetML = `
<section name="top">
  <textInput name="ti" />
  <p name="near">Near: <text name="nearEcho">$ti.immediateValue</text></p>
</section>
<section name="spacer">
  <repeatForSequence from="1" to="80">
    <p>Filler paragraph to push the next section well below the fold.</p>
  </repeatForSequence>
</section>
<section name="bottom">
  <p name="far">Far: <text name="farEcho">$ti.immediateValue</text></p>
</section>
`;

    it("content typed into from far above is current when scrolled to", () => {
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#nearEcho").should("have.text", "");

        cy.get("#ti_input").type("hello");
        cy.get("#nearEcho").should("have.text", "hello");

        cy.get("#far").scrollIntoView();
        cy.get("#farEcho").should("have.text", "hello");

        cy.get("#top").scrollIntoView();
        cy.get("#ti_input").type(" world");
        cy.get("#nearEcho").should("have.text", "hello world");

        cy.get("#far").scrollIntoView();
        cy.get("#farEcho").should("have.text", "hello world");
    });
});
