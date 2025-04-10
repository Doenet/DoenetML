use super::*;

#[test]
fn test_store_string_props_and_retrieve_them() {
    let mut cache = StringCache::new();

    let idx = cache.add_string("hello!".to_string());

    let string_node = GraphNode::String(idx);
    let query_node = GraphNode::Query(0);

    let val = cache.get_string(string_node, query_node);

    assert_eq!(val.value, "hello!".into());
    assert_eq!(val.changed, true);
}

#[test]
fn test_string_props_can_detect_changes() {
    let mut cache = StringCache::new();

    let idx = cache.add_string("hello!".to_string());

    let string_node = GraphNode::String(idx);
    let query_node1 = GraphNode::Query(0);
    let query_node2 = GraphNode::Query(1);

    // first query is changed
    let val = cache.get_string(string_node, query_node1);
    assert_eq!(val.value, "hello!".into());
    assert_eq!(val.changed, true);

    // repeat from same query is unchanged
    let val = cache.get_string(string_node, query_node1);
    assert_eq!(val.value, "hello!".into());
    assert_eq!(val.changed, false);

    // from different query is changed
    let val = cache.get_string(string_node, query_node2);
    assert_eq!(val.value, "hello!".into());
    assert_eq!(val.changed, true);

    // repeat from same query is unchanged
    let val = cache.get_string(string_node, query_node2);
    assert_eq!(val.value, "hello!".into());
    assert_eq!(val.changed, false);

    // change value
    cache.set_string(string_node, "bye".to_string());

    let val = cache.get_string(string_node, query_node1);
    assert_eq!(val.value, "bye".into());
    assert_eq!(val.changed, true);
}

#[test]
fn test_string_props_came_from_default_is_always_false() {
    let mut cache = StringCache::new();

    let idx = cache.add_string("hello!".to_string());

    let string_node = GraphNode::String(idx);
    let query_node = GraphNode::Query(0);

    // first query is changed
    let val = cache.get_string(string_node, query_node);
    assert_eq!(val.value, "hello!".into());
    assert_eq!(val.came_from_default, false);
}

#[test]
fn test_get_string_value() {
    let mut cache = StringCache::new();

    let idx = cache.add_string("hello!".to_string());

    let string_node = GraphNode::String(idx);

    let val = cache.get_string_value(string_node);

    assert_eq!(val, "hello!");

    // verify that `get_string_value` did not update change tracker for Query(0)

    let query_node = GraphNode::Query(0);
    let val = cache.get_string(string_node, query_node);
    assert_eq!(val.value, "hello!".into());
    assert_eq!(val.changed, true);
}
