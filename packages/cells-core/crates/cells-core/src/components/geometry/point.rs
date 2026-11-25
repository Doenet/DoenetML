//! `<point>`: its definition and its planner. Its coordinates
//! come from `coords`, from `xs`, from `x` and `y`, or from `(a, b)`
//! children; its constraints apply to them in order (ADR 0080).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::constrain::code;
use crate::program::{SymKind, VecOp};
use crate::tick::snap::Shape;

component! {
    /// `<point>`. `coords` combines `x` and `y`.
    tags: ["point"],
    flags: [copyable, located],
    roles: [ListPoint],
    text: Pair(x, y),
    extend_value: Point(props_of),
    default_prop: coords,
    props {
        x: by_planner { interactive, rendered },
        y: by_planner { interactive, rendered },
        // A boolean in the current core; here a 0/1 cell.
        hide: by_planner { rendered },
        // Whether any of its constraints applied (ADR 0080), 0/1.
        constraintUsed: by_planner,
        // Whether a drag may move it (ADR 0070), 0/1.
        draggable: by_planner { rendered },
    }
    combined_props {
        coords: [x, y],
    }
    // The current core's names of its coordinates.
    alternate_names {
        x1: x,
        x2: y,
    }
    // How the renderer draws it.
    presentation { markerStyle }
    sticky: Shape::Point,
    // A point constrained or attracted to a point is moved onto it: the
    // projection onto a line through it twice.
    constrain_target { ports: [x, y], shape: Point }
    attributes {
        coords: Point,
        x: Scalar,
        y: Scalar,
        hide: Flag(false),
        draggable: Flag(true),
        xs: Scalars,
    }
    // A click or a focus changes nothing of it; a button may wait on one
    // (`triggerWhenObjectsClicked`, ADR 0042).
    actions { pointClicked: nothing [Click], pointFocused: nothing [Focus] }
    children: Math {
        constraints: [
            ConstrainTo,
            ConstrainToGrid,
            AttractTo,
            AttractToGrid,
            ConstrainToGraph,
            ConstrainToInterior,
        ],
    },
    planner: Plan(plan),
}

/// `pointClicked` and `pointFocused`: no request; what waits on it acts.
fn nothing(_view: &crate::document::ActionView<'_>, _args: &[f64]) -> Vec<crate::tick::Request> {
    Vec::new()
}

/// The position of `x`: the point's first coordinate.
pub const X: usize = Props::AT.x;
/// The position of `y`: the point's second coordinate, right after `x`.
pub const Y: usize = Props::AT.y;
/// The position of `hide`: 1 when the point is hidden.
pub const HIDE: usize = Props::AT.hide;
// A sticky group reads a member's points as (x, y) pairs from the
// position its layout names (`sticky`, `document/sticky.rs`).
const _: () = assert!(Y == X + 1, "a point's y must follow its x");

/// A point's props from its two coordinates, as a `<math>` that is a pair
/// or a copy of a point's coordinates has them; `hide` is the default.
pub(crate) fn props_of(x: Source, y: Source) -> Vec<Source> {
    wiring_of(x, y).finish().0
}

/// A point's wiring from its two coordinates (`props_of`).
pub(crate) fn wiring_of(x: Source, y: Source) -> ElemWiring {
    let mut wiring = ElemWiring::of(ComponentType::Point);
    let hide = ComponentType::Point.prop_defs()[HIDE].default;
    wiring.set_planned(Planned {
        x: x.into(),
        y: y.into(),
        hide: Source::given(hide).into(),
        constraintUsed: Wire::constant(0.0),
        draggable: Wire::constant(1.0),
    });
    wiring
}

/// Plans a point: coordinates from `coords`, from `xs`, or from `(a, b)`
/// children, each overridden by `x` or `y`; its constraints, applied in
/// order, make what it shows of them (ADR 0080).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    plan_as(ctx, ComponentType::Point, [])
}

