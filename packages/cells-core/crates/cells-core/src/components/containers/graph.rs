//! `<graph>`: the container shapes are drawn in, its visible ranges, and
//! their scales (ADR 0084).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::program::VecOp;

component! {
    /// `<graph>`: its x and y range, and their scales. With
    /// `identicalAxisScales` and an `aspectRatio`, the ranges the author
    /// left out follow from those given and the ratio, as the current
    /// core's `Graph.js` computes them; without an `aspectRatio`, the ratio
    /// follows from the scales.
    tags: ["graph"],
    flags: [container],
    encloses: Graph(xmin, xmax, ymin, ymax),
    needs: Description,
    list_item: Top,
    props {
        // Pan and zoom request all four.
        xmin: by_planner { interactive, rendered },
        xmax: by_planner { interactive, rendered },
        ymin: by_planner { interactive, rendered },
        ymax: by_planner { interactive, rendered },
        // `xmax - xmin`; a request keeps the midpoint and moves both ends,
        // and is refused for a scale that is not finite and positive.
        xScale: computed(OpSpec::Vec(VecOp::Span), [xmin, xmax]),
        yScale: computed(OpSpec::Vec(VecOp::Span), [ymin, ymax]),
        // Width over height.
        aspectRatio: by_planner,
    }
    // The current core's names of the ranges (`$g.yMax`).
    alternate_names {
        xMin: xmin,
        xMax: xmax,
        yMin: ymin,
        yMax: ymax,
    }
    // How it is laid out and what it shows, which the renderer reads.
    presentation {
        size, width, horizontalAlign, displayMode, showBorder, showNavigation,
        displayXAxis, displayYAxis, displayXAxisTicks, displayYAxisTicks,
        displayXAxisTickLabels, displayYAxisTickLabels,
    }
    attributes {
        xmin: Value,
        xmax: Value,
        ymin: Value,
        ymax: Value,
        aspectRatio: Scalar,
        identicalAxisScales: LiteralFlag,
    }
    planner: Plan(plan),
}

/// The position of `xmin`: the left edge of the visible x-range.
pub const XMIN: usize = Props::AT.xmin;
/// The position of `xmax`: the right edge of the visible x-range.
pub const XMAX: usize = Props::AT.xmax;
/// The position of `ymin`: the bottom of the visible y-range.
pub const YMIN: usize = Props::AT.ymin;
/// The position of `ymax`: the top of the visible y-range.
pub const YMAX: usize = Props::AT.ymax;

