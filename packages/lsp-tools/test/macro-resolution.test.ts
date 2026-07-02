import { describe, expect, it } from "vitest";
import util from "util";

import { DastMacro, DastElement } from "@doenet/parser";
import { DoenetSourceObject } from "../src/doenet-source-object";
import {
    getPrefixes,
    mergeLeftUniquePrefixes,
} from "../src/doenet-source-object/methods/macro-resolvers";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("DoenetSourceObject", () => {
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
            macro = new DoenetSourceObject("$x.y").dast
                .children[0] as any as DastMacro;
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let offset = source.indexOf("<d") + 1;
            macro = new DoenetSourceObject("$x.y.w").dast
                .children[0] as any as DastMacro;
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "b" });
            expect(elm?.unresolvedPath.map((p) => p.name)).toEqual(["w"]);
        }
        {
            let offset = source.indexOf("<d") + 1;
            macro = new DoenetSourceObject("$x.y.z").dast
                .children[0] as any as DastMacro;
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "c" });
            expect(elm?.unresolvedPath).toEqual([]);
        }
    });

    it("Can uniquely merge prefixes", () => {
        expect(getPrefixes(["a", "b", "c"])).toEqual([
            ["a"],
            ["a", "b"],
            ["a", "b", "c"],
        ]);

        expect(
            mergeLeftUniquePrefixes([], [[["a"]], [["b"]], [["a", "x"]]]),
        ).toEqual([["a"], ["b"]]);

        expect(
            mergeLeftUniquePrefixes(
                [
                    ["a", "b"],
                    ["a", "c"],
                ],
                [[["a", "b", "c"], ["a", "b", "d"], ["z"]]],
            ),
        ).toEqual([["a", "b"], ["a", "c"], ["z"]]);
    });

    it("Can generate addresses of children", () => {
        let source: string;
        let sourceObj: DoenetSourceObject;
        let elm: DastElement;

        source = ` <a name="x">
            <b name="y">
                <c name="z" />
            </b>
            <f>
                <e name="y" />
            </f>
        </a>
        <d name="y" />`;
        sourceObj = new DoenetSourceObject(source);
        expect(sourceObj.getAddressableNamesAtOffset(0)).toEqual([
            ["x"],
            ["z"],
            ["x", "z"],
        ]);
        // The cursor on `<a>`'s opening `<` sits *before* `<a>` in the
        // top-level body (#1327), so it resolves names from the top-level
        // scope — the same as offset 0 — rather than from inside `<a>`.
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<a")),
        ).toEqual([["x"], ["z"], ["x", "z"]]);
        // A cursor *inside* `<a>`'s opening tag (past the `<`, e.g. in the
        // tag's whitespace/attributes) is within `<a>`, so it resolves from
        // `<a>`'s scope, closest first.
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<a") + 2),
        ).toEqual([["z"], ["x"], ["x", "z"]]);
        // A cursor inside `<a>`'s body (here on child `<b>`'s boundary, which
        // resolves to its container `<a>`) likewise sees `<a>`'s scope.
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<b")),
        ).toEqual([["z"], ["x"], ["x", "z"]]);

        source = ` <a name="x">
            <b name="y">
                <c name="z" />
            </b>
            <f>
                <e name="w" />
            </f>
        </a>
        <d name="y" />`;
        sourceObj = new DoenetSourceObject(source);
        expect(sourceObj.getAddressableNamesAtOffset(0)).toEqual([
            ["x"],
            ["z"],
            ["w"],
            ["x", "y"],
            ["x", "z"],
            ["x", "w"],
            ["x", "y", "z"],
        ]);
        // Cursor on `<a>`'s opening `<`: top-level scope (#1327).
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<a")),
        ).toEqual([
            ["x"],
            ["z"],
            ["w"],
            ["x", "y"],
            ["x", "z"],
            ["x", "w"],
            ["x", "y", "z"],
        ]);
        // Cursor *inside* `<a>`'s opening tag (past the `<`): `<a>`'s scope.
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<a") + 2),
        ).toEqual([
            ["y"],
            ["z"],
            ["w"],
            ["y", "z"],
            ["x"],
            ["x", "y"],
            ["x", "z"],
            ["x", "w"],
            ["x", "y", "z"],
        ]);
        // Cursor inside `<a>`'s body (on child `<b>`'s boundary): `<a>`'s scope.
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<b")),
        ).toEqual([
            ["y"],
            ["z"],
            ["w"],
            ["y", "z"],
            ["x"],
            ["x", "y"],
            ["x", "z"],
            ["x", "w"],
            ["x", "y", "z"],
        ]);
    });
});
