use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<ul>` component is for making unordered lists
#[component(name = Ul)]
mod component {

    use super::*;
    use crate::general_prop::{BooleanProp, EnumProp, StringToIntegerProp};

    enum Props {
        /// Whether the `<ul>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The number of levels deep `<ul>` is nested.
        #[prop(
            value_type = PropValueType::ListDepth,
            profile = PropProfile::ListDepth,
            for_render,
        )]
        ListDepth,

        /// The value of the marker to be used for list items in this list.
        #[prop(
            value_type = PropValueType::ListMarker,
            profile = PropProfile::ListMarker,
        )]
        Marker,

        /// The value of the marker coming from the attr.
        #[prop(
            value_type = PropValueType::ListMarker,
        )]
        MarkerAttr,

        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }

    // TODO: Our current macros cannot handle the generic parameter, so we define a type to use instead.
    type ListMarkerEnumProp = EnumProp<prop_type::ListMarker>;
    enum Attributes {
        /// Whether the `<ul>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
        /// The item this `<ul>` refers to.
        #[attribute(prop = StringToIntegerProp, default = 1)]
        Cols,
        /// The way this list's items should be marked. E.g. with a circle, square, etc.
        #[attribute(
            prop = ListMarkerEnumProp,
            default = prop_type::ListMarker::default_ul()
        )]
        Marker,
    }
}

pub use component::Ul;
pub use component::UlActions;
pub use component::UlAttributes;
pub use component::UlProps;

impl PropGetUpdater for UlProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            UlProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            UlProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
            UlProps::ListDepth => as_updater_object::<_, component::props::types::ListDepth>(
                custom_props::ListDepth::new(),
            ),
            UlProps::MarkerAttr => as_updater_object::<_, component::props::types::MarkerAttr>(
                component::attrs::Marker::get_prop_updater(),
            ),
            UlProps::Marker => {
                as_updater_object::<_, component::props::types::Marker>(custom_props::Marker::new())
            }
        }
    }
}

mod custom_props {
    use super::*;

    pub use list_depth::*;
    mod list_depth {
        use super::*;

        /// Information about how to reference this component from an `ol`
        #[derive(Debug, Default)]
        pub struct ListDepth {}

        impl ListDepth {
            pub fn new() -> Self {
                ListDepth {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug, TestDataQueryTypes)]
        #[owning_component(Ul)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData {
            parent_depth: Option<PropView<prop_type::ListDepth>>,
        }

        impl DataQueries for RequiredData {
            fn parent_depth_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::ListDepth]),
                }
            }
        }

        impl PropUpdater for ListDepth {
            type PropType = prop_type::ListDepth;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                match required_data.parent_depth {
                    Some(parent_depth) => {
                        PropCalcResult::Calculated(parent_depth.value + prop_type::ListDepth::Ul(0))
                    }
                    None => PropCalcResult::Calculated(prop_type::ListDepth::Ul(0)),
                }
            }
        }
    }

    pub use marker::*;
    mod marker {
        use super::*;

        /// The marker to be used for this list
        #[derive(Debug, Default)]
        pub struct Marker {}

        impl Marker {
            pub fn new() -> Self {
                Marker {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Ul)]
        struct RequiredData {
            parent_marker: Option<PropView<prop_type::ListMarker>>,
            marker_attr: PropView<prop_type::ListMarker>,
        }

        impl DataQueries for RequiredData {
            fn parent_marker_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::ListMarker]),
                }
            }
            fn marker_attr_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: PropSpecifier::LocalIdx(UlProps::MarkerAttr.local_idx()),
                }
            }
        }

        impl PropUpdater for Marker {
            type PropType = prop_type::ListMarker;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                if !required_data.marker_attr.came_from_default {
                    return PropCalcResult::Calculated(required_data.marker_attr.value);
                }
                PropCalcResult::FromDefault(
                    required_data
                        .parent_marker
                        .map(|v| {
                            if !v.value.is_ordered() {
                                v.value.next_marker()
                            } else {
                                // Reset the marker type if switching from an ordered list
                                prop_type::ListMarker::default_ul()
                            }
                        })
                        .unwrap_or(prop_type::ListMarker::default_ul()),
                )
            }
        }
    }
}
