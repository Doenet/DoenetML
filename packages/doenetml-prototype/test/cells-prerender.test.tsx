// @vitest-environment jsdom
/**
 * Every document the cells core renders through the prototype's renderers
 * renders on a server: loaded in Node through the cells bridge (ADR 0020 in
 * `packages/cells-core`), its flat DAST put in the viewer's store, and the
 * viewer rendered with `renderToString`. What a prerendered page shows before
 * its scripts arrive. The cells viewer's own version of this test is
 * `packages/cells-viewer/src/prerender/render-to-html.test.tsx`.
 *
 * In jsdom only so that JSXGraph, which the graph renderers import, can
 * load; `renderToString` runs no effect, so no board is made.
 */
// The prototype's entry first: its modules import one another in a cycle
// that only resolves in the order the entry sets.
import "../src/index";
import React from "react";
import { readFileSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { store } from "../src/state/store";
import { _dastReducerActions } from "../src/state/redux-slices/dast";
import { Element } from "../src/renderers";
// The bridge is not exported from the worker's build; it is read from its
// source, as the worker's own tests do.
import {
    initCellsCore,
    loadCellsDocument,
} from "../../doenetml-worker/src/cells/loadCellsCore";

const packages = resolve(__dirname, "../..");

function doenetFiles(dir: string) {
    return readdirSync(dir)
        .filter((f) => f.endsWith(".doenet"))
        .map((f) => resolve(dir, f));
}

/** The cells core's golden documents, the benchmark's real documents, the
 * SIR model and the cells viewer's dev page: the documents the cells
 * viewer's prerender test renders. */
const documents = [
    ...doenetFiles(resolve(packages, "cells-core/crates/cells-bench/golden")),
    ...doenetFiles(resolve(packages, "benchmark/fixtures")),
    resolve(packages, "cells-core/fixtures/sir.doenet"),
    resolve(packages, "cells-viewer/dev/testCode.doenet"),
].map((path) => [basename(path, ".doenet"), path] as const);

/** The elements no prototype renderer draws, by name and constraint, from
 * the warning the renderer gives for each. */
const unrendered = new Set<string>();

async function renderDocument(path: string) {
    const source = readFileSync(path, "utf8");
    const bridge = await loadCellsDocument(
        normalizeDocumentDast(lezerToDast(source)),
    );
    const root = bridge.flatDast();
    store.dispatch(_dastReducerActions._setFlatDastRoot(root as any));
    const rootId = (root.children[0] as { id: number }).id;
    return renderToString(
        <Provider store={store}>
            <Element id={rootId} ancestors="" annotation="original" />
        </Provider>,
    );
}

beforeAll(async () => {
    vi.spyOn(console, "warn").mockImplementation((message: unknown) => {
        const m = String(message).match(
            /^No component for element <(.+?)>(?: satisfying constraint "(\w+)")?/,
        );
        if (m) unrendered.add(m[2] ? `${m[1]} in ${m[2]}` : m[1]);
    });
    await initCellsCore(
        readFileSync(resolve(packages, "cells-core/pkg/cells_wasm_bg.wasm")),
    );
});

afterAll(() => vi.restoreAllMocks());

describe("the cells core rendered to HTML by the prototype's renderers", () => {
    test.each(documents)("%s", async (_, path) => {
        const html = await renderDocument(path);
        expect(html).toMatch(/^<article class="doenet-document">/);
    });

    test("a graph is its board's container", async () => {
        const html = await renderDocument(
            resolve(packages, "cells-core/fixtures/sir.doenet"),
        );
        expect(html).toMatch(
            /<div class="jsxgraph-container" id="jsxgraph-board-\d+">/,
        );
    });

    // Last: every document above has been rendered. What no renderer
    // draws is what the cells viewer does not draw either (a function's
    // curve, and a number or math placed in a graph), and what the
    // prototype has no renderer for yet (ADR 0020, Reverted).
    test("every element the bridge sends has a renderer, but these", () => {
        expect([...unrendered].sort()).toEqual([
            "circle in graph",
            "derivative in graph",
            "function in graph",
            "hint in text",
            "lineSegment in graph",
            "math in graph",
            "mathInput in text",
            "number in graph",
            "numberInput in text",
            "polygon in graph",
            "polyline in graph",
            "ref in text",
            "sideBySide in text",
            "slider in text",
        ]);
    });
});
