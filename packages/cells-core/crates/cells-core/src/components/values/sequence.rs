//! `<sequence>`: a static sequence of numbers (ADR 0041), its definition
//! and its planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<sequence from to step length exclude>`: the numbers `from, from +
    /// step, ...`, `length` of them, less what it excludes, as the current
    /// core counts them from whichever of the four are given (`from` 1,
    /// `step` 1 and `length` 10 by default; `to` and `length` give the
    /// step). Its entries are its list, `numbers` (`number1`, ...), and
    /// `numComponents` how many there are. Every parameter is a literal:
    /// a count that follows a reference is a structural sequence (ADR 0041
    /// step 4), not supported, as letters and math are not.
    tags: ["sequence"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: by_planner { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        from: Scalar,
        to: Scalar,
        step: Scalar,
        length: Scalar,
        exclude: Scalars,
        r#type: Text,
    }
    children: None,
    planner: Plan(plan),
}

/// The most numbers a sequence holds: its entries are a list's ports.
const MAX_SEQUENCE: usize = 1000;

/// From, step and length, as the current core's
/// `calculateSequenceParameters` gives them for numbers from whichever are
/// given; an error when all four are.
pub(crate) fn parameters(
    from: Option<f64>,
    to: Option<f64>,
    step: Option<f64>,
    length: Option<f64>,
) -> Result<(f64, f64, f64)> {
    // The count of a run from `a` to `b` by `s`, rounded as the current
    // core rounds it.
    let count = |a: f64, b: f64, s: f64| (((b - a) / s + 1.0) * (1.0 + 1e-14)).floor();
    Ok(match (from, to) {
        (None, None) => (1.0, step.unwrap_or(1.0), length.unwrap_or(10.0)),
        (None, Some(to)) => {
            let step = step.unwrap_or(1.0);
            let length = length.unwrap_or_else(|| count(1.0, to, step));
            (to - step * (length - 1.0), step, length)
        }
        (Some(from), None) => (from, step.unwrap_or(1.0), length.unwrap_or(10.0)),
        (Some(from), Some(to)) => match (step, length) {
            (None, None) => (from, 1.0, count(from, to, 1.0)),
            (None, Some(length)) => (from, (to - from) / (length - 1.0), length),
            (Some(step), None) => (from, step, count(from, to, step)),
            (Some(_), Some(_)) => {
                return Err(Error::Unsupported(
                    "<sequence> with from, to, step and length all given".into(),
                ));
            }
        },
    })
}

/// Its entries: constants the planner counts from its literal parameters.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    if let Some(t) = &attrs.r#type
        && !t.trim().eq_ignore_ascii_case("number")
    {
        return Err(Error::Unsupported(format!(
            "<sequence type=\"{}\">: only numbers",
            t.trim()
        )));
    }
    let literal = |name: &str, source: Option<Source>| -> Result<Option<f64>> {
        match source {
            None => Ok(None),
            Some(Source::Leaf(Leaf::Given(v) | Leaf::Const(v))) => Ok(Some(v)),
            Some(_) => Err(Error::Unsupported(format!(
                "<sequence {name}> that is no number: a count that follows a value is a structural sequence"
            ))),
        }
    };
    let (from, step, length) = parameters(
        literal("from", attrs.from)?,
        literal("to", attrs.to)?,
        literal("step", attrs.step)?,
        literal("length", attrs.length)?,
    )?;
    let exclude = attrs
        .exclude
        .into_iter()
        .map(|x| literal("exclude", Some(x)).map(Option::unwrap))
        .collect::<Result<Vec<f64>>>()?;
    // A length that is no whole number, or below 0, is none, as the
    // current core warns and takes.
    let length = if length.is_finite() && length >= 0.0 && length.fract() == 0.0 {
        length as usize
    } else {
        0
    };
    if length > MAX_SEQUENCE {
        return Err(Error::Unsupported(format!(
            "<sequence> of more than {MAX_SEQUENCE} numbers"
        )));
    }
    let values: Vec<f64> = (0..length)
        .map(|k| if k == 0 { from } else { from + step * k as f64 })
        .filter(|v| {
            !exclude
                .iter()
                .any(|x| (x - v).abs() <= 1e-10 * v.abs().max(1.0))
        })
        .collect();
    let n = values.len();
    let mut wiring = ElemWiring::with_list(ctx.component_type(), n);
    wiring.set_entries(
        values
            .into_iter()
            .map(|v| {
                if v.is_nan() {
                    Wire::absent()
                } else {
                    Wire::constant(v)
                }
            })
            .collect(),
    );
    wiring.set_public(Props {
        numComponents: Wire::constant(n as f64),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "sequence.spec.rs"]
mod spec;
