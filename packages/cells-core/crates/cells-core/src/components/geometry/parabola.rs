//! `<parabola>`: `y = a x² + b x + c` through 0 to 3 points, or with a
//! vertex and at most one point (`VecOp::Parabola`), drawn as a curve
//! through its samples over the graph's x-range (`SymKind::SampleQuadratic`),
//! as a `<function>`'s curve is.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::components::prop::graph;
use crate::error::Result;
use crate::limits::byte;
use crate::program::{SymKind, VecOp};

component! {
    /// `<parabola through="(1,2) (3,4)"/>`, `<parabola vertex="(1,2)"/>`:
    /// its coefficients and vertex, as the current core finds them; with
    /// nothing given, `y = x²`. A request on the coefficients or the
    /// vertex moves the points onto the parabola asked for.
    tags: ["parabola"],
    flags: [copyable],
    renders: InGraph,
    props {
        a: by_planner,
        b: by_planner,
        c: by_planner,
        vertexX: by_planner,
        vertexY: by_planner,
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        // Always 1: the bridge draws it as a `<function>`'s curve.
        curve: by_planner { rendered },
        samples: by_planner { rendered, sampled: curve },
    }
    combined_props {
        vertex: [vertexX, vertexY],
    }
    alternate_names {
        vertexX1: vertexX,
        vertexX2: vertexY,
    }
    // Its style overrides (ADR 0084), over its style's.
    presentation { lineStyle, lineWidth }
    attributes {
        through: Points,
        vertex: Point,
    }
    params {
        // The leading coefficient where the points leave it free, and,
        // through no point, the other two.
        A, B, C,
    }
    children: None,
    planner: Plan(plan),
}

/// The warnings of the current core.
const VERTEX_AND_POINTS: (&str, &str) = (
    "doenet-w0049",
    "Haven't implemented parabola with vertex through more than 1 point.",
);
const TOO_MANY_POINTS: (&str, &str) = (
    "doenet-w0050",
    "Haven't implemented parabola through more than 3 points.",
);

/// Plans the coefficients and vertex from `through` and `vertex`, and the
/// curve's samples over the x-range of the graph it sits in, else
/// [-10, 10].
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ComponentType::Parabola);
    let attrs = Attrs::of(ctx.record());
    let through = attrs.through;
    let vertex = match attrs.vertex {
        Some(v) => Some(v.point()?),
        None => None,
    };
    let unsupported = match (&vertex, through.len()) {
        (Some(_), n) if n > 1 => Some(VERTEX_AND_POINTS),
        (None, n) if n > 3 => Some(TOO_MANY_POINTS),
        _ => None,
    };
    let [a, b, c, vertex_x, vertex_y] = if let Some((code, message)) = unsupported {
        let w = ctx.warn(code, message);
        std::array::from_fn(|_| Wire::undefined(w))
    } else {
        let mut args = vec![wiring.param(param::A, 1.0)];
        match &vertex {
            Some(v) => args.extend(wiring.hidden_point_of(v, attr::vertex, 0)),
            None if through.is_empty() => {
                args.push(wiring.param(param::B, 0.0));
                args.push(wiring.param(param::C, 0.0));
            }
            None => {}
        }
        for (k, p) in through.iter().enumerate() {
            args.extend(wiring.hidden_point_of(p, attr::through, k));
        }
        let op = VecOp::Parabola {
            through: byte(through.len()),
            vertex: vertex.is_some(),
        };
        ElemWiring::vector([at.a, at.b, at.c, at.vertexX, at.vertexY], op, args)
    };
    let [xmin, xmax] = match (
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmin),
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmax),
    ) {
        (Some(xmin), Some(xmax)) => [xmin.into(), xmax.into()],
        _ => [Wire::constant(-10.0), Wire::constant(10.0)],
    };
    wiring.set_planned(Planned {
        a,
        b,
        c,
        vertexX: vertex_x,
        vertexY: vertex_y,
        xmin,
        xmax,
        curve: Wire::constant(1.0),
        samples: Wire::computed(
            OpSpec::Sym(SymKind::SampleQuadratic),
            vec![at.a, at.b, at.c, at.xmin, at.xmax],
        ),
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "parabola.spec.rs"]
mod spec;
