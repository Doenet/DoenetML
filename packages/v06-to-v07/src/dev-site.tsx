/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { CodeMirror } from "@doenet/codemirror";
import "react18-json-view/src/style.css";
import { toXml } from "@doenet/parser";
import { UiButton } from "@doenet/ui-components";
import "@doenet/ui-components/style.css";
import { updateSyntaxFromV06toV07 } from "./index";

const INITIAL_DOENET_SOURCE = `
<p>Use this to test DoenetML</p>
<graph showNavigation="false">

  <line through="(-8,8) (9,6)" />
  <line through="(0,4)" slope="1/2" styleNumber="2" />

  <line equation="y=2x-8" styleNumber="3" />
  <line equation="x=-6" styleNumber="4" />
  
</graph>
`;

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

function App() {
    const [doenetSource, setDoenetSource] = React.useState(
        INITIAL_DOENET_SOURCE,
    );
    const [processedSource, setProcessedSource] = React.useState("");
    const [processing, setProcessing] = React.useState(false);
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

    return (
        <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
            <div style={{ backgroundColor: "gray", padding: "3px" }}>
                <UiButton
                    onClick={async () => {
                        setProcessing(true);
                        try {
                            const { dast: updatedDast, vfile } =
                                await updateSyntaxFromV06toV07(doenetSource);
                            console.log(
                                "Upgraded syntax to the follow v0.7 DAST",
                                updatedDast,
                                vfile,
                            );
                            const newSource = toXml(updatedDast);
                            console.log(
                                "Upgraded syntax to the follow v0.7 XML",
                                newSource,
                            );
                            setProcessedSource(newSource);
                            setErrorMessages(
                                vfile.messages.map((msg) => String(msg)),
                            );
                        } finally {
                            setProcessing(false);
                        }
                    }}
                >
                    {processing
                        ? "Processing..."
                        : "Upgrade to v0.7 Syntax"}{" "}
                </UiButton>
            </div>
            <div
                style={{ display: "flex", overflow: "hidden", height: "100%" }}
            >
                <div style={{ flexBasis: 0, flexGrow: 1, maxWidth: "50%" }}>
                    <CodeMirror
                        onChange={(val) => {
                            setDoenetSource(val);
                        }}
                        value={INITIAL_DOENET_SOURCE}
                    />
                </div>
                <div
                    style={{
                        flexBasis: 0,
                        flexGrow: 1,
                        maxWidth: "50%",
                        overflow: "scroll",
                    }}
                >
                    <pre>{processedSource}</pre>
                    {errorMessages.length > 0 && (
                        <div>
                            <h3>Warnings</h3>
                            <ul>
                                {errorMessages.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
