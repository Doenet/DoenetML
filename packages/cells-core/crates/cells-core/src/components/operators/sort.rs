//! `<sort>` and `<shuffle>`: a permutation of their operands (ADR 0041,
//! decision 7), their children read as a list. An order port, a hidden
//! port per position holding the operand that comes there (1-based), is
//! computed by comparing the operands (`SymKind::Order`, as the current
//! core's `compareExtractedValues` does) or drawn at load from the seed (a
//! `Shuffle` of the positions, a constant, ADR 0037); each entry is a
//! `Choose` over the operands by its position's order, so a write through
//! an entry lands on the operand it shows.
//!
//! The operands hold one kind of value, which the compile decides from the
//! records (ADR 0053): numbers; else expressions, when one can be math
//! (each operand then a math cell, compared by value when every one
//! evaluates to a number, else by its text); else texts, when one is text
//! (each other operand then its text, made in the tick, compared as
//! text). Bare text is split at spaces and read as numbers when every
//! piece is a real number to the engine, else as text, unless `type` says
//! (`number`, `math`, `text`). Points, vectors and booleans are not
//! sorted yet: an entry of a point is two cells, and a type's entries have
//! one width (see ADR 0053).

use super::operands;
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType};
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{OpSpec, Post, SymKind, VecOp};

component! {
    /// `<sort>5 3 1 $a</sort>`: its operands in increasing order
    /// (`values`, `value1`, ...), numbers by value, texts alphabetically,
    /// expressions by value when each is a number, else by their text. A
    /// write to an entry lands on the operand it shows. `asList="false"`
    /// shows the entries with no separator.
    tags: ["sort"],
    flags: [copyable],
    default_prop: values,
    props {
        numComponents: by_planner { rendered },
        asList: by_planner { rendered },
    }
    list {
        names: [values],
        item: math,
        values: value of Any, entries: children,
        rendered: true,
        companion: componentOrder,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        r#type: Text,
        asList: LiteralFlag,
    }
    children: List,
    planner: Plan(plan),
}

/// `<shuffle>`: its operands in an order drawn at load from the document
/// seed (a seeded permutation, ADR 0041 decision 7), which no student
/// can change; the values themselves follow their operands.
pub(crate) const SHUFFLE: ComponentDef = DEFINITION.with_tags(&["shuffle"]);

/// The diagnostic for a `type` that names no reading of bare text.
pub(crate) const INVALID_TYPE: &str = "cells-invalid-type";

/// What the operands are read as, decided once per element.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Mode {
    Number,
    Math,
    Text,
}

/// How bare text among the children is read.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Pieces {
    Number,
    Math,
    Text,
}

/// The order port and an entry per position over the operands: see the
/// module documentation.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let as_list = !matches!(attrs.asList, Some(Some(false)));
    let entries = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let n = entries.len();
    // What bare text is read as: `type`, else what every piece looks like.
    let pieces = match attrs
        .r#type
        .as_deref()
        .map(|t| t.trim().to_ascii_lowercase())
    {
        Some(t) if t == "number" => Pieces::Number,
        Some(t) if t == "math" => Pieces::Math,
        Some(t) if t == "text" => Pieces::Text,
        Some(t) if t == "boolean" => {
            return Err(Error::Unsupported(format!(
                "<{} type=\"boolean\">: booleans are not sorted or shuffled yet",
                ty.tag()
            )));
        }
        other => {
            if let Some(t) = other {
                ctx.warn(
                    INVALID_TYPE,
                    &format!(
                        "Invalid type {t} for {} component: reading the values as though no type had been given",
                        ty.tag()
                    ),
                );
            }
            let all_numbers = entries.iter().all(|e| match e {
                ListEntry::Text(_, text) => real_number(text).is_some(),
                _ => true,
            });
            if all_numbers {
                Pieces::Number
            } else {
                Pieces::Text
            }
        }
    };
    // What each operand is, as far as the records tell; a reference they
    // do not tell is read as a number, as it was.
    let mut kinds = Vec::with_capacity(n);
    for e in &entries {
        kinds.push(match e {
            ListEntry::Text(..) => match pieces {
                Pieces::Number => ValueKind::Number,
                Pieces::Math => ValueKind::Math,
                Pieces::Text => ValueKind::Text,
            },
            _ => match ctx.entry_kind(e) {
                None => ValueKind::Number,
                Some(k @ (ValueKind::Number | ValueKind::Math | ValueKind::Text)) => k,
                Some(ValueKind::Point | ValueKind::List) => {
                    return Err(Error::Unsupported(format!(
                        "points or vectors in a <{}>: an entry of a point is two cells, which a <{}> of values does not hold yet",
                        ty.tag(),
                        ty.tag()
                    )));
                }
                Some(ValueKind::Boolean) => {
                    return Err(Error::Unsupported(format!(
                        "booleans in a <{}>: not sorted or shuffled yet",
                        ty.tag()
                    )));
                }
            },
        });
    }
    let mode = if kinds.contains(&ValueKind::Text) {
        Mode::Text
    } else if kinds.contains(&ValueKind::Math) {
        Mode::Math
    } else {
        Mode::Number
    };
    let mut wiring = ElemWiring::with_list(ty, n);
    if n > 0 {
        if n > crate::limits::MAX_VEC_IN - 1 {
            return Err(Error::Unsupported(format!(
                "<{}> of more than {} operands",
                ty.tag(),
                crate::limits::MAX_VEC_IN - 1
            )));
        }
        let ops = operand_ports(ctx, &mut wiring, entries, &kinds, mode)?;
        let order = order_ports(&mut wiring, ty, &ops);
        // A sort's entry is chosen by an order the operand it shows
        // decides, so a write through it would move it: each branch is
        // shown, and a request on an entry dropped. A shuffle's order is
        // drawn, and a write lands on the operand.
        let branches: Vec<Port> = if ty == ComponentType::Shuffle {
            ops.clone()
        } else {
            ops.iter()
                .map(|&p| wiring.hidden(Source::computed(OpSpec::Shown, vec![p])))
                .collect()
        };
        let chosen = order
            .iter()
            .map(|&o| {
                let mut args = vec![o];
                args.extend(&branches);
                Source::computed(OpSpec::Vec(VecOp::Choose { n: byte(n) }), args).into()
            })
            .collect();
        wiring.set_entries(chosen);
        // The order, public as the list's companion sequence (ADR 0053):
        // a shuffle's `componentOrder`, and a sort's.
        wiring.set_companion(order.iter().map(|&o| Wire::own(o)).collect());
    }
    wiring.set_public(Props {
        numComponents: Wire::constant(n as f64),
        asList: Wire::constant(if as_list { 1.0 } else { 0.0 }),
    });
    Ok(wiring)
}

