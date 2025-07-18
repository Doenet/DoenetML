import { describe, expect, it } from "vitest";
import util from "util";

import { filterPositionInfo, DastMacro, DastElement } from "@doenet/parser";
import { DoenetSourceObject, isOldMacro } from "../src/doenet-source-object";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("DoenetSourceObject", () => {
    it("Can convert between offsets and positions", () => {
        let source: string;

        source = "abc\nx\nq r s";
        let sourceObj = new DoenetSourceObject(source);

        expect(sourceObj.offsetToRowCol(0)).toEqual({ line: 1, column: 1 });
        expect(
            Array.from(source).map((c, i) => sourceObj.offsetToRowCol(i)),
        ).toEqual([
            { line: 1, column: 1 },
            { line: 1, column: 2 },
            { line: 1, column: 3 },
            { line: 1, column: 4 },
            { line: 2, column: 1 },
            { line: 2, column: 2 },
            { line: 3, column: 1 },
            { line: 3, column: 2 },
            { line: 3, column: 3 },
            { line: 3, column: 4 },
            { line: 3, column: 5 },
        ]);

        expect(
            Array.from(source)
                .map((c, i) => sourceObj.offsetToRowCol(i))
                .map((pos) => sourceObj.rowColToOffset(pos)),
        ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    it("Can convert between LSP offsets and positions", () => {
        let source: string;

        source = "abc\nx\nq r s";
        let sourceObj = new DoenetSourceObject(source);

        expect(
            Array.from(source)
                .map((c, i) => sourceObj.offsetToRowCol(i))
                // LSP positions are 0-indexed
                .map((pos) => ({
                    line: pos.line - 1,
                    character: pos.column - 1,
                }))
                .map((pos) => sourceObj.rowColToOffset(pos)),
        ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("Can get DAST", () => {
        let source: string;

        source = "abc\nx\nq r s";
        let sourceObj = new DoenetSourceObject(source);
        expect(filterPositionInfo(sourceObj.dast)).toEqual({
            children: [
                {
                    type: "text",
                    value: source,
                },
            ],
            sources: ["abc\nx\nq r s"],
            type: "root",
        });

        // When the source changes, the DAST should change
        source = "hi";
        sourceObj.setSource(source);
        expect(filterPositionInfo(sourceObj.dast)).toEqual({
            children: [
                {
                    type: "text",
                    value: source,
                },
            ],
            sources: ["hi"],
            type: "root",
        });
    });

    it("Can find what the containing node at a given offset", () => {
        let source: string;

        source = "a<x>hi <b>there</b></x><you />";
        let sourceObj = new DoenetSourceObject(source);

        expect(sourceObj.nodeAtOffset(0)).toMatchObject({ type: "text" });
        expect(sourceObj.nodeAtOffset(1)).toMatchObject({
            type: "element",
            name: "x",
        });
        expect(sourceObj.nodeAtOffset(4)).toMatchObject({ type: "text" });
        expect(sourceObj.nodeAtOffset(8)).toMatchObject({
            type: "element",
            name: "b",
        });
        expect(sourceObj.nodeAtOffset(23)).toMatchObject({
            type: "element",
            name: "you",
        });
        expect(sourceObj.nodeAtOffset(50)).toEqual(null);
    });

    it("Can get parent", () => {
        let source: string;

        source = "<a><b><c>hi</c></b></a>";
        let sourceObj = new DoenetSourceObject(source);
        const dast = sourceObj.dast;
        const child = (
            (dast.children[0] as DastElement).children[0] as DastElement
        ).children[0];
        const parent = (dast.children[0] as DastElement).children[0];

        expect(sourceObj.getParent(child)).toEqual(parent);
    });

    it("Can get element", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<a><b foo="bar">   <c>hi</c></b></a>`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(4);
            expect(cursorPosition).toEqual("openTagName");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(6);
            expect(cursorPosition).toEqual("attributeName");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(11);
            expect(cursorPosition).toEqual("attributeValue");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(17);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }

        source = `<a > </a   >`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(3);
            expect(cursorPosition).toEqual("openTag");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(5);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(9);
            expect(cursorPosition).toEqual("unknown");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(11);
            expect(cursorPosition).toEqual("unknown");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }

        source = `<a><b> </a>`;
        sourceObj = new DoenetSourceObject(source);
        {
            const offset = source.indexOf("</a>") - 1;
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(offset);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        {
            // Right at the boundary before the close tag of an element when there
            // is a non-closed element inside, we should claim to be inside the body
            // of the non-closed element.
            const offset = source.indexOf("</a>");
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(offset);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        // The user may be in the middle of typing. A < probably indicates they're trying to
        // type a tag. We want to assume that we're part of the unclosed tag for completion purposes.
        source = `<a><b> <</a>`;
        sourceObj = new DoenetSourceObject(source);
        {
            const offset = source.indexOf("</a>");
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(offset);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
    });

    it("Can get cursor position when element contains macro", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<p>$x zz zz</p>`;
        sourceObj = new DoenetSourceObject(source);
        {
            let offset = source.indexOf("$x");
            let { cursorPosition, node } = sourceObj.elementAtOffsetWithContext(
                offset + 1,
            );
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "p" });
        }
    });

    it("Can find cursorPosition in incomplete element", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<a    `;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(3);
            expect(cursorPosition).toEqual("openTag");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }

        source = `<p><a    </p>`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(7);
            expect(cursorPosition).toEqual("openTag");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }

        source = `<`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } =
                sourceObj.elementAtOffsetWithContext(1);
            expect(cursorPosition).toEqual("unknown");
            expect(node).toEqual(null);
        }
    });

    it("Can get element ranges", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<a><b foo="bar">   <c>hi</c></b></a>`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { node } = sourceObj.elementAtOffsetWithContext(1);
            expect(node?.name).toEqual("a");
            expect(sourceObj.getElementTagRanges(node!)).toMatchInlineSnapshot(`
              [
                {
                  "end": 3,
                  "start": 0,
                },
                {
                  "end": 36,
                  "start": 32,
                },
              ]
            `);
        }
        {
            let { node } = sourceObj.elementAtOffsetWithContext(4);
            expect(node?.name).toEqual("b");
            expect(sourceObj.getElementTagRanges(node!)).toMatchInlineSnapshot(`
              [
                {
                  "end": 16,
                  "start": 3,
                },
                {
                  "end": 32,
                  "start": 28,
                },
              ]
            `);
        }
    });
});
