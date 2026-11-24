//! `<regularPolygon>`: its definition and its planner. Its vertices turn
//! about its center from its first vertex, which come from the center and
//! a vertex, two adjacent vertices, or one of the two and a size.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::{RegularBy, VecOp};
use std::f64::consts::{PI, TAU};

component! {
    /// `<regularPolygon numVertices="5" center="(1,2)" circumradius="3"/>`:
    /// its vertices, counterclockwise from the first, its center and its
    /// sizes. Its number of vertices is a literal. Drawn as a polygon.
    tags: ["regularPolygon"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        numVertices: list_len { rendered },
        // The mean of the vertices; a request on it translates them.
        cx: by_planner,
        cy: by_planner,
        circumradius: by_planner,
        inradius: by_planner,
        sideLength: by_planner,
        perimeter: by_planner,
        area: by_planner,
        // Whether a whole drag, and a vertex's, may move it (ADR 0064).
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
        // A vertex drag turns and scales it about its center, a
        // whole-polygon drag moves it; the renderer draws every vertex.
        interactive: true,
        rendered: true,
    }
    alternate_names {
        centerX1: cx,
        centerX2: cy,
        numSides: numVertices,
        radius: circumradius,
        apothem: inradius,
    }
    attributes {
        vertices: Points,
        center: Point,
        numVertices: Literal(0.0),
        numSides: Literal(0.0),
        circumradius: Scalar,
        radius: Scalar,
        inradius: Scalar,
        apothem: Scalar,
        sideLength: Scalar,
        perimeter: Scalar,
        area: Scalar,
        draggable: Flag(true),
        verticesDraggable: OptFlag,
    }
    params {
        // The center when not given, the direction from it (or, given a
        // vertex, toward it) of the first vertex, and the circumradius when
        // no size is given.
        ESSCX, ESSCY, DIRX, DIRY, CIRCUMRADIUS,
    }
    children: None,
    planner: Plan(plan),
}

