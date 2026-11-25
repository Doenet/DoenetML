//! `<styleDefinition>` and `<stylePalette>`: what the style numbers of a
//! scope mean, settled at load into the scope's table (ADR 0084,
//! [`crate::style`]). Neither has a value or is drawn; the settle reads
//! their attributes from the source.

pub(crate) mod style_definition {
    use crate::components::define::*;

    component! {
        /// `<styleDefinition styleNumber="2" markerColor="red">`: the
        /// values style number `styleNumber` takes in its scope, over what
        /// it took before.
        tags: ["styleDefinition"],
        flags: [style_definition],
        renders: Never,
        presentation {
            lineColor, lineColorWord, lineColorDarkMode, lineColorWordDarkMode,
            lineOpacity, lineWidth, lineWidthWord, lineStyle, lineStyleWord,
            markerColor, markerColorWord, markerColorDarkMode, markerColorWordDarkMode,
            markerOpacity, markerStyle, markerStyleWord, markerSize, markerFilled,
            fillColor, fillColorWord, fillColorDarkMode, fillColorWordDarkMode,
            fillOpacity, fillPatternOpacity, fillStyle, fillStyleWord,
            textColor, textColorWord, textColorDarkMode, textColorWordDarkMode,
            highContrastColor, highContrastColorWord, highContrastColorDarkMode,
            highContrastColorWordDarkMode,
            backgroundColor, backgroundColorWord, backgroundColorDarkMode,
            backgroundColorWordDarkMode,
        }
    }
}

pub(crate) mod style_definitions {
    use crate::components::define::*;

    component! {
        /// `<styleDefinitions>` in a `<setup>`: a wrapper whose
        /// `<styleDefinition>`s are the setup's, as the current core moves
        /// them into it.
        tags: ["styleDefinitions"],
        flags: [container, style_holder],
        renders: Never,
    }
}

pub(crate) mod style_palette {
    use crate::components::define::*;

    component! {
        /// `<stylePalette palette="okabeIto">`: the built-in palette its
        /// scope's table starts from, in place of its parent scope's.
        tags: ["stylePalette"],
        flags: [style_palette],
        renders: Never,
        presentation { palette }
    }
}
