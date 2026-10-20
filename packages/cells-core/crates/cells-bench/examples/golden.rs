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
use cells_bench::script::{apply, describe, plan, sources, tree};
use cells_core::components::ComponentType;
use cells_core::{Document, ValueType};
use std::fmt::Write as _;
use std::panic::{AssertUnwindSafe, catch_unwind};
use std::path::PathBuf;

/// A type's list of points (ADR 0016), the prefixes of its items'
/// coordinates, and the prop that counts its live points: dumped as the
/// live points through `prop_cells`, which a core with fixed layouts
/// answers too (padded past the count), so two commits on either side of
/// a layout change compare equal.
const LISTS: &[(ComponentType, &str, [&str; 2], &str)] = &[(
    ComponentType::Circle,
    "throughPoints",
    ["throughX", "throughY"],
    "numThroughPoints",
)];

/// Whether `name` is a coordinate of an item of the type's list, which a
/// fixed layout holds as a prop of its table.
fn list_coordinate(component_type: ComponentType, name: &str) -> bool {
    LISTS.iter().any(|(k, _, prefixes, _)| {
        *k == component_type
            && prefixes.iter().any(|p| {
                name.strip_prefix(p)
                    .is_some_and(|n| !n.is_empty() && n.bytes().all(|b| b.is_ascii_digit()))
            })
    })
}

fn dump(doc: &Document, out: &mut String) {
    for (path, c) in tree(doc) {
        let component_type = doc.component_type(c);
        let _ = write!(out, "{path} <{}>", component_type.tag());
        for (i, def) in component_type.prop_defs().iter().enumerate() {
            if list_coordinate(component_type, def.name) {
                continue;
            }
            let cell = doc.comp_cells(c)[i];
            let v = doc.cells[cell as usize];
            if doc.program.value_types.get(cell as usize) == Some(&ValueType::Math) {
                let _ = write!(out, " {}={:?}", def.name, doc.math_text(cell));
            } else if component_type == ComponentType::Text && i == 0 {
                let _ = write!(out, " {}={:?}", def.name, doc.text_value(cell));
            } else {
                let _ = write!(out, " {}={v:?}", def.name);
            }
        }
        for (k, list, _, count) in LISTS {
            if *k == component_type {
                let cells = doc.prop_cells(c, list).unwrap_or_default();
                let live = doc
                    .prop_cells(c, count)
                    .map_or(0.0, |n| doc.cells[n[0] as usize]);
                let n = (live as usize).min(cells.len() / 2);
                let values: Vec<f64> = cells[..2 * n]
                    .iter()
                    .map(|&x| doc.cells[x as usize])
                    .collect();
                let _ = write!(out, " {list}={values:?}");
            }
        }
        if let Some(t) = doc.section_title(c) {
            let _ = write!(out, " title={t:?}");
        }
        out.push('\n');
    }
    let _ = writeln!(out, "text {:?}", doc.rendered_text(doc.root));
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
