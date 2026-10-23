//! Support for tests and benches, not used by the library itself: an
//! independent oracle for the scheduled program, helpers that turn
//! DoenetML source into a document, DASTs built in Rust for tests that
//! need no parser (`dast`), and component specs (`spec!`).

pub mod dast;
pub mod reference;
pub mod spec;
pub mod test_utils;

#[cfg(feature = "testing")]
pub use crate::build::coverage::{ProbeEdges, probe_edges, uncovered};

/// The compile of `dast` for a session at `seed`, checked as a load checks
/// it, whether or not a load would keep it.
pub fn compile(
    dast: &crate::dast::Dast,
    seed: u64,
) -> crate::Result<std::sync::Arc<crate::compile::Compiled>> {
    let dast = std::sync::Arc::new(dast.clone());
    let session = crate::session::Session::new(seed, false);
    Ok(crate::compile::compile(&dast, &session, true)?.compiled)
}

/// The compile of `dast` for a session at `seed`, as text equal exactly when
/// two compiles are: what `tests/compile_purity.rs` compares across seeds.
pub fn compile_fingerprint(dast: &crate::dast::Dast, seed: u64) -> crate::Result<String> {
    Ok(compile(dast, seed)?.fingerprint())
}

/// The value of the one-cell prop at `path` (`"c.radius"`), for a unit
/// test; panics when there is no such prop or it has several cells.
pub fn prop_value(doc: &crate::Document, path: &str) -> f64 {
    match spec::cells(doc, path)
        .unwrap_or_else(|e| panic!("{e}"))
        .as_slice()
    {
        [c] => doc.cells[*c as usize],
        cs => panic!("{path}: {} cells, not one", cs.len()),
    }
}

/// One tick requesting `value` for the one-cell prop at `path`, for a unit
/// test; panics as `prop_value` does.
pub fn request_prop(doc: &mut crate::Document, path: &str, value: f64) -> crate::TickOutcome {
    let cell = match spec::cells(doc, path)
        .unwrap_or_else(|e| panic!("{e}"))
        .as_slice()
    {
        [c] => *c,
        cs => panic!("{path}: {} cells, not one", cs.len()),
    };
    doc.request(&[crate::Request { cell, value }])
}

/// The essential cells saved state cannot name (ADR 0017): hidden slots
/// holding no shared state, as `key (hidden slot k)`.
pub fn unsaved_essentials(doc: &crate::Document) -> Vec<String> {
    use crate::compile::plan::HIDDEN;
    let mut out: Vec<String> = doc
        .structure
        .essential_keys
        .iter()
        .filter(|&&(key, prop)| doc.keys.prop_key(key, prop).is_none())
        .map(|&(key, prop)| {
            format!(
                "{} {} (hidden slot {})",
                doc.keys.key_type(key).tag(),
                doc.keys.key_text(key),
                prop & !HIDDEN
            )
        })
        .collect();
    out.sort();
    out.dedup();
    out
}
