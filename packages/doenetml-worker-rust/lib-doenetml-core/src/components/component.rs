//! A DoenetML component. A component is a collection of props combined with render information.
//! All information in the DAST that is sent to the UI comes from components.

use std::collections::HashMap;
use std::str::FromStr;

use crate::core::props::{PropDefinition, PropDefinitionMeta, PropProfile};
use crate::dast::Position as DastPosition;
use crate::props::RenderContext;

use super::_error::_Error;
use super::_external::_External;
use super::component_enum::ComponentEnum;
use super::prelude::{ComponentIdx, FlatAttribute};
use super::types::{ActionQueryProp, LocalPropIdx, PropPointer, UpdateFromAction};
use super::{
    ActionsEnum, ComponentActions, ComponentAttributes, ComponentNode, ComponentOnAction,
    ComponentProps, ComponentVariantProps,
};

/// A DoenetML component. A component is a collection of props combined with render information.
#[derive(Debug, Clone)]
pub struct Component {
    /// Data common to all components.
    pub common: ComponentCommonData,
    /// Data about the specific type of this component.
    pub variant: ComponentEnum,
}

/// A set of fields that are common to all DoenetMLcomponents.
#[derive(Debug, Default, Clone)]
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
    fn generate_props(&self) -> Vec<crate::core::props::PropDefinition> {
        let component_idx = self.get_idx();
        (0..self.variant.get_num_props())
            .map(|local_prop_idx| {
                let local_prop_idx = LocalPropIdx::new(local_prop_idx);
                PropDefinition {
                    meta: PropDefinitionMeta {
                        name: self.variant.get_prop_name(local_prop_idx),
                        for_render: self.variant.get_prop_for_render_outputs(local_prop_idx),
                        profile: self.variant.get_prop_profile(local_prop_idx),
                        prop_pointer: PropPointer {
                            component_idx,
                            local_prop_idx,
                        },
                        public: self.variant.get_prop_is_public(local_prop_idx),
                    },
                    updater: self.variant.get_prop_updater_object(local_prop_idx),
                    variant: self.variant.get_prop_value_type(local_prop_idx),
                }
            })
            .collect()
    }

    fn get_local_prop_index_from_name(&self, name: &str) -> Option<LocalPropIdx> {
        self.variant
            .get_prop_names()
            .iter()
            .position(|&x| x == name)
            .map(LocalPropIdx::new)
    }

    fn get_public_local_prop_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<LocalPropIdx> {
        self.variant
            .get_prop_names()
            .iter()
            .position(|&x| x.eq_ignore_ascii_case(name))
            .map(LocalPropIdx::new)
    }

    fn get_prop_profile_local_prop_indices(&self) -> impl Iterator<Item = LocalPropIdx> {
        (0..self.variant.get_num_props()).filter_map(|i| {
            self.variant
                .get_prop_profile(LocalPropIdx::new(i))
                .map(|_| LocalPropIdx::new(i))
        })
    }

    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        self.variant.get_default_prop_local_index()
    }

    fn get_for_render_local_prop_indices(
        &self,
        render_context: RenderContext,
    ) -> impl Iterator<Item = LocalPropIdx> {
        (0..self.variant.get_num_props()).filter_map(move |i| {
            let for_render = self
                .variant
                .get_prop_for_render_outputs(LocalPropIdx::new(i));

            let rendered_in_either = match render_context {
                RenderContext::InGraph => for_render.in_graph,
                RenderContext::InText => for_render.in_text,
            };

            rendered_in_either.then_some(LocalPropIdx::new(i))
        })
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
    fn provided_profiles(&self) -> Vec<(PropProfile, LocalPropIdx)> {
        (0..self.variant.get_num_props())
            .flat_map(|local_prop_idx| {
                let local_prop_idx = LocalPropIdx::new(local_prop_idx);
                self.variant
                    .get_prop_profile(local_prop_idx)
                    .map(|profile| (profile, local_prop_idx))
            })
            .collect()
    }
}

impl ComponentAttributes for Component {
    fn get_attribute_names(&self) -> Vec<&'static str> {
        self.variant.get_attribute_names()
    }
    fn get_preserve_ref_attribute_indices(&self) -> &[usize] {
        self.variant.get_preserve_ref_attribute_indices()
    }
}

impl ComponentCommon for Component {
    fn get_common_data(&self) -> &ComponentCommonData {
        &self.common
    }
}

impl ComponentActions for Component {
    fn get_action_names(&self) -> &'static [&'static str] {
        self.variant.get_action_names()
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
            })
        });
        Self { common, variant }
    }

    /// Create a new `_Error` component instance.
    pub fn new_error(message: String, common: ComponentCommonData) -> Self {
        let variant = ComponentEnum::_Error(_Error { message });
        Self { common, variant }
    }

    /// Set `self.common.unrecognized_attributes`.
    pub fn set_unrecognized_attributes(
        &mut self,
        unused_attributes: HashMap<String, FlatAttribute>,
    ) {
        self.common.unrecognized_attributes = unused_attributes;
    }

    /// Returns the first prop that matches a profile in `profiles`.
    pub fn get_prop_by_profile(&self, profiles: &[PropProfile]) -> Option<LocalPropIdx> {
        self.provided_profiles()
            .into_iter()
            .find_map(|(profile, local_prop_idx)| {
                if profiles.contains(&profile) {
                    Some(local_prop_idx)
                } else {
                    None
                }
            })
    }
}

impl ComponentOnAction for Component {
    fn on_action(
        &self,
        action: ActionsEnum,
        query_prop: ActionQueryProp,
    ) -> Result<Vec<UpdateFromAction>, String> {
        self.variant.on_action(action, query_prop)
    }
}
