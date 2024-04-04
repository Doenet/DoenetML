use crate::{
    components::prelude::*,
    props::{ComponentTypeDataQueryFilter, DataQueryFilter, DataQueryFilterComparison},
    state::types::{content_refs::ContentRef, element_refs::ElementRef},
};

/// A prop that references a single component
#[derive(Debug)]
pub struct ElementRefProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,

    elements_to_select: Option<ElementsToSelect>,
}

#[derive(Debug)]
enum ElementsToSelect {
    First,
    Last,
}

impl ElementRefProp {
    /// Creates a ElementRefs prop that returns the last child with component_type
    pub fn new_from_last_matching_child(component_type: &'static str) -> Self {
        ElementRefProp {
            data_query: DataQuery::FilteredChildren {
                parent: PropComponent::Me,
                filters: vec![DataQueryFilter::ComponentType(
                    ComponentTypeDataQueryFilter {
                        component_type,
                        comparison: DataQueryFilterComparison::Equal,
                    },
                )],
                include_if_missing_profile: true,
            },
            elements_to_select: Some(ElementsToSelect::Last),
        }
    }

    /// Creates a ElementRefs prop that returns the first child with component_type
    pub fn new_from_first_matching_child(component_type: &'static str) -> Self {
        ElementRefProp {
            data_query: DataQuery::FilteredChildren {
                parent: PropComponent::Me,
                filters: vec![DataQueryFilter::ComponentType(
                    ComponentTypeDataQueryFilter {
                        component_type,
                        comparison: DataQueryFilterComparison::Equal,
                    },
                )],
                include_if_missing_profile: true,
            },
            elements_to_select: Some(ElementsToSelect::First),
        }
    }

    pub fn new_self_ref() -> Self {
        ElementRefProp {
            data_query: DataQuery::SelfRef,
            elements_to_select: None,
        }
    }
}

impl PropUpdater for ElementRefProp {
    type PropType = prop_type::ElementRef;

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        // There are two options based on the data query that created us.
        match self.data_query {
            DataQuery::FilteredChildren { .. } => {
                let elements_found: Vec<PropView<prop_type::ContentRef>> =
                    data.vec[0].to_owned().into_prop_view();
                match elements_found.len() {
                    // return an empty vector if nothing found
                    0 => PropCalcResult::FromDefault(<Self as PropUpdater>::default(self)),
                    _ => {
                        let mut elements = elements_found
                            .iter()
                            .filter_map(|elt| {
                                let value = elt.value.as_ref()?;
                                if !matches!(value, ContentRef::Component(_)) {
                                    panic!("data queries for element refs prop should return component refs nodes, found {:?}", value.clone())
                                }

                                match value {
                                    &ContentRef::Component(idx) => {
                                         Some(ElementRef::from(idx))
                                    },
                                    _ => unreachable!("data queries for element refs prop should return component graph nodes, found {:?}", value.clone())
                                }
                            });

                        let component = match self.elements_to_select {
                            Some(ElementsToSelect::First) => elements.next(),
                            Some(ElementsToSelect::Last) => elements.last(),
                            None => unreachable!("elements_to_select should be Some"),
                        };
                        PropCalcResult::Calculated(component)
                    }
                }
            }
            _ => panic!("ElementRefProp should only be created with a FilteredChildren data query"),
        }
    }
}
