//! Helpers shared by the integration tests. The geometry tests'
//! scenarios mirror the current core's vitest suites, which the adapter
//! runs verbatim; these are the core-level checks.
#![allow(dead_code)]

use cells_core::testing::reference;
use cells_core::{Document, PointRequest, Request, TickOutcome};

pub fn req(doc: &Document, name: &str, prop: &str, value: f64) -> Request {
    Request {
        cell: doc.cell(name, prop).unwrap(),
        value,
    }
}

pub fn v(doc: &Document, name: &str, prop: &str) -> f64 {
    doc.value(name, prop)
        .unwrap_or_else(|| panic!("no {name}.{prop}"))
}

/// Request `value` on `name.prop`.
pub fn set(doc: &mut Document, name: &str, prop: &str, value: f64) -> TickOutcome {
    let cell = doc
        .cell(name, prop)
        .unwrap_or_else(|| panic!("no {name}.{prop}"));
    doc.request(&[Request { cell, value }])
}

/// Type math text into a mathInput: a request on its `expr` cell.
pub fn type_into(doc: &mut Document, name: &str, s: &str) -> TickOutcome {
    let h = doc.parse_math(s).unwrap();
    doc.request(&[req(doc, name, "expr", h)])
}

pub fn close(a: f64, b: f64) -> bool {
    (a - b).abs() < 1e-9 || (a.is_nan() && b.is_nan())
}

#[macro_export]
macro_rules! assert_close {
    ($a:expr, $b:expr) => {
        let (a, b) = ($a, $b);
        assert!(close(a, b), "expected {b}, got {a}");
    };
}

/// A whole-shape drag: the shape's points requested together (ADR 0006).
pub fn move_points(doc: &mut Document, name: &str, props: &[(&str, &str)], at: &[(f64, f64)]) {
    let pts: Vec<PointRequest> = props
        .iter()
        .zip(at)
        .map(|(&(px, py), &(x, y))| PointRequest {
            cells: [doc.cell(name, px).unwrap(), doc.cell(name, py).unwrap()],
            values: [x, y],
        })
        .collect();
    let t = doc.request_points(&pts);
    assert!(t.dropped.is_empty(), "dropped {:?}", t.dropped);
    assert_eq!(reference::check(doc), None);
}

pub fn move_point(doc: &mut Document, name: &str, x: f64, y: f64) {
    let t = doc.request(&[req(doc, name, "x", x), req(doc, name, "y", y)]);
    assert!(t.dropped.is_empty(), "dropped {:?}", t.dropped);
    assert_eq!(reference::check(doc), None);
}
