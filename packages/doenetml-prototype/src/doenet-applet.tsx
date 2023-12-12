import React, { useRef } from "react";
//@ts-ignore
import { prng_alea } from "esm-seedrandom";
import { PageViewer } from "./viewer/page-viewer";
import { Provider } from "react-redux";
import { store } from "./state/store";
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
    allowSaveSubmissions: false,
    allowSaveEvents: false,
    autoSubmit: false,
};

export function DoenetApplet({
    doenetML,
    flags: specifiedFlags = {},
    requestedVariantIndex,
    apiURLs,
    darkMode,
}: {
    doenetML: string;
    flags?: DoenetMLFlagsSubset;
    requestedVariantIndex?: number;
    apiURLs?: {};
    darkMode?: string;
}) {
    const variantIndex = useRef(0);

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    return (
        <Provider store={store}>
            <PageViewer
                source={doenetML}
                flags={flags}
                darkMode={darkMode || "auto"}
            />
        </Provider>
    );
}
