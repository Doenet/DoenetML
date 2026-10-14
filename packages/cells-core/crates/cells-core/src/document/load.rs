//! Loading a document and rebuilding it: build, schedule and compute until
//! every repeat's iteration count matches its `count` cell (ADR 0004).

use super::*;

/// How to load a document. The default: seed 0, curves compiled.
#[derive(Debug, Clone, Copy, Default)]
pub struct LoadOptions {
    /// The document seed load-time choices draw from (ADR 0009): one seed
    /// gives one variant of the document.
    pub seed: u64,
    /// Sample curves through the engine instead of tapes compiled at build
    /// time; for checking the tapes and for measuring.
    pub sample_with_engine: bool,
}

#[derive(Debug, Clone, Copy, Default)]
pub struct LoadTimings {
    pub deserialize: Duration,
    pub build: Duration,
    pub schedule: Duration,
    pub initial_compute: Duration,
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

    /// `load` from a deserialized DAST.
    pub fn load_dast(
        dast: Arc<Dast>,
        options: LoadOptions,
        t: &mut LoadTimings,
    ) -> crate::Result<Document> {
        let mut engine = Engine::new();
        let mut carryover = crate::build::Carryover::new(options.seed, options.sample_with_engine);
        for _ in 0..MAX_PASSES {
            let clock = web_time::Instant::now();
            let built = crate::build::build(&dast, &carryover, &mut engine)?;
            t.build += clock.elapsed();

            let clock = web_time::Instant::now();
            let mut doc = built.schedule(dast.clone(), &mut engine)?;
            t.schedule += clock.elapsed();

            let clock = web_time::Instant::now();
            doc.recompute();
            t.initial_compute += clock.elapsed();
            t.passes += 1;
            if doc.structure_settled() {
                t.structural_depth = doc.structure.structural_depth;
                return Ok(doc);
            }
            carryover = crate::build::Carryover::take_from(&mut doc);
            engine = doc.take_engine();
        }
        Err(crate::Error::UnstableStructure(MAX_PASSES))
    }

    /// Move the symbolic engine out, leaving an empty one (the document is
    /// about to be replaced by a rebuild).
    fn take_engine(&mut self) -> Engine {
        std::mem::take(&mut self.program.sym).into_engine()
    }

    fn put_engine(&mut self, engine: Engine) {
        self.program.sym = crate::program::Sym::new(engine);
        // The memo was dropped with the old `Sym`: recompute so it refills.
        self.program.run_all(&mut self.cells);
    }

    /// Authoring warnings about the loaded document. Today: repeats whose
    /// count reads a cell inside another repeat's iterations, since each
    /// such link costs a full extra build pass and, unlike nesting, is
    /// avoidable (see `Structure::repeat_depths`).
    pub fn warnings(&self) -> Vec<String> {
        let st = &self.structure;
        let mut out = Vec::new();
        for ((r, &d), &cross) in st
            .repeats
            .iter()
            .zip(&st.repeat_depths)
            .zip(&st.repeat_cross_reads)
        {
            if cross {
                let name = self
                    .name(r.comp)
                    .map(str::to_string)
                    .unwrap_or_else(|| format!("<repeatForSequence>#{}", r.comp));
                out.push(format!("repeat '{name}' has structural depth {d}: its count reads a cell inside another repeat's iterations, so a change there costs {d} build passes instead of one"));
            }
        }
        out
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

    /// Rebuild from the retained DAST, carrying iteration counts and
    /// essential values over. On error the document is left unchanged.
    pub fn rebuild(&mut self) -> crate::Result<()> {
        let profile = crate::build::profile_enabled();
        let dast = self.dast.clone();
        let clock = web_time::Instant::now();
        // The value store and the engine move into the new build; on
        // failure they move back.
        let mut carryover = crate::build::Carryover::take_from(self);
        let mut engine = self.take_engine();
        if profile {
            eprintln!("rebuild/carryover: {:.2?}", clock.elapsed());
        }
        let result = (|| {
            for _ in 0..MAX_PASSES {
                let clock = web_time::Instant::now();
                let built = crate::build::build(&dast, &carryover, &mut engine)?;
                if profile {
                    eprintln!("rebuild/build: {:.2?}", clock.elapsed());
                }
                let clock = web_time::Instant::now();
                let mut doc = built.schedule(dast.clone(), &mut engine)?;
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
                    return Ok(doc);
                }
                carryover = crate::build::Carryover::take_from(&mut doc);
                engine = doc.take_engine();
            }
            Err(crate::Error::UnstableStructure(MAX_PASSES))
        })();
        match result {
            Ok(doc) => {
                *self = doc;
                Ok(())
            }
            Err(e) => {
                carryover.restore(self);
                self.put_engine(engine);
                Err(e)
            }
        }
    }
}
