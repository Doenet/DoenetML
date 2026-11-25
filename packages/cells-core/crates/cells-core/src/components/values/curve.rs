//! `<function>` and `<derivative>`, which share their table: their
//! definitions and their planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::prop::graph;
use crate::components::{ComponentDef, ComponentType, ConstrainTarget};
use crate::error::Result;
use crate::program::{Post, SymKind, VecOp};
use crate::sym::extrema::Pieces;
use crate::sym::interpolate::{self, Kind};

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
        // Its extrema (ADR 0061), as the current core searches them: the
        // grid's width is 200 `xscale` where the domain is unbounded.
        xscale: by_planner,
        minima: by_planner { expr_when: minima },
        maxima: by_planner { expr_when: maxima },
        extrema: computed(OpSpec::Sym(SymKind::MergeExtrema), [minima, maxima]) {
            expr_when: extrema
        },
        numMinima: computed(OpSpec::Sym(SymKind::Count), [minima]),
        numMaxima: computed(OpSpec::Sym(SymKind::Count), [maxima]),
        numExtrema: computed(OpSpec::Sym(SymKind::Count), [extrema]),
        globalMinimum: by_planner { expr_when: globalMinimum },
        globalInfimum: by_planner { expr_when: globalInfimum },
        globalMaximum: by_planner { expr_when: globalMaximum },
        globalSupremum: by_planner { expr_when: globalSupremum },
        // An interpolated function's (ADR 0061): the height an extremum
        // stands out by, and its pieces as one value, for a reader.
        yscale: by_planner,
        pieces: by_planner,
        // How it evaluates (ADR 0081): 1 when an `<evaluate>` of it is
        // symbolic (`symbolic`, true unless written false; an
        // interpolated function never is), and its expression then, else
        // no value, the port whose type an evaluation's kind follows.
        symbolic: by_planner,
        symbolicExpr: by_planner,
        // What a symbolic evaluation does to the substituted expression
        // (`program::substitute_post`: bit 0 simplify, bit 1 expand).
        substitutePost: by_planner,
        // What a numeric evaluation reads as its one piece: its formula,
        // or an interpolated function's pieces.
        evalExpr: by_planner,
        // How many inputs it takes and outputs it gives.
        numInputs: by_planner,
        numOutputs: by_planner,
        // Its variables as one math cell: its variable, or a tuple of
        // them for a function of several.
        variablesExpr: by_planner,
        // Its formula when it takes several inputs or gives several
        // outputs, else no value: whose type a forced numeric evaluation
        // follows, math for such a function's.
        multiExpr: by_planner,
        // The domains of a function of several variables as one math
        // cell, four numbers per variable; else no value (its domain is
        // the four props above).
        domainsExpr: by_planner,
    }
    // `$f.formula`: its expression, as the current core names it.
    alternate_names {
        formula: expr,
    }
    // A point constrained to a function rides its graph: `x` is what was
    // asked, held in the domain, and `y` is f(x). (The current core moves
    // to the nearest point of the curve instead.)
    constrain_target { function: expr }
    attributes {
        variables: Entries,
        variable: Entries,
        symbolic: Bool(true),
        simplify: Text,
        expand: On,
        numInputs: Literal(NO_VALUE),
        numOutputs: Literal(NO_VALUE),
        domain: Math,
        xscale: Scalar,
        yscale: Scalar,
        through: Math,
        minima: Math,
        maxima: Math,
        extrema: Math,
        throughSlopes: Scalars,
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

/// A function's variable as its planner reads it (ADR 0081): a math
/// cell holding its symbol, and its name when it was written as text.
pub(crate) struct Variable {
    /// The math cell.
    pub(crate) wire: Wire,
    /// The name written, or a default's.
    pub(crate) name: Option<String>,
    /// Its expression, a symbol or a reference's leaf.
    id: ExprId,
}

impl Variable {
    /// The symbol `name`.
    fn symbol(ctx: &mut PlanCtx<'_, '_>, name: &str) -> Self {
        let Source::Flow(Flow::SymExpr(id, _)) = ctx.symbol(name) else {
            unreachable!("a symbol is a math cell")
        };
        Variable {
            wire: Source::sym_expr(id, Post::None).into(),
            name: Some(name.to_string()),
            id,
        }
    }
}

/// The variables `vars` as one math cell: the one's port `one`, or a
/// tuple of them.
fn variables_expr(ctx: &mut PlanCtx<'_, '_>, vars: &[Variable], one: Port) -> Wire {
    if vars.len() <= 1 {
        return Wire::own(one);
    }
    let ids: Vec<ExprId> = vars.iter().map(|v| v.id).collect();
    let id = ctx.operator_expr(&ids, |texts| format!("({})", texts.join(", ")));
    Source::sym_expr(id, Post::None).into()
}

/// Whether `text` names a variable: a letter, then letters and digits,
/// and perhaps a subscript of them (`x_1`).
fn is_variable_name(text: &str) -> bool {
    let (name, sub) = match text.split_once('_') {
        Some((name, sub)) => (name, Some(sub)),
        None => (text, None),
    };
    let mut cs = name.chars();
    cs.next().is_some_and(char::is_alphabetic)
        && cs.all(char::is_alphanumeric)
        && sub.is_none_or(|s| !s.is_empty() && s.chars().all(char::is_alphanumeric))
}

/// The variables a function's `variables`, else its `variable`, writes
/// (ADR 0081), in order: text is the symbol it names, a reference the
/// math it names. Text that names no variable is warned of, and the
/// default stands in its place (`None`).
fn written_variables(ctx: &mut PlanCtx<'_, '_>, attrs: &Attrs) -> Result<Vec<Option<Variable>>> {
    let (name, pieces) = if attrs.variables.is_empty() {
        ("variable", attrs.variable.clone())
    } else {
        ("variables", attrs.variables.clone())
    };
    let mut out = Vec::new();
    for entry in ctx.list_entries(pieces, f64::INFINITY)? {
        match entry {
            ListEntry::Text(_, text) => {
                let text = text.trim().to_string();
                if is_variable_name(&text) {
                    out.push(Some(Variable::symbol(ctx, &text)));
                } else {
                    ctx.warn(
                        "cells-bad-variable",
                        &format!("Invalid value of a variable: `{text}` (in `{name}`)"),
                    );
                    out.push(None);
                }
            }
            entry => {
                let id = ctx.entry_math(&entry).expect("a reference is math");
                out.push(Some(Variable {
                    wire: Source::sym_expr(id, Post::None).into(),
                    name: None,
                    id,
                }));
            }
        }
    }
    Ok(out)
}

/// The first variable a function's record writes (ADR 0081), none when
/// it writes none: a `<curve>`'s function member's.
pub(crate) fn first_variable(ctx: &mut PlanCtx<'_, '_>, attrs: &Attrs) -> Result<Option<Variable>> {
    Ok(written_variables(ctx, attrs)?.into_iter().next().flatten())
}

/// How many inputs a function takes (ADR 0081): its `numInputs`, else as
/// many as its variables written, at least one.
fn num_inputs(attrs: &Attrs, written: usize) -> Result<usize> {
    let n = attrs.numInputs.clone()?;
    Ok(if n.is_nan() {
        written.max(1)
    } else if n >= 1.0 {
        n.round() as usize
    } else {
        1
    })
}

/// `n` variables, the ones written first and then the current core's
/// defaults for the rest (`returnNVariables`): `x`, `y`, `z` for up to
/// three, else `x_1`, `x_2`, ...; a default a written name takes is
/// skipped.
fn n_variables(
    ctx: &mut PlanCtx<'_, '_>,
    written: Vec<Option<Variable>>,
    n: usize,
) -> Vec<Variable> {
    let mut used: Vec<String> = written
        .iter()
        .filter_map(|v| v.as_ref().and_then(|v| v.name.clone()))
        .collect();
    let mut out = Vec::with_capacity(n);
    let mut written = written.into_iter();
    for i in 1..=n {
        if let Some(v) = written.next().flatten() {
            out.push(v);
            continue;
        }
        let preferred: Vec<String> = match (i, n > 3) {
            (1, false) => vec!["x".into()],
            (1, true) => vec!["x_1".into()],
            (2, false) => vec!["y".into(), "x_2".into()],
            (2, true) => vec!["x_2".into(), "y_2".into()],
            (3, false) => vec!["z".into(), "x_3".into(), "z_3".into()],
            (3, true) => vec!["x_3".into(), "y_3".into(), "z_3".into()],
            _ => ["x", "y", "z", "u", "v", "w", "X", "Y", "Z"]
                .iter()
                .map(|v| format!("{v}_{i}"))
                .collect(),
        };
        let name = preferred
            .iter()
            .find(|v| !used.contains(v))
            .unwrap_or(&preferred[0])
            .clone();
        used.push(name.clone());
        out.push(Variable::symbol(ctx, &name));
    }
    out
}

/// What a symbolic evaluation of a function does to the substituted
/// expression (ADR 0081), as `program::substitute_post` reads it: its
/// `simplify` (on unless `none` or `false`) and `expand`.
fn substitute_post(attrs: &Attrs) -> f64 {
    let simplify = attrs
        .simplify
        .as_deref()
        .is_none_or(|s| !matches!(s.trim().to_ascii_lowercase().as_str(), "none" | "false"));
    f64::from(u8::from(simplify) | (u8::from(attrs.expand) << 1))
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
/// wires: the endpoints (one that is no number is NaN) and closedness; the
/// whole line without one, and with a warning when it is not one
/// interval. The second is whether one was given. An endpoint written as
/// math is its value: lowered when the compile can lower it, else its
/// expression evaluated (`sqrt(10)`, which ADR 0043 keeps as written), in
/// hidden ports of `wiring`.
pub(crate) fn plan_domain(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    nodes: Option<&[crate::dast::NodeId]>,
) -> Result<([Wire; 4], bool)> {
    let (mut domains, given) = plan_domains(ctx, wiring, nodes, 1)?;
    Ok((domains.remove(0), given))
}

/// The domains of a function of `n` variables its `domain` attribute
/// writes (ADR 0081), an interval per variable (`(-4, 2] [1, 3)`), each
/// as [`plan_domain`] plans one; the whole line in every variable without
/// one, and with a warning when it is not `n` intervals.
pub(crate) fn plan_domains(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    nodes: Option<&[crate::dast::NodeId]>,
    n: usize,
) -> Result<(Vec<[Wire; 4]>, bool)> {
    let whole = || (0..n).map(|_| whole_line()).collect();
    let Some(nodes) = nodes else {
        return Ok((whole(), false));
    };
    let intervals = ctx.intervals(nodes)?.filter(|v| v.len() == n);
    let Some(intervals) = intervals else {
        let message = if n == 1 {
            "`domain` is not one interval such as [a, b) or (-infinity, b]: \
             the function is defined on the whole line."
                .to_string()
        } else {
            format!(
                "`domain` is not {n} intervals such as [a, b) or (-infinity, b], one per \
                 variable: the function is defined everywhere."
            )
        };
        ctx.warn("cells-bad-domain", &message);
        return Ok((whole(), false));
    };
    // An endpoint that is no number stays one: no bound for the function
    // itself, a piece left out of a piecewise function.
    let mut end = |source: Source, k: u32| -> Wire {
        match source {
            Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) if !v.is_nan() => Wire::constant(v),
            // Math text: its value, as an operator over math has one
            // (ADR 0043): evaluated when the type pass keeps it as
            // written, else lowered.
            Source::Flow(Flow::Math(id)) => {
                let expr = wiring.hidden(Source::math_handle(id, Post::None));
                let numeric = wiring.hidden(Source::math(id));
                Source::value_of(expr, numeric).into()
            }
            source => Wire::scalar(source, GivenId::Attr(attr::domain, k)),
        }
    };
    let flag = |closed: bool| Wire::constant(if closed { 1.0 } else { 0.0 });
    let mut out = Vec::with_capacity(n);
    for (i, iv) in intervals.into_iter().take(n).enumerate() {
        let k = 2 * i as u32;
        let lo = end(iv.lo, k);
        let hi = end(iv.hi, k + 1);
        out.push([lo, hi, flag(iv.lo_closed), flag(iv.hi_closed)]);
    }
    Ok((out, true))
}

/// The domains of a function, four ports per variable, as one math cell
/// (`SymKind::Pack`) an evaluation reads (ADR 0081).
fn domains_expr(ports: Vec<Port>) -> Wire {
    let n = u8::try_from(ports.len()).expect("a function of at most 63 variables");
    Wire::computed(OpSpec::Sym(SymKind::Pack { n }), ports)
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

/// A function's extrema (ADR 0061): its minima and maxima, searched over
/// `f` (its domain and pieces, as [`SymKind::EvalFunction`] reads them
/// after its input) with the grid's scale `xscale`, each search one
/// value its props read entries of: the local ones, the global one, the
/// infimum or supremum.
pub(crate) struct Extrema {
    pub(crate) minima: Wire,
    pub(crate) maxima: Wire,
    pub(crate) global_minimum: Wire,
    pub(crate) global_infimum: Wire,
    pub(crate) global_maximum: Wire,
    pub(crate) global_supremum: Wire,
}

/// The [`Extrema`] of the function `f`, whose pieces are `of`.
pub(crate) fn plan_extrema(
    wiring: &mut ElemWiring,
    xscale: Port,
    f: Vec<Port>,
    of: Pieces,
) -> Extrema {
    let mut inputs = vec![xscale];
    inputs.extend(f);
    let mut search = |max: bool| {
        wiring.hidden(Source::computed(
            OpSpec::Sym(SymKind::Extrema { max, of }),
            inputs.clone(),
        ))
    };
    let (min, max) = (search(false), search(true));
    let mut entry = |of: Port, k: f64| {
        let k = wiring.hidden_wire(Wire::constant(k));
        Wire::computed(OpSpec::Sym(SymKind::Entry), vec![of, k])
    };
    Extrema {
        minima: entry(min, 1.0),
        global_minimum: entry(min, 2.0),
        global_infimum: entry(min, 3.0),
        maxima: entry(max, 1.0),
        global_maximum: entry(max, 2.0),
        global_supremum: entry(max, 3.0),
    }
}

/// How an element of the function's table evaluates (ADR 0081): its
/// `symbolic`, `symbolicExpr`, `substitutePost`, `evalExpr`, `numInputs`
/// and `numOutputs`, for a function of `n` inputs and `m` outputs whose
/// numeric evaluation reads `eval` as its one piece.
struct Evaluates {
    symbolic: Wire,
    symbolic_expr: Wire,
    substitute_post: Wire,
    eval_expr: Wire,
    num_inputs: Wire,
    num_outputs: Wire,
}

impl Evaluates {
    fn of(attrs: &Attrs, symbolic: bool, eval: Port, n: usize, m: usize) -> Self {
        let at = Props::PORTS;
        Evaluates {
            symbolic: Wire::constant(if symbolic { 1.0 } else { 0.0 }),
            symbolic_expr: if symbolic {
                Wire::own(at.expr)
            } else {
                Wire::absent()
            },
            substitute_post: Wire::constant(substitute_post(attrs)),
            eval_expr: Wire::own(eval),
            num_inputs: Wire::constant(n as f64),
            num_outputs: Wire::constant(m as f64),
        }
    }
}

/// How many outputs a function gives (ADR 0081): its `numOutputs`, else
/// its formula's entries when it is a tuple, else one.
fn num_outputs(attrs: &Attrs, mt: &MathText) -> Result<usize> {
    let m = attrs.numOutputs.clone()?;
    Ok(if m >= 1.0 {
        m.round() as usize
    } else {
        tuple_entries(mt.tokens()).map_or(1, |entries| entries.len().max(1))
    })
}

/// A math cell `expr` and, as a curve, its samples over the x-range of
/// the graph it sits in, else [-10, 10], cut to its domain.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let component_type = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let nodes = attrs.children.clone().unwrap_or_default();
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(component_type);
    let mt = ctx.math_text(&nodes)?;
    let is_function = component_type == ComponentType::Function;
    let xscale =
        Wire::attr(attr::xscale, attrs.xscale.clone()).unwrap_or_else(|| Wire::constant(1.0));
    let yscale =
        Wire::attr(attr::yscale, attrs.yscale.clone()).unwrap_or_else(|| Wire::constant(1.0));
    // Given by points it passes through, maxima, minima or extrema: a
    // spline (ADR 0061).
    if is_function
        && (attrs.through.is_some()
            || attrs.minima.is_some()
            || attrs.maxima.is_some()
            || attrs.extrema.is_some())
    {
        return plan_interpolated(ctx, wiring, attrs, xscale, yscale);
    }
    let domain_ports = [
        at.domainMin,
        at.domainMax,
        at.domainMinClosed,
        at.domainMaxClosed,
    ];
    let f = one_piece(&mut wiring, at.expr, at.variable, domain_ports);
    let extrema = plan_extrema(&mut wiring, at.xscale, f, Pieces::One);
    let written = if is_function {
        written_variables(ctx, &attrs)?
    } else {
        Vec::new()
    };
    let n = num_inputs(&attrs, written.len())?;
    let m = if is_function {
        num_outputs(&attrs, &mt)?
    } else {
        1
    };
    if is_function && (n > 1 || m > 1) {
        // Not a curve: a function of several variables, or one returning
        // a tuple, is its formula in its variables, evaluated symbolically
        // or numerically by the one instruction its evaluations read
        // (ADR 0081), whose result is math either way, and iterated
        // (`plan_function_iterates` reads its text). Its domain is the
        // whole space.
        let (domains, _) = plan_domains(ctx, &mut wiring, attrs.domain.as_deref(), n)?;
        let mut ports = Vec::with_capacity(4 * n);
        for d in &domains[1..] {
            for w in d.clone() {
                ports.push(wiring.hidden_wire(w));
            }
        }
        let [d0, d1, d2, d3] = domains[0].clone();
        let mut all = vec![
            at.domainMin,
            at.domainMax,
            at.domainMinClosed,
            at.domainMaxClosed,
        ];
        all.extend(ports);
        let mut ev = Evaluates::of(&attrs, attrs.symbolic, at.expr, n, m);
        ev.symbolic_expr = Wire::own(at.expr);
        let mut vars = n_variables(ctx, written, n);
        let variables = variables_expr(ctx, &vars, at.variable);
        let id = ctx.sym_math(&nodes, &mt)?;
        wiring.set_planned(Planned {
            expr: Source::sym_expr(id, Post::None).into(),
            variable: vars.remove(0).wire,
            domainMin: d0,
            domainMax: d1,
            domainMinClosed: d2,
            domainMaxClosed: d3,
            xmin: Wire::constant(-10.0),
            xmax: Wire::constant(10.0),
            curve: Wire::constant(0.0),
            samples: Wire::absent(),
            xscale,
            minima: extrema.minima,
            maxima: extrema.maxima,
            globalMinimum: extrema.global_minimum,
            globalInfimum: extrema.global_infimum,
            globalMaximum: extrema.global_maximum,
            globalSupremum: extrema.global_supremum,
            yscale,
            pieces: Wire::absent(),
            symbolic: ev.symbolic,
            symbolicExpr: ev.symbolic_expr,
            substitutePost: ev.substitute_post,
            evalExpr: ev.eval_expr,
            numInputs: ev.num_inputs,
            numOutputs: ev.num_outputs,
            variablesExpr: variables,
            multiExpr: Wire::own(at.expr),
            domainsExpr: domains_expr(all),
        });
        return Ok(wiring);
    }
    let (expr, parts) = if is_function {
        let id = ctx.sym_math(&nodes, &mt)?;
        let wrote_variable = written.iter().any(Option::is_some);
        // Its children one function (`<function>$f</function>`): in that
        // function's variable and on its domain, unless it writes its own.
        let of = referenced_function(ctx, &nodes)?.map(|(_, parts)| parts);
        let var = n_variables(ctx, written, 1).remove(0);
        let (domain, has_domain) = plan_domain(ctx, &mut wiring, attrs.domain.as_deref())?;
        let parts = match of {
            Some(of) => FunctionParts {
                plain: false,
                variable: if wrote_variable {
                    var.wire
                } else {
                    of.variable
                },
                domain: if has_domain { domain } else { of.domain },
            },
            None => FunctionParts {
                plain: var.name.as_deref() == Some("x") && !has_domain,
                variable: var.wire,
                domain,
            },
        };
        // No formula written: 0, as the current core's default, state as
        // its essential formula is.
        let expr = if nodes.is_empty() {
            Wire::given_math(GivenId::Children(0), Some(crate::sym::Tree::Num(0.0)))
        } else {
            Wire::from(Source::sym_expr(id, Post::None))
        };
        (expr, parts)
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
    let [xmin, xmax, samples] = function_curve(
        ctx,
        &mut wiring,
        parts.plain,
        [at.expr, at.variable],
        domain_ports,
        [at.xmin, at.xmax],
    );
    let [d0, d1, d2, d3] = parts.domain;
    let ev = Evaluates::of(&attrs, attrs.symbolic, at.expr, 1, 1);
    wiring.set_planned(Planned {
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
        xscale,
        minima: extrema.minima,
        maxima: extrema.maxima,
        globalMinimum: extrema.global_minimum,
        globalInfimum: extrema.global_infimum,
        globalMaximum: extrema.global_maximum,
        globalSupremum: extrema.global_supremum,
        yscale,
        pieces: Wire::absent(),
        symbolic: ev.symbolic,
        symbolicExpr: ev.symbolic_expr,
        substitutePost: ev.substitute_post,
        evalExpr: ev.eval_expr,
        numInputs: ev.num_inputs,
        numOutputs: ev.num_outputs,
        variablesExpr: Wire::own(at.variable),
        multiExpr: Wire::absent(),
        domainsExpr: Wire::absent(),
    });
    Ok(wiring)
}

/// The kinds of point an interpolated function is given, each by the
/// attribute that gives it, in the order the current core reads them.
fn given_kinds(attrs: &Attrs) -> [(Option<&[crate::dast::NodeId]>, Kind); 4] {
    [
        (attrs.maxima.as_deref(), Kind::Maximum),
        (attrs.minima.as_deref(), Kind::Minimum),
        (attrs.extrema.as_deref(), Kind::Extremum),
        (attrs.through.as_deref(), Kind::Point),
    ]
}

/// The points an attribute gives (ADR 0061): a reference to a point is
/// one, and so is a tuple, `(x, y)`, `(x, )` without its value, `( , y)`
/// or `(y)` without its location; each coordinate an expression of its
/// own, evaluated. A coordinate not given is `None`.
fn given_points(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    nodes: &[crate::dast::NodeId],
) -> Result<Vec<[Option<Port>; 2]>> {
    let (toks, _) = ctx.math_tokens(nodes)?;
    let coord = |ctx: &mut PlanCtx<'_, '_>,
                 wiring: &mut ElemWiring,
                 toks: &[Token]|
     -> Result<Option<Port>> {
        if toks.is_empty() {
            return Ok(None);
        }
        let held = wiring.hidden(ctx.sym_tokens(toks)?);
        Ok(Some(wiring.hidden(Source::value_of(held, held))))
    };
    let mut points = Vec::new();
    let mut i = 0;
    while i < toks.len() {
        match &toks[i] {
            Token::Cell(p) => {
                let p = *p;
                let x = wiring.hidden(Source::coord(p, 0));
                let y = wiring.hidden(Source::coord(p, 1));
                points.push([Some(x), Some(y)]);
                i += 1;
            }
            Token::LParen => {
                let start = i;
                let mut depth = 0;
                while i < toks.len() {
                    match toks[i] {
                        Token::LParen => depth += 1,
                        Token::RParen => depth -= 1,
                        _ => {}
                    }
                    i += 1;
                    if depth == 0 {
                        break;
                    }
                }
                let group = &toks[start..i];
                let inner = &group[1..group.len().saturating_sub(1)];
                let entries = tuple_entries(group).unwrap_or_else(|| vec![inner.to_vec()]);
                points.push(match &entries[..] {
                    [y] => [None, coord(ctx, wiring, y)?],
                    [x, y] => [coord(ctx, wiring, x)?, coord(ctx, wiring, y)?],
                    // No point of a function's graph: none of its
                    // coordinates given, which the spline leaves out.
                    _ => [None, None],
                });
            }
            _ => i += 1,
        }
    }
    Ok(points)
}

/// A `<function>` given by points (ADR 0061): the spline through them,
/// its pieces made by one instruction (`SymKind::Interpolate`) from the
/// points given, each a coordinate or none, and sampled, evaluated and
/// searched for its extrema as a piecewise function's (ADR 0049). It has
/// no formula.
fn plan_interpolated(
    ctx: &mut PlanCtx<'_, '_>,
    mut wiring: ElemWiring,
    attrs: Attrs,
    xscale: Wire,
    yscale: Wire,
) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let written = written_variables(ctx, &attrs)?;
    let var = n_variables(ctx, written, 1).remove(0);
    let (domain, _) = plan_domain(ctx, &mut wiring, attrs.domain.as_deref())?;
    let slopes = attrs.throughSlopes.clone();
    let mut inputs = vec![at.xscale, at.yscale, at.variable];
    let mut n = 0usize;
    for (nodes, kind) in given_kinds(&attrs) {
        let Some(nodes) = nodes else {
            continue;
        };
        let points = given_points(ctx, &mut wiring, nodes)?;
        for (k, [x, y]) in points.into_iter().enumerate() {
            let slope = (kind == Kind::Point)
                .then(|| slopes.get(k).cloned())
                .flatten()
                .map(|s| wiring.hidden(s));
            let code = interpolate::code(kind, x.is_some(), y.is_some(), slope.is_some());
            let zero = || Wire::constant(0.0);
            inputs.push(wiring.hidden_wire(Wire::constant(code)));
            for p in [x, y, slope] {
                inputs.push(match p {
                    Some(p) => p,
                    None => wiring.hidden_wire(zero()),
                });
            }
            n += 1;
        }
    }
    if n > MAX_GIVEN {
        return Err(crate::error::Error::Unsupported(format!(
            "a <function> through more than {MAX_GIVEN} points, maxima and minima"
        )));
    }
    let spec = OpSpec::Sym(SymKind::Interpolate { n: n as u8 });
    let head = wiring.hidden(Source::computed(spec, inputs));
    let outs: Vec<Port> = (1..spec.n_out())
        .map(|k| {
            wiring.hidden(Source::Flow(Flow::VecOut(
                head,
                u8::try_from(k).expect("an instruction writes at most 255 cells"),
            )))
        })
        .collect();
    let domain_ports = [
        at.domainMin,
        at.domainMax,
        at.domainMinClosed,
        at.domainMaxClosed,
    ];
    let mut f = domain_ports.to_vec();
    for piece in outs.chunks_exact(interpolate::PIECE_OUT) {
        f.extend([piece[0], at.variable]);
        f.extend(&piece[1..]);
    }
    let extrema = plan_extrema(&mut wiring, at.xscale, f.clone(), Pieces::Spline);
    let [gxmin, gxmax] = graph_range(ctx);
    let gxmin = wiring.hidden_wire(gxmin);
    let gxmax = wiring.hidden_wire(gxmax);
    let range = wiring.hidden_vector(
        VecOp::DomainRange,
        vec![gxmin, gxmax, at.domainMin, at.domainMax],
    );
    let mut sampled = vec![at.xmin, at.xmax];
    sampled.extend(f);
    let [d0, d1, d2, d3] = domain;
    // No formula: evaluated numerically only, through its pieces.
    let ev = Evaluates::of(&attrs, false, at.pieces, 1, 1);
    wiring.set_planned(Planned {
        expr: Wire::absent(),
        variable: var.wire,
        domainMin: d0,
        domainMax: d1,
        domainMinClosed: d2,
        domainMaxClosed: d3,
        xmin: Wire::own(range[0]),
        xmax: Wire::own(range[1]),
        curve: Wire::constant(1.0),
        samples: Wire::computed(OpSpec::Sym(SymKind::SampleFunction), sampled),
        xscale,
        minima: extrema.minima,
        maxima: extrema.maxima,
        globalMinimum: extrema.global_minimum,
        globalInfimum: extrema.global_infimum,
        globalMaximum: extrema.global_maximum,
        globalSupremum: extrema.global_supremum,
        yscale,
        pieces: Wire::own(head),
        symbolic: ev.symbolic,
        symbolicExpr: ev.symbolic_expr,
        substitutePost: ev.substitute_post,
        evalExpr: ev.eval_expr,
        numInputs: ev.num_inputs,
        numOutputs: ev.num_outputs,
        variablesExpr: Wire::own(at.variable),
        multiExpr: Wire::absent(),
        domainsExpr: Wire::absent(),
    });
    Ok(wiring)
}

/// The most points an interpolated function may be given: its pieces'
/// cells are one instruction's outputs, at most 255.
const MAX_GIVEN: usize = 16;

#[cfg(test)]
#[path = "curve.spec.rs"]
mod spec;
