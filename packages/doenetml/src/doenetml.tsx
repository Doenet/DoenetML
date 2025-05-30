import "./DoenetML.css";
import seedrandom from "seedrandom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DocViewer } from "./Viewer/DocViewer";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "@doenet/utils";
import type { ErrorDescription, WarningDescription } from "@doenet/utils";
import { VirtualKeyboard } from "@doenet/virtual-keyboard";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
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

const system = createSystem(defaultConfig, {
    preflight: false,
    theme: {
        tokens: {
            fonts: {
                body: { value: "Jost" },
            },
            colors: {
                doenet: {
                    mainBlue: { value: "#1a5a99" },
                    lightBlue: { value: "#b8d2ea" },
                    solidLightBlue: { value: "#8fb8de" },
                    mainGray: { value: "#e3e3e3" },
                    mediumGray: { value: "#949494" },
                    lightGray: { value: "#e7e7e7" },
                    donutBody: { value: "#eea177" },
                    donutTopping: { value: "#6d4445" },
                    mainRed: { value: "#c1292e" },
                    lightRed: { value: "#eab8b8" },
                    mainGreen: { value: "#459152" },
                    canvas: { value: "#ffffff" },
                    canvastext: { value: "#000000" },
                    lightGreen: { value: "#a6f19f" },
                    lightYellow: { value: "#f5ed85" },
                    whiteBlankLink: { value: "#6d4445" },
                    mainYellow: { value: "#94610a" },
                    mainPurple: { value: "#4a03d9" },
                },
            },
        },
    },
});

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
    linkSettings,
    scrollableContainer,
    darkMode = "light",
    showAnswerResponseMenu = false,
    answerResponseCounts = {},
    includeVariantSelector = false,
    initializeCounters = {},
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
    linkSettings?: { viewURL: string; editURL: string };
    scrollableContainer?: HTMLDivElement | Window;
    darkMode?: "dark" | "light";
    showAnswerResponseMenu?: boolean;
    answerResponseCounts?: Record<string, number>;
    includeVariantSelector?: boolean;
    initializeCounters?: Record<string, number>;
}) {
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
            linkSettings={linkSettings}
            scrollableContainer={scrollableContainer}
            darkMode={darkMode}
            showAnswerResponseMenu={showAnswerResponseMenu}
            answerResponseCounts={answerResponseCounts}
            initializeCounters={initializeCounters}
        />
    );

    return (
        <ChakraProvider value={system}>
            <ReduxProvider store={store}>
                <MathJaxContext
                    version={3}
                    config={mathjaxConfig}
                    src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js"
                >
                    <div ref={ref}>
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
        </ChakraProvider>
    );
}

export function DoenetEditor({
    doenetML,
    activityId = "a",
    prefixForIds = "",
    addVirtualKeyboard = true,
    externalVirtualKeyboardProvided = false,
    linkSettings,
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
}: {
    doenetML: string;
    activityId?: string;
    prefixForIds?: string;
    addVirtualKeyboard?: boolean;
    externalVirtualKeyboardProvided?: boolean;
    linkSettings?: { viewURL: string; editURL: string };
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
    initialErrors?: ErrorDescription[];
    initialWarnings?: WarningDescription[];
}) {
    const editor = (
        <EditorViewer
            doenetML={doenetML}
            activityId={activityId}
            prefixForIds={prefixForIds}
            linkSettings={linkSettings}
            darkMode={darkMode}
            showAnswerResponseMenu={showAnswerResponseMenu}
            answerResponseCounts={answerResponseCounts}
            width={width}
            height={height}
            viewerLocation={viewerLocation}
            backgroundColor={backgroundColor}
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
        />
    );

    return (
        <ChakraProvider value={system}>
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
        </ChakraProvider>
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
