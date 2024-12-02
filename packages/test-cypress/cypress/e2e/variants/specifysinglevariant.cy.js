import { cesc, cesc2 } from "@doenet/utils";

describe("Specifying single variant document tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("nested selects, reload", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        let doenetML = `
    <variantControl numVariants="100"/>

    <select assignnames="(p)">
      <option><p newNamespace>Favorite color:
        <select assignNames="(item)">
          <option><text>red</text></option>
          <option><text>orange</text></option>
          <option><text>green</text></option>
          <option><text>white</text></option>
          <option><text>chartreuse</text></option>
        </select>
      </p></option>
      <option><p newNamespace>Selected number: 
        <select assignNames="(item)">
          <option><selectfromsequence from="1000" to="2000" /></option>
          <option><selectfromsequence from="-1000" to="-900" /></option>
        </select>
      </p></option>
      <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" to="g" assignNames="item" /></p></option>
      <option><p newNamespace>Variable: <select type="text" assignNames="item">u v w x z y</select></p></option>
    </select>
    <p>Enter item $item as text: <answer><textinput/><award><text>$(p/item)</text></award></answer></p>
    `;

        let firstStringsToInd = {
            "Favorite color:": 0,
            "Selected number:": 1,
            "Chosen letter:": 2,
            "Variable:": 3,
        };

        cy.log("Test a bunch of variants");
        for (let ind = 1; ind <= 5; ind++) {
            if (ind > 1) {
                cy.get("#testRunner_toggleControls").click();
                cy.get("#testRunner_newAttempt").click();
                cy.wait(100);
                cy.get("#testRunner_toggleControls").click();
                cy.reload();
            }

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `<text>${ind}</text>${doenetML}`,
                    },
                    "*",
                );
            });
            // to wait for page to load
            cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let p = stateVariables["/p"];

                let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
                expect(variantInd).not.eq(undefined);

                let secondValue =
                    stateVariables[p.activeChildren[1].componentName]
                        .stateValues.value;

                if (variantInd === 0) {
                    let i = [
                        "red",
                        "orange",
                        "green",
                        "white",
                        "chartreuse",
                    ].indexOf(secondValue);
                    expect(i).not.eq(-1);
                } else if (variantInd === 1) {
                    let num = secondValue;
                    expect(Number.isInteger(num)).eq(true);
                    if (num > 0) {
                        expect(num).gte(1000);
                        expect(num).lte(2000);
                    } else {
                        expect(num).gte(-1000);
                        expect(num).lte(-900);
                    }
                } else if (variantInd === 2) {
                    let i = ["a", "b", "c", "d", "e", "f", "g"].indexOf(
                        secondValue,
                    );
                    expect(i).not.eq(-1);
                } else {
                    let i = ["u", "v", "w", "x", "z", "y"].indexOf(secondValue);
                    expect(i).not.eq(-1);
                }

                cy.get(cesc("#\\/_textinput1_input")).type(
                    `${secondValue}{enter}`,
                );
                cy.get(cesc("#\\/_textinput1_correct")).should("be.visible");

                cy.wait(2000); // wait for 2 second debounce
                cy.reload();

                // don't need to give requested variant here,
                // as will load variant from IndexedDB given the attempt number
                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML: `<text>${ind}</text>${doenetML}`,
                        },
                        "*",
                    );
                });
                // to wait for page to load
                cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

                // wait until core is loaded
                cy.waitUntil(() =>
                    cy.window().then(async (win) => {
                        let stateVariables =
                            await win.returnAllStateVariables1();
                        return stateVariables["/_textinput1"];
                    }),
                );

                cy.get(cesc("#\\/_textinput1_correct")).should("be.visible");
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    let p = stateVariables["/p"];

                    let variantInd2 =
                        firstStringsToInd[p.activeChildren[0].trim()];
                    expect(variantInd2).eq(variantInd);

                    let secondValue2 =
                        stateVariables[p.activeChildren[1].componentName]
                            .stateValues.value;
                    expect(secondValue2).eq(secondValue);

                    cy.get(cesc("#\\/_textinput1_input")).type(`{end}X`);
                    cy.get(cesc("#\\/_textinput1_submit")).click();
                    cy.get(cesc("#\\/_textinput1_incorrect")).should(
                        "be.visible",
                    );
                    cy.get(cesc("#\\/_textinput1_input")).type(
                        `{end}{backspace}`,
                    );
                    cy.get(cesc("#\\/_textinput1_submit")).click();
                    cy.get(cesc("#\\/_textinput1_correct")).should(
                        "be.visible",
                    );
                });
            });
        }
    });

    it("choiceinputs, reload", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        let doenetML = `
    <variantControl numVariants="100"/>
    <p><choiceinput shuffleOrder name="c1">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p><choiceinput shuffleOrder inline name="c2">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p><choiceinput name="c3">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p><choiceinput inline name="c4">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p>$c1.selectedValue{assignNames="c1v"}</p>
    `;

        // let generatedVariantInfo;
        let originalChoiceOrders;
        let originalChoiceTexts;

        cy.log("Test a bunch of variants");
        for (let ind = 1; ind <= 4; ind++) {
            if (ind > 1) {
                cy.get("#testRunner_toggleControls").click();
                cy.get("#testRunner_newAttempt").click();
                cy.wait(100);
                cy.get("#testRunner_toggleControls").click();
                cy.reload();
            }

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `<text>${ind}</text>${doenetML}`,
                        requestedVariantIndex: ind,
                    },
                    "*",
                );
            });
            // to wait for page to load
            cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let orderC1 = stateVariables["/c1"].stateValues.choiceOrder;
                let orderC2 = stateVariables["/c2"].stateValues.choiceOrder;

                let orderC3 = stateVariables["/c3"].stateValues.choiceOrder;
                let orderC4 = stateVariables["/c4"].stateValues.choiceOrder;

                let textC1 = stateVariables["/c1"].stateValues.choiceTexts;
                let textC2 = stateVariables["/c2"].stateValues.choiceTexts;

                let textC3 = stateVariables["/c3"].stateValues.choiceTexts;
                let textC4 = stateVariables["/c4"].stateValues.choiceTexts;

                let allOrders = [
                    ...orderC1,
                    ...orderC2,
                    ...orderC3,
                    ...orderC4,
                ];
                let allTexts = [...textC1, ...textC2, ...textC3, ...textC4];
                expect(allOrders).not.eqls(originalChoiceOrders);
                originalChoiceOrders = allOrders;
                expect(allTexts).not.eqls(originalChoiceTexts);
                originalChoiceTexts = allTexts;

                // click a choice input so that data is saved to IndexedDB
                cy.get(cesc2(`#/c1_choice1_input`)).click();
                cy.get(cesc2(`#/c1v`)).should("have.text", textC1[0]);
                cy.get(cesc2(`#/c1_choice1_input`)).should("be.checked");

                cy.wait(2000); // wait for 2 second debounce
                cy.reload();

                // don't need to give requested variant here,
                // as will load variant from IndexedDB given the attempt number
                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML: `<text>${ind}</text>${doenetML}`,
                        },
                        "*",
                    );
                });
                // to wait for page to load
                cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

                // wait until core is loaded
                cy.waitUntil(() =>
                    cy.window().then(async (win) => {
                        let stateVariables =
                            await win.returnAllStateVariables1();
                        return stateVariables["/c1"];
                    }),
                );

                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();

                    let orderC1 = stateVariables["/c1"].stateValues.choiceOrder;
                    let orderC2 = stateVariables["/c2"].stateValues.choiceOrder;

                    let orderC3 = stateVariables["/c3"].stateValues.choiceOrder;
                    let orderC4 = stateVariables["/c4"].stateValues.choiceOrder;

                    let textC1 = stateVariables["/c1"].stateValues.choiceTexts;
                    let textC2 = stateVariables["/c2"].stateValues.choiceTexts;

                    let textC3 = stateVariables["/c3"].stateValues.choiceTexts;
                    let textC4 = stateVariables["/c4"].stateValues.choiceTexts;

                    let allOrders = [
                        ...orderC1,
                        ...orderC2,
                        ...orderC3,
                        ...orderC4,
                    ];
                    let allTexts = [...textC1, ...textC2, ...textC3, ...textC4];
                    expect(allOrders).eqls(originalChoiceOrders);
                    expect(allTexts).eqls(originalChoiceTexts);

                    // click a choice input so that data is saved to IndexedDB
                    cy.get(cesc2(`#/c1_choice1_input`)).should("be.checked");
                    cy.get(cesc2(`#/c1_choice2_input`)).click();
                    cy.get(cesc2(`#/c1v`)).should("have.text", textC1[1]);
                    cy.get(cesc2(`#/c1_choice1_input`)).should(
                        "not.be.checked",
                    );
                    cy.get(cesc2(`#/c1_choice2_input`)).should("be.checked");
                });
            });
        }
    });

    it("excluded sequence items, reload", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.log("Test a bunch of variants");
        for (let ind = 1; ind <= 4; ind++) {
            let doenetML = `
      <text>${ind}</text>
      <variantControl numVariants="100"/>
      <selectFromSequence from="1" to="2000000000" exclude="2000000000 3000000000 4000000000 5000000000 6000000000 8000000000 9000000000 1100000000 1200000000 1300000000 1400000000 1500000000 1600000000 1700000000 1900000000" assignNames="m" />
      <selectFromSequence from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" assignNames="n" />
      <p>Enter $m: <answer><mathinput/><award>$m</award></answer></p>
      <p>Enter $n: <answer><mathinput/><award>$n</award></answer></p>

      `;
            if (ind > 1) {
                cy.get("#testRunner_toggleControls").click();
                cy.get("#testRunner_newAttempt").click();
                cy.wait(100);
                cy.get("#testRunner_toggleControls").click();
                cy.reload();
            }

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                        requestedVariantIndex: ind,
                    },
                    "*",
                );
            });

            // to wait for page to load
            cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

            let indexChosen1, indexChosen2;
            let m, n;

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                indexChosen1 =
                    stateVariables["/_selectfromsequence1"].stateValues
                        .selectedIndices[0];
                indexChosen2 =
                    stateVariables["/_selectfromsequence1"].stateValues
                        .selectedIndices[0];
                m = stateVariables["/m"].stateValues.value;
                n = stateVariables["/n"].stateValues.value;

                cy.get(cesc("#\\/_mathinput1") + " textarea").type(
                    `${m}{enter}`,
                    {
                        force: true,
                    },
                );
                cy.get(cesc("#\\/_mathinput2") + " textarea").type(
                    `${n}{enter}`,
                    {
                        force: true,
                    },
                );
                cy.get(cesc("#\\/_mathinput1_correct")).should("be.visible");
                cy.get(cesc("#\\/_mathinput2_correct")).should("be.visible");

                cy.wait(2000); // wait for 2 second debounce
                cy.reload();

                // don't need to give requested variant here,
                // as will load variant from IndexedDB given the attempt number
                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML,
                        },
                        "*",
                    );
                });
                // to wait for page to load
                cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

                // wait until core is loaded
                cy.waitUntil(() =>
                    cy.window().then(async (win) => {
                        let stateVariables =
                            await win.returnAllStateVariables1();
                        return stateVariables["/m"];
                    }),
                );

                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    expect(
                        stateVariables["/_selectfromsequence1"].stateValues
                            .selectedIndices[0],
                    ).eq(indexChosen1);
                    expect(
                        stateVariables["/_selectfromsequence1"].stateValues
                            .selectedIndices[0],
                    ).eq(indexChosen2);
                    expect(stateVariables["/m"].stateValues.value).eq(m);
                    expect(stateVariables["/n"].stateValues.value).eq(n);
                });

                cy.get(cesc("#\\/_mathinput1_correct")).should("be.visible");
                cy.get(cesc("#\\/_mathinput2_correct")).should("be.visible");

                cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{end}X`, {
                    force: true,
                });
                cy.get(cesc("#\\/_mathinput2") + " textarea").type(`{end}X`, {
                    force: true,
                });
                cy.get(cesc("#\\/_mathinput1_submit")).click();
                cy.get(cesc("#\\/_mathinput2_submit")).click();
                cy.get(cesc("#\\/_mathinput1_incorrect")).should("be.visible");
                cy.get(cesc("#\\/_mathinput2_incorrect")).should("be.visible");

                cy.get(cesc("#\\/_mathinput1") + " textarea").type(
                    `{end}{backspace}`,
                    {
                        force: true,
                    },
                );
                cy.get(cesc("#\\/_mathinput2") + " textarea").type(
                    `{end}{backspace}`,
                    {
                        force: true,
                    },
                );
                cy.get(cesc("#\\/_mathinput1_submit")).click();
                cy.get(cesc("#\\/_mathinput2_submit")).click();
                cy.get(cesc("#\\/_mathinput1_correct")).should("be.visible");
                cy.get(cesc("#\\/_mathinput2_correct")).should("be.visible");
            });
        }
    });

    it("replacements of composites are not included in generated variant info, reload", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        let doenetML = `
    <group name="g" newNamespace>
      <choiceinput shuffleOrder name="ci">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
      </choiceinput>
      <p>Selected value: $ci</p>
      <p>Enter <selectFromSequence assignNames="n" />. <answer name="ans">$n</answer></p>
    </group>

    $g{name="g2"}

    $g{name="g3" link="false"}

    <p>Enter <selectFromSequence assignNames="m" />. <answer name="ans">$m</answer></p>
    `;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <text>1</text>${doenetML}`,
                    requestedVariantIndex: 1,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `1`);

        let choices = ["a", "b", "c"];

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let choiceOrder = stateVariables["/g/ci"].stateValues.choiceOrder;
            let n = stateVariables["/g/n"].stateValues.value;
            let m = stateVariables["/m"].stateValues.value;

            let mathinput1Name =
                stateVariables[`/g/ans`].stateValues.inputChildren[0]
                    .componentName;
            let mathinput2Name =
                stateVariables[`/g2/ans`].stateValues.inputChildren[0]
                    .componentName;
            let mathinput3Name =
                stateVariables[`/g3/ans`].stateValues.inputChildren[0]
                    .componentName;
            let mathinput4Name =
                stateVariables[`/ans`].stateValues.inputChildren[0]
                    .componentName;

            let mathinput1Anchor = cesc2("#" + mathinput1Name) + " textarea";
            let answer1Correct = cesc2("#" + mathinput1Name + "_correct");
            let answer1Incorrect = cesc2("#" + mathinput1Name + "_incorrect");
            let answer1Submit = cesc2("#" + mathinput1Name + "_submit");

            let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";
            let answer2Correct = cesc2("#" + mathinput2Name + "_correct");
            let answer2Incorrect = cesc2("#" + mathinput2Name + "_incorrect");
            let answer2Submit = cesc2("#" + mathinput2Name + "_submit");

            let mathinput3Anchor = cesc2("#" + mathinput3Name) + " textarea";
            let answer3Correct = cesc2("#" + mathinput3Name + "_correct");
            let answer3Incorrect = cesc2("#" + mathinput3Name + "_incorrect");
            let answer3Submit = cesc2("#" + mathinput3Name + "_submit");

            let mathinput4Anchor = cesc2("#" + mathinput4Name) + " textarea";
            let answer4Correct = cesc2("#" + mathinput4Name + "_correct");
            let answer4Incorrect = cesc2("#" + mathinput4Name + "_incorrect");
            let answer4Submit = cesc2("#" + mathinput4Name + "_submit");

            cy.get(`label[for=${cesc2("/g/ci_choice1_input")}]`).should(
                "have.text",
                choices[choiceOrder[0] - 1],
            );
            cy.get(`label[for=${cesc2("/g/ci_choice2_input")}]`).should(
                "have.text",
                choices[choiceOrder[1] - 1],
            );
            cy.get(`label[for=${cesc2("/g/ci_choice3_input")}]`).should(
                "have.text",
                choices[choiceOrder[2] - 1],
            );
            cy.get(`label[for=${cesc2("/g2/ci_choice1_input")}]`).should(
                "have.text",
                choices[choiceOrder[0] - 1],
            );
            cy.get(`label[for=${cesc2("/g2/ci_choice2_input")}]`).should(
                "have.text",
                choices[choiceOrder[1] - 1],
            );
            cy.get(`label[for=${cesc2("/g2/ci_choice3_input")}]`).should(
                "have.text",
                choices[choiceOrder[2] - 1],
            );
            cy.get(`label[for=${cesc2("/g3/ci_choice1_input")}]`).should(
                "have.text",
                choices[choiceOrder[0] - 1],
            );
            cy.get(`label[for=${cesc2("/g3/ci_choice2_input")}]`).should(
                "have.text",
                choices[choiceOrder[1] - 1],
            );
            cy.get(`label[for=${cesc2("/g3/ci_choice3_input")}]`).should(
                "have.text",
                choices[choiceOrder[2] - 1],
            );

            cy.get(cesc2(`#/g/_p2`)).should("have.text", `Enter ${n}. `);
            cy.get(cesc2(`#/g2/_p2`)).should("have.text", `Enter ${n}. `);
            cy.get(cesc2(`#/g3/_p2`)).should("have.text", `Enter ${n}. `);
            cy.get(cesc2(`#/_p1`)).should("have.text", `Enter ${m}. `);

            cy.get(cesc2(`#/g/ci_choice2_input`)).click();
            cy.get(cesc2(`#/g/ci_choice2_input`)).should("be.checked");
            cy.get(cesc2(`#/g2/ci_choice2_input`)).should("be.checked");
            cy.get(cesc2(`#/g3/ci_choice2_input`)).should("not.be.checked");

            cy.get(cesc2(`#/g/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g2/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g3/_p1`)).should("have.text", `Selected value: `);

            cy.get(cesc2(`#/g3/ci_choice1_input`)).click();
            cy.get(cesc2(`#/g/ci_choice2_input`)).should("be.checked");
            cy.get(cesc2(`#/g2/ci_choice2_input`)).should("be.checked");
            cy.get(cesc2(`#/g3/ci_choice1_input`)).should("be.checked");

            cy.get(cesc2(`#/g/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g2/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g3/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[0] - 1]}`,
            );

            cy.get(mathinput2Anchor).type(`${n}{enter}`, { force: true });
            cy.get(answer1Correct).should("be.visible");
            cy.get(answer2Correct).should("be.visible");
            cy.get(answer3Submit).should("be.visible");
            cy.get(answer4Submit).should("be.visible");

            cy.get(mathinput3Anchor).type(`${n}{enter}`, { force: true });
            cy.get(answer3Correct).should("be.visible");

            cy.get(mathinput4Anchor).type(`${m}{enter}`, { force: true });
            cy.get(answer4Correct).should("be.visible");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                expect(stateVariables["/g2/n"].stateValues.value).eq(n);
                expect(stateVariables["/g3/n"].stateValues.value).eq(n);
                expect(stateVariables["/g2/ci"].stateValues.choiceOrder).eqls(
                    choiceOrder,
                );
                expect(stateVariables["/g3/ci"].stateValues.choiceOrder).eqls(
                    choiceOrder,
                );

                expect(stateVariables["/g/ci"].stateValues.selectedValues).eqls(
                    [choices[choiceOrder[1] - 1]],
                );
                expect(
                    stateVariables["/g2/ci"].stateValues.selectedValues,
                ).eqls([choices[choiceOrder[1] - 1]]);
                expect(
                    stateVariables["/g3/ci"].stateValues.selectedValues,
                ).eqls([choices[choiceOrder[0] - 1]]);

                expect(
                    stateVariables["/g/ans"].stateValues.submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables["/g2/ans"].stateValues.submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables["/g3/ans"].stateValues.submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables["/ans"].stateValues.submittedResponses,
                ).eqls([m]);
            });

            cy.wait(2000); // wait for 1 second debounce
            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
      <text>1</text>${doenetML}`,
                        requestedVariantIndex: 1,
                    },
                    "*",
                );
            });

            // to wait for page to load
            cy.get(cesc("#\\/_text1")).should("have.text", `1`);

            // wait until core is loaded
            cy.waitUntil(() =>
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    return stateVariables["/ans"];
                }),
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                expect(stateVariables["/g/n"].stateValues.value).eq(n);
                expect(stateVariables["/g2/n"].stateValues.value).eq(n);
                expect(stateVariables["/g3/n"].stateValues.value).eq(n);
                expect(stateVariables["/m"].stateValues.value).eq(m);

                expect(stateVariables["/g/ci"].stateValues.choiceOrder).eqls(
                    choiceOrder,
                );
                expect(stateVariables["/g2/ci"].stateValues.choiceOrder).eqls(
                    choiceOrder,
                );
                expect(stateVariables["/g3/ci"].stateValues.choiceOrder).eqls(
                    choiceOrder,
                );

                expect(stateVariables["/g/ci"].stateValues.selectedValues).eqls(
                    [choices[choiceOrder[1] - 1]],
                );
                expect(
                    stateVariables["/g2/ci"].stateValues.selectedValues,
                ).eqls([choices[choiceOrder[1] - 1]]);
                expect(
                    stateVariables["/g3/ci"].stateValues.selectedValues,
                ).eqls([choices[choiceOrder[0] - 1]]);

                expect(
                    stateVariables["/g/ans"].stateValues.submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables["/g2/ans"].stateValues.submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables["/g3/ans"].stateValues.submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables["/ans"].stateValues.submittedResponses,
                ).eqls([m]);
            });

            cy.get(cesc2(`#/g/ci_choice2_input`)).should("be.checked");
            cy.get(cesc2(`#/g2/ci_choice2_input`)).should("be.checked");
            cy.get(cesc2(`#/g3/ci_choice1_input`)).should("be.checked");

            cy.get(cesc2(`#/g/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g2/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g3/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[0] - 1]}`,
            );

            cy.get(cesc2(`#/g/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g2/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc2(`#/g3/_p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[0] - 1]}`,
            );

            cy.get(answer1Correct).should("be.visible");
            cy.get(answer2Correct).should("be.visible");
            cy.get(answer3Correct).should("be.visible");
            cy.get(answer4Correct).should("be.visible");

            cy.get(mathinput1Anchor).type(
                `{end}{backspace}{backspace}${n + 1}`,
                {
                    force: true,
                },
            );
            cy.get(answer2Submit).click();
            cy.get(answer1Incorrect).should("be.visible");
            cy.get(answer2Incorrect).should("be.visible");

            cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}${n}`, {
                force: true,
            });
            cy.get(answer1Submit).click();
            cy.get(answer1Correct).should("be.visible");
            cy.get(answer2Correct).should("be.visible");

            cy.get(mathinput3Anchor).type(
                `{end}{backspace}{backspace}${n + 1}`,
                {
                    force: true,
                },
            );
            cy.get(answer3Submit).click();
            cy.get(answer3Incorrect).should("be.visible");
            cy.get(mathinput3Anchor).type(`{end}{backspace}{backspace}${n}`, {
                force: true,
            });
            cy.get(answer3Submit).click();
            cy.get(answer3Correct).should("be.visible");

            cy.get(mathinput4Anchor).type(
                `{end}{backspace}{backspace}${m + 1}`,
                {
                    force: true,
                },
            );
            cy.get(answer4Submit).click();
            cy.get(answer4Incorrect).should("be.visible");
            cy.get(mathinput4Anchor).type(`{end}{backspace}{backspace}${m}`, {
                force: true,
            });
            cy.get(answer4Submit).click();
            cy.get(answer4Correct).should("be.visible");
        });
    });
});
