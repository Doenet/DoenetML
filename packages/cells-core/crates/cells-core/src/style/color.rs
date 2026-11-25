//! Colors as the JavaScript core reads them (`colord` 2.9.3 with its
//! `names`, `a11y`, `lab` and `lch` plugins, which `@doenet/utils`
//! extends): parsing a CSS color, its hex and HSL forms, WCAG contrast
//! after compositing over a canvas, the dark-mode derivations of
//! `colorAccessibility.ts`, and the color word of `colorWords.ts`. Each
//! step rounds where `colord` rounds, so a style's derived colors, words
//! and contrast ratios are the current core's to the digit.

use super::names::NAMES;

/// A color as `colord` holds it: channels 0 to 255, unrounded, and alpha
/// 0 to 1.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(crate) struct Rgba {
    pub(crate) r: f64,
    pub(crate) g: f64,
    pub(crate) b: f64,
    pub(crate) a: f64,
}

/// Hue (degrees), saturation and lightness (percent), and alpha.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(crate) struct Hsla {
    pub(crate) h: f64,
    pub(crate) s: f64,
    pub(crate) l: f64,
    pub(crate) a: f64,
}

/// The opaque canvas behind light-mode content.
pub(crate) const CANVAS_LIGHT: &str = "#ffffff";
/// The opaque canvas behind dark-mode content.
pub(crate) const CANVAS_DARK: &str = "#121212";
/// WCAG AA contrast for non-text graphics (lines, markers).
pub(crate) const GRAPHIC_THRESHOLD: f64 = 3.0;
/// WCAG AA contrast for normal-size text.
pub(crate) const TEXT_THRESHOLD: f64 = 4.5;

/// `colord`'s `round`: `x` to `digits` decimals, half up as JavaScript's
/// `Math.round`, and `-0` as `0`.
fn round(x: f64, digits: i32) -> f64 {
    let p = 10f64.powi(digits);
    js_round(p * x) / p + 0.0
}

/// JavaScript's `Math.round`: halves toward positive infinity.
fn js_round(x: f64) -> f64 {
    (x + 0.5).floor()
}

fn clamp(x: f64, lo: f64, hi: f64) -> f64 {
    if x > hi {
        hi
    } else if x > lo {
        x
    } else {
        lo
    }
}

/// `colord`'s hue normalization: a finite hue modulo 360, a nonpositive
/// result shifted up by 360 (so 0 becomes 360), anything else 0 + 360.
fn hue(h: f64) -> f64 {
    let h = if h.is_finite() { h % 360.0 } else { 0.0 };
    if h > 0.0 { h } else { h + 360.0 }
}

impl Rgba {
    fn clamped(self) -> Rgba {
        Rgba {
            r: clamp(self.r, 0.0, 255.0),
            g: clamp(self.g, 0.0, 255.0),
            b: clamp(self.b, 0.0, 255.0),
            a: clamp(self.a, 0.0, 1.0),
        }
    }

    /// `toRgb()`: channels rounded to integers, alpha to 3 decimals.
    pub(crate) fn rounded(self) -> Rgba {
        Rgba {
            r: round(self.r, 0),
            g: round(self.g, 0),
            b: round(self.b, 0),
            a: round(self.a, 3),
        }
    }

    /// `toHex()`: lowercase `#rrggbb`, with `aa` when not opaque.
    pub(crate) fn to_hex(self) -> String {
        let c = self.rounded();
        let two = |v: f64| format!("{:02x}", v as i64);
        let alpha = if c.a < 1.0 {
            two(round(255.0 * c.a, 0))
        } else {
            String::new()
        };
        format!("#{}{}{}{}", two(c.r), two(c.g), two(c.b), alpha)
    }

    /// `toHsl()`: hue, saturation and lightness rounded to integers, alpha
    /// to 3 decimals.
    pub(crate) fn to_hsl(self) -> Hsla {
        let h = rgba_to_hsla(self);
        Hsla {
            h: round(h.h, 0),
            s: round(h.s, 0),
            l: round(h.l, 0),
            a: round(h.a, 3),
        }
    }

    /// The WCAG relative luminance.
    fn luminance(self) -> f64 {
        let lin = |v: f64| {
            let t = v / 255.0;
            if t < 0.04045 {
                t / 12.92
            } else {
                ((t + 0.055) / 1.055).powf(2.4)
            }
        };
        0.2126 * lin(self.r) + 0.7152 * lin(self.g) + 0.0722 * lin(self.b)
    }

