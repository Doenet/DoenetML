import React, { useRef } from "react";
import { MathJaxContext } from "better-react-mathjax";
import { PageViewer } from "./viewer/page-viewer";
import { Provider } from "react-redux";
import { store } from "./state/store";

export type DoenetMLFlags = {
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

export const defaultFlags: DoenetMLFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: true,
    allowSaveState: true,
    allowLocalState: false,
    allowSaveEvents: true,
    autoSubmit: false,
};

export function DoenetML({
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
            <MathJaxContext>
                <PageViewer
                    source={doenetML}
                    flags={flags}
                    darkMode={darkMode || "auto"}
                />
            </MathJaxContext>
        </Provider>
    );
}
