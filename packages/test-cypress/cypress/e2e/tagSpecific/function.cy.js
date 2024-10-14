import { cesc } from "@doenet/utils";

describe("Function Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("style description changes with theme", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <function name="A" styleNumber="1" labelIsName>x^2</function>
      <function name="B" styleNumber="2" labelIsName>x^2+2</function>
      <function name="C" styleNumber="5" labelIsName>x^2+4</function>
    </graph>
    <p name="Adescrip">Function A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Function A is thick brown.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a dark red function.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin black function.",
        );

        cy.log("set dark mode");
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_darkMode").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Function A is thick yellow.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a light red function.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin white function.",
        );
    });
});
