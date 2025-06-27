describe("blockquote Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("display blockquote", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p>Hello</p>
  <blockQuote name="bq">
    For to be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others.
  </blockquote>
  <p>There</p>
  `,
                },
                "*",
            );
        });

        cy.get("blockquote#bq").should(
            "have.text",
            "\n    For to be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others.\n  ",
        );
    });
});