/// Plans an element of `component_type`, whose table starts as a point's
/// and whose attributes and children start as a point's declare them (an
/// `<equilibriumPoint>`, an `<endpoint>`), as a point; `extra` plans the
/// props its table has after a point's.
pub(super) fn plan_as(
    ctx: &mut PlanCtx<'_, '_>,
    component_type: ComponentType,
    extra: impl IntoIterator<Item = Wire>,
) -> Result<ElemWiring> {
    let mut wiring = ElemWiring::of(component_type);
    let attrs = Attrs::of(ctx.record());
    // What gives both coordinates, as the current core reads them: `coords`,
    // else `xs`, else the `(a, b)` children, which a copy then shares; `x`
    // and `y` override each.
    let children_leaf = |j: usize| GivenId::Children(j as u32);
    let base: [Option<Wire>; 2] = if let Some(coords) = attrs.coords {
        let p = coords.point()?;
        Wire::point(&p, attr::coords, 0).map(Some)
    } else if !attrs.xs.is_empty() {
        let [x, y] = <[Source; 2]>::try_from(attrs.xs)
            .map_err(|xs| Error::Unsupported(format!("a point with {} coordinates", xs.len())))?;
        [
            Some(Wire::scalar(x, GivenId::Attr(attr::xs, 0))),
            Some(Wire::scalar(y, GivenId::Attr(attr::xs, 1))),
        ]
    } else if let Some(nodes) = &attrs.children {
        let p = GivenPoint::Tuple(ctx.tuple(nodes)?);
        Wire::point_given(&p, children_leaf).map(Some)
    } else {
        [None, None]
    };
    // A coordinate nothing gives is the element's own state at 0.
    let coord = |name: Attr, source: Option<Source>, base: Option<Wire>| -> Wire {
        Wire::attr(name, source)
            .or(base)
            .unwrap_or_else(|| Wire::given_by(name, 0.0))
    };
    let [bx, by] = base;
    let [x, y] = [coord(attr::x, attrs.x, bx), coord(attr::y, attrs.y, by)];
    // `hide` is a 0/1 cell: a bare or literal flag, or a bound cell; a
    // copy inherits the original's.
    let hide = Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0));
    let draggable = Wire::scalar(attrs.draggable, GivenId::Attr(attr::draggable, 0));
    // Constraints sit directly under the point or in <constraints>, the
    // element's own or, when it has none, its referent's.
    let [x, y, constraint_used] = constrain(ctx, &mut wiring, [x, y], &attrs.constraints)?;
    wiring.set_public(
        Props {
            x,
            y,
            hide,
            constraintUsed: constraint_used,
            draggable,
        }
        .into_iter()
        .chain(extra),
    );
    Ok(wiring)
}

/// The point's coordinates as its constraints make them, and whether any
/// applied (ADR 0080). What was planned so far moves to hidden raw ports,
/// with their shared state; the public `x`, `y` are one operator's
/// outputs, every constraint applied in order, a request on them writing
/// the raw ports constrained. A point that rides a function's graph is the
/// one constraint that is no such operator: it stands alone.
fn constrain(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    [x, y]: [Wire; 2],
    constraints: &[Member],
) -> Result<[Wire; 3]> {
    if constraints.is_empty() {
        return Ok([x, y, Wire::constant(0.0)]);
    }
    let raw_x = wiring.hidden_wire(x);
    let raw_y = wiring.hidden_wire(y);
    if let [c] = constraints
        && let Some(on_graph) = ride_graph(ctx, wiring, [raw_x, raw_y], c)?
    {
        return Ok(on_graph);
    }
    let mut program = Program {
        args: vec![Arg::Own(raw_x), Arg::Own(raw_y)],
    };
    for c in constraints {
        program.push(ctx, wiring, c)?;
    }
    let n_in = program.args.len();
    if n_in > crate::program::MAX_VEC_IN {
        return Err(Error::Unsupported(format!(
            "constraints on a point reading {n_in} values, more than {}",
            crate::program::MAX_VEC_IN
        )));
    }
    let op = VecOp::Constrain { n_in: n_in as u8 };
    let out = wiring.hidden_vector_args(op, program.args);
    Ok([Wire::own(out[0]), Wire::own(out[1]), Wire::own(out[2])])
}

/// A constraint program's inputs as planned so far
/// (`program/constrain.rs`): the point's raw coordinates, then each
/// constraint's code and operands.
struct Program {
    args: Vec<Arg>,
}

impl Program {
    fn code(&mut self, code: f64) {
        self.args.push(Arg::Const(code));
    }

    /// A scalar operand: what the attribute gives, else `default`.
    fn scalar(&mut self, wiring: &mut ElemWiring, source: Option<Source>, default: f64) {
        match source {
            Some(s) => self.args.push(Arg::Own(wiring.hidden(s))),
            None => self.args.push(Arg::Const(default)),
        }
    }

