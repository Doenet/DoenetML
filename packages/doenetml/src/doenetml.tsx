import "./DoenetML.css";
import seedrandom from "seedrandom";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { DocViewer } from "./Viewer/DocViewer";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig, isErrorRecord, isWarningRecord } from "@doenet/utils";
import type { DiagnosticsSummary } from "./EditorViewer/diagnostics";
import type {
    DiagnosticRecord,
    ErrorRecord,
    WarningRecord,
} from "@doenet/utils";
import { VirtualKeyboard } from "@doenet/virtual-keyboard";
import "@doenet/virtual-keyboard/style.css";
import "@doenet/ui-components/style.css";
import { EditorViewer } from "./EditorViewer/EditorViewer.js";
import type { DoenetEditorHandle } from "./EditorViewer/EditorViewer";
import type { DiagnosticsTabId } from "./EditorViewer/DiagnosticsResponseTabs";
export type { DoenetEditorHandle } from "./EditorViewer/EditorViewer";
export type { DiagnosticsTabId } from "./EditorViewer/DiagnosticsResponseTabs";
import VariantSelect from "./EditorViewer/VariantSelect";
import { useIsOnPage } from "./utils/visibility";
import { Provider as ReduxProvider } from "react-redux";
import { store, useAppDispatch } from "./state";
import { keyboardSlice } from "./state/slices/keyboard";
import { setVariantsFromCallback } from "./utils/variants";
import { useResolvedTheme } from "./utils/theme";
import type { ThemeSetting } from "./utils/theme";
export type { ThemeSetting, ResolvedTheme } from "./utils/theme";
import { defaultFlags } from "./flags";
import type { DoenetMLFlags } from "./flags";
export type { DoenetMLFlags } from "./flags";
export { defaultFlags } from "./flags";

let warnedShowErrorsWarningsDeprecation = false;
let warnedInitialErrorsWarningsDeprecation = false;

// Module-level constant so the default for `initialDiagnostics` is referentially
// stable across renders (a parameter default `= []` would create a fresh array
// each render, refiring every memo/effect downstream that depends on it).
const EMPTY_INITIAL_DIAGNOSTICS: DiagnosticRecord[] = [];

export const version: string = DOENETML_VERSION;

type DoenetMLFlagsSubset = Partial<DoenetMLFlags>;

/**
 * A context that is used to keep track of the currently focused math input. This is used
 * for processing events from the virtual keyboard.
 */
export const FocusedMathInputContext = React.createContext<
    React.RefObject<HTMLElement | null>
