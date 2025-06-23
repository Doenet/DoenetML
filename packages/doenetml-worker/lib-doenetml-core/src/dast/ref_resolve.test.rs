use super::*;
use crate::{
    dast::{flat_dast::FlatIndex, DastElementContent, DastRoot},
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
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

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
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Searching from `c` for `y` should find the `b` node
    let referent = resolver.resolve(make_path(["y"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"]),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );

    let referent = resolver.resolve(make_path(["y", "z"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"]),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );

    // Unused path part is left intact
    let referent = resolver.resolve(make_path(["y", "z", "w"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: Some(vec![FlatPathPart {
                name: "w".into(),
                index: vec![],
                position: None
            }]),
            original_path: make_path(["y", "z", "w"]),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );
}

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
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
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
    }];

    // `$y[2].z`
    let path = vec![
        FlatPathPart {
            name: "y".into(),
            index: index.clone(),
            position: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
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
                    position: None
                },
                FlatPathPart {
                    name: "z".into(),
                    index: vec![],
                    position: None
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
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
        },
    ];
    let referent = resolver.resolve(path.clone(), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));

    let index1 = vec![FlatIndex {
        value: vec![UntaggedContent::Text("1".into())],
        position: None,
    }];
    let index2 = vec![FlatIndex {
        value: vec![UntaggedContent::Text("2".into())],
        position: None,
    }];
    let index3 = vec![FlatIndex {
        value: vec![UntaggedContent::Text("3".into())],
        position: None,
    }];

    // `$g[1]`
    let path = vec![FlatPathPart {
        name: "g".into(),
        index: index1.clone(),
        position: None,
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
        },
        FlatPathPart {
            name: "g".into(),
            index: index2.clone(),
            position: None,
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
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
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
        },
        FlatPathPart {
            name: "g".into(),
            index: index1.clone(),
            position: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
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
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
        },
    ];
    let unresolved_path = vec![
        FlatPathPart {
            name: "".into(),
            index: index3.clone(),
            position: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: vec![],
            position: None,
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
    }];
    // `$y.z[2]`
    let path = vec![
        FlatPathPart {
            name: "y".into(),
            index: vec![],
            position: None,
        },
        FlatPathPart {
            name: "z".into(),
            index: index.clone(),
            position: None,
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
                position: None
            },]),
            original_path: path,
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );
}

#[test]
fn can_resolve_name_at_ref_origin() {
    let dast_root = dast_root_no_position(r#"<a name="x" />$b"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    // The ref `$b` should be right after the `a` node
    let b_idx = a_idx + 1;
    let referent = resolver.search_parents("x", b_idx);
    assert_eq!(referent, Ok(a_idx));
}

#[test]
fn resolve_with_skip_parent_match() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // When `skip_parent_match` is set,
    // searching from `c` for `y` should not find the `b` node but stay at the `c` node and leave everything as unresolved
    let referent = resolver.resolve(make_path(["y"]), c_idx, true);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: Some(make_path(["y"])),
            original_path: make_path(["y"]),
            nodes_in_resolved_path: vec![c_idx]
        })
    );

    // When `skip_parent_match` is not set,
    // searching from `c` for `y` should find the `b` node
    let referent = resolver.resolve(make_path(["y"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"]),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );

    // When `skip_parent_match` is set,
    // searching from `x` for `y` should find `b`
    let referent = resolver.resolve(make_path(["y"]), a_idx, true);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"]),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );

    // When `skip_parent_match` is not set,
    // searching from `x` for `y` should get an ambiguous result
    let referent = resolver.resolve(make_path(["y"]), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
}

#[test]
fn elements_with_dont_search_children() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <option name="y">
                <c name="z" />
            </option>
        </a>
        <d name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let option_idx = find(&flat_root, "option").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Since an `<option>` component does not search children,
    // a search for the name `z` starting at `a_idx` fails.
    let referent = resolver.resolve(make_path(["z"]), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Similarly, a search for `y.z` stops at `y` since `y` is an option
    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: option_idx,
            unresolved_path: Some(make_path(["z"])),
            original_path: make_path(["y", "z"]),
            nodes_in_resolved_path: vec![a_idx, option_idx]
        })
    );

    // Starting at `c`, one can still search outward to find `q`
    let referent = resolver.resolve(make_path(["q"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["q"]),
            nodes_in_resolved_path: vec![c_idx, d_idx]
        })
    );
}

