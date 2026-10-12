import type {
    DastAttribute,
    DastElement,
    DastMacro,
    DastNodes,
    DastRoot,
    DastText,
} from "../types";

/**
 * Encode a normalized DAST into the compact binary wire format ("CDST") read
 * by the cells core (`Dast::from_binary` in
 * `packages/doenetml-worker-cells/crates/cells-core/src/dast/binary.rs`; the
 * format's rationale is that package's `docs/adr/0002-binary-wire-format.md`).
 * Little-endian:
 *
 *     "CDST" u32 version=2
 *     u32 nStrings, stringBytesLen, nNodes, nAttrs, nChildren, nPath, nIndex
 *     u32[nStrings+1] string offsets; u8[stringBytesLen] UTF-8 (padded to 4)
 *     u8[nNodes] kind (0 element, 1 text, 2 macro, 3 other) (padded to 4)
 *     u32[nNodes] str, attrStart, attrCount, childStart, childCount
 *     u32[nAttrs] name, childStart, childCount
 *     u32[nChildren] child node ids; u32[nPath] path part string ids
 *     u32[nPath] indexStart, indexCount (per path part, into the index arrays)
 *     u32[nIndex] childStart, childCount (per [index] expression, into children)
 *
 * Node 0 is a synthetic root element whose children are the top-level nodes.
 * Macros use attrStart/attrCount to index the path array. Version 2 added the
 * per-part index expressions (`$r[3].p`, `$r[$i-2]`).
 */
export function encodeBinaryDast(dast: DastRoot): Uint8Array {
    const strings: string[] = [];
    const intern = new Map<string, number>();
    function str(s: string) {
        let id = intern.get(s);
        if (id === undefined) {
            id = strings.length;
            strings.push(s);
            intern.set(s, id);
        }
        return id;
    }
    const kind: number[] = [];
    const nstr: number[] = [];
    const aStart: number[] = [];
    const aCount: number[] = [];
    const cStart: number[] = [];
    const cCount: number[] = [];
    const attrName: number[] = [];
    const attrCStart: number[] = [];
    const attrCCount: number[] = [];
    const children: number[] = [];
    const path: number[] = [];
    const pathIStart: number[] = [];
    const pathICount: number[] = [];
    const idxCStart: number[] = [];
    const idxCCount: number[] = [];

    function pushNode(k: number, s: number) {
        kind.push(k);
        nstr.push(s);
        aStart.push(0);
        aCount.push(0);
        cStart.push(0);
        cCount.push(0);
        return kind.length - 1;
    }
    function setChildren(id: number, kids: number[]) {
        cStart[id] = children.length;
        cCount[id] = kids.length;
        for (const k of kids) {
            children.push(k);
        }
    }
    function element(n: DastElement) {
        const id = pushNode(0, str(n.name ?? ""));
        const attrs: [string, DastAttribute][] = Object.entries(
            n.attributes ?? {},
        );
        // Encode children first so their ids exist, then record ranges.
        const attrKids = attrs.map(([, a]) => (a.children ?? []).map(node));
        const kids = (n.children ?? []).map(node);
        aStart[id] = attrName.length;
        aCount[id] = attrs.length;
        attrs.forEach(([name], i) => {
            attrName.push(str(name));
            attrCStart.push(children.length);
            attrCCount.push(attrKids[i].length);
            for (const k of attrKids[i]) {
                children.push(k);
            }
        });
        setChildren(id, kids);
        return id;
    }
    function macro(n: DastMacro) {
        // Index value nodes are encoded first so their ids exist.
        const parts = n.path.map((p) => ({
            name: str(p.name),
            indices: (p.index ?? []).map((ix) =>
                ((ix.value ?? []) as DastNodes[]).map(node),
            ),
        }));
        const id = pushNode(2, 0);
        aStart[id] = path.length;
        aCount[id] = parts.length;
        for (const p of parts) {
            path.push(p.name);
            pathIStart.push(idxCStart.length);
            pathICount.push(p.indices.length);
            for (const nodes of p.indices) {
                idxCStart.push(children.length);
                idxCCount.push(nodes.length);
                for (const k of nodes) {
                    children.push(k);
                }
            }
        }
        return id;
    }
    function node(n: DastNodes): number {
        switch (n.type) {
            case "element":
                return element(n);
            case "text":
                return pushNode(1, str((n as DastText).value ?? ""));
            case "macro":
                return macro(n);
            default:
                return pushNode(3, 0);
        }
    }
    const root = pushNode(0, str(""));
    setChildren(root, (dast.children ?? []).map(node));

    const enc = new TextEncoder();
    const encoded = strings.map((s) => enc.encode(s));
    const offsets = new Uint32Array(strings.length + 1);
    let total = 0;
    encoded.forEach((b, i) => {
        offsets[i] = total;
        total += b.length;
    });
    offsets[strings.length] = total;
    function pad4(n: number) {
        return (n + 3) & ~3;
    }
    const n = kind.length;
    const size =
        8 +
        7 * 4 +
        offsets.byteLength +
        pad4(total) +
        pad4(n) +
        n * 4 * 5 +
        attrName.length * 4 * 3 +
        children.length * 4 +
        path.length * 4 * 3 +
        idxCStart.length * 4 * 2;
    const buf = new ArrayBuffer(size);
    const dv = new DataView(buf);
    const u8 = new Uint8Array(buf);
    let pos = 0;
    u8.set([0x43, 0x44, 0x53, 0x54], 0); // "CDST"
    pos = 4;
    for (const v of [
        2,
        strings.length,
        total,
        n,
        attrName.length,
        children.length,
        path.length,
        idxCStart.length,
    ]) {
        dv.setUint32(pos, v, true);
        pos += 4;
    }
    function putU32s(arr: ArrayLike<number>) {
        for (let i = 0; i < arr.length; i++) {
            dv.setUint32(pos, arr[i], true);
            pos += 4;
        }
    }
    putU32s(offsets);
    for (const b of encoded) {
        u8.set(b, pos);
        pos += b.length;
    }
    pos = pad4(pos);
    u8.set(kind, pos);
    pos = pad4(pos + n);
    for (const arr of [
        nstr,
        aStart,
        aCount,
        cStart,
        cCount,
        attrName,
        attrCStart,
        attrCCount,
        children,
        path,
        pathIStart,
        pathICount,
        idxCStart,
        idxCCount,
    ]) {
        putU32s(arr);
    }
    return u8;
}
