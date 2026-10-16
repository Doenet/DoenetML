import React from "react";
import { createRoot } from "react-dom/client";
import { EditorViewer } from "../src/EditorViewer";
import type { CellStore, LoadTimings } from "../src/core";
import {
    encodeSource,
    fetchFixture,
    openDocument,
    type Encoded,
    type WireFormat,
} from "../src/document";
import { locate } from "../src/renderers/jsxgraph/Board";
import { SEGMENTS, TickSparkline } from "./TickSparkline";
import "./main.css";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

const SOURCE_STORAGE_KEY = "cells-viewer-dev-source";
const EVALUATOR_STORAGE_KEY = "cells-viewer-dev-evaluator";
const SAVE_DEBOUNCE_MS = 500;
/** A fixture's DoenetML is shown in the editor up to this size; the largest
 * (`chain-100000`) is 3.9 MB, more than the editor handles comfortably. */
const MAX_EDITOR_SOURCE = 1 << 20;

let saveTimer: number | null = null;

// localStorage throws in constrained environments, and a dev server that
// can't remember a setting should still run.
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

// Debounced: the editor reports every keystroke.
function saveSource(source: string) {
    if (saveTimer !== null) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
        saveTimer = null;
        writeSetting(SOURCE_STORAGE_KEY, source);
    }, SAVE_DEBOUNCE_MS);
}

