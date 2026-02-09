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

let coreRunner: RunThroughCore;

function renderToPretextString(flatDast: FlatDastRoot) {
    return xastToXml(renderFlatDastToPretext(flatDast), {
        closeEmptyElements: true,
    });
}

afterAll(async () => {
    await coreRunner.close();
});

beforeAll(async () => {
    // Infrequently, the browser download can fail due to transient network issues.
    // To mitigate this, we implement a retry mechanism with exponential backoff.

    const maxRetries = 3;
    const initialDelay = 1000; // 1 second
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            coreRunner = new RunThroughCore();
            await coreRunner.processToFlatDast(`<p>Hi</p>`);

            // Success - exit retry loop
            break;
        } catch (e) {
            lastError = e instanceof Error ? e : new Error(String(e));

            await coreRunner.close(); // Ensure any partially initialized browser is closed before retrying

            // If this is not the last attempt, wait before retrying
            if (attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.warn(
                    `Failed to download browser (attempt ${attempt + 1}/${maxRetries + 1}): ${lastError.message}. Retrying in ${delay}ms...`,
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                // Last attempt failed - throw the error
                throw lastError;
            }
        }
    }
}, 40000);

describe("Pretext export", async () => {
    let source: string;

    it("Can process doenet code run through core", async () => {
        source = `<p>hello world</p>`;
        const res = await coreRunner.processToFlatDast(source);
    });
    it("Wraps root in <pretext> tag", async () => {
        source = `<p>Hi</p>`;
        expect(await coreRunner.processToFlatDast(source))
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
        expect(await coreRunner.processToFlatDast(source))
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
    //     expect(await coreRunner.processToFlatDast(source))
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
    //     expect(await coreRunner.processToFlatDast(source))
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
        expect(await coreRunner.processToFlatDast(source))
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
        expect(await coreRunner.processToFlatDast(source))
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
    //     expect(await coreRunner.processToFlatDast(source)).toMatchInlineSnapshot(`
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
        expect(await coreRunner.processToFlatDast(source))
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
