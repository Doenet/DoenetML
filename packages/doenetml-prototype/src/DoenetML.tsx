import React, { useRef } from "react";
//@ts-ignore
import { prng_alea } from "esm-seedrandom";
import { ActivityViewer } from "./viewer/ActivityViewer";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "@doenet/utils";
let rngClass = prng_alea;

export type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode: string;
    showFeedback: boolean;
    showHints: boolean;
    allowLoadState: boolean;
    allowSaveState: boolean;
    allowLocalState: boolean;
    allowSaveSubmissions: boolean;
    allowSaveEvents: boolean;
    autoSubmit: boolean;
};

type DoenetMLFlagsSubset = {
    showCorrectness?: boolean;
    readOnly?: boolean;
    solutionDisplayMode?: string;
    showFeedback?: boolean;
    showHints?: boolean;
    allowLoadState?: boolean;
    allowSaveState?: boolean;
    allowLocalState?: boolean;
    allowSaveSubmissions?: boolean;
    allowSaveEvents?: boolean;
    autoSubmit?: boolean;
};

const defaultFlags: DoenetMLFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false,
    autoSubmit: false,
};

/**
 * this is a hack for react-mathqill
 * error: global is not defined
 */
window.global = window.global || window;
export function DoenetML({
    doenetML,
    flags: specifiedFlags = {},
    cid,
    activityId = "",
    userId,
    attemptNumber = 1,
    requestedVariantIndex,
    apiURLs,
    generatedVariantCallback,
    setErrorsAndWarningsCallback,
    forceDisable,
    forceShowCorrectness,
    forceShowSolution,
    forceUnsuppressCheckwork,
    addVirtualKeyboard = true,
    addBottomPadding = false,
    idsIncludeActivityId = true,
    darkMode,
}: {
    doenetML: string;
    flags?: DoenetMLFlagsSubset;
    cid?: string;
    activityId?: string;
    userId?: string;
    attemptNumber?: number;
    requestedVariantIndex?: number;
    apiURLs?: {};
    generatedVariantCallback?: Function;
    setErrorsAndWarningsCallback?: Function;
    forceDisable?: boolean;
    forceShowCorrectness?: boolean;
    forceShowSolution?: boolean;
    forceUnsuppressCheckwork?: boolean;
    addVirtualKeyboard?: boolean;
    addBottomPadding?: boolean;
    idsIncludeActivityId?: boolean;
    darkMode?: string;
}) {
    const thisPropSet = [
        doenetML,
        cid || "CID",
        activityId || "",
        userId || "UID",
        requestedVariantIndex || 0,
    ];
    const lastPropSet: React.MutableRefObject<(string | number)[]> = useRef([]);

    const variantIndex = useRef(0);

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    if (userId) {
        // if userId was specified, then we're viewing results of someone other than the logged in person
        // so disable saving state
        // and disable even looking up state from local storage (as we want to get the state from the database)
        flags.allowLocalState = false;
        flags.allowSaveState = false;
    } else if (flags.allowSaveState) {
        // allowSaveState implies allowLoadState
        // Rationale: saving state will result in loading a new state if another device changed it
        flags.allowLoadState = true;
    }

    // Normalize variant index to an integer.
    // Generate a random variant index if the requested variant index is undefined.
    // To preserve the generated variant index on rerender,
    // regenerate only if one of the props in propSet has changed
    if (thisPropSet.some((v, i) => v !== lastPropSet.current[i])) {
        if (requestedVariantIndex === undefined) {
            let rng = new rngClass(new Date());
            requestedVariantIndex = Math.floor(rng() * 1000000) + 1;
        }
        variantIndex.current = Math.round(requestedVariantIndex);
        if (!Number.isInteger(variantIndex.current)) {
            variantIndex.current = 1;
        }
        lastPropSet.current = thisPropSet;
    }

    let keyboard = null;

    return (
        <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
            <ActivityViewer
                doenetML={doenetML}
                flags={flags}
                cid={cid || "CID"}
                activityId={activityId}
                userId={userId || "UID"}
                attemptNumber={attemptNumber}
                requestedVariantIndex={variantIndex.current}
                apiURLs={apiURLs || {}}
                generatedVariantCallback={
                    generatedVariantCallback || (() => {})
                }
                setErrorsAndWarningsCallback={
                    setErrorsAndWarningsCallback || (() => {})
                }
                forceDisable={!!forceDisable}
                forceShowCorrectness={!!forceShowCorrectness}
                forceShowSolution={!!forceShowSolution}
                forceUnsuppressCheckwork={!!forceUnsuppressCheckwork}
                idsIncludeActivityId={idsIncludeActivityId}
                addBottomPadding={addBottomPadding}
                darkMode={darkMode || "auto"}
            />
            <div className="before-keyboard" />
            {keyboard}
        </MathJaxContext>
    );
}
