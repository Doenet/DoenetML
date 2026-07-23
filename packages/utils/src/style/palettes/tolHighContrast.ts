import type { StylePalette } from "./types";

/**
 * Paul Tol's "high-contrast" qualitative palette
 * (https://personal.sron.nl/~pault/): only four styles, but with the largest
 * separation of any built-in palette — every pair stays above CIEDE2000
 * dE 14 under every simulated color vision deficiency, and the lightness
 * ladder keeps it legible even in pure grayscale. Dark mode rebuilds the
 * ladder rather than pinning canonical colors: blue just above the graphic
 * threshold, then red, then yellow, then white (black's inversion), so the
 * grayscale legibility carries over to the dark canvas.
 *
 * Light-mode anchors are the canonical colors wherever they meet Doenet's
 * contrast thresholds on white (3:1 as a graphic, 4.5:1 as text) and are
 * darkened chromaticity-preserving where they do not, with further-darkened
 * text variants where a graphic anchor sits below 4.5:1.
 * Verified with a Machado-model CVD simulation + CIEDE2000 analysis; marker
 * shapes and line widths vary across styles so distinctions never rest on
 * color alone.
 */
export const tolHighContrastPalette: StylePalette = {
    name: "tolhighcontrast",
    description:
        "Four maximum-distinction styles from Paul Tol's high-contrast palette, distinguishable even in grayscale.",
    styles: {
        1: {
            lineColor: "#004488",
            markerColor: "#004488",
            fillColor: "#004488",
            highContrastColor: "#004488",
            lineColorDarkMode: "#496194",
            markerColorDarkMode: "#496194",
            fillColorDarkMode: "#496194",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            lineColor: "#b88d29",
            markerColor: "#b88d29",
            fillColor: "#b88d29",
            textColor: "#92701f",
            highContrastColor: "#92701f",
            lineColorWord: "gold",
            markerColorWord: "gold",
            fillColorWord: "gold",
            textColorWord: "gold",
            highContrastColorWord: "gold",
            lineColorDarkMode: "#ddaa33",
            markerColorDarkMode: "#ddaa33",
            fillColorDarkMode: "#ddaa33",
            textColorDarkMode: "#ddaa33",
            lineColorWordDarkMode: "gold",
            markerColorWordDarkMode: "gold",
            fillColorWordDarkMode: "gold",
            textColorWordDarkMode: "gold",
            highContrastColorWordDarkMode: "gold",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            lineColor: "#bb5566",
            markerColor: "#bb5566",
            fillColor: "#bb5566",
            textColor: "#bb5566",
            highContrastColor: "#bb5566",
            lineColorDarkMode: "#c06976",
            markerColorDarkMode: "#c06976",
            fillColorDarkMode: "#c06976",
            textColorDarkMode: "#c06976",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#000000",
            markerColor: "#000000",
            fillColor: "#000000",
            textColor: "#000000",
            highContrastColor: "#000000",
            lineColorDarkMode: "#ffffff",
            markerColorDarkMode: "#ffffff",
            fillColorDarkMode: "#ffffff",
            textColorDarkMode: "#ffffff",
            lineWidth: 2,
            markerStyle: "diamond",
        },
    },
};
