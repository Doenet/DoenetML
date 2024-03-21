use std::rc::Rc;

use crate::components::prelude::*;
use crate::general_prop::ElementRefsProp;
use crate::props::BoxedUpdater;
use crate::props::ComponentTypeDataQueryFilter;
use crate::props::DataQueryFilter;
use crate::props::DataQueryFilterComparison;
use crate::props::DataQueryResult;
use crate::props::PropProfileDataQueryFilter;
//use crate::props::prop_type::ElementRefs;
//use crate::props::PropView;

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

//struct RequiredData {
//    filtered_children: PropView<Vec<GraphNode>>,
//    title: PropView<ElementRefs>,
//}
//impl RequiredData {
//    fn data_queries() -> Vec<DataQuery> {
//        vec![
//            DataQuery::FilteredChildren {
//                filters: vec![
//                    DataQueryFilter::PropProfile(PropProfileDataQueryFilter {
//                        profile: PropProfile::Hidden,
//                        value: PropValue::Boolean(true),
//                        comparison: DataQueryFilterComparison::NotEqual,
//                    }),
//                    DataQueryFilter::ComponentType(ComponentTypeDataQueryFilter {
//                        component_type: Title::NAME,
//                        comparison: DataQueryFilterComparison::NotEqual,
//                    }),
//                ],
//                include_if_missing_profile: true,
//            },
//            DataQuery::Prop {
//                component_idx: None,
//                local_prop_idx: SectionProps::Title.local_idx(),
//            },
//        ]
//    }
//
//    fn from_data_query_results(data: Vec<DataQueryResult>) -> Self {
//        if data.len() != 2 {
//            panic!("Expected 2 data query results, got {}", data.len());
//        }
//        let x = data[0];
//        let t: PropView<String> = x.values[0].try_into().unwrap();
//
//        //let filtered_children = data[0].try_into().unwrap();
//        //let title = data[1].try_into().unwrap();
//
//        RequiredData {
//            filtered_children,
//            title,
//        }
//    }
//}

impl PropUpdater for SectionRenderedChildren {
    fn data_queries(&self) -> Vec<DataQuery> {
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
                local_prop_idx: SectionProps::Title.local_idx(),
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
                    vec![element_refs[0].as_graph_node()]
                }
            }
            _ => unreachable!("title prop should be an ElementRefs"),
        };

        child_nodes.extend(non_title_nodes);

        PropCalcResult::Calculated(PropValue::GraphNodes(child_nodes))
    }
}
