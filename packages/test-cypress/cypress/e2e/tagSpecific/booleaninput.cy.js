import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("BooleanInput Tag Tests", { tags: ["@group3"] }, function () {
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

        cy.get("#atb_input").should("not.be.checked");
        cy.get("#bi_input").should("not.be.checked");
        cy.get("#v1").should("have.text", "false");
        cy.get("#v2").should("have.text", "false");

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
        cy.get("#bi").click();

        cy.log("Test values displayed in browser");
        cy.get("#atb_input").should("not.be.checked");
        cy.get("#bi_input").should("be.checked");
        cy.get("#v1").should("have.text", "true");
        cy.get("#v2").should("have.text", "true");

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
        cy.get("#atb").click();

        cy.log("Test values displayed in browser");
        cy.get("#atb_input").should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(('#bi_input')).should('be.checked');
        cy.get("#v1").should("have.text", "true");
        cy.get("#v2").should("have.text", "true");

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
        cy.get("#bi_input").click({ force: true });

        cy.log("Test values displayed in browser");
        cy.get("#atb_input").should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(('#bi_input')).should('not.be.checked');
        cy.get("#v1").should("have.text", "false");
        cy.get("#v2").should("have.text", "false");

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
        cy.get("#bi_input").click({ force: true });

        cy.log("Test values displayed in browser");
        cy.get("#atb_input").should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(('#bi_input')).should('be.checked');
        cy.get("#v1").should("have.text", "true");
        cy.get("#v2").should("have.text", "true");

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

        cy.get("#atb_input").should("not.be.checked");
        cy.get("#bi_input").should("not.be.checked");
        cy.get("#v").should("have.text", "false");
        cy.get("#atb").should(
            "contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get("#bi").should(
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
        cy.get("#atb" + " .checkmark").click();

        cy.log("Test values displayed in browser");
        cy.get("#v").should("have.text", "true");
        cy.get("#atb_input").should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(('#bi_input')).should('be.checked');
        cy.get("#atb").should(
            "contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get("#bi").should(
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
        cy.get("#toggleLabels").click();

        cy.get("#atb").should(
            "not.contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get("#bi").should(
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
        cy.get("#toggleLabels").click();

        cy.get("#atb").should(
            "contain.text",
            `It is ${toMathJaxString(`∫baf⁡(x) dx`, { noInvisibleTimes: true })}`,
        );
        cy.get("#bi").should(
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

        cy.get("#asToggleButton_input").should("not.be.checked");
        cy.get("#AnotherInput_input").should("not.be.checked");
        cy.get("#v").should("have.text", "false");
        cy.get("#asToggleButton").should("contain.text", "as toggle button");
        cy.get("#AnotherInput").should("contain.text", "Another Input");

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
        cy.get("#asToggleButton").click();

        cy.log("Test values displayed in browser");
        cy.get("#v").should("have.text", "true");
        cy.get("#asToggleButton_input").should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(('#AnotherInput_input')).should('be.checked');
        cy.get("#asToggleButton").should("contain.text", "as toggle button");
        cy.get("#AnotherInput").should("contain.text", "Another Input");

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

    it("labelPosition left and right", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Left label:
    <booleanInput name="bl" labelPosition="left">
      <label>left</label>
    </booleanInput>
    </p>
    
    <p>Right label:
    <booleanInput name="br" labelPosition="right">
      <label>right</label>
    </booleanInput>
    </p>
                    `,
                },
                "*",
            );
        });

        cy.log("Test left: label before checkbox");
        cy.get("#bl").children().eq(0).should("have.attr", "id", "bl-label");

        cy.log(
            "Test right: label after checkbox (and checkWork/description if present)",
        );
        cy.get("#br").children().last().should("have.attr", "id", "br-label");
    });

    it("focused state variable updates on focus and blur", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><booleanInput name="bi">
      <label>hello</label>
    </booleanInput></p>
    <p name="fv">focused: <boolean extend="$bi.focused" /></p>
    `,
                },
                "*",
            );
        });

        cy.get("#fv").should("have.text", "focused: false");

        cy.log("Focus the checkbox: focused becomes true");
        cy.get("#bi_input").focus();
        cy.get("#fv").should("have.text", "focused: true");

        cy.log("Blur the checkbox: focused becomes false");
        cy.get("#bi_input").blur();
        cy.get("#fv").should("have.text", "focused: false");
    });

    it("clicking container span focuses checkbox input", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><booleanInput name="bi">
      <label>hello</label>
    </booleanInput></p>
    <p name="fv">focused: <boolean extend="$bi.focused" /></p>
    `,
                },
                "*",
            );
        });

        cy.get("#fv").should("have.text", "focused: false");

        cy.log(
            "Click the checkmark span (not the native input): input gets focus",
        );
        cy.get("#bi-container .checkmark").click();
        cy.get("#bi_input").should("be.focused");
        cy.get("#fv").should("have.text", "focused: true");
    });
});
