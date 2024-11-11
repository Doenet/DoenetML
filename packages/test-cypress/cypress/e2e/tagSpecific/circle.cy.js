import { cesc, cesc2 } from "@doenet/utils";

function nInDOM(n) {
    if (n < 0) {
        return `−${Math.abs(n)}`;
    } else {
        return String(n);
    }
}

describe("Circle Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("reload essential center from database", () => {
        let doenetML = `
    <text>a</text>
    <graph>
      <circle name="circ" />
    </graph>
    <mathinput bindvalueTo="$(circ.radius)" name="r" />
    <p>radius: $circ.radius{assignNames="r2"}</p>
    <p>Center: $circ.center{assignNames="c"}</p>
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

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
                0, 0,
            ]);
            expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
            cy.get(cesc(`#\\/r2`) + ` .mjx-mrow`).should("contain.text", "1");
        });

        cy.log(`move circle`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "moveCircle",
                componentName: "/circ",
                args: { center: [-7, 2] },
            });

            cy.get(cesc(`#\\/r2`) + ` .mjx-mrow`).should("contain.text", "1");
            cy.get(cesc(`#\\/c`) + ` .mjx-mrow`).should(
                "contain.text",
                `(${nInDOM(-7)},${nInDOM(2)})`,
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/circ"].stateValues.numericalCenter,
                ).eqls([-7, 2]);
                expect(stateVariables["/circ"].stateValues.numericalRadius).eq(
                    1,
                );
            });
        });

        cy.log("change radius");
        cy.get(cesc("#\\/r") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc(`#\\/r`) + ` .mq-editable-field`).should(
            "contain.text",
            "3",
        );
        cy.get(cesc(`#\\/r2`) + ` .mjx-mrow`).should("contain.text", "3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
                -7, 2,
            ]);
            expect(stateVariables["/circ"].stateValues.numericalRadius).eq(3);
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables["/circ"];
            }),
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
                -7, 2,
            ]);
            expect(stateVariables["/circ"].stateValues.numericalRadius).eq(3);
        });
    });

    it("style description changes with theme", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" fillColor="brown" fillColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" fillColor="#540907" fillColorWord="dark red" fillColorDarkMode="#f0c6c5" fillColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <circle name="A" styleNumber="1" labelIsName center="(0,0)" filled />
      <circle name="B" styleNumber="2" labelIsName center="(2,2)" filled />
      <circle name="C" styleNumber="5" labelIsName center="(4,4)" filled />
    </graph>
    <p name="Adescrip">Circle A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    <p name="Aborderdescrip">A has a $A.borderStyleDescription border.</p>
    <p name="Bborderdescrip">B has a $B.borderStyleDescription border.</p>
    <p name="Cborderdescrip">C has a $C.borderStyleDescription border.</p>
    <p name="Afilldescrip">A has a $A.fillStyleDescription fill.</p>
    <p name="Bfilldescrip">B has a $B.fillStyleDescription fill.</p>
    <p name="Cfilldescrip">C has a $C.fillStyleDescription fill.</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Circle A is filled brown with thick border.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a filled dark red circle.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a filled black circle with a thin border.",
        );
        cy.get(cesc("#\\/Aborderdescrip")).should(
            "have.text",
            "A has a thick brown border.",
        );
        cy.get(cesc("#\\/Bborderdescrip")).should(
            "have.text",
            "B has a dark red border.",
        );
        cy.get(cesc("#\\/Cborderdescrip")).should(
            "have.text",
            "C has a thin black border.",
        );
        cy.get(cesc("#\\/Afilldescrip")).should(
            "have.text",
            "A has a brown fill.",
        );
        cy.get(cesc("#\\/Bfilldescrip")).should(
            "have.text",
            "B has a dark red fill.",
        );
        cy.get(cesc("#\\/Cfilldescrip")).should(
            "have.text",
            "C has a black fill.",
        );

        cy.log("set dark mode");
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_darkMode").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Circle A is filled yellow with thick border.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a filled light red circle.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a filled white circle with a thin border.",
        );
        cy.get(cesc("#\\/Aborderdescrip")).should(
            "have.text",
            "A has a thick yellow border.",
        );
        cy.get(cesc("#\\/Bborderdescrip")).should(
            "have.text",
            "B has a light red border.",
        );
        cy.get(cesc("#\\/Cborderdescrip")).should(
            "have.text",
            "C has a thin white border.",
        );
        cy.get(cesc("#\\/Afilldescrip")).should(
            "have.text",
            "A has a yellow fill.",
        );
        cy.get(cesc("#\\/Bfilldescrip")).should(
            "have.text",
            "B has a light red fill.",
        );
        cy.get(cesc("#\\/Cfilldescrip")).should(
            "have.text",
            "C has a white fill.",
        );
    });
});
