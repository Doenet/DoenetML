//! `<repeat for="1 2 3">`: a repeat over a literal list in its `for`, an
//! anonymous static list (ADR 0074). The parser's normalizer has made each
//! piece an element of the repeat's `type` (`<math>1</math>`, by default
//! math, or `number`, `text`, `boolean`), or left a lone reference as it
//! is. One iteration per piece; the item `valueName` names is a value of
//! that type, the piece the iteration's position names.

use super::{ListEntry, Planning};
use crate::compile::ir::record::ListPiece;
use crate::compile::read::SourceReader;
use crate::compile::*;
use crate::components::EntryKind;

/// The kind of value a `<repeat>` whose `for` is a literal list iterates
/// over: by its pieces' tag, else its `type` (math by default, as the
/// normalizer reads it); None when `for` is one reference (`$l`) or
/// absent. Reads `type`, so the attribute is not refused as unread.
pub(in crate::compile) fn literal_for(rd: &SourceReader<'_>, el: NodeId) -> Option<EntryKind> {
    let d = rd.dast;
    let a = d.attr_peek(el, "for")?;
    // Pieces the normalizer made elements; a lone reference, or references
    // alone, it leaves as written.
    let pieces = d.attr_children(a);
    if !pieces.iter().any(|&n| d.kind(n) == NodeKind::Element) {
        return None;
    }
    let kind = |tag: &str| match tag {
        "number" => EntryKind::Number,
        "text" => EntryKind::Text,
        "boolean" => EntryKind::Boolean,
        _ => EntryKind::Math,
    };
    let written = d.attr(el, "type").and_then(|t| rd.attr_text(t));
    Some(
        match pieces.iter().find(|&&n| d.kind(n) == NodeKind::Element) {
            Some(&n) => kind(d.str(n)),
            None => kind(written.as_deref().unwrap_or("math").trim()),
        },
    )
}

/// The number an element piece's text is, when it is a plain one.
fn plain_number(d: &crate::dast::Dast, n: NodeId) -> Option<f64> {
    let kids = d.children(n);
    if !kids.iter().all(|&k| d.kind(k) == NodeKind::Text) {
        return None;
    }
    let text: String = kids.iter().map(|&k| d.str(k)).collect();
    text.trim().parse::<f64>().ok().filter(|v| v.is_finite())
}

/// The row type of an item of `kind`: a number, a text, a boolean or a
/// math value.
pub(in crate::compile) fn item_type(kind: EntryKind) -> ComponentType {
    match kind {
        EntryKind::Number => Role::Value,
        EntryKind::Text => Role::TextValue,
        EntryKind::Boolean => Role::BooleanValue,
        _ => Role::MathValue,
    }
    .ty()
}

