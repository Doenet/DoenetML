//! The check: plan the document, build it once through the abstract
//! build, which stands for every count and every pick, and box every
//! element that fails until every element builds. It finds every error the
//! document has, from the source alone.

use super::*;
use crate::build;
use crate::diagnostics::Diagnostic;

/// What a compile returns.
pub(crate) struct CompileOutput {
    /// The compile, which every build of the document stamps.
    pub(crate) compiled: Arc<Compiled>,
}

/// Compile `dast`: plan it, check it through the abstract build, and box
/// every element that fails until every element builds. The compile holds
/// the source's diagnostics. Only a cycle, which has no element to box,
/// fails it.
///
/// For tests, `check_cycles` off skips the abstract build's loop checks,
/// and `classify` off makes every value slot essential.
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
    let (mut plans, ()) = plan_and_check(&dast, &mut list, share, |dast, plans| {
        plans.prune = prune;
        plans.fold = fold;
        let _s = crate::trace::span("abstract build");
        let findings =
            build::abstract_build(CompiledRef { dast, plans }, check_cycles)?.abstract_findings();
        plans.structural_depth = findings.structural_depth;
        plans.classes = classify.then_some(findings.writable);
        plans.live = findings.live;
        plans.counted = findings.counted;
        plans.document_constants = findings.document_constants;
        // The abstract build's warnings are the document's: no build finds
        // one the abstract build did not (ADR 0014).
        Arc::make_mut(&mut plans.diagnostics).extend(findings.warnings);
        Ok(())
    })?;
    // The planners' and the abstract build's warnings, from the compile
    // that built.
    let _s = crate::trace::span("diagnostics");
    list.append(Arc::make_mut(&mut plans.diagnostics));
    crate::diagnostics::sort(&mut list);
    plans.diagnostics = Arc::new(list);
    Ok(CompileOutput {
        compiled: Arc::new(Compiled { dast, plans }),
    })
}

/// Every diagnostic of the document, from the DAST alone: the same list a
/// load reports, at any seed, count or state.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let mut list = lint::lint(dast);
    // The build is not wanted, but its warnings are, with the planners'.
    // A failure with no element to box is in the list already.
    if let Ok((plans, findings)) = plan_and_check(dast, &mut list, true, |dast, plans| {
        Ok(build::abstract_build(CompiledRef { dast, plans }, true)?.abstract_findings())
    }) {
        list.extend(plans.diagnostics.iter().cloned());
        list.extend(findings.warnings);
    }
    crate::diagnostics::sort(&mut list);
    list
}

/// The input signature of `dast`, read off the check's definitions
/// (ADR 0035). Every key goes through `rename`. The check still builds,
/// so what emit boxes is boxed before the signature is read.
pub(crate) fn signature_renamed(
    dast: &Dast,
    rename: &dyn Fn(&str) -> String,
) -> Result<crate::build::signature::Signature> {
    let (_, (_, signature)) = plan_and_check(dast, &mut Vec::new(), true, |dast, plans| {
        build::abstract_signature(CompiledRef { dast, plans }, rename)
    })?;
    Ok(signature)
}

/// The compile's loop: plan `dast`, boxing every element that fails where
/// it fails; then run `check` on the plan. An element `check` fails on, or
/// a failure no element could carry, is boxed and the plan made again.
/// Each box is an error in `errors`. Only a failure with no element to
/// box, a cycle, fails it, after its error joins `errors` too. `share`
/// runs the sharing stage. Every stage and `check` borrow `dast`; the
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
            ..
        } = planned;
        match check(dast, &mut plans) {
            Ok(checked) => {
                crate::trace::count("boxed", boxed_here.len());
                errors.extend(boxed_here);
                return Ok((plans, checked));
            }
            Err(f) => restart(&mut boxed, errors, f)?,
        }
    }
}
