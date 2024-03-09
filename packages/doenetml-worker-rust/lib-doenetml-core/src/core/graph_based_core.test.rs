use strum::VariantNames;

use crate::{
    components::{
        doenet::{p::PAttribute, text::TextAttribute, text_input::TextInputAttribute},
        ComponentNode,
    },
    dast::{flat_dast::FlatRoot, ref_expand::Expander},
    core::{graph_based_core::Core, graph_node::GraphNode},
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
    let text_node_children_virtual_node = core
        .structure_graph
        .get_component_children_virtual_node(text_node);
    let text_ref_children = core.structure_graph.get_component_children(text_ref_node);
    assert_eq!(text_ref_children, vec![text_node_children_virtual_node]);

    // text ref's attributes depends on text's corresponding attribute
    let text_attributes = core.structure_graph.get_component_attributes(text_node);
    let text_ref_attributes = core.structure_graph.get_component_attributes(text_ref_node);
    for (attr_idx, text_ref_attr) in text_ref_attributes.into_iter().enumerate() {
        assert_eq!(
            core.structure_graph.get_children(&text_ref_attr),
            vec![text_attributes[attr_idx]]
        );
    }

    // text ref's props depends on text's corresponding prop
    let text_props = core.structure_graph.get_component_props(text_node);
    let text_ref_props = core.structure_graph.get_component_props(text_ref_node);
    for (prop_idx, text_ref_prop) in text_ref_props.into_iter().enumerate() {
        assert_eq!(
            core.structure_graph.get_children(&text_ref_prop),
            vec![text_props[prop_idx]]
        );
    }
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

    // text ref's props don't have dependencies
    let text_ref_props = core.structure_graph.get_component_props(text_ref_node);
    for text_ref_prop in text_ref_props.into_iter() {
        assert_eq!(core.structure_graph.get_children(&text_ref_prop), vec![]);
    }
}