    /// Constraint `c`'s code and operands.
    fn push(
        &mut self,
        ctx: &mut PlanCtx<'_, '_>,
        wiring: &mut ElemWiring,
        c: &Member,
    ) -> Result<()> {
        match c.component_type {
            ComponentType::ConstrainToGrid => {
                let g = super::constrain_to_grid::Attrs::of(&c.record);
                self.code(code::GRID);
                self.scalar(wiring, g.dx, 1.0);
                self.scalar(wiring, g.dy, 1.0);
                self.scalar(wiring, g.xoffset, 0.0);
                self.scalar(wiring, g.yoffset, 0.0);
            }
            ComponentType::AttractToGrid => {
                let g = super::attract_to_grid::Attrs::of(&c.record);
                self.code(code::ATTRACT_GRID);
                self.scalar(wiring, g.dx, 1.0);
                self.scalar(wiring, g.dy, 1.0);
                self.scalar(wiring, g.xoffset, 0.0);
                self.scalar(wiring, g.yoffset, 0.0);
                self.scalar(wiring, g.xthreshold, 0.2);
                self.scalar(wiring, g.ythreshold, 0.2);
                self.scalar(wiring, Some(g.includeGridlines), 0.0);
            }
            ComponentType::ConstrainToGraph => {
                let g = super::constrain_to_graph::Attrs::of(&c.record);
                // Outside a graph it holds nothing, as in the current core.
                let Some(bounds) = graph_props(ctx, ["xmin", "xmax", "ymin", "ymax"]) else {
                    return Ok(());
                };
                self.code(code::BOUNDS);
                for b in bounds {
                    self.args.push(Arg::Own(wiring.hidden(b)));
                }
                self.scalar(wiring, g.buffer, 0.01);
            }
            ComponentType::ConstrainTo | ComponentType::ConstrainToInterior => {
                let (children, relative) = if c.component_type == ComponentType::ConstrainTo {
                    let a = super::constrain_to::Attrs::of(&c.record);
                    (a.children, a.relativeToGraphScales)
                } else {
                    let a = super::constrain_to_interior::Attrs::of(&c.record);
                    (a.children, a.relativeToGraphScales)
                };
                let targets = targets(ctx, &children, c.component_type.tag())?;
                self.code(if c.component_type == ComponentType::ConstrainTo {
                    code::NEAREST
                } else {
                    code::INTERIOR
                });
                self.scales(ctx, wiring, relative);
                self.targets(ctx, wiring, &targets)?;
            }
            ComponentType::AttractTo => {
                let a = super::attract_to::Attrs::of(&c.record);
                let targets = targets(ctx, &a.children, "attractTo")?;
                self.code(code::ATTRACT);
                let in_graph = self.scales(ctx, wiring, a.relativeToGraphScales);
                // The default threshold is a fiftieth of the graph's scale
                // when measured in it, else half a unit, as in the current
                // core.
                let default = if a.relativeToGraphScales && in_graph {
                    0.02
                } else {
                    0.5
                };
                self.scalar(wiring, a.threshold, default);
                self.targets(ctx, wiring, &targets)?;
            }
            other => {
                return Err(Error::Unsupported(format!(
                    "<{}> among a point's constraints",
                    other.tag()
                )));
            }
        }
        Ok(())
    }

    /// The graph's scales when `relative` and the point is in a graph,
    /// else 1 and 1; whether they are the graph's.
    fn scales(
        &mut self,
        ctx: &mut PlanCtx<'_, '_>,
        wiring: &mut ElemWiring,
        relative: bool,
    ) -> bool {
        let bounds = relative
            .then(|| graph_props(ctx, ["xmin", "xmax", "ymin", "ymax"]))
            .flatten();
        let Some([xmin, xmax, ymin, ymax]) = bounds else {
            self.code(1.0);
            self.code(1.0);
            return false;
        };
        for (lo, hi) in [(xmin, xmax), (ymin, ymax)] {
            let lo = wiring.hidden(lo);
            let hi = wiring.hidden(hi);
            let scale = wiring.hidden(Source::computed(OpSpec::Sub, vec![hi, lo]));
            self.args.push(Arg::Own(scale));
        }
        true
    }

