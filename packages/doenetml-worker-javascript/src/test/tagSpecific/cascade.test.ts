import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateMathInputValue,
    updateMatrixInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Cascade tag tests @group4", async () => {
    type CascadeCompletionTuple = readonly [number, number, number];
    /** Whether each of three `<cascadeMessage>`s is shown, in document order. */
    type CascadeMessageShownTuple = readonly [boolean, boolean, boolean];

    async function getStateVariables(core: any) {
        return core.returnAllStateVariables(false, true);
    }

    function getMathInputIdx(stateVariables: any, answerIdx: number) {
        return stateVariables[answerIdx].stateValues.inputChildren[0]
            .componentIdx;
    }

    async function submitMathAnswer({
        core,
        mathInputIdx,
        answerIdx,
        latex,
    }: {
        core: any;
        mathInputIdx: number;
        answerIdx: number;
        latex: string;
    }) {
        await updateMathInputValue({
            latex,
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });
    }

    async function runMathAnswerSequence<T>({
        core,
        steps,
        assertState,
    }: {
        core: any;
        steps: {
            latex: string;
            mathInputIdx: number;
            answerIdx: number;
            expected: T;
        }[];
        assertState: (expected: T) => Promise<void>;
    }) {
        for (const step of steps) {
            await submitMathAnswer({
                core,
                latex: step.latex,
                mathInputIdx: step.mathInputIdx,
                answerIdx: step.answerIdx,
            });
            await assertState(step.expected);
        }
    }

    async function submitChoiceAnswer({
        core,
        choiceInputIdx,
        answerIdx,
        selectedIndices,
    }: {
        core: any;
        choiceInputIdx: number;
        answerIdx: number;
        selectedIndices: number[];
    }) {
        await updateSelectedIndices({
            componentIdx: choiceInputIdx,
            selectedIndices,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });
    }

    it("basic cascade", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <title>My cascade</title>

  <section boxed name="section1">
    <title>First part</title>

    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </section>

  <section boxed name="section3">
    <title>Third part</title>

    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>

</cascade>

<p name="pNumCompleted">numCompleted: $w.numCompleted</p>

  `,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const pNumCompletedIdx = await resolvePathToNodeIdx("pNumCompleted");
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section1p1Idx = await resolvePathToNodeIdx("section1.p1");
        const section1p2Idx = await resolvePathToNodeIdx("section1.p2");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section2pIdx = await resolvePathToNodeIdx("section2.p");
        const section3Idx = await resolvePathToNodeIdx("section3");
        const section3pIdx = await resolvePathToNodeIdx("section3.p");

        async function check_values(numCompleted: number) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[wIdx].stateValues.title).eq("My cascade");
            expect(stateVariables[wIdx].stateValues.numCompleted).eq(
                numCompleted,
            );
            expect(stateVariables[pNumCompletedIdx].stateValues.text).eq(
                `numCompleted: ${numCompleted}`,
            );
            expect(stateVariables[section1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section1Idx].stateValues.titleColor).eq(
                stateVariables[section1Idx].stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(stateVariables[section1p1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1p2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hideChildren).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section2Idx].stateValues.titleColor).eq(
                stateVariables[section2Idx].stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(stateVariables[section2pIdx].stateValues.hidden).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section3Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section3Idx].stateValues.hideChildren).eq(
                numCompleted < 2,
            );
            expect(stateVariables[section3Idx].stateValues.titleColor).eq(
                stateVariables[section3Idx].stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(stateVariables[section3pIdx].stateValues.hidden).eq(
                numCompleted < 2,
            );
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const mathInput2Idx = getMathInputIdx(stateVariables, answer2Idx);
        const answer3Idx = await resolvePathToNodeIdx("section3.p.ans");
        const mathInput3Idx = getMathInputIdx(stateVariables, answer3Idx);

        await check_values(0);

        const answerSequence: {
            latex: string;
            mathInputIdx: number;
            answerIdx: number;
            numCompleted: number;
        }[] = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                numCompleted: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                numCompleted: 1,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                numCompleted: 0,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                numCompleted: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                numCompleted: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                numCompleted: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                numCompleted: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput3Idx,
                answerIdx: answer3Idx,
                numCompleted: 3,
            },
            {
                latex: "11",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                numCompleted: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                numCompleted: 3,
            },
        ];

        for (const step of answerSequence) {
            await submitMathAnswer({ core, ...step });
            await check_values(step.numCompleted);
        }
    });

    it("a step whose answers all have weight 0 does not block the next step", async () => {
        // A step worth no points has nothing to withhold, so it stops blocking
        // as soon as it is reached — the rule that lets a step holding no
        // answers at all get out of the way. `creditAchievedForCheckWork`
        // deliberately does not reach this: it changes what a section-wide
        // check-work button reports, not when a cascade advances.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="c">
  <problem name="p1">
    <answer name="a1" weight="0">1</answer>
  </problem>
  <problem name="p2">
    <answer name="a2">2</answer>
  </problem>
</cascade>
  `,
        });

        let stateVariables = await getStateVariables(core);

        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .numCompleted,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                .creditAchievedForProgress,
        ).eq(1);

        // Answering it wrong leaves the second step reachable all the same.
        await submitMathAnswer({
            core,
            latex: "999",
            mathInputIdx: getMathInputIdx(
                stateVariables,
                await resolvePathToNodeIdx("a1"),
            ),
            answerIdx: await resolvePathToNodeIdx("a1"),
        });

        stateVariables = await getStateVariables(core);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .numCompleted,
        ).eq(1);
    });

    it("hideFutureSections", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w" hideFutureSections>
  <title>My cascade</title>

  <section boxed name="section1">
    <title>First part</title>

    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </section>

  <section boxed name="section3">
    <title>Third part</title>

    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>

</cascade>

<p name="pNumCompleted">numCompleted: $w.numCompleted</p>

  `,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const pNumCompletedIdx = await resolvePathToNodeIdx("pNumCompleted");
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section1p1Idx = await resolvePathToNodeIdx("section1.p1");
        const section1p2Idx = await resolvePathToNodeIdx("section1.p2");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section2pIdx = await resolvePathToNodeIdx("section2.p");
        const section3Idx = await resolvePathToNodeIdx("section3");
        const section3pIdx = await resolvePathToNodeIdx("section3.p");

        async function check_values(numCompleted: number) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[wIdx].stateValues.title).eq("My cascade");
            expect(stateVariables[wIdx].stateValues.numCompleted).eq(
                numCompleted,
            );
            expect(stateVariables[pNumCompletedIdx].stateValues.text).eq(
                `numCompleted: ${numCompleted}`,
            );
            expect(stateVariables[section1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section1p1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1p2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hidden).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section2Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section2pIdx].stateValues.hidden).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section3Idx].stateValues.hidden).eq(
                numCompleted < 2,
            );
            expect(stateVariables[section3Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section3pIdx].stateValues.hidden).eq(
                numCompleted < 2,
            );
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const mathInput2Idx = getMathInputIdx(stateVariables, answer2Idx);
        const answer3Idx = await resolvePathToNodeIdx("section3.p.ans");
        const mathInput3Idx = getMathInputIdx(stateVariables, answer3Idx);

        await check_values(0);

        const answerSequence: {
            latex: string;
            mathInputIdx: number;
            answerIdx: number;
            numCompleted: number;
        }[] = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                numCompleted: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                numCompleted: 1,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                numCompleted: 0,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                numCompleted: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                numCompleted: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                numCompleted: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                numCompleted: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput3Idx,
                answerIdx: answer3Idx,
                numCompleted: 3,
            },
            {
                latex: "11",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                numCompleted: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                numCompleted: 3,
            },
        ];

        for (const step of answerSequence) {
            await submitMathAnswer({ core, ...step });
            await check_values(step.numCompleted);
        }
    });

    it("cascade in cascade", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w1">
  <title>My cascade</title>

  <section boxed name="section1">
    <title>First part</title>

    <cascade name="w2">
      <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
      <div>
        <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
        <p name="p3">What is 2+2? <answer name="ans">4</answer></p>
      </div>
    </cascade>
  </section>

  <section boxed name="section2">
    <title>Second part</title>
    
    <cascade name="w3">
      <p name="p1">What is 3+4? <answer name="ans">7</answer></p>
      <p name="p2">What is 3-4? <answer name="ans">-1</answer></p>
    </cascade>
  </section>

</cascade>

  `,
        });

        const w1Idx = await resolvePathToNodeIdx("w1");
        const w2Idx = await resolvePathToNodeIdx("w2");
        const w3Idx = await resolvePathToNodeIdx("w3");
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section1p1Idx = await resolvePathToNodeIdx("section1.p1");
        const section1p2Idx = await resolvePathToNodeIdx("section1.p2");
        const section1p3Idx = await resolvePathToNodeIdx("section1.p3");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section2p1Idx = await resolvePathToNodeIdx("section2.p1");
        const section2p2Idx = await resolvePathToNodeIdx("section2.p2");

        async function check_values(
            numCompleted1: number,
            numCompleted2: number,
            numCompleted3: number,
        ) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[w1Idx].stateValues.title).eq("My cascade");
            expect(stateVariables[w1Idx].stateValues.numCompleted).eq(
                numCompleted1,
            );

            expect(stateVariables[w2Idx].stateValues.title).eq("");
            expect(stateVariables[w2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[w2Idx].stateValues.numCompleted).eq(
                numCompleted2,
            );

            expect(stateVariables[w3Idx].stateValues.title).eq("");
            expect(stateVariables[w3Idx].stateValues.hidden).eq(
                numCompleted1 < 1,
            );
            expect(stateVariables[w3Idx].stateValues.numCompleted).eq(
                numCompleted3,
            );

            expect(stateVariables[section1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section1p1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1p2Idx].stateValues.hidden).eq(
                numCompleted2 < 1,
            );
            expect(stateVariables[section1p3Idx].stateValues.hidden).eq(
                numCompleted2 < 1,
            );
            expect(stateVariables[section2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hideChildren).eq(
                numCompleted1 < 1,
            );
            expect(stateVariables[section2p1Idx].stateValues.hidden).eq(
                numCompleted1 < 1,
            );
            expect(stateVariables[section2p2Idx].stateValues.hidden).eq(
                numCompleted1 < 1 || numCompleted3 < 1,
            );
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer13Idx = await resolvePathToNodeIdx("section1.p3.ans");
        const mathInput13Idx = getMathInputIdx(stateVariables, answer13Idx);
        const answer21Idx = await resolvePathToNodeIdx("section2.p1.ans");
        const mathInput21Idx = getMathInputIdx(stateVariables, answer21Idx);
        const answer22Idx = await resolvePathToNodeIdx("section2.p2.ans");
        const mathInput22Idx = getMathInputIdx(stateVariables, answer22Idx);

        await check_values(0, 0, 0);

        const answerSequence: {
            latex: string;
            mathInputIdx: number;
            answerIdx: number;
            expected: CascadeCompletionTuple;
        }[] = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: [0, 1, 0] as const,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: [0, 1, 0] as const,
            },
            {
                latex: "4",
                mathInputIdx: mathInput13Idx,
                answerIdx: answer13Idx,
                expected: [1, 2, 0] as const,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: [0, 0, 0] as const,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: [1, 2, 0] as const,
            },
            {
                latex: "7",
                mathInputIdx: mathInput21Idx,
                answerIdx: answer21Idx,
                expected: [1, 2, 1] as const,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: [0, 1, 1] as const,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: [1, 2, 1] as const,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput22Idx,
                answerIdx: answer22Idx,
                expected: [2, 2, 2] as const,
            },
            {
                latex: "11",
                mathInputIdx: mathInput13Idx,
                answerIdx: answer13Idx,
                expected: [0, 1, 2] as const,
            },
            {
                latex: "4",
                mathInputIdx: mathInput13Idx,
                answerIdx: answer13Idx,
                expected: [2, 2, 2] as const,
            },
        ];

        await runMathAnswerSequence({
            core,
            steps: answerSequence,
            assertState: async ([c1, c2, c3]) => check_values(c1, c2, c3),
        });
    });

    it("cascade in cascade, reveal all", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w1" revealAll>
  <title>My cascade</title>

  <section boxed name="section1">
    <title>First part</title>

    <cascade name="w2">
      <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
      <div>
        <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
        <p name="p3">What is 2+2? <answer name="ans">4</answer></p>
      </div>
    </cascade>
  </section>

  <section boxed name="section2">
    <title>Second part</title>
    
    <cascade name="w3">
      <p name="p1">What is 3+4? <answer name="ans">7</answer></p>
      <p name="p2">What is 3-4? <answer name="ans">-1</answer></p>
    </cascade>
  </section>

</cascade>

  `,
        });

        const w1Idx = await resolvePathToNodeIdx("w1");
        const w2Idx = await resolvePathToNodeIdx("w2");
        const w3Idx = await resolvePathToNodeIdx("w3");
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section1p1Idx = await resolvePathToNodeIdx("section1.p1");
        const section1p2Idx = await resolvePathToNodeIdx("section1.p2");
        const section1p3Idx = await resolvePathToNodeIdx("section1.p3");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section2p1Idx = await resolvePathToNodeIdx("section2.p1");
        const section2p2Idx = await resolvePathToNodeIdx("section2.p2");

        async function check_values(
            numCompleted1: number,
            numCompleted2: number,
            numCompleted3: number,
        ) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[w1Idx].stateValues.title).eq("My cascade");
            expect(stateVariables[w1Idx].stateValues.numCompleted).eq(
                numCompleted1,
            );

            expect(stateVariables[w2Idx].stateValues.title).eq("");
            expect(stateVariables[w2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[w2Idx].stateValues.numCompleted).eq(
                numCompleted2,
            );

            expect(stateVariables[w3Idx].stateValues.title).eq("");
            expect(stateVariables[w3Idx].stateValues.hidden).eq(false);
            expect(stateVariables[w3Idx].stateValues.numCompleted).eq(
                numCompleted3,
            );

            expect(stateVariables[section1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section1p1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1p2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1p3Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section2p1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2p2Idx].stateValues.hidden).eq(false);
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer13Idx = await resolvePathToNodeIdx("section1.p3.ans");
        const mathInput13Idx = getMathInputIdx(stateVariables, answer13Idx);
        const answer21Idx = await resolvePathToNodeIdx("section2.p1.ans");
        const mathInput21Idx = getMathInputIdx(stateVariables, answer21Idx);
        const answer22Idx = await resolvePathToNodeIdx("section2.p2.ans");
        const mathInput22Idx = getMathInputIdx(stateVariables, answer22Idx);

        await check_values(0, 0, 0);

        const answerSequence: {
            latex: string;
            mathInputIdx: number;
            answerIdx: number;
            expected: CascadeCompletionTuple;
        }[] = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: [0, 1, 0] as const,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: [0, 1, 0] as const,
            },
            {
                latex: "4",
                mathInputIdx: mathInput13Idx,
                answerIdx: answer13Idx,
                expected: [1, 2, 0] as const,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: [0, 0, 0] as const,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: [1, 2, 0] as const,
            },
            {
                latex: "7",
                mathInputIdx: mathInput21Idx,
                answerIdx: answer21Idx,
                expected: [1, 2, 1] as const,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: [0, 1, 1] as const,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: [1, 2, 1] as const,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput22Idx,
                answerIdx: answer22Idx,
                expected: [2, 2, 2] as const,
            },
            {
                latex: "11",
                mathInputIdx: mathInput13Idx,
                answerIdx: answer13Idx,
                expected: [0, 1, 2] as const,
            },
            {
                latex: "4",
                mathInputIdx: mathInput13Idx,
                answerIdx: answer13Idx,
                expected: [2, 2, 2] as const,
            },
        ];

        await runMathAnswerSequence({
            core,
            steps: answerSequence,
            assertState: async ([c1, c2, c3]) => check_values(c1, c2, c3),
        });
    });

    it("change cascade colors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w" notStartedColor="orange" inProgressColor="yellow" completedColor="blue">
  <title>My cascade</title>

  <section boxed name="section1">
    <title>First part</title>

    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </section>

  <section boxed name="section3">
    <title>Third part</title>

    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>

</cascade>

<p name="pNumCompleted">numCompleted: $w.numCompleted</p>

  `,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const pNumCompletedIdx = await resolvePathToNodeIdx("pNumCompleted");
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section1p1Idx = await resolvePathToNodeIdx("section1.p1");
        const section1p2Idx = await resolvePathToNodeIdx("section1.p2");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section2pIdx = await resolvePathToNodeIdx("section2.p");
        const section3Idx = await resolvePathToNodeIdx("section3");
        const section3pIdx = await resolvePathToNodeIdx("section3.p");

        function colorFromCredit(credit: number) {
            if (credit === 1) {
                return "blue";
            } else if (credit > 0) {
                return "yellow";
            } else {
                return "orange";
            }
        }

        async function check_values(numCompleted: number) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[wIdx].stateValues.title).eq("My cascade");
            expect(stateVariables[wIdx].stateValues.numCompleted).eq(
                numCompleted,
            );
            expect(stateVariables[pNumCompletedIdx].stateValues.text).eq(
                `numCompleted: ${numCompleted}`,
            );
            expect(stateVariables[section1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section1Idx].stateValues.titleColor).eq(
                colorFromCredit(
                    stateVariables[section1Idx].stateValues.creditAchieved,
                ),
            );
            expect(stateVariables[section1p1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1p2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hideChildren).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section2Idx].stateValues.titleColor).eq(
                colorFromCredit(
                    stateVariables[section2Idx].stateValues.creditAchieved,
                ),
            );
            expect(stateVariables[section2pIdx].stateValues.hidden).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section3Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section3Idx].stateValues.hideChildren).eq(
                numCompleted < 2,
            );
            expect(stateVariables[section3Idx].stateValues.titleColor).eq(
                colorFromCredit(
                    stateVariables[section3Idx].stateValues.creditAchieved,
                ),
            );
            expect(stateVariables[section3pIdx].stateValues.hidden).eq(
                numCompleted < 2,
            );
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const mathInput2Idx = getMathInputIdx(stateVariables, answer2Idx);
        const answer3Idx = await resolvePathToNodeIdx("section3.p.ans");
        const mathInput3Idx = getMathInputIdx(stateVariables, answer3Idx);

        await check_values(0);

        const answerSequence = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 1,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput3Idx,
                answerIdx: answer3Idx,
                expected: 3,
            },
            {
                latex: "11",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 3,
            },
        ];

        await runMathAnswerSequence({
            core,
            steps: answerSequence,
            assertState: check_values,
        });
    });

    it("continuation messages inside sections", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <title>My cascade</title>

  <section boxed name="section1">
    <title>First part</title>

    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
    <cascadeMessage name="cm">Never shown</cascadeMessage>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
    <cascadeMessage name="cm"><em>Complete first part to proceed.</em></cascadeMessage>
  </section>

  <section boxed name="section3">
    <title>Third part</title>

    <cascadeMessage name="cm"><em>Complete second part to proceed.</em></cascadeMessage>

    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>

</cascade>

<p name="pNumCompleted">numCompleted: $w.numCompleted</p>

  `,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const pNumCompletedIdx = await resolvePathToNodeIdx("pNumCompleted");
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section1p1Idx = await resolvePathToNodeIdx("section1.p1");
        const section1p2Idx = await resolvePathToNodeIdx("section1.p2");
        const section1cmIdx = await resolvePathToNodeIdx("section1.cm");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section2pIdx = await resolvePathToNodeIdx("section2.p");
        const section2cmIdx = await resolvePathToNodeIdx("section2.cm");
        const section3Idx = await resolvePathToNodeIdx("section3");
        const section3pIdx = await resolvePathToNodeIdx("section3.p");
        const section3cmIdx = await resolvePathToNodeIdx("section3.cm");

        async function check_values(numCompleted: number) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[wIdx].stateValues.title).eq("My cascade");
            expect(stateVariables[wIdx].stateValues.numCompleted).eq(
                numCompleted,
            );
            expect(stateVariables[pNumCompletedIdx].stateValues.text).eq(
                `numCompleted: ${numCompleted}`,
            );
            expect(stateVariables[section1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1Idx].stateValues.hideChildren).eq(
                false,
            );
            expect(stateVariables[section1Idx].stateValues.titleColor).eq(
                stateVariables[section1Idx].stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(stateVariables[section1p1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1p2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section1cmIdx].stateValues.hidden).eq(true);

            expect(stateVariables[section2Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section2Idx].stateValues.hideChildren).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section2Idx].stateValues.titleColor).eq(
                stateVariables[section2Idx].stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(stateVariables[section2pIdx].stateValues.hidden).eq(
                numCompleted < 1,
            );
            expect(stateVariables[section2cmIdx].stateValues.hidden).eq(
                numCompleted >= 1,
            );

            expect(stateVariables[section3Idx].stateValues.hidden).eq(false);
            expect(stateVariables[section3Idx].stateValues.hideChildren).eq(
                numCompleted < 2,
            );
            expect(stateVariables[section3Idx].stateValues.titleColor).eq(
                stateVariables[section3Idx].stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(stateVariables[section3pIdx].stateValues.hidden).eq(
                numCompleted < 2,
            );

            // The cascade shows one message at a time, so section 3's shows
            // only while section 3 is the next step — not while section 2 is
            // still held back with a message of its own.
            expect(stateVariables[section3cmIdx].stateValues.hidden).eq(
                numCompleted !== 1,
            );
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const mathInput2Idx = getMathInputIdx(stateVariables, answer2Idx);
        const answer3Idx = await resolvePathToNodeIdx("section3.p.ans");
        const mathInput3Idx = getMathInputIdx(stateVariables, answer3Idx);

        await check_values(0);

        const answerSequence = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 1,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput3Idx,
                answerIdx: answer3Idx,
                expected: 3,
            },
            {
                latex: "11",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 3,
            },
        ];

        await runMathAnswerSequence({
            core,
            steps: answerSequence,
            assertState: check_values,
        });
    });

    // A cascade shows one continuation message at a time. When the next step
    // has a message of its own, that more specific message wins and the
    // cascade's own messages stay hidden; when it does not, the cascade's next
    // message takes over.
    it("a step's own continuation message wins over the cascade's", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <problem name="prob1"><p name="p">What is 1+1? <answer name="ans">2</answer></p></problem>

  <problem name="prob2">
    <cascadeMessage name="cm">Finish problem 1 to proceed.</cascadeMessage>
    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </problem>

  <cascadeMessage name="outer">Keep going...</cascadeMessage>

  <problem name="prob3"><p name="p">What is 3-4? <answer name="ans">-1</answer></p></problem>
</cascade>
  `,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const prob2cmIdx = await resolvePathToNodeIdx("prob2.cm");
        const prob2pIdx = await resolvePathToNodeIdx("prob2.p");
        const outerIdx = await resolvePathToNodeIdx("outer");
        const prob3pIdx = await resolvePathToNodeIdx("prob3.p");

        async function check_values(numCompleted: number) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[wIdx].stateValues.numCompleted).eq(
                numCompleted,
            );
            expect(stateVariables[prob2pIdx].stateValues.hidden).eq(
                numCompleted < 1,
            );
            expect(stateVariables[prob3pIdx].stateValues.hidden).eq(
                numCompleted < 2,
            );

            // Problem 2's own message while problem 2 is next...
            expect(stateVariables[prob2cmIdx].stateValues.hidden).eq(
                numCompleted !== 0,
            );
            // ...and the cascade's message once problem 3, which has none of
            // its own, is next. Never both at once.
            expect(stateVariables[outerIdx].stateValues.hidden).eq(
                numCompleted !== 1,
            );
        }

        const stateVariables = await getStateVariables(core);
        const answer1Idx = await resolvePathToNodeIdx("prob1.p.ans");
        const mathInput1Idx = getMathInputIdx(stateVariables, answer1Idx);
        const answer2Idx = await resolvePathToNodeIdx("prob2.p.ans");
        const mathInput2Idx = getMathInputIdx(stateVariables, answer2Idx);
        const answer3Idx = await resolvePathToNodeIdx("prob3.p.ans");
        const mathInput3Idx = getMathInputIdx(stateVariables, answer3Idx);

        await check_values(0);

        await runMathAnswerSequence({
            core,
            steps: [
                {
                    latex: "2",
                    mathInputIdx: mathInput1Idx,
                    answerIdx: answer1Idx,
                    expected: 1,
                },
                {
                    latex: "7",
                    mathInputIdx: mathInput2Idx,
                    answerIdx: answer2Idx,
                    expected: 2,
                },
                {
                    latex: "-1",
                    mathInputIdx: mathInput3Idx,
                    answerIdx: answer3Idx,
                    expected: 3,
                },
                // Going back to an incorrect answer hands the message back.
                {
                    latex: "3",
                    mathInputIdx: mathInput1Idx,
                    answerIdx: answer1Idx,
                    expected: 0,
                },
            ],
            assertState: check_values,
        });
    });

    // A `<cascade>` nested inside another is a step like any other, so it too
    // speaks only when it is the next step: while it is further down, its own
    // `<cascadeMessage>` children stay hidden along with everything else it has.
    // Each cascade then shows at most one message of its own, which is what "one
    // message at a time" means once cascades nest.
    it("a nested cascade's own message waits until its turn", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <cascade name="c1">
    <problem name="prob1"><p>What is 1+1? <answer name="ans">2</answer></p></problem>
    <cascadeMessage name="msg">Finish the first part of step 1.</cascadeMessage>
    <problem name="prob2"><p>What is 1-1? <answer name="ans">0</answer></p></problem>
  </cascade>
  <cascade name="c2">
    <problem name="prob1"><p>What is 3+4? <answer name="ans">7</answer></p></problem>
    <cascadeMessage name="msg">Finish the first part of step 2.</cascadeMessage>
    <problem name="prob2"><p>What is 3-4? <answer name="ans">-1</answer></p></problem>
  </cascade>
  <cascade name="c3">
    <problem name="prob1"><p>What is 5+6? <answer name="ans">11</answer></p></problem>
    <cascadeMessage name="msg">Finish the first part of step 3.</cascadeMessage>
    <problem name="prob2"><p>What is 5-6? <answer name="ans">-1</answer></p></problem>
  </cascade>
</cascade>`,
        });

        const msgIndices = await Promise.all(
            ["c1", "c2", "c3"].map((name) =>
                resolvePathToNodeIdx(`${name}.msg`),
            ),
        );

        async function check_messages(shown: CascadeMessageShownTuple) {
            const stateVariables = await getStateVariables(core);
            for (const [ind, msgIdx] of msgIndices.entries()) {
                expect(
                    stateVariables[msgIdx].stateValues.hidden,
                    `message of nested cascade ${ind + 1}`,
                ).eq(!shown[ind]);
            }
        }

        const stateVariables = await getStateVariables(core);
        const [c1ans1, c1ans2, c2ans1, c2ans2, c3ans1] = await Promise.all(
            ["c1.prob1", "c1.prob2", "c2.prob1", "c2.prob2", "c3.prob1"].map(
                (name) => resolvePathToNodeIdx(`${name}.ans`),
            ),
        );

        // Cascade 1 is showing and stands in for the step it holds back itself;
        // cascade 2 is the next step, so it is nominated and speaks for itself;
        // cascade 3 is further down and says nothing at all.
        await check_messages([true, true, false]);

        await runMathAnswerSequence({
            core,
            steps: [
                // Cascade 1's last step is showing now, so it has no gap left to
                // stand in for. Cascade 3 is still not next.
                {
                    latex: "2",
                    mathInputIdx: getMathInputIdx(stateVariables, c1ans1),
                    answerIdx: c1ans1,
                    expected: [false, true, false] as const,
                },
                // Cascade 1 is complete, so cascade 2 is no longer held back and
                // speaks for its own gap instead of for itself, and cascade 3 —
                // now the next step — gets its turn.
                {
                    latex: "0",
                    mathInputIdx: getMathInputIdx(stateVariables, c1ans2),
                    answerIdx: c1ans2,
                    expected: [false, true, true] as const,
                },
                {
                    latex: "7",
                    mathInputIdx: getMathInputIdx(stateVariables, c2ans1),
                    answerIdx: c2ans1,
                    expected: [false, false, true] as const,
                },
                {
                    latex: "-1",
                    mathInputIdx: getMathInputIdx(stateVariables, c2ans2),
                    answerIdx: c2ans2,
                    expected: [false, false, true] as const,
                },
                // And cascade 3's last step showing leaves nobody with anything
                // to say.
                {
                    latex: "11",
                    mathInputIdx: getMathInputIdx(stateVariables, c3ans1),
                    answerIdx: c3ans1,
                    expected: [false, false, false] as const,
                },
            ],
            assertState: check_messages,
        });
    });

    // Three levels of nesting, which is where the chain of dependencies the
    // nomination runs on could conceivably close on itself: a cascade's
    // `childrenToHide` asks its own `showCascadeMessage`, which asks the cascade
    // above for the step it nominated, which that cascade computed in its own
    // `childrenToHide`. The chain only ever climbs — the innermost cascade's
    // answer is never an input to an outer one — and the document loading at all
    // is what says so.
    it("three levels of nested cascades each show at most their own message", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <cascade name="c1">
    <problem name="prob1"><p>What is 1+1? <answer name="ans">2</answer></p></problem>
    <cascadeMessage name="m1">Finish the first half of step 1.</cascadeMessage>
    <problem name="prob2"><p>What is 1-1? <answer name="ans">0</answer></p></problem>
  </cascade>
  <cascade name="c2">
    <cascade name="c2a">
      <problem name="prob1"><p>What is 3+4? <answer name="ans">7</answer></p></problem>
      <cascadeMessage name="m2a">Finish the first half of step 2a.</cascadeMessage>
      <problem name="prob2"><p>What is 3-4? <answer name="ans">-1</answer></p></problem>
    </cascade>
    <cascadeMessage name="m2">Finish step 2a.</cascadeMessage>
    <problem name="prob3"><p>What is 5+6? <answer name="ans">11</answer></p></problem>
  </cascade>
</cascade>`,
        });

        const msgIndices = await Promise.all(
            ["c1.m1", "c2.m2", "c2a.m2a"].map((name) =>
                resolvePathToNodeIdx(name),
            ),
        );

        async function check_messages(shown: CascadeMessageShownTuple) {
            const stateVariables = await getStateVariables(core);
            for (const [ind, msgIdx] of msgIndices.entries()) {
                expect(
                    stateVariables[msgIdx].stateValues.hidden,
                    `message ${ind + 1}`,
                ).eq(!shown[ind]);
            }
        }

        const stateVariables = await getStateVariables(core);
        const [c1ans1, c1ans2, c2aans1] = await Promise.all(
            ["c1.prob1", "c1.prob2", "c2a.prob1"].map((name) =>
                resolvePathToNodeIdx(`${name}.ans`),
            ),
        );

        // Cascade 1 is live and speaks for the step it holds back; cascade 2 is
        // the next step and has a message of its own to show, so it is nominated
        // and speaks; cascade 2a, inside a cascade that is itself held back, says
        // nothing at all.
        await check_messages([true, true, false]);

        await runMathAnswerSequence({
            core,
            steps: [
                // Cascade 1's last step is showing, so it has no gap left.
                {
                    latex: "2",
                    mathInputIdx: getMathInputIdx(stateVariables, c1ans1),
                    answerIdx: c1ans1,
                    expected: [false, true, false] as const,
                },
                // Cascade 1 complete, so cascade 2 is live: it speaks for the gap
                // before its own last step, and cascade 2a — now live in turn —
                // speaks for the step it holds back. Each level has its own.
                {
                    latex: "0",
                    mathInputIdx: getMathInputIdx(stateVariables, c1ans2),
                    answerIdx: c1ans2,
                    expected: [false, true, true] as const,
                },
                // Cascade 2a's last step showing leaves it nothing to say, while
                // cascade 2 still holds back its last step.
                {
                    latex: "7",
                    mathInputIdx: getMathInputIdx(stateVariables, c2aans1),
                    answerIdx: c2aans1,
                    expected: [false, true, false] as const,
                },
            ],
            assertState: check_messages,
        });
    });

    // A nested `<cascade>` takes precedence over the enclosing cascade's own
    // message only if it really has one to show. It can have `<cascadeMessage>`
    // children and still have nothing to say — it shows one at most, and only in
    // a gap between two of its own steps — and were it nominated anyway, the
    // enclosing cascade would have suppressed its message for a step that then
    // said nothing, leaving the gap silent.
    it("a nested cascade with no message to show does not silence the cascade's", async () => {
        // Two ways for the nested cascade to come up empty: `revealAll` leaves it
        // no gap between steps to speak for, and having a single step it never
        // holds one back in the first place.
        for (const nested of [
            `<cascade name="inner" revealAll>
                 <problem name="q1"><p>What is 3+4? <answer name="ans">7</answer></p></problem>
                 <cascadeMessage name="msg">Finish the first half.</cascadeMessage>
                 <problem name="q2"><p>What is 3-4? <answer name="ans">-1</answer></p></problem>
             </cascade>`,
            `<cascade name="inner">
                 <cascadeMessage name="msg">Finish the first half.</cascadeMessage>
                 <problem name="q1"><p>What is 3+4? <answer name="ans">7</answer></p></problem>
             </cascade>`,
        ]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
<cascade name="w">
  <problem name="prob1"><p>What is 1+1? <answer name="ans">2</answer></p></problem>
  <cascadeMessage name="outer">Keep going...</cascadeMessage>
  ${nested}
</cascade>`,
            });

            const stateVariables = await getStateVariables(core);

            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .sectionToShowCascadeMessage,
            ).eq(null);
            expect(
                stateVariables[await resolvePathToNodeIdx("inner.msg")]
                    .stateValues.hidden,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("outer")].stateValues
                    .hidden,
            ).eq(false);
        }
    });

    // `hideFutureSections` hides a held-back step outright rather than replacing
    // its body with a message, so no step is nominated and no nested message is
    // shown. The cascade's own message still stands in for the hidden steps —
    // there is otherwise nothing at all between the reader and the end of the
    // cascade.
    it("hideFutureSections leaves a step's own message hidden", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w" hideFutureSections>
  <problem name="prob1"><p>What is 1+1? <answer name="ans">2</answer></p></problem>
  <cascadeMessage name="outer">Keep going...</cascadeMessage>
  <problem name="prob2">
    <cascadeMessage name="msg">Finish problem 1 to proceed.</cascadeMessage>
    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </problem>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const prob2Idx = await resolvePathToNodeIdx("prob2");
        const msgIdx = await resolvePathToNodeIdx("prob2.msg");
        const outerIdx = await resolvePathToNodeIdx("outer");
        const ansIdx = await resolvePathToNodeIdx("prob1.ans");

        let stateVariables = await getStateVariables(core);

        // Problem 2 is hidden whole, so it is not nominated and its message
        // stays hidden with it; the cascade's own message shows in its place.
        expect(stateVariables[prob2Idx].stateValues.hidden).eq(true);
        expect(stateVariables[wIdx].stateValues.sectionToShowCascadeMessage).eq(
            null,
        );
        expect(stateVariables[msgIdx].stateValues.hidden).eq(true);
        expect(stateVariables[outerIdx].stateValues.hidden).eq(false);

        await submitMathAnswer({
            core,
            latex: "2",
            mathInputIdx: getMathInputIdx(stateVariables, ansIdx),
            answerIdx: ansIdx,
        });

        stateVariables = await getStateVariables(core);

        // Revealed, problem 2 hides its own message as any shown section does,
        // and the cascade's message has no gap left to stand in for.
        expect(stateVariables[prob2Idx].stateValues.hidden).eq(false);
        expect(stateVariables[msgIdx].stateValues.hidden).eq(true);
        expect(stateVariables[outerIdx].stateValues.hidden).eq(true);
    });

    // `revealAll` holds nothing back, so there is nothing for any message to
    // stand in for: both placements are hidden from the start.
    it("revealAll hides every continuation message", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w" revealAll>
  <problem name="prob1"><p>What is 1+1? <answer name="ans">2</answer></p></problem>
  <cascadeMessage name="outer">Keep going...</cascadeMessage>
  <problem name="prob2">
    <cascadeMessage name="msg">Finish problem 1 to proceed.</cascadeMessage>
    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </problem>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const prob2Idx = await resolvePathToNodeIdx("prob2");
        const prob2pIdx = await resolvePathToNodeIdx("prob2.p");

        const stateVariables = await getStateVariables(core);

        expect(stateVariables[prob2Idx].stateValues.hideChildren).eq(false);
        expect(stateVariables[prob2pIdx].stateValues.hidden).eq(false);
        expect(stateVariables[wIdx].stateValues.sectionToShowCascadeMessage).eq(
            null,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("prob2.msg")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("outer")].stateValues
                .hidden,
        ).eq(true);
    });

    it("one continuation message inside cascade", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <title>My cascade</title>

  <div name="div1">
    <p name="p1a">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p1b">What is 1-1? <answer name="ans">0</answer></p>
  </div>


  <p name="p2">What is 3+4? <answer name="ans">7</answer></p>

  <p name="p3">What is 3-4? <answer name="ans">-1</answer></p>

  <cascadeMessage name="cm"><em>Continued...</em></cascadeMessage>

</cascade>

  `,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const div1Idx = await resolvePathToNodeIdx("div1");
        const p1aIdx = await resolvePathToNodeIdx("div1.p1a");
        const p1bIdx = await resolvePathToNodeIdx("div1.p1b");
        const p2Idx = await resolvePathToNodeIdx("p2");
        const p3Idx = await resolvePathToNodeIdx("p3");
        const cmIdx = await resolvePathToNodeIdx("cm");

        async function check_values(numCompleted: number) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[wIdx].stateValues.numCompleted).eq(
                numCompleted,
            );
            expect(stateVariables[div1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[p1aIdx].stateValues.hidden).eq(false);
            expect(stateVariables[p1bIdx].stateValues.hidden).eq(false);

            expect(stateVariables[p2Idx].stateValues.hidden).eq(
                numCompleted < 1,
            );

            expect(stateVariables[p3Idx].stateValues.hidden).eq(
                numCompleted < 2,
            );

            expect(stateVariables[cmIdx].stateValues.hidden).eq(
                numCompleted >= 2,
            );
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("p1a.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("p1b.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer2Idx = await resolvePathToNodeIdx("p2.ans");
        const mathInput2Idx = getMathInputIdx(stateVariables, answer2Idx);
        const answer3Idx = await resolvePathToNodeIdx("p3.ans");
        const mathInput3Idx = getMathInputIdx(stateVariables, answer3Idx);

        await check_values(0);

        const answerSequence = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 1,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput3Idx,
                answerIdx: answer3Idx,
                expected: 3,
            },
            {
                latex: "11",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 3,
            },
        ];

        await runMathAnswerSequence({
            core,
            steps: answerSequence,
            assertState: check_values,
        });
    });

    it("multiple continuation messages inside cascade", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <title>My cascade</title>

  <cascadeMessage name="cm1"><em>Never seen</em></cascadeMessage>

  <div name="div1">
    <p name="p1a">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p1b">What is 1-1? <answer name="ans">0</answer></p>
  </div>

  <cascadeMessage name="cm2"><em>Keep going...</em></cascadeMessage>

  <p name="p2">What is 3+4? <answer name="ans">7</answer></p>
  <cascadeMessage name="cm3"><em>Almost done...</em></cascadeMessage>

  <p name="p3">What is 3-4? <answer name="ans">-1</answer></p>

  <cascadeMessage name="cm4"><em>Never seen either</em></cascadeMessage>

</cascade>

  `,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const div1Idx = await resolvePathToNodeIdx("div1");
        const p1aIdx = await resolvePathToNodeIdx("div1.p1a");
        const p1bIdx = await resolvePathToNodeIdx("div1.p1b");
        const p2Idx = await resolvePathToNodeIdx("p2");
        const p3Idx = await resolvePathToNodeIdx("p3");
        const cm1Idx = await resolvePathToNodeIdx("cm1");
        const cm2Idx = await resolvePathToNodeIdx("cm2");
        const cm3Idx = await resolvePathToNodeIdx("cm3");
        const cm4Idx = await resolvePathToNodeIdx("cm4");

        async function check_values(numCompleted: number) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[wIdx].stateValues.numCompleted).eq(
                numCompleted,
            );
            expect(stateVariables[div1Idx].stateValues.hidden).eq(false);
            expect(stateVariables[p1aIdx].stateValues.hidden).eq(false);
            expect(stateVariables[p1bIdx].stateValues.hidden).eq(false);

            expect(stateVariables[p2Idx].stateValues.hidden).eq(
                numCompleted < 1,
            );

            expect(stateVariables[p3Idx].stateValues.hidden).eq(
                numCompleted < 2,
            );

            expect(stateVariables[cm1Idx].stateValues.hidden).eq(true);
            expect(stateVariables[cm2Idx].stateValues.hidden).eq(
                numCompleted > 0,
            );
            expect(stateVariables[cm3Idx].stateValues.hidden).eq(
                numCompleted !== 1,
            );
            expect(stateVariables[cm4Idx].stateValues.hidden).eq(true);
        }

        const stateVariables = await getStateVariables(core);
        const answer11Idx = await resolvePathToNodeIdx("p1a.ans");
        const mathInput11Idx = getMathInputIdx(stateVariables, answer11Idx);
        const answer12Idx = await resolvePathToNodeIdx("p1b.ans");
        const mathInput12Idx = getMathInputIdx(stateVariables, answer12Idx);
        const answer2Idx = await resolvePathToNodeIdx("p2.ans");
        const mathInput2Idx = getMathInputIdx(stateVariables, answer2Idx);
        const answer3Idx = await resolvePathToNodeIdx("p3.ans");
        const mathInput3Idx = getMathInputIdx(stateVariables, answer3Idx);

        await check_values(0);

        const answerSequence = [
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 1,
            },
            {
                latex: "3",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 0,
            },
            {
                latex: "2",
                mathInputIdx: mathInput11Idx,
                answerIdx: answer11Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 0,
            },
            {
                latex: "0",
                mathInputIdx: mathInput12Idx,
                answerIdx: answer12Idx,
                expected: 2,
            },
            {
                latex: "-1",
                mathInputIdx: mathInput3Idx,
                answerIdx: answer3Idx,
                expected: 3,
            },
            {
                latex: "11",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 1,
            },
            {
                latex: "7",
                mathInputIdx: mathInput2Idx,
                answerIdx: answer2Idx,
                expected: 3,
            },
        ];

        await runMathAnswerSequence({
            core,
            steps: answerSequence,
            assertState: check_values,
        });
    });

    it("hide string children in sections", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <title>My cascade</title>

  <section boxed name="section1">
    <title>First part</title>

    What is 1+1? <answer name="ans">2</answer>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    What is 3+4? <answer name="ans">7</answer>
  </section>

</cascade>
  `,
        });

        let stateVariables = await getStateVariables(core);
        const answer1Idx = await resolvePathToNodeIdx("section1.ans");
        const mathInput1Idx = getMathInputIdx(stateVariables, answer1Idx);

        const section2Idx = await resolvePathToNodeIdx("section2");
        const answer2Idx = await resolvePathToNodeIdx("section2.ans");

        const stringIdx = 2;
        expect(stateVariables[section2Idx].activeChildren[stringIdx].trim()).eq(
            "What is 3+4?",
        );

        // string indices 0,2,4 (in particular `stringIdx`) are not included in childIndicesToRender
        expect(
            stateVariables[section2Idx].stateValues.childIndicesToRender,
        ).eqls([1, 3]);
        expect(stateVariables[section2Idx].stateValues.childrenToHide).eqls([
            answer2Idx,
        ]);

        await submitMathAnswer({
            latex: "2",
            mathInputIdx: mathInput1Idx,
            answerIdx: answer1Idx,
            core,
        });

        stateVariables = await getStateVariables(core);

        // now string indices are rendered
        expect(
            stateVariables[section2Idx].stateValues.childIndicesToRender,
        ).eqls([0, 1, 2, 3, 4]);
        expect(stateVariables[section2Idx].stateValues.childrenToHide).eqls([]);
    });

    it("do not render or hide the configuration children of a section", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <section boxed name="section1">
    <title>First part</title>
    What is 1+1? <answer name="ans">2</answer>
  </section>

  <section boxed name="section2">
    <title name="title2">Second part</title>
    <stylePalette name="palette2" palette="okabeito" />
    <styleDefinition name="styleDef2" styleNumber="2" lineOpacity="1" />
    <p name="p2">What is 3+4?</p>
    <answer name="ans">7</answer>
  </section>
</cascade>
  `,
        });

        const stateVariables = await getStateVariables(core);
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section2 = stateVariables[section2Idx];

        // `childIndicesToRender` holds positions in `activeChildren`, so resolve
        // it back to components rather than assert on the positions themselves.
        const renderedChildComponentIndices =
            section2.stateValues.childIndicesToRender
                .map((ind: number) => section2.activeChildren[ind])
                .filter((child: any) => typeof child === "object")
                .map((child: any) => child.componentIdx);

        expect(renderedChildComponentIndices).eqls([
            await resolvePathToNodeIdx("title2"),
            await resolvePathToNodeIdx("p2"),
            await resolvePathToNodeIdx("section2.ans"),
        ]);

        // `section2` is hidden because `section1` has not been answered yet.
        // Its title stays visible and its style children are left alone.
        expect(section2.stateValues.childrenToHide).eqls([
            await resolvePathToNodeIdx("p2"),
            await resolvePathToNodeIdx("section2.ans"),
        ]);
    });

    it("do not hide the setup or variant control of a hidden section", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <section boxed name="section1">
    <title>First part</title>
    What is 1+1? <answer name="ans">2</answer>
  </section>

  <section boxed name="section2">
    <title name="title2">Second part</title>
    <variantControl name="vc2" numVariants="2" />
    <setup name="setup2">
      <p name="prompt2">Add <number name="n2">7</number></p>
    </setup>
    <p name="p2">What is 3+4?</p>
    <answer name="ans">7</answer>
  </section>
</cascade>
  `,
        });

        const stateVariables = await getStateVariables(core);
        const section2 = stateVariables[await resolvePathToNodeIdx("section2")];

        // `<setup>` and `<variantControl>` are configuration children, so
        // `section2` leaves them out of `childrenToHide` even though it is
        // hidden until `section1` is answered. Neither renders, so this changes
        // nothing on screen; what it does is keep the definitions inside a
        // `<setup>` usable while the section is unrevealed. Hiding the `<setup>`
        // hid everything under it, and a hidden child drops out of its parent's
        // `text`, so `prompt2.text` was missing its `<number>`.
        expect(section2.stateValues.childrenToHide).eqls([
            await resolvePathToNodeIdx("p2"),
            await resolvePathToNodeIdx("section2.ans"),
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("setup2")].stateValues
                .hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("n2")].stateValues.hidden,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("prompt2")].stateValues
                .text,
        ).eq("Add 7");
    });

    it("boxAll boxes only immediate section children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade boxAll>
    <section name="section1">
        <title>Section 1</title>
        <p>Top-level section</p>
        <section name="nestedSection">
            <title>Nested Section</title>
            <p>Nested section inside section1</p>
        </section>
    </section>
    <section name="section2">
        <title>Section 2</title>
        <p>Another top-level section</p>
    </section>
    <section boxed="false" name="section3">
        <title>Section 3</title>
        <p>Explicitly unboxed top-level section</p>
    </section>
</cascade>
    `,
        });

        const stateVariables = await getStateVariables(core);
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section3Idx = await resolvePathToNodeIdx("section3");
        const nestedSectionIdx = await resolvePathToNodeIdx("nestedSection");

        expect(stateVariables[section1Idx].stateValues.boxed).eq(true);
        expect(stateVariables[section2Idx].stateValues.boxed).eq(true);
        expect(stateVariables[section3Idx].stateValues.boxed).eq(false);
        expect(stateVariables[nestedSectionIdx].stateValues.boxed).eq(false);
    });

    it("just submitted is not set to false in choice input inside cascade", async () => {
        const doenetML = `
<cascade>
  <section boxed>
    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1"><text>correct</text></choice>
        <choice><m>1 > 2</m></choice>
      </choiceInput>
    </answer>
  </section>
  <section boxed>
    <answer name="ans2">
      <choiceInput name="ci2">
        <choice><text>incorrect</text></choice>
        <choice credit="1"><m>1 < 2</m></choice>
      </choiceInput>
    </answer>
  </section>
</cascade>
  `;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        const ci1Idx = await resolvePathToNodeIdx("ci1");
        const ci2Idx = await resolvePathToNodeIdx("ci2");
        const ans1Idx = await resolvePathToNodeIdx("ans1");
        const ans2Idx = await resolvePathToNodeIdx("ans2");

        async function check_items(
            justSubmitted: boolean[],
            creditAchieved: number[],
        ) {
            const stateVariables = await getStateVariables(core);

            expect(stateVariables[ci1Idx].stateValues.justSubmitted).eq(
                justSubmitted[0],
            );
            expect(stateVariables[ans1Idx].stateValues.creditAchieved).eq(
                creditAchieved[0],
            );
            expect(stateVariables[ci2Idx].stateValues.hidden).eq(
                creditAchieved[0] < 1,
            );
            expect(stateVariables[ci2Idx].stateValues.justSubmitted).eq(
                justSubmitted[1],
            );
            expect(stateVariables[ans2Idx].stateValues.creditAchieved).eq(
                creditAchieved[1],
            );
        }

        await submitChoiceAnswer({
            choiceInputIdx: ci1Idx,
            answerIdx: ans1Idx,
            selectedIndices: [1],
            core,
        });

        await check_items([true, false], [1, 0]);

        await submitChoiceAnswer({
            choiceInputIdx: ci1Idx,
            answerIdx: ans1Idx,
            selectedIndices: [2],
            core,
        });

        await check_items([true, false], [0, 0]);

        await submitChoiceAnswer({
            choiceInputIdx: ci1Idx,
            answerIdx: ans1Idx,
            selectedIndices: [1],
            core,
        });

        await check_items([true, false], [1, 0]);

        await submitChoiceAnswer({
            choiceInputIdx: ci2Idx,
            answerIdx: ans2Idx,
            selectedIndices: [2],
            core,
        });
        await check_items([true, true], [1, 1]);
    });

    it("just submitted is not set to false for choice with math inside a repeat inside a cascade", async () => {
        // Regression test: a `<choice>` containing a repeated `<m>` child whose
        // `hiddenIgnoreParent` chain must not climb to the cascade's
        // credit-based visibility. Submitting the answer changed the recursive
        // credit-achieved dependencies, which incorrectly reset `justSubmitted`
        // to false, leaving the check-work button stuck.
        const doenetML = `
<cascade>
  <subsection>
    <repeatForSequence from="1" to="1">
      <answer name="ans">
        <choiceInput name="b" inline preselectChoice="1">
          <choice credit="1">Crosses the <m>x</m>-axis almost linearly</choice>
        </choiceInput>
      </answer>
    </repeatForSequence>
  </subsection>
  <subsection>
    <p>Next section</p>
  </subsection>
</cascade>
  `;
        const { core } = await createTestCore({
            doenetML,
        });

        let stateVariables = await getStateVariables(core);
        const answerIndices = Object.keys(stateVariables)
            .filter((k) => stateVariables[k].componentType === "answer")
            .map(Number);
        const choiceInputIndices = Object.keys(stateVariables)
            .filter((k) => stateVariables[k].componentType === "choiceInput")
            .map(Number);
        expect(answerIndices.length).eq(1);
        expect(choiceInputIndices.length).eq(1);
        const ansIdx = answerIndices[0];
        const choiceInputIdx = choiceInputIndices[0];

        await submitAnswer({ componentIdx: ansIdx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[ansIdx].stateValues.justSubmitted).eq(true);
        expect(stateVariables[choiceInputIdx].stateValues.justSubmitted).eq(
            true,
        );
        expect(stateVariables[ansIdx].stateValues.creditAchieved).eq(1);
    });

    // A list item lines its number up with — and suppresses the top margin of —
    // its first child that renders something, which means skipping one that hid
    // itself with `hide`. A `<cascade>` is where the two ways a child can be off
    // screen come apart, and this pins each to its own answer: a revealed step
    // skips the child that hid *itself* and hands the lead to the next one, while
    // a step the cascade has not reached hides every child at once through
    // `hideChildren` and delegates to nobody. Revealing that step then hands the
    // lead to the child it would have had all along, so nothing about a cascade
    // advancing moves a number sideways.
    it("picks a list item's lead by the child's own hide, not the cascade's", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<problems name="probs">
  <cascade name="cascade">
    <problem name="prob1">
      <p name="hiddenLead" hide>Hidden setup text</p>
      <p name="lead1">What is 1+1? <answer name="ans1">2</answer></p>
    </problem>
    <problem name="prob2">
      <p name="lead2">What is 2+2? <answer name="ans2">4</answer></p>
    </problem>
  </cascade>
</problems>`,
        });

        const prob1Idx = await resolvePathToNodeIdx("prob1");
        const prob2Idx = await resolvePathToNodeIdx("prob2");
        const hiddenLeadIdx = await resolvePathToNodeIdx("prob1.hiddenLead");
        const lead1Idx = await resolvePathToNodeIdx("prob1.lead1");
        const lead2Idx = await resolvePathToNodeIdx("prob2.lead2");
        const ans1Idx = await resolvePathToNodeIdx("prob1.ans1");

        let stateVariables = await getStateVariables(core);

        // Both problems are numbered list items, so both delegate to a lead.
        expect(stateVariables[prob1Idx].stateValues.isListItem).eq(true);
        expect(stateVariables[prob2Idx].stateValues.isListItem).eq(true);

        // The revealed step skips the child that hid itself.
        expect(stateVariables[hiddenLeadIdx].stateValues.hidden).eq(true);
        expect(
            stateVariables[prob1Idx].stateValues.firstVisibleChild.componentIdx,
        ).eq(lead1Idx);
        expect(
            stateVariables[hiddenLeadIdx].stateValues.renderInlineForListItem,
        ).eq(false);
        expect(stateVariables[lead1Idx].stateValues.renderInlineForListItem).eq(
            true,
        );

        // The step the cascade has not reached hides all of its children, so it
        // delegates to nobody at all — the container's hiding, not any child's
        // own `hide`, is what leaves it without a lead. This step has no
        // `<cascadeMessage>`, so `childrenToHide` really does hold every
        // component child it has; the step that does show one is
        // "gives a held-back step's lead to the cascadeMessage it shows", below.
        expect(stateVariables[prob2Idx].stateValues.hideChildren).eq(true);
        expect(stateVariables[prob2Idx].stateValues.firstVisibleChild).eq(null);
        expect(stateVariables[lead2Idx].stateValues.hidden).eq(true);
        expect(stateVariables[lead2Idx].stateValues.renderInlineForListItem).eq(
            false,
        );

        // "No lead" has to be reported as no lead. `typeof null === "object"`,
        // so the flag that says a *component* leads this section had to test for
        // null before testing the type, or a section delegating to nobody would
        // claim it had a component first child to suppress the margin of.
        expect(
            stateVariables[prob2Idx].stateValues
                .firstVisibleChildAdjustedForListItem,
        ).eq(false);
        expect(stateVariables[prob2Idx].stateValues.useListItemGridLayout).eq(
            false,
        );

        await submitMathAnswer({
            core,
            latex: "2",
            mathInputIdx: getMathInputIdx(stateVariables, ans1Idx),
            answerIdx: ans1Idx,
        });

        stateVariables = await getStateVariables(core);

        // Revealing the second step hands the lead to the same child that would
        // have had it all along: the container's hiding never moved it.
        expect(stateVariables[prob2Idx].stateValues.hideChildren).eq(false);
        expect(
            stateVariables[prob2Idx].stateValues.firstVisibleChild.componentIdx,
        ).eq(lead2Idx);
        expect(stateVariables[lead2Idx].stateValues.renderInlineForListItem).eq(
            true,
        );
    });

    // `<cascadeMessage>` is the one child a section hides while showing
    // everything else: its rule is inverted, so it is hidden exactly when the
    // step's content is revealed. That makes it the case where the renderer and
    // the core could disagree about which child leads a list item — the renderer
    // never draws the message, so the core must not hand it the number. It hides
    // neither by kind nor by its own `hide`, so `childRendersSomething()` alone
    // does not catch it; the section's own `childrenToHide` is what does.
    it("does not give a list item's lead to a hidden cascadeMessage", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<problems name="probs">
  <problem name="prob">
    <cascadeMessage name="msg">Finish the previous problem first</cascadeMessage>
    <p name="lead">Real content</p>
  </problem>
</problems>`,
        });

        const stateVariables = await getStateVariables(core);
        const probIdx = await resolvePathToNodeIdx("prob");
        const msgIdx = await resolvePathToNodeIdx("msg");
        const leadIdx = await resolvePathToNodeIdx("lead");
        const prob = stateVariables[probIdx].stateValues;

        // The setup: a numbered list item that shows its content, and so hides
        // its message even though nothing set `hide` on it.
        expect(prob.isListItem).eq(true);
        expect(prob.hideChildren).eq(false);
        expect(prob.childrenToHide).eqls([msgIdx]);
        expect(stateVariables[msgIdx].stateValues.hidden).eq(true);
        expect(stateVariables[msgIdx].stateValues.hiddenIgnoreParent).eq(false);

        // So the `<p>` behind it leads, and gets the top-margin suppression.
        expect(prob.firstVisibleChild.componentIdx).eq(leadIdx);
        expect(stateVariables[leadIdx].stateValues.renderInlineForListItem).eq(
            true,
        );
        expect(stateVariables[msgIdx].stateValues.renderInlineForListItem).eq(
            false,
        );
    });

    // The mirror of the test above, and the one #1680 was about: while the step
    // is held back, its `<cascadeMessage>` is the one child on the screen, so it
    // is the child the item's number lines up with. Treating "held back" as
    // "nothing to delegate to" left the message leading nothing — the item fell
    // out of the numbering grid entirely and the message kept the top margin
    // that put it a line below its own number.
    //
    // Both halves of the transition are asserted, because the lead has to follow
    // the cascade in both directions and `firstVisibleChild` does not ask
    // `hideChildren` itself: it learns of the change through `childrenToHide`,
    // which the message enters as the step is revealed.
    it("gives a held-back step's lead to the cascadeMessage it shows", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<problems name="probs">
  <cascade name="cascade">
    <problem name="prob1">
      <p name="lead1">What is 1+1? <answer name="ans1">2</answer></p>
    </problem>
    <problem name="prob2">
      <cascadeMessage name="msg">Answer the previous question to continue</cascadeMessage>
      <p name="lead2">What is 2+2? <answer name="ans2">4</answer></p>
    </problem>
  </cascade>
</problems>`,
        });

        const prob2Idx = await resolvePathToNodeIdx("prob2");
        const msgIdx = await resolvePathToNodeIdx("msg");
        const lead2Idx = await resolvePathToNodeIdx("lead2");
        const ans1Idx = await resolvePathToNodeIdx("ans1");

        let stateVariables = await getStateVariables(core);
        let prob2 = stateVariables[prob2Idx].stateValues;

        // The setup: the step is held back, so its content is hidden and its
        // message — alone among its children — is not.
        expect(prob2.hideChildren).eq(true);
        expect(prob2.childrenToHide).eqls([lead2Idx]);
        expect(stateVariables[msgIdx].stateValues.hidden).eq(false);
        expect(stateVariables[lead2Idx].stateValues.hidden).eq(true);

        // So the message leads: the item numbers itself with the grid layout, and
        // the message's top margin is suppressed, which is what puts the message
        // and the number on one row rather than two.
        expect(prob2.firstVisibleChild.componentIdx).eq(msgIdx);
        expect(prob2.useListItemGridLayout).eq(true);
        expect(prob2.firstChildListItemAlignment).eq("baseline");
        expect(stateVariables[msgIdx].stateValues.renderInlineForListItem).eq(
            true,
        );

        await submitMathAnswer({
            core,
            latex: "2",
            mathInputIdx: getMathInputIdx(stateVariables, ans1Idx),
            answerIdx: ans1Idx,
        });

        stateVariables = await getStateVariables(core);
        prob2 = stateVariables[prob2Idx].stateValues;

        // Revealed, the rule inverts with the message's visibility: the message
        // is now the hidden child and the content leads.
        expect(prob2.hideChildren).eq(false);
        expect(prob2.childrenToHide).eqls([msgIdx]);
        expect(prob2.firstVisibleChild.componentIdx).eq(lead2Idx);
        expect(prob2.useListItemGridLayout).eq(true);
        expect(stateVariables[msgIdx].stateValues.renderInlineForListItem).eq(
            false,
        );
        expect(stateVariables[lead2Idx].stateValues.renderInlineForListItem).eq(
            true,
        );
    });

    // A hand-graded answer's `creditAchieved` stays 0 until an instructor grades
    // it, which happens outside the document entirely. Scoring the cascade on it
    // would leave the reader stuck at that step no matter what they wrote, so
    // progress asks instead whether they actually responded.
    it("a hand-graded answer completes a step once a non-blank response is submitted", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <section name="section1">
    <p name="p">What is 1+1? <answer name="ans">2</answer></p>
  </section>

  <section name="section2">
    <p name="p">Explain your reasoning. <answer handGraded name="ans" type="text" /></p>
  </section>

  <section name="section3">
    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const section3Idx = await resolvePathToNodeIdx("section3");
        const ans1Idx = await resolvePathToNodeIdx("section1.p.ans");
        const ans2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const ans3Idx = await resolvePathToNodeIdx("section3.p.ans");

        let stateVariables = await getStateVariables(core);
        const mathInput1Idx = getMathInputIdx(stateVariables, ans1Idx);
        const textInputIdx =
            stateVariables[ans2Idx].stateValues.inputChildren[0].componentIdx;
        const mathInput3Idx = getMathInputIdx(stateVariables, ans3Idx);

        expect(stateVariables[wIdx].stateValues.numCompleted).eq(0);

        await submitMathAnswer({
            core,
            latex: "2",
            mathInputIdx: mathInput1Idx,
            answerIdx: ans1Idx,
        });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
        expect(stateVariables[section3Idx].stateValues.hideChildren).eq(true);

        // Submitting an untouched input is not a response, so the step stays put.
        await submitAnswer({ componentIdx: ans2Idx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[ans2Idx].stateValues.responseHasBeenSubmitted).eq(
            true,
        );
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
        expect(stateVariables[section3Idx].stateValues.hideChildren).eq(true);

        // Nor is whitespace. The response is recorded exactly as typed, so it
        // is the blankness test that has to trim rather than the input.
        await updateTextInputValue({
            text: "   ",
            componentIdx: textInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: ans2Idx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[ans2Idx].stateValues.submittedResponses).eqls([
            "   ",
        ]);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
        expect(stateVariables[section3Idx].stateValues.hideChildren).eq(true);

        await updateTextInputValue({
            text: "because it is",
            componentIdx: textInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: ans2Idx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(2);
        expect(stateVariables[section3Idx].stateValues.hideChildren).eq(false);

        // The score itself is untouched: the answer is still awaiting grading.
        expect(stateVariables[ans2Idx].stateValues.creditAchieved).eq(0);
        expect(stateVariables[section2Idx].stateValues.creditAchieved).eq(0);

        await submitMathAnswer({
            core,
            latex: "-1",
            mathInputIdx: mathInput3Idx,
            answerIdx: ans3Idx,
        });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(3);

        // Clearing the response takes the step back: what the cascade tracks is
        // the response standing now, not that one was submitted at some point.
        await updateTextInputValue({
            text: "",
            componentIdx: textInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: ans2Idx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
    });

    // The same rule for a math response, where "blank" is the placeholder an
    // empty `<mathInput>` submits rather than an empty string.
    it("a blank math response does not complete a hand-graded step", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <section name="section1">
    <p name="p">Show your work. <answer handGraded name="ans" /></p>
  </section>

  <section name="section2">
    <p name="p">What is 1+1? <answer name="ans">2</answer></p>
  </section>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const ansIdx = await resolvePathToNodeIdx("section1.p.ans");

        let stateVariables = await getStateVariables(core);
        const mathInputIdx = getMathInputIdx(stateVariables, ansIdx);

        await submitAnswer({ componentIdx: ansIdx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(0);

        await submitMathAnswer({
            core,
            latex: "x+1",
            mathInputIdx,
            answerIdx: ansIdx,
        });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
        expect(stateVariables[ansIdx].stateValues.creditAchieved).eq(0);
    });

    // An untouched `<matrixInput>` submits a matrix of placeholders rather than
    // a bare one, so the blankness test has to look inside the matrix.
    it("a blank matrix response does not complete a hand-graded step", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <section name="section1">
    <p name="p">Write the matrix.
      <answer handGraded name="ans">
        <matrixInput name="mi" numRows="2" numColumns="2" />
        <award><matrix><row>1 2</row><row>3 4</row></matrix></award>
      </answer>
    </p>
  </section>

  <section name="section2">
    <p name="p">What is 1+1? <answer name="ans">2</answer></p>
  </section>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const ansIdx = await resolvePathToNodeIdx("section1.p.ans");
        const matrixInputIdx = await resolvePathToNodeIdx("section1.p.ans.mi");

        await submitAnswer({ componentIdx: ansIdx, core });

        let stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(0);

        // One filled cell is a response, even though the rest stay blank.
        await updateMatrixInputValue({
            latex: "5",
            componentIdx: matrixInputIdx,
            rowInd: 1,
            colInd: 0,
            core,
        });
        await submitAnswer({ componentIdx: ansIdx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
        expect(stateVariables[ansIdx].stateValues.creditAchieved).eq(0);
    });

    // A step that mixes the two kinds of answer is complete only when both are:
    // the hand-graded one contributes its full weight once answered, so the
    // auto-graded one still has to be right.
    it("a hand-graded answer alongside an auto-graded one", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <section name="section1">
    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">Why? <answer handGraded name="ans" type="text" /></p>
  </section>

  <section name="section2">
    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const autoIdx = await resolvePathToNodeIdx("section1.p1.ans");
        const handIdx = await resolvePathToNodeIdx("section1.p2.ans");

        let stateVariables = await getStateVariables(core);
        const mathInputIdx = getMathInputIdx(stateVariables, autoIdx);
        const textInputIdx =
            stateVariables[handIdx].stateValues.inputChildren[0].componentIdx;

        await updateTextInputValue({
            text: "it just is",
            componentIdx: textInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: handIdx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(0);

        await submitMathAnswer({
            core,
            latex: "3",
            mathInputIdx,
            answerIdx: autoIdx,
        });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(0);

        await submitMathAnswer({
            core,
            latex: "2",
            mathInputIdx,
            answerIdx: autoIdx,
        });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
    });

    // The two inputs with no placeholder of their own. An unselected
    // `<choiceInput>` submits no response value at all, whereas an unchecked
    // `<booleanInput>` submits `false` — indistinguishable from the reader
    // deliberately leaving the box unchecked, so it counts as an answer.
    it("a choice must be chosen, but an unchecked box is already an answer", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w">
  <section name="section1">
    <p name="p">Pick one.
      <answer handGraded name="ans">
        <choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>
      </answer>
    </p>
  </section>

  <section name="section2">
    <p name="p">Agree?
      <answer handGraded name="ans">
        <booleanInput name="bi" />
        <award><boolean>true</boolean></award>
      </answer>
    </p>
  </section>

  <section name="section3">
    <p name="p">What is 1+1? <answer name="ans">2</answer></p>
  </section>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const choiceAnsIdx = await resolvePathToNodeIdx("section1.p.ans");
        const choiceInputIdx = await resolvePathToNodeIdx("section1.p.ans.ci");
        const booleanAnsIdx = await resolvePathToNodeIdx("section2.p.ans");

        await submitAnswer({ componentIdx: choiceAnsIdx, core });

        let stateVariables = await getStateVariables(core);
        expect(
            stateVariables[choiceAnsIdx].stateValues.submittedResponses,
        ).eqls([]);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(0);

        await updateSelectedIndices({
            componentIdx: choiceInputIdx,
            selectedIndices: [2],
            core,
        });
        await submitAnswer({ componentIdx: choiceAnsIdx, core });

        // The box is left alone, and submitting it as it stands is an answer.
        await submitAnswer({ componentIdx: booleanAnsIdx, core });

        stateVariables = await getStateVariables(core);
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(2);
        expect(stateVariables[booleanAnsIdx].stateValues.creditAchieved).eq(0);
    });

    // `completedColorRequiresCredit` is about the heading bar only. A cascade
    // that stopped advancing because a section was colored strictly would trap
    // the reader again, which is the whole thing this is meant to prevent.
    it("completedColorRequiresCredit does not hold back a cascade", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<cascade name="w" completedColorRequiresCredit>
  <section name="section1" boxed completedColor="blue" inProgressColor="cyan" notStartedColor="beige">
    <p name="p">Explain your reasoning. <answer handGraded name="ans" type="text" /></p>
  </section>

  <section name="section2">
    <p name="p">What is 1+1? <answer name="ans">2</answer></p>
  </section>
</cascade>`,
        });

        const wIdx = await resolvePathToNodeIdx("w");
        const section1Idx = await resolvePathToNodeIdx("section1");
        const section2Idx = await resolvePathToNodeIdx("section2");
        const ansIdx = await resolvePathToNodeIdx("section1.p.ans");

        let stateVariables = await getStateVariables(core);
        const textInputIdx =
            stateVariables[ansIdx].stateValues.inputChildren[0].componentIdx;

        // Inherited from the cascade, which is itself a section.
        expect(
            stateVariables[section1Idx].stateValues
                .completedColorRequiresCredit,
        ).eq(true);

        await updateTextInputValue({
            text: "because it is",
            componentIdx: textInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: ansIdx, core });

        stateVariables = await getStateVariables(core);

        // The step is complete and the next one is revealed, even though the
        // bar is still waiting for the grade.
        expect(stateVariables[wIdx].stateValues.numCompleted).eq(1);
        expect(stateVariables[section2Idx].stateValues.hideChildren).eq(false);
        expect(stateVariables[section1Idx].stateValues.titleColor).eq("beige");
    });

    // A reader who closes the page and comes back has to find the step still
    // open. `creditAchievedForProgress` is recomputed rather than saved — only
    // `responseHasBeenSubmitted` and `submittedResponses` are essential — so
    // what is restored has to be enough to rebuild it. For an auto-graded
    // answer the restored `creditAchieved` carries the progress directly, and
    // this is the case where it cannot.
    it("hand-graded progress survives a reload", async () => {
        const doenetML = `
<cascade name="w">
  <section name="section1">
    <p name="p">Explain your reasoning. <answer handGraded name="ans" type="text" /></p>
  </section>

  <section name="section2">
    <p name="p">What is 1+1? <answer name="ans">2</answer></p>
  </section>
</cascade>`;

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        const ansIdx = await resolvePathToNodeIdx("section1.p.ans");
        let stateVariables = await getStateVariables(core);
        const textInputIdx =
            stateVariables[ansIdx].stateValues.inputChildren[0].componentIdx;

        await updateTextInputValue({
            text: "because it is",
            componentIdx: textInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: ansIdx, core });

        stateVariables = await getStateVariables(core);
        expect(
            stateVariables[await resolvePathToNodeIdx("w")].stateValues
                .numCompleted,
        ).eq(1);

        await core.saveImmediately();

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));

        stateVariables = await getStateVariables(core);
        expect(
            stateVariables[await resolvePathToNodeIdx("w")].stateValues
                .numCompleted,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("section2")].stateValues
                .hideChildren,
        ).eq(false);
    });
});
