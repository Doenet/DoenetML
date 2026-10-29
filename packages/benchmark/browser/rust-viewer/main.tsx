// The prototype viewer, which renders the flat DAST the Rust core produces,
// mounted with the Rust core (or, with `?core=cells`, the cells core behind
// its bridge, or with `?core=javascript`, the JavaScript core; the bridge is
// ADR 0020 in packages/cells-core) and driven from
// `window.__rust`: load a source, say when it has rendered, resolve a name,
// dispatch an action as a renderer would. Imports the prototype's sources so
// the store is the viewer's own.
// The prototype's entry first: its modules import one another in a cycle
// that only resolves in the order the entry sets.
import "../../../doenetml-prototype/src/index";
import React from "react";
import { createRoot } from "react-dom/client";
import * as JSG from "jsxgraph";
import { Provider } from "react-redux";
import { MathJaxContext } from "better-react-mathjax";
import { PageViewer } from "../../../doenetml-prototype/src/viewer/page-viewer";
import { store } from "../../../doenetml-prototype/src/state/store";
import { defaultFlags } from "../../../doenetml-prototype/src/DoenetML";
import {
    coreThunks,
    getWorker,
    workerCache,
} from "../../../doenetml-prototype/src/state/redux-slices/core/thunks";
import { useAppSelector } from "../../../doenetml-prototype/src/state/hooks";
import { numberFromSerializedAst } from "../../../doenetml-prototype/src/utils/math/math-expression-utils";

const root = createRoot(document.getElementById("root")!);
/** The core behind the viewer: the Rust core, the cells core, or the
 * JavaScript core. */
const requested = new URLSearchParams(location.search).get("core");
const coreType =
    requested === "cells" || requested === "javascript" ? requested : "rust";
const flags = {
    ...defaultFlags,
    allowSaveState: false,
    allowLocalState: false,
};

/** One tick through the prototype path, in ms: the core's tick and the
 * bridge's work in the worker (the cells core only), the rest of the round
 * trip (the worker hop: messages, Comlink, structured clone), the store
 * update and React's render until it commits, and the boards' redraws (the
 * graph renderers redraw as they render, so `react` includes them). `total`
 * is from the action's dispatch to the later of the commit and the last
 * redraw's end. */
type TickSample = {
    core: number;
    bridge: number;
    hop: number;
    react: number;
    redraw: number;
    total: number;
};

/** Each action's dispatch to the worker and the arrival of its answer, and
 * each board redraw, by `performance.now()`. */
const dispatches: { sent: number; received: number }[] = [];
const flushes: { start: number; end: number }[] = [];
const commits: number[] = [];

/** Records when React commits a change to the viewer's elements: its layout
 * effect runs in the commit, after the document's own. */
function CommitProbe() {
    const elements = useAppSelector(
        (state) => state.dast.flatDastRoot.elements,
    );
    React.useLayoutEffect(() => {
        commits.push(performance.now());
    }, [elements]);
    return null;
}
// The prototype's graph renderers redraw their board as they render, each
// with `updateRenderer`; a tick's redraw is every one of them it caused.
const updateRenderer = JSG.Board.prototype.updateRenderer;
JSG.Board.prototype.updateRenderer = function (this: JSG.Board) {
    const start = performance.now();
    const result = updateRenderer.call(this);
    flushes.push({ start, end: performance.now() });
    return result;
};

/** The workers whose actions are timed. (A Comlink proxy answers every
 * property, so a mark on the worker itself cannot say so.) */
const timed = new WeakSet<object>();

/** Time every action the viewer sends its worker, once per worker. */
function timeDispatches() {
    for (const entry of workerCache) {
        if (!entry || timed.has(entry.worker)) continue;
        const worker = entry.worker;
        entry.worker = new Proxy(worker, {
            get(target, key) {
                if (key !== "dispatchAction") return (target as any)[key];
                return async (action: unknown) => {
                    const sent = performance.now();
                    const answer = await target.dispatchAction(action as any);
                    dispatches.push({ sent, received: performance.now() });
                    return answer;
                };
            },
        });
        timed.add(entry.worker);
    }
}

