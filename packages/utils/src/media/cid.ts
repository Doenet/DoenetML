import base32 from "hi-base32";

export async function cidFromText(text: string) {
    let encoder = new TextEncoder();
    let data = encoder.encode(text);

    return await cidFromArrayBuffer(data);
}

// Digest is set lazily. Since crpto.subtle is not available in `http` mode,
// we fall back to a polyfill in that case
let digest:
    ((data: BufferSource) => Promise<ArrayBuffer> | Array<number>) | null =
    null;

export async function cidFromArrayBuffer(data: BufferSource) {
    if (!digest) {
        try {
            await crypto.subtle.digest("SHA-256", new Uint8Array());
            digest = (data: BufferSource) =>
                crypto.subtle.digest("SHA-256", data);
        } catch (e) {
            // Fallback to a polyfill or alternative implementation if needed
            const sha256 = (await import("sha256")).default;
            digest = (data: BufferSource) =>
                sha256(data as Buffer, {
                    asBytes: true,
                });
        }
    }
    let hashBuffer = await digest(data);

    let cidArray = new Uint8Array(36);

    // 0x01: cidV1
    // 0x55: raw binary IPLD
    // 0x12: code for SHA256
    // 0x20: 32 bytes (or 256 bits)
    cidArray.set([0x01, 0x55, 0x12, 0x20]);

    cidArray.set(new Uint8Array(hashBuffer), 4);

    // b: prefix for base 32
    // base32: hi-base uses RFC 4648 encoding
    // cid uses lowercase letter and does not include the padding at the end
    let cid = "b" + base32.encode(cidArray).toLowerCase().replace(/=+/, "");

    return cid;
}
