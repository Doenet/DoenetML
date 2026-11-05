//! Linking: what is left once every element is planned. Readers of boxes
//! are boxed to a fixpoint, elements with an attribute nothing read are
//! boxed, and the given leaves copies share are tied between the elements
//! left.

mod unread;

use crate::compile::*;

impl Compiler<'_> {
    /// Linking: box the readers of boxes, then the elements with an
    /// attribute nothing read and their readers, then tie shared state
    /// between the elements left.
    pub(in crate::compile) fn link(
        &mut self,
        planned: &mut Planned,
    ) -> std::result::Result<(), Failure> {
        let readers = &planned.reads;
        let box_readers = |cp: &mut Self| {
            crate::trace::span("box readers")
                .run(|| cp.box_readers_of_boxes(readers))
                .map_err(|error| Failure { error, node: None })
        };
        box_readers(self)?;
        crate::trace::span("unread attributes").run(|| self.box_unread_attributes());
        box_readers(self)?;
        crate::trace::span("given leaves").run(|| self.link_given_leaves(planned));
        Ok(())
    }

    /// Box in place every element in `readers` whose referent is now a
    /// box, to a fixpoint: a copy of a copy of a box is boxed too.
    fn box_readers_of_boxes(&mut self, readers: &[Read]) -> Result<()> {
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

    /// Alias each given leaf a copy shares to the referent's port holding
    /// it. A copy or referent that is a box shares nothing, and a copy
    /// keeps its own given value for a leaf its referent has none of.
    pub(in crate::compile) fn link_given_leaves(&mut self, planned: &mut Planned) {
        for s in std::mem::take(&mut planned.shares) {
            let (rt, re) = match s.referent {
                Referent::Here(r) => (s.t, r),
                Referent::Path(_, rt, re) => (rt, re),
            };
            if self.is_box(s.t, s.e) || self.is_box(rt, re) {
                continue;
            }
            if let Referent::Path(path, ..) = s.referent {
                planned.paths.push(crate::compile::share::PathExtend {
                    t: s.t,
                    path,
                    rt,
                    re,
                });
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
