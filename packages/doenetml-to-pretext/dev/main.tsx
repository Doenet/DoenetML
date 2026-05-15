import React from "react";
import { createRoot } from "react-dom/client";
import { CodeMirror } from "@doenet/codemirror";
import { ResizablePanelPair, UiButton } from "@doenet/ui-components";
import "@doenet/ui-components/style.css";
// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

import "./main.css";
import { doenetMLToPretext, getStaticDast } from "../src";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    const [source, setSource] = React.useState<string>(doenetMLstring);
    const [pretextOutput, setPretextOutput] = React.useState<string>("");
    const [isConverting, setIsConverting] = React.useState<boolean>(false);

    return (
        <div className="container">
            <div className="banner">
                <UiButton
                    onClick={async () => {
                        if (isConverting) {
                            return;
                        }
                        setIsConverting(true);
                        console.log("Converting to PreTeXt", source);
                        try {
                            const ret = await doenetMLToPretext(source);
                            console.log("Conversion result:", ret);
                            setPretextOutput(ret);
                        } finally {
                            setIsConverting(false);
                        }
                    }}
                    disabled={isConverting}
                >
                    {isConverting
                        ? "Converting to PreTeXt..."
                        : "Convert to PreTeXt"}
                </UiButton>
            </div>
            <ResizablePanelPair
                panelA={
                    <CodeMirror value={doenetMLstring} onChange={setSource} />
                }
                panelB={
                    <div
                        className="pretext-output-container"
                        style={{
                            padding: "1em",
                            minWidth: "100%",
                            minHeight: "100%",
                            overflow: "auto",
                        }}
                    >
                        <h1>PreTeXt Output</h1>
                        {isConverting ? (
                            <div className="loading-state">
                                <div
                                    className="spinner"
                                    aria-label="Converting to PreTeXt"
                                />
                                <p>Converting to PreTeXt...</p>
                            </div>
                        ) : pretextOutput ? (
                            <textarea
                                className="pretext-output"
                                readOnly
                                value={pretextOutput}
                            ></textarea>
                        ) : (
                            <p>
                                Your converted PreTeXt content will appear here.
                            </p>
                        )}
                    </div>
                }
            />
        </div>
    );
}
