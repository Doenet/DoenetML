//! `<sequence>`: a static sequence of numbers (ADR 0041), its definition
//! and its planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{MAX_SEQUENCE, sequence_parameters, sequence_values};

component! {
    /// `<sequence from to step length exclude>`: the numbers `from, from +
    /// step, ...`, `length` of them, less what it excludes, as the current
    /// core counts them from whichever of the four are given (`from` 1,
    /// `step` 1 and `length` 10 by default; `to` and `length` give the
    /// step). Its entries are its list, `numbers` (`number1`, ...), and
    /// `numComponents` how many there are. Every parameter is a literal
    /// number here, a static sequence: one with a parameter that is a
    /// reference or math is a structural sequence (ADR 0041, decision 2),
    /// of the type `structural` names. Letters and math are not
    /// supported.
    tags: ["sequence"],
    flags: [copyable],
    structural { when: [from, to, step, length, exclude], is: StructuralSequence }
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
        hide: by_planner { rendered },
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
        hide: Flag(false),
    }
    static_count: count,
    children: None,
    planner: Plan(plan),
}

/// Its numbers, from its literal parameters: an error for a type other
/// than numbers, a parameter that is no number, all four given, or more
/// than [`MAX_SEQUENCE`].
fn numbers(attrs: Attrs) -> Result<Vec<f64>> {
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
    let (from, step, length) = sequence_parameters(
        literal("from", attrs.from)?,
        literal("to", attrs.to)?,
        literal("step", attrs.step)?,
        literal("length", attrs.length)?,
    )
    .ok_or_else(|| {
        Error::Unsupported("<sequence> with from, to, step and length all given".into())
    })?;
    let exclude = attrs
        .exclude
        .into_iter()
        .map(|x| literal("exclude", Some(x)).map(Option::unwrap))
        .collect::<Result<Vec<f64>>>()?;
    if length.is_finite() && length > MAX_SEQUENCE as f64 {
        return Err(Error::Unsupported(format!(
            "<sequence> of more than {MAX_SEQUENCE} numbers"
        )));
    }
    Ok(sequence_values(from, step, length, &exclude).collect())
}

/// How many numbers its record makes: a reference to it among a list's
/// children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    numbers(Attrs::of(record)).ok().map(|v| v.len())
}

/// Its entries: constants the planner counts from its literal parameters.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let hide = Wire::scalar(attrs.hide.clone(), GivenId::Attr(attr::hide, 0));
    let values = numbers(attrs)?;
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
    wiring.set_planned(Planned { hide });
    Ok(wiring)
}

#[cfg(test)]
#[path = "sequence.spec.rs"]
mod spec;
