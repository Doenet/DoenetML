import { describe, expect, it } from "vitest";
import { mergeAdjacentTextInArray } from "../src/dast-to-xml/utils";
import { MacroParser } from "../src/macros/parser";
import { parseMacroTail } from "../src/macros";
import { MacroParser as MacroParserV06 } from "../src/macros-v6/parser";
import { macroToString } from "../src/macros/macro-to-string";
import { macroToString as macroToStringV06 } from "../src/macros-v6/macro-to-string";
import { DastNodes } from "../src/types";

describe("Macro parsing of v0.6 macros", () => {
    {
        const validMacros = `$t
            $t1
            $_t
            $t[1]
            $t[1.5]
            $t[$x]
            $t[a][b]
            $t.x
            $t.x.y
            $t.x[1].y
            $t.x[1][2].y
            $t.x[1].y[2]
            $t{a}
            $t{a="b"}
            $t{a="$b"}
            $t[1]{a="b"}
            $t.x[1]{a="b"}.y
            $(t)
            $(/t)
            $(../t)
            $(x-y)
            $(x-y/a-b)
            $(x-y.a-b)
            $(t.x)
            $(t-x[1].y{a="b"})
            $(t[1]/x)
            $x[2$y$$f(3)]`.split(/\s+/g);

        for (const macroStr of validMacros) {
            it(`should parse macro \`${macroStr}\``, () => {
                expect(MacroParserV06.parse(macroStr)).toMatchSnapshot();
            });
        }
    }
    it("Parses `$x.` as a macro followed by a string", () => {
        expect(MacroParserV06.parse("$x.")).toMatchObject([
            { type: "macro" },
            { type: "text", value: "." },
        ]);
    });
    it("Parses `$x{z}[5]` as a macro followed by a string", () => {
        expect(MacroParserV06.parse("$x{z}[5]")).toMatchObject([
            { type: "macro" },
            { type: "text", value: "[5]" },
        ]);
    });
    it("Parses invalid macros as strings", () => {
        expect(
            mergeAdjacentTextInArray(
                MacroParserV06.parse("$(x{z}[5])") as DastNodes[],
            ),
        ).toMatchObject([{ type: "text", value: "$(x{z}[5])" }]);
    });
    {
        const validMacros = `$t
            $t1
            $_t
            $t[1]
            $t[1.5]
            $t[$x]
            $t[a][b]
            $t.x
            $t.x.y
            $t.x[1].y
            $t.x[1][2].y
            $t.x[1].y[2]
            $t{a}
            $t{a="b"}
            $t{a="$b"}
            $t[1]{a="b"}
            $t.x[1]{a="b"}.y
            $(/t)
            $(../t)
            $(x-y)
            $(x-y/a-b)
            $(x-y.a-b)
            $(t-x[1].y{a="b"})
            $(t[1]/x)
            $(t.x-y)`.split(/\n\s+/g);

        for (const macroStr of validMacros) {
            it(`should print macro \`${macroStr}\``, () => {
                const parsed = MacroParserV06.parse(macroStr);
                expect(macroToStringV06(parsed)).toEqual(macroStr);
            });
        }
    }
    {
        const validFunctions = `$$f
            $$f1(y)
            $$f[1](y)
            $$f[$x](y)
            $$f[a][b](y)
            $$(/f)(y)
            $$(../f)(y)
            $$f($x)
            $$(x-y.z{t})(m)
            $$f(x, y)`.split(/\n\s+/g);

        for (const macroStr of validFunctions) {
            it(`should print macro \`${macroStr}\``, () => {
                const parsed = MacroParserV06.parse(macroStr);
                expect(macroToStringV06(parsed)).toEqual(macroStr);
            });
        }
    }
});

