import { describe, it, expect } from "vitest";
//import { CoreWorker } from "../src";
import type { CoreWorker, FlatDastRoot } from "@doenet/doenetml-worker-rust";
import * as Comlink from "comlink";

import {
    lezerToDast,
    filterPositionInfo,
} from "@doenet/parser";
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

describe("wasm tests", () => {
    it("can load core in a webworker", async () => {
        const worker = createWrappedCoreWorker();
        const source = "<p>test</p>";

        await worker.setFlags({ flags: {} });
        await worker.setSource({
            source: source,
            dast: toDast(source),
        });
        // If we can process the DAST, the worker correctly loaded and we communicated with it.
        const flatDast = flatDastFilterPositionInfo(await worker.returnDast());
    });
});
