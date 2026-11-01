//! Sealing, the compile's last stage before the probe (ADR 0027): what
//! needs every element planned and linked, from the plans, the source
//! and the name table alone, changing no plan. The branch
//! interface of every choice (`choice.rs`), the arity of every operator a
//! plan names, every element's key (`keys.rs`) and the slot offsets. What
//! fails here is boxed by compiling again, not in place: other elements'
//! plans may already name what it would box.

use super::*;

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
        self.finish_choices()?;
        self.check_arity()?;
        self.assign_keys();
        self.slot_offsets();
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
            for el in &tpl.elems {
                if let Some((op, n)) = el.props.iter().find_map(misbound) {
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

    /// Slot offsets, now that planned types know their hidden slot count.
    fn slot_offsets(&mut self) {
        for tpl in &mut self.compiled.templates {
            let mut off = 0;
            for el in &mut tpl.elems {
                el.slot_off = off;
                off += el.props.len().max(el.component_type.prop_defs().len()) as u32;
            }
            tpl.n_slots = off;
        }
    }
}
