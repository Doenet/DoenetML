import { cesc } from "@doenet/utils";

describe("ChoiceInput Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("disabled choice with inline choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="choiceInput1" inline placeholder="Choose animal">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3" disabled>monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="p1">Selected value: $choiceInput1.selectedValue</p>
    <p name="p2">Selected index: $choiceInput1.selectedIndex</p>
    `,
                },
                "*",
            );
        });

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#p2")).should("have.text", "Selected index: ");

        cy.get(cesc("#choiceInput1")).should("have.value", "");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceOrder,
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
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedIndices,
            ).eqls([]);
            // expect(stateVariables['/_choiceInput1'].stateValues.selectedoriginalindices).eqls([])
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.inline,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.shuffleOrder,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice1")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice2")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice3")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice4")].stateValues
                    .selected,
            ).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#choiceInput1`))
                    .get('[value="3"]')
                    .should("be.disabled");
            } else {
                cy.get(cesc(`#choiceInput1`))
                    .select(`${i + 1}`)
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice1")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 1);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice2")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 2);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice3")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 3);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice4")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 4);
                        });
                    });
            }
        }
    });

    it("hidden choice with inline choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="choiceInput1" inline placeholder="Choose animal">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3" hide>monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="p1">Selected value: $choiceInput1.selectedValue</p>
    <p name="p2">Selected index: $choiceInput1.selectedIndex</p>
    `,
                },
                "*",
            );
        });

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#p2")).should("have.text", "Selected index: ");

        cy.get(cesc("#choiceInput1")).should("have.value", "");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceOrder,
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
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedIndices,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.inline,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.shuffleOrder,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice1")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice2")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice3")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice4")].stateValues
                    .selected,
            ).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#choiceInput1`))
                    .get('[value="3"]')
                    .should("not.exist");
            } else {
                cy.get(cesc(`#choiceInput1`))
                    .select(`${i + 1}`)
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice1")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 1);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice2")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 2);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice3")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 3);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice4")
                                ].stateValues.selected,
                            ).eq(choiceOrder[i] === 4);
                        });
                    });
            }
        }
    });

    it("disabled choice with block choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="choiceInput1">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3" disabled>monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="p1">Selected value: $choiceInput1.selectedValue</p>
    <p name="p2">Selected index: $choiceInput1.selectedIndex</p>
    `,
                },
                "*",
            );
        });

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#p2")).should("have.text", "Selected index: ");

        let choices;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceTexts,
            ];
            expect(choices).eqls(originalChoices);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedIndices,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.inline,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.shuffleOrder,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice1")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice2")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice3")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice4")].stateValues
                    .selected,
            ).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#choiceInput1_choice${i + 1}_input`)).should(
                    "be.disabled",
                );
            } else {
                cy.get(cesc(`#choiceInput1_choice${i + 1}_input`))
                    .click()
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice1")
                                ].stateValues.selected,
                            ).eq(i === 0);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice2")
                                ].stateValues.selected,
                            ).eq(i === 1);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice3")
                                ].stateValues.selected,
                            ).eq(i === 2);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice4")
                                ].stateValues.selected,
                            ).eq(i === 3);
                        });
                    });
            }
        }
    });

    it("hidden choice with block choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="choiceInput1">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3" hide>monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="p1">Selected value: $choiceInput1.selectedValue</p>
    <p name="p2">Selected index: $choiceInput1.selectedIndex</p>
    `,
                },
                "*",
            );
        });

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#p1")).should("have.text", "Selected value: ");
        cy.get(cesc("#p2")).should("have.text", "Selected index: ");

        let choices;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceTexts,
            ];
            expect(choices).eqls(originalChoices);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedIndices,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.inline,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.shuffleOrder,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice1")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice2")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice3")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice4")].stateValues
                    .selected,
            ).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                cy.get(cesc(`#choiceInput1_choice${i + 1}_input`)).should(
                    "not.exist",
                );
            } else {
                cy.get(cesc(`#choiceInput1_choice${i + 1}_input`))
                    .click()
                    .then(() => {
                        // make this asynchronous  so that choices is populated before line is executed
                        cy.get(cesc("#p1")).should(
                            "have.text",
                            "Selected value: " + choices[i],
                        );
                        cy.get(cesc("#p2")).should(
                            "have.text",
                            "Selected index: " + (i + 1),
                        );

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedValues,
                            ).eqls([choices[i]]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choiceInput1")
                                ].stateValues.selectedIndices,
                            ).eqls([i + 1]);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice1")
                                ].stateValues.selected,
                            ).eq(i === 0);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice2")
                                ].stateValues.selected,
                            ).eq(i === 1);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice3")
                                ].stateValues.selected,
                            ).eq(i === 2);
                            expect(
                                stateVariables[
                                    await win.resolvePath1("choice4")
                                ].stateValues.selected,
                            ).eq(i === 3);
                        });
                    });
            }
        }
    });

    it("select multiple with block choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="choiceInput1" shuffleOrder selectMultiple>
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3">monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="p1">Selected values: $choiceInput1.selectedValues</p>
    <p name="p2">Selected indices: $choiceInput1.selectedIndices</p>
    `,
                },
                "*",
            );
        });

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#p1")).should("have.text", "Selected values: ");
        cy.get(cesc("#p2")).should("have.text", "Selected indices: ");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceOrder,
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
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedIndices,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.inline,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.shuffleOrder,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectMultiple,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("choice1")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice2")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice3")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice4")].stateValues
                    .selected,
            ).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            cy.get(cesc(`#choiceInput1_choice${i + 1}_input`))
                .click()
                .then(() => {
                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#p1")).should(
                        "have.text",
                        "Selected values: " +
                            choices.slice(0, i + 1).join(", "),
                    );
                    cy.get(cesc("#p2")).should(
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
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedValues,
                ).eqls(choices.slice(0, i + 1));
                expect(
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedIndices,
                ).eqls([...Array(i + 1).keys()].map((x) => x + 1));
                expect(
                    stateVariables[await win.resolvePath1("choice1")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(1) <= i);
                expect(
                    stateVariables[await win.resolvePath1("choice2")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(2) <= i);
                expect(
                    stateVariables[await win.resolvePath1("choice3")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(3) <= i);
                expect(
                    stateVariables[await win.resolvePath1("choice4")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(4) <= i);
            });
        }

        cy.log("deselect options in order");

        for (let i = 0; i < 4; i++) {
            cy.get(cesc(`#choiceInput1_choice${i + 1}_input`))
                .click()
                .then(() => {
                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#p1")).should(
                        "have.text",
                        "Selected values: " + choices.slice(i + 1).join(", "),
                    );
                    cy.get(cesc("#p2")).should(
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
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedValues,
                ).eqls(choices.slice(i + 1));
                expect(
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedIndices,
                ).eqls([...Array(3 - i).keys()].map((x) => x + 2 + i));
                expect(
                    stateVariables[await win.resolvePath1("choice1")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(1) > i);
                expect(
                    stateVariables[await win.resolvePath1("choice2")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(2) > i);
                expect(
                    stateVariables[await win.resolvePath1("choice3")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(3) > i);
                expect(
                    stateVariables[await win.resolvePath1("choice4")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(4) > i);
            });
        }

        cy.log("select options in reverse order");

        for (let i = 3; i >= 0; i--) {
            cy.get(cesc(`#choiceInput1_choice${i + 1}_input`))
                .click()
                .then(() => {
                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#p1")).should(
                        "have.text",
                        "Selected values: " + choices.slice(i).join(", "),
                    );
                    cy.get(cesc("#p2")).should(
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
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedValues,
                ).eqls(choices.slice(i));
                expect(
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedIndices,
                ).eqls([...Array(4 - i).keys()].map((x) => x + 1 + i));
                expect(
                    stateVariables[await win.resolvePath1("choice1")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(1) >= i);
                expect(
                    stateVariables[await win.resolvePath1("choice2")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(2) >= i);
                expect(
                    stateVariables[await win.resolvePath1("choice3")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(3) >= i);
                expect(
                    stateVariables[await win.resolvePath1("choice4")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(4) >= i);
            });
        }
    });

    it("select multiple with inline choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="choiceInput1" inline shuffleOrder selectMultiple>
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3">monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="p1">Selected values: $choiceInput1.selectedValues</p>
    <p name="p2">Selected indices: $choiceInput1.selectedIndices</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#choiceInput1")).invoke("val").should("deep.equal", []);

        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        cy.get(cesc("#p1")).should("have.text", "Selected values: ");
        cy.get(cesc("#p2")).should("have.text", "Selected indices: ");

        let choices, choiceOrder;
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            choices = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceTexts,
            ];
            choiceOrder = [
                ...stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.choiceOrder,
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
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedValues,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectedIndices,
            ).eqls([]);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.inline,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.shuffleOrder,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("choiceInput1")]
                    .stateValues.selectMultiple,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("choice1")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice2")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice3")].stateValues
                    .selected,
            ).eq(false);
            expect(
                stateVariables[await win.resolvePath1("choice4")].stateValues
                    .selected,
            ).eq(false);
        });

        cy.log("select options in order");

        for (let i = 0; i < 4; i++) {
            // TODO: the onChange handler wasn't triggering when didn't first deselect
            // so, as a stopgap, we're deselecting all here.
            // We shouldn't need to do this!

            cy.get(cesc(`#choiceInput1`)).select([]);

            cy.get(cesc(`#choiceInput1`))
                .select([...Array(i + 1).keys()].map((x) => String(x + 1)))
                .then(() => {
                    let selectedInds = [...Array(i + 1).keys()].map((x) =>
                        String(x + 1),
                    );
                    cy.get(cesc("#choiceInput1"))
                        .invoke("val")
                        .should("deep.equal", selectedInds);

                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#p1")).should(
                        "have.text",
                        "Selected values: " +
                            choices.slice(0, i + 1).join(", "),
                    );
                    cy.get(cesc("#p2")).should(
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
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedValues,
                ).eqls(choices.slice(0, i + 1));
                expect(
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedIndices,
                ).eqls([...Array(i + 1).keys()].map((x) => x + 1));
                expect(
                    stateVariables[await win.resolvePath1("choice1")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(1) <= i);
                expect(
                    stateVariables[await win.resolvePath1("choice2")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(2) <= i);
                expect(
                    stateVariables[await win.resolvePath1("choice3")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(3) <= i);
                expect(
                    stateVariables[await win.resolvePath1("choice4")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(4) <= i);
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

                cy.get(cesc(`#choiceInput1`))
                    .select(indicesToSelect)
                    .then(() => {
                        let selectedInds = [...Array(3 - i).keys()].map((x) =>
                            String(x + 2 + i),
                        );
                        cy.get(cesc("#choiceInput1"))
                            .invoke("val")
                            .should("deep.equal", selectedInds);

                        // make this asynchronous so that choices is populated before line is executed
                        cy.get(cesc("#p1")).should(
                            "have.text",
                            "Selected values: " +
                                choices.slice(i + 1).join(", "),
                        );
                        cy.get(cesc("#p2")).should(
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
                        stateVariables[await win.resolvePath1("choiceInput1")]
                            .stateValues.selectedValues,
                    ).eqls(choices.slice(i + 1));
                    expect(
                        stateVariables[await win.resolvePath1("choiceInput1")]
                            .stateValues.selectedIndices,
                    ).eqls([...Array(3 - i).keys()].map((x) => x + 2 + i));
                    expect(
                        stateVariables[await win.resolvePath1("choice1")]
                            .stateValues.selected,
                    ).eq(choiceOrder.indexOf(1) > i);
                    expect(
                        stateVariables[await win.resolvePath1("choice2")]
                            .stateValues.selected,
                    ).eq(choiceOrder.indexOf(2) > i);
                    expect(
                        stateVariables[await win.resolvePath1("choice3")]
                            .stateValues.selected,
                    ).eq(choiceOrder.indexOf(3) > i);
                    expect(
                        stateVariables[await win.resolvePath1("choice4")]
                            .stateValues.selected,
                    ).eq(choiceOrder.indexOf(4) > i);
                });
            });
        }

        cy.log("select options in reverse order");

        for (let i = 3; i >= 0; i--) {
            cy.get(cesc(`#choiceInput1`))
                .select([...Array(4 - i).keys()].map((x) => String(x + 1 + i)))
                .then(() => {
                    let selectedInds = [...Array(4 - i).keys()].map((x) =>
                        String(x + 1 + i),
                    );
                    cy.get(cesc("#choiceInput1"))
                        .invoke("val")
                        .should("deep.equal", selectedInds);

                    // make this asynchronous so that choices is populated before line is executed
                    cy.get(cesc("#p1")).should(
                        "have.text",
                        "Selected values: " + choices.slice(i).join(", "),
                    );
                    cy.get(cesc("#p2")).should(
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
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedValues,
                ).eqls(choices.slice(i));
                expect(
                    stateVariables[await win.resolvePath1("choiceInput1")]
                        .stateValues.selectedIndices,
                ).eqls([...Array(4 - i).keys()].map((x) => x + 1 + i));
                expect(
                    stateVariables[await win.resolvePath1("choice1")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(1) >= i);
                expect(
                    stateVariables[await win.resolvePath1("choice2")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(2) >= i);
                expect(
                    stateVariables[await win.resolvePath1("choice3")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(3) >= i);
                expect(
                    stateVariables[await win.resolvePath1("choice4")]
                        .stateValues.selected,
                ).eq(choiceOrder.indexOf(4) >= i);
            });
        }
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="ci">
        <choice>a</choice>
        <choice>b</choice>
        <shortDescription>Select</shortDescription>
        <description>
            <p>Select what you like.</p>
        </description>
    </choiceInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ci-label [data-test='Description Button']").should(
            "be.visible",
        );
        cy.get("#ci-label [data-test='Description']").should("not.be.visible");
        cy.get("#ci-label [data-test='Description Button']").click();

        cy.get("#ci-label [data-test='Description']").should(
            "contain.text",
            "Select what you like.",
        );

        cy.get("#ci input").eq(0).focus();
        cy.get("#ci-label [data-test='Description']").should("not.be.visible");
    });

    it("with description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="ci" inline>
        <choice>a</choice>
        <choice>b</choice>
        <shortDescription>Select</shortDescription>
        <description>
            <p>Select what you like.</p>
        </description>
    </choiceInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ci-container [data-test='Description Button']").should(
            "be.visible",
        );
        cy.get("#ci-container [data-test='Description']").should(
            "not.be.visible",
        );
        cy.get("#ci-container [data-test='Description Button']").click();

        cy.get("#ci-container [data-test='Description']").should(
            "contain.text",
            "Select what you like.",
        );

        cy.get("#ci").focus();
        cy.get("#ci-container [data-test='Description']").should(
            "not.be.visible",
        );
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="ci">
        <choice>a</choice>
        <choice>b</choice>
        <shortDescription>Select</shortDescription>
    </choiceInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ci").should("be.visible");
        cy.get("#ci-label [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#ci-label [data-test='Description']").should("not.exist");
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="ci" inline>
        <choice>a</choice>
        <choice>b</choice>
        <shortDescription>Select</shortDescription>
    </choiceInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ci").should("be.visible");
        cy.get("#ci-label [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#ci-label [data-test='Description']").should("not.exist");
    });
});
