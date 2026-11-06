//! The abstract build: the document built once more through the abstract
//! view, so every repeat gets one iteration, an index past it lands in it,
//! and every select builds every option. The compile's check runs it as
//! far as resolve, for an element that cannot be built; every other
//! finding of the check is the template graph's (ADR 0032, step 8). The
//! input signature still reads its definitions (ADR 0035), and for the
//! tests its walks and warnings are what the graph's are compared with.

use super::*;

/// The compile expanded and resolved once through the abstract view, on
/// a session of its own: the failure names an element that cannot be
/// built.
pub(crate) fn abstract_resolve(compiled: CompiledRef) -> std::result::Result<(), Failure> {
    let session = Session::new(0);
    let mut math = MathStore::default();
    let mut b = Builder::new(compiled, &session, false, &mut math, &View::Abstract);
    b.stage()
}

/// For tests: the abstract build defined, its walks' attributes of the
/// ports and its warnings, what the template graph's are compared with.
#[cfg(feature = "testing")]
pub(crate) fn abstract_findings(
    compiled: CompiledRef,
) -> std::result::Result<AbstractFindings, Failure> {
    with_abstract(compiled, || Ok(()), |b, defined| b.findings(defined))
}

/// For tests: whether the abstract build, `between` run after its
/// resolve, defines; its failure names the element to box.
#[cfg(feature = "testing")]
pub(crate) fn abstract_define(
    compiled: CompiledRef,
    between: impl FnOnce() -> std::result::Result<(), Failure>,
) -> std::result::Result<(), Failure> {
    with_abstract(compiled, between, |_, _| ())
}

#[cfg(feature = "testing")]
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

#[cfg(feature = "testing")]
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

#[cfg(feature = "testing")]
impl<'c> Builder<'c> {
    /// What the abstract build finds: the attributes of the ports its
    /// walks classed and it counted, and its warnings. The build ends
    /// here.
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
