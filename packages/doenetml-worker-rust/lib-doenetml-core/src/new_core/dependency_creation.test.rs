use crate::{
    components::{prelude::DataQuery, ComponentProfile},
    dast::{flat_dast::FlatRoot, ref_expand::Expander},
    new_core::{graph_based_core::Core, graph_node::GraphNode},
    state::PropPointer,
    test_utils::*,
};

#[test]
fn test_adding_sate_data_query() {
    // <document>: idx 0
    //  <text name="t">: idx 1
    //  <text>: idx 2
    let dast_root =
        dast_root_no_position(r#"<text name="t">Hello</text><text extend="$t"> World</text>"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    dbg!(&flat_root.to_xml());
    flat_root.compactify();
    let normalized_flat_root = flat_root.into_normalized_root();

    let mut core = Core::new();
    core.init_from_normalized_root(&normalized_flat_root);

    core.add_data_query(
        PropPointer {
            component_idx: 2,
            local_prop_idx: 0,
        },
        DataQuery::State,
    );

    // Only one data query and one piece of state has been created.
    // The query should point to the state.
    assert_eq!(
        core.dependency_graph.get_children(GraphNode::Query(0)),
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
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    dbg!(&flat_root.to_xml());
    flat_root.compactify();
    let normalized_flat_root = flat_root.into_normalized_root();

    let mut core = Core::new();
    core.init_from_normalized_root(&normalized_flat_root);

    core.add_data_query(
        PropPointer {
            component_idx: 2,
            local_prop_idx: 0,
        },
        DataQuery::State,
    );

    core.add_data_query(
        PropPointer {
            component_idx: 1,
            local_prop_idx: 0,
        },
        DataQuery::State,
    );

    // The two queries should point to the same state.
    assert_eq!(
        core.dependency_graph.get_children(GraphNode::Query(0)),
        vec![GraphNode::State(0)]
    );
    assert_eq!(
        core.dependency_graph.get_children(GraphNode::Query(1)),
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
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    dbg!(&flat_root.to_xml());
    flat_root.compactify();
    let normalized_flat_root = flat_root.into_normalized_root();

    let mut core = Core::new();
    core.init_from_normalized_root(&normalized_flat_root);

    core.add_data_query(
        PropPointer {
            component_idx: 2,
            local_prop_idx: 0,
        },
        DataQuery::Prop {
            component_idx: None,
            prop_idx: 1,
        },
    );

    // We should have our prop and the prop from the corresponding extending source.
    assert_eq!(
        core.dependency_graph
            .walk_descendants(GraphNode::Query(0))
            .collect::<Vec<_>>(),
        vec![&GraphNode::Prop(4)]
    );

    // Add a state data query to the same prop. The state should appear in the dependency graph.
    core.add_data_query(
        PropPointer {
            component_idx: 2,
            local_prop_idx: 1,
        },
        DataQuery::State,
    );

    // We should now have the new state at the end of the graph.
    assert_eq!(
        core.dependency_graph
            .walk_descendants(GraphNode::Query(0))
            .collect::<Vec<_>>(),
        vec![
            &GraphNode::Prop(4),
            &GraphNode::Query(1),
            &GraphNode::State(0)
        ]
    );
}

#[test]
fn test_attribute_data_query() {
    let dast_root = dast_root_no_position(
        r#"<text name="t1" hide="$t2.value rue">Hello</text><text name="t2">T</text>"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    dbg!(&flat_root.to_xml());
    flat_root.compactify();
    let normalized_flat_root = flat_root.into_normalized_root();

    let mut core = Core::new();
    core.init_from_normalized_root(&normalized_flat_root);

    core.add_data_query(
        PropPointer {
            component_idx: 1,
            local_prop_idx: 0,
        },
        DataQuery::Attribute {
            attribute_name: "hide",
            match_profiles: vec![ComponentProfile::String],
        },
    );
    assert_eq!(
        core.dependency_graph
            .walk_descendants(GraphNode::Query(0))
            .collect::<Vec<_>>(),
        vec![&GraphNode::Prop(6), &GraphNode::String(1)]
    );

    //    println!("{}", core.to_mermaid_dependency_graph());
    //    println!("{}", core.to_mermaid_structure_graph());
}
