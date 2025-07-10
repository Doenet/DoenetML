import { describe, expect, it, afterAll } from "vitest";
import util from "util";
import { toXml as xastToXml } from "xast-util-to-xml";
import { FlatDastRoot } from "@doenet/doenetml-worker";
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

function renderToPretextString(flatDast: FlatDastRoot) {
    return xastToXml(renderToPretext(flatDast), { closeEmptyElements: true });
}

afterAll(async () => {
    await coreRunner.close();
});

describe("Pretext export", async () => {
    it("Can process doenet code run through core", async () => {
        await coreRunner.processToFatDast(`<p>hello world</p>`);
    });
    it("Wraps root in <pretext> tag", () => {
        const flatDast = structuredClone(SIMPLE_FLAT_DAST);
        expect(renderToPretextString(flatDast)).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <p>
            Hi
          </p>
          </article>
          </pretext>"
        `);
    });
    it("passes through attributes", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <p myAttr="hi">How about</p>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(
            `
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <p myAttr="hi">How about</p>
          </article>
          </pretext>"
        `,
        );
    });
    it("expands <text> to pretext element", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <textInput name="mi" prefill="foo" />
            <p>How about $mi?</p>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <em>foo</em>
                      <p>How about foo?</p>
          </article>
          </pretext>"
        `);
    });
    it("expands <division> to pretext element", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <division>
                <title>Foo</title>
                <p>How about foo?</p>
            </division>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <section xml:id="doenet-id-1">
              <title>Foo</title>
                          
                          <p>How about foo?</p>
                      </section>
          </article>
          </pretext>"
        `);
    });
    it("passes through unknown elements", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <myCustomTag withAttr="foo">Hi</myCustomTag>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <myCustomTag withAttr="foo">Hi</myCustomTag>
          </article>
          </pretext>"
        `);
    });
    it("passes through attributes that conflict with special React prop names", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <myCustomTag ref="foo"><p ref="hi" />Hi</myCustomTag>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <myCustomTag ref="foo"><p ref="hi" />Hi</myCustomTag>
          </article>
          </pretext>"
        `);
    });
    it("preserved existing <book> or <article> or <pretext> tags", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <book>Hi</book>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <book>
          Hi
          </book>
          </pretext>"
        `);
    });
    it("preserved existing <book> or <article> or <pretext> tags 2", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <pretext>   <book>Hi</book> Z </pretext>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
             <book>
          Hi
          </book> Z 
          </pretext>"
        `);
    });
    it("<docinfo> is not included in the auto-inserted division", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <docinfo>Hi</docinfo> <section>Foo</section>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <docinfo>Hi</docinfo><article>
           <section xml:id="doenet-id-2">Foo</section>
          </article>
          </pretext>"
        `);
    });
    it("name attribute is removed but pretext:name is not", async () => {
        const flatDast = await coreRunner.processToFatDast(`
            <pretext><article><p name="foo">hi</p><p pretext:name="foo">there</p></article></pretext>
        `);

        const pretext = renderToPretextString(flatDast);
        expect(pretext).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <p>hi</p><p name="foo">there</p>
          </article>
          </pretext>"
        `);
    });
});
