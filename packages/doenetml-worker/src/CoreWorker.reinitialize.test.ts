import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import fs from "node:fs";
import path from "node:path";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { CoreWorker, DOCUMENT_BUILD_ERROR_NAME } from "./CoreWorker";

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

/** Set `source` on `worker` and initialize its JavaScript core from it. */
async function initialize(worker: CoreWorker, source: string) {
    await worker.setSource(sourceArgs(source));
    await worker.setFlags({ flags: FLAGS });
    return worker.initializeJavascriptCore(INIT_ARGS);
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

    beforeEach(() => {
        // The worker logs each failure before rethrowing it; keep the output
        // to the assertions.
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("fails the second of two interleaved initializations, and only that one", async () => {
        // The calls two `initializeCoreWorker` sequences made when they
        // overlapped on one worker, in the order the worker's queue ran
        // them. Issued without awaiting, so the queue orders them exactly
        // so.
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

    it("refuses to initialize again from a released DAST until a fresh setSource has put it back", async () => {
        // What the serialized second sequence relies on: run whole after its
        // predecessor, its own `setSource` restores every precondition.
        const worker = new CoreWorker();
        worker.setCoreType("javascript");
        await initialize(worker, "<p>first</p>");
        await expect(
            worker.initializeJavascriptCore(INIT_ARGS),
        ).rejects.toThrow(RELEASED);

        const result = await initialize(worker, "<p>second</p>");
        expect(result.allPossibleVariants.length).toBeGreaterThan(0);
    });

    it(
        "releases its queue after a failed precondition",
        { timeout: 10_000 },
        async () => {
            // A precondition thrown ahead of the `try` skipped the `finally`
            // that hands the queue on, and every later call on the worker
            // hung. A wedged queue holds the second call forever, and the
            // suite's timeout is three minutes; the test's own bound fails it
            // in seconds.
            const worker = new CoreWorker();
            worker.setCoreType("javascript");
            await expect(
                worker.initializeJavascriptCore(INIT_ARGS),
            ).rejects.toThrow(/before setting source and flags/);

            const result = await initialize(worker, "<p>later</p>");
            expect(result.allPossibleVariants.length).toBeGreaterThan(0);
        },
    );
});

// What the worker puts on an error so the viewer's boot ladder can tell a
// broken document from a sick worker (#1920).
//
// The two halves are joined by a string across a package boundary:
// `DOCUMENT_BUILD_ERROR_NAME` here and a literal of the same value in
// `coreWorkerBoot.ts`, which is deliberately not an import so the viewer's
// eagerly-loaded boot path does not pull in the worker bundle. Nothing made
// them agree: changing this one alone left all 57 tests here and all 26 there
// green while silently restoring the retry-a-doomed-document behavior. The
// literal below is the tie -- `coreWorkerBoot.test.ts` asserts the same one
// from the viewer's side, so changing either fails one of the two.
describe.skipIf(!wasmAvailable)("document-build failures (#1920)", () => {
    beforeAll(() => {
        const wasmBase64 = fs.readFileSync(wasmPath).toString("base64");
        vi.stubGlobal(
            "__doenetWorkerWasmUrl",
            `data:application/wasm;base64,${wasmBase64}`,
        );
    });

    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("pins the marker the viewer matches on", () => {
        expect(DOCUMENT_BUILD_ERROR_NAME).toBe("DoenetDocumentBuildError");
    });

    it("marks a failure to build the document, and reports what actually fired", async () => {
        // A document that traps the Rust expander: an index into a composite
        // written before the composite, so `$g[1]` resolves to a child that
        // has not been expanded yet (#1942, pinned on the Rust side by
        // `an_index_into_a_composite_of_refs_traps`). It fails the same way on
        // `main`; what is new is what the worker does with the failure.
        //
        // If #1942 is fixed this document will simply render and this test
        // will fail -- swap in whatever still traps, or delete it along with
        // the Rust test that pins the same shape.
        const worker = new CoreWorker();
        worker.setCoreType("javascript");

        const err = await initialize(
            worker,
            `$g[1]<group name="g">$x</group><p name="x">hello</p>`,
        ).then(
            () => {
                throw new Error("expected this document to fail to build");
            },
            (e) => e,
        );

        expect(err.name).toBe("DoenetDocumentBuildError");

        // A trap reaches JavaScript as `RuntimeError: unreachable`, which
        // tells the reader nothing. The recorded panic message replaces it.
        // This is why the read is a free function rather than a method on the
        // core: the trapping entry point takes `&mut self`, and the borrow its
        // glue took is never dropped, so a `&self` method called next throws
        // "recursive use of an object" instead of answering. As a method the
        // message below was `unreachable`.
        expect(err.message).toContain("Expected an element");
        expect(err.message).not.toBe("unreachable");
    });

    it("leaves a precondition failure unmarked, so it can still be retried", async () => {
        // Sharing the `try` with the build does not make these part of it. A
        // worker asked to initialize before it has a source, or twice from one
        // `setSource` (#1533, seen when two boot sequences interleaved on one
        // worker), is in a state a fresh worker would not be in -- so the boot
        // ladder must keep its retry rather than blame the document.
        const fresh = new CoreWorker();
        fresh.setCoreType("javascript");
        const noSource = await fresh.initializeJavascriptCore(INIT_ARGS).then(
            () => undefined,
            (e) => e,
        );
        expect(noSource.message).toMatch(/before setting source and flags/);
        expect(noSource.name).not.toBe("DoenetDocumentBuildError");

        const worker = new CoreWorker();
        worker.setCoreType("javascript");
        await initialize(worker, "<p>A</p>");
        const released = await worker.initializeJavascriptCore(INIT_ARGS).then(
            () => undefined,
            (e) => e,
        );
        expect(released.message).toMatch(RELEASED);
        expect(released.name).not.toBe("DoenetDocumentBuildError");
    });
});
