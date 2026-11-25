//! `<intersection>`: where the two figures its children name meet (lines,
//! segments, circles, polygons; `VecOp::Intersect`), as a capped list of
//! points (ADR 0041, decision 2, a dynamic sequence). The current core's
//! intersection is a composite that becomes as many points as there are
//! meetings; here it is as many points as the two figures can meet at
//! (their cap: one for two lines, two for a circle and a line or a
//! circle, a polygon's as many as its edges'), those past how many they
//! do meet at (`numPoints`, the live length) the missing value, each a
//! row (ADR 0041, decision 4) hidden past the live length.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::program::{Figure, VecOp};

component! {
    /// `<intersection>$c1 $c2</intersection>`: the points where two lines,
    /// segments, circles, polygons or polylines meet, a capped list
    /// `points` whose live length is `numPoints`.
    tags: ["intersection"],
    flags: [copyable],
    default_prop: points,
    props {
        // How many points the figures meet at: the live length.
        numPoints: by_planner { rendered },
        // 1 when the author hides it.
        hide: by_planner { rendered },
    }
    list {
        names: [points],
        item: point,
        capped: [x, y], live: numPoints,
        rendered: true,
    }
    alternate_names {
        numComponents: numPoints,
    }
    // Whether a renderer shows the points separated by commas.
    presentation { asList }
    attributes {
        hide: Flag(false),
    }
    children: List,
    planner: Plan(plan),
}

/// The warning of the current core for more than two items.
const TOO_MANY: (&str, &str) = (
    "doenet-w0055",
    "Haven't implemented intersection for more than two items",
);

/// The props of the figures an intersection reads: a line's or segment's
/// two points, a circle's center and radius.
const LINE_PROPS: [&str; 4] = ["x1", "y1", "x2", "y2"];
const CIRCLE_PROPS: [&str; 3] = ["cx", "cy", "radius"];

/// A child of an intersection read as a figure, with its cells; or what
/// it is instead.
fn figure(
    ctx: &mut PlanCtx<'_, '_>,
    piece: &ListPiece,
) -> Result<std::result::Result<(Figure, Vec<Source>), String>> {
    let r = match piece {
        ListPiece::Reference(r) => *r,
        ListPiece::Text(t) => return Ok(Err(format!("`{t}`"))),
        ListPiece::Math(_) => return Ok(Err("math text".to_string())),
        ListPiece::Element(_) => return Ok(Err("an element child".to_string())),
    };
    let props = |ctx: &mut PlanCtx<'_, '_>, names: &[&'static str]| -> Result<Vec<Source>> {
        names
            .iter()
            .map(|name| Ok(Source::reference(ctx.with_prop(r, name)?)))
            .collect()
    };
    // A polygon's vertices, a static sequence: as many as it is given, a
    // triangle's three and a rectangle's four however they are given.
    let fixed = match ctx.reference_type(r)? {
        Some(ComponentType::Line) => {
            return Ok(Ok((
                Figure::Line { segment: false },
                props(ctx, &LINE_PROPS)?,
            )));
        }
        Some(ComponentType::LineSegment) => {
            return Ok(Ok((
                Figure::Line { segment: true },
                props(ctx, &LINE_PROPS)?,
            )));
        }
        Some(ComponentType::Circle) => {
            return Ok(Ok((Figure::Circle, props(ctx, &CIRCLE_PROPS)?)));
        }
        Some(ComponentType::Polygon) => None,
        Some(ComponentType::Triangle) => Some(3),
        Some(ComponentType::Rectangle) => Some(4),
        Some(t) => return Ok(Err(format!("<{}>", t.tag()))),
        None => return Ok(Err("what a reference names".to_string())),
    };
    let vertices = ctx.with_prop(r, "vertices")?;
    let n = match fixed {
        Some(n) => n,
        None => ctx
            .point_entries(vec![ListPiece::Reference(vertices)], f64::INFINITY)?
            .len(),
    };
    if n < 2 || 2 * n > crate::limits::MAX_VEC_IN / 2 {
        return Ok(Err(format!("a polygon of {n} vertices")));
    }
    let cells = (0..n)
        .flat_map(|k| {
            let p = GivenPoint::Item(vertices, k);
            [p.coord(0), p.coord(1)]
        })
        .collect();
    Ok(Ok((
        Figure::Poly {
            n: n as u8,
            closed: true,
        },
        cells,
    )))
}

/// Plans where the two figures its children name meet: none (no points)
/// when they name fewer than two, and, with a warning, when they name
/// more or something that is no figure.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let author_hide = Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0));
    let none = |hide: Wire| -> ElemWiring {
        let mut wiring = ElemWiring::with_list(ComponentType::Intersection, 0);
        wiring.set_list(Vec::new());
        wiring.set_hides(Vec::new());
        wiring.set_planned(Planned {
            numPoints: Wire::constant(0.0),
            hide,
        });
        wiring
    };
    if attrs.children.len() > 2 {
        ctx.warn(TOO_MANY.0, TOO_MANY.1);
        return Ok(none(author_hide));
    }
    let mut figures = Vec::with_capacity(2);
    for piece in &attrs.children {
        match figure(ctx, piece)? {
            Ok(f) => figures.push(f),
            Err(what) => {
                ctx.warn(
                    "cells-intersection-unsupported",
                    &format!(
                        "an intersection of {what} is not supported: only of two lines, \
                         line segments, circles or polygons"
                    ),
                );
                return Ok(none(author_hide));
            }
        }
    }
    // Fewer than two items: no intersection, as in the current core.
    let Ok([(a, ca), (b, cb)]) = <[_; 2]>::try_from(figures) else {
        return Ok(none(author_hide));
    };
    let op = VecOp::Intersect { a, b };
    let cap = Figure::cap(a, b);
    if op.n_in() > crate::limits::MAX_VEC_IN || op.n_out() > crate::limits::MAX_VEC_IN {
        ctx.warn(
            "cells-intersection-unsupported",
            "an intersection of figures this large is not supported",
        );
        return Ok(none(author_hide));
    }
    let mut wiring = ElemWiring::with_list(ComponentType::Intersection, cap);
    let author_hide = wiring.hidden_wire(author_hide);
    let args = ca.into_iter().chain(cb).map(|s| wiring.hidden(s)).collect();
    let out = wiring.hidden_vector(op, args);
    let count = out[2 * cap];
    wiring.set_list(
        (0..cap)
            .map(|k| [Wire::own(out[2 * k]), Wire::own(out[2 * k + 1])])
            .collect(),
    );
    // Entry `k`'s row hides past the live length, or with the list.
    wiring.hide_past(count, Some(author_hide));
    wiring.set_planned(Planned {
        numPoints: Wire::own(count),
        hide: Wire::own(author_hide),
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "intersection.spec.rs"]
mod spec;