#[test]
fn extend_via_ref_prop() {
    let core = core_from_doenetml(r#"<textInput name="i"/>$i.value"#);

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

    // text ref's props don't have dependencies
    let text_ref_props = core.structure_graph.get_component_props(text_ref_node);
    for text_ref_prop in text_ref_props.into_iter() {
        assert_eq!(core.structure_graph.get_children(&text_ref_prop), vec![]);
    }
}

#[test]
fn extend_via_extend_attribute() {
    let core = core_from_doenetml(r#"<text name="t">hello</text><text extend="$t"> world</text>"#);

    let document_node = core.structure_graph.get_nodes()[0];

    let doc_children = core.structure_graph.get_component_children(document_node);

    let text1_node = GraphNode::Component(1);
    let text2_node = GraphNode::Component(2);
    assert_eq!(doc_children, vec![text1_node, text2_node]);

    let hello_node = GraphNode::String(0);
    let text1_children = core.structure_graph.get_component_children(text1_node);
    assert_eq!(text1_children, vec![hello_node]);

    // text2's children start with text1's virtual node of children
    let text1_node_children_virtual_node = core
        .structure_graph
        .get_component_children_virtual_node(text1_node);
    let world_node = GraphNode::String(1);
    let text2_children = core.structure_graph.get_component_children(text2_node);
    assert_eq!(
        text2_children,
        vec![text1_node_children_virtual_node, world_node]
    );

    // text2's attributes depends on text1's corresponding attribute
    let text1_attributes = core.structure_graph.get_component_attributes(text1_node);
    let text2_attributes = core.structure_graph.get_component_attributes(text2_node);
    for (attr_idx, text2_attr) in text2_attributes.into_iter().enumerate() {
        assert_eq!(
            core.structure_graph.get_children(&text2_attr),
            vec![text1_attributes[attr_idx]]
        );
    }

    // text2's props depends on text1's corresponding prop
    let text1_props = core.structure_graph.get_component_props(text1_node);
    let text2_props = core.structure_graph.get_component_props(text2_node);
    for (prop_idx, text2_prop) in text2_props.into_iter().enumerate() {
        assert_eq!(
            core.structure_graph.get_children(&text2_prop),
            vec![text1_props[prop_idx]]
        );
    }
}

#[test]
fn do_not_transmute_with_extend_attribute() {
    let core = core_from_doenetml(r#"<textInput name="i"/><textInput extend="$i"/>"#);

    assert_eq!(core.components[2].get_component_type(), "textInput");

    let text_input1_node = GraphNode::Component(1);
    let text_input2_node = GraphNode::Component(2);

    // text_input2's child is text_input1's virtual node of children
    let text_input1_node_children_virtual_node = core
        .structure_graph
        .get_component_children_virtual_node(text_input1_node);
    let text_input2_children = core
        .structure_graph
        .get_component_children(text_input2_node);
    assert_eq!(
        text_input2_children,
        vec![text_input1_node_children_virtual_node]
    );

    // text_input2's attributes depends on text_input1's corresponding attribute
    let text_input1_attributes = core
        .structure_graph
        .get_component_attributes(text_input1_node);
    let text_input2_attributes = core
        .structure_graph
        .get_component_attributes(text_input2_node);
    for (attr_idx, text_input2_attr) in text_input2_attributes.into_iter().enumerate() {
        assert_eq!(
            core.structure_graph.get_children(&text_input2_attr),
            vec![text_input1_attributes[attr_idx]]
        );
    }

    // text_input2's props depends on text_input1's corresponding prop
    let text_input1_props = core.structure_graph.get_component_props(text_input1_node);
    let text_input2_props = core.structure_graph.get_component_props(text_input2_node);
    for (prop_idx, text_input2_prop) in text_input2_props.into_iter().enumerate() {
        assert_eq!(
            core.structure_graph.get_children(&text_input2_prop),
            vec![text_input1_props[prop_idx]]
        );
    }
}

#[test]
fn extend_attribute_with_default_prop() {
    let core = core_from_doenetml(
        r#"<textInput name="i">hello</textInput><text extend="$i"> world</text>"#,
    );

    let document_node = core.structure_graph.get_nodes()[0];

    let doc_children = core.structure_graph.get_component_children(document_node);

    let text_input_node = GraphNode::Component(1);
    let text_node = GraphNode::Component(2);
    assert_eq!(doc_children, vec![text_input_node, text_node]);

    // text's children begin with implicit text child
    let implicit_text_node = GraphNode::Component(3);
    let world_node = GraphNode::String(1);
    let text_input_node_prop_virtual_node = core
        .structure_graph
        .get_nth_child(&text_input_node, 2)
        .unwrap();
    let text_children = core.structure_graph.get_component_children(text_node);
    assert_eq!(text_children, vec![implicit_text_node, world_node]);

    // implicit text's children is textInput's value prop
    let text_input_value_prop = core
        .structure_graph
        .get_nth_child(&text_input_node_prop_virtual_node, 0)
        .unwrap();
    let implicit_text_children = core
        .structure_graph
        .get_component_children(implicit_text_node);
    assert_eq!(implicit_text_children, vec![text_input_value_prop]);

    // text and implicit text's hide attribute depends on textInput's hide attribute
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
    let text_hide_attribute_virtual_node =
        core.structure_graph.get_component_attributes(text_node)[text_hide_idx];
    let implicit_text_hide_attribute_virtual_node = core
        .structure_graph
        .get_component_attributes(implicit_text_node)[text_hide_idx];
    assert_eq!(
        core.structure_graph
            .get_children(&text_hide_attribute_virtual_node),
        vec![text_input_hide_attribute_virtual_node]
    );
    assert_eq!(
        core.structure_graph
            .get_children(&implicit_text_hide_attribute_virtual_node),
        vec![text_input_hide_attribute_virtual_node]
    );

    // text and implicit texts's props don't have dependencies
    let text_props = core.structure_graph.get_component_props(text_node);
    let implicit_text_props = core.structure_graph.get_component_props(implicit_text_node);
    for text_prop in text_props.into_iter() {
        assert_eq!(core.structure_graph.get_children(&text_prop), vec![]);
    }
    for implicit_text_prop in implicit_text_props.into_iter() {
        assert_eq!(
            core.structure_graph.get_children(&implicit_text_prop),
            vec![]
        );
    }
}

#[test]
fn extend_attribute_with_explicit_prop() {
    let core = core_from_doenetml(
        r#"<textInput name="i">hello</textInput><text extend="$i.value"> world</text>"#,
    );

    let document_node = core.structure_graph.get_nodes()[0];

    let doc_children = core.structure_graph.get_component_children(document_node);

    let text_input_node = GraphNode::Component(1);
    let text_node = GraphNode::Component(2);
    assert_eq!(doc_children, vec![text_input_node, text_node]);

    // text's children begin with implicit text child
    let implicit_text_node = GraphNode::Component(3);
    let world_node = GraphNode::String(1);
    let text_input_node_prop_virtual_node = core
        .structure_graph
        .get_nth_child(&text_input_node, 2)
        .unwrap();
    let text_children = core.structure_graph.get_component_children(text_node);
    assert_eq!(text_children, vec![implicit_text_node, world_node]);

    // implicit text's children is textInput's value prop
    let text_input_value_prop = core
        .structure_graph
        .get_nth_child(&text_input_node_prop_virtual_node, 0)
        .unwrap();
    let implicit_text_children = core
        .structure_graph
        .get_component_children(implicit_text_node);
    assert_eq!(implicit_text_children, vec![text_input_value_prop]);

    // text and implicit text's hide attribute depends on textInput's hide attribute
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
    let text_hide_attribute_virtual_node =
        core.structure_graph.get_component_attributes(text_node)[text_hide_idx];
    let implicit_text_hide_attribute_virtual_node = core
        .structure_graph
        .get_component_attributes(implicit_text_node)[text_hide_idx];
    assert_eq!(
        core.structure_graph
            .get_children(&text_hide_attribute_virtual_node),
        vec![text_input_hide_attribute_virtual_node]
    );
    assert_eq!(
        core.structure_graph
            .get_children(&implicit_text_hide_attribute_virtual_node),
        vec![text_input_hide_attribute_virtual_node]
    );

    // text and implicit texts's props don't have dependencies
    let text_props = core.structure_graph.get_component_props(text_node);
    let implicit_text_props = core.structure_graph.get_component_props(implicit_text_node);
    for text_prop in text_props.into_iter() {
        assert_eq!(core.structure_graph.get_children(&text_prop), vec![]);
    }
    for implicit_text_prop in implicit_text_props.into_iter() {
        assert_eq!(
            core.structure_graph.get_children(&implicit_text_prop),
            vec![]
        );
    }
}

#[test]
fn extend_attribute_without_default_prop() {
    let core = core_from_doenetml(r#"<p name="p">hello</p><text extend="$p"> world</text>"#);

    let document_node = core.structure_graph.get_nodes()[0];
    let doc_children = core.structure_graph.get_component_children(document_node);

    let p_node = GraphNode::Component(1);
    let text_node = GraphNode::Component(2);
    assert_eq!(doc_children, vec![p_node, text_node]);

    // text's children begin with p's virtual node of children
    let p_node_children_virtual_node = core
        .structure_graph
        .get_component_children_virtual_node(p_node);
    let world_node = GraphNode::String(1);
    let text_children = core.structure_graph.get_component_children(text_node);
    assert_eq!(
        text_children,
        vec![p_node_children_virtual_node, world_node]
    );

    // text's hide attribute depends on p's hide attribute
    let text_hide_idx = TextAttribute::VARIANTS
        .into_iter()
        .position(|a| *a == "hide")
        .unwrap();
    let p_hide_idx = PAttribute::VARIANTS
        .into_iter()
        .position(|a| *a == "hide")
        .unwrap();

    let p_hide_attribute_virtual_node =
        core.structure_graph.get_component_attributes(p_node)[p_hide_idx];
    let text_hide_attribute_virtual_node =
        core.structure_graph.get_component_attributes(text_node)[text_hide_idx];
    assert_eq!(
        core.structure_graph
            .get_children(&text_hide_attribute_virtual_node),
        vec![p_hide_attribute_virtual_node]
    );

    // texts's props don't have dependencies
    let text_props = core.structure_graph.get_component_props(text_node);
    for text_prop in text_props.into_iter() {
        assert_eq!(core.structure_graph.get_children(&text_prop), vec![]);
    }
}

mod test_helpers {
    use super::*;

    pub fn core_from_doenetml(doenetml: &str) -> Core {
        let dast_root = dast_root_no_position(doenetml);

        let mut core = Core::new();
        core.init_from_dast_root(&dast_root);
        core
    }
}
