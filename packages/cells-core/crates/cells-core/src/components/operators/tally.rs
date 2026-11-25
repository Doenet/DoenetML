//! `<tally>`: how many of its operands equal each category `categories`
//! names (ADR 0078), as the current core's `CountOperators.js` counts
//! them: a list of numbers, one per category in the order they are
//! declared, its children read as a list (ADR 0041) as `<sort>` reads
//! them ([`super::sort`]: bare text as numbers when every piece is one,
//! else as text, unless `type` says), and the categories its second
//! named sequence (`categories`, ADR 0053), each as it was written.
//!
//! A category is compared with the operands the way they are read: as a
//! number when they are numbers or math and it is written as one (`1/2`
//! names a half), as true or false when they are booleans, else as text
//! ([`SymKind::Tally`]). A value that is no number by kind (a
//! `<number>x</number>`) equals no category. Two written categories that
//! compare equal are the current core's warning.
//!
//! Its list is capped (ADR 0041 decision 2, ADR 0086): with declared
//! categories, one entry per category, all live; with none, one entry
//! per operand, the first as many as there are distinct values
//! (`numComponents`, the live length) counting each in order
//! ([`SymKind::TallyDistinct`]), the rest the missing value and their
//! rows hidden, and `categories` the distinct values themselves.

use super::sort::{Mode, Operand, mode_of, operand_ports, operands_of, pieces_of, real_number};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{OpSpec, SymKind, VecOp};

