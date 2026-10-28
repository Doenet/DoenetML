//! Which cells a document computes (ADR 0019, phase 2): the census of live
//! cells over the golden set and `fixtures/sir.doenet`, and the checks the
//! compile's record must pass at every count a student can reach. Nothing
//! is pruned yet; this measures what pruning will remove.

mod common;

use std::path::Path;

use cells_core::components::ComponentType;
use cells_core::testing::test_utils::{dast_json, load, repo_root};
use cells_core::testing::{live_cells_agree, request_unchecked};
use cells_core::{Document, LoadOptions, Request};

/// (name, source) of the golden set and `sir.doenet`.
fn documents() -> Vec<(String, String)> {
    let root = repo_root();
    let mut paths: Vec<_> = std::fs::read_dir(root.join("crates/cells-bench/golden"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    paths.sort();
    paths.push(root.join("fixtures/sir.doenet"));
    paths
        .iter()
        .map(|p| {
            let name = Path::new(p).file_stem().unwrap().to_string_lossy();
            (name.into_owned(), std::fs::read_to_string(p).unwrap())
        })
        .collect()
}

fn load_seeded(src: &str, seed: u64, prune: bool) -> Document {
    let options = LoadOptions {
        seed,
        prune,
        ..Default::default()
    };
    Document::load(dast_json(src).as_bytes(), options)
        .unwrap()
        .0
}

/// What every build must hold, by the record and by its own walk: the
/// walk finds nothing live the record leaves out, and every output and
/// every essential cell is live. Returns how many cells the record keeps
/// that the walk does not: what deciding per template slot costs.
fn check(doc: &Document, at: &str) -> usize {
    let walked = doc.live_cells_walked();
    let missed: Vec<u32> = walked
        .iter()
        .copied()
        .filter(|&c| !doc.is_live(c))
        .collect();
    assert!(
        missed.is_empty(),
        "{at}: live by the walk, not the record: {missed:?}"
    );
    for c in doc.output_cells() {
        assert!(doc.is_live(c), "{at}: output cell {c} is not live");
    }
    for c in 0..doc.n_essential as u32 {
        assert!(doc.is_live(c), "{at}: essential cell {c} is not live");
    }
    // Emit sizes the cells for what it keeps, the dead cell included: an
    // array that grew while numbering holds twice what it needs.
    assert_eq!(
        doc.memory_estimate().cells,
        doc.cells.len() * 8,
        "{at}: the cells outgrew what emit counted"
    );
    doc.live_cells().len() - walked.len()
}

/// The repeats' count cells, one per repeat or function iterate.
fn count_cells(doc: &Document) -> Vec<u32> {
    (0..doc.components.len() as u32)
        .filter_map(|c| {
            let i = doc.component_type(c).count_prop()?;
            Some(doc.comp_cells(c)[i])
        })
        .collect()
}

/// Per document, at load: instructions and derived cells live by the
/// record, by the build's own walk, and in all; fixed cells dead.
#[test]
fn census() {
    let mut golden = [0usize; 4];
    for (name, src) in documents() {
        // Unpruned, so every instruction is there to count.
        let doc = load_seeded(&src, 0, false);
        check(&doc, &name);
        let walked = doc.live_cells_walked();
        let is_walked = |c: u32| walked.binary_search(&c).is_ok();
        let instrs = &doc.program.instrs;
        let live_instrs = instrs.iter().filter(|i| doc.is_live(i.out)).count();
        let walked_instrs = instrs.iter().filter(|i| is_walked(i.out)).count();
        let derived = doc.n_essential + doc.n_fixed..doc.cells.len();
        let live_derived = derived.clone().filter(|&c| doc.is_live(c as u32)).count();
        let walked_derived = derived.clone().filter(|&c| is_walked(c as u32)).count();
        let fixed = doc.n_essential..doc.n_essential + doc.n_fixed;
        let dead_fixed = fixed.filter(|&c| !doc.is_live(c as u32)).count();
        eprintln!(
            "{name:>10}: instructions {live_instrs:>5} live ({walked_instrs:>5} by the walk) of {:<5} \
             derived {live_derived:>5} ({walked_derived:>5}) of {:<5} fixed {dead_fixed:>5} dead of {}",
            instrs.len(),
            derived.len(),
            doc.n_fixed,
        );
        if name != "sir" {
            golden[0] += live_instrs;
            golden[1] += instrs.len();
            golden[2] += live_derived;
            golden[3] += derived.len();
        }
    }
    eprintln!(
        "golden set: instructions {} live of {}, derived {} of {}",
        golden[0], golden[1], golden[2], golden[3]
    );
    // Context counted 177 of the golden set's 275 instructions live, from
    // the viewer's reads; the marks find the same.
    assert!(golden[0] <= 177 && golden[1] == 275, "{golden:?}");
}

/// At four seeds, and with every repeat at 0 to 4 iterations, the record
/// holds everything each build's own walk finds live; what it keeps beyond
/// that is printed.
#[test]
fn the_record_holds_every_build() {
    for (name, src) in documents() {
        let mut extra = 0;
        for seed in [0, 1, 2, 3] {
            let mut doc = load_seeded(&src, seed, true);
            extra += check(&doc, &format!("{name}, seed {seed}"));
            for k in 0..=4 {
                let requests: Vec<Request> = count_cells(&doc)
                    .into_iter()
                    .map(|cell| Request {
                        cell,
                        value: k as f64,
                    })
                    .collect();
                if requests.is_empty() {
                    break;
                }
                request_unchecked(&mut doc, &requests);
                extra += check(&doc, &format!("{name}, seed {seed}, count {k}"));
            }
        }
        eprintln!("{name:>10}: the record keeps {extra} cells the builds' walks do not");
    }
}

fn cells(doc: &Document, name: &str, prop: &str) -> Vec<u32> {
    let c = doc
        .resolve_path(name)
        .unwrap_or_else(|| panic!("no {name}"));
    doc.prop_cells(c, prop)
        .unwrap_or_else(|| panic!("no {name}.{prop}"))
}

/// What the walk keeps and what it leaves, on small documents: a value
/// in `<setup>` that a rendered number reads is live, one nothing reads is
/// not; a circle's area is not. A line outside a graph is not drawn, but
/// its points are inputs, which are live wherever they are, as the
/// writable walk starts from every input (ADR 0018): only what nothing
/// but its drawing reads, its slope, is dead.
#[test]
fn what_is_live() {
    let doc = load(
        r#"
<setup>
  <number name="used">$n + 1</number>
  <number name="unused">$n + 2</number>
</setup>
<numberInput name="n"/>
<number name="shown">$used * 2</number>
<graph><circle name="c" center="($n, 0)" radius="2"/></graph>
<line name="outside" through="(2 $n, 0) (1,1)"/>
<answer name="a"><award><when>$unused > 3</when></award></answer>
"#,
    )
    .unwrap();
    for (name, prop, live) in [
        ("used", "value", true),
        ("shown", "value", true),
        ("c", "cx", true),
        ("c", "area", false),
        ("outside", "x1", true),
        ("outside", "slope", false),
        // The answer's credit is a score, so the award's condition is live.
        ("unused", "value", true),
    ] {
        for cell in cells(&doc, name, prop) {
            assert_eq!(doc.is_live(cell), live, "{name}.{prop} (cell {cell})");
        }
    }
    let doc = load(r#"<setup><number name="alone">2 + $n</number></setup><numberInput name="n"/>"#)
        .unwrap();
    for cell in cells(&doc, "alone", "value") {
        assert!(!doc.is_live(cell), "alone.value");
    }
}

/// One request on each interactive prop, one prop at a time, then a submit
/// of every answer and a press of every trigger, each on `full` and on
/// `pruned` alike, which must then agree on every live cell. A number is
/// requested one more than it is, a math `x + 1`, a text "pruned".
fn act_on_both(full: &mut Document, pruned: &mut Document, at: &str) {
    use cells_core::program::ValueType;
    let agree = |full: &Document, pruned: &Document, what: &str| {
        if let Err(e) = live_cells_agree(full, pruned) {
            panic!("{at}, {what}: {e}");
        }
    };
    let n = pruned.n_components() as u32;
    for c in 0..n {
        for pi in 0..pruned.comp_cells(c).len() {
            let (f, p) = (full.comp_cells(c)[pi], pruned.comp_cells(c)[pi]);
            if !pruned.is_interactive(p) {
                continue;
            }
            let value = |doc: &mut Document, cell: u32| match doc.value_types[cell as usize] {
                ValueType::Number => {
                    let v = doc.cells[cell as usize];
                    if v.is_nan() { 1.0 } else { v + 1.0 }
                }
                ValueType::Math => doc.parse_math("x + 1").unwrap(),
                ValueType::Text => doc.intern("pruned"),
            };
            let (vf, vp) = (value(full, f), value(pruned, p));
            full.request(&[Request { cell: f, value: vf }]);
            pruned.request(&[Request { cell: p, value: vp }]);
            if pruned.n_components() as u32 != n {
                // A request moved a count: the tables are new.
                agree(full, pruned, &format!("requesting cell {p}"));
                return;
            }
            agree(full, pruned, &format!("requesting cell {p}"));
        }
    }
    for c in 0..n {
        match pruned.component_type(c) {
            ComponentType::Answer => {
                full.submit(c);
                pruned.submit(c);
            }
            ComponentType::TriggerSet => {
                full.trigger(c);
                pruned.trigger(c);
            }
            _ => continue,
        }
        agree(full, pruned, &format!("acting on component {c}"));
        if pruned.n_components() as u32 != n {
            return;
        }
    }
}

/// Pruning changes no value anything reads: at four seeds and every
/// repeat at 0 to 4 iterations, a pruned load and an unpruned one, given
/// the same requests and actions, hold the same value in every live cell.
#[test]
fn pruning_keeps_every_live_value() {
    for (name, src) in documents() {
        for seed in [0, 1, 2, 3] {
            let mut full = load_seeded(&src, seed, false);
            let mut pruned = load_seeded(&src, seed, true);
            if let Err(e) = live_cells_agree(&full, &pruned) {
                panic!("{name}, seed {seed}, after the load: {e}");
            }
            act_on_both(&mut full, &mut pruned, &format!("{name}, seed {seed}"));
            for k in 0..=4 {
                let requests = |doc: &Document| -> Vec<Request> {
                    count_cells(doc)
                        .into_iter()
                        .map(|cell| Request {
                            cell,
                            value: k as f64,
                        })
                        .collect()
                };
                let (rf, rp) = (requests(&full), requests(&pruned));
                if rp.is_empty() {
                    break;
                }
                request_unchecked(&mut full, &rf);
                request_unchecked(&mut pruned, &rp);
                let at = format!("{name}, seed {seed}, count {k}");
                if let Err(e) = live_cells_agree(&full, &pruned) {
                    panic!("{at}: {e}");
                }
                act_on_both(&mut full, &mut pruned, &at);
            }
        }
    }
}
