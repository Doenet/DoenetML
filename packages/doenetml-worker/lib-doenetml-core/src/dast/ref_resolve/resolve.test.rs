use super::*;
use crate::{
    dast::{flat_dast::FlatRoot, ref_resolve::test_helpers::*},
    test_utils::*,
};

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
