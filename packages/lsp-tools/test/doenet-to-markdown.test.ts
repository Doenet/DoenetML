import { describe, expect, it } from "vitest";
import util from "util";

import { DoenetSourceObject } from "../src/doenet-source-object";
import { doenetToMarkdown, textContent } from "../src";
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
        expect(doenetToMarkdown(source)).toEqual("abc\n");
    });
    it("Can convert section into markdown heading", () => {
        let source: string;

        source = `<section><title>My Title</title>Some text</section>`;
        expect(doenetToMarkdown(source)).toEqual("# My Title\n\nSome text\n");
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
        expect(doenetToMarkdown(source)).toEqual(
            `# \`<angle>\`

## What it does

\`<angle>\` renders a geometric angle when nested inside a \`<graph>\` component.
`,
        );
    });
    it("Can convert lists", () => {
        let source: string;

        source = `<ol><li>Item 1</li><li>Item 2</li></ol>`;
        expect(doenetToMarkdown(source)).toEqual(
            `1. Item 1

2. Item 2
`,
        );
        source = `<ul><li>Item 1</li><li>Item 2</li></ul>`;
        expect(doenetToMarkdown(source)).toEqual(
            `* Item 1

* Item 2
`,
        );
    });
    it("Can format function macros", () => {
        let source: string;

        source = `$$f(x)`;
        expect(doenetToMarkdown(source)).toEqual(
            `\`$$f(x)\`
`,
        );
    });
    it("Doesn't include excess newlines in front of lists", () => {
        let source: string;

        source = `
        <p>Hello</p>
        <ol><li>a</li><li>b</li></ol>`;
        expect(doenetToMarkdown(source)).toEqual(
            `Hello

1. a

2. b
`,
        );
    });
});
