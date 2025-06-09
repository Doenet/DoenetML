import { cesc } from "@doenet/utils";

function cesc2(s) {
    return cesc(cesc(s));
}

describe("TextInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("expanded textinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <textinput name="ti" expanded />

    <p>$ti</p>
    <p>$(ti.immediateValue)</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.get(cesc("#\\/ti_input")).type("hello");
        cy.get(cesc("#\\/ti_input")).should("have.value", "hello");
        cy.get(cesc("#\\/_p2")).should("have.text", "hello");
        cy.get(cesc("#\\/_p1")).should("have.text", "");

        cy.get(cesc("#\\/ti_input")).blur();
        cy.get(cesc("#\\/ti_input")).should("have.value", "hello");
        cy.get(cesc("#\\/_p2")).should("have.text", "hello");
        cy.get(cesc("#\\/_p1")).should("have.text", "hello");

        cy.get(cesc("#\\/ti_input")).type("{enter}bye{enter}");
        cy.get(cesc("#\\/ti_input")).should("have.value", "hello\nbye\n");
        cy.get(cesc("#\\/_p2")).should("have.text", "hello\nbye\n");
        cy.get(cesc("#\\/_p1")).should("have.text", "hello\nbye");

        cy.get(cesc("#\\/ti_input")).blur();
        cy.get(cesc("#\\/ti_input")).should("have.value", "hello\nbye\n");
        cy.get(cesc("#\\/_p2")).should("have.text", "hello\nbye\n");
        cy.get(cesc("#\\/_p1")).should("have.text", "hello\nbye\n");

        cy.get(cesc("#\\/ti_input")).type("{moveToStart}new{enter}old{enter}");
        cy.get(cesc("#\\/ti_input")).should(
            "have.value",
            "new\nold\nhello\nbye\n",
        );
        cy.get(cesc("#\\/_p2")).should("have.text", "new\nold\nhello\nbye\n");
        cy.get(cesc("#\\/_p1")).should("have.text", "new\noldhello\nbye\n");

        cy.get(cesc("#\\/ti_input")).blur();
        cy.get(cesc("#\\/ti_input")).should(
            "have.value",
            "new\nold\nhello\nbye\n",
        );
        cy.get(cesc("#\\/_p2")).should("have.text", "new\nold\nhello\nbye\n");
        cy.get(cesc("#\\/_p1")).should("have.text", "new\nold\nhello\nbye\n");
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><textinput name="ti" /></p>

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

        cy.get(cesc("#\\/ti_input")).type("hello");

        cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
        cy.get(cesc("#\\/pv")).should("have.text", "value: ");

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

        cy.get(cesc("#\\/pv")).should("have.text", "value: hello");
        cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
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
        <point copySource="A" name="B" />
        </graph>

        <p><textInput name="tiA">$A.label</textInput></p>
        <p><textInput name="tiB">$B.label</textInput></p>
        <label name="labelA" copySource="A.label" />
        <label name="labelB" copySource="B.label" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/tiA_input")).should("have.value", "A");
        cy.get(cesc("#\\/tiB_input")).should("have.value", "A");
        cy.get(cesc("#\\/labelA")).should("have.text", "A");
        cy.get(cesc("#\\/labelB")).should("have.text", "A");

        cy.get(cesc("#\\/tiA_input")).type("B");
        cy.get(cesc("#\\/tiA_input")).should("have.value", "AB");
        cy.get(cesc("#\\/tiB_input")).should("have.value", "A");
        cy.get(cesc("#\\/labelA")).should("have.text", "A");
        cy.get(cesc("#\\/labelB")).should("have.text", "A");

        cy.get(cesc("#\\/tiA_input")).blur();
        cy.get(cesc("#\\/tiB_input")).should("have.value", "AB");
        cy.get(cesc("#\\/tiA_input")).should("have.value", "AB");
        cy.get(cesc("#\\/labelA")).should("have.text", "AB");
        cy.get(cesc("#\\/labelB")).should("have.text", "AB");

        cy.get(cesc("#\\/tiB_input")).type("C");
        cy.get(cesc("#\\/tiB_input")).should("have.value", "ABC");
        cy.get(cesc("#\\/tiA_input")).should("have.value", "AB");
        cy.get(cesc("#\\/labelA")).should("have.text", "AB");
        cy.get(cesc("#\\/labelB")).should("have.text", "AB");

        cy.get(cesc("#\\/tiB_input")).blur();
        cy.get(cesc("#\\/tiA_input")).should("have.value", "ABC");
        cy.get(cesc("#\\/tiB_input")).should("have.value", "ABC");
        cy.get(cesc("#\\/labelA")).should("have.text", "ABC");
        cy.get(cesc("#\\/labelB")).should("have.text", "ABC");
    });
});
