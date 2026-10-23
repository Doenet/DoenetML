// Every renderer renders on a server: each document below, parsed and
// loaded in Node as the browser does it, rendered with `renderToString`.
// What a prerendered page will show before its scripts arrive.
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { beforeAll, describe, expect, test } from "vitest";
import { CellsViewer } from "../CellsViewer";
import { initCore, loadDocument } from "../core";
import { parseDoenetML } from "../parse";

const packages = fileURLToPath(new URL("../../..", import.meta.url));

function doenetFiles(dir: string) {
    return readdirSync(dir)
        .filter((f) => f.endsWith(".doenet"))
        .map((f) => resolve(dir, f));
}

/** The documents: the core's golden documents (a few of every kind of
 * component it has), the benchmark's real documents, the core's SIR
 * model, and this package's dev page. */
const documents = [
    ...doenetFiles(resolve(packages, "cells-core/crates/cells-bench/golden")),
    ...doenetFiles(resolve(packages, "benchmark/fixtures")),
    resolve(packages, "cells-core/fixtures/sir.doenet"),
    resolve(packages, "cells-viewer/dev/testCode.doenet"),
].map((path) => [basename(path, ".doenet"), path] as const);

async function renderDocument(path: string) {
    const bytes = await parseDoenetML(readFileSync(path, "utf8"));
    const store = await loadDocument(bytes, "dirty-closure", {});
    return renderToString(<CellsViewer store={store} />);
}

beforeAll(async () => {
    const wasm = createRequire(import.meta.url).resolve(
        "@doenet/cells-core/pkg/cells_wasm_bg.wasm",
    );
    await initCore(readFileSync(wasm));
});

describe("rendering to HTML", () => {
    test.each(documents)("%s", async (_, path) => {
        const html = await renderDocument(path);
        expect(html).toMatch(/^<div class="doc">/);
        expect(html).not.toContain("viewer-error");
    });

    test("a graph is its board's container, sized and empty", async () => {
        const html = await renderDocument(
            resolve(packages, "benchmark/fixtures/homework.doenet"),
        );
        const board = html.match(/<div id="cells-board-\d+"[^>]*>/)?.[0];
        expect(board).toBeDefined();
        expect(board).toContain('class="jxgbox"');
        expect(board).toMatch(/width:425px;aspect-ratio:1/);
        expect(html).toContain(`${board}</div>`);
    });
});
