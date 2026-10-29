//! `<point>`: its definition and its planner (ADR 0016). Its coordinates
//! come from `coords`, from `x` and `y`, or from `(a, b)` children; a
//! constraint child wraps them in a projection.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::dast::{NodeId, NodeKind};
use crate::error::{Error, Result};
use crate::program::{SymKind, VecOp};
use crate::tick::snap::Shape;

component! {
    /// `<point>`. `coords` combines `x` and `y`.
    tags: ["point"],
    flags: [copyable],
    default_prop: coords,
    props {
        x: by_planner { interactive, rendered },
        y: by_planner { interactive, rendered },
        // A boolean in the current core; here a 0/1 cell.
        hide: by_planner { rendered },
    }
    combined_props {
        coords: [x, y],
    }
    sticky_points: (Shape::Point, X, 1),
    attributes {
        coords,
        x,
        y,
        hide,
    }
    shared_state {
        // The coordinates, when they are the point's own state.
        X, Y,
    }
    planner: Plan(plan),
}

pub const X: usize = Props::AT.x;
pub const Y: usize = Props::AT.y;
pub const HIDE: usize = Props::AT.hide;
// A sticky group reads a member's points as (x, y) pairs from the
// position its layout names (`sticky`, `document/sticky.rs`).
const _: () = assert!(Y == X + 1, "a point's y must follow its x");

/// A point's props from its two coordinates, as a `<math>` that is a pair
/// or a copy of a point's coordinates has them; `hide` is the default.
pub(crate) fn props_of(x: Source, y: Source) -> Vec<Source> {
    let mut wiring = ElemWiring::of(ComponentType::Point);
    let hide = ComponentType::Point.prop_defs()[HIDE].default;
    wiring.set_public(Props {
        x: x.into(),
        y: y.into(),
        hide: Source::Literal(hide).into(),
    });
    wiring.finish()
}

/// Plans a point: coordinates from `coords`, from `x`/`y`, or from
/// `(a, b)` children; a constraint child wraps them in a projection.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let d = ctx.dast();
    let (el, base) = (ctx.node(), ctx.base());
    let mut wiring = ElemWiring::of(ComponentType::Point);
    let own_children = ctx.math_children(el);
    let base_children = base.map(|b| ctx.math_children(b)).unwrap_or_default();
    let coords_state = [shared_state::X, shared_state::Y];
    let [x, y] = if let Some(a) = ctx.attr(attr::coords) {
        let p = ctx.point_at(a)?;
        Wire::point(&p, coords_state, attr::coords)
    } else if ctx.has(attr::x)
        || ctx.has(attr::y)
        || (own_children.is_empty() && base_children.is_empty())
    {
        let mut coord = |name: Attr, state: SharedState| -> Result<Wire> {
            Ok(match ctx.scalar(name)? {
                Some(Source::Literal(v)) => Wire::essential_from(state, name, v),
                Some(source) => source.into(),
                None => Wire::essential(state, 0.0),
            })
        };
        [
            coord(attr::x, coords_state[0])?,
            coord(attr::y, coords_state[1])?,
        ]
    } else {
        // The point's own children, else its referent's, which a copy
        // then shares.
        let (nodes, given) = if own_children.is_empty() {
            (base_children, Given::Referent)
        } else {
            (own_children, Given::Children)
        };
        let p = GivenPoint::Tuple(ctx.tuple(&nodes)?);
        Wire::point(&p, coords_state, given)
    };
    // `hide` is a 0/1 cell: a bare or literal flag, or a bound cell; a
    // copy inherits the original's.
    let hide = ctx.flag(attr::hide, false)?;
    // Constraints may sit directly under the point or in <constraints>.
    let mut constraints: Vec<NodeId> = Vec::new();
    for node in std::iter::once(el).chain(base) {
        for &n in d.children(node) {
            if d.kind(n) == NodeKind::Element {
                if d.str(n) == "constraints" {
                    constraints.extend(
                        d.children(n)
                            .iter()
                            .copied()
                            .filter(|&c| d.kind(c) == NodeKind::Element),
                    );
                } else {
                    constraints.push(n);
                }
            }
        }
        if !constraints.is_empty() {
            break;
        }
    }
    let [x, y] = match constraints.as_slice() {
        [] => [x, y],
        [c] => constrain(ctx, &mut wiring, [x, y], *c)?,
        _ => {
            return Err(Error::Unsupported(
                "more than one constraint on a point".into(),
            ));
        }
    };
    wiring.set_public(Props {
        x,
        y,
        hide: hide.into(),
    });
    Ok(wiring)
}

