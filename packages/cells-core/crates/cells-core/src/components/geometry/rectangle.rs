//! `<rectangle>`: its definition and its planner. An axis-aligned rectangle
//! is two opposite corners, the first and third vertices, given as
//! vertices, or by a vertex or the center with the other or a size.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::program::{PairBy, VecOp};

component! {
    /// `<rectangle vertices="(0,0) (4,2)"/>`, or by its `center`, `width`
    /// and `height`: four vertices counterclockwise from the first, the
    /// third opposite it. Drawn as a polygon.
    tags: ["rectangle"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        numVertices: list_len { rendered },
        // The midpoint of the opposite corners; a request on it translates
        // the rectangle.
        cx: by_planner,
        cy: by_planner,
        width: by_planner,
        height: by_planner,
        area: computed(OpSpec::Mul, [width, height]),
        perimeter: by_planner,
        // Whether a whole drag, and a vertex's, may move it (ADR 0070).
        draggable: by_planner { rendered },
        verticesDraggable: by_planner { rendered },
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
        // A vertex drag requests one, a whole-rectangle drag all; the
        // renderer draws every one.
        interactive: true,
        rendered: true,
    }
    alternate_names {
        centerX1: cx,
        centerX2: cy,
    }
    attributes {
        vertices: Points,
        center: Point,
        width: Scalar,
        height: Scalar,
        draggable: Flag(true),
        verticesDraggable: OptFlag,
    }
    params {
        // The first vertex when neither it nor the center is given.
        ESS1X, ESS1Y,
    }
    children: None,
    planner: Plan(plan),
}

/// Plans a rectangle from its first two `vertices` (its first and third),
/// or one vertex and the `center`, or one vertex or the center and the
/// `width` and `height` (each 1 by default), as the current core does. A
/// size given with two corners is not used.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let vertices = attrs.vertices;
    let center = attrs.center.map(PointAttr::point).transpose()?;
    let mut wiring = ElemWiring::with_list(ComponentType::Rectangle, 4);
    let size = |wiring: &mut ElemWiring| -> [Port; 2] {
        let side = |source: Option<Source>, a: Attr| {
            Wire::attr(a, source).unwrap_or_else(|| Wire::given_by(a, 1.0))
        };
        [
            wiring.hidden_wire(side(attrs.width.clone(), attr::width)),
            wiring.hidden_wire(side(attrs.height.clone(), attr::height)),
        ]
    };
    // The two opposite corners, `[px, py, qx, qy]`.
    let corners: [Port; 4] = if let [v1, v3, ..] = vertices.as_slice() {
        let [px, py] = wiring.hidden_point_of(v1, attr::vertices, 0);
        let [qx, qy] = wiring.hidden_point_of(v3, attr::vertices, 1);
        [px, py, qx, qy]
    } else {
        let (p, by) = match (vertices.first(), &center) {
            (Some(v), Some(c)) => {
                let [px, py] = wiring.hidden_point_of(v, attr::vertices, 0);
                let [cx, cy] = wiring.hidden_point_of(c, attr::center, 0);
                ([px, py, cx, cy], PairBy::Mirror)
            }
            (Some(v), None) => {
                let [px, py] = wiring.hidden_point_of(v, attr::vertices, 0);
                let [w, h] = size(&mut wiring);
                ([px, py, w, h], PairBy::Offset)
            }
            (None, Some(c)) => {
                let [cx, cy] = wiring.hidden_point_of(c, attr::center, 0);
                let [w, h] = size(&mut wiring);
                ([cx, cy, w, h], PairBy::Center)
            }
            (None, None) => {
                let [px, py] = Wire::point_or_default(
                    None,
                    attr::vertices,
                    0,
                    ([param::ESS1X, param::ESS1Y], [0.0, 0.0]),
                )
                .map(|w| wiring.hidden_wire(w));
                let [w, h] = size(&mut wiring);
                ([px, py, w, h], PairBy::Offset)
            }
        };
        let ports = wiring.hidden_vector(VecOp::Pair { by }, p.to_vec());
        [ports[0], ports[1], ports[2], ports[3]]
    };
    let [px, py, qx, qy] = corners;
    let [cx, cy] = ElemWiring::vector([at.cx, at.cy], VecOp::Centroid { n: 2 }, corners.to_vec());
    let [width] = ElemWiring::vector([at.width], VecOp::Extent, vec![px, qx]);
    let [height] = ElemWiring::vector([at.height], VecOp::Extent, vec![py, qy]);
    let [draggable, vertices_draggable] = super::drag::flags(
        attrs.draggable.clone(),
        attr::draggable,
        attrs.verticesDraggable.clone(),
        attr::verticesDraggable,
        at.draggable,
    );
    let half_perimeter = wiring.hidden(Source::computed(OpSpec::Add, vec![at.width, at.height]));
    wiring.set_planned(Planned {
        cx,
        cy,
        width,
        height,
        perimeter: Source::computed_k(OpSpec::Mul, half_perimeter, 2.0).into(),
        draggable,
        verticesDraggable: vertices_draggable,
    });
    let corner = |x: Port, y: Port| [Wire::own(x), Wire::own(y)];
    wiring.set_list(vec![
        corner(px, py),
        corner(qx, py),
        corner(qx, qy),
        corner(px, qy),
    ]);
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "rectangle.spec.rs"]
mod spec;
