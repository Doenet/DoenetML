import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    submitAnswer,
    updateMathInputValue,
    updateSelectedIndices,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// The drill's clock reads `Date.now`; tests move it by hand. Animation frames
// never run in the test core, so tests call `tick` and `advanceRound`
// themselves.
let now = 1_000_000;

beforeEach(() => {
    now = 1_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
});

afterEach(() => {
    vi.restoreAllMocks();
});

/**
 * Template for most tests: type the number shown. `<selectFromSequence>`
 * chooses a new number for each round.
 */
const typeTheNumber = `
  <selectFromSequence name="x" from="1" to="100000" hide />
  <p>Type <number name="shown">$x</number>:
    <answer name="ans"><mathInput name="mi" /><award><math>$x</math></award></answer>
  </p>
`;

function setup({
    core,
    resolvePathToNodeIdx,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
}) {
    async function drill() {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx("d")].stateValues;
    }

    async function act(actionName: string, args = {}) {
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("d"),
            actionName,
            args,
        });
    }

    /**
     * The components of the question showing, found by walking the drill's
     * children (the names in a round are local to it).
     */
    async function round() {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const found: { componentIdx: number; componentType: string }[] = [];
        function walk(idx: number) {
            for (const child of stateVariables[idx]?.activeChildren ?? []) {
                if (typeof child === "object" && child !== null) {
                    found.push({
                        componentIdx: child.componentIdx,
                        componentType: child.componentType,
                    });
                    walk(child.componentIdx);
                }
            }
        }
        walk(await resolvePathToNodeIdx("d"));
        const ofType = (type: string) =>
            found.filter((c) => c.componentType === type);
        const answerIdx = ofType("answer")[0]?.componentIdx;
        const mathInputIdx = ofType("mathInput")[0]?.componentIdx;
        const shownIdx = ofType("number")[0]?.componentIdx;
        const choiceInputIdx = ofType("choiceInput")[0]?.componentIdx;
        return {
            answerIdx,
            mathInputIdx,
            choiceInputIdx,
            choiceCredits:
                choiceInputIdx === undefined
                    ? undefined
                    : stateVariables[
                          choiceInputIdx
                      ].stateValues.choiceChildrenOrdered.map(
                          (c: { componentIdx: number }) =>
                              stateVariables[c.componentIdx].stateValues.credit,
                      ),
            choiceTexts:
                choiceInputIdx === undefined
                    ? undefined
                    : stateVariables[choiceInputIdx].stateValues.choiceTexts,
            shown:
                shownIdx === undefined
                    ? undefined
                    : stateVariables[shownIdx].stateValues.value,
            answer:
                answerIdx === undefined
                    ? undefined
                    : stateVariables[answerIdx].stateValues,
            numComponents: Object.keys(stateVariables).length,
        };
    }

    async function answerRound(correct: boolean) {
        const r = await round();
        await updateMathInputValue({
            latex: String(correct ? r.shown : r.shown + 1),
            componentIdx: r.mathInputIdx!,
            core,
        });
        await submitAnswer({ componentIdx: r.answerIdx!, core });
        return r;
    }

    return { drill, act, round, answerRound };
}

