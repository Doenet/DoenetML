use super::*;
use crate::{
    dast::{
        flat_dast::{FlatRoot, Index},
        ref_resolve::{IndexResolution, test_helpers::*},
    },
    test_utils::*,
};
use rustc_hash::FxHashMap;

#[test]
fn find_simplest_unique_name() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x">
            <b name="y">
                <c name="z" />
                <d name="w" />
            </b>
        </a>
        <e name="y">
            <f name="w" />
        </e>
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let doc_idx = find(&flat_root, "document").unwrap();
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[doc_idx], None);
    assert_eq!(root_names[a_idx], Some("x".to_string()));
    assert_eq!(root_names[b_idx], Some("x.y".to_string()));
    assert_eq!(root_names[c_idx], Some("z".to_string()));
    assert_eq!(root_names[d_idx], Some("x.w".to_string()));
    assert_eq!(root_names[e_idx], None);
    assert_eq!(root_names[f_idx], None);
}

#[test]
fn find_simplest_names_with_index() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x">
            <group name="y">
                <b name="z" />
                <c />
                <group>
                    <d />
                </group>
            </group>
        </a>
        <e name="y"/>
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);

    let doc_idx = find(&flat_root, "document").unwrap();
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();

    let g1_idx = a_idx + 1;
    let g2_idx = c_idx + 1;

    let resolver = Resolver::from_flat_root(&flat_root);
    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[doc_idx], None);
    assert_eq!(root_names[a_idx], Some("x".to_string()));
    assert_eq!(root_names[g1_idx], Some("x.y".to_string()));
    assert_eq!(root_names[b_idx], Some("z".to_string()));
    assert_eq!(root_names[c_idx], Some("x.y:2".to_string()));
    assert_eq!(root_names[g2_idx], Some("x.y:3".to_string()));
    assert_eq!(root_names[d_idx], Some("x.y:3:1".to_string()));
    assert_eq!(root_names[e_idx], None);
}

#[test]
fn option_children_require_option_name() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x">
            <option name="y">
                <b name="z" />
                <c name="u">
                  <d name="v" />
                </c>
            </option>
        </a>
        <e name="z"/>
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);

    let doc_idx = find(&flat_root, "document").unwrap();
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();
    let o_idx = find(&flat_root, "option").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[doc_idx], None);
    assert_eq!(root_names[a_idx], Some("x".to_string()));
    assert_eq!(root_names[o_idx], Some("y".to_string()));
    assert_eq!(root_names[b_idx], Some("y.z".to_string()));
    assert_eq!(root_names[c_idx], Some("y.u".to_string()));
    assert_eq!(root_names[d_idx], Some("y.v".to_string()));
    assert_eq!(root_names[e_idx], Some("z".to_string()));
}

#[test]
fn fragments_added_require_parent_or_index() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x"/>
        <e name="z"/>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);

    let a_idx = find(&flat_root, "a").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();

    let flat_fragment = flat_fragment_from_str(
        r#"<b><c name="z" /></b><d name="y" />"#,
        e_idx + 1,
        Some(a_idx),
    );

    let b_idx = e_idx + 1;
    let c_idx = e_idx + 2;
    let d_idx = e_idx + 3;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: a_idx },
    );

    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[a_idx], Some("x".to_string()));
    assert_eq!(root_names[b_idx], Some("x:1".to_string()));
    assert_eq!(root_names[c_idx], Some("x.z".to_string()));
    assert_eq!(root_names[d_idx], Some("x.y".to_string()));
    assert_eq!(root_names[e_idx], Some("z".to_string()));
}

#[test]
fn sub_names_are_preferred_over_indices() {
    let dast_root = dast_root_no_position(r#"<a name="x"/>"#);

    let flat_root = FlatRoot::from_dast(&dast_root);

    let a_idx = find(&flat_root, "a").unwrap();

    let flat_fragment = flat_fragment_from_str(r#"<b name="long">"#, a_idx + 1, Some(a_idx));

    let b_idx = a_idx + 1;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: a_idx },
    );
    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[b_idx], Some("x.long".to_string()));
}

#[test]
fn ties_are_handled_consistently_even_as_document_changes() {
    // Note: the root name for `<d>` could equally well be `x.y`, `z.y` or `u.y`.
    // The chosen name is now `u.y`.
    // We test to make sure it stays `u.y` even if we modify the document by adding more nodes.
    let dast_root = dast_root_no_position(
        r#"
    <a name="x">
       <b name="z">
          <c name="u">
            <d name="y" />
          </c>
      </b>
    </a>
    <e name="y" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let d_idx = find(&flat_root, "d").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[d_idx], Some("x.y".to_string()));

    // similar document with addition of more nodes
    let dast_root = dast_root_no_position(
        r#"
    <f name="f"/>
    <a name="x">
       <g name="g"/>
       <b name="z">
          <c name="u">
            <i name="i"/>
            <h>
                <d name="y" />
            </h>
            <j name="j"/>
          </c>
          <k name="k"/>
      </b>
    </a>
    <l name="l"/>
    <e name="y" />
    <m name="m"/><n name="n" />"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let d_idx = find(&flat_root, "d").unwrap();

    let resolver = Resolver::from_flat_root(&flat_root);
    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[d_idx], Some("x.y".to_string()));
}

