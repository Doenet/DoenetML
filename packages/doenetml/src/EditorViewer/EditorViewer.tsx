import React, {
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { ResizablePanelPair, UiButton } from "@doenet/ui-components";
import { RxUpdate } from "react-icons/rx";
// @ts-ignore
import VariantSelect from "./VariantSelect";
import { CodeMirror, LSP } from "@doenet/codemirror";
import { DocViewer } from "../Viewer/DocViewer";
import {
    ErrorWarningResponseTabContents,
    ErrorWarningResponseTabstrip,
} from "./ErrorWarningResponseTabs";
import { ErrorRecord, nanInfinityReviver, WarningRecord } from "@doenet/utils";
import { nanoid } from "nanoid";
import { prettyPrint } from "@doenet/parser/pretty-printer";
import { formatResponse } from "../utils/responses";
import { ResizableCollapsiblePanelPair } from "@doenet/ui-components";
import { BsExclamationTriangleFill } from "react-icons/bs";
import "./editor-viewer.css";
import {
    Select,
    SelectItem,
    SelectPopover,
    SelectProvider,
    useTabStore,
} from "@ariakit/react";

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
    id: specifiedId,
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
    const codeChangedRef = useRef(false); //To keep value up to date in the code mirror function
    codeChangedRef.current = codeChanged;

    const [editorDoenetML, setEditorDoenetML] = useState(initialDoenetML);
    const [viewerDoenetML, setViewerDoenetML] = useState(initialDoenetML);
    const lastReportedDoenetML = useRef(initialDoenetML);
    const editorDoenetMLRef = useRef(editorDoenetML);
    editorDoenetMLRef.current = editorDoenetML;

    const [formatAsDoenetML, setFormatAsDoenetML] = useState(true);

    const updateValueTimer = useRef<number | null>(null);

    const viewerContainer = useRef<HTMLDivElement>(null);

    const [variants, setVariants] = useState({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    const [infoPanelIsOpen, setInfoPanelIsOpen] = useState(false);

    const [errorsAndWarnings, setErrorsAndWarningsCallback] = useState<{
        errors: ErrorRecord[];
        warnings: WarningRecord[];
    }>({
        errors: [],
        warnings: [],
    });

    const warningsObjs = [...initialWarnings, ...errorsAndWarnings.warnings];
    const errorsObjs = [...initialErrors, ...errorsAndWarnings.errors];

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
                const data = event.data;
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
        setEditorDoenetML(initialDoenetML);
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
                setEditorDoenetML(value);

                if (!codeChangedRef.current) {
                    setCodeChanged(true);
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

    useEffect(() => {
        const handleEditorKeyDown = (event: KeyboardEvent) => {
            if (
                (platform == "Mac" && event.metaKey && event.code === "KeyS") ||
                (platform != "Mac" && event.ctrlKey && event.code === "KeyS")
            ) {
                event.preventDefault();
                event.stopPropagation();
                window.clearTimeout(updateValueTimer.current ?? undefined);
                setViewerDoenetML(editorDoenetMLRef.current);
                if (
                    lastReportedDoenetML.current !== editorDoenetMLRef.current
                ) {
                    lastReportedDoenetML.current = editorDoenetMLRef.current;
                    if (!showViewer) {
                        doenetmlChangeCallback?.(editorDoenetMLRef.current);
                    }
                }

                setCodeChanged(false);
                setResponses([]);

                updateValueTimer.current = null;
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
        };
    }, []);

    const tabStore = useTabStore();
    const codeMirror = (
        <CodeMirror
            value={initialDoenetML}
            readOnly={readOnly}
            onBlur={() => {
                window.clearTimeout(updateValueTimer.current ?? undefined);
                if (
                    lastReportedDoenetML.current !== editorDoenetMLRef.current
                ) {
                    lastReportedDoenetML.current = editorDoenetMLRef.current;
                    doenetmlChangeCallback?.(editorDoenetMLRef.current);
                }
                updateValueTimer.current = null;
            }}
            onChange={onEditorChange}
            languageServerRef={lspRef}
        />
    );

    const editorAndCollapsiblePanel =
        showErrorsWarnings || showResponses ? (
            <ResizableCollapsiblePanelPair
                mainPanel={codeMirror}
                subPanel={
                    <ErrorWarningResponseTabContents
                        store={tabStore}
                        warnings={warningsObjs}
                        errors={errorsObjs}
                        submittedResponses={responses}
                        isOpen={infoPanelIsOpen}
                        setIsOpen={setInfoPanelIsOpen}
                        showErrorsWarnings={showErrorsWarnings}
                        showResponses={showResponses}
                    />
                }
                alwaysVisiblePanel={
                    <ErrorWarningResponseTabstrip
                        store={tabStore}
                        warnings={warningsObjs}
                        errors={errorsObjs}
                        submittedResponses={responses}
                        isOpen={infoPanelIsOpen}
                        setIsOpen={setInfoPanelIsOpen}
                        showErrorsWarnings={showErrorsWarnings}
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
            <div className="formatter-and-version">
                {showFormatter ? (
                    <>
                        <div className="label">Format as</div>
                        <div className="wrapper">
                            <SelectProvider
                                defaultValue={"DoenetML"}
                                setValue={(e) => {
                                    setFormatAsDoenetML(e === "DoenetML");
                                }}
                            >
                                <Select className="button" />
                                <SelectPopover
                                    sameWidth
                                    gutter={2}
                                    className="popover"
                                >
                                    <SelectItem
                                        className="select-item"
                                        value="DoenetML"
                                    />
                                    <SelectItem
                                        className="select-item"
                                        value="XML"
                                    />
                                </SelectPopover>
                            </SelectProvider>
                        </div>
                        <UiButton
                            title="Format your source code"
                            onClick={async () => {
                                const printed = await prettyPrint(
                                    editorDoenetMLRef.current,
                                    {
                                        doenetSyntax: formatAsDoenetML,
                                        tabWidth: 2,
                                    },
                                );
                                onEditorChange(printed);
                            }}
                        >
                            Format
                        </UiButton>
                    </>
                ) : null}
                <div className="doenetml-version" title="DoenetML version">
                    Version: {DOENETML_VERSION}
                </div>
            </div>
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
            <div className="viewer-controls" id={id + "-viewer-controls"}>
                {!readOnly && (
                    <UiButton
                        data-test="Viewer Update Button"
                        disabled={!codeChanged}
                        title={
                            platform == "Mac"
                                ? "Updates Viewer cmd+s"
                                : "Updates Viewer ctrl+s"
                        }
                        onClick={() => {
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
                            setResponses([]);
                        }}
                    >
                        <RxUpdate /> Update{" "}
                        {codeChanged ? (
                            <BsExclamationTriangleFill
                                fontSize="18px"
                                color="var(--mainBlue)"
                            />
                        ) : undefined}
                    </UiButton>
                )}
                {variants.numVariants > 1 && (
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
                )}
            </div>
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
                        allowLocalState: false,
                        allowSaveEvents: showResponses,
                        readOnly: false,
                    }}
                    activityId={activityId}
                    prefixForIds={prefixForIds}
                    attemptNumber={1}
                    generatedVariantCallback={(x: any) => {
                        const allPossibleVariants = x.allPossibleVariants;
                        if (Array.isArray(allPossibleVariants)) {
                            const numVariants = allPossibleVariants.length;
                            if (
                                typeof x.variantInfo === "object" &&
                                typeof x.variantInfo.index === "number"
                            ) {
                                const index = x.variantInfo.index;

                                // If the variant generated does not match the variant prescribed,
                                // set the variants state variable to match.
                                if (
                                    index !== variants.index ||
                                    numVariants !== variants.numVariants ||
                                    allPossibleVariants.some(
                                        (v, i) =>
                                            v !==
                                            variants.allPossibleVariants[i],
                                    )
                                ) {
                                    setVariants({
                                        index,
                                        numVariants,
                                        allPossibleVariants,
                                    });
                                }
                            }
                        }
                    }}
                    requestedVariantIndex={variants.index}
                    setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
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
