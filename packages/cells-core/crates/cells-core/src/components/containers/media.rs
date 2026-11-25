//! What `<image>` and `<video>` share: media laid out in the flow of the document, as
//! the current core's `Image.js` and `Video.js` size and align them (ADR
//! 0078). Each setting is a literal attribute, settled when the document
//! is compiled into a constant: `size` (a preset, `tiny` to `full`, else
//! the nearest to `width`), `width` (the preset's width in pixels),
//! `horizontalAlign` and `displayMode`, a value outside the ones an
//! attribute takes its default with a warning. An image's `rotate` is a
//! value, which a request may write.
//!
//! Not here: an image in a graph (its anchor, a drag, a size by the
//! graph's scale), which reads attributes the planner does not, so the
//! document is refused; a video's playback actions and the state they
//! keep; an image's license attribution.

use crate::compile::api::*;

/// The size presets, smallest first, as the current core's
/// `sizePossibilities`.
const SIZES: [&str; 5] = ["tiny", "small", "medium", "large", "full"];
/// The fraction of the full width each preset takes (`widthFractions`).
const FRACTIONS: [f64; 5] = [1.0 / 12.0, 0.3, 0.5, 0.7, 1.0];
/// The full width, in pixels (`maxWidth`).
const MAX_WIDTH: f64 = 850.0;

/// An attribute's value outside the ones it takes.
const INVALID_VALUE: &str = "cells-invalid-attribute-value";

/// A width as the current core's `<componentSize>` reads its text: a
/// number and a unit, in pixels for an absolute one (`100`, `100px`,
/// `1in`), else a percentage (`50%`, an `em` a hundred of them); None
/// for text that is no such number.
pub(crate) fn component_size(text: &str) -> Option<(f64, bool)> {
    let t = text.trim();
    let end = t
        .char_indices()
        .find(|&(i, c)| !(c.is_ascii_digit() || c == '.' || (i == 0 && c == '-')))
        .map_or(t.len(), |(i, _)| i);
    let size: f64 = t[..end].parse().ok().filter(|v: &f64| v.is_finite())?;
    let unit = t[end..].trim();
    let factor = match unit {
        "" | "px" | "pixel" | "pixels" | "%" => 1.0,
        "em" => 100.0,
        "in" | "inch" | "inches" => 96.0,
        "pt" => 1.333_333_333_333,
        "mm" => 3.779_529_6,
        "cm" => 37.795_296,
        _ => 1.0,
    };
    Some((factor * size, !(unit == "%" || unit == "em")))
}

/// The preset of `size`, else the nearest to `width` (the first whose
/// midpoint to the next is at least it, in pixels or percent), else
/// `default`, as the current core's `size` outside a graph.
fn size_of(size: Option<&str>, width: Option<(f64, bool)>, default: &'static str) -> &'static str {
    if let Some(s) = size {
        return SIZES.iter().find(|&&p| p == s).copied().unwrap_or(default);
    }
    let Some((w, absolute)) = width else {
        return default;
    };
    let scale = if absolute { MAX_WIDTH } else { 100.0 };
    (0..SIZES.len())
        .find(|&i| {
            let next = FRACTIONS.get(i + 1).copied().unwrap_or(f64::INFINITY);
            w <= (FRACTIONS[i] + next) / 2.0 * scale
        })
        .map_or(default, |i| SIZES[i])
}

/// The width in pixels of preset `size` (`widthsBySize`).
fn width_of(size: &str) -> f64 {
    let i = SIZES.iter().position(|&s| s == size).unwrap_or(2);
    (FRACTIONS[i] * MAX_WIDTH).floor()
}

/// A literal setting among `valid`, lower-cased, else `default` with a
/// warning naming it.
fn setting(
    ctx: &mut PlanCtx<'_, '_>,
    name: &str,
    given: Option<&str>,
    valid: &[&'static str],
    default: &'static str,
) -> &'static str {
    let Some(given) = given else {
        return default;
    };
    let lower = given.trim().to_ascii_lowercase();
    match valid.iter().find(|&&v| v == lower) {
        Some(v) => v,
        None => {
            let tag = ctx.component_type().tag();
            ctx.warn(
                INVALID_VALUE,
                &format!("Invalid {name} {given} for <{tag}>: using {default}"),
            );
            default
        }
    }
}

/// What both read of their layout: the size preset, its width, and how
/// they align and display, as text cells but the width.
pub(crate) struct Layout {
    pub(crate) size: Wire,
    pub(crate) width: Wire,
    pub(crate) horizontal_align: Wire,
    pub(crate) display_mode: Wire,
}

/// The layout of an element given `size`, `width`, `horizontalAlign` and
/// `displayMode`, its default size `default`.
pub(crate) fn layout(
    ctx: &mut PlanCtx<'_, '_>,
    attrs: [Option<&str>; 4],
    ids: [Attr; 4],
    default: &'static str,
) -> Layout {
    let [size, width, align, mode] = attrs;
    let size = size.map(|s| s.trim().to_ascii_lowercase());
    let size = match size.as_deref() {
        Some(s) if !SIZES.contains(&s) => {
            let tag = ctx.component_type().tag();
            ctx.warn(
                INVALID_VALUE,
                &format!("Invalid size {s} for <{tag}>: using {default}"),
            );
            default
        }
        s => size_of(s, width.and_then(component_size), default),
    };
    let align = setting(
        ctx,
        "horizontalAlign",
        align,
        &["center", "left", "right"],
        "center",
    );
    let mode = setting(ctx, "displayMode", mode, &["block", "inline"], "block");
    let mut text = |id: Attr, s: &str| Wire::given_text(GivenId::Attr(id, 0), ctx.intern(s));
    Layout {
        size: text(ids[0], size),
        width: Wire::constant(width_of(size)),
        horizontal_align: text(ids[2], align),
        display_mode: text(ids[3], mode),
    }
}
