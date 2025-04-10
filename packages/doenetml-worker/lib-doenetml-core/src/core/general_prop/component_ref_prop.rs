use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::ContentFilter,
    state::types::{component_refs::ComponentRef, content_refs::ContentRef},
};

/// A prop that references a single component
#[derive(Debug)]
pub struct ComponentRefProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,

    component_to_select: Option<ComponentToSelect>,
}

#[derive(Debug)]
enum ComponentToSelect {
    First,
    Last,
}

impl ComponentRefProp {
    /// Creates a ComponentRefs prop that returns the last child with component_type
    pub fn new_from_last_matching_child(component_type: &'static str) -> Self {
        ComponentRefProp {
            data_query: DataQuery::ContentRefs {
                container: PropSource::Me,
                filter: Rc::new(ContentFilter::IsType(component_type)),
            },
            component_to_select: Some(ComponentToSelect::Last),
        }
    }

    /// Creates a ComponentRefs prop that returns the first child with component_type
    pub fn new_from_first_matching_child(component_type: &'static str) -> Self {
        ComponentRefProp {
            data_query: DataQuery::ContentRefs {
                container: PropSource::Me,
                filter: Rc::new(ContentFilter::IsType(component_type)),
            },
            component_to_select: Some(ComponentToSelect::First),
        }
    }

    pub fn new_self_ref() -> Self {
        ComponentRefProp {
            data_query: DataQuery::SelfRef,
            component_to_select: None,
        }
    }
}

impl PropFromAttribute<prop_type::ComponentRef> for ComponentRefProp {
    fn new_from_attribute(attr_name: &'static str, _default: prop_type::ComponentRef) -> Self {
        Self {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![PropProfile::_Ref],
            },
            component_to_select: None,
        }
    }
}

/// Structure to hold data generated from the data queries
/// This is used for the `DataQuery::ComponentRefs` variant.
#[derive(TryFromDataQueryResults, Debug)]
#[data_query(query_trait = DataQueriesRefs, pass_data = &DataQuery)]
struct RequiredDataRefs {
    refs: PropView<prop_type::ContentRefs>,
}
impl DataQueriesRefs for RequiredDataRefs {
    fn refs_query(query: &DataQuery) -> DataQuery {
        query.clone()
    }
}

/// Structure to hold data generated from the data queries
/// This is used for the `DataQuery::SelfRef` and `DataQuery::Attribute` variants.
#[derive(TryFromDataQueryResults, Debug)]
#[data_query(query_trait = DataQueriesRef, pass_data = &DataQuery)]
struct RequiredDataRef {
    refs: PropView<prop_type::ComponentRef>,
}
impl DataQueriesRef for RequiredDataRef {
    fn refs_query(query: &DataQuery) -> DataQuery {
        query.clone()
    }
}

impl PropUpdater for ComponentRefProp {
    type PropType = prop_type::ComponentRef;

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredDataRefs::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        // There are different options based on the data query that created us.
        match self.data_query {
            DataQuery::ContentRefs { .. } => {
                let required_data = RequiredDataRefs::try_from_data_query_results(data).unwrap();
                let content_refs = required_data.refs;

                if content_refs.value.is_empty() {
                    return PropCalcResult::FromDefault(<Self as PropUpdater>::default(self));
                }

                let mut elements = content_refs.value.as_slice().iter().map(|content_ref|
                    match content_ref {
                        &ContentRef::Component(idx) => {
                             ComponentRef::from(idx)
                        },
                        _ => unreachable!("data queries for element refs prop should return component graph nodes, found {:?}", content_ref.clone())
                    }
                );
                let component = match self.component_to_select {
                    Some(ComponentToSelect::First) => elements.next(),
                    Some(ComponentToSelect::Last) => elements.next_back(),
                    None => unreachable!("component_to_select should be Some"),
                };
                PropCalcResult::Calculated(component)
            }
            DataQuery::SelfRef => {
                let required_data = RequiredDataRef::try_from_data_query_results(data).unwrap();
                PropCalcResult::Calculated(required_data.refs.value)
            }
            DataQuery::Attribute { .. } => {
                let required_data = match RequiredDataRef::try_from_data_query_results(data) {
                    Ok(data) => data,
                    Err(_) => return PropCalcResult::Calculated(None),
                };
                PropCalcResult::Calculated(required_data.refs.value)
            }
            _ => {
                panic!("ComponentRefProp should only be created with a FilteredChildren data query")
            }
        }
    }
}
