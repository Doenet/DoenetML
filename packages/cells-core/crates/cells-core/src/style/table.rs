//! A style table: what each style number means, its keys and values as the
//! JavaScript core's `style.ts` keeps them, with the rules that fill in
//! what an author leaves out (a dark-mode color from a light one, a word
//! from a value) and the contrast checks over the result
//! (`styleContrastAccessibility.ts`).

use std::collections::BTreeMap;

use serde_json::{Map, Value as Json};

use super::color::{self, CANVAS_DARK, CANVAS_LIGHT, GRAPHIC_THRESHOLD, TEXT_THRESHOLD};
use crate::dast::NodeId;

/// Declares the style keys, in the order of `styleAttributes`, with the
/// kind of value each holds.
macro_rules! keys {
    ($($key:ident = $name:literal : $kind:ident,)*) => {
        /// A style key (`styleAttributes` in `style.ts`).
        #[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
        pub(crate) enum Key {
            $(#[doc = $name] $key,)*
        }

        impl Key {
            /// Every key, in the order of `styleAttributes`.
            pub(crate) const ALL: &[Key] = &[$(Key::$key,)*];

            /// The key's name, as an attribute is written.
            pub(crate) const fn name(self) -> &'static str {
                match self {
                    $(Key::$key => $name,)*
                }
            }

            /// What its value is.
            pub(crate) const fn kind(self) -> Kind {
                match self {
                    $(Key::$key => Kind::$kind,)*
                }
            }
        }
    };
}

keys! {
    LineColor = "lineColor": Text,
    LineColorWord = "lineColorWord": Text,
    LineColorDarkMode = "lineColorDarkMode": Text,
    LineColorWordDarkMode = "lineColorWordDarkMode": Text,
    LineOpacity = "lineOpacity": Number,
    LineWidth = "lineWidth": Number,
    LineWidthWord = "lineWidthWord": Text,
    LineStyle = "lineStyle": Text,
    LineStyleWord = "lineStyleWord": Text,
    MarkerColor = "markerColor": Text,
    MarkerColorWord = "markerColorWord": Text,
    MarkerColorDarkMode = "markerColorDarkMode": Text,
    MarkerColorWordDarkMode = "markerColorWordDarkMode": Text,
    MarkerOpacity = "markerOpacity": Number,
    MarkerStyle = "markerStyle": Text,
    MarkerStyleWord = "markerStyleWord": Text,
    MarkerSize = "markerSize": Number,
    MarkerFilled = "markerFilled": Boolean,
    FillColor = "fillColor": Text,
    FillColorWord = "fillColorWord": Text,
    FillColorDarkMode = "fillColorDarkMode": Text,
    FillColorWordDarkMode = "fillColorWordDarkMode": Text,
    FillOpacity = "fillOpacity": Number,
    FillPatternOpacity = "fillPatternOpacity": Number,
    FillStyle = "fillStyle": Text,
    FillStyleWord = "fillStyleWord": Text,
    TextColor = "textColor": Text,
    TextColorWord = "textColorWord": Text,
    TextColorDarkMode = "textColorDarkMode": Text,
    TextColorWordDarkMode = "textColorWordDarkMode": Text,
    HighContrastColor = "highContrastColor": Text,
    HighContrastColorWord = "highContrastColorWord": Text,
    HighContrastColorDarkMode = "highContrastColorDarkMode": Text,
    HighContrastColorWordDarkMode = "highContrastColorWordDarkMode": Text,
    BackgroundColor = "backgroundColor": Text,
    BackgroundColorWord = "backgroundColorWord": Text,
    BackgroundColorDarkMode = "backgroundColorDarkMode": Text,
    BackgroundColorWordDarkMode = "backgroundColorWordDarkMode": Text,
}

/// What a style key's value is.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Kind {
    Text,
    Number,
    Boolean,
}

impl Key {
    /// The key named `name`, as an attribute is written (any case).
    pub(crate) fn of(name: &str) -> Option<Key> {
        Key::ALL
            .iter()
            .copied()
            .find(|k| k.name().eq_ignore_ascii_case(name))
    }

    /// Whether a value written for it is lowercased on a component
    /// (`toLowerCase` in `styleAttributes`); a `<styleDefinition>`
    /// lowercases every text.
    pub(crate) fn lowercased(self) -> bool {
        matches!(self, Key::LineStyle | Key::MarkerStyle | Key::FillStyle)
    }
}

