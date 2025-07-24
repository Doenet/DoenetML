use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<xref>` component renders its children
#[component(name = Xref)]
mod component {

    use super::*;
    use crate::general_prop::{BooleanProp, ComponentRefProp};

    enum Props {
        /// Whether the `<xref>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The component that this `<xref>` refers to.
        #[prop(
            value_type = PropValueType::ComponentRef,
            for_render,
        )]
        Referent,

        /// The display label for the `<xref>`. This label is displayed _after_
        /// any children that the `<xref>` has.
        #[prop(
            value_type = PropValueType::String,
            profile = PropProfile::String,
            for_render,
        )]
        DisplayText,

        /// When clicking on the `<xref>`, the desired behavior might be to show the content
        /// of the referent. If so, such content is stored here.
        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            for_render,
        )]
        ReferentChildren,

        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<xref>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,

        /// The item this `<xref>` refers to.
        #[attribute(prop = ComponentRefProp, default = None, preserve_refs)]
        Ref,
    }
}

pub use component::Xref;
pub use component::XrefActions;
pub use component::XrefAttributes;
pub use component::XrefProps;

impl PropGetUpdater for XrefProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            XrefProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            XrefProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
            XrefProps::Referent => as_updater_object::<_, component::props::types::Referent>(
                component::attrs::Ref::get_prop_updater(),
            ),
            XrefProps::DisplayText => as_updater_object::<_, component::props::types::DisplayText>(
                custom_props::DisplayText::new(),
            ),
            XrefProps::ReferentChildren => as_updater_object::<
                _,
                component::props::types::ReferentChildren,
            >(custom_props::ReferentChildren::new()),
        }
    }
}

mod custom_props {
    use super::*;

    pub use display_text::*;
    mod display_text {
        use super::*;
        use crate::state::types::xref_label::XrefLabelPreferredForm;
        use std::rc::Rc;

        /// Information about how to reference this component from an `xref`
        #[derive(Debug, Default)]
        pub struct DisplayText {}

        impl DisplayText {
            pub fn new() -> Self {
                DisplayText {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Xref)]
        struct RequiredData {
            rendered_children: PropView<component::props::types::RenderedChildren>,
            label: Option<PropView<prop_type::XrefLabel>>,
        }

        impl DataQueries for RequiredData {
            fn rendered_children_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: XrefProps::RenderedChildren.local_idx().into(),
                }
            }
            fn label_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::StaticComponentRef(XrefProps::Referent.local_idx()),
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::XrefLabel]),
                }
            }
        }

        impl PropUpdater for DisplayText {
            type PropType = prop_type::String;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                // If the `ref` field is not set correctly, we may fail to find the label data.
                let xref_label_data = match required_data.label {
                    None => {
                        return PropCalcResult::Calculated(Rc::new(
                            "[ERROR RESOLVING REFERENCE]".to_string(),
                        ));
                    }
                    Some(val) => val.to_owned().value,
                };
                let ident = match xref_label_data.preferred_form {
                    XrefLabelPreferredForm::Global => &xref_label_data.global_ident,
                    XrefLabelPreferredForm::Local => &xref_label_data.local_ident,
                };
                let has_children = !required_data.rendered_children.value.is_empty();

                if has_children {
                    // If there are children, the display text will follow the children, so we
                    // omit the `label` part, but we put a space in front.
                    // TODO: check if this added space is compatible with localization
                    PropCalcResult::Calculated(Rc::new(format!(" {ident}")))
                } else {
                    PropCalcResult::Calculated(Rc::new(format!(
                        "{} {}",
                        xref_label_data.label, ident
                    )))
                }
            }
        }
    }

    pub use referent_children::*;
    mod referent_children {
        use super::*;
        use std::rc::Rc;

        /// Information about how to reference this component from an `xref`
        #[derive(Debug, Default)]
        pub struct ReferentChildren {}

        impl ReferentChildren {
            pub fn new() -> Self {
                ReferentChildren {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Xref)]
        struct RequiredData {
            referent_children: Option<PropView<prop_type::AnnotatedContentRefs>>,
        }

        impl DataQueries for RequiredData {
            fn referent_children_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::StaticComponentRef(XrefProps::Referent.local_idx()),
                    prop_specifier: PropSpecifier::Matching(vec![PropProfile::XrefDisplayContent]),
                }
            }
        }

        impl PropUpdater for ReferentChildren {
            type PropType = component::props::types::ReferentChildren;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                required_data
                    .referent_children
                    .map(|val| PropCalcResult::Calculated(val.value))
                    .unwrap_or_else(|| PropCalcResult::Calculated(Rc::new(vec![].into())))
            }
        }
    }
}