#[test]
fn add_nodes() {
    let dast_root = dast_root_no_position(
        r#"<e><a name="x">
            <b name="y" />
        </a></e>
        <d name="y" /><f name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();

    let flat_fragment = flat_fragment_from_str(
        r#"<c name="z">
          <g name="w" />
        </c>"#,
        f_idx + 1,
        Some(b_idx),
    );

    let c_idx = f_idx + 1;
    let g_idx = f_idx + 2;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(&flat_fragment, IndexResolution::None);

    // Since `z` and `w` were added to parent with name `y`, they cannot be found directly from `a`
    let referent = resolver.resolve(make_path(["z"]), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["w"]), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Prefacing the added components with the fragment parent `y` allows them to be found as `y.z` and `y.w`.
    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"]),
            nodes_in_resolved_path: vec![a_idx, b_idx, c_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["y", "w"]),
            nodes_in_resolved_path: vec![a_idx, b_idx, g_idx]
        })
    );

    // Starting at newly added nodes, one can still search outward to find `y` and `q`
    let referent = resolver.resolve(make_path(["y"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"]),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );
    let referent = resolver.resolve(make_path(["q"]), g_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: f_idx,
            unresolved_path: None,
            original_path: make_path(["q"]),
            nodes_in_resolved_path: vec![g_idx, f_idx]
        })
    );
}

