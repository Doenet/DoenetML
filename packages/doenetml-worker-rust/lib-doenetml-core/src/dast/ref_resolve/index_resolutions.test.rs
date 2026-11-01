use std::ops::Range;

use super::*;
use crate::{
    dast::{
        Point, Position,
        flat_dast::{FlatIndex, FlatPathPart, FlatRoot},
        ref_resolve::{ChildIndex, RefResolution, ResolutionError, test_helpers::*},
    },
    test_utils::*,
};

#[test]
fn resolution_stops_at_path_index_with_no_index_resolutions() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // `$y.z`
    let path = vec![
        FlatPathPart {
            name: "y".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
    ];
    let referent = resolver.resolve(path.clone(), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![c_idx, b_idx],
            child_indexes: vec![],
        })
    );

    let index = vec![FlatIndex {
        value: vec![UntaggedContent::Text("2".into())],
        position: None,
        source_doc: None,
    }];

    // `$y[2].z`
    let path = vec![
        FlatPathPart {
            name: "y".into(),
            index: index.clone(),
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
    ];
    let referent = resolver.resolve(path.clone(), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(vec![
                FlatPathPart {
                    name: "".into(),
                    index: index.clone(),
                    position: None,
                    source_doc: None,
                },
                FlatPathPart {
                    name: "z".into(),
                    index: vec![],
                    position: None,
                    source_doc: None,
                }
            ]),
            original_path: path,
            nodes_in_resolved_path: vec![c_idx, b_idx],
            child_indexes: vec![],
        })
    );
}

#[test]
fn resolution_resolves_path_index_with_implicit_index_resolutions() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <group name="g">
                <c><e name="z" /></c>
                <d><f name="z" /></d>
            </group>
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // `$g.z`
    let path = vec![
        FlatPathPart {
            name: "g".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
    ];
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));

    let index1 = vec![FlatIndex {
        value: vec![UntaggedContent::Text("1".into())],
        position: None,
        source_doc: None,
    }];
    let index2 = vec![FlatIndex {
        value: vec![UntaggedContent::Text("2".into())],
        position: None,
        source_doc: None,
    }];
    let index3 = vec![FlatIndex {
        value: vec![UntaggedContent::Text("3".into())],
        position: None,
        source_doc: None,
    }];

    // `$g[1]`
    let path = vec![FlatPathPart {
        name: "g".into(),
        index: index1.clone(),
        position: None,
        source_doc: None,
    }];
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx],
            child_indexes: vec![child_index(g_idx, c_idx)],
        })
    );

    // `$x.g[2]`
    let path = vec![
        FlatPathPart {
            name: "x".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "g".into(),
            index: index2.clone(),
            position: None,
            source_doc: None,
        },
    ];
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx],
            child_indexes: vec![child_index(g_idx, d_idx)],
        })
    );

    // `$g[2].z`
    let path = vec![
        FlatPathPart {
            name: "g".into(),
            index: index2.clone(),
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
    ];

    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: f_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx, f_idx],
            child_indexes: vec![child_index(g_idx, d_idx)],
        })
    );

    // `$x.g[1].z`
    let path = vec![
        FlatPathPart {
            name: "x".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "g".into(),
            index: index1.clone(),
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
    ];

    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: e_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx, e_idx],
            child_indexes: vec![child_index(g_idx, c_idx)],
        })
    );

    // the index of `$g[3].z` is not resolved
    let path = vec![
        FlatPathPart {
            name: "g".into(),
            index: index3.clone(),
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
    ];
    let unresolved_path = vec![
        FlatPathPart {
            name: "".into(),
            index: index3.clone(),
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
    ];

    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(unresolved_path),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_indexes: vec![],
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
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    let index = vec![FlatIndex {
        value: vec![UntaggedContent::Text("2".into())],
        position: None,
        source_doc: None,
    }];
    // `$y.z[2]`
    let path = vec![
        FlatPathPart {
            name: "y".into(),
            index: vec![],
            position: None,
            source_doc: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: index.clone(),
            position: None,
            source_doc: None,
        },
    ];

    let referent = resolver.resolve(path.clone(), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: Some(vec![FlatPathPart {
                name: "".into(),
                index: index.clone(),
                position: None,
                source_doc: None,
            },]),
            original_path: path,
            nodes_in_resolved_path: vec![c_idx, b_idx],
            child_indexes: vec![],
        })
    );
}