describe("Drill tag tests @group4", async () => {
    it("counts correct answers to success, with a new question each round", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <drill name="d" timeLimit="60" numRequired="3">${typeTheNumber}</drill>
    `,
        });
        const { drill, act, round, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        });

        let d = await drill();
        expect(d.phase).eq("notStarted");
        expect(d.creditAchieved).eq(0);
        // no question exists before the drill starts
        expect((await round()).answerIdx).eq(undefined);

        await act("start");
        d = await drill();
        expect(d.phase).eq("running");
        expect(d.attemptNumber).eq(1);
        expect(d.roundNumber).eq(1);
        expect(d.timeRemaining).eq(60);

        const r1 = await answerRound(true);
        d = await drill();
        expect(d.numCorrect).eq(1);
        expect(d.numAnswered).eq(1);
        expect(d.roundStatus).eq("feedback");
        expect(d.lastRoundCorrect).eq(true);
        // the question is closed while its result shows
        expect((await round()).answer!.disabled).eq(true);

        await act("advanceRound");
        d = await drill();
        expect(d.roundNumber).eq(2);
        expect(d.roundStatus).eq("answering");
        const r2 = await round();
        expect(r2.answerIdx).not.eq(r1.answerIdx);
        expect(r2.shown).not.eq(r1.shown);
        expect(r2.answer!.disabled).eq(false);
        expect(r2.answer!.responseHasBeenSubmitted).eq(false);

        await answerRound(false);
        d = await drill();
        expect(d.numCorrect).eq(1);
        expect(d.numAnswered).eq(2);
        expect(d.lastRoundCorrect).eq(false);

        await act("advanceRound");
        await answerRound(true);
        await act("advanceRound");
        now += 12_000;
        await answerRound(true);

        d = await drill();
        expect(d.phase).eq("succeeded");
        expect(d.numCorrect).eq(3);
        expect(d.numAnswered).eq(4);
        expect(d.bestNumCorrect).eq(3);
        expect(d.creditAchieved).eq(1);
        // the clock stopped where the run ended
        expect(d.elapsed).eq(12);
        expect(d.timeRemaining).eq(48);

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[0].stateValues.creditAchieved).eq(1);
    });
    it("ends the run when time runs out; a new attempt has new questions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <drill name="d" timeLimit="30" numRequired="5">${typeTheNumber}</drill>
    <number name="ended">0</number>
    <updateValue triggerWith="$d" target="$ended" newValue="$ended+1" type="number" />
    `,
        });
        const { drill, act, round, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        });
        const ended = async () =>
            (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("ended")
            ].stateValues.value;

        await act("start");
        const firstQuestion = (await round()).shown;
        await answerRound(true);
        await act("advanceRound");
        await answerRound(true);
        await act("advanceRound");

        now += 29_000;
        await act("tick");
        expect((await drill()).timeRemaining).eq(1);
        expect(await ended()).eq(0);

        now += 1_000;
        await act("tick");
        let d = await drill();
        expect(d.phase).eq("expired");
        expect(d.timeRemaining).eq(0);
        expect(d.numCorrect).eq(2);
        expect(d.bestNumCorrect).eq(2);
        expect(d.creditAchieved).eq(0);
        expect(await ended()).eq(1);
        // the question showing is closed
        expect((await round()).answer!.disabled).eq(true);

        await act("start");
        d = await drill();
        expect(d.phase).eq("running");
        expect(d.attemptNumber).eq(2);
        expect(d.roundNumber).eq(1);
        expect(d.numCorrect).eq(0);
        expect(d.bestNumCorrect).eq(2);
        expect(d.timeRemaining).eq(30);
        expect((await round()).shown).not.eq(firstQuestion);
    });

    it("does not count an answer checked after the deadline", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<drill name="d" timeLimit="10" numRequired="1">${typeTheNumber}</drill>`,
        });
        const { drill, act, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        });

        await act("start");
        // no tick runs, as in a background tab
        now += 10_500;
        await answerRound(true);
        const d = await drill();
        expect(d.phase).eq("expired");
        expect(d.numCorrect).eq(0);
        expect(d.creditAchieved).eq(0);
    });

    it('wrongAnswerBehavior="retry" stays on a question until it is right', async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<drill name="d" numRequired="2" wrongAnswerBehavior="retry">${typeTheNumber}</drill>`,
        });
        const { drill, act, round, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        });

        await act("start");
        const r1 = await answerRound(false);
        let d = await drill();
        expect(d.roundStatus).eq("answering");
        expect(d.numAnswered).eq(1);
        expect(d.numCorrect).eq(0);
        expect(d.lastRoundCorrect).eq(false);
        expect((await round()).answerIdx).eq(r1.answerIdx);
        expect((await round()).answer!.disabled).eq(false);

        await answerRound(true);
        d = await drill();
        expect(d.roundStatus).eq("feedback");
        expect(d.numAnswered).eq(2);
        expect(d.numCorrect).eq(1);
    });

    it("keeps the same number of components however many rounds are played", async () => {
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            {
                doenetML: `<drill name="d" timeLimit="600" numRequired="100">${typeTheNumber}</drill>`,
            },
        );
        const { act, round, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        });

        await act("start");
        await answerRound(true);
        await act("advanceRound");
        const sizeAtRound2 = (await round()).numComponents;
        await core.saveImmediately();
        const savedAtRound2 = scoreState.state.length;

        const shownValues = new Set();
        for (let i = 0; i < 20; i++) {
            const r = await answerRound(i % 3 !== 0);
            shownValues.add(r.shown);
            await act("advanceRound");
        }

        expect(shownValues.size).greaterThan(15);
        expect((await round()).numComponents).eq(sizeAtRound2);
        await core.saveImmediately();
        // grows only with the digits of the counts
        expect(scoreState.state.length).lessThan(savedAtRound2 + 40);
    });

    it("the same variant asks the same questions", async () => {
        async function questions(requestedVariantIndex: number) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<drill name="d" numRequired="10">${typeTheNumber}</drill>`,
                requestedVariantIndex,
            });
            const { act, round, answerRound } = setup({
                core,
                resolvePathToNodeIdx,
            });
            await act("start");
            const shown = [];
            for (let i = 0; i < 4; i++) {
                shown.push((await answerRound(true)).shown);
                await act("advanceRound");
            }
            return shown;
        }

        const a = await questions(1);
        expect(await questions(1)).eqls(a);
        expect(await questions(2)).not.eqls(a);
    });

    it("resumes a run across a reload, with the work on the current question", async () => {
        const doenetML = `<drill name="d" timeLimit="60" numRequired="5">${typeTheNumber}</drill>`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        let { drill, act, round, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        });

        await act("start");
        await answerRound(true);
        await act("advanceRound");
        const r2 = await round();
        await updateMathInputValue({
            latex: "17",
            componentIdx: r2.mathInputIdx!,
            core,
        });
        now += 20_000;
        await core.saveImmediately();
        const saved = scoreState.state;

        now += 5_000;
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: saved,
        }));
        ({ drill, act, round, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        }));

        let d = await drill();
        expect(d.phase).eq("running");
        expect(d.roundNumber).eq(2);
        expect(d.numCorrect).eq(1);
        expect(d.timeRemaining).eq(35);
        const r2Reloaded = await round();
        expect(r2Reloaded.shown).eq(r2.shown);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[r2Reloaded.mathInputIdx!].stateValues.value.tree,
        ).eq(17);

        await answerRound(true);
        expect((await drill()).numCorrect).eq(2);

        // closed past the deadline: the run has ended on load
        await core.saveImmediately();
        now += 100_000;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        ({ drill } = setup({ core, resolvePathToNodeIdx }));
        d = await drill();
        expect(d.phase).eq("expired");
        expect(d.bestNumCorrect).eq(2);
    });

    it("finishes moving to the next question after a reload during feedback", async () => {
        const doenetML = `<drill name="d" timeLimit="60" numRequired="5">${typeTheNumber}</drill>`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        let { drill, act, round, answerRound } = setup({
            core,
            resolvePathToNodeIdx,
        });

        await act("start");
        const r1 = await answerRound(true);
        expect((await drill()).roundStatus).eq("feedback");
        await core.saveImmediately();

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        ({ drill, act, round } = setup({ core, resolvePathToNodeIdx }));
        expect((await drill()).roundStatus).eq("feedback");
        expect((await round()).shown).eq(r1.shown);

        // the reload scheduled the advance; the test core runs it by hand
        await act("advanceRound");
        const d = await drill();
        expect(d.roundNumber).eq(2);
        expect(d.roundStatus).eq("answering");
    });

    it("maxNumAttempts limits the number of attempts", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<drill name="d" timeLimit="5" numRequired="5" maxNumAttempts="1">${typeTheNumber}</drill>`,
        });
        const { drill, act } = setup({ core, resolvePathToNodeIdx });

        await act("start");
        expect((await drill()).canStart).eq(false);
        now += 6_000;
        await act("tick");
        let d = await drill();
        expect(d.phase).eq("expired");
        expect(d.canStart).eq(false);

        await act("start");
        d = await drill();
        expect(d.phase).eq("expired");
        expect(d.attemptNumber).eq(1);
    });

    it("multiple choice with a random number of correct choices", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <drill name="d" timeLimit="600" numRequired="12">
      <setup>
        <selectFromSequence name="k" from="1" to="4" />
        <selectFromSequence name="c" from="2" to="9" numToSelect="5" />
        <select name="good" numToSelect="$k">
          <option><math>(x+$c[1])(x-$c[1])</math></option>
          <option><math>($c[2] x-1)($c[2] x+1)</math></option>
          <option><math>($c[3]-y)($c[3]+y)</math></option>
          <option><math>(x^2+$c[4])(x^2-$c[4])</math></option>
          <option><math>($c[5] a+b)($c[5] a-b)</math></option>
        </select>
        <select name="bad" numToSelect="5-$k">
          <option><math>(x+$c[1])(x+$c[1])</math></option>
          <option><math>($c[2] x-1)($c[2] x-1)</math></option>
          <option><math>(x+$c[3])(x-$c[4])</math></option>
          <option><math>($c[5] x+1)(x-$c[5])</math></option>
          <option><math>(y-$c[1])(y-$c[2])</math></option>
        </select>
      </setup>
      <p>Which could be expanded with the difference of squares formula?</p>
      <answer name="ans">
        <choiceInput name="ci" selectMultiple shuffleOrder>
          <repeat for="$good" valueName="g"><choice credit="1">$g</choice></repeat>
          <repeat for="$bad" valueName="b"><choice>$b</choice></repeat>
        </choiceInput>
      </answer>
    </drill>
    `,
        });
        const { drill, act, round } = setup({ core, resolvePathToNodeIdx });

        await act("start");
        const numCorrectChoices = new Set();
        const firstSlotCorrect = new Set();
        for (let i = 0; i < 12; i++) {
            const r = await round();
            expect(r.choiceCredits!.length).eq(5);
            const correctIndices = r
                .choiceCredits!.map((credit: number, ind: number) =>
                    credit === 1 ? ind + 1 : null,
                )
                .filter((x: number | null) => x !== null) as number[];
            expect(correctIndices.length).greaterThanOrEqual(1);
            expect(correctIndices.length).lessThanOrEqual(4);
            numCorrectChoices.add(correctIndices.length);
            firstSlotCorrect.add(correctIndices.includes(1));

            await updateSelectedIndices({
                componentIdx: r.choiceInputIdx!,
                selectedIndices: correctIndices,
                core,
            });
            await submitAnswer({ componentIdx: r.answerIdx!, core });
            if (i < 11) {
                expect((await drill()).numCorrect).eq(i + 1);
                await act("advanceRound");
            }
        }

        // the number of correct choices, and where they sit, vary by round
        expect(numCorrectChoices.size).greaterThan(1);
        expect(firstSlotCorrect.size).eq(2);
        const d = await drill();
        expect(d.phase).eq("succeeded");
        expect(d.creditAchieved).eq(1);
    });

    it("the answers in a drill do not count toward the score on their own", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <drill name="d" numRequired="2" weight="3">${typeTheNumber}</drill>
    <answer name="other">1</answer>
    `,
        });
        const { act, answerRound } = setup({ core, resolvePathToNodeIdx });

        await act("start");
        await answerRound(true);
        let stateVariables = await core.returnAllStateVariables(false, true);
        // one correct answer inside the drill gives the drill no credit yet
        expect(stateVariables[0].stateValues.creditAchieved).eq(0);

        await act("advanceRound");
        await answerRound(true);
        stateVariables = await core.returnAllStateVariables(false, true);
        // the drill (weight 3) is complete; the other answer is not
        expect(stateVariables[0].stateValues.creditAchieved).eq(0.75);
    });

    it("a template's names stay inside the drill", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <drill name="d" numRequired="2">${typeTheNumber}</drill>
    <p name="outside">$d.numCorrect</p>
    <number name="x">5</number>
    `,
        });
        const { act } = setup({ core, resolvePathToNodeIdx });
        await act("start");
        // the `x` outside is not confused with the one in the template
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("outside")].stateValues
                .text,
        ).eq("0");
    });
});