    /// `contrast(other)`: the WCAG ratio against `other` as `toRgb()`
    /// rounds it, floored to 2 decimals.
    pub(crate) fn contrast(self, other: Rgba) -> f64 {
        let (u, d) = (self.luminance(), other.rounded().luminance());
        let n = if u > d {
            (u + 0.05) / (d + 0.05)
        } else {
            (d + 0.05) / (u + 0.05)
        };
        (100.0 * n).floor() / 100.0 + 0.0
    }
}

fn rgba_to_hsva(c: Rgba) -> (f64, f64, f64, f64) {
    let max = c.r.max(c.g).max(c.b);
    let d = max - c.r.min(c.g).min(c.b);
    let i = if d != 0.0 {
        if max == c.r {
            (c.g - c.b) / d
        } else if max == c.g {
            2.0 + (c.b - c.r) / d
        } else {
            4.0 + (c.r - c.g) / d
        }
    } else {
        0.0
    };
    let h = 60.0 * if i < 0.0 { i + 6.0 } else { i };
    let s = if max != 0.0 { d / max * 100.0 } else { 0.0 };
    (h, s, max / 255.0 * 100.0, c.a)
}

fn hsva_to_rgba(h: f64, s: f64, v: f64, a: f64) -> Rgba {
    let t = h / 360.0 * 6.0;
    let (n, e) = (s / 100.0, v / 100.0);
    let f = t.floor();
    let o = e * (1.0 - n);
    let i = e * (1.0 - (t - f) * n);
    let s2 = e * (1.0 - (1.0 - t + f) * n);
    let k = (f as i64).rem_euclid(6) as usize;
    Rgba {
        r: 255.0 * [e, i, o, o, s2, e][k],
        g: 255.0 * [s2, e, e, i, o, o][k],
        b: 255.0 * [o, o, s2, e, e, i][k],
        a,
    }
}

fn rgba_to_hsla(c: Rgba) -> Hsla {
    let (h, n, e, a) = rgba_to_hsva(c);
    let u = (200.0 - n) * e / 100.0;
    let s = if u > 0.0 && u < 200.0 {
        n * e / 100.0 / (if u <= 100.0 { u } else { 200.0 - u }) * 100.0
    } else {
        0.0
    };
    Hsla {
        h,
        s,
        l: u / 2.0,
        a,
    }
}

/// An HSL color as `colord({ h, s, l, a })` reads it: clamped, then
/// converted through HSV, unrounded.
pub(crate) fn from_hsla(c: Hsla) -> Rgba {
    let h = hue(c.h);
    let s = clamp(c.s, 0.0, 100.0);
    let l = clamp(c.l, 0.0, 100.0);
    let a = clamp(c.a, 0.0, 1.0);
    let n = s * (if l < 50.0 { l } else { 100.0 - l }) / 100.0;
    let sv = if n > 0.0 {
        2.0 * n / (l + n) * 100.0
    } else {
        0.0
    };
    hsva_to_rgba(h, sv, l + n, a)
}

/// An RGB object as `colord({ r, g, b })` reads it: clamped, unrounded.
pub(crate) fn from_rgb(r: f64, g: f64, b: f64) -> Rgba {
    Rgba { r, g, b, a: 1.0 }.clamped()
}

/// A CSS color as `colord` parses it, trimmed: hex, `rgb()`, `hsl()`, a
/// named color, or `lch()`; none when it is no color.
pub(crate) fn parse(text: &str) -> Option<Rgba> {
    let t = text.trim();
    hex(t)
        .or_else(|| rgb(t))
        .or_else(|| hsl(t))
        .or_else(|| named(t))
        .or_else(|| lch(t))
}

fn hex(t: &str) -> Option<Rgba> {
    let digits = t.strip_prefix('#')?;
    if !(3..=8).contains(&digits.len()) || !digits.bytes().all(|b| b.is_ascii_hexdigit()) {
        return None;
    }
    let d: Vec<u32> = digits.chars().map(|c| c.to_digit(16).unwrap()).collect();
    let (r, g, b, a) = match d.len() {
        3 | 4 => (
            d[0] * 17,
            d[1] * 17,
            d[2] * 17,
            (d.len() == 4).then(|| d[3] * 17),
        ),
        6 | 8 => (
            d[0] * 16 + d[1],
            d[2] * 16 + d[3],
            d[4] * 16 + d[5],
            (d.len() == 8).then(|| d[6] * 16 + d[7]),
        ),
        _ => return None,
    };
    Some(Rgba {
        r: r as f64,
        g: g as f64,
        b: b as f64,
        a: a.map_or(1.0, |a| round(a as f64 / 255.0, 2)),
    })
}