/// The ranges as given, each its default (±10) when not, and the aspect
/// ratio: given, else 1; from the scales with `identicalAxisScales` and
/// no `aspectRatio`. With both, a range not given follows from the
/// others: `Graph.js`' `xMin` to `yMax`.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let a = Attrs::of(ctx.record());
    let given = [
        a.xmin.is_some(),
        a.xmax.is_some(),
        a.ymin.is_some(),
        a.ymax.is_some(),
    ];
    let prelim = [
        Wire::attr(attr::xmin, a.xmin.clone()).unwrap_or_else(|| Wire::given_by(attr::xmin, -10.0)),
        Wire::attr(attr::xmax, a.xmax.clone()).unwrap_or_else(|| Wire::given_by(attr::xmax, 10.0)),
        Wire::attr(attr::ymin, a.ymin.clone()).unwrap_or_else(|| Wire::given_by(attr::ymin, -10.0)),
        Wire::attr(attr::ymax, a.ymax.clone()).unwrap_or_else(|| Wire::given_by(attr::ymax, 10.0)),
    ];
    let identical = matches!(a.identicalAxisScales, Some(Some(true)));
    let ratio = Wire::attr(attr::aspectRatio, a.aspectRatio.clone());
    let mut wiring = ElemWiring::of(ComponentType::Graph);
    // A graph inside a graph is drawn in it: its ranges are its parent's,
    // and a request on one is a request on the parent's (`graphParentXmin`).
    let mut parent = |name| {
        ctx.ancestor_prop(|ty| ty == ComponentType::Graph, name)
            .flatten()
    };
    if let (Some(xmin), Some(xmax), Some(ymin), Some(ymax)) = (
        parent("xmin"),
        parent("xmax"),
        parent("ymin"),
        parent("ymax"),
    ) {
        wiring.set_planned(Planned {
            xmin: xmin.into(),
            xmax: xmax.into(),
            ymin: ymin.into(),
            ymax: ymax.into(),
            aspectRatio: Wire::attr(attr::aspectRatio, a.aspectRatio.clone())
                .unwrap_or_else(|| Wire::constant(1.0)),
        });
        return Ok(wiring);
    }
    let Some(ratio) = ratio.filter(|_| identical) else {
        let [xmin, xmax, ymin, ymax] = prelim;
        let ratio = if identical {
            Wire::computed(OpSpec::Div, vec![at.xScale, at.yScale])
        } else {
            Wire::attr(attr::aspectRatio, a.aspectRatio.clone())
                .unwrap_or_else(|| Wire::constant(1.0))
        };
        wiring.set_planned(Planned {
            xmin,
            xmax,
            ymin,
            ymax,
            aspectRatio: ratio,
        });
        return Ok(wiring);
    };
    let [p0, p1, p2, p3] = prelim.map(|w| wiring.hidden_wire(w));
    let r = wiring.hidden_wire(ratio);
    let [x0, x1, y0, y1] = given;
    let w = &mut wiring;
    let k = |w: &mut ElemWiring, v: f64| w.hidden(Source::constant(v));
    let op = |w: &mut ElemWiring, op: OpSpec, a: Port, b: Port| {
        w.hidden(Source::computed(op, vec![a, b]))
    };
    let y_scale = (y0 && y1).then(|| {
        let s = op(w, OpSpec::Sub, p3, p2);
        op(w, OpSpec::Mul, s, r)
    });
    let x_scale = (x0 && x1).then(|| {
        let s = op(w, OpSpec::Sub, p1, p0);
        op(w, OpSpec::Div, s, r)
    });
    let half = k(w, 2.0);
    // `20 / r` and `10 / r`: the default scale, as tall as the ratio makes it.
    let twenty = k(w, 20.0);
    let ten = k(w, 10.0);
    let xmin = match (x0, y_scale) {
        (true, _) => p0,
        (false, Some(adj)) if x1 => op(w, OpSpec::Sub, p1, adj),
        (false, Some(adj)) => {
            let h = op(w, OpSpec::Div, adj, half);
            w.hidden(Source::computed(OpSpec::Negate, vec![h]))
        }
        (false, None) if x1 => op(w, OpSpec::Sub, p1, twenty),
        (false, None) => p0,
    };
    let xmax = match y_scale {
        Some(adj) if x0 && x1 => {
            let s = op(w, OpSpec::Sub, p1, p0);
            let m = op(w, OpSpec::Max, s, adj);
            op(w, OpSpec::Add, p0, m)
        }
        Some(adj) if x0 => op(w, OpSpec::Add, p0, adj),
        Some(_) if x1 => p1,
        Some(adj) => op(w, OpSpec::Div, adj, half),
        None if x1 => p1,
        None if x0 => op(w, OpSpec::Add, p0, twenty),
        None => p1,
    };
    let twenty_r = op(w, OpSpec::Div, twenty, r);
    let ten_r = op(w, OpSpec::Div, ten, r);
    let ymin = match (y0, x_scale) {
        (true, _) => p2,
        (false, Some(adj)) if y1 => op(w, OpSpec::Sub, p3, adj),
        (false, Some(adj)) => {
            let h = op(w, OpSpec::Div, adj, half);
            w.hidden(Source::computed(OpSpec::Negate, vec![h]))
        }
        (false, None) if y1 => op(w, OpSpec::Sub, p3, twenty_r),
        (false, None) => w.hidden(Source::computed(OpSpec::Negate, vec![ten_r])),
    };
    let ymax = match x_scale {
        Some(adj) if y0 && y1 => {
            let s = op(w, OpSpec::Sub, p3, p2);
            let m = op(w, OpSpec::Max, s, adj);
            op(w, OpSpec::Add, p2, m)
        }
        Some(adj) if y0 => op(w, OpSpec::Add, p2, adj),
        Some(_) if y1 => p3,
        Some(adj) => op(w, OpSpec::Div, adj, half),
        None if y1 => p3,
        None if y0 => op(w, OpSpec::Add, p2, twenty_r),
        None => ten_r,
    };
    wiring.set_planned(Planned {
        xmin: Wire::own(xmin),
        xmax: Wire::own(xmax),
        ymin: Wire::own(ymin),
        ymax: Wire::own(ymax),
        aspectRatio: Wire::own(r),
    });
    Ok(wiring)
}
