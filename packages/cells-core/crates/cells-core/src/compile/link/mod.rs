//! Linking (ADR 0029, ADR 0030): what planning leaves for once every
//! element is planned. Readers of boxed referents are boxed, elements with
//! an attribute nothing read are boxed (`unread.rs`), and shared state is
//! tied between the elements left.

mod unread;

use crate::compile::*;

impl Compiler<'_> {
    /// Linking: what planning left for once every element is planned. A
    /// reader of a boxed referent is boxed (`box_readers_of_boxes`); an
    /// element with an attribute nothing read is boxed, every attribute
    /// having been read by now (`box_unread_attributes`), and its readers
    /// in turn; then shared state is tied between the elements left
    /// (`link_shared_state`).
    pub(in crate::compile) fn link(
        &mut self,
        planned: &mut Planned,
    ) -> std::result::Result<(), Failure> {
        let readers: Vec<(TemplateId, ElemId, RefId)> = (self.settled().referent_readers.iter())
            .chain(&planned.referent_readers)
            .copied()
            .collect();
        let box_readers = |cp: &mut Self| {
            crate::trace::span("box readers")
                .run(|| cp.box_readers_of_boxes(&readers))
                .map_err(|error| Failure { error, node: None })
        };
        box_readers(self)?;
        crate::trace::span("unread attributes").run(|| self.box_unread_attributes());
        box_readers(self)?;
        crate::trace::span("shared state").run(|| self.link_shared_state(planned));
        Ok(())
    }

    /// Linking's first step (ADR 0029): every element that read a
    /// referent's type (`referent_type`) and whose referent is now a box
    /// is boxed in place, whichever was planned first; a copy of a copy of
    /// a box is boxed too.
    fn box_readers_of_boxes(&mut self, readers: &[(TemplateId, ElemId, RefId)]) -> Result<()> {
        loop {
            let mut boxed_one = false;
            for &(t, e, p) in readers {
                if self.is_box(t, e) {
                    continue;
                }
                match self.read_referent(t, p) {
                    Err(error @ Error::BoxedReferent(_)) => {
                        self.box_in_place(t, e, error);
                        boxed_one = true;
                    }
                    Err(error) => return Err(error),
                    Ok(_) => {}
                }
            }
            if !boxed_one {
                return Ok(());
            }
        }
    }

    /// Linking (ADR 0029): each piece of state a copy shares
    /// aliases the referent's slot for it, now that every element is
    /// planned. A copy or referent that is a box shares nothing, and a
    /// copy keeps its own given value for state its referent has none of.
    pub(in crate::compile) fn link_shared_state(&mut self, planned: &mut Planned) {
        for s in std::mem::take(&mut planned.shares) {
            if self.is_box(s.t, s.e) || self.is_box(s.t, s.referent) {
                continue;
            }
            if let Some(&bs) = planned
                .shared_state
                .get(&(s.t.get(), s.referent.get()))
                .and_then(|m| m.get(&s.state))
            {
                self.tables[s.t.index()].plans[s.e.index()].props[s.slot as usize] =
                    Source::Alias(Arg::Elem(s.referent, bs));
            }
        }
    }
}
