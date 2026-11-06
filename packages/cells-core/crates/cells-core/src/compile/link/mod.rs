//! Linking: what is left once every element is planned. Readers of boxes
//! are boxed to a fixpoint, elements with an attribute nothing read are
//! boxed, and the given leaves copies share are tied between the elements
//! left.

mod unread;

use crate::compile::*;

/// Linking's view: what outlining settled and the arenas, read-only; the
/// tables, whose boxes and whose plans' shared slots it writes, the boxes,
/// and [`Planned`], whose shares it ties.
pub(in crate::compile) struct Linking<'l, 'b> {
    /// The source and what outlining settled.
    pub(in crate::compile) rd: Reader<'l>,
    /// The reference and expression arenas.
    pub(in crate::compile) ar: &'l Arenas,
    /// Boxing's and planning's tables, by [`TemplateId`].
    pub(in crate::compile) tables: &'l mut [Tables],
    /// What boxing records, linking's while it runs.
    pub(in crate::compile) boxes: &'l mut Boxes<'b>,
    /// What planning made for linking: the reads, the shares, the given
    /// leaves.
    pub(in crate::compile) planned: &'l mut Planned,
}

/// Linking: readers of boxes boxed to a fixpoint, and the given leaves copies
/// share tied. Reads outlining's and planning's tables; writes the boxes and
/// [`Planned`]'s shares.
impl Linking<'_, '_> {
    /// Linking: box the readers of boxes, then the elements with an
    /// attribute nothing read and their readers, then tie shared state
    /// between the elements left.
    pub(in crate::compile) fn link(&mut self) -> std::result::Result<(), Failure> {
        let box_readers = |l: &mut Self| {
            crate::trace::span("box readers")
                .run(|| l.box_readers_of_boxes())
                .map_err(|error| Failure { error, node: None })
        };
        box_readers(self)?;
        crate::trace::span("unread attributes").run(|| self.box_unread_attributes());
        box_readers(self)?;
        crate::trace::span("given leaves").run(|| self.link_given_leaves());
        Ok(())
    }

    /// Box in place every element whose referent, by a read planning or
    /// outlining recorded, is now a box, to a fixpoint: a copy of a copy of
    /// a box is boxed too.
    fn box_readers_of_boxes(&mut self) -> Result<()> {
        loop {
            let mut boxed_one = false;
            for &(t, e, p) in &self.planned.reads {
                if self.tables[t.index()].is_box(e) {
                    continue;
                }
                match self
                    .rd
                    .read_referent(self.ar, self.boxes.visible(self.tables), t, p)
                {
                    Err(error @ Error::BoxedReferent(_)) => {
                        self.boxes.box_in_place(
                            &self.rd.settled().templates,
                            self.tables,
                            t,
                            e,
                            error,
                        );
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
    pub(in crate::compile) fn link_given_leaves(&mut self) {
        let planned = &mut *self.planned;
        for s in std::mem::take(&mut planned.shares) {
            let (rt, re) = match s.referent {
                Referent::Here(r) => (s.t, r),
                Referent::Path(_, rt, re) => (rt, re),
            };
            if self.tables[s.t.index()].is_box(s.e) || self.tables[rt.index()].is_box(re) {
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
            if let Some(&port) = planned.given.get(&(rt, re)).and_then(|m| m.get(&s.id)) {
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
