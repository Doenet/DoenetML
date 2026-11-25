//! `<polyline>`: an open polygon, planned as the polygon is (its vertices
//! its list, rigid or similar as a polygon may be), with its `length`, the
//! sum of its edges'.

use super::polygon::plan_vertices;
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::tick::snap::Shape;

component! {
    /// `<polyline vertices="...">`, as a polygon whose last vertex is not
    /// joined to its first.
    tags: ["polyline"],
    flags: [copyable, located],
    renders: InGraph,
    // Its vertices the points of a repeat's iterations (ADR 0075).
    over_iterations: PolylineOverIterations,
    props {
        numVertices: list_len { rendered },
        // The mean of the vertices, as a polygon's.
        cx: by_planner { interactive },
        cy: by_planner { interactive },
        // Whether a whole drag, and a vertex's, may move it (ADR 0070).
        draggable: by_planner { rendered },
        verticesDraggable: by_planner { rendered },
        // The sum of its edges' lengths.
        length: by_planner,
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
        // A vertex drag requests one, a whole drag all; the renderer
        // draws every one.
        interactive: true,
        rendered: true,
    }
    alternate_names {
        centerX1: cx,
        centerX2: cy,
    }
    // Its style overrides (ADR 0084), over its style's.
    presentation { lineStyle, lineWidth }
    sticky: Shape::Open,
    // A point constrained to it is moved onto its nearest edge (ADR 0080).
    constrain_target { polygon: false }
    attributes {
        vertices: Points,
        rigid: Bool(false),
        preserveSimilarity: Bool(false),
        rotationCenter: Point,
        rotateAround: Text,
        rotationVertex: Number(1.0),
        minShrink: Number(0.1),
        allowDilation: Bool(true),
        allowRotation: Bool(true),
        allowTranslation: Bool(true),
        draggable: Flag(true),
        verticesDraggable: OptFlag,
    }
    children: None,
    planner: Plan(plan),
}

// Planned as a polygon, whose table it shares up to `length`.
const _: () = assert!(
    Props::AT.numVertices == super::polygon::NUM_VERTICES
        && Props::AT.cx == super::polygon::CX
        && Props::AT.cy == super::polygon::CY
        && Props::AT.draggable == super::polygon::DRAGGABLE
        && Props::AT.verticesDraggable == super::polygon::VERTICES_DRAGGABLE,
    "a polyline's props must be laid out as a polygon's"
);

/// The position of `numVertices`: how many vertices the polyline holds.
pub const NUM_VERTICES: usize = Props::AT.numVertices;

/// Plans a polyline as a polygon, then its length: the sum over its edges
/// of `sqrt(dx^2 + dy^2)`, missing with no vertex.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let mut wiring = plan_vertices(ctx, ComponentType::Polyline, &[])?;
    let vertices: Vec<[Port; 2]> = wiring.items().collect();
    let length = match &vertices[..] {
        [] => Wire::absent(),
        [_] => Wire::constant(0.0),
        _ => {
            let mut total = None;
            for pair in vertices.windows(2) {
                let [[x1, y1], [x2, y2]] = [pair[0], pair[1]];
                let dx = wiring.hidden(Source::computed(OpSpec::Sub, vec![x2, x1]));
                let dy = wiring.hidden(Source::computed(OpSpec::Sub, vec![y2, y1]));
                let dx2 = wiring.hidden(Source::computed(OpSpec::Mul, vec![dx, dx]));
                let dy2 = wiring.hidden(Source::computed(OpSpec::Mul, vec![dy, dy]));
                let sq = wiring.hidden(Source::computed(OpSpec::Add, vec![dx2, dy2]));
                let edge = wiring.hidden(Source::computed(OpSpec::Sqrt, vec![sq]));
                total = Some(match total {
                    None => edge,
                    Some(t) => wiring.hidden(Source::computed(OpSpec::Add, vec![t, edge])),
                });
            }
            Wire::from(Source::own(total.expect("an edge")))
        }
    };
    wiring.set_planned([(Props::PORTS.length, length)]);
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "polyline.spec.rs"]
mod spec;
