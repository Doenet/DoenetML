//! Per-phase timings on stderr, for finding where a load or a rebuild
//! spends its time; read by both stages, so it belongs to neither.

/// Whether `CELLS_BUILD_PROFILE` is set. Read once, on first use.
pub(crate) fn enabled() -> bool {
    static PROFILE: std::sync::OnceLock<bool> = std::sync::OnceLock::new();
    *PROFILE.get_or_init(|| std::env::var_os("CELLS_BUILD_PROFILE").is_some())
}
