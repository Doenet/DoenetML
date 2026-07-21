import { describe, expect, it } from "vitest";
import {
    STYLE_PALETTE_NAMES,
    returnPaletteStyleDefinitions,
    getStyleValueString,
    styleAttributes,
    CANVAS_TEXT_LIGHT_MODE_COLOR,
    CANVAS_TEXT_DARK_MODE_COLOR,
} from "../src/style";

/**
 * Guards that no two styles of a registered palette have nearly
 * indistinguishable line colors, in either light or dark mode: every pair
 * must differ by at least CIEDE2000 dE 8 for typical color vision.
 *
 * This is a floor against accidental collisions (e.g. two blues drifting
 * together during a tweak), not a colorblindness guarantee. Distinctness
 * under color vision deficiencies is engineered per palette — the
 * `okabeito` palette is hue-selected for it, while `categorical` trades
 * CVD separation for the widest normal-vision spread and leans on its
 * marker shapes and line styles —
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

describe("palette high-contrast colors never collapse onto one value", () => {
    // `highContrastColor` is a style's own color at text-contrast strength —
    // what a style paints with where the graphic thresholds are too weak
    // (the `button` renderer fills with it today, and it is the color style
    // 1 keeps for text after the neutral-text rule below). Two styles
    // sharing one is the same failure as two styles sharing a line color.
    //
    // The dE floor above is deliberately not applied here: text-strength
    // variants of neighbouring hues legitimately sit closer together than
    // their graphic anchors do. What must never happen is an exact
    // collapse, and derivation makes that easy to trip into — a missing
    // `highContrastColorDarkMode` is derived by lightening the light-mode
    // color only as far as the 4.5:1 threshold on the dark canvas requires,
    // so every style whose color starts below that threshold derives to the
    // *same* minimum. That is how all four `grayscale` styles once shared
    // one dark-mode high-contrast gray while their `*Word` descriptors
    // still claimed four different grays.
    for (const paletteName of STYLE_PALETTE_NAMES) {
        for (const colorKey of [
            "highContrastColor",
            "highContrastColorDarkMode",
        ] as const) {
            it(`palette "${paletteName}" ${colorKey}`, () => {
                const styles = returnPaletteStyleDefinitions(paletteName);
                const colors = Object.keys(styles).map((styleNumber) =>
                    getStyleValueString(
                        styles[styleNumber],
                        colorKey,
                    )!.toLowerCase(),
                );
                expect(new Set(colors).size, colors.join(", ")).toBe(
                    colors.length,
                );
            });
        }
    }
});

describe("palette color words are unique per style", () => {
    // The color words feed the core-computed style descriptions; if two
    // styles of a palette share a word, descriptions cannot tell them apart.
    for (const paletteName of STYLE_PALETTE_NAMES) {
        for (const colorKey of [
            "lineColorWord",
            "lineColorWordDarkMode",
        ] as const) {
            it(`palette "${paletteName}" ${colorKey}`, () => {
                const styles = returnPaletteStyleDefinitions(paletteName);
                const words = Object.keys(styles).map((styleNumber) =>
                    getStyleValueString(styles[styleNumber], colorKey)!,
                );
                expect(new Set(words).size, words.join(", ")).toBe(
                    words.length,
                );
            });
        }
    }
});

describe("palette color words agree across keys describing the same color", () => {
    // Words are pinned per key, because the hex-to-word matcher runs on each
    // color key independently (issue #1527). Pinning a hue on `lineColorWord`
    // but forgetting `markerColorWord` leaves one style describing its lines
    // and its markers by different names even though they are the same color.
    const COLOR_KEYS = [
        "lineColor",
        "markerColor",
        "fillColor",
        "textColor",
        "highContrastColor",
    ] as const;

    for (const paletteName of STYLE_PALETTE_NAMES) {
        for (const suffix of ["", "DarkMode"] as const) {
            it(`palette "${paletteName}"${suffix ? " dark mode" : ""}`, () => {
                const styles = returnPaletteStyleDefinitions(paletteName);
                for (const [styleNumber, styleDef] of Object.entries(styles)) {
                    const wordByColor = new Map<string, [string, string]>();
                    for (const colorKey of COLOR_KEYS) {
                        const color = getStyleValueString(
                            styleDef,
                            `${colorKey}${suffix}`,
                        )?.toLowerCase();
                        const word = getStyleValueString(
                            styleDef,
                            `${colorKey}Word${suffix}`,
                        );
                        if (!color || !word) {
                            continue;
                        }
                        const seen = wordByColor.get(color);
                        if (seen) {
                            expect(
                                word,
                                `${paletteName} style ${styleNumber}: ${colorKey}${suffix} and ${seen[0]}${suffix} are both ${color} but are described as "${word}" and "${seen[1]}"`,
                            ).toBe(seen[1]);
                        } else {
                            wordByColor.set(color, [colorKey, word]);
                        }
                    }
                }
            });
        }
    }
});

describe("palettes have at least four styles", () => {
    // Documentation tells authors to reserve style numbers 1-4 for their
    // most important distinctions because every palette guarantees at least
    // four styles (readers may end up on a four-style palette such as
    // grayscale, onto which higher numbers wrap).
    for (const paletteName of STYLE_PALETTE_NAMES) {
        it(`palette "${paletteName}"`, () => {
            const styles = returnPaletteStyleDefinitions(paletteName);
            expect(Object.keys(styles).length).toBeGreaterThanOrEqual(4);
        });
    }
});

describe("palette enum-valued keys reach renderers normalized", () => {
    // Authored `<styleDefinition markerStyle="triangleDown">` values are
    // lowercased on their way to a renderer (the attribute specs below set
    // `toLowerCase: true`), and renderers pass them straight to JSXGraph,
    // whose face/dash names are all lowercase. Palette data does not travel
    // the attribute path, so expansion must apply the same normalization —
    // otherwise a camelCase palette value reaches JSXGraph as an unknown
    // face name and the object silently renders INVISIBLE.
    const ENUM_KEYS = ["markerStyle", "lineStyle", "fillStyle"] as const;

    for (const paletteName of STYLE_PALETTE_NAMES) {
        it(`palette "${paletteName}"`, () => {
            const styles = returnPaletteStyleDefinitions(paletteName);
            for (const [styleNumber, styleDef] of Object.entries(styles)) {
                for (const key of ENUM_KEYS) {
                    const value = getStyleValueString(styleDef, key);
                    if (!value) {
                        continue;
                    }
                    const spec = styleAttributes[key];
                    const validValues = spec.validValues!.map((v) =>
                        typeof v === "string" ? v : v.value,
                    );
                    // Names a real value (case-insensitively)...
                    expect(
                        validValues.map((v) => v.toLowerCase()),
                        `${paletteName} style ${styleNumber} ${key}="${value}"`,
                    ).toContain(value.toLowerCase());
                    // ...and arrives in the case the renderer requires.
                    if (spec.toLowerCase) {
                        expect(
                            value,
                            `${paletteName} style ${styleNumber} ${key} must reach the renderer lowercased`,
                        ).toBe(value.toLowerCase());
                    }
                }
            }
        });
    }
});

describe("style 1 renders text in the canvas text color", () => {
    // Content that specifies no style number falls on style 1, and text or
    // math outside a graph renders with `selectedStyle.textColor`. If a
    // palette painted style 1's text, selecting that palette would recolor
    // every unstyled `<text>` and `<m>` in the document, so expansion forces
    // it neutral. A style's own color stays reachable for text through
    // `highContrastColor`, which the rule leaves alone — pinned below.
    for (const paletteName of STYLE_PALETTE_NAMES) {
        it(`palette "${paletteName}"`, () => {
            const styleOne = returnPaletteStyleDefinitions(paletteName)["1"];

            expect(getStyleValueString(styleOne, "textColor")).toBe(
                CANVAS_TEXT_LIGHT_MODE_COLOR,
            );
            expect(getStyleValueString(styleOne, "textColorDarkMode")).toBe(
                CANVAS_TEXT_DARK_MODE_COLOR,
            );
            // Descriptions must describe the neutral color, not whatever the
            // palette originally authored.
            expect(getStyleValueString(styleOne, "textColorWord")).toBe(
                CANVAS_TEXT_LIGHT_MODE_COLOR,
            );
            expect(getStyleValueString(styleOne, "textColorWordDarkMode")).toBe(
                CANVAS_TEXT_DARK_MODE_COLOR,
            );

            // The style keeps its own identity everywhere else.
            expect(
                getStyleValueString(styleOne, "highContrastColor"),
            ).toBeTruthy();
            expect(getStyleValueString(styleOne, "lineColor")).toBeTruthy();
        });
    }

    it("leaves styles 2 and up painting their own text", () => {
        // Only style 1 is the implicit landing spot; marked styles keep
        // coloring text so `<text styleNumber="2">` still works.
        const styles = returnPaletteStyleDefinitions("categorical");
        expect(getStyleValueString(styles["2"], "textColor")).not.toBe(
            CANVAS_TEXT_LIGHT_MODE_COLOR,
        );
    });
});
