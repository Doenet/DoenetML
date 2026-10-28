//! Loading a document and rebuilding it: build, schedule and compute until
//! every repeat's iteration count matches its `count` cell (ADR 0004).

use super::*;

/// How to load a document. The default: seed 0, curves compiled, cycles
/// checked at every count.
#[derive(Debug, Clone, Copy)]
pub struct LoadOptions {
    /// The document seed load-time choices draw from (ADR 0009): one seed
    /// gives one variant of the document.
    pub seed: u64,
    /// Sample curves through the engine instead of tapes compiled at build
    /// time; for checking the tapes and for measuring.
    pub sample_with_engine: bool,
    /// Skip the compile's check, so a document that should be rejected
    /// loads: for tests of what the check prevents and for measuring what
    /// it costs. Only with the `testing` feature; a real load always checks
    /// (ADR 0014).
    #[cfg(feature = "testing")]
    pub check_cycles: bool,
    /// Class every value slot by whether a student's action can write it,
    /// essential or fixed (ADR 0018); off, every one is essential, as
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
            sample_with_engine: false,
            #[cfg(feature = "testing")]
            check_cycles: true,
            #[cfg(feature = "testing")]
            classify: true,
            prune: true,
        }
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub struct LoadTimings {
    pub deserialize: Duration,
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
    /// `Structure::structural_depth` of the settled document.
    pub structural_depth: u32,
}

impl Document {
    /// Load from either wire format (JSON or binary), detected by content,
    /// with the default options.
    pub fn from_bytes(bytes: &[u8]) -> crate::Result<Document> {
        Ok(Self::load(bytes, LoadOptions::default())?.0)
    }

    /// Load from either wire format, timing each stage separately. Build,
    /// schedule and compute repeat until every repeat's iteration count
    /// matches its `count` cell; the timings sum over passes.
    pub fn load(bytes: &[u8], options: LoadOptions) -> crate::Result<(Document, LoadTimings)> {
        let _load = crate::trace::span("load");
        let mut t = LoadTimings::default();
        let clock = web_time::Instant::now();
        let dast = {
            let _s = crate::trace::span("deserialize");
            crate::trace::count("bytes", bytes.len());
            let dast = Arc::new(crate::dast::load(bytes)?);
            crate::trace::count("dast_nodes", dast.len());
            dast
        };
        t.deserialize = clock.elapsed();
        let doc = Self::load_dast(dast, options, &mut t)?;
        Ok((doc, t))
    }

    /// `load` taking the wire-format bytes, which it frees once the DAST is
    /// read, before the compile and the first build: in wasm the heap's
    /// high-water mark is what a page keeps, and the bytes are often the
    /// largest single block of a load.
    pub fn load_owned(
        bytes: Vec<u8>,
        options: LoadOptions,
    ) -> crate::Result<(Document, LoadTimings)> {
        let _load = crate::trace::span("load");
        let mut t = LoadTimings::default();
        let clock = web_time::Instant::now();
        let dast = {
            let _s = crate::trace::span("deserialize");
            crate::trace::count("bytes", bytes.len());
            let dast = Arc::new(crate::dast::load(&bytes)?);
            drop(bytes);
            crate::trace::count("dast_nodes", dast.len());
            dast
        };
        t.deserialize = clock.elapsed();
        let doc = Self::load_dast(dast, options, &mut t)?;
        Ok((doc, t))
    }

