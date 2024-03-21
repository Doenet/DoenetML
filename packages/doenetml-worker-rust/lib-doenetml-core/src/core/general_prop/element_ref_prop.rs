use crate::{
    components::prelude::*,
    core::props::PropUpdater,
    props::{ComponentTypeDataQueryFilter, DataQueryFilter, DataQueryFilterComparison},
    state::types::element_refs::ElementRefs,
};

#[derive(Debug)]
pub struct ElementRefsProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,

    elements_to_select: ElementsToSelect,
}

#[derive(Debug)]
enum ElementsToSelect {
    First,
    Last,
    All,
}

impl ElementRefsProp {
    /// Creates a ElementRefs prop that returns the last child with component_type
    pub fn new_from_last_matching_child(component_type: &'static str) -> Self {
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
            elements_to_select: ElementsToSelect::Last,
        }
    }

    /// Creates a ElementRefs prop that returns the first child with component_type
    pub fn new_from_first_matching_child(component_type: &'static str) -> Self {
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
            elements_to_select: ElementsToSelect::First,
        }
    }

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
            elements_to_select: ElementsToSelect::All,
        }
    }
}

impl PropUpdater for ElementRefsProp {
    fn default(&self) -> PropValue {
        PropValue::ElementRefs(ElementRefs::default())
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<PropValue> {
        let elements_found = &data.vec[0].values;

        match elements_found.len() {
            // return an empty vector if nothing found
            0 => PropCalcResult::FromDefault(self.default()),
            _ => {
                let elements = elements_found
                    .iter()
                    .flat_map(|elt| match &*elt.value {
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
                PropCalcResult::Calculated(match self.elements_to_select {
                    ElementsToSelect::First => {
                        PropValue::ElementRefs(ElementRefs(vec![*elements.first().unwrap()]))
                    }
                    ElementsToSelect::Last => {
                        PropValue::ElementRefs(ElementRefs(vec![*elements.last().unwrap()]))
                    }
                    ElementsToSelect::All => PropValue::ElementRefs(ElementRefs(elements)),
                })
            }
        }
    }
}
