use std::rc::Rc;

use super::title::Title;
use crate::components::prelude::*;
use crate::general_prop::ComponentRefProp;
use crate::general_prop::{BooleanProp, EnumProp};
use crate::props::DataQueryResults;
use crate::props::PropView;
use crate::props::UpdaterObject;
use crate::props::as_updater_object;
use crate::state::types::division_type::DivisionType;

/// The `<division>` component renders its children along with a title
#[component(name = Division)]
mod component {

    use super::*;

    enum Props {
        /// The `<title>` child of the `<division>` that contain's the division's title
        #[prop(
            value_type = PropValueType::ComponentRef,
            profile = PropProfile::Renderable,
            is_public,
            for_render
        )]
        Title,

        /// Whether the `<division>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The position of the division relative to other siblings with serial numbers.
        /// E.g. in `<division /><division />` the first would have serial number 0 and the second 1.
        #[prop(
               value_type = PropValueType::Integer,
               profile = PropProfile::SerialNumber
           )]
        SerialNumber,

        /// The code-number uniquely identifying this `<division />`. E.g. the `1.2.3`
        /// in _Section 1.2.3_.
        #[prop(
               value_type = PropValueType::String,
               profile = PropProfile::DivisionCodeNumber,
               for_render
           )]
        CodeNumber,

        /// How many levels deep this `<division /> is nested.
        #[prop(
               value_type = PropValueType::Integer,
               profile = PropProfile::DivisionDepth,
               for_render
           )]
        DivisionDepth,

        /// The type of this `<division />`. E.g. "section", "chapter", "subsection", etc.
        /// Use this prop instead of `DivisionTypeAttr`; it will correctly handle the case
        /// where the user omits the `<division type="...">` attribute.
        #[prop(
               value_type = PropValueType::DivisionType,
               profile = PropProfile::DivisionType,
               for_render
           )]
        DivisionType,

        /// The value of the `division` attribute. This is for internal use only.
        /// It is used to calculate the `DivisionType` prop, which is what external components
        /// should access.
        #[prop(
               value_type = PropValueType::DivisionType,
           )]
        DivisionTypeAttr,

        /// The label that should be used to refer to this `<division>` when
        /// the division is referred to by `<xref>`.
        #[prop(
               value_type = PropValueType::XrefLabel,
               profile = PropProfile::XrefLabel,
               for_render
           )]
        XrefLabel,

        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }

    type TypeEnumProp = EnumProp<DivisionType>;
    enum Attributes {
        /// Whether the `<division>` should be hidden.
        #[attribute(
            prop = BooleanProp,
            default = false
        )]
        Hide,

        /// The type of the division. E.g. "section", "chapter", "subsection", etc.
        #[attribute(
            prop = TypeEnumProp,
            default = DivisionType::Section
        )]
        Type,
    }
}

pub use component::Division;
pub use component::DivisionActions;
pub use component::DivisionAttributes;
pub use component::DivisionProps;
use component::attrs;
use component::props;

impl PropGetUpdater for DivisionProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            DivisionProps::Title => as_updater_object::<_, props::types::Title>(
                ComponentRefProp::new_from_last_matching_child(Title::NAME),
            ),
            DivisionProps::Hidden => {
                as_updater_object::<_, props::types::Hidden>(attrs::Hide::get_prop_updater())
            }
            DivisionProps::RenderedChildren => {
                as_updater_object::<_, props::types::RenderedChildren>(
                    custom_props::RenderedChildren::new(),
                )
            }
            DivisionProps::SerialNumber => as_updater_object::<_, props::types::SerialNumber>(
                custom_props::SerialNumberProp::new(),
            ),
            DivisionProps::CodeNumber => {
                as_updater_object::<_, props::types::CodeNumber>(custom_props::CodeNumberProp::new())
            }
            DivisionProps::DivisionDepth => as_updater_object::<_, props::types::DivisionDepth>(
                custom_props::DivisionDepth::new(),
            ),
            DivisionProps::XrefLabel => {
                as_updater_object::<_, props::types::XrefLabel>(custom_props::XrefLabel::new())
            }
            DivisionProps::DivisionType => as_updater_object::<_, props::types::DivisionType>(
                custom_props::DivisionTypeProp::new(),
            ),
            DivisionProps::DivisionTypeAttr => {
                as_updater_object::<_, props::types::DivisionType>(attrs::Type::get_prop_updater())
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
        #[derive(TestDataQueryTypes)]
        #[owning_component(Division)]
        struct RequiredData {
            serial_number: PropView<props::types::SerialNumber>,
            code_number: PropView<props::types::CodeNumber>,
            division_type: PropView<props::types::DivisionType>,
        }

        impl DataQueries for RequiredData {
            fn code_number_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: DivisionProps::CodeNumber.local_idx().into(),
                }
            }
            fn serial_number_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: DivisionProps::SerialNumber.local_idx().into(),
                }
            }
            fn division_type_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: DivisionProps::DivisionType.local_idx().into(),
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
                let label = required_data.division_type.value.to_string();
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
        #[derive(TestDataQueryTypes)]
        #[owning_component(Division)]
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
        #[derive(TestDataQueryTypes)]
        #[owning_component(Division)]
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
                    prop_specifier: DivisionProps::SerialNumber.local_idx().into(),
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
        #[derive(TestDataQueryTypes)]
        #[owning_component(Division)]
        struct RequiredData {
            siblings: PropView<prop_type::ContentRefs>,
            self_ref: PropView<prop_type::ComponentRef>,
        }

        impl DataQueries for RequiredData {
            fn self_ref_query() -> DataQuery {
                DataQuery::SelfRef
            }
            fn siblings_query() -> DataQuery {
                DataQuery::ContentRefs {
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
        #[derive(TestDataQueryTypes)]
        #[owning_component(Division)]
        struct RequiredData {
            filtered_children: PropView<prop_type::AnnotatedContentRefs>,
        }

        impl DataQueries for RequiredData {
            fn filtered_children_query() -> DataQuery {
                DataQuery::AnnotatedContentRefs {
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
            type PropType = component::props::types::RenderedChildren;

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

    pub use division_type::*;
    mod division_type {
        use super::*;

        /// The type of this division. E.g. `Section`, `Chapter`, etc..
        #[derive(Debug, Default)]
        pub struct DivisionTypeProp {}

        impl DivisionTypeProp {
            pub fn new() -> Self {
                DivisionTypeProp {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Division)]
        struct RequiredData {
            parent_division: Option<PropView<prop_type::DivisionType>>,
            division_type_attr: PropView<component::props::types::DivisionTypeAttr>,
        }

        impl DataQueries for RequiredData {
            fn division_type_attr_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: DivisionProps::DivisionTypeAttr.local_idx().into(),
                }
            }
            fn parent_division_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::DivisionType]),
                }
            }
        }

        impl PropUpdater for DivisionTypeProp {
            type PropType = component::props::types::DivisionType;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                if required_data.division_type_attr.came_from_default
                    && required_data.parent_division.is_some()
                {
                    // Infer our division type from our parent
                    return PropCalcResult::FromDefault(
                        required_data.parent_division.unwrap().value.next_division(),
                    );
                }
                PropCalcResult::Calculated(required_data.division_type_attr.value)
            }
        }
    }
}