>({ current: null });

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
    setDiagnosticsCallback,
    setErrorsAndWarningsCallback,
    forceDisable = false,
    forceShowCorrectness = false,
    forceShowSolution = false,
    forceUnsuppressCheckWork = false,
    addVirtualKeyboard = true,
    externalVirtualKeyboardProvided = false,
    doenetViewerUrl,
    doenetMediaUrl,
    darkMode = "system",
    showAnswerResponseButton = false,
    answerResponseCounts = {},
    includeVariantSelector = false,
    initializeCounters = {},
    fetchExternalDoenetML,
    requestScrollTo,
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
    reportScoreAndStateCallback?: (data: {
        score: number;
        state: unknown;
        activityId: string;
        docId: string;
    }) => void;
    setIsInErrorState?: Function;
    generatedVariantCallback?: Function;
    documentStructureCallback?: Function;
    initializedCallback?: Function;
    setDiagnosticsCallback?: (
        diagnostics: DiagnosticRecord[],
        source: string,
    ) => void;
    /**
     * @deprecated Use `setDiagnosticsCallback` instead.
     */
    setErrorsAndWarningsCallback?: (errorsAndWarnings: {
        errors: ErrorRecord[];
        warnings: WarningRecord[];
    }) => void;
    forceDisable?: boolean;
    forceShowCorrectness?: boolean;
    forceShowSolution?: boolean;
    forceUnsuppressCheckWork?: boolean;
    addVirtualKeyboard?: boolean;
    externalVirtualKeyboardProvided?: boolean;
    doenetViewerUrl?: string;
    doenetMediaUrl?: string;
    /**
     * Theme for the rendered content. `"light"` / `"dark"` pin a theme;
     * `"system"` (the default) follows the user's OS/browser
     * `prefers-color-scheme` and updates live when it changes.
     */
    darkMode?: ThemeSetting;
    showAnswerResponseButton?: boolean;
    answerResponseCounts?: Record<string, number>;
    includeVariantSelector?: boolean;
    initializeCounters?: Record<string, number>;
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    requestScrollTo?: (offset: number) => void;
    /**
     * Called when React has initialized and passed the DOM node that is a parent of
     * the DoenetML UI.
     */
    onInit?: (elm: HTMLElement) => void;
}) {
    const [variants, setVariants] = useState({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    const thisPropSet = [doenetML, activityId, userId, requestedVariantIndex];
    const lastPropSet = useRef<any[]>([]);

    const variantIndex = useRef(1);

    const resolvedTheme = useResolvedTheme(darkMode);

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

    useEffect(() => {
        if (setErrorsAndWarningsCallback) {
            console.warn(
                "DoenetViewer: setErrorsAndWarningsCallback is deprecated. Use setDiagnosticsCallback instead.",
            );
        }
    }, []);

    const effectiveDiagnosticsCallback = setErrorsAndWarningsCallback
        ? (diagnostics: DiagnosticRecord[], source: string) => {
              setDiagnosticsCallback?.(diagnostics, source);
              setErrorsAndWarningsCallback({
                  errors: diagnostics.filter(isErrorRecord),
                  warnings: diagnostics.filter(isWarningRecord),
              });
          }
        : setDiagnosticsCallback;

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    if (
        (flags.allowLocalState || flags.allowLoadState) &&
        includeVariantSelector
    ) {
        console.warn(
            "includeVariantSelector cannot be used with allowLocalState or allowLoadState. Disabling includeVariantSelector.",
        );
        includeVariantSelector = false;
    }

    const generatedVariantCallback = useCallback(
        (x: any) => {
            specifiedGeneratedVariantCallback?.(x);
            if (includeVariantSelector) {
                setVariantsFromCallback(x, variants, setVariants);
            }
        },
        [specifiedGeneratedVariantCallback, includeVariantSelector, variants],
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
                    darkMode={resolvedTheme}
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
                let rng = seedrandom();
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
            setDiagnosticsCallback={effectiveDiagnosticsCallback}
            forceDisable={forceDisable}
            forceShowCorrectness={forceShowCorrectness}
            forceShowSolution={forceShowSolution}
            forceUnsuppressCheckWork={forceUnsuppressCheckWork}
            doenetViewerUrl={doenetViewerUrl}
            doenetMediaUrl={doenetMediaUrl}
            darkMode={resolvedTheme}
            showAnswerResponseButton={showAnswerResponseButton}
            answerResponseCounts={answerResponseCounts}
            initializeCounters={initializeCounters}
            fetchExternalDoenetML={fetchExternalDoenetML}
            requestScrollTo={requestScrollTo}
        />
    );

    return (
        <ReduxProvider store={store}>
            <MathJaxContext config={mathjaxConfig} version={4}>
                <div
                    data-theme={resolvedTheme}
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
                        theme={resolvedTheme}
                    >
                        {variantSelector}
                        {viewer}
                    </WrapWithKeyboard>
                </div>
            </MathJaxContext>
        </ReduxProvider>
    );
}

type DoenetEditorProps = {
    doenetML: string;
    activityId?: string;
    prefixForIds?: string;
    addVirtualKeyboard?: boolean;
    externalVirtualKeyboardProvided?: boolean;
    doenetViewerUrl?: string;
    doenetMediaUrl?: string;
    /**
     * Theme for the rendered content. `"light"` / `"dark"` pin a theme;
     * `"system"` (the default) follows the user's OS/browser
     * `prefers-color-scheme` and updates live when it changes.
     */
    darkMode?: ThemeSetting;
    showAnswerResponseButton?: boolean;
    answerResponseCounts?: Record<string, number>;
    width?: string;
    height?: string;
    viewerLocation?: "left" | "right" | "top" | "bottom";
    backgroundColor?: string;
    showViewer?: boolean;
    doenetmlChangeCallback?: Function;
    immediateDoenetmlChangeCallback?: Function;
    documentStructureCallback?: Function;
    diagnosticsSummaryCallback?: (
        diagnosticsSummary: DiagnosticsSummary,
        doenetML: string,
    ) => void;
    id?: string;
    readOnly?: boolean;
    showFormatter?: boolean;
    showDiagnostics?: boolean;
    showErrorsWarnings?: boolean;
    showResponses?: boolean;
    showHelp?: boolean;
    border?: string;
    initialDiagnostics?: DiagnosticRecord[];
    initialErrors?: ErrorRecord[];
    initialWarnings?: WarningRecord[];
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    docsURL?: string;
    /**
     * Controls which tab the diagnostics/responses/help panel opens to at
     * mount. Three forms:
     *  - prop omitted (`undefined`): default — panel opens on the help tab
     *    (or the first available tab if `showHelp` is false).
     *  - a specific tab id: panel opens on that tab. If the tab is disabled,
     *    falls back to the default with a `console.warn`.
     *  - `null`: panel mounts closed.
     * Reactive changes after mount are ignored — use the imperative ref handle
     * (`openDiagnosticsTab` / `closeDiagnosticsPanel`) for runtime control.
     */
    initialOpenTab?: DiagnosticsTabId | null;
};

export const DoenetEditor = React.forwardRef<
    DoenetEditorHandle,
    DoenetEditorProps
>(function DoenetEditor(
    {
        doenetML,
        activityId = "a",
        prefixForIds = "",
        addVirtualKeyboard = true,
        externalVirtualKeyboardProvided = false,
        doenetViewerUrl,
        doenetMediaUrl,
        darkMode = "system",
        showAnswerResponseButton = false,
        answerResponseCounts = {},
        width,
        height,
        viewerLocation,
        backgroundColor,
        showViewer,
        doenetmlChangeCallback,
        immediateDoenetmlChangeCallback,
        documentStructureCallback,
        diagnosticsSummaryCallback,
        id,
        readOnly = false,
        showFormatter = true,
        showDiagnostics,
        showErrorsWarnings,
        showResponses = true,
        showHelp = true,
        border = "1px solid",
        initialDiagnostics = EMPTY_INITIAL_DIAGNOSTICS,
        initialErrors,
        initialWarnings,
        fetchExternalDoenetML,
        docsURL,
        initialOpenTab,
    },
    ref,
) {
    const resolvedTheme = useResolvedTheme(darkMode);

    const normalizedShowDiagnostics =
        showDiagnostics ?? showErrorsWarnings ?? true;

    if (
        showDiagnostics === undefined &&
        showErrorsWarnings !== undefined &&
        !warnedShowErrorsWarningsDeprecation
    ) {
        warnedShowErrorsWarningsDeprecation = true;
        console.warn(
            "DoenetEditor: showErrorsWarnings is deprecated. Use showDiagnostics instead.",
        );
    }

    if (
        (initialErrors !== undefined || initialWarnings !== undefined) &&
        !warnedInitialErrorsWarningsDeprecation
    ) {
        warnedInitialErrorsWarningsDeprecation = true;
        console.warn(
            "DoenetEditor: initialErrors and initialWarnings are deprecated. Use initialDiagnostics instead.",
        );
    }

    // Memoized so the array reference is stable across re-renders unless one
    // of the inputs actually changes. Without this, every re-render of
    // `DoenetEditor` would hand `EditorViewer` a fresh array, refiring its
    // diagnostics-summary effect on every parent render.
    const normalizedInitialDiagnostics = useMemo(
        () => [
            ...initialDiagnostics,
            ...(initialErrors ?? []),
            ...(initialWarnings ?? []),
        ],
        [initialDiagnostics, initialErrors, initialWarnings],
    );

    const editor = (
        <EditorViewer
            ref={ref}
            doenetML={doenetML}
            activityId={activityId}
            prefixForIds={prefixForIds}
            doenetViewerUrl={doenetViewerUrl}
            doenetMediaUrl={doenetMediaUrl}
            darkMode={resolvedTheme}
            showAnswerResponseButton={showAnswerResponseButton}
            answerResponseCounts={answerResponseCounts}
            width={width}
            height={height}
            viewerLocation={viewerLocation}
            showViewer={showViewer}
            doenetmlChangeCallback={doenetmlChangeCallback}
            immediateDoenetmlChangeCallback={immediateDoenetmlChangeCallback}
            documentStructureCallback={documentStructureCallback}
            diagnosticsSummaryCallback={diagnosticsSummaryCallback}
            id={id}
            readOnly={readOnly}
            showFormatter={showFormatter}
            showDiagnostics={normalizedShowDiagnostics}
            showResponses={showResponses}
            showHelp={showHelp}
            addVirtualKeyboard={addVirtualKeyboard}
            border={border}
            initialDiagnostics={normalizedInitialDiagnostics}
            fetchExternalDoenetML={fetchExternalDoenetML}
            docsURL={docsURL}
            initialOpenTab={initialOpenTab}
        />
    );

    return (
        <ReduxProvider store={store}>
            <MathJaxContext config={mathjaxConfig} version={4}>
                <div data-theme={resolvedTheme} style={{ display: "contents" }}>
                    <WrapWithKeyboard
                        addVirtualKeyboard={addVirtualKeyboard}
                        externalVirtualKeyboardProvided={
                            externalVirtualKeyboardProvided
                        }
                        theme={resolvedTheme}
                    >
                        {editor}
                    </WrapWithKeyboard>
                </div>
            </MathJaxContext>
        </ReduxProvider>
    );
});

/**
 * Component that wraps its children and provides a VirtualKeyboard
 */
function WrapWithKeyboard({
    addVirtualKeyboard,
    externalVirtualKeyboardProvided,
    theme,
    children,
}: React.PropsWithChildren<{
    addVirtualKeyboard: boolean;
    externalVirtualKeyboardProvided: boolean;
    theme?: "dark" | "light";
}>) {
    const dispatch = useAppDispatch();
    const focusedMathInput = useRef<HTMLElement | null>(null);
    const keyboard = addVirtualKeyboard ? (
        <VirtualKeyboard
            externalVirtualKeyboardProvided={externalVirtualKeyboardProvided}
            theme={theme}
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
