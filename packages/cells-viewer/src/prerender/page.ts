// A prerendered page: one self-contained HTML file per
// document, seed and state. It paints the document from its own HTML and
// styles, before any script arrives; its scripts are module scripts, which
// the browser runs only after the page is parsed, so nothing they do
// blocks that paint. The layout, which a viewer build reads back:
//
// - `<div id="root" data-prerendered>`: the prerendered document;
// - `<script type="application/json" id="doenet-meta">`: `PageMeta`;
// - `<script type="application/json" id="doenet-source">`: the DoenetML
//   source as a JSON string, which the browser parses and loads.
import { compileWasmEarly } from "./head-script";

/** The version of this layout, in every page's meta: a viewer build that
 * cannot read a page's format leaves its HTML as it is. */
export const PAGE_FORMAT = 1;

/** What the browser must load with to show the document the page shows. */
export type PageMeta = {
    format: number;
    /** The document seed load-time choices draw from (ADR 0009). */
    seed: number;
    /** Saved state (`Core.save_state`'s JSON), or null for none. */
    state: string | null;
    /** The viewer build the page was written for, to diagnose a page
     * served with another build's scripts; null when not known. */
    viewer: string | null;
};

/** The viewer build's files a page uses, by URL, and its styles. */
export type PageAssets = {
    /** The viewer's styles, inlined so the first paint needs no fetch. */
    css: string;
    /** The core's wasm, compiled from the head while the page loads. */
    wasm: string | null;
    /** The module that replaces the prerendered HTML with the live
     * viewer; none, for a page that stays as rendered. */
    entry: string | null;
    /** Modules the entry imports, fetched in parallel with it (the
     * parser's chunk, a dynamic import, among them). */
    preload: string[];
};

/** A value as JSON safe to put inside a `<script>` element: a `<` would
 * let text such as `</script>` in a document end the element early. */
export function scriptJson(value: unknown): string {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** The page's own layout around the document, as the dev page's viewer
 * panel lays it out. */
const PAGE_CSS = `html, body { margin: 0; }
body { padding: 10px 16px; box-sizing: border-box; }`;

/** The page: `html` (from `prerender`) with what loads it in the browser. */
export function writePage({
    html,
    meta,
    source,
    assets,
    title = "DoenetML",
}: {
    html: string;
    meta: PageMeta;
    source: string;
    assets: PageAssets;
    title?: string;
}): string {
    const head = [
        `<meta charset="UTF-8" />`,
        `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
        `<title>${escapeHtml(title)}</title>`,
        `<style>${PAGE_CSS}\n${assets.css}</style>`,
    ];
    if (assets.entry) {
        if (assets.wasm)
            head.push(
                // Inline, so the browser starts it at once; it imports
                // nothing (`head-script.ts` writes it).
                `<script>(function () {${compileWasmEarly(assets.wasm)}\n})();</script>`,
            );
        for (const href of [assets.entry, ...assets.preload])
            head.push(
                `<link rel="modulepreload" crossorigin href="${escapeHtml(href)}" />`,
            );
        head.push(
            `<script type="module" crossorigin src="${escapeHtml(assets.entry)}"></script>`,
        );
    }
    return `<!doctype html>
<html lang="en">
<head>
${head.join("\n")}
</head>
<body>
<div id="root" data-prerendered>${html}</div>
<script type="application/json" id="doenet-meta">${scriptJson(meta)}</script>
<script type="application/json" id="doenet-source">${scriptJson(source)}</script>
</body>
</html>
`;
}
