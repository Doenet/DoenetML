//! `<curve>` and `<equilibriumCurve>` (ADR 0049): the graph of a function,
//! a parametric curve `(x(t), y(t))` for `t` from `parMin` to `parMax`, or
//! a Bézier spline through points.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::components::values::curve::{
    self as function, FunctionParts, function_curve, plan_domain, referenced_function, whole_line,
};
use crate::error::{Error, Result};
use crate::program::{BEZIER_POINT_CELLS, SymKind, bezier_controls};

component! {
    /// `<curve>(5t^3, 3t^5)</curve>`, `<curve><function>x^2</function></curve>`
    /// or `<curve through="(1,2) (3,4) (-5,6)"/>`. `curveType` is 0 for a
    /// function's graph, 1 for a parametric curve and 2 for a Bézier
    /// spline, as the current core's `function`, `parameterization` and
    /// `bezier`. Its curve is `SAMPLES` points: a function's values from
    /// `samples` on over `xmin` to `xmax`, the graph's range cut to the
    /// function's domain; otherwise their x-coordinates from `samplesX` on
    /// and their y-coordinates from `samples` on, at parameters spaced
    /// evenly from `parMin` to `parMax` (`parametric` is 1).
    tags: ["curve"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        curveType: by_planner { rendered },
        parMin: by_planner { rendered },
        parMax: by_planner { rendered },
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        // Always 1: it has a curve.
        curve: by_planner { rendered },
        parametric: by_planner { rendered },
        samples: by_planner { rendered, sampled: curve },
        samplesX: by_planner { rendered, sampled: parametric },
    }
    list {
        names: [throughPoints, through],
        item: throughPoint,
        coords: [throughX, throughY],
        alternate_name: throughPointX,
        attribute: through,
        // A through point's drag requests it; the renderer draws each.
        interactive: true,
        rendered: true,
    }
    attributes {
        through: Points,
        parMin: Scalar,
        parMax: Scalar,
        variable: Math,
        splineTension: Number(0.8),
        splineForm: Text,
    }
    children: Math { functions: [Function], controls: [BezierControls] },
    planner: Plan(plan),
}

/// `<bezierControls>`: a `<curve>`'s control vectors, one per through point
/// in order: written as vectors `(3,1) (-1,5)`, each the point's control
/// vector toward the previous point (the one toward the next is its
/// opposite), or as `<controlVectors>`.
pub(crate) mod bezier_controls_tag {
    use super::*;

    component! {
        /// `<bezierControls>(3,1) (-1,5)</bezierControls>`.
        tags: ["bezierControls"],
        flags: [owned],
        children: Math { entries: [ControlVectors] },
        owner: Curve,
    }
}

/// `<controlVectors direction="both">(-1,5) (4,2)</controlVectors>`: a
/// through point's control vectors: with `direction` `symmetric` (the
/// default with one vector) the one toward the previous point and its
/// opposite, `both` (the default with two) each, `previous` or `next` one
/// side, the other from the spline, `none` both from the spline;
/// `pointNumber` names the point, else the next after the last named.
pub(crate) mod control_vectors_tag {
    use super::*;

    component! {
        /// `<controlVectors>`.
        tags: ["controlVectors"],
        flags: [owned],
        attributes {
            direction: Text,
            pointNumber: Literal(0.0),
        }
        children: Math { vectors: [Vector] },
        owner: BezierControls,
    }
}

/// How a parametric or function curve's pieces were given: their
/// expressions and parts.
type Coordinate = (Source, FunctionParts);

