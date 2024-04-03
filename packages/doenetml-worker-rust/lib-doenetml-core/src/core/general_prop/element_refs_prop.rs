use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::{ComponentTypeDataQueryFilter, DataQueryFilter, DataQueryFilterComparison},
    state::types::element_refs::ElementRefs,
};

/// A prop that references multiple components
#[derive(Debug)]
pub struct ElementRefsProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
}

impl ElementRefsProp {
    /// Creates a ElementRefs prop that returns all children with component_type
    pub fn new_from_all_matching_children(component_type: &'static str) -> Self {
        ElementRefsProp {
            data_query: DataQuery::FilteredChildren {
                filters: vec![DataQueryFilter::ComponentType(
                    ComponentTypeDataQueryFilter {
                        component_type,
                        comparison: DataQueryFilterComparison::Equal,
                    },
                )],
                include_if_missing_profile: true,
            },
        }
    }
}

impl PropUpdater for ElementRefsProp {
    type PropType = prop_type::ElementRefs;

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let elements_found = &data.vec[0].values;

        match elements_found.len() {
            // return an empty vector if nothing found
            0 => PropCalcResult::FromDefault(<Self as PropUpdater>::default(self)),
            _ => {
                let elements = elements_found
                    .iter()
                    .flat_map(|elt| match &elt.value {
                        PropValue::GraphNodes(graph_nodes) => graph_nodes.iter().map(|node| match node {
                            GraphNode::Component(_) => node.into(),
                            _ => unreachable!("data queries for element refs prop should return component graph nodes, found {:?}", node)
                        }),
                        _ => panic!(
                            "Should get GraphNodes dependencies for FilteredChildren query, found {:?}",
                            elt
                        ),
                    })
                    .collect::<Vec<_>>();
                PropCalcResult::Calculated(Rc::new(ElementRefs(elements)))
            }
        }
    }
}
