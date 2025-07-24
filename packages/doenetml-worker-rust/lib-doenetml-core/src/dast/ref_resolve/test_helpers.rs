use crate::{
    dast::{
        DastElementContent, DastRoot,
        flat_dast::{
            FlatAttribute, FlatFragment, FlatIndex, FlatNode, FlatPathPart, FlatRoot, Index,
            SourceDoc, UntaggedContent,
        },
        ref_resolve::RefResolution,
    },
    test_utils::*,
};

pub struct TestPathPart {
    pub name: &'static str,
    pub indices: Vec<&'static str>,
}

/// Find the index of the first element with the given tag name.
pub fn find(flat_root: &FlatRoot, tag_name: &str) -> Option<Index> {
    flat_root.nodes.iter().find_map(|node| match node {
        FlatNode::Element(e) if e.name == tag_name => Some(e.idx),
        _ => None,
    })
}

pub fn make_path<'a, T: AsRef<[&'a str]>>(
    path_str: T,
    source_doc: Option<SourceDoc>,
) -> Vec<FlatPathPart> {
    let path_str = path_str.as_ref();
    path_str
        .iter()
        .map(|s| FlatPathPart {
            name: s.to_string(),
            index: Vec::new(),
            position: None,
            source_doc,
        })
        .collect()
}

pub fn make_path_with_indices(
    test_path: &[TestPathPart],
    source_doc: Option<SourceDoc>,
) -> Vec<FlatPathPart> {
    test_path
        .iter()
        .map(|pp| FlatPathPart {
            name: pp.name.to_string(),
            index: pp
                .indices
                .iter()
                .map(|index| FlatIndex {
                    value: vec![UntaggedContent::Text((*index).into())],
                    position: None,
                    source_doc,
                })
                .collect(),
            position: None,
            source_doc,
        })
        .collect()
}

pub fn flat_fragment_from_str(
    str: &str,
    idx_to_id_shift: usize,
    parent_idx: Option<usize>,
) -> FlatFragment {
    let mut sub_tree_with_document = dast_root_no_position(str);

    // remove document off tree
    let sub_tree = match sub_tree_with_document.children.pop() {
        Some(DastElementContent::Element(dast_element)) => DastRoot {
            children: dast_element.children,
            position: None,
            sources: vec![],
        },
        _ => unreachable!(),
    };

    FlatFragment::from_dast_with_id_shift(&sub_tree, idx_to_id_shift, parent_idx)
}

/// The function mimics the behavior of extending from an external document,
/// i.e., of the parser function `expand-external-references.ts`.
///
/// The node given by `node_idx` is the node extended from an external document
/// with document given by `source_doc`.
/// If `name_for_descendants` is supplied, it is the name of `node_idx`
/// that was specified inside `source_doc`.
///
/// For example, consider the DoenetML `<section extend="doenet:abc" name="s"/><p>More</p>` where `doenet:abc` resolves
/// to `<section name="s2"><text /></section>`. To mimic this for tests, we start with the DoenetML
/// `<section name="s"><text /></section><p>More</p>`,
/// then call `add_source_doc_to_descendants` with the `node_idx` of `<section>` and
/// `name_for_descendants` set to `"s2"`.
pub fn add_source_doc_to_descendants(
    flat_root: &mut FlatRoot,
    node_idx: Index,
    source_doc: Option<SourceDoc>,
    name_for_descendants: Option<String>,
) {
    let node = flat_root.nodes.get_mut(node_idx).unwrap();
    let mut additional_indices: Vec<Index> = Vec::new();

    if let Some(new_name) = name_for_descendants {
        if let FlatNode::Element(flat_element) = node {
            let source: SourceDoc = source_doc.into();
            flat_element.attributes.push(FlatAttribute {
                name: format!("source-{source}:name"),
                parent: Some(node_idx),
                children: vec![UntaggedContent::Text(new_name)],
                position: None,
                source_doc,
            });

            additional_indices.extend(flat_element.children.iter().filter_map(
                |child| match child {
                    UntaggedContent::Text(_) => None,
                    UntaggedContent::Ref(idx) => Some(*idx),
                },
            ));

            let source_sequence_idx = flat_element
                .attributes
                .iter()
                .position(|attr| attr.name == "source:sequence");

            let source_sequence = match source_sequence_idx {
                Some(idx) => flat_element.attributes.iter_mut().skip(idx).next().unwrap(),
                None => {
                    let element_source: SourceDoc = flat_element.source_doc.into();
                    flat_element.attributes.push(FlatAttribute {
                        name: "source:sequence".to_string(),
                        parent: Some(flat_element.idx),
                        children: vec![UntaggedContent::Text(element_source.to_string())],
                        position: None,
                        source_doc: flat_element.source_doc,
                    });

                    flat_element.attributes.iter_mut().last().unwrap()
                }
            };

            source_sequence
                .children
                .push(UntaggedContent::Text(source.to_string()));
        }
    }

    for idx in additional_indices.iter() {
        add_source_doc_to_node(flat_root, *idx, source_doc);
    }
}

