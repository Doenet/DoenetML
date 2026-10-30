//! Loading a document and rebuilding it: build, schedule and compute until
//! every repeat's iteration count matches its `count` cell (ADR 0004).

use super::*;
use crate::compile::Compiled;
use crate::trace::Span;

/// How to load a document. The default: seed 0, curves compiled, cycles
/// checked at every count.
#[derive(Debug, Clone, Copy)]
pub struct LoadOptions {
    /// The document seed load-time choices draw from (ADR 0009): one seed
    /// gives one variant of the document.
    pub seed: u64,
    /// Sample curves through the engine instead of tapes compiled at build
    /// time; for checking the tapes and for measuring. Only with the
    /// `testing` feature.
    #[cfg(feature = "testing")]
    pub sample_with_engine: bool,
    /// Skip the compile's check, so a document that should be rejected
    /// loads: for tests of what the check prevents and for measuring what
    /// it costs. Only with the `testing` feature; a real load always checks
    /// (ADR 0014).
    #[cfg(feature = "testing")]
    pub check_cycles: bool,
    /// Class every value slot by whether a student's action can write it,
    /// essential or constant (ADR 0018); off, every one is essential, as
    /// before. Only with the `testing` feature: for a test of the
    /// machinery whose document no input reaches, and to check the
    /// classing against the inverses (`tests/every_count.rs`).
    #[cfg(feature = "testing")]
    pub classify: bool,
    /// Give a slot no output reads no cell (ADR 0019): on by default. Off,
    /// every prop of every component is computed, for a reader that reads
    /// any of them, as the JavaScript worker's parity harness and the
    /// golden diff do; `Document::is_live` still says which are needed.
    pub prune: bool,
}

impl LoadOptions {
    /// Whether the compile's check runs: always, outside tests.
    fn checks(&self) -> bool {
        #[cfg(feature = "testing")]
        return self.check_cycles;
        #[cfg(not(feature = "testing"))]
        return true;
    }

    /// Whether builds class value slots by the walk: always, outside tests.
    fn classifies(&self) -> bool {
        #[cfg(feature = "testing")]
        return self.classify;
        #[cfg(not(feature = "testing"))]
        return true;
    }
}

// Derivable without the `testing` feature, but `check_cycles` defaults on.
#[cfg_attr(not(feature = "testing"), allow(clippy::derivable_impls))]
impl Default for LoadOptions {
    fn default() -> Self {
        LoadOptions {
            seed: 0,
            #[cfg(feature = "testing")]
            sample_with_engine: false,
            #[cfg(feature = "testing")]
            check_cycles: true,
            #[cfg(feature = "testing")]
            classify: true,
            prune: true,
        }
    }
}

/// What a load took: its spans (`crate::trace`), and the stage timings
/// read off them.
#[derive(Debug, Clone, Default)]
pub struct LoadTimings {
    /// Every span the load recorded, in opening order: `load`, then
    /// `deserialize`, `compile` (with the plan, the probe or the first
    /// build, and the lint), and per pass `build`, `schedule` and `compute`.
    pub spans: Vec<Span>,
    pub deserialize: Duration,
    /// The compile, its check included, and every build pass after it.
    pub build: Duration,
    pub schedule: Duration,
    pub initial_compute: Duration,
    /// The load check, part of `build`: the probe build that stands for
    /// every count and pick, which finds the document's cycles (ADR 0012)
    /// and its errors (ADR 0014). Only a document with repeats or
    /// selects runs it.
    pub cycle_check: Duration,
    /// Build passes until repeat counts settled (1 without repeats).
    pub passes: u32,
    /// The document's structural depth (`CONTEXT.md`), as the compile's
    /// check bounded it (0 when a test load skipped the check).
    pub structural_depth: u32,
}

impl LoadTimings {
    fn of(spans: Vec<Span>, structural_depth: u32) -> Self {
        let total = |name: &str| {
            spans
                .iter()
                .filter(|s| s.name == name)
                .map(|s| s.duration)
                .sum()
        };
        LoadTimings {
            deserialize: total("deserialize"),
            build: total("compile") + total("build"),
            schedule: total("schedule"),
            initial_compute: total("compute"),
            cycle_check: total("probe"),
            passes: spans.iter().filter(|s| s.name == "schedule").count() as u32,
            structural_depth,
            spans,
        }
    }
}