/// The coordinates the children give: a function's, or each entry of a
/// tuple written as math in `variable`.
fn coordinates(ctx: &mut PlanCtx<'_, '_>, attrs: &Attrs) -> Result<Vec<Coordinate>> {
    let variable: Source = match attrs.variable.as_deref() {
        None => ctx.symbol("x"),
        Some(nodes) => {
            let (toks, _) = ctx.math_tokens(nodes)?;
            match &toks[..] {
                [Token::Ident(v)] => ctx.symbol(v),
                [Token::Cell(p)] => Source::reference(ctx.with_prop(*p, "expr")?),
                _ => {
                    return Err(Error::Unsupported(
                        "a curve's `variable` that is no symbol".into(),
                    ));
                }
            }
        }
    };
    let in_variable = |variable: &Source| FunctionParts {
        variable: variable.clone().into(),
        domain: whole_line(),
        plain: false,
    };
    let mut out = Vec::new();
    if let Some(nodes) = attrs.children.as_deref() {
        // `$f`: the function it names.
        if let Some(f) = referenced_function(ctx, nodes)? {
            return Ok(vec![f]);
        }
        let (toks, _) = ctx.math_tokens(nodes)?;
        let entries = tuple_entries(&toks).unwrap_or_else(|| vec![toks.clone()]);
        for entry in entries {
            out.push((ctx.sym_tokens(&entry)?, in_variable(&variable)));
        }
        return Ok(out);
    }
    for member in &attrs.functions {
        let f = function::Attrs::of(&member.record);
        let nodes = f.children.unwrap_or_default();
        if let Some(f) = referenced_function(ctx, &nodes)? {
            out.push(f);
            continue;
        }
        let var = match f.variables {
            Some(_) => ctx.symbol(&function_variables(f.variables.clone()).remove(0)),
            None => variable.clone(),
        };
        let (domain, _) = plan_domain(ctx, f.domain.as_deref())?;
        let (toks, _) = ctx.math_tokens(&nodes)?;
        // A function returning a tuple gives both coordinates.
        let entries = tuple_entries(&toks).unwrap_or_else(|| vec![toks.clone()]);
        for entry in entries {
            out.push((
                ctx.sym_tokens(&entry)?,
                FunctionParts {
                    variable: var.clone().into(),
                    domain: domain.clone(),
                    plain: false,
                },
            ));
        }
    }
    Ok(out)
}

/// The control vectors `<bezierControls>` gives each of `n` through points,
/// as [`SymKind::SampleBezier`] reads them: the one toward the previous
/// point, the one toward the next, and how they are given.
fn given_controls(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    attrs: &Attrs,
    n: usize,
) -> Result<Vec<[Wire; 5]>> {
    let none = || {
        [
            Wire::absent(),
            Wire::absent(),
            Wire::absent(),
            Wire::absent(),
            Wire::constant(bezier_controls::NONE),
        ]
    };
    let mut out: Vec<[Wire; 5]> = (0..n).map(|_| none()).collect();
    let Some(controls) = attrs.controls.first() else {
        return Ok(out);
    };
    let controls_attrs = bezier_controls_tag::Attrs::of(&controls.record);
    // Written as vectors: each symmetric.
    let mut written: Vec<(Option<usize>, Option<String>, Vec<[Source; 2]>)> = Vec::new();
    if let Some(nodes) = controls_attrs.children.as_deref() {
        let (toks, _) = ctx.math_tokens(nodes)?;
        for v in vectors_in(&toks) {
            written.push((None, None, vec![vector(&v)?]));
        }
    }
    for member in &controls_attrs.entries {
        let cv = control_vectors_tag::Attrs::of(&member.record);
        let mut vs = Vec::new();
        if let Some(nodes) = cv.children.as_deref() {
            let (toks, _) = ctx.math_tokens(nodes)?;
            for v in vectors_in(&toks) {
                vs.push(vector(&v)?);
            }
        }
        for v in &cv.vectors {
            let nodes = crate::components::geometry::vector::Attrs::of(&v.record)
                .children
                .unwrap_or_default();
            vs.push(ctx.tuple(&nodes)?);
        }
        let k = cv
            .pointNumber
            .ok()
            .filter(|k| k.is_finite() && *k >= 1.0)
            .map(|k| k as usize - 1);
        written.push((k, cv.direction, vs));
    }
    let mut next = 0;
    for (k, direction, vs) in written {
        let k = k.unwrap_or(next);
        next = k + 1;
        if k >= n {
            continue;
        }
        let direction = direction
            .map(|d| d.trim().to_ascii_lowercase())
            .unwrap_or_else(|| {
                if vs.len() >= 2 {
                    "both".into()
                } else {
                    "symmetric".into()
                }
            });
        let given = |s: &Source| Wire::from(s.clone());
        let mut opposite = |s: &Source| -> Wire {
            match s {
                Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Wire::constant(-v),
                s => Wire::computed(OpSpec::Negate, vec![wiring.hidden(s.clone())]),
            }
        };
        out[k] = match (direction.as_str(), &vs[..]) {
            ("none", _) => none(),
            ("symmetric", [[x, y], ..]) => {
                let (ox, oy) = (opposite(x), opposite(y));
                [
                    given(x),
                    given(y),
                    ox,
                    oy,
                    Wire::constant(bezier_controls::BOTH),
                ]
            }
            ("both", [[x1, y1], [x2, y2], ..]) => [
                given(x1),
                given(y1),
                given(x2),
                given(y2),
                Wire::constant(bezier_controls::BOTH),
            ],
            ("previous", [[x, y], ..]) => [
                given(x),
                given(y),
                Wire::absent(),
                Wire::absent(),
                Wire::constant(bezier_controls::PREVIOUS),
            ],
            ("next", [[x, y], ..]) => [
                Wire::absent(),
                Wire::absent(),
                given(x),
                given(y),
                Wire::constant(bezier_controls::NEXT),
            ],
            _ => {
                return Err(Error::Unsupported(format!(
                    "control vectors with direction `{direction}` and {} vectors",
                    vs.len()
                )));
            }
        };
    }
    Ok(out)
}

