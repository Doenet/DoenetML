use super::*;
use crate::{
    dast::{flat_dast::FlatRoot, ref_resolve::test_helpers::*},
    test_utils::*,
};

#[test]
fn find_shortest_unique_name() {
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
    let root_names = calculate_root_names(resolver);

    assert_eq!(root_names[doc_idx], None);
    assert_eq!(root_names[a_idx], Some("x".to_string()));
    assert_eq!(root_names[b_idx], Some("x.y".to_string()));
    assert_eq!(root_names[c_idx], Some("z".to_string()));
    assert_eq!(root_names[d_idx], Some("x.w".to_string()));
    assert_eq!(root_names[e_idx], None);
    assert_eq!(root_names[f_idx], None);
}

#[test]
fn with_index() {
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
        <e name="y"/>"#,
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
    let root_names = calculate_root_names(resolver);

    assert_eq!(root_names[doc_idx], None);
    assert_eq!(root_names[a_idx], Some("x".to_string()));
    assert_eq!(root_names[g1_idx], Some("x.y".to_string()));
    assert_eq!(root_names[b_idx], Some("z".to_string()));
    assert_eq!(root_names[c_idx], Some("x.y|2".to_string()));
    assert_eq!(root_names[g2_idx], Some("x.y|3".to_string()));
    assert_eq!(root_names[d_idx], Some("x.y|3|1".to_string()));
    assert_eq!(root_names[e_idx], None);
}
