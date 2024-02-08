use super::*;
use crate::{
    dast::{DastIndex, DastText, DastTextMacroContent},
    test_utils::*,
};
use test_helpers::*;
#[test]
fn can_resolve_name_among_parents() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find_node_index_by_name(&flat_root, "b").unwrap();
    let c_idx = find_node_index_by_name(&flat_root, "c").unwrap();
    let d_idx = find_node_index_by_name(&flat_root, "d").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    // Searching from `c` for `y` should find the `b` node
    let referent = resolver.search_parents("y", c_idx);
    assert_eq!(referent, Ok(b_idx));

    let referent = resolver.search_parents("y", b_idx);
    assert_eq!(referent, Ok(b_idx));

    // Searching from `d` should fail because there are multiple `y`s that could be referred to.
    let referent = resolver.search_parents("y", d_idx);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
}

#[test]
fn can_resolve_names() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find_node_index_by_name(&flat_root, "b").unwrap();
    let c_idx = find_node_index_by_name(&flat_root, "c").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Searching from `c` for `y` should find the `b` node
    let referent = resolver.resolve(make_path(["y"]), c_idx);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None
        })
    );

    let referent = resolver.resolve(make_path(["y", "z"]), c_idx);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None
        })
    );

    // Unused path part is left intact
    let referent = resolver.resolve(make_path(["y", "z", "w"]), c_idx);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: Some(vec![PathPart {
                name: "w".into(),
                index: vec![],
                position: None
            }])
        })
    );
}

#[test]
fn resolution_stops_at_path_index() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find_node_index_by_name(&flat_root, "b").unwrap();
    let c_idx = find_node_index_by_name(&flat_root, "c").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // `$y.z`
    let path = vec![
        PathPart {
            name: "y".into(),
            index: vec![],
            position: None,
        },
        PathPart {
            name: "z".into(),
            index: vec![],
            position: None,
        },
    ];
    let referent = resolver.resolve(path, c_idx);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None
        })
    );

    let index = vec![DastIndex {
        value: vec![DastTextMacroContent::Text(DastText {
            value: "2".into(),
            position: None,
            data: None,
        })],
        position: None,
    }];

    // `$y[2].z`
    let path = vec![
        PathPart {
            name: "y".into(),
            index: index.clone(),
            position: None,
        },
        PathPart {
            name: "z".into(),
            index: vec![],
            position: None,
        },
    ];
    let referent = resolver.resolve(path, c_idx);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(vec![
                PathPart {
                    name: "".into(),
                    index: index.clone(),
                    position: None
                },
                PathPart {
                    name: "z".into(),
                    index: vec![],
                    position: None
                }
            ])
        })
    );
}

#[test]
fn resolution_matches_largest_possible_when_index_present() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let c_idx = find_node_index_by_name(&flat_root, "c").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    let index = vec![DastIndex {
        value: vec![DastTextMacroContent::Text(DastText {
            value: "2".into(),
            position: None,
            data: None,
        })],
        position: None,
    }];
    // `$y.z[2]`
    let path = vec![
        PathPart {
            name: "y".into(),
            index: vec![],
            position: None,
        },
        PathPart {
            name: "z".into(),
            index: index.clone(),
            position: None,
        },
    ];

    let referent = resolver.resolve(path, c_idx);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: Some(vec![PathPart {
                name: "".into(),
                index: index.clone(),
                position: None
            },])
        })
    );
}

#[test]
fn can_resolve_name_at_macro_origin() {
    let dast_root = dast_root_no_position(r#"<a name="x" />$b"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find_node_index_by_name(&flat_root, "a").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    // The macro `$b` should be right after the `a` node
    let b_idx = a_idx + 1;
    let referent = resolver.search_parents("x", b_idx);
    assert_eq!(referent, Ok(a_idx));
}

mod test_helpers {
    use super::*;

    pub fn find_node_index_by_name(flat_root: &FlatRoot, name: &str) -> Option<Index> {
        flat_root.nodes.iter().find_map(|node| match node {
            FlatNode::Element(e) if e.name == name => Some(e.idx),
            _ => None,
        })
    }

    pub fn make_path<'a, T: AsRef<[&'a str]>>(path_str: T) -> Vec<PathPart> {
        let path_str = path_str.as_ref();
        path_str
            .iter()
            .map(|s| PathPart {
                name: s.to_string(),
                index: Vec::new(),
                position: None,
            })
            .collect()
    }
}
