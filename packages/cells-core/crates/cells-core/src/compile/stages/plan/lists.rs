//! Planning, lists: what a reference or an element among a list's or an
//! operator's children contributes, told from the records alone (ADR 0041,
//! decisions 2, 5 and 9). A reference to a static sequence (a value list
//! whose count is a fact of the source) contributes its entries, spliced;
//! a reference to one entry past such a list's end, one missing entry (ADR
//! 0046: a blank in a list, the missing value to an operator); anything
//! else, one value, as a reference always did.

use super::Planning;
use crate::compile::ir::record::{ListPiece, PieceFrag};
use crate::compile::*;

/// What a reference among a list's children contributes.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Splice {
    /// One value: the reference itself, as many cells as it names.
    Value,
    /// A literal index past the end of a static sequence (`$l[9]` of
    /// three): one entry, the missing value the reference reads (ADR 0046).
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
        let splice = self.splice_within(t, p, &mut Vec::new());
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
    ) -> Splice {
        let plan = &self.ar.refs[p.index()];
        let mut last = None;
        for step in &plan.steps {
            match step {
                Step::Elem(x) => last = Some(*x),
                // A reference that names nothing is one missing entry.
                Step::Iter(_) | Step::Item(..) | Step::Iface(..) | Step::Nothing => {
                    return Splice::Value;
                }
            }
        }
        let Some(x) = last else {
            return Splice::Value;
        };
        let rt = self.rd.template_up(t, plan.hops);
        let ty = self.rd.outlined(rt).elems[x.index()].component_type;
        if !is_value_list(ty) {
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
        let Some(n) = self.list_len(rt, x, visiting) else {
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
            ([], Some(q)) => match self.splice_within(t, q, visiting) {
                Splice::Entries(n) => Some(n),
                _ => None,
            },
            _ => {
                let mut n = 0;
                for piece in pieces {
                    n += match piece {
                        ListPiece::Text(_) | ListPiece::Math(_) => 1,
                        ListPiece::Reference(q) | ListPiece::Element(q) => {
                            match self.splice_within(t, *q, visiting) {
                                Splice::Value | Splice::Nothing => 1,
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
                    // Past the end, the reference reads the missing value:
                    // a blank entry (ADR 0046).
                    Splice::Value | Splice::Nothing => entries.push(ListEntry::Ref(p)),
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
        plan.entries.push(EntryIndex {
            index: IndexPlan::constant(k as i64),
            width: 1,
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
fn is_value_list(ty: ComponentType) -> bool {
    ty.def().children.kind == crate::components::ChildrenKind::List
        && ty.list_from_children().is_some()
        && ty
            .list_entry()
            .is_some_and(|k| k != crate::components::EntryKind::Point)
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
