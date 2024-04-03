use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::{
        DataQueryFilter, DataQueryFilterComparison, PropProfileDataQueryFilter, UpdaterObject,
    },
};

#[derive(Debug, Default)]
pub struct RenderedChildrenPassthroughProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
}

impl RenderedChildrenPassthroughProp {
    pub fn new() -> Self {
        RenderedChildrenPassthroughProp {
            data_query: DataQuery::FilteredChildren {
                parent: PropComponent::Me,
                filters: vec![DataQueryFilter::PropProfile(PropProfileDataQueryFilter {
                    profile: PropProfile::Hidden,
                    value: PropValue::Boolean(true),
                    comparison: DataQueryFilterComparison::NotEqual,
                })],
                include_if_missing_profile: true,
            },
        }
    }

    // Note: this is currently unused
    pub fn new_updater_object() -> UpdaterObject {
        Rc::new(Self::new())
    }
}

impl PropUpdater for RenderedChildrenPassthroughProp {
    type PropType = prop_type::GraphNodes;

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        // TODO: verify that data was in the right format.
        // For now, assuming that has just one value that is of type PropValue::GraphNodes
        let nodes = data.vec[0]
            .values
            .iter()
            .flat_map(|prop| match &prop.value {
                PropValue::GraphNodes(graph_nodes) => graph_nodes.iter().copied(),
                _ => {
                    unreachable!("should only graph nodes from filtered children")
                }
            })
            .collect::<Vec<_>>();

        PropCalcResult::Calculated(Rc::new(nodes))
    }
}
