import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputImmediateValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { latexToMathFactory, normalizeLatexString } from "../../utils/math";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function test_math_answer({
    doenetML,
    answers,
    answerName = "answer1",
    mathInputName,
}: {
    doenetML: string;
    answers: {
        latex: string;
        credit: number;
        preAction?: {
            name: string;
            value: string;
            type: "math" | "text" | "boolean" | "choice";
        };
        submissionPrevented?: boolean;
        overrideResponse?: any;
        awardsUsed?: string[];
    }[];
    answerName?: string;
    mathInputName?: string;
}) {
    let fromLatexBase = latexToMathFactory();
    let fromLatex = (x: string) => fromLatexBase(normalizeLatexString(x));
    let currentResponse = "\uff3f";
    let submittedResponses: any[] = [];
    let submittedCredit = 0;
    let numSubmissions = 0;

    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx(answerName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    const mathInputIdx = mathInputName
        ? await resolvePathToNodeIdx(mathInputName)
        : stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;

    if (mathInputIdx == undefined) {
        throw Error("Don't have mathInput name");
    }

    expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
        submittedCredit,
    );
    expect(
        stateVariables[answerIdx].stateValues.currentResponses.map(
            (x) => x.tree,
        ),
    ).eqls([currentResponse]);
    expect(
        stateVariables[answerIdx].stateValues.submittedResponses.map(
            (x) => x.tree,
        ),
    ).eqls(submittedResponses);
    expect(stateVariables[mathInputIdx].stateValues.value.tree).eqls(
        currentResponse,
    );

    for (let response of answers) {
        if (response.preAction) {
            const actionIdx = await resolvePathToNodeIdx(
                response.preAction.name,
            );
            if (response.preAction.type === "math") {
                await updateMathInputValue({
                    latex: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            } else if (response.preAction.type === "text") {
                await updateTextInputValue({
                    text: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            } else if (response.preAction.type === "boolean") {
                await updateBooleanInputValue({
                    boolean: response.preAction.value === "true",
                    componentIdx: actionIdx,
                    core,
                });
            } else {
                await updateSelectedIndices({
                    componentIdx: actionIdx,
                    selectedIndices: [parseInt(response.preAction.value)],
                    core,
                });
            }
        }

        const latex = response.latex;
        if (!response.submissionPrevented) {
            currentResponse =
                response.overrideResponse || fromLatex(latex).tree;
        }
        const credit = response.credit;

        // Type answer in

        await updateMathInputValue({
            latex,
            componentIdx: mathInputIdx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
        );
        expect(
            stateVariables[answerIdx].stateValues.currentResponses.map(
                (x) => x.tree,
            ),
        ).eqls([currentResponse]);
        expect(
            stateVariables[answerIdx].stateValues.submittedResponses.map(
                (x) => x.tree,
            ),
        ).eqls(submittedResponses);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[mathInputIdx].stateValues.value.tree).eqls(
            currentResponse,
        );
        if (response.awardsUsed) {
            const awardsUsed: number[] = [];
            for (const award of response.awardsUsed) {
                awardsUsed.push(await resolvePathToNodeIdx(award));
            }
            expect(
                stateVariables[answerIdx].stateValues.awardsUsedIfSubmit,
            ).eqls(awardsUsed);
        }

        // submit
        await submitAnswer({ componentIdx: answerIdx, core });
        if (!response.submissionPrevented) {
            submittedResponses = [currentResponse];
            numSubmissions++;
        }
        submittedCredit = credit;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
            `Expected response ${currentResponse} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(
            stateVariables[answerIdx].stateValues.currentResponses.map(
                (x) => x.tree,
            ),
        ).eqls([currentResponse]);
        expect(
            stateVariables[answerIdx].stateValues.submittedResponses.map(
                (x) => x.tree,
            ),
        ).eqls(submittedResponses);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[mathInputIdx].stateValues.value.tree).eqls(
            currentResponse,
        );
    }
}

async function test_text_answer({
    doenetML,
    answers,
    answerName = "answer1",
    textInputName,
}: {
    doenetML: string;
    answers: { text: string; credit: number }[];
    answerName?: string;
    textInputName?: string;
}) {
    let currentResponse = "";
    let submittedResponses: any[] = [];
    let submittedCredit = 0;
    let numSubmissions = 0;

    let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx(answerName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    const textInputIdx = textInputName
        ? await resolvePathToNodeIdx(textInputName)
        : stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;

    if (!textInputIdx) {
        throw Error("Don't have textInput name");
    }

    expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
        submittedCredit,
    );
    expect(stateVariables[answerIdx].stateValues.currentResponses).eqls([
        currentResponse,
    ]);
    expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
        submittedResponses,
    );
    expect(stateVariables[textInputIdx].stateValues.value).eqls(
        currentResponse,
    );

    for (let response of answers) {
        currentResponse = response.text;
        const credit = response.credit;

        // Type answer in

        await updateTextInputValue({
            text: currentResponse,
            componentIdx: textInputIdx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls([
            currentResponse,
        ]);
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[textInputIdx].stateValues.value).eqls(
            currentResponse,
        );

        // submit
        await submitAnswer({ componentIdx: answerIdx, core });
        submittedResponses = [currentResponse];
        submittedCredit = credit;
        numSubmissions++;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
            `Expected response ${currentResponse} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls([
            currentResponse,
        ]);
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[textInputIdx].stateValues.value).eqls(
            currentResponse,
        );
    }
}

async function test_boolean_answer({
    doenetML,
    answers,
    answerName = "answer1",
    booleanInputName,
}: {
    doenetML: string;
    answers: { boolean: boolean; credit: number }[];
    answerName?: string;
    booleanInputName?: string;
}) {
    let currentResponse = false;
    let submittedResponses: any[] = [];
    let submittedCredit = 0;
    let numSubmissions = 0;

    let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx(answerName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    const booleanInputIdx = booleanInputName
        ? await resolvePathToNodeIdx(booleanInputName)
        : stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;

    if (!booleanInputIdx) {
        throw Error("Don't have booleanInput name");
    }

    expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
        submittedCredit,
    );
    expect(stateVariables[answerIdx].stateValues.currentResponses).eqls([
        currentResponse,
    ]);
    expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
        submittedResponses,
    );
    expect(stateVariables[booleanInputIdx].stateValues.value).eqls(
        currentResponse,
    );

    for (let response of answers) {
        currentResponse = response.boolean;
        const credit = response.credit;

        // Type answer in

        await updateBooleanInputValue({
            boolean: currentResponse,
            componentIdx: booleanInputIdx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls([
            currentResponse,
        ]);
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[booleanInputIdx].stateValues.value).eqls(
            currentResponse,
        );

        // submit
        await submitAnswer({ componentIdx: answerIdx, core });
        submittedResponses = [currentResponse];
        submittedCredit = credit;
        numSubmissions++;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
            `Expected response ${currentResponse} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls([
            currentResponse,
        ]);
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[booleanInputIdx].stateValues.value).eqls(
            currentResponse,
        );
    }
}

async function test_choice_answer({
    doenetML,
    answers,
    answerName = "answer1",
    choiceInputName,
    indexByName = {},
    submitFirst = false,
    skipInitialCheck = false,
}: {
    doenetML: string;
    answers: {
        choices: string[];
        credit: number;
        preAction?: {
            name: string;
            value: string;
            recomputeIndices: boolean;
            type: "math" | "text";
        };
    }[];
    answerName?: string;
    choiceInputName?: string;
    indexByName?: { [key: string]: number };
    submitFirst?: boolean;
    skipInitialCheck?: boolean;
}) {
    let submittedResponses: string[] = [];
    let submittedCredit = 0;
    let selectedValues: string[] = [];
    let selectedIndices: number[] = [];
    let numSubmissions = 0;

    let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx(answerName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    const choiceInputIdx = choiceInputName
        ? await resolvePathToNodeIdx(choiceInputName)
        : stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;

    if (!choiceInputIdx) {
        throw Error("Don't have choiceInput name");
    }

    if (Object.keys(indexByName).length === 0) {
        indexByName = {};
        for (let [ind, val] of stateVariables[
            choiceInputIdx
        ].stateValues.choiceTexts.entries()) {
            indexByName[val] = ind + 1;
        }
    }

    // in a case where have invalid logic, got math expressions
    // for current responses before submitting anything
    if (!skipInitialCheck) {
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls(
            selectedValues,
        );
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedValues).eqls(
            selectedValues,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedIndices).eqls(
            selectedIndices,
        );
    }

    if (submitFirst) {
        // submit no answer
        await submitAnswer({ componentIdx: answerIdx, core });
        submittedResponses = selectedValues;
        submittedCredit = 0;
        numSubmissions++;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
            `Expected response ${selectedValues} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls(
            selectedValues,
        );
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedValues).eqls(
            selectedValues,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedIndices).eqls(
            selectedIndices,
        );
    }

    for (let response of answers) {
        if (response.preAction) {
            const actionIdx = await resolvePathToNodeIdx(
                response.preAction.name,
            );
            if (response.preAction.type === "math") {
                await updateMathInputValue({
                    latex: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            } else {
                await updateTextInputValue({
                    text: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            }

            if (response.preAction.recomputeIndices) {
                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                indexByName = {};
                for (let [ind, val] of stateVariables[
                    choiceInputIdx
                ].stateValues.choiceTexts.entries()) {
                    indexByName[val] = ind + 1;
                }
            }
        }

        selectedValues = response.choices;
        selectedIndices = selectedValues.map((val) => indexByName[val]);
        const credit = response.credit;

        // select responses

        await updateSelectedIndices({
            componentIdx: choiceInputIdx,
            selectedIndices,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls(
            selectedValues,
        );
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedValues).eqls(
            selectedValues,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedIndices).eqls(
            selectedIndices,
        );

        // submit
        await submitAnswer({ componentIdx: answerIdx, core });
        submittedResponses = selectedValues;
        submittedCredit = credit;
        numSubmissions++;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
            `Expected response ${selectedValues} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(stateVariables[answerIdx].stateValues.currentResponses).eqls(
            selectedValues,
        );
        expect(stateVariables[answerIdx].stateValues.submittedResponses).eqls(
            submittedResponses,
        );
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedValues).eqls(
            selectedValues,
        );
        expect(stateVariables[choiceInputIdx].stateValues.selectedIndices).eqls(
            selectedIndices,
        );
    }
}

async function test_matrix_answer({
    doenetML,
    answers,
    answerName = "answer1",
    matrixInputName,
    originalEffectiveResponse,
}: {
    doenetML: string;
    answers: {
        entries: { latex: string; rowInd: number; colInd: number }[];
        credit: number;
        preAction?: {
            name: string;
            value: string;
            type: "math" | "text" | "boolean";
        };
        submissionPrevented?: boolean;
        overrideResponse: any;
        awardsUsed?: string[];
    }[];
    answerName?: string;
    matrixInputName?: string;
    originalEffectiveResponse: any;
}) {
    let currentResponse = originalEffectiveResponse;
    let submittedResponses: any[] = [];
    let submittedCredit = 0;
    let numSubmissions = 0;

    let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx(answerName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    const matrixInputIdx = matrixInputName
        ? await resolvePathToNodeIdx(matrixInputName)
        : stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;

    if (!matrixInputIdx) {
        throw Error("Don't have matrixInput name");
    }

    expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
        submittedCredit,
    );
    expect(
        stateVariables[answerIdx].stateValues.currentResponses.map(
            (x) => x.tree,
        ),
    ).eqls([currentResponse]);
    expect(
        stateVariables[answerIdx].stateValues.submittedResponses.map(
            (x) => x.tree,
        ),
    ).eqls(submittedResponses);
    expect(stateVariables[matrixInputIdx].stateValues.value.tree).eqls(
        currentResponse,
    );

    for (let response of answers) {
        if (response.preAction) {
            const actionIdx = await resolvePathToNodeIdx(
                response.preAction.name,
            );
            if (response.preAction.type === "math") {
                await updateMathInputValue({
                    latex: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            } else if (response.preAction.type === "text") {
                await updateTextInputValue({
                    text: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            } else {
                await updateBooleanInputValue({
                    boolean: response.preAction.value === "true",
                    componentIdx: actionIdx,
                    core,
                });
            }
        }

        if (!response.submissionPrevented) {
            currentResponse = response.overrideResponse;
        }
        const credit = response.credit;

        // Type answers in

        for (let entry of response.entries) {
            await updateMatrixInputValue({
                latex: entry.latex,
                rowInd: entry.rowInd,
                colInd: entry.colInd,
                componentIdx: matrixInputIdx,
                stateVariables,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
        );
        expect(
            stateVariables[answerIdx].stateValues.currentResponses.map(
                (x) => x.tree,
            ),
        ).eqls([currentResponse]);
        expect(
            stateVariables[answerIdx].stateValues.submittedResponses.map(
                (x) => x.tree,
            ),
        ).eqls(submittedResponses);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[matrixInputIdx].stateValues.value.tree).eqls(
            currentResponse,
        );
        if (response.awardsUsed) {
            const awardsUsed: number[] = [];
            for (const award of response.awardsUsed) {
                awardsUsed.push(await resolvePathToNodeIdx(award));
            }
            expect(
                stateVariables[answerIdx].stateValues.awardsUsedIfSubmit,
            ).eqls(awardsUsed);
        }

        // submit
        await submitAnswer({ componentIdx: answerIdx, core });
        if (!response.submissionPrevented) {
            submittedResponses = [currentResponse];
            numSubmissions++;
        }
        submittedCredit = credit;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
            `Expected response ${currentResponse} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(
            stateVariables[answerIdx].stateValues.currentResponses.map(
                (x) => x.tree,
            ),
        ).eqls([currentResponse]);
        expect(
            stateVariables[answerIdx].stateValues.submittedResponses.map(
                (x) => x.tree,
            ),
        ).eqls(submittedResponses);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(
            numSubmissions,
        );
        expect(stateVariables[matrixInputIdx].stateValues.value.tree).eqls(
            currentResponse,
        );
    }
}

async function test_action_answer({
    doenetML,
    answers,
    answerName = "answer1",
    originalEffectiveResponses,
}: {
    doenetML: string;
    answers: {
        actionArgs: any;
        actionName: string;
        actionComponentName: string;
        effectiveResponses: any[];
        credit: number;
        preAction?: {
            name: string;
            value: string;
            type: "math" | "text";
        };
    }[];
    answerName?: string;
    originalEffectiveResponses: any[];
}) {
    let currentResponses = originalEffectiveResponses;
    let submittedResponses: any[] = [];
    let submittedCredit = 0;

    let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx(answerName);

    let stateVariables = await core.returnAllStateVariables(false, true);

    expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
        submittedCredit,
    );
    expect(
        stateVariables[answerIdx].stateValues.currentResponses.map(
            (x) => x.tree,
        ),
    ).eqls(currentResponses);
    expect(
        stateVariables[answerIdx].stateValues.submittedResponses.map(
            (x) => x.tree,
        ),
    ).eqls(submittedResponses);

    for (let response of answers) {
        if (response.preAction) {
            const actionIdx = await resolvePathToNodeIdx(
                response.preAction.name,
            );
            if (response.preAction.type === "math") {
                await updateMathInputValue({
                    latex: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            } else {
                await updateTextInputValue({
                    text: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            }
        }

        currentResponses = response.effectiveResponses;
        const credit = response.credit;

        // do action for answer

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx(
                response.actionComponentName,
            ),
            actionName: response.actionName,
            args: response.actionArgs,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
        );
        expect(
            stateVariables[answerIdx].stateValues.currentResponses.map(
                (x) => x.tree,
            ),
        ).eqls(currentResponses);
        expect(
            stateVariables[answerIdx].stateValues.submittedResponses.map(
                (x) => x.tree,
            ),
        ).eqls(submittedResponses);
        // submit
        await submitAnswer({ componentIdx: answerIdx, core });
        submittedResponses = currentResponses;
        submittedCredit = credit;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(
            submittedCredit,
            `Expected response ${currentResponses} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(
            stateVariables[answerIdx].stateValues.currentResponses.map(
                (x) => x.tree,
            ),
        ).eqls(currentResponses);
        expect(
            stateVariables[answerIdx].stateValues.submittedResponses.map(
                (x) => x.tree,
            ),
        ).eqls(submittedResponses);
    }
}

async function test_answer_multiple_inputs({
    doenetML,
    answers,
    answerName = "answer1",
    inputs,
}: {
    doenetML: string;
    answers: {
        values: string[];
        credit: number;
        preAction?: {
            name: string;
            value: string;
            type: "math" | "text";
        };
        awardsUsed?: string[];
    }[];
    answerName?: string;
    inputs: { type: "math" | "number" | "text" | "boolean"; name?: string }[];
}) {
    let fromLatexBase = latexToMathFactory();
    let fromLatex = (x: string) => fromLatexBase(normalizeLatexString(x));
    let currentResponses = inputs.map((input) => {
        if (input.type === "math") {
            return "\uff3f";
        } else if (input.type === "number") {
            return NaN;
        } else if (input.type === "text") {
            return "";
        } else {
            return false;
        }
    });
    let submittedResponses: any[] = [];
    let submittedCredit = 0;

    let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx(answerName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    let inputIndices: number[] = [];

    for (const [i, input] of inputs.entries()) {
        let cIdx = input.name
            ? await resolvePathToNodeIdx(input.name)
            : stateVariables[answerIdx].stateValues.inputChildren[i]
                  .componentIdx;

        if (!cIdx) {
            throw Error(`Don't have name for input ${i}.`);
        }

        inputIndices.push(cIdx);
    }

    function transformOutputValues(values: any[]) {
        return values.map((val, i) => {
            if (
                (inputs[i].type === "math" || inputs[i].type === "number") &&
                val.tree !== undefined
            ) {
                val = val.tree;
            }
            return val;
        });
    }

    function transformInputValues(values: any[]) {
        return values.map((val, i) => {
            if (inputs[i].type === "math") {
                val = fromLatex(val).tree;
            } else if (inputs[i].type === "number") {
                val = fromLatex(val).evaluate_to_constant();
            } else if (inputs[i].type === "boolean") {
                val = val === "true";
            }
            return val;
        });
    }

    expect(stateVariables[answerIdx].stateValues.creditAchieved).closeTo(
        submittedCredit,
        1e-14,
    );
    expect(
        stateVariables[answerIdx].stateValues.currentResponses.map((x, i) =>
            inputs[i].type === "math" ? x.tree : x,
        ),
    ).eqls(currentResponses);
    expect(
        stateVariables[answerIdx].stateValues.submittedResponses.map((x, i) =>
            inputs[i].type === "math" ? x.tree : x,
        ),
    ).eqls(submittedResponses);
    if (inputs.every((x) => x.type !== "number")) {
        expect(
            transformOutputValues(
                inputIndices.map(
                    (cIdx) => stateVariables[cIdx].stateValues.value,
                ),
            ),
        ).eqls(currentResponses);
    }

    for (let response of answers) {
        if (response.preAction) {
            const actionIdx = await resolvePathToNodeIdx(
                response.preAction.name,
            );
            if (response.preAction.type === "math") {
                await updateMathInputValue({
                    latex: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            } else {
                await updateTextInputValue({
                    text: response.preAction.value,
                    componentIdx: actionIdx,
                    core,
                });
            }
        }

        const values = response.values;

        currentResponses = transformInputValues(values);
        const credit = response.credit;

        // Type answers in

        for (let [ind, input] of inputs.entries()) {
            if (input.type === "math" || input.type === "number") {
                await updateMathInputValue({
                    latex: values[ind],
                    componentIdx: inputIndices[ind],
                    core,
                });
            } else if (input.type === "text") {
                await updateTextInputValue({
                    text: values[ind],
                    componentIdx: inputIndices[ind],
                    core,
                });
            } else {
                await updateBooleanInputValue({
                    boolean: values[ind] === "true",
                    componentIdx: inputIndices[ind],
                    core,
                });
            }
        }

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[answerIdx].stateValues.creditAchieved).closeTo(
            submittedCredit,
            1e-14,
        );
        expect(
            transformOutputValues(
                stateVariables[answerIdx].stateValues.currentResponses,
            ),
        ).eqls(currentResponses);
        expect(
            transformOutputValues(
                stateVariables[answerIdx].stateValues.submittedResponses,
            ),
        ).eqls(submittedResponses);

        if (response.awardsUsed) {
            if (response.awardsUsed) {
                const awardsUsed: number[] = [];
                for (const award of response.awardsUsed) {
                    awardsUsed.push(await resolvePathToNodeIdx(award));
                }
                expect(
                    stateVariables[answerIdx].stateValues.awardsUsedIfSubmit,
                ).eqls(awardsUsed);
            }
        }

        // submit
        await submitAnswer({ componentIdx: answerIdx, core });
        submittedResponses = currentResponses;
        submittedCredit = credit;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).closeTo(
            submittedCredit,
            1e-14,
            `Expected response ${currentResponses} to have credit ${submittedCredit}, got credit ${stateVariables[answerIdx].stateValues.creditAchieved}`,
        );
        expect(
            transformOutputValues(
                stateVariables[answerIdx].stateValues.currentResponses,
            ),
        ).eqls(currentResponses);
        expect(
            transformOutputValues(
                stateVariables[answerIdx].stateValues.submittedResponses,
            ),
        ).eqls(submittedResponses);
    }
}

describe("Answer tag tests", async () => {
    it("answer sugar from one string", async () => {
        const doenetML = `<answer name="answer1">x+y</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from one macro", async () => {
        const doenetML = `
    <math name="xy" hide>x+y</math>
    <answer name="answer1">$xy</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from one math", async () => {
        const doenetML = `
    <answer name="answer1"><math>x+y</math></answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from one m", async () => {
        const doenetML = `
    <answer name="answer1"><m>x+y</m></answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from one macro of an m", async () => {
        const doenetML = `
    <m name="xy" hide>x+y</m>
    <answer name="answer1">$xy</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from one me", async () => {
        const doenetML = `
    <answer name="answer1"><me>x+y</me></answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from one macro of an me", async () => {
        const doenetML = `
    <me name="xy" hide>x+y</me>
    <answer name="answer1">$xy</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from macros and string", async () => {
        const doenetML = `
    <setup><math name="x">x</math><math name="y">y</math></setup>
    <answer name="answer1"><math>$x+$y</math></answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from maths and string", async () => {
        const doenetML = `
    <answer name="answer1"><math>x</math>+<math>y</math></answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from math, macro, and string", async () => {
        const doenetML = `
    <setup><math name="y">y</math></setup>
    <answer name="answer1"><math>x</math>+$y</answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from one string, set to text", async () => {
        const doenetML = `
        <answer name="answer1" type="text">hello there</answer>
        `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from one string, set to text, expanded", async () => {
        const doenetML = `
    <answer name="answer1" type="text" expanded>hello there</answer>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from one macro, set to text", async () => {
        const doenetML = `
    <text name='h'>hello there</text>
    <answer name="answer1" type="text">$h</answer>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from one text", async () => {
        const doenetML = `
    <answer name="answer1"><text>hello there</text></answer>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from text with copySource", async () => {
        const doenetML = `
    <text name='h'>hello there</text>
    <answer name="answer1"><text extend="$h" /></answer>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from macro and string, set to text", async () => {
        const doenetML = `
    <setup><text name="h">hello</text></setup>
    <answer name="answer1" type="text">$h there</answer>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from text and string", async () => {
        const doenetML = `
    <answer name="answer1"><text>hello</text> there</answer>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from macros and string, does not ignore blank string, set to text", async () => {
        const doenetML = `
    <setup><text name="h">hello</text><text name="t">there</text></setup>
    <answer name="answer1" type="text">$h $t</answer>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from macro, text, and string, does not ignore blank string", async () => {
        const doenetML = `
    <setup><text name="h">hello</text></setup>
    <answer name="answer1">$h <text>there</text></answer>
  `;
        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    // test for bug where submitted response was not initially text
    // when had only one copy of referring to all submitted responses
    it("answer sugar from one string, set to text, copy all responses", async () => {
        const doenetML = `
    <answer name="answer1" type="text">hello there</answer>
    Submitted responses: <text extend="$answer1.submittedResponses" name="sr1" />
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let textInputName =
            stateVariables[await resolvePathToNodeIdx("answer1")].stateValues
                .inputChildren[0].componentIdx;

        await updateTextInputValue({
            text: " hello there ",
            componentIdx: textInputName,
            core,
        });

        // submit
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sr1")].stateValues.value,
        ).eq(" hello there ");

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from one string, set to boolean", async () => {
        const doenetML = `
    <answer name="answer1" type="boolean">true</answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer sugar from one string, set to boolean 2", async () => {
        const doenetML = `
    <answer name="answer1" type="boolean">not false</answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer sugar from one boolean", async () => {
        const doenetML = `
    <answer name="answer1"><boolean>true</boolean></answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer sugar from macro and string, set to boolean", async () => {
        const doenetML = `
    <boolean hide name="b">false</boolean>
    <answer name="answer1" type="boolean">not $b</answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer sugar from boolean and string", async () => {
        const doenetML = `
    <answer name="answer1">not <boolean>false</boolean></answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("warning for sugar with invalid type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><answer type="bad" name="answer1"><shortDescription>bad type</shortDescription>x</answer></p>
  `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid type for answer: bad",
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.start.column).eq(6);
        expect(errorWarnings.warnings[0].position.end.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.column).eq(95);

        let stateVariables = await core.returnAllStateVariables(false, true);
        let mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("answer1")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer1")].stateValues
                .creditAchieved,
        ).eq(1);
    });

    it("warning for award depending on submitted response", async () => {
        const doenetMLs = [
            `
    <answer name="ans">
        <mathInput description="Enter answer" />
        <award><when>$ans</when></award>
    </answer>`,
            `
    <answer name="ans">
        <mathInput description="Enter answer" />
        <award><when>$ans.submittedResponse=5</when></award>
    </answer>`,
            `
    <answer name="ans">
        <mathInput description="Enter answer" />
        <award><when>$ans.submittedResponse1=5</when></award>
    </answer>`,
            `
    <answer name="ans">
        <mathInput description="Enter answer" />
        <award><when>$ans.submittedResponses=5</when></award>
    </answer>`,
        ];

        async function check_award_based_on_submitted_response(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            eventually_correct = true,
        ) {
            let errorWarnings = core.core!.errorWarnings;

            expect(errorWarnings.errors.length).eq(0);
            expect(errorWarnings.warnings.length).eq(1);

            expect(errorWarnings.warnings[0].message).contain(
                "An award for this answer is based on the answer tag's own submitted response",
            );
            expect(errorWarnings.warnings[0].position.start.line).eq(2);
            expect(errorWarnings.warnings[0].position.start.column).eq(5);
            expect(errorWarnings.warnings[0].position.end.line).eq(5);
            expect(errorWarnings.warnings[0].position.end.column).eq(14);

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let mathInputIdx =
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .inputChildren[0].componentIdx;

            // have to submit the correct answer twice before it is marked correct
            await updateMathInputValue({
                latex: "5",
                componentIdx: mathInputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);

            // answer is not correct because the submitted response was initially blank
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(0);
            // justSubmitted becomes false at the criteria (based on submitted response)
            // change when the answer is submitted
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .justSubmitted,
            ).eq(false);

            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);

            // if `eventually correct` is set to `true`, then
            // the second time, the answer is marked correct and justSubmitted stays true
            // because the submitted response starts off correct and doesn't change
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(eventually_correct ? 1 : 0);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .justSubmitted,
            ).eq(true);
        }

        for (let doenetML of doenetMLs) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            await check_award_based_on_submitted_response(
                core,
                resolvePathToNodeIdx,
            );
        }

        let doenetML = `
    <answer name="ans">
        <mathInput description="Enter answer" />
        <award><when>$ans.submittedResponse2=5</when></award>
    </answer>`;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        await check_award_based_on_submitted_response(
            core,
            resolvePathToNodeIdx,
            false,
        );
    });

    it("award depending on current response throws error", async () => {
        const doenetMLs = [
            `<answer name="ans"><mathInput /><award><when>$ans.currentResponse=5</when></award></answer>`,
            `<answer name="ans"><mathInput /><award><when>$ans.currentResponse1=5</when></award></answer>`,
            `<answer name="ans"><mathInput /><award><when>$ans.currentResponse2=5</when></award></answer>`,
            `<answer name="ans"><mathInput /><award><when>$ans.currentResponses=5</when></award></answer>`,
        ];

        for (let doenetML of doenetMLs) {
            await expect(createTestCore({ doenetML })).rejects.toThrow(
                "Circular dependency",
            );
        }
    });

    it("answer award with math", async () => {
        const doenetML = `
    <answer name="answer1"><award><math>x+y</math></award></answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer award with sugared string", async () => {
        const doenetML = `
    <answer name="answer1"><award>x+y</award></answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer award with sugared macro", async () => {
        const doenetML = `
    <math name="xy" hide>x+y</math>
    <answer name="answer1"><award>$xy</award></answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer award with sugared macros and string", async () => {
        const doenetML = `
    <setup><math name="x">x</math><math name="y">y</math></setup>
    <answer name="answer1"><award>$x+$y</award></answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer award with sugared macro, math, and string", async () => {
        const doenetML = `
    <setup><math name="x">x</math></setup>
    <answer name="answer1"><award>$x+<math>y</math></award></answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer award with math, initially unresolved", async () => {
        const doenetML = `
    <answer name="answer1"><award><math>x+y-3+$n</math></award></answer>


    <number extend="$n3" name="n2" />
    <math extend="$num1" name="n" />
    <math name="num1">$n2+$num2</math>
    <math name="num2">$n3+$num3</math>
    <number extend="$num3" name="n3" />
    <number name="num3">1</number>

  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("answer sugar from mathList", async () => {
        const doenetML = `
    <answer name="answer1" matchPartial><mathList>x+y z</mathList></answer>

  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y, z", credit: 1 },
                { latex: "x, z", credit: 0.5 },
                { latex: "x", credit: 0 },
                { latex: "z", credit: 0.5 },
                { latex: "z, x+y", credit: 0.5 },
                { latex: "abc, x+y", credit: 0.5 },
            ],
        });
    });

    it("answer award with mathList", async () => {
        const doenetML = `
    <answer name="answer1" matchPartial><award><mathList>x+y z</mathList></award></answer>

  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y, z", credit: 1 },
                { latex: "x, z", credit: 0.5 },
                { latex: "x", credit: 0 },
                { latex: "z", credit: 0.5 },
                { latex: "z, x+y", credit: 0.5 },
                { latex: "abc, x+y", credit: 0.5 },
            ],
        });
    });

    it("answer from mathList", async () => {
        const doenetML = `
    <mathInput name="mi1" /> <mathInput name="mi2" />
    <answer matchPartial name="answer1"><award><when>
      <mathList isResponse>$mi1 $mi2</mathList> = <mathList>x+y z</mathList>
    </when></award></answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["x+y", "z"], credit: 1 },
                { values: ["x", "z"], credit: 0.5 },
                { values: ["x", ""], credit: 0 },
                { values: ["z", ""], credit: 0.5 },
                { values: ["", "z"], credit: 0.5 },
                { values: ["", "x"], credit: 0 },
                { values: ["", "x+y"], credit: 0.5 },
                { values: ["x+y", ""], credit: 0.5 },
                { values: ["z", "x+y"], credit: 0.5 },
            ],
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
            ],
        });
    });

    it("answer sugar from numberList", async () => {
        const doenetML = `
    <answer name="answer1" matchPartial><numberList>1 2</numberList></answer>

  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "1,2", credit: 1 },
                { latex: "31,2", credit: 0.5 },
                { latex: "31", credit: 0 },
                { latex: "1", credit: 0.5 },
                { latex: "2, 1", credit: 0.5 },
            ],
        });
    });

    it("answer award with numberList", async () => {
        const doenetML = `
    <answer name="answer1" matchPartial><award><numberList>1 2</numberList></award></answer>

  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "1,2", credit: 1 },
                { latex: "31,2", credit: 0.5 },
                { latex: "31", credit: 0 },
                { latex: "1", credit: 0.5 },
                { latex: "2, 1", credit: 0.5 },
            ],
        });
    });

    it("answer from numberList", async () => {
        const doenetML = `
    <mathInput name="mi1" /> <mathInput name="mi2" />
    <answer matchPartial name="answer1"><award><when>
      <numberList isResponse>$mi1 $mi2</numberList> = <numberList>1 2</numberList>
    </when></award></answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["1", "2"], credit: 1 },
                { values: ["3", "2"], credit: 0.5 },
                { values: ["3", ""], credit: 0 },
                { values: ["2", ""], credit: 0.5 },
                { values: ["", "2"], credit: 0.5 },
                { values: ["", "3"], credit: 0 },
                { values: ["", "1"], credit: 0.5 },
                { values: ["1", ""], credit: 0.5 },
                { values: ["2", "1"], credit: 0.5 },
            ],
            inputs: [
                { type: "number", name: "mi1" },
                { type: "number", name: "mi2" },
            ],
        });
    });

    it("answer award with text", async () => {
        const doenetML = `
    <answer name="answer1"><award><text>  hello there </text></award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer set to text, award with text", async () => {
        const doenetML = `
    <answer name="answer1" type="text"><award><text>  hello there </text></award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer set to text, award with sugared string", async () => {
        const doenetML = `
    <answer name="answer1" type="text"><award>  hello there </award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer set to text, award with sugared macro and string", async () => {
        const doenetML = `
    <setup><text name="h">hello</text></setup>
    <answer name="answer1" type="text"><award>$h there</award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer award with text and string", async () => {
        const doenetML = `
    <answer name="answer1"><award><text>hello</text> there</award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer award with text, macro, and string, does not ignore blank string", async () => {
        const doenetML = `
    <setup><text name="h">hello</text></setup>
    <answer name="answer1"><award>$h <text>there</text></award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer award with text, initially unresolved", async () => {
        const doenetML = `
    <answer name="answer1"><award><text>$n</text></award></answer>

    <text extend="$n3" name="n2"/>
    <text extend="$text1" name="n"/>
    <text name="text1">$n2 $text2</text>
    <text name="text2">$n4</text>
    <text extend="$text3" name="n3"/>
    <text name="text3">hello</text>
    <text extend="$text4" name="n4"/>
    <text name="text4">there</text>
  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "hellothere", credit: 0 },
                { text: "hello  there", credit: 1 },
            ],
        });
    });

    it("answer sugar from textList", async () => {
        const doenetML = `
    <answer name="answer1" matchPartial><textList>  hello there </textList></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello  , there ", credit: 1 },
                { text: "hello,then", credit: 0.5 },
                { text: "hello there", credit: 0 },
                { text: "there", credit: 0.5 },
            ],
        });
    });

    it("answer award with textList", async () => {
        const doenetML = `
    <answer name="answer1"><award matchPartial><textList>  hello there </textList></award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello  , there ", credit: 1 },
                { text: "hello,then", credit: 0.5 },
                { text: "hello there", credit: 0 },
                { text: "there", credit: 0.5 },
            ],
        });
    });

    it("answer from textList", async () => {
        const doenetML = `
    <textInput name="ti1" /> <textInput name="ti2" />
    <answer name="answer1"><award matchPartial><when>
      <textList isResponse>$ti1 $ti2</textList>=<textList>  hello there </textList>
    </when></award></answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: [" hello  ", " there "], credit: 1 },
                { values: ["hello", "then"], credit: 0.5 },
                { values: ["hello,there", ""], credit: 0 },
                { values: ["there", ""], credit: 0.5 },
            ],
            inputs: [
                { type: "text", name: "ti1" },
                { type: "text", name: "ti2" },
            ],
        });
    });

    it("answer award with boolean", async () => {
        const doenetML = `
    <answer name="answer1"><award><boolean>true</boolean></award></answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer set to boolean, award with boolean", async () => {
        const doenetML = `
    <answer name="answer1" type="boolean"><award><boolean>true</boolean></award></answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer set to boolean, award with sugared macro and string", async () => {
        const doenetML = `
    <boolean hide name="b">false</boolean>
    <answer name="answer1" type="boolean"><award>not $b</award></answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer set to boolean, award with sugared string", async () => {
        const doenetML = `
    <answer name="answer1" type="boolean"><award>not false</award></answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer award with sugared boolean and string", async () => {
        const doenetML = `
    <boolean hide name="b">false</boolean>
    <answer name="answer1" type="boolean"><award>not <boolean>false</boolean></award></answer>
  `;

        await test_boolean_answer({
            doenetML,
            answers: [
                { boolean: true, credit: 1 },
                { boolean: false, credit: 0 },
            ],
        });
    });

    it("answer from booleanList", async () => {
        const doenetML = `
    <booleanInput name="bi1" /> <booleanInput name="bi2" />
    <answer name="answer1"><award matchPartial matchByExactPositions><when>
      <booleanList isResponse>$bi1 $bi2</booleanList>=<booleanList>  false true </booleanList>
    </when></award></answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["false", "true"], credit: 1 },
                { values: ["false", "false"], credit: 0.5 },
                { values: ["true", "false"], credit: 0 },
                { values: ["true", "true"], credit: 0.5 },
            ],
            inputs: [
                { type: "boolean", name: "bi1" },
                { type: "boolean", name: "bi2" },
            ],
        });
    });

    it("answer with multiple booleans", async () => {
        const doenetML = `

    <booleanInput name="bi1" /> <booleanInput name="bi2" />
    <boolean hide name="b">false</boolean>
    <answer name="answer1"><award><when>
        <boolean extend="$bi1" isResponse /> = not $b and <boolean extend="$bi2" isResponse />=$b
    </when></award></answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["true", "false"], credit: 1 },
                { values: ["false", "true"], credit: 0 },
                { values: ["false", "false"], credit: 0 },
                { values: ["true", "true"], credit: 0 },
            ],
            inputs: [
                { type: "boolean", name: "bi1" },
                { type: "boolean", name: "bi2" },
            ],
        });
    });

    it("answer multiple shortcut awards", async () => {
        const doenetML = `
    <answer name="answer1"><award><math>x+y</math></award><award credit="0.5"><math>x</math></award></answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0.5 },
                { latex: "y", credit: 0 },
            ],
        });
    });

    it("answer multiple shortcut awards, initially unresolved", async () => {
        const doenetML = `
    <answer name="answer1"><award><math>$rightAnswer</math></award><award credit="0.5"><math>x-3+$n</math></award></answer>

    <math name="rightAnswer">x+y-3+$n</math>
    <number extend="$n3" name="n2" />
    <math extend="$num1" name="n" />
    <math name="num1">$n2+$num2</math>
    <math name="num2">$n3+$num3</math>
    <number extend="$num3" name="n3" />
    <number name="num3">1</number>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x", credit: 0.5 },
                { latex: "y", credit: 0 },
            ],
        });
    });

    it("answer multiple text awards", async () => {
        const doenetML = `
    <answer name="answer1"><award><text>hello there</text></award><award credit="0.5"><text>bye</text></award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "bye", credit: 0.5 },
                { text: "y", credit: 0 },
            ],
        });
    });

    it("answer multiple awards, set to text", async () => {
        const doenetML = `
    <answer name="answer1" type="text"><award><text>hello there</text></award><award credit="0.5"><text>bye</text></award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "bye", credit: 0.5 },
                { text: "y", credit: 0 },
            ],
        });
    });

    it("answer multiple string awards, set to text", async () => {
        const doenetML = `
    <answer name="answer1" type="text"><award>hello there</award><award credit="0.5">bye</award></answer>

  `;

        await test_text_answer({
            doenetML,
            answers: [
                { text: " hello there ", credit: 1 },
                { text: "bye", credit: 0.5 },
                { text: "y", credit: 0 },
            ],
        });
    });

    it("full answer tag", async () => {
        const doenetML = `
  Enter values that sum to <m>3x</m>: <mathInput name="mi1"/> <mathInput name="mi2"/>
  <answer name="answer1">
    <award><when><math><math extend="$mi1" isResponse />+<math extend="$mi2" isResponse /></math> = <math>3x</math></when></award>
    <award credit="0.5"><when><math>$mi1+$mi2</math> = <math>3</math></when></award>
  </answer>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["x+y", "2x-y"], credit: 1 },
                { values: ["x", "3-x"], credit: 0.5 },
                { values: ["y", "3-x"], credit: 0 },
            ],
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
            ],
        });
    });

    it("full answer tag, two inputs inside answer, shorter form", async () => {
        const doenetML = `
  Enter values that sum to <m>3x</m>:
  <answer name="answer1">
    <mathInput name="mi1"/> <mathInput name="mi2"/>
    <award><when>$mi1+$mi2 = 3x</when></award>
    <award credit="0.5"><when>$mi1+$mi2 = 3</when></award>
  </answer>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["x+y", "2x-y"], credit: 1 },
                { values: ["x", "3-x"], credit: 0.5 },
                { values: ["y", "3-x"], credit: 0 },
            ],
            inputs: [{ type: "math" }, { type: "math" }],
        });
    });

    it("full answer tag, copied in awards, shorter form", async () => {
        const doenetML = `
<setup>
    <award name="aw1" referencesAreResponses="$mi1 $mi2"><when>$mi1+$mi2 = 3x</when></award>
    <award name="aw2" credit="0.5"><when>$mi1+$mi2 = 3</when></award>
</setup>
Enter values that sum to <m>3x</m>:
<mathInput name="mi1" /> <mathInput name="mi2"/>
<answer name="answer1">
    <award extend="$aw1" />
    <award extend="$aw2" />
</answer>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["x+y", "2x-y"], credit: 1 },
                { values: ["x", "3-x"], credit: 0.5 },
                { values: ["y", "3-x"], credit: 0 },
            ],
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
            ],
        });
    });

    it("full answer tag, text inputs", async () => {
        const doenetML = `
  >Enter rain and snow in either order: <textInput name="ti1"/> <textInput name="ti2"/>
  <answer name="answer1">
    <award><when><text><text extend="$ti1" isResponse /> <text extend="$ti2" isResponse /></text> = <text>rain snow</text></when></award>
    <award><when><text>$ti1 $ti2</text> = <text>snow rain</text></when></award>
    <award credit="0.5"><when>$ti1 = rain</when></award>
    <award credit="0.5"><when>$ti1 = snow</when></award>
    <award credit="0.5"><when>$ti2 = rain</when></award>
    <award credit="0.5"><when>$ti2 = snow</when></award>
  </answer>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["rain", "snow"], credit: 1 },
                { values: ["rain", "rain"], credit: 0.5 },
                { values: ["snow", "rain"], credit: 1 },
                { values: ["snow", "snow"], credit: 0.5 },
                { values: ["fog", "hail"], credit: 0 },
            ],
            inputs: [
                { type: "text", name: "ti1" },
                { type: "text", name: "ti2" },
            ],
        });
    });

    it("answer inequalities", async () => {
        const doenetML = `
Enter enter number larger than 5 or less than 2: 
<answer name="answer1">
    <mathInput name="m" />
    <award><when>$m > 5</when></award>
    <award><when>$m < <math>2</math></when></award>
</answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "6", credit: 1 },
                { latex: "5", credit: 0 },
                { latex: "-3", credit: 1 },
                { latex: "5xy-5xy+9", credit: 1 },
            ],
        });
    });

    it("answer extended inequalities", async () => {
        // Number between -1 and 1, inclusive
        let doenetML = `
<answer name="answer1">
    <mathInput name="m" />
    <award><when>-1 <= $m <= 1 </when></award>
</answer>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "1", credit: 1 },
                { latex: "-1", credit: 1 },
                { latex: "0.5", credit: 1 },
                { latex: "1.1", credit: 0 },
                { latex: "-2", credit: 0 },
                { latex: "x-x", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });

        // Number between -1 and 1, exclusive
        doenetML = `
             <answer name="answer1">
                 <mathInput name="m" />
                 <award><when>-1 < $m < 1 </when></award>
             </answer>
               `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "1", credit: 0 },
                { latex: "-1", credit: 0 },
                { latex: "0.5", credit: 1 },
                { latex: "0.99", credit: 1 },
                { latex: "-2", credit: 0 },
                { latex: "x-x", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });

        // Number between -1 and 1, as greater than
        doenetML = `
             <answer name="answer1">
                 <mathInput name="m" />
                 <award><when>1 > $m >= -1 </when></award>
             </answer>
               `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "1", credit: 0 },
                { latex: "-1", credit: 1 },
                { latex: "0.5", credit: 1 },
                { latex: "0.99", credit: 1 },
                { latex: "-2", credit: 0 },
                { latex: "x-x", credit: 1 },
                { latex: "x", credit: 0 },
            ],
        });
    });

    it("compound logic", async () => {
        const doenetML = `
Enter enter number larger than 5 or less than 2: 
  <mathInput name="mi1"/> <mathInput name="mi2"/> <mathInput name="mi3"/>

<answer name="answer1">
    <award><when>
      ((<math extend="$mi1" isResponse /> = x
      and <math extend="$mi2" isResponse /> != $mi1)
      or
      ($mi1 = <math>y</math>
      and $mi2 != z
      and $mi2 != q))
      and <math extend="$mi3" isResponse /> > 5
   </when></award>
  </answer>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answers: [
                { values: ["x", "z", "6"], credit: 1 },
                { values: ["x", "x", "6"], credit: 0 },
                { values: ["x", "z", "5"], credit: 0 },
                { values: ["y", "y", "7"], credit: 1 },
                { values: ["y", "z", "7"], credit: 0 },
                { values: ["y", "q", "7"], credit: 0 },
                { values: ["y", "y^2", "7"], credit: 1 },
                { values: ["y", "y", "a"], credit: 0 },
            ],
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
                { type: "math", name: "mi3" },
            ],
        });
    });

    it("answer inside repeat", async () => {
        const doenetML = `
    <repeat name="r" for="1 2 3" valueName="n">
        <p>Enter <m>x^$n</m>: <answer name="answer1"><award><math>x^$n</math></award></answer></p>
    </repeat>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x", credit: 1 },
                { latex: "u", credit: 0 },
            ],
            answerName: "r[1].answer1",
        });

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x^2", credit: 1 },
                { latex: "v", credit: 0 },
            ],
            answerName: "r[2].answer1",
        });

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x^3", credit: 1 },
                { latex: "w", credit: 0 },
            ],
            answerName: "r[3].answer1",
        });
    });

    it("answer with shuffled choiceInput", async () => {
        const doenetML = `
The animal is a <answer name="answer1">
<choiceInput shuffleOrder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</choiceInput>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["cat"], credit: 0.5 },
            ],
        });
    });

    it("answer with shuffled sugared choices", async () => {
        const doenetML = `
The animal is a <answer name="answer1" shuffleOrder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["cat"], credit: 0.5 },
            ],
        });
    });

    it("answer with shuffled sugared choices, preserve last choice", async () => {
        const doenetML = `
The animal is a <answer name="answer1" shuffleOrder preserveLastChoice>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["cat"], credit: 0.5 },
            ],
        });
    });

    it("answer with choiceInput, fixed order", async () => {
        const doenetML = `
The animal is a <answer name="answer1">
<choiceInput>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</choiceInput>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["cat"], credit: 0.5 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
        });
    });

    it("answer with sugared choices, fixed order", async () => {
        const doenetML = `
The animal is a <answer name="answer1">
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["cat"], credit: 0.5 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
        });
    });

    it("answer with select-multiple choiceInput, fixed order", async () => {
        const doenetML = `
The animal is a <answer name="answer1">
<choiceInput selectMultiple>
    <choice credit="1">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</choiceInput>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 0 },
                { choices: ["dog", "cat"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["monkey", "cat", "dog"], credit: 0 },
                { choices: ["monkey", "dog"], credit: 0 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
        });
    });

    it("answer with select-multiple choiceInput, fixed order, match partial", async () => {
        const doenetML = `
The animal is a <answer name="answer1">
<choiceInput selectMultiple matchPartial>
    <choice credit="1">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</choiceInput>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 0.5 },
                { choices: ["dog", "cat"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["monkey", "cat", "dog"], credit: 2 / 3 },
                { choices: ["monkey", "dog"], credit: 1 / 3 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
        });
    });

    it("answer with select-multiple sugared choices, fixed order", async () => {
        const doenetML = `
The animal is a <answer name="answer1" selectMultiple matchPartial>
    <choice credit="1">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 0.5 },
                { choices: ["dog", "cat"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["monkey", "cat", "dog"], credit: 2 / 3 },
                { choices: ["monkey", "dog"], credit: 1 / 3 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
        });
    });

    it("answer with select-multiple choiceInput, fixed order, match partial in answer", async () => {
        const doenetML = `
The animal is a <answer name="answer1" matchPartial>
<choiceInput selectMultiple>
    <choice credit="1">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</choiceInput>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 0.5 },
                { choices: ["dog", "cat"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["monkey", "cat", "dog"], credit: 2 / 3 },
                { choices: ["monkey", "dog"], credit: 1 / 3 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
        });
    });

    it("answer with choiceInput, no bug when submit first", async () => {
        const doenetML = `
The animal is a <answer name="answer1">
<choiceInput>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
</choiceInput>
</answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
                { choices: ["cat"], credit: 0.5 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
            submitFirst: true,
        });
    });

    it("answer with variable number of choices", async () => {
        const doenetML = `
    <p>Num: <mathInput name="num" prefill="3"/></p>

    <answer name="answer1">
    <choiceInput shuffleOrder>
      <repeatForSequence from="0" to="$num-1" valueName="m">
          <choice credit="$m/($num-1)">Get <number displayDigits="3">$m/($num-1)</number></choice>
      </repeatForSequence>
    </choiceInput>
    </answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["Get 1"], credit: 1 },
                { choices: ["Get 0"], credit: 0 },
                { choices: ["Get 0.5"], credit: 0.5 },
                {
                    choices: ["Get 1"],
                    credit: 1,
                    preAction: {
                        name: "num",
                        value: "4",
                        recomputeIndices: true,
                        type: "math",
                    },
                },
                { choices: ["Get 0"], credit: 0 },
                { choices: ["Get 0.333"], credit: 1 / 3 },
                { choices: ["Get 0.667"], credit: 2 / 3 },
                {
                    choices: ["Get 1"],
                    credit: 1,
                    preAction: {
                        name: "num",
                        value: "3",
                        recomputeIndices: true,
                        type: "math",
                    },
                },
                { choices: ["Get 0"], credit: 0 },
                { choices: ["Get 0.5"], credit: 0.5 },
                {
                    choices: ["Get 1"],
                    credit: 1,
                    preAction: {
                        name: "num",
                        value: "6",
                        recomputeIndices: true,
                        type: "math",
                    },
                },
                { choices: ["Get 0"], credit: 0 },
                { choices: ["Get 0.2"], credit: 0.2 },
                { choices: ["Get 0.4"], credit: 0.4 },
                { choices: ["Get 0.6"], credit: 0.6 },
                { choices: ["Get 0.8"], credit: 0.8 },
            ],
        });
    });

    it("answer with user-defined choice and credit", async () => {
        const doenetML = `
      <p>Credit for cat: <mathInput name="catCredit" prefill="0.3" /> </p>
      <p>Last option: <textInput prefill="bird" name="last" /></p>
      <answer name="answer1">
        <choiceInput>
        <choice credit="$catCredit">cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
        <choice>$last.value</choice>
        </choiceInput>
      </answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 1 },
                { choices: ["cat"], credit: 0.3 },
                {
                    choices: ["dog"],
                    credit: 1,
                    preAction: {
                        name: "catCredit",
                        value: "0.4",
                        recomputeIndices: true,
                        type: "math",
                    },
                },
                { choices: ["bird"], credit: 0 },
                {
                    choices: ["cat"],
                    credit: 0.4,
                    preAction: {
                        name: "last",
                        value: "mouse",
                        recomputeIndices: true,
                        type: "text",
                    },
                },
                { choices: ["mouse"], credit: 0 },
                {
                    choices: ["cat"],
                    credit: 0.2,
                    preAction: {
                        name: "catCredit",
                        value: "0.2",
                        recomputeIndices: true,
                        type: "math",
                    },
                },
                { choices: ["monkey"], credit: 0 },
                {
                    choices: ["rabbit"],
                    credit: 0,
                    preAction: {
                        name: "last",
                        value: "rabbit",
                        recomputeIndices: true,
                        type: "text",
                    },
                },
            ],
        });
    });

    it("answer, any letter", async () => {
        const doenetML = `
Enter any letter:
  <answer name='userx'>
  <mathInput name="userx_input"/>
  <award><when>
    $userx_input elementof {a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}
    </when>
  </award>
  </answer>
  `;

        await test_math_answer({
            doenetML,
            answerName: "userx",
            answers: [
                { latex: "a", credit: 1 },
                { latex: "c,d", credit: 0 },
                { latex: "q", credit: 1 },
                { latex: "1", credit: 0 },
                { latex: "R", credit: 1 },
            ],
        });
    });

    it("answer element of user defined set", async () => {
        const doenetML = `
  <p>Enter a set <mathInput name="set" prefill="{1,2,3}" /></p>
  <p>Enter an element of that set: 
  <answer name="answer1">
  <mathInput name="element" />
  <award>
    <when>$element elementof $set.value</when>
  </award>
  </answer>
  </p>
  `;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "2", credit: 1 },
                { latex: "c", credit: 0 },
                {
                    latex: "c",
                    credit: 1,
                    preAction: {
                        name: "set",
                        value: "\\{a,b,c,d,e,f,g\\}",
                        type: "math",
                    },
                },
                { latex: "g", credit: 1 },
                { latex: "2", credit: 0 },
                {
                    latex: "2",
                    credit: 0,
                    preAction: {
                        name: "set",
                        value: "\\{(x+y)/2, e^{x^2+y}, (1,2,3) \\}",
                        type: "math",
                    },
                },
                { latex: "(1,2,3)", credit: 1 },
                { latex: "e^{x^2+y}", credit: 1 },
                { latex: "e^{x^2}", credit: 0 },
                { latex: "x+2y-x/2-3y/2", credit: 1 },
            ],
        });
    });

    it("answer based on math and text", async () => {
        const doenetML = `
<p>Enter a number larger than one <mathInput name="mi"/></p>
<p>Say hello: <textInput name="ti"/></p>

<answer name="a"> 
    <award matchPartial><when>
    $mi > 1 
    and
    $ti = hello
    </when></award>
</answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answerName: "a",
            answers: [
                { values: ["2", ""], credit: 0.5 },
                { values: ["2", "hello"], credit: 1 },
                { values: ["0", "hello"], credit: 0.5 },
                { values: ["0", "bye"], credit: 0 },
            ],
            inputs: [
                { type: "math", name: "mi" },
                { type: "text", name: "ti" },
            ],
        });
    });

    it("answer based on math and text, match partial in answer", async () => {
        const doenetML = `
<p>Enter a number larger than one <mathInput name="mi"/></p>
<p>Say hello: <textInput name="ti"/></p>

<answer name="a" matchPartial> 
    <award><when>
    $mi > 1 
    and
    $ti = hello
    </when></award>
</answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answerName: "a",
            answers: [
                { values: ["2", ""], credit: 0.5 },
                { values: ["2", "hello"], credit: 1 },
                { values: ["0", "hello"], credit: 0.5 },
                { values: ["0", "bye"], credit: 0 },
            ],
            inputs: [
                { type: "math", name: "mi" },
                { type: "text", name: "ti" },
            ],
        });
    });

    it.skip("answer based on point, nonstandard case for isResponse", async () => {
        const doenetML = `
        <p>Criterion: <mathInput name="mi" prefill="1" /></p>
        <p>Move point so that its x-coordinate is larger than $mi.value.</p>
        
        <graph>
          <point name="P">(0,0)</point>
        </graph>

        <answer name="a"> 
          <award><when>
            $mi < <math extend="$P.x" isresPoNse />
          </when></award>
        </answer>

  `;

        await test_action_answer({
            doenetML,
            answerName: "a",
            originalEffectiveResponses: [0],
            answers: [
                {
                    actionArgs: { x: 3, y: -3 },
                    actionName: "movePoint",
                    actionComponentName: "P",
                    effectiveResponses: [3],
                    credit: 1,
                },
                {
                    preAction: {
                        type: "math",
                        name: "mi",
                        value: "4",
                    },
                    actionArgs: { x: 3, y: -3 },
                    actionName: "movePoint",
                    actionComponentName: "P",
                    effectiveResponses: [3],
                    credit: 0,
                },
                {
                    actionArgs: { x: 8, y: 9 },
                    actionName: "movePoint",
                    actionComponentName: "P",
                    effectiveResponses: [8],
                    credit: 1,
                },
            ],
        });
    });

    it("answer with unicode", async () => {
        const doenetML = `<answer name="answer1">x+2pi+3gamma+4mu+5xi+6eta</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x+2\\pi+3\\gamma+4\\mu+5\\xi+6\\eta", credit: 1 },
                { latex: "x", credit: 0 },
                { latex: "x+2π+3γ+4μ+5ξ+6η", credit: 1 },
            ],
        });
    });

    it("mark references as responses", async () => {
        const doenetML = `
        <p>Enter minimum: <mathInput name="min" /></p>
        <p>Enter value larger than $min: <mathInput name="val" /></p>
        
        <answer name="a"> 
            <award referencesAreResponses="$val"><when>$val > $min</when></award>
        </answer>`;

        await test_math_answer({
            doenetML,
            mathInputName: "val",
            answerName: "a",
            answers: [
                {
                    latex: "",
                    credit: 0,
                    preAction: {
                        name: "min",
                        value: "2",
                        type: "math",
                    },
                },
                { latex: "3", credit: 1 },
                { latex: "2", credit: 0 },
                {
                    latex: "2",
                    credit: 1,
                    preAction: {
                        name: "min",
                        value: "1.9",
                        type: "math",
                    },
                },
            ],
        });
    });

    it("consider as responses", async () => {
        const doenetML = `
        <p>Enter two 2D points, where second to upward and to the right of the first:
         <mathInput name="P" /> <mathInput name="Q" /></p>

        <answer name="a">
            <considerAsResponses>$P $Q</considerAsResponses>
            <award><when>$Q.x > $P.x and $Q.y > $P.y</when></award>
        </answer>

  `;

        await test_answer_multiple_inputs({
            doenetML,
            answerName: "a",
            answers: [
                { values: ["(2,3)", "(3,4)"], credit: 1 },
                { values: ["(5,3)", "(3,1)"], credit: 0 },
            ],
            inputs: [
                { type: "math", name: "P" },
                { type: "math", name: "Q" },
            ],
        });
    });

    it("isResponse is not copied", async () => {
        const doenetML = `
        <mathInput name="mi" />
        <answer name="ans">
          <award>
            <when><math extend="$mi" isResponse name="v" /> = x</when>
          </award>
          <award credit="0.9">
            <when>$v = y</when>
          </award>
          <award credit="0.8">
            <when>$v = z</when>
          </award>
        </answer>`;

        await test_math_answer({
            doenetML,
            mathInputName: "mi",
            answerName: "ans",
            answers: [
                { latex: "x", credit: 1 },
                { latex: "y", credit: 0.9 },
                { latex: "z", credit: 0.8 },
            ],
        });
    });

    it("isResponse from referencesAreResponses is not copied", async () => {
        const doenetML = `
        <mathInput name="mi" />
        <answer name="ans">
          <award referencesAreResponses="$mi">
            <when><math extend="$mi" name="v" /> = x</when>
          </award>
          <award credit="0.9">
            <when>$v = y</when>
          </award>
          <award credit="0.8">
            <when>$v = z</when>
          </award>
        </answer>
        `;

        await test_math_answer({
            doenetML,
            mathInputName: "mi",
            answerName: "ans",
            answers: [
                { latex: "x", credit: 1 },
                { latex: "y", credit: 0.9 },
                { latex: "z", credit: 0.8 },
            ],
        });
    });

    it("isResponse from referencesAreResponses is not recursively copied", async () => {
        const doenetML = `
        <mathInput name="mi" />
        <answer name="ans">
          <award referencesAreResponses="$mi">
            <when><math name="m">$mi</math> = x</when>
          </award>
          <award credit="0.9">
            <when>$m = y</when>
          </award>
          <award credit="0.8">
            <when>$m.value = z</when>
          </award>
        </answer>
        `;

        await test_math_answer({
            doenetML,
            mathInputName: "mi",
            answerName: "ans",
            answers: [
                { latex: "x", credit: 1 },
                { latex: "y", credit: 0.9 },
                { latex: "z", credit: 0.8 },
            ],
        });
    });

    it("all composites are responses if no responses indicated", async () => {
        const doenetML = `
        <p>Enter minimum: <mathInput name="min" /></p>
        <p>Enter value larger than $min: <mathInput name="val" /></p>
        
        <answer name="a"> 
            <award ><when>$val > $min</when></award>
        </answer>
        `;

        await test_answer_multiple_inputs({
            doenetML,
            answerName: "a",
            answers: [
                { values: ["", "2"], credit: 0 },
                { values: ["3", "2"], credit: 1 },
            ],
            inputs: [
                { type: "math", name: "val" },
                { type: "math", name: "min" },
            ],
        });
    });

    it("choiceInput credit from boolean", async () => {
        let options = ["meow", "woof", "squeak", "blub"];
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
        <variantControl numVariants="4" variantNames="cat dog mouse fish"/>
  
        <select name="animal" hide>
          <option selectForVariants="cat">
            <text>cat</text>
          </option>
          <option selectForVariants="dog">
            <text>dog</text>
          </option>
          <option selectForVariants="mouse">
            <text>mouse</text>
          </option>
          <option selectForVariants="fish">
            <text>fish</text>
          </option>
        </select>
        
        <p>What does the $animal say?
          <answer name="ans">
            <choiceInput shuffleOrder name="ci">
            <choice credit="$animal=cat" >meow</choice>
            <choice credit="$animal=dog" >woof</choice>
            <choice credit="$animal=mouse" >squeak</choice>
            <choice credit="$animal=fish" >blub</choice>
            </choiceInput>
          </answer>
        </p>
        `,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let indexByName = {};
            for (let [ind, val] of stateVariables[
                await resolvePathToNodeIdx("ci")
            ].stateValues.choiceTexts.entries()) {
                indexByName[val] = ind + 1;
            }

            for (let ind2 = 1; ind2 <= 4; ind2++) {
                let selectedIndices = [indexByName[options[ind2 - 1]]];
                await updateSelectedIndices({
                    componentIdx: await resolvePathToNodeIdx("ci"),
                    selectedIndices,
                    core,
                });

                await submitAnswer({
                    componentIdx: await resolvePathToNodeIdx("ans"),
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                if (ind2 === ind) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(1);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0);
                }
            }
        }
    });

    it("award credit from boolean", async () => {
        let options = ["meow", "woof", "squeak", "blub"];
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
        <variantControl numVariants="4" variantNames="cat dog mouse fish"/>
  
        <select name="s" hide>
          <option selectForVariants="cat">
            <text name="animal">cat</text><text name="sound">meow</text>
          </option>
          <option selectForVariants="dog">
            <text name="animal">dog</text><text name="sound">woof</text>
          </option>
          <option selectForVariants="mouse">
            <text name="animal">mouse</text><text name="sound">squeak</text>
          </option>
          <option selectForVariants="fish">
            <text name="animal">fish</text><text name="sound">blub</text>
          </option>
        </select>
        
        <p>What does the $s.animal say?
          <answer name="ans" type="text">
            <award credit="$s.animal=cat" ><text>meow</text></award>
            <award credit="$s.animal=dog" ><text>woof</text></award>
            <award credit="$s.animal=mouse" ><text>squeak</text></award>
            <award credit="$s.animal=fish" ><text>blub</text></award>
          </answer>
        </p>
        `,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let textInputIdx =
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .inputChildren[0].componentIdx;

            for (let ind2 = 1; ind2 <= 4; ind2++) {
                await updateTextInputValue({
                    text: options[ind2 - 1],
                    componentIdx: textInputIdx,
                    core,
                });

                await submitAnswer({
                    componentIdx: await resolvePathToNodeIdx("ans"),
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                if (ind2 === ind) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(1);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0);
                }
            }
        }
    });

    it("number of awards credited", async () => {
        const doenetML = `
        <p>Number of awards credited: <mathInput name="nAwards" prefill="1" /></p>
        <p>Credit for combined award: <mathInput name="creditForCombined" prefill="1" /></p>
        <p>Distinct numbers greater than 3:
        <mathInput name="mi1" />
        <mathInput name="mi2" />
        <answer numAwardsCredited="$nAwards" name="a">
          <award name="FirstGreater3" credit="0.4" referencesAreResponses="$mi1"><when>$mi1 > 3</when></award>
          <award name="SecondGreater3" credit="0.4" referencesAreResponses="$mi2"><when>$mi2 > 3</when></award>
          <award name="DistinctGreater3" credit="$creditForCombined"><when>$mi1 > 3 and $mi2 > 3 and $mi1 != $mi2</when></award>
          <award name="FirstNumber" credit="0"><when><isNumber>$mi1</isNumber></when></award>
          <award name="SecondNumber" credit="0"><when>isnumber($mi2)</when></award>
        </answer>
        </p>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answerName: "a",
            answers: [
                { values: ["", ""], credit: 0, awardsUsed: [] },
                { values: ["", "1"], credit: 0, awardsUsed: ["SecondNumber"] },
                { values: ["0", "1"], credit: 0, awardsUsed: ["FirstNumber"] },
                {
                    values: ["0", "1"],
                    credit: 0,
                    preAction: {
                        type: "math",
                        name: "nAwards",
                        value: "3",
                    },
                    awardsUsed: ["FirstNumber", "SecondNumber"],
                },
                {
                    values: ["4", "1"],
                    credit: 0.4,
                    awardsUsed: [
                        "FirstGreater3",
                        "FirstNumber",
                        "SecondNumber",
                    ],
                },
                {
                    values: ["4", "1"],
                    credit: 0.4,
                    preAction: {
                        type: "math",
                        name: "nAwards",
                        value: "1",
                    },
                    awardsUsed: ["FirstGreater3"],
                },
                {
                    values: ["4", "4"],
                    credit: 0.4,
                    awardsUsed: ["FirstGreater3"],
                },
                {
                    values: ["4", "4"],
                    credit: 0.8,
                    preAction: {
                        type: "math",
                        name: "nAwards",
                        value: "3",
                    },
                    awardsUsed: [
                        "FirstGreater3",
                        "SecondGreater3",
                        "FirstNumber",
                    ],
                },
                {
                    values: ["4", "5"],
                    credit: 1,
                    awardsUsed: [
                        "DistinctGreater3",
                        "FirstGreater3",
                        "SecondGreater3",
                    ],
                },
                {
                    values: ["4", "5"],
                    credit: 1,
                    preAction: {
                        type: "math",
                        name: "nAwards",
                        value: "1",
                    },
                    awardsUsed: ["DistinctGreater3"],
                },
                {
                    values: ["4", "5"],
                    credit: 0.4,
                    preAction: {
                        type: "math",
                        name: "creditForCombined",
                        value: "0.2",
                    },
                    awardsUsed: ["FirstGreater3"],
                },
                {
                    values: ["4", "5"],
                    credit: 0.8,
                    preAction: {
                        type: "math",
                        name: "nAwards",
                        value: "2",
                    },
                    awardsUsed: ["FirstGreater3", "SecondGreater3"],
                },
                {
                    values: ["4", "5"],
                    credit: 1,
                    preAction: {
                        type: "math",
                        name: "nAwards",
                        value: "3",
                    },
                    awardsUsed: [
                        "FirstGreater3",
                        "SecondGreater3",
                        "DistinctGreater3",
                    ],
                },
            ],
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
            ],
        });
    });

    it("number of awards credited 2", async () => {
        const doenetML = `
        <mathInput name="mi1" />
        <mathInput name="mi2" />
        <mathInput name="mi3" />
        <answer numAwardsCredited="3" name="a">
          <award name="FirstPositive" credit="0.2" referencesAreResponses="$mi1"><when>$mi1 > 0</when></award>
          <award name="SecondPositive" credit="0.2" referencesAreResponses="$mi2"><when>$mi2 > 0</when></award>
          <award name="ThirdPositive" credit="0.2" referencesAreResponses="$mi3"><when>$mi3 > 0</when></award>
          <award name="FirstLargerSecond" credit="0.1"><when>$mi1 > $mi2</when></award>
          <award name="FirstLargerThird" credit="0.1"><when>$mi1 > $mi3</when></award>
          <award name="SecondLargerThird" credit="0.1"><when>$mi2 > $mi3</when></award>
          <award name="SumFirstSecondLarger5" credit="0.35"><when>$mi1 + $mi2 > 5</when></award>
          <award name="SumFirstThirdLarger5" credit="0.35"><when>$mi1 + $mi3 > 5</when></award>
          <award name="SumSecondThirdLarger5" credit="0.35"><when>$mi2 + $mi3 > 5</when></award>
          <award name="FirstShouldNumber" credit="0"><when><not><isNumber>$mi1</isNumber></not></when></award>
          <award name="SecondShouldNumber" credit="0"><when>not isnumber($mi2)</when></award>
          <award name="ThirdShouldNumber" credit="0"><when><not>isnumber($mi3)</not></when></award>
          </answer>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answerName: "a",
            answers: [
                {
                    values: ["", "", ""],
                    credit: 0,
                    awardsUsed: [
                        "FirstShouldNumber",
                        "SecondShouldNumber",
                        "ThirdShouldNumber",
                    ],
                },
                {
                    values: ["-5", "", ""],
                    credit: 0,
                    awardsUsed: ["SecondShouldNumber", "ThirdShouldNumber"],
                },
                {
                    values: ["-5", "-5", ""],
                    credit: 0,
                    awardsUsed: ["ThirdShouldNumber"],
                },
                { values: ["-5", "-5", "-5"], credit: 0, awardsUsed: [] },
                {
                    values: ["-5", "-4", "-5"],
                    credit: 0.1,
                    awardsUsed: ["SecondLargerThird"],
                },
                {
                    values: ["-4", "-4", "-5"],
                    credit: 0.2,
                    awardsUsed: ["FirstLargerThird", "SecondLargerThird"],
                },
                {
                    values: ["-3", "-4", "-5"],
                    credit: 0.3,
                    awardsUsed: [
                        "FirstLargerSecond",
                        "FirstLargerThird",
                        "SecondLargerThird",
                    ],
                },
                {
                    values: ["8", "-4", "-5"],
                    credit: 0.4,
                    awardsUsed: [
                        "FirstPositive",
                        "FirstLargerSecond",
                        "FirstLargerThird",
                    ],
                },
                {
                    values: ["8", "-2", "-5"],
                    credit: 0.65,
                    awardsUsed: [
                        "SumFirstSecondLarger5",
                        "FirstPositive",
                        "FirstLargerSecond",
                    ],
                },
                {
                    values: ["8", "9", "-5"],
                    credit: 0.75,
                    awardsUsed: [
                        "SumFirstSecondLarger5",
                        "FirstPositive",
                        "SecondPositive",
                    ],
                },
                {
                    values: ["8", "11", "-5"],
                    credit: 0.9,
                    awardsUsed: [
                        "SumFirstSecondLarger5",
                        "SumSecondThirdLarger5",
                        "FirstPositive",
                    ],
                },
                {
                    values: ["8", "11", "-1"],
                    credit: 1,
                    awardsUsed: [
                        "SumFirstSecondLarger5",
                        "SumFirstThirdLarger5",
                        "SumSecondThirdLarger5",
                    ],
                },
                {
                    values: ["8", "11", "6"],
                    credit: 1,
                    awardsUsed: [
                        "SumFirstSecondLarger5",
                        "SumFirstThirdLarger5",
                        "SumSecondThirdLarger5",
                    ],
                },
                {
                    values: ["15", "11", "6"],
                    credit: 1,
                    awardsUsed: [
                        "SumFirstSecondLarger5",
                        "SumFirstThirdLarger5",
                        "SumSecondThirdLarger5",
                    ],
                },
            ],
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
                { type: "math", name: "mi3" },
            ],
        });
    });

    it("number of awards credited, zero credits are triggered", async () => {
        const doenetML = `
        <mathInput name="mi1" />
        <mathInput name="mi2" />
        <mathInput name="mi3" />
        <answer numAwardsCredited="3" name="a">
          <award referencesAreResponses="$mi1 $mi2 $mi3" matchPartial name="right">
            <when>$mi1=x and $mi2=y and $mi3=z</when>
          </award>
          <award credit="0" name="NothingRight">
            <when>$mi1!=x and $mi2!=y and $mi3!=z</when>
          </award>
          <award credit="0" name="xWrongSpot">
            <when>$mi2=x or $mi3=x</when>
          </award>
          <award credit="0" name="yWrongSpot">
            <when>$mi1=y or $mi3=y</when>
          </award>
          <award credit="0" name="zWrongSpot">
            <when>$mi1=z or $mi2=z</when>
          </award>
          </answer>
  `;

        await test_answer_multiple_inputs({
            doenetML,
            answerName: "a",
            answers: [
                {
                    values: ["", "", ""],
                    credit: 0,
                    awardsUsed: ["NothingRight"],
                },
                {
                    values: ["z", "", ""],
                    credit: 0,
                    awardsUsed: ["NothingRight", "zWrongSpot"],
                },
                {
                    values: ["z", "y", ""],
                    credit: 1 / 3,
                    awardsUsed: ["right", "zWrongSpot"],
                },
                {
                    values: ["z", "y", "x"],
                    credit: 1 / 3,
                    awardsUsed: ["right", "xWrongSpot", "zWrongSpot"],
                },
                {
                    values: ["y", "y", "x"],
                    credit: 1 / 3,
                    awardsUsed: ["right", "xWrongSpot", "yWrongSpot"],
                },
                {
                    values: ["y", "z", "x"],
                    credit: 0,
                    awardsUsed: ["NothingRight", "xWrongSpot", "yWrongSpot"],
                },
                {
                    values: ["y", "y", "z"],
                    credit: 2 / 3,
                    awardsUsed: ["right", "yWrongSpot"],
                },
                {
                    values: ["x", "y", "z"],
                    credit: 1,
                    awardsUsed: ["right"],
                },
            ],
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
                { type: "math", name: "mi3" },
            ],
        });
    });

    it("answer with choiceInput inside invalid child logic", async () => {
        const doenetML = `
  <problem>
    <sideBySide>
    
      <choiceInput name='choice1'>
        <choice>1</choice>
        <choice>2</choice>
        <choice>3</choice>
        <choice>4</choice>
        <choice>5</choice>
      </choiceInput>
    
    </sideBySide>
    
    <answer name="answer1">
      <award><when>$choice1.selectedValue = 4</when></award>
    </answer>
  
  </problem>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["4"], credit: 1 },
                { choices: ["3"], credit: 0 },
            ],
            indexByName: {
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
            },
            choiceInputName: "choice1",
            skipInitialCheck: true, // avoid dealing with case where start with math expressions for current responses
        });
    });

    it("maximum number of attempts", async () => {
        const doenetML = `<answer name="answer1" maxNumAttempts="2">x</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x", credit: 1 },
                { latex: "y", credit: 0 },
                { latex: "x", credit: 0, submissionPrevented: true },
                { latex: "y", credit: 0, submissionPrevented: true },
            ],
        });

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "y", credit: 0 },
                { latex: "x", credit: 1 },
                { latex: "y", credit: 1, submissionPrevented: true },
                { latex: "x", credit: 1, submissionPrevented: true },
            ],
        });
    });

    it("disable after correct", async () => {
        const doenetML = `<answer name="answer1" disableAfterCorrect>x</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x", credit: 1 },
                { latex: "y", credit: 1, submissionPrevented: true },
                { latex: "x", credit: 1, submissionPrevented: true },
                { latex: "y", credit: 1, submissionPrevented: true },
            ],
        });

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "y", credit: 0 },
                { latex: "x", credit: 1 },
                { latex: "y", credit: 1, submissionPrevented: true },
                { latex: "x", credit: 1, submissionPrevented: true },
            ],
        });
    });

    it("award based on choice text", async () => {
        const doenetML = `
  <answer name="answer1">
    <choiceInput name="ci">
      <choice name="ca">cat</choice>
      <choice credit="1">dog</choice>
      <choice>monkey</choice>
    </choiceInput>
    <award><when>$ci = $ca.text</when></award>
  </answer>
  `;

        await test_choice_answer({
            doenetML,
            answers: [
                { choices: ["dog"], credit: 0 },
                { choices: ["cat"], credit: 1 },
                { choices: ["monkey"], credit: 0 },
            ],
            indexByName: {
                cat: 1,
                dog: 2,
                monkey: 3,
            },
            choiceInputName: "ci",
        });
    });

    it("error expressions are not matched", async () => {
        await test_math_answer({
            doenetML: `<answer name="answer1">x^</answer>`,
            answers: [
                { latex: "", credit: 0 },
                { latex: "x^", credit: 0 },
                { latex: "x^2", credit: 0 },
            ],
        });

        await test_math_answer({
            doenetML: `<answer name="answer1" symbolicEquality>x^</answer>`,
            answers: [
                { latex: "", credit: 0 },
                { latex: "x^", credit: 0 },
                { latex: "x^2", credit: 0 },
            ],
        });
    });

    it("default is to split symbols, sugared answer", async () => {
        const doenetML = `
<answer name="answer1">xyz</answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                {
                    latex: "xyza",
                    credit: 0,
                },
                { latex: "xyz", credit: 1 },
                { latex: "x y z", credit: 1 },
            ],
        });
    });

    it("default is to split symbols, shortcut award, sugared math", async () => {
        const doenetML = `
<answer name="answer1"><award>xyz</award></answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                {
                    latex: "xyza",
                    credit: 0,
                },
                { latex: "xyz", credit: 1 },
                { latex: "x y z", credit: 1 },
            ],
        });
    });

    it("default is to split symbols, explicit mathInput and math", async () => {
        const doenetML = `
<answer name="answer1">
    <mathInput name="mi" />
    <award><math>xyz</math></award>
</answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                {
                    latex: "xyza",
                    credit: 0,
                },
                { latex: "xyz", credit: 1 },
                { latex: "x y z", credit: 1 },
            ],
        });
    });

    it("with split symbols, specified directly on mathInput and math", async () => {
        const doenetML = `
<p>split symbols: <booleanInput name="split" /></p>
<p>Answer: <math name="ans" splitSymbols="$split">xyz</math></p>
<answer name="answer1">
    <mathInput name="mi" splitSymbols="$ans.splitSymbols" />
    <award>$ans</award>
</answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
                {
                    latex: "xyza",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "true",
                        name: "split",
                    },
                },
                { latex: "xyz", credit: 1 },
                { latex: "x y z", credit: 1 },
                {
                    latex: "xyzb",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "false",
                        name: "split",
                    },
                    overrideResponse: "xyzb",
                },
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
            ],
        });
    });

    it("with split symbols, sugared answer", async () => {
        const doenetML = `
<p>split symbols: <booleanInput name="split" /></p>
<answer splitSymbols="$split" name="answer1">xyz</answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
                {
                    latex: "xyza",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "true",
                        name: "split",
                    },
                },
                { latex: "xyz", credit: 1 },
                { latex: "x y z", credit: 1 },
                {
                    latex: "xyzb",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "false",
                        name: "split",
                    },
                    overrideResponse: "xyzb",
                },
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
            ],
        });
    });

    it("with split symbols, shortcut award, sugared math", async () => {
        const doenetML = `
  <p>split symbols: <booleanInput name="split" /></p>
  <answer splitSymbols="$split" name="answer1">
    <award>xyz</award>
  </answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
                {
                    latex: "xyza",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "true",
                        name: "split",
                    },
                },
                { latex: "xyz", credit: 1 },
                { latex: "x y z", credit: 1 },
                {
                    latex: "xyzb",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "false",
                        name: "split",
                    },
                    overrideResponse: "xyzb",
                },
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
            ],
        });
    });

    it("with split symbols, explicit mathInput and math, but inferred split symbols", async () => {
        const doenetML = `
  <p>split symbols: <booleanInput name="split" /></p>
  <answer splitSymbols="$split" name="answer1">
    <mathInput name="mi" />
    <award><math name="ans">xyz</math></award>
  </answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
                {
                    latex: "xyza",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "true",
                        name: "split",
                    },
                },
                { latex: "xyz", credit: 1 },
                { latex: "x y z", credit: 1 },
                {
                    latex: "xyzb",
                    credit: 0,
                    preAction: {
                        type: "boolean",
                        value: "false",
                        name: "split",
                    },
                    overrideResponse: "xyzb",
                },
                { latex: "xyz", credit: 1, overrideResponse: "xyz" },
                { latex: "x y z", credit: 0 },
            ],
        });
    });

    it("justSubmitted with expression containing NaN", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <answer name="a"><mathInput name="mi" /><award><math><number>0/0</number>+1</math></award></answer>
   `,
        });

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        // submit
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);
    });

    it("copy justSubmitted attribute", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <answer name="ans">
    <mathInput name="mi" />
    <award>1</award>
  </answer>
  <conditionalContent condition="$ans.justSubmitted" name="cond"><p>The answer was just submitted.</p></conditionalContent>
   `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond")].replacements,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        // submit
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("cond")].replacements,
        ).eqls([
            {
                componentIdx: await resolvePathToNodeIdx("cond[1]"),
                componentType: "group",
            },
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond")]
                .replacementsToWithhold,
        ).eq(0);

        expect(
            stateVariables[await resolvePathToNodeIdx("cond[1][1]")].stateValues
                .text,
        ).eq("The answer was just submitted.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("cond")].replacements,
        ).eqls([
            {
                componentIdx: await resolvePathToNodeIdx("cond[1]"),
                componentType: "group",
            },
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond")]
                .replacementsToWithhold,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        // submit
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("cond")]
                .replacementsToWithhold,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond")].replacements,
        ).eqls([
            {
                componentIdx: await resolvePathToNodeIdx("cond[1]"),
                componentType: "group",
            },
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond")]
                .replacementsToWithhold,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond[1][1]")].stateValues
                .text,
        ).eq("The answer was just submitted.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputImmediateValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond")].replacements,
        ).eqls([
            {
                componentIdx: await resolvePathToNodeIdx("cond[1]"),
                componentType: "group",
            },
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("cond")]
                .replacementsToWithhold,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
    });

    it.skip("empty mathLists always equal", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <answer name="ans1">
        <award>
            <when>
            <mathList/> = <mathList/>
            </when>
        </award>
    </answer>
    <answer name="ans2">
        <award>
        <when unorderedCompare>
            <mathList/> = <mathList/>
        </when>
        </award>
    </answer>
    <answer name="ans3">
        <award>
        <when matchPartial>
            <mathList/> = <mathList/>
        </when>
        </award>
    </answer>
    <answer name="ans4">
        <award>
        <when unorderedCompare matchPartial>
            <mathList/> = <mathList/>
        </when>
        </award>
    </answer>`,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans3"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans4"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans3")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans4")].stateValues
                .creditAchieved,
        ).eq(1);
    });

    it("cannot change submitted or changed response", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <answer name="a"><mathInput name="mia" />x</answer>

  <p>Current Response: <math extend="$a.currentResponse" name="cr" /></p>
  <p>Submitted Response: <math extend="$a.submittedResponse" name="sr" /></p>
  
  <p>Change current response: <mathInput bindValueTo="$a.currentResponse" name="micr" /></p>
  <p>Change submitted response: <mathInput bindValueTo="$a.submittedResponse" name="misr"  /></p>
   `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("cr")].stateValues.value
                .tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("sr")].stateValues.value
                .tree,
        ).eq("\uff3f");

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("micr"),
            core,
        });
        await updateMathInputValue({
            latex: "z",
            componentIdx: await resolvePathToNodeIdx("misr"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("cr")].stateValues.value
                .tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("sr")].stateValues.value
                .tree,
        ).eq("\uff3f");

        // submit response
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mia"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("cr")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("sr")].stateValues.value
                .tree,
        ).eq("x");

        // cannot change from mathInputs

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("micr"),
            core,
        });
        await updateMathInputValue({
            latex: "z",
            componentIdx: await resolvePathToNodeIdx("misr"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("cr")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("sr")].stateValues.value
                .tree,
        ).eq("x");
    });

    it("answer award with sugared string, copy award and overwrite properties", async () => {
        const doenetML = `
<answer name="an">
    <award name="aw">1.1</award>
    <award extend="$aw" name="aw2" credit="0.5" allowedErrorInNumbers="0.001" />
</answer>
  `;

        await test_math_answer({
            doenetML,
            answerName: "an",
            answers: [
                { latex: "", credit: 0, awardsUsed: [] },
                { latex: "1.1", credit: 1, awardsUsed: ["aw"] },
                { latex: "1.11", credit: 0, awardsUsed: [] },
                { latex: "1.101", credit: 0.5, awardsUsed: ["aw2"] },
            ],
        });
    });

    it("answer award with full award, copy award and overwrite properties", async () => {
        const doenetML = `
<answer name="an">
    <mathInput name="mi" />
    <award name="aw"><when>$mi=1.1</when></award>
    <award extend="$aw" name="aw2" credit="0.5" allowedErrorInNumbers="0.001" />
</answer>
  `;

        await test_math_answer({
            doenetML,
            answerName: "an",
            answers: [
                { latex: "", credit: 0, awardsUsed: [] },
                { latex: "1.1", credit: 1, awardsUsed: ["aw"] },
                { latex: "1.11", credit: 0, awardsUsed: [] },
                { latex: "1.101", credit: 0.5, awardsUsed: ["aw2"] },
            ],
        });
    });

    it("copied answer mirrors original", async () => {
        const doenetML = `
  <answer name="ans1">x+y</answer>
  <answer extend="$ans1" name="ans2" />
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const mathInput1Idx =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .inputChildren[0].componentIdx;

        const mathInput2Idx =
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .inputChildren[0].componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .submittedResponses,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .submittedResponses,
        ).eqls([]);

        // Type correct answer in first blank
        await updateMathInputValue({
            latex: "x+y",
            componentIdx: mathInput1Idx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .submittedResponses,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .submittedResponses,
        ).eqls([]);

        // submit second answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);

        // type incorrect answer into second blank
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInput2Idx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);

        // submit first answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls(["x"]);
    });

    it("copy answer with no link", async () => {
        const doenetML = `
  <answer name="ans1">x+y</answer>
  <answer extend="$ans1" name="ans2" link="false" />
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const mathInput1Idx =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .inputChildren[0].componentIdx;

        const mathInput2Idx =
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .inputChildren[0].componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .submittedResponses,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .submittedResponses,
        ).eqls([]);

        // Type correct answer in first blank
        await updateMathInputValue({
            latex: "x+y",
            componentIdx: mathInput1Idx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .submittedResponses,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .submittedResponses,
        ).eqls([]);

        // submit first answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .submittedResponses,
        ).eqls([]);

        // type correct answer into second blank
        await updateMathInputValue({
            latex: "x+y",
            componentIdx: mathInput2Idx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .submittedResponses,
        ).eqls([]);

        // submit second answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);

        // type incorrect answer into second blank
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInput2Idx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);

        // submit second answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls(["x"]);

        // type incorrect answer into first blank
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInput1Idx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls([["+", "x", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls(["x"]);

        // submit first answer
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans1")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.currentResponses.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ans2")
            ].stateValues.submittedResponses.map((x) => x.tree),
        ).eqls(["x"]);
    });

    it("credit achieved not calculated before submit", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <answer name="ans">
    <award name="aw1">x^2-2x+3</award>
    <award name="aw2" credit="0.5" numSignErrorsMatched="1">x^2-2x+3</award>
  </answer>

  `,
        });

        function check_have_getter(stateVarObj, have_getter = true) {
            expect(
                Boolean(
                    //@ts-ignore
                    Object.getOwnPropertyDescriptor(stateVarObj, "value").get ||
                    stateVarObj.immutable,
                ),
            ).eq(have_getter);
        }

        let components = core.core!.components || {};

        const ansIdx = await resolvePathToNodeIdx("ans");
        const mathInputIdx =
            components[ansIdx].stateValues.inputChildren[0].componentIdx;

        expect(components[ansIdx].stateValues.justSubmitted).eq(false);
        expect(components[ansIdx].stateValues.creditAchieved).eq(0);
        expect(
            (await components[ansIdx].stateValues.currentResponses).map(
                (x) => x.tree,
            ),
        ).eqls(["\uff3f"]);
        expect(await components[ansIdx].stateValues.submittedResponses).eqls(
            [],
        );

        const award1Idx = await resolvePathToNodeIdx("aw1");
        const award2Idx = await resolvePathToNodeIdx("aw2");

        expect(await components[award1Idx].stateValues.creditAchieved).eq(0);
        expect(await components[award1Idx].stateValues.fractionSatisfied).eq(0);
        expect(await components[award2Idx].stateValues.creditAchieved).eq(0);
        expect(await components[award2Idx].stateValues.fractionSatisfied).eq(0);

        //check that have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit

        check_have_getter(components[award1Idx].state.creditAchievedIfSubmit);
        check_have_getter(
            components[award1Idx].state.fractionSatisfiedIfSubmit,
        );
        check_have_getter(components[award2Idx].state.creditAchievedIfSubmit);
        check_have_getter(
            components[award2Idx].state.fractionSatisfiedIfSubmit,
        );
        check_have_getter(components[ansIdx].state.creditAchievedIfSubmit);

        // type correct answer
        await updateMathInputValue({
            latex: "x^2-2x+3",
            componentIdx: mathInputIdx,
            core,
        });

        expect(components[ansIdx].stateValues.justSubmitted).eq(false);
        expect(components[ansIdx].stateValues.creditAchieved).eq(0);
        expect(
            (await components[ansIdx].stateValues.currentResponses).map((x) =>
                cleanLatex(x.toLatex()),
            ),
        ).eqls(["x^{2}-2x+3"]);
        expect(await components[ansIdx].stateValues.submittedResponses).eqls(
            [],
        );
        expect(await components[award1Idx].stateValues.creditAchieved).eq(0);
        expect(await components[award1Idx].stateValues.fractionSatisfied).eq(0);
        expect(await components[award2Idx].stateValues.creditAchieved).eq(0);
        expect(await components[award2Idx].stateValues.fractionSatisfied).eq(0);

        //check that still have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit

        check_have_getter(components[award1Idx].state.creditAchievedIfSubmit);
        check_have_getter(
            components[award1Idx].state.fractionSatisfiedIfSubmit,
        );
        check_have_getter(components[award2Idx].state.creditAchievedIfSubmit);
        check_have_getter(
            components[award2Idx].state.fractionSatisfiedIfSubmit,
        );
        check_have_getter(components[ansIdx].state.creditAchievedIfSubmit);

        //  submit

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        expect(components[ansIdx].stateValues.justSubmitted).eq(true);
        expect(components[ansIdx].stateValues.creditAchieved).eq(1);
        expect(
            (await components[ansIdx].stateValues.currentResponses).map((x) =>
                cleanLatex(x.toLatex()),
            ),
        ).eqls(["x^{2}-2x+3"]);
        expect(
            (await components[ansIdx].stateValues.submittedResponses).map((x) =>
                cleanLatex(x.toLatex()),
            ),
        ).eqls(["x^{2}-2x+3"]);

        // check that no longer have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit

        check_have_getter(
            components[award1Idx].state.creditAchievedIfSubmit,
            false,
        );
        check_have_getter(
            components[award1Idx].state.fractionSatisfiedIfSubmit,
            false,
        );
        check_have_getter(
            components[award2Idx].state.creditAchievedIfSubmit,
            false,
        );
        check_have_getter(
            components[award2Idx].state.fractionSatisfiedIfSubmit,
            false,
        );
        check_have_getter(
            components[ansIdx].state.creditAchievedIfSubmit,
            false,
        );

        expect(components[award1Idx].stateValues.creditAchievedIfSubmit).eq(1);
        expect(components[award1Idx].stateValues.fractionSatisfiedIfSubmit).eq(
            1,
        );
        expect(components[award2Idx].stateValues.creditAchievedIfSubmit).eq(
            0.5,
        );
        expect(components[award2Idx].stateValues.fractionSatisfiedIfSubmit).eq(
            1,
        );
        expect(components[ansIdx].stateValues.creditAchievedIfSubmit).eq(1);

        // type partially correct answer
        await updateMathInputValue({
            latex: "x^2-2x-3",
            componentIdx: mathInputIdx,
            core,
        });

        expect(components[ansIdx].stateValues.justSubmitted).eq(false);
        expect(components[ansIdx].stateValues.creditAchieved).eq(1);
        expect(
            (await components[ansIdx].stateValues.currentResponses).map((x) =>
                cleanLatex(x.toLatex()),
            ),
        ).eqls(["x^{2}-2x-3"]);
        expect(
            (await components[ansIdx].stateValues.submittedResponses).map((x) =>
                cleanLatex(x.toLatex()),
            ),
        ).eqls(["x^{2}-2x+3"]);
        expect(await components[award1Idx].stateValues.creditAchieved).eq(1);
        expect(await components[award1Idx].stateValues.fractionSatisfied).eq(1);
        expect(await components[award2Idx].stateValues.creditAchieved).eq(0.5);
        expect(await components[award2Idx].stateValues.fractionSatisfied).eq(1);

        //check that still have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit

        check_have_getter(components[award1Idx].state.creditAchievedIfSubmit);
        check_have_getter(
            components[award1Idx].state.fractionSatisfiedIfSubmit,
        );
        check_have_getter(components[award2Idx].state.creditAchievedIfSubmit);
        check_have_getter(
            components[award2Idx].state.fractionSatisfiedIfSubmit,
        );
        check_have_getter(components[ansIdx].state.creditAchievedIfSubmit);

        // submit

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        expect(components[ansIdx].stateValues.justSubmitted).eq(true);
        expect(components[ansIdx].stateValues.creditAchieved).eq(0.5);
        expect(
            (await components[ansIdx].stateValues.currentResponses).map((x) =>
                cleanLatex(x.toLatex()),
            ),
        ).eqls(["x^{2}-2x-3"]);
        expect(
            (await components[ansIdx].stateValues.submittedResponses).map((x) =>
                cleanLatex(x.toLatex()),
            ),
        ).eqls(["x^{2}-2x-3"]);

        // check that no longer have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit

        check_have_getter(
            components[award1Idx].state.creditAchievedIfSubmit,
            false,
        );
        check_have_getter(
            components[award1Idx].state.fractionSatisfiedIfSubmit,
            false,
        );
        check_have_getter(
            components[award2Idx].state.creditAchievedIfSubmit,
            false,
        );
        check_have_getter(
            components[award2Idx].state.fractionSatisfiedIfSubmit,
            false,
        );
        check_have_getter(
            components[ansIdx].state.creditAchievedIfSubmit,
            false,
        );

        expect(components[award1Idx].stateValues.creditAchievedIfSubmit).eq(0);
        expect(components[award1Idx].stateValues.fractionSatisfiedIfSubmit).eq(
            0,
        );
        expect(components[award2Idx].stateValues.creditAchievedIfSubmit).eq(
            0.5,
        );
        expect(components[award2Idx].stateValues.fractionSatisfiedIfSubmit).eq(
            1,
        );
        expect(components[ansIdx].stateValues.creditAchievedIfSubmit).eq(0.5);
    });

    it("short award and full award combined", async () => {
        const doenetML = `
  <graph>
    <point name="P" />
  </graph>
  <answer numAwardsCredited="2" name="a">
    <mathInput name="mi" />
    <award credit="0.6"><math>x^2</math></award>
    <award credit="0.4" referencesAreResponses="$P.x">
      <when>$P.x > 0</when>
    </award>
  </answer>
  `;

        await test_action_answer({
            doenetML,
            answerName: "a",
            originalEffectiveResponses: ["\uff3f", 0],
            answers: [
                {
                    preAction: {
                        type: "math",
                        name: "mi",
                        value: "x^2",
                    },
                    actionArgs: { x: 0, y: 0 },
                    actionName: "movePoint",
                    actionComponentName: "P",
                    effectiveResponses: [["^", "x", 2], 0],
                    credit: 0.6,
                },
                {
                    actionArgs: { x: 2, y: -7 },
                    actionName: "movePoint",
                    actionComponentName: "P",
                    effectiveResponses: [["^", "x", 2], 2],
                    credit: 1,
                },
                {
                    preAction: {
                        type: "math",
                        name: "mi",
                        value: "y^2",
                    },
                    actionArgs: { x: 2, y: -7 },
                    actionName: "movePoint",
                    actionComponentName: "P",
                    effectiveResponses: [["^", "y", 2], 2],
                    credit: 0.4,
                },
            ],
        });
    });

    it("derivative works without award", async () => {
        const doenetML = `
What is the derivative of <function name="f">x^2</function>?
<answer name="answer1"><derivative>$f</derivative></answer>
  `;
        await test_math_answer({
            doenetML,
            answers: [
                { latex: "2x", credit: 1 },
                { latex: "2x/2", credit: 0 },
            ],
        });
    });

    it("case-insensitive match, math", async () => {
        await test_math_answer({
            doenetML: `<answer name="defSugar">x+Y</answer>`,
            answers: [
                { latex: "x+y", credit: 0 },
                { latex: "x+Y", credit: 1 },
                { latex: "X+Y", credit: 0 },
                { latex: "X", credit: 0 },
                { latex: "X+y", credit: 0 },
            ],
            answerName: "defSugar",
        });

        await test_math_answer({
            doenetML: `<answer caseInsensitiveMatch name="insSugar">x+Y</answer>`,
            answers: [
                { latex: "x+y", credit: 1 },
                { latex: "x+Y", credit: 1 },
                { latex: "X+Y", credit: 1 },
                { latex: "X", credit: 0 },
                { latex: "X+y", credit: 1 },
            ],
            answerName: "insSugar",
        });

        await test_math_answer({
            doenetML: `
    <answer name="shortAwards">
      <award>x+Y</award>
      <award caseInsensitiveMatch credit="0.5">x+Y</award>
    </answer>`,
            answers: [
                { latex: "x+y", credit: 0.5 },
                { latex: "x+Y", credit: 1 },
                { latex: "X+Y", credit: 0.5 },
                { latex: "X", credit: 0 },
                { latex: "X+y", credit: 0.5 },
            ],
            answerName: "shortAwards",
        });

        await test_math_answer({
            doenetML: `
    <answer name="full">
      <mathInput name="mi" />
      <award><when>$mi = x+Y</when></award>
      <award credit="0.5"><when caseInsensitiveMatch>$mi = x+Y</when></award>
    </answer>`,
            answers: [
                { latex: "x+y", credit: 0.5 },
                { latex: "x+Y", credit: 1 },
                { latex: "X+Y", credit: 0.5 },
                { latex: "X", credit: 0 },
                { latex: "X+y", credit: 0.5 },
            ],
            answerName: "full",
        });
    });

    it("case-insensitive match, text", async () => {
        await test_text_answer({
            doenetML: `<answer type="text" name="defSugar">Hello there!</answer>`,
            answers: [
                { text: "hello there!", credit: 0 },
                { text: "Hello there!", credit: 1 },
                { text: "Hello There!", credit: 0 },
                { text: "Hello", credit: 0 },
                { text: "hello There!", credit: 0 },
            ],
            answerName: "defSugar",
        });

        await test_text_answer({
            doenetML: `<answer type="text" caseInsensitiveMatch name="insSugar">Hello there!</answer>`,
            answers: [
                { text: "hello there!", credit: 1 },
                { text: "Hello there!", credit: 1 },
                { text: "Hello There!", credit: 1 },
                { text: "Hello", credit: 0 },
                { text: "hello There!", credit: 1 },
            ],
            answerName: "insSugar",
        });

        await test_text_answer({
            doenetML: `
    <answer type="text" name="shortAwards">
      <award>Hello there!</award>
      <award caseInsensitiveMatch credit="0.5">Hello there!</award>
    </answer>`,
            answers: [
                { text: "hello there!", credit: 0.5 },
                { text: "Hello there!", credit: 1 },
                { text: "Hello There!", credit: 0.5 },
                { text: "Hello", credit: 0 },
                { text: "hello There!", credit: 0.5 },
            ],
            answerName: "shortAwards",
        });

        await test_text_answer({
            doenetML: `
    <answer name="full">
      <textInput name="ti" />
      <award><when>$ti = <text>Hello there!</text></when></award>
      <award credit="0.5"><when caseInsensitiveMatch>$ti = <text>Hello there!</text></when></award>
    </answer>`,
            answers: [
                { text: "hello there!", credit: 0.5 },
                { text: "Hello there!", credit: 1 },
                { text: "Hello There!", credit: 0.5 },
                { text: "Hello", credit: 0 },
                { text: "hello There!", credit: 0.5 },
            ],
            answerName: "full",
        });
    });

    it("match blanks", async () => {
        await test_math_answer({
            doenetML: `<answer name="defSugar">_6^14C</answer>`,
            answers: [
                { latex: "C_6^{14}", credit: 0 },
                { latex: "_6^{14}C", credit: 0 },
            ],
            answerName: "defSugar",
        });

        await test_math_answer({
            doenetML: `<answer matchBlanks name="blankSugar">_6^14C</answer>`,
            answers: [
                { latex: "C_6^{14}", credit: 0 },
                { latex: "_6^{14}C", credit: 1 },
            ],
            answerName: "blankSugar",
        });

        await test_math_answer({
            doenetML: `<answer name="defShort"><award>_6^14C</award></answer>`,
            answers: [
                { latex: "C_6^{14}", credit: 0 },
                { latex: "_6^{14}C", credit: 0 },
            ],
            answerName: "defShort",
        });

        await test_math_answer({
            doenetML: `<answer name="blankShort" matchBlanks><award>_6^14C</award></answer>`,
            answers: [
                { latex: "C_6^{14}", credit: 0 },
                { latex: "_6^{14}C", credit: 1 },
            ],
            answerName: "blankShort",
        });

        await test_math_answer({
            doenetML: `
    <answer name="defFull">
      <mathInput name="mi" />
      <award><when>$mi = _6^14C</when></award>
    </answer>`,
            answers: [
                { latex: "C_6^{14}", credit: 0 },
                { latex: "_6^{14}C", credit: 0 },
            ],
            answerName: "defFull",
        });

        await test_math_answer({
            doenetML: `
    <answer name="blankFull">
      <mathInput name="mi" />
      <award><when matchBlanks>$mi = _6^14C</when></award>
    </answer>`,
            answers: [
                { latex: "C_6^{14}", credit: 0 },
                { latex: "_6^{14}C", credit: 1 },
            ],
            answerName: "blankFull",
        });
    });

    it("submitted responses from copy source", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  
  <p><answer name="x"><mathInput name="mi"/>x</answer> 
    <math name="xsr" extend="$x" />
    <math name="xcr" extend="$x.currentResponse" />
  </p>
  <p><answer name="hello" type="text"><textInput name="ti"/>hello</answer>
    <text name="hellosr" extend="$hello" />
    <text name="hellocr" extend="$hello.currentResponse" />
  </p>
  <p><answer name="b" type="boolean"><booleanInput name="bi"/>true</answer> 
    <boolean name="bsr" extend="$b" />
    <boolean name="bcr" extend="$b.currentResponse" />
  </p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("xsr")].stateValues.value
                .tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("xcr")].stateValues.value
                .tree,
        ).eq("\uff3f");

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("xsr")].stateValues.value
                .tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("xcr")].stateValues.value
                .tree,
        ).eq("x");

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("xsr")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("xcr")].stateValues.value
                .tree,
        ).eq("x");

        expect(
            stateVariables[await resolvePathToNodeIdx("hellosr")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("hellocr")].stateValues
                .value,
        ).eq("");

        await updateTextInputValue({
            text: "hello",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("hellosr")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("hellocr")].stateValues
                .value,
        ).eq("hello");

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("hello"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("hellosr")].stateValues
                .value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("hellocr")].stateValues
                .value,
        ).eq("hello");

        expect(
            stateVariables[await resolvePathToNodeIdx("bsr")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("bcr")].stateValues.value,
        ).eq(false);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("bsr")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("bcr")].stateValues.value,
        ).eq(true);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("bsr")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bcr")].stateValues.value,
        ).eq(true);
    });

    it("parse scientific notation", async () => {
        await test_math_answer({
            doenetML: `<answer name="ans">4E3</answer>`,
            answers: [
                { latex: "4E3", credit: 1 },
                { latex: "4000", credit: 0 },
            ],
            answerName: "ans",
        });

        await test_math_answer({
            doenetML: `<answer name="ans"><math>4E3</math></answer>`,
            answers: [
                { latex: "4E3", credit: 1 },
                { latex: "4000", credit: 0 },
            ],
            answerName: "ans",
        });

        await test_math_answer({
            doenetML: `<answer name="ans"><award><math>4E3</math></award></answer>`,
            answers: [
                { latex: "4E3", credit: 1 },
                { latex: "4000", credit: 0 },
            ],
            answerName: "ans",
        });

        await test_math_answer({
            doenetML: `<answer name="ans"><mathInput name="mi" /><award><when><math>4E3</math>=$mi</when></award></answer>`,
            answers: [
                { latex: "4E3", credit: 1 },
                { latex: "4000", credit: 0 },
            ],
            answerName: "ans",
        });

        await test_math_answer({
            doenetML: `<answer parseScientificNotation name="ans">4E3</answer>`,
            answers: [
                { latex: "4E3", credit: 1, overrideResponse: 4000 },
                { latex: "4000", credit: 1 },
            ],
            answerName: "ans",
        });

        await test_math_answer({
            doenetML: `<answer parseScientificNotation name="ans"><math>4E3</math></answer>`,
            answers: [
                { latex: "4E3", credit: 1, overrideResponse: 4000 },
                { latex: "4000", credit: 1 },
            ],
            answerName: "ans",
        });

        await test_math_answer({
            doenetML: `<answer parseScientificNotation name="ans"><award><math>4E3</math></award></answer>`,
            answers: [
                { latex: "4E3", credit: 1, overrideResponse: 4000 },
                { latex: "4000", credit: 1 },
            ],
            answerName: "ans",
        });

        await test_math_answer({
            doenetML: `<answer parseScientificNotation name="ans"><mathInput name="mi" /><award><when><math parseScientificNotation>4E3</math>=$mi</when></award></answer>`,
            answers: [
                { latex: "4E3", credit: 1, overrideResponse: 4000 },
                { latex: "4000", credit: 1 },
            ],
            answerName: "ans",
        });
    });

    it("submitted response from matrixInput", async () => {
        const doenetML = `
  <answer name="ans">
    <matrixInput name="mi" numColumns="2" numRows="2" showSizeControls="false" />
    <award><matrix><row>a b</row><row>c d</row></matrix></award>
  </answer>
  `;

        let fromLatex = latexToMathFactory();
        await test_matrix_answer({
            doenetML,
            answerName: "ans",
            originalEffectiveResponse: fromLatex(
                "\\begin{matrix}{}&{}\\\\{}&{}\\end{matrix}",
            ).tree,
            answers: [
                {
                    entries: [{ latex: "x", rowInd: 0, colInd: 0 }],
                    credit: 0,
                    overrideResponse: fromLatex(
                        "\\begin{matrix}x&{}\\\\{}&{}\\end{matrix}",
                    ).tree,
                },
                {
                    entries: [
                        { latex: "y", rowInd: 0, colInd: 1 },
                        { latex: "z", rowInd: 1, colInd: 0 },
                        { latex: "0", rowInd: 1, colInd: 1 },
                    ],
                    credit: 0,
                    overrideResponse: fromLatex(
                        "\\begin{matrix}x&y\\\\z&0\\end{matrix}",
                    ).tree,
                },
                {
                    entries: [
                        { latex: "a", rowInd: 0, colInd: 0 },
                        { latex: "b", rowInd: 0, colInd: 1 },
                        { latex: "c", rowInd: 1, colInd: 0 },
                        { latex: "d", rowInd: 1, colInd: 1 },
                    ],
                    credit: 1,
                    overrideResponse: fromLatex(
                        "\\begin{matrix}a&b\\\\c&d\\end{matrix}",
                    ).tree,
                },
            ],
        });
    });

    it("a function defined by formula uses formula for a response", async () => {
        const doenetML = `
<p>Type the function <m>f(x) = <function name="correctFunction">x^2</function></m></p>
<p><m>f(x) = </m><mathInput name="userFormula"/>
<function hide name="userFunction">$userFormula</function>
</p>


<answer name="answer1">
    <award>
      <when><function extend="$userFunction" isResponse /> = $correctFunction</when>
    </award>
</answer>`;

        await test_math_answer({
            doenetML,
            answers: [
                { latex: "x^2", credit: 1 },
                { latex: "3x^2", credit: 0 },
            ],
            mathInputName: "userFormula",
        });
    });

    it("hand-graded answers", async () => {
        await test_math_answer({
            doenetML: `<answer handGraded name="a" />`,
            answers: [
                { latex: "x", credit: 0 },
                { latex: "y", credit: 0 },
            ],
            answerName: "a",
        });
        await test_math_answer({
            doenetML: `<answer handGraded name="a" type="math" />`,
            answers: [
                { latex: "x", credit: 0 },
                { latex: "y", credit: 0 },
            ],
            answerName: "a",
        });
        await test_math_answer({
            doenetML: `<answer handGraded name="a"><mathInput /></answer>`,
            answers: [
                { latex: "x", credit: 0 },
                { latex: "y", credit: 0 },
            ],
            answerName: "a",
        });
        await test_math_answer({
            doenetML: `<answer handGraded name="a">x</answer>`,
            answers: [
                { latex: "x", credit: 0 },
                { latex: "y", credit: 0 },
            ],
            answerName: "a",
        });
        await test_math_answer({
            doenetML: `<answer handGraded name="a"><math>x</math></answer>`,
            answers: [
                { latex: "x", credit: 0 },
                { latex: "y", credit: 0 },
            ],
            answerName: "a",
        });
        await test_math_answer({
            doenetML: `<answer handGraded name="a"><award><math>x</math></award></answer>`,
            answers: [
                { latex: "x", credit: 0 },
                { latex: "y", credit: 0 },
            ],
            answerName: "a",
        });
        await test_math_answer({
            doenetML: `<answer handGraded name="a"><mathInput /><award><math>x</math></award></answer>`,
            answers: [
                { latex: "x", credit: 0 },
                { latex: "y", credit: 0 },
            ],
            answerName: "a",
        });

        await test_text_answer({
            doenetML: `<answer handGraded name="a" type="text" />`,
            answers: [
                { text: "hello", credit: 0 },
                { text: "bye", credit: 0 },
            ],
            answerName: "a",
        });
        await test_text_answer({
            doenetML: `<answer handGraded name="a"><textInput/></answer>`,
            answers: [
                { text: "hello", credit: 0 },
                { text: "bye", credit: 0 },
            ],
            answerName: "a",
        });
        await test_text_answer({
            doenetML: `<answer handGraded name="a"><text>hello</text></answer>`,
            answers: [
                { text: "hello", credit: 0 },
                { text: "bye", credit: 0 },
            ],
            answerName: "a",
        });
        await test_text_answer({
            doenetML: `<answer handGraded name="a"><award><text>hello</text></award></answer>`,
            answers: [
                { text: "hello", credit: 0 },
                { text: "bye", credit: 0 },
            ],
            answerName: "a",
        });

        await test_answer_multiple_inputs({
            doenetML: `<answer handGraded name="a"><mathInput /><mathInput /></answer>`,
            answers: [
                { values: ["x", "a"], credit: 0 },
                { values: ["y", "b"], credit: 0 },
            ],
            answerName: "a",
            inputs: [{ type: "math" }, { type: "math" }],
        });

        await test_answer_multiple_inputs({
            doenetML: `<answer handGraded name="a"><textInput /><textInput /></answer>`,
            answers: [
                { values: ["hello", "there"], credit: 0 },
                { values: ["bye", "now"], credit: 0 },
            ],
            answerName: "a",
            inputs: [{ type: "text" }, { type: "text" }],
        });

        await test_answer_multiple_inputs({
            doenetML: `<answer handGraded name="a"><mathInput /><textInput /></answer>`,
            answers: [
                { values: ["x", "hello"], credit: 0 },
                { values: ["y", "bye"], credit: 0 },
            ],
            answerName: "a",
            inputs: [{ type: "math" }, { type: "text" }],
        });

        await test_answer_multiple_inputs({
            doenetML: `<mathInput name="mi1" /><mathInput name="mi2" /><answer handGraded name="a"><considerAsResponses>$mi1$mi2</considerAsResponses></answer>`,
            answers: [
                { values: ["x", "a"], credit: 0 },
                { values: ["y", "b"], credit: 0 },
            ],
            answerName: "a",
            inputs: [
                { type: "math", name: "mi1" },
                { type: "math", name: "mi2" },
            ],
        });

        await test_answer_multiple_inputs({
            doenetML: `<textInput name="ti1" /><textInput name="ti2" /><answer handGraded name="a"><considerAsResponses>$ti1$ti2</considerAsResponses></answer>`,
            answers: [
                { values: ["hello", "there"], credit: 0 },
                { values: ["bye", "now"], credit: 0 },
            ],
            answerName: "a",
            inputs: [
                { type: "text", name: "ti1" },
                { type: "text", name: "ti2" },
            ],
        });

        await test_answer_multiple_inputs({
            doenetML: `<mathInput name="mi" /><textInput name="ti" /><answer handGraded name="a"><considerAsResponses>$mi$ti</considerAsResponses></answer>`,
            answers: [
                { values: ["x", "hello"], credit: 0 },
                { values: ["y", "bye"], credit: 0 },
            ],
            answerName: "a",
            inputs: [
                { type: "math", name: "mi" },
                { type: "text", name: "ti" },
            ],
        });
    });

    it("display digits for credit achieved", async () => {
        const doenetML = `
  <p><answer name="default">
    <mathInput name="miDefault" />
    <award>x</award>
    <award credit="1/3">y</award>
  </answer>
  Credit: <number extend="$default.creditAchieved" name="default_credit" />
  </p>

  <p><answer displayDigitsForCreditAchieved="8" name="long">
    <mathInput name="miLong" />
    <award>x</award>
    <award credit="1/3">y</award>
  </answer>
  Credit: <number extend="$long.creditAchieved" name="long_credit" />
  </p>
`;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("miDefault"),
            core,
        });
        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("miLong"),
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("default"),
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("long"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("default_credit")]
                .stateValues.valueForDisplay,
        ).eq(0.333);
        expect(
            stateVariables[await resolvePathToNodeIdx("long_credit")]
                .stateValues.valueForDisplay,
        ).eq(0.33333333);
    });

    it("display digits for responses", async () => {
        const doenetML = `
  <p><answer name="default">
    <mathInput name="miDefault" />
    1.23456789
  </answer
  >Current response: <math extend="$default.currentResponse" name="default_cr" />
  Submitted response: <math extend="$default.SubmittedResponse" name="default_sr" />
  
  </p>

  <p><answer displayDigitsForResponses="3" name="short">
    <mathInput name="miShort" />
    1.23456789
  </answer>
  >Current response: <math extend="$short.currentResponse" name="short_cr" />
  Submitted response: <math extend="$short.SubmittedResponse" name="short_sr" />
  </p>
`;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        await updateMathInputValue({
            latex: "1.23456789",
            componentIdx: await resolvePathToNodeIdx("miDefault"),
            core,
        });
        await updateMathInputValue({
            latex: "1.23456789",
            componentIdx: await resolvePathToNodeIdx("miShort"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("default_cr")].stateValues
                .valueForDisplay.tree,
        ).eq(1.23456789);
        expect(
            stateVariables[await resolvePathToNodeIdx("default_sr")].stateValues
                .valueForDisplay.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("short_cr")].stateValues
                .valueForDisplay.tree,
        ).eq(1.23);
        expect(
            stateVariables[await resolvePathToNodeIdx("short_sr")].stateValues
                .valueForDisplay.tree,
        ).eq("\uff3f");

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("default"),
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("short"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("default_cr")].stateValues
                .valueForDisplay.tree,
        ).eq(1.23456789);
        expect(
            stateVariables[await resolvePathToNodeIdx("default_sr")].stateValues
                .valueForDisplay.tree,
        ).eq(1.23456789);
        expect(
            stateVariables[await resolvePathToNodeIdx("short_cr")].stateValues
                .valueForDisplay.tree,
        ).eq(1.23);
        expect(
            stateVariables[await resolvePathToNodeIdx("short_sr")].stateValues
                .valueForDisplay.tree,
        ).eq(1.23);
    });

    it("display digits for responses, turn math to number", async () => {
        const doenetML = `
  <p><answer name="default">
    <mathInput name="miDefault" />
    1.23456789
  </answer
  >Current response: <number extend="$default.currentResponse" name="default_cr" />
  Submitted response: <number extend="$default.SubmittedResponse" name="default_sr" />
  
  </p>

  <p><answer displayDigitsForResponses="3" name="short">
    <mathInput name="miShort" />
    1.23456789
  </answer>
  >Current response: <number extend="$short.currentResponse" name="short_cr" />
  Submitted response: <number extend="$short.SubmittedResponse" name="short_sr" />
  </p>
`;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        await updateMathInputValue({
            latex: "1.23456789",
            componentIdx: await resolvePathToNodeIdx("miDefault"),
            core,
        });
        await updateMathInputValue({
            latex: "1.23456789",
            componentIdx: await resolvePathToNodeIdx("miShort"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("default_cr")].stateValues
                .valueForDisplay,
        ).eq(1.23456789);
        expect(
            stateVariables[await resolvePathToNodeIdx("default_sr")].stateValues
                .valueForDisplay,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("short_cr")].stateValues
                .valueForDisplay,
        ).eq(1.23);
        expect(
            stateVariables[await resolvePathToNodeIdx("short_sr")].stateValues
                .valueForDisplay,
        ).eqls(NaN);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("default"),
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("short"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("default_cr")].stateValues
                .valueForDisplay,
        ).eq(1.23456789);
        expect(
            stateVariables[await resolvePathToNodeIdx("default_sr")].stateValues
                .valueForDisplay,
        ).eq(1.23456789);
        expect(
            stateVariables[await resolvePathToNodeIdx("short_cr")].stateValues
                .valueForDisplay,
        ).eq(1.23);
        expect(
            stateVariables[await resolvePathToNodeIdx("short_sr")].stateValues
                .valueForDisplay,
        ).eq(1.23);
    });

    it("conditional text used as correct answer", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Enter a slope: <mathInput name="m" /></p>

  <p>If this is the slope at an equilibrium of a discrete dynamical system, the equilibrium is
  <answer name="a">
    <choiceInput name="ci" inline="true" shuffleOrder><choice>stable</choice><choice>unstable</choice></choiceInput>
    <award><when>
      $ci.selectedValue
      =
      <text>
        <conditionalContent condition="abs($m) < 1" >
          stable
        </conditionalContent>
        <conditionalContent condition="abs($m) > 1" >
          unstable
        </conditionalContent>
      </text>
    </when></award>
  </answer>
  </p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let indexByName = {};
        for (let [ind, val] of stateVariables[
            await resolvePathToNodeIdx("ci")
        ].stateValues.choiceTexts.entries()) {
            indexByName[val] = ind + 1;
        }

        async function submit_selection(name: string) {
            await updateSelectedIndices({
                componentIdx: await resolvePathToNodeIdx("ci"),
                selectedIndices: [indexByName[name]],
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("a"),
                core,
            });
        }

        await submit_selection("stable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);
        await submit_selection("unstable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await submit_selection("stable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);
        await submit_selection("unstable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            latex: "-0.8",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await submit_selection("stable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(1);
        await submit_selection("unstable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            latex: "1/3",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await submit_selection("stable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(1);
        await submit_selection("unstable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            latex: "-7/5",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await submit_selection("stable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);
        await submit_selection("unstable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await submit_selection("stable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);
        await submit_selection("unstable");
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(0);
    });

    it("conditional math used as correct answer", async () => {
        const doenetML = `
  <p>Require <choiceInput inline="true" name="c"><choice>positive</choice><choice>negative</choice></choiceInput>.</p>

  <p>Condition on <m>x</m>:
  <answer name="a">
    <mathInput name="x" />
    <award><when>
      $x
      =
      <math>
        <conditionalContent condition="$c = positive" >
          x > 0
        </conditionalContent>
        <conditionalContent condition="$c = negative" >
          x < 0
        </conditionalContent>
      </math>
    </when></award>
  </answer>
  </p>
  `;

        await test_math_answer({
            doenetML,
            answerName: "a",
            answers: [
                { latex: "x > 0", credit: 0 },
                { latex: "x < 0", credit: 0 },
                {
                    latex: "x < 0",
                    credit: 1,
                    preAction: {
                        name: "c",
                        type: "choice",
                        value: "2",
                    },
                },
                { latex: "x > 0", credit: 0 },
                {
                    latex: "x > 0",
                    credit: 1,
                    preAction: {
                        name: "c",
                        type: "choice",
                        value: "1",
                    },
                },
                { latex: "x < 0", credit: 0 },
            ],
        });
    });

    it("bugfix: answer with select in award", async () => {
        const doenetML = `
    <select name="c">30</select>

    <mathInput name="userAns" />

    <answer name="ans">
        <award name="correct">
        <when>$userAns = $c</when> </award>
    </answer>
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("userAns"),
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
    });

    it("credit by attempt", async () => {
        const doenetML = `
    <answer name="ans" creditByAttempt="1 0.8 0.7">x</answer>
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const answerIdx = await resolvePathToNodeIdx("ans");
        const mathInputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(1);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(0);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(0);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(1);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(1);

        // resubmitting correct answer does not reduce credit
        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputIdx,
            core,
        });
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(2);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(0);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(0);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(1);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(1);

        // submit incorrect answer
        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(3);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(1);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(0);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(1);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.8);

        // credit for correct answer is reduced
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(4);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(1);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(1);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.8);

        // resubmitting correct answer does not reduce credit
        await updateMathInputValue({
            latex: "z",
            componentIdx: mathInputIdx,
            core,
        });
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(5);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(1);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(1);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.8);

        // submit incorrect answer
        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(6);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(2);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(1);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.7);

        // credit for correct answer is further reduced
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0.7);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(7);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(2);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(2);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(0.7);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.7);

        // submit incorrect answer
        await updateMathInputValue({
            latex: "z",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(8);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(3);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(2);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(0.7);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.7);

        // credit for correct answer is not reduced further
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0.7);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(9);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(3);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(3);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(0.7);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.7);
    });

    it("credit by attempt, disable after correct", async () => {
        const doenetML = `
    <answer name="ans" disableAfterCorrect creditByAttempt="1 0.8 0.7">x</answer>
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const answerIdx = await resolvePathToNodeIdx("ans");
        const mathInputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;

        // submit incorrect answer
        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(1);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(1);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(0);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(1);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.disabled).eq(false);

        // credit for correct answer is reduced
        // answer is still disabled
        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.numSubmissions).eq(2);
        expect(
            stateVariables[answerIdx].stateValues.numIncorrectSubmissions,
        ).eq(1);
        expect(
            stateVariables[answerIdx].stateValues
                .numPreviousIncorrectSubmissions,
        ).eq(1);
        expect(stateVariables[answerIdx].stateValues.creditFactorUsed).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.nextCreditFactor).eq(0.8);
        expect(stateVariables[answerIdx].stateValues.disabled).eq(true);
    });

    it("disable wrong choices", async () => {
        const doenetML = `
    <answer name="ans" disableWrongChoices>
        <choice>A</choice>
        <choice credit="1">B</choice>
        <choice>C</choice>
    </answer>
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const answerIdx = await resolvePathToNodeIdx("ans");
        const choiceInputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;
        const choiceIndices = stateVariables[choiceInputIdx].activeChildren.map(
            (child) => child.componentIdx,
        );

        expect(
            choiceIndices.map(
                (idx) => stateVariables[idx].stateValues.disabled,
            ),
        ).eqls([false, false, false]);

        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0);
        expect(
            choiceIndices.map(
                (idx) => stateVariables[idx].stateValues.disabled,
            ),
        ).eqls([false, false, false]);

        // submit correct answer
        await updateSelectedIndices({
            componentIdx: choiceInputIdx,
            selectedIndices: [2],
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
        expect(
            choiceIndices.map(
                (idx) => stateVariables[idx].stateValues.disabled,
            ),
        ).eqls([false, false, false]);

        // submitting incorrect answer disables choice
        await updateSelectedIndices({
            componentIdx: choiceInputIdx,
            selectedIndices: [1],
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0);
        expect(
            choiceIndices.map(
                (idx) => stateVariables[idx].stateValues.disabled,
            ),
        ).eqls([true, false, false]);

        // submit correct answer again
        await updateSelectedIndices({
            componentIdx: choiceInputIdx,
            selectedIndices: [2],
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
        expect(
            choiceIndices.map(
                (idx) => stateVariables[idx].stateValues.disabled,
            ),
        ).eqls([true, false, false]);

        // submit other incorrect answer disables that choice
        await updateSelectedIndices({
            componentIdx: choiceInputIdx,
            selectedIndices: [3],
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0);
        expect(
            choiceIndices.map(
                (idx) => stateVariables[idx].stateValues.disabled,
            ),
        ).eqls([true, false, true]);
    });

    it("warning if no description or label when generates input", async () => {
        let { core } = await createTestCore({
            doenetML: `
                <answer>x</answer>
                <answer type="text">hello</answer>
                <answer type="boolean">true</answer>
                <answer>
                    <choice credit="1">cat</choice>
                    <choice>dog</choice>
                    <choice>monkey</choice>
                </answer>
                <point name="P" /><answer><award><when>$P.x > 0</when></award></answer>
            `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(4);

        expect(errorWarnings.warnings[0].message).contain(
            `must have a short description or a label`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.line).eq(2);

        expect(errorWarnings.warnings[1].message).contain(
            `must have a short description or a label`,
        );
        expect(errorWarnings.warnings[1].position.start.line).eq(3);
        expect(errorWarnings.warnings[1].position.end.line).eq(3);

        expect(errorWarnings.warnings[2].message).contain(
            `must have a short description or a label`,
        );
        expect(errorWarnings.warnings[2].position.start.line).eq(4);
        expect(errorWarnings.warnings[2].position.end.line).eq(4);

        expect(errorWarnings.warnings[3].message).contain(
            `must have a short description or a label`,
        );
        expect(errorWarnings.warnings[3].position.start.line).eq(5);
        expect(errorWarnings.warnings[3].position.end.line).eq(9);
    });

    it("with no inputs, a label is optional", async () => {
        let { core } = await createTestCore({
            doenetML: `
        <answer>
            <label>Hello!</label>
            <award><when>true</when></award>
        </answer>
        <answer>
            <award><when>true</when></award>
        </answer>

            `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(0);
    });

    it("ignore initial blank string in answer sugar", async () => {
        // Fix bug where the initial blank string child of the answer
        // prevented the sugar from wrapping the text after the mathInput correctly.
        const doenetML = `
    <p><answer name="ans">
    <mathInput name="mi"><label>x</label></mathInput>
    x    
    </answer></p>
  `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
    });
});
