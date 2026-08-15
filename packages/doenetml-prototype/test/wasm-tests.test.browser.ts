import { describe, it, expect, afterEach } from "vitest";
//import { CoreWorker } from "../src";
import type { CoreWorker, FlatDastRoot } from "@doenet/doenetml-worker";
import * as Comlink from "comlink";

import {
    lezerToDast,
    filterPositionInfo,
    normalizeDocumentDast,
} from "@doenet/parser";
import { doenetGlobalConfig } from "../src/global-config";

/**
 * Every worker this file has booted and not yet terminated.
 *
 * The whole file runs in one browser page, and each test below boots its own
 * core worker — thirty-odd of them. A worker is not collected when the last
 * reference to it goes away; it has to be terminated, and each one holds a copy
 * of the worker bundle and its WASM instances. Left alone they accumulate for
 * the length of the run, which is enough to push the browser into swapping (the
 * same shape of leak that `@doenet/doenetml-to-pretext` fixed with
 * `DoenetMLToPretext.dispose()`).
 */
const liveWorkers: Worker[] = [];

afterEach(() => {
    // Terminate rather than `Comlink.releaseProxy()`: that is an RPC round trip,
    // and a worker that has wedged never answers it.
    while (liveWorkers.length > 0) {
        liveWorkers.pop()!.terminate();
    }
});

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 *
 * The worker is registered for termination after the current test; nothing here
 * needs to outlive one.
 */
export function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
    liveWorkers.push(worker);
    return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
}

/**
 * Convert a string to normalized DAST
 */
export function toDast(source: string) {
    return normalizeDocumentDast(lezerToDast(source));
}

/**
 * Filter out position information from FlatDast
 */
function flatDastFilterPositionInfo(flatDast: FlatDastRoot): FlatDastRoot {
    return filterPositionInfo(flatDast as any) as any as FlatDastRoot;
}

/**
 * Create a worker initialized with empty flags and the source `source`.
 */
async function workerWithSource(source: string) {
    const worker = createWrappedCoreWorker();
    await worker.setFlags({ flags: {} });
    await worker.setSource({
        source,
        dast: toDast(source),
    });
    return worker;
}

describe("wasm tests", () => {
    it("can load core in a webworker", async () => {
        const worker = await workerWithSource("<p>test</p>");

        // If we can process the DAST, the worker correctly loaded and we communicated with it.
        const flatDast = flatDastFilterPositionInfo(await worker.returnDast());
    });

    it("can retrieve tests from a worker", async () => {
        const worker = await workerWithSource("<p>test</p>");
        expect(await worker._getTests()).toBeInstanceOf(Array);
    });

    describe("run_wasm_tests", async () => {
        const worker = await workerWithSource("<p>test</p>");
        const allTests = await worker._getTests();
        if (!allTests) {
            throw new Error("No tests found in wasm");
        }

        for (const testName of allTests) {
            it(testName, async () => {
                const worker = await workerWithSource("<p>test</p>");
                try {
                    await worker._runTest(testName);
                } catch (e: any) {
                    throw new Error(
                        `Test ${testName} failed with message: ${e.message}\nRerun with \`headless: false\` in vitest.workspace.ts and check the browser's console for more information.`,
                    );
                }
            });
        }
    });

    it("can set the source of a worker multiple times", async () => {
        let source: string;
        const worker = createWrappedCoreWorker();
        await worker.setFlags({ flags: {} });

        source = "<p>test</p>";
        await worker.setSource({
            source,
            dast: toDast(source),
        });
        await worker.returnDast();

        source = "<section><p>test2</p></section><invalidElement />";
        await worker.setSource({
            source,
            dast: toDast(source),
        });
        await worker.returnDast();
    });
});
