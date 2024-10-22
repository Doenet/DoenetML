import { cesc, cesc2 } from "@doenet/utils";

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
    <text>a</text>
    <p><booleanInput name="atb" >
      <label>As Toggle</label>
    </booleaninput></p>
    <p><booleanInput name="bi" asToggleButton="$atb">
      <label>hello</label>
    </booleaninput></p>

    $bi.value{assignNames="v1"}
    $v1{name="v2"}
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test values displayed in browser");

        cy.get(cesc("#\\/atb_input")).should("not.be.checked");
        cy.get(cesc("#\\/bi_input")).should("not.be.checked");
        cy.get(cesc("#\\/v1")).should("have.text", "false");
        cy.get(cesc("#\\/v2")).should("have.text", "false");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(false);
            expect(stateVariables["/bi"].stateValues.value).eq(false);
            expect(stateVariables["/v1"].stateValues.value).eq(false);
            expect(stateVariables["/v2"].stateValues.value).eq(false);
            expect(stateVariables["/atb"].stateValues.label).eq("As Toggle");
            expect(stateVariables["/bi"].stateValues.label).eq("hello");
        });

        cy.log("check the box");
        cy.get(cesc("#\\/bi")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#\\/atb_input")).should("not.be.checked");
        cy.get(cesc("#\\/bi_input")).should("be.checked");
        cy.get(cesc("#\\/v1")).should("have.text", "true");
        cy.get(cesc("#\\/v2")).should("have.text", "true");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(false);
            expect(stateVariables["/bi"].stateValues.value).eq(true);
            expect(stateVariables["/v1"].stateValues.value).eq(true);
            expect(stateVariables["/v2"].stateValues.value).eq(true);
        });

        cy.log("set as toggle button");
        cy.get(cesc("#\\/atb")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#\\/atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#\\/bi_input')).should('be.checked');
        cy.get(cesc("#\\/v1")).should("have.text", "true");
        cy.get(cesc("#\\/v2")).should("have.text", "true");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(true);
            expect(stateVariables["/bi"].stateValues.value).eq(true);
            expect(stateVariables["/v1"].stateValues.value).eq(true);
            expect(stateVariables["/v2"].stateValues.value).eq(true);
        });

        cy.log("turn off via toggle button");
        cy.get(cesc("#\\/bi_input")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#\\/atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#\\/bi_input')).should('not.be.checked');
        cy.get(cesc("#\\/v1")).should("have.text", "false");
        cy.get(cesc("#\\/v2")).should("have.text", "false");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(true);
            expect(stateVariables["/bi"].stateValues.value).eq(false);
            expect(stateVariables["/v1"].stateValues.value).eq(false);
            expect(stateVariables["/v2"].stateValues.value).eq(false);
        });

        cy.log("turn on via toggle button");
        cy.get(cesc("#\\/bi_input")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#\\/atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#\\/bi_input')).should('be.checked');
        cy.get(cesc("#\\/v1")).should("have.text", "true");
        cy.get(cesc("#\\/v2")).should("have.text", "true");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(true);
            expect(stateVariables["/bi"].stateValues.value).eq(true);
            expect(stateVariables["/v1"].stateValues.value).eq(true);
            expect(stateVariables["/v2"].stateValues.value).eq(true);
        });
    });

    it("boolean input with math in label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <p><booleanInput name="atb" ><label>It is <m>\\int_a^b f(x)\\,dx</m></label></booleaninput></p>
    <p><booleanInput name="bi" asToggleButton="$atb"><label>Hello <math>a/b</math></label></booleaninput></p>

    $atb.value{assignNames="v"}

    <p><updateValue target="_label1.hide" newValue="!$_label1.hide" type="boolean" name="toggleLabels"><label>Toggle labels</label></updateValue>
    <updateValue triggerWith="toggleLabels" target="_label2.hide" newValue="!$_label2.hide" type="boolean" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test values displayed in browser");

        cy.get(cesc("#\\/atb_input")).should("not.be.checked");
        cy.get(cesc("#\\/bi_input")).should("not.be.checked");
        cy.get(cesc("#\\/v")).should("have.text", "false");
        cy.get(cesc("#\\/atb")).should("contain.text", "It is ∫baf(x)dx");
        cy.get(cesc("#\\/bi")).should("contain.text", "Hello ab");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(false);
            expect(stateVariables["/bi"].stateValues.value).eq(false);
            expect(stateVariables["/v"].stateValues.value).eq(false);
            expect(stateVariables["/atb"].stateValues.label).eq(
                "It is \\(\\int_a^b f(x)\\,dx\\)",
            );
            expect(stateVariables["/bi"].stateValues.label).eq(
                "Hello \\(\\frac{a}{b}\\)",
            );
        });

        cy.log("set as toggle button");
        cy.get(cesc("#\\/atb")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#\\/v")).should("have.text", "true");
        cy.get(cesc("#\\/atb_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#\\/bi_input')).should('be.checked');
        cy.get(cesc("#\\/atb")).should("contain.text", "It is ∫baf(x)dx");
        cy.get(cesc("#\\/bi")).should("contain.text", "Hello ab");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(true);
            expect(stateVariables["/bi"].stateValues.value).eq(false);
            expect(stateVariables["/v"].stateValues.value).eq(true);
            expect(stateVariables["/atb"].stateValues.label).eq(
                "It is \\(\\int_a^b f(x)\\,dx\\)",
            );
            expect(stateVariables["/bi"].stateValues.label).eq(
                "Hello \\(\\frac{a}{b}\\)",
            );
        });

        cy.log("hide labels");
        cy.get(cesc2("#/toggleLabels")).click();

        cy.get(cesc("#\\/atb")).should("not.contain.text", "It is ∫baf(x)dx");
        cy.get(cesc("#\\/bi")).should("not.contain.text", "Hello ab");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(true);
            expect(stateVariables["/bi"].stateValues.value).eq(false);
            expect(stateVariables["/v"].stateValues.value).eq(true);
            expect(stateVariables["/atb"].stateValues.label).eq("");
            expect(stateVariables["/bi"].stateValues.label).eq("");
        });

        cy.log("show labels again");
        cy.get(cesc2("#/toggleLabels")).click();

        cy.get(cesc("#\\/atb")).should("contain.text", "It is ∫baf(x)dx");
        cy.get(cesc("#\\/bi")).should("contain.text", "Hello ab");

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/atb"].stateValues.value).eq(true);
            expect(stateVariables["/bi"].stateValues.value).eq(false);
            expect(stateVariables["/v"].stateValues.value).eq(true);
            expect(stateVariables["/atb"].stateValues.label).eq(
                "It is \\(\\int_a^b f(x)\\,dx\\)",
            );
            expect(stateVariables["/bi"].stateValues.label).eq(
                "Hello \\(\\frac{a}{b}\\)",
            );
        });
    });

    it("boolean input with labelIsName", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <p><booleanInput name="asToggleButton" labelIsName /></p>
    <p><booleanInput name="AnotherInput" asToggleButton="$asToggleButton" labelIsName /></p>

    <boolean copySource="asToggleButton" name="v" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test values displayed in browser");

        cy.get(cesc("#\\/asToggleButton_input")).should("not.be.checked");
        cy.get(cesc("#\\/AnotherInput_input")).should("not.be.checked");
        cy.get(cesc("#\\/v")).should("have.text", "false");
        cy.get(cesc("#\\/asToggleButton")).should(
            "contain.text",
            "as toggle button",
        );
        cy.get(cesc("#\\/AnotherInput")).should(
            "contain.text",
            "Another Input",
        );

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/asToggleButton"].stateValues.value).eq(
                false,
            );
            expect(stateVariables["/AnotherInput"].stateValues.value).eq(false);
            expect(stateVariables["/v"].stateValues.value).eq(false);
            expect(stateVariables["/asToggleButton"].stateValues.label).eq(
                "as toggle button",
            );
            expect(stateVariables["/AnotherInput"].stateValues.label).eq(
                "Another Input",
            );
        });

        cy.log("set as toggle button");
        cy.get(cesc("#\\/asToggleButton")).click();

        cy.log("Test values displayed in browser");
        cy.get(cesc("#\\/v")).should("have.text", "true");
        cy.get(cesc("#\\/asToggleButton_input")).should("be.checked");
        // TODO: how to check the renderer if ToggleButton is selected
        //cy.get(cesc('#\\/AnotherInput_input')).should('be.checked');
        cy.get(cesc("#\\/asToggleButton")).should(
            "contain.text",
            "as toggle button",
        );
        cy.get(cesc("#\\/AnotherInput")).should(
            "contain.text",
            "Another Input",
        );

        cy.log("Test internal values are set to the correct values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/asToggleButton"].stateValues.value).eq(
                true,
            );
            expect(stateVariables["/AnotherInput"].stateValues.value).eq(false);
            expect(stateVariables["/v"].stateValues.value).eq(true);
            expect(stateVariables["/asToggleButton"].stateValues.label).eq(
                "as toggle button",
            );
            expect(stateVariables["/AnotherInput"].stateValues.label).eq(
                "Another Input",
            );
        });
    });
});
