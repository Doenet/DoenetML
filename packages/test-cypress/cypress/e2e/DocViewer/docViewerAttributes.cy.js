import { cesc2, deepCompare } from "@doenet/utils";

describe("PageViewer Attribute Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("get variants, component counts without rendering or starting core", () => {
        let allPossibleVariants = null;
        let baseComponentCounts = null;

        function variantsListener(e) {
            if (e.origin !== window.location.origin) {
                return;
            }

            if (e.data.messageType === "documentStructure") {
                allPossibleVariants = e.data.args.allPossibleVariants;
                baseComponentCounts = e.data.args.baseComponentCounts;
            }
        }

        cy.window().then(async (win) => {
            win.addEventListener("message", variantsListener);
        });

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_render").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="t">Hello</text>
    <selectFromSequence from="1" to="7" />
  `,
                },
                "*",
            );
        });

        cy.waitUntil(() => {
            if (!allPossibleVariants) {
                return false;
            }
            return deepCompare(
                [...allPossibleVariants],
                ["a", "b", "c", "d", "e", "f", "g"],
            );
        });

        cy.window().then(async (win) => {
            win.removeEventListener("message", variantsListener);
            expect(baseComponentCounts).eqls({
                text: 1,
                selectFromSequence: 1,
            });
        });

        cy.get(cesc2("#/t")).should("not.exist");

        cy.log("Core has not been initialized");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            expect(stateVariables).eqls({});
        });
    });
});
