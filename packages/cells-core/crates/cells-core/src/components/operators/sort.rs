//! `<sort>` and `<shuffle>`: a permutation of their operands (ADR 0041,
//! decision 7), their children read as a list. An order port, a hidden
//! port per position holding the operand that comes there (1-based), is
//! computed by comparing the operands (`SymKind::Order`, as the current
//! core's `compareExtractedValues` does) or drawn at load from the seed (a
//! `Shuffle` of the positions, a constant, ADR 0037); each entry is a
//! `Choose` over the operands by its position's order, so a write through
//! a shuffled entry lands on the operand it shows.
//!
//! The operands hold one kind of value, which the compile decides from the
//! records (ADR 0053): points, when one is a point or a vector (every
//! operand then one, its displacement for a vector); else booleans, when
//! every one is; else texts, when one is text or a boolean (each other
//! operand then its text, made in the tick, compared as text); else
//! expressions, when one can be math (each operand then a math cell,
//! compared by value when every one evaluates to a number, else by its
//! text); else numbers. Bare text is split at spaces and read as numbers
//! when every piece is a real number to the engine, else as text, unless
//! `type` says (`number`, `math`, `text`, `boolean`).
//!
//! A sort or shuffle of points or booleans decides its entries' kind
//! itself (ADR 0053, `ListShape`): an entry of a point is two cells, so
//! its rows are points, drawn and, a shuffle's, dragged. Points compare by
//! one coordinate (`sortByComponent`, the tail's for a vector with
//! `sortVectorsBy="tail"`); any operand by a prop it has
//! (`sortByProp`, its spelling in any case), the missing value last.

use super::operands;
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, EntryKind};
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{OpSpec, Post, SymKind, VecOp};

component! {
    /// `<sort>5 3 1 $a</sort>`: its operands in increasing order
    /// (`values`, `value1`, ...), numbers by value, texts alphabetically,
    /// expressions by value when each is a number, else by their text,
    /// points by a coordinate (`sortByComponent`, `sortVectorsBy`), or
    /// anything by a prop (`sortByProp`). A write to a sorted entry is
    /// dropped (it would move the entry); `asList="false"` shows the
    /// entries with no separator.
    tags: ["sort"],
    variant: Order::Increasing,
    flags: [copyable],
    default_prop: values,
    props {
        numComponents: list_len { rendered },
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
    // Whether a renderer shows the entries separated by commas, and
    // whether it hides them.
    presentation { asList, hide }
    attributes {
        r#type: Text,
        asList: LiteralFlag,
        sortByComponent: Literal(1.0),
        sortVectorsBy: Text,
        sortByProp: Text,
    }
    children: List,
    planner: Plan(plan),
}

/// `<shuffle>`: its operands in an order drawn at load from the document
/// seed (a seeded permutation, ADR 0041 decision 7), which no student
/// can change; the values themselves follow their operands, and a write
/// to an entry lands on the operand it shows.
pub(crate) const SHUFFLE: ComponentDef = DEFINITION.variant(&["shuffle"], &Order::Drawn);

/// The order a type of this table puts its operands in.
#[derive(Clone, Copy, PartialEq)]
pub(crate) enum Order {
    /// Increasing: a `<sort>`'s.
    Increasing,
    /// Drawn at load: a `<shuffle>`'s.
    Drawn,
}

/// The diagnostic for a `type` that names no reading of bare text.
pub(crate) const INVALID_TYPE: &str = "cells-invalid-type";

/// What the operands are read as, decided once per element.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Mode {
    Number,
    Math,
    Text,
    Boolean,
    Point,
}

/// How bare text among the children is read.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Pieces {
    Number,
    Math,
    Text,
    Boolean,
}

/// What an operand is, as far as the records tell, and the reference it
/// is read through when that is not its own (a vector's displacement).
struct Operand {
    entry: ListEntry,
    kind: ValueKind,
}

