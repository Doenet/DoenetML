import type { StylePalette } from "./types";

/**
 * A colorblind-friendly palette based on the Okabe–Ito palette (Masataka
 * Okabe & Kei Ito, "Color Universal Design", 2008), whose eight colors were
 * chosen to remain distinguishable under the common forms of color vision
 * deficiency (protanopia, deuteranopia, tritanopia).
 *
 * Doenet requires every light-mode anchor to meet WCAG contrast on a white
 * canvas (3:1 as a graphic, 4.5:1 as text), which most canonical Okabe–Ito
 * colors do not. Light mode therefore adapts them: each color is darkened
 * chromaticity-preserving (scaled in linear RGB) only as far as its
 * threshold requires — blue, bluish green, and reddish purple survive
 * (nearly) verbatim, sky blue and orange are moderately darkened, yellow
 * becomes a dark olive, and where a graphic anchor sits below 4.5:1 a
 * further-darkened variant of the same hue serves as the text color.
 * Lightness targets were staggered (olive < vermillion < orange) because
 * red-green CVD collapses those hues onto the same yellow axis, leaving
 * lightness as the distinguishing channel.
 *
 * Dark mode pins the CANONICAL Okabe–Ito colors: on a near-black canvas they
 * all clear the contrast thresholds, so dark mode gets the palette exactly
 * as designed (only black itself is replaced by white, and blue's
 * text variant is lightened to reach 4.5:1).
 *
 * Verified with a Machado-model CVD simulation + CIEDE2000 analysis: in
 * light mode no color pair falls below dE 15 for typical vision, and the
 * weakest dichromat pairs (~dE 7-8) are assigned distinct marker shapes;
 * dark mode keeps dE >= 10 for all pairs under every dichromacy. Marker
 * shapes and line styles vary across styles so distinctions never rest on
 * color alone. Color words are pinned wherever the nearest-anchor word
 * matcher misnames a hue (it called this palette's blue "cyan" and its
 * reddish purple "red").
 */
