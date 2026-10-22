// A prerendered page: what `prerender` returns, and the page `writePage`
// makes of it, read back as a viewer build will read it.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, test } from "vitest";
import { PAGE_FORMAT, scriptJson, writePage, type PageAssets } from "./page";
import { initCore, prerender } from "./render";

const homework = readFileSync(
    fileURLToPath(
        new URL("../../../benchmark/fixtures/homework.doenet", import.meta.url),
    ),
    "utf8",
);

const assets: PageAssets = {
    css: ".doc { line-height: 1.6; }",
    wasm: "/assets/cells_wasm_bg-HASH.wasm",
    entry: "/assets/snapshot-entry-HASH.js",
    preload: ["/assets/react-HASH.js", "/assets/parser-HASH.js"],
};

/** The text of the `<script>` element with `id` in `page`, as JSON. */
function readScript(page: string, id: string) {
    const m = page.match(
        new RegExp(
            `<script type="application/json" id="${id}">(.*?)</script>`,
            "s",
        ),
    );
    if (!m) throw new Error(`no ${id}`);
    return JSON.parse(m[1]);
}

beforeAll(async () => {
    const wasm = createRequire(import.meta.url).resolve(
        "@doenet/cells-core/pkg/cells_wasm_bg.wasm",
    );
    await initCore(readFileSync(wasm));
});

describe("prerender", () => {
    test("renders the document, and says how to load it again", async () => {
        const out = await prerender({
            source: homework,
            seed: 7,
            viewer: "snapshot-entry-HASH.js",
        });
        expect(out.html).toMatch(/^<div class="doc">/);
        expect(out.meta).toEqual({
            format: PAGE_FORMAT,
            seed: 7,
            state: null,
            viewer: "snapshot-entry-HASH.js",
        });
    });
});

describe("writePage", () => {
    test("holds the document, its source and its meta", async () => {
        const { html, meta } = await prerender({ source: homework });
        const page = writePage({ html, meta, source: homework, assets });
        expect(page).toContain(`<div id="root" data-prerendered>${html}</div>`);
        expect(readScript(page, "doenet-source")).toBe(homework);
        expect(readScript(page, "doenet-meta")).toEqual(meta);
        expect(page).toContain(`<style>`);
        expect(page).toContain(assets.css);
    });

    test("loads its scripts without blocking the paint", async () => {
        const { html, meta } = await prerender({ source: homework });
        const page = writePage({ html, meta, source: homework, assets });
        const head = page.slice(0, page.indexOf("</head>"));
        // Only module scripts, which run after the page is parsed, and the
        // inline one that starts the wasm's compile.
        expect(head).toContain(
            `<script type="module" crossorigin src="${assets.entry}"></script>`,
        );
        expect(head).not.toMatch(/<script src=/);
        for (const href of [assets.entry, ...assets.preload])
            expect(head).toContain(
                `rel="modulepreload" crossorigin href="${href}"`,
            );
        expect(head).toContain(JSON.stringify(assets.wasm));
        // Presses in the snapshot are recorded from the start, before the
        // body is parsed, for the live viewer to press again.
        expect(head).toContain("window.__cellsClicks");
    });

    test("without a client entry, stays as rendered", async () => {
        const { html, meta } = await prerender({ source: homework });
        const page = writePage({
            html,
            meta,
            source: homework,
            assets: { ...assets, entry: null, preload: [] },
        });
        expect(page).not.toMatch(/<script(?! type="application\/json")/);
    });

    test("a source that closes a script element cannot end it early", () => {
        const source = `<p>Write </script> here.</p>`;
        const page = writePage({
            html: "",
            meta: { format: PAGE_FORMAT, seed: 0, state: null, viewer: null },
            source,
            assets,
        });
        expect(page.match(/<\/script>/g)?.length).toBe(
            // The wasm script, the entry, the meta and the source.
            4,
        );
        expect(readScript(page, "doenet-source")).toBe(source);
        expect(scriptJson("</script>")).not.toContain("<");
    });
});
