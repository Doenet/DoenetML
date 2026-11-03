//! Sealing, the compile's last stage before the abstract build (ADR 0027):
//! what needs every element planned and linked, from the plans, the source
//! and the name table alone, changing no plan. The branch interface of
//! every choice (`choice.rs`), the arity of every operator a plan names,
//! every element's key (`keys.rs`) and the slot offsets. What fails here is
//! boxed by compiling again, not in place: other elements' plans may
//! already name what it would box.

pub(in crate::compile) mod choice;
pub(crate) mod keys;

use crate::compile::*;

pub(in crate::compile) struct Seal<'a> {
    pub(in crate::compile) compiled: &'a mut Compiled,
    pub(in crate::compile) dast: &'a Dast,
    pub(in crate::compile) names: &'a NameTable,
    /// By (template, element), a geometry element's shared state
    /// (`Compiler::shared_state`), which a key names a hidden slot by.
    pub(in crate::compile) shared_state: &'a HashMap<(u32, u32), HashMap<SharedState, u8>>,
}

impl Seal<'_> {
    pub(in crate::compile) fn run(mut self) -> std::result::Result<(), Failure> {
        crate::trace::span("used names").run(|| self.gather_used_names());
        crate::trace::span("choices").run(|| self.finish_choices())?;
        crate::trace::span("arity").run(|| self.check_arity())?;
        let keys = crate::trace::span("keys").run(|| self.assign_keys());
        let offsets = crate::trace::span("slot offsets").run(|| self.slot_offsets());
        // Sealing's table, made once (ADR 0031).
        for ((tpl, keys), (offs, n_slots)) in
            self.compiled.templates.iter_mut().zip(keys).zip(offsets)
        {
            tpl.sealed = SealedTemplate {
                elems: (keys.into_iter().zip(offs))
                    .map(|(key, slot_off)| Sealed { key, slot_off })
                    .collect(),
                n_slots,
            };
        }
        Ok(())
    }

    /// Every operator a plan names reads as many inputs as it takes. One
    /// that does not is a core bug, reported on its element here rather
    /// than when a build binds it (`OpSpec::bind`).
    fn check_arity(&self) -> std::result::Result<(), Failure> {
        fn misbound(p: &Source) -> Option<(OpSpec, usize)> {
            match p {
                Source::Op(op, args) if !op.accepts(args.len()) => Some((*op, args.len())),
                Source::FirstIteration(a, b) => misbound(a).or_else(|| misbound(b)),
                _ => None,
            }
        }
        for tpl in &self.compiled.templates {
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

    /// Slot offsets, now that planned types know their hidden slot count:
    /// by template, each element's, and how many slots they take.
    fn slot_offsets(&self) -> Vec<(Vec<u32>, u32)> {
        (self.compiled.templates.iter())
            .map(|tpl| {
                let mut off = 0;
                let offs = (tpl.rows().enumerate())
                    .map(|(e, el)| {
                        let at = off;
                        let n_props = tpl.plan(ElemId::from_index(e)).props.len();
                        off += n_props.max(el.component_type.prop_defs().len()) as u32;
                        at
                    })
                    .collect();
                (offs, off)
            })
            .collect()
    }
}

impl Compiler<'_> {
    /// Sealing (`seal.rs`): what reads every plan, the source and the name
    /// table, and changes no plan; what fails is boxed by compiling again.
    pub(in crate::compile) fn seal(
        &mut self,
        planned: &Planned,
    ) -> std::result::Result<(), Failure> {
        let settled = self.settled();
        seal::Seal {
            compiled: &mut self.compiled,
            dast: self.dast,
            names: &settled.names,
            shared_state: &planned.shared_state,
        }
        .run()
    }
}
