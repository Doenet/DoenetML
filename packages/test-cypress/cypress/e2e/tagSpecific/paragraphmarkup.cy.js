import { cesc } from "@doenet/utils";

describe("Paragraph Markup Tag Tests", function () {
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
        cy.get("em" + cesc("#em1")).should("have.text", "This is italics");
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
        cy.get("strong" + cesc("#alert1")).should("have.text", "This is bold");
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
        cy.get(cesc("#p1")).should("have.text", "“Double quoted”");
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
        cy.get(cesc("#p1")).should("have.text", "‘Single quoted’");
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
        cy.get("code" + cesc("#c1")).should("have.text", "Code!");
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
        cy.get("strong" + cesc("#term1")).should("have.text", "Homogeneous");
    });
});
