//! The check, the compile's last stage: stamp the plans' template graph
//! (ADR 0032, step 8), which stands for every count and every pick and
//! fails on an element that cannot be built, check that for loops at any
//! count (ADR 0012), define it and walk it (ADR 0018, ADR 0019, ADR 0035),
//! and find what no tick changes and check every load-time choice over it
//! (ADR 0037). What it fails on, the driver boxes and compiles again.

use crate::compile::*;
use graph::CycleFindings;

/// What the check finds of a document that passes it.
pub(in crate::compile) struct Checks {
    /// The structural depth: 0 with the cycle check off.
    pub(in crate::compile) structural_depth: u32,
    /// Each port's attributes, per template by template slot.
    pub(in crate::compile) attrs: Vec<Vec<PortAttrs>>,
    /// Each select's `numToSelect`, by choice (ADR 0037).
    pub(in crate::compile) picks: Vec<(ChoiceId, u32)>,
    /// The repeats' counts' warnings and the refuse warnings.
    pub(in crate::compile) warnings: Vec<Diagnostic>,
}

/// The check of `compiled`: its template graph, whose stamping fails on an
/// element that cannot be built; checked for loops at any count with
/// `check_cycles` (a cycle has no element to box), defined, which boxes a
/// prefill the rule refuses, and walked, which gives each port's
/// attributes, and the refuse analysis's warnings.
pub(in crate::compile) fn check(
    compiled: CompiledRef<'_>,
    check_cycles: bool,
) -> std::result::Result<Checks, Failure> {
    let mut g =
        crate::trace::span("template graph").run(|| graph::template_graph_checked(compiled))?;
    let cycles = if check_cycles {
        let _s = crate::trace::span("cycle check");
        graph::check_cycles(&g, compiled).map_err(|error| Failure { error, node: None })?
    } else {
        CycleFindings::default()
    };
    let defined = crate::trace::span("define").run(|| graph::define(&mut g, compiled))?;
    // What no tick changes, and every load-time choice over it (ADR 0037).
    let (constant, picks) = crate::trace::span("constants").run(|| {
        let mut constants = graph::Constants::new(&g, &defined, compiled);
        let picks = graph::check_choices(&g, &mut constants, compiled)?;
        Ok::<_, Failure>((constants.constants(), picks))
    })?;
    let attrs = defined.attrs(&g, compiled, &constant);
    let mut warnings = cycles.warnings;
    warnings.extend(graph::refuse_warnings(&g, &defined, compiled));
    Ok(Checks {
        structural_depth: cycles.structural_depth,
        attrs,
        picks,
        warnings,
    })
}
