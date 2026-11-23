//! Planning, lists: what a reference or an element among a list's or an
//! operator's children contributes, told from the records alone (ADR 0041,
//! decisions 2, 5 and 9). A reference to a static sequence (a value list
//! whose count is a fact of the source) contributes its entries, spliced;
//! a reference to one entry past such a list's end, none; anything else,
//! one value, as a reference always did.

use super::Planning;
use crate::compile::ir::record::{ListPiece, PieceFrag};
use crate::compile::*;

/// What a reference among a list's children contributes.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Splice {
    /// One value: the reference itself, as many cells as it names.
    Value,
    /// No entry: a literal index past the end of a static sequence
    /// (`$l[9]` of three).
    Nothing,
    /// The `n` entries of a static sequence, each read as `$p[k]`.
    Entries(usize),
}

/// One entry a list's children contribute, in order: a piece of text (with
/// the position of its piece, which gives it), math text, or a reference
/// naming one value.
#[derive(Debug, Clone)]
pub(crate) enum ListEntry {
    Text(u32, String),
    Math(ExprId),
    Ref(RefId),
}

/// Planning, lists: how many entries a reference contributes, from the
/// records of what it names, never their plans (ADR 0029).
impl<'a> Planning<'a> {
    /// What plan `p`, planned from template `t` and read by element `e`,
    /// contributes among a list's children. A read of a sequence is
    /// recorded, so a box it names boxes `e` (ADR 0032).
    pub(super) fn splice(&mut self, t: TemplateId, e: ElemId, p: RefId) -> Splice {
        let points = self.rd.outlined(t).elems[e.index()]
            .component_type
            .lists_points();
        let splice = self.splice_within(t, p, &mut Vec::new(), points);
        if splice != Splice::Value {
            crate::compile::read::record_read(&mut self.planned.reads, t, e, p);
        }
        splice
    }

    fn splice_within(
        &self,
        t: TemplateId,
        p: RefId,
        visiting: &mut Vec<(TemplateId, ElemId)>,
        points: bool,
    ) -> Splice {
        let plan = &self.ar.refs[p.index()];
        let mut last = None;
        for step in &plan.steps {
            match step {
                Step::Elem(x) => last = Some(*x),
                Step::Iter(_) | Step::Item(..) | Step::Iface(..) => return Splice::Value,
            }
        }
        let Some(x) = last else {
            return Splice::Value;
        };
        let rt = self.rd.template_up(t, plan.hops);
        let ty = self.rd.outlined(rt).elems[x.index()].component_type;
        if !is_value_list(ty, points) {
            return Splice::Value;
        }
        // The list itself, by its default prop or its list prop by name.
        let names_list = match plan.prop {
            None => true,
            Some(rp) => rp.of == ty && rp.sel == PropSel::At(PropAt::List),
        };
        if !names_list {
            return Splice::Value;
        }
        let Some(n) = self.list_len(rt, x, visiting, points) else {
            return Splice::Value;
        };
        match &plan.entries[..] {
            [] => Splice::Entries(n),
            // `$l[k]`: one entry, or none past the end.
            [only] => match only.index.constant_value() {
                Some(_) if only.index.entry_in(n).is_none() => Splice::Nothing,
                _ => Splice::Value,
            },
            _ => Splice::Value,
        }
    }

    /// How many entries value list `x` of template `t` has, when its
    /// record tells: one per piece of text, the entries each reference and
    /// element child among its children contributes, less as many as its
    /// list declares (`from_children`) and cut at its `maxNumber`; a bare
    /// copy's, its referent's. None for one in a loop
    /// of lists, or one whose children did not parse.
    fn list_len(
        &self,
        t: TemplateId,
        x: ElemId,
        visiting: &mut Vec<(TemplateId, ElemId)>,
        points: bool,
    ) -> Option<usize> {
        if visiting.contains(&(t, x)) {
            return None;
        }
        let record = self.parsed.record_ref(t, x)?;
        let el = self.rd.outlined(t).elems[x.index()].clone();
        visiting.push((t, x));
        let pieces = record.list_pieces();
        let n = match (pieces, el.extend) {
            // A copy with no children of its own has its referent's.
            ([], Some(q)) => match self.splice_within(t, q, visiting, points) {
                Splice::Entries(n) => Some(n),
                _ => None,
            },
            _ => {
                let mut n = 0;
                for piece in pieces {
                    n += match piece {
                        ListPiece::Text(_) | ListPiece::Math(_) => 1,
                        ListPiece::Reference(q) | ListPiece::Element(q) => {
                            match self.splice_within(t, *q, visiting, points) {
                                Splice::Value => 1,
                                Splice::Nothing => 0,
                                Splice::Entries(k) => k,
                            }
                        }
                    };
                }
                let less = el.component_type.list_from_children().unwrap_or(0);
                Some(n.saturating_sub(usize::from(less)))
            }
        };
        visiting.pop();
        let max = el
            .component_type
            .list_max_attr()
            .and_then(|a| record.literal(a, f64::INFINITY).ok())
            .unwrap_or(f64::INFINITY);
        n.map(|n| cut_at(n, max))
    }