/// A style value as generated data holds it ([`super::palettes`]).
#[derive(Debug, Clone, Copy)]
pub(crate) enum Value {
    Str(&'static str),
    Num(f64),
    Bool(bool),
}

/// A style value.
#[derive(Debug, Clone, PartialEq)]
pub(crate) enum Val {
    Str(String),
    Num(f64),
    Bool(bool),
}

impl From<Value> for Val {
    fn from(v: Value) -> Val {
        match v {
            Value::Str(s) => Val::Str(s.to_string()),
            Value::Num(n) => Val::Num(n),
            Value::Bool(b) => Val::Bool(b),
        }
    }
}

impl Val {
    fn json(&self) -> Json {
        match self {
            Val::Str(s) => Json::String(s.clone()),
            Val::Num(n) => serde_json::Number::from_f64(*n).map_or(Json::Null, Json::Number),
            Val::Bool(b) => Json::Bool(*b),
        }
    }
}

/// A value and the element that wrote it (`position` in `style.ts`): a
/// `<styleDefinition>`, or none for a preset or a derived value.
#[derive(Debug, Clone, PartialEq)]
pub(crate) struct Entry {
    pub(crate) val: Val,
    pub(crate) at: Option<NodeId>,
}

/// One style: a value per key it says something about.
#[derive(Debug, Clone, Default, PartialEq)]
pub(crate) struct Style(BTreeMap<Key, Entry>);

/// `DEFAULT_STYLE_VALUES`: the style of a number no table names.
const DEFAULTS: &[(Key, Value)] = &[
    (Key::LineOpacity, Value::Num(0.7)),
    (Key::LineWidth, Value::Num(4.0)),
    (Key::LineWidthWord, Value::Str("thick")),
    (Key::LineStyle, Value::Str("solid")),
    (Key::LineStyleWord, Value::Str("")),
    (Key::MarkerOpacity, Value::Num(0.7)),
    (Key::MarkerStyle, Value::Str("circle")),
    (Key::MarkerStyleWord, Value::Str("point")),
    (Key::MarkerSize, Value::Num(5.0)),
    (Key::MarkerFilled, Value::Bool(true)),
    (Key::FillOpacity, Value::Num(0.3)),
    (Key::FillPatternOpacity, Value::Num(1.0)),
    (Key::FillStyle, Value::Str("solid")),
    (Key::FillStyleWord, Value::Str("")),
    (Key::LineColor, Value::Str("#1f5dff")),
    (Key::LineColorDarkMode, Value::Str("#648FFF")),
    (Key::MarkerColor, Value::Str("#1f5dff")),
    (Key::MarkerColorDarkMode, Value::Str("#648FFF")),
    (Key::FillColor, Value::Str("#1f5dff")),
    (Key::FillColorDarkMode, Value::Str("#648FFF")),
    (Key::TextColor, Value::Str("black")),
    (Key::TextColorDarkMode, Value::Str("white")),
    (Key::HighContrastColor, Value::Str("#2963FF")),
    (Key::HighContrastColorDarkMode, Value::Str("#92B4FF")),
];

/// The color items: each has a color, a dark-mode color and a word for
/// each (`coloredItemsForWords`).
#[derive(Debug, Clone, Copy, PartialEq)]
enum Item {
    Line,
    Marker,
    Fill,
    Text,
    HighContrast,
    Background,
}

const ITEMS: [Item; 6] = [
    Item::Line,
    Item::Marker,
    Item::Fill,
    Item::Text,
    Item::HighContrast,
    Item::Background,
];

impl Item {
    /// Its color, color word, dark-mode color and dark-mode color word.
    fn keys(self) -> [Key; 4] {
        use Key::*;
        match self {
            Item::Line => [
                LineColor,
                LineColorWord,
                LineColorDarkMode,
                LineColorWordDarkMode,
            ],
            Item::Marker => [
                MarkerColor,
                MarkerColorWord,
                MarkerColorDarkMode,
                MarkerColorWordDarkMode,
            ],
            Item::Fill => [
                FillColor,
                FillColorWord,
                FillColorDarkMode,
                FillColorWordDarkMode,
            ],
            Item::Text => [
                TextColor,
                TextColorWord,
                TextColorDarkMode,
                TextColorWordDarkMode,
            ],
            Item::HighContrast => [
                HighContrastColor,
                HighContrastColorWord,
                HighContrastColorDarkMode,
                HighContrastColorWordDarkMode,
            ],
            Item::Background => [
                BackgroundColor,
                BackgroundColorWord,
                BackgroundColorDarkMode,
                BackgroundColorWordDarkMode,
            ],
        }
    }
}

impl Style {
    /// A style of preset values, which no element wrote.
    pub(crate) fn preset(values: &[(Key, Value)]) -> Style {
        Style(
            values
                .iter()
                .map(|&(k, v)| {
                    (
                        k,
                        Entry {
                            val: v.into(),
                            at: None,
                        },
                    )
                })
                .collect(),
        )
    }

