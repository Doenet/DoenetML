//! `<bestFitLine>`: the least-squares line through its `data` points
//! (`VecOp::BestFitLine`), drawn as a line through two of its points. It
//! follows the data and cannot be dragged.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::VecOp;

component! {
    /// `<bestFitLine data="$P1 $P2 $P3"/>`: the line `y = m x + k`
    /// fitting the points whose coordinates are numbers, as the current
    /// core fits it; with none, no line.
    tags: ["bestFitLine"],
    flags: [copyable],
    props {
        // Two points of the line, as a line's from its equation.
        x1: by_planner { rendered },
        y1: by_planner { rendered },
        x2: by_planner { rendered },
        y2: by_planner { rendered },
        slope: by_planner,
        xintercept: by_planner,
        yintercept: by_planner,
        // ax + by + c = 0 as the current core writes the fit: (m, -1, k).
        coeffvar1: by_planner,
        coeffvar2: by_planner,
        coeff0: by_planner,
    }
    list {
        names: [points],
        item: point,
        points: [[x1, y1], [x2, y2]],
    }
    // A point constrained to it is projected onto it.
    constrain_target { ports: [x1, y1, x2, y2], op: ProjectLine }
    attributes {
        data: Points,
    }
    children: None,
    planner: Plan(plan),
}

/// Plans the fit over the `data` points, at most `MAX_VEC_IN / 2` of
/// them, and the line's two points from its coefficients.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ComponentType::BestFitLine);
    let data = Attrs::of(ctx.record()).data;
    let n = data.len();
    let [m, b, k] = if n == 0 {
        // No data: no line, as the current core's blank equation.
        [Wire::absent(), Wire::absent(), Wire::absent()]
    } else if 2 * n > MAX_VEC_IN {
        let w = ctx.warn(
            "cells-best-fit-line-too-many-points",
            &format!(
                "a best-fit line through more than {} points is not supported",
                MAX_VEC_IN / 2
            ),
        );
        [Wire::undefined(w), Wire::undefined(w), Wire::undefined(w)]
    } else {
        let args = data
            .iter()
            .enumerate()
            .flat_map(|(i, p)| wiring.hidden_point_of(p, attr::data, i))
            .collect();
        ElemWiring::vector(
            [at.coeffvar1, at.coeffvar2, at.coeff0],
            VecOp::BestFitLine { n: byte(n) },
            args,
        )
    };
    let [x1, y1, x2, y2] = ElemWiring::vector(
        [at.x1, at.y1, at.x2, at.y2],
        VecOp::LinePointsFromCoeffs,
        vec![at.coeffvar1, at.coeffvar2, at.coeff0],
    );
    // The x-intercept is where m x + k = 0.
    let xi = wiring.hidden(Source::computed(OpSpec::Div, vec![at.coeff0, at.coeffvar1]));
    wiring.set_public(Props {
        x1,
        y1,
        x2,
        y2,
        slope: Wire::own(at.coeffvar1),
        xintercept: Wire::computed(OpSpec::Negate, vec![xi]),
        yintercept: Wire::own(at.coeff0),
        coeffvar1: m,
        coeffvar2: b,
        coeff0: k,
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "best_fit_line.spec.rs"]
mod spec;
