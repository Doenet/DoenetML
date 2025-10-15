use std::{collections::HashMap, mem};

use anyhow::anyhow;

use super::{
    DastElement, DastElementContent, DastError,
    flat_dast::{
        ErrorType, FlatElement, FlatError, FlatNode, FlatRoot, Index, Source, UntaggedContent,
    },
    ref_resolve::{RefResolution, ResolutionError, Resolver, format_error_message},
};

/// An `Expander` replaces all refs with their `DastElement`-equivalent forms. For example
/// ```xml
/// <point name="p" />
/// $p
/// ```
/// expands to
/// ```xml
/// <point name="p" />
/// <point extend="$p" />
/// ```
/// Care is taken to preserve the tag name of the referent. (E.g., a `<point />` maps to a `<point extend="..." />`,
/// a `<line />` maps to a `<line extend="..." />`, etc.)
pub struct Expander {}

impl Expander {
    /// Expand all refs and function refs into their "xml" form. After expansion,
    /// the resulting tree may not be serializable as XML since element attributes may contain
    /// other elements.
    pub fn expand(flat_root: &mut FlatRoot) -> Resolver {
        let resolver = Resolver::from_flat_root(flat_root);
        Expander::expand_refs(flat_root, &resolver);
        Expander::consume_extend_and_copy_attributes(flat_root);
        resolver
    }

