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
    /// How long the probe took.
    pub(crate) check_time: std::time::Duration,
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
) -> Result<CompileOutput> {
    let profile = crate::profile::enabled();
    let mut list = Vec::new();
    let mut boxed: HashSet<NodeId> = HashSet::new();
    let (mut compiled, check_time) = loop {
        let clock = web_time::Instant::now();
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
            if profile {
                eprintln!("  compile/plan: {:.2?}", clock.elapsed());
            }
            compiled.prune = prune;
            let clock = web_time::Instant::now();
            let _s = crate::trace::span("probe");
            let probed = build::probe(&compiled, check_cycles)?.probed();
            compiled.structural_depth = probed.structural_depth;
            compiled.classes = classify.then(|| Arc::new(probed.writable));
            compiled.live = Arc::new(probed.live);
            // The probe's warnings are the document's: no build finds one
            // the probe did not (ADR 0014).
            compiled.diagnostics.extend(probed.warnings);
            let checked = clock.elapsed();
            if profile {
                eprintln!("  compile/check: {checked:.2?}");
            }
            Ok((compiled, checked))
        });
        match attempt {
            Ok(done) => break done,
            Err(f) => {
                crate::trace::count("boxed", 1);
                let node = f.node.filter(|n| boxed.insert(*n));
                list.push(Diagnostic::error(node, &f.error));
                if node.is_none() {
                    return Err(f.error);
                }
            }
        }
    };
    {
        let _s = crate::trace::span("lint");
        list.extend(lint::lint(dast));
    }
    // The planners' and the probe's warnings, from the compile that built.
    list.append(&mut compiled.diagnostics);
    crate::diagnostics::sort(&mut list);
    compiled.diagnostics = list;
    Ok(CompileOutput {
        compiled: Arc::new(compiled),
        check_time,
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
    let mut boxed: HashSet<NodeId> = HashSet::new();
    loop {
        let attempt = Compiler::compile(&dast, &boxed).and_then(|compiled| {
            Ok((
                build::probe(&compiled, true)?.probed(),
                compiled.diagnostics,
            ))
        });
        match attempt {
            // The build is not wanted, but its warnings are, with the
            // planners'.
            Ok((u, planner_warnings)) => {
                list.extend(planner_warnings);
                list.extend(u.warnings);
                break;
            }
            Err(f) => {
                let node = f.node.filter(|n| boxed.insert(*n));
                list.push(Diagnostic::error(node, &f.error));
                if node.is_none() {
                    break;
                }
            }
        }
    }
    list.extend(lint::lint(&dast));
    crate::diagnostics::sort(&mut list);
    list
}
