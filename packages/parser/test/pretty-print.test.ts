import { glob } from "glob";
import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import { prettyPrint } from "../src/pretty-printer";
import util from "util";
import { normalizeWhitespace } from "../src/pretty-printer/normalize/plugin-merge-whitespace";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("Prettier", async () => {
    it("Can normalize whitespace", () => {
        expect(normalizeWhitespace("a\nb")).toEqual("a b");
        expect(normalizeWhitespace("a \n\tb")).toEqual("a b");
        expect(normalizeWhitespace("\n  ")).toEqual(" ");
        expect(normalizeWhitespace("  \n  ")).toEqual(" ");
        expect(normalizeWhitespace("a\n\nb")).toEqual("a\n\nb");
        expect(normalizeWhitespace("a \n    \nb")).toEqual("a\n\nb");
        expect(normalizeWhitespace("a\n    \n   b")).toEqual("a\n\nb");
        expect(normalizeWhitespace("a\t\n    \n   b")).toEqual("a\n\nb");
        expect(normalizeWhitespace("a\t\n   \n\n \n   b")).toEqual("a\n\nb");
        expect(normalizeWhitespace("a  b")).toEqual("a b");
    });
    it("Space is trimmed from paragraphs", async () => {
        const cases = [
            { inStr: "<p> a </p>", outStr: "<p>a</p>" },
            { inStr: "<p>a</p>", outStr: "<p>a</p>" },
            { inStr: "<p>a\n</p>", outStr: "<p>a</p>" },
            { inStr: "<p>a\n \n</p>", outStr: "<p>a</p>" },
        ];
        for (const { inStr, outStr } of cases) {
            const prettyPrinted = await prettyPrint(inStr, {
                doenetSyntax: false,
                printWidth: 30,
            });
            expect(prettyPrinted).toEqual(outStr);
        }
    });
    it("Paragraphs show up on their own line", async () => {
        const cases = [
            { inStr: "<p>a</p><p>b</p>", outStr: "<p>a</p>\n<p>b</p>" },
        ];
        for (const { inStr, outStr } of cases) {
            const prettyPrinted = await prettyPrint(inStr, {
                doenetSyntax: false,
                printWidth: 30,
            });
            expect(prettyPrinted).toEqual(outStr);
        }
    });
    it("Double newlines are preserved but single newlines are turned into a space", async () => {
        const cases = [
            { inStr: "a\nb", outStr: "a b" },
            { inStr: "a\n  b", outStr: "a b" },
            { inStr: "a  \n  b", outStr: "a b" },
            { inStr: "a \n \n  b", outStr: "a\n\nb" },
        ];
        for (const { inStr, outStr } of cases) {
            const prettyPrinted = await prettyPrint(inStr, {
                doenetSyntax: false,
                printWidth: 30,
            });
            expect(prettyPrinted).toEqual(outStr);
        }
    });
    it("Prints function arguments", async () => {
        const cases = [
            { inStr: "$$f(x)", outStr: "$$f(x)" },
            { inStr: "$$f(x,y)", outStr: "$$f(x, y)" },
            { inStr: "$$f(x,$$g(y,z))", outStr: "$$f(x, $$g(y, z))" },
            { inStr: "$$f(x,<math>alpha</math>)", outStr: "$$f(x, <math>alpha</math>)" },
            { inStr: "$$f(x,   <math>alpha</math>)", outStr: "$$f(x, <math>alpha</math>)" },
            { inStr: "<p>$$f(x, <math>alpha</math>)</p>", outStr: "<p>\n    $$f(x, <math>alpha</math>)\n</p>" },
        ];
        for (const { inStr, outStr } of cases) {
            const prettyPrinted = await prettyPrint(inStr, {
                doenetSyntax: false,
                printWidth: 30,
            });
            expect(prettyPrinted).toEqual(outStr);
        }
    });
    {
        // Regular parsing tests
        const files = glob
            .sync(
                new URL("./fragments/*pretty*.doenet", import.meta.url)
                    .pathname,
            )
            .filter((f) => !f.includes("-bad"));
        const fileMap: Record<string, string> = Object.fromEntries(
            files.map((f) => [f.split("/").pop(), f]),
        );

        for (const [filename, filepath] of Object.entries(fileMap)) {
            it(`${filename} pretty-prints correctly in Xml format and Doenet format`, async () => {
                const source = await fs.readFile(filepath, "utf-8");
                const prettyPrinted = await prettyPrint(source, {
                    doenetSyntax: false,
                    printWidth: 80,
                });
                //origLog(prettyPrinted);
                expect(prettyPrinted).toMatchSnapshot();
            });
        }
    }
});
