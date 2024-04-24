use std::rc::Rc;

use crate::components::prelude::*;
use crate::general_prop::ComponentRefProp;

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
            value_type = PropValueType::ComponentRef,
            profile = PropProfile::Renderable,
            is_public,
            for_render
        )]
        Title,

        /// Whether the `<section>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The position of the section relative to other siblings with serial numbers.
        /// E.g. in `<section /><section />` the first would have serial number 0 and the second 1.
        #[prop(
               value_type = PropValueType::Integer,
               profile = PropProfile::SerialNumber
           )]
        SerialNumber,

        /// The code-number uniquely identifying this `<section />`. E.g. the `1.2.3`
        /// in _Section 1.2.3_.
        #[prop(
               value_type = PropValueType::String,
               profile = PropProfile::DivisionCodeNumber,
               for_render
           )]
        CodeNumber,

        /// How many levels deep this `<section /> is nested.
        #[prop(
               value_type = PropValueType::Integer,
               profile = PropProfile::DivisionDepth,
               for_render
           )]
        DivisionDepth,

        /// The label that should be used to refer to this `<section>` when
        /// the section is referred to by `<xref>`.
        #[prop(
               value_type = PropValueType::XrefLabel,
               profile = PropProfile::XrefLabel,
           )]
        XrefLabel,

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
                ComponentRefProp::new_from_last_matching_child(Title::NAME),
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
            SectionProps::CodeNumber => {
                as_updater_object::<_, props::types::CodeNumber>(custom_props::CodeNumberProp::new())
            }
            SectionProps::DivisionDepth => as_updater_object::<_, props::types::DivisionDepth>(
                custom_props::DivisionDepth::new(),
            ),
            SectionProps::XrefLabel => {
                as_updater_object::<_, props::types::XrefLabel>(custom_props::XrefLabel::new())
            }
        }
    }
}

mod custom_props {
    use super::*;

    pub use xref_label::*;
    mod xref_label {
        use crate::state::types::xref_label;

        use super::*;

        /// Information about how to reference this component from an `xref`
        #[derive(Debug, Default)]
        pub struct XrefLabel {}

        impl XrefLabel {
            pub fn new() -> Self {
                XrefLabel {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData {
            serial_number: PropView<props::types::SerialNumber>,
            code_number: PropView<props::types::CodeNumber>,
        }

        impl DataQueries for RequiredData {
            fn code_number_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: SectionProps::CodeNumber.local_idx().into(),
                }
            }
            fn serial_number_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: SectionProps::SerialNumber.local_idx().into(),
                }
            }
        }

        impl PropUpdater for XrefLabel {
            type PropType = prop_type::XrefLabel;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                let label = String::from("Section");
                let global_ident = required_data.code_number.value.to_string();
                let local_ident = (required_data.serial_number.value + 1).to_string();

                PropCalcResult::Calculated(Rc::new(xref_label::XrefLabel {
                    label,
                    global_ident,
                    local_ident,
                    preferred_form: xref_label::XrefLabelPreferredForm::Global,
                }))
            }
        }
    }

    pub use division_depth::*;
    mod division_depth {
        use super::*;

        /// The depth of this component in the hierarchy of divisions. E.g., how many
        /// times this `<section>` is nested in another.
        #[derive(Debug, Default)]
        pub struct DivisionDepth {}

        impl DivisionDepth {
            pub fn new() -> Self {
                DivisionDepth {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData {
            nearest_ancestor_division_depth: Vec<PropView<prop_type::Integer>>,
        }

        impl DataQueries for RequiredData {
            fn nearest_ancestor_division_depth_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::DivisionDepth]),
                }
            }
        }

        impl PropUpdater for DivisionDepth {
            type PropType = prop_type::Integer;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                let self_depth = required_data
                    .nearest_ancestor_division_depth
                    .first()
                    .map_or(0, |d| d.value + 1);
                PropCalcResult::Calculated(self_depth)
            }
        }
    }

    pub use code_number::*;
    mod code_number {
        use super::*;

        /// The serial number of this element. I.e., `n` where it is
        /// the `n`th component in the series.
        #[derive(Debug, Default)]
        pub struct CodeNumberProp {}

        impl CodeNumberProp {
            pub fn new() -> Self {
                CodeNumberProp {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData {
            nearest_ancestor_code_number: Vec<PropView<prop_type::String>>,
            self_serial_number: PropView<prop_type::Integer>,
        }

        impl DataQueries for RequiredData {
            fn nearest_ancestor_code_number_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::DivisionCodeNumber]),
                }
            }
            fn self_serial_number_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: SectionProps::SerialNumber.local_idx().into(),
                }
            }
        }

        impl PropUpdater for CodeNumberProp {
            type PropType = prop_type::String;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                // Create a "." separated string of our ancestors' code number followed by our serial number.
                let code_number = required_data
                    .nearest_ancestor_code_number
                    .iter()
                    .map(|code_number| code_number.value.to_string())
                    .chain(std::iter::once(
                        (required_data.self_serial_number.value + 1).to_string(),
                    ))
                    .collect::<Vec<_>>()
                    .join(".");

                PropCalcResult::Calculated(Rc::new(code_number))
            }
        }
    }

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
            self_ref: PropView<prop_type::ComponentRef>,
        }

        impl DataQueries for RequiredData {
            fn self_ref_query() -> DataQuery {
                DataQuery::SelfRef
            }
            fn siblings_query() -> DataQuery {
                DataQuery::ComponentRefs {
                    container: PropSource::Parent,
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
        }

        impl DataQueries for RequiredData {
            fn filtered_children_query() -> DataQuery {
                DataQuery::ComponentRefs {
                    container: PropSource::Me,
                    filter: Rc::new(Op::And(
                        // This is what would be normally included in rendered children
                        Op::Or(
                            // Keep things without a "hidden" prop
                            OpNot(ContentFilter::HasPropMatchingProfile(PropProfile::Hidden)),
                            // Keep things with a "hidden != true" prop
                            ContentFilter::HasPropMatchingProfileAndCondition(
                                PropProfile::Hidden,
                                Cond::Eq(PropValue::Boolean(false)),
                            ),
                        ),
                        // We exclude any `<title>` elements.
                        OpNot(ContentFilter::IsType(Title::NAME)),
                    )),
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
                PropCalcResult::Calculated(Rc::new(
                    required_data.filtered_children.value.as_ref().clone(),
                ))
            }
        }
    }
}
