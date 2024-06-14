import { describe, it, expect } from "vitest";
//import { CoreWorker } from "../src";
import type { CoreWorker, FlatDastRoot } from "@doenet/doenetml-worker-rust";
import * as Comlink from "comlink";

import { lezerToDast, filterPositionInfo } from "@doenet/parser";
import { normalizeDocumentDast } from "../src/state/redux-slices/dast/utils/normalize-dast";
import { doenetGlobalConfig } from "../src/global-config";

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
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
});
