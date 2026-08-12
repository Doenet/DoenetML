import "./DoenetML.css";
import seedrandom from "seedrandom";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { DocViewer, type SourcePosition } from "./Viewer/DocViewer";
export type { SourcePosition } from "./Viewer/DocViewer";
import { MathJaxContext } from "@doenet/utils/mathjax";
import { mathjaxConfig, isErrorRecord, isWarningRecord } from "@doenet/utils";
import type { ReaderStyleOverrides } from "@doenet/utils";
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
import type {
    DoenetEditorHandle,
    ViewerLocation,
} from "./EditorViewer/EditorViewer";
import type { DiagnosticsTabId } from "./EditorViewer/DiagnosticsResponseTabs";
export type {
    DoenetEditorHandle,
    ViewerLocation,
} from "./EditorViewer/EditorViewer";
export type { DiagnosticsTabId } from "./EditorViewer/DiagnosticsResponseTabs";
import VariantSelect from "./EditorViewer/VariantSelect";
import { useIsOnPage } from "./utils/visibility";
import { Provider as ReduxProvider } from "react-redux";
import { store, useAppDispatch } from "./state";
import { keyboardSlice } from "./state/slices/keyboard";
import {
    setVariantIndex,
    setVariantsFromCallback,
    type VariantsState,
} from "./utils/variants";
import { useResolvedTheme } from "./utils/theme";
import type { ThemeSetting } from "./utils/theme";
export type { ThemeSetting, ResolvedTheme } from "./utils/theme";
import {
    I18nProvider,
    useHostChromeTranslator,
    useLocaleCatalogs,
} from "./utils/i18n";
import { directionOf, type Direction, type Translator } from "@doenet/i18n";
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
 * Everything a math input needs in order to be driven by a keyboard tray
 * published before it learned to decline focus.
 *
 * Such a tray takes focus when it is pressed, so the input is blurred and has
 * given up the claim `FocusedMathInputContext` records before the key gets
 * here. See the `accessed` message in `KeyCommand`, which is what identifies
 * such a tray, and the handling of it in the math input renderer.
 */
export type LegacyKeyboardTrayState = {
    /**
     * Whether a tray of that vintage has announced itself, by sending an
     * `accessed` message. Sticky: only those trays ever send it, and the tray
     * a page is under does not change. Nothing below applies until it is set,
     * which is what keeps all of this out of current pairings.
     */
    announced: boolean;
    /**
     * The math input that most recently gave up its claim on the keyboard, and
     * when — recorded only when the blur left nothing else in this document
     * focused, which is the shape of the blur such a tray causes. Both halves
     * are needed to tell that blur from the reader leaving the input of their
     * own accord.
     */
    release: { input: HTMLElement; releasedAt: number } | null;
};

/** Per-viewer {@link LegacyKeyboardTrayState}, shared by its math inputs. */
export const LegacyKeyboardTrayContext = React.createContext<
    React.RefObject<LegacyKeyboardTrayState>
