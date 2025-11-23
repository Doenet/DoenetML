import React, { useState } from "react";
import { DoenetML, EditorViewer } from "@doenet/doenetml-prototype";
// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";
import { Button } from "@doenet/ui-components";
import { DoenetEditor, DoenetViewer } from "@doenet/doenetml";
import "@doenet/virtual-keyboard/style.css";
import "@doenet/doenetml/style.css";

export default function TestViewer() {
    const defaultTestSettings: {
        requestedVariantIndex: number;
        showCorrectness: boolean;
        readOnly: boolean;
        showFeedback: boolean;
        showHints: boolean;
        showEditor: boolean;
        viewerLocation: "left" | "right" | "bottom" | "top";
    } = {
        requestedVariantIndex: 1,
        showCorrectness: true,
        readOnly: false,
        showFeedback: true,
        showHints: true,
        showEditor: false,
        viewerLocation: "right",
    };

    const [controlsVisible, setControlsVisible] = useState(false);
    const [testSettings, setTestSettings] = useState(defaultTestSettings);
    const [updateNumber, setUpdateNumber] = useState(0);
    const [usePrototype, setUsePrototype] = useState(false);

    let {
        requestedVariantIndex,
        showCorrectness,
        readOnly,
        showFeedback,
        showHints,
        showEditor,
        viewerLocation,
    } = testSettings;

    let controls = null;
    let buttonText = "show";
    if (controlsVisible) {
        buttonText = "hide";
        controls = (
            <div style={{ padding: "8px" }}>
                <p>
                    The DoenetML is displayed is loaded from the file:{" "}
                    <code>src/test/testCode.doenet</code>.
                </p>
                <div>
                    <Button
                        onClick={() => {
                            setTestSettings(defaultTestSettings);
                            setUpdateNumber((was) => was + 1);
                        }}
                        value="Reset"
                    />
                </div>
                <hr />
                <div>
                    <label>
                        {" "}
                        <input
                            type="checkbox"
                            checked={showCorrectness}
                            onChange={() => {
                                setTestSettings((was) => {
                                    let newObj = { ...was };
                                    newObj.showCorrectness =
                                        !was.showCorrectness;
                                    return newObj;
                                });
                                setUpdateNumber((was) => was + 1);
                            }}
                        />
                        Show Correctness
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            type="checkbox"
                            checked={readOnly}
                            onChange={() => {
                                setTestSettings((was) => {
                                    let newObj = { ...was };
                                    newObj.readOnly = !was.readOnly;
                                    return newObj;
                                });
                                setUpdateNumber((was) => was + 1);
                            }}
                        />
                        Read Only
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            type="checkbox"
                            checked={showFeedback}
                            onChange={() => {
                                setTestSettings((was) => {
                                    let newObj = { ...was };
                                    newObj.showFeedback = !was.showFeedback;
                                    return newObj;
                                });
                                setUpdateNumber((was) => was + 1);
                            }}
                        />
                        Show Feedback
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            type="checkbox"
                            checked={showHints}
                            onChange={() => {
                                setTestSettings((was) => {
                                    let newObj = { ...was };
                                    newObj.showHints = !was.showHints;
                                    return newObj;
                                });
                                setUpdateNumber((was) => was + 1);
                            }}
                        />
                        Show Hints
                    </label>
                </div>
                <div>
                    <label>
                        {" "}
                        <input
                            type="checkbox"
                            checked={showEditor}
                            onChange={() => {
                                setTestSettings((was) => {
                                    let newObj = { ...was };
                                    newObj.showEditor = !was.showEditor;
                                    return newObj;
                                });
                            }}
                        />
                        Show Editor
                    </label>
                </div>
                <div>
                    <label>
                        Viewer location{" "}
                        <select
                            value={viewerLocation}
                            onChange={(e) => {
                                setTestSettings((was) => {
                                    let newObj = { ...was };
                                    //@ts-ignore
                                    newObj.viewerLocation = e.target.value;
                                    return newObj;
                                });
                            }}
                        >
                            <option value="right">right</option>
                            <option value="left">left</option>
                            <option value="top">top</option>
                            <option value="bottom">bottom</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }

    const editor = usePrototype ? (
        <EditorViewer
            key={"doenetml" + updateNumber}
            doenetML={doenetMLstring}
        />
    ) : (
        <DoenetEditor
            key={"doenetml" + updateNumber}
            doenetML={doenetMLstring}
            addVirtualKeyboard={true}
            height="calc(100vh - 94px)"
            width="100%"
            viewerLocation={viewerLocation}
        />
    );

    const viewer = usePrototype ? (
        <DoenetML
            key={"doenetml" + updateNumber}
            doenetML={doenetMLstring}
            flags={{
                showCorrectness,
                readOnly,
                showFeedback,
                showHints,
            }}
        />
    ) : (
        <DoenetViewer
            key={"doenetml" + updateNumber}
            doenetML={doenetMLstring}
            flags={{
                showCorrectness,
                readOnly,
                showFeedback,
                showHints,
                solutionDisplayMode: "button",
                messageParent: false,
                autoSubmit: false,
            }}
            activityId=""
            addVirtualKeyboard={true}
        />
    );

    return (
        <div>
            <div
                style={{
                    backgroundColor: "#e3e3e3",
                    marginBottom: "12px",
                    padding: "8px",
                }}
            >
                <h3>
                    <div style={{ display: "flex" }}>
                        Test DoenetML
                        <Button
                            onClick={() => setControlsVisible((was) => !was)}
                            value={buttonText + " controls"}
                            style={{ marginLeft: "12px" }}
                        />
                        <label style={{ marginLeft: "4px", fontSize: "18px" }}>
                            <input
                                type="checkbox"
                                checked={usePrototype}
                                onChange={() => {
                                    setUsePrototype((was) => !was);
                                    setUpdateNumber((was) => was + 1);
                                }}
                            />
                            Use DoenetML Prototype
                        </label>
                    </div>
                </h3>
                {controls}
            </div>
            {showEditor ? editor : viewer}
        </div>
    );
}
