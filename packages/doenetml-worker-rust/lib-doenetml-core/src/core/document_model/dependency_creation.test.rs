use crate::{
    Core,
    components::{
        doenet::text::TextProps,
        types::{LocalPropIdx, PropPointer},
    },
    graph_node::GraphNode,
    props::{DataQuery, PropProfile, PropSource, PropSpecifier},
    test_utils::*,
};

const TEXT_VALUE_LOCAL_IDX: LocalPropIdx = TextProps::Value.local_idx();
const TEXT_TEXT_LOCAL_IDX: LocalPropIdx = TextProps::Text.local_idx();

#[test]
fn test_adding_sate_data_query() {
    // <document>: idx 0
    //  <text name="t">: idx 1
    //  <text>: idx 2
    let dast_root =
        dast_root_no_position(r#"<text name="t">Hello</text><text extend="$t"> World</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 2.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });

    let _ = core
        .document_model
        .add_data_query(prop_node, DataQuery::State);

    // Only one data query and one piece of state has been created.
    // The query should point to the state.
    assert_eq!(
        core.document_model
            .get_dependency_graph()
            // GraphNode::Query(0) is always created as a DataQuery:Null, so the first
            // created query actually has index 1.
            .get_children(GraphNode::Query(1)),
        vec![GraphNode::State(0)]
    );
}

#[test]
fn test_adding_sate_data_query_with_extending() {
    // <document>: idx 0
    //  <text name="t">: idx 1
    //  <text>: idx 2
    let dast_root =
        dast_root_no_position(r#"<text name="t">Hello</text><text extend="$t"> World</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 2.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });
    let _ = core
        .document_model
        .add_data_query(prop_node, DataQuery::State);

    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 1.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });
    let _ = core
        .document_model
        .add_data_query(prop_node, DataQuery::State);

    // The two queries should point to the same state.
    assert_eq!(
        core.document_model
            .get_dependency_graph()
            .get_children(GraphNode::Query(1)),
        vec![GraphNode::State(0)]
    );
    assert_eq!(
        core.document_model
            .get_dependency_graph()
            .get_children(GraphNode::Query(2)),
        vec![GraphNode::State(0)]
    );
}

#[test]
fn test_adding_prop_data_query() {
    // <document>: idx 0
    //  <text name="t">: idx 1
    //  <text>: idx 2
    let dast_root = dast_root_no_position(
        r#"<text name="t" hide="true">Hello</text><text extend="$t" hide="$h.value"> World</text><text name="h">.</text>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let value_prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 2.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });
    // The arrow is going the wrong way. We're doing this for fun.
    let _ = core.document_model.add_data_query(
        value_prop_node,
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: TEXT_TEXT_LOCAL_IDX.into(),
        },
    );

    // We should have our prop and the prop from the corresponding extending source.
    let text_prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 2.into(),
        local_prop_idx: TEXT_TEXT_LOCAL_IDX,
    });
    assert_eq!(
        core.document_model
            .get_dependency_graph()
            .descendants_topological_multiroot(&[GraphNode::Query(1)])
            .collect::<Vec<_>>(),
        vec![&GraphNode::Query(1), &text_prop_node]
    );

    // Add a state data query to the same prop. The state should appear in the dependency graph.
    let _ = core
        .document_model
        .add_data_query(text_prop_node, DataQuery::State);

    // We should now have the new state at the end of the graph.
    assert_eq!(
        core.document_model
            .get_dependency_graph()
            .descendants_topological_multiroot(&[GraphNode::Query(1)])
            .collect::<Vec<_>>(),
        vec![
            &GraphNode::Query(1),
            &text_prop_node,
            // The new query we created.
            &GraphNode::Query(2),
            // The first piece of state. We just created this.
            &GraphNode::State(0)
        ]
    );
}

#[test]
fn test_attribute_data_query() {
    let dast_root = dast_root_no_position(
        r#"<text name="t1" hide="$t2.value rue">Hello</text><text name="t2">T</text>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 1.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });
    let _ = core.document_model.add_data_query(
        prop_node,
        DataQuery::Attribute {
            attribute_name: "hide",
            match_profiles: vec![PropProfile::String],
        },
    );

    let t2_value_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 2.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });

    // Get the second child of the "hide" attribute. That should be the string node
    // we're concerned about.
    let structure = core.document_model.document_structure.borrow();
    let hide_attribute = structure.get_attr_node(1.into(), "hide").unwrap();
    let hide_second_child = structure
        .get_attribute_content_children(hide_attribute)
        .collect::<Vec<_>>()[1];

    assert_eq!(
        core.document_model
            .get_dependency_graph()
            .descendants_topological_multiroot(&[GraphNode::Query(1)])
            .collect::<Vec<_>>(),
        vec![&GraphNode::Query(1), &t2_value_node, &hide_second_child]
    );
}

#[test]
fn test_parent_prop_data_query() {
    let dast_root = dast_root_no_position(r#"<text>Hi <text>there</text> you</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 2.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });

    let _ = core.document_model.add_data_query(
        prop_node,
        DataQuery::Prop {
            source: PropSource::Parent,
            prop_specifier: PropSpecifier::Matching(vec![PropProfile::String]),
        },
    );
    let value_prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx: 1.into(),
        local_prop_idx: TEXT_VALUE_LOCAL_IDX,
    });

    // Only one data query and one piece of state has been created.
    // The query should point to the state.
    assert_eq!(
        core.document_model
            .get_dependency_graph()
            // GraphNode::Query(0) is always created as a DataQuery:Null, so the first
            // created query actually has index 1.
            .get_children(GraphNode::Query(1)),
        vec![value_prop_node]
    );

    //    println!("{}", core.to_mermaid_dependency_graph());
    //    println!("{}", core.to_mermaid_structure_graph());
}
