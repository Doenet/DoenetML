use crate::dast::untagged_flat_dast::Index;

use super::{
    macro_resolve::Resolver,
    untagged_flat_dast::{FlatElement, FlatError, FlatNode, FlatRoot},
};

/// An `Expander` replaces all macros with their `DastElement`-equivalent forms. For example
/// ```xml
/// <point name="p" />
/// $p
/// ```
/// expands to
/// ```xml
/// <point name="p" />
/// <point extends="p" />
/// ```
/// Care is taken to preserve the tag name of the referent. (E.g., a `<point />` maps to a `<point extends="..." />`,
/// a `<line />` maps to a `<line extends="..." />`, etc.)
pub struct Expander {}

impl Expander {
    pub fn expand(flat_root: &mut FlatRoot) {
        // Get the name of the element at the given index. If the index does not correspond to an element, panic.
        let get_name = |idx: Index| -> String {
            match &flat_root.nodes[idx] {
                FlatNode::Element(elm) => elm.name.clone(),
                _ => panic!("Tried to get the name of a non-element"),
            }
        };

        let resolver = Resolver::from_flat_root(flat_root);
        let nodes_for_replacement: Vec<FlatNode> = flat_root
            .nodes
            .iter()
            .flat_map(|node| match node {
                FlatNode::Macro(macro_) => {
                    let resolved = match resolver.resolve(&macro_.path, macro_.idx) {
                        Ok(ref_resolution) => {
                            let name = get_name(ref_resolution.node_idx);
                            FlatNode::Element(FlatElement {
                                idx: macro_.idx,
                                parent: macro_.parent,
                                attributes: Vec::new(),
                                children: Vec::new(),
                                name,
                                position: macro_.position.clone(),
                                extending: Some(ref_resolution),
                            })
                        }
                        Err(err) => FlatNode::Error(FlatError {
                            idx: macro_.idx,
                            parent: macro_.parent,
                            message: format!("Macro resolution error: {}", err),
                            position: macro_.position.clone(),
                        }),
                    };
                    Some(resolved)
                }
                _ => None,
            })
            .collect();

        // We know what nodes we need to replace now, so we can mutate `flat_root` and replace them.
        for node in nodes_for_replacement.into_iter() {
            let idx = node.idx();
            flat_root.nodes[idx] = node;
        }
    }
}

#[cfg(test)]
#[path = "macro_expand.test.rs"]
mod test;
