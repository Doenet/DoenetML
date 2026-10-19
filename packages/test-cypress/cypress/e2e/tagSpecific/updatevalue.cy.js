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

    it("a press is announced to screen readers in the document's status region", () => {
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

        cy.get("#n").should("have.text", "1");
        cy.log("One region, on the page, empty and unseen, before any press");
        cy.get('.doenet-viewer [role="status"]#_announcements').should(
            "have.length",
            1,
        );
        cy.get("#_announcements")
            .should("have.attr", "aria-live", "polite")
            .and("have.attr", "aria-atomic", "true")
            .and("have.text", "")
            .and("have.css", "width", "1px");
        // The buttons have no region of their own.
        cy.get("#inc [role=status]").should("not.exist");

        cy.log("The author's message names the value the press produced");
        cy.get("#inc_button").click();
        cy.get("#n").should("have.text", "2");
        cy.get("#_announcements").should("have.text", "Count is now 2.");
        // The message is announced, not shown, so the label is unchanged.
        cy.get("#inc_button").should("have.text", "Add 1");

        cy.log("Pressing again announces again");
        cy.get("#inc_button").click();
        cy.get("#_announcements").should("have.text", "Count is now 3.");

        cy.log("Without a statusMessage, the default is announced");
        cy.get("#plain_button").click();
        cy.get("#n").should("have.text", "13");
        cy.get("#_announcements").should("have.text", "Value updated");

        cy.log("The message is cleared once announced, so it cannot go stale");
        cy.get("#_announcements", { timeout: 8000 }).should("have.text", "");

        cy.log("The same message twice is announced twice");
        cy.get("#plain_button").click();
        cy.get("#n").should("have.text", "23");
        cy.get("#_announcements").should("have.text", "Value updated");
        // Record what the region holds from here on: it must be emptied and
        // filled again, or a screen reader would not repeat the message.
        const seen = [];
        cy.get("#_announcements").then(($region) => {
            const region = $region[0];
            new region.ownerDocument.defaultView.MutationObserver(() =>
                seen.push(region.textContent),
            ).observe(region, {
                childList: true,
                characterData: true,
                subtree: true,
            });
        });
        cy.get("#plain_button").click();
        cy.get("#n").should("have.text", "33");
        cy.wrap(seen).should("deep.equal", ["", "Value updated"]);
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

        cy.get("#n").should("have.text", "1");
        cy.get("#_announcements").should("have.text", "");
        cy.get("#g").contains("button", "Add 1").click();
        cy.get("#n").should("have.text", "2");
        cy.get("#_announcements").should("have.text", "Count is now 2.");
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
    <p name="p3"><updateValue name="selfCount" target="$n" newValue="$n+1" hide="$n > 1">
      <label>Count once</label>
      <statusMessage>Counted to $n.</statusMessage>
    </updateValue></p>
    <graph name="g">
      <shortDescription>A graph holding two buttons</shortDescription>
      <updateValue name="once" target="$n" newValue="$n+1" hide="$n > 2" anchor="(0,0)">
        <label>Graph once</label>
        <statusMessage>Count is now $n.</statusMessage>
      </updateValue>
      <updateValue name="later" target="$n" newValue="$n+1" hide="$n &lt; 3" anchor="(3,3)">
        <label>Graph later</label>
      </updateValue>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.log("A hidden button draws nothing");
        cy.get("#n").should("have.text", "1");
        cy.get("#never").should("not.exist");
        cy.get("#p2").should("have.text", "xy");
        // In a graph, too: only the shown button can be seen or reached.
        cy.get("#g button").should("have.length", 1);

        cy.log("The region outlives the button it announces");
        cy.get("#reveal_button").click();
        cy.get("#hint").should("contain.text", "The hint");
        cy.get("#reveal_button").should("not.exist");
        cy.get("#_announcements").should("have.text", "Hint shown.");

        cy.log("And names the value the press produced, not the one before");
        cy.get("#selfCount_button").click();
        cy.get("#n").should("have.text", "2");
        cy.get("#selfCount_button").should("not.exist");
        cy.get("#_announcements").should("have.text", "Counted to 2.");

        cy.log("In a graph, too");
        cy.get("#g").contains("button", "Graph once").click();
        cy.get("#n").should("have.text", "3");
        cy.get("#_announcements").should("have.text", "Count is now 3.");

        cy.log("A button in a graph that starts hidden works once shown");
        cy.get("#g button").should("have.length", 1);
        cy.get("#g")
            .contains("button", "Graph later")
            .should("be.visible")
            .click();
        cy.get("#n").should("have.text", "4");
        cy.get("#_announcements").should("have.text", "Value updated");
    });
});
