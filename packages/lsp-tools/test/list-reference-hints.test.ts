import { describe, expect, it } from "vitest";
import { DiagnosticSeverity } from "vscode-languageserver/browser";
import { doenetSchema } from "@doenet/static-assets/schema";
import { AutoCompleter } from "../src";

/**
 * The editor hint where a list joins a reference to the text beside it
 * (Doenet/DoenetML#2168, D40): in a list separated by spaces, `2$a` is one
 * entry and `2 $a` two.
 */
async function hints(source: string) {
    const diagnostics = await new AutoCompleter(
        source,
        doenetSchema.elements,
    ).getSchemaViolations();
    return diagnostics.filter((d) => d.code === "doenet-i0059");
}

/** The source text each hint points at (one-line sources only). */
async function hintedText(source: string) {
    return (await hints(source)).map((d) => {
        expect(d.range.start.line).toBe(0);
        expect(d.range.end.line).toBe(0);
        return source.slice(d.range.start.character, d.range.end.character);
    });
}

const A = `<math name="a">y</math><math name="b">z</math>`;

describe("list reference hints", () => {
    it("points at a reference written with no space beside text", async () => {
        const source = `${A}<mathList>x 2$a</mathList>`;
        const found = await hints(source);
        expect(found).toHaveLength(1);
        expect(found[0].severity).toBe(DiagnosticSeverity.Hint);
        expect(found[0].message).toBe(
            "`2$a` is one entry of the `<mathList>`: a reference written with no space beside the text around it is part of the same entry. To make them separate entries, put a space between them.",
        );
        expect(found[0].data).toEqual({
            args: { entry: "2$a", componentType: "mathList" },
        });
        expect(await hintedText(source)).toEqual(["2$a"]);
    });

    it("points at a reference joined to text after it or to another reference", async () => {
        expect(
            await hintedText(`${A}<mathList>$a+1 $a$b $b</mathList>`),
        ).toEqual(["$a+1", "$a$b"]);
    });

    it("points at a list referring to its own value", async () => {
        const source = `<mathList name="ml"><math>x</math> 2$ml[1]</mathList>`;
        expect(await hintedText(source)).toEqual(["2$ml[1]"]);
    });

    it("gives no hint for a reference with spaces around it", async () => {
        expect(await hints(`${A}<mathList>2 $a 3</mathList>`)).toEqual([]);
        expect(await hints(`${A}<mathList>$a</mathList>`)).toEqual([]);
    });

    it("gives no hint in a list separated by commas", async () => {
        expect(await hints(`${A}<mathList>x, 2$a + 1</mathList>`)).toEqual([]);
    });

    it("gives no hint for a reference joined inside brackets", async () => {
        expect(await hints(`${A}<mathList>(2$a) 3</mathList>`)).toEqual([]);
        // Outside them, it does.
        expect(await hintedText(`${A}<mathList>(2)$a 3</mathList>`)).toEqual([
            "(2)$a",
        ]);
    });

    it("gives hints in the other list tags", async () => {
        expect(await hintedText(`${A}<textList>hi$a there</textList>`)).toEqual(
            ["hi$a"],
        );
        expect(await hintedText(`${A}<numberList>1 2$a</numberList>`)).toEqual([
            "2$a",
        ]);
    });

    it("gives no hint outside a list tag", async () => {
        expect(await hints(`${A}<p>2$a</p>`)).toEqual([]);
        expect(await hints(`${A}<math>2$a</math>`)).toEqual([]);
        expect(await hints(`${A}<sum>2$a</sum>`)).toEqual([]);
    });

    it("gives no hint where a child component stands alone", async () => {
        expect(
            await hints(`${A}<mathList>2<math>x</math> 3</mathList>`),
        ).toEqual([]);
    });

    it("points at a function call joined to the text beside it", async () => {
        // `2$$f(1)` is one entry, `2 f(1)` (runtime `2 * 1, 3`).
        const source = `<function name="f">x^2</function><mathList>2$$f(1) 3</mathList>`;
        expect(await hintedText(source)).toEqual(["2$$f(1)"]);
        expect(await hints(source.replace("2$$f", () => "2 $$f"))).toEqual([]);
    });

    it("gives no hint in a list it cannot read as written", async () => {
        // A comment, or an entity whose text is not the source.
        expect(
            await hints(`${A}<mathList>2$a <!-- c --> 3</mathList>`),
        ).toEqual([]);
        expect(await hints(`${A}<textList>&amp;$a 3</textList>`)).toEqual([]);
    });

    it("gives no hint in an empty list", async () => {
        expect(await hints(`${A}<mathList></mathList>`)).toEqual([]);
        expect(await hints(`${A}<mathList> \n\t </mathList>`)).toEqual([]);
        expect(await hints(`${A}<mathList/>`)).toEqual([]);
    });

    it("reads tabs as spaces and ignores brackets that do not balance", async () => {
        expect(await hintedText(`${A}<mathList>x\t2$a</mathList>`)).toEqual([
            "2$a",
        ]);
        // Unbalanced, the brackets group nothing: `(2$a` is one entry.
        expect(await hintedText(`${A}<mathList>(2$a 3</mathList>`)).toEqual([
            "(2$a",
        ]);
    });

    it("reads the tag name as the worker does", async () => {
        expect(await hintedText(`${A}<MathList>2$a 3</MathList>`)).toEqual([
            "2$a",
        ]);
    });

    it("points into a list written over several lines", async () => {
        const source = `${A}\n<mathList>\n  x\n  2$a\n</mathList>`;
        const found = await hints(source);
        expect(found).toHaveLength(1);
        expect(found[0].range).toEqual({
            start: { line: 3, character: 2 },
            end: { line: 3, character: 5 },
        });
    });
});
