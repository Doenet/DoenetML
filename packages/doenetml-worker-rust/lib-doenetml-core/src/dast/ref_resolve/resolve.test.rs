use super::*;
use crate::{
    dast::{flat_dast::FlatRoot, ref_resolve::test_helpers::*},
    test_utils::*,
};

#[test]
fn can_resolve_name_among_parents() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />
        <e />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    // Searching from `c` for `y` should find the `b` node
    let y_name = NameWithSource {
        name: "y".to_string(),
        source_doc: None.into(),
    };
    let referent = resolver.search_parents(&y_name, c_idx);
    assert_eq!(referent, Ok(b_idx));

    let referent = resolver.search_parents(&y_name, b_idx);
    assert_eq!(referent, Ok(b_idx));

    // Searching from `e` should fail because there are multiple `y`s that could be referred to.
    let referent = resolver.search_parents(&y_name, e_idx);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
}

#[test]
fn resolve_to_parent_in_ambiguous_case() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="x" />
        <e />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    // Searching from `c` or `b` for `x` should find its parent `<a>`
    let x_name = NameWithSource {
        name: "x".to_string(),
        source_doc: None.into(),
    };
    let referent = resolver.search_parents(&x_name, c_idx);
    assert_eq!(referent, Ok(a_idx));

    let referent = resolver.search_parents(&x_name, b_idx);
    assert_eq!(referent, Ok(a_idx));

    // Searching from `d` should find itself
    let referent = resolver.search_parents(&x_name, d_idx);
    assert_eq!(referent, Ok(d_idx));

    // Searching from `e` should fail because there are multiple `x`s that could be referred to.
    let referent = resolver.search_parents(&x_name, e_idx);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
}

#[test]
fn can_resolve_names() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
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
    let referent = resolver.resolve(make_path(["y"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );

    let referent = resolver.resolve(make_path(["y", "z"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"], None),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );

    // Unused path part is left intact
    let referent = resolver.resolve(make_path(["y", "z", "w"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: Some(vec![FlatPathPart {
                name: "w".into(),
                index: vec![],
                position: None,
                source_doc: None.into()
            }]),
            original_path: make_path(["y", "z", "w"], None),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );
}

#[test]
fn parent_name_supersedes_unique_descendant() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <b name="y">
                <c name="y" />
            </b>
        </a>
        <d name="z" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Searching for `y` from `c` should find itself
    let referent = resolver.resolve(make_path(["y"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![c_idx]
        })
    );

    // Searching for `y` from `b`  or `d` should find `b`
    let referent = resolver.resolve(make_path(["y"], None), b_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![b_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![d_idx, b_idx]
        })
    );

    // Searching for `y.y` from `b`  or `d` should find `c`
    let referent = resolver.resolve(make_path(["y", "y"], None), b_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y"], None),
            nodes_in_resolved_path: vec![b_idx, c_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "y"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y"], None),
            nodes_in_resolved_path: vec![d_idx, b_idx, c_idx]
        })
    );
}

#[test]
fn parent_name_supersedes_ambiguous_descendants() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <b name="y">
                <c name="y" />
                <e name="y" />
                <f/>
            </b>
        </a>
        <d name="z" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find(&flat_root, "b").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Searching for `y` from `f` is ambiguous
    let referent = resolver.resolve(make_path(["y"], None), f_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));

    // Searching for `y` from `b`  or `d` should find `b`
    let referent = resolver.resolve(make_path(["y"], None), b_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![b_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![d_idx, b_idx]
        })
    );

    // Searching for `y.y` from `b`  or `d` is ambiguous
    let referent = resolver.resolve(make_path(["y", "y"], None), b_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
    let referent = resolver.resolve(make_path(["y", "y"], None), d_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
}

#[test]
fn parent_name_supersedes_unique_descendant_swapping_order() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x"><b name="y"><c name="y" /></b></a>
        <d name="z" />"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

    // Swap the the positions of `<b>`, and `<c>` so the dast becomes
    // ```
    // <a name="x"><c name="y"><b name="y" /></c></a>
    // <d name="z" />
    // ```
    // In this way, the index `c_idx` of the parent will be larger than the index `b_idx` of the child,
    // and we can test that `<c>` will supersede `<b>` when resolving "y"
    // even though `<b>` will be encountered first when building the name map

    if let FlatNode::Element(element) = &mut flat_root.nodes[a_idx] {
        element.children[0] = UntaggedContent::Ref(c_idx);
    }

    if let FlatNode::Element(element) = &mut flat_root.nodes[c_idx] {
        element.parent = Some(a_idx);
        element.children.push(UntaggedContent::Ref(b_idx));
    }

    if let FlatNode::Element(element) = &mut flat_root.nodes[b_idx] {
        element.parent = Some(c_idx);
        element.children = vec![];
    }

    let resolver = Resolver::from_flat_root(&flat_root);

    // Searching for `y` from `b` should find itself
    let referent = resolver.resolve(make_path(["y"], None), b_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![b_idx]
        })
    );

    // Searching for `y` from `c`  or `d` should find `c`
    let referent = resolver.resolve(make_path(["y"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![c_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![d_idx, c_idx]
        })
    );

    // Searching for `y.y` from `c`  or `d` should find `b`
    let referent = resolver.resolve(make_path(["y", "y"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y"], None),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "y"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y"], None),
            nodes_in_resolved_path: vec![d_idx, c_idx, b_idx]
        })
    );
}

