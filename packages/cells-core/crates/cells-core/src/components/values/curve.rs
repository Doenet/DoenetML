//! `<function>` and `<derivative>`, which share their table: their
//! definitions and their planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::prop::graph;
use crate::components::{ComponentDef, ComponentType, ConstrainTarget};
use crate::error::Result;
use crate::program::{Post, SymKind, VecOp};

component! {
    /// `<function>`: a math cell `expr` in its variable (`x`, or the one
    /// `variables` names), its domain (ADR 0049) and, as a curve, the
    /// `SAMPLES` cells from `samples` on, filled by a `Sample` instruction
    /// over the enclosing graph's x-range cut to the domain. Drawn in a
    /// graph, as its curve through the samples when `curve` is 1; in text
    /// it has no view yet.
    tags: ["function"],
    flags: [copyable, symbolic],
    renders: InGraph,
    roles: [Function],
    default_prop: expr,
    props {
        expr: children { expr_of: expr },
        // The math cell holding its variable's symbol: `x` unless
        // `variables` names another.
        variable: by_planner,
        // Its domain (ADR 0049), read as the current core parses an
        // interval: the endpoints, -∞ and ∞ without one, and whether each
        // end is closed (1) or open (0).
        domainMin: by_planner,
        domainMax: by_planner,
        domainMinClosed: by_planner,
        domainMaxClosed: by_planner,
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        // 1 when the function has a curve, 0 when it has none (it takes
        // several variables or returns a tuple): a fact about the source,
        // so the bridge need not ask how `samples` is computed.
        curve: by_planner { rendered },
        // `samples` is the first of `SAMPLES` consecutive cells, outputs
        // with it when `curve` is 1 (`sampled`).
        samples: by_planner { rendered, sampled: curve },
    }
    // A point constrained to a function rides its graph: `x` is what was
    // asked, held in the domain, and `y` is f(x). (The current core moves
    // to the nearest point of the curve instead.)
    constrain_target { function: expr }
    attributes {
        variables: Text,
        domain: Math,
    }
    children: Math,
    planner: Plan(plan),
}

/// `<derivative>$f</derivative>`: d/dx of a function or math, sampled
/// like a function; a function's definition under its own tag. Of a
/// function, it is in the function's variable and has its domain.
// A derivative is no function a `<functionIterates>` iterates.
pub(crate) const DERIVATIVE: ComponentDef = DEFINITION.with_tags(&["derivative"]).roles(&[]);

/// The position of `expr`: the function's expression, a math cell.
pub const EXPR: usize = Props::AT.expr;
/// The position of `xmin`: where the samples start, the graph's `xmin`.
pub const XMIN: usize = Props::AT.xmin;
/// The position of `xmax`: where the samples end, the graph's `xmax`.
pub const XMAX: usize = Props::AT.xmax;
/// The position of `curve`: 1 when the function has a curve, 0 when not.
pub const CURVE: usize = Props::AT.curve;
/// The position of `samples`: the first of the curve's sample cells.
pub const SAMPLES: usize = Props::AT.samples;

/// Whether a `<function>` with `variables` and text `mt` takes several
/// variables or returns a tuple.
fn is_vector_function(variables: Option<String>, mt: &MathText) -> bool {
    function_variables(variables).len() > 1
        || tuple_entries(mt.tokens()).is_some_and(|entries| entries.len() > 1)
}

/// What a function of one variable is besides its expression (ADR 0049):
/// its variable and its domain, each a wire of its table's props.
pub(crate) struct FunctionParts {
    /// The math cell holding the variable's symbol.
    pub(crate) variable: Wire,
    /// The domain's lower and upper endpoints and whether each is closed.
    pub(crate) domain: [Wire; 4],
    /// Whether the variable is `x` and the domain the whole line, as the
    /// source says: a curve sampled as before domains, with no cut.
    pub(crate) plain: bool,
}

impl FunctionParts {
    /// In `x`, on the whole line: a function with no domain.
    pub(crate) fn plain() -> Self {
        FunctionParts {
            variable: Wire::absent(),
            domain: whole_line(),
            plain: true,
        }
    }
}

