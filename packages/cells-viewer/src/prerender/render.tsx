// Prerendering (ADR 0017): a document rendered to HTML on a server, so a
// page shows it before any of its scripts or the core's wasm arrive. The
// browser later loads the same source with the same seed and state,
// renders the live viewer and replaces this HTML with it. This is the
// entry of the server build (`vite.prerender.config.ts`, to
// `dist-prerender/render.js`); `scripts/prerender.mjs` calls it.
import { renderToString } from "react-dom/server";
import { CellsViewer } from "../CellsViewer";
import { initCore, loadDocument, type Diagnostic } from "../core";
import { parseDoenetML } from "../parse";
import viewerCss from "../viewer.css?inline";
import { PAGE_FORMAT, writePage, type PageMeta } from "./page";

export { initCore, writePage, viewerCss };
export type { PageAssets, PageMeta } from "./page";

export type Prerendered = {
    /** The document, rendered: what goes in the page's root. */
    html: string;
    /** What the browser must load with to show the same document. */
    meta: PageMeta;
    /** What the load reported about the document (ADR 0013). */
    diagnostics: Diagnostic[];
};

/**
 * Render DoenetML `source` to HTML, loaded with `seed` and saved `state`
 * as the browser will load it. Call `initCore` with the core's wasm first:
 * the same wasm the page loads, so both run the same core.
 */
export async function prerender({
    source,
    seed = 0,
    state,
    viewer,
}: {
    source: string;
    seed?: number;
    state?: string;
    /** The viewer build the page loads, named in its meta to diagnose a
     * page served with another build's scripts. */
    viewer?: string;
}): Promise<Prerendered> {
    const bytes = await parseDoenetML(source);
    const store = await loadDocument(
        bytes,
        "dirty-closure",
        {},
        {
            seed,
            state,
        },
    );
    const html = renderToString(<CellsViewer store={store} />);
    return {
        html,
        meta: {
            format: PAGE_FORMAT,
            seed,
            state: state ?? null,
            viewer: viewer ?? null,
        },
        diagnostics: store.diagnostics,
    };
}
