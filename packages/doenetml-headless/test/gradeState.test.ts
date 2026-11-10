import { describe, expect, it } from "vitest";
import { data_format_version } from "@doenet/utils";
import { gradeState, HeadlessError } from "../src";
import { answerIdx, stateAfter, submitAnswerAt, typeMath } from "./helpers";

async function refusal(promise: Promise<unknown>) {
    try {
        await promise;
    } catch (e) {
        expect(e).toBeInstanceOf(HeadlessError);
        return e as HeadlessError;
    }
    throw Error("expected a refusal");
}

const twoAnswers = `
    <answer name="a">x</answer>
    <answer name="b">y</answer>
    `;

describe("gradeState", () => {
    it("recomputes each answer's credit from the stored inputs, with the stored values beside it", async () => {
        const state = await stateAfter(twoAnswers, async (core) => {
            const a = await answerIdx(core, "a");
            await typeMath(core, a.inputs[0].componentIdx, "x");
            await submitAnswerAt(core, a.componentIdx);
            const b = await answerIdx(core, "b");
            await typeMath(core, b.inputs[0].componentIdx, "z");
            await submitAnswerAt(core, b.componentIdx);
        });

        const result = await gradeState(twoAnswers, 1, state);
        expect(
            result.answers.map(({ stableKey, credit, stored }) => ({
                stableKey,
                credit,
                stored,
            })),
        ).toEqual([
            {
                stableKey: "a",
                credit: 1,
                stored: { creditAchieved: 1, numSubmissions: 1 },
            },
            {
                stableKey: "b",
                credit: 0,
                stored: { creditAchieved: 0, numSubmissions: 1 },
            },
        ]);
        expect(result.document).toEqual({
            credit: 0.5,
            stored: { creditAchieved: 0.5 },
        });
        expect(result.savedState).toEqual({
            dataFormatVersion: data_format_version,
            onSubmission: true,
        });
        expect(result.numVariants).toBe(1);
        expect(result.variantIndex).toBe(1);
    });

    it("accepts the state as stored JSON text", async () => {
        const state = await stateAfter(twoAnswers, async () => {});
        const result = await gradeState(twoAnswers, 1, JSON.stringify(state));
        expect(result.answers.map((a) => a.credit)).toEqual([0, 0]);
    });

    it("grades what the state holds when an input changed after the submission", async () => {
        const doenetML = `<answer name="a">x</answer>`;
        const state = await stateAfter(doenetML, async (core) => {
            const a = await answerIdx(core, "a");
            await typeMath(core, a.inputs[0].componentIdx, "x");
            await submitAnswerAt(core, a.componentIdx);
            await typeMath(core, a.inputs[0].componentIdx, "y");
        });

        const result = await gradeState(doenetML, 1, state);
        expect(result.answers[0].credit).toBe(0);
        expect(result.answers[0].stored).toEqual({
            creditAchieved: 1,
            numSubmissions: 1,
        });
        // Not the report of the submission, so a host should not grade it
        expect(result.savedState.onSubmission).toBe(false);
    });

    it("grades an answer whose attempts are used up", async () => {
        const doenetML = `<answer name="a" maxNumAttempts="2">x</answer>`;
        const state = await stateAfter(doenetML, async (core) => {
            const a = await answerIdx(core, "a");
            await typeMath(core, a.inputs[0].componentIdx, "y");
            await submitAnswerAt(core, a.componentIdx);
            await typeMath(core, a.inputs[0].componentIdx, "x");
            await submitAnswerAt(core, a.componentIdx);
            // No attempt left: the input no longer takes a value
            await typeMath(core, a.inputs[0].componentIdx, "z");
            const [after] = await core.getAnswers();
            expect(after.creditAchievedIfSubmit).toBe(1);
        });

        const result = await gradeState(doenetML, 1, state);
        expect(result.answers[0].stored).toEqual({
            creditAchieved: 1,
            numSubmissions: 2,
        });
        expect(result.answers[0].credit).toBe(1);
    });

    it("grades from the state an input that is not in the answer's response", async () => {
        // Duane's example on #2499: `b` decides the credit but the author
        // left it out of the response, so no event carries it.
        const doenetML = `
    <mathInput name="a" forAnswer="$ans" />
    <mathInput name="b" />
    <answer name="ans"><award><when>$a = $b</when></award></answer>
    `;
        async function stateWith(aValue: string, bValue: string) {
            return stateAfter(doenetML, async (core) => {
                for (const [name, latex] of [
                    ["a", aValue],
                    ["b", bValue],
                ]) {
                    const r = await core.resolvePath(name);
                    if (r.status !== "resolved") throw Error(name);
                    await typeMath(core, r.component.componentIdx, latex);
                }
                await submitAnswerAt(
                    core,
                    (await answerIdx(core, "ans")).componentIdx,
                );
            });
        }
        expect(
            (await gradeState(doenetML, 1, await stateWith("3", "3")))
                .answers[0].credit,
        ).toBe(1);
        expect(
            (await gradeState(doenetML, 1, await stateWith("3", "4")))
                .answers[0].credit,
        ).toBe(0);
    });

    it("reads the document's credit with a pretzel, rather than summing answers", async () => {
        const doenetML = `
    <answer name="x1">1</answer>
    <pretzel name="p">
        <problem><statement><p>1+1?</p></statement><answer>2</answer></problem>
        <problem><statement><p>1+2?</p></statement><answer>3</answer></problem>
        <problem><statement><p>1+3?</p></statement><answer>4</answer></problem>
    </pretzel>
    `;
        const state = await stateAfter(doenetML, async (core) => {
            const x1 = await answerIdx(core, "x1");
            await typeMath(core, x1.inputs[0].componentIdx, "1");
            await submitAnswerAt(core, x1.componentIdx);
        });
        const result = await gradeState(doenetML, 1, state);
        // The answer and the pretzel are the document's two scored parts
        expect(result.document.credit).toBe(0.5);
        const mean =
            result.answers.reduce((sum, a) => sum + a.credit, 0) /
            result.answers.length;
        expect(mean).not.toBe(0.5);
    });

    it("reads the document's credit with a section-wide check work", async () => {
        const doenetML = `
    <answer name="out">1</answer>
    <section name="sec" sectionWideCheckWork>
        <answer name="in1">x</answer>
        <answer name="in2">y</answer>
    </section>
    `;
        const state = await stateAfter(doenetML, async (core) => {
            for (const [key, latex] of [
                ["out", "1"],
                ["in1", "x"],
                ["in2", "z"],
            ]) {
                const answer = await answerIdx(core, key);
                await typeMath(core, answer.inputs[0].componentIdx, latex);
            }
        });
        const result = await gradeState(doenetML, 1, state);
        expect(result.answers.map((a) => a.credit)).toEqual([1, 1, 0]);
        // The section is one scored part, worth its answers' mean: (1 + 0.5) / 2
        expect(result.document.credit).toBe(0.75);
        expect(result.document.stored.creditAchieved).toBe(0);
    });

    describe("refuses", () => {
        it("a state whose data_format_version the core does not read", async () => {
            const state = await stateAfter(twoAnswers, async () => {});
            const error = await refusal(
                gradeState(twoAnswers, 1, {
                    ...state,
                    data_format_version: "0.7.0",
                }),
            );
            expect(error.code).toBe("dataFormatVersion");
            expect(error.message).toContain('"0.7.0"');
            expect(error.message).toContain(`"${data_format_version}"`);
        });

        it("a state for another variant", async () => {
            const doenetML = `<selectFromSequence name="n" from="1" to="5" /><answer name="a">$n</answer>`;
            const state = await stateAfter(doenetML, async () => {}, {
                variantIndex: 2,
            });
            expect((await gradeState(doenetML, 2, state)).variantIndex).toBe(2);
            const error = await refusal(gradeState(doenetML, 3, state));
            expect(error.code).toBe("variantMismatch");
            expect(error.message).toContain("variant 2");
            expect(error.message).toContain("variant 3");
        });

        it("a state for another attempt, when the attempt is given", async () => {
            const state = await stateAfter(twoAnswers, async () => {});
            await gradeState(twoAnswers, 1, state, { attemptNumber: 1 });
            const error = await refusal(
                gradeState(twoAnswers, 1, state, { attemptNumber: 2 }),
            );
            expect(error.code).toBe("attemptMismatch");
        });

        it("a state written for a different document source", async () => {
            const state = await stateAfter(twoAnswers, async () => {});
            const error = await refusal(gradeState(twoAnswers + " ", 1, state));
            expect(error.code).toBe("documentMismatch");
        });

        it("something that is not a state report", async () => {
            for (const bad of ["not json", "[1]", { data_format_version }]) {
                const error = await refusal(
                    gradeState(twoAnswers, 1, bad as any),
                );
                expect(error.code).toBe("invalidState");
            }
        });
    });
});