#[test]
fn add_nodes_with_index_resolutions() {
    let dast_root = dast_root_no_position(
        r#"<e><a name="x">
            <select name="s" />
        </a></e>
        <d name="y" /><f name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let s_idx = find(&flat_root, "select").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();

    let flat_fragment = flat_fragment_from_str(
        r#"
    <group><b name="z" /></group>
    <group><c name="z" /></group>"#,
        f_idx + 1,
        Some(s_idx),
    );

    let g1_idx = f_idx + 1;
    let b_idx = f_idx + 2;
    let g2_idx = f_idx + 3;
    let c_idx = f_idx + 4;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll {
            parent: flat_fragment.parent_idx.unwrap(),
        },
    );

    // Since the `z` was added later, it cannot be found directly from `a`
    let referent = resolver.resolve(make_path(["z"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Prefacing the added components with the fragment parent `s` and an index allows them to be found as `s[1].z` and `s[2].z`.
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["1"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx, b_idx],
            child_indexes: vec![],
        })
    );

    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["2"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g2_idx, c_idx],
            child_indexes: vec![],
        })
    );

    // `s[3].z` has no referent
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["3"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(
        &[
            TestPathPart {
                name: "",
                indices: vec!["3"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: Some(unresolved_path.clone()),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx],
            child_indexes: vec![],
        })
    );

    // `s[1]` and `s[2]` match the groups
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "s",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g2_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g2_idx],
            child_indexes: vec![],
        })
    );

    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "x",
                indices: vec![],
            },
            TestPathPart {
                name: "s",
                indices: vec!["1"],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g1_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx],
            child_indexes: vec![],
        })
    );
}

#[test]
fn replace_nodes_with_index_resolutions() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <select name="s" />
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let s_idx = find(&flat_root, "select").unwrap();

    let flat_fragment = flat_fragment_from_str(
        r#"
    <group><b name="z" /></group>
    <group><c name="z" /></group>"#,
        s_idx + 1,
        Some(s_idx),
    );

    let g1_idx = s_idx + 1;
    let b_idx = s_idx + 2;
    let g2_idx = s_idx + 3;
    let c_idx = s_idx + 4;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll {
            parent: flat_fragment.parent_idx.unwrap(),
        },
    );

    // Prefacing the added components with the fragment parent `s` and an index allows them to be found as `s[1].z` and `s[2].z`.
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["1"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx, b_idx],
            child_indexes: vec![],
        })
    );

    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["2"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g2_idx, c_idx],
            child_indexes: vec![],
        })
    );

    // `s[3].z` has no referent
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["3"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(
        &[
            TestPathPart {
                name: "",
                indices: vec!["3"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: Some(unresolved_path.clone()),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx],
            child_indexes: vec![],
        })
    );

    // Delete second `<group>` and its child `<c>`.
    resolver.delete_nodes(&flat_fragment.nodes[2..]);

    // Add a replacement third `<group>` and its child `<d>`
    let flat_fragment2 = flat_fragment_from_str(
        r#"
    <group><d name="z" /></group>"#,
        c_idx + 1,
        Some(s_idx),
    );

    let g3_idx = c_idx + 1;
    let d_idx = c_idx + 2;

    resolver.add_nodes(
        &flat_fragment2,
        IndexResolution::ReplaceRange {
            parent: flat_fragment2.parent_idx.unwrap(),
            range: Range { start: 1, end: 2 },
        },
    );

    // Prefacing the added components with the fragment parent `s` and an index allows them to be found as `s[1].z` and `s[2].z`.
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["1"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx, b_idx],
            child_indexes: vec![],
        })
    );

    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["2"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx, g3_idx, d_idx],
            child_indexes: vec![],
        })
    );

    // `s[3].z` still has no referent
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "s",
                indices: vec!["3"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(
        &[
            TestPathPart {
                name: "",
                indices: vec!["3"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: Some(unresolved_path.clone()),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, s_idx],
            child_indexes: vec![],
        })
    );
}

