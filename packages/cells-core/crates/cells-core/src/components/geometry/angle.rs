//! `<angle>`: its definition and its planner. An angle is a measure, given
//! in radians or degrees, or the angle at the second of three points.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{Reflex, VecOp};
use std::f64::consts::PI;

component! {
    /// `<angle through="$A $B $C"/>`, `<angle radians="pi/4"/>`, `<angle
    /// degrees="45"/>` or `<angle>pi/4</angle>`: its measure in radians and
    /// in degrees. Shown as its measure; not drawn in a graph.
    tags: ["angle"],
    flags: [copyable],
    text: Number(radians),
    props {
        radians: by_planner { rendered },
        degrees: by_planner { rendered },
    }
    alternate_names {
        value: radians,
        angle: radians,
    }
    // How a renderer shows and draws it.
    presentation { inDegrees, radius, emphasizeRightAngle }
    attributes {
        through: Points,
        radians: Scalar,
        degrees: Scalar,
        chooseReflexAngle: Text,
        betweenLines: Written,
    }
    children: Math,
    planner: Plan(plan),
}

/// Plans an angle from its `radians`, its `degrees`, its children (a
/// measure in radians), or its three `through` points; with fewer points
/// and no measure it is a right angle, as in the current core.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    if attrs.betweenLines {
        return Err(Error::Unsupported("<angle betweenLines>".into()));
    }
    let reflex = match attrs
        .chooseReflexAngle
        .as_deref()
        .map(|t| t.trim().to_ascii_lowercase())
        .as_deref()
    {
        Some("allowed") => Reflex::Allowed,
        Some("always") => Reflex::Always,
        _ => Reflex::Never,
    };
    let mut wiring = ElemWiring::of(ComponentType::Angle);
    let to_degrees = Source::computed_k(OpSpec::Mul, at.radians, 180.0 / PI).into();
    let (radians, degrees) = if let Some(r) = attrs.radians {
        (Wire::scalar(r, GivenId::Attr(attr::radians, 0)), to_degrees)
    } else if let Some(d) = attrs.degrees {
        (
            Source::computed_k(OpSpec::Mul, at.degrees, PI / 180.0).into(),
            Wire::scalar(d, GivenId::Attr(attr::degrees, 0)),
        )
    } else if let Some(nodes) = &attrs.children {
        let r = ctx.scalar_of(nodes)?;
        (Wire::scalar(r, GivenId::Children(0)), to_degrees)
    } else if let [p1, v, p3, ..] = attrs.through.as_slice() {
        let mut args = Vec::with_capacity(6);
        for (k, p) in [p1, v, p3].into_iter().enumerate() {
            args.extend(wiring.hidden_point_of(p, attr::through, k));
        }
        let [radians] = ElemWiring::vector([at.radians], VecOp::AngleAt { reflex }, args);
        (radians, to_degrees)
    } else {
        // The current core puts the missing third point a right angle
        // from the first ray.
        let right = if reflex == Reflex::Always {
            1.5 * PI
        } else {
            PI / 2.0
        };
        (Wire::constant(right), to_degrees)
    };
    wiring.set_public(Props { radians, degrees });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "angle.spec.rs"]
mod spec;