fn named(t: &str) -> Option<Rgba> {
    let lower = t.to_lowercase();
    if lower == "transparent" {
        return hex("#0000").map(Rgba::rounded);
    }
    let &(_, v) = NAMES.iter().find(|(n, _)| *n == lower)?;
    Some(
        Rgba {
            r: (v >> 16) as f64,
            g: ((v >> 8) & 0xff) as f64,
            b: (v & 0xff) as f64,
            a: 1.0,
        }
        .rounded(),
    )
}

/// Whether `t` is a CSS color keyword, which a color word keeps as written.
pub(crate) fn is_css_name(t: &str) -> bool {
    let lower = t.trim().to_lowercase();
    lower == "transparent" || lower == "currentcolor" || NAMES.iter().any(|(n, _)| *n == lower)
}

/// A scanner for the functional forms, following `colord`'s patterns.
struct Scan<'a> {
    s: &'a [char],
    i: usize,
}

impl Scan<'_> {
    fn ws(&mut self) -> usize {
        let start = self.i;
        while self.i < self.s.len() && self.s[self.i].is_whitespace() {
            self.i += 1;
        }
        self.i - start
    }
    fn lit(&mut self, c: char) -> bool {
        if self.s.get(self.i) == Some(&c) {
            self.i += 1;
            true
        } else {
            false
        }
    }
    /// `[+-]?\d*\.?\d+`.
    fn num(&mut self) -> Option<f64> {
        let start = self.i;
        if matches!(self.s.get(self.i), Some('+' | '-')) {
            self.i += 1;
        }
        let digits = |sc: &mut Self| {
            let st = sc.i;
            while sc.i < sc.s.len() && sc.s[sc.i].is_ascii_digit() {
                sc.i += 1;
            }
            sc.i - st
        };
        let int = digits(self);
        let mut frac = 0;
        if self.s.get(self.i) == Some(&'.')
            && self.s.get(self.i + 1).is_some_and(|c| c.is_ascii_digit())
        {
            self.i += 1;
            frac = digits(self);
        }
        if int + frac == 0 {
            self.i = start;
            return None;
        }
        let text: String = self.s[start..self.i].iter().collect();
        text.parse().ok()
    }
    fn pct(&mut self) -> bool {
        self.lit('%')
    }
    /// An angle unit, as a factor to degrees; 1 without one.
    fn unit(&mut self) -> f64 {
        for (u, f) in [
            ("deg", 1.0),
            ("rad", 360.0 / (2.0 * std::f64::consts::PI)),
            ("grad", 0.9),
            ("turn", 360.0),
        ] {
            let n = u.len();
            if self.i + n <= self.s.len() {
                let w: String = self.s[self.i..self.i + n].iter().collect();
                if w.eq_ignore_ascii_case(u) {
                    self.i += n;
                    return f;
                }
            }
        }
        1.0
    }
    fn done(&self) -> bool {
        self.i == self.s.len()
    }
}

/// The inside of `name(...)` or `namea(...)`, case-insensitive.
fn inside<'a>(t: &'a str, name: &str, alpha: bool) -> Option<&'a str> {
    let lower = t.to_ascii_lowercase();
    let rest = if alpha && lower.starts_with(&format!("{name}a(")) {
        name.len() + 2
    } else if lower.starts_with(&format!("{name}(")) {
        name.len() + 1
    } else {
        return None;
    };
    t.get(rest..)?.strip_suffix(')')
}

/// The optional alpha after the last channel: `, a` with commas, `/ a`
/// with spaces; 1 without one.
fn alpha(sc: &mut Scan<'_>, sep: char) -> Option<f64> {
    if sc.lit(sep) {
        sc.ws();
        let a = sc.num()?;
        let p = sc.pct();
        sc.ws();
        Some(if p { a / 100.0 } else { a })
    } else {
        Some(1.0)
    }
}

