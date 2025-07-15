import { describe, expect, it, afterAll, beforeAll } from "vitest";
import util from "util";
import { toXml as xastToXml } from "xast-util-to-xml";
import { FlatDastRoot } from "@doenet/doenetml-worker";
import { renderFlatDastToPretext } from "../src/utils/pretext/render-to-pretext";
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
    return xastToXml(renderFlatDastToPretext(flatDast), {
        closeEmptyElements: true,
    });
}

afterAll(async () => {
    await coreRunner.close();
});

beforeAll(async () => {
    await coreRunner.processToFatDast(`<p>Hi</p>`);
}, 20000);

describe("Pretext export", async () => {
    let source: string;

    it("Can process doenet code run through core", async () => {
        source = `<p>hello world</p>`;
        const res = await coreRunner.processToFatDast(source);
    });
    it("Wraps root in <pretext> tag", async () => {
        source = `<p>Hi</p>`;
        expect(await coreRunner.processToFatDast(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <p>Hi</p>
          </article>
          </pretext>"
        `);
    });

    // TODO: un-skip when <division> tags are supported
    it.skip("expands <division> to pretext element", async () => {
        source = `
           <division>
               <title>Foo</title>
               <p>How about foo?</p>
           </division>
       `;
        expect(await coreRunner.processToFatDast(source))
            .toMatchInlineSnapshot(`
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

    // Unknown tags are not supported right now
    // it("passes through unknown elements", async () => {
    //     source = `
    //        <myCustomTag withAttr="foo">Hi</myCustomTag>
    //    `;
    //     expect(await coreRunner.processToFatDast(source))
    //         .toMatchInlineSnapshot(`
    //       "<?xml version="1.0" encoding="UTF-8"?>
    //       <pretext>
    //       <article>
    //       <myCustomTag withAttr="foo">Hi</myCustomTag>
    //       </article>
    //       </pretext>"
    //     `);
    // });

    // Unknown tags are not supported right now
    // it("passes through attributes that conflict with special React prop names", async () => {
    //     source = `
    //        <myCustomTag ref="foo"><p ref="hi" />Hi</myCustomTag>
    //    `;
    //     expect(await coreRunner.processToFatDast(source))
    //         .toMatchInlineSnapshot(`
    //       "<?xml version="1.0" encoding="UTF-8"?>
    //       <pretext>
    //       <article>
    //       <myCustomTag ref="foo"><p ref="hi" />Hi</myCustomTag>
    //       </article>
    //       </pretext>"
    //     `);
    // });

    // TODO: un-skip when <pretext> and <book> tags are supported
    it.skip("preserved existing <book> or <article> or <pretext> tags", async () => {
        source = `
           <book>Hi</book>
       `;
        expect(await coreRunner.processToFatDast(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <book>
          Hi
          </book>
          </pretext>"
        `);
    });

    // TODO: un-skip when <pretext> and <book> tags are supported
    it.skip("preserved existing <book> or <article> or <pretext> tags 2", async () => {
        source = `
           <pretext>   <book>Hi</book> Z </pretext>
       `;
        expect(await coreRunner.processToFatDast(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
             <book>
          Hi
          </book> Z 
          </pretext>"
        `);
    });

    // it("<docinfo> is not included in the auto-inserted division", async () => {
    //     source = `
    //        <docinfo>Hi</docinfo> <section>Foo</section>
    //    `;
    //     expect(await coreRunner.processToFatDast(source)).toMatchInlineSnapshot(`
    //       "<?xml version="1.0" encoding="UTF-8"?>
    //       <pretext>
    //       <docinfo>Hi</docinfo><article>
    //        <section xml:id="doenet-id-2">Foo</section>
    //       </article>
    //       </pretext>"
    //     `);
    // });

    // TODO: un-skip when <pretext> and <article> tags are supported
    it.skip("name attribute is removed but pretext:name is not", async () => {
        source = `
           <pretext><article><p name="foo">hi</p><p pretext:name="foo">there</p></article></pretext>
       `;
        expect(await coreRunner.processToFatDast(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <p>hi</p><p name="foo">there</p>
          </article>
          </pretext>"
        `);
    });
});
