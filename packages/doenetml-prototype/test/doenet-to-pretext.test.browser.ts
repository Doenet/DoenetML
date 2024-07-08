import { describe, it, expect } from "vitest";
//import { CoreWorker } from "../src";
import type { CoreWorker, FlatDastRoot } from "@doenet/doenetml-worker-rust";
import * as Comlink from "comlink";
import { toXml } from "xast-util-to-xml";

import { lezerToDast, filterPositionInfo } from "@doenet/parser";
import { normalizeDocumentDast } from "../src/state/redux-slices/dast/utils/normalize-dast";
import { doenetGlobalConfig } from "../src/global-config";

// @ts-ignore
import { doenetToPretext } from "../../lsp-tools/src/doenet-to-pretext";

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

//
// Converting doenet to PreTeXt requires a rendered FlatDast, which needs to be created by Core.
// So we test the functions here, in a browser.
//
describe("doenet-to-pretext", () => {
    it("passes through attributes", async () => {
        const worker = await workerWithSource(`
            <p myAttr="hi">How about</p>
        `);
        const flatDast = flatDastFilterPositionInfo(await worker.returnDast());

        const pretext = doenetToPretext(flatDast);
        expect(toXml(pretext)).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext><article>
          <p myAttr="hi">How about</p>
          </article></pretext>"
        `);
    });
    it("expands <text> to pretext element", async () => {
        const worker = await workerWithSource(`
            <textInput name="mi" prefill="foo" />
            <p>How about $mi?</p>
        `);
        const flatDast = flatDastFilterPositionInfo(await worker.returnDast());

        const pretext = doenetToPretext(flatDast);
        expect(toXml(pretext)).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext><article>
          <em>foo</em>
                      <p>How about foo?</p>
          </article></pretext>"
        `);
    });
});
