import type { StylePalette } from "./types";

/**
 * A warm-hued palette of reds, oranges, golds, and plums, authored compactly:
 * only light-mode anchor colors plus explicit `textColorDarkMode` values (the
 * lightness-inversion derivation for text falls short of WCAG AA for some of
 * these hues, so each style pins a value derived at the 4.5:1 text threshold).
 * All other dark-mode colors and `*Word` descriptors are derived at expansion
 * time. Marker shapes and line styles vary across styles so distinctions
 * don't rest on color alone.
 */
export const sunsetPalette: StylePalette = {
    name: "sunset",
    description:
        "Warm reds, oranges, golds, and plums with varied marker shapes and line styles.",
    styles: {
        1: {
            lineColor: "#c22047",
            markerColor: "#c22047",
            fillColor: "#c22047",
            textColor: "#c22047",
            highContrastColor: "#c22047",
            textColorDarkMode: "#e04267",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            lineColor: "#a34a0b",
            markerColor: "#a34a0b",
            fillColor: "#a34a0b",
            textColor: "#a34a0b",
            highContrastColor: "#a34a0b",
            textColorDarkMode: "#cd5e0e",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            lineColor: "#756008",
            markerColor: "#756008",
            fillColor: "#756008",
            textColor: "#756008",
            highContrastColor: "#756008",
            textColorDarkMode: "#997c0b",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#b01e8c",
            markerColor: "#b01e8c",
            fillColor: "#b01e8c",
            textColor: "#b01e8c",
            highContrastColor: "#b01e8c",
            textColorDarkMode: "#dc2eb0",
            lineWidth: 2,
            markerStyle: "diamond",
        },
        5: {
            lineColor: "#9c3518",
            markerColor: "#9c3518",
            fillColor: "#9c3518",
            textColor: "#9c3518",
            highContrastColor: "#9c3518",
            textColorDarkMode: "#dd4b22",
            lineWidth: 2,
            markerStyle: "plus",
        },
        6: {
            lineColor: "#7d3c98",
            markerColor: "#7d3c98",
            fillColor: "#7d3c98",
            textColor: "#7d3c98",
            highContrastColor: "#7d3c98",
            textColorDarkMode: "#a462c0",
            lineWidth: 2,
            markerStyle: "cross",
        },
        7: {
            lineColor: "#ad3a5e",
            markerColor: "#ad3a5e",
            fillColor: "#ad3a5e",
            textColor: "#ad3a5e",
            highContrastColor: "#ad3a5e",
            textColorDarkMode: "#c7577a",
            lineWidth: 3,
            lineStyle: "dashed",
            markerStyle: "circle",
        },
        8: {
            lineColor: "#6d625c",
            markerColor: "#6d625c",
            fillColor: "#6d625c",
            textColor: "#6d625c",
            highContrastColor: "#6d625c",
            textColorDarkMode: "#877a73",
            lineWidth: 1,
            lineStyle: "dotted",
            markerStyle: "square",
        },
    },
};
