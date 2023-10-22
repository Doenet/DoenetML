import React from "react";
import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
// @ts-ignore
import { DoenetML } from "@doenet/doenetml/doenetml-inline-worker.js";
import "./App.css";
import "@doenet/doenetml/style.css";

function App() {
    const [source, setSource] = React.useState(
        "Sample Source\n<graph><line /></graph>",
    );
    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
        const callback = (event: MessageEvent) => {
            const message = event.data; // The JSON data our extension sent
            switch (message.command) {
                case "setSource":
                    setSource(message.text);
                    setDirty(false);
                    break;
                case "dirty":
                    setDirty(true);
                    break;
            }
        };

        window.addEventListener("message", callback);
        return () => {
            window.removeEventListener("message", callback);
        };
    });

    function refreshClick() {
        vscode.postMessage({
            command: "refresh",
            text: "",
        });
    }

    return (
        <div className="main">
            <div className="header">
                <h1>DoenetML Preview</h1>
                <VSCodeButton
                    onClick={refreshClick}
                    title="Force a refresh of the DoenetML source"
                >
                    Force Refresh{dirty ? " *" : ""}
                </VSCodeButton>
            </div>
            <div className="doenet-preview">
                <DoenetML doenetML={source} />
            </div>
        </div>
    );
}

export default App;