#[test]
fn replace_nodes_with_index_resolutions_initially_resolving_to_text_node_or_nothing() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <group name="g"><b /> hello</group>
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);

    // `g[1]` is resolved
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["1"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx],
            child_indexes: vec![child_index(g_idx, b_idx)],
        })
    );

    // `g[2]` has no referent as it matches a text node.
    // To make sure that the unresolved_path does not resolve to anything in later processing by core,
    // its name is set to `"invalid_index"`
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let unresolved_path = make_path_with_indices(
        &[TestPathPart {
            name: "__invalid_index",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(unresolved_path),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_indexes: vec![],
        })
    );

    // `g[3]` has no referent as it matches nothing
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["3"],
        }],
        None,
    );
    let unresolved_path = make_path_with_indices(
        &[TestPathPart {
            name: "",
            indices: vec!["3"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(unresolved_path),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_indexes: vec![],
        })
    );

    // Insert a replacement at the second index
    let flat_fragment = flat_fragment_from_str(
        r#"
    <c/>"#,
        b_idx + 1,
        Some(g_idx),
    );

    let c_idx = b_idx + 1;

    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: flat_fragment.parent_idx.unwrap(),
            range: Range { start: 1, end: 1 },
        },
    );

    // `g[1]` is resolved
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["1"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx],
            child_indexes: vec![child_index(g_idx, b_idx)],
        })
    );

    // `g[2]` is now resolved to the new index resolution
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx],
            child_indexes: vec![child_index(g_idx, c_idx)],
        })
    );

    // `g[3]` has no referent as it now matches the text node
    // To make sure that the unresolved_path does not resolve to anything in later processing by core,
    // its name is set to `"invalid_index"`
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["3"],
        }],
        None,
    );
    let unresolved_path = make_path_with_indices(
        &[TestPathPart {
            name: "__invalid_index",
            indices: vec!["3"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(unresolved_path),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_indexes: vec![],
        })
    );

    // Insert a replacement at the first index
    let flat_fragment = flat_fragment_from_str(
        r#"
    <d/>"#,
        c_idx + 1,
        Some(g_idx),
    );

    let d_idx = c_idx + 1;

    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: flat_fragment.parent_idx.unwrap(),
            range: Range { start: 0, end: 0 },
        },
    );

    // `g[1]` is now resolved to the new node
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["1"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx],
            child_indexes: vec![child_index(g_idx, d_idx)],
        })
    );

    // `g[2]` is now resolved to the node shifted to the second index
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx],
            child_indexes: vec![child_index(g_idx, b_idx)],
        })
    );

    // `g[3]` is now resolved to the node shifted to the third index
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["3"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx],
            child_indexes: vec![child_index(g_idx, c_idx)],
        })
    );
}

#[test]
fn replace_index_resolutions() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <group name="g"><b /> <c/></group>
            <d />
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);

    // `g[1]` resolves to b
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["1"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx],
            child_indexes: vec![child_index(g_idx, b_idx)],
        })
    );

    // `g[2]` resolves to c
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx],
            child_indexes: vec![child_index(g_idx, c_idx)],
        })
    );

    // replace the first index resolution of `g` to be `d` rather than `a``
    resolver.replace_index_resolutions(
        &[UntaggedContent::Ref(d_idx)],
        IndexResolution::ReplaceRange {
            parent: g_idx,
            range: Range { start: 0, end: 1 },
        },
    );

    // `g[1]` resolves to `d`
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["1"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx],
            child_indexes: vec![child_index(g_idx, d_idx)],
        })
    );

    // `g[2]` still resolves to c
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx],
            child_indexes: vec![child_index(g_idx, c_idx)],
        })
    );
}

#[test]
fn replace_nodes_with_no_parent_but_index_resolutions() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <group name="g">
               <b><c name="y" /></b>
            </group>
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);

    // Find `c` as either `g[1].y` or `g.y`
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "g",
                indices: vec!["1"],
            },
            TestPathPart {
                name: "y",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx, c_idx],
            child_indexes: vec![child_index(g_idx, b_idx)],
        })
    );

    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "g",
                indices: vec![],
            },
            TestPathPart {
                name: "y",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx],
            child_indexes: vec![],
        })
    );

    // `g[2]` has no referent
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(
        &[TestPathPart {
            name: "",
            indices: vec!["2"],
        }],
        None,
    );
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(unresolved_path.clone()),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_indexes: vec![],
        })
    );

    // Add a fragment without a parent but as the second index resolution of the `<group>`.
    let flat_fragment = flat_fragment_from_str(
        r#"
    <d><e name="z" /></d>"#,
        c_idx + 1,
        None,
    );

    let d_idx = c_idx + 1;
    let e_idx = c_idx + 2;

    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: g_idx,
            range: Range { start: 1, end: 1 },
        },
    );

    // Find `e` as `g[2].z` but not as `g.z`
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "g",
                indices: vec!["2"],
            },
            TestPathPart {
                name: "z",
                indices: vec![],
            },
        ],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: e_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx, e_idx],
            child_indexes: vec![child_index(g_idx, d_idx)],
        })
    );

    let path = make_path(["g", "z"], None);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(make_path(["z"], None)),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_indexes: vec![],
        })
    );

    // `g[3]` has no referent
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["3"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(
        &[TestPathPart {
            name: "",
            indices: vec!["3"],
        }],
        None,
    );
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(unresolved_path.clone()),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_indexes: vec![],
        })
    );
}

