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
        numVertices: by_planner { rendered },
        // The mean of the vertices; the renderer's center handle requests
        // it, and it translates every vertex. The vertices follow, as the
        // list.
        cx: by_planner { interactive },
        cy: by_planner { interactive },
    }
    combined_props {
        center: [cx, cy],
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
    alternate_names {
        centerX1: cx,
        centerX2: cy,
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

// Planned as a polygon, whose table it shares.
const _: () = assert!(
    Props::AT.numVertices == super::polygon::NUM_VERTICES
        && Props::AT.cx == super::polygon::CX
        && Props::AT.cy == super::polygon::CY,
    "a triangle's props must be laid out as a polygon's"
);

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
