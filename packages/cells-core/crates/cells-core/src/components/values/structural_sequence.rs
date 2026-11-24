//! A `<sequence>` whose count follows a value: a structural sequence (ADR
//! 0041, decision 2), its definition, its planner and its item.

use super::typed_sequence::{SeqKind, TypedParams, letter_run, letters_to_number};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType, ItemDecl, prop};
use crate::error::{Error, Result};
use crate::program::{OpSpec, SymKind, VecOp};

/// The most values a structural sequence leaves out: its `exclude` is a
/// capped list, padded with the missing value (ADR 0041, decision 2).
pub(crate) const MAX_EXCLUDE: usize = 10;

component! {
    /// `<sequence from to step length exclude>` with a parameter that is
    /// no literal number (`to="$n"`): the same numbers a `<sequence>` has,
    /// counted when the document is built. Its count is a structural cell,
    /// `numComponents`, and its entries one `<number>` per iteration, the
    /// item it declares (ADR 0040), so a change of a parameter that changes
    /// the count is a rebuild (ADR 0004). `from`, `step` and `length` are
    /// what `calculateSequenceParameters` gives from whichever are given;
    /// `exclude` holds at most [`MAX_EXCLUDE`] values, the rest missing.
    tags: ["sequence"],
    flags: [internal],
    structure: Repeat { count: numComponents },
    item: Number(item),
    props {
        from: by_planner,
        step: by_planner,
        length: by_planner,
        exclude1: by_planner,
        exclude2: by_planner,
        exclude3: by_planner,
        exclude4: by_planner,
        exclude5: by_planner,
        exclude6: by_planner,
        exclude7: by_planner,
        exclude8: by_planner,
        exclude9: by_planner,
        exclude10: by_planner,
        numComponents: by_planner { rendered },
        hide: by_planner { rendered },
        // 1 when a sequence of letters shows them in lower case (ADR 0074).
        lowercase: by_planner,
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
        exclude: Entries,
        r#type: Text,
        hide: Flag(false),
    }
    children: None,
    planner: Plan(plan),
}

/// Its exclude slots, in order.
fn excludes() -> [Port; MAX_EXCLUDE] {
    let at = Props::PORTS;
    [
        at.exclude1,
        at.exclude2,
        at.exclude3,
        at.exclude4,
        at.exclude5,
        at.exclude6,
        at.exclude7,
        at.exclude8,
        at.exclude9,
        at.exclude10,
    ]
}

/// Its parameters from the given ones of `from`, `to`, `step` and
/// `length` (`VecOp::SequenceParams`), its excludes padded with the
/// missing value, and its count (`VecOp::SequenceCount`).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let mut attrs = Attrs::of(ctx.record());
    let kind = SeqKind::of(attrs.r#type.as_deref());
    if kind == SeqKind::Math {
        return Err(Error::Unsupported(
            "<sequence type=\"math\"> whose count follows a value: only numbers and letters".into(),
        ));
    }
    let letters = kind == SeqKind::Letters;
    let mut lowercase = 1.0;
    if letters {
        // Letters counted as numbers from literal parameters, every one
        // interned, so an entry makes no string (ADR 0074).
        let run = letters_of(ctx, &attrs)?;
        run.interned(ctx)?;
        lowercase = run.case();
        attrs.from = Some(Source::constant(run.from));
        attrs.to = None;
        attrs.step = Some(Source::constant(run.step));
        attrs.length = Some(Source::constant(run.length as f64));
    }
    let hide = Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0));
    let given = [attrs.from, attrs.to, attrs.step, attrs.length];
    if given.iter().all(Option::is_some) {
        return Err(Error::Unsupported(
            "<sequence> with from, to, step and length all given".into(),
        ));
    }
    // Each reference to a static sequence among the excludes is its
    // entries (ADR 0041, decision 9).
    let exclude: Vec<Source> = ctx
        .list_entries(attrs.exclude, f64::INFINITY)?
        .into_iter()
        .map(|entry| match entry {
            // A letter's number; a reference to a text, its letters'
            // number in the tick (`SymKind::LetterNumber`).
            ListEntry::Text(_, text) if letters => {
                // Text that is no letters excludes nothing.
                letters_to_number(&text).map_or_else(Source::absent, Source::constant)
            }
            ListEntry::Ref(p) if letters => Source::reference(p),
            ListEntry::Math(_) if letters => Source::absent(),
            ListEntry::Text(_, text) => match text.parse::<f64>() {
                Ok(v) => Source::given(v),
                Err(_) => match ctx.entry_math(&ListEntry::Text(0, text)) {
                    Some(id) => Source::math(id),
                    None => Source::absent(),
                },
            },
            ListEntry::Math(id) => Source::math(id),
            ListEntry::Ref(p) => Source::reference(p),
        })
        .collect();
    if exclude.len() > MAX_EXCLUDE {
        return Err(Error::Unsupported(format!(
            "<sequence> whose count follows a value, excluding more than {MAX_EXCLUDE} values"
        )));
    }
    let mut wiring = ElemWiring::of(ctx.component_type());
    let mut mask = 0u8;
    let mut inputs = Vec::new();
    for (bit, source) in given.into_iter().enumerate() {
        if let Some(source) = source {
            mask |= 1 << bit;
            inputs.push(wiring.hidden(source));
        }
    }
    let at = Props::PORTS;
    let [from, step, length] = ElemWiring::vector(
        [at.from, at.step, at.length],
        VecOp::SequenceParams { given: mask },
        inputs,
    );
    // Each read as a number: a math cell's expression evaluated (a math
    // list's entry), a number as it is.
    let mut exclude = exclude.into_iter().map(|source| {
        let reference = matches!(source, Source::Flow(Flow::Alias(_)));
        let held = wiring.hidden(source);
        if letters && reference {
            return Wire::computed(OpSpec::Sym(SymKind::LetterNumber), vec![held]);
        }
        Wire::from(Source::value_of(held, held))
    });
    let [
        exclude1,
        exclude2,
        exclude3,
        exclude4,
        exclude5,
        exclude6,
        exclude7,
        exclude8,
        exclude9,
        exclude10,
    ] = std::array::from_fn(|_| exclude.next().unwrap_or_else(Wire::absent));
    let mut counted = vec![at.from, at.step, at.length];
    counted.extend(excludes());
    wiring.set_planned(Planned {
        from,
        step,
        length,
        exclude1,
        exclude2,
        exclude3,
        exclude4,
        exclude5,
        exclude6,
        exclude7,
        exclude8,
        exclude9,
        exclude10,
        numComponents: Wire::computed(
            OpSpec::Vec(VecOp::SequenceCount {
                n_exclude: MAX_EXCLUDE as u8,
            }),
            counted,
        ),
        hide,
        lowercase: Wire::constant(lowercase),
    });
    Ok(wiring)
}

