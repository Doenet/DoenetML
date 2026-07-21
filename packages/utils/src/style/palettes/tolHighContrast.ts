import type { StylePalette } from "./types";

/**
 * Paul Tol's "high-contrast" qualitative palette
 * (https://personal.sron.nl/~pault/): only four styles, but with the largest
 * separation of any built-in palette — every pair stays above CIEDE2000
 * dE 14 under every simulated color vision deficiency, and the lightness
 * ladder keeps it legible even in pure grayscale. *
 * Light-mode anchors are the canonical colors wherever they meet Doenet's
 * contrast thresholds on white (3:1 as a graphic, 4.5:1 as text) and are
 * darkened chromaticity-preserving where they do not, with further-darkened
 * text variants where a graphic anchor sits below 4.5:1. Dark mode pins the
 * canonical colors wherever they clear the thresholds on the dark canvas.
 * Verified with a Machado-model CVD simulation + CIEDE2000 analysis; marker
 * shapes and line styles vary across styles so distinctions never rest on
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
            textColor: "#004488",
            highContrastColor: "#004488",
            lineColorWord: "blue",
            markerColorWord: "blue",
            fillColorWord: "blue",
            textColorWord: "blue",
            highContrastColorWord: "blue",
            lineColorDarkMode: "#496194",
            markerColorDarkMode: "#496194",
            fillColorDarkMode: "#496194",
            textColorDarkMode: "#6f7ea3",
            lineColorWordDarkMode: "blue",
            markerColorWordDarkMode: "blue",
            fillColorWordDarkMode: "blue",
            textColorWordDarkMode: "blue",
            highContrastColorWordDarkMode: "blue",
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
            lineColorDarkMode: "#bb5566",
            markerColorDarkMode: "#bb5566",
            fillColorDarkMode: "#bb5566",
            textColorDarkMode: "#be6270",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#000000",
            markerColor: "#000000",
            fillColor: "#000000",
            textColor: "#000000",
            highContrastColor: "#000000",
            lineColorDarkMode: "#a6a6a6",
            markerColorDarkMode: "#a6a6a6",
            fillColorDarkMode: "#a6a6a6",
            textColorDarkMode: "#a6a6a6",
            lineWidth: 2,
            markerStyle: "diamond",
        },
    },
};