component! {
    /// `<tally categories="4 3 2 1">1 4 1 2 2 2 4</tally>`: how many of
    /// its operands equal each category (`2, 0, 3, 2`), as a list of
    /// numbers (`numbers`, `number1`, ...), and the categories in the
    /// same order (`categories`). With no `categories`, the categories
    /// are the distinct values in order (`<tally>1 4 1</tally>` is `2, 1`
    /// of `1, 4`), a capped list as long as its operands whose live
    /// length is `numComponents`. A request cannot change a count.
    tags: ["tally"],
    flags: [copyable],
    default_prop: numbers,
    props {
        // How many categories: the live length.
        numComponents: by_planner { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number,
        rendered: true,
        live: numComponents,
        sequences: [categories],
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        r#type: Text,
        categories: Entries,
    }
    counted_entries { pieces: categories, count: one_each }
    children: List,
    planner: Plan(plan),
}

/// Its declared categories, which it counts one entry each (ADR 0078);
/// with none, its operands, at most one category each (ADR 0086).
fn categories(record: &Record) -> Vec<ListPiece> {
    let attrs = Attrs::of(record);
    if attrs.categories.is_empty() {
        attrs.children
    } else {
        attrs.categories
    }
}

/// One count per category, or per operand.
fn one_each(_: &Record, n: usize) -> usize {
    n
}

/// Two declared categories compare equal (`doenet-w0142`).
const REPEATED: &str = "doenet-w0142";

/// What a declared category written as text is compared by, the operands
/// read in `mode`.
#[derive(PartialEq)]
enum Written {
    Number(f64),
    Text(String),
}

/// One count per declared category, the outputs of [`SymKind::Tally`]
/// over the operands and what each category is compared by; the
/// categories as written, its named sequence `categories`.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let entries = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let n = entries.len();
    if attrs.categories.is_empty() && n == 0 {
        // No operands: nothing to count, and no category.
        let mut wiring = ElemWiring::with_list(ty, 0);
        wiring.set_sequence("categories", Vec::new());
        wiring.set_hides(Vec::new());
        wiring.set_planned(Planned {
            numComponents: Wire::constant(0.0),
        });
        return Ok(wiring);
    }
    let pieces = pieces_of(ctx, attrs.r#type.as_deref(), &entries);
    let ops = operands_of(ctx, entries, pieces)?;
    let mode = mode_of(ty, &ops)?;
    if mode == Mode::Point {
        return Err(Error::Unsupported(
            "a <tally> of points or vectors: only numbers, texts, math and booleans are counted"
                .into(),
        ));
    }
    if attrs.categories.is_empty() {
        return plan_distinct(ctx, ops, mode);
    }
    let cats = ctx.list_entries(attrs.categories, f64::INFINITY)?;
    let k = cats.len();
    if n + k > 64 {
        return Err(Error::Unsupported(format!(
            "<{}> of more than 64 operands and categories together",
            ty.tag()
        )));
    }
    let mut wiring = ElemWiring::with_list(ty, k);
    let values = operand_ports(ctx, &mut wiring, &ops, mode, true)?;
    // Each category as written (its entry of `categories`) and what it is
    // compared by.
    let mut shown = Vec::with_capacity(k);
    let mut keys = Vec::with_capacity(k);
    let mut written = Vec::with_capacity(k);
    for (j, c) in cats.into_iter().enumerate() {
        match c {
            ListEntry::Text(_, text) => {
                let text = text.trim().to_string();
                let id = GivenId::Attr(attr::categories, j as u32);
                let s = wiring.hidden_wire(Wire::given_text(id, ctx.intern(&text)));
                let by = match mode {
                    Mode::Number | Mode::Math => real_number(&text).map(Written::Number),
                    Mode::Boolean if text.eq_ignore_ascii_case("true") => {
                        Some(Written::Number(1.0))
                    }
                    Mode::Boolean if text.eq_ignore_ascii_case("false") => {
                        Some(Written::Number(0.0))
                    }
                    _ => None,
                };
                keys.push(match by {
                    Some(Written::Number(v)) => wiring.hidden(Source::constant(v)),
                    _ => s,
                });
                written.push(Some(by.unwrap_or(Written::Text(text))));
                shown.push(Wire::own(s));
            }
            ListEntry::Ref(p) => {
                let s = wiring.hidden(Source::reference(p));
                keys.push(s);
                written.push(None);
                shown.push(Wire::own(s));
            }
            ListEntry::Math(_) => {
                return Err(Error::Unsupported(
                    "math with a reference inside its brackets among a <tally>'s categories".into(),
                ));
            }
        }
    }
    let repeated = written
        .iter()
        .enumerate()
        .any(|(i, a)| a.is_some() && written[i + 1..].iter().any(|b| b.is_some() && b == a));
    if repeated {
        ctx.warn(
            REPEATED,
            "`categories` names the same category more than once. Each count reports the values equal to its own category, so the repeated ones all report the same number.",
        );
    }
    let counts: Vec<Wire> = if n == 0 {
        (0..k).map(|_| Wire::constant(0.0)).collect()
    } else {
        let mut args = values;
        args.extend(keys);
        let head = wiring.hidden(Source::computed(
            OpSpec::Sym(SymKind::Tally {
                n: byte(n),
                k: byte(k),
                kinds: 0,
            }),
            args,
        ));
        let mut ports = vec![head];
        for j in 1..k {
            ports.push(wiring.hidden(Source::Flow(Flow::VecOut(head, byte(j)))));
        }
        ports.into_iter().map(Wire::own).collect()
    };
    wiring.set_entries(counts);
    wiring.set_sequence("categories", shown);
    // Every declared category is live.
    wiring.set_hides((0..k).map(|_| Wire::constant(0.0)).collect());
    wiring.set_planned(Planned {
        numComponents: Wire::constant(k as f64),
    });
    Ok(wiring)
}

/// A tally with no declared categories (ADR 0086): a capped list, one
/// entry per operand, of [`SymKind::TallyDistinct`]'s outputs: as many
/// live as there are distinct values, each counting one in order, its
/// category the first operand equal to it (shown: a request on it is
/// dropped), the rest the missing value and their rows hidden.
fn plan_distinct(ctx: &mut PlanCtx<'_, '_>, ops: Vec<Operand>, mode: Mode) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let n = ops.len();
    if n > 64 {
        return Err(Error::Unsupported(format!(
            "<{}> of more than 64 operands with no `categories`",
            ty.tag()
        )));
    }
    let mut wiring = ElemWiring::with_list(ty, n);
    let values = operand_ports(ctx, &mut wiring, &ops, mode, true)?;
    let head = wiring.hidden(Source::computed(
        OpSpec::Sym(SymKind::TallyDistinct {
            n: byte(n),
            kinds: 0,
        }),
        values.clone(),
    ));
    let out = |wiring: &mut ElemWiring, j: usize| {
        wiring.hidden(Source::Flow(Flow::VecOut(head, byte(j))))
    };
    let shown: Vec<Port> = values
        .iter()
        .map(|&v| wiring.hidden(Source::computed(OpSpec::Shown, vec![v])))
        .collect();
    let mut categories = Vec::with_capacity(n);
    let mut counts = Vec::with_capacity(n);
    for k in 0..n {
        let first = out(&mut wiring, 1 + k);
        let mut args = vec![first];
        args.extend(&shown);
        categories.push(Source::computed(OpSpec::Vec(VecOp::Choose { n: byte(n) }), args).into());
        counts.push(Wire::own(out(&mut wiring, 1 + n + k)));
    }
    wiring.set_entries(counts);
    wiring.set_sequence("categories", categories);
    wiring.hide_past(head, None);
    wiring.set_planned(Planned {
        numComponents: Wire::own(head),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "tally.spec.rs"]
mod spec;
