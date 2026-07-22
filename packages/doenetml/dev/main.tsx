import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetViewer, DoenetEditor } from "../src/index";
import "./main.css";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

const SOURCE_STORAGE_KEY = "doenetml-dev-source";
const THEME_STORAGE_KEY = "doenetml-dev-theme";
const SAVE_DEBOUNCE_MS = 500;

type DevTheme = "light" | "dark" | "system";

let saveTimer: number | null = null;

function getInitialSource(): string {
    try {
        return localStorage.getItem(SOURCE_STORAGE_KEY) ?? doenetMLstring;
    } catch {
        return doenetMLstring;
    }
}

function getInitialTheme(): DevTheme {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }
    } catch {
        // Ignore localStorage failures in constrained environments.
    }
    return "light";
}

function writeTheme(theme: DevTheme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // Ignore localStorage failures in constrained environments.
    }
}

function writeSource(source: string) {
    try {
        localStorage.setItem(SOURCE_STORAGE_KEY, source);
    } catch {
        // Ignore localStorage failures in constrained environments.
    }
}

// Wired to the editor's immediate (per-keystroke) change callback, so debounce
// the writes: calling localStorage.setItem synchronously on every keystroke can
// noticeably block the UI for larger documents.
function saveSource(source: string) {
    if (saveTimer !== null) {
        window.clearTimeout(saveTimer);
    }
    saveTimer = window.setTimeout(() => {
        saveTimer = null;
        writeSource(source);
    }, SAVE_DEBOUNCE_MS);
}

function resetSource() {
    // Cancel any pending debounced save so a queued write can't overwrite the
    // reset.
    if (saveTimer !== null) {
        window.clearTimeout(saveTimer);
        saveTimer = null;
    }
    try {
        localStorage.removeItem(SOURCE_STORAGE_KEY);
    } catch {
        // Ignore localStorage failures in constrained environments.
    }
}

// Toggle to switch prefigure source in dev.
// true  – load from local @doenet/prefigure build (served by this dev server).
// false – use the CDN version configured in prefigureConfig.ts.
const USE_LOCAL_PREFIGURE = true;

async function configurePrefigureDevSource() {
    if (!USE_LOCAL_PREFIGURE) {
        delete (globalThis as any).__DOENET_PREFIGURE_MODULE_URL__;
        delete (globalThis as any).__DOENET_PREFIGURE_INDEX_URL__;
        return;
    }

    const { default: localModuleUrl } = (await import(
        // @ts-ignore - Vite resolves ?url virtual imports at runtime.
        "@doenet/prefigure/prefigure.js?url"
    )) as { default: string };

    (globalThis as any).__DOENET_PREFIGURE_MODULE_URL__ = new URL(
        localModuleUrl,
        window.location.href,
    ).toString();
    (globalThis as any).__DOENET_PREFIGURE_INDEX_URL__ = new URL(
        "./assets/",
        (globalThis as any).__DOENET_PREFIGURE_MODULE_URL__,
    ).toString();
}

await configurePrefigureDevSource();

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    const [initialSource] = React.useState(getInitialSource);
    const [resetKey, setResetKey] = React.useState(0);
    const [darkMode, setDarkMode] = React.useState<DevTheme>(getInitialTheme);

    function handleReset() {
        resetSource();
        setResetKey((k) => k + 1);
    }

    function handleThemeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const next = event.target.value as DevTheme;
        setDarkMode(next);
        writeTheme(next);
    }

    return (
        <div className="dev-app">
            <div className="dev-toolbar">
                <label className="dev-theme-control">
                    Theme:{" "}
                    <select value={darkMode} onChange={handleThemeChange}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                    </select>
                </label>
                <span className="dev-toolbar-status">
                    DoenetML source is saved to local storage as you edit.
                </span>
                <button
                    className="dev-reset-button"
                    title="Clear saved DoenetML source from local storage and reset to default."
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
            <div className="dev-viewer">
                <DoenetEditor
                    key={resetKey}
                    doenetML={resetKey === 0 ? initialSource : doenetMLstring}
                    height="100%"
                    darkMode={darkMode}
                    fetchExternalDoenetML={fetchExternalDoenetML}
                    immediateDoenetmlChangeCallback={saveSource}
                />
            </div>
        </div>
    );
}

const doenetMLs: Record<string, string> = {
    abcdef: `<problem name="p"><title>A problem</title><p>What is 1+1? <answer name="ans">2</answer></p><p>Credit achieved: $p.creditAchieved</p></problem>`,
    defghi: `<problem name="loop" copy="doenet:defghi" />`,
    abc: `<section name="s1" copy="doenet:def"><p name="p1">Hello</p></section>`,
    def: `<section name="s2" copy="doenet:ghi"><p name="p2">Bye</p></section>`,
    ghi: `<section name="s3"><p name="p3">How</p></section>`,
};

function fetchExternalDoenetML(sourceUri: string) {
    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            const match = sourceUri.match(/^doenet:(\w+)/);

            if (match) {
                const doenetML = doenetMLs[match[1]];

                if (doenetML) {
                    return resolve(doenetML);
                }
            }
            reject(`DoenetML for "${sourceUri}" not found.`);
        });
    });
}
