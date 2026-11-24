//! `<piecewiseFunction>`: a function of one variable made of the
//! `<function>`s among its children, each on its own domain (ADR 0049).

use crate::compile::api::*;
use crate::components::Role;
use crate::components::define::*;
use crate::components::values::curve::{self, graph_range, plan_domain};
use crate::error::Result;
use crate::program::{SymKind, VecOp};

component! {
    /// `<piecewiseFunction><function domain="(0, Infinity)">1</function>
    /// <function>0</function></piecewiseFunction>`: at `x`, the first of
    /// its functions whose domain holds `x` (a piece whose domain has an
    /// endpoint that is no number is left out), missing where none does
    /// or outside its own `domain`. Without one, its domain is the least
    /// interval holding its pieces'. Drawn in a graph as one curve, the
    /// `SAMPLES` cells from `samples` on over the graph's x-range cut to
    /// its domain; its pieces are not drawn on their own. Like the current
    /// core's, it has no formula, so math cannot read it; its derivative
    /// is not taken.
    tags: ["piecewiseFunction"],
    renders: InGraphAlone,
    roles: [PiecewiseFunction],
    props {
        domainMin: by_planner,
        domainMax: by_planner,
        domainMinClosed: by_planner,
        domainMaxClosed: by_planner,
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        // Always 1: the bridge draws it as a `<function>`'s curve.
        curve: by_planner { rendered },
        samples: by_planner { rendered, sampled: curve },
        // Its extrema (ADR 0061): its pieces', each on what of its domain
        // no earlier piece takes, and the ends between them.
        xscale: by_planner,
        minima: by_planner,
        maxima: by_planner,
        extrema: computed(OpSpec::Sym(SymKind::MergeExtrema), [minima, maxima]),
        numMinima: computed(OpSpec::Sym(SymKind::Count), [minima]),
        numMaxima: computed(OpSpec::Sym(SymKind::Count), [maxima]),
        numExtrema: computed(OpSpec::Sym(SymKind::Count), [extrema]),
        globalMinimum: by_planner,
        globalInfimum: by_planner,
        globalMaximum: by_planner,
        globalSupremum: by_planner,
    }
    attributes {
        domain: Math,
        xscale: Scalar,
    }
    planner: Plan(plan),
}

/// Its domain, its own or its pieces' hull, and its curve sampled from
/// its pieces' expressions, variables and domains.
fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ctx.component_type());
    let fp = curve::Props::PORTS;
    let mut pieces = Vec::new();
    for piece in ctx.children_playing(Role::Function) {
        for port in [
            fp.expr,
            fp.variable,
            fp.domainMin,
            fp.domainMax,
            fp.domainMinClosed,
            fp.domainMaxClosed,
        ] {
            pieces.push(wiring.hidden(piece.port(port)));
        }
    }
    let n = pieces.len() / crate::program::PIECE_CELLS;
    let xscale = Wire::attr(attr::xscale, attrs.xscale).unwrap_or_else(|| Wire::constant(1.0));
    let mut f = vec![
        at.domainMin,
        at.domainMax,
        at.domainMinClosed,
        at.domainMaxClosed,
    ];
    f.extend(pieces.iter().copied());
    let extrema = curve::plan_extrema(
        &mut wiring,
        at.xscale,
        f,
        crate::sym::extrema::Pieces::Piecewise,
    );
    let (domain, given) = plan_domain(ctx, attrs.domain.as_deref())?;
    let [d0, d1, d2, d3] = if given || n == 0 {
        domain
    } else {
        let hull_inputs = pieces
            .chunks_exact(crate::program::PIECE_CELLS)
            .flat_map(|p| p[2..].to_vec())
            .collect();
        let hull = wiring.hidden_vector(VecOp::DomainHull { n: n as u8 }, hull_inputs);
        [hull[0], hull[1], hull[2], hull[3]].map(Wire::own)
    };
    if n == 0 {
        let [xmin, xmax] = graph_range(ctx);
        wiring.set_planned(Planned {
            domainMin: d0,
            domainMax: d1,
            domainMinClosed: d2,
            domainMaxClosed: d3,
            xmin,
            xmax,
            curve: Wire::constant(1.0),
            samples: Wire::absent(),
            xscale,
            minima: extrema.minima,
            maxima: extrema.maxima,
            globalMinimum: extrema.global_minimum,
            globalInfimum: extrema.global_infimum,
            globalMaximum: extrema.global_maximum,
            globalSupremum: extrema.global_supremum,
        });
        return Ok(wiring);
    }
    let [gxmin, gxmax] = graph_range(ctx);
    let gxmin = wiring.hidden_wire(gxmin);
    let gxmax = wiring.hidden_wire(gxmax);
    let range = wiring.hidden_vector(
        VecOp::DomainRange,
        vec![gxmin, gxmax, at.domainMin, at.domainMax],
    );
    let mut inputs = vec![
        at.xmin,
        at.xmax,
        at.domainMin,
        at.domainMax,
        at.domainMinClosed,
        at.domainMaxClosed,
    ];
    inputs.extend(pieces);
    wiring.set_planned(Planned {
        domainMin: d0,
        domainMax: d1,
        domainMinClosed: d2,
        domainMaxClosed: d3,
        xmin: Wire::own(range[0]),
        xmax: Wire::own(range[1]),
        curve: Wire::constant(1.0),
        samples: Wire::computed(OpSpec::Sym(SymKind::SampleFunction), inputs),
        xscale,
        minima: extrema.minima,
        maxima: extrema.maxima,
        globalMinimum: extrema.global_minimum,
        globalInfimum: extrema.global_infimum,
        globalMaximum: extrema.global_maximum,
        globalSupremum: extrema.global_supremum,
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "piecewise_function.spec.rs"]
mod spec;
