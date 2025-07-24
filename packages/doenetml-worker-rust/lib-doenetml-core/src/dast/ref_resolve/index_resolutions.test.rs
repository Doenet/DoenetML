use std::ops::Range;

use super::*;
use crate::{
    dast::{
        flat_dast::{FlatIndex, FlatPathPart, FlatRoot},
        ref_resolve::{RefResolution, ResolutionError, test_helpers::*},
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
            nodes_in_resolved_path: vec![c_idx, b_idx]
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
            nodes_in_resolved_path: vec![c_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx, f_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx, e_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx]
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
            nodes_in_resolved_path: vec![c_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g2_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g2_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g2_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g1_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx, g3_idx, d_idx]
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
            nodes_in_resolved_path: vec![a_idx, s_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, b_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, c_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx, d_idx, e_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx]
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
            nodes_in_resolved_path: vec![a_idx, g_idx]
        })
    );
}
