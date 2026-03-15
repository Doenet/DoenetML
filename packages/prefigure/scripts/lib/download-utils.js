import fs from "fs";
import crypto from "crypto";

export async function fetchUrl(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} fetching ${url}`);
    }
    return res;
}

export async function downloadBuffer(url) {
    const res = await fetchUrl(url);
    return Buffer.from(await res.arrayBuffer());
}

export async function downloadToFile(url, destPath) {
    const buffer = await downloadBuffer(url);
    fs.writeFileSync(destPath, buffer);
    return buffer;
}

export function sha256hex(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}
