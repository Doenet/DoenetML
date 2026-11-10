import {
    cidFromText,
    type DiagnosticRecord,
    type HeadlessCoreFactory,
    type HeadlessSavedState,
    type Position,
} from "@doenet/utils";
import { defaultCoreFactory } from "./defaultCore";
import { HeadlessError } from "./errors";

export type GradeStateOptions = {
    /** Viewer flags to run the document with, as `DoenetViewer` takes them. */
    flags?: Record<string, unknown>;
    /**
     * The attempt the state is expected to belong to. When given, a state
     * that records a different attempt is refused.
     */
    attemptNumber?: number;
    /** The core to run. Defaults to the JavaScript core. */
    core?: HeadlessCoreFactory;
};

export type GradedAnswer = {
    /** The answer's stable key (`r[3].g.ans`), or `null` if it has none. */
    stableKey: string | null;
    /** Its index in the core that graded it. Not stable; do not store it. */
    componentIdx: number;
    componentType: string;
    position?: Position;
    /**
     * The credit the document assigns to the answer's inputs as stored in the
     * state: `creditAchievedIfSubmit`, recomputed on load. Ignores attempt
     * limits and is not reduced by `creditByAttempt`.
     */
    credit: number;
    /**
     * What the state itself claims, as the browser stored it. Not
     * recomputed, so not evidence of anything; shown beside `credit` for
     * comparison.
     */
    stored: {
        creditAchieved: number;
        numSubmissions: number;
    };
    inputs: { componentType: string }[];
};

export type GradeStateResult = {
    variantIndex: number;
    numVariants: number;
    answers: GradedAnswer[];
    document: {
        /**
         * The document's own `creditAchievedIfSubmit`, recomputed on load.
         * Read from the document, which weighs its answers, pretzels and
         * sections itself; not a sum of `answers`. `NaN` (`null` in JSON)
         * when the document weighs nothing, or a `<problem>` or other
         * aggregating section in it has no scored part.
         */
        credit: number;
        /** The document's credit from the stored credit of its parts. */
        stored: { creditAchieved: number };
    };
    diagnostics: DiagnosticRecord[];
    savedState: {
        dataFormatVersion: string;
        /**
         * Whether the state is the report the viewer made at a submission
         * (`onSubmission: true`). A state saved at any other time can hold
         * inputs changed after the last submission.
         */
        onSubmission: boolean;
    };
};

/**
 * Grade a saved state: load it into a fresh core for `doenetML` and
 * `variantIndex`, and read the credit the document assigns to it.
 *
 * `savedState` is the payload the viewer reports to a host
 * (`reportScoreAndState`'s `state`, or `SPLICE.reportScoreAndState`'s), as the
 * host stored it, either as an object or as its JSON text.
 *
 * Refuses, with a `HeadlessError`, a state that is not such a payload, whose
 * `data_format_version` the core does not read, that was written for another
 * document source (`cid`), another variant, or (when `attemptNumber` is given)
 * another attempt.
 */
export async function gradeState(
    doenetML: string,
    variantIndex: number,
    savedState: HeadlessSavedState | string,
    {
        flags,
        attemptNumber,
        core: factory = defaultCoreFactory,
    }: GradeStateOptions = {},
): Promise<GradeStateResult> {
    const state = parseSavedState(savedState);
    await checkSavedState({
        state,
        doenetML,
        variantIndex,
        attemptNumber,
        dataFormatVersion: factory.dataFormatVersion,
    });

    const core = await factory.create({
        doenetML,
        variantIndex,
        flags,
        savedState: state,
    });
    try {
        if (core.variantIndex !== variantIndex) {
            throw new HeadlessError(
                "variantMismatch",
                `The document ran as variant ${core.variantIndex}, not the variant ${variantIndex} asked for (it has ${core.numVariants}).`,
            );
        }
        const answers = await core.getAnswers();
        const documentCredit = await core.getDocumentCredit();
        return {
            variantIndex: core.variantIndex,
            numVariants: core.numVariants,
            answers: answers.map((answer) => ({
                stableKey: answer.stableKey,
                componentIdx: answer.componentIdx,
                componentType: answer.componentType,
                ...(answer.position ? { position: answer.position } : {}),
                credit: answer.creditAchievedIfSubmit,
                stored: answer.stored,
                inputs: answer.inputs.map(({ componentType }) => ({
                    componentType,
                })),
            })),
            document: {
                credit: documentCredit.creditAchievedIfSubmit,
                stored: documentCredit.stored,
            },
            diagnostics: await core.getDiagnostics(),
            savedState: {
                dataFormatVersion: state.data_format_version as string,
                onSubmission: state.onSubmission === true,
            },
        };
    } finally {
        await core.terminate();
    }
}