    /// The entries `pieces`, the children of element `e` of template `t`,
    /// contribute (ADR 0041, decision 9): a reference to a static sequence
    /// spliced into its entries, one past such a list's end dropped, and a
    /// piece with references inside its brackets parsed as math. At most
    /// `max` of them (a list's `maxNumber`).
    pub(super) fn list_entries(
        &mut self,
        t: TemplateId,
        e: ElemId,
        pieces: Vec<ListPiece>,
        max: f64,
    ) -> Result<Vec<ListEntry>> {
        let mut entries = Vec::with_capacity(pieces.len());
        for (k, piece) in pieces.into_iter().enumerate() {
            match piece {
                ListPiece::Text(text) => entries.push(ListEntry::Text(k as u32, text)),
                ListPiece::Math(frags) => entries.push(ListEntry::Math(self.piece_math(&frags)?)),
                ListPiece::Reference(p) | ListPiece::Element(p) => match self.splice(t, e, p) {
                    Splice::Value => entries.push(ListEntry::Ref(p)),
                    Splice::Nothing => {}
                    Splice::Entries(n) => {
                        for k in 1..=n {
                            entries.push(ListEntry::Ref(self.entry_ref(t, p, k)));
                        }
                    }
                },
            }
        }
        entries.truncate(cut_at(entries.len(), max));
        Ok(entries)
    }

    /// The entries of value list `e` of template `t` that are its element
    /// children as they stand (ADR 0041, decision 4), recorded on its plan
    /// for a build to make them the entries' rows: a child of the type the
    /// list's entries are, contributing one entry. `pieces` are its
    /// children, `n` how many entries they make.
    pub(super) fn element_rows(
        &mut self,
        t: TemplateId,
        e: ElemId,
        pieces: &[ListPiece],
        n: usize,
    ) {
        let Some(row) = self.rd.outlined(t).elems[e.index()]
            .component_type
            .entry_row()
        else {
            return;
        };
        let children = self.rd.elem_children(t, e);
        let mut rows = Vec::new();
        let mut k = 0;
        for piece in pieces {
            k += match piece {
                ListPiece::Text(_) | ListPiece::Math(_) => 1,
                ListPiece::Reference(q) | ListPiece::Element(q) => {
                    match self.splice_within(t, *q, &mut Vec::new(), row.entry_ports().len() == 2) {
                        Splice::Nothing => 0,
                        Splice::Entries(m) => m,
                        Splice::Value => {
                            let plan = &self.ar.refs[q.index()];
                            if let (ListPiece::Element(_), 0, [Step::Elem(x)], None, true) = (
                                piece,
                                plan.hops,
                                &plan.steps[..],
                                plan.prop,
                                plan.entries.is_empty(),
                            ) && children.contains(x)
                                && self.rd.outlined(t).elems[x.index()].component_type == row
                                && k < n
                            {
                                rows.push((k as u32, *x));
                            }
                            1
                        }
                    }
                }
            };
        }
        self.tables[t.index()].plans[e.index()].entry_elems = rows;
    }

    /// The points `pieces`, the children of point list `e` of template
    /// `t`, contribute (ADR 0041, decision 9): a piece of text or math
    /// text is a pair (`(1,2)`, `($a, 2)`); a reference or an element
    /// child the point it names, a point list's points spliced, a list
    /// prop's points (`$pg.vertices`) one per item, and an entry past such
    /// a list's end none. At most `max` of them (`maxNumber`).
    pub(super) fn point_entries(
        &mut self,
        t: TemplateId,
        e: ElemId,
        pieces: Vec<ListPiece>,
        max: f64,
    ) -> Result<Vec<GivenPoint>> {
        let mut out = Vec::with_capacity(pieces.len());
        for piece in pieces {
            match piece {
                ListPiece::Text(text) => {
                    let mut toks = Vec::new();
                    crate::compile::ir::expr::tokenize(&text, &mut toks).map_err(|reason| {
                        Error::BadMath {
                            text: text.clone(),
                            reason,
                        }
                    })?;
                    out.push(GivenPoint::Tuple(self.piece_point(&toks, &text)?));
                }
                ListPiece::Math(frags) => {
                    let mut toks = Vec::new();
                    let mut spelled = String::new();
                    for frag in &frags {
                        match frag {
                            PieceFrag::Text(text) => {
                                crate::compile::ir::expr::tokenize(text, &mut toks).map_err(
                                    |reason| Error::BadMath {
                                        text: text.clone(),
                                        reason,
                                    },
                                )?;
                                spelled.push_str(text);
                            }
                            PieceFrag::Ref(p) => toks.push(Token::Cell(*p)),
                        }
                    }
                    out.push(GivenPoint::Tuple(self.piece_point(&toks, &spelled)?));
                }
                ListPiece::Reference(p) | ListPiece::Element(p) => match self.splice(t, e, p) {
                    Splice::Nothing => {}
                    Splice::Entries(n) => {
                        for k in 1..=n {
                            out.push(GivenPoint::Ref(self.entry_ref(t, p, k)));
                        }
                    }
                    Splice::Value => match self.rd.array_items_of_plan(&self.ar, t, p)? {
                        Some(n) => out.extend((0..n).map(|k| GivenPoint::Item(p, k))),
                        None => out.push(GivenPoint::Ref(p)),
                    },
                },
            }
        }
        out.truncate(cut_at(out.len(), max));
        Ok(out)
    }

