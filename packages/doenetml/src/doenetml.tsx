import "./DoenetML.css";
import seedrandom from "seedrandom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DocViewer } from "./Viewer/DocViewer";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "@doenet/utils";
import type { ErrorRecord, WarningRecord } from "@doenet/utils";
import { VirtualKeyboard } from "@doenet/virtual-keyboard";
import "@doenet/virtual-keyboard/style.css";
import "@doenet/ui-components/style.css";
import { EditorViewer } from "./EditorViewer/EditorViewer.js";
import VariantSelect from "./EditorViewer/VariantSelect";
import { useIsOnPage } from "./utils/visibility";
import { Provider as ReduxProvider } from "react-redux";
import { store, useAppDispatch } from "./state";
import { keyboardSlice } from "./state/slices/keyboard";

export const version: string = DOENETML_VERSION;

export type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode:
        | "button"
        | "buttonRequirePermission"
        | "displayed"
        | "none";
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
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveEvents: false,
    autoSubmit: false,
};

/**
 * A context that is used to keep track of the currently focused math input. This is used
 * for processing events from the virtual keyboard.
 */
export const FocusedMathInputContext = React.createContext<
    React.MutableRefObject<HTMLElement | null>
>({ current: null });

const rngClass = seedrandom.alea;

/**
 * this is a hack for react-mathqill
 * error: global is not defined
 */
window.global = window.global || window;

