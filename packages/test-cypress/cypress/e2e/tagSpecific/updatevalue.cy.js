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
});