#[test]
fn parent_name_supersedes_ambiguous_descendants_swapping_order() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x"><b name="y"><f/><c name="y" /><e name="y" /></b></a>
        <d name="z" />"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();

    // Swap the the positions of `<b>`, and `<c>` so the dast becomes
    // ```
    // <a name="x"><e name="y"><f/><c name="y" /><b name="y" /></b></a>
    // <d name="z" />
    // ```
    // In this way, the index `e_idx` of the parent will be larger than the indices `b_idx` and `c_idx` of the children,
    // and we can test that `<e>` will supersede `<b>` and `<c>` when resolving "y"
    // even though `<b>` and `<c>` will be encountered first when building the name map

    if let FlatNode::Element(element) = &mut flat_root.nodes[a_idx] {
        element.children[0] = UntaggedContent::Ref(e_idx);
    }
    if let FlatNode::Element(element) = &mut flat_root.nodes[e_idx] {
        element.parent = Some(a_idx);
        element.children.push(UntaggedContent::Ref(f_idx));
        element.children.push(UntaggedContent::Ref(c_idx));
        element.children.push(UntaggedContent::Ref(b_idx));
    }
    if let FlatNode::Element(element) = &mut flat_root.nodes[b_idx] {
        element.parent = Some(e_idx);
        element.children = vec![];
    }
    if let FlatNode::Element(element) = &mut flat_root.nodes[c_idx] {
        element.parent = Some(e_idx);
    }
    if let FlatNode::Element(element) = &mut flat_root.nodes[f_idx] {
        element.parent = Some(e_idx);
    }

    let resolver = Resolver::from_flat_root(&flat_root);

    // Searching for `y` from `f` is ambiguous
    let referent = resolver.resolve(make_path(["y"], None), f_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));

    // Searching for `y` from `e`  or `d` should find `e`
    let referent = resolver.resolve(make_path(["y"], None), e_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: e_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![e_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: e_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![d_idx, e_idx]
        })
    );

    // Searching for `y.y` from `e`  or `d` is ambiguous
    let referent = resolver.resolve(make_path(["y", "y"], None), e_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
    let referent = resolver.resolve(make_path(["y", "y"], None), d_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
}

#[test]
fn can_resolve_name_at_ref_origin() {
    let dast_root = dast_root_no_position(r#"<a name="x" />$b"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    // The ref `$b` should be right after the `a` node
    let b_idx = a_idx + 1;

    let x_name = NameWithSource {
        name: "x".to_string(),
        source_doc: None.into(),
    };
    let referent = resolver.search_parents(&x_name, b_idx);
    assert_eq!(referent, Ok(a_idx));
}

#[test]
fn resolve_with_skip_parent_match() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
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
    let referent = resolver.resolve(make_path(["y"], None), c_idx, true);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: Some(make_path(["y"], None)),
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![c_idx]
        })
    );

    // When `skip_parent_match` is not set,
    // searching from `c` for `y` should find the `b` node
    let referent = resolver.resolve(make_path(["y"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![c_idx, b_idx]
        })
    );

    // When `skip_parent_match` is set,
    // searching from `x` for `y` should find `b`
    let referent = resolver.resolve(make_path(["y"], None), a_idx, true);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );

    // When `skip_parent_match` is not set,
    // searching from `x` for `y` should get an ambiguous result
    let referent = resolver.resolve(make_path(["y"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
}

#[test]
fn elements_with_children_invisible_to_their_grandparents() {
    // Note: `<option>` is tagged with `ChildrenInvisibleToTheirGrandparents`
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <option name="y">
                <c name="z" />
            </option>
        </a>
        <d name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let option_idx = find(&flat_root, "option").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Since an `<option>` component has invisible children,
    // a search for the name `z` starting at `a_idx` fails.
    let referent = resolver.resolve(make_path(["z"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Similarly, a search for `y.z` finds `<c>`
    let referent = resolver.resolve(make_path(["y", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"], None),
            nodes_in_resolved_path: vec![a_idx, option_idx, c_idx]
        })
    );

    // Starting at `c`, one can still search outward to find `q`
    let referent = resolver.resolve(make_path(["q"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["q"], None),
            nodes_in_resolved_path: vec![c_idx, d_idx]
        })
    );
}

#[test]
fn cannot_reference_elements_from_other_source_doc_without_parent_reference() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <sourceSwitch name="y">
                <c name="z">
                   <d name="u" />
                </c>
            </sourceSwitch>
        </a>
        <e name="q" />"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);

    let a_idx = find(&flat_root, "a").unwrap();
    let s_idx = find(&flat_root, "sourceSwitch").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

    // Add a source doc to `<sourceSwitch>`,
    // which is mimics the case of `<sourceSwitch>` extending an external document,
    // and being name `y2` in that document.
    add_source_doc_to_descendants(
        &mut flat_root,
        s_idx,
        Some(1.into()),
        Some("y2".to_string()),
    );

    let resolver = Resolver::from_flat_root(&flat_root);

    // Name of `<sourceSwitch>` from the second doc is not searchable starting from `a_idx`.
    let referent = resolver.resolve(make_path(["y2"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    // Since the children of `<sourceSwitch>` are from a different doc
    // a search for the names `z` or `u` starting at `a_idx` fails.
    let referent = resolver.resolve(make_path(["z"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["u"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // A search for `y.y2`,`y.y2.z`, `y.u`, and `y.z.u` succeeds as the children of `<sourceSwitch>` are visible from `s_idx`
    let referent = resolver.resolve(make_path(["y", "y2"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y2"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "y2", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y2", "z"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx, c_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "u"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["y", "u"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx, d_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "z", "u"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z", "u"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx, c_idx, d_idx]
        })
    );
}

#[test]
fn elements_from_other_source_doc_cannot_reference_outside_doc() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <sourceSwitch name="y">
                <c name="z">
                   <d name="u" />
                </c>
            </sourceSwitch>
        </a>
        <e name="q" />"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);

    let s_idx = find(&flat_root, "sourceSwitch").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

    // Add a source doc to `<sourceSwitch>`,
    // which is mimics the case of `<sourceSwitch>` extending an external document,
    // and being name `y2` in that document.
    add_source_doc_to_descendants(
        &mut flat_root,
        s_idx,
        Some(1.into()),
        Some("y2".to_string()),
    );

    let resolver = Resolver::from_flat_root(&flat_root);

    // starting at `c`, one cannot find "x", "y", or "q"
    let referent = resolver.resolve(make_path(["x"], Some(1.into())), c_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["y"], Some(1.into())), c_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["q"], Some(1.into())), c_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Starting at `c`, one can still find "y2"
    let referent = resolver.resolve(make_path(["y2"], Some(1.into())), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: None,
            original_path: make_path(["y2"], Some(1.into())),
            nodes_in_resolved_path: vec![c_idx, s_idx]
        })
    );

    // Starting at `c`, one can still find "u"
    let referent = resolver.resolve(make_path(["u"], Some(1.into())), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["u"], Some(1.into())),
            nodes_in_resolved_path: vec![c_idx, d_idx]
        })
    );
}

#[test]
fn references_can_span_three_source_documents() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <sourceSwitch name="y">
                <c name="z">
                   <d name="u" />
                </c>
            </sourceSwitch>
        </a>
        <e name="q" />"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);

    let a_idx = find(&flat_root, "a").unwrap();
    let s_idx = find(&flat_root, "sourceSwitch").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();

    // Add two source docs to `<sourceSwitch>`,
    // which is mimics the case of `<sourceSwitch>` extending an external document
    // which itself extends a third document.
    add_source_doc_to_descendants(
        &mut flat_root,
        s_idx,
        Some(1.into()),
        Some("y2".to_string()),
    );

    add_source_doc_to_descendants(
        &mut flat_root,
        s_idx,
        Some(2.into()),
        Some("y3".to_string()),
    );

    let resolver = Resolver::from_flat_root(&flat_root);

    // Name of `<sourceSwitch>` from the second doc is not searchable starting from `a_idx`.
    let referent = resolver.resolve(make_path(["y2"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    // Since the children of `<sourceSwitch>` are from a different doc
    // a search for the names `z` or `u` starting at `a_idx` fails.
    let referent = resolver.resolve(make_path(["z"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["u"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // A search for `y.y2` succeeds as `y2` is the second name of `<sourceSwitch>`
    let referent = resolver.resolve(make_path(["y", "y2"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y2"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx]
        })
    );
    // Searches for `y.z` and `y.u` stop at `y` as we added a second layer of source documents
    let referent = resolver.resolve(make_path(["y", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: Some(make_path(["z"], None)),
            original_path: make_path(["y", "z"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "u"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: Some(make_path(["u"], None)),
            original_path: make_path(["y", "u"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx]
        })
    );

    // A search for `y.y2.y3`,`y.y2.z` or `y.y2.u` succeeds as we have drilled down to the third document.
    let referent = resolver.resolve(make_path(["y", "y2", "y3"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: s_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y2", "y3"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "y2", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y2", "z"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx, c_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "y2", "u"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["y", "y2", "u"], None),
            nodes_in_resolved_path: vec![a_idx, s_idx, d_idx]
        })
    );
}
