//! `<intersection>`: where the two lines or line segments its children
//! name cross (`VecOp::IntersectLines`), drawn as a point that is hidden
//! when they do not cross. The current core's intersection is a composite
//! that becomes as many points as there are crossings; two lines cross at
//! most once, so here it is one point and whether it is there. Circles and
//! polygons, which may cross a line or each other more than once, are not
//! supported.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::program::VecOp;

component! {
    /// `<intersection>$l1 $l2</intersection>`: the crossing of two lines or
    /// segments, `hide` 1 when there is none.
    tags: ["intersection"],
    props {
        x: by_planner { rendered },
        y: by_planner { rendered },
        // 1 when hidden: when the author hides it, or the two do not cross.
        hide: by_planner { rendered },
    }
    combined_props {
        coords: [x, y],
    }
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

/// Plans the crossing of the two lines or segments its children name:
/// none (hidden, with no coordinates) when they name fewer than two items,
/// and, with a warning, when they name more or something that is not a
/// line or a segment.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let mut wiring = ElemWiring::of(ComponentType::Intersection);
    let attrs = Attrs::of(ctx.record());
    let author_hide = wiring.hidden_wire(Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0)));
    // Each child a reference to a line (false) or a segment (true), or
    // what it is instead.
    let mut lines = Vec::new();
    let mut other = None;
    for piece in &attrs.children {
        let kind = match piece {
            ListPiece::Reference(r) => match ctx.reference_type(*r)? {
                Some(ComponentType::Line) => Ok((*r, false)),
                Some(ComponentType::LineSegment) => Ok((*r, true)),
                Some(t) => Err(format!("<{}>", t.tag())),
                None => Err("what a reference names".to_string()),
            },
            ListPiece::Text(t) => Err(format!("`{t}`")),
            ListPiece::Math(_) => Err("math text".to_string()),
            ListPiece::Element(_) => Err("an element child".to_string()),
        };
        match kind {
            Ok(line) => lines.push(line),
            Err(what) => {
                other.get_or_insert(what);
            }
        }
    }
    let n_items = attrs.children.len();
    // Hidden, with coordinates `x`, `y`.
    let hidden = |x: Wire, y: Wire| Props {
        x,
        y,
        hide: Wire::constant(1.0),
    };
    if n_items > 2 {
        let w = ctx.warn(TOO_MANY.0, TOO_MANY.1);
        wiring.set_public(hidden(Wire::undefined(w), Wire::undefined(w)));
        return Ok(wiring);
    }
    if let Some(what) = other {
        let w = ctx.warn(
            "cells-intersection-unsupported",
            &format!("an intersection of {what} is not supported: only two lines or line segments"),
        );
        wiring.set_public(hidden(Wire::undefined(w), Wire::undefined(w)));
        return Ok(wiring);
    }
    let [(l1, segment1), (l2, segment2)] = match <[_; 2]>::try_from(lines) {
        Ok(two) => two,
        // Fewer than two items: no intersection, as in the current core.
        Err(_) => {
            wiring.set_public(hidden(Wire::absent(), Wire::absent()));
            return Ok(wiring);
        }
    };
    let mut args = Vec::with_capacity(8);
    for r in [l1, l2] {
        for prop in ["x1", "y1", "x2", "y2"] {
            args.push(wiring.hidden(Source::reference(ctx.with_prop(r, prop)?)));
        }
    }
    let crossing = wiring.hidden_vector(VecOp::IntersectLines { segment1, segment2 }, args);
    wiring.set_public(Props {
        x: Wire::own(crossing[0]),
        y: Wire::own(crossing[1]),
        hide: Wire::computed(OpSpec::Max, vec![author_hide, crossing[2]]),
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "intersection.spec.rs"]
mod spec;
