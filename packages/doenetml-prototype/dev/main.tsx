import React from "react";
import { createRoot } from "react-dom/client";
import { EditorViewer } from "../src/index";
import type { CoreType } from "../src/index";
import "./main.css";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

/**
 * Read the selected core from the `?core=` query param so the choice survives
 * the page reload that switching cores triggers (see `selectCore`).
 */
function getInitialCoreType(): CoreType {
    const param = new URLSearchParams(window.location.search).get("core");
    return param === "javascript" ? "javascript" : "rust";
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    const coreType = getInitialCoreType();

    function selectCore(next: CoreType) {
        if (next === coreType) {
            return;
        }
        // The worker is created once and cached for the lifetime of the page,
        // so a full reload is the reliable way to spin up a fresh worker
        // initialized with the newly chosen core.
        const url = new URL(window.location.href);
        url.searchParams.set("core", next);
        window.location.href = url.href;
    }

    return (
        <div className="dev-app">
            <div className="dev-core-toolbar">
                <span className="dev-core-toolbar-label">Core:</span>
                {(["rust", "javascript"] as CoreType[]).map((ct) => (
                    <label key={ct} className="dev-core-option">
                        <input
                            type="radio"
                            name="coreType"
                            value={ct}
                            checked={coreType === ct}
                            onChange={() => selectCore(ct)}
                        />
                        {ct}
                    </label>
                ))}
                <span className="dev-core-status">
                    Using <strong>{coreType}</strong> core
                </span>
            </div>
            <div className="dev-viewer">
                <EditorViewer
                    key={coreType}
                    doenetML={doenetMLstring}
                    coreType={coreType}
                />
            </div>
        </div>
    );
}
