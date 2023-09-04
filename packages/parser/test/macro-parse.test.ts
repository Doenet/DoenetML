import { describe, expect, it } from "vitest";
import { mergeAdjacentTextInArray } from "../src/dast-to-xml/utils";
import { MacroParser } from "../src/macros/parser";
import { macroToString } from "../src/macros/macro-to-string";
import { DastNodes } from "../src/types";

describe("Macro parsing", () => {
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
            $(t[1]/x)`.split(/\s+/g);

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
                const parsed = MacroParser.parse(macroStr);
                expect(macroToString(parsed)).toEqual(macroStr);
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
            $$f(x, y)`.split(/\n\s+/g);

        for (const macroStr of validFunctions) {
            it(`should print macro \`${macroStr}\``, () => {
                const parsed = MacroParser.parse(macroStr);
                expect(macroToString(parsed)).toEqual(macroStr);
            });
        }
    }
});
