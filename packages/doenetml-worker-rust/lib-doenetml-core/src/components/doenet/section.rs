use std::rc::Rc;

use crate::components::prelude::*;
use crate::general_prop::ElementRefProp;

use super::title::Title;
use crate::props::as_updater_object;
use crate::props::DataQueryResults;
use crate::props::PropView;
use crate::props::UpdaterObject;

/// The `<section>` component renders its children along with a title
#[component(name = Section)]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// The `<title>` child of the `<section>` that contain's the section's title
        #[prop(
            value_type = PropValueType::ElementRef,
            is_public,
        )]
        Title,

        /// Whether the `<section>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The position of the section relative to other siblings with serial numbers.
        /// E.g. in `<section /><section />` the first would have serial number 1 and the second 2.
        #[prop(
               value_type = PropValueType::Integer,
               profile = PropProfile::SerialNumber
           )]
        SerialNumber,

        //SelfRef,
        #[prop(
            value_type = PropValueType::ContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<section>` should be hidden.
        #[attribute(
            prop = BooleanProp,
            default = false
        )]
        Hide,
    }

    pub mod prop_traits {
        pub use super::*;

        /// Implementing this trait will automatically implement the `PropUpdater` trait.
        /// It will also required you to implement `PropUpdaterTyped` for the correct type.
        ///
        /// If you need full (untyped) control over `PropUpdater`, you can implement `PropUpdater` directly.
        /// **Note**: Component authors should always implement `PropUpdaterTyped` instead of `PropUpdater`.
        pub trait Hidden: PropUpdater<PropType = prop_type::Boolean> {}
    }
}

use component::attrs;
use component::props;
pub use component::Section;
pub use component::SectionActions;
pub use component::SectionAttributes;
pub use component::SectionProps;

impl PropGetUpdater for SectionProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            SectionProps::Title => as_updater_object::<_, props::types::Title>(
                ElementRefProp::new_from_last_matching_child(Title::NAME),
            ),
            SectionProps::Hidden => {
                as_updater_object::<_, props::types::Hidden>(attrs::Hide::get_prop_updater())
            }
            SectionProps::RenderedChildren => {
                as_updater_object::<_, props::types::RenderedChildren>(
                    custom_props::RenderedChildren::new(),
                )
            }
            SectionProps::SerialNumber => as_updater_object::<_, props::types::SerialNumber>(
                custom_props::SerialNumberProp::new(),
            ),
        }
    }
}

mod custom_props {
    use super::*;

    pub use serial_number::*;
    mod serial_number {
        use crate::props::ContentFilter;

        use super::*;

        /// The serial number of this element. I.e., `n` where it is
        /// the `n`th component in the series.
        #[derive(Debug, Default)]
        pub struct SerialNumberProp {}

        impl SerialNumberProp {
            pub fn new() -> Self {
                SerialNumberProp {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData {
            siblings: PropView<prop_type::ContentRefs>,
            self_ref: PropView<prop_type::ElementRef>,
        }

        impl DataQueries for RequiredData {
            fn self_ref_query() -> DataQuery {
                DataQuery::SelfRef
            }
            fn siblings_query() -> DataQuery {
                DataQuery::ComponentRefs {
                    container: PropComponent::Parent,
                    filter: Rc::new(ContentFilter::HasPropMatchingProfile(
                        PropProfile::SerialNumber,
                    )),
                }
            }
        }

        impl PropUpdater for SerialNumberProp {
            type PropType = prop_type::Integer;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                let self_ref = required_data
                    .self_ref
                    .value
                    .expect("SelfRef must always be valid")
                    .as_content_ref();
                // Find the location of `self` in the list of siblings
                let serial_number = required_data
                    .siblings
                    .value
                    .as_slice()
                    .iter()
                    .position(|sibling| sibling == &self_ref)
                    .expect("Self must be in the list of siblings");
                PropCalcResult::Calculated(serial_number as i64)
            }
        }
    }

    pub use rendered_children::*;
    mod rendered_children {
        use crate::props::{Cond, ContentFilter, Op, OpNot};

        use super::*;

        /// The children that this component renders.
        #[derive(Debug, Default)]
        pub struct RenderedChildren {}

        impl RenderedChildren {
            pub fn new() -> Self {
                RenderedChildren {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData {
            filtered_children: PropView<prop_type::ContentRefs>,
            title: PropView<prop_type::ElementRef>,
        }

        impl DataQueries for RequiredData {
            fn filtered_children_query() -> DataQuery {
                DataQuery::ComponentRefs {
                    container: PropComponent::Me,
                    filter: Rc::new(Op::And(
                        // This is what would be normally included in rendered children
                        Op::Or(
                            // Keep things without a "hidden" prop
                            OpNot(ContentFilter::HasPropMatchingProfile(PropProfile::Hidden)),
                            // Keep things with a "hidden != true" prop
                            ContentFilter::HasPropMatchingProfileAndCondition(
                                PropProfile::Hidden,
                                Cond::NotEq(PropValue::Boolean(true)),
                            ),
                        ),
                        // We exclude any `<title>` elements.
                        OpNot(ContentFilter::IsType(Title::NAME)),
                    )),
                }
            }
            fn title_query() -> DataQuery {
                DataQuery::Prop {
                    component: PropComponent::Me,
                    prop_specifier: SectionProps::Title.local_idx().into(),
                }
            }
        }

        impl PropUpdater for RenderedChildren {
            type PropType = prop_type::ContentRefs;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                let title_element_refs = required_data.title.value;

                let non_title_children = required_data.filtered_children.value.as_slice();

                let mut children = title_element_refs.map(|n| vec![n.into()]).unwrap_or(vec![]);
                children.extend(non_title_children);

                PropCalcResult::Calculated(Rc::new(children.into()))
            }
        }
    }
}
