import { DEFAULT_STYLE_VALUES } from "../styleDefinitionHelpers";
import type { StylePalette } from "./types";

/**
 * The original six built-in style presets, now expressed as the `"default"`
 * palette. This is the base style map every document starts from when no
 * `<stylePalette>` is selected.
 *
 * These entries predate the derivation pipeline, so they spell out dark-mode
 * colors and `*Word` descriptors even where the derivation would produce the
 * same value. That redundancy is deliberate here: it makes every expansion
 * step value-preserving for this palette, so its output stays identical to
 * the historical `returnDefaultStyleDefinitions()` result. New palettes
 * should author only what the derivation gets wrong — see the
 * {@link StylePalette} doc.
 *
 * Style 1 spreads `DEFAULT_STYLE_VALUES`, whose `textColor`/`textColorDarkMode`
 * are already the canvas text colors that expansion forces onto style 1; new
 * palettes should simply leave those keys off style 1.
 */
export const defaultPalette: StylePalette = {
    name: "default",
    description:
        "The standard Doenet styles: blue, red, brown, purple, black, and gray.",
    styles: {
        1: { ...DEFAULT_STYLE_VALUES },
        2: {
            lineColor: "#D4042D",
            lineColorDarkMode: "#F1466A",
            lineOpacity: 0.7,
            lineWidth: 2,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#D4042D",
            markerColorDarkMode: "#F1466A",
            markerOpacity: 0.7,
            markerStyle: "square",
            markerStyleWord: "square",
            markerSize: 5,
            fillColor: "#D4042D",
            fillColorDarkMode: "#F1466A",
            fillOpacity: 0.3,
            textColor: "#D4042D",
            textColorDarkMode: "#FF7A7A",
            highContrastColor: "#D4042D",
            highContrastColorDarkMode: "#FF7A7A",
        },
        3: {
            lineColor: "#a6510c",
            lineColorDarkMode: "#F19143",
            lineOpacity: 0.7,
            lineWidth: 3,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#a6510c",
            markerColorDarkMode: "#F19143",
            markerOpacity: 0.7,
            markerStyle: "triangle",
            markerStyleWord: "triangle",
            markerSize: 5,
            fillColor: "#a6510c",
            fillColorDarkMode: "#F19143",
            fillOpacity: 0.3,
            textColor: "#BE5A0E",
            textColorDarkMode: "#FFA94D",
            highContrastColor: "#BE5A0E",
            highContrastColorDarkMode: "#FFA94D",
        },
        4: {
            lineColor: "#644CD6",
            lineColorDarkMode: "#9F8FE8",
            lineColorWordDarkMode: "purple",
            lineOpacity: 0.7,
            lineWidth: 2,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#644CD6",
            markerColorDarkMode: "#9F8FE8",
            markerColorWordDarkMode: "purple",
            markerOpacity: 0.7,
            markerStyle: "diamond",
            markerStyleWord: "diamond",
            markerSize: 5,
            fillColor: "#644CD6",
            fillColorDarkMode: "#9F8FE8",
            fillColorWordDarkMode: "purple",
            fillOpacity: 0.3,
            textColor: "#644CD6",
            textColorDarkMode: "#B0A4EE",
            highContrastColor: "#644CD6",
            highContrastColorDarkMode: "#B0A4EE",
        },
        5: {
            lineColor: "black",
            lineColorDarkMode: "white",
            lineOpacity: 1,
            lineWidth: 1,
            lineWidthWord: "thin",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "black",
            markerColorDarkMode: "white",
            markerOpacity: 1,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "black",
            fillColorDarkMode: "white",
            fillOpacity: 0.7,
            textColor: "black",
            textColorDarkMode: "white",
            highContrastColor: "black",
            highContrastColorDarkMode: "white",
        },
        6: {
            lineColor: "#636363",
            lineColorDarkMode: "#CCCCCC",
            lineOpacity: 0.7,
            lineWidth: 1,
            lineWidthWord: "thin",
            lineStyle: "dotted",
            lineStyleWord: "dotted",
            markerColor: "#636363",
            markerColorDarkMode: "#CCCCCC",
            markerOpacity: 0.7,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "#636363",
            fillColorDarkMode: "#CCCCCC",
            fillOpacity: 0.3,
            textColor: "#757575",
            textColorDarkMode: "#B0B0B0",
            highContrastColor: "#757575",
            highContrastColorDarkMode: "#B0B0B0",
        },
    },
};