    /// `load` from a deserialized DAST: compile, then build until the
    /// structure settles (ADR 0015).
    pub fn load_dast(
        dast: Arc<Dast>,
        options: LoadOptions,
        t: &mut LoadTimings,
    ) -> crate::Result<Document> {
        let mut session = Session::new(options.seed, options.sample_with_engine);
        let mut counts = Counts::default();
        // Compile once (ADR 0015); every pass is a build of that compile.
        let clock = web_time::Instant::now();
        let compile_span = crate::trace::span("compile");
        let crate::compile::CompileOutput {
            compiled,
            mut first_build,
            check_time,
        } = crate::compile::compile(
            &dast,
            &session,
            options.checks(),
            options.classifies(),
            options.prune,
        )?;
        drop(compile_span);
        t.build += clock.elapsed();
        t.cycle_check += check_time;
        let passes = compiled.passes(MAX_PASSES);
        for pass in 0..passes.unwrap_or(MAX_PASSES) {
            let clock = web_time::Instant::now();
            let built = match first_build.take() {
                // The compile's check was this build.
                Some(built) => built,
                // After the first pass no student has changed a value yet,
                // so a seeded cell takes its seed again, from the counts
                // this pass stamps.
                None => {
                    let _s = crate::trace::span("build");
                    crate::trace::count("pass", pass + 1);
                    crate::build::build(&compiled, &session, &counts, pass > 0)?
                }
            };
            t.build += clock.elapsed();

            let clock = web_time::Instant::now();
            let mut doc = {
                let _s = crate::trace::span("schedule");
                let doc = built.schedule(compiled.clone())?;
                crate::trace::count("instructions", doc.program.len());
                doc
            };
            t.schedule += clock.elapsed();

            let clock = web_time::Instant::now();
            {
                let _s = crate::trace::span("compute");
                crate::trace::count("cells", doc.cells.len());
                doc.recompute();
            }
            t.initial_compute += clock.elapsed();
            t.passes += 1;
            if doc.structure_settled() {
                t.structural_depth = doc.structure.structural_depth;
                let _s = crate::trace::span("attributes");
                doc.loaded.literal_attrs = Arc::new(crate::dast::LiteralAttrs::new(&dast));
                return Ok(doc);
            }
            counts = Counts::of(&doc);
            session = doc.session_with_values();
        }
        Err(unsettled(passes))
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
    /// error boxes. It is fixed at load and depends on the source alone:
    /// the same at every count and every seed, every option of every select
    /// included (ADR 0014), so it is [`crate::diagnose`]'s list.
    pub fn diagnostics(&self) -> &[crate::Diagnostic] {
        &self.structure.diagnostics
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
        let v = self.cells[self.comp_cells(r.comp)[pi] as usize];
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
        let profile = crate::profile::enabled();
        // Without a repeat the structure never changes: nothing to rebuild.
        let Some(compiled) = self.loaded.compiled.clone() else {
            return Ok(0);
        };
        // The values as they are now are what the build carries.
        let n = self.n_essential;
        self.session
            .record(&self.structure.essential_slots, &self.cells[..n]);
        let mut counts = Counts::of(self);
        // What every repeat asks for now, kept for an iteration this
        // rebuild drops and a later one brings back.
        self.session.counts = Arc::new(counts.clone());
        // The session a later pass reads: the last pass's.
        let mut next: Option<Session> = None;
        let passes = compiled.passes(MAX_PASSES);
        let mut result = Err(unsettled(passes));
        let mut n = 0;
        for _ in 0..passes.unwrap_or(MAX_PASSES) {
            n += 1;
            let clock = web_time::Instant::now();
            let session = next.as_ref().unwrap_or(&self.session);
            let built = match crate::build::build(&compiled, session, &counts, false) {
                Ok(built) => built,
                Err(e) => {
                    result = Err(e.into());
                    break;
                }
            };
            if profile {
                eprintln!("rebuild/build: {:.2?}", clock.elapsed());
            }
            let clock = web_time::Instant::now();
            let mut doc = match built.schedule(compiled.clone()) {
                Ok(doc) => doc,
                Err(e) => {
                    result = Err(e.into());
                    break;
                }
            };
            if profile {
                eprintln!(
                    "rebuild/schedule: {:.2?} (creation order valid: {})",
                    clock.elapsed(),
                    doc.program.in_creation_order
                );
            }
            let clock = web_time::Instant::now();
            doc.recompute();
            if profile {
                eprintln!("rebuild/recompute: {:.2?}", clock.elapsed());
            }
            if doc.structure_settled() {
                result = Ok(doc);
                break;
            }
            counts = Counts::of(&doc);
            next = Some(doc.session_with_values());
        }
        // Replace what one build made and carry what outlives a build; the
        // session is the one the build returned.
        let built = result?;
        *self = Document {
            loaded: self.loaded.clone(),
            recompute: self.recompute,
            ..built
        };
        Ok(n)
    }
}

/// The structure did not settle in the passes allowed. For a checked
/// document a core bug: its structural depth, which the check bounded,
/// says how many passes it needs (ADR 0014). Only a test load without the
/// check can fail this way by itself.
fn unsettled(passes: Option<usize>) -> crate::Error {
    match passes {
        Some(n) => crate::Error::Unchecked(format!(
            "the structure did not settle in {n} passes, more than its structural depth allows"
        )),
        None => crate::Error::UnstableStructure(MAX_PASSES),
    }
}
