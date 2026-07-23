import type { StylePalette } from "./types";

/**
 * The IBM Design Library's colorblind-safe palette (ultramarine, indigo,
 * magenta, orange, gold). Doenet's default style 1 dark-mode blue (#648FFF)
 * is this palette's ultramarine, so it will feel familiar.
 *
 * Light-mode anchors are the canonical colors wherever they meet Doenet's
 * contrast thresholds on white (3:1 as a graphic, 4.5:1 as text) and are
 * darkened chromaticity-preserving where they do not, with further-darkened
 * text variants where a graphic anchor sits below 4.5:1. Dark mode pins the
 * canonical colors wherever they clear the thresholds on the dark canvas.
 * Verified with a Machado-model CVD simulation + CIEDE2000 analysis; marker
 * shapes and line widths vary across styles so distinctions never rest on
 * color alone.
 */
export const ibmPalette: StylePalette = {
    name: "ibm",
    description:
        "Five colorblind-friendly styles from the IBM Design Library accessible palette, with varied marker shapes.",
    styles: {
        1: {
            lineColor: "#648fff",
            markerColor: "#648fff",
            fillColor: "#648fff",
            highContrastColor: "#4f71cb",
            lineColorDarkMode: "#648fff",
            markerColorDarkMode: "#648fff",
            fillColorDarkMode: "#648fff",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            lineColor: "#6a53d5",
            markerColor: "#6a53d5",
            fillColor: "#6a53d5",
            textColor: "#6a53d5",
            highContrastColor: "#6a53d5",
            lineColorDarkMode: "#785ef0",
            markerColorDarkMode: "#785ef0",
            fillColorDarkMode: "#785ef0",
            textColorDarkMode: "#7f69f0",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            lineColor: "#dc267f",
            markerColor: "#dc267f",
            fillColor: "#dc267f",
            textColor: "#dc267f",
            highContrastColor: "#dc267f",
            lineColorWord: "magenta",
            markerColorWord: "magenta",
            fillColorWord: "magenta",
            textColorWord: "magenta",
            highContrastColorWord: "magenta",
            lineColorDarkMode: "#dc267f",
            markerColorDarkMode: "#dc267f",
            fillColorDarkMode: "#dc267f",
            textColorDarkMode: "#dd4186",
            lineColorWordDarkMode: "magenta",
            markerColorWordDarkMode: "magenta",
            fillColorWordDarkMode: "magenta",
            textColorWordDarkMode: "magenta",
            highContrastColorWordDarkMode: "magenta",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#fe6100",
            markerColor: "#fe6100",
            fillColor: "#fe6100",
            textColor: "#cb4b00",
            highContrastColor: "#cb4b00",
            lineColorDarkMode: "#fe6100",
            markerColorDarkMode: "#fe6100",
            fillColorDarkMode: "#fe6100",
            textColorDarkMode: "#fe6100",
            lineWidth: 2,
            markerStyle: "diamond",
        },
        5: {
            lineColor: "#865a00",
            markerColor: "#865a00",
            fillColor: "#865a00",
            textColor: "#865a00",
            highContrastColor: "#865a00",
            lineColorWord: "gold",
            markerColorWord: "gold",
            fillColorWord: "gold",
            textColorWord: "gold",
            highContrastColorWord: "gold",
            lineColorDarkMode: "#ffb000",
            markerColorDarkMode: "#ffb000",
            fillColorDarkMode: "#ffb000",
            textColorDarkMode: "#ffb000",
            lineColorWordDarkMode: "gold",
            markerColorWordDarkMode: "gold",
            fillColorWordDarkMode: "gold",
            textColorWordDarkMode: "gold",
            highContrastColorWordDarkMode: "gold",
            lineWidth: 2,
            markerStyle: "triangleDown",
        },
    },
};
