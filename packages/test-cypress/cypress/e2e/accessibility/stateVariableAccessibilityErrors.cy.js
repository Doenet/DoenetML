describe(
    "State-variable accessibility errors render upgraded error components",
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

        function expectAccessibilityErrorInErrorList(messagePart) {
            cy.window().then((win) => {
                const errorWarnings = win.returnErrorWarnings1();
                expect(
                    errorWarnings.errors.some((x) =>
                        x.message.includes(messagePart),
                    ),
                ).eq(true);
            });
        }

        it("renders _error for graph shortDescription upgraded error", () => {
            postDoenetMLWithUpgradeFlag(`
<graph name="gLate">
    <point>(1,2)</point>
</graph>
`);

            cy.get("#gLate").should("be.visible");

            const messagePart =
                "<graph> must either have a short description or be specified as decorative";

            expectAccessibilityErrorInErrorList(messagePart);
            cy.get(".doenet-viewer").contains(messagePart);
        });

        it("renders _error for input-label accessibility upgraded errors", () => {
            postDoenetMLWithUpgradeFlag(`
<textInput name="tiLate" />
<booleanInput name="biLate" />
`);

            cy.get("#tiLate").should("exist");
            cy.get("#biLate").should("exist");

            const textInputMessage =
                "<textInput> must have a short description or a label";
            const booleanInputMessage =
                "<booleanInput> must have a short description or a label";

            expectAccessibilityErrorInErrorList(textInputMessage);
            expectAccessibilityErrorInErrorList(booleanInputMessage);

            cy.get(".doenet-viewer").contains(textInputMessage);
            cy.get(".doenet-viewer").contains(booleanInputMessage);
        });
    },
);
