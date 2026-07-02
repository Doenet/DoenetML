import { cesc } from "@doenet/utils";

describe("Hints Tag Tests", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("hints with and without title", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <hint name="hint1">
        <p name="p1">Hello</p>
      </hint>
    
      <hint name="hint2">
        <title name="title1">Hint 2</title>
        <p name="p2">Good day!</p>
      </hint>

    `,
                },
                "*",
            );
        });

        cy.get("#hint1" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint",
        );
        cy.get("#hint2" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint 2",
        );

        cy.get("#p1").should("not.exist");
        cy.get("#title1").should("have.text", "Hint 2");
        cy.get("#p2").should("not.exist");

        cy.get("#hint1" + " [data-test=hint-heading]").click();
        cy.get("#p1").should("have.text", "Hello");
        cy.get("#p2").should("not.exist");
        cy.get("#hint1" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint",
        );
        cy.get("#hint2" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint 2",
        );
        cy.get("#title1").should("have.text", "Hint 2");

        cy.get("#hint2" + " [data-test=hint-heading]").click();
        cy.get("#p2").should("have.text", "Good day!");
        cy.get("#p1").should("have.text", "Hello");
        cy.get("#hint1" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint",
        );
        cy.get("#hint2" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint 2",
        );
        cy.get("#title1").should("have.text", "Hint 2");

        cy.get("#hint1" + " [data-test=hint-heading]").click();
        cy.get("#p1").should("not.exist");
        cy.get("#p2").should("have.text", "Good day!");
        cy.get("#hint1" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint",
        );
        cy.get("#hint2" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint 2",
        );
        cy.get("#title1").should("have.text", "Hint 2");

        cy.get("#hint2" + " [data-test=hint-heading]").click();
        cy.get("#p1").should("not.exist");
        cy.get("#p2").should("not.exist");
        cy.get("#hint1" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint",
        );
        cy.get("#hint2" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint 2",
        );
        cy.get("#title1").should("have.text", "Hint 2");
    });

    it("copy and overwrite title", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <hint name="hint1">
        <title name="title1">Hint 1</title>
        <p name="p1">Hello</p>
      </hint>
    
      <hint name="revised" extend="$hint1">
        <title name="title2">Hint 2</title>
        <p name="p2">Good day!</p>
      </hint>

      <p name="p3">Title of original hint: <text extend="$hint1.title" name="title1" /></p>
      <p name="p4">Title of revised hint: <text extend="$revised.title" name="title2" /></p>
    
    `,
                },
                "*",
            );
        });

        cy.get("#hint1" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint 1",
        );
        cy.get("#revised" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint 2",
        );
        cy.get(cesc("#p3.title1")).should("have.text", "Hint 1");
        cy.get(cesc("#p4.title2")).should("have.text", "Hint 2");
        cy.get(cesc("#hint1.title1")).should("have.text", "Hint 1");
        cy.get("#p1").should("not.exist");
        cy.get(cesc("#revised.title1")).should("not.exist");
        cy.get(cesc("#revised.title2")).should("have.text", "Hint 2");
        cy.get("#p2").should("not.exist");

        cy.get("#hint1" + " [data-test=hint-heading]").click();
        cy.get("#p1").should("have.text", "Hello");
        cy.get(cesc("#revised.p1")).should("not.exist");
        cy.get("#p2").should("not.exist");
        cy.get(cesc("#hint1.title1")).should("have.text", "Hint 1");
        cy.get(cesc("#revised.title1")).should("not.exist");
        cy.get(cesc("#revised.title2")).should("have.text", "Hint 2");

        cy.get("#revised" + " [data-test=hint-heading]").click();
        cy.get(cesc("#revised.p1")).should("have.text", "Hello");
        cy.get("#p2").should("have.text", "Good day!");
        cy.get("#p1").should("have.text", "Hello");
        cy.get(cesc("#hint1.title1")).should("have.text", "Hint 1");
        cy.get(cesc("#revised.title1")).should("not.exist");
        cy.get(cesc("#revised.title2")).should("have.text", "Hint 2");

        cy.get("#hint1" + " [data-test=hint-heading]").click();
        cy.get("#p1").should("not.exist");
        cy.get(cesc("#revised.p1")).should("have.text", "Hello");
        cy.get("#p2").should("have.text", "Good day!");
        cy.get(cesc("#hint1.title1")).should("have.text", "Hint 1");
        cy.get(cesc("#revised.title1")).should("not.exist");
        cy.get(cesc("#revised.title2")).should("have.text", "Hint 2");

        cy.get("#revised" + " [data-test=hint-heading]").click();
        cy.get(cesc("#revised.p1")).should("not.exist");
        cy.get("#p2").should("not.exist");
        cy.get("#p1").should("not.exist");
        cy.get(cesc("#hint1.title1")).should("have.text", "Hint 1");
        cy.get(cesc("#revised.title1")).should("not.exist");
        cy.get(cesc("#revised.title2")).should("have.text", "Hint 2");
    });

    it("Can open hint in read only mode", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_readOnly").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <hint name="hint1">
        <title>Hello</title>
        <p name="p1">Content</p>
      </hint>

      <p><textInput name="ti" /></p>
    `,
                },
                "*",
            );
        });

        cy.get("#hint1" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hello",
        );

        cy.get("#p1").should("not.exist");
        cy.get("#ti_input").should("be.disabled");

        cy.get("#hint1" + " [data-test=hint-heading]").click();
        cy.get("#p1").should("have.text", "Content");

        cy.get("#hint1" + " [data-test=hint-heading]").click();
        cy.get("#p1").should("not.exist");
    });
});
