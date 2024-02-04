import { describe, expect, it } from "vitest";
import util from "util";

import { DastMacro, DastElement, DastMacroV6 } from "@doenet/parser";
import { DoenetSourceObject, isOldMacro } from "../src/doenet-source-object";
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
        let macro: DastMacroV6;

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
                .children[0] as any as DastMacroV6;
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "b" });
        }
        {
            let offset = source.indexOf("<d") + 1;
            macro = new DoenetSourceObject("$x.y.w").dast
                .children[0] as any as DastMacroV6;
            let elm = sourceObj.getMacroReferentAtOffset(offset, macro);
            expect(elm?.node).toMatchObject({ type: "element", name: "b" });
            expect(elm?.accessedProp).toMatchObject(
                macro.accessedProp!.accessedProp!,
            );
        }
        {
            let offset = source.indexOf("<d") + 1;
            macro = new DoenetSourceObject("$x.y.z").dast
                .children[0] as any as DastMacroV6;
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
        macro = sourceObj.dast.children[0] as any as DastMacro;
        expect(isOldMacro(macro)).toEqual(false);

        source = `$(foo.bar[2].baz)`;
        sourceObj = new DoenetSourceObject(source);
        macro = sourceObj.dast.children[0] as any as DastMacro;
        expect(isOldMacro(macro)).toEqual(false);

        source = `$(foo/x.bar[2].baz)`;
        sourceObj = new DoenetSourceObject(source);
        macro = sourceObj.dast.children[0] as any as DastMacro;
        expect(isOldMacro(macro)).toEqual(true);
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
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<a")),
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
        expect(
            sourceObj.getAddressableNamesAtOffset(source.indexOf("<a")),
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
