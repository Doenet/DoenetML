import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Sectioning tag tests", async () => {
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

    it("sections default to not aggregating scores", async () => {
        let core = await createTestCore({
            doenetML: `
    <title>Activity</title>
    <p>Credit achieved for $_document1.title:
    $_document1.creditAchieved{assignNames="docCa"}, or $_document1.percentCreditAchieved{assignNames="docPca"}%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <section name="section1"><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      $section1.creditAchieved{assignNames="section1Ca"}, or $section1.percentCreditAchieved{assignNames="section1Pca"}%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </section>
    <section name="section2"><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      $section2.creditAchieved{assignNames="section2Ca"}, or $section2.percentCreditAchieved{assignNames="section2Pca"}%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <subsection name="section21"><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        $section21.creditAchieved{assignNames="section21Ca"}, or $section21.percentCreditAchieved{assignNames="section21Pca"}%</p>


        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        $section22.creditAchieved{assignNames="section22Ca"}, or $section22.percentCreditAchieved{assignNames="section22Pca"}%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <subsubsection name="section221"><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          $section221.creditAchieved{assignNames="section221Ca"}, or $section221.percentCreditAchieved{assignNames="section221Pca"}%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </subsubsection>
        <subsubsection name="section222"><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          $section222.creditAchieved{assignNames="section222Ca"}, or $section222.percentCreditAchieved{assignNames="section222Pca"}%</p>

          <p>Enter <m>s</m>: <answer name="ans9" weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `,
        });

        let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];
        let totWeight = weight.reduce((a, b) => a + b);

        let sectionNames = [
            "/section1",
            "/section2",
            "/section21",
            "/section22",
            "/section221",
            "/section222",
        ];

        async function check_items(ansCredits: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let [i, credit] of ansCredits.entries()) {
                expect(
                    stateVariables[`/ans${i + 1}`].stateValues.creditAchieved,
                ).eq(credit);
            }

            let docCredit =
                weight.reduce((a, c, i) => a + ansCredits[i] * c, 0) /
                totWeight;

            expect(stateVariables["/docCa"].stateValues.value).eq(docCredit);
            expect(stateVariables["/docPca"].stateValues.value).eq(
                docCredit * 100,
            );
            expect(stateVariables["/_document1"].stateValues.creditAchieved).eq(
                docCredit,
            );
            expect(
                stateVariables["/_document1"].stateValues.percentCreditAchieved,
            ).eq(docCredit * 100);
            for (let name of sectionNames) {
                expect(stateVariables[name].stateValues.creditAchieved).eq(0);
                expect(
                    stateVariables[name].stateValues.percentCreditAchieved,
                ).eq(0);
                expect(stateVariables[`${name}Ca`].stateValues.value).eq(0);
                expect(stateVariables[`${name}Pca`].stateValues.value).eq(0);
            }
        }

        await test_section_credit(core, check_items);
    });

    it("sections aggregating scores default to weight 1", async () => {
        let core = await createTestCore({
            doenetML: `
    <document name="doc">
    <title>Activity</title>
    <p>Credit achieved for $doc.title:
    $doc.creditAchieved{assignNames="docCa"}, or $doc.percentCreditAchieved{assignNames="docPca"}%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <section name="section1" aggregateScores><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      $section1.creditAchieved{assignNames="section1Ca"}, or $section1.percentCreditAchieved{assignNames="section1Pca"}%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </section>
    <section name="section2" aggregateScores><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      $section2.creditAchieved{assignNames="section2Ca"}, or $section2.percentCreditAchieved{assignNames="section2Pca"}%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <subsection name="section21" aggregateScores><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        $section21.creditAchieved{assignNames="section21Ca"}, or $section21.percentCreditAchieved{assignNames="section21Pca"}%</p>


        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        $section22.creditAchieved{assignNames="section22Ca"}, or $section22.percentCreditAchieved{assignNames="section22Pca"}%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <subsubsection name="section221" aggregateScores><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          $section221.creditAchieved{assignNames="section221Ca"}, or $section221.percentCreditAchieved{assignNames="section221Pca"}%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregateScores><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          $section222.creditAchieved{assignNames="section222Ca"}, or $section222.percentCreditAchieved{assignNames="section222Pca"}%</p>

          <p>Enter <m>s</m>: <answer name="ans9" weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    </document>
    `,
        });

        let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];

        let sectionNames = [
            "/doc",
            "/section1",
            "/section2",
            "/section21",
            "/section22",
            "/section221",
            "/section222",
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

    it("sections aggregating scores, with weights", async () => {
        let core = await createTestCore({
            doenetML: `
    <document name="doc">
    <title>Activity</title>
    <p>Credit achieved for $doc.title:
    $doc.creditAchieved{assignNames="docCa"}, or $doc.percentCreditAchieved{assignNames="docPca"}%</p>

    <p>Enter <m>u</m>: <answer name="ans1">u</answer></p>

    <section name="section1" aggregateScores weight="0.5"><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      $section1.creditAchieved{assignNames="section1Ca"}, or $section1.percentCreditAchieved{assignNames="section1Pca"}%</p>

      <p>Enter <m>x</m>: <answer name="ans2">x</answer></p>
      <p>Enter <m>y</m>: <answer name="ans3" weight="2">y</answer></p>


    </section>
    <section name="section2" aggregateScores weight="2"><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      $section2.creditAchieved{assignNames="section2Ca"}, or $section2.percentCreditAchieved{assignNames="section2Pca"}%</p>

      <p>Enter <m>z</m>: <answer name="ans4">z</answer></p>

      <subsection name="section21" aggregateScores weight="3"><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        $section21.creditAchieved{assignNames="section21Ca"}, or $section21.percentCreditAchieved{assignNames="section21Pca"}%</p>


        <p>Enter <m>v</m>: <answer name="ans5" weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer name="ans6">w</answer></p>

      </subsection>
      <subsection name="section22" aggregateScores weight="4"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        $section22.creditAchieved{assignNames="section22Ca"}, or $section22.percentCreditAchieved{assignNames="section22Pca"}%</p>

        <p>Enter <m>q</m>: <answer name="ans7">q</answer></p>

        <subsubsection name="section221" aggregateScores weight="5"><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          $section221.creditAchieved{assignNames="section221Ca"}, or $section221.percentCreditAchieved{assignNames="section221Pca"}%</p>

          <p>Enter <m>r</m>: <answer name="ans8">r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregateScores weight="1"><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          $section222.creditAchieved{assignNames="section222Ca"}, or $section222.percentCreditAchieved{assignNames="section222Pca"}%</p>

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
            "/doc",
            "/section1",
            "/section2",
            "/section21",
            "/section22",
            "/section221",
            "/section222",
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

    it("warning that cannot add section-wide checkwork button if not aggregating scores", async () => {
        let core = await createTestCore({
            doenetML: `
    <section sectionWideCheckwork>
      <p>Enter x: <answer name="ans"><mathinput name="mi" />x</answer></p>
    </section>
    `,
        });

        await updateMathInputValue({ latex: "x", name: "/mi", core });
        await submitAnswer({ name: "/ans", core });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Cannot create submit all button for <section> because it doesn't aggregate scores.`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(14);
    });

    it("paragraphs", async () => {
        let core = await createTestCore({
            doenetML: `
    <paragraphs name="ps"><title>Some paragraphs</title>

    <p>Paragraph 1</p>
    <p>Paragraph 2</p>

    </paragraphs>
    
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ps"].stateValues.title).eq("Some paragraphs");
        let pNames = stateVariables["/ps"].activeChildren.map(
            (v) => v.componentIdx,
        );

        expect(stateVariables[pNames[2]].stateValues.text).eq("Paragraph 1");
        expect(stateVariables[pNames[4]].stateValues.text).eq("Paragraph 2");
    });

    it("copy and overwrite title", async () => {
        let core = await createTestCore({
            doenetML: `
      <section includeAutoName includeAutoNumber name="sec">
        <title>A title</title>
        <p>Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" copySource="sec">
        <title>A better title</title>
        <p>Good day!</p>
      </section>

      <p>Copy of original title: <text copySource="sec.title" name="title1" /></p>
      <p>Copy of revised title: <text copySource="revised.title" name="title2" /></p>
      <p>Original section number: <text copySource="sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text copySource="revised.sectionNumber" name="sectionNumber2" /></p>
   
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/sec"].stateValues.title).eq("A title");
        expect(stateVariables["/sec"].stateValues.titlePrefix).eq(
            "Section 1: ",
        );
        expect(stateVariables["/revised"].stateValues.title).eq(
            "A better title",
        );
        expect(stateVariables["/revised"].stateValues.titlePrefix).eq(
            "Section 2: ",
        );
        expect(stateVariables["/title1"].stateValues.value).eq("A title");
        expect(stateVariables["/title2"].stateValues.value).eq(
            "A better title",
        );
        expect(stateVariables["/sectionNumber1"].stateValues.value).eq("1");
        expect(stateVariables["/sectionNumber2"].stateValues.value).eq("2");
    });

    it("copy and overwrite title, newNamespaces", async () => {
        let core = await createTestCore({
            doenetML: `
      <section includeAutoName includeAutoNumber name="sec" newNamespace>
        <title name="title1">A title</title>
        <p>Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" copySource="sec" newNamespace>
        <title name="title2">A better title</title>
        <p>Good day!</p>
      </section>

      <p>Copy of original title: <text copySource="sec.title" name="title1" /></p>
      <p>Copy of revised title: <text copySource="revised.title" name="title2" /></p>
      <p>Original section number: <text copySource="sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text copySource="revised.sectionNumber" name="sectionNumber2" /></p>
    
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/sec"].stateValues.title).eq("A title");
        expect(stateVariables["/sec"].stateValues.titlePrefix).eq(
            "Section 1: ",
        );
        expect(stateVariables["/revised"].stateValues.title).eq(
            "A better title",
        );
        expect(stateVariables["/revised"].stateValues.titlePrefix).eq(
            "Section 2: ",
        );
        expect(stateVariables["/sec/title1"].stateValues.value).eq("A title");
        expect(stateVariables["/revised/title2"].stateValues.value).eq(
            "A better title",
        );
        expect(stateVariables["/sectionNumber1"].stateValues.value).eq("1");
        expect(stateVariables["/sectionNumber2"].stateValues.value).eq("2");
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
  

      <p>Title 1: <text name="title1" copySource="sec1.title" /></p>
      <p>Title 2: <text name="title2" copySource="sec2.title" /></p>
      <p>Title 2.1: <text name="title21" copySource="sec21.title" /></p>
      <p>Title 2.1.1: <text name="title211" copySource="sec211.title" /></p>
      <p>Title 2.1.1.1: <text name="title2111" copySource="sec2111.title" /></p>
      <p>Title 2.1.1.2: <text name="title2112" copySource="sec2112.title" /></p>
      <p>Title 2.2: <text name="title22" copySource="sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" copySource="sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" copySource="sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" copySource="sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" copySource="sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" copySource="sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" copySource="sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" copySource="sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" copySource="sec21.sectionNumber" /></p>
      <p>Number for 2.1.1: <text name="sectionNumber211" copySource="sec211.sectionNumber" /></p>
      <p>Number for 2.1.1.1: <text name="sectionNumber2111" copySource="sec2111.sectionNumber" /></p>
      <p>Number for 2.1.1.2: <text name="sectionNumber2112" copySource="sec2112.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" copySource="sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" copySource="sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" copySource="sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" copySource="sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" copySource="sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" copySource="sec23.sectionNumber" /></p>
    `;

        let core = await createTestCore({
            doenetML,
            initializeCounters: initialCounter
                ? { section: initialCounter }
                : {},
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        let prefixStart = !customTitles || includeAutoName ? "Section" : "";

        for (let ind in byIndex) {
            let secStateValues = stateVariables[`/sec${ind}`].stateValues;
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

            expect(stateVariables[`/title${ind}`].stateValues.value).eq(title);
            expect(stateVariables[`/sectionNumber${ind}`].stateValues.value).eq(
                data.number,
            );
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
        let core = await createTestCore({
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
  

      <p>Title Section 1: <text name="titleSec1" copySource="sec1.title" /></p>
      <p>Title Problem 1.1: <text name="titleProb11" copySource="prob11.title" /></p>
      <p>Title Exercise 1.1: <text name="titleExer11" copySource="exer11.title" /></p>
      <p>Title Example 1.1: <text name="titleExam11" copySource="exam11.title" /></p>
      <p>Title Problem 1.2: <text name="titleProb12" copySource="prob12.title" /></p>
      <p>Title Exercise 1.2: <text name="titleExer12" copySource="exer12.title" /></p>
      <p>Title Example 1.2: <text name="titleExam12" copySource="exam12.title" /></p>


      <p>Number for Section 1: <text name="sectionNumberSec1" copySource="sec1.sectionNumber" /></p>
      <p>Number for Problem 1.1: <text name="sectionNumberProb11" copySource="prob11.sectionNumber" /></p>
      <p>Number for Exercise 1.1: <text name="sectionNumberExer11" copySource="exer11.sectionNumber" /></p>
      <p>Number for Example 1.1: <text name="sectionNumberExam11" copySource="exam11.sectionNumber" /></p>
      <p>Number for Problem 1.2: <text name="sectionNumberProb12" copySource="prob12.sectionNumber" /></p>
      <p>Number for Exercise 1.2: <text name="sectionNumberExer12" copySource="exer12.sectionNumber" /></p>
      <p>Number for Example 1.2: <text name="sectionNumberExam12" copySource="exam12.sectionNumber" /></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/sec1"].stateValues.title).eq("Section 1");
        expect(stateVariables["/prob11"].stateValues.title).eq("Problem 1");
        expect(stateVariables["/exer11"].stateValues.title).eq("Exercise 2");
        expect(stateVariables["/exam11"].stateValues.title).eq("Example 3");
        expect(stateVariables["/prob12"].stateValues.title).eq("Problem 4");
        expect(stateVariables["/exer12"].stateValues.title).eq("Exercise 5");
        expect(stateVariables["/exam12"].stateValues.title).eq("Example 6");

        expect(stateVariables["/titleProb11"].stateValues.value).eq(
            "Problem 1",
        );
        expect(stateVariables["/titleExer11"].stateValues.value).eq(
            "Exercise 2",
        );
        expect(stateVariables["/titleExam11"].stateValues.value).eq(
            "Example 3",
        );
        expect(stateVariables["/titleProb12"].stateValues.value).eq(
            "Problem 4",
        );
        expect(stateVariables["/titleExer12"].stateValues.value).eq(
            "Exercise 5",
        );
        expect(stateVariables["/titleExam12"].stateValues.value).eq(
            "Example 6",
        );

        expect(stateVariables["/sectionNumberProb11"].stateValues.value).eq(
            "1",
        );
        expect(stateVariables["/sectionNumberExer11"].stateValues.value).eq(
            "2",
        );
        expect(stateVariables["/sectionNumberExam11"].stateValues.value).eq(
            "3",
        );
        expect(stateVariables["/sectionNumberProb12"].stateValues.value).eq(
            "4",
        );
        expect(stateVariables["/sectionNumberExer12"].stateValues.value).eq(
            "5",
        );
        expect(stateVariables["/sectionNumberExam12"].stateValues.value).eq(
            "6",
        );
    });

    it("Can open aside in read only mode", async () => {
        let core = await createTestCore({
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
        expect(stateVariables["/aside1"].stateValues.open).eq(false);
        expect(stateVariables["/ti"].stateValues.disabled).eq(true);

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: "/aside1",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/aside1"].stateValues.open).eq(true);

        await core.requestAction({
            actionName: "closeSection",
            componentIdx: "/aside1",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/aside1"].stateValues.open).eq(false);
    });

    it("aside content with postponeRendering isn't created before opening", async () => {
        let core = await createTestCore({
            doenetML: `
      <aside name="aside" postponeRendering>
        <title>My aside</title>
        <p name="asideText">This is the text of the aside.</p>
      </aside>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/aside"].stateValues.title).eq("My aside"); // title is created before opening
        expect(stateVariables["/asideText"]).be.undefined;

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: "/aside",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/aside"].stateValues.title).eq("My aside");
        expect(stateVariables["/asideText"].stateValues.text).eq(
            "This is the text of the aside.",
        );
    });

    it("aside content without postponeRendering is created before opening", async () => {
        let core = await createTestCore({
            doenetML: `
      <aside name="aside">
        <title>My aside</title>
        <p name="asideText">This is the text of the aside.</p>
      </aside>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/aside"].stateValues.title).eq("My aside");
        expect(stateVariables["/asideText"].stateValues.text).eq(
            "This is the text of the aside.",
        );

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: "/aside",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/aside"].stateValues.title).eq("My aside");
        expect(stateVariables["/asideText"].stateValues.text).eq(
            "This is the text of the aside.",
        );
    });

    it("proof content with postponeRendering isn't created before opening", async () => {
        let core = await createTestCore({
            doenetML: `
      <proof name="proof" postponeRendering>
        <title>My proof</title>
        <p name="proofText">This is the text of the proof.</p>
      </proof>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/proof"].stateValues.title).eq("My proof"); // title is created before opening
        expect(stateVariables["/proofText"]).be.undefined;

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: "/proof",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/proof"].stateValues.title).eq("My proof");
        expect(stateVariables["/proofText"].stateValues.text).eq(
            "This is the text of the proof.",
        );
    });

    it("proof content without postponeRendering is created before opening", async () => {
        let core = await createTestCore({
            doenetML: `
      <proof name="proof">
        <title>My proof</title>
        <p name="proofText">This is the text of the proof.</p>
      </proof>
      `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/proof"].stateValues.title).eq("My proof");
        expect(stateVariables["/proofText"].stateValues.text).eq(
            "This is the text of the proof.",
        );

        await core.requestAction({
            actionName: "revealSection",
            componentIdx: "/proof",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/proof"].stateValues.title).eq("My proof");
        expect(stateVariables["/proofText"].stateValues.text).eq(
            "This is the text of the proof.",
        );
    });

    it("Exercise with statement, hint, givenanswer, and solution", async () => {
        let core = await createTestCore({
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
        expect(stateVariables["/title"].stateValues.value).eq("An exercise");
        expect(stateVariables["/statement"].activeChildren).eqls([
            "The exercise",
        ]);
        expect(stateVariables["/hint"].stateValues.title).eq("Hint");
        expect(stateVariables["/hint"].stateValues.open).eq(false);
        expect(stateVariables["/statement"].activeChildren).eqls([
            "The exercise",
        ]);
        expect(stateVariables["/pGivenAns"]).be.undefined;
        expect(stateVariables["/pSol"]).be.undefined;

        await core.requestAction({
            componentIdx: "/hint",
            actionName: "revealHint",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/hint"].stateValues.open).eq(true);
        expect(stateVariables["/pGivenAns"]).be.undefined;
        expect(stateVariables["/pSol"]).be.undefined;

        await core.requestAction({
            componentIdx: "/givenAnswer",
            actionName: "revealSolution",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pGivenAns"].stateValues.text).eq(
            "The correct answer",
        );
        expect(stateVariables["/pSol"]).be.undefined;

        await core.requestAction({
            componentIdx: "/solution",
            actionName: "revealSolution",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pSol"].stateValues.text).eq(
            "Here's how you do it.",
        );
    });
});
