import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import { normalizeDocumentDast } from "../src/dast-normalize/normalize-dast";
import { encodeBinaryDast } from "../src";

/**
 * Read back the arrays of a CDST buffer, following the layout documented on
 * `encodeBinaryDast`.
 */
function decode(bytes: Uint8Array) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let pos = 4;
    function u32() {
        const v = dv.getUint32(pos, true);
        pos += 4;
        return v;
    }
    function u32s(n: number) {
        return Array.from({ length: n }, u32);
    }
    function pad4(n: number) {
        return (n + 3) & ~3;
    }
    const magic = new TextDecoder().decode(bytes.subarray(0, 4));
    const version = u32();
    const [nStrings, stringBytes, nNodes, nAttrs, nChildren, nPath, nIndex] =
        u32s(7);
    const offsets = u32s(nStrings + 1);
    // Offsets are in bytes, so decode each string's bytes on their own.
    const strings = offsets
        .slice(0, -1)
        .map((o, i) =>
            new TextDecoder().decode(
                bytes.subarray(pos + o, pos + offsets[i + 1]),
            ),
        );
    pos = pad4(pos + stringBytes);
    const kind = Array.from(bytes.subarray(pos, pos + nNodes));
    pos = pad4(pos + nNodes);
    const [str, attrStart, attrCount, childStart, childCount] = [
        u32s(nNodes),
        u32s(nNodes),
        u32s(nNodes),
        u32s(nNodes),
        u32s(nNodes),
    ];
    const [attrName, attrChildStart, attrChildCount] = [
        u32s(nAttrs),
        u32s(nAttrs),
        u32s(nAttrs),
    ];
    const children = u32s(nChildren);
    const [path, pathIndexStart, pathIndexCount] = [
        u32s(nPath),
        u32s(nPath),
        u32s(nPath),
    ];
    const [indexChildStart, indexChildCount] = [u32s(nIndex), u32s(nIndex)];
    return {
        magic,
        version,
        consumed: pos,
        strings,
        kind,
        str,
        attrStart,
        attrCount,
        childStart,
        childCount,
        attrName,
        attrChildStart,
        attrChildCount,
        children,
        path,
        pathIndexStart,
        pathIndexCount,
        indexChildStart,
        indexChildCount,
    };
}

function encode(source: string) {
    return encodeBinaryDast(normalizeDocumentDast(lezerToDast(source)));
}

describe("encodeBinaryDast", () => {
    it("writes the header and fills the buffer exactly", () => {
        const bytes = encode(`<p>hi</p>`);
        const d = decode(bytes);
        expect(d.magic).toBe("CDST");
        expect(d.version).toBe(2);
        expect(d.consumed).toBe(bytes.byteLength);
    });

    it("encodes elements, attributes and text", () => {
        const d = decode(encode(`<point name="P" x="1">é</point>`));
        // Node 0 is the synthetic root; its only child is <document>.
        expect(d.kind[0]).toBe(0);
        expect(d.childCount[0]).toBe(1);
        const doc = d.children[d.childStart[0]];
        expect(d.strings[d.str[doc]]).toBe("document");
        const point = d.children[d.childStart[doc]];
        expect(d.kind[point]).toBe(0);
        expect(d.strings[d.str[point]]).toBe("point");

        const attrs = Object.fromEntries(
            Array.from({ length: d.attrCount[point] }, (_, i) => {
                const a = d.attrStart[point] + i;
                const kids = d.children.slice(
                    d.attrChildStart[a],
                    d.attrChildStart[a] + d.attrChildCount[a],
                );
                return [
                    d.strings[d.attrName[a]],
                    kids.map((k) => d.strings[d.str[k]]),
                ];
            }),
        );
        expect(attrs).toEqual({ name: ["P"], x: ["1"] });

        expect(d.childCount[point]).toBe(1);
        const text = d.children[d.childStart[point]];
        expect(d.kind[text]).toBe(1);
        expect(d.strings[d.str[text]]).toBe("é");
    });

    it("encodes a macro's path parts and index expressions", () => {
        const d = decode(encode(`<p>$r[2].x</p>`));
        const macro = d.kind.indexOf(2);
        expect(macro).toBeGreaterThan(0);
        const parts = Array.from(
            { length: d.attrCount[macro] },
            (_, i) => d.attrStart[macro] + i,
        );
        expect(parts.map((p) => d.strings[d.path[p]])).toEqual(["r", "x"]);
        expect(parts.map((p) => d.pathIndexCount[p])).toEqual([1, 0]);

        const index = d.pathIndexStart[parts[0]];
        const value = d.children.slice(
            d.indexChildStart[index],
            d.indexChildStart[index] + d.indexChildCount[index],
        );
        expect(value.map((k) => d.kind[k])).toEqual([1]);
        expect(d.strings[d.str[value[0]]]).toBe("2");
    });
});
