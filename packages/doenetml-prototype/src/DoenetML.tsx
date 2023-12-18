import React, { useRef } from "react";
import { MathJaxContext } from "better-react-mathjax";
import { PageViewer } from "./viewer/page-viewer";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { dastActions, elementsArraySelector } from "./state/redux-slices/dast";

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
            <UpdateSectionButton />
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

function UpdateSectionButton() {
    const dispatch = useAppDispatch();
    const elements = useAppSelector(elementsArraySelector);
    return (
        <button
            onClick={() => {
                // Find the first math element and update it
                const id = elements.findIndex(
                    (e) => e.type === "element" && e.name === "section",
                );
                if (id === -1) {
                    console.warn("No <section> element found", elements);
                    return;
                }
                dispatch(
                    dastActions.updateElements([
                        [
                            id,
                            {
                                type: "element",
                                name: "section",
                                attributes: {},
                                children: [`Updated contents ... ${Math.random()}`],
                                data: { id },
                            },
                        ],
                    ]),
                );
            }}
        >
            Update Section
        </button>
    );
}
