//! The check: plan the document, then stamp its template graph (ADR 0032,
//! step 8), which stands for every count and every pick and fails on an
//! element that cannot be built, check that for loops at any count
//! (ADR 0012), define it and walk it (ADR 0018, ADR 0019, ADR 0035), find
//! what no tick changes and check every load-time choice over it (ADR
//! 0037), and box every element that fails until every element builds. It finds every
//! error the document has, from the source alone.

use super::*;
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
        let _s = crate::trace::span("check");
        let found = check(CompiledRef { dast, plans }, check_cycles)?;
        plans.structural_depth = found.structural_depth;
        let mut picks: Vec<Vec<(ElemId, u32)>> = vec![Vec::new(); plans.templates.len()];
        for &(cid, n) in &found.picks {
            let (t, e) = plans.choices[cid.index()].at;
            picks[t.index()].push((e, n));
        }
        for ((tpl, mut attrs), picks) in plans.templates.iter_mut().zip(found.attrs).zip(picks) {
            if !classify {
                for a in &mut attrs {
                    *a |= PortAttrs::WRITABLE;
                }
            }
            tpl.checked = Checked { attrs, picks };
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

/// The input signature of `dast`, read off the template graph's
/// definitions (ADR 0032 step 8, ADR 0035), after the check's resolve,
/// cycle check and define. Every key goes through `rename`.
pub(crate) fn signature_renamed(
    dast: &Dast,
    rename: &dyn Fn(&str) -> String,
) -> Result<crate::build::signature::Signature> {
    let (_, signature) = plan_and_check(dast, &mut Vec::new(), true, |dast, plans| {
        let compiled = CompiledRef { dast, plans };
        let mut g = graph::template_graph_with_parents(compiled)?;
        graph::check_cycles(&g, compiled).map_err(|error| Failure { error, node: None })?;
        let defined = graph::define(&mut g, compiled)?;
        let mut constants = graph::Constants::new(&g, &defined, compiled);
        let picks = graph::check_choices(&g, &mut constants, compiled)?;
        Ok(graph::sign(&g, &defined, compiled, &picks, rename))
    })?;
    Ok(signature)
}

/// Each constant port's range as the check's evaluator finds it (ADR
/// 0037), by template and template slot, for a compile that checked.
#[cfg(feature = "testing")]
pub(crate) fn constant_ranges(
    compiled: CompiledRef<'_>,
) -> Vec<(TemplateId, TemplateSlot, crate::program::Range)> {
    let checked = |f: Failure| -> ! { panic!("a compile that checked failed: {}", f.error) };
    let mut g = graph::template_graph_checked(compiled).unwrap_or_else(|f| checked(f));
    let defined = graph::define(&mut g, compiled).unwrap_or_else(|f| checked(f));
    graph::Constants::new(&g, &defined, compiled).port_ranges()
}

/// What the check finds of a document that passes it.
struct Checks {
    /// The structural depth: 0 with the cycle check off.
    structural_depth: u32,
    /// Each port's attributes, per template by template slot.
    attrs: Vec<Vec<PortAttrs>>,
    /// Each select's `numToSelect`, by choice (ADR 0037).
    picks: Vec<(ChoiceId, u32)>,
    /// The repeats' counts' warnings and the refuse warnings.
    warnings: Vec<Diagnostic>,
}

/// The check of `compiled`: its template graph, whose stamping fails on an
/// element that cannot be built; checked for loops at any count with
/// `check_cycles` (a cycle has no element to box), defined, which boxes a
/// prefill the rule refuses, and walked, which gives each port's
/// attributes, and the refuse analysis's warnings.
fn check(compiled: CompiledRef<'_>, check_cycles: bool) -> std::result::Result<Checks, Failure> {
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
