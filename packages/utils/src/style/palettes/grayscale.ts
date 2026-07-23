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
 * ladder, white down to the 3:1 threshold on the dark canvas (with a lighter
 * text variant for the darkest style). Steps are ~20 L* in both modes — the
 * widest even spacing possible for four styles. Marker shapes and line widths
 * vary as well, so styles stay distinguishable even where grays approach each
 * other.
 *
 * Every dark-mode text color (`textColorDarkMode` and
 * `highContrastColorDarkMode`) is pinned rather than derived, for two
 * different reasons:
 *
 *  - `textColorDarkMode` derives by inverting the light-mode lightness, which
 *    lands on `#cccccc` / `#9e9e9e` / `#8a8a8a` for styles 2-4 — distinct,
 *    but stepped ~15 then ~8 L* instead of the even ~20 this palette is built
 *    on, giving up most of the separation it exists to provide.
 *  - `highContrastColorDarkMode` derives by lightening the *light-mode* color
 *    only as far as 4.5:1 on the dark canvas requires. Every one of these
 *    grays starts below that threshold, so with nothing pinned all four land
 *    on the same minimum gray while their `*Word` descriptors still claim
 *    four different grays.
 *
 * With `textColorDarkMode` pinned, `pairDarkModeHighContrastWithText` would
 * carry the pin over to `highContrastColorDarkMode` for styles 2-4 on its
 * own; only style 1 strictly needs its own, because expansion replaces style
 * 1's text color with the neutral canvas text color and the pairing rule
 * therefore skips it. All four are spelled out anyway, so the dark ladder
 * reads off the file as directly as the light one does.
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
            lineColorDarkMode: "#ffffff",
            markerColorDarkMode: "#ffffff",
            fillColorDarkMode: "#ffffff",
            highContrastColorDarkMode: "#ffffff",
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
            highContrastColorDarkMode: "#c7c7c7",
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
            lineColorDarkMode: "#929292",
            markerColorDarkMode: "#929292",
            fillColorDarkMode: "#929292",
            textColorDarkMode: "#929292",
            highContrastColorDarkMode: "#929292",
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
            highContrastColorDarkMode: "#7d7d7d",
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
