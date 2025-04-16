import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Problem tag tests", async () => {
    async function test_section_credit(
        core: PublicDoenetMLCore,
        check_items: (arg: number[]) => Promise<void>,
    ) {
        let ansCredits = Array(9).fill(0);

        await check_items(ansCredits);

        let stateVariables = await core.returnAllStateVariables(false, true);

        let mathinput1Name =
            stateVariables["/ans1"].stateValues.inputChildren[0].componentIdx;
        let mathinput2Name =
            stateVariables["/ans2"].stateValues.inputChildren[0].componentIdx;
        let mathinput3Name =
            stateVariables["/ans3"].stateValues.inputChildren[0].componentIdx;
        let mathinput4Name =
            stateVariables["/ans4"].stateValues.inputChildren[0].componentIdx;
        let mathinput5Name =
            stateVariables["/ans5"].stateValues.inputChildren[0].componentIdx;
        let mathinput6Name =
            stateVariables["/ans6"].stateValues.inputChildren[0].componentIdx;
        let mathinput7Name =
            stateVariables["/ans7"].stateValues.inputChildren[0].componentIdx;
        let mathinput8Name =
            stateVariables["/ans8"].stateValues.inputChildren[0].componentIdx;
        let mathinput9Name =
            stateVariables["/ans9"].stateValues.inputChildren[0].componentIdx;

        // enter first correct answer
        await updateMathInputValue({ latex: "u", name: mathinput1Name, core });
        await submitAnswer({ name: "/ans1", core });
        ansCredits[0] = 1;
        await check_items(ansCredits);

        // enter additional correct answers
        await updateMathInputValue({ latex: "y", name: mathinput3Name, core });
        await submitAnswer({ name: "/ans3", core });
        ansCredits[2] = 1;
        await updateMathInputValue({ latex: "v", name: mathinput5Name, core });
        await submitAnswer({ name: "/ans5", core });
        ansCredits[4] = 1;
        await updateMathInputValue({ latex: "q", name: mathinput7Name, core });
        await submitAnswer({ name: "/ans7", core });
        ansCredits[6] = 1;
        await check_items(ansCredits);

        // enter most other correct answers
        await updateMathInputValue({ latex: "x", name: mathinput2Name, core });
        await submitAnswer({ name: "/ans2", core });
        ansCredits[1] = 1;
        await updateMathInputValue({ latex: "z", name: mathinput4Name, core });
        await submitAnswer({ name: "/ans4", core });
        ansCredits[3] = 1;
        await updateMathInputValue({ latex: "w", name: mathinput6Name, core });
        await submitAnswer({ name: "/ans6", core });
        ansCredits[5] = 1;
        await updateMathInputValue({ latex: "r", name: mathinput8Name, core });
        await submitAnswer({ name: "/ans8", core });
        ansCredits[7] = 1;
        await check_items(ansCredits);

        // enter last correct answer
        await updateMathInputValue({ latex: "s", name: mathinput9Name, core });
        await submitAnswer({ name: "/ans9", core });
        ansCredits[8] = 1;
        await check_items(ansCredits);
    }

    it("problems default to weight 1", async () => {
        let core = await createTestCore({
            doenetML: `
    <document name="doc">
    <title>Activity</title>
    <p>Credit achieved for $doc.title:
    $doc.creditAchieved{assignNames="docCa"}, or $doc.percentCreditAchieved{assignNames="docPca"}%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <problem name="problem1"><title>Problem 1</title>
      <p>Credit achieved for $problem1.title:
      $problem1.creditAchieved{assignNames="problem1Ca"}, or $problem1.percentCreditAchieved{assignNames="problem1Pca"}%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </problem>
    <problem name="problem2"><title>Problem 2</title>
      <p>Credit achieved for $problem2.title:
      $problem2.creditAchieved{assignNames="problem2Ca"}, or $problem2.percentCreditAchieved{assignNames="problem2Pca"}%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <problem name="problem21"><title>Problem 2.1</title>
        <p>Credit achieved for $problem21.title:
        $problem21.creditAchieved{assignNames="problem21Ca"}, or $problem21.percentCreditAchieved{assignNames="problem21Pca"}%</p>

        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </problem>
      <problem name="problem22"><title>Problem 2.2</title>
        <p>Credit achieved for $problem22.title:
        $problem22.creditAchieved{assignNames="problem22Ca"}, or $problem22.percentCreditAchieved{assignNames="problem22Pca"}%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <problem name="problem221"><title>Problem 2.2.1</title>
          <p>Credit achieved for $problem221.title:
          $problem221.creditAchieved{assignNames="problem221Ca"}, or $problem221.percentCreditAchieved{assignNames="problem221Pca"}%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </problem>
        <problem name="problem222"><title>Problem 2.2.2</title>
          <p>Credit achieved for $problem222.title:
          $problem222.creditAchieved{assignNames="problem222Ca"}, or $problem222.percentCreditAchieved{assignNames="problem222Pca"}%</p>

          <p>Enter <m>s</m>: <answer name="ans9" weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    </document>
    `,
        });

        let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];

        let sectionNames = [
            "/doc",
            "/problem1",
            "/problem2",
            "/problem21",
            "/problem22",
            "/problem221",
            "/problem222",
        ];

        async function check_items(ansCredits: number[]) {
            let sectionCredits = Array(7).fill(0);

            // section 1
            sectionCredits[1] =
                (ansCredits[1] * weight[1] + ansCredits[2] * weight[2]) /
                (weight[1] + weight[2]);

            // section 21
            sectionCredits[3] =
                (ansCredits[4] * weight[4] + ansCredits[5] * weight[5]) /
                (weight[4] + weight[5]);
            // section 221
            sectionCredits[5] = ansCredits[7];
            // section 222
            sectionCredits[6] = ansCredits[8];

            // section 22
            sectionCredits[4] =
                (ansCredits[6] * weight[6] +
                    sectionCredits[5] +
                    sectionCredits[6]) /
                (weight[6] + 2);

            // section 2
            sectionCredits[2] =
                (ansCredits[3] * weight[3] +
                    sectionCredits[3] +
                    sectionCredits[4]) /
                (weight[3] + 2);

            // doc
            sectionCredits[0] =
                (ansCredits[0] * weight[0] +
                    sectionCredits[1] +
                    sectionCredits[2]) /
                (weight[0] + 2);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let [i, credit] of ansCredits.entries()) {
                expect(
                    stateVariables[`/ans${i + 1}`].stateValues.creditAchieved,
                ).eq(credit);
            }

            for (let [i, name] of sectionNames.entries()) {
                expect(stateVariables[name].stateValues.creditAchieved).eq(
                    sectionCredits[i],
                );
                expect(
                    stateVariables[name].stateValues.percentCreditAchieved,
                ).eq(sectionCredits[i] * 100);
                expect(stateVariables[`${name}Ca`].stateValues.value).eq(
                    sectionCredits[i],
                );
                expect(stateVariables[`${name}Pca`].stateValues.value).eq(
                    sectionCredits[i] * 100,
                );
            }
        }

        await test_section_credit(core, check_items);
    });

    it("problems with weights", async () => {
        let core = await createTestCore({
            doenetML: `
    <document name="doc">
    <title>Activity</title>
    <p>Credit achieved for $doc.title:
    $doc.creditAchieved{assignNames="docCa"}, or $doc.percentCreditAchieved{assignNames="docPca"}%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <problem name="problem1" weight="0.5"><title>Problem 1</title>
      <p>Credit achieved for $problem1.title:
      $problem1.creditAchieved{assignNames="problem1Ca"}, or $problem1.percentCreditAchieved{assignNames="problem1Pca"}%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </problem>
    <problem name="problem2" weight="2"><title>Problem 2</title>
      <p>Credit achieved for $problem2.title:
      $problem2.creditAchieved{assignNames="problem2Ca"}, or $problem2.percentCreditAchieved{assignNames="problem2Pca"}%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <problem name="problem21" weight="3"><title>Problem 2.1</title>
        <p>Credit achieved for $problem21.title:
        $problem21.creditAchieved{assignNames="problem21Ca"}, or $problem21.percentCreditAchieved{assignNames="problem21Pca"}%</p>


        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </problem>
      <problem name="problem22" weight="4"><title>Problem 2.2</title>
        <p>Credit achieved for $problem22.title:
        $problem22.creditAchieved{assignNames="problem22Ca"}, or $problem22.percentCreditAchieved{assignNames="problem22Pca"}%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <problem name="problem221" weight="5"><title>Problem 2.2.1</title>
          <p>Credit achieved for $problem221.title:
          $problem221.creditAchieved{assignNames="problem221Ca"}, or $problem221.percentCreditAchieved{assignNames="problem221Pca"}%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </problem>
        <problem name="problem222" weight="1"><title>Problem 2.2.2</title>
          <p>Credit achieved for $problem222.title:
          $problem222.creditAchieved{assignNames="problem222Ca"}, or $problem222.percentCreditAchieved{assignNames="problem222Pca"}%</p>

          <p>Enter <m>s</m>: <answer name="ans9" weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    </document>
    `,
        });

        let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];
        let sectionWeight = [NaN, 0.5, 2, 3, 4, 5, 1];

        let sectionNames = [
            "/doc",
            "/problem1",
            "/problem2",
            "/problem21",
            "/problem22",
            "/problem221",
            "/problem222",
        ];

        async function check_items(ansCredits: number[]) {
            let sectionCredits = Array(7).fill(0);

            // section 1
            sectionCredits[1] =
                (ansCredits[1] * weight[1] + ansCredits[2] * weight[2]) /
                (weight[1] + weight[2]);

            // section 21
            sectionCredits[3] =
                (ansCredits[4] * weight[4] + ansCredits[5] * weight[5]) /
                (weight[4] + weight[5]);
            // section 221
            sectionCredits[5] = ansCredits[7];
            // section 222
            sectionCredits[6] = ansCredits[8];

            // section 22
            sectionCredits[4] =
                (ansCredits[6] * weight[6] +
                    sectionCredits[5] * sectionWeight[5] +
                    sectionCredits[6] * sectionWeight[6]) /
                (weight[6] + sectionWeight[5] + sectionWeight[6]);

            // section 2
            sectionCredits[2] =
                (ansCredits[3] * weight[3] +
                    sectionCredits[3] * sectionWeight[3] +
                    sectionCredits[4] * sectionWeight[4]) /
                (weight[3] + sectionWeight[3] + sectionWeight[4]);

            // doc
            sectionCredits[0] =
                (ansCredits[0] * weight[0] +
                    sectionCredits[1] * sectionWeight[1] +
                    sectionCredits[2] * sectionWeight[2]) /
                (weight[0] + sectionWeight[1] + sectionWeight[2]);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let [i, credit] of ansCredits.entries()) {
                expect(
                    stateVariables[`/ans${i + 1}`].stateValues.creditAchieved,
                ).eq(credit);
            }

            for (let [i, name] of sectionNames.entries()) {
                expect(stateVariables[name].stateValues.creditAchieved).eq(
                    sectionCredits[i],
                );
                expect(
                    stateVariables[name].stateValues.percentCreditAchieved,
                ).eq(sectionCredits[i] * 100);
                expect(stateVariables[`${name}Ca`].stateValues.value).eq(
                    sectionCredits[i],
                );
                expect(stateVariables[`${name}Pca`].stateValues.value).eq(
                    sectionCredits[i] * 100,
                );
            }
        }

        await test_section_credit(core, check_items);
    });

    async function test_section_wide_check_work(
        core: PublicDoenetMLCore,
        sectionName = "/theProblem",
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        let answerNames = ["/twox", "/hello", "/fruit", "/sum3"];
        for (let name of answerNames) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(false);
            expect(ansVars.delegateCheckWork).eq(name !== "/sum3");
            expect(ansVars.delegateCheckWorkToInput).eq(name !== "/sum3");
        }
        expect(
            stateVariables[sectionName].stateValues.createSubmitAllButton,
        ).eq(false);

        let twoxInputName =
            stateVariables["/twox"].stateValues.inputChildren[0].componentIdx;
        await updateMathInputValue({ latex: "2x", name: twoxInputName, core });
        await submitAnswer({ name: "/twox", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/twox"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(0.25);

        let helloInputName =
            stateVariables["/hello"].stateValues.inputChildren[0].componentIdx;
        await updateTextInputValue({
            text: "hello",
            name: helloInputName,
            core,
        });
        await submitAnswer({ name: "/hello", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/hello"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(0.5);
        const bananaInd =
            stateVariables["/fruitInput"].stateValues.choiceTexts.indexOf(
                "banana",
            ) + 1;

        await updateSelectedIndices({
            name: "/fruitInput",
            selectedIndices: [bananaInd],
            core,
        });
        await submitAnswer({ name: "/fruit", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/fruit"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(0.75);

        await updateMathInputValue({ latex: "2", name: "/n1", core });
        await updateMathInputValue({ latex: "1", name: "/n2", core });
        await submitAnswer({ name: "/sum3", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sum3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(1);

        // switch to section wide checkWork

        await updateBooleanInputValue({ boolean: true, name: "/swcw", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        for (let name of answerNames) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(true);
            expect(ansVars.delegateCheckWork).eq(true);
            expect(ansVars.delegateCheckWorkToInput).eq(false);
        }
        expect(
            stateVariables[sectionName].stateValues.createSubmitAllButton,
        ).eq(true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(true);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(1);

        await updateMathInputValue({ latex: "y", name: twoxInputName, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(false);

        await core.requestAction({
            componentIdx: sectionName,
            actionName: "submitAllAnswers",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(true);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(0.75);

        await updateTextInputValue({
            text: "hello2",
            name: helloInputName,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(false);

        await core.requestAction({
            componentIdx: sectionName,
            actionName: "submitAllAnswers",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(true);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(0.5);

        // turn off section wide checkWork
        await updateBooleanInputValue({ boolean: false, name: "/swcw", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        for (let name of answerNames) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(false);
            expect(ansVars.delegateCheckWork).eq(name !== "/sum3");
            expect(ansVars.delegateCheckWorkToInput).eq(name !== "/sum3");
        }
        expect(
            stateVariables[sectionName].stateValues.createSubmitAllButton,
        ).eq(false);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(0.5);
    }

    it("section wide checkWork in problem", async () => {
        let core = await createTestCore({
            doenetML: `
        <p>Section wide checkWork: <booleanInput name="swcw" /></p>
        <problem sectionWideCheckWork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceInput name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceInput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </problem>
    `,
        });

        await test_section_wide_check_work(core);
    });

    it("section wide checkWork in section", async () => {
        let core = await createTestCore({
            doenetML: `
        <p>Section wide checkWork: <booleanInput name="swcw" /></p>
        <section aggregateScores sectionWideCheckWork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceInput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceInput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </section>
    `,
        });

        await test_section_wide_check_work(core);
    });

    it("document wide checkWork", async () => {
        let core = await createTestCore({
            doenetML: `
        <document documentWideCheckWork="$swcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide checkWork: <booleanInput name="swcw" /></p>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceInput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceInput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
        </document>
    `,
        });

        await test_section_wide_check_work(core, "/theDocument");
    });

    async function test_override_section_wide_check_work(
        core: PublicDoenetMLCore,
        sectionName = "/theProblem",
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        let answerNames1 = ["/twox", "/hello"];
        let answerNames2 = ["/fruit", "/sum3"];
        for (let name of answerNames1) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(false);
            expect(ansVars.delegateCheckWork).eq(true);
            expect(ansVars.delegateCheckWorkToInput).eq(true);
        }
        for (let name of answerNames2) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(true);
            expect(ansVars.delegateCheckWork).eq(true);
            expect(ansVars.delegateCheckWorkToInput).eq(false);
        }
        expect(
            stateVariables["/subProblem"].stateValues.createSubmitAllButton,
        ).eq(true);
        expect(
            stateVariables[sectionName].stateValues.createSubmitAllButton,
        ).eq(false);

        let twoxInputName =
            stateVariables["/twox"].stateValues.inputChildren[0].componentIdx;
        await updateMathInputValue({ latex: "2x", name: twoxInputName, core });
        await submitAnswer({ name: "/twox", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/twox"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(
            1 / 3,
        );

        let helloInputName =
            stateVariables["/hello"].stateValues.inputChildren[0].componentIdx;
        await updateTextInputValue({
            text: "hello",
            name: helloInputName,
            core,
        });
        await submitAnswer({ name: "/hello", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/hello"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(
            2 / 3,
        );

        expect(stateVariables["/subProblem"].stateValues.justSubmitted).eq(
            false,
        );
        expect(stateVariables["/subProblem"].stateValues.creditAchieved).eq(0);

        const bananaInd =
            stateVariables["/fruitInput"].stateValues.choiceTexts.indexOf(
                "banana",
            ) + 1;

        await updateSelectedIndices({
            name: "/fruitInput",
            selectedIndices: [bananaInd],
            core,
        });
        await core.requestAction({
            componentIdx: "/subProblem",
            actionName: "submitAllAnswers",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/fruit"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/subProblem"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/subProblem"].stateValues.creditAchieved).eq(
            0.5,
        );
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(
            5 / 6,
        );

        await updateMathInputValue({ latex: "2", name: "/n1", core });
        await updateMathInputValue({ latex: "1", name: "/n2", core });
        await core.requestAction({
            componentIdx: "/subProblem",
            actionName: "submitAllAnswers",
            args: {},
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sum3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/subProblem"].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables["/subProblem"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(1);

        // switch to section wide checkWork

        await updateBooleanInputValue({ boolean: true, name: "/swcw", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        for (let name of [...answerNames1, ...answerNames2]) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(true);
            expect(ansVars.delegateCheckWork).eq(true);
            expect(ansVars.delegateCheckWorkToInput).eq(false);
        }
        expect(
            stateVariables["/subProblem"].stateValues.createSubmitAllButton,
        ).eq(false);
        expect(
            stateVariables[sectionName].stateValues.createSubmitAllButton,
        ).eq(true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(true);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(1);

        await updateMathInputValue({ latex: "y", name: twoxInputName, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(false);

        await core.requestAction({
            componentIdx: sectionName,
            actionName: "submitAllAnswers",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(true);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(
            2 / 3,
        );

        await updateTextInputValue({
            text: "hello2",
            name: helloInputName,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(false);

        await core.requestAction({
            componentIdx: sectionName,
            actionName: "submitAllAnswers",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sectionName].stateValues.justSubmitted).eq(true);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(
            1 / 3,
        );

        // turn off section wide checkWork
        await updateBooleanInputValue({ boolean: false, name: "/swcw", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        for (let name of answerNames1) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(false);
            expect(ansVars.delegateCheckWork).eq(true);
            expect(ansVars.delegateCheckWorkToInput).eq(true);
        }
        for (let name of answerNames2) {
            let ansVars = stateVariables[name].stateValues;
            expect(ansVars.delegateCheckWorkToAncestor).eq(true);
            expect(ansVars.delegateCheckWork).eq(true);
            expect(ansVars.delegateCheckWorkToInput).eq(false);
        }
        expect(
            stateVariables["/subProblem"].stateValues.createSubmitAllButton,
        ).eq(true);
        expect(
            stateVariables[sectionName].stateValues.createSubmitAllButton,
        ).eq(false);

        expect(stateVariables["/subProblem"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[sectionName].stateValues.creditAchieved).eq(
            1 / 3,
        );
    }

    it("outer section wide checkWork supersedes inner section", async () => {
        let core = await createTestCore({
            doenetML: `
        <p>Section wide checkWork: <booleanInput name="swcw" /></p>
        <section aggregateScores sectionWideCheckWork="$swcw" name="theProblem">
        <title>Problem 1</title>

        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <subsection aggregateScores sectionWideCheckWork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceInput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceInput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
          <answer name="sum3">
            <award sourcesAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </subsection>
      
      </section>
    `,
        });

        await test_override_section_wide_check_work(core);
    });

    it("document wide checkWork supersedes section", async () => {
        let core = await createTestCore({
            doenetML: `
        <text>a</text>
        <document documentWideCheckWork="$swcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide checkWork: <booleanInput name="swcw" /></p>
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <section aggregateScores sectionWideCheckWork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceInput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceInput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
          <answer name="sum3">
            <award sourcesAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </section>
      
      </document>
    `,
        });

        await test_override_section_wide_check_work(core, "/theDocument");
    });

    it("section wide checkWork, submit label", async () => {
        let core = await createTestCore({
            doenetML: `
      <problem sectionWideCheckWork name="prob1">
        <answer name="ans1">x</answer>
      </problem>
      <problem sectionWideCheckWork name="prob2" submitLabel="Hit it!">
        <answer name="ans2">x</answer>
      </problem>
      <problem sectionWideCheckWork name="prob3" submitLabelNoCorrectness="Guess">
        <answer name="ans3">x</answer>
      </problem>
      <problem sectionWideCheckWork name="prob4" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <answer name="ans4">x</answer>
      </problem>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/prob1"].stateValues.submitLabel).eq(
            "Check Work",
        );
        expect(
            stateVariables["/prob1"].stateValues.submitLabelNoCorrectness,
        ).eq("Submit Response");
        expect(stateVariables["/prob2"].stateValues.submitLabel).eq("Hit it!");
        expect(
            stateVariables["/prob2"].stateValues.submitLabelNoCorrectness,
        ).eq("Submit Response");
        expect(stateVariables["/prob3"].stateValues.submitLabel).eq(
            "Check Work",
        );
        expect(
            stateVariables["/prob3"].stateValues.submitLabelNoCorrectness,
        ).eq("Guess");
        expect(stateVariables["/prob4"].stateValues.submitLabel).eq("Hit it!");
        expect(
            stateVariables["/prob4"].stateValues.submitLabelNoCorrectness,
        ).eq("Guess");
    });

    it("document wide checkWork, submit label", async () => {
        let core = await createTestCore({
            doenetML: `
      <document documentWideCheckWork name="doc" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <answer name="ans1">x</answer>
      </document>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/doc"].stateValues.submitLabel).eq("Hit it!");
        expect(stateVariables["/doc"].stateValues.submitLabelNoCorrectness).eq(
            "Guess",
        );
    });
});
