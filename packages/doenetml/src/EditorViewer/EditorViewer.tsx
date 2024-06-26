import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    HStack,
    Switch,
    Tooltip,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ResizablePanelPair } from "./ResizablePanelPair";
import { RxUpdate } from "react-icons/rx";
import { WarningTwoIcon } from "@chakra-ui/icons";
// @ts-ignore
import VariantSelect from "./VariantSelect";
import { CodeMirror } from "@doenet/codemirror";
import { ActivityViewer } from "../Viewer/ActivityViewer";
import ErrorWarningPopovers from "./ErrorWarningPopovers";
import { WarningDescription, ErrorDescription } from "@doenet/utils";
import { nanoid } from "nanoid";
import { prettyPrint } from "@doenet/parser";

export function EditorViewer({
    doenetML: initialDoenetML,
    activityId = "",
    paginate = false,
    location = {},
    navigate,
    idsIncludeActivityId = true,
    linkSettings,
    addBottomPadding = false,
    darkMode,
    showAnswerTitles,
    width = "100%",
    height = "500px",
    backgroundColor = "doenet.mainGray",
    showViewer = true,
    viewerLocation = "right",
    doenetmlChangeCallback,
    immediateDoenetmlChangeCallback,
    id: specifiedId,
    readOnly = false,
    showFormatter = true,
    showErrorsWarnings = true,
    border = "1px solid",
}: {
    doenetML: string;
    activityId?: string;
    paginate?: boolean;
    location?: any;
    navigate?: any;
    idsIncludeActivityId?: boolean;
    linkSettings?: { viewURL: string; editURL: string };
    addBottomPadding?: boolean;
    darkMode?: string;
    showAnswerTitles?: boolean;
    width?: string;
    height?: string;
    backgroundColor?: string;
    showViewer?: boolean;
    viewerLocation?: "left" | "right" | "top" | "bottom";
    doenetmlChangeCallback?: Function;
    immediateDoenetmlChangeCallback?: Function;
    id?: string;
    readOnly?: boolean;
    showFormatter?: boolean;
    showErrorsWarnings?: boolean;
    border?: string;
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

    const [editorDoenetML, setEditorDoenetML] = useState(initialDoenetML);
    const [viewerDoenetML, setViewerDoenetML] = useState(initialDoenetML);
    const editorDoenetMLRef = useRef(editorDoenetML);
    editorDoenetMLRef.current = editorDoenetML;

    const [formatAsDoenetML, setFormatAsDoenetML] = useState(true);

    const updateValueTimer = useRef<number | null>(null);

    const scrollableContainer = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        setEditorDoenetML(initialDoenetML);
    }, [initialDoenetML]);

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
                    doenetmlChangeCallback?.(editorDoenetMLRef.current);
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
                doenetmlChangeCallback?.(editorDoenetMLRef.current);

                setCodeChanged(false);

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
                doenetmlChangeCallback?.(editorDoenetMLRef.current);
            }
        };
    }, []);

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
                                editorDoenetMLRef.current,
                                { doenetSyntax: formatAsDoenetML, tabWidth: 2 },
                            );
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

    let errorsWarnings: React.ReactNode = null;
    if (showErrorsWarnings) {
        errorsWarnings = (
            <Flex ml="0px" h="32px" bg="doenet.mainGray" pl="10px" pt="1px">
                <ErrorWarningPopovers
                    warnings={warningsObjs}
                    errors={errorsObjs}
                />
            </Flex>
        );
    }

    const editorPanel = (
        <Grid
            width="100%"
            height="100%"
            templateAreas={`"editor"
                                "errorWarnings"
                                "formatter"`}
            gridTemplateRows={`1fr ${showErrorsWarnings ? "32px" : "0px"} ${showFormatter ? "32px" : "0px"}`}
            gridTemplateColumns={`1fr`}
            boxSizing="border-box"
            background="doenet.canvas"
            overflowY="hidden"
            border="solid 1px"
            borderColor="doenet.mediumGray"
            id={id}
        >
            <GridItem
                area="editor"
                width="100%"
                height="100%"
                placeSelf="center"
                overflow="hidden"
            >
                <CodeMirror
                    value={editorDoenetML}
                    //TODO: read only isn't working <codeeditor disabled />
                    readOnly={readOnly}
                    onBlur={() => {
                        window.clearTimeout(
                            updateValueTimer.current ?? undefined,
                        );
                        doenetmlChangeCallback?.(editorDoenetMLRef.current);
                        updateValueTimer.current = null;
                    }}
                    onChange={onEditorChange}
                />
            </GridItem>
            <GridItem
                area="errorWarnings"
                width="100%"
                height="100%"
                placeSelf="center"
                overflow="hidden"
                backgroundColor="doenet.mainGray"
            >
                {errorsWarnings}
            </GridItem>
            <GridItem
                area="formatter"
                width="100%"
                height="100%"
                placeSelf="center"
                overflow="hidden"
            >
                {formatter}
            </GridItem>
        </Grid>
    );

    if (!showViewer) {
        return (
            <Box
                width={width}
                height={height}
                border={border}
                boxSizing="border-box"
            >
                {editorPanel}
            </Box>
        );
    }

    const viewerPanel = (
        <Grid
            width="100%"
            height="100%"
            templateAreas={`"controls"
                            "viewer"`}
            gridTemplateRows={`32px 1fr`}
            gridTemplateColumns={`1fr`}
            overflowY="hidden"
        >
            <GridItem
                area="controls"
                width="100%"
                height="100%"
                placeSelf="center"
                overflow="hidden"
                id={id + "-viewer-controls"}
            >
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
                                    setViewerDoenetML(
                                        editorDoenetMLRef.current,
                                    );
                                    window.clearTimeout(
                                        updateValueTimer.current ?? undefined,
                                    );
                                    doenetmlChangeCallback?.(
                                        editorDoenetMLRef.current,
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
            </GridItem>
            <GridItem
                area="viewer"
                width="100%"
                height="100%"
                placeSelf="center"
                overflow="hidden"
            >
                <Box
                    height="100%"
                    width="100%"
                    background="var(--canvas)"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="doenet.mediumGray"
                    overflow="scroll"
                    id={id + "-viewer"}
                    ref={scrollableContainer}
                >
                    {/* @ts-ignore */}
                    <ActivityViewer
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
                            allowSaveSubmissions: false,
                            allowSaveEvents: false,
                            readOnly: false,
                        }}
                        activityId={activityId}
                        attemptNumber={1}
                        generatedVariantCallback={setVariants}
                        requestedVariantIndex={variants.index}
                        paginate={paginate}
                        setErrorsAndWarningsCallback={
                            setErrorsAndWarningsCallback
                        }
                        location={location}
                        navigate={navigate}
                        idsIncludeActivityId={idsIncludeActivityId}
                        linkSettings={linkSettings}
                        addBottomPadding={addBottomPadding}
                        scrollableContainer={
                            scrollableContainer.current ?? undefined
                        }
                        darkMode={darkMode}
                        showAnswerTitles={showAnswerTitles}
                    />
                </Box>
            </GridItem>
        </Grid>
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
