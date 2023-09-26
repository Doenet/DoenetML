import { describe, expect, it } from "vitest";
import util from "util";

import { filterPositionInfo, DastMacro } from "@doenet/parser";
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
        const child = dast.children[0].children[0].children[0];
        const parent = dast.children[0].children[0];

        expect(sourceObj.getParent(child)).toEqual(parent);
    });

    it("Can get element", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<a><b foo="bar">   <c>hi</c></b></a>`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(4);
            expect(cursorPosition).toEqual("openTagName");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(6);
            expect(cursorPosition).toEqual("attributeName");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(11);
            expect(cursorPosition).toEqual("attributeValue");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(17);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "b" });
        }

        source = `<a > </a   >`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(3);
            expect(cursorPosition).toEqual("openTag");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(5);
            expect(cursorPosition).toEqual("body");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(9);
            expect(cursorPosition).toEqual("unknown");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(11);
            expect(cursorPosition).toEqual("unknown");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
    });

    it("Can find cursorPosition in incomplete element", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<a    `;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(3);
            expect(cursorPosition).toEqual("openTag");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
        source = `<p><a    </p>`;
        sourceObj = new DoenetSourceObject(source);
        {
            let { cursorPosition, node } = sourceObj.elementAtOffset(7);
            expect(cursorPosition).toEqual("openTag");
            expect(node).toMatchObject({ type: "element", name: "a" });
        }
    });

    it("Can find named referents", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;

        source = `<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />`;
        sourceObj = new DoenetSourceObject(source);
        {
            let offset = source.indexOf("<c") + 1;
            let elm = sourceObj.getReferentAtOffset(offset, "y");
            expect(elm).toMatchObject({ type: "element", name: "b" });
        }
        {
            // `y` is ambiguous at this place in the tree
            let offset = source.indexOf("<d") + 1;
            let elm = sourceObj.getReferentAtOffset(offset, "y");
            expect(elm).toBeNull();
        }
        {
            let offset = source.indexOf("<d") + 1;
            let elm = sourceObj.getReferentAtOffset(offset, "z");
            expect(elm).toMatchObject({ type: "element", name: "c" });
        }
    });

    it("Can find named referents from macros", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;
        let macro: DastMacro;

        source = `<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />`;
        sourceObj = new DoenetSourceObject(source);
        {
            let offset = source.indexOf("<d") + 1;
            macro = new DoenetSourceObject("$x.y").dast.children[0];
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let offset = source.indexOf("<d") + 1;
            macro = new DoenetSourceObject("$x.y.w").dast.children[0];
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "b" });
            expect(elm?.accessedProp).toMatchObject(
                macro.accessedProp.accessedProp,
            );
        }
        {
            let offset = source.indexOf("<d") + 1;
            macro = new DoenetSourceObject("$x.y.z").dast.children[0];
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "c" });
        }
    });

    it("Can determine if a macro is an old-style macro with slashes in the path", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;
        let macro: DastMacro;

        source = `$foo.bar[2].baz`;
        sourceObj = new DoenetSourceObject(source);
        macro = sourceObj.dast.children[0];
        expect(isOldMacro(macro)).toEqual(false);

        source = `$(foo.bar[2].baz)`;
        sourceObj = new DoenetSourceObject(source);
        macro = sourceObj.dast.children[0];
        expect(isOldMacro(macro)).toEqual(false);

        source = `$(foo/x.bar[2].baz)`;
        sourceObj = new DoenetSourceObject(source);
        macro = sourceObj.dast.children[0];
        expect(isOldMacro(macro)).toEqual(true);
    });
});
