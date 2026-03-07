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

        function expectAccessibilityErrorInErrorList(
            messagePart,
            expectedCount = 1,
        ) {
            cy.window().should((win) => {
                expect(win.returnErrorWarnings1).to.be.a("function");
                const errorWarnings = win.returnErrorWarnings1();
                const matchingErrors = errorWarnings.errors.filter((x) =>
                    x.message.includes(messagePart),
                );
                expect(matchingErrors.length).eq(expectedCount);
            });
        }

        function expectTotalAccessibilityErrorsInErrorList(expectedCount) {
            cy.window().should((win) => {
                expect(win.returnErrorWarnings1).to.be.a("function");
                const errorWarnings = win.returnErrorWarnings1();
                expect(errorWarnings.errors.length).eq(expectedCount);
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

            expectTotalAccessibilityErrorsInErrorList(1);
            expectAccessibilityErrorInErrorList(messagePart, 1);
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

            expectTotalAccessibilityErrorsInErrorList(2);
            expectAccessibilityErrorInErrorList(textInputMessage, 1);
            expectAccessibilityErrorInErrorList(booleanInputMessage, 1);

            cy.get(".doenet-viewer").contains(textInputMessage);
            cy.get(".doenet-viewer").contains(booleanInputMessage);
        });

        it("renders _error for answer accessibility upgraded error", () => {
            postDoenetMLWithUpgradeFlag(`
<answer>x</answer>
`);

            const answerMessage =
                "an <answer> creating an input must have a short description or a label";

            expectTotalAccessibilityErrorsInErrorList(1);
            expectAccessibilityErrorInErrorList(answerMessage, 1);
            cy.get(".doenet-viewer").contains(answerMessage);
        });
    },
);
