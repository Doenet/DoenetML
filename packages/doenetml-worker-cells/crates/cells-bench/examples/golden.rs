//! Golden behavior dump for refactoring: every component's props by tree
//! path, after load and after each step of a fixed script of requests, so two
//! commits can be diffed (`scripts/golden-diff.sh`). Values print as Rust's
//! shortest round-trip `f64`; math cells print their expression text and
//! `<text>` values their string, so neither cell layout nor handle numbering
//! shows up. Usage: `golden <out-dir>`; program fingerprints go to
//! `<out-dir>.programs`.
//!
//! Documents: `crates/cells-bench/golden/*.doenet` plus the smallest fixture
//! of each shape in `fixtures/`.
use cells_core::components::ComponentType;
use cells_core::{Child, CompIdx, Document, PointRequest, Request, TickOutcome};
use std::collections::BTreeMap;
use std::fmt::Write as _;
use std::panic::{AssertUnwindSafe, catch_unwind};
use std::path::{Path, PathBuf};

/// Every component reachable from the root, by path: each step is the
/// component's name (or tag) and its ordinal among siblings with that label.
fn tree(doc: &Document) -> Vec<(String, CompIdx)> {
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

fn dump(doc: &Document, out: &mut String) {
    for (path, c) in tree(doc) {
        let component_type = doc.component_type(c);
        let _ = write!(out, "{path} <{}>", component_type.tag());
        for (i, def) in component_type.prop_defs().iter().enumerate() {
            let cell = doc.comp_cells(c)[i];
            let v = doc.cells[cell as usize];
            if doc
                .program
                .is_math
                .get(cell as usize)
                .copied()
                .unwrap_or(false)
            {
                let _ = write!(out, " {}={:?}", def.name, doc.math_text(cell));
            } else if component_type == ComponentType::Text && i == 0 {
                let _ = write!(out, " {}={:?}", def.name, doc.text_value(cell));
            } else {
                let _ = write!(out, " {}={v:?}", def.name);
            }
        }
        if let Some(t) = doc.section_title(c) {
            let _ = write!(out, " title={t:?}");
        }
        out.push('\n');
    }
    let _ = writeln!(out, "text {:?}", doc.rendered_text(doc.root));
}

/// One scripted action, addressed by tree path so it survives rebuilds.
enum Action {
    Shift(&'static str, f64, f64),
    Add(&'static str, f64),
    Toggle,
    Type(&'static str),
    Submit,
}

fn plan(doc: &Document) -> Vec<(String, Action)> {
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
                "op" | "number" => Action::Add("value", 2.0),
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

fn apply(doc: &mut Document, path: &str, action: &Action) -> Option<TickOutcome> {
    let c = tree(doc).into_iter().find(|(p, _)| p == path)?.1;
    let v = |doc: &Document, cell: u32| doc.cells[cell as usize];
    Some(match *action {
        Action::Shift(prop, dx, dy) => {
            let cells = doc.prop_cells(c, prop)?;
            let pts: Vec<PointRequest> = cells
                .chunks_exact(2)
                .map(|xy| PointRequest {
                    cells: [xy[0], xy[1]],
                    values: [v(doc, xy[0]) + dx, v(doc, xy[1]) + dy],
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

fn describe(a: &Action) -> String {
    match a {
        Action::Shift(p, dx, dy) => format!("shift {p} by ({dx}, {dy})"),
        Action::Add(p, d) => format!("add {d} to {p}"),
        Action::Toggle => "toggle".into(),
        Action::Type(t) => format!("type {t:?}"),
        Action::Submit => "submit".into(),
    }
}

/// A hash of the loaded program (instructions, their inputs, initial
/// cells): equal when a refactor left the built document untouched.
fn fingerprint(doc: &Document) -> u64 {
    use std::hash::{Hash, Hasher};
    let mut h = std::collections::hash_map::DefaultHasher::new();
    format!("{:?}", doc.program.instrs).hash(&mut h);
    doc.program.operands.hash(&mut h);
    doc.cells.iter().for_each(|c| c.to_bits().hash(&mut h));
    h.finish()
}

fn run(source: &str, programs: &mut String, name: &str) -> String {
    let mut out = String::new();
    let json = cells_core::testing::test_utils::dast_json(source);
    let mut doc = match Document::from_bytes(json.as_bytes()) {
        Ok(d) => d,
        Err(e) => return format!("load error: {e}\n"),
    };
    let _ = writeln!(programs, "{name} {:016x}", fingerprint(&doc));
    let _ = writeln!(out, "## load");
    for w in doc.warnings() {
        let _ = writeln!(out, "warning {w}");
    }
    dump(&doc, &mut out);
    for (path, action) in plan(&doc) {
        let _ = write!(out, "## {path}: {}", describe(&action));
        match catch_unwind(AssertUnwindSafe(|| apply(&mut doc, &path, &action))) {
            Ok(None) => {
                let _ = writeln!(out, " (skipped)");
                continue;
            }
            Ok(Some(t)) => {
                let _ = writeln!(
                    out,
                    " dropped={} rebuilt={} error={:?}",
                    t.dropped.len(),
                    t.rebuilt,
                    t.rebuild_error
                );
            }
            Err(_) => {
                let _ = writeln!(out, " PANIC");
                return out;
            }
        }
        dump(&doc, &mut out);
    }
    out
}

fn sources(root: &Path) -> Vec<(String, PathBuf)> {
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
            let key = cells_bench::spec_key(&spec);
            if smallest
                .get(&key.0)
                .is_none_or(|(s, _)| cells_bench::spec_key(s) > key)
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

fn main() {
    let dir = PathBuf::from(std::env::args().nth(1).expect("usage: golden <out-dir>"));
    std::fs::create_dir_all(&dir).unwrap();
    let root = cells_core::testing::test_utils::repo_root();
    let mut programs = String::new();
    for (name, path) in sources(&root) {
        let text = run(
            &std::fs::read_to_string(&path).unwrap(),
            &mut programs,
            &name,
        );
        let lines = text.lines().count();
        std::fs::write(dir.join(format!("{name}.txt")), text).unwrap();
        eprintln!("{name}: {lines} lines");
    }
    // Beside the dump, not in it: a refactor may change the program on purpose.
    std::fs::write(dir.with_extension("programs"), programs).unwrap();
}