/// The whole line as a domain's four wires: open at both infinite ends, as
/// the current core stores a function's default domain.
pub(crate) fn whole_line() -> [Wire; 4] {
    [
        Wire::constant(f64::NEG_INFINITY),
        Wire::constant(f64::INFINITY),
        Wire::constant(0.0),
        Wire::constant(0.0),
    ]
}

/// The domain an element's `domain` attribute writes (ADR 0049), as four
/// wires: the endpoints (one that is no number is NaN) and closedness; the whole line without one, and with
/// a warning when it is not one interval. The second is whether one was
/// given.
pub(crate) fn plan_domain(
    ctx: &mut PlanCtx<'_, '_>,
    nodes: Option<&[crate::dast::NodeId]>,
) -> Result<([Wire; 4], bool)> {
    let Some(nodes) = nodes else {
        return Ok((whole_line(), false));
    };
    let Some(iv) = ctx.interval(nodes)? else {
        ctx.warn(
            "cells-bad-domain",
            "`domain` is not one interval such as [a, b) or (-infinity, b]: \
             the function is defined on the whole line.",
        );
        return Ok((whole_line(), false));
    };
    // An endpoint that is no number stays one: no bound for the function
    // itself, a piece left out of a piecewise function.
    let end = |source: Source, k: u32| -> Wire {
        match source {
            Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) if !v.is_nan() => Wire::constant(v),
            source => Wire::scalar(source, GivenId::Attr(attr::domain, k)),
        }
    };
    let lo = end(iv.lo, 0);
    let hi = end(iv.hi, 1);
    let flag = |closed: bool| Wire::constant(if closed { 1.0 } else { 0.0 });
    Ok(([lo, hi, flag(iv.lo_closed), flag(iv.hi_closed)], true))
}

/// The x-range a curve is sampled over: the graph's it sits in, else
/// [-10, 10].
pub(crate) fn graph_range(ctx: &PlanCtx<'_, '_>) -> [Wire; 2] {
    match (
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmin),
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmax),
    ) {
        (Some(xmin), Some(xmax)) => [xmin.into(), xmax.into()],
        _ => [Wire::constant(-10.0), Wire::constant(10.0)],
    }
}

/// The parts of the function `$f` names, when the math text `mt` is that
/// one reference and it names a function of one variable (ADR 0049): its
/// expression, variable and domain props, read through the reference.
pub(crate) fn referenced_function(
    ctx: &mut PlanCtx<'_, '_>,
    nodes: &[crate::dast::NodeId],
) -> Result<Option<(Source, FunctionParts)>> {
    let (toks, _) = ctx.math_tokens(nodes)?;
    let [Token::Cell(p)] = toks[..] else {
        return Ok(None);
    };
    let Some(ty) = ctx.reference_type(p)? else {
        return Ok(None);
    };
    let Some(ConstrainTarget::Graph {
        expr,
        function: true,
    }) = ty.def().constrain_target
    else {
        return Ok(None);
    };
    let mut prop =
        |name: &'static str| -> Result<Source> { Ok(Source::reference(ctx.with_prop(p, name)?)) };
    let [v, lo, hi, loc, hic] = crate::components::FUNCTION_PROPS;
    Ok(Some((
        prop(expr)?,
        FunctionParts {
            variable: prop(v)?.into(),
            domain: [
                prop(lo)?.into(),
                prop(hi)?.into(),
                prop(loc)?.into(),
                prop(hic)?.into(),
            ],
            plain: false,
        },
    )))
}

