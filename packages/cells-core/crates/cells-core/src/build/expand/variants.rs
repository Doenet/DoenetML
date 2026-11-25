//! Variants at expansion (ADR 0076): what each load-time choice picks in
//! the variant the load asked for, handed down the document as it is
//! expanded, and the seed a draw takes from the section it sits in.

use super::*;
use crate::compile::variants::{Desired, VKind, seed_hash};

/// Expand, variants: the picks a variant decides, and the variant of the
/// section a choice sits in.
impl<'c> Builder<'c> {
    /// Hand the document's picks, when its variant decides them, to the
    /// variant components under it.
    pub(super) fn assign_document_variant(&mut self) {
        let Some(chosen) = self.session.variant.clone() else {
            return;
        };
        let (Some(desired), Some(root)) = (&chosen.desired, self.compiled.plans.variants.root)
        else {
            return;
        };
        self.assign(ScopeId::DOCUMENT, root, desired);
    }

    /// Give variant component `k`, in `scope`, the picks `desired`: a
    /// choice's are kept for when it picks; a section's index for the
    /// variant it is; what each component under it picks is handed on.
    pub(super) fn assign(&mut self, scope: ScopeId, k: usize, desired: &Desired) {
        let variants = self.compiled.plans.variants.clone();
        let node = &variants.nodes[k];
        let (t, e) = node.at;
        match node.kind {
            VKind::Select { .. } => {
                // The options' picks are handed on as each is picked.
                self.desired.insert((scope, t, e), desired.clone());
                return;
            }
            VKind::Sequence { .. } | VKind::Shuffle { .. } => {
                self.desired.insert((scope, t, e), desired.clone());
            }
            VKind::Section(_) => {
                if let Some(index) = desired.index {
                    self.section_index.insert((scope, t, e), index);
                }
            }
            VKind::Product | VKind::Opaque => {}
        }
        for (&c, sub) in node.children.iter().zip(&desired.subvariants) {
            if *sub != Desired::default() {
                self.assign(scope, c, sub);
            }
        }
    }

    /// Hand the `j`-th pick (option `b`, expanded in `s`) of the select at
    /// `(scope, t, e)` the picks its variant gives that option's
    /// components.
    pub(super) fn assign_option(
        &mut self,
        scope: ScopeId,
        at: (TemplateId, ElemId),
        j: usize,
        b: usize,
        s: ScopeId,
    ) {
        let Some(sub) = self
            .desired
            .get(&(scope, at.0, at.1))
            .and_then(|d| d.subvariants.get(j))
            .cloned()
        else {
            return;
        };
        let variants = self.compiled.plans.variants.clone();
        if let Some(&option) = variants.node_at(at).and_then(|n| n.children.get(b)) {
            self.assign(s, option, &sub);
        }
    }

    /// The picks, from 1, the variant gives the choice at `(scope, t, e)`.
    pub(super) fn desired_indices(
        &self,
        scope: ScopeId,
        t: TemplateId,
        e: ElemId,
    ) -> Option<&[u64]> {
        self.desired.get(&(scope, t, e))?.indices.as_deref()
    }

    /// The draw of the element at `(scope, t, e)` when the variant decides
    /// its picks: a number below 0 that names them (`program::forced_draw`),
    /// which its instruction reads in place of a number drawn.
    pub(super) fn forced_draw(&self, scope: ScopeId, t: TemplateId, e: ElemId) -> Option<f64> {
        let indices = self.desired_indices(scope, t, e)?;
        let node = self.compiled.plans.variants.node_at((t, e))?;
        let (digits, base): (Vec<u64>, u64) = match &node.kind {
            VKind::Sequence {
                n_options, exclude, ..
            } => (
                indices.iter().map(|i| i - 1).collect(),
                n_options + exclude.len() as u64,
            ),
            // Only where the order it draws is of as many operands as the
            // analysis counted.
            VKind::Shuffle { n, shuffled }
                if self.compiled.plans.templates[t.index()]
                    .plan(e)
                    .list
                    .count()
                    == Some(*n) =>
            {
                (
                    indices
                        .iter()
                        .take(*shuffled as usize)
                        .map(|i| i - 1)
                        .collect(),
                    *shuffled as u64,
                )
            }
            _ => return None,
        };
        Some(crate::program::forced_draw(&digits, base))
    }

