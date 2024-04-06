use std::fmt::Debug;

use crate::{graph_node::GraphNode, DocumentModel};

use super::{ApplyTest, ContentFilter, FilterData, Op, OpNot};

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
