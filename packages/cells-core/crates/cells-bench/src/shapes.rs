//! Synthetic documents for timing the tick (`examples/tick_cost.rs`), built
//! in Rust with `testing::dast`, so neither the parser nor node is needed.
//! Each shape is driven by dragging one coordinate of a point between two
//! values, and knows what it computes: after a drag to `check.0`, the props
//! in `check.1` must hold their values, or the shape was not built as
//! meant. `docs/tick-design-decisions.md` says which decision each serves.

use std::sync::Arc;

use cells_core::testing::dast::{Element, Node, build, el, mac, text};
use cells_core::{CellIdx, Document, LoadOptions, LoadTimings};

pub struct Shape {
    pub elements: Vec<Element>,
    /// The coordinate dragged, as `component.prop`.
    pub drag: &'static str,
    /// A drag to `check.0` gives each prop at `check.1` its value.
    pub check: (f64, Vec<(String, f64)>),
}

/// Every shape `shape` knows, in the order `tick_cost` runs them by
/// default. `chainK` takes any K from 1 to 100.
pub const SHAPES: &[&str] = &[
    "depth", "breadth", "isolated", "mixed", "cutoff", "refs", "coords", "poly",
];

fn point(name: &str, x: &str) -> Element {
    el("point").name(name).attr("x", x).attr("y", "0")
}

/// `<number name>$of + plus</number>`.
fn number(name: &str, of: &str, plus: usize) -> Element {
    el("number")
        .name(name)
        .child(mac(of))
        .text(&format!(" + {plus}"))
}

fn graph(points: impl IntoIterator<Item = Element>) -> Element {
    points
        .into_iter()
        .fold(el("graph").name("g"), |g, p| g.child(p))
}

