//! Linking: what is left once every element is planned. Readers of boxes
//! are boxed to a fixpoint, elements with an attribute nothing read are
//! boxed, and the given leaves copies share are tied between the elements
//! left.

mod unread;

use crate::compile::*;

/// Link what planning made: box the readers of boxes and the elements
/// with an attribute nothing read, to a fixpoint, and tie the given leaves
/// copies share. Writes the boxes, the tables' boxes and shared slots, and
/// [`Planned`]'s shares; returns the warnings for what it could not box
/// (an attribute nothing read on the root).
pub(in crate::compile) fn link<'l, 'b>(
    rd: Reader<'l>,
    ar: &'l Arenas,
    tables: &'l mut [Tables],
    boxes: &'l mut Boxes<'b>,
    planned: &'l mut Planned,
) -> std::result::Result<Vec<Diagnostic>, Failure> {
    crate::trace::span("link").run(|| {
        Linking {
            rd,
            ar,
            tables,
            boxes,
            planned,
        }
        .link()
    })
}

/// Linking's view: what outlining settled and the arenas, read-only; the
/// tables, whose boxes and whose plans' shared slots it writes, the boxes,
/// and [`Planned`], whose shares it ties.
struct Linking<'l, 'b> {
    /// The source and what outlining settled.
    rd: Reader<'l>,
    /// The reference and expression arenas.
    ar: &'l Arenas,
    /// Boxing's and planning's tables, by [`TemplateId`].
    tables: &'l mut [Tables],
    /// What boxing records, linking's while it runs.
    boxes: &'l mut Boxes<'b>,
    /// What planning made for linking: the reads, the shares, the given
    /// leaves.
    planned: &'l mut Planned,
}

/// Linking: readers of boxes boxed to a fixpoint, and the given leaves copies
/// share tied. Reads outlining's and planning's tables; writes the boxes and
/// [`Planned`]'s shares.
impl Linking<'_, '_> {
    /// Linking: box the readers of boxes, then the elements with an
    /// attribute nothing read and their readers, then tie shared state
    /// between the elements left.
    fn link(&mut self) -> std::result::Result<Vec<Diagnostic>, Failure> {
        let box_readers = |l: &mut Self| {
            crate::trace::span("box readers")
                .run(|| l.box_readers_of_boxes())
                .map_err(|error| Failure { error, node: None })
        };
        box_readers(self)?;
        let warnings = crate::trace::span("unread attributes").run(|| self.box_unread_attributes());
        box_readers(self)?;
        crate::trace::span("given leaves").run(|| self.link_given_leaves());
        Ok(warnings)
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
            boxed_one |= self.box_elem_readers_of_boxes();
            if !boxed_one {
                return Ok(());
            }
        }
    }

    /// Box in place every live element whose plan reads a port of an
    /// element of its template that is now a box (`Arg::Elem`: an answer
    /// its input or awards, a choice input its choices), which has no
    /// ports to read. Returns whether it boxed one.
    fn box_elem_readers_of_boxes(&mut self) -> bool {
        let mut boxed_one = false;
        for ti in 0..self.tables.len() {
            let t = TemplateId::from_index(ti);
            for ei in 0..self.tables[ti].plans.len() {
                let e = ElemId::from_index(ei);
                if self.tables[ti].is_box(e) {
                    continue;
                }
                let read_box = self.tables[ti].plans[ei]
                    .props
                    .iter()
                    .flat_map(elem_reads)
                    .find(|&x| self.tables[ti].is_box(x));
                if let Some(x) = read_box {
                    self.boxes
                        .box_elem_reader(&self.rd.settled().templates, self.tables, t, e, x);
                    boxed_one = true;
                }
            }
        }
        boxed_one
    }

    /// Alias each given leaf a copy shares to the referent's port holding
    /// it. A copy or referent that is a box shares nothing, and a copy
    /// keeps its own given value for a leaf its referent has none of.
    fn link_given_leaves(&mut self) {
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
                planned.paths.push(PathExtend {
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

/// The elements of its template a source reads ports of (`Arg::Elem`).
fn elem_reads(source: &Source) -> Vec<ElemId> {
    let elem = |a: &Arg| match *a {
        Arg::Elem(x, _) => Some(x),
        _ => None,
    };
    match source {
        Source::Leaf(_) => Vec::new(),
        Source::Flow(Flow::Alias(a)) => elem(a).into_iter().collect(),
        Source::Flow(Flow::Op(_, args)) => args.iter().filter_map(elem).collect(),
        Source::Flow(_) => Vec::new(),
        Source::Specialize(_, a, b) => {
            let mut out = elem_reads(a);
            out.extend(elem_reads(b));
            out
        }
    }
}
