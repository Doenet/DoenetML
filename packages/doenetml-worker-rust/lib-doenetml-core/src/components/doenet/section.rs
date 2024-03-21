use std::rc::Rc;

use crate::components::prelude::*;
use crate::general_prop::ElementRefsProp;

use crate::props::BoxedUpdater;
use crate::props::ComponentTypeDataQueryFilter;
use crate::props::DataQueryFilter;
use crate::props::DataQueryFilterComparison;
use crate::props::DataQueryResults;
use crate::props::PropProfileDataQueryFilter;
use crate::props::PropView;
use crate::state::types::element_refs::ElementRefs;

/// The `<section>` component renders its children along with a title
#[component(name = Section)]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// The `<title>` child of the `<section>` that contain's the section's title
        #[prop(
            value_type = PropValueType::ElementRefs,
            is_public,
        )]
        Title,
        /// Whether the `<section>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::GraphNodes, profile = PropProfile::RenderedChildren)]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<section>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Section;
pub use component::SectionActions;
pub use component::SectionAttributes;
pub use component::SectionProps;
use doenetml_macros::FromDataQueryResults;

use super::title::Title;

impl PropGetUpdater for SectionProps {
    fn get_updater(&self) -> BoxedUpdater {
        match self {
            SectionProps::Title => {
                Rc::new(ElementRefsProp::new_from_last_matching_child(Title::NAME))
            }
            SectionProps::Hidden => SectionAttributes::Hide.get_prop_updater(),
            SectionProps::RenderedChildren => Rc::new(SectionRenderedChildren::new()),
        }
    }
}

#[derive(Debug)]
pub struct SectionRenderedChildren {}

impl SectionRenderedChildren {
    pub fn new() -> Self {
        SectionRenderedChildren {}
    }
}
impl Default for SectionRenderedChildren {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(FromDataQueryResults)]
#[data_query(query_trait = CreateDataQueries)]
struct RequiredData {
    filtered_children: Vec<PropView<Rc<Vec<GraphNode>>>>,
    title: PropView<Rc<ElementRefs>>,
}

impl CreateDataQueries for RequiredData {
    fn filtered_children_query() -> DataQuery {
        DataQuery::FilteredChildren {
            filters: vec![
                DataQueryFilter::PropProfile(PropProfileDataQueryFilter {
                    profile: PropProfile::Hidden,
                    value: PropValue::Boolean(true),
                    comparison: DataQueryFilterComparison::NotEqual,
                }),
                DataQueryFilter::ComponentType(ComponentTypeDataQueryFilter {
                    component_type: Title::NAME,
                    comparison: DataQueryFilterComparison::NotEqual,
                }),
            ],
            include_if_missing_profile: true,
        }
    }
    fn title_query() -> DataQuery {
        DataQuery::Prop {
            component_idx: None,
            local_prop_idx: SectionProps::Title.local_idx(),
        }
    }
}

impl PropUpdater for SectionRenderedChildren {
    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::to_data_queries()
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<PropValue> {
        let required_data = RequiredData::from_data_query_results(data);
        let title_element_refs = required_data.title.value;
        let title_node = match &*title_element_refs {
            ElementRefs(element_refs) => element_refs.first().map(|x| vec![x.as_graph_node()]),
        };

        let non_title_nodes = required_data
            .filtered_children
            .iter()
            .flat_map(|prop| (*prop.value).clone());

        let mut child_nodes = title_node.unwrap_or(vec![]);
        child_nodes.extend(non_title_nodes);

        PropCalcResult::Calculated(PropValue::GraphNodes(Rc::new(child_nodes)))
    }
}
