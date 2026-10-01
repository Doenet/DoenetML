describe("Paragraph Markup Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("em", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <em name="em1">This is italics</em>
  `,
                },
                "*",
            );
        });

        cy.log("find em");
        cy.get("em" + "#em1").should("have.text", "This is italics");
    });

    it("alert", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <alert name="alert1">This is bold</alert>
  `,
                },
                "*",
            );
        });

        cy.log("find alert");
        cy.get("strong" + "#alert1").should("have.text", "This is bold");
    });

    it("delete", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><delete name="delete1">This is struck through</delete></p>
  `,
                },
                "*",
            );
        });

        cy.log("find delete");
        cy.get("del" + "#delete1")
            .should("have.text", "This is struck through")
            .should("have.css", "text-decoration-line", "line-through");
    });

    it("insert", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><insert name="insert1">This is underlined</insert></p>
  `,
                },
                "*",
            );
        });

        cy.log("find insert");
        cy.get("ins" + "#insert1")
            .should("have.text", "This is underlined")
            .should("have.css", "text-decoration-line", "underline");
    });

    it("delete and insert draw their line through math too", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1">The derivative is <delete name="delete1"><m>3x^3</m></delete> <insert name="insert1"><m>3x^2</m></insert>.</p>
  `,
                },
                "*",
            );
        });

        // A text decoration does not reach into MathJax's inline-block, so the
        // line is drawn as a background on the math instead.
        cy.get("#delete1 mjx-container")
            .should("have.css", "background-image")
            .and("match", /linear-gradient/);
        cy.get("#insert1 mjx-container")
            .should("have.css", "background-image")
            .and("match", /linear-gradient/);
    });

    it("q", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1"><q>Double quoted</q></p>
  `,
                },
                "*",
            );
        });

        cy.log("find quotes");
        cy.get("#p1").should("have.text", "“Double quoted”");
    });

    it("sq", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1"><sq>Single quoted</sq></p>
  `,
                },
                "*",
            );
        });

        cy.log("find quotes");
        cy.get("#p1").should("have.text", "‘Single quoted’");
    });

    it("c", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <c name="c1">Code!</c>
  `,
                },
                "*",
            );
        });

        cy.log("find quotes");
        cy.get("code" + "#c1").should("have.text", "Code!");
    });

    it("term", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <term name="term1">Homogeneous</term>
  `,
                },
                "*",
            );
        });

        cy.log("find term");
        cy.get("strong" + "#term1").should("have.text", "Homogeneous");
    });
});
