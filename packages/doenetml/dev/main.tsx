import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetViewer, DoenetEditor } from "../src/index";
import { SUPPORTED_LOCALES } from "@doenet/i18n";
import "./main.css";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

const SOURCE_STORAGE_KEY = "doenetml-dev-source";
const THEME_STORAGE_KEY = "doenetml-dev-theme";
const DOCUMENT_LOCALE_STORAGE_KEY = "doenetml-dev-document-locale";
const UI_LOCALE_STORAGE_KEY = "doenetml-dev-ui-locale";
const SAVE_DEBOUNCE_MS = 500;
const LOCALE_DEBOUNCE_MS = 400;

type DevTheme = "light" | "dark" | "system";

let saveTimer: number | null = null;

// localStorage throws in constrained environments (private browsing, an iframe
// with third-party storage blocked), and a dev server that can't remember a
// setting should still run. Every read degrades to the default; every write is
// best-effort.
function readSetting(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeSetting(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Ignore localStorage failures in constrained environments.
    }
}

function getInitialSource(): string {
    return readSetting(SOURCE_STORAGE_KEY) ?? doenetMLstring;
}

function getInitialTheme(): DevTheme {
    const stored = readSetting(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
    }
    return "light";
}

function writeSource(source: string) {
    writeSetting(SOURCE_STORAGE_KEY, source);
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

/**
 * `value`, but only after it has stopped changing for `delayMs`.
 *
 * The locale controls are free text, so every keystroke produces an
 * intermediate tag — typing `es-MX` passes through `e`, `es`, `es-`. Changing
 * `documentLocale` rebuilds the core, so applying each prefix as it is typed
 * would rebuild once per character.
 */
function useDebounced<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = React.useState(value);

    React.useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
}

/**
 * A toolbar label with a short stand-in for when the bar is narrow. Only one of
 * the two is ever displayed (see `main.css`); the control carries the full name
 * as its `aria-label`, so what is announced does not change with the width.
 */
function DevLabel({ full, short }: { full: string; short: string }) {
    return (
        <>
            <span className="dev-label-full">{full}: </span>
            <span className="dev-label-short">{short}</span>
        </>
    );
}

function App() {
    const [initialSource] = React.useState(getInitialSource);
    const [resetKey, setResetKey] = React.useState(0);
    const [darkMode, setDarkMode] = React.useState<DevTheme>(getInitialTheme);
    const [documentLocale, setDocumentLocale] = React.useState(
        () => readSetting(DOCUMENT_LOCALE_STORAGE_KEY) ?? "",
    );
    const [uiLocale, setUiLocale] = React.useState(
        () => readSetting(UI_LOCALE_STORAGE_KEY) ?? "",
    );

    const appliedDocumentLocale = useDebounced(
        documentLocale,
        LOCALE_DEBOUNCE_MS,
    );
    const appliedUiLocale = useDebounced(uiLocale, LOCALE_DEBOUNCE_MS);

    function handleReset() {
        resetSource();
        setResetKey((k) => k + 1);
    }

    function handleThemeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const next = event.target.value as DevTheme;
        setDarkMode(next);
        writeSetting(THEME_STORAGE_KEY, next);
    }

    function handleDocumentLocaleChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        setDocumentLocale(event.target.value);
        writeSetting(DOCUMENT_LOCALE_STORAGE_KEY, event.target.value);
    }

    function handleUiLocaleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUiLocale(event.target.value);
        writeSetting(UI_LOCALE_STORAGE_KEY, event.target.value);
    }

    return (
        <div className="dev-app">
            <div className="dev-toolbar">
                <label className="dev-control">
                    <DevLabel full="Theme" short="" />
                    <select
                        aria-label="Theme"
                        value={darkMode}
                        onChange={handleThemeChange}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                    </select>
                </label>
                <label className="dev-control">
                    <DevLabel full="Document locale" short="Doc:" />
                    <input
                        aria-label="Document locale"
                        className="dev-locale-input"
                        list="dev-locale-options"
                        value={documentLocale}
                        placeholder="en"
                        title={
                            "The `documentLocale` prop: the language of the activity's content, " +
                            "and the default for the UI locale. Blank means English. " +
                            "An authored `<document lang>` overrides it, so edit the source to test that. " +
                            "Changing it rebuilds the core."
                        }
                        onChange={handleDocumentLocaleChange}
                    />
                </label>
                <label className="dev-control">
                    <DevLabel full="UI locale" short="UI:" />
                    <input
                        aria-label="UI locale"
                        className="dev-locale-input"
                        list="dev-locale-options"
                        value={uiLocale}
                        placeholder="(document)"
                        title={
                            "The `uiLocale` prop: the language of the chrome around the content — " +
                            "buttons, labels, and diagnostics. Blank falls back to the document locale. " +
                            "Updates live, without rebuilding the core."
                        }
                        onChange={handleUiLocaleChange}
                    />
                </label>
                {/* Suggestions only — the inputs stay free text so an
                    unrecognized tag can be typed to watch it negotiate. Every
                    catalog the repo ships is listed, read off `SUPPORTED_LOCALES`
                    so that seeding a new one needs no edit here, plus three
                    tags that name no directory under `locales/`:

                    - `es-MX`, which negotiates down to `es`;
                    - `en-XA`, the pseudo-locale, which the chrome generates
                      from English on demand — so it is worth typing into the
                      UI locale rather than the document one;
                    - `en-XB`, the same catalog rendered right-to-left. Still
                      worth reaching for beside a real right-to-left language:
                      it is legible to a reader of neither, so a layout can be
                      checked without also reading Arabic. */}
                <datalist id="dev-locale-options">
                    {SUPPORTED_LOCALES.map(({ locale, label }) => (
                        <option key={locale} value={locale} label={label} />
                    ))}
                    <option value="es-MX" />
                    <option value="en-XA" />
                    <option value="en-XB" label="right-to-left pseudo-locale" />
                </datalist>
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
                    // Blank means "not set", so the prop's own default applies:
                    // English for the document, the document locale for the UI.
                    documentLocale={appliedDocumentLocale || undefined}
                    uiLocale={appliedUiLocale || undefined}
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
