//! `<pointList>`: a static sequence of points (ADR 0041), its definition and
//! its planner; or, as `extend="$shape.points"`, the points of a shape's
//! list prop.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<pointList>`: one point per piece of its text (`(1,2)`, split at
    /// the spaces outside any bracket pair), per reference among its
    /// children (a point list's, its points) and per element child, in
    /// order; its points are its list, `points` (`point1`, `x1`, `y1`,
    /// ...), each a row drawn and dragged as a point (decision 4), and
    /// `numPoints` how many there are, at most `maxNumber`. As
    /// `extend="$shape.points"`, its children are points aliasing the
    /// shape's (`extend_value: List`).
    tags: ["pointList"],
    flags: [copyable, located],
    over_value: OverValuePointList,
    extend_value: List,
    default_prop: points,
    props {
        numPoints: list_len { rendered },
    }
    list {
        names: [points],
        item: point,
        entry_coords: [x, y], max_by: maxNumber, entries: children,
        interactive: true,
        rendered: true,
    }
    alternate_names {
        numComponents: numPoints,
        numValues: numPoints,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        maxNumber: Literal(f64::INFINITY),
    }
    children: List,
    planner: Plan(plan),
}

/// Plans the list from its children: each piece of text a point given by
/// the list, each reference or element child the point it names (or a
/// point list's points), at most `maxNumber`.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let pieces = attrs.children;
    let points = ctx.point_entries(pieces.clone(), attrs.maxNumber?)?;
    let n = points.len();
    ctx.element_rows(&pieces, n);
    let mut wiring = ElemWiring::with_list(ComponentType::PointList, n);
    let list = points
        .iter()
        .enumerate()
        .map(|(k, p)| Wire::point_given(p, |j| GivenId::Children((2 * k + j) as u32)))
        .collect();
    wiring.set_list(list);
    wiring.set_planned(Planned {});
    Ok(wiring)
}

#[cfg(test)]
#[path = "point_list.spec.rs"]
mod spec;
