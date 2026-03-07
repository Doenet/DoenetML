describe(
    "Style definition accessibility upgraded to errors",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        function postDoenetMLWithUpgradeFlag(doenetML) {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML,
                        flags: { upgradeAccessibilityWarningsToErrors: true },
                    },
                    "*",
                );
            });
        }

        function expectContrastErrorForStyle({ styleNumber, messagePart }) {
            cy.window().then((win) => {
                const errorWarnings = win.returnErrorWarnings1();

                expect(errorWarnings.warnings.length).eq(0);

                const styleError = errorWarnings.errors.find(
                    (x) =>
                        x.message.includes(`Style definition ${styleNumber}`) &&
                        x.message.includes("insufficient contrast") &&
                        x.message.includes(messagePart),
                );

                expect(styleError).not.eq(undefined);
            });
        }

        it("reports upgraded style contrast issues as errors", () => {
            postDoenetMLWithUpgradeFlag(`
<styleDefinition styleNumber="52" textColor="#ff9900" />
<p name="p52" styleNumber="52">Low contrast text</p>
`);

            cy.get("#p52").should("contain.text", "Low contrast text");

            expectContrastErrorForStyle({
                styleNumber: 52,
                messagePart: "text color against the canvas",
            });
        });

        it("renders an _error component in the document for upgraded contrast issues", () => {
            postDoenetMLWithUpgradeFlag(`
<styleDefinition styleNumber="53" lineColor="#000000" lineOpacity="0.2" />
<graph name="g53">
    <shortDescription>Low contrast graph</shortDescription>
    <line styleNumber="53" through="(1,2) (3,4)" />
</graph>
`);

            cy.get("#g53").should("be.visible");

            expectContrastErrorForStyle({
                styleNumber: 53,
                messagePart: "line color against the canvas",
            });

            cy.get(".doenet-viewer").contains("Style definition 53");
            cy.get(".doenet-viewer").contains("insufficient contrast");
        });
    },
);