    /// The nearest section with a `<variantControl>`, or the document,
    /// that holds the element at `(scope, t, e)`, not the element itself.
    fn variant_ancestor(
        &self,
        mut scope: ScopeId,
        mut t: TemplateId,
        mut e: ElemId,
    ) -> Option<(ScopeId, TemplateId, ElemId)> {
        let variants = &self.compiled.plans.variants;
        loop {
            let tpl = &self.compiled.plans.templates[t.index()];
            let mut a = if e == ROOT_SCOPE {
                ROOT_SCOPE
            } else {
                tpl.elems[e.index()].name_scope
            };
            while a != ROOT_SCOPE {
                if variants
                    .node_at((t, a))
                    .is_some_and(|n| matches!(n.kind, VKind::Section(_)))
                {
                    return Some((scope, t, a));
                }
                a = tpl.elems[a.index()].name_scope;
            }
            let (pt, pe) = tpl.parent?;
            scope = self.scopes[scope].0;
            t = pt;
            e = pe;
        }
    }

    /// The variant of the section at `(scope, t, a)`: its index, name and
    /// seed. The document's is the load's; a section's is the one its
    /// variant gave it, else one drawn from what holds it, as the current
    /// core draws it from its parent's generator.
    fn section_variant(&self, scope: ScopeId, t: TemplateId, a: ElemId) -> (u64, String, u64) {
        let variants = &self.compiled.plans.variants;
        let Some(VKind::Section(v)) = variants.node_at((t, a)).map(|n| &n.kind) else {
            return (1, String::new(), self.session.seed);
        };
        let is_root = variants
            .root
            .is_some_and(|r| variants.nodes[r].at == (t, a));
        if is_root {
            return match &self.session.variant {
                Some(c) => (c.index, c.name.clone(), self.session.seed),
                None => (1, v.names[0].clone(), self.session.seed),
            };
        }
        let n = v.names.len() as u64;
        let index = match self.section_index.get(&(scope, t, a)) {
            Some(&i) => i,
            None => {
                let h = choice::splitmix(self.seeded_stream(scope, t, a));
                let u = (h >> 11) as f64 / (1u64 << 53) as f64;
                ((u * n as f64) as u64).min(n - 1) + 1
            }
        };
        let i = index as usize - 1;
        (index, v.names[i].clone(), seed_hash(&v.seeds[i]))
    }

    /// The seed the draws of the element at `(scope, t, e)` start from:
    /// the variant seed of the section with a control that holds it, else
    /// the document's.
    pub(super) fn enclosing_seed(&self, scope: ScopeId, t: TemplateId, e: ElemId) -> u64 {
        // A sampler the variant does not determine draws from the load's
        // own seed.
        if let Some(v) = &self.session.variant
            && self.compiled.plans.variants.free_draws.contains(&(t, e))
        {
            return v.sample_seed;
        }
        match self.variant_ancestor(scope, t, e) {
            Some((s, t, a)) => self.section_variant(s, t, a).2,
            None => self.session.seed,
        }
    }

    /// The name of the variant the element at `(scope, t, e)` is in: its
    /// section's, else the document's.
    pub(super) fn variant_name(&self, scope: ScopeId, t: TemplateId, e: ElemId) -> Option<String> {
        match self.variant_ancestor(scope, t, e) {
            Some((s, t, a)) => Some(self.section_variant(s, t, a).1),
            None => self.session.variant.as_ref().map(|c| c.name.clone()),
        }
    }
}
