use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<ol>` component is for making ordered lists
#[component(name = Ol)]
mod component {

    use super::*;
    use crate::general_prop::{BooleanProp, EnumProp, StringToIntegerProp};

    enum Props {
        /// Whether the `<ol>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The number of levels deep `<ol>` is nested.
        #[prop(
            value_type = PropValueType::ListDepth,
            profile = PropProfile::ListDepth,
            for_render,
        )]
        ListDepth,

        /// The value to start counting from. This is used to label the `<li>` element children.
        #[prop(
            value_type = PropValueType::Integer,
            profile = PropProfile::ListStartIndex,
        )]
        StartIndex,

        /// The value of the `start` attribute.
        #[prop(
            value_type = PropValueType::Integer,
            profile = PropProfile::ListStartIndex,
        )]
        StartAttr,

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
        /// Whether the `<ol>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
        /// The item this `<ol>` refers to.
        #[attribute(prop = StringToIntegerProp, default = 1)]
        Cols,
        /// What value to start counting the list index from. This is always
        /// a number, even if the list type will be roman numerals or letters.
        /// The list value starts at 1. (e.g. `start=1` would correspond to `1`/`a`/`i`/etc.)
        #[attribute(prop = StringToIntegerProp, default = 1)]
        Start,
        /// The way this list's items should be marked. E.g. `1`, `a`, `i`, `A`, `I`, etc.
        #[attribute(
            prop = ListMarkerEnumProp,
            default = prop_type::ListMarker::default()
        )]
        Marker,
    }
}

pub use component::Ol;
pub use component::OlActions;
pub use component::OlAttributes;
pub use component::OlProps;

impl PropGetUpdater for OlProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            OlProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            OlProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
            OlProps::ListDepth => as_updater_object::<_, component::props::types::ListDepth>(
                custom_props::ListDepth::new(),
            ),
            OlProps::StartAttr => as_updater_object::<_, component::props::types::StartIndex>(
                component::attrs::Start::get_prop_updater(),
            ),
            OlProps::StartIndex => as_updater_object::<_, component::props::types::StartIndex>(
                custom_props::StartIndex::new(),
            ),
            OlProps::MarkerAttr => as_updater_object::<_, component::props::types::MarkerAttr>(
                component::attrs::Marker::get_prop_updater(),
            ),
            OlProps::Marker => {
                as_updater_object::<_, component::props::types::Marker>(custom_props::Marker::new())
            }
        }
    }
}

mod custom_props {
    use super::*;

    pub use start_index::*;
    mod start_index {
        use super::*;

        /// Information about how to reference this component from an `ol`
        #[derive(Debug, Default)]
        pub struct StartIndex {}

        impl StartIndex {
            pub fn new() -> Self {
                StartIndex {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Ol)]
        struct RequiredData {
            start_attr: PropView<component::props::types::StartAttr>,
            marker: PropView<component::props::types::Marker>,
        }

        impl DataQueries for RequiredData {
            fn start_attr_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: PropSpecifier::LocalIdx(OlProps::StartAttr.local_idx()),
                }
            }
            fn marker_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: PropSpecifier::LocalIdx(OlProps::Marker.local_idx()),
                }
            }
        }

        impl PropUpdater for StartIndex {
            type PropType = component::props::types::StartIndex;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                if !required_data.start_attr.came_from_default {
                    PropCalcResult::Calculated(required_data.start_attr.value)
                } else {
                    // The default value to start counting from is `1`. However, if we have a marker `Decimal { start: 0 }`,
                    // then we should start counting at 0 instead.
                    match required_data.marker.value {
                        prop_type::ListMarker::Decimal { start } => {
                            PropCalcResult::Calculated(start as i64)
                        }
                        _ => PropCalcResult::FromDefault(1),
                    }
                }
            }
        }
    }

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
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Ol)]
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
                        PropCalcResult::Calculated(parent_depth.value + prop_type::ListDepth::Ol(0))
                    }
                    None => PropCalcResult::Calculated(prop_type::ListDepth::Ol(0)),
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
        #[owning_component(Ol)]
        struct RequiredData {
            parent_marker: Option<PropView<prop_type::ListMarker>>,
            marker_attr: PropView<component::props::types::MarkerAttr>,
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
                    prop_specifier: PropSpecifier::LocalIdx(OlProps::MarkerAttr.local_idx()),
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
                            if v.value.is_ordered() {
                                v.value.next_marker()
                            } else {
                                // Reset the marker type if switching from an unordered list
                                prop_type::ListMarker::default_ol()
                            }
                        })
                        .unwrap_or(prop_type::ListMarker::default()),
                )
            }
        }
    }
}
