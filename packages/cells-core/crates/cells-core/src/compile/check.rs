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
    /// or selects (or one loaded without the cycle check) is checked by its
    /// one stamped build, which draws nothing, and the load keeps it rather
    /// than building again.
    pub(crate) first_build: Option<BuildOutput>,
    /// How long the probe took; zero when it did not run.
    pub(crate) check_time: std::time::Duration,
}

/// Compile `dast` (ADR 0015): plan it, check it, and box every element
/// that fails until every element builds. With `check_cycles`, a document
/// with repeats or selects is checked through the probe (ADR 0012, ADR
/// 0014), which builds every option of every select; otherwise its stamped
/// build at no iteration is the check. `session` is the load's, which only
/// that stamped build reads. The compile holds the
/// source's diagnostics: the lint findings and the boxed errors. Only a
/// cycle, which has no element to box, fails it.
pub(crate) fn compile(
    dast: &Arc<Dast>,
    session: &Session,
    check_cycles: bool,
) -> Result<CompileOutput> {
    let profile = crate::profile::enabled();
    let mut list = Vec::new();
    let mut boxed: HashSet<NodeId> = HashSet::new();
    let (mut compiled, first_build, check_time) = loop {
        let clock = web_time::Instant::now();
        let attempt = Compiler::compile(dast, &boxed).and_then(|compiled| {
            if profile {
                eprintln!("  compile/plan: {:.2?}", clock.elapsed());
            }
            if check_cycles && (compiled.has_repeats() || compiled.has_selects()) {
                let clock = web_time::Instant::now();
                build::probe(&compiled)?;
                let checked = clock.elapsed();
                if profile {
                    eprintln!("  compile/check: {checked:.2?}");
                }
                Ok((compiled, None, checked))
            } else {
                let first = build::first_build(&compiled, session)?;
                Ok((compiled, Some(first), std::time::Duration::ZERO))
            }
        });
        match attempt {
            Ok(done) => break done,
            Err(f) => {
                let node = f.node.filter(|n| boxed.insert(*n));
                list.push(Diagnostic::error(node, &f.error));
                if node.is_none() {
                    return Err(f.error);
                }
            }
        }
    };
    list.extend(lint::lint(dast));
    crate::diagnostics::sort(&mut list);
    compiled.diagnostics = list;
    let first_build = first_build.map(|mut u| {
        u.add_compile_diagnostics(&compiled);
        u
    });
    Ok(CompileOutput {
        compiled: Arc::new(compiled),
        first_build,
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
        let attempt = Compiler::compile(&dast, &boxed).and_then(|compiled| build::probe(&compiled));
        match attempt {
            // The build is not wanted, but its warnings are.
            Ok(u) => {
                list.extend(u.warnings());
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
