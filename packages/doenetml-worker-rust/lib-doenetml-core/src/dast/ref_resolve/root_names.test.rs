use super::*;
use crate::{
    dast::{
        flat_dast::{FlatAttribute, FlatRoot, Index, UntaggedContent},
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

/// Update `table` from `resolver`, checking that it then matches the root names calculated from scratch.
/// Returns whether the update extended the previous root names rather than recalculating them.
fn update_and_check(table: &mut FxHashMap<Index, String>, resolver: &mut Resolver) -> bool {
    apply_root_name_changes(table, resolver.update_root_names(false));
    assert_matches_calculated_root_names(table, resolver);
    resolver.root_name_cache.last_update_extended
}

#[test]
fn added_fragments_extend_root_names_without_recalculating() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x"/>
        <b />
        <e name="z" />
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    assert!(!update_and_check(&mut table, &mut resolver));

    // A fragment under `<a>` becomes its index resolutions, including a group with its own index resolutions
    let mut next_idx = flat_root.nodes.len();
    let flat_fragment = flat_fragment_from_str(
        r#"<c name="w"><d name="v" /></c><group name="g"><f /><h name="u" /></group>"#,
        next_idx,
        Some(a_idx),
    );
    let c_idx = next_idx;
    let f_idx = next_idx + 3;
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: a_idx },
    );

    // Before updating, add a fragment under a node of the first fragment
    let flat_fragment = flat_fragment_from_str(r#"<i name="t" />"#, next_idx, Some(c_idx));
    let i_idx = next_idx;
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(&flat_fragment, IndexResolution::None);

    // and one under `<b>`, which has no root name
    let flat_fragment = flat_fragment_from_str(r#"<j name="s" />"#, next_idx, Some(b_idx));
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(&flat_fragment, IndexResolution::None);

    assert!(update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&f_idx), Some(&"x.g:1".to_string()));
    assert_eq!(table.get(&i_idx), Some(&"x.w.t".to_string()));

    // Appending to the index resolutions of `<a>` shifts nothing
    let flat_fragment = flat_fragment_from_str(r#"<k />"#, next_idx, Some(a_idx));
    let k_idx = next_idx;
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: a_idx,
            range: 2..2,
        },
    );
    assert!(update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&k_idx), Some(&"x:3".to_string()));

    // Inserting before them shifts `<c>`, `<group>` and `<k>`, so the root names are recalculated
    let flat_fragment = flat_fragment_from_str(r#"<l />"#, next_idx, Some(a_idx));
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: a_idx,
            range: 0..0,
        },
    );
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&k_idx), Some(&"x:4".to_string()));
}

#[test]
fn changes_that_can_alter_existing_root_names_recalculate_them() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x"><b name="y" /></a>
        <c name="y" />
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    update_and_check(&mut table, &mut resolver);

    // Re-adding a node that already has a root name
    let flat_fragment = flat_fragment_from_str(r#"<b name="y" />"#, b_idx, Some(a_idx));
    resolver.add_nodes(&flat_fragment, IndexResolution::None);
    assert!(!update_and_check(&mut table, &mut resolver));

    // Pointing an index resolution at an existing node
    resolver.replace_index_resolutions(
        &[UntaggedContent::Ref(c_idx)],
        IndexResolution::ReplaceAll { parent: a_idx },
    );
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&c_idx), Some(&"x:1".to_string()));

    // Deleting a node
    resolver.delete_nodes(&[flat_root.nodes[b_idx].clone()]);
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&c_idx), Some(&"y".to_string()));
}

#[test]
fn extending_root_names_through_a_cycle() {
    let dast_root = dast_root_no_position(r#"<group name="a"><group name="b" /></group>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let b_idx = find(&flat_root, "group").unwrap() + 1;

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    update_and_check(&mut table, &mut resolver);

    // `<group name="b">` gains a child referring back to `a`
    let flat_fragment = flat_fragment_from_str(
        r#"<group name="c"><group name="a" /></group>"#,
        flat_root.nodes.len(),
        Some(b_idx),
    );
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: b_idx },
    );
    assert!(update_and_check(&mut table, &mut resolver));
}

#[test]
fn fragments_reachable_through_two_parents() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x" />
        <b name="y" />
        <c />
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    update_and_check(&mut table, &mut resolver);

    // The fragment is under `<a>`, with its children the index resolutions of `<b>`,
    // so it can be reached from either one: the root names are recalculated.
    let mut next_idx = flat_root.nodes.len();
    let flat_fragment = flat_fragment_from_str(r#"<d name="w" />"#, next_idx, Some(a_idx));
    let d_idx = next_idx;
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: b_idx },
    );
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&d_idx), Some(&"x.w".to_string()));

    // Under `<c>`, which has no root name, the fragment can be reached only through `<b>`
    let flat_fragment = flat_fragment_from_str(r#"<e name="v" />"#, next_idx, Some(c_idx));
    let e_idx = next_idx;
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: b_idx,
            range: 1..1,
        },
    );
    assert!(update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&e_idx), Some(&"y:2".to_string()));

    // Before an update, a fragment reachable only through `<a>` and then one reachable through two parents:
    // the recalculation still reports the root names of the first fragment
    next_idx += flat_fragment.nodes.len();
    let flat_fragment = flat_fragment_from_str(r#"<f name="t" />"#, next_idx, Some(a_idx));
    let f_idx = next_idx;
    next_idx += flat_fragment.nodes.len();
    resolver.add_nodes(&flat_fragment, IndexResolution::None);
    let flat_fragment = flat_fragment_from_str(r#"<h name="s" />"#, next_idx, Some(a_idx));
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceRange {
            parent: b_idx,
            range: 2..2,
        },
    );
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&f_idx), Some(&"x.t".to_string()));
}