function parseSavedState(
    savedState: HeadlessSavedState | string,
): HeadlessSavedState {
    let state: unknown = savedState;
    if (typeof savedState === "string") {
        try {
            state = JSON.parse(savedState);
        } catch (e) {
            throw new HeadlessError(
                "invalidState",
                `The saved state is not valid JSON: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
    }
    if (typeof state !== "object" || state === null || Array.isArray(state)) {
        throw new HeadlessError(
            "invalidState",
            "The saved state is not an object. Pass the `state` the viewer reported (`reportScoreAndState`), as stored.",
        );
    }
    return state as HeadlessSavedState;
}

/**
 * The checks that decide whether `state` may be graded as a state of this
 * document, variant and attempt. Each refusal names what the state says and
 * what was asked for.
 */
async function checkSavedState({
    state,
    doenetML,
    variantIndex,
    attemptNumber,
    dataFormatVersion,
}: {
    state: HeadlessSavedState;
    doenetML: string;
    variantIndex: number;
    attemptNumber?: number;
    dataFormatVersion: string;
}) {
    if (state.data_format_version !== dataFormatVersion) {
        throw new HeadlessError(
            "dataFormatVersion",
            `The saved state has data_format_version ${JSON.stringify(state.data_format_version ?? null)}; this core reads only ${JSON.stringify(dataFormatVersion)}. States are not converted between formats.`,
        );
    }
    if (
        typeof state.coreState !== "string" ||
        typeof state.coreInfo !== "string"
    ) {
        throw new HeadlessError(
            "invalidState",
            "The saved state has no `coreState` and `coreInfo` strings. Pass the `state` the viewer reported (`reportScoreAndState`), as stored.",
        );
    }

    let coreState: unknown;
    try {
        coreState = JSON.parse(state.coreState);
    } catch (e) {
        coreState = undefined;
    }
    if (
        typeof coreState !== "object" ||
        coreState === null ||
        Array.isArray(coreState)
    ) {
        throw new HeadlessError(
            "invalidState",
            "The saved state's `coreState` is not the JSON of an object.",
        );
    }

    if (typeof state.cid === "string" && state.cid !== "") {
        const cid = await cidFromText(doenetML);
        if (state.cid !== cid) {
            throw new HeadlessError(
                "documentMismatch",
                `The saved state was written for a different document source (cid ${state.cid}; this document is ${cid}).`,
            );
        }
    }

    let savedVariantIndex: unknown;
    try {
        const coreInfo = JSON.parse(state.coreInfo);
        savedVariantIndex = JSON.parse(coreInfo.generatedVariantString).index;
    } catch (e) {
        throw new HeadlessError(
            "invalidState",
            "The saved state's `coreInfo` does not record its variant.",
        );
    }
    if (savedVariantIndex !== variantIndex) {
        throw new HeadlessError(
            "variantMismatch",
            `The saved state is for variant ${JSON.stringify(savedVariantIndex ?? null)}, not the variant ${variantIndex} asked for.`,
        );
    }

    if (
        attemptNumber !== undefined &&
        typeof state.attemptNumber === "number" &&
        state.attemptNumber !== attemptNumber
    ) {
        throw new HeadlessError(
            "attemptMismatch",
            `The saved state is for attempt ${state.attemptNumber}, not the attempt ${attemptNumber} asked for.`,
        );
    }
}
