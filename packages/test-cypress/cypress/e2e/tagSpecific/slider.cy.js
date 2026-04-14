import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Slider Tag Tests", { tags: ["@group1"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("move two number slider", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <slider name="s">
    <number>1</number>
    <number>2</number>
  </slider>
  <p>Value: <number name="sv">$s</number></p>
  `,
                },
                "*",
            );
        });

        cy.get("#sv").should("have.text", "1");
        cy.get("#s").should("have.value", "0");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let slider1value =
                stateVariables[await win.resolvePath1("s")].stateValues.value;
            expect(slider1value).eq(1);
        });

        cy.log("less than half way, stays at 1");
        cy.get("#s").invoke("val", "0.4").trigger("input");

        cy.get("#sv").should("have.text", "1");
        cy.get("#s").should("have.value", "0");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let slider1value =
                stateVariables[await win.resolvePath1("s")].stateValues.value;
            expect(slider1value).eq(1);
        });

        cy.log("past halfway, goes to 2");
        cy.get("#s").invoke("val", "0.6").trigger("input");

        cy.get("#sv").should("have.text", "2");
        cy.get("#s").should("have.value", "1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let slider1value =
                stateVariables[await win.resolvePath1("s")].stateValues.value;
            expect(slider1value).eq(2);
        });
    });

    it("no arguments, default to number slider from 0 to 10", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <document name="doc">
  <slider name="s" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathInput name="mi" bindValueTo="$s" /></p>
  <p>
    <booleanInput name="bi"/>
    <boolean name="b" extend="$bi" />
  </p>
  </document>
    `,
                },
                "*",
            );
        });

        cy.get("#sv").should("have.text", "0");
        cy.get("#s").should("have.value", "0");

        cy.get("#mi" + " .mq-editable-field").should("contain.text", "0");
        // cy.get("#mi" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
        //     });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(0);
        });

        cy.log("drag handle to 1");
        cy.get("#s").invoke("val", 1).trigger("input");

        cy.get("#sv").should("have.text", "1");
        cy.get("#s").should("have.value", "1");
        cy.get("#mi" + " .mq-editable-field").should("contain.text", "1");
        // cy.get("#mi" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
        //     });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(1);
        });

        cy.log("drag handle to 9");
        cy.get("#s").invoke("val", "9").trigger("input");

        cy.get("#sv").should("have.text", "9");
        cy.get("#s").should("have.value", "9");
        cy.get("#mi" + " .mq-editable-field").should("contain.text", "9");
        // cy.get("#mi" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("9");
        //     });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(9);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(9);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(9);
        });

        cy.log("enter 2.5");

        cy.get("#mi" + " textarea").type("{end}{backspace}2.5{enter}", {
            force: true,
        });

        cy.get("#sv").should("have.text", "3");
        cy.get("#s").should("have.value", "3");
        cy.get("#mi" + " .mq-editable-field").should("contain.text", "3");
        // cy.get("#mi" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
        //     });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(3);
        });

        cy.log("enter x, ignored");

        cy.get("#mi" + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}x{enter}",
            { force: true },
        );
        // use booleanInput to wait, since above has no effect
        cy.get("#bi").click();
        cy.get("#b").should("have.text", "true");

        cy.get("#sv").should("have.text", "3");
        cy.get("#s").should("have.value", "3");
        cy.get("#mi" + " .mq-editable-field").should("contain.text", "3");
        // cy.get("#mi" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
        //     });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(3);
        });

        cy.log(
            "drag handle past below document and past end sets to maximum 10",
        );
        cy.get("#s").invoke("val", 29).trigger("input");

        cy.get("#sv").should("have.text", "10");
        cy.get("#s").should("have.value", "10");
        cy.get("#mi" + " .mq-editable-field").should("contain.text", "10");
        // cy.get("#mi" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
        //             "10",
        //         );
        //     });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(10);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(10);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(10);
        });
    });

    it("label with math", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <slider name="s"><label>Hello <m>x^2</m></label></slider>
  <p>Value: <number name="sv">$s</number></p>
    `,
                },
                "*",
            );
        });

        cy.get("#sv").should("have.text", "0");
        cy.get("#s").should("have.value", "0");

        cy.get("#s-label").should(
            "contain.text",
            `Hello ${toMathJaxString(`x2 = 0`)}`,
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.label,
            ).eq("Hello \\(x^2\\)");
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(0);
        });

        cy.log("drag handle to 1");
        cy.get("#s").invoke("val", 1).trigger("input");

        cy.get("#sv").should("have.text", "1");
        cy.get("#s").should("have.value", "1");

        cy.get("#s-label").should(
            "contain.text",
            `Hello ${toMathJaxString(`x2 = 1`)}`,
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.label,
            ).eq("Hello \\(x^2\\)");
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(1);
        });
    });

    it("change by clicking tick label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <slider name="s" />
  <p>Value: <number name="sv">$s</number></p>
    `,
                },
                "*",
            );
        });

        cy.get("#sv").should("have.text", "0");
        cy.get("#s").should("have.value", "0");

        cy.get("#s-datalist option:nth-child(3)").click();

        cy.get("#sv").should("have.text", "2");
        cy.get("#s").should("have.value", "2");
    });

    it("show controls", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <slider name="s" showControls />
  <p>Value: <number name="sv">$s</number></p>
    `,
                },
                "*",
            );
        });

        cy.get("#sv").should("have.text", "0");
        cy.get("#s").should("have.value", "0");
        cy.get("#s-prevbutton").should("be.disabled");
        cy.get("#s-nextbutton").should("not.be.disabled");

        cy.get("#s-nextbutton").click();
        cy.get("#sv").should("have.text", "1");
        cy.get("#s").should("have.value", "1");
        cy.get("#s-prevbutton").should("not.be.disabled");
        cy.get("#s-nextbutton").should("not.be.disabled");

        cy.get("#s-prevbutton").click();
        cy.get("#sv").should("have.text", "0");
        cy.get("#s").should("have.value", "0");
        cy.get("#s-prevbutton").should("be.disabled");
        cy.get("#s-nextbutton").should("not.be.disabled");

        cy.get("#s-datalist option:nth-child(11)").click();
        cy.get("#sv").should("have.text", "10");
        cy.get("#s").should("have.value", "10");
        cy.get("#s-prevbutton").should("not.be.disabled");
        cy.get("#s-nextbutton").should("be.disabled");
        cy.get("#s-prevbutton").click();

        cy.get("#sv").should("have.text", "9");
        cy.get("#s").should("have.value", "9");
        cy.get("#s-prevbutton").should("not.be.disabled");
        cy.get("#s-nextbutton").should("not.be.disabled");
    });

    it("slider handle snaps to core-constrained on mouseup", () => {
        // Regression: s2 is bound to s1 (step=2), so Core forces both sliders
        // onto even numbers. When the user drags s2's handle to an odd index,
        // Core rounds to the nearest even value. During drag we keep optimistic
        // handle position and snap to Core-constrained value on mouseup.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <slider name="s1" step="2"><label><m>s_1</m></label></slider>
  <slider name="s2" step="1" bindValueTo="$s1"><label><m>s_2</m></label></slider>
  <p>s1 value: <number name="sv1">$s1</number></p>
  <p>s2 value: <number name="sv2">$s2</number></p>
    `,
                },
                "*",
            );
        });

        // Initial state: both sliders at value 0
        cy.get("#sv1").should("have.text", "0");
        cy.get("#sv2").should("have.text", "0");
        // s1: step=2, from=0 to 10 → values 0,2,4,6,8,10 (6 items); index 0 = value 0
        cy.get("#s1").should("have.value", "0");
        // s2: step=1, from=0 to 10 → 11 items; index 0 = value 0
        cy.get("#s2").should("have.value", "0");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s1")].stateValues.value,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("s2")].stateValues.value,
            ).eq(0);
        });

        cy.log(
            "drag s2 handle to index 5 (value 5); core rounds both sliders up to 6",
        );
        // s2 index 5 = value 5. Core finds nearest even for s1: round((5-0)/2)=3
        // → s1 value = 6. s2 is bound to s1, so s2 value also becomes 6.
        // The handle should remain optimistic (index 5) while dragging.
        cy.get("#s2").trigger("mousedown");
        cy.get("#s2").invoke("val", 5).trigger("input");

        cy.get("#sv1").should("have.text", "6");
        cy.get("#sv2").should("have.text", "6");

        // s1: index 3 corresponds to value 6 in the 0,2,4,6,8,10 sequence
        cy.get("#s1").should("have.value", "3");
        // While transient drag is active, the displayed handle index remains optimistic.
        cy.get("#s2").should("have.value", "5");

        cy.get("#s2").trigger("mouseup");

        // s2: index 6 corresponds to value 6 in the 0..10 step-1 sequence
        // and should only snap at mouseup.
        cy.get("#s2").should("have.value", "6");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s1")].stateValues.value,
            ).eq(6);
            expect(
                stateVariables[await win.resolvePath1("s2")].stateValues.value,
            ).eq(6);
        });
    });
});
