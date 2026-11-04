//! The check (ADR 0014, ADR 0015): plan the document, build it once
//! through the abstract build, which stands for every count and every pick,
//! and box every element that fails until every element builds (ADR 0013).
//! What it finds is every error the document has; no later build finds
//! another. What it finds depends on the source alone, never on the seed or
//! the session, and so does the compile: no seed reaches it.

use super::*;
use crate::build;
use crate::diagnostics::Diagnostic;

/// What a compile returns.
pub(crate) struct CompileOutput {
    /// The compile, which every build of the document stamps.
    pub(crate) compiled: Arc<Compiled>,
}

/// Compile `dast` (ADR 0015): plan it, check it through the abstract build
/// (ADR 0012, ADR 0014), which stands for every count and every pick, and
/// box every element that fails until every element builds. The abstract
/// build also records what every build of the document reads: which
/// template slots a student's action can write (ADR 0018), which are live
/// (ADR 0019), and the structural depth. The compile holds the source's
/// diagnostics: the lint findings, the boxed errors and the planners' and
/// the abstract build's warnings. Only a cycle, which has no element to
/// box, fails it.
///
/// Two test loads vary this: `check_cycles` off runs the abstract build
/// without its loop checks, so a document the check would reject loads; and
/// `classify` off makes every value slot essential (no record to read).
pub(crate) fn compile(
    dast: &Arc<Dast>,
    check_cycles: bool,
    classify: bool,
    prune: bool,
    fold: bool,
) -> Result<CompileOutput> {
    let mut list = {
        let _s = crate::trace::span("lint");
        lint::lint(dast)
    };
    let (mut compiled, ()) = plan_and_check(dast, &mut list, |compiled| {
        compiled.prune = prune;
        compiled.fold = fold;
        let _s = crate::trace::span("abstract build");
        let findings = build::abstract_build(compiled, check_cycles)?.abstract_findings();
        compiled.structural_depth = findings.structural_depth;
        compiled.classes = classify.then(|| Arc::new(findings.writable));
        compiled.live = Arc::new(findings.live);
        compiled.counted = Arc::new(findings.counted);
        compiled.document_constants = Arc::new(findings.document_constants);
        // The abstract build's warnings are the document's: no build finds
        // one the abstract build did not (ADR 0014).
        Arc::make_mut(&mut compiled.diagnostics).extend(findings.warnings);
        Ok(())
    })?;
    // The planners' and the abstract build's warnings, from the compile
    // that built.
    let _s = crate::trace::span("diagnostics");
    list.append(Arc::make_mut(&mut compiled.diagnostics));
    crate::diagnostics::sort(&mut list);
    compiled.diagnostics = Arc::new(list);
    Ok(CompileOutput {
        compiled: Arc::new(compiled),
    })
}

/// Every diagnostic of the document, from one build through the abstract
/// build (ADR 0013): one iteration per repeat, every option of every
/// select, every branch of every choice. The list is a function of the DAST
/// alone, and the same list a load reports, at any seed, count or state.
/// For the language server, which has no document to load.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let dast = Arc::new(dast.clone());
    let mut list = lint::lint(&dast);
    // The build is not wanted, but its warnings are, with the planners'.
    // A failure with no element to box is in the list already.
    if let Ok((compiled, findings)) = plan_and_check(&dast, &mut list, |c| {
        Ok(build::abstract_build(c, true)?.abstract_findings())
    }) {
        list.extend(compiled.diagnostics.iter().cloned());
        list.extend(findings.warnings);
    }
    crate::diagnostics::sort(&mut list);
    list
}

/// The input signature of `dast` (ADR 0017, step 3), from the check's
/// build. Every key goes through `rename`.
pub(crate) fn signature_renamed(
    dast: &Dast,
    rename: &dyn Fn(&str) -> String,
) -> Result<crate::build::signature::Signature> {
    let dast = Arc::new(dast.clone());
    let (compiled, u) = plan_and_check(&dast, &mut Vec::new(), |c| build::abstract_build(c, true))?;
    Ok(u.signature(&compiled, rename))
}

/// The compile's loop (ADR 0013, ADR 0027, ADR 0030): plan `dast`,
/// boxing every element that fails where it fails, an element with an
/// attribute nothing read among them (ADR 0021) and the readers of every
/// box (ADR 0032); then run `check` on the plan. An element `check` fails
/// on, or a failure no element could carry, is boxed and the plan made
/// again.
/// Each box is an error in `errors`. Only a failure with no element to
/// box, a cycle, fails it, after its error joins `errors` too.
fn plan_and_check<T>(
    dast: &Arc<Dast>,
    errors: &mut Vec<Diagnostic>,
    mut check: impl FnMut(&mut Compiled) -> std::result::Result<T, Failure>,
) -> Result<(Compiled, T)> {
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
            let planned = Compiler::compile(dast, &boxed);
            if let Ok(p) = &planned {
                crate::trace::count("templates", p.compiled.templates.len());
                crate::trace::count(
                    "elements",
                    p.compiled.templates.iter().map(|t| t.elems.len()).sum(),
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
            mut compiled,
            errors: boxed_here,
            ..
        } = planned;
        match check(&mut compiled) {
            Ok(checked) => {
                crate::trace::count("boxed", boxed_here.len());
                errors.extend(boxed_here);
                return Ok((compiled, checked));
            }
            Err(f) => restart(&mut boxed, errors, f)?,
        }
    }
}
