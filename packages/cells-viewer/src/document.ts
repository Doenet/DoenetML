// Getting a document into a store: from a pre-encoded fixture or from
// DoenetML text parsed in the browser, with the load timings the benchmark
// reads through `window.__cells` (see `dev/main.tsx`).
import { CellStore, loadCore, type LoadTimings } from "./core";
import type { NodeOrigins } from "./identity";
import { parseDoenetML } from "./parse";
import { boardCount, lastBoardFlushAt } from "./renderers/jsxgraph/Board";
import { measure, measureBetween, stepAsync } from "./trace";

/** The wire format of the generated fixtures: binary CDAST, or DAST JSON. */
export type WireFormat = "cdast" | "json";

export type Encoded = {
    bytes: Uint8Array;
    timings: Partial<LoadTimings>;
    /** Where the nodes came from in the source, when it was parsed here:
     * what lets an edit keep the rendering (`CellStore.replace`). */
    origins?: NodeOrigins;
};

/** A generated fixture, served from `packages/cells-core/fixtures`. */
export async function fetchFixture(
    spec: string,
    fmt: WireFormat,
): Promise<Encoded> {
    const t0 = performance.now();
    const response = await fetch(`/${spec}.${fmt}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    measure("fetch", t0, { bytes: bytes.length });
    if (!response.ok) {
        throw new Error(
            `fixture ${spec}.${fmt} not found; run \`npm run fixtures\` in packages/cells-core`,
        );
    }
    return { bytes, timings: { fetch: performance.now() - t0 } };
}

/** DoenetML text, parsed and encoded in the browser. The parse time stands
 * in for the fetch time in the timings. */
export async function encodeSource(text: string): Promise<Encoded> {
    const t0 = performance.now();
    const { bytes, origins } = await stepAsync(
        "parse",
        () => parseDoenetML(text),
        { chars: text.length },
    );
    return { bytes, origins, timings: { fetch: performance.now() - t0 } };
}

/** Loads the core, hands the store to `mount` (which should render it),
 * and resolves once React has committed the tree and the JSXGraph boards
 * have drawn, with `firstRender` filled in. Given a store already on
 * screen (`into`), the load replaces its document there (an edit), so the
 * rendering is updated rather than made again. */
export async function openDocument(
    { bytes, timings, origins }: Encoded,
    evaluator: string,
    mount: (store: CellStore) => void,
    into: CellStore | null = null,
): Promise<{ store: CellStore; timings: Partial<LoadTimings> }> {
    const loaded = await stepAsync("core", () =>
        loadCore(bytes, evaluator, timings),
    );
    let store: CellStore;
    if (into) {
        store = into;
        store.replace(loaded, origins ?? null);
    } else {
        store = new CellStore(
            loaded.core,
            loaded.comps,
            loaded.diagnostics,
            origins ?? null,
        );
    }
    const t0 = performance.now();
    timings.firstRender = NaN;
    mount(store);
    return new Promise((resolve) => {
        // React schedules the commit as a task, so wait until it has
        // happened. Boards create their elements a commit after the first
        // and draw them in a microtask, both before this frame callback.
        const waitCommit = () => {
            if (store.firstCommitAt === null) {
                requestAnimationFrame(waitCommit);
                return;
            }
            const end = Math.max(store.firstCommitAt, lastBoardFlushAt);
            timings.firstRender = end - t0;
            measureBetween("render", t0, end, {
                components: store.comps.length,
                elements: document.querySelectorAll("*").length,
            });
            measureBetween("render/react commit", t0, store.firstCommitAt, {
                components: store.comps.length,
            });
            if (lastBoardFlushAt > store.firstCommitAt)
                measureBetween(
                    "render/boards",
                    store.firstCommitAt,
                    lastBoardFlushAt,
                    { boards: boardCount() },
                );
            resolve({ store, timings: { ...timings } });
        };
        requestAnimationFrame(waitCommit);
    });
}
