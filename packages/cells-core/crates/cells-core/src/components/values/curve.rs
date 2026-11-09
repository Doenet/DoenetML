//! `<function>` and `<derivative>`, which share their table: their
//! definitions and their planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::prop::graph;
use crate::components::{ComponentDef, ComponentType};
use crate::error::Result;
use crate::program::{Post, SymKind};

component! {
    /// `<function>`: a math cell `expr` (variable `x`) and, as a curve, the
    /// `SAMPLES` cells from `samples` on, filled by a `Sample` instruction over
    /// the enclosing graph's x-range. Drawn in a graph, as its curve through
    /// the samples when `curve` is 1; in text it has no view yet.
    tags: ["function"],
    flags: [copyable, symbolic],
    renders: InGraph,
    default_prop: expr,
    props {
        expr: children { expr_of: expr },
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
    // asked and `y` is f(x). (The current core moves to the nearest point
    // of the curve instead.)
    constrain_target { graph: expr }
    attributes {
        variables: Text,
    }
    children: Math,
    planner: Plan(plan),
}

/// `<derivative>$f</derivative>`: d/dx of a function or math, sampled
/// like a function; a function's definition under its own tag.
pub(crate) const DERIVATIVE: ComponentDef = DEFINITION.with_tags(&["derivative"]);

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

/// A `<function>`'s `variables`, split at spaces and commas; `x` when
/// absent.
pub(crate) fn variables(text: Option<String>) -> Vec<String> {
    let vars: Vec<String> = text
        .map(|s| {
            s.split(|c: char| c.is_whitespace() || c == ',')
                .filter(|v| !v.is_empty())
                .map(str::to_string)
                .collect()
        })
        .unwrap_or_default();
    if vars.is_empty() {
        vec!["x".to_string()]
    } else {
        vars
    }
}

/// Whether a `<function>` with `variables` and text `mt` takes several
/// variables or returns a tuple.
fn is_vector_function(variables: Option<String>, mt: &MathText) -> bool {
    self::variables(variables).len() > 1
        || tuple_entries(mt.tokens()).is_some_and(|entries| entries.len() > 1)
}

/// A math cell `expr` and, as a curve, its samples over the x-range of
/// the graph it sits in, else [-10, 10].
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let component_type = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let nodes = attrs.children.unwrap_or_default();
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(component_type);
    let mt = ctx.math_text(&nodes)?;
    if component_type == ComponentType::Function && is_vector_function(attrs.variables, &mt) {
        // Not a curve and not a math cell: a function of several
        // variables, or one returning a tuple, is only iterated
        // (`plan_function_iterates` reads its text).
        wiring.set_public(Props {
            expr: Wire::absent(),
            xmin: Wire::constant(-10.0),
            xmax: Wire::constant(10.0),
            curve: Wire::constant(0.0),
            samples: Wire::absent(),
        });
        return Ok(wiring);
    }
    let id = ctx.sym_math(&nodes, &mt)?;
    let expr = if component_type == ComponentType::Function {
        Source::sym_expr(id, Post::None).into()
    } else {
        let of = wiring.hidden(Source::sym_expr(id, Post::None));
        Wire::computed(OpSpec::Sym(SymKind::Derivative), vec![of])
    };
    let [xmin, xmax] = match (
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmin),
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmax),
    ) {
        (Some(xmin), Some(xmax)) => [xmin.into(), xmax.into()],
        _ => [Wire::constant(-10.0), Wire::constant(10.0)],
    };
    wiring.set_public(Props {
        expr,
        xmin,
        xmax,
        curve: Wire::constant(1.0),
        samples: Wire::computed(
            OpSpec::Sym(SymKind::Sample),
            vec![at.expr, at.xmin, at.xmax],
        ),
    });
    Ok(wiring)
}
