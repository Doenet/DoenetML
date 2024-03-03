use super::*;

#[test]
fn test_can_cache_props_and_retrieve_them() {
    let cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let query_node = GraphNode::Query(0);

    cache.set_prop_status(prop_node, PropStatus::Resolved);
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    assert_eq!(*val.value, PropValue::Integer(10));
    assert_eq!(val.changed, true);
}

#[test]
fn test_can_get_status() {
    let cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let query_node = GraphNode::Query(0);

    cache.set_prop_status(prop_node, PropStatus::Resolved);
    let status = cache.get_prop_status(prop_node);
    assert_eq!(status, PropStatus::Resolved);
    let _val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    let status = cache.get_prop_status(prop_node);
    assert_eq!(status, PropStatus::Fresh);
}

#[test]
fn test_can_cache_props_can_detect_changes() {
    let cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let query_node = GraphNode::Query(0);

    cache.set_prop_status(prop_node, PropStatus::Resolved);
    cache.set_prop_status(prop_node, PropStatus::Resolved);
    let _val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });

    assert_eq!(*val.value, PropValue::Integer(10));
    assert_eq!(val.changed, false);
}

#[test]
fn test_can_query_for_prop_in_calculate_function() {
    let cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let prop_node2 = GraphNode::Prop(1);
    let query_node = GraphNode::Query(0);
    let query_node2 = GraphNode::Query(1);

    cache.set_prop_status(prop_node, PropStatus::Resolved);
    cache.set_prop_status(prop_node2, PropStatus::Resolved);
    let val = cache.get_prop(prop_node, query_node, || {
        let _x = cache.get_prop(prop_node2, query_node2, || {
            PropCalcResult::Calculated(PropValue::Integer(15))
        });
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    let val2 = cache.get_prop(prop_node2, query_node2, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });

    assert_eq!(*val.value, PropValue::Integer(10));

    assert_eq!(*val2.value, PropValue::Integer(15));
}