    /// `cloneDefaultStyleWithMissingColorWords`: the defaults, with a word
    /// for each color.
    pub(crate) fn default_style() -> Style {
        let mut s = Style::preset(DEFAULTS);
        s.add_missing_color_words();
        s
    }

    /// A text value, when the key holds one.
    pub(crate) fn text(&self, k: Key) -> Option<&str> {
        match self.0.get(&k).map(|e| &e.val) {
            Some(Val::Str(s)) => Some(s),
            _ => None,
        }
    }

    /// A number value, when the key holds one.
    fn number(&self, k: Key) -> Option<f64> {
        match self.0.get(&k).map(|e| &e.val) {
            Some(Val::Num(n)) => Some(*n),
            _ => None,
        }
    }

    fn at(&self, k: Key) -> Option<NodeId> {
        self.0.get(&k).and_then(|e| e.at)
    }

    fn has(&self, k: Key) -> bool {
        self.0.contains_key(&k)
    }

    pub(crate) fn set(&mut self, k: Key, val: Val, at: Option<NodeId>) {
        self.0.insert(k, Entry { val, at });
    }

    /// `Object.assign(self, other)`.
    pub(crate) fn assign(&mut self, other: &Style) {
        for (k, e) in &other.0 {
            self.0.insert(*k, e.clone());
        }
    }

    /// `addMissingColorWordsToStyleDefinition`: a word for each color and
    /// dark-mode color that has none.
    fn add_missing_color_words(&mut self) {
        for item in ITEMS {
            let [color, word, dark, dark_word] = item.keys();
            for (c, w) in [(color, word), (dark, dark_word)] {
                if self.has(w) {
                    continue;
                }
                if let Some(v) = self.text(c).filter(|v| !v.is_empty()) {
                    let word = color::color_word(v);
                    self.set(w, Val::Str(word), None);
                }
            }
        }
    }

    /// `addMissingChildStyleColorFields`: a dark-mode color for each item
    /// whose light color is written and dark one is not
    /// (`deriveDarkModeColorForItem`), then the missing words.
    pub(crate) fn add_missing_child_color_fields(&mut self) {
        for item in ITEMS {
            let [color, _, dark, _] = item.keys();
            if !self.has(color) || self.has(dark) {
                continue;
            }
            let Some(light) = self.text(color).map(str::to_string) else {
                continue;
            };
            let derived = match item {
                Item::Background | Item::Text => color::invert_lightness(&light),
                Item::HighContrast => color::derive_dark(&light, TEXT_THRESHOLD, 1.0),
                Item::Line | Item::Marker => {
                    let opacity_key = if item == Item::Line {
                        Key::LineOpacity
                    } else {
                        Key::MarkerOpacity
                    };
                    let opacity = self.number(opacity_key).unwrap_or(0.7);
                    color::derive_dark(&light, GRAPHIC_THRESHOLD, opacity)
                }
                Item::Fill => color::derive_dark(&light, GRAPHIC_THRESHOLD, 1.0),
            };
            self.set(dark, Val::Str(derived), None);
        }
        self.add_missing_color_words();
    }

