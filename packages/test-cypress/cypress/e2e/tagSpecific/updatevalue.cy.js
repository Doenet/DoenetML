import me from "math-expressions";

describe("UpdateValue Tag Tests", { tags: ["@group3"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // TODO: what is supposed to happen here?
    it.skip("update value set to ignore read only flag", () => {
        let doenetML = `
    <text>a</text>
    <p>m = <number name="m" >1</number></p>
    <p>n = <number name="n" >10</number></p>

    <p><updateValue name="incm" target="$m" newValue="$m+1"  >
      <label>increment m</label>
    </updateValue></p>
    <p><updateValue name="incn" target="$n" newValue="$n+10" disabledIgnoresParentReadOnly >
      <label>increment n</label>
    </updateValue></p>

    `;
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#text1").should("have.text", "a"); //wait for page to load

        cy.get("#m").should("have.text", "1");
        cy.get("#n").should("have.text", "10");

        cy.get("#incm_button").click();
        cy.get("#incn_button").click();

        cy.get("#m").should("have.text", "2");
        cy.get("#n").should("have.text", "20");

        cy.wait(2000); // wait to make sure 1 second debounce occurred

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_readOnly").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#incm_button").should("be.disabled");
        cy.get("#incn_button").should("not.be.disabled");

        cy.get("#m").should("have.text", "2");
        cy.get("#n").should("have.text", "20");

        cy.get("#incm_button").click();
        cy.get("#incn_button").click();

        cy.get("#m").should("have.text", "2");
        cy.get("#n").should("have.text", "30");
    });

    it("a press is announced to screen readers in a status region", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>n = <number name="n">1</number></p>
    <p><updateValue name="inc" target="$n" newValue="$n+1">
      <label>Add 1</label>
      <statusMessage>Count is now $n.</statusMessage>
    </updateValue></p>
    <p><updateValue name="plain" target="$n" newValue="$n+10">
      <label>Add 10</label>
    </updateValue></p>
    `,
                },
                "*",
            );
        });

        cy.log("The region is on the page, empty and unseen, before any press");
        cy.get("#inc_status")
            .should("have.attr", "role", "status")
            .and("have.text", "")
            .and("have.css", "width", "1px");
        cy.get("#plain_status").should("have.text", "");

        cy.log("The author's message names the value the press produced");
        cy.get("#inc_button").click();
        cy.get("#n").should("have.text", "2");
        cy.get("#inc_status").should("have.text", "Count is now 2.");
        // The message is announced, not shown, so the label is unchanged.
        cy.get("#inc_button").should("have.text", "Add 1");

        cy.log("Pressing again announces again");
        cy.get("#inc_button").click();
        cy.get("#inc_status").should("have.text", "Count is now 3.");

        cy.log("Without a statusMessage, the default is announced");
        cy.get("#plain_button").click();
        cy.get("#n").should("have.text", "13");
        cy.get("#plain_status").should("have.text", "Value updated");

        cy.log("The message is cleared once announced, so it cannot go stale");
        cy.get("#plain_status", { timeout: 8000 }).should("have.text", "");
    });

    it("a press of a button in a graph is announced too", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>n = <number name="n">1</number></p>
    <graph name="g">
      <shortDescription>A graph holding a button</shortDescription>
      <updateValue name="inc" target="$n" newValue="$n+1" anchor="(0,0)">
        <label>Add 1</label>
        <statusMessage>Count is now $n.</statusMessage>
      </updateValue>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.get("#inc_status").should("have.text", "");
        cy.get("#g").contains("button", "Add 1").click();
        cy.get("#n").should("have.text", "2");
        cy.get("#inc_status").should("have.text", "Count is now 2.");
    });
});
