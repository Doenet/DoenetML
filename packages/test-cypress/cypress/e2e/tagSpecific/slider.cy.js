import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Slider Tag Tests", function () {
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

        cy.get(cesc("#sv")).should("have.text", "1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let slider1value =
                stateVariables[await win.resolvePath1("s")].stateValues.value;
            expect(slider1value).eq(1);
        });

        cy.log("move handle less than half way, stays at 1");
        cy.get(cesc("#s-handle"))
            .trigger("mousedown")
            .trigger("mousemove", { clientX: 140, clientY: 0 })
            .trigger("mouseup");

        cy.get(cesc("#sv")).should("have.text", "1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let slider1value =
                stateVariables[await win.resolvePath1("s")].stateValues.value;
            expect(slider1value).eq(1);
        });

        cy.log("move handle past halfway, goes to 2");
        cy.get(cesc("#s-handle"))
            .trigger("mousedown")
            .trigger("mousemove", { clientX: 180, clientY: 0 })
            .trigger("mouseup");

        cy.get(cesc("#sv")).should("have.text", "2");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let slider1value =
                stateVariables[await win.resolvePath1("s")].stateValues.value;
            expect(slider1value).eq(2);
        });

        cy.log("clicking at left of sliders moves it to 1");
        cy.get(cesc("#s")).click("left");

        cy.get(cesc("#sv")).should("have.text", "1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let slider1value =
                stateVariables[await win.resolvePath1("s")].stateValues.value;
            expect(slider1value).eq(1);
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

        let numberToPx = (x) => 20 + 30 * x;
        let numberToPx2 = (x) => 30 * x;

        cy.get(cesc("#sv")).should("have.text", "0");

        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "0");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
            });

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
        cy.get(cesc("#s-handle"))
            .trigger("mousedown")
            .trigger("mousemove", { clientX: numberToPx(1), clientY: 0 })
            .trigger("mouseup");

        cy.get(cesc("#sv")).should("have.text", "1");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "1");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
            });

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
        cy.get(cesc("#s-handle"))
            .trigger("mousedown")
            .trigger("mousemove", { clientX: numberToPx(9), clientY: 0 })
            .trigger("mouseup");

        cy.get(cesc("#sv")).should("have.text", "9");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "9");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("9");
            });

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

        cy.get(cesc("#mi") + " textarea").type("{end}{backspace}2.5{enter}", {
            force: true,
        });

        cy.get(cesc("#sv")).should("have.text", "3");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "3");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
            });

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

        cy.get(cesc("#mi") + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}x{enter}",
            { force: true },
        );
        // use booleanInput to wait, since above has no effect
        cy.get(cesc("#bi")).click();
        cy.get(cesc("#b")).should("have.text", "true");

        cy.get(cesc("#sv")).should("have.text", "3");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "3");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
            });

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
        cy.get(cesc("#doc"))
            .trigger("mousedown", numberToPx2(3), 50)
            .trigger("mousemove", numberToPx2(25), 400, { force: true })
            .trigger("mouseup");

        cy.get(cesc("#sv")).should("have.text", "10");
        cy.get(cesc("#mi") + " .mq-editable-field").should(
            "contain.text",
            "10",
        );
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                    "10",
                );
            });

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

        cy.log("hold down mouse at 6");
        cy.get(cesc("#doc")).trigger("mousedown", numberToPx2(6), 50);

        cy.get(cesc("#sv")).should("have.text", "6");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "6");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("6");
            });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(6);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(6);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(6);
        });

        cy.log("drag to 2, but above slider");
        cy.get(cesc("#doc")).trigger("mousemove", numberToPx2(2), 0);

        cy.get(cesc("#sv")).should("have.text", "2");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "2");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
            });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(2);
        });

        cy.log("drag past left edge and below slider");
        cy.get(cesc("#doc")).trigger("mousemove", numberToPx2(-1), 200, {
            force: true,
        });

        cy.get(cesc("#sv")).should("have.text", "0");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "0");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
            });

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

        cy.log("drag to 7, but below slider");
        cy.get(cesc("#doc")).trigger("mousemove", numberToPx2(7), 300, {
            force: true,
        });

        cy.get(cesc("#sv")).should("have.text", "7");
        cy.get(cesc("#mi") + " .mq-editable-field").should("contain.text", "7");
        cy.get(cesc("#mi") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
            });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("s")].stateValues.value,
            ).eq(7);
            expect(
                stateVariables[await win.resolvePath1("sv")].stateValues.value,
            ).eq(7);
            expect(
                stateVariables[await win.resolvePath1("mi")].stateValues.value,
            ).eq(7);
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

        let numberToPx = (x) => 20 + 30 * x;
        let numberToPx2 = (x) => 30 * x;

        cy.get(cesc("#sv")).should("have.text", "0");

        cy.get(cesc("#s-label")).should(
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
        cy.get(cesc("#s-handle"))
            .trigger("mousedown")
            .trigger("mousemove", { clientX: numberToPx(1), clientY: 0 })
            .trigger("mouseup");

        cy.get(cesc("#sv")).should("have.text", "1");

        cy.get(cesc("#s-label")).should(
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
});
