//! `<point>`: its definition and its planner (ADR 0016). Its coordinates
//! come from `coords`, from `x` and `y`, or from `(a, b)` children; a
//! constraint child wraps them in a projection.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{SymKind, VecOp};
use crate::tick::snap::Shape;

component! {
    /// `<point>`. `coords` combines `x` and `y`.
    tags: ["point"],
    flags: [copyable, located],
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
    sticky: Shape::Point,
    attributes {
        coords: Point,
        x: Scalar,
        y: Scalar,
        hide: Flag(false),
    }
    children: Math {
        constraints: [ConstrainTo, ConstrainToGrid],
    },
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
        hide: Source::given(hide).into(),
    });
    wiring.finish().0
}

/// Plans a point: coordinates from `coords`, from `x`/`y`, or from
/// `(a, b)` children; a constraint child wraps them in a projection.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let mut wiring = ElemWiring::of(ComponentType::Point);
    let attrs = Attrs::of(ctx.record());
    // A coordinate the children give is a given leaf of the children,
    // the element's own or its referent's, which a copy then shares.
    let children_leaf = |j: usize| GivenId::Children(j as u32);
    let [x, y] = if let Some(coords) = attrs.coords {
        let p = coords.point()?;
        Wire::point(&p, attr::coords, 0)
    } else if let (None, None, Some(nodes)) = (&attrs.x, &attrs.y, &attrs.children) {
        // The point's `(a, b)` children, which a copy then shares.
        let p = GivenPoint::Tuple(ctx.tuple(nodes)?);
        Wire::point_given(&p, children_leaf)
    } else {
        // A coordinate the element does not give comes from its `(a, b)`
        // children when it has them (an extend writing one coordinate of
        // a point written as children), else it is the element's own
        // state at 0.
        let from_children = match &attrs.children {
            Some(nodes) => {
                let p = GivenPoint::Tuple(ctx.tuple(nodes)?);
                Wire::point_given(&p, children_leaf).map(Some)
            }
            None => [None, None],
        };
        let coord = |name: Attr, source: Option<Source>, inherited: Option<Wire>| -> Wire {
            match source {
                Some(source) => Wire::scalar(source, GivenId::Attr(name, 0)),
                None => inherited.unwrap_or_else(|| Wire::given_by(name, 0.0)),
            }
        };
        let [cx, cy] = from_children;
        [coord(attr::x, attrs.x, cx), coord(attr::y, attrs.y, cy)]
    };
    // `hide` is a 0/1 cell: a bare or literal flag, or a bound cell; a
    // copy inherits the original's.
    let hide = Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0));
    // Constraints sit directly under the point or in <constraints>, the
    // element's own or, when it has none, its referent's.
    let [x, y] = match attrs.constraints.as_slice() {
        [] => [x, y],
        [c] => constrain(ctx, &mut wiring, [x, y], c)?,
        _ => {
            return Err(Error::Unsupported(
                "more than one constraint on a point".into(),
            ));
        }
    };
    wiring.set_public(Props { x, y, hide });
    Ok(wiring)
}

/// The point's coordinates as planned so far move to hidden raw ports,
/// with their shared state, since they are its state; the public `x`, `y` are
/// their projection onto the constraint.
fn constrain(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    [x, y]: [Wire; 2],
    c: &Member,
) -> Result<[Wire; 2]> {
    let raw_x = wiring.hidden_wire(x);
    let raw_y = wiring.hidden_wire(y);
    let at = Props::PORTS;
    match c.component_type {
        ComponentType::ConstrainToGrid => {
            let grid = super::constrain_to_grid::Attrs::of(&c.record);
            let num = |v: Result<f64>, name: &str| -> Result<f64> {
                v.map_err(|_| Error::BadLiteralParam(name.into()))
            };
            let (dx, dy) = (num(grid.dx, "dx")?, num(grid.dy, "dy")?);
            let (xo, yo) = (num(grid.xoffset, "xoffset")?, num(grid.yoffset, "yoffset")?);
            let snap = |wiring: &mut ElemWiring, raw: Port, step: f64, offset: f64| -> Wire {
                let mut cur = raw;
                if offset != 0.0 {
                    cur = wiring.hidden(Source::computed_k(OpSpec::Sub, cur, offset));
                }
                if step != 1.0 {
                    cur = wiring.hidden(Source::computed_k(OpSpec::Div, cur, step));
                }
                cur = wiring.hidden(Source::computed(OpSpec::Round, vec![cur]));
                if step != 1.0 {
                    cur = wiring.hidden(Source::computed_k(OpSpec::Mul, cur, step));
                }
                if offset != 0.0 {
                    return Source::computed_k(OpSpec::Add, cur, offset).into();
                }
                Wire::own(cur)
            };
            let x = snap(wiring, raw_x, dx, xo);
            let y = snap(wiring, raw_y, dy, yo);
            Ok([x, y])
        }
        _ => {
            let ChildValue::Reference(p) = super::constrain_to::Attrs::of(&c.record).children.value
            else {
                return Err(Error::Unsupported(
                    "<constrainTo> without a reference".into(),
                ));
            };
            let target = ctx.reference_type(p)?.ok_or_else(|| {
                Error::Unsupported("<constrainTo> must name a component in the same scope".into())
            })?;
            let mut refs = |wiring: &mut ElemWiring, props: &[&'static str]| -> Result<Vec<Port>> {
                props
                    .iter()
                    .map(|pr| Ok(wiring.hidden(Source::reference(ctx.with_prop(p, pr)?))))
                    .collect()
            };
            match target {
                ComponentType::Circle => {
                    let c = refs(wiring, &["cx", "cy", "radius"])?;
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
                    let f = refs(wiring, &["expr"])?;
                    Ok([
                        Wire::own(raw_x),
                        Wire::computed(OpSpec::Sym(SymKind::EvalAt), vec![f[0], raw_x]),
                    ])
                }
                ComponentType::Line | ComponentType::LineSegment => {
                    let l = refs(wiring, &["x1", "y1", "x2", "y2"])?;
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
    }
}
