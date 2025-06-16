import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    submitAnswer,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Feedback tag tests", async () => {
    async function test_three_feedbacks(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        showFeedback: boolean,
    ) {
        async function check_items(
            show1: boolean,
            show2: boolean,
            currentResponse: string,
            submittedResponse?: string,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pfc")].stateValues
                    .text,
            ).eq("You got full credit!");
            expect(
                stateVariables[await resolvePathToNodeIdx("pra")].stateValues
                    .text,
            ).eq("You typed the right answer!");
            expect(
                stateVariables[await resolvePathToNodeIdx("pba")].stateValues
                    .text,
            ).eq("That's a bad answer.");

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ans")
                ].stateValues.currentResponses[0].toString(),
            ).eq(currentResponse);
            if (submittedResponse === undefined) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.submittedResponses,
                ).eqls([]);
            } else {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("ans")
                    ].stateValues.submittedResponses[0].toString(),
                ).eq(submittedResponse);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("ffc")].stateValues
                    .hidden,
            ).eq(show1);
            expect(
                stateVariables[await resolvePathToNodeIdx("fra")].stateValues
                    .hidden,
            ).eq(show1);
            expect(
                stateVariables[await resolvePathToNodeIdx("fba")].stateValues
                    .hidden,
            ).eq(show2);
            expect(
                stateVariables[await resolvePathToNodeIdx("pfc")].stateValues
                    .hidden,
            ).eq(show1);
            expect(
                stateVariables[await resolvePathToNodeIdx("pra")].stateValues
                    .hidden,
            ).eq(show1);
            expect(
                stateVariables[await resolvePathToNodeIdx("pba")].stateValues
                    .hidden,
            ).eq(show2);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        let mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        let hidden1 = true;
        let hidden2 = true;
        let currentResponse = "\uff3f";
        let submittedResponse: string | undefined = undefined;

        await check_items(hidden1, hidden2, currentResponse, submittedResponse);

        // Type correct answer in
        currentResponse = "x + y";
        await updateMathInputValue({
            latex: currentResponse,
            componentIdx: mathInputIdx,
            core,
        });

        await check_items(hidden1, hidden2, currentResponse, submittedResponse);

        // Submit answer
        submittedResponse = currentResponse;
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        if (showFeedback) {
            hidden1 = false;
        }
        await check_items(hidden1, hidden2, currentResponse, submittedResponse);

        // Type wrong answer
        currentResponse = "x";
        await updateMathInputValue({
            latex: currentResponse,
            componentIdx: mathInputIdx,
            core,
        });
        await check_items(hidden1, hidden2, currentResponse, submittedResponse);

        // Submit answer
        submittedResponse = currentResponse;
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        if (showFeedback) {
            hidden1 = true;
            hidden2 = false;
        }
        await check_items(hidden1, hidden2, currentResponse, submittedResponse);

        // Enter different wrong answer
        currentResponse = "y";
        await updateMathInputValue({
            latex: currentResponse,
            componentIdx: mathInputIdx,
            core,
        });
        await check_items(hidden1, hidden2, currentResponse, submittedResponse);

        // Submit answer
        submittedResponse = currentResponse;
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        if (showFeedback) {
            hidden1 = true;
            hidden2 = true;
        }
        await check_items(hidden1, hidden2, currentResponse, submittedResponse);
    }

    it("feedback from answer value or credit", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><answer name="ans">x+y</answer></p>
    <feedback name="ffc" condition="$ans.creditAchieved = 1">
        <p name="pfc">You got full credit!</p>
    </feedback>
    <feedback name="fra" condition="$ans = x+y">
        <p name="pra">You typed the right answer!</p>
    </feedback>
    <feedback name="fba" condition="$ans = x" >
        <p name="pba">That's a bad answer.</p>
    </feedback>
  `,
        });

        await test_three_feedbacks(core, resolvePathToNodeIdx, true);
    });

    it("feedback from answer value or credit, set showFeedback=false", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><answer name="ans">x+y</answer></p>
    <feedback name="ffc" condition="$ans.creditAchieved = 1">
        <p name="pfc">You got full credit!</p>
    </feedback>
    <feedback name="fra" condition="$ans = x+y">
        <p name="pra">You typed the right answer!</p>
    </feedback>
    <feedback name="fba" condition="$ans = x" >
        <p name="pba">That's a bad answer.</p>
    </feedback>
  `,
            flags: { showFeedback: false },
        });

        await test_three_feedbacks(core, resolvePathToNodeIdx, false);
    });

    it("feedback from award", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><answer name="ans">
        <award name="award1"><math>x+y</math></award>
        <award name="award2" credit="0.5"><math>x</math></award>
    </answer></p>
    <feedback name="ffc" condition="$award1">
        <p name="pfc">You got full credit!</p>
    </feedback>
    <feedback name="fra" condition="$award1.creditAchieved=1">
        <p name="pra">You typed the right answer!</p>
    </feedback>
    <feedback name="fba" condition="$award2.awarded" >
        <p name="pba">That's a bad answer.</p>
    </feedback>

  `,
        });

        await test_three_feedbacks(core, resolvePathToNodeIdx, true);
    });

    it("feedback from full awards", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer name="ans">
    <mathInput name="mi" />
    <award name="award1" credit="0.1"><when>$mi > 1</when></award>
    <award name="award2"><when>$mi > 10</when></award>
    <award name="award3" credit="0.2"><when>$mi > 2</when></award>
    <award name="award4" credit="0.1"><when>$mi > 0.9</when></award>
    <award name="award5" credit="0"><when>$mi < 0</when></award>
  </answer></p>
  <p>Credit achieved: <number extend="$ans.creditAchieved" name="ca" /></p>
  <feedback name="f1" condition="$award1">
    <p>Larger than 1</p>
  </feedback>
  <feedback name="f2" condition="$award2.awarded" >
    <p>Larger than 10</p>
  </feedback>
  <feedback name="f3" condition="$award3">
    <p>Larger than 2</p>
  </feedback>
  <feedback name="f4" condition="$award4.awarded">
    <p>Larger than 0.9</p>
  </feedback>
  <feedback name="f5" condition="$award5">
    <p>A negative number?</p>
  </feedback>
  `,
        });

        async function check_items(submittedResponse: number | undefined) {
            let creditAchieved = 0;
            let awardReceived: number | null = null;
            if (submittedResponse !== undefined) {
                if (submittedResponse > 10) {
                    creditAchieved = 1;
                    awardReceived = 2;
                } else if (submittedResponse > 2) {
                    creditAchieved = 0.2;
                    awardReceived = 3;
                } else if (submittedResponse > 1) {
                    creditAchieved = 0.1;
                    awardReceived = 1;
                } else if (submittedResponse > 0.9) {
                    creditAchieved = 0.1;
                    awardReceived = 4;
                } else if (submittedResponse < 0) {
                    awardReceived = 5;
                }
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ca")].stateValues
                    .value,
            ).eq(creditAchieved);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(creditAchieved);

            for (let awardNum = 1; awardNum <= 5; awardNum++) {
                if (awardNum === awardReceived) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`f${awardNum}`)
                        ].stateValues.hidden,
                    ).eq(false);
                } else {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`f${awardNum}`)
                        ].stateValues.hidden,
                    ).eq(true);
                }
            }
        }

        let submittedResponse: number | undefined = undefined;

        await check_items(submittedResponse);

        submittedResponse = 11;
        await updateMathInputValue({
            latex: submittedResponse.toString(),
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        submittedResponse = 10;
        await updateMathInputValue({
            latex: submittedResponse.toString(),
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        submittedResponse = 2;
        await updateMathInputValue({
            latex: submittedResponse.toString(),
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        submittedResponse = 1;
        await updateMathInputValue({
            latex: submittedResponse.toString(),
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        submittedResponse = 0;
        await updateMathInputValue({
            latex: submittedResponse.toString(),
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        submittedResponse = -1;
        await updateMathInputValue({
            latex: submittedResponse.toString(),
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);
    });

    it("feedback from copied awards", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><answer name="ans1">
        <mathInput name="mi1" />
        <award name="xy"><math>x+y</math></award>
        <award name="x" credit="0.5"><math>x</math></award>
    </answer></p>
    <feedback name="f1" condition="$xy">
        <p>You got award 1.</p>
    </feedback>
    <feedback name="f2" condition="$x.awarded">
        <p>You got award 2.</p>
    </feedback>
    <p><answer name="ans2">
        <mathInput name="mi2" />
        <award extend="$xy" name="xy2" credit="0.5" />
        <award extend="$x" name="x2" credit="1"/>
    </answer></p>
    <feedback name="f3" condition="$xy2">
        <p>You got award 3.</p>
    </feedback>
    <feedback name="f4" condition="$x2.awarded">
        <p>You got award 4.</p>
    </feedback>
  `,
        });

        async function check_items(
            ans1Response: string | undefined,
            ans2Response: string | undefined,
        ) {
            let credit1 = 0,
                credit2 = 0;

            let award1 = false,
                award2 = false,
                award3 = false,
                award4 = false;

            if (ans1Response === "x+y") {
                credit1 = 1;
                award1 = true;
            } else if (ans1Response === "x") {
                credit1 = 0.5;
                award2 = true;
            }

            if (ans2Response === "x+y") {
                credit2 = 0.5;
                award3 = true;
            } else if (ans2Response === "x") {
                credit2 = 1;
                award4 = true;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .creditAchieved,
            ).eq(credit1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .creditAchieved,
            ).eq(credit2);

            expect(
                stateVariables[await resolvePathToNodeIdx("f1")].stateValues
                    .hidden,
            ).eq(!award1);
            expect(
                stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                    .hidden,
            ).eq(!award2);
            expect(
                stateVariables[await resolvePathToNodeIdx("f3")].stateValues
                    .hidden,
            ).eq(!award3);
            expect(
                stateVariables[await resolvePathToNodeIdx("f4")].stateValues
                    .hidden,
            ).eq(!award4);
        }

        let ans1Response: string | undefined = undefined;
        let ans2Response: string | undefined = undefined;

        await check_items(ans1Response, ans2Response);

        // Submit correct answer 1
        ans1Response = "x+y";
        await updateMathInputValue({
            latex: ans1Response,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        await check_items(ans1Response, ans2Response);

        // Submit wrong answer 1
        ans1Response = "x";
        await updateMathInputValue({
            latex: ans1Response,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        await check_items(ans1Response, ans2Response);

        // Submit wrong answer 2
        ans2Response = "x+y";
        await updateMathInputValue({
            latex: ans2Response,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        await check_items(ans1Response, ans2Response);

        // Submit correct answer 2
        ans2Response = "x";
        await updateMathInputValue({
            latex: ans2Response,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        await check_items(ans1Response, ans2Response);

        // Enter different wrong answer 1
        ans1Response = "y";
        await updateMathInputValue({
            latex: ans1Response,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        await check_items(ans1Response, ans2Response);

        // Enter different wrong answer 2
        ans2Response = "y";
        await updateMathInputValue({
            latex: ans2Response,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        await check_items(ans1Response, ans2Response);
    });

    async function test_feedback_from_multiple_choice(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(submittedChoice?: string) {
            let credit = 0;
            if (submittedChoice === "dog") {
                credit = 1;
            } else if (submittedChoice === "cow") {
                credit = 0.2;
            } else if (
                submittedChoice === "cat" ||
                submittedChoice === "mouse"
            ) {
                credit = 0.1;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ca")].stateValues
                    .value,
            ).eq(credit);

            for (let animal of ["dog", "cat", "cow", "mouse", "banana"]) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`f${animal}`)]
                        .stateValues.hidden,
                ).eq(submittedChoice !== animal);
            }
        }

        const stateVariables = await core.returnAllStateVariables(false, true);
        const choiceTexts: string[] =
            stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                .choiceTexts;

        await check_items();

        // Select dog
        let selectedChoice = "dog";
        let selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items();

        // Submit answer
        let submittedChoice = selectedChoice;
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedChoice);

        // submit cow
        submittedChoice = selectedChoice = "cow";
        selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedChoice);

        // submit cat
        submittedChoice = selectedChoice = "cat";
        selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedChoice);

        // submit mouse
        submittedChoice = selectedChoice = "mouse";
        selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedChoice);

        // submit banana
        submittedChoice = selectedChoice = "banana";
        selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedChoice);
    }

    it("feedback from multiple choice", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer name="ans">
    <choiceInput shuffleOrder name="ci">
    <choice name="choice1" credit="0.1">cat</choice>
    <choice name="choice2" credit="1">dog</choice>
    <choice name="choice3" credit="0.2">cow</choice>
    <choice name="choice4" credit="0.1">mouse</choice>
    <choice name="choice5">banana</choice>
    </choiceInput>
  </answer></p>
  <p>Credit achieved: <number extend="$ans.creditAchieved" name="ca" /></p>
  <feedback name="fcat" condition="$choice1">
    <p>Meow</p>
  </feedback>P
  <feedback name="fdog" condition="$choice2.submitted">
    <p>Ruff</p>
  </feedback>
  <feedback name="fcow" condition="$choice3">
    <p>Moo</p>
  </feedback>
  <feedback name="fmouse" condition="$choice4.submitted">
    <p>Squeak</p>
  </feedback>
  <feedback name="fbanana" condition="$choice5">
    <p>Huh?</p>
  </feedback>
  `,
        });

        await test_feedback_from_multiple_choice(core, resolvePathToNodeIdx);
    });

    it("feedback from multiple choice, some choices inside shuffle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer name="ans">
    <choiceInput name="ci">
    <choice name="choice1" credit="0.1">cat</choice>
    <shuffle>
        <choice name="choice2" credit="1">dog</choice>
        <choice name="choice3" credit="0.2">cow</choice>
    </shuffle>
    <choice name="choice4" credit="0.1">mouse</choice>
    <choice name="choice5">banana</choice>
    </choiceInput>
  </answer></p>
  <p>Credit achieved: <number extend="$ans.creditAchieved" name="ca" /></p>
  <feedback name="fcat" condition="$choice1">
    <p>Meow</p>
  </feedback>P
  <feedback name="fdog" condition="$choice2.submitted">
    <p>Ruff</p>
  </feedback>
  <feedback name="fcow" condition="$choice3">
    <p>Moo</p>
  </feedback>
  <feedback name="fmouse" condition="$choice4.submitted">
    <p>Squeak</p>
  </feedback>
  <feedback name="fbanana" condition="$choice5">
    <p>Huh?</p>
  </feedback>
  `,
        });

        await test_feedback_from_multiple_choice(core, resolvePathToNodeIdx);
    });

    it("feedback from multiple choice, copied choices, some choices inside shuffle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer name="ans1">
    <choiceInput name="ci1">
      <choice name="cat1" credit="0.1">cat</choice>
      <shuffle>
        <choice credit="1" name="dog1">dog</choice>
        <choice name="cow1">cow</choice>
      </shuffle>
    </choiceInput>
  </answer></p>
  <p>Credit achieved 1: <number extend="$ans1.creditAchieved" name="ca1" /></p>
  <feedback name="f1cat" condition="$cat1">
    <p>Meow</p>
  </feedback>
  <feedback name="f1dog" condition="$dog1.submitted">
    <p>Ruff</p>
  </feedback>
  <feedback name="f1cow" condition="$cow1">
    <p>Moo</p>
  </feedback>

  <p><answer name="ans2">
    <choiceInput name="ci2">
      <choice extend="$dog1" name="dog2" credit="0.1"/>
      <shuffle>
        <choice extend="$cow1" name="cow2" />
        <choice extend="$cat1" name="cat2" credit="1" />
      </shuffle>
    </choiceInput>
  </answer></p>
  <p>Credit achieved 2: <number extend="$ans2.creditAchieved" name="ca2" /></p>
  <feedback name="f2dog" condition="$dog2">
    <p>Ruff</p>
  </feedback>
  <feedback name="f2cat" condition="$cat2.submitted">
    <p>Meow</p>
  </feedback>
  <feedback name="f2cow" condition="$cow2">
    <p>Moo</p>
  </feedback>
  `,
            requestedVariantIndex: 2,
        });

        async function check_items(
            submittedChoice1?: string,
            submittedChoice2?: string,
        ) {
            let credit1 = 0;
            if (submittedChoice1 === "dog") {
                credit1 = 1;
            } else if (submittedChoice1 === "cat") {
                credit1 = 0.1;
            }
            let credit2 = 0;
            if (submittedChoice2 === "cat") {
                credit2 = 1;
            } else if (submittedChoice2 === "dog") {
                credit2 = 0.1;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ca1")].stateValues
                    .value,
            ).eq(credit1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ca2")].stateValues
                    .value,
            ).eq(credit2);

            for (let animal of ["dog", "cat", "cow"]) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`f1${animal}`)]
                        .stateValues.hidden,
                ).eq(submittedChoice1 !== animal);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`f2${animal}`)]
                        .stateValues.hidden,
                ).eq(submittedChoice2 !== animal);
            }
        }

        const stateVariables = await core.returnAllStateVariables(false, true);
        const choiceTexts1: string[] =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues
                .choiceTexts;
        const choiceTexts2: string[] =
            stateVariables[await resolvePathToNodeIdx("ci2")].stateValues
                .choiceTexts;

        await check_items();

        // Submit dog1
        let submittedChoice1 = "dog";
        let selectedIndex1 = choiceTexts1.indexOf(submittedChoice1) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci1"),
            selectedIndices: [selectedIndex1],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        await check_items(submittedChoice1);

        // submit cow1
        submittedChoice1 = "cow";
        selectedIndex1 = choiceTexts1.indexOf(submittedChoice1) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci1"),
            selectedIndices: [selectedIndex1],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        await check_items(submittedChoice1);

        // Submit dog2
        let submittedChoice2 = "dog";
        let selectedIndex2 = choiceTexts2.indexOf(submittedChoice2) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci2"),
            selectedIndices: [selectedIndex2],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        await check_items(submittedChoice1, submittedChoice2);

        // Submit cat2
        submittedChoice2 = "cat";
        selectedIndex2 = choiceTexts2.indexOf(submittedChoice2) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci2"),
            selectedIndices: [selectedIndex2],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        await check_items(submittedChoice1, submittedChoice2);

        // Submit cat1
        submittedChoice1 = "cat";
        selectedIndex1 = choiceTexts1.indexOf(submittedChoice1) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci1"),
            selectedIndices: [selectedIndex1],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        await check_items(submittedChoice1, submittedChoice2);

        // Submit cow2
        submittedChoice2 = "cow";
        selectedIndex2 = choiceTexts2.indexOf(submittedChoice2) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci2"),
            selectedIndices: [selectedIndex2],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        await check_items(submittedChoice1, submittedChoice2);
    });

    it("feedback for any incorrect response", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer type="text" name="ans">hello there</answer></p>
  <feedback name="f" condition="$(ans.creditAchieved) != 1 and $(ans.responseHasBeenSubmitted) ">
    <p name="p">Your response <em>$ans.submittedresponse</em> is incorrect.</p>
  </feedback>
  `,
        });

        async function check_items(response?: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let credit = response === "hello there" ? 1 : 0;
            let hidden = response === undefined || response === "hello there";

            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(credit);
            expect(
                stateVariables[await resolvePathToNodeIdx("f")].stateValues
                    .hidden,
            ).eq(hidden);
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .hidden,
            ).eq(hidden);

            if (!hidden) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p")].stateValues
                        .text,
                ).eq(`Your response ${response} is incorrect.`);
            }
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        let tiIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        await check_items();

        // Submit incorrect answer
        let response = "wrong";
        await updateTextInputValue({
            text: response,
            componentIdx: tiIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(response);

        // Submit correct answer
        response = "hello there";
        await updateTextInputValue({
            text: response,
            componentIdx: tiIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(response);

        // Submit blank answer
        response = "";
        await updateTextInputValue({
            text: response,
            componentIdx: tiIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(response);

        // Submit another incorrect answer
        response = "bye";
        await updateTextInputValue({
            text: response,
            componentIdx: tiIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(response);
    });

    async function test_feedback_defined_in_awards(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        wrongCosCode?: boolean,
    ) {
        async function check_items(submittedLatex?: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            if (submittedLatex === "\\sin(\\pi x)") {
                if (
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.justSubmitted
                ) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(1);
                }
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback1")]
                        .stateValues.feedbackText,
                ).eq("Good job!");
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback1")]
                        .stateValues.hide,
                ).eq(false);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback4")]
                        .stateValues.feedbackText,
                ).eq("Good job!");
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback4")]
                        .stateValues.hide,
                ).eq(false);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback2")]
                        .stateValues.hide,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback3")]
                        .stateValues.hide,
                ).eq(true);
            } else if (submittedLatex === "\\cos(\\pi x)") {
                if (
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.justSubmitted
                ) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0.7);
                }
                if (wrongCosCode) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("feedback2")]
                            .stateValues.hide,
                    ).eq(true);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("feedback4")]
                            .stateValues.hide,
                    ).eq(true);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("feedback2")]
                            .stateValues.feedbackText,
                    ).eq("Close, but wrong trigonometric function");
                    expect(
                        stateVariables[await resolvePathToNodeIdx("feedback2")]
                            .stateValues.hide,
                    ).eq(false);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("feedback4")]
                            .stateValues.feedbackText,
                    ).eq("Close, but wrong trigonometric function");
                    expect(
                        stateVariables[await resolvePathToNodeIdx("feedback4")]
                            .stateValues.hide,
                    ).eq(false);
                }
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback1")]
                        .stateValues.hide,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback3")]
                        .stateValues.hide,
                ).eq(true);
            } else if (submittedLatex === "\\sin(x)") {
                if (
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.justSubmitted
                ) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0.3);
                }
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback3")]
                        .stateValues.feedbackText,
                ).eq("You lost pi");
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback3")]
                        .stateValues.hide,
                ).eq(false);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback4")]
                        .stateValues.feedbackText,
                ).eq("You lost pi");
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback4")]
                        .stateValues.hide,
                ).eq(false);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback1")]
                        .stateValues.hide,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback2")]
                        .stateValues.hide,
                ).eq(true);
            } else {
                if (
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.justSubmitted
                ) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0);
                }
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback1")]
                        .stateValues.hide,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback2")]
                        .stateValues.hide,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback3")]
                        .stateValues.hide,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("feedback4")]
                        .stateValues.hide,
                ).eq(true);
            }
        }

        await check_items();

        // submit blank answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items();

        // Type sin(pi x)
        let response = "\\sin(\\pi x)";
        await updateMathInputValue({
            latex: response,
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await check_items();

        // Submit answer
        let submittedResponse = response;
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        // Type cos(pi x)
        response = "\\cos(\\pi x)";
        await updateMathInputValue({
            latex: response,
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await check_items(submittedResponse);

        // Submit answer
        submittedResponse = response;
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        // Submit x
        submittedResponse = response = "x";
        await updateMathInputValue({
            latex: response,
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);

        // Submit sin(x)
        submittedResponse = response = "\\sin(x)";
        await updateMathInputValue({
            latex: response,
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(submittedResponse);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
    }

    it("feedback defined in awards", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer name="ans">
    <mathInput name="mi" />
    <award name="award1" feedbackCodes="goodjob"><math>sin(pi x)</math></award>
    <award name="award2" credit="0.7" feedbackText="Close, but wrong trigonometric function"><math>cos(pi x)</math></award>
    <award name="award3" credit="0.3" feedbackText="You lost pi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <feedback extend="$award1.feedback" name="feedback1" />
  
  <p>Award 2 feedback:</p>
  <feedback extend="$award2.feedback" name="feedback2" />

  <p>Award 3 feedback:</p>
  <feedback extend="$award3.feedback" name="feedback3" />

  <p>Answer feedbacks:</p>
  <feedback extend="$ans.feedbacks" name="feedback4" />
  `,
        });

        await test_feedback_defined_in_awards(core, resolvePathToNodeIdx);
    });

    it("feedback defined in awards, new feedback definitions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="Close, but wrong trigonometric function" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>

  <p><answer name="ans">
    <mathInput name="mi" />
    <award name="award1" feedbackCodes="goodJob"><math>sin(pi x)</math></award>
    <award name="award2" credit="0.7" feedbackCodes="wrongTRIG"><math>cos(pi x)</math></award>
    <award name="award3" credit="0.3" feedbackCodes="lostpi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <feedback extend="$award1.feedback" name="feedback1" />
  
  <p>Award 2 feedback:</p>
  <feedback extend="$award2.feedback" name="feedback2" />

  <p>Award 3 feedback:</p>
  <feedback extend="$award3.feedback" name="feedback3" />

  <p>Answer feedbacks:</p>
  <feedback extend="$ans.feedbacks" name="feedback4" />

  `,
        });

        await test_feedback_defined_in_awards(core, resolvePathToNodeIdx);
    });

    it("feedback defined in awards, new feedback definitions in document and section", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="typo here" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>

  <section>
    <setup>
      <feedbackDefinitions>
        <feedbackDefinition code="wrongTrig" text="Close, but wrong trigonometric function" />
      </feedbackDefinitions>
    </setup>

    <p><answer name="ans">
      <mathInput name="mi" />
      <award name="award1" feedbackCodes="goodJob"><math>sin(pi x)</math></award>
      <award name="award2" credit="0.7" feedbackCodes="wrongTRIG"><math>cos(pi x)</math></award>
      <award name="award3" credit="0.3" feedbackCodes="lostpi"><math>sin(x)</math></award>
    </answer></p>

    <p>Award 1 feedback:</p>
    <feedback extend="$award1.feedback" name="feedback1" />
    
    <p>Award 2 feedback:</p>
    <feedback extend="$award2.feedback" name="feedback2" />

    <p>Award 3 feedback:</p>
    <feedback extend="$award3.feedback" name="feedback3" />

    <p>Answer feedbacks:</p>
    <feedback extend="$ans.feedbacks" name="feedback4" />
  </section>
  `,
        });

        await test_feedback_defined_in_awards(core, resolvePathToNodeIdx);
    });

    it("feedback defined in awards, new feedback definitions in document, incorrect codes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="Close, but wrong trigonometric function" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>


  <p><answer name="ans">
    <mathInput name="mi" />
    <award name="award1" feedbackCodes="goodJob"><math>sin(pi x)</math></award>
    <award name="award2" credit="0.7" feedbackCodes="wrongTRIGbad"><math>cos(pi x)</math></award>
    <award name="award3" credit="0.3" feedbackCodes="lostpi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <feedback extend="$award1.feedback" name="feedback1" />
  
  <p>Award 2 feedback:</p>
  <feedback extend="$award2.feedback" name="feedback2" />

  <p>Award 3 feedback:</p>
  <feedback extend="$award3.feedback" name="feedback3" />

  <p>Answer feedbacks:</p>
  <feedback extend="$ans.feedbacks" name="feedback4" />

  `,
        });

        await test_feedback_defined_in_awards(core, resolvePathToNodeIdx, true);
    });

    async function test_feedback_defined_in_choices(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        feedbacks: Record<string, string[]>,
    ) {
        async function check_items(response?: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (response === "cat") {
                if (
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.justSubmitted
                ) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0.5);
                }
                for (let i = 1; i <= 2; i++) {
                    let feedbackText = feedbacks.cat[i - 1];
                    if (feedbackText) {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`f${i}`)]
                                .stateValues.feedbackText,
                        ).eq(feedbackText);
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`f${i}`)]
                                .stateValues.hide,
                        ).eq(false);
                    } else {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`f${i}`)]
                                .stateValues.hide,
                        ).eq(true);
                    }
                }
            } else if (response === "dog") {
                if (
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.justSubmitted
                ) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(1);
                }
                for (let i = 1; i <= 2; i++) {
                    let feedbackText = feedbacks.dog[i - 1];
                    if (feedbackText) {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`f${i}`)]
                                .stateValues.feedbackText,
                        ).eq(feedbackText);
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`f${i}`)]
                                .stateValues.hide,
                        ).eq(false);
                    } else {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`f${i}`)]
                                .stateValues.hide,
                        ).eq(true);
                    }
                }
            } else {
                if (
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.justSubmitted
                ) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0);
                }
                expect(
                    stateVariables[await resolvePathToNodeIdx("f1")].stateValues
                        .hide,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                        .hide,
                ).eq(true);
            }
        }

        const stateVariables = await core.returnAllStateVariables(false, true);
        const choiceTexts: string[] =
            stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                .choiceTexts;

        await check_items();

        // Select correct answer
        let selectedChoice = "dog";
        let selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items();

        // submit answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        let submittedChoice = selectedChoice;
        await check_items(submittedChoice);

        // Select half correct answer
        selectedChoice = "cat";
        selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(submittedChoice);

        // submit answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        submittedChoice = selectedChoice;
        await check_items(submittedChoice);

        // Select incorrect answer
        selectedChoice = "monkey";
        selectedIndex = choiceTexts.indexOf(selectedChoice) + 1;
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(submittedChoice);

        // submit answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        submittedChoice = selectedChoice;
        await check_items(submittedChoice);
    }

    it("feedback defined in choices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>
    <answer name="ans">
      <choiceInput shuffleOrder name="ci">
      <choice feedbackText="meow" credit="0.5">cat</choice>
      <choice feedbackCodes="goodjob" credit="1">dog</choice>
      <choice>monkey</choice>
      </choiceInput>
    </answer>
  </p>

  <p>Answer feedbacks:</p>
  <feedback extend="$ans.feedback1" name="f1" />
  <feedback extend="$ans.feedback2" name="f2" />
  `,
        });

        let feedbacks = {
            dog: ["Good job!"],
            cat: ["meow"],
        };

        await test_feedback_defined_in_choices(
            core,
            resolvePathToNodeIdx,
            feedbacks,
        );
    });

    it("feedback defined in choices, new feedback definitions in document and section", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="catSays" text="Meow" />
      <feedbackDefinition code="dogSays" text="Woof" />
    </feedbackDefinitions>
  </setup>

  <section>
    <setup>
      <feedbackDefinitions>
        <feedbackDefinition code="dogAlsoSays" text="Grrr" />
      </feedbackDefinitions>
    </setup>


    <p>
        <answer name="ans">
            <choiceInput shuffleOrder name="ci">
                <choice feedbackCodes="catsays" credit="0.5">cat</choice>
                <choice feedbackCodes="DogSays dogalsosays" credit="1">dog</choice>
            <choice>monkey</choice>
            </choiceInput>
        </answer>
    </p>

    <p>Answer feedbacks:</p>
    <feedback extend="$ans.feedback1" name="f1" />
    <feedback extend="$ans.feedback2" name="f2" />

  </section>
  `,
        });

        let feedbacks = {
            dog: ["Woof", "Grrr"],
            cat: ["Meow"],
        };

        await test_feedback_defined_in_choices(
            core,
            resolvePathToNodeIdx,
            feedbacks,
        );
    });

    it("feedback updated with target", async () => {
        let doenetML = `
    <mathInput name="mi" />
    <answer name="ans">
      <award>
        <when>$mi = x</when>
      </award>
    </answer>
    
    <feedback condition="$mi=y" updateWith="$ans" name="fback"><p>You typed y!</p></feedback>
    `;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(false);

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(false);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            flags: { showFeedback: false },
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);
    });

    it("feedback based on booleans, updated with target", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="m1" />
  <mathInput name="m2" />
  <boolean name="got1">$m1 = x</boolean>
  <boolean name="got2">$m2 = y</boolean>
  <answer name="ans">
    <award>
      <when>$got1 and $got2</when>
    </award>
    <considerAsResponses>$m1 $m2</considerAsResponses>
  </answer>

  <p>Submitted responses: <mathList extend="$ans.submittedResponses" name="rs" /></p>
  
  <subsection>
    <title>Desired feedback behavior</title>
    <feedback condition="$got1 and not $got2" updateWith="$ans" name="fback1"><p>You got the first; what about the second?</p></feedback>
    <feedback condition="$got2 and not $got1" updateWith="$ans" name="fback2"><p>You got the second; what about the first?</p></feedback>
  </subsection>
  <subsection>
    <title>Default feedback behavior</title>
    <feedback condition="$got1 and not $got2" name="fback1b"><p>You got the first; what about the second?</p></feedback>
    <feedback condition="$got2 and not $got1" name="fback2b"><p>You got the second; what about the first?</p></feedback>
  </subsection>


  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(true);
        expect(stateVariables[await resolvePathToNodeIdx("rs[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("rs[2]")]).eq(
            undefined,
        );

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[1]")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[2]")].stateValues
                .value.tree,
        ).eq("\uff3f");

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[1]")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[2]")].stateValues
                .value.tree,
        ).eq("\uff3f");

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[1]")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[2]")].stateValues
                .value.tree,
        ).eq("y");

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[1]")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[2]")].stateValues
                .value.tree,
        ).eq("y");

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[1]")].stateValues
                .value.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[2]")].stateValues
                .value.tree,
        ).eq("y");

        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[1]")].stateValues
                .value.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[2]")].stateValues
                .value.tree,
        ).eq("y");

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback1b")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback2b")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[1]")].stateValues
                .value.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("rs[2]")].stateValues
                .value.tree,
        ).eq("\uff3f");
    });

    it("feedback based on fractionSatisfied/creditAchieved of award", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer matchPartial name="ans">
    <mathInput name="mi1" /> <mathInput name="mi2" />
    <award name="small"><when>$mi1 < 1 and $mi2 < 1</when></award>
    <award name="medium" credit="0.5"><when>$mi1 < 2 and $mi2 < 2</when></award>
    <award name="large" credit="0"><when>$mi1 < 3 and $mi2 < 3</when></award>
  </answer></p>
  <feedback name="close" condition="$(medium.creditAchieved) > $(small.creditAchieved)">
  <p>A number or two is close but not quite.</p>
  </feedback>
  <feedback name="goodAndClose" condition="$(medium.fractionSatisfied) > $(small.fractionSatisfied) > 0">
  <p>One number is good, the other number is close but not quite.</p>
  </feedback>
  <feedback name="startingClose" condition="$(large.fractionSatisfied) > 0 and $(medium.fractionSatisfied) = 0">
  <p>A number or two is starting to get close.</p>
  </feedback>
  <feedback name="closeStartingClose" condition="$(large.fractionSatisfied) >  $(medium.fractionSatisfied) > $(small.fractionSatisfied)">
  <p>A number is close but not quite; the other number is starting to get close.</p>
  </feedback>
  <feedback name="goodStartingClose" condition="$(large.fractionSatisfied) > $(small.fractionSatisfied) > 0 and  $(small.fractionSatisfied) =  $(medium.fractionSatisfied)">
  <p>One number is good, the other number is starting to get close.</p>
  </feedback>
  <feedback name="good" condition="1 > $(small.fractionSatisfied) > 0 and $(small.fractionSatisfied) = $(medium.fractionSatisfied) = $(large.fractionSatisfied)">
  <p>One number is good.</p>
  </feedback>
  `,
        });

        let feedbackNames = [
            "close",
            "goodAndClose",
            "startingClose",
            "closeStartingClose",
            "goodStartingClose",
            "good",
        ];

        async function check_items(
            credit: number,
            justSubmitted: boolean,
            feedbacksChosen: string[] = [],
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(credit);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .justSubmitted,
            ).eq(justSubmitted);

            for (let fName of feedbackNames) {
                let hidden = !feedbacksChosen.includes(fName);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${fName}`)]
                        .stateValues.hidden,
                ).eq(hidden);
            }
        }

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0, true);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(0, false);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0, true, ["startingClose"]);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(0, false, ["startingClose"]);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0.25, true, ["close"]);

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(0.25, false, ["close"]);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0.5, true, ["good"]);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check_items(0.5, false, ["good"]);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0.5, true, ["goodStartingClose"]);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check_items(0.5, false, ["goodStartingClose"]);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0.5, true, ["goodAndClose"]);

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check_items(0.5, false, ["goodAndClose"]);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(1, true);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check_items(1, false);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0.5, true, ["close"]);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(0.5, false, ["close"]);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_items(0.25, true, ["close", "closeStartingClose"]);
    });

    it("feedback with no condition", async () => {
        let doenetML = `
    <feedback name="fback"><p>Good job!</p></feedback>
    `;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(false);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            flags: { showFeedback: false },
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fback")].stateValues
                .hidden,
        ).eq(true);
    });

    it("feedback inside invalid children", async () => {
        // The following DoenetML was a minimal working example to trigger a bug
        // where the children of li1 where not being updated on the second submission
        // (due to being marked stale from invalid children in the middle of the first
        // time that they were being updated)
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <text>a</text>
        <p>
          <graph />
          <ul>
            <li name="li1">
              x: <answer name="ans"><mathInput name="mi" />x</answer>   
              <feedback name="fb" condition="$ans.numSubmissions > 1">You answered at least twice</feedback>
            </li>
            <li name="li2"><p name="p">$ans</p></li>
          </ul>
        </p>
        `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fb")].stateValues.hidden,
        ).eq(true);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("fb")].stateValues.hidden,
        ).eq(true);

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("fb")].stateValues.hidden,
        ).eq(false);
    });

    it("feedback from numSubmissions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer name="ans">x</answer></p>
  <feedback condition="$ans.numSubmissions > 1">
    <p name="pSub">You answered more than once!</p>
  </feedback>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("pSub")].stateValues
                .hidden,
        ).eq(true);

        // Submit first time
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pSub")].stateValues
                .hidden,
        ).eq(true);

        // Submit second time
        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("pSub")].stateValues
                .hidden,
        ).eq(false);

        // Submit third time
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pSub")].stateValues
                .hidden,
        ).eq(false);
    });
});