/// A sequence of letters' run from its literal parameters (`from` and
/// `to` letters, `step` and `length` numbers); its excludes are counted
/// apart.
fn letters_of(ctx: &PlanCtx<'_, '_>, attrs: &Attrs) -> Result<super::typed_sequence::LetterRun> {
    let text = |name: &str, s: &Option<Source>| match s {
        None => Ok(None),
        Some(s) => ctx.source_text(s).map(Some).ok_or_else(|| {
            Error::Unsupported(format!(
                "<sequence type=\"letters\"> whose `{name}` follows a value: only its excludes may"
            ))
        }),
    };
    let length = match &attrs.length {
        None => None,
        Some(s) => Some(
            text("length", &Some(s.clone()))?
                .and_then(|t| t.trim().parse().ok())
                .ok_or_else(|| Error::BadValue {
                    attr: "length".into(),
                    text: String::new(),
                })?,
        ),
    };
    letter_run(&TypedParams {
        from: text("from", &attrs.from)?,
        to: text("to", &attrs.to)?,
        step: text("step", &attrs.step)?,
        length,
        exclude: Vec::new(),
    })
}

/// The structural sequence of letters (ADR 0074): the same parameters and
/// count as a sequence of numbers, its item a `<text>`, the letters of the
/// number a sequence of numbers' item would hold.
pub(crate) const LETTERS: ComponentDef =
    DEFINITION
        .variant(&["sequence"], &SeqKind::Letters)
        .item(ItemDecl {
            ty: ComponentType::Text,
            wire: letters_item,
        });

/// Entry `k` of a sequence of letters: a `<text>` holding the letters of
/// the `k`-th number left, in the sequence's case.
fn letters_item(ctx: &mut ItemCtx<'_>) -> Vec<(Port, Wire)> {
    let number = entry(ctx);
    let lowercase = ctx.owner(Props::PORTS.lowercase);
    let value = ctx.computed(OpSpec::Sym(SymKind::Letters), vec![number, lowercase]);
    prop::text::Planned {
        value: Wire::own(value),
    }
    .into_iter()
    .collect()
}

/// The `k`-th number left (`VecOp::SequenceEntry`), from the sequence's
/// parameters and excludes, a hidden port of the item.
fn entry(ctx: &mut ItemCtx<'_>) -> Port {
    let at = Props::PORTS;
    let mut args = vec![
        ctx.index(),
        ctx.owner(at.from),
        ctx.owner(at.step),
        ctx.owner(at.length),
    ];
    for x in excludes() {
        args.push(ctx.owner(x));
    }
    ctx.computed(
        OpSpec::Vec(VecOp::SequenceEntry {
            n_exclude: MAX_EXCLUDE as u8,
        }),
        args,
    )
}

/// Entry `k`: a `<number>` holding the `k`-th value left
/// (`VecOp::SequenceEntry`), from the sequence's parameters and excludes.
fn item(ctx: &mut ItemCtx<'_>) -> prop::number::Planned {
    let at = Props::PORTS;
    let mut args = vec![
        ctx.index(),
        ctx.owner(at.from),
        ctx.owner(at.step),
        ctx.owner(at.length),
    ];
    for x in excludes() {
        args.push(ctx.owner(x));
    }
    prop::number::Planned {
        value: Wire::computed(
            OpSpec::Vec(VecOp::SequenceEntry {
                n_exclude: MAX_EXCLUDE as u8,
            }),
            args,
        ),
    }
}

#[cfg(test)]
#[path = "structural_sequence.spec.rs"]
mod spec;
