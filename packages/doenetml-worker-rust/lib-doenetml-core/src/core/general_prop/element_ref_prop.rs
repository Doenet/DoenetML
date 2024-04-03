use crate::{
    components::prelude::*,
    props::{ComponentTypeDataQueryFilter, DataQueryFilter, DataQueryFilterComparison},
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
}

impl PropUpdater for ElementRefProp {
    type PropType = prop_type::ElementRef;

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        //let elements_found = &data.vec[0].values;

        // There are two options based on the data query that created us.
        match self.data_query {
            DataQuery::FilteredChildren { .. } => {
                let elements_found: Vec<PropView<prop_type::GraphNodes>> =
                    data.vec[0].to_owned().into_prop_view();
                match elements_found.len() {
                    // return an empty vector if nothing found
                    0 => PropCalcResult::FromDefault(<Self as PropUpdater>::default(self)),
                    _ => {
                        let mut elements = elements_found
                            .iter()
                            .flat_map(|elt| {
                                elt.value.iter().map(|node| match node {
                                    GraphNode::Component(_) => node.into(),
                                    _ => unreachable!("data queries for element refs prop should return component graph nodes, found {:?}", node)
                                })
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
