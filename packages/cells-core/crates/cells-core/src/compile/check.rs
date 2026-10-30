//! The check (ADR 0014, ADR 0015): plan the document, build it once
//! through the probe, which stands for every count and every pick, and box
//! every element that fails until every element builds (ADR 0013). What it
//! finds is every error the document has; no later build finds another.
//! What it finds depends on the source alone, never on the seed or the
//! session, and so does the compile: no seed reaches it.

use super::*;
use crate::build;
use crate::diagnostics::Diagnostic;

/// What a compile returns.
pub(crate) struct CompileOutput {
    /// The compile, which every build of the document stamps.
    pub(crate) compiled: Arc<Compiled>,
}

/// Compile `dast` (ADR 0015): plan it, check it through the probe (ADR
/// 0012, ADR 0014), which stands for every count and every pick, and box
/// every element that fails until every element builds. The probe also
/// records what every build of the document reads: which template slots
/// a student's action can write (ADR 0018), which are live (ADR 0019),
/// and the structural depth. The compile holds the source's diagnostics:
/// the lint findings, the boxed errors and the planners' and the probe's
/// warnings. Only a cycle, which has no element to box, fails it.
///
/// Two test loads vary this: `check_cycles` off runs the probe without
/// its loop checks, so a document the check would reject loads; and
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
        let _s = crate::trace::span("probe");
        let probed = build::probe(compiled, check_cycles)?.probed();
        compiled.structural_depth = probed.structural_depth;
        compiled.classes = classify.then(|| Arc::new(probed.writable));
        compiled.live = Arc::new(probed.live);
        compiled.counted = Arc::new(probed.counted);
        compiled.document_constants = Arc::new(probed.document_constants);
        // The probe's warnings are the document's: no build finds one
        // the probe did not (ADR 0014).
        Arc::make_mut(&mut compiled.diagnostics).extend(probed.warnings);
        Ok(())
    })?;
    // The planners' and the probe's warnings, from the compile that built.
    list.append(Arc::make_mut(&mut compiled.diagnostics));
    crate::diagnostics::sort(&mut list);
    compiled.diagnostics = Arc::new(list);
    Ok(CompileOutput {
        compiled: Arc::new(compiled),
    })
}

/// Every diagnostic of the document, from one build through the probe
/// (ADR 0013): one iteration per repeat, every option of every select,
/// every branch of every choice. The list is a function of the DAST alone,
/// and the same list a load reports, at any seed, count or state. For the
/// language server, which has no document to load.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let dast = Arc::new(dast.clone());
    let mut list = lint::lint(&dast);
    // The build is not wanted, but its warnings are, with the planners'.
    // A failure with no element to box is in the list already.
    if let Ok((compiled, probed)) =
        plan_and_check(&dast, &mut list, |c| Ok(build::probe(c, true)?.probed()))
    {
        list.extend(compiled.diagnostics.iter().cloned());
        list.extend(probed.warnings);
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
    let (compiled, u) = plan_and_check(&dast, &mut Vec::new(), |c| build::probe(c, true))?;
    Ok(u.signature(&compiled, rename))
}

/// The compile's loop (ADR 0013, ADR 0027): plan `dast`, boxing every
/// element that fails where it fails; refuse every element with an
/// attribute nothing read while planning (ADR 0021), which needs a second
/// plan; then run `check` on the plan. An element `check` fails on, or
/// one planning could not box in place, is boxed and the plan made again.
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
        // Every attribute the compile reads has been read once pass 3 is
        // done: a build reads none (ADR 0027).
        let mut outside: HashSet<NodeId> = boxed.clone();
        outside.extend(planned.boxed.iter().copied());
        let unread = unread_attributes(dast, &outside);
        if !unread.is_empty() {
            for (node, error) in unread {
                crate::trace::count("boxed", 1);
                boxed.insert(node);
                errors.push(Diagnostic::error(Some(node), &error));
            }
            continue;
        }
        let Planned {
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

/// The elements, outside every boxed element, with an attribute nothing
/// read while the document was planned and checked, each with the error
/// for its first such attribute. An attribute the core never looks up
/// would be ignored, and an author's attribute that does nothing is a
/// silent wrong answer (ADR 0016, "no silent NaN"), so the element is
/// refused and boxed (ADR 0013). Attributes a renderer reads from the
/// literal attributes are accepted (`PRESENTATION_ATTRS` and the type's
/// `presentation`), and so is anything in an element the normalizer made
/// (a tag starting with `_`).
/// Reads are recorded by `Dast::attr` over the whole compile; a node
/// inside a boxed element is skipped rather than reported for what its
/// planner never ran to read.
fn unread_attributes(dast: &Dast, boxed: &HashSet<NodeId>) -> Vec<(NodeId, Error)> {
    let presentation = |tag: &str, name: &str| {
        let of_type = ComponentType::from_tag(tag).map_or(&[][..], |k| k.def().presentation);
        crate::components::PRESENTATION_ATTRS
            .iter()
            .chain(of_type)
            .any(|p| p.eq_ignore_ascii_case(name))
    };
    let mut out = Vec::new();
    let mut stack = vec![Dast::ROOT];
    while let Some(n) = stack.pop() {
        if boxed.contains(&n) {
            continue;
        }
        if dast.kind(n) == NodeKind::Element {
            let tag = dast.str(n);
            // The normalizer's own elements (`_repeatSetup`) and what they
            // hold are the sugar's, not the author's.
            if tag.starts_with('_') {
                continue;
            }
            let unread = dast
                .attrs(n)
                .find(|&a| !dast.attr_read(a) && !presentation(tag, dast.attr_name(a)));
            if let Some(a) = unread {
                out.push((
                    n,
                    Error::UnsupportedAttribute {
                        tag: dast.str(n).to_string(),
                        attr: dast.attr_name(a).to_string(),
                    },
                ));
                continue;
            }
        }
        stack.extend(dast.children(n).iter().rev().copied());
    }
    out
}
