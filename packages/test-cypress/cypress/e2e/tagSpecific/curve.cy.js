import { cesc } from "@doenet/utils";

describe("Curve Tag Tests", function () {
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
      <curve name="A" styleNumber="1" labelIsName through="(0,0) (0,2) (2,0)" />
      <curve name="B" styleNumber="2" labelIsName through="(2,2) (2,4) (4,2)" />
      <curve name="C" styleNumber="5" labelIsName through="(4,4) (4,6) (6,4)" />
    </graph>
    <p name="Adescrip">Curve A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Curve A is thick brown.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a dark red curve.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin black curve.",
        );

        cy.log("set dark mode");
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_darkMode").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Curve A is thick yellow.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a light red curve.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin white curve.",
        );
    });
});
