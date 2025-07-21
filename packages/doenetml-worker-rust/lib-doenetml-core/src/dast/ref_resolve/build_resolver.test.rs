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

#[test]
fn add_and_delete_a_large_number_of_nodes_multiple_times() {
    // Note: this test should run in a fraction of a second.
    // Before PR #552 it took multiple seconds (about 70 times slower)
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
          <g name="u1">
             <h name="v1">
                <i name="w1" />
                <i name="w1" />
             </h>
          </g>
          <g name="u2">
             <h name="v2">
                <i name="w2" />
                <i name="w2" />
             </h>
          </g>
          <g name="u3">
             <h name="v3">
                <i name="w3" />
                <i name="w3" />
             </h>
          </g>
          <g name="u4">
             <h name="v4">
                <i name="w4" />
                <i name="w4" />
             </h>
          </g>
          <g name="u5">
             <h name="v5">
                <i name="w5" />
                <i name="w5" />
             </h>
          </g>
          <g name="u6">
             <h name="v6">
                <i name="w6" />
                <i name="w6" />
             </h>
          </g>
          <g name="u7">
             <h name="v7">
                <i name="w7" />
                <i name="w7" />
             </h>
          </g>
          <g name="u8">
             <h name="v8">
                <i name="w8" />
                <i name="w8" />
             </h>
          </g>
          <g name="u9">
             <h name="v9">
                <i name="w9" />
                <i name="w9" />
             </h>
          </g>
          <g name="u10">
             <h name="v10">
                <i name="w10" />
                <i name="w10" />
             </h>
          </g>
        </c>"#,
        f_idx + 1,
        Some(b_idx),
    );

    let h1_idx = f_idx + 3;

    let mut resolver = Resolver::from_flat_root(&flat_root);

    // Adding and deleting nodes multiple times
    for _i in 1..100 {
        resolver.add_nodes(&flat_fragment, IndexResolution::None);
        resolver.delete_nodes(&flat_fragment.nodes);
    }

    resolver.add_nodes(&flat_fragment, IndexResolution::None);

    // `y.v1` resolves to `h1`
    let referent = resolver.resolve(make_path(["y", "v1"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: h1_idx,
            unresolved_path: None,
            original_path: make_path(["y", "v1"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx, h1_idx]
        })
    );

    resolver.delete_nodes(&flat_fragment.nodes);

    // when the nodes are removed, then `y.v1` stops at `y`
    let referent = resolver.resolve(make_path(["y", "v1"], None), a_idx, false);
    assert_eq!(
        referent,
        Ok(RefResolution {
            node_idx: b_idx,
            unresolved_path: Some(make_path(["v1"], None)),
            original_path: make_path(["y", "v1"], None),
            nodes_in_resolved_path: vec![a_idx, b_idx]
        })
    );
}
