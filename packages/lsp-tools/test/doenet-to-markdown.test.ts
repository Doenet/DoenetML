import { describe, expect, it } from "vitest";
import util from "util";

import { DoenetSourceObject } from "../src/doenet-source-object";
import { convertDoenetToMarkdown, textContent } from "../src";
import { trimLeadingWhitespace } from "../src/doenet-to-markdown/trim";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("doenet-to-markdown", () => {
    it("Can trim leading whitespace", () => {
        expect(trimLeadingWhitespace("  abc\n  def\n")).toEqual("abc\ndef\n");
        expect(
            trimLeadingWhitespace("  abc\n\tdef\n", { tabWidth: 2 }),
        ).toEqual("abc\ndef\n");
        expect(
            trimLeadingWhitespace("  abc\n\tdef\n", { tabWidth: 4 }),
        ).toEqual("abc\n  def\n");
    });
    it("Can extract text content", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<p>ab<m>c</m></p><!-- comment -->`;
        sourceObj = new DoenetSourceObject(source);
        expect(textContent(sourceObj.dast as any)).toEqual("abc");
    });
    it("Can do basic converting", () => {
        let source: string;

        source = `abc`;
        expect(convertDoenetToMarkdown(source)).toEqual("abc\n");
    });
    it("Can convert section into markdown heading", () => {
        let source: string;

        source = `<section><title>My Title</title>Some text</section>`;
        expect(convertDoenetToMarkdown(source)).toEqual(
            "# My Title\n\nSome text\n",
        );
    });
    it("Can convert section and title", () => {
        let source: string;

        source = `<section>
        <title><tag>angle</tag></title>
      
      <sideBySide>
        
      <section><title>What it does</title>
      <tag>angle</tag> renders a geometric angle when nested inside a <ref uri=""><tag>graph</tag></ref> component.</section>
      
      <div>
      </div>
      </sideBySide>
      </section>
      
      `;
        expect(convertDoenetToMarkdown(source)).toEqual(
            `# \`<angle>\`

## What it does

\`<angle>\` renders a geometric angle when nested inside a \`<graph>\` component.
`,
        );
    });
});
