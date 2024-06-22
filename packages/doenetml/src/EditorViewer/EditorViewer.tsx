import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Switch,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ResizableSideBySide } from "./ResizableSideBySide.js";
import { RxUpdate } from "react-icons/rx";
import { WarningTwoIcon } from "@chakra-ui/icons";
import VariantSelect from "./VariantSelect.js";
import { CodeMirror } from "@doenet/codemirror";
import { ActivityViewer } from "../Viewer/ActivityViewer.jsx";
import ErrorWarningPopovers, {
    ErrorDescription,
    WarningDescription,
} from "./ErrorWarningPopovers";
import { nanoid } from "nanoid";
import { prettyPrint } from "@doenet/parser";

export function EditorViewer({
    doenetML,
    activityId,
    paginate,
    location = {},
    navigate,
    idsIncludeActivityId = true,
    linkSettings,
    addBottomPadding = false,
    scrollableContainer = window,
    darkMode,
    showAnswerTitles,
    height = "100vh",
    backgroundColor = "doenet.mainGray",
    showViewer = true,
    viewerLocation = "right",
    doenetmlChangeCallback,
    immediateDoenetmlChangeCallback,
    id: specifiedId,
    readOnly = false,
    showFormatter = true,
}: {
    doenetML: string;
    activityId: string;
    paginate: boolean;
    location: any;
    navigate?: any;
    idsIncludeActivityId: boolean;
    linkSettings: { viewURL: string; editURL: string };
    addBottomPadding: boolean;
    scrollableContainer: any;
    darkMode?: string;
    showAnswerTitles: boolean;
    height: string;
    backgroundColor: string;
    showViewer: boolean;
    viewerLocation: "left" | "right";
    doenetmlChangeCallback?: Function;
    immediateDoenetmlChangeCallback?: Function;
    id?: string;
    readOnly: boolean;
    showFormatter: boolean;
}) {
    //Win, Mac or Linux
    let platform = "Linux";
    if (navigator.platform.indexOf("Win") != -1) {
        platform = "Win";
    } else if (navigator.platform.indexOf("Mac") != -1) {
        platform = "Mac";
    }

    const [id, setId] = useState(specifiedId ?? "editor" + nanoid(10));

    const [codeChanged, setCodeChanged] = useState(false);
    const codeChangedRef = useRef(false); //To keep value up to date in the code mirror function
    codeChangedRef.current = codeChanged;

    const [updateEditorValueTo, setUpdateEditorValueTo] = useState(doenetML);
    const editorDoenetML = useRef(doenetML);
    const [viewerDoenetML, setViewerDoenetML] = useState(doenetML);

    const [formatAsDoenetML, setFormatAsDoenetML] = useState(true);

    let updateValueTimer = useRef<number | null>(null);

    const [variants, setVariants] = useState({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    const [errorsAndWarnings, setErrorsAndWarningsCallback] = useState<{
        errors: ErrorDescription[];
        warnings: WarningDescription[];
    }>({
        errors: [],
        warnings: [],
    });

    const warningsLevel = 1; //TODO: eventually give user ability adjust warning level filter
    const warningsObjs = errorsAndWarnings.warnings.filter(
        (w) => w.level <= warningsLevel,
    );
    const errorsObjs = [...errorsAndWarnings.errors];

    const onEditorChange = useCallback(
        (value: string) => {
            if (editorDoenetML.current !== value) {
                editorDoenetML.current = value;

                if (!codeChangedRef.current) {
                    setCodeChanged(true);
                }

                immediateDoenetmlChangeCallback?.(value);

                // Debounce update value at 3 seconds
                clearTimeout(updateValueTimer.current ?? undefined);

                //TODO: when you try to leave the page before it saved you will lose work
                //so prompt the user on page leave
                updateValueTimer.current = window.setTimeout(function () {
                    doenetmlChangeCallback?.(editorDoenetML.current);
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
                setViewerDoenetML(editorDoenetML.current);
                doenetmlChangeCallback?.(editorDoenetML.current);

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

    let formatter: React.ReactNode = null;
    if (showFormatter) {
        formatter = (
            <Flex
                ml="0px"
                h="32px"
                bg="doenet.mainGray"
                pl="10px"
                pt="1px"
                alignItems="center"
                justify="end"
            >
                <Box>
                    <Button
                        size="sm"
                        px="4"
                        mr="8px"
                        title="Pretty-print your source code"
                        onClick={async () => {
                            const printed = await prettyPrint(
                                editorDoenetML.current,
                                { doenetSyntax: formatAsDoenetML, tabWidth: 2 },
                            );
                            setUpdateEditorValueTo(printed);
                            onEditorChange(printed);
                        }}
                    >
                        Pretty Print
                    </Button>
                </Box>
                <Box>
                    <FormControl display="flex" alignItems="center">
                        <Switch
                            id="asXml"
                            isChecked={formatAsDoenetML}
                            onChange={(e) => {
                                setFormatAsDoenetML(e.target.checked);
                            }}
                            title="Format as DoenetML or XML. The DoenetML syntax is more compact but may not be compatible with other XML tools."
                        />
                        <FormLabel htmlFor="asXml" mb="0" ml="2" width={"10em"}>
                            Format as {formatAsDoenetML ? "DoenetML" : "XML"}
                        </FormLabel>
                    </FormControl>
                </Box>
            </Flex>
        );
    }

    const editorPanel = (
        <VStack spacing={0}>
            <Box
                boxSizing="border-box"
                background="doenet.canvas"
                height={height}
                overflowY="hidden"
                borderRight="solid 1px"
                borderTop="solid 1px"
                borderBottom="solid 1px"
                borderColor="doenet.mediumGray"
                w="100%"
                id={id}
            >
                <Box
                    height={`calc(${height} - 32px${showFormatter ? " - 32px" : ""})`}
                    w="100%"
                    overflow="hidden"
                >
                    <CodeMirror
                        value={updateEditorValueTo}
                        //TODO: read only isn't working <codeeditor disabled />
                        readOnly={readOnly}
                        onBlur={() => {
                            window.clearTimeout(
                                updateValueTimer.current ?? undefined,
                            );
                            doenetmlChangeCallback?.(editorDoenetML.current);
                            updateValueTimer.current = null;
                        }}
                        onChange={onEditorChange}
                    />
                </Box>

                <Box bg="doenet.mainGray" h="32px" w="100%">
                    <Flex
                        ml="0px"
                        h="32px"
                        bg="doenet.mainGray"
                        pl="10px"
                        pt="1px"
                    >
                        <ErrorWarningPopovers
                            warnings={warningsObjs}
                            errors={errorsObjs}
                        />
                    </Flex>
                </Box>
                {formatter}
            </Box>
        </VStack>
    );

    if (!showViewer) {
        return editorPanel;
    }

    const viewerPanel = (
        <VStack spacing={0}>
            <HStack w="100%" h="32px" bg={backgroundColor}>
                <Box>
                    <Tooltip
                        hasArrow
                        label={
                            platform == "Mac"
                                ? "Updates Viewer cmd+s"
                                : "Updates Viewer ctrl+s"
                        }
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            data-test="Viewer Update Button"
                            bg="doenet.canvas"
                            leftIcon={<RxUpdate />}
                            rightIcon={
                                codeChanged ? (
                                    <WarningTwoIcon
                                        color="doenet.mainBlue"
                                        fontSize="18px"
                                    />
                                ) : undefined
                            }
                            isDisabled={!codeChanged}
                            onClick={() => {
                                setViewerDoenetML(editorDoenetML.current);
                                window.clearTimeout(
                                    updateValueTimer.current ?? undefined,
                                );
                                doenetmlChangeCallback?.(
                                    editorDoenetML.current,
                                );
                                setCodeChanged(false);
                                updateValueTimer.current = null;
                            }}
                        >
                            Update
                        </Button>
                    </Tooltip>
                </Box>
                {variants.numVariants > 1 && (
                    <Box bg={backgroundColor} h="32px" width="100%">
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
                    </Box>
                )}
            </HStack>

            <Box
                height={`calc(${height} - 32px)`}
                background="var(--canvas)"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="doenet.mediumGray"
                overflow="scroll"
                w="100%"
                id={id + "-viewer"}
            >
                <ActivityViewer
                    doenetML={viewerDoenetML}
                    cid={null}
                    flags={{
                        showCorrectness: true,
                        solutionDisplayMode: "button",
                        showFeedback: true,
                        showHints: true,
                        autoSubmit: false,
                        allowLoadState: false,
                        allowSaveState: false,
                        allowLocalState: false,
                        allowSaveSubmissions: false,
                        allowSaveEvents: false,
                    }}
                    activityId={activityId}
                    attemptNumber={1}
                    generatedVariantCallback={setVariants}
                    requestedVariantIndex={variants.index}
                    paginate={paginate}
                    setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
                    location={location}
                    navigate={navigate}
                    idsIncludeActivityId={idsIncludeActivityId}
                    linkSettings={linkSettings}
                    addBottomPadding={addBottomPadding}
                    scrollableContainer={scrollableContainer}
                    darkMode={darkMode}
                    showAnswerTitles={showAnswerTitles}
                />
            </Box>
        </VStack>
    );

    return (
        <ResizableSideBySide
            height={height}
            left={viewerLocation == "left" ? viewerPanel : editorPanel}
            right={viewerLocation == "left" ? editorPanel : viewerPanel}
        />
    );
}
