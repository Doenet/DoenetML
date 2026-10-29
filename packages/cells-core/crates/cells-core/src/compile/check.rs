//! The check (ADR 0014, ADR 0015): plan the document, build it once
//! through the probe, which stands for every count and every pick, and box
//! every element that fails until every element builds (ADR 0013). What it
//! finds is every error the document has; no later build finds another.
//! What it finds depends on the source alone, never on the seed or the
//! session, so the compile does too (`tests/compile_purity.rs`).

use super::*;
use crate::build::{self, BuildOutput};
use crate::diagnostics::Diagnostic;
use crate::session::Session;

/// What a compile returns.
pub(crate) struct CompileOutput {
    /// The compile, which every build of the document stamps.
    pub(crate) compiled: Arc<Compiled>,
    /// The first build, when it was the check: a document without repeats
    /// or selects (or one loaded without the check, in tests) is checked by
    /// its one stamped build, which draws nothing and runs the probe's loop
    /// check, and the load keeps it rather than building again.
    pub(crate) first_build: Option<BuildOutput>,
}

/// Compile `dast` (ADR 0015): plan it, check it, and box every element
/// that fails until every element builds. A document with repeats or
/// selects is checked through the probe (ADR 0012, ADR 0014), which builds
/// every option of every select; any other by its stamped build at no
/// iteration, its only build, with the probe's loop check. Either way the
/// compile finds every cycle. `check_cycles` off (a test load) skips both
/// the probe and the loop check. `session` is the load's, which only that
/// stamped build reads. The compile holds the source's diagnostics: the
/// lint findings and the boxed errors. Only a cycle, which has no element
/// to box, fails it.
///
/// It also decides how every build classes its value slots (ADR 0018,
/// `Classes`): by the probe's record when the probe runs, by the one build's
/// own walk otherwise, and all essential when `classify` is off or a test
/// load skips the probe of a document that has repeats or selects.
pub(crate) fn compile(
    dast: &Arc<Dast>,
    session: &Session,
    check_cycles: bool,
    classify: bool,
    prune: bool,
) -> Result<CompileOutput> {
    let mut list = Vec::new();
    let (mut compiled, first_build) = plan_and_check(dast, &mut list, |compiled| {
        let varies = compiled.has_repeats() || compiled.has_selects();
        if !classify || (varies && !check_cycles) {
            compiled.classes = Classes::Off;
        }
        compiled.prune = prune;
        // Without the probe, a document that varies has no record of
        // what is live: every build computes everything (ADR 0019).
        if varies && !check_cycles {
            compiled.live = Classes::Off;
        }
        if check_cycles && varies {
            let _s = crate::trace::span("probe");
            let mut probed = build::probe(compiled)?;
            compiled.set_probe(probed.probe.take());
            if let Some(record) = probed.writable_record() {
                compiled.classes = Classes::Record(Arc::new(record));
            }
            if let Some(record) = probed.live_record() {
                compiled.live = Classes::Record(Arc::new(record));
            }
            Ok(None)
        } else {
            let mut first = {
                let _s = crate::trace::span("first build");
                build::first_build(compiled, session, check_cycles)?
            };
            // With the check, the depth is 0 and there is no warning:
            // the document has no repeat. Without it (a test load) no
            // build here bounds the depth.
            compiled.set_probe(first.probe.take());
            Ok(Some(first))
        }
    })?;
    {
        let _s = crate::trace::span("lint");
        list.extend(lint::lint(dast));
    }
    // The planners' and the probe's warnings, from the compile that built.
    list.append(Arc::make_mut(&mut compiled.diagnostics));
    crate::diagnostics::sort(&mut list);
    compiled.diagnostics = Arc::new(list);
    Ok(CompileOutput {
        compiled: Arc::new(compiled),
        first_build,
    })
}

/// Every diagnostic of the document, from one build through the probe
/// (ADR 0013): one iteration per repeat, every option of every select,
/// every branch of every choice. The list is a function of the DAST alone,
/// and the same list a load reports, at any seed, count or state. For the
/// language server, which has no document to load.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let dast = Arc::new(dast.clone());
    let mut list = Vec::new();
    // The build is not wanted, but its warnings are, with the planners'.
    // A failure with no element to box is in the list already.
    if let Ok((compiled, u)) = plan_and_check(&dast, &mut list, |c| build::probe(c)) {
        list.extend(compiled.diagnostics.iter().cloned());
        list.extend(u.probe.map(|p| p.warnings).unwrap_or_default());
    }
    list.extend(lint::lint(&dast));
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
    let (compiled, u) = plan_and_check(&dast, &mut Vec::new(), |c| build::probe(c))?;
    Ok(u.signature(&compiled, rename))
}

/// The compile's loop (ADR 0013): plan `dast`, run `check` on the plan,
/// and box until it holds. The element `check` fails on, or every element
/// with an attribute nothing read while planning and checking (ADR 0021),
/// is boxed and the plan made again, each box an error in `errors`. Only
/// a failure with no element to box, a cycle, fails it, after its error
/// joins `errors` too.
fn plan_and_check<T>(
    dast: &Arc<Dast>,
    errors: &mut Vec<Diagnostic>,
    mut check: impl FnMut(&mut Compiled) -> std::result::Result<T, Failure>,
) -> Result<(Compiled, T)> {
    let mut boxed: HashSet<NodeId> = HashSet::new();
    loop {
        let planned = {
            let _s = crate::trace::span("plan");
            let planned = Compiler::compile(dast, &boxed);
            if let Ok(compiled) = &planned {
                crate::trace::count("templates", compiled.templates.len());
                crate::trace::count(
                    "elements",
                    compiled.templates.iter().map(|t| t.elems.len()).sum(),
                );
            }
            planned
        };
        let attempt = planned.and_then(|mut compiled| {
            let checked = check(&mut compiled)?;
            Ok((compiled, checked))
        });
        match attempt {
            Ok(done) => {
                let unread = unread_attributes(dast, &boxed);
                if unread.is_empty() {
                    return Ok(done);
                }
                for (node, error) in unread {
                    crate::trace::count("boxed", 1);
                    boxed.insert(node);
                    errors.push(Diagnostic::error(Some(node), &error));
                }
            }
            Err(f) => {
                crate::trace::count("boxed", 1);
                let node = f.node.filter(|n| boxed.insert(*n));
                errors.push(Diagnostic::error(node, &f.error));
                if node.is_none() {
                    return Err(f.error);
                }
            }
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
/// Reads are recorded by `Dast::attr` over the whole compile, every
/// attempt included, so a node inside a boxed element is skipped rather
/// than reported for what its planner never ran to read.
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