/// The curve of a function of one variable (ADR 0049): its x-range and
/// samples. A plain one is sampled in `x` over the graph's range; one
/// with a variable of its own or a domain over the range cut to the
/// domain, as one piece. The ports are the table's: its expression,
/// variable and domain, and the `xmin` and `xmax` the samples are spaced
/// over.
pub(crate) fn function_curve(
    ctx: &PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    plain: bool,
    [expr, variable]: [Port; 2],
    domain: [Port; 4],
    [xmin, xmax]: [Port; 2],
) -> [Wire; 3] {
    let [gxmin, gxmax] = graph_range(ctx);
    if plain {
        return [
            gxmin,
            gxmax,
            Wire::computed(OpSpec::Sym(SymKind::Sample), vec![expr, xmin, xmax]),
        ];
    }
    let gxmin = wiring.hidden_wire(gxmin);
    let gxmax = wiring.hidden_wire(gxmax);
    let range = wiring.hidden_vector(VecOp::DomainRange, vec![gxmin, gxmax, domain[0], domain[1]]);
    let mut inputs = vec![xmin, xmax];
    inputs.extend(one_piece(wiring, expr, variable, domain));
    [
        Wire::own(range[0]),
        Wire::own(range[1]),
        Wire::computed(OpSpec::Sym(SymKind::SampleFunction), inputs),
    ]
}

/// A function of one variable as [`SymKind::EvalFunction`] reads one
/// (ADR 0049): its domain, then one piece, its expression in its variable
/// on the whole line.
pub(crate) fn one_piece(
    wiring: &mut ElemWiring,
    expr: Port,
    variable: Port,
    domain: [Port; 4],
) -> Vec<Port> {
    let mut f = domain.to_vec();
    f.extend([expr, variable]);
    for w in whole_line() {
        f.push(wiring.hidden_wire(w));
    }
    f
}

/// A math cell `expr` and, as a curve, its samples over the x-range of
/// the graph it sits in, else [-10, 10], cut to its domain.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let component_type = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let nodes = attrs.children.unwrap_or_default();
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(component_type);
    let mt = ctx.math_text(&nodes)?;
    let is_function = component_type == ComponentType::Function;
    if is_function && is_vector_function(attrs.variables.clone(), &mt) {
        // Not a curve and not a math cell: a function of several
        // variables, or one returning a tuple, is only iterated
        // (`plan_function_iterates` reads its text).
        let [d0, d1, d2, d3] = whole_line();
        wiring.set_public(Props {
            expr: Wire::absent(),
            variable: Wire::absent(),
            domainMin: d0,
            domainMax: d1,
            domainMinClosed: d2,
            domainMaxClosed: d3,
            xmin: Wire::constant(-10.0),
            xmax: Wire::constant(10.0),
            curve: Wire::constant(0.0),
            samples: Wire::absent(),
        });
        return Ok(wiring);
    }
    let (expr, parts) = if is_function {
        let id = ctx.sym_math(&nodes, &mt)?;
        let var = function_variables(attrs.variables).remove(0);
        let (domain, has_domain) = plan_domain(ctx, attrs.domain.as_deref())?;
        let parts = FunctionParts {
            plain: var == "x" && !has_domain,
            variable: ctx.symbol(&var).into(),
            domain,
        };
        (Wire::from(Source::sym_expr(id, Post::None)), parts)
    } else {
        match referenced_function(ctx, &nodes)? {
            // A function's derivative: in its variable, on its domain.
            Some((f, parts)) => {
                let f = wiring.hidden(f);
                (
                    Wire::computed(OpSpec::Sym(SymKind::DerivativeBy), vec![f, at.variable]),
                    parts,
                )
            }
            None => {
                let id = ctx.sym_math(&nodes, &mt)?;
                let of = wiring.hidden(Source::sym_expr(id, Post::None));
                (
                    Wire::computed(OpSpec::Sym(SymKind::Derivative), vec![of]),
                    FunctionParts {
                        variable: ctx.symbol("x").into(),
                        ..FunctionParts::plain()
                    },
                )
            }
        }
    };
    let domain_ports = [
        at.domainMin,
        at.domainMax,
        at.domainMinClosed,
        at.domainMaxClosed,
    ];
    let [xmin, xmax, samples] = function_curve(
        ctx,
        &mut wiring,
        parts.plain,
        [at.expr, at.variable],
        domain_ports,
        [at.xmin, at.xmax],
    );
    let [d0, d1, d2, d3] = parts.domain;
    wiring.set_public(Props {
        expr,
        variable: parts.variable,
        domainMin: d0,
        domainMax: d1,
        domainMinClosed: d2,
        domainMaxClosed: d3,
        xmin,
        xmax,
        curve: Wire::constant(1.0),
        samples,
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "curve.spec.rs"]
mod spec;