/// The order port and an entry per position over the operands: see the
/// module documentation.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let as_list = !matches!(attrs.asList, Some(Some(false)));
    let by_component = attrs.sortByComponent?;
    let by_tail = attrs
        .sortVectorsBy
        .as_deref()
        .is_some_and(|s| s.trim().eq_ignore_ascii_case("tail"));
    let by_prop = attrs
        .sortByProp
        .as_deref()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty());
    let entries = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let n = entries.len();
    let pieces = pieces_of(ctx, attrs.r#type.as_deref(), &entries);
    let ops = operands_of(ctx, entries, pieces)?;
    let has = |k: ValueKind| ops.iter().any(|o| o.kind == k);
    let mode = if has(ValueKind::Point) {
        if !ops.iter().all(|o| o.kind == ValueKind::Point) {
            return Err(Error::Unsupported(format!(
                "points or vectors among other values in a <{}>: its entries are one kind",
                ty.tag()
            )));
        }
        Mode::Point
    } else if n > 0 && ops.iter().all(|o| o.kind == ValueKind::Boolean) {
        Mode::Boolean
    } else if has(ValueKind::Text) || has(ValueKind::Boolean) {
        Mode::Text
    } else if has(ValueKind::Math) {
        Mode::Math
    } else {
        Mode::Number
    };
    let mut wiring = match mode {
        Mode::Point => ElemWiring::with_entries(ty, n, EntryKind::Point),
        Mode::Boolean => ElemWiring::with_entries(ty, n, EntryKind::Boolean),
        _ => ElemWiring::with_list(ty, n),
    };
    if n > 0 {
        if n > crate::limits::MAX_VEC_IN - 1 {
            return Err(Error::Unsupported(format!(
                "<{}> of more than {} operands",
                ty.tag(),
                crate::limits::MAX_VEC_IN - 1
            )));
        }
        // What the order compares: each operand's prop by `sortByProp`, a
        // point's coordinate, else the operand itself.
        let (cells, keys) = match mode {
            Mode::Point => {
                let mut cells = Vec::with_capacity(n);
                let mut keys = Vec::with_capacity(n);
                for o in &ops {
                    let ListEntry::Ref(p) = o.entry else {
                        unreachable!("a point operand is a reference")
                    };
                    let xy = [0, 1].map(|j| wiring.hidden(Source::coord(p, j)));
                    let key = match by_prop {
                        Some(_) => None,
                        None => point_key(ctx, &mut wiring, p, &xy, by_component, by_tail),
                    };
                    keys.push(key);
                    cells.push(xy.to_vec());
                }
                (cells, keys)
            }
            _ => {
                let ports = operand_ports(ctx, &mut wiring, &ops, mode)?;
                let keys = ports.iter().map(|&p| Some(p)).collect();
                (ports.into_iter().map(|p| vec![p]).collect(), keys)
            }
        };
        let keys: Vec<Port> = match &by_prop {
            Some(name) => ops
                .iter()
                .map(|o| prop_key(ctx, &mut wiring, &o.entry, name))
                .collect(),
            None => keys
                .into_iter()
                .map(|k| k.unwrap_or_else(|| wiring.hidden(Source::constant(NO_VALUE))))
                .collect(),
        };
        let drawn = *ty.variant::<Order>() == Order::Drawn;
        let order = order_ports(&mut wiring, drawn, &keys);
        // A sort's entry is chosen by an order the operand it shows
        // decides, so a write through it would move it: each branch is
        // shown, and a request on an entry dropped. A shuffle's order is
        // drawn, and a write lands on the operand.
        let width = cells[0].len();
        let mut chosen = Vec::with_capacity(n * width);
        for &o in &order {
            for j in 0..width {
                let mut args = vec![o];
                for c in &cells {
                    args.push(if drawn {
                        c[j]
                    } else {
                        wiring.hidden(Source::computed(OpSpec::Shown, vec![c[j]]))
                    });
                }
                chosen
                    .push(Source::computed(OpSpec::Vec(VecOp::Choose { n: byte(n) }), args).into());
            }
        }
        match mode {
            Mode::Point => wiring.set_entry_cells(chosen),
            _ => wiring.set_entries(chosen),
        }
        // The order, public as the list's companion sequence (ADR 0053):
        // a shuffle's `componentOrder`, and a sort's.
        wiring.set_companion(order.iter().map(|&o| Wire::own(o)).collect());
    }
    wiring.set_planned(Planned {
        asList: Wire::constant(if as_list { 1.0 } else { 0.0 }),
    });
    Ok(wiring)
}

