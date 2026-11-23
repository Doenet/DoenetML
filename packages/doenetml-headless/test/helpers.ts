import type { HeadlessCore } from "@doenet/utils";
import { createHeadlessCore } from "../src";

/**
 * Type `latex` into the math input `componentIdx` and commit it, with the two
 * actions a renderer sends (and `updateMathInputValue` in the worker's test
 * helpers dispatches).
 */
export async function typeMath(
    core: HeadlessCore,
    componentIdx: number,
    latex: string,
) {
    await core.dispatchAction({
        componentIdx,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
    });
    await core.dispatchAction({ componentIdx, actionName: "updateValue" });
}

export async function submitAnswerAt(core: HeadlessCore, componentIdx: number) {
    await core.dispatchAction({ componentIdx, actionName: "submitAnswer" });
}

/**
 * Run `work` on a fresh core for `doenetML`, and return the state the core
 * then reports, as a host would have stored it. Fixtures are made this way,
 * never written by hand.
 */
export async function stateAfter(
    doenetML: string,
    work: (core: HeadlessCore) => Promise<void>,
    {
        variantIndex = 1,
        flags,
    }: { variantIndex?: number; flags?: Record<string, unknown> } = {},
) {
    const core = await createHeadlessCore({ doenetML, variantIndex, flags });
    try {
        await work(core);
        return await core.serializeState();
    } finally {
        await core.terminate();
    }
}

export async function answerIdx(core: HeadlessCore, stableKey: string) {
    const answer = (await core.getAnswers()).find(
        (a) => a.stableKey === stableKey,
    );
    if (!answer) {
        throw Error(`No answer ${stableKey}`);
    }
    return answer;
}
