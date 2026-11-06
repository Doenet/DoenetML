//! The check: plan the document, resolve it once through the abstract
//! build, which stands for every count and every pick, then stamp its
//! template graph (ADR 0032, step 8), check that for loops at any count
//! (ADR 0012), define it and walk it (ADR 0018, ADR 0019, ADR 0035), and
//! box every element that fails until every element builds. It finds every
//! error the document has, from the source alone.

use super::*;
use crate::build;
use crate::diagnostics::Diagnostic;
use graph::CycleFindings;

/// What a compile returns.
pub(crate) struct CompileOutput {
    /// The compile, which every build of the document stamps.
    pub(crate) compiled: Arc<Compiled>,
}

/// Compile `dast`: plan it, check it (`check`), and box
/// every element that fails until every element builds. The compile holds
/// the source's diagnostics. Only a cycle, which has no element to box,
/// fails it.
///
/// For tests, `check_cycles` off skips the cycle and count checks, and
/// with them the structural depth, and `classify` off makes every port
/// writable, so every value slot is essential.
pub(crate) fn compile(
    dast: Dast,
    check_cycles: bool,
    classify: bool,
    prune: bool,
    fold: bool,
    share: bool,
) -> Result<CompileOutput> {
    let mut list = {
        let _s = crate::trace::span("lint");
        lint::lint(&dast)
    };
    let (plans, warnings) = plan_and_check(&dast, &mut list, share, |dast, plans| {
        plans.prune = prune;
        plans.fold = fold;
        let _s = crate::trace::span("abstract build");
        let found = check(CompiledRef { dast, plans }, check_cycles)?;
        plans.structural_depth = found.structural_depth;
        for (tpl, mut attrs) in plans.templates.iter_mut().zip(found.attrs) {
            if !classify {
                for a in &mut attrs {
                    *a |= PortAttrs::WRITABLE;
                }
            }
            tpl.checked = Checked { attrs };
        }
        Ok(found.warnings)
    })?;
    // The check's warnings are the document's: no build finds one the
    // check did not (ADR 0014). With them, the lint findings,
    // the boxes' errors and the planners' warnings, which the loop added.
    let _s = crate::trace::span("diagnostics");
    list.extend(warnings);
    crate::diagnostics::sort(&mut list);
    Ok(CompileOutput {
        compiled: Arc::new(Compiled {
            dast,
            plans,
            diagnostics: Arc::new(list),
        }),
    })
}

/// Every diagnostic of the document, from the DAST alone: the same list a
/// load reports, at any seed, count or state.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let mut list = lint::lint(dast);
    // The build is not wanted, but its warnings are, with the planners'.
    // A failure with no element to box is in the list already.
    if let Ok((_, warnings)) = plan_and_check(dast, &mut list, true, |dast, plans| {
        check(CompiledRef { dast, plans }, true).map(|found| found.warnings)
    }) {
        list.extend(warnings);
    }
    crate::diagnostics::sort(&mut list);
    list
}

/// The input signature of `dast`, read off the check's definitions
/// (ADR 0035). Every key goes through `rename`.
pub(crate) fn signature_renamed(
    dast: &Dast,
    rename: &dyn Fn(&str) -> String,
) -> Result<crate::build::signature::Signature> {
    let (_, signature) = plan_and_check(dast, &mut Vec::new(), true, |dast, plans| {
        let compiled = CompiledRef { dast, plans };
        build::abstract_signature(compiled, || cycle_check(compiled).map(drop), rename)
    })?;
    Ok(signature)
}

/// What the check finds of a document that passes it.
struct Checks {
    /// The structural depth: 0 with the cycle check off.
    structural_depth: u32,
    /// Each port's attributes, per template by template slot.
    attrs: Vec<Vec<PortAttrs>>,
    /// The repeats' counts' warnings and the refuse warnings.
    warnings: Vec<Diagnostic>,
}

/// The check of `compiled`: resolved through the abstract build, for an
/// element that cannot be built; then its template graph, checked for
/// loops at any count with `check_cycles` (a cycle has no element to box),
/// defined, which boxes a prefill the rule refuses, and walked, which
/// gives each port's attributes, and the refuse analysis's warnings.
fn check(compiled: CompiledRef<'_>, check_cycles: bool) -> std::result::Result<Checks, Failure> {
    build::abstract_resolve(compiled)?;
    let mut g = crate::trace::span("template graph").run(|| graph::template_graph(compiled));
    let cycles = if check_cycles {
        let _s = crate::trace::span("cycle check");
        graph::check_cycles(&g, compiled).map_err(|error| Failure { error, node: None })?
    } else {
        CycleFindings::default()
    };
    let defined = crate::trace::span("define").run(|| graph::define(&mut g, compiled))?;
    let attrs = defined.attrs(&g, compiled);
    let mut warnings = cycles.warnings;
    warnings.extend(graph::refuse_warnings(&g, &defined, compiled));
    Ok(Checks {
        structural_depth: cycles.structural_depth,
        attrs,
        warnings,
    })
}

