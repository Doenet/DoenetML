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
    let y_name = NameWithDoenetMLId {
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
    // Searching from `c` or `b` for `x` should find the its parent `<a>`
    let x_name = NameWithDoenetMLId {
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
fn can_resolve_name_at_ref_origin() {
    let dast_root = dast_root_no_position(r#"<a name="x" />$b"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    // The ref `$b` should be right after the `a` node
    let b_idx = a_idx + 1;

    let x_name = NameWithDoenetMLId {
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
fn elements_invisible_to_grandparents() {
    // Note: `<_externalContent>` is tagged with `InvisibleToGrandparents`
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <_externalContent name="y">
                <c name="z" />
            </_externalContent>
        </a>
        <d name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    println!("{:#?}", flat_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let external_idx = find(&flat_root, "_externalContent").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Since an `<_externalContent>` is invisible to grandparents,
    // a search for the names `y` or `z` starting at `a_idx` fails.
    let referent = resolver.resolve(make_path(["y"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["z"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // A search for `x.y` or `x.z` succeeds as `<_externalContent>` is visible from its parent `<a>`
    let referent = resolver.resolve(make_path(["x", "y"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: external_idx,
            unresolved_path: None,
            original_path: make_path(["x", "y"], None),
            nodes_in_resolved_path: vec![a_idx, external_idx]
        })
    );
    let referent = resolver.resolve(make_path(["x", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["x", "z"], None),
            nodes_in_resolved_path: vec![a_idx, c_idx]
        })
    );
}

#[test]
fn dont_search_parent() {
    // Note: `<_externalContent>` is tagged with `DontSearchParent`
    let dast_root = dast_root_no_position(
        r#"
        <a name="r">
            <_externalContent name="y">
                <c name="z" />
                <d name="x" />
            </_externalContent>
        </a>
        <b name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    println!("{:#?}", flat_root);
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let external_idx = find(&flat_root, "_externalContent").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // starting at `c`, one cannot find "r" or "q"
    let referent = resolver.resolve(make_path(["r"], None), c_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["q"], None), c_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Starting at `c`, one can still find "x"
    let referent = resolver.resolve(make_path(["x"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: d_idx,
            unresolved_path: None,
            original_path: make_path(["x"], None),
            nodes_in_resolved_path: vec![c_idx, d_idx]
        })
    );

    // Starting at `c`, one can still find "y"
    let referent = resolver.resolve(make_path(["y"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: external_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![c_idx, external_idx]
        })
    );
}

#[test]
fn dont_search_parent_and_resolve_with_ambiguous_sibling() {
    // Note: `<_externalContent>` is tagged with `DontSearchParent`
    let dast_root = dast_root_no_position(
        r#"
        <a name="x">
            <_externalContent name="y">
                <c name="z" />
            </_externalContent>
            <e name="y" />
        </a>
        <b name="q" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    println!("{:#?}", flat_root);
    let c_idx = find(&flat_root, "c").unwrap();
    let external_idx = find(&flat_root, "_externalContent").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);

    // Starting at `c`, one can still find its parent with "y" despite its sibling also named "y"
    let referent = resolver.resolve(make_path(["y"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: external_idx,
            unresolved_path: None,
            original_path: make_path(["y"], None),
            nodes_in_resolved_path: vec![c_idx, external_idx]
        })
    );
}
