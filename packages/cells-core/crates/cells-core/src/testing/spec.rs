//! Component specs (ADR 0016): what an author sees, written as DoenetML, a
//! script of requests and what must hold after each, in public prop names.
//! A spec says nothing about slots, shared state or operators, so a refactor of
//! those is checked against it.
//!
//! ```ignore
//! spec! {
//!     slider;
//!
//!     case "a request snaps to the step" {
//!         doenet r#"<slider name="s" from="0" to="10" step="1"/>"#;
//!         request { "s.value" = 3.7 }
//!         expect { "s.value" = 4 }
//!     }
//! }
//! ```
//!
//! `spec!` makes one `#[test]` named for the component, running every case
//! and reporting every failure. A case is its source, then any of:
//!
//! - `expect { "name.prop" = value, .. }`: values now, a number or a
//!   tuple for a prop of several cells (`"p.coords" = (1, 2)`), or an
//!   array for a list's cells (`"t.vertices" = [1, 2, 3, 5]`).
//! - `request { "name.prop" = value, .. }`: one tick. Numbers are scalar
//!   requests; tuples are points dragged together (ADR 0006).
//! - `dropped(n)`: the last tick dropped `n` requests. A tick not followed
//!   by `dropped` must drop none.
//! - `diagnostics["code", ..]`: every diagnostic's code, in order. A case
//!   without it must load without any, so a warning cannot appear unseen.
//!   The accessibility lint's are left out: they are about the document a
//!   case is written in, not the component.
//!
//! Every case is also checked by what its author does not write: after
//! the load and after every tick, the scheduled program against the
//! reference evaluator (`testing::reference`); a pruned load of the case
//! (ADR 0019), ticked beside the one the case reads, which computes every
//! prop, against it on every live cell; and the pruned load's cost (cells,
//! instructions, components) against the component's snapshot,
//! `tests/specs/snapshots/<component>.cost`, reviewed with the change that
//! changes it; and the round trip of every interactive cell of the case's
//! document after the load (`testing::round_trip`, ADR 0026), where no
//! request may come out unstable.
//! `SPEC_UPDATE=1` rewrites a snapshot instead of comparing it.

use crate::testing::reference;
use crate::testing::test_utils::{load, load_unpruned};
use crate::{Document, PointRequest, Request};
use std::fmt::Write as _;
use std::path::Path;

/// A value a spec expects or requests: one number, or one per cell of a
/// prop of several cells.
#[derive(Debug, Clone)]
pub enum Value {
    Num(f64),
    Tuple(Vec<f64>),
}

impl From<f64> for Value {
    fn from(v: f64) -> Self {
        Value::Num(v)
    }
}

impl From<i32> for Value {
    fn from(v: i32) -> Self {
        Value::Num(v.into())
    }
}

impl<A: Into<f64>, B: Into<f64>> From<(A, B)> for Value {
    fn from((a, b): (A, B)) -> Self {
        Value::Tuple(vec![a.into(), b.into()])
    }
}

impl<A: Into<f64>, B: Into<f64>, C: Into<f64>> From<(A, B, C)> for Value {
    fn from((a, b, c): (A, B, C)) -> Self {
        Value::Tuple(vec![a.into(), b.into(), c.into()])
    }
}

/// A list's cells, flattened: `[x1, y1, x2, y2, ...]`.
impl<A: Into<f64>, const N: usize> From<[A; N]> for Value {
    fn from(v: [A; N]) -> Self {
        Value::Tuple(v.into_iter().map(Into::into).collect())
    }
}

