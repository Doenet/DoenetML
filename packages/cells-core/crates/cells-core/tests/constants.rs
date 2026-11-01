//! The constants of the golden set and `fixtures/sir.doenet` (ADR 0028):
//! per document, at load, how many constants it has, how many the pool
//! holds, and how many of their template slots the compile's record makes
//! document constants and how many scope constants; and the pool, the
//! folds and the curves the bridge reads. Whether the record is right is
//! `tests/every_count.rs`'s `a_constant_is_the_same_in_every_build`.

use std::collections::HashSet;
use std::path::Path;

use cells_core::build::SlotClass;
use cells_core::program::SAMPLES;
use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::{Document, LoadOptions};

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

#[test]
fn census() {
    let mut total = [0usize; 4];
    for (name, src) in documents() {
        // Pruned, as a browser loads.
        let (doc, _) = Document::load(dast_json(&src).as_bytes(), LoadOptions::default()).unwrap();
        let (mut document, mut scope) = (0, 0);
        let mut values = HashSet::new();
        for &(_, class) in &doc.structure.slot_classes {
            match class {
                SlotClass::Constant {
                    value,
                    document: true,
                } => {
                    document += 1;
                    values.insert(value.to_bits());
                }
                SlotClass::Constant { .. } => scope += 1,
                _ => {}
            }
        }
        // The document constants share the pool's cells, one per distinct
        // value, beside the operators' constants and the missing cell; a
        // scope constant has a cell of its own after the pool (ADR 0028).
        assert!(values.len() <= doc.n_pool, "{name}");
        assert!(scope <= doc.n_const - doc.n_pool, "{name}");
        eprintln!(
            "{name:>10}: constants {:>5}   pooled {:>4}   document slots {document:>5} ({:>4} values)   scope {scope:>4}",
            doc.n_const,
            doc.n_pool,
            values.len(),
        );
        if name != "sir" {
            total[0] += doc.n_const;
            total[1] += document;
            total[2] += doc.n_pool;
            total[3] += scope;
        }
    }
    eprintln!(
        "golden set: constants {}, pooled {}, document slots {}, scope {}",
        total[0], total[2], total[1], total[3]
    );
    assert!(total[1] > 0, "no document constant in the golden set");
}

/// A folded instruction is a constant (ADR 0028): after the load, a full
/// recompute, which runs every instruction the program kept, changes no
/// constant and no other cell, and nothing the program runs writes a
/// constant.
#[test]
fn a_full_recompute_changes_no_constant() {
    for (name, src) in documents() {
        let (mut doc, _) =
            Document::load(dast_json(&src).as_bytes(), LoadOptions::default()).unwrap();
        let constants = 0..doc.n_const;
        for ins in &doc.program.instrs {
            assert!(
                !constants.contains(&ins.out.index()),
                "{name}: an instruction writes constant {}",
                ins.out
            );
        }
        let before = doc.cells.clone();
        doc.recompute();
        for (i, (a, b)) in before.iter().zip(&doc.cells).enumerate() {
            assert!(
                a.to_bits() == b.to_bits() || (a.is_nan() && b.is_nan()),
                "{name}: cell {i} was {a}, {b} after a full recompute"
            );
        }
    }
}

/// A curve's samples fold like any instruction over constants (a graph
/// whose axes `fixAxes` holds), and the curve is still drawn: the bridge
/// tells a function with a curve from one without by its `curve` prop, a
/// fact about the source, not by its samples being derived (`CURVE` in
/// `doenetml-worker/src/cells/contracts.ts`), and the whole run of samples
/// is output either way.
#[test]
fn a_folded_curve_is_still_drawn() {
    for (src, folds) in [
        (
            r#"<graph xmin="-1" xmax="1"><function name="f">x^2</function></graph>"#,
            false,
        ),
        (
            r#"<graph xmin="-1" xmax="1" fixAxes><function name="f">x^2</function></graph>"#,
            true,
        ),
    ] {
        let (doc, _) = Document::load(dast_json(src).as_bytes(), LoadOptions::default()).unwrap();
        assert_eq!(doc.value("f", "curve"), Some(1.0), "{src}");
        let samples = doc.cell("f", "samples").unwrap();
        assert_eq!(
            doc.is_const(samples),
            folds,
            "{src}: the samples are constants"
        );
        assert!(!doc.is_essential(samples), "{src}");
        let outputs = doc.output_cells();
        for k in 0..SAMPLES {
            let cell = samples.offset(k);
            assert!(
                outputs.binary_search(&cell).is_ok(),
                "{src}: samples[{k}] is not an output"
            );
            assert_eq!(doc.is_const(cell), folds, "{src}: samples[{k}]");
            let x = -1.0 + 2.0 * k as f64 / (SAMPLES - 1) as f64;
            let y = doc.cells[cell.index()];
            assert!(
                (y - x * x).abs() < 1e-9,
                "{src}: samples[{k}] is {y}, not {}",
                x * x
            );
        }
    }
    // A function of several variables has no curve: one absent constant.
    let src = r#"<graph fixAxes><function name="g" variables="x y">x+y</function></graph>"#;
    let (doc, _) = Document::load(dast_json(src).as_bytes(), LoadOptions::default()).unwrap();
    assert_eq!(doc.value("g", "curve"), Some(0.0));
    assert!(doc.is_const(doc.cell("g", "samples").unwrap()));
}

/// The constant pool (ADR 0028): a document constant is one cell per
/// distinct value, shared by every iteration, at the front of the cells,
/// and keeps that cell through every rebuild, whose pool only grows.
#[test]
fn a_document_constant_keeps_its_cell_across_rebuilds() {
    let src = r#"<numberInput name="n" value="3"/>
<graph><repeatForSequence name="r" length="$n"><point name="q" x="2" y="7" fixed/></repeatForSequence></graph>"#;
    let (mut doc, _) = Document::load(dast_json(src).as_bytes(), LoadOptions::default()).unwrap();
    let x = |doc: &Document, k: usize| {
        let q = doc.resolve_path(&format!("r[{k}].q")).unwrap();
        doc.prop_cells(q, "x").unwrap()[0]
    };
    // Every iteration's `x` is one pooled cell.
    let cell = x(&doc, 1);
    assert!(cell.index() < doc.n_pool, "x is not pooled");
    assert_eq!(doc.cells[cell.index()], 2.0);
    for k in 2..=3 {
        assert_eq!(x(&doc, k), cell, "iteration {k} has its own cell");
    }
    let pool: Vec<u64> = doc.cells[..doc.n_pool]
        .iter()
        .map(|v| v.to_bits())
        .collect();
    for count in [5.0, 0.0, 2.0] {
        let n = doc.cell("n", "value").unwrap();
        let tick = doc.request(&[cells_core::Request {
            cell: n,
            value: count,
        }]);
        assert!(tick.rebuilt, "count {count}");
        assert!(doc.n_pool >= pool.len(), "the pool shrank");
        let now: Vec<u64> = doc.cells[..pool.len()]
            .iter()
            .map(|v| v.to_bits())
            .collect();
        assert_eq!(now, pool, "a pooled cell moved at count {count}");
        if count > 0.0 {
            assert_eq!(x(&doc, 1), cell, "x moved at count {count}");
        }
    }
}
