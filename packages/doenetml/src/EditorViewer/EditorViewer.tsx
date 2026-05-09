import React, {
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ResizablePanelPair } from "@doenet/ui-components";
import { CodeMirror, LSP } from "@doenet/codemirror";
import "@doenet/codemirror/style.css";
import { DocViewer } from "../Viewer/DocViewer";
import {
    DiagnosticsResponseTabContents,
    DiagnosticsResponseTabstrip,
} from "./DiagnosticsResponseTabs";
import { DiagnosticRecord, nanInfinityReviver } from "@doenet/utils";
import { nanoid } from "nanoid";
import { prettyPrint } from "@doenet/parser/pretty-printer";
import { formatResponse } from "../utils/responses";
import { ResizableCollapsiblePanelPair } from "@doenet/ui-components";
import { FormatterVersionBar } from "./FormatterVersionBar";
import { ViewerControlsBar } from "./ViewerControlsBar";
import "./editor-viewer.css";
import { useTabStore } from "@ariakit/react";
import { setVariantsFromCallback } from "../utils/variants";
import type { DiagnosticsSummary } from "./diagnostics";
import {
    mergeDiagnosticsByType,
    toAdditionalDiagnosticsForLsp,
} from "./diagnostics";
import { AutoCompleter } from "@doenet/lsp-tools";
import { computeContextHelp } from "./contextHelp/computeContextHelp";
import type { HelpContent } from "./contextHelp/types";
import { EditorSelection } from "@codemirror/state";

const HELP_NONE: HelpContent = { kind: "none" };

// Module-level constant so the default for `initialDiagnostics` is referentially
// stable across renders. A parameter default `= []` would create a fresh array
// each render, refiring every effect/memo that depends on `initialDiagnostics`.
const EMPTY_INITIAL_DIAGNOSTICS: DiagnosticRecord[] = [];

/**
 * Combined DoenetML editor/viewer shell with diagnostics, responses, formatting, and variants.
 */
