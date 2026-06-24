import { describe, expect, it } from "vitest";
import util from "util";

import { filterPositionInfo, DastMacro, DastElement } from "@doenet/parser";
import { DoenetSourceObject } from "../src/doenet-source-object";

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

    it("Reports `attributeName` for a bare value recovered as an AttributeValue node", () => {
        // Lezer's error recovery wraps a bare unquoted run after `=` in an
        // `AttributeValue(⚠,⚠)` node when the partial element is followed by
        // `</...>` or another `<`. The cursor-position detector must
        // distinguish that recovered form from a real quoted value: only the
        // latter starts with `"`/`'`. Without this, the bare-value branch in
        // `get-completion-items` is masked and the wrap-in-quotes hint
        // disappears inside a parent element.
        const source = `<aa><b bar=mo</aa>`;
        const sourceObj = new DoenetSourceObject(source);
        const offset = source.indexOf("mo") + 2;
        const { cursorPosition, node } =
            sourceObj.elementAtOffsetWithContext(offset);
        expect(cursorPosition).toEqual("attributeName");
        expect(node).toMatchObject({ type: "element", name: "b" });
    });

    it("Still reports `attributeValue` for a real quoted value", () => {
        // Sanity guard for the above: when the AttributeValue node actually
        // starts with `"` or `'`, the cursor position must remain
        // `attributeValue` so the wrap-in-quotes hint stays suppressed.
        const source = `<aa x="abc=def"></aa>`;
        const sourceObj = new DoenetSourceObject(source);
        const offset = source.indexOf("def") + 3;
        const { cursorPosition, node } =
            sourceObj.elementAtOffsetWithContext(offset);
        expect(cursorPosition).toEqual("attributeValue");
        expect(node).toMatchObject({ type: "element", name: "aa" });
    });

    it("Returns body (not openTag) when < is typed inside an element", () => {
        // When a user types `<` inside an element, the completion should
        // recognize the cursor is in the body (to suggest child elements),
        // not in the parent's open tag (which would suggest attributes).
        const source = `<booleanInput name="bi"><</booleanInput>`;
        const sourceObj = new DoenetSourceObject(source);
        const offset = source.indexOf("><") + 2; // right after the typed `<`
        const { cursorPosition, node } =
            sourceObj.elementAtOffsetWithContext(offset);
        expect(cursorPosition).toEqual("body");
        expect(node).toMatchObject({ type: "element", name: "booleanInput" });
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

    it("Reports the container (not the element) when the cursor is on a tag boundary (#1327)", () => {
        for (const { source, offset } of [
            { source: `<text/>`, offset: 0 },
            { source: ` <text/>`, offset: 1 },
        ]) {
            const { cursorPosition, node } = new DoenetSourceObject(
                source,
            ).elementAtOffsetWithContext(offset);
            expect(cursorPosition).toEqual("body");
            expect(node).toEqual(null);
        }

        for (const { source, offset } of [
            { source: `<p><text/></p>`, offset: 3 },
            { source: `<p> <text/></p>`, offset: 4 },
            { source: `<p>\n  <text/></p>`, offset: 6 },
        ]) {
            const { cursorPosition, node } = new DoenetSourceObject(
                source,
            ).elementAtOffsetWithContext(offset);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "p" });
        }

        const { cursorPosition, node } = new DoenetSourceObject(
            `<text/>`,
        ).elementAtOffsetWithContext(6);
        expect(cursorPosition).toEqual("openTag");
        expect(node).toMatchObject({ type: "element", name: "text" });
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

    describe("isCompleteElement (issue #1117 stolen-close-tag heuristic)", () => {
        // Helper: get the element whose open-tag starts at `tagOpenIdx`
        // (the offset of the `<`).
        function elementAt(source: string, tagOpenIdx: number) {
            const sourceObj = new DoenetSourceObject(source);
            const { node } = sourceObj.elementAtOffsetWithContext(
                tagOpenIdx + 1,
            );
            return { sourceObj, node: node as DastElement };
        }

        it("reports closed=false for inner same-name child of unclosed parent", () => {
            // Parser stack-matches the only </p> to the inner <p>; user intent
            // is for the inner to still need its own close tag.
            const source = "<p><p></p>";
            const { sourceObj, node } = elementAt(
                source,
                source.indexOf("<p>", 1),
            );
            expect(node.name).toEqual("p");
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: true,
                closed: false,
            });
        });

        it("reports closed=true when same-name nesting is fully balanced", () => {
            const source = "<p><p></p></p>";
            const { sourceObj, node } = elementAt(
                source,
                source.indexOf("<p>", 1),
            );
            expect(node.name).toEqual("p");
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: true,
                closed: true,
            });
        });

        it("reports closed=false for innermost in a deeply nested domino case", () => {
            // <p><p><p></p></p>  — only two </p> for three <p>.
            // Innermost lezer-closed, middle lezer-closed, outermost unclosed.
            // Walk past closed same-name middle to find unclosed same-name outermost.
            const source = "<p><p><p></p></p>";
            const { sourceObj, node } = elementAt(
                source,
                source.lastIndexOf("<p>"),
            );
            expect(node.name).toEqual("p");
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: true,
                closed: false,
            });
        });

        it("does NOT flip when a different-name ancestor breaks the chain", () => {
            // The inner <p>'s </p> is genuinely its own; the outer <p>'s
            // unclosed state is unrelated because <div> sits between them.
            const source = "<p><div><p></p></div>";
            const { sourceObj, node } = elementAt(
                source,
                source.indexOf("<p>", 1),
            );
            expect(node.name).toEqual("p");
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: true,
                closed: true,
            });
        });

        it("reports closed=true when parent has a different tag name", () => {
            const source = "<a><p></p>";
            const { sourceObj, node } = elementAt(
                source,
                source.indexOf("<p>"),
            );
            expect(node.name).toEqual("p");
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: true,
                closed: true,
            });
        });

        it("is case-sensitive (<P> and <p> are different tags)", () => {
            const source = "<P><p></p>";
            const { sourceObj, node } = elementAt(
                source,
                source.indexOf("<p>"),
            );
            expect(node.name).toEqual("p");
            // <P> ≠ <p>, so the walk stops at the different-name ancestor.
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: true,
                closed: true,
            });
        });

        it("reports tagComplete=false for an unfinished open tag (regression)", () => {
            const source = "<p";
            const { sourceObj, node } = elementAt(source, 0);
            expect(node.name).toEqual("p");
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: false,
                closed: false,
            });
        });

        it("self-closing tag reports tagComplete=true, closed=true (regression)", () => {
            const source = "<p/>";
            const { sourceObj, node } = elementAt(source, 0);
            expect(node.name).toEqual("p");
            expect(sourceObj.isCompleteElement(node)).toEqual({
                tagComplete: true,
                closed: true,
            });
        });
    });
});