#[test]
fn re_adding_a_node_that_still_has_edges_recalculates_root_names() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x" />
        <b />
        <group name="g"><group><group><c /></group></group></group>
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();

    // `<b>`, which has no root name, is given `<c>` as an index resolution
    resolver.replace_index_resolutions(
        &[UntaggedContent::Ref(c_idx)],
        IndexResolution::ReplaceAll { parent: b_idx },
    );
    update_and_check(&mut table, &mut resolver);
    assert_eq!(table.get(&b_idx), None);
    assert_eq!(table.get(&c_idx), Some(&"g:1:1:1".to_string()));

    // Re-adding `<b>` under `<a>` gives `<c>` a shorter path through the index resolution `<b>` kept,
    // so the root names are recalculated
    let flat_fragment = flat_fragment_from_str(r#"<b />"#, b_idx, Some(a_idx));
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: a_idx },
    );
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&c_idx), Some(&"x:1:1".to_string()));
}

#[test]
fn index_resolutions_to_nodes_outside_the_fragment_recalculate_root_names() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x" />
        <group name="g"><group><group><c /></group></group></group>
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    update_and_check(&mut table, &mut resolver);
    assert_eq!(table.get(&c_idx), Some(&"g:1:1:1".to_string()));

    // The fragment's children, which become the index resolutions of `<a>`, include the existing `<c>`,
    // giving `<c>` a shorter path, so the root names are recalculated
    let mut flat_fragment = flat_fragment_from_str(r#"<b />"#, flat_root.nodes.len(), Some(a_idx));
    flat_fragment.children.push(UntaggedContent::Ref(c_idx));
    resolver.add_nodes(
        &flat_fragment,
        IndexResolution::ReplaceAll { parent: a_idx },
    );
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&c_idx), Some(&"x:2".to_string()));

    // The same holds for the children of a group in the fragment, which become the group's index resolutions
    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    update_and_check(&mut table, &mut resolver);
    let mut flat_fragment =
        flat_fragment_from_str(r#"<group name="h" />"#, flat_root.nodes.len(), Some(a_idx));
    let FlatNode::Element(group) = &mut flat_fragment.nodes[0] else {
        unreachable!()
    };
    group.children.push(UntaggedContent::Ref(c_idx));
    resolver.add_nodes(&flat_fragment, IndexResolution::None);
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&c_idx), Some(&"x.h:1".to_string()));
}

#[test]
fn a_new_source_sequence_on_the_parent_recalculates_root_names() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x">
            <c name="v"><group name="g"><b name="w" /></group></c>
            <d name="u"><group name="g" /></d>
        </a>
    </document>"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let b_idx = find(&flat_root, "b").unwrap();

    // `<b>` comes from an external document, so `<a>` can't follow its name `w` without a source sequence
    let FlatNode::Element(b) = &mut flat_root.nodes[b_idx] else {
        unreachable!()
    };
    b.source_doc = Some(1.into());

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    update_and_check(&mut table, &mut resolver);
    assert_eq!(table.get(&b_idx), Some(&"v.g:1".to_string()));

    // A fragment that gives `<a>` a source sequence lets `<a>` follow `w`, giving `<b>` a shorter path,
    // so the root names are recalculated
    let mut flat_fragment = flat_fragment_from_str(r#"<e />"#, flat_root.nodes.len(), Some(a_idx));
    flat_fragment.parent_source_sequence = Some(FlatAttribute {
        name: "source:sequence".to_string(),
        parent: Some(a_idx),
        children: vec![
            UntaggedContent::Text("0".to_string()),
            UntaggedContent::Text("1".to_string()),
        ],
        position: None,
        source_doc: None,
    });
    resolver.add_nodes(&flat_fragment, IndexResolution::None);
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&b_idx), Some(&"x.w".to_string()));
}

#[test]
fn re_adding_a_node_before_an_update_recalculates_root_names() {
    let dast_root = dast_root_no_position(
        r#"
    <document>
        <a name="x" />
        <b name="y"><c name="u" /></b>
        <d name="v"><c name="u" /></d>
    </document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    let a_idx = find(&flat_root, "a").unwrap();
    let c_idx = find(&flat_root, "c").unwrap();

    let mut resolver = Resolver::from_flat_root(&flat_root);
    let mut table = FxHashMap::default();
    update_and_check(&mut table, &mut resolver);
    assert_eq!(table.get(&c_idx), Some(&"y.u".to_string()));

    // `<e>` is added under `<c>`, then, before an update, added again under `<a>`,
    // which is closer to the root, so the root names are recalculated
    let e_idx = flat_root.nodes.len();
    let flat_fragment = flat_fragment_from_str(r#"<e name="t" />"#, e_idx, Some(c_idx));
    resolver.add_nodes(&flat_fragment, IndexResolution::None);
    let flat_fragment = flat_fragment_from_str(r#"<e name="t" />"#, e_idx, Some(a_idx));
    resolver.add_nodes(&flat_fragment, IndexResolution::None);
    assert!(!update_and_check(&mut table, &mut resolver));
    assert_eq!(table.get(&e_idx), Some(&"x.t".to_string()));
}
