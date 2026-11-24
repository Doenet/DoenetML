//! `<sequence>`: a static sequence of numbers, letters or math (ADR 0041,
//! ADR 0074), its definition and its planner.

use super::typed_sequence::{LetterRun, SeqKind, TypedParams, letter_run, math_port, math_values};
use crate::compile::api::*;
use crate::components::EntryKind;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{MAX_SEQUENCE, sequence_parameters, sequence_values};

component! {
    /// `<sequence from to step length exclude type>`: the numbers `from,
    /// from + step, ...`, `length` of them, less what it excludes, as the
    /// current core counts them from whichever of the four are given
    /// (`from` 1, `step` 1 and `length` 10 by default; `to` and `length`
    /// give the step). Its entries are its list, `numbers` (`number1`,
    /// ...), and `numComponents` how many there are. Every parameter is
    /// written as a literal here, a static sequence: one with a parameter
    /// that is a reference or math is a structural sequence (ADR 0041,
    /// decision 2), of the type `structural` names. `type="letters"` lists
    /// letters (`from="c"`, `a` to `z`, then `aa`, ...), strings the
    /// compile interns, and `type="math"` expressions the symbolic engine
    /// steps (`from="x" step="y"`), each the element's kind of entry (ADR
    /// 0074).
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
    // Each parameter as the pieces it is written in, read as numbers, or
    // as letters or math by `type`.
    attributes {
        from: Entries,
        to: Entries,
        step: Entries,
        length: Entries,
        exclude: Entries,
        r#type: Text,
        hide: Flag(false),
    }
    static_count: count,
    children: None,
    planner: Plan(plan),
}

/// What a static sequence holds: numbers, letters, or expressions.
enum Values {
    Numbers(Vec<f64>),
    Letters(LetterRun),
    Math(Vec<crate::sym::Tree<RefId>>),
}

impl Values {
    fn len(&self) -> Result<usize> {
        Ok(match self {
            Values::Numbers(v) => v.len(),
            Values::Letters(run) => run.numbers()?.len(),
            Values::Math(v) => v.len(),
        })
    }
}

/// A parameter's pieces as the text they are written as, joined at the
/// spaces between them: None when it is not written, an error when a
/// piece is a reference.
fn written(name: &str, pieces: &[ListPiece]) -> Result<Option<String>> {
    if pieces.is_empty() {
        return Ok(None);
    }
    let texts = pieces
        .iter()
        .map(|p| match p {
            ListPiece::Text(t) => Ok(t.as_str()),
            _ => Err(Error::Unsupported(format!(
                "<sequence {name}> that is no literal: a count that follows a value is a structural sequence"
            ))),
        })
        .collect::<Result<Vec<_>>>()?;
    Ok(Some(texts.join(" ")))
}

/// A written parameter as a number.
fn number(name: &str, text: Option<String>) -> Result<Option<f64>> {
    text.map(|t| {
        t.trim().parse::<f64>().map_err(|_| {
            Error::Unsupported(format!(
                "<sequence {name}> that is no number: a count that follows a value is a structural sequence"
            ))
        })
    })
    .transpose()
}

/// Its values, from its literal parameters: an error for a parameter that
/// is no literal of its type, all four given, or more than
/// [`MAX_SEQUENCE`].
fn values(attrs: Attrs) -> Result<Values> {
    let kind = SeqKind::of(attrs.r#type.as_deref());
    let from = written("from", &attrs.from)?;
    let to = written("to", &attrs.to)?;
    let step = written("step", &attrs.step)?;
    let length = number("length", written("length", &attrs.length)?)?;
    let exclude: Vec<String> = attrs
        .exclude
        .iter()
        .map(|p| written("exclude", std::slice::from_ref(p)).map(Option::unwrap))
        .collect::<Result<_>>()?;
    let typed = |from, to, step, exclude| TypedParams {
        from,
        to,
        step,
        length,
        exclude,
    };
    match kind {
        SeqKind::Letters => {
            return Ok(Values::Letters(letter_run(&typed(
                from, to, step, exclude,
            ))?));
        }
        SeqKind::Math => return Ok(Values::Math(math_values(&typed(from, to, step, exclude))?)),
        SeqKind::Number => {}
    }
    let (from, step, length) = sequence_parameters(
        number("from", from)?,
        number("to", to)?,
        number("step", step)?,
        length,
    )
    .ok_or_else(|| {
        Error::Unsupported("<sequence> with from, to, step and length all given".into())
    })?;
    let exclude = exclude
        .into_iter()
        .map(|x| number("exclude", Some(x)).map(Option::unwrap))
        .collect::<Result<Vec<f64>>>()?;
    if length.is_finite() && length > MAX_SEQUENCE as f64 {
        return Err(Error::Unsupported(format!(
            "<sequence> of more than {MAX_SEQUENCE} numbers"
        )));
    }
    Ok(Values::Numbers(
        sequence_values(from, step, length, &exclude).collect(),
    ))
}

/// How many values its record makes: a reference to it among a list's
/// children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    values(Attrs::of(record)).and_then(|v| v.len()).ok()
}

/// Its entries: constants the planner counts from its literal parameters,
/// numbers, or strings or expressions shown, which no request passes.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let hide = Wire::scalar(attrs.hide.clone(), GivenId::Attr(attr::hide, 0));
    let mut wiring = match values(attrs)? {
        Values::Numbers(values) => {
            let mut wiring = ElemWiring::with_list(ctx.component_type(), values.len());
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
            wiring
        }
        Values::Letters(run) => {
            let numbers = run.interned(ctx)?;
            let mut wiring =
                ElemWiring::with_entries(ctx.component_type(), numbers.len(), EntryKind::Text);
            wiring.set_entries(
                numbers
                    .into_iter()
                    .map(|v| run.constant(v).into())
                    .collect(),
            );
            wiring
        }
        Values::Math(values) => {
            let mut wiring =
                ElemWiring::with_entries(ctx.component_type(), values.len(), EntryKind::Math);
            let entries = values
                .into_iter()
                .map(|t| Wire::own(math_port(&mut wiring, t)))
                .collect();
            wiring.set_entries(entries);
            wiring
        }
    };
    wiring.set_planned(Planned { hide });
    Ok(wiring)
}

#[cfg(test)]
#[path = "sequence.spec.rs"]
mod spec;