/** A render that throws ends the load with its message instead of a blank page. */
class Boundary extends React.Component<{ children: React.ReactNode }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    componentDidCatch(e: Error) {
        rust.renderError = e.message;
    }
    render() {
        return this.state.failed ? null : this.props.children;
    }
}

const rust = {
    coreType,
    ready: false,
    renderError: null as string | null,
    /** Render `source`; resolves once the core has returned its first flat DAST. */
    async loadSource(source: string) {
        rust.ready = false;
        rust.renderError = null;
        root.render(
            <Boundary>
                <Provider store={store}>
                    <MathJaxContext>
                        <PageViewer
                            source={source}
                            flags={flags}
                            darkMode="light"
                            coreType={coreType}
                        />
                        <CommitProbe />
                    </MathJaxContext>
                </Provider>
            </Boundary>,
        );
        for (;;) {
            const s = store.getState();
            if (s.core.inErrorState) throw new Error("core start failed");
            if (s.dast.flatDastRoot.elements.length > 0) break;
            await new Promise((ok) => setTimeout(ok, 5));
        }
        timeDispatches();
        rust.ready = true;
    },
    /** Where the load's time went in the worker (the cells core only). */
    async loadTimings() {
        const t = await getWorker(store.getState())!.cellsTimings();
        return t?.load ?? null;
    },
    /** The ticks since the last call, each with where its time went; the
     * cells core only, since only its worker times its ticks. */
    async tickSamples(): Promise<TickSample[]> {
        const t = await getWorker(store.getState())!.cellsTimings();
        const ticks = t?.ticks ?? [];
        // The worker times only the actions that ticked; they are the last
        // of the actions sent.
        const sent = dispatches.splice(0).slice(-ticks.length);
        const redraws = flushes.splice(0);
        const commitTimes = commits.splice(0);
        return ticks.map((tick, i) => {
            const d = sent[i];
            const next = sent[i + 1]?.received ?? Infinity;
            const within = (t: number) => t >= d.received && t < next;
            // A tick that changed nothing the viewer shows commits nothing.
            const commit = commitTimes.find(within);
            const tickRedraws = redraws.filter((f) => within(f.start));
            const redrawEnd = tickRedraws.at(-1)?.end ?? 0;
            const roundTrip = d.received - d.sent;
            return {
                core: tick.core,
                bridge: tick.bridge,
                hop: roundTrip - tick.core - tick.bridge,
                react: commit === undefined ? NaN : commit - d.received,
                redraw: tickRedraws.reduce((t, f) => t + f.end - f.start, 0),
                total:
                    commit === undefined
                        ? NaN
                        : Math.max(commit, redrawEnd) - d.sent,
            };
        });
    },
    /** Component index of a name path (`p3.mi`, `P[2]`), or -1. */
    async resolve(name: string, origin = 0): Promise<number> {
        const path = name.split(".").map((part) => {
            const m = part.match(/^([\w-]+)((\[\d+\])*)$/);
            if (!m) throw new Error(`Invalid name to resolve: ${name}`);
            const index = [...m[2].matchAll(/\[(\d+)\]/g)].map(([, n]) => ({
                value: [n],
            }));
            return { type: "flatPathPart", name: m[1], index };
        });
        try {
            const r = await getWorker(store.getState())!.resolvePath({
                path: { path } as any,
                origin,
                skipParentSearch: false,
            });
            return r.unresolvedPath === null ? r.nodeIdx : -1;
        } catch {
            return -1;
        }
    },
    componentType(idx: number): string | undefined {
        const el = store.getState().dast.flatDastRoot.elements[idx] as any;
        return el?.name;
    },
    /** A point's coordinates as the viewer holds them. */
    pointCoords(idx: number): [number, number] | null {
        const el = store.getState().dast.flatDastRoot.elements[idx] as any;
        const props = el?.data?.props;
        if (!props?.x) return null;
        return [
            numberFromSerializedAst(props.x.math_object),
            numberFromSerializedAst(props.y.math_object),
        ];
    },
    /** Dispatch through the store, as a renderer does; resolves when the updates are in the store. */
    async dispatch(action: Record<string, unknown>) {
        await store.dispatch(coreThunks.dispatchAction(action as any));
        if (store.getState().core.inErrorState)
            throw new Error(`action ${JSON.stringify(action)} failed`);
    },
};
(window as any).__rust = rust;