/// The bytes of either wire format (JSON or binary), detected by content,
/// read into a DAST.
fn deserialize(bytes: &[u8]) -> crate::Result<Arc<Dast>> {
    let _s = crate::trace::span("deserialize");
    crate::trace::count("bytes", bytes.len());
    let dast = Arc::new(crate::dast::load(bytes)?);
    crate::trace::count("dast_nodes", dast.len());
    Ok(dast)
}

impl Document {
    /// Load from either wire format (JSON or binary), detected by content,
    /// with the default options.
    pub fn from_bytes(bytes: &[u8]) -> crate::Result<Document> {
        Ok(Self::load(bytes, LoadOptions::default())?.0)
    }

    /// Load from either wire format, timing each stage. Build, schedule and
    /// compute repeat until every repeat's iteration count matches its
    /// `count` cell; the timings sum over passes.
    pub fn load(bytes: &[u8], options: LoadOptions) -> crate::Result<(Document, LoadTimings)> {
        Self::load_with(options, || deserialize(bytes))
    }

    /// `load` taking the wire-format bytes, which it frees once the DAST is
    /// read, before the compile and the first build: in wasm the heap's
    /// high-water mark is what a page keeps, and the bytes are often the
    /// largest single block of a load.
    pub fn load_owned(
        bytes: Vec<u8>,
        options: LoadOptions,
    ) -> crate::Result<(Document, LoadTimings)> {
        Self::load_with(options, move || {
            let dast = deserialize(&bytes)?;
            drop(bytes);
            Ok(dast)
        })
    }

    /// `load` from a deserialized DAST.
    pub fn load_dast(
        dast: Arc<Dast>,
        options: LoadOptions,
    ) -> crate::Result<(Document, LoadTimings)> {
        Self::load_with(options, || Ok(dast))
    }

    /// A load, recording its spans (`crate::trace`), which it owns: the
    /// DAST from `dast`, then compile, then build until the structure
    /// settles (ADR 0015).
    fn load_with(
        options: LoadOptions,
        dast: impl FnOnce() -> crate::Result<Arc<Dast>>,
    ) -> crate::Result<(Document, LoadTimings)> {
        crate::trace::start();
        let loaded = (|| {
            let _s = crate::trace::span("load");
            Self::settle_load(dast()?, options)
        })();
        let spans = crate::trace::finish();
        crate::profile::dump(&spans);
        let (doc, depth) = loaded?;
        Ok((doc, LoadTimings::of(spans, depth)))
    }

    /// Compile, then build until the structure settles (ADR 0015); with
    /// the document, its structural depth as the check bounded it.
    fn settle_load(dast: Arc<Dast>, options: LoadOptions) -> crate::Result<(Document, u32)> {
        let session = Session {
            #[cfg(feature = "testing")]
            sample_with_engine: options.sample_with_engine,
            ..Session::new(options.seed)
        };
        // Compile once (ADR 0015); every pass is a build of that compile.
        let crate::compile::CompileOutput { compiled } = {
            let _s = crate::trace::span("compile");
            crate::compile::compile(&dast, options.checks(), options.classifies(), options.prune)?
        };
        // After the first pass no student has changed a value yet, so a
        // seeded cell takes its seed again, from the counts the pass stamps.
        let (mut doc, _) = settle(&compiled, &session, Counts::default(), true)?;
        let _s = crate::trace::span("attributes");
        doc.loaded.literal_attrs = Arc::new(crate::dast::LiteralAttrs::new(&dast));
        Ok((doc, compiled.structural_depth))
    }

    /// This document's session with its essential values recorded, taken
    /// for the next build (the document is about to be replaced).
    fn session_with_values(&mut self) -> Session {
        let mut session = std::mem::take(&mut self.session);
        session.record(
            &self.structure.essential_slots,
            &self.cells[..self.n_essential],
        );
        session
    }

    /// What the build reported about the elements it stamped (ADR 0013):
    /// the errors of the elements that became `_error` components and the
    /// warnings of the rest, in node order. This is the list for rendering
    /// error boxes. It is settled at load and depends on the source alone:
    /// the same at every count and every seed, every option of every select
    /// included (ADR 0014), so it is [`crate::diagnose`]'s list.
    pub fn diagnostics(&self) -> &[crate::Diagnostic] {
        &self.loaded.diagnostics
    }