>({ current: { announced: false, release: null } });

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
    doenetImagesUrl,
    darkMode = "system",
    documentLocale,
    uiLocale,
    localeResources,
    styleOverrides,
    showAnswerResponseButton = false,
    answerResponseCounts = {},
    includeVariantSelector = false,
    initializeCounters = {},
    fetchExternalDoenetML,
    requestScrollTo,
    onSourcePositionClick,
    scrollToSourceOffset,
    mathjaxUrl,
    useExistingMathjax = false,
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
    doenetImagesUrl?: string;
    /**
     * Theme for the rendered content. `"light"` / `"dark"` pin a theme;
     * `"system"` (the default) follows the user's OS/browser
     * `prefers-color-scheme` and updates live when it changes.
     */
    darkMode?: ThemeSetting;
    /**
     * BCP-47 tag for the *content's* language, e.g. `"es"` or `"es-MX"`.
     * Defaults to `"en"`. An authored `<document lang>` overrides it: the
     * author knows what language they wrote in, the host only knows what it
     * would prefer. Selects the language of prose the core computes (style
     * descriptions and the like), and sets `lang` on the rendered wrapper — an
     * accessibility win for screen-reader pronunciation independent of any
     * translation. Leave it unset and both the core and the wrapper use `en`,
     * which is the language such a document is rendered in. Changing it
     * rebuilds the document.
     */
    documentLocale?: string | null;
    /**
     * BCP-47 tag for the *chrome's* language: buttons, panel headers,
     * diagnostics. Defaults to `documentLocale`, so a fully Spanish activity is
     * fully Spanish out of the box. Set it separately when the reader's
     * language differs from the content's — a Spanish-speaking student working
     * a French physics problem.
     */
    uiLocale?: string | null;
    /**
     * FTL message catalogs keyed by locale, for a host with a translation of
     * its own. Optional: the catalog for a language DoenetML ships is loaded
     * on demand, so most hosts pass nothing. A catalog supplied here wins over
     * both the bundled and the loaded one for the same locale, which is how a
     * deployment corrects a translation.
     */
    localeResources?: Record<string, string> | null;
    /**
     * Reader (end-user) style overrides: per-styleNumber remappings of style
     * settings (colors, widths, marker/line styles) chosen by the reader —
     * e.g. colors they can better distinguish. Overrides win over everything
     * authored in the document and update live when the prop changes.
     */
    styleOverrides?: ReaderStyleOverrides | null;
    showAnswerResponseButton?: boolean;
    answerResponseCounts?: Record<string, number>;
    includeVariantSelector?: boolean;
    initializeCounters?: Record<string, number>;
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    requestScrollTo?: (offset: number) => void;
    /**
     * Called when the user Cmd/Ctrl+clicks a rendered element that has a
     * known source location, e.g. so a host app can move an editor's cursor
     * to the corresponding DoenetML. The modifier is required — plain
     * clicks just interact with the document — so a host does not have to
     * filter them out itself. Cmd/Ctrl+Enter on a focused graph element is
     * the keyboard equivalent.
     */
    onSourcePositionClick?: (position: SourcePosition) => void;
    /**
     * Set to a character offset into `doenetML` (e.g. the editor's cursor
     * position) to scroll the corresponding rendered element into view.
     * Only re-scrolls when this value changes, so a host that can repeat
     * the same request (e.g. one driven by a deliberate gesture rather than
     * a continuously moving cursor) should set it back to `null` in
     * between.
     */
    scrollToSourceOffset?: number | null;
    /**
     * URL of the MathJax script to load when the page does not already provide
     * MathJax. Defaults to the version Doenet is tested against. Ignored when a
     * host-provided MathJax engine or script is detected. Because a page shares
     * a single MathJax, only the first-mounted viewer's value takes effect.
     */
    mathjaxUrl?: string;
    /**
     * Force Doenet to reuse a MathJax provided by the host page instead of ever
     * loading its own — wait for `window.MathJax` rather than injecting a
     * script. Use when the host loads MathJax after Doenet mounts (so no script
     * is detectable yet). Existing/loading MathJax is reused automatically even
     * without this flag; it only matters when detection cannot see it in time.
     */
    useExistingMathjax?: boolean;
    /**
     * Called when React has initialized and passed the DOM node that is a parent of
     * the DoenetML UI.
     */
    onInit?: (elm: HTMLElement) => void;
}) {
    const [variants, setVariants] = useState<VariantsState>({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    const thisPropSet = [doenetML, activityId, userId, requestedVariantIndex];
    const lastPropSet = useRef<any[]>([]);

    const variantIndex = useRef(1);

    const resolvedTheme = useResolvedTheme(darkMode);
    // Catalogs for the languages the props name, code-split in unless the host
    // supplied them. `DocViewer` runs the same hook again over the languages
    // it resolves, which is where an authored `<document lang>` is picked up.
    const availableCatalogs = useLocaleCatalogs(
        [uiLocale, documentLocale],
        localeResources,
    );
    // Chrome outside the document — the virtual keyboard, the variant
    // selector — has only the props to go on. `DocViewer` mounts a nested
    // provider that also accounts for an authored `<document lang>`.
    const { translate: translateChrome, locale: hostUiLocale } =
        useHostChromeTranslator(uiLocale, documentLocale, availableCatalogs);
    // The reader's writing direction. Needed twice: once as an attribute on
    // the wrapper below, once handed to the keyboard tray, which renders into
    // its own root and inherits nothing.
    const hostUiDirection = directionOf(hostUiLocale);

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
                    darkMode={resolvedTheme}
                    array={variants.allPossibleVariants}
                    syncIndex={variants.index}
                    onChange={(index: number) =>
                        setVariantIndex(setVariants, index)
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
            doenetImagesUrl={doenetImagesUrl}
            darkMode={resolvedTheme}
            documentLocale={documentLocale}
            uiLocale={uiLocale}
            localeResources={availableCatalogs}
            styleOverrides={styleOverrides}
            showAnswerResponseButton={showAnswerResponseButton}
            answerResponseCounts={answerResponseCounts}
            initializeCounters={initializeCounters}
            fetchExternalDoenetML={fetchExternalDoenetML}
            requestScrollTo={requestScrollTo}
            onSourcePositionClick={onSourcePositionClick}
            scrollToSourceOffset={scrollToSourceOffset}
        />
    );

    return (
        <ReduxProvider store={store}>
            <MathJaxContext
                config={mathjaxConfig}
                version={4}
                src={mathjaxUrl}
                useExistingMathJax={useExistingMathjax}
            >
                <div
                    data-theme={resolvedTheme}
                    // The chrome outside the document — the variant selector,
                    // the "initializing" notice, the error-boundary fallback —
                    // is in the reader's language, and until now said so
                    // nowhere. `DocViewer` re-declares both attributes on the
                    // wrapper below for the *content's* language, so this only
                    // governs what sits outside it.
                    lang={hostUiLocale}
                    dir={hostUiDirection}
                    ref={(r) => {
                        ref.current = r;
                        if (onInit && r) {
                            onInit(r);
                        }
                    }}
                >
                    <I18nProvider
                        translate={translateChrome}
                        locale={hostUiLocale}
                    >
                        <WrapWithKeyboard
                            addVirtualKeyboard={addVirtualKeyboard}
                            externalVirtualKeyboardProvided={
                                externalVirtualKeyboardProvided
                            }
                            theme={resolvedTheme}
                            translate={translateChrome}
                            direction={hostUiDirection}
                        >
                            {variantSelector}
                            {viewer}
                        </WrapWithKeyboard>
                    </I18nProvider>
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
    doenetImagesUrl?: string;
    /**
     * Theme for the rendered content. `"light"` / `"dark"` pin a theme;
     * `"system"` (the default) follows the user's OS/browser
     * `prefers-color-scheme` and updates live when it changes.
     */
    darkMode?: ThemeSetting;
    /**
     * BCP-47 tag for the *content's* language, e.g. `"es"` or `"es-MX"`.
     * Defaults to `"en"`. An authored `<document lang>` overrides it: the
     * author knows what language they wrote in, the host only knows what it
     * would prefer. Selects the language of prose the core computes (style
     * descriptions and the like), and sets `lang` on the rendered wrapper — an
     * accessibility win for screen-reader pronunciation independent of any
     * translation. Leave it unset and both the core and the wrapper use `en`,
     * which is the language such a document is rendered in. Changing it
     * rebuilds the document.
     */
    documentLocale?: string | null;
    /**
     * BCP-47 tag for the *chrome's* language: buttons, panel headers,
     * diagnostics. Defaults to `documentLocale`, so a fully Spanish activity is
     * fully Spanish out of the box. Set it separately when the reader's
     * language differs from the content's — a Spanish-speaking student working
     * a French physics problem.
     */
    uiLocale?: string | null;
    /**
     * FTL message catalogs keyed by locale, for a host with a translation of
     * its own. Optional: the catalog for a language DoenetML ships is loaded
     * on demand, so most hosts pass nothing. A catalog supplied here wins over
     * both the bundled and the loaded one for the same locale, which is how a
     * deployment corrects a translation.
     */
    localeResources?: Record<string, string> | null;
    /**
     * Reader (end-user) style overrides: per-styleNumber remappings of style
     * settings (colors, widths, marker/line styles) chosen by the reader —
     * e.g. colors they can better distinguish. Overrides win over everything
     * authored in the document and update live when the prop changes.
     */
    styleOverrides?: ReaderStyleOverrides | null;
    showAnswerResponseButton?: boolean;
    answerResponseCounts?: Record<string, number>;
    width?: string;
    height?: string;
    viewerLocation?: ViewerLocation | "left" | "right";
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
     * URL of the MathJax script to load when the page does not already provide
     * MathJax. Defaults to the version Doenet is tested against. Ignored when a
     * host-provided MathJax engine or script is detected. See `DoenetViewer`.
     */
    mathjaxUrl?: string;
    /**
     * Force reuse of a host-provided MathJax instead of ever loading Doenet's
     * own copy. See `DoenetViewer` for details.
     */
    useExistingMathjax?: boolean;
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
        doenetImagesUrl,
        darkMode = "system",
        documentLocale,
        uiLocale,
        localeResources,
        styleOverrides,
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
        mathjaxUrl,
        useExistingMathjax = false,
    },
    ref,
) {
    const resolvedTheme = useResolvedTheme(darkMode);
    // As in `DoenetViewer`: props only here, authored `<document lang>` in the
    // nested provider `DocViewer` mounts.
    const availableCatalogs = useLocaleCatalogs(
        [uiLocale, documentLocale],
        localeResources,
    );
    const { translate: translateChrome, locale: hostUiLocale } =
        useHostChromeTranslator(uiLocale, documentLocale, availableCatalogs);
    // The reader's writing direction. Needed twice: once as an attribute on
    // the wrapper below, once handed to the keyboard tray, which renders into
    // its own root and inherits nothing.
    const hostUiDirection = directionOf(hostUiLocale);

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
            doenetImagesUrl={doenetImagesUrl}
            darkMode={resolvedTheme}
            documentLocale={documentLocale}
            uiLocale={uiLocale}
            localeResources={availableCatalogs}
            styleOverrides={styleOverrides}
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
            <MathJaxContext
                config={mathjaxConfig}
                version={4}
                src={mathjaxUrl}
                useExistingMathJax={useExistingMathjax}
            >
                {/* The whole editor — toolbar, tabs, variant selector,
                    diagnostics panel, context help — is chrome in the reader's
                    language, and none of it is inside any `.doenet-viewer`.
                    `display: contents` generates no box but both attributes
                    still inherit, which is exactly what is wanted here. */}
                <div
                    data-theme={resolvedTheme}
                    lang={hostUiLocale}
                    dir={hostUiDirection}
                    style={{ display: "contents" }}
                >
                    <I18nProvider
                        translate={translateChrome}
                        locale={hostUiLocale}
                    >
                        <WrapWithKeyboard
                            addVirtualKeyboard={addVirtualKeyboard}
                            externalVirtualKeyboardProvided={
                                externalVirtualKeyboardProvided
                            }
                            theme={resolvedTheme}
                            translate={translateChrome}
                            direction={hostUiDirection}
                        >
                            {editor}
                        </WrapWithKeyboard>
                    </I18nProvider>
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
    translate,
    direction,
    children,
}: React.PropsWithChildren<{
    addVirtualKeyboard: boolean;
    externalVirtualKeyboardProvided: boolean;
    theme?: "dark" | "light";
    translate?: Translator;
    direction?: Direction;
}>) {
    const dispatch = useAppDispatch();
    const focusedMathInput = useRef<HTMLElement | null>(null);
    const legacyKeyboardTray = useRef<LegacyKeyboardTrayState>({
        announced: false,
        release: null,
    });
    const keyboard = addVirtualKeyboard ? (
        <VirtualKeyboard
            externalVirtualKeyboardProvided={externalVirtualKeyboardProvided}
            ownerRef={focusedMathInput}
            theme={theme}
            // The tray lives in its own React root outside this tree (it is
            // shared by every viewer on the page), so the translator has to be
            // handed to it the same way `theme` already is — context cannot
            // cross a root boundary. Neither can an inherited `dir`, so the
            // direction rides the same channel.
            translate={translate}
            direction={direction}
            onClick={(keyCommands) => {
                // `keyboardChoice` is a preference, not a key press. It is
                // routed to the store instead of to the focused input, so that
                // every math input can decide whether to keep the device's own
                // on-screen keyboard down. See `KeyCommand`.
                const lastChoice = keyCommands
                    .filter((command) => command.type === "keyboardChoice")
                    .pop();
                if (lastChoice) {
                    dispatch(
                        keyboardSlice.actions.setSystemKeyboardRequested(
                            lastChoice.command === "system",
                        ),
                    );
                }

                // A fresh array every press, and deliberately so: a math input
                // notices a new batch of keys by the identity of the array in
                // the store, and the keys of a given tray button are one
                // constant array reused on every press of it. Storing that
                // constant would leave the state unchanged, and pressing the
                // same key twice in a row would type one character. The
                // bookkeeping events the tray used to send alongside every
                // press kept the identity moving on their own; nothing does
                // now, so the dispatch has to.
                const keyPresses = keyCommands.filter(
                    (command) => command.type !== "keyboardChoice",
                );
                if (keyPresses.length > 0) {
                    dispatch(
                        keyboardSlice.actions.setKeyboardInput(keyPresses),
                    );
                }
            }}
        />
    ) : null;

    return (
        <FocusedMathInputContext.Provider value={focusedMathInput}>
            <LegacyKeyboardTrayContext.Provider value={legacyKeyboardTray}>
                {children}
                <div className="before-keyboard" />
                {keyboard}
            </LegacyKeyboardTrayContext.Provider>
        </FocusedMathInputContext.Provider>
    );
}