export function DoenetViewer({
    doenetML,
    flags: specifiedFlags = {},
    activityId = "a",
    docId = "1",
    prefixForIds = "",
    userId,
    attemptNumber = 1,
    render = true,
    requestedVariantIndex,
    initialState,
    reportScoreAndStateCallback,
    setIsInErrorState,
    generatedVariantCallback: specifiedGeneratedVariantCallback,
    documentStructureCallback,
    initializedCallback,
    setErrorsAndWarningsCallback,
    forceDisable = false,
    forceShowCorrectness = false,
    forceShowSolution = false,
    forceUnsuppressCheckwork = false,
    addVirtualKeyboard = true,
    externalVirtualKeyboardProvided = false,
    doenetViewerUrl,
    scrollableContainer,
    darkMode = "light",
    showAnswerResponseMenu = false,
    answerResponseCounts = {},
    includeVariantSelector = false,
    initializeCounters = {},
    fetchExternalDoenetML,
    onInit = () => {},
}: {
    doenetML: string;
    flags?: DoenetMLFlagsSubset;
    activityId?: string;
    docId?: string;
    prefixForIds?: string;
    userId?: string;
    attemptNumber?: number;
    render?: boolean;
    requestedVariantIndex?: number;
    initialState?: Record<string, any> | null;
    reportScoreAndStateCallback?: Function;
    setIsInErrorState?: Function;
    generatedVariantCallback?: Function;
    documentStructureCallback?: Function;
    initializedCallback?: Function;
    setErrorsAndWarningsCallback?: (errorsAndWarnings: unknown) => void;
    forceDisable?: boolean;
    forceShowCorrectness?: boolean;
    forceShowSolution?: boolean;
    forceUnsuppressCheckwork?: boolean;
    addVirtualKeyboard?: boolean;
    externalVirtualKeyboardProvided?: boolean;
    doenetViewerUrl?: string;
    scrollableContainer?: HTMLDivElement | Window;
    darkMode?: "dark" | "light";
    showAnswerResponseMenu?: boolean;
    answerResponseCounts?: Record<string, number>;
    includeVariantSelector?: boolean;
    initializeCounters?: Record<string, number>;
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    /**
     * Called when React has initialized and passed the DOM node that is a parent of
     * the DoenetML UI.
     */
    onInit?: (elm: HTMLElement) => void;
}) {
    useEffect(() => {
        // Add a YouTube iframe api to the document header if it doesn't exist
        if (
            !document.querySelector(
                'script[src="https://www.youtube.com/iframe_api"]',
            )
        ) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
        }
    }, []);

    const [variants, setVariants] = useState({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    const thisPropSet = [doenetML, activityId, userId, requestedVariantIndex];
    const lastPropSet = useRef<any[]>([]);

    const variantIndex = useRef(1);

    // Start off hidden and then unhide once the viewer is visible.
    // This is needed to delay the initialization of JSXgraph
    // until it is no longer hidden.
    // Otherwise, the graphs are often displayed in a garbled fashion
    // with the bounds calculated incorrectly
    const ref = useRef<HTMLDivElement>(null);
    const isOnPage = useIsOnPage(ref);
    const [hidden, setHidden] = useState(true);
    useEffect(() => {
        if (isOnPage) {
            setHidden(false);
        }
    }, [isOnPage]);

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    const generatedVariantCallback = useCallback(
        (newVariants: any) => {
            specifiedGeneratedVariantCallback?.(newVariants);
            if (includeVariantSelector) {
                setVariants(newVariants);
            }
        },
        [specifiedGeneratedVariantCallback, includeVariantSelector],
    );

    let variantSelector = null;
    if (includeVariantSelector) {
        // if we use a variant selector, then we ignore requestedVariant index
        // and just the index from variants, which will be changed the variant selector
        variantIndex.current = variants.index;

        if (variants.numVariants > 1) {
            variantSelector = (
                <VariantSelect
                    size="sm"
                    menuWidth="140px"
                    array={variants.allPossibleVariants}
                    syncIndex={variants.index}
                    onChange={(index: number) =>
                        setVariants((prev) => {
                            let next = { ...prev };
                            next.index = index + 1;
                            return next;
                        })
                    }
                />
            );
        }
    } else {
        // Normalize variant index to an integer.
        // Generate a random variant index if the requested variant index is undefined.
        // To preserve the generated variant index on rerender,
        // regenerate only if one of the props in propSet has changed
        if (thisPropSet.some((v, i) => v !== lastPropSet.current[i])) {
            if (requestedVariantIndex === undefined) {
                let rng = rngClass();
                requestedVariantIndex = Math.floor(rng() * 1000000) + 1;
            }
            variantIndex.current = Math.round(requestedVariantIndex);
            if (!Number.isInteger(variantIndex.current)) {
                variantIndex.current = 1;
            }
            lastPropSet.current = thisPropSet;
        }
    }

    const viewer = (
        <DocViewer
            doenetML={doenetML}
            flags={flags}
            activityId={activityId}
            docId={docId}
            prefixForIds={prefixForIds}
            userId={userId}
            attemptNumber={attemptNumber}
            render={render}
            hidden={hidden}
            requestedVariantIndex={variantIndex.current}
            initialState={initialState}
            reportScoreAndStateCallback={reportScoreAndStateCallback}
            setIsInErrorState={setIsInErrorState}
            generatedVariantCallback={generatedVariantCallback}
            documentStructureCallback={documentStructureCallback}
            initializedCallback={initializedCallback}
            setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
            forceDisable={forceDisable}
            forceShowCorrectness={forceShowCorrectness}
            forceShowSolution={forceShowSolution}
            forceUnsuppressCheckwork={forceUnsuppressCheckwork}
            doenetViewerUrl={doenetViewerUrl}
            scrollableContainer={scrollableContainer}
            darkMode={darkMode}
            showAnswerResponseMenu={showAnswerResponseMenu}
            answerResponseCounts={answerResponseCounts}
            initializeCounters={initializeCounters}
            fetchExternalDoenetML={fetchExternalDoenetML}
        />
    );

    return (
        <ReduxProvider store={store}>
            <MathJaxContext
                version={3}
                config={mathjaxConfig}
                src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js"
            >
                <div
                    ref={(r) => {
                        ref.current = r;
                        if (onInit && r) {
                            onInit(r);
                        }
                    }}
                >
                    <WrapWithKeyboard
                        addVirtualKeyboard={addVirtualKeyboard}
                        externalVirtualKeyboardProvided={
                            externalVirtualKeyboardProvided
                        }
                    >
                        {variantSelector}
                        {viewer}
                    </WrapWithKeyboard>
                </div>
            </MathJaxContext>
        </ReduxProvider>
    );
}

export function DoenetEditor({
    doenetML,
    activityId = "a",
    prefixForIds = "",
    addVirtualKeyboard = true,
    externalVirtualKeyboardProvided = false,
    doenetViewerUrl,
    darkMode = "light",
    showAnswerResponseMenu = false,
    answerResponseCounts = {},
    width,
    height,
    viewerLocation,
    backgroundColor,
    showViewer,
    doenetmlChangeCallback,
    immediateDoenetmlChangeCallback,
    documentStructureCallback,
    id,
    readOnly = false,
    showFormatter = true,
    showErrorsWarnings = true,
    showResponses = true,
    border = "1px solid",
    initialErrors = [],
    initialWarnings = [],
    fetchExternalDoenetML,
}: {
    doenetML: string;
    activityId?: string;
    prefixForIds?: string;
    addVirtualKeyboard?: boolean;
    externalVirtualKeyboardProvided?: boolean;
    doenetViewerUrl?: string;
    darkMode?: "dark" | "light";
    showAnswerResponseMenu?: boolean;
    answerResponseCounts?: Record<string, number>;
    width?: string;
    height?: string;
    viewerLocation?: "left" | "right" | "top" | "bottom";
    backgroundColor?: string;
    showViewer?: boolean;
    doenetmlChangeCallback?: Function;
    immediateDoenetmlChangeCallback?: Function;
    documentStructureCallback?: Function;
    id?: string;
    readOnly?: boolean;
    showFormatter?: boolean;
    showErrorsWarnings?: boolean;
    showResponses?: boolean;
    border?: string;
    initialErrors?: ErrorRecord[];
    initialWarnings?: WarningRecord[];
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
}) {
    useEffect(() => {
        // Add a YouTube iframe api to the document header if it doesn't exist
        if (
            !document.querySelector(
                'script[src="https://www.youtube.com/iframe_api"]',
            )
        ) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
        }
    }, []);

    const editor = (
        <EditorViewer
            doenetML={doenetML}
            activityId={activityId}
            prefixForIds={prefixForIds}
            doenetViewerUrl={doenetViewerUrl}
            darkMode={darkMode}
            showAnswerResponseMenu={showAnswerResponseMenu}
            answerResponseCounts={answerResponseCounts}
            width={width}
            height={height}
            viewerLocation={viewerLocation}
            showViewer={showViewer}
            doenetmlChangeCallback={doenetmlChangeCallback}
            immediateDoenetmlChangeCallback={immediateDoenetmlChangeCallback}
            documentStructureCallback={documentStructureCallback}
            id={id}
            readOnly={readOnly}
            showFormatter={showFormatter}
            showErrorsWarnings={showErrorsWarnings}
            showResponses={showResponses}
            border={border}
            initialErrors={initialErrors}
            initialWarnings={initialWarnings}
            fetchExternalDoenetML={fetchExternalDoenetML}
        />
    );

    return (
        <ReduxProvider store={store}>
            <MathJaxContext
                version={3}
                config={mathjaxConfig}
                src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js"
            >
                <WrapWithKeyboard
                    addVirtualKeyboard={addVirtualKeyboard}
                    externalVirtualKeyboardProvided={
                        externalVirtualKeyboardProvided
                    }
                >
                    {editor}
                </WrapWithKeyboard>
            </MathJaxContext>
        </ReduxProvider>
    );
}

/**
 * Component that wraps its children and provides a VirtualKeyboard
 */
function WrapWithKeyboard({
    addVirtualKeyboard,
    externalVirtualKeyboardProvided,
    children,
}: React.PropsWithChildren<{
    addVirtualKeyboard: boolean;
    externalVirtualKeyboardProvided: boolean;
}>) {
    const dispatch = useAppDispatch();
    const focusedMathInput = useRef<HTMLElement | null>(null);
    const keyboard = addVirtualKeyboard ? (
        <VirtualKeyboard
            externalVirtualKeyboardProvided={externalVirtualKeyboardProvided}
            onClick={(keyCommands) => {
                dispatch(keyboardSlice.actions.setKeyboardInput(keyCommands));
            }}
        />
    ) : null;

    return (
        <FocusedMathInputContext.Provider value={focusedMathInput}>
            {children}
            <div className="before-keyboard" />
            {keyboard}
        </FocusedMathInputContext.Provider>
    );
}
