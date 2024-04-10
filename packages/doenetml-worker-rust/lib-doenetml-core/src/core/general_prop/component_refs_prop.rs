use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::ContentFilter,
    state::types::{content_refs::ContentRef, element_refs::ElementRefs},
};

/// A prop that references multiple components
#[derive(Debug)]
pub struct ComponentRefsProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
}

impl ComponentRefsProp {
    /// Creates a ElementRefs prop that returns all children with component_type
    pub fn new_from_all_matching_children(component_type: &'static str) -> Self {
        ComponentRefsProp {
            data_query: DataQuery::ComponentRefs {
                container: PropSource::Me,
                filter: Rc::new(ContentFilter::IsType(component_type)),
            },
        }
    }

    /// Creates a ElementRefs prop that returns all children with component_type
    pub fn new_from_all_matching_siblings(profile: PropProfile) -> Self {
        ComponentRefsProp {
            data_query: DataQuery::ComponentRefs {
                container: PropSource::Parent,
                filter: Rc::new(ContentFilter::HasPropMatchingProfile(profile)),
            },
        }
    }
}

impl PropUpdater for ComponentRefsProp {
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
                        PropValue::ContentRefs(graph_nodes) => (**graph_nodes).clone().into_vec().into_iter().map(|node| match node {
                            ContentRef::Component(idx) => idx,
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
