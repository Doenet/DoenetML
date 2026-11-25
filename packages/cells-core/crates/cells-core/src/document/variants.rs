//! What variant a loaded document is (ADR 0085), as the current core
//! reports it: `generatedVariantInfo`.

use serde_json::{Value, json};

use super::*;
use crate::compile::variants::VKind;

impl Document {
    /// The variant the document was loaded as and what its variant
    /// components picked, as the current core's `generatedVariantInfo`:
    /// `{index, name, meta: {createdBy}, subvariants}`, a subvariant per
    /// variant component under the document. None for a document loaded
    /// at a seed, or one with a variant component whose picks this core
    /// does not report (any but a selection from a sequence of literal
    /// parameters, for now).
    pub fn generated_variant(&self) -> Option<Value> {
        let chosen = self.session.variant.as_ref()?;
        let variants = &self.loaded.variants;
        let root = variants.root?;
        let subvariants = variants.nodes[root]
            .children
            .iter()
            .map(|&k| self.generated_of(k))
            .collect::<Option<Vec<Value>>>()?;
        Some(json!({
            "index": chosen.index,
            "name": chosen.name,
            "meta": { "createdBy": self.built.root.index() },
            "subvariants": subvariants,
        }))
    }

    /// What variant component `k`, in the document's own scope, picked.
    fn generated_of(&self, k: usize) -> Option<Value> {
        let node = &self.loaded.variants.nodes[k];
        let VKind::Sequence { from, step, .. } = node.kind else {
            return None;
        };
        let components = &self.built.components;
        let c = (0..components.dast_node.len()).find(|&c| {
            components.dast_node[c] == node.node && components.scope[c] == ScopeId::DOCUMENT
        })?;
        let c = CompIdx::from_index(c);
        let cells = self.built.prop_cells(c, "values")?;
        let indices = cells
            .iter()
            .map(|&cell| {
                let v = self.built.cells[cell.index()];
                let v = if self.built.value_types[cell.index()] == ValueType::Text {
                    let s = self.built.strings.get(StrId::from_value(v));
                    crate::program::texts::letters_number(s)?
                } else {
                    v
                };
                Some(((v - from) / step).round() + 1.0)
            })
            .collect::<Option<Vec<f64>>>()?;
        Some(json!({
            "indices": indices,
            "meta": { "createdBy": c.index() },
        }))
    }
}
