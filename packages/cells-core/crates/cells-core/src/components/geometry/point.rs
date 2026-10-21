//! `<point>`: its definition and its planner (ADR 0016). Its coordinates
//! come from `coords`, from `x` and `y`, or from `(a, b)` children; a
//! constraint child wraps them in a projection.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::dast::{NodeId, NodeKind};
use crate::error::{Error, Result};
use crate::program::{SymKind, VecOp};
use crate::tick::snap::Shape;

/// `<point>`. `coords` is a view over `x` and `y`.
pub(in crate::components) const POINT: ComponentTypeInfo = info(&["point"], POINT_PROPS)
    .copyable()
    .default_prop("coords")
    .views(&[("coords", &["x", "y"])])
    .sticky(Shape::Point, X, 1);

// `hide` is a boolean in the current core; here it is a 0/1 cell.
const POINT_PROPS: &[PropDef] = &props([planned("x"), planned("y"), planned("hide")]);

typed_props!(POINT_PROPS { x, y, hide } roles {
    // The coordinates, when they are the point's own state.
    X, Y,
});

pub const X: usize = Props::AT.x;
pub const Y: usize = Props::AT.y;
pub const HIDE: usize = Props::AT.hide;
// A sticky group reads a member's points as (x, y) pairs from the
// position its layout names (`sticky`, `document/sticky.rs`).
const _: () = assert!(Y == X + 1, "a point's y must follow its x");

/// Plans a point: coordinates from `coords`, from `x`/`y`, or from
/// `(a, b)` children; a constraint child wraps them in a projection.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemPlan> {
    let d = ctx.dast();
    let (el, base) = (ctx.node(), ctx.base());
    let mut ch = ElemPlan::of(ComponentType::Point);
    let own_children = ctx.math_children(el);
    let base_children = base.map(|b| ctx.math_children(b)).unwrap_or_default();
    if let Some(a) = ctx.attr("coords") {
        let p = ctx.point_at(a)?;
        ch.set_point([X, Y], &p, [roles::X, roles::Y], "coords");
    } else if ctx.has("x") || ctx.has("y") || (own_children.is_empty() && base_children.is_empty())
    {
        for (i, name, role) in [(X, "x", roles::X), (Y, "y", roles::Y)] {
            match ctx.scalar(name)? {
                Some(SourcePlan::Literal(v)) => {
                    ch.role_from_attr(role, name);
                    ch.set_essential(i, role, v);
                }
                Some(plan) => ch.set(i, plan),
                None => ch.set_essential(i, role, 0.0),
            }
        }
    } else {
        let nodes = if own_children.is_empty() {
            base_children
        } else {
            own_children
        };
        let p = PointPlan::Tuple(ctx.tuple(&nodes)?);
        ch.set_point([X, Y], &p, [roles::X, roles::Y], "children");
    }
    // `hide` is a 0/1 cell: a bare or literal flag, or a bound cell; a
    // copy inherits the original's.
    match ctx.attr("hide") {
        Some(a) if ctx.single_macro(a).is_some() => {
            let plan = ctx.scalar_of("hide", d.attr_children(a))?;
            ch.set(HIDE, plan);
        }
        Some(_) => {
            // The copy's own attribute wins: `hide="false"` reveals a
            // copy of a hidden point, as in the current core.
            let owner = if d.attr(el, "hide").is_some() {
                el
            } else {
                base.unwrap()
            };
            let on = ctx.attr_flag(owner, "hide");
            ch.set(HIDE, SourcePlan::Literal(if on { 1.0 } else { 0.0 }));
        }
        None => ch.set(
            HIDE,
            if base.is_some() {
                SourcePlan::Inherit
            } else {
                SourcePlan::Default(0.0)
            },
        ),
    }
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
    if let Some(&c) = constraints.first() {
        if constraints.len() > 1 {
            return Err(Error::Unsupported(
                "more than one constraint on a point".into(),
            ));
        }
        wrap_constraint(ctx, &mut ch, c)?;
    }
    Ok(ch)
}

/// Move the planned coordinates of a point to hidden raw slots and make
/// the public `x`, `y` their projection onto the constraint.
fn wrap_constraint(ctx: &mut PlanCtx<'_, '_>, ch: &mut ElemPlan, c: NodeId) -> Result<()> {
    let d = ctx.dast();
    let (px, py) = (
        ch.props[X].take().expect("x planned"),
        ch.props[Y].take().expect("y planned"),
    );
    let raw_x = ch.hidden(px);
    let raw_y = ch.hidden(py);
    // The raw coordinates are the essential state now; keep their roles.
    ch.move_role(roles::X, raw_x);
    ch.move_role(roles::Y, raw_y);
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
            let snap = |ch: &mut ElemPlan, raw: usize, step: f64, offset: f64| -> SourcePlan {
                let mut cur = raw;
                if offset != 0.0 {
                    cur = ch.hidden(SourcePlan::computed(
                        OpSpec::Offset { k: -offset },
                        vec![cur],
                    ));
                }
                if step != 1.0 {
                    cur = ch.hidden(SourcePlan::computed(
                        OpSpec::Scale { k: 1.0 / step },
                        vec![cur],
                    ));
                }
                cur = ch.hidden(SourcePlan::computed(OpSpec::Round, vec![cur]));
                if step != 1.0 {
                    cur = ch.hidden(SourcePlan::computed(OpSpec::Scale { k: step }, vec![cur]));
                }
                if offset != 0.0 {
                    return SourcePlan::computed(OpSpec::Offset { k: offset }, vec![cur]);
                }
                SourcePlan::own(cur)
            };
            let px = snap(ch, raw_x, dx, xo);
            let py = snap(ch, raw_y, dy, yo);
            ch.set(X, px);
            ch.set(Y, py);
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
            let mut refs = |ch: &mut ElemPlan, props: &[&str]| -> Vec<usize> {
                props
                    .iter()
                    .map(|pr| ch.hidden(SourcePlan::reference(ctx.with_prop(p, pr))))
                    .collect()
            };
            match target {
                ComponentType::Circle => {
                    let c = refs(ch, &["cx", "cy", "radius"]);
                    ch.set_vec(
                        X,
                        VecOp::ProjectCircle,
                        vec![raw_x, raw_y, c[0], c[1], c[2]],
                    );
                }
                ComponentType::Function | ComponentType::Derivative => {
                    // The point rides the curve: `x` is what was asked
                    // and `y` is f(x). (The current core moves to the
                    // nearest point of the curve instead.)
                    let f = refs(ch, &["expr"]);
                    ch.set(X, SourcePlan::own(raw_x));
                    ch.set(
                        Y,
                        SourcePlan::computed(OpSpec::Sym(SymKind::EvalAt), vec![f[0], raw_x]),
                    );
                }
                ComponentType::Line | ComponentType::LineSegment => {
                    let l = refs(ch, &["x1", "y1", "x2", "y2"]);
                    ch.set_vec(
                        X,
                        VecOp::ProjectLine,
                        vec![raw_x, raw_y, l[0], l[1], l[2], l[3]],
                    );
                }
                other => {
                    return Err(Error::Unsupported(format!(
                        "constrainTo a <{}>",
                        other.tag()
                    )));
                }
            }
        }
        other => return Err(Error::Unsupported(format!("<{other}> constraint"))),
    }
    Ok(())
}
