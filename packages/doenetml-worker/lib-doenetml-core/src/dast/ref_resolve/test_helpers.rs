use crate::{
    dast::{
        flat_dast::{
            FlatFragment, FlatIndex, FlatNode, FlatPathPart, FlatRoot, Index, SourceDoc,
            UntaggedContent,
        },
        DastElementContent, DastRoot,
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
        },
        _ => unreachable!(),
    };

    FlatFragment::from_dast_with_id_shift(&sub_tree, idx_to_id_shift, parent_idx)
}
