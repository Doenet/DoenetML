import { glob } from "glob";
import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import { prettyPrint } from "../src/pretty-printer";
import util from "util";
import { normalizeWhitespace } from "../src/pretty-printer/normalize/plugin-merge-whitespace";
import { _testOnly as layoutTestOnly } from "../src/pretty-printer/normalize/layout-categories";
import { _testOnly as blankLineTestOnly } from "../src/pretty-printer/normalize/plugin-mark-blank-lines";
import { doenetSchema } from "@doenet/static-assets/schema";

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
            { inStr: "$$f(x,$y)", outStr: "$$f(x, $y)" },
            { inStr: "$$f(x,$y z)", outStr: "$$f(x, $y z)" },
            { inStr: "$$f((),())", outStr: "$$f((), ())" },
            { inStr: "$$f(x,$$g(y,z))", outStr: "$$f(x, $$g(y, z))" },
            {
                inStr: "$$f(x,<math>alpha</math>)",
                outStr: "$$f(x, <math>alpha</math>)",
            },
            {
                inStr: "$$f((x),<math>alpha</math>)",
                outStr: "$$f((x), <math>alpha</math>)",
            },
            {
                inStr: "$$f(x,   <math>alpha</math>)",
                outStr: "$$f(x, <math>alpha</math>)",
            },
            {
                inStr: "<p>$$f(x, <math>alpha</math>)</p>",
                outStr: "<p>\n    $$f(x, <math>alpha</math>)\n</p>",
            },
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
                // Idempotence: re-formatting must produce the same output.
                // Catches a whole class of layout-oscillation bugs that the
                // snapshot alone misses. Checked at several widths because
                // fill()'s break decisions are width-sensitive — a bug that
                // surfaces only at narrow / wide widths would slip past an
                // 80-only check.
                for (const printWidth of [40, 80, 120]) {
                    const first = await prettyPrint(source, {
                        doenetSyntax: false,
                        printWidth,
                    });
                    const second = await prettyPrint(first, {
                        doenetSyntax: false,
                        printWidth,
                    });
                    expect(second, `idempotence@${printWidth}`).toEqual(first);
                }
            });
        }
    }

    it("Always breaks children of BREAK_AROUND_ELEMENTS", async () => {
        const cases = [
            {
                inStr: "<graph><line /><line /></graph>",
                outStr: "<graph>\n    <line />\n    <line />\n</graph>",
            },
        ];
        for (const { inStr, outStr } of cases) {
            const prettyPrinted = await prettyPrint(inStr, {
                doenetSyntax: false,
                printWidth: 30,
            });
            expect(prettyPrinted).toEqual(outStr);
        }
    });

    it("Blank-line boundary regexes only fire on newline-separated whitespace", () => {
        // The character class is `[^\S\n]` — any whitespace that ISN'T a
        // newline. Easy to miscopy as `\s` (which would let a single
        // newline + spaces look like a blank line) or as `[^\n]` (which
        // would match non-whitespace too). Lock in the intent.
        const { TRAILING_BLANK_LINE, LEADING_BLANK_LINE } = blankLineTestOnly;

        // TRAILING: matches a blank line at end of string.
        expect(TRAILING_BLANK_LINE.test("foo\n\n")).toBe(true);
        expect(TRAILING_BLANK_LINE.test("foo\n  \n")).toBe(true);
        expect(TRAILING_BLANK_LINE.test("foo\n\n   ")).toBe(true);
        expect(TRAILING_BLANK_LINE.test("foo \n \n\t")).toBe(true);
        // Single newline (not a blank line) must NOT match.
        expect(TRAILING_BLANK_LINE.test("foo\n")).toBe(false);
        expect(TRAILING_BLANK_LINE.test("foo\n  ")).toBe(false);
        // Pure spaces (no newlines) must NOT match.
        expect(TRAILING_BLANK_LINE.test("foo   ")).toBe(false);
        // No trailing newline at all must NOT match.
        expect(TRAILING_BLANK_LINE.test("foo\n\nbar")).toBe(false);

        // LEADING: matches a blank line at start of string.
        expect(LEADING_BLANK_LINE.test("\n\nfoo")).toBe(true);
        expect(LEADING_BLANK_LINE.test("\n  \nfoo")).toBe(true);
        expect(LEADING_BLANK_LINE.test("  \n\nfoo")).toBe(true);
        expect(LEADING_BLANK_LINE.test("\t\n \nfoo")).toBe(true);
        // Single newline (not a blank line) must NOT match.
        expect(LEADING_BLANK_LINE.test("\nfoo")).toBe(false);
        expect(LEADING_BLANK_LINE.test("  \nfoo")).toBe(false);
        // Pure spaces (no newlines) must NOT match.
        expect(LEADING_BLANK_LINE.test("   foo")).toBe(false);
        // No leading newline at all must NOT match.
        expect(LEADING_BLANK_LINE.test("foo\n\n")).toBe(false);
    });

    it("Hand-curated layout-category overrides match existing schema elements", () => {
        // If a component is renamed in `componentInfoObjects` upstream,
        // any override that still references the old name silently goes
        // dead — the formatter quietly downgrades that element to inline.
        // This catches the drift in CI.
        const schemaNames = new Set(
            doenetSchema.elements.map((e: { name: string }) => e.name),
        );
        const unknown: string[] = [];
        for (const name of layoutTestOnly.BLOCK_OVERRIDES) {
            if (!schemaNames.has(name)) unknown.push(`BLOCK_OVERRIDES:${name}`);
        }
        for (const name of layoutTestOnly.OTHER_BLOCK_NAMES) {
            if (!schemaNames.has(name))
                unknown.push(`OTHER_BLOCK_NAMES:${name}`);
        }
        expect(unknown).toEqual([]);
    });

    it("Don't create new macro names when &dollar; entity appears in text", async () => {
        const cases = [
            {
                inStr: "<p>&dollar;x</p>",
                outStr: "<p>$\u200Bx</p>",
            },
            {
                inStr: "<p>&dollar;</p>",
                outStr: "<p>$</p>",
            },
        ];

        for (const { inStr, outStr } of cases) {
            const prettyPrinted = await prettyPrint(inStr, {
                doenetSyntax: false,
                printWidth: 30,
            });
            expect(prettyPrinted).toEqual(outStr);
        }
    });
});
