import { describe, expect, it } from "vitest";
import {
    STYLE_PALETTE_NAMES,
    returnPaletteStyleDefinitions,
    getStyleValueString,
} from "../src/style";

/**
 * Guards that no two styles of a registered palette have nearly
 * indistinguishable line colors, in either light or dark mode: every pair
 * must differ by at least CIEDE2000 dE 8 for typical color vision.
 *
 * This is a floor against accidental collisions (e.g. two blues drifting
 * together during a tweak), not a colorblindness guarantee. Distinctness
 * under color vision deficiencies is engineered per palette — the
 * `okabeito` palette is hue-selected for it, while thematic palettes
 * (`ocean`, `sunset`) additionally vary marker shapes and line styles —
 * and was verified with a Machado-model CVD simulation when the palette
 * colors were chosen.
 */

const MIN_DELTA_E = 8;

function hexToRgb(hex: string): [number, number, number] {
    const named: Record<string, string> = {
        black: "#000000",
        white: "#ffffff",
    };
    const h = (named[hex.toLowerCase()] ?? hex).replace("#", "");
    return [
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255,
    ];
}

// sRGB -> Lab (D65)
function hexToLab(hex: string): [number, number, number] {
    const linearize = (v: number) =>
        v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    const [r, g, b] = hexToRgb(hex).map(linearize);
    const X = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
    const Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
    const Z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;
    const ref = [0.95047, 1.0, 1.08883];
    const f = (t: number) =>
        t > 0.008856 ? Math.cbrt(t) : (903.3 * t + 16) / 116;
    const [fx, fy, fz] = [X / ref[0], Y / ref[1], Z / ref[2]].map(f);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function ciede2000(
    [L1, a1, b1]: [number, number, number],
    [L2, a2, b2]: [number, number, number],
): number {
    const rad = Math.PI / 180;
    const C1 = Math.hypot(a1, b1);
    const C2 = Math.hypot(a2, b2);
    const Cbar = (C1 + C2) / 2;
    const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
    const a1p = (1 + G) * a1;
    const a2p = (1 + G) * a2;
    const C1p = Math.hypot(a1p, b1);
    const C2p = Math.hypot(a2p, b2);
    const h1p = C1p === 0 ? 0 : (Math.atan2(b1, a1p) / rad + 360) % 360;
    const h2p = C2p === 0 ? 0 : (Math.atan2(b2, a2p) / rad + 360) % 360;
    const dLp = L2 - L1;
    const dCp = C2p - C1p;
    let dhp = 0;
    if (C1p * C2p !== 0) {
        dhp = h2p - h1p;
        if (dhp > 180) dhp -= 360;
        else if (dhp < -180) dhp += 360;
    }
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
    const Lbp = (L1 + L2) / 2;
    const Cbp = (C1p + C2p) / 2;
    let hbp = h1p + h2p;
    if (C1p * C2p !== 0) {
        if (Math.abs(h1p - h2p) > 180) {
            hbp = h1p + h2p < 360 ? hbp + 360 : hbp - 360;
        }
        hbp /= 2;
    }
    const T =
        1 -
        0.17 * Math.cos((hbp - 30) * rad) +
        0.24 * Math.cos(2 * hbp * rad) +
        0.32 * Math.cos((3 * hbp + 6) * rad) -
        0.2 * Math.cos((4 * hbp - 63) * rad);
    const dTheta = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
    const RC = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
    const SL = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
    const SC = 1 + 0.045 * Cbp;
    const SH = 1 + 0.015 * Cbp * T;
    const RT = -Math.sin(2 * dTheta * rad) * RC;
    return Math.sqrt(
        (dLp / SL) ** 2 +
            (dCp / SC) ** 2 +
            (dHp / SH) ** 2 +
            RT * (dCp / SC) * (dHp / SH),
    );
}

describe("palette line colors are pairwise distinct", () => {
    for (const paletteName of STYLE_PALETTE_NAMES) {
        for (const colorKey of ["lineColor", "lineColorDarkMode"] as const) {
            it(`palette "${paletteName}" ${colorKey}`, () => {
                const styles = returnPaletteStyleDefinitions(paletteName);
                const labs = Object.keys(styles).map(
                    (styleNumber) =>
                        [
                            styleNumber,
                            hexToLab(
                                getStyleValueString(
                                    styles[styleNumber],
                                    colorKey,
                                )!,
                            ),
                        ] as const,
                );
                for (let i = 0; i < labs.length; i++) {
                    for (let j = i + 1; j < labs.length; j++) {
                        const dE = ciede2000(labs[i][1], labs[j][1]);
                        expect(
                            dE,
                            `${paletteName} ${colorKey}: styles ${labs[i][0]} and ${labs[j][0]} are too similar`,
                        ).toBeGreaterThanOrEqual(MIN_DELTA_E);
                    }
                }
            });
        }
    }
});