/// The vectors written in math text, `(3,1) (-1,5)`: each parenthesized
/// pair's tokens.
fn vectors_in(toks: &[Token]) -> Vec<Vec<Token>> {
    let mut out = Vec::new();
    let mut depth = 0;
    let mut start = 0;
    for (i, t) in toks.iter().enumerate() {
        match t {
            Token::LParen => {
                if depth == 0 {
                    start = i;
                }
                depth += 1;
            }
            Token::RParen => {
                depth -= 1;
                if depth == 0 {
                    out.push(toks[start..=i].to_vec());
                }
            }
            _ => {}
        }
    }
    out
}

/// A vector `(a, b)` as its two coordinates, numbers or references.
fn vector(toks: &[Token]) -> Result<[Source; 2]> {
    let entries = tuple_entries(toks)
        .filter(|e| e.len() == 2)
        .ok_or_else(|| Error::Unsupported("a control vector that is not (a, b)".into()))?;
    let coord = |e: &[Token]| -> Result<Source> {
        Ok(match e {
            [Token::Num(v)] => Source::given(*v),
            [Token::Op('-'), Token::Num(v)] => Source::given(-v),
            [Token::Cell(p)] => Source::reference(*p),
            _ => {
                return Err(Error::Unsupported(
                    "a control vector's coordinate that is not a number or a reference".into(),
                ));
            }
        })
    };
    Ok([coord(&entries[0])?, coord(&entries[1])?])
}

/// The wires of a curve's table, in order, and its through points.
pub(crate) struct CurveWires {
    props: [Wire; 9],
    points: Vec<[Wire; 2]>,
}