/// The nested repeats of D27: `<repeat name="r">` whose first two iterations each hold one `<repeat name="q">`
/// (so the worker marks them with `_indexPassThrough`), a third iteration that holds two components
/// and so is not marked, a fourth that holds one `<repeat name="q">` and the `<setup>` the worker can add,
/// and the iterations of the first `q`, which are not marked either.
/// Returns the resolver and the indices of the nodes the tests use.
struct NestedRepeats {
    resolver: Resolver,
    a_idx: Index,
    r_idx: Index,
    g1_idx: Index,
    q1_idx: Index,
    g2_idx: Index,
    q2_idx: Index,
    g3_idx: Index,
    t_idx: Index,
    g4_idx: Index,
    q4_idx: Index,
    g11_idx: Index,
    g12_idx: Index,
    e_idx: Index,
    f_idx: Index,
}

fn nested_repeats() -> NestedRepeats {
    let dast_root = dast_root_no_position(r#"<a><repeat name="r"><b/></repeat></a>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let r_idx = find(&flat_root, "repeat").unwrap();
    let mut resolver = Resolver::from_flat_root(&flat_root);

    // The iterations of `r`
    let mut next_idx = flat_root.nodes.len();
    let mut flat_fragment = flat_fragment_from_str(
        r#"<group><repeat name="q"><c/></repeat></group><group><repeat name="q"><c/></repeat></group><group><s/><t/></group><group><repeat name="q"><c/></repeat><setup/></group>"#,
        next_idx,
        Some(r_idx),
    );
    let g1_idx = next_idx;
    let q1_idx = next_idx + 1;
    let g2_idx = next_idx + 3;
    let q2_idx = next_idx + 4;
    let g3_idx = next_idx + 6;
    let t_idx = next_idx + 8;
    let g4_idx = next_idx + 9;
    let q4_idx = next_idx + 10;
    mark_index_pass_through(&mut flat_fragment, &[g1_idx, g2_idx, g4_idx]);
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: r_idx },
    );

    // The iterations of the first `q`. The second one has not expanded.
    let flat_fragment = flat_fragment_from_str(
        r#"<group><d name="v"/></group><group><e/><f/></group>"#,
        next_idx,
        Some(q1_idx),
    );
    let g11_idx = next_idx;
    let g12_idx = next_idx + 2;
    let e_idx = next_idx + 3;
    let f_idx = next_idx + 4;
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: q1_idx },
    );

    NestedRepeats {
        resolver,
        a_idx,
        r_idx,
        g1_idx,
        q1_idx,
        g2_idx,
        q2_idx,
        g3_idx,
        t_idx,
        g4_idx,
        q4_idx,
        g11_idx,
        g12_idx,
        e_idx,
        f_idx,
    }
}

fn index_path(name: &'static str, indices: Vec<&'static str>) -> Vec<FlatPathPart> {
    make_path_with_indices(&[TestPathPart { name, indices }], None)
}

#[test]
fn an_index_passes_through_an_iteration_holding_one_repeat() {
    let NestedRepeats {
        resolver,
        a_idx,
        r_idx,
        g1_idx,
        q1_idx,
        g11_idx,
        g12_idx,
        ..
    } = nested_repeats();

    // `$r[1]` is the first iteration of `r`
    let path = index_path("r", vec!["1"]);
    assert_eq!(
        resolver.resolve(path.clone(), a_idx, false),
        Ok(RefResolution {
            node_idx: g1_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, r_idx, g1_idx],
            child_indexes: vec![],
        })
    );

    // `$r[1][2]` is iteration 2 of the repeat in iteration 1: not a child of the iteration
    let path = index_path("r", vec!["1", "2"]);
    assert_eq!(
        resolver.resolve(path.clone(), a_idx, false),
        Ok(RefResolution {
            node_idx: g12_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, r_idx, g1_idx, q1_idx, g12_idx],
            child_indexes: vec![],
        })
    );

    // `$r[1][1]` is iteration 1 of that repeat, not the repeat itself
    let path = index_path("r", vec!["1", "1"]);
    assert_eq!(
        resolver
            .resolve(path.clone(), a_idx, false)
            .map(|res| res.node_idx),
        Ok(g11_idx)
    );

    // `$r[1][1].v` names a component inside that iteration
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "r",
                indices: vec!["1", "1"],
            },
            TestPathPart {
                name: "v",
                indices: vec![],
            },
        ],
        None,
    );
    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert!(resolution.unresolved_path.is_none());
    assert!(resolution.child_indexes.is_empty());
}

