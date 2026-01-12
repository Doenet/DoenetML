import React, { useState, useEffect, useRef } from "react";
import { DoenetEditor, DoenetViewer } from "@doenet/doenetml";
import { Button } from "@doenet/ui-components";

export function CypressTest() {
    const defaultTestSettings: {
        updateNumber: number;
        attemptNumber: number;
        controlsVisible: boolean;
        showCorrectness: boolean;
        readOnly: boolean;
        showFeedback: boolean;
        showHints: boolean;
        allowLoadState: boolean;
        allowSaveState: boolean;
        saveRendererState: boolean;
        allowLocalState: boolean;
        allowSaveEvents: boolean;
        autoSubmit: boolean;
        render: boolean;
        darkMode: "light" | "dark";
        showEditor: boolean;
        viewerLocation: "left" | "right" | "bottom" | "top";
        includeVariantSelector: boolean;
    } = {
        updateNumber: 0,
        attemptNumber: 1,
        controlsVisible: false,
        showCorrectness: true,
        readOnly: false,
        showFeedback: true,
        showHints: true,
        allowLoadState: false,
        allowSaveState: false,
        saveRendererState: false,
        allowLocalState: false,
        allowSaveEvents: false,
        autoSubmit: false,
        render: true,
        darkMode: "light",
        showEditor: false,
        viewerLocation: "right",
        includeVariantSelector: false,
    };

    //@ts-ignore
    let testSettings = JSON.parse(localStorage.getItem("test settings"));
    if (!testSettings) {
        testSettings = defaultTestSettings;
        localStorage.setItem(
            "test settings",
            JSON.stringify(defaultTestSettings),
        );
    }

    const [
        {
            doenetMLstring,
            attemptNumber,
            externalDoenetMLs,
            answerResponseCounts,
        },
        setBaseState,
    ] = useState<{
        doenetMLstring: string | null;
        attemptNumber: number;
        externalDoenetMLs: Record<string, string>;
        answerResponseCounts?: Record<string, number>;
    }>({
        doenetMLstring: null,
        attemptNumber: testSettings.attemptNumber,
        externalDoenetMLs: {},
    });

    const [updateNumber, setUpdateNumber] = useState(testSettings.updateNumber);
    const [controlsVisible, setControlsVisible] = useState(
        testSettings.controlsVisible,
    );
    const [showCorrectness, setShowCorrectness] = useState(
        testSettings.showCorrectness,
    );
    const [readOnly, setReadOnly] = useState(testSettings.readOnly);
    const [showFeedback, setShowFeedback] = useState(testSettings.showFeedback);
    const [showHints, setShowHints] = useState(testSettings.showHints);

    const [darkMode, setDarkMode] = useState(testSettings.darkMode);

    const [allowLoadState, setAllowLoadState] = useState(
        testSettings.allowLoadState,
    );
    const [allowSaveState, setAllowSaveState] = useState(
        testSettings.allowSaveState,
    );
    const [saveRendererState, setSaveRendererState] = useState(
        testSettings.saveRendererState,
    );
    const [allowLocalState, setAllowLocalState] = useState(
        testSettings.allowLocalState,
    );
    const [allowSaveEvents, setAllowSaveEvents] = useState(
        testSettings.allowSaveEvents,
    );
    const [autoSubmit, setAutoSubmit] = useState(testSettings.autoSubmit);
    const [render, setRender] = useState(testSettings.render);

    const [showEditor, setShowEditor] = useState(testSettings.showEditor);
    const [viewerLocation, setViewerLocation] = useState(
        testSettings.viewerLocation,
    );
    const [includeVariantSelector, setIncludeVariantSelector] = useState(
        testSettings.includeVariantSelector,
    );

    const solutionDisplayMode = "button";

    // requestedVariantIndex is undefined by default so that viewer
    // will use attemptNumber for variant
    // unless get a message (from cypress) to select a particular variant
    let requestedVariantIndex = useRef(undefined);

    //For Cypress Test Use
    window.onmessage = (e) => {
        let newDoenetMLstring: string | null = null;
        let newAttemptNumber = attemptNumber;
        let newExternalDoenetMLs: Record<string, string> = {};
        let newAnswerResponseCounts: Record<string, number> | undefined =
            undefined;

        if (e.data.doenetML !== undefined) {
            newDoenetMLstring = e.data.doenetML;
        }

        if (e.data.requestedVariantIndex !== undefined) {
            requestedVariantIndex.current = e.data.requestedVariantIndex;
        }
        if (e.data.attemptNumber !== undefined) {
            newAttemptNumber = e.data.attemptNumber;
            testSettings.attemptNumber = newAttemptNumber;
            localStorage.setItem("test settings", JSON.stringify(testSettings));
        }

        if (e.data.externalDoenetMLs !== undefined) {
            newExternalDoenetMLs = e.data.externalDoenetMLs;
        }

        if (e.data.answerResponseCounts !== undefined) {
            newAnswerResponseCounts = e.data.answerResponseCounts;
        }

        // don't do anything if receive a message from another source (like the youtube player)
        if (
            typeof newDoenetMLstring === "string" ||
            newAttemptNumber !== attemptNumber
        ) {
            setBaseState({
                doenetMLstring: newDoenetMLstring,
                attemptNumber: newAttemptNumber,
                externalDoenetMLs: newExternalDoenetMLs,
                answerResponseCounts: newAnswerResponseCounts,
            });
        }
    };

    let controls: React.JSX.Element | null = null;
    let buttonText = "show";
    if (controlsVisible) {
        buttonText = "hide";
        controls = (
            <div style={{ padding: "8px" }}>
                <div>
                    <button
                        id="testRunner_resetControls"
                        onClick={() => {
                            localStorage.setItem(
                                "test settings",
                                JSON.stringify(defaultTestSettings),
                            );
                            location.pathname = "/test";
                        }}
                    >
                        Reset
                    </button>
                </div>
                <hr />
                <div>
                    <label>
                        Attempt Number: {attemptNumber}{" "}
                        <button
                            id="testRunner_newAttempt"
                            onClick={() => {
                                testSettings.attemptNumber =
                                    testSettings.attemptNumber + 1;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setBaseState((was) => {
                                    let newObj = { ...was };
                                    newObj.attemptNumber++;
                                    return newObj;
                                });
                            }}
                        >
                            New Attempt
                        </button>{" "}
                        <button
                            onClick={() => {
                                testSettings.attemptNumber = 1;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setBaseState((was) => {
                                    let newObj = { ...was };
                                    newObj.attemptNumber = 1;
                                    return newObj;
                                });
                            }}
                        >
                            Reset Attempt Number
                        </button>
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_showCorrectness"
                            type="checkbox"
                            checked={showCorrectness}
                            onChange={() => {
                                testSettings.showCorrectness =
                                    !testSettings.showCorrectness;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setShowCorrectness((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Show Correctness
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_readOnly"
                            type="checkbox"
                            checked={readOnly}
                            onChange={() => {
                                testSettings.readOnly = !testSettings.readOnly;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setReadOnly((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Read Only
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_showFeedback"
                            type="checkbox"
                            checked={showFeedback}
                            onChange={() => {
                                testSettings.showFeedback =
                                    !testSettings.showFeedback;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setShowFeedback((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Show Feedback
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_showHints"
                            type="checkbox"
                            checked={showHints}
                            onChange={() => {
                                testSettings.showHints =
                                    !testSettings.showHints;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setShowHints((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Show Hints
                    </label>
                </div>
                <hr />
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_allowLoadState"
                            type="checkbox"
                            checked={allowLoadState}
                            onChange={() => {
                                testSettings.allowLoadState =
                                    !testSettings.allowLoadState;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setAllowLoadState((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Allow Load Page State
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_allowSaveState"
                            type="checkbox"
                            checked={allowSaveState}
                            onChange={() => {
                                testSettings.allowSaveState =
                                    !testSettings.allowSaveState;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setAllowSaveState((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Allow Save Page State
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_saveRendererState"
                            type="checkbox"
                            checked={saveRendererState}
                            onChange={() => {
                                testSettings.saveRendererState =
                                    !testSettings.saveRendererState;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setSaveRendererState((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Allow Save Page State
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_allowLocalState"
                            type="checkbox"
                            checked={allowLocalState}
                            onChange={() => {
                                testSettings.allowLocalState =
                                    !testSettings.allowLocalState;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setAllowLocalState((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Allow Local Page State
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_allowSaveEvents"
                            type="checkbox"
                            checked={allowSaveEvents}
                            onChange={() => {
                                testSettings.allowSaveEvents =
                                    !testSettings.allowSaveEvents;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setAllowSaveEvents((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Allow Save Events
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_autoSubmit"
                            type="checkbox"
                            checked={autoSubmit}
                            onChange={() => {
                                testSettings.autoSubmit =
                                    !testSettings.autoSubmit;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setAutoSubmit((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Auto Submit Answers
                    </label>
                </div>
                <hr />
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_render"
                            type="checkbox"
                            checked={render}
                            onChange={() => {
                                testSettings.render = !testSettings.render;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setRender((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Render
                    </label>
                </div>
                <hr />
                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_darkMode"
                            type="checkbox"
                            checked={darkMode === "dark"}
                            onChange={() => {
                                setDarkMode(
                                    darkMode === "dark" ? "light" : "dark",
                                );
                            }}
                        />
                        Dark Mode
                    </label>
                </div>

                <div>
                    <label>
                        {" "}
                        <input
                            id="testRunner_showEditor"
                            type="checkbox"
                            checked={showEditor}
                            onChange={() => {
                                testSettings.showEditor =
                                    !testSettings.showEditor;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setShowEditor((was: boolean) => !was);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                        Show Editor
                    </label>
                </div>
                <div>
                    <label>
                        Viewer location{" "}
                        <select
                            id="testRunner_viewerLocation"
                            value={viewerLocation}
                            onChange={(e) => {
                                testSettings.viewerLocation = e.target.value;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setViewerLocation(e.target.value);
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        >
                            <option value="right">right</option>
                            <option value="left">left</option>
                            <option value="top">top</option>
                            <option value="bottom">bottom</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Include Variant Selector{" "}
                        <input
                            id="testRunner_includeVariantSelector"
                            type="checkbox"
                            checked={includeVariantSelector}
                            onChange={() => {
                                testSettings.includeVariantSelector =
                                    !testSettings.includeVariantSelector;
                                localStorage.setItem(
                                    "test settings",
                                    JSON.stringify(testSettings),
                                );
                                setIncludeVariantSelector(
                                    (was: boolean) => !was,
                                );
                                setUpdateNumber((was: number) => was + 1);
                            }}
                        />
                    </label>
                </div>
            </div>
        );
    }

    /**
     * A mock function for retrieving DoenetML source from a URI,
     * using the URI `doenet:[code]`.
     */
    function fetchExternalDoenetML(sourceUri: string) {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                const match = sourceUri.match(/^doenet:(\w+)/);

                if (match) {
                    const doenetML = externalDoenetMLs[match[1]];

                    if (doenetML) {
                        return resolve(doenetML);
                    }
                }
                reject(`DoenetML for "${sourceUri}" not found.`);
            });
        });
    }

    let editorOrViewer: React.JSX.Element | null = null;

    if (typeof doenetMLstring === "string") {
        const editor = (
            <DoenetEditor
                key={"doenetml" + updateNumber}
                doenetML={doenetMLstring}
                addVirtualKeyboard={true}
                height="calc(100vh - 94px)"
                width="100%"
                viewerLocation={viewerLocation}
                fetchExternalDoenetML={fetchExternalDoenetML}
                showAnswerResponseButton={answerResponseCounts !== undefined}
                answerResponseCounts={answerResponseCounts}
            />
        );
        const viewer = (
            <DoenetViewer
                key={"activityViewer" + updateNumber}
                doenetML={doenetMLstring}
                // cid={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
                flags={{
                    showCorrectness,
                    readOnly,
                    solutionDisplayMode,
                    showFeedback,
                    showHints,
                    allowLoadState,
                    allowSaveState,
                    saveRendererState,
                    allowLocalState,
                    allowSaveEvents,
                    autoSubmit,
                }}
                attemptNumber={attemptNumber}
                requestedVariantIndex={requestedVariantIndex.current}
                documentStructureCallback={(args: unknown) => {
                    if (typeof args === "object" && args !== null) {
                        window.postMessage({
                            ...args,
                            messageType: "documentStructure",
                        });
                    }
                }}
                activityId="activityIdFromCypress"
                render={render}
                darkMode={darkMode}
                fetchExternalDoenetML={fetchExternalDoenetML}
                showAnswerResponseButton={answerResponseCounts !== undefined}
                answerResponseCounts={answerResponseCounts}
                includeVariantSelector={includeVariantSelector}
            />
        );

        editorOrViewer = showEditor ? editor : viewer;
    }

    return (
        <div
            style={{
                backgroundColor: "var(--canvas)",
                color: "var(--canvasText)",
            }}
            data-theme={darkMode}
        >
            <div
                style={{
                    backgroundColor: "var(--mainGray)",
                    marginBottom: "12px",
                    padding: "8px",
                }}
            >
                <h3>
                    <div style={{ display: "flex" }}>
                        Test DoenetML for Cypress
                        <Button
                            id="testRunner_toggleControls"
                            onClick={() =>
                                setControlsVisible((was: boolean) => !was)
                            }
                            value={buttonText + " controls"}
                            style={{ marginLeft: "12px" }}
                        />
                    </div>
                </h3>
                {controls}
            </div>
            {editorOrViewer}
        </div>
    );
}
