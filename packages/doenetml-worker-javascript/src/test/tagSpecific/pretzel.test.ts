import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateTextInputValue } from "../utils/actions";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

const PRETZEL_CHILD_STRIDE = 3;
const ANSWER_CHILD_OFFSET = 0;
const INPUT_CHILD_OFFSET = 1;

function expectSingleChildString({
    children,
    expected,
}: {
    children: any;
    expected: string;
}) {
    return expect(children).eqls([expected]);
}

async function expectNamedChildText({
    stateVariables,
    resolvePathToNodeIdx,
    name,
    expected,
}: {
    stateVariables: Record<number, any>;
    resolvePathToNodeIdx: (name: string) => Promise<number>;
    name: string;
    expected: string;
}) {
    expect(
        stateVariables[
            stateVariables[await resolvePathToNodeIdx(name)].activeChildren[0]
                .componentIdx
        ].stateValues.text,
    ).eq(expected);
}

async function expectNamedChildrenTextMap({
    stateVariables,
    resolvePathToNodeIdx,
    textByName,
}: {
    stateVariables: Record<number, any>;
    resolvePathToNodeIdx: (name: string) => Promise<number>;
    textByName: Record<string, string>;
}) {
    for (const [name, text] of Object.entries(textByName)) {
        await expectNamedChildText({
            stateVariables,
            resolvePathToNodeIdx,
            name,
            expected: text,
        });
    }
}

async function expectNamedSingleStringChildren({
    stateVariables,
    resolvePathToNodeIdx,
    textByName,
}: {
    stateVariables: Record<number, any>;
    resolvePathToNodeIdx: (name: string) => Promise<number>;
    textByName: Record<string, string>;
}) {
    for (const [name, text] of Object.entries(textByName)) {
        expectSingleChildString({
            children:
                stateVariables[await resolvePathToNodeIdx(name)].activeChildren,
            expected: text,
        });
    }
}

function getPretzelChild({
    pretzel,
    problemOrder,
    problemNumber,
    childOffset,
}: {
    pretzel: any;
    problemOrder: number[];
    problemNumber: number;
    childOffset: number;
}) {
    const indexInOrder = problemOrder.indexOf(problemNumber);
    return pretzel.activeChildren[
        indexInOrder * PRETZEL_CHILD_STRIDE + childOffset
    ];
}

