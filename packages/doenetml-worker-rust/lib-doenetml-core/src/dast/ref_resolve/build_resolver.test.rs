use super::*;
use crate::{
    dast::{
        flat_dast::FlatRoot,
        ref_resolve::{RefResolution, ResolutionError, test_helpers::*},
    },
    test_utils::*,
};

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
    let referent = resolver.resolve(make_path(["z"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["w"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Prefacing the added components with the fragment parent `y` allows them to be found as `y.z` and `y.w`.
    let referent = resolver.resolve(make_path(["y", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx, c_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "w"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["y", "w"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx, g_idx]
        })
    );

    // Starting at newly added nodes, one can still search outward to find `y` and `q`
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
    let referent = resolver.resolve(make_path(["q"], None), g_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: f_idx,
            unresolved_path: None,
            original_path: make_path(["q"], None),
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
    let referent = resolver.resolve(make_path(["x", "y"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: None,
            original_path: make_path(["x", "y"], None),
            nodes_in_resolved_path: vec![d_idx, a_idx, b_idx]
        })
    );

    // searching for `x.z` does find the added component `e`
    let referent = resolver.resolve(make_path(["x", "z"], None), d_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: e_idx,
            unresolved_path: None,
            original_path: make_path(["x", "z"], None),
            nodes_in_resolved_path: vec![d_idx, a_idx, e_idx]
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
    let referent = resolver.resolve(make_path(["z"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
    let referent = resolver.resolve(make_path(["w"], None), a_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    // Starting at `z`, one can find `w`
    let referent = resolver.resolve(make_path(["w"], None), c_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["w"], None),
            nodes_in_resolved_path: vec![c_idx, g_idx]
        })
    );

    // Starting at newly added nodes, one cannot search outward to find `y` or `q`
    let referent = resolver.resolve(make_path(["y"], None), c_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));

    let referent = resolver.resolve(make_path(["q"], None), g_idx, false);
    assert_eq!(referent, Err(ResolutionError::NoReferent));
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
    let referent = resolver.resolve(make_path(["y", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx, c_idx]
        })
    );

    let referent = resolver.resolve(make_path(["y", "w"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: g_idx,
            unresolved_path: None,
            original_path: make_path(["y", "w"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx, g_idx]
        })
    );

    resolver.delete_nodes(&flat_fragment.nodes[1..]);

    let referent = resolver.resolve(make_path(["y", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: c_idx,
            unresolved_path: None,
            original_path: make_path(["y", "z"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx, c_idx]
        })
    );

    let referent = resolver.resolve(make_path(["y", "w"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["w"], None)),
            original_path: make_path(["y", "w"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );

    resolver.delete_nodes(&flat_fragment.nodes[0..1]);

    // when the nodes are removed, then `y.z` and `y.w` stop at `y`
    let referent = resolver.resolve(make_path(["y", "z"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["z"], None)),
            original_path: make_path(["y", "z"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );
    let referent = resolver.resolve(make_path(["y", "w"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["w"], None)),
            original_path: make_path(["y", "w"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );
}
