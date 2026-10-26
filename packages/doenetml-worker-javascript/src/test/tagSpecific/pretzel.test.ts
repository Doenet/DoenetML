import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateTextInputValue } from "../utils/actions";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { componentOrListEntry } from "../utils/list-entries";

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

    for (const kind of ["copy", "extend"]) {
        it(`pretzel ignores a <problem ${kind}> child, with a warning`, async () => {
            // A `<problem copy>` or `<problem extend>` is a composite with no
            // statement or answer for the pretzel to arrange, so it is
            // neither arranged nor counted for unique variants.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <setup>
        <problem name="q3"><statement><p>P3</p></statement><answer>A3</answer></problem>
        <problem name="q4"><statement><p>P4</p></statement><answer>A4</answer></problem>
    </setup>
    <pretzel name="p">
        <problem><statement><p>P1</p></statement><answer>A1</answer></problem>
        <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
        <problem ${kind}="$q3" />
        <problem ${kind}="$q4" />
    </pretzel>
    `,
            });

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.errors.length).eq(0);
            expect(diagnosticsByType.warnings.length).eq(1);
            expect(diagnosticsByType.warnings[0].message).contain(
                "A `<problem>` that copies or extends another problem is not supported in a `<pretzel>` and is ignored.",
            );

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
            expect(pretzel.stateValues.numProblems).eq(2);
            expect(pretzel.stateValues.problemOrder.length).eq(2);
            expect(pretzel.activeChildren.length).eq(6);

            // Two arranged problems give 2! = 2 unique orders.
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b"]);
        });
    }

    it("pretzel whose only problems are copies arranges nothing, with one warning", async () => {
        // With no problem written out, the pretzel has no problems to arrange
        // and contributes a single variant. (Counting the three copies would
        // give 2! = 2 circuit orders.)
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <problem name="q1"><statement><p>P1</p></statement><answer>A1</answer></problem>
        <problem name="q2"><statement><p>P2</p></statement><answer>A2</answer></problem>
    </setup>
    <pretzel name="p" mode="circuit">
        <problem copy="$q1" />
        <problem extend="$q2" />
        <problem copy="$q2" />
    </pretzel>
    `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.warnings[0].message).contain(
            "A `<problem>` that copies or extends another problem is not supported in a `<pretzel>` and is ignored.",
        );

        const stateVariables = await core.returnAllStateVariables(false, true);
        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        expect(pretzel.stateValues.numProblems).eq(0);
        expect(pretzel.stateValues.problemOrder).eqls([]);
        expect(pretzel.activeChildren.length).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(["a"]);
    });

    it("pretzel does not count the variants of a <problem extend>'s own children", async () => {
        // The `<selectFromSequence>` inside the ignored `<problem extend>` is
        // never shown, so it does not multiply the variants: 3 values of `n`
        // times 2! orders give 6 variants, not 30.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <problem name="q3"><statement><p>P3</p></statement><answer>A3</answer></problem>
    </setup>
    <pretzel name="p">
        <problem extend="$q3"><statement><p><selectFromSequence from="1" to="5" /></p></statement></problem>
        <problem><statement><p>P1 <selectFromSequence name="n" from="1" to="3" /></p></statement><answer>A1</answer></problem>
        <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
    </pretzel>
    `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings.length).eq(1);

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .numProblems,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants.length,
        ).eq(6);
    });

    async function getProblemOrderAndValues({
        doenetML,
        variantIndex,
        names,
    }: {
        doenetML: string;
        variantIndex: number;
        names: string[];
    }) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: variantIndex,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const values = [];
        for (const name of names) {
            values.push(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        `${name}[1]`,
                    )
                ).stateValues.value,
            );
        }
        return {
            problemOrder: stateVariables[await resolvePathToNodeIdx("p")]
                .stateValues.problemOrder as number[],
            values,
            numVariants:
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
        };
    }

    async function expectDistinctVariants({
        doenetML,
        names,
        numVariants,
    }: {
        doenetML: string;
        names: string[];
        numVariants: number;
    }) {
        const seen = new Set<string>();
        for (
            let variantIndex = 1;
            variantIndex <= numVariants;
            variantIndex++
        ) {
            const result = await getProblemOrderAndValues({
                doenetML,
                variantIndex,
                names,
            });
            expect(result.numVariants).eq(numVariants);
            seen.add(JSON.stringify([result.problemOrder, result.values]));

            // Requesting the same variant again reproduces it.
            const again = await getProblemOrderAndValues({
                doenetML,
                variantIndex,
                names,
            });
            expect(again.problemOrder).eqls(result.problemOrder);
            expect(again.values).eqls(result.values);
        }
        expect(seen.size).eq(numVariants);
    }

    it("each pretzel variant gives a different problem order or random value", async () => {
        // 3 values of `n` times 2! orders give 6 variants, all different.
        await expectDistinctVariants({
            doenetML: `
    <pretzel name="p">
        <problem><statement><p>P1 <selectFromSequence name="n" from="1" to="3"/></p></statement><answer>A1</answer></problem>
        <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
    </pretzel>
    `,
            names: ["n"],
            numVariants: 6,
        });
    });

    it("each pretzel variant is different with random values in several statements and answers", async () => {
        // 2 values of `m` times 3 values of `k` times 2 values of `j`
        // times 2! circuit orders of the last two problems give 24 variants.
        await expectDistinctVariants({
            doenetML: `
    <pretzel name="p" mode="circuit">
        <problem><statement><p>P1 <selectFromSequence name="m" from="1" to="2"/></p></statement><answer>A1</answer></problem>
        <problem><statement><p>P2</p></statement><answer><selectFromSequence name="k" from="4" to="6"/></answer></problem>
        <problem isDistractor><statement><p>P3 <selectFromSequence name="j" from="7" to="8"/></p></statement><answer>A3</answer></problem>
    </pretzel>
    `,
            names: ["m", "k", "j"],
            numVariants: 24,
        });
    });

    it("pretzel does not count random content outside a problem's statement and answer", async () => {
        // The `<selectFromSequence>`s in the hint and directly in the problem
        // are not displayed, so they do not multiply the variants:
        // 3 values of `n` times 2! orders give 6 variants, all different.
        await expectDistinctVariants({
            doenetML: `
    <pretzel name="p">
        <problem>
            <selectFromSequence from="1" to="5"/>
            <hint><p><selectFromSequence from="1" to="7"/></p></hint>
            <statement><p>P1 <selectFromSequence name="n" from="1" to="3"/></p></statement>
            <answer>A1</answer>
        </problem>
        <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
    </pretzel>
    `,
            names: ["n"],
            numVariants: 6,
        });
    });

    it("pretzel ignores a problem's <variantControl>", async () => {
        // The `<variantControl>` is dropped with the rest of the problem
        // outside its statement and answer, so it does not set the number of
        // variants: 3 values of `n` times 2! orders give 6 variants.
        await expectDistinctVariants({
            doenetML: `
    <pretzel name="p">
        <problem>
            <variantControl numVariants="10"/>
            <statement><p>P1 <selectFromSequence name="n" from="1" to="3"/></p></statement>
            <answer>A1</answer>
        </problem>
        <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
    </pretzel>
    `,
            names: ["n"],
            numVariants: 6,
        });
    });

    it("pretzel reports its subvariants in the order it assigns them", async () => {
        // A desired variant gives the pretzel's subvariants to the random
        // choices in its statements and answers in problem order (`a`, `b`,
        // `c`), whatever order the problems are shown in. The variant it
        // reports, which a host passes back to restore a saved variant, must
        // list them in that same order.
        const doenetML = `
    <pretzel name="p">
        <problem><statement><p>P1 <selectFromSequence name="a" from="1" to="5"/></p></statement><answer><selectFromSequence name="b" from="11" to="12"/></answer></problem>
        <problem><statement><p>P2 <selectFromSequence name="c" from="21" to="23"/></p></statement><answer>A2</answer></problem>
    </pretzel>
    `;
        const problemOrders = new Set<string>();
        for (let variantIndex = 1; variantIndex <= 6; variantIndex++) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: variantIndex,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
            problemOrders.add(JSON.stringify(pretzel.stateValues.problemOrder));

            const arranger = Object.values(stateVariables).find(
                (component) => component.componentType === "_pretzelArranger",
            )!;
            const subvariants =
                arranger.stateValues.generatedVariantInfo.subvariants;

            const expected = [];
            for (const name of ["a", "b", "c"]) {
                const idx = await resolvePathToNodeIdx(name);
                expected.push({
                    createdBy: idx,
                    indices: stateVariables[idx].stateValues.selectedIndices,
                });
            }
            expect(
                subvariants.map((subvariant) => ({
                    createdBy: subvariant.meta.createdBy,
                    indices: subvariant.indices,
                })),
            ).eqls(expected);

            // Passing the document's reported variant back, as a host does
            // to reload a saved variant, reproduces the same document.
            const reloaded = await createTestCore({
                doenetML,
                requestedVariant:
                    stateVariables[await resolvePathToNodeIdx("_document1")]
                        .stateValues.generatedVariantInfo,
            });
            const reloadedStateVariables =
                await reloaded.core.returnAllStateVariables(false, true);
            expect(
                reloadedStateVariables[await reloaded.resolvePathToNodeIdx("p")]
                    .stateValues.problemOrder,
            ).eqls(pretzel.stateValues.problemOrder);
            for (const { createdBy, indices } of expected) {
                expect(
                    reloadedStateVariables[createdBy].stateValues
                        .selectedIndices,
                ).eqls(indices);
            }
        }
        // Both problem orders occur, so the check covers an order in which
        // the problems are shown out of their own order.
        expect(problemOrders.size).eq(2);
    });

    it("a copy of a pretzel reports the subvariants of its own random choices", async () => {
        // A copy's arranger is not set up from problems, so it keeps its
        // subvariants in display order rather than dropping them.
        const { core } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem><statement><p>P1 <selectFromSequence from="1" to="5"/></p></statement><answer>A1</answer></problem>
        <problem><statement><p>P2 <selectFromSequence from="21" to="23"/></p></statement><answer>A2</answer></problem>
    </pretzel>
    <section>$p</section>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const arrangers = Object.values(stateVariables).filter(
            (component) => component.componentType === "_pretzelArranger",
        );
        expect(arrangers.length).eq(2);
        for (const arranger of arrangers) {
            const subvariants =
                arranger.stateValues.generatedVariantInfo.subvariants;
            expect(subvariants.length).eq(2);
            for (const subvariant of subvariants) {
                expect(
                    stateVariables[subvariant.meta.createdBy].componentType,
                ).eq("selectFromSequence");
            }
        }
    });
});
