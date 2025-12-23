import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

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
    <p>a: <mathInput name="a" /></p>
    <p>a2: <math extend="$a" name="a2" /></p>
    <p>a3: <math extend="$a" simplify name="a3" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a2")).should("contain.text", "＿");

        cy.get(cesc("#a") + " textarea").type("sqrt4{enter}", {
            force: true,
        });

        // cy.get(cesc("#a") + " .mq-editable-field").should("contain.text", "√4");
        cy.get(cesc("#a") + " .mq-editable-field").should("contain.text", "4");
        cy.get(cesc("#a2")).should("contain.text", "4");
        cy.get(cesc("#a3")).should("contain.text", "2");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eqls(["apply", "sqrt", 4]);
        });

        // cy.get(cesc("#a") + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
        //             "√4",
        //         );
        //     });
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
  <p>n: <mathInput name="n" prefill="10" /></p>
  <p>Value of n: <math extend="$n" name="n2"/></p>
  `,
                },
                "*",
            );
        });

        // by highlighting and typing a number, we make sure the rendererValue changes directly
        // from 10 to 20 and back to 10 (without other changes that would hide the bug)
        cy.get(cesc("#n") + " textarea")
            .type("{home}{shift+rightArrow}2", { force: true })
            .blur();
        cy.get(cesc("#n2")).should("contain.text", "20");

        cy.get(cesc("#n") + " textarea")
            .type("{home}{shift+rightArrow}1", { force: true })
            .blur();
        cy.get(cesc("#n2")).should("contain.text", "10");
    });

    it("check ignoreUpdate bug 2", () => {
        // if set core to delay 1 second on updates
        // the extra update from focusing another mathInput wasn't being ignored
        // leading rendererValue to get out of sync

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>c: <mathInput name="c" prefill="x" /></p>
    <p>c2: <math extend="$c" name="c2" /></p>
    <p>d: <mathInput name="d" /></p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#c2")).should("have.text", toMathJaxString("x"));

        cy.get(cesc("#c") + " textarea").type("{end}y{enter}", {
            force: true,
        });
        cy.get(cesc("#d") + " textarea").focus();

        cy.get(cesc("#c2")).should("have.text", toMathJaxString("xy"));
        cy.get(cesc("#c") + " .mq-editable-field").should("contain.text", "xy");

        // need next update to go back to x for the bug to be revealed
        cy.get(cesc("#c") + " textarea").type("{end}{backspace}{enter}", {
            force: true,
        });
        cy.get(cesc("#c2")).should("not.have.text", toMathJaxString("xy"));
        cy.get(cesc("#c") + " .mq-editable-field").should("contain.text", "x");
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><mathInput name="n" /></p>

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

        cy.get(cesc("#pv")).should("contain.text", "value: \uff3f");

        cy.get(cesc("#n") + " textarea").type("1", { force: true });

        cy.get(cesc("#piv")).should("have.text", "immediate value: 1");
        cy.get(cesc("#pv")).should("contain.text", "value: \uff3f");

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

        cy.get(cesc("#pv")).should("have.text", "value: 1");
        cy.get(cesc("#piv")).should("have.text", "immediate value: 1");
    });

    it("minWidth attribute", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <p>Specify min width: <mathInput name="mw" prefill="0" /></p>

      <p>Result: <mathInput minWidth="$mw" name="result" /></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#mw") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "50px",
        );

        cy.get(cesc("#result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "0px",
        );

        cy.get(cesc("#mw") + " textarea").type("{end}{backspace}100{enter}", {
            force: true,
        });
        cy.get(cesc("#result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "100px",
        );

        cy.get(cesc("#mw") + " textarea").type(
            "{end}{backspace}{backspace}{backspace}{enter}",
            { force: true },
        );
        cy.get(cesc("#result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "50px",
        );

        cy.get(cesc("#mw") + " textarea").type("{end}{backspace}40{enter}", {
            force: true,
        });
        cy.get(cesc("#result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "40px",
        );

        cy.get(cesc("#mw") + " textarea").type("{end}x{enter}", {
            force: true,
        });
        cy.get(cesc("#result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "50px",
        );

        cy.get(cesc("#mw") + " textarea").type(
            "{end}{backspace}{backspace}7{enter}",
            { force: true },
        );
        cy.get(cesc("#result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "47px",
        );

        cy.get(cesc("#mw") + " textarea").type(
            "{end}{backspace}{backspace}-20{enter}",
            { force: true },
        );
        cy.get(cesc("#result") + " .mq-editable-field").should(
            "have.css",
            "min-width",
            "0px",
        );
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="mi">
        <shortDescription>Enter something</shortDescription>
        <description>
            <p>Type what you like.</p>
            <p>Including math: <m name="m">x^2+1</m></p>
        </description>
    </mathInput>

    `,
                },
                "*",
            );
        });

        cy.get("#mi [data-test='Description Button']").should("be.visible");
        cy.get("#mi [data-test='Description']").should("not.be.visible");
        cy.get("#m").should("not.be.visible");

        cy.get("#mi .mq-editable-field").should(
            "have.attr",
            "aria-details",
            `mi-description-content`,
        );
        cy.get(`#mi-description-content`).should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#mi [data-test='Description Button']").click();

        cy.get("#mi [data-test='Description']").should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#m").should("have.text", toMathJaxString("x2+1"));

        cy.get("#mi textarea").focus();
        cy.get("#mi [data-test='Description']").should("not.be.visible");
        cy.get("#m").should("not.be.visible");
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="mi">
        <shortDescription>Enter something</shortDescription>
    </mathInput>

    `,
                },
                "*",
            );
        });

        cy.get("#mi").should("be.visible");
        cy.get("#mi [data-test='Description Button']").should("not.exist");
        cy.get("#mi [data-test='Description']").should("not.exist");
        cy.get("#mi .mq-editable-field").should(
            "not.have.attr",
            "aria-details",
        );
    });
});
