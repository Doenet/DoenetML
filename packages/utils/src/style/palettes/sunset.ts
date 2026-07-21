import type { StylePalette } from "./types";

/**
 * A warm-hued palette of reds, oranges, golds, and plums. Light-mode anchor
 * colors were tuned with a CVD-simulation + CIEDE2000 analysis so that no
 * two styles fall below dE 10 for typical vision; because the palette is
 * deliberately warm-only, red-green color vision deficiencies compress it
 * further, and the varied marker shapes and line styles carry the
 * distinction there (colorblind readers may prefer the `okabeito` palette,
 * whose hues are chosen for CVD separation).
 *
 * Dark-mode colors are pinned rather than derived: the automatic derivation
 * lightens every color to just past the contrast threshold, which flattens
 * the lightness ladder the light-mode anchors were tuned for. Each pinned
 * value keeps the style's hue, clears WCAG AA for text (4.5:1 on the dark
 * canvas), and restores the lightness spread (style 5's line color sits
 * between the graphic and text thresholds, so its text pin is a lighter
 * variant). `*Word` descriptors are derived at expansion time.
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
            lineColorDarkMode: "#ee7d96",
            markerColorDarkMode: "#ee7d96",
            fillColorDarkMode: "#ee7d96",
            textColorDarkMode: "#ee7d96",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            lineColor: "#b5520c",
            markerColor: "#b5520c",
            fillColor: "#b5520c",
            textColor: "#b5520c",
            highContrastColor: "#b5520c",
            lineColorDarkMode: "#f0913c",
            markerColorDarkMode: "#f0913c",
            fillColorDarkMode: "#f0913c",
            textColorDarkMode: "#f0913c",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            lineColor: "#6a5607",
            markerColor: "#6a5607",
            fillColor: "#6a5607",
            textColor: "#6a5607",
            highContrastColor: "#6a5607",
            lineColorDarkMode: "#e8c623",
            markerColorDarkMode: "#e8c623",
            fillColorDarkMode: "#e8c623",
            textColorDarkMode: "#e8c623",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#b01e8c",
            markerColor: "#b01e8c",
            fillColor: "#b01e8c",
            textColor: "#b01e8c",
            highContrastColor: "#b01e8c",
            lineColorDarkMode: "#e668c8",
            markerColorDarkMode: "#e668c8",
            fillColorDarkMode: "#e668c8",
            textColorDarkMode: "#e668c8",
            lineWidth: 2,
            markerStyle: "diamond",
        },
        5: {
            lineColor: "#7c2a13",
            markerColor: "#7c2a13",
            fillColor: "#7c2a13",
            textColor: "#7c2a13",
            highContrastColor: "#7c2a13",
            lineColorDarkMode: "#c84a28",
            markerColorDarkMode: "#c84a28",
            fillColorDarkMode: "#c84a28",
            textColorDarkMode: "#d45d3d",
            lineWidth: 2,
            markerStyle: "plus",
        },
        6: {
            lineColor: "#63307a",
            markerColor: "#63307a",
            fillColor: "#63307a",
            textColor: "#63307a",
            highContrastColor: "#63307a",
            lineColorDarkMode: "#c49add",
            markerColorDarkMode: "#c49add",
            fillColorDarkMode: "#c49add",
            textColorDarkMode: "#c49add",
            lineWidth: 2,
            markerStyle: "cross",
        },
        7: {
            lineColor: "#922d4d",
            markerColor: "#922d4d",
            fillColor: "#922d4d",
            textColor: "#922d4d",
            highContrastColor: "#922d4d",
            lineColorDarkMode: "#c75d7d",
            markerColorDarkMode: "#c75d7d",
            fillColorDarkMode: "#c75d7d",
            textColorDarkMode: "#c75d7d",
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
            lineColorDarkMode: "#a99d96",
            markerColorDarkMode: "#a99d96",
            fillColorDarkMode: "#a99d96",
            textColorDarkMode: "#a99d96",
            lineWidth: 1,
            lineStyle: "dotted",
            markerStyle: "square",
        },
    },
};