    /// Expand all refs and function refs into their "xml" form.
    fn expand_refs(flat_root: &mut FlatRoot, resolver: &Resolver) {
        for idx in 0..flat_root.nodes.len() {
            // The original `nodes[idx]` node is being completely replaced, so we are free to take its value,
            // which will prevent the borrow checker from complaining if we mutate `flat_root` during processing.
            flat_root.nodes[idx] = match mem::take(&mut flat_root.nodes[idx]) {
                FlatNode::Ref(ref_) => {
                    // A ref `$f` gets replaced with `<foo extend="$f" />` where `foo` is the tag name of the referent.
                    // e.g. `<point name="p" />$p` becomes `<point name="p" /><point extend="$p" />`
                    // Expanding a ref is can be done with a single replacement.

                    //flat_root.nodes[idx] = resolved
                    match resolver.resolve(&ref_.path, ref_.idx, false) {
                        Ok(ref_resolution) => {
                            // Get the tag name of the referent
                            let name = match &flat_root.nodes[ref_resolution.node_idx] {
                                FlatNode::Element(e) => e.name.clone(),
                                _ => panic!("Expected an element"),
                            };
                            FlatNode::Element(FlatElement {
                                idx: ref_.idx,
                                parent: ref_.parent,
                                attributes: Vec::new(),
                                children: Vec::new(),
                                name,
                                position: ref_.position.clone(),
                                source_doc: ref_.source_doc,
                                children_position: None,
                                extending: Some(Source::Ref(ref_resolution)),
                            })
                        }
                        Err(err) => FlatNode::Error(FlatError {
                            idx: ref_.idx,
                            parent: ref_.parent,
                            message: format_error_message(err, &ref_.path),
                            error_type: ErrorType::Warning,
                            unresolved_path: if let ResolutionError::NoReferent = err {
                                Some(ref_.path.clone())
                            } else {
                                None
                            },
                            position: ref_.position.clone(),
                            source_doc: ref_.source_doc,
                        }),
                    }
                }
                FlatNode::FunctionRef(function_ref) => {
                    // A function ref `$$f(x)` becomes `<evaluate extend="$f"><ol><li>x</li></ol></evaluate>`
                    // This involves creating multiple new nodes and setting them as children of the `evaluate` node.
                    let resolved =
                        match resolver.resolve(&function_ref.path, function_ref.idx, false) {
                            Ok(ref_resolution) => {
                                let mut evaluate_node = FlatElement {
                                    idx: function_ref.idx,
                                    parent: function_ref.parent,
                                    attributes: Vec::new(),
                                    children: Vec::new(),
                                    name: "evaluate".to_string(),
                                    position: function_ref.position.clone(),
                                    source_doc: function_ref.source_doc,
                                    children_position: None,
                                    extending: Some(Source::Ref(ref_resolution)),
                                };
                                // An `<evaluate />` node's children are the inputs to the function.
                                // They take the form of an ordered list of `<li />` nodes.
                                if let Some(inputs) = &function_ref.input {
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
                                        position: function_ref.position.clone(),
                                        source_doc: function_ref.source_doc,
                                        data: None,
                                    };
                                    // Insert the `ol` into `flat_root`
                                    let ol = flat_root.merge_content(
                                        &DastElementContent::Element(dast_ol),
                                        Some(idx),
                                    );
                                    // The `<li>` tags are the exclusive children of the `<ol>` tag.
                                    // We created the same number of `<li>` tags as there are `inputs`.
                                    let li_node_indices =
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
                                        inputs.iter().zip(li_node_indices)
                                    {
                                        // `input_content` (the argument to the function) have already been inserted into flat_root.nodes
                                        // so we can safely clone `input_content` and set it as children. All references contained
                                        // within should be valid.
                                        flat_root
                                            .set_children(li_idx.unwrap(), input_content.clone());
                                    }

                                    // Set the `ol` as a child of the `evaluate` node.
                                    evaluate_node.children.push(ol);
                                }

                                FlatNode::Element(evaluate_node)
                            }
                            Err(err) => FlatNode::Error(FlatError {
                                idx: function_ref.idx,
                                parent: function_ref.parent,
                                message: format!("Ref resolution error: {err}"),
                                error_type: ErrorType::Warning,
                                unresolved_path: if let ResolutionError::NoReferent = err {
                                    Some(function_ref.path.clone())
                                } else {
                                    None
                                },
                                position: function_ref.position.clone(),
                                source_doc: function_ref.source_doc,
                            }),
                        };

                    resolved
                }
                other => other,
            };
        }
    }

    /// Remove any `extend` or `copy` attributes from nodes,
    /// and instead set each node's `extending` to either a
    /// `Source::ExtendAttribute` or `Source::CopyAttribute` containing the extend's referent.
    /// This should be called _after_ all refs have been expanded into element form.
    fn consume_extend_and_copy_attributes(flat_root: &mut FlatRoot) {
        for i in 0..flat_root.nodes.len() {
            // Skip any cases we don't need to consider.
            if let FlatNode::Element(e) = &flat_root.nodes[i] {
                if e.extending.is_some() {
                    // If `extending` is already set, references have already been resolved, so there's
                    // nothing to do.
                    continue;
                }
                if !e.attributes.iter().any(|attr| {
                    attr.name.eq_ignore_ascii_case("extend")
                        || attr.name.eq_ignore_ascii_case("copy")
                }) {
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
                _ => unreachable!(),
            };

            if element
                .attributes
                .iter()
                .filter(|attr| {
                    attr.name.eq_ignore_ascii_case("extend")
                        || attr.name.eq_ignore_ascii_case("copy")
                })
                .count()
                > 1
            {
                // We have more than one `extend` or `copy` attribute.
                // Push an error message as a child of `node`.
                element.children.push(flat_root.merge_content(
                    &DastElementContent::Error(DastError {
                        error_type: Some(ErrorType::Error),
                        message: "Duplicate `extend` or `copy` attributes".to_string(),
                        position: element.position.clone(),
                        source_doc: element.source_doc,
                    }),
                    Some(element.idx),
                ));

                // We took this memory earlier, so we need to put it back.
                flat_root.nodes[i] = node;
                continue;
            }
            let extend_or_copy = element
                .attributes
                .iter()
                .find(|attr| {
                    attr.name.eq_ignore_ascii_case("extend")
                        || attr.name.eq_ignore_ascii_case("copy")
                })
                // Should be safe because we already verified we have an `extend` or `copy` attribute
                .unwrap();

            // All refs should be expanded by now, so we look for a unique child with `extending`
            // This would arise because `"$f"` is replaced with `<foo _extending="f" />` where `_extending`
            // is a special, internal attribute.

            // There are various bail conditions.
            //  1. Non-whitespace text is present
            //  2. No element with an `extending` is present
            //  3. Multiple elements are present
            let mut is_invalid_attr = false;
            let mut num_element_children = 0;
            let mut error_found: Option<&FlatError> = None;
            let extend_referent: Option<Source<RefResolution>> = extend_or_copy
                .children
                .iter()
                .flat_map(|child| match child {
                    UntaggedContent::Ref(idx) => {
                        num_element_children += 1;

                        match &flat_root.nodes[*idx] {
                            // Change the initial node referenced in the resolver from the index of the attribute that will be deleted
                            // to the index of the component that is extending or copying

                            // TODO: there must be a cleaner way to change the initial node index without cloning twice!
                            FlatNode::Element(e) => e.extending.clone().map(|s| {
                                let mut s2 = s.clone();
                                s2.set_initial_node_index(element.idx);
                                s2
                            }),
                            FlatNode::Error(err) => {
                                error_found = Some(err);
                                None
                            }
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

                let error_type = if let Some(_err) = error_found {
                    ErrorType::Warning
                } else {
                    ErrorType::Error
                };

                let message = if let Some(err) = error_found {
                    format!("In '{}' attribute: {}", extend_or_copy.name, err.message)
                } else {
                    format!("Invalid '{}' attribute", extend_or_copy.name)
                };

                element.children.push(flat_root.merge_content(
                    &DastElementContent::Error(DastError {
                        message,
                        error_type: Some(error_type),
                        position: extend_or_copy.position.clone(),
                        source_doc: extend_or_copy.source_doc,
                    }),
                    extend_or_copy.parent,
                ));

                // Remove the `extend` or `copy` attribute since it has been replaced with an error
                element.attributes.retain(|attr| {
                    !(attr.name.eq_ignore_ascii_case("extend")
                        || attr.name.eq_ignore_ascii_case("copy"))
                });

                // We took this memory earlier, so we need to put it back.
                flat_root.nodes[i] = node;
                continue;
            }

            // Since this reference was inside an `extend` or `copy` attribute,
            // we must mark it as such
            // (which indicates that we shouldn't change the component type
            // from the one specified in the element)
            if extend_or_copy.name.eq_ignore_ascii_case("copy") {
                element.extending = extend_referent.map(|source| source.as_copy_attribute());
            } else {
                element.extending = extend_referent.map(|source| source.as_extend_attribute());
            }

            // We successfully consumed the `extend` or `copy` attribute, so remove the `extend` or `copy` attribute.
            element.attributes.retain(|attr| {
                !(attr.name.eq_ignore_ascii_case("extend")
                    || attr.name.eq_ignore_ascii_case("copy"))
            });

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
#[path = "ref_expand.test.rs"]
mod test;
