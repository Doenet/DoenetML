import { cesc, cesc2 } from "@doenet/utils";

describe("MathInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("natural input to sqrt", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" /></p>
    <p>a2: $a.value{assignNames="a2"}</p>
    <p>a3: <copy prop="value" source="a" simplify assignNames="a3" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/a2") + " .mjx-mrow").should("contain.text", "＿");

        cy.get(cesc("#\\/a") + " textarea").type("sqrt4{enter}", {
            force: true,
        });

        cy.get(cesc("#\\/a") + " .mq-editable-field").should(
            "contain.text",
            "√4",
        );
        cy.get(cesc("#\\/a2") + " .mjx-mrow").should("contain.text", "√4");
        cy.get(cesc("#\\/a3") + " .mjx-mrow").should("contain.text", "2");

        cy.get(cesc("#\\/a") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                    "√4",
                );
            });
        cy.get(cesc("#\\/a2"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("√4");
            });
        cy.get(cesc("#\\/a3"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("2");
            });
    });

    it("check ignoreUpdate bug 1", () => {
        // if set core to delay 1 second on updates
        // then the refresh on blur (from the focus field recoil atoms changing)
        // would cause rendererValue.current to be changed to the old SV value
        // as the update wouldn't be ignored

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><text>a</text></p>
  <p>n: <mathinput name="n" prefill="10" /></p>
  <p>Value of n: $n.value{assignNames="n2"}</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        // by highlighting and typing a number, we make sure the rendererValue changes directly
        // from 10 to 20 and back to 10 (without other changes that would hide the bug)
        cy.get(cesc("#\\/n") + " textarea")
            .type("{home}{shift+rightArrow}2", { force: true })
            .blur();
        cy.get(cesc("#\\/n2")).should("contain.text", "20");

        cy.get(cesc("#\\/n") + " textarea")
            .type("{home}{shift+rightArrow}1", { force: true })
            .blur();
        cy.get(cesc("#\\/n2")).should("contain.text", "10");
    });

    it("check ignoreUpdate bug 2", () => {
        // if set core to delay 1 second on updates
        // the extra update from focusing another mathinput wasn't being ignored
        // leading rendererValue to get out of sync

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>

    <p>c: <mathinput name="c" prefill="x" /></p>
    <p>c2: $c.value{assignNames="c2"}</p>
    <p>d: <mathinput name="d" /></p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/c2") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("x");
            });

        cy.get(cesc("#\\/c") + " textarea").type("{end}y{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/d") + " textarea").focus();

        cy.get(cesc("#\\/c2")).should("contain.text", "xy");
        cy.get(cesc("#\\/c") + " .mq-editable-field").should(
            "contain.text",
            "xy",
        );
        cy.get(cesc("#\\/c2") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("xy");
            });

        // need next update to go back to x for the bug to be revealed
        cy.get(cesc("#\\/c") + " textarea").type("{end}{backspace}{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/c2")).should("not.contain.text", "xy");
        cy.get(cesc("#\\/c") + " .mq-editable-field").should(
            "contain.text",
            "x",
        );
        cy.get(cesc("#\\/c2") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("x");
            });
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><mathinput name="n" /></p>

    <p name="pv">value: $n</p>
    <p name="piv">immediate value: $n.immediateValue</p>
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

        cy.get(cesc("#\\/n") + " textarea").type("1", { force: true });

        cy.get(cesc("#\\/piv") + " .mjx-mrow").should("contain.text", "1");
        cy.get(cesc("#\\/piv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "1");
        cy.get(cesc("#\\/pv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "\uff3f");

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/pv") + " .mjx-mrow").should("contain.text", "1");
        cy.get(cesc("#\\/piv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "1");
        cy.get(cesc("#\\/pv") + " .mjx-mrow")
            .eq(0)
            .should("have.text", "1");
    });

    it("minWidth attribute", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <p>Specify min width: <mathinput name="mw" prefill="0" /></p>

      <p>Result: <mathinput minWidth="$mw" name="result" /></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/mw") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "50px",
        );

        cy.get(cesc("#\\/result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "0px",
        );

        cy.get(cesc("#\\/mw") + " textarea").type(
            "{end}{backspace}100{enter}",
            {
                force: true,
            },
        );
        cy.get(cesc("#\\/result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "100px",
        );

        cy.get(cesc("#\\/mw") + " textarea").type(
            "{end}{backspace}{backspace}{backspace}{enter}",
            { force: true },
        );
        cy.get(cesc("#\\/result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "0px",
        );

        cy.get(cesc("#\\/mw") + " textarea").type("{end}{backspace}40{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "40px",
        );

        cy.get(cesc("#\\/mw") + " textarea").type("{end}x{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "0px",
        );

        cy.get(cesc("#\\/mw") + " textarea").type(
            "{end}{backspace}{backspace}7{enter}",
            { force: true },
        );
        cy.get(cesc("#\\/result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "47px",
        );

        cy.get(cesc("#\\/mw") + " textarea").type(
            "{end}{backspace}{backspace}-20{enter}",
            { force: true },
        );
        cy.get(cesc("#\\/result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "0px",
        );
    });
});
