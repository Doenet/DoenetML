//! A `<pointList>` of one entry of a point list chosen by an index
//! (`<pointList extend="$l.points[$n]"/>`, ADR 0074): a list of that one
//! point, or of none when the index names none, as the current core makes
//! it. Its count, 0 or 1, follows the index, so it is a structural
//! sequence (ADR 0041, step 4): a repeat-like type whose count is a
//! structural cell and whose one item is the point, rebuilt when the
//! index moves in or out of range. Outlining settles it once names
//! resolve (`settle_over_values`), as it settles a list over a math
//! value (ADR 0063).

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<pointList extend="$l.points[$n]"/>`: the point entry `$n` of the
    /// list names, as a list of one point, or of none when `$n` names no
    /// entry. `numPoints` is 1 or 0; `$Ps[1]` is the point, which a drag
    /// moves where the entry comes from.
    tags: ["pointList"],
    flags: [internal, located],
    structure: Repeat { count: numComponents },
    item: Point(item),
    props {
        // The entry's coordinates, the missing value when the index names
        // none.
        x: by_planner,
        y: by_planner,
        // 1 while the index names an entry, else 0.
        numComponents: by_planner { rendered },
    }
    alternate_names {
        numPoints: numComponents,
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        extend: Ref,
    }
    children: List,
    planner: Plan(plan),
}

impl crate::components::ComponentType {
    /// The type an element of this type is when it extends one entry of a
    /// list of points by an index that is no literal (ADR 0074): a
    /// `<pointList>`'s, a list of that entry or of none. Outlining settles
    /// it once names resolve.
    pub(crate) fn over_entry(self) -> Option<crate::components::ComponentType> {
        use crate::components::ComponentType as T;
        (self == T::PointList).then_some(T::PointListEntry)
    }
}

/// The entry's coordinates, read through the reference (a choose over
/// the list's points by the index, ADR 0041 decision 3), and its count:
/// 1 when its first coordinate is a number, which an index that names no
/// entry is not (the missing value).
fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let Some(p) = attrs.extend else {
        return Err(Error::Internal(
            "a point list of an entry extends the entry".into(),
        ));
    };
    let mut wiring = ElemWiring::of(ctx.component_type());
    let at = Props::PORTS;
    wiring.set_planned(Planned {
        x: Source::coord(p, 0).into(),
        y: Source::coord(p, 1).into(),
        numComponents: Wire::computed(OpSpec::IsFinite, vec![at.x]),
    });
    Ok(wiring)
}

/// The point: the list's coordinates, a drag writing them back.
fn item(ctx: &mut ItemCtx<'_>) -> crate::components::prop::point::Planned {
    let at = Props::PORTS;
    crate::components::prop::point::Planned {
        x: Wire::own(ctx.owner(at.x)),
        y: Wire::own(ctx.owner(at.y)),
        hide: Wire::constant(0.0),
    }
}

#[cfg(test)]
#[path = "point_list_entry.spec.rs"]
mod spec;
