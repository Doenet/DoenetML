//! The golden script (`examples/golden.rs`): every document of the golden
//! set and a fixed list of requests per document, addressed by tree path so
//! they survive rebuilds. Shared with the tests that tick documents through
//! it (`tests/evaluators.rs`). Every request is one a renderer makes, on
//! an input's cell (ADR 0018), and an answer's submit is an action.

use cells_core::CellIdx;
use cells_core::{Child, CompIdx, Document, PointRequest, Request, TickOutcome};
use std::collections::BTreeMap;
use std::path::{Path, PathBuf};

/// Every component reachable from the root, by path: each step is the
/// component's name (or tag) and its ordinal among siblings with that label.
pub fn tree(doc: &Document) -> Vec<(String, CompIdx)> {
    fn walk(doc: &Document, c: CompIdx, path: String, out: &mut Vec<(String, CompIdx)>) {
        out.push((path.clone(), c));
        let mut seen: BTreeMap<String, u32> = BTreeMap::new();
        for ch in doc.children(c) {
            if let Child::Component(k) = ch {
                let label = doc
                    .name(k)
                    .map(str::to_string)
                    .unwrap_or_else(|| doc.component_type(k).tag().to_string());
                let n = seen.entry(label.clone()).or_insert(0);
                *n += 1;
                walk(doc, k, format!("{path}/{label}[{n}]"), out);
            }
        }
    }
    let mut out = Vec::new();
    walk(doc, doc.root, String::new(), &mut out);
    out
}

/// One scripted action, addressed by tree path so it survives rebuilds.
pub enum Action {
    Shift(&'static str, f64, f64),
    Add(&'static str, f64),
    Toggle,
    Type(&'static str),
    Submit,
}

pub fn plan(doc: &Document) -> Vec<(String, Action)> {
    let mut by_type: BTreeMap<&'static str, Vec<String>> = BTreeMap::new();
    for (path, c) in tree(doc) {
        by_type
            .entry(doc.component_type(c).tag())
            .or_default()
            .push(path);
    }
    let mut steps = Vec::new();
    for (tag, paths) in by_type {
        let action = || -> Option<Action> {
            Some(match tag {
                "point" => Action::Shift("coords", 1.5, -0.5),
                "polygon" => Action::Shift("vertices", 0.8, -1.2),
                "line" | "lineSegment" => Action::Shift("points", -1.0, 0.5),
                "circle" => Action::Shift("center", 0.5, 1.0),
                "numberInput" => Action::Add("value", 1.0),
                "slider" => Action::Add("value", 0.7),
                "booleanInput" => Action::Toggle,
                "mathInput" => Action::Type("2x+1"),
                "answer" => Action::Submit,
                _ => return None,
            })
        };
        let mut picks = vec![paths[0].clone()];
        if paths.len() > 1 {
            picks.push(paths[paths.len() - 1].clone());
        }
        for p in picks {
            if let Some(a) = action() {
                steps.push((p.clone(), a));
            }
        }
        // Then push the first number input negative: flips sign conditions
        // and empties repeats whose length it sets.
        if tag == "numberInput" {
            steps.push((paths[0].clone(), Action::Add("value", -7.0)));
        }
    }
    steps
}

pub fn apply(doc: &mut Document, path: &str, action: &Action) -> Option<TickOutcome> {
    let c = tree(doc).into_iter().find(|(p, _)| p == path)?.1;
    let v = |doc: &Document, cell: CellIdx| doc.cells[cell.index()];
    Some(match *action {
        Action::Shift(prop, dx, dy) => {
            let cells = doc.prop_cells(c, prop)?;
            let pts: Vec<PointRequest> = cells
                .as_chunks::<2>()
                .0
                .iter()
                .map(|&[x, y]| PointRequest {
                    cells: [x, y],
                    values: [v(doc, x) + dx, v(doc, y) + dy],
                })
                .collect();
            if pts.is_empty() {
                return None;
            }
            doc.request_points(&pts)
        }
        Action::Add(prop, d) => {
            let cell = doc.prop_cells(c, prop)?[0];
            let old = v(doc, cell);
            doc.request(&[Request {
                cell,
                value: if old.is_nan() { d } else { old + d },
            }])
        }
        Action::Toggle => {
            let cell = doc.prop_cells(c, "value")?[0];
            let value = if v(doc, cell) == 0.0 { 1.0 } else { 0.0 };
            doc.request(&[Request { cell, value }])
        }
        Action::Type(text) => {
            let cell = doc.prop_cells(c, "expr")?[0];
            let value = doc.parse_math(text).ok()?;
            doc.request(&[Request { cell, value }])
        }
        Action::Submit => doc.submit(c),
    })
}

pub fn describe(a: &Action) -> String {
    match a {
        Action::Shift(p, dx, dy) => format!("shift {p} by ({dx}, {dy})"),
        Action::Add(p, d) => format!("add {d} to {p}"),
        Action::Toggle => "toggle".into(),
        Action::Type(t) => format!("type {t:?}"),
        Action::Submit => "submit".into(),
    }
}

/// The golden documents, by name: `crates/cells-bench/golden/*.doenet`
/// and the smallest fixture of each shape, under the repository `root`.
pub fn sources(root: &Path) -> Vec<(String, PathBuf)> {
    let mut out = Vec::new();
    let hand = root.join("crates/cells-bench/golden");
    for e in std::fs::read_dir(&hand).unwrap().flatten() {
        let p = e.path();
        if p.extension().is_some_and(|x| x == "doenet") {
            out.push((p.file_stem().unwrap().to_string_lossy().to_string(), p));
        }
    }
    // The smallest fixture of each shape.
    let mut smallest: BTreeMap<String, (String, PathBuf)> = BTreeMap::new();
    for e in std::fs::read_dir(root.join("fixtures")).unwrap().flatten() {
        let p = e.path();
        if p.extension().is_some_and(|x| x == "doenet") {
            let spec = p.file_stem().unwrap().to_string_lossy().to_string();
            let key = crate::spec_key(&spec);
            if smallest
                .get(&key.0)
                .is_none_or(|(s, _)| crate::spec_key(s) > key)
            {
                smallest.insert(key.0.clone(), (spec, p));
            }
        }
    }
    out.extend(
        smallest
            .into_values()
            .map(|(s, p)| (format!("fixture-{s}"), p)),
    );
    out.sort();
    out
}
