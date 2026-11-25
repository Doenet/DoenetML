//! A list over a math value (ADR 0063): a `<mathList>`, `<numberList>` or
//! `<pointList>` whose content is one reference to a math value
//! (`<mathList>$mi</mathList>`, `<pointList extend="$f.minima"/>`), its
//! count following the value. Outlining settles it once names resolve
//! (`settle_over_values`), and it is a repeat-like type (ADR 0041, step
//! 4): its count, `numComponents`, a structural cell, and its entries one
//! item per iteration, entry `k` of the value read as a list's
//! (`SymKind::ListItem`): a list's item, else the value itself.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{Post, SymKind};

use super::math_value;

/// The table the three share: the value as a math cell and how many
/// entries it holds.
macro_rules! over_value {
    (
        $(#[$doc:meta])*
        $module:ident: $tag:literal, item: $itty:ident ($itfn:path) $(, flags: [$($flag:ident),*])?
    ) => {
        pub(crate) mod $module {
            use super::*;

            component! {
                $(#[$doc])*
                tags: [$tag],
                flags: [internal, copyable $($(, $flag)*)?],
                // A bare reference reads as the value the list is over,
                // the entries' aggregate (ADR 0041, decision 5).
                reads_as: Math,
                structure: Repeat { count: numComponents },
                item: $itty($itfn),
                default_prop: expr,
                props {
                    // The value the list is over, a math cell.
                    expr: by_planner,
                    // Its number, where it is one.
                    value: computed(OpSpec::Sym(SymKind::Evaluate), [expr]),
                    // How many entries it holds, read as a list's.
                    numComponents: by_planner { rendered },
                }
                alternate_names {
                    numValues: numComponents,
                    numPoints: numComponents,
                }
                // Whether a renderer shows the entries separated by commas.
                presentation { asList }
                attributes {
                    extend: Ref,
                }
                children: List,
                planner: Plan(plan),
            }

            /// Its value and its count ([`plan_over`]).
            fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
                let attrs = Attrs::of(ctx.record());
                let at = Props::PORTS;
                let (expr, count) = plan_over(ctx, attrs.extend, &attrs.children, at.expr)?;
                let mut wiring = ElemWiring::of(ctx.component_type());
                wiring.set_planned(Planned {
                    expr,
                    numComponents: count,
                });
                Ok(wiring)
            }

            /// The position of its value, for its item.
            pub(super) const VALUE: Port = Props::PORTS.expr;
        }
    };
}

over_value! {
    /// `<mathList>` over a math value: one math value per entry.
    math_list: "mathList", item: MathValue(math_item)
}

over_value! {
    /// `<numberList>` over a math value: one number per entry, the
    /// entry's expression evaluated.
    number_list: "numberList", item: Number(number_item)
}

over_value! {
    /// `<pointList>` over a math value: one point per entry, its
    /// coordinates the entry's first two entries, evaluated (a function's
    /// extrema, each `(x, f(x))`).
    point_list: "pointList", item: Point(point_item), flags: [located]
}

/// The value a list over a math value reads, by the one reference its
/// content is (`extend`, else its one child reference), as a math cell (a
/// number made one), and its count, the value's entries read as a list's
/// (`SymKind::ListCount`). `value` is the port the value goes in.
fn plan_over(
    ctx: &mut PlanCtx<'_, '_>,
    extend: Option<RefId>,
    children: &[ListPiece],
    value: Port,
) -> Result<(Wire, Wire)> {
    let p = match (extend, children) {
        (Some(p), []) => p,
        (None, [ListPiece::Reference(p)]) => *p,
        _ => {
            return Err(Error::Internal(
                "a list over a math value reads one reference".into(),
            ));
        }
    };
    let id = ctx
        .entry_math(&ListEntry::Ref(p))
        .expect("a reference is math");
    Ok((
        Source::sym_expr(id, Post::None).into(),
        Wire::computed(OpSpec::Sym(SymKind::ListCount), vec![value]),
    ))
}

/// Entry `k` of the owner's value, read as a list's.
fn entry(ctx: &mut ItemCtx<'_>, value: Port) -> Port {
    let args = vec![ctx.owner(value), ctx.index()];
    ctx.computed(OpSpec::Sym(SymKind::ListItem), args)
}

/// A math list's entry: entry `k` of the value, a math value.
fn math_item(ctx: &mut ItemCtx<'_>) -> math_value::Planned {
    let args = vec![ctx.owner(math_list::VALUE), ctx.index()];
    math_value::Planned {
        value: Wire::computed(OpSpec::Sym(SymKind::ListItem), args),
    }
}

/// A number list's entry: entry `k` of the value, evaluated.
fn number_item(ctx: &mut ItemCtx<'_>) -> crate::components::prop::number::Planned {
    let e = entry(ctx, number_list::VALUE);
    crate::components::prop::number::Planned {
        value: Wire::computed(OpSpec::Sym(SymKind::Evaluate), vec![e]),
    }
}

/// A point list's entry: entry `k` of the value, its first two entries
/// evaluated its coordinates.
fn point_item(ctx: &mut ItemCtx<'_>) -> crate::components::prop::point::Planned {
    let e = entry(ctx, point_list::VALUE);
    let mut coord = |j: f64| {
        let k = ctx.constant(j);
        let x = ctx.computed(OpSpec::Sym(SymKind::Entry), vec![e, k]);
        Wire::computed(OpSpec::Sym(SymKind::Evaluate), vec![x])
    };
    let (x, y) = (coord(1.0), coord(2.0));
    crate::components::prop::point::Planned {
        x,
        y,
        hide: Wire::constant(0.0),
        // Unconstrained and draggable (ADR 0080, ADR 0070).
        constraintUsed: Wire::constant(0.0),
        draggable: Wire::constant(1.0),
    }
}

#[cfg(test)]
#[path = "over_value.spec.rs"]
mod spec;