    /// The warnings among `diagnostics`, as sentences.
    pub fn warnings(&self) -> Vec<String> {
        self.diagnostics()
            .iter()
            .filter(|d| d.kind == crate::DiagnosticKind::Warning)
            .map(|d| d.message.clone())
            .collect()
    }

    /// Whether every repeat was expanded with the iteration count its
    /// `count` cell now holds.
    pub fn structure_settled(&self) -> bool {
        self.structure
            .repeats
            .iter()
            .all(|r| self.repeat_count(r) == r.iterations)
    }

    /// The iteration count a repeat's `count` cell currently asks for.
    pub fn repeat_count(&self, r: &Repeat) -> u32 {
        let pi = self
            .component_type(r.comp)
            .count_prop()
            .expect("a repeat has a count");
        let v = self.cells[self.comp_cells(r.comp)[pi].index()];
        if v.is_nan() || v < 0.0 {
            0
        } else {
            v.min(u32::MAX as f64) as u32
        }
    }

    /// Build again from the compile (ADR 0015) at the counts the count
    /// cells hold, reading the session, until the structure settles. The
    /// document is replaced only when that succeeds; on error it is left
    /// as it was, since a build reads the session and moves nothing out of
    /// the document. The math engine may have grown, which leaves every
    /// handle the document holds valid.
    /// Returns how many passes it took.
    pub fn rebuild(&mut self) -> crate::Result<u32> {
        // The rebuild's spans are recorded only for the profile: a tick
        // records nothing otherwise.
        let profile = crate::profile::enabled();
        if profile {
            crate::trace::start();
        }
        let result = {
            let _s = crate::trace::span("rebuild");
            self.rebuild_passes()
        };
        if profile {
            crate::profile::dump(&crate::trace::finish());
        }
        result
    }

    fn rebuild_passes(&mut self) -> crate::Result<u32> {
        // Without a repeat the structure never changes: nothing to rebuild.
        let Some(compiled) = self.loaded.compiled.clone() else {
            return Ok(0);
        };
        // The values as they are now are what the build carries.
        let n = self.n_essential;
        self.session
            .record(&self.structure.essential_slots, &self.cells[..n]);
        let counts = Counts::of(self);
        // What every repeat asks for now, kept for an iteration this
        // rebuild drops and a later one brings back.
        self.session.counts = Arc::new(counts.clone());
        let (built, passes) = settle(&compiled, &self.session, counts, false)?;
        // Replace what one build made and carry what outlives a build; the
        // session is the one the build returned.
        *self = Document {
            loaded: self.loaded.clone(),
            recompute: self.recompute,
            ..built
        };
        Ok(passes)
    }
}

/// Build `compiled` at `counts`, reading `session`, schedule and compute,
/// and again at the counts the count cells then hold, until every repeat
/// was built with the count its cell asks for (ADR 0004): the document and
/// how many passes it took. With `reseed`, every pass after the first
/// stamps seeded cells afresh (a load). `session` is only read, so a
/// caller that fails here is left as it was.
fn settle(
    compiled: &Arc<Compiled>,
    session: &Session,
    mut counts: Counts,
    reseed: bool,
) -> crate::Result<(Document, u32)> {
    let passes = compiled.passes(MAX_PASSES);
    // The session a later pass reads: the last pass's.
    let mut next: Option<Session> = None;
    for pass in 0..passes {
        let built = {
            let _s = crate::trace::span("build");
            crate::trace::count("pass", pass + 1);
            let session = next.as_ref().unwrap_or(session);
            crate::build::build(compiled, session, &counts, reseed && pass > 0)?
        };
        let mut doc = {
            let _s = crate::trace::span("schedule");
            let doc = built.schedule(compiled.clone())?;
            crate::trace::count("instructions", doc.program.len());
            doc
        };
        {
            let _s = crate::trace::span("compute");
            crate::trace::count("cells", doc.cells.len());
            doc.recompute();
        }
        if doc.structure_settled() {
            return Ok((doc, pass as u32 + 1));
        }
        counts = Counts::of(&doc);
        next = Some(doc.session_with_values());
    }
    Err(unsettled(passes))
}

/// The structure did not settle in the passes allowed: a core bug, since
/// the document's structural depth, which the check bounded, says how many
/// passes it needs (ADR 0014). Only a test load without the check can fail
/// this way by itself.
fn unsettled(passes: usize) -> crate::Error {
    crate::Error::Unchecked(format!(
        "the structure did not settle in {passes} passes, more than its structural depth allows"
    ))
}
