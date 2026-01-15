import { cesc, deepCompare } from "@doenet/utils";

describe("DocViewer Attribute Tests", function () {
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

        cy.get(cesc("#t")).should("not.exist");

        cy.log("Core has not been initialized");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            expect(stateVariables).eqls({});
        });
    });

    it("get different variants when do not specify variant index", () => {
        const variantsObtained = [];
        const numbersObtained = [];

        for (let i = 0; i < 5; i++) {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
        <selectFromSequence from="1" to="1000" name="n" />
      `,
                    },
                    "*",
                );
            });

            cy.get("#n")
                .invoke("text")
                .then((text) => {
                    const n = Number(text);
                    expect(n).to.be.gte(1);
                    expect(n).to.be.lte(1000);
                    numbersObtained.push(n);
                });

            cy.window().then(async (win) => {
                const stateVariables = await win.returnAllStateVariables1();
                const i = stateVariables[0].sharedParameters.variantIndex;
                expect(i).to.be.gte(1);
                expect(i).to.be.lte(100);
                variantsObtained.push(i);
            });

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `<text name="a">a</text>`,
                    },
                    "*",
                );
            });
            cy.get("#a").should("have.text", "a");
        }

        cy.window().then(async () => {
            // make async so we wait until all above are done
            let uniqueVariants = [...new Set(variantsObtained)];
            let uniqueNumbers = [...new Set(numbersObtained)];
            expect(uniqueVariants.length).to.be.gte(4);
            expect(uniqueNumbers.length).to.be.gte(4);
        });
    });

    it("get same variants when do specify variant index", () => {
        let variantsObtained;
        let numbersObtained;

        for (let i = 0; i < 3; i++) {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
        <selectFromSequence from="1" to="1000" name="n" />
      `,
                        requestedVariantIndex: 47,
                    },
                    "*",
                );
            });

            cy.get("#n")
                .invoke("text")
                .then((text) => {
                    const n = Number(text);
                    expect(n).to.be.gte(1);
                    expect(n).to.be.lte(1000);
                    if (numbersObtained === undefined) {
                        numbersObtained = n;
                    } else {
                        expect(n).eq(numbersObtained);
                    }
                });

            cy.window().then(async (win) => {
                const stateVariables = await win.returnAllStateVariables1();
                const i = stateVariables[0].sharedParameters.variantIndex;
                expect(i).to.be.gte(1);
                expect(i).to.be.lte(100);
                if (variantsObtained === undefined) {
                    variantsObtained = i;
                } else {
                    expect(i).eq(variantsObtained);
                }
            });

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `<text name="a">a</text>`,
                    },
                    "*",
                );
            });
            cy.get("#a").should("have.text", "a");
        }
    });
});
