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
            data_query: DataQuery::ComponentRefs {
                container: PropSource::Me,
                filter: Rc::new(ContentFilter::IsType(component_type)),
            },
            component_to_select: Some(ComponentToSelect::Last),
        }
    }

    /// Creates a ComponentRefs prop that returns the first child with component_type
    pub fn new_from_first_matching_child(component_type: &'static str) -> Self {
        ComponentRefProp {
            data_query: DataQuery::ComponentRefs {
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

impl PropUpdater for ComponentRefProp {
    type PropType = prop_type::ComponentRef;

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        // There are two options based on the data query that created us.
        match self.data_query {
            DataQuery::ComponentRefs { .. } => {
                let content_refs: PropView<prop_type::ContentRefs> = data.vec[0]
                    .to_owned()
                    .try_into_prop_view()
                    .expect("Manual unwrap in ComponentRefProp failed");

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
                    Some(ComponentToSelect::Last) => elements.last(),
                    None => unreachable!("component_to_select should be Some"),
                };
                PropCalcResult::Calculated(component)
            }
            _ => {
                panic!("ComponentRefProp should only be created with a FilteredChildren data query")
            }
        }
    }
}
