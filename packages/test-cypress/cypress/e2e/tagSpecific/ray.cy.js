import me from "math-expressions";
import { cesc, cesc2 } from "@doenet/utils";

describe("Ray Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("style description changes with theme", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <ray name="A" styleNumber="1" labelIsName endpoint="(0,0)" through="(1,2)" />
      <ray name="B" styleNumber="2" labelIsName endpoint="(2,2)" through="(3,4)" />
      <ray name="C" styleNumber="5" labelIsName endpoint="(4,4)" through="(5,6)" />
    </graph>
    <p name="Adescrip">Ray A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
        });

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Ray A is thick brown.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a dark red ray.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin black ray.",
        );

        // set dark mode
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_darkMode").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Ray A is thick yellow.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a light red ray.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a thin white ray.",
        );
    });
});
