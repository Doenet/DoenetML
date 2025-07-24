use crate::components::prelude::*;
use crate::general_prop::PropAlias;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<li>` component is for marking items in a list (ordered or unordered).
#[component(name = Li)]
mod component {

    use super::*;
    use crate::general_prop::BooleanProp;

    enum Props {
        /// Whether the `<ol>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The number of levels deep this item is nested.
        #[prop(
            value_type = PropValueType::ListDepth,
        )]
        ParentDepth,

        /// The label for this list item. E.g. `1`, `a`, `iii`, etc.
        #[prop(
            value_type = PropValueType::String,
            for_render,
        )]
        Label,

        /// The code number for this list item. E.g. `1.a.ii`.
        #[prop(
            value_type = PropValueType::String,
            profile = PropProfile::ListCodeNumber,
        )]
        CodeNumber,

        /// The computed index of this `<li>`. This is used to compute the label of the `<li>`.
        #[prop(
            value_type = PropValueType::Integer,
        )]
        SerialNumber,

        /// The position of this `<li>` relative to its siblings.
        #[prop(
            value_type = PropValueType::Integer,
        )]
        LocalSerialNumber,

        /// The label that should be used to refer to this `<li>` when
        /// the section is referred to by `<xref>`.
        #[prop(
               value_type = PropValueType::XrefLabel,
               profile = PropProfile::XrefLabel,
           )]
        XrefLabel,

        /// The content that should be displayed when an `<xref>` to this `<li>` is clicked.
        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::XrefDisplayContent
        )]
        XrefDisplayContent,

        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<li>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Li;
pub use component::LiActions;
pub use component::LiAttributes;
pub use component::LiProps;

impl PropGetUpdater for LiProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            LiProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            LiProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
            LiProps::ParentDepth => as_updater_object::<_, component::props::types::ParentDepth>(
                custom_props::ParentDepth::new(),
            ),
            LiProps::LocalSerialNumber => as_updater_object::<
                _,
                component::props::types::LocalSerialNumber,
            >(custom_props::LocalSerialNumberProp::new()),
            LiProps::SerialNumber => as_updater_object::<_, component::props::types::SerialNumber>(
                custom_props::SerialNumberProp::new(),
            ),
            LiProps::Label => as_updater_object::<_, component::props::types::Label>(
                custom_props::LabelProp::new(),
            ),
            LiProps::CodeNumber => as_updater_object::<_, component::props::types::CodeNumber>(
                custom_props::CodeNumberProp::new(),
            ),
            LiProps::XrefLabel => as_updater_object::<_, component::props::types::XrefLabel>(
                custom_props::XrefLabel::new(),
            ),
            LiProps::XrefDisplayContent => {
                as_updater_object::<_, component::props::types::XrefDisplayContent>(PropAlias::new(
                    LiProps::RenderedChildren.local_idx(),
                ))
            }
        }
    }
}

mod custom_props {
    use super::*;

    pub use label::*;
    mod label {
        use std::rc::Rc;

        use super::*;

        /// Information about how to reference this component from an `ol`
        #[derive(Debug, Default)]
        pub struct LabelProp {}

        impl LabelProp {
            pub fn new() -> Self {
                LabelProp {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Li)]
        struct RequiredData {
            parent_marker: Option<PropView<prop_type::ListMarker>>,
            index: PropView<prop_type::Integer>,
        }

