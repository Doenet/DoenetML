import type {
    DiagnosticRecord,
    HeadlessCoreFactory,
    Position,
} from "@doenet/utils";
import { defaultCoreFactory } from "./defaultCore";

export type CheckOptions = {
    /** The variant to check, numbered from 1. Defaults to 1. */
    variantIndex?: number;
    /** Viewer flags to run the document with. */
    flags?: Record<string, unknown>;
    /** The core to run. Defaults to the JavaScript core. */
    coreFactory?: HeadlessCoreFactory;
};

export type CheckedAnswer = {
    /** The answer's stable key (`r[3].g.ans`), or `null` if it has none. */
    stableKey: string | null;
    componentType: string;
    position?: Position;
    /** The answer's own inputs, in position order. */
    inputs: { componentType: string }[];
};

export type CheckResult = {
    variantIndex: number;
    numVariants: number;
    /** Every diagnostic: errors, warnings, infos and accessibility. */
    diagnostics: DiagnosticRecord[];
    answers: CheckedAnswer[];
    /**
     * The answers with no stable key: no path from the document root reaches
     * them and nothing else. Their inputs cannot be driven, and nothing that
     * records answers by key can name them.
     */
    answersWithoutStableKey: CheckedAnswer[];
};

/**
 * Run `doenetML` in one variant and report what is wrong with it and what it
 * asks: all of its diagnostics, its answers with their stable keys, which of
 * them have none, and how many variants it has.
 */
export async function check(
    doenetML: string,
    {
        variantIndex = 1,
        flags,
        coreFactory = defaultCoreFactory,
    }: CheckOptions = {},
): Promise<CheckResult> {
    const core = await coreFactory.create({ doenetML, variantIndex, flags });
    try {
        const answers: CheckedAnswer[] = (await core.getAnswers()).map(
            (answer) => ({
                stableKey: answer.stableKey,
                componentType: answer.componentType,
                ...(answer.position ? { position: answer.position } : {}),
                inputs: answer.inputs.map(({ componentType }) => ({
                    componentType,
                })),
            }),
        );
        return {
            variantIndex: core.variantIndex,
            numVariants: core.numVariants,
            diagnostics: await core.getDiagnostics(),
            answers,
            answersWithoutStableKey: answers.filter(
                (answer) => answer.stableKey === null,
            ),
        };
    } finally {
        await core.terminate();
    }
}
