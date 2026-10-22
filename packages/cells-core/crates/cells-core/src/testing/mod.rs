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
