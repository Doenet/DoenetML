use crate::components::prelude::*;
use crate::general_prop::ElementRefsProp;
use crate::props::ComponentTypeDataQueryFilter;
use crate::props::DataQueryFilter;
use crate::props::DataQueryFilterComparison;
use crate::props::DataQueryResult;
use crate::props::PropProfileDataQueryFilter;

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

use super::title::Title;

impl PropGetUpdater for SectionProps {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            SectionProps::Title => {
                Box::new(ElementRefsProp::new_from_last_matching_child(Title::NAME))
            }
            SectionProps::Hidden => SectionAttributes::Hide.get_prop_updater(),
            SectionProps::RenderedChildren => Box::new(SectionRenderedChildren::new()),
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

impl PropUpdater for SectionRenderedChildren {
    fn data_queries(&self) -> Vec<DataQuery> {
        let title_local_idx = LocalPropIdx(
            Section::PROP_NAMES
                .iter()
                .position(|name| name.eq(&"title"))
                .unwrap(),
        );
        vec![
            // all non-hidden children except titles
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
            },
            DataQuery::Prop {
                component_idx: None,
                local_prop_idx: title_local_idx,
            },
        ]
    }

    fn calculate(&self, data: Vec<DataQueryResult>) -> PropCalcResult<PropValue> {
        let non_title_nodes = data[0].values.iter().flat_map(|prop| match &*prop.value {
            PropValue::GraphNodes(graph_nodes) => graph_nodes.iter().copied(),
            _ => {
                unreachable!("should only graph nodes from filtered children")
            }
        });

        let mut child_nodes = match &*data[1].values[0].value {
            PropValue::ElementRefs(element_refs) => {
                if element_refs.is_empty() {
                    vec![]
                } else {
                    vec![GraphNode::Component(element_refs[0])]
                }
            }
            _ => unreachable!("title prop should be an ElementRefs"),
        };

        child_nodes.extend(non_title_nodes);

        PropCalcResult::Calculated(PropValue::GraphNodes(child_nodes))
    }
}
