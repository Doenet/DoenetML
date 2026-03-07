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

        it("Upgraded error follows references", () => {
            postDoenetMLWithUpgradeFlag(`
<textInput name="ti" prefill="my label"><label>$ti</label></textInput>
`);

            cy.log("No errors to start");

            cy.get("#ti").should("have.text", "my label");
            cy.window().then(async (win) => {
                let errorWarnings = win.returnErrorWarnings1();

                expect(errorWarnings.errors.length).eq(0);
                expect(errorWarnings.warnings.length).eq(0);
            });

            cy.get(".doenet-viewer").should(
                "not.contain.text",
                "document contains errors",
            );

            cy.log("remove label to cause error");

            cy.get("#ti_input").clear().blur();
            cy.get("#ti").should("not.have.text", "my label");

            cy.window().then(async (win) => {
                let errorWarnings = win.returnErrorWarnings1();

                expect(errorWarnings.errors.length).eq(1);
                expect(errorWarnings.warnings.length).eq(0);

                expect(errorWarnings.errors[0].message).contain(
                    "<textInput> must have a short description or a label",
                );
            });

            cy.log(
                "No message about document contains errors because error is not initial",
            );
            cy.get(".doenet-viewer").should(
                "not.contain.text",
                "document contains errors",
            );
        });

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                <textInput name="ti" prefill=""><label>$ti</label></textInput>
`,
                    flags: { upgradeAccessibilityWarningsToErrors: true },
                },
                "*",
            );

            cy.log(
                "Show document contains errors message because error is initial",
            );
            cy.get(".doenet-viewer").should(
                "contain.text",
                "document contains errors",
            );
        });
    },
);
