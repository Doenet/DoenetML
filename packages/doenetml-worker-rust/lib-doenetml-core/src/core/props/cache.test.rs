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

#[test]
fn test_can_set_prop() {
    let cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let query_node = GraphNode::Query(0);

    // The status doesn't _have_ to be set to resolved to set the prop, but it's good practice.
    cache.set_prop_status(prop_node, PropStatus::Resolved);
    cache.set_prop(
        prop_node,
        PropCalcResult::Calculated(PropValue::Integer(10)),
    );
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(15))
    });

    assert_eq!(*val.value, PropValue::Integer(10));
}

#[test]
fn test_a_data_query_can_keep_track_of_changes_to_multiple_props() {
    let cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let prop_node2 = GraphNode::Prop(1);
    let query_node = GraphNode::Query(0);

    // Set the prop values multiple times to make sure they have different change counters.
    cache.set_prop_status(prop_node, PropStatus::Resolved);
    cache.set_prop(
        prop_node,
        PropCalcResult::Calculated(PropValue::Integer(10)),
    );
    cache.set_prop(
        prop_node,
        PropCalcResult::Calculated(PropValue::Integer(10)),
    );
    cache.set_prop(
        prop_node,
        PropCalcResult::Calculated(PropValue::Integer(10)),
    );

    cache.set_prop_status(prop_node2, PropStatus::Resolved);
    cache.set_prop(
        prop_node2,
        PropCalcResult::Calculated(PropValue::Integer(15)),
    );

    // Get the prop multiple times so that its `changed` status should be `false`
    let val2 = cache.get_prop(prop_node2, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    assert_eq!(val2.changed, true);
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    assert_eq!(val.changed, true);

    let val2 = cache.get_prop(prop_node2, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });

    assert_eq!(*val.value, PropValue::Integer(10));
    assert_eq!(*val2.value, PropValue::Integer(15));

    assert_eq!(val.changed, false);
    assert_eq!(val2.changed, false);
}

#[test]
fn test_can_get_unchecked_prop_if_already_computed() {
    let cache = PropCache::new();

    let prop_node = GraphNode::Prop(0);
    let query_node = GraphNode::Query(0);

    cache.set_prop_status(prop_node, PropStatus::Resolved);
    let val = cache.get_prop(prop_node, query_node, || {
        PropCalcResult::Calculated(PropValue::Integer(10))
    });
    let val2 = cache.get_prop_unchecked(prop_node, query_node);
    cache.set_prop(
        prop_node,
        PropCalcResult::Calculated(PropValue::Integer(15)),
    );
    // Both of these should have `changed == true` since there was no `get_prop` called since the value was set.
    let _val3 = cache.get_prop_unchecked(prop_node, query_node);
    let val3 = cache.get_prop_unchecked(prop_node, query_node);

    assert_eq!(*val.value, *val2.value);
    assert_eq!(val.changed, true);
    assert_eq!(val3.changed, true);
}
