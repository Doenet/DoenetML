//! `<triangle>`: a polygon of three vertices (ADR 0016), planned as the
//! polygon is (`polygon::plan_vertices`). A vertex the author does not give
//! is essential state at the current core's default: the first (0, 1), the
//! second (1, 0), the third (0, 0); a fourth given is not read.

use super::polygon::plan_vertices;
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::tick::snap::Shape;

component! {
    /// `<triangle vertices="...">`, optionally rigid, as a polygon.
    tags: ["triangle"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        // The vertices follow, as the list.
        numVertices: by_planner { rendered },
    }
    list {
        names: [vertices],
        item: vertex,
        coords: [x, y],
        alternate_name: vertexX,
        attribute: vertices,
        interactive: true,
        rendered: true,
    }
    sticky: Shape::Closed,
    attributes {
        vertices,
        rigid,
        preserveSimilarity,
        rotationCenter,
        rotateAround,
        rotationVertex,
        minShrink,
        allowDilation,
        allowRotation,
        allowTranslation,
    }
    shared_state {
        // A missing vertex's coordinates.
        ESS1X, ESS1Y, ESS2X, ESS2Y, ESS3X, ESS3Y,
    }
    planner: Plan(plan),
}

/// Plans a triangle: a polygon whose three vertices default as the current
/// core's do.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    use shared_state::*;
    plan_vertices(
        ctx,
        ComponentType::Triangle,
        &[
            ([ESS1X, ESS1Y], [0.0, 1.0]),
            ([ESS2X, ESS2Y], [1.0, 0.0]),
            ([ESS3X, ESS3Y], [0.0, 0.0]),
        ],
    )
}
