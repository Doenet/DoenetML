// Getting a document into a store: from a pre-encoded fixture or from
// DoenetML text parsed in the browser, with the load timings the benchmark
// reads through `window.__cells` (see `dev/main.tsx`).
import {
    CellStore,
    loadDocument,
    type LoadOptions,
    type LoadTimings,
} from "./core";
import { parseDoenetML } from "./parse";
import { boardCount, lastBoardFlushAt } from "./renderers/jsxgraph/Board";
import { measure, measureBetween, stepAsync } from "./trace";

/** The wire format of the generated fixtures: binary CDAST, or DAST JSON. */
export type WireFormat = "cdast" | "json";

export type Encoded = { bytes: Uint8Array; timings: Partial<LoadTimings> };

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
    const bytes = await stepAsync("parse", () => parseDoenetML(text), {
        chars: text.length,
    });
    return { bytes, timings: { fetch: performance.now() - t0 } };
}

/** Builds the store (with `options`' seed and state), hands it to `mount`
 * (which should render it), and resolves once React has committed the
 * tree and the JSXGraph boards have drawn, with `firstRender` filled in. */
export async function openDocument(
    { bytes, timings }: Encoded,
    evaluator: string,
    mount: (store: CellStore) => void,
    options: LoadOptions = {},
): Promise<{ store: CellStore; timings: Partial<LoadTimings> }> {
    const store = await stepAsync("core", () =>
        loadDocument(bytes, evaluator, timings, options),
    );
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
