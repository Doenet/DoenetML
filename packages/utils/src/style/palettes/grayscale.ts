import type { StylePalette } from "./types";

/**
 * A pure-luminance palette: four grays with no hue at all, laddered at even
 * perceptual-lightness (CIELAB L*) steps across the full range the contrast
 * thresholds allow. Because luminance is the only channel this palette uses,
 * it is the best hope for readers with achromatopsia (or anyone viewing in
 * grayscale): every other palette spends part of its distinguishing budget
 * on hue, which such readers cannot see. A host system can offer it to
 * readers through the reader style-overrides mechanism.
 *
 * Light mode spans L* 0-61 (black up to the 3:1 graphic threshold on white,
 * with a darker text variant for the lightest style); dark mode inverts the
 * ladder, white down to the 3:1 threshold on the dark canvas. Steps are ~20
 * L* in both modes — the widest even spacing possible for four styles.
 * Marker shapes and line widths vary as well, so styles stay distinguishable
 * even where grays approach each other.
 *
 * Style 1 carries the maximum contrast (black on light, white on dark);
 * authors are advised to reserve style numbers 1-4 for their most important
 * distinctions, since palettes are only guaranteed to have four styles.
 */
export const grayscalePalette: StylePalette = {
    name: "grayscale",
    description:
        "Four grays with maximum luminance separation, for readers who distinguish styles by lightness alone.",
    styles: {
        1: {
            lineColor: "#000000",
            markerColor: "#000000",
            fillColor: "#000000",
            highContrastColor: "#000000",
            lineColorWord: "black",
            markerColorWord: "black",
            fillColorWord: "black",
            highContrastColorWord: "black",
            lineColorDarkMode: "#ffffff",
            markerColorDarkMode: "#ffffff",
            fillColorDarkMode: "#ffffff",
            lineColorWordDarkMode: "white",
            markerColorWordDarkMode: "white",
            fillColorWordDarkMode: "white",
            highContrastColorWordDarkMode: "white",
            lineWidth: 4,
            markerStyle: "circle",
        },
        2: {
            lineColor: "#323232",
            markerColor: "#323232",
            fillColor: "#323232",
            textColor: "#323232",
            highContrastColor: "#323232",
            lineColorWord: "dark gray",
            markerColorWord: "dark gray",
            fillColorWord: "dark gray",
            textColorWord: "dark gray",
            highContrastColorWord: "dark gray",
            lineColorDarkMode: "#c7c7c7",
            markerColorDarkMode: "#c7c7c7",
            fillColorDarkMode: "#c7c7c7",
            textColorDarkMode: "#c7c7c7",
            lineColorWordDarkMode: "light gray",
            markerColorWordDarkMode: "light gray",
            fillColorWordDarkMode: "light gray",
            textColorWordDarkMode: "light gray",
            highContrastColorWordDarkMode: "light gray",
            lineWidth: 2,
            markerStyle: "square",
        },
        3: {
            lineColor: "#616161",
            markerColor: "#616161",
            fillColor: "#616161",
            textColor: "#616161",
            highContrastColor: "#616161",
            lineColorWord: "gray",
            markerColorWord: "gray",
            fillColorWord: "gray",
            textColorWord: "gray",
            highContrastColorWord: "gray",
            lineColorDarkMode: "#929292",
            markerColorDarkMode: "#929292",
            fillColorDarkMode: "#929292",
            textColorDarkMode: "#929292",
            lineColorWordDarkMode: "gray",
            markerColorWordDarkMode: "gray",
            fillColorWordDarkMode: "gray",
            textColorWordDarkMode: "gray",
            highContrastColorWordDarkMode: "gray",
            lineWidth: 3,
            markerStyle: "triangle",
        },
        4: {
            lineColor: "#939393",
            markerColor: "#939393",
            fillColor: "#939393",
            textColor: "#767676",
            highContrastColor: "#767676",
            lineColorWord: "light gray",
            markerColorWord: "light gray",
            fillColorWord: "light gray",
            textColorWord: "light gray",
            highContrastColorWord: "light gray",
            lineColorDarkMode: "#626262",
            markerColorDarkMode: "#626262",
            fillColorDarkMode: "#626262",
            textColorDarkMode: "#7d7d7d",
            lineColorWordDarkMode: "dark gray",
            markerColorWordDarkMode: "dark gray",
            fillColorWordDarkMode: "dark gray",
            textColorWordDarkMode: "dark gray",
            highContrastColorWordDarkMode: "dark gray",
            lineWidth: 2,
            markerStyle: "diamond",
        },
    },
};