/// Planning, a `<repeat>` over a literal list. Reads the repeat's `for` and
/// what outlining settled of its item, never another element's plan (ADR
/// 0029).
impl Planning<'_> {
    /// A repeat over the pieces of its `for` (`kind` values): its count the
    /// number of pieces, a constant; each piece a hidden port of the
    /// repeat, planned where the repeat sits; its item's value a choose
    /// over them by the iteration's position.
    pub(super) fn plan_repeat_for_literal(
        &mut self,
        t: TemplateId,
        e: ElemId,
        kind: EntryKind,
    ) -> Result<()> {
        let Elem {
            node: el,
            name_scope: scope,
            component_type: own_type,
            ..
        } = *self.rd.own_row(t, e);
        let d = self.rd.dast;
        let a = d.attr(el, "for").expect("a literal `for`");
        let mut pieces = Vec::new();
        // Plain numbers stay numbers, of any type (ADR 0043): a math list
        // of them is numbers, unless one piece is no number.
        let numbers = kind == EntryKind::Math
            && d.attr_children(a).iter().all(|&n| match d.kind(n) {
                NodeKind::Element => plain_number(d, n).is_some(),
                NodeKind::Text => d.str(n).trim().is_empty(),
                _ => false,
            });
        for &n in d.attr_children(a) {
            if numbers && d.kind(n) == NodeKind::Element {
                pieces.push(Source::constant(plain_number(d, n).expect("a number")));
                continue;
            }
            match d.kind(n) {
                // A reference to a static sequence is its entries (ADR
                // 0041, decision 9).
                NodeKind::Macro => {
                    let p = self.rd.plan_ref(&mut self.ar, t, scope, n)?;
                    let spliced =
                        self.list_entries(t, e, vec![ListPiece::Reference(p)], f64::INFINITY)?;
                    for entry in spliced {
                        let ListEntry::Ref(p) = entry else {
                            unreachable!("a reference splices references")
                        };
                        pieces.push(self.piece_ref(kind, p));
                    }
                }
                NodeKind::Element => pieces.push(self.literal_piece(t, scope, kind, n)?),
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                _ => {
                    return Err(Error::Unsupported(
                        "<repeat for> of text that is no list of values".into(),
                    ));
                }
            }
        }
        let n = pieces.len();
        if n > crate::limits::MAX_VEC_IN - 1 {
            return Err(Error::Unsupported(format!(
                "<repeat for> of more than {} values",
                crate::limits::MAX_VEC_IN - 1
            )));
        }
        let mut wiring = ElemWiring::of(own_type);
        let ports: Vec<Port> = pieces.into_iter().map(|s| wiring.hidden(s)).collect();
        wiring.set_public_sources(prop::repeat_for::Props {
            count: Source::constant(n as f64),
            hide: self.repeat_hide(el),
        });
        self.tables[t.index()].plans[e.index()].props = wiring.finish().0;
        // The item, element 0 of the body when `valueName` names one, of
        // the type outlining settled: the piece at its position.
        let Some((sub, body)) = self.rd.body_rows(t, e) else {
            unreachable!("a repeat has a body template")
        };
        let item = body
            .first()
            .filter(|x| x.node == NodeId::NONE && x.component_type == item_type(kind))
            .map(|x| x.component_type);
        let Some(item) = item.filter(|_| self.has_item(t, e)) else {
            return Ok(());
        };
        let [port] = item.entry_ports()[..] else {
            unreachable!("a value's row has one entry port")
        };
        let repeat = self.ar.push_ref(RefPlan {
            hops: 1,
            steps: vec![Step::Elem(e)],
            prop: None,
            entries: Vec::new(),
            display: RefDisplay::Spelled("(repeat)".into()),
            node: NodeId::NONE,
        });
        let n_table = item.prop_defs().len();
        // Hidden ports of the item after its table: the position, then
        // an alias of each piece (a text is read by the choose only as
        // its own port).
        let mut hidden = vec![Source::Leaf(Leaf::Scope(ScopeConst::IterIndex))];
        hidden.extend(ports.iter().map(|p| Source::port_of(repeat, p.index())));
        let mut args = vec![Arg::Own(Port::table(n_table))];
        args.extend((0..n).map(|k| Arg::Own(Port::table(n_table + 1 + k))));
        let value = Source::op(
            OpSpec::Vec(VecOp::Choose {
                n: crate::limits::byte(n),
            }),
            args,
        );
        let mut props: Vec<Source> = (0..n_table)
            .map(|i| {
                if i == port {
                    value.clone()
                } else {
                    Source::absent()
                }
            })
            .collect();
        props.extend(hidden);
        self.tables[sub.index()].plans[0].props = props;
        Ok(())
    }

    /// A piece that is reference `p`: its value, as a math cell when the
    /// pieces are math (a number among them made one), so the choose over
    /// them holds one kind.
    fn piece_ref(&mut self, kind: EntryKind, p: RefId) -> Source {
        if kind != EntryKind::Math {
            return Source::reference(p);
        }
        let id = self.ar.arena.push(Expr::Cell(p));
        self.ar.sym_text.insert(id, SymText::Leaf(p));
        Source::sym_expr(id, Post::None)
    }

    /// A piece of a literal `for`, an element the normalizer made: one
    /// reference alone, or its text as a value of `kind`.
    fn literal_piece(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        kind: EntryKind,
        n: NodeId,
    ) -> Result<Source> {
        let d = self.rd.dast;
        let kids = d.children(n);
        let lone = kids
            .iter()
            .filter(|&&k| !(d.kind(k) == NodeKind::Text && d.str(k).trim().is_empty()))
            .copied()
            .collect::<Vec<_>>();
        if let [m] = lone[..]
            && d.kind(m) == NodeKind::Macro
        {
            let p = self.rd.plan_ref(&mut self.ar, t, scope, m)?;
            return Ok(self.piece_ref(kind, p));
        }
        let text = || {
            kids.iter()
                .filter(|&&k| d.kind(k) == NodeKind::Text)
                .map(|&k| d.str(k))
                .collect::<String>()
        };
        let no_refs = kids.iter().all(|&k| d.kind(k) == NodeKind::Text);
        Ok(match kind {
            EntryKind::Number => self.rd.plan_scalar(&mut self.ar, t, scope, kids)?,
            EntryKind::Math => {
                let id = self.rd.plan_sym_math(&mut self.ar, t, scope, kids)?;
                Source::sym_expr(id, Post::None)
            }
            EntryKind::Text if no_refs => {
                Source::Leaf(Leaf::GivenText(Some(self.ar.intern_literal(d, &text()))))
            }
            EntryKind::Boolean if no_refs => {
                Source::constant(if text().trim().eq_ignore_ascii_case("true") {
                    1.0
                } else {
                    0.0
                })
            }
            _ => {
                return Err(Error::Unsupported(
                    "<repeat for> of a text or boolean mixing text and references".into(),
                ));
            }
        })
    }
}