#[test]
fn add_nodes_does_not_make_previous_resolution_ambiguous() {
    let dast_root = dast_root_no_position(
        r#"<a name="x">
            <b name="y" />
        </a>
        <d name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

    let flat_fragment =
        flat_fragment_from_str(r#"<c name="y" />"<e name="z" />"#, d_idx + 1, Some(a_idx));

    let e_idx = d_idx + 2;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(&flat_fragment, IndexResolution::None);

    // searching for `x.y` finds the original component `b`. The addition of `c` to `a` did not make that ambiguous.
    let referent = resolver.resolve(make_path(["x", "y"]), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["x", "y"]),
            nodes_in_resolved_path: vec![d_idx, a_idx, b_idx]
        })
    );

    // searching for `x.z` does find the added component `e`
    let referent = resolver.resolve(make_path(["x", "z"]), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: e_idx,
            unresolved_path: None,
            original_path: make_path(["x", "z"]),
            nodes_in_resolved_path: vec![d_idx, a_idx, e_idx]
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
    let referent = resolver.resolve(make_path(["z"]), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Prefacing the added components with the fragment parent `s` and an index allows them to be found as `s[1].z` and `s[2].z`.
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["1"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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

    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["2"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["3"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(&[
        TestPathPart {
            name: "",
            indices: vec!["3"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "s",
        indices: vec!["2"],
    }]);
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

    let path = make_path_with_indices(&[
        TestPathPart {
            name: "x",
            indices: vec![],
        },
        TestPathPart {
            name: "s",
            indices: vec!["1"],
        },
    ]);
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
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["1"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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

    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["2"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["3"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(&[
        TestPathPart {
            name: "",
            indices: vec!["3"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["1"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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

    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["2"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "s",
            indices: vec!["3"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(&[
        TestPathPart {
            name: "",
            indices: vec!["3"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["1"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["2"],
    }]);
    let unresolved_path = make_path_with_indices(&[TestPathPart {
        name: "",
        indices: vec!["2"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["3"],
    }]);
    let unresolved_path = make_path_with_indices(&[TestPathPart {
        name: "",
        indices: vec!["3"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["1"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["2"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["3"],
    }]);
    let unresolved_path = make_path_with_indices(&[TestPathPart {
        name: "",
        indices: vec!["3"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["1"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["2"],
    }]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["3"],
    }]);
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
fn add_nodes_with_no_parent() {
    let dast_root = dast_root_no_position(
        r#"<e><a name="x">
            <b name="y" />
        </a></e>
        <d name="y" /><f name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();

    let flat_fragment = flat_fragment_from_str(
        r#"<c name="z">
          <g name="w" />
        </c>"#,
        f_idx + 1,
        None,
    );

    let c_idx = f_idx + 1;
    let g_idx = f_idx + 2;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(&flat_fragment, IndexResolution::None);

    // Since `z` and `w` were added without a parent, they cannot be found directly from `a`
    let referent = resolver.resolve(make_path(["z"]), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["w"]), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Starting at `z`, one can find `w`
    let referent = resolver.resolve(make_path(["w"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["w"]),
            nodes_in_resolved_path: vec![c_idx, g_idx]
        })
    );

    // Starting at newly added nodes, one cannot search outward to find `y` or `q`
    let referent = resolver.resolve(make_path(["y"]), c_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    let referent = resolver.resolve(make_path(["q"]), g_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
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
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "g",
            indices: vec!["1"],
        },
        TestPathPart {
            name: "y",
            indices: vec![],
        },
    ]);
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

    let path = make_path_with_indices(&[
        TestPathPart {
            name: "g",
            indices: vec![],
        },
        TestPathPart {
            name: "y",
            indices: vec![],
        },
    ]);
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
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["2"],
    }]);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(&[TestPathPart {
        name: "",
        indices: vec!["2"],
    }]);
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
    let path = make_path_with_indices(&[
        TestPathPart {
            name: "g",
            indices: vec!["2"],
        },
        TestPathPart {
            name: "z",
            indices: vec![],
        },
    ]);
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

    let path = make_path(["g", "z"]);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: Some(make_path(["z"])),
            original_path: path,
            nodes_in_resolved_path: vec![a_idx, g_idx]
        })
    );

    // `g[3]` has no referent
    let path = make_path_with_indices(&[TestPathPart {
        name: "g",
        indices: vec!["3"],
    }]);
    let referent = resolver.resolve(path.clone(), a_idx, false);

    let unresolved_path = make_path_with_indices(&[TestPathPart {
        name: "",
        indices: vec!["3"],
    }]);
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

#[test]
fn delete_nodes() {
    let dast_root = dast_root_no_position(
        r#"<e><a name="x">
            <b name="y" />
        </a></e>
        <d name="y" /><f name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();

    let flat_fragment = flat_fragment_from_str(
        r#"<c name="z">
          <g name="w" />
        </c>"#,
        f_idx + 1,
        Some(b_idx),
    );

    let c_idx = f_idx + 1;
    let g_idx = f_idx + 2;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(&flat_fragment, IndexResolution::None);

    // Prefacing the added components with the fragment parent `y` allows them to be found as `y.z` and `y.w`.
    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"]),
            nodes_in_resolved_path: vec![a_idx, b_idx, c_idx]
        })
    );

    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["y", "w"]),
            nodes_in_resolved_path: vec![a_idx, b_idx, g_idx]
        })
    );

    resolver.delete_nodes(&flat_fragment.nodes[1..]);

    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"]),
            nodes_in_resolved_path: vec![a_idx, b_idx, c_idx]
        })
    );

    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["w"])),
            original_path: make_path(["y", "w"]),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );

    resolver.delete_nodes(&flat_fragment.nodes[0..1]);

    // when the nodes are removed, then `y.z` and `y.w` stop at `y`
    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["z"])),
            original_path: make_path(["y", "z"]),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["w"])),
            original_path: make_path(["y", "w"]),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );
}

mod test_helpers {
    use super::*;

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

    pub fn make_path<'a, T: AsRef<[&'a str]>>(path_str: T) -> Vec<FlatPathPart> {
        let path_str = path_str.as_ref();
        path_str
            .iter()
            .map(|s| FlatPathPart {
                name: s.to_string(),
                index: Vec::new(),
                position: None,
            })
            .collect()
    }

    pub fn make_path_with_indices(test_path: &[TestPathPart]) -> Vec<FlatPathPart> {
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
                    })
                    .collect(),
                position: None,
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
}