describe("Macro parsing of v0.7 macros", () => {
    {
        const validMacros = `$t
            $t1
            $t_1
            $_t
            $t[1]
            $t[1.5]
            $t[$x]
            $t[a][b]
            $t.x
            $t.x.y
            $t.x[1].y
            $t.x[1][2].y
            $t.x[1].y[2]
            $t{a}
            $t{a="b"}
            $t{a="$b"}
            $t[1]{a="b"}
            $t.x[1]{a="b"}.y
            $(t)
            $(x-y)
            $(x-y.a-b)
            $(t.x)
            $(t-x[1].y{a="b"})
            $x[2$y$$f(3)]`.split(/\s+/g);

        for (const macroStr of validMacros) {
            it(`should parse macro \`${macroStr}\``, () => {
                expect(MacroParser.parse(macroStr)).toMatchSnapshot();
            });
        }
    }
    it("Parses `$x.` as a macro followed by a string", () => {
        expect(MacroParser.parse("$x.")).toMatchObject([
            { type: "macro" },
            { type: "text", value: "." },
        ]);
    });
    it("Parens close macro capturing", () => {
        expect(MacroParser.parse("$(x).y")).toMatchObject([
            { type: "macro" },
            { type: "text", value: ".y" },
        ]);
    });
    it("Parens close macro capturing of []", () => {
        expect(MacroParser.parse("$(x)[1]")).toMatchObject([
            { type: "macro" },
            { type: "text", value: "[1]" },
        ]);
    });
    it("Empty indices are captured", () => {
        expect(MacroParser.parse("$x[]")).toMatchObject([
            {
                type: "macro",
                path: [
                    {
                        type: "pathPart",
                        name: "x",
                        index: [
                            {
                                type: "index",
                                value: [],
                            },
                        ],
                    },
                ],
                attributes: {},
            },
        ]);
    });
    it("Parses `$x{z}[5]` as a macro followed by a string", () => {
        expect(MacroParser.parse("$x{z}[5]")).toMatchObject([
            { type: "macro" },
            { type: "text", value: "[5]" },
        ]);
    });
    it("Parses invalid macros as strings", () => {
        expect(
            mergeAdjacentTextInArray(
                MacroParser.parse("$(x{z}[5])") as DastNodes[],
            ),
        ).toMatchObject([{ type: "text", value: "$(x{z}[5])" }]);
    });
    {
        const validMacros = `$t
            $t1
            $_t
            $t[1]
            $t[1.5]
            $t[$x]
            $t[a][b]
            $t.x
            $t.x.y
            $t.x[1].y
            $t.x[1][2].y
            $t.x[1].y[2]
            $t{a}
            $t{a="b"}
            $t{a="$b"}
            $t[1]{a="b"}
            $t.x[1]{a="b"}.y
            $(x-y)
            $(x-y.a-b)
            $(t-x[1].y{a="b"})
            $(t.x-y)`.split(/\n\s+/g);

        for (const macroStr of validMacros) {
            it(`should print macro \`${macroStr}\``, () => {
                const parsed = MacroParser.parse(macroStr);
                expect(macroToString(parsed)).toEqual(macroStr);
            });
        }
    }
    {
        const validFunctions = `$$f
            $$f()
            $$f1(y)
            $$f[1](y)
            $$f[$x](y)
            $$f[a][b](y)
            $$f($x)
            $$(x-y.z{t})(m)
            $$f(x, y)`.split(/\n\s+/g);

        for (const macroStr of validFunctions) {
            it(`should print macro \`${macroStr}\``, () => {
                const parsed = MacroParser.parse(macroStr);
                expect(macroToString(parsed)).toEqual(macroStr);
            });
        }
    }
    it("Unbalanced parens for functions are not processed", () => {
        expect(MacroParser.parse("$$f(")).toMatchObject([
            { type: "function" },
            { type: "text", value: "(" },
        ]);
    });
    it("Does not processes numbers immediately following $ as macros", () => {
        expect(MacroParser.parse("$1")).toMatchObject([
            { type: "text", value: "$" },
            { type: "text", value: "1" },
        ]);
        expect(MacroParser.parse("$1[1]")).toMatchObject([
            { type: "text", value: "$" },
            { type: "text", value: "1[1]" },
        ]);
    });
    it("Does not processes numbers immediately following $$ as macros", () => {
        expect(MacroParser.parse("$$1")).toMatchObject([
            { type: "text", value: "$" },
            { type: "text", value: "$" },
            { type: "text", value: "1" },
        ]);
        expect(MacroParser.parse("$$1(1)")).toMatchObject([
            { type: "text", value: "$" },
            { type: "text", value: "$" },
            { type: "text", value: "1(1)" },
        ]);
    });
});

describe("Parsing the tail of a reference's path", () => {
    // The `MacroTail` start rule, which `gobblePropIndices` uses to carry a
    // path past an element index (#1915). It parses a *prefix* and hands back
    // what it could not claim, which is what lets it run on a text node that
    // continues into ordinary prose.

    it("claims a following path part", () => {
        expect(parseMacroTail(".x")).toMatchObject({
            index: [],
            parts: [{ type: "pathPart", name: "x", index: [] }],
            remainder: "",
        });
    });

    it("claims a following index", () => {
        expect(parseMacroTail("[1]")).toMatchObject({
            index: [{ type: "index", value: [{ type: "text", value: "1" }] }],
            parts: [],
            remainder: "",
        });
    });

    it("claims indices and parts together, in the order written", () => {
        const tail = parseMacroTail("[1].x[2].y");
        expect(tail.index).toHaveLength(1);
        expect(tail.parts.map((p) => p.name)).toEqual(["x", "y"]);
        expect(tail.parts[0].index).toHaveLength(1);
        expect(tail.remainder).toBe("");
    });

    it("hands back everything it cannot claim", () => {
        expect(parseMacroTail(".x is the answer")).toMatchObject({
            parts: [{ name: "x" }],
            remainder: " is the answer",
        });
    });

    it("claims nothing rather than failing", () => {
        // The rule has to be total: nothing wraps the parser in a try/catch,
        // and a throw here would stop the whole document from parsing.
        for (const source of ["", " .x", "text", "[unclosed", "{", "]", "."]) {
            const tail = parseMacroTail(source);
            expect(tail.index).toEqual([]);
            expect(tail.parts).toEqual([]);
            expect(tail.remainder).toBe(source);
        }
    });

    it("uses the simple-path rules, not the parenthesized ones", () => {
        // `$a.3-b` is not writable, so `$a[<n/>].3-b` must not be either.
        expect(parseMacroTail(".3-b")).toMatchObject({
            parts: [],
            remainder: ".3-b",
        });
    });

    it("claims a brace block, as a bare path does", () => {
        // v0.7 ignores what is inside, but `$a[1]{z}` swallows the braces and
        // `$a[<n/>]{z}` should not differ from it.
        expect(parseMacroTail("{z}")).toMatchObject({
            attrs: { z: { type: "attribute", name: "z" } },
            remainder: "",
        });
    });

    it("reports positions relative to its own input", () => {
        // The caller rebases these; the rule itself knows nothing about where
        // in the document the text sat.
        expect(parseMacroTail(".x").parts[0].position).toMatchObject({
            start: { offset: 1 },
            end: { offset: 2 },
        });
    });
});