/// A port per operand, holding the kind `mode` reads: a piece of text a
/// given value a write may change (a number, an expression as written,
/// or a string, as `mode` reads it), a reference its alias, made a math
/// cell in math mode and its text in text mode when it is not already
/// one.
fn operand_ports(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    entries: Vec<ListEntry>,
    kinds: &[ValueKind],
    mode: Mode,
) -> Result<Vec<Port>> {
    let mut ports = Vec::with_capacity(entries.len());
    for (e, &kind) in entries.into_iter().zip(kinds) {
        let port = match e {
            ListEntry::Text(k, text) => {
                let id = GivenId::Children(k);
                let wire = match mode {
                    Mode::Text => Wire::given_text(id, ctx.intern(text.trim())),
                    Mode::Math => {
                        Wire::given_math(id, crate::sym::Engine::new().parse_tree(text.trim()).ok())
                    }
                    Mode::Number => match text.parse::<f64>() {
                        Ok(v) if !text.contains(['e', 'E', 'x', 'X', 'b', 'B', 'n', 'N']) => {
                            Wire::given(id, v)
                        }
                        // Math that is a number (`1/2`, `pi`), or none.
                        _ => match ctx.entry_math(&ListEntry::Text(k, text.clone())) {
                            Some(expr) => Source::math(expr).into(),
                            None => Wire::given(id, NO_VALUE),
                        },
                    },
                };
                wiring.hidden_wire(wire)
            }
            ListEntry::Math(id) => {
                let m = wiring.hidden(Source::sym_expr(id, Post::None));
                if mode == Mode::Text {
                    wiring.hidden(Source::computed(text_of(), vec![m]))
                } else {
                    m
                }
            }
            ListEntry::Ref(_) => match (mode, kind) {
                (Mode::Math, _) => {
                    let id = ctx.entry_math(&e).expect("a reference is math");
                    wiring.hidden(Source::sym_expr(id, Post::None))
                }
                (Mode::Text, ValueKind::Math) => {
                    let id = ctx.entry_math(&e).expect("a reference is math");
                    let m = wiring.hidden(Source::sym_expr(id, Post::None));
                    wiring.hidden(Source::computed(text_of(), vec![m]))
                }
                (Mode::Text, ValueKind::Number) => {
                    let p = operands(ctx, wiring, vec![e], super::PieceKind::Number, false)?[0];
                    wiring.hidden(Source::computed(text_of(), vec![p]))
                }
                _ => operands(ctx, wiring, vec![e], super::PieceKind::Number, false)?[0],
            },
        };
        ports.push(port);
    }
    Ok(ports)
}

/// A value's text, made in the tick (ADR 0053): a join of one.
fn text_of() -> OpSpec {
    OpSpec::Sym(SymKind::Join {
        n: 1,
        kinds: 0,
        booleans: false,
    })
}

/// The order port: a hidden port per position, holding the 1-based
/// operand that comes there. A sort compares the operands; a shuffle
/// shuffles the positions by a draw, a scope constant.
fn order_ports(wiring: &mut ElemWiring, ty: ComponentType, ops: &[Port]) -> Vec<Port> {
    let n = ops.len();
    let spec = if ty == ComponentType::Shuffle {
        let draw = wiring.hidden(Source::Leaf(Leaf::Scope(ScopeConst::Draw)));
        let mut args = vec![draw];
        args.extend((1..=n).map(|k| wiring.hidden(Source::constant(k as f64))));
        let head = wiring.hidden(Source::computed(
            OpSpec::Vec(VecOp::Shuffle { n: byte(n) }),
            args,
        ));
        return outputs(wiring, head, n);
    } else {
        OpSpec::Sym(SymKind::Order {
            n: byte(n),
            kinds: 0,
        })
    };
    let head = wiring.hidden(Source::computed(spec, ops.to_vec()));
    outputs(wiring, head, n)
}

/// The `n` consecutive hidden ports of a multi-output instruction headed
/// at `head`.
fn outputs(wiring: &mut ElemWiring, head: Port, n: usize) -> Vec<Port> {
    let mut ports = vec![head];
    for k in 1..n {
        ports.push(wiring.hidden(Source::Flow(Flow::VecOut(head, byte(k)))));
    }
    ports
}

/// The number a piece of bare text is to the engine, when it is a real
/// one (`2`, `1/2`, `pi`, `nCr(4,2)`): what makes a list of pieces
/// numbers, as the current core's `tokenIsRealNumber` decides.
fn real_number(text: &str) -> Option<f64> {
    let mut engine = crate::sym::Engine::new();
    let h = engine.parse(text.trim()).ok()?;
    let v = engine.evaluate(h, None);
    (!v.is_nan()).then_some(v)
}

#[cfg(test)]
#[path = "sort.spec.rs"]
mod spec;