fn add_source_doc_to_node(
    flat_root: &mut FlatRoot,
    node_idx: Index,
    source_doc: Option<SourceDoc>,
) {
    let node = flat_root.nodes.get_mut(node_idx).unwrap();

    let mut additional_indices: Vec<Index> = Vec::new();

    match node {
        FlatNode::Element(flat_element) => {
            flat_element.source_doc = source_doc;
            additional_indices.extend(flat_element.children.iter().filter_map(
                |child| match child {
                    UntaggedContent::Text(_) => None,
                    UntaggedContent::Ref(idx) => Some(*idx),
                },
            ));
            additional_indices.extend(flat_element.attributes.iter_mut().flat_map(|attr| {
                attr.source_doc = source_doc;
                attr.children.iter().filter_map(|child| match child {
                    UntaggedContent::Text(_) => None,
                    UntaggedContent::Ref(idx) => Some(*idx),
                })
            }));
            if let Some(extending) = &mut flat_element.extending {
                let ref_resolution = extending.get_resolution_mut();
                additional_indices
                    .extend(add_source_doc_to_ref_resolution(ref_resolution, source_doc));
            }
        }
        FlatNode::Error(flat_error) => {
            flat_error.source_doc = source_doc;
            if let Some(path) = &mut flat_error.unresolved_path {
                additional_indices.extend(add_source_to_path(path, source_doc));
            }
        }
        FlatNode::Ref(flat_ref) => {
            flat_ref.source_doc = source_doc;
            additional_indices.extend(add_source_to_path(&mut flat_ref.path, source_doc));
        }
        FlatNode::FunctionRef(flat_function_ref) => {
            flat_function_ref.source_doc = source_doc;
            additional_indices.extend(add_source_to_path(&mut flat_function_ref.path, source_doc));
            if let Some(input) = &flat_function_ref.input {
                additional_indices.extend(input.iter().flat_map(|sub_input| {
                    sub_input.iter().filter_map(|child| match child {
                        UntaggedContent::Text(_) => None,
                        UntaggedContent::Ref(idx) => Some(*idx),
                    })
                }));
            }
        }
    }

    for idx in additional_indices.iter() {
        add_source_doc_to_node(flat_root, *idx, source_doc);
    }
}

fn add_source_doc_to_ref_resolution(
    ref_resolution: &mut RefResolution,
    source_doc: Option<SourceDoc>,
) -> Vec<Index> {
    let mut additional_indices = Vec::new();
    additional_indices.extend(add_source_to_path(
        &mut ref_resolution.original_path,
        source_doc,
    ));

    if let Some(unresolved_path) = &mut ref_resolution.unresolved_path {
        additional_indices.extend(add_source_to_path(unresolved_path, source_doc));
    }

    additional_indices
}

fn add_source_to_path(path: &mut Vec<FlatPathPart>, source_doc: Option<SourceDoc>) -> Vec<Index> {
    let mut additional_indices = Vec::new();
    for path_part in path.iter_mut() {
        path_part.source_doc = source_doc;
        for index in path_part.index.iter_mut() {
            index.source_doc = source_doc;
            additional_indices.extend(index.value.iter().filter_map(|child| match child {
                UntaggedContent::Text(_) => None,
                UntaggedContent::Ref(idx) => Some(*idx),
            }))
        }
    }
    additional_indices
}
