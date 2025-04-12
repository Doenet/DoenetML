import { PublicDoenetMLCore } from "../../CoreWorker";

type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode: string;
    showFeedback: boolean;
    showHints: boolean;
    allowLoadState: boolean;
    allowSaveState: boolean;
    allowLocalState: boolean;
    allowSaveEvents: boolean;
    autoSubmit: boolean;
};

type DoenetMLFlagsSubset = Partial<DoenetMLFlags>;

const defaultFlags: DoenetMLFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveEvents: false,
    autoSubmit: false,
};

export async function createTestCore({
    doenetML,
    requestedVariantIndex = 1,
    flags: specifiedFlags = {},
    theme,
    initializeCounters = {},
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    flags?: DoenetMLFlagsSubset;
    theme?: "dark" | "light";
    initializeCounters?: Record<string, number>;
}) {
    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    const core = new PublicDoenetMLCore();

    core.setSource(doenetML);
    core.setFlags(flags);

    await core.initializeWorker({
        activityId: "",
        docId: "1",
        requestedVariantIndex,
    });

    const dastResult = await core.createCoreGenerateDast(
        {
            coreId: "",
            cid: "",
            initializeCounters,
            theme,
        },
        () => null,
        () => null,
    );

    if (!dastResult.success) {
        throw Error(dastResult.errMsg);
    }

    return core;
}
