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
            child_index: None,
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
            child_index: None,
        })
    );
}

#[test]
fn an_index_after_a_group_with_implicit_index_resolutions_names_its_child_and_stops() {
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
    assert_stops_at_child_index(&referent, g_idx, Some(c_idx), 2);

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
    assert_stops_at_child_index(&referent, g_idx, Some(d_idx), 2);

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
    assert_stops_at_child_index(&referent, g_idx, Some(d_idx), 2);

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
    assert_stops_at_child_index(&referent, g_idx, Some(c_idx), 2);

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
    assert_stops_at_child_index(&referent, g_idx, None, 2);
    assert_eq!(referent.unwrap().unresolved_path, Some(unresolved_path));
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
        })
    );
}

/// A `ReplaceRange` past the end of the parent's index resolutions is a
/// caller's miscount (#2478's row 4 was hidden by it being skipped), so it
/// fails loudly in tests (#2520 item 7).
#[test]
#[should_panic(expected = "past the end")]
fn a_replace_range_past_the_end_fails_loudly() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <select name="s" />
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let s_idx = find(&flat_root, "select").unwrap();

    let flat_fragment = flat_fragment_from_str(
        r#"
    <group><b name="z" /></group>"#,
        s_idx + 1,
        Some(s_idx),
    );

    let mut resolver = Resolver::from_flat_root(&flat_root);
    // `s` has no index resolutions yet, so replacing its second does not fit.
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: flat_fragment.parent_idx.unwrap(),
            range: Range { start: 1, end: 2 },
        },
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
    // An index selects among the group's index resolutions, as among the instances of a
    // component, rather than naming nothing, as it does after a group holding two components
    resolver.set_index_kind(g_idx, IndexKind::Instances);

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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
            child_index: None,
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
    assert_stops_at_child_index(&referent, g_idx, Some(b_idx), 2);

    // `g[2]` resolves to c
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_stops_at_child_index(&referent, g_idx, Some(c_idx), 2);

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
    assert_stops_at_child_index(&referent, g_idx, Some(d_idx), 2);

    // `g[2]` still resolves to c
    let path = make_path_with_indices(
        &[TestPathPart {
            name: "g",
            indices: vec!["2"],
        }],
        None,
    );
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_stops_at_child_index(&referent, g_idx, Some(c_idx), 2);
}

