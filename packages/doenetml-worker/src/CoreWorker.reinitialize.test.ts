import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { CoreWorker } from "./CoreWorker";

vi.hoisted(() => {
    // `CoreWorker.ts` exposes a default instance over Comlink as it loads,
    // which in a worker is `self.addEventListener`; node has no such global.
    // Hoisted above the import, since that is when the module runs.
    const realm = globalThis as Record<string, unknown>;
    realm.addEventListener ??= () => {};
});

// Coverage for what a `CoreWorker` says when it is asked to initialize twice
// from one `setSource` (#1533).
//
// `initializeJavascriptCore` ends by releasing the document DAST the Rust
// core retained, so a second initialization with no `setSource` in between
// has nothing to initialize from. Two `initializeCoreWorker` sequences that
// interleaved on one worker produced exactly that, and the failure came out
// of the Rust core as "before source is set" — the opposite of what had
// happened. The worker now refuses the call itself, saying why, and a fresh
// `setSource` makes the worker whole again.
//
// Stands up a real `CoreWorker` in node, loading the resolver WASM from disk
// the way the `flatDastUpdateFromJS.coreIntegration` spec does.

// The JS core posts diagnostics; silence it so test output stays readable.
vi.stubGlobal("postMessage", vi.fn());
// The version the vite configs inject at build time.
vi.stubGlobal("__DOENET_STANDALONE_VERSION__", "0.0.0-test");

const wasmPath = path.resolve(
    import.meta.dirname,
    "../../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
);
const wasmAvailable = fs.existsSync(wasmPath);
if (!wasmAvailable) {
    console.warn(
        `Skipping CoreWorker re-initialization tests — WASM not found at ${wasmPath}. Build @doenet/doenetml-worker-rust to enable them.`,
    );
}

const FLAGS = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: true,
    allowSaveState: true,
    saveRendererState: false,
    allowLocalState: false,
    allowSaveEvents: true,
    messageParent: false,
    autoSubmit: false,
};

const INIT_ARGS = {
    activityId: "activity",
    docId: "doc",
    requestedVariantIndex: 1,
    attemptNumber: 1,
};

const RELEASED = /released when the previous initialization completed/;

function sourceArgs(source: string) {
    return { source, dast: normalizeDocumentDast(lezerToDast(source), true) };
}

/**
 * Reject if `promise` has not settled within `ms`. The worker's serialization
 * queue, once wedged, holds every later call forever; a wait bounded here
 * fails the test in seconds instead of at the suite's timeout.
 */
function within<T>(ms: number, promise: Promise<T>): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(
                () => reject(new Error(`did not settle within ${ms}ms`)),
                ms,
            ),
        ),
    ]);
}

describe.skipIf(!wasmAvailable)("CoreWorker re-initialization (#1533)", () => {
    beforeAll(() => {
        // The worker locates its WASM through a global the code that starts
        // it is expected to set; hand it the bytes from disk as the inlined
        // `data:` URL the single-file bundle uses.
        const wasmBase64 = fs.readFileSync(wasmPath).toString("base64");
        vi.stubGlobal(
            "__doenetWorkerWasmUrl",
            `data:application/wasm;base64,${wasmBase64}`,
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("refuses to initialize again from a released DAST, and says so", async () => {
        // The worker logs the failure before rethrowing it; keep the output
        // to the assertion.
        vi.spyOn(console, "error").mockImplementation(() => {});
        const worker = new CoreWorker();
        worker.setCoreType("javascript");
        await worker.setSource(sourceArgs("<p>hello</p>"));
        await worker.setFlags({ flags: FLAGS });
        await worker.initializeJavascriptCore(INIT_ARGS);

        await expect(
            worker.initializeJavascriptCore(INIT_ARGS),
        ).rejects.toThrow(RELEASED);
    });

    it("fails the second of two interleaved initializations, and only that one", async () => {
        // The calls two `initializeCoreWorker` sequences made when they
        // overlapped on one worker, in the order the worker's queue ran
        // them. Issued without awaiting, so the queue orders them exactly
        // so.
        vi.spyOn(console, "error").mockImplementation(() => {});
        const worker = new CoreWorker();
        worker.setCoreType("javascript");
        const a = sourceArgs("<p>A</p>");
        const b = sourceArgs("<p>B</p>");
        const calls = [
            worker.setSource(a),
            worker.setSource(b),
            worker.setFlags({ flags: FLAGS }),
            worker.setFlags({ flags: FLAGS }),
            worker.initializeJavascriptCore(INIT_ARGS),
        ];
        const secondInitialization = worker.initializeJavascriptCore(INIT_ARGS);

        await Promise.all(calls);
        await expect(secondInitialization).rejects.toThrow(RELEASED);
    });

    it("initializes again once a fresh setSource has put the DAST back", async () => {
        // What the serialized second sequence relies on: run whole after its
        // predecessor, its own `setSource` restores every precondition.
        vi.spyOn(console, "error").mockImplementation(() => {});
        const worker = new CoreWorker();
        worker.setCoreType("javascript");
        await worker.setSource(sourceArgs("<p>first</p>"));
        await worker.setFlags({ flags: FLAGS });
        await worker.initializeJavascriptCore(INIT_ARGS);
        await expect(
            worker.initializeJavascriptCore(INIT_ARGS),
        ).rejects.toThrow(RELEASED);

        await worker.setSource(sourceArgs("<p>second</p>"));
        await worker.setFlags({ flags: FLAGS });
        const result = await worker.initializeJavascriptCore(INIT_ARGS);
        expect(result.allPossibleVariants.length).toBeGreaterThan(0);
    });

    it("releases its queue after a failed precondition", async () => {
        // A precondition thrown ahead of the `try` skipped the `finally` that
        // hands the queue on, and every later call on the worker hung.
        vi.spyOn(console, "error").mockImplementation(() => {});
        const worker = new CoreWorker();
        worker.setCoreType("javascript");
        await expect(
            worker.initializeJavascriptCore(INIT_ARGS),
        ).rejects.toThrow(/before setting source and flags/);

        await within(10_000, worker.setSource(sourceArgs("<p>later</p>")));
        await worker.setFlags({ flags: FLAGS });
        const result = await worker.initializeJavascriptCore(INIT_ARGS);
        expect(result.allPossibleVariants.length).toBeGreaterThan(0);
    });
});