function resetSource() {
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

declare global {
    interface Window {
        /** The hook `packages/benchmark`'s browser harness drives. */
        __cells?: {
            store: CellStore | null;
            timings: Partial<LoadTimings> | null;
            ready: boolean;
            /** Load a generated fixture by name. */
            load: (spec: string) => Promise<void>;
            /** Parse and load DoenetML text. */
            loadSource: (text: string) => Promise<void>;
            /** Client coordinates to press to drag a named component on a
             * JSXGraph board, scrolling the board into view first. */
            locate: (name: string | number) => [number, number] | null;
        };
    }
}

const params = new URLSearchParams(window.location.search);
/** `?fmt=json` loads the fixtures as DAST JSON instead of binary CDAST. */
const fmt: WireFormat = params.get("fmt") === "json" ? "json" : "cdast";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    const [evaluator, setEvaluator] = React.useState(
        () =>
            params.get("eval") ??
            readSetting(EVALUATOR_STORAGE_KEY) ??
            "dirty-closure",
    );
    const [fixture, setFixture] = React.useState(params.get("doc") ?? "");
    const [source, setSource] = React.useState(() =>
        params.get("doc")
            ? ""
            : (readSetting(SOURCE_STORAGE_KEY) ?? doenetMLstring),
    );
    /** What the viewer shows, for the Refresh button's enabled state. */
    const [rendered, setRendered] = React.useState<string | null>(null);
    const [store, setStore] = React.useState<CellStore | null>(null);
    const [timings, setTimings] = React.useState<Partial<LoadTimings> | null>(
        null,
    );
    const [error, setError] = React.useState<string | null>(null);
    const evaluatorRef = React.useRef(evaluator);
    evaluatorRef.current = evaluator;

    const open = React.useCallback(async (encoded: Promise<Encoded>) => {
        setError(null);
        window.__cells!.ready = false;
        try {
            const loaded = await openDocument(
                await encoded,
                evaluatorRef.current,
                (s) => setStore(s),
            );
            setTimings(loaded.timings);
            window.__cells!.timings = loaded.timings;
            window.__cells!.store = loaded.store;
            window.__cells!.ready = true;
        } catch (e) {
            setError(String(e));
        }
    }, []);

    const loadSource = React.useCallback(
        (text: string) => {
            setFixture("");
            setRendered(text);
            return open(encodeSource(text));
        },
        [open],
    );

    const loadFixture = React.useCallback(
        async (spec: string) => {
            setFixture(spec);
            const encoded = fetchFixture(spec, fmt);
            // The fixture's DoenetML goes in the editor, so it can be read
            // and edited; refreshing then parses it in the browser.
            const response = await fetch(`/${spec}.doenet`);
            const text = response.ok ? await response.text() : "";
            const shown =
                text.length > MAX_EDITOR_SOURCE
                    ? `<!-- ${spec}: ${(text.length / 1e6).toFixed(1)} MB of DoenetML, not shown -->\n`
                    : text;
            setSource(shown);
            setRendered(shown);
            await open(encoded);
        },
        [open],
    );

    React.useEffect(() => {
        window.__cells = {
            store: null,
            timings: null,
            ready: false,
            load: loadFixture,
            loadSource: (text) => {
                setSource(text);
                return loadSource(text);
            },
            locate: (name) =>
                window.__cells!.store
                    ? locate(window.__cells!.store, name)
                    : null,
        };
        const doc = params.get("doc");
        if (doc) loadFixture(doc);
        // `?blank=1` (the benchmark) waits for `loadSource` instead.
        else if (params.get("blank") !== "1") loadSource(source);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleEvaluatorChange(
        event: React.ChangeEvent<HTMLSelectElement>,
    ) {
        const next = event.target.value;
        setEvaluator(next);
        writeSetting(EVALUATOR_STORAGE_KEY, next);
        store?.setEvaluator(next);
    }

    function handleFixtureChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const spec = event.target.value;
        if (spec) loadFixture(spec);
        else loadSource(source);
    }

    function handleReset() {
        resetSource();
        setSource(doenetMLstring);
        loadSource(doenetMLstring);
    }

    return (
        <div className="dev-app">
            <div className="dev-toolbar">
                <label className="dev-control">
                    Evaluator:
                    <select
                        aria-label="Evaluator"
                        value={evaluator}
                        title="How a tick recomputes the document: the dirty closure, or every cell (`?eval=`)."
                        onChange={handleEvaluatorChange}
                    >
                        <option value="dirty-closure">dirty closure</option>
                        <option value="full">full</option>
                    </select>
                </label>
                {__CELLS_FIXTURES__.length > 0 && (
                    <label className="dev-control">
                        Fixture:
                        <select
                            aria-label="Fixture"
                            value={fixture}
                            title="A generated document from packages/cells-core/fixtures, loaded pre-encoded (`?doc=`); its DoenetML is shown in the editor."
                            onChange={handleFixtureChange}
                        >
                            <option value="">(the editor)</option>
                            {__CELLS_FIXTURES__.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
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
                <EditorViewer
                    source={source}
                    onSourceChange={(text) => {
                        setSource(text);
                        saveSource(text);
                    }}
                    canRefresh={source !== rendered}
                    onRefresh={() => loadSource(source)}
                    store={store}
                    error={error}
                    status={timings && <Timings t={timings} store={store} />}
                />
            </div>
        </div>
    );
}

/** The status strip: the load time (detail in the tooltip) and a legend
 * on the left, the sparkline of the ticks filling the rest. */
function Timings({
    t,
    store,
}: {
    t: Partial<LoadTimings>;
    store: CellStore | null;
}) {
    const c = t.core;
    const detail = [
        `cells ${store?.comps.nCells ?? "?"}, essential ${store?.comps.nEssential ?? "?"}, components ${store?.comps.length ?? "?"}`,
        `fetch/parse ${ms(t.fetch)}, wasm init ${ms(t.wasmInit)}, core total ${ms(t.coreTotal)}, component table ${ms(t.componentTable)}, first render ${ms(t.firstRender)}`,
        c &&
            `core: deserialize ${ms(c.deserialize)}, build ${ms(c.build)}, schedule ${ms(c.schedule)}, initial compute ${ms(c.initial_compute)}, passes ${c.passes}, structural depth ${c.structural_depth}`,
    ]
        .filter(Boolean)
        .join("\n");
    return (
        <>
            <div className="status-load">
                <span title={detail}>
                    {store?.comps.nCells ?? "?"} cells · load{" "}
                    {ms(t.firstRender)}
                </span>
                <span className="status-legend">
                    {SEGMENTS.map((seg) => (
                        <span key={seg.name} title={seg.title}>
                            <i style={{ background: seg.color }} />
                            {seg.name}
                        </span>
                    ))}
                </span>
            </div>
            <div className="status-ticks">
                {store && <TickSparkline store={store} />}
            </div>
        </>
    );
}

const ms = (v?: number) =>
    v === undefined || Number.isNaN(v)
        ? "…"
        : `${v < 10 ? v.toFixed(1) : Math.round(v)} ms`;
