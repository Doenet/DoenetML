use strum::VariantNames;

use crate::{
    components::doenet::{text::TextAttribute, text_input::TextInputAttribute},
    dast::{flat_dast::FlatRoot, ref_expand::Expander},
    new_core::{graph_based_core::Core, graph_node::GraphNode},
    test_utils::*,
};

use test_helpers::*;

#[test]
fn blank_attribute_is_empty_string() {
    let core = core_from_doenetml(r#"<text hide />"#);

    let text_node = GraphNode::Component(1);

    let hide_idx = TextAttribute::VARIANTS
        .into_iter()
        .position(|a| *a == "hide")
        .unwrap();

    let hide_attr = core.structure_graph.get_component_attributes(text_node)[hide_idx];
    let hide_attr_children = core.structure_graph.get_children(&hide_attr);
    assert_eq!(hide_attr_children.len(), 1);
    if let GraphNode::String(string_idx) = hide_attr_children[0] {
        assert_eq!(core.strings[string_idx], "");
    } else {
        panic!("Expected hide attribute to be a string")
    }
}

#[test]
fn extend_via_ref() {
    let core = core_from_doenetml(r#"<text name="t">hello</text>$t"#);

    let document_node = core.structure_graph.get_nodes()[0];

    let doc_children = core.structure_graph.get_component_children(document_node);

    let text_node = GraphNode::Component(1);
    let text_ref_node = GraphNode::Component(2);
    assert_eq!(doc_children, vec![text_node, text_ref_node]);

    let hello_node = GraphNode::String(0);
    let text_children = core.structure_graph.get_component_children(text_node);
    assert_eq!(text_children, vec![hello_node]);

    // text ref's child is text's virtual node of children
    let text_node_children_virtual_node =
        core.structure_graph.get_nth_child(&text_node, 0).unwrap();
    let text_ref_children = core.structure_graph.get_component_children(text_ref_node);
    assert_eq!(text_ref_children, vec![text_node_children_virtual_node]);

    // text ref's first attribute depends on text's first attribute
    let text_first_attribute_virtual_node =
        core.structure_graph.get_component_attributes(text_node)[0];
    let text_ref_first_attribute_virtual_node =
        core.structure_graph.get_component_attributes(text_ref_node)[0];
    assert_eq!(
        core.structure_graph
            .get_children(&text_ref_first_attribute_virtual_node),
        vec![text_first_attribute_virtual_node]
    );
}

#[test]
fn extend_via_transmuted_ref() {
    let core = core_from_doenetml(r#"<textInput name="i"/>$i"#);

    let document_node = core.structure_graph.get_nodes()[0];

    let doc_children = core.structure_graph.get_component_children(document_node);

    let text_input_node = GraphNode::Component(1);
    let text_ref_node = GraphNode::Component(2);
    assert_eq!(doc_children, vec![text_input_node, text_ref_node]);

    // text ref's child is textInput's value prop

    let text_input_node_prop_virtual_node = core
        .structure_graph
        .get_nth_child(&text_input_node, 2)
        .unwrap();
    let text_input_value_prop = core
        .structure_graph
        .get_nth_child(&text_input_node_prop_virtual_node, 0)
        .unwrap();
    let text_ref_children = core.structure_graph.get_component_children(text_ref_node);
    assert_eq!(text_ref_children, vec![text_input_value_prop]);

    // text ref's hide attribute depends on textInput's hide attribute
    let text_hide_idx = TextAttribute::VARIANTS
        .into_iter()
        .position(|a| *a == "hide")
        .unwrap();
    let text_input_hide_idx = TextInputAttribute::VARIANTS
        .into_iter()
        .position(|a| *a == "hide")
        .unwrap();

    let text_input_hide_attribute_virtual_node = core
        .structure_graph
        .get_component_attributes(text_input_node)[text_input_hide_idx];
    let text_ref_hide_attribute_virtual_node =
        core.structure_graph.get_component_attributes(text_ref_node)[text_hide_idx];
    assert_eq!(
        core.structure_graph
            .get_children(&text_ref_hide_attribute_virtual_node),
        vec![text_input_hide_attribute_virtual_node]
    );
}

mod test_helpers {
    use super::*;

    pub fn core_from_doenetml(doenetml: &str) -> Core {
        let dast_root = dast_root_no_position(doenetml);
        let mut flat_root = FlatRoot::from_dast(&dast_root);
        Expander::expand(&mut flat_root);
        flat_root.compactify();
        let normalized_flat_root = flat_root.into_normalized_root();

        let mut core = Core::new();
        core.init_from_normalized_root(&normalized_flat_root);
        core
    }
}