/// The shape `name` at size `n`, or None for a name it does not know.
pub fn shape(name: &str, n: usize) -> Option<Shape> {
    let n = n.max(2);
    let s = match name {
        // As `packages/benchmark/src/generate.mjs`: a chain of n numbers
        // from the dragged point. Everything is downstream of the drag.
        "depth" => {
            let mut v = vec![graph([point("p", "1")]), number("c0", "p.x", 1)];
            for i in 1..n {
                v.push(number(&format!("c{i}"), &format!("c{}", i - 1), 1));
            }
            Shape {
                elements: v,
                drag: "p.x",
                check: (
                    5.0,
                    vec![
                        ("c0.value".into(), 6.0),
                        (format!("c{}.value", n - 1), 5.0 + n as f64),
                    ],
                ),
            }
        }
        // As `generate.mjs`: n numbers each read the dragged point.
        "breadth" => {
            let mut v = vec![graph([point("p", "1")])];
            for i in 0..n {
                v.push(number(&format!("o{i}"), "p.x", i));
            }
            Shape {
                elements: v,
                drag: "p.x",
                check: (
                    5.0,
                    vec![
                        ("o0.value".into(), 5.0),
                        (format!("o{}.value", n - 1), 4.0 + n as f64),
                    ],
                ),
            }
        }
        // One number reads the dragged point; n read another.
        "isolated" => {
            let mut v = vec![
                graph([point("p", "1"), point("q", "1")]),
                number("a", "p.x", 1),
            ];
            for i in 0..n {
                v.push(number(&format!("o{i}"), "q.x", i));
            }
            Shape {
                elements: v,
                drag: "p.x",
                check: (
                    5.0,
                    vec![
                        ("a.value".into(), 6.0),
                        (format!("o{}.value", n - 1), n as f64),
                    ],
                ),
            }
        }
        // A page of 20 graphs, each with a point that a chain of n / 40
        // numbers and a fan of n / 40 read. One point is dragged, so the
        // drag reaches 5% of the program: closer to a real page than depth
        // or breadth.
        "mixed" => {
            let per = (n / 40).max(1);
            let mut v = Vec::new();
            for j in 0..20 {
                v.push(
                    el("graph")
                        .name(&format!("g{j}"))
                        .child(point(&format!("p{j}"), "1")),
                );
                v.push(number(&format!("c{j}_0"), &format!("p{j}.x"), 1));
                for i in 1..per {
                    v.push(number(&format!("c{j}_{i}"), &format!("c{j}_{}", i - 1), 1));
                }
                for i in 0..per {
                    v.push(number(&format!("o{j}_{i}"), &format!("p{j}.x"), i));
                }
            }
            Shape {
                elements: v,
                drag: "p0.x",
                check: (
                    5.0,
                    vec![
                        (format!("c0_{}.value", per - 1), 5.0 + per as f64),
                        (format!("o0_{}.value", per - 1), 4.0 + per as f64),
                        (format!("c1_{}.value", per - 1), 1.0 + per as f64),
                    ],
                ),
            }
        }
        // `round($p.x / 10)` feeds a chain of n numbers. The timed drags
        // (x = 2 and 3) both round to 0, so the change stops at the round:
        // what early cutoff saves (decision 11).
        "cutoff" => {
            let mut v = vec![
                graph([point("p", "1")]),
                el("number")
                    .name("r")
                    .text("round(")
                    .child(mac("p.x"))
                    .text(" / 10)"),
                number("c0", "r", 1),
            ];
            for i in 1..n {
                v.push(number(&format!("c{i}"), &format!("c{}", i - 1), 1));
            }
            Shape {
                elements: v,
                drag: "p.x",
                check: (
                    40.0,
                    vec![
                        ("r.value".into(), 4.0),
                        (format!("c{}.value", n - 1), 4.0 + n as f64),
                    ],
                ),
            }
        }
        // n / 2 numbers that are a reference to the dragged point's x and
        // n / 2 copies of the point, each read by one number: n references,
        // which aliasing makes free (decision 8), and n readers.
        "refs" => {
            let half = n / 2;
            let mut points = vec![point("p", "1")];
            let mut v = Vec::new();
            for i in 0..half {
                v.push(el("number").name(&format!("r{i}")).child(mac("p.x")));
                v.push(number(&format!("a{i}"), &format!("r{i}"), i));
                points.push(el("point").name(&format!("k{i}")).attr("extend", mac("p")));
                v.push(number(&format!("b{i}"), &format!("k{i}.x"), i));
            }
            v.insert(0, graph(points));
            Shape {
                elements: v,
                drag: "p.x",
                check: (
                    5.0,
                    vec![
                        (format!("a{}.value", half - 1), 4.0 + half as f64),
                        (format!("k{}.x", half - 1), 5.0),
                        (format!("b{}.value", half - 1), 4.0 + half as f64),
                    ],
                ),
            }
        }
        // A chain of n points, each at (x + 1, y + 1) of the one before.
        // Only x is dragged, so the y chain does not change: what one cell
        // per scalar saves over a point as one value (decision 7).
        "coords" => {
            let mut points = vec![point("p", "1")];
            for i in 0..n {
                let prev = if i == 0 {
                    "p".to_string()
                } else {
                    format!("q{}", i - 1)
                };
                points.push(
                    el("point")
                        .name(&format!("q{i}"))
                        .attr("x", [mac(&format!("{prev}.x")), text(" + 1")])
                        .attr("y", [mac(&format!("{prev}.y")), text(" + 1")]),
                );
            }
            Shape {
                elements: vec![graph(points)],
                drag: "p.x",
                check: (
                    5.0,
                    vec![
                        (format!("q{}.x", n - 1), 5.0 + n as f64),
                        (format!("q{}.y", n - 1), n as f64),
                    ],
                ),
            }
        }
        // A chain of n numbers, each `($c + 3) / 2 + $c / 2 - 1` of the one
        // before: several instructions per value, which a coarse operator
        // would run as one (decision 3). It is `c + 0.5`, so every value
        // changes with every drag and stays exact.
        "poly" => {
            let step = |of: &str, name: &str| {
                el("number")
                    .name(name)
                    .text("(")
                    .child(mac(of))
                    .text(" + 3) / 2 + ")
                    .child(mac(of))
                    .text(" / 2 - 1")
            };
            let mut v = vec![graph([point("p", "1")]), step("p.x", "c0")];
            for i in 1..n {
                v.push(step(&format!("c{}", i - 1), &format!("c{i}")));
            }
            let mut c = 5.0f64;
            let mut last = 0.0;
            for _ in 0..n {
                c = (c + 3.0) / 2.0 + c / 2.0 - 1.0;
                last = c;
            }
            Shape {
                elements: v,
                drag: "p.x",
                check: (5.0, vec![(format!("c{}.value", n - 1), last)]),
            }
        }
        // As `generate.mjs`: a chain of n simplified math expressions in x,
        // fed by the dragged point and evaluated at its end (decision 5's
        // values of varying size are expressions).
        "symbolic" => {
            const COEF: [i64; 7] = [1, 2, 4, 5, 2, 3, 5];
            let mut v = vec![
                graph([point("p", "1")]),
                el("math")
                    .name("m0")
                    .flag("simplify")
                    .child(mac("p.x"))
                    .text(" x^2 + 1"),
            ];
            let mut k = 0i64;
            for i in 1..n {
                let c = COEF[i % COEF.len()];
                let sign = if i % 2 == 0 { "+" } else { "-" };
                k += if sign == "+" { c } else { -c };
                v.push(
                    el("math")
                        .name(&format!("m{i}"))
                        .flag("simplify")
                        .child(mac(&format!("m{}", i - 1)))
                        .text(&format!(" {sign} {c} x")),
                );
            }
            v.push(
                el("evaluate")
                    .name("e")
                    .attr("function", mac(&format!("m{}", n - 1)))
                    .attr("input", "1"),
            );
            v.push(el("number").name("ev").child(mac("e")));
            Shape {
                elements: v,
                drag: "p.x",
                check: (5.0, vec![("ev.value".into(), (5 + 1 + k) as f64)]),
            }
        }
        _ => {
            let pct: usize = name.strip_prefix("chain")?.parse().ok()?;
            return Some(chain(n, pct));
        }
    };
    Some(s)
}

