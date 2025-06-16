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
            original_path: make_path(["y"])
        })
    );

    let referent = resolver.resolve(make_path(["y", "z"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"])
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
            original_path: make_path(["y", "z", "w"])
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
            original_path: path
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
            original_path: path
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
            original_path: path
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
            original_path: path
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
            original_path: path
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
            original_path: path
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
            original_path: path
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
            original_path: path
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
            original_path: make_path(["y"])
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
            original_path: make_path(["y"])
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
            original_path: make_path(["y"])
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
            original_path: make_path(["y", "z"])
        })
    );

    // Starting at `c`, one can still search outward to find `q`
    let referent = resolver.resolve(make_path(["q"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["q"])
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
        b_idx,
    );

    let c_idx = f_idx + 1;
    let g_idx = f_idx + 2;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(&flat_fragment, None);

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
            original_path: make_path(["y", "z"])
        })
    );
    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["y", "w"])
        })
    );

    // Starting at newly added nodes, one can still search outward to find `y` and q
    let referent = resolver.resolve(make_path(["y"]), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"])
        })
    );
    let referent = resolver.resolve(make_path(["q"]), f_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: f_idx,
            unresolved_path: None,
            original_path: make_path(["q"])
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
        flat_fragment_from_str(r#"<c name="y" />"<e name="z" />"#, d_idx + 1, a_idx);

    let e_idx = d_idx + 2;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(&flat_fragment, None);

    // searching for `x.y` finds the original component `b`. The addition of `c` to `a` did not make that ambiguous.
    let referent = resolver.resolve(make_path(["x", "y"]), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["x", "y"])
        })
    );

    // searching for `x.z` does find the added component `e`
    let referent = resolver.resolve(make_path(["x", "z"]), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: e_idx,
            unresolved_path: None,
            original_path: make_path(["x", "z"])
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
        s_idx,
    );

    let g1_idx = f_idx + 1;
    let b_idx = f_idx + 2;
    let g2_idx = f_idx + 3;
    let c_idx = f_idx + 4;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(
        &flat_fragment,
        Some(AsIndexResolutions {
            parent_idx: s_idx,
            replace_mode: ReplaceMode::ReplaceAll,
        }),
    );

    println!("{:#?}", resolver);

    // Since the `z`'s ws added later, they cannot be found directly from `a`
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
            original_path: path
        })
    );

    let path = make_path_with_indices(&[
        TestPathPart {
            name: "x",
            indices: vec![],
        },
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
            original_path: path
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
            original_path: path
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
            original_path: path
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
        b_idx,
    );

    let c_idx = f_idx + 1;
    let g_idx = f_idx + 2;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(&flat_fragment, None);

    // Prefacing the added components with the fragment parent `y` allows them to be found as `y.z` and `y.w`.
    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"])
        })
    );
    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["y", "w"])
        })
    );

    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"])
        })
    );

    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["y", "w"])
        })
    );

    resolver.delete_nodes(&flat_fragment.nodes[1..]);

    let referent = resolver.resolve(make_path(["y", "z"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"])
        })
    );

    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["w"])),
            original_path: make_path(["y", "w"])
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
            original_path: make_path(["y", "z"])
        })
    );
    let referent = resolver.resolve(make_path(["y", "w"]), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["w"])),
            original_path: make_path(["y", "w"])
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
        parent_idx: usize,
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

        FlatFragment::from_dast_with_id_shift(&sub_tree, idx_to_id_shift, Some(parent_idx))
    }
}