#[test]
fn replace_nodes_with_no_parent_but_index_resolutions() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <group name="g">
               <b><c name="y" /></b> text
            </group>
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    // It holds two components, `<b>` and the text, so an index after it names nothing
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
    assert_stops_at_child_index(&referent, g_idx, Some(b_idx), 2);

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
            child_index: None,
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
    assert_stops_at_child_index(&referent, g_idx, None, 2);
    assert_eq!(
        referent.unwrap().unresolved_path,
        Some(unresolved_path.clone())
    );

    // Add a fragment without a parent but as the second index resolution of the `<group>`.
    let flat_fragment = flat_fragment_from_str(
        r#"
    <d><e name="z" /></d>"#,
        c_idx + 1,
        None,
    );

    let d_idx = c_idx + 1;

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
    assert_stops_at_child_index(&referent, g_idx, Some(d_idx), 2);

    let path = make_path(["g", "z"], None);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(make_path(["z"], None)),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx],
            child_index: None,
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
    assert_stops_at_child_index(&referent, g_idx, None, 2);
    assert_eq!(
        referent.unwrap().unresolved_path,
        Some(unresolved_path.clone())
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
    let flat_fragment = flat_fragment_from_str(
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
            child_index: None,
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
            child_index: None,
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
    assert!(resolution.child_index.is_none());
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
fn an_index_into_a_group_names_nothing_and_reports_the_child_it_would_select() {
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

    // `$r[1][2][2]`: the inner iteration holds two components, and an index
    // does not select a child, so the path stops at the iteration
    let path = index_path("r", vec!["1", "2", "2"]);
    let resolution = resolver.resolve(path, a_idx, false);
    assert_stops_at_child_index(&resolution, g12_idx, Some(f_idx), 2);

    let path = index_path("r", vec!["1", "2", "1"]);
    let resolution = resolver.resolve(path, a_idx, false);
    assert_stops_at_child_index(&resolution, g12_idx, Some(e_idx), 2);

    // `$r[3][2]`: an iteration holding two components names nothing after an index, as a `<group>` does
    let path = index_path("r", vec!["3", "2"]);
    let resolution = resolver.resolve(path, a_idx, false);
    assert_stops_at_child_index(&resolution, g3_idx, Some(t_idx), 2);

    // `$r[3][5]`: past its children, there is no child to report
    let path = index_path("r", vec!["3", "5"]);
    let resolution = resolver.resolve(path, a_idx, false);
    assert_stops_at_child_index(&resolution, g3_idx, None, 2);
}

#[test]
fn an_index_passes_through_an_iteration_to_its_one_component_after_a_setup() {
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
    assert!(resolution.child_index.is_none());
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
    assert_eq!(resolution.node_idx, g_idx);
    assert_eq!(
        resolution.child_index,
        Some(ChildIndex {
            container_idx: g_idx,
            child_idx: Some(c_idx),
            position: Some(position),
            count: 2,
        })
    );
}

/// The `<setup>` a repeat adds to an iteration keeps its place among the iteration's index
/// resolutions, but an index that would select it is past the iteration's content (#2438):
/// the resolution stops at the iteration with that index unresolved, and nothing in the
/// setup is reached through it.
#[test]
fn an_index_does_not_reach_the_setup_a_repeat_adds() {
    let dast_root = dast_root_no_position(r#"<a><repeat name="r"><b/></repeat></a>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let r_idx = find(&flat_root, "repeat").unwrap();
    let mut resolver = Resolver::from_flat_root(&flat_root);

    let next_idx = flat_root.nodes.len();
    let mut flat_fragment = flat_fragment_from_str(
        r#"<group><c/><setup><d name="v"/></setup><e/></group>"#,
        next_idx,
        Some(r_idx),
    );
    let g_idx = next_idx;
    let c_idx = next_idx + 1;
    let setup_idx = next_idx + 2;
    let e_idx = next_idx + 4;
    mark_iteration_aliases(&mut flat_fragment, &[setup_idx]);
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: r_idx },
    );

    // `$r[1][1]` and `$r[1][2]` would select the two components, before and after the
    // setup, which is not counted among them (#2520 item 6), and which an index does not do
    for (index, child_idx) in [("1", c_idx), ("2", e_idx)] {
        assert_stops_at_child_index(
            &resolver.resolve(index_path("r", vec!["1", index]), a_idx, false),
            g_idx,
            Some(child_idx),
            2,
        );
    }

    // `$r[1][3]` is past the two components, so no child is reported
    let path = index_path("r", vec!["1", "3"]);
    assert_stops_at_child_index(
        &resolver.resolve(path.clone(), a_idx, false),
        g_idx,
        None,
        2,
    );

    // and `$r[1][2].v` does not reach what the setup holds
    let path = make_path_with_indices(
        &[
            TestPathPart {
                name: "r",
                indices: vec!["1", "2"],
            },
            TestPathPart {
                name: "v",
                indices: vec![],
            },
        ],
        None,
    );
    assert_eq!(
        resolver.resolve(path, a_idx, false).map(|res| res.node_idx),
        Ok(g_idx)
    );
}

/// A `<group>` whose whole content is one reference (`<group>$l</group>`, `<option>$l</option>`)
/// passes an index to that reference while it has not expanded, so that the index waits. Once it
/// has, what it made takes its place among the group's index resolutions, and the worker says what
/// an index does with it (`index_parent_reference`): select among it, when the reference names a
/// list or a composite that produces instances, and never among what follows it; pass to the one
/// component it made; or name nothing, when it made several.
#[test]
fn an_index_after_a_group_holding_one_reference_follows_what_it_made() {
    let dast_root = dast_root_no_position(r#"<a><repeat name="r"><b/></repeat></a>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let r_idx = find(&flat_root, "repeat").unwrap();
    let mut resolver = Resolver::from_flat_root(&flat_root);

    // The iteration: the reference, then a setup
    let next_idx = flat_root.nodes.len();
    let mut flat_fragment = flat_fragment_from_str(
        r#"<group><copy/><setup><e name="v"/></setup></group>"#,
        next_idx,
        Some(r_idx),
    );
    let g_idx = next_idx;
    let copy_idx = next_idx + 1;
    // the element the worker makes for a reference, which the parser does not keep
    if let FlatNode::Element(element) = &mut flat_fragment.nodes[1] {
        element.name = REFERENCE_ELEMENT.into();
    }
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: r_idx },
    );

    // Not expanded: `$r[1][2]` waits on the reference
    let path = index_path("r", vec!["1", "2"]);
    let resolution = resolver.resolve(path.clone(), a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, copy_idx);
    assert_eq!(
        resolution.nodes_in_resolved_path,
        vec![a_idx, r_idx, g_idx, copy_idx]
    );
    assert_eq!(
        resolution.unresolved_path.unwrap()[0].index,
        path[0].index[1..]
    );
    assert!(resolution.child_index.is_none());

    // The reference made `c` and `d`, the instances of what it names
    let mut flat_fragment = flat_fragment_from_str(r#"<c/><d/>"#, next_idx + 4, Some(copy_idx));
    let c_idx = next_idx + 4;
    let d_idx = next_idx + 5;
    flat_fragment.index_parent_reference = Some(ReferenceContent::Instances);
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: g_idx,
            range: Range { start: 0, end: 1 },
        },
    );
    for (index, idx) in [("1", c_idx), ("2", d_idx)] {
        let path = index_path("r", vec!["1", index]);
        assert_eq!(
            resolver.resolve(path.clone(), a_idx, false),
            Ok(RefResolution {
                node_idx: idx,
                unresolved_path: None,
                original_path: path,
                nodes_in_resolved_path: vec![a_idx, r_idx, g_idx, idx],
                child_index: None,
            })
        );
    }

    // `$r[1][3]` is past what the reference made, and does not reach the setup:
    // it is left for the worker, which says how many there are
    let resolution = resolver
        .resolve(index_path("r", vec!["1", "3"]), a_idx, false)
        .unwrap();
    assert_eq!(resolution.node_idx, g_idx);
    assert!(resolution.unresolved_path.is_some());
    assert!(resolution.child_index.is_none());

    // It made several components that are not instances: an index names nothing
    let mut flat_fragment = flat_fragment_from_str(r#""#, next_idx + 6, Some(copy_idx));
    flat_fragment.index_parent_reference = Some(ReferenceContent::Several { count: 2 });
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: g_idx,
            range: Range { start: 0, end: 0 },
        },
    );
    assert_stops_at_child_index(
        &resolver.resolve(index_path("r", vec!["1", "2"]), a_idx, false),
        g_idx,
        Some(d_idx),
        2,
    );
    // past them, there is no child to report, and the setup is not one
    assert_stops_at_child_index(
        &resolver.resolve(index_path("r", vec!["1", "3"]), a_idx, false),
        g_idx,
        None,
        2,
    );

    // It made one component, the second: an index passes to it
    let mut flat_fragment = flat_fragment_from_str(r#""#, next_idx + 6, Some(copy_idx));
    flat_fragment.index_parent_reference = Some(ReferenceContent::One { offset: 2 });
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: g_idx,
            range: Range { start: 0, end: 0 },
        },
    );
    let path = index_path("r", vec!["1", "1"]);
    let resolution = resolver.resolve(path.clone(), a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, d_idx);
    assert_eq!(
        resolution.nodes_in_resolved_path,
        vec![a_idx, r_idx, g_idx, d_idx]
    );
    assert_eq!(
        resolution.unresolved_path.unwrap()[0].index,
        path[0].index[1..]
    );
    assert!(resolution.child_index.is_none());
}