/// Plans a curve of type `component_type`, whose table starts as a
/// `<curve>`'s.
pub(crate) fn plan_curve(
    ctx: &mut PlanCtx<'_, '_>,
    component_type: ComponentType,
) -> Result<(ElemWiring, CurveWires)> {
    let attrs = Attrs::of(ctx.record());
    let at = Props::PORTS;
    let n = attrs.through.len();
    let mut wiring = ElemWiring::with_list(component_type, n);
    let constant = Wire::constant;
    if n > 0 {
        // A Bézier spline through the points.
        if 1 + n * BEZIER_POINT_CELLS > crate::limits::MAX_VEC_IN * 4 {
            return Err(Error::Unsupported("a curve through so many points".into()));
        }
        let points: Vec<[Wire; 2]> = attrs
            .through
            .iter()
            .enumerate()
            .map(|(k, p)| Wire::point(p, attr::through, k))
            .collect();
        let uniform = match attrs.splineForm.as_deref().map(str::trim) {
            None | Some("centripetal") => false,
            Some("uniform") => true,
            Some(other) => {
                return Err(Error::Unsupported(format!("splineForm=\"{other}\"")));
            }
        };
        let controls = given_controls(ctx, &mut wiring, &attrs, n)?;
        let mut inputs = vec![wiring.hidden_wire(constant(attrs.splineTension))];
        for (k, c) in controls.into_iter().enumerate() {
            let [x, y] = wiring.item(k);
            inputs.extend([x, y]);
            for w in c {
                inputs.push(wiring.hidden_wire(w));
            }
        }
        let sample = |coord: u8| {
            Wire::computed(
                OpSpec::Sym(SymKind::SampleBezier { coord, uniform }),
                inputs.clone(),
            )
        };
        let props = [
            constant(2.0),
            constant(0.0),
            constant((n - 1) as f64),
            Wire::absent(),
            Wire::absent(),
            constant(1.0),
            constant(1.0),
            sample(1),
            sample(0),
        ];
        return Ok((wiring, CurveWires { props, points }));
    }
    let coords = coordinates(ctx, &attrs)?;
    match coords.len() {
        // A function's graph.
        1 => {
            let (expr, parts) = coords.into_iter().next().unwrap();
            let expr = wiring.hidden(expr);
            let variable = wiring.hidden_wire(parts.variable);
            let domain = parts.domain.map(|w| wiring.hidden_wire(w));
            let [xmin, xmax, samples] = function_curve(
                ctx,
                &mut wiring,
                false,
                [expr, variable],
                domain,
                [at.xmin, at.xmax],
            );
            let props = [
                constant(0.0),
                Wire::own(at.xmin),
                Wire::own(at.xmax),
                xmin,
                xmax,
                constant(1.0),
                constant(0.0),
                samples,
                Wire::absent(),
            ];
            Ok((
                wiring,
                CurveWires {
                    props,
                    points: Vec::new(),
                },
            ))
        }
        // A parametric curve.
        2 => {
            let range = |source: Option<Source>, a: Attr, default: f64| match source {
                Some(source) => Wire::scalar(source, GivenId::Attr(a, 0)),
                None => constant(default),
            };
            let mut sample = |(expr, parts): Coordinate| {
                let expr = wiring.hidden(expr);
                let variable = wiring.hidden_wire(parts.variable);
                let domain = parts.domain.map(|w| wiring.hidden_wire(w));
                let mut inputs = vec![at.parMin, at.parMax];
                for w in whole_line() {
                    inputs.push(wiring.hidden_wire(w));
                }
                inputs.extend([expr, variable]);
                inputs.extend(domain);
                Wire::computed(OpSpec::Sym(SymKind::SampleFunction), inputs)
            };
            let mut coords = coords.into_iter();
            let (x, y) = (coords.next().unwrap(), coords.next().unwrap());
            let props = [
                constant(1.0),
                range(attrs.parMin, attr::parMin, -10.0),
                range(attrs.parMax, attr::parMax, 10.0),
                Wire::absent(),
                Wire::absent(),
                constant(1.0),
                constant(1.0),
                sample(y),
                sample(x),
            ];
            Ok((
                wiring,
                CurveWires {
                    props,
                    points: Vec::new(),
                },
            ))
        }
        k => Err(Error::Unsupported(format!(
            "a curve of {k} coordinates: give one function, two, or `through` points"
        ))),
    }
}

/// Plans a curve.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let (mut wiring, wires) = plan_curve(ctx, ComponentType::Curve)?;
    wires.finish(&mut wiring, []);
    Ok(wiring)
}

impl CurveWires {
    /// Its table's wires, then `extra`, and its through points, into
    /// `wiring`: for a type whose table starts as a `<curve>`'s.
    pub(crate) fn finish(self, wiring: &mut ElemWiring, extra: impl IntoIterator<Item = Wire>) {
        wiring.set_public(self.props.into_iter().chain(extra));
        wiring.set_list(self.points);
    }
}

#[cfg(all(test, feature = "testing"))]
#[path = "curve.spec.rs"]
mod spec;