fn rgb(t: &str) -> Option<Rgba> {
    let chars: Vec<char> = inside(t, "rgb", true)?.chars().collect();
    for commas in [true, false] {
        let mut sc = Scan { s: &chars, i: 0 };
        let parsed = (|| {
            sc.ws();
            let mut v = [(0.0, false); 3];
            for (k, slot) in v.iter_mut().enumerate() {
                if k > 0 {
                    if commas {
                        sc.ws();
                        if !sc.lit(',') {
                            return None;
                        }
                        sc.ws();
                    } else if sc.ws() == 0 {
                        return None;
                    }
                }
                let n = sc.num()?;
                *slot = (n, sc.pct());
            }
            sc.ws();
            let a = alpha(&mut sc, if commas { ',' } else { '/' })?;
            if !sc.done() || v[0].1 != v[1].1 || v[1].1 != v[2].1 {
                return None;
            }
            let ch = |(n, p): (f64, bool)| if p { n / (100.0 / 255.0) } else { n };
            Some(
                Rgba {
                    r: ch(v[0]),
                    g: ch(v[1]),
                    b: ch(v[2]),
                    a,
                }
                .clamped(),
            )
        })();
        if parsed.is_some() {
            return parsed;
        }
    }
    None
}

fn hsl(t: &str) -> Option<Rgba> {
    let chars: Vec<char> = inside(t, "hsl", true)?.chars().collect();
    for commas in [true, false] {
        let mut sc = Scan { s: &chars, i: 0 };
        let parsed = (|| {
            sc.ws();
            let h = sc.num()? * sc.unit();
            let mut sl = [0.0; 2];
            for slot in &mut sl {
                if commas {
                    sc.ws();
                    if !sc.lit(',') {
                        return None;
                    }
                    sc.ws();
                } else if sc.ws() == 0 {
                    return None;
                }
                *slot = sc.num()?;
                if !sc.pct() {
                    return None;
                }
            }
            sc.ws();
            let a = alpha(&mut sc, if commas { ',' } else { '/' })?;
            sc.done().then(|| {
                from_hsla(Hsla {
                    h,
                    s: sl[0],
                    l: sl[1],
                    a,
                })
            })
        })();
        if parsed.is_some() {
            return parsed;
        }
    }
    None
}

fn lch(t: &str) -> Option<Rgba> {
    let chars: Vec<char> = inside(t, "lch", false)?.chars().collect();
    let mut sc = Scan { s: &chars, i: 0 };
    sc.ws();
    let l = sc.num()?;
    if !sc.pct() || sc.ws() == 0 {
        return None;
    }
    let c = sc.num()?;
    if sc.ws() == 0 {
        return None;
    }
    let h = sc.num()? * sc.unit();
    sc.ws();
    let a = alpha(&mut sc, '/')?;
    if !sc.done() {
        return None;
    }
    let (l, h, a) = (clamp(l, 0.0, 100.0), hue(h), clamp(a, 0.0, 1.0));
    Some(lab_to_rgba(
        l,
        c * (h * std::f64::consts::PI / 180.0).cos(),
        c * (h * std::f64::consts::PI / 180.0).sin(),
        a,
    ))
}

// CIE Lab through XYZ (D50), as `colord`'s `lab` and `lch` plugins.

const D50: [f64; 3] = [96.422, 100.0, 82.521];
const EPS: f64 = 216.0 / 24389.0;
const KAPPA: f64 = 24389.0 / 27.0;

fn lin(v: f64) -> f64 {
    let t = v / 255.0;
    if t < 0.04045 {
        t / 12.92
    } else {
        ((t + 0.055) / 1.055).powf(2.4)
    }
}

fn gamma(v: f64) -> f64 {
    255.0
        * if v > 0.0031308 {
            1.055 * v.powf(1.0 / 2.4) - 0.055
        } else {
            12.92 * v
        }
}

fn rgba_to_xyz(c: Rgba) -> [f64; 3] {
    let (t, h, u) = (lin(c.r), lin(c.g), lin(c.b));
    let x = 100.0 * (0.4124564 * t + 0.3575761 * h + 0.1804375 * u);
    let y = 100.0 * (0.2126729 * t + 0.7151522 * h + 0.072175 * u);
    let z = 100.0 * (0.0193339 * t + 0.119192 * h + 0.9503041 * u);
    [
        clamp(1.0478112 * x + 0.0228866 * y + -0.050127 * z, 0.0, D50[0]),
        clamp(0.0295424 * x + 0.9904844 * y + -0.0170491 * z, 0.0, D50[1]),
        clamp(-0.0092345 * x + 0.0150436 * y + 0.7521316 * z, 0.0, D50[2]),
    ]
}

