import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CellStore, loadDocument, type BackendKind, type LoadTimings } from "./core";
import { StoreContext } from "./hooks";
import { CommitReporter, Component } from "./renderers";
import { parseDoenetML } from "./parse";
import { RENDERER } from "./renderers/kind";
import { lastBoardFlushAt, locate } from "./renderers/jsxgraph/Board";

const FIXTURES = [
  "points-10", "points-100", "points-1000", "points-10000", "points-50000",
  "chain-10", "chain-100", "chain-1000", "chain-10000", "chain-100000",
  "fanout-10", "fanout-100", "fanout-1000", "fanout-10000",
  "aliases-1000", "grid-100x10", "grid-1000x10", "grid-1000x100",
  "sliderchain-10", "sliderchain-1000", "sliderchain-100000", "sliderstack-10", "sliderstack-1000",
  "repeat-100", "repeat-1000", "repeat-10000", "repeat-50000", "recur-100", "recur-1000", "recur-10000",
  "intchain-1000", "intchain-100000", "mathchain-1000", "mathchain-100000", "hidden-1000",
  "sir",
];

const SAMPLE = `<graph name="g">
  <point name="p1" x="1" y="2"/>
  <point name="p2" x="$n" y="$p1.y"/>
  <op name="neg" kind="negate" args="$p1.x"/>
  <point name="p3" x="$neg" y="-3"/>
</graph>
<p>n = <numberInput name="n" value="4"/>, p1 = $p1, p2.x = $p2.x, p3 = $p3</p>
<p>slider bound to n: <slider name="s" from="-10" to="10" step="0.5" bindValueTo="$n"/></p>
<p>count: <slider name="cnt" from="0" to="12" step="1" initialValue="4"/></p>
<graph name="g2">
  <repeatForSequence name="r" from="-8" to="8" length="$cnt" valueName="v" indexName="i">
    <op name="h" kind="scale" k="0.5" args="$v"/>
    <point name="p" x="$v" y="$h"/>
  </repeatForSequence>
  <point name="third" coords="$r[3].p"/>
</graph>
<p>math: <math name="m">3$n + 2</math> is numeric and lowers; <math name="f">x^2 - $n</math> stays symbolic;
  f at n: <evaluate name="e" function="$f" input="$n"/></p>
<p>hide p1: <booleanInput name="hideP1"/></p>
<graph><point extend="$p1" hide="$hideP1"/></graph>`;

declare global {
  interface Window {
    __cells?: {
      store: CellStore | null;
      timings: Partial<LoadTimings> | null;
      ready: boolean;
      load: (spec: string) => Promise<void>;
      /** Parse and load DoenetML text (the screenshot script). */
      loadSource: (text: string) => Promise<void>;
      /** Client coordinates to press to drag a named component on a
       * JSXGraph board, scrolling the board into view first. */
      locate: (name: string | number) => [number, number] | null;
    };
  }
}