/// The cycle and count checks over the template graph of `compiled`, and
/// what they find of a document that passes: what the input signature's
/// abstract build runs between its resolve and its define. A cycle has no
/// element to box.
fn cycle_check(compiled: CompiledRef<'_>) -> std::result::Result<CycleFindings, Failure> {
    let _s = crate::trace::span("cycle check");
    let g = crate::trace::span("template graph").run(|| graph::template_graph(compiled));
    graph::check_cycles(&g, compiled).map_err(|error| Failure { error, node: None })
}

/// The compile's loop: plan `dast`, boxing every element that fails where
/// it fails; then run `check` on the plan. An element `check` fails on, or
/// a failure no element could carry, is boxed and the plan made again.
/// Each box is an error in `errors`, and the planners' warnings of the
/// plan that checked join them. Only a failure with no element to box, a
/// cycle, fails it, after its error joins `errors` too. `share` runs the
/// sharing stage. Every stage and `check` borrow `dast`; the
/// loop returns the plans that checked, made from it.
fn plan_and_check<T>(
    dast: &Dast,
    errors: &mut Vec<Diagnostic>,
    share: bool,
    mut check: impl FnMut(&Dast, &mut Plans) -> std::result::Result<T, Failure>,
) -> Result<(Plans, T)> {
    let mut boxed: HashSet<NodeId> = HashSet::new();
    // Box what `f` names, or fail with it when it names nothing.
    let restart = |boxed: &mut HashSet<NodeId>, errors: &mut Vec<Diagnostic>, f: Failure| {
        crate::trace::count("boxed", 1);
        let node = f.node.filter(|n| boxed.insert(*n));
        errors.push(Diagnostic::error(node, &f.error));
        match node {
            Some(_) => Ok(()),
            None => Err(f.error),
        }
    };
    loop {
        let planned = {
            let _s = crate::trace::span("plan");
            let planned = Compiler::compile(dast, &boxed, share);
            if let Ok(p) = &planned {
                crate::trace::count("templates", p.plans.templates.len());
                crate::trace::count(
                    "elements",
                    p.plans.templates.iter().map(|t| t.elems.len()).sum(),
                );
            }
            planned
        };
        let planned = match planned {
            Ok(p) => p,
            Err(f) => {
                restart(&mut boxed, errors, f)?;
                continue;
            }
        };
        let Attempt {
            mut plans,
            errors: boxed_here,
            warnings,
        } = planned;
        match check(dast, &mut plans) {
            Ok(checked) => {
                crate::trace::count("boxed", boxed_here.len());
                errors.extend(boxed_here);
                errors.extend(warnings);
                return Ok((plans, checked));
            }
            Err(f) => restart(&mut boxed, errors, f)?,
        }
    }
}

/// For tests: compile `dast` as a load does, and at every attempt of the
/// compile's loop run define over the template graph beside the abstract
/// build's define (ADR 0032, step 8, part 4). Each attempt whose resolve
/// and cycle check pass must end the same way in both: defined, or
/// failing on the same element with the same error (the prefill rule).
/// Returns the attempts where they differ, described.
#[cfg(feature = "testing")]
pub(crate) fn define_failures_agree(dast: &Dast) -> Vec<String> {
    let mut differ = Vec::new();
    let _ = plan_and_check(dast, &mut Vec::new(), true, |dast, plans| {
        let compiled = CompiledRef { dast, plans };
        let mut ours = None;
        let found = build::abstract_define(compiled, || {
            cycle_check(compiled)?;
            let mut g = graph::template_graph(compiled);
            ours = Some(graph::define(&mut g, compiled).map(drop));
            Ok(())
        });
        if let Some(ours) = ours {
            let describe = |r: std::result::Result<(), &Failure>| match r {
                Ok(()) => "defined".to_string(),
                Err(f) => format!("{:?}: {}", f.node, f.error),
            };
            let (theirs, ours) = (
                describe(found.as_ref().map(|_| ())),
                describe(ours.as_ref().map(|_| ())),
            );
            if theirs != ours {
                differ.push(format!(
                    "the abstract build: {theirs}; define over the graph: {ours}"
                ));
            }
        }
        found
    });
    differ
}
