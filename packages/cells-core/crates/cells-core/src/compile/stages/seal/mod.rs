//! Sealing: what needs every element planned and linked, changing no
//! plan. The branch interface of every choice, operator arity, every
//! element's key, the slot offsets, and every port's type. What fails here
//! is boxed by compiling again, not in place.

mod choice;
pub(crate) mod keys;
mod types;

use crate::compile::*;

/// Seal what the stages before it made: outlining's rows and choices,
/// boxing's and planning's tables, the arenas, and which port holds each
/// given leaf. Sealing's tables: a [`SealedTemplate`] per template, a
/// [`ChoiceSeal`] per choice, and the keys.
pub(in crate::compile) fn seal<'a>(
    dast: &'a Dast,
    settled: &'a Settled,
    ar: &'a Arenas,
    tables: &'a [Tables],
    given: &'a HashMap<(TemplateId, ElemId), HashMap<GivenId, Port>>,
) -> std::result::Result<(Vec<SealedTemplate>, Vec<ChoiceSeal>, keys::Keys), Failure> {
    crate::trace::span("seal").run(|| Seal::new(dast, settled, ar, tables, given).run())
}

/// Sealing's state: every earlier stage's tables, read-only, and what it
/// finds of each choice and the keys, its own.
struct Seal<'a> {
    /// The reference and expression arenas, read-only.
    ar: &'a Arenas,
    dast: &'a Dast,
    names: &'a NameTable,
    /// Outlining's part of every template.
    templates: &'a [Outlined],
    /// Boxing's and planning's tables of every template.
    tables: &'a [Tables],
    /// Every choice as outlining made it.
    choices: &'a [ChoiceDef],
    /// What sealing finds of each choice, as it finds it.
    choice_seals: Vec<ChoiceSeal>,
    /// By (template, element), which port holds each given leaf, by which a
    /// key names a hidden port.
    given: &'a HashMap<(TemplateId, ElemId), HashMap<GivenId, Port>>,
    /// Every element's stable key, once sealing has made them.
    keys: keys::Keys,
}

/// Sealing: the stage's entry, its order of passes, operator arity and the slot
/// offsets. Reads every earlier stage's tables; writes only the keys and
/// [`SealedTemplate`]s.
impl<'a> Seal<'a> {
    /// Sealing over what the stages before it made: outlining's rows and
    /// choices, boxing's and planning's tables, the arenas, and which port
    /// holds each given leaf.
    fn new(
        dast: &'a Dast,
        settled: &'a Settled,
        ar: &'a Arenas,
        tables: &'a [Tables],
        given: &'a HashMap<(TemplateId, ElemId), HashMap<GivenId, Port>>,
    ) -> Self {
        Seal {
            ar,
            dast,
            names: &settled.names,
            templates: &settled.templates,
            tables,
            choices: &settled.choices,
            choice_seals: Vec::new(),
            given,
            keys: keys::Keys::default(),
        }
    }

    /// Sealing's tables: a [`SealedTemplate`] per template, a
    /// [`ChoiceSeal`] per choice, and the keys.
    fn run(
        mut self,
    ) -> std::result::Result<(Vec<SealedTemplate>, Vec<ChoiceSeal>, keys::Keys), Failure> {
        self.choice_seals = vec![ChoiceSeal::default(); self.choices.len()];
        crate::trace::span("used names").run(|| self.gather_used_names());
        crate::trace::span("choices").run(|| self.finish_choices())?;
        crate::trace::span("arity").run(|| self.check_arity())?;
        let keys = crate::trace::span("keys").run(|| self.assign_keys());
        let offsets = crate::trace::span("slot offsets").run(|| self.slot_offsets());
        // Every port's type, once every element is planned and linked and
        // every choice's interface is known (ADR 0032).
        let types = crate::trace::span("types").run(|| self.infer_types(&offsets))?;
        // Sealing's table, made once (ADR 0031).
        let sealed = (keys.into_iter().zip(offsets).zip(types))
            .map(|((keys, (offs, n_slots)), types)| SealedTemplate {
                elems: (keys.into_iter().zip(offs))
                    .map(|(key, slot_off)| Sealed { key, slot_off })
                    .collect(),
                n_slots,
                types,
            })
            .collect();
        Ok((sealed, self.choice_seals, self.keys))
    }

    /// Template `t`'s outlined part and its tables, read together.
    fn view(&self, t: TemplateId) -> TemplateRef<'a> {
        TemplateRef {
            outlined: &self.templates[t.index()],
            tables: &self.tables[t.index()],
        }
    }

    /// Every template, in order.
    fn template_ids(&self) -> impl Iterator<Item = TemplateId> + use<'a> {
        TemplateId::below(self.templates.len())
    }

    /// Every operator a plan names reads as many inputs as it takes. One
    /// that does not is a core bug, reported on its element.
    fn check_arity(&self) -> std::result::Result<(), Failure> {
        fn misbound(p: &Source) -> Option<(OpSpec, usize)> {
            match p {
                Source::Flow(Flow::Op(op, args)) if !op.accepts(args.len()) => {
                    Some((*op, args.len()))
                }
                Source::Specialize(ScopePred::FirstIteration, a, b) => {
                    misbound(a).or_else(|| misbound(b))
                }
                _ => None,
            }
        }
        for t in self.template_ids() {
            let tpl = self.view(t);
            for (e, el) in tpl.rows().enumerate() {
                let plan = tpl.plan(ElemId::from_index(e));
                if let Some((op, n)) = plan.props.iter().find_map(misbound) {
                    let tag = el.component_type.tag();
                    return Err(Failure {
                        error: Error::Internal(format!(
                            "<{tag}> plans {op:?} over {n} inputs, which takes {}",
                            op.arity()
                        )),
                        node: (el.node != NodeId::NONE).then_some(el.node),
                    });
                }
            }
        }
        Ok(())
    }

    /// Slot offsets, now that planned types know their hidden port count:
    /// by template, each element's, and how many slots they take.
    fn slot_offsets(&self) -> Vec<(Vec<TemplateSlot>, u32)> {
        (self.template_ids())
            .map(|t| {
                let tpl = self.view(t);
                let mut off = 0;
                let offs = (tpl.rows().enumerate())
                    .map(|(e, el)| {
                        let at = TemplateSlot::from_index(off);
                        let n_props = tpl.plan(ElemId::from_index(e)).props.len();
                        off += n_props.max(el.component_type.prop_defs().len());
                        at
                    })
                    .collect();
                (
                    offs,
                    u32::try_from(off).expect("fewer template slots than a u32 counts"),
                )
            })
            .collect()
    }
}
