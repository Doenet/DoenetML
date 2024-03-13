//! An error component. The error component is processed like a regular component until rendering to `FlatDast`,
//! whereupon it is converted into a DAST error.

use crate::components::prelude::*;

#[derive(Debug, Default)]
//#[pass_through_children]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
    pub props: _ErrorProps,
}

impl _Error {
    pub fn new() -> Self {
        Self::default()
    }
}

impl ComponentNode for _Error {
    // The main reason we customize the implementation of ComponentNode
    // is to use this custom component type coming from name
    fn get_component_type(&self) -> &str {
        "_error"
    }
}

impl ComponentActions for _Error {}
impl ComponentOnAction for _Error {}
impl ComponentAttributes for _Error {}

impl ComponentVariantProps for _Error {}

impl ComponentChildren for _Error {
    fn get_rendered_children(&self, _child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return no children
        Vec::new()
    }
}

#[derive(Debug, Default)]
pub struct _ErrorProps {}

impl ComponentProps for _Error {
    fn generate_props(&self) -> Vec<Prop> {
        vec![]
    }
    fn get_prop_profile_local_prop_indices(&self) -> Vec<LocalPropIdx> {
        vec![]
    }
    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        None
    }
    fn get_for_renderer_local_prop_indices(&self) -> Vec<LocalPropIdx> {
        vec![]
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
