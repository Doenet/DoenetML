use std::{collections::HashMap, mem};

use anyhow::anyhow;

use super::{
    flat_dast::untagged_flat_dast::{
        FlatElement, FlatError, FlatNode, FlatRoot, Index, UntaggedContent,
    },
    macro_resolve::{RefResolution, Resolver},
    DastElement, DastElementContent, DastError,
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
    /// Check that the referent of every `extending` prop and the node that is extending share the same tag name.
    /// Extending nodes are replaced with Error nodes if the tag names don't match. A special exception is made for
    /// `<evaluate />` nodes. The type of element they extend is not checked.
    pub fn assert_ref_types_match(flat_root: &mut FlatRoot) {
        for i in 0..flat_root.nodes.len() {
            let node = &flat_root.nodes[i];
            if let FlatNode::Element(elm) = node {
                if let Some(ref_resolution) = &elm.extending {
                    if elm.name.eq_ignore_ascii_case("evaluate") {
                        // `<evaluate />` are special. They don't extend in the usual sense.
                        continue;
                    }
                    let referent = &flat_root.nodes[ref_resolution.node_idx];
                    let name = &elm.name;
                    let referent_name = match referent {
                        FlatNode::Element(referent) => &referent.name,
                        _ => "",
                    };
                    if !name.eq_ignore_ascii_case(referent_name) {
                        flat_root.nodes[i] = FlatNode::Error(FlatError {
                            idx: elm.idx,
                            parent: elm.parent,
                            message: format!(
                                "Referent and extending node have different tag names: {} and {}",
                                name, referent_name
                            ),
                            position: elm.position.clone(),
                        });
                    }
                }
            }
        }
    }

    /// Expand all macros and function macros into their "xml" form. After expansion,
    /// the resulting tree may not be serializable as XML since element attributes may contain
    /// other elements.
    pub fn expand(flat_root: &mut FlatRoot) {
        let resolver = Resolver::from_flat_root(flat_root);
        Expander::expand_macros(flat_root, &resolver);
        Expander::consume_extend_attributes(flat_root);
    }

    /// Expand all macros and function macros into their "xml" form.
    fn expand_macros(flat_root: &mut FlatRoot, resolver: &Resolver) {
        for idx in 0..flat_root.nodes.len() {
            // The original `nodes[idx]` node is being completely replaced, so we are free to take its value,
            // which will prevent the borrow checker from complaining if we mutate `flat_root` during processing.
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
                                    match &flat_root.nodes[lookup_idx(&ol).unwrap()] {
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
                                    flat_root.set_children(li_idx.unwrap(), input_content.clone());
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

    /// Remove all `extend` attributes from the `FlatRoot` and replace them with the index of their referent.
    /// This should be called _after_ all macros have been expanded into element form.
    fn consume_extend_attributes(flat_root: &mut FlatRoot) {
        for i in 0..flat_root.nodes.len() {
            // Skip any cases we don't need to consider.
            if let FlatNode::Element(e) = &flat_root.nodes[i] {
                if e.extending.is_some() {
                    // If `extending` is already set, references have already been resolved, so there's
                    // nothing to do.
                    continue;
                }
                if !e
                    .attributes
                    .iter()
                    .any(|attr| attr.name.eq_ignore_ascii_case("extend"))
                {
                    continue;
                }
            } else {
                continue;
            }

            // If we're here we have an element with an `extend` attribute.
            // Take this element so that we can mutate it without the borrow checker complaining.
            let mut node = mem::take(&mut flat_root.nodes[i]);
            let element = match &mut node {
                FlatNode::Element(e) => e,
                // Should be safe because we already verified we're an element.
                _ => panic!(),
            };
            let extend = element
                .attributes
                .iter()
                .find(|attr| attr.name.eq_ignore_ascii_case("extend"))
                // Should be safe because we already verified we have an `extend` attribute
                .unwrap();

            // All macros should be expanded by now, so we look for a unique child with `extending`
            // This would arise because `extend="$f"` is replaced with `<foo _extending="f" />` where `_extending`
            // is a special, internal attribute.

            // There are various bail conditions.
            //  1. Non-whitespace text is present
            //  2. No element with an `extending` is present
            //  3. Multiple elements are present
            let mut is_invalid_attr = false;
            let mut num_element_children = 0;
            let extend_referent: Option<RefResolution> = extend
                .children
                .iter()
                .flat_map(|child| match child {
                    UntaggedContent::Ref(idx) => {
                        num_element_children += 1;

                        match &flat_root.nodes[*idx] {
                            FlatNode::Element(e) => e.extending.clone(),
                            _ => None,
                        }
                    }
                    UntaggedContent::Text(t) => {
                        if !t.chars().all(char::is_whitespace) {
                            is_invalid_attr = true;
                        }
                        None
                    }
                })
                .last();

            if is_invalid_attr || num_element_children != 1 || extend_referent.is_none() {
                // We couldn't find a unique `extending` prop, so the `extend` attribute is invalid.
                // Push an error message as a child of `node`.
                element.children.push(flat_root.merge_content(
                    &DastElementContent::Error(DastError {
                        message: "Invalid `extend` attribute".to_string(),
                        position: extend.position.clone(),
                    }),
                    extend.parent,
                ));

                // We took this memory earlier, so we need to put it back.
                flat_root.nodes[i] = node;
                continue;
            }
            element.extending = extend_referent;

            // We successfully consumed the `extend` attribute, so remove the `extend` attribute.
            element
                .attributes
                .retain(|attr| !attr.name.eq_ignore_ascii_case("extend"));

            // Put ourselves back into `flat_root` (we took the memory earlier)
            flat_root.nodes[i] = node;
        }
    }
}

/// Return the index of the referent of `UntaggedContent` if it is a reference.
fn lookup_idx(untagged: &UntaggedContent) -> Result<Index, anyhow::Error> {
    match untagged {
        UntaggedContent::Ref(idx) => Ok(*idx),
        _ => Err(anyhow!("Expected a reference")),
    }
}

#[cfg(test)]
#[path = "macro_expand.test.rs"]
mod test;