    /// How many targets, then each target's code and its props.
    fn targets(
        &mut self,
        ctx: &mut PlanCtx<'_, '_>,
        wiring: &mut ElemWiring,
        targets: &[RefId],
    ) -> Result<()> {
        self.code(targets.len() as f64);
        for &p in targets {
            match ctx.constrain_target(p)? {
                ConstrainTarget::Project { props, shape } => {
                    self.code(shape.code());
                    for pr in props {
                        let r = ctx.with_prop(p, pr)?;
                        self.args
                            .push(Arg::Own(wiring.hidden(Source::reference(r))));
                    }
                }
                ConstrainTarget::Polygon { closed, vertices } => {
                    let list = ctx.with_prop(p, "vertices")?;
                    let n = match vertices {
                        Some(n) => n,
                        None => ctx
                            .point_entries(vec![ListPiece::Reference(list)], f64::INFINITY)?
                            .len(),
                    };
                    self.code(if closed {
                        code::POLYGON
                    } else {
                        code::POLYLINE
                    });
                    self.code(n as f64);
                    for k in 0..n {
                        let at = GivenPoint::Item(list, k);
                        for j in 0..2 {
                            self.args.push(Arg::Own(wiring.hidden(at.coord(j))));
                        }
                    }
                }
                ConstrainTarget::Graph { .. } => {
                    return Err(Error::Unsupported(
                        "a point constrained to a graph among other constraints or targets".into(),
                    ));
                }
            }
        }
        Ok(())
    }
}

/// The props `names` of the graph the element sits in, None outside one.
fn graph_props<const N: usize>(ctx: &mut PlanCtx<'_, '_>, names: [&str; N]) -> Option<[Source; N]> {
    let mut out = Vec::with_capacity(N);
    for name in names {
        out.push(ctx.ancestor_prop(|ty| ty.graph_bounds().is_some(), name)??);
    }
    out.try_into().ok()
}

/// What a constraint's children name: one reference, or several written
/// apart (`<constrainTo>$l1 $l2</constrainTo>`).
fn targets(ctx: &mut PlanCtx<'_, '_>, children: &ValueChildren, tag: &str) -> Result<Vec<RefId>> {
    let unsupported = || Error::Unsupported(format!("<{tag}> without a reference"));
    match children.value {
        ChildValue::Reference(p) => Ok(vec![p]),
        ChildValue::Math if children.element.is_none() && children.references > 1 => {
            let (toks, _) = ctx.math_tokens(&children.nodes)?;
            toks.iter()
                .map(|t| match t {
                    Token::Cell(p) => Ok(*p),
                    _ => Err(unsupported()),
                })
                .collect()
        }
        _ => Err(unsupported()),
    }
}

/// A point riding the graph of what its one `<constrainTo>` names, when
/// that is a function or a curve given by one (`constrain_target { graph:
/// expr }`): `x` is what was asked and `y` the expression there (a
/// function's, held in its domain, ADR 0049). None for any other
/// constraint.
fn ride_graph(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    [raw_x, raw_y]: [Port; 2],
    c: &Member,
) -> Result<Option<[Wire; 3]>> {
    let at = Props::PORTS;
    let (p, attract) = match c.component_type {
        ComponentType::ConstrainTo => {
            let a = super::constrain_to::Attrs::of(&c.record);
            match a.children.value {
                ChildValue::Reference(p) => (p, false),
                _ => return Ok(None),
            }
        }
        ComponentType::AttractTo => {
            let a = super::attract_to::Attrs::of(&c.record);
            match a.children.value {
                ChildValue::Reference(p) => (p, true),
                _ => return Ok(None),
            }
        }
        _ => return Ok(None),
    };
    let ConstrainTarget::Graph { expr, function } = ctx.constrain_target(p)? else {
        return Ok(None);
    };
    if attract {
        return Err(Error::Unsupported("<attractTo> a function's graph".into()));
    }
    let _ = raw_y;
    let mut refs = |wiring: &mut ElemWiring, props: &[&'static str]| -> Result<Vec<Port>> {
        props
            .iter()
            .map(|pr| Ok(wiring.hidden(Source::reference(ctx.with_prop(p, pr)?))))
            .collect()
    };
    let used = Wire::constant(1.0);
    if !function {
        // Riding the target's graph: `x` is what was asked and `y` the
        // target's expression there.
        let f = refs(wiring, &[expr])?;
        return Ok(Some([
            Wire::own(raw_x),
            Wire::computed(OpSpec::Sym(SymKind::EvalAt), vec![f[0], raw_x]),
            used,
        ]));
    }
    // A function's (ADR 0049): `x` held in its domain, `y` the function
    // there.
    let mut props = vec![expr];
    props.extend(crate::components::FUNCTION_PROPS);
    let f = refs(wiring, &props)?;
    let domain = [f[2], f[3], f[4], f[5]];
    let mut held = vec![raw_x];
    held.extend(domain);
    let mut eval = vec![at.x];
    eval.extend(crate::components::values::curve::one_piece(
        wiring, f[0], f[1], domain,
    ));
    Ok(Some([
        Source::vector(VecOp::IntoDomain, held).into(),
        Wire::computed(OpSpec::Sym(SymKind::EvalFunction), eval),
        used,
    ]))
}