#[test]
fn an_index_past_the_instances_it_passes_to_is_left_unresolved_there() {
    let NestedRepeats {
        resolver,
        a_idx,
        r_idx,
        g1_idx,
        q1_idx,
        g2_idx,
        q2_idx,
        ..
    } = nested_repeats();

    // `$r[1][3]`: the inner repeat has only two iterations,
    // so the index is left for the worker on the inner repeat, not on the iteration
    let path = index_path("r", vec!["1", "3"]);
    let resolution = resolver.resolve(path.clone(), a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, q1_idx);
    assert_eq!(
        resolution.nodes_in_resolved_path,
        vec![a_idx, r_idx, g1_idx, q1_idx]
    );
    let unresolved_path = resolution.unresolved_path.unwrap();
    assert_eq!(unresolved_path.len(), 1);
    assert_eq!(unresolved_path[0].name, "");
    assert_eq!(unresolved_path[0].index, path[0].index[1..]);

    // `$r[2][1]`: the inner repeat of iteration 2 has not expanded,
    // so the worker waits on it
    let path = index_path("r", vec!["2", "1"]);
    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, q2_idx);
    assert!(resolution.nodes_in_resolved_path.contains(&g2_idx));
    assert!(resolution.unresolved_path.is_some());
}

#[test]
fn an_index_into_a_group_reports_the_child_it_selects() {
    let NestedRepeats {
        resolver,
        a_idx,
        g12_idx,
        e_idx,
        f_idx,
        g3_idx,
        t_idx,
        ..
    } = nested_repeats();

    // `$r[1][2][2]`: the inner iteration holds two components,
    // so its second child is selected by the deprecated child indexing
    let path = index_path("r", vec!["1", "2", "2"]);
    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, f_idx);
    assert_eq!(resolution.child_indexes, vec![child_index(g12_idx, f_idx)]);

    let path = index_path("r", vec!["1", "2", "1"]);
    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, e_idx);
    assert_eq!(resolution.child_indexes, vec![child_index(g12_idx, e_idx)]);

    // `$r[3][2]`: an iteration holding two components selects among its children, as a `<group>` does
    let path = index_path("r", vec!["3", "2"]);
    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, t_idx);
    assert_eq!(resolution.child_indexes, vec![child_index(g3_idx, t_idx)]);
}

#[test]
fn an_index_passes_through_an_iteration_to_the_component_at_the_marked_position() {
    let NestedRepeats {
        resolver,
        a_idx,
        g4_idx,
        q4_idx,
        ..
    } = nested_repeats();

    // `$r[4][1]`: the iteration also holds a `<setup>`, which does not stop the index passing to the repeat
    let path = index_path("r", vec!["4", "1"]);
    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, q4_idx);
    assert!(resolution.nodes_in_resolved_path.contains(&g4_idx));
    assert!(resolution.unresolved_path.is_some());
    assert!(resolution.child_indexes.is_empty());
}

#[test]
fn a_child_index_records_where_the_index_was_written() {
    let dast_root = dast_root_no_position(r#"<a><group name="g"><b/><c/></group></a>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let resolver = Resolver::from_flat_root(&flat_root);

    let position = Position {
        start: Point {
            line: 1,
            column: 3,
            offset: Some(2),
        },
        end: Point {
            line: 1,
            column: 6,
            offset: Some(5),
        },
    };
    let mut path = index_path("g", vec!["2"]);
    path[0].index[0].position = Some(position.clone());

    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, c_idx);
    assert_eq!(
        resolution.child_indexes,
        vec![ChildIndex {
            container_idx: g_idx,
            child_idx: c_idx,
            position: Some(position),
        }]
    );
}