fn lab_unrounded(c: Rgba) -> [f64; 3] {
    let xyz = rgba_to_xyz(c);
    let f = |v: f64| {
        if v > EPS {
            v.cbrt()
        } else {
            (KAPPA * v + 16.0) / 116.0
        }
    };
    let (r, h, u) = (f(xyz[0] / D50[0]), f(xyz[1] / D50[1]), f(xyz[2] / D50[2]));
    [116.0 * h - 16.0, 500.0 * (r - h), 200.0 * (h - u)]
}

fn lab_to_rgba(l: f64, a: f64, b: f64, alpha: f64) -> Rgba {
    let t = (l + 16.0) / 116.0;
    let n = a / 500.0 + t;
    let u = t - b / 200.0;
    let x = (if n.powi(3) > EPS {
        n.powi(3)
    } else {
        (116.0 * n - 16.0) / KAPPA
    }) * D50[0];
    let y = (if l > 8.0 {
        ((l + 16.0) / 116.0).powi(3)
    } else {
        l / KAPPA
    }) * D50[1];
    let z = (if u.powi(3) > EPS {
        u.powi(3)
    } else {
        (116.0 * u - 16.0) / KAPPA
    }) * D50[2];
    let (x, y, z) = (
        0.9555766 * x + -0.0230393 * y + 0.0631636 * z,
        -0.0282895 * x + 1.0099416 * y + 0.0210077 * z,
        0.0122982 * x + -0.020483 * y + 1.3299098 * z,
    );
    Rgba {
        r: gamma(0.032404542 * x - 0.015371385 * y - 0.004985314 * z),
        g: gamma(-0.00969266 * x + 0.018760108 * y + 0.00041556 * z),
        b: gamma(0.000556434 * x - 0.002040259 * y + 0.010572252 * z),
        a: alpha,
    }
    .clamped()
}

/// `toLab()`: rounded to 2 decimals.
fn to_lab(c: Rgba) -> [f64; 3] {
    let [l, a, b] = lab_unrounded(c);
    [round(l, 2), round(a, 2), round(b, 2)]
}

/// `toLch()`'s lightness and chroma, rounded to 2 decimals.
fn to_lch(c: Rgba) -> (f64, f64) {
    let [l, a, b] = lab_unrounded(c);
    let (a, b) = (round(a, 3), round(b, 3));
    (round(l, 2), round((a * a + b * b).sqrt(), 2))
}

/// `delta(other)`: CIEDE2000 over 100, rounded to 3 decimals.
fn delta(c1: Rgba, c2: Rgba) -> f64 {
    let ([o, r, h], [n, p, m]) = (to_lab(c1), to_lab(c2));
    let (u, e) = (180.0 / std::f64::consts::PI, std::f64::consts::PI / 180.0);
    let w = (r * r + h * h).sqrt();
    let b = (p * p + m * m).sqrt();
    let i = (o + n) / 2.0;
    let l = ((w + b) / 2.0).powi(7);
    let c = 0.5 * (1.0 - (l / (l + 25f64.powi(7))).sqrt());
    let f = r * (1.0 + c);
    let y = p * (1.0 + c);
    let v = (f * f + h * h).sqrt();
    let x = (y * y + m * m).sqrt();
    let z = (v + x) / 2.0;
    let mut s = if f == 0.0 && h == 0.0 {
        0.0
    } else {
        h.atan2(f) * u
    };
    let mut d = if y == 0.0 && m == 0.0 {
        0.0
    } else {
        m.atan2(y) * u
    };
    if s < 0.0 {
        s += 360.0;
    }
    if d < 0.0 {
        d += 360.0;
    }
    let mut g = d - s;
    let mm = (d - s).abs();
    if mm > 180.0 && d <= s {
        g += 360.0;
    } else if mm > 180.0 && d > s {
        g -= 360.0;
    }
    let nn = if mm <= 180.0 {
        (s + d) / 2.0
    } else if s + d < 360.0 {
        (s + d + 360.0) / 2.0
    } else {
        (s + d - 360.0) / 2.0
    };
    let ff = 1.0 - 0.17 * (e * (nn - 30.0)).cos()
        + 0.24 * (2.0 * e * nn).cos()
        + 0.32 * (e * (3.0 * nn + 6.0)).cos()
        - 0.2 * (e * (4.0 * nn - 63.0)).cos();
    let ll = n - o;
    let ii = x - v;
    let pp = 2.0 * (e * g / 2.0).sin() * (v * x).sqrt();
    let j = 1.0 + 0.015 * (i - 50.0).powi(2) / (20.0 + (i - 50.0).powi(2)).sqrt();
    let k = 1.0 + 0.045 * z;
    let q = 1.0 + 0.015 * z * ff;
    let aa = 30.0 * (-((nn - 275.0) / 25.0).powi(2)).exp();
    let bb = -2.0 * (l / (l + 25f64.powi(7))).sqrt() * (2.0 * e * aa).sin();
    let de =
        ((ll / j).powi(2) + (ii / k).powi(2) + (pp / q).powi(2) + bb * ii * pp / (k * q)).sqrt();
    clamp(round(de / 100.0, 3), 0.0, 1.0)
}

