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

    it("a press of a button that hides itself is announced", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>n = <number name="n">1</number></p>
    <boolean name="shown">false</boolean>
    <p name="p1"><updateValue name="reveal" target="$shown" newValue="true" type="boolean" hide="$shown">
      <label>Show hint</label>
      <statusMessage>Hint shown.</statusMessage>
    </updateValue></p>
    <p hide="not $shown" name="hint">The hint</p>
    <p name="p2">x<updateValue name="never" target="$n" newValue="$n+1" hide><label>Never</label></updateValue>y</p>
    <graph name="g">
      <shortDescription>A graph holding two buttons</shortDescription>
      <updateValue name="once" target="$n" newValue="$n+1" hide="$n > 1" anchor="(0,0)">
        <label>Graph once</label>
        <statusMessage>Count is now $n.</statusMessage>
      </updateValue>
      <updateValue name="later" target="$n" newValue="$n+1" hide="$n = 1" anchor="(3,3)">
        <label>Graph later</label>
      </updateValue>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.log("A hidden button draws nothing but its empty region");
        cy.get("#reveal_status").should("have.text", "");
        cy.get("#never_status").should("have.text", "");
        cy.get("#never_button").should("not.exist");
        cy.get("#p2").should("have.text", "xy");
        // In a graph, too: only the shown button can be seen or reached.
        cy.get("#g button:visible").should("have.length", 1);

        cy.log("The region outlives the button it announces");
        cy.get("#reveal_button").click();
        cy.get("#hint").should("contain.text", "The hint");
        cy.get("#reveal_button").should("not.exist");
        cy.get("#reveal_status").should("have.text", "Hint shown.");

        cy.log("In a graph, and naming the value the press produced");
        cy.get("#g").contains("button", "Graph once").click();
        cy.get("#n").should("have.text", "2");
        cy.get("#once_status").should("have.text", "Count is now 2.");
        cy.get("#g button:visible").should("have.length", 1);

        cy.log("A button in a graph that starts hidden works once shown");
        cy.get("#g")
            .contains("button", "Graph later")
            .should("be.visible")
            .click();
        cy.get("#n").should("have.text", "3");
        cy.get("#later_status").should("have.text", "Value updated");
    });
});
