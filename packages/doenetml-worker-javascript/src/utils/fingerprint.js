/**
 * A short string standing for `x`, a math (by its tree), a text, or other
 * values JSON can write (a sampler's parameters, `drawnFromParameters`): the same
 * for equal values, and, but for a chance too small to matter (one in about
 * 2^53), different for different ones (`cyrb53`). `undefined` for
 * `undefined`.
 */
export function fingerprint(x) {
    if (x === undefined) {
        return undefined;
    }
    const text = JSON.stringify(x?.tree ?? x) ?? "";
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < text.length; i++) {
        const ch = text.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
