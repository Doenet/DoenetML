//! An error component. The error component is processed like a regular component until rendering to `FlatDast`,
//! whereupon it is converted into a DAST error.

use crate::{
    components::prelude::*,
    props::{ForRenderOutputs, RenderContext, UpdaterObject},
};

#[derive(Debug, Default, Clone)]
pub struct _Error {
    pub message: String,
}

impl _Error {
    pub fn new() -> Self {
        Self::default()
    }
}

impl ComponentNode for _Error {
    // The main reason we customize the implementation of ComponentNode
    // is to use this custom component type coming from name
    fn get_component_type(&self) -> &'static str {
        "_error"
    }
}

impl ComponentActions for _Error {}
impl ComponentOnAction for _Error {}
impl ComponentAttributes for _Error {}

#[derive(Debug, Default)]
pub struct _ErrorProps {}

impl ComponentProps for _Error {
    fn generate_props(&self) -> Vec<PropDefinition> {
        vec![]
    }
    fn get_prop_profile_local_prop_indices(&self) -> impl Iterator<Item = LocalPropIdx> {
        vec![].into_iter()
    }
    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        None
    }
    fn get_for_render_local_prop_indices(
        &self,
        _render_context: RenderContext,
    ) -> impl Iterator<Item = LocalPropIdx> {
        vec![].into_iter()
    }
    fn get_local_prop_index_from_name(&self, _name: &str) -> Option<LocalPropIdx> {
        None
    }
    fn get_public_local_prop_index_from_name_case_insensitive(
        &self,
        _name: &str,
    ) -> Option<LocalPropIdx> {
        None
    }
}

impl ComponentVariantProps for _Error {
    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        None
    }
    fn get_num_props(&self) -> usize {
        0
    }
    fn get_prop_for_render_outputs(&self, _local_prop_idx: LocalPropIdx) -> ForRenderOutputs {
        panic!("No props on _Error")
    }
    fn get_prop_name(&self, _local_prop_idx: LocalPropIdx) -> &'static str {
        panic!("No props on _Error")
    }
    fn get_prop_profile(&self, _local_prop_idx: LocalPropIdx) -> Option<PropProfile> {
        None
    }
    fn get_prop_value_type(&self, _local_prop_idx: LocalPropIdx) -> PropValueType {
        panic!("No props on _Error")
    }
    fn get_prop_is_public(&self, _local_prop_idx: LocalPropIdx) -> bool {
        panic!("No props on _Error")
    }
    fn get_prop_names(&self) -> &'static [&'static str] {
        &[]
    }
    fn get_prop_updater_object(&self, _local_prop_idx: LocalPropIdx) -> UpdaterObject {
        panic!("No props on _Error")
    }
}
