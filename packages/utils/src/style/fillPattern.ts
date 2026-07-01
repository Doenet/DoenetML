function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
        "",
    );
}

function hexToBytes(hex: string): Uint8Array | null {
    if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
        return null;
    }

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}

/**
 * Encode an arbitrary CSS color string into a hex token that is safe
 * to embed in SVG pattern IDs (only `trim()` is applied — the original
 * case is preserved so CSS custom properties like `var(--MyColor)` round-trip
 * correctly when the token is decoded back to the stroke color).
 */
export function encodeFillPatternColorToken(color: string): string {
    return bytesToHex(new TextEncoder().encode(color.trim()));
}

/**
 * Decode a color token produced by `encodeFillPatternColorToken`.
 * Returns `null` for tokens that are not valid hex or do not decode to
 * valid UTF-8.
 */
export function decodeFillPatternColorToken(token: string): string | null {
    const bytes = hexToBytes(token);
    if (!bytes) {
        return null;
    }

    try {
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
        return null;
    }
}