export const okabeItoPalette: StylePalette = {
    name: "okabeito",
    description:
        "Colorblind-friendly blues, oranges, greens, and purples adapted from the Okabe-Ito palette, with varied marker shapes and line styles.",
    styles: {
        1: {
            // blue (canonical #0072b2)
            lineColor: "#0072b2",
            markerColor: "#0072b2",
            fillColor: "#0072b2",
            textColor: "#0072b2",
            highContrastColor: "#0072b2",
            lineColorWord: "blue",
            markerColorWord: "blue",
            fillColorWord: "blue",
            textColorWord: "blue",
            highContrastColorWord: "blue",
            lineColorDarkMode: "#0072b2",
            markerColorDarkMode: "#0072b2",
            fillColorDarkMode: "#0072b2",
            textColorDarkMode: "#4882b8",
            lineColorWordDarkMode: "blue",
            markerColorWordDarkMode: "blue",
            fillColorWordDarkMode: "blue",
            textColorWordDarkMode: "blue",
            highContrastColorWordDarkMode: "blue",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            // vermillion (canonical #d55e00, darkened for text contrast)
            lineColor: "#c15400",
            markerColor: "#c15400",
            fillColor: "#c15400",
            textColor: "#c15400",
            highContrastColor: "#c15400",
            lineColorDarkMode: "#d55e00",
            markerColorDarkMode: "#d55e00",
            fillColorDarkMode: "#d55e00",
            textColorDarkMode: "#d55e00",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            // bluish green (canonical #009e73)
            lineColor: "#009e73",
            markerColor: "#009e73",
            fillColor: "#009e73",
            textColor: "#008561",
            highContrastColor: "#008561",
            lineColorWord: "green",
            markerColorWord: "green",
            fillColorWord: "green",
            textColorWord: "green",
            highContrastColorWord: "green",
            lineColorDarkMode: "#009e73",
            markerColorDarkMode: "#009e73",
            fillColorDarkMode: "#009e73",
            textColorDarkMode: "#009e73",
            lineColorWordDarkMode: "green",
            markerColorWordDarkMode: "green",
            fillColorWordDarkMode: "green",
            textColorWordDarkMode: "green",
            highContrastColorWordDarkMode: "green",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            // reddish purple (canonical #cc79a7)
            lineColor: "#cc79a7",
            markerColor: "#cc79a7",
            fillColor: "#cc79a7",
            textColor: "#a35f85",
            highContrastColor: "#a35f85",
            lineColorWord: "purple",
            markerColorWord: "purple",
            fillColorWord: "purple",
            textColorWord: "purple",
            highContrastColorWord: "purple",
            lineColorDarkMode: "#cc79a7",
            markerColorDarkMode: "#cc79a7",
            fillColorDarkMode: "#cc79a7",
            textColorDarkMode: "#cc79a7",
            lineColorWordDarkMode: "purple",
            markerColorWordDarkMode: "purple",
            fillColorWordDarkMode: "purple",
            textColorWordDarkMode: "purple",
            highContrastColorWordDarkMode: "purple",
            lineWidth: 2,
            markerStyle: "diamond",
        },
        5: {
            // black (canonical #000000; neutral gray in dark mode)
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
            markerStyle: "plus",
        },
        6: {
            // yellow (canonical #f0e442, darkened to olive in light mode)
            lineColor: "#5a5513",
            markerColor: "#5a5513",
            fillColor: "#5a5513",
            textColor: "#5a5513",
            highContrastColor: "#5a5513",
            lineColorWord: "olive",
            markerColorWord: "olive",
            fillColorWord: "olive",
            textColorWord: "olive",
            highContrastColorWord: "olive",
            lineColorDarkMode: "#f0e442",
            markerColorDarkMode: "#f0e442",
            fillColorDarkMode: "#f0e442",
            textColorDarkMode: "#f0e442",
            highContrastColorWordDarkMode: "olive",
            lineWidth: 2,
            markerStyle: "cross",
        },
        7: {
            // sky blue (canonical #56b4e9, darkened for light mode)
            lineColor: "#499bca",
            markerColor: "#499bca",
            fillColor: "#499bca",
            textColor: "#397ba1",
            highContrastColor: "#397ba1",
            lineColorWord: "skyblue",
            markerColorWord: "skyblue",
            fillColorWord: "skyblue",
            textColorWord: "skyblue",
            highContrastColorWord: "skyblue",
            lineColorDarkMode: "#56b4e9",
            markerColorDarkMode: "#56b4e9",
            fillColorDarkMode: "#56b4e9",
            textColorDarkMode: "#56b4e9",
            lineColorWordDarkMode: "skyblue",
            markerColorWordDarkMode: "skyblue",
            fillColorWordDarkMode: "skyblue",
            textColorWordDarkMode: "skyblue",
            highContrastColorWordDarkMode: "skyblue",
            lineWidth: 3,
            lineStyle: "dashed",
            markerStyle: "circle",
        },
        8: {
            // orange (canonical #e69f00, darkened for light mode)
            lineColor: "#c58700",
            markerColor: "#c58700",
            fillColor: "#c58700",
            textColor: "#9d6b00",
            highContrastColor: "#9d6b00",
            lineColorWord: "goldenrod",
            markerColorWord: "goldenrod",
            fillColorWord: "goldenrod",
            textColorWord: "goldenrod",
            highContrastColorWord: "goldenrod",
            lineColorDarkMode: "#e69f00",
            markerColorDarkMode: "#e69f00",
            fillColorDarkMode: "#e69f00",
            textColorDarkMode: "#e69f00",
            lineColorWordDarkMode: "goldenrod",
            markerColorWordDarkMode: "goldenrod",
            fillColorWordDarkMode: "goldenrod",
            textColorWordDarkMode: "goldenrod",
            highContrastColorWordDarkMode: "goldenrod",
            lineWidth: 1,
            lineStyle: "dotted",
            markerStyle: "square",
        },
    },
};
