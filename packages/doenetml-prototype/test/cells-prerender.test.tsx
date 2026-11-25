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

/** Every component type the core has, in text and in a graph. */
const VOCABULARY = resolve(__dirname, "cells-vocabulary.doenet");

/** The cells core's golden documents, the benchmark's real documents, the
 * SIR model and the cells viewer's dev page: the documents the cells
 * viewer's prerender test renders; and the vocabulary. */
const documents = [
    ...doenetFiles(resolve(packages, "cells-core/crates/cells-bench/golden")),
    ...doenetFiles(resolve(packages, "benchmark/fixtures")),
    resolve(packages, "cells-core/fixtures/sir.doenet"),
    resolve(packages, "cells-viewer/dev/testCode.doenet"),
    VOCABULARY,
].map((path) => [basename(path, ".doenet"), path] as const);

/** Component types no document places as a component of its own: an
 * element the core could not load, a point's constraints and a curve's
 * Bézier controls, which the core folds into what owns them. */
const NOT_PLACED = new Set([
    "_error",
    "constrainTo",
    "constrainToGrid",
    "attractTo",
    "bezierControls",
    "controlVectors",
]);

/** The elements no prototype renderer draws, by name and constraint, from
 * the warning the renderer gives for each. */
const unrendered = new Set<string>();

async function loadDocument(path: string) {
    const source = readFileSync(path, "utf8");
    return loadCellsDocument(normalizeDocumentDast(lezerToDast(source)));
}

async function renderDocument(path: string) {
    const bridge = await loadDocument(path);
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
        // React may hoist a resource hint (an image's preload) before it.
        expect(html).toMatch(
            /^(<link [^>]*>)*<article class="doenet-document">/,
        );
    });

    test("a graph is its board's container, with its legend", async () => {
        const html = await renderDocument(
            resolve(packages, "cells-core/fixtures/sir.doenet"),
        );
        expect(html).toMatch(
            /<div class="jsxgraph-container" id="jsxgraph-board-\d+">/,
        );
        expect(html).toContain('class="graph-legend"');
    });

    test("the vocabulary uses every component type of the core", async () => {
        const { table } = await loadDocument(VOCABULARY);
        const used = new Set<string>();
        for (let c = 0; c < table.length; c++) {
            used.add(table.componentType(c));
        }
        const unused = table.typeTags.filter(
            (type) => !used.has(type) && !NOT_PLACED.has(type),
        );
        expect(unused).toEqual([]);
    });

    test("the vocabulary loads without an error", async () => {
        const html = await renderDocument(VOCABULARY);
        expect(html).not.toContain("dast-error");
    });

    // Last: every document above has been rendered.
    test("every element the bridge sends has a renderer", () => {
        expect([...unrendered].sort()).toEqual([]);
    });
});