describe("Pretzel tag tests @group1", async () => {
    it("basic pretzel", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
            <statement name="s1"><p>What is 1+1?</p></statement>
            <answer name="a1">2</answer>
        </problem>
        <problem>
            <statement name="s2"><p>What is 1+2?</p></statement>
            <answer name="a2">3</answer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
            <answer name="a3">4</answer>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4">5</answer>
        </problem>
    </pretzel>
    `,
        });

        const textMapping = {
            s1: "What is 1+1?",
            s2: "What is 1+2?",
            s3: "What is 1+3?",
            s4: "What is 1+4?",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        await expectNamedChildrenTextMap({
            stateVariables,
            resolvePathToNodeIdx,
            textByName: textMapping,
        });

        await expectNamedSingleStringChildren({
            stateVariables,
            resolvePathToNodeIdx,
            textByName: {
                a1: "2",
                a2: "3",
                a3: "4",
                a4: "5",
            },
        });

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;

        // make sure pretzel is still correct even if add an offset to the numbers
        for (const offset of [0, 1, 11]) {
            for (let i = 1; i <= 4; i++) {
                const input = getPretzelChild({
                    pretzel,
                    problemOrder,
                    problemNumber: i,
                    childOffset: INPUT_CHILD_OFFSET,
                });

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
            <answer name="a2">3</answer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4">5</answer>
        </problem>
    </pretzel>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);

        expect(diagnosticsByType.warnings[0].message).contain(
            "Invalid pretzel: each `<problem>` must contain one `<statement>` and one `<answer>`.",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(5);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(15);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(15);

        let stateVariables = await core.returnAllStateVariables(false, true);
        await expectNamedChildrenTextMap({
            stateVariables,
            resolvePathToNodeIdx,
            textByName: {
                s3: "What is 1+3?",
                s4: "What is 1+4?",
            },
        });

        await expectNamedSingleStringChildren({
            stateVariables,
            resolvePathToNodeIdx,
            textByName: {
                a2: "3",
                a4: "5",
            },
        });

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;

        // make sure pretzel is still correct even if add an offset to the numbers
        for (const offset of [0, 1, 11]) {
            for (let i = 1; i <= 4; i++) {
                const input = getPretzelChild({
                    pretzel,
                    problemOrder,
                    problemNumber: i,
                    childOffset: INPUT_CHILD_OFFSET,
                });

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
            <answer name="a1">2</answer>
        </problem>
        <problem isDistractor>
            <statement name="ds1"><p>What is 2-10?</p></statement>
            <answer name="da1">6</answer>
        </problem>
        <problem>
            <statement name="s2"><p>What is 1+2?</p></statement>
            <answer name="a2">3</answer>
        </problem>
        <problem isDistractor>
            <statement name="ds2"><p>What is 2-11?</p></statement>
            <answer name="da2">7</answer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
            <answer name="a3">4</answer>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4">5</answer>
        </problem>
        <problem isDistractor>
            <statement name="ds3"><p>What is 2-12?</p></statement>
            <answer name="da3">8</answer>
        </problem>
        <problem isDistractor>
            <statement name="ds4"><p>What is 2-13?</p></statement>
            <answer name="da4">9</answer>
        </problem>
    </pretzel>
    `,
        });
        const textMapping = {
            s1: "What is 1+1?",
            s2: "What is 1+2?",
            s3: "What is 1+3?",
            s4: "What is 1+4?",
            ds1: "What is 2-10?",
            ds2: "What is 2-11?",
            ds3: "What is 2-12?",
            ds4: "What is 2-13?",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        await expectNamedChildrenTextMap({
            stateVariables,
            resolvePathToNodeIdx,
            textByName: textMapping,
        });

        await expectNamedSingleStringChildren({
            stateVariables,
            resolvePathToNodeIdx,
            textByName: {
                a1: "2",
                a2: "3",
                a3: "4",
                a4: "5",
                da1: "6",
                da2: "7",
                da3: "8",
                da4: "9",
            },
        });

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
                    const input = getPretzelChild({
                        pretzel,
                        problemOrder,
                        problemNumber: i,
                        childOffset: INPUT_CHILD_OFFSET,
                    });

                    await updateTextInputValue({
                        text: ``,
                        componentIdx: input.componentIdx,
                        core,
                    });
                }
            }

            for (let i = 1; i <= numProblems; i++) {
                const input = getPretzelChild({
                    pretzel,
                    problemOrder,
                    problemNumber: i,
                    childOffset: INPUT_CHILD_OFFSET,
                });

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
            <answer>one</answer>
        </problem>
        <problem isDistractor>
            <statement><p>Distractor 2</p></statement>
            <answer>two</answer>
        </problem>
        <problem isDistractor>
            <statement><p>Distractor 3</p></statement>
            <answer>three</answer>
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
                const input = getPretzelChild({
                    pretzel,
                    problemOrder,
                    problemNumber: i,
                    childOffset: INPUT_CHILD_OFFSET,
                });

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

    it("pretzel filters label and shortDescription from displayed answers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
            <statement><p>S1</p></statement>
            <answer>
                <label>Ignore label 1</label>
                <text>Keep 1a</text>
                <text>Keep 1b</text>
            </answer>
        </problem>
        <problem>
            <statement><p>S2</p></statement>
            <answer>
                <shortDescription>Ignore short description 2</shortDescription>
                <text>Keep 2</text>
            </answer>
        </problem>
        <problem>
            <statement><p>S3</p></statement>
            <answer>
                <label>Ignore label 3</label>
                <shortDescription>Ignore short description 3</shortDescription>
                <text>Keep 3a</text>
                <text>Keep 3b</text>
            </answer>
        </problem>
    </pretzel>
    `,
        });

        const expectedAnswerTextsByIndex = [
            ["Keep 1a", "Keep 1b"],
            ["Keep 2"],
            ["Keep 3a", "Keep 3b"],
        ];
        const ignoredTextsByIndex = [
            ["Ignore label 1"],
            ["Ignore short description 2"],
            ["Ignore label 3", "Ignore short description 3"],
        ];

        const stateVariables = await core.returnAllStateVariables(false, true);
        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;
        const numProblems = problemOrder.length;

        for (let i = 0; i < numProblems; i++) {
            const problemIdx = problemOrder[i] - 1;
            const answerIdx = (problemIdx - 1 + numProblems) % numProblems;

            const displayedAnswer =
                stateVariables[
                    getPretzelChild({
                        pretzel,
                        problemOrder,
                        problemNumber: problemOrder[i],
                        childOffset: ANSWER_CHILD_OFFSET,
                    }).componentIdx
                ];
            const displayedAnswerChildComponents =
                displayedAnswer.activeChildren
                    .map((child) => stateVariables[child.componentIdx] ?? child)
                    .filter(
                        (child) => child && child.componentType !== "_error",
                    );

            expect(
                displayedAnswerChildComponents.map(
                    (child) => child.componentType,
                ),
            ).not.toContain("label");
            expect(
                displayedAnswerChildComponents.map(
                    (child) => child.componentType,
                ),
            ).not.toContain("shortDescription");

            const displayedAnswerText = displayedAnswerChildComponents
                .map(
                    (child) =>
                        child.stateValues?.text ?? child.stateValues?.value,
                )
                .filter((text) => typeof text === "string")
                .join(" ");
            for (const expectedText of expectedAnswerTextsByIndex[answerIdx]) {
                expect(displayedAnswerText).contain(expectedText);
            }
            for (const ignoredText of ignoredTextsByIndex[answerIdx]) {
                expect(displayedAnswerText).not.contain(ignoredText);
            }
        }
    });

    it("pretzel circuit mode keeps first problem fixed", async () => {
        for (let variantIndex = 1; variantIndex <= 6; variantIndex++) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <pretzel name="p" mode="circuit">
        <problem><statement><p>P1</p></statement><answer>A1</answer></problem>
        <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
        <problem><statement><p>P3</p></statement><answer>A3</answer></problem>
        <problem><statement><p>P4</p></statement><answer>A4</answer></problem>
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
            <answer>A1</answer>
        </problem>
        <problem>
            <statement><p>P2</p></statement>
            <answer>A2</answer>
        </problem>
        <problem isDistractor>
            <statement><p>P3 distractor</p></statement>
            <answer>AD</answer>
        </problem>
        <problem>
            <statement><p>P4</p></statement>
            <answer>A4</answer>
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
            const input = getPretzelChild({
                pretzel,
                problemOrder,
                problemNumber: i,
                childOffset: INPUT_CHILD_OFFSET,
            });
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

        const secondProblemInput = getPretzelChild({
            pretzel,
            problemOrder,
            problemNumber: 2,
            childOffset: INPUT_CHILD_OFFSET,
        });
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
        <problem><statement><p>P1</p></statement><answer>A1</answer></problem>
        <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
        <problem><statement><p>P3</p></statement><answer>A3</answer></problem>
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
            <answer>AD1</answer>
        </problem>
        <problem>
            <statement><p>P2</p></statement>
            <answer>A2</answer>
        </problem>
    </pretzel>
    `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(1);
        expect(diagnosticsByType.errors[0].message).contain(
            'Invalid pretzel: in mode="circuit", the first `<problem>` cannot be a distractor.',
        );

        const stateVariables = await core.returnAllStateVariables(false, true);
        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        expect(pretzel.stateValues.numProblems).eq(2);
        expect(pretzel.activeChildren.length).eq(6);
    });
});
