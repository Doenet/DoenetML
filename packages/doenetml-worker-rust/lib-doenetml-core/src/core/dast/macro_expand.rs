use std::{collections::HashMap, mem};

use crate::dast::untagged_flat_dast::Index;

use super::{
    macro_resolve::Resolver,
    untagged_flat_dast::{FlatElement, FlatError, FlatNode, FlatRoot, UntaggedContent},
    DastElement, DastElementContent,
};

/// An `Expander` replaces all macros with their `DastElement`-equivalent forms. For example
/// ```xml
/// <point name="p" />
/// $p
/// ```
/// expands to
/// ```xml
/// <point name="p" />
/// <point extend="p" />
/// ```
/// Care is taken to preserve the tag name of the referent. (E.g., a `<point />` maps to a `<point extends="..." />`,
/// a `<line />` maps to a `<line extend="..." />`, etc.)
pub struct Expander {}

impl Expander {
    /// Expand all macros and function macros into their "xml" form. After expansion,
    /// the resulting tree may not be serializable as XML since element attributes may contain
    /// other elements.
    pub fn expand(flat_root: &mut FlatRoot) {
        let resolver = Resolver::from_flat_root(flat_root);

        for idx in 0..flat_root.nodes.len() {
            // The original `nodes[idx]` node is being completely replaced, so we are free to take its value,
            // which will prevent the borrow checker form complaining if we mutate `flat_root` during processing.
            flat_root.nodes[idx] = match mem::take(&mut flat_root.nodes[idx]) {
                FlatNode::Macro(macro_) => {
                    // A macro $f get's replace with <foo extend="f" /> where `foo` is the tag name of the referent.
                    // e.g. <point name="p" />$p becomes <point name="p" /><point extend="p" />
                    // Expanding a macro is can be done with a single replacement.

                    //flat_root.nodes[idx] = resolved
                    match resolver.resolve(&macro_.path, macro_.idx) {
                        Ok(ref_resolution) => {
                            // Get the tag name of the referent
                            let name = match &flat_root.nodes[ref_resolution.node_idx] {
                                FlatNode::Element(e) => e.name.clone(),
                                _ => panic!("Expected an element"),
                            };
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
                    }
                }
                FlatNode::FunctionMacro(function_macro) => {
                    // A function ref `$$f(x)` becomes `<evaluate extend="f"><ol><li>x</li></ol></evaluate>`
                    // This involves creating multiple new nodes and setting them as children of the `evaluate` node.
                    fn lookup_idx(untagged: &UntaggedContent) -> Index {
                        match untagged {
                            UntaggedContent::Ref(idx) => *idx,
                            _ => panic!("Expected a reference"),
                        }
                    }
                    let resolved = match resolver.resolve(&function_macro.path, function_macro.idx)
                    {
                        Ok(ref_resolution) => {
                            let mut evaluate_node = FlatElement {
                                idx: function_macro.idx,
                                parent: function_macro.parent,
                                attributes: Vec::new(),
                                children: Vec::new(),
                                name: "evaluate".to_string(),
                                position: function_macro.position.clone(),
                                extending: Some(ref_resolution),
                            };
                            // An `<evaluate />` node's children are the inputs to the function.
                            // They take the form of an ordered list of `<li />` nodes.
                            if let Some(inputs) = &function_macro.input {
                                // We create the children of `evaluate_node` in two steps. First we create the `<ol />` node
                                // with the correct number of `<li />` children. Then we set the `<li />` children to be the
                                // inputs to the function.
                                let dast_ol = DastElement {
                                    name: "ol".to_string(),
                                    attributes: HashMap::new(),
                                    children: inputs
                                        .iter()
                                        .map(|_| DastElementContent::element_with_name("li"))
                                        .collect(),
                                    position: function_macro.position.clone(),
                                    data: None,
                                };
                                // Insert the `ol` into `flat_root`
                                let ol = flat_root.merge_content(
                                    &DastElementContent::Element(dast_ol),
                                    Some(idx),
                                );
                                let ol_node_children_indices =
                                    match &flat_root.nodes[lookup_idx(&ol)] {
                                        FlatNode::Element(e) => e,
                                        _ => panic!("Expected an element"),
                                    }
                                    .children
                                    .iter()
                                    .map(lookup_idx)
                                    .collect::<Vec<_>>();

                                // Set the inputs as children of the `li` nodes.
                                for (input_content, li_idx) in
                                    inputs.iter().zip(ol_node_children_indices)
                                {
                                    // `input_content` (the argument to the function) have already been inserted into flat_root.nodes
                                    // so we can safely clone `input_content` and set it as children. All references contained
                                    // within should be valid.
                                    flat_root.set_children(li_idx, input_content.clone());
                                }

                                // Set the `ol` as a child of the `evaluate` node.
                                evaluate_node.children.push(ol);
                            }

                            FlatNode::Element(evaluate_node)
                        }
                        Err(err) => FlatNode::Error(FlatError {
                            idx: function_macro.idx,
                            parent: function_macro.parent,
                            message: format!("Macro resolution error: {}", err),
                            position: function_macro.position.clone(),
                        }),
                    };

                    resolved
                }
                other => other,
            };
        }
    }
}

#[cfg(test)]
#[path = "macro_expand.test.rs"]
mod test;
