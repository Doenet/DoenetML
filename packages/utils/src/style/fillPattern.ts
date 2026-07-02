export type FillPatternDef = {
    width: number;
    height: number;
    path: string;
    useFill?: boolean;
    strokeWidth?: number;
    strokeLinecap?: string;
};

export const FILL_PATTERN_DEFS: Record<string, FillPatternDef> = {
    horizontal: { width: 8, height: 8, path: "M0,4 L8,4" },
    vertical: { width: 8, height: 8, path: "M4,0 L4,8" },
    diagonal: {
        width: 12,
        height: 12,
        path: "M0,6 L6,0 M6,12 L12,6",
        strokeLinecap: "round",
    },
    backdiagonal: {
        width: 12,
        height: 12,
        path: "M0,6 L6,12 M6,0 L12,6",
        strokeLinecap: "round",
    },
    dots: {
        width: 18,
        height: 31,
        path: "M4.5,7.75 L4.5,7.75 M13.5,23.25 L13.5,23.25",
        strokeWidth: 4,
        strokeLinecap: "round",
    },
    diamonds: {
        width: 12,
        height: 21,
        path: "M6,5.5 L9,10.5 L6,15.5 L3,10.5 Z  M0,0 L3,0 L0,5 Z  M12,0 L9,0 L12,5 Z  M0,21 L3,21 L0,16 Z  M12,21 L9,21 L12,16 Z",
        useFill: true,
    },
};

export const DEPRECATED_FILL_STYLE_ALIASES = {
    crosshatch: "dots",
    diagonalcrosshatch: "diamonds",
} as const;

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

export function normalizeFillStyle(fillStyle: string): string {
    return fillStyle.trim().toLowerCase();
}

export function resolveDeprecatedFillStyleAlias(fillStyle: string): string {
    const normalizedFillStyle = normalizeFillStyle(fillStyle);
    return (
        DEPRECATED_FILL_STYLE_ALIASES[
            normalizedFillStyle as keyof typeof DEPRECATED_FILL_STYLE_ALIASES
        ] ?? normalizedFillStyle
    );
}

export function isDeprecatedFillStyleAlias(fillStyle: string): boolean {
    const normalizedFillStyle = normalizeFillStyle(fillStyle);
    return normalizedFillStyle in DEPRECATED_FILL_STYLE_ALIASES;
}

export function getFillPatternDef(fillStyle: string): FillPatternDef | null {
    const resolvedFillStyle = resolveDeprecatedFillStyleAlias(fillStyle);
    return FILL_PATTERN_DEFS[resolvedFillStyle] ?? null;
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
