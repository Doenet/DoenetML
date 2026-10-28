// Encode a normalized DAST (from @doenet/parser) into the compact binary
// wire format read by cells-core (`Dast::from_binary`). Little-endian.
//
//   "CDST" u32 version=2
//   u32 nStrings, stringBytesLen, nNodes, nAttrs, nChildren, nPath, nIndex
//   u32[nStrings+1] string offsets; u8[stringBytesLen] UTF-8 (padded to 4)
//   u8[nNodes] kind (0 element, 1 text, 2 macro, 3 other) (padded to 4)
//   u32[nNodes] str, attrStart, attrCount, childStart, childCount
//   u32[nAttrs] name, childStart, childCount
//   u32[nChildren] child node ids; u32[nPath] path part string ids
//   u32[nPath] indexStart, indexCount (per path part, into the index arrays)
//   u32[nIndex] childStart, childCount (per [index] expression, into children)
//
// Node 0 is a synthetic root element whose children are the top-level nodes.
// Macros use attrStart/attrCount to index the path array. Version 2 added
// the per-part index expressions (`$r[3].p`, `$r[$i-2]`).
//
// Each node is numbered after its contents (the root first) and strings are
// interned in document order (an element's name, then each attribute's name
// and children, then its children), exactly as `Dast::from_json` does, so
// the two encoders produce identical bytes for one source
// (`crates/cells-core/tests/wire.rs`). Node ids feed `<select>`'s choice, so
// the numbering is part of a document's behaviour.

export function encodeDast(dast) {
    const strings = [];
    const intern = new Map();
    const str = (s) => {
        let id = intern.get(s);
        if (id === undefined) {
            id = strings.length;
            strings.push(s);
            intern.set(s, id);
        }
        return id;
    };
    const kind = [],
        nstr = [],
        aStart = [],
        aCount = [],
        cStart = [],
        cCount = [];
    const attrName = [],
        attrCStart = [],
        attrCCount = [];
    const children = [],
        path = [],
        pathIStart = [],
        pathICount = [],
        idxCStart = [],
        idxCCount = [];

    function pushNode(k, s) {
        kind.push(k);
        nstr.push(s);
        aStart.push(0);
        aCount.push(0);
        cStart.push(0);
        cCount.push(0);
        return kind.length - 1;
    }
    function setChildren(id, kids) {
        cStart[id] = children.length;
        cCount[id] = kids.length;
        for (const k of kids) children.push(k);
    }
    function node(n) {
        switch (n.type) {
            case "element": {
                // The element's name, then each attribute's name and children, then
                // its children, and the element itself last (its id after theirs);
                // the attribute ranges are recorded after the recursion so each
                // element's attributes stay contiguous.
                const name = str(n.name ?? "");
                const attrs = Object.entries(n.attributes ?? {}).map(
                    ([name, a]) => [str(name), (a.children ?? []).map(node)],
                );
                const kids = (n.children ?? []).map(node);
                const id = pushNode(0, name);
                aStart[id] = attrName.length;
                aCount[id] = attrs.length;
                for (const [name, attrKids] of attrs) {
                    attrName.push(name);
                    attrCStart.push(children.length);
                    attrCCount.push(attrKids.length);
                    for (const k of attrKids) children.push(k);
                }
                setChildren(id, kids);
                return id;
            }
            case "text":
                return pushNode(1, str(n.value ?? ""));
            case "macro": {
                // Index value nodes first, the macro itself last.
                const parts = n.path.map((p) => ({
                    name: str(p.name),
                    indices: (p.index ?? []).map((ix) =>
                        (ix.value ?? []).map(node),
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
                        for (const k of nodes) children.push(k);
                    }
                }
                return id;
            }
            default: {
                // Other nodes carry no string, but `Dast::from_json` interns any
                // `name` or `value` it meets, so the tables stay identical.
                if (typeof n.name === "string") str(n.name);
                if (typeof n.value === "string") str(n.value);
                return pushNode(3, 0);
            }
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
    const pad4 = (n) => (n + 3) & ~3;
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
    u8.set([0x43, 0x44, 0x53, 0x54], 0);
    pos = 4; // "CDST"
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
    const putU32s = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            dv.setUint32(pos, arr[i], true);
            pos += 4;
        }
    };
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
    ])
        putU32s(arr);
    return u8;
}