#[test]
fn elements_from_external_source_doc_require_parent() {
    let dast_root = dast_root_no_position(
        r#"
        <a name="x"/>
        <switchSource name="y">
            <b name="z">
                <c name="u" />
            </b>
            <d name="r" />
        </switchSource>
        "#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);

    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let s_idx = find(&flat_root, "switchSource").unwrap();

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

    let root_names = resolver.calculate_root_names();

    assert_eq!(root_names[a_idx], Some("x".to_string()));
    assert_eq!(root_names[b_idx], Some("y.z".to_string()));
    assert_eq!(root_names[c_idx], Some("y.u".to_string()));
    assert_eq!(root_names[d_idx], Some("y.r".to_string()));
    assert_eq!(root_names[s_idx], Some("y".to_string()));
}

/// Apply the changes returned by `update_root_names` to `table`,
/// mimicking how the JavaScript core patches its copy of the root names.
fn apply_root_name_changes(
    table: &mut FxHashMap<Index, String>,
    changes: Vec<(Index, Option<String>)>,
) {
    for (idx, name) in changes {
        match name {
            Some(name) => table.insert(idx, name),
            None => table.remove(&idx),
        };
    }
}

/// Assert that `table` matches the root names calculated from scratch by `resolver`.
fn assert_matches_calculated_root_names(table: &FxHashMap<Index, String>, resolver: &Resolver) {
    let expected: FxHashMap<Index, String> = resolver
        .calculate_root_names()
        .into_iter()
        .enumerate()
        .filter_map(|(idx, name)| name.map(|name| (idx, name)))
        .collect();
    assert_eq!(*table, expected);
}

#[test]
fn first_root_name_update_returns_every_root_name() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <e name="y" />
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);

    let mut changes = resolver.update_root_names(false);
    changes.sort();
    assert_eq!(
        changes,
        vec![
            (a_idx, Some("x".to_string())),
            (b_idx, Some("x.y".to_string())),
            (c_idx, Some("z".to_string())),
        ]
    );

    // Nothing changed, so there is nothing to report
    assert_eq!(resolver.update_root_names(false), vec![]);

    // unless every root name is requested
    let mut all_names = resolver.update_root_names(true);
    all_names.sort();
    assert_eq!(all_names, changes);
}

#[test]
fn root_name_updates_track_changes_to_resolver() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x"/>
        <group name="g">
            <b name="u" />
            <c />
            <d />
        </group>
        <e name="v" />
        <f name="v" />
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();
    let d_idx = find(&flat_root, "d").unwrap();
    let e_idx = find(&flat_root, "e").unwrap();
    let f_idx = find(&flat_root, "f").unwrap();
    let g_idx = find(&flat_root, "group").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();

    apply_root_name_changes(&mut table, resolver.update_root_names(false));
    assert_matches_calculated_root_names(&table, &resolver);
    assert_eq!(table.get(&c_idx), Some(&"g:2".to_string()));
    assert_eq!(table.get(&e_idx), None);

    // Add new nodes as index resolutions of `<a>`
    let flat_fragment = flat_fragment_from_str(
        r#"<h name="w"><i name="t" /></h><j />"#,
        flat_root.nodes.len(),
        Some(a_idx),
    );
    let h_idx = flat_root.nodes.len();
    let j_idx = flat_root.nodes.len() + 2;
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: a_idx },
    );

    let changes = resolver.update_root_names(false);
    assert_eq!(changes.len(), 3);
    apply_root_name_changes(&mut table, changes);
    assert_matches_calculated_root_names(&table, &resolver);
    assert_eq!(table.get(&h_idx), Some(&"x.w".to_string()));
    assert_eq!(table.get(&j_idx), Some(&"x:2".to_string()));

    // Insert new nodes at the start of the index resolutions of `<group>`,
    // shifting the indices of `<c>` and `<d>`
    let flat_fragment =
        flat_fragment_from_str(r#"<k /><l />"#, flat_root.nodes.len() + 3, Some(g_idx));
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: g_idx,
            range: 0..0,
        },
    );

    apply_root_name_changes(&mut table, resolver.update_root_names(false));
    assert_matches_calculated_root_names(&table, &resolver);
    assert_eq!(table.get(&c_idx), Some(&"g:4".to_string()));
    assert_eq!(table.get(&d_idx), Some(&"g:5".to_string()));

    // Remove `<d>` from the index resolutions of `<group>`, so that it loses its root name
    resolver.replace_index_resolutions(
        &[],
        IndexResolution::ReplaceRange {
            parent: g_idx,
            range: 4..5,
        },
    );

    let changes = resolver.update_root_names(false);
    assert_eq!(changes, vec![(d_idx, None)]);
    apply_root_name_changes(&mut table, changes);
    assert_matches_calculated_root_names(&table, &resolver);

    // Deleting `<f>` makes the name `v` unique, so `<e>` gains a root name
    resolver.delete_nodes(&[flat_root.nodes[f_idx].clone()]);

    let changes = resolver.update_root_names(false);
    assert_eq!(changes, vec![(e_idx, Some("v".to_string()))]);
    apply_root_name_changes(&mut table, changes);
    assert_matches_calculated_root_names(&table, &resolver);
}
