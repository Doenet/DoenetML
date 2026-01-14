import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("BooleanInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("boolean input as toggle button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><booleanInput name="atb" >
      <label>As Toggle</label>
    </booleanInput></p>
    <p><booleanInput name="bi" asToggleButton="$atb">
      <label>hello</label>
    </booleanInput></p>

    <boolean extend="$bi.value" name="v1" />
    <boolean extend="$v1" name="v2" />
    `,
                },
                "*",
            );
        });

        cy.log("Test values displayed in browser");

        cy.get(cesc("#atb_input")).should("not.be.checked");
        cy.get(cesc("#bi_input")).should("not.be.checked");
        cy.get(cesc("#v1")).should("have.text", "false");
        cy.get(cesc("#v2")).should("have.text", "false");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v1")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v2")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.label,
            ).eq("As Toggle");
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.label,
            ).eq("hello");
        });

        cy.log("check the box");
        cy.get(cesc("#bi")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#atb_input")).should("not.be.checked");
        cy.get(cesc("#bi_input")).should("be.checked");
        cy.get(cesc("#v1")).should("have.text", "true");
        cy.get(cesc("#v2")).should("have.text", "true");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("v1")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("v2")].stateValues.value,
            ).eq(true);
        });

        cy.log("set as toggle button");
        cy.get(cesc("#atb")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#bi_input')).should('be.checked');
        cy.get(cesc("#v1")).should("have.text", "true");
        cy.get(cesc("#v2")).should("have.text", "true");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("v1")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("v2")].stateValues.value,
            ).eq(true);
        });

        cy.log("turn off via toggle button");
        cy.get(cesc("#bi_input")).click({ force: true });

        cy.log("Test values displayed in browser");
        cy.get(cesc("#atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#bi_input')).should('not.be.checked');
        cy.get(cesc("#v1")).should("have.text", "false");
        cy.get(cesc("#v2")).should("have.text", "false");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v1")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v2")].stateValues.value,
            ).eq(false);
        });

        cy.log("turn on via toggle button");
        cy.get(cesc("#bi_input")).click({ force: true });

        cy.log("Test values displayed in browser");
        cy.get(cesc("#atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#bi_input')).should('be.checked');
        cy.get(cesc("#v1")).should("have.text", "true");
        cy.get(cesc("#v2")).should("have.text", "true");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("v1")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("v2")].stateValues.value,
            ).eq(true);
        });
    });

    it("boolean input with math in label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><booleanInput name="atb" ><label name="label1">It is <m>\\int_a^b f(x)\\,dx</m></label></booleanInput></p>
    <p><booleanInput name="bi" asToggleButton="$atb"><label name="label2">Hello <math>a/b</math></label></booleanInput></p>

    <boolean extend="$atb.value" name="v" />

    <p><updateValue target="$label1.hide" newValue="!$label1.hide" type="boolean" name="toggleLabels"><label>Toggle labels</label></updateValue>
    <updateValue triggerWith="$toggleLabels" target="$label2.hide" newValue="!$label2.hide" type="boolean" /></p>
    `,
                },
                "*",
            );
        });

        cy.log("Test values displayed in browser");

        cy.get(cesc("#atb_input")).should("not.be.checked");
        cy.get(cesc("#bi_input")).should("not.be.checked");
        cy.get(cesc("#v")).should("have.text", "false");
        cy.get(cesc("#atb")).should(
            "contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get(cesc("#bi")).should(
            "contain.text",
            `Hello ${toMathJaxString(`ab`, { noInvisibleTimes: true })}`,
        );

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.label,
            ).eq("It is \\(\\int_a^b f(x)\\,dx\\)");
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.label,
            ).eq("Hello \\(\\frac{a}{b}\\)");
        });

        cy.log("set as toggle button");
        cy.get(cesc("#atb") + " .checkmark").click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#v")).should("have.text", "true");
        cy.get(cesc("#atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#bi_input')).should('be.checked');
        cy.get(cesc("#atb")).should(
            "contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get(cesc("#bi")).should(
            "contain.text",
            `Hello ${toMathJaxString(`ab`, { noInvisibleTimes: true })}`,
        );

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.label,
            ).eq("It is \\(\\int_a^b f(x)\\,dx\\)");
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.label,
            ).eq("Hello \\(\\frac{a}{b}\\)");
        });

        cy.log("hide labels");
        cy.get(cesc("#toggleLabels")).click();

        cy.get(cesc("#atb")).should(
            "not.contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get(cesc("#bi")).should(
            "not.contain.text",
            `Hello ${toMathJaxString(`ab`, { noInvisibleTimes: true })}`,
        );

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.label,
            ).eq("");
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.label,
            ).eq("");
        });

        cy.log("show labels again");
        cy.get(cesc("#toggleLabels")).click();

        cy.get(cesc("#atb")).should(
            "contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get(cesc("#bi")).should(
            "contain.text",
            `Hello ${toMathJaxString(`ab`, { noInvisibleTimes: true })}`,
        );

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("atb")].stateValues.label,
            ).eq("It is \\(\\int_a^b f(x)\\,dx\\)");
            expect(
                stateVariables[await win.resolvePath1("bi")].stateValues.label,
            ).eq("Hello \\(\\frac{a}{b}\\)");
        });
    });

    it("boolean input with labelIsName", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><booleanInput name="asToggleButton" labelIsName /></p>
    <p><booleanInput name="AnotherInput" asToggleButton="$asToggleButton" labelIsName /></p>

    <boolean extend="$asToggleButton" name="v" />
    `,
                },
                "*",
            );
        });

        cy.log("Test values displayed in browser");

        cy.get(cesc("#asToggleButton_input")).should("not.be.checked");
        cy.get(cesc("#AnotherInput_input")).should("not.be.checked");
        cy.get(cesc("#v")).should("have.text", "false");
        cy.get(cesc("#asToggleButton")).should(
            "contain.text",
            "as toggle button",
        );
        cy.get(cesc("#AnotherInput")).should("contain.text", "Another Input");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("asToggleButton")]
                    .stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("AnotherInput")]
                    .stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v")].stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("asToggleButton")]
                    .stateValues.label,
            ).eq("as toggle button");
            expect(
                stateVariables[await win.resolvePath1("AnotherInput")]
                    .stateValues.label,
            ).eq("Another Input");
        });

        cy.log("set as toggle button");
        cy.get(cesc("#asToggleButton")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#v")).should("have.text", "true");
        cy.get(cesc("#asToggleButton_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#AnotherInput_input')).should('be.checked');
        cy.get(cesc("#asToggleButton")).should(
            "contain.text",
            "as toggle button",
        );
        cy.get(cesc("#AnotherInput")).should("contain.text", "Another Input");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("asToggleButton")]
                    .stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("AnotherInput")]
                    .stateValues.value,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("v")].stateValues.value,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("asToggleButton")]
                    .stateValues.label,
            ).eq("as toggle button");
            expect(
                stateVariables[await win.resolvePath1("AnotherInput")]
                    .stateValues.label,
            ).eq("Another Input");
        });
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="bi">
        <shortDescription>Click</shortDescription>
        <description>
            <p>Click when you like.</p>
        </description>
    </booleanInput>

    `,
                },
                "*",
            );
        });

        cy.get("#bi [data-test='Description Button']").should("be.visible");
        cy.get("#bi [data-test='Description']").should("not.be.visible");

        cy.get("#bi_input").should(
            "have.attr",
            "aria-details",
            `bi-description-content`,
        );
        cy.get(`#bi-description-content`).should(
            "contain.text",
            "Click when you like.",
        );

        cy.get("#bi [data-test='Description Button']").click();

        cy.get("#bi [data-test='Description']").should(
            "contain.text",
            "Click when you like.",
        );

        cy.get("#bi input").focus();
        cy.get("#bi [data-test='Description']").should("not.be.visible");
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="bi">
        <shortDescription>Click</shortDescription>
    </booleanInput>

    `,
                },
                "*",
            );
        });

        cy.get("#bi").should("be.visible");
        cy.get("#bi [data-test='Description Button']").should("not.exist");
        cy.get("#bi [data-test='Description']").should("not.exist");
        cy.get("#bi_input").should("not.have.attr", "aria-details");
    });
});
