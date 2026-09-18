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

    it("Always breaks children of always-break parents like <graph>", async () => {
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

    it("Keeps a reference's parens, so formatting cannot change what a document means", async () => {
        // The formatter prints each child on its own, so it never reached the
        // rule `toXml` applies along a run of siblings. It dropped the parens
        // from every one of these: `$(x)hi` came back as `$xhi`, a reference to
        // a component the author never named, and `$(x)[1]` as an indexed
        // `$x[1]`. Each of these is already canonically formatted, so formatting
        // has to give it back unchanged.
        const unchanged = [
            // A path holding an element has no parenthesized spelling, so these
            // must come back bare — wrapping one loses the reference entirely.
            "<p>$a[<n />][</p>",
            "<p>$a[<n />][2</p>",
            "<p>$(x)hi</p>",
            "<p>$(x)_0</p>",
            "<p>$(x)[1]</p>",
            "<p>$(x).y</p>",
            "<p>$(x){z}</p>",
            "<p>$$(f)[1]</p>",
            "<p>$(a-b)</p>",
            // An element between the brackets puts a warning node between the
            // reference and the `[`, and the formatter prints a warning as
            // nothing at all — so looking only at the immediately next sibling
            // saw nothing following and dropped the parens. `$x[<n />]` is a
            // reference *with* an element index; `$$f[<n />](y)` is that index
            // being called. Both are documents the author did not write.
            "<p>$(x)[<n />]</p>",
            "<p>$$(f)[<n />](y)</p>",
        ];
        // ...and these have nothing following that a path could take, so they
        // must not gain parentheses either.
        const dropped = [
            ["<p>$(x) hi</p>", "<p>$x hi</p>"],
            ["<p>$(x).5</p>", "<p>$x.5</p>"],
            ["<p>$(x)</p>", "<p>$x</p>"],
        ];
        // Both modes. The printer feeds mode-dependent output into the paren
        // rule — the same index prints as `<n />`, as `&lt;` or as a raw `<`
        // depending on `doenetSyntax` — and the language server formats with
        // `doenetSyntax: true`. Two defects here survived four review cycles
        // precisely because nothing in this file exercised that mode.
        for (const doenetSyntax of [false, true]) {
            for (const source of unchanged) {
                for (const printWidth of [40, 80]) {
                    expect(
                        await prettyPrint(source, {
                            doenetSyntax,
                            printWidth,
                        }),
                        `${source} @${printWidth} doenetSyntax=${doenetSyntax}`,
                    ).toEqual(source);
                }
            }
            for (const [source, expected] of dropped) {
                expect(
                    await prettyPrint(source, {
                        doenetSyntax,
                        printWidth: 80,
                    }),
                    `${source} doenetSyntax=${doenetSyntax}`,
                ).toEqual(expected);
            }
        }

        // And the one whose answer differs by mode. In DoenetML syntax a `<`
        // in a text index prints raw, so the parentheses are readable and are
        // kept; in XML mode it escapes to `&lt;`, which `$( … )` cannot read
        // back, so they are dropped and the reference survives bare.
        expect(
            await prettyPrint(`<p>$(a[x < y])[2]</p>`, {
                doenetSyntax: true,
                printWidth: 80,
            }),
        ).toEqual(`<p>$(a[x < y])[2]</p>`);
        expect(
            await prettyPrint(`<p>$(a[x < y])[2]</p>`, {
                doenetSyntax: false,
                printWidth: 80,
            }),
        ).toEqual(`<p>$a[x &lt; y][2]</p>`);
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