export function App() {
  const params = new URLSearchParams(location.search);
  const [store, setStore] = useState<CellStore | null>(null);
  const [timings, setTimings] = useState<Partial<LoadTimings> | null>(null);
  const [source, setSource] = useState(SAMPLE);
  const [error, setError] = useState<string | null>(null);
  const [evaluator, setEvaluator] = useState(params.get("eval") ?? "dirty-closure");
  const [backend, setBackend] = useState<BackendKind>((params.get("backend") as BackendKind) ?? "main");

  async function loadBytes(bytes: Uint8Array, t: Partial<LoadTimings>) {
    setError(null);
    window.__cells!.ready = false;
    try {
      const s = await loadDocument(bytes, backend, evaluator, t);
      const t0 = performance.now();
      t.firstRender = NaN;
      setStore(s);
      setTimings(t);
      // React schedules the commit as a task, so wait until it has happened.
      const waitCommit = () => {
        if (s.firstCommitAt === null) {
          requestAnimationFrame(waitCommit);
          return;
        }
        // JSXGraph boards create their elements a commit after the first
        // and draw them in a microtask, both before this frame callback.
        t.firstRender = Math.max(s.firstCommitAt, lastBoardFlushAt) - t0;
        setTimings({ ...t });
        window.__cells!.timings = t;
        window.__cells!.store = s;
        window.__cells!.ready = true;
      };
      requestAnimationFrame(waitCommit);
    } catch (e) {
      setError(String(e));
    }
  }

  // Wire format: binary CDST by default, DAST JSON with ?fmt=json.
  const fmt = params.get("fmt") === "json" ? "json" : "cdast";

  async function loadFixture(spec: string) {
    const t: Partial<LoadTimings> = {};
    const t0 = performance.now();
    const bytes = new Uint8Array(await (await fetch(`/${spec}.${fmt}`)).arrayBuffer());
    t.fetch = performance.now() - t0;
    await loadBytes(bytes, t);
  }

  async function loadSource(text = source) {
    const t: Partial<LoadTimings> = {};
    const t0 = performance.now();
    const bytes = await parseDoenetML(text.replace(/<\/?p>/g, ""));
    t.fetch = performance.now() - t0; // parse + encode time stands in for fetch here
    await loadBytes(bytes, t);
  }

  useEffect(() => {
    window.__cells = {
      store: null, timings: null, ready: false, load: loadFixture,
      loadSource: (text) => { setSource(text); return loadSource(text); },
      locate: (name) => (window.__cells!.store ? locate(window.__cells!.store, name) : null),
    };
    const doc = params.get("doc");
    if (doc) loadFixture(doc);
    else if (params.get("blank") !== "1") loadSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="controls">
        <label>
          Fixture:{" "}
          <select defaultValue={params.get("doc") ?? ""} onChange={(e) => e.target.value && loadFixture(e.target.value)}>
            <option value="">(source below)</option>
            {FIXTURES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <label>
          Evaluator:{" "}
          <select value={evaluator} onChange={(e) => { setEvaluator(e.target.value); store?.setEvaluator(e.target.value); }}>
            <option>dirty-closure</option>
            <option>full</option>
          </select>
        </label>
        <label>
          Renderer:{" "}
          <select
            value={RENDERER}
            onChange={(e) => {
              // The renderer is fixed per page load; reload with the new choice.
              const p = new URLSearchParams(location.search);
              p.set("renderer", e.target.value);
              location.search = p.toString();
            }}
          >
            <option value="jsxgraph">JSXGraph (Doenet's look)</option>
            <option value="jsxgraph-canvas">JSXGraph canvas</option>
            <option value="svg">plain SVG</option>
          </select>
        </label>
        <label>
          Backend:{" "}
          <select value={backend} onChange={(e) => setBackend(e.target.value as BackendKind)}>
            <option value="main">main thread</option>
            <option value="worker-sab">worker + SharedArrayBuffer</option>
            <option value="worker-msg">worker + postMessage</option>
          </select>
        </label>
      </div>
      {timings && <Timings t={timings} store={store} />}
      <div className="split">
        <section className="pane source-pane">
          <div className="pane-header">
            <span>DoenetML source</span>
            <button onClick={() => loadSource()}>Load source (Ctrl+Enter)</button>
          </div>
          <textarea
            value={source}
            spellCheck={false}
            onChange={(e) => setSource(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                loadSource();
              }
            }}
          />
        </section>
        <section className="pane doc-pane">
          <div className="pane-header">
            <span>Rendered document</span>
          </div>
          {error && <div className="error">{error}</div>}
          {store && <DocumentRoot store={store} />}
        </section>
      </div>
    </div>
  );
}

/** Re-renders the whole tree when a tick rebuilt the document. Children
 * are keyed by stable identity, so this is an update pass over surviving
 * components, not a remount (set `?remount=1` to compare with remounting). */
function DocumentRoot({ store }: { store: CellStore }) {
  const version = useSyncExternalStore(
    (fn) => store.subscribeStructure(fn),
    () => store.structureVersion,
  );
  const remount = new URLSearchParams(location.search).get("remount") === "1";
  const value = useMemo(() => ({ store, version }), [store, version]);
  return (
    <StoreContext.Provider value={value}>
      <CommitReporter />
      <Component key={remount ? version : 0} idx={store.comps.root} inGraph={false} />
    </StoreContext.Provider>
  );
}

function Timings({ t, store }: { t: Partial<LoadTimings>; store: CellStore | null }) {
  const c = t.core;
  const f = (v?: number) => (v === undefined || Number.isNaN(v) ? "   …" : v.toFixed(2).padStart(8));
  return (
    <div className="timings">
      {`cells ${store?.comps.nCells ?? "?"}  essential ${store?.comps.nEssential ?? "?"}  components ${store?.comps.length ?? "?"}\n`}
      {`backend ${t.backend}  fetch/parse ${f(t.fetch)}  worker ${f(t.workerSpawn)}  wasm init ${f(t.wasmInit)}  core total ${f(t.coreTotal)}  tables ${f(t.manifest)} + ${f(t.manifestTransfer)}  first render ${f(t.firstRender)}  (ms)\n`}
      {c && `  core: deserialize ${f(c.deserialize)}  build ${f(c.build)}  schedule ${f(c.schedule)}  initial compute ${f(c.initial_compute)}  passes ${c.passes}  structural depth ${c.structural_depth}`}
    </div>
  );
}