/// A `<group>` the author wrote is decided at load: its one component takes an index after it,
/// whatever that component is, ignoring blank text and a `<setup>`; any other text, or a second
/// component, makes an index name nothing, and a reference not yet expanded takes the index to
/// wait on. A group that extends something waits for its content.
/// The child an index after a group of several would have selected is counted among its
/// components, as the count is: a `<setup>` is not one, so `$g[1]` of a group whose
/// `<setup>` comes first is at the first `<m>`, and `$g[2]` at the `<n>` (#2520 item 6).
#[test]
fn the_child_an_index_would_select_skips_a_setup() {
    let dast_root = dast_root_no_position(
        r#"<a>
            <group name="g"><setup><s name="v"/></setup><m name="m1"/><n name="n1"/></group>
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();
    let m_idx = find(&flat_root, "m").unwrap();
    let n_idx = find(&flat_root, "n").unwrap();
    let resolver = Resolver::from_flat_root(&flat_root);

    for (index, child) in [("1", Some(m_idx)), ("2", Some(n_idx)), ("3", None)] {
        assert_stops_at_child_index(
            &resolver.resolve(index_path("g", vec![index]), a_idx, false),
            g_idx,
            child,
            2,
        );
    }
}

#[test]
fn an_authored_group_passes_an_index_to_its_one_component() {
    let dast_root = dast_root_no_position(
        r#"<a>
            <group name="g1"> <m/> </group>
            <group name="g2"><setup><s name="v"/></setup><m/></group>
            <group name="g3">Value: <m/></group>
            <group name="g4"><m/><n/></group>
            <group name="g5">$x</group>
            <group name="g6"></group>
            <group name="g7" extend="$g1"/>
            <x name="x"/>
        </a>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let resolver = Resolver::from_flat_root(&flat_root);
    let group = |name: &str| {
        flat_root
            .nodes
            .iter()
            .find_map(|node| match node {
                FlatNode::Element(e)
                    if e.name == "group"
                        && e.attributes.iter().any(|attr| {
                            attr.name == "name"
                                && attr.children == vec![UntaggedContent::Text(name.into())]
                        }) =>
                {
                    Some(e)
                }
                _ => None,
            })
            .unwrap()
    };
    let one_child = |name: &str| {
        group(name)
            .children
            .iter()
            .filter_map(|child| match child {
                UntaggedContent::Ref(idx) => Some(*idx),
                _ => None,
            })
            .last()
            .unwrap()
    };

    // `$g1[2]` and `$g2[2]` pass the index to the `<m>`, which has nothing an index selects,
    // so it is left for the worker there
    for name in ["g1", "g2"] {
        let m_idx = one_child(name);
        let path = index_path(name, vec!["2"]);
        let resolution = resolver.resolve(path.clone(), a_idx, false).unwrap();
        assert_eq!(resolution.node_idx, m_idx, "{name}");
        assert_eq!(resolution.unresolved_path.unwrap()[0].index, path[0].index);
        assert!(resolution.child_index.is_none());
    }

    // `$g3[2]` and `$g4[2]`: two components
    for name in ["g3", "g4"] {
        let g_idx = group(name).idx;
        assert_stops_at_child_index(
            &resolver.resolve(index_path(name, vec!["2"]), a_idx, false),
            g_idx,
            Some(one_child(name)),
            2,
        );
    }

    // `$g5[1]` waits on the reference
    let path = index_path("g5", vec!["1"]);
    let resolution = resolver.resolve(path, a_idx, false).unwrap();
    assert_eq!(resolution.node_idx, one_child("g5"));
    assert!(matches!(
        flat_root.nodes[resolution.node_idx],
        FlatNode::Ref(_)
    ));
    assert!(resolution.child_index.is_none());

    // `$g6[1]`: no component
    assert_stops_at_child_index(
        &resolver.resolve(index_path("g6", vec!["1"]), a_idx, false),
        group("g6").idx,
        None,
        0,
    );

    // `$g7[1]` waits for what the extend makes
    let resolution = resolver
        .resolve(index_path("g7", vec!["1"]), a_idx, false)
        .unwrap();
    assert_eq!(resolution.node_idx, group("g7").idx);
    assert!(resolution.unresolved_path.is_some());
    assert!(resolution.child_index.is_none());
}

/// A `<group>` that a copy or an extend made (`<group name="g" extend="$r[1]"/>`) is decided from
/// the content the fragment adds to it (`parent_content`), as any group is, and again each time
/// that content is made again (#2438).
#[test]
fn a_group_made_by_a_copy_is_decided_from_its_content() {
    let dast_root = dast_root_no_position(r#"<a><group name="g"/></a>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();
    let mut resolver = Resolver::from_flat_root(&flat_root);

    let mut next_idx = flat_root.nodes.len();
    let mut flat_fragment =
        flat_fragment_from_str(r#"<repeat name="q"><c/></repeat>"#, next_idx, Some(g_idx));
    let q_idx = next_idx;
    flat_fragment.parent_content = Some(1);
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: g_idx },
    );

    let flat_fragment = flat_fragment_from_str(
        r#"<group><e/></group><group><f/></group>"#,
        next_idx,
        Some(q_idx),
    );
    let q2_idx = next_idx + 2;
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: q_idx },
    );

    // `$g[2]` is iteration 2 of `q`, as for the iteration `g` was made of
    let path = index_path("g", vec!["2"]);
    assert_eq!(
        resolver.resolve(path.clone(), a_idx, false),
        Ok(RefResolution {
            node_idx: q2_idx,
            unresolved_path: None,
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx, q_idx, q2_idx],
            child_index: None,
        })
    );

    // Made again holding two components, an index after `g` names nothing
    let mut flat_fragment = flat_fragment_from_str(r#"<h/> text"#, next_idx, Some(g_idx));
    let h_idx = next_idx;
    flat_fragment.parent_content = Some(2);
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: g_idx },
    );
    assert_stops_at_child_index(
        &resolver.resolve(index_path("g", vec!["1"]), a_idx, false),
        g_idx,
        Some(h_idx),
        2,
    );
}
