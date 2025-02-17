import { cesc, cesc2 } from "@doenet/utils";

describe("ChoiceInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("disabled choice with inline choiceinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <choiceinput inline placeholder="Choose animal">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice disabled>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

        cy.get(cesc("#\\/_choiceinput1")).should("have.value", "");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
            ];
            expect(choices.length).eq(4);
            expect(originalChoices.includes(choices[0])).eq(true);
            expect(originalChoices.includes(choices[1])).eq(true);
            expect(originalChoices.includes(choices[2])).eq(true);
            expect(originalChoices.includes(choices[3])).eq(true);
            expect(choices[1]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[0]);
            expect(choices[3]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[2]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
            ).eqls([]);
            // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
            expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(
                true,
            );
            expect(
                stateVariables["/_choiceinput1"].stateValues.shuffleOrder,
            ).eq(false);
            expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#\\/_choiceinput1`))
                    .get('[value="3"]')
                    .should("be.disabled");
            } else {
                cy.get(cesc(`#\\/_choiceinput1`))
                    .select(`${i + 1}`)
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#\\/_p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#\\/_p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables["/_choice1"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 1);
                            expect(
                                stateVariables["/_choice2"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 2);
                            expect(
                                stateVariables["/_choice3"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 3);
                            expect(
                                stateVariables["/_choice4"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 4);
                        });
                    });
            }
        }
    });

    it("hidden choice with inline choiceinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <choiceinput inline placeholder="Choose animal">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice hide>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

        cy.get(cesc("#\\/_choiceinput1")).should("have.value", "");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
            ];
            expect(choices.length).eq(4);
            expect(originalChoices.includes(choices[0])).eq(true);
            expect(originalChoices.includes(choices[1])).eq(true);
            expect(originalChoices.includes(choices[2])).eq(true);
            expect(originalChoices.includes(choices[3])).eq(true);
            expect(choices[1]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[0]);
            expect(choices[3]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[2]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
            ).eqls([]);
            expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(
                true,
            );
            expect(
                stateVariables["/_choiceinput1"].stateValues.shuffleOrder,
            ).eq(false);
            expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#\\/_choiceinput1`))
                    .get('[value="3"]')
                    .should("not.exist");
            } else {
                cy.get(cesc(`#\\/_choiceinput1`))
                    .select(`${i + 1}`)
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#\\/_p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#\\/_p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables["/_choice1"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 1);
                            expect(
                                stateVariables["/_choice2"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 2);
                            expect(
                                stateVariables["/_choice3"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 3);
                            expect(
                                stateVariables["/_choice4"].stateValues
                                    .selected,
                            ).eq(choiceOrder[i] === 4);
                        });
                    });
            }
        }
    });

    it("disabled choice with block choiceinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice disabled>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

        let choices;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceTexts,
            ];
            expect(choices).eqls(originalChoices);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
            ).eqls([]);
            expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(
                false,
            );
            expect(
                stateVariables["/_choiceinput1"].stateValues.shuffleOrder,
            ).eq(false);
            expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`)).should(
                    "be.disabled",
                );
            } else {
                cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
                    .click()
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#\\/_p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#\\/_p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables["/_choice1"].stateValues
                                    .selected,
                            ).eq(i === 0);
                            expect(
                                stateVariables["/_choice2"].stateValues
                                    .selected,
                            ).eq(i === 1);
                            expect(
                                stateVariables["/_choice3"].stateValues
                                    .selected,
                            ).eq(i === 2);
                            expect(
                                stateVariables["/_choice4"].stateValues
                                    .selected,
                            ).eq(i === 3);
                        });
                    });
            }
        }
    });

    it("hidden choice with block choiceinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice hide>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

        let choices;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceTexts,
            ];
            expect(choices).eqls(originalChoices);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
            ).eqls([]);
            expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(
                false,
            );
            expect(
                stateVariables["/_choiceinput1"].stateValues.shuffleOrder,
            ).eq(false);
            expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`)).should(
                    "not.exist",
                );
            } else {
                cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
                    .click()
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#\\/_p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#\\/_p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables["/_choiceinput1"].stateValues
                                    .selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables["/_choice1"].stateValues
                                    .selected,
                            ).eq(i === 0);
                            expect(
                                stateVariables["/_choice2"].stateValues
                                    .selected,
                            ).eq(i === 1);
                            expect(
                                stateVariables["/_choice3"].stateValues
                                    .selected,
                            ).eq(i === 2);
                            expect(
                                stateVariables["/_choice4"].stateValues
                                    .selected,
                            ).eq(i === 3);
                        });
                    });
            }
        }
    });

    it("select multiple with block choiceinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <choiceinput shuffleOrder selectMultiple>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected values: <aslist><copy prop='selectedvalues' target="_choiceinput1" /></aslist></p>
    <p>Selected indices: <aslist><copy prop='selectedindices' target="_choiceinput1" /></aslist></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#\\/_p1")).should("have.text", "Selected values: ");
        cy.get(cesc("#\\/_p2")).should("have.text", "Selected indices: ");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
            ];
            expect(choices.length).eq(4);
            expect(originalChoices.includes(choices[0])).eq(true);
            expect(originalChoices.includes(choices[1])).eq(true);
            expect(originalChoices.includes(choices[2])).eq(true);
            expect(originalChoices.includes(choices[3])).eq(true);
            expect(choices[1]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[0]);
            expect(choices[3]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[2]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
            ).eqls([]);
            expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(
                false,
            );
            expect(
                stateVariables["/_choiceinput1"].stateValues.shuffleOrder,
            ).eq(true);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectMultiple,
            ).eq(true);
            expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
                .click()
                .then(() => {
                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#\\/_p1")).should(
                        "have.text",
                        "Selected values: " +
                            choices.slice(0, i + 1).join(", "),
                    );
                    cy.get(cesc("#\\/_p2")).should(
                        "have.text",
                        "Selected indices: " +
                            [...Array(i + 1).keys()]
                                .map((x) => x + 1)
                                .join(", "),
                    );
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/_choiceinput1"].stateValues.selectedValues,
                ).eqls(choices.slice(0, i + 1));
                expect(
                    stateVariables["/_choiceinput1"].stateValues
                        .selectedIndices,
                ).eqls([...Array(i + 1).keys()].map((x) => x + 1));
                expect(stateVariables["/_choice1"].stateValues.selected).eq(
                    choiceOrder.indexOf(1) <= i,
                );
                expect(stateVariables["/_choice2"].stateValues.selected).eq(
                    choiceOrder.indexOf(2) <= i,
                );
                expect(stateVariables["/_choice3"].stateValues.selected).eq(
                    choiceOrder.indexOf(3) <= i,
                );
                expect(stateVariables["/_choice4"].stateValues.selected).eq(
                    choiceOrder.indexOf(4) <= i,
                );
            });
        }

        cy.log("deselect options in order");

        for (let i = 0; i < 4; i++) {
            cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
                .click()
                .then(() => {
                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#\\/_p1")).should(
                        "have.text",
                        "Selected values: " + choices.slice(i + 1).join(", "),
                    );
                    cy.get(cesc("#\\/_p2")).should(
                        "have.text",
                        "Selected indices: " +
                            [...Array(3 - i).keys()]
                                .map((x) => x + 2 + i)
                                .join(", "),
                    );
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/_choiceinput1"].stateValues.selectedValues,
                ).eqls(choices.slice(i + 1));
                expect(
                    stateVariables["/_choiceinput1"].stateValues
                        .selectedIndices,
                ).eqls([...Array(3 - i).keys()].map((x) => x + 2 + i));
                expect(stateVariables["/_choice1"].stateValues.selected).eq(
                    choiceOrder.indexOf(1) > i,
                );
                expect(stateVariables["/_choice2"].stateValues.selected).eq(
                    choiceOrder.indexOf(2) > i,
                );
                expect(stateVariables["/_choice3"].stateValues.selected).eq(
                    choiceOrder.indexOf(3) > i,
                );
                expect(stateVariables["/_choice4"].stateValues.selected).eq(
                    choiceOrder.indexOf(4) > i,
                );
            });
        }

        cy.log("select options in reverse order");

        for (let i = 3; i >= 0; i--) {
            cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
                .click()
                .then(() => {
                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#\\/_p1")).should(
                        "have.text",
                        "Selected values: " + choices.slice(i).join(", "),
                    );
                    cy.get(cesc("#\\/_p2")).should(
                        "have.text",
                        "Selected indices: " +
                            [...Array(4 - i).keys()]
                                .map((x) => x + 1 + i)
                                .join(", "),
                    );
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/_choiceinput1"].stateValues.selectedValues,
                ).eqls(choices.slice(i));
                expect(
                    stateVariables["/_choiceinput1"].stateValues
                        .selectedIndices,
                ).eqls([...Array(4 - i).keys()].map((x) => x + 1 + i));
                expect(stateVariables["/_choice1"].stateValues.selected).eq(
                    choiceOrder.indexOf(1) >= i,
                );
                expect(stateVariables["/_choice2"].stateValues.selected).eq(
                    choiceOrder.indexOf(2) >= i,
                );
                expect(stateVariables["/_choice3"].stateValues.selected).eq(
                    choiceOrder.indexOf(3) >= i,
                );
                expect(stateVariables["/_choice4"].stateValues.selected).eq(
                    choiceOrder.indexOf(4) >= i,
                );
            });
        }
    });

    it("select multiple with inline choiceinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <choiceinput inline shuffleOrder selectMultiple>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected values: <aslist><copy prop='selectedvalues' target="_choiceinput1" /></aslist></p>
    <p>Selected indices: <aslist><copy prop='selectedindices' target="_choiceinput1" /></aslist></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.get(cesc("#\\/_choiceinput1"))
            .invoke("val")
            .should("deep.equal", []);

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#\\/_p1")).should("have.text", "Selected values: ");
        cy.get(cesc("#\\/_p2")).should("have.text", "Selected indices: ");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
            ];
            expect(choices.length).eq(4);
            expect(originalChoices.includes(choices[0])).eq(true);
            expect(originalChoices.includes(choices[1])).eq(true);
            expect(originalChoices.includes(choices[2])).eq(true);
            expect(originalChoices.includes(choices[3])).eq(true);
            expect(choices[1]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[0]);
            expect(choices[2]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[0]);
            expect(choices[3]).not.eq(choices[1]);
            expect(choices[3]).not.eq(choices[2]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
            ).eqls([]);
            expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(
                true,
            );
            expect(
                stateVariables["/_choiceinput1"].stateValues.shuffleOrder,
            ).eq(true);
            expect(
                stateVariables["/_choiceinput1"].stateValues.selectMultiple,
            ).eq(true);
            expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
            expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            // TODO: the onChange handler wasn't triggering when didn't first deselect
            // so, as a stopgap, we're deselecting all here.
            // We shouldn't need to do this!

            cy.get(cesc(`#\\/_choiceinput1`)).select([]);

            cy.get(cesc(`#\\/_choiceinput1`))
                .select([...Array(i + 1).keys()].map((x) => String(x + 1)))
                .then(() => {
                    let selectedInds = [...Array(i + 1).keys()].map((x) =>
                        String(x + 1),
                    );
                    cy.get(cesc("#\\/_choiceinput1"))
                        .invoke("val")
                        .should("deep.equal", selectedInds);

                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#\\/_p1")).should(
                        "have.text",
                        "Selected values: " +
                            choices.slice(0, i + 1).join(", "),
                    );
                    cy.get(cesc("#\\/_p2")).should(
                        "have.text",
                        "Selected indices: " +
                            [...Array(i + 1).keys()]
                                .map((x) => x + 1)
                                .join(", "),
                    );
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/_choiceinput1"].stateValues.selectedValues,
                ).eqls(choices.slice(0, i + 1));
                expect(
                    stateVariables["/_choiceinput1"].stateValues
                        .selectedIndices,
                ).eqls([...Array(i + 1).keys()].map((x) => x + 1));
                expect(stateVariables["/_choice1"].stateValues.selected).eq(
                    choiceOrder.indexOf(1) <= i,
                );
                expect(stateVariables["/_choice2"].stateValues.selected).eq(
                    choiceOrder.indexOf(2) <= i,
                );
                expect(stateVariables["/_choice3"].stateValues.selected).eq(
                    choiceOrder.indexOf(3) <= i,
                );
                expect(stateVariables["/_choice4"].stateValues.selected).eq(
                    choiceOrder.indexOf(4) <= i,
                );
            });
        }

        cy.log("deselect options in order");

        for (let i = 0; i < 4; i++) {
            cy.window().then(async (win) => {
                let indicesToSelect = [...Array(3 - i).keys()].map((x) =>
                    String(x + 2 + i),
                );
                if (i === 3) {
                    indicesToSelect = [""];
                }

                cy.get(cesc(`#\\/_choiceinput1`))
                    .select(indicesToSelect)
                    .then(() => {
                        let selectedInds = [...Array(3 - i).keys()].map((x) =>
                            String(x + 2 + i),
                        );
                        cy.get(cesc("#\\/_choiceinput1"))
                            .invoke("val")
                            .should("deep.equal", selectedInds);

                        // make this asynchronous so that choices is populated before line is executed
                        cy.get(cesc("#\\/_p1")).should(
                            "have.text",
                            "Selected values: " +
                                choices.slice(i + 1).join(", "),
                        );
                        cy.get(cesc("#\\/_p2")).should(
                            "have.text",
                            "Selected indices: " +
                                [...Array(3 - i).keys()]
                                    .map((x) => x + 2 + i)
                                    .join(", "),
                        );
                    });

                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    expect(
                        stateVariables["/_choiceinput1"].stateValues
                            .selectedValues,
                    ).eqls(choices.slice(i + 1));
                    expect(
                        stateVariables["/_choiceinput1"].stateValues
                            .selectedIndices,
                    ).eqls([...Array(3 - i).keys()].map((x) => x + 2 + i));
                    expect(stateVariables["/_choice1"].stateValues.selected).eq(
                        choiceOrder.indexOf(1) > i,
                    );
                    expect(stateVariables["/_choice2"].stateValues.selected).eq(
                        choiceOrder.indexOf(2) > i,
                    );
                    expect(stateVariables["/_choice3"].stateValues.selected).eq(
                        choiceOrder.indexOf(3) > i,
                    );
                    expect(stateVariables["/_choice4"].stateValues.selected).eq(
                        choiceOrder.indexOf(4) > i,
                    );
                });
            });
        }

        cy.log("select options in reverse order");

        for (let i = 3; i >= 0; i--) {
            cy.get(cesc(`#\\/_choiceinput1`))
                .select([...Array(4 - i).keys()].map((x) => String(x + 1 + i)))
                .then(() => {
                    let selectedInds = [...Array(4 - i).keys()].map((x) =>
                        String(x + 1 + i),
                    );
                    cy.get(cesc("#\\/_choiceinput1"))
                        .invoke("val")
                        .should("deep.equal", selectedInds);

                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#\\/_p1")).should(
                        "have.text",
                        "Selected values: " + choices.slice(i).join(", "),
                    );
                    cy.get(cesc("#\\/_p2")).should(
                        "have.text",
                        "Selected indices: " +
                            [...Array(4 - i).keys()]
                                .map((x) => x + 1 + i)
                                .join(", "),
                    );
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/_choiceinput1"].stateValues.selectedValues,
                ).eqls(choices.slice(i));
                expect(
                    stateVariables["/_choiceinput1"].stateValues
                        .selectedIndices,
                ).eqls([...Array(4 - i).keys()].map((x) => x + 1 + i));
                expect(stateVariables["/_choice1"].stateValues.selected).eq(
                    choiceOrder.indexOf(1) >= i,
                );
                expect(stateVariables["/_choice2"].stateValues.selected).eq(
                    choiceOrder.indexOf(2) >= i,
                );
                expect(stateVariables["/_choice3"].stateValues.selected).eq(
                    choiceOrder.indexOf(3) >= i,
                );
                expect(stateVariables["/_choice4"].stateValues.selected).eq(
                    choiceOrder.indexOf(4) >= i,
                );
            });
        }
    });
});