        impl DataQueries for RequiredData {
            fn parent_marker_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::ListMarker]),
                }
            }
            fn index_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: PropSpecifier::LocalIdx(LiProps::SerialNumber.local_idx()),
                }
            }
        }

        impl PropUpdater for LabelProp {
            type PropType = prop_type::String;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                let marker = required_data
                    .parent_marker
                    .map(|x| x.value)
                    .unwrap_or_default();
                let index = required_data.index.value;

                PropCalcResult::Calculated(Rc::new(marker.index_to_formatted_string(index)))
            }
        }
    }
    pub use parent_depth::*;
    mod parent_depth {
        use super::*;

        /// Information about how to reference this component from an `ol`
        #[derive(Debug, Default)]
        pub struct ParentDepth {}

        impl ParentDepth {
            pub fn new() -> Self {
                ParentDepth {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Li)]
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

        impl PropUpdater for ParentDepth {
            type PropType = prop_type::ListDepth;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                match required_data.parent_depth {
                    Some(parent_depth) => PropCalcResult::Calculated(parent_depth.value),
                    // Even if we have no parent, we will pretend to have a depth.
                    None => PropCalcResult::Calculated(prop_type::ListDepth::Ul(0)),
                }
            }
        }
    }

    pub use local_serial_number::*;
    mod local_serial_number {
        use std::rc::Rc;

        use crate::props::ContentFilter;

        use super::*;

        /// The serial number of this element. I.e., `n` where it is
        /// the `n`th component in the series.
        #[derive(Debug, Default)]
        pub struct LocalSerialNumberProp {}

        impl LocalSerialNumberProp {
            pub fn new() -> Self {
                LocalSerialNumberProp {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Li)]
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
                    filter: Rc::new(ContentFilter::IsType(Li::NAME)),
                }
            }
        }

        impl PropUpdater for LocalSerialNumberProp {
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

    pub use serial_number::*;
    mod serial_number {
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
        #[owning_component(Li)]
        struct RequiredData {
            start_index: Option<PropView<prop_type::Integer>>,
            local_serial_number: PropView<prop_type::Integer>,
        }

        impl DataQueries for RequiredData {
            fn start_index_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::ListStartIndex]),
                }
            }
            fn local_serial_number_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: PropSpecifier::LocalIdx(LiProps::LocalSerialNumber.local_idx()),
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
                let start_index = required_data.start_index.map(|x| x.value).unwrap_or(1);
                let local_serial_number = required_data.local_serial_number.value;
                PropCalcResult::Calculated(start_index + local_serial_number)
            }
        }
    }

    pub use code_number::*;
    mod code_number {
        use std::rc::Rc;

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
        #[owning_component(Li)]
        struct RequiredData {
            nearest_ancestor_code_number: Option<PropView<prop_type::String>>,
            self_label: PropView<prop_type::String>,
        }

        impl DataQueries for RequiredData {
            fn nearest_ancestor_code_number_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::ListCodeNumber]),
                }
            }
            fn self_label_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: LiProps::Label.local_idx().into(),
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
                // Our self_label already ends in a `.`, so we just concatenate the ancestors' code numbers.
                let mut code_number = required_data
                    .nearest_ancestor_code_number
                    .map(|x| (*x.value).clone())
                    .unwrap_or_default();

                if !code_number.is_empty() && !code_number.ends_with('.') {
                    code_number.push('.');
                }
                code_number.push_str(&required_data.self_label.value);

                // We should not end in a `.`
                if code_number.ends_with('.') {
                    code_number.pop();
                }

                PropCalcResult::Calculated(Rc::new(code_number))
            }
        }
    }

    pub use xref_label::*;
    mod xref_label {
        use std::rc::Rc;

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
        #[owning_component(Li)]
        struct RequiredData {
            division_code_number: Option<PropView<prop_type::String>>,
            code_number: PropView<component::props::types::CodeNumber>,
        }

        impl DataQueries for RequiredData {
            fn code_number_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: LiProps::CodeNumber.local_idx().into(),
                }
            }
            fn division_code_number_query() -> DataQuery {
                DataQuery::PickProp {
                    source: PickPropSource::NearestMatchingAncestor,
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::DivisionCodeNumber]),
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
                let label = String::from("Item");
                let mut global_ident = required_data
                    .division_code_number
                    .map(|v| v.value.to_string())
                    .unwrap_or_default();
                let local_ident = required_data.code_number.value.to_string();

                if !global_ident.is_empty() {
                    global_ident.push(':');
                }
                global_ident.push_str(&local_ident);

                PropCalcResult::Calculated(Rc::new(xref_label::XrefLabel {
                    label,
                    global_ident,
                    local_ident,
                    preferred_form: xref_label::XrefLabelPreferredForm::Local,
                }))
            }
        }
    }
}
