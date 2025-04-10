use super::*;

#[test]
fn test_store_state_props_and_retrieve_them() {
    let cache = StateCache::new();

    let idx = cache.add_state(PropValue::Integer(47), true);

    let state_node = GraphNode::State(idx);
    let query_node = GraphNode::Query(0);

    let val = cache.get_state(state_node, query_node);

    assert_eq!(val.value, PropValue::Integer(47));
    assert_eq!(val.changed, true);
}

#[test]
fn test_state_props_can_detect_changes() {
    let cache = StateCache::new();

    let idx = cache.add_state(PropValue::Integer(47), true);

    let state_node = GraphNode::State(idx);
    let query_node1 = GraphNode::Query(0);
    let query_node2 = GraphNode::Query(1);

    // first query is changed
    let val = cache.get_state(state_node, query_node1);
    assert_eq!(val.value, PropValue::Integer(47));
    assert_eq!(val.changed, true);

    // repeat from same query is unchanged
    let val = cache.get_state(state_node, query_node1);
    assert_eq!(val.value, PropValue::Integer(47));
    assert_eq!(val.changed, false);

    // from different query is changed
    let val = cache.get_state(state_node, query_node2);
    assert_eq!(val.value, PropValue::Integer(47));
    assert_eq!(val.changed, true);

    // repeat from same query is unchanged
    let val = cache.get_state(state_node, query_node2);
    assert_eq!(val.value, PropValue::Integer(47));
    assert_eq!(val.changed, false);

    // change value
    cache.set_state(state_node, PropValue::Integer(48));

    let val = cache.get_state(state_node, query_node1);
    assert_eq!(val.value, PropValue::Integer(48));
    assert_eq!(val.changed, true);
}

#[test]
fn test_state_props_came_from_default_becomes_false() {
    let cache = StateCache::new();

    let idx = cache.add_state(PropValue::Integer(0), true);

    let state_node = GraphNode::State(idx);
    let query_node = GraphNode::Query(0);

    // first query is changed
    let val = cache.get_state(state_node, query_node);
    assert_eq!(val.value, PropValue::Integer(0));
    assert_eq!(val.came_from_default, true);

    // repeat, should still from default
    let val = cache.get_state(state_node, query_node);
    assert_eq!(val.value, PropValue::Integer(0));
    assert_eq!(val.came_from_default, true);

    // setting value, even to same value, changes came from default to false
    cache.set_state(state_node, PropValue::Integer(0));

    let val = cache.get_state(state_node, query_node);
    assert_eq!(val.value, PropValue::Integer(0));
    assert_eq!(val.came_from_default, false);
}
