import React from "react";
import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
// @ts-ignore
import { DoenetViewer } from "@doenet/doenetml/doenetml-inline-worker.js";
import "./App.css";
import "@doenet/doenetml/style.css";
import { onClassChange, setColorStyle } from "./utilities/dark-mode-monitor";

function App() {
    const [source, setSource] = React.useState(
        "Sample Source\n<graph><line /></graph>",
    );
    const [dirty, setDirty] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState(false);

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

        const bodyElm = document.querySelector("body");
        if (!bodyElm) {
            throw new Error("body element not found");
        }
        if (bodyElm.classList.contains("vscode-dark")) {
            setDarkMode(true);
        }
        const observer = onClassChange(bodyElm, () => {
            if (bodyElm.classList.contains("vscode-dark")) {
                setDarkMode(true);
            } else {
                setDarkMode(false);
            }
        });

        window.addEventListener("message", callback);
        return () => {
            window.removeEventListener("message", callback);
            observer.disconnect();
        };
    });

    React.useEffect(() => {
        setColorStyle(darkMode ? "dark" : "light");
    }, [darkMode]);

    React.useLayoutEffect(() => {
        vscode.postMessage({ command: "ui-loaded" });
    }, []);

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
                <DoenetViewer doenetML={source} darkMode={darkMode} />
            </div>
        </div>
    );
}

export default App;
