import { cesc } from "@doenet/utils";

describe("Polyline Tag Tests", function () {
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
    <polyline name="A" styleNumber="1" labelIsName vertices="(0,0) (0,2) (2,0)" />
    <polyline name="B" styleNumber="2" labelIsName vertices="(2,2) (2,4) (4,2)" />
    <polyline name="C" styleNumber="5" labelIsName vertices="(4,4) (4,6) (6,4)" />
    </graph>
    <p name="Adescrip">Polyline A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Polyline A is thick brown.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a dark red polyline.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin black polyline.",
        );

        cy.log("set dark mode");
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_darkMode").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Polyline A is thick yellow.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a light red polyline.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin white polyline.",
        );
    });
});
