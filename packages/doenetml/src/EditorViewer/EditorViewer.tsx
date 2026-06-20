import React, {
    ReactElement,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { flushSync } from "react-dom";
import { ResizablePanelPair } from "@doenet/ui-components";
import { CodeMirror, LSP } from "@doenet/codemirror";
import "@doenet/codemirror/style.css";
import { DocViewer } from "../Viewer/DocViewer";
import { DiagnosticsResponseTabContents } from "./DiagnosticsResponseTabs";
import type { DiagnosticsTabId } from "./DiagnosticsResponseTabs";
import { DiagnosticRecord, nanInfinityReviver } from "@doenet/utils";
import { nanoid } from "nanoid";
import { prettyPrint } from "@doenet/parser/pretty-printer";
import { formatResponse } from "../utils/responses";
import { ResizableCollapsiblePanelPair } from "@doenet/ui-components";
import { EditorFooter } from "./EditorFooter";
import { ViewerControlsBar } from "./ViewerControlsBar";
import "./editor-viewer.css";
import { useTabStore } from "@ariakit/react";
import { setVariantsFromCallback } from "../utils/variants";
import type { DiagnosticsSummary } from "./diagnostics";
import {
    mergeDiagnosticsByType,
    toAdditionalDiagnosticsForLsp,
} from "./diagnostics";
import type { HelpContent } from "@doenet/lsp-tools";
import { EditorSelection } from "@codemirror/state";
import type { Completion } from "@codemirror/autocomplete";
import { doenetGlobalConfig } from "../global-config";

const HELP_NONE: HelpContent = { kind: "none" };

// Module-level constant so the default for `initialDiagnostics` is referentially
// stable across renders. A parameter default `= []` would create a fresh array
// each render, refiring every effect/memo that depends on `initialDiagnostics`.
const EMPTY_INITIAL_DIAGNOSTICS: DiagnosticRecord[] = [];

/**
 * Imperative handle exposed on the ref of `<DoenetEditor>`. Provides
 * programmatic access to editor actions that would otherwise require user
 * interaction with the UI — switching the diagnostics/responses panel, and
 * flushing pending edits to the rendered view.
 */
export type DoenetEditorHandle = {
    /**
     * Switch the diagnostics/responses panel to `tabId` and open it.
     * If `tabId` references a tab disabled by `showDiagnostics={false}` or
     * `showResponses={false}`, the call is ignored with a `console.warn`.
     */
    openDiagnosticsTab: (tabId: DiagnosticsTabId) => void;
    /** Close the diagnostics/responses panel. */
    closeDiagnosticsPanel: () => void;
    /**
     * Programmatic equivalent of clicking the editor's "Update" button: flush
     * any pending edits to the viewer so the next `diagnosticsSummaryCallback`
     * reflects the current editor buffer rather than stale state.
     *
     * Behavior mirrors the button:
     * - If the editor has unsaved edits, the viewer is re-rendered with the
     *   current source and the pending `doenetmlChangeCallback` debounce
     *   timer is cancelled. (The callback still fires indirectly via the
     *   viewer's normal change-reporting path once it parses the new
     *   source.)
     * - If the source is unchanged but the document has been interacted with,
     *   the viewer is remounted (clearing answer/work state).
     * - If neither condition holds, the call is a no-op.
     *
     * Ignored with a `console.warn` when `showViewer={false}` (no viewer to
     * update).
     */
    updateRenderedView: () => void;
};

type EditorViewerProps = {
    doenetML: string;
    activityId?: string;
    prefixForIds?: string;
    doenetViewerUrl?: string;
    doenetMediaUrl?: string;
    darkMode?: "dark" | "light";
    showAnswerResponseButton?: boolean;
    answerResponseCounts?: Record<string, number>;
    width?: string;
    height?: string;
    showViewer?: boolean;
    viewerLocation?: "left" | "right" | "top" | "bottom";
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
    showResponses?: boolean;
    showHelp?: boolean;
    /**
     * Used by the footer to decide whether to reserve space on its right edge
     * for the virtual keyboard's open-keyboard tab. Mirrors the same prop on
     * `DoenetEditor`. Has no effect when the footer doesn't touch the
     * container's right edge (default `viewerLocation="right"` with the
     * viewer shown).
     */
    addVirtualKeyboard?: boolean;
    border?: string;
    initialDiagnostics?: DiagnosticRecord[];
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    docsURL?: string;
    /**
     * Controls which tab the diagnostics/responses/help panel opens to at
     * mount. Three forms:
     *  - prop omitted (`undefined`): default — panel opens on the help tab
     *    (or the first available tab if `showHelp` is false).
     *  - a specific tab id: panel opens on that tab. If the tab is disabled
     *    by `showDiagnostics`/`showResponses`/`showHelp`, falls back to the
     *    default with a `console.warn`.
     *  - `null`: panel mounts closed.
     * Reactive changes after mount are ignored — use the imperative ref handle
     * (`openDiagnosticsTab` / `closeDiagnosticsPanel`) for runtime control.
     */
    initialOpenTab?: DiagnosticsTabId | null;
};

/**
 * Combined DoenetML editor/viewer shell with diagnostics, responses, formatting, and variants.
 */
export const EditorViewer = React.forwardRef<
    DoenetEditorHandle,
    EditorViewerProps
>(function EditorViewer(
    {
        doenetML: initialDoenetML,
        activityId: specifiedActivityId,
        prefixForIds = "",
        doenetViewerUrl,
        doenetMediaUrl,
        darkMode = "light",
        showAnswerResponseButton = false,
        answerResponseCounts = {},
        width = "100%",
        height = "500px",
        showViewer = true,
        viewerLocation = "right",
        doenetmlChangeCallback,
        immediateDoenetmlChangeCallback,
        documentStructureCallback,
        diagnosticsSummaryCallback,
        id: specifiedId,
        readOnly = false,
        showFormatter = true,
        showDiagnostics = true,
        showResponses = true,
        showHelp = true,
        addVirtualKeyboard = false,
        border = "1px solid",
        initialDiagnostics = EMPTY_INITIAL_DIAGNOSTICS,
        fetchExternalDoenetML,
        docsURL = "https://docs.doenet.org",
        initialOpenTab,
    },
    ref,
) {
    //Win, Mac or Linux
    let platform = "Linux";
    if (navigator.platform.indexOf("Win") != -1) {
        platform = "Win";
    } else if (navigator.platform.indexOf("Mac") != -1) {
        platform = "Mac";
    }

    if (readOnly) {
        showFormatter = false;
    }
    if (!showViewer) {
        showResponses = false;
    }

    const lspRef = useRef<{ lsp: LSP; documentUri: string }>(null);
    const [id, setId] = useState(specifiedId ?? "editor-" + nanoid(5));
    const [activityId, setActivityId] = useState(specifiedActivityId ?? id);

    const [codeChanged, setCodeChanged] = useState(false);
    const [documentInteracted, setDocumentInteracted] = useState(false);
    const [updateWord, setUpdateWord] = useState("Reset");

    const codeChangedRef = useRef(false); //To keep value up to date in the code mirror function
    codeChangedRef.current = codeChanged;
    const documentInteractedRef = useRef(false); //To keep value up to date in the code mirror function
    documentInteractedRef.current = documentInteracted;

    const [viewerDoenetML, setViewerDoenetML] = useState(initialDoenetML);
    const lastReportedDoenetML = useRef(initialDoenetML);
    const editorDoenetMLRef = useRef(initialDoenetML);
    const [editorDoenetML, setEditorDoenetML] = useState(initialDoenetML);

    const updateValueTimer = useRef<number | null>(null);

    const viewerContainer = useRef<HTMLDivElement>(null);

    const [viewerResetNum, setViewerResetNum] = useState(0);

    const [variants, setVariants] = useState({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    // First enabled tab in the canonical order (help → errors → responses), or
    // `null` if no tabs are enabled. Used both for the `initialOpenTab` fallback
    // and as the tab store's `defaultSelectedId` when the panel mounts closed.
    function firstEnabledTab(): DiagnosticsTabId | null {
        if (showHelp) return "help";
        if (showDiagnostics) return "errors";
        if (showResponses) return "responses";
        return null;
    }

    // Resolve `initialOpenTab` once at mount:
    //  - `null`               → panel closed at mount
    //  - a specific tab id    → open on that tab (or fall back to default with
    //                            a warning if the tab is disabled)
    //  - `undefined` (omitted) → default: help (or first available tab)
    // The warning is emitted from an effect below so the initializer stays pure
    // (StrictMode double-invokes useState initializers in dev).
    const [{ resolvedInitialOpenTab, initialOpenTabWarning }] = useState<{
        resolvedInitialOpenTab: DiagnosticsTabId | null;
        initialOpenTabWarning: string | null;
    }>(() => {
        if (initialOpenTab === null) {
            return {
                resolvedInitialOpenTab: null,
                initialOpenTabWarning: null,
            };
        }
        if (initialOpenTab === undefined) {
            return {
                resolvedInitialOpenTab: firstEnabledTab(),
                initialOpenTabWarning: null,
            };
        }
        const tabEnabled =
            initialOpenTab === "responses"
                ? showResponses
                : initialOpenTab === "help"
                  ? showHelp
                  : showDiagnostics;
        if (!tabEnabled) {
            return {
                resolvedInitialOpenTab: firstEnabledTab(),
                initialOpenTabWarning: `DoenetEditor: initialOpenTab="${initialOpenTab}" is not enabled (showDiagnostics=${showDiagnostics}, showResponses=${showResponses}, showHelp=${showHelp}); falling back to default.`,
            };
        }
        return {
            resolvedInitialOpenTab: initialOpenTab,
            initialOpenTabWarning: null,
        };
    });

    useEffect(() => {
        if (initialOpenTabWarning) {
            console.warn(initialOpenTabWarning);
        }
    }, [initialOpenTabWarning]);

    const [infoPanelIsOpen, setInfoPanelIsOpen] = useState(
        resolvedInitialOpenTab !== null,
    );

    const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>([]);
    // Snapshot of the DoenetML the viewer was rendering when it last reported
    // diagnostics, captured at callback time so a later edit/save can't make
    // the source disagree with the diagnostics it produced.
    const [diagnosticsSource, setDiagnosticsSource] = useState(initialDoenetML);
    // Track whether we've received diagnostics from the viewer at least once.
    // This is used to gate when we call the diagnosticsSummaryCallback to avoid sending
    // just the initial diagnostics on load, which would be misleading since that
    // does not include most of the diagnostics, which are generated by the viewer.
    const [receivedDiagnosticsFromViewer, setReceivedDiagnosticsFromViewer] =
        useState(false);
    const [showInfoAnnotations, setShowInfoAnnotations] = useState(false);
    const [showAccessibilityAnnotations, setShowAccessibilityAnnotations] =
        useState(true);

    const [helpContent, setHelpContent] = useState<HelpContent>(HELP_NONE);
    const cursorDebounceTimer = useRef<number | undefined>(undefined);
    // Tracks the last cursor offset reported by CodeMirror, so the help
    // compute can be deferred until the help tab is actually visible
    // (and then re-run for the up-to-date cursor position when it opens).
    const lastCursorOffsetRef = useRef<number | null>(null);
    // Mirror of `infoPanelIsOpen && selectedTabId === "help"` accessible from
    // the stable `onCursorChange` callback without re-binding it on every
    // visibility change.
    const helpIsVisibleRef = useRef(false);
    // The currently-highlighted autocomplete row, mirrored from CodeMirror's
    // `selectedCompletion(state)`. When non-null, the help panel reflects this
    // row instead of the cursor position. Tracked as a ref (not state) so the
    // stable cursor handler can early-return without re-binding.
    const selectedCompletionRef = useRef<Completion | null>(null);
    // Monotonic counter for help RPCs.  Every cursor/completion change bumps
    // it; only responses whose captured ID still matches `current` commit
    // their `HelpContent` to state.  Drops stale responses without needing
    // JSON-RPC cancellation (issue #1086 / Option 4).
    const helpRequestIdRef = useRef(0);

    // Wall-clock time of the most recent source-change reset.  Used by
    // `runHelpRequest` to retry on a brief delay if a help RPC arrives
    // before the LSP server has finished processing the source update.
    // The `textDocument/didChange` notification is fire-and-forget, so
    // `lspPlugin.updateDocument` can return before `documentInfo.get(uri)`
    // is populated server-side — under CI load that race is wide enough to
    // surface as a flaky `{kind: "none"}` response.  Outside the post-update
    // window (3s) we don't retry: a non-stale NONE is a real "no help here"
    // answer, not a sync race.
    const lastSourceResetAtRef = useRef(0);
    const helpRetryTimerRef = useRef<number | undefined>(undefined);

    // When all tabs are disabled, the panel pair isn't rendered, so the
    // store's selectedId is unobservable — `undefined` is fine.
    const tabStore = useTabStore({
        defaultSelectedId:
            resolvedInitialOpenTab ?? firstEnabledTab() ?? undefined,
    });
    const selectedTabId = tabStore.useState("selectedId");
    const isAccessibilityReportOpen =
        infoPanelIsOpen && selectedTabId === "accessibility";

    /**
     * Toggle behavior shared by the footer icons and the viewer-controls
     * accessibility status button: clicking the currently-selected tab while
     * the panel is open closes it; any other click selects the tab and opens.
     *
     * `tabStore.setSelectedId(tabId)` is redundant when this fires from an
     * ariakit `<Tab>` click (the Tab's internal handler has already updated
     * the store), but it covers the "panel was closed, reopen on this tab"
     * branch and the call from ViewerControlsBar's accessibility button, both
     * of which need to select the tab explicitly.
     */
    const activateTab = useCallback(
        (tabId: DiagnosticsTabId) => {
            if (infoPanelIsOpen && selectedTabId === tabId) {
                setInfoPanelIsOpen(false);
                return;
            }
            tabStore.setSelectedId(tabId);
            setInfoPanelIsOpen(true);
        },
        [infoPanelIsOpen, selectedTabId, tabStore],
    );

    const toggleAccessibilityReport = useCallback(
        () => activateTab("accessibility"),
        [activateTab],
    );

    // Shared between the "Update" button click, the Ctrl/Cmd-S keyboard
    // shortcut, and the imperative `updateRenderedView()` ref method. Reads
    // via refs and early-returns when nothing has changed so the programmatic
    // call is a true no-op (no spurious `setResponses([])` re-render). For
    // the button this guard is invisible (the button is disabled when both
    // `codeChanged` and `documentInteracted` are false).
    const updateViewer = useCallback(() => {
        if (!codeChangedRef.current && !documentInteractedRef.current) {
            return;
        }

        setDocumentInteracted(false);
        setResponses([]);

        if (codeChangedRef.current) {
            setViewerDoenetML(editorDoenetMLRef.current);
            window.clearTimeout(updateValueTimer.current ?? undefined);
            if (lastReportedDoenetML.current !== editorDoenetMLRef.current) {
                lastReportedDoenetML.current = editorDoenetMLRef.current;
                if (!showViewer) {
                    doenetmlChangeCallbackRef.current?.(
                        editorDoenetMLRef.current,
                    );
                }
            }
            setCodeChanged(false);
            updateValueTimer.current = null;
        } else {
            // documentInteractedRef.current is true here (the early-return
            // above excludes the both-false case).
            setViewerResetNum((n) => n + 1);
        }
    }, [showViewer]);

    useImperativeHandle(
        ref,
        () => ({
            openDiagnosticsTab(tabId: DiagnosticsTabId) {
                const tabEnabled =
                    tabId === "responses"
                        ? showResponses
                        : tabId === "help"
                          ? showHelp
                          : showDiagnostics;
                if (!tabEnabled) {
                    console.warn(
                        `DoenetEditor: openDiagnosticsTab("${tabId}") ignored — tab is not enabled (showDiagnostics=${showDiagnostics}, showResponses=${showResponses}, showHelp=${showHelp}).`,
                    );
                    return;
                }
                tabStore.setSelectedId(tabId);
                setInfoPanelIsOpen(true);
            },
            closeDiagnosticsPanel() {
                setInfoPanelIsOpen(false);
            },
            updateRenderedView() {
                if (!showViewer) {
                    console.warn(
                        "DoenetEditor: updateRenderedView() ignored — showViewer is false; nothing to update.",
                    );
                    return;
                }
                updateViewer();
            },
        }),
        [
            tabStore,
            showDiagnostics,
            showResponses,
            showHelp,
            showViewer,
            updateViewer,
        ],
    );

    /** Receives diagnostics from DocViewer and stores them for panel/LSP sync. */
    function setDiagnosticsCallback(
        newDiagnostics: DiagnosticRecord[],
        source: string,
    ) {
        setDiagnostics(newDiagnostics);
        setDiagnosticsSource(source);
        setReceivedDiagnosticsFromViewer(true);
    }

    useEffect(() => {
        const additionalDiagnostics = toAdditionalDiagnosticsForLsp({
            diagnostics: [...initialDiagnostics, ...diagnostics],
            showInfoAnnotations,
            showAccessibilityAnnotations,
        });

        lspRef.current?.lsp.sendAdditionalDiagnostics(
            lspRef.current.documentUri,
            additionalDiagnostics,
        );
    }, [
        initialDiagnostics,
        diagnostics,
        showInfoAnnotations,
        showAccessibilityAnnotations,
    ]);

    const {
        warnings: warningsObjs,
        errors: errorsObjs,
        infos: infoObjs,
        accessibility: accessibilityObjs,
        warningsCount,
        errorsCount,
        infosCount,
        accessibilityLevel1Count,
        accessibilityLevel2Count,
    } = useMemo(
        () =>
            mergeDiagnosticsByType({
                initialDiagnostics,
                diagnostics,
            }),
        [initialDiagnostics, diagnostics],
    );

    // Hold consumer-supplied callbacks in refs so inline-callback identity
    // churn (the common case) doesn't invalidate the `useCallback`/`useEffect`
    // deps below — which would otherwise re-identify `useImperativeHandle`'s
    // output on every parent render. Sync happens at render time (not in a
    // `useEffect`) so `*Ref.current` always holds the latest prop, even if a
    // callback fires from a parent `useLayoutEffect` between commit and
    // effect flush; this also lets the unmount cleanup (empty-dep `useEffect`
    // below) read the latest value rather than a stale closure.
    const diagnosticsSummaryCallbackRef = useRef(diagnosticsSummaryCallback);
    diagnosticsSummaryCallbackRef.current = diagnosticsSummaryCallback;
    const doenetmlChangeCallbackRef = useRef(doenetmlChangeCallback);
    doenetmlChangeCallbackRef.current = doenetmlChangeCallback;
    const immediateDoenetmlChangeCallbackRef = useRef(
        immediateDoenetmlChangeCallback,
    );
    immediateDoenetmlChangeCallbackRef.current =
        immediateDoenetmlChangeCallback;
    const documentStructureCallbackRef = useRef(documentStructureCallback);
    documentStructureCallbackRef.current = documentStructureCallback;

    useEffect(() => {
        // On initial load of the editor, don't call `diagnosticsSummaryCallback`
        // until the viewer has sent diagnostics so avoid sending just the initial diagnostics.
        // We do not need to reset `receivedDiagnosticsFromViewer`, as this guard is just
        // needed to avoid calling `diagnosticsSummaryCallback` on the initial load of the editor.
        if (!receivedDiagnosticsFromViewer) {
            return;
        }

        diagnosticsSummaryCallbackRef.current?.(
            {
                warningsCount,
                errorsCount,
                infosCount,
                accessibilityLevel1Count,
                accessibilityLevel2Count,
            },
            diagnosticsSource,
        );
        // Fire once per viewer-generated `diagnostics` change rather than per
        // count change — the consumer should treat this as an event, not a memoized value.
        // `initialDiagnostics` is intentionally excluded from the deps: those are
        // owned by the parent, which already knows the source they were computed
        // against, so re-firing on their identity change would only emit a
        // `diagnosticsSource` paired with viewer-generated diagnostics that didn't
        // actually change.
    }, [diagnostics, receivedDiagnosticsFromViewer, diagnosticsSource]);

    const [responses, setResponses] = useState<
        {
            answerId: string;
            response: ReactElement;
            creditAchieved: number;
            submittedAt: string;
        }[]
    >([]);

    useEffect(() => setResponses([]), [initialDoenetML]);

    useEffect(() => {
        function submittedResponseListener(event: any) {
            if (event.data.subject == "SPLICE.sendEvent") {
                const data = event.data.data;
                if (data.activityId !== activityId) {
                    return;
                }

                if (data.verb !== "experienced" && data.verb !== "isVisible") {
                    setDocumentInteracted(true);
                    if (!codeChangedRef.current) {
                        setUpdateWord("Reset");
                    }
                }
                if (data.verb === "submitted") {
                    const object = JSON.parse(data.object);
                    const answerId = object.rootName;

                    if (answerId) {
                        const result = JSON.parse(
                            data.result,
                            nanInfinityReviver,
                        );
                        const answerCreditAchieved = result.creditAchieved;
                        const response: unknown[] | undefined = result.response;
                        const componentTypes: string[] | undefined =
                            result.componentTypes;

                        if (
                            response !== undefined &&
                            componentTypes !== undefined &&
                            response.length === componentTypes.length
                        ) {
                            const responseElement = formatResponse(
                                response,
                                componentTypes,
                            );

                            setResponses((was) => {
                                const arr = [...was];
                                arr.push({
                                    answerId,
                                    response: responseElement,
                                    creditAchieved: answerCreditAchieved,
                                    submittedAt:
                                        new Date().toLocaleTimeString(),
                                });
                                return arr;
                            });
                        }
                    }
                }
            }
        }

        addEventListener("message", submittedResponseListener);

        return () => {
            removeEventListener("message", submittedResponseListener);
        };
    }, [activityId]);

    useEffect(() => {
        editorDoenetMLRef.current = initialDoenetML;
        setEditorDoenetML(initialDoenetML);
        // Cancel any in-flight cursor debounce so a pending callback can't
        // fire a help RPC with a stale offset against the new source.  The
        // LSP-side source is kept in sync via the CodeMirror plugin's normal
        // `updateDocument` path; no local completer to refresh.
        window.clearTimeout(cursorDebounceTimer.current);
        window.clearTimeout(helpRetryTimerRef.current);
        // Bump the request ID so any in-flight help RPC's response is
        // dropped on arrival rather than overwriting the reset state.
        helpRequestIdRef.current += 1;
        setHelpContent(HELP_NONE);
        // Record so `runHelpRequest` can retry once on a NONE result that
        // landed during the LSP-server's post-update sync window.
        lastSourceResetAtRef.current = Date.now();
    }, [initialDoenetML]);

    // call documentStructure callback followed by doenetmlChangeCallback
    // so that one can have access to the document structure before a
    // save in response to doenetmlChangeCallback
    const documentStructureThenChangeCallback = useCallback((obj: unknown) => {
        documentStructureCallbackRef.current?.(obj);
        doenetmlChangeCallbackRef.current?.(editorDoenetMLRef.current);
    }, []);

    const onEditorChange = useCallback((value: string) => {
        if (editorDoenetMLRef.current !== value) {
            editorDoenetMLRef.current = value;
            // The LSP-side `AutoCompleter` is kept in sync by the CodeMirror
            // plugin's `updateDocument` path; no local completer to refresh
            // here (issue #1086 / Option 4).

            if (!codeChangedRef.current) {
                setCodeChanged(true);
                setUpdateWord("Update");
            }

            immediateDoenetmlChangeCallbackRef.current?.(value);

            // Debounce update value at 3 seconds
            clearTimeout(updateValueTimer.current ?? undefined);

            //TODO: when you try to leave the page before it saved you will lose work
            //so prompt the user on page leave
            updateValueTimer.current = window.setTimeout(function () {
                if (
                    lastReportedDoenetML.current !== editorDoenetMLRef.current
                ) {
                    lastReportedDoenetML.current = editorDoenetMLRef.current;
                    doenetmlChangeCallbackRef.current?.(
                        editorDoenetMLRef.current,
                    );
                }
                updateValueTimer.current = null;
            }, 3000); //3 seconds
        }
    }, []);

    const onBlur = useCallback(() => {
        window.clearTimeout(updateValueTimer.current ?? undefined);
        if (lastReportedDoenetML.current !== editorDoenetMLRef.current) {
            lastReportedDoenetML.current = editorDoenetMLRef.current;
            doenetmlChangeCallbackRef.current?.(editorDoenetMLRef.current);
        }
        updateValueTimer.current = null;
    }, []);

    // Help-RPC plumbing.  Every send bumps `helpRequestIdRef` and captures
    // its own ID; the response only commits to state if the captured ID is
    // still current and the help tab is still visible.  Newest-request-wins
    // ordering, no JSON-RPC cancellation needed (issue #1086 / Option 4).
    //
    // The two flavours (cursor-driven and completion-driven) share the
    // ID/visibility/error guards via `runHelpRequest` — only the underlying
    // RPC call differs.  Keeping the guards in one place means a fix in
    // either dimension (e.g. revising stale-drop policy) doesn't have to
    // be mirrored.
    const runHelpRequest = useCallback(
        async (
            warnLabel: string,
            rpc: (bundle: {
                lsp: LSP;
                documentUri: string;
            }) => Promise<HelpContent>,
        ) => {
            const myId = ++helpRequestIdRef.current;
            const bundle = lspRef.current;
            if (!bundle) {
                // Symmetry with the post-await branches: only commit
                // state when the help panel is actually visible.  An
                // invisible panel already shows HELP_NONE, and the
                // visibility-becomes-visible effect will re-fetch on its
                // own when the panel opens.
                if (helpIsVisibleRef.current) setHelpContent(HELP_NONE);
                return;
            }
            try {
                const result = await rpc(bundle);
                if (myId !== helpRequestIdRef.current) return;
                if (!helpIsVisibleRef.current) return;
                setHelpContent(result);
                // If we got NONE within the post-source-change window, the
                // server's `documents.onDidChangeContent` handler may not
                // have finished registering the new source yet (`didChange`
                // is fire-and-forget; the editor's `lspPlugin.setValue`
                // returns before the server's `documentInfo` map is
                // populated). Schedule a retry. A real cursor change or new
                // source reset will bump `helpRequestIdRef` and invalidate
                // this retry chain. The 3-second budget is generous enough
                // for slow CI runners; in healthy local runs the first
                // request lands a real answer and we never enter this
                // branch.
                if (
                    result.kind === "none" &&
                    Date.now() - lastSourceResetAtRef.current < 3000
                ) {
                    const retryId = myId;
                    window.clearTimeout(helpRetryTimerRef.current);
                    helpRetryTimerRef.current = window.setTimeout(() => {
                        if (retryId !== helpRequestIdRef.current) return;
                        if (!helpIsVisibleRef.current) return;
                        void runHelpRequest(warnLabel, rpc);
                    }, 400);
                }
            } catch (err) {
                if (myId !== helpRequestIdRef.current) return;
                console.warn(`${warnLabel} request failed`, err);
                if (!helpIsVisibleRef.current) return;
                setHelpContent(HELP_NONE);
            }
        },
        [],
    );

    const requestHelpForCursor = useCallback(
        (offset: number) =>
            runHelpRequest("contextHelp", (bundle) =>
                bundle.lsp.requestContextHelp(bundle.documentUri, offset),
            ),
        [runHelpRequest],
    );

    const requestHelpForCompletion = useCallback(
        (offset: number, completion: Completion) =>
            runHelpRequest("contextHelpForCompletion", (bundle) =>
                bundle.lsp.requestContextHelpForCompletion(
                    bundle.documentUri,
                    offset,
                    { label: completion.label, type: completion.type },
                ),
            ),
        [runHelpRequest],
    );

    const onCursorChange = useCallback(
        (selection: EditorSelection) => {
            const offset = selection.main.head;
            lastCursorOffsetRef.current = offset;
            window.clearTimeout(cursorDebounceTimer.current);
            // Skip the RPC when no one's looking — the help-becoming-visible
            // effect below will compute on demand for the current cursor.
            if (!helpIsVisibleRef.current) return;
            // Completion-driven help wins while the autocomplete popup is open.
            // The completion change handler is authoritative; don't overwrite
            // or schedule a debounced overwrite from the cursor.
            if (selectedCompletionRef.current) return;
            cursorDebounceTimer.current = window.setTimeout(() => {
                void requestHelpForCursor(offset);
            }, 150);
        },
        [requestHelpForCursor],
    );

    // Fires when the highlighted autocomplete option changes (including
    // popup open/close).  No debounce — arrow-key navigation in the popup
    // should surface its docs immediately.
    const onSelectedCompletionChange = useCallback(
        (completion: Completion | null) => {
            selectedCompletionRef.current = completion;
            if (!helpIsVisibleRef.current) return;
            // Cancel any pending cursor-debounce so it doesn't fire after
            // and clobber the completion-driven help.
            window.clearTimeout(cursorDebounceTimer.current);
            const offset = lastCursorOffsetRef.current;
            if (offset == null) return;
            if (completion) {
                void requestHelpForCompletion(offset, completion);
            } else {
                // Popup closed — revert to cursor-based help for the current
                // position.  No debounce: this is a discrete transition, not
                // a stream of cursor moves.
                void requestHelpForCursor(offset);
            }
        },
        [requestHelpForCursor, requestHelpForCompletion],
    );

    // Track help-tab visibility and (a) keep the ref synced for onCursorChange,
    // (b) compute help immediately when the tab becomes visible so the user
    // doesn't see a stale/empty panel, (c) reset to NONE when it hides so the
    // panel doesn't flash old content on next open.
    useEffect(() => {
        const visible = infoPanelIsOpen && selectedTabId === "help";
        helpIsVisibleRef.current = visible;
        if (!visible) {
            // Cancel any in-flight debounced compute scheduled while help was
            // visible — otherwise it would fire after we set HELP_NONE here
            // and repopulate state for an invisible panel (flashing on next
            // open).
            window.clearTimeout(cursorDebounceTimer.current);
            // Bump the request ID so any in-flight RPC's response is dropped
            // when it resolves (the visibility guard also drops it, but this
            // makes the intent explicit).
            helpRequestIdRef.current += 1;
            setHelpContent(HELP_NONE);
            return;
        }
        const offset = lastCursorOffsetRef.current;
        if (offset == null) return;
        const completion = selectedCompletionRef.current;
        if (completion) {
            void requestHelpForCompletion(offset, completion);
        } else {
            void requestHelpForCursor(offset);
        }
    }, [
        infoPanelIsOpen,
        selectedTabId,
        requestHelpForCursor,
        requestHelpForCompletion,
    ]);

    useEffect(() => {
        const handleEditorKeyDown = (event: KeyboardEvent) => {
            if (
                (platform == "Mac" &&
                    event.metaKey &&
                    !event.altKey &&
                    event.code === "KeyS") ||
                (platform != "Mac" &&
                    event.ctrlKey &&
                    !event.altKey &&
                    event.code === "KeyS")
            ) {
                event.preventDefault();
                event.stopPropagation();
                updateViewer();
            }
        };

        let codeEditorContainer = document.getElementById(id);
        let viewerPanelContainer = viewerContainer.current;
        if (showViewer) {
            codeEditorContainer?.addEventListener(
                "keydown",
                handleEditorKeyDown,
            );
            // Also listen on the viewer panel so the shortcut works when focus
            // is in the rendered document. The viewer container has
            // tabIndex={-1}, so clicking non-focusable content (e.g. plain
            // text) keeps focus within it rather than falling back to
            // document.body, which would bypass this listener.
            viewerPanelContainer?.addEventListener(
                "keydown",
                handleEditorKeyDown,
            );
        }

        return () => {
            codeEditorContainer?.removeEventListener(
                "keydown",
                handleEditorKeyDown,
            );
            viewerPanelContainer?.removeEventListener(
                "keydown",
                handleEditorKeyDown,
            );
        };
    }, [showViewer, id, updateViewer, platform]);

    useEffect(() => {
        return () => {
            if (updateValueTimer.current !== null) {
                window.clearTimeout(updateValueTimer.current);
                if (
                    lastReportedDoenetML.current !== editorDoenetMLRef.current
                ) {
                    lastReportedDoenetML.current = editorDoenetMLRef.current;
                    // Routed through the ref mirror so the *latest* callback
                    // fires at unmount, not whichever one was passed on
                    // initial render. (The empty dep array would otherwise
                    // capture a stale closure.)
                    doenetmlChangeCallbackRef.current?.(
                        editorDoenetMLRef.current,
                    );
                }
            }
            // Cancel pending help-debounce and post-source-change retry so
            // their callbacks can't fire setHelpContent on the unmounted
            // component.
            window.clearTimeout(cursorDebounceTimer.current);
            window.clearTimeout(helpRetryTimerRef.current);
        };
    }, []);

    const codeMirror = (
        <CodeMirror
            value={editorDoenetML}
            readOnly={readOnly}
            onBlur={onBlur}
            onChange={onEditorChange}
            onCursorChange={onCursorChange}
            onSelectedCompletionChange={onSelectedCompletionChange}
            languageServerRef={lspRef}
            doenetWorkerUrl={doenetGlobalConfig.doenetWorkerUrl}
        />
    );

    const editorAndCollapsiblePanel =
        showDiagnostics || showResponses || showHelp ? (
            <ResizableCollapsiblePanelPair
                mainPanel={codeMirror}
                subPanel={
                    <DiagnosticsResponseTabContents
                        store={tabStore}
                        warnings={warningsObjs}
                        errors={errorsObjs}
                        infos={infoObjs}
                        accessibility={accessibilityObjs}
                        submittedResponses={responses}
                        isOpen={infoPanelIsOpen}
                        showDiagnostics={showDiagnostics}
                        showResponses={showResponses}
                        showHelp={showHelp}
                        showInfoAnnotations={showInfoAnnotations}
                        setShowInfoAnnotations={setShowInfoAnnotations}
                        showAccessibilityAnnotations={
                            showAccessibilityAnnotations
                        }
                        setShowAccessibilityAnnotations={
                            setShowAccessibilityAnnotations
                        }
                        helpContent={helpContent}
                        docsURL={docsURL}
                    />
                }
                isOpen={infoPanelIsOpen}
                setIsOpen={setInfoPanelIsOpen}
                defaultSize={25}
                collapsedSize={10}
            />
        ) : (
            codeMirror
        );

    const editorPanel = (
        <div className="editor-panel" id={id}>
            <div className="editor-and-collapsible-panel">
                {editorAndCollapsiblePanel}
            </div>
            <EditorFooter
                store={tabStore}
                isOpen={infoPanelIsOpen}
                activateTab={activateTab}
                showDiagnostics={showDiagnostics}
                showResponses={showResponses}
                showHelp={showHelp}
                showFormatter={showFormatter}
                reserveKeyboardButtonSpace={
                    addVirtualKeyboard &&
                    (!showViewer ||
                        viewerLocation === "left" ||
                        viewerLocation === "top")
                }
                diagnosticsSummary={{
                    warningsCount,
                    errorsCount,
                    infosCount,
                    accessibilityLevel1Count,
                    accessibilityLevel2Count,
                }}
                submittedResponsesCount={responses.length}
                onFormat={async (asDoenetML) => {
                    const currentBuffer = editorDoenetMLRef.current;
                    const printed = await prettyPrint(currentBuffer, {
                        doenetSyntax: asDoenetML,
                        tabWidth: 2,
                    });
                    onEditorChange(printed);
                    // CodeMirror's `value` prop is controlled by
                    // `editorDoenetML`. If the user undid a previous format
                    // (e.g. Ctrl+Z), the React state still holds the
                    // already-formatted string while the buffer holds the
                    // pre-format text. A naïve `setEditorDoenetML(printed)`
                    // would then be an `Object.is` no-op and CodeMirror
                    // would never see a new value. Flushing an intermediate
                    // sync to `currentBuffer` guarantees the next setter
                    // dispatches a real value change.
                    if (printed !== currentBuffer) {
                        flushSync(() => setEditorDoenetML(currentBuffer));
                    }
                    setEditorDoenetML(printed);
                }}
            />
        </div>
    );

    if (!showViewer) {
        return (
            <div
                style={{
                    display: "flex",
                    width: width,
                    height: height,
                    border: border,
                    boxSizing: "border-box",
                }}
            >
                {editorPanel}
            </div>
        );
    }

    /** Scroll callback passed to viewer content so deep links align below the control row. */
    function requestScrollTo(offset: number) {
        if (viewerContainer.current) {
            viewerContainer.current.scrollTo({
                top: offset - 40,
                behavior: "smooth",
            });
        }
    }

    const viewerPanel = (
        <div className="viewer-panel" id={id + "-viewer-panel"}>
            <ViewerControlsBar
                id={id}
                readOnly={readOnly}
                codeChanged={codeChanged}
                documentInteracted={documentInteracted}
                platform={platform as "Mac" | "Win" | "Linux"}
                updateWord={updateWord}
                onUpdateViewer={updateViewer}
                variants={variants}
                setVariants={setVariants}
                showDiagnostics={showDiagnostics}
                accessibilityLevel1Count={accessibilityLevel1Count}
                accessibilityLevel2Count={accessibilityLevel2Count}
                isAccessibilityReportOpen={isAccessibilityReportOpen}
                onToggleAccessibilityReport={toggleAccessibilityReport}
            />
            <div
                className="viewer"
                id={id + "-viewer"}
                ref={viewerContainer}
                tabIndex={-1}
            >
                <DocViewer
                    doenetML={viewerDoenetML}
                    flags={{
                        showCorrectness: true,
                        solutionDisplayMode: "button",
                        showFeedback: true,
                        showHints: true,
                        autoSubmit: false,
                        allowLoadState: false,
                        allowSaveState: false,
                        saveRendererState: false,
                        allowLocalState: false,
                        allowSaveEvents: true,
                        messageParent: false,
                        readOnly: false,
                    }}
                    activityId={activityId}
                    key={viewerResetNum}
                    prefixForIds={prefixForIds}
                    attemptNumber={1}
                    generatedVariantCallback={(x: any) => {
                        setVariantsFromCallback(x, variants, setVariants);
                    }}
                    requestedVariantIndex={variants.index}
                    setDiagnosticsCallback={setDiagnosticsCallback}
                    documentStructureCallback={
                        documentStructureThenChangeCallback
                    }
                    doenetViewerUrl={doenetViewerUrl}
                    doenetMediaUrl={doenetMediaUrl}
                    darkMode={darkMode}
                    showAnswerResponseButton={showAnswerResponseButton}
                    answerResponseCounts={answerResponseCounts}
                    fetchExternalDoenetML={fetchExternalDoenetML}
                    requestScrollTo={requestScrollTo}
                />
            </div>
        </div>
    );

    const viewerFirst = viewerLocation === "left" || viewerLocation === "top";

    return (
        <ResizablePanelPair
            panelA={viewerFirst ? viewerPanel : editorPanel}
            panelB={viewerFirst ? editorPanel : viewerPanel}
            preferredDirection={
                viewerLocation === "bottom" || viewerLocation === "top"
                    ? "vertical"
                    : "horizontal"
            }
            width={width}
            height={height}
            border={border}
        />
    );
});