/// One step of a case, in order.
#[derive(Debug, Clone)]
pub enum Op {
    Expect(Vec<(&'static str, Value)>),
    Request(Vec<(&'static str, Value)>),
    Dropped(usize),
    Diagnostics(Vec<&'static str>),
}

#[derive(Debug, Clone)]
pub struct Case {
    pub name: &'static str,
    pub source: &'static str,
    pub ops: Vec<Op>,
}

/// One of `spec!`'s steps; `spec!` calls it for each.
#[macro_export]
macro_rules! spec_op {
    (expect { $($path:literal = $v:expr),* $(,)? }) => {
        $crate::testing::spec::Op::Expect(vec![
            $(($path, $crate::testing::spec::Value::from($v))),*
        ])
    };
    (request { $($path:literal = $v:expr),* $(,)? }) => {
        $crate::testing::spec::Op::Request(vec![
            $(($path, $crate::testing::spec::Value::from($v))),*
        ])
    };
    (dropped ($n:expr)) => {
        $crate::testing::spec::Op::Dropped($n)
    };
    (diagnostics [ $($code:literal),* $(,)? ]) => {
        $crate::testing::spec::Op::Diagnostics(vec![$($code),*])
    };
}

/// A component's spec: see the module documentation.
#[macro_export]
macro_rules! spec {
    (
        $component:ident;
        $(
            case $name:literal {
                doenet $source:literal;
                $($kw:ident $body:tt)*
            }
        )*
    ) => {
        #[test]
        fn $component() {
            $crate::testing::spec::run(
                stringify!($component),
                &[$(
                    $crate::testing::spec::Case {
                        name: $name,
                        source: $source,
                        ops: vec![$($crate::spec_op!($kw $body)),*],
                    }
                ),*],
            );
        }
    };
}

/// Run every case of `component`'s spec, then compare its cost snapshot;
/// panics with every failure.
pub fn run(component: &str, cases: &[Case]) {
    let mut failures = Vec::new();
    let mut costs = String::new();
    for case in cases {
        match run_case(case) {
            Ok(cost) => writeln!(costs, "{}: {cost}", case.name).unwrap(),
            Err(e) => {
                failures.push(format!("{component} / {}: {e}", case.name));
                writeln!(costs, "{}: (failed)", case.name).unwrap();
            }
        }
    }
    if failures.is_empty()
        && let Err(e) = check_snapshot(component, &costs)
    {
        failures.push(e);
    }
    assert!(
        failures.is_empty(),
        "{component}: {} failures in {} cases:\n\n{}",
        failures.len(),
        cases.len(),
        failures.join("\n\n")
    );
}

/// Every interactive cell of `doc` round-trips: no request on it, asked at
/// the sweep's values, comes out unstable.
fn round_trip(doc: &Document) -> Result<(), String> {
    let unstable: Vec<String> = crate::testing::round_trip::sweep(doc)
        .into_iter()
        .filter(|o| o.class == crate::testing::round_trip::Class::Unstable)
        .map(|o| format!("{} asked {:?} got {:?}", o.row, o.asked, o.got))
        .collect();
    if unstable.is_empty() {
        Ok(())
    } else {
        Err(format!(
            "requests that do not round-trip (ADR 0026): {}",
            unstable.join("; ")
        ))
    }
}

fn run_case(case: &Case) -> Result<String, String> {
    // A spec reads any prop, as an author's reference may (ADR 0019): it
    // reads a document with every prop computed, and ticks a pruned one
    // beside it, which must agree on every live cell. The cost is the
    // pruned one's, what a student's browser holds.
    let mut doc = load_unpruned(case.source).map_err(|e| format!("does not load: {e}"))?;
    let mut pruned = load(case.source).map_err(|e| format!("does not load pruned: {e}"))?;
    let cost = format!(
        "cells {} · essential {} · fixed {} · instrs {} · components {}",
        pruned.cells.len(),
        pruned.n_essential,
        pruned.n_fixed,
        pruned.program.len(),
        pruned.n_components()
    );
    if !case.ops.iter().any(|op| matches!(op, Op::Diagnostics(_))) {
        let found: Vec<_> = diagnostics(&doc)
            .map(|d| format!("{}: {}", d.code, d.message))
            .collect();
        if !found.is_empty() {
            return Err(format!(
                "loads with diagnostics (say `diagnostics[..]` if meant): {found:?}"
            ));
        }
    }
    check_reference(&doc, "after the load")?;
    check_reference(&pruned, "after the load, pruned")?;
    agree(&doc, &pruned, "after the load")?;
    round_trip(&doc)?;
    for (i, op) in case.ops.iter().enumerate() {
        let at = format!("step {}", i + 1);
        match op {
            Op::Expect(values) => {
                for (path, want) in values {
                    let got = read(&doc, path).map_err(|e| format!("{at}: {e}"))?;
                    if !matches(&got, want) {
                        return Err(format!("{at}: {path} is {got:?}, expected {want:?}"));
                    }
                }
            }
            Op::Request(values) => {
                let tick = request(&mut doc, values).map_err(|e| format!("{at}: {e}"))?;
                if let Some(e) = &tick.rebuild_error {
                    return Err(format!("{at}: the rebuild failed: {e}"));
                }
                let pruned_tick =
                    request(&mut pruned, values).map_err(|e| format!("{at}, pruned: {e}"))?;
                if let Some(e) = &pruned_tick.rebuild_error {
                    return Err(format!("{at}: the pruned rebuild failed: {e}"));
                }
                if pruned_tick.dropped.len() != tick.dropped.len() {
                    return Err(format!(
                        "{at}: dropped {} requests pruned, {} unpruned",
                        pruned_tick.dropped.len(),
                        tick.dropped.len()
                    ));
                }
                check_reference(&pruned, &format!("{at}, pruned"))?;
                agree(&doc, &pruned, &at)?;
                // The next step may say how many requests the tick drops;
                // otherwise it must drop none.
                if let Some(Op::Dropped(n)) = case.ops.get(i + 1) {
                    if tick.dropped.len() != *n {
                        return Err(format!(
                            "{at}: dropped {} requests, expected {n}",
                            tick.dropped.len()
                        ));
                    }
                } else if !tick.dropped.is_empty() {
                    return Err(format!(
                        "{at}: dropped {} requests (say `dropped(n)` if meant)",
                        tick.dropped.len()
                    ));
                }
                check_reference(&doc, &at)?;
            }
            Op::Dropped(_) => {
                if !matches!(i.checked_sub(1).map(|j| &case.ops[j]), Some(Op::Request(_))) {
                    return Err(format!("{at}: `dropped` must follow a `request`"));
                }
            }
            Op::Diagnostics(want) => {
                let got: Vec<&str> = diagnostics(&doc).map(|d| d.code).collect();
                if got != *want {
                    return Err(format!("{at}: diagnostics {got:?}, expected {want:?}"));
                }
            }
        }
    }
    Ok(cost)
}

/// The diagnostics a spec speaks about: all but the accessibility lint's,
/// which are about the document a case is written in (an unlabeled input,
/// a graph without a description), not the component, and have their own
/// tests.
fn diagnostics(doc: &Document) -> impl Iterator<Item = &crate::Diagnostic> {
    doc.diagnostics()
        .iter()
        .filter(|d| d.kind != crate::DiagnosticKind::Accessibility)
}

fn agree(full: &Document, pruned: &Document, at: &str) -> Result<(), String> {
    crate::testing::live_cells_agree(full, pruned)
        .map_err(|e| format!("{at}: pruning changed a live cell: {e}"))
}

fn check_reference(doc: &Document, at: &str) -> Result<(), String> {
    match reference::check(doc) {
        None => Ok(()),
        Some(e) => Err(format!(
            "{at}: the schedule disagrees with the reference: {e:?}"
        )),
    }
}

/// The cells behind `name.prop`; the last dot splits the path, so a name
/// may itself be a path (`t.vertex1` is not one, `g.p.x` names `g.p`).
pub(crate) fn cells(doc: &Document, path: &str) -> Result<Vec<crate::CellIdx>, String> {
    let (name, prop) = path
        .rsplit_once('.')
        .ok_or_else(|| format!("{path}: not name.prop"))?;
    let comp = doc
        .resolve_path(name)
        .ok_or_else(|| format!("{path}: no component {name}"))?;
    doc.prop_cells(comp, prop)
        .ok_or_else(|| format!("{path}: {name} has no prop {prop}"))
}

fn read(doc: &Document, path: &str) -> Result<Value, String> {
    let cs = cells(doc, path)?;
    let vs: Vec<f64> = cs.iter().map(|&c| doc.cells[c.index()]).collect();
    Ok(match vs.as_slice() {
        [v] => Value::Num(*v),
        _ => Value::Tuple(vs),
    })
}

fn close(a: f64, b: f64) -> bool {
    (a.is_nan() && b.is_nan()) || a == b || (a - b).abs() <= 1e-9 * b.abs().max(1.0)
}

fn matches(got: &Value, want: &Value) -> bool {
    match (got, want) {
        (Value::Num(a), Value::Num(b)) => close(*a, *b),
        (Value::Tuple(a), Value::Tuple(b)) => {
            a.len() == b.len() && a.iter().zip(b).all(|(x, y)| close(*x, *y))
        }
        _ => false,
    }
}

fn request(
    doc: &mut Document,
    values: &[(&'static str, Value)],
) -> Result<crate::TickOutcome, String> {
    let mut scalars = Vec::new();
    let mut points = Vec::new();
    for (path, value) in values {
        let cs = cells(doc, path)?;
        match (value, cs.as_slice()) {
            (Value::Num(v), [c]) => scalars.push(Request {
                cell: *c,
                value: *v,
            }),
            (Value::Tuple(v), [x, y]) if v.len() == 2 => points.push(PointRequest {
                cells: [*x, *y],
                values: [v[0], v[1]],
            }),
            _ => {
                return Err(format!(
                    "{path}: {} cells, cannot request {value:?}",
                    cs.len()
                ));
            }
        }
    }
    let groups: Vec<Vec<PointRequest>> = if points.is_empty() {
        vec![]
    } else {
        vec![points]
    };
    Ok(doc.request_with_groups(&scalars, &groups))
}

fn check_snapshot(component: &str, costs: &str) -> Result<(), String> {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/specs/snapshots")
        .join(format!("{component}.cost"));
    if std::env::var_os("SPEC_UPDATE").is_some() {
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        std::fs::write(&path, costs).unwrap();
        return Ok(());
    }
    let Ok(old) = std::fs::read_to_string(&path) else {
        return Err(format!(
            "{component} has no cost snapshot ({}): run with SPEC_UPDATE=1 to write one, \
             and commit it with the change.",
            path.display()
        ));
    };
    if old == costs {
        return Ok(());
    }
    let mut diff = String::new();
    let (old_lines, new_lines): (Vec<_>, Vec<_>) = (old.lines().collect(), costs.lines().collect());
    for l in &old_lines {
        if !new_lines.contains(l) {
            writeln!(diff, "  - {l}").unwrap();
        }
    }
    for l in &new_lines {
        if !old_lines.contains(l) {
            writeln!(diff, "  + {l}").unwrap();
        }
    }
    Err(format!(
        "{component}: the cost snapshot changed ({}):\n{diff}\
         If the change is intended, rerun with SPEC_UPDATE=1 and commit the new snapshot with the change.",
        path.display()
    ))
}