    /// `deriveMissingStyleWords`: the word of a line width, line style,
    /// marker style and fill style that has none, at the value's element.
    pub(crate) fn derive_missing_words(&mut self) {
        if self.has(Key::LineWidth)
            && !self.has(Key::LineWidthWord)
            && let Some(w) = self.number(Key::LineWidth)
        {
            let word = if w >= 4.0 {
                "thick"
            } else if w <= 1.0 {
                "thin"
            } else {
                ""
            };
            let at = self.at(Key::LineWidth);
            self.set(Key::LineWidthWord, Val::Str(word.into()), at);
        }
        if self.has(Key::LineStyle)
            && !self.has(Key::LineStyleWord)
            && let Some(s) = self.text(Key::LineStyle).filter(|s| !s.is_empty())
        {
            let word = match s {
                "dashed" | "dotted" => s.to_string(),
                _ => String::new(),
            };
            let at = self.at(Key::LineStyle);
            self.set(Key::LineStyleWord, Val::Str(word), at);
        }
        if self.has(Key::MarkerStyle) && !self.has(Key::MarkerStyleWord) {
            let at = self.at(Key::MarkerStyle);
            if let Some(s) = self.text(Key::MarkerStyle).filter(|s| !s.is_empty()) {
                let s = s.to_string();
                self.set(Key::MarkerStyleWord, Val::Str(s), at);
            }
            let word = self.text(Key::MarkerStyleWord).map(str::to_string);
            match word.as_deref() {
                Some("circle") => self.set(Key::MarkerStyleWord, Val::Str("point".into()), at),
                Some(w) if w.starts_with("triangle") => {
                    self.set(Key::MarkerStyleWord, Val::Str("triangle".into()), at)
                }
                _ => {}
            }
        }
        if self.has(Key::FillStyle)
            && !self.has(Key::FillStyleWord)
            && let Some(s) = self.text(Key::FillStyle).filter(|s| !s.is_empty())
        {
            let word = match s {
                "horizontal" => "horizontal lines",
                "vertical" => "vertical lines",
                "diagonal" => "diagonal lines",
                "backdiagonal" => "reverse diagonal lines",
                "dots" => "dots",
                "diamonds" => "diamonds",
                _ => "",
            };
            let at = self.at(Key::FillStyle);
            self.set(Key::FillStyleWord, Val::Str(word.into()), at);
        }
    }

