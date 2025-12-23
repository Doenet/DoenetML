import { cesc } from "@doenet/utils";

describe("TextInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("expanded textInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <textInput name="ti" expanded />

    <p name="p1">$ti</p>
    <p name="p2">$(ti.immediateValue)</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#ti_input")).type("hello");
        cy.get(cesc("#ti_input")).should("have.value", "hello");
        cy.get(cesc("#p2")).should("have.text", "hello");
        cy.get(cesc("#p1")).should("have.text", "");

        cy.get(cesc("#ti_input")).blur();
        cy.get(cesc("#ti_input")).should("have.value", "hello");
        cy.get(cesc("#p2")).should("have.text", "hello");
        cy.get(cesc("#p1")).should("have.text", "hello");

        cy.get(cesc("#ti_input")).type("{enter}bye{enter}");
        cy.get(cesc("#ti_input")).should("have.value", "hello\nbye\n");
        cy.get(cesc("#p2")).should("have.text", "hello\nbye\n");
        cy.get(cesc("#p1")).should("have.text", "hello\nbye");

        cy.get(cesc("#ti_input")).blur();
        cy.get(cesc("#ti_input")).should("have.value", "hello\nbye\n");
        cy.get(cesc("#p2")).should("have.text", "hello\nbye\n");
        cy.get(cesc("#p1")).should("have.text", "hello\nbye\n");

        cy.get(cesc("#ti_input")).type("{moveToStart}new{enter}old{enter}");
        cy.get(cesc("#ti_input")).should(
            "have.value",
            "new\nold\nhello\nbye\n",
        );
        cy.get(cesc("#p2")).should("have.text", "new\nold\nhello\nbye\n");
        cy.get(cesc("#p1")).should("have.text", "new\noldhello\nbye\n");

        cy.get(cesc("#ti_input")).blur();
        cy.get(cesc("#ti_input")).should(
            "have.value",
            "new\nold\nhello\nbye\n",
        );
        cy.get(cesc("#p2")).should("have.text", "new\nold\nhello\nbye\n");
        cy.get(cesc("#p1")).should("have.text", "new\nold\nhello\nbye\n");
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><textInput name="ti" /></p>

    <p name="pv">value: $ti</p>
    <p name="piv">immediate value: $ti.immediateValue</p>
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

        cy.get(cesc("#ti_input")).type("hello");

        cy.get(cesc("#piv")).should("have.text", "immediate value: hello");
        cy.get(cesc("#pv")).should("have.text", "value: ");

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

        cy.get(cesc("#pv")).should("have.text", "value: hello");
        cy.get(cesc("#piv")).should("have.text", "immediate value: hello");
    });

    it("shadowed textInput's update is not ignored", () => {
        // Check for a bug where the renderer of a shadowed text input did not update correctly
        // as its update was incorrectly being ignored.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <graph>
        <point name="A" labelIsName />
        </graph>
        <graph>
        <point extend="$A" name="B" />
        </graph>

        <p><textInput name="tiA">$A.label</textInput></p>
        <p><textInput name="tiB">$B.label</textInput></p>
        <label name="labelA" extend="$A.label" />
        <label name="labelB" extend="$B.label" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#tiA_input")).should("have.value", "A");
        cy.get(cesc("#tiB_input")).should("have.value", "A");
        cy.get(cesc("#labelA")).should("have.text", "A");
        cy.get(cesc("#labelB")).should("have.text", "A");

        cy.get(cesc("#tiA_input")).type("B");
        cy.get(cesc("#tiA_input")).should("have.value", "AB");
        cy.get(cesc("#tiB_input")).should("have.value", "A");
        cy.get(cesc("#labelA")).should("have.text", "A");
        cy.get(cesc("#labelB")).should("have.text", "A");

        cy.get(cesc("#tiA_input")).blur();
        cy.get(cesc("#tiB_input")).should("have.value", "AB");
        cy.get(cesc("#tiA_input")).should("have.value", "AB");
        cy.get(cesc("#labelA")).should("have.text", "AB");
        cy.get(cesc("#labelB")).should("have.text", "AB");

        cy.get(cesc("#tiB_input")).type("C");
        cy.get(cesc("#tiB_input")).should("have.value", "ABC");
        cy.get(cesc("#tiA_input")).should("have.value", "AB");
        cy.get(cesc("#labelA")).should("have.text", "AB");
        cy.get(cesc("#labelB")).should("have.text", "AB");

        cy.get(cesc("#tiB_input")).blur();
        cy.get(cesc("#tiA_input")).should("have.value", "ABC");
        cy.get(cesc("#tiB_input")).should("have.value", "ABC");
        cy.get(cesc("#labelA")).should("have.text", "ABC");
        cy.get(cesc("#labelB")).should("have.text", "ABC");
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <textInput name="ti">
        <shortDescription>Enter something</shortDescription>
        <description>
            <p>Type what you like.</p>
        </description>
    </textInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ti [data-test='Description Button']").should("be.visible");
        cy.get("#ti [data-test='Description']").should("not.be.visible");

        cy.get("#ti_input").should(
            "have.attr",
            "aria-details",
            `ti-description-content`,
        );
        cy.get(`#ti-description-content`).should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#ti [data-test='Description Button']").click();

        cy.get("#ti [data-test='Description']").should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#ti_input").focus();
        cy.get("#ti [data-test='Description']").should("not.be.visible");
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <textInput name="ti">
        <shortDescription>Enter something</shortDescription>
    </textInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ti").should("be.visible");
        cy.get("#ti [data-test='Description Button']").should("not.exist");
        cy.get("#ti [data-test='Description']").should("not.exist");
        cy.get("#ti_input").should("not.have.attr", "aria-details");
    });
});
