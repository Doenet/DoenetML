//! A DoenetML component. A component is a collection of props combined with render information.
//! All information in the DAST that is sent to the UI comes from components.

use std::collections::HashMap;
use std::str::FromStr;

use crate::dast::Position as DastPosition;
use crate::state::{ComponentProps, PropIdx};

use super::_error::_Error;
use super::_external::_External;
use super::component_enum::ComponentEnum;
use super::prelude::{ComponentIdx, Extending, FlatAttribute};
use super::{ComponentAttributes, ComponentNode, ComponentProfile};

/// A DoenetML component. A component is a collection of props combined with render information.
#[derive(Debug)]
pub struct Component {
    /// Data common to all components.
    pub common: ComponentCommonData,
    /// Data about the specific type of this component.
    pub variant: ComponentEnum,
}

/// A set of fields that are common to all DoenetMLcomponents.
#[derive(Debug, Default)]
pub struct ComponentCommonData {
    /// The index of this component, which is its index
    /// in the `components` vector on core.
    pub idx: ComponentIdx,

    /// The index of this component's parent
    pub parent: Option<ComponentIdx>,

    /// The position of the component in the original DoenetML string
    pub position: Option<DastPosition>,

    /// Any remaining attributes that appeared in the DoenetML
    /// but where not recognized component
    pub unrecognized_attributes: HashMap<String, FlatAttribute>,
}

pub trait ComponentCommon {
    fn get_common_data(&self) -> &ComponentCommonData;

    /// Get the index of the component, which is its index in the `components` vector of `DoenetMLCore`.
    fn get_idx(&self) -> ComponentIdx {
        self.get_common_data().idx
    }
    /// Get the index of the parent node
    fn get_parent(&self) -> Option<ComponentIdx> {
        self.get_common_data().parent
    }

    /// Get the position of this component in the original DoenetML string
    fn get_position(&self) -> Option<&DastPosition> {
        self.get_common_data().position.as_ref()
    }

    /// Get the hash map of all attributes that have not been recognized by its parent component.
    fn get_unrecognized_attributes(&self) -> &HashMap<String, FlatAttribute> {
        &self.get_common_data().unrecognized_attributes
    }
}

impl ComponentProps for Component {
    fn generate_props(&self) -> Vec<crate::new_core::props::Prop> {
        self.variant.generate_props()
    }

    fn get_local_prop_index_from_name(&self, name: &str) -> Option<PropIdx> {
        self.variant.get_local_prop_index_from_name(name)
    }

    fn get_public_local_prop_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<PropIdx> {
        self.variant
            .get_public_local_prop_index_from_name_case_insensitive(name)
    }

    fn get_component_profile_local_prop_indices(&self) -> Vec<PropIdx> {
        self.variant.get_component_profile_local_prop_indices()
    }

    fn get_default_prop_local_index(&self) -> Option<PropIdx> {
        self.variant.get_default_prop_local_index()
    }

    fn get_for_renderer_local_prop_indices(&self) -> Vec<PropIdx> {
        self.variant.get_for_renderer_local_prop_indices()
    }
}

impl ComponentNode for Component {
    fn get_component_type(&self) -> &str {
        self.variant.get_component_type()
    }
    fn ref_transmutes_to(&self) -> Option<&'static str> {
        self.variant.ref_transmutes_to()
    }
    fn extend_via_default_prop(&self) -> bool {
        self.variant.extend_via_default_prop()
    }
    fn provided_profiles(&self) -> Vec<(ComponentProfile, PropIdx)> {
        self.variant.provided_profiles()
    }
}

impl ComponentAttributes for Component {
    fn get_attribute_names(&self) -> Vec<&'static str> {
        self.variant.get_attribute_names()
    }
}

impl ComponentCommon for Component {
    fn get_common_data(&self) -> &ComponentCommonData {
        &self.common
    }
}

impl Component {
    /// Create a new component instance. The `variant` field is based on the
    /// `component_type` string. `common` is data coming from the DAST related to
    /// this component.
    pub fn from_tag_name(tag_name: &str, common: ComponentCommonData) -> Self {
        let variant = ComponentEnum::from_str(tag_name).unwrap_or_else(|_| {
            // If we didn't find a match, then create a component of type external
            ComponentEnum::_External(_External {
                name: tag_name.to_string(),
                ..Default::default()
            })
        });
        Self { common, variant }
    }

    pub fn new_error(message: String, common: ComponentCommonData) -> Self {
        let variant = ComponentEnum::_Error(_Error {
            message,
            ..Default::default()
        });
        Self { common, variant }
    }
}
