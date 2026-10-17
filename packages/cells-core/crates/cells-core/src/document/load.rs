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
    /// Reject a dependency loop that closes at any iteration count a
    /// repeat can reach, not only the count at load (ADR 0012). Off only
    /// for measuring what the check costs.
    pub check_cycles: bool,
}

impl Default for LoadOptions {
    fn default() -> Self {
        LoadOptions {
            seed: 0,
            sample_with_engine: false,
            check_cycles: true,
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
    /// and its errors (ADR 0014). Only a document with repeats runs it.
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
        let mut t = LoadTimings::default();
        let clock = web_time::Instant::now();
        let dast = Arc::new(crate::dast::load(bytes)?);
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
        let mut t = LoadTimings::default();
        let clock = web_time::Instant::now();
        let dast = Arc::new(crate::dast::load(&bytes)?);
        drop(bytes);
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
        let crate::compile::CompileOutput {
            compiled,
            mut first_build,
            check_time,
        } = crate::compile::compile(&dast, &session, options.check_cycles)?;
        t.build += clock.elapsed();
        t.cycle_check += check_time;
        for pass in 0..MAX_PASSES {
            let clock = web_time::Instant::now();
            let built = match first_build.take() {
                // The compile's check was this build.
                Some(built) => built,
                // After the first pass no student has changed a value yet,
                // so a seeded cell takes its seed again, from the counts
                // this pass stamps.
                None => crate::build::build(&compiled, &session, &counts, pass > 0)?,
            };
            t.build += clock.elapsed();

            let clock = web_time::Instant::now();
            let mut doc = built.schedule(compiled.clone())?;
            t.schedule += clock.elapsed();

            let clock = web_time::Instant::now();
            doc.recompute();
            t.initial_compute += clock.elapsed();
            t.passes += 1;
            if doc.structure_settled() {
                t.structural_depth = doc.structure.structural_depth;
                return Ok(doc);
            }
            counts = Counts::of(&doc);
            session = doc.session_with_values();
        }
        Err(crate::Error::UnstableStructure(MAX_PASSES))
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
    /// error boxes. It is fixed at load, the same at every count (ADR 0014),
    /// and per seed, since a select outside a repeat builds only its draw;
    /// the document's diagnostics, every option included, are
    /// [`crate::diagnose`]'s.
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
    pub fn rebuild(&mut self) -> crate::Result<()> {
        let profile = crate::build::profile_enabled();
        // Without a repeat the structure never changes: nothing to rebuild.
        let Some(compiled) = self.compiled.clone() else {
            return Ok(());
        };
        // The values as they are now are what the build carries.
        let n = self.n_essential;
        self.session
            .record(&self.structure.essential_slots, &self.cells[..n]);
        let mut counts = Counts::of(self);
        // The session a later pass reads: the last pass's.
        let mut next: Option<Session> = None;
        let mut result = Err(crate::Error::UnstableStructure(MAX_PASSES));
        for _ in 0..MAX_PASSES {
            let clock = web_time::Instant::now();
            let session = next.as_ref().unwrap_or(&self.session);
            let built = match crate::build::build(&compiled, session, &counts, false) {
                Ok(built) => built,
                Err(e) => {
                    result = Err(e);
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
                    result = Err(e);
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
        *self = result?;
        Ok(())
    }
}
