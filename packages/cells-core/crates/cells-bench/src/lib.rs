//! Shared fixture loading for benches and the stats binary.

use std::path::PathBuf;

/// The repository root (this crate sits at `crates/cells-bench`).
pub fn repo_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../..")
}

pub fn fixtures_dir() -> PathBuf {
    repo_root().join("fixtures")
}

/// The binary wire-format bytes of a fixture, if `scripts/gen-fixtures.sh`
/// produced them.
pub fn fixture_binary(spec: &str) -> Option<Vec<u8>> {
    std::fs::read(fixtures_dir().join(format!("{spec}.cdast"))).ok()
}

/// A fixture's DAST JSON.
pub fn fixture_json(spec: &str) -> String {
    std::fs::read_to_string(fixtures_dir().join(format!("{spec}.json")))
        .unwrap_or_else(|e| panic!("{spec}.json: {e}; run scripts/gen-fixtures.sh"))
}

/// A fixture in the binary wire format if generated, else as JSON bytes;
/// `Document::from_bytes` takes either.
pub fn fixture_bytes(spec: &str) -> Vec<u8> {
    fixture_binary(spec).unwrap_or_else(|| fixture_json(spec).into_bytes())
}

/// The median of timings; NaN when there are none.
pub fn median(mut xs: Vec<f64>) -> f64 {
    if xs.is_empty() {
        return f64::NAN;
    }
    xs.sort_by(|a, b| a.partial_cmp(b).unwrap());
    xs[xs.len() / 2]
}

/// (spec, DAST JSON) for every fixture, sorted by spec name. Set
/// `CELLS_FIXTURES` to a comma-separated list of specs to restrict the set.
pub fn fixtures() -> Vec<(String, String)> {
    let filter: Option<Vec<String>> = std::env::var("CELLS_FIXTURES")
        .ok()
        .map(|s| s.split(',').map(|x| x.trim().to_string()).collect());
    let mut out = Vec::new();
    let dir = fixtures_dir();
    let Ok(entries) = std::fs::read_dir(&dir) else {
        eprintln!(
            "no fixtures in {}; run scripts/gen-fixtures.sh",
            dir.display()
        );
        return out;
    };
    for e in entries.flatten() {
        let p = e.path();
        if p.extension().is_some_and(|x| x == "json") {
            let spec = p.file_stem().unwrap().to_string_lossy().to_string();
            if filter.as_ref().is_some_and(|f| !f.contains(&spec)) {
                continue;
            }
            out.push((spec, std::fs::read_to_string(&p).unwrap()));
        }
    }
    out.sort_by_key(|a| spec_key(&a.0));
    out
}

/// Sort "chain-100" before "chain-1000" by (shape, numeric size).
pub fn spec_key(spec: &str) -> (String, u64, u64) {
    let (shape, size) = spec.split_once('-').unwrap_or((spec, "0"));
    let (a, b) = size.split_once('x').unwrap_or((size, "0"));
    (
        shape.to_string(),
        a.parse().unwrap_or(0),
        b.parse().unwrap_or(0),
    )
}

/// The cell a drag request would target in each fixture shape: the end of
/// the chain, the fan-out root, or the first point's x; None for shapes
/// with nothing to drag.
pub fn drag_target(doc: &cells_core::Document, spec: &str) -> Option<cells_core::CellIdx> {
    let shape = spec.split('-').next().unwrap();
    Some(match shape {
        "chain" | "intchain" => doc.cell("p", "x").unwrap(),
        "hidden" => doc.cell("b", "value").unwrap(),
        "sliderchain" => doc.cell("s", "value").unwrap(),
        "sliderstack" => doc.cell("p", "x").unwrap(),
        // First iteration's free point, through the collect's copy.
        "repeat" => doc.cell("q", "x").unwrap(),
        // The last iterate's point, so the drag inverts the whole lag chain.
        "recur" => {
            let n = doc.value("n", "value").unwrap() as usize;
            let c = doc.resolve_path(&format!("r[{n}].p")).unwrap();
            doc.prop_cells(c, "x").unwrap()[0]
        }
        "fanout" => doc.cell("n", "value").unwrap(),
        // The first circle's center: a fan-out inverse onto its three points.
        "circles3" => doc.cell("k0", "cx").unwrap(),
        "aliases" => doc.cell("p", "x").unwrap(),
        "grid" => doc.cell("p0", "x").unwrap(),
        // A vertex of the first polygon: snapping against the group.
        "sticky" => doc.cell("sg.p0", "x1").unwrap(),
        "stickyfree" => doc.cell("p0", "x1").unwrap(),
        // The shared coefficient: every curve resamples.
        "curves" => doc.cell("a", "value").unwrap(),
        // The evaluation point the chain's evaluates read.
        "symchain" => doc.cell("t", "value").unwrap(),
        // The SIR simulation's initial infectives: every iterate follows.
        "sir" => doc.cell("I0", "value").unwrap(),
        // Shapes with nothing to drag (load-time choices, answers) have no p0.
        _ => return doc.cell("p0", "x"),
    })
}
