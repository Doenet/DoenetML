use crate::{
    components::prelude::*,
    core::props::{DataQueryResult, PropUpdater},
    state::types::element_refs::ElementRefs,
};

#[derive(Debug)]
pub struct RenderedChildrenPassthroughProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
}

impl RenderedChildrenPassthroughProp {
    pub fn new() -> Self {
        RenderedChildrenPassthroughProp {
            data_query: DataQuery::FilteredChildren {
                filters: vec![(PropProfile::Hidden, PropValue::Boolean(false))],
                include_if_missing_profile: true,
            },
        }
    }
}

impl PropUpdater for RenderedChildrenPassthroughProp {
    fn default(&self) -> PropValue {
        PropValue::ElementRefs(ElementRefs::default())
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: Vec<DataQueryResult>) -> PropCalcResult<PropValue> {
        // TODO: verify that data was in the right format.
        // For now, assuming that has just one value that is of type PropValue::GraphNodes
        let nodes = data[0]
            .values
            .iter()
            .flat_map(|prop| match &*prop.value {
                PropValue::GraphNodes(graph_nodes) => graph_nodes.iter().map(|node| *node),
                _ => {
                    unreachable!("should only graph nodes from filtered children")
                }
            })
            .collect::<Vec<_>>();

        PropCalcResult::Calculated(PropValue::GraphNodes(nodes))
    }
}
