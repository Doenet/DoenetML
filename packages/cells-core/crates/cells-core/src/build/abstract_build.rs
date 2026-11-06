//! The abstract build, the build the compile's check runs through: the
//! document built once more through the abstract view, as far as define
//! (ADR 0035), so every repeat gets one iteration, an index past it lands
//! in it, and every select builds every option. Its walks find what every
//! build reads of each port, and its definitions the warnings and the
//! input signature. The cycle and count checks run between its resolve and
//! its define, over the compile's template graph (ADR 0032, step 8).

use super::*;

/// The abstract build: the compile expanded and resolved once through the
/// abstract view, `between` run, and defined. It reads a session of its
/// own and makes no program (ADR 0035): what it found is its findings.
pub(crate) fn abstract_build(
    compiled: CompiledRef,
    between: impl FnOnce() -> std::result::Result<(), Failure>,
) -> std::result::Result<AbstractFindings, Failure> {
    with_abstract(compiled, between, |b, defined| b.findings(defined))
}

/// The input signature read off the abstract build's definitions, every
/// key through `rename`. Define's rules box what they box first.
pub(crate) fn abstract_signature(
    compiled: CompiledRef,
    between: impl FnOnce() -> std::result::Result<(), Failure>,
    rename: &dyn Fn(&str) -> String,
) -> std::result::Result<signature::Signature, Failure> {
    with_abstract(compiled, between, |b, defined| {
        signature::sign(&b, defined, rename)
    })
}

/// Expand and resolve through the abstract view, run `between` (the
/// compile's cycle check, which a failure of resolve's must come before
/// and one of define's after), and define, then `read` the builder, which
/// it is given, and the definitions. The failure names the element to box.
fn with_abstract<T>(
    compiled: CompiledRef,
    between: impl FnOnce() -> std::result::Result<(), Failure>,
    read: impl FnOnce(Builder<'_>, &Defined) -> T,
) -> std::result::Result<T, Failure> {
    // A session and math of its own: no handle it makes reaches a
    // document.
    let session = Session::new(0);
    let mut math = MathStore::default();
    let mut b = Builder::new(compiled, &session, false, &mut math, &View::Abstract);
    b.stage()?;
    between()?;
    let slot_cells = crate::trace::span("define").run(|| b.define())?;
    let defined = Defined::by_walk(&b, slot_cells);
    Ok(read(b, &defined))
}

impl<'c> Builder<'c> {
    /// What the abstract build found for the compile to keep: the
    /// attributes of the ports its walks classed and it counted, and its
    /// warnings. The build ends here.
    fn findings(self, defined: &Defined) -> AbstractFindings {
        let n = self.sources.len();
        let Defined {
            slot_cells,
            essential,
            live,
        } = defined;
        // The counted values (ADR 0028).
        let mut counted = vec![false; n];
        for &s in &self.counted_slots {
            counted[s.index()] = true;
        }
        // The document constants (ADR 0028): of the slots whose plan gives
        // one, those that are constants, not essential.
        let mut document = vec![false; n];
        for &s in &self.document_slots {
            document[s.index()] = match self.sources[s.index()] {
                BuiltSource::Const(_) => true,
                BuiltSource::Given(_) => !essential[s.index()],
                _ => false,
            };
        }
        let mut attrs: Vec<Vec<PortAttrs>> = self
            .compiled
            .plans
            .templates
            .iter()
            .map(|t| vec![PortAttrs::default(); t.sealed.n_slots as usize])
            .collect();
        for (marked, attr) in [
            (essential, PortAttrs::WRITABLE),
            (live, PortAttrs::LIVE),
            (&counted, PortAttrs::COUNTED),
            (&document, PortAttrs::DOCUMENT_CONSTANT),
        ] {
            self.mark_ports(marked, attr, &mut attrs);
        }
        // Requests the program cannot land (ADR 0026), each interactive
        // prop once, by its template element.
        let warnings = self.refuse_warnings(slot_cells, essential);
        AbstractFindings { attrs, warnings }
    }

    /// Give `attr` to the port of every slot `marked` that has one.
    fn mark_ports(&self, marked: &[bool], attr: PortAttrs, attrs: &mut [Vec<PortAttrs>]) {
        for (s, _) in marked.iter().enumerate().filter(|(_, m)| **m) {
            if let Some((t, ts)) = self.template_slot(SlotId::from_index(s)) {
                attrs[t.index()][ts.index()] |= attr;
            }
        }
    }
}
