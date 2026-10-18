//! Support for tests and benches, not used by the library itself: an
//! independent oracle for the scheduled program, and helpers that turn
//! DoenetML source into a document.

pub mod reference;
pub mod test_utils;

/// The compile of `dast` for a session at `seed`, as text equal exactly when
/// two compiles are: what `tests/compile_purity.rs` compares across seeds.
pub fn compile_fingerprint(dast: &crate::dast::Dast, seed: u64) -> crate::Result<String> {
    let dast = std::sync::Arc::new(dast.clone());
    let session = crate::session::Session::new(seed, false);
    let out = crate::compile::compile(&dast, &session, true)?;
    Ok(out.compiled.fingerprint())
}