    /// `resolveStyleDefinition`: every key, with the renderer-facing
    /// fallback for one the style says nothing about, as JSON.
    pub(crate) fn resolved_json(&self) -> Json {
        let mut out = Map::new();
        for &k in Key::ALL {
            let v = match self.0.get(&k) {
                Some(e) => e.val.json(),
                None => match DEFAULTS.iter().find(|(d, _)| *d == k) {
                    Some(&(_, v)) => Val::from(v).json(),
                    None => Json::String(String::new()),
                },
            };
            out.insert(k.name().to_string(), v);
        }
        Json::Object(out)
    }
}

/// One contrast finding: the code, its English message, the element it is
/// about and the values that fill the coded message.
#[derive(Debug, Clone, PartialEq)]
pub(crate) struct Finding {
    pub(crate) code: &'static str,
    pub(crate) message: String,
    pub(crate) at: NodeId,
    pub(crate) args: Vec<(&'static str, String)>,
}

/// The later of two elements, the second on a tie (`latestPosition`).
fn latest(a: Option<NodeId>, b: Option<NodeId>) -> Option<NodeId> {
    match (a, b) {
        (Some(a), Some(b)) => Some(if b >= a { b } else { a }),
        (a, b) => a.or(b),
    }
}

/// A ratio as the message writes it: two decimals.
fn ratio_text(r: f64) -> String {
    format!("{r:.2}")
}

/// A threshold as the message writes it.
fn threshold_text(t: f64) -> String {
    if t.fract() == 0.0 {
        format!("{t:.0}")
    } else {
        format!("{t}")
    }
}

/// `contrastAccessibilityDiagnosticsForStyleDefinition`: the light- and
/// dark-mode checks of style `n`, then those of its derived dark colors.
pub(crate) fn contrast_findings(n: u32, s: &Style) -> Vec<Finding> {
    let mut out = Vec::new();
    for dark in [false, true] {
        mode_findings(n, s, dark, &mut out);
    }
    derived_pair_findings(n, s, &mut out);
    derived_text_findings(n, s, &mut out);
    out
}

/// The keys of a color item in one mode: its color.
fn mode_key(item: Item, dark: bool) -> Key {
    item.keys()[if dark { 2 } else { 0 }]
}

#[allow(clippy::too_many_arguments)]
fn push_if_low(
    out: &mut Vec<Finding>,
    n: u32,
    context: &str,
    dark: bool,
    ratio: Option<f64>,
    threshold: f64,
    at: Option<NodeId>,
) {
    let (Some(ratio), Some(at)) = (ratio, at) else {
        return;
    };
    if ratio >= threshold {
        return;
    }
    let phrase = match context {
        "text-on-background" => "text color against background color",
        "high-contrast" => "high-contrast color against the canvas",
        "line" => "line color against the canvas",
        "marker" => "marker color against the canvas",
        _ => "text color against the canvas",
    };
    let mode = if dark { " (dark mode)" } else { "" };
    out.push(Finding {
        code: "doenet-a0007",
        message: format!(
            "Style definition {n} has insufficient contrast for {phrase}{mode} ({}:1; requires at least {}:1).",
            ratio_text(ratio),
            threshold_text(threshold)
        ),
        at,
        args: vec![
            ("styleNumber", n.to_string()),
            ("context", context.to_string()),
            ("mode", if dark { "dark" } else { "light" }.to_string()),
            ("ratio", ratio.to_string()),
            ("threshold", threshold.to_string()),
        ],
    });
}

fn mode_findings(n: u32, s: &Style, dark: bool, out: &mut Vec<Finding>) {
    let canvas = if dark { CANVAS_DARK } else { CANVAS_LIGHT };
    let text_key = mode_key(Item::Text, dark);
    let back_key = mode_key(Item::Background, dark);
    if let Some(text) = s.text(text_key).filter(|t| !t.is_empty()) {
        let back = s.text(back_key).filter(|t| !t.is_empty());
        let at = latest(s.at(text_key), s.at(back_key));
        let ratio = color::composited_contrast(text, canvas, back, 1.0);
        let context = if back.is_some() {
            "text-on-background"
        } else {
            "text-on-canvas"
        };
        push_if_low(out, n, context, dark, ratio, TEXT_THRESHOLD, at);
    }
    let hc_key = mode_key(Item::HighContrast, dark);
    if let Some(hc) = s.text(hc_key).filter(|t| !t.is_empty()) {
        let ratio = color::composited_contrast(hc, canvas, None, 1.0);
        push_if_low(
            out,
            n,
            "high-contrast",
            dark,
            ratio,
            TEXT_THRESHOLD,
            s.at(hc_key),
        );
    }
    for (item, opacity_key, context) in [
        (Item::Line, Key::LineOpacity, "line"),
        (Item::Marker, Key::MarkerOpacity, "marker"),
    ] {
        let key = mode_key(item, dark);
        if let Some(c) = s.text(key).filter(|t| !t.is_empty()) {
            let at = latest(s.at(key), s.at(opacity_key));
            let opacity = s.number(opacity_key).unwrap_or(0.7);
            let ratio = color::composited_contrast(c, canvas, None, opacity);
            push_if_low(out, n, context, dark, ratio, GRAPHIC_THRESHOLD, at);
        }
    }
}

fn nonempty(s: &Style, k: Key) -> Option<&str> {
    s.text(k).filter(|t| !t.is_empty())
}

/// `derivedDarkModeCombinationDiagnostics`.
fn derived_pair_findings(n: u32, s: &Style, out: &mut Vec<Finding>) {
    let (Some(text_light), Some(back_light), Some(text_dark), Some(back_dark)) = (
        nonempty(s, Key::TextColor),
        nonempty(s, Key::BackgroundColor),
        nonempty(s, Key::TextColorDarkMode),
        nonempty(s, Key::BackgroundColorDarkMode),
    ) else {
        return;
    };
    if s.at(Key::TextColorDarkMode).is_some() || s.at(Key::BackgroundColorDarkMode).is_some() {
        return;
    }
    let light = color::composited_contrast(text_light, CANVAS_LIGHT, Some(back_light), 1.0);
    let dark = color::composited_contrast(text_dark, CANVAS_DARK, Some(back_dark), 1.0);
    let (Some(light), Some(dark)) = (light, dark) else {
        return;
    };
    if light < TEXT_THRESHOLD || dark >= TEXT_THRESHOLD {
        return;
    }
    let back_at = s.at(Key::BackgroundColor);
    let Some(at) = latest(s.at(Key::TextColor), back_at) else {
        return;
    };
    let order: [bool; 2] = if back_at == Some(at) {
        [false, true]
    } else {
        [true, false]
    };
    let mut suggestion = None;
    for as_text in order {
        let (start, partner) = if as_text {
            (text_dark, back_dark)
        } else {
            (back_dark, text_dark)
        };
        if let Some(c) = color::suggest_dark_against(start, partner, as_text, TEXT_THRESHOLD) {
            suggestion = Some((as_text, c));
            break;
        }
    }
    let head = format!(
        "Although style definition {n} has specified colors that provide sufficient contrast for light mode, the dark-mode colors derived from these values have insufficient contrast for the text color against the background color ({}:1; requires at least {}:1).",
        ratio_text(dark),
        threshold_text(TEXT_THRESHOLD)
    );
    let mut args = vec![
        ("styleNumber", n.to_string()),
        ("ratio", dark.to_string()),
        ("threshold", TEXT_THRESHOLD.to_string()),
    ];
    let message = match suggestion {
        Some((as_text, dark_color)) => {
            let (light_attr, dark_attr) = if as_text {
                ("textColor", "textColorDarkMode")
            } else {
                ("backgroundColor", "backgroundColorDarkMode")
            };
            let light_color = color::invert_lightness(&dark_color);
            let message = format!(
                "{head} To ensure sufficient contrast in dark mode, either increase the light-mode contrast (e.g., set {light_attr}=\"{light_color}\") or override the dark-mode color (e.g., set {dark_attr}=\"{dark_color}\")."
            );
            args.extend([
                ("suggestion", "available".to_string()),
                ("lightAttribute", light_attr.to_string()),
                ("lightColor", light_color),
                ("darkAttribute", dark_attr.to_string()),
                ("darkColor", dark_color),
            ]);
            message
        }
        None => {
            args.push(("suggestion", "none".to_string()));
            format!(
                "{head} To ensure sufficient contrast in dark mode, increase the light-mode contrast or override the derived colors with textColorDarkMode and/or backgroundColorDarkMode."
            )
        }
    };
    out.push(Finding {
        code: "doenet-a0008",
        message,
        at,
        args,
    });
}

/// `derivedDarkModeTextCanvasDiagnostics`.
fn derived_text_findings(n: u32, s: &Style, out: &mut Vec<Finding>) {
    let (Some(text_light), Some(text_dark)) = (
        nonempty(s, Key::TextColor),
        nonempty(s, Key::TextColorDarkMode),
    ) else {
        return;
    };
    if nonempty(s, Key::BackgroundColor).is_some()
        || nonempty(s, Key::BackgroundColorDarkMode).is_some()
        || s.at(Key::TextColorDarkMode).is_some()
    {
        return;
    }
    let Some(at) = s.at(Key::TextColor) else {
        return;
    };
    let light = color::composited_contrast(text_light, CANVAS_LIGHT, None, 1.0);
    let dark = color::composited_contrast(text_dark, CANVAS_DARK, None, 1.0);
    let (Some(light), Some(dark)) = (light, dark) else {
        return;
    };
    if light < TEXT_THRESHOLD || dark >= TEXT_THRESHOLD {
        return;
    }
    let suggested = color::derive_dark(text_dark, TEXT_THRESHOLD, 1.0);
    let have = color::composited_contrast(&suggested, CANVAS_DARK, None, 1.0)
        .is_some_and(|r| r >= TEXT_THRESHOLD);
    let head = format!(
        "Although style definition {n} has a specified text color that provides sufficient contrast for light mode, the dark-mode text color derived from this value has insufficient contrast against the canvas ({}:1; requires at least {}:1).",
        ratio_text(dark),
        threshold_text(TEXT_THRESHOLD)
    );
    let mut args = vec![
        ("styleNumber", n.to_string()),
        ("ratio", dark.to_string()),
        ("threshold", TEXT_THRESHOLD.to_string()),
    ];
    let message = if have {
        let light_color = color::invert_lightness(&suggested);
        let message = format!(
            "{head} To ensure sufficient contrast in dark mode, either increase the light-mode contrast (e.g., set textColor=\"{light_color}\") or override the dark-mode color (e.g., set textColorDarkMode=\"{suggested}\")."
        );
        args.extend([
            ("suggestion", "available".to_string()),
            ("lightColor", light_color),
            ("darkColor", suggested),
        ]);
        message
    } else {
        args.push(("suggestion", "none".to_string()));
        format!(
            "{head} To ensure sufficient contrast in dark mode, increase the light-mode contrast or override the derived color with textColorDarkMode."
        )
    };
    out.push(Finding {
        code: "doenet-a0009",
        message,
        at,
        args,
    });
}
