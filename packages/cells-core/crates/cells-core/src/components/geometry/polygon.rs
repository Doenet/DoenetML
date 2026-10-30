//! `<polygon>`: its definition and its planner (ADR 0016). Its vertices
//! are its list; a rigid or similar polygon keeps its shape through one
//! instruction that owns every vertex. A triangle is planned here too
//! (`triangle.rs`), with three vertices.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{Pivot, RigidOpts, VecOp};
use crate::tick::snap::Shape;

component! {
    /// `<polygon vertices="...">`, optionally rigid: its vertices are its list
    /// (ADR 0016), up to `MAX_VERTICES`, or `MAX_RIGID_VERTICES` when rigid.
    tags: ["polygon"],
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
        // A vertex drag requests one, a whole-polygon drag all; the
        // renderer draws every one.
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
    planner: Plan(plan),
}

pub const NUM_VERTICES: usize = Props::AT.numVertices;

/// Plans a polygon from its `vertices` and, when it is `rigid` or
/// `preserveSimilarity`, how a drag may move it.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    plan_vertices(ctx, ComponentType::Polygon, &[])
}

/// Plans an element of `component_type`, which declares the polygon's
/// list and attributes, from its `vertices`. With `defaults`, it has as many
/// vertices as they hold: one past those the author gave is essential
/// state at its default, and one given past them is not read. Without, it
/// has as many as were given.
pub(super) fn plan_vertices(
    ctx: &mut PlanCtx<'_, '_>,
    component_type: ComponentType,
    defaults: &[DefaultPoint],
) -> Result<ElemWiring> {
    let mut vertices = ctx.points(attr::vertices)?;
    if !defaults.is_empty() {
        vertices.truncate(defaults.len());
    }
    let n = vertices.len().max(defaults.len());
    // A vertex as given, else its default.
    let vertex = |k: usize| -> [Wire; 2] {
        match vertices.get(k) {
            Some(v) => Wire::point(v, shared_point_state(k), attr::vertices),
            None => {
                Wire::point_or_default(None, shared_point_state(k), attr::vertices, defaults[k])
            }
        }
    };
    if n > super::MAX_VERTICES {
        return Err(Error::Unsupported(format!(
            "a polygon with more than {} vertices",
            super::MAX_VERTICES
        )));
    }
    // The vertices are the list (ADR 0016), as many as given.
    let mut wiring = ElemWiring::with_list(component_type, n);
    let n_public = wiring.n_public;
    let flag = |ctx: &PlanCtx<'_, '_>, name: Attr, default: bool| -> bool {
        match ctx.attr(name) {
            None => default,
            Some(a) => {
                let text = ctx.attr_text(a).unwrap_or_default();
                let text = text.trim();
                text.is_empty() || text.eq_ignore_ascii_case("true")
            }
        }
    };
    let rigid = flag(ctx, attr::rigid, false);
    let similar = flag(ctx, attr::preserveSimilarity, false);
    let pivot_point = match ctx.attr(attr::rotationCenter) {
        Some(a)
            if flag(ctx, attr::rotateAround, false)
                || ctx
                    .text(attr::rotateAround)
                    .is_some_and(|r| r.trim() == "point") =>
        {
            Some(ctx.point_at(a)?)
        }
        _ => None,
    };
    // How far a pure dilation may shrink the shape: the `Shape`
    // instruction's last input.
    let min_shrink = ctx
        .text(attr::minShrink)
        .and_then(|s| s.trim().parse::<f64>().ok())
        .unwrap_or(0.1);
    let rigid_opts = if rigid || similar {
        let rotate_around = ctx.text(attr::rotateAround).unwrap_or_default();
        let pivot = match rotate_around.trim() {
            "vertex" => {
                let k = ctx
                    .text(attr::rotationVertex)
                    .and_then(|s| s.trim().parse::<usize>().ok())
                    .unwrap_or(1);
                Pivot::Vertex(byte(k.saturating_sub(1)))
            }
            "point" if pivot_point.is_some() => Pivot::Point,
            _ => Pivot::Centroid,
        };
        Some(RigidOpts {
            // `rigid` forbids dilation; `preserveSimilarity` allows it
            // unless `allowDilation` says otherwise.
            dilate: !rigid && flag(ctx, attr::allowDilation, true),
            rotate: flag(ctx, attr::allowRotation, true),
            translate: flag(ctx, attr::allowTranslation, true),
            pivot,
        })
    } else {
        None
    };
    if rigid_opts.is_some() && n > super::MAX_RIGID_VERTICES {
        return Err(Error::Unsupported(format!(
            "a rigid polygon with more than {} vertices",
            super::MAX_RIGID_VERTICES
        )));
    }
    let points: Vec<[Wire; 2]> = match rigid_opts {
        // Rigid: the document declares the coupling, so one instruction
        // owns every vertex.
        Some(opts) if n > 0 => {
            let mut args = Vec::with_capacity(2 * n + 2);
            for k in 0..n {
                let [x, y] = match vertices.get(k) {
                    Some(v) => wiring.hidden_point_with_shared_state(
                        v,
                        shared_point_state(k),
                        attr::vertices,
                    ),
                    None => vertex(k).map(|w| wiring.hidden_wire(w)),
                };
                args.push(x);
                args.push(y);
            }
            // The pivot point rides along as two more inputs, NaN when
            // the shape rotates about a centroid or vertex.
            match &pivot_point {
                Some(pp) => {
                    let [x, y] = wiring.hidden_point(pp);
                    args.push(x);
                    args.push(y);
                }
                None => {
                    args.push(wiring.hidden(Source::absent()));
                    args.push(wiring.hidden(Source::absent()));
                }
            }
            let first = component_type
                .list_slot(n_public, 1, 0)
                .expect("a vertex the polygon holds");
            let mut outputs = ElemWiring::vector_from(
                first,
                VecOp::Shape { n: byte(n), opts },
                args,
                &[min_shrink],
            )
            .into_iter();
            (0..n)
                .map(|_| [outputs.next().unwrap(), outputs.next().unwrap()])
                .collect()
        }
        // Free: the vertices are the points; a vertex may be defined
        // from its siblings without a cycle.
        _ => (0..n).map(vertex).collect(),
    };
    wiring.set_public(Props {
        numVertices: Wire::fixed(n as f64),
    });
    wiring.set_list(points);
    Ok(wiring)
}