export function EditorViewer({
    doenetML: initialDoenetML,
    activityId: specifiedActivityId,
    prefixForIds = "",
    doenetViewerUrl,
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
    border = "1px solid",
    initialDiagnostics = EMPTY_INITIAL_DIAGNOSTICS,
    fetchExternalDoenetML,
    docsURL = "https://docs.doenet.org",
}: {
    doenetML: string;
    activityId?: string;
    prefixForIds?: string;
    doenetViewerUrl?: string;
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
    ) => void;
    id?: string;
    readOnly?: boolean;
    showFormatter?: boolean;
    showDiagnostics?: boolean;
    showResponses?: boolean;
    border?: string;
    initialDiagnostics?: DiagnosticRecord[];
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    docsURL?: string;
}) {
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

    const [formatAsDoenetML, setFormatAsDoenetML] = useState(true);

    const updateValueTimer = useRef<number | null>(null);

    const viewerContainer = useRef<HTMLDivElement>(null);

    const [viewerResetNum, setViewerResetNum] = useState(0);

    const [variants, setVariants] = useState({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    const [infoPanelIsOpen, setInfoPanelIsOpen] = useState(false);

    const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>([]);
    // Track whether we've received diagnostics from the viewer at least once.
    // This is used to gate when we call the diagnosticsSummaryCallback to avoid sending
    // just the initial diagnostics on load, which would be misleading since that
    // does not include most of the diagnostics, which are generated by the viewer.
    const [receivedDiagnosticsFromViewer, setReceivedDiagnosticsFromViewer] =
        useState(false);
    const [showInfoAnnotations, setShowInfoAnnotations] = useState(false);

    const completerRef = useRef(new AutoCompleter(initialDoenetML));
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

    const tabStore = useTabStore({
        defaultSelectedId: showDiagnostics ? "errors" : "responses",
    });
    const selectedTabId = tabStore.useState("selectedId");
    const isAccessibilityReportOpen =
        infoPanelIsOpen && selectedTabId === "accessibility";

    /** Opens accessibility diagnostics, or closes the panel if already focused there. */
    function toggleAccessibilityReport() {
        if (infoPanelIsOpen && selectedTabId === "accessibility") {
            setInfoPanelIsOpen(false);
            return;
        }

        tabStore.setSelectedId("accessibility");
        setInfoPanelIsOpen(true);
    }

    /** Receives diagnostics from DocViewer and stores them for panel/LSP sync. */
    function setDiagnosticsCallback(newDiagnostics: DiagnosticRecord[]) {
        setDiagnostics(newDiagnostics);
        setReceivedDiagnosticsFromViewer(true);
    }

    useEffect(() => {
        const additionalDiagnostics = toAdditionalDiagnosticsForLsp({
            diagnostics: [...initialDiagnostics, ...diagnostics],
            showInfoAnnotations,
        });

        lspRef.current?.lsp.sendAdditionalDiagnostics(
            lspRef.current.documentUri,
            additionalDiagnostics,
        );
    }, [initialDiagnostics, diagnostics, showInfoAnnotations]);

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

    // Hold the latest `diagnosticsSummaryCallback` in a ref so inline callbacks
    // (whose identity changes every parent render) don't retrigger the effect below
    // and cause unbounded recursion when the consumer stores the summary in state.
    const diagnosticsSummaryCallbackRef = useRef(diagnosticsSummaryCallback);
    useEffect(() => {
        diagnosticsSummaryCallbackRef.current = diagnosticsSummaryCallback;
    }, [diagnosticsSummaryCallback]);

    useEffect(() => {
        // On initial load of the editor, don't call `diagnosticsSummaryCallback`
        // until the viewer has sent diagnostics so avoid sending just the initial diagnostics.
        // We do not need to reset `receivedDiagnosticsFromViewer`, as this guard is just
        // needed to avoid calling `diagnosticsSummaryCallback` on the initial load of the editor.
        if (!receivedDiagnosticsFromViewer) {
            return;
        }

        diagnosticsSummaryCallbackRef.current?.({
            warningsCount,
            errorsCount,
            infosCount,
            accessibilityLevel1Count,
            accessibilityLevel2Count,
        });
        // Fire once per `diagnostics`/`initialDiagnostics` change rather than per
        // count change — the consumer should treat this as an event, not a memoized value.
    }, [diagnostics, initialDiagnostics, receivedDiagnosticsFromViewer]);

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
    }, [showViewer]);

    useEffect(() => {
        editorDoenetMLRef.current = initialDoenetML;
        setEditorDoenetML(initialDoenetML);
        completerRef.current.setSource(initialDoenetML);
        // Cancel any in-flight cursor debounce so a pending callback
        // can't fire `computeContextHelp` with a stale offset against
        // the new source.
        window.clearTimeout(cursorDebounceTimer.current);
        setHelpContent(HELP_NONE);
    }, [initialDoenetML]);

    // call documentStructure callback followed by doenetmlChangeCallback
    // so that one can have access to the document structure before a
    // save in response to doenetmlChangeCallback
    const documentStructureThenChangeCallback = useCallback(
        (obj: unknown) => {
            documentStructureCallback?.(obj);
            doenetmlChangeCallback?.(editorDoenetMLRef.current);
        },
        [documentStructureCallback, doenetmlChangeCallback],
    );

    const onEditorChange = useCallback(
        (value: string) => {
            if (editorDoenetMLRef.current !== value) {
                editorDoenetMLRef.current = value;
                completerRef.current.setSource(value);

                if (!codeChangedRef.current) {
                    setCodeChanged(true);
                    setUpdateWord("Update");
                }

                immediateDoenetmlChangeCallback?.(value);

                // Debounce update value at 3 seconds
                clearTimeout(updateValueTimer.current ?? undefined);

                //TODO: when you try to leave the page before it saved you will lose work
                //so prompt the user on page leave
                updateValueTimer.current = window.setTimeout(function () {
                    if (
                        lastReportedDoenetML.current !==
                        editorDoenetMLRef.current
                    ) {
                        lastReportedDoenetML.current =
                            editorDoenetMLRef.current;
                        doenetmlChangeCallback?.(editorDoenetMLRef.current);
                    }
                    updateValueTimer.current = null;
                }, 3000); //3 seconds
            }
        },
        [immediateDoenetmlChangeCallback, doenetmlChangeCallback],
    );

    const onBlur = useCallback(() => {
        window.clearTimeout(updateValueTimer.current ?? undefined);
        if (lastReportedDoenetML.current !== editorDoenetMLRef.current) {
            lastReportedDoenetML.current = editorDoenetMLRef.current;
            doenetmlChangeCallback?.(editorDoenetMLRef.current);
        }
        updateValueTimer.current = null;
    }, [
        doenetmlChangeCallback,
        updateValueTimer,
        lastReportedDoenetML,
        editorDoenetMLRef,
    ]);

    const onCursorChange = useCallback((selection: EditorSelection) => {
        const offset = selection.main.head;
        lastCursorOffsetRef.current = offset;
        window.clearTimeout(cursorDebounceTimer.current);
        // Skip the parse/schema walk when no one's looking — the help-becoming-
        // visible effect below will compute on demand for the current cursor.
        if (!helpIsVisibleRef.current) return;
        cursorDebounceTimer.current = window.setTimeout(() => {
            setHelpContent(
                computeContextHelp(completerRef.current, offset),
            );
        }, 150);
    }, []);

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
            setHelpContent(HELP_NONE);
            return;
        }
        const offset = lastCursorOffsetRef.current;
        if (offset == null) return;
        setHelpContent(
            computeContextHelp(completerRef.current, offset),
        );
    }, [infoPanelIsOpen, selectedTabId]);

    useEffect(() => {
        const handleEditorKeyDown = (event: KeyboardEvent) => {
            if (
                (platform == "Mac" && event.metaKey && event.code === "KeyS") ||
                (platform != "Mac" && event.ctrlKey && event.code === "KeyS")
            ) {
                event.preventDefault();
                event.stopPropagation();
                window.clearTimeout(updateValueTimer.current ?? undefined);
                updateValueTimer.current = null;

                setDocumentInteracted(false);
                setResponses([]);

                if (codeChangedRef.current) {
                    setViewerDoenetML(editorDoenetMLRef.current);
                    if (
                        lastReportedDoenetML.current !==
                        editorDoenetMLRef.current
                    ) {
                        lastReportedDoenetML.current =
                            editorDoenetMLRef.current;
                        if (!showViewer) {
                            doenetmlChangeCallback?.(editorDoenetMLRef.current);
                        }
                    }

                    setCodeChanged(false);
                } else if (documentInteractedRef.current) {
                    setViewerResetNum((n) => n + 1);
                }
            }
        };

        let codeEditorContainer = document.getElementById(id);
        if (showViewer) {
            codeEditorContainer?.addEventListener(
                "keydown",
                handleEditorKeyDown,
            );
        }

        return () => {
            codeEditorContainer?.removeEventListener(
                "keydown",
                handleEditorKeyDown,
            );
        };
    }, [showViewer, id]);

    useEffect(() => {
        return () => {
            if (updateValueTimer.current !== null) {
                window.clearTimeout(updateValueTimer.current);
                if (
                    lastReportedDoenetML.current !== editorDoenetMLRef.current
                ) {
                    lastReportedDoenetML.current = editorDoenetMLRef.current;
                    doenetmlChangeCallback?.(editorDoenetMLRef.current);
                }
            }
            // Cancel pending help-debounce so its callback can't fire
            // setHelpContent on the unmounted component.
            window.clearTimeout(cursorDebounceTimer.current);
        };
    }, []);

    const codeMirror = (
        <CodeMirror
            value={editorDoenetML}
            readOnly={readOnly}
            onBlur={onBlur}
            onChange={onEditorChange}
            onCursorChange={onCursorChange}
            languageServerRef={lspRef}
        />
    );

    const editorAndCollapsiblePanel =
        showDiagnostics || showResponses ? (
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
                        setIsOpen={setInfoPanelIsOpen}
                        showDiagnostics={showDiagnostics}
                        showResponses={showResponses}
                        showInfoAnnotations={showInfoAnnotations}
                        setShowInfoAnnotations={setShowInfoAnnotations}
                        helpContent={helpContent}
                        docsURL={docsURL}
                    />
                }
                alwaysVisiblePanel={
                    <DiagnosticsResponseTabstrip
                        store={tabStore}
                        warnings={warningsObjs}
                        errors={errorsObjs}
                        infos={infoObjs}
                        accessibility={accessibilityObjs}
                        submittedResponses={responses}
                        isOpen={infoPanelIsOpen}
                        setIsOpen={setInfoPanelIsOpen}
                        showDiagnostics={showDiagnostics}
                        showResponses={showResponses}
                    />
                }
                isOpen={infoPanelIsOpen}
                setIsOpen={setInfoPanelIsOpen}
            />
        ) : (
            codeMirror
        );

    const editorPanel = (
        <div className="editor-panel" id={id}>
            <div className="editor-and-collapsible-panel">
                {editorAndCollapsiblePanel}
            </div>
            <FormatterVersionBar
                showFormatter={showFormatter}
                setFormatAsDoenetML={setFormatAsDoenetML}
                onFormat={async () => {
                    const printed = await prettyPrint(
                        editorDoenetMLRef.current,
                        {
                            doenetSyntax: formatAsDoenetML,
                            tabWidth: 2,
                        },
                    );
                    onEditorChange(printed);
                    // also update editorDoenetML so that CodeMirror updates
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
        <div className="viewer-panel" id={id + "-viewer"}>
            <ViewerControlsBar
                id={id}
                readOnly={readOnly}
                codeChanged={codeChanged}
                documentInteracted={documentInteracted}
                platform={platform as "Mac" | "Win" | "Linux"}
                updateWord={updateWord}
                onUpdateViewer={() => {
                    setDocumentInteracted(false);
                    setResponses([]);

                    if (!codeChanged) {
                        setViewerResetNum((n) => n + 1);
                    } else {
                        setViewerDoenetML(editorDoenetMLRef.current);
                        window.clearTimeout(
                            updateValueTimer.current ?? undefined,
                        );
                        if (
                            lastReportedDoenetML.current !==
                            editorDoenetMLRef.current
                        ) {
                            lastReportedDoenetML.current =
                                editorDoenetMLRef.current;
                            if (!showViewer) {
                                doenetmlChangeCallback?.(
                                    editorDoenetMLRef.current,
                                );
                            }
                        }
                        setCodeChanged(false);
                        updateValueTimer.current = null;
                    }
                }}
                variants={variants}
                setVariants={setVariants}
                showDiagnostics={showDiagnostics}
                accessibilityLevel1Count={accessibilityLevel1Count}
                accessibilityLevel2Count={accessibilityLevel2Count}
                isAccessibilityReportOpen={isAccessibilityReportOpen}
                onToggleAccessibilityReport={toggleAccessibilityReport}
            />
            <div className="viewer" id={id + "-viewer"} ref={viewerContainer}>
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
}
