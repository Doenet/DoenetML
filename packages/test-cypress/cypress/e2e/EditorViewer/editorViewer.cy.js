import { cesc, deepCompare } from "@doenet/utils";

describe("EditorViewer Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("search and replace does not close after first replace", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<p name="p">An apple a day</p>`,
                },
                "*",
            );
        });

        cy.get("#p").should("have.text", "An apple a day");

        cy.get(".cm-activeLine").type("{ctrl}f");
        cy.get("input[name='search']").type("a");
        cy.get("input[name='replace']").type("x");
        cy.get("button[name='next']").click();
        cy.get("button[name='next']").click();
        cy.get("button[name='replace']").click();
        cy.get("button[name='replace']").click();
        cy.get("button[name='replace']").click();
        cy.get(".cm-activeLine").type("{ctrl}s");

        cy.get("#p").should("have.text", "xn xpple x day");
    });
});