/// Plans a regular polygon of `numVertices` (or `numSides`, 3 by default)
/// vertices, as the current core does: from two adjacent `vertices`; from
/// the `center` and the first vertex; or from the first vertex or the
/// center (the origin by default) and a size, the first of
/// `circumradius`, `radius`, `inradius`, `apothem`, `sideLength`,
/// `perimeter` and `area` given (a circumradius of 1 by default), its first
/// vertex to the right of the center. What the way it is given leaves out
/// is not used.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let (nv, ns) = (attrs.numVertices?, attrs.numSides?);
    let n = if nv != 0.0 {
        nv
    } else if ns != 0.0 {
        ns
    } else {
        3.0
    };
    if n.fract() != 0.0 || n < 2.0 || n > super::MAX_VERTICES as f64 {
        return Err(Error::Unsupported(format!(
            "a regular polygon of {n} vertices: a whole number from 2 to {}",
            super::MAX_VERTICES
        )));
    }
    let n = n as usize;
    let nf = n as f64;
    let [draggable, vertices_draggable] = super::drag::flags(
        attrs.draggable.clone(),
        attr::draggable,
        attrs.verticesDraggable.clone(),
        attr::verticesDraggable,
        at.draggable,
    );
    let center = attrs.center.map(PointAttr::point).transpose()?;
    let vertices = attrs.vertices;
    let mut wiring = ElemWiring::with_list(ComponentType::RegularPolygon, n);
    // The circumradius from the first size given.
    let (sin, cos) = (PI / nf).sin_cos();
    let sizes = [
        (attrs.circumradius, attr::circumradius, 1.0),
        (attrs.radius, attr::radius, 1.0),
        (attrs.inradius, attr::inradius, cos),
        (attrs.apothem, attr::apothem, cos),
        (attrs.sideLength, attr::sideLength, 2.0 * sin),
        (attrs.perimeter, attr::perimeter, 2.0 * nf * sin),
    ];
    let circumradius = |wiring: &mut ElemWiring| -> Port {
        for (size, a, per_radius) in sizes.clone() {
            if let Some(s) = size {
                let given = wiring.hidden_wire(Wire::scalar(s, GivenId::Attr(a, 0)));
                if per_radius == 1.0 {
                    return given;
                }
                return wiring.hidden(Source::computed_k(OpSpec::Div, given, per_radius));
            }
        }
        if let Some(s) = attrs.area.clone() {
            let given = wiring.hidden_wire(Wire::scalar(s, GivenId::Attr(attr::area, 0)));
            let per_square = nf / 2.0 * (TAU / nf).sin();
            let square = wiring.hidden(Source::computed_k(OpSpec::Div, given, per_square));
            return wiring.hidden(Source::computed(OpSpec::Sqrt, vec![square]));
        }
        wiring.param(param::CIRCUMRADIUS, 1.0)
    };
    // The offset from the center to the first vertex (or back), the
    // circumradius along a direction.
    let offset = |wiring: &mut ElemWiring, toward: f64| -> Vec<Port> {
        let r = circumradius(wiring);
        let zero = wiring.hidden(Source::constant(0.0));
        let ux = wiring.param(param::DIRX, toward);
        let uy = wiring.param(param::DIRY, 0.0);
        wiring.hidden_vector(
            VecOp::PolarDirection {
                perpendicular: false,
            },
            vec![zero, zero, ux, uy, r],
        )
    };
    let point = |wiring: &mut ElemWiring, p: &GivenPoint, a: Attr, k: usize| -> Vec<Port> {
        wiring.hidden_point_of(p, a, k).to_vec()
    };
    let (by, args) = match (vertices.as_slice(), &center) {
        ([v1, ..], Some(c)) => {
            let mut args = point(&mut wiring, c, attr::center, 0);
            args.extend(point(&mut wiring, v1, attr::vertices, 0));
            (RegularBy::CenterVertex, args)
        }
        ([v1, v2, ..], None) => {
            let mut args = point(&mut wiring, v1, attr::vertices, 0);
            args.extend(point(&mut wiring, v2, attr::vertices, 1));
            (RegularBy::Adjacent, args)
        }
        // The center is the circumradius to the left of the vertex.
        ([v1], None) => {
            let mut args = point(&mut wiring, v1, attr::vertices, 0);
            args.extend(offset(&mut wiring, -1.0));
            (RegularBy::VertexOffset, args)
        }
        ([], c) => {
            let mut args = match c {
                Some(c) => point(&mut wiring, c, attr::center, 0),
                None => Wire::point_or_default(
                    None,
                    attr::center,
                    0,
                    ([param::ESSCX, param::ESSCY], [0.0, 0.0]),
                )
                .map(|w| wiring.hidden_wire(w))
                .to_vec(),
            };
            args.extend(offset(&mut wiring, 1.0));
            (RegularBy::CenterOffset, args)
        }
    };
    let [first, _] = wiring.item(0);
    let mut outputs =
        ElemWiring::vector_from(first, VecOp::RegularPolygon { n: byte(n), by }, args, &[])
            .into_iter();
    let points: Vec<[Wire; 2]> = (0..n)
        .map(|_| [outputs.next().unwrap(), outputs.next().unwrap()])
        .collect();
    // The center, one `Centroid` over the vertices, and the circumradius,
    // a circle's about it through the first vertex, which a request scales.
    let [cx, cy, circumradius] = if 2 * n > MAX_VEC_IN {
        let w = ctx.warn(
            "cells-polygon-center-unsupported",
            &format!(
                "the center of a polygon of more than {} vertices is not supported",
                MAX_VEC_IN / 2
            ),
        );
        [Wire::undefined(w), Wire::undefined(w), Wire::undefined(w)]
    } else {
        let corners = wiring.items().flatten().collect();
        let [cx, cy] = ElemWiring::vector([at.cx, at.cy], VecOp::Centroid { n: byte(n) }, corners);
        let circle = wiring.hidden_vector(
            VecOp::CircleCenterPoint,
            vec![at.cx, at.cy, first, wiring.item(0)[1]],
        );
        [cx, cy, Wire::own(circle[2])]
    };
    let square = wiring.hidden(Source::computed(
        OpSpec::Mul,
        vec![at.circumradius, at.circumradius],
    ));
    let times = |k: f64| -> Wire { Source::computed_k(OpSpec::Mul, at.circumradius, k).into() };
    wiring.set_planned(Planned {
        cx,
        cy,
        circumradius,
        inradius: times(cos),
        sideLength: times(2.0 * sin),
        perimeter: times(2.0 * nf * sin),
        area: Source::computed_k(OpSpec::Mul, square, nf / 2.0 * (TAU / nf).sin()).into(),
        draggable,
        verticesDraggable: vertices_draggable,
    });
    wiring.set_list(points);
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "regular_polygon.spec.rs"]
mod spec;
