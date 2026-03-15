import fs from "fs";
import crypto from "crypto";

export async function fetchUrl(url: string): Promise<Response> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} fetching ${url}`);
    }
    return res;
}

export async function downloadBuffer(url: string): Promise<Buffer> {
    const res = await fetchUrl(url);
    return Buffer.from(await res.arrayBuffer());
}

export async function downloadToFile(
    url: string,
    destPath: string,
): Promise<Buffer> {
    const buffer = await downloadBuffer(url);
    fs.writeFileSync(destPath, buffer);
    return buffer;
}

export function sha256hex(buffer: Uint8Array): string {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}