    /// A piece of a point list, `(a, b)`, as its two coordinates.
    fn piece_point(&mut self, toks: &[Token], text: &str) -> Result<[Source; 2]> {
        let bad = || Error::BadMath {
            text: text.to_string(),
            reason: "a point list's entry is a pair, `(a, b)`".into(),
        };
        let entries = crate::compile::ir::expr::tuple_entries(toks).ok_or_else(bad)?;
        if entries.len() != 2 {
            return Err(bad());
        }
        self.rd
            .point_from_entries(&mut self.ar, &entries, MathSrc(&[]))
    }

    /// Plan `p`, which names a value list, with entry `k` taken: `$p[k]`.
    fn entry_ref(&mut self, t: TemplateId, p: RefId, k: usize) -> RefId {
        let mut plan = self.ar.refs[p.index()].clone();
        if plan.prop.is_none()
            && let Some(x) = plan.steps.iter().rev().find_map(|s| match s {
                Step::Elem(x) => Some(*x),
                _ => None,
            })
        {
            let ty =
                self.rd.outlined(self.rd.template_up(t, plan.hops)).elems[x.index()].component_type;
            plan.prop = Some(RefProp::of(ty, PropSel::At(PropAt::List)));
        }
        let width = plan.prop.map_or(1, |rp| rp.of.list_width().max(1) as u8);
        plan.entries.push(EntryIndex {
            index: IndexPlan::constant(k as i64),
            width,
        });
        self.ar.push_ref(plan)
    }

    /// Math text with references inside its brackets (`($a, 2)`) as an
    /// expression, its references its leaves.
    fn piece_math(&mut self, frags: &[PieceFrag]) -> Result<ExprId> {
        let mut toks = Vec::new();
        let mut spelled = String::new();
        for frag in frags {
            match frag {
                PieceFrag::Text(text) => {
                    crate::compile::ir::expr::tokenize(text, &mut toks).map_err(|reason| {
                        Error::BadMath {
                            text: text.clone(),
                            reason,
                        }
                    })?;
                    spelled.push_str(text);
                }
                PieceFrag::Ref(p) => {
                    toks.push(Token::Cell(*p));
                    spelled.push(' ');
                    spelled.push_str(&crate::sym::engine::leaf_name(p.get(), false));
                    spelled.push(' ');
                }
            }
        }
        let id = self.rd.parse_tokens(&mut self.ar, &toks, MathSrc(&[]))?;
        self.ar.sym_text.insert(id, SymText::Spelled(spelled));
        Ok(id)
    }

    /// A piece of text parsed as math, as written (`1+1`, `pi`, `x`); None
    /// when it is no math.
    pub(super) fn text_math(&mut self, text: &str) -> Option<ExprId> {
        let mut toks = Vec::new();
        crate::compile::ir::expr::tokenize(text, &mut toks).ok()?;
        let id = self
            .rd
            .parse_tokens(&mut self.ar, &toks, MathSrc(&[]))
            .ok()?;
        self.ar
            .sym_text
            .insert(id, SymText::Spelled(text.to_string()));
        Some(id)
    }
}

/// Whether a type is a list of values whose count follows its children's
/// (ADR 0041, a static sequence): a value list's, cut at its `maxNumber`,
/// or a list operator's (`<sort>`, `<cumulativeSum>`, `<differences>`),
/// as its list declares (`from_children`).
fn is_value_list(ty: ComponentType, points: bool) -> bool {
    ty.def().children.kind == crate::components::ChildrenKind::List
        && ty.list_from_children().is_some()
        && ty
            .list_entry()
            .is_some_and(|k| (k == crate::components::EntryKind::Point) == points)
}

/// `n` entries cut at `maxNumber` `max`: none below 1, the whole entries
/// below a fractional one.
fn cut_at(n: usize, max: f64) -> usize {
    if max.is_nan() || max >= n as f64 {
        n
    } else if max < 1.0 {
        0
    } else {
        max.floor() as usize
    }
}