fn clamp01(v: f64) -> f64 {
    if !v.is_finite() {
        1.0
    } else {
        clamp(v, 0.0, 1.0)
    }
}

fn composite(fg: Rgba, bg: Rgba) -> Rgba {
    let a = clamp01(fg.a);
    Rgba {
        r: fg.r * a + bg.r * (1.0 - a),
        g: fg.g * a + bg.g * (1.0 - a),
        b: fg.b * a + bg.b * (1.0 - a),
        a: 1.0,
    }
}

/// `compositedContrastRatio`: the contrast of `foreground` (its alpha
/// scaled by `opacity`) against `canvas`, each painted in order, with
/// `background` between them; none when a color does not parse.
pub(crate) fn composited_contrast(
    foreground: &str,
    canvas: &str,
    background: Option<&str>,
    opacity: f64,
) -> Option<f64> {
    let fg = parse(foreground)?.rounded();
    let mut canvas = parse(canvas)?.rounded();
    canvas.a = 1.0;
    let back = match background {
        Some(b) => composite(parse(b)?.rounded(), canvas),
        None => canvas,
    };
    let eff = composite(
        Rgba {
            a: clamp01(fg.a * opacity),
            ..fg
        },
        back,
    );
    Some(from_rgb(eff.r, eff.g, eff.b).contrast(from_rgb(back.r, back.g, back.b)))
}

fn with_lightness(c: Hsla, l: f64) -> String {
    from_hsla(Hsla { l, ..c }).to_hex()
}

/// `deriveAccessibleDarkModeColor`: `light` itself when it already clears
/// `threshold` on the dark canvas at `opacity`, else the first lightness
/// up from its own (hue and saturation kept) that does, else white-most.
pub(crate) fn derive_dark(light: &str, threshold: f64, opacity: f64) -> String {
    let Some(base) = parse(light) else {
        return light.to_string();
    };
    if composited_contrast(light, CANVAS_DARK, None, opacity).is_some_and(|r| r >= threshold) {
        return light.to_string();
    }
    let hsl = base.to_hsl();
    let mut l = hsl.l.ceil();
    while l <= 100.0 {
        let candidate = with_lightness(hsl, l);
        if composited_contrast(&candidate, CANVAS_DARK, None, opacity)
            .is_some_and(|r| r >= threshold)
        {
            return candidate;
        }
        l += 1.0;
    }
    with_lightness(hsl, 100.0)
}

/// `invertLightness`: HSL lightness `l` to `100 - l`, as hex; the input
/// when it does not parse.
pub(crate) fn invert_lightness(color: &str) -> String {
    match parse(color) {
        Some(c) => {
            let hsl = c.to_hsl();
            with_lightness(hsl, 100.0 - hsl.l)
        }
        None => color.to_string(),
    }
}

