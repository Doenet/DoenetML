use std::rc::Rc;

use crate::{test_utils::*, Core};

use super::*;

#[test]
fn can_apply_test_on_an_op() {
    let op = Op::And(true, false);
    assert_eq!(op.apply_test(&true), false);

    let op = Op::And(true, true);
    assert_eq!(op.apply_test(&true), true);

    let op = Op::Or(true, false);
    assert_eq!(op.apply_test(&true), true);

    let op = Op::Or(OpNot(Op::And(true, false)), false);
    assert_eq!(op.apply_test(&true), true);
}

#[test]
fn can_apply_condition() {
    let filter = Cond::Eq(4);
    assert_eq!(filter.apply_test(&4), true);
    assert_eq!(filter.apply_test(&5), false);

    let filter = OpNot(Cond::Eq(4));
    assert_eq!(filter.apply_test(&4), false);
    assert_eq!(filter.apply_test(&5), true);
}

#[test]
fn can_filter_on_component_type() {
    let dast_root = dast_root_no_position(r#"<foo /><bar /><baz />"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;

    // Filter for single element
    let filter = ContentFilter::IsType("foo").bind(document_model);
    let filtered = (1..=3usize)
        .into_iter()
        .filter(|&idx| {
            let node = GraphNode::Component(idx.into());
            filter.apply_test(&node)
        })
        .collect::<Vec<_>>();
    assert_eq!(filtered, vec![1]);

    // Filter for multiple elements NOT
    let filter = OpNot(ContentFilter::IsType("foo")).bind(document_model);
    let filtered = (1..=3usize)
        .into_iter()
        .filter(|&idx| {
            let node = GraphNode::Component(idx.into());
            filter.apply_test(&node)
        })
        .collect::<Vec<_>>();
    assert_eq!(filtered, vec![2, 3]);

    // Filter for multiple elements OR
    let filter =
        Op::Or(ContentFilter::IsType("foo"), ContentFilter::IsType("baz")).bind(document_model);
    let filtered = (1..=3usize)
        .into_iter()
        .filter(|&idx| {
            let node = GraphNode::Component(idx.into());
            filter.apply_test(&node)
        })
        .collect::<Vec<_>>();
    assert_eq!(filtered, vec![1, 3]);
}

#[test]
fn can_filter_by_component_or_string() {
    let dast_root = dast_root_no_position(r#"<foo />hi<bar />there<baz />"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    // Filter for single element
    let filter = ContentFilter::IsComponent.bind(document_model);
    let filtered = content_children
        .iter()
        .cloned()
        .filter(|node| filter.apply_test(node))
        .collect::<Vec<_>>();
    assert_eq!(
        filtered,
        vec![
            GraphNode::Component(1),
            GraphNode::Component(2),
            GraphNode::Component(3)
        ]
    );

    let filter = ContentFilter::IsString.bind(document_model);
    let filtered = content_children
        .iter()
        .cloned()
        .filter(|node| filter.apply_test(node))
        .collect::<Vec<_>>();
    assert_eq!(filtered, vec![GraphNode::String(0), GraphNode::String(1),]);
}

#[test]
fn can_filter_by_profile() {
    let dast_root = dast_root_no_position(r#"<text>me</text>hi<section>you</section>there<baz />"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    let filter = ContentFilter::IsType("section").bind(document_model);
    let section_node = content_children
        .iter()
        .cloned()
        .find(|node| filter.apply_test(node))
        .unwrap()
        .clone();

    // Just a check to make sure the numbers are right.
    assert_eq!(section_node, GraphNode::Component(2));

    // Filtering based on `String` profile should give everything but `<section>` and `<baz>`
    let filter = ContentFilter::HasPropMatchingProfile(PropProfile::String).bind(document_model);
    let filtered = content_children
        .iter()
        .cloned()
        .filter(|n| filter.apply_test(n))
        .collect::<Vec<_>>();

    assert_eq!(
        filtered,
        vec![
            GraphNode::Component(1),
            GraphNode::String(0),
            GraphNode::String(1)
        ]
    );
}

#[test]
fn can_filter_by_profile_and_condition() {
    let dast_root = dast_root_no_position(r#"<text>me</text><text>you</text><text>me</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    let str_me = PropValue::String(Rc::new("me".to_string()));
    let str_you = PropValue::String(Rc::new("you".to_string()));

    let filter = ContentFilter::HasPropMatchingProfileAndCondition(
        PropProfile::String,
        Cond::Eq(str_me.clone()),
    )
    .bind(document_model);
    let filtered = content_children
        .iter()
        .cloned()
        .filter(|n| filter.apply_test(n))
        .collect::<Vec<_>>();

    assert_eq!(
        filtered,
        vec![GraphNode::Component(1), GraphNode::Component(3),]
    );

    let filter = ContentFilter::HasPropMatchingProfileAndCondition(
        PropProfile::String,
        Cond::Eq(str_you.clone()),
    )
    .bind(document_model);
    let filtered = content_children
        .iter()
        .cloned()
        .filter(|n| filter.apply_test(n))
        .collect::<Vec<_>>();

    assert_eq!(filtered, vec![GraphNode::Component(2),]);
}
