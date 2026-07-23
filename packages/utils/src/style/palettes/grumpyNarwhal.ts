import type { StylePalette } from "./types";

/**
 * A high-energy palette of six saturated hues — burnt orange, forest green,
 * deep pink, arctic teal, blowhole gold, and tusk purple — that swap for
 * their neon counterparts in dark mode. Contributed as a CSS custom-property
 * set; the accent colors became the six styles, while the palette's own
 * background and body-text colors were dropped: Doenet owns the canvas, and
 * style 1's text is always the canvas text color (so a palette never
 * recolors unstyled prose).
 *
 * The source rated its colors against its own `#F5F5F5` / `#0D0D0D`
 * canvases. Doenet's canvases are `#ffffff` and `#121212`, so the ratios
 * shift slightly: every light color still clears the 4.5:1 text threshold,
 * but dark-mode purple lands at 4.07:1 — fine as a graphic (3:1) yet short
 * for text — so its text variant is lightened to `#b445ff` (4.7:1) while
 * lines and markers keep the contributed `#B026FF`.
 *
 * Like `categorical`, this palette is NOT engineered for color vision
 * deficiency: its orange, green, and gold collapse together under
 * red-green CVD (dE ~1-2). Marker shapes and line widths vary across all
 * six styles so the distinctions never rest on color alone, and a reader
 * who needs different colors can override the palette. Prefer a
 * colorblind-friendly palette when the choice is yours.
 */
export const grumpyNarwhalPalette: StylePalette = {
    name: "grumpynarwhal",
    description:
        "Six saturated hues — burnt orange, forest green, deep pink, arctic teal, gold, and purple — going neon in dark mode.",
    styles: {
        1: {
            lineColor: "#b34700",
            markerColor: "#b34700",
            fillColor: "#b34700",
            highContrastColor: "#b34700",
            lineColorDarkMode: "#ff5f00",
            markerColorDarkMode: "#ff5f00",
            fillColorDarkMode: "#ff5f00",
            lineColorWordDarkMode: "orange",
            markerColorWordDarkMode: "orange",
            fillColorWordDarkMode: "orange",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            lineColor: "#1b7a1b",
            markerColor: "#1b7a1b",
            fillColor: "#1b7a1b",
            textColor: "#1b7a1b",
            highContrastColor: "#1b7a1b",
            lineColorDarkMode: "#39ff14",
            markerColorDarkMode: "#39ff14",
            fillColorDarkMode: "#39ff14",
            textColorDarkMode: "#39ff14",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            lineColor: "#c20e67",
            markerColor: "#c20e67",
            fillColor: "#c20e67",
            textColor: "#c20e67",
            highContrastColor: "#c20e67",
            lineColorWord: "pink",
            markerColorWord: "pink",
            fillColorWord: "pink",
            textColorWord: "pink",
            highContrastColorWord: "pink",
            lineColorDarkMode: "#ff1493",
            markerColorDarkMode: "#ff1493",
            fillColorDarkMode: "#ff1493",
            textColorDarkMode: "#ff1493",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#007a8c",
            markerColor: "#007a8c",
            fillColor: "#007a8c",
            textColor: "#007a8c",
            highContrastColor: "#007a8c",
            lineColorWord: "teal",
            markerColorWord: "teal",
            fillColorWord: "teal",
            textColorWord: "teal",
            highContrastColorWord: "teal",
            lineColorDarkMode: "#00e5ff",
            markerColorDarkMode: "#00e5ff",
            fillColorDarkMode: "#00e5ff",
            textColorDarkMode: "#00e5ff",
            lineWidth: 2,
            markerStyle: "diamond",
        },
        5: {
            lineColor: "#8a6d00",
            markerColor: "#8a6d00",
            fillColor: "#8a6d00",
            textColor: "#8a6d00",
            highContrastColor: "#8a6d00",
            lineColorWord: "gold",
            markerColorWord: "gold",
            fillColorWord: "gold",
            textColorWord: "gold",
            highContrastColorWord: "gold",
            lineColorDarkMode: "#ffea00",
            markerColorDarkMode: "#ffea00",
            fillColorDarkMode: "#ffea00",
            textColorDarkMode: "#ffea00",
            lineWidth: 2,
            markerStyle: "triangleDown",
        },
        6: {
            // Contributed as the same purple in both modes; on Doenet's
            // lighter dark canvas that lands at 4.07:1, so the dark text
            // variant is lightened to clear 4.5:1 while lines and markers
            // keep the contributed color.
            lineColor: "#b026ff",
            markerColor: "#b026ff",
            fillColor: "#b026ff",
            textColor: "#b026ff",
            highContrastColor: "#b026ff",
            lineColorDarkMode: "#b026ff",
            markerColorDarkMode: "#b026ff",
            fillColorDarkMode: "#b026ff",
            textColorDarkMode: "#b445ff",
            highContrastColorDarkMode: "#b445ff",
            lineWidth: 2,
            markerStyle: "triangleLeft",
        },
    },
};
