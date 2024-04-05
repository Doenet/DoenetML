use std::fmt::Debug;

use crate::{graph_node::GraphNode, props::PropProfile, DocumentModel};

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
            document_model: self.document_model,
        })
    }
}

/// Filters used to filter content (props/components/strings) from the structure graph.
#[derive(Debug, Clone)]
pub enum ContentFilter {
    /// Match a component by type name.
    IsType(&'static str),
    /// Match components that have a prop matching a profile;
    /// The value of the matched prop is not considered.
    HasPropMatchingProfile(PropProfile),
    HasPropMatchingProfileAndCondition(PropProfile, Cond<PropValue>),
    /// Match content is a component.
    IsComponent,
    /// Match content is a string.
    IsString,
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
}

/// Information needed to determine of `node` matches a given filter condition.
#[derive(Debug, Clone)]
pub struct FilterData<'a> {
    node: GraphNode,
    document_model: &'a DocumentModel,
}

impl ApplyTest<FilterData<'_>, GraphNode> for ContentFilter {
    fn apply_test(&self, data: &FilterData) -> bool {
        // Warning: Only use `get_prop_unchecked` for getting a prop in this function.
        // This is so that we possibly catch errors a little earlier if a prop that is not
        // set in the dependency graph is accessed.
        let node = data.node;
        let document_model = data.document_model;
        match self {
            ContentFilter::IsType(type_name) => match node {
                GraphNode::Component(_) => {
                    let component_type = document_model.get_component_type(node);
                    component_type.eq(type_name)
                }
                _ => false,
            },
            ContentFilter::HasPropMatchingProfile(profile) => match node {
                GraphNode::Component(component_idx) => {
                    let prop =
                        document_model.get_component_prop_by_profile(component_idx, &[*profile]);
                    prop.is_some()
                }
                _ => {
                    // `PropProfile::String` is the only profile that non-component nodes can match.
                    // We special case it here.
                    if matches!(profile, PropProfile::String)
                        && matches!(node, GraphNode::String(_))
                    {
                        return true;
                    }
                    false
                }
            },
            ContentFilter::HasPropMatchingProfileAndCondition(profile, cond) => match node {
                GraphNode::Component(component_idx) => {
                    let prop =
                        document_model.get_component_prop_by_profile(component_idx, &[*profile]);

                    let prop = prop.map(|prop_pointer| {
                        let prop_node = document_model.prop_pointer_to_prop_node(prop_pointer);
                        document_model.get_prop_untracked(prop_node, GraphNode::Query(0))
                    });

                    prop.map(|prop| {
                        let value = prop.value;
                        // Test the condition
                        cond.apply_test(&value)
                    })
                    .unwrap_or(false)
                }
                _ => false,
            },
            ContentFilter::IsComponent => matches!(node, GraphNode::Component(_)),
            ContentFilter::IsString => matches!(node, GraphNode::String(_)),
        }
    }

    // Warning: Do not get prop values in the accumulate_deps function.
    // We won't initialize their deps here. Only return the required prop pointers
}

pub use operations::*;

use super::PropValue;
mod operations {
    //! Abstract operations that can be used to build up complex queries

    use super::*;
    use std::fmt::Debug;

    /// Trait that lets you test to filter different values
    pub trait ApplyTest<TestableValue, Dependency>
    where
        Self: Debug,
    {
        /// Test `value` against this filter
        fn apply_test(&self, value: &TestableValue) -> bool;

        /// Similar to `apply_test` except it returns every "dependency" that was used
        /// to evaluate the test. This is used to accumulate props referenced when evaluating
        /// a filter.
        #[allow(unused_variables)]
        fn accumulate_deps(&self, value: &TestableValue) -> Vec<Dependency> {
            unimplemented!("accumulate_deps not implemented for this filter")
        }
    }

    /// Operations used to build up complex queries
    #[derive(Debug, Clone, PartialEq)]
    pub enum Op<Left, Right> {
        And(Left, Right),
        Or(Left, Right),
    }

    /// Not operation used to build complex queries
    #[derive(Debug, Clone, PartialEq)]
    pub struct OpNot<T>(pub T);

    impl<T, Left, Right> ApplyTest<T, GraphNode> for Op<Left, Right>
    where
        Left: ApplyTest<T, GraphNode>,
        Right: ApplyTest<T, GraphNode>,
        T: Debug,
    {
        fn apply_test(&self, value: &T) -> bool {
            match self {
                Op::And(a, b) => a.apply_test(value) && b.apply_test(value),
                Op::Or(a, b) => a.apply_test(value) || b.apply_test(value),
            }
        }

        // add a `accumulate_test_deps` function
    }

    impl<T, D, S> ApplyTest<T, D> for OpNot<S>
    where
        S: ApplyTest<T, D>,
        T: Debug,
    {
        fn apply_test(&self, value: &T) -> bool {
            !self.0.apply_test(value)
        }
    }

    /// Implement the ApplyTest trait for bool. This ignores any input to `apply_test` and just returns
    /// the value of the bool.
    impl<T, D> ApplyTest<T, D> for bool
    where
        T: Debug,
    {
        fn apply_test(&self, _value: &T) -> bool {
            *self
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

    /// Conditions that can be applied when filtering
    #[derive(Debug, Clone)]
    pub enum Cond<T> {
        Eq(T),
        NotEq(T),
    }

    impl<T> ApplyTest<T, GraphNode> for Cond<T>
    where
        T: PartialEq + Debug + Clone,
    {
        fn apply_test(&self, value: &T) -> bool {
            match self {
                Cond::Eq(a) => a == value,
                Cond::NotEq(a) => a != value,
            }
        }
    }
}

#[cfg(test)]
#[path = "filters.test.rs"]
mod tests;