/// The point's coordinates as planned so far move to hidden raw slots,
/// with their shared state, since they are its state; the public `x`, `y` are
/// their projection onto the constraint.
fn constrain(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    [x, y]: [Wire; 2],
    c: NodeId,
) -> Result<[Wire; 2]> {
    let d = ctx.dast();
    let raw_x = wiring.hidden_wire(x);
    let raw_y = wiring.hidden_wire(y);
    let at = Props::AT;
    match d.str(c) {
        "constrainToGrid" => {
            let num = |name: &str, default: f64| -> Result<f64> {
                match d.attr(c, name) {
                    None => Ok(default),
                    Some(a) => ctx
                        .attr_text(a)
                        .and_then(|s| s.trim().parse::<f64>().ok())
                        .ok_or_else(|| Error::BadLiteralParam(name.into())),
                }
            };
            let (dx, dy) = (num("dx", 1.0)?, num("dy", 1.0)?);
            let (xo, yo) = (num("xoffset", 0.0)?, num("yoffset", 0.0)?);
            let snap = |wiring: &mut ElemWiring, raw: usize, step: f64, offset: f64| -> Wire {
                let mut cur = raw;
                if offset != 0.0 {
                    cur = wiring.hidden(Source::computed(OpSpec::Offset { k: -offset }, vec![cur]));
                }
                if step != 1.0 {
                    cur =
                        wiring.hidden(Source::computed(OpSpec::Scale { k: 1.0 / step }, vec![cur]));
                }
                cur = wiring.hidden(Source::computed(OpSpec::Round, vec![cur]));
                if step != 1.0 {
                    cur = wiring.hidden(Source::computed(OpSpec::Scale { k: step }, vec![cur]));
                }
                if offset != 0.0 {
                    return Wire::computed(OpSpec::Offset { k: offset }, vec![cur]);
                }
                Wire::own(cur)
            };
            let x = snap(wiring, raw_x, dx, xo);
            let y = snap(wiring, raw_y, dy, yo);
            Ok([x, y])
        }
        "constrainTo" => {
            let m = d
                .children(c)
                .iter()
                .copied()
                .find(|&n| d.kind(n) == NodeKind::Macro)
                .ok_or_else(|| Error::Unsupported("<constrainTo> without a reference".into()))?;
            let p = ctx.reference(m)?;
            let target = ctx.reference_type(p).ok_or_else(|| {
                Error::Unsupported("<constrainTo> must name a component in the same scope".into())
            })?;
            let mut refs = |wiring: &mut ElemWiring, props: &[&str]| -> Vec<usize> {
                props
                    .iter()
                    .map(|pr| wiring.hidden(Source::reference(ctx.with_prop(p, pr))))
                    .collect()
            };
            match target {
                ComponentType::Circle => {
                    let c = refs(wiring, &["cx", "cy", "radius"]);
                    Ok(ElemWiring::vector(
                        [at.x, at.y],
                        VecOp::ProjectCircle,
                        vec![raw_x, raw_y, c[0], c[1], c[2]],
                    ))
                }
                ComponentType::Function | ComponentType::Derivative => {
                    // The point rides the curve: `x` is what was asked
                    // and `y` is f(x). (The current core moves to the
                    // nearest point of the curve instead.)
                    let f = refs(wiring, &["expr"]);
                    Ok([
                        Wire::own(raw_x),
                        Wire::computed(OpSpec::Sym(SymKind::EvalAt), vec![f[0], raw_x]),
                    ])
                }
                ComponentType::Line | ComponentType::LineSegment => {
                    let l = refs(wiring, &["x1", "y1", "x2", "y2"]);
                    Ok(ElemWiring::vector(
                        [at.x, at.y],
                        VecOp::ProjectLine,
                        vec![raw_x, raw_y, l[0], l[1], l[2], l[3]],
                    ))
                }
                other => Err(Error::Unsupported(format!(
                    "constrainTo a <{}>",
                    other.tag()
                ))),
            }
        }
        other => Err(Error::Unsupported(format!("<{other}> constraint"))),
    }
}
