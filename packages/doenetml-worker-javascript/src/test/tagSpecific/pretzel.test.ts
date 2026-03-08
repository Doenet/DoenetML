import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Pretzel tag tests @group1", async () => {
    it("basic pretzel, with answer or givenAnswer", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
            <statement name="s1"><p>What is 1+1?</p></statement>
            <answer name="a1"><p>2</p></answer>
        </problem>
        <problem>
            <statement name="s2"><p>What is 1+2?</p></statement>
            <givenAnswer name="a2"><p>3</p></givenAnswer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
            <answer name="a3"><p>4</p></answer>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4"><p>5</p></answer>
        </problem>
    </pretzel>
    `,
        });

        const textMapping = {
            s1: "What is 1+1?",
            a1: "2",
            s2: "What is 1+2?",
            a2: "3",
            s3: "What is 1+3?",
            a3: "4",
            s4: "What is 1+4?",
            a4: "5",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (const [name, text] of Object.entries(textMapping)) {
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .activeChildren[0].componentIdx
                ].stateValues.text,
            ).eq(text);
        }

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;

        // make sure pretzel is still correct even if add an offset to the numbers
        for (const offset of [0, 1, 11]) {
            for (let i = 1; i <= 4; i++) {
                const idx = problemOrder.indexOf(i);
                const input = pretzel.activeChildren[idx * 3 + 1];

                await updateTextInputValue({
                    text: `${offset + i}`,
                    componentIdx: input.componentIdx,
                    core,
                });

                await submitAnswer({
                    componentIdx: pretzel.componentIdx,
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                // when i==4, then all answer correspond, so it should be correct
                expect(
                    stateVariables[pretzel.componentIdx].stateValues
                        .creditAchieved,
                ).eq(i === 4 ? 1 : 0);
            }
        }
    });

    it("pretzel with missing statements and answers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
        </problem>
        <problem>
            <answer name="a2"><p>3</p></answer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4"><p>5</p></answer>
        </problem>
    </pretzel>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid pretzel: each <problem> must contain one <statement> and one <answer>.",
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(15);
        expect(errorWarnings.warnings[0].position.end.column).eq(15);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a2")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("3");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s3")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+3?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s4")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+4?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a4")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("5");

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;

        // make sure pretzel is still correct even if add an offset to the numbers
        for (const offset of [0, 1, 11]) {
            for (let i = 1; i <= 4; i++) {
                const idx = problemOrder.indexOf(i);
                const input = pretzel.activeChildren[idx * 3 + 1];

                await updateTextInputValue({
                    text: `${offset + i}`,
                    componentIdx: input.componentIdx,
                    core,
                });

                await submitAnswer({
                    componentIdx: pretzel.componentIdx,
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                // when i==4, then all answer correspond, so it should be correct
                expect(
                    stateVariables[pretzel.componentIdx].stateValues
                        .creditAchieved,
                ).eq(i === 4 ? 1 : 0);
            }
        }
    });

    it("pretzel with distractors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
            <statement name="s1"><p>What is 1+1?</p></statement>
            <answer name="a1"><p>2</p></answer>
        </problem>
        <problem isDistractor>
            <statement name="ds1"><p>What is 2-10?</p></statement>
            <answer name="da1"><p>6</p></answer>
        </problem>
        <problem>
            <statement name="s2"><p>What is 1+2?</p></statement>
            <answer name="a2"><p>3</p></answer>
        </problem>
        <problem isDistractor>
            <statement name="ds2"><p>What is 2-11?</p></statement>
            <answer name="da2"><p>7</p></answer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
            <answer name="a3"><p>4</p></answer>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4"><p>5</p></answer>
        </problem>
        <problem isDistractor>
            <statement name="ds3"><p>What is 2-12?</p></statement>
            <answer name="da3"><p>8</p></answer>
        </problem>
        <problem isDistractor>
            <statement name="ds4"><p>What is 2-13?</p></statement>
            <answer name="da4"><p>9</p></answer>
        </problem>
    </pretzel>
    `,
        });
        const textMapping = {
            s1: "What is 1+1?",
            a1: "2",
            s2: "What is 1+2?",
            a2: "3",
            s3: "What is 1+3?",
            a3: "4",
            s4: "What is 1+4?",
            a4: "5",
            ds1: "What is 2-10?",
            da1: "6",
            ds2: "What is 2-11?",
            da2: "7",
            ds3: "What is 2-12?",
            da3: "8",
            ds4: "What is 2-13?",
            da4: "9",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (const [name, text] of Object.entries(textMapping)) {
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .activeChildren[0].componentIdx
                ].stateValues.text,
            ).eq(text);
        }

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;
        const distractors = pretzel.stateValues.distractors;
        const numProblems = problemOrder.length;

        // make sure pretzel is still correct even if add an offset to the numbers
        for (const offset of [0, 1, 11]) {
            let numDistractorsEncountered = 0;

            // clear out distractors to make sure, on repeats, don't get problem right
            // until all responses are entered

            for (let i = 1; i <= numProblems; i++) {
                const isDistractor = distractors.includes(i - 1);
                if (isDistractor) {
                    const idx = problemOrder.indexOf(i);
                    const input = pretzel.activeChildren[idx * 3 + 1];

                    await updateTextInputValue({
                        text: ``,
                        componentIdx: input.componentIdx,
                        core,
                    });
                }
            }

            for (let i = 1; i <= numProblems; i++) {
                const idx = problemOrder.indexOf(i);
                const input = pretzel.activeChildren[idx * 3 + 1];

                const isDistractor = distractors.includes(i - 1);
                let response;
                if (isDistractor) {
                    response = `X`;
                    numDistractorsEncountered++;
                } else {
                    response = `${offset + i - numDistractorsEncountered}`;
                }

                await updateTextInputValue({
                    text: response,
                    componentIdx: input.componentIdx,
                    core,
                });

                await submitAnswer({
                    componentIdx: pretzel.componentIdx,
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                // when all responses correspond, it should be correct
                expect(
                    stateVariables[pretzel.componentIdx].stateValues
                        .creditAchieved,
                ).eq(i === numProblems ? 1 : 0);
            }
        }
    });

    it("pretzel with all distractors requires all X", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem isDistractor>
            <statement><p>Distractor 1</p></statement>
            <answer><p>one</p></answer>
        </problem>
        <problem isDistractor>
            <statement><p>Distractor 2</p></statement>
            <answer><p>two</p></answer>
        </problem>
        <problem isDistractor>
            <statement><p>Distractor 3</p></statement>
            <answer><p>three</p></answer>
        </problem>
    </pretzel>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;
        const distractors = pretzel.stateValues.distractors;
        const numProblems = problemOrder.length;

        expect(distractors.length).eq(numProblems);

        async function enterResponsesAndSubmit(
            responsesByProblemNum: string[],
        ) {
            for (let i = 1; i <= numProblems; i++) {
                const idx = problemOrder.indexOf(i);
                const input = pretzel.activeChildren[idx * 3 + 1];

                await updateTextInputValue({
                    text: responsesByProblemNum[i - 1],
                    componentIdx: input.componentIdx,
                    core,
                });
            }

            await submitAnswer({
                componentIdx: pretzel.componentIdx,
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            return stateVariables[pretzel.componentIdx].stateValues
                .creditAchieved;
        }

        expect(await enterResponsesAndSubmit(["X", "X", "X"])).eq(1);
        expect(await enterResponsesAndSubmit(["X", "9", "X"])).eq(0);
    });

    it("pretzel givenAnswer can include title", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
            <statement name="s1"><p>What is 1+1?</p></statement>
            <answer name="a1"><p>2</p></answer>
        </problem>
        <problem>
            <statement name="s2"><p>What is 1+2?</p></statement>
            <givenAnswer name="a2"><title>Hint title</title><p>3</p></givenAnswer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
            <answer name="a3"><p>4</p></answer>
        </problem>
    </pretzel>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const a2 = stateVariables[await resolvePathToNodeIdx("a2")];
        expect(a2.activeChildren.length).eq(1);
        const a2Child = stateVariables[a2.activeChildren[0].componentIdx];
        expect(a2Child.componentType).eq("p");
        expect(a2Child.stateValues.text).eq("3");

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;

        for (let i = 1; i <= 3; i++) {
            const idx = problemOrder.indexOf(i);
            const input = pretzel.activeChildren[idx * 3 + 1];

            await updateTextInputValue({
                text: `${i}`,
                componentIdx: input.componentIdx,
                core,
            });

            await submitAnswer({
                componentIdx: pretzel.componentIdx,
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
        }

        expect(
            stateVariables[pretzel.componentIdx].stateValues.creditAchieved,
        ).eq(1);
    });

    it("pretzel circuit mode keeps first problem fixed", async () => {
        for (let variantIndex = 1; variantIndex <= 6; variantIndex++) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <pretzel name="p" mode="circuit">
        <problem><statement><p>P1</p></statement><answer><p>A1</p></answer></problem>
        <problem><statement><p>P2</p></statement><answer><p>A2</p></answer></problem>
        <problem><statement><p>P3</p></statement><answer><p>A3</p></answer></problem>
        <problem><statement><p>P4</p></statement><answer><p>A4</p></answer></problem>
    </pretzel>
    `,
                requestedVariantIndex: variantIndex,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const pretzel = stateVariables[await resolvePathToNodeIdx("p")];

            expect(pretzel.stateValues.mode).eq("circuit");
            expect(pretzel.stateValues.problemOrder[0]).eq(1);
        }
    });

    it("pretzel circuit mode uses fixed offset 1 and X distractors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p" mode="circuit">
        <problem>
            <statement><p>P1</p></statement>
            <answer><p>A1</p></answer>
        </problem>
        <problem>
            <statement><p>P2</p></statement>
            <answer><p>A2</p></answer>
        </problem>
        <problem isDistractor>
            <statement><p>P3 distractor</p></statement>
            <answer><p>AD</p></answer>
        </problem>
        <problem>
            <statement><p>P4</p></statement>
            <answer><p>A4</p></answer>
        </problem>
    </pretzel>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;
        const distractors = pretzel.stateValues.distractors;

        const distractorSet = new Set(distractors);
        const effectiveProblemNumbers = new Map<number, number>();
        let effectiveProblemNum = 0;
        for (
            let problemNum = 0;
            problemNum < problemOrder.length;
            problemNum++
        ) {
            if (!distractorSet.has(problemNum)) {
                effectiveProblemNumbers.set(problemNum, effectiveProblemNum);
                effectiveProblemNum++;
            }
        }

        for (let i = 1; i <= problemOrder.length; i++) {
            const idx = problemOrder.indexOf(i);
            const input = pretzel.activeChildren[idx * 3 + 1];
            const problemNum = i - 1;

            const response = distractorSet.has(problemNum)
                ? "X"
                : `${effectiveProblemNumbers.get(problemNum)! + 1}`;

            await updateTextInputValue({
                text: response,
                componentIdx: input.componentIdx,
                core,
            });
        }

        await submitAnswer({
            componentIdx: pretzel.componentIdx,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[pretzel.componentIdx].stateValues.creditAchieved,
        ).eq(1);

        const secondProblemInput =
            pretzel.activeChildren[problemOrder.indexOf(2) * 3 + 1];
        await updateTextInputValue({
            text: "3",
            componentIdx: secondProblemInput.componentIdx,
            core,
        });
        await submitAnswer({
            componentIdx: pretzel.componentIdx,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[pretzel.componentIdx].stateValues.creditAchieved,
        ).eq(0);
    });

    it("pretzel circuit mode pre-fills and disables first input", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p" mode="circuit">
        <problem><statement><p>P1</p></statement><answer><p>A1</p></answer></problem>
        <problem><statement><p>P2</p></statement><answer><p>A2</p></answer></problem>
        <problem><statement><p>P3</p></statement><answer><p>A3</p></answer></problem>
    </pretzel>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const firstInput =
            stateVariables[pretzel.activeChildren[1].componentIdx];

        expect(firstInput.componentType).eq("textInput");
        expect(firstInput.stateValues.value).eq("1");
        expect(firstInput.stateValues.disabled).eq(true);
    });

    it("pretzel circuit mode errors when first problem is distractor", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p" mode="circuit">
        <problem isDistractor>
            <statement><p>Bad first distractor</p></statement>
            <answer><p>AD1</p></answer>
        </problem>
        <problem>
            <statement><p>P2</p></statement>
            <answer><p>A2</p></answer>
        </problem>
    </pretzel>
    `,
        });

        const errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.errors[0].message).contain(
            'Invalid pretzel: in mode="circuit", the first <problem> cannot be a distractor.',
        );

        const stateVariables = await core.returnAllStateVariables(false, true);
        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        expect(pretzel.stateValues.numProblems).eq(2);
        expect(pretzel.activeChildren.length).eq(6);
    });
});
