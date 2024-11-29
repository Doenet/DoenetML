import me from "math-expressions";
import { cesc, cesc2 } from "@doenet/utils";

describe("Vector Tag Tests", function () {
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
      <vector name="A" styleNumber="1" labelIsName tail="(0,0)" head="(1,2)" />
      <vector name="B" styleNumber="2" labelIsName tail="(2,2)" head="(3,4)" />
      <vector name="C" styleNumber="5" labelIsName tail="(4,4)" head="(5,6)" />
    </graph>
    <p name="Adescrip">Vector A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Vector A is thick brown.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a dark red vector.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin black vector.",
        );

        cy.log("set dark mode");
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_darkMode").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Vector A is thick yellow.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a light red vector.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin white vector.",
        );
    });
});