/// What bare text among `entries` is read as: `type`, else what every
/// piece looks like. An invalid `type` is warned of and dropped.
fn pieces_of(ctx: &mut PlanCtx<'_, '_>, ty: Option<&str>, entries: &[ListEntry]) -> Pieces {
    match ty.map(|t| t.trim().to_ascii_lowercase()) {
        Some(t) if t == "number" => Pieces::Number,
        Some(t) if t == "math" => Pieces::Math,
        Some(t) if t == "text" => Pieces::Text,
        Some(t) if t == "boolean" => Pieces::Boolean,
        other => {
            if let Some(t) = other {
                let tag = ctx.component_type().tag();
                ctx.warn(
                    INVALID_TYPE,
                    &format!(
                        "Invalid type {t} for {tag} component: reading the values as though no type had been given"
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
    }
}

/// Each entry with what it is, as far as the records tell: a piece of
/// text as `pieces` reads it; a reference as its referent's type says, a
/// vector its displacement (a point), one they do not tell a number, as
/// it was.
fn operands_of(
    ctx: &mut PlanCtx<'_, '_>,
    entries: Vec<ListEntry>,
    pieces: Pieces,
) -> Result<Vec<Operand>> {
    let tag = ctx.component_type().tag();
    let mut ops = Vec::with_capacity(entries.len());
    for e in entries {
        let kind = match &e {
            ListEntry::Text(..) => match pieces {
                Pieces::Number => ValueKind::Number,
                Pieces::Math => ValueKind::Math,
                Pieces::Text => ValueKind::Text,
                Pieces::Boolean => ValueKind::Boolean,
            },
            ListEntry::Ref(p) => match ctx.entry_kind(&e) {
                // A vector, which has no value of its own to a reference:
                // its displacement, as the current core compares it.
                None => match ctx.ref_prop(*p, "displacement") {
                    Some(q) => {
                        ops.push(Operand {
                            entry: ListEntry::Ref(q),
                            kind: ValueKind::Point,
                        });
                        continue;
                    }
                    None => ValueKind::Number,
                },
                Some(ValueKind::List) => {
                    return Err(Error::Unsupported(format!(
                        "a whole list as one operand of a <{tag}>: its entries are not spliced"
                    )));
                }
                Some(k) => k,
            },
            ListEntry::Math(_) => ValueKind::Math,
        };
        ops.push(Operand { entry: e, kind });
    }
    Ok(ops)
}

/// The cell a point operand `p` (coordinates `xy`) is compared by: its
/// coordinate `component` (1-based), or its tail's when `tail` and it has
/// one; None when it has no such coordinate, which compares as the
/// missing value.
fn point_key(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    p: RefId,
    xy: &[Port; 2],
    component: f64,
    tail: bool,
) -> Option<Port> {
    let j = match component {
        1.0 => 0,
        2.0 => 1,
        _ => return None,
    };
    // The reference names the vector's displacement; its tail is the
    // vector's `tail`.
    let tail_of = tail
        .then(|| ctx.ref_of_elem(p))
        .flatten()
        .and_then(|v| ctx.ref_prop(v, "tail"));
    Some(match tail_of {
        Some(t) => wiring.hidden(Source::coord(t, j)),
        None => xy[j],
    })
}

/// The cell operand `e` is compared by under `sortByProp="name"`: its
/// prop of that name when it names an element that has one cell so
/// called, else the missing value.
fn prop_key(ctx: &mut PlanCtx<'_, '_>, wiring: &mut ElemWiring, e: &ListEntry, name: &str) -> Port {
    let q = match e {
        ListEntry::Ref(p) => ctx.ref_of_elem(*p).and_then(|v| ctx.ref_prop(v, name)),
        _ => None,
    };
    match q {
        Some(q) if ctx.ref_cells(q) == Some(1) => wiring.hidden(Source::reference(q)),
        _ => wiring.hidden(Source::constant(NO_VALUE)),
    }
}

/// A port per operand, holding the kind `mode` reads: a piece of text a
/// given value a write may change (a number, an expression as written,
/// a boolean or a string, as `mode` reads it), a reference its alias,
/// made a math cell in math mode and its text in text mode when it is not
/// already one.
fn operand_ports(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    ops: &[Operand],
    mode: Mode,
) -> Result<Vec<Port>> {
    let mut ports = Vec::with_capacity(ops.len());
    for o in ops {
        let (e, kind) = (o.entry.clone(), o.kind);
        let port = match e {
            ListEntry::Text(k, text) => {
                let id = GivenId::Children(k);
                let wire = match mode {
                    Mode::Text => Wire::given_text(id, ctx.intern(text.trim())),
                    Mode::Math => {
                        Wire::given_math(id, crate::sym::Engine::new().parse_tree(text.trim()).ok())
                    }
                    Mode::Boolean => {
                        let v = text.trim().eq_ignore_ascii_case("true");
                        Wire::given(id, if v { 1.0 } else { 0.0 })
                    }
                    Mode::Number | Mode::Point => match text.parse::<f64>() {
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
                    wiring.hidden(Source::computed(text_of(false), vec![m]))
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
                    wiring.hidden(Source::computed(text_of(false), vec![m]))
                }
                (Mode::Text, ValueKind::Number | ValueKind::Boolean) => {
                    let p = operands(ctx, wiring, vec![e], super::PieceKind::Number, false)?[0];
                    let booleans = kind == ValueKind::Boolean;
                    wiring.hidden(Source::computed(text_of(booleans), vec![p]))
                }
                (Mode::Boolean, _) => {
                    operands(ctx, wiring, vec![e], super::PieceKind::Boolean, false)?[0]
                }
                _ => operands(ctx, wiring, vec![e], super::PieceKind::Number, false)?[0],
            },
        };
        ports.push(port);
    }
    Ok(ports)
}

/// A value's text, made in the tick (ADR 0053): a join of one, `true` or
/// `false` for a boolean.
fn text_of(booleans: bool) -> OpSpec {
    OpSpec::Sym(SymKind::Join {
        n: 1,
        kinds: 0,
        booleans,
    })
}

/// The order port: a hidden port per position, holding the 1-based
/// operand that comes there. A sort compares the operands' keys; a
/// shuffle shuffles the positions by a draw, a scope constant.
fn order_ports(wiring: &mut ElemWiring, drawn: bool, keys: &[Port]) -> Vec<Port> {
    let n = keys.len();
    let spec = if drawn {
        // What decides the order drawn: how many operands there are,
        // which the children give, and how bare text splits into them.
        let draw = wiring.draw(DrawOn {
            attrs: &[attr::r#type],
            children: true,
        });
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
    let head = wiring.hidden(Source::computed(spec, keys.to_vec()));
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
