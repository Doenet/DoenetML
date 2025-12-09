import { cesc } from "@doenet/utils";

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
    <variantControl numVariants="100" uniqueVariants="false"/>

    <select name="p">
      <option><p>Favorite color:
        <select name="item">
          <option><text>red</text></option>
          <option><text>orange</text></option>
          <option><text>green</text></option>
          <option><text>white</text></option>
          <option><text>chartreuse</text></option>
        </select>
      </p></option>
      <option><p>Selected number: 
        <select name="item">
          <option><selectFromSequence from="1000" to="2000" /></option>
          <option><selectFromSequence from="-1000" to="-900" /></option>
        </select>
      </p></option>
      <option><p>Chosen letter: <selectFromSequence type="letters" to="g" name="item" /></p></option>
      <option><p>Variable: <select type="text" name="item">u v w x z y</select></p></option>
    </select>
    <p>Enter item $item as text: <answer><textInput name="textInput1"/><award><text>$(p.item)</text></award></answer></p>
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
                        doenetML: `<text name="a">${ind}</text>${doenetML}`,
                        requestedVariantIndex: 3 * ind,
                    },
                    "*",
                );
            });
            // to wait for page to load
            cy.get(cesc("#a")).should("have.text", `${ind}`);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let p = stateVariables[await win.resolvePath1("p[1][1]")];

                let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
                expect(variantInd).not.eq(undefined);

                let secondValue =
                    stateVariables[p.activeChildren[1].componentIdx].stateValues
                        .value;

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

                cy.get(cesc("#textInput1_input")).type(`${secondValue}{enter}`);
                cy.get(cesc("#textInput1_button")).should(
                    "contain.text",
                    "Correct",
                );

                cy.wait(2000); // wait for 2 second debounce
                cy.reload();

                // don't need to give requested variant here,
                // as will load variant from IndexedDB given the attempt number
                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML: `<text name="a">${ind}</text>${doenetML}`,
                        },
                        "*",
                    );
                });
                // to wait for page to load
                cy.get(cesc("#a")).should("have.text", `${ind}`);

                // wait until core is loaded
                cy.waitUntil(() =>
                    cy.window().then(async (win) => {
                        let stateVariables =
                            await win.returnAllStateVariables1();
                        return stateVariables[
                            await win.resolvePath1("textInput1")
                        ];
                    }),
                );

                cy.get(cesc("#textInput1_button")).should(
                    "contain.text",
                    "Correct",
                );
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    let p = stateVariables[await win.resolvePath1("p[1][1]")];

                    let variantInd2 =
                        firstStringsToInd[p.activeChildren[0].trim()];
                    expect(variantInd2).eq(variantInd);

                    let secondValue2 =
                        stateVariables[p.activeChildren[1].componentIdx]
                            .stateValues.value;
                    expect(secondValue2).eq(secondValue);

                    cy.get(cesc("#textInput1_input")).type(`{end}X`);
                    cy.get(cesc("#textInput1_button")).click();
                    cy.get(cesc("#textInput1_button")).should(
                        "contain.text",
                        "Incorrect",
                    );
                    cy.get(cesc("#textInput1_input")).type(`{end}{backspace}`);
                    cy.get(cesc("#textInput1_button")).click();
                    cy.get(cesc("#textInput1_button")).should(
                        "contain.text",
                        "Correct",
                    );
                });
            });
        }
    });

    it("choiceInputs, reload", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        let doenetML = `
    <variantControl numVariants="100"/>
    <p><choiceInput shuffleOrder name="c1">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    <p><choiceInput shuffleOrder inline name="c2">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    <p><choiceInput name="c3">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    <p><choiceInput inline name="c4">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    <p><text extend="$c1.selectedValue" name="c1v" /></p>
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
                        doenetML: `<text name="text1">${ind}</text>${doenetML}`,
                        requestedVariantIndex: ind,
                    },
                    "*",
                );
            });
            // to wait for page to load
            cy.get(cesc("#text1")).should("have.text", `${ind}`);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let orderC1 =
                    stateVariables[await win.resolvePath1("c1")].stateValues
                        .choiceOrder;
                let orderC2 =
                    stateVariables[await win.resolvePath1("c2")].stateValues
                        .choiceOrder;

                let orderC3 =
                    stateVariables[await win.resolvePath1("c3")].stateValues
                        .choiceOrder;
                let orderC4 =
                    stateVariables[await win.resolvePath1("c4")].stateValues
                        .choiceOrder;

                let textC1 =
                    stateVariables[await win.resolvePath1("c1")].stateValues
                        .choiceTexts;
                let textC2 =
                    stateVariables[await win.resolvePath1("c2")].stateValues
                        .choiceTexts;

                let textC3 =
                    stateVariables[await win.resolvePath1("c3")].stateValues
                        .choiceTexts;
                let textC4 =
                    stateVariables[await win.resolvePath1("c4")].stateValues
                        .choiceTexts;

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
                cy.get(cesc(`#c1_choice1_input`)).click();
                cy.get(cesc(`#c1v`)).should("have.text", textC1[0]);
                cy.get(cesc(`#c1_choice1_input`)).should("be.checked");

                cy.wait(2000); // wait for 2 second debounce
                cy.reload();

                // don't need to give requested variant here,
                // as will load variant from IndexedDB given the attempt number
                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML: `<text name="text1">${ind}</text>${doenetML}`,
                        },
                        "*",
                    );
                });
                // to wait for page to load
                cy.get(cesc("#text1")).should("have.text", `${ind}`);

                // wait until core is loaded
                cy.waitUntil(() =>
                    cy.window().then(async (win) => {
                        let stateVariables =
                            await win.returnAllStateVariables1();
                        return stateVariables[await win.resolvePath1("c1")];
                    }),
                );

                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();

                    let orderC1 =
                        stateVariables[await win.resolvePath1("c1")].stateValues
                            .choiceOrder;
                    let orderC2 =
                        stateVariables[await win.resolvePath1("c2")].stateValues
                            .choiceOrder;

                    let orderC3 =
                        stateVariables[await win.resolvePath1("c3")].stateValues
                            .choiceOrder;
                    let orderC4 =
                        stateVariables[await win.resolvePath1("c4")].stateValues
                            .choiceOrder;

                    let textC1 =
                        stateVariables[await win.resolvePath1("c1")].stateValues
                            .choiceTexts;
                    let textC2 =
                        stateVariables[await win.resolvePath1("c2")].stateValues
                            .choiceTexts;

                    let textC3 =
                        stateVariables[await win.resolvePath1("c3")].stateValues
                            .choiceTexts;
                    let textC4 =
                        stateVariables[await win.resolvePath1("c4")].stateValues
                            .choiceTexts;

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
                    cy.get(cesc(`#c1_choice1_input`)).should("be.checked");
                    cy.get(cesc(`#c1_choice2_input`)).click();
                    cy.get(cesc(`#c1v`)).should("have.text", textC1[1]);
                    cy.get(cesc(`#c1_choice1_input`)).should("not.be.checked");
                    cy.get(cesc(`#c1_choice2_input`)).should("be.checked");
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
      <text name="text1">${ind}</text>
      <variantControl numVariants="100"/>
      <selectFromSequence from="1" to="2000000000" exclude="2000000000 3000000000 4000000000 5000000000 6000000000 8000000000 9000000000 1100000000 1200000000 1300000000 1400000000 1500000000 1600000000 1700000000 1900000000" name="m" />
      <selectFromSequence from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" name="n" />
      <p>Enter $m: <answer><mathInput name="mathInput1" /><award>$m</award></answer></p>
      <p>Enter $n: <answer><mathInput name="mathInput2" /><award>$n</award></answer></p>

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
            cy.get(cesc("#text1")).should("have.text", `${ind}`);

            let indexChosen1, indexChosen2;
            let m, n;

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                indexChosen1 =
                    stateVariables[await win.resolvePath1("m")].stateValues
                        .selectedIndices[0];
                indexChosen2 =
                    stateVariables[await win.resolvePath1("n")].stateValues
                        .selectedIndices[0];
                m =
                    stateVariables[await win.resolvePath1("m[1]")].stateValues
                        .value;
                n =
                    stateVariables[await win.resolvePath1("n[1]")].stateValues
                        .value;

                cy.get(cesc("#mathInput1") + " textarea").type(`${m}{enter}`, {
                    force: true,
                });
                cy.get(cesc("#mathInput2") + " textarea").type(`${n}{enter}`, {
                    force: true,
                });
                cy.get(cesc("#mathInput1_button")).should(
                    "contain.text",
                    "Correct",
                );
                cy.get(cesc("#mathInput2_button")).should(
                    "contain.text",
                    "Correct",
                );

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
                cy.get(cesc("#text1")).should("have.text", `${ind}`);

                // wait until core is loaded
                cy.waitUntil(() =>
                    cy.window().then(async (win) => {
                        let stateVariables =
                            await win.returnAllStateVariables1();
                        return stateVariables[await win.resolvePath1("m")];
                    }),
                );

                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    expect(
                        stateVariables[await win.resolvePath1("m")].stateValues
                            .selectedIndices[0],
                    ).eq(indexChosen1);
                    expect(
                        stateVariables[await win.resolvePath1("n")].stateValues
                            .selectedIndices[0],
                    ).eq(indexChosen2);
                    expect(
                        stateVariables[await win.resolvePath1("m[1]")]
                            .stateValues.value,
                    ).eq(m);
                    expect(
                        stateVariables[await win.resolvePath1("n[1]")]
                            .stateValues.value,
                    ).eq(n);
                });

                cy.get(cesc("#mathInput1_button")).should(
                    "contain.text",
                    "Correct",
                );
                cy.get(cesc("#mathInput2_button")).should(
                    "contain.text",
                    "Correct",
                );

                cy.get(cesc("#mathInput1") + " textarea").type(`{end}X`, {
                    force: true,
                });
                cy.get(cesc("#mathInput2") + " textarea").type(`{end}X`, {
                    force: true,
                });
                cy.get(cesc("#mathInput1_button")).click();
                cy.get(cesc("#mathInput2_button")).click();
                cy.get(cesc("#mathInput1_button")).should(
                    "contain.text",
                    "Incorrect",
                );
                cy.get(cesc("#mathInput2_button")).should(
                    "contain.text",
                    "Incorrect",
                );

                cy.get(cesc("#mathInput1") + " textarea").type(
                    `{end}{backspace}`,
                    {
                        force: true,
                    },
                );
                cy.get(cesc("#mathInput2") + " textarea").type(
                    `{end}{backspace}`,
                    {
                        force: true,
                    },
                );
                cy.get(cesc("#mathInput1_button")).click();
                cy.get(cesc("#mathInput2_button")).click();
                cy.get(cesc("#mathInput1_button")).should(
                    "contain.text",
                    "Correct",
                );
                cy.get(cesc("#mathInput2_button")).should(
                    "contain.text",
                    "Correct",
                );
            });
        }
    });

    it("replacements of composites are not included in generated variant info, reload", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        let doenetML = `
    <group name="g">
      <choiceInput shuffleOrder name="ci">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
      </choiceInput>
      <p name="p1">Selected value: $ci</p>
      <p name="p2">Enter <selectFromSequence name="n" />. <answer name="ans">$n</answer></p>
    </group>

    <group extend="$g" name="g2" />

    <group copy="$g" name="g3" />

    <p name="p3">Enter <selectFromSequence name="m" />. <answer name="ans">$m</answer></p>
    `;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <text name="text1">1</text>${doenetML}`,
                    requestedVariantIndex: 1,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#text1")).should("have.text", `1`);

        let choices = ["a", "b", "c"];

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let choiceOrder =
                stateVariables[await win.resolvePath1("ci")].stateValues
                    .choiceOrder;
            let n =
                stateVariables[await win.resolvePath1("n[1]")].stateValues
                    .value;
            let m =
                stateVariables[await win.resolvePath1("m[1]")].stateValues
                    .value;

            let mathInput1Idx =
                stateVariables[await win.resolvePath1(`g.ans`)].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput2Idx =
                stateVariables[await win.resolvePath1(`g2.ans`)].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput3Idx =
                stateVariables[await win.resolvePath1(`g3.ans`)].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput4Idx =
                stateVariables[await win.resolvePath1(`p3.ans`)].stateValues
                    .inputChildren[0].componentIdx;

            let mathInput1Anchor = cesc("#_id_" + mathInput1Idx) + " textarea";
            let answer1Button = cesc("#_id_" + mathInput1Idx + "_button");

            let mathInput2Anchor = cesc("#_id_" + mathInput2Idx) + " textarea";
            let answer2Button = cesc("#_id_" + mathInput2Idx + "_button");

            let mathInput3Anchor = cesc("#_id_" + mathInput3Idx) + " textarea";
            let answer3Button = cesc("#_id_" + mathInput3Idx + "_button");

            let mathInput4Anchor = cesc("#_id_" + mathInput4Idx) + " textarea";
            let answer4Button = cesc("#_id_" + mathInput4Idx + "_button");

            cy.get(`label[for=${cesc("ci_choice1_input")}]`).should(
                "have.text",
                choices[choiceOrder[0] - 1],
            );
            cy.get(`label[for=${cesc("ci_choice2_input")}]`).should(
                "have.text",
                choices[choiceOrder[1] - 1],
            );
            cy.get(`label[for=${cesc("ci_choice3_input")}]`).should(
                "have.text",
                choices[choiceOrder[2] - 1],
            );
            cy.get(`label[for=${cesc("g2.ci_choice1_input")}]`).should(
                "have.text",
                choices[choiceOrder[0] - 1],
            );
            cy.get(`label[for=${cesc("g2.ci_choice2_input")}]`).should(
                "have.text",
                choices[choiceOrder[1] - 1],
            );
            cy.get(`label[for=${cesc("g2.ci_choice3_input")}]`).should(
                "have.text",
                choices[choiceOrder[2] - 1],
            );
            cy.get(`label[for=${cesc("g3.ci_choice1_input")}]`).should(
                "have.text",
                choices[choiceOrder[0] - 1],
            );
            cy.get(`label[for=${cesc("g3.ci_choice2_input")}]`).should(
                "have.text",
                choices[choiceOrder[1] - 1],
            );
            cy.get(`label[for=${cesc("g3.ci_choice3_input")}]`).should(
                "have.text",
                choices[choiceOrder[2] - 1],
            );

            cy.get(cesc(`#p2`)).should("contain.text", `Enter ${n}`);
            cy.get(cesc(`#g2.p2`)).should("contain.text", `Enter ${n}`);
            cy.get(cesc(`#g3.p2`)).should("contain.text", `Enter ${n}`);
            cy.get(cesc(`#p3`)).should("contain.text", `Enter ${m}`);

            cy.get(cesc(`#ci_choice2_input`)).click();
            cy.get(cesc(`#ci_choice2_input`)).should("be.checked");
            cy.get(cesc(`#g2.ci_choice2_input`)).should("be.checked");
            cy.get(cesc(`#g3.ci_choice2_input`)).should("not.be.checked");

            cy.get(cesc(`#p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc(`#g2.p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc(`#g3.p1`)).should("have.text", `Selected value: `);

            cy.get(cesc(`#g3.ci_choice1_input`)).click();
            cy.get(cesc(`#ci_choice2_input`)).should("be.checked");
            cy.get(cesc(`#g2.ci_choice2_input`)).should("be.checked");
            cy.get(cesc(`#g3.ci_choice1_input`)).should("be.checked");

            cy.get(cesc(`#p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc(`#g2.p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc(`#g3.p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[0] - 1]}`,
            );

            cy.get(mathInput2Anchor).type(`${n}{enter}`, { force: true });
            cy.get(answer1Button).should("contain.text", "Correct");
            cy.get(answer2Button).should("contain.text", "Correct");
            cy.get(answer3Button).should("contain.text", "Check Work");
            cy.get(answer4Button).should("contain.text", "Check Work");

            cy.get(mathInput3Anchor).type(`${n}{enter}`, { force: true });
            cy.get(answer3Button).should("contain.text", "Correct");

            cy.get(mathInput4Anchor).type(`${m}{enter}`, { force: true });
            cy.get(answer4Button).should("contain.text", "Correct");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                expect(
                    stateVariables[await win.resolvePath1("g2.n[1]")]
                        .stateValues.value,
                ).eq(n);
                expect(
                    stateVariables[await win.resolvePath1("g3.n[1]")]
                        .stateValues.value,
                ).eq(n);
                expect(
                    stateVariables[await win.resolvePath1("g2.ci")].stateValues
                        .choiceOrder,
                ).eqls(choiceOrder);
                expect(
                    stateVariables[await win.resolvePath1("g3.ci")].stateValues
                        .choiceOrder,
                ).eqls(choiceOrder);

                expect(
                    stateVariables[await win.resolvePath1("g.ci")].stateValues
                        .selectedValues,
                ).eqls([choices[choiceOrder[1] - 1]]);
                expect(
                    stateVariables[await win.resolvePath1("g2.ci")].stateValues
                        .selectedValues,
                ).eqls([choices[choiceOrder[1] - 1]]);
                expect(
                    stateVariables[await win.resolvePath1("g3.ci")].stateValues
                        .selectedValues,
                ).eqls([choices[choiceOrder[0] - 1]]);

                expect(
                    stateVariables[await win.resolvePath1("g.ans")].stateValues
                        .submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables[await win.resolvePath1("g2.ans")].stateValues
                        .submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables[await win.resolvePath1("g3.ans")].stateValues
                        .submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables[await win.resolvePath1("p3.ans")].stateValues
                        .submittedResponses,
                ).eqls([m]);
            });

            cy.wait(2000); // wait for 1 second debounce
            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
      <text name="text1">1</text>${doenetML}`,
                        requestedVariantIndex: 1,
                    },
                    "*",
                );
            });

            // to wait for page to load
            cy.get(cesc("#text1")).should("have.text", `1`);

            // wait until core is loaded
            cy.waitUntil(() =>
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    return stateVariables[await win.resolvePath1("p3.ans")];
                }),
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                expect(
                    stateVariables[await win.resolvePath1("g.n[1]")].stateValues
                        .value,
                ).eq(n);
                expect(
                    stateVariables[await win.resolvePath1("g2.n[1]")]
                        .stateValues.value,
                ).eq(n);
                expect(
                    stateVariables[await win.resolvePath1("g3.n[1]")]
                        .stateValues.value,
                ).eq(n);
                expect(
                    stateVariables[await win.resolvePath1("m[1]")].stateValues
                        .value,
                ).eq(m);

                expect(
                    stateVariables[await win.resolvePath1("g.ci")].stateValues
                        .choiceOrder,
                ).eqls(choiceOrder);
                expect(
                    stateVariables[await win.resolvePath1("g2.ci")].stateValues
                        .choiceOrder,
                ).eqls(choiceOrder);
                expect(
                    stateVariables[await win.resolvePath1("g3.ci")].stateValues
                        .choiceOrder,
                ).eqls(choiceOrder);

                expect(
                    stateVariables[await win.resolvePath1("g.ci")].stateValues
                        .selectedValues,
                ).eqls([choices[choiceOrder[1] - 1]]);
                expect(
                    stateVariables[await win.resolvePath1("g2.ci")].stateValues
                        .selectedValues,
                ).eqls([choices[choiceOrder[1] - 1]]);
                expect(
                    stateVariables[await win.resolvePath1("g3.ci")].stateValues
                        .selectedValues,
                ).eqls([choices[choiceOrder[0] - 1]]);

                expect(
                    stateVariables[await win.resolvePath1("g.ans")].stateValues
                        .submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables[await win.resolvePath1("g2.ans")].stateValues
                        .submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables[await win.resolvePath1("g3.ans")].stateValues
                        .submittedResponses,
                ).eqls([n]);
                expect(
                    stateVariables[await win.resolvePath1("p3.ans")].stateValues
                        .submittedResponses,
                ).eqls([m]);
            });

            cy.get(cesc(`#ci_choice2_input`)).should("be.checked");
            cy.get(cesc(`#g2.ci_choice2_input`)).should("be.checked");
            cy.get(cesc(`#g3.ci_choice1_input`)).should("be.checked");

            cy.get(cesc(`#p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc(`#g2.p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[1] - 1]}`,
            );
            cy.get(cesc(`#g3.p1`)).should(
                "have.text",
                `Selected value: ${choices[choiceOrder[0] - 1]}`,
            );

            cy.get(answer1Button).should("contain.text", "Correct");
            cy.get(answer2Button).should("contain.text", "Correct");
            cy.get(answer3Button).should("contain.text", "Correct");
            cy.get(answer4Button).should("contain.text", "Correct");

            cy.get(mathInput1Anchor).type(
                `{end}{backspace}{backspace}${n + 1}`,
                {
                    force: true,
                },
            );
            cy.get(answer2Button).click();
            cy.get(answer1Button).should("contain.text", "Incorrect");
            cy.get(answer2Button).should("contain.text", "Incorrect");

            cy.get(mathInput2Anchor).type(`{end}{backspace}{backspace}${n}`, {
                force: true,
            });
            cy.get(answer1Button).click();
            cy.get(answer1Button).should("contain.text", "Correct");
            cy.get(answer2Button).should("contain.text", "Correct");

            cy.get(mathInput3Anchor).type(
                `{end}{backspace}{backspace}${n + 1}`,
                {
                    force: true,
                },
            );
            cy.get(answer3Button).click();
            cy.get(answer3Button).should("contain.text", "Incorrect");
            cy.get(mathInput3Anchor).type(`{end}{backspace}{backspace}${n}`, {
                force: true,
            });
            cy.get(answer3Button).click();
            cy.get(answer3Button).should("contain.text", "Correct");

            cy.get(mathInput4Anchor).type(
                `{end}{backspace}{backspace}${m + 1}`,
                {
                    force: true,
                },
            );
            cy.get(answer4Button).click();
            cy.get(answer4Button).should("contain.text", "Incorrect");
            cy.get(mathInput4Anchor).type(`{end}{backspace}{backspace}${m}`, {
                force: true,
            });
            cy.get(answer4Button).click();
            cy.get(answer4Button).should("contain.text", "Correct");
        });
    });
});
