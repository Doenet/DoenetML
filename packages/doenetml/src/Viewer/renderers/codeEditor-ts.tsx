import React, { useState, useRef, useEffect } from "react";
import useDoenetRenderer, { rendererState } from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { CodeMirror } from "@doenet/codemirror";
import VisibilitySensor from "react-visibility-sensor-v2";
import { useSetRecoilState } from "recoil";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Stack,
    Switch,
} from "@chakra-ui/react";
import ErrorWarningPopovers from "../../Tools/ChakraBasedComponents/ErrorWarningPopovers";
import { prettyPrint } from "@doenet/parser";

export default React.memo(function CodeEditor(props) {
    let {
        name,
        id,
        SVs,
        children,
        actions,
        ignoreUpdate,
        rendererName,
        callAction,
    } = useDoenetRenderer(props) as any;

    // @ts-ignore
    CodeEditor.baseStateVariable = "immediateValue";

    const setRendererState = useSetRecoilState(rendererState(rendererName));
    const [formatAsDoenetML, setFormatAsDoenetML] = useState(true);

    let currentValue = useRef(SVs.immediateValue);
    let updateValueTimer = useRef<number | null>(null);
    let updateInternalValueTo = useRef(SVs.immediateValue);

    let componentHeight = { ...SVs.height };
    let editorHeight = { ...SVs.height };
    if (SVs.showResults && SVs.resultsLocation === "bottom") {
        editorHeight.size *= 1 - SVs.viewerRatio;
    }

    let onChangeVisibility = (isVisible: boolean) => {
        callAction({
            action: actions.recordVisibilityChange,
            args: { isVisible },
        });
    };

    const onEditorChange = React.useCallback(
        (value: string) => {
            if (currentValue.current !== value) {
                currentValue.current = value;

                setRendererState((was) => {
                    let newObj = { ...was };
                    newObj.ignoreUpdate = true;
                    return newObj;
                });

                callAction({
                    action: actions.updateImmediateValue,
                    args: { text: value },
                    baseVariableValue: value,
                });

                // Debounce update value at 3 seconds
                clearTimeout(updateValueTimer.current ?? undefined);

                //TODO: when you try to leave the page before it saved you will lose work
                //so prompt the user on page leave
                updateValueTimer.current = window.setTimeout(function () {
                    callAction({
                        action: actions.updateValue,
                        baseVariableValue: currentValue.current,
                    });
                    updateValueTimer.current = null;
                }, 3000); //3 seconds
            }
        },
        [
            actions.updateImmediateValue,
            actions.updateValue,
            callAction,
            setRendererState,
        ],
    );

    useEffect(() => {
        return () => {
            callAction({
                action: actions.recordVisibilityChange,
                args: { isVisible: false },
            });
            if (updateValueTimer.current !== null) {
                window.clearTimeout(updateValueTimer.current);
                callAction({
                    action: actions.updateValue,
                    baseVariableValue: currentValue.current,
                });
            }
        };
    }, []);

    if (SVs.hidden) {
        return null;
    }

    useEffect(() => {
        let platform = "Linux";
        if (navigator.platform.indexOf("Win") != -1) {
            platform = "Win";
        } else if (navigator.platform.indexOf("Mac") != -1) {
            platform = "Mac";
        }
        const handleEditorKeyDown = (event: KeyboardEvent) => {
            if (
                (platform == "Mac" && event.metaKey && event.code === "KeyS") ||
                (platform != "Mac" && event.ctrlKey && event.code === "KeyS")
            ) {
                event.preventDefault();
                event.stopPropagation();
                window.clearTimeout(updateValueTimer.current ?? undefined);
                callAction({
                    action: actions.updateValue,
                    baseVariableValue: currentValue.current,
                });
                updateValueTimer.current = null;
                callAction({ action: actions.updateComponents });
            }
        };

        let codeEditorContainer = document.getElementById(id);
        if (SVs.showResults) {
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
    }, [SVs.showResults]);

    const editorKey = id + "_editor";
    const viewerKey = id + "_viewer";

    //Received update from core to immediateValue
    //NOTE: currently causes a scrolling issue
    //https://codemirror.net/doc/manual.html#events
    // cm.scrollTo(x: number, y: number)
    // Scroll the editor to a given (pixel) position. Both arguments may be left as null or undefined to have no effect.
    // cm.getScrollInfo() → {left, top, width, height, clientWidth, clientHeight}
    // Get an {left, top, width, height, clientWidth, clientHeight} object that represents the current scroll position, the size of the scrollable area, and the size of the visible area (minus scrollbars).

    if (!ignoreUpdate && SVs.immediateValue !== currentValue.current) {
        currentValue.current = SVs.immediateValue;
        updateInternalValueTo.current = SVs.immediateValue;
    }

    let viewer: React.ReactNode = null;
    let editorWidth = SVs.width;
    let componentWidth = SVs.width;
    if (SVs.showResults && ["left", "right"].includes(SVs.resultsLocation)) {
        editorWidth = { size: 100, isAbsolute: false };
    }

    let editorStyle: React.CSSProperties = {
        width: sizeToCSS(editorWidth),
        height: sizeToCSS(editorHeight),
        maxWidth: "100%",
        padding: "0px",
        overflowX: "hidden",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
    };

    if (SVs.showResults) {
        if (SVs.resultsLocation === "bottom") {
            viewer = (
                <>
                    <hr
                        style={{
                            width: sizeToCSS(componentWidth),
                            maxWidth: "100%",
                        }}
                    />
                    <div id={viewerKey}>{children}</div>
                </>
            );
        } else {
            viewer = <div id={viewerKey}>{children}</div>;
        }
    }

    let paddingBottom = { ...editorHeight };
    paddingBottom.size /= 2;
    paddingBottom = sizeToCSS(paddingBottom);

    let errorsAndWarnings: React.ReactNode = null;
    let errorsAndWarningsHeight = 0;

    if (SVs.errorsAndWarnings) {
        errorsAndWarningsHeight = 32;

        const warningsLevel = 1; //TODO: eventually give user ability adjust warning level filter
        const warningsObjs = SVs.errorsAndWarnings.warnings.filter(
            (w: { level: number }) => w.level <= warningsLevel,
        );
        const errorsObjs = [...SVs.errorsAndWarnings.errors];

        errorsAndWarnings = (
            <Flex ml="0px" h="32px" bg="doenet.mainGray" pl="10px" pt="1px">
                <ErrorWarningPopovers
                    warningsObjs={warningsObjs}
                    errorsObjs={errorsObjs}
                />
            </Flex>
        );
    }

    let formatter: React.ReactNode = null;
    if (SVs.showFormatter) {
        formatter = (
            <Flex
                ml="0px"
                h="32px"
                bg="doenet.mainGray"
                pl="10px"
                pt="1px"
                alignItems="center"
            >
                <Stack direction="row" spacing={4} flexGrow={1}>
                    <Button
                        size="sm"
                        px="4"
                        title="Pretty-print your source code"
                        onClick={async () => {
                            const printed = await prettyPrint(
                                currentValue.current,
                                { doenetSyntax: formatAsDoenetML, tabWidth: 2 },
                            );
                            updateInternalValueTo.current = printed;
                            onEditorChange(printed);
                        }}
                    >
                        Pretty Print
                    </Button>
                    <FormControl
                        display="flex"
                        alignItems="center"
                        flexGrow={1}
                    >
                        <Switch
                            id="asXml"
                            isChecked={formatAsDoenetML}
                            onChange={(e) => {
                                setFormatAsDoenetML(e.target.checked);
                            }}
                            title="Format as DoenetML or XML. The DoenetML syntax is more compact but may not be compatible with other XML tools."
                        />
                        <FormLabel htmlFor="asXml" mb="0" ml="2">
                            Format as {formatAsDoenetML ? "DoenetML" : "XML"}
                        </FormLabel>
                    </FormControl>
                </Stack>
            </Flex>
        );
    }

    let editor = (
        <div key={editorKey} id={editorKey} style={editorStyle}>
            <Box flexGrow={1} w="100%" overflowY="scroll" overflowX="hidden">
                <CodeMirror
                    setInternalValueTo={updateInternalValueTo.current}
                    //TODO: read only isn't working <codeeditor disabled />
                    readOnly={SVs.disabled}
                    onBlur={() => {
                        window.clearTimeout(
                            updateValueTimer.current ?? undefined,
                        );
                        callAction({
                            action: actions.updateValue,
                            baseVariableValue: currentValue.current,
                        });
                        updateValueTimer.current = null;
                    }}
                    onFocus={() => {
                        // console.log(">>codeEditor FOCUS!!!!!")
                    }}
                    onBeforeChange={onEditorChange}
                    paddingBottom={paddingBottom}
                />
            </Box>
            {errorsAndWarnings}
            {formatter}
        </div>
    );

    let editorWithViewer = editor;

    if (SVs.showResults && SVs.resultsLocation === "bottom") {
        editorWithViewer = (
            <>
                {editor}
                {viewer}
            </>
        );
    }

    editorWithViewer = (
        <div style={{ margin: "12px 0" }}>
            <div
                style={{
                    padding: "0",
                    border: "var(--mainBorder)",
                    borderRadius: "var(--mainBorderRadius)",
                    height: sizeToCSS(componentHeight),
                    width: sizeToCSS(editorWidth),
                    maxWidth: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
                id={id}
            >
                {editorWithViewer}
            </div>
        </div>
    );

    if (SVs.showResults) {
        if (SVs.resultsLocation === "left") {
            let viewerPercent = SVs.viewerRatio * 100;
            let editorPercent = 100 - viewerPercent;
            editorWithViewer = (
                <div
                    style={{
                        display: "flex",
                        width: sizeToCSS(componentWidth),
                        maxWidth: "100%",
                        margin: "12px 0",
                    }}
                >
                    <div
                        style={{
                            maxWidth: `${viewerPercent}%`,
                            paddingRight: "15px",
                            boxSizing: "border-box",
                        }}
                    >
                        {viewer}
                    </div>
                    <div
                        style={{
                            width: `${editorPercent}%`,
                            boxSizing: "border-box",
                        }}
                    >
                        {editorWithViewer}
                    </div>
                </div>
            );
        } else if (SVs.resultsLocation === "right") {
            let viewerPercent = SVs.viewerRatio * 100;
            let editorPercent = 100 - viewerPercent;
            editorWithViewer = (
                <div
                    style={{
                        display: "flex",
                        width: sizeToCSS(componentWidth),
                        maxWidth: "100%",
                        margin: "12px 0",
                    }}
                >
                    <div
                        style={{
                            width: `${editorPercent}%`,
                            paddingRight: "15px",
                            boxSizing: "border-box",
                        }}
                    >
                        {editorWithViewer}
                    </div>
                    <div
                        style={{
                            width: `${viewerPercent}%`,
                            boxSizing: "border-box",
                        }}
                    >
                        {viewer}
                    </div>
                </div>
            );
        }
    }

    return (
        <VisibilitySensor
            partialVisibility={true}
            onChange={onChangeVisibility}
        >
            {editorWithViewer}
        </VisibilitySensor>
    );
});
