// A prerendered page's script (`src/prerender/page.ts` names it): the live
// viewer, in place of the server's HTML. It loads the page's own source with
// the page's seed and state, the same document the server rendered, and
// renders the viewer into `#root`, whose prerendered HTML React replaces in
// one commit; graphs draw into boxes of the size the server gave them, so
// nothing on the page moves. What the student did to the snapshot meanwhile
// is carried over (`src/prerender/carry.ts`). Nothing of the dev page's
// shell is here, and the editor is not loaded.
import { createRoot } from "react-dom/client";
import { CellsViewer } from "./CellsViewer";
import { preloadCore, type CellStore, type LoadTimings } from "./core";
import { encodeSource, openDocument } from "./document";
import { preloadParser } from "./parse";
import { captureSnapshot, replay, type Carried } from "./prerender/carry";
import { PAGE_FORMAT, type PageMeta } from "./prerender/page";
import { locate } from "./renderers/jsxgraph/Board";
import { measure, measureBetween } from "./trace";

/** The hook a benchmark drives the page through, as on the dev page
 * (`dev/main.tsx`): `ready` once the live viewer is in use. */
type Hook = {
    store: CellStore | null;
    timings: Partial<LoadTimings> | null;
    ready: boolean;
    locate: (name: string | number) => [number, number] | null;
};

// The page's HTML until this module runs: the step `boot`.
measureBetween("boot", 0, performance.now());

// The core's wasm (already compiling, from the page's head) and the
// parser's chunk, both needed before the document can load.
preloadCore().catch(() => {});
preloadParser().catch(() => {});

const hook: Hook = {
    store: null,
    timings: null,
    ready: false,
    locate: (name) => (hook.store ? locate(hook.store, name) : null),
};
(window as unknown as { __cells: Hook }).__cells = hook;

function readJson<T>(id: string): T | null {
    const text = document.getElementById(id)?.textContent;
    return text ? (JSON.parse(text) as T) : null;
}

async function start() {
    const root = document.getElementById("root");
    const meta = readJson<PageMeta>("doenet-meta");
    const source = readJson<string>("doenet-source");
    if (!root || !meta || source === null)
        throw new Error("not a prerendered page: no #root, meta or source");
    if (meta.format !== PAGE_FORMAT)
        // Left as rendered: this build cannot read the page.
        throw new Error(
            `a prerendered page of format ${meta.format}, which this viewer (format ${PAGE_FORMAT}) cannot read`,
        );
    const encoded = await encodeSource(source);
    let carried: Carried | null = null;
    let mountedAt = 0;
    const loaded = await openDocument(
        encoded,
        "dirty-closure",
        (store) => {
            mountedAt = performance.now();
            carried = captureSnapshot(root);
            root.removeAttribute("data-prerendered");
            createRoot(root).render(<CellsViewer store={store} />);
        },
        { seed: meta.seed, state: meta.state ?? undefined },
    );
    if (carried) replay(root, carried);
    // From the swap until the live viewer is drawn and has what the
    // student did: the page responds to input from here on.
    measure("interactive", mountedAt);
    hook.store = loaded.store;
    hook.timings = loaded.timings;
    hook.ready = true;
}

start().catch((e) => console.error(`prerendered page: ${e}`));
