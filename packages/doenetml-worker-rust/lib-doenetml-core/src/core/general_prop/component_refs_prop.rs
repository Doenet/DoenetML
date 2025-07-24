use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::ContentFilter,
    state::types::{component_refs::ComponentRefs, content_refs::ContentRef},
};

/// A prop that references multiple components
#[derive(Debug)]
pub struct ComponentRefsProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
}

impl ComponentRefsProp {
    /// Creates a ComponentRefs prop that returns all children with component_type
    pub fn new_from_all_matching_children(component_type: &'static str) -> Self {
        ComponentRefsProp {
            data_query: DataQuery::ContentRefs {
                container: PropSource::Me,
                filter: Rc::new(ContentFilter::IsType(component_type)),
            },
        }
    }

    /// Creates a ComponentRefs prop that returns all children with component_type
    pub fn new_from_all_matching_siblings(profile: PropProfile) -> Self {
        ComponentRefsProp {
            data_query: DataQuery::ContentRefs {
                container: PropSource::Parent,
                filter: Rc::new(ContentFilter::HasPropMatchingProfile(profile)),
            },
        }
    }
}

/// Structure to hold data generated from the data queries
#[derive(TryFromDataQueryResults, Debug)]
#[data_query(query_trait = DataQueries, pass_data = &DataQuery)]
struct RequiredData {
    refs: PropView<prop_type::ContentRefs>,
}
impl DataQueries for RequiredData {
    fn refs_query(query: &DataQuery) -> DataQuery {
        query.clone()
    }
}

impl PropUpdater for ComponentRefsProp {
    type PropType = prop_type::ComponentRefs;

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let component_refs = required_data.refs;

        if component_refs.value.is_empty() {
            return PropCalcResult::FromDefault(<Self as PropUpdater>::default(self));
        }

        let components = component_refs.value.as_slice().iter().map(|content_ref|
            match content_ref {
                &ContentRef::Component(idx) => {
                     idx
                },
                _ => unreachable!("data queries for element refs prop should return component graph nodes, found {:?}", content_ref.clone())
            }
        ).collect::<Vec<_>>();
        PropCalcResult::Calculated(Rc::new(ComponentRefs(components)))
    }
}
