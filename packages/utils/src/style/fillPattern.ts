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
 * Encode an arbitrary CSS color string into a lowercase hex token that is safe
 * to embed in SVG pattern IDs.
 */
export function encodeFillPatternColorToken(color: string): string {
    const normalizedColor = color.trim().toLowerCase();
    return bytesToHex(new TextEncoder().encode(normalizedColor));
}

/**
 * Decode a color token produced by `encodeFillPatternColorToken`.
 */
export function decodeFillPatternColorToken(token: string): string | null {
    const bytes = hexToBytes(token);
    if (!bytes) {
        return null;
    }

    try {
        return new TextDecoder().decode(bytes);
    } catch {
        return null;
    }
}