/// `chainK`: a chain of K% of the n numbers reads the dragged point and the
/// rest read another, so the drag reaches K% of the program.
fn chain(n: usize, pct: usize) -> Shape {
    let k = (n * pct / 100).clamp(1, n);
    let mut v = vec![
        graph([point("p", "1"), point("q", "1")]),
        number("c0", "p.x", 1),
    ];
    for i in 1..k {
        v.push(number(&format!("c{i}"), &format!("c{}", i - 1), 1));
    }
    for i in k..n {
        v.push(number(&format!("o{i}"), "q.x", i));
    }
    Shape {
        elements: v,
        drag: "p.x",
        check: (5.0, vec![(format!("c{}.value", k - 1), 5.0 + k as f64)]),
    }
}

/// Load a document of `elements`.
pub fn load(elements: Vec<Element>) -> Document {
    let doc = elements.into_iter().fold(el("document"), |d, e| d.child(e));
    let dast = build([Node::from(doc)]);
    Document::load_dast(
        Arc::new(dast),
        LoadOptions::default(),
        &mut LoadTimings::default(),
    )
    .unwrap()
}

/// The one cell of `component.prop`.
pub fn cell(doc: &Document, path: &str) -> CellIdx {
    let (comp, prop) = path.split_once('.').unwrap();
    let c = doc
        .resolve_path(comp)
        .unwrap_or_else(|| panic!("no component {comp}"));
    doc.prop_cells(c, prop)
        .unwrap_or_else(|| panic!("no prop {path}"))[0]
}

/// A hash of every component's props by tree path, independent of how
/// cells are laid out: two cores that hold the same values give the same
/// hash, whatever their cell indices.
pub fn fingerprint(doc: &Document) -> u64 {
    let mut h: u64 = 0xcbf2_9ce4_8422_2325;
    let mut eat = |bytes: &[u8]| {
        for &b in bytes {
            h = (h ^ b as u64).wrapping_mul(0x0000_0100_0000_01b3);
        }
    };
    for (path, c) in crate::script::tree(doc) {
        eat(path.as_bytes());
        for (i, def) in doc.component_type(c).prop_defs().iter().enumerate() {
            eat(def.name.as_bytes());
            let v = doc.cells[doc.comp_cells(c)[i] as usize];
            // All NaNs alike, so a NaN's payload is not a difference.
            let v = if v.is_nan() { f64::NAN } else { v };
            eat(&v.to_bits().to_le_bytes());
        }
    }
    h
}
