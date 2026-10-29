//! The per-phase profile: a load's or a rebuild's spans (`crate::trace`)
//! printed to stderr when `CELLS_BUILD_PROFILE` is set, for finding where
//! the time goes from a terminal.

use crate::trace::Span;

/// Whether `CELLS_BUILD_PROFILE` is set. Read once, on first use.
pub(crate) fn enabled() -> bool {
    static PROFILE: std::sync::OnceLock<bool> = std::sync::OnceLock::new();
    *PROFILE.get_or_init(|| std::env::var_os("CELLS_BUILD_PROFILE").is_some())
}

/// Print `spans` to stderr, one per line, indented by depth, with the
/// work each counted, when the profile is enabled.
pub(crate) fn dump(spans: &[Span]) {
    if !enabled() {
        return;
    }
    for s in spans {
        let indent = "  ".repeat(s.depth as usize);
        let counts: Vec<String> = s.counts.iter().map(|(k, v)| format!("{k}={v}")).collect();
        eprintln!(
            "{indent}{}: {:.2?}{}{}",
            s.name,
            s.duration,
            if counts.is_empty() { "" } else { "  " },
            counts.join(" ")
        );
    }
}
