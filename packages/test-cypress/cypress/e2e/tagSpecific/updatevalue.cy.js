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
    it("action buttons are no taller than an inline check-work button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <number name="m">1</number>
    <p name="pButtons">District 1
      <updateValue name="uv" target="$m" newValue="$m+1"><label>Set district 1</label></updateValue>
      <callAction name="ca" target="$m" actionName="resample"><label>Call</label></callAction>
      <triggerSet name="ts"><label>Trigger</label><updateValue target="$m" newValue="$m+1" /></triggerSet>
    </p>
    <p>x: <answer inline><mathInput name="mi" />x</answer></p>
    `,
                },
                "*",
            );
        });

        cy.get("#m").should("have.text", "1");

        cy.get("#mi_button").then((checkWork) => {
            const checkWorkHeight = checkWork[0].getBoundingClientRect().height;

            for (const id of ["uv", "ca", "ts"]) {
                cy.get(`#${id}`)
                    .should("have.css", "margin-top", "0px")
                    .and("have.css", "margin-bottom", "0px");
                cy.get(`#${id}_button`).should((button) => {
                    expect(
                        button[0].getBoundingClientRect().height,
                    ).to.be.at.most(checkWorkHeight);
                });
            }

            // The buttons leave the line they sit in no taller than a
            // check-work button would
            cy.get("#pButtons").should((p) => {
                expect(p[0].getBoundingClientRect().height).to.be.at.most(
                    checkWorkHeight,
                );
            });
        });

        // With no vertical padding, a focus ring drawn inside the button
        // would cross its label, so it must be drawn outside it
        cy.get("#uv_button").focus();
        cy.get("#uv_button").should((button) => {
            const style = window.getComputedStyle(button[0]);
            expect(style.outlineStyle).not.to.eq("none");
            expect(parseFloat(style.outlineOffset)).to.be.at.least(0);
        });
    });

    it("a click on a label over a rectangle runs an action listing both once", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="g">
      <rectangle name="r" vertices="(0,0) (4,2)" filled />
      <text name="t" anchor="(2,1)">label</text>
    </graph>
    <p>Count: <number name="n">0</number></p>
    <updateValue triggerWhenObjectsClicked="$r $t" target="$n" newValue="$n+1" hide />
    <p><updateValue name="done" target="$m" newValue="$m+1"><label>Done</label></updateValue> <number name="m">0</number></p>
    `,
                },
                "*",
            );
        });

        cy.get("#g").contains("label");
        cy.get("#g").then(($el) => {
            const rect = $el[0].getBoundingClientRect();
            // (2,1) in the default [-10, 10] bounding box
            cy.wrap($el).click((12 / 20) * rect.width, (9 / 20) * rect.height, {
                force: true,
            });
        });
        cy.get("#n").should("have.text", "1");

        // Actions run in order, so once the button's has run, the click's
        // have all run too
        cy.get("#done_button").click();
        cy.get("#m").should("have.text", "1");
        cy.get("#n").should("have.text", "1");
    });

    it("a click on a label over a curve runs an action listing both once", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="g">
      <curve name="c"><function>x-1</function></curve>
      <text name="t" anchor="(2,1)">label</text>
    </graph>
    <p>Count: <number name="n">0</number></p>
    <updateValue triggerWhenObjectsClicked="$c $t" target="$n" newValue="$n+1" hide />
    <p>Curve clicks: <number name="k">0</number></p>
    <updateValue triggerWhenObjectsClicked="$c" target="$k" newValue="$k+1" hide />
    <p><updateValue name="done" target="$m" newValue="$m+1"><label>Done</label></updateValue> <number name="m">0</number></p>
    `,
                },
                "*",
            );
        });

        cy.get("#g").contains("label");
        cy.get("#g").then(($el) => {
            const rect = $el[0].getBoundingClientRect();
            // (2,1) in the default [-10, 10] bounding box
            cy.wrap($el).click((12 / 20) * rect.width, (9 / 20) * rect.height, {
                force: true,
            });
        });
        cy.get("#k").should("have.text", "1");
        cy.get("#n").should("have.text", "1");

        // Actions run in order, so once the button's has run, the click's
        // have all run too
        cy.get("#done_button").click();
        cy.get("#m").should("have.text", "1");
        cy.get("#k").should("have.text", "1");
        cy.get("#n").should("have.text", "1");
    });
});
