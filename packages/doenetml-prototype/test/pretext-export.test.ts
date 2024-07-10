import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast, toXml } from "@doenet/parser";
import { normalizeDocumentDast } from "../src/state/redux-slices/dast/utils/normalize-dast";
import { ensurePretextTag } from "../src/utils/pretext/ensure-pretext-tag";
import { FlatDastRoot } from "@doenet/doenetml-worker-rust";
import { renderToPretext } from "../src/utils/pretext/render-to-pretext";
import { RunThroughCore } from "./utils/run-through-core";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

// <p>
//   Hi
// </p>
const SIMPLE_FLAT_DAST = {
    type: "root",
    children: [
        {
            id: 0,
            annotation: "original",
        },
    ],
    elements: [
        {
            type: "element",
            name: "document",
            attributes: {},
            children: [
                {
                    id: 1,
                    annotation: "original",
                },
            ],
            data: {
                id: 0,
                action_names: [],
                props: {},
            },
        },
        {
            type: "element",
            name: "p",
            attributes: {},
            children: ["\n  Hi\n"],
            data: {
                id: 1,
                action_names: [],
            },
        },
    ],
    warnings: [],
} as FlatDastRoot;

const coreRunner = new RunThroughCore();

describe("Pretext export", async () => {
    it("Can process doenet code run through core", async () => {
        await coreRunner.processToFatDast(`<p>hello world</p>`);
    });
    it("Wraps root in <pretext> tag", () => {
        const flatDast = structuredClone(SIMPLE_FLAT_DAST);
        expect(renderToPretext(flatDast)).toMatchInlineSnapshot(`
          "<pretext><article><p>
            Hi
          </p></article></pretext>"
        `);
    });
    it("passes through attributes", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <p myAttr="hi">How about</p>
        `);

        const pretext = renderToPretext(flatDast);
        expect(pretext).toMatchInlineSnapshot(
            `"<pretext><article><p>How about</p></article></pretext>"`,
        );
    });
    it("expands <text> to pretext element", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <textInput name="mi" prefill="foo" />
            <p>How about $mi?</p>
        `);

        const pretext = renderToPretext(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<pretext><article><em>foo</em>
                      <p>How about foo?</p></article></pretext>"
        `);
    });
    it("expands <division> to pretext element", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <division>
                <title>Foo</title>
                <p>How about foo?</p>
            </division>
        `);

        const pretext = renderToPretext(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<pretext><article><section><title>Foo</title>
                          
                          <p>How about foo?</p>
                      </section></article></pretext>"
        `);
    });
});
