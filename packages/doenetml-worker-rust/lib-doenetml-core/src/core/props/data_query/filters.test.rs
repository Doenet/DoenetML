use std::rc::Rc;

use super::super::*;
use super::*;
use crate::{Core, test_utils::*};

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

    let op = OpNot(true);
    assert_eq!(op.apply_test(&true), false);
}

#[test]
fn can_filter_on_component_type() {
    let query_node = GraphNode::Query(0);
    let dast_root = dast_root_no_position(r#"<foo /><bar /><baz />"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;

    // Filter for single element
    let filter = ContentFilter::IsType("foo").bind(query_node, document_model);
    let filtered = (1..=3usize)
        .into_iter()
        .filter(|&idx| {
            let node = GraphNode::Component(idx.into());
            filter.apply_test(&node)
        })
        .collect::<Vec<_>>();
    assert_eq!(filtered, vec![1]);

    // Filter for multiple elements NOT
    let filter = OpNot(ContentFilter::IsType("foo")).bind(query_node, document_model);
    let filtered = (1..=3usize)
        .into_iter()
        .filter(|&idx| {
            let node = GraphNode::Component(idx.into());
            filter.apply_test(&node)
        })
        .collect::<Vec<_>>();
    assert_eq!(filtered, vec![2, 3]);

    // Filter for multiple elements OR
    let filter = Op::Or(ContentFilter::IsType("foo"), ContentFilter::IsType("baz"))
        .bind(query_node, document_model);
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
    let query_node = GraphNode::Query(0);
    let dast_root = dast_root_no_position(r#"<foo />hi<bar />there<baz />"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    // Filter for single element
    let filter = ContentFilter::IsComponent.bind(query_node, document_model);
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

    let filter = ContentFilter::IsString.bind(query_node, document_model);
    let filtered = content_children
        .iter()
        .cloned()
        .filter(|node| filter.apply_test(node))
        .collect::<Vec<_>>();
    assert_eq!(filtered, vec![GraphNode::String(0), GraphNode::String(1),]);
}

#[test]
fn can_filter_by_profile() {
    let query_node = GraphNode::Query(0);
    let dast_root = dast_root_no_position(r#"<text>me</text>hi<section>you</section>there<baz />"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    let filter = ContentFilter::IsType("division").bind(query_node, document_model);
    let section_node = content_children
        .iter()
        .cloned()
        .find(|node| filter.apply_test(node))
        .unwrap()
        .clone();

    // Just a check to make sure the numbers are right.
    assert_eq!(section_node, GraphNode::Component(2));

    // Filtering based on `String` profile should give everything but `<section>` and `<baz>`
    let filter =
        ContentFilter::HasPropMatchingProfile(PropProfile::String).bind(query_node, document_model);
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
    let query_node = GraphNode::Query(0);
    let dast_root = dast_root_no_position(r#"<text>me</text><text>you</text><text>me</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    // We need to call `to_flat_dast` so that the `value` prop of our `<text>` components
    // gets resolved. Otherwise we cannot `apply_test` without failing on an unresolved prop.
    core.to_flat_dast();
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    let str_me = PropValue::String(Rc::new("me".to_string()));
    let str_you = PropValue::String(Rc::new("you".to_string()));

    let filter = ContentFilter::HasPropMatchingProfileAndCondition(
        PropProfile::String,
        Cond::Eq(str_me.clone()),
    )
    .bind(query_node, document_model);

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
    .bind(query_node, document_model);
    let filtered = content_children
        .iter()
        .cloned()
        .filter(|n| filter.apply_test(n))
        .collect::<Vec<_>>();

    assert_eq!(filtered, vec![GraphNode::Component(2),]);
}

#[test]
fn can_accumulate_deps_for_simple_filter() {
    let query_node = GraphNode::Query(0);
    let dast_root = dast_root_no_position(r#"<text>me</text><text>you</text>fun<text>me</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    let str_me = PropValue::String(Rc::new("me".to_string()));

    // Match on just one prop
    let filter = ContentFilter::HasPropMatchingProfileAndCondition(
        PropProfile::String,
        Cond::Eq(str_me.clone()),
    )
    .bind(query_node, document_model);
    let deps = content_children
        .iter()
        .cloned()
        .map(|n| filter.accumulate_deps(&n))
        .collect::<Vec<_>>();

    // The `value` props of the text components are what we're looking for.
    let value_props = content_children
        .iter()
        .map(|n| {
            if matches!(n, GraphNode::String(_)) {
                return vec![*n];
            }
            if !matches!(n, GraphNode::Component(_)) {
                // Never any deps for a non-component node
                return vec![];
            }
            let prop =
                document_model.get_component_prop_by_profile(&n.into(), &[PropProfile::String]);
            vec![document_model.prop_pointer_to_prop_node(prop.unwrap())]
        })
        .collect::<Vec<_>>();

    assert_eq!(deps, value_props);
}

#[test]
fn can_accumulate_deps_for_compound_filter() {
    let query_node = GraphNode::Query(0);
    let dast_root = dast_root_no_position(r#"<text>me</text><text>you</text>fun<text>me</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let document_model = &core.document_model;
    let content_children = document_model.get_component_content_children(0);

    let str_me = PropValue::String(Rc::new("me".to_string()));

    let cond1 = ContentFilter::HasPropMatchingProfileAndCondition(
        PropProfile::Hidden,
        Cond::Eq(PropValue::Boolean(false)),
    );

    let cond2 = ContentFilter::HasPropMatchingProfileAndCondition(
        PropProfile::String,
        Cond::Eq(str_me.clone()),
    );

    // Match on multiple props
    let filter = Op::Or(cond1.clone(), cond2.clone()).bind(query_node, document_model);
    let deps = content_children
        .iter()
        .cloned()
        .map(|n| filter.accumulate_deps(&n))
        .collect::<Vec<_>>();

    // The `value` and `hidden` props of the text components are what we're looking for.
    let value_props = content_children
        .iter()
        .map(|n| {
            if matches!(n, GraphNode::String(_)) {
                // We're matching the string profile, so strings always get returned.
                return vec![*n];
            }
            if !matches!(n, GraphNode::Component(_)) {
                // Never any deps for a non-component node
                return vec![];
            }
            let prop1 =
                document_model.get_component_prop_by_profile(&n.into(), &[PropProfile::Hidden]);
            let prop2 =
                document_model.get_component_prop_by_profile(&n.into(), &[PropProfile::String]);
            vec![
                document_model.prop_pointer_to_prop_node(prop1.unwrap()),
                document_model.prop_pointer_to_prop_node(prop2.unwrap()),
            ]
        })
        .collect::<Vec<_>>();

    assert_eq!(deps, value_props);

    // Changing the Or to an And shouldn't change the result
    let filter = Op::And(cond1.clone(), cond2.clone()).bind(query_node, document_model);
    let deps = content_children
        .iter()
        .cloned()
        .map(|n| filter.accumulate_deps(&n))
        .collect::<Vec<_>>();

    assert_eq!(deps, value_props);

    // Inserting a OpNot should not change the result
    // Changing the Or to an And shouldn't change the result
    let filter =
        OpNot(Op::And(cond1.clone(), OpNot(cond2.clone()))).bind(query_node, document_model);
    let deps = content_children
        .iter()
        .cloned()
        .map(|n| filter.accumulate_deps(&n))
        .collect::<Vec<_>>();

    assert_eq!(deps, value_props);
}

use bindable::*;
mod bindable {
    //! Traits to make testing slightly easier.

    use super::{ApplyTest, ContentFilter, FilterData, Op, OpNot};
    use crate::{DocumentModel, graph_node::GraphNode};
    use std::fmt::Debug;

    /// Implementing this trait allows you to be bound to a document model.
    /// After you are bound, you can `.apply_test` on a `GraphNode`.
    pub trait BindableAsGraphNodeFilter<'a>
    where
        Self: Debug,
    {
        /// Attach `self` to `document_model` so that you can filter `GraphNode`s.
        fn bind(
            &self,
            origin: GraphNode,
            document_model: &'a DocumentModel,
        ) -> Box<dyn ApplyTest<GraphNode, GraphNode> + 'a>;
    }

    /// A filter that has been bound to a document model.
    #[derive(Debug, Clone)]
    pub struct BoundContentFilter<'a, Filter>
    where
        Filter: ApplyTest<FilterData<'a>, GraphNode> + Debug,
    {
        pub filter: Filter,
        pub origin: GraphNode,
        pub document_model: &'a DocumentModel,
    }

    impl<'a, Filter> ApplyTest<GraphNode, GraphNode> for BoundContentFilter<'a, Filter>
    where
        Filter: ApplyTest<FilterData<'a>, GraphNode> + Debug,
    {
        fn apply_test(&self, node: &GraphNode) -> bool {
            self.filter.apply_test(&FilterData {
                node: *node,
                origin: self.origin,
                document_model: self.document_model,
            })
        }

        fn accumulate_deps(&self, value: &GraphNode) -> Vec<GraphNode> {
            self.filter.accumulate_deps(&FilterData {
                node: *value,
                origin: self.origin,
                document_model: self.document_model,
            })
        }
    }

    mod binding {
        //! Implementations of `.bind` for relevant types.

        use super::*;

        impl<'a> BindableAsGraphNodeFilter<'a> for ContentFilter {
            fn bind(
                &self,
                origin: GraphNode,
                document_model: &'a DocumentModel,
            ) -> Box<dyn ApplyTest<GraphNode, GraphNode> + 'a> {
                Box::new(BoundContentFilter {
                    filter: self.clone(),
                    origin,
                    document_model,
                })
            }
        }

        impl<'a, Filter> BindableAsGraphNodeFilter<'a> for OpNot<Filter>
        where
            Filter: ApplyTest<FilterData<'a>, GraphNode> + Debug + Clone + 'a,
        {
            fn bind(
                &self,
                origin: GraphNode,
                document_model: &'a DocumentModel,
            ) -> Box<dyn ApplyTest<GraphNode, GraphNode> + 'a> {
                Box::new(BoundContentFilter {
                    filter: self.clone(),
                    origin,
                    document_model,
                })
            }
        }

        impl<'a, LeftFilter, RightFilter> BindableAsGraphNodeFilter<'a> for Op<LeftFilter, RightFilter>
        where
            LeftFilter: ApplyTest<FilterData<'a>, GraphNode> + Debug + Clone + 'a,
            RightFilter: ApplyTest<FilterData<'a>, GraphNode> + Debug + Clone + 'a,
        {
            fn bind(
                &self,
                origin: GraphNode,
                document_model: &'a DocumentModel,
            ) -> Box<dyn ApplyTest<GraphNode, GraphNode> + 'a> {
                Box::new(BoundContentFilter {
                    filter: self.clone(),
                    origin,
                    document_model,
                })
            }
        }

        // Just to make it easier to do some examples
        impl<'a> BindableAsGraphNodeFilter<'a> for bool {
            fn bind(
                &self,
                _origin: GraphNode,
                _document_model: &'a DocumentModel,
            ) -> Box<dyn ApplyTest<GraphNode, GraphNode> + 'a> {
                Box::new(*self)
            }
        }
    }
}
