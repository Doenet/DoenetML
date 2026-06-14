import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetML } from "../src/index";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

type CoreType = "rust" | "javascript";

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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <div
                style={{
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 12px",
                    borderBottom: "1px solid #ccc",
                    background: "#f5f5f5",
                }}
            >
                <span style={{ fontWeight: "bold" }}>Core:</span>
                {(["rust", "javascript"] as CoreType[]).map((ct) => (
                    <label
                        key={ct}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            cursor: "pointer",
                        }}
                    >
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
                <span style={{ marginLeft: "auto", color: "#666" }}>
                    Using <strong>{coreType}</strong> core
                </span>
            </div>
            <div
                style={{ flex: "1 1 auto", overflow: "auto", padding: "12px" }}
            >
                <DoenetML
                    key={coreType}
                    doenetML={doenetMLstring}
                    coreType={coreType}
                />
            </div>
        </div>
    );
}
