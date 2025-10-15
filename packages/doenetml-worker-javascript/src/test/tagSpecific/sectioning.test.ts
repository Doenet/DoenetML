import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Sectioning tag tests", async () => {
    async function test_section_credit(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        check_items: (arg: number[]) => Promise<void>,
    ) {
        let ansCredits = Array(9).fill(0);

        await check_items(ansCredits);

        let stateVariables = await core.returnAllStateVariables(false, true);

        let mathinput1Name =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput2Name =
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput3Name =
            stateVariables[await resolvePathToNodeIdx("ans3")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput4Name =
            stateVariables[await resolvePathToNodeIdx("ans4")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput5Name =
            stateVariables[await resolvePathToNodeIdx("ans5")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput6Name =
            stateVariables[await resolvePathToNodeIdx("ans6")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput7Name =
            stateVariables[await resolvePathToNodeIdx("ans7")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput8Name =
            stateVariables[await resolvePathToNodeIdx("ans8")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput9Name =
            stateVariables[await resolvePathToNodeIdx("ans9")].stateValues
                .inputChildren[0].componentIdx;

        // enter first correct answer
        await updateMathInputValue({
            latex: "u",
            componentIdx: mathinput1Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        ansCredits[0] = 1;
        await check_items(ansCredits);

        // enter additional correct answers
        await updateMathInputValue({
            latex: "y",
            componentIdx: mathinput3Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans3"),
            core,
        });
        ansCredits[2] = 1;
        await updateMathInputValue({
            latex: "v",
            componentIdx: mathinput5Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans5"),
            core,
        });
        ansCredits[4] = 1;
        await updateMathInputValue({
            latex: "q",
            componentIdx: mathinput7Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans7"),
            core,
        });
        ansCredits[6] = 1;
        await check_items(ansCredits);

        // enter most other correct answers
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathinput2Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        ansCredits[1] = 1;
        await updateMathInputValue({
            latex: "z",
            componentIdx: mathinput4Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans4"),
            core,
        });
        ansCredits[3] = 1;
        await updateMathInputValue({
            latex: "w",
            componentIdx: mathinput6Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans6"),
            core,
        });
        ansCredits[5] = 1;
        await updateMathInputValue({
            latex: "r",
            componentIdx: mathinput8Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans8"),
            core,
        });
        ansCredits[7] = 1;
        await check_items(ansCredits);

        // enter last correct answer
        await updateMathInputValue({
            latex: "s",
            componentIdx: mathinput9Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans9"),
            core,
        });
        ansCredits[8] = 1;
        await check_items(ansCredits);
    }

    it("sections default to not aggregating scores", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <title>Activity</title>
    <p>Credit achieved for $_document1.title:
    <number extend="$_document1.creditAchieved" name="docCa" />, or <number extend="$_document1.percentCreditAchieved" name="docPca" />%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <section name="section1"><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      <number extend="$section1.creditAchieved" name="section1Ca" />, or <number extend="$section1.percentCreditAchieved" name="section1Pca" />%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </section>
    <section name="section2"><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      <number extend="$section2.creditAchieved" name="section2Ca" />, or <number extend="$section2.percentCreditAchieved" name="section2Pca" />%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <subsection name="section21"><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        <number extend="$section21.creditAchieved" name="section21Ca" />, or <number extend="$section21.percentCreditAchieved" name="section21Pca" />%</p>


        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        <number extend="$section22.creditAchieved" name="section22Ca" />, or <number extend="$section22.percentCreditAchieved" name="section22Pca" />%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <subsubsection name="section221"><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          <number extend="$section221.creditAchieved" name="section221Ca" />, or <number extend="$section221.percentCreditAchieved" name="section221Pca" />%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </subsubsection>
        <subsubsection name="section222"><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          <number extend="$section222.creditAchieved" name="section222Ca" />, or <number extend="$section222.percentCreditAchieved" name="section222Pca" />%</p>

          <p>Enter <m>s</m>: <answer name="ans9" weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `,
        });

        let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];
        let totWeight = weight.reduce((a, b) => a + b);

        let sectionNames = [
            "section1",
            "section2",
            "section21",
            "section22",
            "section221",
            "section222",
        ];

        async function check_items(ansCredits: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let [i, credit] of ansCredits.entries()) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`ans${i + 1}`)]
                        .stateValues.creditAchieved,
                ).eq(credit);
            }

            let docCredit =
                weight.reduce((a, c, i) => a + ansCredits[i] * c, 0) /
                totWeight;

            expect(
                stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                    .value,
            ).eq(docCredit);
            expect(
                stateVariables[await resolvePathToNodeIdx("docPca")].stateValues
                    .value,
            ).eq(docCredit * 100);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .stateValues.creditAchieved,
            ).eq(docCredit);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .stateValues.percentCreditAchieved,
            ).eq(docCredit * 100);
            for (let name of sectionNames) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .creditAchieved,
                ).eq(0);
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .percentCreditAchieved,
                ).eq(0);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${name}Ca`)]
                        .stateValues.value,
                ).eq(0);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${name}Pca`)]
                        .stateValues.value,
                ).eq(0);
            }
        }

        await test_section_credit(core, resolvePathToNodeIdx, check_items);
    });

    it("sections aggregating scores default to weight 1", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <document name="doc">
    <title>Activity</title>
    <p>Credit achieved for $doc.title:
    <number extend="$doc.creditAchieved" name="docCa" />, or <number extend="$doc.percentCreditAchieved" name="docPca" />%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <section name="section1" aggregateScores><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      <number extend="$section1.creditAchieved" name="section1Ca" />, or <number extend="$section1.percentCreditAchieved" name="section1Pca" />%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </section>
    <section name="section2" aggregateScores><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      <number extend="$section2.creditAchieved" name="section2Ca" />, or <number extend="$section2.percentCreditAchieved" name="section2Pca" />%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <subsection name="section21" aggregateScores><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        <number extend="$section21.creditAchieved" name="section21Ca" />, or <number extend="$section21.percentCreditAchieved" name="section21Pca" />%</p>


        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        <number extend="$section22.creditAchieved" name="section22Ca" />, or <number extend="$section22.percentCreditAchieved" name="section22Pca" />%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <subsubsection name="section221" aggregateScores><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          <number extend="$section221.creditAchieved" name="section221Ca" />, or <number extend="$section221.percentCreditAchieved" name="section221Pca" />%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregateScores><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          <number extend="$section222.creditAchieved" name="section222Ca" />, or <number extend="$section222.percentCreditAchieved" name="section222Pca" />%</p>

          <p>Enter <m>s</m>: <answer name="ans9" weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    </document>
    `,
        });

        let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];

        let sectionNames = [
            "doc",
            "section1",
            "section2",
            "section21",
            "section22",
            "section221",
            "section222",
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

            // section 2
            sectionCredits[2] =
                (ansCredits[3] * weight[3] +
                    sectionCredits[3] +
                    ansCredits[6] * weight[6] +
                    sectionCredits[5] +
                    sectionCredits[6]) /
                (weight[3] + weight[6] + 3);

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
                    stateVariables[await resolvePathToNodeIdx(`ans${i + 1}`)]
                        .stateValues.creditAchieved,
                ).eq(credit);
            }

            for (let [i, name] of sectionNames.entries()) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .creditAchieved,
                ).eq(sectionCredits[i]);
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .percentCreditAchieved,
                ).eq(sectionCredits[i] * 100);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${name}Ca`)]
                        .stateValues.value,
                ).eq(sectionCredits[i]);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${name}Pca`)]
                        .stateValues.value,
                ).eq(sectionCredits[i] * 100);
            }
        }

        await test_section_credit(core, resolvePathToNodeIdx, check_items);
    });

    it("sections aggregating scores, with weights", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <document name="doc">
    <title>Activity</title>
    <p>Credit achieved for $doc.title:
    <number extend="$doc.creditAchieved" name="docCa" />, or <number extend="$doc.percentCreditAchieved" name="docPca" />%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <section name="section1" aggregateScores weight="0.5"><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      <number extend="$section1.creditAchieved" name="section1Ca" />, or <number extend="$section1.percentCreditAchieved" name="section1Pca" />%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </section>
    <section name="section2" aggregateScores weight="2"><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      <number extend="$section2.creditAchieved" name="section2Ca" />, or <number extend="$section2.percentCreditAchieved" name="section2Pca" />%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <subsection name="section21" aggregateScores weight="3"><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        <number extend="$section21.creditAchieved" name="section21Ca" />, or <number extend="$section21.percentCreditAchieved" name="section21Pca" />%</p>


        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </subsection>
      <subsection name="section22" aggregateScores weight="4"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        <number extend="$section22.creditAchieved" name="section22Ca" />, or <number extend="$section22.percentCreditAchieved" name="section22Pca" />%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <subsubsection name="section221" aggregateScores weight="5"><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          <number extend="$section221.creditAchieved" name="section221Ca" />, or <number extend="$section221.percentCreditAchieved" name="section221Pca" />%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregateScores weight="1"><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          <number extend="$section222.creditAchieved" name="section222Ca" />, or <number extend="$section222.percentCreditAchieved" name="section222Pca" />%</p>

          <p>Enter <m>s</m>: <answer name="ans9" weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    </document>
    `,
        });

        let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];
        let sectionWeight = [NaN, 0.5, 2, 3, 4, 5, 1];

        let sectionNames = [
            "doc",
            "section1",
            "section2",
            "section21",
            "section22",
            "section221",
            "section222",
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
                    stateVariables[await resolvePathToNodeIdx(`ans${i + 1}`)]
                        .stateValues.creditAchieved,
                ).eq(credit);
            }

            for (let [i, name] of sectionNames.entries()) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .creditAchieved,
                ).eq(sectionCredits[i]);
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .percentCreditAchieved,
                ).eq(sectionCredits[i] * 100);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${name}Ca`)]
                        .stateValues.value,
                ).eq(sectionCredits[i]);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${name}Pca`)]
                        .stateValues.value,
                ).eq(sectionCredits[i] * 100);
            }
        }

        await test_section_credit(core, resolvePathToNodeIdx, check_items);
    });

    it("section-wide checkwork button implies aggregate scores", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section sectionWideCheckwork name="theSection">
      <p>Enter x: <answer><mathInput name="mi1" />x</answer></p>
      <p>Enter y: <answer><mathInput name="mi2" />y</answer></p>
    </section>
    `,
        });

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("theSection"),
            actionName: "submitAllAnswers",
            args: {},
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theSection")].stateValues
                .creditAchieved,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("theSection")].stateValues
                .aggregateScores,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theSection")].stateValues
                .sectionWideCheckWork,
        ).eq(true);
    });

    it("paragraphs", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <paragraphs name="ps"><title>Some paragraphs</title>

    <p>Paragraph 1</p>
    <p>Paragraph 2</p>

    </paragraphs>
    
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ps")].stateValues.title,
        ).eq("Some paragraphs");
        let pNames = stateVariables[
            await resolvePathToNodeIdx("ps")
        ].activeChildren.map((v) => v.componentIdx);

        expect(stateVariables[pNames[2]].stateValues.text).eq("Paragraph 1");
        expect(stateVariables[pNames[4]].stateValues.text).eq("Paragraph 2");
    });

    it("copy and overwrite title", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <section includeAutoName includeAutoNumber name="sec">
        <title>A title</title>
        <p>Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" extend="$sec">
        <title>A better title</title>
        <p>Good day!</p>
      </section>

      <p>Copy of original title: <text extend="$sec.title" name="title1" /></p>
      <p>Copy of revised title: <text extend="$revised.title" name="title2" /></p>
      <p>Original section number: <text extend="$sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text extend="$revised.sectionNumber" name="sectionNumber2" /></p>
   
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec")].stateValues.title,
        ).eq("A title");
        expect(
            stateVariables[await resolvePathToNodeIdx("sec")].stateValues
                .titlePrefix,
        ).eq("Section 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .title,
        ).eq("A better title");
        expect(
            stateVariables[await resolvePathToNodeIdx("revised")].stateValues
                .titlePrefix,
        ).eq("Section 2: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("title1")].stateValues
                .value,
        ).eq("A title");
        expect(
            stateVariables[await resolvePathToNodeIdx("title2")].stateValues
                .value,
        ).eq("A better title");
        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumber1")]
                .stateValues.value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumber2")]
                .stateValues.value,
        ).eq("2");
    });

    async function test_auto_naming({
        customTitles = false,
        autoNumber = false,
        autoName = false,
        noParent = false,
        initialCounter,
    }: {
        customTitles?: boolean;
        autoNumber?: boolean;
        autoName?: boolean;
        noParent?: boolean;
        initialCounter?: number;
    }) {
        const includeAutoNumber = autoNumber ? "includeAutoNumber " : "";
        const includeAutoName = autoName ? "includeAutoName " : "";
        const includeParentNumber = noParent
            ? 'includeParentNumber="false" '
            : "";

        const offset = initialCounter ? initialCounter - 1 : 0;
        const s1 = (1 + offset).toString();
        const s2 = (2 + offset).toString();

        let byIndex: Record<
            string,
            { title: string; number: string; level: number }
        > = {
            1: { title: "A", number: `${s1}`, level: 1 },
            2: { title: "B", number: `${s2}`, level: 1 },
            21: { title: "BA", number: `${s2}.1`, level: 2 },
            211: { title: "BAA", number: `${s2}.1.1`, level: 3 },
            2111: { title: "BAAA", number: `${s2}.1.1.1`, level: 4 },
            2112: { title: "BAAB", number: `${s2}.1.1.2`, level: 4 },
            22: { title: "BB", number: `${s2}.2`, level: 2 },
            221: { title: "BBA", number: `${s2}.2.1`, level: 3 },
            222: { title: "BBB", number: `${s2}.2.2`, level: 3 },
            223: { title: "BBC", number: `${s2}.2.3`, level: 3 },
            2231: { title: "BBCA", number: `${s2}.2.3.1`, level: 4 },
            23: { title: "BC", number: `${s2}.3`, level: 2 },
        };

        if (noParent) {
            byIndex[211].number = "1";
            byIndex[2111].number = "1.1";
            byIndex[2112].number = "1.2";
            byIndex[22].number = "2";
            byIndex[221].number = "2.1";
            byIndex[222].number = "2.2";
            byIndex[223].number = "2.3";
            byIndex[2231].number = "2.3.1";
        }

        let titles: Record<string, string> = {};
        for (let ind in byIndex) {
            if (customTitles) {
                titles[ind] = `\n<title>${byIndex[ind].title}</title>`;
            } else {
                titles[ind] = "";
            }
        }

        const doenetML = `
      <section ${includeAutoNumber}${includeAutoName}name="sec1">${titles[1]}
        <p><lorem generateSentences="1" /></p>
      </section>
      <section ${includeAutoNumber}${includeAutoName}name="sec2">${titles[2]}
        <p><lorem generateSentences="1" /></p>

        <section ${includeAutoNumber}${includeAutoName}name="sec21">${titles[21]}
          <p><lorem generateSentences="1" /></p>
          <section ${includeAutoNumber}${includeAutoName}name="sec211" ${includeParentNumber}>${titles[211]}
            <p><lorem generateSentences="1" /></p>
            <section ${includeAutoNumber}${includeAutoName}name="sec2111">${titles[2111]}
              <p><lorem generateSentences="1" /></p>
            </section>
            <section ${includeAutoNumber}${includeAutoName}name="sec2112">${titles[2112]}
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>
        </section>
        <section ${includeAutoNumber}${includeAutoName}name="sec22" ${includeParentNumber}>${titles[22]}
          <p><lorem generateSentences="1" /></p>
          <section ${includeAutoNumber}${includeAutoName}name="sec221">${titles[221]}
            <p><lorem generateSentences="1" /></p>
          </section>
          <section ${includeAutoNumber}${includeAutoName}name="sec222">${titles[222]}
            <p><lorem generateSentences="1" /></p>
          </section>
          <section ${includeAutoNumber}${includeAutoName}name="sec223">${titles[223]}
            <p><lorem generateSentences="1" /></p>

            <section ${includeAutoNumber}${includeAutoName}name="sec2231">${titles[2231]}
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>

        </section>

        <section ${includeAutoNumber}${includeAutoName}name="sec23">${titles[23]}
          <p><lorem generateSentences="1" /></p>
        </section>
      </section>
  

      <p>Title 1: <text name="title1" extend="$sec1.title" /></p>
      <p>Title 2: <text name="title2" extend="$sec2.title" /></p>
      <p>Title 2.1: <text name="title21" extend="$sec21.title" /></p>
      <p>Title 2.1.1: <text name="title211" extend="$sec211.title" /></p>
      <p>Title 2.1.1.1: <text name="title2111" extend="$sec2111.title" /></p>
      <p>Title 2.1.1.2: <text name="title2112" extend="$sec2112.title" /></p>
      <p>Title 2.2: <text name="title22" extend="$sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" extend="$sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" extend="$sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" extend="$sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" extend="$sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" extend="$sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" extend="$sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" extend="$sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" extend="$sec21.sectionNumber" /></p>
      <p>Number for 2.1.1: <text name="sectionNumber211" extend="$sec211.sectionNumber" /></p>
      <p>Number for 2.1.1.1: <text name="sectionNumber2111" extend="$sec2111.sectionNumber" /></p>
      <p>Number for 2.1.1.2: <text name="sectionNumber2112" extend="$sec2112.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" extend="$sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" extend="$sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" extend="$sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" extend="$sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" extend="$sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" extend="$sec23.sectionNumber" /></p>
    `;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initializeCounters: initialCounter
                ? { section: initialCounter }
                : {},
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        let prefixStart = !customTitles || includeAutoName ? "Section" : "";

        for (let ind in byIndex) {
            let secStateValues =
                stateVariables[await resolvePathToNodeIdx(`sec${ind}`)]
                    .stateValues;
            let data = byIndex[ind];
            let title = customTitles ? data.title : `Section ${data.number}`;
            expect(secStateValues.title).eq(title);
            let titlePrefix = prefixStart;
            if (!customTitles || includeAutoNumber) {
                if (titlePrefix) {
                    titlePrefix += " ";
                }
                titlePrefix += data.number;
            }

            if (titlePrefix && customTitles) {
                if (prefixStart) {
                    titlePrefix = titlePrefix + ": ";
                } else {
                    titlePrefix = titlePrefix + ". ";
                }
            }

            expect(secStateValues.titlePrefix).eq(titlePrefix);
            expect(secStateValues.level).eq(data.level);

            expect(
                stateVariables[await resolvePathToNodeIdx(`title${ind}`)]
                    .stateValues.value,
            ).eq(title);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`sectionNumber${ind}`)
                ].stateValues.value,
            ).eq(data.number);
        }
    }

    it("Auto naming of section titles", async () => {
        await test_auto_naming({});
    });

    it("Not auto naming of section titles with custom titles, by default", async () => {
        await test_auto_naming({ customTitles: true });
    });

    it("Add auto number to section titles with custom titles", async () => {
        await test_auto_naming({ customTitles: true, autoNumber: true });
    });

    it("Add auto name and number to section titles with custom titles", async () => {
        await test_auto_naming({
            customTitles: true,
            autoName: true,
            autoNumber: true,
        });
    });

    it("Add auto name to section titles with custom titles", async () => {
        await test_auto_naming({ customTitles: true, autoName: true });
    });

    it("Add auto name and number to section titles with custom titles, turning off include parent number", async () => {
        await test_auto_naming({
            customTitles: true,
            autoName: true,
            autoNumber: true,
            noParent: true,
        });
    });

    it("Auto naming of section titles, initialCounter", async () => {
        await test_auto_naming({ initialCounter: 3 });
    });

    it("Example, problems, exercise do not include parent number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <section name="sec1">
        <problem name="prob11">
          <p><lorem generateSentences="1" /></p>
        </problem>
        <exercise name="exer11">
          <p><lorem generateSentences="1" /></p>
        </exercise>
        <example name="exam11">
          <p><lorem generateSentences="1" /></p>
        </example>
        <problem name="prob12">
          <p><lorem generateSentences="1" /></p>
        </problem>
        <exercise name="exer12">
          <p><lorem generateSentences="1" /></p>
        </exercise>
        <example name="exam12">
          <p><lorem generateSentences="1" /></p>
        </example>

      </section>
  

      <p>Title Section 1: <text name="titleSec1" extend="$sec1.title" /></p>
      <p>Title Problem 1.1: <text name="titleProb11" extend="$prob11.title" /></p>
      <p>Title Exercise 1.1: <text name="titleExer11" extend="$exer11.title" /></p>
      <p>Title Example 1.1: <text name="titleExam11" extend="$exam11.title" /></p>
      <p>Title Problem 1.2: <text name="titleProb12" extend="$prob12.title" /></p>
      <p>Title Exercise 1.2: <text name="titleExer12" extend="$exer12.title" /></p>
      <p>Title Example 1.2: <text name="titleExam12" extend="$exam12.title" /></p>


      <p>Number for Section 1: <text name="sectionNumberSec1" extend="$sec1.sectionNumber" /></p>
      <p>Number for Problem 1.1: <text name="sectionNumberProb11" extend="$prob11.sectionNumber" /></p>
      <p>Number for Exercise 1.1: <text name="sectionNumberExer11" extend="$exer11.sectionNumber" /></p>
      <p>Number for Example 1.1: <text name="sectionNumberExam11" extend="$exam11.sectionNumber" /></p>
      <p>Number for Problem 1.2: <text name="sectionNumberProb12" extend="$prob12.sectionNumber" /></p>
      <p>Number for Exercise 1.2: <text name="sectionNumberExer12" extend="$exer12.sectionNumber" /></p>
      <p>Number for Example 1.2: <text name="sectionNumberExam12" extend="$exam12.sectionNumber" /></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("sec1")].stateValues
                .title,
        ).eq("Section 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("prob11")].stateValues
                .title,
        ).eq("Problem 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("exer11")].stateValues
                .title,
        ).eq("Exercise 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("exam11")].stateValues
                .title,
        ).eq("Example 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("prob12")].stateValues
                .title,
        ).eq("Problem 4");
        expect(
            stateVariables[await resolvePathToNodeIdx("exer12")].stateValues
                .title,
        ).eq("Exercise 5");
        expect(
            stateVariables[await resolvePathToNodeIdx("exam12")].stateValues
                .title,
        ).eq("Example 6");

        expect(
            stateVariables[await resolvePathToNodeIdx("titleProb11")]
                .stateValues.value,
        ).eq("Problem 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("titleExer11")]
                .stateValues.value,
        ).eq("Exercise 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("titleExam11")]
                .stateValues.value,
        ).eq("Example 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("titleProb12")]
                .stateValues.value,
        ).eq("Problem 4");
        expect(
            stateVariables[await resolvePathToNodeIdx("titleExer12")]
                .stateValues.value,
        ).eq("Exercise 5");
        expect(
            stateVariables[await resolvePathToNodeIdx("titleExam12")]
                .stateValues.value,
        ).eq("Example 6");

        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumberProb11")]
                .stateValues.value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumberExer11")]
                .stateValues.value,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumberExam11")]
                .stateValues.value,
        ).eq("3");
        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumberProb12")]
                .stateValues.value,
        ).eq("4");
        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumberExer12")]
                .stateValues.value,
        ).eq("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("sectionNumberExam12")]
                .stateValues.value,
        ).eq("6");
    });

    it("Can open aside in read only mode", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <aside name="aside1">
        <title>Hello</title>
        <p>Content</p>
      </aside>

      <p><textinput name="ti" /></p>
    `,
            flags: { readOnly: true },
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("aside1")].stateValues
                .open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ti")].stateValues
                .disabled,
        ).eq(true);

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: await resolvePathToNodeIdx("aside1"),
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("aside1")].stateValues
                .open,
        ).eq(true);

        await core.requestAction({
            actionName: "closeSection",
            componentIdx: await resolvePathToNodeIdx("aside1"),
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("aside1")].stateValues
                .open,
        ).eq(false);
    });

    it("aside content with postponeRendering isn't created before opening", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <aside name="aside" postponeRendering>
        <title>My aside</title>
        <p name="asideText">This is the text of the aside.</p>
      </aside>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("aside")].stateValues
                .title,
        ).eq("My aside"); // title is created before opening
        expect(stateVariables[await resolvePathToNodeIdx("asideText")]).be
            .undefined;

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: await resolvePathToNodeIdx("aside"),
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("aside")].stateValues
                .title,
        ).eq("My aside");
        expect(
            stateVariables[await resolvePathToNodeIdx("asideText")].stateValues
                .text,
        ).eq("This is the text of the aside.");
    });

    it("aside content without postponeRendering is created before opening", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <aside name="aside">
        <title>My aside</title>
        <p name="asideText">This is the text of the aside.</p>
      </aside>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("aside")].stateValues
                .title,
        ).eq("My aside");
        expect(
            stateVariables[await resolvePathToNodeIdx("asideText")].stateValues
                .text,
        ).eq("This is the text of the aside.");

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: await resolvePathToNodeIdx("aside"),
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("aside")].stateValues
                .title,
        ).eq("My aside");
        expect(
            stateVariables[await resolvePathToNodeIdx("asideText")].stateValues
                .text,
        ).eq("This is the text of the aside.");
    });

    it("proof content with postponeRendering isn't created before opening", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <proof name="proof" postponeRendering>
        <title>My proof</title>
        <p name="proofText">This is the text of the proof.</p>
      </proof>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("proof")].stateValues
                .title,
        ).eq("My proof"); // title is created before opening
        expect(stateVariables[await resolvePathToNodeIdx("proofText")]).be
            .undefined;

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: await resolvePathToNodeIdx("proof"),
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("proof")].stateValues
                .title,
        ).eq("My proof");
        expect(
            stateVariables[await resolvePathToNodeIdx("proofText")].stateValues
                .text,
        ).eq("This is the text of the proof.");
    });

    it("proof content without postponeRendering is created before opening", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <proof name="proof">
        <title>My proof</title>
        <p name="proofText">This is the text of the proof.</p>
      </proof>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("proof")].stateValues
                .title,
        ).eq("My proof");
        expect(
            stateVariables[await resolvePathToNodeIdx("proofText")].stateValues
                .text,
        ).eq("This is the text of the proof.");

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: await resolvePathToNodeIdx("proof"),
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("proof")].stateValues
                .title,
        ).eq("My proof");
        expect(
            stateVariables[await resolvePathToNodeIdx("proofText")].stateValues
                .text,
        ).eq("This is the text of the proof.");
    });

    it("Exercise with statement, hint, givenanswer, and solution", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <exercise name="exer">
      <title name="title">An exercise</title>
      <statement name="statement">The exercise</statement>
      <hint name="hint">
        <p>Try harder</p>
      </hint>
      <givenAnswer name="givenAnswer">
        <p name="pGivenAns">The correct answer</p>
      </givenAnswer>
      <solution name="solution">
        <p name="pSol">Here's how you do it.</p>
      </solution>
    </exercise>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("title")].stateValues
                .value,
        ).eq("An exercise");
        expect(
            stateVariables[await resolvePathToNodeIdx("statement")]
                .activeChildren,
        ).eqls(["The exercise"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint")].stateValues
                .title,
        ).eq("Hint");
        expect(
            stateVariables[await resolvePathToNodeIdx("hint")].stateValues.open,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("statement")]
                .activeChildren,
        ).eqls(["The exercise"]);
        expect(stateVariables[await resolvePathToNodeIdx("pGivenAns")]).be
            .undefined;
        expect(stateVariables[await resolvePathToNodeIdx("pSol")]).be.undefined;

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("hint"),
            actionName: "revealHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("hint")].stateValues.open,
        ).eq(true);
        expect(stateVariables[await resolvePathToNodeIdx("pGivenAns")]).be
            .undefined;
        expect(stateVariables[await resolvePathToNodeIdx("pSol")]).be.undefined;

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("givenAnswer"),
            actionName: "revealSolution",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pGivenAns")].stateValues
                .text,
        ).eq("The correct answer");
        expect(stateVariables[await resolvePathToNodeIdx("pSol")]).be.undefined;

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("solution"),
            actionName: "revealSolution",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pSol")].stateValues.text,
        ).eq("Here's how you do it.");
    });
});
