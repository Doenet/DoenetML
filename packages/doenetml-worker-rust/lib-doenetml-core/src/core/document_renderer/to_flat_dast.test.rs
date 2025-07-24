use std::rc::Rc;

use crate::{
    Core,
    components::{
        ComponentNode,
        prelude::FlatDastElementContent,
        types::{ComponentIdx, StringIdx},
    },
    graph::directed_graph::Taggable,
    graph_node::GraphNode,
    props::PropValue,
    state::types::content_refs::ContentRef,
    test_utils::dast_root_no_position,
};

#[test]
fn test_can_make_flat_dast_for_component() {
    let dast_root = dast_root_no_position(r#"<document bar="baz">hi<foo /></document>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    //let flat_dast = core.component_to_flat_dast2(&core.components[0]);
    let flat_dast = core
        .document_renderer
        .component_to_flat_dast(0.into(), &core.document_model);
    dbg!(flat_dast);
}

#[test]
fn test_content_ref_prop_values_get_serialized_correctly() {
    let dast_root = dast_root_no_position(r#"hi"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let refs = PropValue::ContentRefs(Rc::new(
        vec![
            ContentRef::String(StringIdx::new(0)),
            ComponentIdx::new(2).into(),
        ]
        .into(),
    ));
    let prepared =
        core.document_renderer
            .prepare_prop_value_for_render("foo", refs, &core.document_model);
    assert_eq!(
        serde_json::to_string(&prepared.value).unwrap(),
        r#"["hi",{"id":2,"annotation":"original"}]"#
    );
}

/// Some components have a `for_render` prop that stores references to other components (which may have
/// been removed from the children of the component). These references should be marked as in the render tree,
/// since they may be accessed by the frontend JS.
#[test]
fn test_components_referenced_in_for_render_props_are_marked_as_in_render_tree() {
    let dast_root = dast_root_no_position(r#"<section><title /></section>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    core.to_flat_dast();

    let title_idx = ComponentIdx::from(2);
    let title_node = GraphNode::Component(title_idx.as_usize());
    assert_eq!(
        core.document_model
            .get_component(title_idx)
            .get_component_type(),
        "title"
    );

    // title component should be in render tree
    assert_eq!(
        core.document_renderer
            .in_render_tree
            .get_tag(&title_node)
            .cloned(),
        Some(true)
    );
}

#[test]
fn test_extending_nodes_get_marked_as_duplicates() {
    let dast_root = dast_root_no_position(
        r#"<p name="p1"><text>foo</text></p><p name="p2" extend="$p1"><text>bar</text></p>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let flat_root = core.to_flat_dast();

    let p1_idx = ComponentIdx::from(1);
    let p2_idx = ComponentIdx::from(3);
    let p1 = &flat_root.elements[p1_idx.as_usize()];
    let p2 = &flat_root.elements[p2_idx.as_usize()];

    assert_eq!(p1.name, "p");
    assert_eq!(p2.name, "p");
    assert_eq!(
        &p1.children[0],
        &FlatDastElementContent::new_original_element(2)
    );
    // Because `p2` is extending `p1`, its children (that it gets from extending) should be marked as duplicates
    assert_eq!(
        &p2.children[0],
        &FlatDastElementContent::new_duplicate_element(2)
    );
    assert_eq!(
        &p2.children[1],
        &FlatDastElementContent::new_original_element(4)
    );
}
