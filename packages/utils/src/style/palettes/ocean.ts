import type { StylePalette } from "./types";

/**
 * A cool-hued palette of blues, teals, and greens, authored compactly: only
 * light-mode anchor colors plus explicit `textColorDarkMode` values (the
 * lightness-inversion derivation for text falls short of WCAG AA for some of
 * these hues, so each style pins a value derived at the 4.5:1 text threshold).
 * All other dark-mode colors and `*Word` descriptors are derived at expansion
 * time. Marker shapes and line styles vary across styles so distinctions
 * don't rest on color alone.
 */
export const oceanPalette: StylePalette = {
    name: "ocean",
    description:
        "Cool blues, teals, and greens with varied marker shapes and line styles.",
    styles: {
        1: {
            lineColor: "#1c3fae",
            markerColor: "#1c3fae",
            fillColor: "#1c3fae",
            textColor: "#1c3fae",
            highContrastColor: "#1c3fae",
            textColorDarkMode: "#5879e4",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            lineColor: "#00695f",
            markerColor: "#00695f",
            fillColor: "#00695f",
            textColor: "#00695f",
            highContrastColor: "#00695f",
            textColorDarkMode: "#008f81",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            lineColor: "#1e7145",
            markerColor: "#1e7145",
            fillColor: "#1e7145",
            textColor: "#1e7145",
            highContrastColor: "#1e7145",
            textColorDarkMode: "#279158",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#00648f",
            markerColor: "#00648f",
            fillColor: "#00648f",
            textColor: "#00648f",
            highContrastColor: "#00648f",
            textColorDarkMode: "#0088c2",
            lineWidth: 2,
            markerStyle: "diamond",
        },
        5: {
            lineColor: "#4949b8",
            markerColor: "#4949b8",
            fillColor: "#4949b8",
            textColor: "#4949b8",
            highContrastColor: "#4949b8",
            textColorDarkMode: "#7777ca",
            lineWidth: 2,
            markerStyle: "plus",
        },
        6: {
            lineColor: "#4a5e77",
            markerColor: "#4a5e77",
            fillColor: "#4a5e77",
            textColor: "#4a5e77",
            highContrastColor: "#4a5e77",
            textColorDarkMode: "#657f9f",
            lineWidth: 2,
            markerStyle: "cross",
        },
        7: {
            lineColor: "#316986",
            markerColor: "#316986",
            fillColor: "#316986",
            textColor: "#316986",
            highContrastColor: "#316986",
            textColorDarkMode: "#3e84a8",
            lineWidth: 3,
            lineStyle: "dashed",
            markerStyle: "circle",
        },
        8: {
            lineColor: "#5c6670",
            markerColor: "#5c6670",
            fillColor: "#5c6670",
            textColor: "#5c6670",
            highContrastColor: "#5c6670",
            textColorDarkMode: "#73808c",
            lineWidth: 1,
            lineStyle: "dotted",
            markerStyle: "square",
        },
    },
};
