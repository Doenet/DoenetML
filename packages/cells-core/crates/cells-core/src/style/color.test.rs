//! The color helpers against `colord`'s and `@doenet/utils`' own answers,
//! recorded from them.

use super::*;

/// (color, hex, (h, s, l, a), contrast on white, contrast on #121212, word).
#[allow(clippy::type_complexity)]
const VECTORS: &[(&str, &str, (f64, f64, f64, f64), f64, f64, &str)] = &[
    (
        "#555555",
        "#555555",
        (0.0, 0.0, 33.0, 1.0),
        7.45,
        2.51,
        "gray",
    ),
    (
        "#c8c8c8",
        "#c8c8c8",
        (0.0, 0.0, 78.0, 1.0),
        1.67,
        11.19,
        "gray",
    ),
    (
        "#444444",
        "#444444",
        (0.0, 0.0, 27.0, 1.0),
        9.73,
        1.92,
        "gray",
    ),
    (
        "#D4042D",
        "#d4042d",
        (348.0, 96.0, 42.0, 1.0),
        5.44,
        3.43,
        "red",
    ),
    (
        "#a6510c",
        "#a6510c",
        (27.0, 87.0, 35.0, 1.0),
        5.52,
        3.39,
        "orange",
    ),
    (
        "#644CD6",
        "#644cd6",
        (250.0, 63.0, 57.0, 1.0),
        5.92,
        3.16,
        "purple",
    ),
    (
        "#f0f0f0",
        "#f0f0f0",
        (0.0, 0.0, 94.0, 1.0),
        1.13,
        16.43,
        "white",
    ),
    (
        "#777777",
        "#777777",
        (0.0, 0.0, 47.0, 1.0),
        4.47,
        4.18,
        "gray",
    ),
    (
        "#540907",
        "#540907",
        (2.0, 85.0, 18.0, 1.0),
        14.79,
        1.26,
        "red",
    ),
    (
        "#f0c6c5",
        "#f0c6c5",
        (1.0, 59.0, 86.0, 1.0),
        1.54,
        12.12,
        "pink",
    ),
    (
        "brown",
        "#a52a2a",
        (0.0, 59.0, 41.0, 1.0),
        7.08,
        2.64,
        "brown",
    ),
    (
        "rgb(10, 200, 30)",
        "#0ac81e",
        (126.0, 90.0, 41.0, 1.0),
        2.25,
        8.29,
        "green",
    ),
    (
        "rgba(10 20 30 / 50%)",
        "#0a141e80",
        (210.0, 50.0, 8.0, 0.5),
        18.55,
        1.0,
        "black",
    ),
    (
        "hsl(200, 50%, 40%)",
        "#337799",
        (200.0, 50.0, 40.0, 1.0),
        4.95,
        3.78,
        "blue",
    ),
    (
        "#abc",
        "#aabbcc",
        (210.0, 25.0, 73.0, 1.0),
        1.96,
        9.53,
        "gray",
    ),
    (
        "#12345678",
        "#12345678",
        (210.0, 65.0, 20.0, 0.47),
        12.71,
        1.47,
        "blue",
    ),
    (
        "lch(50% 30 120)",
        "#697e49",
        (84.0, 26.0, 39.0, 1.0),
        4.5,
        4.16,
        "green",
    ),
    (
        "#2ca02c",
        "#2ca02c",
        (120.0, 57.0, 40.0, 1.0),
        3.4,
        5.5,
        "green",
    ),
    (
        "#e0ffff",
        "#e0ffff",
        (180.0, 100.0, 94.0, 1.0),
        1.05,
        17.76,
        "cyan",
    ),
    (
        "#a99d96",
        "#a99d96",
        (22.0, 10.0, 63.0, 1.0),
        2.64,
        7.09,
        "gray",
    ),
    (
        "#1f5dff",
        "#1f5dff",
        (223.0, 100.0, 56.0, 1.0),
        5.16,
        3.62,
        "blue",
    ),
    (
        "#808000",
        "#808000",
        (60.0, 100.0, 25.0, 1.0),
        4.19,
        4.46,
        "green",
    ),
    (
        "#25b0c0",
        "#25b0c0",
        (186.0, 68.0, 45.0, 1.0),
        2.6,
        7.18,
        "cyan",
    ),
    (
        "transparent",
        "#00000000",
        (0.0, 0.0, 0.0, 0.0),
        21.0,
        1.12,
        "transparent",
    ),
];

#[test]
fn parses_writes_and_measures_as_colord() {
    let white = parse("#ffffff").unwrap();
    let dark = parse("#121212").unwrap();
    for &(text, hex, (h, s, l, a), on_white, on_dark, word) in VECTORS {
        let c = parse(text).unwrap_or_else(|| panic!("{text} parses"));
        assert_eq!(c.to_hex(), hex, "{text}");
        let hsl = c.to_hsl();
        assert_eq!((hsl.h % 360.0, hsl.s, hsl.l, hsl.a), (h, s, l, a), "{text}");
        assert_eq!(c.contrast(white), on_white, "{text} on white");
        assert_eq!(c.contrast(dark), on_dark, "{text} on dark");
        assert_eq!(color_word(text), word, "{text}'s word");
    }
    assert!(parse("notacolor").is_none());
    assert_eq!(color_word("notacolor"), "notacolor");
}

#[test]
fn derives_dark_mode_colors_as_style_ts() {
    // `addMissingChildStyleColorFields` over these light colors.
    assert_eq!(derive_dark("#555555", GRAPHIC_THRESHOLD, 0.7), "#858585");
    assert_eq!(derive_dark("#a6510c", GRAPHIC_THRESHOLD, 0.7), "#d2660f");
    assert_eq!(derive_dark("#540907", GRAPHIC_THRESHOLD, 1.0), "#c11610");
    assert_eq!(invert_lightness("#d4042d"), "#fb2d56");
    assert_eq!(derive_dark("#644cd6", TEXT_THRESHOLD, 1.0), "#806ede");
    assert_eq!(invert_lightness("#c8c8c8"), "#383838");
    assert_eq!(derive_dark("#000000", GRAPHIC_THRESHOLD, 0.2), "#ffffff");
    assert_eq!(invert_lightness("#777777"), "#878787");
    assert_eq!(derive_dark("brown", GRAPHIC_THRESHOLD, 0.7), "#d66161");
    assert_eq!(invert_lightness("green"), "#80ff80");
    assert_eq!(derive_dark("#f0f0f0", TEXT_THRESHOLD, 1.0), "#f0f0f0");
    assert_eq!(color_word("#d66161"), "red");
}
