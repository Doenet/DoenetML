//! Linking (ADR 0029, ADR 0030): what planning leaves for once every
//! element is planned. Readers of boxed referents are boxed, elements with
//! an attribute nothing read are boxed (`unread.rs`), and the given
//! leaves copies share are tied between the elements left.

mod unread;

use crate::compile::*;

impl Compiler<'_> {
    /// Linking: what planning left for once every element is planned. A
    /// reader of a boxed referent is boxed (`box_readers_of_boxes`); an
    /// element with an attribute nothing read is boxed, every attribute
    /// having been read by now (`box_unread_attributes`), and its readers
    /// in turn; then shared state is tied between the elements left
    /// (`link_given_leaves`).
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
        crate::trace::span("given leaves").run(|| self.link_given_leaves(planned));
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

    /// Linking (ADR 0029, ADR 0032): each given leaf a copy shares aliases
    /// the referent's port holding it, now that every element is planned.
    /// A copy or referent that is a box shares nothing, and a copy keeps
    /// its own given value for a leaf its referent has none of.
    pub(in crate::compile) fn link_given_leaves(&mut self, planned: &mut Planned) {
        for s in std::mem::take(&mut planned.shares) {
            let (rt, re) = match s.referent {
                Referent::Here(r) => (s.t, r),
                Referent::Path(_, rt, re) => (rt, re),
            };
            if self.is_box(s.t, s.e) || self.is_box(rt, re) {
                continue;
            }
            if let Some(&port) = planned
                .given
                .get(&(rt.get(), re.get()))
                .and_then(|m| m.get(&s.id))
            {
                let arg = match s.referent {
                    Referent::Here(r) => Arg::Elem(r, port),
                    Referent::Path(p, ..) => Arg::Ref(p, Sel::Port(port.index() as u8)),
                };
                self.tables[s.t.index()].plans[s.e.index()].props[s.port.index()] =
                    Source::alias(arg);
            }
        }
    }
}
