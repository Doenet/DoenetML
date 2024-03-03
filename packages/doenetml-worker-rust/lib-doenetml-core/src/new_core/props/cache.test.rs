use super::*;

#[test]
fn test_can_cache_props_and_retrieve_them() {
    let mut cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let query_node = GraphNode::Query(0);

    cache.set_prop_status(prop_node, PropStatus::Resolved);
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::String("hello".to_string()))
    });
    assert_eq!(val.value.clone(), PropValue::String("hello".to_string()));
    assert_eq!(val.changed, true);
}

#[test]
fn test_can_cache_props_can_detect_changes() {
    let mut cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let query_node = GraphNode::Query(0);

    cache.set_prop_status(prop_node, PropStatus::Resolved);
    let _ = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::String("hello".to_string()))
    });
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::String("hello".to_string()))
    });

    assert_eq!(val.value.clone(), PropValue::String("hello".to_string()));
    assert_eq!(val.changed, false);
}