/// `suggestAccessibleDarkModeColorAgainst`: the lightness nearest
/// `start`'s (hue and saturation kept) at which it clears `threshold`
/// against `partner` on the dark canvas, painted as text or as the
/// background; none when no lightness does.
pub(crate) fn suggest_dark_against(
    start: &str,
    partner: &str,
    as_text: bool,
    threshold: f64,
) -> Option<String> {
    let hsl = parse(start)?.to_hsl();
    let ratio = |l: f64| {
        let candidate = with_lightness(hsl, l);
        if as_text {
            composited_contrast(&candidate, CANVAS_DARK, Some(partner), 1.0)
        } else {
            composited_contrast(partner, CANVAS_DARK, Some(&candidate), 1.0)
        }
    };
    let start_l = js_round(hsl.l);
    for d in 0..=100 {
        let candidates: &[f64] = if d == 0 {
            &[start_l]
        } else {
            &[start_l + d as f64, start_l - d as f64]
        };
        for &l in candidates {
            if !(0.0..=100.0).contains(&l) {
                continue;
            }
            if ratio(l).is_some_and(|r| r >= threshold) {
                return Some(with_lightness(hsl, l));
            }
        }
    }
    None
}

/// The canonical color families a color word names, and the anchors
/// matched against (`colorWords.ts`), in the order a tie goes to.
const ANCHORS: [(u32, &str); 56] = [
    (0x000000, "black"),
    (0xffffff, "white"),
    (0x808080, "gray"),
    (0xff0000, "red"),
    (0xffa500, "orange"),
    (0xffff00, "yellow"),
    (0x008000, "green"),
    (0x00ffff, "cyan"),
    (0x0000ff, "blue"),
    (0x800080, "purple"),
    (0xffc0cb, "pink"),
    (0xa52a2a, "brown"),
    (0xc0c0c0, "gray"),
    (0x4d4d4d, "gray"),
    (0x757575, "gray"),
    (0xc8c8c8, "gray"),
    (0xdcdcdc, "gray"),
    (0x800000, "red"),
    (0xf08080, "red"),
    (0xd4042d, "red"),
    (0x8b0000, "red"),
    (0xdc143c, "red"),
    (0x993355, "red"),
    (0xffa07a, "orange"),
    (0xf19143, "orange"),
    (0xa6510c, "orange"),
    (0xff8c00, "orange"),
    (0xffffe0, "yellow"),
    (0xbdb76b, "yellow"),
    (0x9acd32, "green"),
    (0x808000, "green"),
    (0x00ff00, "green"),
    (0x90ee90, "green"),
    (0x2ca02c, "green"),
    (0x006400, "green"),
    (0x008080, "green"),
    (0x00ffff, "cyan"),
    (0xe0ffff, "cyan"),
    (0x25b0c0, "cyan"),
    (0x008b8b, "cyan"),
    (0x000080, "blue"),
    (0x4477aa, "blue"),
    (0x56b4e9, "blue"),
    (0x648fff, "blue"),
    (0x1f5dff, "blue"),
    (0xadd8e6, "blue"),
    (0x00008b, "blue"),
    (0xff00ff, "purple"),
    (0x644cd6, "purple"),
    (0x9c5686, "purple"),
    (0xdda0dd, "purple"),
    (0x8b008b, "purple"),
    (0xff69b4, "pink"),
    (0xff1493, "pink"),
    (0xdeb887, "brown"),
    (0x8b4513, "brown"),
];

/// `colorValueToWord`: a CSS color keyword as written (trimmed); a
/// near-neutral color black, gray or white by its lightness; another
/// color the family of its perceptually nearest anchor; the text itself
/// when it is no color.
pub(crate) fn color_word(value: &str) -> String {
    let t = value.trim();
    if t.is_empty() {
        return String::new();
    }
    if is_css_name(t) {
        return t.to_string();
    }
    let Some(c) = parse(t) else {
        return t.to_string();
    };
    let (l, chroma) = to_lch(c);
    if chroma < 8.0 {
        return if l <= 14.0 {
            "black"
        } else if l >= 92.0 {
            "white"
        } else {
            "gray"
        }
        .to_string();
    }
    let mut best = ("", f64::INFINITY);
    for &(hex, family) in &ANCHORS {
        let anchor = Rgba {
            r: (hex >> 16) as f64,
            g: ((hex >> 8) & 0xff) as f64,
            b: (hex & 0xff) as f64,
            a: 1.0,
        };
        let d = delta(c, anchor);
        if d < best.1 {
            best = (family, d);
        }
    }
    best.0.to_string()
}

#[cfg(test)]
#[path = "color.test.rs"]
mod tests;
